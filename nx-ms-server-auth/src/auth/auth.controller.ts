import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.gurad';
import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshRequestDto,
  RefreshResponseDto,
  VerifyTokenRequestDto,
} from './dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserBaseDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인 요청' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user as UserBaseDto);
  }

  @ApiOperation({ summary: '토큰 갱신 요청' })
  @ApiBody({ type: RefreshRequestDto })
  @ApiResponse({
    status: 201,
    description: '토큰 갱신 성공',
    type: RefreshResponseDto,
  })
  @Post('refresh')
  async refreshToken(
    @Body() body: RefreshRequestDto,
  ): Promise<RefreshResponseDto> {
    const newJwt = await this.authService.extendJwtExpirationWithRefreshToken(
      body.refreshToken,
      body.email,
    );
    return newJwt;
  }

  @ApiOperation({ summary: '토큰 검증 요청' })
  @ApiBody({ type: VerifyTokenRequestDto })
  @ApiResponse({
    status: 201,
    description: '토큰 검증 요청 성공',
    type: RefreshResponseDto,
  })
  @Post('verify')
  async verifyToken(@Body('token') token: string) {
    if (!token) {
      return { isValid: false, payload: null };
    }
    return await this.authService.verifyJwt(token);
  }
}
