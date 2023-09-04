import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EraseRepository {

  constructor(private readonly prisma: PrismaService) { }

  async delete(id: number) {
    await this.prisma.card.deleteMany({ where: { userId: id } })
    await this.prisma.note.deleteMany({ where: { userId: id } })
    await this.prisma.credential.deleteMany({ where: { userId: id } })
    await this.prisma.user.delete({ where: { id } })
    return
  }
}