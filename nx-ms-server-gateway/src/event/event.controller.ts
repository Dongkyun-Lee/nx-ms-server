import { Controller, Get, Headers, Query, Req } from '@nestjs/common';
import { EventService } from './event.service';
// import { JwtAuthGuard } from '../../auth/auth.guard';
// import { RolesGuard } from '../../auth/roles.guard';
// import { Roles } from '../../auth/roles.decorator';
import { GetHelloResponse } from './types/event.interface';
import { Request } from 'express';

@Controller('events')
export class EventController {
  private readonly EVENT_SERVER_PREFIX = '/events';

  constructor(private readonly eventService: EventService) {}

  @Get()
  async getHello(
    @Req() req: Request,
    @Query() query: any,
    @Headers() headers: any,
  ): Promise<GetHelloResponse> {
    return this.eventService.getHello(
      req.path.replace(this.EVENT_SERVER_PREFIX, ''),
      query,
      headers,
    );
  }
}
