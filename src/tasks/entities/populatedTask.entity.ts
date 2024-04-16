import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Subtask } from 'src/subtask/entities/subtask.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@ObjectType()
export class PopulatedTask {
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

  @Field(() => [Tag])
  tags: Tag[];

  @Field(() => [Subtask])
  subtasks: Subtask[];
}
