import { User } from '../models/user.model.js';
import { Idea } from '../models/Idea.js';

// @desc    Get current user profile
// controllers/userController.js
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      skills: user.skills,
      socialLinks: user.socialLinks || {}, // 👈 add this line
    });
  } catch (err) {
    console.error('Failed to fetch user profile', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user info (excluding password)
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch user's ideas
    const ideas = await Idea.find({ createdBy: userId })
      .populate('teamMembers', 'name username')
      .populate('comments.user', 'username');

    res.status(200).json({
      ...user._doc,
      ideas,
    });
  } catch (err) {
    console.error('Failed to fetch user details', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Update current user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, socialLinks } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio) user.bio = bio;
    

    if (skills) {
      user.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim());
    }

    if (socialLinks && typeof socialLinks === 'object') {
      user.socialLinks = {
        ...user.socialLinks,
        ...socialLinks, // only overwrite provided fields
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      socialLinks: updatedUser.socialLinks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};
