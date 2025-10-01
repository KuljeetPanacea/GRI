import { Module } from "@nestjs/common";
import { SystemTemplate } from "./systemTemplate.service";
import { SystemTemplateDAO } from "./systemTemplate.dao";
import { MongooseModule } from "@nestjs/mongoose";
import { SystemTemplateSchema } from "./systemTemplate.schema";
import { SystemTemplateController } from "./systemTemplate.controller";

@Module({
    imports: [
    MongooseModule.forFeature([{ name: SystemTemplate.name, schema: SystemTemplateSchema }]),
    
    ],
  controllers: [SystemTemplateController],
  providers: [SystemTemplate,SystemTemplateDAO],
  exports: [SystemTemplate],
})
export class SystemTemplateModule {}
