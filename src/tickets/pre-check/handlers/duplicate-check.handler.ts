import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreCheckHandler } from './pre-check-handler.abstract';
import { createHash } from 'src/utils/create-hash.util';
import { Ticket } from 'src/tickets/schemas/ticket.schema';

@Injectable()
export class DuplicateCheckHandler extends PreCheckHandler {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<Ticket>,
  ) {
    super();
  }

  async handle(dto: any): Promise<any> {
    const hash = createHash({
      customerName: dto.customerName,
      description: dto.description,
    });

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const exists = await this.ticketModel.findOne({
      duplicateHash: hash,
      createdAt: { $gte: oneHourAgo },
    });

    if (exists) {
      return {
        ok: false,
        reason: 'Duplicate Ticket Already Exists Within The Last 1 Hour please wait or contact support with existing ticket id',
        existingTicketId: exists._id.toString(),
      };
    }

    // attach hash for later DB insert
    dto.duplicateHash = hash;

    return this.nextHandle(dto);
  }
}