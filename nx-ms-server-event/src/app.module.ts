import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LogInterceptor } from './common/interceptor/log/log.interceptor';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RewardModule } from './reward/reward.module';
import { EventModule } from './event/event.module';
import { RewardClaimModule } from './reward-claim/reward-claim.module';
import { RolesGuard } from './common/guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.event.local'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    EventModule,
    RewardModule,
    RewardClaimModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
