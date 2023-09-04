import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, Matches, MaxLength, MinLength, Validate, minLength } from 'class-validator';
import { IsValidCardType } from '../../decorators/card-type.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "My Title", description: "card's title" })
  title: string;
  
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({ example: "9999999999999999", description: "card's number" })
  number: string;
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "John", description: "card's owner name" })
  name: string;
  
  @IsNotEmpty()
  @IsNumberString()
  @MinLength(3)
  @MaxLength(3)
  @ApiProperty({ example: "111", description: "card's security number" })
  cvc: string;
  
  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'O formato deve ser MM/YY' })
  @ApiProperty({ example: "05/32", description: "card's expiration date" })
  expirationDate: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({ example: "123456", description: "card's password" })
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: "true", description: "if card is virtual or not" })
  virtual: boolean;
  
  @IsNotEmpty()
  @IsString()
  @Validate(IsValidCardType)
  @ApiProperty({ example: "CREDIT", description: "type of the card, it can be: CREDIT, DEBIT or BOTH" })
  type: string;
}
