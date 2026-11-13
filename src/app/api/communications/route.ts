import { NextRequest, NextResponse } from 'next/server';
import { OutboundCommunication, InboundReply } from '@/types';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Seed Outbound Communications
let communicationsStore: OutboundCommunication[] = [
  {
    id: 'comm_001',
    circular_id: 'circ_2026_001',
    circular_title: 'TNEA 2026 District Science Lab & Instrumentation Equipment Audit',
    school_id: 'sch_stanes_01',
    school_name: 'Stanes Anglo-Indian Higher Secondary School',
    recipient_email: 'principal@stanescbe.org',
    sender_email: 'educational.liaison@nunesinstruments.com',
    status: 'REPLIED',
    subject: 'Official Circular: Laboratory Instrumentation Audit (Academic Year 2026-27)',
    message_id: 'msg_tnea_2026_98124',
    thread_id: 'th_stanes_01',
    sent_at: '2026-03-16T10:00:00.000Z',
    delivered_at: '2026-03-16T10:01:15.000Z',
    reply_count: 1,
    last_reply_at: '2026-03-16T14:22:00.000Z',
    response_classification: 'Acknowledged'
  },
  {
    id: 'comm_002',
    circular_id: 'circ_2026_001',
    circular_title: 'TNEA 2026 District Science Lab & Instrumentation Equipment Audit',
    school_id: 'sch_psg_01',
    school_name: 'PSG Sarvajana Higher Secondary School',
    recipient_email: 'office@psgsarvajana.edu.in',
    sender_email: 'educational.liaison@nunesinstruments.com',
    status: 'REPLIED',
    subject: 'Official Circular: Laboratory Instrumentation Audit (Academic Year 2026-27)',
    message_id: 'msg_tnea_2026_98125',
    thread_id: 'th_psg_01',
    sent_at: '2026-03-16T10:05:00.000Z',
    delivered_at: '2026-03-16T10:06:20.000Z',
    reply_count: 1,
    last_reply_at: '2026-03-17T09:15:00.000Z',
    response_classification: 'Information Requested'
  },
  {
    id: 'comm_003',
    circular_id: 'circ_2026_001',
    circular_title: 'TNEA 2026 District Science Lab & Instrumentation Equipment Audit',
    school_id: 'sch_mani_01',
    school_name: 'Mani Higher Secondary School',
    recipient_email: 'mani.school.cbe@tn.gov.in',
    sender_email: 'educational.liaison@nunesinstruments.com',
    status: 'DELIVERED',
    subject: 'Official Circular: Laboratory Instrumentation Audit (Academic Year 2026-27)',
    message_id: 'msg_tnea_2026_98126',
    thread_id: 'th_mani_01',
    sent_at: '2026-03-16T10:10:00.000Z',
    delivered_at: '2026-03-16T10:11:45.000Z',
    reply_count: 0
  },
  {
    id: 'comm_004',
    circular_id: 'circ_2026_002',
    circular_title: 'UDISE+ School Contact Detail Synchronization',
    school_id: 'sch_sri_ramakrishna_01',
    school_name: 'Sri Ramakrishna Mission Vidyalaya High School',
    recipient_email: 'srmv.highschool@srmv.org',
    sender_email: 'directory.support@nunesinstruments.com',
    status: 'SENT',
    subject: 'Important: Institutional Contact Verification for Coimbatore School Directory 2026',
    message_id: 'msg_udise_2026_44120',
    thread_id: 'th_srmv_01',
    sent_at: '2026-04-03T09:00:00.000Z',
    reply_count: 0
  }
];

// Seed Inbound Replies with AI Classification
let repliesStore: InboundReply[] = [
  {
    id: 'reply_001',
    communication_id: 'comm_001',
    school_id: 'sch_stanes_01',
    school_name: 'Stanes Anglo-Indian Higher Secondary School',
    sender_email: 'principal@stanescbe.org',
    sender_name: 'Dr. G. Selvaraj (Principal)',
    subject: 'Re: Official Circular: Laboratory Instrumentation Audit (Academic Year 2026-27)',
    body_text: `Dear Nunes Instruments Educational Team,

We acknowledge receipt of Circular Ref: NUNES/CBE/EDU/2026/048 regarding the Higher Secondary Physics & Chemistry laboratory equipment audit.

Our science department has received the inventory sheet and is currently verifying our digital Vernier calipers, spectrometers, and optical benches. We will submit the verified list before the deadline.

Thank you.
Dr. G. Selvaraj
Principal, Stanes AI HSS, Coimbatore`,
    received_at: '2026-03-16T14:22:00.000Z',
    classification: 'Acknowledged',
    assigned_staff: 'admin',
    status: 'REVIEWED',
    internal_notes: 'Acknowledged and preparing science department inventory by deadline.'
  },
  {
    id: 'reply_002',
    communication_id: 'comm_002',
    school_id: 'sch_psg_01',
    school_name: 'PSG Sarvajana Higher Secondary School',
    sender_email: 'office@psgsarvajana.edu.in',
    sender_name: 'V. Ramaswamy (Lab Coordinator)',
    subject: 'Re: Official Circular: Laboratory Instrumentation Audit (Academic Year 2026-27)',
    body_text: `Sir / Madam,

With reference to the lab instrumentation circular, could you please clarify if the calibration certificates for the analytical balances and compound microscopes should be appended with the inventory submission?

Also, please share the contact of your Peelamedu technical representative.

Regards,
V. Ramaswamy
Lab In-Charge, PSG Sarvajana HSS, Coimbatore`,
    received_at: '2026-03-17T09:15:00.000Z',
    classification: 'Information Requested',
    assigned_staff: 'admin',
    status: 'UNREAD',
    internal_notes: 'Wants calibration certificate instructions and local Peelamedu liaison contact.'
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'all'; // 'communications' | 'replies' | 'summary'
    const status = searchParams.get('status');
    const classification = searchParams.get('classification');

    if (view === 'replies') {
      let filtered = repliesStore;
      if (classification && classification !== 'ALL') {
        filtered = filtered.filter(r => r.classification === classification);
      }
      return NextResponse.json({
        total_replies: repliesStore.length,
        unread_count: repliesStore.filter(r => r.status === 'UNREAD').length,
        replies: filtered
      });
    }

    let comms = communicationsStore;
    if (status && status !== 'ALL') {
      comms = comms.filter(c => c.status === status);
    }

    const summary = {
      total_communications: communicationsStore.length,
      sent_count: communicationsStore.filter(c => c.status === 'SENT' || c.status === 'DELIVERED' || c.status === 'REPLIED').length,
      delivered_count: communicationsStore.filter(c => c.status === 'DELIVERED' || c.status === 'REPLIED').length,
      replied_count: communicationsStore.filter(c => c.status === 'REPLIED').length,
      pending_approval: communicationsStore.filter(c => c.status === 'PENDING_APPROVAL').length,
      draft_count: communicationsStore.filter(c => c.status === 'DRAFT').length,
      safety_switch_status: 'LOCKED (EMAIL_AUTOMATION_ENABLED=false)'
    };

    return NextResponse.json({
      summary,
      communications: comms,
      replies_count: repliesStore.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const body = await req.json();
    const { action } = body;

    // MANDATORY SAFETY CHECK: Real outbound live sending is permanently disabled
    if (action === 'send_live') {
      return NextResponse.json({
        error: 'Live outbound email sending is permanently locked out by system safety governance policy (EMAIL_AUTOMATION_ENABLED=false). Only simulated tests to internal allowlisted addresses are permitted.',
        safety_status: 'PROTECTED',
        timestamp: new Date().toISOString()
      }, { status: 403 });
    }

    // Safe simulated test send to allowlist
    if (action === 'simulate_test_send') {
      const { circular_id, test_email = 'internal-test@nunesinstruments.com' } = body;
      
      const simComm: OutboundCommunication = {
        id: `comm_sim_${Date.now()}`,
        circular_id: circular_id || 'circ_2026_001',
        circular_title: body.circular_title || 'TNEA 2026 Test Circular',
        school_id: 'sch_test_internal',
        school_name: 'Simulated Coimbatore Test Academy',
        recipient_email: test_email,
        sender_email: 'educational.liaison@nunesinstruments.com',
        status: 'DELIVERED',
        subject: `[SIMULATED TEST] ${body.subject || 'Official Circular Notification'}`,
        message_id: `msg_sim_${Date.now()}`,
        sent_at: new Date().toISOString(),
        delivered_at: new Date(Date.now() + 2000).toISOString(),
        reply_count: 0
      };

      communicationsStore.unshift(simComm);

      return NextResponse.json({
        success: true,
        message: `Simulated transmission safely recorded for test recipient ${test_email}. Zero real external schools contacted.`,
        communication: simComm
      });
    }

    // Update reply status or notes
    if (action === 'update_reply') {
      const { reply_id, status: newStatus, internal_notes, classification } = body;
      const target = repliesStore.find(r => r.id === reply_id);
      if (!target) return NextResponse.json({ error: 'Reply not found' }, { status: 404 });

      if (newStatus) target.status = newStatus;
      if (internal_notes !== undefined) target.internal_notes = internal_notes;
      if (classification) target.classification = classification;

      return NextResponse.json({ success: true, reply: target });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
