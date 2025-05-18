import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventRequestDto, CreateEventResponseDto, DeleteEventResponnseDto, GetAllEventResponseDto, GetEventResponseDto, UpdateEventRequestDto, UpdateEventResponnseDto } from './dto/event.dto';
import { Model } from 'mongoose';
import { Event, EventDocument } from './entities/event.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async create(body: CreateEventRequestDto): Promise<CreateEventResponseDto> {
    const createdEvent = new this.eventModel({...body });
    return CreateEventResponseDto.fromDocument(await createdEvent.save());
  }

  async findAll(): Promise<GetAllEventResponseDto> {
    const events = await this.eventModel.find().exec();
    const dtoEvents = events.map(event => GetEventResponseDto.fromDocument(event));
    return new GetAllEventResponseDto(dtoEvents);
  }

  async findOne(id: string): Promise<GetEventResponseDto> {
    return GetEventResponseDto.fromDocument(await this.eventModel.findById(id).exec());
  }

  async update(id: string, body: UpdateEventRequestDto): Promise<UpdateEventResponnseDto> {
    const updatedUser = await this.eventModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return UpdateEventResponnseDto.fromDocument(updatedUser);
  }

  async remove(id: string): Promise<DeleteEventResponnseDto> {
    const deletedUser = await this.eventModel.findByIdAndUpdate(id, { isDeleted: true });
    if (!deletedUser) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return DeleteEventResponnseDto.fromDocument(deletedUser);
  }
}
