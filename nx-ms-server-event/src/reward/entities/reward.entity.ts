import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { CommonEntity } from 'src/common/entity/common.entity';
import { REWARD_TYPE } from 'src/common/type/reward-type.interface';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward extends CommonEntity {
  @ApiProperty({ description: '연결된 이벤트 아이디 리스트', type: [Types.ObjectId], default: [] })
  @Prop({ type: [Types.ObjectId], ref: 'Event', default: [] })
  eventIds: Types.ObjectId[];

  @ApiProperty({ description: '보상 이름' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ description: '보상 설명' })
  @Prop({ required: true })
  description?: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(REWARD_TYPE),
  })
  type: REWARD_TYPE;

  @ApiProperty({ description: '보상 개수', required: true, default: 1 })
  @Prop({ required: true, default: 1, type: Number })
  amount: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
