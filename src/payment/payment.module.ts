import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Parent, ParentSchema } from "src/schemas/Parent.schema";
import { Collection, CollectionSchema } from "src/schemas/Collection.schema";
import { Child, ChildSchema } from "src/schemas/Child.schema";
import { Payment, PaymentSchema } from "src/schemas/Payment.schema";
import { BankAccount, BankAccountSchema } from "src/schemas/BankAccount.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
        MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }]),
        MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
        MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
        MongooseModule.forFeature([ {name: BankAccount.name, schema: BankAccountSchema}]),
    ],
    providers: [PaymentService],
    controllers: [PaymentController],
    exports: [PaymentService],
})

export class PaymentModule {}
