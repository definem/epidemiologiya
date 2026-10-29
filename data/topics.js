/*
 ============================================================
  MAVZULAR MA'LUMOTLARI — SHU FAYLGA O'ZINGIZ MA'LUMOT QO'SHASIZ
 ============================================================
  Faylni o'zgartirib saqlasangiz, server qayta ishga tushirilmasa ham
  yangi ma'lumot sahifada ko'rinadi (sahifani yangilang).

  HAR BIR MAVZUDA:
   - id        : mavzu raqami (o'zgartirmang)
   - hours     : soat
   - title     : qisqa nomi (ro'yxatda chiqadi)
   - syllabus  : mavzu rejasi (to'liq matn)
   - icon,color: bezak uchun emoji va rang
   - content   : MAVZU BO'YICHA ASOSIY MA'LUMOT (HTML ko'rinishida)
   - tests     : 10 ta test
   - cases     : 10 ta vaziyatli masala

  ------------------------------------------------------------
  content QANDAY YOZILADI? (backtick ` ` ichida, oddiy HTML bilan)
  ------------------------------------------------------------
    <h3>Sarlavha</h3>
    <p>Oddiy matn abzatsi.</p>
    <ul><li>Ro'yxat elementi</li><li>Yana bir element</li></ul>
    <p><b>Qalin yozuv</b>, <i>qiyshiq yozuv</i></p>
    <table><tr><th>Ustun 1</th><th>Ustun 2</th></tr>
          <tr><td>Katak</td><td>Katak</td></tr></table>
    <img src="/rasm/nom.jpg">   (rasm uchun: rasmni public/rasm papkasiga tashlang)

  ------------------------------------------------------------
  TEST QANDAY QO'SHILADI? (tests massiviga)
  ------------------------------------------------------------
    {
      q: "Savol matni?",
      options: ["Variant A", "Variant B", "Variant C", "Variant D"],
      answer: 1        // to'g'ri javob raqami: 0=A, 1=B, 2=C, 3=D
    },
    (Har bir testdan keyin vergul qo'yishni unutmang!)

  ------------------------------------------------------------
  VAZIYATLI MASALA QANDAY QO'SHILADI? (cases massiviga)
  ------------------------------------------------------------
    {
      situation: "Vaziyat tavsifi: bemor, belgilari, joyi va hokazo...",
      q: "Savol: Bu holatda birinchi navbatda nima qilish kerak?",
      options: ["Variant A", "Variant B", "Variant C", "Variant D"],
      answer: 0
    },

  Variantlar soni 2 tadan 6 tagacha bo'lishi mumkin.
  Test tartibi va variantlar o'quvchiga har safar aralashtirib beriladi.
  Agar 10 tadan ko'p savol qo'shsangiz, o'quvchiga tasodifiy 10 tasi beriladi.
 ============================================================
*/

module.exports = [
  {
    id: "1",
    hours: 4,
    title: "Asosiy epidemiologik tushunchalar. Epidemik jarayon haqidagi ta'limot",
    syllabus: `Asosiy epidemiologik tushunchalar. Epidemik jarayon haqidagi ta’limot. Yuqumli va yuqumli bo’lmagan kasalliklarni o’rganishga epidemiologik yondoshish. Epidemiologik tadqiqot usullari.`,
    icon: "🔬",
    color: "#e58fab",
    content: `
      <!-- ====== 1-MAVZU MA'LUMOTI SHU YERGA ====== -->
      <!-- Misol: <h3>Epidemik jarayon</h3><p>Matn...</p> -->
    `,
    tests: [
      // ====== 10 TA TEST SHU YERGA (pastdagi namuna — o'chirib, o'zingiznikini qo'ying) ======
      {
        q: "NAMUNA: Epidemik jarayonning uch bo'g'ini qaysi javobda to'g'ri keltirilgan?",
        options: [
          "Infeksiya manbai, yuqish mexanizmi, moyil aholi",
          "Vaksina, antibiotik, dezinfeksiya",
          "Bemor, shifokor, dori",
          "Inkubatsion davr, prodromal davr, tuzalish"
        ],
        answer: 0
      }
    ],
    cases: [
      // ====== 10 TA VAZIYATLI MASALA SHU YERGA (namuna — o'chirib, o'zingiznikini qo'ying) ======
      {
        situation: "NAMUNA: Maktabda bir sinfda 3 kun ichida 5 nafar o'quvchida bir xil kasallik belgilari aniqlandi.",
        q: "Birinchi navbatda qaysi chora ko'riladi?",
        options: [
          "Epidemiologik tekshiruv o'tkazish va bemorlarni aniqlash",
          "Hech narsa qilmasdan kutish",
          "Maktabni yozgacha yopish",
          "Faqat sinfni tozalash"
        ],
        answer: 0
      }
    ]
  },

  {
    id: "2",
    hours: 4,
    title: "DPM va SEM da profilaktika. Dezinfeksiya, dezinseksiya, deratizatsiya, sterilizatsiya. Emlash",
    syllabus: `Davolash profilaktik muassasalarida (DPM) va Sanitariya-epidemiologik muassasalarida profilaktik va epidemiyaga qarshi chora-tadbirlarni tashkillashtirish. Dezinfeksiya, dezinseksiya, deratizatsiya va sterilizatsiya. Ularning turlari, vositalari va qo’llash usullari. Dezinfeksion kameralar. Yuqumli kasalliklarning maxsus profilaktikasi. Emlash vositalari va ularni qo’llash usullari. Emlash ishlarini tashkillashtirish. Rejali Emlash kalendari. Emlash dori-darmonlarini saqlash sharoitlari Sovuqlik zanjiri. Xavfsiz emlashni tadbiq etish.`,
    icon: "💉",
    color: "#b49be0",
    content: `
      <!-- ====== 2-MAVZU MA'LUMOTI SHU YERGA ====== -->
    `,
    tests: [
      // ====== 10 TA TEST SHU YERGA ======
    ],
    cases: [
      // ====== 10 TA VAZIYATLI MASALA SHU YERGA ======
    ]
  },

  {
    id: "3",
    hours: 4,
    title: "O'tkir ichak infeksiyalari: shigellyoz, salmonellyoz, tif-paratif",
    syllabus: `O’tkir ichak infektsiyalari, shigellyozlar, salmonellyoz, tif-paratif, kasalliklarning epidemiologiyasi, profilaktikasi va epidemiyaga qarshi chora-tadbirlarni tashkillashtirishning o’ziga xosligi va moxiyati.`,
    icon: "🦠",
    color: "#f0a982",
    content: `
      <!-- ====== 3-MAVZU MA'LUMOTI SHU YERGA ====== -->
    `,
    tests: [
      // ====== 10 TA TEST SHU YERGA ======
    ],
    cases: [
      // ====== 10 TA VAZIYATLI MASALA SHU YERGA ======
    ]
  },

  {
    id: "4",
    hours: 4,
    title: "Nafas yo'li infeksiyalari epidemiologiyasi va profilaktikasi",
    syllabus: `Nafas yo’li infektsiyalari epidemiologiyasi, profilaktikasi va epidemiyaga qarshi chora-tadbirlarni tashkillashtirish: difteriya, qizamiq, ko’kyo’tal, tepki, skarlatina, meningokokk infektsiyasi, COVID-19, gripp va O’RVI.`,
    icon: "🫁",
    color: "#7fc4c0",
    content: `
      <!-- ====== 4-MAVZU MA'LUMOTI SHU YERGA ====== -->
    `,
    tests: [
      // ====== 10 TA TEST SHU YERGA ======
    ],
    cases: [
      // ====== 10 TA VAZIYATLI MASALA SHU YERGA ======
    ]
  },

  {
    id: "5",
    hours: 4,
    title: "Virusli gepatitlar, OITS va kasalxona ichi infeksiyalari",
    syllabus: `Virusli gepatitlar va Orttirilgan Immun Tanqisligi Sindromi (OITS) kasalliklar epidemiologiyasi va profilaktikasi. Virusli gepatitlarning immunoprofilaktikasi. Kasalxona ichi infektsiyalari, epidemiologik nazorat, profilaktikasi.`,
    icon: "🧬",
    color: "#e07a9a",
    content: `
      <!-- ====== 5-MAVZU MA'LUMOTI SHU YERGA ====== -->
    `,
    tests: [
      // ====== 10 TA TEST SHU YERGA ======
    ],
    cases: [
      // ====== 10 TA VAZIYATLI MASALA SHU YERGA ======
    ]
  },

  {
    id: "6",
    hours: 5,
    title: "Sapronoz va parazitar kasalliklar. Gelmintozlar, bezgak",
    syllabus: `Sapronoz kasalliklar. Ichak iersinozlari. Soxta sil. Gelmshtnozlar, biogelmshtnlar. Kasallikni kelib chiqishi, profilaktikasi va epidemiyaga qarshi chora-tadbirlarni tashkillashtirish. Parazitar kasalliklar epidemiologiyasi va profilaktikasi xususiyatlari. Bezgak va gelmintozlar.`,
    icon: "🪱",
    color: "#9cc98a",
    content: `
      <!-- ====== 6-MAVZU MA'LUMOTI SHU YERGA ====== -->
    `,
    tests: [
      // ====== 10 TA TEST SHU YERGA ======
    ],
    cases: [
      // ====== 10 TA VAZIYATLI MASALA SHU YERGA ======
    ]
  },

  {
    id: "7",
    hours: 5,
    title: "Hududlarni sanitariya muhofazasi. O'ta xavfli karantin infeksiyalari",
    syllabus: `O’zbekiston Respublikasi xududlarini karantin va o’ta havfli yuqumli kasalliklarning chet ellardan olib kiritilishidan sanitariya muxofazalash. O’ta havfli karantin infektsiyalarining epidemiologiyasi va profilaktikasi (QKGI, vabo, o’lat, kuydirgi). Kirish punktlarida sog’liqni saqlash sohasida favqulodda vaziyatlar rejasi na’munasiga kirish va yuriqnoma. KPda sog’liqni saqlash bo’yicha Standart operatsion protseduralar.`,
    icon: "🛂",
    color: "#d9a86c",
    content: `
      <!-- ====== 7-MAVZU MA'LUMOTI SHU YERGA ====== -->
    `,
    tests: [
      // ====== 10 TA TEST SHU YERGA ======
    ],
    cases: [
      // ====== 10 TA VAZIYATLI MASALA SHU YERGA ======
    ]
  },

  {
    id: "8",
    hours: 5,
    title: "Harbiy epidemiologiya moduli",
    syllabus: `Harbiy epidemiologiya moduli xaqida. Harbiy epidemiologiya va epidemik jarayonning rivojlanish qonuniyatlari. Harbiy jamoalar orasida epidemik jarayonning rivojlanish mexanizmi va namoyon bo’lish darajalarini o’rgatish.
Harbiy qismlarda o’tkaziladigan epidemiyaga qarshi chora-tadbirlar tizimi. Qo’shinlar orasida epidemiyaga qarshi chora-tadbirlarni o’tkazish va tashkillashtirish uchun jalb etiladigan kuchlar va vositalar. Epidemiyaga qarshi chora-tadbirlarni tashkillashtirishda qo’shinlardagi tibbiy xizmat va sanitariya – epidemiologiya muassasalarining rolini o’rgatish.
Bakteriologik (Biologik) qurol. Bakteriologik qurolga ta’rif. Qo’llanish tarixi. Bakteriologik qurolning jangovor jihatlari va tavsifi. Bakterial retsepturalar, ularni guruhlash, qo’llash usullari va yetkazish vositalari. Sun’iy ravishda keltirib chiqarilgan epidemik jarayonning rivojlanish mexanizmi va namoyon bo’lish darajalarini o’rgatish.
Sanitariya-epidemiologik razvetka. Bakteriologik razvetka. Sanitariya-epidemiologik razvetkaning asoslanuvchi prinsiplari, o’tkazish usullari. Bakteriologik razvetkaning asosiy vazifalari. Maxsus va mahsus bo’lmagan indikatsiya. Mahsus indikatsiya bosqichlarini aniqlashni o’rgatish.
Qo’shinlarni epidemiyaga qarshi va bakteriologik qurollar ta’siridan himoya qilishni tashkillashtirish. Qo’shinlarni bakteriologik quroldan himoya qilish haqida tushuncha.`,
    icon: "🛡️",
    color: "#8aa4d6",
    content: `
      <!-- ====== 8-MAVZU MA'LUMOTI SHU YERGA ====== -->
    `,
    tests: [
      // ====== 10 TA TEST SHU YERGA ======
    ],
    cases: [
      // ====== 10 TA VAZIYATLI MASALA SHU YERGA ======
    ]
  }
];
