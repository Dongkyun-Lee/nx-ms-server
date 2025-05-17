import { Controller, Post, Body, Request, UseGuards, Get, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.gurad';
import { JwtAuthGuard } from './guard/jwt.gurad';
import { UserService } from '../user/user.service';
import { LoginResponsetDto, RefreshRequestDto, RefreshResponseDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any): Promise<LoginResponsetDto> | null {
    const user = req.user;
    if (!user) {
      throw new NotFoundException({}, '등록되지 않은 사용자입니다. \n email과 비밀번호를 확인해주세요');
    }
    const jwt = await this.authService.generateJwt(user);
    const refreshToken = await this.authService.generateRefreshToken();
    await this.authService.updateRefreshToken(user.email, refreshToken);
    return { accessToken: jwt, refreshToken };
  }

  @Post('refresh')
  async refreshToken(@Body() body: RefreshRequestDto): Promise<RefreshResponseDto> {
    const newJwt = await this.authService.extendJwtExpirationWithRefreshToken(body.refreshToken, body.email);
    return newJwt;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Post('verify')
  async verifyToken(@Body('token') token: string) {
    const payload = await this.authService.verifyJwt(token);
    return { isValid: !!payload, payload };
  }

  @Post('decode')
  async decodeToken(@Body('token') token: string) {
    const payload = this.authService.decodeJwt(token);
    return { payload };
  }
}
