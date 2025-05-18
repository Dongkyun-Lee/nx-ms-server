import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class HttpProxyService {
  constructor(private readonly httpService: HttpService) { }

  private mergeHeadersWithUser(originalHeaders: any, user?: any): any {
    return {
      'Content-Type': originalHeaders['content-type'],
      Authorization: originalHeaders.authorization,
      ...(user && {
        'ms-user-id': user.sub,
        'ms-user-email': user.email,
        'ms-user-nickname': user.nickname,
        'ms-user-role': Array.isArray(user.roles) ? user.roles.join(',') : user.role,
      }),
    };
  }

  async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    options: {
      body?: any;
      headers?: any;
      params?: any;
      user?: any; // user 정보 추가
    },
  ): Promise<Observable<AxiosResponse<T>>> {
    const headers = this.mergeHeadersWithUser(options.headers || {}, options.user);

    return await this.httpService.request<T>({
      method,
      url,
      headers,
      params: options.params,
      data: options.body,
    });
  }

  async proxyGet<T>(url: string, headers?: any, params?: any, user?: any): Promise<Observable<AxiosResponse<T>>> {
    const mergedHeaders = this.mergeHeadersWithUser(headers || {}, user);
    return await this.httpService.get<T>(url, { headers: mergedHeaders, params });
  }

  async proxyPost<T>(url: string, body?: any, headers?: any, params?: any, user?: any): Promise<Observable<AxiosResponse<T>>> {
    const mergedHeaders = this.mergeHeadersWithUser(headers || {}, user);
    return await this.httpService.post<T>(url, body, { headers: mergedHeaders, params });
  }

  async proxyPut<T>(url: string, body?: any, headers?: any, params?: any, user?: any): Promise<Observable<AxiosResponse<T>>> {
    const mergedHeaders = this.mergeHeadersWithUser(headers || {}, user);
    return await this.httpService.put<T>(url, body, { headers: mergedHeaders, params });
  }

  async proxyDelete<T>(url: string, headers?: any, params?: any, user?: any): Promise<Observable<AxiosResponse<T>>> {
    const mergedHeaders = this.mergeHeadersWithUser(headers || {}, user);
    return await this.httpService.delete<T>(url, { headers: mergedHeaders, params });
  }

  async proxyPatch<T>(url: string, body?: any, headers?: any, params?: any, user?: any): Promise<Observable<AxiosResponse<T>>> {
    const mergedHeaders = this.mergeHeadersWithUser(headers || {}, user);
    return await this.httpService.patch<T>(url, body, { headers: mergedHeaders, params });
  }
}
