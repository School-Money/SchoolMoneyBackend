import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CollectionPayload, CollectionUpdate, GetCollectionDetails } from 'src/interfaces/collection.interface';
import { CollectionService } from './collection.service';

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
        await this.collectionService.updateCollection(payload, id);

        return 'Collection updated successfully';
    }

    @Get()
    async getAllCollections(@Req() req): Promise<any> {
        const { id } = req.user;
        return await this.collectionService.getCollections(id);
    }

    @Get(':collectionId')
    async getCollectionDetails(@Req() req, @Param('collectionId') collectionId: string): Promise<GetCollectionDetails> {
        const { id: parentId } = req.user;
        return await this.collectionService.getCollectionDetails(collectionId, parentId);
    }

    @Delete(':collectionId')
    async closeCollection(@Req() req, @Param('collectionId') collectionId: string): Promise<void> {
        const { id: parentId } = req.user;
        await this.collectionService.closeCollection(collectionId, parentId);

        return;
    }
}
