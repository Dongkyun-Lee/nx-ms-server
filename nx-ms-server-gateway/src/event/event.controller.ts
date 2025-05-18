import { Body, Controller, Delete, Get, Headers, Patch, Post, Query, Request } from '@nestjs/common';
import { ALL_ROLES_EXCEPT_ANONYMOUS, ROLES } from 'src/common/constants';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Roles(ROLES.OPERATOR, ROLES.ADMIN)
  @Post('event')
  async createEvent(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.eventService.post(req, req.path, body, headers, query);
  }

  @Public()
  @Roles(ROLES.ANONYMOUS)
  @Get('event')
  async findAll(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return this.eventService.get(req, req.path, headers, query);
  }

  @Public()
  @Roles(ROLES.ANONYMOUS)
  @Get('event/:id')
  async findOne(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return this.eventService.get(req, req.path, headers, query);
  }

  @Roles(ROLES.ADMIN, ROLES.OPERATOR)
  @Patch('event/:id')
  async update(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.eventService.patch(req, req.path, body, headers, query);
  }

  @Roles(ROLES.ADMIN, ROLES.OPERATOR)
  @Delete('event/:id')
  async remove(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return this.eventService.delete(req, req.path, headers, query);
  }

  @Roles(ROLES.OPERATOR, ROLES.ADMIN)
  @Post('reward')
  async createReward(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.eventService.post(req, req.path, body, headers, query);
  }

  @Roles(ROLES.OPERATOR, ROLES.ADMIN)
  @Get('reward')
  async getRewards(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return this.eventService.get(req, req.path, headers, query);
  }

  @Roles(ROLES.OPERATOR, ROLES.ADMIN)
  @Get('reward/:id')
  async getReward(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return this.eventService.get(req, req.path, headers, query);
  }

  @Roles(ROLES.OPERATOR, ROLES.ADMIN)
  @Patch('reward/:id')
  async updateReward(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
    @Body() body: any,
  ) {
    return await this.eventService.patch(req, req.path, body, headers, query);
  }

  @Roles(ROLES.OPERATOR, ROLES.ADMIN)
  @Delete('reward/:id')
  async deleteReward(
    @Request() req: any,
    @Headers() headers: any,
    @Query() query: any,
  ) {
    return this.eventService.delete(req, req.path, headers, query);
  }
}
