import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiaryNote, DiaryNoteDocument } from './schema/diaryNote.schema';
import { Model } from 'mongoose';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateTaskInput } from '../tasks/dto/update-task.input';

@Injectable()
export class DiaryNotesService {
  constructor(
    @InjectModel(DiaryNote.name)
    private diaryNoteModel: Model<DiaryNoteDocument>,
  ) {}

  async findUserNotesPaginated(
    page: number,
    limit: number,
    userId: string,
  ): Promise<DiaryNoteDocument[]> {
    return await this.diaryNoteModel
      .find({ userId: userId })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findOne(id: string, userId: string): Promise<DiaryNoteDocument> {
    return await this.diaryNoteModel.findOne({ _id: id, userId: userId });
  }

  async create(dto: CreateNoteInput): Promise<DiaryNoteDocument> {
    const creationDateTime = new Date();
    return await this.diaryNoteModel.create({
      ...dto,
      createdAt: creationDateTime,
      updatedAt: null,
      encryptedMedia: [],
    });
  }

  async update(id: string, userId: string, updateTaskInput: UpdateTaskInput) {
    const task = await this.diaryNoteModel.findOneAndUpdate(
      { _id: id, userId },
      updateTaskInput,
      { new: true },
    );
    return task;
  }

  async delete(id: string, userId: string): Promise<DiaryNoteDocument> {
    const deletedNote = await this.diaryNoteModel.findOneAndDelete({
      _id: id,
      userId: userId,
    });
    return deletedNote;
  }

  async countNotesByTag(tagId: string, userId: string): Promise<number> {
    return await this.diaryNoteModel.countDocuments({
      tags: { $in: [tagId] },
      userId,
    });
  }
}
