import { Injectable } from '@nestjs/common';
import { SpamFilterHandler } from '../handlers/spam-filter.handler';
import { DuplicateCheckHandler } from '../handlers/duplicate-check.handler';
import { PreCheckHandler } from '../handlers/pre-check-handler.abstract';

@Injectable()
export class PreCheckFactory {
  constructor(
    private readonly spam: SpamFilterHandler,
    private readonly duplicate: DuplicateCheckHandler,
  ) {}

  build(): PreCheckHandler {
    this.spam.setNext(this.duplicate);
    return this.spam;
  }
}