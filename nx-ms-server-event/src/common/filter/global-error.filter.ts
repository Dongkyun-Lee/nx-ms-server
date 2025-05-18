import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch() // 모든 예외를 잡는 대신 아래 조건으로 필터링할게요.
export class GlobalErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // MongoDB 에러인지 체크 (대부분 code 프로퍼티로 구분)
    if (exception?.code) {
      const code = exception.code;

      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal Server Error';

      if (code === 11000) {
        statusCode = HttpStatus.CONFLICT;
        const field = Object.keys(exception.keyValue || {})[0];
        const value = exception.keyValue?.[field];
        message = `${field} "${value}" already exists.`;
      } else if (code === 121) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Document validation failed.';
      } else if (code === 2) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Invalid value provided.';
      } else if (code === 9) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Malformed query.';
      } else if (code === 13) {
        statusCode = HttpStatus.UNAUTHORIZED;
        message = 'Access denied.';
      } else if (code === 50) {
        statusCode = HttpStatus.GATEWAY_TIMEOUT;
        message = 'Query timed out.';
      } else if (code === 66) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Attempted to modify immutable field.';
      } else if (code === 96) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Operation not allowed in transaction.';
      } else if (code === 100) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Index creation failed.';
      } else if (code === 11600 || code === 11601) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Operation was interrupted.';
      } else if (code === 10107 || code === 13435) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Write attempted on non-primary replica.';
      } else if (code === 17280) {
        statusCode = HttpStatus.CONFLICT;
        message = 'Write conflict occurred.';
      } else {
        message = exception.message || message;
      }

      response.status(statusCode).json({
        statusCode,
        error: 'MongoDB Error',
        message,
        details: exception.message,
      });
      return;
    }

    // MongoDB 에러가 아니면 기본 HttpException 처리
    if (exception instanceof HttpException) {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal server error';

      response.status(status).json({
        statusCode: status,
        message:
          typeof message === 'string'
            ? message
            : (message as any).message || 'Unexpected error',
        errorCode:
          exception instanceof HttpException ? (exception.getResponse() as any).errorCode : undefined,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      // 알 수 없는 에러는 500으로
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: exception.message || 'Unexpected error occurred',
      });
    }
  }
}
