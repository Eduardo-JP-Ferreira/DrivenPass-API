import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUrl, } from 'class-validator';

export class CreateCredentialDto {   
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "My Title", description: "credential's title" })
  title: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ example: "https://www.google.com.br", description: "credential's title" })
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "username", description: "credential's username" })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "123456", description: "credential's password" })
  password: string;
}