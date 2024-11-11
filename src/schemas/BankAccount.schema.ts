import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BankAccountDocument = HydratedDocument<BankAccount>;

@Schema()
export class BankAccount {
  @Prop({
    default: () =>
      Math.floor(
        1000000000000000 + Math.random() * 9000000000000000,
      ).toString(),
    length: 16,
  })
  accountNumber: string;

  @Prop({
    default: 0,
  })
  balance: number;

  @Prop({
    type: Types.ObjectId,
  })
  owner: Types.ObjectId;
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);
