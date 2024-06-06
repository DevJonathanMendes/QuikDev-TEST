import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientValidationError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(_: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const statusCode = HttpStatus.BAD_REQUEST;
    res.status(statusCode).json({
      message: [
        'Unknown argument',
        'The data provided is not part of our schema',
      ],
      error: 'Bad Request',
      statusCode,
    });
  }
}
