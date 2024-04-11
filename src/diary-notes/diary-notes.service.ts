import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiaryNote, DiaryNoteDocument } from './schema/diaryNote.schema';
import { Model } from 'mongoose';

@Injectable()
export class DiaryNotesService {}
