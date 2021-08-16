import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService
      .signup(email, password)
      .then((response) => {
        return { message: response };
      })
      .catch((e) => {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  @Post('sessionlogin')
  sessionLogin(
    @Res({ passthrough: true }) res: Response,
    @Body('idToken') idToken: string,
  ) {
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    console.log('ID TOKEN FROM LOGIN: ', idToken);
    return this.authService
      .sessionLogin(idToken)
      .then((data) => {
        // Note httpOnly cookie will not be accessible from javascript.
        // secure flag should be set to true in production.
        const options = {
          maxAge: expiresIn,
          httpOnly: true,
          secure: false /** to test in localhost */,
        };
        res.cookie('session', data.cookie, options);
        return { user: data.user };
      })
      .catch(function () {
        throw new HttpException(
          'UNAUTHORIZED REQUEST!',
          HttpStatus.UNAUTHORIZED,
        );
      });
  }

  @Post('verify')
  verify(@Body('csrfToken') csrfToken: string, @Req() req: Request) {
    const sessionCookie = req.cookies.session || '';

    if (!req.cookies || csrfToken !== req.cookies.csrfToken) {
      throw new HttpException('UNAUTHORIZED REQUEST', HttpStatus.UNAUTHORIZED);
    }

    return this.authService
      .verify(sessionCookie)
      .then((decodedClaims) => {
        // Serve content for signed in user.
        return { user: decodedClaims };
      })
      .catch((e) => {
        // Force user to login.
        throw new HttpException(e, HttpStatus.UNAUTHORIZED);
      });
  }

  @Get('sessionlogout')
  sessionLogout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    // Clear cookie.
    const sessionCookie = req.cookies.session || '';

    res.clearCookie('session');

    if (sessionCookie) {
      return this.authService
        .sessionLogout(sessionCookie)
        .then(() => {
          return { message: 'Session cleared' };
        })
        .catch(() => {
          return { message: 'Error? but session cleared' };
        });
    } else {
      return { message: 'No cookie but redirecting' };
    }
  }

  @Post('edit-profile')
  async editProfile(
    @Body('uid') uid: string,
    @Body('password') password: string,
  ) {
    return this.authService
      .editProfile(uid, password)
      .then((userRecord) => {
        return { user: userRecord };
      })
      .catch((e) => {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
}
