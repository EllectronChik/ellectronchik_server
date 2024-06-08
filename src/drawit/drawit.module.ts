import { Module } from '@nestjs/common';
import { DrawitService } from './drawit.service';
import { DrawitResolver } from './drawit.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DrawIt, DrawItSchema } from './schema/drawit.schema';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DrawIt.name, schema: DrawItSchema }]),
  ],
  providers: [DrawitResolver, DrawitService, SubscriptionService],
})
export class DrawitModule {}
