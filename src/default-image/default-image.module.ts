import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DefaultImageController } from './default-image.controller';

@Module({
  imports: [ConfigModule],
  controllers: [DefaultImageController],
})
export class DefaultImageModule {}
