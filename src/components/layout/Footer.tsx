import React from 'react';
import { Hexagon, ShieldCheck, Lock, Cpu, Globe, Award, Github, Linkedin, Twitter, Mail, Phone, ArrowUpRight } from 'lucide-react';

const FOOTER_LINKS = {
  platform: [
    { label: 'Explore Gigs', href: '/gigs' },
    { label: 'Projects Board', href: '/projects' },
    { label: 'How It Works', href: '/' },
    { label: 'AI Playground', href: '/ai' },
    { label: 'Pricing', href: '/subscription' },
  ],
  categories: [
    { label: 'Web Development', href: '/gigs' },
    { label: 'AI & Machine Learning', href: '/gigs' },
    { label: 'Graphic Design & UI/UX', href: '/gigs' },
    { label: 'Content & Copywriting', href: '/gigs' },
    { label: 'Video Editing & 3D', href: '/gigs' },
  ],
  resources: [
    { label: 'Help Center', href: '#' },
    { label: 'Community Forum', href: '#' },
    { label: 'API Documentation', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Status Page', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR Compliance', href: '#' },
  ],
};

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 border-t border-zinc-800/60 bg-gradient-to-b from-zinc-950 to-black">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5">
                  <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                    <Hexagon className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                  </div>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-lg text-white">Earn By Way</span>
                  <span className="block text-[10px] text-zinc-500 -mt-0.5">Scalable Freelance Marketplace</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                Connecting clients with talented freelancers worldwide through secure escrow milestone payment processing, real-time communication, and AI-powered matching.
              </p>
              <div className="flex items-center gap-2 pt-1">
                {[
                  { icon: ShieldCheck, label: 'Escrow Protected', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
                  { icon: Lock, label: '256-Bit SSL', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
                ].map(b => (
                  <span key={b.label} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${b.bg} ${b.color} ${b.border} text-[10px] font-medium border`}>
                    <b.icon className="w-3 h-3" /> {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Platform', links: FOOTER_LINKS.platform },
              { title: 'Categories', links: FOOTER_LINKS.categories },
              { title: 'Resources', links: FOOTER_LINKS.resources },
            ].map(section => (
              <div key={section.title}>
                <h4 className="font-semibold text-white text-sm mb-4">{section.title}</h4>
                <ul className="space-y-2.5">
                  {section.links.map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group">
                        {link.label}
                        <ArrowUpRight className="w-2.5 h-2.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Contact Us</h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="tel:+919971898666" className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group">
                    <Phone className="w-3 h-3 text-emerald-400/70" />
                    +91-99718 98666
                  </a>
                </li>
                <li>
                  <a href="mailto:support@earnbyway.com" className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group">
                    <Mail className="w-3 h-3 text-emerald-400/70" />
                    support@earnbyway.com
                  </a>
                </li>
                <li>
                  <p className="text-xs text-zinc-600 leading-relaxed max-w-[180px]">
                    Available Mon–Sat, 10 AM – 7 PM IST
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-600">
            &copy; 2026 Earn By Way. All rights reserved. Built with React, TypeScript &amp; Tailwind CSS.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: Github, href: '#', label: 'GitHub' },
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Linkedin, href: '#', label: 'LinkedIn' },
              { icon: Mail, href: '#', label: 'Email' },
            ].map(social => (
              <a key={social.label} href={social.href} aria-label={social.label}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-zinc-800 transition-all">
                <social.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
