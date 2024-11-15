import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ParentLogin, ParentRegister } from 'src/interfaces/parent.interface';
import { ParentService } from 'src/parent/parent.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly parentService: ParentService,
        private readonly jwtService: JwtService,
    ) {}

    async registerUser(payload: ParentRegister): Promise<{ message: string }> {
        const { email, password, firstName, lastName } = payload;
        try {
            await this.parentService.create({
                email,
                password,
                firstName,
                lastName,
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Parent already exists');
            }
            throw error;
        }

        return { message: 'Parent registered successfully' };
    }

    async loginUser(payload: ParentLogin): Promise<{ accessToken: string }> {
        const { email, password } = payload;
        const parent = await this.parentService.findOne(email);
        if (!parent || parent.password !== password) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const accessToken = await this.jwtService.signAsync({
            email: parent.email,
            id: parent._id,
        });
        return { accessToken };
    }
}
