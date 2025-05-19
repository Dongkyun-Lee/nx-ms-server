import { ApiHeaders } from '@nestjs/swagger';

export const UserHeaders = ApiHeaders([
  { name: 'ms-user-id', description: '유저 고유 아이디', required: true },
  { name: 'ms-user-email', description: '유저 이메일', required: true },
  {
    name: 'ms-user-roles',
    description: '유저 권한 목록 (쉼표 구분)',
    required: true,
  },
  { name: 'ms-user-nickname', description: '유저 닉네임', required: false },
]);
