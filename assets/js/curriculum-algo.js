/* QUAGEN NextGen — Müfredat: Algoritmalar & Veri Yapıları, Ders 31–40
 * Worker'da çalışır. Performans testleri: { setup, expr, expected, maxMs }
 *   setup ölçülmez (büyük girdiyi hazırlar), expr süresi maxMs'i aşarsa test başarısız olur.
 * Ön koşul: JavaScript temelleri (Ders 1–10).
 */
(function () {
  const T = 10000; // algoritma görevleri için çalışma süresi sınırı (ms)
  const LIST = "const L = (a) => a.reduceRight((n, v) => ({ deger: v, sonraki: n }), null); const A = (h) => { const r = []; while (h) { r.push(h.deger); h = h.sonraki; } return r; };";
  const TREE = "const N = (deger, sol = null, sag = null) => ({ deger, sol, sag });";
  const AGAC = "N(1, N(2, N(4), N(5)), N(3))";

  const ALGO = [
  /* ============================ DERS 31 ============================ */
  {
    id: "p31", no: 31, track: "algo", title: "Karmaşıklık: Big-O", short: "Big-O",
    goal: "Bir çözümün girdi büyüdükçe nasıl yavaşladığını tahmin et; aynı problemi daha az işle çöz.",
    concepts: ["O(1), O(n), O(n²)", "zaman ve bellek", "Set ile arama", "tek geçiş"],
    predict: {
      code: "function say(n) {\n  let s = 0;\n  for (let i = 0; i < n; i++)\n    for (let j = 0; j < n; j++) s++;\n  return s;\n}\n// n 10 katına çıkarsa çalışma süresi yaklaşık kaç katına çıkar?",
      options: ["10 katına", "20 katına", "100 katına", "Değişmez"], answer: 2,
      why: "İç içe iki döngü n × n iş yapar: O(n²). n 10 katına çıkınca iş 10 × 10 = 100 katına çıkar. Big-O tam süreyi değil, büyüme hızını anlatır.",
      run: false
    },
    example: {
      title: "Aynı problem, iki farklı büyüme hızı",
      code: "function tekrarVarYavas(d) {\n  for (let i = 0; i < d.length; i++)\n    for (let j = i + 1; j < d.length; j++)\n      if (d[i] === d[j]) return true;\n  return false;\n}\n\nfunction tekrarVarHizli(d) {\n  const gorulen = new Set();\n  for (const x of d) {\n    if (gorulen.has(x)) return true;\n    gorulen.add(x);\n  }\n  return false;\n}\n\nconst veri = Array.from({ length: 20000 }, (_, i) => i);\nlet t = performance.now();\ntekrarVarYavas(veri);\nconsole.log(\"O(n²):\", Math.round(performance.now() - t), \"ms\");\nt = performance.now();\ntekrarVarHizli(veri);\nconsole.log(\"O(n):\", Math.round(performance.now() - t), \"ms\");",
      steps: [
        { lines: [1, 2, 3, 4], text: "Her eleman diğer her elemanla karşılaştırılıyor: yaklaşık n²/2 karşılaştırma. 20.000 eleman için 200 milyon işlem." },
        { lines: [8, 9], text: "Set, bir değerin içinde olup olmadığını ortalama sabit sürede, O(1), söyler." },
        { lines: [10, 11, 12, 13], text: "Diziyi bir kez dolaşıyoruz: O(n). Karşılığında n kadar ek bellek harcıyoruz. Hız için bellek vermek en sık yapılan takastır." },
        { lines: [17, 18, 19, 20, 21, 22, 23], text: "Çalıştır ve iki süreyi karşılaştır. Bu dersteki bazı testler süre de ölçer." }
      ]
    },
    challenges: [
      {
        id: "p31c1", kind: "Değiştir", title: "En büyük fark", fn: "enBuyukFark", timeout: T,
        prompt: "`enBuyukFark(dizi)` dizideki en büyük ile en küçük sayının farkını döndürsün; boş dizide 0. Başlangıç kodu doğru çalışıyor ama sıralama yaptığı için O(n log n). **Tek geçişte**, O(n) çöz.",
        starter: "function enBuyukFark(dizi) {\n  if (dizi.length === 0) return 0;\n  const sirali = [...dizi].sort((a, b) => a - b);\n  return sirali[sirali.length - 1] - sirali[0];\n}\n",
        tests: [
          { args: [[3, 9, 1, 7]], expected: 8 },
          { args: [[]], expected: 0 },
          { args: [[-5, -2, -9]], expected: 7 },
          { label: "1.000.000 eleman, 60 ms içinde", setup: "globalThis.__d = Array.from({ length: 1000000 }, (_, i) => (i * 7919) % 1000003); let a = Infinity, b = -Infinity; for (const x of __d) { if (x < a) a = x; if (x > b) b = x; } globalThis.__f = b - a;", expr: "enBuyukFark(__d) === __f", expected: true, maxMs: 60 }
        ],
        hints: ["Sıralamaya gerçekten ihtiyacın var mı? Sadece iki değeri bilmen yeterli.", "Dolaşırken o ana kadarki en küçüğü ve en büyüğü iki değişkende tut.", "let enKucuk = dizi[0], enBuyuk = dizi[0]; for (const x of dizi) { … } — Math.max(...dizi) çok büyük dizilerde hata verebilir."],
        solution: "function enBuyukFark(dizi) {\n  if (dizi.length === 0) return 0;\n  let enKucuk = dizi[0], enBuyuk = dizi[0];\n  for (const x of dizi) {\n    if (x < enKucuk) enKucuk = x;\n    if (x > enBuyuk) enBuyuk = x;\n  }\n  return enBuyuk - enKucuk;\n}"
      },
      {
        id: "p31c2", kind: "Yaz", title: "Tekrar var mı?", fn: "tekrarVarMi", timeout: T,
        prompt: "`tekrarVarMi(dizi)` dizide aynı değer en az iki kez geçiyorsa `true` döndürsün. 30.000 elemanlı dizide **60 ms** içinde bitmeli.",
        starter: "function tekrarVarMi(dizi) {\n  \n}\n",
        tests: [
          { args: [[1, 2, 3, 1]], expected: true },
          { args: [[1, 2, 3]], expected: false },
          { args: [[]], expected: false },
          { label: "30.000 benzersiz eleman, 60 ms içinde", setup: "globalThis.__u = Array.from({ length: 30000 }, (_, i) => i);", expr: "tekrarVarMi(__u)", expected: false, maxMs: 60 }
        ],
        hints: ["Örnekteki iki çözümden hangisi büyük girdide hızlı?", "Gördüğün değerleri bir Set'te biriktir.", "if (gorulen.has(x)) return true; gorulen.add(x); — kısa yol: new Set(dizi).size !== dizi.length"],
        solution: "function tekrarVarMi(dizi) {\n  const gorulen = new Set();\n  for (const x of dizi) {\n    if (gorulen.has(x)) return true;\n    gorulen.add(x);\n  }\n  return false;\n}"
      },
      {
        id: "p31c3", kind: "Yaz", title: "İki toplam", fn: "ikiToplam", timeout: T,
        prompt: "`ikiToplam(dizi, hedef)` toplamı `hedef` olan iki elemanın indekslerini `[i, j]` (i < j) olarak döndürsün; yoksa `null`. Her girdide en fazla bir çözüm var. O(n) çözüm bekleniyor.",
        starter: "function ikiToplam(dizi, hedef) {\n  \n}\n",
        tests: [
          { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { args: [[3, 2, 4], 6], expected: [1, 2] },
          { args: [[1, 2], 7], expected: null },
          { label: "50.000 eleman, 40 ms içinde", setup: "globalThis.__b = Array.from({ length: 50000 }, (_, i) => i);", expr: "ikiToplam(__b, 99997)", expected: [49998, 49999], maxMs: 40 }
        ],
        hints: ["Her x için aradığın şey hedef - x. Bunu daha önce gördüysen nerede gördüğünü bilmen gerek.", "Bir Map'te değer → indeks sakla.", "const k = hedef - dizi[j]; if (gorulen.has(k)) return [gorulen.get(k), j]; gorulen.set(dizi[j], j);"],
        solution: "function ikiToplam(dizi, hedef) {\n  const gorulen = new Map();\n  for (let j = 0; j < dizi.length; j++) {\n    const k = hedef - dizi[j];\n    if (gorulen.has(k)) return [gorulen.get(k), j];\n    gorulen.set(dizi[j], j);\n  }\n  return null;\n}"
      }
    ],
    cards: [
      { id: "p31k1", q: "İç içe iki döngü (her biri n kez) hangi karmaşıklıktır?", a: "O(n²). Girdi 10 katına çıkınca iş 100 katına çıkar." },
      { id: "p31k2", q: "Set.has ve dizi.includes arasındaki fark?", a: "Set.has ortalama O(1), includes O(n). Döngü içinde includes kullanmak gizli bir O(n²) yaratır." },
      { id: "p31k3", q: "Zaman–bellek takası nedir?", a: "Ek bellek (Set, Map) kullanarak daha az işlem yapmak. Çoğu hızlı çözüm böyledir." }
    ]
  },

  /* ============================ DERS 32 ============================ */
  {
    id: "p32", no: 32, track: "algo", title: "Hash map ile sayma", short: "Hash map",
    goal: "Map ve Set ile saymayı, gruplamayı ve hızlı aramayı öğren; mülakat sorularının büyük kısmı buna dayanır.",
    concepts: ["Map", "Set", "frekans tablosu", "anahtar üretmek"],
    predict: {
      code: "const s = new Set([1, 1, 2, \"2\", 3]);\nconsole.log(s.size);",
      options: ["3", "4", "5", "Hata verir"], answer: 1,
      why: "Set aynı değeri bir kez tutar. 1 tekrar ediyor ama 2 sayısı ile \"2\" metni farklı değerlerdir (=== karşılaştırması). Sonuç: 1, 2, \"2\", 3."
    },
    example: {
      title: "En sık geçen kelime",
      code: "function enSik(metin) {\n  const sayim = new Map();\n  for (const k of metin.toLowerCase().split(/\\s+/)) {\n    sayim.set(k, (sayim.get(k) || 0) + 1);\n  }\n  let enIyi = null;\n  for (const [kelime, adet] of sayim) {\n    if (!enIyi || adet > enIyi[1]) enIyi = [kelime, adet];\n  }\n  return enIyi;\n}\n\nconsole.log(enSik(\"kod yaz kod oku kod çalıştır\"));",
      steps: [
        { lines: [2], text: "Map, herhangi bir değeri anahtar olarak kullanabilir ve ekleme sırasını korur." },
        { lines: [3, 4], text: "Frekans tablosu: her kelime için sayacı 1 artır. Yoksa 0'dan başla." },
        { lines: [7, 8], text: "Map'i [anahtar, değer] çiftleri olarak dolaşabilirsin." },
        { lines: [13], text: "Toplam O(n): metni bir kez, tabloyu bir kez dolaştık." }
      ]
    },
    challenges: [
      {
        id: "p32c1", kind: "Değiştir", title: "Anagram mı?", fn: "anagramMi", timeout: T,
        prompt: "`anagramMi(a, b)` iki metin aynı harflerden (aynı sayıda) oluşuyorsa `true` döndürsün. Büyük/küçük harf ve boşlukları yok say.",
        starter: "function anagramMi(a, b) {\n  const temiz = (s) => s.toLowerCase().replace(/\\s/g, \"\");\n  // harf sayılarını karşılaştır\n}\n",
        tests: [
          { args: ["kalem", "melak"], expected: true },
          { args: ["Elma", "alem"], expected: true },
          { args: ["elma", "elmas"], expected: false },
          { args: ["Ali Can", "Can Ali"], expected: true },
          { args: ["aab", "abb"], expected: false }
        ],
        hints: ["Uzunlukları farklıysa cevap hemen belli.", "Birinci metnin harflerini say (Map), ikincinin harflerini aynı tablodan düş.", "Bir sayaç 0'ın altına inerse anagram değildir."],
        solution: "function anagramMi(a, b) {\n  const temiz = (s) => s.toLowerCase().replace(/\\s/g, \"\");\n  a = temiz(a); b = temiz(b);\n  if (a.length !== b.length) return false;\n  const sayim = new Map();\n  for (const ch of a) sayim.set(ch, (sayim.get(ch) || 0) + 1);\n  for (const ch of b) {\n    const n = sayim.get(ch);\n    if (!n) return false;\n    sayim.set(ch, n - 1);\n  }\n  return true;\n}"
      },
      {
        id: "p32c2", kind: "Yaz", title: "İlk tekrarsız karakter", fn: "ilkTekrarsiz", timeout: T,
        prompt: "`ilkTekrarsiz(metin)` metinde yalnızca bir kez geçen **ilk** karakterin indeksini döndürsün; yoksa -1.",
        starter: "function ilkTekrarsiz(metin) {\n  \n}\n",
        tests: [
          { args: ["kodera"], expected: 0 },
          { args: ["aabbcdc"], expected: 5 },
          { args: ["aabb"], expected: -1 },
          { label: "20.001 karakter, 30 ms içinde", setup: "globalThis.__s = \"ab\".repeat(10000) + \"z\";", expr: "ilkTekrarsiz(__s)", expected: 20000, maxMs: 30 }
        ],
        hints: ["Her karakter için metni baştan taramak O(n²) olur. İki geçiş yeter.", "1. geçiş: frekans tablosu. 2. geçiş: sayısı 1 olan ilk karakter.", "for (let i = 0; i < metin.length; i++) if (sayim.get(metin[i]) === 1) return i;"],
        solution: "function ilkTekrarsiz(metin) {\n  const sayim = new Map();\n  for (const ch of metin) sayim.set(ch, (sayim.get(ch) || 0) + 1);\n  for (let i = 0; i < metin.length; i++) {\n    if (sayim.get(metin[i]) === 1) return i;\n  }\n  return -1;\n}"
      },
      {
        id: "p32c3", kind: "Yaz", title: "Anagramları grupla", fn: "anagramGrupla", timeout: T,
        prompt: "`anagramGrupla(kelimeler)` birbirinin anagramı olan kelimeleri gruplasın. Gruplar ilk görülme sırasıyla, gruptaki kelimeler girdideki sırayla gelsin.",
        starter: "function anagramGrupla(kelimeler) {\n  \n}\n",
        tests: [
          { args: [["kalem", "melak", "elma", "alem", "kelam"]], expected: [["kalem", "melak", "kelam"], ["elma", "alem"]] },
          { args: [["a"]], expected: [["a"]] },
          { args: [[]], expected: [] }
        ],
        hints: ["Anagramların ortak bir 'imzası' olsaydı onu anahtar olarak kullanabilirdin. Harfleri sıralanmış hali ne olur?", "const anahtar = k.split(\"\").sort().join(\"\");", "Map<anahtar, dizi> kur; sonunda [...map.values()] döndür. Map ekleme sırasını korur."],
        solution: "function anagramGrupla(kelimeler) {\n  const gruplar = new Map();\n  for (const k of kelimeler) {\n    const anahtar = k.split(\"\").sort().join(\"\");\n    if (!gruplar.has(anahtar)) gruplar.set(anahtar, []);\n    gruplar.get(anahtar).push(k);\n  }\n  return [...gruplar.values()];\n}"
      }
    ],
    cards: [
      { id: "p32k1", q: "Map'in düz nesneye ({}) göre üstünlükleri?", a: "Her tür anahtarı kabul eder, ekleme sırasını korur, size özelliği var, sık ekleme/silmede daha hızlıdır." },
      { id: "p32k2", q: "Frekans tablosu deseni?", a: "sayim.set(x, (sayim.get(x) || 0) + 1) — saymak, gruplamak ve karşılaştırmak için temel yapı taşı." },
      { id: "p32k3", q: "Gruplama sorularında anahtar nasıl seçilir?", a: "Aynı gruba girecek elemanlarda eşit, diğerlerinde farklı çıkan bir imza üret (ör. sıralanmış harfler)." }
    ]
  },

  /* ============================ DERS 33 ============================ */
  {
    id: "p33", no: 33, track: "algo", title: "İki işaretçi", short: "İki işaretçi",
    goal: "Sıralı veride iki uçtan ilerleyerek iç içe döngüyü tek geçişe indir.",
    concepts: ["sol ve sağ işaretçi", "sıralı dizi", "birleştirme", "açgözlü seçim"],
    predict: {
      code: "function palindrom(s) {\n  let i = 0, j = s.length - 1, adim = 0;\n  while (i < j) {\n    adim++;\n    if (s[i] !== s[j]) return false;\n    i++; j--;\n  }\n  console.log(\"karşılaştırma:\", adim);\n  return true;\n}\npalindrom(\"kayak\");",
      options: ["2", "3", "4", "5"], answer: 0,
      why: "i=0, j=4 ve i=1, j=3 karşılaştırılır. i=2, j=2 olunca döngü biter: ortadaki harfin eşi yoktur. n harf için n/2 karşılaştırma."
    },
    example: {
      title: "Sıralı dizide iki toplam",
      code: "function siraliIkiToplam(d, hedef) {\n  let i = 0, j = d.length - 1;\n  while (i < j) {\n    const t = d[i] + d[j];\n    if (t === hedef) return [i, j];\n    if (t < hedef) i++;\n    else j--;\n  }\n  return null;\n}\n\nconsole.log(siraliIkiToplam([1, 3, 4, 6, 9, 11], 13));",
      steps: [
        { lines: [2], text: "Bir işaretçi en küçükte, diğeri en büyükte başlar." },
        { lines: [4, 5], text: "Toplam hedefse bitti." },
        { lines: [6], text: "Toplam küçükse, artırmanın tek yolu sol işaretçiyi sağa almak: dizi sıralı olduğu için d[i+1] ≥ d[i]." },
        { lines: [7], text: "Toplam büyükse sağ işaretçiyi sola al. Her adımda bir aday elenir: O(n)." }
      ]
    },
    challenges: [
      {
        id: "p33c1", kind: "Değiştir", title: "Sıralı iki toplam", fn: "siraliIkiToplam", timeout: T,
        prompt: "Başlangıç kodu iç içe döngüyle doğru sonuç veriyor ama O(n²). Dizi **sıralı**; iki işaretçiyle O(n) yap. Çift yoksa `null`.",
        starter: "function siraliIkiToplam(d, hedef) {\n  for (let i = 0; i < d.length; i++)\n    for (let j = i + 1; j < d.length; j++)\n      if (d[i] + d[j] === hedef) return [i, j];\n  return null;\n}\n",
        tests: [
          { args: [[1, 3, 4, 6, 9, 11], 13], expected: [2, 4] },
          { args: [[2, 5], 7], expected: [0, 1] },
          { args: [[1, 2, 3], 100], expected: null },
          { label: "20.000 eleman, 15 ms içinde", setup: "globalThis.__s = Array.from({ length: 20000 }, (_, i) => i * 2);", expr: "siraliIkiToplam(__s, __s[15000] + __s[19999])", expected: [15000, 19999], maxMs: 15 }
        ],
        hints: ["Örnek tam olarak bu problem. Ama önce kendin dene: toplam küçükse hangi işaretçi hareket etmeli?", "let i = 0, j = d.length - 1; while (i < j) { … }", "t < hedef ise i++, t > hedef ise j--."],
        solution: "function siraliIkiToplam(d, hedef) {\n  let i = 0, j = d.length - 1;\n  while (i < j) {\n    const t = d[i] + d[j];\n    if (t === hedef) return [i, j];\n    if (t < hedef) i++;\n    else j--;\n  }\n  return null;\n}"
      },
      {
        id: "p33c2", kind: "Yaz", title: "Sıralı dizileri birleştir", fn: "siraliBirlestir", timeout: T,
        prompt: "`siraliBirlestir(a, b)` iki sıralı diziyi **sıralı** tek bir yeni dizide birleştirsin. `sort` kullanma: her iki dizinin başında bir işaretçi tut.",
        starter: "function siraliBirlestir(a, b) {\n  \n}\n",
        tests: [
          { args: [[1, 4, 7], [2, 3, 9]], expected: [1, 2, 3, 4, 7, 9] },
          { args: [[], [1, 2]], expected: [1, 2] },
          { args: [[5, 5], [5]], expected: [5, 5, 5] },
          { label: "sort kullanılmıyor", expr: "!/\\.sort\\(/.test(siraliBirlestir.toString())", expected: true },
          { label: "2 × 100.000 eleman, 60 ms içinde", setup: "globalThis.__a = Array.from({ length: 100000 }, (_, i) => i * 2); globalThis.__c = Array.from({ length: 100000 }, (_, i) => i * 2 + 1);", expr: "(() => { const r = siraliBirlestir(__a, __c); return r.length === 200000 && r[0] === 0 && r[199999] === 199999 && r[777] === 777; })()", expected: true, maxMs: 60 }
        ],
        hints: ["Her adımda iki dizinin başındaki elemanlardan küçüğünü sonuca koy.", "let i = 0, j = 0; while (i < a.length && j < b.length) { … }", "Döngü bitince kalanları ekle: while (i < a.length) r.push(a[i++]); aynısını b için de yap."],
        solution: "function siraliBirlestir(a, b) {\n  const r = [];\n  let i = 0, j = 0;\n  while (i < a.length && j < b.length) {\n    if (a[i] <= b[j]) r.push(a[i++]);\n    else r.push(b[j++]);\n  }\n  while (i < a.length) r.push(a[i++]);\n  while (j < b.length) r.push(b[j++]);\n  return r;\n}"
      },
      {
        id: "p33c3", kind: "Yaz", title: "En çok su", fn: "enCokSu", timeout: T,
        prompt: "`enCokSu(yukseklikler)`: her eleman bir duvarın yüksekliği. İki duvar ve aradaki zemin bir kap oluşturur; alan = `min(h[i], h[j]) × (j − i)`. En büyük alanı döndür.",
        starter: "function enCokSu(yukseklikler) {\n  \n}\n",
        tests: [
          { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
          { args: [[1, 1]], expected: 1 },
          { args: [[4, 3, 2, 1, 4]], expected: 16 },
          { label: "20.000 duvar, 20 ms içinde", setup: "globalThis.__h = Array.from({ length: 20000 }, (_, i) => ((i * 37) % 1000) + 1); let i = 0, j = __h.length - 1, m = 0; while (i < j) { m = Math.max(m, Math.min(__h[i], __h[j]) * (j - i)); if (__h[i] < __h[j]) i++; else j--; } globalThis.__hm = m;", expr: "enCokSu(__h) === __hm", expected: true, maxMs: 20 }
        ],
        hints: ["En geniş kaptan başla: i en solda, j en sağda.", "Alan kısa duvarla sınırlı. Uzun duvarı içeri almak alanı asla büyütemez.", "Her adımda alanı hesapla, sonra kısa olan duvarın işaretçisini içeri al."],
        solution: "function enCokSu(h) {\n  let i = 0, j = h.length - 1, enIyi = 0;\n  while (i < j) {\n    enIyi = Math.max(enIyi, Math.min(h[i], h[j]) * (j - i));\n    if (h[i] < h[j]) i++;\n    else j--;\n  }\n  return enIyi;\n}"
      }
    ],
    cards: [
      { id: "p33k1", q: "İki işaretçi tekniği hangi durumda akla gelmeli?", a: "Sıralı dizi ya da iki uçtan karşılaştırma (palindrom, çift toplamı, birleştirme) gerektiğinde." },
      { id: "p33k2", q: "Sıralı iki toplamda toplam küçükse hangi işaretçi hareket eder, neden?", a: "Sol işaretçi sağa: dizi sıralı olduğundan toplamı büyütmenin tek yolu budur." },
      { id: "p33k3", q: "İki sıralı diziyi birleştirmenin karmaşıklığı?", a: "O(n + m): her eleman bir kez işlenir. Merge sort bu adıma dayanır." }
    ]
  },

  /* ============================ DERS 34 ============================ */
  {
    id: "p34", no: 34, track: "algo", title: "Kayan pencere", short: "Kayan pencere",
    goal: "Ardışık alt dizileri her seferinde baştan toplamak yerine pencereyi kaydırarak güncelle.",
    concepts: ["sabit pencere", "değişken pencere", "pencereye ekle / çıkar", "O(n·k) → O(n)"],
    predict: {
      code: "const d = [1, 2, 3, 4, 5], k = 3;\nlet toplam = d[0] + d[1] + d[2];\nconst sonuc = [toplam];\nfor (let i = k; i < d.length; i++) {\n  toplam += d[i] - d[i - k];\n  sonuc.push(toplam);\n}\nconsole.log(sonuc);",
      options: ["[6, 9, 12]", "[6, 7, 8]", "[3, 5, 7, 9]", "[6, 15]"], answer: 0,
      why: "Pencere bir kayınca yeni gelen eleman eklenir, düşen eleman çıkarılır: 6 → 6 + 4 − 1 = 9 → 9 + 5 − 2 = 12. Her pencere O(1)'de güncellenir."
    },
    example: {
      title: "Değişken pencere: en uzun tekrarsız alt metin",
      code: "function enUzunTekrarsiz(s) {\n  const son = new Map();\n  let sol = 0, enIyi = 0;\n  for (let sag = 0; sag < s.length; sag++) {\n    const ch = s[sag];\n    if (son.has(ch) && son.get(ch) >= sol) sol = son.get(ch) + 1;\n    son.set(ch, sag);\n    enIyi = Math.max(enIyi, sag - sol + 1);\n  }\n  return enIyi;\n}\n\nconsole.log(enUzunTekrarsiz(\"abcabcbb\"));",
      steps: [
        { lines: [3, 4], text: "Pencere [sol, sag] aralığıdır. sag her adımda bir genişler." },
        { lines: [6], text: "Yeni karakter pencerede zaten varsa, pencereyi o karakterin son konumunun bir sağından başlat." },
        { lines: [7], text: "Her karakterin son görüldüğü konumu sakla." },
        { lines: [8], text: "Pencere her an geçerli: uzunluğunu kaydet. sol yalnızca ileri gider, toplam O(n)." }
      ]
    },
    challenges: [
      {
        id: "p34c1", kind: "Değiştir", title: "En büyük pencere toplamı", fn: "maxPencereToplami", timeout: T,
        prompt: "`maxPencereToplami(dizi, k)` ardışık `k` elemanın en büyük toplamını döndürsün; `k` dizi uzunluğundan büyükse `null`. Başlangıç kodu her pencereyi baştan topluyor: O(n·k). Kaydırarak O(n) yap.",
        starter: "function maxPencereToplami(dizi, k) {\n  if (k > dizi.length) return null;\n  let enIyi = -Infinity;\n  for (let i = 0; i + k <= dizi.length; i++) {\n    let t = 0;\n    for (let j = i; j < i + k; j++) t += dizi[j];\n    enIyi = Math.max(enIyi, t);\n  }\n  return enIyi;\n}\n",
        tests: [
          { args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 },
          { args: [[-1, -2, -3], 2], expected: -3 },
          { args: [[1, 2], 3], expected: null },
          { label: "200.000 eleman, k = 2000, 20 ms içinde", setup: "globalThis.__w = Array.from({ length: 200000 }, (_, i) => (i * 31) % 97);  let t = 0; for (let i = 0; i < 2000; i++) t += __w[i]; let m = t; for (let i = 2000; i < __w.length; i++) { t += __w[i] - __w[i - 2000]; if (t > m) m = t; } globalThis.__wm = m;", expr: "maxPencereToplami(__w, 2000) === __wm", expected: true, maxMs: 20 }
        ],
        hints: ["Tahmin sorusundaki güncelleme satırını hatırla.", "İlk pencerenin toplamını bir kez hesapla.", "Sonra her adımda: t += dizi[i] - dizi[i - k]; enIyi = Math.max(enIyi, t);"],
        solution: "function maxPencereToplami(dizi, k) {\n  if (k > dizi.length) return null;\n  let t = 0;\n  for (let i = 0; i < k; i++) t += dizi[i];\n  let enIyi = t;\n  for (let i = k; i < dizi.length; i++) {\n    t += dizi[i] - dizi[i - k];\n    if (t > enIyi) enIyi = t;\n  }\n  return enIyi;\n}"
      },
      {
        id: "p34c2", kind: "Yaz", title: "En uzun tekrarsız", fn: "enUzunTekrarsiz", timeout: T,
        prompt: "`enUzunTekrarsiz(metin)` hiçbir karakterin tekrar etmediği en uzun **ardışık** alt metnin uzunluğunu döndürsün. Örneği kapatıp kendin yaz.",
        starter: "function enUzunTekrarsiz(metin) {\n  \n}\n",
        tests: [
          { args: ["abcabcbb"], expected: 3 },
          { args: ["bbbbb"], expected: 1 },
          { args: ["pwwkew"], expected: 3 },
          { args: [""], expected: 0 },
          { args: ["kodera"], expected: 6 },
          { args: ["abba"], expected: 2 }
        ],
        hints: ["Pencerenin sol sınırı ne zaman ilerlemeli?", "Her karakterin son görüldüğü indeksi bir Map'te tut.", "\"abba\" tuzağı: eski konum pencerenin dışındaysa (son < sol) sol'u geri çekme."],
        solution: "function enUzunTekrarsiz(s) {\n  const son = new Map();\n  let sol = 0, enIyi = 0;\n  for (let sag = 0; sag < s.length; sag++) {\n    const ch = s[sag];\n    if (son.has(ch) && son.get(ch) >= sol) sol = son.get(ch) + 1;\n    son.set(ch, sag);\n    enIyi = Math.max(enIyi, sag - sol + 1);\n  }\n  return enIyi;\n}"
      },
      {
        id: "p34c3", kind: "Yaz", title: "En kısa alt dizi", fn: "minAltDiziUzunlugu", timeout: T,
        prompt: "`minAltDiziUzunlugu(hedef, dizi)` (pozitif sayılar) toplamı **en az** `hedef` olan en kısa ardışık alt dizinin uzunluğunu döndürsün; yoksa 0.",
        starter: "function minAltDiziUzunlugu(hedef, dizi) {\n  \n}\n",
        tests: [
          { args: [7, [2, 3, 1, 2, 4, 3]], expected: 2 },
          { args: [4, [1, 4, 4]], expected: 1 },
          { args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0 },
          { label: "20.000 eleman, 15 ms içinde", setup: "globalThis.__o = new Array(20000).fill(1);", expr: "minAltDiziUzunlugu(10000, __o)", expected: 10000, maxMs: 15 }
        ],
        hints: ["Pencereyi sağdan genişlet; toplam hedefe ulaşınca soldan daraltmayı dene.", "while (toplam >= hedef) { enIyi = Math.min(enIyi, sag - sol + 1); toplam -= dizi[sol++]; }", "Başlangıç enIyi = Infinity; sonunda Infinity ise 0 döndür."],
        solution: "function minAltDiziUzunlugu(hedef, dizi) {\n  let sol = 0, toplam = 0, enIyi = Infinity;\n  for (let sag = 0; sag < dizi.length; sag++) {\n    toplam += dizi[sag];\n    while (toplam >= hedef) {\n      enIyi = Math.min(enIyi, sag - sol + 1);\n      toplam -= dizi[sol++];\n    }\n  }\n  return enIyi === Infinity ? 0 : enIyi;\n}"
      }
    ],
    cards: [
      { id: "p34k1", q: "Kayan pencere hangi problemlerde işe yarar?", a: "Ardışık alt dizi / alt metin üzerinde en büyük, en küçük, en uzun, en kısa sorularında." },
      { id: "p34k2", q: "Sabit pencerede toplam nasıl güncellenir?", a: "t += d[i] - d[i - k]: giren eklenir, çıkan düşülür." },
      { id: "p34k3", q: "Değişken pencerede neden toplam süre O(n)?", a: "sol ve sag yalnızca ileri gider; her eleman pencereye en fazla bir kez girer ve bir kez çıkar." }
    ]
  },

  /* ============================ DERS 35 ============================ */
  {
    id: "p35", no: 35, track: "algo", title: "Yığın ve kuyruk", short: "Yığın & kuyruk",
    goal: "Son giren ilk çıkar (yığın) ve ilk giren ilk çıkar (kuyruk) yapılarını problem çözmede kullan.",
    concepts: ["push / pop", "LIFO ve FIFO", "eşleştirme", "monoton yığın"],
    predict: {
      code: "const y = [];\ny.push(1); y.push(2); y.push(3);\ny.pop(); y.pop();\ny.push(4);\nconsole.log(y);",
      options: ["[1, 4]", "[3, 4]", "[4]", "[1, 2, 4]"], answer: 0,
      why: "pop her zaman en son ekleneni çıkarır: önce 3, sonra 2. Geriye 1 kalır, 4 eklenir. Tarayıcı geçmişi ve geri al (undo) da böyle çalışır."
    },
    example: {
      title: "Geri al yığını",
      code: "const gecmis = [];\nlet metin = \"\";\n\nfunction yaz(parca) {\n  gecmis.push(metin);\n  metin += parca;\n}\n\nfunction geriAl() {\n  if (gecmis.length) metin = gecmis.pop();\n}\n\nyaz(\"Merhaba\");\nyaz(\", dünya\");\nyaz(\"!\");\ngeriAl();\nconsole.log(metin);",
      steps: [
        { lines: [1], text: "Bir dizi, push ve pop ile yığın olarak kullanılır. İkisi de O(1)." },
        { lines: [4, 5, 6], text: "Değiştirmeden önce mevcut durumu yığına koy." },
        { lines: [9, 10], text: "Geri almak, en son kaydedilen durumu çıkarmaktır." },
        { lines: [16, 17], text: "Çıktı: \"Merhaba, dünya\". Kuyruk için shift kullanılır ama büyük dizilerde O(n) olduğunu unutma." }
      ]
    },
    challenges: [
      {
        id: "p35c1", kind: "Yaz", title: "Dengeli parantez", fn: "parantezDengeliMi", timeout: T,
        prompt: "`parantezDengeliMi(metin)` `()`, `[]`, `{}` doğru sırada açılıp kapanıyorsa `true` döndürsün. Diğer karakterleri yok say.",
        starter: "function parantezDengeliMi(metin) {\n  \n}\n",
        tests: [
          { args: ["()[]{}"], expected: true },
          { args: ["([{}])"], expected: true },
          { args: ["(]"], expected: false },
          { args: ["([)]"], expected: false },
          { args: ["(("], expected: false },
          { args: [""], expected: true },
          { args: ["f(a[0]) { x }"], expected: true }
        ],
        hints: ["Açılan parantezi kapanana kadar hatırlaman gerek. Hangi yapı 'en son açılanı' verir?", "Açılışları yığına it; kapanışta yığının tepesi eşleşen açılış olmalı.", "const es = { \")\": \"(\", \"]\": \"[\", \"}\": \"{\" }; sonunda yığın boş olmalı."],
        solution: "function parantezDengeliMi(metin) {\n  const es = { \")\": \"(\", \"]\": \"[\", \"}\": \"{\" };\n  const yigin = [];\n  for (const ch of metin) {\n    if (ch === \"(\" || ch === \"[\" || ch === \"{\") yigin.push(ch);\n    else if (ch in es) {\n      if (yigin.pop() !== es[ch]) return false;\n    }\n  }\n  return yigin.length === 0;\n}"
      },
      {
        id: "p35c2", kind: "Yaz", title: "Min yığın", fn: "MinYigin", timeout: T,
        prompt: "`MinYigin` sınıfı yaz: `ekle(x)`, `cikar()` (çıkanı döndürür), `ust()` ve `min()`. **Dört işlem de O(1)** olmalı.",
        starter: "class MinYigin {\n  constructor() {\n    this.veri = [];\n  }\n  ekle(x) {}\n  cikar() {}\n  ust() {}\n  min() {}\n}\n",
        tests: [
          { label: "ekle, min, ust", expr: "(() => { const y = new MinYigin(); y.ekle(5); y.ekle(2); y.ekle(8); return [y.min(), y.ust()]; })()", expected: [2, 8] },
          { label: "cikar sonrası min güncellenir", expr: "(() => { const y = new MinYigin(); y.ekle(5); y.ekle(2); y.ekle(8); y.cikar(); y.cikar(); return [y.min(), y.ust()]; })()", expected: [5, 5] },
          { label: "tekrar eden min", expr: "(() => { const y = new MinYigin(); y.ekle(1); y.ekle(1); y.cikar(); return y.min(); })()", expected: 1 },
          { label: "20.000 işlem, 25 ms içinde", expr: "(() => { const y = new MinYigin(); let s = 0; for (let i = 20000; i > 0; i--) { y.ekle(i); s += y.min(); } return s; })()", expected: 200010000, maxMs: 25 }
        ],
        hints: ["min() her seferinde tüm yığını tararsa O(n) olur. Her elemanla birlikte 'o anki minimumu' saklasan?", "İkinci bir yığın tut: her ekleme anında geçerli minimum.", "ekle: this.minler.push(Math.min(x, this.min() ?? x)); cikar: iki yığından da pop."],
        solution: "class MinYigin {\n  constructor() {\n    this.veri = [];\n    this.minler = [];\n  }\n  ekle(x) {\n    this.veri.push(x);\n    const m = this.minler.length ? this.minler[this.minler.length - 1] : x;\n    this.minler.push(Math.min(x, m));\n  }\n  cikar() {\n    this.minler.pop();\n    return this.veri.pop();\n  }\n  ust() {\n    return this.veri[this.veri.length - 1];\n  }\n  min() {\n    return this.minler[this.minler.length - 1];\n  }\n}"
      },
      {
        id: "p35c3", kind: "Yaz", title: "Sonraki büyük eleman", fn: "sonrakiBuyuk", timeout: T,
        prompt: "`sonrakiBuyuk(dizi)` her eleman için sağında kalan **ilk daha büyük** elemanı veren bir dizi döndürsün; yoksa -1.",
        starter: "function sonrakiBuyuk(dizi) {\n  \n}\n",
        tests: [
          { args: [[2, 1, 2, 4, 3]], expected: [4, 2, 4, -1, -1] },
          { args: [[5, 4, 3]], expected: [-1, -1, -1] },
          { args: [[]], expected: [] },
          { label: "20.000 azalan eleman, 15 ms içinde", setup: "globalThis.__dz = Array.from({ length: 20000 }, (_, i) => 20000 - i);", expr: "sonrakiBuyuk(__dz).every((x) => x === -1)", expected: true, maxMs: 15 }
        ],
        hints: ["Her eleman için sağı taramak azalan dizide O(n²) olur. Cevabını henüz bulamamış elemanları bekletsen?", "Yığında cevabı bekleyen indeksleri tut. Yeni eleman, tepedeki daha küçük elemanların cevabıdır.", "while (yigin.length && dizi[yigin.at(-1)] < x) sonuc[yigin.pop()] = x; yigin.push(i);"],
        solution: "function sonrakiBuyuk(dizi) {\n  const sonuc = new Array(dizi.length).fill(-1);\n  const yigin = [];\n  for (let i = 0; i < dizi.length; i++) {\n    while (yigin.length && dizi[yigin[yigin.length - 1]] < dizi[i]) {\n      sonuc[yigin.pop()] = dizi[i];\n    }\n    yigin.push(i);\n  }\n  return sonuc;\n}"
      }
    ],
    cards: [
      { id: "p35k1", q: "Yığın ve kuyruk arasındaki fark?", a: "Yığın LIFO (son giren ilk çıkar), kuyruk FIFO (ilk giren ilk çıkar)." },
      { id: "p35k2", q: "JavaScript dizisinde shift neden dikkat ister?", a: "Tüm elemanları kaydırdığı için O(n). Büyük kuyruklarda baş indeksi tutmak daha iyidir." },
      { id: "p35k3", q: "Monoton yığın ne işe yarar?", a: "'Sonraki büyük/küçük eleman' türü sorularda her elemanı bir kez itip bir kez çıkararak O(n) çözüm verir." }
    ]
  },

  /* ============================ DERS 36 ============================ */
  {
    id: "p36", no: 36, track: "algo", title: "Özyineleme ve memoization", short: "Özyineleme",
    goal: "Problemi kendisinin küçük bir kopyasına indir; aynı alt problemi tekrar çözmemek için sonucu sakla.",
    concepts: ["temel durum", "özyinelemeli adım", "çağrı yığını", "memoization"],
    predict: {
      code: "function f(n) {\n  if (n === 0) return;\n  f(n - 1);\n  console.log(n);\n}\nf(3);",
      options: ["3 2 1", "1 2 3", "3", "Sonsuz döngü"], answer: 1,
      why: "console.log özyinelemeli çağrıdan SONRA. f(3) önce f(2)'yi, o da f(1)'i bekler. En içteki çağrı önce biter: 1, 2, 3."
    },
    example: {
      title: "Fibonacci: saf özyineleme ve memo",
      code: "let cagri = 0;\nfunction fibYavas(n) {\n  cagri++;\n  if (n < 2) return n;\n  return fibYavas(n - 1) + fibYavas(n - 2);\n}\n\nfunction fibHizli(n, memo = new Map()) {\n  if (n < 2) return n;\n  if (memo.has(n)) return memo.get(n);\n  const r = fibHizli(n - 1, memo) + fibHizli(n - 2, memo);\n  memo.set(n, r);\n  return r;\n}\n\nconsole.log(fibYavas(25), \"çağrı:\", cagri);\nconsole.log(fibHizli(80));",
      steps: [
        { lines: [4], text: "Temel durum: özyinelemenin durduğu yer. Unutursan çağrı yığını taşar." },
        { lines: [5], text: "Her çağrı iki çağrı doğurur: yaklaşık O(2ⁿ). fib(25) için 240 binden fazla çağrı." },
        { lines: [10, 12], text: "Memoization: bir kez hesaplanan sonucu sakla, tekrar sorulduğunda hazırdan ver." },
        { lines: [16, 17], text: "Her n bir kez hesaplanır: O(n). fib(80) anında gelir." }
      ]
    },
    challenges: [
      {
        id: "p36c1", kind: "Yaz", title: "Döngüsüz toplam", fn: "topla", timeout: T,
        prompt: "`topla(dizi)` dizideki sayıların toplamını **özyinelemeyle** döndürsün. `for`, `while` ve `reduce` kullanma.",
        starter: "function topla(dizi) {\n  \n}\n",
        tests: [
          { args: [[1, 2, 3]], expected: 6 },
          { args: [[]], expected: 0 },
          { args: [[10]], expected: 10 },
          { label: "döngü ya da reduce yok", expr: "!/\\bfor\\b|\\bwhile\\b|reduce/.test(topla.toString())", expected: true }
        ],
        hints: ["Temel durum ne? Boş dizinin toplamı kaç?", "Toplam = ilk eleman + geri kalanın toplamı.", "return dizi.length === 0 ? 0 : dizi[0] + topla(dizi.slice(1));"],
        solution: "function topla(dizi) {\n  if (dizi.length === 0) return 0;\n  return dizi[0] + topla(dizi.slice(1));\n}"
      },
      {
        id: "p36c2", kind: "Değiştir", title: "Hızlı Fibonacci", fn: "fib", timeout: T,
        prompt: "Başlangıçtaki `fib(n)` doğru ama üstel sürede çalışıyor. Memoization ekleyerek `fib(35)` **10 ms** içinde dönsün.",
        starter: "function fib(n) {\n  if (n < 2) return n;\n  return fib(n - 1) + fib(n - 2);\n}\n",
        tests: [
          { args: [0], expected: 0 },
          { args: [1], expected: 1 },
          { args: [10], expected: 55 },
          { label: "fib(35), 10 ms içinde", expr: "fib(35)", expected: 9227465, maxMs: 10 }
        ],
        hints: ["fib(35) hesaplanırken fib(30) kaç kez hesaplanıyor?", "Sonuçları fonksiyon dışında bir Map'te sakla.", "const memo = new Map(); fonksiyonun başında memo.has(n) ise memo.get(n) döndür."],
        solution: "const memo = new Map();\nfunction fib(n) {\n  if (n < 2) return n;\n  if (memo.has(n)) return memo.get(n);\n  const r = fib(n - 1) + fib(n - 2);\n  memo.set(n, r);\n  return r;\n}"
      },
      {
        id: "p36c3", kind: "Yaz", title: "Derin düzleştir", fn: "duzlestir", timeout: T,
        prompt: "`duzlestir(dizi)` iç içe dizileri her derinlikte açıp tek seviyeli yeni bir dizi döndürsün. `flat` kullanma.",
        starter: "function duzlestir(dizi) {\n  \n}\n",
        tests: [
          { args: [[1, [2, [3, [4]]], 5]], expected: [1, 2, 3, 4, 5] },
          { args: [[]], expected: [] },
          { args: [[[[]]]], expected: [] },
          { label: "flat kullanılmıyor", expr: "!/\\.flat\\(/.test(duzlestir.toString())", expected: true }
        ],
        hints: ["Bir eleman dizi ise ne yapmalısın? Dizi değilse?", "Array.isArray(x) ile kontrol et.", "for (const x of dizi) Array.isArray(x) ? sonuc.push(...duzlestir(x)) : sonuc.push(x);"],
        solution: "function duzlestir(dizi) {\n  const sonuc = [];\n  for (const x of dizi) {\n    if (Array.isArray(x)) sonuc.push(...duzlestir(x));\n    else sonuc.push(x);\n  }\n  return sonuc;\n}"
      }
    ],
    cards: [
      { id: "p36k1", q: "Her özyinelemeli fonksiyonun iki parçası?", a: "Temel durum (durma koşulu) ve problemi küçülten özyinelemeli adım." },
      { id: "p36k2", q: "Memoization nedir?", a: "Bir fonksiyonun aynı girdiler için ürettiği sonucu saklayıp tekrar hesaplamamak." },
      { id: "p36k3", q: "Saf özyinelemeli Fibonacci neden yavaş?", a: "Aynı alt problemleri tekrar tekrar çözer; çağrı sayısı üstel (≈2ⁿ) büyür." }
    ]
  },

  /* ============================ DERS 37 ============================ */
  {
    id: "p37", no: 37, track: "algo", title: "İkili arama", short: "İkili arama",
    goal: "Sıralı veride her adımda arama alanını yarıya indirerek O(log n) sürede bul.",
    concepts: ["sıralı veri", "sol, sağ, orta", "O(log n)", "sınır arama"],
    predict: {
      code: "// 1.000.000 elemanlı sıralı bir dizide ikili arama\n// en kötü durumda kaç karşılaştırma yapar?",
      options: ["Yaklaşık 20", "Yaklaşık 1.000", "Yaklaşık 500.000", "1.000.000"], answer: 0,
      why: "Her adım alanı yarıya indirir: 2²⁰ ≈ 1.048.576. Yani en fazla yaklaşık 20 adım. Doğrusal arama ise 1 milyon adım sürebilir.",
      run: false
    },
    example: {
      title: "Adım adım ikili arama",
      code: "function ara(d, hedef) {\n  let sol = 0, sag = d.length - 1, adim = 0;\n  while (sol <= sag) {\n    adim++;\n    const orta = (sol + sag) >> 1;\n    if (d[orta] === hedef) { console.log(\"adım:\", adim); return orta; }\n    if (d[orta] < hedef) sol = orta + 1;\n    else sag = orta - 1;\n  }\n  return -1;\n}\n\nconst d = Array.from({ length: 1000000 }, (_, i) => i * 3);\nconsole.log(ara(d, 2999997));",
      steps: [
        { lines: [2], text: "Arama alanı [sol, sag] aralığıdır." },
        { lines: [5], text: "Ortayı seç. >> 1, 2'ye bölüp aşağı yuvarlar." },
        { lines: [7, 8], text: "Hedef ortadan büyükse sol yarıyı tamamen ele: sol = orta + 1. Küçükse sağ yarıyı." },
        { lines: [3], text: "sol <= sag koşulu tek elemanlı aralığı da kontrol eder. Bu sınırları karıştırmak en sık hatadır." }
      ]
    },
    challenges: [
      {
        id: "p37c1", kind: "Yaz", title: "İkili ara", fn: "ikiliAra", timeout: T,
        prompt: "`ikiliAra(dizi, hedef)` sıralı dizide hedefin indeksini, yoksa -1 döndürsün. `indexOf`, `includes` ve `findIndex` kullanma.",
        starter: "function ikiliAra(dizi, hedef) {\n  \n}\n",
        tests: [
          { args: [[1, 3, 5, 7, 9], 7], expected: 3 },
          { args: [[1, 3, 5, 7, 9], 4], expected: -1 },
          { args: [[], 1], expected: -1 },
          { args: [[2], 2], expected: 0 },
          { label: "hazır arama metodu yok", expr: "!/indexOf|includes|findIndex/.test(ikiliAra.toString())", expected: true },
          { label: "100.000 eleman içinde 2.000 arama, 15 ms içinde", setup: "globalThis.__s = Array.from({ length: 100000 }, (_, i) => i * 2);", expr: "(() => { let n = 0; for (let i = 0; i < 2000; i++) if (ikiliAra(__s, i * 97) >= 0) n++; return n; })()", expected: 1000, maxMs: 15 }
        ],
        hints: ["Örnekteki ara fonksiyonunu ezberden yazmayı dene.", "while (sol <= sag) { const orta = (sol + sag) >> 1; … }", "Eşitse orta'yı döndür; küçükse sol = orta + 1; büyükse sag = orta - 1."],
        solution: "function ikiliAra(dizi, hedef) {\n  let sol = 0, sag = dizi.length - 1;\n  while (sol <= sag) {\n    const orta = (sol + sag) >> 1;\n    if (dizi[orta] === hedef) return orta;\n    if (dizi[orta] < hedef) sol = orta + 1;\n    else sag = orta - 1;\n  }\n  return -1;\n}"
      },
      {
        id: "p37c2", kind: "Yaz", title: "İlk konum", fn: "ilkKonum", timeout: T,
        prompt: "`ilkKonum(dizi, hedef)` tekrar eden elemanlar içeren sıralı dizide hedefin **ilk** indeksini döndürsün; yoksa -1. O(log n) olmalı.",
        starter: "function ilkKonum(dizi, hedef) {\n  \n}\n",
        tests: [
          { args: [[1, 2, 2, 2, 3], 2], expected: 1 },
          { args: [[2, 2, 2], 2], expected: 0 },
          { args: [[1, 3, 5], 4], expected: -1 },
          { label: "200.000 kopya, 1.000 arama, 15 ms içinde", setup: "globalThis.__k = new Array(200000).fill(7);", expr: "(() => { let s = 0; for (let i = 0; i < 1000; i++) s += ilkKonum(__k, 7); return s; })()", expected: 0, maxMs: 15 }
        ],
        hints: ["Hedefi bulunca hemen durursan ilk konumu kaçırabilirsin. Bulunca ne yapmalısın?", "Bulduğun indeksi aday olarak kaydet ve aramaya sol yarıda devam et.", "if (dizi[orta] >= hedef) { if (dizi[orta] === hedef) sonuc = orta; sag = orta - 1; } else sol = orta + 1;"],
        solution: "function ilkKonum(dizi, hedef) {\n  let sol = 0, sag = dizi.length - 1, sonuc = -1;\n  while (sol <= sag) {\n    const orta = (sol + sag) >> 1;\n    if (dizi[orta] >= hedef) {\n      if (dizi[orta] === hedef) sonuc = orta;\n      sag = orta - 1;\n    } else sol = orta + 1;\n  }\n  return sonuc;\n}"
      },
      {
        id: "p37c3", kind: "Yaz", title: "Tam karekök", fn: "tamKarekok", timeout: T,
        prompt: "`tamKarekok(n)` negatif olmayan tam sayının karekökünü aşağı yuvarlanmış olarak döndürsün. `Math.sqrt`, `Math.pow` ve `**` kullanma: cevap aralığında ikili arama yap.",
        starter: "function tamKarekok(n) {\n  \n}\n",
        tests: [
          { args: [0], expected: 0 },
          { args: [1], expected: 1 },
          { args: [8], expected: 2 },
          { args: [16], expected: 4 },
          { args: [2147395599], expected: 46339 },
          { label: "hazır fonksiyon yok", expr: "!/Math\\.sqrt|Math\\.pow|\\*\\*/.test(tamKarekok.toString())", expected: true }
        ],
        hints: ["Cevap 0 ile n arasında. x * x ≤ n olan en büyük x'i arıyorsun.", "Sıralı bir dizi yok ama sıralı bir 'cevap aralığı' var. Orta değerin karesine bak.", "orta * orta <= n ise sonuc = orta; sol = orta + 1; değilse sag = orta - 1."],
        solution: "function tamKarekok(n) {\n  let sol = 0, sag = n, sonuc = 0;\n  while (sol <= sag) {\n    const orta = Math.floor((sol + sag) / 2);\n    if (orta * orta <= n) {\n      sonuc = orta;\n      sol = orta + 1;\n    } else sag = orta - 1;\n  }\n  return sonuc;\n}"
      }
    ],
    cards: [
      { id: "p37k1", q: "İkili aramanın ön koşulu ve karmaşıklığı?", a: "Veri sıralı olmalı (ya da cevap aralığı monoton). O(log n)." },
      { id: "p37k2", q: "Tekrarlı dizide ilk konumu bulmak için ne değişir?", a: "Hedefi bulunca durmaz, adayı kaydedip sol yarıda aramaya devam edersin." },
      { id: "p37k3", q: "'Cevap üzerinde ikili arama' ne demek?", a: "Dizi yerine olası cevap aralığında arama: koşul bir noktadan sonra hep doğru/yanlışsa uygulanabilir." }
    ]
  },

  /* ============================ DERS 38 ============================ */
  {
    id: "p38", no: 38, track: "algo", title: "Sıralama", short: "Sıralama",
    goal: "Böl ve yönet fikriyle O(n log n) sıralama yaz; sıralamayı diğer problemlerin ilk adımı olarak kullan.",
    concepts: ["merge sort", "böl ve yönet", "karşılaştırma fonksiyonu", "aralıklar"],
    predict: {
      code: "console.log([10, 9, 1].sort());",
      options: ["[1, 9, 10]", "[1, 10, 9]", "[10, 9, 1]", "[9, 10, 1]"], answer: 1,
      why: "Varsayılan sort elemanları metne çevirip karşılaştırır: \"1\" < \"10\" < \"9\". Sayılar için karşılaştırma fonksiyonu ver: sort((a, b) => a - b)."
    },
    example: {
      title: "Merge sort",
      code: "function mergeSort(d) {\n  if (d.length <= 1) return d;\n  const orta = d.length >> 1;\n  const sol = mergeSort(d.slice(0, orta));\n  const sag = mergeSort(d.slice(orta));\n  const r = [];\n  let i = 0, j = 0;\n  while (i < sol.length && j < sag.length) r.push(sol[i] <= sag[j] ? sol[i++] : sag[j++]);\n  return r.concat(sol.slice(i), sag.slice(j));\n}\n\nconsole.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));",
      steps: [
        { lines: [2], text: "Tek elemanlı dizi zaten sıralıdır: temel durum." },
        { lines: [3, 4, 5], text: "Böl: iki yarıyı ayrı ayrı sırala. Bölünme log n seviye sürer." },
        { lines: [6, 7, 8, 9], text: "Yönet: iki sıralı yarıyı birleştir (Ders 33). Her seviyede toplam O(n) iş." },
        { lines: [12], text: "Toplam O(n log n). Kabarcık sıralaması O(n²)'dir." }
      ]
    },
    challenges: [
      {
        id: "p38c1", kind: "Yaz", title: "Kendi sıralaman", fn: "sirala", timeout: T,
        prompt: "`sirala(dizi)` sayıları küçükten büyüğe sıralanmış **yeni** bir dizi döndürsün; orijinali değiştirmesin. `sort` kullanma. 20.000 eleman **60 ms** içinde sıralanmalı.",
        starter: "function sirala(dizi) {\n  \n}\n",
        tests: [
          { args: [[5, 2, 9, 1, 5, 6]], expected: [1, 2, 5, 5, 6, 9] },
          { args: [[]], expected: [] },
          { args: [[-3, 10, 0]], expected: [-3, 0, 10] },
          { label: "orijinal dizi değişmez", expr: "(() => { const d = [3, 1, 2]; sirala(d); return d; })()", expected: [3, 1, 2] },
          { label: "sort kullanılmıyor", expr: "!/\\.sort\\(/.test(sirala.toString())", expected: true },
          { label: "20.000 eleman, 60 ms içinde", setup: "globalThis.__r = Array.from({ length: 20000 }, (_, i) => (i * 7919) % 20011);", expr: "(() => { const r = sirala(__r); if (r.length !== __r.length) return false; for (let i = 1; i < r.length; i++) if (r[i - 1] > r[i]) return false; return true; })()", expected: true, maxMs: 60 }
        ],
        hints: ["İç içe döngüyle sıralama 20.000 elemanda çok yavaş kalır. Örnekteki fikri kullan.", "Diziyi ikiye böl, her yarıyı özyinelemeyle sırala, sonra birleştir.", "Temel durum: if (dizi.length <= 1) return dizi.slice();"],
        solution: "function sirala(dizi) {\n  if (dizi.length <= 1) return dizi.slice();\n  const orta = dizi.length >> 1;\n  const sol = sirala(dizi.slice(0, orta));\n  const sag = sirala(dizi.slice(orta));\n  const r = [];\n  let i = 0, j = 0;\n  while (i < sol.length && j < sag.length) r.push(sol[i] <= sag[j] ? sol[i++] : sag[j++]);\n  while (i < sol.length) r.push(sol[i++]);\n  while (j < sag.length) r.push(sag[j++]);\n  return r;\n}"
      },
      {
        id: "p38c2", kind: "Yaz", title: "En sık k eleman", fn: "enSikK", timeout: T,
        prompt: "`enSikK(dizi, k)` en sık geçen `k` elemanı döndürsün: sıklığa göre azalan, eşitlikte değere göre artan sırada.",
        starter: "function enSikK(dizi, k) {\n  \n}\n",
        tests: [
          { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
          { args: [[4, 4, 2, 2, 3], 2], expected: [2, 4] },
          { args: [[7], 1], expected: [7] }
        ],
        hints: ["İki adım: say (Ders 32), sonra sırala.", "[...sayim.entries()] ile [değer, adet] çiftleri al.", "sort((a, b) => b[1] - a[1] || a[0] - b[0]) ve ilk k tanesinin değerini al."],
        solution: "function enSikK(dizi, k) {\n  const sayim = new Map();\n  for (const x of dizi) sayim.set(x, (sayim.get(x) || 0) + 1);\n  return [...sayim.entries()]\n    .sort((a, b) => b[1] - a[1] || a[0] - b[0])\n    .slice(0, k)\n    .map(([deger]) => deger);\n}"
      },
      {
        id: "p38c3", kind: "Yaz", title: "Aralıkları birleştir", fn: "araliklariBirlestir", timeout: T,
        prompt: "`araliklariBirlestir(araliklar)` çakışan `[başlangıç, bitiş]` aralıklarını birleştirip başlangıca göre sıralı döndürsün. Uç uca değenler de birleşir.",
        starter: "function araliklariBirlestir(araliklar) {\n  \n}\n",
        tests: [
          { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
          { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
          { args: [[[8, 10], [1, 3], [2, 6]]], expected: [[1, 6], [8, 10]] },
          { args: [[[1, 10], [2, 3]]], expected: [[1, 10]] },
          { args: [[]], expected: [] }
        ],
        hints: ["Aralıklar karışık gelebilir. Önce ne yapmalısın?", "Başlangıca göre sıraladıktan sonra her aralık ya son birleşik aralığa eklenir ya da yeni bir aralık başlatır.", "if (a[0] <= son[1]) son[1] = Math.max(son[1], a[1]); else sonuc.push([...a]);"],
        solution: "function araliklariBirlestir(araliklar) {\n  const s = araliklar.map((a) => [...a]).sort((a, b) => a[0] - b[0]);\n  const sonuc = [];\n  for (const a of s) {\n    const son = sonuc[sonuc.length - 1];\n    if (son && a[0] <= son[1]) son[1] = Math.max(son[1], a[1]);\n    else sonuc.push(a);\n  }\n  return sonuc;\n}"
      }
    ],
    cards: [
      { id: "p38k1", q: "[10, 9, 1].sort() neden yanlış sıralar?", a: "Varsayılan sort metin karşılaştırması yapar. Sayılar için (a, b) => a - b ver." },
      { id: "p38k2", q: "Merge sort'un karmaşıklığı ve fikri?", a: "O(n log n). Böl (yarıla, özyinelemeyle sırala) ve yönet (iki sıralı yarıyı birleştir)." },
      { id: "p38k3", q: "Birden fazla ölçüte göre sıralama nasıl yazılır?", a: "Karşılaştırmaları || ile zincirle: (a, b) => b.adet - a.adet || a.ad.localeCompare(b.ad)" }
    ]
  },

  /* ============================ DERS 39 ============================ */
  {
    id: "p39", no: 39, track: "algo", title: "Bağlı listeler", short: "Bağlı liste",
    goal: "Düğümlerin birbirini işaret ettiği yapıları işaretçileri dikkatle güncelleyerek yönet.",
    concepts: ["düğüm: değer + sonraki", "işaretçi güncelleme", "hızlı ve yavaş işaretçi", "döngü tespiti"],
    predict: {
      code: "const c = { deger: 3, sonraki: null };\nconst b = { deger: 2, sonraki: c };\nconst a = { deger: 1, sonraki: b };\nlet d = a, toplam = 0;\nwhile (d) {\n  toplam += d.deger;\n  d = d.sonraki;\n}\nconsole.log(toplam);",
      options: ["1", "3", "6", "Sonsuz döngü"], answer: 2,
      why: "Her düğüm bir değer ve sonraki düğüme işaret tutar. Son düğümün sonraki'si null olduğunda döngü biter: 1 + 2 + 3 = 6."
    },
    example: {
      title: "Listede dolaşmak ve eleman eklemek",
      code: "const liste = { deger: 1, sonraki: { deger: 3, sonraki: null } };\n\nfunction araya(oncekiDugum, deger) {\n  const yeni = { deger, sonraki: oncekiDugum.sonraki };\n  oncekiDugum.sonraki = yeni;\n}\n\naraya(liste, 2);\n\nconst degerler = [];\nfor (let d = liste; d; d = d.sonraki) degerler.push(d.deger);\nconsole.log(degerler);",
      steps: [
        { lines: [1], text: "Bağlı liste dizi değildir: her düğüm sadece bir sonrakini bilir. İndeksle erişim yoktur." },
        { lines: [4], text: "Yeni düğüm önce eski bağlantıyı devralır." },
        { lines: [5], text: "Sonra önceki düğüm yeni düğümü işaret eder. Sıra ters olsaydı listenin geri kalanı kaybolurdu." },
        { lines: [10, 11], text: "Araya ekleme O(1); dolaşmak O(n). Dizide araya eklemek ise O(n)'dir." }
      ]
    },
    challenges: [
      {
        id: "p39c1", kind: "Yaz", title: "Listeyi ters çevir", fn: "tersCevir", timeout: T,
        prompt: "`tersCevir(bas)` bağlı listeyi **yerinde** ters çevirip yeni başı döndürsün. Düğüm: `{ deger, sonraki }`. Boş liste `null`.",
        starter: "function tersCevir(bas) {\n  \n}\n",
        tests: [
          { label: "[1, 2, 3] → [3, 2, 1]", expr: `(() => { ${LIST} return A(tersCevir(L([1, 2, 3]))); })()`, expected: [3, 2, 1] },
          { label: "tek düğüm", expr: `(() => { ${LIST} return A(tersCevir(L([7]))); })()`, expected: [7] },
          { label: "boş liste", expr: "tersCevir(null)", expected: null },
          { label: "yeni dizi oluşturmadan", expr: `(() => { ${LIST} const h = L([1, 2]); const ikinci = h.sonraki; return tersCevir(h) === ikinci; })()`, expected: true }
        ],
        hints: ["Her düğümün sonraki işaretini bir öncekine çevirmen gerek. Hangi bilgileri aynı anda tutmalısın?", "let onceki = null, simdiki = bas; while (simdiki) { … }", "const sonraki = simdiki.sonraki; simdiki.sonraki = onceki; onceki = simdiki; simdiki = sonraki; — sonunda onceki'yi döndür."],
        solution: "function tersCevir(bas) {\n  let onceki = null, simdiki = bas;\n  while (simdiki) {\n    const sonraki = simdiki.sonraki;\n    simdiki.sonraki = onceki;\n    onceki = simdiki;\n    simdiki = sonraki;\n  }\n  return onceki;\n}"
      },
      {
        id: "p39c2", kind: "Yaz", title: "Orta düğüm", fn: "ortaDugum", timeout: T,
        prompt: "`ortaDugum(bas)` listenin ortasındaki düğümün **değerini** döndürsün; çift uzunlukta ikinci ortayı seç. Listeyi tek geçişte dolaş.",
        starter: "function ortaDugum(bas) {\n  \n}\n",
        tests: [
          { label: "[1..5] → 3", expr: `(() => { ${LIST} return ortaDugum(L([1, 2, 3, 4, 5])); })()`, expected: 3 },
          { label: "[1..4] → 3", expr: `(() => { ${LIST} return ortaDugum(L([1, 2, 3, 4])); })()`, expected: 3 },
          { label: "tek düğüm", expr: `(() => { ${LIST} return ortaDugum(L([9])); })()`, expected: 9 }
        ],
        hints: ["Uzunluğu bilmeden ortayı bulabilir misin? İki kişi aynı anda yürüse, biri iki kat hızlı?", "yavas bir, hizli iki adım ilerler.", "while (hizli && hizli.sonraki) { yavas = yavas.sonraki; hizli = hizli.sonraki.sonraki; } return yavas.deger;"],
        solution: "function ortaDugum(bas) {\n  let yavas = bas, hizli = bas;\n  while (hizli && hizli.sonraki) {\n    yavas = yavas.sonraki;\n    hizli = hizli.sonraki.sonraki;\n  }\n  return yavas.deger;\n}"
      },
      {
        id: "p39c3", kind: "Yaz", title: "Döngü var mı?", fn: "donguVarMi", timeout: T,
        prompt: "`donguVarMi(bas)` listede bir düğüm daha önceki bir düğümü işaret ediyorsa (sonsuz döngü) `true` döndürsün. Bonus: ek bellek kullanmadan.",
        starter: "function donguVarMi(bas) {\n  \n}\n",
        tests: [
          { label: "döngülü liste", expr: `(() => { ${LIST} const h = L([1, 2, 3, 4]); h.sonraki.sonraki.sonraki.sonraki = h.sonraki; return donguVarMi(h); })()`, expected: true },
          { label: "döngüsüz liste", expr: `(() => { ${LIST} return donguVarMi(L([1, 2, 3])); })()`, expected: false },
          { label: "kendine dönen tek düğüm", expr: "(() => { const h = { deger: 1, sonraki: null }; h.sonraki = h; return donguVarMi(h); })()", expected: true },
          { label: "boş liste", expr: "donguVarMi(null)", expected: false }
        ],
        hints: ["Düğümün kendisini (değerini değil) bir Set'te saklayabilirsin. Ek bellek olmadan?", "Hızlı ve yavaş işaretçi: döngü varsa hızlı olan bir gün yavaşı arkadan yakalar.", "while (hizli && hizli.sonraki) { yavas = yavas.sonraki; hizli = hizli.sonraki.sonraki; if (yavas === hizli) return true; }"],
        solution: "function donguVarMi(bas) {\n  let yavas = bas, hizli = bas;\n  while (hizli && hizli.sonraki) {\n    yavas = yavas.sonraki;\n    hizli = hizli.sonraki.sonraki;\n    if (yavas === hizli) return true;\n  }\n  return false;\n}"
      }
    ],
    cards: [
      { id: "p39k1", q: "Bağlı listenin diziye göre artısı ve eksisi?", a: "Artı: bilinen bir düğümün yanına ekleme/silme O(1). Eksi: indeksle erişim yok, aramak O(n)." },
      { id: "p39k2", q: "Listeyi ters çevirirken neden sonraki düğümü önce saklarsın?", a: "simdiki.sonraki'yi değiştirdiğin anda listenin geri kalanına giden yol kaybolur." },
      { id: "p39k3", q: "Hızlı-yavaş işaretçi tekniği hangi sorularda kullanılır?", a: "Orta düğüm, döngü tespiti, sondan k'ıncı düğüm." }
    ]
  },

  /* ============================ DERS 40 ============================ */
  {
    id: "p40", no: 40, track: "algo", title: "Ağaçlar ve graflar", short: "Ağaç & graf",
    goal: "Hiyerarşik ve ağ şeklindeki veriyi derinlik öncelikli (DFS) ve genişlik öncelikli (BFS) arama ile dolaş.",
    concepts: ["ikili ağaç", "DFS (özyineleme)", "BFS (kuyruk)", "ziyaret edilenler"],
    predict: {
      code: "const N = (deger, sol = null, sag = null) => ({ deger, sol, sag });\nconst kok = N(1, N(2, N(4)), N(3));\n\nfunction dolas(d) {\n  if (!d) return;\n  console.log(d.deger);\n  dolas(d.sol);\n  dolas(d.sag);\n}\ndolas(kok);",
      options: ["1 2 3 4", "1 2 4 3", "4 2 3 1", "1 3 2 4"], answer: 1,
      why: "Derinlik öncelikli: önce düğüm, sonra sol alt ağacın tamamı, sonra sağ. 1 → 2 → 4 (2'nin solu) → 3. Seviye seviye (1 2 3 4) gezmek için BFS gerekir."
    },
    example: {
      title: "Genişlik öncelikli arama",
      code: "const graf = {\n  ev: [\"okul\", \"market\"],\n  okul: [\"kütüphane\"],\n  market: [\"kütüphane\", \"park\"],\n  kütüphane: [\"park\"],\n  park: []\n};\n\nfunction bfs(baslangic) {\n  const sira = [baslangic];\n  const gorulen = new Set([baslangic]);\n  for (let i = 0; i < sira.length; i++) {\n    for (const komsu of graf[sira[i]]) {\n      if (!gorulen.has(komsu)) {\n        gorulen.add(komsu);\n        sira.push(komsu);\n      }\n    }\n  }\n  return sira;\n}\n\nconsole.log(bfs(\"ev\"));",
      steps: [
        { lines: [1, 2, 3, 4, 5, 6, 7], text: "Komşuluk listesi: her düğümün gidebildiği düğümler." },
        { lines: [10, 12], text: "Kuyruk: önce eklenen önce işlenir. shift yerine indeksle ilerlemek O(1)'dir." },
        { lines: [11, 14, 15], text: "Ziyaret edilenleri işaretle: aksi halde döngülü graflarda sonsuza dek dönersin." },
        { lines: [22], text: "Sonuç başlangıca uzaklık sırasıyla gelir. Bu yüzden BFS en kısa yolu (kenar sayısı) bulur." }
      ]
    },
    challenges: [
      {
        id: "p40c1", kind: "Yaz", title: "Ağacın derinliği", fn: "derinlik", timeout: T,
        prompt: "`derinlik(kok)` ikili ağacın en uzun kökten yaprağa yolundaki düğüm sayısını döndürsün. Düğüm: `{ deger, sol, sag }`; boş ağaç 0.",
        starter: "function derinlik(kok) {\n  \n}\n",
        tests: [
          { label: "boş ağaç", expr: "derinlik(null)", expected: 0 },
          { label: "tek düğüm", expr: `(() => { ${TREE} return derinlik(N(1)); })()`, expected: 1 },
          { label: "derinlik 3", expr: `(() => { ${TREE} return derinlik(${AGAC}); })()`, expected: 3 },
          { label: "dengesiz ağaç", expr: `(() => { ${TREE} return derinlik(N(1, null, N(2, null, N(3, N(4))))); })()`, expected: 4 }
        ],
        hints: ["Bir ağacın derinliği, alt ağaçlarının derinliğiyle nasıl ilişkili?", "Temel durum: null → 0.", "return 1 + Math.max(derinlik(kok.sol), derinlik(kok.sag));"],
        solution: "function derinlik(kok) {\n  if (!kok) return 0;\n  return 1 + Math.max(derinlik(kok.sol), derinlik(kok.sag));\n}"
      },
      {
        id: "p40c2", kind: "Yaz", title: "Seviye seviye", fn: "seviyeSirasi", timeout: T,
        prompt: "`seviyeSirasi(kok)` her seviyedeki değerleri soldan sağa bir dizi olarak toplayıp döndürsün: `[[1], [2, 3], [4, 5]]`.",
        starter: "function seviyeSirasi(kok) {\n  \n}\n",
        tests: [
          { label: "üç seviye", expr: `(() => { ${TREE} return seviyeSirasi(${AGAC}); })()`, expected: [[1], [2, 3], [4, 5]] },
          { label: "boş ağaç", expr: "seviyeSirasi(null)", expected: [] },
          { label: "sadece sağ dallar", expr: `(() => { ${TREE} return seviyeSirasi(N(1, null, N(2, null, N(3)))); })()`, expected: [[1], [2], [3]] }
        ],
        hints: ["Seviye seviye gezmek hangi aramadır? Hangi yapıyı kullanır?", "Kuyruğu seviye seviye işle: döngünün başında kuyrukta tam olarak bir seviye vardır.", "while (seviye.length) { sonuc.push(seviye.map((d) => d.deger)); seviye = seviye.flatMap((d) => [d.sol, d.sag].filter(Boolean)); }"],
        solution: "function seviyeSirasi(kok) {\n  const sonuc = [];\n  let seviye = kok ? [kok] : [];\n  while (seviye.length) {\n    sonuc.push(seviye.map((d) => d.deger));\n    const sonraki = [];\n    for (const d of seviye) {\n      if (d.sol) sonraki.push(d.sol);\n      if (d.sag) sonraki.push(d.sag);\n    }\n    seviye = sonraki;\n  }\n  return sonuc;\n}"
      },
      {
        id: "p40c3", kind: "Yaz", title: "En kısa yol", fn: "enKisaYol", timeout: T,
        prompt: "`enKisaYol(graf, bas, son)` komşuluk listesiyle verilen yönlü grafta `bas`'tan `son`'a en az kaç kenarla gidildiğini döndürsün; yol yoksa -1. Graf döngü içerebilir.",
        starter: "function enKisaYol(graf, bas, son) {\n  \n}\n",
        tests: [
          { label: "A → F", expr: "enKisaYol({ A: [\"B\", \"C\"], B: [\"D\"], C: [\"D\", \"E\"], D: [\"F\"], E: [\"F\"], F: [] }, \"A\", \"F\")", expected: 3 },
          { label: "aynı düğüm", expr: "enKisaYol({ A: [\"B\"], B: [] }, \"A\", \"A\")", expected: 0 },
          { label: "ulaşılamaz", expr: "enKisaYol({ A: [\"B\"], B: [], C: [\"A\"] }, \"A\", \"C\")", expected: -1 },
          { label: "döngülü graf", expr: "enKisaYol({ A: [\"B\"], B: [\"A\", \"C\"], C: [] }, \"A\", \"C\")", expected: 2 }
        ],
        hints: ["En az kenar sayısını hangi arama garanti eder?", "Kuyrukta [düğüm, uzaklık] çiftleri tut ve ziyaret edilenleri bir Set'te işaretle.", "Bir komşu son ise uzaklık + 1 döndür; kuyruk biterse -1."],
        solution: "function enKisaYol(graf, bas, son) {\n  if (bas === son) return 0;\n  const sira = [[bas, 0]];\n  const gorulen = new Set([bas]);\n  for (let i = 0; i < sira.length; i++) {\n    const [dugum, uzaklik] = sira[i];\n    for (const komsu of graf[dugum] || []) {\n      if (komsu === son) return uzaklik + 1;\n      if (!gorulen.has(komsu)) {\n        gorulen.add(komsu);\n        sira.push([komsu, uzaklik + 1]);\n      }\n    }\n  }\n  return -1;\n}"
      }
    ],
    cards: [
      { id: "p40k1", q: "DFS ve BFS hangi yapıyı kullanır?", a: "DFS yığın (ya da özyineleme), BFS kuyruk." },
      { id: "p40k2", q: "Ağırlıksız grafta en kısa yolu hangi arama bulur, neden?", a: "BFS: düğümleri başlangıca uzaklık sırasıyla işler." },
      { id: "p40k3", q: "Grafta neden 'ziyaret edilenler' kümesi gerekir?", a: "Döngüler yüzünden aynı düğüme tekrar tekrar girip sonsuza dek dönmemek için." }
    ]
  }
  ];

  window.KD_CURRICULUM = (window.KD_CURRICULUM || []).concat(ALGO);
})();
