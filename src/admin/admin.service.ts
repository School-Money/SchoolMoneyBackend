import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetParentsDto } from 'src/interfaces/admin.interface';
import { Admin } from 'src/schemas/Admin.schema';
import { BankAccount } from 'src/schemas/BankAccount.schema';
import { Child, ChildDocument } from 'src/schemas/Child.schema';
import { Class } from 'src/schemas/Class.schema';
import { Collection } from 'src/schemas/Collection.schema';
import { Parent } from 'src/schemas/Parent.schema';
import { Payment } from 'src/schemas/Payment.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
        @InjectModel(BankAccount.name)
        private readonly bankAccountModel: Model<BankAccount>,
        @InjectModel(Child.name) private readonly childModel: Model<Child>,
        @InjectModel(Class.name) private readonly classModel: Model<Class>,
        @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
        @InjectModel(Collection.name) private readonly collectionModel: Model<Collection>,
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    ) {}

    async getParents(): Promise<GetParentsDto[]> {
        const [parents, classes, admins] = await Promise.all([
            this.parentModel.find(),
            this.classModel.find(),
            this.adminModel.find(),
        ]);

        const parentsNotAdmins = parents.filter(
            (parent) => !admins.some((admin) => admin.parent.toString() === parent._id.toString()),
        );
        if (!parentsNotAdmins.length) {
            return [];
        }

        return parentsNotAdmins.map((parent) => {
            return {
                ...parent.toObject(),
                isTreasurer: classes.some((classItem) => classItem.treasurer.toString() === parent._id.toString()),
            };
        });
    }

    async switchParentBlockedStatus(parentId: string): Promise<void> {
        const parent = await this.parentModel.findById(parentId);
        if (!parent) {
            return;
        }
        await parent.updateOne({ isBlocked: !parent.isBlocked });
    }

    async getClasses(): Promise<Class[]> {
        return this.classModel.find();
    }

    async getCollections(): Promise<Collection[]> {
        return this.collectionModel.find();
    }

    async getCollectionsForClass(classId: string): Promise<Collection[]> {
        return this.collectionModel.find({ class: Types.ObjectId.createFromHexString(classId) });
    }

    async switchCollectionBlockedStatus(collectionId: string): Promise<void> {
        const collection = await this.collectionModel.findById(collectionId);
        if (!collection) {
            return;
        }
        await this.paymentModel.updateMany({ collection: collection._id }, { isBlocked: !collection.isBlocked });
    }

    async getBankAccounts(): Promise<BankAccount[]> {
        return this.bankAccountModel.find();
    }

    async getChildrenForCollection(collectionId: string): Promise<Child[]> {
        const payments = await this.paymentModel
            .find({ collection: Types.ObjectId.createFromHexString(collectionId) })
            .populate<{ child: ChildDocument }>('child');

        const uniqueChildrenMap = new Map<string, ChildDocument>();
        payments.forEach((payment) => {
            const child = payment.child;
            if (child && !uniqueChildrenMap.has(child._id.toString())) {
                uniqueChildrenMap.set(child._id.toString(), child);
            }
        });

        return Array.from(uniqueChildrenMap.values());
    }

    async getPaymentsForParent(parentId: string): Promise<Payment[]> {
        return this.paymentModel.find({ parent: Types.ObjectId.createFromHexString(parentId) });
    }

    async getPaymentsForBankAccount(bankAccountId: string): Promise<Payment[]> {
        return this.paymentModel.find({ bankAccount: Types.ObjectId.createFromHexString(bankAccountId) });
    }

    async getPaymentsForClass(classId: string, collectionId?: string): Promise<Payment[]> {
        const collections = await this.collectionModel.find({ class: Types.ObjectId.createFromHexString(classId) });
        const collectionIds = collections.map((collection) => collection._id);

        if (collectionId && !collectionIds.includes(Types.ObjectId.createFromHexString(collectionId))) {
            return [];
        }

        const query = collectionId
            ? { collection: Types.ObjectId.createFromHexString(collectionId) }
            : { collection: { $in: collectionIds } };

        return this.paymentModel.find(query);
    }

    async getPaymentsForCollection(collectionId: string, childId?: string): Promise<Payment[]> {
        const query = childId
            ? {
                  collection: Types.ObjectId.createFromHexString(collectionId),
                  child: Types.ObjectId.createFromHexString(childId),
              }
            : { collection: Types.ObjectId.createFromHexString(collectionId) };

        return this.paymentModel.find(query);
    }
}
