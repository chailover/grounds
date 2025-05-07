import request from 'supertest';
import { google } from 'googleapis';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';

// Mock the googleapis
jest.mock('googleapis', () => ({
  google: {
    gmail: jest.fn(() => ({
      users: {
        messages: {
          send: jest.fn().mockResolvedValue({ data: { id: 'mock-message-id' } })
        }
      }
    }))
  }
}));

describe('Email API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // TODO: Add email route handler here
    app.post('/api/send-email', async (req, res) => {
      const { toEmail, subject, body } = req.body;
      
      try {
        // Mock OAuth2 client
        const oauth2Client = new OAuth2Client();
        
        // Create Gmail API client
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        
        // Create email message
        const message = [
          'Content-Type: text/plain; charset="UTF-8"\n',
          'MIME-Version: 1.0\n',
          `To: ${toEmail}\n`,
          `Subject: ${subject}\n\n`,
          body
        ].join('');

        const encodedMessage = Buffer.from(message)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        // Send email
        const response = await gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: encodedMessage
          }
        });

        res.json({ success: true, messageId: response.data.id });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to send email' });
      }
    });
  });

  it('should send an email successfully', async () => {
    const emailData = {
      toEmail: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body'
    };

    const response = await request(app)
      .post('/api/send-email')
      .send(emailData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.messageId).toBe('mock-message-id');
  });

  it('should handle missing required fields', async () => {
    const response = await request(app)
      .post('/api/send-email')
      .send({});

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });
}); 