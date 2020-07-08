import * as express from 'express';
import {
  Controller,
  Delete,
  Get,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { LoginGuard } from '../guards/login.guard';
import { ProfileService } from '../profile-service/profile.service';
import { IProfile } from '../shared/profile/profile.interface';
import { JwtObject } from '../shared/token/jwt-object.interface';
import { AuthService } from './auth.service';
import { DOMAIN } from './constants';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Response() res: express.Response) {
    const user = req.user;
    const token = await this.authService.login(user, 'google');

    if (user) {
      res.redirect(302, `${DOMAIN}/login/${token}`);
    }
  }

  @Delete('logout')
  logout(@Req() req) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return 'piss off mate! first warning.';
    }

    const token = authorization.split(' ', 2)[1];
    let user: JwtObject;

    try {
      user = this.jwtService.verify(token, { ignoreExpiration: true });
    } catch (tokenError) {
      // tslint:disable-next-line: no-console
      console.error(tokenError);
      return 'piss off mate! second warning.';
    }

    if (!user) {
      return 'piss off mate! third warning.';
    }

    const profileId = user.profileId;

    this.authService.logout(profileId);
    req.logout();
    req.user = { userId: profileId };
  }

  @Get('login')
  @UseGuards(AuthGuard('jwt'), LoginGuard)
  login(@Req() req): Promise<IProfile> {
    const user: JwtObject = req.user;
    const profileId = user.profileId;

    return this.profileService.findById(profileId);
  }
}
