import { Controller, Get, Query } from '@nestjs/common';
import { PriceService } from './price.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('prices') // Group the endpoints under the 'prices' tag in Swagger UI
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('last-24-hours')
  @ApiOperation({ summary: 'Get prices for the last 24 hours' })
  @ApiResponse({
    status: 200,
    description: 'Prices fetched successfully',
    schema: {
      example: [
        {
          chain: 'Ethereum',
          prices: [
            { price: 2000, timestamp: '2024-10-11T12:00:00Z' },
            { price: 1995, timestamp: '2024-10-11T11:00:00Z' },
          ],
        },
        {
          chain: 'Polygon',
          prices: [
            { price: 1.5, timestamp: '2024-10-11T12:00:00Z' },
            { price: 1.45, timestamp: '2024-10-11T11:00:00Z' },
          ],
        },
      ],
    },
  })
  async getPricesLast24Hours() {
    return await this.priceService.getPricesForLast24Hours();
  }

  @Get('swap-rate')
  @ApiOperation({ summary: 'Get the swap rate from Ethereum to Bitcoin' })
  @ApiQuery({ name: 'ethAmount', required: true, description: 'Amount of Ethereum to swap' })
  @ApiResponse({
    status: 200,
    description: 'Swap rate calculated successfully',
    schema: {
      example: {
        ethAmount: 1,
        btcAmount: 0.0303,
        fee: {
          eth: 0.03,
          usd: 60,
        },
      },
    },
  })
  async getSwapRate(@Query('ethAmount') ethAmount: string) {
    const eth = parseFloat(ethAmount);

    if (isNaN(eth) || eth <= 0) {
      return { error: 'Invalid Ethereum amount' };
    }

    return this.priceService.getSwapRate(eth);
  }
}
