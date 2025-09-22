const express = require('express');
const os = require('os');
const fs = require('fs');
const axios = require('axios');
const { execSync } = require('child_process');

const app = express();
const PORT = 8199;
const VSTORAGE = '/app/vstorage';

// Ensure vStorage file exists
try {
  if (!fs.existsSync(VSTORAGE)) {
    fs.writeFileSync(VSTORAGE, '');
  }
} catch (_) {}

app.get('/status', async (req, res) => {
  try {
    const uptimeHours = (os.uptime() / 3600);
    // Get free disk in root in MB via df -m / (available column)
    const freeDiskMB = parseFloat(execSync("df -m --output=avail / | tail -1").toString().trim());
    const timestamp = new Date().toISOString();
  const record1 = `Timestamp1 ${timestamp}: uptime ${uptimeHours.toFixed(2)} hours, free disk in root: ${freeDiskMB} MBytes`;

    // write to local vStorage (append)
    fs.appendFileSync(VSTORAGE, record1 + '\n');

    // send to storage
    await axios.post('http://storage:8300/log', record1, { headers: { 'Content-Type': 'text/plain' } }).catch(() => {});

    // forward to service2
    const service2res = await axios.get('http://service2:8200/status');
    const record2 = service2res.data;

    res.type('text/plain').send(record1 + '\n' + record2);
  } catch (err) {
    res.status(500).type('text/plain').send(`Service1 error: ${err.message}`);
  }
});

app.get('/log', async (req, res) => {
  try {
    const response = await axios.get('http://storage:8300/log');
    res.type('text/plain').send(response.data);
  } catch (err) {
    res.status(500).type('text/plain').send(`Storage proxy error: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Service1 running on port ${PORT}`);
});
