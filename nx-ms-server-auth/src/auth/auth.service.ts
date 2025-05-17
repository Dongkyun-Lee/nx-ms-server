import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User, UserDocument } from '../user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async generateJwt(user: User): Promise<string> {
    const payload = {
      sub: (user as UserDocument)?._id,
      email: user.email,
      nickname: user.nickname,
      roles: user.roles,
    };
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(): Promise<string> {
    return uuidv4();
  }

  async extendJwtExpirationWithRefreshToken(refreshToken: string, email: string): Promise<RefreshResponseDto> {
    const user = await this.usersService.findByEmail(email);
    console.log(user.refreshToken);
    console.log(refreshToken);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    const newRefresh = uuidv4();
    this.updateRefreshToken(email, newRefresh);
    const jwt = await this.generateJwt(user);

    return { accessToken: jwt, refreshToken: newRefresh };
  }

  async verifyJwt(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      // 유효한 토큰이 아닐 때
      return null;
    }
  }

  async decodeJwt(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    console.error(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate({ email }, { refreshToken }, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with Email "${email}" not found`);
    }
    return updatedUser;
  }
}
