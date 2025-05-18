import { ExceptionFilter, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventRequestDto, CreateEventResponseDto, DeleteEventRequestDto, DeleteEventResponnseDto, GetAllEventResponseDto, GetEventRequestDto, GetEventResponseDto, UpdateEventRequestDto, UpdateEventResponnseDto } from './dto/event.dto';
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

  async findOne(param: GetEventRequestDto): Promise<GetEventResponseDto> {
    const id = param.id;
    return GetEventResponseDto.fromDocument(await this.eventModel.findById(id).exec());
  }

  async update(body: UpdateEventRequestDto): Promise<UpdateEventResponnseDto> {
    const updatedUser = await this.eventModel.findByIdAndUpdate(body.id, body, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`Event with ID ${body.id} not found`);
    }
    return UpdateEventResponnseDto.fromDocument(updatedUser);
  }

  async remove(param: DeleteEventRequestDto): Promise<DeleteEventResponnseDto> {
    const deletedUser = await this.eventModel.findByIdAndUpdate(param.id, { isDeleted: true });
    if (!deletedUser) {
      throw new NotFoundException(`Event with ID ${param.id} not found`);
    }
    return DeleteEventResponnseDto.fromDocument(deletedUser);
  }
}
