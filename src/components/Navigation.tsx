'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Element4,
  Wallet,
  ChartSquare,
  DocumentText,
  Profile2User,
  Calendar,
  Setting2,
  Logout,
} from 'iconsax-react';

function NavItem({
  children,
  active,
  href,
}: {
  children: React.ReactNode;
  active?: boolean;
  href?: string;
}) {
  if (href) {
    return (
      <Link
        href={href}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
          active ? 'bg-black text-white' : 'hover:bg-[#F3F1EC] text-[#9AA9A1]'
        }`}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
        active ? 'bg-black text-white' : 'hover:bg-[#F3F1EC] text-[#9AA9A1]'
      }`}
    >
      {children}
    </button>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
       await fetch('/api/logout', { method: 'POST' });
       router.push('/login');
       router.refresh();
    } catch {
       window.location.href = '/login';
    }
  };

  return (
    <aside className="hidden lg:flex flex-col items-center w-[84px] shrink-0">
      <div className="bg-white rounded-[32px] w-full py-5 px-3 flex flex-col items-center shadow-sm border border-white/60 sticky top-6">
        <Link
          href="/"
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-sm ${pathname === '/' ? 'bg-[#121619]' : 'bg-[#121619]'}`}
        >
          <Element4 variant="Bold" size={20} color="#fff" />
        </Link>
        <div className="mt-7 flex flex-col gap-6 text-[#A6B2AB]">
          <NavItem href="/users" active={pathname?.startsWith('/users')}>
            <Profile2User variant={pathname?.startsWith('/users') ? 'Bold' : 'Linear'} size={20} color="currentColor" />
          </NavItem>
          <NavItem href="#">
            <Wallet variant="Linear" size={20} color="currentColor" />
          </NavItem>
          <NavItem href="#">
            <ChartSquare variant="Linear" size={20} color="currentColor" />
          </NavItem>
          <NavItem href="#">
            <DocumentText variant="Linear" size={20} color="currentColor" />
          </NavItem>
          <NavItem href="#">
            <Calendar variant="Linear" size={20} color="currentColor" />
          </NavItem>
        </div>
        <div className="flex-1" />
        <div className="mt-10 flex flex-col gap-5 text-[#A6B2AB] items-center">
          <NavItem>
            <Setting2 variant="Linear" size={20} color="currentColor" />
          </NavItem>
          <button onClick={handleLogout} className="w-10 h-10 rounded-full flex items-center justify-center transition hover:bg-[#F3F1EC] text-[#9AA9A1]">
            <Logout variant="Linear" size={20} color="currentColor" />
          </button>
          <div className="mt-2 w-10 h-10 rounded-full overflow-hidden ring-1 ring-black/5 bg-[#E9E2D6] flex items-center justify-center text-[14px] font-bold text-[#6B5E4A]">
            AD
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-4 left-3 right-3 z-20">
      <div className="mx-auto max-w-[420px] bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-white/80 px-2 py-2 flex items-center justify-around">
        <Link
          href="/"
          className={`w-10 h-10 rounded-full flex items-center justify-center ${pathname === '/' ? 'bg-[#11181C] text-white' : 'text-[#A6B2AB] hover:bg-[#F5F3EF]'}`}
        >
          <Element4 variant={pathname === '/' ? 'Bold' : 'Linear'} size={18} color="currentColor" />
        </Link>
        <Link
          href="/users"
          className={`w-10 h-10 flex items-center justify-center rounded-full transition ${pathname?.startsWith('/users') ? 'bg-[#11181C] text-white' : 'text-[#A6B2AB] hover:bg-[#F5F3EF]'}`}
        >
          <Profile2User variant={pathname?.startsWith('/users') ? 'Bold' : 'Linear'} size={20} color="currentColor" />
        </Link>
        <Link
          href="#"
          className="text-[#A6B2AB] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F3EF]"
        >
          <Wallet variant="Linear" size={20} color="currentColor" />
        </Link>
        <Link
          href="#"
          className="text-[#A6B2AB] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F3EF]"
        >
          <ChartSquare variant="Linear" size={20} color="currentColor" />
        </Link>
        <Link
          href="#"
          className="text-[#A6B2AB] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F3EF]"
        >
          <Calendar variant="Linear" size={20} color="currentColor" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-[#E9E2D6] flex items-center justify-center text-[11px] font-bold text-[#6B5E4A]">
          AD
        </div>
      </div>
    </div>
  );
}
