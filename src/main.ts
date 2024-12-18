import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as multer from 'multer';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3000);

    app.use(multer().any());
    app.use(express.raw({ type: 'multipart/form-data', limit: '10mb' }));
}
bootstrap();
