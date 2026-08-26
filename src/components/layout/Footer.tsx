import React from 'react';
import { Hexagon, ShieldCheck, Lock, Cpu, Globe, Award, Github, Linkedin, Twitter, Mail, Phone, ArrowUpRight, CheckCircle, Building } from 'lucide-react';

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
    <footer className="relative mt-24 border-t border-zinc-800/60 bg-gradient-to-b from-zinc-950 to-black text-left">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-500/5 via-teal-500/5 to-transparent blur-2xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-zinc-800/60">
          {[
            {
              icon: Building,
              title: 'MJCORP ASIA PVT LTD',
              desc: 'Corporate escrow holder & verified legal custodian for all milestone contracts.',
              gradient: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            },
            {
              icon: Lock,
              title: 'Razorpay Secured (INR ₹)',
              desc: 'Instant UPI, RuPay, Visa, NetBanking with 256-bit PCI-DSS banking encryption.',
              gradient: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
            },
            {
              icon: ShieldCheck,
              title: 'Mandatory User KYC',
              desc: 'Aadhaar, PAN & bank verification before any platform funds are disbursed.',
              gradient: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            },
            {
              icon: CheckCircle,
              title: 'Milestone-Based NEFT',
              desc: 'Bank transfers executed with verifiable bank UTR audit tracking compliance.',
              gradient: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
            }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3.5 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${item.gradient}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-white mb-0.5">{item.title}</h5>
                <p className="text-[10px] text-zinc-500 leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Links & Legal Entity Card */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Brand & Operating Legal Entity Card */}
            <div className="col-span-2 space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-400 to-violet-500 p-0.5">
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

              {/* Operating Legal Entity Details Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 space-y-2 max-w-xs">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Operating Legal Entity
                </div>
                <h5 className="text-xs font-bold text-white">MJCORP ASIA PRIVATE LIMITED</h5>
                <div className="text-[9.5px] text-zinc-500 space-y-1">
                  <div>CIN: <span className="text-zinc-400">U62099HR2024PTC125790</span></div>
                  <div>GSTIN: <span className="text-zinc-400">06AASCM6316N1ZU</span></div>
                  <div>1212/25, Kalupur, Sonipat, Haryana 131001, India</div>
                  <div>Contact: <a href="mailto:contact@earnbyway.com" className="text-emerald-400 hover:underline">contact@earnbyway.com</a></div>
                </div>
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Platform', links: FOOTER_LINKS.platform },
              { title: 'Categories', links: FOOTER_LINKS.categories },
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

        {/* Regulatory Disclaimer & Settlement */}
        <div className="py-6 border-t border-zinc-800/60 text-[10px] text-zinc-600 leading-relaxed space-y-2">
          <p>
            <span className="font-semibold text-zinc-400">Regulatory Disclaimer:</span> EarnByWay (earnbyway.com) operates purely as a secure freelance escrow marketplace platform. It does not facilitate equity investments, debt financing, securities offering, collective investment schemes, or guaranteed financial returns in accordance with SEBI, RBI, and Companies Act regulations.
          </p>
          <p>
            All freelance contract funds are collected via Razorpay Standard Checkout in Indian Rupees (INR) and settled directly into the merchant account owned by <span className="font-semibold text-zinc-400">MJCORP ASIA PRIVATE LIMITED</span>. Disbursements are executed manually by Admin via NEFT/RTGS/IMPS to verified freelancer bank accounts following milestone compliance audits.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-zinc-600 flex flex-wrap items-center gap-1.5">
            <span>&copy; 2026 Earn By Way. A property of <span className="text-zinc-400 font-medium">MJCORP ASIA PRIVATE LIMITED</span>. All rights reserved.</span>
            <span className="text-zinc-800">|</span>
            <span className="text-zinc-500">Made with pride in India🇮🇳</span>
            <span className="text-zinc-800">|</span>
            <span className="text-zinc-500">Domain: earnbyway.com</span>
          </div>
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
