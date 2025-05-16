import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async generateJwt(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      nickName: user.nickName,
      roles: user.roles,
    };
    return await this.jwtService.signAsync(payload);;
  }

  async generateRefreshToken(): Promise<string> {
    return uuidv4();
  }

  async extendJwtExpirationWithRefreshToken(refreshToken: string, userId: number): Promise<string> {
    const user = await this.usersService.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    return await this.generateJwt(user);

    // TODO: refresh token 재사용 방지 로직 추가
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

  async validateUser(id: number, password: string): Promise<User | null> {
    const user = await this.usersService.findById(id);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
