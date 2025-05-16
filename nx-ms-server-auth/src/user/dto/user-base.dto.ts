import { IsString, IsEmail, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserBaseDto {
  @ApiProperty({ description: '아이디' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '닉네임' })
  @IsString()
  @MinLength(2)
  nickName: string;

  @ApiProperty({ description: '사용자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  updatedAt: Date;

  @ApiProperty({
    description: '사용자 역할',
    isArray: true,
    example: ['ANONYMOUS', 'AUDITOR', 'ADMIN', 'OPERATOR', 'USER'],
  })
  roles: string[];
}
