import { Module } from '@nestjs/common';
import { DiaryNotesMediaService } from './diary-notes-media.service';
import { DiaryNotesMediaResolver } from './diary-notes-media.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DiaryNoteMedia, DiaryNoteMediaSchema } from './schema/diary-notes-media.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiaryNoteMedia.name, schema: DiaryNoteMediaSchema },
    ]),
  ],
  providers: [DiaryNotesMediaService, DiaryNotesMediaResolver]
})
export class DiaryNotesMediaModule {}
