import { PreconditionFailedException } from '@nestjs/common';

export class FailedToSignInException extends PreconditionFailedException {
  constructor(error?: string) {
    super('error.failed_to_signin', error);
  }
}
