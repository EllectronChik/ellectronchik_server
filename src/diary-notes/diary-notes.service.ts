import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiaryNote, DiaryNoteDocument } from './schema/diaryNote.schema';
import { Model } from 'mongoose';
import { createDiaryNoteDto } from './dto/createDiaryNoteDto';

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

  async create(dto: createDiaryNoteDto): Promise<DiaryNoteDocument> {
    const creationDateTime = new Date();
    return await this.diaryNoteModel.create({
      ...dto,
      createdAt: creationDateTime,
      updatedAt: null,
      encryptedMedia: [],
    });
  }

  async updateText(
    id: string,
    encryptedText: string,
    userId: string,
  ): Promise<DiaryNoteDocument> {
    const updateDateTime = new Date();
    const updatedNote = await this.diaryNoteModel.findOneAndUpdate(
      { _id: id, userId: userId },
      {
        encryptedText: encryptedText,
        updatedAt: updateDateTime,
      },
      { new: true },
    );
    return updatedNote;
  }

  async updateTitle(
    id: string,
    encryptedTitle: string,
    userId: string,
  ): Promise<DiaryNoteDocument> {
    const updateDateTime = new Date();
    const updatedNote = await this.diaryNoteModel.findOneAndUpdate(
      { _id: id, userId: userId },
      {
        encryptedTitle: encryptedTitle,
        updatedAt: updateDateTime,
      },
      { new: true },
    );
    return updatedNote;
  }

  async updateTags(
    id: string,
    tags: string[],
    userId: string,
  ): Promise<DiaryNoteDocument> {
    const updateDateTime = new Date();
    const updatedNote = await this.diaryNoteModel.findOneAndUpdate(
      { _id: id, userId: userId },
      {
        tags: tags,
        updatedAt: updateDateTime,
      },
      { new: true },
    );
    return updatedNote;
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
