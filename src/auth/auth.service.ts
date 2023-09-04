import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcrypt";
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {

  private EXPIRATION_TIME = "7 days";
  private ISSUER = "DrivenPass";
  private AUDIENCE = "users";

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService) { }

  async signUp(signUpDto: SignUpDto) {
    return await this.userService.create(signUpDto);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException("Email or password not valid.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException("Email or password not valid.");

    return this.createToken(user);
  }

  createToken(user: User) {
    const { id, email } = user;

    const token = this.jwtService.sign({ email }, { 
      expiresIn: this.EXPIRATION_TIME,
      subject: String(id),
      issuer: this.ISSUER,
      audience: this.AUDIENCE
    })

    return { token };
  }

  checkToken(token: string) {
    const data = this.jwtService.verify(token, {
      audience: this.AUDIENCE,
      issuer: this.ISSUER
    });

    return data;
  }
}
