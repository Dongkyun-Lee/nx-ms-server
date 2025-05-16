import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginRequestDto } from '../../user/dto/login-request.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // body에 id 포함해야 함함
    super({ usernameField: 'id' });
  }

  async validate(id: number, password: string): Promise<any> {
    // 서비스 단 사용자 검증
    const user = await this.authService.validateUser(id, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
