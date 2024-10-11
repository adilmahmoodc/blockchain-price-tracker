import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertService } from '../alert/alert.service';
import { Alert } from 'src/entities/alert.entity';
import { PriceFetcherService } from '../shared/price-fetcher.service';
import { AlertController } from './alert.controller';
import { Price } from 'src/entities/price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alert, Price])], // Inject the Price repository here
  controllers: [AlertController],
  providers: [AlertService, PriceFetcherService],
})
export class AlertModule {}
