'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  Mail, 
  MessageCircle, 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Send, 
  XCircle, 
  Inbox, 
  Sparkles, 
  ListTodo,
  TrendingUp,
  MapPin,
  ArrowRight,
  Filter,
  Eye,
  Download,
  Users,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Layers,
  ChevronRight,
  UserCheck,
  BarChart3,
  Flame,
  Radio,
  FileCheck,
  Paperclip
} from 'lucide-react';

import { 
  CircularSectionTab, 
  UserRole, 
  CircularV2Template, 
  CircularV2Campaign, 
  CircularV2Attachment,
  DeliveryEventRecord, 
  InboundReplyV2, 
  FollowUpTaskV2, 
  CircularV2DashboardMetrics,
  RecipientHierarchyFilters,
  VerifiedSchoolRecipient
} from '@/types/circular';

import { 
  EXACT_CATALOGUE_PDF, 
  PREBUILT_CIRCULAR_TEMPLATES, 
  NUNES_OFFICIAL_CONTACTS, 
  NUNES_INTERNAL_BCC_LIST 
} from '@/lib/data/circularV2Constants';

import { CircularDashboardSection } from './CircularDashboardSection';
import { CreateCircularSection } from './CreateCircularSection';
import { CircularTemplatesSection } from './CircularTemplatesSection';
import { RecipientSelectionSection } from './RecipientSelectionSection';
import { PdfAttachmentManagerSection } from './PdfAttachmentManagerSection';
import { EmailWhatsAppPreviewSection } from './EmailWhatsAppPreviewSection';
import { TestAndApprovalSection } from './TestAndApprovalSection';
import { SendCampaignsSection } from './SendCampaignsSection';
import { DeliveryTrackingSection } from './DeliveryTrackingSection';
import { RepliesAndEnquiriesSection } from './RepliesAndEnquiriesSection';
import { ReportsAndExportsSection } from './ReportsAndExportsSection';
import { PdfViewerModal } from './PdfViewerModal';
import { GmailAttachmentModal } from './GmailAttachmentModal';

interface CircularCenterHubProps {
  selectedState?: string;
  selectedDistrict?: string;
  onNavigateToCommunications?: () => void;
  onSelectState?: (state: string) => void;
  onSelectDistrict?: (district: string) => void;
}

export const CircularCenterHub: React.FC<CircularCenterHubProps> = ({
  selectedState = 'all',
  selectedDistrict = 'coimbatore',
  onNavigateToCommunications,
  onSelectState,
  onSelectDistrict
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<CircularSectionTab>('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('ADMIN');

  // Active Template & Preview states
  const [selectedTemplate, setSelectedTemplate] = useState<CircularV2Template>(PREBUILT_CIRCULAR_TEMPLATES[0]);
  const [activeSubject, setActiveSubject] = useState<string>(PREBUILT_CIRCULAR_TEMPLATES[0].subject);
  const [activeBody, setActiveBody] = useState<string>(PREBUILT_CIRCULAR_TEMPLATES[0].body);

  // Dynamic Attachments Management (Supports any PDF added manually)
  const [activeAttachment, setActiveAttachment] = useState<CircularV2Attachment>(EXACT_CATALOGUE_PDF);
  const [attachmentsList, setAttachmentsList] = useState<CircularV2Attachment[]>([EXACT_CATALOGUE_PDF]);

  // Geographic scope
  const [scopeState, setScopeState] = useState<string>(selectedState);
  const [scopeDistrict, setScopeDistrict] = useState<string>(selectedDistrict);

  // PDF Viewer Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [pdfModalData, setPdfModalData] = useState<{ url: string; title: string }>({
    url: EXACT_CATALOGUE_PDF.urlPath,
    title: EXACT_CATALOGUE_PDF.filename
  });

  // Gmail Attachment Assistant Modal
  const [isGmailModalOpen, setIsGmailModalOpen] = useState<boolean>(false);
  const [lastGmailUrl, setLastGmailUrl] = useState<string>('');

  // Data Stores
  const [metrics, setMetrics] = useState<CircularV2DashboardMetrics | null>(null);
  const [campaigns, setCampaigns] = useState<CircularV2Campaign[]>([]);
  const [deliveryEvents, setDeliveryEvents] = useState<DeliveryEventRecord[]>([]);
  const [replies, setReplies] = useState<InboundReplyV2[]>([]);
  const [followUpTasks, setFollowUpTasks] = useState<FollowUpTaskV2[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(new Date().toLocaleTimeString());

  // Load telemetry & campaigns from API
  const fetchHubData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/circulars/v2?state=${scopeState}&district=${scopeDistrict}`);
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) setMetrics(data.metrics);
        if (data.campaigns) setCampaigns(data.campaigns);
        if (data.delivery_events || data.deliveryEvents) {
          setDeliveryEvents(data.delivery_events || data.deliveryEvents);
        }
        if (data.replies || data.inboundReplies) {
          setReplies(data.replies || data.inboundReplies);
        }
        if (data.follow_up_tasks || data.followUpTasks) {
          setFollowUpTasks(data.follow_up_tasks || data.followUpTasks);
        }
        if (data.attachments && Array.isArray(data.attachments)) {
          setAttachmentsList(data.attachments);
        }
        setLastRefreshedAt(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to load Circular Center V2 data:', err);
    } finally {
      setLoading(false);
    }
  }, [scopeState, scopeDistrict]);

  useEffect(() => {
    fetchHubData();
  }, [fetchHubData]);

  // Handle template selection
  const handleSelectTemplate = (tpl: CircularV2Template) => {
    setSelectedTemplate(tpl);
    setActiveSubject(tpl.subject);
    setActiveBody(tpl.body);
  };

  // Open PDF viewer with any file
  const handleOpenPdfModal = (url?: string, title?: string) => {
    setPdfModalData({
      url: url || activeAttachment.urlPath,
      title: title || activeAttachment.filename
    });
    setIsPdfModalOpen(true);
  };

  // Launch Gmail Web Composer with physical file download & Attachment Assistant
  const handleLaunchGmailWeb = (subjectParam?: string, bodyParam?: string, attachmentParam?: CircularV2Attachment) => {
    const subj = subjectParam || activeSubject;
    const att = attachmentParam || activeAttachment;
    let body = bodyParam || activeBody;

    // 1. Immediately trigger physical download of the active PDF so user can attach it via 📎 in Gmail
    if (typeof window !== 'undefined') {
      try {
        const link = document.createElement('a');
        link.href = att.urlPath;
        link.download = att.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.warn('Auto-download trigger notice:', err);
      }
    }

    // 2. Embed direct verified cloud download link and Google Drive mirror inside template body
    const cloudUrl = `https://nunes-transport.vercel.app${att.urlPath}`;
    const attachmentNotice = `\n\n================================================================\n📎 ATTACHED OFFICIAL ENCLOSURE:\nDocument: ${att.filename} (${att.pageCount} Pages, ${att.sizeFormatted})\nDirect Verified Download: ${cloudUrl}\nOfficial Google Drive Directive: https://drive.google.com/file/d/1PgEWdCogcIsrZ3Xv9q6NdDtRhgL8bSeF/view?usp=sharing\n(Physical PDF copy also attached to this email)\n================================================================`;

    if (!body.includes(att.filename) && !body.includes('ATTACHED OFFICIAL ENCLOSURE')) {
      body = `${body}${attachmentNotice}`;
    }

    // 3. Compose standard Gmail Web URL with 9 BCC coordinators
    const bccList = NUNES_INTERNAL_BCC_LIST.join(',');
    const encodedSubject = encodeURIComponent(subj);
    const encodedBody = encodeURIComponent(body);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${encodeURIComponent(bccList)}&su=${encodedSubject}&body=${encodedBody}`;
    setLastGmailUrl(gmailUrl);

    // Open Gmail
    window.open(gmailUrl, '_blank');

    // 4. Open Gmail Attachment Assistant to guide user in clicking 📎 or dragging the downloaded file
    setIsGmailModalOpen(true);
  };

  const handleLaunchCampaignGmailWeb = (campaign: CircularV2Campaign) => {
    handleLaunchGmailWeb(campaign.subject, campaign.body_text || campaign.body || '', campaign.attachment || activeAttachment);
  };

  // Tab definitions with badges
  const navTabs: Array<{
    id: CircularSectionTab;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: '1. Dashboard',
      shortLabel: 'Dashboard',
      icon: TrendingUp,
      badge: metrics?.total_schools_in_scope ? `${metrics.total_schools_in_scope}` : undefined,
      badgeColor: 'bg-sky-100 text-sky-800'
    },
    {
      id: 'create',
      label: '2. Create Circular',
      shortLabel: 'Create',
      icon: Sparkles
    },
    {
      id: 'templates',
      label: '3. Circular Templates',
      shortLabel: 'Templates',
      icon: FileText,
      badge: `${PREBUILT_CIRCULAR_TEMPLATES.length}`,
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'recipients',
      label: '4. Recipient Selection',
      shortLabel: 'Recipients',
      icon: Users,
      badge: (metrics?.contact_ready_schools ?? metrics?.verified_emails) ? `${metrics?.contact_ready_schools ?? metrics?.verified_emails}` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'attachments',
      label: '5. PDF Catalogue Manager',
      shortLabel: 'PDF Attachments',
      icon: FileCheck,
      badge: `${attachmentsList.length} File${attachmentsList.length === 1 ? '' : 's'}`,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'preview',
      label: '6. Email & WhatsApp Preview',
      shortLabel: 'Live Preview',
      icon: Eye
    },
    {
      id: 'approval',
      label: '7. Test & Approval',
      shortLabel: 'Approvals',
      icon: ShieldCheck,
      badge: (metrics?.pending_approvals ?? metrics?.pending_approval) ? `${metrics?.pending_approvals ?? metrics?.pending_approval}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'campaigns',
      label: '8. Send Campaigns',
      shortLabel: 'Dispatch',
      icon: Send,
      badge: campaigns.length ? `${campaigns.length}` : undefined,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'tracking',
      label: '9. Delivery Tracking',
      shortLabel: 'Telemetry',
      icon: Radio,
      badge: deliveryEvents.length ? `${deliveryEvents.length}` : undefined,
      badgeColor: 'bg-cyan-100 text-cyan-800'
    },
    {
      id: 'replies',
      label: '10. Replies & Inbound Leads',
      shortLabel: 'Replies',
      icon: Inbox,
      badge: replies.length ? `${replies.length}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'reports',
      label: '11. Reports & Exports',
      shortLabel: 'Reports',
      icon: Download
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      
      {/* =========================================================================
          TOP COMMAND SUITE HEADER
      ========================================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white shadow-2xl border border-sky-800/40 p-5 sm:p-6">
        
        {/* Glow backdrop decorative */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Brand & Badge Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                NUNES CIRCULAR CENTER V2.0
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Active PDF: {activeAttachment.filename.slice(0, 28)}...
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                TN (38) + Kerala (14) Active
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>Institutional Outreach &amp; Circular Management Suite</span>
            </h1>
            <p className="text-xs sm:text-sm text-sky-200/90 max-w-3xl leading-relaxed">
              Enterprise outreach system with manual PDF attachment support, verified 16-page catalogues, multi-tier approval pipeline, and Gmail Web synchronization.
            </p>
          </div>

          {/* Right Action Tools: Role Selector & Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            
            {/* Role Simulator Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <div className="text-left">
                <span className="block text-[9px] uppercase font-bold text-slate-400 leading-tight">Operating Role</span>
                <select
                  value={currentUserRole}
                  onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
                >
                  <option value="ADMIN" className="bg-slate-900 text-white">Admin (Full Control)</option>
                  <option value="MARKETING" className="bg-slate-900 text-white">Outreach Manager</option>
                  <option value="SALES" className="bg-slate-900 text-white">Sales &amp; Enquiries</option>
                  <option value="VIEWER" className="bg-slate-900 text-white">Audit Viewer</option>
                </select>
              </div>
            </div>

            {/* Quick PDF Viewer Button */}
            <button
              type="button"
              onClick={() => handleOpenPdfModal()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer hover:scale-102"
              title="Inspect active attached PDF"
            >
              <FileCheck className="w-4 h-4" />
              <span>Inspect Attached PDF</span>
            </button>

            {/* Direct Gmail Web Compose Button */}
            <button
              type="button"
              onClick={() => handleLaunchGmailWeb()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer hover:scale-102"
              title="Compose in Gmail Web with 9 Nunes BCC coordinators attached and auto-downloaded PDF"
            >
              <Mail className="w-4 h-4" />
              <span>Gmail Web (9 BCC)</span>
            </button>

            {/* Refresh Data */}
            <button
              type="button"
              onClick={fetchHubData}
              disabled={loading}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/20 cursor-pointer disabled:opacity-50"
              title={`Refresh live telemetry (Last: ${lastRefreshedAt})`}
            >
              <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

          </div>
        </div>

        {/* Quick Ticker Metric Strip */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-slate-300 block font-medium">Schools in Scope</span>
            <span className="text-sm font-extrabold text-white">
              {metrics ? metrics.total_schools_in_scope.toLocaleString() : '21,120'}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-emerald-300 block font-medium">Contact Ready</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {metrics ? (metrics.contact_ready_schools ?? metrics.verified_emails ?? 17364).toLocaleString() : '17,364'}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-sky-300 block font-medium">Verified Email Ratio</span>
            <span className="text-sm font-extrabold text-sky-400">
              {metrics ? `${metrics.email_coverage_percent ?? 82.2}%` : '82.2%'}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-indigo-300 block font-medium">PDF Repository</span>
            <span className="text-sm font-extrabold text-indigo-300">
              {attachmentsList.length} Active Files
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-amber-300 block font-medium">Pending Approvals</span>
            <span className="text-sm font-extrabold text-amber-400">
              {metrics ? (metrics.pending_approvals ?? metrics.pending_approval ?? 2) : '2'}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-rose-300 block font-medium">Inbound Replies</span>
            <span className="text-sm font-extrabold text-rose-400">
              {metrics ? (metrics.total_replies_received ?? metrics.replies_received ?? 18) : '18'}
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          HORIZONTAL NAVIGATION TAB BAR (11 SECTIONS)
      ========================================================================== */}
      <div className="sticky top-2 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-1.5 shadow-lg border border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 px-0.5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TAB CONTENT RENDERING
      ========================================================================== */}
      <div className="min-h-[500px]">
        {activeTab === 'dashboard' && (
          <CircularDashboardSection
            metrics={metrics}
            onNavigateTab={(tab) => setActiveTab(tab)}
            selectedState={scopeState}
            selectedDistrict={scopeDistrict}
            onSelectState={(st) => {
              setScopeState(st);
              onSelectState?.(st);
            }}
            onSelectDistrict={(dist) => {
              setScopeDistrict(dist);
              onSelectDistrict?.(dist);
            }}
          />
        )}

        {activeTab === 'create' && (
          <CreateCircularSection
            initialTemplate={selectedTemplate}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenPdfModal={(url, title) => handleOpenPdfModal(url, title)}
            onLaunchGmailWeb={(subj, body, att) => handleLaunchGmailWeb(subj, body, att)}
            activeAttachment={activeAttachment}
            onSelectAttachment={(att) => setActiveAttachment(att)}
            availableAttachments={attachmentsList}
            onRefreshAttachments={fetchHubData}
          />
        )}

        {activeTab === 'templates' && (
          <CircularTemplatesSection
            onSelectTemplate={handleSelectTemplate}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenPdfModal={() => handleOpenPdfModal()}
          />
        )}

        {activeTab === 'recipients' && (
          <RecipientSelectionSection
            selectedState={scopeState}
            selectedDistrict={scopeDistrict}
            onSelectState={(st) => {
              setScopeState(st);
              onSelectState?.(st);
            }}
            onSelectDistrict={(dist) => {
              setScopeDistrict(dist);
              onSelectDistrict?.(dist);
            }}
          />
        )}

        {activeTab === 'attachments' && (
          <PdfAttachmentManagerSection
            onOpenPdfModal={(url, title) => handleOpenPdfModal(url, title)}
            activeAttachment={activeAttachment}
            onSelectAttachment={(att) => setActiveAttachment(att)}
            attachmentsList={attachmentsList}
            onRefreshAttachments={fetchHubData}
          />
        )}

        {activeTab === 'preview' && (
          <EmailWhatsAppPreviewSection
            subject={activeSubject}
            bodyText={activeBody}
            activeAttachment={activeAttachment}
            onOpenPdfModal={() => handleOpenPdfModal()}
            onLaunchGmailWeb={() => handleLaunchGmailWeb()}
          />
        )}

        {activeTab === 'approval' && (
          <TestAndApprovalSection
            campaigns={campaigns}
            onNavigateTab={(tab) => setActiveTab(tab)}
            currentUserRole={currentUserRole}
            onRefresh={fetchHubData}
          />
        )}

        {activeTab === 'campaigns' && (
          <SendCampaignsSection
            campaigns={campaigns}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onLaunchGmailWeb={handleLaunchCampaignGmailWeb}
            onOpenPdfModal={(url, title) => handleOpenPdfModal(url, title)}
            onRefresh={fetchHubData}
          />
        )}

        {activeTab === 'tracking' && (
          <DeliveryTrackingSection
            events={deliveryEvents}
            onRefresh={fetchHubData}
            onOpenPdfModal={(url, title) => handleOpenPdfModal(url, title)}
          />
        )}

        {activeTab === 'replies' && (
          <RepliesAndEnquiriesSection
            replies={replies}
            followUpTasks={followUpTasks}
            onRefresh={fetchHubData}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsAndExportsSection
            selectedState={scopeState}
            selectedDistrict={scopeDistrict}
          />
        )}
      </div>

      {/* =========================================================================
          EMBEDDED PDF VIEWER MODAL (WORKS WITH ANY PDF)
      ========================================================================== */}
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfUrl={pdfModalData.url}
        title={pdfModalData.title}
      />

      {/* =========================================================================
          GMAIL ATTACHMENT ASSISTANT MODAL (ASSISTS IN ATTACHING PDF IN GMAIL)
      ========================================================================== */}
      <GmailAttachmentModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        attachment={activeAttachment}
        subject={activeSubject}
        bodyText={activeBody}
        onReopenGmail={() => {
          if (lastGmailUrl) window.open(lastGmailUrl, '_blank');
        }}
      />

    </div>
  );
};
