import { Injectable } from '@nestjs/common';

import { TicketHandler, TicketDocument } from './ticket-handler.abstract';

import { Priority } from '../enums/priority.enum';
import { Category } from '../enums/category.enum';
import { TicketStatus } from '../enums/ticket-status.enum';

import { HandlerResult } from '../interfaces/handler-result.interface';

@Injectable()
export class EngineeringHandler extends TicketHandler {
  async handle(ticket: TicketDocument): Promise<HandlerResult> {
    const isHighPriority = ticket.priority === Priority.HIGH;

    const isValidCategory =
      ticket.category === Category.BUG ||
      ticket.category === Category.TECHNICAL;

    const canHandle = isHighPriority && isValidCategory;

    if (canHandle) {
      ticket.status = TicketStatus.RESOLVED;
      ticket.handledBy = 'Engineering';

      this.addAudit(ticket, {
        handler: 'Engineering',
        action: 'HANDLED',
        reason: 'HIGH priority + BUG/TECHNICAL category',
        timestamp: new Date(),
      });


      return {
        handled: true,
        handledBy: 'Engineering',
        status: TicketStatus.RESOLVED,
        message: `Ticket ${ticket._id.toString()} resolved by Engineering`,
        processedAt: new Date(),
      };
    }

    // ❌ AUDIT SKIPPED
    this.addAudit(ticket, {
      handler: 'Engineering',
      action: 'SKIPPED',
      reason: 'Not HIGH priority or invalid category',
      timestamp: new Date(),
    });

    return this.passToNext(ticket);
  }
}