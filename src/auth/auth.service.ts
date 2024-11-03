import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ParentLogin, ParentRegister } from 'src/interfaces/parent.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(payload: ParentRegister): Promise<{ message: string }> {
    const { email, password, repeatPassword, firstName, lastName } = payload;
    try {
      await this.usersService.create({ username, password, passwordConfirm });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }

    return { message: 'User registered successfully' };
  }

  async loginUser(payload: ParentLogin): Promise<{ accessToken: string }> {
    const { email, password } = payload;
    const user = await this.usersService.findOne(username);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.jwtService.signAsync({
      id: user._id,
      username: user.username,
    });
    return { accessToken };
  }
}
