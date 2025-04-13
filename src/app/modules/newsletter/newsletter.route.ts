import express from 'express';
import { newsletterController } from './newsletter.controller';
const router = express.Router();

router.post('/subscribe', newsletterController.subscribeNewsletter);

export const newsletterRoutes = router;
