import { ApiProperty } from '@nestjs/swagger';

export class RewardDto {
  @ApiProperty({ description: '보상 이름' })
  name: string;

  @ApiProperty({ description: '보상 설명' })
  description?: string;

  @ApiProperty({ description: '보상 유형' })
  type: string;

  @ApiProperty({ description: '보상 활성화 여부' })
  isActive: boolean;
}
