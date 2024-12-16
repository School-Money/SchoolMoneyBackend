import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminSchema } from "src/schemas/Admin.schema";
import { Class, ClassSchema } from "src/schemas/Class.schema";
import { Collection, CollectionSchema } from "src/schemas/Collection.schema";
import { Parent, ParentSchema } from "src/schemas/Parent.schema";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { ParentModule } from "src/parent/parent.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Parent.name, schema: ParentSchema },
            { name: Class.name, schema: ClassSchema },
            { name: Admin.name, schema: AdminSchema },
            { name: Collection.name, schema: CollectionSchema },
        ]),
        ParentModule,
    ],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}