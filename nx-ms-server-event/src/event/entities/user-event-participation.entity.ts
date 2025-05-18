import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { PARTICIPATION_STATUS } from 'src/common/type';

export type UserEventParticipationDocument = UserEventParticipation & Document;

@Schema({ timestamps: true })
export class UserEventParticipation {
  @ApiProperty({ description: '참여한 유저 아이디' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty({ description: '참여한 이벤트 아이디' })
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @ApiProperty({ description: '보상 수령 여부' })
  @Prop({ default: false })
  rewardClaimed: boolean;

  @ApiProperty({ description: '보상 수령 시간 (선택적)' })
  @Prop()
  rewardClaimedAt?: Date;

  @ApiProperty({ description: '유저 이벤트 참여 상태' })
  @Prop({ enum: PARTICIPATION_STATUS, default: PARTICIPATION_STATUS.PENDING })
  status: PARTICIPATION_STATUS;
}

export const UserEventParticipationSchema = SchemaFactory.createForClass(UserEventParticipation);
