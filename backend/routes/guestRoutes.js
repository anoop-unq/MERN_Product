import express from 'express';
import {
  createGuestAccount,
  getGuestDetails,
  logoutGuest,
  checkUsername,
  findGuestByUsername,
} from '../controllers/guestController.js';
import { guestAuthMiddleware } from '../middileware/guestAuth.js';

const router = express.Router();

// Create or access guest account
router.post('/create', createGuestAccount);

// Find account by username
router.post('/find-by-username', findGuestByUsername);

// Check username availability
router.get('/check-username', checkUsername);

// Get guest details (requires authentication)
router.get('/details', guestAuthMiddleware, getGuestDetails);



// Logout guest
router.post('/logout', guestAuthMiddleware, logoutGuest);

export default router;