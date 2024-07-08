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
import { GraphQLError } from 'graphql';
import { CreatedGame } from './entities/createdGame.entity';
import { StartGameInput } from './dto/start-game.input';
import { SubscriptionService } from './subscription.service';
import { JoinGame } from './entities/joinGame.entity';
import { JoinGameInput } from './dto/join-game.input';
import { CommonGameData } from './entities/commonGameData.entity';
import { AddChatMessageInput } from './dto/add-chat-message.input';

@Resolver(() => Drawit)
export class DrawitResolver {
  constructor(
    private readonly drawitService: DrawitService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Mutation(() => Drawit, { name: 'createDrawItPack' })
  createDrawit(
    @Args('createDrawitInput') createDrawitInput: CreateDrawitInput,
  ) {
    return this.drawitService.create(createDrawitInput);
  }

  @Query(() => [Drawit], { name: 'findAllDrawItPacks' })
  findAll() {
    return this.drawitService.findAll();
  }

  @Query(() => Drawit, { name: 'findOneDrawItPack' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.drawitService.findOne(id);
  }

  @Subscription(() => [GameSub], { name: 'getGames' })
  getGames() {
    setTimeout(() => {
      this.drawitService.getGames();
    }, 0);
    return this.subscriptionService.getPubSub.asyncIterator('getGames');
  }

  @Subscription(() => CommonGameData, { name: 'commonData' })
  getCommonData(@Args('gameId') gameId: string) {
    return this.subscriptionService.getPubSub.asyncIterator(
      `${gameId}_commonData`,
    );
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

  @Mutation(() => JoinGame, { name: 'joinGame' })
  async joinGame(@Args('joinGameInput') joinGameInput: JoinGameInput) {
    try {
      return this.drawitService.joinGame(joinGameInput);
    } catch (e) {
      throw new GraphQLError(e.message, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
  }

  @Query(() => Boolean, { name: 'isGameExist' })
  isGameExist(@Args('gameId') gameId: string) {
    return this.drawitService.isGameExist(gameId);
  }

  @Mutation(() => Boolean, { name: 'addChatMessage' })
  addChatMessage(
    @Args('addChatMessageInput') addChatMessageInput: AddChatMessageInput,
  ) {
    return this.drawitService.addChatMessage(addChatMessageInput);
  }
}
