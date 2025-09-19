const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8300;
const LOG_FILE = '/app/vstorage/log.txt';

app.use(express.text());

// ensure log file exists
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, '');
}

app.post('/log', (req, res) => {
  fs.appendFileSync(LOG_FILE, req.body + '\n');
  res.sendStatus(200);
});

app.get('/log', (req, res) => {
  const content = fs.readFileSync(LOG_FILE, 'utf-8');
  res.type('text/plain').send(content);
});

app.listen(PORT, () => {
  console.log(`Storage service running on port ${PORT}`);
});
