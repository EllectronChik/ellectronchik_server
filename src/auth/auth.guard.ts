import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } = GqlExecutionContext.create(context).getContext();
    let token: string;
    try {
      token = req.headers.cookie.split('x-access-token=')[1].split(';')[0];
    } catch (e) {
      throw new GraphQLError('Invalid token', {
        extensions: { code: HttpStatus.UNAUTHORIZED },
      });
    }

    if (!token) {
      throw new GraphQLError('Invalid token', {
        extensions: { code: HttpStatus.UNAUTHORIZED },
      });
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
      });
    }
  }
}
