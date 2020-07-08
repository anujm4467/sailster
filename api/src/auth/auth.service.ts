import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from '../profile-service/profile.service';
import { PROFILE_STATUS } from '../shared/profile/profile-status.enum';
import { IProfile } from '../shared/profile/profile.interface';
import { JwtObject } from '../shared/token/jwt-object.interface';
import { ITokenModel } from '../shared/token/token-model.interface';
import { IUserAccess } from '../shared/user-access/user-access.interface';
import { IUser } from '../shared/user/user.interface';
import { TokensService } from '../tokens/tokens.service';
import { UserAccessService } from '../user-access-service/user-access.service';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

export interface CachedToken {
  token: string;
  expireAt: Date;
}

export interface TokenCache {
  [propName: string]: CachedToken;
}
@Injectable()
export class AuthService {

  private readonly logger: Logger;
  private readonly tokens: TokenCache = {};

  constructor(
    private readonly jwtService: JwtService,
    private readonly profileService: ProfileService,
    private readonly tokenService: TokensService,
    private readonly userService: UsersService,
    private readonly userAccessService: UserAccessService,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  public getCachedToken(profileId: string): CachedToken {
    return this.tokens[profileId];
  }

  public getStoredToken(profileId: string): Promise<ITokenModel> {
    return this.tokenService
      .find<ITokenModel>({ profileId, limit: 1 })
      .then(tokens => tokens[0])
      .catch<ITokenModel>((error) => {
        this.logger.error(error);
        return null;
      });
  }

  /**
   * user comes from one of the authentication providers (ex: google)
   *
   */
  async validateUser(user: any): Promise<IUser> {
    const existingUser = await this.userService
      .findOne<IUser>({ uid: user.id, populate: ['resolvedProfile'], limit: 1 });

    if (existingUser) {
      return existingUser;
    }

    let newUser;

    switch (user.provider) {
      case 'google':
        newUser = await this.createNewGoogleUser(user);
        break;
    }

    return newUser;
  }

  logout(profileId: string): Promise<void> {
    delete this.tokens[profileId];
    return this.tokenService
      .removeAll({ profileId })
      .catch(error => this.logger.error(error));
  }

  private cacheToken(profileId: string, token: string, expireAt: Date): void {
    this.tokens[profileId] = {
      expireAt,
      token,
    };
  }

  async login(user: any, provider: string): Promise<string> {

    const cachedToken = this.tokens[user.profileId];

    if (cachedToken && cachedToken.expireAt.getTime() > Date.now()) {
      return Promise.resolve(cachedToken.token);
    }

    if (!cachedToken) {
      // this is skipped if cached token is expired
      // try db stored token
      const dbToken = await this.tokenService
        .find<ITokenModel>({ profileId: user.profileId, limit: 1 })
        .then(tokens => tokens[0])
        .catch<ITokenModel>((error) => {
          this.logger.error(error);
          return null;
        });

      if (dbToken && dbToken.expireAt.getTime() > Date.now()) {
        this.cacheToken(user.profileId, dbToken.token, dbToken.expireAt);

        return Promise.resolve(dbToken.token);
      }
    }

    // at this point we didn't find an existing valid token
    // so we create a new one

    const profile: IProfile = user.resolvedProfile;
    const expireAtDate = new Date();
    const access = await this.userAccessService.findById<IUserAccess>(user.profileId);

    expireAtDate.setTime(expireAtDate.getTime() + (jwtConstants.expiresIn * 1000));

    const payload: JwtObject = {
      provider,
      access,
      email: profile.email,
      expireAt: expireAtDate.getTime(),
      profileId: profile.id,
      roles: profile.roles,
      status: profile.status,
      sub: profile.id,
      username: profile.name,
    };

    const token = this.jwtService.sign(payload);

    return this.tokenService
      .create({
        token,
        provider,
        profileId: profile.id,
        expireAt: expireAtDate,
      })
      .then(() => {
        this.cacheToken(profile.id, token, expireAtDate);
        return token;
      })
      .catch<string>((error) => {
        this.logger.error(error);
        return null;
      });
  }

  private async createNewGoogleUser(user: any) {
    const newProfile = await this.profileService
      .create({
        email: user.emails[0].value,
        name: user.displayName,
        picture: user.photos[0].value,
        roles: [],
        status: PROFILE_STATUS.REGISTRATION,
      });
    const newUser = await this.userService
      .create({
        profileId: newProfile.id,
        provider: user.provider,
        uid: user.id || user.userId || user.client_id,
      });

    await this.userAccessService.create({ _id: newProfile.id });

    newUser.resolvedProfile = newProfile;

    return newUser;
  }

}
