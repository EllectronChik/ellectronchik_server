import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Subtask {
  @Field()
  _id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  completed: boolean;

  @Field()
  points: number;

  @Field()
  taskId: string;
}
