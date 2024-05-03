import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DiaryNotesService } from './diary-notes.service';
import { DiaryNoteDocument } from './schema/diaryNote.schema';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import IReqUserContext from 'src/models/IReqUserContext';
import { DiaryNote } from './entities/diary-note.entity';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import IReqWithCookies from 'src/models/IReqWithCookies';
import { GraphQLError } from 'graphql';

type direction = -1 | 1;

@Resolver()
export class DiaryNotesResolver {
  constructor(private readonly diaryNotesService: DiaryNotesService) {}

  @UseGuards(AuthGuard)
  @Query(() => [DiaryNote], {
    name: 'findUserNotesPaginated',
    description:
      'Locate user notes with pagination, with a default limit set to 10 per page and a maximum limit of 100 per page, requiring authentication.',
  })
  async findUserNotesPaginated(
    @Args('page', { type: () => Number, defaultValue: 1, nullable: true })
    page: number,
    @Args('limit', { type: () => Number, defaultValue: 10, nullable: true })
    limit: number,
    @Args('direction', { type: () => Number, nullable: true, defaultValue: 1 })
    direction: direction,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<DiaryNoteDocument[]> {
    if (!userId) {
      return [];
    }

    if (direction !== 1 && direction !== -1) {
      direction = 1;
    }

    if (page <= 0 || !page) {
      page = 1;
    }

    if (limit <= 0 || !limit || limit > 100) {
      limit = 10;
    }

    return await this.diaryNotesService.findUserNotesPaginated(
      page,
      limit,
      direction,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => DiaryNote, {
    name: 'findNoteById',
    description: 'Find one note by id, requires authentication.',
  })
  async findOne(
    @Args('id') id: string,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<DiaryNoteDocument> {
    return await this.diaryNotesService.findOne(id, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => DiaryNote, {
    name: 'createDiaryNote',
    description: 'Create a new note, requires authentication.',
  })
  async createDiaryNote(
    @Args('createNoteInput') createNoteInput: CreateNoteInput,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<DiaryNoteDocument> {
    return await this.diaryNotesService.create(createNoteInput, userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Number, {
    name: 'countNotesByTag',
    description: 'Count notes by tag, requires authentication.',
  })
  async countNotesByTag(
    @Args('tagId') tagId: string,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<number> {
    return await this.diaryNotesService.countNotesByTag(tagId, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => DiaryNote, {
    name: 'updateDiaryNote',
    description: 'Update a note, requires authentication.',
  })
  async updateDiaryNote(
    @Args('updateNoteInput') updateNoteInput: UpdateNoteInput,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<DiaryNoteDocument> {
    return await this.diaryNotesService.update(
      updateNoteInput.id,
      userId,
      updateNoteInput,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => DiaryNote, {
    name: 'deleteDiaryNote',
    description: 'Delete a note, requires authentication.',
  })
  async deleteDiaryNote(
    @Args('id') id: string,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<DiaryNoteDocument> {
    const deletedNote = await this.diaryNotesService.delete(id, userId);
    return deletedNote;
  }

  @UseGuards(AuthGuard)
  @Query(() => [DiaryNote], {
    name: 'findNotesByTags',
    description: 'Find notes by tags, requires authentication.',
  })
  async findNotesByTags(
    @Args('tags', { type: () => [String] }) tags: string[],
    @Args('page', { type: () => Number, defaultValue: 1, nullable: true })
    page: number,
    @Args('limit', { type: () => Number, defaultValue: 10, nullable: true })
    limit: number,
    @Args('direction', { type: () => Number, nullable: true, defaultValue: 1 })
    direction: direction,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<DiaryNoteDocument[]> {
    if (!userId) {
      return [];
    }

    if (direction !== 1 && direction !== -1) {
      direction = 1;
    }

    if (page <= 0 || !page) {
      page = 1;
    }

    if (limit <= 0 || !limit || limit > 100) {
      limit = 10;
    }

    return await this.diaryNotesService.findNotesByTags(
      tags,
      page,
      limit,
      direction,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => [DiaryNote], {
    name: 'findNotesByDates',
    description: 'Find notes by dates, requires authentication.',
  })
  async findNotesByDates(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
    @Args('page', { type: () => Number, defaultValue: 1, nullable: true })
    page: number,
    @Args('limit', { type: () => Number, defaultValue: 10, nullable: true })
    limit: number,
    @Args('direction', { type: () => Number, nullable: true, defaultValue: 1 })
    direction: direction,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ): Promise<DiaryNoteDocument[]> {
    if (!userId) {
      return [];
    }

    if (direction !== 1 && direction !== -1) {
      direction = 1;
    }

    if (page <= 0 || !page) {
      page = 1;
    }

    if (limit <= 0 || !limit || limit > 100) {
      limit = 10;
    }

    return await this.diaryNotesService.findNotesByDates(
      startDate,
      endDate,
      page,
      limit,
      direction,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => [DiaryNote], {
    name: 'findNotesByTitle',
    description: 'Find notes by title, requires authentication.',
  })
  async findNotesByTitle(
    @Args('title') title: string,
    @Context('req') { user: { sub: userId }, headers: { cookie } }: IReqWithCookies,
  ): Promise<DiaryNoteDocument[]> {
    if (!userId) {
      return [];
    }
    let key: string;
    
    try {
      key = cookie.split('key=')[1]
      if (key && key.includes(';')) {
        key = key.split(';')[0];
      }
    } catch (e) {
      throw new GraphQLError('Invalid key', {
        extensions: { code: HttpStatus.UNAUTHORIZED },
      });
    }
    if (!key) {
      throw new GraphQLError('Invalid key', {
        extensions: { code: HttpStatus.UNAUTHORIZED },
      });
    }
    return await this.diaryNotesService.findNotesByTitle(title, key, userId);
  }
}
