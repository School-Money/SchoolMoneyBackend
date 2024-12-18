import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ParentLogin, ParentRegister } from 'src/interfaces/parent.interface';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async registerUser(@Body() user: ParentRegister) {
        return this.authService.registerUser(user);
    }

    @Post('login')
    async loginUser(@Body() user: ParentLogin) {
        return this.authService.loginUser(user);
    }

    @UseGuards(AuthGuard)
    @Get('user-details')
    async getUserInfo(@Request() req) {
        const { id: userId } = req.user;
        return this.authService.getUserInfo(userId);
    }
}
