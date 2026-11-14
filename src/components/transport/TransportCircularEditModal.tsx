'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Info,
  UploadCloud,
  FileCode,
  Image as ImageIcon,
  Trash2,
  Eye,
  Plus,
  ExternalLink,
  FileCheck
} from 'lucide-react';
import { TransportCircular, TransportAttachment } from '@/types/transport';

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

// Helper: Determine attachment file type
const getAttachmentType = (filename: string): 'pdf' | 'word' | 'image' | 'other' => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'rtf'].includes(ext)) return 'word';
  if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext)) return 'image';
  return 'other';
};

// Helper: Format byte sizes
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Quick-Add Regulatory Templates Library
const REGULATORY_ATTACHMENT_PRESETS: { name: string; type: 'pdf' | 'word' | 'image'; size: string; dataUrl?: string }[] = [
  {
    name: 'AIS140_InterState_Calibration_Form_TN_KL.pdf',
    type: 'pdf',
    size: '1.6 MB'
  },
  {
    name: 'Walayar_Border_FASTag_RFID_Clearance_Notice.docx',
    type: 'word',
    size: '890 KB'
  },
  {
    name: 'NH544_NH66_Freight_Corridor_Route_Map.png',
    type: 'image',
    size: '2.4 MB',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><rect width="100%" height="100%" fill="%230f172a"/><path d="M50 240 Q150 160 300 140 T550 60" fill="none" stroke="%2338bdf8" stroke-width="4" stroke-dasharray="6 6"/><circle cx="50" cy="240" r="8" fill="%2310b981"/><circle cx="300" cy="140" r="8" fill="%23f59e0b"/><circle cx="550" cy="60" r="8" fill="%236366f1"/><text x="65" y="245" fill="%23fff" font-family="sans-serif" font-size="12" font-weight="bold">Kochi ICTT (KL)</text><text x="315" y="145" fill="%23fff" font-family="sans-serif" font-size="12" font-weight="bold">Walayar / Coimbatore</text><text x="450" y="55" fill="%23fff" font-family="sans-serif" font-size="12" font-weight="bold">Chennai Port (TN)</text><text x="50%" y="30" fill="%2338bdf8" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Official Highway Corridor Route Map (NH 544 &amp; NH 66)</text></svg>'
  },
  {
    name: 'MVD_Kerala_Vehicle_Fitness_Annexure.docx',
    type: 'word',
    size: '720 KB'
  },
  {
    name: 'TOBOA_Omni_Bus_Speed_Governor_Declaration.pdf',
    type: 'pdf',
    size: '980 KB'
  },
  {
    name: 'Official_Directorate_Inspection_Seal.png',
    type: 'image',
    size: '640 KB',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><circle cx="150" cy="150" r="130" fill="%23f8fafc" stroke="%231e3a8a" stroke-width="6"/><circle cx="150" cy="150" r="110" fill="none" stroke="%231e3a8a" stroke-width="2" stroke-dasharray="4 4"/><text x="150" y="100" fill="%231e3a8a" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">NUNES TRANSPORT</text><text x="150" y="130" fill="%23059669" font-family="sans-serif" font-size="18" font-weight="black" text-anchor="middle">★ VERIFIED ★</text><text x="150" y="160" fill="%231e3a8a" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">DIRECTORATE SEAL</text><text x="150" y="210" fill="%2364748b" font-family="sans-serif" font-size="9" text-anchor="middle">TN - KL INTER-STATE DESK</text></svg>'
  }
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
  
  // Multi-format Attachments state (PDF, Word, Images)
  const [attachments, setAttachments] = useState<TransportAttachment[]>([]);
  const [previewModalImage, setPreviewModalImage] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setSelectedDistricts(['ernakulam', 'palakkad', 'kozhikode', 'thiruvananthapuram', 'thrissur']);
      if (!audience) setTargetAudience('🌴 Kerala Registered Fleets (All 14 Districts - KSRTC, KSLOF, Omni Buses)');
      
      const klAttachments: TransportAttachment[] = [
        {
          id: `att-kl-pdf-${Date.now()}`,
          name: 'MVD_Kerala_AIS140_Compliance_Form.pdf',
          type: 'pdf',
          size: '1.4 MB'
        },
        {
          id: `att-kl-doc-${Date.now()}`,
          name: 'MVD_Kerala_Vehicle_Fitness_Annexure.docx',
          type: 'word',
          size: '720 KB'
        },
        {
          id: `att-kl-img-${Date.now()}`,
          name: 'NH66_Cochin_Port_Freight_Corridor_Map.png',
          type: 'image',
          size: '2.1 MB',
          dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><rect width="100%" height="100%" fill="%23064e3b"/><text x="50%" y="40%" fill="%2334d399" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">NH 66 &amp; ICTT Vallarpadam Corridor</text><text x="50%" y="60%" fill="%23a7f3d0" font-family="sans-serif" font-size="14" text-anchor="middle">Kerala MVD Dedicated Freight Transit Map</text></svg>'
        }
      ];
      setAttachments(klAttachments);
      setAttachmentName(klAttachments.map(a => a.name).join(', '));
      
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

      setButterflyNotice('🦋 Butterfly effect active: Recipient count, Kerala hubs, PDF/Word/Image attachments, and Ernakulam directorate auto-synchronized!');
    } 
    else if (state === 'Tamil Nadu') {
      setRecipientCount(2080);
      setIssuingAuthority('Nunes Instruments — Tamil Nadu Transport & Metrology Directorate (Coimbatore HQ)');
      setSelectedDistricts(['coimbatore', 'namakkal', 'salem', 'chennai', 'madurai', 'tiruppur']);
      if (!audience) setTargetAudience('🌿 Tamil Nadu Registered Fleets (All 38 Districts - TOBOA, SLOF)');

      const tnAttachments: TransportAttachment[] = [
        {
          id: `att-tn-pdf-${Date.now()}`,
          name: 'AIS140_Calibration_Form_TN.pdf',
          type: 'pdf',
          size: '1.2 MB'
        },
        {
          id: `att-tn-doc-${Date.now()}`,
          name: 'TOBOA_Omni_Bus_Standard_Operating_Procedure.docx',
          type: 'word',
          size: '940 KB'
        },
        {
          id: `att-tn-img-${Date.now()}`,
          name: 'Western_TamilNadu_Truck_Corridor_Map.png',
          type: 'image',
          size: '1.8 MB',
          dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><rect width="100%" height="100%" fill="%231e3a8a"/><text x="50%" y="40%" fill="%2360a5fa" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">NH 44 &amp; NH 544 Industrial Belt</text><text x="50%" y="60%" fill="%23bfdbfe" font-family="sans-serif" font-size="14" text-anchor="middle">Coimbatore - Namakkal - Salem - Chennai Map</text></svg>'
        }
      ];
      setAttachments(tnAttachments);
      setAttachmentName(tnAttachments.map(a => a.name).join(', '));

      setBody(`To All Managing Directors, Fleet Proprietors, and Depot Managers,
Tamil Nadu Commercial Bus & Freight Logistics Operators (TOBOA & SLOF).

Subject: Compliance Directive — Mandatory Calibration of AIS-140 Certified GPS Telematics, FASTag Priority Lanes, and Emergency Response System.

In accordance with Tamil Nadu State Transport Authority (STA) enforcement regulations, all heavy commercial goods carriages and private Omni passenger buses registered in Tamil Nadu are required to submit their annual electronic telematics audit certificate.

Nunes Instruments provides NABL-accredited diagnostic calibration at all major Tamil Nadu transport hubs (Coimbatore, Namakkal, Sankagiri, Salem, Chennai Koyambedu, and Madurai).

Please ensure your depot managers schedule calibration for scheduled fleets prior to the regional RTO deadline.`);

      setButterflyNotice('🦋 Butterfly effect active: Recipient count, Tamil Nadu hubs, PDF/Word/Image attachments, and TOBOA/SLOF directorate auto-synchronized!');
    } 
    else {
      // All South India
      setRecipientCount(3200);
      setIssuingAuthority('Nunes Instruments — South India Inter-State Transport Directorate (Tamil Nadu & Kerala Divisions)');
      setSelectedDistricts(['all']);
      if (!audience) setTargetAudience('🌐 All Registered Transport Fleets (South India - TN & KL)');

      const southAttachments: TransportAttachment[] = [
        {
          id: `att-all-pdf-${Date.now()}`,
          name: 'AIS140_InterState_Calibration_Form_TN_KL.pdf',
          type: 'pdf',
          size: '1.6 MB'
        },
        {
          id: `att-all-doc-${Date.now()}`,
          name: 'Walayar_Border_FASTag_RFID_Clearance_Notice.docx',
          type: 'word',
          size: '890 KB'
        },
        {
          id: `att-all-img-${Date.now()}`,
          name: 'NH544_NH66_Freight_Corridor_Route_Map.png',
          type: 'image',
          size: '2.4 MB',
          dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><rect width="100%" height="100%" fill="%230f172a"/><path d="M50 240 Q150 160 300 140 T550 60" fill="none" stroke="%2338bdf8" stroke-width="4" stroke-dasharray="6 6"/><circle cx="50" cy="240" r="8" fill="%2310b981"/><circle cx="300" cy="140" r="8" fill="%23f59e0b"/><circle cx="550" cy="60" r="8" fill="%236366f1"/><text x="65" y="245" fill="%23fff" font-family="sans-serif" font-size="12" font-weight="bold">Kochi ICTT (KL)</text><text x="315" y="145" fill="%23fff" font-family="sans-serif" font-size="12" font-weight="bold">Walayar / Coimbatore</text><text x="450" y="55" fill="%23fff" font-family="sans-serif" font-size="12" font-weight="bold">Chennai Port (TN)</text><text x="50%" y="30" fill="%2338bdf8" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Official Highway Corridor Route Map (NH 544 &amp; NH 66)</text></svg>'
        }
      ];
      setAttachments(southAttachments);
      setAttachmentName(southAttachments.map(a => a.name).join(', '));

      setBody(`To All Managing Directors, Fleet Proprietors, and Depot Managers,
South India Commercial Transport Fleets (Tamil Nadu TOBOA, SLOF, Kerala KSRTC SWIFT & KSLOF).

Subject: Comprehensive Inter-State Fleet Safety & Telematics Standardization Directive — Tamil Nadu & Kerala Express Corridors (NH 544 & NH 66).

In accordance with joint transport safety protocols established between Tamil Nadu and Kerala Transport Commissionerates, all inter-state passenger coaches and heavy goods bulkers operating across Southern corridors must verify AIS-140 GPS tracking devices, speed governors (80 km/h goods / 90 km/h buses), and FASTag RFID integration.

Nunes Instruments operates accredited calibration stations across major inter-state nexus points:
• Western Industrial Belt: Coimbatore, Namakkal, Salem & Sankagiri
• Kerala Gateway & Ports: Ernakulam / Kochi Vallarpadam ICTT & Palakkad Walayar
• Regional Terminals: Chennai Koyambedu, Kozhikode, and Thiruvananthapuram

Please ensure all inter-state vehicles carry certified calibration certificates.`);

      setButterflyNotice('🦋 Butterfly effect active: Full South India inter-state scope (3,200 recipients across TN & KL) with multi-format attachments auto-synchronized!');
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

      // Initialize attachments
      if (circular.attachments && circular.attachments.length > 0) {
        setAttachments(circular.attachments);
      } else if (circular.attachment_name) {
        setAttachments([{
          id: `att-init-${Date.now()}`,
          name: circular.attachment_name,
          type: getAttachmentType(circular.attachment_name),
          size: '1.4 MB'
        }]);
      } else {
        setAttachments([]);
      }
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

  // Handle local file uploads (PDF, Word, Images)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: TransportAttachment[] = [];
    Array.from(files).forEach((file) => {
      const type = getAttachmentType(file.name);
      const newAtt: TransportAttachment = {
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        type,
        size: formatFileSize(file.size),
        uploadedAt: new Date().toLocaleTimeString()
      };

      // If image, read as Data URL for inline visual preview
      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newAtt.dataUrl = event.target.result as string;
            setAttachments(prev => [...prev]);
          }
        };
        reader.readAsDataURL(file);
      }

      newAttachments.push(newAtt);
    });

    setAttachments(prev => {
      const updated = [...prev, ...newAttachments];
      setAttachmentName(updated.map(a => a.name).join(', '));
      return updated;
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Add Preset Regulatory Attachment
  const handleAddPreset = (preset: typeof REGULATORY_ATTACHMENT_PRESETS[0]) => {
    if (attachments.some(a => a.name === preset.name)) return;
    const newAtt: TransportAttachment = {
      id: `preset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: preset.name,
      type: preset.type,
      size: preset.size,
      dataUrl: preset.dataUrl,
      uploadedAt: 'Official Repository'
    };
    setAttachments(prev => {
      const updated = [...prev, newAtt];
      setAttachmentName(updated.map(a => a.name).join(', '));
      return updated;
    });
  };

  // Remove Attachment
  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => {
      const filtered = prev.filter(a => a.id !== id);
      setAttachmentName(filtered.map(a => a.name).join(', '));
      return filtered;
    });
  };

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
        attachment_name: attachments.length > 0 ? attachments.map(a => a.name).join(', ') : (attachmentName.trim() || undefined),
        attachments: attachments,
        signatory_name: signatoryName,
        signatory_title: signatoryTitle,
        issuing_authority: issuingAuthority,
        recipient_count: Number(recipientCount) || 3200,
        send_now: sendNow
      };

      if (circular?.id) {
        payload.id = circular.id;
        payload.action = 'update_circular';
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
      console.error('Error saving circular:', err);
      alert('Network or server error saving circular');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Zap className="w-4 h-4 fill-white" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {circular ? 'Edit Transport Circular Directive' : 'Draft New Official Transport Circular'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {targetState === 'Kerala' ? '🌴 Kerala MVD' : targetState === 'Tamil Nadu' ? '🌿 Tamil Nadu STA' : '🌐 All South India'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official Letterhead Dispatch • Multi-Format Enclosures (PDF, Word, Images) • Butterfly Synchronized
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Butterfly Synchronized Banner */}
        {butterflyNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in duration-150 shrink-0">
            <span className="text-emerald-600">🦋</span>
            <span>{butterflyNotice}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          
          {/* Butterfly State Selector Strip */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-emerald-50/80 rounded-xl border border-blue-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-blue-600" />
                <span>Target Geographic Scope (Butterfly Auto-Sync)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Updates recipients, PDF/Word/Image attachments & text everywhere
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

          {/* Row 1: Title & Ref No */}
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
                placeholder="Official Directive / Circular Title..."
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
              <label className="font-semibold text-slate-700">Notice Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Target Fleet Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TARGET_AUDIENCES.map(aud => (
                  <option key={aud} value={aud}>{aud}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Regional Depots & Highway Corridors */}
          <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Target District Depots & Transit Hubs ({selectedDistricts.includes('all') ? 'All South India' : `${selectedDistricts.length} Selected`})</span>
              </label>
              <button
                type="button"
                onClick={() => setSelectedDistricts(['all'])}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Select All
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setSelectedDistricts(['all'])}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedDistricts.includes('all')
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                🌐 All Depots
              </button>
              {SOUTH_INDIA_DISTRICT_HUBS
                .filter(hub => targetState === 'all' || hub.state === targetState)
                .map(hub => {
                  const isSelected = selectedDistricts.includes(hub.id) && !selectedDistricts.includes('all');
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => toggleDistrict(hub.id)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? hub.state === 'Kerala'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-blue-600 text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
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

          {/* ========================================================================= */}
          {/* ROW 5: MULTI-FORMAT ATTACHMENTS & ENCLOSURES MANAGER (PDF, WORD, IMAGES)  */}
          {/* ========================================================================= */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border-2 border-dashed border-slate-300 space-y-3">
            
            {/* Header: Title + Supported File Types Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200">
              <div className="space-y-0.5">
                <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-blue-600" />
                  <span>Attachments & Enclosures (PDF, Word, Images)</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {attachments.length} Attached
                  </span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Attach official compliance forms (PDF), editable guidelines (DOCX), and highway route maps or verification seals (PNG/JPG).
                </p>
              </div>

              {/* Supported Format Pills */}
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-red-600" />
                  <span>PDF</span>
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                  <FileCode className="w-3 h-3 text-blue-600" />
                  <span>Word (.docx)</span>
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-emerald-600" />
                  <span>Images</span>
                </span>
              </div>
            </div>

            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.svg"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Drag & Drop / Upload Trigger Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-blue-600 font-bold border border-blue-300 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer hover:border-blue-500"
              >
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Upload Files from Device</span>
              </button>

              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                or choose from pre-verified official regulatory templates below:
              </span>
            </div>

            {/* Quick-Attach Official Regulatory Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Quick Add Regulatory Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {REGULATORY_ATTACHMENT_PRESETS.map((preset) => {
                  const isAdded = attachments.some(a => a.name === preset.name);
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleAddPreset(preset)}
                      disabled={isAdded}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-slate-200/80 text-slate-400 border-slate-200 cursor-not-allowed'
                          : preset.type === 'pdf'
                          ? 'bg-white hover:bg-red-50 text-slate-700 hover:text-red-800 border-slate-200 hover:border-red-300'
                          : preset.type === 'word'
                          ? 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border-slate-200 hover:border-blue-300'
                          : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {preset.type === 'pdf' && <FileText className="w-3 h-3 text-red-600" />}
                      {preset.type === 'word' && <FileCode className="w-3 h-3 text-blue-600" />}
                      {preset.type === 'image' && <ImageIcon className="w-3 h-3 text-emerald-600" />}
                      <span className="truncate max-w-[200px]">{preset.name}</span>
                      <span className="text-[9px] font-mono opacity-70">({preset.size})</span>
                      {isAdded ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Attached Files List Display */}
            {attachments.length > 0 ? (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Current Attached Enclosures ({attachments.length}):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {attachments.map((att) => {
                    const isPdf = att.type === 'pdf';
                    const isWord = att.type === 'word';
                    const isImage = att.type === 'image';

                    return (
                      <div
                        key={att.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                          isPdf
                            ? 'bg-red-50/50 border-red-200 text-red-950'
                            : isWord
                            ? 'bg-blue-50/50 border-blue-200 text-blue-950'
                            : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        {/* File Icon & Info */}
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                          {/* Thumbnail / Icon */}
                          {isImage && att.dataUrl ? (
                            <img
                              src={att.dataUrl}
                              alt={att.name}
                              className="w-9 h-9 object-cover rounded-lg border border-emerald-300 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => setPreviewModalImage({ name: att.name, url: att.dataUrl! })}
                              title="Click to preview full image"
                            />
                          ) : (
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isPdf ? 'bg-red-100 text-red-600' : isWord ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              {isPdf && <FileText className="w-5 h-5" />}
                              {isWord && <FileCode className="w-5 h-5" />}
                              {isImage && <ImageIcon className="w-5 h-5" />}
                              {!isPdf && !isWord && !isImage && <Paperclip className="w-5 h-5" />}
                            </div>
                          )}

                          {/* File Details */}
                          <div className="truncate flex-1">
                            <p className="font-bold text-xs truncate leading-snug" title={att.name}>
                              {att.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                              <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[8px] ${
                                isPdf ? 'bg-red-200/70 text-red-800' : isWord ? 'bg-blue-200/70 text-blue-800' : 'bg-emerald-200/70 text-emerald-800'
                              }`}>
                                {att.type}
                              </span>
                              {att.size && <span>• {att.size}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Actions: Preview & Remove */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isImage && att.dataUrl && (
                            <button
                              type="button"
                              onClick={() => setPreviewModalImage({ name: att.name, url: att.dataUrl! })}
                              className="p-1 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                              title="View full image"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Remove attachment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-3 text-slate-400 bg-white/60 rounded-xl border border-slate-200">
                <Paperclip className="w-5 h-5 mx-auto mb-1 opacity-50" />
                <p className="text-[11px]">No files attached yet. Click above to upload or choose a preset.</p>
              </div>
            )}

            {/* Recipient Count Input */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-4">
              <label className="font-semibold text-slate-700 text-xs">
                Target Recipient Fleets Quota
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={recipientCount}
                  onChange={(e) => setRecipientCount(Number(e.target.value))}
                  className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-400">Operators</span>
              </div>
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
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
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

      {/* Full Image Preview Modal Lightbox */}
      {previewModalImage && (
        <div 
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModalImage(null)}
        >
          <div 
            className="bg-white rounded-2xl p-4 max-w-2xl w-full shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-xs text-slate-900 truncate">{previewModalImage.name}</span>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-[60vh]">
              <img
                src={previewModalImage.url}
                alt={previewModalImage.name}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
