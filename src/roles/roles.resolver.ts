import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { RoleObject, RolesObject } from 'src/objects/role.object';
import { RoleDocument } from './schema/role.schema';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver()
export class RolesResolver {
  constructor(private readonly RolesService: RolesService) {}

  @UseGuards(AuthGuard)
  @Query(() => [RolesObject])
  async findAllRoles(
    @Context('req') req: { user: { role: string } },
  ): Promise<RoleDocument[]> {
    const roles = await this.RolesService.findAllByRole(req.user.role);
    return roles;
  }

  @Query(() => RoleObject)
  async findOneRole(@Args('name') name: string): Promise<RoleDocument> {
    const role = (await this.RolesService.findOne(name)).populate('users');
    return role;
  }
}
