import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { VaultModule } from "./vault/vault.module";
import { KmsModule } from "./kms/kms.module";

@Module({
  imports: [VaultModule, KmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
