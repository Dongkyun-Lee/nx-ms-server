import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const { method, originalUrl, ip, body } = request;
    const userAgent = request.get('user-agent') || '';

    this.logger.log(`[REQUEST] ${method} ${request.get('host')}${originalUrl} - body: ${JSON.stringify(body, null, 2)} - IP: ${ip} - User-Agent: ${userAgent}`);

    return next.handle().pipe(
      tap((responseData) => { // 컨트롤러에서 반환된 값
        const statusCode = response.statusCode;
        const contentLength = response.get('content-length') || 0;
        this.logger.log(`[RESPONSE DATA] ${JSON.stringify(responseData, null, 2)}`); // 응답 데이터 로깅 (JSON 형식, 들여쓰기 적용)
        this.logger.log(
          `[RESPONSE] ${method} ${originalUrl} ${statusCode} ${contentLength} - ${ip} - ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
