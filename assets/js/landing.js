/* QUAGEN — ana sayfa etkileşimleri: KAM'in karşılaması, parkur sekmeleri, NextGen geçişi */
(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const nav = $("#nav");
  /* Hesap: giriş yapılmışsa menüde avatar */
  if (window.KD && KD.hesapYok && $("#nav-login")) $("#nav-login").hidden = true;
  let uye = null, uyeBilindi = !(window.KD && KD.hesap) || (window.KD && KD.hesapYok);
  const hesapVar = () => window.KD && KD.hesap && !KD.hesapYok;
  if (window.KD && KD.hesap) KD.hesap.ben().catch(() => null).then((u) => {
    uye = u || null; uyeBilindi = true;
    const l = $("#nav-login"); if (!l || !u) return;
    const bas = String(u.ad || u.kullaniciAdi).trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toLocaleUpperCase("tr");
    l.outerHTML = `<a class="nav-user" href="nextgen.html#profil" title="Profilim"><span class="nav-av">${esc(bas)}</span><span class="nav-un">${esc(u.ad || "@" + u.kullaniciAdi)}</span></a>`;
  });
  /* Açılış koreografisi ve kaydırdıkça beliren bölümler */
  requestAnimationFrame(() => document.body.classList.add("ready"));
  const bolumler = document.querySelectorAll(".section .sec-head, .adimlar > li, .faq-liste, .cta-in, .kam-ozellik > article, .bilim > article, .rakamlar, .kapi");
  bolumler.forEach((el) => el.classList.add("rv"));
  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    bolumler.forEach((el) => io.observe(el));
  } else bolumler.forEach((el) => el.classList.add("in"));
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });
  /* Tema: QUAGEN varsayılan olarak koyu; seçim tüm sayfalarda geçerli */
  if ($("#tema")) $("#tema").onclick = () => {
    const yeni = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = yeni;
    try { const p = JSON.parse(localStorage.getItem("kd-profile") || "{}"); p.theme = yeni; localStorage.setItem("kd-profile", JSON.stringify(p)); } catch (_) {}
  };

  /* ---------- Kütüphane önizlemesi: niyet araması canlı çalışır ---------- */
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

  /* ---------- Açılış: KAM kendini tanıtır; anlattıkça yandaki kod değişir ---------- */
  const C = window.KD_CURRICULUM || [];
  const hAkis = $("#h-akis"), hCevap = $("#h-cevap"), hKod = $("#h-kod code"), hCikti = $("#h-cikti"), hDurum = $("#h-durum"), dev = $("#kam-dev");
  const bekle = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
  const bicim = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>");
  const YUZ = '<span class="kam-av" aria-hidden="true"><b></b><b></b></span>';
  /* KAM'in gözleri imleci izler */
  if (dev && !reduced) addEventListener("pointermove", (e) => {
    const r = dev.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
    dev.style.setProperty("--gx", ((dx / d) * k).toFixed(2)); dev.style.setProperty("--gy", ((dy / d) * k).toFixed(2));
  }, { passive: true });

  const H = {
    kaydir() { hAkis.scrollTo({ top: hAkis.scrollHeight, behavior: reduced ? "auto" : "smooth" }); },
    balon(html, kim) { const d = document.createElement("div"); d.className = "kam-satir " + kim; d.innerHTML = (kim === "k" ? YUZ : "") + `<div class="kam-msg ${kim}">${html}</div>`; hAkis.append(d); this.kaydir(); return d; },
    async kam(metin) {
      if (!reduced) {
        dev.classList.add("dusunuyor");
        const y = this.balon('<span class="kam-yaziyor"><i></i><i></i><i></i></span>', "k");
        await bekle(Math.min(1500, 480 + metin.length * 12));
        y.remove(); dev.classList.remove("dusunuyor");
      }
      return this.balon(bicim(metin), "k");
    },
    sen(metin) { return this.balon(esc(metin), "s"); },
    secenek(liste) {
      return new Promise((coz) => {
        hCevap.innerHTML = liste.map((t, i) => `<button class="kam-chip" style="--i:${i}" data-i="${i}">${esc(t)}</button>`).join("");
        hCevap.querySelectorAll(".kam-chip").forEach((b) => (b.onclick = () => { const r = b.getBoundingClientRect(); hCevap.innerHTML = ""; this.sen(liste[+b.dataset.i]); coz({ i: +b.dataset.i, r }); }));
        this.kaydir();
      });
    },
    yaz(yerTutucu, atla) {
      return new Promise((coz) => {
        hCevap.innerHTML = `<form class="kam-yaz"><input maxlength="24" placeholder="${esc(yerTutucu)}" aria-label="${esc(yerTutucu)}" autocomplete="given-name" /><button class="kam-chip dolu">Gönder</button><button type="button" class="kam-chip" data-atla>${esc(atla)}</button></form>`;
        const f = hCevap.querySelector("form"), inp = f.querySelector("input");
        const bitir = (v) => { hCevap.innerHTML = ""; this.sen(v || atla); coz(v); };
        f.onsubmit = (e) => { e.preventDefault(); bitir(inp.value.trim()); };
        f.querySelector("[data-atla]").onclick = () => bitir("");
        this.kaydir();
      });
    },
    /* Sahne */
    kod: "",
    async kodYaz(yeni) {
      const eski = this.kod.split("\n"); this.kod = yeni;
      const ham = yeni.split("\n"), satirlar = window.KD && KD.hlDoc ? KD.hlDoc(yeni, "c") : ham.map(esc);
      let n = 0;
      hKod.innerHTML = satirlar.map((l, i) => { const d = ham[i] !== eski[i]; return `<span class="sk ${d ? "yeni" : ""}" data-l="${i + 1}" style="--n:${d ? n++ : 0}"><b class="sn">${i + 1}</b>${l || " "}</span>`; }).join("");
      hCikti.hidden = true; hDurum.textContent = "KAM yazıyor";
      await bekle(300 + n * 90);
    },
    vurgula(satirlar) {
      hKod.querySelectorAll(".sk").forEach((el) => { const on = satirlar.includes(+el.dataset.l); el.classList.toggle("hi", on); el.classList.toggle("dim", satirlar.length > 0 && !on); el.classList.remove("yeni"); });
      hDurum.textContent = satirlar.length ? satirlar[0] + ". satır" : "";
    },
    async calistir(cikti) {
      this.vurgula([]); hCikti.hidden = false; hDurum.textContent = "çalışıyor";
      hCikti.innerHTML = '<p class="sahne-etiket">Çıktı</p><div class="log muted">Derleniyor…</div>';
      await bekle(700);
      hCikti.innerHTML = `<p class="sahne-etiket">Çıktı</p><div class="log">${esc(cikti)}</div>`;
      hDurum.textContent = "çalıştı";
      dev.classList.add("mutlu"); setTimeout(() => dev.classList.remove("mutlu"), 1400);
      await bekle(500);
    }
  };
  const programKodu = (metin) => `#include <stdio.h>\n\nint main(void) {\n    printf("${metin}\\n");\n    return 0;\n}`;
  const DILLER = [["py", "Python"], ["c", "C"], ["js", "JavaScript"]];

  async function karsila() {
    let profil = {};
    try { profil = KD.readProfile() || {}; } catch (_) {}
    let ad = (profil.name || "").trim();
    const sonDil = (() => { try { return localStorage.getItem("kd-lang"); } catch (_) { return null; } })();
    const ilerlemeVar = DILLER.some(([id]) => langProgress(id).passed > 0);

    if (ad || ilerlemeVar) {
      await H.kam(`Tekrar hoş geldin${ad ? ", " + ad : ""}. Kaldığımız yerden devam edelim mi?`);
      const c = await H.secenek(["Devam et", "Önce bir örnek göster"]);
      if (c.i === 0) return startWarp("nextgen.html" + (sonDil ? "?dil=" + sonDil : "") + "#panel", c.r, sonDil);
    } else {
      await H.kam("QUAGEN'de dersleri ben anlatırım. Video yok, sayfalarca yazı yok; seninle böyle yazışarak ilerleriz.");
      await H.kam("Nasıl bir şey olduğunu göstereyim mi? Yarım dakika sürer.");
      const c = await H.secenek(["Göster", "Hiç kod yazmadım, olur mu?"]);
      if (c.i === 1) await H.kam("Olur. Herkes sıfırdan başlıyor; ben de hiçbir şeyi bildiğini varsaymadan anlatırım. Bak:");
    }
    await H.kodYaz(programKodu("Merhaba, dünya!"));
    H.vurgula([4]);
    await H.kam("Bu bir C programı. Asıl işi yapan satır şu: `printf` ekrana yazı yazar. Çalıştırıyorum.");
    await H.calistir("Merhaba, dünya!");
    if (!ad) {
      await H.kam("Çalıştı. Şimdi bunu senin için değiştireyim. Adın ne?");
      ad = ((await H.yaz("Adın", "Söylemek istemiyorum")) || "").replace(/["\\%<>]/g, "").trim().slice(0, 24);
      if (ad) { try { KD.store.state.prefs.name = ad; KD.store.save(); } catch (_) {} }
    } else await H.kam("Çalıştı. Şimdi aynı programı senin için değiştiriyorum.");
    const selam = ad ? `Merhaba, ${ad}!` : "Merhaba, yeni programcı!";
    await H.kodYaz(programKodu(selam));
    H.vurgula([4]);
    await H.kam("Tek bir satır değişti. Yeniden çalıştırıyorum.");
    await H.calistir(selam);
    await H.kam(`İşte${ad ? ", " + ad : ""}: bir programın nasıl değiştiğini az önce okudun. Derslerde bu satırları **sen** yazacaksın, ben de yanında olacağım.`);
    await H.kam("Hangi dille başlamak istersin?");
    let c = await H.secenek([...DILLER.map((d) => d[1]), "Emin değilim"]);
    if (c.i === 3) {
      await H.kam("Kısaca: **Python** yazımı en sade olan, ilk dil için en rahatı. **C** okulda görüyorsan ya da bilgisayarın içini merak ediyorsan. **JavaScript** web sitesi yapmak istiyorsan. Kararsızsan Python'la başla; sonra değiştirmek serbest.");
      c = await H.secenek(DILLER.map((d) => d[1]));
    }
    const [dil, dilAd] = DILLER[c.i];
    const hedef = "nextgen.html?dil=" + dil;
    if (hesapVar() && !uye) {
      await H.kam(`Tamam, ${dilAd}. Şimdi aramıza katıl, sonra derslere geçelim. Kayıt olursan ilerlemen hesabında saklanır; telefonda ya da başka bilgisayarda kaldığın yerden devam edersin.`);
      const k = await H.secenek(["Aramıza katıl", "Kayıtsız devam et"]);
      if (k.i === 0) { try { localStorage.setItem("kd-lang", dil); } catch (_) {} location.href = "hesap.html?sonra=" + encodeURIComponent(hedef) + "#kayit"; return; }
      await H.kam("Olur. İlerlemen bu tarayıcıda saklanacak; istediğin zaman kayıt olabilirsin.");
    } else await H.kam(`Tamam, ${dilAd}. Seni NextGen'e götürüyorum; orada bir plan yapacağız.`);
    await bekle(500);
    startWarp(hedef + "#panel", $("#sahne").getBoundingClientRect(), dil);
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
      return `<button role="tab" id="tab-${t.id}" aria-controls="track-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-id="${t.id}">${t.title}<small>${n} ders</small></button>`;
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
          <small>${pr.phases} ders · ${pr.total} görev${pr.passed ? ` · ${pr.passed} görev geçtin` : ""}</small></span>
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
  /* İlk ziyarette önce KAM siteyi gezdirir; sonra sohbet başlar */
  const TUR_ANAHTAR = "kam-tur-quagen";
  function turBaslat() {
    const adimlar = [
      { sec: "#kam-dev", baslik: "Ben KAM.", metin: "QUAGEN'in yapay zekâ öğretmeniyim. Konuları ben anlatırım, takıldığında bana yazarsın. Önce burada neyin ne olduğunu göstereyim." },
      { sec: "#dunya", baslik: "İki ayrı dünya var.", metin: "**QUAGEN** şu an bulunduğun yer: beni, öğretme yöntemimizi ve siteyi tanırsın. **NextGen** ise işin yapıldığı yer: dersler, Pratik ve Kütüphane orada. Bu anahtarla geçersin." },
      { sec: "#sahne", baslik: "Burada benimle konuşursun.", metin: "Solda yazışırız, sağda kod aynı anda değişir. Derslerin hepsi bu şekilde geçer. Tanıtım bitince sana burada kısa bir örnek göstereceğim." },
      { sec: "#kam .kam-ozellik", baslik: "Benden ne beklemelisin?", metin: "Konuyu anlatırım, görevde ipucu veririm, sana plan yaparım. Cevabı hazır vermem; çünkü öğrenmeni istiyorum." },
      { sec: "#ders .adimlar", baslik: "Bir ders dört adımdır.", metin: "Tahmin edersin, ben anlatırım, sen yazarsın, sonra kartlarla hatırlarsın. Her derste aynı sıra." },
      { sec: "#bilim .bilim", baslik: "Bunların bir nedeni var.", metin: "Her adım, işe yaradığı ölçülmüş bir öğrenme yöntemine dayanıyor. Merak edersen kaynaklarıyla burada yazıyor." },
      { sec: "#kapi", baslik: "NextGen'in kapısı", metin: "Hazır olduğunda buradan geçersin. Hangi dili seçeceğini bilmiyorsan sohbetimizde bana sor." }
    ];
    if (hesapVar() && !uye) adimlar.push({ sec: "#nav-login", baslik: "Şimdi aramıza katıl.", metin: "Sonra derslere geçelim. Kayıt ücretsiz; ilerlemen hesabında saklanır ve hiçbir cihazda kaybolmaz.", dugme: "Aramıza katıl", git: "hesap.html?sonra=nextgen.html#kayit", ikinci: { ad: "Şimdi değil" } });
    const basladi = window.KAM_TUR.baslat(adimlar, { anahtar: TUR_ANAHTAR, bitince: (neden) => { if (neden !== "git") { scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); setTimeout(() => karsila().catch(() => {}), 500); } } });
    if (!basladi) return;
  }
  if (hAkis) {
    const ilkZiyaret = window.KAM_TUR && !window.KAM_TUR.goruldu(TUR_ANAHTAR);
    if (!ilkZiyaret) setTimeout(() => karsila().catch(() => {}), reduced ? 0 : 900);
    else { const dene = (n) => (uyeBilindi || n > 12 ? turBaslat() : setTimeout(() => dene(n + 1), 150)); setTimeout(() => dene(0), reduced ? 100 : 1300); }
  }
})();
