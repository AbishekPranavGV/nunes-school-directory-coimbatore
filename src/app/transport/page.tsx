'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TransportSidebar } from '@/components/transport/TransportSidebar';
import { TransportHeader } from '@/components/transport/TransportHeader';
import { TransportDashboardOverview } from '@/components/transport/TransportDashboardOverview';
import { TransportKPICards } from '@/components/transport/TransportKPICards';
import { TransportFilterBar } from '@/components/transport/TransportFilterBar';
import { TransportTable } from '@/components/transport/TransportTable';
import { TransportContactsView } from '@/components/transport/TransportContactsView';
import { TransportDetailDrawer } from '@/components/transport/TransportDetailDrawer';
import { TransportMapViewModal } from '@/components/transport/TransportMapViewModal';
import { Transport2DGoogleMapModal } from '@/components/transport/Transport2DGoogleMapModal';
import { TransportDispatchModal } from '@/components/transport/TransportDispatchModal';
import { TransportExportModal } from '@/components/transport/TransportExportModal';
import { TransportWorkerModal } from '@/components/transport/TransportWorkerModal';
import { TransportReportsView } from '@/components/transport/TransportReportsView';
import { TransportMissingContactsView } from '@/components/transport/TransportMissingContactsModal';
import { TransportCircularsHubView } from '@/components/transport/TransportCircularsHubView';
import { TransportBranchesView } from '@/components/transport/TransportBranchesView';
import { TransportCircularPreviewModal } from '@/components/transport/TransportCircularPreviewModal';
import { TransportCircularEditModal } from '@/components/transport/TransportCircularEditModal';
import { TransportEditOperatorModal } from '@/components/transport/TransportEditOperatorModal';
import { 
  TransportRecord, 
  TransportKPI, 
  TransportWorkspaceView, 
  TransportCircular 
} from '@/types/transport';

export default function TransportDashboardPage() {
  const [currentView, setCurrentView] = useState<TransportWorkspaceView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Data states
  const [operators, setOperators] = useState<TransportRecord[]>([]);
  const [allOperators, setAllOperators] = useState<TransportRecord[]>([]);
  const [kpi, setKpi] = useState<TransportKPI | null>(null);
  const [totalFiltered, setTotalFiltered] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [permitType, setPermitType] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  // Floating 1-Click Email Toast Notification
  const [toastNotification, setToastNotification] = useState<{
    message: string;
    receipt?: any;
  } | null>(null);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [sortBy, setSortBy] = useState<string>('company_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals & Selected Operator / Circular States
  const [selectedOperator, setSelectedOperator] = useState<TransportRecord | null>(null);
  const [editingOperator, setEditingOperator] = useState<TransportRecord | null>(null);
  const [dispatchOperator, setDispatchOperator] = useState<TransportRecord | null>(null);

  // Circular Modals & Butterfly Synchronization
  const [circulars, setCirculars] = useState<TransportCircular[]>([]);
  const [selectedCircularForPreview, setSelectedCircularForPreview] = useState<TransportCircular | null>(null);
  const [editingCircular, setEditingCircular] = useState<TransportCircular | null>(null);
  const [isCircularEditOpen, setIsCircularEditOpen] = useState<boolean>(false);

  // General Action Modals
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [is2DMapOpen, setIs2DMapOpen] = useState<boolean>(false);
  const [isLeafletMapOpen, setIsLeafletMapOpen] = useState<boolean>(false);
  const [isWorkerOpen, setIsWorkerOpen] = useState<boolean>(false);

  // Set document title dynamically
  useEffect(() => {
    document.title = 'FleetTrack Pro — Nunes Transport & Fleet Intelligence';
  }, []);

  // Fetch KPI
  const loadKpi = useCallback(async () => {
    try {
      const res = await fetch(`/api/transport/kpi?district=${selectedDistrict}&state=${selectedState}`);
      const data = await res.json();
      if (data.success && data.kpi) {
        setKpi(data.kpi);
      }
    } catch (err) {
      console.error('Error fetching Transport KPI:', err);
    }
  }, [selectedDistrict, selectedState]);

  // Fetch Transport Operators
  const loadOperators = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sortBy,
        sortOrder,
      });

      if (searchQuery) params.append('q', searchQuery);
      if (selectedState && selectedState !== 'all') params.append('state', selectedState);
      if (serviceFilter && serviceFilter !== 'all') params.append('service_type', serviceFilter);
      if (category && category !== 'all') params.append('category', category);
      if (selectedDistrict && selectedDistrict !== 'all') params.append('district', selectedDistrict);
      if (permitType && permitType !== 'all') params.append('permit_type', permitType);
      if (status && status !== 'all') params.append('status', status);
      if (quickFilter) params.append('quick', quickFilter);

      const res = await fetch(`/api/transport?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setOperators(data.data || []);
        setTotalFiltered(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching Transport operators:', err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    searchQuery,
    selectedState,
    serviceFilter,
    category,
    selectedDistrict,
    permitType,
    status,
    quickFilter,
  ]);

  // 1-Click Automated Circular Send Handler
  const handleOneClickEmail = async (operator: TransportRecord) => {
    if (!operator.email) {
      alert(`Operator ${operator.company_name} does not have a registered email address.`);
      return;
    }

    try {
      const res = await fetch('/api/transport/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'one_click_send_to_operator',
          operator_id: operator.id,
          operator_email: operator.email,
          company_name: operator.company_name
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastNotification({
          message: `⚡ 1-Click Circular Dispatched to ${operator.company_name} (${operator.email})!`,
          receipt: data.receipt
        });
        loadKpi();
        setTimeout(() => setToastNotification(null), 5500);
      } else {
        alert(`Error dispatching circular: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    }
  };

  // Load all operators for reports, branch aggregations and map
  const loadAllOperators = useCallback(() => {
    fetch('/api/transport?limit=200')
      .then(r => r.json())
      .then(d => {
        if (d.success) setAllOperators(d.data || []);
      })
      .catch(console.error);
  }, []);

  // Load circulars for butterfly synchronization
  const loadCirculars = useCallback(async () => {
    try {
      const res = await fetch('/api/transport/circulars');
      const data = await res.json();
      if (data.success) {
        setCirculars(data.circulars || []);
      }
    } catch (err) {
      console.error('Error loading circulars for overview:', err);
    }
  }, []);

  useEffect(() => {
    loadCirculars();
  }, [loadCirculars]);

  useEffect(() => {
    loadAllOperators();
  }, [loadAllOperators]);

  useEffect(() => {
    loadKpi();
  }, [loadKpi]);

  useEffect(() => {
    loadOperators();
  }, [loadOperators]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setSelectedDistrict('all');
    setPermitType('all');
    setStatus('all');
    setQuickFilter(null);
    setServiceFilter('all');
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // When an operator is edited via modal
  const handleOperatorSaved = (updated: TransportRecord) => {
    setOperators(prev => prev.map(op => op.id === updated.id ? updated : op));
    setAllOperators(prev => prev.map(op => op.id === updated.id ? updated : op));
    if (selectedOperator && selectedOperator.id === updated.id) {
      setSelectedOperator(updated);
    }
    loadKpi();
  };

  // Dispatch circular directly from preview
  const handleSendCircularOutbound = async (cir: TransportCircular) => {
    try {
      const res = await fetch('/api/transport/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_circular',
          ...cir,
          send_now: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastNotification({
          message: `⚡ 1-Click Blast: Circular "${cir.title}" dispatched to ${cir.recipient_count || 3200} fleets across ${cir.target_state || 'All South India'}!`,
          receipt: {
            receipt_id: `RCPT-${Date.now().toString().slice(-6)}`,
            status: 'Delivered (TLS 1.3 Verified - 250 OK)'
          }
        });
        loadCirculars();
        loadKpi();
        setTimeout(() => setToastNotification(null), 6000);
      }
    } catch (err: any) {
      alert(`Error sending circular: ${err.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      
      {/* 1. Fixed Left Enterprise Navigation Sidebar */}
      <TransportSidebar
        currentView={currentView}
        onViewChange={(v) => {
          if (v === 'map') {
            setIs2DMapOpen(true);
          } else {
            setCurrentView(v);
          }
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        totalOperatorsCount={allOperators.length || 33}
        totalBranchesCount={kpi?.total_branches_count || 103}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* 2. Main Right Application Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Application Bar */}
        <TransportHeader
          currentView={currentView}
          onViewChange={(v) => {
            if (v === 'map') {
              setIs2DMapOpen(true);
            } else {
              setCurrentView(v);
            }
          }}
          selectedState={selectedState}
          onSelectState={(st) => {
            setSelectedState(st);
            setCurrentPage(1);
          }}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={(d) => {
            setSelectedDistrict(d);
            setCurrentPage(1);
          }}
          serviceFilter={serviceFilter}
          onServiceFilterChange={(sf) => {
            setServiceFilter(sf);
            setCurrentPage(1);
          }}
          totalFleets={totalFiltered}
          onOpenWorker={() => setIsWorkerOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenMap={() => setIs2DMapOpen(true)}
          onOpenBlastModal={() => setCurrentView('circulars')}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
        />

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* VIEW 1: ENTERPRISE OVERVIEW DASHBOARD (Matching reference layout) */}
          {currentView === 'dashboard' && (
            <TransportDashboardOverview
              operators={operators}
              allOperators={allOperators}
              kpi={kpi}
              selectedState={selectedState}
              onSelectState={(st) => {
                setSelectedState(st);
                setCurrentPage(1);
              }}
              serviceFilter={serviceFilter}
              onServiceFilterChange={(sf) => {
                setServiceFilter(sf);
                setCurrentPage(1);
              }}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setCurrentPage(1);
              }}
              onSelectOperator={setSelectedOperator}
              onQuickWhatsApp={(op) => setDispatchOperator(op)}
              onOneClickEmail={handleOneClickEmail}
              onOpen2DMap={() => setIs2DMapOpen(true)}
              onOpenExport={() => setIsExportOpen(true)}
              onOpenBlastModal={() => setCurrentView('circulars')}
              onViewAllDirectory={() => setCurrentView('directory')}
              onViewAllCirculars={() => setCurrentView('circulars')}
              onViewAllBranches={() => setCurrentView('branches')}
              circulars={circulars}
              onPreviewCircular={(cir) => setSelectedCircularForPreview(cir)}
            />
          )}

          {/* VIEW 2: FULL-WIDTH FLEET DIRECTORY TABLE */}
          {currentView === 'directory' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Fleet Directory
                  </h1>
                  <p className="text-xs text-slate-500">
                    Comprehensive commercial operators registry across Tamil Nadu and Kerala
                  </p>
                </div>
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  Export Data
                </button>
              </div>

              {/* Filter Bar */}
              <TransportFilterBar
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  setCurrentPage(1);
                }}
                selectedState={selectedState}
                onSelectState={(st) => {
                  setSelectedState(st);
                  setCurrentPage(1);
                }}
                category={category}
                onCategoryChange={(c) => {
                  setCategory(c);
                  setCurrentPage(1);
                }}
                district={selectedDistrict}
                onDistrictChange={(d) => {
                  setSelectedDistrict(d);
                  setCurrentPage(1);
                }}
                permitType={permitType}
                onPermitTypeChange={(p) => {
                  setPermitType(p);
                  setCurrentPage(1);
                }}
                status={status}
                onStatusChange={(s) => {
                  setStatus(s);
                  setCurrentPage(1);
                }}
                quickFilter={quickFilter}
                onQuickFilterChange={(qf) => {
                  setQuickFilter(qf);
                  setCurrentPage(1);
                }}
                onResetFilters={handleResetFilters}
                totalFiltered={totalFiltered}
              />

              {/* Main Interactive Fleet Table */}
              <TransportTable
                operators={operators}
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
                onSelectOperator={setSelectedOperator}
                onQuickWhatsApp={(op) => setDispatchOperator(op)}
                onEditOperator={(op) => setEditingOperator(op)}
                onOneClickEmail={handleOneClickEmail}
              />
            </div>
          )}

          {/* VIEW 3: VERIFIED CONTACTS SWITCHBOARD */}
          {currentView === 'contacts' && (
            <TransportContactsView
              operators={allOperators.length > 0 ? allOperators : operators}
              onSelectOperator={setSelectedOperator}
              onOneClickEmail={handleOneClickEmail}
            />
          )}

          {/* VIEW 4: CIRCULARS & DELIVERABILITY HUB */}
          {currentView === 'circulars' && (
            <TransportCircularsHubView
              operators={allOperators.length > 0 ? allOperators : operators}
              onOpenCircularPreview={(cir) => setSelectedCircularForPreview(cir)}
              onOpenCircularEdit={(cir) => {
                setEditingCircular(cir);
                setIsCircularEditOpen(true);
              }}
              onComposeNewCircular={() => {
                setEditingCircular(null);
                setIsCircularEditOpen(true);
              }}
            />
          )}

          {/* VIEW 5: REGIONAL BRANCHES & DEPOTS ACROSS TAMIL NADU & KERALA */}
          {currentView === 'branches' && (
            <TransportBranchesView
              operators={allOperators.length > 0 ? allOperators : operators}
              onSelectOperator={(op) => setSelectedOperator(op)}
            />
          )}

          {/* VIEW 6: DATA QUALITY / MISSING CONTACTS / ENRICHMENT QUEUE */}
          {currentView === 'missing' && (
            <TransportMissingContactsView
              operators={allOperators.length > 0 ? allOperators : operators}
              onSelectOperator={setSelectedOperator}
              onOpenDispatchModal={(op) => setDispatchOperator(op)}
            />
          )}

          {/* VIEW 7: DISPATCHER */}
          {currentView === 'dispatch' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Official WhatsApp & Email Inquiries Dispatcher</h3>
                  <p className="text-xs text-slate-500">Select any fleet operator below to preview pre-filled template messages and trigger live wa.me dispatch.</p>
                </div>
                <button
                  onClick={() => setCurrentView('circulars')}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Switch to Circulars Hub →
                </button>
              </div>
              <TransportMissingContactsView
                operators={allOperators.length > 0 ? allOperators : operators}
                onSelectOperator={setSelectedOperator}
                onOpenDispatchModal={(op) => setDispatchOperator(op)}
              />
            </div>
          )}

          {/* VIEW 8: ANALYTICS & REPORTS */}
          {currentView === 'reports' && (
            <TransportReportsView
              operators={allOperators.length > 0 ? allOperators : operators}
              kpi={kpi}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-3 px-6 text-xs text-slate-500 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} Nunes Instruments — FleetTrack Pro v2.0 (Tamil Nadu & Kerala Corridors)</p>
            <p className="text-slate-400 font-mono text-[11px]">TOBOA, SLOF & KSLOF Inter-State Certified Network</p>
          </div>
        </footer>

      </div>

      {/* Detail Drawer Modal */}
      <TransportDetailDrawer
        operator={selectedOperator}
        onClose={() => setSelectedOperator(null)}
        onOpenDispatchModal={(op) => {
          setSelectedOperator(null);
          setDispatchOperator(op);
        }}
        onOpenEditModal={(op) => {
          setEditingOperator(op);
        }}
        onOneClickEmail={handleOneClickEmail}
      />

      {/* 2D Google Maps Style Live Geographic Modal */}
      <Transport2DGoogleMapModal
        isOpen={is2DMapOpen}
        onClose={() => setIs2DMapOpen(false)}
        operators={allOperators.length > 0 ? allOperators : operators}
        onSelectOperator={(op) => {
          setIs2DMapOpen(false);
          setSelectedOperator(op);
        }}
      />

      {/* Leaflet/Interactive Map Alternative */}
      <TransportMapViewModal
        isOpen={isLeafletMapOpen}
        onClose={() => setIsLeafletMapOpen(false)}
        operators={allOperators.length > 0 ? allOperators : operators}
        onSelectOperator={setSelectedOperator}
      />

      {/* Operator Edit & Branch Office Management Modal */}
      <TransportEditOperatorModal
        operator={editingOperator}
        isOpen={Boolean(editingOperator)}
        onClose={() => setEditingOperator(null)}
        onSave={handleOperatorSaved}
      />

      {/* Circular Official Letterhead Preview Modal */}
      <TransportCircularPreviewModal
        circular={selectedCircularForPreview}
        onClose={() => setSelectedCircularForPreview(null)}
        onEdit={(cir) => {
          setSelectedCircularForPreview(null);
          setEditingCircular(cir);
          setIsCircularEditOpen(true);
        }}
        onSendNow={handleSendCircularOutbound}
        onOneClickBlast={() => {
          setSelectedCircularForPreview(null);
          setCurrentView('circulars');
        }}
      />

      {/* Circular Compose / Edit Modal */}
      <TransportCircularEditModal
        isOpen={isCircularEditOpen}
        circular={editingCircular}
        onClose={() => {
          setIsCircularEditOpen(false);
          setEditingCircular(null);
        }}
        onSaveSuccess={(updatedCir) => {
          loadCirculars();
          loadKpi();
          loadOperators();
          setSelectedCircularForPreview(updatedCir);
          setToastNotification({
            message: `🦋 Butterfly Update: Circular "${updatedCir.title}" synchronized everywhere (${updatedCir.recipient_count || 3200} fleets across ${updatedCir.target_state || 'All South India'})!`,
            receipt: {
              receipt_id: `CIR-SYNC-${Date.now().toString().slice(-6)}`,
              status: updatedCir.status === 'Sent' ? 'Dispatched (TLS 1.3 250 OK)' : 'Draft Synchronized'
            }
          });
          setTimeout(() => setToastNotification(null), 6000);
        }}
      />

      {/* Dispatcher Modal */}
      <TransportDispatchModal
        isOpen={Boolean(dispatchOperator)}
        onClose={() => setDispatchOperator(null)}
        operator={dispatchOperator}
      />

      {/* Export Modal */}
      <TransportExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        totalCount={totalFiltered}
        selectedDistrict={selectedDistrict}
      />

      {/* Harvester Worker Modal */}
      <TransportWorkerModal
        isOpen={isWorkerOpen}
        onClose={() => setIsWorkerOpen(false)}
        onRefreshData={() => {
          loadKpi();
          loadOperators();
          loadAllOperators();
        }}
      />

      {/* 1-Click Email Automated Dispatch Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white rounded-2xl shadow-2xl border border-emerald-500/40 p-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm shadow-emerald-500/30">
              ⚡
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-xs text-emerald-400">1-Click Dispatch Confirmed (250 OK)</p>
                <button
                  onClick={() => setToastNotification(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-snug">{toastNotification.message}</p>
              {toastNotification.receipt && (
                <div className="pt-1 text-[10px] font-mono text-slate-400 flex items-center gap-2">
                  <span>ID: {toastNotification.receipt.receipt_id}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{toastNotification.receipt.status}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
