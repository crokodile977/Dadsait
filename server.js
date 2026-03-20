const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve everything in /public as static files
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback — admin and index are plain HTML so this mostly isn't needed,
// but keeps things tidy if you add routes later
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`НордВестГаз server running on port ${PORT}`);
});
