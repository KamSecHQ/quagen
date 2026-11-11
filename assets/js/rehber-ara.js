/* QUAGEN Kütüphane — niyet arama motoru
 * "büyük harf yapmak istiyorum" gibi doğal Türkçe bir cümleyi doğru kavrama eşler. Sunucu ya da API anahtarı gerekmez.
 *  1. Türkçe normalleştirme: küçük harf (tr), aksanları sadeleştirme (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u), noktalama atma
 *  2. Dolgu kelimelerini atma ("istiyorum", "nasıl", "yapmak"...) ve dil adlarını yakalama ("python'da" → py)
 *  3. Ek toleransı: ortak önek eşleşmesi (listeyi ~ liste, sıralamak ~ sırala) — Türkçe sondan eklemeli bir dil
 *  4. Puanlama: niyet ifadeleri (tam ifade bonusu), başlık, fonksiyon adları; kelime ağırlıkları IDF ile
 */
(function (root) {
  const DUZ = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };
  const norm = (s) => String(s || "").toLocaleLowerCase("tr").replace(/[çğıöşüâîû]/g, (c) => DUZ[c]).replace(/[^a-z0-9+#]+/g, " ").trim();
  const DOLGU = new Set(("istiyorum istiyom isterim istedim istiyoruz nasil nasıl yapmak yapma yaparim yapabilirim yapilir yapiyorum yap yapalim " +
    "bir ve ile icin ben bunu sunu bunun lazim gerek gerekiyor acaba mi mu misin musun ne nedir neydi demek anlami olarak kodla kodda kodu " +
    "yazmak yazarim yazilir yaz yazdirmak? de da ki the how to a an of in is what do does i want ornek orneği ornegi soyle bir sey sey seyi " +
    "olan olarak var midir hangi diye uzerinde icinde bana bize sen biri lutfen kullanilir kullanmak kullanimi kullanma sekli seklinde dilinde dili").split(" "));
  // "yazdır" anlamlı (ekrana yazdırmak) olduğu için dolgu listesinde değil.
  DOLGU.delete("yazdirmak?");
  const DIL_KELIME = { javascript: "js", js: "js", node: "js", react: "js", python: "py", py: "py", sql: "sql", sqlite: "sql", html: "html", css: "css" };
  const TANIM_SORUSU = /\b(ne demek|nedir|anlami|anlamı|ne ise yarar|ne işe yarar|tanimi|tanımı)\b/;

  let indeks = null;
  function hazirla(R) {
    const belgeler = R.KAVRAMLAR.map((k) => {
      const ifadeler = [k.baslik, ...k.niyet].map((x) => norm(x).split(" ").filter((t) => t && !DOLGU.has(t)));
      const adlar = new Set();
      for (const d in k.diller) {
        const a = k.diller[d].ad;
        for (const parca of a.split(/[\s/,.()<>=:;*]+/)) { const n = norm(parca).replace(/\s+/g, ""); if (n.length >= 2) adlar.add(n); }
      }
      return { k, ifadeler, adlar };
    });
    const df = new Map();
    for (const b of belgeler) for (const t of new Set(b.ifadeler.flat())) df.set(t, (df.get(t) || 0) + 1);
    const N = belgeler.length;
    const idf = (t) => Math.log(1 + N / (df.get(t) || 0.5));
    const terimler = R.TERIMLER.map((t) => ({ t, kelimeler: norm(t.terim + " " + t.ing).split(" ").filter((x) => x && !DOLGU.has(x)) }));
    indeks = { R, belgeler, idf, terimler };
    return indeks;
  }

  /* İki kelime aynı kökten mi? Ortak önek, kısa olanın uzunluğuna göre yeterliyse eşleşir. */
  function benzer(a, b) {
    if (a === b) return 1;
    const kisa = a.length < b.length ? a : b, uzun = kisa === a ? b : a;
    if (kisa.length < 4) return 0; // kısa kelimeler yalnızca birebir eşleşir
    let i = 0;
    while (i < kisa.length && kisa[i] === uzun[i]) i++;
    const gerek = Math.min(5, kisa.length);
    if (i >= gerek && (i === kisa.length || i >= 5)) return i === kisa.length ? 0.9 : 0.75;
    return 0;
  }
  const enIyiEslesme = (t, kelimeler) => kelimeler.reduce((m, q) => Math.max(m, benzer(t, q)), 0);

  function ara(sorgu, secenek = {}) {
    const R = secenek.veri || root.KD_REHBER;
    if (!indeks || indeks.R !== R) hazirla(R);
    const ham = norm(sorgu);
    let dil = secenek.dil || null;
    const kelimeler = [];
    const parcalar = ham.split(" ").filter(Boolean);
    for (let i = 0; i < parcalar.length; i++) {
      const t = parcalar[i];
      const sade = t.replace(/(de|da|te|ta|deki|daki|dan|den|ta|ile)$/, "");
      if (DIL_KELIME[t] || DIL_KELIME[sade]) { dil = dil || DIL_KELIME[t] || DIL_KELIME[sade]; continue; }
      // "c'de", "c dilinde", "c ile" → C dili
      if (t === "c" && (i === parcalar.length - 1 || /^(de|da|dilinde|dili|ile|icin|ile)$/.test(parcalar[i + 1] || "") || i === 0)) { dil = dil || "c"; continue; }
      if (!DOLGU.has(t)) kelimeler.push(t);
    }
    const tanimSorusu = TANIM_SORUSU.test(String(sorgu).toLocaleLowerCase("tr"));
    const { belgeler, idf, terimler } = indeks;
    const sonuclar = [];

    if (kelimeler.length) {
      for (const b of belgeler) {
        let puan = 0;
        for (const ifade of b.ifadeler) {
          if (!ifade.length) continue;
          let eslesen = 0, agirlik = 0, toplamAgirlik = 0;
          for (const t of ifade) {
            const w = idf(t);
            toplamAgirlik += w;
            const e = enIyiEslesme(t, kelimeler);
            if (e) { eslesen++; agirlik += w * e; }
          }
          if (!eslesen) continue;
          const kapsama = agirlik / toplamAgirlik;
          let p = agirlik * (0.5 + kapsama);
          if (eslesen === ifade.length) p += 4 + 2 * ifade.length;     // ifadenin tamamı sorguda
          if (ifade.length > 1 && (" " + kelimeler.join(" ") + " ").includes(" " + ifade.join(" ") + " ")) p += 4;
          puan = Math.max(puan, p) + p * 0.15;                          // en iyi ifade + diğerlerinden küçük katkı
        }
        for (const t of kelimeler) if (b.adlar.has(t.replace(/\s+/g, ""))) puan += 14;   // fonksiyon adını yazdı
        if (puan <= 0) continue;
        if (dil) puan += b.k.diller[dil] ? 3 : -6;
        if (tanimSorusu) puan -= 1;
        sonuclar.push({ tur: "kavram", id: b.k.id, puan, kavram: b.k });
      }
      for (const { t, kelimeler: tk } of terimler) {
        let es = 0;
        for (const x of tk) if (enIyiEslesme(x, kelimeler) >= 0.9) es++;
        if (!es) continue;
        let puan = (es / tk.length) * 10 + (es === tk.length ? 4 : 0);
        if (tanimSorusu) puan += 8;
        if (es === tk.length && kelimeler.length <= tk.length + 1) puan += 3;
        sonuclar.push({ tur: "terim", id: t.id, puan, terim: t });
      }
    }
    sonuclar.sort((a, b) => b.puan - a.puan);
    const en = sonuclar[0] ? sonuclar[0].puan : 0;
    const filtreli = sonuclar.filter((s) => s.puan >= Math.max(4, en * 0.35)).slice(0, secenek.limit || 8);
    const guven = !en ? 0 : Math.min(1, en / 26) * (filtreli[1] ? Math.min(1, 0.55 + (en - filtreli[1].puan) / en) : 1);
    return { dil, kelimeler, tanimSorusu, guven: Math.round(guven * 100) / 100, sonuclar: filtreli };
  }

  root.KD_REHBER_ARA = ara;
  root.KD_REHBER_NORM = norm;
})(typeof window !== "undefined" ? window : globalThis);
