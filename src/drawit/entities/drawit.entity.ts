import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Drawit {
  @Field(() => String, { description: 'ID of the drawing package' })
  id: string;

  @Field(() => String, { description: 'Theme of the drawing package' })
  title: string;

  @Field(() => String, { description: 'Language of the drawing package' })
  language: string;

  @Field(() => [String], { description: 'List of words' })
  wordList: string[];
}
