'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Sidebar, MobileNav } from '@/components/Navigation';
import { SearchNormal, DocumentDownload, ArrowLeft2, ArrowRight2, CloseCircle } from 'iconsax-react';
import { fetchUsersForExport } from './actions';

interface UserRow {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: string;
  status: string;
  paymentSource: string;
  trialEndDate: string | null;
  paymentDate: string | null;
  lastLogin: string | null;
  createdAt: string;
}

interface UsersData {
  users: UserRow[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  search: string;
  plan: string;
  status: string;
  source: string;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function UsersClient({ data }: { data: UsersData }) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(data.search);
  
  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMode, setExportMode] = useState<'all' | 'date'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams();
      const current = {
        search: data.search,
        plan: data.plan,
        status: data.status,
        source: data.source,
        page: String(data.currentPage),
        ...updates,
      };

      if (!('page' in updates)) {
        current.page = '1';
      }

      Object.entries(current).forEach(([k, v]) => {
        if (v && v !== 'all' && v !== '' && v !== '1') {
          params.set(k, v);
        } else if (k === 'page' && v !== '1') {
          params.set(k, v);
        }
      });

      const qs = params.toString();
      router.push(`/users${qs ? `?${qs}` : ''}`);
    },
    [data, router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchValue });
  };

  const handleExportExcel = async () => {
    setIsExporting(true);

    try {
      // 1. Fetch full dataset from the server action
      const usersToExport = await fetchUsersForExport({
        search: data.search,
        plan: data.plan,
        status: data.status,
        source: data.source,
        startDate: exportMode === 'date' ? startDate : undefined,
        endDate: exportMode === 'date' ? endDate : undefined,
      });

      if (!usersToExport || usersToExport.length === 0) {
        alert('No users found for this date range/filters.');
        setIsExporting(false);
        return;
      }

      const ExcelJS = await import('exceljs');
      const { saveAs } = await import('file-saver');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');

      // Define columns
      worksheet.columns = [
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 20 },
        { header: 'Plan', key: 'plan', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Joined Date', key: 'joined', width: 20 },
      ];

      // Style Header Row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E2A26' }, // Dark green matching dashboard
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 25;

      // Add Data
      usersToExport.forEach((u) => {
        const row = worksheet.addRow({
          name: u.name || '—',
          email: u.email || '—',
          phone: u.phone || '—',
          plan: (u.plan || 'none').toUpperCase(),
          status: (u.status || 'inactive').toUpperCase(),
          joined: formatDate(u.createdAt),
        });

        // Add some row height spacing
        row.height = 22;

        // Plan Column Styling
        const planCell = row.getCell('plan');
        planCell.alignment = { horizontal: 'center', vertical: 'middle' };
        if (u.plan === 'lifetime') {
          planCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F0E8' } };
          planCell.font = { color: { argb: 'FF4E8A64' }, bold: true };
        } else if (u.plan === 'trial') {
          planCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6EED5' } };
          planCell.font = { color: { argb: 'FFA8894A' }, bold: true };
        } else {
          planCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F1EC' } };
          planCell.font = { color: { argb: 'FF9AA9A1' }, bold: true };
        }

        // Status Column Styling
        const statusCell = row.getCell('status');
        statusCell.alignment = { horizontal: 'center', vertical: 'middle' };
        if (u.status === 'active') {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F0E8' } };
          statusCell.font = { color: { argb: 'FF4E8A64' }, bold: true };
        } else {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE8E8' } };
          statusCell.font = { color: { argb: 'FFC86A6A' }, bold: true };
        }
        
        // Vertical alignment for other cells
        ['name', 'email', 'phone', 'joined'].forEach(key => {
            row.getCell(key).alignment = { vertical: 'middle' };
        });
      });

      // Generate & Save
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `FollowUpNow_Users_${new Date().toISOString().slice(0, 10)}.xlsx`);
      
      // Close modal on success
      setIsExportModalOpen(false);
    } catch (err) {
      console.error('Failed to export Excel', err);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDE9E1] text-[#1E2A26] antialiased selection:bg-[#6B8F7E]/20 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-3 lg:px-6 py-4 lg:py-6 flex gap-5 min-w-0 min-h-screen">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col h-full">
          {/* Header */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pt-2">
            <div>
              <h1 className="text-[28px] lg:text-[32px] font-extrabold tracking-tight">Users</h1>
              <p className="text-[14px] text-[#9AA9A1] font-medium mt-1">
                Manage and filter your {data.totalCount.toLocaleString()} users.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-white/60 shadow-sm text-[13px] font-bold hover:shadow-md transition text-[#1E2A26]"
              >
                <DocumentDownload variant="Linear" size={18} color="currentColor" />
                Export
              </button>
            </div>
          </header>

          {/* Filters & Search */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-white/60 mb-6 flex flex-col lg:flex-row gap-4 items-center">
            <form onSubmit={handleSearch} className="relative flex-1 w-full">
              <SearchNormal
                variant="Linear"
                size={18}
                color="currentColor"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA9A1]"
              />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-[#F7F6F3] border-none rounded-full py-3.5 pl-11 pr-4 text-[14px] font-medium placeholder:text-[#A6B2AB] focus:ring-2 focus:ring-[#7A9B8A] focus:outline-none transition"
              />
            </form>

            <div className="flex gap-4 w-full lg:w-auto">
              <select
                value={data.plan}
                onChange={(e) => updateParams({ plan: e.target.value })}
                className="bg-[#F7F6F3] border-none rounded-full py-3.5 px-5 text-[14px] font-medium text-[#1E2A26] focus:ring-2 focus:ring-[#7A9B8A] focus:outline-none transition appearance-none cursor-pointer pr-10 relative"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239AA9A1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem top 50%',
                  backgroundSize: '0.65rem auto',
                }}
              >
                <option value="all">All Plans</option>
                <option value="lifetime">Lifetime</option>
                <option value="trial">Trial</option>
                <option value="none">No Plan</option>
              </select>

              <select
                value={data.status}
                onChange={(e) => updateParams({ status: e.target.value })}
                className="bg-[#F7F6F3] border-none rounded-full py-3.5 px-5 text-[14px] font-medium text-[#1E2A26] focus:ring-2 focus:ring-[#7A9B8A] focus:outline-none transition appearance-none cursor-pointer pr-10 relative"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239AA9A1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem top 50%',
                  backgroundSize: '0.65rem auto',
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[24px] shadow-sm border border-white/60 overflow-hidden flex-1 mb-8">
            <div className="overflow-x-auto h-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#F3F1EC]">
                    <th className="py-5 px-6 text-[12px] font-semibold text-[#9AA9A1] uppercase tracking-wider">User</th>
                    <th className="py-5 px-6 text-[12px] font-semibold text-[#9AA9A1] uppercase tracking-wider">Contact</th>
                    <th className="py-5 px-6 text-[12px] font-semibold text-[#9AA9A1] uppercase tracking-wider">Plan</th>
                    <th className="py-5 px-6 text-[12px] font-semibold text-[#9AA9A1] uppercase tracking-wider">Status</th>
                    <th className="py-5 px-6 text-[12px] font-semibold text-[#9AA9A1] uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F1EC]">
                  {data.users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#9AA9A1] font-medium text-[14px]">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    data.users.map((user) => (
                      <tr key={user._id} className="hover:bg-[#FCFBF9] transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-[12px] font-bold"
                              style={{ background: '#E8EFEA', color: '#5A6E64' }}
                            >
                              {getInitials(user.name)}
                            </div>
                            <div>
                              <div className="text-[14px] font-bold">{user.name || '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[13px] font-medium">{user.email || '—'}</div>
                          <div className="text-[12px] text-[#9AA9A1] mt-0.5">{user.phone || '—'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-[12px] font-bold px-3 py-1.5 rounded-full inline-block ${
                              user.plan === 'lifetime'
                                ? 'bg-[#E6F0E8] text-[#4E8A64]'
                                : user.plan === 'trial'
                                ? 'bg-[#F6EED5] text-[#A8894A]'
                                : 'bg-[#F3F1EC] text-[#9AA9A1]'
                            }`}
                          >
                            {user.plan || 'none'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-[12px] font-bold px-3 py-1.5 rounded-full inline-block ${
                              user.status === 'active'
                                ? 'bg-[#E6F0E8] text-[#4E8A64]'
                                : 'bg-[#FDE8E8] text-[#C86A6A]'
                            }`}
                          >
                            {user.status || 'inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[13px] font-medium text-[#5A7D6E]">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-[20px] px-6 py-4 shadow-sm border border-white/60 mb-20 lg:mb-8">
              <span className="text-[13px] font-medium text-[#9AA9A1]">
                Showing page <strong className="text-[#1E2A26]">{data.currentPage}</strong> of{' '}
                <strong className="text-[#1E2A26]">{data.totalPages}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={data.currentPage <= 1}
                  onClick={() => updateParams({ page: String(data.currentPage - 1) })}
                  className="w-10 h-10 rounded-full bg-[#F7F6F3] flex items-center justify-center text-[#1E2A26] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E9E5DC] transition"
                >
                  <ArrowLeft2 variant="Linear" size={16} color="currentColor" />
                </button>
                <button
                  disabled={data.currentPage >= data.totalPages}
                  onClick={() => updateParams({ page: String(data.currentPage + 1) })}
                  className="w-10 h-10 rounded-full bg-[#121619] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition"
                >
                  <ArrowRight2 variant="Linear" size={16} color="currentColor" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <MobileNav />

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121619]/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative animate-[slideUp_0.3s_ease]">
            <button
              onClick={() => !isExporting && setIsExportModalOpen(false)}
              className="absolute top-6 right-6 text-[#9AA9A1] hover:text-[#1E2A26] transition"
            >
              <CloseCircle variant="Bold" size={24} />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#E8EFEA] flex items-center justify-center text-[#4E8A64] mb-6">
              <DocumentDownload variant="Bold" size={24} />
            </div>

            <h2 className="text-[22px] font-extrabold text-[#1E2A26] mb-2">Export Users</h2>
            <p className="text-[14px] text-[#9AA9A1] font-medium mb-8">
              Export your filtered users to a beautiful Excel spreadsheet.
            </p>

            <div className="space-y-3 mb-8">
              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  exportMode === 'all'
                    ? 'border-[#1E2A26] bg-[#F7F6F3]'
                    : 'border-[#F3F1EC] hover:border-[#E8EFEA]'
                }`}
              >
                <input
                  type="radio"
                  checked={exportMode === 'all'}
                  onChange={() => setExportMode('all')}
                  className="w-5 h-5 accent-[#1E2A26]"
                />
                <span className="text-[14px] font-bold text-[#1E2A26]">Export All Time</span>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  exportMode === 'date'
                    ? 'border-[#1E2A26] bg-[#F7F6F3]'
                    : 'border-[#F3F1EC] hover:border-[#E8EFEA]'
                }`}
              >
                <input
                  type="radio"
                  checked={exportMode === 'date'}
                  onChange={() => setExportMode('date')}
                  className="w-5 h-5 accent-[#1E2A26]"
                />
                <span className="text-[14px] font-bold text-[#1E2A26]">Custom Date Range</span>
              </label>

              {exportMode === 'date' && (
                <div className="flex gap-4 mt-4 animate-[fadeIn_0.2s_ease]">
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-[#9AA9A1] uppercase tracking-wider mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#F7F6F3] border-none rounded-xl py-3 px-4 text-[14px] font-medium text-[#1E2A26] focus:ring-2 focus:ring-[#7A9B8A] outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-[#9AA9A1] uppercase tracking-wider mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#F7F6F3] border-none rounded-xl py-3 px-4 text-[14px] font-medium text-[#1E2A26] focus:ring-2 focus:ring-[#7A9B8A] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleExportExcel}
              disabled={isExporting || (exportMode === 'date' && (!startDate || !endDate))}
              className="w-full py-4 rounded-full bg-[#1E2A26] text-white text-[14px] font-bold hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <span className="w-[20px] h-[20px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <DocumentDownload variant="Linear" size={20} color="currentColor" />
              )}
              {isExporting ? 'Generating Spreadsheet...' : 'Download Excel File'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
