import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreatePaymentDto, PaymentCreatePayload, PaymentDto, PaymentDtoMadeByParent, WithdrawPaymentPayload } from "src/interfaces/payment.interface";
import { BankAccount } from "src/schemas/BankAccount.schema";
import { Child } from "src/schemas/Child.schema";
import { Collection } from "src/schemas/Collection.schema";
import { Parent } from "src/schemas/Parent.schema";
import { Payment } from "src/schemas/Payment.schema";

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
        @InjectModel(Collection.name) private readonly collectionModel: Model<Collection>,
        @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
        @InjectModel(Child.name) private readonly childModel: Model<Child>,
        @InjectModel(BankAccount.name) private readonly bankAccountModel: Model<BankAccount>,
    ) {}

    async get(parentId: string): Promise<PaymentDto[]> {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }

            const myChildren = await this.childModel.find({ parent: parent._id })

            const myCollections = await this.collectionModel.find({
                class: { $in: myChildren.map((child) => child.class) },
            });            

            const payments = await this.paymentModel.find({
                collection: { $in: myCollections.map((collection) => collection._id) },
            }).populate<{ collection: Collection }>('collection')
            .populate<{ child: Child }>('child')
            .populate<{ parent: Parent }>('parent', '-password');

            return payments;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to get collections: ${error.message}`);
        }
    }

    async getMadeByParent(parentId: string): Promise<PaymentDtoMadeByParent[]> {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            
            const payments = await this.paymentModel.find({
                parent: parent._id,
            }).populate<{ collection: Collection }>('collection')
            .populate<{ child: Child }>('child');

            return payments;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to get collections: ${error.message}`);
        }
    }

    async create(paymentCreatePayload: PaymentCreatePayload, parentId: string): Promise<CreatePaymentDto> {
        try {
            this.validatePaymentCreatePayload(paymentCreatePayload);

            const [
                parent,
                collection,
                child,
                bankAccount,
            ] = await this.findRelatedEntitiesCreatePayload(paymentCreatePayload, parentId);

            this.validateRelatedEntitiesCreatePayload(parent, collection, child, bankAccount, paymentCreatePayload);

            if (paymentCreatePayload.amount > 0) {
                const paymentStartString = paymentCreatePayload.amount > 0 ? 'Payment' : 'Payout';
                const payment = await this.paymentModel.create({
                    ...paymentCreatePayload,
                    collection: collection._id,
                    child: child._id,
                    parent: parent._id,
                    description: `${paymentStartString} for ${child.firstName} ${child.lastName},
                        for ${collection.title} collection`
                });

                await this.bankAccountModel.updateOne(
                    { _id: bankAccount._id },
                    { $inc: { balance: paymentCreatePayload.amount } }
                );

                return payment;
            }
            return await this.paymentModel.create({
                ...paymentCreatePayload,
                collection: collection._id,
                child: null,
                parent: parent._id,
                description: `Payout made by the treasurer ${parent.firstName} ${parent.lastName},
                    for ${collection.title} collection`
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to create payment: ${error.message}`);
        }
    }

    async withdraw(withdrawPaymentPayload: WithdrawPaymentPayload, parentId: string): Promise<Payment> {
        try {
            this.validateWithdrawPaymentPayload(withdrawPaymentPayload);

            const payment = await this.paymentModel.findOne({
                _id: withdrawPaymentPayload.paymentId,
            });
            if (!payment) {
                throw new NotFoundException('Payment not found');
            }

            const [
                parent,
                collection,
                child,
                bankAccount,
            ] = await this.findRelatedEntitiesCreatePayload(
                {
                    collectionId: payment.collection.toString(),
                    childId: payment.child.toString(),
                },
                parentId
            );

            this.validateRelatedEntitiesWithdrawPayload(parent, collection, child, bankAccount, payment);

            const previousPaymentObj = payment.toObject({
                transform: (doc, ret) => {
                    delete ret._id;
                    return ret;
                },
            });

            const withdrawnPayment = await this.paymentModel.create({
                ...previousPaymentObj,
                amount: -payment.amount,
            });

            await this.bankAccountModel.updateOne(
                { _id: bankAccount._id },
                { $inc: { balance: -payment.amount } }
            );

            return withdrawnPayment;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to withdraw payment: ${error.message}`);
        }
    }

    private findRelatedEntitiesCreatePayload(
        paymentCreatePayload: Omit<PaymentCreatePayload, 'amount'>,
        parentId: string
    ) {
        return Promise.all([
            this.parentModel.findById(parentId),
            this.collectionModel.findById(paymentCreatePayload.collectionId),
            this.childModel.findById(paymentCreatePayload.childId),
            this.bankAccountModel.findOne({
                owner: Types.ObjectId.createFromHexString(paymentCreatePayload.collectionId),
            }),
        ]);
    }

    private validatePaymentCreatePayload(paymentCreatePayload: PaymentCreatePayload) {
        if (!paymentCreatePayload.collectionId) {
            throw new NotFoundException('Collection ID is required');
        } else if (!paymentCreatePayload.childId) {
            throw new NotFoundException('Child ID is required');
        } else if (!paymentCreatePayload.amount) {
            throw new NotFoundException('Amount is required');
        } else if (paymentCreatePayload.amount === 0) {
            throw new NotFoundException('Amount must be greater than 0');
        }
    }

    private validateRelatedEntitiesCreatePayload(
        parent: Parent | null,
        collection: Collection | null,
        child: Child | null,
        bankAccount: BankAccount | null,
        paymentCreatePayload: PaymentCreatePayload
    ) {
        if (!parent) {
            throw new NotFoundException('Parent not found');
        } else if (!collection) {
            throw new NotFoundException('Collection not found');
        } else if (!child && parent._id.toString() !== collection.creator.toString()) {
            throw new NotFoundException('Child not found');
        } else if (!bankAccount) {
            throw new NotFoundException('Bank account not found');
        }

        if (collection.startDate.getTime() > Date.now() || collection.endDate.getTime() < Date.now()) {
            throw new NotFoundException('Collection is not active');
        } else if (collection.class.toString() !== child.class.toString()) {
            throw new NotFoundException('Child not in the same class as collection');
        } else if (paymentCreatePayload.amount < 0 && collection.creator.toString() !== child.parent.toString()) {
            throw new NotFoundException('Only creator of collection can withdraw money');
        } else if (paymentCreatePayload.amount < 0 && (-paymentCreatePayload.amount > bankAccount.balance)) {
            throw new NotFoundException('Insufficient funds');
        }
    }

    private validateRelatedEntitiesWithdrawPayload(
        parent: Parent | null,
        collection: Collection | null,
        child: Child | null,
        bankAccount: BankAccount | null,
        payment: Payment | null
    ) {
        if (!parent) {
            throw new NotFoundException('Parent not found');
        } else if (!collection) {
            throw new NotFoundException('Collection not found');
        } else if (!child) {
            throw new NotFoundException('Child not found');
        } else if (!bankAccount) {
            throw new NotFoundException('Bank account not found');
        }

        if (collection.startDate.getTime() > Date.now() || collection.endDate.getTime() < Date.now()) {
            throw new NotFoundException('Collection is not active');
        } else if (collection.class.toString() !== child.class.toString()) {
            throw new NotFoundException('Child not in the same class as collection');
        } else if (payment.amount > bankAccount.balance) {
            throw new NotFoundException('Insufficient funds');
        }
    }

    private validateWithdrawPaymentPayload(withdrawPaymentPayload: WithdrawPaymentPayload) {
        if (!withdrawPaymentPayload.paymentId) {
            throw new NotFoundException('Payment ID is required');
        }
    }
}