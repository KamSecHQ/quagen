/* QUAGEN — sanal kabuk: lablar için tarayıcıda çalışan küçük bir Linux benzeri ortam.
 * Gerçek bir sistem değildir; sahte bir dosya sistemi üzerinde en çok kullanılan komutları taklit eder.
 *   const k = KD_KABUK.olustur({ dosyalar: { "/home/ogrenci/not.txt": "merhaba", "/etc/gizli": { icerik: "x", mod: "600", sahip: "root" } } });
 *   k.calistir("ls -la | grep not")  →  { cikti: "…", hata: false }
 * Desteklenen: pwd ls cd cat head tail echo grep find wc sort uniq cut tr base64 xxd rev whoami id hostname
 *              history clear mkdir touch rm cp mv chmod file help; ağ verilmişse ip ping nslookup nc curl; boru (|), > ve >> yönlendirme, ./betik çalıştırma (.sh dosyaları satır satır çalışır). */
(function (kok) {
  const KOMUTLAR = {};
  const birlestir = (cwd, p) => {
    if (!p) return cwd;
    const parcalar = (p.startsWith("/") ? p : cwd + "/" + p).split("/");
    const yigin = [];
    for (const x of parcalar) { if (!x || x === ".") continue; if (x === "..") yigin.pop(); else yigin.push(x); }
    return "/" + yigin.join("/");
  };
  const ust = (p) => p.slice(0, p.lastIndexOf("/")) || "/";
  const ad = (p) => p.slice(p.lastIndexOf("/") + 1) || "/";
  const modYazi = (d) => (d.tur === "d" ? "d" : "-") + [...d.mod].map((c) => { const n = +c; return (n & 4 ? "r" : "-") + (n & 2 ? "w" : "-") + (n & 1 ? "x" : "-"); }).join("");
  const kalip = (g) => new RegExp("^" + g.replace(/[.+^${}()|\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$");

  /* Satırı sözcüklere böler: tek ve çift tırnak, boru ve yönlendirme ayrı belirteçtir */
  function ayristir(satir) {
    const bel = []; let s = "", tirnak = null, dolu = false;
    const it = () => { if (dolu) bel.push({ t: "s", v: s }); s = ""; dolu = false; };
    for (let i = 0; i < satir.length; i++) {
      const c = satir[i];
      if (tirnak) { if (c === tirnak) tirnak = null; else s += c; continue; }
      if (c === '"' || c === "'") { tirnak = c; dolu = true; continue; }
      if (c === "\\" && i + 1 < satir.length) { s += satir[++i]; dolu = true; continue; }
      if (c === " " || c === "\t") { it(); continue; }
      if (c === "|") { it(); bel.push({ t: "|" }); continue; }
      if (c === ">") { it(); if (satir[i + 1] === ">") { i++; bel.push({ t: ">>" }); } else bel.push({ t: ">" }); continue; }
      s += c; dolu = true;
    }
    if (tirnak) return { hata: "tırnak kapatılmamış" };
    it();
    return { bel };
  }

  function olustur(ayar = {}) {
    const kullanici = ayar.kullanici || "ogrenci", makine = ayar.makine || "lab", ev = ayar.ev || "/home/" + kullanici;
    const fs = new Map();
    const dizinYap = (p, sahip = "root") => { const yol = birlestir("/", p); let c = ""; for (const x of yol.split("/").filter(Boolean)) { c += "/" + x; if (!fs.has(c)) fs.set(c, { tur: "d", mod: "755", sahip: c.startsWith(ev) ? kullanici : sahip }); } };
    fs.set("/", { tur: "d", mod: "755", sahip: "root" });
    dizinYap(ev);
    for (const [p, v] of Object.entries(ayar.dosyalar || {})) {
      const o = typeof v === "string" ? { icerik: v } : v;
      dizinYap(ust(p));
      if (o.dizin) dizinYap(p, o.sahip);
      else fs.set(p, { tur: "f", icerik: o.icerik || "", mod: o.mod || "644", sahip: o.sahip || (p.startsWith(ev) ? kullanici : "root"), betik: o.betik || null });
      if (o.dizin && o.mod) fs.get(p).mod = o.mod;
    }
    const K = { cwd: ayar.cwd || ev, kullanici, makine, ev, fs, gecmis: [], sonKomutlar: [] };
    const izin = (d, bit) => { const m = [...d.mod].map(Number); return ((d.sahip === kullanici ? m[0] : m[2]) & bit) !== 0; };
    const cocuklar = (p) => [...fs.keys()].filter((k) => k !== p && ust(k) === p).sort();
    const coz = (p) => birlestir(K.cwd, p === "~" ? ev : p && p.startsWith("~/") ? ev + p.slice(1) : p);
    const oku = (p, komut) => {
      const yol = coz(p), d = fs.get(yol);
      if (!d) throw new Error(`${komut}: ${p}: Böyle bir dosya ya da dizin yok`);
      if (d.tur === "d") throw new Error(`${komut}: ${p}: Bu bir dizin`);
      if (!izin(d, 4)) throw new Error(`${komut}: ${p}: Erişim engellendi`);
      return d.icerik;
    };
    const yaz = (p, icerik, ekle) => {
      const yol = coz(p), d = fs.get(yol), u = fs.get(ust(yol));
      if (!u || u.tur !== "d") throw new Error(`${p}: Böyle bir dizin yok`);
      if (d) { if (d.tur === "d") throw new Error(`${p}: Bu bir dizin`); if (!izin(d, 2)) throw new Error(`${p}: Erişim engellendi`); d.icerik = ekle ? d.icerik + icerik : icerik; }
      else { if (!izin(u, 2)) throw new Error(`${p}: Erişim engellendi`); fs.set(yol, { tur: "f", icerik, mod: "644", sahip: kullanici, betik: null }); }
    };
    const satirlar = (s) => { const l = s.split("\n"); if (l[l.length - 1] === "") l.pop(); return l; };
    const bayraklar = (arg) => { const b = new Set(), kalan = []; let bitti = false; for (const a of arg) { if (!bitti && a === "--") bitti = true; else if (!bitti && /^-[a-zA-Z]+$/.test(a)) [...a.slice(1)].forEach((c) => b.add(c)); else kalan.push(a); } return { b, kalan }; };
    const girdi = (kalan, stdin, komut) => (kalan.length ? kalan.map((p) => oku(p, komut)).join("") : stdin || "");
    const C = {
      pwd: () => K.cwd + "\n",
      whoami: () => kullanici + "\n",
      id: () => `uid=1000(${kullanici}) gid=1000(${kullanici}) gruplar=1000(${kullanici})\n`,
      hostname: () => makine + "\n",
      clear: () => "\x00temizle",
      history: () => K.gecmis.map((g, i) => String(i + 1).padStart(4) + "  " + g).join("\n") + "\n",
      echo: (a) => a.join(" ") + "\n",
      cd: (a) => { const yol = coz(a[0] || ev), d = fs.get(yol); if (!d) throw new Error(`cd: ${a[0]}: Böyle bir dosya ya da dizin yok`); if (d.tur !== "d") throw new Error(`cd: ${a[0]}: Dizin değil`); if (!izin(d, 1)) throw new Error(`cd: ${a[0]}: Erişim engellendi`); K.cwd = yol; return ""; },
      ls: (a) => {
        const { b, kalan } = bayraklar(a);
        const hedefler = kalan.length ? kalan : ["."];
        return hedefler.map((h) => {
          const yol = coz(h), d = fs.get(yol);
          if (!d) throw new Error(`ls: ${h}: Böyle bir dosya ya da dizin yok`);
          if (d.tur === "d" && !izin(d, 4)) throw new Error(`ls: ${h}: Erişim engellendi`);
          let liste = d.tur === "d" ? cocuklar(yol) : [yol];
          if (!b.has("a")) liste = liste.filter((p) => !ad(p).startsWith("."));
          const baslik = hedefler.length > 1 ? h + ":\n" : "";
          if (b.has("l")) return baslik + liste.map((p) => { const x = fs.get(p); return `${modYazi(x)} ${x.sahip.padEnd(8)} ${String(x.tur === "d" ? 4096 : x.icerik.length).padStart(6)} ${ad(p)}${x.tur === "d" ? "/" : ""}`; }).join("\n") + (liste.length ? "\n" : "");
          return baslik + liste.map((p) => ad(p) + (fs.get(p).tur === "d" ? "/" : "")).join("  ") + (liste.length ? "\n" : "");
        }).join("\n");
      },
      cat: (a, stdin) => { const { b, kalan } = bayraklar(a); const m = girdi(kalan, stdin, "cat"); return b.has("n") ? satirlar(m).map((l, i) => String(i + 1).padStart(6) + "  " + l).join("\n") + "\n" : m; },
      head: (a, stdin) => { let n = 10; const kalan = []; for (let i = 0; i < a.length; i++) { if (a[i] === "-n") n = +a[++i]; else if (/^-\d+$/.test(a[i])) n = +a[i].slice(1); else kalan.push(a[i]); } const l = satirlar(girdi(kalan, stdin, "head")).slice(0, n); return l.join("\n") + (l.length ? "\n" : ""); },
      tail: (a, stdin) => { let n = 10; const kalan = []; for (let i = 0; i < a.length; i++) { if (a[i] === "-n") n = +a[++i]; else if (/^-\d+$/.test(a[i])) n = +a[i].slice(1); else kalan.push(a[i]); } const l = satirlar(girdi(kalan, stdin, "tail")).slice(-n); return l.join("\n") + (l.length ? "\n" : ""); },
      wc: (a, stdin) => { const { b, kalan } = bayraklar(a); const m = girdi(kalan, stdin, "wc"); const l = satirlar(m).length, w = m.split(/\s+/).filter(Boolean).length; const son = kalan.length ? " " + kalan.join(" ") : ""; return (b.has("l") ? l : b.has("w") ? w : b.has("c") ? m.length : `${l} ${w} ${m.length}`) + son + "\n"; },
      grep: (a, stdin) => {
        const { b, kalan } = bayraklar(a);
        if (!kalan.length) throw new Error("grep: aranacak ifade yok. Kullanım: grep [-i -n -c -v -r] ifade [dosya]");
        const [ifade, ...dosyalar] = kalan;
        let re; try { re = new RegExp(ifade, b.has("i") ? "i" : ""); } catch (_) { re = new RegExp(ifade.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), b.has("i") ? "i" : ""); }
        let kaynak = [];
        if (b.has("r")) { const kokYol = coz(dosyalar[0] || "."); for (const [p, d] of fs) if (d.tur === "f" && (p === kokYol || p.startsWith(kokYol === "/" ? "/" : kokYol + "/")) && izin(d, 4)) kaynak.push([p.startsWith(K.cwd + "/") ? p.slice(K.cwd.length + 1) : p, d.icerik]); }
        else if (dosyalar.length) kaynak = dosyalar.map((p) => [p, oku(p, "grep")]);
        else kaynak = [[null, stdin || ""]];
        const cok = kaynak.length > 1; let cikti = "", toplam = 0;
        for (const [isim, metin] of kaynak) {
          let say = 0;
          satirlar(metin).forEach((l, i) => { if (re.test(l) !== b.has("v")) { say++; if (!b.has("c")) cikti += (cok ? isim + ":" : "") + (b.has("n") ? i + 1 + ":" : "") + l + "\n"; } });
          toplam += say; if (b.has("c")) cikti += (cok ? isim + ":" : "") + say + "\n";
        }
        if (!toplam && !b.has("c")) throw Object.assign(new Error(""), { sessiz: true });
        return cikti;
      },
      find: (a) => {
        let bas = ".", isim = null, tur = null;
        for (let i = 0; i < a.length; i++) { if (a[i] === "-name") isim = kalip(a[++i] || "*"); else if (a[i] === "-type") tur = a[++i]; else if (!a[i].startsWith("-")) bas = a[i]; }
        const kokYol = coz(bas); if (!fs.has(kokYol)) throw new Error(`find: ${bas}: Böyle bir dosya ya da dizin yok`);
        const goster = (p) => (bas.startsWith("/") ? p : p === kokYol ? bas : (bas === "." ? "." : bas.replace(/\/$/, "")) + p.slice(kokYol === "/" ? 0 : kokYol.length));
        const l = [...fs.keys()].filter((p) => p === kokYol || p.startsWith(kokYol === "/" ? "/" : kokYol + "/")).sort().filter((p) => (!isim || isim.test(ad(p))) && (!tur || fs.get(p).tur === tur));
        return l.map(goster).join("\n") + (l.length ? "\n" : "");
      },
      sort: (a, stdin) => { const { b, kalan } = bayraklar(a); let l = satirlar(girdi(kalan, stdin, "sort")); l.sort(b.has("n") ? (x, y) => parseFloat(x) - parseFloat(y) || x.localeCompare(y) : (x, y) => (x < y ? -1 : x > y ? 1 : 0)); if (b.has("r")) l.reverse(); if (b.has("u")) l = l.filter((x, i) => x !== l[i - 1]); return l.join("\n") + (l.length ? "\n" : ""); },
      uniq: (a, stdin) => { const { b, kalan } = bayraklar(a); const l = satirlar(girdi(kalan, stdin, "uniq")), c = []; for (const x of l) { if (c.length && c[c.length - 1][0] === x) c[c.length - 1][1]++; else c.push([x, 1]); } return c.map(([x, n]) => (b.has("c") ? String(n).padStart(7) + " " : "") + x).join("\n") + (c.length ? "\n" : ""); },
      cut: (a, stdin) => { let d = "\t", f = null; const kalan = []; for (let i = 0; i < a.length; i++) { if (a[i] === "-d") d = a[++i]; else if (a[i].startsWith("-d")) d = a[i].slice(2); else if (a[i] === "-f") f = a[++i]; else if (a[i].startsWith("-f")) f = a[i].slice(2); else kalan.push(a[i]); } if (!f) throw new Error("cut: alan belirtilmedi. Kullanım: cut -d ' ' -f 1 [dosya]"); const al = f.split(",").flatMap((x) => { const m = x.split("-").map(Number); return m.length === 2 ? Array.from({ length: m[1] - m[0] + 1 }, (_, i) => m[0] + i) : [m[0]]; }); const l = satirlar(girdi(kalan, stdin, "cut")); return l.map((s) => { const p = s.split(d); return al.map((i) => p[i - 1]).filter((x) => x !== undefined).join(d); }).join("\n") + (l.length ? "\n" : ""); },
      tr: (a, stdin) => { const ac = (s) => s.replace(/(.)-(.)/g, (_, x, y) => { let r = ""; for (let c = x.charCodeAt(0); c <= y.charCodeAt(0); c++) r += String.fromCharCode(c); return r; }); if (a[0] === "-d") { const sil = new Set(ac(a[1] || "")); return [...(stdin || "")].filter((c) => !sil.has(c)).join(""); } if (a.length < 2) throw new Error("tr: iki küme gerekli. Örnek: tr 'a-z' 'A-Z'"); const x = ac(a[0]), y = ac(a[1]); return [...(stdin || "")].map((c) => { const i = x.indexOf(c); return i < 0 ? c : y[Math.min(i, y.length - 1)]; }).join(""); },
      rev: (a, stdin) => satirlar(girdi(a, stdin, "rev")).map((l) => [...l].reverse().join("")).join("\n") + "\n",
      base64: (a, stdin) => { const { b, kalan } = bayraklar(a); const m = girdi(kalan, stdin, "base64"); const B = (s) => (typeof btoa === "function" ? btoa(unescape(encodeURIComponent(s))) : Buffer.from(s, "utf8").toString("base64")); const D = (s) => (typeof atob === "function" ? decodeURIComponent(escape(atob(s))) : Buffer.from(s, "base64").toString("utf8")); if (b.has("d") || b.has("D")) { try { return D(m.replace(/\s+/g, "")); } catch (_) { throw new Error("base64: geçersiz girdi"); } } return B(m.replace(/\n$/, "")) + "\n"; },
      xxd: (a, stdin) => { const { b, kalan } = bayraklar(a); const m = girdi(kalan, stdin, "xxd"); if (b.has("r")) { const h = m.replace(/[^0-9a-fA-F]/g, ""); let s = ""; for (let i = 0; i + 1 < h.length; i += 2) s += String.fromCharCode(parseInt(h.slice(i, i + 2), 16)); return s; } const hex = [...m.replace(/\n$/, "")].map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(""); return hex + "\n"; },
      file: (a) => a.map((p) => { const d = fs.get(coz(p)); if (!d) return `${p}: bulunamadı`; if (d.tur === "d") return `${p}: dizin`; if (d.betik) return `${p}: çalıştırılabilir betik`; return `${p}: ${/^[A-Za-z0-9+/=\s]+$/.test(d.icerik) && d.icerik.trim().length % 4 === 0 && d.icerik.trim().length > 8 ? "ASCII metin (base64 olabilir)" : "ASCII metin"}`; }).join("\n") + "\n",
      mkdir: (a) => { for (const p of a.filter((x) => !x.startsWith("-"))) { const yol = coz(p); if (fs.has(yol)) throw new Error(`mkdir: ${p}: Zaten var`); const u = fs.get(ust(yol)); if (!u) throw new Error(`mkdir: ${p}: Üst dizin yok`); if (!izin(u, 2)) throw new Error(`mkdir: ${p}: Erişim engellendi`); fs.set(yol, { tur: "d", mod: "755", sahip: kullanici }); } return ""; },
      touch: (a) => { for (const p of a) if (!fs.has(coz(p))) yaz(p, "", false); return ""; },
      rm: (a) => { const { b, kalan } = bayraklar(a); for (const p of kalan) { const yol = coz(p), d = fs.get(yol); if (!d) throw new Error(`rm: ${p}: Böyle bir dosya ya da dizin yok`); if (d.tur === "d" && !b.has("r")) throw new Error(`rm: ${p}: Bu bir dizin (-r gerekir)`); if (!izin(fs.get(ust(yol)), 2)) throw new Error(`rm: ${p}: Erişim engellendi`); for (const k of [...fs.keys()]) if (k === yol || k.startsWith(yol + "/")) fs.delete(k); } return ""; },
      cp: (a) => { if (a.length < 2) throw new Error("cp: kaynak ve hedef gerekli"); const m = oku(a[0], "cp"); const h = fs.get(coz(a[1])); yaz(h && h.tur === "d" ? a[1].replace(/\/$/, "") + "/" + ad(coz(a[0])) : a[1], m, false); return ""; },
      mv: (a) => { C.cp(a); C.rm([a[0]]); return ""; },
      chmod: (a) => {
        if (a.length < 2) throw new Error("chmod: kullanım: chmod 600 dosya  ya da  chmod +x dosya");
        const [m, ...dosyalar] = a;
        for (const p of dosyalar) {
          const d = fs.get(coz(p)); if (!d) throw new Error(`chmod: ${p}: Böyle bir dosya ya da dizin yok`);
          if (d.sahip !== kullanici) throw new Error(`chmod: ${p}: İşleme izin verilmiyor (dosyanın sahibi değilsin)`);
          if (/^[0-7]{3}$/.test(m)) d.mod = m;
          else { const e = m.match(/^([ugoa]*)([+-])([rwx]+)$/); if (!e) throw new Error(`chmod: geçersiz kip: ${m}`); const kim = e[1] && e[1] !== "a" ? [...e[1]] : ["u", "g", "o"]; const bit = [...e[3]].reduce((n, c) => n | { r: 4, w: 2, x: 1 }[c], 0); const r = [...d.mod].map(Number); kim.forEach((k) => { const i = { u: 0, g: 1, o: 2 }[k]; r[i] = e[2] === "+" ? r[i] | bit : r[i] & ~bit; }); d.mod = r.join(""); }
        }
        return "";
      },
      sudo: () => { throw new Error(`sudo: ${kullanici} sudoers dosyasında değil. Bu lab yönetici yetkisi gerektirmez.`); },
      /* ---- Ağ komutları: yalnızca ayar.ag verilmiş makinelerde çalışır (benzetim, gerçek ağa çıkmaz) ---- */
      ip: (a) => { const g = agGerek("ip"); if (a[0] && !/^a(ddr)?$/.test(a[0])) throw new Error("ip: yalnızca 'ip addr' destekleniyor"); return `1: lo: <LOOPBACK,UP>\n    inet 127.0.0.1/8\n2: eth0: <BROADCAST,UP>\n    inet ${g.ben}/24  ağ geçidi ${g.gecit || "-"}\n`; },
      nslookup: (a) => { agGerek("nslookup"); if (!a[0]) throw new Error("nslookup: kullanım: nslookup alanadı"); const adr = adCoz(a[0]); if (!adr) throw new Error(`nslookup: ${a[0]}: böyle bir ad yok (NXDOMAIN)`); return `Sunucu:  ${ag.dnsSunucu || "192.168.1.1"}\n\nAd:      ${a[0]}\nAdres:   ${adr}\n`; },
      ping: (a) => {
        agGerek("ping"); let n = 4; const kalan = [];
        for (let i = 0; i < a.length; i++) { if (a[i] === "-c") n = Math.max(1, Math.min(10, +a[++i] || 4)); else kalan.push(a[i]); }
        if (!kalan[0]) throw new Error("ping: kullanım: ping [-c adet] adres");
        const adr = adCoz(kalan[0]); if (!adr) throw new Error(`ping: ${kalan[0]}: ad çözülemedi`);
        const m = ag.makineler[adr], acik = m && !m.sessiz; let c = `PING ${kalan[0]} (${adr})\n`;
        for (let i = 1; i <= n; i++) c += acik ? `${adr} adresinden yanıt: sıra=${i} ttl=64 süre=${((m.ms || 10) + ((i * 7) % 5) / 10).toFixed(1)} ms\n` : `sıra=${i} için zaman aşımı\n`;
        return c + `\n--- ${kalan[0]} ping özeti ---\n${n} paket gönderildi, ${acik ? n : 0} alındı, %${acik ? 0 : 100} kayıp\n`;
      },
      nc: (a) => {
        agGerek("nc"); const kalan = a.filter((x) => !x.startsWith("-"));
        if (kalan.length < 2 || !/^\d+$/.test(kalan[1])) throw new Error("nc: kullanım: nc -zv adres port");
        const adr = adCoz(kalan[0]); if (!adr) throw new Error(`nc: ${kalan[0]}: ad çözülemedi`);
        const m = ag.makineler[adr]; if (!m) throw new Error(`nc: ${kalan[0]} (${adr}) ${kalan[1]}: zaman aşımı, makine yanıt vermiyor`);
        const hizmet = (m.portlar || {})[kalan[1]]; if (!hizmet) throw new Error(`nc: ${kalan[0]} (${adr}) ${kalan[1]}: bağlantı reddedildi (port kapalı)`);
        return `${kalan[0]} (${adr}) ${kalan[1]} portu açık [${hizmet}]\n`;
      },
      curl: (a) => {
        agGerek("curl"); const baslikIste = a.includes("-I") || a.includes("--head"), adres = a.find((x) => !x.startsWith("-"));
        if (!adres) throw new Error("curl: kullanım: curl [-I] http://adres/yol");
        const e = adres.match(/^(?:(https?):\/\/)?([^/:]+)(?::(\d+))?(\/.*)?$/); if (!e) throw new Error(`curl: (3) adres anlaşılamadı: ${adres}`);
        const port = e[3] || (e[1] === "https" ? "443" : "80"), yol = e[4] || "/", adr = adCoz(e[2]);
        if (!adr) throw new Error(`curl: (6) ad çözülemedi: ${e[2]}`);
        const m = ag.makineler[adr]; if (!m) throw new Error(`curl: (28) ${e[2]}: zaman aşımı`);
        const site = (m.web || {})[port]; if (!(m.portlar || {})[port] || !site) throw new Error(`curl: (7) ${e[2]} ${port} portuna bağlanılamadı`);
        const s = site[yol] || site[yol.replace(/\/$/, "") || "/"] || { kod: 404, govde: "404 Bulunamadı\n" };
        const kod = s.kod || 200, ad = { 200: "OK", 301: "Kalıcı Olarak Taşındı", 403: "Yasak", 404: "Bulunamadı" }[kod] || "", govde = s.govde || "";
        if (!baslikIste) return govde;
        return `HTTP/1.1 ${kod} ${ad}\nServer: ${m.sunucu || "nginx"}\nContent-Type: ${s.tur || "text/html; charset=utf-8"}\nContent-Length: ${govde.length}\n${Object.entries(s.basliklar || {}).map(([k, v]) => `${k}: ${v}\n`).join("")}`;
      },
      help: () => (ag ? "Ağ      : ip addr  ping [-c]  nslookup  nc -zv  curl [-I]\n" : "") + "Kullanabileceğin komutlar:\n  Gezinme : pwd  ls [-l -a]  cd  find\n  Okuma   : cat  head  tail  wc  file\n  Arama   : grep [-i -n -c -v -r]  sort  uniq [-c]  cut -d -f\n  Dönüşüm : base64 [-d]  xxd [-r -p]  tr  rev  echo\n  Dosya   : mkdir  touch  cp  mv  rm  chmod\n  Diğer   : whoami  id  hostname  history  clear\nBoru (|) ve > yönlendirme çalışır. Örnek: cat kayit.log | grep Hata | wc -l\n"
    };
    C.yardim = C.help; C.man = (a) => (a[0] && C[a[0]] ? `${a[0]}: kısa yardım için 'help' yaz.\n` : C.help());
    Object.assign(C, KOMUTLAR);

    const ag = ayar.ag || null;
    const agGerek = (komut) => { if (!ag) throw new Error(`${komut}: bu makine bir ağa bağlı değil`); return ag; };
    /* Ad çözme sırası gerçek sistemdeki gibi: önce /etc/hosts, sonra DNS. IP verilirse olduğu gibi döner. */
    const adCoz = (ad) => {
      if (/^\d+\.\d+\.\d+\.\d+$/.test(ad)) return ad;
      if (ad === "localhost") return "127.0.0.1";
      const h = fs.get("/etc/hosts");
      if (h) for (const satir of h.icerik.split("\n")) { const p = satir.split("#")[0].trim().split(/\s+/); if (p.length > 1 && p.slice(1).includes(ad)) return p[0]; }
      return (ag.dns || {})[ad] || null;
    };
    let derinlik = 0;
    function tekKomut(sozcukler, stdin) {
      const [isim, ...arg] = sozcukler;
      if (isim.includes("/")) {       // ./betik.sh
        const d = fs.get(coz(isim));
        if (!d) throw new Error(`${isim}: Böyle bir dosya ya da dizin yok`);
        if (d.tur === "d") throw new Error(`${isim}: Bu bir dizin`);
        if (!izin(d, 1)) throw new Error(`${isim}: Erişim engellendi (çalıştırma izni yok)`);
        if (d.betik) return d.betik(K, arg, stdin);
        /* Öğrencinin yazdığı betik: her satır sırayla çalışır, $1 ilk argümandır. */
        if (/\.sh$/.test(isim) || d.icerik.startsWith("#!")) {
          if (derinlik > 4) throw new Error(`${isim}: betikler iç içe çok derin çağrıldı`);
          derinlik++;
          try {
            let cikti = "";
            for (const ham of d.icerik.split("\n")) {
              const t = ham.trim(); if (!t || t.startsWith("#")) continue;
              const r = K.calistir(t.replace(/\$1/g, arg[0] || "")); K.gecmis.pop();
              cikti += r.cikti;
              if (r.hata) { const h = new Error(cikti.replace(/\n$/, "")); throw h; }
            }
            return cikti;
          } finally { derinlik--; }
        }
        return d.icerik;
      }
      if (!C[isim]) throw new Error(`${isim}: komut bulunamadı. Komut listesi için 'help' yaz.`);
      return C[isim](arg, stdin, K);
    }
    K.calistir = function (satir) {
      satir = String(satir).trim();
      if (!satir) return { cikti: "", hata: false };
      K.gecmis.push(satir);
      const a = ayristir(satir);
      if (a.hata) return { cikti: "kabuk: " + a.hata + "\n", hata: true };
      const borular = [[]]; let hedef = null, ekle = false;
      for (let i = 0; i < a.bel.length; i++) {
        const b = a.bel[i];
        if (b.t === "|") borular.push([]);
        else if (b.t === ">" || b.t === ">>") { const n = a.bel[++i]; if (!n || n.t !== "s") return { cikti: "kabuk: yönlendirme için dosya adı gerekli\n", hata: true }; hedef = n.v; ekle = b.t === ">>"; }
        else borular[borular.length - 1].push(b.v);
      }
      if (borular.some((b) => !b.length)) return { cikti: "kabuk: boş komut\n", hata: true };
      let veri = "";
      try {
        for (const b of borular) veri = tekKomut(b, veri);
        if (hedef !== null) { yaz(hedef, veri, ekle); veri = ""; }
      } catch (e) {
        return { cikti: e.sessiz ? "" : e.message + "\n", hata: true, sessiz: !!e.sessiz };
      }
      if (veri === "\x00temizle") return { cikti: "", temizle: true, hata: false };
      return { cikti: veri, hata: false };
    };
    K.istem = () => `${kullanici}@${makine}:${K.cwd === ev ? "~" : K.cwd.startsWith(ev + "/") ? "~" + K.cwd.slice(ev.length) : K.cwd}$`;
    K.dosya = (p) => fs.get(birlestir("/", p)) || null;
    K.tamamla = (on) => { const i = on.lastIndexOf("/"), dizin = coz(i < 0 ? "." : on.slice(0, i) || "/"), bas = on.slice(i + 1); return cocuklar(dizin).map(ad).filter((x) => x.startsWith(bas)).map((x) => (i < 0 ? "" : on.slice(0, i + 1)) + x + (fs.get(birlestir(dizin, x)).tur === "d" ? "/" : "")); };
    return K;
  }

  const api = { olustur, komutEkle: (ad, fn) => (KOMUTLAR[ad] = fn) };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  kok.KD_KABUK = api;
})(typeof window !== "undefined" ? window : globalThis);
