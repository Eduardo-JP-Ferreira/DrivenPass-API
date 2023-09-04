import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({summary: "Create a new Card"})
  @ApiBody({type: CreateCardDto})
  async createTweet(@Body() createCardDto: CreateCardDto, @User() user: UserPrisma) {
    try {
      return await this.cardsService.create(createCardDto, user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }
  
  @Get()
  @ApiOperation({summary: "Find a Card"})
  async findAll(@User() user: UserPrisma) {
    try {
      return await this.cardsService.findAllByUserId(user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  @Get(':id')
  @ApiOperation({summary: "Find a Card by Id"})
  async findOne(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return await this.cardsService.findOneById(+id, user.id);
    } catch (error) {
      if(error.response === 'FORBIDDEN') throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN)
      throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':id')
  @ApiOperation({summary: "Delete a Card"})
  async remove(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return this.cardsService.remove(+id, user.id);
    } catch (error) {
      if(error.response === 'FORBIDDEN') throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN)
      throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND)
    }
  }

}
