import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose'; // Import SchemaTypes for ObjectId
import { Message } from './message.model';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
  firstUser: string;

  @Prop({ required: true })
  secondUser: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Message' }] }) // Correct reference to SchemaTypes.ObjectId
  messages: Message[];
  static message: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);