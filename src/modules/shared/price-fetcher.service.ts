import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PriceFetcherService {
  async fetchPrice(chain: string, apiUrl: string): Promise<number | null> {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'X-API-Key': process.env.MORALIS_API_KEY,
        },
      });

      const price = response.data.usdPrice;
      return price;
    } catch (error) {
      console.error(`Error fetching price for ${chain}:`, error);
      return null;
    }
  }
}
