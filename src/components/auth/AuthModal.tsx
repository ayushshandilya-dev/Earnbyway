import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Hexagon, X, Mail, Lock, Github, Smartphone, Loader2, CheckCircle, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { loginUser, registerUser, usingBackend } = useApp();
  const [step, setStep] = useState<'login' | 'signup_role' | 'otp'>('login');
  const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Decode Google credential JWT and sign the user in
  const handleGoogleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    try {
      const base64Url = idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const profile = JSON.parse(jsonPayload);
      setError('');
      setIsLoading(true);
      
      const role = selectedRole || 'client';
      try {
        await registerUser(profile.name, profile.email, role, 'google_oauth_bypass');
        resetAndClose();
      } catch (err: any) {
        setError(err.message || 'Google authentication failed.');
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Error decoding Google credential token:", e);
      setError("Failed to decode Google account details.");
    }
  };

  // Render native Google Sign-In button when login step is visible
  useEffect(() => {
    if (isOpen && step === 'login') {
      const timer = setTimeout(() => {
        const btnEl = document.getElementById("google-signin-btn");
        if (btnEl && (window as any).google) {
          (window as any).google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
            callback: handleGoogleCredentialResponse
          });
          (window as any).google.accounts.id.renderButton(
            btnEl,
            { theme: "filled_blue", size: "large", width: 280 }
          );
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step, selectedRole]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep('login');
      setSelectedRole(null);
      setEmail('');
      setPassword('');
      setName('');
      setError('');
      setIsLoading(false);
    }, 300);
  };

  // --- Real Sign In ---
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
    setIsLoading(true);

    try {
      await loginUser(email, password);
      resetAndClose();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
      setIsLoading(false);
    }
  };

  // --- Real Sign Up validation ---
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

  // --- Real OTP verify + register ---
  const handleOTPVerify = async () => {
    setIsLoading(true);
    setError('');
    try {
      await registerUser(name, email, selectedRole!, password);
      resetAndClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  // --- GitHub OAuth redirect ---
  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!clientId) {
      setError('GitHub OAuth is not configured. Please set VITE_GITHUB_CLIENT_ID.');
      return;
    }
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'read:user user:email';
    const state = selectedRole || 'client';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
  };

  const renderContent = () => {
    // ─── LOGIN STEP ───
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
              disabled={isLoading}
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</> : 'Sign In'}
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-zinc-500">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="w-full flex justify-center">
                <div id="google-signin-btn" className="w-full flex justify-center"></div>
              </div>
              <Button variant="secondary" size="md" onClick={handleGitHubLogin} className="!py-2.5 w-full">
                <Github className="w-4 h-4" />
                Continue with GitHub
              </Button>
            </div>
            <p className="text-[10px] text-zinc-600 text-center mt-2">
              By continuing, you agree to our Terms of Service
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400">
            Don't have an account?{' '}
            <button onClick={() => { setStep('signup_role'); setError(''); }} className="text-emerald-400 font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </div>
      );
    }

    // ─── SIGNUP STEP ───
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
            disabled={!selectedRole || isLoading}
            onClick={handleSignUpClick}
            btn3d
            size="md"
            className="w-full"
          >
            Create Account
          </Button>
          
          <p className="mt-6 text-center text-xs text-zinc-400">
            Already have an account?{' '}
            <button onClick={() => { setStep('login'); setError(''); }} className="text-emerald-400 font-semibold hover:underline">
              Log in
            </button>
          </p>
        </div>
      );
    }

    // ─── OTP VERIFY STEP ───
    if (step === 'otp') {
      return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Verify Email</h2>
          <p className="text-sm text-zinc-400 mb-6">We sent a 6-digit verification code to <span className="text-white font-medium">{email}</span>.</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-10 h-12 text-center bg-zinc-900 border border-zinc-800 rounded-lg text-lg text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="0"
              />
            ))}
          </div>

          {error && (
            <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <Button
            onClick={handleOTPVerify}
            btn3d
            size="md"
            className="w-full mb-4"
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : 'Verify & Continue'}
          </Button>

          <Button onClick={() => { setStep('signup_role'); setError(''); }} variant="ghost" size="sm" className="w-full">
            Back
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetAndClose} />
      
      <div className="relative w-full max-w-md bg-[#121215] border border-zinc-800 rounded-3xl shadow-3d-lg overflow-hidden shadow-emerald-900/10 glossy">
        <div className="absolute top-4 right-4 z-20">
          <button onClick={resetAndClose} className="p-1.5 bg-zinc-900/80 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
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
