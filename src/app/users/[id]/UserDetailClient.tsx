'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sidebar, MobileNav } from '@/components/Navigation';
import {
  ArrowLeft2,
  TickCircle,
  CloseCircle,
  Wallet,
  Profile2User,
  Calendar,
  FingerScan,
  Sms,
  Call,
  Link as LinkIcon,
  Award,
  Category,
  Notification,
  DocumentCopy,
  DirectInbox,
  DeviceMessage,
  Personalcard,
  Security
} from 'iconsax-react';

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
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => setToast(msg);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast(`${label} copied!`);
  };

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
    <div className="min-h-screen bg-[#EDE9E1] text-[#1E2A26] antialiased selection:bg-[#6B8F7E]/20 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-3 lg:px-6 py-4 lg:py-6 flex gap-5 min-w-0 min-h-screen">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col">
          {/* Header */}
          <header className="flex items-center gap-4 mb-6 pt-2 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <Link
              href="/users"
              className="w-10 h-10 rounded-full bg-white shadow-sm border border-white/60 flex items-center justify-center text-[#1E2A26] hover:bg-[#F2ECE4] transition-all duration-300 active:scale-95 shrink-0"
            >
              <ArrowLeft2 variant="Linear" size={16} color="currentColor" />
            </Link>
            <div>
              <div className="text-[12px] font-bold text-[#9AA9A1] uppercase tracking-wider">
                User Directory
              </div>
              <h1 className="text-[26px] lg:text-[30px] font-bold tracking-tight mt-0.5 leading-none">
                User Details
              </h1>
            </div>
          </header>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-5 min-w-0 items-start">
            
            {/* Left Column: Hero & Actions */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
              
              {/* Profile Card */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-white/60 flex flex-col items-center text-center hover-card-premium">
                <div className="w-[110px] h-[110px] rounded-full bg-[#F5EEE0] flex items-center justify-center text-[44px] font-bold border border-[#EDE6D8] shadow-inner text-[#5A6E64] transition-transform duration-500 hover:scale-105 hover:rotate-6">
                  {getInitials(user.profile.firstName, user.profile.lastName)}
                </div>
                <h2 className="mt-5 text-[22px] font-bold tracking-tight text-[#1E2A26]">
                  {fullName}
                </h2>
                <p className="text-[13.5px] text-[#9AA9A1] font-medium mt-1">
                  {user.profile.title ? `${user.profile.title}` : 'No title'} 
                  {user.profile.company ? ` at ${user.profile.company}` : ''}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <span className={`text-[11.5px] font-bold px-3 py-1 rounded-full border tracking-wide uppercase ${
                    user.subscription.plan === 'lifetime'
                      ? 'bg-[#E6F0E8] text-[#4E8A64] border-[#D7E6DA]'
                      : user.subscription.plan === 'trial'
                      ? 'bg-[#FCF5E3] text-[#A68742] border-[#F2E6C4]'
                      : 'bg-[#F2F2F0] text-[#7A8881] border-[#E5E5E2]'
                  }`}>
                    {user.subscription.plan}
                  </span>
                  <span className={`text-[11.5px] font-bold px-3 py-1 rounded-full border tracking-wide uppercase ${
                    user.subscription.status === 'active'
                      ? 'bg-[#E6F0E8] text-[#4E8A64] border-[#D7E6DA]'
                      : 'bg-[#FDE8E8] text-[#C86A6A] border-[#FAD2D2]'
                  }`}>
                    {user.subscription.status}
                  </span>
                </div>

                {trialDaysRemaining !== null && (
                  <div className="mt-3.5 text-[12px] font-semibold text-[#A68742] bg-[#FCF5E3] px-3.5 py-1.5 rounded-full border border-[#F2E6C4] animate-pulse">
                    ⏳ {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining
                  </div>
                )}

                <div className="mt-6 w-full border-t border-[#F2EEE8] pt-5 space-y-3.5 text-left">
                  <div className="flex items-center justify-between text-[13px] group/item">
                    <span className="text-[#9AA9A1] font-medium flex items-center gap-2">
                      <Sms size={15} variant="Linear" /> Email
                    </span>
                    <span className="text-[#1E2A26] font-semibold flex items-center gap-1.5 truncate max-w-[200px]">
                      <span className="truncate" title={user.email}>{user.email}</span>
                      <button 
                        onClick={() => handleCopy(user.email, 'Email')}
                        className="opacity-0 group-hover/item:opacity-100 hover:text-[#6B8F7E] transition-opacity duration-200"
                      >
                        <DocumentCopy size={13} />
                      </button>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] group/item">
                    <span className="text-[#9AA9A1] font-medium flex items-center gap-2">
                      <Call size={15} variant="Linear" /> Phone
                    </span>
                    <span className="text-[#1E2A26] font-semibold flex items-center gap-1.5">
                      <span>{user.phoneNumber || '—'}</span>
                      {user.phoneNumber && (
                        <button 
                          onClick={() => handleCopy(user.phoneNumber, 'Phone')}
                          className="opacity-0 group-hover/item:opacity-100 hover:text-[#6B8F7E] transition-opacity duration-200"
                        >
                          <DocumentCopy size={13} />
                        </button>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-white/60 hover-card-premium">
                <h3 className="text-[15px] font-bold text-[#1E2A26] mb-4">Quick Actions</h3>
                <div className="flex flex-col gap-2.5">
                  <a
                    href={`mailto:${user.email}`}
                    className="w-full h-11 rounded-[12px] border border-[#E3EAE6] flex items-center justify-center gap-2 text-[13.5px] font-semibold text-[#1E2A26] hover:bg-[#F5F7F6] transition-all duration-300"
                  >
                    <Sms size={16} /> Send Email
                  </a>
                  {user.phoneNumber && (
                    <a
                      href={`tel:${user.phoneNumber}`}
                      className="w-full h-11 rounded-[12px] border border-[#E3EAE6] flex items-center justify-center gap-2 text-[13.5px] font-semibold text-[#1E2A26] hover:bg-[#F5F7F6] transition-all duration-300"
                    >
                      <Call size={16} /> Call Phone
                    </a>
                  )}
                  <button
                    onClick={() => showToast('Push notification triggered')}
                    className="w-full h-11 rounded-[12px] bg-[#6D8F7E] hover:bg-[#5E7F6F] text-white text-[13.5px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Notification size={16} /> Send Push Test
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Info Cards */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
              
              {/* Profile details */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-white/60 hover-card-premium animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3 border-b border-[#F2EEE8] pb-4 mb-5">
                  <div className="w-9 h-9 rounded-full bg-[#EAF3EA] flex items-center justify-center text-[#5A7D6E]">
                    <Personalcard variant="Linear" size={18} color="#5A7D6E" />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#1E2A26]">Profile Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Company</span>
                    <span className="text-[14px] font-semibold mt-1 text-[#1E2A26]">{user.profile.company || '—'}</span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Job Title</span>
                    <span className="text-[14px] font-semibold mt-1 text-[#1E2A26]">{user.profile.title || '—'}</span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">LinkedIn</span>
                    <span className="text-[14px] font-semibold mt-1 text-[#6B8F7E] truncate">
                      {user.profile.linkedIn ? (
                        <a
                          href={user.profile.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 shrink-0"
                        >
                          <LinkIcon size={14} /> Open LinkedIn
                        </a>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Website</span>
                    <span className="text-[14px] font-semibold mt-1 text-[#6B8F7E] truncate">
                      {user.profile.website ? (
                        <a
                          href={user.profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 shrink-0"
                        >
                          <LinkIcon size={14} /> Visit Website
                        </a>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Date of Birth</span>
                    <span className="text-[14px] font-semibold mt-1 text-[#1E2A26]">{user.profile.dateOfBirth || '—'}</span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Open to Referrals</span>
                    <span className="text-[14px] font-semibold mt-1 text-[#1E2A26] flex items-center gap-1.5">
                      {user.profile.openToReferrals ? (
                        <>
                          <TickCircle size={16} variant="Bold" className="text-[#4E8A64]" /> Yes
                        </>
                      ) : (
                        <>
                          <CloseCircle size={16} variant="Bold" className="text-[#C86A6A]" /> No
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col col-span-1 md:col-span-2 py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Hobbies</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {user.profile.hobbies && user.profile.hobbies.length > 0 ? (
                        user.profile.hobbies.map((h, i) => (
                          <span key={i} className="text-[12px] font-medium bg-[#F2EDE4] px-2.5 py-1 rounded-full text-[#5A6E64] border border-[#E5DEC4]/40">
                            {h}
                          </span>
                        ))
                      ) : (
                        <span className="text-[13px] font-semibold text-[#9AA9A1]">No hobbies listed</span>
                      )}
                    </div>
                  </div>
                  {user.profile.idealClients && user.profile.idealClients.length > 0 && (
                    <div className="flex flex-col col-span-1 md:col-span-2 py-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Ideal Clients</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {user.profile.idealClients.map((c, i) => (
                          <span key={i} className="text-[12px] font-medium bg-[#E6F0E8] px-2.5 py-1 rounded-full text-[#4E8A64] border border-[#D7E6DA]/50">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscriptions & Payments */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-white/60 hover-card-premium animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="flex items-center gap-3 border-b border-[#F2EEE8] pb-4 mb-5">
                  <div className="w-9 h-9 rounded-full bg-[#FCF5E3] flex items-center justify-center text-[#A68742]">
                    <Wallet variant="Linear" size={18} color="#A68742" />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#1E2A26]">Subscriptions & Billing</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Payment Source</span>
                    <span className="text-[14px] font-semibold mt-1 text-[#1E2A26] capitalize">{user.subscription.paymentSource || 'None'}</span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Amount Billed</span>
                    <span className="text-[14px] font-bold mt-1 text-[#5A7D6E]">{formatCurrency(user.subscription.paymentAmount)}</span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Last Payment Date</span>
                    <span className="text-[14px] font-semibold mt-1 text-[#1E2A26]">{formatDate(user.subscription.paymentDate)}</span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Payment Email</span>
                    <span className="text-[14px] font-semibold mt-1 text-[#1E2A26] truncate" title={user.subscription.paymentEmail || undefined}>
                      {user.subscription.paymentEmail || '—'}
                    </span>
                  </div>
                  {user.subscription.trialStartDate && (
                    <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Trial Start Date</span>
                      <span className="text-[14px] font-semibold mt-1 text-[#1E2A26]">{formatDate(user.subscription.trialStartDate)}</span>
                    </div>
                  )}
                  {user.subscription.trialEndDate && (
                    <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Trial End Date</span>
                      <span className="text-[14px] font-semibold mt-1 text-[#1E2A26]">{formatDate(user.subscription.trialEndDate)}</span>
                    </div>
                  )}
                  <div className="flex flex-col col-span-1 md:col-span-2 py-1.5 border-b border-[#F8F6F2] group/tx">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Stripe / Source Transaction ID</span>
                    <span className="text-[13px] font-mono mt-1 text-[#1E2A26] flex items-center gap-1.5">
                      <span className="truncate">{user.subscription.paymentTransactionId || '—'}</span>
                      {user.subscription.paymentTransactionId && (
                        <button 
                          onClick={() => handleCopy(user.subscription.paymentTransactionId, 'Transaction ID')}
                          className="opacity-0 group-hover/tx:opacity-100 hover:text-[#6B8F7E] transition-opacity duration-200 shrink-0"
                        >
                          <DocumentCopy size={13} />
                        </button>
                      )}
                    </span>
                  </div>
                  {user.subscription.appleTransactionId && (
                    <div className="flex flex-col col-span-1 md:col-span-2 py-1.5 group/apple">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Apple Transaction ID</span>
                      <span className="text-[13px] font-mono mt-1 text-[#1E2A26] flex items-center gap-1.5">
                        <span className="truncate">{user.subscription.appleTransactionId}</span>
                        <button 
                          onClick={() => handleCopy(user.subscription.appleTransactionId, 'Apple Transaction ID')}
                          className="opacity-0 group-hover/apple:opacity-100 hover:text-[#6B8F7E] transition-opacity duration-200 shrink-0"
                        >
                          <DocumentCopy size={13} />
                        </button>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* System details */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-white/60 hover-card-premium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-3 border-b border-[#F2EEE8] pb-4 mb-5">
                  <div className="w-9 h-9 rounded-full bg-[#EAE8FE] flex items-center justify-center text-[#6B5AE0]">
                    <FingerScan variant="Linear" size={18} color="#6B5AE0" />
                  </div>
                  <div className="text-[17px] font-bold text-[#1E2A26]">System Diagnostics</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2] group/uid">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Account ID</span>
                    <span className="text-[13px] font-mono mt-1 text-[#1E2A26] flex items-center gap-1.5">
                      <span className="truncate">{user._id}</span>
                      <button 
                        onClick={() => handleCopy(user._id, 'User ID')}
                        className="opacity-0 group-hover/uid:opacity-100 hover:text-[#6B8F7E] transition-opacity duration-200 shrink-0"
                      >
                        <DocumentCopy size={13} />
                      </button>
                    </span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Last Login Session</span>
                    <span className="text-[13px] font-semibold mt-1 text-[#1E2A26]">{formatDate(user.lastLogin)}</span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Registration Date</span>
                    <span className="text-[13px] font-semibold mt-1 text-[#1E2A26]">{formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex flex-col py-1.5 border-b border-[#F8F6F2]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1]">Last Account Update</span>
                    <span className="text-[13px] font-semibold mt-1 text-[#1E2A26]">{formatDate(user.updatedAt)}</span>
                  </div>
                  <div className="flex flex-col col-span-1 md:col-span-2 py-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA9A1] flex items-center gap-1">
                      <Security size={14} /> Registered Push Device Tokens ({user.expoPushTokens.length})
                    </span>
                    <div className="mt-2.5 space-y-1.5">
                      {user.expoPushTokens && user.expoPushTokens.length > 0 ? (
                        user.expoPushTokens.map((t, i) => (
                          <div key={i} className="text-[11.5px] font-mono bg-[#FAF8F5] p-2.5 rounded-[10px] border border-[#F0EDE8] text-[#5A6E64] flex items-center justify-between group/token">
                            <span className="truncate">{t}</span>
                            <button 
                              onClick={() => handleCopy(t, 'Push Token')}
                              className="opacity-0 group-hover/token:opacity-100 hover:text-[#6B8F7E] transition-opacity duration-200 px-1 shrink-0"
                            >
                              <DocumentCopy size={13} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-[12.5px] text-[#9AA9A1] font-semibold bg-[#F7F6F3] p-3 rounded-[12px] border border-[#EFECE6] text-center w-full">
                          No push tokens registered on this account
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div className="h-20 lg:h-6" />
        </main>
      </div>

      <MobileNav />

      {toast && (
        <div className="fixed bottom-[88px] lg:bottom-6 left-1/2 -translate-x-1/2 bg-[#1E2A26] text-white text-[13px] font-medium px-4 py-2.5 rounded-full shadow-xl z-50 animate-[fadeIn_0.2s_ease]">
          {toast}
        </div>
      )}
    </div>
  );
}
