import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto, CreateUserResponseDto } from './dto/user.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '유저 생성',
    description:
      'nickname, email, password 기반 유저 생성 요청<br>(defaults ROLES = [USER])',
  })
  postUser(
    @Body() createDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return this.userService.createUser(createDto);
  }

  @Get(':email')
  @ApiOperation({
    summary: 'email 유저 조회',
    description: '타깃 email로 유저 조회 요청',
  })
  @ApiParam({ name: 'email', description: '타깃 유저 이메일', type: String })
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }
}
