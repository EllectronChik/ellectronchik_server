import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DiaryNote, DiaryNoteDocument } from 'src/diary-notes/schema/diaryNote.schema';
import { Goal, GoalDocument } from 'src/goals/schema/goal.schema';
import { Role } from 'src/roles/schema/role.schema';
import { Task, TaskDocument } from 'src/tasks/schema/task.schema';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  rating: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
  })
  role: Role;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: DiaryNote.name }],
    default: [],
  })
  diaryNotes: DiaryNoteDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Task.name }],
    default: [],
  })
  tasks: TaskDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Goal.name }],
    default: [],
  })
  goals: GoalDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
