import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Subtask } from 'src/subtask/entities/subtask.entity';

@ObjectType()
export class Refresh {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}
