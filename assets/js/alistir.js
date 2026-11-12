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

  /* Dilin kendi sözcükleri: bunlar ezberlenir. Geri kalan adlar ve değerler öğrenciye verilir. */
  const TUR = { int: "tam sayı", double: "ondalıklı sayı", float: "ondalıklı sayı", char: "tek karakter", long: "büyük tam sayı", bool: "doğru/yanlış", void: "değer döndürmeyen", const: "değişmeyen ad", let: "değişebilen ad", var: "değişken" };
  const SOZ = {
    tur: ["int", "double", "float", "char", "long", "bool", "void", "unsigned", "size_t", "const", "let", "var", "struct", "typedef"],
    akis: ["if", "else", "elif", "for", "while", "do", "switch", "case", "break", "continue", "return", "in", "def", "function", "class", "import", "from", "try", "except", "catch", "finally", "throw", "new", "async", "await", "lambda", "with", "as", "not", "and", "or", "typeof", "sizeof", "include", "SELECT", "FROM", "WHERE", "JOIN", "ON", "ORDER", "BY", "GROUP", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "AS", "AND", "OR", "DESC", "ASC", "LIMIT", "HAVING", "COUNT", "SUM", "AVG"],
    komut: ["printf", "scanf", "print", "input", "console", "log", "len", "range", "malloc", "free", "strlen", "strcpy", "strcmp", "fopen", "fclose", "fgets", "fprintf", "push", "pop", "map", "filter", "reduce", "forEach", "append", "join", "split", "int", "float", "str", "main", "document", "querySelector", "addEventListener", "useState", "fetch", "then", "require", "module", "exports", "JSON", "parse", "stringify", "Math", "floor", "round", "sorted", "sum", "min", "max", "open", "read", "write", "type", "format"],
    deger: ["true", "false", "True", "False", "None", "null", "undefined", "NULL", "stdio", "stdlib", "string", "stdbool", "h"]
  };
  const SOZLUK = new Map(); for (const [k, l] of Object.entries(SOZ)) for (const x of l) if (!SOZLUK.has(x)) SOZLUK.set(x, k);
  const KATEGORI = { tur: "tür ya da tanımlama sözcüğü", akis: "anahtar sözcük", komut: "komutun adı", deger: "hazır bir değer", bicim: "biçim belirteci", islec: "işleç" };
  const METIN = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g;

  /* Satırda boş bırakılacak parça: öğrencinin bilebileceği bir şey, yani dilin kendi sözcüğü.
     Değişken adı ya da rastgele bir değer asla boş bırakılmaz. */
  function boslukSec(satir, sira) {
    const maske = satir.replace(METIN, (m) => " ".repeat(m.length));          // metinlerin içi aday değil
    const adaylar = [];
    for (const m of maske.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) if (SOZLUK.has(m[0]) && SOZLUK.get(m[0]) !== "deger") adaylar.push({ i: m.index, bos: m[0], kat: SOZLUK.get(m[0]), oncelik: SOZLUK.get(m[0]) === "komut" ? 3 : SOZLUK.get(m[0]) === "akis" ? 2 : 1 });
    for (const m of satir.matchAll(/%\.?\d*l?[dfcsu]/g)) adaylar.push({ i: m.index, bos: m[0], kat: "bicim", oncelik: 2 });
    for (const m of maske.matchAll(/==|!=|<=|>=|&&|\|\||=>|\+=|-=|\*=|\+\+|--|->/g)) adaylar.push({ i: m.index, bos: m[0], kat: "islec", oncelik: 1 });
    if (!adaylar.length) {                                                     // HTML: etiket adı
      const e = satir.match(/^<([a-z][a-z0-9]*)/);
      if (!e) return null;
      return { on: "<", bos: e[1], son: satir.slice(1 + e[1].length), kategori: "etiket adı" };
    }
    adaylar.sort((x, y) => y.oncelik - x.oncelik || x.i - y.i);
    const a = adaylar[sira % Math.min(adaylar.length, 2)];
    return { on: satir.slice(0, a.i), bos: a.bos, son: satir.slice(a.i + a.bos.length), kategori: KATEGORI[a.kat] };
  }

  /* Öğrenciye verilecek malzeme: satırdaki adlar, sayılar ve metinler (dilin sözcükleri hariç) */
  function malzeme(satir) {
    const liste = [], gorulen = new Set();
    const etiket = new Set([...satir.matchAll(/<\/?([A-Za-z][A-Za-z0-9]*)/g)].map((m) => m[1]));   // HTML etiket adları dilin sözcüğüdür
    const ekle = (x) => { if (x && !gorulen.has(x) && !etiket.has(x)) { gorulen.add(x); liste.push(x); } };
    for (const m of satir.matchAll(new RegExp("[fFrb]?(?:" + METIN.source + ")|[A-Za-z_ÇĞİÖŞÜçğıöşü][A-Za-z0-9_ÇĞİÖŞÜçğıöşü]*|\\d+(?:\\.\\d+)?", "g"))) {
      const x = m[0];
      if (/^[fFrb]?["'`]/.test(x)) ekle(x); else if (/^\d/.test(x)) ekle(x); else if (!SOZLUK.has(x)) ekle(x);
    }
    return liste;
  }
  const kod = (x) => "`" + x + "`";

  /* Satırın ne yaptığını, o satıra özel bir görev cümlesi olarak söyler. Adlar ve değerler cümlede geçer;
     öğrenciden beklenen, bunları doğru sözdizimiyle yazmaktır. */
  /* "anahtar (koşul) gerisi" biçimindeki satırda dengeli parantezin içini ve gerisini ayırır */
  function parantez(t, bas) {
    let d = 0;
    for (let i = bas; i < t.length; i++) { if (t[i] === "(") d++; else if (t[i] === ")" && --d === 0) return [t.slice(bas + 1, i).trim(), t.slice(i + 1).replace(/^\s*\{?\s*/, "").trim()]; }
    return null;
  }
  function gorevCumlesi(satir, aciklama) {
    const t = satir.trim(); let m, pr;
    if ((m = t.match(/^#include\s*<(.+)>$/))) return `${kod(m[1])} başlık dosyasını programa ekleyen satırı yaz.`;
    if ((m = t.match(/^(unsigned\s+\w+|long long|int|double|float|char|long|bool|size_t)\s+(\w+)\s*=\s*(.+);$/))) return `${kod(m[2])} adında bir ${TUR[m[1]] || m[1]} (${kod(m[1])}) değişkeni tanımla; değeri ${kod(m[3])} olsun.`;
    if ((m = t.match(/^(unsigned\s+\w+|long long|int|double|float|char|long|bool)\s+([\w\s,]+);$/))) return `${kod(m[2])} için ${TUR[m[1]] || m[1]} (${kod(m[1])}) türünde değişken tanımla; değer verme.`;
    if ((m = t.match(/^(const|let|var)\s+(\w+)\s*=\s*(.+?);?$/))) return `${kod(m[2])} adını tanımla (${m[1] === "const" ? "sonradan değişmeyecek" : "sonradan değişebilecek"}); değeri ${kod(m[3])} olsun.`;
    if ((m = t.match(/^printf\(\s*("(?:[^"\\]|\\.)*")\s*(?:,\s*(.+))?\);$/))) return `Ekrana ${kod(m[1])} biçimini yazdır${m[2] ? "; yerine konacak değer: " + kod(m[2]) : ""}.`;
    if ((m = t.match(/^scanf\(\s*("(?:[^"\\]|\\.)*")\s*,\s*(.+)\);$/))) return `Klavyeden ${kod(m[1])} biçiminde oku ve ${kod(m[2].replace(/&/g, ""))} içine koy.`;
    if ((m = t.match(/^(print|console\.log)\((.+)\);?$/))) return `Ekrana şunu yazdır: ${kod(m[2])}`;
    if ((m = t.match(/^for\s*\((.*?);(.*?);(.*?)\)\s*\{?$/))) return `${kod("for")} döngüsünün ilk satırını yaz. Başlangıç: ${kod(m[1].trim())}, koşul: ${kod(m[2].trim())}, her turda: ${kod(m[3].trim())}.`;
    if ((m = t.match(/^for\s+(\w+)\s+in\s+(.+):$/))) return `${kod(m[2])} içindeki her değeri sırayla ${kod(m[1])} adına koyan döngünün ilk satırını yaz.`;
    if ((m = t.match(/^while\s+(.+):$/))) return `${kod(m[1])} doğru olduğu sürece dönen ${kod("while")} satırını yaz.`;
    if (/^while\s*\(/.test(t) && (pr = parantez(t, t.indexOf("(")))) return `${kod(pr[0])} doğru olduğu sürece dönen ${kod("while")} satırını yaz${pr[1] ? "; her turda şunu yapsın: " + kod(pr[1]) : ""}.`;
    if ((m = t.match(/^(elif|if)\s+(.+):$/))) return `${m[1] === "if" ? "Koşul satırını yaz" : "Önceki koşul tutmadıysa denenecek ikinci koşulu yaz"}: ${kod(m[2])} doğruysa çalışacak.`;
    if ((m = t.match(/^(else if|if)\s*\(/)) && (pr = parantez(t, t.indexOf("(")))) return `${m[1] === "if" ? "Koşul satırını yaz" : "Önceki koşul tutmadıysa denenecek ikinci koşulu yaz"}: ${kod(pr[0])} doğruysa ${pr[1] ? "şunu yapsın: " + kod(pr[1]) : "çalışacak"}.`;
    if ((m = t.match(/^<([a-z][a-z0-9]*)((?:\s+[^>]*)?)>(.*)<\/\1>$/))) return `${kod("<" + m[1] + ">")} öğesi yaz${m[2].trim() ? "; özellikleri: " + kod(m[2].trim()) : ""}; içeriği ${kod(m[3])} olsun.`;
    if ((m = t.match(/^return\s+(.+?);?$/))) return `${kod(m[1])} değerini geri döndüren satırı yaz.`;
    if ((m = t.match(/^def\s+(\w+)\((.*)\):$/))) return `${kod(m[1])} adlı fonksiyonu tanımlamaya başla${m[2] ? "; parametreleri: " + kod(m[2]) : "; parametresi yok"}.`;
    if ((m = t.match(/^function\s+(\w+)\((.*)\)\s*\{$/))) return `${kod(m[1])} adlı fonksiyonu tanımlamaya başla${m[2] ? "; parametreleri: " + kod(m[2]) : "; parametresi yok"}.`;
    if ((m = t.match(/^([\w\s\*]+?)\s+\**(\w+)\((.*)\)\s*\{$/)) && !/^(if|for|while|else|switch|return)\b/.test(t)) return `${kod(m[2])} adlı fonksiyonun ilk satırını yaz. Döndürdüğü tür: ${kod(m[1].trim())}; parametreleri: ${kod(m[3] || "yok")}.`;
    if ((m = t.match(/^(\w+)\s*(\+=|-=|\*=|\/=)\s*(.+?);?$/))) return `${kod(m[1])} değişkenini ${kod(m[3])} ile ${{ "+=": "topla", "-=": "azalt", "*=": "çarp", "/=": "böl" }[m[2]]} ve sonucu yine ${kod(m[1])} içine koy (kısa yazımla).`;
    if ((m = t.match(/^(\w+)(\+\+|--);?$/))) return `${kod(m[1])} değişkenini bir ${m[2] === "++" ? "artır" : "azalt"} (kısa yazımla).`;
    if ((m = t.match(/^(\w+)\s*=\s*(.+?);?$/))) return `${kod(m[1])} değişkenine ${kod(m[2])} değerini koy.`;
    return aciklama ? "Şunu yapan satırı yeniden yaz: " + aciklama : "";
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
    const iskeletSatir = /^(return 0;?|int main\s*\(.*\)\s*\{|#include\b.*|\}|\{|main\(\)|if __name__.*|<\/?(html|body|head|div)>|<\/[A-Za-z][A-Za-z0-9]*>|\);?)$/;
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

  /* Alıştırma sırası: kopya ve boşluk hemen, hafıza bir satır gecikmeli.
     Her alıştırma kendi bilgisini taşır: kopyada KAM'in açıklaması, boşlukta eksik parçanın ne olduğu,
     hafızada o satıra özel görev cümlesi ve kullanılacak adlar, değerler. */
  function uret(p, mufredat) {
    const L = satirlar(p, 5, mufredat), sira = [];
    const hafiza = (i) => ({ tur: "hafiza", i, satir: L[i].satir, gorev: gorevCumlesi(L[i].satir, L[i].aciklama), malzeme: malzeme(L[i].satir) });
    L.forEach((x, i) => {
      sira.push({ tur: "kopya", i, satir: x.satir, aciklama: x.aciklama });
      const b = boslukSec(x.satir, i); if (b) sira.push(Object.assign({ tur: "bosluk", i, satir: x.satir }, b));
      if (i > 0) sira.push(hafiza(i - 1));
    });
    if (L.length) sira.push(hafiza(L.length - 1));
    return { satirlar: L, sira };
  }

  /* ------------------------------------------------------------------ ekran */
  function baslat(p, stage, { bitince } = {}) {
    const KD = kok.KD, S = KD.store, esc = KD.esc, md = KD.md || esc, A = kok.KD_APP || {};
    const dil = (p.example && p.example.lang) || KD.lang;
    const vurgu = (s) => (KD.hlDoc ? KD.hlDoc(s, A.hlLang ? A.hlLang(dil) : dil).join("\n") : esc(s));
    const ph = S.phase(p.id);
    /* Daha önce yapıldıysa ve aradan en az bir gün geçtiyse: yalnızca "bakmadan yaz" turu (kısa tekrar) */
    const tekrarTuru = !!ph.drill && !!ph.drillGun && ph.drillGun < S.day();
    const tam = uret(p), L = tam.satirlar;
    const sira = tekrarTuru ? tam.sira.filter((a) => a.tur === "hafiza") : tam.sira;
    const YUZ = '<span class="kam-av" aria-hidden="true"><b></b><b></b></span>';
    if (!sira.length) { ph.drill = true; S.save(); stage.innerHTML = `<div class="panel"><p>Bu derste alıştırma yok. <a href="#${p.id}/kodla">Görevlere geç</a></p></div>`; return; }
    const durum = sira.map(() => ({ dogru: false, bakildi: false, yanlis: 0, yazilan: "" }));
    let n = 0, eklenen = 0;
    const AD = { kopya: "Gör ve yaz", bosluk: "Eksiği tamamla", hafiza: "Bakmadan yaz" };
    const SOZ1 = { kopya: "Satır ekranda. Aynısını yaz; amaç elinin alışması.", bosluk: "Satırın bir parçası boş. Yalnızca o parçayı yaz.", hafiza: "Satır gizli. Ne yazacağın aşağıda yazıyor; nasıl yazıldığını sen hatırla." };
    stage.innerHTML = `<div class="al">
      <header class="al-ust">${YUZ}<div class="al-kam"><p class="al-tur"><span id="al-rozet"></span><span id="al-satirno"></span></p><b id="al-baslik"></b><p id="al-soz"></p></div><span class="al-sayac" id="al-sayac"></span></header>
      <ol class="al-adimlar" id="al-adimlar" aria-label="Alıştırmalar"></ol>
      <div class="al-govde" id="al-govde"></div>
    </div>`;
    const govde = stage.querySelector("#al-govde");
    const $ = (s) => stage.querySelector(s);
    const noktalar = () => { $("#al-adimlar").innerHTML = sira.map((a, k) => `<li class="${a.tur} ${durum[k] && durum[k].dogru ? "ok" : ""} ${k === n ? "on" : ""}"><button type="button" data-k="${k}" aria-label="${k + 1}. alıştırma: ${AD[a.tur]}"${k === n ? ' aria-current="step"' : ""}></button></li>`).join(""); stage.querySelectorAll("#al-adimlar button").forEach((b) => (b.onclick = () => git(+b.dataset.k))); };
    const git = (k) => { if (k < 0) return; if (k >= sira.length) return bitir(); n = k; ciz(); };

    function ciz() {
      const a = sira[n], d = (durum[n] = durum[n] || { dogru: false, bakildi: false, yanlis: 0, yazilan: "" });
      $("#al-rozet").textContent = AD[a.tur]; $("#al-rozet").className = "r-" + a.tur;
      $("#al-satirno").textContent = `Satır ${a.i + 1} / ${L.length}${a.tekrar ? " · tekrar" : ""}`;
      $("#al-baslik").textContent = a.tur === "kopya" ? "Bu satırı yaz" : a.tur === "bosluk" ? "Boşluğa ne gelir?" : "Bu satırı hafızandan yaz";
      $("#al-soz").textContent = SOZ1[a.tur];
      $("#al-sayac").textContent = `${n + 1} / ${sira.length}`;
      noktalar();
      const bilgi = a.tur === "kopya" ? (a.aciklama ? `<div class="al-bilgi"><span>Bu satır ne yapıyor?</span><p>${esc(a.aciklama)}</p></div>` : "")
        : a.tur === "bosluk" ? `<div class="al-bilgi"><span>Eksik olan</span><p>Bir ${esc(a.kategori)}. Değişken adı ya da sayı değil; dilin kendi sözcüğü.</p></div>`
        : `<div class="al-bilgi gorev"><span>Senden istenen</span><p>${a.gorev ? md(a.gorev) : "Aşağıdaki parçaları kullanarak satırı yeniden yaz."}</p>${a.malzeme.length ? `<div class="al-malzeme"><i>Kullanacakların</i>${a.malzeme.map((x) => `<code>${esc(x)}</code>`).join("")}</div>` : ""}</div>`;
      const gosterim = a.tur === "kopya" ? `<pre class="al-kod"><code>${vurgu(a.satir)}</code></pre>`
        : a.tur === "bosluk" ? `<pre class="al-kod"><code>${esc(a.on)}<span class="al-bos">${"_".repeat(Math.max(3, a.bos.length))}</span>${esc(a.son)}</code></pre>`
        : `<pre class="al-kod ${d.bakildi || d.dogru ? "" : "iskelet"}" id="al-iskelet"><code>${d.bakildi || d.dogru ? vurgu(a.satir) : esc(iskelet(a.satir))}</code></pre>${d.bakildi || d.dogru ? "" : '<p class="al-not">Noktalar harf ve rakamların yerini gösterir; noktalama işaretleri yerinde duruyor.</p>'}`;
      govde.innerHTML = `${bilgi}${gosterim}
        <form class="al-form" id="al-form" autocomplete="off">
          <input id="al-girdi" class="al-girdi" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="${a.tur === "bosluk" ? "Eksik parça" : "Satırı yaz"}" placeholder="${a.tur === "bosluk" ? "eksik parça" : "buraya yaz"}" value="${esc(d.dogru ? (a.tur === "bosluk" ? a.bos : a.satir) : d.yazilan)}" ${d.dogru ? "disabled" : ""} />
          <button class="btn primary" ${d.dogru ? "disabled" : ""}>Denetle</button>
        </form>
        <p class="al-geri ${d.dogru ? "dogru" : ""}" id="al-geri" aria-live="polite">${d.dogru ? "Doğru." : ""}</p>
        <div class="al-alt">
          <button type="button" class="btn sm" id="al-onceki" ${n === 0 ? "disabled" : ""}>‹ Önceki</button>
          ${a.tur === "hafiza" && !d.dogru && !d.bakildi ? `<button type="button" class="btn sm ghost" id="al-bak">Hatırlamıyorum, göster</button>` : ""}
          <span class="spacer"></span>
          <button type="button" class="btn sm ${d.dogru ? "primary" : ""}" id="al-sonraki">${n === sira.length - 1 ? "Bitir" : "Sonraki ›"}</button>
        </div>`;
      const girdi = $("#al-girdi"), geri = $("#al-geri");
      if (!d.dogru) girdi.focus({ preventScroll: true }); else $("#al-sonraki").focus({ preventScroll: true });
      girdi.oninput = () => (d.yazilan = girdi.value);
      girdi.addEventListener("paste", (e) => { e.preventDefault(); geri.className = "al-geri uyari"; geri.textContent = "Yapıştırmak yerine yaz; el alışkanlığı böyle oluşur."; });
      $("#al-onceki").onclick = () => git(n - 1);
      $("#al-sonraki").onclick = () => git(n + 1);
      if ($("#al-bak")) $("#al-bak").onclick = () => { d.bakildi = true; ciz(); $("#al-geri").className = "al-geri uyari"; $("#al-geri").textContent = "Bak, sonra yaz. Bu satırı en sonda bir kez daha soracağım."; };
      $("#al-form").onsubmit = (e) => {
        e.preventDefault();
        if (d.dogru) return git(n + 1);
        const hedef = a.tur === "bosluk" ? a.bos : a.satir, yazilan = girdi.value;
        if (!yazilan.trim()) return;
        if (ayni(yazilan, hedef)) {
          d.dogru = true;
          /* Bakılan ya da iki kez yanlış yazılan satır sona bir kez daha eklenir */
          if (a.tur === "hafiza" && (d.bakildi || d.yanlis >= 2) && !a.tekrar && eklenen < L.length) { sira.push(Object.assign({}, a, { tekrar: true })); eklenen++; }
          if (KD.bkt && a.tur === "hafiza") KD.bkt.observe(p.id, !d.bakildi && !d.yanlis, 0.25);
          stage.querySelector(".al").classList.add("tamam");
          geri.className = "al-geri dogru"; geri.textContent = a.tur === "hafiza" && !d.bakildi && !d.yanlis ? "Doğru, hem de bakmadan." : "Doğru.";
          girdi.disabled = true; noktalar();
          const benim = n;
          setTimeout(() => { const el = stage.querySelector(".al"); if (!el) return; el.classList.remove("tamam"); if (n === benim) git(n + 1); }, 750);
          return;
        }
        d.yanlis++;
        const f = fark(yazilan, hedef);
        geri.className = "al-geri yanlis";
        geri.innerHTML = f.eksik ? `Buraya kadar doğru, devamı eksik. Sıradaki: <code>${esc(f.beklenen.slice(0, 4))}</code>`
          : f.fazla ? "Sonunda fazladan bir şey var."
          : `${f.konum + 1}. karakterde ayrılıyor. Orada <code>${esc(f.beklenen.slice(0, 4) || "(son)")}</code> olmalı.`;
        girdi.classList.remove("salla"); void girdi.offsetWidth; girdi.classList.add("salla");
        if (a.tur === "hafiza" && d.yanlis >= 2 && $("#al-bak")) $("#al-bak").classList.add("vurgulu");
      };
    }
    function bitir() {
      const yapilan = durum.filter((d) => d && d.dogru).length, bakilan = durum.filter((d, k) => d && d.bakildi && sira[k].tur === "hafiza" && !sira[k].tekrar).length;
      const yeterli = yapilan >= Math.ceil(sira.length * 0.7);
      const ilk = !ph.drill && yeterli;
      if (yeterli) { if (tekrarTuru) ph.drill2 = true; ph.drill = true; ph.drillGun = ph.drillGun || S.day(); S.save(); }
      if (ilk) { S.addXP(20); if (A.renderBar) A.renderBar(); }
      n = sira.length; noktalar();
      $("#al-rozet").textContent = tekrarTuru ? "Tekrar" : "Özet"; $("#al-rozet").className = "r-ozet"; $("#al-satirno").textContent = "";
      $("#al-baslik").textContent = yeterli ? (tekrarTuru ? "Tekrar bitti" : "Alıştırma bitti") : "Henüz bitmedi";
      $("#al-soz").textContent = !yeterli ? `${sira.length} alıştırmanın ${yapilan} tanesini yaptın. Görevlere geçebilirsin, ama atladıklarına dönersen satırlar daha iyi yerleşir.`
        : bakilan ? `${L.length} satırın ${Math.max(0, L.length - bakilan)} tanesini bakmadan yazdın. Bakmak ayıp değil; yarın bir kez daha dene, o zaman hepsi gelir.` : `${L.length} satırın hepsini bakmadan yazdın. Bunlar artık senin.`;
      $("#al-sayac").textContent = ilk ? "+20 XP" : `${yapilan} / ${sira.length}`;
      const ilkEksik = durum.findIndex((d, k) => k < sira.length && !(d && d.dogru));
      govde.innerHTML = `<div class="al-bilgi"><span>Bu derste aklında kalması gereken satırlar</span></div>
        <pre class="al-kod ozet"><code>${vurgu(L.map((x) => x.satir).join("\n"))}</code></pre>
        <div class="al-alt">${ilkEksik >= 0 ? `<button class="btn" id="al-eksik">Atladıklarıma dön</button>` : `<button class="btn ghost" id="al-yeniden">Bir tur daha</button>`}<span class="spacer"></span><a class="btn primary" href="#${p.id}/kodla">Görevlere geç</a></div>`;
      if ($("#al-eksik")) $("#al-eksik").onclick = () => git(ilkEksik);
      if ($("#al-yeniden")) $("#al-yeniden").onclick = () => baslat(p, stage, { bitince });
      if (yeterli && bitince) bitince();
    }
    ciz();
  }

  const api = { sade, ayni, fark, iskelet, boslukSec, malzeme, gorevCumlesi, satirlar, uret, baslat, SOZLUK, parcalar };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  kok.KD_ALISTIR = api;
})(typeof window !== "undefined" ? window : globalThis);
