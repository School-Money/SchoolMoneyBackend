import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ClassCreate, ClassDetails } from 'src/interfaces/class.interface';

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
    return await this.classService.get(parentId);
  }

  @Get('invite')
  async getInviteCode(@Request() req) {
    const { id: treasurerId } = req.user;
    return await this.classService.getInviteCode(treasurerId);
  }
}
