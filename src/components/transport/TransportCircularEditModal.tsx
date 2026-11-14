'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Send, 
  FileText, 
  ShieldCheck, 
  Paperclip, 
  Users, 
  Tag, 
  Building2,
  Sparkles,
  Globe2,
  MapPin,
  CheckCircle2,
  Zap,
  Info
} from 'lucide-react';
import { TransportCircular } from '@/types/transport';

interface TransportCircularEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  circular: TransportCircular | null;
  onSaveSuccess: (circular: TransportCircular) => void;
}

const CATEGORIES = [
  'Fleet Safety & RTO Mandate',
  'Kerala MVD & AIS-140 GPS Telematics Mandate',
  'Inter-State Walayar Border & Toll RFID FASTag Compliance',
  'Monsoon Ghat Road & Retarder Safety Advisory (TN-KL)',
  'Port Container & ICTT Vallarpadam Drayage Protocol',
  'Speed Governor Compliance',
  'Freight Corridor & Toll Revision',
  'Pollution & Fitness Certification',
  'Bulk Petroleum Safety Protocol',
  'All India Tourist Permit (AITP) 2026 Inter-State Reciprocity',
  'Driver Welfare & Highway Rest Stop Advisory',
  'General Technical Notice'
];

const TARGET_AUDIENCES = [
  '🌐 All Registered Transport Fleets (South India - TN & KL)',
  '🌴 Kerala Registered Fleets (All 14 Districts - KSRTC, KSLOF, Omni Buses)',
  '🌿 Tamil Nadu Registered Fleets (All 38 Districts - TOBOA, SLOF)',
  'Inter-State Walayar & NH 544 Express Corridor Operators',
  'Coastal NH 66 Logistics & Port Carriers (Kochi ICTT & Chennai)',
  'Omni Bus Operators (Inter-State Luxury Sleeper & KSRTC SWIFT)',
  'Heavy Lorry & Container Fleets (SLOF & KSLOF Federation)',
  'Bulk LPG & Cryogenic Petroleum Tanker Carriers',
  'Central Kerala Commercial Transit (Ernakulam, Palakkad, Thrissur)',
  'Western Tamil Nadu Industrial Belt (Coimbatore, Tiruppur, Salem, Namakkal)',
  'Chennai Port & Kochi Vallarpadam Container Drayage'
];

const SOUTH_INDIA_DISTRICT_HUBS = [
  // Kerala Hubs
  { id: 'ernakulam', name: 'Kochi / Ernakulam', state: 'Kerala', flag: '🌴' },
  { id: 'palakkad', name: 'Palakkad (Walayar)', state: 'Kerala', flag: '🌴' },
  { id: 'kozhikode', name: 'Kozhikode', state: 'Kerala', flag: '🌴' },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', state: 'Kerala', flag: '🌴' },
  { id: 'thrissur', name: 'Thrissur', state: 'Kerala', flag: '🌴' },
  // Tamil Nadu Hubs
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', flag: '🌿' },
  { id: 'namakkal', name: 'Namakkal', state: 'Tamil Nadu', flag: '🌿' },
  { id: 'salem', name: 'Salem / Sankagiri', state: 'Tamil Nadu', flag: '🌿' },
  { id: 'chennai', name: 'Chennai Port', state: 'Tamil Nadu', flag: '🌿' },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu', flag: '🌿' },
  { id: 'tiruppur', name: 'Tiruppur', state: 'Tamil Nadu', flag: '🌿' }
];

export const TransportCircularEditModal: React.FC<TransportCircularEditModalProps> = ({
  isOpen,
  onClose,
  circular,
  onSaveSuccess
}) => {
  const [title, setTitle] = useState('');
  const [refNo, setRefNo] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [targetState, setTargetState] = useState<'all' | 'Tamil Nadu' | 'Kerala'>('all');
  const [targetAudience, setTargetAudience] = useState(TARGET_AUDIENCES[0]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(['all']);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [signatoryName, setSignatoryName] = useState('Er. K. R. Senthil Kumar, B.E., M.I.E.');
  const [signatoryTitle, setSignatoryTitle] = useState('Director of Technical Services & Logistics Standards');
  const [issuingAuthority, setIssuingAuthority] = useState('Nunes Instruments — South India Inter-State Transport Directorate');
  const [recipientCount, setRecipientCount] = useState(3200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [butterflyNotice, setButterflyNotice] = useState<string>('');

  // Butterfly Effect: Trigger automatic updates everywhere connected when State or Audience changes
  const applyButterflyUpdate = (state: 'all' | 'Tamil Nadu' | 'Kerala', audience?: string) => {
    setTargetState(state);
    
    if (state === 'Kerala') {
      setRecipientCount(1120);
      setIssuingAuthority('Nunes Instruments — Kerala Regional Logistics & Metrology Cell (Ernakulam & Trivandrum)');
      setAttachmentName('MVD_Kerala_AIS140_Compliance_Form.pdf');
      setSelectedDistricts(['ernakulam', 'palakkad', 'kozhikode', 'thiruvananthapuram', 'thrissur']);
      if (!audience) setTargetAudience('🌴 Kerala Registered Fleets (All 14 Districts - KSRTC, KSLOF, Omni Buses)');
      
      setBody(`To All Managing Directors, Fleet Proprietors, and Depot Controllers,
Kerala State Transport Undertakings (KSRTC SWIFT), KSLOF Member Operators & Omni Bus Fleets.

Subject: Kerala Motor Vehicles Department (MVD) & Transport Commissionerate Mandate — Bi-Annual Verification of AIS-140 GPS Telematics & Speed Limiter Calibration (2026-27).

In accordance with Motor Vehicles Department Kerala (MVD) directives and MoRTH safety guidelines, all commercial passenger stage carriages and heavy multi-axle freight carriers registered or operating within Kerala must ensure valid bi-annual calibration of AIS-140 GPS tracking devices, emergency SOS panic buttons, and electronic speed limiters before regional RTO fitness inspections.

Nunes Instruments provides NABL-accredited diagnostic calibration, digital tachograph servicing, and speed limiter testing at all key Kerala logistics hubs (Ernakulam / Kochi Vallarpadam ICTT, Palakkad Walayar Border, Kozhikode Mavoor Road, Thiruvananthapuram, and Thrissur).

Key Guidelines for Kerala Operations:
1. Walayar & Inter-State Checkposts: Mandatory verification of FASTag 3.0 commercial RFID tags.
2. Ghat Road Monsoon Safety: Mandatory auxiliary retarder and exhaust brake efficiency certification for Wayanad, Idukki, and Palakkad corridors.
3. KSRTC SWIFT & Private Intercity Buses: Emergency exit window illumination and 112 Command Center integration.

Please ensure your depot managers schedule calibration for scheduled fleets prior to the regional RTO deadline.`);

      setButterflyNotice('🦋 Butterfly effect active: Recipient count, Kerala hubs, MVD attachments, and Ernakulam directorate auto-synchronized!');
    } 
    else if (state === 'Tamil Nadu') {
      setRecipientCount(2080);
      setIssuingAuthority('Nunes Instruments — Tamil Nadu Transport & Metrology Directorate (Coimbatore HQ)');
      setAttachmentName('AIS140_Calibration_Form_TN.pdf');
      setSelectedDistricts(['coimbatore', 'namakkal', 'salem', 'chennai', 'madurai', 'tiruppur']);
      if (!audience) setTargetAudience('🌿 Tamil Nadu Registered Fleets (All 38 Districts - TOBOA, SLOF)');

      setBody(`To All Managing Directors, Fleet Proprietors, and Depot Managers,
Tamil Nadu Commercial Bus & Freight Logistics Operators (TOBOA & SLOF).

Subject: Compliance Directive — Mandatory Calibration of AIS-140 Certified GPS Telematics, FASTag Priority Lanes, and Emergency Response System.

In accordance with Tamil Nadu State Transport Authority (STA) enforcement regulations, all heavy commercial goods carriages and private Omni passenger buses registered in Tamil Nadu are required to submit their annual electronic telematics audit certificate.

Nunes Instruments provides NABL-accredited diagnostic calibration at all major Tamil Nadu transport hubs (Coimbatore, Namakkal, Sankagiri, Salem, Chennai Koyambedu, and Madurai).

Please ensure your depot managers schedule calibration for scheduled fleets prior to the regional RTO deadline.`);

      setButterflyNotice('🦋 Butterfly effect active: Recipient count, Tamil Nadu hubs, and TOBOA/SLOF directorate auto-synchronized!');
    } 
    else {
      // All South India
      setRecipientCount(3200);
      setIssuingAuthority('Nunes Instruments — South India Inter-State Transport Directorate (Tamil Nadu & Kerala Divisions)');
      setAttachmentName('AIS140_InterState_Calibration_Form_TN_KL.pdf');
      setSelectedDistricts(['all']);
      if (!audience) setTargetAudience('🌐 All Registered Transport Fleets (South India - TN & KL)');

      setBody(`To All Managing Directors, Fleet Proprietors, and Depot Managers,
South India Commercial Transport Fleets (Tamil Nadu TOBOA, SLOF, Kerala KSRTC SWIFT & KSLOF).

Subject: Comprehensive Inter-State Fleet Safety & Telematics Standardization Directive — Tamil Nadu & Kerala Express Corridors (NH 544 & NH 66).

In accordance with joint transport safety protocols established between Tamil Nadu and Kerala Transport Commissionerates, all inter-state passenger coaches and heavy goods bulkers operating across Southern corridors must verify AIS-140 GPS tracking devices, speed governors (80 km/h goods / 90 km/h buses), and FASTag RFID integration.

Nunes Instruments operates accredited calibration stations across major inter-state nexus points:
• Western Industrial Belt: Coimbatore, Namakkal, Salem & Sankagiri
• Kerala Gateway & Ports: Ernakulam / Kochi Vallarpadam ICTT & Palakkad Walayar
• Regional Terminals: Chennai Koyambedu, Kozhikode, and Thiruvananthapuram

Please ensure all inter-state vehicles carry certified calibration certificates.`);

      setButterflyNotice('🦋 Butterfly effect active: Full South India inter-state scope (3,200 recipients across TN & KL) auto-synchronized!');
    }

    setTimeout(() => setButterflyNotice(''), 4500);
  };

  useEffect(() => {
    if (circular) {
      setTitle(circular.title || '');
      setRefNo(circular.ref_no || '');
      setCategory(circular.category || CATEGORIES[0]);
      setTargetState(circular.target_state || 'all');
      setTargetAudience(circular.target_audience || TARGET_AUDIENCES[0]);
      setSelectedDistricts(circular.target_districts || ['all']);
      setSubject(circular.subject || '');
      setBody(circular.body || '');
      setAttachmentName(circular.attachment_name || '');
      setSignatoryName(circular.signatory_name || 'Er. K. R. Senthil Kumar, B.E., M.I.E.');
      setSignatoryTitle(circular.signatory_title || 'Director of Technical Services & Logistics Standards');
      setIssuingAuthority(circular.issuing_authority || 'Nunes Instruments — South India Inter-State Transport Directorate');
      setRecipientCount(circular.recipient_count || 3200);
    } else {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(100 + Math.random() * 900);
      setTitle('RTO Vehicle Tracking & Speed Limiter Calibration Notice (South India Fleets)');
      setRefNo(`NUNES/TR/${year}/${randomNum}`);
      setCategory(CATEGORIES[0]);
      applyButterflyUpdate('all');
    }
  }, [circular, isOpen]);

  if (!isOpen) return null;

  const toggleDistrict = (distId: string) => {
    if (distId === 'all') {
      setSelectedDistricts(['all']);
      return;
    }
    setSelectedDistricts(prev => {
      const withoutAll = prev.filter(d => d !== 'all');
      if (withoutAll.includes(distId)) {
        const next = withoutAll.filter(d => d !== distId);
        return next.length === 0 ? ['all'] : next;
      } else {
        return [...withoutAll, distId];
      }
    });
  };

  const handleSubmit = async (sendNow: boolean) => {
    if (!title.trim() || !subject.trim() || !body.trim()) {
      alert('Please fill in Title, Subject, and Body content.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        title,
        ref_no: refNo,
        category,
        target_state: targetState,
        target_audience: targetAudience,
        target_districts: selectedDistricts,
        subject,
        body,
        attachment_name: attachmentName.trim() || undefined,
        signatory_name: signatoryName,
        signatory_title: signatoryTitle,
        issuing_authority: issuingAuthority,
        recipient_count: Number(recipientCount) || 3200,
        send_now: sendNow
      };

      if (circular && circular.id) {
        payload.action = 'update_circular';
        payload.id = circular.id;
        if (sendNow) payload.status = 'Sent';
      } else {
        payload.action = 'create_circular';
      }

      const res = await fetch('/api/transport/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.circular) {
        onSaveSuccess(data.circular);
        onClose();
      } else {
        alert(data.error || 'Failed to save circular');
      }
    } catch (err: any) {
      alert(`Error saving circular: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {circular ? 'Edit Official Circular & Notice' : 'Draft New Official Transport Circular'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                  {targetState === 'all' ? '🌐 South India' : targetState === 'Kerala' ? '🌴 Kerala Fleets' : '🌿 Tamil Nadu Fleets'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official Letterhead Dispatch • Email & WhatsApp Circular Workflow
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Butterfly Synchronized Banner */}
        {butterflyNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in duration-150">
            <span className="text-emerald-600">🦋</span>
            <span>{butterflyNotice}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Butterfly State Selector Strip */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-emerald-50/80 rounded-xl border border-blue-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-blue-600" />
                <span>Target Geographic Scope (Butterfly Auto-Sync)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Updates recipients, attachments & text everywhere
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyButterflyUpdate('all')}
                className={`p-2 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  targetState === 'all'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌐</span>
                  <div>
                    <p className="text-xs font-bold leading-tight">All South India</p>
                    <p className={`text-[10px] leading-tight ${targetState === 'all' ? 'text-blue-100' : 'text-slate-400'}`}>TN & KL (3,200 Fleets)</p>
                  </div>
                </div>
                {targetState === 'all' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>

              <button
                type="button"
                onClick={() => applyButterflyUpdate('Kerala')}
                className={`p-2 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  targetState === 'Kerala'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌴</span>
                  <div>
                    <p className="text-xs font-bold leading-tight">Kerala Registered</p>
                    <p className={`text-[10px] leading-tight ${targetState === 'Kerala' ? 'text-emerald-100' : 'text-slate-400'}`}>14 Districts (1,120 Fleets)</p>
                  </div>
                </div>
                {targetState === 'Kerala' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>

              <button
                type="button"
                onClick={() => applyButterflyUpdate('Tamil Nadu')}
                className={`p-2 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  targetState === 'Tamil Nadu'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌿</span>
                  <div>
                    <p className="text-xs font-bold leading-tight">Tamil Nadu Registered</p>
                    <p className={`text-[10px] leading-tight ${targetState === 'Tamil Nadu' ? 'text-indigo-100' : 'text-slate-400'}`}>38 Districts (2,080 Fleets)</p>
                  </div>
                </div>
                {targetState === 'Tamil Nadu' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>

          {/* Row 1: Title & Reference No */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <span>Circular Title</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AIS 140 GPS & Speed Limiter Bi-Annual Verification"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <span>Reference Number</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                placeholder="NUNES/TR/2026/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 2: Category & Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Notice Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Target Operator Audience</span>
              </label>
              <select
                value={targetAudience}
                onChange={(e) => {
                  const val = e.target.value;
                  setTargetAudience(val);
                  if (val.includes('Kerala')) applyButterflyUpdate('Kerala', val);
                  else if (val.includes('Tamil Nadu')) applyButterflyUpdate('Tamil Nadu', val);
                  else applyButterflyUpdate('all', val);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TARGET_AUDIENCES.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Target District Hubs Multi-Select Quick Chips */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Target District Depots & Transit Corridors</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to select specific transit hubs</span>
            </label>

            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => toggleDistrict('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedDistricts.includes('all')
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Hubs ({targetState === 'all' ? 'South India' : targetState})
              </button>

              {SOUTH_INDIA_DISTRICT_HUBS
                .filter(d => targetState === 'all' || d.state === targetState)
                .map(hub => {
                  const isSelected = selectedDistricts.includes(hub.id);
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => toggleDistrict(hub.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? hub.state === 'Kerala'
                            ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                            : 'bg-blue-600 text-white shadow-2xs font-bold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{hub.flag}</span>
                      <span>{hub.name}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Row 3: Subject */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1">
              <span>Subject (Appears in Official Letterhead & Email Header)</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Official Subject Line..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Row 4: Body */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Official Directive Text / Circular Body</label>
              <span className="text-[11px] text-slate-400">Formatted onto official letterhead</span>
            </div>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter full text of circular..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Row 5: Attachment & Recipient Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                <span>Attachment / Enclosure PDF</span>
              </label>
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="e.g. Schedule_Annexure_2026.pdf"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Target Recipients Count</label>
              <input
                type="number"
                value={recipientCount}
                onChange={(e) => setRecipientCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 6: Signatory & Issuing Authority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Signatory Name</label>
              <input
                type="text"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Signatory Title</label>
              <input
                type="text"
                value={signatoryTitle}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Issuing Department</label>
              <input
                type="text"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-all cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Circular to Fleets'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
