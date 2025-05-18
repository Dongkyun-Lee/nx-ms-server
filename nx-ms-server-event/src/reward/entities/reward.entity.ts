import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { REWARD_TYPE } from 'src/common/type/reward-type.interface';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @ApiProperty({ description: '보상 이름' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ description: '보상 설명' })
  @Prop()
  description?: string;

  @ApiProperty({ description: '보상 유형' })
  @Prop({ required: true, type: REWARD_TYPE })
  type: REWARD_TYPE;

  @ApiProperty({ description: '보상 활성화 여부' })
  @Prop({ default: true })
  isActive: boolean;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
