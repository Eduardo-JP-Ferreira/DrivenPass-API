import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateEraseDto } from './dto/create-erase.dto';
import * as bcrypt from "bcrypt";
import { UsersService } from '../users/users.service';
import { EraseRepository } from './erase.repository';

@Injectable()
export class EraseService {

  constructor(private readonly userService: UsersService,
    private readonly eraseRepository: EraseRepository) { }

  async remove(createEraseDto: CreateEraseDto ,id: number) {
    const { password } = createEraseDto;
    const user = await this.userService.getById(id);
    if (!user) throw new UnauthorizedException("Email or password not valid.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException("Email or password not valid.");

    return await this.eraseRepository.delete(id)
  }
}
