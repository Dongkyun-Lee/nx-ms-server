import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이름' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: '사용자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
