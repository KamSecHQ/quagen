/* QUAGEN — "Sorular" adımı: KAM'in anlatımından sonra, alıştırmadan önce 10 seçmeli soru.
 * Her soruda 5 şık vardır. Bazı sorularda birden fazla doğru şık bulunur; bu, soruda açıkça yazılır.
 * Sorular dersin kendi içeriğinden üretilir (çözümlü örnek, KAM'in açıklamaları, tekrar kartları, tahmin sorusu):
 *   anlam  → gösterilen satır ne yapar?                 satir  → şu işi hangi satır yapar?
 *   bosluk → boşluğa hangi sözcük gelir?                kart   → dersin kavram sorusu
 *   hatasiz→ hangi satırlar hatasız yazılmış? (çoklu)   gecer  → hangileri bu dersin örneğinde geçer? (çoklu) */
(function (kok) {
  const AL = () => kok.KD_ALISTIR || (typeof require === "function" ? require("./alistir.js") : null);
  const dilOf = (p) => p.language || "js";
  /* Tohumlu karıştırma: aynı ders her açılışta aynı soruları verir (gözden geçirilebilir, sınanabilir) */
  function rasgele(tohum) { let t = tohum >>> 0; return () => { t = (t + 0x6d2b79f5) >>> 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  const tohumOf = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const karistir = (l, r) => { const a = l.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  /* Şıklar ve sorular kısa olmalı: yalnızca ilk cümle, o da uzunsa kelime sınırında kesilir */
  const kisalt = (s, n = 78) => { s = String(s).trim(); const ilk = (s.match(/^.*?[.!?](?=\s|$)/) || [s])[0].trim(); const t = ilk.length >= 18 ? ilk : s; return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "").replace(/[,;:]$/, "") + "…" : t; };
  const uzun = (s, n = 200) => { s = String(s).trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; };

  /* Bir satırı küçük ama gerçek bir yazım hatasıyla bozar; bozamazsa null */
  function boz(satir, r) {
    const yollar = [];
    if (/;$/.test(satir)) yollar.push(() => satir.slice(0, -1));
    if (/:$/.test(satir)) yollar.push(() => satir.slice(0, -1));
    if (/\)/.test(satir)) yollar.push(() => { const i = satir.lastIndexOf(")"); return satir.slice(0, i) + satir.slice(i + 1); });
    if (/"/.test(satir)) yollar.push(() => { const i = satir.lastIndexOf('"'); return satir.slice(0, i) + satir.slice(i + 1); });
    if (/\bprintf\b/.test(satir)) yollar.push(() => satir.replace("printf", "print"));
    if (/\bconsole\.log\b/.test(satir)) yollar.push(() => satir.replace("console.log", "console.Log"));
    if (/^print\(/.test(satir)) yollar.push(() => satir.replace(/^print/, "Print"));
    if (/^(int|double|char|long|const|let) /.test(satir)) yollar.push(() => satir.replace(/^(\w+) /, (m, k) => k[0].toUpperCase() + k.slice(1) + " "));
    if (/<\/\w+>$/.test(satir)) yollar.push(() => satir.replace(/<\/(\w+)>$/, "<$1>"));
    if (/ = /.test(satir) && !/==/.test(satir) && !/^(for|if|while)/.test(satir)) yollar.push(() => satir.replace(" = ", " == "));
    if (!yollar.length) return null;
    const y = yollar[Math.floor(r() * yollar.length)]();
    return y !== satir ? y : null;
  }
  const NEDEN = (asil, bozuk) => (bozuk.length < asil.length ? "bir karakter eksik" : /==/.test(bozuk) && !/==/.test(asil) ? "atama yerine karşılaştırma (==) yazılmış" : "bir sözcük yanlış yazılmış");

  function uret(p, mufredat, adet = 10) {
    const al = AL(), tum = mufredat || kok.KD_CURRICULUM || [];
    const r = rasgele(tohumOf(p.id));
    const O = al.ornek(p);
    const komsu = tum.filter((q) => dilOf(q) === dilOf(p) && q.id !== p.id && q.example).sort((a, b) => Math.abs(a.no - p.no) - Math.abs(b.no - p.no) || ((a.track || "") === (p.track || "") ? -1 : 1));

    /* (satır, açıklama) çiftleri: KAM'in tek ya da iki satır için yaptığı açıklamalar en nettir */
    const ciftler = [];
    O.parcalar.forEach((ex) => { const kodSatir = ex.code.split("\n"); (ex.steps || []).forEach((s) => { const l = (s.lines || []).map((no) => (kodSatir[no - 1] || "").trim()).filter((t) => t.length >= 4 && t.length <= 70 && /[A-Za-z]{2}/.test(t) && !/^[{}]$/.test(t)); if (l.length && s.text) ciftler.push({ satir: l[0], satirlar: l, aciklama: s.text, n: (s.lines || []).length, dar: (s.lines || []).length <= 2 }); }); });
    /* Aynı satır birden çok açıklamada geçiyorsa en dar (en özel) açıklama kalır; bir satır bir kez sorulur */
    ciftler.sort((a, b) => a.n - b.n);
    for (let i = ciftler.length - 1; i >= 0; i--) if (ciftler.findIndex((x) => x.satir === ciftler[i].satir) !== i) ciftler.splice(i, 1);
    const yakin = komsu.slice(0, 4);                       // çeldiriciler yakın derslerden: ne çok kolay ne de görülmemiş konu
    const benimSatirlar = al.satirlar(p, 8, tum).map((x) => x.satir);
    const digerAciklama = yakin.flatMap((q) => (q.example.steps || []).map((s) => s.text)).filter(Boolean);
    const digerSatir = yakin.flatMap((q) => al.satirlar(q, 5, tum).map((x) => x.satir));
    const benzersiz = (l) => [...new Map(l.map((x) => [x.replace(/\s+/g, " ").trim(), x])).values()];
    const sorular = [];
    const sik5 = (dogrular, yanlislar, sirali) => {
      const d = benzersiz(dogrular), y = benzersiz(yanlislar).filter((x) => !d.some((k) => k.replace(/\s+/g, " ").trim() === x.replace(/\s+/g, " ").trim()));
      if (d.length + y.length < 5) return null;
      const secenekler = karistir([...d.map((t) => ({ t, d: true })), ...(sirali ? y : karistir(y, r)).slice(0, 5 - d.length).map((t) => ({ t, d: false }))], r);
      return secenekler;
    };
    const ekle = (tur, soru, kod, secenekler, neden, kodSik) => { if (secenekler && secenekler.length === 5) sorular.push({ tur, soru, kod: kod || "", secenekler: secenekler.map((s) => s.t), dogru: secenekler.map((s, i) => (s.d ? i : -1)).filter((i) => i >= 0), neden, kodSik: !!kodSik }); };

    /* 1. Anlam: bu satır ne yapar? */
    const digerBenim = (c) => ciftler.filter((x) => x !== c).map((x) => kisalt(x.aciklama));
    const anlamIcin = karistir(ciftler, r).sort((a, b) => b.dar - a.dar).slice(0, 3);
    anlamIcin.forEach((c) => ekle("anlam", "Bu satır ne yapar?", c.satirlar.slice(0, 2).join("\n"), sik5([kisalt(c.aciklama)], [...digerBenim(c), ...digerAciklama.map((x) => kisalt(x))]), uzun(c.aciklama)));
    /* 2. Satır: şu işi hangi satır yapar? */
    /* Aynı satır hem "ne yapar" hem "hangi satır" olarak sorulmasın: önce kullanılmamış açıklamalar */
    const satirIcin = [...karistir(ciftler.filter((c) => !anlamIcin.includes(c)), r), ...karistir(anlamIcin.filter((c) => c.dar), r)].slice(0, 2);
    satirIcin.forEach((c) => ekle("satir", "Hangi satır?\n" + kisalt(c.aciklama, 96), "", sik5([c.satir], [...benimSatirlar.filter((s) => !c.satirlar.includes(s)), ...digerSatir]), "Doğru satır: `" + c.satir + "`", true));
    /* 3. Boşluk: hangi sözcük gelir? Çeldiriciler tartışmasız yanlıştır: doğru sözcüğün yanlış yazımları
          (büyük harf, eksik harf) ve başka işe yarayan sözcükler. Aynı türden geçerli bir seçenek (int yerine double) konmaz. */
    const kategori = (x) => (/^%/.test(x) ? "bicim" : al.SOZLUK.get(x) || "");
    const sozcukHavuzu = [...new Set([...benimSatirlar, ...digerSatir].flatMap((s) => [...al.parcalar(s)]).filter((x) => al.SOZLUK.has(x) || /^%/.test(x)))];
    let bs = 0;
    for (const s of benimSatirlar) {
      if (bs >= 2) break;
      const b = al.boslukSec(s, bs); if (!b || !/^[A-Za-z%]/.test(b.bos) || !kategori(b.bos)) continue;   // HTML etiketi sorulmaz: <H1> de geçerlidir
      const yanlisYazim = /^%/.test(b.bos) ? ["%" + b.bos.slice(1).toUpperCase(), "&" + b.bos.slice(1), b.bos.slice(1)] : [b.bos[0].toUpperCase() + b.bos.slice(1), b.bos.length > 3 ? b.bos.slice(0, -1) : b.bos + b.bos.slice(-1), b.bos.toUpperCase()];
      const baska = karistir(sozcukHavuzu.filter((x) => x !== b.bos && kategori(x) !== kategori(b.bos) && /^[A-Za-z%]/.test(x)), r);
      const sec = sik5([b.bos], [...yanlisYazim.slice(0, 2), ...baska.slice(0, 2), yanlisYazim[2], ...baska.slice(2)].filter((x) => x && x !== b.bos), true);
      if (!sec) continue;
      ekle("bosluk", "Boşluğa ne gelir?", b.on + "_____" + b.son, sec, "Satırın tamamı: `" + s + "`", true); bs++;
    }
    /* 4. Kartlar: dersin kavram soruları */
    const digerKart = yakin.flatMap((q) => (q.cards || []).map((c) => kisalt(c.a)));
    (p.cards || []).forEach((c) => ekle("kart", kisalt(c.q, 110), "", sik5([kisalt(c.a)], [...(p.cards || []).filter((x) => x !== c).map((x) => kisalt(x.a)), ...digerKart]), uzun(c.a, 240)));
    /* 5. Çoklu: hangileri hatasız yazılmış? */
    const coklu = (tohumEk) => {
      const rr = rasgele(tohumOf(p.id + tohumEk)), kaynak = karistir(benimSatirlar.filter((s) => s.length <= 60), rr);
      const nDogru = 2 + Math.floor(rr() * 2), dogrular = [], bozuklar = [];
      for (const s of kaynak) { if (dogrular.length < nDogru) dogrular.push(s); else { const b = boz(s, rr); if (b) bozuklar.push({ b, s }); } }
      for (const s of karistir(digerSatir.filter((x) => x.length <= 60), rr)) { if (bozuklar.length >= 5 - dogrular.length) break; const b = boz(s, rr); if (b && !dogrular.includes(b)) bozuklar.push({ b, s }); }
      if (dogrular.length < 2 || bozuklar.length < 5 - dogrular.length) return;
      const kullan = bozuklar.slice(0, 5 - dogrular.length);
      const sec = karistir([...dogrular.map((t) => ({ t, d: true })), ...kullan.map((x) => ({ t: x.b, d: false }))], rr);
      if (new Set(sec.map((x) => x.t)).size < 5) return;
      ekle("hatasiz", `Hangileri hatasız?\nBirden fazla doğru şık var: ${dogrular.length} tanesini işaretle.`, "", sec, "Hatalı olanlar: " + kullan.map((x) => "`" + x.b + "` (" + NEDEN(x.s, x.b) + ")").join("; "), true);
    };
    coklu("a"); coklu("b"); coklu("c");
    /* 6. Çoklu: hangileri bu dersin örneğinde geçer? */
    { const d = karistir(benimSatirlar, r).slice(0, 2), sec = sik5(d, digerSatir.filter((s) => !benimSatirlar.includes(s)));
      if (sec && d.length === 2) ekle("gecer", "Hangileri bu derste geçti?\nBirden fazla doğru şık var: 2 tanesini işaretle.", "", sec, "Bu derste geçenler: " + d.map((x) => "`" + x + "`").join(" ve "), true); }
    /* Tahmin sorusu (5 şıklıysa) en başa */
    /* Sıra: önce anlam, sonra tanıma, sonra çoklu; türler karışık ama kolaydan zora */
    /* Okuması az, koda bakması çok sorular önce; düz metinli olanlar (anlam, kart) en çok dört tane */
    const sira = ["bosluk", "satir", "hatasiz", "kart", "bosluk", "anlam", "gecer", "satir", "kart", "hatasiz", "anlam", "hatasiz", "kart", "anlam"];
    const kalan = sorular.slice(), secilen = [];
    for (const t of sira) { if (secilen.length >= adet) break; const i = kalan.findIndex((s) => s.tur === t); if (i >= 0) secilen.push(kalan.splice(i, 1)[0]); }
    while (secilen.length < adet && kalan.length) secilen.push(kalan.shift());
    /* Yine de eksikse (çok kısa örnekli dersler) farklı karışımlı çoklu sorularla tamamlanır */
    for (let k = 0; secilen.length < adet && k < 6; k++) { const once = sorular.length; coklu("x" + k); if (sorular.length > once && !secilen.some((q) => q.secenekler.join("|") === sorular[sorular.length - 1].secenekler.join("|"))) secilen.push(sorular[sorular.length - 1]); }
    return secilen;
  }

  /* ------------------------------------------------------------------ ekran */
  function baslat(p, stage, { bitince } = {}) {
    const KD = kok.KD, S = KD.store, esc = KD.esc, md = KD.md || esc, A = kok.KD_APP || {};
    const dil = AL().ornek(p).dil || KD.lang;
    const vurgu = (s) => (KD.hlDoc ? KD.hlDoc(s, A.hlLang ? A.hlLang(dil) : dil).join("\n") : esc(s));
    const sorular = uret(p), ph = S.phase(p.id);
    const YUZ = '<span class="kam-av" aria-hidden="true"><b></b><b></b></span>';
    if (!sorular.length) { ph.quiz = { skor: 0, n: 0 }; S.save(); stage.innerHTML = `<div class="panel"><p>Bu derste soru yok. <a href="#${p.id}/alistir">Alıştırmaya geç</a></p></div>`; return; }
    const durum = sorular.map(() => ({ secili: new Set(), bitti: false, dogru: false }));
    let n = 0;
    const HARF = "ABCDE";
    stage.innerHTML = `<div class="al sr-kutu">
      <header class="al-ust">${YUZ}<div class="al-kam"><p class="al-tur"><span class="r-soru" id="sr-rozet"></span></p><b id="sr-baslik"></b><p id="sr-soz"></p></div><span class="al-sayac" id="sr-sayac"></span></header>
      <ol class="al-adimlar" id="sr-adimlar" aria-label="Sorular"></ol>
      <div class="al-govde" id="sr-govde"></div></div>`;
    const $ = (s) => stage.querySelector(s), govde = $("#sr-govde");
    const noktalar = () => { $("#sr-adimlar").innerHTML = sorular.map((_, k) => `<li class="${durum[k].bitti ? (durum[k].dogru ? "ok" : "hata") : ""} ${k === n ? "on" : ""}"><button type="button" data-k="${k}" aria-label="${k + 1}. soru"></button></li>`).join(""); stage.querySelectorAll("#sr-adimlar button").forEach((b) => (b.onclick = () => git(+b.dataset.k))); };
    const git = (k) => { if (k < 0) return; if (k >= sorular.length) return bitir(); n = k; ciz(); };

    function ciz() {
      const q = sorular[n], d = durum[n], cok = q.dogru.length > 1;
      const [soruMetni, notu] = q.soru.split("\n");
      $("#sr-rozet").textContent = cok ? "Birden fazla doğru" : "Tek doğru";
      $("#sr-rozet").className = cok ? "r-coklu" : "r-soru";
      $("#sr-baslik").textContent = `Soru ${n + 1}`;
      $("#sr-soz").textContent = cok ? `Bu soruda ${q.dogru.length} doğru şık var; hepsini işaretle.` : "Tek bir doğru şık var.";
      $("#sr-sayac").textContent = `${n + 1} / ${sorular.length}`;
      noktalar();
      govde.innerHTML = `
        <p class="sr-soru">${md(soruMetni)}</p>
        ${notu ? `<p class="sr-not">${md(notu)}</p>` : ""}
        ${q.kod ? `<pre class="al-kod sr-kod"><code>${q.tur === "bosluk" ? esc(q.kod).replace("_____", '<span class="al-bos">_____</span>') : vurgu(q.kod)}</code></pre>` : ""}
        <div class="sr-siklar" role="${cok ? "group" : "radiogroup"}" aria-label="Şıklar">${q.secenekler.map((t, i) => {
          const sec = d.secili.has(i), dogruMu = q.dogru.includes(i);
          const sinif = d.bitti ? (dogruMu ? "dogru" : sec ? "yanlis" : "") : sec ? "secili" : "";
          return `<button type="button" class="sr-sik ${sinif}" data-i="${i}" role="${cok ? "checkbox" : "radio"}" aria-checked="${sec}" ${d.bitti ? "disabled" : ""}><span class="sr-harf">${HARF[i]}</span><span class="sr-metin ${q.kodSik ? "kod" : ""}">${q.kodSik ? esc(t) : md(t)}</span></button>`;
        }).join("")}</div>
        <p class="al-geri ${d.bitti ? (d.dogru ? "dogru" : "yanlis") : ""}" id="sr-geri" aria-live="polite">${d.bitti ? (d.dogru ? "Doğru." : "Yanlış. Doğru şık" + (cok ? "lar" : "") + ": " + q.dogru.map((i) => HARF[i]).join(", ") + ".") : ""}</p>
        ${d.bitti ? `<div class="al-bilgi"><span>Açıklama</span><p>${md(q.neden)}</p></div>` : ""}
        <div class="al-alt">
          <button type="button" class="btn sm" id="sr-onceki" ${n === 0 ? "disabled" : ""}>‹ Önceki</button>
          <span class="spacer"></span>
          ${d.bitti ? "" : `<button type="button" class="btn primary" id="sr-denetle" ${d.secili.size ? "" : "disabled"}>Denetle</button>`}
          <button type="button" class="btn sm ${d.bitti ? "primary" : ""}" id="sr-sonraki">${n === sorular.length - 1 ? "Bitir" : "Sonraki ›"}</button>
        </div>`;
      stage.querySelectorAll(".sr-sik").forEach((b) => (b.onclick = () => {
        const i = +b.dataset.i;
        if (cok) { if (d.secili.has(i)) d.secili.delete(i); else d.secili.add(i); } else { d.secili.clear(); d.secili.add(i); }
        ciz();
        const yeni = stage.querySelector(`.sr-sik[data-i="${i}"]`); if (yeni) yeni.focus({ preventScroll: true });
      }));
      $("#sr-onceki").onclick = () => git(n - 1);
      $("#sr-sonraki").onclick = () => git(n + 1);
      if ($("#sr-denetle")) $("#sr-denetle").onclick = () => {
        d.bitti = true;
        d.dogru = d.secili.size === q.dogru.length && q.dogru.every((i) => d.secili.has(i));
        if (KD.bkt) KD.bkt.observe(p.id, d.dogru, 0.2);
        ciz();
        $("#sr-sonraki").focus({ preventScroll: true });
      };
    }
    function bitir() {
      const cevaplanan = durum.filter((d) => d.bitti).length, dogru = durum.filter((d) => d.dogru).length;
      const tamam = cevaplanan === sorular.length;
      const ilk = !ph.quiz && tamam;
      if (tamam) { ph.quiz = { skor: Math.max(dogru, (ph.quiz || {}).skor || 0), n: sorular.length }; S.save(); }
      if (ilk) { S.addXP(15); if (A.renderBar) A.renderBar(); }
      n = sorular.length; noktalar();
      $("#sr-rozet").textContent = "Sonuç"; $("#sr-rozet").className = "r-ozet";
      $("#sr-baslik").textContent = tamam ? `${sorular.length} sorudan ${dogru} doğru` : "Henüz bitmedi";
      $("#sr-soz").textContent = !tamam ? `${sorular.length - cevaplanan} soru cevapsız. Dönüp cevaplayabilir ya da alıştırmaya geçebilirsin.`
        : dogru >= sorular.length - 1 ? "Konu oturmuş. Şimdi satırları elinle yazma zamanı."
        : dogru >= Math.ceil(sorular.length * 0.6) ? "İyi. Yanlış yaptıklarının açıklamasına bir göz at; sonra alıştırmaya geç."
        : "Bu ilk seferde normal. Yanlışlarının açıklamalarını oku; istersen KAM'in anlatımına bir kez daha dön.";
      $("#sr-sayac").textContent = ilk ? "+15 XP" : "";
      const yanlislar = durum.map((d, k) => (d.bitti && !d.dogru ? k : -1)).filter((k) => k >= 0), bos = durum.findIndex((d) => !d.bitti);
      govde.innerHTML = `${yanlislar.length ? `<div class="al-bilgi"><span>Yanlış yaptıkların</span><p>${yanlislar.map((k) => `<button type="button" class="sr-don" data-k="${k}">Soru ${k + 1}</button>`).join("")}</p></div>` : ""}
        <div class="al-alt">${bos >= 0 ? `<button class="btn" id="sr-bos">Cevaplamadıklarıma dön</button>` : `<a class="btn ghost" href="#${p.id}/incele">KAM'in anlatımına dön</a>`}<span class="spacer"></span><a class="btn primary" href="#${p.id}/alistir">Alıştırmaya geç</a></div>`;
      stage.querySelectorAll(".sr-don").forEach((b) => (b.onclick = () => git(+b.dataset.k)));
      if ($("#sr-bos")) $("#sr-bos").onclick = () => git(bos);
      if (tamam && bitince) bitince();
    }
    ciz();
  }

  const api = { uret, baslat, boz };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  kok.KD_SORULAR = api;
})(typeof window !== "undefined" ? window : globalThis);
