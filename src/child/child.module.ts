import { Module } from '@nestjs/common';
import { ChildService } from './child.service';
import { ChildController } from './child.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Child, ChildSchema } from 'src/schemas/Child.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { Class, ClassSchema } from 'src/schemas/Class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  ],
  controllers: [ChildController],
  providers: [ChildService],
})
export class ChildModule {}
