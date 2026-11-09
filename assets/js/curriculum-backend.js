/* QUAGEN NextGen — Müfredat: Backend ve veritabanı, Faz 41–50
 * JS görevleri worker'da çalışır. SQL görevleri (lang: "sql") gerçek SQLite (sql.js) üzerinde, her testte temiz
 * bir veritabanıyla çalışır. Faz 50'de JS kodu `sorgu(sql, params)` ve `calistir(sql, params)` ile veritabanına erişir.
 * SQL test biçimleri: { label, expected } (son sorgunun satırları) · { label, verify, expected } (öğrenci kodundan
 * sonra çalışan doğrulama sorgusu) · { label, fails } (reddedilmesi gereken komut) · { label, verify, contains } ·
 * { label, codeMatch } (kodda bulunması gereken ifade) · unordered: true (sıra önemsiz)
 */
(function () {
  const T = 15000;
  const SEED = `
CREATE TABLE ogrenciler (id INTEGER PRIMARY KEY, ad TEXT NOT NULL, sehir TEXT, yas INTEGER, kayit_tarihi TEXT);
CREATE TABLE kurslar (id INTEGER PRIMARY KEY, ad TEXT NOT NULL, kategori TEXT, sure INTEGER, fiyat INTEGER);
CREATE TABLE kayitlar (ogrenci_id INTEGER REFERENCES ogrenciler(id), kurs_id INTEGER REFERENCES kurslar(id), puan INTEGER, tarih TEXT, PRIMARY KEY (ogrenci_id, kurs_id));
INSERT INTO ogrenciler VALUES
 (1,'Ece','İzmir',24,'2026-01-05'),(2,'Can','Ankara',31,'2026-01-12'),(3,'Deniz','İstanbul',22,'2026-02-01'),
 (4,'Mert','İzmir',27,'2026-02-14'),(5,'Zeynep','İstanbul',35,'2026-03-03'),(6,'Ali','Ankara',19,'2026-03-20'),
 (7,'Elif','Bursa',29,'2026-04-02'),(8,'Kaan',NULL,41,'2026-04-15');
INSERT INTO kurslar VALUES
 (1,'JavaScript Temelleri','frontend',30,0),(2,'React','frontend',25,1200),(3,'Node.js','backend',28,1400),
 (4,'SQL','backend',18,900),(5,'Algoritmalar','temel',35,1500),(6,'CSS Grid','frontend',8,300);
INSERT INTO kayitlar VALUES
 (1,1,92,'2026-01-10'),(1,2,85,'2026-02-10'),(1,4,78,'2026-03-01'),(2,1,64,'2026-01-20'),(2,3,88,'2026-02-15'),
 (3,1,95,'2026-02-05'),(3,2,91,'2026-03-05'),(3,5,73,'2026-04-01'),(4,4,NULL,'2026-03-10'),(5,3,81,'2026-03-15'),
 (5,4,90,'2026-03-25'),(5,5,67,'2026-04-10'),(6,1,55,'2026-03-25'),(7,6,99,'2026-04-05');`;
  const SCHEMA = "ogrenciler(id, ad, sehir, yas, kayit_tarihi)\nkurslar(id, ad, kategori, sure, fiyat)\nkayitlar(ogrenci_id, kurs_id, puan, tarih)";
  const sql = (o) => Object.assign({ lang: "sql", setup: SEED, schema: SCHEMA, timeout: T, fn: "sorgu" }, o);
  const ROUTER = "function yolEslestir(kalip, yol) {\n  const a = kalip.split(\"/\").filter(Boolean), b = yol.split(\"/\").filter(Boolean);\n  if (a.length !== b.length) return null;\n  const params = {};\n  for (let i = 0; i < a.length; i++) {\n    if (a[i].startsWith(\":\")) params[a[i].slice(1)] = decodeURIComponent(b[i]);\n    else if (a[i] !== b[i]) return null;\n  }\n  return params;\n}\n";
  const B64 = "const b64url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\\+/g, \"-\").replace(/\\//g, \"_\").replace(/=+$/, \"\");\nconst b64urlCoz = (s) => Uint8Array.from(atob(s.replace(/-/g, \"+\").replace(/_/g, \"/\")), (c) => c.charCodeAt(0));\n";

  const BACKEND = [
  /* ============================ FAZ 41 ============================ */
  {
    id: "p41", no: 41, track: "backend", title: "HTTP ve REST", short: "HTTP & REST",
    goal: "Bir sunucunun isteği nasıl karşılayıp cevap ürettiğini, framework kullanmadan kendi yönlendiricinle anla.",
    concepts: ["istek ve yanıt", "metot ve yol", "durum kodları", "yol parametreleri"],
    predict: {
      code: "// İstemci GET /kurslar/999 istedi.\n// Böyle bir kurs veritabanında yok.\n// Sunucu hangi durum koduyla cevap vermeli?",
      options: ["200 OK", "400 Bad Request", "404 Not Found", "500 Internal Server Error"], answer: 2,
      why: "404, istenen kaynağın bulunmadığını söyler. 400 isteğin kendisi hatalıysa, 500 sunucu kendi içinde hata yaptıysa kullanılır. Doğru durum kodu, istemcinin ne yapacağına karar vermesini sağlar.",
      run: false
    },
    example: {
      title: "En küçük sunucu: bir fonksiyon",
      code: "const kurslar = [{ id: 1, ad: \"React\" }, { id: 2, ad: \"SQL\" }];\n\nfunction isle(istek) {\n  if (istek.metot === \"GET\" && istek.yol === \"/kurslar\") {\n    return { status: 200, body: kurslar };\n  }\n  const m = istek.yol.match(/^\\/kurslar\\/(\\d+)$/);\n  if (istek.metot === \"GET\" && m) {\n    const k = kurslar.find((x) => x.id === Number(m[1]));\n    return k ? { status: 200, body: k } : { status: 404, body: { hata: \"Kurs bulunamadı\" } };\n  }\n  return { status: 404, body: { hata: \"Bulunamadı\" } };\n}\n\nconsole.log(isle({ metot: \"GET\", yol: \"/kurslar/2\" }));\nconsole.log(isle({ metot: \"GET\", yol: \"/kurslar/9\" }));",
      steps: [
        { lines: [3], text: "Express, Fastify ya da Next.js API rotası: hepsinin özünde istek alıp yanıt döndüren bir fonksiyon vardır." },
        { lines: [4, 5, 6], text: "İstek iki şeyle tanımlanır: metot (GET, POST, PUT, DELETE) ve yol. REST'te yol kaynağı, metot eylemi anlatır." },
        { lines: [7, 8, 9, 10, 11], text: "Yolun bir parçası değişken olabilir: /kurslar/2. Bulunamazsa 404 ve açıklayıcı bir gövde döndür." },
        { lines: [13], text: "Hiçbir rota eşleşmezse yine 404. Bu fazda bu if zincirini genel bir yönlendiriciye dönüştüreceksin." }
      ]
    },
    challenges: [
      {
        id: "p41c1", kind: "Değiştir", title: "Yol eşleştirme", fn: "yolEslestir",
        prompt: "`yolEslestir(kalip, yol)`: kalıptaki `:ad` parçaları değişkendir. Eşleşirse parametre nesnesini (`{ id: \"42\" }`), eşleşmezse `null` döndür. Başlangıç kodu sadece birebir aynı yolları tanıyor.",
        starter: "function yolEslestir(kalip, yol) {\n  if (kalip === yol) return {};\n  return null;\n}\n",
        tests: [
          { args: ["/kurslar", "/kurslar"], expected: {} },
          { args: ["/kurslar/:id", "/kurslar/42"], expected: { id: "42" } },
          { args: ["/ogrenci/:oid/kurs/:kid", "/ogrenci/7/kurs/3"], expected: { oid: "7", kid: "3" } },
          { args: ["/kurslar/:id", "/kurslar"], expected: null },
          { args: ["/kurslar/:id", "/kurslar/1/yorumlar"], expected: null },
          { args: ["/kurslar/:ad", "/kurslar/node%20js"], expected: { ad: "node js" } }
        ],
        hints: ["İki yolu '/' ile parçalara ayırıp parça parça karşılaştırabilirsin.", "Parça sayıları farklıysa eşleşme yok. ':' ile başlayan parça her değeri kabul eder ve parametre olur.", "a[i].startsWith(\":\") ise params[a[i].slice(1)] = decodeURIComponent(b[i]); değilse a[i] !== b[i] ise null."],
        solution: ROUTER.trim()
      },
      {
        id: "p41c2", kind: "Yaz", title: "Yönlendirici", fn: "yonlendirici",
        prompt: "`yonlendirici(rotalar)` bir istek fonksiyonu döndürsün. Rota: `{ metot, yol, isle }`; `isle(istek, params)` yanıt döndürür. Yol eşleşmezse `404 { hata: \"Bulunamadı\" }`; yol eşleşip metot eşleşmezse `405 { hata: \"İzin verilmeyen metot\" }`.",
        starter: ROUTER + "\nfunction yonlendirici(rotalar) {\n  return (istek) => {\n    \n  };\n}\n",
        tests: [
          { label: "GET /kurslar", expr: "yonlendirici([{ metot: \"GET\", yol: \"/kurslar\", isle: () => ({ status: 200, body: [] }) }])({ metot: \"GET\", yol: \"/kurslar\" })", expected: { status: 200, body: [] } },
          { label: "parametreler isle'ye gider", expr: "yonlendirici([{ metot: \"GET\", yol: \"/kurslar/:id\", isle: (i, p) => ({ status: 200, body: p }) }])({ metot: \"GET\", yol: \"/kurslar/5\" })", expected: { status: 200, body: { id: "5" } } },
          { label: "yol yok → 404", expr: "yonlendirici([{ metot: \"GET\", yol: \"/kurslar\", isle: () => ({ status: 200 }) }])({ metot: \"GET\", yol: \"/yok\" })", expected: { status: 404, body: { hata: "Bulunamadı" } } },
          { label: "metot yanlış → 405", expr: "yonlendirici([{ metot: \"GET\", yol: \"/kurslar\", isle: () => ({ status: 200 }) }])({ metot: \"DELETE\", yol: \"/kurslar\" })", expected: { status: 405, body: { hata: "İzin verilmeyen metot" } } },
          { label: "aynı yolda iki metot", expr: "(() => { const r = yonlendirici([{ metot: \"GET\", yol: \"/k\", isle: () => ({ status: 200 }) }, { metot: \"POST\", yol: \"/k\", isle: () => ({ status: 201 }) }]); return [r({ metot: \"GET\", yol: \"/k\" }).status, r({ metot: \"POST\", yol: \"/k\" }).status]; })()", expected: [200, 201] }
        ],
        hints: ["404 ile 405'i ayırt etmek için 'yol herhangi bir rotayla eşleşti mi' bilgisini ayrıca tutman gerek.", "Her rota için params = yolEslestir(r.yol, istek.yol). params null değilse yol eşleşmiştir.", "Metot da eşleşiyorsa return r.isle(istek, params); döngü bitince yolEslesti ? 405 : 404."],
        solution: ROUTER + "\nfunction yonlendirici(rotalar) {\n  return (istek) => {\n    let yolEslesti = false;\n    for (const r of rotalar) {\n      const params = yolEslestir(r.yol, istek.yol);\n      if (!params) continue;\n      yolEslesti = true;\n      if (r.metot === istek.metot) return r.isle(istek, params);\n    }\n    return yolEslesti\n      ? { status: 405, body: { hata: \"İzin verilmeyen metot\" } }\n      : { status: 404, body: { hata: \"Bulunamadı\" } };\n  };\n}"
      },
      {
        id: "p41c3", kind: "Yaz", title: "Sorgu dizesi", fn: "urlAyristir",
        prompt: "`urlAyristir(url)` `\"/kurslar?seviye=orta&sayfa=2\"` gibi bir adresi `{ yol: \"/kurslar\", sorgu: { seviye: \"orta\", sayfa: \"2\" } }` biçimine çevirsin. `%20` ve `+` boşluğa dönüşsün; sorgu yoksa `sorgu: {}`.",
        starter: "function urlAyristir(url) {\n  \n}\n",
        tests: [
          { args: ["/kurslar?seviye=orta&sayfa=2"], expected: { yol: "/kurslar", sorgu: { seviye: "orta", sayfa: "2" } } },
          { args: ["/kurslar"], expected: { yol: "/kurslar", sorgu: {} } },
          { args: ["/ara?q=node+js&dil=t%C3%BCrk%C3%A7e"], expected: { yol: "/ara", sorgu: { q: "node js", dil: "türkçe" } } },
          { args: ["/a?bos="], expected: { yol: "/a", sorgu: { bos: "" } } }
        ],
        hints: ["Adresi '?' karakterinden ikiye ayır.", "Tarayıcının ve Node'un hazır bir sorgu dizesi ayrıştırıcısı var: URLSearchParams.", "const [yol, q = \"\"] = url.split(\"?\"); return { yol, sorgu: Object.fromEntries(new URLSearchParams(q)) };"],
        solution: "function urlAyristir(url) {\n  const i = url.indexOf(\"?\");\n  const yol = i === -1 ? url : url.slice(0, i);\n  const q = i === -1 ? \"\" : url.slice(i + 1);\n  return { yol, sorgu: Object.fromEntries(new URLSearchParams(q)) };\n}"
      }
    ],
    cards: [
      { id: "p41k1", q: "200, 201, 400, 401, 403, 404, 500 ne anlama gelir?", a: "200 başarılı, 201 oluşturuldu, 400 hatalı istek, 401 kimlik doğrulama gerekli, 403 yetki yok, 404 bulunamadı, 500 sunucu hatası." },
      { id: "p41k2", q: "REST'te yol ve metot neyi anlatır?", a: "Yol kaynağı (/kurslar/5), metot eylemi (GET oku, POST oluştur, PUT/PATCH güncelle, DELETE sil)." },
      { id: "p41k3", q: "404 ile 405 farkı?", a: "404: böyle bir kaynak/yol yok. 405: yol var ama bu metot desteklenmiyor." }
    ]
  },

  /* ============================ FAZ 42 ============================ */
  {
    id: "p42", no: 42, track: "backend", title: "Doğrulama ve ara katmanlar", short: "Doğrulama",
    goal: "Sunucuya gelen veriye asla güvenme; isteği doğrulayan, yetkilendiren ve kaydeden zincirler kur.",
    concepts: ["girdi doğrulama", "middleware zinciri", "kimlik ve yetki", "401 ve 403"],
    predict: {
      code: "const kayit = [];\nconst a = (istek, sonraki) => { kayit.push(\"a1\"); const y = sonraki(); kayit.push(\"a2\"); return y; };\nconst b = (istek, sonraki) => { kayit.push(\"b1\"); const y = sonraki(); kayit.push(\"b2\"); return y; };\nconst son = () => { kayit.push(\"işle\"); return 200; };\n\na({}, () => b({}, son));\nconsole.log(kayit.join(\" \"));",
      options: ["a1 a2 b1 b2 işle", "a1 b1 işle b2 a2", "işle b1 b2 a1 a2", "a1 b1 b2 a2 işle"], answer: 1,
      why: "Her ara katman sonrakini çağırır ve onun bitmesini bekler. İstek içeri doğru a → b → işle akar, yanıt dışarı doğru b → a döner. Express ve Koa bu 'soğan' modeline dayanır."
    },
    example: {
      title: "Ara katman zinciri",
      code: "function zincir(...katmanlar) {\n  return (istek) => {\n    let i = 0;\n    const sonraki = () => {\n      const k = katmanlar[i++];\n      return k ? k(istek, sonraki) : { status: 404 };\n    };\n    return sonraki();\n  };\n}\n\nconst kaydet = (istek, sonraki) => { console.log(istek.metot, istek.yol); return sonraki(); };\nconst cevap = () => ({ status: 200, body: \"merhaba\" });\n\nconsole.log(zincir(kaydet, cevap)({ metot: \"GET\", yol: \"/\" }));",
      steps: [
        { lines: [1, 2], text: "Zincir, katmanları sırayla çalıştıran tek bir istek fonksiyonu üretir." },
        { lines: [4, 5, 6], text: "sonraki, sıradaki katmanı çağırır. Katman sonraki()'yi çağırmazsa zincir orada durur: yetkisiz isteği reddetmek böyledir." },
        { lines: [12], text: "Kayıt tutan katman isteğe dokunmadan geçirir." },
        { lines: [15], text: "Doğrulama, kimlik ve yetki kontrolü, hız sınırlama: hepsi aynı kalıpta yazılır." }
      ]
    },
    challenges: [
      {
        id: "p42c1", kind: "Yaz", title: "Şema ile doğrulama", fn: "dogrula",
        prompt: "`dogrula(govde, sema)` hata mesajlarını şemadaki alan sırasıyla dizi olarak döndürsün (her alan için en fazla bir hata). Kurallar: eksik + `zorunlu` → `\"ALAN zorunlu\"`; yanlış tip → `\"ALAN metin olmalı\"` / `\"ALAN sayı olmalı\"`; metinde `min`/`max` karakter → `\"ALAN en az N karakter\"` / `\"ALAN en fazla N karakter\"`; sayıda `min`/`max` → `\"ALAN en az N\"` / `\"ALAN en fazla N\"`. Zorunlu olmayan eksik alan atlanır.",
        starter: "function dogrula(govde, sema) {\n  const hatalar = [];\n  \n  return hatalar;\n}\n",
        tests: [
          { label: "geçerli gövde", expr: "dogrula({ ad: \"Ece\", yas: 24 }, { ad: { tip: \"string\", zorunlu: true, min: 2 }, yas: { tip: \"number\", min: 12 } })", expected: [] },
          { label: "eksik zorunlu alan", expr: "dogrula({}, { ad: { tip: \"string\", zorunlu: true } })", expected: ["ad zorunlu"] },
          { label: "yanlış tip", expr: "dogrula({ ad: \"Ece\", yas: \"yirmi\" }, { ad: { tip: \"string\" }, yas: { tip: \"number\" } })", expected: ["yas sayı olmalı"] },
          { label: "sınırlar", expr: "dogrula({ ad: \"E\", yas: 200, bio: \"x\".repeat(5) }, { ad: { tip: \"string\", min: 2 }, yas: { tip: \"number\", max: 120 }, bio: { tip: \"string\", max: 4 } })", expected: ["ad en az 2 karakter", "yas en fazla 120", "bio en fazla 4 karakter"] },
          { label: "zorunlu olmayan eksik alan", expr: "dogrula({ ad: \"Ali\" }, { ad: { tip: \"string\" }, yas: { tip: \"number\", min: 12 } })", expected: [] }
        ],
        hints: ["Şemanın alanlarını for...of Object.entries(sema) ile sırayla dolaş.", "Önce yokluk (undefined), sonra tip, sonra sınır kontrolü. Bir hata bulunca o alan için continue.", "Mesajdaki tip adı için küçük bir sözlük: { string: \"metin\", number: \"sayı\" }."],
        solution: "function dogrula(govde, sema) {\n  const hatalar = [];\n  const ad = { string: \"metin\", number: \"sayı\" };\n  for (const [alan, k] of Object.entries(sema)) {\n    const v = govde[alan];\n    if (v === undefined) { if (k.zorunlu) hatalar.push(`${alan} zorunlu`); continue; }\n    if (typeof v !== k.tip) { hatalar.push(`${alan} ${ad[k.tip]} olmalı`); continue; }\n    const olcu = k.tip === \"string\" ? v.length : v;\n    const ek = k.tip === \"string\" ? \" karakter\" : \"\";\n    if (k.min !== undefined && olcu < k.min) hatalar.push(`${alan} en az ${k.min}${ek}`);\n    else if (k.max !== undefined && olcu > k.max) hatalar.push(`${alan} en fazla ${k.max}${ek}`);\n  }\n  return hatalar;\n}"
      },
      {
        id: "p42c2", kind: "Yaz", title: "Ara katman zinciri", fn: "zincir",
        prompt: "`zincir(...katmanlar)` bir istek fonksiyonu döndürsün. Her katman `(istek, sonraki) => yanıt`. Son katman da `sonraki()` çağırırsa `{ status: 404 }` dönsün. Örneği kapatıp kendin yaz.",
        starter: "function zincir(...katmanlar) {\n  \n}\n",
        tests: [
          { label: "sıra: soğan modeli", expr: "(() => { const k = []; const a = (i, s) => { k.push(\"a1\"); const y = s(); k.push(\"a2\"); return y; }; const b = (i, s) => { k.push(\"b\"); return s(); }; zincir(a, b, () => { k.push(\"son\"); return 1; })({}); return k; })()", expected: ["a1", "b", "son", "a2"] },
          { label: "katman durdurabilir", expr: "zincir(() => ({ status: 401 }), () => ({ status: 200 }))({})", expected: { status: 401 } },
          { label: "istek katmanlar arasında paylaşılır", expr: "zincir((i, s) => { i.kullanici = \"ece\"; return s(); }, (i) => ({ status: 200, body: i.kullanici }))({})", expected: { status: 200, body: "ece" } },
          { label: "zincir sonu → 404", expr: "zincir((i, s) => s())({})", expected: { status: 404 } }
        ],
        hints: ["Hangi katmanda olduğunu bir sayaçta tut.", "sonraki fonksiyonu sayaçtaki katmanı çağırıp sayacı artırır; katman kalmadıysa 404 döndürür.", "return (istek) => { let i = 0; const sonraki = () => { const k = katmanlar[i++]; return k ? k(istek, sonraki) : { status: 404 }; }; return sonraki(); };"],
        solution: "function zincir(...katmanlar) {\n  return (istek) => {\n    let i = 0;\n    const sonraki = () => {\n      const k = katmanlar[i++];\n      return k ? k(istek, sonraki) : { status: 404 };\n    };\n    return sonraki();\n  };\n}"
      },
      {
        id: "p42c3", kind: "Yaz", title: "Yetki katmanı", fn: "yetkiGerekli",
        prompt: "`yetkiGerekli(roller)` bir ara katman döndürsün: `istek.kullanici` yoksa `401 { hata: \"Giriş gerekli\" }`, kullanıcının `rol`'ü `roller` içinde değilse `403 { hata: \"Yetkin yok\" }`, aksi halde `sonraki()`.",
        starter: "function yetkiGerekli(roller) {\n  return (istek, sonraki) => {\n    \n  };\n}\n",
        tests: [
          { label: "giriş yok → 401", expr: "yetkiGerekli([\"admin\"])({}, () => ({ status: 200 }))", expected: { status: 401, body: { hata: "Giriş gerekli" } } },
          { label: "rol uygun değil → 403", expr: "yetkiGerekli([\"admin\"])({ kullanici: { rol: \"ogrenci\" } }, () => ({ status: 200 }))", expected: { status: 403, body: { hata: "Yetkin yok" } } },
          { label: "rol uygun → devam", expr: "yetkiGerekli([\"admin\", \"mentor\"])({ kullanici: { rol: \"mentor\" } }, () => ({ status: 200 }))", expected: { status: 200 } }
        ],
        hints: ["401 ile 403'ü ayır: kim olduğunu bilmiyoruz mu, yoksa biliyoruz ama izni yok mu?", "if (!istek.kullanici) return { status: 401, … };", "if (!roller.includes(istek.kullanici.rol)) return { status: 403, … }; return sonraki();"],
        solution: "function yetkiGerekli(roller) {\n  return (istek, sonraki) => {\n    if (!istek.kullanici) return { status: 401, body: { hata: \"Giriş gerekli\" } };\n    if (!roller.includes(istek.kullanici.rol)) return { status: 403, body: { hata: \"Yetkin yok\" } };\n    return sonraki();\n  };\n}"
      }
    ],
    cards: [
      { id: "p42k1", q: "401 ile 403 arasındaki fark?", a: "401: kim olduğunu bilmiyoruz (giriş gerekli). 403: kim olduğunu biliyoruz ama bu işleme yetkin yok." },
      { id: "p42k2", q: "Sunucu neden istemcinin doğruladığı veriyi tekrar doğrular?", a: "İstemci kodu atlanabilir ya da değiştirilebilir. Sunucuya gelen her veri güvenilmez kabul edilir." },
      { id: "p42k3", q: "Ara katman (middleware) zinciri nasıl çalışır?", a: "Her katman isteği alır, isterse sonraki()'yi çağırıp yanıtı bekler, isterse zinciri durdurup kendisi yanıt verir." }
    ]
  },

  /* ============================ FAZ 43 ============================ */
  {
    id: "p43", no: 43, track: "backend", title: "Kimlik doğrulama ve güvenlik", short: "Güvenlik",
    goal: "Parolaları doğru saklamayı ve imzalı oturum belirteçleri üretmeyi Web Crypto ile öğren.",
    concepts: ["özet (hash)", "tuz ve PBKDF2", "HMAC imzası", "belirteç doğrulama"],
    predict: {
      code: "// İki kullanıcının parolası da \"123456\".\n// Veritabanında parolalar tuzsuz SHA-256 özeti olarak saklanıyor.\n// Veritabanı sızarsa saldırgan ne görür?",
      options: ["İki farklı özet", "İki aynı özet", "Parolaların kendisi", "Hiçbir şey"], answer: 1,
      why: "Özet fonksiyonu deterministiktir: aynı girdi, aynı çıktı. Aynı özetler aynı parolayı ele verir ve hazır tablolarla çözülebilir. Bu yüzden her kullanıcıya rastgele bir tuz eklenir ve kasıtlı olarak yavaş bir fonksiyon (PBKDF2, bcrypt, Argon2) kullanılır.",
      run: false
    },
    example: {
      title: "Web Crypto ile SHA-256",
      code: "async function sha256Hex(metin) {\n  const veri = new TextEncoder().encode(metin);\n  const ozet = await crypto.subtle.digest(\"SHA-256\", veri);\n  return [...new Uint8Array(ozet)].map((b) => b.toString(16).padStart(2, \"0\")).join(\"\");\n}\n\nsha256Hex(\"kodera\").then(console.log);\nsha256Hex(\"QUAGEN\").then(console.log);",
      steps: [
        { lines: [2], text: "Kriptografi baytlarla çalışır. TextEncoder metni UTF-8 baytlarına çevirir." },
        { lines: [3], text: "crypto.subtle tarayıcıda ve Node'da aynı API'dir. İşlemler asenkron: Promise döner." },
        { lines: [4], text: "32 baytlık sonucu 64 karakterlik onaltılık (hex) metne çeviriyoruz." },
        { lines: [7, 8], text: "Tek harf değişince özet tamamen değişir (çığ etkisi). Özetten geriye girdiye dönülemez." }
      ]
    },
    challenges: [
      {
        id: "p43c1", kind: "Değiştir", title: "SHA-256 özeti", fn: "sha256Hex", timeout: T,
        prompt: "`sha256Hex(metin)` metnin SHA-256 özetini küçük harfli onaltılık metin olarak döndüren bir **async** fonksiyon olsun. Başlangıç kodu baytları doğru çeviremiyor.",
        starter: "async function sha256Hex(metin) {\n  const veri = new TextEncoder().encode(metin);\n  const ozet = await crypto.subtle.digest(\"SHA-256\", veri);\n  return [...new Uint8Array(ozet)].map((b) => b.toString(16)).join(\"\");\n}\n",
        tests: [
          { label: "sha256Hex(\"abc\")", expr: "sha256Hex(\"abc\")", expected: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" },
          { label: "boş metin", expr: "sha256Hex(\"\")", expected: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
          { label: "her zaman 64 karakter", expr: "sha256Hex(\"kodera\").then((h) => h.length)", expected: 64 }
        ],
        hints: ["Bazı baytlar 16'dan küçük. Onaltılıkta kaç basamak yazılırlar?", "0x0a → \"a\" olur ama \"0a\" olmalı.", "b.toString(16).padStart(2, \"0\")"],
        solution: "async function sha256Hex(metin) {\n  const veri = new TextEncoder().encode(metin);\n  const ozet = await crypto.subtle.digest(\"SHA-256\", veri);\n  return [...new Uint8Array(ozet)].map((b) => b.toString(16).padStart(2, \"0\")).join(\"\");\n}"
      },
      {
        id: "p43c2", kind: "Yaz", title: "Parola özeti (PBKDF2)", fn: "parolaOzeti", timeout: T,
        prompt: "`parolaOzeti(parola, tuz)`: PBKDF2-SHA256, **100.000** tekrar, 32 bayt çıktı; sonucu onaltılık metin olarak döndür. `parolaDogrula(parola, tuz, kayitliOzet)` doğruysa `true` döndürsün.",
        starter: "async function parolaOzeti(parola, tuz) {\n  const enc = new TextEncoder();\n  const anahtar = await crypto.subtle.importKey(\"raw\", enc.encode(parola), \"PBKDF2\", false, [\"deriveBits\"]);\n  // deriveBits ile 256 bit türet\n}\n\nasync function parolaDogrula(parola, tuz, kayitliOzet) {\n  \n}\n",
        tests: [
          { label: "bilinen değer", expr: "parolaOzeti(\"kodera123\", \"tuz-42\")", expected: "b691d50fecd06b4e0b3724c8be0ece1f148d111bcd28c3f35f43f962593b0d4c" },
          { label: "doğru parola", expr: "parolaDogrula(\"kodera123\", \"tuz-42\", \"b691d50fecd06b4e0b3724c8be0ece1f148d111bcd28c3f35f43f962593b0d4c\")", expected: true },
          { label: "yanlış parola", expr: "parolaDogrula(\"kodera124\", \"tuz-42\", \"b691d50fecd06b4e0b3724c8be0ece1f148d111bcd28c3f35f43f962593b0d4c\")", expected: false },
          { label: "farklı tuz, farklı özet", expr: "(async () => (await parolaOzeti(\"a\", \"t1\")) !== (await parolaOzeti(\"a\", \"t2\")))()", expected: true }
        ],
        hints: ["crypto.subtle.deriveBits'e algoritma bilgisini bir nesne olarak verirsin: ad, özet fonksiyonu, tuz ve tekrar sayısı.", "{ name: \"PBKDF2\", hash: \"SHA-256\", salt: enc.encode(tuz), iterations: 100000 }, anahtar, 256", "Sonucu SHA-256 görevindeki gibi hex'e çevir. Doğrulamada aynı özeti hesaplayıp karşılaştır."],
        solution: "async function parolaOzeti(parola, tuz) {\n  const enc = new TextEncoder();\n  const anahtar = await crypto.subtle.importKey(\"raw\", enc.encode(parola), \"PBKDF2\", false, [\"deriveBits\"]);\n  const bitler = await crypto.subtle.deriveBits(\n    { name: \"PBKDF2\", hash: \"SHA-256\", salt: enc.encode(tuz), iterations: 100000 },\n    anahtar,\n    256\n  );\n  return [...new Uint8Array(bitler)].map((b) => b.toString(16).padStart(2, \"0\")).join(\"\");\n}\n\nasync function parolaDogrula(parola, tuz, kayitliOzet) {\n  const ozet = await parolaOzeti(parola, tuz);\n  if (ozet.length !== kayitliOzet.length) return false;\n  let fark = 0;\n  for (let i = 0; i < ozet.length; i++) fark |= ozet.charCodeAt(i) ^ kayitliOzet.charCodeAt(i);\n  return fark === 0;\n}"
      },
      {
        id: "p43c3", kind: "Yaz", title: "İmzalı belirteç", fn: "belirtecUret", timeout: T,
        prompt: "JWT'nin özünü yaz. `belirtecUret(veri, gizli)`: `base64url(JSON) + \".\" + base64url(HMAC-SHA256 imzası)`. `belirtecDogrula(belirtec, gizli)`: imza doğruysa veriyi, değilse `null` döndürsün. `b64url` yardımcıları hazır.",
        starter: B64 + "\nasync function anahtarAl(gizli) {\n  return crypto.subtle.importKey(\"raw\", new TextEncoder().encode(gizli), { name: \"HMAC\", hash: \"SHA-256\" }, false, [\"sign\", \"verify\"]);\n}\n\nasync function belirtecUret(veri, gizli) {\n  \n}\n\nasync function belirtecDogrula(belirtec, gizli) {\n  \n}\n",
        tests: [
          { label: "üret ve doğrula", expr: "(async () => belirtecDogrula(await belirtecUret({ id: 7, rol: \"mentor\" }, \"s3cr3t\"), \"s3cr3t\"))()", expected: { id: 7, rol: "mentor" } },
          { label: "iki parçalı biçim", expr: "belirtecUret({ a: 1 }, \"k\").then((t) => t.split(\".\").length)", expected: 2 },
          { label: "yanlış gizli anahtar", expr: "(async () => belirtecDogrula(await belirtecUret({ id: 7 }, \"s3cr3t\"), \"baska\"))()", expected: null },
          { label: "değiştirilmiş veri", expr: "(async () => { const t = await belirtecUret({ id: 7, rol: \"ogrenci\" }, \"s3cr3t\"); const imza = t.split(\".\")[1]; const sahte = b64url(new TextEncoder().encode(JSON.stringify({ id: 7, rol: \"admin\" }))) + \".\" + imza; return belirtecDogrula(sahte, \"s3cr3t\"); })()", expected: null },
          { label: "bozuk belirteç", expr: "belirtecDogrula(\"bozuk\", \"s3cr3t\")", expected: null }
        ],
        hints: ["İmza, verinin base64url hâli üzerinden hesaplanır. Doğrularken aynı parçayı imzalayıp karşılaştırırsın.", "Üret: const g = b64url(new TextEncoder().encode(JSON.stringify(veri))); const imza = await crypto.subtle.sign(\"HMAC\", await anahtarAl(gizli), new TextEncoder().encode(g));", "Doğrula: const [g, i] = belirtec.split(\".\"); crypto.subtle.verify(\"HMAC\", anahtar, b64urlCoz(i), enc.encode(g)) — try/catch ile bozuk girdide null döndür."],
        solution: B64 + "\nasync function anahtarAl(gizli) {\n  return crypto.subtle.importKey(\"raw\", new TextEncoder().encode(gizli), { name: \"HMAC\", hash: \"SHA-256\" }, false, [\"sign\", \"verify\"]);\n}\n\nasync function belirtecUret(veri, gizli) {\n  const enc = new TextEncoder();\n  const govde = b64url(enc.encode(JSON.stringify(veri)));\n  const imza = await crypto.subtle.sign(\"HMAC\", await anahtarAl(gizli), enc.encode(govde));\n  return govde + \".\" + b64url(imza);\n}\n\nasync function belirtecDogrula(belirtec, gizli) {\n  try {\n    const [govde, imza] = belirtec.split(\".\");\n    if (!govde || !imza) return null;\n    const enc = new TextEncoder();\n    const gecerli = await crypto.subtle.verify(\"HMAC\", await anahtarAl(gizli), b64urlCoz(imza), enc.encode(govde));\n    return gecerli ? JSON.parse(new TextDecoder().decode(b64urlCoz(govde))) : null;\n  } catch {\n    return null;\n  }\n}"
      }
    ],
    cards: [
      { id: "p43k1", q: "Parolalar neden düz SHA-256 ile değil, tuz + PBKDF2/bcrypt/Argon2 ile saklanır?", a: "Tuz aynı parolaların aynı özeti üretmesini engeller; yavaş fonksiyonlar kaba kuvvet denemelerini pahalı hale getirir." },
      { id: "p43k2", q: "HMAC imzası neyi garanti eder?", a: "Verinin gizli anahtarı bilen biri tarafından üretildiğini ve sonradan değiştirilmediğini. Veriyi gizlemez." },
      { id: "p43k3", q: "JWT'nin gövdesi şifreli midir?", a: "Hayır, sadece base64url kodludur ve herkes okuyabilir. Gizli bilgi koyma; imza yalnızca değişikliği tespit eder." }
    ]
  },

  /* ============================ FAZ 44 ============================ */
  {
    id: "p44", no: 44, track: "backend", title: "SQL: veri sorgulama", short: "SQL sorgu",
    goal: "İlişkisel veritabanından istediğin satırları ve sütunları seç, süz ve sırala.",
    concepts: ["SELECT ve FROM", "WHERE", "ORDER BY ve LIMIT", "NULL"],
    predict: {
      lang: "sql", setup: SEED,
      code: "SELECT ad FROM kurslar\nWHERE kategori = 'frontend' AND fiyat > 500;",
      options: ["0 satır", "1 satır", "2 satır", "3 satır"], answer: 1,
      why: "Üç frontend kursundan yalnızca React'in fiyatı (1200) 500'den büyük. AND iki koşulun birlikte doğru olmasını ister. Çalıştırıp tabloyu gör."
    },
    example: {
      title: "Bir sorgunun anatomisi",
      lang: "sql", setup: SEED,
      code: "-- Ankara ya da İzmir'deki öğrenciler, en gençten başlayarak\nSELECT ad, sehir, yas\nFROM ogrenciler\nWHERE sehir IN ('Ankara', 'İzmir')\nORDER BY yas ASC\nLIMIT 3;",
      steps: [
        { lines: [2], text: "SELECT hangi sütunları istediğini söyler. * hepsidir ama gerçek projelerde sütunları adıyla yazmak daha güvenlidir." },
        { lines: [3], text: "FROM hangi tablodan. Bu veritabanında üç tablo var: ogrenciler, kurslar, kayitlar." },
        { lines: [4], text: "WHERE satırları süzer. IN bir listeden herhangi biriyle eşleşir; = ve OR zincirinin kısa yazımıdır." },
        { lines: [5, 6], text: "ORDER BY sıralar (ASC artan, DESC azalan), LIMIT ilk N satırı alır. Çalıştır: Ali, Ece, Mert." }
      ]
    },
    challenges: [
      sql({
        id: "p44c1", kind: "Değiştir", title: "İzmir'deki öğrenciler",
        prompt: "İzmir'de yaşayan öğrencilerin **sadece adlarını**, alfabetik sırayla listele.",
        starter: "SELECT * FROM ogrenciler;\n",
        tests: [
          { label: "doğru satırlar ve sıra", expected: [["Ece"], ["Mert"]] }
        ],
        hints: ["Sütunları sınırla, satırları süz, sonra sırala.", "SELECT ad FROM ogrenciler WHERE …", "WHERE sehir = 'İzmir' ORDER BY ad"],
        solution: "SELECT ad\nFROM ogrenciler\nWHERE sehir = 'İzmir'\nORDER BY ad;"
      }),
      sql({
        id: "p44c2", kind: "Yaz", title: "Yaşa göre sırala",
        prompt: "25 yaşından **büyük** öğrencilerin adını ve yaşını, **en yaşlıdan** en gence sırala.",
        starter: "-- Sorguyu yaz\n",
        tests: [
          { label: "doğru satırlar ve sıra", expected: [["Kaan", 41], ["Zeynep", 35], ["Can", 31], ["Elif", 29], ["Mert", 27]] }
        ],
        hints: ["İki sütun, bir koşul, bir sıralama.", "WHERE yas > 25", "ORDER BY yas DESC"],
        solution: "SELECT ad, yas\nFROM ogrenciler\nWHERE yas > 25\nORDER BY yas DESC;"
      }),
      sql({
        id: "p44c3", kind: "Hata Ayıkla", title: "Kayıp şehir",
        prompt: "Bu sorgu şehri bilinmeyen öğrencileri bulmalıydı ama hiç satır döndürmüyor. Neden? Düzelt.",
        starter: "SELECT ad\nFROM ogrenciler\nWHERE sehir = NULL;\n",
        tests: [
          { label: "şehri bilinmeyenler", expected: [["Kaan"]] }
        ],
        hints: ["NULL bir değer değil, 'bilinmiyor' demektir. Bilinmeyen bir şey başka bir şeye eşit midir?", "SQL'de NULL ile = karşılaştırması her zaman 'bilinmiyor' döner ve satır seçilmez.", "WHERE sehir IS NULL"],
        solution: "SELECT ad\nFROM ogrenciler\nWHERE sehir IS NULL;"
      })
    ],
    cards: [
      { id: "p44k1", q: "Bir SQL sorgusunda yazılış sırası?", a: "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT" },
      { id: "p44k2", q: "Neden WHERE sehir = NULL çalışmaz?", a: "NULL 'bilinmiyor' demektir; = ile karşılaştırma bilinmiyor döner. IS NULL / IS NOT NULL kullanılır." },
      { id: "p44k3", q: "IN ne işe yarar?", a: "Bir değerin listedeki değerlerden biri olup olmadığına bakar: WHERE sehir IN ('Ankara', 'İzmir')." }
    ]
  },

  /* ============================ FAZ 45 ============================ */
  {
    id: "p45", no: 45, track: "backend", title: "SQL: gruplama ve özetleme", short: "SQL gruplama",
    goal: "Satırları gruplara ayırıp sayı, toplam ve ortalama gibi özetler üret; raporların temeli.",
    concepts: ["COUNT, SUM, AVG", "GROUP BY", "HAVING", "NULL ve toplama"],
    predict: {
      lang: "sql", setup: SEED,
      code: "SELECT COUNT(*), COUNT(puan)\nFROM kayitlar;",
      options: ["14 ve 14", "14 ve 13", "13 ve 13", "13 ve 14"], answer: 1,
      why: "COUNT(*) satırları sayar: 14. COUNT(puan) yalnızca puanı NULL olmayanları sayar: Mert'in SQL kaydının puanı henüz yok, sonuç 13. AVG ve SUM da NULL'ları atlar."
    },
    example: {
      title: "Kategori başına kurs özeti",
      lang: "sql", setup: SEED,
      code: "SELECT kategori,\n       COUNT(*)      AS kurs_sayisi,\n       AVG(fiyat)    AS ort_fiyat,\n       MAX(sure)     AS en_uzun\nFROM kurslar\nGROUP BY kategori\nORDER BY kurs_sayisi DESC;",
      steps: [
        { lines: [6], text: "GROUP BY, aynı kategoriye sahip satırları tek bir gruba toplar. Sonuçta her kategori için bir satır olur." },
        { lines: [2, 3, 4], text: "Toplama fonksiyonları her grubun içinde çalışır. AS sonuç sütununa ad verir." },
        { lines: [1], text: "SELECT'te ya gruplanan sütun ya da toplama fonksiyonu olmalı. Gruplanmamış bir sütun (ör. ad) hangi satırdan alınacağı belirsizdir." },
        { lines: [7], text: "Takma adla sıralayabilirsin. Çalıştır: frontend 3, backend 2, temel 1." }
      ]
    },
    challenges: [
      sql({
        id: "p45c1", kind: "Değiştir", title: "Şehir başına öğrenci",
        prompt: "Her şehirdeki öğrenci sayısını listele: `sehir` ve sayı. Şehri bilinmeyenleri dahil etme. Sayıya göre **azalan**, eşitlikte şehre göre **artan** sırala.",
        starter: "SELECT sehir\nFROM ogrenciler;\n",
        tests: [
          { label: "doğru gruplar ve sıra", expected: [["Ankara", 2], ["İstanbul", 2], ["İzmir", 2], ["Bursa", 1]] }
        ],
        hints: ["Saymak için gruplaman gerek.", "SELECT sehir, COUNT(*) … GROUP BY sehir", "WHERE sehir IS NOT NULL … ORDER BY COUNT(*) DESC, sehir"],
        solution: "SELECT sehir, COUNT(*) AS sayi\nFROM ogrenciler\nWHERE sehir IS NOT NULL\nGROUP BY sehir\nORDER BY sayi DESC, sehir;"
      }),
      sql({
        id: "p45c2", kind: "Yaz", title: "Kurs başına ortalama puan",
        prompt: "`kayitlar` tablosundan her kursun `kurs_id`'sini ve ortalama puanını **bir ondalığa yuvarlanmış** olarak listele. Ortalamaya göre yüksekten düşüğe sırala.",
        starter: "-- ROUND(deger, 1) bir ondalığa yuvarlar\n",
        tests: [
          { label: "doğru ortalamalar ve sıra", expected: [[6, 99], [2, 88], [3, 84.5], [4, 84], [1, 76.5], [5, 70]] }
        ],
        hints: ["Gruplama anahtarı kurs_id.", "SELECT kurs_id, ROUND(AVG(puan), 1) …", "GROUP BY kurs_id ORDER BY 2 DESC (2: ikinci sütun) — ya da takma ad kullan."],
        solution: "SELECT kurs_id, ROUND(AVG(puan), 1) AS ortalama\nFROM kayitlar\nGROUP BY kurs_id\nORDER BY ortalama DESC;"
      }),
      sql({
        id: "p45c3", kind: "Yaz", title: "Çalışkan öğrenciler",
        prompt: "**En az 3** kursa kayıtlı öğrencilerin `ogrenci_id`'sini ve kayıt sayısını, id'ye göre sırala.",
        starter: "-- Gruplardan sonra süzmek için WHERE değil başka bir şey gerekir\n",
        tests: [
          { label: "doğru öğrenciler", expected: [[1, 3], [3, 3], [5, 3]] }
        ],
        hints: ["WHERE gruplamadan önce satırları süzer. Gruplamadan sonra süzmek için?", "HAVING, grup üzerinde koşul yazmanı sağlar.", "GROUP BY ogrenci_id HAVING COUNT(*) >= 3 ORDER BY ogrenci_id"],
        solution: "SELECT ogrenci_id, COUNT(*) AS kayit\nFROM kayitlar\nGROUP BY ogrenci_id\nHAVING COUNT(*) >= 3\nORDER BY ogrenci_id;"
      })
    ],
    cards: [
      { id: "p45k1", q: "WHERE ile HAVING farkı?", a: "WHERE gruplamadan önce satırları, HAVING gruplamadan sonra grupları süzer." },
      { id: "p45k2", q: "COUNT(*) ile COUNT(sutun) farkı?", a: "COUNT(*) tüm satırları, COUNT(sutun) o sütunu NULL olmayan satırları sayar." },
      { id: "p45k3", q: "GROUP BY kullanan sorguda SELECT'e neler yazılabilir?", a: "Gruplanan sütunlar ve toplama fonksiyonları (COUNT, SUM, AVG, MIN, MAX)." }
    ]
  },

  /* ============================ FAZ 46 ============================ */
  {
    id: "p46", no: 46, track: "backend", title: "SQL: tabloları birleştirme", short: "SQL JOIN",
    goal: "Farklı tablolara bölünmüş ilişkili veriyi JOIN ile tek bir sonuçta bir araya getir.",
    concepts: ["birincil ve yabancı anahtar", "INNER JOIN", "LEFT JOIN", "çoka çok ilişki"],
    predict: {
      lang: "sql", setup: SEED,
      code: "SELECT COUNT(*)\nFROM ogrenciler o\nLEFT JOIN kayitlar k ON k.ogrenci_id = o.id;",
      options: ["8", "14", "15", "22"], answer: 2,
      why: "14 kaydın her biri bir satır üretir. LEFT JOIN, hiç kaydı olmayan öğrencileri de (Kaan) NULL değerlerle bir kez ekler: 15. INNER JOIN olsaydı 14 olurdu."
    },
    example: {
      title: "Kim hangi kursu aldı?",
      lang: "sql", setup: SEED,
      code: "SELECT o.ad AS ogrenci, ku.ad AS kurs, k.puan\nFROM kayitlar k\nJOIN ogrenciler o ON o.id = k.ogrenci_id\nJOIN kurslar ku   ON ku.id = k.kurs_id\nWHERE k.puan >= 90\nORDER BY k.puan DESC;",
      steps: [
        { lines: [2], text: "kayitlar bir ara tablodur: öğrenciler ile kurslar arasındaki çoka çok ilişkiyi tutar." },
        { lines: [3, 4], text: "JOIN … ON, iki tablonun satırlarını eşleşen anahtarlar üzerinden yan yana koyar. Takma adlar (o, ku, k) sorguyu okunur kılar." },
        { lines: [1], text: "Aynı ada sahip sütunlar (ad) olduğunda tablo öneki zorunludur." },
        { lines: [5, 6], text: "Birleşmiş sonuç üzerinde normal WHERE ve ORDER BY. Çalıştır: Elif CSS Grid 99, Deniz, Ece, Deniz, Zeynep." }
      ]
    },
    challenges: [
      sql({
        id: "p46c1", kind: "Değiştir", title: "Ece'nin kursları",
        prompt: "Ece'nin kayıtlı olduğu kursların **adlarını** alfabetik sırayla listele. Başlangıç kodu sadece kurs id'lerini veriyor.",
        starter: "SELECT k.kurs_id\nFROM kayitlar k\nWHERE k.ogrenci_id = 1;\n",
        tests: [
          { label: "doğru kurs adları", expected: [["JavaScript Temelleri"], ["React"], ["SQL"]] }
        ],
        hints: ["Kurs adı kurslar tablosunda. kayitlar ile kurslar'ı nasıl bağlarsın?", "JOIN kurslar ku ON ku.id = k.kurs_id", "Ece'nin id'sini sabit yazmak yerine öğrenciler tablosunu da bağlayıp WHERE o.ad = 'Ece' de diyebilirsin."],
        solution: "SELECT ku.ad\nFROM kayitlar k\nJOIN ogrenciler o ON o.id = k.ogrenci_id\nJOIN kurslar ku ON ku.id = k.kurs_id\nWHERE o.ad = 'Ece'\nORDER BY ku.ad;"
      }),
      sql({
        id: "p46c2", kind: "Yaz", title: "Hiç kayıt olmayanlar",
        prompt: "Hiçbir kursa kayıtlı olmayan öğrencilerin adlarını listele. Alt sorgu yerine **LEFT JOIN** kullan.",
        starter: "-- LEFT JOIN eşleşmeyen satırları NULL ile doldurur\n",
        tests: [
          { label: "kayıtsız öğrenciler", expected: [["Kaan"]] },
          { label: "LEFT JOIN kullanılmış", codeMatch: "LEFT\\s+(OUTER\\s+)?JOIN", codeHint: "LEFT JOIN" }
        ],
        hints: ["LEFT JOIN sonucu, eşleşmesi olmayan öğrenciler için kayıt sütunlarını NULL bırakır.", "FROM ogrenciler o LEFT JOIN kayitlar k ON k.ogrenci_id = o.id", "WHERE k.ogrenci_id IS NULL"],
        solution: "SELECT o.ad\nFROM ogrenciler o\nLEFT JOIN kayitlar k ON k.ogrenci_id = o.id\nWHERE k.ogrenci_id IS NULL;"
      }),
      sql({
        id: "p46c3", kind: "Yaz", title: "Kategori başına gelir",
        prompt: "Her kayıt, kursun fiyatı kadar gelir getiriyor. Her **kategori** için toplam geliri hesapla: `kategori` ve toplam, gelire göre azalan.",
        starter: "-- JOIN + GROUP BY birlikte\n",
        tests: [
          { label: "doğru gelirler", expected: [["backend", 5500], ["temel", 3000], ["frontend", 2700]] }
        ],
        hints: ["Önce her kaydı kursuyla birleştir, sonra kategoriye göre grupla.", "FROM kayitlar k JOIN kurslar ku ON ku.id = k.kurs_id", "SELECT ku.kategori, SUM(ku.fiyat) … GROUP BY ku.kategori ORDER BY 2 DESC"],
        solution: "SELECT ku.kategori, SUM(ku.fiyat) AS gelir\nFROM kayitlar k\nJOIN kurslar ku ON ku.id = k.kurs_id\nGROUP BY ku.kategori\nORDER BY gelir DESC;"
      })
    ],
    cards: [
      { id: "p46k1", q: "INNER JOIN ile LEFT JOIN farkı?", a: "INNER yalnızca iki tarafta da eşleşen satırları, LEFT soldaki tüm satırları (eşleşme yoksa sağ taraf NULL) döndürür." },
      { id: "p46k2", q: "Çoka çok ilişki nasıl modellenir?", a: "İki tablonun anahtarlarını tutan bir ara tabloyla (ör. kayitlar: ogrenci_id, kurs_id)." },
      { id: "p46k3", q: "'Hiç X'i olmayanları bul' kalıbı?", a: "LEFT JOIN … WHERE sag_tablo.anahtar IS NULL" }
    ]
  },

  /* ============================ FAZ 47 ============================ */
  {
    id: "p47", no: 47, track: "backend", title: "SQL: veri değiştirme ve işlemler", short: "SQL değiştirme",
    goal: "Satır ekle, güncelle ve sil; birlikte olması gereken değişiklikleri tek bir işlemde (transaction) yap.",
    concepts: ["INSERT", "UPDATE ve WHERE", "DELETE", "BEGIN ve COMMIT"],
    predict: {
      lang: "sql", setup: SEED,
      code: "UPDATE kurslar SET fiyat = 0;\nSELECT COUNT(*) FROM kurslar WHERE fiyat = 0;",
      options: ["1", "0", "6", "Hata verir"], answer: 2,
      why: "WHERE olmayan UPDATE tablodaki her satırı değiştirir: altı kursun hepsi ücretsiz oldu. Gerçek veritabanında UPDATE ve DELETE'i her zaman önce aynı WHERE ile bir SELECT çalıştırarak dene."
    },
    example: {
      title: "Güvenli değişiklik alışkanlığı",
      lang: "sql", setup: SEED,
      code: "-- 1) Önce neyi değiştireceğini gör\nSELECT id, ad, fiyat FROM kurslar WHERE kategori = 'frontend';\n\n-- 2) Sonra aynı WHERE ile değiştir\nUPDATE kurslar SET fiyat = fiyat - 100 WHERE kategori = 'frontend' AND fiyat >= 100;\n\n-- 3) Sonucu doğrula\nSELECT id, ad, fiyat FROM kurslar WHERE kategori = 'frontend';",
      steps: [
        { lines: [2], text: "Değiştirmeden önce aynı koşulla seç: hangi satırların etkileneceğini gözünle gör." },
        { lines: [5], text: "SET yeni değeri yazar; mevcut değeri kullanabilir (fiyat - 100). WHERE'i unutursan tüm tablo değişir." },
        { lines: [8], text: "Son SELECT sonucu doğrular. Çalıştır: React 1100, CSS Grid 200; ücretsiz kurs değişmedi." }
      ]
    },
    challenges: [
      sql({
        id: "p47c1", kind: "Değiştir", title: "Yeni kurs",
        prompt: "Kurslara şu satırı ekle: id **7**, ad **TypeScript**, kategori **frontend**, süre **20**, fiyat **1100**. Başlangıç kodundaki sütun sırası yanlış.",
        starter: "INSERT INTO kurslar (id, ad, kategori, sure, fiyat)\nVALUES (7, 'TypeScript', 1100, 20, 'frontend');\n",
        tests: [
          { label: "satır doğru eklendi", verify: "SELECT ad, kategori, sure, fiyat FROM kurslar WHERE id = 7", expected: [["TypeScript", "frontend", 20, 1100]] },
          { label: "toplam 7 kurs", verify: "SELECT COUNT(*) FROM kurslar", expected: [[7]] }
        ],
        hints: ["VALUES'taki değerler, parantez içindeki sütunlarla aynı sırada olmalı.", "Sütun sırası: id, ad, kategori, sure, fiyat.", "VALUES (7, 'TypeScript', 'frontend', 20, 1100)"],
        solution: "INSERT INTO kurslar (id, ad, kategori, sure, fiyat)\nVALUES (7, 'TypeScript', 'frontend', 20, 1100);"
      }),
      sql({
        id: "p47c2", kind: "Yaz", title: "Backend zammı",
        prompt: "Yalnızca **backend** kurslarının fiyatını %10 artır ve sonucu tam sayıya yuvarla. Diğer kurslar değişmemeli.",
        starter: "-- Önce SELECT ile kontrol etmeyi unutma\n",
        tests: [
          { label: "backend fiyatları", verify: "SELECT id, fiyat FROM kurslar WHERE kategori = 'backend' ORDER BY id", expected: [[3, 1540], [4, 990]] },
          { label: "diğerleri değişmedi", verify: "SELECT SUM(fiyat) FROM kurslar WHERE kategori <> 'backend'", expected: [[3000]] }
        ],
        hints: ["UPDATE … SET … WHERE", "SET fiyat = ROUND(fiyat * 1.1)", "WHERE kategori = 'backend'"],
        solution: "UPDATE kurslar\nSET fiyat = ROUND(fiyat * 1.1)\nWHERE kategori = 'backend';"
      }),
      sql({
        id: "p47c3", kind: "Yaz", title: "Hesabı sil",
        prompt: "Ali'nin (id 6) hesabını sil: önce tüm **kayıtlarını**, sonra **kendisini**. İki silme tek bir işlemde (`BEGIN` … `COMMIT`) olmalı ki yarıda kalmasın.",
        starter: "-- BEGIN;\n-- …\n-- COMMIT;\n",
        tests: [
          { label: "kayıtları silindi", verify: "SELECT COUNT(*) FROM kayitlar WHERE ogrenci_id = 6", expected: [[0]] },
          { label: "öğrenci silindi, diğerleri duruyor", verify: "SELECT COUNT(*) FROM ogrenciler", expected: [[7]] },
          { label: "diğer kayıtlar duruyor", verify: "SELECT COUNT(*) FROM kayitlar", expected: [[13]] },
          { label: "işlem kullanılmış", codeMatch: "BEGIN[\\s\\S]*COMMIT", codeHint: "BEGIN … COMMIT" }
        ],
        hints: ["Neden önce kayıtlar? Öğrenciyi önce silersen kayıtlar neyi gösterir?", "DELETE FROM kayitlar WHERE ogrenci_id = 6;", "BEGIN; DELETE … ; DELETE FROM ogrenciler WHERE id = 6; COMMIT;"],
        solution: "BEGIN;\nDELETE FROM kayitlar WHERE ogrenci_id = 6;\nDELETE FROM ogrenciler WHERE id = 6;\nCOMMIT;"
      })
    ],
    cards: [
      { id: "p47k1", q: "UPDATE/DELETE öncesi güvenli alışkanlık?", a: "Aynı WHERE ile önce SELECT çalıştırıp etkilenecek satırları görmek." },
      { id: "p47k2", q: "Transaction (işlem) neyi garanti eder?", a: "İçindeki değişikliklerin ya hepsinin ya hiçbirinin uygulanmasını (atomiklik). Hata olursa ROLLBACK." },
      { id: "p47k3", q: "INSERT'te sütun listesini yazmak neden önemli?", a: "Değerlerin hangi sütuna gideceğini açık kılar; tabloya sütun eklense de sorgu bozulmaz." }
    ]
  },

  /* ============================ FAZ 48 ============================ */
  {
    id: "p48", no: 48, track: "backend", title: "Şema tasarımı ve indeksler", short: "Şema & indeks",
    goal: "Veriyi kurallarla koruyan tablolar tasarla ve sık yapılan sorguları indekslerle hızlandır.",
    concepts: ["NOT NULL, UNIQUE, CHECK", "yabancı anahtar", "indeks", "sorgu planı"],
    predict: {
      lang: "sql", setup: SEED,
      code: "CREATE TABLE uyeler (email TEXT UNIQUE);\nINSERT INTO uyeler VALUES ('ece@quagen.dev');\nINSERT INTO uyeler VALUES ('ece@quagen.dev');",
      options: ["İki satır eklenir", "İkinci INSERT reddedilir", "İkincisi birinciyi değiştirir", "Tablo silinir"], answer: 1,
      why: "UNIQUE kısıtı aynı değerin ikinci kez girmesini veritabanı seviyesinde engeller. Uygulama kodunda kontrol etmek yetmez; aynı anda gelen iki istek ikisini de geçirebilir. Kural veritabanında olmalı."
    },
    example: {
      title: "Kuralları tabloya yazmak",
      lang: "sql", setup: SEED,
      code: "CREATE TABLE odevler (\n  id        INTEGER PRIMARY KEY,\n  kurs_id   INTEGER NOT NULL REFERENCES kurslar(id),\n  baslik    TEXT    NOT NULL,\n  zorluk    INTEGER CHECK (zorluk BETWEEN 1 AND 3),\n  UNIQUE (kurs_id, baslik)\n);\nCREATE INDEX idx_odev_kurs ON odevler(kurs_id);\n\nEXPLAIN QUERY PLAN SELECT * FROM odevler WHERE kurs_id = 2;",
      steps: [
        { lines: [2], text: "PRIMARY KEY her satırı benzersiz tanımlar." },
        { lines: [3, 4], text: "NOT NULL boş geçilemez alanlar. REFERENCES, kurs_id'nin gerçek bir kursu göstermesi gerektiğini belgeler." },
        { lines: [5, 6], text: "CHECK değer aralığını, birleşik UNIQUE aynı kursta aynı başlığın tekrarını engeller." },
        { lines: [8, 10], text: "İndeks, kurs_id'ye göre aramayı tüm tabloyu taramaktan kurtarır. EXPLAIN QUERY PLAN bunu gösterir: 'USING INDEX'." }
      ]
    },
    challenges: [
      sql({
        id: "p48c1", kind: "Yaz", title: "Yorumlar tablosu",
        prompt: "`yorumlar` tablosu oluştur: `id` (birincil anahtar), `kurs_id` (boş olamaz, kurslara referans), `metin` (boş olamaz), `puan` (1 ile 5 arasında olmalı).",
        starter: "CREATE TABLE yorumlar (\n  \n);\n",
        tests: [
          { label: "geçerli yorum eklenir", verify: "INSERT INTO yorumlar (kurs_id, metin, puan) VALUES (2, 'Harika', 5); SELECT COUNT(*) FROM yorumlar", expected: [[1]] },
          { label: "puan 6 reddedilir", fails: "INSERT INTO yorumlar (kurs_id, metin, puan) VALUES (2, 'x', 6)" },
          { label: "boş metin reddedilir", fails: "INSERT INTO yorumlar (kurs_id, metin, puan) VALUES (2, NULL, 4)" },
          { label: "kurs_id zorunlu", fails: "INSERT INTO yorumlar (metin, puan) VALUES ('x', 4)" }
        ],
        hints: ["Her sütun: ad, tip, kısıtlar.", "puan INTEGER CHECK (puan BETWEEN 1 AND 5)", "kurs_id INTEGER NOT NULL REFERENCES kurslar(id), metin TEXT NOT NULL"],
        solution: "CREATE TABLE yorumlar (\n  id      INTEGER PRIMARY KEY,\n  kurs_id INTEGER NOT NULL REFERENCES kurslar(id),\n  metin   TEXT    NOT NULL,\n  puan    INTEGER CHECK (puan BETWEEN 1 AND 5)\n);"
      }),
      sql({
        id: "p48c2", kind: "Yaz", title: "Benzersiz e-posta",
        prompt: "`kullanicilar` tablosu oluştur: `id` (birincil anahtar), `email` (boş olamaz ve **benzersiz**), `ad`.",
        starter: "-- Kural veritabanında olmalı\n",
        tests: [
          { label: "kullanıcı eklenir", verify: "INSERT INTO kullanicilar (email, ad) VALUES ('ece@quagen.dev', 'Ece'); SELECT COUNT(*) FROM kullanicilar", expected: [[1]] },
          { label: "aynı e-posta reddedilir", fails: "INSERT INTO kullanicilar (email, ad) VALUES ('a@k.dev', 'A'); INSERT INTO kullanicilar (email, ad) VALUES ('a@k.dev', 'B')" },
          { label: "e-postasız kullanıcı reddedilir", fails: "INSERT INTO kullanicilar (ad) VALUES ('C')" }
        ],
        hints: ["İki kısıt aynı sütunda birlikte kullanılabilir.", "email TEXT NOT NULL UNIQUE", "CREATE TABLE kullanicilar (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, ad TEXT);"],
        solution: "CREATE TABLE kullanicilar (\n  id    INTEGER PRIMARY KEY,\n  email TEXT NOT NULL UNIQUE,\n  ad    TEXT\n);"
      }),
      sql({
        id: "p48c3", kind: "Yaz", title: "Aramayı hızlandır",
        prompt: "Uygulama öğrencileri sık sık **ada göre** arıyor. Bu aramanın tüm tabloyu taramaması için bir indeks oluştur.",
        starter: "-- CREATE INDEX …\n",
        tests: [
          { label: "sorgu planı indeksi kullanıyor", verify: "EXPLAIN QUERY PLAN SELECT * FROM ogrenciler WHERE ad = 'Ece'", contains: "USING" },
          { label: "tablo taraması yok", verify: "EXPLAIN QUERY PLAN SELECT * FROM ogrenciler WHERE ad = 'Ece'", contains: "INDEX" }
        ],
        hints: ["İndeks bir sütun (ya da sütunlar) üzerine kurulur ve bir adı olur.", "CREATE INDEX idx_ad ON tablo(sutun);", "CREATE INDEX idx_ogrenci_ad ON ogrenciler(ad);"],
        solution: "CREATE INDEX idx_ogrenci_ad ON ogrenciler(ad);"
      })
    ],
    cards: [
      { id: "p48k1", q: "Veri kuralları neden uygulama kodunda değil veritabanında olmalı?", a: "Eşzamanlı istekler, farklı servisler ve elle yapılan düzeltmeler uygulama kontrolünü atlayabilir; veritabanı kısıtı her yazmada uygulanır." },
      { id: "p48k2", q: "İndeksin bedeli nedir?", a: "Ek disk alanı ve her INSERT/UPDATE/DELETE'te güncelleme maliyeti. Okuma hızlanır, yazma biraz yavaşlar." },
      { id: "p48k3", q: "Bir sorgunun indeks kullanıp kullanmadığını nasıl anlarsın?", a: "EXPLAIN QUERY PLAN (SQLite) ya da EXPLAIN (PostgreSQL/MySQL) ile sorgu planına bakarak." }
    ]
  },

  /* ============================ FAZ 49 ============================ */
  {
    id: "p49", no: 49, track: "backend", title: "Sayfalama, önbellek ve hız sınırı", short: "Ölçeklenme",
    goal: "Yük altında ayakta kalan servislerin üç temel aracını yaz: sayfalama, LRU önbellek ve hız sınırlama.",
    concepts: ["sayfalama", "LRU önbellek", "hız sınırlama", "test edilebilir saat"],
    predict: {
      code: "// Kapasitesi 2 olan LRU önbellek\nkoy(\"a\", 1);\nkoy(\"b\", 2);\nal(\"a\");\nkoy(\"c\", 3);\n// Hangi anahtar önbellekten atıldı?",
      options: ["a", "b", "c", "Hiçbiri"], answer: 1,
      why: "LRU (en uzun süre kullanılmayan) önbellek dolunca en eski kullanılanı atar. al(\"a\") a'yı yeniden 'taze' yaptı; en uzun süredir dokunulmayan b'dir.",
      run: false
    },
    example: {
      title: "Map ile LRU fikri",
      code: "const m = new Map();\nm.set(\"a\", 1); m.set(\"b\", 2); m.set(\"c\", 3);\n\n// Map ekleme sırasını korur. Bir anahtarı 'taze' yapmak için sil ve tekrar ekle:\nconst v = m.get(\"a\");\nm.delete(\"a\");\nm.set(\"a\", v);\n\nconsole.log([...m.keys()]);\nconsole.log(\"en eski:\", m.keys().next().value);",
      steps: [
        { lines: [1, 2], text: "Map anahtarları eklendiği sırayla tutar." },
        { lines: [5, 6, 7], text: "Silip yeniden eklemek anahtarı sona taşır. Her işlem ortalama O(1)." },
        { lines: [9, 10], text: "En eski (en uzun süre kullanılmayan) anahtar her zaman ilk sıradadır: atılacak olan o." }
      ]
    },
    challenges: [
      {
        id: "p49c1", kind: "Yaz", title: "Sayfalama", fn: "sayfala",
        prompt: "`sayfala(dizi, sayfa, boyut)` → `{ veri, sayfa, toplamSayfa, sonrakiVar }`. Sayfalar **1'den** başlar. Sayfa aralık dışındaysa `veri: []`. Boş dizide `toplamSayfa: 0`.",
        starter: "function sayfala(dizi, sayfa, boyut) {\n  \n}\n",
        tests: [
          { args: [[1, 2, 3, 4, 5], 1, 2], expected: { veri: [1, 2], sayfa: 1, toplamSayfa: 3, sonrakiVar: true } },
          { args: [[1, 2, 3, 4, 5], 3, 2], expected: { veri: [5], sayfa: 3, toplamSayfa: 3, sonrakiVar: false } },
          { args: [[1, 2, 3], 9, 2], expected: { veri: [], sayfa: 9, toplamSayfa: 2, sonrakiVar: false } },
          { args: [[], 1, 10], expected: { veri: [], sayfa: 1, toplamSayfa: 0, sonrakiVar: false } }
        ],
        hints: ["Başlangıç indeksi sayfa ve boyuttan nasıl hesaplanır? Sayfalar 1'den başlıyor.", "const bas = (sayfa - 1) * boyut; dizi.slice(bas, bas + boyut)", "toplamSayfa = Math.ceil(dizi.length / boyut); sonrakiVar = sayfa < toplamSayfa"],
        solution: "function sayfala(dizi, sayfa, boyut) {\n  const bas = (sayfa - 1) * boyut;\n  const toplamSayfa = Math.ceil(dizi.length / boyut);\n  return {\n    veri: sayfa >= 1 ? dizi.slice(bas, bas + boyut) : [],\n    sayfa,\n    toplamSayfa,\n    sonrakiVar: sayfa < toplamSayfa\n  };\n}"
      },
      {
        id: "p49c2", kind: "Yaz", title: "LRU önbellek", fn: "LRUOnbellek", timeout: T,
        prompt: "`LRUOnbellek` sınıfı: `constructor(kapasite)`, `al(anahtar)` (yoksa `undefined`, varsa değeri döndürüp anahtarı taze yapar), `koy(anahtar, deger)` (kapasite aşılırsa en uzun süre kullanılmayanı atar). İşlemler **O(1)** olmalı.",
        starter: "class LRUOnbellek {\n  constructor(kapasite) {\n    this.kapasite = kapasite;\n    this.veri = new Map();\n  }\n  al(anahtar) {}\n  koy(anahtar, deger) {}\n}\n",
        tests: [
          { label: "temel kullanım", expr: "(() => { const c = new LRUOnbellek(2); c.koy(\"a\", 1); c.koy(\"b\", 2); return [c.al(\"a\"), c.al(\"b\"), c.al(\"x\")]; })()", expected: [1, 2, undefined] },
          { label: "en eski kullanılan atılır", expr: "(() => { const c = new LRUOnbellek(2); c.koy(\"a\", 1); c.koy(\"b\", 2); c.al(\"a\"); c.koy(\"c\", 3); return [c.al(\"a\"), c.al(\"b\"), c.al(\"c\")]; })()", expected: [1, undefined, 3] },
          { label: "güncelleme tazeler", expr: "(() => { const c = new LRUOnbellek(2); c.koy(\"a\", 1); c.koy(\"b\", 2); c.koy(\"a\", 9); c.koy(\"c\", 3); return [c.al(\"a\"), c.al(\"b\")]; })()", expected: [9, undefined] },
          { label: "200.000 işlem, 80 ms içinde", expr: "(() => { const c = new LRUOnbellek(1000); let s = 0; for (let i = 0; i < 100000; i++) { c.koy(i, i); const v = c.al(i - 500); if (v !== undefined) s++; } return s; })()", expected: 99302, maxMs: 80 }
        ],
        hints: ["Örnekteki 'sil ve yeniden ekle' hilesi her iki metotta da işe yarar.", "al: değer varsa delete + set ile sona taşı, sonra döndür.", "koy: varsa önce sil; ekle; boyut kapasiteyi aşarsa this.veri.delete(this.veri.keys().next().value)."],
        solution: "class LRUOnbellek {\n  constructor(kapasite) {\n    this.kapasite = kapasite;\n    this.veri = new Map();\n  }\n  al(anahtar) {\n    if (!this.veri.has(anahtar)) return undefined;\n    const v = this.veri.get(anahtar);\n    this.veri.delete(anahtar);\n    this.veri.set(anahtar, v);\n    return v;\n  }\n  koy(anahtar, deger) {\n    if (this.veri.has(anahtar)) this.veri.delete(anahtar);\n    this.veri.set(anahtar, deger);\n    if (this.veri.size > this.kapasite) this.veri.delete(this.veri.keys().next().value);\n  }\n}"
      },
      {
        id: "p49c3", kind: "Yaz", title: "Hız sınırlayıcı", fn: "hizSiniri",
        prompt: "`hizSiniri(limit, pencereMs, saat)` bir `izinVer(kullanici)` fonksiyonu döndürsün: her kullanıcı, **son `pencereMs` milisaniyede** en fazla `limit` istek yapabilir (kayan pencere). `saat()` şu anki zamanı ms olarak verir; testler zamanı kendisi ilerletir.",
        starter: "function hizSiniri(limit, pencereMs, saat) {\n  const kayit = new Map(); // kullanici → istek zamanları\n  return (kullanici) => {\n    \n  };\n}\n",
        tests: [
          { label: "limit içinde izin", expr: "(() => { let t = 0; const izin = hizSiniri(3, 1000, () => t); return [izin(\"a\"), izin(\"a\"), izin(\"a\")]; })()", expected: [true, true, true] },
          { label: "limit aşılınca ret", expr: "(() => { let t = 0; const izin = hizSiniri(2, 1000, () => t); izin(\"a\"); izin(\"a\"); return izin(\"a\"); })()", expected: false },
          { label: "kullanıcılar bağımsız", expr: "(() => { let t = 0; const izin = hizSiniri(1, 1000, () => t); return [izin(\"a\"), izin(\"b\"), izin(\"a\")]; })()", expected: [true, true, false] },
          { label: "pencere kayınca tekrar izin", expr: "(() => { let t = 0; const izin = hizSiniri(2, 1000, () => t); izin(\"a\"); t = 500; izin(\"a\"); t = 999; const r1 = izin(\"a\"); t = 1001; const r2 = izin(\"a\"); return [r1, r2]; })()", expected: [false, true] },
          { label: "reddedilen istek sayılmaz", expr: "(() => { let t = 0; const izin = hizSiniri(1, 100, () => t); izin(\"a\"); t = 50; izin(\"a\"); t = 101; return izin(\"a\"); })()", expected: true }
        ],
        hints: ["Her kullanıcı için son isteklerin zamanlarını bir dizide tut.", "Yeni istekte önce şu an − pencereMs'ten eski zamanları at.", "Kalan sayısı limit'ten azsa zamanı ekle ve true; değilse false (reddedileni ekleme)."],
        solution: "function hizSiniri(limit, pencereMs, saat) {\n  const kayit = new Map();\n  return (kullanici) => {\n    const simdi = saat();\n    const zamanlar = (kayit.get(kullanici) || []).filter((z) => simdi - z < pencereMs);\n    if (zamanlar.length >= limit) {\n      kayit.set(kullanici, zamanlar);\n      return false;\n    }\n    zamanlar.push(simdi);\n    kayit.set(kullanici, zamanlar);\n    return true;\n  };\n}"
      }
    ],
    cards: [
      { id: "p49k1", q: "LRU önbellek neyi atar?", a: "Kapasite dolunca en uzun süredir kullanılmayan (okunmayan ya da yazılmayan) girdiyi." },
      { id: "p49k2", q: "Zamana bağlı kodu test edilebilir yapmanın yolu?", a: "Saati parametre olarak almak (bağımlılık enjeksiyonu): testte sahte bir saat verilir." },
      { id: "p49k3", q: "OFFSET ile sayfalamanın büyük tablolardaki sorunu?", a: "Veritabanı atlanan satırları yine okur; derin sayfalar yavaşlar. Büyük veride 'imleç' (son görülen id) ile sayfalama tercih edilir." }
    ]
  },

  /* ============================ FAZ 50 ============================ */
  {
    id: "p50", no: 50, track: "backend", title: "Mini proje: kurs API'si", short: "API projesi",
    goal: "HTTP katmanını gerçek bir SQLite veritabanına bağla: listele, ekle ve detay getir; güvenli ve doğrulanmış.",
    concepts: ["parametreli sorgu", "SQL enjeksiyonu", "doğrulama + INSERT", "JOIN ile detay"],
    predict: {
      code: "const kategori = \"x' OR '1'='1\";\nconst sql = \"SELECT * FROM kurslar WHERE kategori = '\" + kategori + \"'\";\nconsole.log(sql);\n// Bu sorgu kaç kurs döndürür?",
      options: ["0", "1", "Tüm kurslar", "Hata verir"], answer: 2,
      why: "Kullanıcı girdisi SQL'in parçası oldu: WHERE kategori = 'x' OR '1'='1' her satır için doğru. Buna SQL enjeksiyonu denir. Çözüm: değeri asla metne yapıştırma, parametre olarak gönder (?)."
    },
    example: {
      title: "Parametreli sorgu",
      db: SEED,
      code: "// Bu fazda sorgu() ve calistir() hazır, arkada gerçek bir SQLite var.\nconst kategori = \"x' OR '1'='1\";\n\nconst guvenli = sorgu(\"SELECT id, ad FROM kurslar WHERE kategori = ?\", [kategori]);\nconsole.log(\"parametreli:\", guvenli.length, \"satır\");\n\nconst sonuc = calistir(\"INSERT INTO kurslar (ad, kategori, sure, fiyat) VALUES (?, ?, ?, ?)\", [\"Go\", \"backend\", 22, 1300]);\nconsole.log(sonuc);\nconsole.log(sorgu(\"SELECT ad, fiyat FROM kurslar WHERE id = ?\", [sonuc.sonId]));",
      steps: [
        { lines: [4], text: "? yer tutucusuna giden değer veri olarak kalır, SQL olarak yorumlanmaz. Enjeksiyon denemesi 0 satır döndürür." },
        { lines: [7], text: "calistir(), INSERT/UPDATE/DELETE için: değişen satır sayısını ve son eklenen id'yi döndürür." },
        { lines: [9], text: "sorgu() satırları nesne dizisi olarak döndürür: [{ ad: \"Go\", fiyat: 1300 }]." }
      ]
    },
    challenges: [
      {
        id: "p50c1", kind: "Değiştir", title: "Kursları listele", fn: "kurslariListele", db: SEED, timeout: T,
        prompt: "`kurslariListele(istek)` → `{ status: 200, body: [{ id, ad, fiyat }, …] }`, id'ye göre sıralı. `istek.sorgu.kategori` varsa o kategoriye süz. Başlangıç kodu çalışıyor ama **SQL enjeksiyonuna açık**; parametreli sorguya çevir.",
        starter: "function kurslariListele(istek) {\n  const { kategori } = istek.sorgu || {};\n  let sql = \"SELECT id, ad, fiyat FROM kurslar\";\n  if (kategori) sql += \" WHERE kategori = '\" + kategori + \"'\";\n  sql += \" ORDER BY id\";\n  return { status: 200, body: sorgu(sql) };\n}\n",
        tests: [
          { label: "tüm kurslar", expr: "kurslariListele({ sorgu: {} }).body.length", expected: 6 },
          { label: "kategoriye göre", expr: "kurslariListele({ sorgu: { kategori: \"backend\" } })", expected: { status: 200, body: [{ id: 3, ad: "Node.js", fiyat: 1400 }, { id: 4, ad: "SQL", fiyat: 900 }] } },
          { label: "enjeksiyon denemesi sonuç döndürmez", expr: "kurslariListele({ sorgu: { kategori: \"x' OR '1'='1\" } }).body.length", expected: 0 },
          { label: "tırnaklı kategori çökertmez", expr: "kurslariListele({ sorgu: { kategori: \"o'reilly\" } }).status", expected: 200 }
        ],
        hints: ["Değeri SQL metnine eklemek yerine yer tutucu kullan.", "sql += \" WHERE kategori = ?\"; ve parametreleri bir diziye koy.", "return { status: 200, body: sorgu(sql, params) };"],
        solution: "function kurslariListele(istek) {\n  const { kategori } = istek.sorgu || {};\n  let sql = \"SELECT id, ad, fiyat FROM kurslar\";\n  const params = [];\n  if (kategori) {\n    sql += \" WHERE kategori = ?\";\n    params.push(kategori);\n  }\n  sql += \" ORDER BY id\";\n  return { status: 200, body: sorgu(sql, params) };\n}"
      },
      {
        id: "p50c2", kind: "Yaz", title: "Kurs ekle", fn: "kursEkle", db: SEED, timeout: T,
        prompt: "`kursEkle(istek)`: `istek.govde` = `{ ad, kategori, sure, fiyat }`. Doğrula: `ad` en az 2 karakterli metin, `fiyat` 0 veya daha büyük sayı. Geçersizse `400 { hatalar: [...] }` (mesajlar: `\"ad en az 2 karakter\"`, `\"fiyat 0 veya daha büyük bir sayı olmalı\"`). Geçerliyse ekle ve `201 { id, ad, kategori, sure, fiyat }` döndür.",
        starter: "function kursEkle(istek) {\n  const g = istek.govde || {};\n  const hatalar = [];\n  \n}\n",
        tests: [
          { label: "geçerli kurs → 201", expr: "kursEkle({ govde: { ad: \"Go\", kategori: \"backend\", sure: 22, fiyat: 1300 } })", expected: { status: 201, body: { id: 7, ad: "Go", kategori: "backend", sure: 22, fiyat: 1300 } } },
          { label: "veritabanına yazıldı", expr: "sorgu(\"SELECT ad FROM kurslar WHERE id = 7\")", expected: [{ ad: "Go" }] },
          { label: "geçersiz → 400 ve iki hata", expr: "kursEkle({ govde: { ad: \"G\", fiyat: -5 } })", expected: { status: 400, body: { hatalar: ["ad en az 2 karakter", "fiyat 0 veya daha büyük bir sayı olmalı"] } } },
          { label: "geçersiz istek yazılmaz", expr: "sorgu(\"SELECT COUNT(*) AS n FROM kurslar\")[0].n", expected: 7 },
          { label: "fiyat metin olamaz", expr: "kursEkle({ govde: { ad: \"Rust\", fiyat: \"bedava\" } }).status", expected: 400 }
        ],
        hints: ["Önce tüm hataları topla, sonra karar ver. Hata varsa hiçbir şey yazma.", "typeof g.ad !== \"string\" || g.ad.length < 2 ve typeof g.fiyat !== \"number\" || g.fiyat < 0", "const r = calistir(\"INSERT INTO kurslar (ad, kategori, sure, fiyat) VALUES (?, ?, ?, ?)\", [g.ad, g.kategori ?? null, g.sure ?? null, g.fiyat]); — 201 gövdesinde id: r.sonId."],
        solution: "function kursEkle(istek) {\n  const g = istek.govde || {};\n  const hatalar = [];\n  if (typeof g.ad !== \"string\" || g.ad.trim().length < 2) hatalar.push(\"ad en az 2 karakter\");\n  if (typeof g.fiyat !== \"number\" || g.fiyat < 0) hatalar.push(\"fiyat 0 veya daha büyük bir sayı olmalı\");\n  if (hatalar.length) return { status: 400, body: { hatalar } };\n  const kayit = { ad: g.ad, kategori: g.kategori ?? null, sure: g.sure ?? null, fiyat: g.fiyat };\n  const r = calistir(\n    \"INSERT INTO kurslar (ad, kategori, sure, fiyat) VALUES (?, ?, ?, ?)\",\n    [kayit.ad, kayit.kategori, kayit.sure, kayit.fiyat]\n  );\n  return { status: 201, body: { id: r.sonId, ...kayit } };\n}"
      },
      {
        id: "p50c3", kind: "Yaz", title: "Kurs detayı", fn: "kursDetay", db: SEED, timeout: T,
        prompt: "`kursDetay(istek)` (`istek.params.id`) → `200 { id, ad, kayitSayisi, ortalamaPuan }`. `ortalamaPuan` bir ondalığa yuvarlanmış, NULL puanlar hariç; hiç puan yoksa `null`. Kurs yoksa `404 { hata: \"Kurs bulunamadı\" }`. Tek sorguda LEFT JOIN + GROUP BY kullan.",
        starter: "function kursDetay(istek) {\n  const id = Number(istek.params.id);\n  \n}\n",
        tests: [
          { label: "kurs 1", expr: "kursDetay({ params: { id: \"1\" } })", expected: { status: 200, body: { id: 1, ad: "JavaScript Temelleri", kayitSayisi: 4, ortalamaPuan: 76.5 } } },
          { label: "puanı eksik kayıt", expr: "kursDetay({ params: { id: \"4\" } }).body", expected: { id: 4, ad: "SQL", kayitSayisi: 3, ortalamaPuan: 84 } },
          { label: "kayıtsız kurs", expr: "(calistir(\"INSERT INTO kurslar (id, ad) VALUES (9, 'Docker')\"), kursDetay({ params: { id: \"9\" } }).body)", expected: { id: 9, ad: "Docker", kayitSayisi: 0, ortalamaPuan: null } },
          { label: "olmayan kurs → 404", expr: "kursDetay({ params: { id: \"99\" } })", expected: { status: 404, body: { hata: "Kurs bulunamadı" } } }
        ],
        hints: ["Kayıtsız kursun da sayılması gerekiyor. Hangi JOIN türü eşleşmeyen satırı korur?", "SELECT ku.id, ku.ad, COUNT(k.kurs_id) AS kayitSayisi, ROUND(AVG(k.puan), 1) AS ortalamaPuan FROM kurslar ku LEFT JOIN kayitlar k ON k.kurs_id = ku.id WHERE ku.id = ? GROUP BY ku.id", "Satır yoksa 404. COUNT(*) değil COUNT(k.kurs_id): LEFT JOIN'in NULL satırını saymamak için."],
        solution: "function kursDetay(istek) {\n  const id = Number(istek.params.id);\n  const [kurs] = sorgu(\n    `SELECT ku.id, ku.ad,\n            COUNT(k.kurs_id)     AS kayitSayisi,\n            ROUND(AVG(k.puan), 1) AS ortalamaPuan\n     FROM kurslar ku\n     LEFT JOIN kayitlar k ON k.kurs_id = ku.id\n     WHERE ku.id = ?\n     GROUP BY ku.id`,\n    [id]\n  );\n  if (!kurs) return { status: 404, body: { hata: \"Kurs bulunamadı\" } };\n  return { status: 200, body: kurs };\n}"
      }
    ],
    cards: [
      { id: "p50k1", q: "SQL enjeksiyonunun tek doğru çözümü?", a: "Parametreli sorgular (yer tutucular). Kaçış karakteri eklemek ya da girdiyi elle temizlemek yeterli değildir." },
      { id: "p50k2", q: "Bir API uç noktası isteği hangi sırayla işler?", a: "Ayrıştır → doğrula (hata varsa 400) → yetkiyi kontrol et → veritabanı işlemi → doğru durum koduyla yanıt." },
      { id: "p50k3", q: "LEFT JOIN + GROUP BY ile sayarken neden COUNT(*) yerine COUNT(sag.sutun)?", a: "Eşleşmesi olmayan satır NULL'larla bir kez gelir; COUNT(*) onu 1 sayar, COUNT(sag.sutun) 0 sayar." }
    ]
  }
  ];

  window.KD_CURRICULUM = (window.KD_CURRICULUM || []).concat(BACKEND);
})();
