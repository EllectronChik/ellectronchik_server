import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiaryNote, DiaryNoteDocument } from './schema/diaryNote.schema';
import { Model } from 'mongoose';

@Injectable()
export class DiaryNotesService {
  constructor(
    @InjectModel(DiaryNote.name) private diaryNoteModel: Model<DiaryNoteDocument>,
  ) {}

  async findAll(): Promise<DiaryNoteDocument[]> {
    return await this.diaryNoteModel.find();
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<DiaryNoteDocument[]> {
    return await this.diaryNoteModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findOne(id: string): Promise<DiaryNoteDocument> {
    return await this.diaryNoteModel.findById(id);
  }

  // async create(dto: any): Promise<DiaryNoteDocument> {}
}
