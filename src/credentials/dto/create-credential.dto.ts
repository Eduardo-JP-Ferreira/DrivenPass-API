import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUrl, } from 'class-validator';

export class CreateCredentialDto {   
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}