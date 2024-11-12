import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/schemas/Class.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { Child, ChildSchema } from 'src/schemas/Child.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
        MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
        MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
    ],
    controllers: [ClassController],
    providers: [ClassService],
    exports: [ClassService],
})
export class ClassModule {}
