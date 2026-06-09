import { Injectable } from '@nestjs/common';

import { TicketHandler, TicketDocument } from './ticket-handler.abstract';

import { Priority } from '../enums/priority.enum';
import { Category } from '../enums/category.enum';
import { TicketStatus } from '../enums/ticket-status.enum';

import { HandlerResult } from '../interfaces/handler-result.interface';

@Injectable()
export class TechnicalSupportHandler extends TicketHandler {
  async handle(ticket: TicketDocument): Promise<HandlerResult> {
    const isValidPriority =
      ticket.priority === Priority.LOW ||
      ticket.priority === Priority.MEDIUM;

    const isValidCategory =
      ticket.category === Category.TECHNICAL ||
      ticket.category === Category.BUG;

    const canHandle = isValidPriority && isValidCategory;

    if (canHandle) {
      ticket.status = TicketStatus.RESOLVED;
      ticket.handledBy = 'Technical Support';

      await ticket.save();

      return {
        handled: true,
        handledBy: 'Technical Support',
        status: TicketStatus.RESOLVED,
        message: `Ticket ${ticket._id.toString()} resolved by Technical Support`,
        processedAt: new Date(),
      };
    }

    return this.passToNext(ticket);
  }
}