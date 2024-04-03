import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserDocument } from './schema/user.schema';
import { UsersService } from './users.service';
import { UserObject, UsersObject } from 'src/objects/user.object';
import { GraphQLError } from 'graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver((of) => UserObject)
export class UsersResolver {
  constructor(private readonly UsersService: UsersService) {}

  @Query((returns) => [UsersObject])
  @UseGuards(AuthGuard)
  async findAllUsers(): Promise<UserDocument[]> {
    return this.UsersService.findAll();
  }

  @Query((returns) => UserObject, { nullable: true })
  async findOneUser(@Args('name') name: string): Promise<UserDocument> {
    const user = await this.UsersService.findOne(name);
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: HttpStatus.NOT_FOUND },
      });
    }
    return user.populate('role');
  }

  @Mutation((returns) => Boolean)
  async removeUser(@Args('id') id: string): Promise<boolean> {
    return this.UsersService.remove(id);
  }
}
