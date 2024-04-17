import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Subtask } from 'src/subtask/entities/subtask.entity';


@ObjectType()
export class Goal {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  completed: boolean;

  @Field(() => Int)
  points: number;

  @Field(() => String)
  userId: string;

  @Field(() => [Subtask])
  subtasks: Subtask[];
}
