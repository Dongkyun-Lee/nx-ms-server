import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUserHealth(): string {
    return 'users';
  }
}
