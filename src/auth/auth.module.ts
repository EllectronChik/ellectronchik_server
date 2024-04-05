import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthResolver } from './auth.resolver';
import { RolesService } from 'src/roles/roles.service';
import { Role, RoleSchema } from 'src/roles/schema/role.schema';
import { RefreshService } from 'src/refresh/refresh.service';
import { Refresh, RefreshSchema } from 'src/refresh/schema/refresh.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: Refresh.name, schema: RefreshSchema }]),
  ],
  providers: [
    AuthService,
    UsersService,
    AuthResolver,
    RolesService,
    RefreshService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
