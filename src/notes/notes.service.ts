import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '@prisma/client';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    const checkTitle = await this.notesRepository.getNoteByTitle(createNoteDto.title, user.id)
    if(checkTitle) throw new HttpException("CONCLICT", HttpStatus.CONFLICT);

    return await this.notesRepository.create(createNoteDto, user.id)
  }

  async findAllByUserId(userId: number) {
   return await this.notesRepository.findAllByUserId(userId) 
  }

  async findOneById(id: number, userId: number) {
    const note = await this.notesRepository.findOneById(id)
    if(!note) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);
    if(note.userId !== userId) throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN);

    return note
  }

  async remove(id: number, userId: number) {
    const note = await this.notesRepository.findOneById(id)
    if(!note) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);
    if(note.userId !== userId) throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN);

    return this.notesRepository.delete(id)
  }
}
