import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}
  
  @Post()
  @ApiOperation({summary: "Create a new Credential"})
  @ApiBody({type: CreateCredentialDto})
  async createTweet(@Body() createCredentialDto: CreateCredentialDto, @User() user: UserPrisma) {
    try {
      return await this.credentialsService.create(createCredentialDto, user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }
  
  @Get()
  @ApiOperation({summary: "Find a Credential"})
  async findAll(@User() user: UserPrisma) {
    try {
      return await this.credentialsService.findAllByUserId(user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  @Get(':id')
  @ApiOperation({summary: "Find a Credential by Id"})
  async findOne(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return await this.credentialsService.findOneById(+id, user.id);
    } catch (error) {
      if(error.response === 'FORBIDDEN') throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN)
      throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':id')
  @ApiOperation({summary: "Delete a Credential"})
  async remove(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return this.credentialsService.remove(+id, user.id);
    } catch (error) {
      if(error.response === 'FORBIDDEN') throw new HttpException("FORBIDDEN", HttpStatus.FORBIDDEN)
      throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND)
    }
  }
}
