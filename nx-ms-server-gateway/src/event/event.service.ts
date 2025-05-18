import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpProxyService } from 'src/proxy/http-proxy.service';

@Injectable()
export class EventService {
  private readonly GATEWAY_EVENT_PREFIX: string = process.env.SERVER_GATEWAY_EVENT_PREFIX;
  private readonly EVENT_URL: string = process.env.EVENT_SERVICE_URL;

  constructor(
    private readonly httpService: HttpService,
    private readonly proxyService: HttpProxyService,
  ) {}

  async getAuthUrl(path: string): Promise<string> {
    return this.EVENT_URL + path.replace(this.GATEWAY_EVENT_PREFIX, '');
  }

  async wrapReturnForm(response: AxiosResponse<unknown, any>) {
    return {
      status: response.status,
      data: response.data,
    };
  }

  async post(req: any, path: string, body: any, headers: any, params: any) {
    const url = await this.getAuthUrl(path);
    const response = await lastValueFrom(await this.proxyService.proxyPost(url, body, headers, params, req?.user || undefined));

    return this.wrapReturnForm(response);
  }
  async delete(req: any, path: string, headers: any, params: any) {
    const url = await this.getAuthUrl(path);
    const response = await lastValueFrom(await this.proxyService.proxyDelete(url, headers, params, req?.user || undefined));

    return this.wrapReturnForm(response);
  }
  async patch(req: any, path: string, body: any, headers: any, params: any) {
    const url = await this.getAuthUrl(path);
    const response = await lastValueFrom(await this.proxyService.proxyPatch(url, body, headers, params, req?.user || undefined));

    return this.wrapReturnForm(response);
  }

  async get(req: any, path: string, headers: any, params: any) {
    const url = await this.getAuthUrl(path);
    console.log(url)
    const response = await lastValueFrom(await this.proxyService.proxyGet(url, headers, params, req?.user || undefined));

    return this.wrapReturnForm(response);
  }
}
