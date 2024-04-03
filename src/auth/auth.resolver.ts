import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/schema/user.schema';
import { AuthService } from './auth.service';
import { AuthPayloadObject } from 'src/objects/authPayload.object';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => AuthPayloadObject)
  async register(
    @Args('name') name: string,
    @Args('password') password: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.signUp({ name, password });
  }

  @Mutation((returns) => AuthPayloadObject)
  async login(@Args('name') name: string, @Args('password') password: string) {
    return this.authService.signIn({ name, password });
  }
}
