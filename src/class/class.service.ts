import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassCreate } from 'src/interfaces/class.interface';
import { Class } from 'src/schemas/Class.schema';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<Class>,
  ) {}

  create(classInfo: ClassCreate) {
    return this.classModel.create(classInfo);
  }
}
