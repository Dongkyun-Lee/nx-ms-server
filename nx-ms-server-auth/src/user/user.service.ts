import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entity/user.entity';
import { CreateUserRequestDto, CreateUserResponseDto, UpdateUserRequestDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  getUserHealth(): string {
    return 'users';
  }

  async createUser(createUserDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
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

  async findByEmailAndPassword(email: string, password: string): Promise<User | null> {
    const user = this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, (user as any).password))) {
      return user;
    }
    return null;
  }

  async updateUser(email: string, updateUserDto: UpdateUserRequestDto): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate({ email }, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with Email "${email}" not found`);
    }
    return updatedUser;
  }

  async deleteUser(email: string): Promise<User> {
    const deletedUser = await this.userModel.findOneAndDelete({ email }).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with EMAIL "${email}" not found`);
    }
    return deletedUser;
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate({ email }, { refreshToken }, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with Email "${email}" not found`);
    }
    return updatedUser;
  }
}
