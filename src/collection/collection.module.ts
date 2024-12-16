import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from 'src/schemas/Collection.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { Class, ClassSchema } from 'src/schemas/Class.schema';
import { Child, ChildSchema } from 'src/schemas/Child.schema';
import { BankAccount, BankAccountSchema } from 'src/schemas/BankAccount.schema';
import { Payment, PaymentSchema } from 'src/schemas/Payment.schema';
import { ImageModule } from 'src/image/image.module';
import { ParentModule } from 'src/parent/parent.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Collection.name, schema: CollectionSchema },
            { name: Parent.name, schema: ParentSchema },
            { name: Class.name, schema: ClassSchema },
            { name: Child.name, schema: ChildSchema },
            { name: BankAccount.name, schema: BankAccountSchema },
            { name: Payment.name, schema: PaymentSchema },
        ]),
        ImageModule,
        ParentModule,
    ],
    controllers: [CollectionController],
    providers: [CollectionService],
})
export class CollectionModule {}
