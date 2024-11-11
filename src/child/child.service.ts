import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChildCreate } from 'src/interfaces/child.interface';
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
    const parent = await this.parentModel.findById(childCreate.parentId);
    if (!parent) {
      throw new NotFoundException('Parent not found');
    }
    const clazz = await this.classModel.findById(childCreate.classId);
    if (!clazz) {
      throw new NotFoundException('Class not found');
    }
    return this.childModel.create({
      ...childCreate,
      parent: parent._id,
      class: clazz._id,
    });
  }
}
