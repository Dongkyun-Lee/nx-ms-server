import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event, EventSchema } from './entities/event.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardModule } from 'src/reward/reward.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    RewardModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
