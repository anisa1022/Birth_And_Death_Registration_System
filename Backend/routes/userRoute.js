import express from 'express';
import {
    registerUser,
    authUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
} from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);          
router.post('/login', authUser);                 
router.get('/profile', protect, getUserProfile); 
router.put('/profile', protect, updateUserProfile); 
router.get('/', getAllUsers);

export default router;
