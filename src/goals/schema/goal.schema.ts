import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SubtaskDocument } from 'src/subtask/schema/subtask.schema';

export type GoalDocument = Goal & mongoose.Document;

@Schema()
export class Goal {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: false })
  completed: boolean;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  userId: string;

  @Prop({
    nullable: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subtask' }],
    default: [],
  })
  subtasks: SubtaskDocument[];
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
