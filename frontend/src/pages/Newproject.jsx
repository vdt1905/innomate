import React, { useState } from 'react';
import { Plus, Rocket, Users, Hash, Code, FileText, Settings, Sparkles, X, Search } from 'lucide-react';
import useAuthStore from '../Store/authStore';

const Newproject = () => {
  const { createIdea, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    tags: '',
    projectType: 'personal',
    hackathon: {
      maxTeamSize: '',
      description: '',
    },
  });

  // Skills management state (similar to Profile component)
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [skillSearchTerm, setSkillSearchTerm] = useState('');

  // Tags management state
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [tagSearchTerm, setTagSearchTerm] = useState('');

  // Predefined skills list
  const availableSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js',
    'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C++', 'C#', '.NET',
    'PHP', 'Laravel', 'Ruby', 'Ruby on Rails', 'Go', 'Rust', 'Swift', 'Kotlin',
    'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Bootstrap', 'Material-UI',
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Firebase',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
    'Git', 'GitHub', 'GitLab', 'Jira', 'Slack', 'Figma', 'Adobe XD',
    'Machine Learning', 'Data Science', 'AI', 'Blockchain', 'DevOps',
    'Mobile Development', 'React Native', 'Flutter', 'iOS', 'Android',
    'UI/UX Design', 'Graphic Design', 'Product Management', 'Project Management'
  ];

  // Predefined tags list
  const availableTags = [
    'Web Development', 'Mobile App', 'Desktop App', 'API', 'Database',
    'Frontend', 'Backend', 'Full Stack', 'Data Science', 'Machine Learning',
    'AI', 'Blockchain', 'IoT', 'Game Development', 'E-commerce',
    'Social Media', 'Education', 'Healthcare', 'Finance', 'Entertainment',
    'Productivity', 'Utility', 'Open Source', 'Startup', 'Enterprise',
    'Beginner Friendly', 'Advanced', 'Research', 'Prototype', 'MVP'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('hackathon.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        hackathon: {
          ...prev.hackathon,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Skills management functions
  const filteredSkills = availableSkills.filter(skill => 
    !selectedSkills.includes(skill) && 
    skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
  );

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      setFormData(prev => ({
        ...prev,
        skillsRequired: newSkills.join(', ')
      }));
    }
    setSkillsDropdownOpen(false);
    setSkillSearchTerm('');
  };

  const handleSkillRemove = (skillToRemove) => {
    const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    setSelectedSkills(newSkills);
    setFormData(prev => ({
      ...prev,
      skillsRequired: newSkills.join(', ')
    }));
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      const newSkills = [...selectedSkills, customSkill.trim()];
      setSelectedSkills(newSkills);
      setFormData(prev => ({
        ...prev,
        skillsRequired: newSkills.join(', ')
      }));
      setCustomSkill('');
    }
  };

  // Tags management functions
  const filteredTags = availableTags.filter(tag => 
    !selectedTags.includes(tag) && 
    tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setFormData(prev => ({
        ...prev,
        tags: newTags.join(', ')
      }));
    }
    setTagsDropdownOpen(false);
    setTagSearchTerm('');
  };

  const handleTagRemove = (tagToRemove) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    setFormData(prev => ({
      ...prev,
      tags: newTags.join(', ')
    }));
  };

  const handleCustomTagAdd = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      const newTags = [...selectedTags, customTag.trim()];
      setSelectedTags(newTags);
      setFormData(prev => ({
        ...prev,
        tags: newTags.join(', ')
      }));
      setCustomTag('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ideaData = {
      title: formData.title,
      description: formData.description,
      skillsRequired: selectedSkills,
      tags: selectedTags,
      projectType: formData.projectType,
    };

    if (formData.projectType === 'hackathon') {
      ideaData.hackathon = {
        maxTeamSize: parseInt(formData.hackathon.maxTeamSize),
        description: formData.hackathon.description,
      };
    }

    const { success, idea } = await createIdea(ideaData);
    if (success) {
      alert('Project created successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        skillsRequired: '',
        tags: '',
        projectType: 'personal',
        hackathon: {
          maxTeamSize: '',
          description: '',
        },
      });
      setSelectedSkills([]);
      setSelectedTags([]);
    } else {
      alert('Failed to create project');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Create New Project
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Bring your ideas to life by creating a new project. Whether it's a personal project or a hackathon challenge, we'll help you find the right collaborators.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Project Type Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-3 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                Project Type
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.projectType === 'personal' 
                    ? 'border-purple-500/50 bg-purple-500/10' 
                    : 'border-gray-600/50 bg-gray-700/30 hover:border-gray-500/50'
                }`}>
                  <input
                    type="radio"
                    name="projectType"
                    value="personal"
                    checked={formData.projectType === 'personal'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.projectType === 'personal' ? 'bg-purple-500/20' : 'bg-gray-600/50'
                    }`}>
                      <Code className={`w-6 h-6 ${formData.projectType === 'personal' ? 'text-purple-400' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Personal Project</h4>
                      <p className="text-gray-400 text-sm">Standard collaborative project</p>
                    </div>
                  </div>
                </label>

                <label className={`relative flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.projectType === 'hackathon' 
                    ? 'border-purple-500/50 bg-purple-500/10' 
                    : 'border-gray-600/50 bg-gray-700/30 hover:border-gray-500/50'
                }`}>
                  <input
                    type="radio"
                    name="projectType"
                    value="hackathon"
                    checked={formData.projectType === 'hackathon'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.projectType === 'hackathon' ? 'bg-purple-500/20' : 'bg-gray-600/50'
                    }`}>
                      <Users className={`w-6 h-6 ${formData.projectType === 'hackathon' ? 'text-purple-400' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Hackathon</h4>
                      <p className="text-gray-400 text-sm">Time-limited competitive project</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-400" />
                Project Information
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Project Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="title"
                    placeholder="Enter an engaging project title..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Project Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your project in detail. What problem does it solve? What technologies will you use? What's the expected outcome?"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-none"
                  />
                  <p className="text-xs text-gray-500">Be specific about goals, scope, and expected deliverables</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                Required Skills
              </h3>
              
              {/* Selected Skills Display */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                  {selectedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 text-sm font-medium group hover:bg-blue-500/30 transition-colors duration-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="text-blue-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Skills Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSkillsDropdownOpen(!skillsDropdownOpen)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-left text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 flex items-center justify-between hover:bg-gray-700/70"
                >
                  Select required skills...
                  <Code className="w-5 h-5" />
                </button>

                {skillsDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-gray-800 border border-gray-600/50 rounded-xl shadow-2xl max-h-72 overflow-hidden">
                    <div className="p-3 border-b border-gray-700/50">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search skills..."
                          value={skillSearchTerm}
                          onChange={(e) => setSkillSearchTerm(e.target.value)}
                          className="w-full px-4 py-2 pl-10 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto">
                      {filteredSkills.length > 0 ? (
                        <div className="p-2">
                          {filteredSkills.map((skill, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSkillSelect(skill)}
                              className="w-full text-left px-3 py-2 text-gray-300 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg transition-colors duration-200 text-sm"
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No skills found matching "{skillSearchTerm}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom skill..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault() && handleCustomSkillAdd()}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={handleCustomSkillAdd}
                  className="px-6 py-3 bg-blue-600/20 text-blue-300 rounded-xl hover:bg-blue-600/30 border border-blue-500/30 transition-all duration-200 font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-3 flex items-center">
                <Hash className="w-5 h-5 mr-2 text-purple-400" />
                Project Tags
              </h3>
              
              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                  {selectedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30 text-sm font-medium group hover:bg-green-500/30 transition-colors duration-200"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="text-green-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Tags Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-left text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 flex items-center justify-between hover:bg-gray-700/70"
                >
                  Select project tags...
                  <Hash className="w-5 h-5" />
                </button>

                {tagsDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-gray-800 border border-gray-600/50 rounded-xl shadow-2xl max-h-72 overflow-hidden">
                    <div className="p-3 border-b border-gray-700/50">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search tags..."
                          value={tagSearchTerm}
                          onChange={(e) => setTagSearchTerm(e.target.value)}
                          className="w-full px-4 py-2 pl-10 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto">
                      {filteredTags.length > 0 ? (
                        <div className="p-2">
                          {filteredTags.map((tag, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleTagSelect(tag)}
                              className="w-full text-left px-3 py-2 text-gray-300 hover:bg-green-500/20 hover:text-green-300 rounded-lg transition-colors duration-200 text-sm"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No tags found matching "{tagSearchTerm}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom tag..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault() && handleCustomTagAdd()}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={handleCustomTagAdd}
                  className="px-6 py-3 bg-green-600/20 text-green-300 rounded-xl hover:bg-green-600/30 border border-green-500/30 transition-all duration-200 font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
            </div>

            {/* Hackathon Specific Fields */}
            {formData.projectType === 'hackathon' && (
              <div className="space-y-6 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  Hackathon Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Maximum Team Size <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="hackathon.maxTeamSize"
                      placeholder="e.g., 4"
                      value={formData.hackathon.maxTeamSize}
                      onChange={handleChange}
                      required
                      type="number"
                      min="1"
                      max="20"
                      className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Team Status
                    </label>
                    <div className="px-4 py-3 rounded-xl bg-gray-700/30 border border-gray-600/30 text-gray-400">
                      Looking for teammates
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Hackathon Goals & Timeline <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="hackathon.description"
                    placeholder="Describe the hackathon-specific goals, timeline, expected deliverables, and any special requirements..."
                    value={formData.hackathon.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700/50">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center justify-center ${
                  loading
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-purple-500/25'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Create Project
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    skillsRequired: '',
                    tags: '',
                    projectType: 'personal',
                    hackathon: {
                      maxTeamSize: '',
                      description: '',
                    },
                  });
                  setSelectedSkills([]);
                  setSelectedTags([]);
                }}
                className="px-8 py-4 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newproject;