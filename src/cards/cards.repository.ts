import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsRepository {

  private SALT = 10;
  constructor(private readonly prisma: PrismaService) { }

  async create(createCardDto: CreateCardDto, userId: number) {

    await this.prisma.card.create({
      data: {
        ...createCardDto,
        userId
      }
    })
    return 
  }

  findAllByUserId(userId: number) {
    return this.prisma.card.findMany({
      where: { userId }
    })
  }
  
  findOneById(id: number) {
    return this.prisma.card.findUnique({
      where: { id }
    })
  }

  getCardByTitle(title: string, userId: number) {
    return this.prisma.card.findFirst({
      where: { title, userId}
    })
  }

  async delete(id: number) {
    await this.prisma.card.delete({
      where: { id }
    })
    return
  }
  
}