import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
// import { MaxLengthVarChar, MinLengthVarChar } from './constants';
import { CreateUserDto } from './create-user.dto';

// const { MIN_NAME, MIN_EMAIL, MIN_PASSWORD } = MinLengthVarChar;
// const { MAX_NAME, MAX_EMAIL, MAX_PASSWORD } = MaxLengthVarChar;

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  id: number;

  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  password: string;
}
