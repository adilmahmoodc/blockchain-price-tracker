import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceModule } from './modules/price/price.module';
import { ConfigModule } from '@nestjs/config';
import { AlertModule } from './modules/alert/alert.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the configuration available globally
      envFilePath: '.env', // By default, it looks for the .env file in the root
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10), // Converts the port from string to number
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),
    ScheduleModule.forRoot(), // Enable scheduling in the app
    PriceModule, // Import the Price module
    AlertModule, // Import the Alert module
  ],
})
export class AppModule {}
