import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DiaryNoteMedia } from 'src/diary-notes-media/schema/diary-notes-media.schema';
import { TagDocument } from 'src/tags/schema/tag.schema';

export type DiaryNoteDocument = DiaryNote & mongoose.Document;

@Schema()
export class DiaryNote {
  @Prop({ required: true })
  encryptedTitle: string;

  @Prop({ required: true })
  encryptedText: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ null: true })
  updatedAt: Date | null;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    default: [],
  })
  tags: TagDocument[];

  @Prop({ required: true })
  iv: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DiaryNoteMedia' }],
    default: [],
  })
  diaryNoteMedia: DiaryNoteMedia[];
}

export const DiaryNoteSchema = SchemaFactory.createForClass(DiaryNote);
