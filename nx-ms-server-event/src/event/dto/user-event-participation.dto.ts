import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class UserEventParticipationDto {
  @ApiProperty({ description: '사용자 보상 참여 아이디' })
  id: Types.ObjectId;

  @ApiProperty({ description: '참여한 유저 아이디' })
  userId: Types.ObjectId;

  @ApiProperty({ description: '참여한 이벤트 아이디' })
  eventId: Types.ObjectId;

  @ApiProperty({ description: '보상 수령 여부' })
  rewardClaimed: boolean;

  @ApiProperty({ description: '보상 수령 시간 (선택적)' })
  rewardClaimedAt?: Date;

  @ApiProperty({ description: '추가 참여 관련 데이터 (예: 참여 방법, 점수 등)' })
  participationData?: any;

  @ApiProperty({ description: '참여 상태, 예: 참여 취소 등 처리용' })
  isActive: boolean;
}
