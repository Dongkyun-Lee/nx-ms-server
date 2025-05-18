import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { EventRewardDto } from '../dto/event.dto';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @ApiProperty({ description: '이벤트 이름' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ description: '이벤트 설명' })
  @Prop()
  description?: string;

  @ApiProperty({ description: '이벤트 시작일' })
  @Prop({ required: true })
  eventStartDate: Date;

  @ApiProperty({ description: '이벤트 종료일' })
  @Prop({ required: true })
  eventEndDate: Date;

  @ApiProperty({ description: '보상 수령 가능 시작일' })
  @Prop({ required: true })
  rewardStartDate: Date;

  @ApiProperty({ description: '보상 수령 가능 종료일' })
  @Prop({ required: true })
  rewardEndDate: Date;

  @ApiProperty({ description: '이벤트 활성화 여부' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: '보상 목록' })
  @Prop({ default: [] })
  eventReward: EventRewardDto[];

  @ApiProperty({ description: '이벤트 삭제 여부' })
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty({ description: '이벤트 생성 일시' })
  @Prop()
  createdAt: Date;

  @ApiProperty({ description: '이벤트 수정 일시' })
  @Prop()
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
