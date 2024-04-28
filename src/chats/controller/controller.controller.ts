import { Controller } from '@nestjs/common';
import { ChatsService } from '../service/service.service';
import { Post, Body, Get, Param } from '@nestjs/common';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message } from '../models/message.model';


@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Post()
  async createChat(@Body() createChatDto: CreateChatDto): Promise<any> {
    try {
      const newChat = await this.chatService.createChat(createChatDto);
      return { status: 'success', data: newChat };
    } catch (error) {
      return { status: 'error', message: 'Failed to create chat.' };
    }
  }

  @Get(':chatId')
  async getChatById(@Param('chatId') chatId: string): Promise<any> {
    try {
      const chat = await this.chatService.getChatById(chatId);
      return { status: 'success', data: chat };
    } catch (error) {
      return { status: 'error', message: 'Failed to get chat.' };
    }
  }
  @Post(':id/messages')
  async createMessage(
    @Param('id') chatId: string,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return await this.chatService.createMessage(chatId, createMessageDto);
  }
  @Get('users/:firstUserId/:secondUserId')
  async getOrCreateChat(
    @Param('firstUserId') firstUserId: string,
    @Param('secondUserId') secondUserId: string,
  ): Promise<any>{
    return await this.chatService.getOrCreateChat(firstUserId, secondUserId);
  }
  @Get(':id/messages')
  async getMessages(@Param('id') chatId: string): Promise<Message[]> {
    return await this.chatService.getMessages(chatId);
  }
}
