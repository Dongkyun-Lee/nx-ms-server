import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateEventRequestDto,
  CreateEventResponseDto,
  DeleteEventResponnseDto,
  GetAllEventResponseDto,
  GetEventResponseDto,
  UpdateEventRequestDto,
  UpdateEventResponnseDto,
} from './dto/event.dto';
import { Model } from 'mongoose';
import { Event, EventDocument } from './entities/event.entity';
import { InjectModel } from '@nestjs/mongoose';
import { RewardService } from 'src/reward/reward.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    private readonly rewardService: RewardService,
  ) {}

  async create(body: CreateEventRequestDto): Promise<CreateEventResponseDto> {
    const { rewards, rewardIds } = body;
    let errorMessage: string = null;
    let result = null;
    // 보상 없이 생성하는 경우
    if (rewards && rewardIds) {
      throw new BadRequestException('Rewards or rewardIds are required');
    }
    // 등록된 보상을 연결해 생성하는 경우 등록된 보상인 지 확인
    if (rewardIds) {
      const _rewardIds = await this.rewardService.findAllByIds(rewardIds);
      if (rewardIds.length !== _rewardIds.length) {
        throw new BadRequestException('Can not find rewards by rewsardsIds');
      }
    }

    // 신규 등록된 보상이 있는 경우 body 에서 제거 후 보상 등록
    delete body['rewards'];
    const createdEvent = new this.eventModel({ ...body });
    result = await createdEvent.save();

    if (rewards && result) {
      const _rewards = await this.rewardService.createByList(
        rewards,
        result._id.toString(),
      );
      if (_rewards.length !== rewards.length) {
        errorMessage = 'Some rewards are failed to create';
      }
      const ids = _rewards.map((_reward) => _reward.id || _reward._id);

      result = await this.eventModel.findByIdAndUpdate(
        result._id,
        { rewardIds: ids },
        { new: true },
      );
    }

    return { ...CreateEventResponseDto.fromDocument(result), errorMessage };
  }

  async findAll(): Promise<GetAllEventResponseDto> {
    const events = await this.eventModel.find().exec();
    const dtoEvents = events.map((event) =>
      GetEventResponseDto.fromDocument(event),
    );
    return new GetAllEventResponseDto(dtoEvents);
  }

  async findOne(id: string): Promise<GetEventResponseDto> {
    const eventDoc = await this.eventModel
      .findById(id)
      .populate('rewardIds')
      .lean()
      .exec();

    if (!eventDoc) return null;

    return GetEventResponseDto.fromDocument(eventDoc);
  }

  async update(
    id: string,
    body: UpdateEventRequestDto,
  ): Promise<UpdateEventResponnseDto> {
    const updatedUser = await this.eventModel
      .findByIdAndUpdate(id, body, { new: true })
      .populate('rewardIds')
      .lean()
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return UpdateEventResponnseDto.fromDocument(updatedUser);
  }

  async remove(id: string): Promise<DeleteEventResponnseDto> {
    const target = await this.findOne(id);
    if (target.isDeleted) {
      throw new BadRequestException(`Eventwith ID ${id} already deleted`);
    }
    const deletedUser = await this.eventModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: Date.now(),
    });
    if (!deletedUser) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return DeleteEventResponnseDto.fromDocument(deletedUser);
  }

  async findOneNoPopulate(id: string): Promise<GetEventResponseDto> {
    const eventDoc = await this.eventModel.findById(id).lean().exec();

    if (!eventDoc) return null;

    return GetEventResponseDto.fromDocument(eventDoc);
  }
}
