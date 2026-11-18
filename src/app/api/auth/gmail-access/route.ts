import { NextRequest, NextResponse } from 'next/server';
import { GMAIL_SENDER, verifyGmailAccess, generateGmailWebComposeUrl } from '@/lib/mailer';
import { getSessionUser } from '@/lib/auth';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

const STATUS_FILE = path.join(process.cwd(), '.app_password_status.json');
const ENV_FILE = path.join(process.cwd(), '.env.local');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    const access = await verifyGmailAccess();

    let automationStatus = null;
    if (fs.existsSync(STATUS_FILE)) {
      try {
        automationStatus = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
      } catch (e) {
        // ignore
      }
    }

    return NextResponse.json({
      success: true,
      sender: GMAIL_SENDER,
      access: access.status,
      automation_status: automationStatus,
      instructions: [
        '1. Log into your Google Account at myaccount.google.com using nunesalcotest@gmail.com',
        '2. Navigate to Security -> 2-Step Verification and ensure it is turned ON',
        '3. Go to myaccount.google.com/apppasswords',
        '4. Create a new App Password named "Nunes School Directory"',
        '5. Copy the 16-character code (e.g., abcd efgh ijkl mnop) and paste it into the Access modal below or add to GMAIL_APP_PASSWORD'
      ]
    }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, app_password, subject, body: emailBody, bcc_sample } = body;

    // Test connection without saving
    if (action === 'test_connection' || action === 'verify_access') {
      const result = await verifyGmailAccess(app_password);
      return NextResponse.json(result, { headers: corsHeaders });
    }

    // Save and verify password in environment
    if (action === 'save_password' && app_password) {
      const cleanPassword = app_password.trim();
      
      // Update .env.local
      try {
        let envContent = '';
        if (fs.existsSync(ENV_FILE)) {
          envContent = fs.readFileSync(ENV_FILE, 'utf8');
        }
        if (envContent.includes('GMAIL_APP_PASSWORD=')) {
          envContent = envContent.replace(/GMAIL_APP_PASSWORD=.*/g, `GMAIL_APP_PASSWORD="${cleanPassword}"`);
        } else {
          envContent += `\nGMAIL_APP_PASSWORD="${cleanPassword}"\n`;
        }
        fs.writeFileSync(ENV_FILE, envContent, 'utf8');
      } catch (err) {
        console.error('Failed to write .env.local:', err);
      }

      process.env.GMAIL_APP_PASSWORD = cleanPassword;
      const verifyResult = await verifyGmailAccess(cleanPassword);

      return NextResponse.json({
        success: true,
        message: 'Google App Password saved and verified successfully.',
        verify_result: verifyResult
      }, { headers: corsHeaders });
    }

    // Launch Chrome Automation Daemon
    if (action === 'launch_automation') {
      const scriptPath = path.join(process.cwd(), 'scripts', 'auto_gmail_app_password.js');
      const child = spawn(process.execPath, [scriptPath], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();

      // Write initial status
      fs.writeFileSync(STATUS_FILE, JSON.stringify({
        status: 'LAUNCHED',
        timestamp: new Date().toISOString(),
        message: 'Browser automation started. Awaiting Google login.'
      }, null, 2));

      return NextResponse.json({
        success: true,
        message: 'Chrome automation launched successfully. Please sign into Google in the opened window.'
      }, { headers: corsHeaders });
    }

    // Check Automation Status
    if (action === 'check_automation_status') {
      let status = { status: 'IDLE' };
      if (fs.existsSync(STATUS_FILE)) {
        try {
          status = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
        } catch (e) {
          // ignore
        }
      }
      return NextResponse.json({ success: true, status }, { headers: corsHeaders });
    }

    // 1-Click Web Compose URL generator
    if (action === 'get_web_compose_url') {
      const url = generateGmailWebComposeUrl({
        cc: GMAIL_SENDER.cc,
        bcc: bcc_sample || 'customer.school@domain.edu.in',
        subject: subject || 'Official School Circular - Nunes Instruments',
        body: emailBody || 'Dear Principal / Head of Institution,\n\nPlease find attached the official circular.'
      });

      return NextResponse.json({
        success: true,
        compose_url: url,
        sender: GMAIL_SENDER
      }, { headers: corsHeaders });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}
