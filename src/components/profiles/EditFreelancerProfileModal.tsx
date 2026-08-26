import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import {
  X, Save, Plus, Trash2, Briefcase, GraduationCap, Award, MapPin, DollarSign,
  User as UserIcon
} from 'lucide-react';
import { ExperienceItem, Certification } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EditFreelancerProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, profiles, updateProfile } = useApp();
  const { addToast } = useToast();
  const profile = profiles[currentUser.id];

  const [loading, setLoading] = useState(false);

  // Form States
  const [title, setTitle] = useState(currentUser.title || profile?.title || '');
  const [location, setLocation] = useState(currentUser.location || 'Global');
  const [hourlyRate, setHourlyRate] = useState(profile?.hourlyRate?.toString() || '500');
  const [availability, setAvailability] = useState<'Full-time' | 'Part-time' | 'Contract'>(profile?.availability || 'Full-time');
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Complex List States (mapped strictly to database model)
  const [experience, setExperience] = useState<ExperienceItem[]>(profile?.experience || []);
  const [education, setEducation] = useState<string[]>(profile?.education || []);
  const [certificates, setCertificates] = useState<Certification[]>(profile?.certificates || []);

  if (!isOpen || !profile) return null;

  // Skill Handlers
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  // Experience Handlers
  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: 'exp_' + Math.random().toString(36).substr(2, 9),
      role: '',
      company: '',
      period: '',
      description: ''
    };
    setExperience([...experience, newItem]);
  };

  const handleUpdateExperience = (index: number, key: keyof ExperienceItem, value: string) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [key]: value };
    setExperience(updated);
  };

  const handleRemoveExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Education Handlers (education is string[] in database)
  const handleAddEducation = () => {
    setEducation([...education, '']);
  };

  const handleUpdateEducation = (index: number, value: string) => {
    const updated = [...education];
    updated[index] = value;
    setEducation(updated);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Certificate Handlers
  const handleAddCertificate = () => {
    const newItem: Certification = {
      id: 'cert_' + Math.random().toString(36).substr(2, 9),
      name: '',
      issuer: '',
      year: ''
    };
    setCertificates([...certificates, newItem]);
  };

  const handleUpdateCertificate = (index: number, key: keyof Certification, value: string) => {
    const updated = [...certificates];
    updated[index] = { ...updated[index], [key]: value };
    setCertificates(updated);
  };

  const handleRemoveCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = {
        title,
        location,
        freelancerProfile: {
          ...profile,
          title,
          bio,
          hourlyRate: parseFloat(hourlyRate) || 500,
          availability,
          skills,
          experience: experience.filter(exp => exp.role.trim() && exp.company.trim()),
          education: education.filter(edu => edu.trim()),
          certificates: certificates.filter(cert => cert.name.trim() && cert.issuer.trim()),
        }
      };

      await updateProfile(updates);
      addToast('Profile updated successfully!', 'success');
      onClose();
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to save updates', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/60">
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-emerald-400" /> Edit Profile Details
          </h2>
          <button onClick={onClose} className="p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          
          {/* Headline & Location & Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Professional Title / Headline</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white"
                placeholder="e.g. Senior Full Stack Engineer"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-sm text-white"
                  placeholder="e.g. Mumbai, India"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Hourly Rate (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={e => setHourlyRate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-sm text-white"
                  placeholder="500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Availability</label>
              <select
                value={availability}
                onChange={e => setAvailability(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white appearance-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* About / Bio */}
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">About / Professional Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl p-4 text-sm text-white resize-none"
              placeholder="Tell clients about your background, tools, and experience..."
            />
          </div>

          {/* Skills Tag Manager */}
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Skills</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddSkill(); }}
                className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2 text-sm text-white"
                placeholder="Add skill (e.g. React, Docker)"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl border border-zinc-800 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-white">
                  {s}
                  <button onClick={() => handleRemoveSkill(s)} className="text-zinc-500 hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400" /> Professional Experience
              </h3>
              <button
                type="button"
                onClick={handleAddExperience}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {experience.map((item, index) => (
                <div key={item.id || index} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3 relative">
                  <button onClick={() => handleRemoveExperience(index)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                    <input
                      type="text"
                      value={item.role}
                      onChange={e => handleUpdateExperience(index, 'role', e.target.value)}
                      placeholder="Role / Title"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={item.company}
                      onChange={e => handleUpdateExperience(index, 'company', e.target.value)}
                      placeholder="Company"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={item.period}
                      onChange={e => handleUpdateExperience(index, 'period', e.target.value)}
                      placeholder="Period (e.g. 2022 - Present)"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <textarea
                    value={item.description}
                    onChange={e => handleUpdateExperience(index, 'description', e.target.value)}
                    placeholder="Short description of achievements..."
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl p-3 text-xs text-white resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <GraduationCap className="w-4.5 h-4.5 text-emerald-400" /> Education
              </h3>
              <button
                type="button"
                onClick={handleAddEducation}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {education.map((item, index) => (
                <div key={index} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3 relative">
                  <button onClick={() => handleRemoveEducation(index)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleUpdateEducation(index, e.target.value)}
                    placeholder="e.g. B.Tech in CS - Stanford University (2018 - 2022)"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white pr-10"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Certificate Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-emerald-400" /> Certifications
              </h3>
              <button
                type="button"
                onClick={handleAddCertificate}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {certificates.map((item, index) => (
                <div key={item.id || index} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3 relative">
                  <button onClick={() => handleRemoveCertificate(index)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                    <input
                      type="text"
                      value={item.name}
                      onChange={e => handleUpdateCertificate(index, 'name', e.target.value)}
                      placeholder="Certificate Name"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={item.issuer}
                      onChange={e => handleUpdateCertificate(index, 'issuer', e.target.value)}
                      placeholder="Issuing Org"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={item.year}
                      onChange={e => handleUpdateCertificate(index, 'year', e.target.value)}
                      placeholder="Year"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800/60 flex justify-end gap-3 bg-zinc-900/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-black rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};
