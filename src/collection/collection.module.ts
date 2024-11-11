import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from 'src/schemas/Collection.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { Class, ClassSchema } from 'src/schemas/Class.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Collection.name, schema: CollectionSchema },
            { name: Parent.name, schema: ParentSchema },
            { name: Class.name, schema: ClassSchema },
        ]),
    ],
    controllers: [CollectionController],
    providers: [CollectionService],
})
export class CollectionModule {}
