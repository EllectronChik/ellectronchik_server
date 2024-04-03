import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersResolver } from './users.resolver';
import { Role, RoleSchema } from 'src/roles/schema/role.schema';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [UsersService, UsersResolver, RolesService],
  exports: [UsersService],
})
export class UsersModule {}
