import { Injectable } from '@nestjs/common';

import { TicketHandler } from './ticket-handler.abstract';
import { TicketDocument } from './ticket-handler.abstract';

import { Priority } from '../enums/priority.enum';
import { Category } from '../enums/category.enum';
import { TicketStatus } from '../enums/ticket-status.enum';

import { HandlerResult } from '../interfaces/handler-result.interface';

@Injectable()
export class BasicSupportHandler extends TicketHandler {
  async handle(ticket: TicketDocument): Promise<HandlerResult> {
    const canHandle =
      ticket.priority === Priority.LOW ||
      ticket.category === Category.ACCOUNT;

    if (canHandle) {
      ticket.status = TicketStatus.RESOLVED;
      ticket.handledBy = 'Basic Support';

      await ticket.save(); 

      return {
        handled: true,
        handledBy: 'Basic Support',
        status: TicketStatus.RESOLVED,
        message: `Ticket ${ticket._id.toString()} resolved by Basic Support`,
        processedAt: new Date(),
      };
    }

    return this.passToNext(ticket);
  }
}