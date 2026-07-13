'use client';

import Link from 'next/link';

interface UserProfile {
  firstName: string;
  lastName: string;
  avatar: string;
  company: string;
  title: string;
  linkedIn: string;
  website: string;
  dateOfBirth: string;
  hobbies: string[];
  openToReferrals: boolean;
  referralNotes: string;
  idealClients: string[];
}

interface UserSubscription {
  plan: string;
  status: string;
  trialStartDate: string | null;
  trialEndDate: string | null;
  paymentDate: string | null;
  paymentAmount: number;
  paymentTransactionId: string;
  paymentEmail: string;
  paymentSource: string;
  appleTransactionId: string;
  appleOriginalTransactionId: string;
}

interface UserData {
  _id: string;
  phoneNumber: string;
  email: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  profile: UserProfile;
  subscription: UserSubscription;
  additionalPhones: { value: string; label: string; isPrimary: boolean }[];
  additionalEmails: { value: string; label: string; isPrimary: boolean }[];
  expoPushTokens: string[];
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

function getInitials(first: string, last: string): string {
  return [(first || '')[0], (last || '')[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || '?';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number): string {
  if (!amount) return '—';
  return `$${amount.toFixed(2)}`;
}

export default function UserDetailClient({ user }: { user: UserData }) {
  const fullName =
    [user.profile.firstName, user.profile.lastName].filter(Boolean).join(' ') || 'Unknown User';

  const trialDaysRemaining = (() => {
    if (user.subscription.plan !== 'trial' || user.subscription.status !== 'active') return null;
    if (!user.subscription.trialEndDate) return null;
    const end = new Date(user.subscription.trialEndDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  })();

  return (
    <>
      <Link href="/users" className="back-link">
        ← Back to Users
      </Link>

      {/* Hero */}
      <div className="detail-hero">
        <div className="detail-hero-avatar">
          {getInitials(user.profile.firstName, user.profile.lastName)}
        </div>
        <div className="detail-hero-info">
          <h1>{fullName}</h1>
          <div className="detail-hero-meta">
            <span className={`badge plan-${user.subscription.plan}`}>
              {user.subscription.plan}
            </span>
            <span className={`badge status-${user.subscription.status}`}>
              {user.subscription.status}
            </span>
            {trialDaysRemaining !== null && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Contact Info */}
        <div className="detail-card" style={{ animationDelay: '0.05s' }}>
          <h3 className="detail-card-title">📱 Contact Information</h3>
          <div className="detail-row">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{user.phoneNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone Verified</span>
            <span className="detail-value">{user.isPhoneVerified ? '✅ Yes' : '❌ No'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email Verified</span>
            <span className="detail-value">{user.isEmailVerified ? '✅ Yes' : '❌ No'}</span>
          </div>
          {user.additionalPhones.length > 0 && (
            <div className="detail-row">
              <span className="detail-label">Additional Phones</span>
              <span className="detail-value">
                {user.additionalPhones.map((p) => `${p.value} (${p.label})`).join(', ')}
              </span>
            </div>
          )}
          {user.additionalEmails.length > 0 && (
            <div className="detail-row">
              <span className="detail-label">Additional Emails</span>
              <span className="detail-value">
                {user.additionalEmails.map((e) => `${e.value} (${e.label})`).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="detail-card" style={{ animationDelay: '0.1s' }}>
          <h3 className="detail-card-title">👤 Profile Details</h3>
          <div className="detail-row">
            <span className="detail-label">Company</span>
            <span className="detail-value">{user.profile.company || '—'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Title</span>
            <span className="detail-value">{user.profile.title || '—'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">LinkedIn</span>
            <span className="detail-value">
              {user.profile.linkedIn ? (
                <a
                  href={user.profile.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  {user.profile.linkedIn}
                </a>
              ) : (
                '—'
              )}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Website</span>
            <span className="detail-value">
              {user.profile.website ? (
                <a
                  href={user.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  {user.profile.website}
                </a>
              ) : (
                '—'
              )}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date of Birth</span>
            <span className="detail-value">{user.profile.dateOfBirth || '—'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Hobbies</span>
            <span className="detail-value">
              {user.profile.hobbies.length > 0 ? user.profile.hobbies.join(', ') : '—'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Open to Referrals</span>
            <span className="detail-value">{user.profile.openToReferrals ? '✅ Yes' : '❌ No'}</span>
          </div>
          {user.profile.idealClients.length > 0 && (
            <div className="detail-row">
              <span className="detail-label">Ideal Clients</span>
              <span className="detail-value">{user.profile.idealClients.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Subscription */}
        <div className="detail-card" style={{ animationDelay: '0.15s' }}>
          <h3 className="detail-card-title">💎 Subscription</h3>
          <div className="detail-row">
            <span className="detail-label">Plan</span>
            <span className="detail-value">
              <span className={`badge plan-${user.subscription.plan}`}>
                {user.subscription.plan}
              </span>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-value">
              <span className={`badge status-${user.subscription.status}`}>
                {user.subscription.status}
              </span>
            </span>
          </div>
          {user.subscription.trialStartDate && (
            <div className="detail-row">
              <span className="detail-label">Trial Start</span>
              <span className="detail-value">{formatDate(user.subscription.trialStartDate)}</span>
            </div>
          )}
          {user.subscription.trialEndDate && (
            <div className="detail-row">
              <span className="detail-label">Trial End</span>
              <span className="detail-value">{formatDate(user.subscription.trialEndDate)}</span>
            </div>
          )}
          {trialDaysRemaining !== null && (
            <div className="detail-row">
              <span className="detail-label">Days Remaining</span>
              <span className="detail-value" style={{ color: trialDaysRemaining <= 3 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="detail-card" style={{ animationDelay: '0.2s' }}>
          <h3 className="detail-card-title">💳 Payment Details</h3>
          <div className="detail-row">
            <span className="detail-label">Source</span>
            <span className="detail-value" style={{ textTransform: 'capitalize' }}>
              {user.subscription.paymentSource || '—'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Amount</span>
            <span className="detail-value">{formatCurrency(user.subscription.paymentAmount)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Payment Date</span>
            <span className="detail-value">{formatDate(user.subscription.paymentDate)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Payment Email</span>
            <span className="detail-value">{user.subscription.paymentEmail || '—'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Transaction ID</span>
            <span className="detail-value" style={{ fontSize: 11 }}>
              {user.subscription.paymentTransactionId || '—'}
            </span>
          </div>
          {user.subscription.appleTransactionId && (
            <div className="detail-row">
              <span className="detail-label">Apple Transaction</span>
              <span className="detail-value" style={{ fontSize: 11 }}>
                {user.subscription.appleTransactionId}
              </span>
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="detail-card full-width" style={{ animationDelay: '0.25s' }}>
          <h3 className="detail-card-title">⚙️ System Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
            <div className="detail-row">
              <span className="detail-label">User ID</span>
              <span className="detail-value" style={{ fontSize: 11 }}>{user._id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Last Login</span>
              <span className="detail-value">{formatDate(user.lastLogin)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Created</span>
              <span className="detail-value">{formatDate(user.createdAt)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Updated</span>
              <span className="detail-value">{formatDate(user.updatedAt)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Push Tokens</span>
              <span className="detail-value">{user.expoPushTokens.length} registered</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
