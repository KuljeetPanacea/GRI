import { Module } from "@nestjs/common";
import { Lookup, LookupSchema } from "./model/lookup.model";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { LookupDAO } from "./dao/lookup.dao";
import { LookupController } from "./controller/lookup.controller";
import { LookupService } from "./service/lookup.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lookup.name, schema: LookupSchema }])
  ],
  controllers: [LookupController],
  providers: [
    {
      provide: DATABASE_CONSTANTS.LOOKUP_DAO,
      useClass: LookupDAO,
    },
    LookupService
  ],
  exports: [LookupService],
})
export class LookupModule {}