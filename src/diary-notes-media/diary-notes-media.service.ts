import { Injectable } from '@nestjs/common';
import { DiaryNoteMedia, DiaryNoteMediaDocument } from './schema/diary-notes-media.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DiaryNotesMediaService {
  constructor(
    @InjectModel(DiaryNoteMedia.name) private diaryNoteModel: Model<DiaryNoteMediaDocument>,
  ) {}

  // async create()
}
