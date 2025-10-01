import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { RocControlFinding, RocControlFindingSchema } from "./model/RocControlFinding.model";
import { RocControlFindingController } from "./controllers/roc.controller";
import { RocControlFindingDAO } from "./dao/RocControlFinding.DAO";
import { RocControlFindingService } from "./service/rocControlFinding.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RocControlFinding.name, schema: RocControlFindingSchema }]),
  ],
  controllers: [RocControlFindingController],
  providers: [
    {
    provide: DATABASE_CONSTANTS.ROCControlFinding_DAO,
    useClass: RocControlFindingDAO,
    },
    RocControlFindingService,
  ],
  exports: [RocControlFindingService],
})
export class RocControlFindingModule {}
