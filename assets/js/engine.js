/* QUAGEN NextGen — Motor: ilerleme deposu, FSRS aralıklı tekrar, BKT beceri modeli, kalibrasyon,
 * güvenli kod çalıştırıcılar (JS worker, SQLite, iframe/React), AI mentor */
window.KD = window.KD || {};

/* ---------------- Diller ----------------
 * Her dilin ilerlemesi ayrı bir anahtarda tutulur (karışmaz). Ad, tema ve yazı boyutu ortak profilde.
 */
(function (KD) {
  /* Statik demo (GitHub Pages gibi sunucusuz yayın): hesaplar, C derleyicisi ve AI mentor kapalı; ilerleme tarayıcıda */
  KD.statik = !!window.QUAGEN_STATIK;
  /* Bulut: statik yayında hesaplar, eşitleme, portföy ve AI Supabase üzerinden çalışır (assets/js/bulut.js) */
  KD.bulut = !!window.QUAGEN_BULUT_HAZIR;
  KD.hesapYok = KD.statik && !KD.bulut;
  /* Herkese açık portföy adresi: sunucuda /p/ad, statik yayında portfolyo.html?u=ad */
  KD.portfoyUrl = (ad) => (KD.statik ? new URL("portfolyo.html?u=" + encodeURIComponent(ad), location.href).href : location.origin + "/p/" + encodeURIComponent(ad));
  KD.LANGS = [
    { id: "js", ad: "JavaScript", kisa: "JS", aciklama: "Web'in dili. Tarayıcıdan sunucuya, React'ten algoritmalara beş parkur.", key: "kd-nextgen-v1" },
    { id: "c", ad: "C", kisa: "C", aciklama: "Bilgisayarın nasıl çalıştığını öğreten dil: bellek, işaretçiler, derleyici.", key: "kd-nextgen-c" },
    { id: "py", ad: "Python", kisa: "Py", aciklama: "Okunaklı ve çok yönlü: otomasyon, veri işleme ve yapay zekânın dili. Tarayıcında gerçek Python 3.12.", key: "kd-nextgen-py" }
  ];
  const ids = KD.LANGS.map((l) => l.id);
  let lang = null;
  const forced = ids.includes(window.KD_FORCE_LANG) ? window.KD_FORCE_LANG : null; // ana sayfa her zaman JS deposunu kullanır
  try { lang = forced || new URLSearchParams(location.search).get("dil"); } catch (e) {}
  if (!ids.includes(lang)) { try { lang = localStorage.getItem("kd-lang"); } catch (e) {} }
  if (!ids.includes(lang)) lang = "js";
  if (!forced) { try { localStorage.setItem("kd-lang", lang); } catch (e) {} }
  KD.lang = lang;
  KD.langInfo = (id = lang) => KD.LANGS.find((l) => l.id === id);
  KD.readLangState = (id) => { try { return JSON.parse(localStorage.getItem(KD.langInfo(id).key) || "null"); } catch (e) { return null; } };
  KD.readProfile = () => { try { return JSON.parse(localStorage.getItem("kd-profile") || "{}"); } catch (e) { return {}; } };
})(window.KD);

/* ---------------- Depo (localStorage) ---------------- */
(function (KD) {
  const KEY = KD.langInfo().key;
  const SHARED = ["name", "theme", "font"];
  const blank = () => ({ xp: 0, streak: { count: 0, last: null, best: 0 }, phases: {}, cards: {}, code: {}, mix: 0, daily: {}, stats: { reviews: 0, hintless: 0 }, badges: {}, skills: {}, calib: [], placed: {}, placement: null, prefs: { name: "", goal: 50, theme: "system", font: 14, level: "", onboarded: false } });
  let state;
  try { state = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { state = blank(); }
  const day = (d = new Date()) => d.toLocaleDateString("sv");
  function save(opts) {
    try {
      state.updatedAt = Date.now();
      localStorage.setItem(KEY, JSON.stringify(state));
      const prof = KD.readProfile();
      for (const k of SHARED) prof[k] = state.prefs[k];
      prof.lastLang = KD.lang;
      localStorage.setItem("kd-profile", JSON.stringify(prof));
    } catch (e) {}
    if (!(opts && opts.sessiz) && KD.onSave) KD.onSave();
  }
  function phase(id) {
    return state.phases[id] || (state.phases[id] = { predict: null, viewed: false, passed: {}, attempts: {}, hintsUsed: {}, explain: {} });
  }
  function touchStreak() {
    const t = day(), s = state.streak;
    if (s.last === t) return;
    const y = day(new Date(Date.now() - 864e5));
    s.count = s.last === y ? s.count + 1 : 1;
    s.last = t;
    s.best = Math.max(s.best || 0, s.count);
  }
  function addXP(n) {
    state.xp += n; touchStreak();
    const d = day(); state.daily[d] = (state.daily[d] || 0) + n;
    save(); KD.emit && KD.emit("xp", n);
  }
  // eski kayıtları yeni alanlarla tamamla
  const b = blank();
  for (const k of ["daily", "stats", "badges", "prefs", "skills", "placed"]) state[k] = Object.assign({}, b[k], state[k] || {});
  if (!Array.isArray(state.calib)) state.calib = [];
  // ortak profil (ad, tema, yazı boyutu) tüm dillerde aynı
  const prof = KD.readProfile();
  for (const k of SHARED) if (prof[k] !== undefined && prof[k] !== "") state.prefs[k] = prof[k];
  state.streak = Object.assign({ best: 0 }, state.streak);
  state.streak.best = Math.max(state.streak.best || 0, state.streak.count || 0);
  KD.store = { get state() { return state; }, save, phase, addXP, day,
    replace(obj, opts) { state = Object.assign(blank(), obj); const keep = KD.readProfile(); for (const k of SHARED) if (keep[k] !== undefined && keep[k] !== "") state.prefs[k] = keep[k]; save(opts); },
    reset() { const prefs = state.prefs; state = blank(); state.prefs = prefs; save(); } };
})(window.KD);

/* ---------------- Hesap ve eşitleme ----------------
 * Giriş yapılmışsa ilerleme sunucudaki hesaba eşitlenir. Yerel kayıtların bir "sahibi" vardır:
 * başka bir kullanıcı aynı cihazda giriş yaparsa önceki kişinin yerel ilerlemesi ona aktarılmaz.
 */
(function (KD) {
  const SAHIP = "kd-hesap-sahibi";
  const json = (r) => r.json().catch(() => ({}));
  const istek = (yol, yontem = "GET", govde) => fetch(yol, { method: yontem, credentials: "same-origin", headers: govde ? { "Content-Type": "application/json" } : {}, body: govde ? JSON.stringify(govde) : undefined });
  const durumSkoru = (d) => {
    if (!d || !d.phases) return 0;
    let n = 0;
    for (const id in d.phases) n += Object.keys((d.phases[id] || {}).passed || {}).length;
    return n * 1000 + (d.xp || 0);
  };
  const dinleyiciler = new Set();
  const H = {
    kullanici: null,
    portfoy: null,
    durum: "yerel", // yerel | esitleniyor | esitlendi | hata
    dinle(f) { dinleyiciler.add(f); return () => dinleyiciler.delete(f); },
    yay() { dinleyiciler.forEach((f) => { try { f(H); } catch (_) {} }); },
    async ben() {
      if (KD.hesapYok) { H.kullanici = null; H.yay(); return null; }
      try {
        const r = await istek("/api/auth/ben");
        if (r.ok) { const j = await json(r); H.kullanici = j.kullanici; H.portfoy = j.portfoy || null; }
        else H.kullanici = null;
      } catch (_) { H.kullanici = null; }
      H.yay();
      return H.kullanici;
    },
    async kayit(veri) {
      if (KD.hesapYok) throw Object.assign(new Error("Bu demo sürümünde hesaplar kapalı. İlerlemen bu tarayıcıda saklanıyor."), { alanlar: {} });
      const r = await istek("/api/auth/kayit", "POST", veri);
      const j = await json(r);
      if (!r.ok) throw Object.assign(new Error(j.error || "Kayıt başarısız."), { alanlar: j.alanlar || {}, status: r.status });
      H.kullanici = j.kullanici; H.yay();
      return j.kullanici;
    },
    async giris(veri) {
      if (KD.hesapYok) throw Object.assign(new Error("Bu demo sürümünde hesaplar kapalı. İlerlemen bu tarayıcıda saklanıyor."), { alanlar: {} });
      const r = await istek("/api/auth/giris", "POST", veri);
      const j = await json(r);
      if (!r.ok) throw Object.assign(new Error(j.error || "Giriş başarısız."), { status: r.status });
      H.kullanici = j.kullanici; H.yay();
      return j.kullanici;
    },
    async cikis() {
      try { await H.yukleSimdi(); } catch (_) {}
      await istek("/api/auth/cikis", "POST", {});
      // İlerleme hesapta güvende; bu cihazdaki kopya temizlenir ki sonraki kişi görmesin.
      try { KD.LANGS.forEach((l) => localStorage.removeItem(l.key)); localStorage.removeItem(SAHIP); } catch (_) {}
      H.kullanici = null; H.yay();
    },
    /* Girişten sonra: yerel kayıtları hesapla birleştir */
    async esitle() {
      if (!H.kullanici) return;
      H.durum = "esitleniyor"; H.yay();
      let sahip = null;
      try { sahip = localStorage.getItem(SAHIP); } catch (_) {}
      if (sahip && sahip !== H.kullanici.id) { try { KD.LANGS.forEach((l) => localStorage.removeItem(l.key)); } catch (_) {} }
      try { localStorage.setItem(SAHIP, H.kullanici.id); } catch (_) {}
      try {
        const r = await istek("/api/ilerleme");
        if (!r.ok) throw new Error();
        const sunucu = (await json(r)).ilerleme || {};
        let degisti = false;
        for (const l of KD.LANGS) {
          const yerel = KD.readLangState(l.id);
          const uzak = sunucu[l.id] && sunucu[l.id].durum;
          const ys = durumSkoru(yerel), us = durumSkoru(uzak);
          const uzakSecilsin = uzak && (us > ys || (us === ys && (sunucu[l.id].guncelleme || 0) > ((yerel && yerel.updatedAt) || 0)));
          if (uzakSecilsin) {
            if (l.id === KD.lang) { KD.store.replace(uzak, { sessiz: true }); degisti = true; }
            else localStorage.setItem(l.key, JSON.stringify(uzak));
          } else if (yerel && ys > 0) {
            await istek("/api/ilerleme/" + l.id, "PUT", { durum: yerel });
          }
        }
        H.durum = "esitlendi"; H.yay();
        return degisti;
      } catch (_) { H.durum = "hata"; H.yay(); return false; }
    },
    zamanlayici: null,
    planla() {
      if (!H.kullanici) return;
      clearTimeout(H.zamanlayici);
      H.durum = "esitleniyor"; H.yay();
      H.zamanlayici = setTimeout(() => H.yukleSimdi().catch(() => { H.durum = "hata"; H.yay(); }), 1500);
    },
    async yukleSimdi() {
      if (!H.kullanici || !KD.store) return;
      clearTimeout(H.zamanlayici);
      const r = await istek("/api/ilerleme/" + KD.lang, "PUT", { durum: KD.store.state });
      H.durum = r.ok ? "esitlendi" : "hata"; H.yay();
    },
    async portfoyKaydet(veri) {
      const r = await istek("/api/portfoy", "PUT", veri);
      const j = await json(r);
      if (!r.ok) throw new Error(j.error || "Portföy kaydedilemedi.");
      H.portfoy = j.portfoy; H.yay();
      return j.portfoy;
    },
    async hesapSil(parola) {
      const r = await istek("/api/hesap", "DELETE", { parola });
      const j = await json(r);
      if (!r.ok) throw new Error(j.error || "Hesap silinemedi.");
      try { KD.LANGS.forEach((l) => localStorage.removeItem(l.key)); localStorage.removeItem(SAHIP); } catch (_) {}
      H.kullanici = null; H.yay();
    }
  };
  KD.hesap = H;
  KD.onSave = () => H.planla();
  const cikistaEsitle = () => {
    if (H.kullanici && H.durum === "esitleniyor" && KD.store) {
      try {
        clearTimeout(H.zamanlayici);
        const body = JSON.stringify({ durum: KD.store.state });
        fetch("/api/ilerleme/" + KD.lang, {
          method: "PUT",
          keepalive: body.length <= 60000,
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body
        }).catch(() => {});
      } catch (_) {}
    }
  };
  addEventListener("pagehide", cikistaEsitle);
  addEventListener("visibilitychange", () => { if (typeof document !== "undefined" && document.visibilityState === "hidden") cikistaEsitle(); });
})(window.KD);

/* ---------------- Aralıklı tekrar: FSRS-4.5 ----------------
 * Ye, Su & Cao (2022) KDD; Anki'nin varsayılan zamanlayıcısı. Kart durumu: kararlılık (S, gün),
 * zorluk (D, 1–10), son tekrar zamanı. Hedef hatırlama olasılığı %90.
 */
(function (KD) {
  const S = KD.store;
  const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
  const DECAY = -0.5, FACTOR = 19 / 81, RETENTION = 0.9, DAY = 864e5, MIN = 6e4;
  const G = { 0: 1, 3: 2, 4: 3, 5: 4 }; // arayüz puanı → FSRS notu (1 tekrar, 2 zor, 3 iyi, 4 kolay)
  const clampD = (d) => Math.min(10, Math.max(1, d));
  const R = (tDays, s) => Math.pow(1 + FACTOR * tDays / s, DECAY);
  const D0 = (g) => clampD(W[4] - (g - 3) * W[5]);
  const intervalDays = (s) => Math.min(36500, Math.max(1, Math.round((s / FACTOR) * (Math.pow(RETENTION, 1 / DECAY) - 1))));

  /* eski SM-2 kartlarını FSRS durumuna taşı */
  function migrate(c) {
    if (!c || c.s !== undefined) return c;
    const n = { s: null, d: null, last: null, due: c.due || Date.now(), reps: c.reps || 0, lapses: 0 };
    if (c.reps > 0 && c.interval > 0) { n.s = c.interval; n.d = clampD(11 - (c.ease - 1.3) * 5); n.last = n.due - c.interval * DAY; }
    return n;
  }
  function next(c, q, now = Date.now()) {
    const g = G[q] || 3;
    const n = Object.assign({}, c);
    if (!n.s) { n.s = W[g - 1]; n.d = D0(g); }
    else {
      const t = Math.max(0, (now - (n.last || now)) / DAY), r = R(t, n.s);
      n.d = clampD(W[7] * D0(3) + (1 - W[7]) * (n.d - W[6] * (g - 3)));
      if (g === 1) { n.s = Math.max(0.1, W[11] * Math.pow(n.d, -W[12]) * (Math.pow(n.s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r))); n.lapses = (n.lapses || 0) + 1; }
      else n.s = n.s * (Math.exp(W[8]) * (11 - n.d) * Math.pow(n.s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * (g === 2 ? W[15] : 1) * (g === 4 ? W[16] : 1) + 1);
    }
    n.reps = (n.reps || 0) + 1; n.last = now;
    n.due = g === 1 ? now + 10 * MIN : now + intervalDays(n.s) * DAY;
    return n;
  }
  const fmtInterval = (ms) => { const m = ms / MIN; if (m < 60) return Math.round(m) + " dk"; const d = ms / DAY; if (d < 30) return Math.round(d) + " gün"; if (d < 365) return Math.round(d / 30) + " ay"; return (d / 365).toFixed(1) + " yıl"; };
  for (const id in S.state.cards) S.state.cards[id] = migrate(S.state.cards[id]);

  KD.srs = {
    enroll(ids) {
      let changed = false;
      ids.forEach((id) => { if (!S.state.cards[id]) { S.state.cards[id] = { s: null, d: null, last: null, due: Date.now(), reps: 0, lapses: 0 }; changed = true; } });
      if (changed) S.save();
    },
    /* q: 0 = Unuttum, 3 = Zor, 4 = İyi, 5 = Kolay */
    review(id, q) { const c = next(migrate(S.state.cards[id]) || { s: null, reps: 0 }, q); S.state.cards[id] = c; S.save(); return c; },
    preview(id) { const c = migrate(S.state.cards[id]) || { s: null }, now = Date.now(); return Object.fromEntries([0, 3, 4, 5].map((q) => [q, fmtInterval(next(c, q, now).due - now)])); },
    retrievability(id) { const c = S.state.cards[id]; if (!c || !c.s || !c.last) return null; return R((Date.now() - c.last) / DAY, c.s); },
    due(allCards) { const now = Date.now(); return allCards.filter((c) => S.state.cards[c.id] && S.state.cards[c.id].due <= now); },
    upcoming(days = 7) { const out = Array(days).fill(0), now = new Date(); now.setHours(0, 0, 0, 0); for (const id in S.state.cards) { const k = Math.floor((S.state.cards[id].due - now) / DAY); if (k >= 0 && k < days) out[k]++; else if (k < 0) out[0]++; } return out; }
  };
})(window.KD);

/* ---------------- Beceri modeli: Bayesçi bilgi takibi (BKT) ----------------
 * Corbett & Anderson (1994). Her faz bir beceri. P(L): beceriye hâkim olma olasılığı.
 * Gözlemler: test çalıştırmaları, tahmin soruları, tekrar kartları. Hâkimiyet eşiği 0.95.
 */
(function (KD) {
  const S = KD.store;
  const P = { L0: 0.15, T: 0.12, S: 0.1, G: 0.2 };
  /* 0 ve 1 Bayes güncellemesinin sabit noktalarıdır: oraya yapışan olasılık bir daha hiç değişmez */
  const sinirla = (x) => Math.min(0.999, Math.max(0.001, x));
  KD.bkt = {
    MASTERY: 0.95,
    get(id) { const v = S.state.skills[id]; return v == null ? null : v; },
    observe(id, correct, weight = 1) {
      let L = S.state.skills[id] == null ? P.L0 : sinirla(S.state.skills[id]);
      const slip = P.S, guess = Math.min(0.45, P.G + (1 - weight) * 0.25); // zayıf kanıtta tahmin payı büyür
      const post = correct ? (L * (1 - slip)) / (L * (1 - slip) + (1 - L) * guess) : (L * slip) / (L * slip + (1 - L) * (1 - guess));
      L = post + (1 - post) * P.T;
      S.state.skills[id] = sinirla(Math.round(L * 1000) / 1000); S.save();
      return L;
    },
    prior(id, v) { S.state.skills[id] = Math.max(S.state.skills[id] || 0, v); S.save(); }
  };

  /* Kalibrasyon: test öncesi eminlik (0.3 / 0.6 / 0.9) ve gerçek sonuç. Brier skoru (Brier, 1950). */
  KD.calib = {
    record(conf, ok) { S.state.calib.push({ c: conf, ok: !!ok, t: Date.now() }); if (S.state.calib.length > 400) S.state.calib.shift(); S.save(); },
    summary() {
      const a = S.state.calib; if (!a.length) return null;
      const brier = a.reduce((n, x) => n + Math.pow(x.c - (x.ok ? 1 : 0), 2), 0) / a.length;
      const buckets = [0.3, 0.6, 0.9].map((c) => { const xs = a.filter((x) => x.c === c); return { c, n: xs.length, rate: xs.length ? xs.filter((x) => x.ok).length / xs.length : null }; });
      const meanConf = a.reduce((n, x) => n + x.c, 0) / a.length, meanAcc = a.filter((x) => x.ok).length / a.length;
      return { n: a.length, brier, buckets, bias: meanConf - meanAcc };
    }
  };
})(window.KD);

/* ---------------- Güvenli kod çalıştırıcı (Web Worker + zaman aşımı) ---------------- */
(function (KD) {
  const WORKER_SRC = `
const fmt = (v) => {
  try {
    if (typeof v === "string") return JSON.stringify(v);
    if (typeof v === "function") return "[Function " + (v.name || "anonim") + "]";
    if (v === undefined) return "undefined";
    if (typeof v === "number" && isNaN(v)) return "NaN";
    if (v instanceof Promise) return "Promise {…}";
    if (v instanceof Error) return v.name + ": " + v.message;
    return JSON.stringify(v);
  } catch (e) { return String(v); }
};
const logFmt = (v) => typeof v === "string" ? v : fmt(v);
["log", "info", "warn", "error"].forEach((k) => {
  console[k] = (...a) => postMessage({ type: "log", level: k, text: a.map(logFmt).join(" ") });
});
function eq(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => eq(a[k], b[k]));
}
const lineOf = (err) => {
  const m = String(err && err.stack || "").match(/<anonymous>:(\\d+):\\d+/);
  return m ? Math.max(1, Number(m[1]) - 2) : null;
};
const SQL_BASE = "https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/";
let SQLP = null;
function sqlReady() {
  if (!SQLP) { importScripts(SQL_BASE + "sql-wasm.js"); SQLP = initSqlJs({ locateFile: (f) => SQL_BASE + f }); }
  return SQLP;
}
const lastSet = (r) => (r && r.length ? r[r.length - 1] : { columns: [], values: [] });
const rowKey = (r) => JSON.stringify(r);
const byKey = (a, b) => (rowKey(a) < rowKey(b) ? -1 : rowKey(a) > rowKey(b) ? 1 : 0);
async function runSql(d) {
  let SQL;
  try { SQL = await sqlReady(); } catch (err) { postMessage({ type: "done", error: "SQLite yüklenemedi. İnternet bağlantını kontrol et." }); return; }
  const fresh = () => { const db = new SQL.Database(); if (d.setup) db.run(d.setup); return db; };
  let table = null;
  try { const db = fresh(); table = lastSet(db.exec(d.code)); db.close(); }
  catch (err) { postMessage({ type: "done", error: "SQL hatası: " + err.message }); return; }
  if (!d.tests) { postMessage({ type: "done", table }); return; }
  const results = [];
  for (const t of d.tests) {
    const label = t.label;
    try {
      if (t.codeMatch) { const ok = new RegExp(t.codeMatch, "i").test(d.code); results.push({ label, pass: ok, got: ok ? "var" : "yok", expected: t.codeHint || "kodda bulunmalı" }); continue; }
      const db = fresh();
      let set = lastSet(db.exec(d.code));
      if (t.fails) { let failed = false; try { db.exec(t.fails); } catch (e2) { failed = true; } db.close(); results.push({ label, pass: failed, got: failed ? "reddedildi" : "kabul edildi", expected: "veritabanı reddetmeli" }); continue; }
      if (t.verify) set = lastSet(db.exec(t.verify));
      db.close();
      const rows = set.values;
      if (t.contains) { const ok = JSON.stringify(rows).includes(t.contains); results.push({ label, pass: ok, got: fmt(rows), expected: "'" + t.contains + "' içermeli" }); continue; }
      const pass = t.unordered ? eq(rows.slice().sort(byKey), t.expected.slice().sort(byKey)) : eq(rows, t.expected);
      results.push({ label, pass, got: fmt(rows), expected: fmt(t.expected) });
    } catch (err) {
      results.push({ label, pass: false, got: "SQL hatası: " + err.message, expected: fmt(t.expected), error: true });
    }
  }
  postMessage({ type: "done", results, table });
}
onmessage = async (e) => {
  const { code, fn, tests, wait } = e.data;
  if (e.data.mode === "sql") return runSql(e.data);
  if (e.data.db) {
    try {
      const SQL = await sqlReady();
      const db = new SQL.Database(); db.run(e.data.db);
      self.db = db;
      self.sorgu = (q, p) => { const st = db.prepare(q); if (p) st.bind(p); const out = []; while (st.step()) out.push(st.getAsObject()); st.free(); return out; };
      self.calistir = (q, p) => { db.run(q, p); const degisen = db.getRowsModified(); return { degisen, sonId: self.sorgu("SELECT last_insert_rowid() AS id")[0].id }; };
    } catch (err) { postMessage({ type: "done", error: "SQLite yüklenemedi. İnternet bağlantını kontrol et." }); return; }
  }
  let scope;
  try {
    scope = new Function(code + "\\n;return function (__x) { return eval(__x); };")();
  } catch (err) {
    postMessage({ type: "done", error: err.name + ": " + err.message, line: lineOf(err) });
    return;
  }
  if (!tests) {
    await new Promise((r) => setTimeout(r, wait || 700));
    postMessage({ type: "done" });
    return;
  }
  const results = [];
  for (const t of tests) {
    const label = t.label || (fn + "(" + (t.args || []).map(fmt).join(", ") + ")");
    try {
      let val;
      if (t.setup) scope(t.setup);
      const t0 = performance.now();
      if (t.expr) val = scope(t.expr);
      else {
        const f = scope("typeof " + fn + " !== 'undefined' ? " + fn + " : undefined");
        if (typeof f !== "function") throw new ReferenceError("'" + fn + "' adında bir fonksiyon bulunamadı");
        val = f(...structuredClone(t.args || []));
      }
      val = await val;
      const ms = performance.now() - t0;
      if ("throws" in t) { results.push({ label, pass: false, got: fmt(val), expected: "hata fırlatmalı → " + t.throws }); continue; }
      const dogru = eq(val, t.expected);
      if (t.maxMs && dogru && ms > t.maxMs) { results.push({ label, pass: false, slow: true, ms: Math.round(ms), got: "doğru sonuç, ama " + Math.round(ms) + " ms sürdü", expected: "en fazla " + t.maxMs + " ms" }); continue; }
      results.push({ label, pass: dogru, got: fmt(val), expected: fmt(t.expected), ms: t.maxMs ? Math.round(ms) : undefined });
    } catch (err) {
      if ("throws" in t) {
        const ok = t.throws === true || (err && err.message === t.throws);
        results.push({ label, pass: ok, got: "Hata: " + (err && err.message), expected: "hata → " + t.throws });
      } else {
        results.push({ label, pass: false, got: (err && err.name) + ": " + (err && err.message), expected: fmt(t.expected), error: true, line: lineOf(err) });
      }
    }
  }
  postMessage({ type: "done", results });
};`;
  let workerURL = null;
  KD.run = function (code, opts = {}) {
    return new Promise((resolve) => {
      if (!workerURL) workerURL = URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" }));
      const w = new Worker(workerURL);
      const logs = [];
      const limit = opts.timeout || 3000;
      const timer = setTimeout(() => {
        w.terminate();
        resolve({ logs, timeout: true, error: "Zaman aşımı: kod " + limit / 1000 + " saniyede bitmedi. Sonsuz döngü olabilir mi?" });
      }, limit);
      w.onmessage = (e) => {
        const m = e.data;
        if (m.type === "log") { logs.push(m); opts.onLog && opts.onLog(m); return; }
        clearTimeout(timer); w.terminate();
        resolve(Object.assign({ logs }, m));
      };
      w.onerror = (e) => { e.preventDefault(); clearTimeout(timer); w.terminate(); resolve({ logs, error: e.message }); };
      w.postMessage({ code, fn: opts.fn, tests: opts.tests, wait: opts.wait, mode: opts.mode, setup: opts.setup, db: opts.db });
    });
  };
})(window.KD);

/* ---------------- Web çalıştırıcı: izole iframe (HTML / CSS / DOM) + canlı önizleme ---------------- */
(function (KD) {
  const BASE_CSS = "body{margin:16px;font:15px/1.5 system-ui,-apple-system,sans-serif;color:#121110;background:#fff}";
  /* Eğitim API'si: fetch("/api/...") isteklerini sahte veriyle yanıtlar (ağ gerekmez, deterministik) */
  const API = `{
    "/api/kurslar": [{ "id": 1, "ad": "JavaScript", "sure": 10 }, { "id": 2, "ad": "CSS", "sure": 6 }, { "id": 3, "ad": "React", "sure": 12 }],
    "/api/kullanici/1": { "id": 1, "ad": "Deniz", "rol": "öğrenci" },
    "/api/kullanici/2": { "id": 2, "ad": "Ece", "rol": "mentor" },
    "/api/katalog": [
      { "id": 1, "ad": "React", "sure": 12, "seviye": "orta" },
      { "id": 2, "ad": "CSS", "sure": 6, "seviye": "başlangıç" },
      { "id": 3, "ad": "Node.js", "sure": 14, "seviye": "orta" },
      { "id": 4, "ad": "HTML", "sure": 4, "seviye": "başlangıç" },
      { "id": 5, "ad": "TypeScript", "sure": 8, "seviye": "ileri" }
    ]
  }`;
  /* React: kütüphaneler iframe'e CDN'den, JSX derleyicisi (Babel) ana sayfaya bir kez yüklenir */
  const REACT = "https://unpkg.com/react@18.3.1/umd/react.development.js";
  const REACT_DOM = "https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js";
  const BABEL = "https://unpkg.com/@babel/standalone@7.24.7/babel.min.js";
  let babelP = null;
  KD.loadBabel = () => babelP || (babelP = new Promise((res, rej) => {
    if (window.Babel) return res(window.Babel);
    const s = document.createElement("script");
    s.src = BABEL; s.onload = () => res(window.Babel);
    s.onerror = () => { babelP = null; rej(new Error("JSX derleyicisi yüklenemedi. İnternet bağlantını kontrol et.")); };
    document.head.appendChild(s);
  }));
  /* import/export satırlarını gerçek projedeki gibi yazabilsin diye ayıkla (satır numaraları korunur) */
  KD.compileJsx = async (code) => {
    const B = await KD.loadBabel();
    const src = code
      .replace(/^[ \t]*import\b[^\n]*$/gm, "")
      .replace(/^([ \t]*)export\s+default\s+(?=(function|class)\b)/gm, "$1")
      .replace(/^([ \t]*)export\s+default\s+[A-Za-z_$][\w$]*\s*;?[ \t]*$/gm, "")
      .replace(/^([ \t]*)export\s+(?=(function|const|let|class)\b)/gm, "$1");
    try {
      return { code: B.transform(src, { presets: [["react", { runtime: "classic" }]], retainLines: true, sourceType: "script", filename: "App.jsx" }).code };
    } catch (e) {
      const msg = String(e.message || e).split("\n")[0].replace(/^.*?App\.jsx:\s*/, "").replace(/\s*\(\d+:\d+\)\s*$/, "");
      return { error: "SyntaxError: " + msg, line: e.loc ? e.loc.line : null };
    }
  };
  /* Test yardımcıları (kd.*) — sadece React görevlerinde */
  const REACT_HELPERS = `<script>
Object.assign(window, { useState: React.useState, useEffect: React.useEffect, useRef: React.useRef, useMemo: React.useMemo, useCallback: React.useCallback, useReducer: React.useReducer, useContext: React.useContext, createContext: React.createContext, Fragment: React.Fragment });
window.kd = {
  $: function (s) { return document.querySelector(s); },
  $$: function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); },
  text: function (s) { var e = document.querySelector(s); return e ? e.textContent : null; },
  tick: function (ms) { return window.__kdWait(ms == null ? 30 : ms); },
  click: function (s) { var e = typeof s === "string" ? document.querySelector(s) : s; if (!e) throw new Error("Öğe bulunamadı: " + s); e.click(); return kd.tick(); },
  type: function (s, v) {
    var e = typeof s === "string" ? document.querySelector(s) : s; if (!e) throw new Error("Öğe bulunamadı: " + s);
    var P = e.tagName === "TEXTAREA" ? HTMLTextAreaElement : e.tagName === "SELECT" ? HTMLSelectElement : HTMLInputElement;
    Object.getOwnPropertyDescriptor(P.prototype, "value").set.call(e, v);
    e.dispatchEvent(new Event(e.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
    return kd.tick();
  },
  submit: function (s) { var f = document.querySelector(s); if (!f) throw new Error("Form bulunamadı: " + s); f.requestSubmit(); return kd.tick(); },
  mount: function (C, props) {
    var d = document.createElement("div"); d.className = "kd-test"; d.hidden = true; document.body.appendChild(d);
    var r = ReactDOM.createRoot(d);
    ReactDOM.flushSync(function () { r.render(React.createElement(C, props || {})); });
    d.rerender = function (p) { ReactDOM.flushSync(function () { r.render(React.createElement(C, p || {})); }); };
    return d;
  },
  hook: function (fn) { var out = {}; function H() { out.current = fn(); return null; } kd.mount(H); return out; },
  get errs() { return window.__kdLogs.filter(function (l) { return l.level === "error" || l.level === "warn"; }).map(function (l) { return l.text; }); }
};
<\/script>`;
  const REACT_MOUNT = `<script>
try {
  var __r = document.getElementById("root");
  if (__r && !__r.hasChildNodes() && typeof App === "function") {
    var __root = ReactDOM.createRoot(__r);
    ReactDOM.flushSync(function () { __root.render(React.createElement(App)); });
  }
} catch (e) { window.__kdSend({ type: "error", error: (e && e.name ? e.name + ": " : "") + (e && e.message || e) }); }
<\/script>`;
  /* Sonsuz döngü koruması: süslü parantezli ve tek satırlık döngülere sayaç enjekte eder (iframe ana iş parçacığını kilitlemesin) */
  const LOOP_MSG = "Zaman aşımı: döngü bitmiyor. Sonsuz döngü olabilir mi?";
  const LOOP_STMT = 'if(++window.__kdL>3e6)throw new Error("' + LOOP_MSG + '");';
  const LOOP_EXPR = '(++window.__kdL>3e6&&(function(){throw new Error("' + LOOP_MSG + '");})())';
  const guard = (js) => String(js)
    .replace(/\b(?:(?:for|while)\s*\(((?:[^()]|\([^()]*\))*)\)|do)\s*\{/g, (m) => m + LOOP_STMT)
    .replace(/\bwhile\s*\(((?:[^()]|\([^()]*\))*)\)\s*(?!\{)/g, (m, c) => `while((${LOOP_EXPR},(${c.trim() || "false"})))`)
    .replace(/\bfor\s*\(([^;()]*);([^;()]*);((?:[^()]|\([^()]*\))*)\)\s*(?!\{)/g, (m, a, b, c) => `for(${a};(${LOOP_EXPR},${b.trim() ? "(" + b + ")" : "true"});${c})`);
  KD.guardLoop = guard;
  const safe = (s) => String(s).replace(/<\/script/gi, "<\\/script");

  function bridge(id) {
    return `<script>(function(){
var ID=${JSON.stringify(id)};
function send(m){m.kdRun=ID;parent.postMessage(m,"*");}
function fmt(v){try{if(typeof v==="string")return JSON.stringify(v);if(v===undefined)return"undefined";if(typeof v==="number"&&isNaN(v))return"NaN";if(typeof v==="function")return"[Function "+(v.name||"anonim")+"]";if(v instanceof Element)return"<"+v.tagName.toLowerCase()+">";if(v instanceof Promise)return"Promise {…}";if(v instanceof Error)return v.name+": "+v.message;return JSON.stringify(v);}catch(e){return String(v);}}
window.__kdLogs=[];
["log","info","warn","error"].forEach(function(k){console[k]=function(){var a=[].slice.call(arguments);if(typeof a[0]==="string"&&a[0].indexOf("%")>-1){var f=a.shift();f=f.replace(/%[sdoOc]/g,function(t){if(!a.length)return t;var v=a.shift();return t==="%c"?"":String(v);});a.unshift(f);}var text=a.map(function(x){return typeof x==="string"?x:fmt(x);}).join(" ");window.__kdLogs.push({level:k,text:text});send({type:"log",level:k,text:text});};});
addEventListener("error",function(e){send({type:"error",error:(e.error&&e.error.name?e.error.name+": ":"")+String(e.message).replace(/^Uncaught (\\w+: )?/,""),line:e.lineno});});
addEventListener("unhandledrejection",function(e){send({type:"log",level:"error",text:"Yakalanmamış Promise hatası: "+(e.reason&&e.reason.message||e.reason)});});
addEventListener("submit",function(e){if(!e.defaultPrevented){e.preventDefault();window.__kdNoPrevent=true;console.warn("Form gönderildi ve sayfa yenilenecekti! e.preventDefault() unuttun mu?");}});
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");if(a&&!e.defaultPrevented){e.preventDefault();}});
/* Zamanlayıcı kısıtlamasından (arka plan sekmesi) etkilenmeyen bekleme: MessageChannel ile olay döngüsüne yol ver */
var __mc=new MessageChannel(),__q=[];__mc.port1.onmessage=function(){var f=__q.shift();if(f)f();};
function __yield(){return new Promise(function(r){__q.push(r);__mc.port2.postMessage(0);});}
window.__kdWait=function(ms){var end=performance.now()+ms;function loop(){return performance.now()>=end?Promise.resolve():__yield().then(loop);}return loop();};
var DB=${API};
function FakeResponse(body,status,url){this.status=status;this.ok=status>=200&&status<300;this.statusText=status===200?"OK":"Not Found";this.url=url;this.headers={get:function(h){return /content-type/i.test(h)?"application/json":null;}};this._b=body;this.bodyUsed=false;}
FakeResponse.prototype.text=function(){this.bodyUsed=true;return Promise.resolve(this._b);};
FakeResponse.prototype.json=function(){this.bodyUsed=true;var b=this._b;return new Promise(function(ok,no){try{ok(JSON.parse(b));}catch(e){no(e);}});};
FakeResponse.prototype.clone=function(){return new FakeResponse(this._b,this.status,this.url);};
window.fetch=function(url){return new Promise(function(r){window.__kdWait(40).then(function(){var u=String(url).replace(/^https?:\\/\\/[^/]+/,"").split("?")[0];var hit=DB[u];r(new FakeResponse(JSON.stringify(hit!==undefined?hit:{hata:"Bulunamadı"}),hit!==undefined?200:404,String(url)));});});};
window.__kdL=0;window.__kdSend=send;window.__kdFmt=fmt;
})();<\/script>`;
  }

  function runner(tests) {
    return `<script>(async function(){
await window.__kdWait(80);
var send=window.__kdSend,fmt=window.__kdFmt;
function eq(a,b){if(Object.is(a,b))return true;if(typeof a!=="object"||typeof b!=="object"||!a||!b)return false;if(Array.isArray(a)!==Array.isArray(b))return false;var ka=Object.keys(a),kb=Object.keys(b);return ka.length===kb.length&&ka.every(function(k){return eq(a[k],b[k]);});}
var tests=${safe(JSON.stringify(tests || null))};
if(!tests){await window.__kdWait(400);send({type:"done"});return;}
var results=[];
for(var i=0;i<tests.length;i++){var t=tests[i];
  try{var v=(0,eval)(t.check);v=await v;results.push({label:t.label,pass:eq(v,t.expected),got:fmt(v),expected:fmt(t.expected)});}
  catch(err){results.push({label:t.label,pass:false,got:(err&&err.name)+": "+(err&&err.message),expected:fmt(t.expected),error:true});}
}
send({type:"done",results:results});
})();<\/script>`;
  }

  /* o: { lang: "html"|"css"|"js"|"jsx", code, scaffold, tests, host } */
  KD.runWeb = async function (o) {
    let compiled = null;
    if (o.lang === "jsx") {
      try { compiled = await KD.compileJsx(o.code); } catch (e) { compiled = { error: e.message }; }
      if (compiled.error) {
        if (o.host) { const d = document.createElement("pre"); d.className = "preview-error"; d.textContent = compiled.error + (compiled.line ? "\n(" + compiled.line + ". satır)" : ""); o.host.replaceChildren(d); }
        return { logs: [{ level: "error", text: compiled.error }], error: compiled.error, line: compiled.line };
      }
    }
    return new Promise((resolve) => {
      const id = Math.random().toString(36).slice(2);
      let head = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>${BASE_CSS}</style>`;
      let body = "", jsLine = 0;
      if (o.lang === "css") { head += `<style>${o.code}</style>`; body = o.scaffold || ""; }
      else if (o.lang === "html") { body = o.code; }
      else if (o.lang === "jsx") { body = o.scaffold || '<div id="root"></div>'; }
      else { body = o.scaffold || ""; }
      if (o.lang === "jsx") head += `<script src="${REACT}"><\/script><script src="${REACT_DOM}"><\/script>`;
      let doc = head + bridge(id) + (o.lang === "jsx" ? REACT_HELPERS : "") + "</head><body>\n" + body + "\n";
      if (o.lang === "js" || o.lang === "jsx") {
        doc += "<script>\n";
        jsLine = doc.split("\n").length;
        doc += safe(guard(compiled ? compiled.code : o.code)) + "\n<\/script>\n";
        if (o.lang === "jsx") doc += REACT_MOUNT;
      }
      doc += runner(o.tests) + "</body></html>";

      let host = o.host;
      if (!host) {
        host = document.getElementById("kd-offscreen") || Object.assign(document.body.appendChild(document.createElement("div")), { id: "kd-offscreen" });
        host.style.cssText = "position:fixed;left:-10000px;top:0;width:800px;height:600px;";
      }
      const ifr = document.createElement("iframe");
      ifr.setAttribute("sandbox", "allow-scripts allow-forms");
      ifr.title = "Önizleme";
      ifr.className = "preview-frame";
      host.replaceChildren(ifr);

      const logs = []; let error = null, line = null, ended = false;
      const finish = (x) => {
        if (ended) return; ended = true;
        clearTimeout(timer); removeEventListener("message", onMsg);
        resolve(Object.assign({ logs, error, line }, x));
      };
      const onMsg = (e) => {
        const m = e.data;
        if (e.source !== ifr.contentWindow || !m || m.kdRun !== id) return;
        if (m.type === "log") { logs.push(m); return; }
        if (m.type === "error") {
          logs.push({ level: "error", text: m.error });
          if (!error) { error = m.error; if ((o.lang === "js" || o.lang === "jsx") && m.line >= jsLine) line = m.line - jsLine + 1; }
          return;
        }
        if (m.type === "done") finish({ results: m.results });
      };
      const timer = setTimeout(() => finish({ timeout: true, error: error || "Zaman aşımı: sayfa yanıt vermedi. Sonsuz döngü olabilir mi?" }), o.lang === "jsx" ? 9000 : 5000);
      addEventListener("message", onMsg);
      ifr.srcdoc = doc;
    });
  };
})(window.KD);

/* ---------------- C çalıştırıcı: yerel clang + AddressSanitizer/UBSan ----------------
 * Kod sunucudaki /api/c/run uç noktasına gider. İki test biçimi:
 *  mod "fn" (varsayılan): öğrenci fonksiyon yazar; testler { label, setup, expr, type, expected }
 *     type: int | long | double | char | bool | str | size
 *  mod "stdout": öğrenci main() yazar; testler { label, stdin, stdout }
 * Her iki biçimde de bellek ayırmaları sayılır: kd_ayrilan (malloc − free) sızıntı testleri için.
 */
(function (KD) {
  const PRELUDE = [
    '#line 1 "quagen_on.h"',
    "#include <stdio.h>", "#include <stdlib.h>", "#include <string.h>", "#include <stdbool.h>",
    "#include <stdint.h>", "#include <math.h>", "#include <ctype.h>",
    "static long kd_ayrilan = 0;",
    "#ifdef KD_TARAYICI",
    /* Tarayıcı derleyicisinde AddressSanitizer yok: blok başına başlık + sonda bekçi baytları, serbest bırakılan blok
       karantinada tutulur ve zehirlenir. Taşma, çift free, geçersiz free yakalanır; use-after-free çöp değer okur. */
    "#define KD_BAS 16",
    "#define KD_CANLI 0x51A6E7u",
    "#define KD_OLU 0xDEADF0u",
    "static void kd_dur(const char *tur, void *p) { fprintf(stderr, \"QUAGEN bellek denetimi: %s (%p)\\n\", tur, p); abort(); }",
    "static void kd_kontrol(void *p) { unsigned char *b = (unsigned char *)p - KD_BAS; unsigned m = *(unsigned *)(b + 8);",
    "  if (m == KD_OLU) kd_dur(\"double-free: ayni bellek iki kez free edildi\", p);",
    "  if (m != KD_CANLI) kd_dur(\"bad-free: malloc ile alinmamis bir adres\", p);",
    "  size_t n = *(size_t *)b; for (int i = 0; i < 8; i++) if (b[KD_BAS + n + i] != 0xFD) kd_dur(\"heap-buffer-overflow: ayrilan blogun sonundan tasildi\", p); }",
    "static void *kd_malloc(size_t n) { unsigned char *b = malloc(KD_BAS + n + 8); if (!b) return NULL;",
    "  *(size_t *)b = n; *(unsigned *)(b + 8) = KD_CANLI; memset(b + KD_BAS, 0xBE, n); memset(b + KD_BAS + n, 0xFD, 8); kd_ayrilan++; return b + KD_BAS; }",
    "static void *kd_calloc(size_t a, size_t c) { if (c && a > (size_t)-1 / c) return NULL; void *p = kd_malloc(a * c); if (p) memset(p, 0, a * c); return p; }",
    "static void kd_free(void *p) { if (!p) return; kd_kontrol(p); unsigned char *b = (unsigned char *)p - KD_BAS;",
    "  *(unsigned *)(b + 8) = KD_OLU; memset(p, 0xDD, *(size_t *)b); kd_ayrilan--; }",
    "static void *kd_realloc(void *p, size_t n) { if (!p) return kd_malloc(n); kd_kontrol(p); size_t eski = *(size_t *)((unsigned char *)p - KD_BAS);",
    "  void *q = kd_malloc(n); if (!q) return NULL; memcpy(q, p, eski < n ? eski : n); kd_free(p); return q; }",
    "#else",
    "static inline void *kd_malloc(size_t n) { void *p = malloc(n); if (p) kd_ayrilan++; return p; }",
    "static inline void *kd_calloc(size_t a, size_t b) { void *p = calloc(a, b); if (p) kd_ayrilan++; return p; }",
    "static inline void *kd_realloc(void *p, size_t n) { void *q = realloc(p, n); if (!p && q) kd_ayrilan++; return q; }",
    "static inline void kd_free(void *p) { if (p) kd_ayrilan--; free(p); }",
    "#endif",
    "#define malloc kd_malloc", "#define calloc kd_calloc", "#define realloc kd_realloc", "#define free kd_free",
    '#line 1 "main.c"'
  ].join("\n") + "\n";
  const FMT = {
    int: (e) => `printf("\\n@@KD%d@@%d\\n", __i, (int)(${e}));`,
    long: (e) => `printf("\\n@@KD%d@@%ld\\n", __i, (long)(${e}));`,
    size: (e) => `printf("\\n@@KD%d@@%zu\\n", __i, (size_t)(${e}));`,
    double: (e) => `printf("\\n@@KD%d@@%.9g\\n", __i, (double)(${e}));`,
    char: (e) => `printf("\\n@@KD%d@@%c\\n", __i, (char)(${e}));`,
    bool: (e) => `printf("\\n@@KD%d@@%d\\n", __i, (${e}) ? 1 : 0);`,
    str: (e) => `{ const char *kd_s = (${e}); printf("\\n@@KD%d@@%s\\n", __i, kd_s ? kd_s : "(null)"); }`
  };
  function harness(tests) {
    const body = tests.map((t, i) => (t.expr ? `  { int __i = ${i}; ${t.setup || ""}\n    ${(FMT[t.type || "int"])(t.expr)} }` : "")).join("\n");
    return `\n#line 1 "quagen_test.c"\nint main(void) {\n  setvbuf(stdout, NULL, _IONBF, 0);\n${body}\n  return 0;\n}\n`;
  }
  const show = (v, type) => (type === "str" ? JSON.stringify(v) : type === "char" ? "'" + v + "'" : type === "bool" ? String(v) : String(v));
  const norm = (s) => String(s).replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");

  /* Sanitizer ve çalışma hatalarını Türkçe açıklamaya çevir */
  const CRASH = [
    [/heap-buffer-overflow/, "Ayrılan bellek bloğunun dışına erişildi: dizi sınırını aştın ya da metnin sonundaki '\\0' için yer ayırmadın."],
    [/stack-buffer-overflow/, "Yığındaki bir dizinin sınırı aşıldı: indeks 0 ile n − 1 arasında olmalı."],
    [/global-buffer-overflow/, "Global bir dizinin sınırı aşıldı."],
    [/heap-use-after-free/, "free edilmiş belleği kullandın. free'den sonra o işaretçiyle işin bitmiş olmalı."],
    [/double-free/, "Aynı bellek iki kez free edildi."],
    [/attempting free on address which was not malloc|bad-free/, "malloc ile alınmamış bir adres free edildi."],
    [/stack-overflow/, "Yığın taştı: özyinelemenin temel durumu eksik ya da hiç ulaşılmıyor."],
    [/SEGV|segmentation|null pointer|address 0x0+\b/i, "Geçersiz bir adrese erişildi: NULL ya da başlatılmamış bir işaretçi kullanılıyor olabilir."],
    [/signed integer overflow/, "İşaretli tam sayı taştı: sonuç türün sınırını aştı. Daha geniş bir tür (long) gerekebilir."],
    [/division by zero/, "Sıfıra bölme yapıldı."],
    [/index .* out of bounds/, "Dizi indeksi sınırların dışında."],
    [/shift exponent/, "Geçersiz bit kaydırma miktarı."],
    [/load of null pointer|member access within null pointer/, "NULL işaretçi üzerinden okuma yapıldı."],
    [/memory access out of bounds/, "Belleğin geçersiz bir yerine erişildi: dizi sınırı dışı, NULL ya da başlatılmamış bir işaretçi olabilir."],
    [/call stack|Maximum call stack|stack exhausted/i, "Yığın taştı: özyinelemenin temel durumu eksik ya da hiç ulaşılmıyor."],
    [/integer divide by zero|divide by zero/, "Sıfıra bölme yapıldı."],
    [/integer overflow/, "Tam sayı taşması (ya da INT_MIN / -1) oluştu."],
    [/\[wasm\] unreachable/, "Program tanımsız bir duruma ulaştı ve durduruldu: işaretli tam sayı taşması, dizi sınırı dışına erişim ya da abort() olabilir. Hata satırını bulmak için değişkenlerin değerlerini printf ile yazdır."]
  ];
  function explainCrash(run) {
    if (!run) return null;
    if (run.timedOut) return { text: "Program 4 saniyede bitmedi. Döngünün bitiş koşulunu ya da özyinelemenin temel durumunu kontrol et.", line: null };
    const err = run.stderr || "";
    if (!err && run.exitCode === 0) return null;
    const m = err.match(/main\.c:(\d+)/);
    const line = m ? Number(m[1]) : null;
    const hit = CRASH.find(([re]) => re.test(err));
    const summary = (err.match(/SUMMARY: [^\n]+/) || err.match(/runtime error: [^\n]+/) || [""])[0];
    if (hit) return { text: hit[1] + (line ? ` (main.c, ${line}. satır)` : ""), line, raw: summary };
    if (run.signal) return { text: `Program ${run.signal} sinyaliyle sonlandı.`, line, raw: summary };
    if (run.exitCode !== 0 && err) return { text: "Program hata ile bitti.", line, raw: summary || err.split("\n")[0] };
    return null;
  }
  KD.explainCrash = explainCrash;

  /* Derleyici çıktısından ilk hatanın satırı ve özeti */
  function compileInfo(out) {
    const lines = String(out || "").split("\n");
    const first = lines.find((l) => /main\.c:\d+:\d+: error/.test(l)) || lines.find((l) => /error/.test(l)) || lines[0] || "";
    const m = first.match(/main\.c:(\d+):\d+: (?:fatal )?error: (.*)/);
    const warnings = lines.filter((l) => /main\.c:\d+:\d+: warning/.test(l));
    return { line: m ? Number(m[1]) : null, msg: m ? m[2] : first, warnings };
  }
  KD.cCompileInfo = compileInfo;

  let tokenP = null;
  const token = () => tokenP || (tokenP = fetch("/api/c/token", { cache: "no-store" }).then((r) => { if (!r.ok) throw new Error(); return r.json(); }).then((j) => j.token).catch((e) => { tokenP = null; throw e; }));
  const tarayicida = (code, runs) => KD.cTarayici ? KD.cTarayici.calistirHepsi(code, runs) : Promise.resolve({ netError: "C derleyicisi yüklenemedi." });
  async function post(code, runs) {
    if (KD.statik) return tarayicida(code, runs);
    let tok;
    try { tok = await token(); } catch (e) { return tarayicida(code, runs); }
    try {
      let r = await fetch("/api/c/run", { method: "POST", headers: { "Content-Type": "application/json", "X-Kodera-Token": tok }, body: JSON.stringify({ code, runs }) });
      if (r.status === 403) { tokenP = null; tok = await token(); r = await fetch("/api/c/run", { method: "POST", headers: { "Content-Type": "application/json", "X-Kodera-Token": tok }, body: JSON.stringify({ code, runs }) }); }
      const j = await r.json();
      if (!r.ok) return { netError: j.error || "C çalıştırıcı hata verdi (" + r.status + ")." };
      return j;
    } catch (e) { return { netError: "C çalıştırıcıya ulaşılamadı. Sunucuyu node server.js ile başlattığından emin ol." }; }
  }

  /* opts: { mode: "fn" | "stdout", tests, stdin } — tests yoksa sadece derle/çalıştır */
  KD.runC = async function (code, opts = {}) {
    const mode = opts.mode || "fn";
    const tests = opts.tests || null;
    const logs = [];
    const hasMain = /\bmain\s*\(/.test(code);
    let program, runs;
    if (mode === "stdout" || (!tests && hasMain)) {
      program = PRELUDE + code;
      runs = tests ? tests.filter((t) => !t.codeMatch && !t.codeNot).map((t) => ({ stdin: t.stdin || "" })) : [{ stdin: opts.stdin || "" }];
    } else {
      const ex = tests ? tests.filter((t) => t.expr) : [];
      program = PRELUDE + code + (tests ? harness(ex) : "\nint main(void) { return 0; }\n");
      runs = [{ stdin: "" }];
    }
    const res = await post(program, runs);
    if (res.netError) return { logs, error: res.netError };
    const ci = compileInfo(res.compile && res.compile.output);
    ci.warnings.forEach((w) => logs.push({ level: "warn", text: w.replace(/^.*?main\.c:/, "main.c:") }));
    if (!res.compile.ok) {
      return { logs, error: "Derleme hatası: " + ci.msg, line: ci.line, compileOutput: res.compile.output, compileError: true };
    }
    const crashNote = (run) => explainCrash(run);
    /* Test yoksa: çıktı ve olası çökme */
    if (!tests) {
      const run = res.runs[0];
      if (run.stdout) run.stdout.replace(/\n$/, "").split("\n").forEach((l) => logs.push({ level: "log", text: l }));
      const c = crashNote(run);
      if (c) return { logs, error: c.text + (c.raw ? "\n" + c.raw : ""), line: c.line };
      if (!run.stdout && !hasMain) logs.push({ level: "log", text: "Derleme başarılı" + (ci.warnings.length ? ", uyarıları oku." : ", uyarı yok.") + " Bu görevde main yok; kodunu testler çağırır." });
      return { logs };
    }
    const results = [];
    if (mode === "stdout") {
      let k = 0;
      for (const t of tests) {
        if (t.codeMatch || t.codeNot) { results.push(codeTest(t, code)); continue; }
        const run = res.runs[k++];
        const c = crashNote(run);
        const got = norm(run.stdout), exp = norm(t.stdout);
        const pass = !c && (t.contains ? got.includes(norm(t.contains)) : got === exp);
        results.push({ label: t.label, pass, got: c ? c.text : JSON.stringify(got), expected: JSON.stringify(t.contains ? "…" + norm(t.contains) + "…" : exp), crash: c, line: c && c.line });
      }
    } else {
      const run = res.runs[0];
      const vals = {};
      String(run.stdout).replace(/@@KD(\d+)@@([^\n]*)/g, (m, i, v) => { vals[i] = v; return m; });
      const own = String(run.stdout).replace(/\n?@@KD\d+@@[^\n]*\n?/g, "\n").trim();
      if (own) own.split("\n").forEach((l) => logs.push({ level: "log", text: l }));
      const c = crashNote(run);
      let ei = 0;
      for (const t of tests) {
        if (t.codeMatch || t.codeNot) { results.push(codeTest(t, code)); continue; }
        const i = String(ei++);
        if (!(i in vals)) { results.push({ label: t.label, pass: false, got: c ? c.text : "Bu teste gelinemedi.", expected: show(t.expected, t.type), crash: c, line: c && c.line, error: true }); continue; }
        const v = vals[i];
        let pass;
        if (t.type === "double") pass = Math.abs(parseFloat(v) - t.expected) <= 1e-6 * Math.max(1, Math.abs(t.expected));
        else if (t.type === "bool") pass = v === (t.expected ? "1" : "0");
        else pass = v === String(t.expected);
        const gotShow = t.type === "bool" ? String(v === "1") : t.type === "str" ? JSON.stringify(v) : t.type === "char" ? "'" + v + "'" : v;
        results.push({ label: t.label, pass, got: gotShow, expected: show(t.expected, t.type) });
      }
      if (c) logs.push({ level: "error", text: c.text + (c.raw ? "\n" + c.raw : "") });
    }
    return { logs, results, line: (results.find((r) => r.line) || {}).line };
  };
  function codeTest(t, code) {
    const src = code.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
    const ok = t.codeMatch ? new RegExp(t.codeMatch).test(src) : !new RegExp(t.codeNot).test(src);
    return { label: t.label, pass: ok, got: ok ? "uygun" : t.codeMatch ? "bulunamadı" : "kullanılmış", expected: t.codeHint || (t.codeMatch ? "kodda olmalı" : "kullanılmamalı") };
  }
})(window.KD);

/* ---------------- AI Mentor: hata teşhisi + Sokratik sunucu çağrısı ---------------- */
(function (KD) {
  let aiState = null;
  KD.tutor = {
    async available() {
      if (aiState !== null) return aiState;
      if (KD.hesapYok) return (aiState = false);
      try {
        const r = await fetch("/api/health", { cache: "no-store" });
        aiState = r.ok ? !!(await r.json()).ai : false;
      } catch (e) { aiState = false; }
      return aiState;
    },
    /* Kural tabanlı anlık teşhis: AI olmadan da çalışır */
    diagnose(res, ch) {
      const out = [];
      const err = res.error || "";
      if (res.timeout) out.push("Kodun bitmedi. Döngünün koşulu bir gün yanlış oluyor mu? Sayaç değişkenini artırıyor musun?");
      else if (/SyntaxError/.test(err)) out.push("Söz dizimi hatası" + (res.line ? " (" + res.line + ". satır civarı)" : "") + ": parantez, süslü parantez ve tırnakların eşleştiğini kontrol et. Mesaj: " + err);
      else if (err) out.push("Kod çalışırken hata oluştu: " + err);
      if (ch && ch.lang === "c" && res.compileError) {
        const m = String(res.error);
        const tip = /undeclared identifier|use of undeclared/.test(m) ? "Tanımlanmamış bir isim kullanıyorsun: yazımı ve değişkenin hangi blokta tanımlandığını kontrol et."
          : /implicit declaration of function/.test(m) ? "Derleyici bu fonksiyonu tanımıyor: ilgili #include eksik olabilir ya da fonksiyonu kullanmadan önce tanımlamadın."
          : /expected ';'/.test(m) ? "Bir ifadenin sonunda noktalı virgül eksik."
          : /redefinition of 'main'|redefinition/.test(m) ? "Aynı isim iki kez tanımlanmış. Bu görevde main yazmana gerek yok; testler kendi main'ini ekler."
          : /incompatible (pointer|integer)/.test(m) ? "Tür uyuşmazlığı: işaretçi ile değeri karıştırıyor olabilirsin (& ve * kullanımını kontrol et)."
          : /expression is not assignable/.test(m) ? "Atanamayan bir şeye değer atıyorsun. Karşılaştırma için == kullanılır."
          : /expected expression|expected '\)'|expected '}'/.test(m) ? "Söz dizimi hatası: parantez ve süslü parantezlerin eşleştiğini kontrol et." : null;
        if (tip) out.splice(0, out.length, tip + " Derleyici: " + m);
      }
      const crash = (res.results || []).find((x) => x.crash);
      if (crash) { out.push(crash.crash.text + (crash.crash.raw ? " Sanitizer raporu: " + crash.crash.raw.replace(/^SUMMARY: /, "") : "")); return out; }
      const r = res.results || [];
      if (!r.length) return out;
      const fails = r.filter((x) => !x.pass);
      if (!fails.length) return out;
      const f = fails[0];
      if (/no such (table|column)/.test(f.got)) out.push("Veritabanında böyle bir tablo ya da sütun yok: " + f.got.replace(/^SQL hatası: /, "") + ". Şemaya bak ve yazımı kontrol et.");
      else if (/syntax error/.test(f.got)) out.push("SQL söz dizimi hatası: " + f.got.replace(/^SQL hatası: /, "") + ". Anahtar kelimelerin sırası SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT olmalı.");
      else if (f.slow) out.push("Sonucun doğru ama yavaş: " + f.ms + " ms. İç içe döngü, döngü içinde includes/indexOf ya da gereksiz sıralama var mı? Set, Map veya iki işaretçiyle tek geçişe indirmeyi dene.");
      else if (/bulunamadı/.test(f.got)) out.push("Fonksiyon adı tam olarak `" + ch.fn + "` olmalı. Büyük/küçük harf ve Türkçe karakterlere dikkat.");
      else if (/is not defined/.test(f.got)) out.push("Tanımlanmamış bir isim kullanıyorsun: " + f.got.replace(/^ReferenceError: /, "") + ". Yazım hatası olabilir mi?");
      else if (/is not a function/.test(f.got)) out.push("Fonksiyon olmayan bir şeyi çağırıyorsun: " + f.got + ". Metot adını doğru yazdın mı?");
      else if (/Cannot read prop/.test(f.got)) out.push("undefined/null bir değerin özelliğine erişiliyor. Bu değişken o anda ne içeriyor? console.log ile bak.");
      else if (ch && ch.lang === "py" && f.got === "None" && f.expected !== "None") out.push("Fonksiyonun None döndürüyor. `return` yazmayı unuttun mu? print() ekrana yazar, return değeri geri verir; ikisi aynı şey değildir.");
      else if (ch && ch.lang === "py" && f.error) out.push(f.got);
      else if (f.got === "undefined" && f.expected !== "undefined") out.push("Fonksiyonun hiçbir şey döndürmüyor (undefined). `return` yazmayı unuttun mu? console.log ile return aynı şey değildir.");
      else if (f.got === "NaN") out.push("Sonuç NaN: bir sayıya undefined ya da metin karışıyor olabilir. Döngü sınırlarını ve boş girdiyi kontrol et.");
      else if (f.got === "Promise {…}") out.push("Sonuç bir Promise. Değerine ulaşmak için await kullanmalısın.");
      let sqlNote = null;
      if (ch && ch.lang === "sql") {
        try {
          const e = JSON.parse(f.expected), g = JSON.parse(f.got);
          if (Array.isArray(e) && Array.isArray(g)) {
            const ec = e[0] ? e[0].length : 0, gc = g[0] ? g[0].length : 0;
            if (g.length !== e.length) sqlNote = "Satır sayısı tutmuyor: " + e.length + " satır bekleniyor, sorgun " + g.length + " satır döndürdü. " + (g.length > e.length ? "Süzme koşulun (WHERE/HAVING) eksik ya da fazla geniş olabilir." : "Koşulun fazla dar ya da JOIN türü yanlış olabilir.");
            else if (gc !== ec) sqlNote = "Sütun sayısı tutmuyor: " + ec + " sütun bekleniyor, sorgun " + gc + " sütun döndürdü. SELECT listesini kontrol et.";
            else if (JSON.stringify(e.slice().sort()) === JSON.stringify(g.slice().sort())) sqlNote = "Satırlar doğru ama sıraları farklı. ORDER BY'ı kontrol et.";
            else sqlNote = "Satır ve sütun sayısı doğru ama değerler farklı. Sonuç tablosunu Konsol sekmesinde beklenenle karşılaştır.";
          }
        } catch (_) {}
      }
      out.push((r.length - fails.length) + "/" + r.length + " test geçti. " + (sqlNote ? "İlk başarısız test (" + f.label + "): " + sqlNote : "İlk başarısız test: " + f.label + " → beklenen " + f.expected + ", senin sonucun " + f.got + "."));
      return out;
    },
    async ask(payload) {
      const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error("Mentor şu an yanıt veremiyor (" + r.status + ")");
      return (await r.json()).reply;
    }
  };
})(window.KD);

/* ---------------- Yardımcılar ---------------- */
(function (KD) {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  KD.esc = esc;
  const RE = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|function|return|if|else|for|while|of|in|new|async|await|try|catch|finally|throw|typeof|instanceof)\b|\b(true|false|null|undefined|NaN)\b|\b(\d+(?:\.\d+)?)\b/g;
  KD.hl = (line) => esc(line).replace(RE, (m, c, s, k, l, n) =>
    c ? '<i class="t-c">' + c + "</i>" : s ? '<i class="t-s">' + s + "</i>" : k ? '<i class="t-k">' + k + "</i>" : l ? '<i class="t-l">' + l + "</i>" : '<i class="t-n">' + n + "</i>");
  const RE_HTML = /(&lt;!--.*?--&gt;)|(&lt;\/?[a-zA-Z][\w-]*)|("[^"]*")|(\s[a-zA-Z_:@-]+)(?==)|(\/?&gt;)/g;
  KD.hlHtml = (line) => esc(line).replace(RE_HTML, (m, c, t, s, a, g) =>
    c ? '<i class="t-c">' + c + "</i>" : t ? '<i class="t-k">' + t + "</i>" : s ? '<i class="t-s">' + s + "</i>" : a ? '<i class="t-l">' + a + "</i>" : '<i class="t-k">' + g + "</i>");
  KD.hlCss = (line) => esc(line).replace(/(\/\*.*?\*\/)|([\w-]+)(?=\s*:)|(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|fr|rem|em|%|s)?\b)/g, (m, c, p, n) =>
    c ? '<i class="t-c">' + c + "</i>" : p ? '<i class="t-l">' + p + "</i>" : '<i class="t-n">' + n + "</i>");
  /* Karma belge: <script> ve <style> blokları kendi diliyle renklendirilir */
  KD.hlDoc = (src, lang) => {
    if (lang === "css") return src.split("\n").map(KD.hlCss);
    if (lang === "sql") return src.split("\n").map(KD.hlSql);
    if (lang === "c") return src.split("\n").map(KD.hlC);
    if (lang === "jsx") return src.split("\n").map((l) => KD.hl(l).replace(/(&lt;\/?)([A-Za-z][\w.]*)/g, '$1<i class="t-tag">$2</i>').replace(/\/?&gt;/g, '<i class="t-tag">$&</i>'));
    if (lang !== "html") return src.split("\n").map(KD.hl);
    let mode = "html";
    return src.split("\n").map((l) => {
      if (mode === "html" && /<script\b/i.test(l) && !/<\/script>/i.test(l)) { mode = "js"; return KD.hlHtml(l); }
      if (mode === "html" && /<style\b/i.test(l) && !/<\/style>/i.test(l)) { mode = "css"; return KD.hlHtml(l); }
      if (mode !== "html" && /<\/(script|style)>/i.test(l)) { mode = "html"; return KD.hlHtml(l); }
      return mode === "js" ? KD.hl(l) : mode === "css" ? KD.hlCss(l) : KD.hlHtml(l);
    });
  };
  const SQLK = /(--.*$)|('(?:[^']|'')*')|\b(SELECT|FROM|WHERE|AND|OR|NOT|NULL|IS|IN|AS|ON|JOIN|LEFT|INNER|OUTER|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|ASC|DESC|DISTINCT|COUNT|SUM|AVG|MIN|MAX|ROUND|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|PRIMARY|KEY|REFERENCES|UNIQUE|CHECK|DEFAULT|BEGIN|COMMIT|ROLLBACK|TRANSACTION|BETWEEN|LIKE|CASE|WHEN|THEN|ELSE|END|EXPLAIN|QUERY|PLAN|INTEGER|TEXT|REAL|DROP|ALTER|ADD|COLUMN|IF|EXISTS)\b|\b(\d+(?:\.\d+)?)\b/gi;
  KD.hlSql = (line) => esc(line).replace(SQLK, (m, c, s, k, n) => c ? '<i class="t-c">' + c + "</i>" : s ? '<i class="t-s">' + s + "</i>" : k ? '<i class="t-k">' + k + "</i>" : '<i class="t-n">' + n + "</i>");
  const CK = /(\/\/.*$|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(^\s*#\s*\w+.*$)|\b(int|long|short|char|double|float|void|unsigned|signed|const|static|struct|typedef|enum|union|return|if|else|for|while|do|switch|case|default|break|continue|sizeof|size_t|bool|true|false|NULL)\b|\b(\d+(?:\.\d+)?[uUlLfF]*)\b/g;
  KD.hlC = (line) => esc(line).replace(CK, (m, c, s, pp, k, n) => c ? '<i class="t-c">' + c + "</i>" : s ? '<i class="t-s">' + s + "</i>" : pp ? '<i class="t-l">' + pp + "</i>" : k ? '<i class="t-k">' + k + "</i>" : '<i class="t-n">' + n + "</i>");
  KD.md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");
})(window.KD);
