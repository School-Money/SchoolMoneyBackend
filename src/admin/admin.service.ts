import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GetParentsDto } from "src/interfaces/admin.interface";
import { Admin } from "src/schemas/Admin.schema";
import { Class } from "src/schemas/Class.schema";
import { Collection } from "src/schemas/Collection.schema";
import { Parent } from "src/schemas/Parent.schema";

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
        @InjectModel(Class.name) private readonly classModel: Model<Class>,
        @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
        @InjectModel(Collection.name) private readonly collectionModel: Model<Collection>,
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

    async blockCollection(collectionId: string): Promise<void> {
        await this.collectionModel.updateOne({ _id: collectionId }, { isBlocked: true });
    }
}
