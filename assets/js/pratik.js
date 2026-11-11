/* QUAGEN Pratik — günde 5 dakikalık kod antrenmanı
 * Ders yolu · 6 alıştırma türü · can ve kombo · hata defteri (Leitner) · günlük görevler.
 * İlerleme, dilin ana deposunda (KD.store.state.pratik) tutulur; hesapla eşitlenir, XP ve seri NextGen'le ortaktır.
 */
(function () {
  const KD = window.KD, P = window.KD_PRATIK, R = window.KD_REHBER;
  const M = window.KD_CURRICULUM || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = KD.store;
  const LANG = KD.lang;
  const PARKUR = {
    js: [["js", "JavaScript temelleri"], ["web", "Web temelleri"], ["react", "React"], ["algo", "Algoritmalar"], ["backend", "Backend ve veritabanı"]],
    c: [["c", "C temelleri"], ["c2", "İleri C ve veri yapıları"]],
    py: [["py", "Python temelleri"], ["py2", "Python ile veri ve otomasyon"]]
  };
  const fazlar = M.filter((p) => (p.language || "js") === LANG);
  const st = () => {
    const s = S.state.pratik || (S.state.pratik = {});
    s.dersler = s.dersler || {}; s.defter = s.defter || {}; s.gunluk = s.gunluk || {};
    if (s.ses === undefined) s.ses = true;
    return s;
  };
  const gunKaydi = (t = S.day()) => (st().gunluk[t] = st().gunluk[t] || { dogru: 0, ders: 0, kombo: 0, tekrar: 0, kusursuz: 0 });
  const kaydet = () => S.save();

  /* ---------- İkonlar ---------- */
  const IK = {
    alev: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 1-3.5S9 11 10.5 11C10.5 7 12 2 12 2Z" fill="currentColor"/></svg>',
    kalp: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3.1 4.5 6.9 4.5c2.2 0 3.6 1.2 5.1 3 1.5-1.8 2.9-3 5.1-3 3.8 0 6 3.9 4.5 7.3C19.5 16.4 12 21 12 21Z" fill="currentColor"/></svg>',
    yildiz: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="m12 2 3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6Z" fill="currentColor"/></svg>',
    kilit: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',
    tik: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    oynat: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5Z" fill="currentColor"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    sesAcik: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9Z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    sesKapali: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9Z" fill="currentColor"/><path d="m16 9 5 6m0-6-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    defter: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 9h6M9 13h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  /* ---------- Ses (isteğe bağlı, kısa ve kısık) ---------- */
  let ac = null;
  function ses(tur) {
    if (!st().ses) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const notalar = tur === "dogru" ? [[660, 0], [990, 0.09]] : tur === "yanlis" ? [[220, 0], [180, 0.12]] : [[523, 0], [659, 0.1], [784, 0.2], [1046, 0.3]];
      for (const [f, t] of notalar) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = tur === "yanlis" ? "triangle" : "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, ac.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.08, ac.currentTime + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t + 0.18);
        o.connect(g).connect(ac.destination); o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.2);
      }
    } catch (_) {}
  }

  /* ---------- Ders durumu ---------- */
  const fazDurum = (p) => st().dersler[p.id] || null;
  const nextgenGecti = (p) => { const ph = S.state.phases[p.id]; return !!(ph && ph.passed && Object.keys(ph.passed).length); };
  function acikMi(p, liste) {
    const i = liste.indexOf(p);
    if (i <= 0) return true;
    return !!fazDurum(liste[i - 1]) || nextgenGecti(p) || !!fazDurum(p);
  }
  function defterBekleyen() {
    const simdi = Date.now();
    return Object.entries(st().defter).filter(([, k]) => !k.ogrenildi && k.zaman <= simdi).map(([a]) => a);
  }

  /* ---------- Günlük görevler (tarihe göre sabit) ---------- */
  const GOREVLER = [
    { id: "dogru", ad: "15 doğru cevap ver", hedef: 15, deger: (g) => g.dogru },
    { id: "ders", ad: "2 ders bitir", hedef: 2, deger: (g) => g.ders },
    { id: "kombo", ad: "Arka arkaya 8 doğru (kombo)", hedef: 8, deger: (g) => g.kombo },
    { id: "tekrar", ad: "Hata defterinden 5 soru tekrar et", hedef: 5, deger: (g) => g.tekrar },
    { id: "kusursuz", ad: "Hatasız bir ders bitir", hedef: 1, deger: (g) => g.kusursuz },
    { id: "dogru30", ad: "30 doğru cevap ver", hedef: 30, deger: (g) => g.dogru }
  ];
  function bugununGorevleri() {
    let h = 0; for (const c of S.day()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const r = P.rastgele(h);
    const havuz = P.karistir(GOREVLER, r);
    const secilen = [havuz.find((g) => g.id === "ders") || havuz[0]];
    for (const g of havuz) { if (secilen.length >= 3) break; if (!secilen.includes(g) && !(g.id === "dogru30" && secilen.some((x) => x.id === "dogru"))) secilen.push(g); }
    return secilen;
  }

  /* ---------- Üst çubuk ---------- */
  function ustCiz() {
    $("#dil").innerHTML = KD.LANGS.map((l) => `<a role="tab" aria-selected="${l.id === LANG}" href="pratik.html?dil=${l.id}">${esc(l.ad)}</a>`).join("");
    const bugunXp = S.state.daily[S.day()] || 0, hedef = S.state.prefs.goal || 50;
    $("#ust-stat").innerHTML = `<span class="seri ${S.state.streak.last === S.day() ? "yandi" : ""}" title="Seri">${IK.alev}<b>${S.state.streak.count || 0}</b></span><span class="gxp" title="Bugünkü XP"><b>${bugunXp}</b>/${hedef} XP</span>`;
    $("#ses").innerHTML = st().ses ? IK.sesAcik : IK.sesKapali;
    $("#ses").setAttribute("aria-pressed", String(st().ses));
  }

  /* ---------- Ders yolu ---------- */
  function yolCiz() {
    const parkurlar = (PARKUR[LANG] || []).map(([id, ad]) => ({ id, ad, fazlar: fazlar.filter((p) => (p.track || "js") === id).sort((a, b) => a.no - b.no) })).filter((t) => t.fazlar.length);
    let aktifBulundu = false;
    $("#yol").innerHTML = `
      <section class="yol-bas">
        <p class="kicker">Günde 5 dakika · ${esc(KD.langInfo().ad)}</p>
        <h1>Az ama <span class="mark">her gün</span>.</h1>
        <p class="lead">Her ders 8–12 kısa alıştırma: kodun çıktısını tahmin et, karışık satırları sırala, boşluğu doldur, hatayı bul. Yanlışların hata defterine düşer ve unutmaya başladığın gün geri gelir.</p>
      </section>
      ${parkurlar.map((t, ti) => {
        const biten = t.fazlar.filter((p) => fazDurum(p)).length;
        return `<section class="birim" style="--bi:${ti}">
          <header class="birim-h"><div><p class="muted small">Bölüm ${ti + 1}</p><h2>${esc(t.ad)}</h2></div><div class="birim-say"><b>${biten}</b>/${t.fazlar.length}<span class="mini-bar"><i style="width:${(biten / t.fazlar.length) * 100}%"></i></span></div></header>
          <ol class="dugumler">${t.fazlar.map((p, i) => {
            const d = fazDurum(p), acik = acikMi(p, t.fazlar);
            const aktif = acik && !d && !aktifBulundu;
            if (aktif) aktifBulundu = true;
            const x = Math.round(Math.sin(i * 0.95) * 92);
            const durum = d ? "tamam" : aktif ? "aktif" : acik ? "acik" : "kilitli";
            return `<li class="dugum ${durum}" style="--x:${x}px;--i:${i}">
              <button data-faz="${p.id}" aria-label="${esc(p.title)}${d ? ", tamamlandı" : acik ? "" : ", kilitli"}">
                <span class="halka" style="--y:${d ? d.yildiz / 3 : 0}"></span>
                <span class="ic">${d ? IK.tik : acik ? `<b>${p.no}</b>` : IK.kilit}</span>
              </button>
              ${aktif ? `<span class="basla-balon">BAŞLA</span>` : ""}
              <span class="etiket"><b>${esc(p.short || p.title)}</b>${d ? `<span class="yildizlar">${[1, 2, 3].map((n) => `<i class="${n <= d.yildiz ? "on" : ""}">${IK.yildiz}</i>`).join("")}</span>` : ""}</span>
            </li>`;
          }).join("")}</ol>
        </section>`;
      }).join("")}`;
    $$(".dugum button").forEach((b) => (b.onclick = (e) => dugumAc(b.dataset.faz, b, e)));
    const aktif = $(".dugum.aktif");
    if (aktif && !yolCiz.kaydirildi) { yolCiz.kaydirildi = true; setTimeout(() => aktif.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" }), 250); }
  }

  /* Düğüme tıklayınca açılan kart */
  function dugumAc(id, btn) {
    $$(".pop").forEach((x) => x.remove());
    const p = fazlar.find((x) => x.id === id);
    const liste = fazlar.filter((x) => (x.track || "js") === (p.track || "js")).sort((a, b) => a.no - b.no);
    const li = btn.closest(".dugum");
    if (!acikMi(p, liste)) { li.classList.remove("salla"); void li.offsetWidth; li.classList.add("salla"); return; }
    const d = fazDurum(p);
    const pop = document.createElement("div");
    pop.className = "pop";
    pop.innerHTML = `<p class="muted small">Ders ${p.no}</p><h3>${esc(p.title)}</h3><p>${esc(p.goal)}</p>
      ${d ? `<p class="muted small">${d.tamam} kez tamamlandı · en iyi %${d.enIyi}</p>` : ""}
      <button class="btn primary blok-btn" id="pop-basla">${d ? "Tekrar et" : "Başla"} <span class="muted">≈ ${d ? 20 : 30} XP</span></button>`;
    li.append(pop);
    requestAnimationFrame(() => pop.classList.add("in"));
    $("#pop-basla").onclick = () => { pop.remove(); dersBaslat(P.dersUret(p, { mufredat: M, rehber: R, tohum: (d ? d.tamam + 1 : 1) * 7919 + Date.now() % 997 }), { faz: p }); };
    const kapat = (e) => { if (!pop.contains(e.target) && e.target !== btn && !btn.contains(e.target)) { pop.remove(); removeEventListener("pointerdown", kapat, true); } };
    setTimeout(() => addEventListener("pointerdown", kapat, true), 0);
  }

  /* ---------- Yan panel ---------- */
  function yanCiz() {
    const g = gunKaydi();
    const bugunXp = S.state.daily[S.day()] || 0, hedef = S.state.prefs.goal || 50;
    const oran = Math.min(1, bugunXp / hedef);
    const bekleyen = defterBekleyen();
    const toplamDefter = Object.values(st().defter).filter((k) => !k.ogrenildi).length;
    const ogrenilen = Object.values(st().defter).filter((k) => k.ogrenildi).length;
    const gunler = [...Array(7)].map((_, i) => { const d = new Date(Date.now() - (6 - i) * 864e5); return { ad: d.toLocaleDateString("tr-TR", { weekday: "short" }), xp: S.state.daily[S.day(d)] || 0 }; });
    const maks = Math.max(hedef, ...gunler.map((x) => x.xp));
    $("#yan").innerHTML = `
      <section class="kart hedef">
        <div class="hedef-halka" style="--p:${oran}"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="hb"/><circle cx="60" cy="60" r="52" class="hf"/></svg><div><b>${bugunXp}</b><span>/ ${hedef} XP</span></div></div>
        <div><h3>Günlük hedef</h3><p class="muted small">${oran >= 1 ? "Bugünün hedefi tamam. Seri devam ediyor." : `${hedef - bugunXp} XP kaldı. Bir ders yaklaşık 25 XP.`}</p>
        <p class="seri-b ${S.state.streak.last === S.day() ? "yandi" : ""}">${IK.alev}<b>${S.state.streak.count || 0} gün</b> seri · en uzun ${S.state.streak.best || 0}</p></div>
      </section>
      <section class="kart">
        <h3>Bugünün görevleri</h3>
        <ul class="gorevler">${bugununGorevleri().map((t) => { const v = Math.min(t.hedef, t.deger(g)); return `<li class="${v >= t.hedef ? "bitti" : ""}"><span class="g-ad">${esc(t.ad)}</span><span class="g-bar"><i style="width:${(v / t.hedef) * 100}%"></i></span><span class="g-say">${v}/${t.hedef}</span></li>`; }).join("")}</ul>
      </section>
      <section class="kart defter">
        <div class="defter-h">${IK.defter}<h3>Hata defteri</h3></div>
        <p class="muted small">${toplamDefter ? `${toplamDefter} soru defterde, <b>${bekleyen.length}</b> tanesi bugün tekrar zamanında. Yanlışlar hemen tekrar edilebilir; doğru bildikçe 1 → 3 → 7 gün arayla döner. Art arda 4 kez bilinen soru öğrenilmiş sayılır.` : "Henüz hata yok. Yanlış cevapladığın sorular burada toplanır ve unutmaya başladığın gün geri gelir."}${ogrenilen ? ` ${ogrenilen} soruyu öğrendin.` : ""}</p>
        <button class="btn ${bekleyen.length ? "primary" : ""} blok-btn" id="tekrar-et" ${bekleyen.length ? "" : "disabled"}>Hatalarını tekrar et${bekleyen.length ? ` (${Math.min(10, bekleyen.length)})` : ""}</button>
      </section>
      <section class="kart">
        <h3>Bu hafta</h3>
        <div class="hafta">${gunler.map((x, i) => `<div class="gun ${i === 6 ? "bugun" : ""}"><span class="sutun"><i style="--h:${maks ? x.xp / maks : 0};--i:${i}"></i></span><small>${esc(x.ad)}</small></div>`).join("")}</div>
      </section>
      <section class="kart bilim">
        <h3>Neden işe yarar?</h3>
        <dl>
          <dt>Hatırlamaya çalışmak</dt><dd>Cevabı kendin üretmeye çalışmak, tekrar okumaktan çok daha kalıcıdır (geri getirme pratiği).</dd>
          <dt>Satırları sıralamak</dt><dd>Parsons problemleri, kod yazmak kadar öğretir ama yarı sürede biter.</dd>
          <dt>Unutmadan önce tekrar</dt><dd>Hata defteri Leitner kutularıyla çalışır: bildiğin soru seyrekleşir, bilmediğin sık gelir.</dd>
          <dt>Karışık pratik</dt><dd>Her derste önceki derslerden bir soru da gelir; benzer konuları ayırt etmeyi öğretir.</dd>
        </dl>
      </section>`;
    $("#tekrar-et").onclick = () => {
      const anahtarlar = P.karistir(defterBekleyen(), P.rastgele(Date.now() % 100000)).slice(0, 10);
      const ogeler = P.tekrarDersi(anahtarlar, { mufredat: M, rehber: R, tohum: Date.now() % 100000 });
      if (ogeler.length) dersBaslat(ogeler, { tekrar: true });
    };
  }

  /* ---------- Ders motoru ---------- */
  let L = null;
  function dersBaslat(ogeler, secenek = {}) {
    if (!ogeler.length) return;
    L = { ogeler: ogeler.slice(), i: 0, toplam: ogeler.length, can: 5, kombo: 0, maxKombo: 0, dogru: 0, yanlis: 0, tekrarEdilen: new Set(), bas: Date.now(), faz: secenek.faz || null, tekrar: !!secenek.tekrar, cevap: null, kontrol: false };
    const k = $("#ders");
    k.hidden = false;
    document.body.classList.add("ders-acik");
    requestAnimationFrame(() => k.classList.add("in"));
    ogeCiz();
  }
  function dersKapat() {
    const k = $("#ders");
    k.classList.remove("in");
    document.body.classList.remove("ders-acik");
    setTimeout(() => { k.hidden = true; k.innerHTML = ""; }, reduced ? 0 : 260);
    L = null;
    ustCiz(); yolCiz(); yanCiz();
  }
  const ilerleme = () => Math.min(1, L.dogru / L.toplam);

  function kod(kodMetni, dil, secenek = {}) {
    const satirlar = KD.hlDoc ? KD.hlDoc(kodMetni, dil === "py" ? "py" : dil === "jsx" ? "jsx" : dil) : kodMetni.split("\n").map(esc);
    return `<pre class="kod ${secenek.numarali ? "num" : ""}"><code>${satirlar.map((l, i) => `<span class="sl">${secenek.numarali ? `<i>${i + 1}</i>` : ""}${(l || " ").replace(/␣␣␣/, '<span class="slot" id="slot">&nbsp;?&nbsp;</span>')}</span>`).join("")}</code></pre>`;
  }

  function ogeCiz() {
    const o = L.ogeler[L.i];
    L.cevap = null; L.kontrol = false; L.esHata = 0;
    const etiket = o.tur === "parsons" ? "Satırları sırala" : o.tur === "bosluk" ? "Boşluğu doldur" : o.tur === "hata" ? "Hatayı bul" : o.tur === "eslestir" ? "Eşleştir" : o.alt === "tahmin" ? "Çıktıyı tahmin et" : o.alt === "hatirlatma" ? "Hatırlatma" : "Hatırla";
    $("#ders").innerHTML = `
      <div class="d-ust">
        <button class="icon-btn" id="d-cik" aria-label="Dersten çık">${IK.x}</button>
        <div class="d-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(ilerleme() * 100)}"><i style="width:${ilerleme() * 100}%"></i></div>
        <div class="d-can ${L.can <= 1 ? "az" : ""}" aria-label="${L.can} can">${IK.kalp}<b>${L.can}</b></div>
      </div>
      <div class="d-govde" id="d-govde">
        <p class="d-etiket">${esc(etiket)}${o.alt === "hatirlatma" && o.hatirlatma ? ` · ${esc(o.hatirlatma)}` : ""}${L.kombo >= 3 ? `<span class="kombo">${IK.alev}${L.kombo} kombo</span>` : ""}</p>
        <h2 class="d-soru">${esc(o.soru)}</h2>
        ${o.baglam ? `<p class="muted small">${esc(o.baglam)}</p>` : ""}
        ${o.ipucu ? `<p class="muted small d-ipucu">${esc(o.ipucu)}</p>` : ""}
        <div class="d-alan" id="d-alan"></div>
      </div>
      <footer class="d-alt" id="d-alt"><div class="d-alt-in"><button class="btn ghost" id="d-atla">Bilmiyorum</button><button class="btn kontrol" id="d-kontrol" disabled>Kontrol et</button></div></footer>`;
    const alan = $("#d-alan");
    if (o.tur === "secim" || o.tur === "hata" || o.tur === "bosluk") {
      const uzun = o.secenekler.some((s) => s.length > 34);
      alan.innerHTML = `${o.kod ? kod(o.kod, o.kodDili || "js", { numarali: o.tur === "hata" }) : ""}
        <div class="secenekler ${uzun ? "tek" : ""} ${o.tur === "bosluk" ? "token" : ""}">${o.secenekler.map((s, i) => `<button class="sec" data-i="${i}" style="--i:${i}"><kbd>${i + 1}</kbd><span>${esc(s)}</span></button>`).join("")}</div>`;
      $$(".sec", alan).forEach((b) => (b.onclick = () => secimYap(Number(b.dataset.i))));
    } else if (o.tur === "parsons") {
      alan.innerHTML = `<ol class="p-cevap" id="p-cevap" aria-label="Cevabın"><li class="bosyer">Satırlara dokunarak buraya diz</li></ol>
        <div class="p-banka" id="p-banka">${o.parcalar.map((p, i) => `<button class="p-satir" data-id="${p.id}" style="--i:${i}"><code>${esc(p.metin)}</code></button>`).join("")}</div>`;
      const cevap = $("#p-cevap"), banka = $("#p-banka");
      const guncelle = () => {
        const secilen = $$(".p-satir", cevap);
        $(".bosyer", cevap).hidden = secilen.length > 0;
        L.cevap = secilen.map((b) => o.parcalar.find((p) => p.id === b.dataset.id).metin);
        $("#d-kontrol").disabled = $$(".p-satir", banka).length > 0;
      };
      alan.onclick = (e) => {
        const b = e.target.closest(".p-satir");
        if (!b || L.kontrol) return;
        const ilk = b.getBoundingClientRect();
        if (b.parentElement === banka) cevap.append(b); else banka.append(b);
        // FLIP: satır yeni yerine kayarak gider
        if (!reduced) { const son = b.getBoundingClientRect(); b.animate([{ transform: `translate(${ilk.left - son.left}px, ${ilk.top - son.top}px)` }, { transform: "none" }], { duration: 260, easing: "cubic-bezier(.22,1,.36,1)" }); }
        guncelle();
      };
      guncelle();
    } else if (o.tur === "eslestir") {
      alan.innerHTML = `<div class="es"><div class="es-sol">${o.ciftler.map(([s], i) => `<button class="es-b" data-sol="${esc(s)}" style="--i:${i}">${esc(s)}</button>`).join("")}</div>
        <div class="es-sag">${o.sag.map((s, i) => `<button class="es-b mono" data-sag="${esc(s)}" style="--i:${i + 4}">${esc(s)}</button>`).join("")}</div></div>`;
      let secSol = null;
      const eslesen = [];
      alan.onclick = (e) => {
        const b = e.target.closest(".es-b");
        if (!b || b.classList.contains("tamam") || L.kontrol) return;
        if (b.dataset.sol !== undefined) { $$(".es-sol .es-b").forEach((x) => x.classList.remove("secili")); b.classList.add("secili"); secSol = b; return; }
        if (!secSol) { b.classList.add("ipucu"); setTimeout(() => b.classList.remove("ipucu"), 400); return; }
        const dogruSag = o.ciftler.find(([s]) => s === secSol.dataset.sol)[1];
        if (b.dataset.sag === dogruSag) {
          secSol.classList.remove("secili"); secSol.classList.add("tamam"); b.classList.add("tamam");
          eslesen.push([secSol.dataset.sol, b.dataset.sag]); secSol = null; ses("dogru");
          if (eslesen.length === o.ciftler.length) { L.cevap = eslesen; kontrolEt(L.esHata <= 1); }
        } else {
          L.esHata++; ses("yanlis");
          [secSol, b].forEach((x) => { x.classList.remove("yanlis"); void x.offsetWidth; x.classList.add("yanlis"); });
        }
      };
      $("#d-kontrol").hidden = true;
    }
    $("#d-cik").onclick = cikisSor;
    $("#d-atla").onclick = () => kontrolEt(false, true);
    $("#d-kontrol").onclick = () => (L.kontrol ? devam() : kontrolEt());
  }

  function secimYap(i) {
    if (L.kontrol) return;
    const o = L.ogeler[L.i];
    L.cevap = i;
    $$(".sec").forEach((b) => b.classList.toggle("secili", Number(b.dataset.i) === i));
    if (o.tur === "bosluk" && $("#slot")) { $("#slot").textContent = o.secenekler[i]; $("#slot").classList.add("dolu"); }
    $("#d-kontrol").disabled = false;
  }

  function kontrolEt(zorla, atla) {
    if (!L || L.kontrol) return;
    const o = L.ogeler[L.i];
    const dogru = zorla !== undefined ? zorla : P.kontrol(o, L.cevap);
    L.kontrol = true;
    const def = st().defter;
    const g = gunKaydi();
    if (dogru) {
      L.dogru++; L.kombo++; L.maxKombo = Math.max(L.maxKombo, L.kombo);
      g.dogru++; g.kombo = Math.max(g.kombo, L.kombo);
      if (def[o.anahtar] || L.tekrar) { def[o.anahtar] = P.leitner(def[o.anahtar], true); if (L.tekrar) g.tekrar++; }
      ses("dogru");
    } else {
      L.yanlis++; L.kombo = 0; L.can--;
      def[o.anahtar] = P.leitner(def[o.anahtar], false);
      if (!L.tekrarEdilen.has(o.anahtar)) { L.tekrarEdilen.add(o.anahtar); L.ogeler.push(o); } // yanlış soru ders sonunda yeniden gelir
      ses("yanlis");
      const can = $(".d-can");
      if (can) { can.classList.remove("kirildi"); void can.offsetWidth; can.classList.add("kirildi"); $("b", can).textContent = L.can; }
    }
    kaydet();
    // Seçenekleri işaretle
    if (o.tur === "secim" || o.tur === "hata" || o.tur === "bosluk") {
      $$(".sec").forEach((b) => { const i = Number(b.dataset.i); b.disabled = true; if (i === o.dogru) b.classList.add("dogru"); else if (i === L.cevap) b.classList.add("yanlis"); });
      if (o.tur === "bosluk" && $("#slot")) { $("#slot").textContent = o.secenekler[o.dogru]; $("#slot").classList.add(dogru ? "ok" : "duzeltildi"); }
    }
    if (o.tur === "parsons") {
      const satirlar = $$("#p-cevap .p-satir");
      satirlar.forEach((b, i) => b.classList.add(o.parcalar.find((p) => p.id === b.dataset.id).metin === o.dogru[i] ? "dogru" : "yanlis"));
    }
    $(".d-bar i").style.width = ilerleme() * 100 + "%";
    const dogruCevap = o.tur === "secim" || o.tur === "hata" || o.tur === "bosluk" ? o.secenekler[o.dogru] : o.tur === "parsons" ? null : null;
    const ovgu = ["Harika!", "Çok iyi!", "Tam isabet!", "Doğru!", "Süper!"][L.dogru % 5];
    const alt = $("#d-alt");
    alt.className = "d-alt " + (dogru ? "iyi" : "kotu");
    alt.innerHTML = `<div class="d-alt-in">
      <div class="sonuc-m"><span class="rozet">${dogru ? IK.tik : IK.x}</span><div>
        <b>${dogru ? (L.kombo >= 5 && L.kombo % 5 === 0 ? `${L.kombo} kombo! +5 XP` : ovgu) : atla ? "Sorun değil, doğrusu:" : "Doğru cevap:"}</b>
        ${!dogru && dogruCevap ? `<p class="mono">${esc(dogruCevap)}</p>` : ""}
        ${!dogru && o.tur === "parsons" ? `<pre class="kod mini"><code>${esc(o.dogru.join("\n"))}</code></pre>` : ""}
        ${o.aciklama && (!dogru || o.alt === "tahmin") ? `<p class="aciklama">${esc(o.aciklama)}</p>` : ""}
      </div></div>
      <button class="btn kontrol" id="d-devam">${L.can <= 0 ? "Bitir" : "Devam"}</button></div>`;
    $("#d-devam").onclick = devam;
    $("#d-devam").focus({ preventScroll: true });
  }

  function devam() {
    if (!L) return;
    if (L.can <= 0) return sonEkrani(false);
    L.i++;
    if (L.i >= L.ogeler.length) return sonEkrani(true);
    const g = $("#d-govde");
    if (g && !reduced) { g.classList.add("cikis"); setTimeout(ogeCiz, 160); } else ogeCiz();
  }

  function sonEkrani(basarili) {
    const sure = Math.round((Date.now() - L.bas) / 1000);
    const deneme = L.dogru + L.yanlis;
    const isabet = deneme ? Math.round((L.dogru / deneme) * 100) : 0;
    let xp = 0;
    if (basarili) {
      xp = L.dogru * 2 + Math.floor(L.maxKombo / 5) * 5 + (L.tekrar ? 5 : L.faz && fazDurum(L.faz) ? 5 : 10) + (L.yanlis === 0 ? 5 : 0);
      S.addXP(xp);
      const g = gunKaydi();
      g.ders++; if (L.yanlis === 0) g.kusursuz++;
      if (L.faz) {
        const eski = st().dersler[L.faz.id] || { tamam: 0, yildiz: 0, enIyi: 0 };
        const yildiz = isabet >= 90 ? 3 : isabet >= 75 ? 2 : 1;
        st().dersler[L.faz.id] = { tamam: eski.tamam + 1, yildiz: Math.max(eski.yildiz, yildiz), enIyi: Math.max(eski.enIyi, isabet), son: Date.now() };
        // Pratik, NextGen'deki beceri modeline de zayıf bir kanıt olarak yansır
        if (KD.bkt) KD.bkt.observe(L.faz.id, isabet >= 75, 0.4);
      }
      kaydet();
      ses("bitti");
    }
    const yildiz = isabet >= 90 ? 3 : isabet >= 75 ? 2 : 1;
    $("#ders").innerHTML = `
      <div class="son ${basarili ? "" : "kayip"}">
        ${basarili && !reduced ? `<div class="konfeti" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 7) * 70}ms;--r:${(i * 53) % 360}deg;--c:${["var(--marker)", "var(--pass)", "var(--link)", "#ff8fb7"][i % 4]}"></i>`).join("")}</div>` : ""}
        <p class="kicker">${basarili ? (L.tekrar ? "Tekrar tamam" : "Ders tamam") : "Canların bitti"}</p>
        <h2>${basarili ? (L.yanlis === 0 ? "Kusursuz!" : isabet >= 75 ? "Çok iyi iş çıkardın." : "Bitirdin. Yanlışların defterde.") : "Bu sefer olmadı."}</h2>
        ${basarili && !L.tekrar ? `<div class="son-yildiz">${[1, 2, 3].map((n) => `<span class="${n <= yildiz ? "on" : ""}" style="--i:${n}">${IK.yildiz}</span>`).join("")}</div>` : ""}
        <div class="son-kutular">
          <div class="sk xp"><small>Kazanılan XP</small><b data-say="${xp}">0</b></div>
          <div class="sk"><small>İsabet</small><b>%${isabet}</b></div>
          <div class="sk"><small>En uzun kombo</small><b>${L.maxKombo}</b></div>
          <div class="sk"><small>Süre</small><b>${Math.floor(sure / 60)}:${String(sure % 60).padStart(2, "0")}</b></div>
        </div>
        ${L.yanlis ? `<p class="muted">${L.yanlis} yanlış hata defterine eklendi. Yan paneldeki “Hatalarını tekrar et” ile hemen pekiştirebilirsin.</p>` : ""}
        <div class="son-btn">${basarili ? "" : `<button class="btn" id="tekrar-dene">Tekrar dene</button>`}<button class="btn kontrol" id="son-devam">Devam</button></div>
      </div>`;
    const b = $("[data-say]");
    if (b) { const h = Number(b.dataset.say), t0 = performance.now(); const f = (t) => { const k = Math.min(1, (t - t0) / 900); b.textContent = "+" + Math.round(h * (1 - Math.pow(1 - k, 3))); if (k < 1 && !reduced) requestAnimationFrame(f); else b.textContent = "+" + h; }; requestAnimationFrame(f); }
    const faz = L.faz;
    $("#son-devam").onclick = dersKapat;
    $("#son-devam").focus();
    if ($("#tekrar-dene")) $("#tekrar-dene").onclick = () => { dersKapat(); if (faz) setTimeout(() => dersBaslat(P.dersUret(faz, { mufredat: M, rehber: R, tohum: Date.now() % 9973 }), { faz }), 300); };
  }

  function cikisSor() {
    if (!L || (L.dogru + L.yanlis === 0)) return dersKapat();
    const k = document.createElement("div");
    k.className = "cikis-sor";
    k.innerHTML = `<div class="cs-kart"><h3>Dersten çıkılsın mı?</h3><p class="muted">Bu dersteki ilerlemen kaydedilmez; yanlışların hata defterinde kalır.</p><div class="row"><button class="btn kontrol" id="cs-kal">Devam et</button><button class="btn ghost" id="cs-cik">Çık</button></div></div>`;
    $("#ders").append(k);
    $("#cs-kal").onclick = () => k.remove();
    $("#cs-cik").onclick = dersKapat;
    $("#cs-kal").focus();
  }

  /* Klavye: 1–4 seçer, Enter kontrol/devam, Esc çıkış */
  addEventListener("keydown", (e) => {
    if (!L || e.target.tagName === "INPUT") return;
    const o = L.ogeler[L.i];
    if (/^[1-9]$/.test(e.key) && o && o.secenekler && !L.kontrol && Number(e.key) <= o.secenekler.length) { secimYap(Number(e.key) - 1); e.preventDefault(); }
    else if (e.key === "Enter") {
      if ($(".cikis-sor")) return;
      const dv = $("#d-devam"), kt = $("#d-kontrol"), sn = $("#son-devam");
      if (sn) sn.click(); else if (dv) dv.click(); else if (kt && !kt.disabled && !kt.hidden) kt.click();
      e.preventDefault();
    } else if (e.key === "Escape") { if ($(".cikis-sor")) $(".cikis-sor").remove(); else cikisSor(); }
  });

  $("#ses").onclick = () => { st().ses = !st().ses; kaydet(); ustCiz(); if (st().ses) ses("dogru"); };
  $("#tema").onclick = () => {
    const yeni = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = yeni;
    S.state.prefs.theme = yeni; kaydet();
  };
  // Hesapla eşitleme (giriş yapılmışsa)
  if (KD.hesap) KD.hesap.ben().then((u) => u && KD.hesap.esitle()).then((degisti) => { if (degisti) { ustCiz(); yolCiz(); yanCiz(); } }).catch(() => {});

  ustCiz(); yolCiz(); yanCiz();
})();
