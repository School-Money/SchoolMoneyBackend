import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ParentModule } from './parent/parent.module';
import { ClassModule } from './class/class.module';
import { ChildModule } from './child/child.module';
import { CollectionModule } from './collection/collection.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
            }),
        }),
        AuthModule,
        ParentModule,
        ClassModule,
        ChildModule,
        CollectionModule,
    ],
    controllers: [AuthController],
    providers: [AppService, AuthService],
})
export class AppModule {}
