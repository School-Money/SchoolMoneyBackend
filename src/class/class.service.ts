import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassCreate, PassTreasurerToParentParams } from 'src/interfaces/class.interface';
import { Child } from 'src/schemas/Child.schema';
import { Class } from 'src/schemas/Class.schema';
import { Parent } from 'src/schemas/Parent.schema';

@Injectable()
export class ClassService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<Class>,
        @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
        @InjectModel(Child.name) private readonly childModel: Model<Child>,
    ) {}

    async create(classInfo: ClassCreate) {
        try {
            const treasurer = await this.parentModel.findById(classInfo.treasurerId);
            if (!treasurer) {
                throw new NotFoundException('Treasurer not found');
            }
            return this.classModel.create({ ...classInfo, treasurer: treasurer._id });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to create class: ${error.message}`);
        }
    }

    async get(parentId: string) {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            const myChildren = await this.childModel.find({ parent: parent._id });
            if (!myChildren.length) {
                return [];
            }
            const myClasses = await this.classModel.find({
                _id: { $in: myChildren.map((child) => child.class) },
            });
            return myClasses;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to get classes: ${error.message}`);
        }
    }

    async getInviteCode(treasurerId: string) {
        try {
            const treasurer = await this.parentModel.findById(treasurerId);
            if (!treasurer) {
                throw new NotFoundException('Treasurer not found');
            }
            const classDoc = await this.classModel.findOne({ treasurer: treasurer._id });
            if (!classDoc) {
                throw new NotFoundException('Class not found');
            }
            return classDoc._id;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to get invite code: ${error.message}`);
        }
    }

    async passTreasurerToParent(
        passTreasurerToParentParams: PassTreasurerToParentParams
    ): Promise<Class> {
        try {
            const { currentTreasurerId, newTreasurerId, classId } = passTreasurerToParentParams;

            const currentTreasurer = await this.parentModel.findById(currentTreasurerId);
            const newTreasurer = await this.parentModel.findById(newTreasurerId);
            const classDoc = await this.classModel.findById(classId);

            if (!currentTreasurer || !newTreasurer || !classDoc) {
                throw new NotFoundException('One of the related entities not found');
            } else if (currentTreasurer._id.toString() !== classDoc.treasurer.toString()) {
                throw new UnauthorizedException('You are not the treasurer of this class');
            } else if (newTreasurer._id.toString() === currentTreasurer._id.toString()) {
                return classDoc;
            }

            const newTreasurerChildren = await this.childModel.find({ parent: newTreasurer._id });
            if (!newTreasurerChildren.length) {
                throw new NotFoundException('New treasurer has no children');
            } else if (!newTreasurerChildren.some((child) => child.class.toHexString() === classDoc._id.toHexString())) {
                throw new UnauthorizedException('New treasurer has no children in this class');
            }

            const updatedClassDoc = await this.classModel.findByIdAndUpdate(
                classId,
                { treasurer: newTreasurer._id },
                { new: true }
            );            
            return updatedClassDoc;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Database operation failed: ${error.message}`);
        }
    }
}
