import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreatedGame {
  @Field(() => String)
  id: string;

  @Field(() => String)
  playerId: string;
}
