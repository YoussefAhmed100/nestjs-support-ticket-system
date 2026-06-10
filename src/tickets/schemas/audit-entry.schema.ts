import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class AuditEntry {
  @Prop()
  handler: string;

  @Prop()
  action: string;

  @Prop()
  reason: string;

  @Prop()
  timestamp: Date;
}

export const AuditEntrySchema =
  SchemaFactory.createForClass(AuditEntry);