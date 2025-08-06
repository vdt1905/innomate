import express  from 'express';
const router = express.Router();
import { protect } from'../middleware/authMiddleware.js';
import { getProfile, updateProfile,getUserDetails } from '../controllers/userController.js';

router.get('/me', protect, getProfile);

// PUT update profile
router.put('/me', protect, updateProfile);
router.get('/details/:userId', protect,getUserDetails);

export default  router;
