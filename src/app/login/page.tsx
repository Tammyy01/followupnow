'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split">
      {/* Left Panel — Form */}
      <div className="login-left">
        <div className="login-left-inner">
          <div className="login-greeting">
            <h1>Hello, <strong>Welcome Back!</strong></h1>
            <p>We&apos;re happy to see you again. Let&apos;s Stay ahead of the game.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="sadeghsadegi1999@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <div className="login-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                </button>
              </div>
            </div>

            <a href="#" className="login-forgot-password">Forgot Password?</a>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <span className="login-btn-loading">
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Signing in...
                </span>
              ) : (
                'LOGIN'
              )}
            </button>

            <div className="login-signup">
              Don&apos;t have an account? <a href="#">Sign up for free</a>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel — Hero */}
      <div className="login-right">
        <div className="login-right-overlay" />
        <div className="login-right-content">
          <div className="login-right-logo">
            <div className="login-right-logo-icon">F</div>
            <span className="login-right-logo-text">FOLLOWUP NOW.</span>
          </div>
          <blockquote className="login-right-quote">
            &ldquo;FOLLOWUP NOW HAS COMPLETELY TRANSFORMED HOW I MANAGE MY PROFESSIONAL RELATIONSHIPS. THE AUTOMATED FOLLOW-UPS AND SMART REMINDERS ENSURE I NEVER MISS AN OPPORTUNITY TO CONNECT.&rdquo;
          </blockquote>
          <div className="login-right-dots">
            <span className="login-dot active" />
            <span className="login-dot" />
            <span className="login-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
