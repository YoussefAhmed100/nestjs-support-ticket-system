import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Priority } from '../enums/priority.enum';
import { Category } from '../enums/category.enum';
import { TicketStatus } from '../enums/ticket-status.enum';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({
  timestamps: true,
})
export class Ticket {
  @Prop({ required: true })
  customerName: string;

  @Prop({
    required: true,
    enum: Priority,
  })
  priority: Priority;

  @Prop({
    required: true,
    enum: Category,
  })
  category: Category;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    enum: TicketStatus,
    default: TicketStatus.PENDING,
  })
  status: TicketStatus;

  @Prop({ type:String})
  handledBy: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
