import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema()
export class Collection {
  @Prop({
    required: true,
    ref: 'Class',
    type: Types.ObjectId,
  })
  class: Types.ObjectId;

  @Prop({
    required: true,
    ref: 'Parent',
    type: Types.ObjectId,
  })
  creator: Types.ObjectId;

  @Prop({
    required: true,
    minlength: 6,
    maxlength: 30,
  })
  title: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 200,
  })
  description: string;

  @Prop({
    default: 'class.jpg',
  })
  logo: string;

  @Prop({
    required: true,
  })
  startDate: Date;

  @Prop({
    required: true,
  })
  endDate: Date;

  @Prop({
    required: true,
    min: 0,
  })
  targetAmount: number;

  @Prop({
    required: true,
    min: 0,
  })
  currentAmount: number;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
