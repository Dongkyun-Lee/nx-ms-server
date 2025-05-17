import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';
import { GetHelloResponse } from './types/event.interface';
import { HTTP_CONSTANTS } from 'src/common/constants';
import { HttpMethod } from 'src/common/types';

@Injectable()
export class EventService {
  private readonly GATEWAY_EVENT_PREFIX: string = process.env.SERVER_GATEWAY_EVENT_PREFIX;
  private readonly EVENT_URL: string = process.env.EVENT_SERVICE_URL;

  constructor(private readonly httpService: HttpService) {}

  async getAuthUrl(path: string): Promise<string> {
    return this.EVENT_URL + path.replace(this.GATEWAY_EVENT_PREFIX, '');
  }

  async wrapReturnForm(response: AxiosResponse<unknown, any>) {
    return {
      status: response.status,
      data: response.data,
    };
  }
}
