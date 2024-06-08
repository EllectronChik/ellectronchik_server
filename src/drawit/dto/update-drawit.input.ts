import { CreateDrawitInput } from './create-drawit.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDrawitInput extends PartialType(CreateDrawitInput) {
  @Field(() => Int)
  id: number;
}
