import { NextRequest, NextResponse } from 'next/server';
import { OutboundCommunication, InboundReply } from '@/types';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Seed Outbound Communications
let communicationsStore: OutboundCommunication[] = [
  {
    id: 'comm_001',
    circular_id: 'circ_2026_001',
    circular_title: 'Alcohol Breath Analyser Solutions for Educational Institutions (14 Available Models)',
    school_id: 'sch_stanes_01',
    school_name: 'Stanes Anglo-Indian Higher Secondary School',
    recipient_email: 'principal@stanescbe.org',
    sender_email: 'nunesalcotest@gmail.com',
    status: 'REPLIED',
    subject: 'Institutional Campus Safety: Alcohol Breath Analyser Solutions for Educational Institutions (14 Available Models) - Nunes Instrumentation',
    message_id: 'msg_alcotest_2026_98124',
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
    circular_title: 'Alcohol Breath Analyser Solutions for Educational Institutions (14 Available Models)',
    school_id: 'sch_psg_01',
    school_name: 'PSG Sarvajana Higher Secondary School',
    recipient_email: 'office@psgsarvajana.edu.in',
    sender_email: 'nunesalcotest@gmail.com',
    status: 'REPLIED',
    subject: 'Institutional Campus Safety: Alcohol Breath Analyser Solutions for Educational Institutions (14 Available Models) - Nunes Instrumentation',
    message_id: 'msg_alcotest_2026_98125',
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
    circular_title: 'Alcohol Breath Analyser Solutions for Educational Institutions (14 Available Models)',
    school_id: 'sch_mani_01',
    school_name: 'Mani Higher Secondary School',
    recipient_email: 'mani.school.cbe@tn.gov.in',
    sender_email: 'nunesalcotest@gmail.com',
    status: 'DELIVERED',
    subject: 'Institutional Campus Safety: Alcohol Breath Analyser Solutions for Educational Institutions (14 Available Models) - Nunes Instrumentation',
    message_id: 'msg_alcotest_2026_98126',
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
    subject: 'Re: Institutional Campus Safety: Alcohol Breath Analyser Solutions for Educational Institutions (14 Available Models) - Nunes Instrumentation',
    body_text: `Dear Nunes Instruments Educational Team,

We acknowledge receipt of Circular Ref: NUNES/EDU/SAFETY/2026/CIRC-014 regarding the Alcohol Breath Analyser Solutions for Educational Institutions (14 Available Models).

Our campus safety and transport administration team has accessed the Google Drive product catalogue. We are currently evaluating Model AT-9000 and the non-contact rapid screening batons for morning student bus entry and hostel security checkpoints. We will coordinate with your Coimbatore team for a live demonstration.

Thank you.
Dr. G. Selvaraj
Principal, Stanes AI HSS, Coimbatore`,
    received_at: '2026-03-16T14:22:00.000Z',
    classification: 'Acknowledged',
    assigned_staff: 'admin',
    status: 'REVIEWED',
    internal_notes: 'Acknowledged and evaluating Model AT-9000 & rapid screening batons for campus gate and hostel screening.'
  },
  {
    id: 'reply_002',
    communication_id: 'comm_002',
    school_id: 'sch_psg_01',
    school_name: 'PSG Sarvajana Higher Secondary School',
    sender_email: 'office@psgsarvajana.edu.in',
    sender_name: 'V. Ramaswamy (Lab Coordinator)',
    subject: 'Re: Institutional Campus Safety: Alcohol Breath Analyser Solutions for Educational Institutions (14 Available Models) - Nunes Instrumentation',
    body_text: `Sir / Madam,

With reference to the Alcohol Breath Analyser circular for educational institutions, could you please provide a commercial rate contract quotation for 5 units of the Rapid Screening Baton and 2 units of the Printer-enabled Breath Analysers for our campus fleet and security gate?

Also, please share whether on-campus operator demonstration is available at our Peelamedu campus this week.

Regards,
V. Ramaswamy
Campus Security & Transport In-Charge, PSG Sarvajana HSS, Coimbatore`,
    received_at: '2026-03-17T09:15:00.000Z',
    classification: 'Information Requested',
    assigned_staff: 'admin',
    status: 'UNREAD',
    internal_notes: 'Requested commercial quotation for 5 rapid batons and 2 printer-enabled analysers + on-campus demo.'
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
        sender_email: 'nunesalcotest@gmail.com',
        status: 'DELIVERED',
        subject: `[SIMULATED TEST from nunesalcotest@gmail.com | CC: nunescbe@gmail.com] ${body.subject || 'Official Circular Notification'}`,
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
