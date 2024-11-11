import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParentRegister } from 'src/interfaces/parent.interface';
import { Parent } from 'src/schemas/Parent.schema';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
  ) {}

  async create(parent: ParentRegister): Promise<Parent> {
    if (
      !parent.firstName ||
      !parent.password ||
      !parent.lastName ||
      !parent.email
    ) {
      throw new BadRequestException('One of requitred fields is missing');
    }

    return this.parentModel.create(parent);
  }

  async findOne(parentEmail: string): Promise<Parent | undefined> {
    return this.parentModel.findOne({ email: parentEmail }).exec();
  }
}
