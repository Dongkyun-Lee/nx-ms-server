import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { EventDocument } from '../entities/event.entity';
import { Type } from 'class-transformer';

function mapEventDocToDto<T extends Partial<EventDto>>(doc: EventDocument, dto: T): T {
  dto.id = doc._id.toString();
  dto.name = doc.name;
  dto.description = doc.description;
  dto.eventStartDate = doc.eventStartDate;
  dto.eventEndDate = doc.eventEndDate;
  dto.rewardStartDate = doc.rewardStartDate;
  dto.rewardEndDate = doc.rewardEndDate;
  dto.isActive = doc.isActive;
  dto.eventReward = doc.eventReward;
  dto.createdAt = doc.createdAt;
  dto.updatedAt = doc.updatedAt;
  dto.isDeleted = doc.isDeleted;
  return dto;
}

export class EventRewardDto {
  @ApiProperty({ description: '보상 아이디', example: '6647e6ff4a4b00293a72cd56' })
  @IsMongoId()
  reward: string;

  @ApiProperty({ description: '보상 개수', example: 1 })
  @IsNumber()
  @Min(1)
  amount: number;
}

export class EventDto {
  constructor(doc: EventDocument) {
    this.id = doc._id.toString();
    this.name = doc.name;
    this.description = doc.description;
    this.eventStartDate = doc.eventStartDate;
    this.eventEndDate = doc.eventEndDate;
    this.rewardStartDate = doc.rewardStartDate;
    this.rewardEndDate = doc.rewardEndDate;
    this.isActive = doc.isActive;
    this.eventReward = doc.eventReward;
    this.createdAt = doc.createdAt;
    this.updatedAt = doc.updatedAt;
    this.isDeleted = doc.isDeleted;
  }

  @ApiProperty({ description: '이벤트 아이디' })
  id: string;

  @ApiProperty({ description: '이벤트 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '이벤트 설명' })
  description?: string;

  @ApiProperty({ description: '이벤트 시작일' })
  eventStartDate: Date;

  @ApiProperty({ description: '이벤트 종료일' })
  eventEndDate: Date;

  @ApiProperty({ description: '보상 수령 가능 시작일' })
  rewardStartDate: Date;

  @ApiProperty({ description: '보상 수령 가능 종료일' })
  rewardEndDate: Date;

  @ApiProperty({ description: '이벤트 활성화 여부' })
  isActive: boolean;

  @ApiProperty({
    type: [EventRewardDto],
    description: '보상 목록',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventRewardDto)
  eventReward: EventRewardDto[];

  @ApiProperty({ description: '이벤트 생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '이벤트 수정 일시' })
  updatedAt: Date;

  @ApiProperty({ description: '이벤트 삭제 여부', default: false })
  isDeleted: boolean;
}

export class CreateEventRequestDto extends PartialType(EventDto) {}

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

export class UpdateEventRequestDto extends PartialType(EventDto) {}

export class UpdateEventResponnseDto extends PartialType(EventDto) {
  static fromDocument(doc: EventDocument): UpdateEventResponnseDto {
    return mapEventDocToDto(doc, new UpdateEventResponnseDto());
  }
}

export class DeleteEventRequestDto extends PickType(EventDto, ['id']) {}

export class DeleteEventResponnseDto extends PartialType(EventDto) {
  static fromDocument(doc: EventDocument): DeleteEventResponnseDto {
    return mapEventDocToDto(doc, new DeleteEventResponnseDto());
  }
}
