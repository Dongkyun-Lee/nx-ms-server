import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto, CreateUserResponseDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('healthCheck')
  getUserHealth(): string {
    return this.userService.getUserHealth();
  }

  @Post()
  postUser(@Body() createDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return this.userService.createUser(createDto);
  }

  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // throw new NotFoundException({ status: 404, data: null, error:  true, errorMessage: `${email} 유저가 존재하지 않습니다.` },`${email} 유저가 존재하지 않습니다.`)
      return { status: 404, data: null, error:  true, errorMessage: `${email} 유저가 존재하지 않습니다.` }
    }
    return user;
  }
}
