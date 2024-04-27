import { HttpStatus } from '@nestjs/common';
import { Context, Resolver, Query } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { RefreshService } from './refresh.service';
import { Response } from 'express';
import { Refresh } from './entities/refresh.entity';

@Resolver()
export class RefreshResolver {
  constructor(private readonly refreshService: RefreshService) {}

  @Query(() => Refresh, {
    name: 'revalidateToken',
    description:
      'Revalidate token using refresh token, return access token and new refresh token',
  })
  async revalidateToken(
    @Context('req') req: { headers: { cookie: string } },
    @Context('res') res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let oldrefreshTokenCookie: string;
    let userId: string;
    let oldrefreshToken: string;
    try {
      oldrefreshTokenCookie = req.headers.cookie
        .split('refresh-token=')[1]
      if (oldrefreshTokenCookie && oldrefreshTokenCookie.includes(';')) {
        oldrefreshTokenCookie = oldrefreshTokenCookie.split(';')[0];
      }

      userId = oldrefreshTokenCookie.split('__')[0];
      oldrefreshToken = oldrefreshTokenCookie.split('__')[1];
    } catch (e) {
      throw new GraphQLError('Invalid refresh token', {
        extensions: { code: HttpStatus.UNAUTHORIZED },
      });
    }
    if (!oldrefreshToken) {
      throw new GraphQLError('Invalid refresh token', {
        extensions: { code: HttpStatus.UNAUTHORIZED },
      });
    }

    const { accessToken, refreshToken } = await this.refreshService.reValidate(
      userId,
      oldrefreshToken,
    );
    res.cookie('refresh-token', `${userId}__${refreshToken}`, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    res.cookie('x-access-token', accessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 15,
    });
    return {
      accessToken,
      refreshToken: `${userId}__${refreshToken}`,
    };
  }
}
