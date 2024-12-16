import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/schemas/Class.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { Child, ChildSchema } from 'src/schemas/Child.schema';
import { Collection, CollectionSchema } from 'src/schemas/Collection.schema';
import { ParentModule } from 'src/parent/parent.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
        MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
        MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
        MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }]),
        ParentModule,
    ],
    controllers: [ClassController],
    providers: [ClassService],
    exports: [ClassService],
})
export class ClassModule {}
