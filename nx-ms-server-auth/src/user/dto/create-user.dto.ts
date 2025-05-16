import { PartialType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';

export class CreateUserDto extends PartialType(UserBaseDto) {}
