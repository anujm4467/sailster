import * as chalk from 'chalk';
import {
  Request,
  Response,
} from 'express';
import { LOG_TYPE } from '../shared/log/log.interface';

const RED = chalk.red;
const GREEN = chalk.green;
const YELLOW = chalk.yellow;

export const morgan = (tokens, req: Request, res: Response) => {
  const status = res.statusCode;
  let color;

  switch (true) {
    case (status < 300):
      color = GREEN;
      break;
    case (status < 400):
      color = YELLOW;
      break;
    default:
      color = RED;
  }

  const userId = req.user ? req.user.userId : '-';

  const format: string = tokens.combined;
  const formatTokens = format.split(' ');

  if (req.logService && !req.url.startsWith('/logs')) {

    const jsonObject: any = formatTokens
      .reduce(
        (red, token) => {
          red[token] = '-';
          return red;
        },
        {},
      );

    Object
      .keys(jsonObject)
      .forEach((key) => {
        jsonObject[key] = tokens.compile(key)(tokens, req, res);
      });

    jsonObject.user = userId;

    req
      .logService
      .create({ type: LOG_TYPE.HTTP_REQUEST, data: jsonObject, user: (userId === '-' ? null : userId) })
      // tslint:disable-next-line: no-console
      .catch(error => console.error(error));
  }

  formatTokens[1] = userId;

  const formatWithUserId = formatTokens.join(' ');

  const statusString = tokens.compile(formatWithUserId)(tokens, req, res);
  const withColor = color(statusString);

  return withColor;
};
