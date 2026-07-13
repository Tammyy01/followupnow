'use client';
import { Sidebar, MobileNav } from '@/components/Navigation';

import { useEffect, useState } from 'react';
import {
  Element4,
  Wallet,
  ChartSquare,
  DocumentText,
  Profile2User,
  Calendar,
  Setting2,
  Logout,
  SearchNormal,
  Message2,
  NotificationBing,
  ArrowUp3,
  TickCircle,
  ArrowDown2,
  Money4,
  FingerScan,
} from 'iconsax-react';

export interface DashboardData {
  totalUsers: number;
  lifetimeCount: number;
  trialActiveCount: number;
  trialExpiredCount: number;
  noPlanCount: number;
  signupsLast7d: number;
  signupsLast30d: number;
  stripeCount: number;
  appleCount: number;
  manualCount: number;
  signupsByDay: { label: string; count: number }[];
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    plan: string;
    status: string;
    createdAt: string;
  }[];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1200; // 1.2 seconds for a smooth rise
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
}

function SunIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-slow-rotate">
      <circle cx="12" cy="12" r="3.2" fill="white" />
      {Array.from({ length: 12 }).map((_, t) => {
        const n = (t * 30 * Math.PI) / 180;
        const r = Number((12 + Math.cos(n) * 5.2).toFixed(2));
        const l = Number((12 + Math.sin(n) * 5.2).toFixed(2));
        const i = Number((12 + Math.cos(n) * 8.6).toFixed(2));
        const o = Number((12 + Math.sin(n) * 8.6).toFixed(2));
        return (
          <line
            key={t}
            x1={r}
            y1={l}
            x2={i}
            y2={o}
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.95"
          />
        );
      })}
    </svg>
  );
}

function Sparkline({ className = '' }: { className?: string }) {
  const [offset, setOffset] = useState(100);
  useEffect(() => {
    const t = setTimeout(() => setOffset(0), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <svg width="36" height="14" viewBox="0 0 36 14" fill="none" className={className}>
      <path
        d="M0 9 Q 6 2, 12 7 T 24 6 T 36 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1)"
        style={{
          strokeDasharray: 100,
          strokeDashoffset: offset
        }}
      />
    </svg>
  );
}

function BalanceChart() {
  const [chartOffset, setChartOffset] = useState(1000);
  const [fillOpacity, setFillOpacity] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setChartOffset(0), 150);
    const timer2 = setTimeout(() => setFillOpacity(1), 1000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full h-[132px] rounded-[14px] bg-[#FAF8F5]/60 border border-[#F0EDE8] overflow-hidden relative">
      <svg viewBox="0 0 320 120" className="w-full h-full">
        <defs>
          <linearGradient id="balanceGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7A9B8A" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7A9B8A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 78 C 18 62, 32 92, 56 74 C 76 60, 92 28, 118 36 C 142 43, 160 86, 188 78 C 216 70, 234 22, 266 34 C 288 42, 304 58, 320 54 L320 120 L0 120 Z"
          fill="url(#balanceGrad)"
          className="transition-opacity duration-1000 ease-out"
          style={{ opacity: fillOpacity }}
        />
        <path
          d="M0 78 C 18 62, 32 92, 56 74 C 76 60, 92 28, 118 36 C 142 43, 160 86, 188 78 C 216 70, 234 22, 266 34 C 288 42, 304 58, 320 54"
          fill="none"
          stroke="#7A9B8A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-[2000ms]"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: chartOffset,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        <circle 
          cx="118" 
          cy="36" 
          r="4" 
          fill="#6B8F7E" 
          stroke="white" 
          strokeWidth="2" 
          className="transition-opacity duration-700 ease-out"
          style={{ opacity: fillOpacity }}
        />
        <circle 
          cx="266" 
          cy="34" 
          r="4" 
          fill="#6B8F7E" 
          stroke="white" 
          strokeWidth="2" 
          className="transition-opacity duration-700 ease-out"
          style={{ opacity: fillOpacity }}
        />
      </svg>
    </div>
  );
}

function Gauge({ percent = 80 }: { percent?: number }) {
  const PI = Math.PI;
  const start = PI;
  const end = 0;
  
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const duration = 1500; // 1.5s
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(easeProgress * percent);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(update);
    }, 300);
    return () => clearTimeout(timer);
  }, [percent]);

  const progress = animatedPercent / 100;
  const current = start + (end - start) * progress;

  const arc = (v: number, m: number) => {
    const k = 90 + 78 * Math.cos(v);
    const S = 90 + 78 * Math.sin(v);
    const E = 90 + 78 * Math.cos(m);
    const D = 90 + 78 * Math.sin(m);
    const largeArc = m - v > Math.PI ? 1 : 0;
    return `M ${k} ${S} A 78 78 0 ${largeArc} 1 ${E} ${D}`;
  };

  const handleX = 90 + 66 * Math.cos(current);
  const handleY = 90 + 66 * Math.sin(current);

  return (
    <svg viewBox="0 0 180 110" className="w-full h-[110px] overflow-visible">
      <path d={arc(start, end)} fill="none" stroke="#E9EFEA" strokeWidth="14" strokeLinecap="round" />
      <path d={arc(start, current)} fill="none" stroke="#7A9B8A" strokeWidth="14" strokeLinecap="round" />
      <circle cx="90" cy="90" r="20" fill="white" stroke="#E7ECE8" strokeWidth="1.2" />
      <circle cx={handleX} cy={handleY} r="5" fill="white" stroke="#7A9B8A" strokeWidth="2" />
      <text x="90" y="95" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1E2A26">
        {Math.round(animatedPercent)}%
      </text>
    </svg>
  );
}function AnimatedDecimalNumber({ value, decimals = 1 }: { value: number; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const end = value;
    const duration = 1200;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(easeProgress * end);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  return <>{displayValue.toFixed(decimals)}</>;
}

function AnimatedBars() {
  const heights = [44, 28, 36, 22, 14];
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-auto pt-6 flex items-end gap-[5px] h-[52px]">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-[6px] transition-all duration-[1000ms]"
          style={{
            height: active ? `${h}px` : '4px',
            background: i === 0 ? '#6B8F7E' : '#D9E3DD',
            transitionDelay: `${i * 80}ms`,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      ))}
    </div>
  );
}

export default function DashboardClient({ data }: { data: DashboardData }) {
  const [period, setPeriod] = useState('Monthly');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => setToast(msg);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#EDE9E1] text-[#1E2A26] antialiased selection:bg-[#6B8F7E]/20 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-3 lg:px-6 py-4 lg:py-6 flex gap-5 min-w-0">
        <Sidebar />

        <main className="flex-1 min-w-0">
          {/* Header */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 min-w-0 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#6B8F7E] flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 hover:rotate-12">
                <SunIcon />
              </div>
              <div>
                <h1 className="text-[28px] leading-none font-bold tracking-[-0.02em]">
                  Hello, Admin!
                </h1>
                <p className="text-[13.5px] text-[#8A9890] mt-1.5 font-medium">
                  Explore information and activity about your property
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto min-w-0">
              <div className="flex-1 lg:w-[320px] h-[44px] bg-white rounded-full flex items-center px-2 shadow-sm border border-white/70 min-w-0 transition-all duration-300 focus-within:shadow-md focus-within:border-[#6B8F7E]/40">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#A8B5AF] px-4 min-w-0"
                />
                <button
                  onClick={() => showToast(`Search: ${search || 'all'}`)}
                  className="w-8 h-8 rounded-full bg-[#11181C] text-white flex items-center justify-center shrink-0 transition-transform duration-200 active:scale-95"
                >
                  <SearchNormal variant="Linear" size={14} color="#fff" />
                </button>
              </div>
              <button
                onClick={() => showToast('Messages')}
                className="w-11 h-11 rounded-full bg-white shadow-sm border border-white/70 flex items-center justify-center relative shrink-0 transition-all duration-300 hover:shadow-md active:scale-95"
              >
                <Message2 variant="Linear" size={18} color="#8EA09A" />
                <span className="absolute top-[9px] right-[10px] w-2 h-2 bg-[#E34D4D] rounded-full ring-2 ring-white animate-pulse" />
              </button>
              <button
                onClick={() => showToast('Notifications')}
                className="w-11 h-11 rounded-full bg-white shadow-sm border border-white/70 flex items-center justify-center shrink-0 transition-all duration-300 hover:shadow-md active:scale-95"
              >
                <NotificationBing variant="Linear" size={18} color="#8EA09A" />
              </button>
            </div>
          </header>

          {/* Grid */}
          <div className="grid grid-cols-12 gap-4 lg:gap-5 min-w-0">
            {/* Spent this month */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[24px] p-5 shadow-sm border border-white/60 flex flex-col min-h-[148px] hover-card-premium animate-fade-in-up" style={{ animationDelay: '50ms' }}>
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-[#9AA9A1] uppercase tracking-wide">
                    Total Users
                  </span>
                  <span className="text-[30px] font-bold tracking-tight mt-1">
                    <AnimatedNumber value={data.totalUsers} />
                  </span>
                </div>
                <button
                  onClick={() => showToast('Spent details')}
                  className="w-8 h-8 rounded-full border border-[#E3EAE6] flex items-center justify-center text-[#7D9B8B] hover:bg-[#F5F7F6] transition-colors duration-200"
                >
                  <ArrowUp3 variant="Linear" size={14} color="currentColor" />
                </button>
              </div>
              <AnimatedBars />
            </div>

            {/* New clients */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[24px] p-5 shadow-sm border border-white/60 flex flex-col min-h-[148px] hover-card-premium animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[12px] font-medium text-[#9AA9A1] uppercase tracking-wide">
                    New Signups (30d)
                  </span>
                  <div className="text-[30px] font-bold tracking-tight mt-1">
                    <AnimatedNumber value={data.signupsLast30d} />
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#E6EFE8] flex items-center justify-center text-[#6B8F7E]">
                  <Profile2User variant="Linear" size={16} color="#6B8F7E" />
                </div>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-[#9AA9A1]">
                <Sparkline className="text-[#9EB8AA]" />
                <span className="text-[12px]">+12% vs last month</span>
              </div>
            </div>

            {/* Earnings */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[24px] p-5 shadow-sm border border-white/60 flex flex-col min-h-[148px] hover-card-premium animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[12px] font-medium text-[#9AA9A1] uppercase tracking-wide">
                    Active Plans
                  </span>
                  <div className="text-[30px] font-bold tracking-tight mt-1">
                    <AnimatedNumber value={data.lifetimeCount + data.trialActiveCount} />
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#F6EED5] flex items-center justify-center">
                  <Money4 variant="Linear" size={20} color="#A8894A" />
                </div>
              </div>
              <div className="mt-auto flex items-center gap-2">
                <span className="text-[13px] font-semibold bg-[#EAF3EA] text-[#5A7D6E] px-2.5 py-1 rounded-full">
                  +2.4%
                </span>
                <span className="text-[12px] text-[#9AA9A1]">this week</span>
              </div>
            </div>

            {/* Activity */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 rounded-[24px] p-5 shadow-sm border border-white/10 flex flex-col min-h-[148px] text-white bg-gradient-to-br from-[#8AA99B] to-[#6D8F7E] relative overflow-hidden hover-card-premium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="text-[12px] font-medium text-white/70 uppercase tracking-wide">
                    Conversion Rate
                  </span>
                  <div className="text-[30px] font-bold tracking-tight mt-1">
                    <AnimatedDecimalNumber value={((data.lifetimeCount + data.trialActiveCount) / (data.totalUsers || 1)) * 100} />%
                  </div>
                </div>
                <button
                  onClick={() => showToast('Activity')}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                >
                  <ArrowUp3 variant="Linear" size={14} color="#fff" />
                </button>
              </div>
              <div className="mt-auto relative z-10">
                <svg viewBox="0 0 120 36" className="w-full h-[44px]">
                  <path
                    d="M0 28 Q 12 6, 24 18 T 48 14 T 72 20 T 96 12 T 120 18"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    opacity="0.95"
                  />
                  <path
                    d="M0 28 Q 12 6, 24 18 T 48 14 T 72 20 T 96 12 T 120 18 L120 36 L0 36 Z"
                    fill="white"
                    opacity="0.14"
                  />
                </svg>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* Balance */}
            <div className="col-span-12 lg:col-span-6 bg-white rounded-[24px] p-6 shadow-sm border border-white/60 min-w-0 hover-card-premium animate-fade-in-up" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-[18px] font-bold">Balance</h3>
                  <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[#E6F0E8] text-[#5A7D6E] border border-[#D7E6DA]">
                    <TickCircle variant="Bold" size={12} color="#5A7D6E" />
                    On track
                  </span>
                </div>
                <button
                  onClick={() => setPeriod((p) => (p === 'Monthly' ? 'Weekly' : 'Monthly'))}
                  className="text-[13px] font-medium px-3 py-1.5 rounded-full bg-[#F2F2F0] border border-[#E9E6E0] flex items-center gap-1.5 transition-colors duration-200 hover:bg-[#EAEAE8]"
                >
                  {period} <ArrowDown2 variant="Linear" size={12} color="currentColor" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="bg-[#F7F6F3] rounded-[16px] p-4 border border-[#EFECE6] transition-all duration-300 hover:border-[#6B8F7E]/20">
                  <div className="text-[11px] font-semibold tracking-widest text-[#9AA9A1] uppercase">
                    Trials
                  </div>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-[22px] font-bold">
                      <AnimatedNumber value={data.trialActiveCount} />
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E6F0E8] text-[#4E8A64]">
                      +Active
                    </span>
                  </div>
                </div>
                <div className="bg-[#F7F6F3] rounded-[16px] p-4 border border-[#EFECE6] transition-all duration-300 hover:border-[#6B8F7E]/20">
                  <div className="text-[11px] font-semibold tracking-widest text-[#9AA9A1] uppercase">
                    Signups (7d)
                  </div>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-[22px] font-bold">
                      <AnimatedNumber value={data.signupsLast7d} />
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FDE8E8] text-[#C86A6A]">
                      Recent
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <BalanceChart />
              </div>
              <div className="mt-3 flex justify-between text-[11px] text-[#A9B7B0] font-medium px-1">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>

            {/* Earnings gauge */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[24px] p-6 shadow-sm border border-white/60 flex flex-col hover-card-premium animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h3 className="text-[18px] font-bold">Conversion</h3>
              <p className="text-[12px] text-[#9AA9A1] mt-1">Total Paid Subscriptions</p>
              <div className="text-[30px] font-bold tracking-tight mt-2 text-[#5A7D6E]">
                <AnimatedNumber value={data.lifetimeCount} />
              </div>
              <p className="text-[12.5px] leading-[1.45] text-[#8FA39A] mt-2">
                Lifetime plan users currently active on the platform.
              </p>
              <div className="mt-6 flex-1 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-[200px] aspect-[2/1] overflow-visible">
                  <Gauge percent={Math.round((((data.lifetimeCount + data.trialActiveCount) / (data.totalUsers || 1)) * 100))} />
                </div>
                <div className="mt-2 text-[12px] text-[#9AA9A1] font-medium animate-pulse">Achieved</div>
              </div>
            </div>

            {/* Profile */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[24px] p-6 shadow-sm border border-white/60 flex flex-col items-center text-center hover-card-premium animate-fade-in-up" style={{ animationDelay: '350ms' }}>
              <div className="w-[86px] h-[86px] rounded-full bg-[#F5EEE0] flex items-center justify-center text-[40px] border border-[#EDE6D8] shadow-inner transition-transform duration-500 hover:scale-110 hover:rotate-12">
                <span role="img" aria-label="profile">🤩</span>
              </div>
              <div className="mt-4 font-bold text-[16px]">Admin</div>
              <div className="text-[12.5px] text-[#9AA9A1] mt-0.5">admin@followupnow.com</div>
              <div className="mt-8 w-full grid grid-cols-3 divide-x divide-[#EEEAE3] border-t border-[#EEEAE3] pt-5">
                <div>
                  <div className="text-[18px] font-bold leading-none">
                    <AnimatedNumber value={data.lifetimeCount} />
                  </div>
                  <div className="text-[10.5px] font-semibold tracking-widest uppercase text-[#A9B7B0] mt-1.5">
                    Lifetime
                  </div>
                </div>
                <div>
                  <div className="text-[18px] font-bold leading-none">
                    <AnimatedNumber value={data.trialActiveCount} />
                  </div>
                  <div className="text-[10.5px] font-semibold tracking-widest uppercase text-[#A9B7B0] mt-1.5">
                    Trial
                  </div>
                </div>
                <div>
                  <div className="text-[18px] font-bold leading-none">
                    <AnimatedNumber value={data.noPlanCount} />
                  </div>
                  <div className="text-[10.5px] font-semibold tracking-widest uppercase text-[#A9B7B0] mt-1.5">
                    No Plan
                  </div>
                </div>
              </div>
            </div>

            {/* Available Credit Card in Wallet */}
            <div className="col-span-12 lg:col-span-6 bg-white rounded-[24px] p-6 shadow-sm border border-white/60 overflow-hidden min-w-0 hover-card-premium animate-fade-in-up group" style={{ animationDelay: '400ms' }}>
              <div className="flex flex-col lg:flex-row gap-6 h-full">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[19px] font-bold leading-[1.2] max-w-[220px]">
                    Stripe & Apple Integrations
                  </h3>
                  <p className="text-[12.5px] leading-[1.6] text-[#9AA9A1] mt-3 max-w-[280px]">
                    Manage payments processed through Stripe ({data.stripeCount} users) and Apple In-App Purchases ({data.appleCount} users).
                  </p>
                  <button
                    onClick={() => showToast('Add New Card — coming soon')}
                    className="mt-6 h-11 px-5 rounded-[12px] bg-[#6D8F7E] hover:bg-[#5E7F6F] text-white text-[13.5px] font-semibold shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  >
                    Add New Card +
                  </button>
                </div>
                <div className="relative flex-1 min-h-[200px] lg:min-h-0 flex items-center justify-center overflow-hidden">
                  <div className="relative w-[260px] h-[180px] [perspective:900px] shrink-0 scale-[0.9] lg:scale-100 origin-center">
                    {/* Back card */}
                    <div
                      className="absolute left-8 top-[78px] w-[200px] h-[120px] rounded-[16px] bg-[#1F2A2E] shadow-xl border border-white/10 p-4 flex flex-col justify-between transition-all duration-500 ease-out group-hover:translate-x-8 group-hover:-translate-y-4 group-hover:-rotate-[12deg] group-hover:scale-105"
                      style={{ transform: 'rotate(-8deg) translateZ(-40px)' }}
                    >
                      <div className="flex justify-between text-white/50 text-[9px] tracking-widest uppercase">
                        <span>Master Card</span>
                        <span>•••</span>
                      </div>
                      <div className="text-white/70 text-[11px] tracking-[0.2em]">
                        •••• •••• •••• 8841
                      </div>
                    </div>
                    {/* Middle card */}
                    <div
                      className="absolute left-4 top-[38px] w-[200px] h-[120px] rounded-[16px] bg-[#8AA99B] shadow-xl border border-white/20 p-4 flex flex-col justify-between transition-all duration-500 ease-out group-hover:translate-x-4 group-hover:-translate-y-2 group-hover:-rotate-[6deg] group-hover:scale-105"
                      style={{ transform: 'rotate(-4deg) translateZ(-20px)' }}
                    >
                      <div className="flex justify-between text-white/90 text-[9px] tracking-widest uppercase font-semibold">
                        <span>Master Card</span>
                        <span className="flex gap-0.5">
                          <i className="w-3 h-3 rounded-full bg-white/90 block -mr-1" />
                          <i className="w-3 h-3 rounded-full bg-white/60 block" />
                        </span>
                      </div>
                      <div className="text-white text-[11px] tracking-[0.2em]">
                        1234 1234 1234 1234
                      </div>
                    </div>
                    {/* Front card */}
                    <div className="absolute left-0 top-0 w-[220px] h-[132px] rounded-[18px] bg-gradient-to-br from-[#EEF3EF] to-[#D8E4DD] shadow-2xl border border-white p-4 flex flex-col justify-between transition-all duration-500 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:rotate-[2deg] group-hover:scale-105">
                      <div className="flex justify-between items-start">
                        <span className="text-[9.5px] tracking-widest uppercase font-semibold text-[#6B8F7E]">
                          Master Card
                        </span>
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-[#EB001B]/90" />
                          <div className="w-6 h-6 rounded-full bg-[#F79E1B]/90 mix-blend-multiply" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="w-7 h-[5px] rounded-full bg-[#9FB9AE]/60" />
                          <div className="w-4 h-[5px] rounded-full bg-[#9FB9AE]/30" />
                        </div>
                        <div className="text-[#2E3F38] text-[13px] tracking-[0.18em] font-medium">
                          1234 1234 1234 1234
                        </div>
                        <div className="flex justify-between text-[10px] text-[#7E9A8E]">
                          <span>CARLIC BOLOMBOY</span>
                          <span>12/28</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Signups */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[24px] p-6 shadow-sm border border-white/60 hover-card-premium animate-fade-in-up" style={{ animationDelay: '450ms' }}>
              <h3 className="text-[16px] font-bold">Recent Signups</h3>
              <div className="mt-5 space-y-5">
                {data.recentUsers.map((u, i) => (
                  <div key={i} className="flex items-center gap-3 transition-all duration-300 hover:translate-x-1">
                    <div
                      className={`w-[3px] self-stretch rounded-full ${
                        u.plan === 'lifetime' ? 'bg-[#6B8F7E]' : 'bg-[#E8C6C6]'
                      }`}
                    />
                    <div
                      className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-[11px] font-bold transition-transform duration-300 hover:scale-110"
                      style={{ background: '#E8EFEA', color: '#5A6E64' }}
                    >
                      {getInitials(u.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold leading-tight truncate">
                        {u.name || u.email || u.phone}
                      </div>
                      <div className="text-[11px] text-[#9AA9A1] mt-0.5">{new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all duration-300 hover:scale-105 ${
                        u.plan === 'lifetime'
                          ? 'bg-[#E6F0E8] text-[#4E8A64]'
                          : 'bg-[#FDE8E8] text-[#C86A6A]'
                      }`}
                    >
                      {u.plan}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keep you safe! */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[24px] p-6 shadow-sm border border-white/60 flex flex-col items-center text-center hover-card-premium animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <div className="w-24 h-24 rounded-full bg-[#EEF4EF] flex items-center justify-center mt-1 animate-pulse-subtle">
                <FingerScan variant="Linear" size={56} color="#8AA99B" />
              </div>
              <h3 className="mt-5 text-[16px] font-bold">Keep you safe!</h3>
              <p className="text-[12.5px] text-[#9AA9A1] mt-1 leading-[1.5] max-w-[180px]">
                Update your security password
              </p>
              <button
                onClick={() => showToast('Security update — coming soon')}
                className="mt-6 w-full h-11 rounded-[12px] bg-[#6D8F7E] hover:bg-[#5E7F6F] text-white text-[13.5px] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                Update Your Security
              </button>
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
