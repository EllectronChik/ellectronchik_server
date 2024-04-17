import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { TagDocument } from './schema/tag.schema';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import IReqUserContext from 'src/models/IReqUserContext';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Tag } from './entities/tag.entity';
import { createTagInput } from './dto/create-tag.input';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Query(() => [Tag], {
    name: 'findAllTags',
    description: 'Find all tags, admin only',
  })
  async findAll(): Promise<TagDocument[]> {
    return this.tagsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Query(() => Tag, {
    name: 'findUserTagById',
    description: 'Find tag associated with user by its id, auth required',
  })
  async findOne(
    @Args('id') id: string,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<TagDocument> {
    return this.tagsService.findOne(id, userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Tag], {
    name: 'findTagsByUser',
    description: 'Find all tags associated with user by its id, auth required',
  })
  async findTagsByUser(
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<TagDocument[]> {
    return this.tagsService.findTagsByUser(userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag, {
    name: 'createTag',
    description:
      'Create new tag wich will be accessible only for creator, auth required',
  })
  async createTag(
    @Args('createTagInput') createTagInput: createTagInput,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<TagDocument> {
    return this.tagsService.create(createTagInput, userId);
  }
}
