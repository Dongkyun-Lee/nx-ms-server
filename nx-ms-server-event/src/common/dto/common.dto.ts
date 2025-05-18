import { ApiProperty } from '@nestjs/swagger';

export class CommonDto {
  @ApiProperty({ description: '[공통통]아이디' })
  id: string;

  @ApiProperty({ description: '[공통통]생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '[공통통]수정 일시' })
  updatedAt: Date;

  @ApiProperty({ description: '[공통통]삭제 여부', default: false })
  isDeleted: boolean;

  @ApiProperty({ description: '[공통통]삭제 일시', default: false })
  deleteAt: Date;
}
