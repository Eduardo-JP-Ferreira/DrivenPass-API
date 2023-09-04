import { Module } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseController } from './erase.controller';
import { UsersModule } from '../users/users.module';
import { EraseRepository } from './erase.repository';

@Module({
  imports: [UsersModule],
  controllers: [EraseController],
  providers: [EraseService, EraseRepository],
})
export class EraseModule {}
