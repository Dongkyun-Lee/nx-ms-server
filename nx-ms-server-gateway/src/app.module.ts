import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LogInterceptor } from './common/interceptors/log/log.interceptor';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ProxyModule } from './proxy/proxy.module';
import { RolesGuard } from './common/guard/roles.guard';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    EventModule,
    AuthModule,
    HttpModule,
    ProxyModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '6h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [JwtModule, ConfigModule],
})
export class AppModule {}
