import { PartialType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';

export class LoginRequestDto extends PartialType(UserBaseDto) {}
