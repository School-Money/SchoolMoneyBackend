import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChildCreate, ChildUpdate } from 'src/interfaces/child.interface';
import { Child } from 'src/schemas/Child.schema';
import { Class } from 'src/schemas/Class.schema';
import { Parent } from 'src/schemas/Parent.schema';

@Injectable()
export class ChildService {
    constructor(
        @InjectModel(Child.name) private readonly childModel: Model<Child>,
        @InjectModel(Class.name) private readonly classModel: Model<Class>,
        @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
    ) {}

    async create(childCreate: ChildCreate) {
        try {
            const parent = await this.parentModel.findById(childCreate.parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            const clazz = await this.classModel.findById(childCreate.inviteCode);
            if (!clazz) {
                throw new NotFoundException('Class not found');
            }
            return await this.childModel.create({
                ...childCreate,
                birthDate: new Date(childCreate.birthDate * 1000),
                parent: parent._id,
                class: clazz._id,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to create child: ${error.message}`);
        }
    }

    async update(childUpdate: ChildUpdate) {
        try {
            const parent = await this.parentModel.findById(childUpdate.parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            const clazz = await this.classModel.findById(childUpdate.classId);
            if (!clazz) {
                throw new NotFoundException('Class not found');
            }
            const child = await this.childModel.findById(childUpdate.childId);
            if (!child) {
                throw new NotFoundException('Child not found');
            }
            return await this.childModel.findByIdAndUpdate(childUpdate.childId, {
                ...childUpdate,
                parent: parent._id,
                class: clazz._id,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to update child: ${error.message}`);
        }
    }

    async get(parentId: string) {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            return await this.childModel.find({ parent: parent._id });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to get children: ${error.message}`);
        }
    }

    async delete(childDetails: { childId: string; parentId: string }) {
        try {
            const parent = await this.parentModel.findById(childDetails.parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            const child = await this.childModel.findById(childDetails.childId);
            if (!child) {
                throw new NotFoundException('Child not found');
            }
            return await this.childModel.findByIdAndDelete(childDetails.childId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to delete child: ${error.message}`);
        }
    }
}
