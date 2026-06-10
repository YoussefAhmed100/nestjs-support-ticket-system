import { TicketStatus } from '../enums/ticket-status.enum';

export interface HandlerResult {
  handled: boolean;

  handledBy: string;

  status: TicketStatus;

  message: string;

  processedAt: Date;
  //  handlersPath: string[];
}