import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { UserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // LOGIN
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @ApiResponse({ status: 200, description: 'Login success' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // REGISTER
  @Post('register')
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 200, description: 'OK' })
  async register(@Body() userDto: UserDto) {
    return await this.authService.register(userDto);
  }

  // LOGOUT
  @Post('logout')
  @ApiResponse({ status: 200, description: 'OK' })
  async logout(@Response() res) {
    return await this.authService.logout(res);
  }
}
