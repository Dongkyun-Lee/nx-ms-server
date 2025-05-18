import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateEventRequestDto, CreateEventResponseDto, GetEventRequestDto, GetAllEventResponseDto, GetEventResponseDto, UpdateEventRequestDto, UpdateEventResponnseDto, DeleteEventResponnseDto, DeleteEventRequestDto } from './dto/event.dto';
import { AuthenticatedUser } from 'src/common/decorator/authenticated-user.decorator';
import { AuthenticatedUserInfo } from 'src/common/type';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({ summary: '이벤트 생성'})
  @ApiBody({ type: CreateEventRequestDto })
  @ApiResponse({ status: 201, description: '이벤트 생성 성공', type: CreateEventResponseDto })
  @Post()
  create(@AuthenticatedUser() authUser, @Body() createEventDto) {
    return this.eventService.create(createEventDto);
  }

  @ApiOperation({ summary: '이벤트 다건 조회' })
  @ApiResponse({ status: 200, description: '이벤트 목록 반환', type: GetAllEventResponseDto })
  @Get()
  findAll(@AuthenticatedUser() authUser: AuthenticatedUserInfo): Promise<GetAllEventResponseDto> {
    return this.eventService.findAll();
  }

  @ApiOperation({ summary: '이벤트 단건 조회' })
  @ApiParam({ name: 'id', description: '타깃 이벤트 id', type: String })
  @ApiResponse({ status: 200, description: '이벤트 단건 반환', type: GetEventResponseDto })
  @Get(':id')
  findOne(@Param() param: GetEventRequestDto): Promise<GetEventResponseDto> {
    return this.eventService.findOne(param);
  }

  @ApiOperation({ summary: '이벤트 수정' })
  @ApiParam({ name: 'id', description: '타깃 이벤트 id', type: String })
  @ApiResponse({ status: 200, description: '수정된 이벤트 반환', type: UpdateEventResponnseDto  })
  @Patch(':id')
  update(@AuthenticatedUser() authUser, @Param() param: UpdateEventRequestDto, @Body() body: UpdateEventRequestDto): Promise<UpdateEventResponnseDto> {
    return this.eventService.update(body);
  }

  @ApiOperation({ summary: '이벤트 삭제' })
  @ApiParam({ name: 'id', description: '타깃 이벤트 id', type: String })
  @ApiResponse({ status: 200, description: '삭제된 이벤트 반환', type: DeleteEventResponnseDto })
  @Delete(':id')
  remove(@AuthenticatedUser() authUser, @Param() param: DeleteEventRequestDto): Promise<DeleteEventResponnseDto> {
    return this.eventService.remove(param);
  }
}
