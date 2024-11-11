import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionPayload } from 'src/interfaces/collection.interface';
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
    ) {}

    create(payload: CollectionPayload, parentId: string): Promise<Collection> {
        const parent = this.parentModel.findById(parentId);
        if (!parent) {
            throw new Error('Parent not found');
        }
        const classId = payload.classId;
        const classDoc = this.classModel.findById(classId);
        if (!classDoc) {
            throw new Error('Class not found');
        }
        return this.collectionModel.create(payload);
    }
}
