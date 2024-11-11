import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParentRegister } from 'src/interfaces/parent.interface';
import { BankAccount } from 'src/schemas/BankAccount.schema';
import { Parent } from 'src/schemas/Parent.schema';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
    @InjectModel(BankAccount.name)
    private readonly bankAccountModel: Model<BankAccount>,
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

    const bankAccount = await this.bankAccountModel.create({});

    if (!bankAccount) {
      throw new BadRequestException('Failed to create bank account');
    }

    const newParent = await this.parentModel.create({
      ...parent,
      bankAccount: bankAccount._id,
    });

    await this.bankAccountModel.updateOne(
      { _id: bankAccount._id },
      { owner: newParent._id },
    );

    return newParent;
  }

  async findOne(parentEmail: string): Promise<Parent | undefined> {
    return this.parentModel.findOne({ email: parentEmail }).exec();
  }
}
