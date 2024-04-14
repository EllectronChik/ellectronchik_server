import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  DiaryNoteMedia,
  DiaryNoteMediaDocument,
} from './schema/diary-notes-media.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { createDiaryNotesMediaDto } from './dto/createDiaryNotesMediaDto';
import IFile from 'src/models/IFile';
import { DiaryNote, DiaryNoteDocument } from 'src/diary-notes/schema/diaryNote.schema';

@Injectable()
export class DiaryNotesMediaService {
  constructor(
    @InjectModel(DiaryNoteMedia.name)
    private diaryNoteMediaModel: Model<DiaryNoteMediaDocument>,
    @InjectModel(DiaryNote.name) private diaryNoteModel: Model<DiaryNoteDocument>,
  ) {}

  private extractExtension(filename: string) {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  async createFile(
    file: IFile,
    dto: createDiaryNotesMediaDto,
  ): Promise<DiaryNoteMediaDocument> {
    try {
      const fileName =
        uuidv4() + '.' + this.extractExtension(file.originalname);

      const filePath = path.resolve(__dirname, '..', '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      const media = await this.diaryNoteMediaModel.create({
        diaryNoteId: dto.noteId,
        mediaPath: fileName,
        mediaIVHex: dto.iv,
      });

      const note = await this.diaryNoteModel.findById(dto.noteId);
      note.diaryNoteMedia.push(media._id);
      await note.save();
      return media;
    } catch (e) {
      throw new HttpException(
        'File upload error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(id: string) {
    return await this.diaryNoteMediaModel.findByIdAndDelete(id);
  }
}
