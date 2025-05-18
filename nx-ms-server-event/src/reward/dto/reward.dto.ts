import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CommonDto } from 'src/common/dto/common.dto';
import { RewardDocument } from '../entities/reward.entity';

export class RewardDto extends CommonDto {
  @ApiProperty({ description: '보상 이름' })
  name: string;

  @ApiProperty({ description: '연결된 이벤트 아이디 리스트', type: [String], default: [] })
  eventIds: string[];

  @ApiProperty({ description: '보상 설명' })
  description?: string;

  @ApiProperty({ description: '보상 유형' })
  type: string;

  @ApiProperty({ description: '보상 개수', required: true, default: 1 })
  amount: number;

  static fromEntity(entity: RewardDocument): RewardDto {
    const dto = new RewardDto();
    dto.id = entity?._id?.toString();
    dto.name = entity.name;
    dto.eventIds = entity.eventIds.map((id) => (id.toString()))
    dto.description = entity.description;
    dto.type = entity.type;
    dto.amount = entity.amount;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.isDeleted = entity.isDeleted;
    dto.deleteAt = entity.deletedAt;
    return dto;
  }
}

export class CreateRewardRequestDto extends PartialType(PickType(RewardDto, ['id', 'name', 'description', 'type', 'amount'])) {}
