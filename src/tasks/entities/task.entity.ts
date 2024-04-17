import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Task {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  completed: boolean;

  @Field(() => Date)
  dueDate: Date;

  @Field(() => Boolean)
  isDaily: boolean;

  @Field(() => Boolean)
  isOverdue: boolean;

  @Field(() => Int)
  points: number;

  @Field(() => [String])
  tags: string[];

  @Field(() => [String])
  subtasks: string[];
}
