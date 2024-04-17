import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsResolver } from './goals.resolver';
import { Goal, GoalSchema } from './schema/goal.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Goal.name, schema: GoalSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [GoalsResolver, GoalsService],
})
export class GoalsModule {}
