import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './schemas/ticket.schema';
import { TicketChainFactory } from './factories/ticket-chain.factory';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketHandler } from './handlers/ticket-handler.abstract';
import { TicketStatus } from './enums/ticket-status.enum';



@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<Ticket>,

    private readonly chainFactory: TicketChainFactory,
  ) {}

  async createTicket(dto: CreateTicketDto) {
    // Create ticket in DB
    const ticket = await this.ticketModel.create({
      ...dto,
      status: TicketStatus.PENDING,
    });

    const chain: TicketHandler = this.chainFactory.buildChain();

    const result = await chain.handle(ticket);

    ticket.status = result.status;
    ticket.handledBy = result.handledBy;

    await ticket.save();

    return {
      ticketId: ticket._id.toString(),
      ...result,
    };
  }
}