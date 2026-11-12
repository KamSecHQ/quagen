/* QUAGEN NextGen — uygulama arayüzü */
(function () {
  const LANG = KD.lang;
  const C = window.KD_CURRICULUM.filter((p) => (p.language || "js") === LANG), S = KD.store, esc = KD.esc, md = KD.md;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const view = $("#view");
  const UNLOCK = 0.66;
  const KAM_VAR = !!window.KAM;                              // karşılama, plan ve ipuçları her dilde KAM'den
  const KAMLI = KAM_VAR;                                     // konuyu her dilde KAM sohbetle anlatır
  const STEPS = [["tahmin", "Tahmin et"], ["incele", KAMLI ? "KAM anlatıyor" : "İncele"], ["alistir", "Alıştır"], ["kodla", "Kodla"], ["hatirla", "Hatırla"]];
  const MENTOR_AD = KAM_VAR ? "KAM" : "Mentor";
  const ALL_CARDS = C.flatMap((p) => p.cards.map((c) => Object.assign({ phase: p }, c)));
  const ALL_CH = C.flatMap((p) => p.challenges.map((c) => Object.assign({ phase: p }, c)));
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  let aiOn = false;

  /* ---------- Simgeler (çizgi, 1.75px) ---------- */
  const svg = (d, extra = "") => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const I = {
    menu: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: svg('<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>'),
    gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>'),
    home: svg('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/>'),
    cards: svg('<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>'),
    shuffle: svg('<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>'),
    award: svg('<circle cx="12" cy="9" r="6"/><path d="M8.2 13.8 7 22l5-3 5 3-1.2-8.2"/>'),
    lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', 'width="14" height="14"'),
    check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'width="14" height="14"'),
    x: svg('<path d="M6 6l12 12M18 6 6 18"/>', 'width="14" height="14"'),
    play: svg('<path d="M7 4.5v15l13-7.5Z"/>', 'width="15" height="15"'),
    flame: svg('<path d="M12 22c4 0 7-2.7 7-6.8 0-3.5-2.4-5.8-4.1-8.2-.6 2-1.6 3-2.9 3.5.3-2.8-.6-5.5-3-8.5C8.4 5.6 5 8.8 5 14.6 5 18.9 8 22 12 22Z"/>', 'width="15" height="15"'),
    chevron: svg('<path d="m9 6 6 6-6 6"/>', 'width="14" height="14"'),
    chart: svg('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
    user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', 'width="15" height="15"'),
    reset: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>', 'width="15" height="15"')
  };

  /* ---------- Parkurlar ---------- */
  const TRACKS_BY_LANG = {
    c: [{ id: "c", title: "C temelleri", short: "C", req: null, desc: "Türler, işaretçiler, struct'lar ve dinamik bellek; gerçek derleyici ve bellek hatası denetimiyle." },
      { id: "c2", title: "İleri C ve veri yapıları", short: "İleri C", req: "c", desc: "Bitler, fonksiyon işaretçileri, makrolar, hash tablosu, ağaçlar ve bir komut satırı aracı." }],
    py: [{ id: "py", title: "Python temelleri", short: "Python", req: null, desc: "Değişkenlerden istisnalara: listeler, sözlükler, kavramalar ve ilk komut satırı programın. Tarayıcıda gerçek Python 3.12." },
      { id: "py2", title: "Python ile veri ve otomasyon", short: "İleri Python", req: "py", desc: "Sınıflar, üreteçler, dekoratörler, collections, re, csv ve json; sonunda bir veri raporu aracı." }]
  };
  const TRACKS = TRACKS_BY_LANG[LANG] || [
    { id: "js", title: "JavaScript temelleri", short: "JavaScript", req: null, desc: "Değişkenlerden asenkron koda: dilin kendisi." },
    { id: "web", title: "Web temelleri", short: "Web", req: "js", desc: "HTML, CSS, DOM, formlar, fetch ve ilk uygulaman." },
    { id: "react", title: "React", short: "React", req: "web", desc: "Bileşenler, state, hook'lar ve bir katalog projesi." },
    { id: "algo", title: "Algoritmalar ve veri yapıları", short: "Algoritmalar", req: "js", desc: "Big-O, hash map, iki işaretçi, ağaçlar: mülakat hazırlığı." },
    { id: "backend", title: "Backend ve veritabanı", short: "Backend", req: "js", desc: "HTTP, doğrulama, güvenlik, gerçek SQLite ile SQL ve bir API projesi." }
  ];
  const trackOf = (p) => p.track || "js";
  const T = (id) => TRACKS.find((t) => t.id === id);
  const phasesOf = (tid) => C.filter((p) => trackOf(p) === tid);

  /* ---------- Ustalık & kilit ---------- */
  const mastery = (p) => { const ph = S.phase(p.id); return p.challenges.filter((c) => ph.passed[c.id]).length / p.challenges.length; };
  const placed = (tid) => !!S.state.placed[tid];
  const trackUnlocked = (tid) => { const t = T(tid); if (!t.req) return true; if (placed(t.req)) return true; const prev = phasesOf(t.req); return mastery(prev[prev.length - 1]) >= UNLOCK; };
  const unlocked = (p) => {
    if (placed(trackOf(p))) return true;
    const list = phasesOf(trackOf(p)), i = list.indexOf(p);
    return i === 0 ? trackUnlocked(trackOf(p)) : mastery(list[i - 1]) >= UNLOCK;
  };
  const trackProgress = (tid) => {
    const ps = phasesOf(tid), total = ps.reduce((n, p) => n + p.challenges.length, 0);
    const passed = ps.reduce((n, p) => n + p.challenges.filter((c) => S.phase(p.id).passed[c.id]).length, 0);
    return { passed, total, done: ps.filter((p) => mastery(p) === 1).length, phases: ps.length, ratio: passed / total };
  };
  const trackComplete = (tid) => trackProgress(tid).ratio === 1;
  const lockReason = (p) => {
    const list = phasesOf(trackOf(p)), i = list.indexOf(p);
    if (i > 0) return `Ders ${list[i - 1].no}'de en az 2 görevi geçince açılır.`;
    return `${T(T(trackOf(p)).req).title} parkurunu bitirince açılır.`;
  };
  /* Seviye sınavını geçenler için çözümlü örnek varsayılan adım değil (uzmanlık tersine dönmesi, Kalyuga 2003) */
  const defaultStep = (p) => { const ph = S.phase(p.id); if (placed(trackOf(p))) return "kodla"; return ph.predict === null ? "tahmin" : !ph.viewed ? "incele" : !ph.drill && !Object.keys(ph.passed).length ? "alistir" : "kodla"; };
  const skillPct = (p) => { const v = KD.bkt.get(p.id); return v == null ? null : Math.round(v * 100); };
  /* Sıradaki en mantıklı hedef: açık ve bitmemiş ilk ders */
  function nextTarget() {
    for (const t of TRACKS) for (const p of phasesOf(t.id)) {
      if (!unlocked(p) || mastery(p) === 1) continue;
      const ph = S.phase(p.id), step = defaultStep(p);
      const ch = p.challenges.find((c) => !ph.passed[c.id]);
      return { p, step, ch };
    }
    return null;
  }
  const lastOpen = () => (nextTarget() || { p: C[0] }).p;

  /* ---------- Tema & tercihler ---------- */
  const prefs = () => S.state.prefs;
  function applyPrefs() {
    let t = prefs().theme;
    if (t === "system") t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = t;
    document.documentElement.style.setProperty("--code-size", prefs().font + "px");
    $("#btn-theme").innerHTML = t === "dark" ? I.sun : I.moon;
    $("#btn-theme").setAttribute("aria-label", t === "dark" ? "Açık temaya geç" : "Koyu temaya geç");
  }
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => prefs().theme === "system" && applyPrefs());

  /* ---------- Rozetler ---------- */
  function computeStats() {
    const passed = ALL_CH.filter((c) => S.phase(c.phase.id).passed[c.id]).length;
    const explains = C.reduce((n, p) => n + Object.keys(S.phase(p.id).explain || {}).length, 0);
    return { passed, explains, best: S.state.streak.best || 0, reviews: S.state.stats.reviews, hintless: S.state.stats.hintless, mix: S.state.mix || 0 };
  }
  const BADGES = [
    { id: "ilk", t: "İlk test", d: "İlk görevini geçtin.", ok: (s) => s.passed >= 1 },
    { id: "on", t: "On görev", d: "10 görev geçtin.", ok: (s) => s.passed >= 10 },
    { id: "elli", t: "Elli görev", d: "50 görev geçtin.", ok: (s) => s.passed >= 50 },
    { id: "yuz", t: "Yüz görev", d: "100 görev geçtin.", ok: (s) => s.passed >= 100 },
    { id: "kendi", t: "Kendi başına", d: "10 görevi ipucu almadan geçtin.", ok: (s) => s.hintless >= 10 },
    { id: "seri3", t: "Üç gün üst üste", d: "3 günlük seriye ulaştın.", ok: (s) => s.best >= 3 },
    { id: "seri7", t: "Bir hafta", d: "7 günlük seriye ulaştın.", ok: (s) => s.best >= 7 },
    { id: "hafiza", t: "Hafıza", d: "25 kart tekrar ettin.", ok: (s) => s.reviews >= 25 },
    { id: "karma", t: "Karışık antrenman", d: "10 karma görev çözdün.", ok: (s) => s.mix >= 10 },
    { id: "ogretmen", t: "Öğretir gibi", d: "10 çözümünü kendi cümlelerinle açıkladın.", ok: (s) => s.explains >= 10 },
    { id: "kalibre", t: "Kendini tanıyor", d: "En az 20 tahminde Brier skorun 0,15'in altında.", ok: () => { const c = KD.calib.summary(); return !!c && c.n >= 20 && c.brier < 0.15; } },
    { id: "usta", t: "Ustalık", d: "Beş becerinde hâkimiyet tahmini %95'i geçti.", ok: () => Object.values(S.state.skills).filter((v) => v >= KD.bkt.MASTERY).length >= 5 },
    { id: "seviye", t: "Hızlı başlangıç", d: "JavaScript seviye sınavını geçtin.", ok: () => placed("js") },
    ...TRACKS.map((t) => ({ id: "parkur-" + t.id, t: t.short + " parkuru", d: t.title + " parkurunu bitirdin.", ok: () => trackComplete(t.id) }))
  ];
  function checkBadges() {
    const s = computeStats(); let changed = false;
    for (const b of BADGES) {
      if (!S.state.badges[b.id] && b.ok(s)) {
        S.state.badges[b.id] = S.day(); changed = true;
        setTimeout(() => toast(`<b>Yeni rozet:</b> ${esc(b.t)}`, "badge"), 900);
      }
    }
    if (changed) S.save();
  }

  /* ---------- Genel arayüz ---------- */
  function toast(html, kind = "") {
    const t = $("#toast");
    t.className = "toast show " + kind;
    t.innerHTML = html;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (t.className = "toast"), 2800);
  }
  KD.emit = (type, n) => {
    if (type !== "xp") return;
    toast(`+${n} XP`, "xp"); renderBar(); checkBadges();
    const pill = $("#st-xp");
    if (pill && !REDUCED()) {
      pill.classList.remove("bump"); void pill.offsetWidth; pill.classList.add("bump");
      const f = document.createElement("span"); f.className = "xp-float"; f.textContent = "+" + n;
      const r = pill.getBoundingClientRect(); f.style.left = r.left + r.width / 2 + "px"; f.style.top = r.bottom + "px";
      document.body.appendChild(f); setTimeout(() => f.remove(), 1100);
    }
  };

  function renderBar() {
    const st = S.state.streak;
    $("#st-streak").innerHTML = `${I.flame}<b>${st.count}</b><span class="sr">günlük seri</span>`;
    $("#st-xp").innerHTML = `<b>${S.state.xp.toLocaleString("tr-TR")}</b> XP`;
    const due = KD.srs.due(ALL_CARDS).length;
    const b = $("#due-badge"); if (b) { b.textContent = due; b.hidden = !due; }
  }

  function renderCrumbs(parts) {
    $("#crumbs").innerHTML = parts.map((x, i) => i === parts.length - 1
      ? `<span aria-current="page">${esc(x.t)}</span>`
      : `<a href="${x.h}">${esc(x.t)}</a><span class="sep" aria-hidden="true">/</span>`).join("");
  }

  const IK_PRATIK = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 1-3.5S9 11 10.5 11C10.5 7 12 2 12 2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  const IK_KITAP = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z M9 9h6M9 13h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const IK_LAB = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const IK_PROJE = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 7l8-4 8 4-8 4-8-4Zm0 5l8 4 8-4M4 17l8 4 8-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const IK_TERM = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 5h16v14H4zM7.5 9.5l3 2.5-3 2.5M12.5 15h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const IK_YOL = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 20V9a3 3 0 0 1 3-3h8M14 3l3 3-3 3M6 20h.01M12 14h.01M18 14v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function renderSide(active) {
    const due = KD.srs.due(ALL_CARDS).length;
    const bugun = S.state.daily[S.day()] || 0, hedef = prefs().goal || 50, oran = Math.min(1, bugun / hedef), st = S.state.streak;
    const GRUPLAR = [
      ["Çalış", [
        ["#panel", "panel", I.home, "Panel", "Bugünün planı", ""],
        ["#tekrar", "tekrar", I.cards, "Tekrar", due ? "Bugün " + due + " kart bekliyor" : "Bugünlük kart yok", `<span class="count" id="due-badge" ${due ? "" : "hidden"}>${due}</span>`],
        ["#karma", "karma", I.shuffle, "Karma antrenman", "Eski görevleri yeniden yaz", ""],
        ["pratik.html?dil=" + LANG, "pratik", IK_PRATIK, "Pratik", "Günde beş dakika", ""]
      ]],
      ["Atölye", [
        ["#lab", "lab", IK_LAB, "Lablar", "Siber güvenlik: sanal makine", ""],
        ["#projeler", "projeler", IK_PROJE, "Projeler", "Basitten zora 25 fikir", ""],
        ["#terminal", "terminal", IK_TERM, "Terminal", "Serbest çalışma alanı", ""]
      ]],
      ["Keşfet", [
        ["#yollar", "yollar", IK_YOL, "Yol haritaları", "Diller ve alanlar", ""],
        ["rehber.html", "kutuphane", IK_KITAP, "Kütüphane", "Nasıl yazılır? Sor, bul", ""]
      ]],
      ["Gelişimin", [
        ["#icgoruler", "icgoruler", I.chart, "İçgörüler", "Güçlü ve zayıf konuların", ""],
        ["#profil", "profil", I.user, "Profil", "Tüm dillerdeki ilerlemen", ""],
        ["#sertifika", "sertifika", I.award, "Sertifikalar", "Bitirdiğin parkurlar", ""]
      ]]
    ];
    $("#side-main").innerHTML = `
      <a class="side-ozet" href="#panel" aria-label="Bugünkü durum">
        <span class="so-halka" style="--o:${oran}"><b>${Math.round(oran * 100)}</b></span>
        <span class="so-yazi"><b>${esc(prefs().name || "Bugün")}</b><small>${bugun} / ${hedef} XP${st.count ? " · " + st.count + " gün seri" : ""}</small></span>
      </a>` + GRUPLAR.map(([ad, ogeler]) => `
      <div class="side-grup"><p class="side-grup-ad">${ad}</p>
        ${ogeler.map(([h, id, ic, t, alt, extra], k) => `<a href="${h}" class="side-link ${active === id ? "on" : ""}" data-id="${id}" style="--k:${k}"><span class="sl-ik">${ic}</span><span class="sl-yazi"><b>${t}</b><small>${alt}</small></span>${extra}</a>`).join("")}
      </div>`).join("");

    const openTrack = active && active.startsWith("p") ? trackOf(C.find((p) => p.id === active) || C[0]) : null;
    $("#tracks").innerHTML = TRACKS.map((t) => {
      const pr = trackProgress(t.id), open = trackUnlocked(t.id);
      return `<details class="trk" ${openTrack === t.id || (!openTrack && t.id === trackOf(lastOpen())) ? "open" : ""}>
        <summary><span class="trk-name">${esc(t.title)}</span><span class="trk-num">${pr.done}/${pr.phases}</span><span class="trk-bar" aria-hidden="true"><i style="width:${pr.phases ? (pr.done / pr.phases) * 100 : 0}%"></i></span></summary>
        <ol>${phasesOf(t.id).map((p) => {
          const ok = unlocked(p), m = mastery(p);
          return `<li><a href="#${p.id}" class="ph ${ok ? "" : "locked"} ${m === 1 ? "done" : ""} ${p.id === active ? "on" : ""}" ${ok ? "" : `aria-disabled="true" title="${esc(lockReason(p))}"`}>
            <span class="ph-no">${ok ? (m === 1 ? I.check : p.no) : I.lock}</span>
            <span class="ph-name">${esc(p.short)}</span>
            <span class="ph-bar" style="--m:${m}"></span>
          </a></li>`;
        }).join("")}</ol>
        ${open ? "" : `<p class="trk-lock">${esc(T(t.req).title)} bitince açılır.</p>`}
      </details>`;
    }).join("");
  }

  function codeBlock(src, cls = "", lang = "js") {
    return `<pre class="code ${cls}">${KD.hlDoc(src, lang).map((l, i) => `<span class="ln" data-l="${i + 1}"><i class="n">${i + 1}</i>${l || " "}</span>`).join("")}</pre>`;
  }
  const isWeb = (x) => x && (x.lang === "html" || x.lang === "css" || x.lang === "js" || x.lang === "jsx");
  const hlLang = (l) => (l === "html" ? "html" : l === "css" ? "css" : l === "jsx" ? "jsx" : l === "sql" ? "sql" : l === "c" ? "c" : l === "py" ? "py" : "js");
  function tableHTML(t) {
    if (!t || !t.columns || !t.columns.length) return "";
    const rows = t.values.slice(0, 50);
    return `<div class="sqltable"><table><thead><tr>${t.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((v) => `<td class="${v === null ? "null" : typeof v === "number" ? "num" : ""}">${v === null ? "NULL" : esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>${t.values.length > 50 ? `<p class="muted small">İlk 50 satır gösteriliyor (toplam ${t.values.length}).</p>` : `<p class="muted small">${t.values.length} satır</p>`}</div>`;
  }

  async function runSnippet(snip, conEl, prevEl) {
    conEl.hidden = false; conEl.innerHTML = '<div class="log muted">Çalışıyor…</div>';
    if (snip.lang === "html" || snip.lang === "jsx") {
      prevEl.hidden = false;
      conEl.innerHTML = consoleHTML(await KD.runWeb({ lang: snip.lang, code: snip.code, host: prevEl }));
    } else if (snip.lang === "c") {
      conEl.innerHTML = '<div class="log muted">Derleniyor (clang)…</div>';
      conEl.innerHTML = consoleHTML(await KD.runC(snip.code, { stdin: snip.stdin || "" }));
    } else if (snip.lang === "py") {
      conEl.innerHTML = '<div class="log muted">Python hazırlanıyor…</div>';
      conEl.innerHTML = consoleHTML(await KD.runPy(snip.code, { stdin: snip.stdin || "" }));
    } else if (snip.lang === "sql") {
      const res = await KD.run(snip.code, { mode: "sql", setup: snip.setup, timeout: 15000 });
      conEl.innerHTML = res.error ? consoleHTML(res) : tableHTML(res.table) || '<div class="log muted">Komut çalıştı; döndürülen satır yok.</div>';
    } else conEl.innerHTML = consoleHTML(await KD.run(snip.code, { timeout: snip.db ? 15000 : 8000, wait: 300, db: snip.db }));
  }

  function consoleHTML(res) {
    const lines = (res.logs || []).map((l) => `<div class="log ${l.level}">${esc(l.text)}</div>`);
    if (res.error) lines.push(`<div class="log error">${esc(res.error)}</div>`);
    if (!lines.length) lines.push(`<div class="log muted">Çıktı yok. console.log ile bir şey yazdır.</div>`);
    return lines.join("");
  }

  function celebrate(host) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = document.createElement("div");
    box.className = "confetti";
    const colors = ["var(--marker)", "var(--ink)", "var(--pass)", "var(--marker)"];
    for (let i = 0; i < 24; i++) {
      const s = document.createElement("i");
      s.style.setProperty("--dx", (Math.random() * 2 - 1) * 200 + "px");
      s.style.setProperty("--dy", -(60 + Math.random() * 200) + "px");
      s.style.setProperty("--r", Math.random() * 540 + "deg");
      s.style.background = colors[i % 4];
      box.appendChild(s);
    }
    host.appendChild(box);
    setTimeout(() => box.remove(), 1300);
  }

  /* ---------- Editör ---------- */
  function makeEditor(host, value, onChange, onRun, mode = "javascript") {
    if (window.CodeMirror) {
      const cm = CodeMirror(host, {
        value, mode, lineNumbers: true, tabSize: 2, indentUnit: 2, lineWrapping: true, styleActiveLine: true,
        autoCloseBrackets: true, matchBrackets: true, autoCloseTags: true, theme: "kodera",
        extraKeys: { "Ctrl-Enter": onRun, "Cmd-Enter": onRun, Tab: (c) => c.execCommand("insertSoftTab") }
      });
      cm.on("change", () => onChange(cm.getValue()));
      setTimeout(() => cm.refresh(), 30);
      return { cm, get: () => cm.getValue(), set: (v) => cm.setValue(v), focus: () => cm.focus(), mark(line) { cm.addLineClass(line - 1, "background", "cm-errline"); setTimeout(() => cm.removeLineClass(line - 1, "background", "cm-errline"), 2600); } };
    }
    const ta = document.createElement("textarea");
    ta.className = "ta-editor"; ta.value = value; ta.spellcheck = false;
    ta.addEventListener("input", () => onChange(ta.value));
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab") { e.preventDefault(); ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end"); }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); onRun(); }
    });
    host.appendChild(ta);
    return { get: () => ta.value, set: (v) => (ta.value = v), focus: () => ta.focus(), mark() {} };
  }

  /* ---------- Yönlendirme ---------- */
  /* ---------- Hareket yardımcıları ---------- */
  const REDUCED = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Sayılar 0'dan hedefe yumuşakça sayar */
  function sayaclar(root = document) {
    $$("[data-count]", root).forEach((el) => {
      const hedef = Number(el.dataset.count) || 0;
      if (REDUCED() || hedef === 0) { el.textContent = hedef.toLocaleString("tr-TR"); return; }
      const t0 = performance.now(), sure = 700 + Math.min(600, hedef * 4);
      const adim = (t) => { const k = Math.min(1, (t - t0) / sure); el.textContent = Math.round(hedef * (1 - Math.pow(1 - k, 3))).toLocaleString("tr-TR"); if (k < 1) requestAnimationFrame(adim); };
      requestAnimationFrame(adim);
    });
  }
  /* Halkalar ve çubuklar boştan dolarak çizilir */
  function cizimler(root = document) {
    if (REDUCED()) return;
    $$(".ring-fg", root).forEach((c) => { const hedef = c.getAttribute("stroke-dashoffset"); c.style.strokeDashoffset = c.getAttribute("stroke-dasharray"); requestAnimationFrame(() => requestAnimationFrame(() => (c.style.strokeDashoffset = hedef))); });
  }
  function route() {
    const yap = () => { routeIc(); requestAnimationFrame(() => { sayaclar(view); cizimler(view); }); };
    if (document.startViewTransition && !REDUCED() && route.ilk) {
      document.startViewTransition(yap);
    } else yap();
    route.ilk = true;
  }
  function routeIc() {
    const [a, b, c] = (location.hash.slice(1) || "panel").split("/");
    closeSide();
    window.scrollTo(0, 0);
    if (a === "panel") return renderDashboard();
    if (a === "tekrar") return renderReview();
    if (a === "karma") return renderMix();
    if (a === "sertifika") return renderCertificates(b);
    if (a === "icgoruler") return renderInsights();
    if (a === "seviye") return LANG === "js" ? renderPlacement() : renderDashboard();
    if (a === "profil") return renderProfile();
    const ek = window.KD_SAYFALAR && window.KD_SAYFALAR[a];
    if (ek) { document.title = ek.ad + " · QUAGEN NextGen"; renderSide(a); renderBar(); renderCrumbs([{ t: "Panel", h: "#panel" }, ...(b ? [{ t: ek.ad, h: "#" + a }, { t: a === "lab" ? "Lab" : "Çalışma" }] : [{ t: ek.ad }])]); return ek.ciz(view, b, c); }
    const p = C.find((x) => x.id === a);
    if (!p) return renderDashboard();
    if (!unlocked(p)) {
      toast(`Ders ${p.no} henüz kilitli. ${lockReason(p)}`, "warn");
      location.replace("#" + lastOpen().id);
      return;
    }
    renderPhase(p, STEPS.some((s) => s[0] === b) ? b : defaultStep(p), c);
  }

  /* ---------- Panel ---------- */
  function greeting() {
    const h = new Date().getHours();
    return h < 6 ? "İyi geceler" : h < 12 ? "Günaydın" : h < 18 ? "İyi günler" : "İyi akşamlar";
  }
  function heatmap() {
    const weeks = 26, today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today); start.setDate(start.getDate() - (weeks * 7 - 1) - ((today.getDay() + 6) % 7 === 6 ? 0 : 0));
    // pazartesiden başlayan haftalar
    const offset = (start.getDay() + 6) % 7; start.setDate(start.getDate() - offset);
    const cells = []; let total = 0, activeDays = 0;
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const key = d.toLocaleDateString("sv"), xp = S.state.daily[key] || 0;
      if (xp) { total += xp; activeDays++; }
      const lv = xp === 0 ? 0 : xp < 20 ? 1 : xp < 50 ? 2 : xp < 100 ? 3 : 4;
      cells.push(`<i class="hm-${lv}" title="${d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}: ${xp} XP"></i>`);
    }
    return { html: `<div class="hm" style="--weeks:${Math.ceil(cells.length / 7)}">${cells.join("")}</div>`, total, activeDays };
  }
  function ring(value, max) {
    const r = 34, c = 2 * Math.PI * r, k = Math.min(1, value / max);
    return `<svg class="ring" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="${r}" class="ring-bg"/><circle cx="40" cy="40" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - k)}"/></svg>`;
  }
  function renderDashboard() {
    renderSide("panel"); renderBar(); renderCrumbs([{ t: "Panel" }]);
    const nt = nextTarget(), name = prefs().name;
    const todayXp = S.state.daily[S.day()] || 0, goal = prefs().goal;
    const hm = heatmap(), due = KD.srs.due(ALL_CARDS).length, st = S.state.streak;
    const s = computeStats();
    const cont = nt
      ? `<a class="continue" href="#${nt.p.id}/${nt.step}${nt.step === "kodla" && nt.ch ? "/" + nt.ch.id : ""}">
          <span class="continue-meta">${esc(T(trackOf(nt.p)).title)} · Ders ${nt.p.no}</span>
          <span class="continue-title">${esc(nt.p.title)}</span>
          <span class="continue-next">${nt.step === "kodla" && nt.ch ? "Sıradaki görev: " + esc(nt.ch.title) : "Sıradaki adım: " + STEPS.find((x) => x[0] === nt.step)[1]}</span>
          <span class="btn primary">Devam et</span>
        </a>`
      : `<div class="continue done"><span class="continue-title">Tüm açık dersleri bitirdin.</span><span class="continue-next">Tekrar ve karma antrenmanla kalıcı hale getir.</span></div>`;
    view.innerHTML = `
      <div class="dash">
        <header class="dash-head">
          <h1>${greeting()}${name ? ", " + esc(name) : ""}.</h1>
          <p class="lead">${todayXp >= goal ? "Bugünkü hedefini tamamladın. Bir tekrar turu öğrendiklerini kalıcı yapar." : todayXp ? `Bugün ${todayXp} XP topladın; hedefe ${goal - todayXp} XP kaldı.` : "Bugün henüz başlamadın. Kısa bir görev bile seriyi korur."}</p>
        </header>

        <section class="dash-grid">
          <div class="tile tile-continue">${cont}</div>

          <div class="tile tile-goal">
            <h2 class="tile-h">Bugünkü hedef</h2>
            <div class="goal-wrap">${ring(todayXp, goal)}<div class="goal-num"><b data-count="${todayXp}">${todayXp}</b><span>/ ${goal} XP</span></div></div>
            <button class="link" data-act="settings">Hedefi değiştir</button>
          </div>

          <div class="tile tile-review">
            <h2 class="tile-h">Tekrar</h2>
            <p class="big" data-count="${due}">${due}</p>
            <p class="muted">${due ? "kart seni bekliyor. Unutmak üzere olduğun şeyler bunlar." : "Bugün bekleyen kart yok."}</p>
            ${due ? `<a class="btn" href="#tekrar">Tekrara başla</a>` : `<a class="btn" href="#karma">Karma antrenman yap</a>`}
          </div>

          <div class="tile tile-focus">
            <h2 class="tile-h">Odak</h2>
            ${(() => {
              const w = weakSkills(2);
              if (LANG === "js" && !placed("js") && !trackComplete("js") && (S.state.prefs.level === "js" || trackProgress("js").passed < 3)) return `<p>JavaScript'i biliyor musun? Seviye sınavıyla temel parkuru atlayıp diğer parkurlara geçebilirsin.</p><a class="btn" href="#seviye">Seviye sınavına gir</a>`;
              if (w.length) return `<p class="muted small">Beceri tahminine göre en çok tekrara ihtiyaç duyan konular:</p><ul class="weak">${w.map((p) => `<li><a href="#${p.id}/kodla"><b>Ders ${p.no}: ${esc(p.short)}</b><span class="muted small">%${Math.round(KD.bkt.get(p.id) * 100)}</span></a></li>`).join("")}</ul><a class="btn" href="#icgoruler">Tüm içgörüler</a>`;
              return `<p class="muted">Görev çözdükçe ve kart tekrar ettikçe burada zayıf becerilerin görünecek.</p><a class="btn" href="#icgoruler">İçgörüler</a>`;
            })()}
          </div>

          <div class="tile tile-activity">
            <div class="tile-row">
              <h2 class="tile-h">Etkinlik</h2>
              <p class="muted small">Son 6 ay: ${hm.activeDays} aktif gün, ${hm.total.toLocaleString("tr-TR")} XP</p>
            </div>
            ${hm.html}
            <div class="streaks">
              <span>${I.flame} Seri: <b>${st.count} gün</b></span>
              <span>En uzun: <b>${st.best || 0} gün</b></span>
              <span class="hm-legend" aria-hidden="true">Az <i class="hm-0"></i><i class="hm-1"></i><i class="hm-2"></i><i class="hm-3"></i><i class="hm-4"></i> Çok</span>
            </div>
          </div>

          <div class="tile tile-tracks">
            <h2 class="tile-h">Parkurlar</h2>
            <ul class="track-list">${TRACKS.map((t) => {
              const pr = trackProgress(t.id), open = trackUnlocked(t.id), first = phasesOf(t.id)[0];
              return `<li class="${open ? "" : "locked"}">
                <div class="tl-main">
                  <a class="tl-title" href="#${open ? first.id : ""}" ${open ? "" : 'aria-disabled="true"'}>${esc(t.title)}</a>
                  <p class="muted small">${open ? esc(t.desc) : esc(T(t.req).title) + " parkurunu bitirince açılır."}</p>
                </div>
                <div class="tl-prog"><div class="meter"><i style="width:${pr.ratio * 100}%"></i></div><span>${pr.passed}/${pr.total} görev</span></div>
              </li>`;
            }).join("")}</ul>
          </div>

          <div class="tile tile-badges">
            <div class="tile-row"><h2 class="tile-h">Rozetler</h2><p class="muted small">${Object.keys(S.state.badges).length}/${BADGES.length}</p></div>
            <ul class="badges">${BADGES.map((b) => {
              const on = !!S.state.badges[b.id];
              return `<li class="${on ? "on" : ""}" title="${esc(b.d)}"><span class="bd-ico">${on ? I.award : I.lock}</span><span class="bd-t">${esc(b.t)}</span><span class="bd-d">${esc(b.d)}</span></li>`;
            }).join("")}</ul>
            <p class="muted small">${s.passed} görev geçtin · ${s.hintless} tanesi ipucusuz · ${s.reviews} kart tekrarı</p>
          </div>
        </section>
      </div>`;
    $$("[data-act=settings]", view).forEach((b) => (b.onclick = () => openSettings("plan")));
  }

  /* ---------- Ders görünümü ---------- */
  function renderPhase(p, step, chId) {
    renderSide(p.id); renderBar();
    const t = T(trackOf(p));
    renderCrumbs([{ t: "Panel", h: "#panel" }, { t: t.short, h: "#" + phasesOf(t.id)[0].id }, { t: `Ders ${p.no}: ${p.short}` }]);
    const ph = S.phase(p.id), m = mastery(p);
    const done = { tahmin: ph.predict !== null, incele: ph.viewed, alistir: !!ph.drill, kodla: m === 1, hatirla: p.cards.every((c) => S.state.cards[c.id]?.reps > 0) };
    const list = phasesOf(t.id), nextP = list[list.indexOf(p) + 1];
    view.innerHTML = `
      <header class="ph-head ${step === "kodla" || step === "alistir" || (KAMLI && step === "incele") ? "compact" : ""}">
        <div class="ph-title">
          <p class="ph-label">Ders ${p.no} <span>${esc(t.title)}</span></p>
          <h1>${esc(p.title)}</h1>
          <p class="lead">${esc(p.goal)}</p>
          <ul class="concepts">${p.concepts.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        </div>
        <div class="mastery" title="Ustalık: geçilen görev oranı">
          <div class="mastery-top"><span>Ustalık</span><b>${Math.round(m * 100)}%</b></div>
          <div class="meter tall"><i style="width:${m * 100}%"></i><em style="left:${UNLOCK * 100}%" title="Sonraki dersi açan eşik"></em></div>
          ${skillPct(p) != null ? `<div class="mastery-top skill" title="Bayesçi bilgi takibi: testler, tahminler ve kartlardan hesaplanan hâkimiyet olasılığı"><span>Beceri tahmini</span><b>${skillPct(p)}%</b></div>` : ""}
          <p class="small muted" id="mastery-note">${m >= UNLOCK ? (nextP ? "Sonraki ders açık." : "Bu parkurun son dersi.") : "3 görevden 2'sini geçince sonraki ders açılır."}</p>
        </div>
      </header>
      <nav class="steps" aria-label="Ders adımları">
        ${STEPS.map(([k, label], i) => `<a href="#${p.id}/${k}" class="step ${k === step ? "on" : ""} ${done[k] ? "done" : ""}" ${k === step ? 'aria-current="step"' : ""}><span class="step-n">${done[k] ? I.check : i + 1}</span><span class="step-l">${label}</span></a>`).join("")}
      </nav>
      <section class="stage" id="stage"></section>`;
    const stage = $("#stage");
    ({ tahmin: stepPredict, incele: stepExample, alistir: (pp, st) => window.KD_ALISTIR.baslat(pp, st, { bitince: () => renderSide(pp.id) }), kodla: stepCode, hatirla: stepRecall })[step](p, stage, chId);
    view.focus({ preventScroll: true });
  }

  /* 1 — Tahmin et */
  function stepPredict(p, stage) {
    const ph = S.phase(p.id), q = p.predict;
    stage.innerHTML = `
      <div class="panel narrow">
        <h2>Bu kod ne yapar?</h2>
        <p class="muted">Konuyu görmeden önce tahmin et. Yanlış tahmin de işe yarar: beynin cevabı aramaya başlar ve açıklama daha kalıcı olur.</p>
        ${codeBlock(q.code, "", hlLang(q.lang))}
        <div class="options" role="group" aria-label="Seçenekler">${q.options.map((o, i) => `<button class="opt" data-i="${i}"><kbd>${"ABCD"[i]}</kbd><span>${esc(o)}</span></button>`).join("")}</div>
        <div id="pfb"></div>
      </div>`;
    const show = (pick) => {
      $$(".opt", stage).forEach((b, i) => { b.disabled = true; b.classList.toggle("right", i === q.answer); b.classList.toggle("wrong", i === pick && pick !== q.answer); });
      const ok = pick === q.answer;
      $("#pfb").innerHTML = `
        <div class="feedback ${ok ? "good" : "learn"}">
          <b>${ok ? "Doğru tahmin." : "Doğru cevap işaretli."}</b>
          <p>${esc(q.why)}</p>
        </div>
        <div class="row">
          ${q.run === false ? "" : `<button class="btn" id="prun">${I.play} Çalıştır ve gör</button>`}
          <a class="btn primary" href="#${p.id}/incele">Çözümlü örneğe geç</a>
        </div>
        <div class="preview" id="pprev" hidden></div>
        <div class="console" id="pcon" hidden></div>`;
      if ($("#prun")) $("#prun").onclick = () => runSnippet(q, $("#pcon"), $("#pprev"));
    };
    $$(".opt", stage).forEach((b) => (b.onclick = () => {
      const pick = +b.dataset.i;
      if (ph.predict === null) { ph.predict = pick === q.answer; ph.predictPick = pick; KD.bkt.observe(p.id, pick === q.answer, 0.5); S.addXP(pick === q.answer ? 20 : 10); }
      show(pick);
    }));
    stage.onkeydown = (e) => { const i = "abcd".indexOf(e.key.toLowerCase()); if (i >= 0 && !e.metaKey && !e.ctrlKey && $$(".opt", stage)[i] && !$$(".opt", stage)[i].disabled) $$(".opt", stage)[i].click(); };
    if (ph.predict !== null) show(ph.predictPick ?? q.answer);
  }

  /* 2 — İncele */
  function stepExample(p, stage) {
    if (KAMLI && p.example && p.example.code) return window.KAM.ders(p, stage);
    const ex = p.example; let i = 0;
    stage.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h2>${esc(ex.title)}</h2><span class="muted small">${ex.steps.length} adım · ← → tuşlarıyla ilerle</span></div>
        <div class="walk">
          <div class="walk-code">${codeBlock(ex.code, "walk-pre", hlLang(ex.lang))}</div>
          <div class="walk-side">
            <ol class="walk-steps">${ex.steps.map((s, k) => `<li data-k="${k}"><button>${k + 1}</button></li>`).join("")}</ol>
            <p class="walk-text" id="wtext" aria-live="polite"></p>
            <div class="row">
              <button class="btn" id="wprev">Önceki</button>
              <button class="btn primary" id="wnext">Sonraki adım</button>
            </div>
            <label class="selfq" for="wself">Bu kodu bir arkadaşına tek cümleyle nasıl anlatırdın?
              <textarea id="wself" rows="2" placeholder="Kendi cümlelerinle yaz. Bunu kimse görmeyecek; amaç düşünmek."></textarea>
            </label>
          </div>
        </div>
        <div class="row end"><button class="btn" id="wrun">${I.play} Örneği çalıştır</button></div>
        <div class="preview" id="wprev-box" hidden></div>
        <div class="console" id="wcon" hidden></div>
      </div>`;
    const lines = $$(".walk-pre .ln", stage);
    const paint = () => {
      const s = ex.steps[i];
      lines.forEach((l) => { const on = s.lines.includes(+l.dataset.l); l.classList.toggle("hi", on); l.classList.toggle("dim", !on); });
      $$(".walk-steps li", stage).forEach((d, k) => { d.classList.toggle("on", k === i); d.classList.toggle("seen", k < i); });
      const t = $("#wtext"); t.classList.remove("swap"); void t.offsetWidth; t.classList.add("swap");
      t.textContent = s.text;
      $("#wprev").disabled = i === 0;
      $("#wnext").textContent = i === ex.steps.length - 1 ? "Kodlamaya geç" : "Sonraki adım";
      const first = lines.find((l) => l.classList.contains("hi"));
      if (first && first.scrollIntoView && window.innerWidth > 1100) first.scrollIntoView({ block: "nearest" });
    };
    const next = () => {
      if (i < ex.steps.length - 1) { i++; paint(); return; }
      const ph = S.phase(p.id);
      if (!ph.viewed) { ph.viewed = true; S.addXP(10); }
      location.hash = `#${p.id}/alistir`;
    };
    $("#wprev").onclick = () => { if (i > 0) { i--; paint(); } };
    $("#wnext").onclick = next;
    $$(".walk-steps li", stage).forEach((d) => ($("button", d).onclick = () => { i = +d.dataset.k; paint(); }));
    stage.onkeydown = (e) => {
      if (e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); i--; paint(); }
    };
    stage.tabIndex = -1; stage.focus({ preventScroll: true });
    $("#wrun").onclick = () => runSnippet(ex, $("#wcon"), $("#wprev-box"));
    paint();
  }

  /* 3 — Kodla */
  function stepCode(p, stage, chId) {
    const ph = S.phase(p.id);
    const ch = p.challenges.find((c) => c.id === chId) || p.challenges.find((c) => !ph.passed[c.id]) || p.challenges[0];
    stage.innerHTML = `
      <nav class="tasks" aria-label="Görevler">${p.challenges.map((c, i) => `<a href="#${p.id}/kodla/${c.id}" class="task ${c.id === ch.id ? "on" : ""} ${ph.passed[c.id] ? "ok" : ""}" ${c.id === ch.id ? 'aria-current="page"' : ""}>
        <span class="task-n">${ph.passed[c.id] ? I.check : i + 1}</span><span class="task-t"><small>${c.kind}</small>${esc(c.title)}</span></a>`).join("")}</nav>
      <div id="ide-host"></div>`;
    mountIDE($("#ide-host"), Object.assign({ phase: p }, ch), "phase");
  }

  function mountIDE(host, ch, mode) {
    const p = ch.phase, ph = S.phase(p.id);
    ph.solSeen = ph.solSeen || {};
    const saved = mode === "phase" ? S.state.code[ch.id] : null;
    const idx = p.challenges.findIndex((c) => c.id === ch.id);
    const next = p.challenges[idx + 1];
    let last = null;
    let attempts = mode === "phase" ? (ph.attempts[ch.id] || 0) : 0;
    let hintLv = mode === "phase" ? (ph.hintsUsed[ch.id] || 0) : 0;
    const web = isWeb(ch);
    const isSql = ch.lang === "sql", isC = ch.lang === "c", isPy = ch.lang === "py";
    const fileName = ch.lang === "html" ? "index.html" : ch.lang === "css" ? "style.css" : ch.lang === "js" ? "app.js" : ch.lang === "jsx" ? "App.jsx" : isSql ? "sorgu.sql" : isC ? "main.c" : isPy ? "main.py" : ch.fn + ".js";
    const cmMode = ch.lang === "html" ? "htmlmixed" : ch.lang === "css" ? "css" : ch.lang === "jsx" ? "jsx" : isSql ? "text/x-sqlite" : isC ? "text/x-csrc" : isPy ? "python" : "javascript";
    const execute = (code, tests) => web
      ? KD.runWeb({ lang: ch.lang, code, scaffold: ch.scaffold, tests, host: $("#out-prev", host) })
      : isC
        ? KD.runC(code, { mode: ch.mode || "fn", tests })
      : isPy
        ? KD.runPy(code, { mode: ch.mode || "fn", tests, stdin: !tests && ch.mode === "stdout" ? ((ch.tests.find((t) => t.stdin) || {}).stdin || "") : "" })
      : isSql
        ? KD.run(code, { mode: "sql", setup: ch.setup, tests, timeout: ch.timeout || 15000 })
        : KD.run(code, tests ? { fn: ch.fn, tests, timeout: ch.timeout, db: ch.db } : { timeout: ch.timeout, wait: 300, db: ch.db });
    let conf = null;
    const ornek = mode === "phase" ? (window.KD_ORNEKLER || {})[ch.id] || null : null;
    const ornekDil = ornek ? ornek.lang || (isC ? "c" : isPy ? "py" : isSql ? "sql" : "js") : null;
    ph.ornekSeen = ph.ornekSeen || {};
    const kindCls = ch.kind === "Hata Ayıkla" ? "bug" : ch.kind === "Değiştir" ? "mod" : "make";
    const testLabel = (t) => t.label || ch.fn + "(" + (t.args || []).map((a) => JSON.stringify(a)).join(", ") + ")";
    const testExpect = (t) => ("throws" in t ? "hata: " + t.throws : t.maxMs ? JSON.stringify(t.expected) + " · en fazla " + t.maxMs + " ms" : JSON.stringify(t.expected));

    host.innerHTML = `
      <div class="ws ${ornek ? "" : "ws-orneksiz"}">
        <aside class="ws-left" aria-label="Görev paneli">
          <div class="ws-tabs" role="tablist" aria-label="Çalışma adımları">
            ${ornek ? `<button role="tab" data-p="ornek"><span class="ws-n">1</span><span><b>Örnek</b><small>Benzeri çözülmüş</small></span></button>` : ""}
            <button role="tab" data-p="gorev"><span class="ws-n">${ornek ? 2 : 1}</span><span><b>Görev</b><small>${ch.tests.length} test</small></span></button>
            <button role="tab" data-p="mentor"><span class="ws-n">${ornek ? 3 : 2}</span><span><b>${MENTOR_AD}</b><small>İpucu al</small></span><i class="ws-dot" hidden></i></button>
          </div>
          ${ornek ? `<div class="ws-pane" id="pane-ornek" role="tabpanel" hidden>
            <section class="brief ornek">
              <p class="ornek-k">Çözümlü örnek</p>
              <h2>${esc(ornek.t)}</h2>
              <p class="muted small">Bu örnek, görevde kullanacağın tekniği <b>başka bir problemde</b> çözülmüş olarak gösterir. Oku, çalıştır, sonra kapatıp görevi kendin yaz.</p>
              ${codeBlock(ornek.c, "ornek-kod", hlLang(ornekDil))}
              <div class="row"><button class="btn sm" id="b-ornek-run">${I.play} Örneği çalıştır</button></div>
              <div class="ornek-prev" id="ornek-prev" hidden></div>
              <div class="out-body console ornek-con" id="ornek-con" hidden></div>
              <div class="ornek-not"><b>Göreve taşı</b><p>${md(ornek.n)}</p></div>
              <button class="btn primary blok" id="b-ornek-gec">Anladım, göreve geç →</button>
            </section>
          </div>` : ""}
          <div class="ws-pane" id="pane-gorev" role="tabpanel" hidden>
          <section class="brief">
            <div class="brief-top">
              <span class="kind kind-${kindCls}">${ch.kind}</span>
              ${mode === "mix" ? `<span class="kind">Ders ${p.no}: ${esc(p.short)}</span>` : ""}
              <h2>${esc(ch.title)}</h2>
            </div>
            <p class="brief-text">${md(ch.prompt)}</p>
            <h3 class="sub">Testler</h3>
            <ul class="tests" id="tests">${ch.tests.map((t) => `<li><span class="t-ico" aria-hidden="true"></span><code>${esc(testLabel(t))}</code><span class="t-exp">${esc(testExpect(t))}</span></li>`).join("")}</ul>
            ${ch.schema ? `<details class="scaffold" open><summary>Veritabanı şeması</summary><pre class="schema">${esc(ch.schema)}</pre></details>` : ""}
            ${isC ? `<p class="muted small db-note">${ch.mode === "stdout" ? "Bu görevde <code>main</code> yazıyorsun; testler programı farklı girdilerle çalıştırıp çıktısını karşılaştırır." : "Bu görevde <code>main</code> yazma; testler fonksiyonlarını kendi <code>main</code>'leriyle çağırır."} Kod gerçek clang ile, bellek ve tanımsız davranış denetimi açık derlenir.</p>` : ""}
            ${isPy ? `<p class="muted small db-note">${ch.mode === "stdout" ? "Bu görevde bütün bir program yazıyorsun; testler onu farklı girdilerle (<code>input()</code>) çalıştırıp çıktısını karşılaştırır. Çalıştır, ilk testin girdisini kullanır." : "Testler fonksiyonlarını kendileri çağırır; <code>input()</code> kullanma, değeri <code>return</code> et."} Python tarayıcında WebAssembly üzerinde çalışır.</p>` : ""}
            ${ch.db ? `<p class="muted small db-note">Bu görevde <code>sorgu(sql, params)</code> ve <code>calistir(sql, params)</code> gerçek bir SQLite veritabanına bağlı.</p>` : ""}
            ${ch.scaffold ? `<details class="scaffold"><summary>Sayfanın HTML'i (değiştirilemez, kodun buna uygulanır)</summary>${codeBlock(ch.scaffold, "mini", "html")}</details>` : ""}
          </section>
          </div>
          <div class="ws-pane" id="pane-mentor" role="tabpanel" hidden><div class="mentor">
          <div class="m-head">${KAM_VAR ? '<span class="kam-av" aria-hidden="true"><b></b><b></b></span>' : '<span class="m-av" aria-hidden="true">M</span>'}<div><b>${MENTOR_AD}</b><small id="m-mode">${aiOn ? "Yapay zekâ, Sokratik mod" : "Yerel ipucu motoru"}</small></div></div>
          <div class="m-feed" id="feed" aria-live="polite"></div>
          <div class="m-actions">
            <button class="btn sm" id="b-hint" ${mode === "placement" ? "hidden" : ""}>İpucu al (${Math.min(hintLv + 1, ch.hints.length)}/${ch.hints.length})</button>
            <button class="btn sm danger" id="b-sol" ${attempts >= 3 ? "" : "hidden"}>Çözümü göster</button>
          </div>
          <form class="m-ask" id="ask"><label class="sr" for="ask-in">Mentora soru sor</label><input id="ask-in" placeholder="Örn: neden NaN çıkıyor?" autocomplete="off" /><button class="btn primary sm" aria-label="Gönder">Sor</button></form>
</div></div>
        </aside>
        <div class="ws-right">
          <section class="editor" aria-label="Kod editörü">
            <div class="ed-bar"><span class="file">${fileName}</span><span class="kbd-hint"><kbd>${isMac ? "⌘" : "Ctrl"}</kbd><kbd>Enter</kbd> testleri çalıştırır</span></div>
            <div class="ed-host" id="ed"></div>
            <div class="ed-actions">
              <button class="btn ghost" id="b-reset" title="Başlangıç koduna dön">${I.reset} Sıfırla</button>
              ${mode === "placement" ? "" : `<div class="conf" role="radiogroup" aria-label="Testler geçecek mi, ne kadar eminsin?"><span class="conf-l">Geçer mi?</span>${[[0.3, "Emin değilim"], [0.6, "Sanırım"], [0.9, "Eminim"]].map(([v, l]) => `<button type="button" role="radio" aria-checked="false" data-c="${v}">${l}</button>`).join("")}</div>`}
              <span class="spacer"></span>
              <button class="btn" id="b-run">${I.play} Çalıştır</button>
              <button class="btn primary" id="b-test">Testleri çalıştır</button>
            </div>
          </section>
          <section class="out" aria-label="Çıktı">
            <div class="out-tabs" role="tablist">${web ? '<button role="tab" data-t="prev">Önizleme</button>' : ""}<button role="tab" class="on" data-t="res">Test sonuçları</button><button role="tab" data-t="con">Konsol</button></div>
            ${web ? '<div class="out-body preview" id="out-prev" hidden></div>' : ""}
            <div class="out-body" id="out-res"><p class="empty-line">Henüz test çalıştırmadın. Kodunu yaz, sonra <b>Testleri çalıştır</b>'a bas.</p></div>
            <div class="out-body console" id="out-con" hidden><div class="log muted">console.log çıktıları burada görünür.</div></div>
          </section>
          <div id="after"></div>
        </div>
      </div>`;

    const feed = $("#feed", host);
    let aktifPane = null;
    const pane = (ad) => {
      aktifPane = ad;
      $$(".ws-tabs [data-p]", host).forEach((b) => { const on = b.dataset.p === ad; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
      $$(".ws-pane", host).forEach((el) => (el.hidden = el.id !== "pane-" + ad));
      if (ad === "mentor") { $(".ws-dot", host).hidden = true; feed.scrollTop = feed.scrollHeight; }
    };
    $$(".ws-tabs [data-p]", host).forEach((b) => (b.onclick = () => pane(b.dataset.p)));
    const say = (html, who = "m") => { const d = document.createElement("div"); d.className = "msg " + who; d.innerHTML = html; feed.appendChild(d); feed.scrollTop = feed.scrollHeight; if (aktifPane && aktifPane !== "mentor") $(".ws-dot", host).hidden = false; return d; };
    if (ornek) {
      $("#b-ornek-run", host).onclick = () => runSnippet({ lang: ornekDil, code: ornek.c, setup: ch.setup, db: ch.db, stdin: ornek.stdin }, $("#ornek-con", host), $("#ornek-prev", host));
      $("#b-ornek-gec", host).onclick = () => { ph.ornekSeen[ch.id] = true; S.save(); pane("gorev"); ed.focus && ed.focus(); };
    }
    say(mode === "placement"
      ? "Seviye sınavındasın: ipucu ve çözüm kapalı. Testleri istediğin kadar çalıştırabilirsin. Emin değilsen soruyu atlayabilirsin."
      : mode === "mix"
      ? "Bu görevi daha önce çözdün. Şimdi <b>hafızandan, sıfırdan</b> yaz. Konuların karışık gelmesi, hangi aracı ne zaman kullanacağını seçme becerini geliştirir."
      : "Cevabı vermem; seni cevaba götürecek soruyu sorarım. Önce kendin dene. Testleri çalıştırdığında hatanı birlikte inceleriz.");
    for (let k = 0; k < hintLv; k++) say(`<span class="lvl">İpucu ${k + 1}</span>${md(ch.hints[k])}`);
    pane(ornek && !ph.passed[ch.id] && !attempts && !ph.ornekSeen[ch.id] && !saved ? "ornek" : "gorev");

    let liveT = null;
    const ed = makeEditor($("#ed", host), saved || ch.starter, (v) => {
      if (mode === "phase") { S.state.code[ch.id] = v; S.save(); }
      if (web && ch.lang !== "js" && ch.lang !== "jsx") { clearTimeout(liveT); liveT = setTimeout(() => { if (!$("#out-prev", host).hidden) execute(ed.get()); }, 500); }
    }, () => runTests(), cmMode);

    $$(".out-tabs button", host).forEach((b) => (b.onclick = () => {
      $$(".out-tabs button", host).forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
      $$(".out > .out-body", host).forEach((el) => (el.hidden = el.id !== "out-" + b.dataset.t));
    }));
    const tab = (t) => host.querySelector(`.out-tabs [data-t="${t}"]`).click();
    if (web) { tab("prev"); execute(ed.get()); }

    $$(".conf button", host).forEach((b) => (b.onclick = () => {
      conf = conf === +b.dataset.c ? null : +b.dataset.c;
      $$(".conf button", host).forEach((x) => x.setAttribute("aria-checked", +x.dataset.c === conf));
    }));
    $("#b-reset", host).onclick = () => { if (confirm("Kodun başlangıç haline dönsün mü? Yazdıkların silinir.")) ed.set(ch.starter); };
    $("#b-run", host).onclick = async () => {
      const c = $("#out-con", host); c.innerHTML = '<div class="log muted">Çalışıyor…</div>';
      if (web) tab("prev"); else tab("con");
      const res = await execute(ed.get());
      if (isC && res.compileError) { c.innerHTML = `<pre class="cc-out">${esc(res.compileOutput)}</pre>`; if (res.line) ed.mark(res.line); return; }
      c.innerHTML = isSql && !res.error ? tableHTML(res.table) || '<div class="log muted">Komut çalıştı; döndürülen satır yok.</div>' : consoleHTML(res);
      if (web && (res.logs.length || res.error)) host.querySelector('.out-tabs [data-t="con"]').classList.add("has");
      if (res.line) ed.mark(res.line);
    };
    $("#b-test", host).onclick = () => runTests();

    async function runTests() {
      const btn = $("#b-test", host); btn.disabled = true; btn.textContent = "Test ediliyor…";
      $("#tests", host).classList.add("running");
      const res = await execute(ed.get(), ch.tests);
      btn.disabled = false; btn.textContent = "Testleri çalıştır";
      $("#tests", host).classList.remove("running");
      last = res; attempts++;
      if (mode === "phase") { ph.attempts[ch.id] = attempts; S.save(); }
      $("#out-con", host).innerHTML = isSql && res.table ? tableHTML(res.table) : consoleHTML(res);
      const rs = res.results || [];
      const lis = $$("#tests li", host);
      lis.forEach((li, k) => { const r = rs[k]; li.style.setProperty("--i", k); li.className = r ? (r.pass ? "pass flip" : "fail flip") : ""; li.querySelector(".t-ico").innerHTML = r ? (r.pass ? I.check : I.x) : ""; });
      const passN = rs.filter((r) => r.pass).length;
      $("#out-res", host).innerHTML = res.error && !rs.length
        ? `<div class="res-head fail">Kod çalışmadı</div><div class="log error">${esc(res.error)}</div>`
        : `<div class="res-head ${passN === rs.length ? "pass" : "fail"}">${passN === rs.length ? "Tüm testler geçti" : `${passN}/${rs.length} test geçti`}</div>` +
          rs.map((r, i) => `<div class="tr ${r.pass ? "pass" : "fail"}" style="--i:${i}"><span class="tr-ico">${r.pass ? I.check : I.x}</span><code>${esc(r.label)}</code>${r.pass ? `<span class="tr-got">${esc(r.got)}${r.ms != null ? ` · ${r.ms} ms` : ""}</span>` : `<span class="tr-diff"><span>Beklenen <em>${esc(r.expected)}</em></span><span>Gelen <em class="bad">${esc(r.got)}</em></span></span>`}</div>`).join("");
      tab("res");
      const line = res.line || (rs.find((r) => r.line) || {}).line;
      if (line) ed.mark(line);
      if (isC && res.compileError) $("#out-res", host).innerHTML = `<div class="res-head fail">Derlenemedi</div><pre class="cc-out">${esc(res.compileOutput || res.error)}</pre>`;
      const pass = !res.error && rs.length && rs.every((r) => r.pass);
      if (conf != null) { KD.calib.record(conf, pass); conf = null; $$(".conf button", host).forEach((x) => x.setAttribute("aria-checked", "false")); }
      if (mode !== "placement") KD.bkt.observe(p.id, !!pass, ph.solSeen[ch.id] || hintLv >= 2 ? 0.4 : hintLv === 1 ? 0.7 : 1);
      if (mode === "placement") { if (pass) return placementPass(ch); return; }
      if (pass) return onPass();
      KD.tutor.diagnose(res, ch).forEach((t) => say(md(t), "m diag"));
      pane("mentor");
      if (attempts >= 3) $("#b-sol", host).hidden = false;
      if (attempts === 3) say("Üç deneme oldu; bu normal. Bir ipucu daha alabilir ya da çözümü inceleyebilirsin. Çözümü görürsen bu görev karma antrenmanda tekrar karşına çıkar.");
    }

    function onPass() {
      celebrate(host.querySelector(".out"));
      if (mode === "mix") {
        S.state.mix = (S.state.mix || 0) + 1; ph.solSeen[ch.id] = false; S.addXP(30);
        say("<b>Hafızandan yeniden yazdın.</b> Kalıcı öğrenme budur: bilgiyi ihtiyaç anında çağırabilmek.", "m good");
        $("#after", host).innerHTML = `<div class="row end"><a class="btn primary" href="#karma/${Date.now()}">Sonraki karma görev</a></div>`;
        return;
      }
      const first = !ph.passed[ch.id];
      if (first) {
        const nextPhase = phasesOf(trackOf(p))[phasesOf(trackOf(p)).indexOf(p) + 1];
        const wasLocked = nextPhase && !unlocked(nextPhase);
        ph.passed[ch.id] = true;
        const clean = hintLv === 0 && !ph.solSeen[ch.id];
        if (clean) S.state.stats.hintless++;
        const gain = ph.solSeen[ch.id] ? 10 : 50 + (clean ? 20 : 0) + (attempts === 1 ? 10 : 0);
        S.addXP(gain);
        if (wasLocked && unlocked(nextPhase)) setTimeout(() => toast(`<b>Ders ${nextPhase.no} açıldı:</b> ${esc(nextPhase.title)}`, "unlock"), 1200);
        KD.srs.enroll(p.cards.map((c) => c.id));
      }
      say(hintLv === 0 && !ph.solSeen[ch.id] ? "<b>İpucu almadan çözdün.</b> Son bir adım: çözümünün neden çalıştığını aşağıya kendi cümlelerinle yaz." : "<b>Tüm testler geçti.</b> Pekiştirmek için çözümünü kendi cümlelerinle açıkla.", "m good");
      renderSide(p.id); renderBar();
      const mm = mastery(p), mb = $(".ph-head .mastery");
      if (mb) {
        mb.querySelector("b").textContent = Math.round(mm * 100) + "%";
        mb.querySelector(".meter i").style.width = mm * 100 + "%";
        if (mm >= UNLOCK) $("#mastery-note").textContent = "Sonraki ders açık.";
      }
      const old = ph.explain[ch.id] || "";
      $("#after", host).innerHTML = `
        <section class="explain">
          <label for="ex-in"><b>Kendini açıkla.</b> Bu kod neden çalışıyor, hangi kavramı kullandın? <span class="muted">En az 30 karakter, +15 XP.</span></label>
          <textarea id="ex-in" rows="3" placeholder="Örn: Döngü 1'den n'e kadar dönüyor ve her turda toplamı artırıyor…">${esc(old)}</textarea>
          <div class="row end">
            <button class="btn" id="ex-save">Açıklamayı kaydet</button>
            ${next ? `<a class="btn primary" href="#${p.id}/kodla/${next.id}">Sonraki görev: ${esc(next.title)}</a>` : `<a class="btn primary" href="#${p.id}/hatirla">Hatırla adımına geç</a>`}
          </div>
        </section>`;
      $("#ex-save", host).onclick = () => {
        const v = $("#ex-in", host).value.trim();
        if (v.length < 30) return toast("Açıklama kısa kaldı. En az 30 karakter yaz.", "warn");
        const firstEx = !ph.explain[ch.id]; ph.explain[ch.id] = v; S.save();
        if (firstEx) S.addXP(15); else toast("Açıklama kaydedildi.");
      };
      const tk = $(`.task[href$="/${ch.id}"]`);
      if (tk) { tk.classList.add("ok"); tk.querySelector(".task-n").innerHTML = I.check; }
    }

    $("#b-hint", host).onclick = () => {
      if (hintLv >= ch.hints.length) return say("Tüm ipuçlarını gördün. Kodunu console.log ile adım adım izle ya da çözümü incele.");
      say(`<span class="lvl">İpucu ${hintLv + 1}</span>${md(ch.hints[hintLv])}`);
      hintLv++;
      if (mode === "phase") { ph.hintsUsed[ch.id] = hintLv; S.save(); }
      $("#b-hint", host).textContent = hintLv >= ch.hints.length ? "İpuçları bitti" : `İpucu al (${hintLv + 1}/${ch.hints.length})`;
    };
    $("#b-sol", host).onclick = () => {
      if (!confirm("Çözümü görmek istiyor musun? Bu görev daha sonra karma antrenmanda tekrar sorulacak.")) return;
      ph.solSeen[ch.id] = true; S.save();
      say(`<span class="lvl">Çözüm</span>${codeBlock(ch.solution, "mini", hlLang(ch.lang))}<p>Satır satır oku, sonra kapatıp <b>kendin yeniden yaz</b>. Okumak değil, yazmak öğretir.</p>`);
    };
    $("#ask", host).onsubmit = async (e) => {
      e.preventDefault();
      const inp = $("#ask-in", host), q = inp.value.trim();
      if (!q) return;
      inp.value = ""; say(esc(q), "u");
      if (aiOn) {
        const w = say('<span class="typing"><i></i><i></i><i></i></span>');
        try {
          const reply = await KD.tutor.ask({ lang: isC ? "c" : isPy ? "py" : "js", challenge: { title: ch.title, prompt: ch.prompt }, code: ed.get(), results: last && last.results, error: last && last.error, question: q });
          w.innerHTML = md(reply).replace(/\n/g, "<br>");
        } catch (err) { w.innerHTML = esc(err.message) + " Yerel ipucu motoruna geçildi."; localAnswer(); }
      } else localAnswer();
    };
    function localAnswer() {
      if (!last) return say("Önce testleri çalıştır. Sonucu görmeden hatayı teşhis edemem.");
      const d = KD.tutor.diagnose(last, ch);
      if (d.length) d.forEach((t) => say(md(t), "m diag"));
      else say("Testlerin geçiyor. Çözümünü kendi cümlelerinle açıklamayı unutma.");
      if (hintLv < ch.hints.length) say("Daha fazla yön istersen <b>İpucu al</b>'a bas.");
    }
  }

  /* 4 — Hatırla */
  function stepRecall(p, stage) {
    KD.srs.enroll(p.cards.map((c) => c.id));
    stage.innerHTML = `<div class="panel narrow"><h2>Bakmadan hatırla</h2><p class="muted">Cevabı önce hafızandan yaz, sonra kontrol et. Verdiğin puana göre kart, unutmak üzere olduğun gün tekrar gelir.</p><div id="fc"></div></div>`;
    flashcards($("#fc"), ALL_CARDS.filter((c) => c.phase === p), () => {
      const list = phasesOf(trackOf(p)), nx = list[list.indexOf(p) + 1];
      return nx && unlocked(nx) ? `<a class="btn primary" href="#${nx.id}">Ders ${nx.no}: ${esc(nx.title)}</a>` : !nx ? `<a class="btn primary" href="#panel">Panele dön</a>` : `<a class="btn primary" href="#${p.id}/kodla">Görevlere dön</a>`;
    });
  }

  function flashcards(host, cards, endCta) {
    let i = 0; const tally = { 0: 0, 3: 0, 4: 0, 5: 0 };
    const show = () => {
      if (i >= cards.length) {
        host.innerHTML = `<div class="fc-done"><p class="big">${cards.length} kart</p><p>Unuttum ${tally[0]}, zor ${tally[3]}, iyi ${tally[4]}, kolay ${tally[5]}.</p><p class="muted">Unuttuğun kartlar 10 dakika sonra tekrar gelecek. Her kartın bir sonraki tarihi, onu hatırlama olasılığın %90'a düştüğü gün olarak FSRS ile hesaplanır.</p><div class="row">${endCta ? endCta() : ""}</div></div>`;
        renderBar(); renderSide(location.hash.slice(1).split("/")[0]); return;
      }
      const c = cards[i];
      host.innerHTML = `
        <div class="fc">
          <div class="fc-meta"><span>${i + 1} / ${cards.length}</span><span>Ders ${c.phase.no}: ${esc(c.phase.short)}</span></div>
          <div class="meter thin"><i style="width:${(i / cards.length) * 100}%"></i></div>
          <h3 class="fc-q">${md(c.q)}</h3>
          <label class="sr" for="fc-try">Cevabın</label>
          <textarea class="fc-try" id="fc-try" rows="2" placeholder="Hafızandan yaz…"></textarea>
          <button class="btn primary" id="fc-rev">Cevabı göster</button>
          <div class="fc-a" id="fc-a" hidden>
            <div class="fc-ans">${md(c.a)}</div>
            <p class="muted">Ne kadar iyi hatırladın? <span class="small">(1–4 tuşları)</span></p>
            <div class="rates">
              ${(() => { const pv = KD.srs.preview(c.id); return [[0, "Unuttum", "r0"], [3, "Zor", "r3"], [4, "İyi", "r4"], [5, "Kolay", "r5"]].map(([q, l, cl]) => `<button data-q="${q}" class="${cl}">${l}<small>${pv[q]} sonra</small></button>`).join(""); })()}
            </div>
          </div>
        </div>`;
      $("#fc-try", host).focus();
      const reveal = () => { const a = $("#fc-a", host); a.hidden = false; a.classList.add("flip-in"); $("#fc-rev", host).hidden = true; $(".fc", host).classList.add("revealed"); $(".rates button", host).focus(); };
      $("#fc-rev", host).onclick = reveal;
      $("#fc-try", host).onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); reveal(); } };
      const rate = (q) => { tally[q]++; KD.srs.review(c.id, q); KD.bkt.observe(c.phase.id, q >= 3, 0.6); S.state.stats.reviews++; S.addXP(5); i++; show(); };
      $$(".rates button", host).forEach((b) => (b.onclick = () => rate(+b.dataset.q)));
      host.onkeydown = (e) => { if ($("#fc-a", host) && !$("#fc-a", host).hidden && e.target.tagName !== "TEXTAREA") { const q = { 1: 0, 2: 3, 3: 4, 4: 5 }[e.key]; if (q != null) rate(q); } };
    };
    show();
  }

  /* ---------- Tekrar ---------- */
  function renderReview() {
    renderSide("tekrar"); renderBar(); renderCrumbs([{ t: "Panel", h: "#panel" }, { t: "Tekrar" }]);
    const due = KD.srs.due(ALL_CARDS);
    const enrolled = ALL_CARDS.filter((c) => S.state.cards[c.id]);
    view.innerHTML = `<header class="page-head"><h1>Günlük tekrar</h1><p class="lead">Unutma eğrisini kırmanın en etkili yolu: bir bilgiyi tam unutmak üzereyken hatırlamak.</p></header><section class="stage"><div class="panel narrow" id="rv"></div></section>`;
    const rv = $("#rv");
    if (!due.length) {
      const nextDue = enrolled.map((c) => S.state.cards[c.id].due).sort((a, b) => a - b)[0];
      rv.innerHTML = `<div class="empty"><h2>Şu an tekrar edilecek kart yok.</h2><p class="muted">${enrolled.length ? `Destende ${enrolled.length} kart var. Sıradaki kart ${new Date(nextDue).toLocaleString("tr-TR", { weekday: "long", hour: "2-digit", minute: "2-digit" })} zamanında gelecek.` : "Bir derste görev geçtiğinde o dersin kartları destene eklenir."}</p><div class="row"><a class="btn primary" href="#karma">Karma antrenman yap</a></div></div>`;
      return;
    }
    flashcards(rv, due.sort(() => Math.random() - 0.5), () => `<a class="btn primary" href="#panel">Panele dön</a>`);
  }

  /* ---------- Karma antrenman ---------- */
  function renderMix() {
    renderSide("karma"); renderBar(); renderCrumbs([{ t: "Panel", h: "#panel" }, { t: "Karma antrenman" }]);
    const pool = ALL_CH.filter((c) => S.phase(c.phase.id).passed[c.id]);
    view.innerHTML = `<header class="page-head"><h1>Karma antrenman</h1><p class="lead">Geçtiğin görevler karışık sırayla ve boş editörle gelir. Seçim uyarlanabilir: beceri tahminin düşük olan konular daha sık çıkar. Şu ana kadar ${S.state.mix || 0} karma görev çözdün.</p></header><section class="stage" id="mix"></section>`;
    if (!pool.length) {
      $("#mix").innerHTML = `<div class="panel narrow empty"><h2>Havuzda henüz görev yok.</h2><p class="muted">Bir derste en az bir görevi geçtiğinde burada karışık sırayla tekrar karşına çıkar.</p><div class="row"><a class="btn primary" href="#${lastOpen().id}">İlk görevine başla</a></div></div>`;
      return;
    }
    /* Uyarlanabilir seçim: düşük beceri tahmini ve çözümü görülmüş görevler daha sık gelir */
    const cand = pool.filter((c) => c.id !== renderMix.prev || pool.length === 1);
    const wt = (c) => 0.5 + 3 * (1 - (KD.bkt.get(c.phase.id) ?? 0.5)) + (S.phase(c.phase.id).solSeen?.[c.id] ? 2 : 0);
    let r = Math.random() * cand.reduce((n, c) => n + wt(c), 0), ch = cand[0];
    for (const c of cand) { r -= wt(c); if (r <= 0) { ch = c; break; } }
    renderMix.prev = ch.id;
    mountIDE($("#mix"), ch, "mix");
  }

  /* ---------- İçgörüler ---------- */
  const LV = (v) => (v == null ? 0 : v < 0.4 ? 1 : v < 0.7 ? 2 : v < KD.bkt.MASTERY ? 3 : 4);
  function weakSkills(n = 3) {
    return C.filter((p) => KD.bkt.get(p.id) != null && KD.bkt.get(p.id) < KD.bkt.MASTERY && unlocked(p))
      .sort((a, b) => KD.bkt.get(a.id) - KD.bkt.get(b.id)).slice(0, n);
  }
  function renderInsights() {
    renderSide("icgoruler"); renderBar(); renderCrumbs([{ t: "Panel", h: "#panel" }, { t: "İçgörüler" }]);
    const enrolled = ALL_CARDS.filter((c) => S.state.cards[c.id]);
    const rs = enrolled.map((c) => KD.srs.retrievability(c.id)).filter((x) => x != null);
    const avgR = rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : null;
    const up = KD.srs.upcoming(7), upMax = Math.max(1, ...up);
    const days = ["Bugün", ...Array.from({ length: 6 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d.toLocaleDateString("tr-TR", { weekday: "short" }); })];
    const cs = KD.calib.summary();
    const passedCh = ALL_CH.filter((c) => S.phase(c.phase.id).passed[c.id]);
    const firstTry = passedCh.filter((c) => (S.phase(c.phase.id).attempts[c.id] || 0) === 1).length;
    const hints = passedCh.reduce((n, c) => n + (S.phase(c.phase.id).hintsUsed[c.id] || 0), 0);
    const sols = passedCh.filter((c) => S.phase(c.phase.id).solSeen?.[c.id]).length;
    const explains = passedCh.filter((c) => S.phase(c.phase.id).explain?.[c.id]).length;
    const pct = (a, b) => (b ? Math.round((a / b) * 100) + "%" : "–");
    const weak = weakSkills();
    const calibText = !cs ? "" : Math.abs(cs.bias) <= 0.1 ? "Tahminlerin sonuçlarla uyumlu: kendini iyi tanıyorsun." : cs.bias > 0 ? "Kendine sonuçların gösterdiğinden fazla güveniyorsun. Testi çalıştırmadan önce kodu kafanda bir örnekle izlemeyi dene." : "Kendini olduğundan düşük değerlendiriyorsun. Bildiğin şeylerde daha cesur olabilirsin.";
    view.innerHTML = `
      <header class="page-head"><h1>İçgörüler</h1><p class="lead">Öğrenme sürecinin ölçümleri. Tüm hesaplar bu tarayıcıdaki ilerlemenden yapılır; yöntemler aşağıda kaynaklarıyla yazılı.</p></header>
      <div class="dash-grid">
        <section class="tile tile-span-12">
          <div class="tile-row"><h2 class="tile-h">Beceri haritası</h2><p class="muted small">Her kare bir ders. Renk, Bayesçi bilgi takibiyle hesaplanan hâkimiyet olasılığı (Corbett ve Anderson, 1994).</p></div>
          <div class="skillmap">${TRACKS.map((t) => `<div class="sm-row"><span class="sm-t">${esc(t.short)}</span><div class="sm-cells">${phasesOf(t.id).map((p) => { const v = KD.bkt.get(p.id), ok = unlocked(p); return `<a class="sm-c lv-${LV(v)} ${ok ? "" : "locked"}" href="#${p.id}" ${ok ? "" : 'aria-disabled="true"'} title="Ders ${p.no}: ${esc(p.title)} — ${v == null ? "henüz veri yok" : "%" + Math.round(v * 100)}"><b>${p.no}</b><span>${v == null ? "" : Math.round(v * 100)}</span></a>`; }).join("")}</div></div>`).join("")}</div>
          <div class="sm-legend"><span>Veri yok <i class="lv-0"></i></span><span>Başlangıç <i class="lv-1"></i></span><span>Gelişiyor <i class="lv-2"></i></span><span>Yakın <i class="lv-3"></i></span><span>Hâkim (%95+) <i class="lv-4"></i></span></div>
        </section>

        <section class="tile tile-span-6">
          <h2 class="tile-h">Odaklanman gerekenler</h2>
          ${weak.length ? `<ol class="weak">${weak.map((p) => `<li><a href="#${p.id}/kodla"><b>Ders ${p.no}: ${esc(p.title)}</b><span class="muted small">Tahmini hâkimiyet %${Math.round(KD.bkt.get(p.id) * 100)}</span></a></li>`).join("")}</ol><div class="row"><a class="btn primary" href="#karma/${Date.now()}">Bu konularla karma antrenman</a></div>` : `<p class="muted">Henüz yeterli veri yok. Birkaç görev ve tekrar kartından sonra burada en zayıf becerilerin görünecek.</p>`}
        </section>

        <section class="tile tile-span-6">
          <h2 class="tile-h">Hafıza</h2>
          <div class="kpis">
            <div><b data-count="${enrolled.length}">${enrolled.length}</b><span>kart destede</span></div>
            <div><b>${avgR == null ? "–" : Math.round(avgR * 100) + "%"}</b><span>şu an ortalama hatırlama olasılığı</span></div>
            <div><b>${KD.srs.due(ALL_CARDS).length}</b><span>kart bugün bekliyor</span></div>
          </div>
          <div class="bars" aria-label="Önümüzdeki 7 günün tekrar yükü">${up.map((n, i) => `<div class="bar-col"><i style="height:${(n / upMax) * 100}%"></i><b>${n}</b><span>${days[i]}</span></div>`).join("")}</div>
          <p class="muted small">Zamanlama FSRS ile yapılır (Ye ve diğerleri, 2022): her kart, hatırlama olasılığın %90'a düştüğü güne planlanır.</p>
        </section>

        <section class="tile tile-span-6">
          <h2 class="tile-h">Kalibrasyon</h2>
          ${cs ? `<p>${calibText}</p>
          <div class="calib">${cs.buckets.map((b) => `<div class="cb"><span class="cb-l">${b.c === 0.3 ? "Emin değilim" : b.c === 0.6 ? "Sanırım" : "Eminim"}</span><div class="cb-bars"><span class="cb-pred" style="width:${b.c * 100}%"></span><span class="cb-act" style="width:${(b.rate ?? 0) * 100}%"></span></div><span class="cb-n">${b.n ? `%${Math.round(b.rate * 100)} geçti · ${b.n}` : "veri yok"}</span></div>`).join("")}</div>
          <p class="muted small">Brier skoru <b>${cs.brier.toFixed(2)}</b> (${cs.n} tahmin). 0 mükemmel, 0,25 yazı tura. Üst çizgi tahminin, alt çizgi gerçekleşen. Kendini doğru değerlendirmek, neyi tekrar çalışacağını seçmenin ön koşuludur (Dunlosky ve Rawson, 2012).</p>`
          : `<p class="muted">Testleri çalıştırmadan önce editörün altındaki <b>Geçer mi?</b> sorusunu yanıtla. Birkaç tahminden sonra burada tahminlerinin ne kadar isabetli olduğunu göreceksin.</p>`}
        </section>

        <section class="tile tile-span-6">
          <h2 class="tile-h">Çalışma alışkanlıkları</h2>
          <div class="kpis">
            <div><b>${pct(firstTry, passedCh.length)}</b><span>ilk denemede geçilen görev</span></div>
            <div><b>${passedCh.length ? (hints / passedCh.length).toFixed(1) : "–"}</b><span>geçilen görev başına ipucu</span></div>
            <div><b>${pct(explains, passedCh.length)}</b><span>kendi cümlenle açıklanan çözüm</span></div>
            <div><b>${sols}</b><span>çözümü görülen görev</span></div>
          </div>
          <p class="muted small">İpucu sayısının azalması ve açıklama oranının artması, desteğe bağımlılığın azaldığını gösterir.</p>
        </section>
      </div>`;
  }

  /* ---------- Seviye belirleme sınavı ---------- */
  const PLACEMENT = ["p3c3", "p4c3", "p6c3", "p7c3", "p9c2", "p10c3"];
  const PASS_MIN = 5;
  function placementState() { return S.state.placement || (S.state.placement = { i: 0, results: {}, done: false }); }
  function renderPlacement() {
    renderSide("panel"); renderBar(); renderCrumbs([{ t: "Panel", h: "#panel" }, { t: "Seviye sınavı" }]);
    const st = placementState();
    const dots = PLACEMENT.map((id, i) => `<li class="${st.results[id] === true ? "ok" : st.results[id] === false ? "no" : i === st.i && !st.done ? "on" : ""}">${i + 1}</li>`).join("");
    const head = `<header class="page-head"><h1>JavaScript seviye sınavı</h1><p class="lead">JavaScript'i zaten biliyorsan temel parkuru baştan yapman gerekmez. Altı görevden en az ${PASS_MIN}'ini ipucusuz geçersen Web, React, Algoritmalar ve Backend parkurları açılır; JavaScript dersleri da açık kalır ve doğrudan kodlama adımından başlar.</p><ol class="pl-dots">${dots}</ol></header>`;
    if (placed("js")) { view.innerHTML = head + `<div class="panel narrow"><h2>Sınavı geçtin.</h2><p class="muted">Tüm parkurlar açık. Panelde sıradaki hedefini görebilirsin.</p><div class="row"><a class="btn primary" href="#panel">Panele dön</a></div></div>`; return; }
    if (st.done) {
      const n = PLACEMENT.filter((id) => st.results[id]).length;
      view.innerHTML = head + `<div class="panel narrow"><h2>${n}/${PLACEMENT.length} görev geçti.</h2><p class="muted">Eşik ${PASS_MIN}. JavaScript parkuruyla devam etmek seni daha sağlam bir temele taşır; istersen sınavı daha sonra tekrar deneyebilirsin.</p><div class="row"><a class="btn primary" href="#p1">JavaScript parkuruna başla</a><button class="btn" id="pl-retry">Sınavı tekrar dene</button></div></div>`;
      $("#pl-retry").onclick = () => { S.state.placement = null; S.save(); renderPlacement(); };
      return;
    }
    const ch = ALL_CH.find((c) => c.id === PLACEMENT[st.i]);
    view.innerHTML = head + `<section class="stage"><div id="pl-host"></div><div class="row end"><button class="btn" id="pl-skip">Bu görevi atla</button></div></section>`;
    mountIDE($("#pl-host"), ch, "placement");
    $("#pl-skip").onclick = () => { if (confirm("Bu görev başarısız sayılacak. Atlansın mı?")) placementNext(ch.id, false); };
  }
  function placementPass(ch) { toast("Görev geçti.", "xp"); setTimeout(() => placementNext(ch.id, true), 700); }
  function placementNext(id, ok) {
    const st = placementState();
    st.results[id] = ok; st.i++;
    if (st.i >= PLACEMENT.length) {
      st.done = true;
      const n = PLACEMENT.filter((x) => st.results[x]).length;
      if (n >= PASS_MIN) {
        S.state.placed.js = true;
        phasesOf("js").forEach((p) => KD.bkt.prior(p.id, 0.85));
        S.addXP(100);
        toast("<b>Seviye sınavını geçtin.</b> Tüm parkurlar açıldı.", "unlock");
      }
    }
    S.save(); checkBadges(); renderPlacement(); window.scrollTo(0, 0);
  }

  /* ---------- Tanışma ---------- */
  function openOnboarding() {
    const d = $("#dlg"), pr = prefs();
    d.innerHTML = `
      <form method="dialog" class="settings onboarding">
        <header><div><p class="muted small">QUAGEN NextGen · ${esc(KD.langInfo().ad)}</p><h2>${KD.readProfile().name ? "Yeni bir dile hoş geldin" : "Seni biraz tanıyalım"}</h2></div></header>
        <label>Adın <span class="muted small">İsteğe bağlı. Tüm dillerde ortak; selamlamada ve sertifikada görünür.</span><input name="name" value="${esc(pr.name)}" maxlength="60" autocomplete="name" /></label>
        <fieldset><legend>${esc(KD.langInfo().ad)} deneyimin</legend>
          <div class="choices">
            ${(LANG === "js"
              ? [["yeni", "Hiç kod yazmadım", "Ders 1'den, adım adım başlarız."], ["biraz", "Biraz yazdım", "Ders 1'den başla; bildiğin yerleri hızlı geçersin."], ["js", "JavaScript'i biliyorum", "Seviye sınavıyla temel parkuru atlayabilirsin."]]
              : LANG === "py"
              ? [["yeni", "Hiç Python yazmadım", "Ders 1'den başlarız: print, değişkenler, girinti."], ["biraz", "Başka bir dil biliyorum", "Python'un farkları (girinti, dinamik türler, kavramalar) üzerine odaklanırsın."], ["py", "Biraz Python biliyorum", "Temel dersleri hızlı geçip sınıflar, üreteçler ve veri işlemeye gelirsin."]]
              : [["yeni", "Hiç C yazmadım", "Ders 1'den başlarız: derleme, türler, printf."], ["biraz", "Başka bir dil biliyorum", "C'nin farkları (türler, bellek, işaretçiler) üzerine odaklanırsın."], ["c", "Biraz C biliyorum", "Bildiğin dersleri hızlı geçip işaretçi ve bellek konularına gelirsin."]]).map(([v, t, d2], i) => `<label class="choice"><input type="radio" name="level" value="${v}" ${i === 0 ? "checked" : ""}/><span><b>${t}</b><small>${d2}</small></span></label>`).join("")}
          </div>
        </fieldset>
        <fieldset><legend>Günlük hedefin</legend>
          <div class="seg">${[[20, "Hafif"], [50, "Düzenli"], [100, "Yoğun"]].map(([g, l]) => `<label><input type="radio" name="goal" value="${g}" ${g === 50 ? "checked" : ""}/><span>${l} · ${g} XP</span></label>`).join("")}</div>
          <p class="muted small">Düzenli, günde yaklaşık 20–30 dakika. Kısa ve her gün çalışmak, seyrek ve uzun çalışmaktan daha kalıcıdır.</p>
        </fieldset>
        <div class="row end"><button class="btn primary" value="ok">Başla</button></div>
      </form>`;
    const f = $("form", d);
    f.onsubmit = () => {
      const fd = new FormData(f);
      Object.assign(S.state.prefs, { name: (fd.get("name") || "").trim(), goal: +fd.get("goal"), level: fd.get("level"), onboarded: true });
      S.save();
      d.onclose = null;
      const here = location.hash.slice(1);
      if (fd.get("level") === "js") location.hash = "#seviye";
      else if (!here || here === "panel") location.hash = "#p1";
      else route();
    };
    d.onclose = () => { S.state.prefs.onboarded = true; S.save(); };
    d.showModal();
  }

  /* ---------- Diller ve profil ---------- */
  function langSummary(id) {
    const st = id === LANG ? S.state : KD.readLangState(id);
    const phases = window.KD_CURRICULUM.filter((p) => (p.language || "js") === id);
    const total = phases.reduce((n, p) => n + p.challenges.length, 0);
    if (!st) return { started: false, total, passed: 0, phasesDone: 0, phases: phases.length, xp: 0, streak: 0, best: 0, cards: 0, badges: 0, last: null };
    const ph = st.phases || {};
    const ok = (p, c) => ph[p.id] && ph[p.id].passed && ph[p.id].passed[c.id];
    const passed = phases.reduce((n, p) => n + p.challenges.filter((c) => ok(p, c)).length, 0);
    const phasesDone = phases.filter((p) => p.challenges.every((c) => ok(p, c))).length;
    const days = Object.keys(st.daily || {}).sort();
    return { started: passed > 0 || (st.xp || 0) > 0, total, passed, phasesDone, phases: phases.length, xp: st.xp || 0, streak: (st.streak || {}).count || 0, best: (st.streak || {}).best || 0, cards: Object.keys(st.cards || {}).length, badges: Object.keys(st.badges || {}).length, last: days[days.length - 1] || null };
  }
  function switchLang(id) {
    if (id === LANG) { location.hash = "#panel"; return; }
    try { localStorage.setItem("kd-lang", id); } catch (e) {}
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const go = () => (location.href = "nextgen.html?dil=" + id + "#panel");
    if (reduced) return go();
    const v = document.createElement("div");
    v.className = "lang-veil";
    v.innerHTML = `<div class="lv-in"><span class="lv-from">${esc(KD.langInfo().ad)}</span><span class="lv-arrow" aria-hidden="true"></span><span class="lv-to">${esc(KD.langInfo(id).ad)}</span></div>`;
    document.body.appendChild(v);
    try { sessionStorage.setItem("kd-warp", "1"); } catch (e) {}
    requestAnimationFrame(() => v.classList.add("on"));
    setTimeout(go, 900);
  }
  function openLangMenu() {
    const d = $("#dlg");
    d.innerHTML = `
      <form method="dialog" class="settings">
        <header><h2>Dil seç</h2><button class="icon-btn" value="close" aria-label="Kapat">${I.x}</button></header>
        <p class="muted small">Her dilin ilerlemesi, serisi ve tekrar kartları ayrı tutulur. Geçiş yaptığında kaldığın yerden devam edersin.</p>
        <div class="lang-list">${KD.LANGS.map((l) => { const x = langSummary(l.id); return `
          <button type="button" class="lang-card ${l.id === LANG ? "on" : ""}" data-lang="${l.id}">
            <span class="lc-mark">${esc(l.kisa)}</span>
            <span class="lc-body"><b>${esc(l.ad)}</b><small>${esc(l.aciklama)}</small>
              <span class="lc-prog"><span class="meter thin"><i style="width:${x.total ? (x.passed / x.total) * 100 : 0}%"></i></span><span>${x.started ? `${x.passed}/${x.total} görev` : "Henüz başlamadın"}</span></span></span>
            <span class="lc-cta">${l.id === LANG ? "Şu an burada" : x.started ? "Devam et" : "Başla"}</span>
          </button>`; }).join("")}</div>
      </form>`;
    $$(".lang-card", d).forEach((b) => (b.onclick = () => { d.close(); switchLang(b.dataset.lang); }));
    d.onclose = null;
    d.showModal();
  }
  const TRACK_ADI = { js: "JavaScript temelleri", web: "Web temelleri", react: "React", algo: "Algoritmalar ve veri yapıları", backend: "Backend ve veritabanı", c: "C temelleri", c2: "İleri C ve veri yapıları", py: "Python temelleri", py2: "Python ile veri ve otomasyon" };
  /* Portföy için tüm dillerin özeti (sunucuda saklanır, herkese açık sayfada gösterilir) */
  function portfoyOzeti() {
    return KD.LANGS.map((l) => {
      const st = l.id === LANG ? S.state : KD.readLangState(l.id);
      const phases = window.KD_CURRICULUM.filter((p) => (p.language || "js") === l.id);
      const ok = (p, c) => st && st.phases && st.phases[p.id] && st.phases[p.id].passed && st.phases[p.id].passed[c.id];
      const tracks = [...new Set(phases.map((p) => p.track || "js"))];
      const x = langSummary(l.id);
      return {
        dil: l.id, ad: l.ad, gecilen: x.passed, toplam: x.total, fazTamam: x.phasesDone, faz: x.phases, xp: x.xp, enUzunSeri: x.best, rozet: x.badges,
        parkurlar: tracks.map((t) => { const ps = phases.filter((p) => (p.track || "js") === t); const tot = ps.reduce((n, p) => n + p.challenges.length, 0); const g = ps.reduce((n, p) => n + p.challenges.filter((c) => ok(p, c)).length, 0); return { id: t, ad: TRACK_ADI[t] || t, gecilen: g, toplam: tot }; }),
        beceriler: phases.map((p) => ({ no: p.no, ad: p.short, v: st && st.skills && st.skills[p.id] != null ? Math.round(st.skills[p.id] * 100) : null }))
      };
    }).filter((x) => x.gecilen > 0 || x.xp > 0);
  }
  function portfoyAdaylari() {
    const out = [];
    for (const l of KD.LANGS) {
      const st = l.id === LANG ? S.state : KD.readLangState(l.id);
      if (!st || !st.phases) continue;
      for (const p of window.KD_CURRICULUM.filter((x) => (x.language || "js") === l.id)) {
        for (const c of p.challenges) {
          const kod = st.code && st.code[c.id];
          if (st.phases[p.id] && st.phases[p.id].passed && st.phases[p.id].passed[c.id] && kod) out.push({ dil: l.id, dilAd: l.ad, gorevId: c.id, baslik: c.title, faz: `Ders ${p.no}: ${p.title}`, kod, kodDili: c.lang === "c" ? "c" : c.lang === "py" ? "py" : c.lang === "jsx" ? "jsx" : c.lang === "html" ? "html" : c.lang === "css" ? "css" : c.lang === "sql" ? "sql" : "js" });
        }
      }
    }
    return out;
  }
  function renderProfile() {
    renderSide("profil"); renderBar(); renderCrumbs([{ t: "Panel", h: "#panel" }, { t: "Profil" }]);
    const u = KD.hesap.kullanici;
    const name = (u && u.ad) || prefs().name;
    view.innerHTML = `
      <header class="page-head prof-head">
        <div class="avatar xl" aria-hidden="true">${esc(initials(name || (u && u.kullaniciAdi) || "K"))}</div>
        <div>
          <h1>${name ? esc(name) : "Profil"}</h1>
          <p class="lead">${u ? `@${esc(u.kullaniciAdi)} · Öğrendiğin her dilin ilerlemesi ayrı tutulur ve hesabına eşitlenir.` : "Öğrendiğin her dilin ilerlemesi ayrı tutulur. Hesap açarsan ilerlemen tüm cihazlarında seninle olur."}</p>
          <div class="row">${u ? `<a class="btn" href="${esc(KD.portfoyUrl(u.kullaniciAdi))}" target="_blank" rel="noopener">Portföyümü aç</a>` : `<a class="btn primary" href="hesap.html?sonra=${encodeURIComponent("nextgen.html?dil=" + LANG + "#profil")}#kayit">Ücretsiz hesap aç</a>`}<button class="btn" data-act="settings">Ayarlar</button></div>
        </div>
      </header>
      <div class="profile-langs">${KD.LANGS.map((l, i) => {
        const x = langSummary(l.id), here = l.id === LANG;
        const certs = here ? TRACKS.filter((t) => trackComplete(t.id)).map((t) => t.title) : [];
        return `<section class="tile pl-card ${here ? "on" : ""}" style="--i:${i}">
          <div class="pl-head"><span class="lc-mark big">${esc(l.kisa)}</span><div><h2>${esc(l.ad)}</h2><p class="muted small">${esc(l.aciklama)}</p></div>${here ? `<span class="pl-here">Şu an burada</span>` : ""}</div>
          ${x.started ? `
          <div class="meter tall"><i style="width:${x.total ? (x.passed / x.total) * 100 : 0}%"></i></div>
          <div class="kpis">
            <div><b data-count="${x.passed}">${x.passed}</b><span>/ ${x.total} görev</span></div>
            <div><b data-count="${x.phasesDone}">${x.phasesDone}</b><span>/ ${x.phases} ders tamam</span></div>
            <div><b data-count="${x.xp}">${x.xp.toLocaleString("tr-TR")}</b><span>XP</span></div>
            <div><b data-count="${x.best}">${x.best}</b><span>en uzun seri</span></div>
            <div><b data-count="${x.cards}">${x.cards}</b><span>tekrar kartı</span></div>
            <div><b data-count="${x.badges}">${x.badges}</b><span>rozet</span></div>
          </div>
          <p class="muted small">${x.last ? "Son çalışma: " + new Date(x.last).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : ""}${certs.length ? " · Sertifika: " + certs.map(esc).join(", ") : ""}</p>`
          : `<p class="muted">Bu dile henüz başlamadın.</p>`}
          <div class="row">${here ? `<a class="btn primary" href="#panel">Panele dön</a>` : `<button class="btn primary" data-lang="${l.id}">${x.started ? "Bu dilde devam et" : "Bu dili öğrenmeye başla"}</button>`}</div>
        </section>`;
      }).join("")}</div>
      <section class="pf-editor" id="pf-editor"></section>`;
    $$("[data-lang]", view).forEach((b) => (b.onclick = () => switchLang(b.dataset.lang)));
    $$("[data-act=settings]", view).forEach((b) => (b.onclick = () => openSettings("plan")));
    sayaclar(view);
    renderPortfolioEditor($("#pf-editor"));
  }
  function renderPortfolioEditor(box) {
    const u = KD.hesap.kullanici;
    if (KD.hesapYok) { box.innerHTML = `<div class="pf-cta"><div><h2>Kişisel portföyün</h2><p class="muted">Herkese açık portföy ve hesaplar bu çevrimiçi demoda kapalı. İlerlemen bu tarayıcıda saklanıyor; Ayarlar'daki dışa aktarma ile yedekleyebilirsin.</p></div></div>`; return; }
    if (!u) {
      box.innerHTML = `<div class="pf-cta"><div><h2>Kişisel portföyün</h2><p class="muted">Geçtiğin görevlerden en iyilerini seç, sertifikaların ve beceri haritanla birlikte <b>kendi portföy sayfanda</b> adresinde yayınla. İşverenlere ve topluluğa ne yapabildiğini kodla göster.</p></div><a class="btn primary" href="hesap.html?sonra=${encodeURIComponent("nextgen.html?dil=" + LANG + "#profil")}#kayit">Hesap aç ve portföyünü oluştur</a></div>`;
      return;
    }
    const pf = KD.hesap.portfoy || { acik: false, baglantilar: {}, projeler: [] };
    const secili = new Set((pf.projeler || []).map((x) => x.gorevId));
    const notlar = Object.fromEntries((pf.projeler || []).map((x) => [x.gorevId, x.not || ""]));
    const adaylar = portfoyAdaylari();
    box.innerHTML = `
      <div class="pf-head"><div><h2>Portföyün</h2><p class="muted">Herkese açık adresin: <a href="${esc(KD.portfoyUrl(u.kullaniciAdi))}" target="_blank" rel="noopener">${esc(KD.portfoyUrl(u.kullaniciAdi).replace(/^https?:\/\//, ""))}</a></p></div>
        <label class="switch-row"><input type="checkbox" id="pf-acik" ${pf.acik ? "checked" : ""}/><span class="switch-ui" aria-hidden="true"></span><span>Herkese açık</span></label></div>
      <form class="pf-form" id="pf-form">
        <div class="pf-grid">
          <label>Başlık <input name="baslik" maxlength="90" placeholder="Örn: Frontend geliştirici adayı · React ve C" value="${esc(pf.baslik || "")}"/></label>
          <label>Konum <input name="konum" maxlength="60" placeholder="Örn: İzmir" value="${esc(pf.konum || "")}"/></label>
          <label class="span2">Hakkımda <textarea name="bio" rows="3" maxlength="600" placeholder="Ne öğreniyorsun, neyi kurmak istiyorsun?">${esc(pf.bio || "")}</textarea></label>
          <label>GitHub <input name="github" type="url" placeholder="https://github.com/…" value="${esc((pf.baglantilar || {}).github || "")}"/></label>
          <label>LinkedIn <input name="linkedin" type="url" placeholder="https://linkedin.com/in/…" value="${esc((pf.baglantilar || {}).linkedin || "")}"/></label>
          <label class="span2">Kişisel site <input name="web" type="url" placeholder="https://…" value="${esc((pf.baglantilar || {}).web || "")}"/></label>
        </div>
        <h3 class="sub">Öne çıkan projeler <span class="muted small" id="pf-count">${secili.size}/6 seçili</span></h3>
        ${adaylar.length ? `<div class="pf-projects">${adaylar.map((a) => `
          <label class="pf-proj ${secili.has(a.gorevId) ? "on" : ""}">
            <input type="checkbox" value="${esc(a.gorevId)}" ${secili.has(a.gorevId) ? "checked" : ""}/>
            <span class="pf-proj-top"><span class="pf-lang">${esc(a.dilAd)}</span><b>${esc(a.baslik)}</b></span>
            <span class="muted small">${esc(a.faz)}</span>
            <input class="pf-note" data-note="${esc(a.gorevId)}" maxlength="400" placeholder="Bu çözümde ne öğrendin? (isteğe bağlı)" value="${esc(notlar[a.gorevId] || "")}"/>
          </label>`).join("")}</div>` : `<p class="muted">Görev geçtikçe çözümlerin burada listelenir; en iyi altı tanesini portföyüne ekleyebilirsin.</p>`}
        <div class="row end"><span class="muted small" id="pf-status"></span><button class="btn primary" type="submit">Portföyü kaydet</button></div>
      </form>`;
    const form = $("#pf-form", box);
    $$(".pf-proj input[type=checkbox]", box).forEach((cb) => cb.addEventListener("change", () => {
      const n = $$(".pf-proj input[type=checkbox]:checked", box).length;
      if (n > 6) { cb.checked = false; toast("En fazla altı proje seçebilirsin.", "warn"); return; }
      cb.closest(".pf-proj").classList.toggle("on", cb.checked);
      $("#pf-count", box).textContent = Math.min(n, 6) + "/6 seçili";
    }));
    form.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const projeler = $$(".pf-proj input[type=checkbox]:checked", box).map((cb) => {
        const a = adaylar.find((x) => x.gorevId === cb.value);
        return { dil: a.dil, gorevId: a.gorevId, baslik: a.baslik, faz: a.faz, kod: a.kod, kodDili: a.kodDili, not: ($(`[data-note="${cb.value}"]`, box) || {}).value || "" };
      });
      const btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = "Kaydediliyor…";
      try {
        await KD.hesap.portfoyKaydet({ acik: $("#pf-acik", box).checked, baslik: fd.get("baslik"), konum: fd.get("konum"), bio: fd.get("bio"), baglantilar: { github: fd.get("github"), linkedin: fd.get("linkedin"), web: fd.get("web") }, projeler, ozet: { diller: portfoyOzeti(), rozetler: Object.keys(S.state.badges || {}).length, guncelleme: new Date().toISOString() } });
        toast($("#pf-acik", box).checked ? `<b>Portföyün yayında.</b> <a href="${esc(KD.portfoyUrl(u.kullaniciAdi))}" target="_blank" rel="noopener">Aç</a>` : "Portföy kaydedildi (gizli).", "badge");
        $("#pf-status", box).textContent = "Kaydedildi.";
      } catch (err) { toast(esc(err.message), "warn"); }
      btn.disabled = false; btn.textContent = "Portföyü kaydet";
    };
  }

  /* ---------- Sertifikalar ---------- */
  function certCode(name, tid, date) {
    let h = 2166136261;
    for (const ch of name + "|" + tid + "|" + date) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return "KD-" + tid.toUpperCase() + "-" + (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
  }
  function renderCertificates(tid) {
    renderSide("sertifika"); renderBar();
    const t = tid && T(tid);
    if (!t) {
      renderCrumbs([{ t: "Panel", h: "#panel" }, { t: "Sertifikalar" }]);
      view.innerHTML = `<header class="page-head"><h1>Sertifikalar</h1><p class="lead">Bir parkurdaki görevlerin tamamını geçtiğinde o parkurun tamamlama belgesi açılır. Belgeyi yazdırabilir ya da PDF olarak kaydedebilirsin.</p></header>
        <ul class="cert-list">${TRACKS.map((x) => { const pr = trackProgress(x.id), ok = pr.ratio === 1; return `<li class="${ok ? "ok" : ""}"><div><h2>${esc(x.title)}</h2><p class="muted small">${pr.passed}/${pr.total} görev</p><div class="meter"><i style="width:${pr.ratio * 100}%"></i></div></div>${ok ? `<a class="btn primary" href="#sertifika/${x.id}">Belgeyi aç</a>` : `<span class="muted small">${pr.total - pr.passed} görev kaldı</span>`}</li>`; }).join("")}</ul>`;
      return;
    }
    renderCrumbs([{ t: "Panel", h: "#panel" }, { t: "Sertifikalar", h: "#sertifika" }, { t: t.short }]);
    if (!trackComplete(tid)) { location.replace("#sertifika"); return; }
    const name = prefs().name;
    const date = S.state.badges["parkur-" + tid] || S.day();
    view.innerHTML = `
      <div class="cert-actions no-print">
        ${name ? "" : `<p class="feedback learn">Belgede adının görünmesi için önce <button class="link" data-act="settings">ayarlardan adını yaz</button>.</p>`}
        <button class="btn primary" id="print">Yazdır veya PDF kaydet</button>
      </div>
      <article class="cert" aria-label="Tamamlama belgesi">
        <p class="cert-brand">QUAGEN</p>
        <p class="cert-kicker">Tamamlama belgesi</p>
        <h1 class="cert-name">${esc(name || "Adını ayarlardan ekle")}</h1>
        <p class="cert-body"><span class="mark">${esc(t.title)}</span> parkurundaki ${trackProgress(tid).total} kodlama görevini, otomatik testlerle doğrulanarak tamamladı.</p>
        <ol class="cert-phases">${phasesOf(tid).map((p) => `<li>${esc(p.title)}</li>`).join("")}</ol>
        <footer class="cert-foot">
          <span>${new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span class="cert-code">${certCode(name, tid, date)}</span>
        </footer>
      </article>`;
    $("#print").onclick = () => window.print();
    $$("[data-act=settings]", view).forEach((b) => (b.onclick = () => openSettings("plan")));
  }

  /* ---------- Ayarlar ---------- */
  function openSettings(sekme) {
    const d = $("#dlg"), pr = prefs(), kam = (S.state.kam = S.state.kam || {});
    const u = KD.hesap && KD.hesap.kullanici;
    const SEKMELER = [["hesap", "Hesap", I.user], ["plan", "Öğrenme planı", I.flame], ["gorunum", "Görünüm", I.sun], ["kam", "KAM", I.spark || I.award], ["veri", "Veriler", I.cards]];
    const acik = SEKMELER.some((x) => x[0] === sekme) ? sekme : "hesap";
    const biten = C.filter((p) => mastery(p) === 1).length;
    d.classList.add("genis");
    d.innerHTML = `
      <form method="dialog" class="settings yonetim">
        <header><div><h2>Yönetim</h2><p class="muted small">Hesabın, planın, görünüm ve verilerin tek yerde.</p></div><button class="icon-btn" value="close" aria-label="Kapat">${I.x}</button></header>
        <div class="yn">
          <nav class="yn-sekme" role="tablist" aria-label="Bölümler">${SEKMELER.map(([id, ad, ic]) => `<button type="button" role="tab" data-s="${id}" aria-selected="${id === acik}">${ic}<span>${ad}</span></button>`).join("")}</nav>
          <div class="yn-govde">
            <section data-b="hesap" ${acik === "hesap" ? "" : "hidden"}>
              <label>Adın <span class="muted small">KAM sana böyle seslenir; sertifikada da bu yazar.</span>
                <input name="name" value="${esc(pr.name)}" maxlength="60" autocomplete="name" /></label>
              <div class="yn-kutu">${KD.hesapYok ? `<b>Hesaplar bu sürümde kapalı</b><p class="muted small">İlerlemen bu tarayıcıda saklanıyor.</p>`
                : u ? `<b>@${esc(u.kullaniciAdi)} olarak giriş yaptın</b><p class="muted small">İlerlemen hesabına kaydediliyor; başka cihazda giriş yapınca kaldığın yerden devam edersin.</p><div class="row"><a class="btn" href="#profil" data-kapat>Profilim</a><button type="button" class="btn" id="yn-cikis">Çıkış yap</button></div>`
                : `<b>Henüz hesabın yok</b><p class="muted small">Kayıt olursan ilerlemen hesabında saklanır ve hiçbir cihazda kaybolmaz.</p><div class="row"><a class="btn primary" href="hesap.html?sonra=${encodeURIComponent("nextgen.html?dil=" + LANG)}#kayit">Kayıt ol</a><a class="btn" href="hesap.html?sonra=${encodeURIComponent("nextgen.html?dil=" + LANG)}">Giriş yap</a></div>`}</div>
              <fieldset><legend>Öğrendiğin dil</legend>
                <div class="seg">${KD.LANGS.map((l) => `<label><input type="radio" name="dil" value="${l.id}" ${l.id === LANG ? "checked" : ""}/><span>${esc(l.ad)}</span></label>`).join("")}</div>
                <p class="muted small">Her dilin ilerlemesi ayrı tutulur; değiştirince kaldığın yerden açılır.</p>
              </fieldset>
            </section>
            <section data-b="plan" ${acik === "plan" ? "" : "hidden"}>
              <div class="yn-ozet"><div><b>${biten}/${C.length}</b><small>ders bitti</small></div><div><b>${S.state.streak.count}</b><small>gün seri</small></div><div><b>${S.state.xp.toLocaleString("tr-TR")}</b><small>toplam XP</small></div></div>
              <fieldset><legend>Günde ayırdığın süre</legend>
                <div class="seg">${[10, 15, 30, 60].map((g) => `<label><input type="radio" name="dk" value="${g}" ${(kam.dk || 30) === g ? "checked" : ""}/><span>${g} dk</span></label>`).join("")}</div>
                <p class="muted small" id="yn-plan"></p>
              </fieldset>
              <fieldset><legend>Günlük XP hedefi</legend>
                <div class="seg">${[20, 50, 100, 150].map((g) => `<label><input type="radio" name="goal" value="${g}" ${pr.goal === g ? "checked" : ""}/><span>${g} XP</span></label>`).join("")}</div>
                <p class="muted small">50 XP yaklaşık bir görev ve bir tekrar turudur.</p>
              </fieldset>
            </section>
            <section data-b="gorunum" ${acik === "gorunum" ? "" : "hidden"}>
              <fieldset><legend>Tema</legend>
                <div class="seg">${[["system", "Sistem"], ["light", "Açık"], ["dark", "Koyu"]].map(([v, l]) => `<label><input type="radio" name="theme" value="${v}" ${pr.theme === v ? "checked" : ""}/><span>${l}</span></label>`).join("")}</div>
              </fieldset>
              <fieldset><legend>Editör yazı boyutu</legend>
                <div class="seg">${[13, 14, 15, 16, 18].map((f) => `<label><input type="radio" name="font" value="${f}" ${pr.font === f ? "checked" : ""}/><span>${f}</span></label>`).join("")}</div>
                <pre class="code yn-onizle"><code>printf("Merhaba, ${esc(pr.name || "dünya")}!\\n");</code></pre>
              </fieldset>
              <fieldset><legend>Kısayollar</legend>
                <ul class="yn-kisayol"><li><kbd>Ctrl</kbd><kbd>K</kbd><span>Ders, görev ya da komut ara</span></li><li><kbd>Ctrl</kbd><kbd>Enter</kbd><span>Testleri çalıştır</span></li><li><kbd>Esc</kbd><span>Açık pencereyi kapat</span></li></ul>
              </fieldset>
            </section>
            <section data-b="kam" ${acik === "kam" ? "" : "hidden"}>
              <div class="yn-kutu"><b>KAM seni nasıl tanıyor?</b><p class="muted small">${kam.tanisti ? `Günde ${kam.dk || 30} dakika ayırdığını söyledin${kam.baslangic ? "; " + esc(kam.baslangic) + " tarihinde başladın" : ""}.` : "Henüz tanışmadınız."}</p>
                <div class="row"><button type="button" class="btn" id="yn-tanis">Tanışmayı yeniden yap</button><button type="button" class="btn" id="yn-tur">Tanıtımı yeniden izle</button></div></div>
              <div class="yn-kutu"><b>Yapay zekâ</b><p class="muted small">${aiOn ? "Çevrimiçi: serbest sorularını yapay zekâ cevaplıyor." : "Şu an kapalı. KAM hazırlanmış anlatımlar ve Kütüphane bilgisiyle cevap veriyor; dersler ve ipuçları bundan etkilenmez."}</p></div>
            </section>
            <section data-b="veri" ${acik === "veri" ? "" : "hidden"}>
              <div class="yn-kutu"><b>Yedek</b><p class="muted small">İlerlemeni bir dosyaya indirip başka bir tarayıcıda geri yükleyebilirsin.</p>
                <div class="row"><button type="button" class="btn" id="exp">Dışa aktar</button><label class="btn" for="imp-file">İçe aktar</label><input type="file" id="imp-file" accept="application/json" hidden /></div></div>
              <div class="yn-kutu tehlike"><b>İlerlemeyi sil</b><p class="muted small">Bu dildeki tüm ilerleme, XP, kartlar ve rozetler silinir. Geri alınamaz.</p>
                <div class="row"><button type="button" class="btn danger" id="wipe">İlerlemeyi sil</button></div></div>
            </section>
          </div>
        </div>
      </form>`;
    const sekmeAc = (id) => { $$(".yn-sekme button", d).forEach((x) => x.setAttribute("aria-selected", x.dataset.s === id)); $$(".yn-govde section", d).forEach((x) => (x.hidden = x.dataset.b !== id)); };
    $$(".yn-sekme button", d).forEach((x) => (x.onclick = () => sekmeAc(x.dataset.s)));
    const planYaz = () => { const el = $("#yn-plan", d); if (el && window.KAM) el.innerHTML = md(window.KAM.planMetni(window.KAM.planHesapla(kam.dk || 30, C.length - biten))); };
    planYaz();
    $$("[data-kapat]", d).forEach((x) => (x.onclick = () => d.close()));
    if ($("#yn-cikis", d)) $("#yn-cikis", d).onclick = async () => { try { await KD.hesap.cikis(); } catch (_) {} d.close(); renderAccount(); };
    $("#yn-tanis", d).onclick = () => { d.close(); pr.onboarded = false; S.save(); if (window.KAM) window.KAM.tanis(); };
    $("#yn-tur", d).onclick = () => { d.close(); location.hash = "#panel"; setTimeout(() => window.KAM && window.KAM.tur(null, true), 400); };
    const f = $("form", d);
    f.oninput = () => {
      const fd = new FormData(f);
      Object.assign(S.state.prefs, { name: (fd.get("name") || "").trim(), goal: +fd.get("goal"), theme: fd.get("theme"), font: +fd.get("font") });
      kam.dk = +fd.get("dk") || kam.dk;
      S.save(); applyPrefs(); planYaz();
      if (fd.get("dil") && fd.get("dil") !== LANG) switchLang(fd.get("dil"));
    };
    $("#exp", d).onclick = () => {
      const blob = new Blob([JSON.stringify(S.state, null, 2)], { type: "application/json" });
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `quagen-ilerleme-${S.day()}.json` });
      a.click(); URL.revokeObjectURL(a.href);
    };
    $("#imp-file", d).onchange = async (e) => {
      try {
        const data = JSON.parse(await e.target.files[0].text());
        if (!data || typeof data !== "object" || !("phases" in data)) throw new Error();
        if (!confirm("Bu dosyadaki ilerleme mevcut ilerlemenin yerine geçecek. Devam edilsin mi?")) return;
        S.replace(data); location.reload();
      } catch (_) { toast("Dosya okunamadı. QUAGEN'den dışa aktarılmış bir JSON dosyası seç.", "warn"); }
    };
    $("#wipe", d).onclick = () => { if (confirm("Tüm ilerleme, XP, kartlar ve rozetler silinecek. Bu geri alınamaz. Devam edilsin mi?")) { S.reset(); location.hash = "#panel"; location.reload(); } };
    d.onclose = () => { d.classList.remove("genis"); route(); };
    d.showModal();
  }

  /* ---------- Komut paleti ---------- */
  const norm = (s) => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");
  function paletteItems() {
    const items = [
      { g: "Git", t: "Panel", h: "#panel" },
      { g: "Git", t: "Tekrar", sub: `${KD.srs.due(ALL_CARDS).length} kart bekliyor`, h: "#tekrar" },
      { g: "Git", t: "Karma antrenman", h: "#karma/" + Date.now() },
      { g: "Git", t: "İçgörüler", sub: "Beceri haritası, hafıza ve kalibrasyon", h: "#icgoruler" },
      { g: "Git", t: "Sertifikalar", h: "#sertifika" },
      { g: "Git", t: "Günlük pratik", sub: "5 dakikalık oyunlaştırılmış alıştırma", run: () => (location.href = "pratik.html?dil=" + LANG) },
      { g: "Git", t: "Lablar", sub: "Siber güvenlik: sanal makinede adım adım", h: "#lab" },
      { g: "Git", t: "Projeler", sub: "Basitten zora 25 proje fikri", h: "#projeler" },
      { g: "Git", t: "Terminal", sub: "Serbest çalışma alanı", h: "#terminal" },
      { g: "Git", t: "Yol haritaları", sub: "Diller ve alanlar", h: "#yollar" },
      ...((window.KD_LABLAR || { LABLAR: [] }).LABLAR.map((l) => ({ g: "Lab", t: l.baslik, sub: `Lab ${l.no} · ${l.sure} dk`, h: "#lab/" + l.id }))),
      ...((window.KD_PROJELER || { PROJELER: [] }).PROJELER.map((x) => ({ g: "Proje", t: x.ad, sub: x.ozet, h: "#terminal/" + x.id }))),
      { g: "Git", t: "Kütüphane", sub: "Türkçe başvuru: ne yapmak istediğini yaz", run: () => (location.href = "rehber.html") },
      ...(LANG === "js" ? [{ g: "Git", t: "Seviye belirleme sınavı", sub: "JavaScript biliyorsan parkuru atla", h: "#seviye" }] : []),
      { g: "Git", t: "Profil", sub: "Tüm dillerdeki ilerlemen", h: "#profil" },
      ...KD.LANGS.filter((l) => l.id !== LANG).map((l) => ({ g: "Komut", t: `Dili değiştir: ${l.ad}`, sub: "Kaldığın yerden devam et", run: () => switchLang(l.id) })),
      { g: "Komut", t: "Ayarları aç", run: openSettings },
      { g: "Komut", t: "Temayı değiştir", run: toggleTheme },
      { g: "Komut", t: "Kaldığın yerden devam et", h: (() => { const n = nextTarget(); return n ? `#${n.p.id}/${n.step}` : "#panel"; })() }
    ];
    for (const p of C) {
      const ok = unlocked(p);
      items.push({ g: "Dersler", t: `Ders ${p.no}: ${p.title}`, sub: T(trackOf(p)).short + " · " + p.concepts.join(", "), h: "#" + p.id, off: !ok });
      if (ok) p.challenges.forEach((c) => items.push({ g: "Görevler", t: c.title, sub: `Ders ${p.no}: ${p.short} · ${c.kind}`, h: `#${p.id}/kodla/${c.id}`, ok: S.phase(p.id).passed[c.id] }));
    }
    return items;
  }
  let palSel = 0, palRes = [];
  function openPalette() {
    const pal = $("#palette"); pal.hidden = false;
    const inp = $("#pal-in"); inp.value = ""; renderPalette(); inp.focus();
  }
  function closePalette() { $("#palette").hidden = true; }
  function renderPalette() {
    const q = norm($("#pal-in").value.trim());
    const all = paletteItems();
    palRes = (q ? all.filter((x) => norm(x.t + " " + (x.sub || "")).includes(q)) : all.filter((x) => x.g !== "Görevler")).slice(0, 40);
    palSel = Math.min(palSel, Math.max(0, palRes.length - 1));
    let g = null;
    $("#pal-list").innerHTML = palRes.length ? palRes.map((x, i) => {
      const head = x.g !== g ? `<li class="pal-g" role="presentation">${x.g}</li>` : ""; g = x.g;
      return `${head}<li role="option" class="pal-i ${i === palSel ? "on" : ""} ${x.off ? "off" : ""}" data-i="${i}" aria-selected="${i === palSel}">
        <span class="pal-t">${esc(x.t)}${x.ok ? ` <span class="pal-ok">${I.check}</span>` : ""}${x.off ? ` <span class="pal-lock">${I.lock}</span>` : ""}</span>${x.sub ? `<span class="pal-sub">${esc(x.sub)}</span>` : ""}</li>`;
    }).join("") : `<li class="pal-empty">"${esc($("#pal-in").value)}" için sonuç yok.</li>`;
    $$(".pal-i").forEach((li) => { li.onmousemove = () => { if (palSel !== +li.dataset.i) { palSel = +li.dataset.i; markSel(); } }; li.onclick = () => choose(+li.dataset.i); });
  }
  function markSel() { $$(".pal-i").forEach((li) => { const on = +li.dataset.i === palSel; li.classList.toggle("on", on); li.setAttribute("aria-selected", on); if (on) li.scrollIntoView({ block: "nearest" }); }); }
  function choose(i) {
    const x = palRes[i]; if (!x) return;
    if (x.off) { toast("Bu ders henüz kilitli.", "warn"); return; }
    closePalette();
    if (x.run) x.run(); else location.hash = x.h;
  }
  $("#pal-in").oninput = () => { palSel = 0; renderPalette(); };
  $("#pal-in").onkeydown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); palSel = Math.min(palRes.length - 1, palSel + 1); markSel(); }
    if (e.key === "ArrowUp") { e.preventDefault(); palSel = Math.max(0, palSel - 1); markSel(); }
    if (e.key === "Enter") { e.preventDefault(); choose(palSel); }
    if (e.key === "Escape") closePalette();
  };
  $("#palette").onclick = (e) => { if (e.target.id === "palette") closePalette(); };

  /* ---------- Kenar menü (dar ekran) ---------- */
  function openSide() { document.body.classList.add("side-open"); $("#scrim").hidden = false; }
  function closeSide() { document.body.classList.remove("side-open"); $("#scrim").hidden = true; }
  function toggleTheme() {
    const cur = document.documentElement.dataset.theme;
    S.state.prefs.theme = cur === "dark" ? "light" : "dark"; S.save(); applyPrefs();
  }

  /* ---------- Başlat ---------- */
  /* ---------- Hesap düğmesi ---------- */
  function initials(n) { return String(n || "K").trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toLocaleUpperCase("tr"); }
  function renderAccount() {
    const box = $("#acct"); if (!box) return;
    const u = KD.hesap.kullanici;
    if (KD.hesapYok) { box.innerHTML = `<span class="demo-pill" title="Çevrimiçi demo: ilerlemen bu tarayıcıda saklanır. Hesaplar ve C derleyicisi kurulu sürümde.">Demo</span>`; return; }
    if (!u) {
      box.innerHTML = `<a class="pill-login" href="hesap.html?sonra=${encodeURIComponent("nextgen.html?dil=" + LANG + location.hash)}">Giriş yap</a>`;
      return;
    }
    const d = KD.hesap.durum;
    box.innerHTML = `<button class="avatar-btn" id="acct-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Hesap menüsü"><span class="avatar">${esc(initials(u.ad || u.kullaniciAdi))}</span><span class="sync-dot ${d}" title="${d === "esitlendi" ? "İlerleme hesabına eşitlendi" : d === "esitleniyor" ? "Eşitleniyor…" : d === "hata" ? "Eşitlenemedi; tekrar denenecek" : ""}"></span></button>
      <div class="acct-menu" id="acct-menu" role="menu" hidden>
        <div class="am-head"><span class="avatar lg">${esc(initials(u.ad || u.kullaniciAdi))}</span><div><b>${esc(u.ad || u.kullaniciAdi)}</b><small>@${esc(u.kullaniciAdi)}</small></div></div>
        <p class="am-sync"><span class="sync-dot ${d}"></span>${d === "esitlendi" ? "İlerleme hesabına eşitlendi" : d === "esitleniyor" ? "Eşitleniyor…" : d === "hata" ? "Eşitlenemedi, tekrar denenecek" : "Yerel"}</p>
        <a role="menuitem" href="#profil">Profil ve portföy</a>
        <a role="menuitem" href="${esc(KD.portfoyUrl(u.kullaniciAdi))}" target="_blank" rel="noopener">Herkese açık portföyüm</a>
        <button role="menuitem" data-am="settings">Ayarlar</button>
        <button role="menuitem" data-am="out" class="danger">Çıkış yap</button>
      </div>`;
    const btn = $("#acct-btn"), menu = $("#acct-menu");
    const kapat = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    btn.onclick = (e) => { e.stopPropagation(); const ac = menu.hidden; menu.hidden = !ac; btn.setAttribute("aria-expanded", ac); if (ac) { menu.classList.remove("pop"); void menu.offsetWidth; menu.classList.add("pop"); $("a,button", menu).focus(); } };
    document.addEventListener("click", (e) => { if (!box.contains(e.target)) kapat(); });
    menu.addEventListener("keydown", (e) => { if (e.key === "Escape") { kapat(); btn.focus(); } });
    $$("a", menu).forEach((a) => a.addEventListener("click", kapat));
    $("[data-am=settings]", menu).onclick = () => { kapat(); openSettings(); };
    $("[data-am=out]", menu).onclick = async () => { kapat(); await KD.hesap.cikis(); location.href = "index.html"; };
  }
  KD.hesap.dinle(() => { const open = $("#acct-menu") && !$("#acct-menu").hidden; if (!open) renderAccount(); else { const dot = $$(".sync-dot"); dot.forEach((x) => (x.className = "sync-dot " + KD.hesap.durum)); } });
  KD.hesap.ben().then(async (u) => {
    renderAccount();
    if (u) { const degisti = await KD.hesap.esitle(); if (degisti) { applyPrefs(); route(); } if (!prefs().name && u.ad) { S.state.prefs.name = u.ad; S.save(); } }
  });

  const tag = $("#lang-switch");
  if (tag) { tag.innerHTML = `${I.globe}<span>${esc(KD.langInfo().ad)}</span>`; tag.onclick = openLangMenu; }
  document.title = "QUAGEN NextGen · " + KD.langInfo().ad;
  $("#btn-menu").innerHTML = I.menu;
  $(".search-ico").innerHTML = I.search;
  $("#btn-settings").innerHTML = I.gear;
  $("#kbd-k").textContent = isMac ? "⌘K" : "Ctrl K";
  $("#btn-menu").onclick = () => (document.body.classList.contains("side-open") ? closeSide() : openSide());
  $("#scrim").onclick = closeSide;
  $("#btn-search").onclick = openPalette;
  $("#btn-theme").onclick = toggleTheme;
  $("#btn-settings").onclick = () => openSettings();
  addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.closest?.(".CodeMirror");
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#palette").hidden ? openPalette() : closePalette(); }
    else if (e.key === "/" && !typing && $("#palette").hidden) { e.preventDefault(); openPalette(); }
    else if (e.key === "Escape") { closePalette(); closeSide(); }
  });
  addEventListener("hashchange", route);
  applyPrefs();
  KD.tutor.available().then((on) => {
    aiOn = on;
    const el = $("#ai-status"); el.textContent = on ? "Yapay zekâ mentor çevrimiçi" : "Mentor yerel modda"; el.classList.toggle("on", on);
    const mm = $("#m-mode"); if (mm) mm.textContent = on ? "Yapay zekâ, Sokratik mod" : "Yerel ipucu motoru";
  });
  window.KD_APP = { nextTarget, mastery, renderBar, runSnippet, hlLang, makeEditor, toast, celebrate, openSettings: (sekme) => openSettings(sekme), due: () => KD.srs.due(ALL_CARDS).length };
  route();
  checkBadges();
  if (!prefs().onboarded) setTimeout(KAM_VAR ? window.KAM.tanis : openOnboarding, document.documentElement.classList.contains("entering") ? 1800 : 300);

  /* Ana sayfadan gelince giriş animasyonu */
  if (document.documentElement.classList.contains("entering")) {
    try { sessionStorage.removeItem("kd-warp"); } catch (e) {}
    const root = document.documentElement;
    setTimeout(() => root.classList.add("entered"), 30);
    setTimeout(() => root.classList.remove("entering", "entered"), 1700);
  }
})();
