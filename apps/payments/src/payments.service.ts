import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

@Injectable()
export class PaymentsService {

  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY', 'sk_test_51RPpJmQBkBbHh71Cmol8wPrIvflacwEOXCsdwKjYerp3wfqH2hUua3JhYh8UfW5jIR9v9PzNn60ETNzFEYHLGc7V00JZDRRcgW'), {
      apiVersion: '2025-04-30.basil',
    });
   }


  async createCharge({ card, amount }: CreateChargeDto) {

    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'cad'
    });

    return paymentIntent;
  }

}
