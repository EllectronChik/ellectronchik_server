import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } = GqlExecutionContext.create(context).getContext();
    if (req.headers.authorization?.split(' ')[0] !== 'Bearer') {
      throw new GraphQLError('Invalid token', {
        extensions: { code: HttpStatus.UNAUTHORIZED },
      })
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new GraphQLError('Invalid token', {
        extensions: { code: HttpStatus.UNAUTHORIZED },
      })
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.PRIVATE_KEY,
      });

      req.user = payload;
      return true;
    } catch (e) {
      throw new GraphQLError('Invalid token', {
        extensions: { code: HttpStatus.UNAUTHORIZED },
      })
    }
  }
}
