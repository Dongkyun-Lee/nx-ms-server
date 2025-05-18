import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateEventRequestDto, CreateEventResponseDto, GetEventRequestDTO, GetAllEventResponseDTO, GetEventResponseDTO } from './dto/event.dto';
import { AuthenticatedUser } from 'src/common/decorator/authenticated-user.decorator';
import { AuthenticatedUserInfo } from 'src/common/type';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: '이벤트 생성'})
  @ApiBody({ type: CreateEventRequestDto })
  @ApiResponse({ status: 201, description: '이벤트가 생성 성공', type: CreateEventResponseDto })
  create(@Body() createEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: '이벤트 다건 조회' })
  @ApiResponse({ status: 200, description: '이벤트 목록 반환', type: GetAllEventResponseDTO })
  findAll(@AuthenticatedUser() authUser: AuthenticatedUserInfo) {
    return this.eventService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '이벤트 단건 조회' })
  @ApiResponse({ status: 200, description: '이벤트 단건 반환', type: GetEventResponseDTO })
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
