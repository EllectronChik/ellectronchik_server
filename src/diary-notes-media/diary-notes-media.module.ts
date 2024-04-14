import { Module } from '@nestjs/common';
import { DiaryNotesMediaService } from './diary-notes-media.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DiaryNoteMedia,
  DiaryNoteMediaSchema,
} from './schema/diary-notes-media.schema';
import { DiaryNotesMediaController } from './diary-notes-media.controller';
import {
  DiaryNote,
  DiaryNoteSchema,
} from 'src/diary-notes/schema/diaryNote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiaryNoteMedia.name, schema: DiaryNoteMediaSchema },
    ]),
    MongooseModule.forFeature([
      { name: DiaryNote.name, schema: DiaryNoteSchema },
    ]),
  ],
  providers: [DiaryNotesMediaService],
  controllers: [DiaryNotesMediaController],
})
export class DiaryNotesMediaModule {}
