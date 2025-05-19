import { Global, Module } from '@nestjs/common';
import { HttpProxyService } from './http-proxy.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [HttpProxyService],
  exports: [HttpProxyService],
})
export class ProxyModule {}
