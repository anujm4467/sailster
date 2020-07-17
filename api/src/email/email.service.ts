import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { sendEmail } from './email';
import { EmailUtils } from './email.utils';

@Injectable()
export class EmailService {
  private readonly logger: Logger;
  protected readonly logError = error => this.logger.error(error.message, error.stack);
  protected readonly logInfo = message => this.logger.log(message);
  private readonly _emailUtils: EmailUtils;

  constructor() {
    this.logger = new Logger(this.constructor.name);
    this._emailUtils = new EmailUtils(this);
  }

  public get emailUtils(): EmailUtils {
    return this._emailUtils;
  }

  public sendEmail(to: string | string[], from: string, subject: string, text: string): void {

    const data = {
      from: process.env.EMAIL_FROM_ACCOUNT,
      to,
      cc: from,
      bcc: process.env.EMAIL_FROM_ACCOUNT,
      subject,
      text,
    };

    sendEmail(data).catch((error) => this.logError(error));
  }
}
