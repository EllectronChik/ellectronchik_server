import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddChatMessageInput {
  @Field(() => String)
  gameId: string;

  @Field(() => String)
  message: string;

  @Field(() => String)
  playerId: string;
}
