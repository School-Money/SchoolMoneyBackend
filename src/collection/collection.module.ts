import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from 'src/schemas/Collection.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { Class, ClassSchema } from 'src/schemas/Class.schema';
import { Child, ChildSchema } from 'src/schemas/Child.schema';
import { BankAccount, BankAccountSchema } from 'src/schemas/BankAccount.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Collection.name, schema: CollectionSchema },
            { name: Parent.name, schema: ParentSchema },
            { name: Class.name, schema: ClassSchema },
            { name: Child.name, schema: ChildSchema },
            { name: BankAccount.name, schema: BankAccountSchema },
        ]),
    ],
    controllers: [CollectionController],
    providers: [CollectionService],
})
export class CollectionModule {}
