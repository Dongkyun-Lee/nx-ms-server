import { Body, Controller, Get, Headers, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  async login(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.authService.login(req.path, body, headers, query);
  }

  @Post('auth/refresh')
  async refreshToken(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.authService.refreshToken(req.path, body, headers, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/profile')
  async getProfile(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return await this.authService.getProfile(req.path, headers, query);
  }

  @Post('auth/verify')
  async verifyToken(@Body('token') token: string) {
    const payload = await this.authService.verifyJwt(token);
    return { isValid: !!payload, payload };
  }

  @Post('user')
  async createUser(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.authService.createUser(req.path, body, headers, query);
  }

  @Get('user/:email')
  async getUserByEmail(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return this.authService.getUserByEmail(req.path, headers, query);
  }
}
