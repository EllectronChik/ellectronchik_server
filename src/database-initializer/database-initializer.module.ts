import { Module } from '@nestjs/common';
import { DatabaseInitializerService } from './database-initializer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/roles/schema/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [DatabaseInitializerService],
})
export class DatabaseInitializerModule {}
