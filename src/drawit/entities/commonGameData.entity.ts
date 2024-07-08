import { Field, ObjectType } from '@nestjs/graphql';
import { IPlayer } from 'src/models/IPlayer';
import { Player } from './player.entity';
import { ChatMessage } from './chatMessage.entity';
import { IChatMessage } from 'src/models/IChatMessage';

@ObjectType()
export class CommonGameData {
  @Field(() => Boolean, { description: 'Returns true if game exists' })
  gameExist: boolean;

  @Field(() => Boolean, { description: 'Returns true if game is running' })
  gameRunning: boolean;

  @Field(() => [Player], { description: 'List of players' })
  players: IPlayer[];

  @Field(() => [ChatMessage], { description: 'List of chat messages' })
  chat: IChatMessage[];

  @Field(() => [String], { description: 'List of guesses' })
  guesses: string[];
}
