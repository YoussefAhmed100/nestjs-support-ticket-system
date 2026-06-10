import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './schemas/ticket.schema';
import { TicketChainFactory } from './factories/ticket-chain.factory';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus } from './enums/ticket-status.enum';
import { PreCheckFactory } from './pre-check/factories/pre-check.factory';


@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<Ticket>,

    private readonly chainFactory: TicketChainFactory,
    private readonly preCheckFactory: PreCheckFactory
  ) {}

async createTicket(dto: CreateTicketDto) {
  //  Pre-Check Chain
  const preChain = this.preCheckFactory.build();
  const preResult = await preChain.handle(dto);

  if (preResult?.ok === false) {
    throw new ConflictException({
    ok: false,
    reason: preResult.reason,
    existingTicketId: preResult.existingTicketId,
  });
  }

  //  Create ticket in DB
  const ticket = await this.ticketModel.create({
    ...dto,
    status: TicketStatus.PENDING,
  });

  //  Business Chain
  const chain = this.chainFactory.buildChain();
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
