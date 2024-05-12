import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiaryNote, DiaryNoteDocument } from './schema/diaryNote.schema';
import { Model } from 'mongoose';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateTaskInput } from '../tasks/dto/update-task.input';
import * as crypto from 'crypto';

type direction = -1 | 1;

@Injectable()
export class DiaryNotesService {
  constructor(
    @InjectModel(DiaryNote.name)
    private diaryNoteModel: Model<DiaryNoteDocument>,
  ) {}

  async findUserNotesPaginated(
    page: number,
    limit: number,
    direction: direction,
    userId: string,
  ): Promise<DiaryNoteDocument[]> {
    return await this.diaryNoteModel
      .find({ userId: userId })
      .sort({ createdAt: direction })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findOne(id: string, userId: string): Promise<DiaryNoteDocument> {
    return await this.diaryNoteModel.findOne({ _id: id, userId: userId });
  }

  async create(
    dto: CreateNoteInput,
    userId: string,
  ): Promise<DiaryNoteDocument> {
    const creationDateTime = new Date();
    return await this.diaryNoteModel.create({
      ...dto,
      userId: userId,
      createdAt: creationDateTime,
      updatedAt: null,
      encryptedMedia: [],
    });
  }

  async update(id: string, userId: string, updateTaskInput: UpdateTaskInput) {
    const task = await this.diaryNoteModel.findOneAndUpdate(
      { _id: id, userId },
      { ...updateTaskInput, updatedAt: new Date() },
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

  async findNotesByDates(
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number,
    direction: direction,
    userId: string,
  ): Promise<DiaryNoteDocument[]> {
    return await this.diaryNoteModel
      .find({ userId: userId, createdAt: { $gte: startDate, $lte: endDate } })
      .sort({ createdAt: direction })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findNotesByTags(
    tags: string[],
    page: number,
    limit: number,
    direction: direction,
    userId: string,
  ): Promise<DiaryNoteDocument[]> {
    return await this.diaryNoteModel
      .find({ userId: userId, tags: { $in: tags } })
      .sort({ createdAt: direction })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findNotesByTitle(
    decryptedTitle: string,
    key: string,
    userId: string,
  ): Promise<DiaryNoteDocument[]> {
    const notes = await this.diaryNoteModel.find({ userId: userId });
    return notes.filter((note) => {
      const encryptedTitle = note.encryptedTitle;
      if (!encryptedTitle) return false;
      const dechiperTitle = crypto.createDecipheriv(
        'aes-256-cbc',
        key,
        Buffer.from(note.iv, 'hex'),
      );
      const decrypted = Buffer.concat([
        dechiperTitle.update(Buffer.from(encryptedTitle, 'hex')),
        dechiperTitle.final(),
      ]).toString('utf-8');
      return decrypted.toLowerCase().includes(decryptedTitle.toLowerCase());
    });
  }

  async findNotes(
    userId: string,
    page?: number,
    limit?: number,
    direction?: direction,
    decryptedTitle?: string,
    key?: string,
    startDate?: Date,
    endDate?: Date,
    tags?: string[],
  ): Promise<DiaryNoteDocument[]> {
    let notes = await this.diaryNoteModel.find({ userId: userId });
    if (decryptedTitle && key) {
      notes = notes.filter((note) => {
        const encryptedTitle = note.encryptedTitle;
        if (!encryptedTitle) return false;
        const dechiperTitle = crypto.createDecipheriv(
          'aes-256-cbc',
          key,
          Buffer.from(note.iv, 'hex'),
        );
        const decrypted = Buffer.concat([
          dechiperTitle.update(Buffer.from(encryptedTitle, 'hex')),
          dechiperTitle.final(),
        ]).toString('utf-8');
        return decrypted.toLowerCase().includes(decryptedTitle.toLowerCase());
      });
    }

    if (startDate && endDate) {
      notes = notes.filter((note) => {
        return note.createdAt >= startDate && note.createdAt <= endDate;
      });
    }

    if (tags && tags.length > 0) {
      notes = notes.filter((note) => {
        return note.tags.some((tag) => tags.includes(tag._id));
      });
    }

    return direction === 1
      ? notes
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .slice((page - 1) * limit, page * limit)
      : notes
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .reverse()
          .slice((page - 1) * limit, page * limit);
  }
}
