import { Injectable } from '@nestjs/common';

import { TicketHandler, TicketDocument } from './ticket-handler.abstract';

import { Priority } from '../enums/priority.enum';
import { TicketStatus } from '../enums/ticket-status.enum';

import { HandlerResult } from '../interfaces/handler-result.interface';

@Injectable()
export class ManagementHandler extends TicketHandler {
  async handle(ticket: TicketDocument): Promise<HandlerResult> {
    const canHandle = ticket.priority === Priority.CRITICAL;

    if (canHandle) {
      ticket.status = TicketStatus.ESCALATED;
      ticket.handledBy = 'Management';

      await ticket.save();

      return {
        handled: true,
        handledBy: 'Management',
        status: TicketStatus.ESCALATED,
        message: `CRITICAL ticket ${ticket._id.toString()} handled by Management`,
        processedAt: new Date(),
      };
    }

    ticket.status = TicketStatus.ESCALATED;

    await ticket.save();

    return {
      handled: true,
      handledBy: 'Management',
      status: TicketStatus.ESCALATED,
      message: `Ticket ${ticket._id.toString()} escalated to Management (final fallback)`,
      processedAt: new Date(),
    };
  }
}