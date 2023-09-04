import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async createTweet(@Body() createNoteDto: CreateNoteDto, @User() user: UserPrisma) {
    try {
      return await this.notesService.create(createNoteDto, user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }
  
  @Get()
  async findAll(@User() user: UserPrisma) {
    try {
      return await this.notesService.findAllByUserId(user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return await this.notesService.findOneById(+id, user.id);
    } catch (error) {
      if(error.response === 'FORBIDDEN') throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN)
      throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return this.notesService.remove(+id, user.id);
    } catch (error) {
      if(error.response === 'FORBIDDEN') throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN)
      throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND)
    }
  }
}
