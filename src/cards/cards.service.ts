import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import Cryptr from 'cryptr';
import { User } from '@prisma/client';
import { CardsRepository } from './cards.repository';

@Injectable()
export class CardsService {
 
    private cryptr: Cryptr;

    constructor(private readonly cardsRepository: CardsRepository) {
      const Cryptr = require('cryptr');
      this.cryptr = new Cryptr(process.env.CRYPTR_SECRET, { pbkdf2Iterations: 10000, saltLength: 10 });
    }
  
    async  create(createCardDto: CreateCardDto, user: User) {  
      const checkTitle = await this.cardsRepository.getCardByTitle(createCardDto.title, user.id)
      if(checkTitle) throw new HttpException("CONCLICT", HttpStatus.CONFLICT);
  
      createCardDto.password = this.cryptr.encrypt(createCardDto.password);
      createCardDto.cvc = this.cryptr.encrypt(createCardDto.cvc);

      return await this.cardsRepository.create(createCardDto, user.id)
    }
  
    async findAllByUserId(userId: number) {
      const cards = await this.cardsRepository.findAllByUserId(userId)
      
      return cards.map(({ password, cvc, ...card}) => {
        const { userId, ...rest } = card;
        return {
          ...rest,
          password: this.cryptr.decrypt(password),
          cvc: this.cryptr.decrypt(cvc),
        };
      });
    }
  
    async findOneById(id: number, userId: number) {
      const card = await this.cardsRepository.findOneById(id)
      if(!card) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);
      if(card.userId !== userId) throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN);
  
      return {
        ...card,
        password: this.cryptr.decrypt(card.password),
        cvc: this.cryptr.decrypt(card.cvc),
      };
    }
  
    async remove(id: number, userId: number) {
      const card = await this.cardsRepository.findOneById(id)
      if(!card) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);
      if(card.userId !== userId) throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN);
      
  
      return this.cardsRepository.delete(id)
    }
  }
  
