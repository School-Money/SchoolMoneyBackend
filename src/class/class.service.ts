import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassCreate } from 'src/interfaces/class.interface';
import { Class } from 'src/schemas/Class.schema';
import { Parent } from 'src/schemas/Parent.schema';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<Class>,
    @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
  ) {}

  async create(classInfo: ClassCreate) {
    const treasurer = await this.parentModel.findById(classInfo.treasurerId);
    if (!treasurer) {
      throw new NotFoundException('Treasurer not found');
    }
    return this.classModel.create({ ...classInfo, treasurer: treasurer._id });
  }
}
