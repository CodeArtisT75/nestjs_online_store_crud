import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ValidationErrorException } from '../exceptions/validation-error.exception';

@Catch(ValidationErrorException)
export class ValidationErrorExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      status: false,
      errors: (exception.getResponse() as any).errors,
      message: exception.message
    });
  }
}
