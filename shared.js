// ═══════════════════════════════════════════════════════════════
// MATH LEVEL UP — shared.js
// Utilities, random helpers, PDF generator, session management
// ═══════════════════════════════════════════════════════════════

// ── Random helpers ──────────────────────────────────────────────
const R = {
  int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  pick: arr => arr[Math.floor(Math.random() * arr.length)],
  shuffle: arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  nonZero: (min, max) => { let v; do { v = R.int(min, max); } while (v === 0); return v; },
};

// ── GCD / LCM ───────────────────────────────────────────────────
function gcd(a, b) { return b === 0 ? Math.abs(a) : gcd(b, a % b); }
function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }

// ── Fraction helpers ─────────────────────────────────────────────
function simplify(n, d) {
  const g = gcd(Math.abs(n), Math.abs(d));
  return [n / g, d / g];
}
function fracStr(n, d) {
  if (d === 1) return String(n);
  return `${n}/${d}`;
}

// ── Choice builder ───────────────────────────────────────────────
function makeChoices(correct, wrongs) {
  const pool = [String(correct), ...wrongs.map(String)];
  const unique = [...new Set(pool)].slice(0, 4);
  while (unique.length < 4) unique.push(String(correct + unique.length * 7 + 3));
  return R.shuffle(unique);
}

// ── Session storage helpers ──────────────────────────────────────
const Session = {
  save: (key, val) => sessionStorage.setItem('MLU_' + key, JSON.stringify(val)),
  load: (key) => {
    try { return JSON.parse(sessionStorage.getItem('MLU_' + key)); } catch { return null; }
  },
  clear: () => {
    Object.keys(sessionStorage).filter(k => k.startsWith('MLU_')).forEach(k => sessionStorage.removeItem(k));
  }
};

// ── PDF Generator (via jsPDF) ────────────────────────────────────
async function generatePDF({ userName, levelTitle, levelNum, score, total, questions, answers, passed }) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw = 210, ph = 297;
  const ml = 20, mr = 20, mt = 20;
  const cw = pw - ml - mr;
  const pct = Math.round((score / total) * 100);

  const COLORS = {
    dark: [15, 17, 26],
    gold: [230, 175, 46],
    green: [56, 193, 114],
    red: [239, 83, 80],
    muted: [120, 128, 160],
    white: [255, 255, 255],
    surface: [22, 24, 36],
    surface2: [30, 32, 48],
  };

  function setFill(c) { doc.setFillColor(...c); }
  function setStroke(c) { doc.setDrawColor(...c); }
  function setTxt(c) { doc.setTextColor(...c); }
  function rect(x, y, w, h, style = 'F') { doc.rect(x, y, w, h, style); }

  // ── PAGE: CERTIFICATE (if passed) ─────────────────────────────
  if (passed) {
    setFill(COLORS.dark); rect(0, 0, pw, ph);

    // Gold border ornament
    setStroke(COLORS.gold); doc.setLineWidth(0.5);
    doc.rect(10, 10, pw - 20, ph - 20);
    doc.setLineWidth(0.2);
    doc.rect(12, 12, pw - 24, ph - 24);

    // Corner decorations
    const corners = [[10,10],[pw-10,10],[10,ph-10],[pw-10,ph-10]];
    setFill(COLORS.gold);
    corners.forEach(([cx, cy]) => doc.circle(cx, cy, 2, 'F'));

    // Header band
    setFill(COLORS.surface);
    rect(10, 10, pw - 20, 30);

    setTxt(COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('MATH LEVEL UP', pw / 2, 22, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    setTxt(COLORS.muted);
    doc.text('PROGRAM SERTIFIKASI MATEMATIKA', pw / 2, 30, { align: 'center' });

    // Certificate of Completion
    setTxt(COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('SERTIFIKAT', pw / 2, 65, { align: 'center' });
    doc.setFontSize(13);
    setTxt(COLORS.muted);
    doc.text('KELULUSAN', pw / 2, 74, { align: 'center' });

    // Divider line
    setStroke(COLORS.gold); doc.setLineWidth(0.4);
    doc.line(ml + 20, 80, pw - mr - 20, 80);

    setTxt([200, 210, 235]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Dengan bangga diberikan kepada', pw / 2, 95, { align: 'center' });

    // Name
    setTxt(COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text(userName, pw / 2, 112, { align: 'center' });

    // Underline name
    setStroke(COLORS.gold); doc.setLineWidth(0.3);
    const nw = doc.getTextWidth(userName);
    doc.line(pw / 2 - nw / 2, 115, pw / 2 + nw / 2, 115);

    setTxt([200, 210, 235]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('telah berhasil menyelesaikan dan LULUS pada', pw / 2, 127, { align: 'center' });

    setTxt(COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`Level ${levelNum} — ${levelTitle}`, pw / 2, 138, { align: 'center' });

    setTxt([200, 210, 235]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('dengan hasil:', pw / 2, 150, { align: 'center' });

    // Score badge
    setFill(COLORS.surface2); rect(pw / 2 - 30, 154, 60, 22, 'F');
    setStroke(COLORS.gold); doc.setLineWidth(0.3); doc.rect(pw / 2 - 30, 154, 60, 22);
    setTxt(COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(`${pct}%`, pw / 2, 168, { align: 'center' });

    doc.setFontSize(9);
    setTxt(COLORS.muted);
    doc.text(`( ${score} benar dari ${total} soal )`, pw / 2, 180, { align: 'center' });

    // Date
    const now = new Date();
    const tgl = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFontSize(9);
    setTxt([170, 178, 200]);
    doc.text(`Diterbitkan: ${tgl}`, pw / 2, 194, { align: 'center' });

    // Footer
    setFill(COLORS.surface); rect(10, ph - 40, pw - 20, 30);
    setTxt(COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('MATH LEVEL UP', ml + 10, ph - 27);
    setTxt(COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Program Latihan Matematika Terstruktur', ml + 10, ph - 20);
    setTxt([170, 178, 200]);
    doc.text(`Dokumen ini dihasilkan secara otomatis`, pw - mr - 10, ph - 24, { align: 'right' });
    doc.text(`pada ${tgl}`, pw - mr - 10, ph - 18, { align: 'right' });

    doc.addPage();
  }

  // ── PAGE(S): PEMBAHASAN ────────────────────────────────────────
  setFill(COLORS.dark); rect(0, 0, pw, ph);
  setFill(COLORS.surface); rect(0, 0, pw, 32);
  setTxt(COLORS.gold);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PEMBAHASAN SOAL', pw / 2, 14, { align: 'center' });
  setTxt(COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`${levelTitle}  ·  ${userName}  ·  Skor: ${pct}% (${score}/${total})`, pw / 2, 23, { align: 'center' });

  let y = 40;
  const lineH = 5.5;
  const pageBottom = ph - 18;

  function checkNewPage() {
    if (y > pageBottom) {
      doc.addPage();
      setFill(COLORS.dark); rect(0, 0, pw, ph);
      setFill(COLORS.surface); rect(0, 0, pw, 18);
      setTxt(COLORS.gold);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('PEMBAHASAN — MATH LEVEL UP', pw / 2, 12, { align: 'center' });
      y = 26;
    }
  }

  questions.forEach((q, idx) => {
    const userAns = answers[idx];
    const correct = String(q.answer);
    const isRight = userAns === correct;

    checkNewPage();

    // Number chip
    const chipColor = isRight ? COLORS.green : COLORS.red;
    setFill(chipColor);
    doc.roundedRect(ml, y - 3.5, 7, 6, 1, 1, 'F');
    setTxt(COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(String(idx + 1), ml + 3.5, y + 0.8, { align: 'center' });

    // Question text (strip HTML tags)
    const qText = stripHtml(q.text);
    setTxt([220, 225, 245]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const qLines = doc.splitTextToSize(qText, cw - 10);
    doc.text(qLines, ml + 10, y + 0.8);
    y += qLines.length * lineH + 2;

    checkNewPage();

    // User answer vs correct
    if (q.type === 'pg') {
      const opts = ['A', 'B', 'C', 'D'];
      q.choices.forEach((ch, ci) => {
        const isCorrectChoice = String(ch) === correct;
        const isUserChoice = String(ch) === userAns;
        checkNewPage();

        let bg = null;
        if (isCorrectChoice) bg = [30, 60, 40];
        else if (isUserChoice && !isCorrectChoice) bg = [60, 25, 25];

        if (bg) { setFill(bg); rect(ml + 10, y - 3, cw - 10, 6, 'F'); }

        const prefix = isCorrectChoice ? '✓' : (isUserChoice ? '✗' : ' ');
        setTxt(isCorrectChoice ? COLORS.green : isUserChoice ? COLORS.red : COLORS.muted);
        doc.setFont('helvetica', isCorrectChoice || isUserChoice ? 'bold' : 'normal');
        doc.setFontSize(8);
        doc.text(`${prefix} ${opts[ci]}. ${stripHtml(String(ch))}`, ml + 12, y + 0.8);
        y += lineH;
      });
    } else {
      checkNewPage();
      setTxt(isRight ? COLORS.green : COLORS.red);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const ua = userAns || '(tidak dijawab)';
      doc.text(`Jawaban kamu: ${ua}`, ml + 10, y + 0.8);
      y += lineH;
      if (!isRight) {
        checkNewPage();
        setTxt(COLORS.green);
        doc.text(`Jawaban benar: ${correct}`, ml + 10, y + 0.8);
        y += lineH;
      }
    }

    // Explanation
    checkNewPage();
    const expText = '💡 ' + stripHtml(q.explanation || '');
    const expLines = doc.splitTextToSize(expText, cw - 12);
    setFill([20, 28, 40]); rect(ml + 10, y - 2, cw - 10, expLines.length * lineH + 3, 'F');
    setTxt([150, 180, 230]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.text(expLines, ml + 13, y + 1.5);
    y += expLines.length * lineH + 6;

    checkNewPage();
  });

  // Page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    setTxt(COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Halaman ${i} / ${totalPages}`, pw - mr, ph - 8, { align: 'right' });
  }

  const filename = `MLU_Level${levelNum}_${userName.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}

function stripHtml(str) {
  return String(str).replace(/<[^>]+>/g, '').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}
