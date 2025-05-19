import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User, UserDocument } from '../user/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginResponseDto, RefreshResponseDto } from './dto/auth.dto';
import { UserBaseDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async login(user: UserBaseDto): Promise<LoginResponseDto> {
    const jwt = await this.generateJwt(user);
    const refreshToken = await this.generateRefreshToken();
    await this.updateRefreshToken(user.email, refreshToken);
    return { accessToken: jwt, refreshToken };
  }

  async generateJwt(user: Partial<UserBaseDto>): Promise<string> {
    const payload = {
      sub: (user as UserDocument)?._id,
      email: user.email,
      nickname: user.nickname,
      roles: user.roles || ['ANONYMOUS'],
    };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async generateRefreshToken(): Promise<string> {
    return uuidv4();
  }

  async extendJwtExpirationWithRefreshToken(
    refreshToken: string,
    email: string,
  ): Promise<RefreshResponseDto> {
    const user = await this.usersService.findByEmailForValidate(email);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    const newRefresh = uuidv4();
    this.updateRefreshToken(email, newRefresh);
    const jwt = await this.generateJwt(user);

    return { accessToken: jwt, refreshToken: newRefresh };
  }

  async decodeJwt(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }

  async verifyJwt(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return { isValid: !!payload, payload };
    } catch (error) {
      return null;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmailForValidate(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ email }, { refreshToken }, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`Error occured while updating refreshToken`);
    }
    return updatedUser;
  }
}
