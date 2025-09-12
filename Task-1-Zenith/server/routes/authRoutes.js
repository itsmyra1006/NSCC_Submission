import express from 'express';
import { 
    googleAuth, 
    googleAuthCallback, 
    getCurrentUser, 
    logoutUser 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Initiate Google OAuth flow
// @route   GET /api/auth/google
router.get('/google', googleAuth); // <-- ADD THIS NEW ROUTE

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
router.get('/google/callback', googleAuthCallback);

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', protect, getCurrentUser);

// @desc    Logout user
// @route   POST /api/auth/logout
router.post('/logout', logoutUser);

export default router;

