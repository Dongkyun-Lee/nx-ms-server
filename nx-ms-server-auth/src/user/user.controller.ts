import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
  DeleteUserResponseDto,
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './dto/user.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserHeaders } from 'src/common/type/user-headers.interface';
import { AuthenticatedUser } from 'src/common/decorator/authenticated-user.decorator';
import { AuthenticatedUserInfo } from 'src/common/type';

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

  @Patch('/my')
  @ApiOperation({
    summary: '유저 수성',
    description: '유저 정보 수정',
  })
  @UserHeaders
  updateUser(
    @AuthenticatedUser() user: AuthenticatedUserInfo,
    @Body() body: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    if (user.email !== body.email) {
      throw new BadRequestException(`Email mismatch: Unauthorized user`);
    }
    return this.userService.updateUser(user.email, body);
  }

  @Delete('/my/:id')
  @ApiOperation({
    summary: '유저 수성',
    description: '유저 정보 수정',
  })
  @UserHeaders
  @ApiParam({ name: 'id', type: String })
  deleteUser(
    @AuthenticatedUser() user: AuthenticatedUserInfo,
    @Param('id') body: string,
  ): Promise<DeleteUserResponseDto> {
    if (user.id !== body) {
      throw new BadRequestException(`Id mismatch: Unauthorized user`);
    }
    return this.userService.deleteUser(user);
  }
}
