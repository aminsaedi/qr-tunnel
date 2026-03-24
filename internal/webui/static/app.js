// qr-tunnel web UI
(function() {
  'use strict';

  const HISTORY_SIZE = 120; // 60 seconds at 500ms interval
  const txHistory = new Array(HISTORY_SIZE).fill(0);
  const rxHistory = new Array(HISTORY_SIZE).fill(0);
  const decodeHistory = new Array(HISTORY_SIZE).fill(0);

  let ws = null;

  function connectWS() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${proto}//${location.host}/ws`);

    ws.onopen = () => {
      updateConnState('connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        updateDashboard(data);
      } catch(e) {}
    };

    ws.onclose = () => {
      updateConnState('disconnected');
      setTimeout(connectWS, 2000);
    };

    ws.onerror = () => {
      updateConnState('failed');
    };
  }

  function updateConnState(state) {
    const el = document.getElementById('connState');
    if (el) {
      el.className = `state ${state}`;
      el.textContent = state.charAt(0).toUpperCase() + state.slice(1);
    }
  }

  function updateDashboard(data) {
    setText('webrtcState', data.webrtcState || '--');
    setText('activeConns', data.activeConns || 0);
    setText('activeStreams', data.activeStreams || 0);
    setText('rtt', data.rttMs ? `${data.rttMs}ms` : '--');

    setText('txRate', `${data.txRate?.toFixed(1) || '0.0'} KB/s`);
    setText('rxRate', `${data.rxRate?.toFixed(1) || '0.0'} KB/s`);

    setBar('txBar', data.txRate || 0, 50);
    setBar('rxBar', data.rxRate || 0, 50);

    setText('encodeFps', data.qrEncodeFps?.toFixed(1) || '0.0');
    setText('decodeFps', data.qrDecodeFps?.toFixed(1) || '0.0');

    const decodeOk = (data.decodeOk || 0) * 100;
    const decodeEl = document.getElementById('decodeOk');
    if (decodeEl) {
      decodeEl.textContent = `${decodeOk.toFixed(1)}%`;
      decodeEl.className = `value ${decodeOk > 90 ? 'good' : decodeOk > 50 ? 'warn' : 'bad'}`;
    }

    setText('qrVersion', data.qrVersion || '--');
    setText('ecc', data.ecc || '--');
    setText('fps', data.fps || '--');
    setText('chunkSize', `${data.chunkSize || '--'}B`);

    // Update history
    txHistory.push(data.txRate || 0);
    txHistory.shift();
    rxHistory.push(data.rxRate || 0);
    rxHistory.shift();
    decodeHistory.push(decodeOk);
    decodeHistory.shift();

    drawChart();

    // Update simlab sliders if on that page
    updateSimLabValues(data);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setBar(id, value, max) {
    const el = document.getElementById(id);
    if (el) {
      const pct = Math.min((value / max) * 100, 100);
      el.style.width = `${pct}%`;
    }
  }

  // Canvas chart for throughput history
  function drawChart() {
    const canvas = document.getElementById('throughputChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const pad = { top: 10, right: 10, bottom: 20, left: 50 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = '#1a1a3e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
    }

    // Find max for scaling
    const allValues = [...txHistory, ...rxHistory];
    let maxVal = Math.max(...allValues, 1);
    maxVal = Math.ceil(maxVal / 10) * 10;

    // Y-axis labels
    ctx.fillStyle = '#555';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = maxVal - (maxVal / 4) * i;
      const y = pad.top + (chartH / 4) * i;
      ctx.fillText(`${val.toFixed(0)}`, pad.left - 6, y + 4);
    }

    // Draw TX line
    drawLine(ctx, txHistory, '#00d4ff', maxVal, pad, chartW, chartH);
    // Draw RX line
    drawLine(ctx, rxHistory, '#00ff88', maxVal, pad, chartW, chartH);

    // Legend
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(W - 100, 10, 12, 3);
    ctx.fillStyle = '#888';
    ctx.textAlign = 'left';
    ctx.fillText('TX', W - 84, 14);

    ctx.fillStyle = '#00ff88';
    ctx.fillRect(W - 100, 22, 12, 3);
    ctx.fillStyle = '#888';
    ctx.fillText('RX', W - 84, 26);
  }

  function drawLine(ctx, data, color, maxVal, pad, chartW, chartH) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const x = pad.left + (i / (data.length - 1)) * chartW;
      const y = pad.top + chartH - (data[i] / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // SimLab support
  function updateSimLabValues(data) {
    setSliderValue('simDrop', data.dropRate);
    setSliderValue('simNoise', data.noisePct);
    setSliderValue('simDelay', data.delayMs);
    setSliderValue('simQRVersion', data.qrVersion);
    setSliderValue('simFPS', data.fps);
    setSliderValue('simChunkSize', data.chunkSize);
  }

  function setSliderValue(id, val) {
    const el = document.getElementById(id);
    // Only update if the slider is not being actively dragged
    if (el && document.activeElement !== el && val !== undefined) {
      el.value = val;
      const valEl = document.getElementById(id + 'Val');
      if (valEl) valEl.textContent = val;
    }
  }

  // API helper for SimLab
  window.sendSimUpdate = function(params) {
    fetch('/api/sim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', connectWS);
  } else {
    connectWS();
  }
})();
