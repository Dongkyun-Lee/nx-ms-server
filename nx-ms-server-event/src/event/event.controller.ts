import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventService } from './event.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CreateEventRequestDto,
  CreateEventResponseDto,
  GetAllEventResponseDto,
  GetEventResponseDto,
  UpdateEventRequestDto,
  UpdateEventResponnseDto,
  DeleteEventResponnseDto,
} from './dto/event.dto';
import { UserHeaders } from 'src/common/type/user-headers.interface';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({ summary: '이벤트 생성' })
  @UserHeaders
  @ApiBody({ type: CreateEventRequestDto })
  @ApiResponse({
    status: 201,
    description: '이벤트 생성 성공',
    type: CreateEventResponseDto,
  })
  @Post()
  create(@Body() createEventDto) {
    return this.eventService.create(createEventDto);
  }

  @ApiOperation({ summary: '이벤트 다건 조회' })
  @ApiResponse({
    status: 200,
    description: '이벤트 목록 반환',
    type: GetAllEventResponseDto,
  })
  @Get()
  findAll(): Promise<GetAllEventResponseDto> {
    return this.eventService.findAll();
  }

  @ApiOperation({ summary: '이벤트 단건 조회' })
  @ApiParam({ name: 'id', description: '타깃 이벤트 id', type: String })
  @ApiResponse({
    status: 200,
    description: '이벤트 단건 반환',
    type: GetEventResponseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<GetEventResponseDto> {
    return this.eventService.findOne(id);
  }

  @ApiOperation({ summary: '이벤트 수정' })
  @UserHeaders
  @ApiParam({ name: 'id', description: '타깃 이벤트 id', type: String })
  @ApiBody({ type: UpdateEventRequestDto })
  @ApiResponse({
    status: 200,
    description: '수정된 이벤트 반환',
    type: UpdateEventResponnseDto,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateEventRequestDto,
  ): Promise<UpdateEventResponnseDto> {
    return this.eventService.update(id, body);
  }

  @ApiOperation({ summary: '이벤트 삭제' })
  @UserHeaders
  @ApiParam({ name: 'id', description: '타깃 이벤트 id', type: String })
  @ApiResponse({
    status: 200,
    description: '삭제된 이벤트 반환',
    type: DeleteEventResponnseDto,
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteEventResponnseDto> {
    return this.eventService.remove(id);
  }
}
