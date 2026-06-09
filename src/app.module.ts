import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';


@Module({
  imports: [
        ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      inject: [ConfigService], 
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('database.uri'),
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      }),
    }),
    
    
    
    TicketsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
