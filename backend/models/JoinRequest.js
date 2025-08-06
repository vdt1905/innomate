import mongoose from 'mongoose';

const joinRequestSchema = new mongoose.Schema({
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  leaderName: {
    type: String,
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requesterName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

export const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema);
