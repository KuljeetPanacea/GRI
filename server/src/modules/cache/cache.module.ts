// import { CacheModule, Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as redisStore from 'cache-manager-redis-store';
// import * as session from 'express-session';
// import * as connectRedis from 'connect-redis';

// const RedisStore = connectRedis(session);

// @Module({
//   imports: [
//     CacheModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => {
//         if (configService.get('REDIS_ENABLED') === 'true') {
//           return {
//             store: redisStore,
//             host: configService.get('REDIS_HOST'),
//             port: configService.get('REDIS_PORT'),
//             ttl: 600,
//           };
//         } else {
//           return {};
//         }
//       },
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [ConfigService],
// })
// export class RedisCacheModule {}
