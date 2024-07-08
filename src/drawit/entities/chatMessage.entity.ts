import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChatMessage {
  @Field(() => String)
  username: string;

  @Field(() => String)
  message: string;
}
