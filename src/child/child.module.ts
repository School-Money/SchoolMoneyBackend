import { Module } from '@nestjs/common';
import { ChildService } from './child.service';
import { ChildController } from './child.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Child, ChildSchema } from 'src/schemas/Child.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { Class, ClassSchema } from 'src/schemas/Class.schema';
import { ImageModule } from 'src/image/image.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Child.name, schema: ChildSchema },
            { name: Parent.name, schema: ParentSchema },
            { name: Class.name, schema: ClassSchema }
        ]),
        ImageModule,
    ],
    controllers: [ChildController],
    providers: [ChildService],
})
export class ChildModule {}
