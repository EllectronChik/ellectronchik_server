import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class SubscriptionService {
  private pubSub = new PubSub();

  get getPubSub() {
    return this.pubSub;
  }
}
