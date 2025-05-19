import { ApiHeaders } from '@nestjs/swagger';

export const UserHeaders = ApiHeaders([
  { name: 'ms-user-id', description: '유저 고유 ID', required: true },
  { name: 'ms-user-nickname', description: '유저 닉네임', required: false },
  {
    name: 'ms-user-roles',
    description: '유저 권한 목록 (쉼표 구분)',
    required: true,
  },
]);
