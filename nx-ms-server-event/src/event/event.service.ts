import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventRequestDto, CreateEventResponseDto, DeleteEventResponnseDto, GetAllEventResponseDto, GetEventResponseDto, UpdateEventRequestDto, UpdateEventResponnseDto } from './dto/event.dto';
import { Model } from 'mongoose';
import { Event, EventDocument } from './entities/event.entity';
import { InjectModel } from '@nestjs/mongoose';
import { RewardService } from 'src/reward/reward.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    private readonly rewardService: RewardService,
  ) { }

  async create(body: CreateEventRequestDto): Promise<CreateEventResponseDto> {
    const { rewards, rewardsIds } = body;
    let errorMessage = null;
    // 보상 없이 생성하는 경우
    if (rewards && rewardsIds) {
      throw new BadRequestException('rewards or rewardsIds required');
    }
    // 등록된 보상을 연결해 생성하는 경우 등록된 보상인 지 확인
    if (rewardsIds) {
      const _rewardsIds = await this.rewardService.findAllByIds(rewardsIds);
      if (rewards.length !== _rewardsIds.length) {
        throw new BadRequestException('can not find rewards by rewsardsIds');
      }
    }

    // 신규 등록된 보상이 있는 경우 body 에서 제거 후 보상 등록
    delete body['rewards'];
    const createdEvent = new this.eventModel({ ...body });
    const newEvent = await createdEvent.save();

    if (newEvent) {
      const _rewards = await this.rewardService.createByList(rewards);
      if (_rewards.length !== rewards.length) {
        errorMessage = 'some rewards are failed to create';
      }
    }

    return { ...CreateEventResponseDto.fromDocument(newEvent), errorMessage };
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
