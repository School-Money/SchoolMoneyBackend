import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { Payment } from "src/schemas/Payment.schema";
import { AuthGuard } from "src/auth/auth.guard";
import { PaymentCreatePayload, WithdrawPaymentPayload } from "src/interfaces/payment.interface";

@UseGuards(AuthGuard)
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Get()
    async getAllPayments(@Request() req): Promise<Payment[]> {
        const { id: parentId } = req.user;
        return await this.paymentService.get(parentId);
    }

    @Post()
    async createPayment(@Request() req, @Body() paymentCreatePayload: PaymentCreatePayload): Promise<Payment> {
        const { id: parentId } = req.user;
        return await this.paymentService.create(paymentCreatePayload, parentId);
    }

    @Post('withdraw')
    async withdrawPayment(@Request() req, @Body() withdrawPaymentPayload: WithdrawPaymentPayload): Promise<Payment> {
        const { id: parentId } = req.user;
        return await this.paymentService.withdraw(withdrawPaymentPayload, parentId);
    }

    @Get('parent')
    async getPaymentsMadeByParent(@Request() req): Promise<Payment[]> {
        const { id: parentId } = req.user;
        return await this.paymentService.getMadeByParent(parentId);
    }
}
