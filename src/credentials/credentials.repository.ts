import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCredentialDto } from './dto/create-credential.dto';

@Injectable()
export class CredentialsRepository {

  private SALT = 10;
  constructor(private readonly prisma: PrismaService) { }

  async create(createCredentialDto: CreateCredentialDto, userId: number) {
    await this.prisma.credential.create({
      data: {
        ...createCredentialDto,
        userId
      }
    })

    return
  }

  findAllByUserId(userId: number) {
    return this.prisma.credential.findMany({
      where: { userId }
    })
  }
  
  findOneById(id: number) {
    return this.prisma.credential.findUnique({
      where: { id }
    })
  }

  getCredentialByTitle(title: string, userId: number) {
    return this.prisma.credential.findFirst({
      where: { title, userId}
    })
  }

  delete(id: number) {
    return this.prisma.credential.delete({
      where: { id }
    })
  }
}