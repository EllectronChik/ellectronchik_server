import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GameSub {
  @Field(() => String, { description: 'Game ID' })
  id: string;

  @Field(() => String, { description: 'Game language' })
  language: string;

  @Field(() => String, { description: 'Game package' })
  package: string;

  @Field(() => Number, { description: 'Players count' })
  playersCount: number;

  @Field(() => Number, { description: 'Points to win' })
  pointsToWin: number;
}
