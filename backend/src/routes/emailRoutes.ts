import { Router } from 'express';
import { EmailController } from '../controllers/emailController';

export function createEmailRoutes(emailController: EmailController): Router {
  const router = Router();

  router.post('/send-email', (req, res) => emailController.sendEmail(req, res));

  return router;
} 