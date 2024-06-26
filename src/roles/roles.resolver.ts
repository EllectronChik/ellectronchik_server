import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { RoleDocument } from './schema/role.schema';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from './entities/role.entity';
import { Roles as RolesObject } from './entities/roles.entity';


@Resolver()
export class RolesResolver {
  constructor(private readonly RolesService: RolesService) {}

  @UseGuards(AuthGuard)
  @Query(() => [RolesObject], {
    name: 'findAllRoles',
    description: 'Get all roles, auth required',
  })
  async findAllRoles(
    @Context('req') req: { user: { role: string } },
  ): Promise<RoleDocument[]> {
    const roles = await this.RolesService.findAllByRole(req.user.role);
    return roles;
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Query(() => Role, {
    name: 'findOneRole',
    description: 'Get role by name, admin only',
  })
  async findOneRole(@Args('name') name: string): Promise<RoleDocument> {
    const role = (await this.RolesService.findOne(name)).populate('users');
    return role;
  }
}
