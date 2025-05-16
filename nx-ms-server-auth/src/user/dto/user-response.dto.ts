import { PartialType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';

export class UserResponseDto extends PartialType(UserBaseDto) {}
