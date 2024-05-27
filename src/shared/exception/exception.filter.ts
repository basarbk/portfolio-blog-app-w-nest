import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  ValidationError,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class GenericExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctxt = host.switchToHttp();
    const response = ctxt.getResponse<Response>();
    const request = ctxt.getRequest<Request>();
    const status = exception.getStatus();
    let validationErrors: Record<string, string>;
    if (Array.isArray(exception.cause)) {
      validationErrors = {};
      const errors = exception.cause as ValidationError[];
      errors.forEach((error) => {
        validationErrors[error.property] = Object.values(error.constraints)[0];
      });
    }

    response.status(status).json({
      status,
      timestamp: Date.now(),
      path: request.url,
      message: exception.message,
      validationErrors,
    });
  }
}
