import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { GoalsService } from './goals.service';
import { Goal } from './entities/goal.entity';
import { CreateGoalInput } from './dto/create-goal.input';
import { UpdateGoalInput } from './dto/update-goal.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import IReqUserContext from 'src/models/IReqUserContext';

@Resolver(() => Goal)
export class GoalsResolver {
  constructor(private readonly goalsService: GoalsService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Goal, {
    name: 'createGoal',
    description: 'Create goal, auth required',
  })
  createGoal(
    @Args('createGoalInput') createGoalInput: CreateGoalInput,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.goalsService.create(createGoalInput, userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Goal], {
    name: 'findAllGoalsByUserId',
    description: 'Find all goals by user id, auth required',
  })
  findAll(@Context('req') { user: { sub: userId } }: IReqUserContext) {
    return this.goalsService.findAllByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Goal, {
    name: 'findOneGoal',
    description: 'Find one goal by id, auth required',
  })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.goalsService.findOne(id, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Goal, {
    name: 'updateGoal',
    description: 'Update goal, auth required',
  })
  updateGoal(
    @Args('updateGoalInput') updateGoalInput: UpdateGoalInput,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.goalsService.update(
      updateGoalInput.id,
      updateGoalInput,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Goal, {
    name: 'removeGoal',
    description: 'Remove goal, auth required',
  })
  removeGoal(
    @Args('id', { type: () => Int }) id: number,
    @Context('req') { user: { sub: userId } }: IReqUserContext,
  ) {
    return this.goalsService.remove(id, userId);
  }
}
