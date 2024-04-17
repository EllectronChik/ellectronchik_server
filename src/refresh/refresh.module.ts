import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { RefreshResolver } from './refresh.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Refresh, RefreshSchema } from './schema/refresh.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Refresh.name, schema: RefreshSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [RefreshService, RefreshResolver],
})
export class RefreshModule {}
