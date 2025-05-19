import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { ROLES, ROLES_EXCEPT_USER } from 'src/common/constant';
import { AuthenticatedUser, Roles } from 'src/common/decorator';
import { UserHeaders } from 'src/common/type/user-headers.interface';
import { RewardClaimService } from './reward-claim.service';
import { AuthenticatedUserInfo } from 'src/common/type';
import {
  GetAllLatestClaimsQueryDto,
  RequestClaimRequestDto,
} from './dto/reward-claim.dto';

@ApiTags('RewardClaim')
@Controller('claim')
export class RewardClaimController {
  constructor(private readonly rewardClaimService: RewardClaimService) {}
  /**
   * [유저] 보상 요청
   */
  @Post()
  @UserHeaders
  @Roles(ROLES.USER)
  @ApiOperation({
    summary: '[유저] 보상 요청',
    description: '이벤트에 대한 보상을 요청합니다.',
  })
  @ApiBody({
    description: '보상 요청에 필요한 데이터',
    type: RequestClaimRequestDto,
  })
  async requestClaim(
    @Body() body: any,
    @AuthenticatedUser() user: AuthenticatedUserInfo,
  ) {
    return this.rewardClaimService.requestClaim(user.id, body.eventId);
  }

  /**
   * [유저] 본인 이력 목록 확인
   */
  @Get('my')
  @UserHeaders
  @Roles(ROLES.USER)
  @ApiOperation({
    summary: '[유저] 본인 이력 목록 확인',
    description: '유저 본인의 전체 보상 요청 이력을 조회',
  })
  async getMyClaims(@AuthenticatedUser() user: AuthenticatedUserInfo) {
    return this.rewardClaimService.getMyClaims(user.id);
  }

  /**
   * [유저] 본인 이력 상세 확인
   */
  @Get('my/:rewardClaimId')
  @UserHeaders
  @Roles(ROLES.USER)
  @ApiOperation({
    summary: '[유저] 본인 이력 상세 확인',
    description: '유저 본인의 보상 요청 상세 조회',
  })
  @ApiParam({ name: 'rewardClaimId', description: '보상 요청 ID' })
  async getMyClaim(
    @AuthenticatedUser() user: AuthenticatedUserInfo,
    @Param('rewardClaimId') rewardClaimId: string,
  ) {
    return this.rewardClaimService.getMyClaim(user.id, rewardClaimId);
  }

  /**
   * [운영자/감시자/관리자] 전체 유저 이력 목록 확인 (필터링)
   */
  @Get()
  @UserHeaders
  @Roles(...ROLES_EXCEPT_USER)
  @ApiOperation({
    summary: '[운영자/감시자/관리자] 전체 유저 이력 목록 조회',
    description: '필터를 통해 전체 유저의 보상 요청 목록을 조회합니다.',
  })
  async getAllLatestClaims(@Query() query: GetAllLatestClaimsQueryDto) {
    return this.rewardClaimService.getAllLatestClaims(query);
  }

  /**
   * [운영자/감시자/관리자] 특정 유저-이벤트의 보상 요청 상세 조회
   */
  @Get(':rewardClaimId')
  @UserHeaders
  @Roles(...ROLES_EXCEPT_USER)
  @ApiOperation({
    summary: '[운영자/감시자/관리자] 특정 유저의 보상 요청 조회',
    description:
      '특정 유저가 특정 이벤트에 대해 요청한 보상의 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'rewardClaimId', description: '보상 요청 아이디' })
  async getClaimHistory(@Param('rewardClaimId') rewardClaimId: string) {
    return this.rewardClaimService.getClaimHistory(rewardClaimId);
  }
}
