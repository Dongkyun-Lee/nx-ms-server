import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpProxyService {
  constructor(private readonly httpService: HttpService) {}

  private mergeHeadersWithUser(originalHeaders: any, user?: any): any {
    return {
      'Content-Type': originalHeaders['content-type'],
      Authorization: originalHeaders.authorization,
      ...(user && {
        'ms-user-id': user.sub,
        'ms-user-email': user.email,
        'ms-user-nickname': user.nickname,
        'ms-user-roles': Array.isArray(user.roles)
          ? user.roles.join(',')
          : user.role,
      }),
    };
  }

  private async handleRequest<T>(
    observable: Observable<AxiosResponse<T>>,
  ): Promise<T> {
    try {
      const response = await lastValueFrom(
        observable.pipe(
          catchError((error) => {
            const status = error.response?.status || 500;
            const message =
              error.response?.data?.message ||
              error.response?.data ||
              error.message ||
              'Internal Server Error';
            throw new HttpException(message, status);
          }),
        ),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async proxyGet<T>(
    url: string,
    headers?: any,
    params?: any,
    user?: any,
  ): Promise<T> {
    const mergedHeaders = this.mergeHeadersWithUser(headers || {}, user);
    return this.handleRequest(
      this.httpService.get<T>(url, {
        headers: mergedHeaders,
        params,
      }),
    );
  }

  async proxyPost<T>(
    url: string,
    body?: any,
    headers?: any,
    params?: any,
    user?: any,
  ): Promise<T> {
    const mergedHeaders = this.mergeHeadersWithUser(headers || {}, user);
    return this.handleRequest(
      this.httpService.post<T>(url, body, {
        headers: mergedHeaders,
        params,
      }),
    );
  }

  async proxyPut<T>(
    url: string,
    body?: any,
    headers?: any,
    params?: any,
    user?: any,
  ): Promise<T> {
    const mergedHeaders = this.mergeHeadersWithUser(headers || {}, user);
    return this.handleRequest(
      this.httpService.put<T>(url, body, {
        headers: mergedHeaders,
        params,
      }),
    );
  }

  async proxyPatch<T>(
    url: string,
    body?: any,
    headers?: any,
    params?: any,
    user?: any,
  ): Promise<T> {
    const mergedHeaders = this.mergeHeadersWithUser(headers || {}, user);
    return this.handleRequest(
      this.httpService.patch<T>(url, body, {
        headers: mergedHeaders,
        params,
      }),
    );
  }

  async proxyDelete<T>(
    url: string,
    headers?: any,
    params?: any,
    user?: any,
  ): Promise<T> {
    const mergedHeaders = this.mergeHeadersWithUser(headers || {}, user);
    return this.handleRequest(
      this.httpService.delete<T>(url, {
        headers: mergedHeaders,
        params,
      }),
    );
  }

  async request<T>(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    options: {
      body?: any;
      headers?: any;
      params?: any;
      user?: any;
    },
  ): Promise<T> {
    const headers = this.mergeHeadersWithUser(
      options.headers || {},
      options.user,
    );

    return this.handleRequest(
      this.httpService.request<T>({
        method,
        url,
        headers,
        params: options.params,
        data: options.body,
      }),
    );
  }
}
