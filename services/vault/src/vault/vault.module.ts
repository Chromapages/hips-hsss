import { Module } from "@nestjs/common";
import { VaultController } from "./vault.controller";
import { VaultHealthController } from "./vault-health.controller";
import { VaultService } from "./vault.service";
import { VaultRepository } from "./vault.repository";
import { KmsModule } from "../kms/kms.module";

@Module({
  imports: [KmsModule],
  controllers: [VaultController, VaultHealthController],
  providers: [VaultService, VaultRepository],
  exports: [VaultService, VaultRepository],
})
export class VaultModule {}
