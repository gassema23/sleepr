import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {

  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY', 'sk_test_51RPpJmQBkBbHh71Cmol8wPrIvflacwEOXCsdwKjYerp3wfqH2hUua3JhYh8UfW5jIR9v9PzNn60ETNzFEYHLGc7V00JZDRRcgW'), {
      apiVersion: '2025-04-30.basil',
    });
  }


  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    /*
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card
    });*/

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method: 'pm_card_visa',

      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
    });

    this.notificationsService.emit('notify_email', {
      email,
      text: `Payment of $${amount} was successful`
    });

    return paymentIntent;
  }

}
