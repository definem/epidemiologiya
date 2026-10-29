/*
 ============================================================
  BAZA QATLAMI
 ============================================================
  Vercelda fayl saqlanmaydi, shuning uchun natijalar Upstash Redis'da turadi.
  Muhit o'zgaruvchilari (Vercel o'zi qo'shadi):
    UPSTASH_REDIS_REST_URL  / UPSTASH_REDIS_REST_TOKEN
    yoki  KV_REST_API_URL   / KV_REST_API_TOKEN
  Agar ular yo'q bo'lsa (kompyuterda sinab ko'rayotganda) — vaqtinchalik xotira
  ishlatiladi: server o'chsa ma'lumot yo'qoladi.

  Ma'lumot tuzilishi (200+ o'quvchi bir vaqtda ishlasa ham to'qnashmasligi uchun
  har bir urinish alohida saqlanadi, bitta katta fayl emas):
    groups              (hash)  guruhId -> {id, name, createdAt}
    att:<mavzu>         (hash)  urinishId -> urinish
    stu:<guruh>:<mavzu>:<tur>:<ism>  (list)  shu o'quvchining urinish id'lari
    lock:...            (qisqa muddatli qulf: bir o'quvchi ikki marta bosib yuborsa)
*/

function makeMemoryClient() {
  const data = new Map();
  const clone = v => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
  return {
    kind: 'memory',
    async hset(key, obj) { const h = data.get(key) || {}; for (const k of Object.keys(obj)) h[k] = clone(obj[k]); data.set(key, h); },
    async hget(key, f) { const h = data.get(key); return h && f in h ? clone(h[f]) : null; },
    async hgetall(key) { const h = data.get(key); return h ? clone(h) : null; },
    async hdel(key, ...fs) { const h = data.get(key); if (h) fs.forEach(f => delete h[f]); },
    async rpush(key, ...vs) { const l = data.get(key) || []; l.push(...vs); data.set(key, l); return l.length; },
    async lrange(key, a, b) { const l = data.get(key) || []; return clone(l.slice(a, b === -1 ? undefined : b + 1)); },
    async del(...keys) { keys.forEach(k => data.delete(k)); },
    async set(key, val, opt = {}) {
      const e = data.get(key);
      if (opt.nx && e && (!e.exp || e.exp > Date.now())) return null;
      data.set(key, { val, exp: opt.ex ? Date.now() + opt.ex * 1000 : 0 });
      return 'OK';
    }
  };
}

function makeClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) {
    const { Redis } = require('@upstash/redis');
    const c = new Redis({ url, token });
    c.kind = 'redis';
    return c;
  }
  if (process.env.VERCEL) {
    console.error('DIQQAT: Redis bazasi ulanmagan! Vercel → Storage bo‘limidan Upstash Redis ulang.');
  } else {
    console.log('Eslatma: Redis ulanmagan — vaqtinchalik xotira ishlatilmoqda (server o‘chsa natijalar yo‘qoladi).');
  }
  return makeMemoryClient();
}

function createStore(client = makeClient()) {
  const stuKey = (groupId, topic, kind, nameKey) => `stu:${groupId}:${topic}:${kind}:${nameKey}`;
  const byTime = (a, b) => a.startedAt - b.startedAt;

  return {
    kind: client.kind,

    /* ---- guruhlar ---- */
    async listGroups() {
      const h = (await client.hgetall('groups')) || {};
      return Object.values(h).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    },
    async addGroup(g) { await client.hset('groups', { [g.id]: g }); },
    async removeGroup(id, topicIds) {
      await client.hdel('groups', id);
      for (const t of topicIds) {
        const all = (await client.hgetall('att:' + t)) || {};
        const mine = Object.values(all).filter(a => a.groupId === id);
        if (!mine.length) continue;
        await client.hdel('att:' + t, ...mine.map(a => a.id));
        const keys = [...new Set(mine.map(a => stuKey(a.groupId, a.topic, a.kind, a.nameKey)))];
        await client.del(...keys);
      }
    },

    /* ---- urinishlar ---- */
    async getAttempt(topic, id) { return client.hget('att:' + topic, id); },
    async putAttempt(a) { await client.hset('att:' + a.topic, { [a.id]: a }); },
    async topicAttempts(topic) { return Object.values((await client.hgetall('att:' + topic)) || {}).sort(byTime); },
    async studentAttempts(groupId, topic, kind, nameKey) {
      const ids = await client.lrange(stuKey(groupId, topic, kind, nameKey), 0, -1);
      if (!ids.length) return [];
      const out = [];
      for (const id of ids) { const a = await client.hget('att:' + topic, id); if (a) out.push(a); }
      return out.sort(byTime);
    },
    async linkStudentAttempt(a) { await client.rpush(stuKey(a.groupId, a.topic, a.kind, a.nameKey), a.id); },

    /* ---- qisqa qulf: bir o'quvchi "Boshlash"ni ikki marta bossa, 2 ta urinish yozilib ketmasin ---- */
    async lock(key, seconds = 10) { return (await client.set('lock:' + key, '1', { nx: true, ex: seconds })) === 'OK'; },
    async unlock(key) { await client.del('lock:' + key); }
  };
}

module.exports = { createStore, makeMemoryClient };
