import { Field } from "@nestjs/graphql";
import { IsString, IsStrongPassword, MaxLength } from "class-validator";

export class CreateUserDto {
  @Field()
  @IsString()
  @MaxLength(30)
  name: string;

  @Field()
  @IsString()
  @MaxLength(30)
  @IsStrongPassword()
  password: string;
}