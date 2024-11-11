import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { ChildService } from './child.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ChildCreate,
  ChildDetails,
  ChildUpdate,
} from 'src/interfaces/child.interface';

@Controller('children')
@UseGuards(AuthGuard)
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Post()
  async createChild(@Request() req, @Body() classInfo: ChildDetails) {
    const { id: parentId } = req.user;
    const childCreate: ChildCreate = { ...classInfo, parentId };
    return await this.childService.create(childCreate);
  }

  @Patch()
  async updateChild(
    @Request() req,
    @Body() childDetails: Partial<ChildDetails> & { childId: string },
  ) {
    const { id: parentId } = req.user;
    const childUpdate: ChildUpdate = { ...childDetails, parentId };
    return await this.childService.update(childUpdate);
  }

  @Get()
  async getMyChildren(@Request() req) {
    const { id: parentId } = req.user;
    return await this.childService.get(parentId);
  }

  @Delete()
  async deleteChild(@Request() req, @Body() childDetails: { childId: string }) {
    const { id: parentId } = req.user;
    return await this.childService.delete({ ...childDetails, parentId });
  }
}
