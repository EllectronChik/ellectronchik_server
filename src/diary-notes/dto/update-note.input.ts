import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateNoteInput } from "./create-note.input";

@InputType()
export class UpdateNoteInput extends PartialType(CreateNoteInput) { 
  @Field(() => String)
  id: string;
}