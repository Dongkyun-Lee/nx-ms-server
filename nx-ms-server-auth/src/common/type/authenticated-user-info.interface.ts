import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUserInfo {
  @ApiProperty({ example: 'abc123', description: '유저 아이디' })
  id: string;

  @ApiProperty({ example: 'test@test.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: 'nickname', description: '닉네임' })
  nickname: string;

  @ApiProperty({ example: ['USER'], isArray: true, description: '권한 목록' })
  role: string[];
}
