import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class JoinGameInput {
  @Field(() => String)
  gameId: string;

  @Field(() => String)
  playerId: string;

  @Field(() => Int)
  playerAvatar: number;

  @Field(() => String)
  playerName: string;
}
