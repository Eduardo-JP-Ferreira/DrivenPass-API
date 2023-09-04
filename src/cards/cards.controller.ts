import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async createTweet(@Body() createCardDto: CreateCardDto, @User() user: UserPrisma) {
    try {
      return await this.cardsService.create(createCardDto, user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }
  
  @Get()
  async findAll(@User() user: UserPrisma) {
    try {
      return await this.cardsService.findAllByUserId(user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return await this.cardsService.findOneById(+id, user.id);
    } catch (error) {
      if(error.response === 'FORBIDDEN') throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN)
      throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return this.cardsService.remove(+id, user.id);
    } catch (error) {
      if(error.response === 'FORBIDDEN') throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN)
      throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND)
    }
  }

}
