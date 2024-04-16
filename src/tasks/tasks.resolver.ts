import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import IReqUserContext from 'src/models/IReqUserContext';
import { PopulatedTask } from './entities/populatedTask.entity';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Task)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput, @Context('req') { user: { sub: userId } }: IReqUserContext) {
    return this.tasksService.create(createTaskInput, userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Task], { name: 'findAllTasksByUser', description: 'Find all tasks by user, auth required' })
  findAll(@Context('req') { user: { sub: userId } }: IReqUserContext) {
    return this.tasksService.findAllByUser(userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => PopulatedTask, { name: 'findOneTask', description: 'Find one task by id, auth required' })
  findOne(
    @Args('id', { type: () => String }) id: string,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.tasksService.findOne(id, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Task, { name: 'updateTask', description: 'Update task by id, auth required' })
  updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.tasksService.update(
      updateTaskInput.id,
      userId,
      updateTaskInput,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean, { name: 'removeTask', description: 'Remove task by id, auth required' })
  removeTask(
    @Args('id', { type: () => String }) id: string,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.tasksService.remove(id, userId);
  }
}
