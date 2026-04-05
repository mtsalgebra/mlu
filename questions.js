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
    // a - b
    () => { const b=R.int(1,80),a=R.int(b,100); const ans=a-b; return {text:`${a} − ${b} = ...`,answer:ans,explanation:`${a} − ${b} = ${ans}`}; },
    // a - b - c
    () => { const c=R.int(1,20),b=R.int(1,40),a=R.int(b+c,100); const ans=a-b-c; return {text:`${a} − ${b} − ${c} = ...`,answer:ans,explanation:`${a} − ${b} − ${c} = ${ans}`}; },
    // a + b - c
    () => { const a=R.int(10,60),b=R.int(5,30),c=R.int(1,a+b-1); const ans=a+b-c; return {text:`${a} + ${b} − ${c} = ...`,answer:ans,explanation:`${a} + ${b} − ${c} = ${ans}`}; },
    // a - b + c
    () => { const b=R.int(5,40),a=R.int(b+1,80),c=R.int(1,30); const ans=a-b+c; return {text:`${a} − ${b} + ${c} = ...`,answer:ans,explanation:`${a} − ${b} + ${c} = ${ans}`}; },
  ];
  for (let i=0;i<50;i++) {
    const t = R.pick(templates)();
    const w = [t.answer+R.int(1,5), t.answer-R.int(1,5), t.answer+R.int(6,15), t.answer-R.int(6,15)].filter(v=>v>=0&&v!==t.answer);
    qs.push({ type:R.pick(['pg','is']), ...t, choices: makeChoices(t.answer, w) });
  }
  return R.shuffle(qs);
}

// ── LEVEL 2: Perkalian & Pembagian Bilangan Bulat ──────────────
function genLevel2() {
  const qs = [];
  const templates = [
    () => { const a=R.int(2,12),b=R.int(2,12); const ans=a*b; return {text:`${a} × ${b} = ...`,answer:ans,explanation:`${a} × ${b} = ${ans}`}; },
    () => { const b=R.int(2,12),ans=R.int(2,12),a=b*ans; return {text:`${a} ÷ ${b} = ...`,answer:ans,explanation:`${a} ÷ ${b} = ${ans}`}; },
    () => { const a=R.int(2,10),b=R.int(2,10),c=R.int(2,5); const ans=a*b*c; return {text:`${a} × ${b} × ${c} = ...`,answer:ans,explanation:`${a} × ${b} × ${c} = ${ans}`}; },
    () => { const c=R.int(2,6),ans=R.int(2,10),b=c*ans,a=b*R.int(2,5); return {text:`${a} ÷ ${b} ÷ ${c} = ...`,answer:Math.floor(a/b/c),explanation:`${a} ÷ ${b} ÷ ${c} = ${Math.floor(a/b/c)}`}; },
    () => { const a=R.int(2,12),b=R.int(2,10),c=R.int(2,b); let ans=Math.floor(a*b/c); const rc=b%c===0?c:gcd(b,c); const realAns=a*b/rc/(b/rc); return {text:`${a} × ${b} ÷ ${rc} = ...`,answer:a*b/rc,explanation:`${a} × ${b} ÷ ${rc} = ${a*b/rc}`}; },
    () => { const c=R.int(2,8),ans=R.int(2,8),b=c*ans,a=R.int(2,8); return {text:`${a*b} ÷ ${b} × ${a} = ...`,answer:a*a,explanation:`${a*b} ÷ ${b} × ${a} = ${a} × ${a} = ${a*a}`}; },
  ];
  for (let i=0;i<50;i++) {
    const t = R.pick(templates)();
    const w = [t.answer+R.int(1,4), t.answer-R.int(1,4), t.answer+R.int(5,12), t.answer*2].filter(v=>v>0&&v!==t.answer);
    qs.push({ type:R.pick(['pg','is']), ...t, choices: makeChoices(t.answer, w) });
  }
  return R.shuffle(qs);
}

// ── LEVEL 3: Kombinasi 4 Operasi Bilangan Bulat ────────────────
function genLevel3() {
  const qs = [];
  const templates = [
    () => { const a=R.int(2,20),b=R.int(2,10),c=R.int(2,10); const ans=a+b*c; return {text:`${a} + ${b} × ${c} = ...`,answer:ans,explanation:`Kalikan dulu: ${b}×${c}=${b*c}, lalu ${a}+${b*c}=${ans}`}; },
    () => { const b=R.int(2,10),c=R.int(2,10),a=R.int(b*c+1,b*c+30); const ans=a-b*c; return {text:`${a} − ${b} × ${c} = ...`,answer:ans,explanation:`Kalikan dulu: ${b}×${c}=${b*c}, lalu ${a}−${b*c}=${ans}`}; },
    () => { const a=R.int(2,10),b=R.int(2,10),c=R.int(1,20); const ans=a*b+c; return {text:`${a} × ${b} + ${c} = ...`,answer:ans,explanation:`${a}×${b}=${a*b}, lalu +${c} = ${ans}`}; },
    () => { const a=R.int(2,10),b=R.int(2,10),c=R.int(1,a*b-1); const ans=a*b-c; return {text:`${a} × ${b} − ${c} = ...`,answer:ans,explanation:`${a}×${b}=${a*b}, lalu −${c} = ${ans}`}; },
    () => { const c=R.int(2,8),a=R.int(2,20); const b=c*R.int(2,6); const ans=a+b/c; return {text:`${a} + ${b} ÷ ${c} = ...`,answer:ans,explanation:`${b}÷${c}=${b/c}, lalu ${a}+${b/c}=${ans}`}; },
    () => { const c=R.int(2,8); const b=c*R.int(2,6); const ans2=b/c; const a=R.int(ans2+1,ans2+20); const ans=a-ans2; return {text:`${a} − ${b} ÷ ${c} = ...`,answer:ans,explanation:`${b}÷${c}=${ans2}, lalu ${a}−${ans2}=${ans}`}; },
    () => { const b=R.int(2,8); const a=b*R.int(2,5); const c=R.int(1,20); const ans=a/b+c; return {text:`${a} ÷ ${b} + ${c} = ...`,answer:ans,explanation:`${a}÷${b}=${a/b}, lalu +${c}=${ans}`}; },
    () => { const b=R.int(2,8); const a=b*R.int(2,5); const c=R.int(1,a/b-1); const ans=a/b-c; return {text:`${a} ÷ ${b} − ${c} = ...`,answer:ans,explanation:`${a}÷${b}=${a/b}, lalu −${c}=${ans}`}; },
    // Combined: a + b - c × d ÷ e
    () => {
      const d=R.int(2,5),e=d; const c=R.int(2,8); const cde=c*d/e; // c × d ÷ e = c (e=d)
      const a=R.int(5,30),b=R.int(1,20);
      const ans=a+b-cde;
      return {text:`${a} + ${b} − ${c} × ${d} ÷ ${e} = ...`,answer:ans,explanation:`${c}×${d}÷${e}=${cde}, lalu ${a}+${b}−${cde}=${ans}`};
    },
  ];
  for (let i=0;i<50;i++) {
    const t = R.pick(templates)();
    const w = [t.answer+R.int(1,4), t.answer-R.int(1,4), t.answer+R.int(5,15), t.answer-R.int(5,15)].filter(v=>v!==t.answer);
    qs.push({ type:R.pick(['pg','is']), ...t, choices: makeChoices(t.answer, w) });
  }
  return R.shuffle(qs);
}

// ── LEVEL 4: Konversi & Penyederhanaan Pecahan ─────────────────
function genLevel4() {
  const qs = [];
  for (let i=0;i<50;i++) {
    const kind = R.int(0,3);
    let q;
    if (kind===0) {
      // Pecahan biasa → desimal
      const denoms=[2,4,5,8,10,20,25]; const d=R.pick(denoms); const n=R.int(1,d-1);
      const dec=(n/d).toFixed(d===8?3:2);
      q={text:`Ubah <b>${n}/${d}</b> ke bentuk desimal`,answer:dec,explanation:`${n} ÷ ${d} = ${dec}`,type:'is'};
    } else if (kind===1) {
      // Desimal → pecahan
      const decimals=[[0.5,'1/2'],[0.25,'1/4'],[0.75,'3/4'],[0.2,'1/5'],[0.4,'2/5'],[0.6,'3/5'],[0.8,'4/5'],[0.125,'1/8'],[0.375,'3/8']];
      const [dec,frac]=R.pick(decimals);
      const wrong=['1/3','2/3','3/7','5/8'].filter(f=>f!==frac);
      q={text:`Ubah <b>${dec}</b> ke pecahan paling sederhana`,answer:frac,choices:makeChoices(frac,wrong),type:'pg',explanation:`${dec} = ${frac}`};
    } else if (kind===2) {
      // Desimal → persen
      const dec=(R.int(1,19)/20); const pct=Math.round(dec*100);
      q={text:`Ubah <b>${dec.toFixed(2)}</b> ke persen`,answer:`${pct}%`,type:'is',explanation:`${dec.toFixed(2)} × 100 = ${pct}%`};
    } else {
      // Sederhanakan pecahan
      const g0=R.int(2,8),n=g0*R.int(2,7),d=g0*R.int(2,7);
      const [sn,sd]=simplify(n,d); const ans=`${sn}/${sd}`;
      const wrong=[`${sn+1}/${sd}`,`${sn}/${sd+1}`,`${n}/${d}`,`${sn+2}/${sd}`].filter(w=>w!==ans);
      q={text:`Bentuk paling sederhana dari <b>${n}/${d}</b> adalah`,answer:ans,choices:makeChoices(ans,wrong),type:'pg',explanation:`${n}/${d} ÷ ${gcd(n,d)}/${gcd(n,d)} = ${ans}`};
    }
    qs.push({...q,choices:q.choices||makeChoices(q.answer,[q.answer+'1',q.answer.replace('/','.'),'1/2'])});
  }
  return R.shuffle(qs);
}

// ── LEVEL 5: Penjumlahan & Pengurangan Pecahan ─────────────────
function genLevel5() {
  const qs = [];
  for (let i=0;i<50;i++) {
    const kind = R.int(0,4);
    let q;
    if (kind===0) {
      // Penyebut sejenis: a/b ± c/b
      const d=R.int(3,12),a=R.int(1,d-1),c=R.int(1,d-1),op=R.pick(['+','-']);
      let n=op==='+'?a+c:a-c; let denom=d;
      if(n<=0){n=a+c;} // fallback to +
      const [sn,sd]=simplify(n,denom); const ans=`${sn}${sd===1?'':'/'+sd}`;
      q={text:`${a}/${d} ${op==='+'?'+':'−'} ${c}/${d} = ...`,answer:ans,type:'is',explanation:`(${op==='+'?a+'+'+c:a+'-'+c}) / ${d} = ${n}/${d} = ${ans}`};
    } else if (kind===1) {
      // Penyebut tidak sejenis: a/b ± c/d
      const b=R.int(2,8),d=R.int(2,8); const a=R.int(1,b),c=R.int(1,d);
      const L=lcm(b,d); const num=a*(L/b)+c*(L/d); const op='+';
      const [sn,sd]=simplify(num,L); const ans=`${sn}${sd===1?'':'/'+sd}`;
      q={text:`${a}/${b} + ${c}/${d} = ...`,answer:ans,type:'is',explanation:`KPK(${b},${d})=${L}: (${a*(L/b)}+${c*(L/d)})/${L} = ${num}/${L} = ${ans}`};
    } else if (kind===2) {
      // Desimal: a,b ± c,d
      const a=(R.int(10,99)/10).toFixed(1),b=(R.int(10,99)/10).toFixed(1);
      const ans=((parseFloat(a)+parseFloat(b))).toFixed(1);
      q={text:`${a} + ${b} = ...`,answer:ans,type:'is',explanation:`${a} + ${b} = ${ans}`};
    } else if (kind===3) {
      // Campuran + biasa: a b/c ± d/e
      const wB=R.int(2,6),wN=R.int(1,wB-1),whole=R.int(1,5);
      const b=R.int(2,8); const frac2=R.int(1,b);
      const tot1=whole*wB+wN; const L=lcm(wB,b);
      const num=tot1*(L/wB)+frac2*(L/b);
      const [sn,sd]=simplify(num,L);
      const bigW=Math.floor(sn/sd),bigN=sn%sd;
      const ans=bigN===0?String(bigW):(bigW>0?`${bigW} ${bigN}/${sd}`:`${bigN}/${sd}`);
      q={text:`${whole} ${wN}/${wB} + ${frac2}/${b} = ...`,answer:ans,type:'is',explanation:`= ${tot1}/${wB} + ${frac2}/${b} = ${num}/${L} = ${ans}`};
    } else {
      // Campuran ± campuran
      const b1=R.int(2,6),n1=R.int(1,b1-1),w1=R.int(1,5);
      const b2=R.int(2,6),n2=R.int(1,b2-1),w2=R.int(1,3);
      const L=lcm(b1,b2);
      const tot1=w1*b1+n1, tot2=w2*b2+n2;
      const num=(tot1*(L/b1))+(tot2*(L/b2));
      const [sn,sd]=simplify(num,L);
      const bW=Math.floor(sn/sd),bN=sn%sd;
      const ans=bN===0?String(bW):(bW>0?`${bW} ${bN}/${sd}`:`${bN}/${sd}`);
      q={text:`${w1} ${n1}/${b1} + ${w2} ${n2}/${b2} = ...`,answer:ans,type:'is',explanation:`= ${tot1}/${b1} + ${tot2}/${b2} = ${num}/${L} = ${ans}`};
    }
    qs.push({...q,choices:q.choices||makeChoices(q.answer,[])});
  }
  return R.shuffle(qs);
}

// ── LEVEL 6: Perkalian & Pembagian Pecahan ─────────────────────
function genLevel6() {
  const qs = [];
  for (let i=0;i<50;i++) {
    const kind = R.int(0,3);
    let q;
    if (kind===0) {
      // a/b × c/b
      const d=R.int(2,10),a=R.int(1,d),c=R.int(1,d);
      const num=a*c,den=d*d; const [sn,sd]=simplify(num,den);
      const ans=sd===1?String(sn):`${sn}/${sd}`;
      q={text:`${a}/${d} × ${c}/${d} = ...`,answer:ans,type:'is',explanation:`(${a}×${c})/(${d}×${d}) = ${num}/${den} = ${ans}`};
    } else if (kind===1) {
      // a/b ÷ c/d = a/b × d/c
      const b=R.int(2,8),d=R.int(2,8),a=R.int(1,b),c=R.int(1,d);
      const num=a*d,den=b*c; const [sn,sd]=simplify(num,den);
      const ans=sd===1?String(sn):`${sn}/${sd}`;
      q={text:`${a}/${b} ÷ ${c}/${d} = ...`,answer:ans,type:'is',explanation:`${a}/${b} × ${d}/${c} = ${num}/${den} = ${ans}`};
    } else if (kind===2) {
      // Desimal × atau ÷
      const a=(R.int(1,9)/10).toFixed(1),b=(R.int(1,9)/10).toFixed(1);
      const ans=(parseFloat(a)*parseFloat(b)).toFixed(2);
      q={text:`${a} × ${b} = ...`,answer:ans,type:'is',explanation:`${a} × ${b} = ${ans}`};
    } else {
      // Campuran × biasa
      const w=R.int(1,5),nb=R.int(2,6),nn=R.int(1,nb-1);
      const c=R.int(1,5),d=R.int(2,8);
      const tot=w*nb+nn; const num=tot*c,den=nb*d;
      const [sn,sd]=simplify(num,den);
      const bW=Math.floor(sn/sd),bN=sn%sd;
      const ans=bN===0?String(bW):(bW>0?`${bW} ${bN}/${sd}`:`${bN}/${sd}`);
      q={text:`${w} ${nn}/${nb} × ${c}/${d} = ...`,answer:ans,type:'is',explanation:`= ${tot}/${nb} × ${c}/${d} = ${num}/${den} = ${ans}`};
    }
    qs.push({...q,choices:q.choices||makeChoices(q.answer,[])});
  }
  return R.shuffle(qs);
}

// ── LEVEL 7: KPK & FPB ─────────────────────────────────────────
function genLevel7() {
  const qs = [];
  for (let i=0;i<50;i++) {
    const kind = R.int(0,3);
    let q;
    if (kind===0||kind===1) {
      // Soal langsung KPK atau FPB
      const base=R.int(2,8),a=base*R.int(2,6),b=base*R.int(2,6);
      const fpb=gcd(a,b); const kpk=lcm(a,b);
      const askKPK=kind===0;
      const ans=askKPK?kpk:fpb;
      const w=[ans+R.int(1,5),ans-R.int(1,3),ans*2,fpb+kpk].filter(v=>v>0&&v!==ans);
      q={text:`${askKPK?'KPK':'FPB'} dari ${a} dan ${b} adalah ...`,answer:ans,choices:makeChoices(ans,w),type:'pg',explanation:`FPB(${a},${b})=${fpb}, KPK(${a},${b})=${kpk}. Jawaban: ${ans}`};
    } else if (kind===2) {
      // 3 bilangan
      const a=R.pick([4,6,8,12,15,18,20]),b=R.pick([6,9,12,15,18,24]),c=R.pick([8,12,16,20,24]);
      const fpb3=gcd(gcd(a,b),c); const kpk3=lcm(lcm(a,b),c);
      const askKPK=R.pick([true,false]);
      const ans=askKPK?kpk3:fpb3;
      const w=[ans+R.int(1,6),ans-R.int(1,4),ans+10,ans*2].filter(v=>v>0&&v!==ans);
      q={text:`${askKPK?'KPK':'FPB'} dari ${a}, ${b}, dan ${c} adalah ...`,answer:ans,choices:makeChoices(ans,w),type:'pg',explanation:`Jawaban: ${ans}`};
    } else {
      // Soal cerita
      const stories=[
        ()=>{ const a=R.pick([2,3,4,5,6]),b=R.pick([3,4,5,6,8]); const k=lcm(a,b); return {text:`Lampu A berkedip setiap ${a} detik, lampu B setiap ${b} detik. Berapa detik sekali keduanya berkedip bersama?`,answer:k,explanation:`KPK(${a},${b}) = ${k} detik`}; },
        ()=>{ const a=R.pick([6,8,9,12]),b=R.pick([8,9,12,15,16]); const f=gcd(a,b); return {text:`${a} buku dan ${b} pensil dibagikan rata. Berapa kelompok maksimal yang bisa dibentuk?`,answer:f,explanation:`FPB(${a},${b}) = ${f} kelompok`}; },
        ()=>{ const a=R.pick([3,4,5,6]),b=R.pick([4,5,6,8]); const k=lcm(a,b); return {text:`Bus A lewat setiap ${a} menit, bus B setiap ${b} menit. Berapa menit mereka akan berangkat bersama lagi?`,answer:k,explanation:`KPK(${a},${b}) = ${k} menit`}; },
      ];
      const s=R.pick(stories)();
      const w=[s.answer+R.int(1,4),s.answer-R.int(1,3),s.answer*2,s.answer+10].filter(v=>v>0&&v!==s.answer);
      q={...s,choices:makeChoices(s.answer,w),type:'pg'};
    }
    qs.push(q);
  }
  return R.shuffle(qs);
}

// ── LEVEL 8: Perbandingan ──────────────────────────────────────
function genLevel8() {
  const qs = [];
  for (let i=0;i<50;i++) {
    const kind = R.int(0,3);
    let q;
    if (kind===0) {
      // Skala
      const skala=R.pick([1000,2000,5000,10000,50000,100000]);
      const jarak=R.pick([2,3,4,5,6,8,10]);
      const aktual=jarak*skala;
      const diStr=aktual>=100000?(aktual/100000)+' km':(aktual/100)+' m';
      q={text:`Jarak pada peta = ${jarak} cm, skala 1:${skala.toLocaleString('id')}. Jarak sebenarnya = ...`,answer:String(aktual)+' cm',type:'is',explanation:`${jarak} × ${skala} = ${aktual} cm`};
    } else if (kind===1) {
      // Perbandingan senilai
      const a=R.int(2,10),b=R.int(2,10),x=R.int(2,8);
      const ans=b*x;
      const w=[ans+2,ans-2,ans+b,a*x].filter(v=>v>0&&v!==ans);
      q={text:`Jika ${a} buku seharga Rp ${b*1000},- maka ${a*x} buku seharga Rp ...`,answer:ans*1000,choices:makeChoices(ans*1000,w.map(v=>v*1000)),type:'pg',explanation:`${a*x} ÷ ${a} × Rp ${b*1000} = Rp ${ans*1000}`};
    } else if (kind===2) {
      // Perbandingan berbalik nilai
      const pekerja=R.int(3,8),hari=R.int(4,12),pekerja2=R.int(2,pekerja*2);
      const ans=Math.round(pekerja*hari/pekerja2);
      const w=[ans+2,ans-2,ans+hari,pekerja2*hari].filter(v=>v>0&&v!==ans);
      q={text:`${pekerja} pekerja menyelesaikan dalam ${hari} hari. ${pekerja2} pekerja menyelesaikan dalam ... hari`,answer:ans,choices:makeChoices(ans,w),type:'pg',explanation:`${pekerja}×${hari}=${pekerja*hari}, lalu ${pekerja*hari}÷${pekerja2}=${ans} hari`};
    } else {
      // Perbandingan penjumlahan/selisih
      const a=R.int(2,5),b=R.int(a+1,a+5),total=R.int(20,60);
      const bagianA=Math.round(total*a/(a+b)), bagianB=total-bagianA;
      const w=[bagianA+2,bagianA-2,total-bagianA+1,a*b].filter(v=>v>0&&v!==bagianA);
      q={text:`Uang dibagi dengan perbandingan ${a}:${b}. Total Rp ${total*1000}. Bagian pertama = Rp ...`,answer:bagianA*1000,choices:makeChoices(bagianA*1000,w.map(v=>v*1000)),type:'pg',explanation:`${a}/(${a}+${b}) × ${total*1000} = ${bagianA*1000}`};
    }
    qs.push(q);
  }
  return R.shuffle(qs);
}

// ── LEVEL 9: Bangun Datar & Bangun Ruang ──────────────────────
function genLevel9() {
  const qs = [];
  for (let i=0;i<50;i++) {
    const kind = R.int(0,7);
    let q;
    if (kind===0) {
      // Keliling persegi
      const s=R.int(4,20); const ans=4*s;
      const w=[ans+4,ans-4,s*s,ans+8]; q={text:`Keliling persegi dengan sisi ${s} cm = ... cm`,answer:ans,choices:makeChoices(ans,w),type:'pg',explanation:`K = 4×s = 4×${s} = ${ans} cm`};
    } else if (kind===1) {
      // Luas persegi panjang
      const p=R.int(5,20),l=R.int(3,15); const ans=p*l;
      const w=[ans+p,ans-l,2*(p+l),ans+l];
      q={text:`Luas persegi panjang p=${p} cm, l=${l} cm = ... cm²`,answer:ans,choices:makeChoices(ans,w),type:'pg',explanation:`L = p×l = ${p}×${l} = ${ans} cm²`};
    } else if (kind===2) {
      // Luas segitiga
      const a=R.int(4,20),t=R.int(3,15); const ans=(a*t)/2;
      const w=[a*t,ans+a,ans-t,ans+5];
      q={text:`Luas segitiga alas=${a} cm, tinggi=${t} cm = ... cm²`,answer:ans,choices:makeChoices(ans,w),type:'pg',explanation:`L = ½×a×t = ½×${a}×${t} = ${ans} cm²`};
    } else if (kind===3) {
      // Keliling lingkaran (π≈3.14)
      const r=R.int(3,15); const ans=Math.round(2*3.14*r*100)/100;
      q={text:`Keliling lingkaran r=${r} cm (π=3,14) = ... cm`,answer:String(ans),type:'is',explanation:`K = 2×π×r = 2×3,14×${r} = ${ans} cm`};
    } else if (kind===4) {
      // Volume kubus
      const s=R.int(3,10); const ans=s*s*s;
      const w=[s*s,3*s,ans+s,ans-s];
      q={text:`Volume kubus dengan sisi ${s} cm = ... cm³`,answer:ans,choices:makeChoices(ans,w),type:'pg',explanation:`V = s³ = ${s}³ = ${ans} cm³`};
    } else if (kind===5) {
      // Volume balok
      const p=R.int(4,12),l=R.int(3,8),t=R.int(2,6); const ans=p*l*t;
      const w=[ans+p,2*(p*l+l*t+p*t),ans-l,p*(l+t)];
      q={text:`Volume balok p=${p}, l=${l}, t=${t} cm = ... cm³`,answer:ans,choices:makeChoices(ans,w),type:'pg',explanation:`V = p×l×t = ${p}×${l}×${t} = ${ans} cm³`};
    } else if (kind===6) {
      // Luas permukaan balok
      const p=R.int(4,10),l=R.int(3,8),t=R.int(2,6); const ans=2*(p*l+l*t+p*t);
      const w=[p*l*t,ans+4,ans-2*(p+l),ans+2*p];
      q={text:`Luas permukaan balok p=${p}, l=${l}, t=${t} cm = ... cm²`,answer:ans,choices:makeChoices(ans,w),type:'pg',explanation:`LP = 2(pl+lt+pt) = 2(${p*l}+${l*t}+${p*t}) = ${ans} cm²`};
    } else {
      // Soal cerita luas
      const p=R.int(5,20),l=R.int(4,15); const harga=R.pick([5000,8000,10000,15000]);
      const ans=p*l*harga;
      q={text:`Lantai ruang ukuran ${p}m × ${l}m. Harga keramik Rp ${harga.toLocaleString('id')}/m². Total biaya = Rp ...`,answer:ans,type:'is',explanation:`${p}×${l}=${p*l} m², ×Rp ${harga.toLocaleString('id')} = Rp ${ans.toLocaleString('id')}`};
    }
    qs.push(q);
  }
  return R.shuffle(qs);
}

// ── LEVEL 10: Aljabar Dasar ───────────────────────────────────
function genLevel10() {
  const qs = [];
  for (let i=0;i<50;i++) {
    const kind = R.int(0,4);
    let q;
    if (kind===0) {
      // Nilai variabel: ax + b = c
      const a=R.int(2,8),x=R.int(1,10),b=R.int(1,20); const c=a*x+b;
      const w=[x+1,x-1,x+2,Math.floor(c/a)].filter(v=>v>0&&v!==x);
      q={text:`Nilai x yang memenuhi ${a}x + ${b} = ${c} adalah ...`,answer:x,choices:makeChoices(x,w),type:'pg',explanation:`${a}x = ${c}−${b} = ${c-b}, x = ${c-b}÷${a} = ${x}`};
    } else if (kind===1) {
      // Operasi aljabar: sederhanakan
      const a=R.int(2,8),b=R.int(2,8),c=R.int(1,5),d=R.int(1,5);
      const coefX=a+c, coefY=b+d;
      q={text:`${a}x + ${b}y + ${c}x + ${d}y = ...`,answer:`${coefX}x + ${coefY}y`,type:'is',explanation:`(${a}+${c})x + (${b}+${d})y = ${coefX}x + ${coefY}y`};
    } else if (kind===2) {
      // Pemfaktoran
      const a=R.int(2,6),b=R.int(1,5),c=R.int(1,5);
      const s1=a*b,s2=a*c;
      const ans=`${a}(${b}x + ${c}y)`;
      const wrong=[`${a}(${b+1}x + ${c}y)`,`${a+1}(${b}x + ${c}y)`,`${a}(${b}x − ${c}y)`,`${s1}x + ${s2}y`];
      q={text:`Faktorkan: ${s1}x + ${s2}y = ...`,answer:ans,choices:makeChoices(ans,wrong),type:'pg',explanation:`FPB(${s1},${s2})=${a}, jadi = ${ans}`};
    } else if (kind===3) {
      // Kalimat matematika dari soal cerita
      const harga=R.pick([3,4,5,6,7,8])*1000,jml=R.int(3,10),uang=harga*jml+R.int(1,5)*1000;
      const kembalian=uang-harga*jml;
      q={text:`Harga 1 buku Rp ${harga.toLocaleString('id')}. Beli ${jml} buku, bayar Rp ${uang.toLocaleString('id')}. Kembaliannya = Rp ...`,answer:kembalian,type:'is',explanation:`Rp ${uang.toLocaleString('id')} − ${jml}×Rp ${harga.toLocaleString('id')} = Rp ${kembalian.toLocaleString('id')}`};
    } else {
      // Substitusi nilai
      const a=R.int(2,6),b=R.int(1,5),xval=R.int(1,8),yval=R.int(1,6);
      const ans=a*xval+b*yval;
      const w=[ans+a,ans-b,ans+b,xval*yval].filter(v=>v!==ans);
      q={text:`Jika x = ${xval} dan y = ${yval}, nilai ${a}x + ${b}y = ...`,answer:ans,choices:makeChoices(ans,w),type:'pg',explanation:`${a}×${xval} + ${b}×${yval} = ${a*xval}+${b*yval} = ${ans}`};
    }
    qs.push(q);
  }
  return R.shuffle(qs);
}

const LEVEL_GENERATORS = [null, genLevel1, genLevel2, genLevel3, genLevel4, genLevel5, genLevel6, genLevel7, genLevel8, genLevel9, genLevel10];
