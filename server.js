const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// Файл для хранения заявок (создаётся рядом с server.js)
const LEADS_FILE = path.join(__dirname, 'leads.json');

// Загружаем заявки из файла при старте (если файл есть)
let leads = [];
if (fs.existsSync(LEADS_FILE)) {
  try {
    leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  } catch(e) {
    console.warn('Не удалось прочитать leads.json, начинаем с пустого списка');
  }
}

// Сохраняем заявки в файл
function saveLeads() {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch(e) {
    console.error('Ошибка сохранения leads.json:', e.message);
  }
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── API ──────────────────────────────────────────────────────────────────────

// Принять новую заявку
app.post('/api/leads', (req, res) => {
  const { name, phone, type, note } = req.body || {};

  if (!phone || phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ ok: false, error: 'Телефон обязателен' });
  }

  const entry = {
    id:        Date.now(),
    date:      new Date().toLocaleString('ru-RU'),
    name:      name  || '',
    phone:     phone || '',
    type:      type  || '',
    note:      note  || '',
    status:    'new',
    trashedAt: null,
    opNote:    ''
  };

  leads.unshift(entry);
  saveLeads();

  console.log(`[ЗАЯВКА] ${entry.date} | ${entry.phone} | ${entry.name} | ${entry.type}`);
  res.json({ ok: true, id: entry.id });
});

// Отдать все заявки (для admin.html)
app.get('/api/leads', (req, res) => {
  res.json(leads);
});

// Обновить статус / заметку заявки
app.patch('/api/leads/:id', (req, res) => {
  const id = Number(req.params.id);
  const entry = leads.find(l => l.id === id);
  if (!entry) return res.status(404).json({ ok: false, error: 'Не найдено' });

  const { status, opNote, trashedAt } = req.body || {};
  if (status    !== undefined) entry.status    = status;
  if (opNote    !== undefined) entry.opNote    = opNote;
  if (trashedAt !== undefined) entry.trashedAt = trashedAt;

  saveLeads();
  res.json({ ok: true, entry });
});

// Удалить заявку насовсем
app.delete('/api/leads/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = leads.length;
  leads = leads.filter(l => l.id !== id);
  if (leads.length === before) return res.status(404).json({ ok: false, error: 'Не найдено' });
  saveLeads();
  res.json({ ok: true });
});

// ── SPA fallback ─────────────────────────────────────────────────────────────
// Важно: ставим ПОСЛЕ /api/*, иначе все API-запросы вернут index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`НордВестГаз server running on http://localhost:${PORT}`);
});
