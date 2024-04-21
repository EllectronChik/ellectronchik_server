import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/schema/user.schema';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { LoginUserInput } from 'src/users/dto/login-user.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean, {
    name: 'register',
    description: 'Register new user',
  })
  async register(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Context('res') res: Response,
  ): Promise<boolean> {
    const { accessToken, refreshToken, userId } =
      await this.authService.signUp(createUserInput);
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
    return true;
  }

  @Mutation(() => Boolean, {
    name: 'login',
    description: 'Login user',
  })
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context('res') res: Response,
  ): Promise<boolean> {
    const { accessToken, refreshToken, userId } =
      await this.authService.signIn(loginUserInput);
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
    return true;
  }
}
