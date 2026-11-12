/* QUAGEN — Kodla: her derste yedi küçük görev, sırayla. Yalnızca KAM'in o derste anlattığı kodu kullanır.
 * Görevler anlatılan programlardan üretilir (her dilde aynı yöntem):
 *   degistir → çalışan program verilir; bir değeri değiştir
 *   eksik    → programdan bir (ya da iki) anlatılmış satır çıkarılır; o satırı yaz
 *   bastan   → küçük bir programı baştan yaz
 * Her görevde değerler değişir (Deniz yerine Ece, 21 yerine 22); tek bir beklenen çıktı vardır.
 * Denetim: çalıştırılabilen dillerde öğrencinin çıktısı, aynı anda çalıştırılan doğru programın çıktısıyla karşılaştırılır.
 * Çalıştırılamayan içerikte (HTML, React, SQL) eksik satırın kendisi karşılaştırılır. */
(function (kok) {
  const AL = () => kok.KD_ALISTIR || (typeof require === "function" ? require("./alistir.js") : null);
  const ADLAR = ["Ece", "Mert", "Zeynep", "Kaan", "Elif", "Bora", "Selin"];
  const YORUM = { py: (m) => "# " + m, c: (m) => "// " + m, js: (m) => "// " + m, html: (m) => "<!-- " + m + " -->", jsx: (m) => "// " + m, sql: (m) => "-- " + m, css: (m) => "/* " + m + " */" };
  const CALISIR = new Set(["c", "py", "js"]);
  const girinti = (s) => (s.match(/^\s*/) || [""])[0];

  /* Programdaki "veri" değerlerini değiştirir: yalnızca düz atama/tanımlama satırlarındaki sayı ve tek kelimelik metinler.
     Döngü sınırlarına, biçim metinlerine ve hesaplara dokunmaz; böylece program geçerli kalır. */
  function cesitle(kod, k) {
    if (!k) return kod;
    return kod.split("\n").map((satir, i) => {
      const m = satir.match(/^(\s*(?:(?:const|let|var|int|long|double|float|char|unsigned\s+\w+)\s+)?[A-Za-z_]\w*\s*=\s*)(-?\d+(?:\.\d+)?|"[A-Za-zÇĞİÖŞÜçğıöşü]{2,12}"|'[A-Za-zÇĞİÖŞÜçğıöşü]{2,12}'|'[A-Za-z]')(\s*;?\s*)$/);
      if (!m) return satir;
      let v = m[2];
      if (/^-?\d+$/.test(v)) v = String(+v + k + (i % 3));
      else if (/^-?\d+\.\d+$/.test(v)) v = (+v + k * 0.1 + (i % 3) * 0.01).toFixed(v.split(".")[1].length);
      else if (v.length === 3 && v[0] === "'") v = "'" + String.fromCharCode(65 + ((v.charCodeAt(1) - 65 + k * 3 + 26) % 26)) + "'";
      else v = v[0] + ADLAR[(k + i) % ADLAR.length] + v[0];
      return m[1] + v + m[3];
    }).join("\n");
  }

  /* İçinde yer tutucu olan metinler ({ad}, %d) değer olarak verilmez: cevabın kendisi olurdu. Onları beklenen çıktı gösterir. */
  const duzDeger = (x) => !/[{%]|\$\{/.test(x) || !/^[fFrb]?["'`]/.test(x);
  function uret(p, mufredat) {
    const al = AL(), O = al.ornek(p), dil = O.dil;
    const L = al.satirlar(p, 5, mufredat);
    if (!O.parcalar.length || !L.length) return [];
    const calisir = CALISIR.has(dil);
    const yorum = YORUM[dil] || YORUM.js;
    const gorevler = [];
    const program = (pi, k) => cesitle(O.parcalar[pi].code, k);
    /* Satırı (çeşitlenmiş hâliyle) programdan çıkarıp yerine işaret koyar */
    const eksilt = (pi, nolar, k) => {
      const satirlar = program(pi, k).split("\n"), dogru = nolar.map((no) => satirlar[no - 1].trim());
      nolar.forEach((no, j) => { satirlar[no - 1] = girinti(satirlar[no - 1]) + yorum(nolar.length > 1 ? `${j + 1}. eksik satırı buraya yaz` : "eksik satırı buraya yaz"); });
      return { baslangic: satirlar.join("\n"), dogru };
    };
    const eksik = (satirList, k, zor) => {
      const pi = satirList[0].parca, nolar = satirList.map((x) => x.no).sort((a, b) => a - b), e = eksilt(pi, nolar, k);
      gorevler.push({ tur: "eksik", dil, calisir, zor: !!zor, baslik: nolar.length > 1 ? "İki eksik satırı yaz" : "Eksik satırı yaz",
        istek: nolar.length > 1 ? "Programdan iki satır çıkarıldı. İşaretli yerlere sırasıyla şunları yapan satırları yaz:" : "Programdan bir satır çıkarıldı. İşaretli yere şunu yapan satırı yaz:",
        niyetler: e.dogru.map((s) => al.niyet(s)), degerler: [...new Set(e.dogru.flatMap((s) => al.malzeme(s)))].filter(duzDeger), parcalar: e.dogru.map((s) => al.karisikParcalar(s)),
        baslangic: e.baslangic, cozum: program(pi, k), eksikSatirlar: e.dogru, stdin: O.parcalar[pi].stdin || "" });
    };
    /* 1. Değiştir: çalışan program hazır; değerleri değiştir */
    const degisen = O.parcalar.map((x, i) => i).filter((i) => cesitle(O.parcalar[i].code, 1) !== O.parcalar[i].code);
    if (degisen.length) {
      const pi = degisen[degisen.length - 1], once = program(pi, 0).split("\n"), sonra = program(pi, 1).split("\n");
      const farklar = once.map((s, i) => (s !== sonra[i] ? { eski: s.trim(), yeni: sonra[i].trim() } : null)).filter(Boolean);
      gorevler.push({ tur: "degistir", dil, calisir, baslik: "Değerleri değiştir", istek: "Bu program çalışıyor. Yalnızca şu değerleri değiştir, gerisine dokunma:",
        niyetler: farklar.map((f) => `${f.eski}  →  ${f.yeni}`), degerler: [], parcalar: [], baslangic: program(pi, 0), cozum: program(pi, 1), eksikSatirlar: farklar.map((f) => f.yeni), stdin: O.parcalar[pi].stdin || "" });
    }
    /* 2–5. Anlatılan satırları tek tek geri yaz (her birinde değerler farklı) */
    L.forEach((x, i) => eksik([x], i + 2));
    /* 6. Aynı programda iki satır birden */
    const ciftli = L.find((x) => L.some((y) => y !== x && y.parca === x.parca));
    if (ciftli) eksik([ciftli, L.find((y) => y !== ciftli && y.parca === ciftli.parca)], 6, true);
    /* 7. En küçük programı baştan yaz */
    const kucuk = O.parcalar.map((x, i) => ({ i, n: x.code.split("\n").filter((s) => s.trim()).length })).filter((x) => x.n >= 1 && x.n <= 8).sort((a, b) => b.n - a.n)[0];
    if (kucuk) {
      const cozum = program(kucuk.i, 7), dolu = cozum.split("\n").filter((s) => s.trim());
      gorevler.push({ tur: "bastan", dil, calisir, zor: true, baslik: "Baştan yaz", istek: "Editör boş. Aşağıdaki işleri sırayla yapan programı baştan yaz:",
        niyetler: dolu.filter((s) => !/^[{}]$/.test(s.trim())).map((s) => al.niyet(s.trim())), degerler: [...new Set(dolu.flatMap((s) => al.malzeme(s.trim())))].filter(duzDeger), parcalar: [], baslangic: "", cozum, eksikSatirlar: dolu.map((s) => s.trim()), stdin: O.parcalar[kucuk.i].stdin || "" });
    }
    /* Yediye tamamla: aynı satırlar yeni değerlerle (kolaydan zora sıralı kalır) */
    for (let k = 8; gorevler.length < 7 && k < 20; k++) eksik([L[k % L.length]], k);
    const sira = { degistir: 0, eksik: 1, bastan: 3 };
    return gorevler.slice(0, 9).sort((a, b) => (sira[a.tur] + (a.zor ? 1 : 0)) - (sira[b.tur] + (b.zor ? 1 : 0))).slice(0, 7);
  }

  /* Çıktı karşılaştırması: satır sonu boşlukları ve sondaki boş satırlar önemsiz */
  const duz = (s) => String(s || "").replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").trim();
  /* Çalıştırılamayan içerikte: beklenen her satır öğrencinin kodunda (boşluk farkı hariç) geçmeli */
  function satirDenetle(kod, g) {
    const al = AL(), satirlar = kod.split("\n").map((s) => s.trim()).filter(Boolean);
    /* Aynı satır programda birden çok kez geçiyorsa (ör. aynı sorgu iki kez) hepsinin yazılmış olması gerekir */
    const say = (liste, d) => liste.filter((x) => al.ayni(x, d)).length, cozumSatir = g.cozum.split("\n").map((x) => x.trim()).filter(Boolean);
    const eksik = g.eksikSatirlar.find((d) => say(satirlar, d) < say(cozumSatir, d));
    return eksik ? { gecti: false, mesaj: "Beklenen satırlardan biri bulunamadı ya da farklı yazılmış." } : { gecti: true };
  }
  const sayi = (() => { const onbellek = new Map(); return (p) => { if (!onbellek.has(p.id)) onbellek.set(p.id, uret(p).length); return onbellek.get(p.id); }; })();

  /* ------------------------------------------------------------------ ekran */
  function baslat(p, stage, { no, bitince } = {}) {
    const KD = kok.KD, S = KD.store, esc = KD.esc, A = kok.KD_APP || {}, al = AL();
    const G = uret(p), ph = S.phase(p.id);
    ph.mini = ph.mini || {};
    if (!G.length) { stage.innerHTML = `<div class="panel"><p>Bu derste küçük görev yok. <a href="#${p.id}/kodla/ileri">İleri görevlere geç</a></p></div>`; return; }
    const acik = (k) => k === 0 || !!ph.mini[k - 1];
    let n = Number.isInteger(no) && no >= 0 && no < G.length && acik(no) ? no : Math.max(0, G.findIndex((_, k) => !ph.mini[k]));
    if (n < 0) n = 0;
    const MOD = { py: "python", c: "text/x-csrc", js: "javascript", html: "htmlmixed", jsx: "jsx", sql: "text/x-sql", css: "css" };
    const calistir = async (dil, kod, stdin) => {
      const r = dil === "c" ? await KD.runC(kod, { stdin }) : dil === "py" ? await KD.runPy(kod, { stdin }) : await KD.run(kod, { timeout: 8000, wait: 300 });
      return { cikti: (r.logs || []).filter((l) => l.level !== "warn" && l.level !== "error").map((l) => l.text).join("\n"), hata: r.error || ((r.logs || []).find((l) => l.level === "error") || {}).text || "" };
    };
    const beklenen = new Map();              // görev no → doğru programın çıktısı (bir kez çalıştırılır)
    const beklenenAl = (k) => { if (!beklenen.has(k)) beklenen.set(k, calistir(G[k].dil, G[k].cozum, G[k].stdin)); return beklenen.get(k); };
    let ed = null, deneme = 0, benim = 0;

    function ciz() {
      const g = G[n], benimNo = ++benim; deneme = 0;
      const kayit = (S.state.code = S.state.code || {}), anahtar = `${p.id}:mini:${n}`;
      const tamamSayisi = G.filter((_, k) => ph.mini[k]).length;
      stage.innerHTML = `
        <nav class="kg-sira" aria-label="Küçük görevler">${G.map((x, k) => `<button type="button" class="kg-no ${k === n ? "on" : ""} ${ph.mini[k] ? "ok" : ""}" data-k="${k}" ${acik(k) ? "" : 'disabled title="Önceki görevi bitirince açılır"'} aria-label="${k + 1}. görev${ph.mini[k] ? ", tamamlandı" : acik(k) ? "" : ", kilitli"}">${ph.mini[k] ? "✓" : k + 1}</button>`).join("")}
          <span class="kg-ozet">${tamamSayisi} / ${G.length} görev</span><a class="btn sm ghost kg-ileri" href="#${p.id}/kodla/ileri">İleri görevler</a></nav>
        <div class="kg">
          <section class="kg-sol">
            <p class="kg-tur">Görev ${n + 1} · ${esc(g.baslik)}</p>
            <p class="kg-istek">${esc(g.istek)}</p>
            <ol class="kg-niyet ${g.tur === "degistir" ? "degisim" : ""}">${g.niyetler.map((x) => `<li>${g.tur === "degistir" ? `<code>${esc(x)}</code>` : esc(x)}</li>`).join("")}</ol>
            ${g.degerler.length ? `<div class="al-malzeme"><i>Kullanacağın değerler</i>${g.degerler.map((x) => `<code>${esc(x)}</code>`).join("")}</div>` : ""}
            ${g.calisir ? `<div class="kg-beklenen"><span>Beklenen çıktı${g.stdin ? ` <small>klavyeden girilen: ${esc(g.stdin.trim().replace(/\n/g, ", "))}</small>` : ""}</span><pre id="kg-beklenen">hesaplanıyor…</pre></div>` : ""}
            <div class="kg-yardim" id="kg-yardim"></div>
            <div class="row"><button class="btn sm ghost" id="kg-ipucu">İpucu</button><button class="btn sm ghost" id="kg-coz" hidden>Çözümü göster</button></div>
          </section>
          <section class="kg-sag">
            <header class="kg-cubuk"><span class="file">${esc({ py: "main.py", c: "main.c", js: "main.js", html: "index.html", jsx: "App.jsx", sql: "sorgu.sql" }[g.dil] || "kod")}</span><span class="spacer"></span><button class="btn sm ghost" id="kg-sifirla">Sıfırla</button><button class="btn primary" id="kg-denetle">Denetle</button></header>
            <div class="kg-editor" id="kg-editor"></div>
            <div class="kg-sonuc" id="kg-sonuc" aria-live="polite"><p class="muted small">Yazınca “Denetle”ye bas. Tek bir beklenen çıktı var; kodun onu üretirse görev geçer.</p></div>
          </section>
        </div>`;
      const $ = (s) => stage.querySelector(s);
      let kod = kayit[anahtar] != null ? kayit[anahtar] : g.baslangic;
      const denetle = async () => {
        const b = $("#kg-denetle"); if (!b || b.disabled) return;
        b.disabled = true; $("#kg-sonuc").innerHTML = `<p class="muted small">${g.calisir ? "Çalıştırılıyor…" : "Denetleniyor…"}</p>`;
        let sonuc;
        try {
          if (g.calisir) {
            const [benimki, dogru] = await Promise.all([calistir(g.dil, kod, g.stdin), beklenenAl(n)]);
            sonuc = benimki.hata ? { gecti: false, hata: benimki.hata, cikti: benimki.cikti } : { gecti: duz(benimki.cikti) === duz(dogru.cikti), cikti: benimki.cikti, beklenen: dogru.cikti };
          } else sonuc = satirDenetle(kod, g);
        } catch (e) { sonuc = { gecti: false, hata: String(e && e.message || e) }; }
        if (benimNo !== benim || !stage.isConnected) return;
        b.disabled = false; deneme++;
        if (KD.bkt) KD.bkt.observe(p.id, sonuc.gecti, 0.5);
        if (sonuc.gecti) {
          const ilk = !ph.mini[n]; ph.mini[n] = true; S.save();
          if (ilk) { S.addXP(15); if (A.renderBar) A.renderBar(); }
          const son = n === G.length - 1;
          $("#kg-sonuc").innerHTML = `<div class="kg-gecti"><b>Doğru${ilk ? " · +15 XP" : ""}</b>${sonuc.cikti != null ? `<pre>${esc(duz(sonuc.cikti))}</pre>` : ""}<div class="row"><button class="btn primary" id="kg-sonraki">${son ? "Dersi bitir: kartlara geç" : "Sonraki görev ›"}</button></div></div>`;
          stage.querySelectorAll(".kg-no")[n].classList.add("ok"); stage.querySelectorAll(".kg-no")[n].textContent = "✓";
          if (stage.querySelectorAll(".kg-no")[n + 1]) stage.querySelectorAll(".kg-no")[n + 1].disabled = false;
          stage.querySelector(".kg-ozet").textContent = `${G.filter((_, k) => ph.mini[k]).length} / ${G.length} görev`;
          if (A.celebrate && ilk && son) A.celebrate($(".kg-sag"));
          $("#kg-sonraki").onclick = () => { if (son) location.hash = `#${p.id}/hatirla`; else { n++; history.replaceState(null, "", `#${p.id}/kodla/${n + 1}`); ciz(); } };
          $("#kg-sonraki").focus({ preventScroll: true });
          if (bitince) bitince(G.filter((_, k) => ph.mini[k]).length, G.length);
          return;
        }
        $("#kg-sonuc").innerHTML = sonuc.hata ? `<div class="kg-kaldi"><b>Program çalışmadı</b><pre class="t-hata">${esc(sonuc.hata.slice(0, 600))}</pre></div>`
          : sonuc.beklenen != null ? `<div class="kg-kaldi"><b>Çıktı beklenenle aynı değil</b><div class="kg-iki"><div><span>Seninki</span><pre>${esc(duz(sonuc.cikti) || "(çıktı yok)")}</pre></div><div><span>Beklenen</span><pre>${esc(duz(sonuc.beklenen))}</pre></div></div></div>`
          : `<div class="kg-kaldi"><b>Henüz olmadı</b><p>${esc(sonuc.mesaj || "")}</p></div>`;
        if (deneme >= 3) $("#kg-coz").hidden = false;
      };
      ed = A.makeEditor($("#kg-editor"), kod, (v) => { kod = v; kayit[anahtar] = v; S.save(); }, denetle, MOD[g.dil] || "javascript");
      $("#kg-denetle").onclick = denetle;
      $("#kg-sifirla").onclick = () => { kod = g.baslangic; delete kayit[anahtar]; S.save(); ed.set(kod); };
      let ipucuNo = 0;
      $("#kg-ipucu").onclick = () => {
        const y = $("#kg-yardim");
        if (ipucuNo === 0 && g.parcalar.length) y.innerHTML = g.parcalar.map((ps, i) => `<div class="al-malzeme"><i>${g.parcalar.length > 1 ? i + 1 + ". satırın parçaları (karışık)" : "Satırın parçaları (karışık)"}</i>${ps.map((x) => `<code>${esc(x)}</code>`).join("")}</div>`).join("");
        else if (ipucuNo <= 1) y.innerHTML += `<p class="muted small">Bu satırı Alıştır adımında yazmıştın. <a href="#${p.id}/alistir">Alıştır'a dön</a> ya da <a href="#${p.id}/incele">KAM'in anlatımına bak</a>.</p>`;
        ipucuNo++; if (ipucuNo >= 2) $("#kg-coz").hidden = false;
      };
      $("#kg-coz").onclick = () => { $("#kg-yardim").innerHTML = `<div class="al-bilgi"><span>Yazılması gereken${g.eksikSatirlar.length > 1 ? "ler" : ""}</span><pre class="kg-cozum">${esc(g.tur === "bastan" ? g.cozum : g.eksikSatirlar.join("\n"))}</pre><p class="muted small">Bakmak sorun değil. Kapatıp kendin yaz; kopyalamak yerine yazmak aklında tutar.</p></div>`; };
      stage.querySelectorAll(".kg-no").forEach((b) => (b.onclick = () => { n = +b.dataset.k; history.replaceState(null, "", `#${p.id}/kodla/${n + 1}`); ciz(); }));
      if (g.calisir) beklenenAl(n).then((r) => { const el = stage.querySelector("#kg-beklenen"); if (el && benimNo === benim) el.textContent = r.hata ? "(hesaplanamadı)" : duz(r.cikti) || "(çıktı yok)"; });
    }
    ciz();
  }

  const api = { uret, baslat, cesitle, satirDenetle, sayi, duz };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  kok.KD_KUCUK = api;
})(typeof window !== "undefined" ? window : globalThis);
