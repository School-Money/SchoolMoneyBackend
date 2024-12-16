import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
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
        const { email, firstName, lastName, password, repeatPassword } = payload;

        if (!email || !firstName || !lastName || !password || !repeatPassword) {
            throw new BadRequestException('All fields are required');
        }

        if (password !== repeatPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        try {
            await this.parentService.create({
                email,
                firstName,
                lastName,
                password,
                repeatPassword,
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Parent already exists');
            }
            throw error;
        }
        return { message: 'Parent registered successfully' };
    }

    async loginUser(payload: ParentLogin): Promise<{ accessToken: string; isAdmin: boolean }> {
        const { email, password } = payload;
        const parent = await this.parentService.findOne(email);
        if (!parent || parent.password !== password || parent.isBlocked) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const [accessToken, isAdmin] = await Promise.all([
            this.jwtService.signAsync({
                email: parent.email,
                id: parent._id,
            }),
            this.parentService.isParentAdmin(parent),
        ]);

        return { accessToken, isAdmin };
    }

    async getUserInfo(userId: string) {
        try {
            const [parent, balance] = await Promise.all([
                this.parentService.getUserInfo(userId),
                this.parentService.getParentBalance(userId),
            ]);
            return { _id: userId, email: parent.email, firstName: parent.firstName, lastName: parent.lastName, balance };
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
