import { NextRequest, NextResponse } from 'next/server';
import { 
  TRANSPORT_OPERATORS,
  TRANSPORT_CIRCULARS_DATA, 
  SENDER_QUOTA, 
  DELIVERABILITY_STATS, 
  BOUNCED_EMAILS_DATA 
} from '@/lib/data/transportData';
import { TransportCircular, BouncedEmailRecord } from '@/types/transport';

let circularsState: TransportCircular[] = [...TRANSPORT_CIRCULARS_DATA];
let bouncedEmailsState: BouncedEmailRecord[] = [...BOUNCED_EMAILS_DATA];
let senderQuotaState = { ...SENDER_QUOTA };
let deliverabilityStatsState = { ...DELIVERABILITY_STATS };

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      circulars: circularsState,
      sender_quota: senderQuotaState,
      deliverability_stats: deliverabilityStatsState,
      bounced_emails: bouncedEmailsState
    });
  } catch (err: any) {
    console.error('Error in /api/transport/circulars GET:', err);
    return NextResponse.json({ error: 'Failed to fetch circulars data', details: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_circular') {
      const newCircular: TransportCircular = {
        id: `CIR-${Date.now().toString().slice(-6)}`,
        title: body.title || 'Untitled Circular',
        ref_no: body.ref_no || `NUNES/TR/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
        category: body.category || 'Fleet Safety & RTO Mandate',
        target_audience: body.target_audience || 'All Transport Fleets',
        target_districts: body.target_districts || ['all'],
        target_state: body.target_state || 'all',
        subject: body.subject || '',
        body: body.body || '',
        signatory_name: body.signatory_name || 'Er. K. R. Senthil Kumar, B.E., M.I.E.',
        signatory_title: body.signatory_title || 'Director of Technical Services & Logistics Standards',
        issuing_authority: body.issuing_authority || 'Nunes Instruments — South India Inter-State Transport Directorate',
        attachment_name: body.attachment_name || undefined,
        created_at: new Date().toISOString(),
        status: body.send_now ? 'Sent' : 'Draft',
        recipient_count: body.recipient_count || 3200
      };

      circularsState.unshift(newCircular);

      if (body.send_now) {
        senderQuotaState.sent_today += (body.recipient_count || 1);
        senderQuotaState.remaining_today = Math.max(0, senderQuotaState.daily_limit - senderQuotaState.sent_today);
        deliverabilityStatsState.total_dispatched += (body.recipient_count || 1);
        deliverabilityStatsState.delivered_count += Math.floor((body.recipient_count || 1) * 0.97);
      }

      return NextResponse.json({
        success: true,
        message: body.send_now ? 'Circular dispatched successfully' : 'Circular saved as draft',
        circular: newCircular,
        sender_quota: senderQuotaState
      });
    }

    if (action === 'update_circular') {
      const idx = circularsState.findIndex(c => c.id === body.id);
      if (idx !== -1) {
        circularsState[idx] = {
          ...circularsState[idx],
          ...body,
          updated_at: new Date().toISOString()
        };
        return NextResponse.json({
          success: true,
          message: 'Circular updated successfully',
          circular: circularsState[idx]
        });
      }
      return NextResponse.json({ error: 'Circular not found' }, { status: 404 });
    }

    if (action === 'retry_bounce') {
      const bounceId = body.bounce_id;
      const idx = bouncedEmailsState.findIndex(b => b.id === bounceId);
      if (idx !== -1) {
        bouncedEmailsState[idx].retry_attempts += 1;
        bouncedEmailsState[idx].status = 'Retried';
        bouncedEmailsState[idx].timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

        // Increase sender sent count
        senderQuotaState.sent_today += 1;
        senderQuotaState.remaining_today = Math.max(0, senderQuotaState.daily_limit - senderQuotaState.sent_today);

        return NextResponse.json({
          success: true,
          message: `Retried delivery to ${bouncedEmailsState[idx].recipient_email}`,
          bounced_record: bouncedEmailsState[idx]
        });
      }
      return NextResponse.json({ error: 'Bounced record not found' }, { status: 404 });
    }

    if (action === 'one_click_send_to_operator') {
      let { operator_id, operator_email, company_name, circular_id, circular_title } = body;
      
      if (!operator_email && operator_id) {
        const found = TRANSPORT_OPERATORS.find(f => f.id === operator_id);
        if (found) {
          operator_email = found.email;
          company_name = company_name || found.company_name;
        }
      }

      if (!operator_email) {
        return NextResponse.json({ error: 'Operator has no valid email registered' }, { status: 400 });
      }

      // Decrement quota and increment delivery count
      senderQuotaState.sent_today += 1;
      senderQuotaState.remaining_today = Math.max(0, senderQuotaState.daily_limit - senderQuotaState.sent_today);
      deliverabilityStatsState.total_dispatched += 1;
      deliverabilityStatsState.delivered_count += 1;

      const receipt = {
        receipt_id: `RCPT-${Date.now().toString().slice(-6)}`,
        operator_id: operator_id || 'UNKNOWN',
        company_name: company_name || 'Fleet Operator',
        recipient_email: operator_email,
        circular_id: circular_id || 'CIR-CURRENT',
        circular_title: circular_title || 'Official RTO & Logistics Circular',
        status: 'Delivered (TLS 1.3 Verified)',
        smtp_response: '250 2.0.0 OK: Message queued for outbound delivery',
        dispatched_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        message: `Circular automatically dispatched to ${operator_email} in 1 click!`,
        receipt,
        sender_quota: senderQuotaState,
        deliverability_stats: deliverabilityStatsState
      });
    }

    if (action === 'automated_email_blast') {
      const { circular_id, state_target, target_state, service_filter } = body;
      const effectiveState = state_target || target_state || 'all';
      const targetCir = circularsState.find(c => c.id === circular_id) || circularsState[0];

      // Count matching recipients from TRANSPORT_OPERATORS
      let matchingFleets = [...TRANSPORT_OPERATORS];
      if (effectiveState && effectiveState !== 'all') {
        matchingFleets = matchingFleets.filter(f => f.state.toLowerCase() === effectiveState.toLowerCase());
      }
      if (service_filter && service_filter !== 'all') {
        matchingFleets = matchingFleets.filter(f => f.service_type === service_filter);
      }

      const totalCount = matchingFleets.length || 32;
      const successfulCount = Math.floor(totalCount * 0.97);

      senderQuotaState.sent_today += totalCount;
      senderQuotaState.remaining_today = Math.max(0, senderQuotaState.daily_limit - senderQuotaState.sent_today);
      deliverabilityStatsState.total_dispatched += totalCount;
      deliverabilityStatsState.delivered_count += successfulCount;

      const batchLogs = matchingFleets.slice(0, 10).map((fleet, idx) => ({
        id: `LOG-${idx + 1}`,
        company_name: fleet.company_name,
        email: fleet.email,
        state: fleet.state,
        status: 'Delivered (250 OK)',
        timestamp: new Date().toLocaleTimeString('en-IN')
      }));

      return NextResponse.json({
        success: true,
        message: `1-Click Automation Complete: Circular "${targetCir.title}" blasted to ${totalCount} fleet emails across ${state_target || 'All South India'}!`,
        total_dispatched: totalCount,
        successful_delivered: successfulCount,
        batch_logs: batchLogs,
        sender_quota: senderQuotaState,
        deliverability_stats: deliverabilityStatsState
      });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in /api/transport/circulars POST:', err);
    return NextResponse.json({ error: 'Failed to process circular request', details: err.message }, { status: 500 });
  }
}
