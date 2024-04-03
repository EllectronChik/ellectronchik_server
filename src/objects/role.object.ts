import { Field, ObjectType } from '@nestjs/graphql';
import { UserObject } from './user.object';

@ObjectType()
export class RolesObject {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field(() => [String], { nullable: true })
  users: string[];
}

@ObjectType()
export class RoleObject {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field(() => [UserObject], { nullable: true })
  users: UserObject[];
}