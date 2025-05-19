import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpProxyService } from 'src/proxy/http-proxy.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth');

  private readonly GATEWAY_AUTH_PREFIX: string =
    process.env.SERVER_GATEWAY_AUTH_PREFIX;
  private readonly SERVER_AUTH_URL: string = process.env.AUTH_SERVICE_URL;

  constructor(
    private readonly proxyService: HttpProxyService,
    private readonly jwtService: JwtService,
  ) {}

  async getAuthUrl(path: string): Promise<string> {
    return this.SERVER_AUTH_URL + path.replace(this.GATEWAY_AUTH_PREFIX, '');
  }

  async wrapReturnForm(data: any, status = 200) {
    return {
      status,
      data,
    };
  }

  async post(req: any, path: string, body: any, headers: any, params: any) {
    const url = await this.getAuthUrl(path);
    const data = await this.proxyService.proxyPost(
      url,
      body,
      headers,
      params,
      req?.user,
    );
    return this.wrapReturnForm(data);
  }

  async delete(req: any, path: string, headers: any, params: any) {
    const url = await this.getAuthUrl(path);
    const data = await this.proxyService.proxyDelete(
      url,
      headers,
      params,
      req?.user,
    );
    return this.wrapReturnForm(data);
  }

  async patch(req: any, path: string, body: any, headers: any, params: any) {
    const url = await this.getAuthUrl(path);
    const data = await this.proxyService.proxyPatch(
      url,
      body,
      headers,
      params,
      req?.user,
    );
    return this.wrapReturnForm(data);
  }

  async get(req: any, path: string, headers: any, params: any) {
    const url = await this.getAuthUrl(path);
    const data = await this.proxyService.proxyGet(
      url,
      headers,
      params,
      req?.user,
    );
    return this.wrapReturnForm(data);
  }
}
