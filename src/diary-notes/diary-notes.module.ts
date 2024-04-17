import { Module } from '@nestjs/common';
import { DiaryNotesResolver } from './diary-notes.resolver';
import { DiaryNote, DiaryNoteSchema } from './schema/diaryNote.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DiaryNotesService } from './diary-notes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiaryNote.name, schema: DiaryNoteSchema },
    ]),
  ],
  providers: [DiaryNotesResolver, DiaryNotesService],
})
export class DiaryNotesModule {}
