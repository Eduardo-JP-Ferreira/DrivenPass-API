import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNoteDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "My Title", description: "note's title" })
    title: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "This is a note...", description: "note's description" })
    note: string;
}
