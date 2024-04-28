import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './users/service/service.service';
import { UserController } from './users/controller/controller.controller';
import { ChatsService } from './chats/service/service.service';
import { ChatGateway } from './chats/gateway/gateway.gateway';
import { ChatsModule } from './chats/module/module.module';
import { ChatsController } from './chats/controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/module/module.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),MongooseModule.forRoot("mongodb://localhost:27017/chat_app"), ChatsModule,UsersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
