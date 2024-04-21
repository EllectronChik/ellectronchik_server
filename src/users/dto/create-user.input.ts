import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @Length(3, 20)
  @IsString()
  readonly name: string;

  @Field()
  @IsNotEmpty()
  @Length(6, 20)
  @IsStrongPassword()
  readonly password: string;
}
