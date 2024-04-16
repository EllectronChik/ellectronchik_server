import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  readonly name: string;

  @Field()
  readonly password: string;
}
