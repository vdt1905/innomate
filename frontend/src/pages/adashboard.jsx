import { useEffect } from 'react';
import useAuthStore from '../Store/authStore';

const Dashboard = () => {
  const { getPersonalizedFeed, personalizedFeed, loadingFeed } = useAuthStore();

  useEffect(() => {
    getPersonalizedFeed();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-white">🎯 Personalized Feed</h2>

      {loadingFeed ? (
        <p className="text-gray-400">Loading personalized projects...</p>
      ) : personalizedFeed.length === 0 ? (
        <p className="text-gray-500 italic">No personalized projects available yet.</p>
      ) : (
        <div className="grid gap-6">
          {personalizedFeed.map((idea) => (
            <div key={idea._id} className="bg-gray-800 rounded-lg shadow-lg p-5 border border-gray-700 hover:border-purple-500 transition">
              <h3 className="text-xl font-semibold text-purple-300 mb-2">{idea.title}</h3>
              <p className="text-gray-300 mb-2">{idea.description}</p>
              <p className="text-sm text-blue-300 mb-1">Match Score: {idea.matchScore}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="text-green-300">Skills: {idea.skillsRequired.join(', ') || 'None'}</span>
                <span className="text-yellow-300">Tags: {idea.tags?.join(', ') || 'None'}</span>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                By: {idea.createdBy?.name || 'Unknown'} (@{idea.createdBy?.username})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
