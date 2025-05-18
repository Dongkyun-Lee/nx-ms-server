import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRewardRequestDto, DeleteRewardResponnseDto, GetAllRewardResponseDto, GetRewardResponseDto, RewardDto, UpdateRewardRequestDto, UpdateRewardResponnseDto } from './dto/reward.dto';
import { Reward, RewardDocument } from './entities/reward.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RewardService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<RewardDocument>) {}

  async create(body: Partial<RewardDto>) {
    const newReward = await new this.rewardModel(body).save();
    return RewardDto.fromDocument(newReward);
  }

  async findAll(query: Partial<RewardDto>) {
    const rewards = await this.rewardModel.find().lean().exec();
    const dtoRewards = rewards.map((event) => RewardDto.fromDocument(event));
    return new GetAllRewardResponseDto(dtoRewards);
  }

  async findOne(id: string) {
    const rewardDoc = await this.rewardModel.findById(id)
      .populate('eventIds')
      .lean()
      .exec();

    if (!rewardDoc) return null;

    return GetRewardResponseDto.fromDocument(rewardDoc as RewardDocument);
  }

  async update(id: string, body: UpdateRewardRequestDto): Promise<UpdateRewardResponnseDto> {
    const updatedUser = await this.rewardModel.findByIdAndUpdate(id, body, { new: true }).populate('eventIds')
      .lean()
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return UpdateRewardResponnseDto.fromDocument(updatedUser);
  }

  async remove(id: string): Promise<DeleteRewardResponnseDto> {
    const target = await this.findOne(id);
    if (!target) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    if (target.isDeleted) {
      throw new BadRequestException(`Reward with ID ${id} already deleted`);
    }
    const deletedUser = await this.rewardModel.findByIdAndUpdate(id, { isDeleted: true, deletedAt: Date.now() });
    return DeleteRewardResponnseDto.fromDocument(deletedUser);
  }

  // ids 배열 받아서 search
  async findAllByIds(ids: string[]) {
    return await this.rewardModel.find({ _id: { $in: ids } }).lean();
  }

  // Reward 객체 받아서 일괄 create
  async createByList(rewards: CreateRewardRequestDto[], eventId: string) {
    const rewardDocs = rewards.map((reward) => ({
      ...reward,
      eventIds: [eventId],
    }));

    return await this.rewardModel.insertMany(rewardDocs);
  }
}
