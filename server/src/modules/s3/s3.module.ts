import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { S3, S3Schema } from "./model/s3.model";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { S3DAO } from "./dao/S3.DAO";
import { S3Controller } from "./controllers/s3.controller";
import { S3Service } from "./service/s3.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: S3.name, schema: S3Schema }]),
  ],
  controllers: [S3Controller],
  providers: [
    {
    provide: DATABASE_CONSTANTS.S3_DAO,
    useClass: S3DAO,
    },
    S3Service,
  ],
  exports: [S3Service],
})
export class S3Module {}
