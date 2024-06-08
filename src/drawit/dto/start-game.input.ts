import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class KingPlayerInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}

@InputType()
export class CustomWordlistInput {
  @Field(() => String)
  package: string;

  @Field(() => String)
  language: string;

  @Field(() => [String])
  wordlist: string[];
}

@InputType()
export class StartGameInput {
  @Field(() => Int)
  playersCount: number;
  @Field(() => Int)
  pointsToWin: number;
  @Field(() => Int)
  timeLimit: number;
  @Field()
  KingPlayer: KingPlayerInput;
  @Field(() => [String], { nullable: true })
  customWordlist: CustomWordlistInput | null;
  @Field(() => String, { nullable: true })
  wordlistId: string | null;
}
