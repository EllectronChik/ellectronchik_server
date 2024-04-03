import { Args, Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { RoleObject, RolesObject } from 'src/objects/role.object';
import { RoleDocument } from './schema/role.schema';

@Resolver()
export class RolesResolver {
  constructor(private readonly RolesService: RolesService) {}

  @Query(() => [RolesObject])
  async findAllRoles(): Promise<RoleDocument[]> {
    const roles = await this.RolesService.findAll();
    return roles
  }

  @Query(() => RoleObject)
  async findOneRole(@Args('name') name: string): Promise<RoleDocument> {
    const role = (await this.RolesService.findOne(name)).populate('users');
    return role
  }
}
