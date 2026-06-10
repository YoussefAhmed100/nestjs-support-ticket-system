import { HydratedDocument } from 'mongoose';
import { Ticket } from '../schemas/ticket.schema';
import { HandlerResult } from '../interfaces/handler-result.interface';
import { TicketStatus } from '../enums/ticket-status.enum';
import { AuditEntry } from '../interfaces/audit-entry.interface';

export type TicketDocument = HydratedDocument<Ticket>;

export abstract class TicketHandler {
  protected nextHandler?: TicketHandler;

  setNext(handler: TicketHandler): TicketHandler {
    this.nextHandler = handler;
    return handler;
  }

  abstract handle(ticket: TicketDocument): Promise<HandlerResult>;

  protected async passToNext(ticket: TicketDocument): Promise<HandlerResult> {
    if (this.nextHandler) {
      return this.nextHandler.handle(ticket);
    }

    return {
      handled: false,
      handledBy: 'NONE',
      status: TicketStatus.ESCALATED,
      message: `Ticket ${ticket._id.toString()} could not be handled`,
      processedAt: new Date(),
    };
  }

  protected addAudit(ticket: TicketDocument, entry: AuditEntry) {
    if (!ticket.auditTrail) {
      ticket.auditTrail = [];
    }

    ticket.auditTrail.push(entry);
  }
}
