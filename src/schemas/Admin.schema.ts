import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
    @Prop({
        required: true,
        ref: 'Parent',
        type: Types.ObjectId,
    })
    parent: Types.ObjectId;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
