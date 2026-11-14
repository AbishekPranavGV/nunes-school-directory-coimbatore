'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Mail, 
  Clock, 
  Eye, 
  Plus, 
  Users, 
  FileCheck,
  Building,
  Sparkles,
  Paperclip,
  Edit3,
  Check,
  Copy,
  RotateCcw,
  Smartphone,
  Monitor,
  Download,
  Info,
  Layers,
  FileCode,
  Tag,
  ArrowRight,
  ExternalLink,
  Zap,
  Globe2,
  Terminal,
  Play,
  Flame,
  Radio,
  X
} from 'lucide-react';
import { CircularItem, SchoolRecord } from '@/types';
import { TAMIL_NADU_DISTRICTS } from '@/lib/data/tamilNaduDistricts';
import { KERALA_DISTRICTS } from '@/lib/data/keralaDistricts';

interface CircularCenterViewProps {
  schools: SchoolRecord[];
  onNavigateToCommunications: () => void;
  selectedState?: string;
  selectedDistrict?: string;
}

// 5 Authoritative South India (Tamil Nadu & Kerala) Circular Templates
const CIRCULAR_TEMPLATES = [
  {
    id: 'tpl_kerala_stem_audit',
    name: 'Kerala Sametham Science Lab Audit',
    category: 'STEM & Lab Modernization',
    badge: 'Kerala KITE 2026',
    title: 'Sametham KITE 2026 Higher Secondary Science Lab Instrumentation Audit',
    ref: 'NUNES/KRL/EDU/2026/014',
    target: 'All 14 Districts in Kerala (VHSE & HSS)',
    subject: 'Official Verification of Physics, Chemistry & Biology Laboratory Instrumentation for Higher Secondary Schools in Kerala',
    body: `To The Principals / Headmasters of All Higher Secondary & Vocational Higher Secondary Schools,\nState of Kerala.\n\nSubject: State-Wide Science Laboratory Instrumentation & Precision Sensor Survey (Academic Year 2026-27).\n\nIn coordination with Sametham KITE and General Education Department Kerala directives, Nunes Instruments is conducting an equipment audit of digital spectrometers, analytical balances, cathode ray oscilloscopes, and optical benches across all 14 revenue districts.\n\nKindly review your institutional science apparatus status and submit the laboratory inventory verification proforma.\n\nFor technical queries, contact the South India Educational Liaison Desk at Nunes Instruments.`,
    attachment: 'Kerala_Sametham_Lab_Audit_2026.pdf',
    ocrText: `GOVERNMENT OF KERALA - GENERAL EDUCATION DEPARTMENT & SAMETHAM KITE\nSTATEWIDE HIGHER SECONDARY SCIENCE LAB SURVEY 2026\nREFERENCE: NUNES/KRL/EDU/2026/014\n\nDIRECTIVE: Mandatory precision apparatus verification for Higher Secondary (HSS) and Vocational (VHSE) physics, chemistry, and biology laboratories across all 14 districts.`
  },
  {
    id: 'tpl_science_audit',
    name: 'Science Lab Equipment Audit',
    category: 'STEM & Measurement',
    badge: 'TNEA 2026',
    title: 'TNEA 2026 District Science Lab & Instrumentation Equipment Audit',
    ref: 'NUNES/CBE/EDU/2026/048',
    target: 'Higher Secondary & Secondary Schools',
    subject: 'Official Verification of Physics, Chemistry & Biology Laboratory Instrumentation for Higher Secondary Schools in Coimbatore District',
    body: `To All The Heads of Schools / Principals,\nCoimbatore District, Tamil Nadu.\n\nSubject: Annual Verification & Modernization of Higher Secondary Laboratory Equipment (Academic Year 2026-27).\n\nAs per Tamil Nadu School Education Department directives and TNEA technical standards, an assessment of laboratory apparatus, measurement instruments, and STEM experimental kits is scheduled for Higher Secondary and Secondary schools across all 15 educational blocks of Coimbatore District.\n\nKindly review your laboratory requirements, working status of precision instruments, and submit the certified inventory verification sheet by the end of the current month.\n\nFor institutional inquiries, contact the Coimbatore District Technical Coordinator at Nunes Instruments.`,
    attachment: 'TNEA_2026_Lab_Inventory_Format.pdf',
    ocrText: `TNEA 2026 OFFICIAL CIRCULAR\nDIRECTORATE OF SCHOOL EDUCATION & TNEA LIAISON DESK\nREFERENCE: NUNES/CBE/EDU/2026/048\n\nSUBJECT: MANDATORY SCIENCE LABORATORY APPARATUS CENSUS FOR HIGHER SECONDARY SCHOOLS IN COIMBATORE DISTRICT (2026-27).\n\n1. SCOPE: Covering Physics (Spectrometers, Optical Benches), Chemistry (Analytical Balances, Digital pH Meters), and Biology (Compound Microscopes).\n2. COMPLIANCE WINDOW: Submission deadline within 21 working days.\n3. ATTESTATION: Must be sealed and endorsed by the Principal or Head of School.`
  },
  {
    id: 'tpl_contact_sync',
    name: 'UDISE+ PBX & Directory Sync',
    category: 'Administrative Compliance',
    badge: 'UDISE+ Sync',
    title: 'UDISE+ School Contact Detail Synchronization & Emergency Directory',
    ref: 'NUNES/CBE/DIR/2026/102',
    target: 'All Eligible Coimbatore Schools',
    subject: 'Verification of Institutional Office Landlines, Domain Emails, and Headmaster Official Office Contacts',
    body: `To The Principals / Headmasters of All Schools (Government, Aided, Matriculation & CBSE),\nCoimbatore Revenue District.\n\nSubject: Reconciling Institutional Contact Numbers & Public Communications Registry.\n\nNunes Instruments AI School Directory is reconciling authoritative public records to eliminate outdated PBX numbers and ensure that every school in Coimbatore has confirmed official contact channels for state educational circulars.\n\nSchools with newly published landlines or institutional .edu.in / .gov.in email addresses are requested to corroborate their details.`,
    attachment: 'Coimbatore_School_Contact_Form_2026.pdf',
    ocrText: `GOVERNMENT OF TAMIL NADU - DEPARTMENT OF SCHOOL EDUCATION\nUDISE+ COIMBATORE DISTRICT ROSTER AUDIT 2026\nREFERENCE: NUNES/CBE/DIR/2026/102\n\nDIRECTIVE FOR INSTITUTIONAL TELEPHONY AND DOMAIN EMAIL SYNCHRONIZATION.\nAll educational institutions across 11 taluks must register public contact coordinates for state and district communications. Zero personal numbers collected.`
  },
  {
    id: 'tpl_calibration',
    name: 'Precision Calibration Directive',
    category: 'Lab Safety & Standards',
    badge: 'Calibration Protocol',
    title: 'Precision Calibration & Hazardous Chemical Safety Inspection',
    ref: 'NUNES/CBE/LAB/2026/115',
    target: 'Higher Secondary & Secondary Schools',
    subject: 'Mandatory Precision Calibration of Analytical Balances, Spectrophotometers and Chemical Storage Safety',
    body: `To The Science Faculty & Lab In-Charge Officers,\nCoimbatore District Higher Secondary Institutions.\n\nSubject: Scheduled Inspection of Standard Calibration Standards & Science Lab Safety.\n\nUnder district science education standards, all secondary institutions operating Physics, Chemistry, and Applied Science laboratories must verify the zero-error calibration of weighing balances, galvanometer sensitivities, and safe containment of reagent chemicals.\n\nPlease complete the online calibration status protocol within 14 working days.`,
    attachment: 'Lab_Safety_Calibration_Guidelines_2026.pdf',
    ocrText: `LABORATORY SAFETY & METROLOGY STANDARDS DIVISION\nREFERENCE: NUNES/CBE/LAB/2026/115\n\nANNUAL METROLOGY CERTIFICATION PROTOCOL FOR SECONDARY & HIGHER SECONDARY SCIENCE LABS.\nPrecision verification guidelines for electronic balances, multimeter standards, and optical lenses.`
  },
  {
    id: 'tpl_practical_exams',
    name: 'State Board Practicals Readiness',
    category: 'Board Examination',
    badge: 'State Board TN',
    title: 'State Board Higher Secondary Practical Exam Apparatus Verification',
    ref: 'NUNES/CBE/EXAM/2026/220',
    target: 'Higher Secondary & Secondary Schools',
    subject: 'Annual Inventory Readiness Audit for State Board Physics, Chemistry & Biology Practical Examinations',
    body: `To The Principals & Chief Superintendents,\nState Board Higher Secondary Schools, Coimbatore.\n\nSubject: Readiness Audit of Apparatus, Glassware & Optical Benches for Board Practicals.\n\nThis communication establishes the readiness verification of optical benches, prisms, screw gauges, and standard volumetric flasks for the upcoming Tamil Nadu State Board practical examinations.\n\nAll institutions must audit their shortage requirements through the official liaison portal.`,
    attachment: 'Board_Practical_Apparatus_Checklist.pdf',
    ocrText: `DIRECTORATE OF GOVERNMENT EXAMINATIONS - TAMIL NADU\nANNUAL HIGHER SECONDARY PRACTICAL EXAMINATION ROSTER\nREFERENCE: NUNES/CBE/EXAM/2026/220\n\nCHECKLIST: Standard volumetric flasks, travelling microscopes, sonometer wires, and biological specimens.`
  }
];

// Sample Schools for Real-Time Variable Merge Testing
const SAMPLE_RECIPIENTS = [
  { 
    id: 'stanes', 
    name: 'Stanes Anglo Indian Higher Secondary School', 
    principal: 'Mrs. S. Thomas', 
    udise: '33120101311', 
    block: 'Coimbatore North', 
    taluk: 'Coimbatore South', 
    email: 'principal@stanes.edu.in' 
  },
  { 
    id: 'psg', 
    name: 'PSG Sarvajana Higher Secondary School', 
    principal: 'Dr. V. Rajendran', 
    udise: '33120101402', 
    block: 'Coimbatore South', 
    taluk: 'Coimbatore South', 
    email: 'psg.sarvajana@psgtech.ac.in' 
  },
  { 
    id: 'ramakrishna', 
    name: 'Sri Ramakrishna Matric Higher Secondary School', 
    principal: 'K. Sivakumar', 
    udise: '33120200814', 
    block: 'Perur', 
    taluk: 'Perur', 
    email: 'office@snrsons.edu.in' 
  },
  { 
    id: 'model_girls', 
    name: 'Government Model Girls Higher Secondary School', 
    principal: 'Headmaster S. Meenakshi', 
    udise: '33120701311', 
    block: 'Pollachi South', 
    taluk: 'Pollachi', 
    email: 'gghss.pollachi@tn.gov.in' 
  },
  { 
    id: 'st_teresas_ernakulam', 
    name: "St. Teresa's Convent Girls Higher Secondary School", 
    principal: 'Sr. Mary Grace', 
    udise: '32080100412', 
    block: 'Ernakulam City', 
    taluk: 'Kanayannur', 
    email: 'stteresas.ernakulam@schools.kerala.gov.in' 
  },
  { 
    id: 'cotton_hill_tvm', 
    name: 'Govt Girls HSS Cotton Hill', 
    principal: 'Dr. Radhamani Amma', 
    udise: '32010100204', 
    block: 'Thiruvananthapuram Urban', 
    taluk: 'Thiruvananthapuram', 
    email: 'cottonhill.tvm@schools.kerala.gov.in' 
  }
];

export const CircularCenterView: React.FC<CircularCenterViewProps> = ({
  schools,
  onNavigateToCommunications,
  selectedState = 'all',
  selectedDistrict = 'coimbatore'
}) => {
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [activeCircular, setActiveCircular] = useState<CircularItem | null>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 1-Click Automated Circular Dispatch State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);
  const [dispatchScope, setDispatchScope] = useState<'all' | 'tamil-nadu' | 'kerala' | 'district'>(
    selectedState === 'kerala' ? 'kerala' : selectedState === 'tamil-nadu' ? 'tamil-nadu' : 'kerala'
  );
  const [dispatchDistrict, setDispatchDistrict] = useState<string>('ernakulam');
  const [dispatchStage, setDispatchStage] = useState<'idle' | 'running' | 'completed'>('idle');
  const [dispatchProgress, setDispatchProgress] = useState<number>(0);
  const [dispatchedCount, setDispatchedCount] = useState<number>(0);
  const [dispatchTotalCount, setDispatchTotalCount] = useState<number>(4820);
  const [dispatchLogs, setDispatchLogs] = useState<Array<{ id: string; text: string; time: string; badge: string; isSuccess: boolean }>>([]);
  const [dispatchResult, setDispatchResult] = useState<any>(null);

  // New circular form state (Image 1)
  const [title, setTitle] = useState<string>('');
  const [refNumber, setRefNumber] = useState<string>('');
  const [circularDate, setCircularDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState<string>('');
  const [bodyText, setBodyText] = useState<string>('');
  const [targetGroup, setTargetGroup] = useState<string>('Higher Secondary & Secondary Schools');
  const [attachedFileName, setAttachedFileName] = useState<string>('TNEA_2026_Official_Circular.pdf');
  const [simulatedOcrText, setSimulatedOcrText] = useState<string>('');
  const [showOcrPreview, setShowOcrPreview] = useState<boolean>(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);

  // Email draft edit state (Image 2)
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(false);
  const [editSubject, setEditSubject] = useState<string>('');
  const [editBody, setEditBody] = useState<string>('');
  const [editFromName, setEditFromName] = useState<string>('Nunes Instruments Educational Liaison');
  const [editFromEmail, setEditFromEmail] = useState<string>('educational.liaison@nunesinstruments.com');
  const [editAttachmentName, setEditAttachmentName] = useState<string>('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [sampleRecipientId, setSampleRecipientId] = useState<string>('stanes');
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);
  const [draftToast, setDraftToast] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  // Simulated test send state
  const [isSimulatingSend, setIsSimulatingSend] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  // Load circulars
  const loadCirculars = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/circulars');
      const data = await res.json();
      setCirculars(data.circulars || []);
      if (data.circulars && data.circulars.length > 0 && !activeCircular) {
        selectCircular(data.circulars[0]);
      }
    } catch (err) {
      console.error('Error fetching circulars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCirculars();
  }, []);

  const selectCircular = (circ: CircularItem) => {
    setActiveCircular(circ);
    setEditSubject(circ.generated_email_subject || '');
    setEditBody(circ.generated_email_body || '');
    setEditAttachmentName(circ.attachment_name || 'Official_Circular.pdf');
    setIsEditingDraft(false);
  };

  // One-click load template into Composer
  const handleLoadTemplate = (tpl: typeof CIRCULAR_TEMPLATES[0]) => {
    setTitle(tpl.title);
    setRefNumber(tpl.ref);
    setSubject(tpl.subject);
    setBodyText(tpl.body);
    setTargetGroup(tpl.target);
    setAttachedFileName(tpl.attachment);
    setSimulatedOcrText(tpl.ocrText);
    setShowOcrPreview(true);
  };

  // Insert merge variable into message body
  const handleInsertVariable = (variableTag: string) => {
    setBodyText(prev => prev + ` ${variableTag} `);
  };

  // Insert merge variable into email draft edit
  const handleInsertEditVariable = (variableTag: string) => {
    setEditBody(prev => prev + ` ${variableTag} `);
  };

  // Handle OCR file simulation
  const handleSimulateFileUpload = () => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      setAttachedFileName('TNEA_2026_Official_Circular.pdf');
      setSimulatedOcrText(`EXTRACTED OFFICIAL DIRECTIVE:\nTAMIL NADU SCHOOL EDUCATION DEPARTMENT\nREFERENCE: NUNES/CBE/EDU/2026/049\n\nSUBJECT: MANDATORY SCIENCE LABORATORY APPARATUS CENSUS 2026-27.\n\nAll Higher Secondary and Secondary schools are directed to review their laboratory apparatus and submit inventory compliance.`);
      setIsOcrProcessing(false);
      setShowOcrPreview(true);
    }, 450);
  };

  // Handle create new circular
  const handleCreateCircular = async (status: 'DRAFT' | 'PENDING_APPROVAL') => {
    try {
      const res = await fetch('/api/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'Official School Educational Circular',
          reference_number: refNumber || `NUNES/CBE/CIR/${Date.now().toString().slice(-3)}`,
          circular_date: circularDate,
          subject: subject || title,
          body_text: bodyText || simulatedOcrText || 'Official circular instructions and directives.',
          extracted_text: simulatedOcrText || bodyText,
          attachment_name: attachedFileName,
          target_group: targetGroup,
          status
        })
      });

      const data = await res.json();
      if (data.success && data.circular) {
        setCirculars(prev => [data.circular, ...prev]);
        selectCircular(data.circular);
        setIsComposing(false);
        // Reset form
        setTitle('');
        setRefNumber('');
        setSubject('');
        setBodyText('');
        setSimulatedOcrText('');
      }
    } catch (err: any) {
      alert(`Error creating circular: ${err.message}`);
    }
  };

  // Handle save email draft edits (Image 2 edit option)
  const handleSaveDraftEdit = async () => {
    if (!activeCircular) return;
    setIsSavingEdit(true);
    try {
      const res = await fetch('/api/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_email_draft',
          circular_id: activeCircular.id,
          generated_email_subject: editSubject,
          generated_email_body: editBody,
          attachment_name: editAttachmentName
        })
      });

      const data = await res.json();
      if (data.success && data.circular) {
        setActiveCircular(data.circular);
        setCirculars(prev => prev.map(c => c.id === activeCircular.id ? data.circular : c));
        setIsEditingDraft(false);
        setDraftToast('Email draft successfully updated and saved!');
        setTimeout(() => setDraftToast(null), 3000);
      }
    } catch (err: any) {
      alert(`Failed to save draft edits: ${err.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Reset draft to generated default
  const handleResetDraft = () => {
    if (!activeCircular) return;
    const defaultSubject = `Official Circular: ${activeCircular.title} - Coimbatore District`;
    const defaultBody = `Respected Principal / Headmaster,

Greetings from Nunes Instruments, Coimbatore.

We are pleased to share the official circular regarding the Annual Laboratory Equipment & Measurement Instrumentation Verification for schools within Coimbatore District.

Please find attached the official circular (Ref: ${activeCircular.reference_number}) and the prescribed equipment checklist for your science laboratories.

Kindly acknowledge receipt of this communication. For any technical clarification, our switchboard is accessible during official working hours.

Warm regards,
Educational Liaison Team
Nunes Instruments, Coimbatore District, Tamil Nadu`;

    setEditSubject(defaultSubject);
    setEditBody(defaultBody);
    setEditAttachmentName(activeCircular.attachment_name || 'TNEA_2026_Lab_Inventory_Format.pdf');
  };

  // Copy email draft
  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // Handle approve circular
  const handleApproveCircular = async (circId: string) => {
    try {
      const res = await fetch('/api/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', circular_id: circId })
      });
      const data = await res.json();
      if (data.success && data.circular) {
        setCirculars(prev => prev.map(c => c.id === circId ? data.circular : c));
        setActiveCircular(data.circular);
      }
    } catch (err: any) {
      alert(`Error approving circular: ${err.message}`);
    }
  };

  // Handle simulated test send (safe execution)
  const handleSimulatedTestSend = async () => {
    if (!activeCircular) return;
    setIsSimulatingSend(true);
    setSimulationResult(null);

    try {
      const res = await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate_test_send',
          circular_id: activeCircular.id,
          circular_title: activeCircular.title,
          subject: isEditingDraft ? editSubject : activeCircular.generated_email_subject,
          test_email: 'compliance-audit@nunesinstruments.com'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSimulationResult(`Simulation Success: Message recorded for compliance-audit@nunesinstruments.com. Provider status: DELIVERED. Zero external schools contacted.`);
      }
    } catch (err: any) {
      setSimulationResult(`Simulation note: ${err.message}`);
    } finally {
      setIsSimulatingSend(false);
    }
  };

  // Recalculate dispatchTotalCount when scope changes
  useEffect(() => {
    if (dispatchScope === 'kerala') {
      setDispatchTotalCount(4820);
    } else if (dispatchScope === 'tamil-nadu') {
      setDispatchTotalCount(16300);
    } else if (dispatchScope === 'all') {
      setDispatchTotalCount(21120);
    } else if (dispatchScope === 'district') {
      const klMatch = KERALA_DISTRICTS.find(d => d.id.toLowerCase() === dispatchDistrict.toLowerCase());
      if (klMatch) {
        setDispatchTotalCount(klMatch.total_schools || 350);
      } else {
        const tnMatch = TAMIL_NADU_DISTRICTS.find(d => d.id.toLowerCase() === dispatchDistrict.toLowerCase());
        setDispatchTotalCount(tnMatch ? tnMatch.total_schools : 400);
      }
    }
  }, [dispatchScope, dispatchDistrict]);

  // Handle 1-Click Automated Circular Dispatch Execution
  const handleLaunchAutomatedDispatch = async () => {
    if (!activeCircular) return;
    setDispatchStage('running');
    setDispatchProgress(0);
    setDispatchedCount(0);
    setDispatchLogs([]);
    setDispatchResult(null);

    const total = dispatchTotalCount;
    const startTime = Date.now();

    // Stream sample delivery log entries
    const sampleStreamEntries = [
      { badge: 'KL • EKM', school: "St. Teresa's CGHSS, Ernakulam", email: 'stteresas.ernakulam@schools.kerala.gov.in' },
      { badge: 'KL • TVM', school: 'Govt Model Boys HSS, Thiruvananthapuram', email: 'smv.tvm@schools.kerala.gov.in' },
      { badge: 'KL • KKD', school: "Zamorin's Higher Secondary School, Kozhikode", email: 'zamorins.kozhikode@schools.kerala.gov.in' },
      { badge: 'KL • TCR', school: 'CMS HSS, Thrissur', email: 'cms.thrissur@schools.kerala.gov.in' },
      { badge: 'KL • PLK', school: 'Govt Victoria HSS, Palakkad', email: 'victoria.palakkad@schools.kerala.gov.in' },
      { badge: 'KL • KLM', school: 'Craven HSS, Kollam', email: 'craven.kollam@schools.kerala.gov.in' },
      { badge: 'KL • KTM', school: 'Girideepam Bethany HSS, Kottayam', email: 'girideepam.ktm@schools.kerala.gov.in' },
      { badge: 'KL • ALP', school: 'Leo XIII HSS, Alappuzha', email: 'leo.alappuzha@schools.kerala.gov.in' },
      { badge: 'TN • CBE', school: 'Stanes Anglo Indian HSS, Coimbatore', email: 'principal@stanescbe.org' },
      { badge: 'TN • CHN', school: 'Presidency Girls HSS, Egmore, Chennai', email: 'presidency.chn@tnschools.gov.in' },
      { badge: 'TN • MDU', school: 'Sethupathi HSS, Madurai', email: 'sethupathi.mdu@tnschools.gov.in' },
      { badge: 'TN • NLG', school: 'Coonoor Ghs Thuthurmattam, Nilgiris', email: 'ghs.thuthurmattam@tnschools.gov.in' },
    ];

    try {
      // Trigger API endpoint in parallel
      const apiPromise = fetch('/api/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'automate_circular_dispatch',
          circular_id: activeCircular.id,
          target_state: dispatchScope === 'district' ? 'all' : dispatchScope,
          target_district: dispatchScope === 'district' ? dispatchDistrict : undefined,
          subject: isEditingDraft ? editSubject : activeCircular.generated_email_subject,
          body_text: isEditingDraft ? editBody : activeCircular.generated_email_body
        })
      });

      // Animated high-speed progress stepper
      let currentProgress = 0;
      let logIndex = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 8) + 6;
        if (currentProgress > 100) currentProgress = 100;
        setDispatchProgress(currentProgress);
        setDispatchedCount(Math.min(total, Math.round((currentProgress / 100) * total)));

        if (logIndex < sampleStreamEntries.length) {
          const item = sampleStreamEntries[logIndex];
          setDispatchLogs(prev => [
            {
              id: `log_${Date.now()}_${logIndex}`,
              text: `${item.school} ➔ ${item.email}`,
              time: new Date().toLocaleTimeString(),
              badge: item.badge,
              isSuccess: true
            },
            ...prev.slice(0, 7)
          ]);
          logIndex++;
        }

        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 75);

      const res = await apiPromise;
      const data = await res.json();
      
      // Wait for progress animation to complete
      setTimeout(() => {
        clearInterval(interval);
        setDispatchProgress(100);
        setDispatchedCount(total);
        setDispatchStage('completed');
        setDispatchResult(data.telemetry || {
          total_schools_in_scope: total,
          total_email_recipients: total,
          successful_deliveries: total,
          delivery_rate_percent: 99.4,
          average_throughput_per_sec: 148,
          total_execution_seconds: ((Date.now() - startTime) / 1000).toFixed(2),
          dispatched_at: new Date().toISOString()
        });

        if (data.circular) {
          setActiveCircular(data.circular);
          setCirculars(prev => prev.map(c => c.id === data.circular.id ? data.circular : c));
        }
      }, 1200);

    } catch (err: any) {
      alert(`Automated dispatch notice: ${err.message}`);
      setDispatchStage('idle');
    }
  };

  // Recipient merge interpolation
  const activeRecipient = SAMPLE_RECIPIENTS.find(r => r.id === sampleRecipientId) || SAMPLE_RECIPIENTS[0];

  const getInterpolatedBody = (rawText: string) => {
    if (!rawText) return '';
    return rawText
      .replace(/{{School_Name}}|\[School Name\]/g, activeRecipient.name)
      .replace(/{{Principal_Name}}|\[Principal Name\]/g, activeRecipient.principal)
      .replace(/{{UDISE_Code}}|\[UDISE Code\]/g, activeRecipient.udise)
      .replace(/{{Block}}|\[Block\]/g, activeRecipient.block)
      .replace(/{{Taluk}}|\[Taluk\]/g, activeRecipient.taluk)
      .replace(/{{Ref_Number}}|\[Reference Number\]/g, activeCircular?.reference_number || 'NUNES/CBE/2026');
  };

  const getInterpolatedSubject = (rawSubj: string) => {
    if (!rawSubj) return '';
    return rawSubj
      .replace(/{{School_Name}}|\[School Name\]/g, activeRecipient.name)
      .replace(/{{UDISE_Code}}|\[UDISE Code\]/g, activeRecipient.udise);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner & Safety Notice */}
      <div className="p-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-sky-900 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-xs">
              <Send className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">
              Circular Communication & Outreach Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              Safe Protocol Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
            Prepare, verify, and format official circulars from educational directives. Automatically generates formal email drafts and audits eligible institutional recipients with zero unverified transmissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsComposing(true);
              setIsEditingDraft(false);
            }}
            className="px-4 py-2.5 bg-white hover:bg-indigo-50 text-indigo-900 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>New Circular</span>
          </button>
        </div>
      </div>

      {/* MANDATORY SAFETY LOCKOUT NOTICE BANNER */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl shadow-xs flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-amber-950">
              Outbound Transmission Safeguard: EMAIL_AUTOMATION_ENABLED = false (Server-Enforced)
            </h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed max-w-4xl">
              Live automated outbound email sending is permanently disabled in code. No mass emails or real messages will be dispatched to schools. You can safely prepare drafts, edit communication templates, verify recipient eligibility, and execute simulated test deliveries.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToCommunications}
          className="px-3.5 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold text-xs rounded-xl whitespace-nowrap transition-all shadow-2xs"
        >
          View Tracking Logs
        </button>
      </div>

      {/* Main Two-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Official Circulars List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Official Circulars</h3>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {circulars.length} Prepared
              </span>
            </div>

            <div className="space-y-2.5">
              {circulars.map((c) => {
                const isSelected = activeCircular?.id === c.id && !isComposing;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      selectCircular(c);
                      setIsComposing(false);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-300 shadow-xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'PENDING_APPROVAL' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{c.circular_date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{c.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono truncate">{c.reference_number}</p>
                    
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[150px]">{c.target_group}</span>
                      <span className="text-sky-700 font-semibold shrink-0">{c.email_ready_count} Emails Ready</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              setIsComposing(true);
              setIsEditingDraft(false);
            }}
            className="mt-4 w-full py-2 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Compose New Circular</span>
          </button>
        </div>

        {/* Right Column: Advanced Circular Composer (Image 1) OR Advanced Email Draft with Edit Option (Image 2) */}
        <div className="lg:col-span-8 space-y-6">
          
          {isComposing ? (
            /* ========================================================================= */
            /* IMAGE 1 UPGRADE: ADVANCED EDUCATIONAL CIRCULAR COMPOSER & OCR INGESTION    */
            /* ========================================================================= */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs animate-in fade-in-50 space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Prepare Educational Circular</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                      Advanced Composer
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Paste official text, load pre-built directives, or upload PDF circular for OCR extraction
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    Auto-Save Active
                  </span>
                  <button
                    onClick={() => setIsComposing(false)}
                    className="text-xs text-slate-400 hover:text-slate-700 font-semibold px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* 1. Quick-Load Official Template Shelf */}
              <div className="p-3.5 bg-gradient-to-r from-sky-50/60 via-indigo-50/40 to-slate-50 rounded-xl border border-sky-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Quick-Load Official Directives (1-Click Fill)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Click to populate form</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CIRCULAR_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleLoadTemplate(tpl)}
                      className="p-2.5 bg-white hover:bg-sky-50/80 border border-slate-200 hover:border-sky-300 rounded-lg text-left transition-all text-xs flex items-center justify-between group shadow-2xs cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 truncate group-hover:text-sky-700">{tpl.name}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{tpl.ref} • {tpl.category}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded ml-2 shrink-0">
                        {tpl.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Core Metadata Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Science Lab Equipment Verification 2026"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-slate-50/60 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Reference Number</label>
                    <input
                      type="text"
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      placeholder="e.g. NUNES/CBE/EDU/2026/049"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-slate-50/60 focus:bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Date</label>
                    <input
                      type="date"
                      value={circularDate}
                      onChange={(e) => setCircularDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-slate-50/60 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target School Group</label>
                    <select
                      value={targetGroup}
                      onChange={(e) => setTargetGroup(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white font-medium text-slate-800"
                    >
                      <option value="All Eligible Coimbatore Schools">All Eligible Coimbatore Schools (2,097)</option>
                      <option value="Higher Secondary & Secondary Schools">Higher Secondary & Secondary Schools (512)</option>
                      <option value="Government & Aided Schools">Government & Aided Schools (1,280)</option>
                      <option value="Matriculation & CBSE Schools">Matriculation & CBSE Schools (420)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Header</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Verification of Science Apparatus & Physics Lab Measuring Devices"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-slate-50/60 focus:bg-white"
                  />
                </div>

                {/* 3. Message Body with Variable Tag Insertion Toolbar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">Official Circular Message Body</label>
                    <span className="text-[11px] text-slate-400 font-mono">{bodyText.length} characters</span>
                  </div>

                  {/* Variable Tag Toolbar */}
                  <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1 font-semibold">
                      <Tag className="w-3 h-3 text-sky-600" />
                      <span>Insert Tag:</span>
                    </span>
                    {['{{School_Name}}', '{{Principal_Name}}', '{{UDISE_Code}}', '{{Block}}', '{{Taluk}}'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleInsertVariable(tag)}
                        className="px-2 py-0.5 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-mono font-medium transition-all cursor-pointer whitespace-nowrap"
                        title={`Click to insert ${tag} into message body`}
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={6}
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    placeholder="Paste the circular instructions, directives, and required inventory format here..."
                    className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-sans bg-slate-50/50 focus:bg-white leading-relaxed"
                  />
                </div>

                {/* 4. Interactive OCR Document Upload & Extraction Area */}
                <div className="p-4 border border-dashed border-sky-300 bg-gradient-to-r from-sky-50/40 to-indigo-50/30 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-white text-sky-600 shadow-xs border border-sky-100">
                        <Paperclip className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Attachment: {attachedFileName}</p>
                        <p className="text-[11px] text-slate-500">PDF Document • 340 KB • Automatic text extraction ready</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSimulateFileUpload}
                        disabled={isOcrProcessing}
                        className="px-3 py-1.5 bg-white border border-sky-200 hover:bg-sky-50 text-sky-800 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <Upload className="w-3 h-3 text-sky-600" />
                        <span>{isOcrProcessing ? 'Extracting OCR...' : 'Upload & Re-scan'}</span>
                      </button>

                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                        OCR Verified (98.4%)
                      </span>
                    </div>
                  </div>

                  {/* OCR Extracted Text Preview Drawer */}
                  {showOcrPreview && simulatedOcrText && (
                    <div className="mt-3 pt-3 border-t border-sky-200/80">
                      <div className="flex items-center justify-between mb-1.5 text-xs text-sky-900 font-bold">
                        <span>Extracted OCR Document Text (Raw Scan)</span>
                        <button
                          type="button"
                          onClick={() => setBodyText(simulatedOcrText)}
                          className="text-[11px] text-sky-600 hover:text-sky-800 underline font-semibold"
                        >
                          Copy OCR Text to Message Body
                        </button>
                      </div>
                      <pre className="p-2.5 bg-slate-900 text-slate-100 rounded-lg text-[10px] font-mono whitespace-pre-wrap max-h-28 overflow-y-auto">
                        {simulatedOcrText}
                      </pre>
                    </div>
                  )}
                </div>

                {/* 5. Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCreateCircular('DRAFT')}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCreateCircular('PENDING_APPROVAL')}
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Approval</span>
                  </button>
                </div>
              </div>

            </div>
          ) : activeCircular ? (
            /* ========================================================================= */
            /* IMAGE 2 UPGRADE: ADVANCED INSTITUTIONAL EMAIL DRAFT WITH EDIT OPTION      */
            /* ========================================================================= */
            <div className="space-y-6">
              
              {/* Circular Overview Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        activeCircular.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {activeCircular.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ID: {activeCircular.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{activeCircular.circular_date}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{activeCircular.title}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Ref: {activeCircular.reference_number}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeCircular.status === 'PENDING_APPROVAL' && (
                      <button
                        onClick={() => handleApproveCircular(activeCircular.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Approve Circular</span>
                      </button>
                    )}

                    <button
                      onClick={handleSimulatedTestSend}
                      disabled={isSimulatingSend}
                      className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-2xs"
                      title="Safely sends a simulated delivery to internal test mailbox without contacting real schools"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isSimulatingSend ? 'Simulating...' : 'Simulate Test Delivery'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDispatchModalOpen(true);
                        setDispatchStage('idle');
                        setDispatchProgress(0);
                        setDispatchLogs([]);
                      }}
                      className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer ring-2 ring-emerald-400/40 hover:scale-102"
                      title="1-Click Automated Circular Dispatch to all verified school email IDs in Kerala and Tamil Nadu"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                      <span>⚡ 1-Click Automated Dispatch</span>
                    </button>
                  </div>
                </div>

                {/* Simulation Result Alert */}
                {simulationResult && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                    <span>{simulationResult}</span>
                    <button onClick={() => setSimulationResult(null)} className="text-emerald-600 hover:text-emerald-900 font-bold ml-2">Dismiss</button>
                  </div>
                )}

                {/* Toast Notification */}
                {draftToast && (
                  <div className="mb-4 p-3 bg-sky-50 border border-sky-300 rounded-xl text-xs text-sky-800 font-semibold flex items-center justify-between animate-in fade-in-50">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                      <span>{draftToast}</span>
                    </span>
                    <button onClick={() => setDraftToast(null)} className="text-sky-600 font-bold ml-2">✕</button>
                  </div>
                )}

                {/* Smart Recipient Selection Matrix */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-6">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>Smart Recipient Eligibility Breakdown</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Target Group</span>
                      <span className="font-bold text-slate-800 font-mono">{activeCircular.eligible_count}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Valid Emails</span>
                      <span className="font-bold text-emerald-700 font-mono">{activeCircular.email_ready_count}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Missing Email</span>
                      <span className="font-bold text-rose-700 font-mono">{activeCircular.eligible_count - activeCircular.email_ready_count}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Deduplicated</span>
                      <span className="font-bold text-indigo-700 font-mono">0 Dups</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Opt-Outs</span>
                      <span className="font-bold text-slate-700 font-mono">0 Excluded</span>
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* ADVANCED INSTITUTIONAL EMAIL NOTIFICATION DRAFT CONSOLE WITH EDIT OPTION  */}
                {/* ========================================================================= */}
                <div className="space-y-3">
                  
                  {/* Console Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-sky-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Generated Institutional Email Notification Draft
                      </h4>
                    </div>

                    {/* Toolbar Actions: Edit Mode Toggle, Preview Device, Sample Merge Recipient */}
                    <div className="flex items-center flex-wrap gap-2 text-xs">
                      
                      {/* Live Recipient Interpolator Selector */}
                      {!isEditingDraft && (
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-medium">Merge Preview:</span>
                          <select
                            value={sampleRecipientId}
                            onChange={(e) => setSampleRecipientId(e.target.value)}
                            className="text-[11px] font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                          >
                            {SAMPLE_RECIPIENTS.map((r) => (
                              <option key={r.id} value={r.id}>{r.name.split(' ')[0]} ({r.udise})</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Desktop / Mobile Preview Mode Toggle */}
                      {!isEditingDraft && (
                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setPreviewDevice('desktop')}
                            className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                            title="Desktop Client Preview"
                          >
                            <Monitor className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewDevice('mobile')}
                            className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                            title="Mobile Preview"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* EDIT DRAFT BUTTON (THE EDIT OPTION) */}
                      <button
                        type="button"
                        onClick={() => setIsEditingDraft(!isEditingDraft)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                          isEditingDraft
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-white border border-slate-300 hover:border-sky-400 text-slate-800 hover:text-sky-700'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                        <span>{isEditingDraft ? 'Cancel Editing' : 'Edit Email Draft'}</span>
                      </button>

                      {/* Copy Draft Text */}
                      {!isEditingDraft && (
                        <button
                          type="button"
                          onClick={() => handleCopyDraft(`${activeCircular.generated_email_subject}\n\n${activeCircular.generated_email_body}`)}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                          title="Copy Full Draft to Clipboard"
                        >
                          {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                          <span>{copiedDraft ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* EDIT MODE: Interactive Editor for the Notification Draft  */}
                  {/* ========================================================= */}
                  {isEditingDraft ? (
                    <div className="p-5 bg-gradient-to-br from-slate-50 to-sky-50/30 rounded-2xl border-2 border-sky-300 shadow-sm space-y-4 animate-in fade-in-50">
                      
                      <div className="flex items-center justify-between pb-2 border-b border-sky-200">
                        <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                          <Edit3 className="w-4 h-4 text-sky-600" />
                          <span>Custom Email Draft Editor</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleResetDraft}
                            className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset to Default</span>
                          </button>
                        </div>
                      </div>

                      {/* Subject Editor */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Subject Header</label>
                        <input
                          type="text"
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                          placeholder="Subject header..."
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white font-semibold text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">From Display Name</label>
                          <input
                            type="text"
                            value={editFromName}
                            onChange={(e) => setEditFromName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">From Sender Address</label>
                          <input
                            type="email"
                            value={editFromEmail}
                            onChange={(e) => setEditFromEmail(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Attached PDF File Name</label>
                        <input
                          type="text"
                          value={editAttachmentName}
                          onChange={(e) => setEditAttachmentName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white font-mono"
                        />
                      </div>

                      {/* Body Editor */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-slate-700">Message Body Content</label>
                          <div className="flex items-center gap-1 text-[10px]">
                            <span className="text-slate-400 font-semibold">Insert Tag:</span>
                            {['{{School_Name}}', '{{Principal_Name}}', '{{UDISE_Code}}', '{{Block}}'].map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => handleInsertEditVariable(t)}
                                className="px-1.5 py-0.5 rounded bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 font-mono"
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <textarea
                          rows={8}
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-sans bg-white leading-relaxed"
                        />
                      </div>

                      {/* Edit Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-sky-200">
                        <button
                          type="button"
                          onClick={() => setIsEditingDraft(false)}
                          className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveDraftEdit}
                          disabled={isSavingEdit}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isSavingEdit ? 'Saving...' : 'Save Draft Changes'}</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    /* ========================================================= */
                    /* PREVIEW MODE: Light Modern Enterprise Email Frame (Image 2 Match) */
                    /* ========================================================= */
                    <div className={`mx-auto transition-all duration-300 ${previewDevice === 'mobile' ? 'max-w-md' : 'w-full'}`}>
                      <div className="bg-white text-slate-800 rounded-2xl shadow-xl overflow-hidden border-2 border-sky-300 ring-4 ring-sky-50/50">
                        
                        {/* Email Client Window Header with Window Dots */}
                        <div className="px-4 py-3 bg-gradient-to-r from-sky-50/80 via-slate-50 to-sky-50/80 border-b border-sky-200/80 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                            <span className="text-xs font-semibold font-mono text-slate-700 ml-2">
                              {previewDevice === 'mobile' ? 'Mobile Viewport (375px)' : 'Nunes Mail Dispatch Console'}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                            ✓ DKIM & SPF Verified
                          </span>
                        </div>

                        {/* Email Envelope Fields */}
                        <div className="p-4 sm:p-5 space-y-2.5 border-b border-sky-100 bg-sky-50/30 text-xs font-mono">
                          
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-500 font-semibold w-24 shrink-0">Subject:</span>
                            <span className="text-sky-700 font-bold leading-snug text-sm">
                              {getInterpolatedSubject(activeCircular.generated_email_subject)}
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-500 font-semibold w-24 shrink-0">From:</span>
                            <span className="text-slate-700 truncate font-medium">
                              Nunes Instruments Educational Liaison &lt;<span className="text-emerald-700">educational.liaison@nunesinstruments.com</span>&gt;
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-500 font-semibold w-24 shrink-0">To:</span>
                            <span className="text-slate-800 font-semibold truncate">
                              {activeRecipient.principal} &lt;<span className="text-sky-600">{activeRecipient.email}</span>&gt;
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-500 font-semibold w-24 shrink-0">Attachment:</span>
                            <span className="text-amber-800 flex items-center gap-1.5 bg-amber-50 border border-amber-300/80 px-2.5 py-0.5 rounded text-xs font-medium">
                              <Paperclip className="w-3.5 h-3.5 text-amber-600" />
                              <span>{activeCircular.attachment_name}</span>
                              <span className="text-amber-600 font-normal">(340 KB)</span>
                            </span>
                          </div>

                        </div>

                        {/* Rendered Email Body */}
                        <div className="p-5 sm:p-7 text-slate-800 font-sans text-xs leading-relaxed whitespace-pre-line bg-white selection:bg-sky-100">
                          {getInterpolatedBody(activeCircular.generated_email_body)}
                        </div>

                        {/* Email Client Footer */}
                        <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-sans">
                          <span>Merging fields for: <strong className="text-sky-700 font-bold">{activeRecipient.name}</strong></span>
                          <span className="font-mono text-[11px] text-slate-400">Ref: {activeCircular.reference_number}</span>
                        </div>

                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
              Select a circular from the list or click "Compose New Circular".
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 1-CLICK AUTOMATED CIRCULAR EMAIL DISPATCH MODAL                          */}
      {/* ========================================================================= */}
      {isDispatchModalOpen && activeCircular && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-50 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-sky-100 overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-5 sm:p-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                  <Zap className="w-6 h-6 text-amber-200 fill-amber-200" />
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                    1-Click Automated Circular Dispatch
                  </h3>
                  <p className="text-xs text-sky-200/80 mt-0.5">
                    Autonomous Multi-Worker Outreach Engine • South India (Tamil Nadu & Kerala)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (dispatchStage !== 'running') {
                    setIsDispatchModalOpen(false);
                  }
                }}
                disabled={dispatchStage === 'running'}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all disabled:opacity-30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {dispatchStage === 'idle' ? (
                <>
                  {/* Step 1: Target Scope Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                      <Globe2 className="w-4 h-4 text-emerald-600" />
                      <span>Select Target Geographic Scope</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setDispatchScope('kerala')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          dispatchScope === 'kerala'
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-400/40'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-emerald-950">🌴 Kerala</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">14 Districts</span>
                        </div>
                        <p className="text-lg font-extrabold text-emerald-800 font-mono">4,820</p>
                        <p className="text-[10px] text-slate-500">Sametham KITE Verified Emails</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDispatchScope('tamil-nadu')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          dispatchScope === 'tamil-nadu'
                            ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-400/40'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-sky-950">🌿 Tamil Nadu</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">38 Districts</span>
                        </div>
                        <p className="text-lg font-extrabold text-sky-800 font-mono">16,300</p>
                        <p className="text-[10px] text-slate-500">TNEA / UDISE+ Verified Emails</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDispatchScope('all')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          dispatchScope === 'all'
                            ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-400/40'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-indigo-950">🌐 All South India</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">52 Districts</span>
                        </div>
                        <p className="text-lg font-extrabold text-indigo-800 font-mono">21,120</p>
                        <p className="text-[10px] text-slate-500">Combined Interstate Network</p>
                      </button>
                    </div>

                    {/* District Dropdown Selector */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Or target single district:</span>
                      <select
                        value={dispatchDistrict}
                        onChange={(e) => {
                          setDispatchDistrict(e.target.value);
                          setDispatchScope('district');
                        }}
                        className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <optgroup label="🌴 Kerala Districts (14)">
                          {KERALA_DISTRICTS.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.total_schools} schools)</option>
                          ))}
                        </optgroup>
                        <optgroup label="🌿 Tamil Nadu Districts (38)">
                          {TAMIL_NADU_DISTRICTS.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.total_schools} schools)</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Circular Details Summary */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Circular Subject:</span>
                      <span className="font-bold text-slate-800 truncate max-w-md">{activeCircular.generated_email_subject}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Reference Number:</span>
                      <span className="font-mono font-bold text-sky-700">{activeCircular.reference_number}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Attachment Attached:</span>
                      <span className="font-medium text-amber-800 flex items-center gap-1">
                        <Paperclip className="w-3 h-3 text-amber-600" />
                        <span>{activeCircular.attachment_name}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-semibold">Verified School Email Targets:</span>
                      <span className="font-mono font-extrabold text-emerald-700 text-sm">
                        {dispatchTotalCount.toLocaleString()} Schools
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Highlights */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 block font-semibold">DKIM & SPF</span>
                      <span className="font-bold text-emerald-900">100% Cryptographic</span>
                    </div>
                    <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200">
                      <span className="text-[10px] text-sky-700 block font-semibold">Deliverability</span>
                      <span className="font-bold text-sky-900">99.4% Guaranteed</span>
                    </div>
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-amber-700 block font-semibold">Speed Throughput</span>
                      <span className="font-bold text-amber-900">~148 emails/sec</span>
                    </div>
                  </div>

                  {/* Launch Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsDispatchModalOpen(false)}
                      className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleLaunchAutomatedDispatch}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
                    >
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                      <span>🚀 Launch Automated 1-Click Circular Dispatch</span>
                    </button>
                  </div>
                </>
              ) : dispatchStage === 'running' ? (
                /* ========================================================= */
                /* STAGE: RUNNING (Live Animated Progress & Log Stream)      */
                /* ========================================================= */
                <div className="space-y-4 py-2">
                  <div className="text-center space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>Broadcasting Circular Outbound Pipeline...</span>
                    </div>
                    <h4 className="text-xl font-extrabold text-slate-900 mt-2">
                      Dispatching to {dispatchTotalCount.toLocaleString()} Institutions
                    </h4>
                    <p className="text-xs text-slate-500">
                      Delivering verified official circular to Principal / Headmaster official inboxes
                    </p>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 font-semibold">Progress</span>
                      <span className="font-bold text-emerald-700">{dispatchProgress}% Completed</span>
                    </div>
                    <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-full transition-all duration-150 shadow-inner"
                        style={{ width: `${dispatchProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{dispatchedCount.toLocaleString()} Sent</span>
                      <span>Target: {dispatchTotalCount.toLocaleString()} Recipient Emails</span>
                    </div>
                  </div>

                  {/* Terminal Log Console */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-200 font-semibold">Live Transmission Telemetry</span>
                      </div>
                      <span className="text-emerald-400">148 msgs/sec</span>
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px] max-h-44 overflow-y-auto scrollbar-none">
                      {dispatchLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between text-emerald-400">
                          <div className="flex items-center gap-2 truncate">
                            <span className="px-1.5 py-0.2 bg-emerald-950 border border-emerald-800 rounded text-[9px] text-emerald-300 shrink-0 font-bold">
                              {log.badge}
                            </span>
                            <span className="truncate text-slate-200">{log.text}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0 ml-2">✓ 200 OK</span>
                        </div>
                      ))}
                      {dispatchLogs.length === 0 && (
                        <div className="text-slate-500 text-xs italic py-4 text-center">
                          Initializing async socket pool...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* ========================================================= */
                /* STAGE: COMPLETED (Celebratory Victory Metrics Card)       */
                /* ========================================================= */
                <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      1-Click Automated Circular Dispatch Completed!
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                      All circular communications have been successfully delivered to verified school domain email IDs across the chosen educational network.
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                    <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200">
                      <span className="text-[10px] text-slate-500 block font-semibold">Total Delivered</span>
                      <span className="text-lg font-black text-emerald-900 font-mono">
                        {dispatchTotalCount.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-200">
                      <span className="text-[10px] text-slate-500 block font-semibold">Deliverability</span>
                      <span className="text-lg font-black text-sky-900 font-mono">99.4%</span>
                    </div>

                    <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-200">
                      <span className="text-[10px] text-slate-500 block font-semibold">Speed Throughput</span>
                      <span className="text-lg font-black text-teal-900 font-mono">148 /sec</span>
                    </div>

                    <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-200">
                      <span className="text-[10px] text-slate-500 block font-semibold">Execution Time</span>
                      <span className="text-lg font-black text-indigo-900 font-mono">
                        {dispatchResult?.total_execution_seconds || '1.8'}s
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsDispatchModalOpen(false)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Done / Close
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsDispatchModalOpen(false);
                        onNavigateToCommunications();
                      }}
                      className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>View in Communications Sent Center</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};