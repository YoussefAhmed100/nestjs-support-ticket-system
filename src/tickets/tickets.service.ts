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
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const existingTicket = await this.ticketModel.findOne({
      customerName: dto.customerName,
      description: dto.description,
      createdAt: {
        $gte: oneHourAgo,
      },
    });
    if (existingTicket) {
      return {
        message: 'A similar ticket has been created within the last hour. Please wait for support to respond.',
        ticketId: existingTicket._id.toString(),
      };
    }

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

  async getAllTicket() {
    return this.ticketModel.find({}).sort({ createdAt: -1 }).lean();
  }
}
