import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hexagon, X, Mail, Lock, ShieldCheck, Github, Smartphone, Loader2, CheckCircle, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { signIn, loginUser, registerUser, usingBackend } = useApp();
  const [step, setStep] = useState<'login' | 'signup_role' | 'otp' | 'oauth_connecting' | 'oauth_success'>('login');
  const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer' | null>(null);
  const [oauthProvider, setOauthProvider] = useState<'google' | 'github' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [useDifferentAccount, setUseDifferentAccount] = useState(false);

  if (!isOpen) return null;

  const handleMockLogin = async (role: 'client' | 'freelancer') => {
    if (usingBackend) {
      try {
        setError('');
        await registerUser(name || (role === 'client' ? 'Sarah Jenkins' : 'Alex Vance'), email, role);
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
      } catch (err: any) {
        setError(err.message || 'Registration failed.');
      }
    } else {
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
    }
  };

  const handleSignIn = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 4) {
      setError('Please enter your password (min 4 characters).');
      return;
    }
    setError('');

    if (usingBackend) {
      try {
        await loginUser(email, password);
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
      } catch (err: any) {
        setError(err.message || 'Invalid email or password.');
      }
    } else {
      handleMockLogin('client');
    }
  };

  const handleSignUpClick = () => {
    if (!selectedRole) {
      setError('Please select your role first.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Please enter your full name (min 2 characters).');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleOAuthStart = (provider: 'google' | 'github', role: 'client' | 'freelancer') => {
    setOauthProvider(provider);
    setSelectedRole(role);
    setError('');
    setName('');
    setEmail('');
    setUseDifferentAccount(false);
    setStep('oauth_connecting');
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
              icon={<UserIcon className="w-4 h-4" />}
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
            <Input
              label="Password"
              icon={<Lock className="w-4 h-4" />}
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </div>

          <Button
            disabled={!selectedRole}
            onClick={handleSignUpClick}
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
      const handleAccountSelect = (selectedName: string, selectedEmail: string) => {
        if (!selectedRole) {
          setError('Please select your role first.');
          return;
        }
        setName(selectedName);
        setEmail(selectedEmail);
        setError('');
        setStep('oauth_success');
      };

      return (
        <div className="animate-in fade-in duration-200">
          {!useDifferentAccount ? (
            <div className="space-y-5">
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3">
                  {oauthProvider === 'google' ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  ) : (
                    <Github className="w-5 h-5 text-white" />
                  )}
                </div>
                <h2 className="text-lg font-heading font-bold text-white mb-1">
                  Choose an account
                </h2>
                <p className="text-xs text-zinc-400">to continue to EarnByWay</p>
              </div>

              {/* Role Select in Chooser */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 mb-1.5 block uppercase tracking-wider text-center">Join Platform As</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => { setSelectedRole('client'); setError(''); }}
                    variant={selectedRole === 'client' ? 'primary' : 'secondary'}
                    size="sm"
                    className="!py-2"
                  >
                    Client
                  </Button>
                  <Button
                    onClick={() => { setSelectedRole('freelancer'); setError(''); }}
                    variant={selectedRole === 'freelancer' ? 'primary' : 'secondary'}
                    size="sm"
                    className="!py-2"
                  >
                    Freelancer
                  </Button>
                </div>
              </div>

              {error && (
                <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-1.5 text-center">
                  {error}
                </p>
              )}

              {/* Account list */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 pt-1">
                <button
                  onClick={() => handleAccountSelect('Latiyan15', 'shahilch15@gmail.com')}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      L
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">Latiyan15</p>
                      <p className="text-[10px] text-zinc-500">shahilch15@gmail.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-all">Sign In</span>
                </button>

                <button
                  onClick={() => { setUseDifferentAccount(true); setError(''); }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/10 border border-zinc-800/40 hover:bg-zinc-900 hover:border-zinc-700 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-300">Use another account</p>
                    <p className="text-[10px] text-zinc-500">Sign in with a different email</p>
                  </div>
                </button>
              </div>

              <p className="text-[10px] text-zinc-600 text-center">
                To continue, Google will share your name, email address, language preference, and profile picture with EarnByWay.
              </p>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
                  {oauthProvider === 'google' ? (
                    <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  ) : (
                    <Github className="w-6 h-6 text-white" />
                  )}
                </div>
                <h2 className="text-xl font-heading font-bold text-white mb-2">
                  Enter Social Credentials
                </h2>
                <p className="text-xs text-zinc-400">Connect using any custom name and email address.</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  icon={<UserIcon className="w-4 h-4" />}
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  icon={<Mail className="w-4 h-4" />}
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Select Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => { setSelectedRole('client'); setError(''); }}
                      variant={selectedRole === 'client' ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      Client
                    </Button>
                    <Button
                      onClick={() => { setSelectedRole('freelancer'); setError(''); }}
                      variant={selectedRole === 'freelancer' ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      Freelancer
                    </Button>
                  </div>
                </div>

                {error && (
                  <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    onClick={() => { setUseDifferentAccount(false); setError(''); }}
                    variant="secondary"
                    size="md"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (!name.trim() || !email.includes('@') || !selectedRole) {
                        setError('Please fill in all fields correctly.');
                        return;
                      }
                      setError('');
                      setStep('oauth_success');
                    }}
                    btn3d
                    size="md"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}
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
              {name || (selectedRole === 'client' ? 'Sarah Jenkins' : 'Alex Vance')}
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
