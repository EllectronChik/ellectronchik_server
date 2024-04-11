import { Field } from "@nestjs/graphql";
import { IsString, IsStrongPassword, MaxLength } from "class-validator";

export class CreateUserDto {
  @Field()
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @Field()
  @IsString()
  @MaxLength(30)
  @IsStrongPassword()
  readonly password: string;
}