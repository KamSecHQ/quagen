/* QUAGEN — "Alıştır" adımı: KAM'in anlattığı satırları akılda tutmak için küçük, sade tekrarlar.
 * Görevlerden önce gelir. Her önemli satır üç kez, giderek daha az yardımla yazılır:
 *   1. Gör ve yaz      → satır ekranda; aynısını yaz (el alışsın)
 *   2. Eksiği tamamla  → satırın bir parçası boş; yalnızca onu yaz
 *   3. Bakmadan yaz    → satır gizli, yalnızca iskeleti görünür; hafızadan yaz
 * Üçüncü adım, araya başka bir satır girdikten sonra sorulur (gecikmeli hatırlama). Bakmak serbest;
 * bakılan satır oturumun sonunda bir kez daha sorulur. Satırlar dersin çözümlü örneğinden alınır: her dilde çalışır. */
(function (kok) {
  /* Boşluk farkını yok sayan karşılaştırma: metin (tırnak) içi korunur, dışarıda boşluklar önemsizdir */
  function sade(s) {
    const parca = String(s).trim().match(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|[^"'`]+|["'`]/g) || [];
    return parca.map((p) => (/^["'`]/.test(p) && p.length > 1 ? p : p.replace(/\s+/g, " ").replace(/ ?([^\w\s]) ?/g, "$1"))).join("").trim();
  }
  const ayni = (a, b) => sade(a) === sade(b);
  /* İlk ayrıldıkları yer (öğrenciye "nerede yanlış" demek için) */
  function fark(yazilan, dogru) {
    const a = sade(yazilan), b = sade(dogru);
    let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
    return { konum: i, beklenen: b.slice(i, i + 12), eksik: a.length < b.length && i === a.length, fazla: a.length > b.length && i === b.length };
  }
  /* İskelet: harf ve rakamlar nokta olur, noktalama ve boşluklar kalır */
  const iskelet = (s) => s.replace(/[A-Za-z0-9ÇĞİÖŞÜçğıöşü_]/g, "·");

  /* Satırda boş bırakılacak parça: en uzun ad ya da anahtar sözcük; yoksa bir işleç */
  function boslukSec(satir, sira) {
    const adlar = [...satir.matchAll(/[A-Za-z_ÇĞİÖŞÜçğıöşü][A-Za-z0-9_ÇĞİÖŞÜçğıöşü]*/g)].filter((m) => m[0].length >= 2);
    const islecler = [...satir.matchAll(/%\.?\d*[a-z]|==|<=|>=|!=|&&|\|\||=>|[=+\-*\/<>;:]/g)];
    const aday = adlar.sort((x, y) => y[0].length - x[0].length || x.index - y.index);
    const m = aday.length ? aday[sira % Math.min(aday.length, 2)] : islecler[0];
    if (!m) return null;
    return { on: satir.slice(0, m.index), bos: m[0], son: satir.slice(m.index + m[0].length) };
  }

  /* Bir satırdaki öğretici parçalar: adlar, anahtar sözcükler, biçim belirteçleri (%d), işleçler */
  const parcalar = (t) => new Set(String(t).replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, (m) => (m.match(/%\.?\d*[a-z]|\$\{|\\n/g) || []).join(" ")).match(/[A-Za-z_][A-Za-z0-9_]*|%\.?\d*[a-z]|\$\{|\\n|==|!=|<=|>=|&&|\|\||=>|\+=|-=|\+\+|--|->|[=+\-*\/%<>&\[\]{}.:#]/g) || []);
  const dilOf = (p) => p.language || "js";

  /* Dersin örneğinden en öğretici satırları seç.
   * Bir satır şu ölçüde değerlidir: (1) içindeki yapılar bu dersin görevlerinin çözümünde kullanılıyorsa,
   * (2) o yapı bu dilde ilk kez bu derste görülüyorsa, (3) KAM o satırı ayrıca açıklamışsa.
   * Her derste yinelenen iskelet satırları (return 0; kapanış parantezi, #include) ilk dersten sonra elenir;
   * aynı kalıbın yinelemeleri (art arda üç printf) yerine farklı kalıplar tercih edilir. */
  function satirlar(p, enCok = 5, mufredat) {
    const ex = p.example; if (!ex || !ex.code) return [];
    const kod = ex.code.split("\n");
    const tum = mufredat || kok.KD_CURRICULUM || [];
    const onceki = new Set();
    for (const q of tum) if (dilOf(q) === dilOf(p) && (q.track || "") === (p.track || "") && q.no < p.no && q.example) parcalar(q.example.code).forEach((x) => onceki.add(x));
    const cozum = new Set(); (p.challenges || []).forEach((c) => parcalar((c.solution || "") + "\n" + (c.starter || "")).forEach((x) => cozum.add(x)));
    const kavram = (p.concepts || []).join(" ") + " " + (p.title || "");
    const aciklama = new Map(); (ex.steps || []).forEach((s) => (s.lines || []).forEach((no) => { if (!aciklama.has(no)) aciklama.set(no, s.text); }));
    const iskeletSatir = /^(return 0;?|int main\s*\(.*\)\s*\{|#include\b.*|\}|\{|main\(\)|if __name__.*|<\/?(html|body|head|div)>|\);?)$/;
    const adaylar = [];
    kod.forEach((ham, k) => {
      const t = ham.trim(), no = k + 1;
      if (t.length < 5 || t.length > 96 || !/[A-Za-zÇĞİÖŞÜçğıöşü]{2}/.test(t) || /^(\/\/|#(?!include)|\/\*|\*|<!--|--)/.test(t)) return;
      const P = parcalar(t); let puan = aciklama.has(no) ? 2 : 0;
      for (const x of P) {
        const gorevde = cozum.has(x), yeni = !onceki.has(x), ad = /^[A-Za-z_]/.test(x);
        if (gorevde) puan += ad ? 2 : 1;
        if (yeni && (gorevde || !ad || kavram.includes(x))) puan += 3;
      }
      const iskeletMi = t.length > 64 || (iskeletSatir.test(t) && (p.no > 1 || !/#include|main/.test(t)));
      if (iskeletMi) puan -= 8;
      if (t.length > 48) puan -= 1;
      adaylar.push({ satir: t, no, puan, iskeletMi, aciklama: aciklama.get(no) || "", ilk: (t.match(/[A-Za-z_#<][A-Za-z0-9_]*/) || [""])[0], P });
    });
    const secilen = [], gorulen = new Set(), kapsanan = new Set();
    let gevsek = false;                       // yeterli satır çıkmazsa iskelet satırlarına da izin verilir
    while (secilen.length < enCok) {
      let en = null, enPuan = -Infinity;
      for (const a of adaylar) {
        if (gorulen.has(sade(a.satir)) || (a.iskeletMi && !gevsek)) continue;
        let yeniParca = 0; for (const x of a.P) if (!kapsanan.has(x)) yeniParca++;
        const pn = a.puan - 3 * secilen.filter((s) => s.ilk === a.ilk).length + Math.min(3, yeniParca) - (yeniParca === 0 ? 4 : 0);
        if (pn > enPuan) { en = a; enPuan = pn; }
      }
      if (!en || (secilen.length >= 3 && enPuan < 1)) { if (secilen.length < 3 && !gevsek) { gevsek = true; continue; } break; }
      gorulen.add(sade(en.satir)); en.P.forEach((x) => kapsanan.add(x));
      secilen.push({ satir: en.satir, aciklama: en.aciklama, no: en.no, puan: en.puan });
    }
    return secilen.sort((a, b) => a.no - b.no);
  }

  /* Alıştırma sırası: kopya ve boşluk hemen, hafıza bir satır gecikmeli */
  function uret(p, mufredat) {
    const L = satirlar(p, 5, mufredat), sira = [];
    L.forEach((x, i) => {
      sira.push({ tur: "kopya", i, satir: x.satir, aciklama: x.aciklama });
      const b = boslukSec(x.satir, i); if (b) sira.push(Object.assign({ tur: "bosluk", i, satir: x.satir, aciklama: x.aciklama }, b));
      if (i > 0) sira.push({ tur: "hafiza", i: i - 1, satir: L[i - 1].satir, aciklama: L[i - 1].aciklama });
    });
    if (L.length) sira.push({ tur: "hafiza", i: L.length - 1, satir: L[L.length - 1].satir, aciklama: L[L.length - 1].aciklama });
    return { satirlar: L, sira };
  }

  /* ------------------------------------------------------------------ ekran */
  function baslat(p, stage, { bitince } = {}) {
    const KD = kok.KD, S = KD.store, esc = KD.esc, A = kok.KD_APP || {};
    const dil = (p.example && p.example.lang) || KD.lang;
    const vurgu = (s) => (KD.hlDoc ? KD.hlDoc(s, A.hlLang ? A.hlLang(dil) : dil).join("\n") : esc(s));
    const ph = S.phase(p.id);
    /* Daha önce yapıldıysa ve aradan en az bir gün geçtiyse: yalnızca "bakmadan yaz" turu (kısa tekrar) */
    const tekrarTuru = !!ph.drill && !!ph.drillGun && ph.drillGun < S.day();
    const tam = uret(p), L = tam.satirlar;
    const sira = tekrarTuru ? tam.sira.filter((a) => a.tur === "hafiza") : tam.sira;
    const YUZ = '<span class="kam-av" aria-hidden="true"><b></b><b></b></span>';
    if (!sira.length) { ph.drill = true; S.save(); stage.innerHTML = `<div class="panel"><p>Bu derste alıştırma yok. <a href="#${p.id}/kodla">Görevlere geç</a></p></div>`; return; }
    let n = 0, bakildi = false, yanlis = 0, toplamBakma = 0, eklenen = 0;
    const BASLIK = { kopya: "Gör ve yaz", bosluk: "Eksiği tamamla", hafiza: "Bakmadan yaz" };
    const KAM = {
      kopya: ["Önce elin alışsın. Aşağıdaki satırın aynısını yaz.", "Yeni bir satır. Bak ve aynısını yaz.", "Bunu da bir kez yaz; acele yok."],
      bosluk: ["Aynı satır, bir parçası eksik. Yalnızca eksik parçayı yaz.", "Boş kalan yere ne gelmeli?"],
      hafiza: ["Şimdi bakmadan. İskeleti görüyorsun; satırın tamamını hafızandan yaz.", "Az önce yazdığın satır. Bu kez sen hatırla.", "Bakmak serbest, ama önce bir dene."]
    };
    stage.innerHTML = `<div class="al">
      <header class="al-ust">${YUZ}<div class="al-kam"><b id="al-baslik"></b><p id="al-soz"></p></div><span class="al-sayac" id="al-sayac"></span></header>
      <div class="al-cubuk"><i id="al-cubuk"></i></div>
      <div class="al-govde" id="al-govde"></div>
    </div>`;
    const govde = stage.querySelector("#al-govde");
    const $ = (s) => stage.querySelector(s);

    function ciz() {
      if (n >= sira.length) return bitir();
      const a = sira[n]; bakildi = false; yanlis = 0;
      $("#al-baslik").textContent = BASLIK[a.tur];
      $("#al-soz").textContent = KAM[a.tur][n % KAM[a.tur].length];
      $("#al-sayac").textContent = `${n + 1} / ${sira.length}`;
      $("#al-cubuk").style.width = (n / sira.length) * 100 + "%";
      const gosterim = a.tur === "kopya" ? `<pre class="al-kod"><code>${vurgu(a.satir)}</code></pre>`
        : a.tur === "bosluk" ? `<pre class="al-kod"><code>${esc(a.on)}<span class="al-bos">${"_".repeat(Math.max(3, a.bos.length))}</span>${esc(a.son)}</code></pre>`
        : `<pre class="al-kod iskelet" id="al-iskelet"><code>${esc(iskelet(a.satir))}</code></pre>`;
      govde.innerHTML = `
        ${a.aciklama ? `<p class="al-aciklama">${esc(a.aciklama)}</p>` : ""}
        ${gosterim}
        <form class="al-form" id="al-form" autocomplete="off">
          <input id="al-girdi" class="al-girdi" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="${a.tur === "bosluk" ? "Eksik parça" : "Satırı yaz"}" placeholder="${a.tur === "bosluk" ? "eksik parça" : "buraya yaz"}" />
          <button class="btn primary">Denetle</button>
        </form>
        <p class="al-geri" id="al-geri" aria-live="polite"></p>
        <div class="al-alt">${a.tur === "hafiza" ? `<button type="button" class="btn sm ghost" id="al-bak">Hatırlamıyorum, göster</button>` : ""}<span class="spacer"></span><a class="btn sm ghost" href="#${p.id}/kodla">Alıştırmayı atla</a></div>`;
      const girdi = $("#al-girdi"), geri = $("#al-geri");
      girdi.focus({ preventScroll: true });
      /* Yapıştırma kapalı: amaç yazmak */
      girdi.addEventListener("paste", (e) => { e.preventDefault(); geri.className = "al-geri uyari"; geri.textContent = "Yapıştırmak yerine yaz; el alışkanlığı böyle oluşur."; });
      if ($("#al-bak")) $("#al-bak").onclick = () => {
        bakildi = true; toplamBakma++;
        const el = $("#al-iskelet"); el.classList.remove("iskelet"); el.innerHTML = `<code>${vurgu(a.satir)}</code>`;
        $("#al-soz").textContent = "Olur. Bak, sonra yaz. Bu satırı sonda bir kez daha soracağım.";
        girdi.focus({ preventScroll: true });
      };
      $("#al-form").onsubmit = (e) => {
        e.preventDefault();
        const hedef = a.tur === "bosluk" ? a.bos : a.satir, yazilan = girdi.value;
        if (!yazilan.trim()) return;
        if (ayni(yazilan, hedef)) {
          geri.className = "al-geri dogru"; geri.textContent = a.tur === "hafiza" && !bakildi && !yanlis ? "Doğru, hem de bakmadan." : "Doğru.";
          girdi.disabled = true; stage.querySelector(".al").classList.add("tamam");
          /* Bakılan ya da iki kez yanlış yazılan satır sona bir kez daha eklenir */
          if (a.tur === "hafiza" && (bakildi || yanlis >= 2) && !a.tekrar && eklenen < L.length) { sira.push(Object.assign({}, a, { tekrar: true })); eklenen++; }
          if (KD.bkt && a.tur === "hafiza") KD.bkt.observe(p.id, !bakildi && !yanlis, 0.25);
          setTimeout(() => { stage.querySelector(".al") && stage.querySelector(".al").classList.remove("tamam"); n++; ciz(); }, 650);
          return;
        }
        yanlis++;
        const f = fark(yazilan, hedef);
        geri.className = "al-geri yanlis";
        geri.innerHTML = f.eksik ? `Buraya kadar doğru, devamı eksik. Sıradaki: <code>${esc(f.beklenen.slice(0, 4))}</code>`
          : f.fazla ? "Sonunda fazladan bir şey var."
          : `${f.konum + 1}. karakterde ayrılıyor. Orada <code>${esc(f.beklenen.slice(0, 4) || "(son)")}</code> olmalı.`;
        girdi.classList.remove("salla"); void girdi.offsetWidth; girdi.classList.add("salla");
        girdi.setSelectionRange(girdi.value.length, girdi.value.length);
        if (a.tur === "hafiza" && yanlis >= 2 && $("#al-bak")) $("#al-bak").classList.add("vurgulu");
      };
    }
    function bitir() {
      const ilk = !ph.drill;
      if (tekrarTuru) ph.drill2 = true;
      ph.drill = true; ph.drillGun = ph.drillGun || S.day(); S.save();
      if (ilk) { S.addXP(20); if (A.renderBar) A.renderBar(); }
      $("#al-cubuk").style.width = "100%";
      $("#al-baslik").textContent = tekrarTuru ? "Tekrar bitti" : "Alıştırma bitti";
      $("#al-soz").textContent = toplamBakma ? `${L.length} satırın ${Math.max(0, L.length - toplamBakma)} tanesini bakmadan yazdın. Bakmak ayıp değil; yarın bir kez daha dene, o zaman hepsi gelir.` : `${L.length} satırın hepsini bakmadan yazdın. Bunlar artık senin.`;
      $("#al-sayac").textContent = ilk ? "+20 XP" : "";
      govde.innerHTML = `<p class="al-aciklama">Bu derste aklında kalması gereken satırlar:</p>
        <pre class="al-kod ozet"><code>${vurgu(L.map((x) => x.satir).join("\n"))}</code></pre>
        <div class="al-alt"><button class="btn ghost" id="al-yeniden">Bir tur daha</button><span class="spacer"></span><a class="btn primary" href="#${p.id}/kodla">Görevlere geç</a></div>`;
      $("#al-yeniden").onclick = () => baslat(p, stage, { bitince });
      if (bitince) bitince();
    }
    ciz();
  }

  const api = { sade, ayni, fark, iskelet, boslukSec, satirlar, uret, baslat };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  kok.KD_ALISTIR = api;
})(typeof window !== "undefined" ? window : globalThis);
