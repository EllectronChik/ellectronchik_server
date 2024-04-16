import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Role {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field(() => [User], { nullable: true })
  users: User[];
}