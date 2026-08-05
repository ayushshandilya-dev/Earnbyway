import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectDetail } from './ProjectDetail';
import { Project } from '../../types';
import { EmptyState } from '../ui/EmptyState';
import { Reveal, Stagger } from '../ui/Reveal';
import { Search, Code, Brain, Palette, PenTool, Video, Megaphone, Layers, Shield, Briefcase, MapPin, Clock, Users, ChevronRight, ArrowUpDown } from 'lucide-react';

const CATEGORIES = ['All', 'Development', 'AI', 'Graphic Design', 'Content Writing', 'Video Editing', 'Marketing', 'UI/UX Design', 'Cybersecurity'];

export const ProjectsBoard: React.FC = () => {
  const { projects, currentRole } = useApp();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'budget_high' | 'budget_low'>('newest');

  const openProjects = projects.filter(p => p.status === 'open');

  const filteredProjects = useMemo(() => {
    let result = [...openProjects];
    const q = searchQuery.toLowerCase();
    if (q) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'budget_high':
        result.sort((a, b) => b.budget - a.budget);
        break;
      case 'budget_low':
        result.sort((a, b) => a.budget - b.budget);
        break;
    }
    return result;
  }, [openProjects, searchQuery, selectedCategory, sortBy]);

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="py-8">
      <Reveal direction="down" duration={0.6}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Projects Board</h1>
            <p className="text-sm text-zinc-400 mt-1">{filteredProjects.length} open projects</p>
          </div>
          <div className="relative flex-1 sm:flex-none w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title or skills..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-900/90 border border-zinc-800 rounded-xl text-slate-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>
      </Reveal>

      <div className="flex gap-1 overflow-x-auto pb-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border-none text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="budget_high">Highest Budget</option>
            <option value="budget_low">Lowest Budget</option>
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState icon="project" title="No open projects" description="Check back later for new opportunities." />
      ) : (
        <Stagger staggerBy={0.09} className="space-y-4">
          {filteredProjects.map(project => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="w-full glass-card glass-card-hover rounded-2xl p-5 text-left group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-semibold">
                      {project.category}
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                      {project.duration}
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.skills.slice(0, 5).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <img src={project.clientAvatar} alt="" className="w-5 h-5 rounded-lg object-cover" />
                      {project.clientName}
                    </span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {project.createdAt}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {project.proposalCount} proposals</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-zinc-500 mb-1">Budget</div>
                  <div className="text-xl font-bold text-emerald-400">₹{project.budget.toLocaleString()}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400 group-hover:gap-2 transition-all">
                    View Details <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </button>
            ))}
        </Stagger>
      )}
    </div>
  );
};
