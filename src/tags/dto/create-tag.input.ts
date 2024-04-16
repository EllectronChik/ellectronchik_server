import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class createTagInput {
  @Field()
  readonly name: string;
  @Field()
  readonly color: string;
}
