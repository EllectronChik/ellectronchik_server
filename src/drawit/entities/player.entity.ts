import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Player {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Number)
  avatarId: number;

  @Field(() => Number)
  score: number;

  @Field(() => Number)
  wins: number;

  @Field(() => Boolean)
  isGuessed: boolean;

  @Field(() => Boolean)
  isDrawing: boolean;

  @Field(() => Boolean)
  isKing: boolean;
}
