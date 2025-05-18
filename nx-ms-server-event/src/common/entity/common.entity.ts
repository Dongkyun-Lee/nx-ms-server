import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CommonEntity {
  @ApiProperty({ description: '생성 일시' })
  @Prop()
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  @Prop()
  updatedAt: Date;

  @ApiProperty({ description: '삭제 여부' })
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty({ description: '삭제 일시' })
  @Prop({ default: false })
  deletedAt: Date;
}
