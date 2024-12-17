import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { GetParentsDto } from "src/interfaces/admin.interface";
import { Admin } from "src/schemas/Admin.schema";
import { BankAccount } from "src/schemas/BankAccount.schema";
import { Child } from "src/schemas/Child.schema";
import { Class } from "src/schemas/Class.schema";
import { Collection } from "src/schemas/Collection.schema";
import { Parent } from "src/schemas/Parent.schema";
import { Payment } from "src/schemas/Payment.schema";

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

        const parentsNotAdmins = parents.filter((parent) => !admins.some((admin) => admin.parent.toString() === parent._id.toString()));
        if (!parentsNotAdmins.length) {
            return [];
        }

        return parentsNotAdmins.map((parent) => {
            return {
                ...parent.toObject(),
                isTreasurer: classes.some((classItem) => classItem.treasurer.toString() === parent._id.toString()),
            }
        });
    }

    async blockParent(parentId: string): Promise<void> {
        await this.parentModel.updateOne({ _id: parentId }, { isBlocked: true });
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

    async blockCollection(collectionId: string): Promise<void> {
        await this.collectionModel.updateOne({ _id: collectionId }, { isBlocked: true });
    }

    async getBankAccounts(): Promise<BankAccount[]> {
        return this.bankAccountModel.find();
    }

    async getChildrenForCollection(collectionId: string): Promise<Child[]> {
        const payments = await this.paymentModel.find({ collection: Types.ObjectId.createFromHexString(collectionId) })
            .populate<{ child: Child }>('child');
        
        return payments.map((payment) => payment.child);
    }
}
