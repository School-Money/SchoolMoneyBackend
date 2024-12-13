import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Child, ChildSchema } from 'src/schemas/Child.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { Collection, CollectionSchema } from 'src/schemas/Collection.schema';
import { CloudinaryProvider } from './image.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Child.name, schema: ChildSchema },
      { name: Parent.name, schema: ParentSchema },
      { name: Collection.name, schema: CollectionSchema },
    ]),
  ],
  providers: [ImageService, CloudinaryProvider],
  exports: [ImageService, CloudinaryProvider],
})
export class ImageModule {}
