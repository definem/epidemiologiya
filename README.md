# Epidemiologiya — mentor sayti

## Ishga tushirish (o'z kompyuteringizda)
1. Node.js o'rnating (https://nodejs.org, LTS versiya).
2. Shu papkada terminal oching:
   ```
   npm install
   MENTOR_PASSWORD=sizning_parolingiz npm start        (Windows PowerShell: $env:MENTOR_PASSWORD="parol"; npm start)
   ```
3. Brauzerda oching: http://localhost:3000  → mentor paroli bilan kiring.

Parol: `data/parol.txt` faylida (standart: `mentor123`). Faylni oching, o'z parolingizni yozing va serverni qayta yoqing. (Windows uchun eng oson usul shu.)

## Fayllar
| Fayl | Vazifasi |
|---|---|
| `data/topics.js` | **8 mavzu. Ma'lumot, 10 ta test, 10 ta vaziyatli masalani SHU YERGA qo'shasiz.** Ichida qanday joylash kerakligi yozilgan. |
| `server.js` | Qoidalar: 2 urinish, 40 daqiqa, hisoblash, statistika, parol. (Vercel shu faylni ishga tushiradi.) |
| `public/index.html` | Mentor sahifasi (mavzular, havolalar, guruhlar, statistika). |
| `public/student.html` | O'quvchi test sahifasi (telefon uchun). |
| `public/guide.html` | O'quvchilar uchun mavzu qo'llanmasi. |
| `public/style.css` | Dizayn (ranglar `:root` ichida). |
| `lib/store.js` | Natijalarni saqlash (Upstash Redis). |

## O'quvchilarga havolalar
Mentor sahifasida mavzuni oching — pastda ikkita havola (Test, Vaziyatli masala) va tepada qo'llanma havolasi bor.

## Vercelga joylash (doimiy, bepul)

Butun sayt — mentor paneli, qo'llanma va test sahifalari — **bitta Vercel loyihasi**da turadi.
Havolalar (qo'llanma, test, vaziyatli masala) avtomatik `https://SIZNING-LOYIHA.vercel.app/...` bo'lib chiqadi.
Natijalar bitta bazada saqlanadi, shuning uchun o'quvchi test ishlashi bilan mentor panelida ko'rinadi.

1. Loyihani GitHub'ga yuklang (yangi repository → fayllarni sudrab tashlang).
2. vercel.com → **Add New → Project** → shu repository'ni tanlang → **Deploy** (hech narsani o'zgartirmang).
3. Loyiha ichida **Storage** → **Create Database** → **Upstash Redis** (Free) → loyihaga ulang (Connect Project).
4. **Settings → Environment Variables** → `MENTOR_PASSWORD` = o'zingiz o'ylab topgan parol (Production uchun).
5. **Deployments** → oxirgisining ⋯ tugmasi → **Redeploy**.
6. `https://SIZNING-LOYIHA.vercel.app` ni oching → parol bilan kiring → guruhlarni qo'shing → havolalarni nusxalang.

Eslatma: Vercelda `data/parol.txt` ishlamaydi (u deploy qilinmaydi) — parol faqat `MENTOR_PASSWORD` orqali.
Mavzu ma'lumotlarini (`data/topics.js`) o'zgartirsangiz — GitHub'ga yuklang, Vercel o'zi qayta joylaydi. Natijalar (Redis) o'chib ketmaydi.

## Kompyuterda sinab ko'rish
`npm install` → `npm start` → http://localhost:3000. Redis ulanmagan bo'lsa natijalar vaqtincha xotirada turadi (server o'chsa yo'qoladi) — bu faqat sinov uchun.
