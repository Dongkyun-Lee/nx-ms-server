import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entity/user.entity';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
  DeleteUserRequestDto,
  DeleteUserResponseDto,
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(
    createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return CreateUserResponseDto.fromDocument(await createdUser.save());
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByNickName(nickname: string): Promise<User | null> {
    return this.userModel.findOne({ nickname }).exec();
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, (user as any).password))) {
      return user;
    }
    return null;
  }

  async updateUser(
    email: string,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ email }, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with Email "${email}" not found`);
    }
    return UpdateUserResponseDto.fromDocument(updatedUser);
  }

  async deleteUser(req: DeleteUserRequestDto): Promise<DeleteUserResponseDto> {
    const { email } = req;
    const deletedUser = await this.userModel
      .findOneAndUpdate({ email }, { isDeleted: true, deletedAt: Date.now })
      .exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with EMAIL "${email}" not found`);
    }
    return DeleteUserResponseDto.fromDocument(deletedUser);
  }
}
