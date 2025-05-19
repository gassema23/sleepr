import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE_NAME, NotificationsServiceClient } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {

  private readonly stripe: Stripe;
  private notificationService: NotificationsServiceClient;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME) private readonly client: ClientGrpc
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY', 'sk_test_51RPpJmQBkBbHh71Cmol8wPrIvflacwEOXCsdwKjYerp3wfqH2hUua3JhYh8UfW5jIR9v9PzNn60ETNzFEYHLGc7V00JZDRRcgW'), {
      apiVersion: '2025-04-30.basil',
    });
  }


  async createCharge({  amount, email }: PaymentsCreateChargeDto) {
  /*
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        cvc: card.cvc,
        number: card.number,
        exp_month: card.expMonth,
        exp_year: card.expYear,
      }
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

    if (!this.notificationService) {
      this.notificationService = this.client.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME);
    }

    this.notificationService.notifyEmail({
      email,
      text: `Payment of $${amount} was successful`
    })
      .subscribe(() => { });

    return paymentIntent;
  }

}
