import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CollectionPayload, CollectionUpdate, GetCollectionDetails } from 'src/interfaces/collection.interface';
import { CollectionService } from './collection.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from 'src/image/image.service';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('collections')
export class CollectionController {
    constructor(
        private readonly collectionService: CollectionService,
        private readonly imageService: ImageService,
    ) {}

    @Post()
    async createCollection(@Body() payload: CollectionPayload, @Req() req): Promise<string> {
        const { id } = req.user;
        await this.collectionService.create(payload, id);

        return 'Collection created successfully';
    }

    @Patch(':collectionId')
    async updateCollection(
        @Body() payload: CollectionUpdate,
        @Req() req,
        @Param('collectionId') collectionId: string,
    ): Promise<string> {
        const { id } = req.user;
        await this.collectionService.updateCollection(payload, collectionId, id);

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

    @Patch(':collectionId/logo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadCollectionLogo(
        @Req() req,
        @Param('collectionId') collectionId: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<string> {
        const { id: parentId } = req.user;
        return await this.imageService.uploadImage('collection', collectionId, file, parentId);
    }

    @Get(':collectionId/logo')
    async getCollectionLogo(@Req() req, @Param('collectionId') collectionId: string, @Res() res: Response) {
        const { id: parentId } = req.user;
        const { stream, contentType } = await this.imageService.getImage('collection', collectionId, parentId);

        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000');

        stream.pipe(res);
    }
}
