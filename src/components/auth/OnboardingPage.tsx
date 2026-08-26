import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Reveal } from '../ui/Reveal';
import {
  Sparkles, MapPin, Briefcase, Building, DollarSign,
  User as UserIcon, ListPlus, CheckCircle, ArrowRight
} from 'lucide-react';

const POPULAR_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'Next.js', 'Python',
  'UI/UX Design', 'Figma', 'Copywriting', 'SEO',
  'Graphic Design', 'Video Editing', 'Machine Learning'
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, usingBackend, updateProfile } = useApp();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [avatar, setAvatar] = useState(currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
  const [location, setLocation] = useState(currentUser.location || 'Bengaluru, India');
  const [title, setTitle] = useState(currentUser.title || '');
  const [company, setCompany] = useState(currentUser.company || '');
  const [hourlyRate, setHourlyRate] = useState('500');
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      setSelectedSkills([...selectedSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedProfileData: any = {
        name: currentUser.name,
        location,
        title,
        avatar,
      };

      if (currentUser.role === 'client') {
        updatedProfileData.company = company;
      } else {
        // Freelancer Profile
        updatedProfileData.freelancerProfile = {
          banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
          bio,
          title,
          hourlyRate: parseFloat(hourlyRate) || 500,
          skills: selectedSkills,
          languages: ['English (Fluent)'],
          availability: 'Full-time',
          education: [],
          certificates: [],
          experience: [],
          portfolio: [],
          socialLinks: {},
        };
      }

      await updateProfile(updatedProfileData);

      addToast('Onboarding completed! Welcome to EarnByWay.', 'success');
      navigate(currentUser.role === 'client' ? '/projects' : '/dashboard');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to save profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-xl mx-auto px-4 min-h-[80vh] flex flex-col justify-center">
      <Reveal direction="up" duration={0.6}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Set Up Your Account
          </div>
          <h1 className="text-3xl font-heading font-bold text-white">Let's complete your profile</h1>
          <p className="text-sm text-zinc-400 mt-2">Tell us more about yourself to get started on the marketplace.</p>
        </div>
      </Reveal>

      <Card className="p-6 sm:p-8 border border-zinc-800 bg-zinc-900/40 backdrop-blur-md relative overflow-hidden preserve-3d shadow-3d">
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-emerald-400" /> Basic Details
            </h2>

            {/* Profile Avatar Selection */}
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-2 block">Choose Profile Picture</label>
              <div className="flex flex-wrap gap-3 items-center">
                <img src={avatar} alt="Selected avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500" />
                <div className="flex flex-wrap gap-2">
                  {[
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
                    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150'
                  ].map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setAvatar(`${url}&auto=format&fit=crop&q=80`)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                        avatar.includes(url) ? 'border-emerald-400 scale-105' : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <img src={url} className="w-full h-full object-cover" alt="Preset choice" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Location / Region</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white"
                  placeholder="e.g. Bengaluru, India or San Francisco, CA"
                />
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(2)}
            >
              Next Step
            </Button>
          </div>
        )}

        {step === 2 && currentUser.role === 'client' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" /> Client Profile Setup
            </h2>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white"
                  placeholder="e.g. Acme Corporation or TechScale Innovations"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Your Job Title / Position</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white"
                  placeholder="e.g. Founder, CEO, VP of Product"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" className="flex-1 justify-center" onClick={() => setStep(3)}>
                Verify & Proceed
              </Button>
            </div>
          </div>
        )}

        {step === 2 && currentUser.role === 'freelancer' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" /> Professional Details
            </h2>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Professional Title / Headline</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white"
                  placeholder="e.g. Full Stack Developer, UI Designer, SEO Writer"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Hourly Rate (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white"
                  placeholder="500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Bio / Summary</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl p-4 text-sm text-white resize-none"
                placeholder="Describe your expertise, experience, and the services you offer..."
              />
            </div>

            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1 justify-center"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(3)}
              >
                Next: Skills
              </Button>
            </div>
          </div>
        )}

        {step === 3 && currentUser.role === 'freelancer' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <ListPlus className="w-5 h-5 text-emerald-400" /> Choose Your Skills
            </h2>

            {/* Popular Skills Selection */}
            <div>
              <span className="text-xs font-medium text-zinc-400 block mb-2">Select Your Top Core Skills</span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        active
                          ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-md shadow-emerald-500/10'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Skills Adding */}
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Add Custom Skill</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomSkill(); }}
                  className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2 text-sm text-white"
                  placeholder="e.g. Kubernetes, React Native, Rust"
                />
                <Button variant="secondary" onClick={handleAddCustomSkill}>
                  Add
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1 justify-center"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Saving...' : 'Finish Setup'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && currentUser.role === 'client' && (
          <div className="space-y-6 text-center animate-fade-in py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Your Profile is Ready!</h2>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto">
              Everything is set up. You can now post projects, browse freelancers, and fund escrow milestones securely.
            </p>

            <div className="flex gap-4 pt-4">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1 justify-center"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Creating Account...' : 'Enter Marketplace'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
