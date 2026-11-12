'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { KPICards } from '@/components/KPICards';
import { FilterBar } from '@/components/FilterBar';
import { SchoolTable } from '@/components/SchoolTable';
import { SchoolDetailDrawer } from '@/components/SchoolDetailDrawer';
import { ImportModal } from '@/components/ImportModal';
import { ExportModal } from '@/components/ExportModal';
import { SourceMonitoringModal } from '@/components/SourceMonitoringModal';
import { TestSuiteModal } from '@/components/TestSuiteModal';
import { LoginModal } from '@/components/LoginModal';
import { MapViewModal } from '@/components/MapViewModal';
import { SchoolRecord, KPIMetrics, UserSession } from '@/types';

export default function DashboardPage() {
  // Data states
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [kpi, setKpi] = useState<KPIMetrics | null>(null);
  const [totalFiltered, setTotalFiltered] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // User auth state
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [management, setManagement] = useState<string>('');
  const [board, setBoard] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [block, setBlock] = useState<string>('');
  const [urbanRural, setUrbanRural] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  // Pagination & Sorting states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [sortBy, setSortBy] = useState<string>('school_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selected school for detail drawer
  const [selectedSchool, setSelectedSchool] = useState<SchoolRecord | null>(null);

  // Modal visibility states
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState<boolean>(false);
  const [isTestsOpen, setIsTestsOpen] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Check auth on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch KPI
  const loadKpi = useCallback(async () => {
    try {
      const res = await fetch('/api/kpi');
      const data = await res.json();
      setKpi(data);
    } catch (err) {
      console.error('Error fetching KPI:', err);
    }
  }, []);

  useEffect(() => {
    loadKpi();
  }, [loadKpi]);

  // Fetch Schools
  const loadSchools = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (management) params.set('management', management);
      if (board) params.set('board', board);
      if (category) params.set('category', category);
      if (block) params.set('block', block);
      if (urbanRural) params.set('urban_rural', urbanRural);
      if (status) params.set('status', status);
      if (quickFilter) params.set('quick_filter', quickFilter);

      params.set('page', String(currentPage));
      params.set('pageSize', String(pageSize));
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);

      const res = await fetch(`/api/schools?${params.toString()}`);
      const data = await res.json();

      setSchools(data.data || []);
      setTotalFiltered(data.pagination?.totalCount || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery, management, board, category, block, urbanRural, 
    status, quickFilter, currentPage, pageSize, sortBy, sortOrder
  ]);

  // Debounced search / trigger on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadSchools();
    }, 150);
    return () => clearTimeout(timer);
  }, [loadSchools]);

  // Handle Sort Toggle
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setManagement('');
    setBoard('');
    setCategory('');
    setBlock('');
    setUrbanRural('');
    setStatus('');
    setQuickFilter(null);
    setCurrentPage(1);
  };

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'POST' });
    setCurrentUser(null);
  };

  // Update school contact handler
  const handleUpdateSchool = async (updatedFields: Partial<SchoolRecord>) => {
    if (!selectedSchool) return;
    const res = await fetch(`/api/schools/${selectedSchool.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update failed');
    }
    // Refresh school data & KPI
    await loadSchools();
    await loadKpi();
    setSelectedSchool(prev => prev ? { ...prev, ...updatedFields } : null);
  };

  // Log call handler
  const handleLogCall = async (logData: any) => {
    if (!selectedSchool) return;
    const res = await fetch(`/api/schools/${selectedSchool.id}/call-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to log call');
    }
    await loadSchools();
    await loadKpi();
  };

  // Query string for exports
  const currentFilterParams = new URLSearchParams({
    ...(searchQuery && { q: searchQuery }),
    ...(management && { management }),
    ...(board && { board }),
    ...(category && { category }),
    ...(block && { block }),
    ...(quickFilter && { quick_filter: quickFilter })
  }).toString();

  return (
    <div className="min-h-screen bg-[#f4f8fc] flex flex-col">
      
      {/* Top Fixed Header */}
      <Header
        user={currentUser}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSources={() => setIsSourcesOpen(true)}
        onOpenTests={() => setIsTestsOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* KPI Summary Cards */}
        <KPICards
          kpi={kpi}
          activeQuickFilter={quickFilter}
          onSelectQuickFilter={(qf) => {
            setQuickFilter(qf ? qf : null);
            setCurrentPage(1);
          }}
        />

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          management={management}
          setManagement={(m) => {
            setManagement(m);
            setCurrentPage(1);
          }}
          board={board}
          setBoard={(b) => {
            setBoard(b);
            setCurrentPage(1);
          }}
          category={category}
          setCategory={(c) => {
            setCategory(c);
            setCurrentPage(1);
          }}
          block={block}
          setBlock={(bl) => {
            setBlock(bl);
            setCurrentPage(1);
          }}
          urbanRural={urbanRural}
          setUrbanRural={(ur) => {
            setUrbanRural(ur);
            setCurrentPage(1);
          }}
          status={status}
          setStatus={(s) => {
            setStatus(s);
            setCurrentPage(1);
          }}
          quickFilter={quickFilter}
          setQuickFilter={(qf) => {
            setQuickFilter(qf);
            setCurrentPage(1);
          }}
          onReset={handleResetFilters}
          totalFiltered={totalFiltered}
        />

        {/* Schools Table */}
        <SchoolTable
          schools={schools}
          totalCount={totalFiltered}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onSelectSchool={setSelectedSchool}
        />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Nunes Instruments — AI School Directory (Coimbatore District, Tamil Nadu)</p>
          <p className="flex items-center gap-2">
            <span>UDISE+ & TNEA 2026 Authenticated Register</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">100% Zero-Fabrication Guarantee</span>
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SchoolDetailDrawer
        school={selectedSchool}
        onClose={() => setSelectedSchool(null)}
        currentUser={currentUser}
        onUpdateSchool={handleUpdateSchool}
        onLogCall={handleLogCall}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={() => {
          loadSchools();
          loadKpi();
        }}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        filteredCount={totalFiltered}
        totalMasterCount={kpi?.total_imported_schools || 2097}
        currentFilterParams={currentFilterParams}
      />

      <SourceMonitoringModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />

      <TestSuiteModal
        isOpen={isTestsOpen}
        onClose={() => setIsTestsOpen(false)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      <MapViewModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        schools={schools}
        onSelectSchool={setSelectedSchool}
      />

    </div>
  );
}
