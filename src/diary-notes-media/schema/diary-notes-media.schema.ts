import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type DiaryNoteMediaDocument = DiaryNoteMedia & mongoose.Document;

@Schema()
export class DiaryNoteMedia {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiaryNote',
    required: true,
  })
  diaryNoteId: string;

  @Prop({ required: true })
  mediaPath: string;

  @Prop({ required: true })
  mediaIVHex: string;
}

export const DiaryNoteMediaSchema =
  SchemaFactory.createForClass(DiaryNoteMedia);
