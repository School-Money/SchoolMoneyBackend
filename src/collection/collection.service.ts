import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CollectionPayload, CollectionUpdate } from 'src/interfaces/collection.interface';
import { Child } from 'src/schemas/Child.schema';
import { Class } from 'src/schemas/Class.schema';
import { Collection } from 'src/schemas/Collection.schema';
import { Parent } from 'src/schemas/Parent.schema';

@Injectable()
export class CollectionService {
    constructor(
        @InjectModel(Collection.name)
        private readonly collectionModel: Model<Collection>,
        @InjectModel(Parent.name)
        private readonly parentModel: Model<Parent>,
        @InjectModel(Class.name)
        private readonly classModel: Model<Class>,
        @InjectModel(Child.name)
        private readonly childModel: Model<Child>,
    ) {}

    async create(payload: CollectionPayload, parentId: string): Promise<Collection> {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }

            const classDoc = await this.classModel.findById(payload.classId);
            if (!classDoc) {
                throw new NotFoundException('Class not found');
            }

            return await this.collectionModel.create({
                ...payload,
                startDate: new Date(payload.startDate * 1000),
                endDate: new Date(payload.endDate * 1000),
                creator: parent._id,
                class: classDoc._id,
                currentAmount: 0,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Database operation failed: ${error.message}`);
        }
    }

    async updateCollecion(payload: CollectionUpdate, parentId: string): Promise<Collection> {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }

            const collection = await this.collectionModel.findById(payload.collectionId);
            if (!collection) {
                throw new NotFoundException('Collection not found');
            }

            if (collection.creator.toString() !== parent._id.toString()) {
                throw new UnauthorizedException('You are not the creator of this collection');
            }

            await collection.updateOne({
                ...payload,
            });

            return collection;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Database operation failed: ${error.message}`);
        }
    }

    async getCollections(parentId: string): Promise<Collection[]> {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }

            const parentChilds = await this.childModel.find({ parent: parent._id.toString() });
            if (!parentChilds.length) {
                throw new NotFoundException('No child found for this parent');
            }

            const parentChildClasses = parentChilds.map((child) => child.class);
            const classesIds = parentChildClasses.map((classId) => new Types.ObjectId(classId));
            if (!classesIds.length) {
                throw new NotFoundException('No class found for this parent');
            }

            const res = await this.collectionModel.find({
                class: {
                    $in: classesIds,
                },
            });

            return res;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Database operation failed: ${error.message}`);
        }
    }
}
