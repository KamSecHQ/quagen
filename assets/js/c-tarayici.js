/* QUAGEN — tarayıcıda C derleyicisi
 * Gerçek clang 22 (YoWASP, WebAssembly) bir modül worker'ında C kodunu wasm32-wasi'ye derler; program ayrı ve
 * sonlandırılabilir bir worker'da küçük bir WASI katmanıyla çalışır. Kod hiçbir sunucuya gönderilmez.
 * İlk kullanımda derleyici bir kez indirilir (~22 MB, sonra tarayıcı önbelleğinde).
 *
 * Bellek denetimi: AddressSanitizer WebAssembly'de yok. Onun yerine
 *  - UBSan tuzak modu (-fsanitize=undefined -fsanitize-trap=undefined): işaretli taşma, sabit dizi sınırı, sıfıra bölme…
 *  - engine.js PRELUDE'undaki KD_TARAYICI bloğu: blok sonu bekçi baytları (taşma), çift free, geçersiz free,
 *    serbest bırakılan belleği zehirleme (use-after-free okumaları çöp değer verir).
 */
(function (KD) {
  const SURUM = "22.0.0-git20542-10";
  const CDN = `https://cdn.jsdelivr.net/npm/@yowasp/clang@${SURUM}/gen/bundle.js`;
  const BAYRAKLAR = ["-std=c11", "-O0", "-Wall", "-Wextra", "-Wno-unused-parameter", "-fno-color-diagnostics",
    "-fsanitize=undefined", "-fsanitize-trap=undefined", "-DKD_TARAYICI=1", "-Wl,-z,stack-size=1048576", "-lm"];

  const DERLEYICI_SRC = `
import { runClang } from ${JSON.stringify(CDN)};
onmessage = async (e) => {
  const { id, kod, bayraklar } = e.data;
  const dec = new TextDecoder();
  let cikti = "";
  const yaz = (b) => { if (b) cikti += dec.decode(b, { stream: true }); };
  const ilerleme = (x) => postMessage({ id, tip: "ilerleme", done: x.doneLength, total: x.totalLength });
  try {
    const out = await runClang(["clang", ...bayraklar, "main.c", "-o", "program"], { "main.c": kod }, { stdout: yaz, stderr: yaz, fetchProgress: ilerleme });
    const wasm = out.program.slice();
    postMessage({ id, tip: "bitti", ok: true, cikti, wasm }, [wasm.buffer]);
  } catch (err) {
    if (err && typeof err.code === "number") postMessage({ id, tip: "bitti", ok: false, cikti });
    else postMessage({ id, tip: "bitti", hata: String((err && err.message) || err) });
  }
};`;

  /* Program çalıştırıcı: en küçük WASI preview1 katmanı (stdout/stderr/stdin, saat, rastgele, çıkış) */
  const CALISTIRICI_SRC = `
onmessage = async (e) => {
  const { wasm, stdin, maxCikti } = e.data;
  const enc = new TextEncoder(), dec = new TextDecoder();
  const girdi = enc.encode(stdin || "");
  let gp = 0, out = "", err = "", kesildi = false, mem = null;
  const v = () => new DataView(mem.buffer), u8 = () => new Uint8Array(mem.buffer);
  class Cikis { constructor(c) { this.c = c; } }
  const W = {
    args_sizes_get(c, s) { v().setUint32(c, 1, true); v().setUint32(s, 8, true); return 0; },
    args_get(a, b) { v().setUint32(a, b, true); u8().set(enc.encode("program\\0"), b); return 0; },
    environ_sizes_get(c, s) { v().setUint32(c, 0, true); v().setUint32(s, 0, true); return 0; },
    environ_get() { return 0; },
    fd_write(fd, iovs, n, yazilan) {
      let t = 0; const d = v();
      for (let i = 0; i < n; i++) {
        const p = d.getUint32(iovs + i * 8, true), l = d.getUint32(iovs + i * 8 + 4, true);
        const s = dec.decode(u8().slice(p, p + l));
        if (fd === 1) out += s; else if (fd === 2) err += s; else return 8;
        t += l;
      }
      if (out.length + err.length > maxCikti) { kesildi = true; throw new Cikis(0); }
      d.setUint32(yazilan, t, true); return 0;
    },
    fd_read(fd, iovs, n, okunan) {
      if (fd !== 0) return 8;
      let t = 0; const d = v();
      for (let i = 0; i < n; i++) {
        const p = d.getUint32(iovs + i * 8, true), l = d.getUint32(iovs + i * 8 + 4, true);
        const k = Math.min(l, girdi.length - gp);
        u8().set(girdi.subarray(gp, gp + k), p); gp += k; t += k;
        if (k < l) break;
      }
      d.setUint32(okunan, t, true); return 0;
    },
    fd_fdstat_get(fd, st) {
      if (fd > 2) return 8;
      const d = v(); d.setUint8(st, 2); d.setUint16(st + 2, 0, true);
      d.setBigUint64(st + 8, 0xffffffffffffffffn, true); d.setBigUint64(st + 16, 0xffffffffffffffffn, true); return 0;
    },
    fd_fdstat_set_flags() { return 0; }, fd_close() { return 0; }, fd_seek() { return 70; }, fd_sync() { return 0; },
    fd_prestat_get() { return 8; }, fd_prestat_dir_name() { return 8; }, fd_filestat_get() { return 8; },
    path_open() { return 44; }, sched_yield() { return 0; }, poll_oneoff() { return 52; },
    proc_exit(c) { throw new Cikis(c); },
    clock_time_get(id, _p, t) { v().setBigUint64(t, BigInt(Math.round((id === 0 ? Date.now() : performance.now()) * 1e6)), true); return 0; },
    clock_res_get(_id, r) { v().setBigUint64(r, 1000n, true); return 0; },
    random_get(b, l) { const a = new Uint8Array(l); crypto.getRandomValues(a); u8().set(a, b); return 0; }
  };
  let kod = 0;
  try {
    const mod = await WebAssembly.compile(wasm);
    const imports = {};
    for (const imp of WebAssembly.Module.imports(mod)) {
      if (imp.kind !== "function") continue;
      imports[imp.module] = imports[imp.module] || {};
      imports[imp.module][imp.name] = (imp.module === "wasi_snapshot_preview1" && W[imp.name]) || (() => 52);
    }
    const inst = await WebAssembly.instantiate(mod, imports);
    mem = inst.exports.memory;
    try { inst.exports._start(); } catch (x) { if (x instanceof Cikis) kod = x.c; else throw x; }
    postMessage({ stdout: out, stderr: err, exitCode: kod, truncated: kesildi });
  } catch (x) {
    postMessage({ stdout: out, stderr: err + (err && !err.endsWith("\\n") ? "\\n" : "") + "[wasm] " + ((x && x.message) || x), exitCode: 134, trap: String((x && x.message) || x) });
  }
};`;

  let derleyici = null, derleyiciUrl = null, calistiriciUrl = null, sayac = 0;
  const bekleyen = new Map();
  const dinleyiciler = new Set();
  const durum = { yuklendi: false, done: 0, total: 0 };
  const yay = () => dinleyiciler.forEach((f) => { try { f(durum); } catch (_) {} });

  function derleyiciAl() {
    if (derleyici) return derleyici;
    derleyiciUrl = derleyiciUrl || URL.createObjectURL(new Blob([DERLEYICI_SRC], { type: "text/javascript" }));
    derleyici = new Worker(derleyiciUrl, { type: "module" });
    derleyici.onmessage = (e) => {
      const m = e.data, b = bekleyen.get(m.id);
      if (m.tip === "ilerleme") { durum.done = m.done; durum.total = m.total; yay(); return; }
      if (!durum.yuklendi) { durum.yuklendi = true; yay(); }
      if (b) { bekleyen.delete(m.id); b(m); }
    };
    derleyici.onerror = (e) => {
      if (e.preventDefault) e.preventDefault();
      for (const [id, b] of bekleyen) { bekleyen.delete(id); b({ hata: "C derleyicisi yüklenemedi (" + (e.message || "ağ hatası") + "). İnternet bağlantını kontrol edip tekrar dene." }); }
      derleyici.terminate(); derleyici = null;
    };
    return derleyici;
  }

  /* kod → { ok, cikti (derleyici mesajları), wasm } | { hata } */
  function derle(kod) {
    return new Promise((resolve) => {
      const id = ++sayac;
      const zaman = setTimeout(() => { if (bekleyen.has(id)) { bekleyen.delete(id); resolve({ hata: "C derleyicisi zamanında yanıt vermedi. Bağlantı yavaşsa birkaç saniye sonra tekrar dene." }); } }, durum.yuklendi ? 30000 : 240000);
      bekleyen.set(id, (m) => { clearTimeout(zaman); resolve(m); });
      derleyiciAl().postMessage({ id, kod, bayraklar: BAYRAKLAR });
    });
  }

  /* wasm programını çalıştır → sunucudaki /api/c/run ile aynı biçimde bir koşu sonucu */
  function calistir(wasm, stdin, limitMs = 4000) {
    return new Promise((resolve) => {
      calistiriciUrl = calistiriciUrl || URL.createObjectURL(new Blob([CALISTIRICI_SRC], { type: "text/javascript" }));
      const w = new Worker(calistiriciUrl);
      const bitir = (s) => { clearTimeout(z); w.terminate(); resolve(s); };
      const z = setTimeout(() => bitir({ stdout: "", stderr: "", exitCode: null, timedOut: true }), limitMs);
      w.onmessage = (e) => bitir(e.data);
      w.onerror = (e) => { if (e.preventDefault) e.preventDefault(); bitir({ stdout: "", stderr: "[wasm] " + (e.message || "çalıştırma hatası"), exitCode: 134, trap: e.message }); };
      const kopya = wasm.slice();
      w.postMessage({ wasm: kopya, stdin, maxCikti: 64000 }, [kopya.buffer]);
    });
  }

  /* LP64 uyumu: WebAssembly'de long 32 bittir, macOS/Linux'ta (ve müfredatta) 64 bit. Derlemeden önce long → long long,
     biçim belirteçleri %ld → %lld olarak çevrilir. Satır sayısı değişmez; hata satır numaraları doğru kalır. */
  function lp64(kod) {
    const parcalar = String(kod).split(/("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|\/\*[\s\S]*?\*\/|\/\/[^\n]*)/);
    return parcalar.map((p, i) => {
      if (i % 2 === 1) return p[0] === '"' ? p.replace(/%([-+ #0]*\d*(?:\.\d+)?)l(?!l)([diouxX])/g, "%$1ll$2") : p;
      return p.replace(/\b(long\s+long|long\s+double)\b|\blong\b/g, (m, ikili) => (ikili ? m : "long long"));
    }).join("");
  }

  /* Sunucu biçimiyle aynı yanıt: { ok, compile: { ok, output }, runs: [...] } | { netError } */
  async function calistirHepsi(kod, runs) {
    const d = await derle(lp64(kod));
    if (d.hata) return { netError: d.hata };
    if (!d.ok) return { ok: false, compile: { ok: false, output: d.cikti.trim() } };
    const sonuc = [];
    for (const r of runs) sonuc.push(await calistir(d.wasm, r.stdin || ""));
    return { ok: true, compile: { ok: true, output: d.cikti.trim() }, runs: sonuc, tarayici: true };
  }

  /* İlk indirmede küçük bir ilerleme kutusu (yalnızca bir kez, sonra önbellekte) */
  let kutu = null;
  dinleyiciler.add((d) => {
    if (typeof document === "undefined") return;
    if (d.yuklendi) { if (kutu) { kutu.style.opacity = "0"; setTimeout(() => kutu && kutu.remove(), 400); kutu = null; } return; }
    if (!d.total) return;
    if (!kutu) {
      kutu = document.createElement("div");
      kutu.setAttribute("role", "status");
      kutu.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;padding:12px 16px;border-radius:14px;background:var(--surface,#fff);color:var(--ink,#13213a);border:1px solid var(--rule,#dfe3ea);box-shadow:0 12px 32px rgba(0,0,0,.18);font:600 14px/1.4 var(--sans,system-ui);min-width:280px;transition:opacity .3s";
      kutu.innerHTML = '<div>C derleyicisi hazırlanıyor <span style="font-weight:500;opacity:.7">· yalnızca ilk sefer</span></div><div style="margin-top:8px;height:6px;border-radius:9px;background:var(--sunken,#eceff3);overflow:hidden"><i style="display:block;height:100%;width:0;background:var(--pass,#11805b);transition:width .2s"></i></div>';
      document.body.append(kutu);
    }
    kutu.querySelector("i").style.width = Math.round((d.done / d.total) * 100) + "%";
  });

  KD.cTarayici = { derle, calistir, calistirHepsi, lp64, durum, dinle(f) { dinleyiciler.add(f); return () => dinleyiciler.delete(f); }, hazirla() { derleyiciAl(); } };
})(window.KD);
