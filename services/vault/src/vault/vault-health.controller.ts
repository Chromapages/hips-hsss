import { Controller, Get } from "@nestjs/common";
import { VaultRepository } from "./vault.repository";

@Controller("healthz")
export class VaultHealthController {
  constructor(private readonly vaultRepository: VaultRepository) {}

  @Get()
  liveness() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Get("ready")
  async readiness() {
    let dbOk = false;
    try {
      await this.vaultRepository.findByToken("__health_check__");
      dbOk = true;
    } catch {}

    return {
      status: dbOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        database: dbOk ? "ok" : "unavailable",
      },
    };
  }
}
