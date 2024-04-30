import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat, ChatDocument } from '../models/chat.model';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message, MessageDocument } from '../models/message.model';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
  ) {} async createChat(createChatDto: CreateChatDto): Promise<any> {
    const { firstUser, secondUser } = createChatDto;
    const existingChat = await this.chatModel.findOne({
      $or: [
        { firstUser, secondUser },
        { firstUser: secondUser, secondUser: firstUser },
      ],
    }).exec();

    if (existingChat) {
      return existingChat;
    }

    const newChat = new this.chatModel(createChatDto);
    return await newChat.save();
  }

  async getChatById(chatId: string): Promise<any> {
    return await this.chatModel.findById(chatId).populate('messages');
  }

  /* async createMessage(chatId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    const { text, sender } = createMessageDto;
    const message = new this.messageModel({ text, sender, chat: chatId });
    return await message.save();
  } */
  async createMessage(chatId: string, messageDto: CreateMessageDto): Promise<Message> {
    const message = new this.messageModel({
        ...messageDto,
        chat: chatId, // Ensure that chatId is correctly assigned
    });
    return await message.save();
}
  
  async getOrCreateChat(firstUserId: string, secondUserId: string): Promise<any> {let chat = await this.chatModel.findOne({
    $or: [
      { firstUser: firstUserId, secondUser: secondUserId },
      { firstUser: secondUserId, secondUser: firstUserId },
    ],
  }).populate('messages');

  if (!chat) {
    chat = await this.createChat({
      firstUser: firstUserId,
      secondUser: secondUserId,
    });
  }

  return chat;
}
async getMessages(chatId: string): Promise<Message[]> {
    return await this.messageModel.find({ chat: chatId }).exec();
  }
}