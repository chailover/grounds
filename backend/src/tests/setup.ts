import { google } from 'googleapis';

// Mock environment variables
process.env.GOOGLE_CLIENT_ID = 'mock-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'mock-client-secret';
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/auth/google/callback';

// Mock googleapis
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