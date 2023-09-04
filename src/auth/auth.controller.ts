import { Controller, Post, Body, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('users/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  @ApiOperation({summary: "Register a user"})
  @ApiBody({type: SignInDto})
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post("sign-in")
  @ApiOperation({summary: "Authenticate a user"})
  @ApiBody({type: SignInDto})
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
