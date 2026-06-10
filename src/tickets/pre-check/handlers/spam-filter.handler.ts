import { Injectable } from '@nestjs/common';
import { PreCheckHandler } from './pre-check-handler.abstract';

interface PreCheckDto {
  customerName: string;
  description: string;
  priority?: string;
  category?: string;
}

@Injectable()
export class SpamFilterHandler extends PreCheckHandler {
  async handle(dto: PreCheckDto): Promise<any> {
    const spamWords = [
      'buy now',
      'free money',
      'click here',
      'subscribe',
      'make money fast',
    ];

    const description = (dto.description || '').toLowerCase();

    const isSpam = spamWords.some((word) =>
      description.includes(word),
    );

    if (isSpam) {
      return {
        ok: false,
        reason: 'SPAM_DETECTED',
      };
    }

    return this.nextHandle(dto);
  }
}