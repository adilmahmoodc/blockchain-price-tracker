import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Price } from '../../entities/price.entity';
import { Alert } from '../../entities/alert.entity';
import { PriceFetcherService } from '../shared/price-fetcher.service';
import { sendPriceAlertEmail } from '../../common/email.service'; 
import { getApiUrlForChain } from 'src/utils/chain.utils';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    private readonly priceFetcherService: PriceFetcherService, // Inject PriceFetcherService
  ) {}

  /**
   * Set a price alert for a specific blockchain (chain) and price.
   * @param chain - The blockchain (e.g., Ethereum, Polygon).
   * @param price - The price threshold for triggering the alert.
   * @param email - The email address to send the alert to when the price hits.
   * @param direction - The direction of the alert ('up' or 'down').
   */
  async setPriceAlert(
    chain: string,
    targetPrice: number,
    email: string,
    direction: 'up' | 'down'
  ): Promise<{ success: boolean; message: string }> {

    const currentPrice = await this.priceFetcherService.fetchPrice(chain, getApiUrlForChain(chain));

    if (currentPrice === null) {
      return { success: false, message: 'Failed to fetch current price for the specified chain' };
    }

    if (direction === 'up' && targetPrice <= currentPrice) {
      return {
        success: false,
        message: `Invalid target price for 'up' direction: target price (${targetPrice}) must be higher than the current price (${currentPrice})`,
      };
    } else if (direction === 'down' && targetPrice >= currentPrice) {
      return {
        success: false,
        message: `Invalid target price for 'down' direction: target price (${targetPrice}) must be lower than the current price (${currentPrice})`,
      };
    }

    const alert = new Alert();
    alert.chain = chain;
    alert.targetPrice = targetPrice;
    alert.email = email;
    alert.direction = direction;

    await this.alertRepository.save(alert);

    console.log(`Price alert set for ${chain} at ${targetPrice} USD (${direction}), email will be sent to ${email}`);

    return { success: true, message: `Price alert set for ${chain} at ${targetPrice} USD (${direction}), notification will be sent to ${email}` };
  }

  async checkPriceIncrease(chain: string): Promise<void> {
    const now = new Date();
    const FiftyFiveMntAgo = new Date(now.getTime() - 55 * 60 * 1000);
    const oneHourFiveMntAgo = new Date(now.getTime() - 65 * 60 * 1000);

    const lastHourPrice = await this.priceRepository.findOne({
      where: { chain, createdAt: Between(oneHourFiveMntAgo, FiftyFiveMntAgo) },
      order: { createdAt: 'DESC' },
    });

    if (!lastHourPrice) {
      console.log(`No price data for ${chain} from one hour ago.`);
      return;
    }

    const currentPrice = await this.priceFetcherService.fetchPrice(chain, getApiUrlForChain(chain));

    if (currentPrice !== null) {
      const percentageIncrease = ((currentPrice - lastHourPrice.price) / lastHourPrice.price) * 100;
      console.log(`Price increase for ${chain}: ${percentageIncrease}%`);

      if (percentageIncrease > 3) {
        console.log(`${chain} price increased by more than 3%, sending email...`);
        await sendPriceAlertEmail(chain, 'hyperhire_assignment@hyperhire.in', currentPrice);
      }
    }
  }

  @Cron('*/1 * * * *')
  async checkPriceAlerts(): Promise<void> {
    const alerts = await this.alertRepository.find();
    if(alerts.length  === 0) return;

    for (const alert of alerts) {
      const currentPrice = await this.priceFetcherService.fetchPrice(alert.chain, getApiUrlForChain(alert.chain));
      console.log("currentPrice : ", currentPrice);

      if (currentPrice !== null) {
        if (alert.direction === 'up' && currentPrice >= alert.targetPrice) {
          console.log(`Price alert triggered (up) for ${alert.chain} at ${alert.targetPrice} USD, current price: ${currentPrice} USD`);
          await sendPriceAlertEmail(alert.chain, alert.email, currentPrice);
          await this.alertRepository.delete(alert.id);
        } else if (alert.direction === 'down' && currentPrice <= alert.targetPrice) {
          console.log(`Price alert triggered (down) for ${alert.chain} at ${alert.targetPrice} USD, current price: ${currentPrice} USD`);
          await sendPriceAlertEmail(alert.chain, alert.email, currentPrice);
          await this.alertRepository.delete(alert.id);
        }
      }
    }
  }

  @Cron('*/1 * * * *')
  async handlePriceCheckCron() {
    await this.checkPriceIncrease('Ethereum');
    await this.checkPriceIncrease('Polygon');
  }
}
