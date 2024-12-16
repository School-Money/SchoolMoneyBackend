import { Body, Controller, Get, Param, Patch, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ParentService } from './parent.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImageService } from 'src/image/image.service';

@UseGuards(AuthGuard)
@Controller('parents')
export class ParentController {
    constructor(
        private readonly parentService: ParentService,
        private readonly imageService: ImageService,
    ) {}

    @Patch('avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadParentAvatar(
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<string> {
        const { id: parentId } = req.user;
        return await this.imageService.uploadImage('parent', parentId, file, parentId);
    }
    
    @Get('avatar')
    async getParentAvatar(
        @Req() req,
        @Res() res: Response,
    ) {
        const { id: parentId } = req.user;
        const { stream, contentType } = await this.imageService.getImage('parent', parentId, parentId);
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000');

        stream.pipe(res);
    }
    
    @Patch('balance')
    async updateParentBalance(
        @Req() req,
        @Body() body: { amount: number },
    ) {
        const { id: parentId } = req.user;
        return this.parentService.updateParentBalance(parentId, body.amount);
    }

    @Get(':classId')
    async getParentsInClass(@Req() req, @Param('classId') classId: string) {
        const { id: parentId } = req.user;
        return this.parentService.getParentsInClass(parentId, classId);
    }
}
