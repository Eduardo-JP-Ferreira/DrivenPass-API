import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: "youremail@email.com", description: "user's email" })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({ example: "s3nh@f0rTe!", description: "user's password" })
  password: string;
}
