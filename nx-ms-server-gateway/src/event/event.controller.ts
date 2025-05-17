import { Controller, Get, Headers, Query, Req } from '@nestjs/common';
import { EventService } from './event.service';
// import { JwtAuthGuard } from '../../auth/auth.guard';
// import { RolesGuard } from '../../auth/roles.guard';
// import { Roles } from '../../auth/roles.decorator';
import { GetHelloResponse } from './types/event.interface';
import { Request } from 'express';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

}
