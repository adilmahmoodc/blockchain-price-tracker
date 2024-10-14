import { Controller, Post, Body } from '@nestjs/common';
import { AlertService } from '../alert/alert.service';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post('set-alert')
  @ApiOperation({ summary: 'Set a price alert for a specific chain' })
  @ApiBody({
    description: 'Price alert details',
    schema: {
      example: {
        chain: 'Ethereum',
        price: 2000,
        email: 'user@example.com',
        direction: 'up',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Alert set successfully or error message returned',
    schema: {
      example: {
        success: true,
        message:
          'Price alert set for Ethereum at 2000 USD (up), email will be sent to user@example.com',
      },
    },
  })
  async setPriceAlert(
    @Body('chain') chain: string,
    @Body('price') price: number,
    @Body('email') email: string,
    @Body('direction') direction: 'up' | 'down',
  ) {
    return await this.alertService.setPriceAlert(
      chain,
      price,
      email,
      direction,
    );
  }
}
