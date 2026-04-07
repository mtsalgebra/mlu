// ═══════════════════════════════════════════════════════════════
// MATH LEVEL UP — questions.js
// Question generators for Level 1–10 (50 soal per level)
// ═══════════════════════════════════════════════════════════════

// ── LEVEL 1: Penjumlahan & Pengurangan Bilangan Bulat (1–100) ──
function genLevel1() {
  const qs = [];
  const templates = [
    // a + b
    () => { const a=R.int(1,99),b=R.int(1,99-a); const ans=a+b; return {text:`${a} + ${b} = ...`,answer:ans,explanation:`${a} + ${b} = ${ans}`}; },
    // a + b + c
    () => { const a=R.int(1,40),b=R.int(1,40),c=R.int(1,Math.min(20,100-a-b)); const ans=a+b+c; return {text:`${a} + ${b} + ${c} = ...`,answer:ans,explanation:`${a} + ${b} + ${c} = ${ans}`}; },
    // a - b  → hasil selalu ≥ 0
    () => { const b=R.int(1,80),a=R.int(b,100); const ans=a-b; return {text:`${a} − ${b} = ...`,answer:ans,explanation:`${a} − ${b} = ${ans}`}; },
    // a - b - c  → hasil selalu ≥ 0
    () => { const c=R.int(1,20),b=R.int(1,40),a=R.int(b+c,100); const ans=a-b-c; return {text:`${a} − ${b} − ${c} = ...`,answer:ans,explanation:`${a} − ${b} − ${c} = ${ans}`}; },
    // a + b - c  → hasil selalu ≥ 0
    () => { const a=R.int(10,60),b=R.int(5,30),c=R.int(1,a+b-1); const ans=a+b-c; return {text:`${a} + ${b} − ${c} = ...`,answer:ans,explanation:`${a} + ${b} − ${c} = ${ans}`}; },
    // a - b + c  → pastikan a > b
    () => { const b=R.int(5,40),a=R.int(b+1,80),c=R.int(1,30); const ans=a-b+c; return {text:`${a} − ${b} + ${c} = ...`,answer:ans,explanation:`${a} − ${b} + ${c} = ${ans}`}; },
  ];
  for (let i=0;i<50;i++) {
    const t = R.pick(templates)();
    const wrongs = [t.answer+R.int(1,5), t.answer-R.int(1,5), t.answer+R.int(6,15), t.answer-R.int(6,15)]
      .map(v=>Math.max(0,v))
      .filter(v=>v!==t.answer);
    qs.push({ type:R.pick(['pg','is']), ...t, choices: makeChoices(t.answer, wrongs) });
  }
  return R.shuffle(qs);
}

// ── LEVEL 2: Perkalian & Pembagian Bilangan Bulat ──────────────
function genLevel2() {
  const qs = [];
  const templates = [
    // a × b
    () => { const a=R.int(2,12),b=R.int(2,12); const ans=a*b; return {text:`${a} × ${b} = ...`,answer:ans,explanation:`${a} × ${b} = ${ans}`}; },
    // a ÷ b  → dibuat dari b*ans agar selalu bulat
    () => { const b=R.int(2,12),ans=R.int(2,12),a=b*ans; return {text:`${a} ÷ ${b} = ...`,answer:ans,explanation:`${a} ÷ ${b} = ${ans}`}; },
    // a × b × c
    () => { const a=R.int(2,10),b=R.int(2,10),c=R.int(2,5); const ans=a*b*c; return {text:`${a} × ${b} × ${c} = ...`,answer:ans,explanation:`${a} × ${b} × ${c} = ${ans}`}; },
    // a ÷ b ÷ c  → bangun mundur dari hasil agar integer
    () => {
      const ans=R.int(2,6), c=R.int(2,5), bMult=R.int(2,6);
      const middle=ans*c;
      const a=middle*bMult;
      const b=bMult;
      return {text:`${a} ÷ ${b} ÷ ${c} = ...`,answer:ans,explanation:`${a} ÷ ${b} = ${middle}, lalu ÷ ${c} = ${ans}`};
    },
    // a × b ÷ c  → b adalah kelipatan c
    () => {
      const c=R.int(2,8), mult=R.int(2,6), b=c*mult;
      const a=R.int(2,12);
      const ans=a*b/c;
      return {text:`${a} × ${b} ÷ ${c} = ...`,answer:ans,explanation:`${a} × ${b} = ${a*b}, lalu ÷ ${c} = ${ans}`};
    },
    // a ÷ b × c  → a habis dibagi b
    () => {
      const b=R.int(2,8), divResult=R.int(2,8), a=b*divResult;
      const c=R.int(2,8);
      const ans=divResult*c;
      return {text:`${a} ÷ ${b} × ${c} = ...`,answer:ans,explanation:`${a} ÷ ${b} = ${divResult}, lalu × ${c} = ${ans}`};
    },
  ];
  for (let i=0;i<50;i++) {
    const t = R.pick(templates)();
    const w = [t.answer+R.int(1,4), t.answer-R.int(1,4), t.answer+R.int(5,12), t.answer*2].filter(v=>v>0&&v!==t.answer);
    qs.push({ type:R.pick(['pg','is']), ...t, choices: makeChoices(t.answer, w) });
  }
  return R.shuffle(qs);
}

// ── LEVEL 3: Kombinasi Operasi Bilangan Bulat ──────────────────
// Pola dasar (9 sesuai PDF): a+b×c, a×b+c, a−b×c, a×b−c,
//   a+b÷c, a÷b+c, a−b÷c, a÷b−c, a+b−c×d÷e
// Pola tambahan (variasi ekstra): a×b+c−d, a×b−c+d,
//   a÷b+c−d, a÷b−c+d, a×b+c÷d, a×b−c÷d
// Semua hasil selalu bilangan bulat positif.
// Pengecoh dibuat mendekati jawaban benar agar efektif menguji
// pemahaman urutan operasi (prioritas × ÷ sebelum + −).
function genLevel3() {
  const qs = [];

  // ── helper: buat c×d yang habis dibagi e ──────────────────────
  // Kembalikan {c, d, e, cde} dengan cde = c×d÷e integer
  function makeCDE() {
    const e = R.int(2, 5), mult = R.int(1, 4), d = e * mult;
    const c = R.int(2, 8);
    return { c, d, e, cde: c * d / e };
  }
  // ── helper: buat a yang habis dibagi b ────────────────────────
  function makeDiv(bMin=2, bMax=8, multMin=2, multMax=8) {
    const b = R.int(bMin, bMax), mult = R.int(multMin, multMax);
    return { a: b * mult, b, divRes: mult };
  }
  // ── helper: buat b yang habis dibagi c ────────────────────────
  function makeMulDiv(cMin=2, cMax=8, multMin=2, multMax=6) {
    const c = R.int(cMin, cMax), mult = R.int(multMin, multMax);
    return { b: c * mult, c, divRes: mult };
  }

  const templates = [

    // ── 9 POLA DASAR PDF ───────────────────────────────────────

    // 1. a + b × c
    () => {
      const a=R.int(2,30), b=R.int(2,10), c=R.int(2,10);
      const ans=a+b*c;
      // Pengecoh khas: salah urutan → (a+b)×c
      const wrong1=(a+b)*c;
      return {text:`${a} + ${b} × ${c} = ...`, answer:ans,
        explanation:`Prioritas: kalikan dulu ${b}×${c}=${b*c}, baru tambah ${a}+${b*c}=${ans}`,
        wrongHint:[wrong1]};
    },
    // 2. a × b + c
    () => {
      const a=R.int(2,10), b=R.int(2,10), c=R.int(1,20);
      const ans=a*b+c;
      const wrong1=a*(b+c);
      return {text:`${a} × ${b} + ${c} = ...`, answer:ans,
        explanation:`${a}×${b}=${a*b}, lalu +${c} = ${ans}`,
        wrongHint:[wrong1]};
    },
    // 3. a − b × c  → pastikan hasil positif
    () => {
      const b=R.int(2,8), c=R.int(2,8), a=R.int(b*c+1, b*c+30);
      const ans=a-b*c;
      const wrong1=(a-b)*c;
      return {text:`${a} − ${b} × ${c} = ...`, answer:ans,
        explanation:`Kalikan dulu: ${b}×${c}=${b*c}, lalu ${a}−${b*c}=${ans}`,
        wrongHint:[wrong1]};
    },
    // 4. a × b − c  → pastikan a×b > c
    () => {
      const a=R.int(2,10), b=R.int(2,10), c=R.int(1, a*b-1);
      const ans=a*b-c;
      const wrong1=a*(b-c);
      return {text:`${a} × ${b} − ${c} = ...`, answer:ans,
        explanation:`${a}×${b}=${a*b}, lalu −${c} = ${ans}`,
        wrongHint:[wrong1 > 0 ? wrong1 : null]};
    },
    // 5. a + b ÷ c  → b habis dibagi c
    () => {
      const {b, c, divRes} = makeMulDiv();
      const a=R.int(2,20); const ans=a+divRes;
      const wrong1=(a+b)/c;
      return {text:`${a} + ${b} ÷ ${c} = ...`, answer:ans,
        explanation:`${b}÷${c}=${divRes}, lalu ${a}+${divRes}=${ans}`,
        wrongHint:[Number.isInteger(wrong1)?wrong1:null]};
    },
    // 6. a ÷ b + c  → a habis dibagi b
    () => {
      const {a, b, divRes} = makeDiv(2, 8, 2, 5);
      const c=R.int(1,20); const ans=divRes+c;
      const wrong1=a/(b+c);
      return {text:`${a} ÷ ${b} + ${c} = ...`, answer:ans,
        explanation:`${a}÷${b}=${divRes}, lalu +${c}=${ans}`,
        wrongHint:[Number.isInteger(wrong1)?wrong1:null]};
    },
    // 7. a − b ÷ c  → b habis dibagi c, a > divRes
    () => {
      const {b, c, divRes} = makeMulDiv();
      const a=R.int(divRes+1, divRes+20); const ans=a-divRes;
      const wrong1=(a-b)/c;
      return {text:`${a} − ${b} ÷ ${c} = ...`, answer:ans,
        explanation:`${b}÷${c}=${divRes}, lalu ${a}−${divRes}=${ans}`,
        wrongHint:[Number.isInteger(wrong1)&&wrong1>0?wrong1:null]};
    },
    // 8. a ÷ b − c  → a habis dibagi b, divRes > c
    () => {
      const {a, b, divRes} = makeDiv(2, 8, 3, 8);
      const c=R.int(1, divRes-1); const ans=divRes-c;
      const wrong1=a/b-c; // sama dengan ans tapi dipakai untuk penjelasan
      return {text:`${a} ÷ ${b} − ${c} = ...`, answer:ans,
        explanation:`${a}÷${b}=${divRes}, lalu −${c}=${ans}`};
    },
    // 9. a + b − c × d ÷ e  (pola kompleks utama dari PDF)
    () => {
      const {c, d, e, cde} = makeCDE();
      let a=R.int(5,30), b=R.int(1,20);
      let ans=a+b-cde;
      if(ans<=0) { a=cde+R.int(5,20); b=R.int(1,10); ans=a+b-cde; }
      const wrong1=a+b-c*d/e; // sama, untuk penjelasan
      const wrong2=(a+b-c)*d/e; // salah urutan operasi
      return {text:`${a} + ${b} − ${c} × ${d} ÷ ${e} = ...`, answer:ans,
        explanation:`Hitung ${c}×${d}÷${e}=${cde} dulu, lalu ${a}+${b}−${cde}=${ans}`,
        wrongHint:[Number.isInteger(wrong2)&&wrong2>0?wrong2:null]};
    },

    // ── POLA TAMBAHAN (variasi ekstra) ─────────────────────────

    // 10. a × b + c − d  → pastikan hasil positif
    () => {
      const a=R.int(2,8), b=R.int(2,8), c=R.int(2,15);
      const d=R.int(1, a*b+c-1); const ans=a*b+c-d;
      if(ans<=0) { const d2=R.int(1,5); return {text:`${a} × ${b} + ${c} − ${d2} = ...`, answer:a*b+c-d2, explanation:`${a}×${b}=${a*b}, lalu +${c}=${a*b+c}, lalu −${d2}=${a*b+c-d2}`}; }
      return {text:`${a} × ${b} + ${c} − ${d} = ...`, answer:ans,
        explanation:`${a}×${b}=${a*b}, lalu +${c}=${a*b+c}, lalu −${d}=${ans}`};
    },
    // 11. a × b − c + d  → pastikan a×b > c
    () => {
      const a=R.int(2,8), b=R.int(2,8), c=R.int(1, a*b-1);
      const d=R.int(1,15); const ans=a*b-c+d;
      return {text:`${a} × ${b} − ${c} + ${d} = ...`, answer:ans,
        explanation:`${a}×${b}=${a*b}, lalu −${c}=${a*b-c}, lalu +${d}=${ans}`};
    },
    // 12. a ÷ b + c − d  → a habis dibagi b, hasil positif
    () => {
      const {a, b, divRes} = makeDiv(2, 8, 3, 8);
      const c=R.int(2,15), d=R.int(1, divRes+c-1);
      const ans=divRes+c-d;
      if(ans<=0) { const d2=1; return {text:`${a} ÷ ${b} + ${c} − ${d2} = ...`, answer:divRes+c-d2, explanation:`${a}÷${b}=${divRes}, lalu +${c}=${divRes+c}, lalu −${d2}=${divRes+c-d2}`}; }
      return {text:`${a} ÷ ${b} + ${c} − ${d} = ...`, answer:ans,
        explanation:`${a}÷${b}=${divRes}, lalu +${c}=${divRes+c}, lalu −${d}=${ans}`};
    },
    // 13. a ÷ b − c + d  → a habis dibagi b, divRes > c
    () => {
      const {a, b, divRes} = makeDiv(2, 8, 4, 10);
      const c=R.int(1, divRes-1), d=R.int(1,15);
      const ans=divRes-c+d;
      return {text:`${a} ÷ ${b} − ${c} + ${d} = ...`, answer:ans,
        explanation:`${a}÷${b}=${divRes}, lalu −${c}=${divRes-c}, lalu +${d}=${ans}`};
    },
    // 14. a × b + c ÷ d  → c habis dibagi d
    () => {
      const a=R.int(2,8), b=R.int(2,8);
      const {b:c, c:d, divRes} = makeMulDiv(2,6,2,6); // c habis dibagi d
      const ans=a*b+divRes;
      const wrong1=a*b+c/d; // sama → untuk penjelasan
      const wrong2=(a*b+c)/d; // salah urutan
      return {text:`${a} × ${b} + ${c} ÷ ${d} = ...`, answer:ans,
        explanation:`${c}÷${d}=${divRes} dulu, lalu ${a}×${b}=${a*b}, kemudian ${a*b}+${divRes}=${ans}`,
        wrongHint:[Number.isInteger(wrong2)?wrong2:null]};
    },
    // 15. a × b − c ÷ d  → c habis dibagi d, a×b > divRes
    () => {
      const a=R.int(2,8), b=R.int(2,8);
      const {b:c, c:d, divRes} = makeMulDiv(2,6,2,6);
      if(a*b <= divRes) {
        // fallback: naikkan a
        const a2=R.int(divRes+1, divRes+10), b2=1;
        const ans2=a2*b2-divRes;
        return {text:`${a2} × ${b2} − ${c} ÷ ${d} = ...`, answer:ans2,
          explanation:`${c}÷${d}=${divRes}, lalu ${a2}×${b2}=${a2*b2}, kemudian ${a2*b2}−${divRes}=${ans2}`};
      }
      const ans=a*b-divRes;
      return {text:`${a} × ${b} − ${c} ÷ ${d} = ...`, answer:ans,
        explanation:`${c}÷${d}=${divRes} dulu, lalu ${a}×${b}=${a*b}, kemudian ${a*b}−${divRes}=${ans}`};
    },
    // 16. a − b + c × d  (pastikan hasil positif, c×d tidak terlalu besar)
    () => {
      const c=R.int(2,5), d=R.int(2,5), b=R.int(1,10);
      const a=R.int(b+1, b+20); const ans=a-b+c*d;
      return {text:`${a} − ${b} + ${c} × ${d} = ...`, answer:ans,
        explanation:`Kalikan dulu: ${c}×${d}=${c*d}, lalu ${a}−${b}+${c*d}=${ans}`};
    },
    // 17. a + b × c ÷ d  → b×c habis dibagi d
    () => {
      const a=R.int(2,20);
      const e=R.int(2,5), mult=R.int(2,5), c=e*mult; // c habis dibagi e
      const b=R.int(2,8), d=e; // d=e sehingga b×c÷d = b×mult
      const divRes=b*c/d;
      if(!Number.isInteger(divRes)) { // fallback
        const b2=R.int(2,6), c2=R.int(2,6), d2=1;
        return {text:`${a} + ${b2} × ${c2} ÷ ${d2} = ...`, answer:a+b2*c2, explanation:`${b2}×${c2}=${b2*c2}, lalu ${a}+${b2*c2}=${a+b2*c2}`};
      }
      const ans=a+divRes;
      return {text:`${a} + ${b} × ${c} ÷ ${d} = ...`, answer:ans,
        explanation:`${b}×${c}=${b*c}, lalu ÷${d}=${divRes}, lalu ${a}+${divRes}=${ans}`};
    },
  ];

  for (let i = 0; i < 50; i++) {
    const t = R.pick(templates)();
    // Pengecoh: kombinasi dari wrongHint (salah urutan operasi) + variasi numerik
    const hints = (t.wrongHint || []).filter(v => v !== null && v !== undefined && v !== t.answer && v > 0 && Number.isInteger(v));
    const numeric = [
      t.answer + R.int(1, 5),
      Math.max(1, t.answer - R.int(1, 5)),
      t.answer + R.int(6, 15),
      Math.max(1, t.answer - R.int(6, 15)),
    ].filter(v => v !== t.answer && v > 0);
    const w = [...hints, ...numeric].filter(v => v !== t.answer);
    qs.push({ type: R.pick(['pg','is']), ...t, choices: makeChoices(t.answer, w) });
  }
  return R.shuffle(qs);
}

// ── LEVEL 4: Konversi & Penyederhanaan Pecahan ─────────────────
// Sesuai PDF:
//   a/b  ↔  k l/m   (pecahan biasa ↔ campuran)
//   a/b  ↔  k,l     (pecahan biasa ↔ desimal) & sebaliknya
//   a/b  ↔  k%      (pecahan biasa ↔ persen) & sebaliknya
//   desimal ↔ persen
//   bentuk sederhana dari a/b
//   mengurutkan pecahan (bonus sesuai kata "mengurutkan" di PDF)
function genLevel4() {
  const qs = [];

  // Daftar pasangan (desimal, pecahan sederhana, persen) yang bersih
  const CLEAN = [
    { dec:0.5,  frac:'1/2',  pct:50  },
    { dec:0.25, frac:'1/4',  pct:25  },
    { dec:0.75, frac:'3/4',  pct:75  },
    { dec:0.2,  frac:'1/5',  pct:20  },
    { dec:0.4,  frac:'2/5',  pct:40  },
    { dec:0.6,  frac:'3/5',  pct:60  },
    { dec:0.8,  frac:'4/5',  pct:80  },
    { dec:0.125,frac:'1/8',  pct:12.5},
    { dec:0.375,frac:'3/8',  pct:37.5},
    { dec:0.625,frac:'5/8',  pct:62.5},
    { dec:0.1,  frac:'1/10', pct:10  },
    { dec:0.3,  frac:'3/10', pct:30  },
    { dec:0.7,  frac:'7/10', pct:70  },
    { dec:0.9,  frac:'9/10', pct:90  },
    { dec:0.05, frac:'1/20', pct:5   },
    { dec:0.15, frac:'3/20', pct:15  },
  ];

  for (let i = 0; i < 50; i++) {
    const kind = R.int(0, 6);
    let q;

    if (kind === 0) {
      // ── Pecahan biasa → desimal ────────────────────────────────
      const denoms = [2, 4, 5, 8, 10, 20, 25];
      const d = R.pick(denoms), n = R.int(1, d - 1);
      const dec = String(parseFloat((n / d).toFixed(d === 8 || d === 25 ? 3 : 2)));
      const wrong = [
        String(parseFloat((n / d + 0.1).toFixed(2))),
        String(parseFloat((n / d - 0.05).toFixed(2))),
        String(n * d),
        String(parseFloat(((n + 1) / d).toFixed(2))),
      ].filter(w => w !== dec && parseFloat(w) > 0);
      q = { text:`Ubah <b>${n}/${d}</b> ke bentuk desimal`, answer:dec,
            choices:makeChoices(dec, wrong), type:'pg',
            explanation:`${n} ÷ ${d} = ${dec}` };

    } else if (kind === 1) {
      // ── Desimal → pecahan sederhana ───────────────────────────
      const item = R.pick(CLEAN);
      const wrong = CLEAN.filter(x=>x.frac!==item.frac).slice(0,3).map(x=>x.frac);
      q = { text:`Ubah <b>${item.dec}</b> ke pecahan paling sederhana`,
            answer:item.frac, choices:makeChoices(item.frac, wrong), type:'pg',
            explanation:`${item.dec} = ${item.frac}` };

    } else if (kind === 2) {
      // ── Pecahan biasa ↔ persen (dua arah) ────────────────────
      const item = R.pick(CLEAN.filter(x=>Number.isInteger(x.pct)));
      const dir = R.pick([0, 1]); // 0=frac→pct, 1=pct→frac
      if (dir === 0) {
        const wrong = [
          `${item.pct + 5}%`, `${item.pct - 10}%`, `${item.pct * 2}%`,
          `${Math.max(1,item.pct - 5)}%`
        ].filter(w => w !== `${item.pct}%`);
        q = { text:`Ubah <b>${item.frac}</b> ke persen`,
              answer:`${item.pct}%`, choices:makeChoices(`${item.pct}%`, wrong), type:'pg',
              explanation:`${item.frac} × 100% = ${item.pct}%` };
      } else {
        const wrong = CLEAN.filter(x=>x.frac!==item.frac&&Number.isInteger(x.pct)).slice(0,3).map(x=>x.frac);
        q = { text:`Ubah <b>${item.pct}%</b> ke pecahan paling sederhana`,
              answer:item.frac, choices:makeChoices(item.frac, wrong), type:'pg',
              explanation:`${item.pct}% = ${item.pct}/100 = ${item.frac}` };
      }

    } else if (kind === 3) {
      // ── Desimal ↔ persen (dua arah) ──────────────────────────
      const opts = [[0.05,5],[0.10,10],[0.15,15],[0.20,20],[0.25,25],[0.30,30],
                    [0.40,40],[0.50,50],[0.60,60],[0.75,75],[0.80,80],[0.90,90]];
      const [dec, pct] = R.pick(opts);
      const dir = R.pick([0, 1]); // 0=dec→pct, 1=pct→dec
      if (dir === 0) {
        q = { text:`Ubah <b>${dec.toFixed(2)}</b> ke persen`,
              answer:`${pct}%`, type:'is',
              explanation:`${dec.toFixed(2)} × 100 = ${pct}%` };
      } else {
        q = { text:`Ubah <b>${pct}%</b> ke desimal`,
              answer:String(dec), type:'is',
              explanation:`${pct}% ÷ 100 = ${dec}` };
      }

    } else if (kind === 4) {
      // ── Pecahan biasa → campuran (a/b → k l/m) ──────────────
      // Buat pecahan tidak sejati: pembilang > penyebut
      // Pastikan sisa sudah dalam bentuk sederhana (gcd(rem,d)=1)
      const d = R.int(2, 8);
      const whole = R.int(1, 4);
      // Pilih rem yang sudah relatif prima dengan d agar tidak perlu simplifikasi lagi
      const candidates = [];
      for (let r = 1; r < d; r++) { if (gcd(r, d) === 1) candidates.push(r); }
      const rem = R.pick(candidates.length > 0 ? candidates : [1]);
      const n = whole * d + rem; // n > d → pecahan tidak sejati
      const ans = `${whole} ${rem}/${d}`;
      const wrong = [
        `${whole + 1} ${rem}/${d}`,
        `${whole} ${Math.min(rem + 1, d - 1)}/${d}`,
        `${Math.max(1, whole - 1)} ${rem}/${d}`,
        `${n}/${d + 1}`
      ].filter(w => w !== ans);
      q = { text:`Ubah <b>${n}/${d}</b> ke pecahan campuran`,
            answer:ans, choices:makeChoices(ans, wrong), type:'pg',
            explanation:`${n} ÷ ${d} = ${whole} sisa ${rem}, jadi ${whole} ${rem}/${d}` };

    } else if (kind === 5) {
      // ── Campuran → pecahan biasa (k l/m → a/b) ───────────────
      // Pastikan rem dan d relatif prima agar campuran sudah sederhana
      const d = R.int(2, 8);
      const whole = R.int(1, 4);
      const candidates2 = [];
      for (let r = 1; r < d; r++) { if (gcd(r, d) === 1) candidates2.push(r); }
      const rem = R.pick(candidates2.length > 0 ? candidates2 : [1]);
      const n = whole * d + rem;
      const ans = `${n}/${d}`;
      const wrong = [
        `${n + 1}/${d}`, `${n}/${d + 1}`,
        `${n - 1}/${d}`, `${whole * rem}/${d}`
      ].filter(w => w !== ans);
      q = { text:`Ubah <b>${whole} ${rem}/${d}</b> ke pecahan biasa`,
            answer:ans, choices:makeChoices(ans, wrong), type:'pg',
            explanation:`${whole}×${d}+${rem} = ${n}, jadi ${n}/${d}` };

    } else {
      // ── Sederhanakan pecahan (kind === 6) ─────────────────────
      let n, d, g0;
      do { g0 = R.int(2, 8); n = g0 * R.int(2, 7); d = g0 * R.int(2, 7); } while (n === d);
      const [sn, sd] = simplify(n, d);
      const ans = `${sn}/${sd}`;
      const wrong = [
        `${sn + 1}/${sd}`, `${sn}/${sd + 1}`,
        `${n}/${d}`, `${sn + 2}/${sd}`
      ].filter(w => w !== ans);
      q = { text:`Bentuk paling sederhana dari <b>${n}/${d}</b> adalah`,
            answer:ans, choices:makeChoices(ans, wrong), type:'pg',
            explanation:`FPB(${n},${d})=${gcd(n,d)}, jadi ${n}/${d} = ${ans}` };
    }

    qs.push({ ...q, choices: q.choices || makeChoices(q.answer, []) });
  }
  return R.shuffle(qs);
}


// ── LEVEL 5: Penjumlahan & Pengurangan Pecahan — 100% PILIHAN GANDA ──
// Bagian 1 : Penyebut sejenis — a/b ± c/b dan campuran a b/c ± d e/c
// Bagian 2 : Penyebut tidak sejenis — a/b ± c/d dan campuran a b/c ± d e/f
// Bagian 3 : Desimal — a,b ± c,d
// Bagian 4 : Kombinasi campuran ± campuran, campuran ± biasa, campuran ± desimal, biasa ± desimal
function genLevel5() {
  const qs = [];

  function toMixed(num, den) {
    const [sn, sd] = simplify(num, den);
    if (sn <= 0) return { str: '0' };
    const w = Math.floor(sn / sd), r = sn % sd;
    if (r === 0) return { str: String(w) };
    if (w === 0) return { str: `${r}/${sd}` };
    return { str: `${w} ${r}/${sd}` };
  }

  // Buat pengecoh yang masuk akal untuk jawaban pecahan/campuran/desimal
  function fracWrongs(correctStr, num, den) {
    const pool = new Set();
    // Pengecoh 1: pembilang ± 1
    pool.add(toMixed(num + 1, den).str);
    pool.add(toMixed(Math.max(1, num - 1), den).str);
    // Pengecoh 2: penyebut ± 1 (kesalahan umum)
    if (den > 2) pool.add(toMixed(num, den - 1).str);
    pool.add(toMixed(num, den + 1).str);
    // Pengecoh 3: pembilang + 2
    pool.add(toMixed(num + 2, den).str);
    // Pengecoh 4: tidak disederhanakan (tampilkan num/den mentah)
    const [sn, sd] = simplify(num, den);
    if (sd !== den) pool.add(`${sn > 0 ? sn : num + 1}/${sd !== den ? sd + 1 : sd}`);
    return [...pool].filter(v => v !== correctStr && v !== '0').slice(0, 3);
  }

  function decWrongs(correctVal) {
    const delta = [0.1, 0.2, 0.3, 0.5];
    return delta.map(d => String(parseFloat((correctVal + d).toFixed(2))))
      .concat(delta.map(d => String(parseFloat(Math.max(0.1, correctVal - d).toFixed(2)))))
      .filter(v => v !== String(correctVal))
      .slice(0, 3);
  }

  for (let i = 0; i < 50; i++) {
    const bagian = R.int(0, 3);
    let q;

    // ── BAGIAN 1: Penyebut sejenis ─────────────────────────────
    if (bagian === 0) {
      const subkind = R.pick([0, 1]);
      const op = R.pick(['+', '-']);

      if (subkind === 0) {
        // a/b ± c/b
        const d = R.int(3, 12);
        let a, c, n;
        if (op === '+') {
          a = R.int(1, d - 1); c = R.int(1, d - 1); n = a + c;
        } else {
          c = R.int(1, d - 2); a = R.int(c + 1, d - 1); n = a - c;
        }
        const res = toMixed(n, d);
        const wrongs = fracWrongs(res.str, n, d);
        q = {
          text: `${a}/${d} ${op === '+' ? '+' : '−'} ${c}/${d} = ...`,
          answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `(${a}${op}${c})/${d} = ${n}/${d} = ${res.str}`
        };
      } else {
        // a b/c ± d e/c
        const d = R.int(3, 8);
        const w1 = R.int(1, 5), n1 = R.int(1, d - 1);
        const w2 = R.int(1, 4), n2 = R.int(1, d - 1);
        const tot1 = w1 * d + n1, tot2 = w2 * d + n2;
        let totNum, teksQ;
        if (op === '+') {
          totNum = tot1 + tot2;
          teksQ = `${w1} ${n1}/${d} + ${w2} ${n2}/${d} = ...`;
        } else {
          const [big, bigW, bigN, small, smallW, smallN] =
            tot1 >= tot2 ? [tot1,w1,n1,tot2,w2,n2] : [tot2,w2,n2,tot1,w1,n1];
          totNum = big - small;
          teksQ = `${bigW} ${bigN}/${d} − ${smallW} ${smallN}/${d} = ...`;
        }
        const res = toMixed(totNum, d);
        const wrongs = fracWrongs(res.str, totNum, d);
        q = {
          text: teksQ, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: op === '+'
            ? `${tot1}/${d} + ${tot2}/${d} = ${totNum}/${d} = ${res.str}`
            : `Kurangkan: ${totNum}/${d} = ${res.str}`
        };
      }

    // ── BAGIAN 2: Penyebut tidak sejenis ──────────────────────
    } else if (bagian === 1) {
      const subkind = R.pick([0, 1]);
      const op = R.pick(['+', '-']);

      if (subkind === 0) {
        // a/b ± c/d
        const b = R.int(2, 8), d = R.int(2, 8);
        const a = R.int(1, b), c = R.int(1, d);
        const L = lcm(b, d);
        const termA = a * (L / b), termC = c * (L / d);
        let num, teksQ;
        if (op === '+') {
          num = termA + termC;
          teksQ = `${a}/${b} + ${c}/${d} = ...`;
        } else {
          if (termA >= termC) {
            num = termA - termC; teksQ = `${a}/${b} − ${c}/${d} = ...`;
          } else {
            num = termC - termA; teksQ = `${c}/${d} − ${a}/${b} = ...`;
          }
          if (num === 0) { num = termA + termC; teksQ = `${a}/${b} + ${c}/${d} = ...`; }
        }
        const res = toMixed(num, L);
        const wrongs = fracWrongs(res.str, num, L);
        q = {
          text: teksQ, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `KPK(${b},${d})=${L}: ${num}/${L} = ${res.str}`
        };
      } else {
        // a b/c ± d e/f
        const b = R.int(2, 6), f = R.int(2, 6);
        const w1 = R.int(1, 5), n1 = R.int(1, b - 1);
        const w2 = R.int(1, 4), n2 = R.int(1, f - 1);
        const L = lcm(b, f);
        const tTot1 = (w1 * b + n1) * (L / b), tTot2 = (w2 * f + n2) * (L / f);
        let num, teksQ;
        if (op === '+') {
          num = tTot1 + tTot2; teksQ = `${w1} ${n1}/${b} + ${w2} ${n2}/${f} = ...`;
        } else {
          if (tTot1 >= tTot2) {
            num = tTot1 - tTot2; teksQ = `${w1} ${n1}/${b} − ${w2} ${n2}/${f} = ...`;
          } else {
            num = tTot2 - tTot1; teksQ = `${w2} ${n2}/${f} − ${w1} ${n1}/${b} = ...`;
          }
          if (num === 0) { num = tTot1 + tTot2; teksQ = `${w1} ${n1}/${b} + ${w2} ${n2}/${f} = ...`; }
        }
        const res = toMixed(num, L);
        const wrongs = fracWrongs(res.str, num, L);
        q = {
          text: teksQ, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `KPK(${b},${f})=${L}: ${num}/${L} = ${res.str}`
        };
      }

    // ── BAGIAN 3: Desimal ─────────────────────────────────────
    } else if (bagian === 2) {
      const op = R.pick(['+', '-']);
      const rawA = R.int(10, 99) / 10, rawB = R.int(10, 99) / 10;
      const larger = Math.max(rawA, rawB), smaller = Math.min(rawA, rawB);
      const a = (op === '+' ? rawA : larger).toFixed(1);
      const b = (op === '+' ? rawB : smaller).toFixed(1);
      const rawAns = op === '+' ? (parseFloat(a) + parseFloat(b)) : (parseFloat(a) - parseFloat(b));
      const ans = String(parseFloat(rawAns.toFixed(1)));
      const wrongs = decWrongs(parseFloat(ans));
      q = {
        text: `${a} ${op === '+' ? '+' : '−'} ${b} = ...`,
        answer: ans, type: 'pg',
        choices: makeChoices(ans, wrongs),
        explanation: `${a} ${op} ${b} = ${ans}`
      };

    // ── BAGIAN 4: Kombinasi campuran/biasa/desimal ─────────────
    } else {
      const subkind = R.int(0, 3);

      if (subkind === 0) {
        // a b/c ± d/e
        const b = R.int(2, 6), e = R.int(2, 8);
        const w = R.int(1, 5), nb = R.int(1, b - 1), ne = R.int(1, e);
        const op = R.pick(['+', '-']);
        const L = lcm(b, e);
        const tW = (w * b + nb) * (L / b), tE = ne * (L / e);
        let num, teksQ;
        if (op === '+') {
          num = tW + tE; teksQ = `${w} ${nb}/${b} + ${ne}/${e} = ...`;
        } else {
          if (tW >= tE) {
            num = tW - tE; teksQ = `${w} ${nb}/${b} − ${ne}/${e} = ...`;
          } else {
            num = tE - tW; teksQ = `${ne}/${e} + ${w} ${nb}/${b} = ...`;
          }
          if (num === 0) { num = tW + tE; teksQ = `${w} ${nb}/${b} + ${ne}/${e} = ...`; }
        }
        const res = toMixed(num, L);
        const wrongs = fracWrongs(res.str, num, L);
        q = {
          text: teksQ, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `= ${w*b+nb}/${b} ${op} ${ne}/${e}, KPK=${L}: ${num}/${L} = ${res.str}`
        };

      } else if (subkind === 1) {
        // a b/c ± desimal
        const b = R.int(2, 5);
        const w = R.int(1, 4), nb = R.int(1, b - 1);
        const decOptions = [0.5, 0.25, 0.75, 0.2, 0.4, 0.6, 0.8];
        const dec = R.pick(decOptions);
        const op = R.pick(['+', '-']);
        const campDec = w + nb / b;
        let rawAns = op === '+' ? campDec + dec : (campDec >= dec ? campDec - dec : dec - campDec);
        const ansStr = String(parseFloat(rawAns.toFixed(3)));
        const wrongs = decWrongs(parseFloat(ansStr));
        q = {
          text: `${w} ${nb}/${b} ${op === '+' ? '+' : '−'} ${dec} = ...`,
          answer: ansStr, type: 'pg',
          choices: makeChoices(ansStr, wrongs),
          explanation: `${w} ${nb}/${b} = ${parseFloat(campDec.toFixed(3))}, lalu ${op} ${dec} = ${ansStr}`
        };

      } else if (subkind === 2) {
        // a/b ± desimal
        const b = R.pick([2, 4, 5, 10]);
        const n = R.int(1, b - 1);
        const decOptions = [[0.5,'0.5'],[0.25,'0.25'],[0.2,'0.2'],[0.4,'0.4'],[0.75,'0.75']];
        const [dec, decStr] = R.pick(decOptions);
        const op = R.pick(['+', '-']);
        const fracDec = n / b;
        let rawAns = op === '+' ? fracDec + dec : (fracDec >= dec ? fracDec - dec : dec - fracDec);
        const ansStr = String(parseFloat(rawAns.toFixed(3)));
        const wrongs = decWrongs(parseFloat(ansStr));
        q = {
          text: `${n}/${b} ${op === '+' ? '+' : '−'} ${decStr} = ...`,
          answer: ansStr, type: 'pg',
          choices: makeChoices(ansStr, wrongs),
          explanation: `${n}/${b} = ${parseFloat(fracDec.toFixed(3))}, lalu ${op} ${decStr} = ${ansStr}`
        };

      } else {
        // a b/c ± d e/f (campuran ± campuran, penyebut beda)
        const b = R.int(2, 6), f = R.int(2, 6);
        const w1 = R.int(1, 5), n1 = R.int(1, b - 1);
        const w2 = R.int(1, 4), n2 = R.int(1, f - 1);
        const op = R.pick(['+', '-']);
        const L = lcm(b, f);
        const tTot1 = (w1 * b + n1) * (L / b), tTot2 = (w2 * f + n2) * (L / f);
        let num, teksQ;
        if (op === '+') {
          num = tTot1 + tTot2; teksQ = `${w1} ${n1}/${b} + ${w2} ${n2}/${f} = ...`;
        } else {
          if (tTot1 >= tTot2) {
            num = tTot1 - tTot2; teksQ = `${w1} ${n1}/${b} − ${w2} ${n2}/${f} = ...`;
          } else {
            num = tTot2 - tTot1; teksQ = `${w2} ${n2}/${f} − ${w1} ${n1}/${b} = ...`;
          }
          if (num === 0) { num = tTot1 + tTot2; teksQ = `${w1} ${n1}/${b} + ${w2} ${n2}/${f} = ...`; }
        }
        const res = toMixed(num, L);
        const wrongs = fracWrongs(res.str, num, L);
        q = {
          text: teksQ, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `KPK(${b},${f})=${L}: ${num}/${L} = ${res.str}`
        };
      }
    }

    qs.push(q);
  }
  return R.shuffle(qs);
}

// ── LEVEL 6: Perkalian & Pembagian Pecahan — 100% PILIHAN GANDA ──
// Bagian 1 : Penyebut sejenis  — a/b ×÷ c/b  &  campuran ×÷ campuran sejenis
// Bagian 2 : Penyebut tidak sejenis — a/b ×÷ c/d  &  campuran ×÷ campuran beda penyebut
// Bagian 3 : Desimal — a,b ×÷ c,d
// Bagian 4 : Campuran ×÷ biasa, campuran ×÷ desimal, biasa ×÷ desimal
function genLevel6() {
  const qs = [];

  function toMixed(num, den) {
    const [sn, sd] = simplify(num, den);
    if (sn <= 0) return { str: '0' };
    const w = Math.floor(sn / sd), r = sn % sd;
    if (r === 0) return { str: String(w) };
    if (w === 0) return { str: `${r}/${sd}` };
    return { str: `${w} ${r}/${sd}` };
  }

  function fracWrongs(correctStr, num, den) {
    const pool = new Set();
    pool.add(toMixed(num + 1, den).str);
    pool.add(toMixed(Math.max(1, num - 1), den).str);
    if (den > 2) pool.add(toMixed(num, den - 1).str);
    pool.add(toMixed(num, den + 1).str);
    pool.add(toMixed(num + 2, den).str);
    const [sn, sd] = simplify(num, den);
    if (sd !== den && num > 0) pool.add(`${sn}/${sd + 1}`);
    return [...pool].filter(v => v !== correctStr && v !== '0').slice(0, 3);
  }

  function decWrongs(correctVal) {
    const deltas = [0.1, 0.2, 0.3, 0.5, 1.0];
    return deltas.map(d => String(parseFloat((correctVal + d).toFixed(2))))
      .concat(deltas.map(d => String(parseFloat(Math.max(0.01, correctVal - d).toFixed(2)))))
      .filter(v => v !== String(correctVal))
      .slice(0, 3);
  }

  for (let i = 0; i < 50; i++) {
    const bagian = R.int(0, 3);
    let q;

    // ── BAGIAN 1: Penyebut sejenis ─────────────────────────────
    if (bagian === 0) {
      const subkind = R.pick([0, 1]);
      const op = R.pick(['×', '÷']);

      if (subkind === 0) {
        // a/b ×÷ c/b
        const d = R.int(2, 10), a = R.int(1, d), c = R.int(1, d);
        let num, den, expStr;
        if (op === '×') {
          num = a * c; den = d * d;
          expStr = `${a}×${c} / ${d}×${d} = ${num}/${den}`;
        } else {
          num = a * d; den = d * c;
          expStr = `${a}/${d} × ${d}/${c} = ${a*d}/${d*c}`;
        }
        const res = toMixed(num, den);
        const wrongs = fracWrongs(res.str, num, den);
        q = {
          text: `${a}/${d} ${op} ${c}/${d} = ...`, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `${expStr} = ${res.str}`
        };
      } else {
        // Campuran ×÷ campuran (penyebut SAMA)
        const d = R.int(2, 6);
        const w1 = R.int(1, 4), n1 = R.int(1, d - 1);
        const w2 = R.int(1, 3), n2 = R.int(1, d - 1);
        const tot1 = w1 * d + n1, tot2 = w2 * d + n2;
        let num, den, expStr;
        if (op === '×') {
          num = tot1 * tot2; den = d * d;
          expStr = `${tot1}/${d} × ${tot2}/${d} = ${num}/${den}`;
        } else {
          num = tot1 * d; den = d * tot2;
          expStr = `${tot1}/${d} × ${d}/${tot2} = ${num}/${den}`;
        }
        const res = toMixed(num, den);
        const wrongs = fracWrongs(res.str, num, den);
        q = {
          text: `${w1} ${n1}/${d} ${op} ${w2} ${n2}/${d} = ...`, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `${expStr} = ${res.str}`
        };
      }

    // ── BAGIAN 2: Penyebut tidak sejenis ──────────────────────
    } else if (bagian === 1) {
      const subkind = R.pick([0, 1]);
      const op = R.pick(['×', '÷']);

      if (subkind === 0) {
        // a/b ×÷ c/d
        const b = R.int(2, 8), d = R.int(2, 8);
        const a = R.int(1, b), c = R.int(1, d);
        let num, den, expStr;
        if (op === '×') {
          num = a * c; den = b * d;
          expStr = `${a}×${c} / ${b}×${d} = ${num}/${den}`;
        } else {
          num = a * d; den = b * c;
          expStr = `${a}/${b} × ${d}/${c} = ${num}/${den}`;
        }
        const res = toMixed(num, den);
        const wrongs = fracWrongs(res.str, num, den);
        q = {
          text: `${a}/${b} ${op} ${c}/${d} = ...`, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `${expStr} = ${res.str}`
        };
      } else {
        // Campuran ×÷ campuran (penyebut beda)
        const b = R.int(2, 5), f = R.int(2, 5);
        const w1 = R.int(1, 3), n1 = R.int(1, b - 1);
        const w2 = R.int(1, 3), n2 = R.int(1, f - 1);
        const tot1 = w1 * b + n1, tot2 = w2 * f + n2;
        let num, den, expStr;
        if (op === '×') {
          num = tot1 * tot2; den = b * f;
          expStr = `${tot1}/${b} × ${tot2}/${f} = ${num}/${den}`;
        } else {
          num = tot1 * f; den = b * tot2;
          expStr = `${tot1}/${b} × ${f}/${tot2} = ${num}/${den}`;
        }
        const res = toMixed(num, den);
        const wrongs = fracWrongs(res.str, num, den);
        q = {
          text: `${w1} ${n1}/${b} ${op} ${w2} ${n2}/${f} = ...`, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `${expStr} = ${res.str}`
        };
      }

    // ── BAGIAN 3: Desimal ×÷ desimal ──────────────────────────
    } else if (bagian === 2) {
      const op = R.pick(['×', '÷']);
      let ans, teksQ, expStr;
      if (op === '×') {
        const a = (R.int(1, 9) / 10).toFixed(1), b = (R.int(1, 9) / 10).toFixed(1);
        ans = String(parseFloat((parseFloat(a) * parseFloat(b)).toFixed(2)));
        teksQ = `${a} × ${b} = ...`;
        expStr = `${a} × ${b} = ${ans}`;
        const wrongs = decWrongs(parseFloat(ans));
        q = { text: teksQ, answer: ans, type: 'pg', choices: makeChoices(ans, wrongs), explanation: expStr };
      } else {
        const pairs = [
          [0.6,0.2,3],[0.8,0.4,2],[0.9,0.3,3],[1.2,0.4,3],[1.5,0.3,5],
          [0.4,0.2,2],[1.6,0.4,4],[0.8,0.2,4],[2.4,0.6,4],[1.8,0.6,3],
          [3.0,0.5,6],[2.5,0.5,5],[4.8,0.8,6],[3.6,0.9,4]
        ];
        const [a, b, ansNum] = R.pick(pairs);
        ans = String(ansNum);
        teksQ = `${a.toFixed(1)} ÷ ${b.toFixed(1)} = ...`;
        expStr = `${a.toFixed(1)} ÷ ${b.toFixed(1)} = ${ans}`;
        const wrongs = [String(ansNum+1), String(Math.max(1,ansNum-1)), String(ansNum+2), String(ansNum*2)].filter(v=>v!==ans);
        q = { text: teksQ, answer: ans, type: 'pg', choices: makeChoices(ans, wrongs), explanation: expStr };
      }

    // ── BAGIAN 4: Campuran/biasa ×÷ biasa/desimal ─────────────
    } else {
      const subkind = R.int(0, 2);
      const op = R.pick(['×', '÷']);

      if (subkind === 0) {
        // Campuran ×÷ biasa (penyebut beda)
        const nb = R.int(2, 6), nn = R.int(1, nb - 1), w = R.int(1, 5);
        const c = R.int(1, 5), d = R.int(2, 8);
        const tot = w * nb + nn;
        let num, den;
        if (op === '×') { num = tot * c; den = nb * d; }
        else             { num = tot * d; den = nb * c; }
        const res = toMixed(num, den);
        const wrongs = fracWrongs(res.str, num, den);
        q = {
          text: `${w} ${nn}/${nb} ${op} ${c}/${d} = ...`, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: op === '×'
            ? `${tot}/${nb} × ${c}/${d} = ${num}/${den} = ${res.str}`
            : `${tot}/${nb} × ${d}/${c} = ${num}/${den} = ${res.str}`
        };

      } else if (subkind === 1) {
        // Campuran ×÷ desimal
        const nb = R.int(2, 4), nn = R.int(1, nb - 1), w = R.int(1, 4);
        const decMap = [[0.5,'1/2',1,2],[0.25,'1/4',1,4],[0.75,'3/4',3,4],[0.2,'1/5',1,5],[0.4,'2/5',2,5]];
        const [dec, decStr, dn, dd] = R.pick(decMap);
        const tot = w * nb + nn;
        let num, den;
        if (op === '×') { num = tot * dn; den = nb * dd; }
        else             { num = tot * dd; den = nb * dn; }
        const res = toMixed(num, den);
        const wrongs = fracWrongs(res.str, num, den);
        q = {
          text: `${w} ${nn}/${nb} ${op} ${decStr} = ...`, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `${decStr} = ${dn}/${dd}: ${tot}/${nb} ${op === '×' ? '×' : '÷'} ${dn}/${dd} = ${num}/${den} = ${res.str}`
        };

      } else {
        // Biasa ×÷ desimal
        const b = R.pick([2, 4, 5]), a = R.int(1, b - 1);
        const decMap = [[0.5,1,2],[0.25,1,4],[0.75,3,4],[0.2,1,5],[0.4,2,5]];
        const [dec, dn, dd] = R.pick(decMap);
        let num, den;
        if (op === '×') { num = a * dn; den = b * dd; }
        else             { num = a * dd; den = b * dn; }
        const res = toMixed(num, den);
        const wrongs = fracWrongs(res.str, num, den);
        q = {
          text: `${a}/${b} ${op} ${dec} = ...`, answer: res.str, type: 'pg',
          choices: makeChoices(res.str, wrongs),
          explanation: `${dec}=${dn}/${dd}: ${a}/${b} ${op === '×' ? '×' : '×kebalik'} ${dn}/${dd} = ${num}/${den} = ${res.str}`
        };
      }
    }

    qs.push(q);
  }
  return R.shuffle(qs);
}

// ── LEVEL 7: KPK & FPB ─────────────────────────────────────────
function genLevel7() {
  const qs = [];
  for (let i = 0; i < 50; i++) {
    const kind = R.int(0, 3);
    let q;

    if (kind === 0 || kind === 1) {
      // Soal langsung KPK atau FPB (2 bilangan)
      let a, b;
      do { const base = R.int(2, 8); a = base * R.int(2, 6); b = base * R.int(2, 6); } while (a === b);
      const fpb = gcd(a, b), kpk = lcm(a, b);
      const askKPK = kind === 0;
      const ans = askKPK ? kpk : fpb;
      const w = [ans + R.int(1, 5), ans - R.int(1, 3), ans * 2, fpb + kpk].filter(v => v > 0 && v !== ans);
      q = { text: `${askKPK ? 'KPK' : 'FPB'} dari ${a} dan ${b} adalah ...`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `FPB(${a},${b})=${fpb}, KPK(${a},${b})=${kpk}. Jawaban: ${ans}` };

    } else if (kind === 2) {
      // KPK atau FPB dari 3 bilangan
      const a = R.pick([4, 6, 8, 12, 15, 18, 20]);
      const b = R.pick([6, 9, 12, 15, 18, 24]);
      const c = R.pick([8, 12, 16, 20, 24]);
      const fpb3 = gcd(gcd(a, b), c), kpk3 = lcm(lcm(a, b), c);
      const askKPK = R.pick([true, false]);
      const ans = askKPK ? kpk3 : fpb3;
      const w = [ans + R.int(1, 6), Math.max(1, ans - R.int(1, 4)), ans + 10, ans * 2].filter(v => v > 0 && v !== ans);
      q = { text: `${askKPK ? 'KPK' : 'FPB'} dari ${a}, ${b}, dan ${c} adalah ...`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `Jawaban: ${ans}` };

    } else {
      // Soal cerita — lebih banyak variasi
      const stories = [
        () => {
          const a = R.pick([2, 3, 4, 5, 6]), b = R.pick([3, 4, 5, 6, 8]);
          const k = lcm(a, b);
          return { text: `Lampu A berkedip setiap ${a} detik, lampu B setiap ${b} detik. Berapa detik mereka berkedip bersama pertama kali?`, answer: k, explanation: `KPK(${a},${b}) = ${k} detik` };
        },
        () => {
          const a = R.pick([6, 8, 9, 12, 15]), b = R.pick([8, 9, 12, 15, 16]);
          const f = gcd(a, b);
          return { text: `${a} buku dan ${b} pensil dibagikan rata ke kelompok sebanyak mungkin. Maksimal ada berapa kelompok?`, answer: f, explanation: `FPB(${a},${b}) = ${f} kelompok` };
        },
        () => {
          const a = R.pick([3, 4, 5, 6]), b = R.pick([4, 5, 6, 8]);
          const k = lcm(a, b);
          return { text: `Bus A lewat setiap ${a} menit, bus B setiap ${b} menit. Setelah berapa menit mereka berangkat bersama lagi?`, answer: k, explanation: `KPK(${a},${b}) = ${k} menit` };
        },
        () => {
          const a = R.pick([4, 6, 8, 10, 12]), b = R.pick([6, 8, 9, 12, 15]);
          const f = gcd(a, b);
          return { text: `${a} apel dan ${b} jeruk dibagi rata tanpa sisa. Berapa paling banyak orang yang dapat bagian?`, answer: f, explanation: `FPB(${a},${b}) = ${f} orang` };
        },
        () => {
          const a = R.pick([2, 3, 4, 5]), b = R.pick([3, 4, 5, 6]), c = R.pick([4, 5, 6, 8]);
          const k = lcm(lcm(a, b), c);
          return { text: `Tiga siswa berlari mengelilingi lapangan. Si A selesai tiap ${a} menit, B tiap ${b} menit, C tiap ${c} menit. Setelah berapa menit ketiganya di garis start bersama?`, answer: k, explanation: `KPK(${a},${b},${c}) = ${k} menit` };
        },
        () => {
          const a = R.pick([12, 16, 18, 20, 24]), b = R.pick([12, 16, 18, 20, 24]);
          const f = gcd(a, b);
          return { text: `Pita merah ${a} cm dan pita biru ${b} cm akan dipotong sama panjang tanpa sisa. Panjang maksimal tiap potongan = ... cm`, answer: f, explanation: `FPB(${a},${b}) = ${f} cm` };
        },
      ];
      const s = R.pick(stories)();
      const w = [s.answer + R.int(1, 4), Math.max(1, s.answer - R.int(1, 3)), s.answer * 2, s.answer + 10].filter(v => v > 0 && v !== s.answer);
      q = { ...s, choices: makeChoices(s.answer, w), type: 'pg' };
    }
    qs.push(q);
  }
  return R.shuffle(qs);
}

// ── LEVEL 8: Perbandingan ──────────────────────────────────────
// Skala (cari jarak sebenarnya & cari jarak peta)
// Perbandingan Senilai
// Perbandingan Berbalik Nilai
// Perbandingan Penjumlahan & Selisih
function genLevel8() {
  const qs = [];
  for (let i = 0; i < 50; i++) {
    const kind = R.int(0, 3);
    let q;

    if (kind === 0) {
      // Skala — dua arah: cari jarak sebenarnya ATAU cari jarak peta
      const skala = R.pick([1000, 2000, 5000, 10000, 50000, 100000]);
      const subkind = R.pick([0, 1]);

      if (subkind === 0) {
        // Cari jarak sebenarnya
        const jarak = R.pick([2, 3, 4, 5, 6, 8, 10]);
        const aktual = jarak * skala;
        q = { text: `Jarak pada peta = ${jarak} cm, skala 1:${skala.toLocaleString('id')}. Jarak sebenarnya = ... cm`, answer: String(aktual), type: 'is', explanation: `${jarak} × ${skala} = ${aktual} cm` };
      } else {
        // Cari jarak pada peta
        const aktual = R.pick([2000, 3000, 4000, 5000, 6000, 8000, 10000, 50000, 100000]);
        const jarakPeta = aktual / skala;
        if (!Number.isInteger(jarakPeta) || jarakPeta < 1) {
          // fallback ke subkind 0
          const jarak2 = R.pick([2, 3, 4, 5]);
          const aktual2 = jarak2 * skala;
          q = { text: `Jarak pada peta = ${jarak2} cm, skala 1:${skala.toLocaleString('id')}. Jarak sebenarnya = ... cm`, answer: String(aktual2), type: 'is', explanation: `${jarak2} × ${skala} = ${aktual2} cm` };
        } else {
          q = { text: `Jarak sebenarnya = ${aktual.toLocaleString('id')} cm, skala 1:${skala.toLocaleString('id')}. Jarak pada peta = ... cm`, answer: String(jarakPeta), type: 'is', explanation: `${aktual} ÷ ${skala} = ${jarakPeta} cm` };
        }
      }

    } else if (kind === 1) {
      // Perbandingan senilai — variasi konteks
      const konteks = R.pick([
        { unit: 'buku', hargaSat: R.int(2, 10) * 1000 },
        { unit: 'kg beras', hargaSat: R.int(5, 15) * 1000 },
        { unit: 'liter bensin', hargaSat: R.pick([10000, 12000, 15000]) },
        { unit: 'meter kain', hargaSat: R.int(20, 50) * 1000 },
      ]);
      const a = R.int(2, 8), x = R.int(2, 6);
      const hargaA = konteks.hargaSat * a, hargaAx = konteks.hargaSat * a * x;
      const w = [hargaAx + konteks.hargaSat, hargaAx - konteks.hargaSat, hargaA * 2, konteks.hargaSat * (a + x)].filter(v => v > 0 && v !== hargaAx);
      q = {
        text: `Harga ${a} ${konteks.unit} = Rp ${hargaA.toLocaleString('id')}. Harga ${a * x} ${konteks.unit} = Rp ...`,
        answer: hargaAx,
        choices: makeChoices(hargaAx, w),
        type: 'pg',
        explanation: `${a * x} ÷ ${a} × Rp ${hargaA.toLocaleString('id')} = Rp ${hargaAx.toLocaleString('id')}`
      };

    } else if (kind === 2) {
      // Perbandingan berbalik nilai — selalu integer
      const pekerja = R.int(3, 8), hari = R.int(4, 12);
      const total = pekerja * hari;
      const factors = [];
      for (let f = 2; f <= total / 2; f++) { if (total % f === 0 && f !== pekerja) factors.push(f); }
      const pekerja2 = factors.length > 0 ? R.pick(factors) : pekerja * 2;
      const ans = total / pekerja2;
      const konteks = R.pick([
        `${pekerja} pekerja menyelesaikan proyek dalam ${hari} hari. ${pekerja2} pekerja menyelesaikan dalam ... hari`,
        `${pekerja} mesin bisa mencetak dalam ${hari} jam. ${pekerja2} mesin bisa mencetak dalam ... jam`,
        `${pekerja} keran mengisi kolam dalam ${hari} menit. ${pekerja2} keran mengisi dalam ... menit`,
      ]);
      const w = [ans + 2, Math.max(1, ans - 2), ans + hari, pekerja2 * hari].filter(v => v > 0 && v !== ans);
      q = { text: konteks, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `${pekerja}×${hari}=${total}, lalu ${total}÷${pekerja2}=${ans}` };

    } else {
      // Perbandingan penjumlahan & selisih — dua subkind
      const subkind = R.pick([0, 1]);
      const a = R.int(2, 5), b = R.int(a + 1, a + 5);
      const mult = R.int(4, 12);
      const total = mult * (a + b);
      const bagianA = mult * a, bagianB = mult * b;

      if (subkind === 0) {
        // Tanya bagian pertama (lebih kecil)
        const w = [bagianA + 2, Math.max(1, bagianA - 2), bagianB, a * b].filter(v => v > 0 && v !== bagianA);
        q = {
          text: `Uang Rp ${(total * 1000).toLocaleString('id')} dibagi dengan perbandingan ${a}:${b}. Bagian yang lebih kecil = Rp ...`,
          answer: bagianA * 1000,
          choices: makeChoices(bagianA * 1000, w.map(v => v * 1000)),
          type: 'pg',
          explanation: `${a}/(${a}+${b}) × Rp ${(total * 1000).toLocaleString('id')} = Rp ${(bagianA * 1000).toLocaleString('id')}`
        };
      } else {
        // Tanya selisih
        const selisih = (bagianB - bagianA) * 1000;
        const w = [selisih + 2000, Math.max(1000, selisih - 2000), bagianA * 1000, bagianB * 1000].filter(v => v > 0 && v !== selisih);
        q = {
          text: `Uang Rp ${(total * 1000).toLocaleString('id')} dibagi dengan perbandingan ${a}:${b}. Selisih kedua bagian = Rp ...`,
          answer: selisih,
          choices: makeChoices(selisih, w),
          type: 'pg',
          explanation: `Bagian besar = Rp ${(bagianB * 1000).toLocaleString('id')}, kecil = Rp ${(bagianA * 1000).toLocaleString('id')}, selisih = Rp ${selisih.toLocaleString('id')}`
        };
      }
    }
    qs.push(q);
  }
  return R.shuffle(qs);
}

// ── LEVEL 9: Bangun Datar & Bangun Ruang ──────────────────────
// Ciri-ciri, keliling, luas bangun datar, soal cerita
// Ciri-ciri, kerangka, luas permukaan, luas selimut (kerucut & tabung), volume bangun ruang
function genLevel9() {
  const qs = [];
  const PI = 3.14;

  for (let i = 0; i < 50; i++) {
    const kind = R.int(0, 12);
    let q;

    if (kind === 0) {
      // Keliling persegi
      const s = R.int(4, 20);
      const ans = 4 * s;
      const w = [ans + 4, ans - 4, s * s, ans + 8].filter(v => v > 0 && v !== ans);
      q = { text: `Keliling persegi dengan sisi ${s} cm = ... cm`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `K = 4×s = 4×${s} = ${ans} cm` };

    } else if (kind === 1) {
      // Luas persegi panjang
      const p = R.int(5, 20), l = R.int(3, 15);
      const ans = p * l;
      const w = [ans + p, ans - l, 2 * (p + l), ans + l].filter(v => v > 0 && v !== ans);
      q = { text: `Luas persegi panjang p=${p} cm, l=${l} cm = ... cm²`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `L = p×l = ${p}×${l} = ${ans} cm²` };

    } else if (kind === 2) {
      // Luas segitiga — alas genap agar integer
      const a = R.int(2, 10) * 2, t = R.int(3, 15);
      const ans = (a * t) / 2;
      const w = [a * t, ans + a, ans - t, ans + 5].filter(v => v > 0 && v !== ans);
      q = { text: `Luas segitiga alas=${a} cm, tinggi=${t} cm = ... cm²`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `L = ½×a×t = ½×${a}×${t} = ${ans} cm²` };

    } else if (kind === 3) {
      // Keliling lingkaran (π=3,14)
      const r = R.int(3, 15);
      const ans = Math.round(2 * PI * r * 100) / 100;
      q = { text: `Keliling lingkaran r=${r} cm (π=3,14) = ... cm`, answer: String(ans), type: 'is', explanation: `K = 2×π×r = 2×3,14×${r} = ${ans} cm` };

    } else if (kind === 4) {
      // Luas lingkaran (π=3,14)
      const r = R.int(2, 12);
      const ans = Math.round(PI * r * r * 100) / 100;
      q = { text: `Luas lingkaran r=${r} cm (π=3,14) = ... cm²`, answer: String(ans), type: 'is', explanation: `L = π×r² = 3,14×${r}² = 3,14×${r * r} = ${ans} cm²` };

    } else if (kind === 5) {
      // Luas trapesium — (a+b)×t/2, pastikan integer
      const a = R.int(4, 12), b = R.int(a + 2, a + 10), t = R.int(2, 8) * 2; // t genap
      const ans = ((a + b) * t) / 2;
      const w = [ans + t, ans - a, (a + b) * t, ans + b].filter(v => v > 0 && v !== ans);
      q = { text: `Luas trapesium sisi sejajar ${a} cm dan ${b} cm, tinggi ${t} cm = ... cm²`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `L = ½(a+b)×t = ½×${a + b}×${t} = ${ans} cm²` };

    } else if (kind === 6) {
      // Luas jajar genjang
      const a = R.int(5, 15), t = R.int(4, 12);
      const ans = a * t;
      const w = [ans + a, ans - t, 2 * (a + t), ans + t].filter(v => v > 0 && v !== ans);
      q = { text: `Luas jajar genjang alas=${a} cm, tinggi=${t} cm = ... cm²`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `L = alas × tinggi = ${a}×${t} = ${ans} cm²` };

    } else if (kind === 7) {
      // Volume kubus
      const s = R.int(3, 10);
      const ans = s * s * s;
      const w = [s * s, 3 * s, ans + s * s, ans - s * s].filter(v => v > 0 && v !== ans);
      q = { text: `Volume kubus dengan sisi ${s} cm = ... cm³`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `V = s³ = ${s}³ = ${ans} cm³` };

    } else if (kind === 8) {
      // Volume balok
      const p = R.int(4, 12), l = R.int(3, 8), t = R.int(2, 6);
      const ans = p * l * t;
      const w = [ans + p, 2 * (p * l + l * t + p * t), ans - l, p * (l + t)].filter(v => v > 0 && v !== ans);
      q = { text: `Volume balok p=${p} cm, l=${l} cm, t=${t} cm = ... cm³`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `V = p×l×t = ${p}×${l}×${t} = ${ans} cm³` };

    } else if (kind === 9) {
      // Luas permukaan balok
      const p = R.int(4, 10), l = R.int(3, 8), t = R.int(2, 6);
      const ans = 2 * (p * l + l * t + p * t);
      const w = [p * l * t, ans + 4, ans - 2 * (p + l), ans + 2 * p].filter(v => v > 0 && v !== ans);
      q = { text: `Luas permukaan balok p=${p} cm, l=${l} cm, t=${t} cm = ... cm²`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `LP = 2(pl+lt+pt) = 2(${p * l}+${l * t}+${p * t}) = ${ans} cm²` };

    } else if (kind === 10) {
      // Luas selimut tabung (2πrt) atau luas permukaan tabung (2πr(r+t))
      const r = R.pick([3, 4, 5, 7, 10, 14]);
      const t = R.int(5, 20);
      const subkind = R.pick([0, 1]);
      if (subkind === 0) {
        const ans = Math.round(2 * PI * r * t * 100) / 100;
        q = { text: `Luas selimut tabung r=${r} cm, t=${t} cm (π=3,14) = ... cm²`, answer: String(ans), type: 'is', explanation: `Ls = 2×π×r×t = 2×3,14×${r}×${t} = ${ans} cm²` };
      } else {
        const ans = Math.round(2 * PI * r * (r + t) * 100) / 100;
        q = { text: `Luas permukaan tabung r=${r} cm, t=${t} cm (π=3,14) = ... cm²`, answer: String(ans), type: 'is', explanation: `LP = 2×π×r×(r+t) = 2×3,14×${r}×${r + t} = ${ans} cm²` };
      }

    } else if (kind === 11) {
      // Volume tabung (πr²t)
      const r = R.pick([3, 4, 5, 7]);
      const t = R.int(5, 15);
      const ans = Math.round(PI * r * r * t * 100) / 100;
      q = { text: `Volume tabung r=${r} cm, t=${t} cm (π=3,14) = ... cm³`, answer: String(ans), type: 'is', explanation: `V = π×r²×t = 3,14×${r}²×${t} = 3,14×${r * r}×${t} = ${ans} cm³` };

    } else {
      // Soal cerita luas (kind=12)
      const p = R.int(5, 20), l = R.int(4, 15);
      const harga = R.pick([5000, 8000, 10000, 15000]);
      const ans = p * l * harga;
      q = { text: `Lantai ruang ukuran ${p} m × ${l} m. Harga keramik Rp ${harga.toLocaleString('id')}/m². Total biaya = Rp ...`, answer: ans, type: 'is', explanation: `${p}×${l}=${p * l} m², ×Rp ${harga.toLocaleString('id')} = Rp ${ans.toLocaleString('id')}` };
    }

    qs.push(q);
  }
  return R.shuffle(qs);
}

// ── LEVEL 10: Aljabar Dasar ───────────────────────────────────
// Membuat kalimat matematika, menentukan nilai variabel,
// operasi hitung aljabar (±×÷), pemfaktoran sederhana
function genLevel10() {
  const qs = [];
  for (let i = 0; i < 50; i++) {
    const kind = R.int(0, 5);
    let q;

    if (kind === 0) {
      // Nilai variabel: ax + b = c
      const a = R.int(2, 8), x = R.int(1, 10), b = R.int(1, 20);
      const c = a * x + b;
      const wrongFloor = Math.floor((c + 1) / a);
      const w = [x + 1, Math.max(1, x - 1), x + 2, wrongFloor].filter(v => v > 0 && v !== x);
      q = { text: `Nilai x yang memenuhi ${a}x + ${b} = ${c} adalah ...`, answer: x, choices: makeChoices(x, w), type: 'pg', explanation: `${a}x = ${c}−${b} = ${c - b}, x = ${c - b}÷${a} = ${x}` };

    } else if (kind === 1) {
      // Nilai variabel: ax - b = c  (pengurangan)
      const a = R.int(2, 8), x = R.int(2, 10), b = R.int(1, 15);
      const c = a * x - b;
      const w = [x + 1, Math.max(1, x - 1), x + 2, Math.ceil(c / a)].filter(v => v > 0 && v !== x);
      q = { text: `Nilai x yang memenuhi ${a}x − ${b} = ${c} adalah ...`, answer: x, choices: makeChoices(x, w), type: 'pg', explanation: `${a}x = ${c}+${b} = ${c + b}, x = ${c + b}÷${a} = ${x}` };

    } else if (kind === 2) {
      // Operasi aljabar: penjumlahan & pengurangan — sederhanakan
      const subkind = R.pick([0, 1]);
      if (subkind === 0) {
        // (ax + by) + (cx + dy)
        const a = R.int(2, 8), b = R.int(2, 8), c = R.int(1, 5), d = R.int(1, 5);
        const coefX = a + c, coefY = b + d;
        q = { text: `${a}x + ${b}y + ${c}x + ${d}y = ...`, answer: `${coefX}x + ${coefY}y`, type: 'is', explanation: `(${a}+${c})x + (${b}+${d})y = ${coefX}x + ${coefY}y` };
      } else {
        // (ax + by) - (cx + dy)  — pastikan koefisien positif
        const c = R.int(1, 4), d = R.int(1, 4);
        const a = R.int(c + 1, 8), b = R.int(d + 1, 8);
        const coefX = a - c, coefY = b - d;
        q = { text: `${a}x + ${b}y − ${c}x − ${d}y = ...`, answer: `${coefX}x + ${coefY}y`, type: 'is', explanation: `(${a}−${c})x + (${b}−${d})y = ${coefX}x + ${coefY}y` };
      }

    } else if (kind === 3) {
      // Pemfaktoran sederhana: ax + ay = a(x+y)  atau  ax + ay + az
      const subkind = R.pick([0, 1]);
      if (subkind === 0) {
        // 2 suku: s1·x + s2·y
        const a = R.int(2, 6), b = R.int(1, 5), c = R.int(1, 5);
        const s1 = a * b, s2 = a * c;
        const ans = `${a}(${b}x + ${c}y)`;
        const wrong = [`${a}(${b + 1}x + ${c}y)`, `${a + 1}(${b}x + ${c}y)`, `${a}(${b}x − ${c}y)`, `${s1}x + ${s2}y`].filter(w => w !== ans);
        q = { text: `Faktorkan: ${s1}x + ${s2}y = ...`, answer: ans, choices: makeChoices(ans, wrong), type: 'pg', explanation: `FPB(${s1},${s2})=${a}, jadi = ${ans}` };
      } else {
        // 3 suku: ax + ay + az
        const a = R.int(2, 5), b = R.int(1, 4), c = R.int(1, 4), d = R.int(1, 4);
        const s1 = a * b, s2 = a * c, s3 = a * d;
        const ans = `${a}(${b}x + ${c}y + ${d}z)`;
        const wrong = [`${a}(${b}x + ${c + 1}y + ${d}z)`, `${a + 1}(${b}x + ${c}y + ${d}z)`, `${s1}x + ${s2}y + ${s3}z`, `${a}(${b + 1}x + ${c}y + ${d}z)`].filter(w => w !== ans);
        q = { text: `Faktorkan: ${s1}x + ${s2}y + ${s3}z = ...`, answer: ans, choices: makeChoices(ans, wrong), type: 'pg', explanation: `FPB(${s1},${s2},${s3})=${a}, jadi = ${ans}` };
      }

    } else if (kind === 4) {
      // Substitusi nilai: ax + by, ax - by, ax × b
      const subkind = R.pick([0, 1, 2]);
      if (subkind === 0) {
        const a = R.int(2, 6), b = R.int(1, 5), xval = R.int(1, 8), yval = R.int(1, 6);
        const ans = a * xval + b * yval;
        const w = [ans + a, Math.max(1, ans - b), ans + b, xval * yval].filter(v => v > 0 && v !== ans);
        q = { text: `Jika x = ${xval} dan y = ${yval}, nilai ${a}x + ${b}y = ...`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `${a}×${xval} + ${b}×${yval} = ${a * xval}+${b * yval} = ${ans}` };
      } else if (subkind === 1) {
        const a = R.int(2, 6), b = R.int(1, 4), xval = R.int(2, 8), yval = R.int(1, 5);
        const ans = a * xval - b * yval;
        if (ans <= 0) { // fallback
          const ans2 = a * xval + b * yval;
          const w2 = [ans2 + a, ans2 - b, ans2 + b, xval * yval].filter(v => v > 0 && v !== ans2);
          q = { text: `Jika x = ${xval} dan y = ${yval}, nilai ${a}x + ${b}y = ...`, answer: ans2, choices: makeChoices(ans2, w2), type: 'pg', explanation: `${a}×${xval} + ${b}×${yval} = ${ans2}` };
        } else {
          const w = [ans + a, Math.max(1, ans - b), ans + b, a * xval].filter(v => v > 0 && v !== ans);
          q = { text: `Jika x = ${xval} dan y = ${yval}, nilai ${a}x − ${b}y = ...`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `${a}×${xval} − ${b}×${yval} = ${a * xval}−${b * yval} = ${ans}` };
        }
      } else {
        // Satu variabel: ax² atau ax + b dengan x tertentu
        const a = R.int(2, 5), xval = R.int(2, 6), b = R.int(1, 10);
        const ans = a * xval * xval + b;
        const w = [ans + a, Math.max(1, ans - b), a * xval + b, a * xval].filter(v => v > 0 && v !== ans);
        q = { text: `Jika x = ${xval}, nilai ${a}x² + ${b} = ...`, answer: ans, choices: makeChoices(ans, w), type: 'pg', explanation: `${a}×${xval}² + ${b} = ${a}×${xval * xval} + ${b} = ${a * xval * xval}+${b} = ${ans}` };
      }

    } else {
      // Kalimat matematika dari soal cerita (kind=5)
      const subkind = R.pick([0, 1]);
      if (subkind === 0) {
        const harga = R.pick([3, 4, 5, 6, 7, 8]) * 1000, jml = R.int(3, 10);
        const uang = harga * jml + R.int(1, 5) * 1000;
        const kembalian = uang - harga * jml;
        q = { text: `Harga 1 buku Rp ${harga.toLocaleString('id')}. Beli ${jml} buku, bayar Rp ${uang.toLocaleString('id')}. Kembaliannya = Rp ...`, answer: kembalian, type: 'is', explanation: `Rp ${uang.toLocaleString('id')} − ${jml}×Rp ${harga.toLocaleString('id')} = Rp ${kembalian.toLocaleString('id')}` };
      } else {
        // Soal cerita: total = n barang × harga
        const harga = R.pick([2, 3, 4, 5]) * 1000, n = R.int(4, 12);
        const total = harga * n;
        q = { text: `Harga ${n} pensil = Rp ${total.toLocaleString('id')}. Harga 1 pensil = Rp ...`, answer: harga, type: 'is', explanation: `Rp ${total.toLocaleString('id')} ÷ ${n} = Rp ${harga.toLocaleString('id')}` };
      }
    }

    qs.push(q);
  }
  return R.shuffle(qs);
}

const LEVEL_GENERATORS = [null, genLevel1, genLevel2, genLevel3, genLevel4, genLevel5, genLevel6, genLevel7, genLevel8, genLevel9, genLevel10];