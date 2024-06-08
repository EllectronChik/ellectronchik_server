import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DiaryNotesMediaService } from './diary-notes-media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createDiaryNoteMediaInput } from './dto/create-diary-note-media.input';
import { HttpAuthGuard } from 'src/auth/httpAuth.guard';

@Controller('files')
export class DiaryNotesMediaController {
  constructor(private diaryNotesMediaService: DiaryNotesMediaService) {}

  @UseGuards(HttpAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @Body() dto: createDiaryNoteMediaInput,
  ) {
    if (!file || !dto.iv || !dto.noteId) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return await this.diaryNotesMediaService.createFile(file, dto);
  }

  @UseGuards(HttpAuthGuard)
  @Delete(':id')
  async deleteFile(
    @Param('id') id: string,
    @Req() req: { user: { sub: string } },
  ) {
    return await this.diaryNotesMediaService.deleteFile(id, req.user.sub);
  }

  @UseGuards(HttpAuthGuard)
  @Delete('all/:noteId')
  async deleteAllByNote(
    @Param('noteId') noteId: string,
    @Req() req: { user: { sub: string } },
  ) {
    await this.diaryNotesMediaService.deleteAllByNote(noteId, req.user.sub);
    throw new HttpException('Deleted', HttpStatus.NO_CONTENT);
  }
}
