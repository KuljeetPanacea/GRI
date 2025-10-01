import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RocDataPartOneService } from './service/roc-data-part-one.service';
import { RocDataPartOneController } from './controllers/roc-data-part-one.controller';
import { RocPartOneDAO } from './dao/roc-part-one.dao';
import { DATABASE_CONSTANTS } from 'src/core/database/constant';
import { RocPartOneSchema, RocPartOne } from './model/roc-part-one.model';
import { AuthModule } from '../authentication/AuthModule';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RocPartOne.name, schema: RocPartOneSchema },
    ]),
    AuthModule,
    UserModule
  ],
  controllers: [RocDataPartOneController],
  providers: [
    {
      provide: DATABASE_CONSTANTS.ROC_DATA_PART_ONE_DAO,
      useClass: RocPartOneDAO,
    },
    RocDataPartOneService,
  ],
  exports: [RocDataPartOneService],
})
export class RocDataPartOneModule {}
