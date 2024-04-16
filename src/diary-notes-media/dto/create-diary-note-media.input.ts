import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class createDiaryNoteMediaInput {
  @Field()
  readonly iv: string;

  @Field()
  readonly noteId: string;
}
