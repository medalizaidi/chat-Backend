import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from '../service/service.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../models/chat.model';
import { Message, MessageDocument } from '../models/message.model';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/models/user.model';

@WebSocketGateway({ cors: true }) 
export class ChatGateway implements OnGatewayDisconnect {
  constructor( @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,@InjectModel(User.name) private readonly userModel: Model<UserDocument>,private readonly chatService: ChatsService) {}
  
  
  async handleDisconnect(client: Socket) {
    const user = await this.userModel.findOne({ id: client.id });
    if (user) {
      this.server.emit('users-changed', { user: user.name, event: 'left' });
      user.id = null;
      await this.userModel.findByIdAndUpdate(user._id, user);
    }
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('typing')
  async handleTyping(client: Socket, data: { nickname: string, roomId: string, isTyping: boolean }) {
    client.broadcast.to(data.roomId).emit('typing', { nickname: data.nickname, isTyping: data.isTyping });
  }


  @SubscribeMessage('sendMessage')
  async handleMessage(client: any, payload: { chatId: string, message: CreateMessageDto }): Promise<void> {
    const { chatId, message } = payload;
    const savedMessage = await this.chatService.createMessage(chatId, message);
    this.server.to(chatId).emit('message', savedMessage);
  } 
  
}