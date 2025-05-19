import { Module } from '@nestjs/common';
import { RewardClaimController } from './reward-claim.controller';
import { RewardClaimService } from './reward-claim.service';
import { RewardService } from 'src/reward/reward.service';

@Module({
  controllers: [RewardClaimController],
  providers: [RewardClaimService],
  exports: [RewardService],
})
export class RewardClaimModule {}
