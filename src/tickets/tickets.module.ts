import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Ticket, TicketSchema } from './schemas/ticket.schema';

import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

import { TicketChainFactory } from './factories/ticket-chain.factory';

import { BasicSupportHandler } from './handlers/basic-support.handler';
import { TechnicalSupportHandler } from './handlers/technical-support.handler';
import { EngineeringHandler } from './handlers/engineering.handler';
import { ManagementHandler } from './handlers/management.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
    ]),
  ],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    TicketChainFactory,

    BasicSupportHandler,
    TechnicalSupportHandler,
    EngineeringHandler,
    ManagementHandler,
  ],
})
export class TicketsModule {}