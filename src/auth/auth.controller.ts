import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ParentLogin, ParentRegister } from 'src/interfaces/parent.interface';

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

  //   If we want to make artificial logout just to check if this user at least exists
  //   @UseGuards(AuthGuard)
  //   @Post('logout')
  //   async logOutUser(@Request() req) {
  //     const { username } = req.user;
  //     return this.authService.logOutUser(username);
  //   }
}
