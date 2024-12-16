import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/schemas/Class.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { Child, ChildSchema } from 'src/schemas/Child.schema';
import { Collection, CollectionSchema } from 'src/schemas/Collection.schema';
import { ParentModule } from 'src/parent/parent.module';
import { BankAccount, BankAccountSchema } from 'src/schemas/BankAccount.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Class.name, schema: ClassSchema },
            { name: Parent.name, schema: ParentSchema },
            { name: Child.name, schema: ChildSchema },
            { name: Collection.name, schema: CollectionSchema},
            { name: BankAccount.name, schema: BankAccountSchema },
        ]),
        ParentModule,
    ],
    controllers: [ClassController],
    providers: [ClassService],
    exports: [ClassService],
})
export class ClassModule {}
