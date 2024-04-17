import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshDocument = Refresh & Document;

@Schema()
export class Refresh {
  @Prop({ type: String, required: true })
  refreshToken: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Date, required: true })
  expires: Date;
}

export const RefreshSchema = SchemaFactory.createForClass(Refresh);
