import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.gurad';
import { JwtAuthGuard } from './guard/jwt.gurad';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from '../user/dto/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginRequestDto: LoginRequestDto) {
    const jwt = await this.authService.generateJwt(req.user);
    const refreshToken = await this.authService.generateRefreshToken();
    await this.usersService.updateRefreshToken(req.user.id, refreshToken);
    return { accessToken: jwt, refreshToken };
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string, @Body('id') id: number) {
    const newJwt = await this.authService.extendJwtExpirationWithRefreshToken(refreshToken, id);
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
