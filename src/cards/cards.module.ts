import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { UsersModule } from '../users/users.module';
import { CardsRepository } from './cards.repository';

@Module({
  imports: [UsersModule],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
})
export class CardsModule {}
