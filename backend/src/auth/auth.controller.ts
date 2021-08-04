import { Controller, Post, Body, Get, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user')
  getUser(@Res() res: Response) {
    const user = this.authService.getUser();
    res.status(HttpStatus.OK).json({ user: user });
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const response = await this.authService.login(email, password);

    if (response === 'yes') {
      res.status(HttpStatus.OK).json({ message: 'Successfully logged in!' });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ message: ' Error loggin in' });
    }
  }

  @Post('signup')
  async signup(
    @Res() res: Response,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const response = await this.authService.signup(email, password);
    if (response === 'yes') {
      res.status(HttpStatus.OK).json({ message: 'Successfuly created!' });
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Something went wrong' });
    }
  }

  @Get('signout')
  async signout(@Res() res: Response) {
    await this.authService.signOut();
    res.status(HttpStatus.OK).json({ message: 'Successfully signedo ut' });
  }

  @Post('reset-password')
  async resetPassword(@Res() res: Response, @Body('email') email: string) {
    await this.authService.resetPassword(email);
    res.status(HttpStatus.OK).json({ message: 'Successfully sent email' });
  }

  @Post('edit-password')
  async editPassword(@Res() res: Response, @Body('password') password: string) {
    await this.authService.editPassword(password);
    res.status(HttpStatus.OK).json({ message: 'Changed password!' });
  }
}
