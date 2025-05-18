import { Injectable } from '@nestjs/common';
import { RewardDto } from './dto/reward.dto';

@Injectable()
export class RewardService {
  create(createRewardDto) {
    return 'This action adds a new reward';
  }

  findAll() {
    return `This action returns all reward`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reward`;
  }

  update(id: number, updateRewardDto) {
    return `This action updates a #${id} reward`;
  }

  remove(id: number) {
    return `This action removes a #${id} reward`;
  }

  // ids 배열 받아서 serch
  findAllByIds(ids: string[]) {
    return [];
  }

  // Reward 객체 받아서 일괄 create
  createByList(rewards: Partial<RewardDto>[]) {
    return [];
  }
}
