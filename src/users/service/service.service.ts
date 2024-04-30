import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import { CreateUserDto } from '../dtos/create-user.dto';



@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

 
  async create(user: User): Promise<User> {
    // Check if the user already exists by some unique identifier (e.g., email)
    const existingUser = await this.userModel.findOne({ name: user.name }).exec();
      console.log(existingUser);
    if (existingUser) {
      // If the user already exists, return the existing user
      return existingUser;
    }

    // If the user doesn't exist, create and save the new user
    var createdUser =  await this.userModel.create(user);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }


}