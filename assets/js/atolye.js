/* QUAGEN NextGen — Atölye: Lablar (sanal kabukta KAM'le), Terminal (serbest çalışma alanı), Projeler ve Yol haritaları.
 * Sayfalar window.KD_SAYFALAR üzerinden app.js yönlendiricisine bağlanır: #lab, #terminal, #projeler, #yollar. */
(function () {
  const KD = window.KD;
  if (!KD) return;
  const S = KD.store, esc = KD.esc, md = KD.md;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const A = () => window.KD_APP || {};
  const L = () => window.KD_LABLAR, PR = () => window.KD_PROJELER;
  const DIL = KD.lang;
  const DIL_AD = { py: "Python", c: "C", js: "JavaScript" };
  const YUZ = '<span class="kam-av" aria-hidden="true"><b></b><b></b></span>';
  const labDurum = () => (S.state.lab = S.state.lab || {});

  /* ================================================================== Yol haritaları */
  function yollar(view) {
    const { ALANLAR, LABLAR } = L();
    const kart = (a, i) => {
      const hazir = a.durum === "hazir";
      const bitenLab = a.tur === "lab" ? LABLAR.filter((l) => l.alan === a.id && (labDurum()[l.id] || {}).bitti).length : 0;
      const hedef = a.tur === "lab" ? "#lab" : `nextgen.html?dil=${a.id}#panel`;
      return `<${hazir ? `a href="${hedef}"` : "div"} class="yol-kart ${hazir ? "" : "yakinda"} ${a.id === DIL ? "simdiki" : ""}" style="--i:${i}">
        <span class="yol-tur">${a.tur === "lab" ? "Lab yolu" : "Dil yolu"}</span>
        <h3>${esc(a.ad)}</h3>
        <p>${esc(a.ozet)}</p>
        <span class="yol-alt"><span>${esc(a.olcu)}${bitenLab ? " · " + bitenLab + " lab bitti" : ""}</span><b>${hazir ? (a.id === DIL ? "Buradasın" : "Aç") : "Yakında"}</b></span>
      </${hazir ? "a" : "div"}>`;
    };
    view.innerHTML = `<div class="page at-sayfa">
      <header class="at-bas"><h1>Yol haritaları</h1><p class="muted">Her yol sıfırdan başlar ve seni adım adım ileri taşır. Diller derslerle, alanlar tarayıcıda çalışan lablarla öğretilir. Hepsinde anlatan KAM, yazan sensin.</p></header>
      <h2 class="at-ara">Hazır</h2>
      <div class="yol-izgara">${ALANLAR.filter((a) => a.durum === "hazir").map(kart).join("")}</div>
      <h2 class="at-ara">Hazırlanıyor</h2>
      <div class="yol-izgara">${ALANLAR.filter((a) => a.durum !== "hazir").map(kart).join("")}</div>
    </div>`;
  }

  /* ================================================================== Lab kataloğu */
  function lablar(view) {
    const { LABLAR } = L(), d = labDurum();
    view.innerHTML = `<div class="page at-sayfa">
      <header class="at-bas"><h1>Lablar</h1><p class="muted">Her lab, tarayıcında açılan sahte bir Linux makinesi. Hiçbir şeyi bozamazsın. KAM solda anlatır, sen sağdaki terminale yazarsın; sonunda bir bayrak bulursun.</p></header>
      <h2 class="at-ara">Siber Güvenlik · sıfırdan</h2>
      <ol class="lab-liste">${LABLAR.map((l, i) => {
        const x = d[l.id] || {}, oran = x.bitti ? 1 : (x.adim || 0) / l.adimlar.length;
        return `<li style="--i:${i}"><a href="#lab/${l.id}" class="lab-kart ${x.bitti ? "bitti" : ""}">
          <span class="lab-no">${x.bitti ? "✓" : l.no}</span>
          <span class="lab-yazi"><b>${esc(l.baslik)}</b><span>${esc(l.ozet)}</span>
            <span class="lab-etiket">${l.kazanim.map((k) => `<i>${esc(k)}</i>`).join("")}</span></span>
          <span class="lab-yan"><span>${esc(l.seviye)} · ${l.sure} dk</span><span class="lab-cubuk"><i style="width:${oran * 100}%"></i></span><b>${x.bitti ? "Yeniden çöz" : x.adim ? "Devam et" : "Başla"}</b></span>
        </a></li>`;
      }).join("")}</ol>
      <p class="muted small at-not">Bu lablar gerçek bir sisteme bağlanmaz; komutlar tarayıcıdaki bir benzetimde çalışır. Burada öğrendiklerini yalnızca kendi sistemlerinde ya da izin verilen alıştırma ortamlarında kullan.</p>
    </div>`;
  }

  /* ================================================================== Lab ekranı: solda KAM, sağda terminal */
  let labNo = 0;
  function labAc(view, id) {
    const lab = L().LABLAR.find((l) => l.id === id);
    if (!lab) return lablar(view);
    const benim = ++labNo, d = (labDurum()[id] = labDurum()[id] || { adim: 0 });
    if (d.bitti) d.adim = 0;                       // bitmiş lab yeniden çözülür
    let kabuk = window.KD_KABUK.olustur({ dosyalar: lab.dosyalar });
    /* Kaldığı yerden devam: geçilmiş adımların çözümleri sessizce yeniden uygulanır */
    for (let i = 0; i < d.adim; i++) lab.adimlar[i].cozum.forEach((c) => { if (!/^bayrak\s/.test(c)) kabuk.calistir(c); });
    kabuk.gecmis.length = 0;
    view.innerHTML = `<div class="page lab-sayfa">
      <header class="lab-ust"><a class="btn sm ghost" href="#lab">‹ Lablar</a><div><p class="muted small">Siber Güvenlik · Lab ${lab.no}</p><h1>${esc(lab.baslik)}</h1></div><span class="lab-sayac" id="lab-sayac"></span></header>
      <div class="kam-ders lab-duzen">
        <section class="kam-sohbet" aria-label="KAM anlatıyor">
          <header class="kam-bas">${YUZ}<div><b>KAM</b><small>${esc(lab.seviye)} · yaklaşık ${lab.sure} dakika</small></div><button class="btn sm ghost" id="lab-ipucu">İpucu</button></header>
          <div class="kam-ilerleme"><i id="lab-ilerleme"></i></div>
          <div class="kam-akis" id="lab-akis" aria-live="polite"></div>
          <div class="lab-gorev" id="lab-gorev" hidden></div>
          <div class="kam-cevap" id="lab-cevap"></div>
        </section>
        <section class="term" aria-label="Terminal">
          <header class="term-bas"><span class="s-isik" aria-hidden="true"><i></i><i></i><i></i></span><span class="file">${esc(kabuk.kullanici)}@${esc(kabuk.makine)}</span><span class="sahne-durum">sanal makine</span><button class="btn sm ghost" id="lab-sifirla">Sıfırla</button></header>
          <div class="term-ekran" id="term-ekran" tabindex="-1"><div class="term-cikti" id="term-cikti"></div>
            <form class="term-satir" id="term-form"><label class="term-istem" id="term-istem" for="term-girdi"></label><input id="term-girdi" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Komut" /></form></div>
          <form class="term-bayrak" id="bayrak-form"><label for="bayrak-girdi">Bayrak</label><input id="bayrak-girdi" placeholder="QG{...}" autocomplete="off" spellcheck="false" /><button class="btn sm primary">Gönder</button></form>
        </section>
      </div></div>`;
    const sc = window.KAM.sohbet($("#lab-akis", view), $("#lab-cevap", view));
    const cikti = $("#term-cikti", view), girdi = $("#term-girdi", view), ekran = $("#term-ekran", view), gorevEl = $("#lab-gorev", view);
    const yasiyor = () => benim === labNo && view.isConnected && $(".lab-sayfa", view);
    let gecmisNo = -1, ipucuVerildi = false, mesgul = false;
    const istemYaz = () => ($("#term-istem", view).textContent = kabuk.istem());
    const yazdir = (html) => { cikti.insertAdjacentHTML("beforeend", html); ekran.scrollTop = ekran.scrollHeight; };
    const ilerle = () => { const n = lab.adimlar.length; $("#lab-ilerleme", view).style.width = (d.adim / n) * 100 + "%"; $("#lab-sayac", view).textContent = d.bitti ? "Tamamlandı" : `Adım ${Math.min(d.adim + 1, n)} / ${n}`; };
    yazdir(`<div class="t-bilgi">QUAGEN lab makinesi. Komut listesi için <b>help</b> yaz. Tab ile dosya adı tamamlanır, ↑ önceki komutu getirir.</div>`);
    istemYaz(); ilerle();

    async function adimAnlat() {
      if (!yasiyor()) return;
      const a = lab.adimlar[d.adim];
      ipucuVerildi = false; mesgul = true; gorevEl.hidden = true;
      for (const m of a.k) { await sc.kam(m); if (!yasiyor()) return; }
      gorevEl.innerHTML = `<span>Görev</span><b>${esc(a.gorev)}</b>`; gorevEl.hidden = false;
      mesgul = false; girdi.focus({ preventScroll: true });
    }
    async function olay(o) {
      if (d.bitti || mesgul) return;
      const a = lab.adimlar[d.adim];
      if (!L().gecti(a, o, kabuk)) {
        if (o.bayrak) { yazdir(`<div class="t-hata">Bayrak doğru değil. Biçim: QG{...}</div>`); sc.kam("Bu bayrak tutmadı. Metni olduğu gibi, süslü parantezleriyle birlikte yaz."); }
        return;
      }
      d.adim++; S.save(); ilerle(); gorevEl.hidden = true;
      if (d.adim < lab.adimlar.length) { mesgul = true; await sc.kam("✓ " + (o.bayrak ? "Bayrak doğru." : "Tamam.")); adimAnlat(); return; }
      const ilkKez = !d.kazanildi;
      d.bitti = true; d.kazanildi = true; S.save(); ilerle();
      if (ilkKez) { S.addXP(60); if (A().renderBar) A().renderBar(); }
      if (A().celebrate) A().celebrate($(".term", view));
      yazdir(`<div class="t-basari">Bayrak kabul edildi. Lab tamamlandı${ilkKez ? " · +60 XP" : ""}.</div>`);
      await sc.kam("✓ Bayrak doğru. " + lab.kapanis);
      const sonraki = L().LABLAR.find((x) => x.alan === lab.alan && x.no === lab.no + 1);
      const sec = await sc.secenek(sonraki ? ["Sonraki lab: " + sonraki.baslik, "Lab listesine dön"] : ["Lab listesine dön"], { beklet: true });
      if (!yasiyor()) return;
      location.hash = sonraki && sec === 0 ? "#lab/" + sonraki.id : "#lab";
    }
    function komut(satir) {
      yazdir(`<div class="t-komut"><span>${esc(kabuk.istem())}</span> ${esc(satir)}</div>`);
      const m = satir.trim().match(/^bayrak\s+(.+)$/);
      if (m) { istemYaz(); return olay({ bayrak: m[1] }); }
      const r = kabuk.calistir(satir);
      if (r.temizle) cikti.innerHTML = "";
      else if (r.cikti) yazdir(`<pre class="${r.hata ? "t-hata" : "t-metin"}">${esc(r.cikti.replace(/\n$/, ""))}</pre>`);
      istemYaz();
      olay({ satir: satir.trim(), sonuc: r });
    }
    $("#term-form", view).onsubmit = (e) => { e.preventDefault(); const s = girdi.value; girdi.value = ""; gecmisNo = -1; if (s.trim()) komut(s); };
    girdi.onkeydown = (e) => {
      const g = kabuk.gecmis;
      if (e.key === "ArrowUp") { e.preventDefault(); if (!g.length) return; gecmisNo = gecmisNo < 0 ? g.length - 1 : Math.max(0, gecmisNo - 1); girdi.value = g[gecmisNo]; }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (gecmisNo < 0) return; gecmisNo++; if (gecmisNo >= g.length) { gecmisNo = -1; girdi.value = ""; } else girdi.value = g[gecmisNo]; }
      else if (e.key === "Tab") { e.preventDefault(); const i = girdi.value.lastIndexOf(" "), on = girdi.value.slice(i + 1); if (!on) return; const t = kabuk.tamamla(on); if (t.length === 1) girdi.value = girdi.value.slice(0, i + 1) + t[0]; else if (t.length > 1) yazdir(`<pre class="t-metin">${esc(t.join("  "))}</pre>`); }
      else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); cikti.innerHTML = ""; }
    };
    ekran.onclick = () => { if (!String(getSelection())) girdi.focus({ preventScroll: true }); };
    $("#bayrak-form", view).onsubmit = (e) => { e.preventDefault(); const g = $("#bayrak-girdi", view), v = g.value.trim(); if (!v) return; g.value = ""; yazdir(`<div class="t-komut"><span>bayrak</span> ${esc(v)}</div>`); olay({ bayrak: v }); };
    $("#lab-ipucu", view).onclick = () => { if (d.bitti || mesgul) return; const a = lab.adimlar[d.adim]; sc.kam(ipucuVerildi ? "Şunu yaz: `" + a.cozum.filter((c) => !/^bayrak\s/.test(c)).join("`, sonra `") + "`" : a.ipucu); ipucuVerildi = true; };
    $("#lab-sifirla", view).onclick = () => { delete labDurum()[id]; S.save(); labAc(view, id); };
    adimAnlat();
  }

  /* ================================================================== Projeler */
  function projeler(view) {
    const { PROJELER, SEVIYELER } = PR();
    const biten = bitenDers();
    const dosyalar = atolye().dosyalar;
    view.innerHTML = `<div class="page at-sayfa">
      <header class="at-bas"><h1>Projeler</h1><p class="muted">Dersler sana parçaları verir; proje onları birleştirmeyi öğretir. Burada testler yok, doğru cevap tek değil. Bir projeyi seç, Terminal'de aç, adım adım kur.</p>
        <p class="at-bilgi">${esc(DIL_AD[DIL] || DIL)} ile ${biten} dersi bitirdin. Hazır olduğun projeler işaretli; diğerlerini denemek de serbest.</p></header>
      ${[1, 2, 3, 4, 5].map((sv) => `<section class="pj-seviye"><h2 class="at-ara"><span class="pj-sv">${sv}</span>${SEVIYELER[sv]}</h2>
        <div class="pj-izgara">${PROJELER.filter((p) => p.seviye === sv).map((p, i) => {
          const d = dosyalar.find((x) => x.proje === p.id), tamam = d ? (d.adimlar || []).filter(Boolean).length : 0;
          return `<a href="#terminal/${p.id}" class="pj-kart ${p.ders <= biten ? "hazir" : ""}" style="--i:${i}">
            <b>${esc(p.ad)}</b><span>${esc(p.ozet)}</span>
            <span class="pj-alt"><i>${p.dk} dk</i><i>${p.adimlar.length} adım</i><i>${p.ders <= biten ? "hazırsın" : "Ders " + p.ders + " sonrası"}</i>${d ? `<i class="pj-ilerleme">${tamam}/${p.adimlar.length} adım</i>` : ""}</span>
          </a>`;
        }).join("")}</div></section>`).join("")}
    </div>`;
  }

  /* ================================================================== Terminal: serbest çalışma alanı */
  const ANAHTAR = "kd-atolye-v1";
  let _at = null;
  /* Dosyalar ilerlemeyle birlikte saklanır: hesap açıksa başka cihazda da görünür.
     Önceki sürümde yalnızca tarayıcıda duran dosyalar ilk açılışta buraya taşınır. */
  function atolye() {
    if (_at && S.state.atolye === _at) return _at;
    _at = S.state.atolye;
    if (!_at || !Array.isArray(_at.dosyalar)) {
      let eski = null;
      try { eski = JSON.parse(localStorage.getItem(ANAHTAR) || "null"); } catch (_) {}
      _at = S.state.atolye = eski && Array.isArray(eski.dosyalar) ? eski : { dosyalar: [], acik: null };
      if (eski) { try { localStorage.removeItem(ANAHTAR); } catch (_) {} S.save(); }
    }
    return _at;
  }
  let kayitZ = null;
  const atKaydet = () => { clearTimeout(kayitZ); kayitZ = setTimeout(() => S.save(), 400); };
  const bitenDers = () => (window.KD_CURRICULUM || []).filter((p) => (p.language || "js") === DIL && p.challenges.every((c) => S.phase(p.id).passed[c.id])).length;
  /* Bitirilen derslere uygun, henüz başlanmamış en ileri proje */
  function projeOner() {
    const biten = bitenDers(); if (!biten || !PR()) return null;
    const baslanan = new Set(atolye().dosyalar.map((x) => x.proje).filter(Boolean));
    return PR().PROJELER.filter((p) => p.ders <= biten && !baslanan.has(p.id)).sort((a, b) => b.ders - a.ders || a.seviye - b.seviye)[0] || null;
  }
  /* Panelde Atölye şeridi: sıradaki lab, önerilen proje, Terminal */
  function serit(view) {
    if (!view || view.querySelector(".at-serit") || !view.querySelector(".dash, .dash-head, .kam-kart")) return;
    const lab = L().LABLAR.find((l) => !(labDurum()[l.id] || {}).bitti), x = lab ? labDurum()[lab.id] || {} : null, pj = projeOner();
    const el = document.createElement("section");
    el.className = "at-serit";
    el.innerHTML = `
      ${lab ? `<a href="#lab/${lab.id}"><span class="as-et">Lab ${lab.no}${x.adim ? " · adım " + (x.adim + 1) + "/" + lab.adimlar.length : ""}</span><b>${esc(lab.baslik)}</b><small>${lab.sure} dk · sanal makine</small></a>` : `<a href="#lab"><span class="as-et">Lablar</span><b>Hepsini bitirdin</b><small>Yeniden çözebilirsin</small></a>`}
      <a href="${pj ? "#terminal/" + pj.id : "#projeler"}"><span class="as-et">Proje</span><b>${pj ? esc(pj.ad) : "Proje fikirleri"}</b><small>${pj ? pj.dk + " dk · " + pj.adimlar.length + " adım" : "İlk dersi bitirince öneririm"}</small></a>
      <a href="#terminal"><span class="as-et">Terminal</span><b>Serbest çalış</b><small>${atolye().dosyalar.length ? atolye().dosyalar.length + " dosyan var" : "Aklına geleni dene"}</small></a>`;
    const kart = view.querySelector(".kam-kart");
    if (kart) kart.after(el); else view.prepend(el);
  }
  window.KD_ATOLYE = { projeOner, serit };
  (function kur() {
    const view = document.getElementById("view"); if (!view) return setTimeout(kur, 60);
    const bak = () => { if (!location.hash || location.hash === "#panel") setTimeout(() => serit(view), 30); };
    new MutationObserver(bak).observe(view, { childList: true }); bak();
  })();
  const UZANTI = { py: "py", c: "c", js: "js" };
  const BOS = { py: 'ad = "dünya"\nprint(f"Merhaba, {ad}!")\n', c: '#include <stdio.h>\n\nint main(void) {\n    printf("Merhaba, dünya!\\n");\n    return 0;\n}\n', js: 'const ad = "dünya";\nconsole.log(`Merhaba, ${ad}!`);\n' };
  const MOD = { py: "python", c: "text/x-csrc", js: "javascript" };
  const yeniKimlik = () => "d" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);

  function terminal(view, projeId) {
    const at = atolye(), dil0 = UZANTI[DIL] ? DIL : "py";
    const proje = projeId ? PR().PROJELER.find((p) => p.id === projeId) : null;
    if (proje) {
      let d = at.dosyalar.find((x) => x.proje === proje.id && x.dil === dil0);
      if (!d) { d = { id: yeniKimlik(), ad: proje.id + "." + UZANTI[dil0], dil: dil0, kod: PR().baslangic(proje, dil0), proje: proje.id, adimlar: [] }; at.dosyalar.unshift(d); }
      at.acik = d.id; atKaydet();
    }
    if (!at.dosyalar.length) { at.dosyalar.push({ id: yeniKimlik(), ad: "deneme." + UZANTI[dil0], dil: dil0, kod: BOS[dil0] }); at.acik = at.dosyalar[0].id; atKaydet(); }
    if (!at.dosyalar.some((x) => x.id === at.acik)) at.acik = at.dosyalar[0].id;
    let ed = null;
    const acik = () => at.dosyalar.find((x) => x.id === at.acik);

    function ciz() {
      const d = acik(), p = d.proje ? PR().PROJELER.find((x) => x.id === d.proje) : null;
      view.innerHTML = `<div class="page tw-sayfa">
        <div class="tw ${p ? "projeli" : ""}">
          <aside class="tw-dosyalar" aria-label="Dosyalar">
            <header><b>Dosyalar</b><span class="muted small">${at.dosyalar.length}</span></header>
            <ul>${at.dosyalar.map((x) => `<li><button class="tw-dosya ${x.id === d.id ? "on" : ""}" data-id="${x.id}"><i class="tw-dil d-${x.dil}">${x.dil === "js" ? "JS" : x.dil === "py" ? "Py" : "C"}</i><span>${esc(x.ad)}</span></button></li>`).join("")}</ul>
            <div class="tw-yeni"><span class="muted small">Yeni dosya</span><div>${Object.keys(UZANTI).map((k) => `<button class="btn sm" data-yeni="${k}">${DIL_AD[k]}</button>`).join("")}</div></div>
            <a class="tw-proje-link" href="#projeler">Proje fikirleri</a>
          </aside>
          <section class="tw-orta">
            <header class="tw-cubuk">
              <input class="tw-ad" id="tw-ad" value="${esc(d.ad)}" maxlength="40" aria-label="Dosya adı" spellcheck="false" />
              <span class="tw-rozet d-${d.dil}">${DIL_AD[d.dil]}</span>
              <span class="spacer"></span>
              <button class="btn sm ghost" id="tw-indir" title="Dosyayı indir">İndir</button>
              <button class="btn sm ghost" id="tw-sil">Sil</button>
              <button class="btn primary" id="tw-calistir">▷ Çalıştır <kbd>Ctrl</kbd><kbd>Enter</kbd></button>
            </header>
            <div class="tw-editor" id="tw-editor"></div>
            <div class="tw-alt">
              <div class="tw-konsol"><header><b>Çıktı</b><span class="muted small" id="tw-sure"></span><button class="btn sm ghost" id="tw-temizle">Temizle</button></header>
                <div class="preview" id="tw-onizle" hidden></div><div class="console" id="tw-cikti"><div class="log muted">Henüz çalıştırmadın. Ctrl + Enter ile çalıştır.</div></div></div>
              <div class="tw-girdi"><header><b>Girdi</b><span class="muted small">program okursa buradan okur</span></header><textarea id="tw-stdin" spellcheck="false" placeholder="Her satır bir girdi">${esc(d.stdin || "")}</textarea></div>
            </div>
          </section>
          ${p ? `<aside class="tw-proje" aria-label="Proje">
            <p class="muted small">Proje · ${PR().SEVIYELER[p.seviye]}</p><h2>${esc(p.ad)}</h2><p>${esc(p.ozet)}</p>
            <ol class="tw-adimlar">${p.adimlar.map((a, i) => `<li><label><input type="checkbox" data-adim="${i}" ${(d.adimlar || [])[i] ? "checked" : ""} /><span>${esc(a)}</span></label></li>`).join("")}</ol>
            <p class="muted small">Beklenen çıktıya bir örnek</p><pre class="tw-ornek">${esc(p.ornek)}</pre>
            <button class="btn sm" id="tw-kam">Takıldım, KAM'e sor</button>
          </aside>` : ""}
        </div></div>`;
      const calistir = async () => {
        const b = $("#tw-calistir", view); if (b.disabled) return;
        b.disabled = true; const t0 = performance.now();
        try { await A().runSnippet({ lang: d.dil, code: d.kod, stdin: d.stdin || "" }, $("#tw-cikti", view), $("#tw-onizle", view)); }
        finally { b.disabled = false; if ($("#tw-sure", view)) $("#tw-sure", view).textContent = ((performance.now() - t0) / 1000).toFixed(1) + " sn"; }
      };
      ed = A().makeEditor($("#tw-editor", view), d.kod, (v) => { d.kod = v; atKaydet(); }, calistir, MOD[d.dil]);
      $("#tw-calistir", view).onclick = calistir;
      $("#tw-temizle", view).onclick = () => ($("#tw-cikti", view).innerHTML = '<div class="log muted">Temizlendi.</div>');
      $("#tw-stdin", view).oninput = (e) => { d.stdin = e.target.value; atKaydet(); };
      $("#tw-ad", view).onchange = (e) => { d.ad = e.target.value.trim() || d.ad; atKaydet(); ciz(); };
      $("#tw-indir", view).onclick = () => { const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([d.kod], { type: "text/plain" })), download: d.ad }); a.click(); URL.revokeObjectURL(a.href); };
      $("#tw-sil", view).onclick = () => { if (!confirm(`“${d.ad}” silinsin mi? Bu geri alınamaz.`)) return; at.dosyalar = at.dosyalar.filter((x) => x.id !== d.id); if (!at.dosyalar.length) at.dosyalar.push({ id: yeniKimlik(), ad: "deneme." + UZANTI[dil0], dil: dil0, kod: BOS[dil0] }); at.acik = at.dosyalar[0].id; atKaydet(); if (location.hash !== "#terminal") location.hash = "#terminal"; else ciz(); };
      $$(".tw-dosya", view).forEach((b) => (b.onclick = () => { at.acik = b.dataset.id; atKaydet(); if (location.hash !== "#terminal") history.replaceState(null, "", "#terminal"); ciz(); }));
      $$("[data-yeni]", view).forEach((b) => (b.onclick = () => { const k = b.dataset.yeni, n = at.dosyalar.filter((x) => x.dil === k && !x.proje).length + 1; const y = { id: yeniKimlik(), ad: `deneme${n > 1 ? n : ""}.${UZANTI[k]}`, dil: k, kod: BOS[k] }; at.dosyalar.unshift(y); at.acik = y.id; atKaydet(); ciz(); }));
      $$("[data-adim]", view).forEach((c) => (c.onchange = () => { d.adimlar = d.adimlar || []; d.adimlar[+c.dataset.adim] = c.checked; atKaydet(); if (p && p.adimlar.every((_, i) => d.adimlar[i]) && !d.kutlandi) { d.kutlandi = true; atKaydet(); S.addXP(40); if (A().renderBar) A().renderBar(); if (A().celebrate) A().celebrate($(".tw-proje", view)); if (A().toast) A().toast("Projeyi tamamladın. +40 XP"); } }));
      if ($("#tw-kam", view)) $("#tw-kam", view).onclick = () => window.KAM && window.KAM.ac();
    }
    ciz();
  }

  window.KD_SAYFALAR = {
    yollar: { ad: "Yol haritaları", ciz: (v) => yollar(v) },
    lab: { ad: "Lablar", ciz: (v, b) => (b ? labAc(v, b) : lablar(v)) },
    projeler: { ad: "Projeler", ciz: (v) => projeler(v) },
    terminal: { ad: "Terminal", ciz: (v, b) => terminal(v, b) }
  };
})();
