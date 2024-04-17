import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { Tag, TagSchema } from './schema/tag.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/roles/schema/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [TagsService, TagsResolver]
})
export class TagsModule {}
