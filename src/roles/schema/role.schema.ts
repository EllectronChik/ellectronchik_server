import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schema/user.schema';

export type RoleDocument = Role & mongoose.Document;

@Schema()
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
