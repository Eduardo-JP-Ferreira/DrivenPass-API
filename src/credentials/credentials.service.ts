import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { User } from '@prisma/client';
import { CredentialsRepository } from './credentials.repository';
import Cryptr from 'cryptr';

@Injectable()
export class CredentialsService {
  private cryptr: Cryptr;

  constructor(private readonly credentialsRepository: CredentialsRepository) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_SECRET, { pbkdf2Iterations: 10000, saltLength: 10 });
  }

  async create(createCredentialDto: CreateCredentialDto, user: User) {

    const checkTitle = await this.credentialsRepository.getCredentialByTitle(createCredentialDto.title, user.id)
    if(checkTitle) throw new HttpException("CONCLICT", HttpStatus.CONFLICT);

    createCredentialDto.password = this.cryptr.encrypt(createCredentialDto.password);

    return await this.credentialsRepository.create(createCredentialDto, user.id)
  }

  async findAllByUserId(userId: number) {
    const credentials = await this.credentialsRepository.findAllByUserId(userId)
    
    return credentials.map(({ password, ...credential }) => {
      const { userId, ...rest } = credential;
      return {
        ...rest,
        password: this.cryptr.decrypt(password),
      };
    });
  }

  async findOneById(id: number, userId: number) {
    const credential = await this.credentialsRepository.findOneById(id)
    if(!credential) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);
    if(credential.userId !== userId) throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN);

    return {
      title: credential.title,
      username: credential.username,
      url: credential.url,
      password: this.cryptr.decrypt(credential.password),
    };
  }

  async remove(id: number, userId: number) {
    const credential = await this.credentialsRepository.findOneById(id)
    if(!credential) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);
    if(credential.userId !== userId) throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN);
    

    return this.credentialsRepository.delete(id)
  }
}
