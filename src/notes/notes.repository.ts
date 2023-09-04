import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesRepository {

  private SALT = 10;
  constructor(private readonly prisma: PrismaService) { }

  async create(createNoteDto: CreateNoteDto, userId: number) {
    await this.prisma.note.create({
      data: {
        ...createNoteDto,
        userId
      }
    })

    return
  }

  findAllByUserId(userId: number) {
    return this.prisma.note.findMany({
      where: { userId }
    })
  }
  
  findOneById(id: number) {
    return this.prisma.note.findUnique({
      where: { id }
    })
  }

  getNoteByTitle(title: string, userId: number) {
    return this.prisma.note.findFirst({
      where: { title, userId}
    })
  }

  delete(id: number) {
    return this.prisma.note.delete({
      where: { id }
    })
  }
}