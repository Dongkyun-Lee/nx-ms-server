import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto, CreateUserResponseDto } from './dto/user.dto';
import { AuthenticatedUser } from 'src/common/decorator/authenticated-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  postUser(
    @Body() createDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return this.userService.createUser(createDto);
  }

  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.findByEmail(email);
  }
}
