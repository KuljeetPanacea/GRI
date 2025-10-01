import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { RocAssetControlQstnService } from "./service/rocAssetControlQstn.service";
import { RocAssetControlQstnDAO } from "./dao/rocAssetControlQstn.DAO";
import { RocAssetControlQstn, RocAssetControlQstnSchema } from "./model/rocAssetControlQstn.model";
import { RocAssetControlQstnController } from "./controllers/rocAssetControlQstn.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RocAssetControlQstn.name, schema: RocAssetControlQstnSchema }]),
  ],
  controllers: [RocAssetControlQstnController],
  providers: [
    {
    provide: DATABASE_CONSTANTS.RocAssetControl_DAO,
    useClass: RocAssetControlQstnDAO,
    },
    RocAssetControlQstnService,
  ],
  exports: [RocAssetControlQstnService],
})
export class RocAssetControlQstnModule {}
