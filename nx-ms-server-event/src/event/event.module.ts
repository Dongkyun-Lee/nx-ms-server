import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event, EventSchema } from './entities/event.entity';
import { UserEventParticipation, UserEventParticipationSchema } from './entities/user-event-participation.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardService } from 'src/reward/reward.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: UserEventParticipation.name, schema: UserEventParticipationSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, RewardService],
})
export class EventModule {}
