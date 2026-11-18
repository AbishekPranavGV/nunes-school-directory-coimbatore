import { NextRequest, NextResponse } from 'next/server';
import { getStorageState, getFilteredRecipients, getLiveCircularDashboardMetrics } from '@/lib/circularV2Storage';

export const dynamic = 'force-dynamic';

function convertToCsv(headers: string[], rows: (string | number)[][]): string {
  const escapeField = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const headerLine = headers.map(escapeField).join(',');
  const rowLines = rows.map(r => r.map(escapeField).join(',')).join('\n');
  return `${headerLine}\n${rowLines}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get('type') || 'selected_schools';
    const state = searchParams.get('state') || 'all';
    const district = searchParams.get('district') || 'all';

    const store = getStorageState();
    let csvData = '';
    let fileName = `nunes_circular_report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;

    if (reportType === 'selected_schools' || reportType === 'eligible_contacts') {
      const recipients = await getFilteredRecipients({
        state: state as any,
        district,
        block: 'all',
        management: 'all',
        category: 'all',
        board: 'all',
        hasValidEmail: reportType === 'eligible_contacts',
        hasValidWhatsApp: false,
        isVerifiedOnly: false,
        contactedStatus: 'all',
        replyStatus: 'all',
        excludeOptedOut: true,
        quickSelection: 'coimbatore'
      });

      const headers = [
        'School Name',
        'UDISE Code',
        'State',
        'District',
        'Block',
        'Management',
        'Category',
        'Contact Person',
        'Official Email',
        'Contact Phone',
        'WhatsApp Number',
        'Verification Status',
        'Verification Source',
        'Last Verified Date',
        'Opt-Out Status'
      ];

      const rows = recipients.map(r => [
        r.school_name,
        r.udise_code,
        r.state,
        r.district,
        r.block,
        r.management,
        r.category,
        r.contact_person,
        r.official_email,
        r.contact_phone,
        r.whatsapp_number,
        r.verification_status,
        r.verification_source,
        r.last_verified_date,
        r.opt_out_status ? 'YES' : 'NO'
      ]);

      csvData = convertToCsv(headers, rows);
    } else if (reportType === 'replies') {
      const headers = [
        'Reply ID',
        'Campaign ID',
        'School Name',
        'District',
        'Sender Name',
        'Sender Email',
        'Sender Phone',
        'Subject',
        'Inbound Message',
        'Intent Classification',
        'Assigned Sales Staff',
        'Status',
        'Received At'
      ];

      const rows = store.inboundReplies.map(r => [
        r.id,
        r.campaign_id,
        r.school_name,
        r.district,
        r.sender_name,
        r.sender_email,
        r.sender_phone || '',
        r.subject,
        r.body,
        r.classification,
        r.assigned_sales_staff || 'Unassigned',
        r.status,
        r.received_at
      ]);

      csvData = convertToCsv(headers, rows);
    } else if (reportType === 'followup_tasks') {
      const headers = [
        'Task ID',
        'School Name',
        'District',
        'Task Title',
        'Description',
        'Priority',
        'Assigned To',
        'Due Date',
        'Status',
        'Created At'
      ];

      const rows = store.followUpTasks.map(t => [
        t.id,
        t.school_name,
        t.district,
        t.title,
        t.description,
        t.priority,
        t.assigned_to,
        t.due_date,
        t.status,
        t.created_at
      ]);

      csvData = convertToCsv(headers, rows);
    } else if (reportType === 'delivery_failures' || reportType === 'delivery_events') {
      const events = reportType === 'delivery_failures'
        ? store.deliveryEvents.filter(e => e.status === 'FAILED' || e.status === 'BOUNCED')
        : store.deliveryEvents;

      const headers = [
        'Event ID',
        'Campaign ID',
        'School Name',
        'District',
        'Recipient Email',
        'Recipient WhatsApp',
        'Channel',
        'Delivery Status',
        'Latency (ms)',
        'Provider Response Code',
        'Error Reason',
        'Timestamp'
      ];

      const rows = events.map(e => [
        e.id,
        e.campaign_id,
        e.school_name,
        e.district,
        e.recipient_email,
        e.recipient_whatsapp || '',
        e.channel,
        e.status,
        e.latency_ms,
        e.provider_code || '',
        e.error_reason || '',
        e.timestamp
      ]);

      csvData = convertToCsv(headers, rows);
    } else if (reportType === 'district_performance') {
      const metrics = await getLiveCircularDashboardMetrics(state, district);
      const headers = [
        'District Name',
        'Total Institutions',
        'With Official Email',
        'With WhatsApp Contact',
        'Verified Institutional Contacts',
        'Coverage Percentage'
      ];

      const rows = metrics.district_breakdowns.map(d => [
        d.district,
        d.total,
        d.with_email,
        d.with_whatsapp,
        d.verified,
        d.total > 0 ? `${Math.round((d.verified / d.total) * 100)}%` : '0%'
      ]);

      csvData = convertToCsv(headers, rows);
    } else {
      // Sent campaigns
      const headers = [
        'Campaign ID',
        'Circular Title',
        'Reference Number',
        'Target State',
        'Target District',
        'Recipient Count',
        'Verified Recipients',
        'Approval Status',
        'Approved By',
        'Campaign Status',
        'Dispatched At'
      ];

      const rows = store.campaigns.map(c => [
        c.id,
        c.title,
        c.reference_no,
        c.target_state,
        c.target_district,
        c.recipient_count,
        c.verified_recipient_count,
        c.approval.status,
        c.approval.approved_by || 'Pending',
        c.status,
        c.dispatched_at || 'Not Dispatched'
      ]);

      csvData = convertToCsv(headers, rows);
    }

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });
  } catch (err: any) {
    console.error('[Export Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
