import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type SubtaskDocument = Subtask & mongoose.Document;

@Schema()
export class Subtask {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: false })
  completed: boolean;

  @Prop({ required: true, default: 0 })
  points: number;

  @Prop({ required: true })
  taskId: string;

  @Prop({ required: true })
  userId: string;
}

export const SubTaskSchema = SchemaFactory.createForClass(Subtask);
