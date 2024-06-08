import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type DrawItDocument = DrawIt & mongoose.Document;

@Schema()
export class DrawIt {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true, type: [String], default: [] })
  wordList: string[];
}

export const DrawItSchema = SchemaFactory.createForClass(DrawIt);
