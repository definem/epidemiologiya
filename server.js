/*
 ============================================================
  SERVER (orqa qism) — barcha qoidalar shu yerda ishlaydi
 ============================================================
  - Mentor paroli:   MENTOR_PASSWORD (muhit o'zgaruvchisi). Vercelda shu usul majburiy.
                     Kompyuterda: data/parol.txt, bo'lmasa standart "mentor123"
  - Natijalar:       Upstash Redis (lib/store.js). Ulanmagan bo'lsa — vaqtinchalik xotira
  - Mavzular:        data/topics.js
  - Ishga tushirish: kompyuterda  npm start   |   Vercelda avtomatik (app eksport qilinadi)
*/
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createStore } = require('./lib/store');

const PORT = process.env.PORT || 3000;
const ON_VERCEL = !!process.env.VERCEL;

// Parol tartibi: 1) MENTOR_PASSWORD muhit o'zgaruvchisi, 2) data/parol.txt fayli, 3) standart "mentor123"
let filePass = '';
try { filePass = fs.readFileSync(path.join(__dirname, 'data', 'parol.txt'), 'utf8').trim(); } catch (e) { /* fayl yo'q */ }
// Vercelda standart parol ISHLAMAYDI (xavfsizlik uchun): MENTOR_PASSWORD o'rnatilishi shart.
const PASSWORD = process.env.MENTOR_PASSWORD || (ON_VERCEL ? '' : (filePass || 'mentor123'));

// ---- QOIDALAR (xohlasangiz shu yerda o'zgartirasiz) ----
const MAX_ATTEMPTS = 2;        // bir o'quvchi bitta testni necha marta ishlay oladi
const COOLDOWN_MIN = 40;       // qayta ishlash uchun necha daqiqa kutish kerak
const QUESTIONS_PER_QUIZ = 10; // bitta testda nechta savol
// --------------------------------------------------------

const KINDS = { test: 'tests', case: 'cases' };
const KIND_LABEL = { test: 'Test', case: 'Vaziyatli masalalar' };

const store = createStore();

function getTopics() {
  const p = require.resolve('./data/topics');
  if (!ON_VERCEL) delete require.cache[p];   // kompyuterda: fayl o'zgarsa qayta o'qiladi
  return require('./data/topics');
}
function findTopic(id) { return getTopics().find(t => t.id === String(id)); }

const TOKEN = PASSWORD ? crypto.createHash('sha256').update('mentor:' + PASSWORD).digest('hex') : null;
function auth(req, res, next) {
  if (TOKEN && req.headers['x-token'] === TOKEN) return next();
  res.status(401).json({ error: 'Ruxsat yo‘q. Qaytadan kiring.' });
}

const nameKey = s => String(s || '').toLowerCase().replace(/[’'`‘ʻʼ]/g, '').replace(/\s+/g, ' ').trim();
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const uid = () => crypto.randomBytes(8).toString('hex');
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));   // Vercelda public/ papkani CDN o'zi beradi

// ---------- MENTOR KIRISHI ----------
app.post('/api/login', (req, res) => {
  if (!PASSWORD) return res.status(500).json({ error: 'Parol o‘rnatilmagan. Vercel → Settings → Environment Variables bo‘limida MENTOR_PASSWORD qo‘shib, qayta deploy qiling.' });
  if (String(req.body.password || '').trim() === PASSWORD) return res.json({ token: TOKEN });
  res.status(401).json({ error: 'Parol noto‘g‘ri' });
});

// ---------- MAVZULAR (ommaviy) ----------
app.get('/api/topics', (req, res) => {
  res.json(getTopics().map(t => ({
    id: t.id, hours: t.hours, title: t.title, syllabus: t.syllabus, icon: t.icon, color: t.color,
    testCount: (t.tests || []).length, caseCount: (t.cases || []).length
  })));
});
app.get('/api/topics/:id', (req, res) => {
  const t = findTopic(req.params.id);
  if (!t) return res.status(404).json({ error: 'Mavzu topilmadi' });
  res.json({
    id: t.id, hours: t.hours, title: t.title, syllabus: t.syllabus, icon: t.icon, color: t.color,
    content: t.content || '', testCount: (t.tests || []).length, caseCount: (t.cases || []).length
  });
});

// ---------- GURUHLAR ----------
app.get('/api/groups', wrap(async (req, res) => res.json(await store.listGroups())));
app.post('/api/groups', auth, wrap(async (req, res) => {
  const name = String(req.body.name || '').trim().slice(0, 40);
  if (!name) return res.status(400).json({ error: 'Guruh nomini kiriting' });
  const groups = await store.listGroups();
  if (groups.some(g => g.name.toLowerCase() === name.toLowerCase())) return res.status(400).json({ error: 'Bunday guruh bor' });
  const g = { id: uid(), name, createdAt: Date.now() };
  await store.addGroup(g);
  res.json(g);
}));
app.delete('/api/groups/:id', auth, wrap(async (req, res) => {
  await store.removeGroup(req.params.id, getTopics().map(t => t.id));
  res.json({ ok: true });
}));

// ---------- TEST MA'LUMOTI (o'quvchi sahifasi uchun) ----------
app.get('/api/quiz-info/:topic/:kind', (req, res) => {
  const t = findTopic(req.params.topic);
  const key = KINDS[req.params.kind];
  if (!t || !key) return res.status(404).json({ error: 'Topilmadi' });
  const n = Math.min((t[key] || []).length, QUESTIONS_PER_QUIZ);
  res.json({ topicTitle: t.title, topicNo: t.id, icon: t.icon, color: t.color, kindLabel: KIND_LABEL[req.params.kind], count: n, maxAttempts: MAX_ATTEMPTS, cooldown: COOLDOWN_MIN });
});

// ---------- TESTNI BOSHLASH ----------
app.post('/api/start', wrap(async (req, res) => {
  const { topic, kind, groupId } = req.body;
  const name = String(req.body.name || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const t = findTopic(topic), key = KINDS[kind];
  if (!t || !key) return res.status(404).json({ error: 'Topilmadi' });
  const groups = await store.listGroups();
  if (!groups.some(g => g.id === groupId)) return res.status(400).json({ error: 'Guruhni tanlang' });
  if (name.split(' ').length < 2 || name.length < 5) return res.status(400).json({ error: 'Ism va familiyangizni to‘liq yozing' });
  const pool = t[key] || [];
  if (!pool.length) return res.status(400).json({ error: 'Bu test uchun savollar hali qo‘shilmagan' });

  const nk = nameKey(name);
  const lockKey = `${groupId}:${t.id}:${kind}:${nk}`;
  if (!(await store.lock(lockKey))) return res.status(429).json({ error: 'So‘rovingiz qayta ishlanmoqda. Bir necha soniya kutib, qayta urinib ko‘ring.' });

  try {
    const prior = await store.studentAttempts(groupId, t.id, kind, nk);
    if (prior.length >= MAX_ATTEMPTS) {
      return res.status(403).json({ error: `Siz bu testni ${MAX_ATTEMPTS} marta ishlab bo‘ldingiz. Boshqa urinish yo‘q.` });
    }
    if (prior.length) {
      const last = prior[prior.length - 1];
      const waitMs = last.startedAt + COOLDOWN_MIN * 60000 - Date.now();
      if (waitMs > 0) {
        const m = Math.ceil(waitMs / 60000);
        return res.status(429).json({ error: `Qayta ishlash uchun yana ${m} daqiqa kuting.`, waitMinutes: m });
      }
    }

    // savollarni va variantlarni aralashtirib, to'g'ri javobni faqat serverda saqlaymiz
    const picked = shuffle(pool).slice(0, QUESTIONS_PER_QUIZ);
    const order = picked.map(q => {
      const optOrder = shuffle(q.options.map((_, i) => i));
      return { correct: optOrder.indexOf(q.answer), optOrder };
    });
    const attempt = {
      id: `${t.id}_${uid()}`, groupId, name, nameKey: nk, topic: t.id, kind,
      startedAt: Date.now(), submittedAt: null, correct: 0, total: picked.length, percent: 0,
      order: order.map(o => o.correct)
    };
    await store.putAttempt(attempt);
    await store.linkStudentAttempt(attempt);

    res.json({
      attemptId: attempt.id,
      questions: picked.map((q, i) => ({
        situation: q.situation || '',
        q: q.q,
        options: order[i].optOrder.map(oi => q.options[oi])
      })),
      attemptNo: prior.length + 1,
      maxAttempts: MAX_ATTEMPTS
    });
  } finally {
    await store.unlock(lockKey).catch(() => {});
  }
}));

// ---------- TESTNI TOPSHIRISH ----------
app.post('/api/submit', wrap(async (req, res) => {
  const id = String(req.body.attemptId || '');
  const topic = id.split('_')[0];
  const a = /^\w+_[0-9a-f]+$/.test(id) ? await store.getAttempt(topic, id) : null;
  if (!a) return res.status(404).json({ error: 'Urinish topilmadi' });
  if (a.submittedAt) return res.status(400).json({ error: 'Bu urinish allaqachon topshirilgan' });
  if (Date.now() - a.startedAt > 3 * 3600 * 1000) return res.status(400).json({ error: 'Vaqt tugagan' });
  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  let correct = 0;
  a.order.forEach((c, i) => { if (answers[i] !== null && answers[i] !== undefined && Number(answers[i]) === c) correct++; });
  a.correct = correct;
  a.percent = a.total ? Math.round(correct * 100 / a.total) : 0;
  a.submittedAt = Date.now();
  await store.putAttempt(a);
  const used = (await store.studentAttempts(a.groupId, a.topic, a.kind, a.nameKey)).length;
  res.json({ correct, total: a.total, percent: a.percent, attemptsLeft: Math.max(0, MAX_ATTEMPTS - used), cooldown: COOLDOWN_MIN });
}));

// ---------- STATISTIKA (faqat mentor) ----------
app.get('/api/stats/:topic', auth, wrap(async (req, res) => {
  const t = findTopic(req.params.topic);
  if (!t) return res.status(404).json({ error: 'Topilmadi' });
  const [list, attempts] = await Promise.all([store.listGroups(), store.topicAttempts(t.id)]);
  const groups = list.map(g => ({ id: g.id, name: g.name, students: {} }));
  const byId = Object.fromEntries(groups.map(g => [g.id, g]));
  for (const a of attempts) {
    const g = byId[a.groupId];
    if (!g) continue;
    const s = g.students[a.nameKey] || (g.students[a.nameKey] = { name: a.name, test: [], case: [] });
    s[a.kind].push(a.submittedAt ? a.percent : 0);
  }
  res.json(groups.map(g => ({
    id: g.id, name: g.name,
    students: Object.values(g.students).sort((x, y) => x.name.localeCompare(y.name, 'uz'))
  })));
}));

// Kutilmagan xatolik — har doim JSON qaytaramiz (sahifa "Server javob bermadi" demasligi uchun)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Serverda xatolik. Bir ozdan keyin qayta urinib ko‘ring.' });
});

module.exports = app;   // Vercel shu eksportni oladi

if (require.main === module) {   // kompyuterda: npm start
  app.listen(PORT, () => {
    console.log(`Sayt ishga tushdi: http://localhost:${PORT}`);
    if (process.env.MENTOR_PASSWORD) console.log('Parol: MENTOR_PASSWORD o‘zgaruvchisidan olindi.');
    else if (filePass) console.log('Parol: data/parol.txt faylidan olindi.');
    else console.log('Parol: standart "mentor123" (data/parol.txt faylida o‘zgartirishingiz mumkin).');
  });
}
