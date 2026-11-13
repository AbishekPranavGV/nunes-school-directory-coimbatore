import { NextRequest, NextResponse } from 'next/server';
import { 
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
        subject: body.subject || '',
        body: body.body || '',
        signatory_name: body.signatory_name || 'Nunes Instruments Fleet Coordinator',
        signatory_title: body.signatory_title || 'Chief Logistics Liaison Officer',
        issuing_authority: body.issuing_authority || 'Nunes Instruments — Tamil Nadu Transport Directorate',
        attachment_name: body.attachment_name || undefined,
        created_at: new Date().toISOString(),
        status: body.send_now ? 'Sent' : 'Draft',
        recipient_count: body.recipient_count || 320
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

    if (action === 'switch_to_whatsapp') {
      const bounceId = body.bounce_id;
      const idx = bouncedEmailsState.findIndex(b => b.id === bounceId);
      if (idx !== -1) {
        bouncedEmailsState[idx].status = 'Switched to WhatsApp';
        return NextResponse.json({
          success: true,
          message: 'Switched primary dispatch channel to WhatsApp',
          bounced_record: bouncedEmailsState[idx]
        });
      }
      return NextResponse.json({ error: 'Bounced record not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in /api/transport/circulars POST:', err);
    return NextResponse.json({ error: 'Failed to process circular request', details: err.message }, { status: 500 });
  }
}
