import { CreateSubtaskInput } from './create-subtask.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubtaskInput extends PartialType(CreateSubtaskInput) {
  @Field()
  _id: string;
}
