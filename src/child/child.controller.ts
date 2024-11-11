import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ChildService } from './child.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChildCreate, ChildDetails } from 'src/interfaces/child.interface';

@Controller('child')
@UseGuards(AuthGuard)
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Post('create')
  async createChild(@Request() req, @Body() classInfo: ChildDetails) {
    const { id: parentId } = req.user;
    const childCreate: ChildCreate = { ...classInfo, parentId };
    return this.childService.create(childCreate);
  }
}
