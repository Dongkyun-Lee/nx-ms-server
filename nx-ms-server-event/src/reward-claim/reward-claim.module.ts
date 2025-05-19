import { Module } from '@nestjs/common';
import { RewardClaimController } from './reward-claim.controller';
import { RewardClaimService } from './reward-claim.service';
import { EventModule } from 'src/event/event.module';
import { RewardModule } from 'src/reward/reward.module';
import { RewardClaim, RewardClaimSchema } from './entity/reward-claim.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    EventModule,
    RewardModule,
    MongooseModule.forFeature([
      { name: RewardClaim.name, schema: RewardClaimSchema },
    ]),
  ],
  controllers: [RewardClaimController],
  providers: [RewardClaimService],
  exports: [RewardClaimService],
})
export class RewardClaimModule {}
