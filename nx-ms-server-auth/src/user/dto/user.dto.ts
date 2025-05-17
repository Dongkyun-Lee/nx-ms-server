import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { UserDocument } from '../entity/user.entity';

export class UserBaseDto {
  @ApiProperty({ description: '아이디' })
  @IsString()
  id: string;

  @ApiProperty({ description: '닉네임' })
  @IsString()
  @MinLength(2)
  nickname: string;

  @ApiProperty({ description: '사용자 이메일' })
  @IsNotEmpty()
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

  @ApiProperty({ description: 'access token' })
  accessToken: string;

  @ApiProperty({ description: 'refresh token' })
  refreshToken: string;
}

export class CreateUserRequestDto extends PartialType(OmitType(UserBaseDto, ['id', 'accessToken', 'refreshToken', 'createdAt', 'updatedAt', 'roles'])) {}

export class CreateUserResponseDto extends PickType(UserBaseDto, ['id', 'nickname', 'email']) {

  static fromDocument(doc: UserDocument): CreateUserResponseDto {
    const dto = new CreateUserResponseDto();
    dto.id = doc._id.toString();
    dto.nickname = doc.nickname;
    dto.email = doc.email;
    return dto;
  }
}

export class UpdateUserRequestDto extends PartialType(UserBaseDto) {}

export class UpdateUserResponseDto extends PartialType(UserBaseDto) {}
