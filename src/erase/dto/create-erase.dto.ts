import { IsNotEmpty, IsString } from "class-validator";

export class CreateEraseDto {  
    @IsNotEmpty()
    @IsString()
    password: string;
  }