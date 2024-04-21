import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field()
  readonly name: string;

  @Field()
  readonly password: string;
}
