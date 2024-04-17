import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Date)
  dueDate: Date;

  @Field(() => Boolean)
  isDaily: boolean;

  @Field(() => Int)
  points: number;

  @Field(() => [String], { nullable: true })
  tags: string[];
}
