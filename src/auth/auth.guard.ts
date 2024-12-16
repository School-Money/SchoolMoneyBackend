import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ParentService } from 'src/parent/parent.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly parentService: ParentService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.SECRET_KEY,
            });
            const parent = await this.parentService.findById(payload.id);
            if (!parent || parent.isBlocked) {
                throw new UnauthorizedException();
            }

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authorizationHeader = request?.headers?.authorization ?? (request as any).handshake.headers.authorization;
        const [type, token] = authorizationHeader?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
