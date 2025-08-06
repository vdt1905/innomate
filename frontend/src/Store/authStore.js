import { create } from 'zustand';
import axios from '../api/axiosInstance';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  allIdeas: [],
  detailedUser: null,
  userIdeas: [],
  loadingIdeas: false,
  personalizedFeed: [],
loadingFeed: false,


  get isAuthenticated() {
    return !!get().user;
  },

  fetchUser: async () => {
    try {
      const res = await axios.get('/users/me');
      set({ user: res.data });
    } catch (err) {
      set({ user: null });
      console.log('Not logged in or token expired.');
    }
  },

  
  register: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/auth/register', formData); // Make sure your backend route is /auth/register
      set({ user: res.data.user, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Registration failed',
        loading: false,
      });
      return false;
    }
  },

  login: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/auth/login', formData);
      set({ user: res.data.user, loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        loading: false,
      });
      return null;
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.warn('Logout failed on server.');
    }
    set({ user: null });
  },
  // src/Store/authStore.js
getAllIdeas: async () => {
  try {
    const res = await axios.get('/ideas/all');
    set({ allIdeas: res.data });
  } catch (err) {
    console.error('Failed to fetch all ideas', err);
  }
},
getDetailedUser: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/users/me');  // Assumes your backend supports /users/me for logged-in user
      set({ detailedUser: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch user', loading: false });
    }
  },
getUserIdeas: async (userId) => {
  try {
    set({ loadingIdeas: true, errorIdeas: null });
    const res = await axios.get(`/ideas/user/${userId}`);
    set({ userIdeas: res.data, loadingIdeas: false });
  } catch (error) {
    console.error('Error fetching user ideas:', error);
    set({
      errorIdeas: error.response?.data?.message || 'Failed to fetch ideas',
      loadingIdeas: false
    });
  }
},


getPersonalizedFeed: async () => {
  set({ loadingFeed: true });
  try {
    const res = await axios.get('/ideas/feed'); // This hits your backend route
    set({ personalizedFeed: res.data, loadingFeed: false });
  } catch (error) {
    console.error('Failed to fetch personalized feed:', error);
    set({ loadingFeed: false });
  }
},
toggleLikeIdea: async (ideaId) => {
  const { user, personalizedFeed } = get();

  if (!user?._id) {
    console.warn('User not authenticated');
    return;
  }

  try {
    const res = await axios.put(`/ideas/${ideaId}/like`);
    const { liked } = res.data;

    const updatedFeed = personalizedFeed.map((idea) => {
      if (idea._id === ideaId) {
        const currentLikes = idea.likes || [];
        const updatedLikes = liked
          ? [...currentLikes, user._id]            // add user id
          : currentLikes.filter(id => id !== user._id); // remove user id

        return {
          ...idea,
          likes: updatedLikes,
        };
      }
      return idea;
    });

    set({ personalizedFeed: updatedFeed });

    return { liked };
  } catch (error) {
    console.error('Error in toggleLikeIdea:', error);
    throw new Error(error.response?.data?.message || 'Failed to toggle like');
  }
},

addCommentToIdea: async (ideaId, commentText) => {
  try {
    const res = await axios.post(`/ideas/${ideaId}/comments`, {
      text: commentText,
    });

    const { personalizedFeed } = get();

    // Replace updated comments in the idea
    const updatedFeed = personalizedFeed.map(idea => {
      if (idea._id === ideaId) {
        return {
          ...idea,
          comments: res.data, // updated populated comments
        };
      }
      return idea;
    });

    set({ personalizedFeed: updatedFeed });
    return true;
  } catch (err) {
    console.error('Failed to add comment:', err);
    return false;
  }
},
createIdea: async (ideaData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/ideas/createIdea', ideaData);
      set({ loading: false });
      return { success: true, idea: res.data };
    } catch (err) {
      console.error('Create Idea Error:', err);
      set({
        error: err.response?.data?.message || 'Failed to create project',
        loading: false,
      });
      return { success: false };
    }
  },





}));

export default useAuthStore;
