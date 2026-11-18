const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'NunesAppPassProfile');

console.log('Launching Chrome with remote debugging on port 9222...');
const chromeProcess = spawn(chromePath, [
  '--remote-debugging-port=9222',
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  'https://myaccount.google.com/apppasswords'
], {
  detached: true,
  stdio: 'ignore'
});

chromeProcess.unref();

async function checkCdp() {
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list');
      const tabs = await res.json();
      console.log(`CDP Ready! Found ${tabs.length} tabs:`, tabs.map(t => ({ title: t.title, url: t.url, type: t.type })));
      return tabs;
    } catch (e) {
      console.log(`Waiting for CDP port 9222... (${i + 1}/20)`);
    }
  }
  console.log('CDP connection timed out');
}

checkCdp();
