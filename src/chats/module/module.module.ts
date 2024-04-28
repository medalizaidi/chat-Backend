import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '../models/chat.model';
import { Message, MessageSchema } from '../models/message.model';
import { ChatsController } from '../controller/controller.controller';
import { ChatsService } from '../service/service.service';
import { ChatGateway } from '../gateway/gateway.gateway';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      // Added the import for Message model
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}