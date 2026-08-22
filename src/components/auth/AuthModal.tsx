import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hexagon, X, Mail, Lock, ShieldCheck, Github, Smartphone, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { signIn } = useApp();
  const [step, setStep] = useState<'login' | 'signup_role' | 'otp' | 'oauth_connecting' | 'oauth_success'>('login');
  const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer' | null>(null);
  const [oauthProvider, setOauthProvider] = useState<'google' | 'github' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleMockLogin = (role: 'client' | 'freelancer') => {
    signIn(role, email || undefined, name || undefined);
    onClose();
    setTimeout(() => {
      setStep('login');
      setSelectedRole(null);
      setOauthProvider(null);
      setEmail('');
      setPassword('');
      setName('');
      setError('');
    }, 300);
  };

  const handleSignIn = () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 4) {
      setError('Please enter your password (min 4 characters).');
      return;
    }
    setError('');
    handleMockLogin('client');
  };

  const handleOAuthStart = (provider: 'google' | 'github', role: 'client' | 'freelancer') => {
    setOauthProvider(provider);
    setSelectedRole(role);
    setStep('oauth_connecting');
    // Simulate OAuth redirect & callback
    setTimeout(() => {
      setStep('oauth_success');
    }, 2000);
  };

  const handleOAuthComplete = () => {
    handleMockLogin(selectedRole || 'client');
  };

  const renderContent = () => {
    if (step === 'login') {
      return (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-zinc-400">Sign in to access your Earn By Way dashboard.</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Email Address"
              icon={<Mail className="w-4 h-4" />}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              icon={<Lock className="w-4 h-4" />}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              onClick={handleSignIn}
              btn3d
              size="md"
              className="w-full"
            >
              Sign In
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-zinc-500">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md" onClick={() => handleOAuthStart('google', 'client')} className="!py-2.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Google
              </Button>
              <Button variant="secondary" size="md" onClick={() => handleOAuthStart('github', 'freelancer')} className="!py-2.5">
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            </div>
            <p className="text-[10px] text-zinc-600 text-center mt-2">
              By continuing with OAuth, you agree to our Terms of Service
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400">
            Don't have an account?{' '}
            <button onClick={() => setStep('signup_role')} className="text-emerald-400 font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </div>
      );
    }

    if (step === 'signup_role') {
      return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-white mb-2">Join Earn By Way</h2>
            <p className="text-sm text-zinc-400">How would you like to use the platform?</p>
          </div>

          <div className="grid gap-4 mb-6">
            <Button
              onClick={() => setSelectedRole('client')}
              variant={selectedRole === 'client' ? 'primary' : 'secondary'}
              size="md"
              className="!p-4 !justify-start !items-start h-auto"
            >
              <div className="flex justify-between items-start w-full">
                <div className="text-left">
                  <h3 className="font-semibold text-white mb-1">I'm a Client</h3>
                  <p className="text-xs text-zinc-400">I want to hire talent for my projects.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedRole === 'client' ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-600'}`}>
                  {selectedRole === 'client' && <div className="w-2 h-2 rounded-full bg-black"></div>}
                </div>
              </div>
            </Button>

            <Button
              onClick={() => setSelectedRole('freelancer')}
              variant={selectedRole === 'freelancer' ? 'primary' : 'secondary'}
              size="md"
              className="!p-4 !justify-start !items-start h-auto"
            >
              <div className="flex justify-between items-start w-full">
                <div className="text-left">
                  <h3 className="font-semibold text-white mb-1">I'm a Freelancer</h3>
                  <p className="text-xs text-zinc-400">I want to find work and get paid.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedRole === 'freelancer' ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-600'}`}>
                  {selectedRole === 'freelancer' && <div className="w-2 h-2 rounded-full bg-black"></div>}
                </div>
              </div>
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            <Input
              label="Full Name"
              icon={<Mail className="w-4 h-4" />}
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email Address"
              icon={<Mail className="w-4 h-4" />}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            disabled={!selectedRole}
            onClick={() => setStep('otp')}
            btn3d
            size="md"
            className="w-full"
          >
            Create Account
          </Button>
          
          <p className="mt-6 text-center text-xs text-zinc-400">
            Already have an account?{' '}
            <button onClick={() => setStep('login')} className="text-emerald-400 font-semibold hover:underline">
              Log in
            </button>
          </p>
        </div>
      );
    }

    if (step === 'otp') {
      return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Verify Email</h2>
          <p className="text-sm text-zinc-400 mb-6">We sent a 6-digit verification code to your email.</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-10 h-12 text-center bg-zinc-900 border border-zinc-800 rounded-lg text-lg text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="0"
                onChange={(e) => {
                  if (e.target.value && i === 6) {
                     handleMockLogin(selectedRole!);
                  }
                }}
              />
            ))}
          </div>

          <Button
            onClick={() => handleMockLogin(selectedRole!)}
            btn3d
            size="md"
            className="w-full mb-4"
          >
            Verify & Continue
          </Button>

          <Button onClick={() => setStep('signup_role')} variant="ghost" size="sm" className="w-full">
            Back
          </Button>
        </div>
      );
    }

    if (step === 'oauth_connecting') {
      return (
        <div className="animate-in fade-in duration-200 text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            {oauthProvider === 'google' ? (
              <svg className="w-8 h-8" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            ) : (
              <Github className="w-8 h-8 text-white" />
            )}
          </div>
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-heading font-bold text-white mb-2">Connecting to {oauthProvider === 'google' ? 'Google' : 'GitHub'}</h2>
          <p className="text-sm text-zinc-400">Redirecting to {oauthProvider === 'google' ? 'Google' : 'GitHub'} for authentication...</p>
          <div className="mt-6 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full animate-progress" style={{ width: '60%' }} />
          </div>
        </div>
      );
    }

    if (step === 'oauth_success') {
      return (
        <div className="animate-in fade-in duration-200 text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">Authentication Successful</h2>
          <p className="text-sm text-zinc-400 mb-2">
            Signed in with {oauthProvider === 'google' ? 'Google' : 'GitHub'} as{' '}
            <span className="text-white font-semibold">
              {selectedRole === 'client' ? 'Sarah Jenkins' : 'Alex Vance'}
            </span>
          </p>
          <p className="text-xs text-zinc-500 mb-8">Redirecting to your dashboard...</p>
          <Button onClick={handleOAuthComplete} btn3d size="md" className="w-full">
            Continue to Dashboard
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#121215] border border-zinc-800 rounded-3xl shadow-3d-lg overflow-hidden shadow-emerald-900/10 glossy">
        <div className="absolute top-4 right-4 z-20">
          <button onClick={onClose} className="p-1.5 bg-zinc-900/80 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px]" />
        
        <div className="p-8 relative z-10">
          {/* Logo header */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Hexagon className="w-7 h-7 text-emerald-400 fill-emerald-400/20" />
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">EarnBy<span className="text-emerald-400">Way</span></span>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};
