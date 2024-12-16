import { Body, Controller, Post, UseGuards, Request, Get, Delete, Patch, Req, Res, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { ChildService } from './child.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChildCreate, ChildCreateDetails, ChildUpdate, ChildUpdateDetails } from 'src/interfaces/child.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from 'src/image/image.service';
import { Response } from 'express';

@Controller('children')
@UseGuards(AuthGuard)
export class ChildController {
    constructor(
        private readonly childService: ChildService,
        private readonly imageService: ImageService,
    ) {}

    @Post()
    async createChild(@Request() req, @Body() classInfo: ChildCreateDetails) {
        const { id: parentId } = req.user;
        const childCreate: ChildCreate = { ...classInfo, parentId };
        return await this.childService.create(childCreate);
    }

    @Patch()
    async updateChild(@Request() req, @Body() childDetails: ChildUpdateDetails) {
        const { id: parentId } = req.user;
        const childUpdate: ChildUpdate = { ...childDetails, parentId };
        return await this.childService.update(childUpdate);
    }

    @Get()
    async getMyChildren(@Request() req) {
        const { id: parentId } = req.user;
        return await this.childService.get(parentId);
    }

    @Delete(':childId')
    async deleteChild(@Request() req, @Param('childId') childId: string) {
        const { id: parentId } = req.user;
        return await this.childService.delete({ childId, parentId });
    }

    @Patch(':childId/avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadChildAvatar(
        @Req() req,
        @Param('childId') childId: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<string> {
        const { id: parentId } = req.user;
        return await this.imageService.uploadImage('child', childId, file, parentId);
    }
        
    @Get(':childId/avatar')
    async getChildAvatar(
        @Req() req,
        @Param('childId') childId: string,
        @Res() res: Response,
    ) {
        const { id: parentId } = req.user;
        const { stream, contentType } = await this.imageService.getImage('child', childId, parentId);
            
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    
        stream.pipe(res);
    }
}
