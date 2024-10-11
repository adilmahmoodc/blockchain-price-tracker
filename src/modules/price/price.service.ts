import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Price } from '../../entities/price.entity';
import { PriceFetcherService } from '../shared/price-fetcher.service';
import { formatDateToReadable } from 'src/utils/date.utils';
import { btcApiUrl, ethApiUrl, polygonApiUrl } from 'src/config/constants';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    private readonly priceFetcherService: PriceFetcherService, // Inject the shared service
  ) {}

  async fetchAndSavePrice(chain: string, apiUrl: string): Promise<void> {
    const price = await this.priceFetcherService.fetchPrice(chain, apiUrl);
    if (price !== null) {
      await this.priceRepository.save({ chain, price });
      console.log(`Price for ${chain} saved: ${price}`);
    }
  }

  async fetchEthereumAndPolygonPrices(): Promise<void> {
    await this.fetchAndSavePrice('Ethereum', ethApiUrl);
    await this.fetchAndSavePrice('Polygon', polygonApiUrl);
  }

  async getPricesForLast24Hours(): Promise<any> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const prices = await this.priceRepository.find({
      where: { createdAt: Between(last24Hours, now) },
      order: { createdAt: 'DESC' },
    });

    // Group prices by chain and format timestamps
    const groupedPrices = prices.reduce((acc, price) => {
      const { chain, price: priceValue, createdAt } = price;

      const formattedTime = formatDateToReadable(createdAt);

      if (!acc[chain]) {
        acc[chain] = {
          chain: chain,
          prices: [],
        };
      }

      acc[chain].prices.push({ price: priceValue, timestamp: formattedTime });

      return acc;
    }, {});

    return Object.values(groupedPrices);
  }

  async getSwapRate(ethAmount: number): Promise<any> {
    try {
      const ethToUsdRate = await this.priceFetcherService.fetchPrice('Ethereum', ethApiUrl);

      const btcToUsdRate = await this.priceFetcherService.fetchPrice('Bitcoin', btcApiUrl);

      if (ethToUsdRate === null || btcToUsdRate === null) {
        return { error: 'Failed to fetch rates from Moralis' };
      }

      // Calculate ETH to BTC rate based on USD values
      const ethToBtcRate = ethToUsdRate / btcToUsdRate;

      // Calculate BTC amount and fees
      const btcAmount = ethAmount * ethToBtcRate;
      const feeEth = ethAmount * 0.03; // 3% fee in ETH
      const feeUsd = feeEth * ethToUsdRate; // Fee in USD

      return {
        ethAmount,
        btcAmount,
        fee: {
          eth: feeEth,
          usd: feeUsd,
        },
      };
    } catch (error) {
      console.error('Error calculating swap rate:', error);
      return { error: 'Error calculating swap rate' };
    }
  }

  @Cron('*/5 * * * *')
  async handlePriceCheckCron() {
    await this.fetchEthereumAndPolygonPrices();
  }
}
