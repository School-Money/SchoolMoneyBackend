import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionPayload, CollectionUpdate, GetCollectionDetails } from 'src/interfaces/collection.interface';
import { BankAccount } from 'src/schemas/BankAccount.schema';
import { Child } from 'src/schemas/Child.schema';
import { Class } from 'src/schemas/Class.schema';
import { Collection } from 'src/schemas/Collection.schema';
import { Parent, ParentDocument } from 'src/schemas/Parent.schema';
import { Payment } from 'src/schemas/Payment.schema';

@Injectable()
export class CollectionService {
    private readonly logoUrl: string =
        `https://res.cloudinary.com/${this.configService.get<string>('CLOUDINARY_CLOUD_NAME')}/image/upload/v1734099330/default-logo.png`;

    constructor(
        @InjectModel(Collection.name)
        private readonly collectionModel: Model<Collection>,
        @InjectModel(Parent.name)
        private readonly parentModel: Model<Parent>,
        @InjectModel(Class.name)
        private readonly classModel: Model<Class>,
        @InjectModel(Child.name)
        private readonly childModel: Model<Child>,
        @InjectModel(BankAccount.name)
        private readonly bankAccountModel: Model<BankAccount>,
        @InjectModel(Payment.name)
        private readonly paymentModel: Model<Payment>,
        private readonly configService: ConfigService,
    ) {}

    async create(payload: CollectionPayload, parentId: string): Promise<Collection> {
        try {
            if (payload.startDate >= payload.endDate) {
                throw new BadRequestException('Start date cannot be greater than end date');
            }

            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }

            const classDoc = await this.classModel.findById(payload.classId);
            if (!classDoc) {
                throw new NotFoundException('Class not found');
            }

            const bankAccount = await this.bankAccountModel.create({});
            if (!bankAccount) {
                throw new BadRequestException('Failed to create bank account');
            }

            const newCollection = await this.collectionModel.create({
                ...payload,
                startDate: new Date(payload.startDate * 1000),
                endDate: new Date(payload.endDate * 1000),
                creator: parent._id,
                class: classDoc._id,
                bankAccount: bankAccount._id,
                logo: this.logoUrl,
            });

            await this.bankAccountModel.updateOne({ _id: bankAccount._id }, { owner: newCollection._id });

            return newCollection;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Database operation failed: ${error.message}`);
        }
    }

    async updateCollection(payload: CollectionUpdate, parentId: string): Promise<Collection> {
        try {
            if (payload.startDate >= payload.endDate) {
                throw new BadRequestException('Start date cannot be greater than end date');
            }

            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }

            const collection = await this.collectionModel.findById(payload.collectionId);
            if (!collection || collection.isBlocked) {
                throw new NotFoundException('Collection not found');
            }

            if (collection.creator.toString() !== parent._id.toString()) {
                throw new UnauthorizedException('You are not the creator of this collection');
            }

            await collection.updateOne({
                ...payload,
                logo: collection.logo,
            });

            return collection;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Database operation failed: ${error.message}`);
        }
    }

    async getCollections(parentId: string) {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }

            const parentChildren = await this.childModel.find({ parent: parent._id });
            if (!parentChildren.length) {
                throw new NotFoundException('No child found for this parent');
            }

            const parentChildClasses = parentChildren.map((child) => child.class);
            if (!parentChildClasses.length) {
                throw new NotFoundException('No class found for this parent');
            }

            const collections = await this.collectionModel.find({
                class: {
                    $in: parentChildClasses,
                },
            }).populate<{class: Class}>('class');

            const collectionsWithCurrentAmount = await Promise.all(
                collections.map(async (collection) => {
                    const bankAccount = await this.bankAccountModel.findById(collection.bankAccount);
                    return {
                        ...collection.toObject(),
                        currentAmount: bankAccount.balance,
                    };
                }),
            );

            return collectionsWithCurrentAmount;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Database operation failed: ${error.message}`);
        }
    }

    async getCollectionDetails(collectionId: string, parentId: string): Promise<GetCollectionDetails> {
        try {
            const parent = await this.parentModel.findById(parentId);
            const collection = await this.collectionModel
                .findById(collectionId)
                .populate<{ creator: ParentDocument }>('creator', '-password');
            const payments = await this.paymentModel
                .find({ collection: collection._id })
                .populate('parent', '-password')
                .populate('child');

            if (!parent) {
                throw new NotFoundException('Parent not found');
            } else if (!collection) {
                throw new NotFoundException('Collection not found');
            }

            const bankAccount = await this.bankAccountModel.findById(collection.bankAccount);
            const classDoc = await this.classModel.findById(collection.class);
            const childrenInClass = await this.childModel.find({ class: classDoc._id });
            const parentChildren = childrenInClass.filter((child) => child.parent.toString() === parent._id.toString());
            if (!bankAccount) {
                throw new NotFoundException('Bank account not found');
            } else if (!classDoc) {
                throw new NotFoundException('Class not found');
            } else if (!parentChildren.length) {
                throw new NotFoundException('No child found for this parent');
            } else if (!(parentChildren.some((child) => child.class.toHexString() === classDoc._id.toHexString()) || collection.creator._id === parent._id)) {
                throw new BadRequestException('Parent has no children in this class');
            }

            return {
                _id: collection._id.toString(),
                class: classDoc,
                payments: payments.map((payment) => ({
                    ...payment.toObject(),
                    withdrawable: payment.parent._id.toString() === parent._id.toString() && !payment.withdrawn,
                })),
                creator: collection.creator,
                title: collection.title,
                description: collection.description,
                logo: collection.logo,
                startDate: collection.startDate,
                endDate: collection.endDate,
                targetAmount: collection.targetAmount,
                currentAmount: bankAccount.balance,
                isBlocked: collection.isBlocked,
                children: childrenInClass,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Database operation failed: ${error.message}`);
        }
    }

    async closeCollection(collectionId: string, parentId: string): Promise<Collection> {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }

            const collection = await this.collectionModel.findById(collectionId);
            if (!collection) {
                throw new NotFoundException('Collection not found');
            }

            if (collection.creator.toString() !== parent._id.toString()) {
                throw new UnauthorizedException('You are not the creator of this collection');
            }

            collection.endDate = new Date();
            await collection.save();

            return collection;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Database operation failed: ${error.message}`);
        }
    }
}
