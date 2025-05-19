import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { UserDocument } from '../entity/user.entity';
import { ROLES } from 'src/common/constant';
import { Types } from 'mongoose';

export class UserBaseDto {
  @ApiProperty({ description: '아이디' })
  id: Types.ObjectId;

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
    enum: ROLES,
    isArray: true,
    example: [
      ROLES.ADMIN,
      ROLES.ANONYMOUS,
      ROLES.AUDITOR,
      ROLES.OPERATOR,
      ROLES.USER,
    ],
  })
  roles: ROLES;

  @ApiProperty({ description: 'refresh token' })
  refreshToken: string;

  @ApiProperty({ description: '사용자 삭제 여부', default: false })
  isDeleted: boolean;

  @ApiProperty({ description: '사용자 삭제 일시' })
  deletedAt: Date;
}

export class CreateUserRequestDto extends PartialType(
  OmitType(UserBaseDto, ['id', 'refreshToken', 'createdAt', 'updatedAt']),
) {}

export class CreateUserResponseDto extends PickType(UserBaseDto, [
  'id',
  'nickname',
  'email',
]) {
  static fromDocument(doc: UserDocument): CreateUserResponseDto {
    const dto = new CreateUserResponseDto();
    dto.id = doc._id as Types.ObjectId;
    dto.nickname = doc.nickname;
    dto.email = doc.email;
    return dto;
  }
}

export class UpdateUserRequestDto extends PartialType(UserBaseDto) {}

export class UpdateUserResponseDto extends PartialType(
  OmitType(UserBaseDto, ['password', 'refreshToken']),
) {
  static fromDocument(doc: UserDocument): UpdateUserResponseDto {
    const dto = new UpdateUserResponseDto();
    dto.id = doc._id as Types.ObjectId;
    dto.nickname = doc.nickname;
    dto.email = doc.email;
    dto.updatedAt = doc.updatedAt;
    return dto;
  }
}

export class DeleteUserRequestDto extends PickType(UserBaseDto, ['email']) {}

export class DeleteUserResponseDto extends PickType(UserBaseDto, [
  'email',
  'isDeleted',
  'deletedAt',
]) {
  static fromDocument(doc: UserDocument): DeleteUserResponseDto {
    const dto = new DeleteUserResponseDto();
    dto.email = doc.email;
    dto.isDeleted = doc.isDeleted;
    dto.deletedAt = doc.deletedAt;
    return dto;
  }
}
