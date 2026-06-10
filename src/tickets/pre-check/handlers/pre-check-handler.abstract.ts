export abstract class PreCheckHandler {
  protected next?: PreCheckHandler;

  setNext(handler: PreCheckHandler): PreCheckHandler {
    this.next = handler;
    return handler;
  }

  abstract handle(dto: any): Promise<any>;

  protected async nextHandle(dto: any): Promise<any> {
    if (this.next) {
      return this.next.handle(dto);
    }
    return { ok: true };
  }
}