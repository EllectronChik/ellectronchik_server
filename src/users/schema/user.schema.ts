import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/roles/schema/role.schema';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  // @Prop()
  // tasks: Task[];

  // @Prop()
  // goals: Goal[];

  // @Prop()
  // diaryNotes: DiaryNote[];
}

export const UserSchema = SchemaFactory.createForClass(User);
