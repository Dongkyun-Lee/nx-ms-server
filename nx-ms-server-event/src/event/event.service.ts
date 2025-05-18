import { Injectable } from '@nestjs/common';
import { CreateEventRequestDto } from './dto/event.dto';

@Injectable()
export class EventService {
  create(req: CreateEventRequestDto) {
    return 'This action adds a new event';
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, req) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
