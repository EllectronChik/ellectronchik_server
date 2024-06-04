import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schema/user.schema';

export type TagDocument = mongoose.Document & Tag;

@Schema()
export class Tag {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
