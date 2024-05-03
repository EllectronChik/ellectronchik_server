import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNoteInput {
  @Field(() => String)
  readonly encryptedTitle: string;

  @Field(() => String)
  readonly encryptedText: string;

  @Field(() => [String], { nullable: true })
  readonly tags: string[];

  @Field(() => String)
  iv: string;
}
