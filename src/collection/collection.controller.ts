import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CollectionPayload, CollectionUpdate } from 'src/interfaces/collection.interface';
import { CollectionService } from './collection.service';
import { Collection } from 'mongoose';

@UseGuards(AuthGuard)
@Controller('collections')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @Post()
    async createCollection(@Body() payload: CollectionPayload, @Req() req): Promise<string> {
        const { id } = req.user;
        await this.collectionService.create(payload, id);

        return 'Collection created successfully';
    }

    @Patch()
    async updateCollection(@Body() payload: CollectionUpdate, @Req() req): Promise<string> {
        const { id } = req.user;
        await this.collectionService.updateCollecion(payload, id);

        return 'Collection updated successfully';
    }

    @Get()
    async getAllCollections(@Req() req): Promise<any> {
        const { id } = req.user;
        return await this.collectionService.getCollections(id);
    }
}
