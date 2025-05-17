import { Body, Controller, Get, Headers, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ALL_ROLES_EXCEPT_ANONYMOUS, ROLES } from 'src/common/constants';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Roles(ROLES.ANONYMOUS)
  @Post('/verify')
  async verifyToken(@Body('token') token: string) {
    if (!token) {
      return { isValid: false, payload: null };
    }
    const payload = await this.authService.verifyJwt(token);
    return { isValid: !!payload, payload };
  }

  @Public()
  @Roles(ROLES.ANONYMOUS)
  @Post('auth/login')
  async login(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.authService.login(req.path, body, headers, query);
  }

  @Public()
  @Roles(ROLES.ANONYMOUS)
  @Post('auth/refresh')
  async refreshToken(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.authService.refreshToken(req.path, body, headers, query);
  }

  @Roles(ROLES.USER, ROLES.OPERATOR, ROLES.AUDITOR, ROLES.ADMIN)
  @Get('auth/profile')
  async getProfile(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return await this.authService.getProfile(req.path, headers, query);
  }

  @Public()
  @Roles(ROLES.ANONYMOUS)
  @Post('user')
  async createUser(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.authService.createUser(req.path, body, headers, query);
  }

  @Roles(...ALL_ROLES_EXCEPT_ANONYMOUS)
  @Get('user/:email')
  async getUserByEmail(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return this.authService.getUserByEmail(req.path, headers, query);
  }
}
