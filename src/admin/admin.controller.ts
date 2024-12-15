import { Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { AdminGuard } from "./admin.guard";
import { AdminService } from "./admin.service";

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) {}

    @Get('parents')
    async getParents() {
        return await this.adminService.getParents();
    }

    @Patch('parents/block/:parentId')
    async blockParent(
        @Param('parentId') parentId: string,
    ) {
        return await this.adminService.blockParent(parentId);
    }

    @Get('classes')
    async getClasses() {
        return await this.adminService.getClasses();
    }

    @Patch('collections/block/:collectionId')
    async blockCollection(
        @Param('collectionId') collectionId: string,
    ) {
        return await this.adminService.blockCollection(collectionId);
    }
}