import * as mailgun from 'mailgun-js';
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { EmailUtils } from './email.utils';

@Injectable()
export class EmailService {
  private readonly logger: Logger;
  protected readonly logError = error => this.logger.error(error.message, error.stack);
  protected readonly logInfo = message => this.logger.log(message);
  private readonly _emailUtils: EmailUtils;
  private readonly _mg;

  constructor() {
    this.logger = new Logger(this.constructor.name);
    this._emailUtils = new EmailUtils(this);
    this._mg = mailgun({
      apiKey: process.env.MAIL_GUN_API_KEY,
      domain: process.env.MAIL_GUN_DOMAIN,
    });
  }

  public get emailUtils(): EmailUtils {
    return this._emailUtils;
  }

  public sendEmail(to: string | string[], from: string, subject: string, text: string): void {

    const data = {
      from,
      to,
      subject,
      text,
    };
    this._mg
      .messages()
      .send(data, (error, body) => {
        if (error) {
          this.logError(error);
        }
        this.logInfo(body);
      });
  }
}
