import { IsEmail, IsString, Length } from 'class-validator';
import { MaxLengthVarChar, MinLengthVarChar } from './constants';
// import { IsStrongPassword } from 'class-validator';

const { MIN_NAME, MIN_EMAIL, MIN_PASSWORD } = MinLengthVarChar;
const { MAX_NAME, MAX_EMAIL, MAX_PASSWORD } = MaxLengthVarChar;

export class CreateUserDto {
  @IsString()
  @Length(MIN_NAME, MAX_NAME)
  name: string;

  @IsEmail()
  @Length(MIN_EMAIL, MAX_EMAIL)
  email: string;

  @IsString()
  // @IsStrongPassword() Mais recomendado.
  @Length(MIN_PASSWORD, MAX_PASSWORD)
  password: string;
}
