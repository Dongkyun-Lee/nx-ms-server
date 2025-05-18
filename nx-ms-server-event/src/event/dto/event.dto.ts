import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { EventDocument } from '../entities/event.entity';
import { Type } from 'class-transformer';
import { CommonDto } from 'src/common/dto/common.dto';
import { CreateRewardRequestDto } from 'src/reward/dto/reward.dto';

function mapEventDocToDto<T extends Partial<EventDto>>(doc: EventDocument, dto: T): T {
  dto.id = doc._id.toString();
  dto.condition = doc.condition;
  dto.name = doc.name;
  dto.description = doc.description;
  dto.eventStartDate = doc.eventStartDate;
  dto.eventEndDate = doc.eventEndDate;
  dto.rewardStartDate = doc.rewardStartDate;
  dto.rewardEndDate = doc.rewardEndDate;
  dto.isActive = doc.isActive;
  dto.rewardIds = doc.rewardIds.map((id) => id.toString());
  dto.createdAt = doc.createdAt;
  dto.updatedAt = doc.updatedAt;
  dto.isDeleted = doc.isDeleted;
  return dto;
}

export class EventDto extends CommonDto {
  @ApiProperty({ description: '이벤트 이름', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '이벤트 달성 조건', required: true })
  condition: string;

  @ApiProperty({ description: '이벤트 설명' })
  description?: string;

  @ApiProperty({ description: '이벤트 시작일', required: true })
  eventStartDate: Date;

  @ApiProperty({ description: '이벤트 종료일', required: true })
  eventEndDate: Date;

  @ApiProperty({ description: '보상 수령 가능 시작일', required: true })
  rewardStartDate: Date;

  @ApiProperty({ description: '보상 수령 가능 종료일', required: true })
  rewardEndDate: Date;

  @ApiProperty({ description: '이벤트 활성화 여부' })
  isActive: boolean;

  @ApiProperty({
    type: [String],
    description: '보상 목록 아이디 리스트',
  })
  @IsArray()
  @ValidateNested({ each: true })
  rewardIds: string[];

  @ApiProperty({ type: [CreateRewardRequestDto], description: '보상 목록' })
  @IsArray()
  rewards: CreateRewardRequestDto[];
}

export class CreateEventRequestDto extends PartialType(OmitType(EventDto, ['id', 'createdAt', 'deleteAt', 'isDeleted'] )) { }

export class CreateEventResponseDto extends PartialType(EventDto) {
  static fromDocument(doc: EventDocument): CreateEventResponseDto {
    return mapEventDocToDto(doc, new CreateEventResponseDto());
  }
}
export class GetEventRequestDto extends PickType(EventDto, ['id']) {}

export class GetEventResponseDto extends PartialType(EventDto) {
  static fromDocument(doc: EventDocument): GetEventResponseDto {
    return mapEventDocToDto(doc, new GetEventResponseDto());
  }
}

export class GetAllEventResponseDto {
  constructor(events: GetEventResponseDto[]) {
    this.events = events;
  }

  @ApiProperty({ description: '이벤트 목록', type: [GetEventResponseDto] })
  @Type(() => GetEventResponseDto)
  events: GetEventResponseDto[];
}

export class UpdateEventRequestDto extends PartialType(OmitType(EventDto, ['id', 'updatedAt', 'createdAt'])) {}

export class UpdateEventResponnseDto extends PartialType(EventDto) {
  static fromDocument(doc: EventDocument): UpdateEventResponnseDto {
    return mapEventDocToDto(doc, new UpdateEventResponnseDto());
  }
}

export class DeleteEventRequestDto extends PickType(EventDto, ['id']) { }

export class DeleteEventResponnseDto extends PartialType(EventDto) {
  static fromDocument(doc: EventDocument): DeleteEventResponnseDto {
    return mapEventDocToDto(doc, new DeleteEventResponnseDto());
  }
}
