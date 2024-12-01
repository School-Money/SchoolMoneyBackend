import { Body, Controller, Post, UseGuards, Request, Get, Patch } from '@nestjs/common';
import { ClassService } from './class.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
    ClassCreate,
    ClassDetails,
    GetClassDetailsPayload,
    GetClassInviteCodePayload,
    PassTreasurerToParentPayload,
} from 'src/interfaces/class.interface';

@Controller('classes')
@UseGuards(AuthGuard)
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Post()
    async createClass(@Request() req, @Body() classInfo: ClassDetails) {
        const { id: treasurerId } = req.user;
        const classCreate: ClassCreate = { ...classInfo, treasurerId };
        return await this.classService.create(classCreate);
    }

    @Get()
    async getMyClasses(@Request() req) {
        const { id: parentId } = req.user;
        console.info(parentId);
        return await this.classService.get(parentId);
    }

    @Post('invite')
    async getInviteCode(@Request() req, @Body() payload: GetClassInviteCodePayload) {
        const { id: treasurerId } = req.user;
        const { classId } = payload;
        return await this.classService.getInviteCode(treasurerId, classId);
    }

    @Get('details')
    async getClassDetails(@Request() req, @Body() payload: GetClassDetailsPayload) {
        const { id: parentId } = req.user;
        const { classId } = payload;
        return await this.classService.getClassDetails(parentId, classId);
    }

    @Patch('passTreasurer')
    async passTreasurer(@Request() req, @Body() payload: PassTreasurerToParentPayload) {
        const { id: parentId } = req.user;
        return await this.classService.passTreasurerToParent({ ...payload, currentTreasurerId: parentId });
    }
}
