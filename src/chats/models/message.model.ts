import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Chat, ChatDocument } from './chat.model';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  sender: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Chat' })
  chat: Chat;
}

export const MessageSchema = SchemaFactory.createForClass(Message);