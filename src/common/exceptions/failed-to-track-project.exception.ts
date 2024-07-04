import { PreconditionFailedException } from '@nestjs/common';

export class FailedToTrackProjectException extends PreconditionFailedException {
  constructor(error?: string) {
    super('error.failed_to_track-project', error);
  }
}
