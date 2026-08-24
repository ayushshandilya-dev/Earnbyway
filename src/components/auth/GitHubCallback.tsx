import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Loader2, CheckCircle, AlertTriangle, Hexagon } from 'lucide-react';
import { Button } from '../ui/Button';

export const GitHubCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { registerUser, usingBackend } = useApp();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // role passed as state
    const role = (state === 'freelancer' ? 'freelancer' : 'client') as 'client' | 'freelancer';

    if (!code) {
      setStatus('error');
      setErrorMsg('No authorization code received from GitHub.');
      return;
    }

    const exchangeCode = async () => {
      try {
        if (usingBackend) {
          // Send code to backend to exchange for user info
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
          const res = await fetch(`${apiUrl}/auth/github`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, role })
          });
          
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'GitHub authentication failed on the server.');
          }

          const data = await res.json();
          // The backend returns user + token, store token and register
          if (data.token) {
            localStorage.setItem('earnbyway_token', data.token);
            localStorage.setItem('earnbyway_access_token', data.token);
          }
          
          // Use registerUser which handles setting current user
          await registerUser(data.user?.name || 'GitHub User', data.user?.email || '', role, 'github_oauth_bypass');
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          // Non-backend mode: just register with the code info
          await registerUser('GitHub User', `github_${code.substring(0, 8)}@earnbyway.dev`, role, 'github_oauth_bypass');
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } catch (err: any) {
        console.error('GitHub OAuth exchange failed:', err);
        setStatus('error');
        setErrorMsg(err.message || 'Failed to authenticate with GitHub.');
      }
    };

    exchangeCode();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Hexagon className="w-7 h-7 text-emerald-400 fill-emerald-400/20" />
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white">EarnBy<span className="text-emerald-400">Way</span></span>
          </div>
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
            <h2 className="text-xl font-heading font-bold text-white">Authenticating with GitHub...</h2>
            <p className="text-sm text-zinc-400">Please wait while we verify your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-heading font-bold text-white">Authentication Successful!</h2>
            <p className="text-sm text-zinc-400">Redirecting to your dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-heading font-bold text-white">Authentication Failed</h2>
            <p className="text-sm text-red-400">{errorMsg}</p>
            <Button onClick={() => navigate('/')} btn3d size="md" className="mt-4">
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
