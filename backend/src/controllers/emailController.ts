import { Request, Response } from 'express';
import { EmailService, EmailData } from '../services/emailService';

export class EmailController {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }

  async sendEmail(req: Request, res: Response): Promise<void> {
    try {
      const emailData: EmailData = req.body;

      // Validate required fields
      if (!emailData.toEmail || !emailData.subject || !emailData.body) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const messageId = await this.emailService.sendEmail(emailData);
      res.json({ messageId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
} 