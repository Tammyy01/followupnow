'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Chart, People, Logout } from 'iconsax-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Overview', icon: Chart },
    { href: '/users', label: 'Users', icon: People },
  ];

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">F</div>
          <div>
            <div className="sidebar-logo-text">FollowUp Now</div>
            <div className="sidebar-logo-badge">Admin Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-link-icon">
              <item.icon variant="Linear" size={18} />
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link" onClick={handleLogout} style={{ width: '100%' }}>
          <span className="nav-link-icon">
            <Logout variant="Linear" size={18} />
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
