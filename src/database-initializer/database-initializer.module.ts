import { Module } from '@nestjs/common';
import { DatabaseInitializerService } from './database-initializer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/roles/schema/role.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [DatabaseInitializerService],
})
export class DatabaseInitializerModule {}
