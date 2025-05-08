import request from 'supertest';
import { Express } from 'express';
import { google } from 'googleapis';
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
  let app: Express;
  let mockOAuth2Client: OAuth2Client;

  beforeAll(() => {
    // TODO: Initialize Express app and OAuth2 client
    // This will be implemented when we create the actual endpoint
  });

  describe('POST /api/send-email', () => {
    const testEmail = {
      toEmail: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body'
    };

    it('should send email successfully', async () => {
      const response = await request(app)
        .post('/api/send-email')
        .send(testEmail)
        .expect(200);

      expect(response.body).toHaveProperty('messageId');
      expect(response.body.messageId).toBe('mock-message-id');
    });

    it('should handle invalid email data', async () => {
      const response = await request(app)
        .post('/api/send-email')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle Gmail API errors', async () => {
      // Mock Gmail API error
      (google.gmail().users.messages.send as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const response = await request(app)
        .post('/api/send-email')
        .send(testEmail)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
}); 