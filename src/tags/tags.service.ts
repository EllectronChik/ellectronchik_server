import { Injectable } from '@nestjs/common';
import { Tag, TagDocument } from './schema/tag.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { createTagInput } from './dto/create-tag.input';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
  ) {}

  async findAll(): Promise<TagDocument[]> {
    return this.tagModel.find();
  }

  async findOne(id: string, userId: string): Promise<TagDocument> {
    if (userId) {
      return this.tagModel.findOne({ _id: id, userId });
    }
    return null;
  }

  async findTagsByUser(userId: string): Promise<TagDocument[]> {
    return this.tagModel.find({ userId });
  }

  async create(dto: createTagInput, userId: string): Promise<TagDocument> {
    return this.tagModel.create({ ...dto, userId });
  }
}
