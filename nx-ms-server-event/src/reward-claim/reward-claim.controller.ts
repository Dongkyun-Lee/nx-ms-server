import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ROLES, ROLES_EXCEPT_USER } from 'src/common/constant';
import { Roles } from 'src/common/decorator';
import { UserHeaders } from 'src/common/type/user-headers.interface';
import { RewardClaimService } from './reward-claim.service';

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
  @ApiBody({ description: '보상 요청에 필요한 데이터', type: Object }) // 필요한 DTO로 교체하세요
  async requestClaim(@Body() body: any) {
    return this.rewardClaimService.requestClaim(body.userId, body.eventId);
  }

  /**
   * [유저] 본인 이력 목록 확인
   */
  @Get('my')
  @UserHeaders
  @Roles(ROLES.USER)
  @ApiOperation({
    summary: '[유저] 본인 이력 목록 확인',
    description: '유저 본인의 전체 보상 요청 이력을 조회합니다.',
  })
  async getMyClaims(@Query('eventId') eventId: string) {} // eventId 쿼리로 받는 게 맞다면 이렇게 수정

  /**
   * [유저] 본인 이력 상세 확인
   */
  @Get('my/:eventId')
  @UserHeaders
  @Roles(ROLES.USER)
  @ApiOperation({
    summary: '[유저] 본인 이력 상세 확인',
    description: '특정 이벤트에 대한 본인의 보상 요청 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'eventId', description: '이벤트 ID' })
  async getMyLatestClaim(@Param('eventId') eventId: string) {}

  /**
   * [운영자/감시자/관리자] 전체 유저 이력 목록 확인 (필터링)
   */
  @Get()
  @UserHeaders
  @Roles(...ROLES_EXCEPT_USER)
  @ApiOperation({
    summary: '[관리자] 전체 유저 이력 목록 조회',
    description: '필터를 통해 전체 유저의 보상 요청 이력을 조회합니다.',
  })
  @ApiQuery({
    name: 'eventId',
    required: false,
    description: '이벤트 ID로 필터링',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: '유저 ID로 필터링',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '보상 상태로 필터링 (예: pending, approved)',
  })
  async getAllLatestClaims(@Query() query: any) {}

  /**
   * [운영자/감시자/관리자] 특정 유저-이벤트의 보상 요청 상세 조회
   */
  @Get(':userId/:eventId')
  @UserHeaders
  @Roles(...ROLES_EXCEPT_USER)
  @ApiOperation({
    summary: '[관리자] 특정 유저의 보상 요청 조회',
    description:
      '특정 유저가 특정 이벤트에 대해 요청한 보상의 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiParam({ name: 'eventId', description: '이벤트 ID' })
  async getClaimHistory(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ) {}
}
