import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppendixService } from './service/appendix.service';
import { AppendixController } from './controllers/appendix.controller';
import { AppendixDAO } from './dao/appendix.dao';
import { DATABASE_CONSTANTS } from 'src/core/database/constant';
import { AppendixSchema, Appendix } from './model/appendix.model';
import { AuthModule } from '../authentication/AuthModule';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appendix.name, schema: AppendixSchema },
    ]),
    AuthModule,
    UserModule
  ],
  controllers: [AppendixController],
  providers: [
    {
      provide: DATABASE_CONSTANTS.APPENDIX_DAO,
      useClass: AppendixDAO,
    },
    AppendixService,
  ],
  exports: [AppendixService],
})
export class AppendixModule {}