/* QUAGEN Rehber — arayüz
 * Yollar: #/  ·  #/ara/<sorgu>  ·  #/k/<kavram>/<dil>  ·  #/kategori/<n>  ·  #/terimler
 */
(function () {
  const R = window.KD_REHBER, ara = window.KD_REHBER_ARA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ana = $("#ana"), yan = $("#yan");
  const DIL_SIRA = ["js", "py", "c", "sql", "html", "css"];
  const kavramBul = (id) => R.KAVRAMLAR.find((k) => k.id === id);
  const tur = (dil, g) => g.tur || dil;
  const hlDil = (t) => (t === "html" ? "html" : t === "css" ? "css" : t === "sql" ? "sql" : t === "c" ? "c" : t === "py" ? "py" : "js");
  const kodHTML = (kod, t) => (window.KD && KD.hlDoc ? KD.hlDoc(kod, hlDil(t)).join("\n") : esc(kod));
  const md = (s) => (window.KD && KD.md ? KD.md(s) : esc(s));

  let secili = "tum";
  try { secili = localStorage.getItem("kd-rehber-dil") || "tum"; } catch (_) {}
  if (secili !== "tum" && !R.DILLER[secili]) secili = "tum";
  let aiVar = null, cVar = null;
  if (KD.statik) { aiVar = false; cVar = false; } else fetch("/api/health").then((r) => r.json()).then((h) => { aiVar = !!h.ai; cVar = !!h.c; }).catch(() => { aiVar = false; cVar = false; });

  /* ---------- Dil seçici ---------- */
  function dilSec() {
    const say = (d) => R.KAVRAMLAR.filter((k) => k.diller[d]).length;
    $("#dil-sec").innerHTML = [["tum", "Tüm diller", R.KAVRAMLAR.length]].concat(DIL_SIRA.map((d) => [d, R.DILLER[d].ad, say(d)]))
      .map(([id, ad, n]) => `<button role="tab" aria-selected="${secili === id}" data-dil="${id}" style="--c:${id === "tum" ? "var(--ink)" : R.DILLER[id].renk}"><i class="dot"></i>${esc(ad)}<small>${n}</small></button>`).join("");
    $$("#dil-sec button").forEach((b) => (b.onclick = () => {
      secili = b.dataset.dil;
      try { localStorage.setItem("kd-rehber-dil", secili); } catch (_) {}
      dilSec(); yol();
    }));
  }

  /* ---------- Kenar çubuğu ---------- */
  function yanCiz(aktif) {
    const gorunur = R.KAVRAMLAR.filter((k) => secili === "tum" || k.diller[secili]);
    const gruplar = R.KATEGORILER.map((kat, i) => ({ kat, i, ks: gorunur.filter((k) => k.kategori === kat) })).filter((g) => g.ks.length);
    const aktifKat = aktif ? (kavramBul(aktif) || {}).kategori : null;
    yan.innerHTML = `
      <div class="side-head"><b>${secili === "tum" ? "Tüm kavramlar" : esc(R.DILLER[secili].ad)}</b><span>${gorunur.length}</span></div>
      ${gruplar.map((g) => `<details ${!aktif || g.kat === aktifKat ? "open" : ""}><summary>${esc(g.kat)}<span>${g.ks.length}</span></summary>
        <ul>${g.ks.map((k) => `<li><a href="#/k/${k.id}${secili !== "tum" ? "/" + secili : ""}" class="${k.id === aktif ? "on" : ""}">${esc(secili !== "tum" && k.diller[secili] ? k.diller[secili].ad : k.baslik)}</a></li>`).join("")}</ul></details>`).join("")}
      <a class="side-terim" href="#/terimler">Terimler sözlüğü <span>${R.TERIMLER.length}</span></a>`;
    const on = $(".on", yan);
    if (on) on.scrollIntoView({ block: "nearest" });
  }

  /* ---------- Ana sayfa + arama ---------- */
  const ORNEK_SORULAR = ["büyük harf yapmak istiyorum", "listeyi büyükten küçüğe sıralamak", "iki tabloyu birleştirmek", "div'i ortalamak", "python'da kullanıcıdan sayı almak", "tekrar eden elemanları silmek", "return ne demek", "c'de bellek ayırmak"];

  function anaSayfa(sorgu = "") {
    $("#mini-ara").hidden = true;
    const ornekSay = R.KAVRAMLAR.reduce((n, k) => n + Object.keys(k.diller).length, 0);
    ana.innerHTML = `
      <section class="hero">
        <p class="kicker"><span class="pulse"></span>Türkçe programlama başvurusu</p>
        <h1>Ne yapmak istediğini <mark>kendi cümlenle</mark> yaz.</h1>
        <p class="lead">Fonksiyonun adını bilmene gerek yok. Rehber niyetini anlar, doğru yapıyı, kullanım şeklini ve diğer dillerdeki karşılığını gösterir. Her örneği burada çalıştırırsın.</p>
        <form class="big-search" id="ara-form" role="search">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <input id="ara-girdi" type="search" autocomplete="off" spellcheck="false" aria-label="Ne yapmak istiyorsun?" value="${esc(sorgu)}" />
          <span class="ph" id="ph" aria-hidden="true"></span>
          <button class="go" aria-label="Ara">Bul<kbd>↵</kbd></button>
        </form>
        <div class="chips">${ORNEK_SORULAR.slice(0, 6).map((q, i) => `<button type="button" class="chip" style="--i:${i}" data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>
      </section>
      <section id="sonuc" class="sonuc" aria-live="polite"></section>
      <section class="kats rv" id="kats">
        <header class="sec-h"><h2>Kategoriler</h2><p>${R.KAVRAMLAR.length} kavram · ${ornekSay} çalıştırılabilir örnek · ${R.TERIMLER.length} terim</p></header>
        <div class="kat-grid">${R.KATEGORILER.map((kat, i) => {
          const ks = R.KAVRAMLAR.filter((k) => k.kategori === kat && (secili === "tum" || k.diller[secili]));
          if (!ks.length) return "";
          return `<a class="kat" href="#/kategori/${i}" style="--i:${i}"><span class="kat-no">${String(i + 1).padStart(2, "0")}</span><b>${esc(kat)}</b><small>${ks.slice(0, 3).map((k) => esc(k.baslik)).join(" · ")}</small><span class="kat-say">${ks.length}</span></a>`;
        }).join("")}</div>
      </section>`;
    const girdi = $("#ara-girdi");
    yerTutucu(girdi);
    $("#ara-form").onsubmit = (e) => { e.preventDefault(); const q = girdi.value.trim(); if (q) git("#/ara/" + encodeURIComponent(q)); };
    let zaman;
    girdi.oninput = () => { clearTimeout(zaman); zaman = setTimeout(() => { const q = girdi.value.trim(); history.replaceState(null, "", q ? "#/ara/" + encodeURIComponent(q) : "#/"); sonucCiz(q, false); }, 160); };
    girdi.onkeydown = (e) => {
      const linkler = $$("#sonuc [data-sec]");
      if (e.key === "ArrowDown" && linkler.length) { e.preventDefault(); linkler[0].focus(); }
    };
    $$(".chip").forEach((c) => (c.onclick = () => { girdi.value = c.dataset.q; girdi.dispatchEvent(new Event("input")); sonucCiz(c.dataset.q, true); }));
    gozlemle();
    if (sorgu) sonucCiz(sorgu, true);
    else setTimeout(() => girdi.focus({ preventScroll: true }), 50);
  }

  /* Yer tutucu: örnek sorular yazılıp silinir */
  function yerTutucu(girdi) {
    const ph = $("#ph");
    if (!ph) return;
    const goster = () => (ph.style.opacity = girdi.value ? 0 : 1);
    girdi.addEventListener("input", goster); goster();
    if (reduced) { ph.textContent = ORNEK_SORULAR[0]; return; }
    let i = 0, j = 0, sil = false;
    const adim = () => {
      if (!document.body.contains(ph)) return;
      const s = ORNEK_SORULAR[i % ORNEK_SORULAR.length];
      j += sil ? -1 : 1;
      ph.textContent = s.slice(0, j);
      let bekle = sil ? 22 : 48;
      if (!sil && j === s.length) { sil = true; bekle = 1600; }
      else if (sil && j === 0) { sil = false; i++; bekle = 320; }
      setTimeout(adim, bekle);
    };
    adim();
  }

  function esdegerler(k, aktifDil) {
    return `<div class="eq">${DIL_SIRA.filter((d) => k.diller[d]).map((d) => `<a href="#/k/${k.id}/${d}" class="eq-i ${d === aktifDil ? "on" : ""}" style="--c:${R.DILLER[d].renk}"><span class="lb">${R.DILLER[d].kisa}</span><code>${esc(k.diller[d].ad)}</code></a>`).join("")}</div>`;
  }

  function sonucCiz(q, kaydir) {
    const kutu = $("#sonuc");
    if (!kutu) return;
    $("#kats").classList.toggle("dim", !!q);
    if (!q) { kutu.innerHTML = ""; return; }
    const r = ara(q, { dil: secili !== "tum" ? secili : undefined });
    const kavramlar = r.sonuclar.filter((s) => s.tur === "kavram");
    const terimler = r.sonuclar.filter((s) => s.tur === "terim");
    if (!r.sonuclar.length) {
      kutu.innerHTML = `<div class="bos"><b>Bunu henüz tanıyamadım.</b><p>Daha basit kelimelerle dene (ör. “listeyi sırala”, “metni böl”) ya da bir dil belirt (“python'da …”).</p>${aiKutusu(q, r)}</div>`;
      aiBagla(q, r);
      return;
    }
    const ilk = r.sonuclar[0];
    let ust = "";
    if (ilk.tur === "kavram") {
      const k = ilk.kavram;
      const d = (r.dil && k.diller[r.dil]) ? r.dil : (secili !== "tum" && k.diller[secili]) ? secili : DIL_SIRA.find((x) => k.diller[x]);
      const g = k.diller[d];
      ust = `
        <article class="niyet">
          <header>
            <div><p class="nk">Niyetin algılandı ${r.dil ? `· <span class="dil-pill" style="--c:${R.DILLER[r.dil].renk}">${R.DILLER[r.dil].ad}</span>` : ""}</p>
            <h2>${esc(k.baslik)}</h2></div>
            <div class="guven" title="Eşleşme güveni"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15.5" class="g-bg"/><circle cx="18" cy="18" r="15.5" class="g-fg" style="--p:${r.guven}"/></svg><span>%${Math.round(r.guven * 100)}</span></div>
          </header>
          <div class="niyet-body">
            <div class="cevap">
              <p class="cv-ad"><span class="dil-pill" style="--c:${R.DILLER[d].renk}">${R.DILLER[d].ad}</span><code>${esc(g.ad)}</code></p>
              <p>${md(g.aciklama)}</p>
              <pre class="code mini"><code>${kodHTML(g.sozdizimi, tur(d, g))}</code></pre>
              <div class="row"><a class="btn primary" href="#/k/${k.id}/${d}" data-sec>Sayfayı aç ve çalıştır →</a><span class="muted small">${esc(k.kategori)}</span></div>
            </div>
            <div class="ornek-on"><p class="muted small">Örnek</p><pre class="code"><code>${kodHTML(g.ornek, tur(d, g))}</code></pre></div>
          </div>
          <footer><p class="muted small">Diğer dillerde</p>${esdegerler(k, d)}</footer>
        </article>`;
    } else {
      const t = ilk.terim;
      ust = `<article class="niyet terim-k"><header><div><p class="nk">Terim</p><h2>${esc(t.terim)} <small>${esc(t.ing)}</small></h2></div></header><div class="niyet-body"><p class="tanim">${esc(t.tanim)}</p>${t.kavram ? `<a class="btn" href="#/k/${t.kavram}" data-sec>İlgili kavram: ${esc(kavramBul(t.kavram).baslik)} →</a>` : ""}</div></article>`;
    }
    const digerK = kavramlar.filter((s) => s !== ilk);
    const digerT = terimler.filter((s) => s !== ilk);
    kutu.innerHTML = `${ust}
      ${digerK.length ? `<div class="diger"><p class="muted small">Bunlardan biri de olabilir</p><ul>${digerK.map((s, i) => `<li style="--i:${i}"><a href="#/k/${s.id}${r.dil && s.kavram.diller[r.dil] ? "/" + r.dil : ""}" data-sec><b>${esc(s.kavram.baslik)}</b><span>${DIL_SIRA.filter((d) => s.kavram.diller[d]).map((d) => `<i style="--c:${R.DILLER[d].renk}">${R.DILLER[d].kisa}</i>`).join("")}</span></a></li>`).join("")}</ul></div>` : ""}
      ${digerT.length ? `<div class="diger"><p class="muted small">Terimler</p><ul>${digerT.map((s, i) => `<li style="--i:${i}"><a href="#/terimler" data-terim="${s.id}" data-sec><b>${esc(s.terim.terim)}</b><span class="muted">${esc(s.terim.tanim.slice(0, 80))}…</span></a></li>`).join("")}</ul></div>` : ""}
      ${aiKutusu(q, r)}`;
    $$("[data-terim]", kutu).forEach((a) => (a.onclick = () => { sessionStorage.setItem("kd-terim", a.dataset.terim); }));
    // ok tuşlarıyla sonuçlar arasında gezinme
    const linkler = $$("[data-sec]", kutu);
    linkler.forEach((a, i) => (a.onkeydown = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); (linkler[i + 1] || a).focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); (linkler[i - 1] || $("#ara-girdi")).focus(); }
    }));
    aiBagla(q, r);
    if (kaydir) kutu.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  /* ---------- Yapay zekâ asistanı ---------- */
  function aiKutusu(q, r) {
    return `<div class="ai" id="ai"><div class="ai-h"><span class="ai-ico" aria-hidden="true">✦</span><div><b>Asistana sor</b><p class="muted small" id="ai-not">${aiVar === false ? "Yapay zekâ asistanı bu sunucuda kapalı. Yukarıdaki sonuçlar yerel niyet motorundan geliyor." : r.guven < 0.5 ? "Emin olamadım. Asistan sorunu baştan yorumlayıp örnekli bir cevap yazabilir." : "Daha ayrıntılı açıklama ya da farklı bir örnek istersen."}</p></div>
      <button class="btn" id="ai-sor" ${aiVar === false ? "disabled" : ""}>Sor</button></div><div class="ai-cevap" id="ai-cevap" hidden></div></div>`;
  }
  function aiBagla(q, r) {
    const b = $("#ai-sor");
    if (!b) return;
    b.onclick = async () => {
      const kutu = $("#ai-cevap");
      b.disabled = true; kutu.hidden = false;
      kutu.innerHTML = `<div class="yaziyor"><i></i><i></i><i></i></div>`;
      try {
        const adaylar = r.sonuclar.filter((s) => s.tur === "kavram").slice(0, 6).map((s) => ({ id: s.id, baslik: s.kavram.baslik, ad: Object.values(s.kavram.diller).map((g) => g.ad).join(" | ") }));
        const res = await fetch("/api/rehber/sor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ soru: q, dil: r.dil || (secili !== "tum" ? secili : null), adaylar }) });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Asistan yanıt veremedi.");
        kutu.innerHTML = aiMetin(j.cevap) + (j.kavramlar && j.kavramlar.length ? `<p class="muted small">Rehber'de: ${j.kavramlar.filter(kavramBul).map((id) => `<a href="#/k/${id}">${esc(kavramBul(id).baslik)}</a>`).join(", ")}</p>` : "");
      } catch (e) {
        kutu.innerHTML = `<p class="hata">${esc(e.message)}</p>`;
        if (/kapalı/.test(e.message)) aiVar = false;
      } finally { b.disabled = aiVar === false; }
    };
  }
  /* Asistan cevabı: kod blokları renklendirilir, geri kalanı güvenli biçimde */
  function aiMetin(s) {
    return String(s).split(/```(\w*)\n?([\s\S]*?)```/).map((p, i, a) => {
      if (i % 3 === 1) return "";
      if (i % 3 === 2) { const d = { javascript: "js", js: "js", python: "py", py: "py", c: "c", sql: "sql", html: "html", css: "css" }[a[i - 1]] || "js"; return `<pre class="code"><code>${kodHTML(p.replace(/\n$/, ""), d)}</code></pre>`; }
      return p.split(/\n{2,}/).filter((x) => x.trim()).map((x) => `<p>${md(x.trim())}</p>`).join("");
    }).join("");
  }

  /* ---------- Kavram sayfası ---------- */
  let editor = null;
  function kavramSayfa(id, dilIst) {
    const k = kavramBul(id);
    if (!k) return bulunamadi();
    $("#mini-ara").hidden = false;
    const diller = DIL_SIRA.filter((d) => k.diller[d]);
    const d = diller.includes(dilIst) ? dilIst : diller.includes(secili) ? secili : diller[0];
    const g = k.diller[d], t = tur(d, g);
    const katIdx = R.KATEGORILER.indexOf(k.kategori);
    const kardes = R.KAVRAMLAR.filter((x) => x.kategori === k.kategori);
    const sira = kardes.indexOf(k);
    const onceki = kardes[sira - 1], sonraki = kardes[sira + 1];
    const girdiVar = t === "py" || t === "c";
    document.title = `${g.ad} · ${k.baslik} — QUAGEN Rehber`;
    ana.innerHTML = `
      <article class="kv">
        <nav class="iz" aria-label="Konum"><a href="#/">Rehber</a><span>/</span><a href="#/kategori/${katIdx}">${esc(k.kategori)}</a></nav>
        <h1>${esc(k.baslik)}</h1>
        <div class="kv-tabs" role="tablist">${diller.map((x) => `<a role="tab" aria-selected="${x === d}" href="#/k/${k.id}/${x}" style="--c:${R.DILLER[x].renk}"><i class="dot"></i>${R.DILLER[x].ad}</a>`).join("")}</div>

        <section class="kv-ad">
          <div><p class="muted small">${R.DILLER[d].ad}</p><h2><code>${esc(g.ad)}</code></h2></div>
          <button class="btn ghost" id="kopyala-ad" aria-label="Adı kopyala">Kopyala</button>
        </section>
        <p class="kv-acik">${md(g.aciklama)}</p>

        <section class="blok"><h3>Söz dizimi</h3><pre class="code"><code>${kodHTML(g.sozdizimi, t)}</code></pre></section>

        <section class="blok dene">
          <div class="dene-h"><h3>Kendin dene</h3>
            <div class="dene-btn"><button class="btn ghost" id="sifirla">Sıfırla</button><button class="btn primary" id="calistir">Çalıştır <kbd>Ctrl ↵</kbd></button></div></div>
          <div class="ed" id="ed"></div>
          ${girdiVar ? `<details class="stdin" ${g.stdin ? "open" : ""}><summary>Girdi (stdin)</summary><textarea id="stdin" rows="3" spellcheck="false" placeholder="Programın input() / scanf ile okuyacağı satırlar">${esc(g.stdin || "")}</textarea></details>` : ""}
          <div class="cikti" id="cikti"><p class="muted small">Çıktı burada görünecek. ${t === "c" ? "C örnekleri yerel QUAGEN sunucusunda derlenir." : t === "py" ? "Python ilk çalıştırmada birkaç saniyede yüklenir." : ""}</p></div>
          ${t === "html" ? `<div class="onizleme" id="onizleme"></div>` : ""}
        </section>

        ${g.not ? `<aside class="dikkat"><b>Dikkat</b><p>${md(g.not)}</p></aside>` : ""}

        ${diller.length > 1 ? `<section class="blok"><h3>Diğer dillerde</h3><table class="esd"><tbody>${diller.filter((x) => x !== d).map((x) => `<tr><td><a href="#/k/${k.id}/${x}" class="dil-pill" style="--c:${R.DILLER[x].renk}">${R.DILLER[x].ad}</a></td><td><code>${esc(k.diller[x].ad)}</code></td><td class="muted">${md(k.diller[x].aciklama.split(/(?<=\.)\s/)[0])}</td></tr>`).join("")}</tbody></table></section>` : ""}

        <nav class="komsu">${onceki ? `<a href="#/k/${onceki.id}/${onceki.diller[d] ? d : ""}"><small>← Önceki</small><b>${esc(onceki.baslik)}</b></a>` : "<span></span>"}${sonraki ? `<a class="sag" href="#/k/${sonraki.id}/${sonraki.diller[d] ? d : ""}"><small>Sonraki →</small><b>${esc(sonraki.baslik)}</b></a>` : ""}</nav>
      </article>`;
    // Editör
    const mod = t === "html" ? "htmlmixed" : t === "sql" ? "text/x-sqlite" : t === "c" ? "text/x-csrc" : t === "py" ? "python" : "javascript";
    editor = window.CodeMirror ? CodeMirror($("#ed"), { value: g.ornek, mode: mod, lineNumbers: true, theme: "kodera", indentUnit: t === "py" ? 4 : 2, tabSize: 4, autoCloseBrackets: true, viewportMargin: Infinity, extraKeys: { "Ctrl-Enter": () => calistir(), "Cmd-Enter": () => calistir(), Tab: (cm) => cm.replaceSelection(" ".repeat(cm.getOption("indentUnit"))) } }) : null;
    if (!editor) { const ta = document.createElement("textarea"); ta.className = "ta"; ta.value = g.ornek; $("#ed").append(ta); editor = { getValue: () => ta.value, setValue: (v) => (ta.value = v) }; }
    const calistir = () => kodCalistir(t, editor.getValue(), $("#stdin") ? $("#stdin").value : "");
    $("#calistir").onclick = calistir;
    $("#sifirla").onclick = () => { editor.setValue(g.ornek); $("#cikti").innerHTML = '<p class="muted small">Örnek sıfırlandı.</p>'; };
    $("#kopyala-ad").onclick = (e) => { navigator.clipboard && navigator.clipboard.writeText(g.ad.replace(/ \/ .*$/, "")); e.target.textContent = "Kopyalandı"; setTimeout(() => (e.target.textContent = "Kopyala"), 1200); };
    if (t === "html") calistir();
    ana.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  async function kodCalistir(t, kod, stdin) {
    const c = $("#cikti");
    c.classList.remove("in");
    c.innerHTML = `<p class="muted small calisiyor">${t === "py" ? "Python çalışıyor…" : t === "c" ? "Derleniyor (clang + AddressSanitizer)…" : "Çalışıyor…"}</p>`;
    let res;
    try {
      if (t === "py") res = await KD.runPy(kod, { stdin, timeout: 6000 });
      else if (t === "c") res = cVar === false ? { error: "C derleyicisine ulaşılamadı. QUAGEN'i kendi bilgisayarında node server.js ile çalıştırınca C örnekleri derlenir." } : await KD.runC(kod, { stdin });
      else if (t === "sql") res = await KD.run(kod, { mode: "sql", setup: R.SQL_DB, timeout: 15000 });
      else if (t === "html" || t === "css") res = await KD.runWeb({ lang: "html", code: kod, host: $("#onizleme") });
      else res = await KD.run(kod, { timeout: 5000, wait: /setTimeout|await/.test(kod) ? 1200 : 300 });
    } catch (e) { res = { error: String(e.message || e) }; }
    const satirlar = (res.logs || []).map((l, i) => `<div class="log ${l.level}" style="--i:${i}">${esc(l.text)}</div>`);
    if (res.error) satirlar.push(`<div class="log error">${esc(res.error)}</div>`);
    let tablo = "";
    if (res.table && res.table.columns) {
      tablo = `<div class="tbl"><table><thead><tr>${res.table.columns.map((x) => `<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${res.table.values.slice(0, 50).map((r) => `<tr>${r.map((v) => `<td class="${v === null ? "null" : typeof v === "number" ? "num" : ""}">${v === null ? "NULL" : esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table><p class="muted small">${res.table.values.length} satır</p></div>`;
    }
    c.innerHTML = tablo + (satirlar.length ? `<div class="konsol">${satirlar.join("")}</div>` : tablo ? "" : `<p class="muted small">${t === "html" ? "Önizleme aşağıda." : "Program çalıştı, çıktı üretmedi."}</p>`);
    requestAnimationFrame(() => c.classList.add("in"));
  }

  /* ---------- Kategori sayfası ---------- */
  function kategoriSayfa(i) {
    const kat = R.KATEGORILER[i];
    if (!kat) return bulunamadi();
    $("#mini-ara").hidden = false;
    const ks = R.KAVRAMLAR.filter((k) => k.kategori === kat && (secili === "tum" || k.diller[secili]));
    document.title = `${kat} — QUAGEN Rehber`;
    ana.innerHTML = `<section class="kat-s"><nav class="iz"><a href="#/">Rehber</a><span>/</span></nav><h1>${esc(kat)}</h1><p class="muted">${ks.length} kavram${secili !== "tum" ? " · " + R.DILLER[secili].ad : ""}</p>
      <div class="kart-liste">${ks.map((k, j) => {
        const d = secili !== "tum" && k.diller[secili] ? secili : DIL_SIRA.find((x) => k.diller[x]);
        return `<a class="kk" style="--i:${j}" href="#/k/${k.id}${secili !== "tum" ? "/" + secili : ""}"><b>${esc(k.baslik)}</b><code>${esc(k.diller[d].ad)}</code><p>${md(k.diller[d].aciklama.split(/(?<=\.)\s/)[0])}</p><span class="kk-d">${DIL_SIRA.filter((x) => k.diller[x]).map((x) => `<i style="--c:${R.DILLER[x].renk}">${R.DILLER[x].kisa}</i>`).join("")}</span></a>`;
      }).join("")}</div></section>`;
  }

  /* ---------- Terimler ---------- */
  function terimlerSayfa() {
    $("#mini-ara").hidden = false;
    document.title = "Terimler sözlüğü — QUAGEN Rehber";
    const sirali = [...R.TERIMLER].sort((a, b) => a.terim.localeCompare(b.terim, "tr"));
    const harfler = [...new Set(sirali.map((t) => t.terim[0].toLocaleUpperCase("tr")))];
    ana.innerHTML = `<section class="terimler"><nav class="iz"><a href="#/">Rehber</a><span>/</span></nav><h1>Terimler sözlüğü</h1>
      <p class="muted">Yazılım dünyasında sık geçen ${sirali.length} terimin Türkçe açıklaması ve İngilizce karşılığı.</p>
      <div class="harf-dizin">${harfler.map((h) => `<a href="#h-${h}" data-h="${h}">${h}</a>`).join("")}</div>
      ${harfler.map((h) => `<h2 class="harf" id="h-${h}">${h}</h2><dl class="tl">${sirali.filter((t) => t.terim[0].toLocaleUpperCase("tr") === h).map((t) => `<div class="te" id="t-${t.id}"><dt>${esc(t.terim)} <small>${esc(t.ing)}</small></dt><dd>${esc(t.tanim)}${t.kavram ? ` <a href="#/k/${t.kavram}">Kavram sayfası →</a>` : ""}</dd></div>`).join("")}</dl>`).join("")}</section>`;
    $$(".harf-dizin a").forEach((a) => (a.onclick = (e) => { e.preventDefault(); $("#h-" + a.dataset.h).scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }));
    const hedef = sessionStorage.getItem("kd-terim");
    if (hedef) { sessionStorage.removeItem("kd-terim"); const el = $("#t-" + hedef); if (el) { el.classList.add("vurgu"); setTimeout(() => el.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" }), 60); } }
  }

  function bulunamadi() { ana.innerHTML = `<section class="bos"><h1>Bu sayfa yok</h1><p><a href="#/">Rehber ana sayfasına dön</a></p></section>`; }

  /* ---------- Yönlendirme ---------- */
  function git(h) { if (location.hash === h) yol(); else location.hash = h; }
  function yol() {
    const h = decodeURIComponent(location.hash.slice(1) || "/");
    const ciz = () => {
      const p = h.split("/").filter(Boolean);
      if (p[0] === "k") { yanCiz(p[1]); kavramSayfa(p[1], p[2]); }
      else if (p[0] === "kategori") { yanCiz(); kategoriSayfa(Number(p[1])); }
      else if (p[0] === "terimler") { yanCiz(); terimlerSayfa(); }
      else if (p[0] === "ara") { yanCiz(); document.title = "QUAGEN Rehber — Türkçe programlama başvurusu"; anaSayfa(p.slice(1).join("/")); }
      else { yanCiz(); document.title = "QUAGEN Rehber — Türkçe programlama başvurusu"; anaSayfa(); }
    };
    if (document.startViewTransition && !reduced && yol.ilk) document.startViewTransition(ciz); else ciz();
    yol.ilk = true;
  }

  /* Kaydırınca görünen bölümler */
  function gozlemle() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 });
    $$(".rv").forEach((el) => (reduced ? el.classList.add("in") : io.observe(el)));
  }

  /* Üst çubuktaki küçük arama, kısayollar, tema */
  $("#mini-ara").onsubmit = (e) => { e.preventDefault(); const q = $("#mini-girdi").value.trim(); if (q) { $("#mini-girdi").value = ""; git("#/ara/" + encodeURIComponent(q)); } };
  addEventListener("keydown", (e) => {
    const yaziyor = /INPUT|TEXTAREA/.test(document.activeElement.tagName) || document.activeElement.closest(".CodeMirror");
    if ((e.key === "/" && !yaziyor) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault();
      const g = $("#ara-girdi") || $("#mini-girdi");
      g.focus(); g.select && g.select();
    }
  });
  $("#tema").onclick = () => {
    const yeni = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = yeni;
    try { const p = JSON.parse(localStorage.getItem("kd-profile") || "{}"); p.theme = yeni; localStorage.setItem("kd-profile", JSON.stringify(p)); } catch (_) {}
  };
  addEventListener("hashchange", yol);
  dilSec();
  yol();
})();
