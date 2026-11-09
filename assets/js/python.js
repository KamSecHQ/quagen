/* QUAGEN — Python çalıştırıcı
 * Python, tarayıcıda WebAssembly üzerinde (Pyodide, CPython 3.12) ayrı bir Web Worker'da çalışır.
 * Sunucuda kod çalıştırılmaz; sonsuz döngü zaman aşımıyla durdurulur (worker sonlandırılır).
 *
 * Test biçimleri (C ile aynı mantık):
 *   mode "fn":     { label, setup?, expr, expected }  — expected JSON değeri; demetler liste, kümeler sıralı liste
 *                  { label, setup?, expr, throws: "ValueError" }  — belirtilen istisna fırlatılmalı
 *   mode "stdout": { label, stdin, stdout }  — öğrencinin programı çalışır, çıktısı karşılaştırılır
 *   her iki modda: { label, codeMatch | codeNot, codeHint }
 */
(function (KD) {
  const SURUM = "0.26.4";
  const CDN = "https://cdn.jsdelivr.net/pyodide/v" + SURUM + "/full/";

  /* Worker içinde çalışan Python tarafı */
  const RUNNER = String.raw`
import sys, io, json, math, traceback

def _iz(e):
    satir = None
    if isinstance(e, SyntaxError) and getattr(e, "filename", None) == "main.py":
        satir = e.lineno
    for fr in traceback.extract_tb(e.__traceback__):
        if fr.filename == "main.py":
            satir = fr.lineno
    return {"tur": type(e).__name__, "mesaj": str(e), "satir": satir}

def _calis(stdin, f):
    eski_in, eski_out = sys.stdin, sys.stdout
    sys.stdin = io.StringIO(stdin)
    tampon = io.StringIO()
    sys.stdout = tampon
    deger, hata = None, None
    try:
        deger = f()
    except SystemExit:
        pass
    except BaseException as e:
        hata = _iz(e)
    finally:
        sys.stdin, sys.stdout = eski_in, eski_out
    return deger, tampon.getvalue()[:60000], hata

def _norm(v):
    if isinstance(v, (list, tuple)):
        return [_norm(x) for x in v]
    if isinstance(v, (set, frozenset)):
        xs = [_norm(x) for x in v]
        try:
            return sorted(xs)
        except TypeError:
            return xs
    if isinstance(v, dict):
        return {(k if isinstance(k, str) else str(k)): _norm(x) for k, x in v.items()}
    return v

def _sayi(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool)

def _esit(a, b):
    if _sayi(a) and _sayi(b):
        return a == b or math.isclose(a, b, rel_tol=1e-9, abs_tol=1e-9)
    if isinstance(a, bool) or isinstance(b, bool):
        return type(a) is type(b) and a == b
    if isinstance(a, list) and isinstance(b, list):
        return len(a) == len(b) and all(_esit(x, y) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(_esit(a[k], b[k]) for k in a)
    return type(a) is type(b) and a == b

def _goster(v):
    try:
        s = repr(v)
    except Exception:
        s = "<gösterilemedi>"
    return s if len(s) <= 400 else s[:400] + "…"

def kd_run(istek_json):
    istek = json.loads(istek_json)
    kod = istek.get("code", "")
    mod = istek.get("mode", "fn")
    testler = istek.get("tests")
    try:
        derl = compile(kod, "main.py", "exec")
    except SyntaxError as e:
        return json.dumps({"derleme": _iz(e)})
    sys.setrecursionlimit(1500)

    if not testler or mod == "stdout":
        girdiler = [t.get("stdin", "") for t in testler] if testler else [istek.get("stdin", "")]
        kosular = []
        for g in girdiler:
            ns = {"__name__": "__main__"}
            _, cikti, hata = _calis(g, lambda: exec(derl, ns))
            kosular.append({"stdout": cikti, "hata": hata})
        return json.dumps({"kosular": kosular})

    sonuclar, ilk_cikti = [], None
    for t in testler:
        etiket = t.get("label", t.get("expr", ""))
        ns = {"__name__": "kodera_test"}
        _, cikti, hata = _calis("", lambda: exec(derl, ns))
        if ilk_cikti is None:
            ilk_cikti = cikti
        if hata:
            sonuclar.append({"label": etiket, "pass": False, "hata": hata})
            continue
        if t.get("setup"):
            _, _, hata = _calis("", lambda: exec(compile(t["setup"], "test", "exec"), ns))
            if hata:
                sonuclar.append({"label": etiket, "pass": False, "hata": hata})
                continue
        ifade = compile(t["expr"], "test", "eval")
        deger, _, hata = _calis("", lambda: eval(ifade, ns))
        if "throws" in t:
            beklenen = t["throws"]
            ok = bool(hata) and (beklenen is True or hata["tur"] == beklenen)
            sonuclar.append({"label": etiket, "pass": ok,
                             "got": (hata["tur"] + ": " + hata["mesaj"]) if hata else "hata yok, sonuç " + _goster(deger),
                             "expected": (beklenen if isinstance(beklenen, str) else "bir hata") + " fırlatmalı"})
            continue
        if hata:
            sonuclar.append({"label": etiket, "pass": False, "hata": hata, "expected": _goster(t.get("expected"))})
            continue
        beklenen = t.get("expected")
        sonuclar.append({"label": etiket, "pass": _esit(_norm(deger), beklenen), "got": _goster(deger), "expected": _goster(beklenen)})
    return json.dumps({"sonuclar": sonuclar, "cikti": ilk_cikti or ""})
`;

  const WORKER_SRC = `
let pyP = null;
function hazir() {
  if (!pyP) {
    importScripts(${JSON.stringify(CDN)} + "pyodide.js");
    pyP = loadPyodide({ indexURL: ${JSON.stringify(CDN)} }).then((py) => { py.runPython(${JSON.stringify(RUNNER)}); return py; });
  }
  return pyP;
}
onmessage = async (e) => {
  let py;
  try { py = await hazir(); } catch (err) { postMessage({ tip: "bitti", yukleme: String(err && err.message || err) }); return; }
  postMessage({ tip: "basladi" });
  try {
    const f = py.globals.get("kd_run");
    const out = f(JSON.stringify(e.data));
    f.destroy();
    postMessage(Object.assign({ tip: "bitti" }, JSON.parse(out)));
  } catch (err) { postMessage({ tip: "bitti", ic: String(err && err.message || err) }); }
};`;

  /* Sık görülen Python hatalarının Türkçe açıklaması */
  const ACIKLAMA = {
    NameError: (m) => { const ad = (m.match(/'([^']+)'/) || [])[1]; return (ad ? "`" + ad + "`" : "Bu isim") + " tanımlı değil. Yazımı (büyük/küçük harf) kontrol et ya da kullanmadan önce tanımla."; },
    UnboundLocalError: () => "Fonksiyonun içinde bu değişkene değer atadığın için Python onu yerel sayıyor, ama atamadan önce okuyorsun.",
    TypeError: (m) => /unsupported operand|can only concatenate|must be str/.test(m) ? "Uyumsuz türleri birleştiriyorsun (ör. metin + sayı). Gerekirse str() ya da int() ile dönüştür."
      : /not callable/.test(m) ? "Fonksiyon olmayan bir şeyi çağırıyorsun. Bir değişkene fonksiyonla aynı adı vermiş olabilir misin?"
      : /argument/.test(m) ? "Fonksiyonu yanlış sayıda ya da yanlış adlı argümanla çağırıyorsun."
      : /not subscriptable/.test(m) ? "İndekslenemeyen bir değere [ ] ile erişiyorsun (ör. None ya da sayı)."
      : /not iterable/.test(m) ? "Üzerinde döngü kurulamayan bir değeri dolaşmaya çalışıyorsun."
      : "Bir işlem yanlış türde değerle yapılıyor.",
    ValueError: (m) => /invalid literal for int/.test(m) ? "int() sayıya çevrilemeyen bir metin aldı. Girdide boşluk ya da harf olabilir mi? strip() dene." : "Doğru türde ama geçersiz bir değer.",
    IndexError: () => "Liste dışına çıktın. Geçerli indeksler 0 ile len(liste) − 1 arasındadır; boş liste olabilir mi?",
    KeyError: (m) => "Sözlükte " + m + " anahtarı yok. `in` ile kontrol et ya da .get(anahtar, varsayılan) kullan.",
    ZeroDivisionError: () => "Sıfıra bölme. Bölmeden önce paydanın 0 olup olmadığını kontrol et.",
    AttributeError: (m) => /NoneType/.test(m) ? "None değerinin bir özelliğine erişiyorsun. Bir fonksiyon return etmeyi unutmuş olabilir (ör. list.sort() None döndürür)." : "Bu nesnede böyle bir özellik ya da metot yok. Adını ve türünü kontrol et.",
    IndentationError: () => "Girinti hatası. Python'da bloklar girintiyle belirlenir: aynı bloktaki satırlar aynı miktarda (4 boşluk) içeride olmalı; iki noktadan (:) sonra girinti gelir.",
    TabError: () => "Sekme ve boşluk karışmış. Girintide yalnızca boşluk kullan.",
    SyntaxError: (m) => /expected ':'/.test(m) ? "if, for, while, def ve class satırlarının sonunda iki nokta (:) olmalı."
      : /never closed|unterminated|EOF/.test(m) ? "Açılan bir parantez ya da tırnak kapanmamış."
      : /invalid syntax. Maybe you meant '==' /.test(m) ? "Karşılaştırma için == kullanılır; = atamadır."
      : "Söz dizimi hatası: parantezleri, tırnakları ve iki noktaları kontrol et.",
    RecursionError: () => "Özyineleme durmuyor. Temel durumun var mı ve her çağrı ona yaklaşıyor mu?",
    EOFError: () => "input() okuyacak girdi bulamadı. Programına girdi vermek için çıktı panelindeki Girdi kutusunu kullan.",
    ModuleNotFoundError: () => "Bu modül tarayıcıdaki Python'da yok. Standart kütüphane modüllerini kullan.",
    AssertionError: () => "Bir assert koşulu sağlanmadı.",
    StopIteration: () => "Biten bir yineleyiciden next() ile değer istendi.",
    OverflowError: () => "Sayı çok büyük (genellikle ondalıklı sayılarda).",
    MemoryError: () => "Bellek yetmedi: çok büyük bir liste ya da sonsuz büyüyen bir yapı olabilir."
  };
  KD.pyAcikla = (h) => {
    if (!h) return "";
    const f = ACIKLAMA[h.tur];
    return (f ? f(h.mesaj || "") + " " : "") + "(" + h.tur + (h.mesaj ? ": " + h.mesaj : "") + (h.satir ? ", " + h.satir + ". satır" : "") + ")";
  };

  let isci = null, url = null, kuyruk = Promise.resolve();
  function yeniIsci() {
    if (!url) url = URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" }));
    isci = new Worker(url);
    return isci;
  }
  const norm = (s) => String(s == null ? "" : s).replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");
  function kodTesti(t, kod) {
    const src = kod.replace(/#.*$/gm, "");
    const ok = t.codeMatch ? new RegExp(t.codeMatch).test(src) : !new RegExp(t.codeNot).test(src);
    return { label: t.label, pass: ok, got: ok ? "uygun" : t.codeMatch ? "bulunamadı" : "kullanılmış", expected: t.codeHint || (t.codeMatch ? "kodda olmalı" : "kullanılmamalı") };
  }

  /* Tek bir isteği worker'a gönder. Yükleme süresi zaman aşımına sayılmaz. */
  function gonder(istek, limit) {
    return new Promise((resolve) => {
      const w = isci || yeniIsci();
      let zaman = setTimeout(() => bitir({ yuklemeZamanAsimi: true }), 90000);
      function bitir(m) {
        clearTimeout(zaman);
        w.onmessage = null;
        if (m.zamanAsimi || m.yuklemeZamanAsimi) { w.terminate(); if (isci === w) isci = null; }
        resolve(m);
      }
      w.onmessage = (e) => {
        if (e.data.tip === "basladi") { clearTimeout(zaman); zaman = setTimeout(() => bitir({ zamanAsimi: true }), limit); return; }
        bitir(e.data);
      };
      w.onerror = (e) => { if (e.preventDefault) e.preventDefault(); w.terminate(); if (isci === w) isci = null; bitir({ ic: e.message || "Python çalıştırıcı hatası" }); };
      w.postMessage(istek);
    });
  }

  KD.pyHazirla = () => { if (!isci) { yeniIsci(); gonder({ code: "pass", mode: "stdout", tests: null }, 5000); } };

  /* opts: { mode: "fn" | "stdout", tests, stdin, timeout } → { logs, results?, error?, line?, timeout? } */
  KD.runPy = function (kod, opts = {}) {
    const is = kuyruk.then(() => calistir(kod, opts));
    kuyruk = is.catch(() => {});
    return is;
  };
  async function calistir(kod, opts) {
    const mode = opts.mode || "fn";
    const tests = opts.tests || null;
    const kosulacak = tests ? tests.filter((t) => !t.codeMatch && !t.codeNot) : null;
    const logs = [];
    const m = await gonder({ code: kod, mode, tests: kosulacak, stdin: opts.stdin || "" }, opts.timeout || 5000);
    if (m.yukleme || m.yuklemeZamanAsimi) return { logs, error: "Python yüklenemedi. İnternet bağlantını kontrol et ve tekrar dene." };
    if (m.zamanAsimi) return { logs, timeout: true, error: "Zaman aşımı: kod " + (opts.timeout || 5000) / 1000 + " saniyede bitmedi. Sonsuz döngü olabilir mi?" };
    if (m.ic) return { logs, error: "Python çalıştırıcı hatası: " + m.ic };
    if (m.derleme) return { logs, error: KD.pyAcikla(m.derleme), line: m.derleme.satir, compileError: true };
    const satirlar = (s) => norm(s).split("\n").filter((l, i, a) => l || i < a.length - 1);

    if (!tests || mode === "stdout") {
      if (!tests) {
        const k = m.kosular[0];
        if (k.stdout) satirlar(k.stdout).forEach((l) => logs.push({ level: "log", text: l }));
        if (k.hata) return { logs, error: KD.pyAcikla(k.hata), line: k.hata.satir };
        return { logs };
      }
      const results = []; let i = 0;
      for (const t of tests) {
        if (t.codeMatch || t.codeNot) { results.push(kodTesti(t, kod)); continue; }
        const k = m.kosular[i++];
        const got = norm(k.stdout), exp = norm(t.stdout);
        const pass = !k.hata && (t.contains ? got.includes(norm(t.contains)) : got === exp);
        results.push({ label: t.label, pass, got: k.hata ? KD.pyAcikla(k.hata) : JSON.stringify(got), expected: JSON.stringify(t.contains ? "…" + norm(t.contains) + "…" : exp), error: !!k.hata, line: k.hata && k.hata.satir });
      }
      return { logs, results, line: (results.find((r) => r.line) || {}).line };
    }

    if (m.cikti) satirlar(m.cikti).forEach((l) => logs.push({ level: "log", text: l }));
    const results = []; let i = 0;
    for (const t of tests) {
      if (t.codeMatch || t.codeNot) { results.push(kodTesti(t, kod)); continue; }
      const s = m.sonuclar[i++];
      if (s.hata) results.push({ label: s.label, pass: false, got: KD.pyAcikla(s.hata), expected: s.expected || "", error: true, line: s.hata.satir });
      else results.push({ label: s.label, pass: s.pass, got: s.got, expected: s.expected });
    }
    return { logs, results, line: (results.find((r) => r.line) || {}).line };
  }

  /* Sözdizimi renklendirme (belgeler, portföy, rehber) */
  const PK = /(#.*$)|("""[^]*?"""|'''[^]*?'''|[rbfRBF]?"(?:[^"\\]|\\.)*"|[rbfRBF]?'(?:[^'\\]|\\.)*')|(@[\w.]+)|\b(def|class|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|import|from|as|try|except|finally|raise|with|lambda|yield|pass|break|continue|global|nonlocal|assert|del|async|await|match|case)\b|\b(print|len|range|int|str|float|list|dict|set|tuple|sum|min|max|sorted|enumerate|zip|map|filter|input|abs|round|isinstance|open|any|all|reversed|type|bool|self)\b|\b(\d+(?:\.\d+)?)\b/g;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  KD.hlPy = (line) => esc(line).replace(PK, (x, c, s, d, k, b, n) => c ? '<i class="t-c">' + c + "</i>" : s ? '<i class="t-s">' + s + "</i>" : d ? '<i class="t-l">' + d + "</i>" : k ? '<i class="t-k">' + k + "</i>" : b ? '<i class="t-l">' + b + "</i>" : '<i class="t-n">' + n + "</i>");
  const eskiDoc = KD.hlDoc;
  if (eskiDoc) KD.hlDoc = (src, lang) => (lang === "py" ? src.split("\n").map(KD.hlPy) : eskiDoc(src, lang));
})(window.KD);
