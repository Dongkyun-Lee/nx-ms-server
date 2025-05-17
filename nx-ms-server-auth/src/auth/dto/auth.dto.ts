import { IsString, IsEmail, MinLength, IsNumber } from 'class-validator';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ description: '아이디' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '닉네임' })
  @IsString()
  @MinLength(2)
  nickname: string;

  @ApiProperty({ description: '사용자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: '사용자 역할',
    isArray: true,
    example: ['ANONYMOUS', 'AUDITOR', 'ADMIN', 'OPERATOR', 'USER'],
  })
  roles: string[];

  @ApiProperty({ description: 'access token' })
  accessToken: string;

  @ApiProperty({ description: 'refresh token' })
  refreshToken: string;
}

export class LoginRequestDto extends PickType(AuthDto, ['email', 'password']) {}

export class LoginResponsetDto extends PickType(AuthDto, ['accessToken', 'refreshToken']) {}

export class RefreshRequestDto extends PickType(AuthDto, ['id', 'refreshToken']) {}

export class RefreshResponsetDto extends PickType(AuthDto, ['accessToken', 'refreshToken']) {}
