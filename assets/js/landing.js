/* QUAGEN — ana sayfa etkileşimleri: canlı deneme görevi, parkur sekmeleri, NextGen geçişi */
(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);

  const nav = $("#nav");
  /* Hesap: giriş yapılmışsa menüde avatar */
  if (window.KD && KD.hesapYok && $("#nav-login")) $("#nav-login").hidden = true;
  if (window.KD && KD.hesap) KD.hesap.ben().then((u) => {
    const l = $("#nav-login"); if (!l || !u) return;
    const bas = String(u.ad || u.kullaniciAdi).trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toLocaleUpperCase("tr");
    l.outerHTML = `<a class="nav-user" href="nextgen.html#profil" title="Profilim"><span class="nav-av">${esc(bas)}</span><span class="nav-un">${esc(u.ad || "@" + u.kullaniciAdi)}</span></a>`;
  });
  /* Açılış koreografisi ve kaydırdıkça beliren bölümler */
  requestAnimationFrame(() => document.body.classList.add("ready"));
  const bolumler = document.querySelectorAll(".section .sec-head, .flow > li, .evidence > div, .feats > div, .faq details, .tracks, .mentor-copy, .chat, .cta-in, .arac");
  bolumler.forEach((el) => el.classList.add("rv"));
  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    bolumler.forEach((el) => io.observe(el));
  } else bolumler.forEach((el) => el.classList.add("in"));
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });

  /* ---------- Rehber önizlemesi: niyet araması canlı çalışır ---------- */
  const rdGirdi = $("#rd-girdi"), rdSonuc = $("#rd-sonuc");
  if (rdGirdi && window.KD_REHBER_ARA) {
    const R = window.KD_REHBER;
    const goster = () => {
      const q = rdGirdi.value.trim();
      const r = q ? window.KD_REHBER_ARA(q) : { sonuclar: [] };
      const ilk = r.sonuclar.find((x) => x.tur === "kavram");
      if (!ilk) { rdSonuc.innerHTML = q ? '<p class="rd-yok">Daha basit kelimelerle dene: “metni böl”, “listeyi sırala”…</p>' : ""; return; }
      const k = ilk.kavram;
      rdSonuc.innerHTML = `<p class="rd-baslik"><span>Niyet</span>${esc(k.baslik)}</p><div class="rd-eq">${["js", "py", "c", "sql", "html", "css"].filter((d) => k.diller[d]).map((d, i) => `<a href="rehber.html#/k/${k.id}/${d}" style="--c:${R.DILLER[d].renk};--i:${i}"><b>${R.DILLER[d].kisa}</b><code>${esc(k.diller[d].ad)}</code></a>`).join("")}</div>`;
    };
    let zz;
    rdGirdi.addEventListener("input", () => { clearTimeout(zz); zz = setTimeout(goster, 140); });
    $("#rd").addEventListener("submit", (e) => { e.preventDefault(); location.href = "rehber.html#/ara/" + encodeURIComponent(rdGirdi.value.trim()); });
    goster();
  }

  /* ---------- Canlı deneme görevi (Faz 1, görev 1) ---------- */
  const C = window.KD_CURRICULUM || [];
  const ch = C[0] && C[0].challenges[0];
  const host = $("#try-editor");
  let get = () => "";
  if (ch && host) {
    let saved = null;
    try { saved = KD.store.state.code[ch.id]; } catch (e) {}
    const start = saved || ch.starter;
    if (window.CodeMirror) {
      const cm = CodeMirror(host, { value: start, mode: "javascript", lineNumbers: true, tabSize: 2, indentUnit: 2, autoCloseBrackets: true, lineWrapping: true,
        extraKeys: { "Ctrl-Enter": () => run(), "Cmd-Enter": () => run(), Tab: (c) => c.execCommand("insertSoftTab") } });
      cm.on("change", () => { try { KD.store.state.code[ch.id] = cm.getValue(); KD.store.save(); } catch (e) {} });
      get = () => cm.getValue();
    } else {
      const ta = Object.assign(document.createElement("textarea"), { className: "fallback", value: start, spellcheck: false });
      ta.setAttribute("aria-label", "Kod editörü");
      host.appendChild(ta); get = () => ta.value;
    }
    $("#try-kbd").textContent = isMac ? "⌘" : "Ctrl";
    $("#try-run").onclick = run;
  }

  async function run() {
    const btn = $("#try-run"), list = $("#try-tests"), lis = [...list.children], say = $("#try-say");
    btn.disabled = true; btn.textContent = "Test ediliyor…"; list.classList.add("running");
    lis.forEach((li) => (li.className = ""));
    const res = await KD.run(get(), { fn: ch.fn, tests: ch.tests });
    btn.disabled = false; btn.textContent = "Testleri çalıştır"; list.classList.remove("running");
    const rs = res.results || [];
    lis.forEach((li, i) => {
      const r = rs[i]; if (!r) return;
      li.className = r.pass ? "pass" : "fail";
      li.querySelector(".te").dataset.got = r.pass ? "" : "gelen " + r.got;
    });
    const ok = !res.error && rs.length && rs.every((r) => r.pass);
    if (ok) {
      say.textContent = "Tüm testler geçti. Template literal'ı doğru kullandın.";
      $("#try-done").hidden = false;
      try {
        const ph = KD.store.phase("p1");
        if (!ph.passed[ch.id]) { ph.passed[ch.id] = true; ph.attempts[ch.id] = (ph.attempts[ch.id] || 0) + 1; KD.store.state.stats.hintless++; KD.store.addXP(70); KD.srs.enroll(C[0].cards.map((c) => c.id)); }
      } catch (e) {}
      return;
    }
    const d = KD.tutor.diagnose(res, ch);
    say.textContent = d.length ? d[0].replace(/`/g, "") : "Testlerden biri geçmedi. Beklenen ile gelen değeri karşılaştır.";
  }

  /* ---------- Parkur sekmeleri ---------- */
  const TRACKS = [
    { id: "js", title: "JavaScript temelleri", req: "Başlangıç noktası. Ön koşul yok.", desc: "Değişkenlerden asenkron koda kadar dilin kendisi. Her şey bunun üzerine kurulur." },
    { id: "web", title: "Web temelleri", req: "JavaScript temellerinden sonra açılır.", desc: "Anlamlı HTML, CSS yerleşimi, DOM, olaylar, formlar ve fetch. Sonunda kendi yapılacaklar uygulamanı kurarsın." },
    { id: "react", title: "React", req: "Web temellerinden sonra açılır.", desc: "Gerçek React 18 ile bileşenler, state, effect, reducer, context ve bir kurs kataloğu projesi." },
    { id: "algo", title: "Algoritmalar", req: "JavaScript temellerinden sonra açılır.", desc: "Big-O, hash map, iki işaretçi, kayan pencere, yığın, ikili arama, sıralama, bağlı liste, ağaç ve graf. Testler hızı da ölçer." },
    { id: "c", title: "C", parkurlar: ["c", "c2"], req: "Ayrı bir dil; ön koşul yok. İleri C, temellerden sonra açılır.", desc: "printf'ten komut satırı aracına: türler, işaretçiler, struct'lar ve dinamik bellek; sonra bit işlemleri, fonksiyon işaretçileri, makrolar, hash tablosu, arama ağacı ve matrisler. Kod gerçek derleyiciyle, bellek hatası denetimi açık çalışır." },
    { id: "py", title: "Python", parkurlar: ["py", "py2"], req: "Ayrı bir dil; ön koşul yok. İleri Python, temellerden sonra açılır.", desc: "print'ten veri raporuna: değişkenler, listeler, sözlükler, kavramalar ve istisnalar; sonra sınıflar, üreteçler, dekoratörler, collections, re, csv ve json. Kod tarayıcında gerçek Python 3.12 ile çalışır." },
    { id: "backend", title: "Backend", req: "JavaScript temellerinden sonra açılır.", desc: "HTTP ve REST, doğrulama, parola özeti ve imzalı belirteçler, gerçek SQLite ile SQL, şema ve indeksler, önbellek ve hız sınırlama. Sonunda veritabanına bağlı bir API yazarsın." }
  ];
  const tabs = $("#track-tabs"), panel = $("#track-panel");
  const parkurda = (t) => (p) => (t.parkurlar || [t.id]).includes(p.track || "js");
  if (tabs && C.length) {
    tabs.innerHTML = TRACKS.map((t, i) => {
      const n = C.filter(parkurda(t)).length;
      if (!n) return "";
      return `<button role="tab" id="tab-${t.id}" aria-controls="track-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-id="${t.id}">${t.title}<small>${n} faz</small></button>`;
    }).join("");
    const show = (id) => {
      const t = TRACKS.find((x) => x.id === id);
      [...tabs.children].forEach((b) => { const on = b.dataset.id === id; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
      panel.setAttribute("aria-labelledby", "tab-" + id);
      const ps = C.filter(parkurda(t));
      panel.innerHTML = `<div class="track-intro"><p>${esc(t.desc)}</p><span class="req">${esc(t.req)}</span></div>
        <ol class="phase-rows">${ps.map((p) => `<li>
          <span class="pr-no">${p.no}</span>
          <div class="pr-t"><h3>${esc(p.title)}</h3><p>${esc(p.goal)}</p></div>
          <ul class="pr-tasks">${p.challenges.map((c) => `<li><span class="kind">${esc(c.kind)}</span>${esc(c.title)}</li>`).join("")}</ul>
        </li>`).join("")}</ol>`;
    };
    tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(b.dataset.id); });
    tabs.addEventListener("keydown", (e) => {
      const bs = [...tabs.children], i = bs.findIndex((b) => b.getAttribute("aria-selected") === "true");
      const j = e.key === "ArrowRight" ? (i + 1) % bs.length : e.key === "ArrowLeft" ? (i - 1 + bs.length) % bs.length : -1;
      if (j >= 0) { e.preventDefault(); show(bs[j].dataset.id); bs[j].focus(); }
    });
    show("js");
  }

  /* ---------- NextGen'e geçiş: dairesel açılış + yıldız alanı + harf karıştırma ---------- */
  const warp = $("#warp"), cv = $("#warp-canvas"), ctx = cv.getContext("2d");
  const title = $("#warp-title"), status = $("#warp-status");
  let running = false;

  function starfield() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = (cv.width = innerWidth * dpr), H = (cv.height = innerHeight * dpr);
    const cx = W / 2, cy = H / 2, N = innerWidth < 700 ? 360 : 820;
    const stars = Array.from({ length: N }, () => ({ x: (Math.random() - 0.5) * W * 2, y: (Math.random() - 0.5) * H * 2, z: Math.random() * W, pz: 0, m: Math.random() < 0.14 }));
    stars.forEach((s) => (s.pz = s.z));
    const t0 = performance.now();
    (function frame(t) {
      if (!running) return;
      const el = (t - t0) / 1000, speed = 2 + Math.pow(el, 2.6) * 90;
      ctx.fillStyle = `rgba(12,20,36,${el < 0.2 ? 1 : 0.35})`;
      ctx.fillRect(0, 0, W, H);
      for (const s of stars) {
        s.pz = s.z; s.z -= speed * dpr;
        if (s.z < 1) { s.x = (Math.random() - 0.5) * W * 2; s.y = (Math.random() - 0.5) * H * 2; s.z = W; s.pz = W; }
        const k = (0.5 * W) / s.z, pk = (0.5 * W) / s.pz, a = Math.min(1, (1 - s.z / W) * 1.6);
        ctx.strokeStyle = s.m ? `rgba(255,216,77,${a})` : `rgba(231,236,244,${a})`;
        ctx.lineWidth = Math.max(0.6, (1 - s.z / W) * 2.6 * dpr);
        ctx.beginPath(); ctx.moveTo(cx + s.x * pk, cy + s.y * pk); ctx.lineTo(cx + s.x * k, cy + s.y * k); ctx.stroke();
      }
      requestAnimationFrame(frame);
    })(t0);
  }

  function scramble(el, target, dur) {
    const chars = "{}[]<>/=+*;01";
    const t0 = performance.now();
    (function f(t) {
      const k = Math.min(1, (t - t0) / dur), fixed = Math.floor(k * target.length);
      el.innerHTML = target.split("").map((c, i) => (i < fixed ? (i >= 4 ? `<span class="g">${c}</span>` : c) : chars[(Math.random() * chars.length) | 0])).join("");
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* ---------- Dil seçimi ---------- */
  const LANGS = (window.KD && KD.LANGS) || [{ id: "js", ad: "JavaScript", kisa: "JS", aciklama: "" }];
  const chooser = $("#chooser"), list = $("#chooser-list");
  function langProgress(id) {
    const st = KD.readLangState ? KD.readLangState(id) : null;
    const phases = C.filter((p) => (p.language || "js") === id);
    const total = phases.reduce((n, p) => n + p.challenges.length, 0);
    const passed = st ? phases.reduce((n, p) => n + p.challenges.filter((c) => st.phases && st.phases[p.id] && st.phases[p.id].passed && st.phases[p.id].passed[c.id]).length, 0) : 0;
    return { total, passed, phases: phases.length };
  }
  function openChooser(e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    if (!chooser || !chooser.showModal) { location.href = "nextgen.html"; return; }
    let last = "js";
    try { last = localStorage.getItem("kd-lang") || "js"; } catch (_) {}
    list.innerHTML = LANGS.map((l) => {
      const pr = langProgress(l.id);
      return `<button type="button" class="ch-card ${l.id === last ? "last" : ""}" data-dil="${l.id}">
        <span class="ch-mark">${esc(l.kisa)}</span>
        <span class="ch-body"><b>${esc(l.ad)}</b><span>${esc(l.aciklama)}</span>
          <small>${pr.phases} faz · ${pr.total} görev${pr.passed ? ` · ${pr.passed} görev geçtin` : ""}</small></span>
        <span class="ch-go">${pr.passed ? "Devam et" : "Başla"}</span>
      </button>`;
    }).join("");
    list.querySelectorAll(".ch-card").forEach((b) => b.addEventListener("click", () => {
      const r = b.getBoundingClientRect();
      chooser.close();
      startWarp("nextgen.html?dil=" + b.dataset.dil + "#panel", r, b.dataset.dil);
    }));
    chooser.showModal();
    const lastBtn = list.querySelector(".ch-card.last") || list.querySelector(".ch-card");
    if (lastBtn) lastBtn.focus();
  }
  chooser && chooser.addEventListener("click", (e) => { if (e.target === chooser) chooser.close(); });

  function launch(e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    if (running) return;
    startWarp(e.currentTarget.getAttribute("href"), e.currentTarget.getBoundingClientRect(), e.currentTarget.dataset.dil);
  }
  function startWarp(href, r, dil) {
    if (running) return;
    try { if (dil) localStorage.setItem("kd-lang", dil); } catch (_) {}
    try { sessionStorage.setItem("kd-warp", "1"); } catch (_) {}
    if (reduced) { location.href = href; return; }
    warp.style.setProperty("--x", r.left + r.width / 2 + "px");
    warp.style.setProperty("--y", r.top + r.height / 2 + "px");
    running = true;
    starfield();
    requestAnimationFrame(() => warp.classList.add("on"));
    scramble(title, "NextGen", 850);
    const dilAd = dil && (LANGS.find((l) => l.id === dil) || {}).ad;
    [dilAd ? dilAd + " ortamı hazırlanıyor" : "Ortam hazırlanıyor", dil === "c" ? "clang ve AddressSanitizer bağlanıyor" : dil === "py" ? "Python 3.12 (WebAssembly) yükleniyor" : "Derleyici yükleniyor", "Kaldığın yer yükleniyor", "Mentor hazır"].forEach((m, i) => setTimeout(() => (status.textContent = m), 280 + i * 330));
    setTimeout(() => warp.classList.add("flash"), 1600);
    setTimeout(() => (location.href = href), 1880);
  }
  document.querySelectorAll(".js-warp").forEach((a) => a.addEventListener("click", a.dataset.dil ? launch : openChooser));
  addEventListener("pageshow", (e) => { if (e.persisted) { running = false; warp.classList.remove("on", "flash"); } });
})();
