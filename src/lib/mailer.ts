import nodemailer, { SendMailOptions } from 'nodemailer';
import { 
  OFFICIAL_CIRCULAR_DRIVE_LINK,
  NunesInternalBccMember,
  NUNES_INTERNAL_BCC_MEMBERS,
  NUNES_INTERNAL_BCC_EMAILS,
  GMAIL_SENDER
} from '@/lib/data/circularConstants';

export {
  OFFICIAL_CIRCULAR_DRIVE_LINK,
  type NunesInternalBccMember,
  NUNES_INTERNAL_BCC_MEMBERS,
  NUNES_INTERNAL_BCC_EMAILS,
  GMAIL_SENDER
};

export interface GmailAccessStatus {
  email: string;
  cc: string;
  bcc_team_count: number;
  is_configured: boolean;
  status: 'CONNECTED' | 'AWAITING_APP_PASSWORD' | 'AUTH_ERROR';
  message: string;
  host: string;
  port: number;
}

// Check or verify Gmail access
export async function verifyGmailAccess(customPassword?: string): Promise<{ success: boolean; status: GmailAccessStatus; error?: string }> {
  const password = customPassword || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (!password) {
    return {
      success: false,
      status: {
        email: GMAIL_SENDER.email,
        cc: GMAIL_SENDER.cc,
        bcc_team_count: NUNES_INTERNAL_BCC_EMAILS.length,
        is_configured: false,
        status: 'AWAITING_APP_PASSWORD',
        message: 'Google App Password not configured. Follow setup steps to authorize nunesalcotest@gmail.com.',
        host: 'smtp.gmail.com',
        port: 465
      }
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_SENDER.email,
        pass: password.replace(/\s+/g, '') // strip any user-entered spaces
      },
      connectionTimeout: 8000
    });

    await transporter.verify();

    return {
      success: true,
      status: {
        email: GMAIL_SENDER.email,
        cc: GMAIL_SENDER.cc,
        bcc_team_count: NUNES_INTERNAL_BCC_EMAILS.length,
        is_configured: true,
        status: 'CONNECTED',
        message: 'Gmail SMTP access successfully authenticated for nunesalcotest@gmail.com.',
        host: 'smtp.gmail.com',
        port: 465
      }
    };
  } catch (err: any) {
    return {
      success: false,
      status: {
        email: GMAIL_SENDER.email,
        cc: GMAIL_SENDER.cc,
        bcc_team_count: NUNES_INTERNAL_BCC_EMAILS.length,
        is_configured: false,
        status: 'AUTH_ERROR',
        message: `Gmail SMTP authentication failed: ${err.message || 'Invalid App Password'}`,
        host: 'smtp.gmail.com',
        port: 465
      },
      error: err.message
    };
  }
}

// Generate direct 1-click Gmail Web compose URL with prefilled From, CC, BCC, Subject, and Body
export function generateGmailWebComposeUrl(params: {
  to?: string;
  cc?: string;
  bcc?: string | string[];
  subject: string;
  body: string;
}): string {
  const baseUrl = 'https://mail.google.com/mail/?view=cm&fs=1';
  const query = new URLSearchParams();

  // Set authuser query hint for nunesalcotest@gmail.com
  query.set('authuser', GMAIL_SENDER.email);
  if (params.to) query.set('to', params.to);
  query.set('cc', params.cc || GMAIL_SENDER.cc);
  
  // Combine 9 Nunes internal coordinators + any custom school recipients into BCC
  const allBccList: string[] = [...NUNES_INTERNAL_BCC_EMAILS];
  if (params.bcc) {
    const customBcc = Array.isArray(params.bcc) ? params.bcc : params.bcc.split(',').map(s => s.trim());
    for (const b of customBcc) {
      if (b && !allBccList.includes(b)) {
        allBccList.unshift(b);
      }
    }
  }
  query.set('bcc', allBccList.join(','));

  query.set('su', params.subject);
  
  // Ensure body includes official Google Drive directive link
  let finalBody = params.body;
  if (!finalBody.includes(OFFICIAL_CIRCULAR_DRIVE_LINK)) {
    finalBody += `\n\n📄 Official Directive Circular Link (Google Drive):\n${OFFICIAL_CIRCULAR_DRIVE_LINK}`;
  }
  query.set('body', finalBody);

  return `${baseUrl}&${query.toString()}`;
}

// Send real or simulated email using Gmail SMTP
export async function sendEmailViaGmail(params: {
  to?: string;
  cc?: string;
  bcc?: string | string[];
  subject: string;
  body: string;
  html?: string;
  appPassword?: string;
  attachments?: SendMailOptions['attachments'];
}): Promise<{ success: boolean; messageId?: string; mode: 'LIVE_SMTP' | 'SIMULATED_TEST' | 'WEB_COMPOSE_READY'; error?: string }> {
  const password = params.appPassword || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (!password) {
    // Generate web compose fallback
    return {
      success: true,
      mode: 'WEB_COMPOSE_READY',
      messageId: `msg_web_${Date.now()}`
    };
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_SENDER.email,
      pass: password.replace(/\s+/g, '')
    }
  });

  // Combine 9 Nunes team coordinators + customer school emails into BCC
  const allBccSet = new Set<string>(NUNES_INTERNAL_BCC_EMAILS);
  if (params.bcc) {
    const customBcc = Array.isArray(params.bcc) ? params.bcc : params.bcc.split(',').map(s => s.trim());
    for (const b of customBcc) {
      if (b) allBccSet.add(b);
    }
  }

  // Ensure body includes official Google Drive directive link
  let finalBody = params.body;
  if (!finalBody.includes(OFFICIAL_CIRCULAR_DRIVE_LINK)) {
    finalBody += `\n\n📄 Official Directive Circular Link (Google Drive):\n${OFFICIAL_CIRCULAR_DRIVE_LINK}`;
  }

  const mailOptions: SendMailOptions = {
    from: GMAIL_SENDER.formatted,
    to: params.to || 'Undisclosed Customers <nunesalcotest@gmail.com>',
    cc: params.cc || GMAIL_SENDER.cc,
    bcc: Array.from(allBccSet),
    subject: params.subject,
    text: finalBody,
    html: params.html,
    attachments: params.attachments
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    success: true,
    messageId: info.messageId,
    mode: 'LIVE_SMTP'
  };
}

