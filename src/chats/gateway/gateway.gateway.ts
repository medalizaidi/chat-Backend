/* 
 import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from '../service/service.service';
import { CreateMessageDto } from '../dtos/create-message.dto';

@WebSocketGateway({cors:true})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatsService) {}


  @SubscribeMessage('addMessage')
  async handleAddMessage(client: Socket, data: { chatId: string, message: CreateMessageDto }): Promise<void> {
    const { chatId, message } = data;
    const createdMessage = await this.chatService.createMessage(chatId, message);
    this.server.to(chatId).emit('newMessage', createdMessage);
  }
  @SubscribeMessage('typing')
  handleTyping(client: Socket, chatId: string): void {
    client.to(chatId).emit('userTyping', client.id);
  }

  handleDisconnect(client: Socket): void {
    // Implement leave chat logic
  }

  handleConnection(client: Socket): void {
    const chatId = client.handshake.query.chat_id;
    client.join(chatId);
     console.log("connected,:, ",client.id);
  }
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, chatId: string) {
    client.join(chatId);
    console.log(client.id ,"joined roo", chatId);
  }

  @SubscribeMessage('getAllMessages')
  async handleGetAllMessages(client: Socket, chatId: string): Promise<void> {
    const messages = await this.chatService.getMessages(chatId);
    client.emit('allMessages', messages);
    console.log("connected,:, ",client.id);
  }
} 
 */
import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from '../service/service.service';
import { CreateMessageDto } from '../dtos/create-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private chatsService: ChatsService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, chatId: string): void {
    client.join(chatId);
  }

  @SubscribeMessage('addMessage')
  async handleAddMessage(client: Socket, data: { chatId: string, message: CreateMessageDto }): Promise<void> {
    const { chatId, message } = data;
    const createdMessage = await this.chatsService.createMessage(chatId, message);
    this.server.to(chatId).emit('newMessage', createdMessage);
  }

  @SubscribeMessage('getAllMessages')
  async handleGetAllMessages(client: Socket, chatId: string): Promise<void> {
    const messages = await this.chatsService.getMessages(chatId);
    client.emit('allMessages', messages);
  }

  handleDisconnect(client: Socket): void {
    console.log('Client disconnected:', client.id);
  }

  handleConnection(client: Socket): void {
    console.log('Client connected:', client.id);
  }
}