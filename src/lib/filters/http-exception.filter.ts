import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import Logger from '../utils/Logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // check if internal error happened and log it with Logger
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const errMsg = exception.message;
      const errorMeta = this.generateErrorMeta(exception, request);

      Logger.error(errMsg, errorMeta);
    }

    response.status(status).json({
      status: false,
      data: exception.message
    });
  }

  private generateErrorMeta(exception: HttpException, request: Request) {
    const errorMeta = {
      request: {
        ip: request.ip,
        url: request.url,
        method: request.method,
        params: request.params,
        query: request.query,
        headers: JSON.parse(JSON.stringify(request.headers)), // clone request.headers (we need to delete Authorization later from logs)
        body: request.body,
        date: new Date().toLocaleDateString()
      },
      trace: exception.stack?.split('\n').map(item => item.trim())
    };

    // remove auth header
    delete errorMeta.request.headers.authorization;

    return errorMeta;
  }
}
