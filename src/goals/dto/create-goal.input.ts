import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGoalInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  points: number;
}
