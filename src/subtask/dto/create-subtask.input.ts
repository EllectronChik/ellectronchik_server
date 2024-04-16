import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSubtaskInput {
  @Field(() => String)
  taskId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  completed: boolean;

  @Field(() => Int)
  points: number;
}
