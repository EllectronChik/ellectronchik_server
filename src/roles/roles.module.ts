import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { Role, RoleSchema } from './schema/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [RolesService, RolesResolver],
  exports: [RolesService]
})
export class RolesModule {}
