/* QUAGEN Pratik — alıştırma üreteci
 * Müfredattaki her fazdan (tahmin sorusu, tekrar kartları, çözümler, hata ayıklama görevleri) ve Rehber'den
 * kısa, oyunlaştırılmış bir ders üretir. Saf fonksiyonlar: aynı tohumla aynı ders (test edilebilir).
 *
 * Alıştırma türleri ve dayandıkları bulgular:
 *  secim     — tahmin et / hatırla (geri getirme pratiği: Roediger ve Karpicke, 2006)
 *  parsons   — karışık satırları sırala (Parsons problemleri: Ericson ve ark., 2017 — kod yazmak kadar öğretici, daha kısa)
 *  bosluk    — eksik anahtar kelimeyi seç (üretim etkisi, ipuçlu hatırlama)
 *  hata      — hatalı satırı bul (hata tespiti, ayrıştırıcı örnekler)
 *  eslestir  — kavram ↔ fonksiyon eşleştir (aralıklı ve karışık pratik)
 */
(function (root) {
  /* Tohumlu rastgele sayı (mulberry32) */
  function rastgele(tohum) {
    let a = tohum >>> 0;
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const karistir = (dizi, r) => { const a = dizi.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sec = (dizi, r) => dizi[Math.floor(r() * dizi.length)];
  const metinTohum = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

  /* Dil başına "önemli" kelimeler: boşluk doldurmada sorulacak ve çeldirici olarak kullanılacak olanlar */
  const ANAHTAR = {
    js: ["return", "const", "let", "for", "of", "in", "if", "else", "while", "function", "map", "filter", "reduce", "push", "length", "includes", "slice", "split", "join", "await", "async", "new", "Set", "Map", "Math", "floor", "max", "min", "sort", "this", "class", "throw", "try", "catch", "querySelector", "addEventListener", "textContent", "useState", "useEffect", "fetch", "JSON", "Object", "keys", "entries", "has", "get", "set", "find", "every", "some", "SELECT", "FROM", "WHERE", "GROUP", "ORDER", "JOIN", "COUNT", "display", "grid", "flex"],
    c: ["return", "int", "char", "long", "double", "void", "for", "while", "if", "else", "sizeof", "malloc", "free", "calloc", "realloc", "struct", "NULL", "printf", "strlen", "strcmp", "const", "unsigned", "size_t", "break", "switch", "case", "static", "typedef", "qsort", "bool", "true", "false"],
    py: ["return", "def", "for", "in", "if", "elif", "else", "while", "len", "range", "append", "print", "input", "int", "str", "split", "join", "sorted", "sum", "max", "min", "enumerate", "zip", "dict", "list", "set", "self", "class", "yield", "lambda", "try", "except", "raise", "None", "True", "False", "not", "and", "or", "import", "from", "with", "items", "get", "strip", "lower", "upper", "is", "pass", "break", "continue"]
  };
  const DIL_KOD = (ch, dil) => (ch.lang === "c" ? "c" : ch.lang === "py" ? "py" : ch.lang === "sql" ? "sql" : ch.lang === "html" ? "html" : ch.lang === "css" ? "css" : ch.lang === "jsx" ? "jsx" : dil === "py" ? "py" : dil === "c" ? "c" : "js");
  const yorumMu = (l) => /^\s*(\/\/|#(?!include|define)|\/\*|\*|--)/.test(l);

  /* ---------- Parsons: çözümün satırlarını karıştır ---------- */
  function parsons(ch, dil, r) {
    let satirlar = ch.solution.replace(/\s+$/, "").split("\n").filter((l) => l.trim() && !yorumMu(l));
    if (satirlar.length < 3) return null;
    if (satirlar.length > 9) {
      // En anlamlı parça: görevin fonksiyonunu içeren blok ya da baştan 8 satır
      const bas = Math.max(0, satirlar.findIndex((l) => ch.fn && l.includes(ch.fn)));
      satirlar = satirlar.slice(bas, bas + 8);
      if (satirlar.length < 3) return null;
    }
    const parcalar = satirlar.map((metin, i) => ({ id: "s" + i, metin }));
    let karisik = karistir(parcalar, r);
    for (let d = 0; d < 5 && karisik.every((p, i) => p.metin === parcalar[i].metin); d++) karisik = karistir(parcalar, r);
    return {
      tur: "parsons", anahtar: "parsons:" + ch.id, kodDili: DIL_KOD(ch, dil),
      soru: "Satırları doğru sıraya diz: " + ch.title,
      ipucu: ch.prompt.replace(/`|\*\*/g, "").split("\n")[0].slice(0, 180),
      parcalar: karisik, dogru: satirlar,
      aciklama: "Doğru sıra, çalışan çözümün kendisidir. Girintiler, hangi satırın hangi bloğa ait olduğunu gösterir."
    };
  }

  /* ---------- Boşluk doldurma: çözümden önemli bir kelimeyi gizle ---------- */
  function bosluk(ch, dil, r) {
    const liste = ANAHTAR[dil] || ANAHTAR.js;
    const satirlar = ch.solution.replace(/\s+$/, "").split("\n");
    const adaylar = [];
    satirlar.forEach((l, i) => {
      if (yorumMu(l)) return;
      const temiz = l.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`/g, (m) => " ".repeat(m.length));
      const re = /[A-Za-z_][A-Za-z0-9_]*/g;
      let m;
      while ((m = re.exec(temiz))) if (liste.includes(m[0])) adaylar.push({ satir: i, bas: m.index, kelime: m[0] });
    });
    if (!adaylar.length) return null;
    const a = sec(adaylar, r);
    const celdiriciler = karistir(liste.filter((x) => x !== a.kelime && !new RegExp("\\b" + x + "\\b").test(satirlar[a.satir])), r).slice(0, 3);
    if (celdiriciler.length < 3) return null;
    const goster = satirlar.map((l, i) => (i === a.satir ? l.slice(0, a.bas) + "␣␣␣" + l.slice(a.bas + a.kelime.length) : l));
    const bas = Math.max(0, a.satir - 4);
    const secenekler = karistir([a.kelime, ...celdiriciler], r);
    return {
      tur: "bosluk", anahtar: `bosluk:${ch.id}:${a.satir}:${a.kelime}`, kodDili: DIL_KOD(ch, dil),
      soru: "Boşluğa hangi kelime gelmeli?", baglam: ch.title,
      kod: goster.slice(bas, Math.min(goster.length, a.satir + 5)).join("\n"),
      secenekler, dogru: secenekler.indexOf(a.kelime),
      aciklama: `Doğru satır: ${satirlar[a.satir].trim()}`
    };
  }

  /* ---------- Hata bul: "Hata Ayıkla" görevlerinde başlangıç ile çözüm farkı ---------- */
  function hataBul(ch, dil, r) {
    if (ch.kind !== "Hata Ayıkla") return null;
    const bas = ch.starter.replace(/\s+$/, "").split("\n");
    const coz = new Set(ch.solution.split("\n").map((l) => l.trim()));
    const hatali = bas.map((l, i) => ({ l, i })).filter((x) => x.l.trim() && !coz.has(x.l.trim()));
    if (!hatali.length || hatali.length > 3) return null;
    const dogruSatir = hatali[0];
    const digerleri = karistir(bas.map((l, i) => ({ l, i })).filter((x) => x.l.trim().length > 3 && x.i !== dogruSatir.i && coz.has(x.l.trim()) && !yorumMu(x.l)), r).slice(0, 3);
    if (digerleri.length < 2) return null;
    const secenekler = karistir([dogruSatir, ...digerleri], r);
    return {
      tur: "hata", anahtar: "hata:" + ch.id, kodDili: DIL_KOD(ch, dil),
      soru: "Bu kodda hata hangi satırda?", baglam: ch.title,
      kod: ch.starter.replace(/\s+$/, ""),
      secenekler: secenekler.map((x) => `${x.i + 1}. satır: ${x.l.trim()}`), dogru: secenekler.indexOf(dogruSatir),
      aciklama: (ch.hints && ch.hints[1] ? ch.hints[1] + " " : "") + "Doğrusu: " + (ch.hints && ch.hints[2] ? ch.hints[2] : "")
    };
  }

  /* ---------- Seçmeli: tahmin sorusu ve tekrar kartları ---------- */
  function tahmin(faz, dil) {
    const p = faz.predict;
    if (!p) return null;
    return { tur: "secim", alt: "tahmin", anahtar: "tahmin:" + faz.id, kodDili: p.lang || (dil === "js" ? "js" : dil), soru: "Bu kod ne yazdırır?", kod: p.code.replace(/\s+$/, ""), secenekler: p.options.slice(), dogru: p.answer, aciklama: p.why };
  }
  function kartSorusu(kart, havuz, r) {
    const celdirici = karistir(havuz.filter((k) => k.id !== kart.id && k.a !== kart.a), r).slice(0, 3).map((k) => k.a);
    if (celdirici.length < 3) return null;
    const secenekler = karistir([kart.a, ...celdirici], r);
    return { tur: "secim", alt: "kart", anahtar: "kart:" + kart.id, soru: kart.q, secenekler, dogru: secenekler.indexOf(kart.a), aciklama: kart.a };
  }

  /* ---------- Eşleştir: Rehber'den kavram ↔ fonksiyon ---------- */
  function eslestir(dil, rehber, r, anahtarTohum) {
    if (!rehber) return null;
    const rdil = dil === "js" ? "js" : dil;
    const adaylar = rehber.KAVRAMLAR.filter((k) => k.diller[rdil] && k.diller[rdil].ad.length <= 34 && k.kategori !== "Bellek");
    if (adaylar.length < 4) return null;
    // Aynı adı taşıyan iki kavram (ör. metin ve dizi için length) eşleştirmeyi belirsiz yapar: adlar benzersiz olmalı
    const goruldu = new Set(), secilen = [];
    for (const k of karistir(adaylar, r)) { const ad = k.diller[rdil].ad; if (!goruldu.has(ad)) { goruldu.add(ad); secilen.push(k); } if (secilen.length === 4) break; }
    if (secilen.length < 4) return null;
    return {
      tur: "eslestir", anahtar: "eslestir:" + dil + ":" + anahtarTohum, soru: "Her niyeti doğru yapıyla eşleştir",
      ciftler: secilen.map((k) => [k.baslik, k.diller[rdil].ad]),
      sag: karistir(secilen.map((k) => k.diller[rdil].ad), r),
      aciklama: secilen.map((k) => `${k.baslik} → ${k.diller[rdil].ad}`).join(" · ")
    };
  }

  /* ---------- Ders: bir fazdan ~10 alıştırma, türler karışık sırada ---------- */
  function dersUret(faz, { mufredat = [], rehber = null, tohum = 1 } = {}) {
    const dil = faz.language || "js";
    const r = rastgele(metinTohum(faz.id) ^ tohum);
    const ayniDil = mufredat.filter((p) => (p.language || "js") === dil);
    // Çeldiriciler yakın fazlardan: aynı konu ailesinden gelen seçenekler soruyu zorlaştırır (benzerlerden ayırt etme)
    const yakin = ayniDil.filter((p) => Math.abs(p.no - faz.no) <= 3);
    const kartHavuzu = (yakin.length >= 3 ? yakin : ayniDil).flatMap((p) => p.cards || []);
    const ogeler = [];
    const ekle = (x) => x && ogeler.push(x);
    ekle(tahmin(faz, dil));
    karistir(faz.cards || [], r).slice(0, 2).forEach((k) => ekle(kartSorusu(k, kartHavuzu, r)));
    const gorevler = karistir(faz.challenges, r);
    gorevler.forEach((ch) => ekle(hataBul(ch, dil, r)));
    let p = 0;
    for (const ch of gorevler) { if (p >= 2) break; const x = parsons(ch, dil, r); if (x) { ogeler.push(x); p++; } }
    let b = 0;
    for (const ch of karistir(faz.challenges, r)) { if (b >= 3) break; const x = bosluk(ch, dil, r); if (x && !ogeler.some((o) => o.anahtar === x.anahtar)) { ogeler.push(x); b++; } }
    ekle(eslestir(dil, rehber, r, faz.id));
    // Önceki fazlardan bir hatırlatma kartı (aralıklı ve karışık pratik)
    const onceki = ayniDil.filter((x) => x.no < faz.no && (x.track || "") === (faz.track || ""));
    if (onceki.length) { const of = sec(onceki, r); const kk = sec(of.cards || [], r); if (kk) ekle(Object.assign(kartSorusu(kk, kartHavuzu, r) || {}, { alt: "hatirlatma", hatirlatma: of.title })); }
    const temiz = ogeler.filter((o) => o && o.tur);
    // Kolaydan zora: tahmin ve kartlar başta, Parsons ve eşleştirme ortada, boşluk ve hata sonda — ama karışık
    const sira = { secim: 0, eslestir: 1, parsons: 1, bosluk: 2, hata: 2 };
    return temiz.map((o) => ({ o, k: sira[o.tur] + r() * 1.6 })).sort((a, b2) => a.k - b2.k).map((x) => x.o).slice(0, 12);
  }

  /* Karışık tekrar dersi: hata defterindeki anahtarlardan alıştırmaları yeniden üret */
  function tekrarDersi(anahtarlar, { mufredat = [], rehber = null, tohum = 1 } = {}) {
    const r = rastgele(tohum);
    const cikti = [];
    for (const anahtar of anahtarlar) {
      const [tur, id, ...kalan] = anahtar.split(":");
      let x = null;
      if (tur === "tahmin") { const f = mufredat.find((p) => p.id === id); x = f && tahmin(f, f.language || "js"); }
      else if (tur === "kart") {
        const f = mufredat.find((p) => (p.cards || []).some((k) => k.id === id));
        if (f) { const havuz = mufredat.filter((p) => (p.language || "js") === (f.language || "js")).flatMap((p) => p.cards || []); x = kartSorusu(f.cards.find((k) => k.id === id), havuz, r); }
      } else {
        const f = mufredat.find((p) => p.challenges.some((c) => c.id === id));
        const ch = f && f.challenges.find((c) => c.id === id);
        if (ch) {
          const dil = f.language || "js";
          if (tur === "parsons") x = parsons(ch, dil, r);
          else if (tur === "hata") x = hataBul(ch, dil, r);
          else if (tur === "bosluk") { for (let d = 0; d < 8 && !x; d++) { const y = bosluk(ch, dil, r); if (y && y.anahtar === anahtar) x = y; } x = x || bosluk(ch, dil, r); }
        }
      }
      if (x) cikti.push(x);
    }
    return cikti;
  }

  /* Leitner kutuları: yanlış → kutu 1 (hemen tekrar edilebilir); her doğru bir üst kutu: 1, 3, 7 gün sonra;
     5. kutuya ulaşan (art arda 4 doğru) öğrenilmiş sayılır. Ardışık yeniden öğrenme: Rawson ve Dunlosky, 2011 */
  const KUTU_GUN = [0, 0, 1, 3, 7, 16];
  function leitner(kayit, dogru, simdi = Date.now()) {
    const k = kayit ? Object.assign({}, kayit) : { kutu: 0, dogru: 0, yanlis: 0 };
    if (dogru) { k.kutu = Math.min(5, (k.kutu || 0) + 1); k.dogru = (k.dogru || 0) + 1; }
    else { k.kutu = 1; k.yanlis = (k.yanlis || 0) + 1; }
    k.zaman = simdi + KUTU_GUN[k.kutu] * 864e5;
    k.ogrenildi = k.kutu >= 5;
    return k;
  }

  /* Cevap kontrolü (arayüzden bağımsız) */
  function kontrol(oge, cevap) {
    if (oge.tur === "parsons") return Array.isArray(cevap) && cevap.length === oge.dogru.length && cevap.every((m, i) => m === oge.dogru[i]);
    if (oge.tur === "eslestir") return Array.isArray(cevap) && cevap.length === oge.ciftler.length && oge.ciftler.every(([sol, sag]) => cevap.some(([a, b]) => a === sol && b === sag));
    return cevap === oge.dogru;
  }

  root.KD_PRATIK = { dersUret, tekrarDersi, leitner, kontrol, rastgele, karistir, ANAHTAR };
})(typeof window !== "undefined" ? window : globalThis);
