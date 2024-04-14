import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/schema/user.schema';
import { AuthService } from './auth.service';
import { AuthPayloadObject } from 'src/objects/authPayload.object';
import { Response } from 'express';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => AuthPayloadObject, {
    name: 'register',
    description: 'Register new user',
  })
  async register(
    @Args('name') name: string,
    @Args('password') password: string,
    @Context('res') res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken, userId } = await this.authService.signUp(
      {
        name,
        password,
      },
    );
    res.cookie('refreshToken', `${userId}__${refreshToken}`, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return { accessToken };
  }

  @Mutation((returns) => AuthPayloadObject, {
    name: 'login',
    description: 'Login user',
  })
  async login(
    @Args('name') name: string,
    @Args('password') password: string,
    @Context('res') res: Response,
  ) {
    const { accessToken, refreshToken, userId } = await this.authService.signIn(
      {
        name,
        password,
      },
    );
    res.cookie('refreshToken', `${userId}__${refreshToken}`, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return { accessToken, refreshToken };
  }
}
