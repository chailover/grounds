import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface EmailData {
  toEmail: string;
  subject: string;
  body: string;
}

export class EmailService {
  private oauth2Client: OAuth2Client;
  private gmail: any;

  constructor(oauth2Client: OAuth2Client) {
    this.oauth2Client = oauth2Client;
    this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  }

  async sendEmail(emailData: EmailData): Promise<string> {
    const { toEmail, subject, body } = emailData;

    // Create email message
    const message = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      'MIME-Version: 1.0\n',
      `To: ${toEmail}\n`,
      `Subject: ${subject}\n\n`,
      body
    ].join('');

    // Encode message in base64
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      return response.data.id;
    } catch (error: any) {
      throw new Error(`Failed to send email: ${error?.message || 'Unknown error'}`);
    }
  }
} 