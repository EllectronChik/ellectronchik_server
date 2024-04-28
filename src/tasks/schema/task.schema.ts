import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SubtaskDocument } from 'src/subtask/schema/subtask.schema';
import { Tag } from 'src/tags/schema/tag.schema';

export type TaskDocument = Task & mongoose.Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: false })
  completed: boolean;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true, default: false })
  isDaily: boolean;

  @Prop({ required: true, default: false })
  isOverdue: boolean;

  @Prop({ required: true, default: 0 })
  points: number;

  @Prop({
    nullable: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    default: [],
  })
  tags: Tag[];

  @Prop({ required: true })
  iv: string;

  @Prop({ required: true })
  userId: string;

  @Prop({
    nullable: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subtask' }],
    default: [],
  })
  subtasks: SubtaskDocument[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
