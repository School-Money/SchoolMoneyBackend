import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParentLogin, ParentRegister } from 'src/interfaces/parent.interface';
import { Parent } from 'src/schemas/Parent.schema';

@Injectable()
export class ParentService {
  constructor(@InjectModel(Parent.name) private parentModel: Model<Parent>) {}

  async create(parent: ParentRegister): Promise<Parent> {
    if (
      !parent.firstName ||
      !parent.password ||
      !parent.lastName ||
      !parent.email
    ) {
      throw new BadRequestException('One of requitred fields is missing');
    }
    if (!parent.repeatPassword) {
      throw new BadRequestException('Password confirmation is required');
    }
    if (parent.password !== parent.repeatPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    return this.parentModel.create(parent);
  }

  async findOne(parentEmail: string): Promise<Parent | undefined> {
    return this.parentModel.findOne({ email: parentEmail }).exec();
  }
}
