import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { EventService } from 'src/event/event.service';
import { RewardService } from 'src/reward/reward.service';
import { RewardClaim, RewardClaimDocument } from './entity/reward-claim.entity';
import { CLAIM_STATUS } from 'src/common/type';
import {
  GetAllLatestClaimsDto,
  GetAllLatestClaimsQueryDto,
  GetClaimHistoryDto,
  GetMyClaimResponseDto,
  GetMyClaimsResponseDto,
  RequestClaimResponseDto,
} from './dto/reward-claim.dto';
import { GetEventResponseDto } from 'src/event/dto/event.dto';
import { RewardDto } from 'src/reward/dto/reward.dto';
import axios from 'axios';

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
  ): Promise<RequestClaimResponseDto> {
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

      return RequestClaimResponseDto.fromDoc({
        ...dupDoc.toObject(),
        message: 'Duplicated claim request',
      });
    } else if (oldClaim && oldClaim.status === CLAIM_STATUS.EXPIRED) {
      const expDoc = await new this.rewardClaimModel({
        userId,
        eventId,
        status: CLAIM_STATUS.EXPIRED,
      }).save();

      return RequestClaimResponseDto.fromDoc({
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

          return RequestClaimResponseDto.fromDoc({
            ...approvedDoc.toObject(),
            rewards: rewards.map((reward) => RewardDto.fromDocument(reward)),
          });

        case CLAIM_STATUS.NOT_QUALIFIED:
          const notQualifiedDoc = await new this.rewardClaimModel({
            userId,
            eventId,
            status: CLAIM_STATUS.NOT_QUALIFIED,
          }).save();
          return RequestClaimResponseDto.fromDoc({
            ...notQualifiedDoc.toObject(),
            message: 'Event conditions not met',
          });

        case CLAIM_STATUS.NOT_YET_CLAIMABLE:
          const notYetClaimable = await new this.rewardClaimModel({
            userId,
            eventId,
            status: CLAIM_STATUS.NOT_YET_CLAIMABLE,
          }).save();
          return RequestClaimResponseDto.fromDoc({
            ...notYetClaimable.toObject(),
            message: 'Reward is not yet claimable',
          });

        case CLAIM_STATUS.EXPIRED:
          const expDoc = await new this.rewardClaimModel({
            userId,
            eventId,
            status: CLAIM_STATUS.EXPIRED,
          }).save();
          return RequestClaimResponseDto.fromDoc({
            ...expDoc.toObject(),
            message: 'Event with expired reward period',
          });
      }
    }
  }

  // userId-eventId 로 그룹핑해서 최신 데이터만 출력
  async getMyClaims(userId: string): Promise<GetMyClaimsResponseDto> {
    const pipeline = [
      { $match: { userId } },
      { $sort: { updatedAt: -1 } } as const,
      {
        $group: {
          _id: { userId: '$userId', eventId: '$eventId' },
          doc: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
    ];

    const result = await this.rewardClaimModel.aggregate(pipeline).exec();

    return GetMyClaimsResponseDto.fromDoc(result);
  }

  async getMyClaim(
    userId: string,
    rewardClaimId: string,
  ): Promise<GetMyClaimResponseDto> {
    const selected = await this.rewardClaimModel
      .findById(rewardClaimId)
      .lean()
      .exec();

    if (!selected) {
      throw new NotFoundException(
        `RewardClaim with ${rewardClaimId} doese not exist`,
      );
    }

    if (userId !== selected.userId.toString()) {
      throw new BadRequestException(`Wrong access`);
    }

    const result = await this.rewardClaimModel
      .find({
        userId,
        eventId: selected.eventId,
      })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    return GetMyClaimResponseDto.fromDoc(result);
  }

  async getAllLatestClaims(
    query: GetAllLatestClaimsQueryDto,
  ): Promise<GetAllLatestClaimsDto> {
    const match: any = {};
    console.log('query', query);

    // auth server 요청 userEmail -> userId
    if (query.userEmail) {
      try {
        const { data } = await axios.get(
          `${process.env.AUTH_SERVICE_URL}/user/${query.userEmail}`,
        );

        match.userId = data._id.toString();
      } catch (error) {
        console.log(error.message);
        throw new BadRequestException(
          `Failed to find User Id with email ${query.userEmail}`,
        );
      }
    }

    if (query.eventName) {
      try {
        const event = await this.eventService.findIdByName(query.eventName);
        match.eventId = event._id.toString();
      } catch (error) {
        throw new BadRequestException(
          `Failed to find Event Id with email ${query.eventName}`,
        );
      }
    }

    if (query.status && query.status.length > 0) {
      match.status = { $in: [...query.status] };
    }

    const claimedAt: any = {};
    if (query.rewardClaimedFrom)
      claimedAt.$gte = new Date(query.rewardClaimedFrom);
    if (query.rewardClaimedTo) claimedAt.$lte = new Date(query.rewardClaimedTo);
    if (Object.keys(claimedAt).length > 0) {
      match.rewardClaimedAt = claimedAt;
    }

    console.log('match', match);
    const pipeline: PipelineStage[] = [
      { $match: match },
      { $sort: { updatedAt: -1 } },
    ];

    const result = await this.rewardClaimModel.aggregate(pipeline).exec();
    return GetAllLatestClaimsDto.fromDoc(result);
  }

  async getClaimHistory(rewardClaimId: string): Promise<GetClaimHistoryDto> {
    const selected = await this.rewardClaimModel
      .findById(rewardClaimId)
      .lean()
      .exec();

    if (!selected) {
      throw new NotFoundException(
        `RewardClaim with ${rewardClaimId} does not exist`,
      );
    }

    const result = await this.rewardClaimModel
      .find({
        userId: selected.userId,
        eventId: selected.eventId,
      })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    return GetClaimHistoryDto.fromDoc(result);
  }
}
