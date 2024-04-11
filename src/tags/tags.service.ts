import { Injectable } from '@nestjs/common';
import { Tag, TagDocument } from './schema/tag.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { createTagDto } from './dto/createTagDto';

@Injectable()
export class TagsService {

}
