import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { CommonEntity } from 'src/common/entity/common.entity';
import { CLAIM_STATUS } from 'src/common/type';

export type RewardClaimDocument = RewardClaim & Document;
@Schema({ timestamps: true })
export class RewardClaim extends CommonEntity {
  @ApiProperty({ description: '참여한 유저 아이디', type: String })
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @ApiProperty({ description: '참여한 이벤트 아이디', type: String })
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @ApiProperty({ description: '보상 아이디 목록', type: [String] })
  @Prop({ type: [Types.ObjectId], ref: 'Reward', required: true })
  rewardIds: Types.ObjectId[];

  @ApiProperty({ description: '보상 수령 시간', type: Date, required: false })
  @Prop({ default: null })
  rewardClaimedAt?: Date;

  @ApiProperty({
    description: '유저 이벤트 참여 상태',
    enum: CLAIM_STATUS,
    enumName: 'CLAIM_STATUS',
  })
  @Prop({ enum: CLAIM_STATUS, default: CLAIM_STATUS.PENDING })
  status: CLAIM_STATUS;
}

export const RewardClaimSchema = SchemaFactory.createForClass(RewardClaim);
