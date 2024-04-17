import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.headers.authorization?.split(' ')[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid token')
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token')
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.PRIVATE_KEY,
      });

      req.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
