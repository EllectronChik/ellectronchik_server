import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DiaryNote {
  @Field()
  _id: string;

  @Field()
  encryptedTitle: string;

  @Field()
  encryptedText: string;

  @Field(() => [String], { nullable: true })
  encryptedMedia: string[];

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date | null;

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field(() => String)
  iv: string;

  @Field()
  userId: string;
}
