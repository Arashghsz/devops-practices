const express = require('express');
const os = require('os');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = 8199;
const VSTORAGE = '/app/vstorage/log.txt';

// Ensure vstorage file exists
if (!fs.existsSync(VSTORAGE)) {
  fs.writeFileSync(VSTORAGE, '');
}

app.get('/status', async (req, res) => {
  const uptime = (os.uptime() / 3600).toFixed(2);
  const freeDisk = (os.freemem() / (1024 * 1024)).toFixed(2);
  const timestamp = new Date().toISOString();
  const record1 = `Service1 ${timestamp}: uptime ${uptime}h, free mem ${freeDisk} MB`;

  // write to local vstorage
  fs.appendFileSync(VSTORAGE, record1 + '\n');

  // send to storage
  await axios.post('http://storage:8300/log', record1, { headers: { 'Content-Type': 'text/plain' } });

  // forward to service2
  const service2res = await axios.get('http://service2:8200/status');
  const record2 = service2res.data;

  res.type('text/plain').send(record1 + '\n' + record2);
});

app.get('/log', async (req, res) => {
  const response = await axios.get('http://storage:8300/log');
  res.type('text/plain').send(response.data);
});

app.listen(PORT, () => {
  console.log(`Service1 running on port ${PORT}`);
});
