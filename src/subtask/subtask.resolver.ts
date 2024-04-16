import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { SubtaskService } from './subtask.service';
import { Subtask } from './entities/subtask.entity';
import { CreateSubtaskInput } from './dto/create-subtask.input';
import { UpdateSubtaskInput } from './dto/update-subtask.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import IReqUserContext from 'src/models/IReqUserContext';

@Resolver(() => Subtask)
export class SubtaskResolver {
  constructor(private readonly subtaskService: SubtaskService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Subtask, {
    name: 'createSubtask',
    description: 'Create a new subtask, auth required',
  })
  createSubtask(
    @Args('createSubtaskInput') createSubtaskInput: CreateSubtaskInput,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.subtaskService.create(createSubtaskInput, userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Subtask], {
    name: 'findAllSubtasksByTask',
    description: 'Find all subtasks by task id, auth required',
  })
  findAllByTask(
    @Args('taskId', { type: () => String }) taskId: string,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.subtaskService.findAllByTask(taskId, userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Subtask, {
    name: 'findOneSubtask',
    description: 'Find one subtask by id, auth required',
  })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.subtaskService.findOne(id, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Subtask, {
    name: 'updateSubtask',
    description: 'Update a subtask, auth required',
  })
  updateSubtask(
    @Args('updateSubtaskInput') updateSubtaskInput: UpdateSubtaskInput,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.subtaskService.update(
      updateSubtaskInput._id,
      userId,
      updateSubtaskInput,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Subtask, {
    name: 'removeSubtask',
    description: 'Remove a subtask, auth required',
  })
  removeSubtask(
    @Args('id', { type: () => String }) id: string,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.subtaskService.remove(id, userId);
  }
}
