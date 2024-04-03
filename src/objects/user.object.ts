import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UsersObject {
  @Field()
  _id: string;

  @Field()
  name: string;

  @HideField()
  password: string;

  @Field()
  rating: number;

  @Field()
  role: string;

  // @Prop()
  // tasks: Task[];

  // @Prop()
  // goals: Goal[];

  // @Prop()
  // diaryNotes: DiaryNote[];
}

@ObjectType()
export class UserObject {
  @Field()
  _id: string;

  @Field()
  name: string;

  @HideField()
  password: string;

  @Field()
  rating: number;

  @Field(() => String)
  role: string;

  // @Prop()
  // tasks: Task[];

  // @Prop()
  // goals: Goal[];

  // @Prop()
  // diaryNotes: DiaryNote[];
}
