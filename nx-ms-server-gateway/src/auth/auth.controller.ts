import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ALL_ROLES_EXCEPT_ANONYMOUS, ROLES } from 'src/common/constants';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Roles(ROLES.ANONYMOUS)
  @Post('auth/login')
  async login(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.authService.post(req, req.path, body, headers, query);
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
    return await this.authService.post(req, req.path, body, headers, query);
  }

  @Public()
  @Roles(ROLES.ANONYMOUS)
  @Post('auth/verify')
  async verifyToken(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.authService.post(req, req.path, body, headers, query);
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
    return await this.authService.post(req, req.path, body, headers, query);
  }

  @Roles(...ALL_ROLES_EXCEPT_ANONYMOUS)
  @Get('user/:email')
  async getUserByEmail(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return this.authService.get(req, req.path, headers, query);
  }

  @Roles(...ALL_ROLES_EXCEPT_ANONYMOUS)
  @Patch('user/my')
  async updateUser(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.authService.post(req, req.path, body, headers, query);
  }

  @Roles(...ALL_ROLES_EXCEPT_ANONYMOUS)
  @Delete('user/my/:id')
  async deleteUser(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return this.authService.delete(req, req.path, headers, query);
  }
}
