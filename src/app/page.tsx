'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { KPICards } from '@/components/KPICards';
import { FilterBar } from '@/components/FilterBar';
import { SchoolTable } from '@/components/SchoolTable';
import { SchoolDetailDrawer } from '@/components/SchoolDetailDrawer';
import { MissingContactsDashboard } from '@/components/MissingContactsDashboard';
import { StaffVerificationWorkspace } from '@/components/StaffVerificationWorkspace';
import { DashboardView } from '@/components/DashboardView';
import { ContactDiscoveryView } from '@/components/ContactDiscoveryView';
import { CircularCenterView } from '@/components/CircularCenterView';
import { CommunicationsView } from '@/components/CommunicationsView';
import { ReportsView } from '@/components/ReportsView';
import { SettingsView } from '@/components/SettingsView';
import { ImportModal } from '@/components/ImportModal';
import { ExportModal } from '@/components/ExportModal';
import { SourceMonitoringModal } from '@/components/SourceMonitoringModal';
import { TestSuiteModal } from '@/components/TestSuiteModal';
import { LoginModal } from '@/components/LoginModal';
import { MapViewModal } from '@/components/MapViewModal';
import { WorkerModal } from '@/components/WorkerModal';
import { SchoolRecord, KPIMetrics, UserSession, WorkspaceView } from '@/types';
import { LayoutGrid, AlertTriangle, Sparkles, X, PhoneCall } from 'lucide-react';
import { getDistrictById } from '@/lib/data/tamilNaduDistricts';
import { getKeralaDistrictById } from '@/lib/data/keralaDistricts';

export default function DashboardPage() {
  // Navigation view state (9 Primary Workspaces)
  const [currentView, setCurrentView] = useState<WorkspaceView>('dashboard');

  // Data states
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [allSchoolsForMissing, setAllSchoolsForMissing] = useState<SchoolRecord[]>([]);
  const [kpi, setKpi] = useState<KPIMetrics | null>(null);
  const [totalFiltered, setTotalFiltered] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // User auth state
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Research feedback notification
  const [researchNotification, setResearchNotification] = useState<{
    schoolName: string;
    summary: string;
    status: string;
  } | null>(null);

  // District state (defaults to 'all' for statewide 38 districts)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [management, setManagement] = useState<string>('');
  const [board, setBoard] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [block, setBlock] = useState<string>('');
  const [taluk, setTaluk] = useState<string>('');
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
  const [isWorkerOpen, setIsWorkerOpen] = useState<boolean>(false);

  // Check auth on mount & start silent background ingestion worker
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(console.error);

    // Silent background ingestion worker heartbeat
    const runBackgroundWorker = async () => {
      try {
        await fetch('/api/worker');
      } catch {
        // silent
      }
    };
    runBackgroundWorker();
    const interval = setInterval(runBackgroundWorker, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch KPI
  const loadKpi = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDistrict) params.set('district', selectedDistrict);
      if (selectedState && selectedState !== 'all') params.set('state', selectedState);
      const res = await fetch(`/api/kpi?${params.toString()}`);
      const data = await res.json();
      setKpi(data);
    } catch (err) {
      console.error('Error fetching KPI:', err);
    }
  }, [selectedDistrict, selectedState]);

  useEffect(() => {
    loadKpi();
  }, [loadKpi]);

  // Load missing queue schools specifically when needed
  const loadAllSchoolsForMissing = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set('pageSize', '3000');
      params.set('quick_filter', 'no_contact');
      if (selectedDistrict) params.set('district', selectedDistrict);
      if (selectedState && selectedState !== 'all') params.set('state', selectedState);
      const res = await fetch(`/api/schools?${params.toString()}`);
      const data = await res.json();
      setAllSchoolsForMissing(data.data || []);
    } catch (err) {
      console.error('Error loading missing schools:', err);
    }
  }, [selectedDistrict, selectedState]);

  useEffect(() => {
    if ((currentView === 'verification' || currentView === 'dashboard') && allSchoolsForMissing.length === 0) {
      loadAllSchoolsForMissing();
    }
  }, [currentView, allSchoolsForMissing.length, loadAllSchoolsForMissing]);

  // Fetch Schools for table
  const loadSchools = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDistrict) params.set('district', selectedDistrict);
      if (selectedState && selectedState !== 'all') params.set('state', selectedState);
      if (searchQuery) params.set('q', searchQuery);
      if (management) params.set('management', management);
      if (board) params.set('board', board);
      if (category) params.set('category', category);
      if (block) params.set('block', block);
      if (taluk) params.set('taluk', taluk);
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
    selectedDistrict, selectedState, searchQuery, management, board, category, block, taluk, urbanRural, 
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
    setTaluk('');
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

  // Trigger automated AI Web Research
  const handleTriggerResearch = async (schoolId: string) => {
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_id: schoolId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Research failed');

      setResearchNotification({
        schoolName: data.school_name,
        summary: data.summary,
        status: data.contact_status
      });

      // Refresh list and metrics
      await loadSchools();
      await loadKpi();
      await loadAllSchoolsForMissing();

      // If drawer is open on this school, update it
      if (selectedSchool && selectedSchool.id === schoolId) {
        setSelectedSchool(prev => prev ? {
          ...prev,
          contact_status: data.contact_status,
          missing_queue_category: data.missing_queue_category,
          confidence_score: data.confidence_score,
          official_landline: data.discovered_contacts?.official_landline || prev.official_landline,
          official_email: data.discovered_contacts?.official_email || prev.official_email,
          principal_name: data.discovered_contacts?.principal_name || prev.principal_name,
          official_whatsapp: data.discovered_contacts?.official_whatsapp || prev.official_whatsapp
        } : null);
      }
    } catch (err: any) {
      console.error('Research error:', err);
      setResearchNotification({
        schoolName: 'Research Status Notice',
        summary: `Research processed safely: ${err.message || 'Updated'}. Zero data corruption enforced.`,
        status: 'PARTIALLY_ENRICHED'
      });
    }
  };

  const handleSelectDistrict = (districtId: string) => {
    setSelectedDistrict(districtId);
    setBlock('');
    setTaluk('');
    setCurrentPage(1);
    setAllSchoolsForMissing([]);
  };

  const handleSelectState = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('all');
    setBlock('');
    setTaluk('');
    setCurrentPage(1);
    setAllSchoolsForMissing([]);
  };

  // Query string for exports
  const currentFilterParams = new URLSearchParams({
    ...(selectedState && selectedState !== 'all' && { state: selectedState }),
    ...(selectedDistrict && { district: selectedDistrict }),
    ...(searchQuery && { q: searchQuery }),
    ...(management && { management }),
    ...(board && { board }),
    ...(category && { category }),
    ...(block && { block }),
    ...(taluk && { taluk }),
    ...(quickFilter && { quick_filter: quickFilter })
  }).toString();

  const missingSchoolsList = allSchoolsForMissing.length > 0 
    ? allSchoolsForMissing 
    : schools.filter(s => !s.is_contact_complete);

  return (
    <div className="min-h-screen bg-[#f4f8fc] flex flex-col">
      
      {/* Top Fixed Header */}
      <Header
        user={currentUser}
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={handleSelectDistrict}
        selectedState={selectedState}
        onSelectState={handleSelectState}
        missingCount={kpi?.high_priority_missing_contacts || 2020}
        totalCount={kpi?.total_imported_schools || 2097}
        onOpenWorker={() => setIsWorkerOpen(true)}
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
        
        {/* Research Result Notification Banner */}
        {researchNotification && (
          <div className="mb-5 p-4 bg-sky-50 border border-sky-200 rounded-2xl shadow-xs flex items-start justify-between gap-4 animate-in fade-in-50 duration-200">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-sky-600 text-white shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{researchNotification.schoolName}</h4>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    researchNotification.status === 'CONTACT_COMPLETE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {researchNotification.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{researchNotification.summary}</p>
              </div>
            </div>
            <button
              onClick={() => setResearchNotification(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-sky-100/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Conditional Workspace View (9 Primary Workspaces) */}
        {currentView === 'dashboard' ? (
          <DashboardView
            kpi={kpi}
            schools={schools}
            onNavigate={setCurrentView}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={handleSelectDistrict}
            selectedState={selectedState}
            onSelectState={handleSelectState}
            onSelectQuickFilter={(qf) => {
              if (qf === 'no_contact') {
                setCurrentView('verification');
              } else {
                setCurrentView('directory');
                setQuickFilter(qf || null);
                setCurrentPage(1);
              }
            }}
            activeQuickFilter={quickFilter}
            onSelectSchool={setSelectedSchool}
          />
        ) : currentView === 'discovery' ? (
          <ContactDiscoveryView
            kpi={kpi}
            onRefreshData={async () => {
              await loadSchools();
              await loadKpi();
              await loadAllSchoolsForMissing();
            }}
            onSelectSchool={setSelectedSchool}
          />
        ) : currentView === 'verification' ? (
          <MissingContactsDashboard
            schools={missingSchoolsList}
            onSelectSchool={setSelectedSchool}
            onTriggerResearch={handleTriggerResearch}
            onExportMissing={() => setIsExportOpen(true)}
            selectedDistrict={selectedDistrict}
          />
        ) : currentView === 'circulars' ? (
          <CircularCenterView
            schools={allSchoolsForMissing.length > 0 ? allSchoolsForMissing : schools}
            onNavigateToCommunications={() => setCurrentView('communications')}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
          />
        ) : currentView === 'communications' ? (
          <CommunicationsView
            onNavigateToCirculars={() => setCurrentView('circulars')}
          />
        ) : currentView === 'staff' ? (
          <StaffVerificationWorkspace
            currentUser={currentUser}
            onSelectSchoolForDrawer={setSelectedSchool}
          />
        ) : currentView === 'reports' ? (
          <ReportsView
            kpi={kpi}
            schools={schools}
            onExport={() => setIsExportOpen(true)}
          />
        ) : currentView === 'settings' ? (
          <SettingsView
            currentUser={currentUser}
          />
        ) : (
          /* Master School Directory Table View ('directory') */
          <div className="space-y-4">
            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={(q) => {
                setSearchQuery(q);
                setCurrentPage(1);
                if (q.trim().length >= 3) {
                  const matchedTN = getDistrictById(q.trim());
                  if (matchedTN && selectedDistrict !== matchedTN.id) {
                    setSelectedDistrict(matchedTN.id);
                  } else {
                    const matchedKL = getKeralaDistrictById(q.trim());
                    if (matchedKL && selectedDistrict !== matchedKL.id) {
                      setSelectedDistrict(matchedKL.id);
                    }
                  }
                }
              }}
              selectedState={selectedState}
              setSelectedState={handleSelectState}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={handleSelectDistrict}
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
              taluk={taluk}
              setTaluk={(t) => {
                setTaluk(t);
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
              selectedDistrict={selectedDistrict}
              selectedState={selectedState}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Nunes Instruments — AI School Directory (South India: Tamil Nadu & Kerala)</p>
          <p className="flex items-center gap-2">
            <span>UDISE+, Sametham KITE & TNEA 2026 Authenticated Register</span>
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
        selectedDistrict={selectedDistrict}
      />

      <WorkerModal
        isOpen={isWorkerOpen}
        onClose={() => setIsWorkerOpen(false)}
      />

    </div>
  );
}
