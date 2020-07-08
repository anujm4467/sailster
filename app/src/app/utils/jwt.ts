import { JwtObject } from '../../../../api/src/shared/token/jwt-object.interface';

export const decodeJwt = (token: string): JwtObject => JSON.parse(atob(token.split('.')[1]));
