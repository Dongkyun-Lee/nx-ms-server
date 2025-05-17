import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class HttpProxyService {
  private readonly SERVER_EVENT_URL = process.env.EVENT_SERVICE_URL;

  constructor(private readonly httpService: HttpService) { }

  async request<T>(method: 'get' | 'post' | 'put' | 'delete', url: string, options: {
    body?: any;
    headers?: any;
    params?: any;
  }): Promise<Observable<AxiosResponse<T>>> {
    return await this.httpService.request<T>({
      method,
      url,
      headers: options.headers,
      params: options.params,
      data: options.body,
    });
  }

  async proxyGet<T>(url: string, headers?: any, params?: any): Promise<Observable<AxiosResponse<T>>> {
    return await this.httpService.get<T>(url, { headers, params });
  }

  async proxyPost<T>(url: string, body?: any, headers?: any, params?: any): Promise<Observable<AxiosResponse<T>>> {
    return await this.httpService.post<T>(url, body, { headers, params });
  }

  async proxyPut<T>(url: string, body?: any, headers?: any, params?: any): Promise<Observable<AxiosResponse<T>>> {
    return await this.httpService.put<T>(url, body, { headers, params });
  }

  async proxyDelete<T>(url: string, headers?: any, params?: any): Promise<Observable<AxiosResponse<T>>> {
    return await this.httpService.delete<T>(url, { headers, params });
  }
}
