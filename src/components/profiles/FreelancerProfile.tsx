import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { AIService } from '../../services/aiService';
import { User } from '../../types';
import {
  ArrowLeft, Star, CheckCircle, Clock, MapPin, Globe, Briefcase, GraduationCap,
  Award, ExternalLink, Heart, MessageSquare, Download, Sparkles, Shield,
  ChevronRight, Github, Linkedin, Dribbble, Globe as GlobeIcon, Zap
} from 'lucide-react';

interface Props {
  freelancerUser: User;
  onBack?: () => void;
}

export const FreelancerProfile: React.FC<Props> = ({ freelancerUser, onBack }) => {
  const navigate = useNavigate();
  const { profiles, reviews, users, currentRole, bookmarks, toggleBookmark, isBookmarked } = useApp();
  const { addToast } = useToast();
  const profile = profiles[freelancerUser.id];
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'ai'>('portfolio');
  const [showAI, setShowAI] = useState(false);

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-400">Profile not found.</p>
      </div>
    );
  }

  const userReviews = reviews.filter(r => r.targetId === freelancerUser.id);
  const aiAnalysis = AIService.analyzeProfile(profile);
  const saved = isBookmarked(freelancerUser.id);

  return (
    <div className="py-8 animate-in fade-in duration-300">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => onBack ? onBack() : navigate(-1)}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Banner & Avatar */}
        <div className="relative rounded-2xl overflow-hidden mb-20">
          <div className="h-48 sm:h-56 bg-cover bg-center" style={{ backgroundImage: `url(${profile.banner})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          </div>
          <div className="absolute -bottom-12 left-6 sm:left-8 flex items-end gap-5">
            <img
              src={freelancerUser.avatar}
              alt={freelancerUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-zinc-950 ring-2 ring-emerald-500/50 shadow-xl"
            />
            <div className="pb-1 hidden sm:block">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-heading font-bold text-white">{freelancerUser.name}</h1>
                {freelancerUser.isVerified && <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />}
              </div>
              <p className="text-sm text-zinc-400">{profile.title}</p>
            </div>
          </div>
        </div>

        <div className="sm:hidden mb-6 px-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-heading font-bold text-white">{freelancerUser.name}</h1>
            {freelancerUser.isVerified && <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />}
          </div>
          <p className="text-sm text-zinc-400">{profile.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Rating', value: profile.rating, icon: Star, color: 'text-amber-400' },
                { label: 'Jobs Done', value: profile.completedJobs, icon: Briefcase, color: 'text-emerald-400' },
                { label: 'Response', value: profile.responseTime, icon: Clock, color: 'text-blue-400' },
                { label: 'Earned', value: `₹${(profile.totalEarned / 1000).toFixed(0)}k`, icon: Zap, color: 'text-purple-400' },
              ].map(stat => (
                <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                  <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1.5`} />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-lg font-heading font-bold text-white mb-3">About</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-lg font-heading font-bold text-white mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:border-emerald-500/40 transition-colors">{s}</span>
                ))}
              </div>
            </div>

            {/* Experience */}
            {profile.experience.length > 0 && (
              <div>
                <h2 className="text-lg font-heading font-bold text-white mb-4">Experience</h2>
                <div className="space-y-4">
                  {profile.experience.map(exp => (
                    <div key={exp.id} className="glass-card rounded-2xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">{exp.role}</h3>
                          <p className="text-xs text-zinc-400">{exp.company} · {exp.period}</p>
                          <p className="text-xs text-zinc-500 mt-1">{exp.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profile.education.length > 0 && (
                <div>
                  <h2 className="text-lg font-heading font-bold text-white mb-3">Education</h2>
                  <div className="space-y-3">
                    {profile.education.map((edu, i) => (
                      <div key={i} className="glass-card rounded-xl p-4 flex items-start gap-3">
                        <GraduationCap className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-300">{edu}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {profile.certificates.length > 0 && (
                <div>
                  <h2 className="text-lg font-heading font-bold text-white mb-3">Certifications</h2>
                  <div className="space-y-3">
                    {profile.certificates.map(cert => (
                      <div key={cert.id} className="glass-card rounded-xl p-4 flex items-start gap-3">
                        <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-white">{cert.name}</p>
                          <p className="text-[10px] text-zinc-500">{cert.issuer} · {cert.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio */}
            {profile.portfolio.length > 0 && (
              <div>
                <h2 className="text-lg font-heading font-bold text-white mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.portfolio.map(p => (
                    <div key={p.id} className="glass-card rounded-2xl overflow-hidden group">
                      <div className="h-44 overflow-hidden">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-white mb-1">{p.title}</h3>
                        <p className="text-xs text-zinc-400 mb-3">{p.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {p.technologies.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">{t}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          {p.projectUrl && (
                            <a href={p.projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-emerald-400 hover:underline">
                              <ExternalLink className="w-3 h-3" /> Live Demo
                            </a>
                          )}
                          {p.githubUrl && (
                            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white">
                              <Github className="w-3 h-3" /> Source
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            <div>
              <div className="flex items-center gap-4 border-b border-zinc-800 mb-6">
                {(['portfolio', 'reviews', 'ai'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === tab ? 'text-emerald-400 border-emerald-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                    }`}
                  >
                    {tab === 'portfolio' ? 'Portfolio' : tab === 'reviews' ? `Reviews (${userReviews.length})` : 'AI Analysis'}
                  </button>
                ))}
              </div>

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {userReviews.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-8">No reviews yet.</p>
                  ) : (
                    userReviews.map(r => (
                      <div key={r.id} className="glass-card rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: r.rating }).map((_, j) => (
                              <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-xs text-zinc-500">{r.createdAt}</span>
                        </div>
                        <p className="text-sm text-zinc-300 mb-3">{r.comment}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <img src={r.reviewerAvatar} alt="" className="w-6 h-6 rounded-lg object-cover" />
                          <span className="text-white font-medium">{r.reviewerName}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="glass-card rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-semibold text-white">AI Profile Analysis</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      aiAnalysis.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                      aiAnalysis.score >= 60 ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Score: {aiAnalysis.score}/100
                    </div>
                  </div>

                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      aiAnalysis.score >= 80 ? 'bg-emerald-500' :
                      aiAnalysis.score >= 60 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} style={{ width: `${aiAnalysis.score}%` }} />
                  </div>

                  {aiAnalysis.strengths.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-400 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {aiAnalysis.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-amber-400 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {aiAnalysis.recommendations.map((r, i) => (
                          <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl p-5 sticky top-28 space-y-5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { toggleBookmark(freelancerUser.id); addToast(saved ? 'Removed from bookmarks' : 'Saved to bookmarks!', 'success'); }}
                  className={`p-2 rounded-xl border transition-all ${
                    saved ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  aria-label={saved ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-red-400' : ''}`} />
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm">
                  <MessageSquare className="w-4 h-4" /> Hire Me
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Hourly Rate</span>
                  <span className="text-white font-semibold">₹{profile.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Availability</span>
                  <span className="text-emerald-400">{profile.availability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Location</span>
                  <span className="text-white flex items-center gap-1"><MapPin className="w-3 h-3" /> {freelancerUser.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Response Rate</span>
                  <span className="text-white">{profile.responseRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Avg Delivery</span>
                  <span className="text-white">{profile.avgDeliveryTime}</span>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <h4 className="text-xs font-medium text-zinc-400 mb-3">Languages</h4>
                <div className="space-y-2">
                  {profile.languages.map(lang => (
                    <div key={lang} className="flex items-center gap-2 text-xs text-zinc-300">
                      <Globe className="w-3.5 h-3.5 text-zinc-500" /> {lang}
                    </div>
                  ))}
                </div>
              </div>

              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-300 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Resume
                </a>
              )}

              <div className="border-t border-zinc-800 pt-4">
                <h4 className="text-xs font-medium text-zinc-400 mb-3">Social Links</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.socialLinks.github && (
                    <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socialLinks.linkedin && (
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socialLinks.dribbble && (
                    <a href={profile.socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                      <Dribbble className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socialLinks.website && (
                    <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                      <GlobeIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
