import { PartialType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';

export class UpdateUserDto extends PartialType(UserBaseDto) {}
