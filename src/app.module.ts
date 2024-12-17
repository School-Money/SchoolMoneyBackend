import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { ParentModule } from "./parent/parent.module";
import { ClassModule } from "./class/class.module";
import { ChildModule } from "./child/child.module";
import { CollectionModule } from "./collection/collection.module";
import { PaymentModule } from "./payment/payment.module";
import { MulterModule } from "@nestjs/platform-express";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { ChatModule } from "./chat/chat.module";
import { AdminModule } from "./admin/admin.module";
import { memoryStorage } from "multer";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>("MONGO_URI"),
            }),
        }),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: () => ({
                storage: memoryStorage(),
                limits: {
                fileSize: 10 * 1024 * 1024,
                },
            }),
        }),
        AuthModule,
        ParentModule,
        ClassModule,
        ChildModule,
        CollectionModule,
        PaymentModule,
        ChatModule,
        AdminModule,
    ],
    controllers: [AuthController],
    providers: [AppService, AuthService],
})
export class AppModule {}
