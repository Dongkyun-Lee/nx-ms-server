import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { EventRewardDto } from '../dto/event.dto';
import { CommonEntity } from 'src/common/entity/common.entity';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event extends CommonEntity {
  @ApiProperty({ description: '이벤트 이름', required: true })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ description: '이벤트 달성 조건', required: true })
  @Prop({ required: true })
  condition: string;

  @ApiProperty({ description: '이벤트 설명' })
  @Prop()
  description?: string;

  @ApiProperty({ description: '이벤트 시작일', required: true })
  @Prop({ required: true })
  eventStartDate: Date;

  @ApiProperty({ description: '이벤트 종료일', required: true })
  @Prop({ required: true })
  eventEndDate: Date;

  @ApiProperty({ description: '보상 수령 가능 시작일', required: true })
  @Prop({ required: true })
  rewardStartDate: Date;

  @ApiProperty({ description: '보상 수령 가능 종료일', required: true })
  @Prop({ required: true })
  rewardEndDate: Date;

  @ApiProperty({ description: '이벤트 활성화 여부' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: '보상 목록' })
  @Prop({ default: [] })
  eventReward: EventRewardDto[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
