import { Injectable } from '@nestjs/common';

import { BasicSupportHandler } from '../handlers/basic-support.handler';
import { TechnicalSupportHandler } from '../handlers/technical-support.handler';
import { EngineeringHandler } from '../handlers/engineering.handler';
import { ManagementHandler } from '../handlers/management.handler';

import { TicketHandler } from '../handlers/ticket-handler.abstract';

@Injectable()
export class TicketChainFactory {
  constructor(
    private readonly basic: BasicSupportHandler,
    private readonly technical: TechnicalSupportHandler,
    private readonly engineering: EngineeringHandler,
    private readonly management: ManagementHandler,
  ) {}

buildChain(): TicketHandler {
  const basic = this.basic;
  const technical = this.technical;
  const engineering = this.engineering;
  const management = this.management;



  basic.setNext(technical);
  technical.setNext(engineering);
  engineering.setNext(management);

  return basic;
}
}