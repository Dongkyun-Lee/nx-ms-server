import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RewardService } from './reward.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, PartialType } from '@nestjs/swagger';
import { CreateRewardRequestDto, CreateRewardResponseDto, DeleteRewardResponnseDto, GetAllRewardResponseDto, GetRewardRequestDto, GetRewardResponseDto, RewardDto, UpdateRewardRequestDto, UpdateRewardResponnseDto } from './dto/reward.dto';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @ApiOperation({ summary: '보상 단건 생성' })
  @ApiResponse({ status: 201, description: '보상 생성 성공', type: null })
  @ApiBody({ type: CreateRewardRequestDto })
  @Post()
  create(@Body() createRewardDto: CreateRewardRequestDto): Promise<CreateRewardResponseDto> {
    return this.rewardService.create(createRewardDto);
  }

  @ApiOperation({ summary: '보상 다건 조회' })
  @ApiResponse({ status: 200, description: '보상 목록 반환', type: GetAllRewardResponseDto })
  @Get()
  findAll(@Query() query: Partial<RewardDto>): Promise<GetAllRewardResponseDto> {
    return this.rewardService.findAll(query);
  }

  @ApiOperation({ summary: '보상 단건 조회' })
  @ApiResponse({ status: 200, description: '보상 단건 반환', type: GetRewardResponseDto })
  @ApiParam({ name: 'id', type: String, description: '타깃 아이디' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<GetRewardResponseDto> {
    return this.rewardService.findOne(id);
  }

  @ApiOperation({ summary: '보상 수정' })
  @ApiResponse({ status: 200, description: '수정된 보상 반환', type: UpdateRewardResponnseDto })
  @ApiParam({ name: 'id', description: '타깃 보상 id', type: String })
  @ApiBody({ type: UpdateRewardRequestDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRewardDto: Partial<RewardDto>): Promise<UpdateRewardResponnseDto> {
    return this.rewardService.update(id, updateRewardDto);
  }

  @ApiOperation({ summary: '보상 삭제' })
  @ApiParam({ name: 'id', description: '타깃 보상 id', type: String })
  @ApiResponse({ status: 200, description: '삭제된 보상 반환', type: DeleteRewardResponnseDto })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteRewardResponnseDto> {
    return this.rewardService.remove(id);
  }
}
