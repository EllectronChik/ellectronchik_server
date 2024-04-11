import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { TagDocument } from './schema/tag.schema';
import { TagObject } from 'src/objects/tag.object';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import IReqUserContext from 'src/models/IReqUserContext';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Resolver(() => TagObject)
export class TagsResolver {

}
