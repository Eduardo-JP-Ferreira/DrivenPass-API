import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, Matches, MaxLength, MinLength, Validate, minLength } from 'class-validator';
import { IsValidCardType } from '../../decorators/card-type.validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumberString()
  number: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(3)
  @MaxLength(3)
  cvc: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'O formato deve ser MM/YY' })
  expirationDate: string;

  @IsNotEmpty()
  @IsNumberString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  virtual: boolean;

  @IsNotEmpty()
  @IsString()
  @Validate(IsValidCardType)
  type: string;
}
