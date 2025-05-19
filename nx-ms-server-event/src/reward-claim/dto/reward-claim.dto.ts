import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
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

  static fromDoc(doc: RewardClaimDocument): RewardClaimDto {
    const dto = new RewardClaimDto();
    dto.id = doc._id.toString();
    dto.userId = doc.userId;
    dto.eventId = doc.eventId;
    dto.rewardClaimedAt = doc.rewardClaimedAt;
    dto.status = doc.status;
    return dto;
  }
}
export class RequestClaimRequestDto {
  userId: string;
  eventId: string;
}
export class RequestClaimResponseDto extends PartialType(RewardClaimDto) {
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
    const dto = new RequestClaimResponseDto();
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

export class GetMyClaimsResponseDto {
  claims: RewardClaimDto[];

  static fromDoc(docs: RewardClaimDocument[]) {
    const dto = new GetMyClaimsResponseDto();
    dto.claims = docs.map((doc) => RewardClaimDto.fromDoc(doc));
    return dto;
  }
}

export class GetMyClaimResponseDto {
  claims: RewardClaimDto[];

  static fromDoc(docs: RewardClaimDocument[]) {
    const dto = new GetMyClaimResponseDto();
    dto.claims = docs.map((doc) => RewardClaimDto.fromDoc(doc));
    return dto;
  }
}

export class GetAllLatestClaimsDto {
  claims: RewardClaimDto[];

  static fromDoc(docs: RewardClaimDocument[]) {
    const dto = new GetAllLatestClaimsDto();
    dto.claims = docs.map((doc) => RewardClaimDto.fromDoc(doc));
    return dto;
  }
}

export class GetAllLatestClaimsQueryDto {
  @ApiProperty({ type: String, required: false })
  userEmail?: string;

  @ApiProperty({ type: String, required: false })
  eventName?: string;

  @ApiProperty({ type: [String], enum: CLAIM_STATUS, required: false })
  status?: CLAIM_STATUS[];

  @ApiProperty({ type: Date, required: false })
  rewardClaimedFrom?: Date;

  @ApiProperty({ type: Date, required: false })
  rewardClaimedTo?: Date;
}

export class GetClaimHistoryDto {
  claims: RewardClaimDto[];

  static fromDoc(docs: RewardClaimDocument[]) {
    const dto = new GetClaimHistoryDto();
    dto.claims = docs.map((doc) => RewardClaimDto.fromDoc(doc));
    return dto;
  }
}
