import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { DiaryNote } from 'src/diary-notes/entities/diary-note.entity';
import { Task } from 'src/tasks/entities/task.entity';

@ObjectType()
export class User {
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

  @Field(() => [Task])
  tasks: Task[];

  // @Prop()
  // goals: Goal[];

  @Field(() => [DiaryNote])
  diaryNotes: DiaryNote[];
}
