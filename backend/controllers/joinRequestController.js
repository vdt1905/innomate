
import { User } from '../models/user.model.js';
import { Idea } from '../models/Idea.js';
import { JoinRequest } from '../models/JoinRequest.js';

export const sendJoinRequest = async (req, res) => {
  try {
    const ideaId = req.params.id;
    const requesterId = req.user._id;

    const idea = await Idea.findById(ideaId).populate('createdBy');
    if (!idea) return res.status(404).json({ message: 'Project not found' });

    const existing = await JoinRequest.findOne({ ideaId, requester: requesterId });
    if (existing) return res.status(400).json({ message: 'Request already sent' });

    const requester = await User.findById(requesterId);

    const request = await JoinRequest.create({
      ideaId,
      projectTitle: idea.title,
      leaderId: idea.createdBy._id,
      leaderName: idea.createdBy.name,
      requester: requesterId,
      requesterName: requester.name,
    });

    res.status(201).json({ message: 'Join request sent', request });
  } catch (err) {
    console.error('Join request error:', err);
    res.status(500).json({ message: 'Failed to send join request' });
  }
};

export const getJoinRequests = async (req, res) => {
  const { id } = req.params;
  const idea = await Idea.findById(id);

  if (!idea) return res.status(404).json({ message: 'Idea not found' });
  if (idea.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Only team leader can view requests' });

  const requests = await JoinRequest.find({ ideaId: id, status: 'pending' }).populate('requester', 'name skills bio');
  res.status(200).json(requests);
};


export const acceptJoinRequest = async (req, res) => {
  const { id, requestId } = req.params;
  const idea = await Idea.findById(id);

  if (!idea) return res.status(404).json({ message: 'Idea not found' });
  if (idea.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Only team leader can accept requests' });

  const request = await JoinRequest.findById(requestId);
  if (!request || request.status !== 'pending')
    return res.status(400).json({ message: 'Invalid request' });

  if (idea.hackathon?.isHackathon && idea.teamMembers.length >= idea.hackathon.maxTeamSize) {
    return res.status(400).json({ message: 'Team is full' });
  }

  idea.teamMembers.push(request.requester);
  request.status = 'accepted';
  await request.save();
  await idea.save();

  res.status(200).json({ message: 'Request accepted and user added to team' });
};


export const rejectJoinRequest = async (req, res) => {
  const { id, requestId } = req.params;
  const idea = await Idea.findById(id);

  if (!idea) return res.status(404).json({ message: 'Idea not found' });
  if (idea.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Only team leader can reject requests' });

  const request = await JoinRequest.findById(requestId);
  if (!request || request.status !== 'pending')
    return res.status(400).json({ message: 'Invalid request' });

  request.status = 'rejected';
  await request.save();

  res.status(200).json({ message: 'Request rejected' });
};


export const getJoinRequestStatus = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const requesterId = req.user._id;

    const request = await JoinRequest.findOne({ ideaId, requester: requesterId });

    if (!request) {
      return res.status(404).json({ message: 'No join request found' });
    }

    res.status(200).json({ status: request.status, request });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ message: 'Error checking join request status' });
  }
};
