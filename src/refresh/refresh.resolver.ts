import { HttpStatus } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { RefreshService } from './refresh.service';
import { Response } from 'express';

@Resolver()
export class RefreshResolver {
  constructor(private readonly refreshService: RefreshService) {}

  @Mutation(() => String)
  async revalidateToken(
    @Context('req') req: { headers: { cookie: string } },
    @Args('userId') userId: string,
    @Context('res') res: Response,
  ): Promise<string> {
    let oldrefreshToken: string;
    try {
      oldrefreshToken = req.headers.cookie
        .split('refreshToken=')[1]
        .split(';')[0];
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
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return accessToken;
  }
}
