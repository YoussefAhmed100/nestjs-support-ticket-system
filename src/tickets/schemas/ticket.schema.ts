import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Priority } from '../enums/priority.enum';
import { Category } from '../enums/category.enum';
import { TicketStatus } from '../enums/ticket-status.enum';
import { AuditEntry } from '../interfaces/audit-entry.interface';
import { AuditEntrySchema } from './audit-entry.schema';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({
  timestamps: true,
  versionKey: false,
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

@Prop({
  type: [AuditEntrySchema],
  default: [],
})
auditTrail: AuditEntry[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
