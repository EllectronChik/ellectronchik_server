import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { DrawitService } from './drawit.service';
import { Drawit } from './entities/drawit.entity';
import { CreateDrawitInput } from './dto/create-drawit.input';
import { GameSub } from './entities/gameSub.entity';
// import { UpdateDrawitInput } from './dto/update-drawit.input';
import { GraphQLError } from 'graphql';
import { CreatedGame } from './entities/createdGame.entity';
import { StartGameInput } from './dto/start-game.input';
import { SubscriptionService } from './subscription.service';

@Resolver(() => Drawit)
export class DrawitResolver {
  constructor(
    private readonly drawitService: DrawitService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Mutation(() => Drawit, { name: 'CreateDrawItPack' })
  createDrawit(
    @Args('createDrawitInput') createDrawitInput: CreateDrawitInput,
  ) {
    return this.drawitService.create(createDrawitInput);
  }

  @Query(() => [Drawit], { name: 'FindAllDrawItPacks' })
  findAll() {
    return this.drawitService.findAll();
  }

  @Query(() => Drawit, { name: 'FindOneDrawItPack' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.drawitService.findOne(id);
  }

  // @Mutation(() => Drawit, { name: 'UpdateDrawItPack' })
  // updateDrawit(
  //   @Args('updateDrawitInput') updateDrawitInput: UpdateDrawitInput,
  // ) {
  //   return this.drawitService.update(updateDrawitInput.id, updateDrawitInput);
  // }

  // @Mutation(() => Drawit, { name: 'RemoveDrawItPack' })
  // removeDrawit(@Args('id', { type: () => Int }) id: number) {
  //   return this.drawitService.remove(id);
  // }

  @Subscription(() => [GameSub], { name: 'getGames' })
  getGames() {
    setTimeout(() => {
      this.drawitService.getGames();
    }, 0);
    return this.subscriptionService.getPubSub.asyncIterator('getGames');
  }

  @Mutation(() => CreatedGame, { name: 'startGame' })
  async startGame(@Args('startGameInput') startGameInput: StartGameInput) {
    try {
      return await this.drawitService.startGame(startGameInput);
    } catch (e) {
      throw new GraphQLError(e.message, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
  }
}
