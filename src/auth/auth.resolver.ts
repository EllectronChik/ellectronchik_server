import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/schema/user.schema';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthPayload } from './auth-payload.entity';
import { CreateUserInput } from 'src/users/dto/create-user.input';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload, {
    name: 'register',
    description: 'Register new user',
  })
  async register(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Context('res') res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken, userId } =
      await this.authService.signUp(createUserInput);
    res.cookie('refreshToken', `${userId}__${refreshToken}`, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return { accessToken };
  }

  @Mutation(() => AuthPayload, {
    name: 'login',
    description: 'Login user',
  })
  async login(
    @Args('loginUserInput') loginUserInput: CreateUserInput,
    @Context('res') res: Response,
  ) {
    const { accessToken, refreshToken, userId } = await this.authService.signIn(
      loginUserInput,
    );
    res.cookie('refreshToken', `${userId}__${refreshToken}`, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return { accessToken, refreshToken };
  }
}
