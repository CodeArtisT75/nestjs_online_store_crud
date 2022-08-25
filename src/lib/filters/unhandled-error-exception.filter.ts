import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import Logger from '../utils/Logger';

/**
 * This exception-filter must be handled in the end if other exception occurs.
 * It will handle unexpected errors in App, log it and return a response to client.
 */
@Catch(Error)
export class UnhandledErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errMsg = exception.message;
    const errorMeta = this.generateErrorMeta(exception, request);

    Logger.error(errMsg, errorMeta);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Internal server error.'
    });
  }

  private generateErrorMeta(exception: Error, request: Request) {
    const errorMeta = {
      request: {
        ip: request.ip,
        url: request.url,
        method: request.method,
        params: request.params,
        query: request.query,
        headers: JSON.parse(JSON.stringify(request.headers)), // clone request.headers (we need to delete Authorization later from logs),
        body: request.body,
        date: new Date().toLocaleDateString()
      },
      trace: exception?.stack?.split('\n').map(item => item.trim())
    };

    // remove auth header
    delete errorMeta.request.headers.authorization;

    return errorMeta;
  }
}
