import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateEraseDto {  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "s3nh@f0rTe!", description: "user's password" })
    password: string;
  }