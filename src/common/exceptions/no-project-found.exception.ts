import { NotFoundException } from '@nestjs/common';

export class NoProjectFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.no-project-found', error);
  }
}
