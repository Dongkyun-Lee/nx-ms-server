import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CommonDto } from 'src/common/dto/common.dto';
import { CLAIM_STATUS } from 'src/common/type';

export class RewardClaimDto extends CommonDto {
  @ApiProperty({ description: '참여한 유저 아이디', type: String })
  userId: Types.ObjectId;

  @ApiProperty({ description: '참여한 이벤트 아이디', type: String })
  eventId: Types.ObjectId;

  @ApiProperty({ description: '보상 아이디 목록', type: [String] })
  rewardIds: Types.ObjectId[];

  @ApiProperty({ description: '보상 수령 시간', type: Date, required: false })
  rewardClaimedAt?: Date;

  @ApiProperty({
    description: '유저 이벤트 참여 상태',
    enum: CLAIM_STATUS,
    enumName: 'CLAIM_STATUS',
  })
  status: CLAIM_STATUS;
}
