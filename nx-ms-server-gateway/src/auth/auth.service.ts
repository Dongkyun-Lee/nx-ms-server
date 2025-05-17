import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpProxyService } from 'src/proxy/http-proxy.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth');

  private readonly GATEWAY_AUTH_PREFIX: string = process.env.SERVER_GATEWAY_AUTH_PREFIX;
  private readonly SERVER_AUTH_URL: string = process.env.AUTH_SERVICE_URL;

  constructor(
    private readonly proxyService: HttpProxyService,
    private readonly jwtService: JwtService,
  ) {}

  async getAuthUrl(path: string): Promise<string> {
    return this.SERVER_AUTH_URL + path.replace(this.GATEWAY_AUTH_PREFIX, '');
  }

  async wrapReturnForm(response: AxiosResponse<unknown, any>) {
    return {
      status: response.status,
      data: response.data,
    };
  }

  async login(path: string, body: any, headers: any, params: any) {
    const url = await this.getAuthUrl(path);

    const response = await lastValueFrom(
      await this.proxyService.proxyPost(
        url,
        body,
        {
          'Content-Type': 'application/json',
          Authorization: headers.authrorization,
        },
        params,
      ),
    );

    return this.wrapReturnForm(response);
  }

  async refreshToken(path: string, body: any, headers: any, params: any) {
    const url = await this.getAuthUrl(path);

    const response = await lastValueFrom(
      await this.proxyService.proxyPost(
        url,
        body,
        {
          'Content-Type': 'application/json',
          Authorization: headers.authrorization,
        },
        params,
      ),
    );

    return this.wrapReturnForm(response);
  }

  async getProfile(path: string, headers: any, params: any) {
    const url = await this.getAuthUrl(path);

    const response = await lastValueFrom(
      await this.proxyService.proxyGet(
        url,
        {
          'Content-Type': 'application/json',
          Authorization: headers.authrorization,
        },
        params,
      ),
    );

    return this.wrapReturnForm(response);
  }

  async verifyJwt(path: string, body: any, headers: any, params: any) {
    const url = await this.getAuthUrl(path);

    const response = await lastValueFrom(
      await this.proxyService.proxyPost(
        url,
        body,
        {
          'Content-Type': 'application/json',
          Authorization: headers.authrorization,
        },
        params,
      ),
    );

    return this.wrapReturnForm(response);
  }

  async getUserByEmail(path: string, headers: any, params: any) {
    const url = await this.getAuthUrl(path);

    const response = await lastValueFrom(
      await this.proxyService.proxyGet(url, headers, params),
    );

    return this.wrapReturnForm(response);
  }

  async createUser(path: string, body: any, headers: any, params: any) {
    const url = await this.getAuthUrl(path);

    const response = await lastValueFrom(
      await this.proxyService.proxyPost(
        url,
        body,
        {
          'Content-Type': 'application/json',
          Authorization: headers.authrorization,
        },
        params,
      ),
    );

    return this.wrapReturnForm(response);
  }
}
