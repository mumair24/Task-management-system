import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './utils/database/database.module';
import { getResourceModules } from './resource.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    ...getResourceModules
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
