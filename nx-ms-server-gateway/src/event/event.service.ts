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
  private readonly eventServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL');
  }

  proxyRequest<T>(
    method: HttpMethod,
    path: string,
    body?: any,
    headers?: any,
    params?: any,
  ): Observable<AxiosResponse<T>> {
    const url = `${this.eventServiceUrl}${path}`;
    const requestConfig = { headers, params };
    return this.httpService[method]<T>(url, body, requestConfig);
  }

  async getHello(
    path: string,
    query: any,
    headers: any,
  ): Promise<GetHelloResponse> {
    return this.proxyRequest<GetHelloResponse>(
      HTTP_CONSTANTS.GET,
      path,
      undefined,
      headers,
      query,
    )
      .pipe(
        map((response: AxiosResponse) => ({
          data: response.data,
          status: response.status,
        })),
      )
      .toPromise();
  }
}
