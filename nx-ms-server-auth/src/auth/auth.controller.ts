import { Controller, Post, Body, Request, UseGuards, Get, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.gurad';
import { UserService } from '../user/user.service';
import { LoginRequestDto, LoginResponsetDto, RefreshRequestDto, RefreshResponseDto } from './dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @ApiOperation({ summary: '이벤트 생성'})
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 201, description: '로그인 성공', type: LoginResponsetDto })
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

  @Post('verify')
  async verifyToken(@Body('token') token: string) {
    if (!token) {
      return { isValid: false, payload: null };
    }
    const payload = await this.authService.verifyJwt(token);
    return { isValid: !!payload, payload };
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Post('decode')
  async decodeToken(@Body('token') token: string) {
    const payload = this.authService.decodeJwt(token);
    return { payload };
  }
}
