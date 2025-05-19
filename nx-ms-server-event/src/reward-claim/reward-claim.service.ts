import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventService } from 'src/event/event.service';
import { RewardService } from 'src/reward/reward.service';
import { RewardClaim, RewardClaimDocument } from './entity/reward-claim.entity';
import { CLAIM_STATUS, REWARD_TYPE } from 'src/common/type';
import { RequestClaimResponse } from './dto/reward-claim.dto';
import { GetEventResponseDto } from 'src/event/dto/event.dto';
import { RewardDto } from 'src/reward/dto/reward.dto';

@Injectable()
export class RewardClaimService {
  constructor(
    @InjectModel(RewardClaim.name)
    private rewardClaimModel: Model<RewardClaimDocument>,
    private readonly rewardService: RewardService,
    private readonly eventService: EventService,
  ) {}

  isClaimable(event: GetEventResponseDto): CLAIM_STATUS {
    const now = new Date();

    if (now < new Date(event.rewardStartDate)) {
      return CLAIM_STATUS.NOT_YET_CLAIMABLE;
    }

    if (now > new Date(event.rewardEndDate)) {
      return CLAIM_STATUS.EXPIRED;
    }

    //TODO NOT_QUALIFIED 인지 확인하는 로직 추가 필요

    return CLAIM_STATUS.APPROVED;
  }

  /**
   * 이벤트 요건 충족 확인 방법은 상세 기술 x 따라서 보상 수령기간만 맞으면 충족됐다고 판단
   */
  async requestClaim(
    userId: string,
    eventId: string,
  ): Promise<RequestClaimResponse> {
    const oldClaim = await this.rewardClaimModel
      .findOne({ userId, eventId })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    /**
     * 이미 요청 있는 경우
     * APPROVED -> DUPLICATED
     * DUPLICATED -> DUPLICATED
     * NOT_YET_CLAIMABLE -> 검증
     * EXPIRED -> EXPIRED
     * NOT_QUALIFIED -> 검증
     *
     * 요청 없는 경우
     * 일단 검증
     * 가능 -> APPROVED
     * 이전 -> NOT_YET_CLAIMABLE
     * 지남 -> EXPIRED
     * 미충족 -> NOT_QUALIFIED
     */
    if (
      oldClaim &&
      [CLAIM_STATUS.APPROVED, CLAIM_STATUS.DUPLICATED].includes(oldClaim.status)
    ) {
      // 요청 이력이 있고 이미 보상 수령은 한 경우
      const dupDoc = await new this.rewardClaimModel({
        userId,
        eventId,
        status: CLAIM_STATUS.DUPLICATED,
      }).save();

      return RequestClaimResponse.fromDoc({
        ...dupDoc.toObject(),
        message: 'Duplicated claim request',
      });
    } else if (oldClaim && oldClaim.status === CLAIM_STATUS.EXPIRED) {
      const expDoc = await new this.rewardClaimModel({
        userId,
        eventId,
        status: CLAIM_STATUS.EXPIRED,
      }).save();

      return RequestClaimResponse.fromDoc({
        ...expDoc.toObject(),
        message: 'Event with expired reward period',
      });
    } else {
      const event = await this.eventService.findOneNoPopulate(eventId);
      // 이벤트를 찾을 수 없는 경우
      if (!event) {
        throw new BadRequestException(`Event with ${eventId} does not exist`);
      }

      switch (this.isClaimable(event)) {
        case CLAIM_STATUS.APPROVED:
          const approvedDoc = await new this.rewardClaimModel({
            userId,
            eventId,
            status: CLAIM_STATUS.APPROVED,
          }).save();

          const rewards = await this.rewardService.findAllByIds(
            event.rewardIds,
          );

          return RequestClaimResponse.fromDoc({
            ...approvedDoc.toObject(),
            rewards: rewards.map((reward) => RewardDto.fromDocument(reward)),
          });

        case CLAIM_STATUS.NOT_QUALIFIED:
          const notQualifiedDoc = await new this.rewardClaimModel({
            userId,
            eventId,
            status: CLAIM_STATUS.NOT_QUALIFIED,
          }).save();
          return RequestClaimResponse.fromDoc({
            ...notQualifiedDoc.toObject(),
            message: 'Event conditions not met',
          });

        case CLAIM_STATUS.NOT_YET_CLAIMABLE:
          const notYetClaimable = await new this.rewardClaimModel({
            userId,
            eventId,
            status: CLAIM_STATUS.NOT_YET_CLAIMABLE,
          }).save();
          return RequestClaimResponse.fromDoc({
            ...notYetClaimable.toObject(),
            message: 'Reward is not yet claimable',
          });

        case CLAIM_STATUS.EXPIRED:
          const expDoc = await new this.rewardClaimModel({
            userId,
            eventId,
            status: CLAIM_STATUS.EXPIRED,
          }).save();
          return RequestClaimResponse.fromDoc({
            ...expDoc.toObject(),
            message: 'Event with expired reward period',
          });
      }
    }
  }

  async getMyClaims() {}

  async getMyLatestClaim() {}

  async getAllLatestClaims() {}

  async getClaimHistory() {}
}
