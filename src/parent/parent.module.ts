import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { BankAccount, BankAccountSchema } from 'src/schemas/BankAccount.schema';
import { Child, ChildSchema } from 'src/schemas/Child.schema';
import { Class, ClassSchema } from 'src/schemas/Class.schema';
import { Admin, AdminSchema } from 'src/schemas/Admin.schema';
import { ImageModule } from 'src/image/image.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Parent.name, schema: ParentSchema },
            { name: BankAccount.name, schema: BankAccountSchema },
            { name: Child.name, schema: ChildSchema },
            { name: Class.name, schema: ClassSchema },
            { name: Admin.name, schema: AdminSchema },
        ]),
        ImageModule,
    ],
    providers: [ParentService],
    controllers: [ParentController],
    exports: [ParentService],
})
export class ParentModule {}
