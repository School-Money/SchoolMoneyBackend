import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ClassService } from './class.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ClassCreate, ClassDetails } from 'src/interfaces/class.interface';

@Controller('class')
@UseGuards(AuthGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('create')
  async createClass(@Request() req, @Body() classInfo: ClassDetails) {
    const { id: treasurerId } = req.user;
    const classCreate: ClassCreate = { ...classInfo, treasurerId };
    return this.classService.create(classCreate);
  }
}
