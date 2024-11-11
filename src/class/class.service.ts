import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      throw new InternalServerErrorException(
        `Failed to create class: ${error.message}`,
      );
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
      throw new InternalServerErrorException(
        `Failed to get classes: ${error.message}`,
      );
    }
  }

  async getInviteCode(treasurerId: string) {
    try {
      const treasurer = await this.parentModel.findById(treasurerId);
      if (!treasurer) {
        throw new NotFoundException('Treasurer not found');
      }
      const clazz = await this.classModel.findOne({ treasurer: treasurer._id });
      if (!clazz) {
        throw new NotFoundException('Class not found');
      }
      return clazz._id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to get invite code: ${error.message}`,
      );
    }
  }
}
