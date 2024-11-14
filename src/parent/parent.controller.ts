import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ParentService } from './parent.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('parents')
export class ParentController {
    constructor(private readonly parentService: ParentService) {}

    @Get(':classId')
    async getParentsInClass(@Req() req, @Param('classId') classId: string) {
        const { id: parentId } = req.user;
        return this.parentService.getParentsInClass(parentId, classId);
    }
}
