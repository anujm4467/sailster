import { DOMAIN } from '../auth/constants';
import { IComment } from '../shared/comment/comment.interface';
import {
  IBoatMaintenance,
  IBoatMaintenanceResolveProfiles,
} from '../shared/maintenance/maintenance.interface';
import { ISailRequestResolved } from '../shared/sail-request/sail-request.interface';
import { ISailResolved } from '../shared/sail/sail.interface';
import { JwtObject } from '../shared/token/jwt-object.interface';
import { EmailService } from './email.service';

export class EmailUtils {
  private readonly ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  private readonly NOTIFICATIONS_EMAIL = process.env.NOTIFICATIONS_EMAIL;
  private readonly SAIL_COORDINATOR_EMAIL = process.env.SAIL_COORDINATOR_EMAIL || this.ADMIN_EMAIL;
  private readonly DOMAIN = process.env.DOMAIN;

  constructor(private emailService: EmailService) { }

  public sendUpdateSailRequest(request: ISailRequestResolved, modifiedBy: JwtObject): void {
    const requester = request.by.email;

    const sendTo: Set<string> = new Set<string>();
    sendTo.add(requester);
    sendTo.add(modifiedBy.email);
    sendTo.add(this.ADMIN_EMAIL);

    this.emailService
      .sendEmail(
        Array.from(sendTo),
        this.NOTIFICATIONS_EMAIL,
        `A change was made to sail request`,
        `

        Change made by ${modifiedBy.username}.

        Sail Request Details:

        Request status ${request.status}

        Requested by: ${request.by.name}
        Requested on: ${new Date()}

        Sail start: ${request.start}
        Sail end: ${request.end}

        Request Description: ${request.description}
        `,
      );
  }

  public sendNewSailRequest(request: ISailRequestResolved): void {
    const requester = request.by.email;

    const sendTo: Set<string> = new Set<string>();
    sendTo.add(requester);
    sendTo.add(this.ADMIN_EMAIL);

    this.emailService
      .sendEmail(
        Array.from(sendTo),
        this.NOTIFICATIONS_EMAIL,
        `A new sail request was submitted`,
        `Sail Request Details:
        Requested by: ${request.by.name}
        Requested on: ${new Date()}

        Sail start: ${request.start}
        Sail end: ${request.end}

        Request Description: ${request.description}
        `,
      );
  }

  /** report should have all profiles and boat resolved in order for email addresses to be accessible */
  public sendNewMaintenanceRequest(report: IBoatMaintenanceResolveProfiles): void {
    const requester = report.requestedBy.email;

    const sendTo: Set<string> = new Set<string>();
    sendTo.add(requester);
    sendTo.add(this.ADMIN_EMAIL);

    this.emailService
      .sendEmail(
        Array.from(sendTo),
        this.NOTIFICATIONS_EMAIL,
        `A new maintenace request was submitted`,
        `Maintenance Request Details:
        Requested by: ${report.requestedBy.name}
        Requested on: ${report.requestDate}
        Boat: ${report.boat.name}
        Request details: ${report.request}
        `,
      );
  }

  /** report should have all profiles and boat resolved in order for email addresses to be accessible */
  public sendUpdatedMaintenanceRequest(
    profileName: string,
    changes: IBoatMaintenance,
    report: IBoatMaintenanceResolveProfiles,
  ): void {
    const requester = report.requestedBy.email;

    const sendTo: Set<string> = new Set<string>();
    sendTo.add(requester);
    sendTo.add(this.ADMIN_EMAIL);

    const changeSummary: string[] = [];

    if (changes.requestedBy) {
      changeSummary.push(`Requested by: ${report.requestedBy.name}`);
    }

    if (changes.request) {
      changeSummary.push(`Request: ${report.request}`);
    }

    if (changes.boat) {
      changeSummary.push(`Boat: ${report.boat.name}`);
    }

    if (changes.servicedBy) {
      changeSummary.push(`Serviced by: ${report.servicedBy.name}`);
    }

    if (changes.serviceDetails) {
      changeSummary.push(`Service details: ${report.serviceDetails}`);
    }

    if (changes.servicedOn) {
      changeSummary.push(`Serviced on: ${report.servicedOn}`);
    }

    if (changes.pictures) {
      changeSummary.push(`Pictures: \n\r ${changes.pictures.map(pic => `comment: ${pic.comment}\n\rurl:${DOMAIN}/${pic.url}`).join('\n')}`);
    }

    this.emailService
      .sendEmail(
        Array.from(sendTo),
        this.NOTIFICATIONS_EMAIL,
        `Change made to a maintenace request`,
        `${profileName} updated information:\n\r${changeSummary.join('\n\r')}`,
      );
  }

  /** report should have all profiles resolved in order for email addresses to be accessible */
  public sendMaintenanceNewComment(report: IBoatMaintenanceResolveProfiles, comment: IComment, user: JwtObject): void {
    const requester = report.requestedBy.email;
    const resolver = report.servicedBy ? report.servicedBy.email : null;
    const commenters = report.comments.map(cmmt => cmmt.author.email);

    const sendTo: Set<string> = new Set<string>();
    sendTo.add(requester);
    commenters.forEach(commenter => sendTo.add(commenter));
    sendTo.add(this.ADMIN_EMAIL);

    if (resolver) {
      sendTo.add(resolver);
    }

    this.emailService
      .sendEmail(
        Array.from(sendTo),
        this.NOTIFICATIONS_EMAIL,
        `A new comment was posted on Boat Maintenance Request`,
        `New Comment: ${comment.comment};
        Author: ${user.username}
        Posted On: ${comment.date}.
        `,
      );
  }

  /** sail should have all profiles resolved in order for email addresses to be accessible */
  public sendSailNewComment(sail: ISailResolved, comment: IComment, user: JwtObject): void {

    const sendTo: string[] = this.populateSailEmails(sail, true);

    this.emailService
      .sendEmail(
        Array.from(sendTo),
        this.NOTIFICATIONS_EMAIL,
        `A new comment was posted on sail (${sail.name})`,
        `New Comment: ${comment.comment};
        Author: ${user.username}
        Posted On: ${comment.date}.
        `,
      );
  }

  private populateSailEmails(sail: ISailResolved, includeComment?: boolean): string[] {
    const sendTo: Set<string> = new Set<string>();

    sendTo.add(this.ADMIN_EMAIL);

    if (sail.skipper) {
      sendTo.add(sail.skipper.email);
    }

    if (sail.crew) {
      sendTo.add(sail.crew.email);
    }

    if (sail.passengers) {
      sail.passengers.map(passenger => sendTo.add(passenger.email));
    }

    if (sail.cancelledBy) {
      sendTo.add(sail.cancelledBy.email);
    }

    if (includeComment && sail.comments && sail.comments.length) {
      sail.comments.forEach(comment => sendTo.add(comment.author.email));
    }

    return Array.from(sendTo);
  }

  private populateToEmails(sail: ISailResolved): string[] {
    const sendTo: Set<string> = new Set<string>();

    sendTo.add(this.ADMIN_EMAIL);
    sendTo.add(this.SAIL_COORDINATOR_EMAIL);
    sendTo.add(this.NOTIFICATIONS_EMAIL);

    if (sail.skipper) {
      sendTo.add(sail.skipper.email);
    }

    if (sail.crew) {
      sendTo.add(sail.crew.email);
    }

    if (sail.passengers) {
      sail.passengers.map(passenger => sendTo.add(passenger.email));
    }

    if (sail.cancelledBy) {
      sendTo.add(sail.cancelledBy.email);
    }

    return Array.from(sendTo);
  }

  public sendNewSailEmail(sail: ISailResolved, profileName: string): void {
    const boat = sail.boat ? sail.boat.name : 'n/a';
    const skipper = sail.skipper ? sail.skipper.name : 'n/a';
    const crew = sail.crew ? sail.crew.name : 'n/a';
    const passengers = sail.passengers ? sail.passengers.map(passenger => passenger.name).join(', ') : 'n/a';

    const toEmails = this.populateToEmails(sail);

    this.emailService
      .sendEmail(
        toEmails,
        this.NOTIFICATIONS_EMAIL,
        `A new sail was created`,
        `A new sail was created by (${profileName}).
        Sail details:
        Name: ${sail.name || 'n/a'}
        Description: ${sail.description || 'n/a'}
        Start: ${sail.start}
        End: ${sail.end}
        Boat: ${boat}
        Skipper: ${skipper}
        Crew: ${crew}
        Passengers: ${passengers}
        `,
      );
  }

  public sendSailUpdateEmail(sail: ISailResolved, profileName: string): void {
    const boat = sail.boat ? sail.boat.name : 'n/a';
    const skipper = sail.skipper ? sail.skipper.name : 'n/a';
    const crew = sail.crew ? sail.crew.name : 'n/a';
    const passengers = sail.passengers ? sail.passengers.map(passenger => passenger.name).join(', ') : 'n/a';

    const toEmails = this.populateToEmails(sail);

    this.emailService
      .sendEmail(
        toEmails,
        this.NOTIFICATIONS_EMAIL,
        `Your sail was updated`,
        `Your sail (${sail.name}) was updated by (${profileName}).
        Latest sail details:
        Name: ${sail.name || 'n/a'}
        Description: ${sail.description || 'n/a'}
        Start: ${sail.start}
        End: ${sail.end}
        Boat: ${boat}
        Skipper: ${skipper}
        Crew: ${crew}
        Passengers: ${passengers}
        `,
      );
  }

  public sendLeaveSailEmail(sail: ISailResolved, profileName: string, userRole: string): void {
    const sendTo: string[] = this.populateToEmails(sail);

    this.emailService
      .sendEmail(
        sendTo,
        this.ADMIN_EMAIL,
        `A ${userRole} has left your sail`,
        `A ${userRole} (${profileName}) has left your sail (${sail.name}) scheduled for ${sail.start}.`,
      );
  }

  public sendJoinedSailEmail(sail: ISailResolved, profileName: string, userRole: string): void {
    const sendTo: string[] = this.populateToEmails(sail);

    this.emailService
      .sendEmail(
        sendTo,
        this.NOTIFICATIONS_EMAIL,
        `New ${userRole} on your sail`,
        `A new ${userRole} (${profileName}) has joined your sail (${sail.name}) scheduled for ${sail.start}.`,
      );
  }

  public sendSailCancellationEmail(sail: ISailResolved): void {
    const sendTo: string[] = this.populateToEmails(sail);

    this.emailService
      .sendEmail(
        sendTo,
        this.NOTIFICATIONS_EMAIL,
        'Your sail was cancelled',
        `Your sail (${sail.name}) which was scheduled for ${sail.start} was cancelled.
         Canceled by ${sail.cancelledBy.name}.
         Cancellation reason: ${sail.cancelReason}.
         Cancellation date: ${sail.cancelledOn}.
        `,
      );
  }

  public sendNewProfileEmail(profileName: string): void {
    this.emailService
      .sendEmail(
        this.ADMIN_EMAIL,
        this.NOTIFICATIONS_EMAIL,
        'New account awaiting approval',
        `${profileName} is awating for profile review.
       Go to ${this.DOMAIN}/admin to review their profile.`,
      );
  }

  public sendProfileApprovedEmail(profileEmail: string): void {
    this.emailService
      .sendEmail(
        profileEmail,
        this.NOTIFICATIONS_EMAIL,
        'Your profile was approved',
        `Your profile was approved.
       You now have access to ${this.DOMAIN}.
       Go to ${this.DOMAIN}/login to log in.`,
      );
  }
}
