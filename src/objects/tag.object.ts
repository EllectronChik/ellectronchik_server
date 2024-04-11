import { Field, HideField, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class TagObject {

  @Field()
  _id: string

  @Field()
  name: string

  @Field()
  color: string

  @HideField()
  userId: string
}