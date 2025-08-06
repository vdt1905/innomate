import express from 'express';
import {
  createIdea,
  toggleLikeIdea,
  addComment,
  deleteComment,
  joinTeam,getPersonalizedFeed,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  searchIdeas,
  recommendTeammates,
  getIdeasByUser
} from '../controllers/ideaController.js';

import {
  sendJoinRequest,
  getJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  getJoinRequestStatus,
  
} from '../controllers/joinRequestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/createIdea', protect, createIdea);
router.put('/:id/like', protect, toggleLikeIdea);
router.post('/:id/comments', protect, addComment);
router.delete('/:ideaId/comments/:commentId', protect, deleteComment);
router.put('/:id/join', protect, joinTeam);
router.get('/feed', protect, getPersonalizedFeed);
router.get('/all', getAllIdeas); // no auth needed
router.get('/search', searchIdeas); // no auth needed
router.get('/:id', protect, getIdeaById);
router.put('/:id', protect, updateIdea);      // Update idea
router.delete('/:id', protect, deleteIdea);   // Delete idea
router.get('/:id/recommend', protect, recommendTeammates);
router.get('/user/:userId', protect, getIdeasByUser); // ✅ New route


router.post('/:id/join-request', protect, sendJoinRequest);
router.get('/:id/requests', protect, getJoinRequests);
router.put('/:id/requests/:requestId/accept', protect, acceptJoinRequest);
router.put('/:id/requests/:requestId/reject', protect, rejectJoinRequest);
router.get('/:ideaId/join-request/status', protect, getJoinRequestStatus);








export default router;
