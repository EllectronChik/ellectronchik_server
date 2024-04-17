import { CreateGoalInput } from './create-goal.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGoalInput extends PartialType(CreateGoalInput) {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  completed?: boolean;
}
