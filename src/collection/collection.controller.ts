import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CollectionPayload, CollectionUpdate } from 'src/interfaces/collection.interface';
import { CollectionService } from './collection.service';

@UseGuards(AuthGuard)
@Controller('collection')
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
}
