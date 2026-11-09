/* QUAGEN — herkese açık portföy */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = $("#pf");
  const kullanici = (location.pathname.match(/^\/p\/([a-z0-9_-]{3,24})/) || [])[1] || new URLSearchParams(location.search).get("u");
  const bas = (n) => String(n || "K").trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toLocaleUpperCase("tr");

  function ring(oran, i) {
    const r = 44, c = 2 * Math.PI * r;
    return `<svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="${r}" class="ring-bg"/><circle cx="50" cy="50" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-hedef="${c * (1 - oran)}" style="--d:${i * 120}ms"/></svg>`;
  }
  const harfler = (t) => esc(t).split("").map((ch, i) => (ch === " " ? " " : `<span class="ch" style="--i:${i}">${ch}</span>`)).join("");

  function yok(mesaj) {
    document.title = "Portföy bulunamadı — QUAGEN";
    root.innerHTML = `<section class="empty reveal in"><p class="big-404">404</p><h1>${esc(mesaj)}</h1><p>Kullanıcı adını kontrol et. Portföy sahibi onu gizlemiş de olabilir.</p><a class="btn" href="/index.html">QUAGEN'e git</a></section>`;
  }

  async function yukle() {
    if (!kullanici) return yok("Bu portföy bulunamadı.");
    let p;
    try {
      const r = await fetch("/api/portfoy/" + encodeURIComponent(kullanici));
      if (!r.ok) return yok("Bu portföy bulunamadı ya da gizli.");
      p = (await r.json()).portfoy;
    } catch (_) { return yok("Portföy yüklenemedi."); }
    const ad = p.ad || "@" + p.kullaniciAdi;
    document.title = `${ad} — QUAGEN portföyü`;
    const diller = (p.ozet && p.ozet.diller) || [];
    const toplamGorev = diller.reduce((n, d) => n + (d.gecilen || 0), 0);
    const toplamXp = diller.reduce((n, d) => n + (d.xp || 0), 0);
    const enUzun = Math.max(0, ...diller.map((d) => d.enUzunSeri || 0));
    const sertifikalar = diller.flatMap((d) => (d.parkurlar || []).filter((t) => t.toplam && t.gecilen === t.toplam).map((t) => ({ dil: d.ad, ad: t.ad })));
    const b = p.baglantilar || {};
    const linkler = [["GitHub", b.github], ["LinkedIn", b.linkedin], ["Web", b.web]].filter((x) => x[1]);

    root.innerHTML = `
      <section class="hero">
        <div class="hero-av" aria-hidden="true"><span>${esc(bas(p.ad || p.kullaniciAdi))}</span></div>
        <div class="hero-txt">
          <p class="handle">@${esc(p.kullaniciAdi)}${p.konum ? ` · ${esc(p.konum)}` : ""}</p>
          <h1 class="name" aria-label="${esc(ad)}">${harfler(ad)}</h1>
          ${p.baslik ? `<p class="headline">${esc(p.baslik)}</p>` : ""}
          ${p.bio ? `<p class="bio">${esc(p.bio)}</p>` : ""}
          <div class="links">${linkler.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener nofollow">${t}</a>`).join("")}<span class="since">QUAGEN'de ${new Date(p.uyelik).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}'den beri</span></div>
        </div>
      </section>

      <section class="stats reveal">
        <div><b data-count="${toplamGorev}">0</b><span>testli görev geçti</span></div>
        <div><b data-count="${diller.length}">0</b><span>dil</span></div>
        <div><b data-count="${sertifikalar.length}">0</b><span>sertifika</span></div>
        <div><b data-count="${toplamXp}">0</b><span>XP</span></div>
        <div><b data-count="${enUzun}">0</b><span>gün en uzun seri</span></div>
      </section>

      ${diller.length ? `<section class="sec reveal"><h2>Diller ve parkurlar</h2>
        <div class="langs">${diller.map((d, i) => `
          <article class="lang">
            <div class="lang-ring">${ring(d.toplam ? d.gecilen / d.toplam : 0, i)}<div class="lr-in"><b>${d.toplam ? Math.round((d.gecilen / d.toplam) * 100) : 0}%</b><span>${esc(d.ad)}</span></div></div>
            <ul class="tracks">${(d.parkurlar || []).map((t) => `<li class="${t.toplam && t.gecilen === t.toplam ? "done" : ""}"><span>${esc(t.ad)}</span><span class="tm"><i style="--w:${t.toplam ? (t.gecilen / t.toplam) * 100 : 0}%"></i></span><small>${t.gecilen}/${t.toplam}</small></li>`).join("")}</ul>
          </article>`).join("")}</div></section>` : ""}

      ${sertifikalar.length ? `<section class="sec reveal"><h2>Sertifikalar</h2><div class="certs">${sertifikalar.map((c) => `<div class="cert"><span class="seal" aria-hidden="true"></span><b>${esc(c.ad)}</b><small>${esc(c.dil)} · tüm görevler testlerle doğrulandı</small></div>`).join("")}</div></section>` : ""}

      ${diller.some((d) => (d.beceriler || []).some((x) => x.v != null)) ? `<section class="sec reveal"><h2>Beceri haritası</h2><p class="muted">Her kare bir konu. Renk, Bayesçi bilgi takibiyle tahmin edilen hâkimiyet düzeyi.</p>
        ${diller.map((d) => `<div class="skills"><span class="sk-t">${esc(d.ad)}</span><div class="sk-cells">${(d.beceriler || []).map((x, i) => `<span class="sk lv-${x.v == null ? 0 : x.v < 40 ? 1 : x.v < 70 ? 2 : x.v < 95 ? 3 : 4}" style="--i:${i}" title="${esc(x.ad)}${x.v == null ? "" : " · %" + x.v}">${x.no}</span>`).join("")}</div></div>`).join("")}
        <div class="sk-legend"><span><i class="lv-1"></i>Başlangıç</span><span><i class="lv-2"></i>Gelişiyor</span><span><i class="lv-3"></i>Yakın</span><span><i class="lv-4"></i>Hâkim</span></div></section>` : ""}

      ${(p.projeler || []).length ? `<section class="sec reveal"><h2>Öne çıkan çözümler</h2><div class="projects">${p.projeler.map((x, i) => `
        <article class="proj" style="--i:${i}">
          <div class="proj-top"><span class="tag">${esc(x.dil === "c" ? "C" : x.dil === "py" ? "Python" : x.kodDili === "jsx" ? "React" : x.kodDili === "sql" ? "SQL" : x.kodDili === "html" ? "HTML" : x.kodDili === "css" ? "CSS" : "JavaScript")}</span><span class="ok">Testleri geçti</span></div>
          <h3>${esc(x.baslik)}</h3>
          <p class="muted small">${esc(x.faz)}</p>
          ${x.not ? `<p class="note">${esc(x.not)}</p>` : ""}
          <button class="code-toggle" aria-expanded="false">Kodu göster</button>
          <div class="code-wrap"><pre class="code">${KD.hlDoc(x.kod, x.kodDili === "jsx" ? "jsx" : x.kodDili).map((l, k) => `<span class="ln" style="--n:${k}"><i class="n">${k + 1}</i>${l || " "}</span>`).join("")}</pre></div>
        </article>`).join("")}</div></section>` : ""}`;

    // Hareket
    $$(".code-toggle").forEach((btn) => btn.addEventListener("click", () => {
      const wrap = btn.nextElementSibling, acik = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !acik); btn.textContent = acik ? "Kodu göster" : "Kodu gizle";
      wrap.style.maxHeight = acik ? "0px" : wrap.scrollHeight + "px";
      wrap.classList.toggle("open", !acik);
    }));
    const sayac = (el) => {
      const h = Number(el.dataset.count) || 0;
      if (reduced || !h) { el.textContent = h.toLocaleString("tr-TR"); return; }
      const t0 = performance.now(), s = 900;
      const f = (t) => { const k = Math.min(1, (t - t0) / s); el.textContent = Math.round(h * (1 - Math.pow(1 - k, 3))).toLocaleString("tr-TR"); if (k < 1) requestAnimationFrame(f); };
      requestAnimationFrame(f);
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(sayac);
      $$(".ring-fg", e.target).forEach((c) => (c.style.strokeDashoffset = c.dataset.hedef));
      io.unobserve(e.target);
    }), { threshold: 0.15 });
    $$(".reveal").forEach((el) => (reduced ? (el.classList.add("in"), $$("[data-count]", el).forEach(sayac), $$(".ring-fg", el).forEach((c) => (c.style.strokeDashoffset = c.dataset.hedef))) : io.observe(el)));
    requestAnimationFrame(() => root.classList.add("ready"));
  }
  yukle();
})();
