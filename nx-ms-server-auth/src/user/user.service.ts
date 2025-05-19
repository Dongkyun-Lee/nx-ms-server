import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entity/user.entity';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
  DeleteUserRequestDto,
  DeleteUserResponseDto,
  FindByEmailResponseDto,
  UpdateUserRequestDto,
  UpdateUserResponseDto,
  UserBaseDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(
    createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    // email 겹치면 exception
    const user = await this.userModel
      .findOne({ email: createUserDto.email })
      .lean()
      .exec();
    if (user) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

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

  // controller 에서 호출하는 메소드. password 미노출
  async getUserByEmail(email: string): Promise<FindByEmailResponseDto> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    if (!user) {
      throw new NotFoundException(`Failed to find user with email ${email}`);
    }
    return FindByEmailResponseDto.fromDoc(user);
  }

  // 서비스 내부적으로 호출하는 메소드
  async findByEmailForValidate(email: string): Promise<UserBaseDto> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    if (!user) {
      // Email or password 잘못된 정보 미노출
      throw new NotFoundException(`Email or password is invalid`);
    }
    return UserBaseDto.fromDoc(user);
  }

  async findByNickName(nickname: string): Promise<FindByEmailResponseDto> {
    const user = this.userModel.findOne({ nickname }).lean().exec();
    if (!user) {
      throw new NotFoundException(`Failed to find user with email ${nickname}`);
    }
    return;
  }

  async updateUser(
    email: string,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    if (!updateUserDto.id && !updateUserDto.email) {
      throw new BadRequestException(
        `${updateUserDto.id} or ${updateUserDto.email} are required`,
      );
    }
    const user = updateUserDto.id
      ? await this.userModel.findById(updateUserDto.id).lean().exec()
      : await this.userModel
          .findOne({ email: updateUserDto.email })
          .lean()
          .exec();
    if (!user) {
      throw new NotFoundException(
        `User with id(or email) with ${updateUserDto.id || updateUserDto.email} does not exist`,
      );
    }

    const updatedUser = updateUserDto.id
      ? await this.userModel
          .findByIdAndUpdate(updateUserDto.id, updateUserDto, { new: true })
          .lean()
          .exec()
      : await this.userModel
          .findOneAndUpdate({ email: updateUserDto.email }, updateUserDto, {
            new: true,
          })
          .lean()
          .exec();
    if (!updatedUser) {
      throw new NotFoundException(
        `Error occured while updating User with id(or email) ${updateUserDto.id || updateUserDto.email}`,
      );
    }
    return UpdateUserResponseDto.fromDocument(updatedUser);
  }

  async deleteUser(req: DeleteUserRequestDto): Promise<DeleteUserResponseDto> {
    const { email } = req;
    const user = await this.userModel.findOne({ email }).lean().exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} does not exists`);
    }
    if (user.isDeleted) {
      throw new BadRequestException(
        `User widht email ${email} is already deleted`,
      );
    }
    const deletedUser = await this.userModel
      .findOneAndUpdate({ email }, { isDeleted: true, deletedAt: Date.now })
      .exec();
    if (!deletedUser) {
      throw new NotFoundException(
        `Error occured while deleting User with email ${email}`,
      );
    }
    return DeleteUserResponseDto.fromDocument(deletedUser);
  }
}
