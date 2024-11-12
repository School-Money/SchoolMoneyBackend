import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
    @Prop({
        required: true,
        minlength: 3,
        maxlength: 20,
    })
    username: string;

    @Prop({
        required: true,
        minlength: 6,
        maxlength: 20,
    })
    password: number;

    @Prop({
        required: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    })
    email: string;

    @Prop({
        default: Date.now(),
    })
    createdAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
