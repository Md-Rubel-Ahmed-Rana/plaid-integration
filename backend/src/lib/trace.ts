import crypto from "crypto";
class Service {
  generateAPIRequestTraceId(): string {
    return crypto.randomUUID();
  }
}

export const TraceService = new Service();
