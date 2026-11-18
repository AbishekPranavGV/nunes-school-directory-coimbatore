async function testCdpWebSocket() {
  const res = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await res.json();
  const pageTab = tabs.find(t => t.type === 'page');
  if (!pageTab) {
    console.error('No page tab found');
    return;
  }
  console.log('Connecting to page tab ws:', pageTab.webSocketDebuggerUrl);

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let id = 1;

  ws.onopen = () => {
    console.log('WS connected! Sending Runtime.evaluate for document.title and location.href...');
    ws.send(JSON.stringify({
      id: id++,
      method: 'Runtime.evaluate',
      params: {
        expression: 'JSON.stringify({ title: document.title, url: window.location.href, inputs: document.querySelectorAll("input").length })',
        returnByValue: true
      }
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('CDP Response:', data);
    if (data.id === 1) {
      const result = JSON.parse(data.result?.result?.value || '{}');
      console.log('Parsed Page Info:', result);
      ws.close();
    }
  };

  ws.onerror = (err) => console.error('WS Error:', err);
}

testCdpWebSocket();
