import { Module } from '@nestjs/common';
import { RewardClaimController } from './reward-claim.controller';
import { RewardClaimService } from './reward-claim.service';

@Module({
  controllers: [RewardClaimController],
  providers: [RewardClaimService],
  exports: [RewardClaimService],
})
export class RewardClaimModule {}
