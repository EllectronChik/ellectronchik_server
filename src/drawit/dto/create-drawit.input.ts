import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDrawitInput {
  @Field()
  title: string;

  @Field()
  language: string;

  @Field(() => [String])
  wordList: string[];
}
