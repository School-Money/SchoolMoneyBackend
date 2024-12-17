import { Controller, Get, Header, Param, Patch, Query, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { AdminGuard } from "./admin.guard";
import { AdminService } from "./admin.service";
import { ReportService } from "src/report/report.service";

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly reportService: ReportService,
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

    @Get('collections')
    async getCollections() {
        return await this.adminService.getCollections();
    }

    @Patch('collections/block/:collectionId')
    async blockCollection(
        @Param('collectionId') collectionId: string,
    ) {
        return await this.adminService.blockCollection(collectionId);
    }

    @Get('collections/:classId')
    async getCollectionsForClass(
        @Param('classId') classId: string,
    ) {
        return await this.adminService.getCollectionsForClass(classId);
    }

    @Get('bank-accounts')
    async getBankAccounts() {
        return await this.adminService.getBankAccounts();
    }

    @Get('children/:collectionId')
    async getChildrenForCollection(
        @Param('collectionId') collectionId: string,
    ) {
        return await this.adminService.getChildrenForCollection(collectionId);
    }

    @Get('report/parents/:parentId')
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=payments_report.pdf')
    async generateReportForParent(
        @Param('parentId') parentId: string,
        @Res() res,
    ) {
        const payments = await this.adminService.getPaymentsForParent(parentId);
        const pdfStream = this.reportService.generatePaymentsPDF(payments);
        pdfStream.pipe(res);
    }

    @Get('report/bank-accounts/:bankAccountId')
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=payments_report.pdf')
    async generateReportForBankAccount(
        @Param('bankAccountId') bankAccountId: string,
        @Res() res,
    ) {
        const payments = await this.adminService.getPaymentsForBankAccount(bankAccountId);
        const pdfStream = this.reportService.generatePaymentsPDF(payments);
        pdfStream.pipe(res);
    }

    @Get('report/classes/:classId')
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=payments_report.pdf')
    async generateReportForClass(
        @Param('classId') classId: string,
        @Query('collectionId') collectionId: string | undefined,
        @Res() res,
    ) {
        const payments = await this.adminService.getPaymentsForClass(classId, collectionId);
        const pdfStream = this.reportService.generatePaymentsPDF(payments);
        pdfStream.pipe(res);
    }

    @Get('report/collections/:collectionId')
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=payments_report.pdf')
    async generateReportForCollection(
        @Param('collectionId') collectionId: string,
        @Query('childId') childId: string | undefined,
        @Res() res,
    ) {
        const payments = await this.adminService.getPaymentsForCollection(collectionId, childId);
        const pdfStream = this.reportService.generatePaymentsPDF(payments);
        pdfStream.pipe(res);
    }
}
