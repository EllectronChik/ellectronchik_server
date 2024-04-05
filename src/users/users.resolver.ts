import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserObject } from 'src/objects/user.object';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Resolver((of) => UserObject)
export class UsersResolver {
  constructor(private readonly UsersService: UsersService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Mutation((returns) => Boolean)
  async removeUser(@Args('id') id: string): Promise<boolean> {
    return this.UsersService.remove(id);
  }
}
