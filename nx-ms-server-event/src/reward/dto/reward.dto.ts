import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { CommonDto } from 'src/common/dto/common.dto';
import { RewardDocument } from '../entities/reward.entity';
import { Type } from 'class-transformer';
import { EventDto } from 'src/event/dto/event.dto';

function mapRewardDocToDto<T extends Partial<RewardDto>>(doc: RewardDocument, dto: T): T {
  dto.id = doc._id.toString();
  dto.name = doc.name;
  dto.description = doc.description;
  dto.type = doc.type;
  dto.amount = doc.amount;
  dto.createdAt = doc.createdAt;
  dto.updatedAt = doc.updatedAt;
  dto.isDeleted = doc.isDeleted;
  dto.deleteAt = doc.deletedAt;
  if (doc.eventIds && doc.eventIds.length > 0) {
    if (typeof doc.eventIds[0] === 'object' && '_id' in doc.eventIds[0]) {
      dto.events = (doc.eventIds as any[]).map((e) => ({
        id: e._id.toString(),
        name: e.name,
      }));
    } else {
      dto.eventIds = (doc.eventIds as any[]).map((id) => id.toString());
      dto.events = [];
    }
  }
  return dto;
}

export class RewardDto extends CommonDto {
  @ApiProperty({ description: '보상 이름' })
  name: string;

  @ApiProperty({ description: '연결된 이벤트 아이디 리스트', type: [String], default: [] })
  eventIds: string[];

  @ApiProperty({ description: '연결된 이벤트 객체 리스트', type: [PartialType(EventDto)], default: [] })
  events: Partial<EventDto>[];

  @ApiProperty({ description: '보상 설명' })
  description?: string;

  @ApiProperty({ description: '보상 유형' })
  type: string;

  @ApiProperty({ description: '보상 개수', required: true, default: 1 })
  amount: number;

  static fromDocument(entity: RewardDocument): RewardDto {
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

export class CreateRewardRequestDto extends PartialType(RewardDto) {}
export class CreateRewardResponseDto extends PartialType(RewardDto) {
  static fromDocument(doc: RewardDocument) {
    return mapRewardDocToDto(doc, new CreateRewardResponseDto());
  }
}

export class GetRewardRequestDto extends PickType(RewardDto, ['id']) { }

export class GetRewardResponseDto extends PartialType(RewardDto) {
  static fromDocument(doc: RewardDocument): GetRewardResponseDto {
    return mapRewardDocToDto(doc, new GetRewardResponseDto());
  }
}

export class GetAllRewardResponseDto {
  constructor(rewards: GetRewardResponseDto[]) {
    this.rewards = rewards;
  }

  @ApiProperty({ description: '이벤트 목록', type: [GetRewardResponseDto] })
  @Type(() => GetRewardResponseDto)
  rewards: GetRewardResponseDto[];
}

export class UpdateRewardRequestDto extends PartialType(OmitType(RewardDto, ['id', 'updatedAt', 'createdAt'])) { }

export class UpdateRewardResponnseDto extends PartialType(RewardDto) {
  static fromDocument(doc: RewardDocument): UpdateRewardResponnseDto {
    return mapRewardDocToDto(doc, new UpdateRewardResponnseDto());
  }
}

export class DeleteRewardRequestDto extends PickType(RewardDto, ['id']) {}

export class DeleteRewardResponnseDto extends PartialType(RewardDto) {
  static fromDocument(doc: RewardDocument): DeleteRewardResponnseDto {
    return mapRewardDocToDto(doc, new DeleteRewardResponnseDto());
  }
}
