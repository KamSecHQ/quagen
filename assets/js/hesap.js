/* QUAGEN — giriş / kayıt sayfası */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const params = new URLSearchParams(location.search);
  /* Yalnızca bu sitedeki göreli adreslere yönlendir (açık yönlendirme açığı olmasın) */
  const sonra = (() => { const s = params.get("sonra") || ""; return /^(nextgen\.html|pratik\.html|rehber\.html|index\.html|portfolyo\.html|p\/)[^:]*$/.test(s) ? s : "nextgen.html"; })();

  /* ---------- Sol panel: canlı kod ---------- */
  const KOD = [
    ["<span class=k>function</span> toplam(dizi) {", 0],
    ["  <span class=k>let</span> t = <span class=n>0</span>;", 1],
    ["  <span class=k>for</span> (<span class=k>const</span> x <span class=k>of</span> dizi) t += x;", 2],
    ["  <span class=k>return</span> t;", 3],
    ["}", 4]
  ];
  const plain = (h) => h.replace(/<[^>]+>/g, "");
  const code = $("#art-code"), tests = $$("#art-tests span");
  async function oyna() {
    if (reduced) { code.innerHTML = KOD.map(([h]) => `<span class="ln">${h}</span>`).join(""); tests.forEach((t) => t.classList.add("show", "pass")); return; }
    while (true) {
      code.innerHTML = ""; tests.forEach((t) => t.classList.remove("show", "pass"));
      for (const [html] of KOD) {
        const ln = document.createElement("span"); ln.className = "ln hi"; code.appendChild(ln);
        const txt = plain(html);
        for (let i = 1; i <= txt.length; i++) {
          ln.innerHTML = esc(txt.slice(0, i)) + '<span class="caret"></span>';
          await bekle(22 + Math.random() * 38);
        }
        ln.innerHTML = html; ln.classList.remove("hi");
        await bekle(120);
      }
      for (const t of tests) { t.classList.add("show"); await bekle(260); t.classList.add("pass"); await bekle(160); }
      await bekle(4200);
    }
  }
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  oyna();
  const SOZLER = ["Hafızadan çağırmak, tekrar okumaktan kalıcıdır.", "Yanlış bir tahmin bile sonraki öğrenmeyi güçlendirir.", "Kısa ve her gün çalışmak, uzun ve seyrek çalışmaktan kalıcıdır.", "Çözümünü kendi cümlelerinle açıklamak, onu gerçekten anlamaktır."];
  let si = 0;
  const quote = $("#art-quote");
  if (!reduced) setInterval(() => { quote.classList.add("swap"); setTimeout(() => { si = (si + 1) % SOZLER.length; quote.textContent = SOZLER[si]; quote.classList.remove("swap"); }, 500); }, 6000);

  /* ---------- Sekmeler ---------- */
  const tabs = $(".tabs"), forms = $("#forms");
  function goster(ad, odak = true) {
    const eski = $(".form:not([hidden])");
    const yeni = $("#form-" + ad);
    if (eski === yeni) return;
    tabs.dataset.on = ad;
    $$(".tabs [role=tab]").forEach((b) => { const on = b.dataset.tab === ad; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
    const h0 = forms.offsetHeight;
    if (eski) eski.hidden = true;
    yeni.hidden = false;
    yeni.style.setProperty("--dir", ad === "kayit" ? "18px" : "-18px");
    yeni.classList.remove("enter"); void yeni.offsetWidth; yeni.classList.add("enter");
    if (!reduced) { const h1 = forms.offsetHeight; forms.style.height = h0 + "px"; requestAnimationFrame(() => { forms.style.height = h1 + "px"; }); setTimeout(() => (forms.style.height = ""), 380); }
    history.replaceState(null, "", "#" + ad);
    if (odak) setTimeout(() => $("input", yeni).focus(), 60);
  }
  $$(".tabs [role=tab]").forEach((b) => b.addEventListener("click", () => goster(b.dataset.tab)));
  tabs.addEventListener("keydown", (e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const ad = tabs.dataset.on === "kayit" ? "giris" : "kayit"; goster(ad); $("#tab-" + ad).focus(); } });
  $$("[data-go]").forEach((b) => b.addEventListener("click", () => goster(b.dataset.go)));
  tabs.dataset.on = "giris";
  if (location.hash === "#kayit") goster("kayit", false);

  /* ---------- Parola ---------- */
  $$("[data-eye]").forEach((b) => b.addEventListener("click", () => {
    const i = $("#" + b.dataset.eye), acik = i.type === "text";
    i.type = acik ? "password" : "text";
    b.textContent = acik ? "Göster" : "Gizle";
    b.setAttribute("aria-label", acik ? "Parolayı göster" : "Parolayı gizle");
  }));
  const meter = $(".meter"), pwHint = $("#pw-hint");
  $("#k-parola").addEventListener("input", (e) => {
    const p = e.target.value;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(p) && /\d/.test(p)) s++;
    if (p.length >= 12) s++;
    if (/[^A-Za-z0-9]/.test(p) && p.length >= 10) s++;
    meter.dataset.s = p ? Math.max(1, s) : 0;
    pwHint.textContent = !p ? "En az 8 karakter, bir harf ve bir rakam." : ["Çok kısa.", "Zayıf: harf ve rakam karıştır.", "İdare eder; daha uzun olabilir.", "İyi.", "Güçlü."][Math.max(1, s)] ;
  });
  $("#k-kullanici").addEventListener("input", (e) => { const v = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""); if (v !== e.target.value) e.target.value = v; });

  /* ---------- Hatalar ---------- */
  function temizle(form) { $$(".field", form).forEach((f) => f.classList.remove("bad")); $$(".err", form).forEach((e) => { e.classList.remove("on"); e.textContent = ""; }); const fe = $(".form-err", form); fe.classList.remove("on"); fe.textContent = ""; }
  function alanHata(form, alan, mesaj) {
    const e = $(`.err[data-for="${alan}"]`, form); if (!e) return;
    e.textContent = mesaj; e.classList.add("on");
    e.closest(".field").classList.add("bad");
  }
  function genelHata(form, mesaj) { const fe = $(".form-err", form); fe.textContent = mesaj; fe.classList.add("on"); }
  function salla() { const c = $("#card"); c.classList.remove("shake"); void c.offsetWidth; if (!reduced) c.classList.add("shake"); }

  /* ---------- Gönderim ---------- */
  async function gonder(form, islem) {
    temizle(form);
    const btn = $(".submit", form);
    const veri = Object.fromEntries(new FormData(form));
    btn.classList.add("loading"); btn.disabled = true;
    try {
      const kul = await islem(veri);
      btn.classList.remove("loading"); btn.classList.add("done");
      const ilk = (kul.ad || kul.kullaniciAdi).split(" ")[0];
      await bekle(reduced ? 0 : 450);
      karsila(btn, form.id === "form-kayit" ? `Hoş geldin, ${ilk}` : `Tekrar hoş geldin, ${ilk}`);
    } catch (e) {
      btn.classList.remove("loading"); btn.disabled = false;
      const alanlar = e.alanlar || {};
      Object.entries(alanlar).forEach(([a, m]) => alanHata(form, a, m));
      if (!Object.keys(alanlar).length) genelHata(form, e.message || "Bir sorun oluştu. Tekrar dene.");
      salla();
      const ilkHata = $(".field.bad input", form); if (ilkHata) ilkHata.focus();
    }
  }
  function karsila(el, metin) {
    const w = $("#welcome"), r = el.getBoundingClientRect();
    w.style.setProperty("--x", r.left + r.width / 2 + "px"); w.style.setProperty("--y", r.top + r.height / 2 + "px");
    $("#welcome-text").textContent = metin;
    try { sessionStorage.setItem("kd-warp", "1"); } catch (_) {}
    if (reduced) { location.href = sonra; return; }
    w.classList.add("on");
    setTimeout(() => (location.href = sonra), 1500);
  }
  $("#form-giris").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, g = f.giris.value.trim(), p = f.parola.value;
    temizle(f);
    if (!g) { alanHata(f, "giris", "Kullanıcı adını ya da e-postanı yaz."); salla(); return f.giris.focus(); }
    if (!p) { alanHata(f, "parola", "Parolanı yaz."); salla(); return f.parola.focus(); }
    gonder(f, (v) => KD.hesap.giris({ giris: v.giris, parola: v.parola }));
  });
  $("#form-kayit").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    temizle(f);
    let hata = false;
    if (!/^[a-z0-9][a-z0-9_-]{2,23}$/.test(f.kullaniciAdi.value)) { alanHata(f, "kullaniciAdi", "3–24 karakter: küçük harf, rakam, - ve _."); hata = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.eposta.value.trim())) { alanHata(f, "eposta", "Geçerli bir e-posta adresi yaz."); hata = true; }
    if (f.parola.value.length < 8 || !/\d/.test(f.parola.value) || !/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(f.parola.value)) { alanHata(f, "parola", "En az 8 karakter, bir harf ve bir rakam."); hata = true; }
    if (hata) { salla(); return $(".field.bad input", f).focus(); }
    gonder(f, (v) => KD.hesap.kayit({ ad: v.ad, kullaniciAdi: v.kullaniciAdi, eposta: v.eposta.trim(), parola: v.parola }));
  });

  /* ---------- Statik demo: hesaplar kapalı ---------- */
  if (KD.hesapYok) {
    $$(".form").forEach((f) => (f.hidden = true));
    $(".tabs").hidden = true;
    $("#signed").hidden = false;
    $("#signed h1").textContent = "Giriş gerekmiyor.";
    $("#signed-who").textContent = "Bu çevrimiçi demoda hesaplar kapalı. İlerlemen bu tarayıcıda saklanıyor; giriş yapmadan her şeyi deneyebilirsin.";
    $("#signed-go").href = "nextgen.html";
    $("#signed-out").hidden = true;
    return;
  }

  /* ---------- Zaten giriş yapmışsa ---------- */
  KD.hesap.ben().then((u) => {
    if (!u) return;
    $$(".form").forEach((f) => (f.hidden = true));
    $(".tabs").hidden = true;
    $("#signed").hidden = false;
    $("#signed-who").textContent = `${u.ad || u.kullaniciAdi} olarak giriş yaptın (@${u.kullaniciAdi}).`;
    $("#signed-go").href = sonra;
    $("#signed-out").onclick = async () => { await KD.hesap.cikis(); location.reload(); };
  });
})();
