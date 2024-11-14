import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ParentRegister } from 'src/interfaces/parent.interface';
import { BankAccount } from 'src/schemas/BankAccount.schema';
import { Child } from 'src/schemas/Child.schema';
import { Class } from 'src/schemas/Class.schema';
import { Parent } from 'src/schemas/Parent.schema';

@Injectable()
export class ParentService {
    constructor(
        @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
        @InjectModel(BankAccount.name)
        private readonly bankAccountModel: Model<BankAccount>,
        @InjectModel(Child.name) private readonly childModel: Model<Child>,
        @InjectModel(Class.name) private readonly classModel: Model<Class>,
    ) {}

    async create(parent: ParentRegister): Promise<Parent> {
        if (!parent.firstName || !parent.password || !parent.lastName || !parent.email) {
            throw new BadRequestException('One of required fields is missing');
        }

        const bankAccount = await this.bankAccountModel.create({});

        if (!bankAccount) {
            throw new BadRequestException('Failed to create bank account');
        }

        const newParent = await this.parentModel.create({
            ...parent,
            bankAccount: bankAccount._id,
        });

        await this.bankAccountModel.updateOne({ _id: bankAccount._id }, { owner: newParent._id });

        return newParent;
    }

    async findOne(parentEmail: string): Promise<Parent | undefined> {
        return this.parentModel.findOne({ email: parentEmail }).exec();
    }
    
    async getParentsInClass(parentId: string, classId: string): Promise<Parent[]> {
        try {
            const classDoc = await this.classModel.findById(classId);
            const parentChildren = await this.childModel.find({ parent: Types.ObjectId.createFromHexString(parentId) });

            if (!classDoc) {
                throw new BadRequestException('Class not found');
            } else if (!parentChildren) {
                throw new BadRequestException('Parent has no children');
            } else if (!parentChildren.some((child) => child.class.toHexString() === classDoc._id.toHexString())) {
                throw new BadRequestException('Parent has no children in this class');
            }

            const children = await this.childModel.find({ class: Types.ObjectId.createFromHexString(classId) });
            const parentIds = children.map((child) => child.parent);
            return this.parentModel.find({ _id: { $in: parentIds } }).exec();
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Database operation failed: ${error.message}`);
        }
    }
}
