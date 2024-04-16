import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Roles {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field(() => [String], { nullable: true })
  users: string[];
}
