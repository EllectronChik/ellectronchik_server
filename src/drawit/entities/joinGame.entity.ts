import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPlayer } from 'src/models/IPlayer';
import { Player } from './player.entity';
import { ChatMessage } from './chatMessage.entity';
import { IChatMessage } from 'src/models/IChatMessage';

@ObjectType()
export class JoinGame {
  @Field(() => [Player])
  players: IPlayer[];

  @Field(() => [ChatMessage])
  chat: IChatMessage[];

  @Field(() => [String])
  guesses: string[];

  @Field(() => String, { nullable: true })
  currentCanvasState: string | null;

  @Field(() => Int)
  maxPlayersCount: number;

  @Field(() => Int)
  pointsToWin: number;
}
