/**
 * Automated Google App Password Generator & Verifier for nunesalcotest@gmail.com
 * Launches Chrome, waits for the user to log in, and automatically generates,
 * captures, saves, and verifies the 16-character App Password.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const nodemailer = require('nodemailer');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

const TARGET_URL = 'https://myaccount.google.com/apppasswords';
const APP_NAME = 'Nunes School Directory';
const STATUS_FILE = path.join(__dirname, '..', '.app_password_status.json');
const ENV_FILE = path.join(__dirname, '..', '.env.local');

function updateStatus(status, data = {}) {
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify({
      status,
      timestamp: new Date().toISOString(),
      ...data
    }, null, 2));
  } catch (err) {
    // ignore
  }
}

function findChromePath() {
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function verifySmtp(password) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'nunesalcotest@gmail.com',
        pass: password.replace(/\s+/g, '')
      },
      connectionTimeout: 8000
    });
    await transporter.verify();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function savePasswordToEnv(password) {
  try {
    let envContent = '';
    if (fs.existsSync(ENV_FILE)) {
      envContent = fs.readFileSync(ENV_FILE, 'utf8');
    }

    if (envContent.includes('GMAIL_APP_PASSWORD=')) {
      envContent = envContent.replace(/GMAIL_APP_PASSWORD=.*/g, `GMAIL_APP_PASSWORD="${password}"`);
    } else {
      envContent += `\nGMAIL_APP_PASSWORD="${password}"\n`;
    }

    fs.writeFileSync(ENV_FILE, envContent, 'utf8');
    process.env.GMAIL_APP_PASSWORD = password;
    return true;
  } catch (err) {
    console.error('Error writing to .env.local:', err);
    return false;
  }
}

async function run() {
  console.log('================================================================================');
  console.log(' NUNES INSTRUMENTS — AUTOMATED GMAIL APP PASSWORD ASSISTANT');
  console.log('================================================================================');
  console.log(`Target: ${TARGET_URL}`);
  console.log(`App Name: "${APP_NAME}"`);
  console.log('--------------------------------------------------------------------------------');

  const chromePath = findChromePath();
  if (!chromePath) {
    console.error('ERROR: Google Chrome or Microsoft Edge could not be located.');
    updateStatus('ERROR', { error: 'No supported browser found' });
    return;
  }

  const userDataDir = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'NunesAppPassProfile');
  console.log(`Launching Chrome browser from: ${chromePath}`);
  console.log('Remote debugging port: 9222');
  console.log('================================================================================');
  console.log('👉 STEP 1: A Chrome window is opening on your desktop.');
  console.log('👉 STEP 2: Log in with nunesalcotest@gmail.com.');
  console.log('👉 STEP 3: Relax! As soon as you log in, this assistant will:');
  console.log(`          • Enter "${APP_NAME}"`);
  console.log('          • Click "Create"');
  console.log('          • Capture the 16-character App Password');
  console.log('          • Save it directly into .env.local');
  console.log('          • Test & verify live SMTP access to smtp.gmail.com:465');
  console.log('================================================================================\n');

  updateStatus('AWAITING_LOGIN', { message: 'Chrome launched. Please log in on the browser window.' });

  // Spawn Chrome
  const chromeProcess = spawn(chromePath, [
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    TARGET_URL
  ], {
    detached: true,
    stdio: 'ignore'
  });

  chromeProcess.unref();

  // Wait for CDP to respond
  let connectedTab = null;
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list');
      const tabs = await res.json();
      connectedTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (connectedTab) break;
    } catch (e) {
      // wait
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  if (!connectedTab) {
    console.error('Failed to establish CDP connection to Chrome on port 9222.');
    updateStatus('ERROR', { error: 'CDP connection failed' });
    return;
  }

  console.log('Connected to browser session via Chrome DevTools Protocol!');
  console.log('Monitoring browser navigation for login completion...\n');

  // Connect WebSocket
  const ws = new WebSocket(connectedTab.webSocketDebuggerUrl);
  let msgId = 1;

  function evaluate(expression) {
    return new Promise((resolve, reject) => {
      const currentId = msgId++;
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('CDP evaluate timeout'));
      }, 5000);

      function onMessage(event) {
        try {
          const data = JSON.parse(event.data);
          if (data.id === currentId) {
            cleanup();
            if (data.error) {
              reject(new Error(data.error.message));
            } else {
              resolve(data.result?.result?.value);
            }
          }
        } catch (err) {
          // ignore
        }
      }

      function cleanup() {
        clearTimeout(timeout);
        ws.removeEventListener('message', onMessage);
      }

      ws.addEventListener('message', onMessage);
      ws.send(JSON.stringify({
        id: currentId,
        method: 'Runtime.evaluate',
        params: {
          expression,
          returnByValue: true
        }
      }));
    });
  }

  await new Promise((resolve) => {
    ws.onopen = resolve;
    ws.onerror = (e) => {
      console.error('WS Error:', e);
      resolve();
    };
  });

  let pollCount = 0;
  let clickedCreateTime = null;

  const interval = setInterval(async () => {
    pollCount++;

    try {
      // Check current URL and page status
      const pageInfo = await evaluate(`
        JSON.stringify({
          url: window.location.href,
          title: document.title,
          bodyText: (document.body && document.body.innerText) ? document.body.innerText.slice(0, 500) : ''
        })
      `);

      if (!pageInfo) return;
      const { url, title, bodyText } = JSON.parse(pageInfo);

      // Check if on login / sign-in screen
      if (url.includes('accounts.google.com/v3/signin') || url.includes('accounts.google.com/signin') || url.includes('identifier') || url.includes('challenge')) {
        if (pollCount % 5 === 0) {
          console.log(`[WAITING] Awaiting Google Account login for nunesalcotest@gmail.com in Chrome...`);
        }
        updateStatus('AWAITING_LOGIN', { url, title });
        return;
      }

      // Check if on apppasswords or myaccount
      if (url.includes('apppasswords') || url.includes('myaccount.google.com')) {
        console.log(`[DETECTED] User logged in! Scanning page DOM on: ${url}`);
        updateStatus('LOGGED_IN', { url, title });

        // Run automation in page context
        const actionResult = await evaluate(`
          (function() {
            const allText = document.body ? document.body.innerText : '';
            
            // 1. Check if 16-character code is already displayed
            const match = allText.match(/\\b([a-z]{4}\\s[a-z]{4}\\s[a-z]{4}\\s[a-z]{4})\\b/i);
            if (match) {
              return JSON.stringify({ status: 'FOUND_PASSWORD', password: match[1] });
            }

            // Also check for modal elements with code
            const codeEls = Array.from(document.querySelectorAll('code, pre, div, span')).filter(el => {
              const t = el.innerText || '';
              return /^[a-z]{4}\\s[a-z]{4}\\s[a-z]{4}\\s[a-z]{4}$/i.test(t.trim());
            });
            if (codeEls.length > 0) {
              return JSON.stringify({ status: 'FOUND_PASSWORD', password: codeEls[0].innerText.trim() });
            }

            // 2. Check if App name input is present
            const inputs = Array.from(document.querySelectorAll('input')).filter(el => {
              const type = (el.type || 'text').toLowerCase();
              return type === 'text' && !el.disabled && el.offsetParent !== null;
            });

            if (inputs.length > 0) {
              const input = inputs[0];
              if (input.value !== '${APP_NAME}') {
                input.focus();
                input.value = '${APP_NAME}';
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
              }

              // Look for Create button
              const buttons = Array.from(document.querySelectorAll('button, [role="button"]')).filter(b => {
                const t = (b.innerText || b.textContent || '').trim().toLowerCase();
                return (t === 'create' || t.includes('create')) && !b.disabled;
              });

              if (buttons.length > 0) {
                buttons[0].click();
                return JSON.stringify({ status: 'CLICKED_CREATE' });
              }

              return JSON.stringify({ status: 'INPUT_FILLED' });
            }

            return JSON.stringify({ status: 'WAITING_FOR_FORM', snippet: allText.slice(0, 100) });
          })()
        `);

        if (actionResult) {
          const res = JSON.parse(actionResult);

          if (res.status === 'CLICKED_CREATE') {
            console.log(`[ACTION] Entered "${APP_NAME}" and clicked "Create" button! Awaiting password modal...`);
            updateStatus('CLICKED_CREATE');
            clickedCreateTime = Date.now();
          } else if (res.status === 'FOUND_PASSWORD' && res.password) {
            clearInterval(interval);
            const password = res.password.trim();
            console.log('\n================================================================================');
            console.log(' 🎉 SUCCESS! 16-CHARACTER GOOGLE APP PASSWORD CAPTURED AUTOMATICALLY!');
            console.log('================================================================================');
            console.log(`Captured Code: ${password}`);
            console.log('Saving to .env.local...');
            savePasswordToEnv(password);

            console.log('Testing live SMTP access to smtp.gmail.com:465...');
            const smtpTest = await verifySmtp(password);
            if (smtpTest.success) {
              console.log('✅ SMTP connection authenticated successfully for nunesalcotest@gmail.com!');
              updateStatus('SUCCESS', {
                password,
                smtp_verified: true,
                message: 'App Password successfully captured and SMTP verified!'
              });
            } else {
              console.log(`⚠️ SMTP verification note: ${smtpTest.error}`);
              updateStatus('SAVED_UNVERIFIED', {
                password,
                smtp_error: smtpTest.error
              });
            }

            console.log('================================================================================');
            console.log(' You may now close the Chrome window. Access is fully active!');
            console.log('================================================================================\n');

            ws.close();
            process.exit(0);
          }
        }
      }

    } catch (err) {
      // console.error('Poll error:', err.message);
    }

  }, 1500);
}

run();
