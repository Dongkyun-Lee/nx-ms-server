import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { EventDocument } from '../entities/event.entity';
import { Type } from 'class-transformer';

class EventRewardDto {
  @ApiProperty({ description: '보상 아이디', example: '6647e6ff4a4b00293a72cd56' })
  @IsMongoId()
  reward: string;

  @ApiProperty({ description: '보상 개수', example: 1 })
  @IsNumber()
  @Min(1)
  amount: number;
}

export class EventDto {
  @ApiProperty({ description: '이벤트 아이디' })
  id: Types.ObjectId;

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
  rewards: EventRewardDto[];

  @ApiProperty({ description: '이벤트 생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '이벤트 수정 일시' })
  updatedAt: Date;
}

export class CreateEventRequestDto {}

export class CreateEventResponseDto {
  static fromDocument(doc: EventDocument): CreateEventResponseDto {
    return new CreateEventResponseDto();
  }
}
export class GetEventRequestDTO {}

export class GetEventResponseDTO {
  static fromDocument(doc: EventDocument): GetEventResponseDTO {
    return new GetEventResponseDTO();
  }
}

export class GetAllEventResponseDTO {
  events: GetEventResponseDTO[];
}
