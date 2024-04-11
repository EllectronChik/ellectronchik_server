import { Module } from '@nestjs/common';
import { DiaryNotesResolver } from './diary-notes.resolver';
import { DiaryNote, DiaryNoteSchema } from './schema/diaryNote.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiaryNote.name, schema: DiaryNoteSchema },
    ]),
  ],
  providers: [DiaryNotesResolver],
})
export class DiaryNotesModule {}
