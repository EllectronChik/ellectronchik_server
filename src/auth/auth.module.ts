import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthResolver } from './auth.resolver';
import { RolesService } from 'src/roles/roles.service';
import { Role, RoleSchema } from 'src/roles/schema/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [AuthService, UsersService, AuthResolver, RolesService],
  exports: [AuthService],
})
export class AuthModule {}
