import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { BankAccount, BankAccountSchema } from 'src/schemas/BankAccount.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
        MongooseModule.forFeature([{ name: BankAccount.name, schema: BankAccountSchema }]),
    ],
    providers: [ParentService],
    controllers: [ParentController],
    exports: [ParentService],
})
export class ParentModule {}
