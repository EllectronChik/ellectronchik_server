import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { User } from './entities/user.entity';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly UsersService: UsersService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Mutation((returns) => Boolean, { name: 'removeUser', description: 'remove user, only for admin' })
  async removeUser(@Args('id') id: string): Promise<boolean> {
    return this.UsersService.remove(id);
  }
}
