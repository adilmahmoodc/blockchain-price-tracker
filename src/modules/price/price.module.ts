import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceController } from './price.controller';
import { Price } from '../../entities/price.entity';
import { PriceService } from './price.service';
import { PriceFetcherService } from '../shared/price-fetcher.service';

@Module({
  imports: [TypeOrmModule.forFeature([Price])], // Inject the Price repository here
  controllers: [PriceController],
  providers: [PriceService, PriceFetcherService],
})
export class PriceModule {}
