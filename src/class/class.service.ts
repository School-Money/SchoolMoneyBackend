import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassCreate } from 'src/interfaces/class.interface';
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
    const treasurer = await this.parentModel.findById(classInfo.treasurerId);
    if (!treasurer) {
      throw new NotFoundException('Treasurer not found');
    }
    return this.classModel.create({ ...classInfo, treasurer: treasurer._id });
  }

  async get(parentId: string) {
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
  }
}
