import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CommonDto } from 'src/common/dto/common.dto';
import { CLAIM_STATUS } from 'src/common/type';
import { RewardDto } from 'src/reward/dto/reward.dto';
import { RewardClaimDocument } from '../entity/reward-claim.entity';

export class RewardClaimDto extends CommonDto {
  @ApiProperty({ description: '참여한 유저 아이디', type: String })
  userId: Types.ObjectId;

  @ApiProperty({ description: '참여한 이벤트 아이디', type: String })
  eventId: Types.ObjectId;

  @ApiProperty({
    description: '보상 수령 요청 시간',
    type: Date,
    required: false,
  })
  rewardClaimedAt?: Date;

  @ApiProperty({
    description: '보상 요청 상태',
    enum: CLAIM_STATUS,
    enumName: 'CLAIM_STATUS',
  })
  status: CLAIM_STATUS;
}

export class RequestClaimResponse extends PartialType(RewardClaimDto) {
  @ApiProperty({
    description: '보상 리스트',
    type: [RewardDto],
  })
  rewards?: RewardDto[];

  @ApiProperty({
    description: '보상 수령 시간',
    type: String,
  })
  message?: string;

  static fromDoc(
    doc: Partial<RewardClaimDocument> & {
      rewards?: RewardDto[];
      message?: string;
    },
  ) {
    const dto = new RequestClaimResponse();
    dto.id = doc._id.toString();
    dto.userId = doc.userId;
    dto.eventId = doc.eventId;
    dto.rewardClaimedAt = doc.rewardClaimedAt;
    dto.status = doc.status;
    dto.rewards = doc.rewards;
    dto.message = doc.message;
    return dto;
  }
}
