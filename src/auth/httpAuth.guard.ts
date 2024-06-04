import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    let token: string;

    try {
      token = req.headers.cookie.split('x-access-token=')[1].split(';')[0];
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.PRIVATE_KEY,
      });

      req.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
