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
import { createDiaryNoteMediaInput } from './dto/create-diary-note-media.input';
import IFile from 'src/models/IFile';
import {
  DiaryNote,
  DiaryNoteDocument,
} from 'src/diary-notes/schema/diaryNote.schema';
import { formats as imageFormats } from './../formats/image-formats.json';
import { formats as audioFormats } from './../formats/audio-formats.json';
import { formats as videoFormats } from './../formats/video-formats.json';

@Injectable()
export class DiaryNotesMediaService {
  constructor(
    @InjectModel(DiaryNoteMedia.name)
    private diaryNoteMediaModel: Model<DiaryNoteMediaDocument>,
    @InjectModel(DiaryNote.name)
    private diaryNoteModel: Model<DiaryNoteDocument>,
  ) {}

  private extractExtension(filename: string) {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  async createFile(
    file: IFile,
    dto: createDiaryNoteMediaInput,
  ): Promise<DiaryNoteMediaDocument> {
    try {
      const extension = this.extractExtension(file.originalname);
      let folderName: string;

      if (imageFormats.includes(extension.toLowerCase())) {
        folderName = 'images';
      } else if (audioFormats.includes(extension.toLowerCase())) {
        folderName = 'audio';
      } else if (videoFormats.includes(extension.toLowerCase())) {
        folderName = 'video';
      } else {
        folderName = 'unknown';
      }
      const fileName = uuidv4() + '.' + extension;

      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'static',
        folderName,
      );

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      const media = await this.diaryNoteMediaModel.create({
        diaryNoteId: dto.noteId,
        mediaPath: path.join(folderName, fileName),
        mediaIVHex: dto.iv,
      });

      const note = await this.diaryNoteModel.findById(dto.noteId);
      note.diaryNoteMedia.push(media.id);
      await note.save();
      return media;
    } catch (e) {
      throw new HttpException(
        'File upload error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAllByNote(noteId: string, userId: string) {
    const note = await this.diaryNoteModel.findById(noteId);
    if (note.userId !== userId) {
      console.log(note.userId, userId);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    if (!note) {
      throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
    }
    for (const media of note.diaryNoteMedia) {
      const mediaDoc = await this.diaryNoteMediaModel.findById(media);
      try {
        const filePath = path.resolve(
          __dirname,
          '..',
          '..',
          'static',
          mediaDoc.mediaPath,
        );
        fs.unlinkSync(filePath);
      } catch (e) {
        console.log(e);
      }
    }
    await note.updateOne({ diaryNoteMedia: [] });
    return await this.diaryNoteMediaModel.deleteMany({ diaryNoteId: noteId });
  }

  async deleteFile(id: string, userId: string) {
    const media = await this.diaryNoteMediaModel.findById(id);
    if (!media) {
      throw new HttpException('Media not found', HttpStatus.NOT_FOUND);
    }
    const note = await this.diaryNoteModel.findById(media.diaryNoteId);
    if (note.userId !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    try {
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'static',
        media.mediaPath,
      );
      fs.unlinkSync(filePath);
    } catch (e) {
      console.log(e);
    }
    await this.diaryNoteModel.updateOne(
      { _id: media.diaryNoteId },
      { $pull: { diaryNoteMedia: id } },
    );
    return await this.diaryNoteMediaModel.findByIdAndDelete(id);
  }
}
