/* QUAGEN NextGen — Müfredat: JavaScript Temelleri, Faz 1–10
 * Her faz: predict (ön test), example (çözümlü örnek, adım adım),
 * challenges (Değiştir → Yaz → Hata ayıkla), cards (aralıklı tekrar).
 * Test biçimi: {args:[...], expected} | {expr:"ifade", expected} | {args, throws:"mesaj"}
 */
window.KD_CURRICULUM = [
  {
    id: "p1", no: 1, title: "Değişkenler & Veri Tipleri", short: "Değişkenler",
    goal: "Veriyi isimlendirmeyi, tiplerini tanımayı ve metin birleştirmeyi öğren.",
    concepts: ["let / const", "string · number · boolean", "typeof", "template literal"],
    predict: {
      code: 'let a = 5;\nlet b = "5";\nconsole.log(a + b);',
      options: ["10", "55", "Hata verir", "NaN"], answer: 1,
      why: "Bir taraf string olduğunda + operatörü toplama değil birleştirme yapar: 5 metne çevrilir ve \"55\" oluşur."
    },
    example: {
      title: "Bir kullanıcı kartı oluşturmak",
      code: 'const isim = "Deniz";\nlet yas = 21;\nyas = yas + 1;\nconst mesaj = `${isim} ${yas} yaşında`;\nconsole.log(mesaj);\nconsole.log(typeof yas);',
      steps: [
        { lines: [1], text: "const: değeri bir daha değişmeyecek bir isim. \"Deniz\" bir string (metin)." },
        { lines: [2], text: "let: değeri sonradan değişebilir. 21 bir number." },
        { lines: [3], text: "Sağ taraf önce hesaplanır (21 + 1 = 22), sonra yas'a atanır. const olsaydı burada hata alırdık." },
        { lines: [4], text: "Backtick (`) ile template literal: ${...} içine yazılan değer metne gömülür." },
        { lines: [5, 6], text: "Çıktı: \"Deniz 22 yaşında\" ve \"number\". typeof bir değerin tipini metin olarak verir." }
      ]
    },
    challenges: [
      {
        id: "p1c1", kind: "Değiştir", title: "Selamlama", fn: "selamla",
        prompt: "`selamla(isim)` fonksiyonu verilen isimle **\"Merhaba, İSİM!\"** metnini döndürsün. Örnekteki template literal yapısını kullan.",
        starter: 'function selamla(isim) {\n  // template literal kullan: `...${isim}...`\n  return "";\n}\n',
        tests: [
          { args: ["Ayşe"], expected: "Merhaba, Ayşe!" },
          { args: ["Mert"], expected: "Merhaba, Mert!" },
          { args: [""], expected: "Merhaba, !" }
        ],
        hints: [
          "Döndürmen gereken metnin hangi kısmı sabit, hangi kısmı değişken?",
          "Template literal backtick ile yazılır: `Merhaba, ${...}!`",
          "return `Merhaba, ${isim}!`; — virgül ve ünlem işaretine dikkat."
        ],
        solution: "function selamla(isim) {\n  return `Merhaba, ${isim}!`;\n}"
      },
      {
        id: "p1c2", kind: "Yaz", title: "Tip Dedektifi", fn: "tipiNe",
        prompt: "`tipiNe(deger)` verilen değerin tipini metin olarak döndürsün (\"number\", \"string\" ...).",
        starter: "function tipiNe(deger) {\n  \n}\n",
        tests: [
          { args: [42], expected: "number" },
          { args: ["kod"], expected: "string" },
          { args: [true], expected: "boolean" },
          { expr: "tipiNe(undefined)", label: "tipiNe(undefined)", expected: "undefined" }
        ],
        hints: [
          "JavaScript'te bir değerin tipini söyleyen hazır bir operatör var. Örnekte gördün mü?",
          "typeof operatörü tipi string olarak verir.",
          "return typeof deger;"
        ],
        solution: "function tipiNe(deger) {\n  return typeof deger;\n}"
      },
      {
        id: "p1c3", kind: "Yaz", title: "Sıcaklık Çevirici", fn: "celsiusToF",
        prompt: "`celsiusToF(c)` Celsius değerini Fahrenheit'a çevirsin. Formül: **F = C × 9 / 5 + 32**",
        starter: "function celsiusToF(c) {\n  \n}\n",
        tests: [
          { args: [0], expected: 32 }, { args: [100], expected: 212 },
          { args: [-40], expected: -40 }, { args: [37], expected: 98.6 }
        ],
        hints: [
          "Formülü JavaScript operatörlerine nasıl çevirirsin? × işareti kodda neyle yazılır?",
          "Çarpma * ile, bölme / ile yazılır. İşlem önceliği matematikteki gibidir.",
          "return c * 9 / 5 + 32;"
        ],
        solution: "function celsiusToF(c) {\n  return c * 9 / 5 + 32;\n}"
      }
    ],
    cards: [
      { id: "p1k1", q: "let ile const arasındaki fark nedir?", a: "let ile tanımlanan değişkene yeniden değer atanabilir; const ile tanımlanana atanamaz." },
      { id: "p1k2", q: "5 + \"5\" sonucu nedir, neden?", a: "\"55\". Bir taraf string ise + birleştirme yapar." },
      { id: "p1k3", q: "Bir değişkeni metin içine gömmenin modern yolu?", a: "Template literal: `Merhaba ${isim}` (backtick ile)." }
    ]
  },

  {
    id: "p2", no: 2, title: "Operatörler & Koşullar", short: "Koşullar",
    goal: "Karşılaştırma yapmayı ve programına karar verdirmeyi öğren.",
    concepts: ["=== vs ==", "% (mod)", "if / else if / else", "&& ||"],
    predict: {
      code: 'console.log(0 == "0");\nconsole.log(0 === "0");',
      options: ["true, true", "false, false", "true, false", "false, true"], answer: 2,
      why: "== tipleri dönüştürüp karşılaştırır (0 ile \"0\" eşit sayılır). === tip dönüşümü yapmaz: number ≠ string. Her zaman === kullan."
    },
    example: {
      title: "Bilet fiyatı hesaplamak",
      code: 'function biletFiyati(yas) {\n  if (yas < 12) {\n    return 50;\n  } else if (yas >= 65) {\n    return 60;\n  } else {\n    return 100;\n  }\n}\nconsole.log(biletFiyati(8), biletFiyati(30), biletFiyati(70));',
      steps: [
        { lines: [1], text: "Fonksiyon bir yaş alır, bir fiyat döndürecek." },
        { lines: [2, 3], text: "İlk koşul doğruysa hemen 50 döner — aşağısı hiç çalışmaz." },
        { lines: [4, 5], text: "else if: ilk koşul yanlışsa sıradaki kontrol edilir." },
        { lines: [6, 7], text: "else: hiçbir koşul tutmazsa varsayılan durum." },
        { lines: [10], text: "Çıktı: 50 100 60. Koşulların SIRASI önemlidir: yukarıdan aşağı ilk doğru olan kazanır." }
      ]
    },
    challenges: [
      {
        id: "p2c1", kind: "Değiştir", title: "Çift mi?", fn: "ciftMi",
        prompt: "`ciftMi(n)` sayı çiftse `true`, tekse `false` döndürsün. İpucu: `%` kalanı verir.",
        starter: "function ciftMi(n) {\n  \n}\n",
        tests: [{ args: [4], expected: true }, { args: [7], expected: false }, { args: [0], expected: true }, { args: [-3], expected: false }],
        hints: ["Bir sayının çift olduğunu matematiksel olarak nasıl anlarsın?", "n % 2, n'nin 2'ye bölümünden kalanı verir. Çift sayılarda kalan kaçtır?", "return n % 2 === 0;"],
        solution: "function ciftMi(n) {\n  return n % 2 === 0;\n}"
      },
      {
        id: "p2c2", kind: "Yaz", title: "Harf Notu", fn: "notHarfi",
        prompt: "`notHarfi(puan)`: 90+ → \"A\", 80+ → \"B\", 70+ → \"C\", 60+ → \"D\", altı → \"F\".",
        starter: "function notHarfi(puan) {\n  \n}\n",
        tests: [{ args: [95], expected: "A" }, { args: [90], expected: "A" }, { args: [85], expected: "B" }, { args: [70], expected: "C" }, { args: [61], expected: "D" }, { args: [12], expected: "F" }],
        hints: ["Örnekteki bilet fiyatı yapısına benziyor. Koşulları hangi sırayla yazmalısın?", "En yüksek eşikten başla: if (puan >= 90) ... else if (puan >= 80) ...", "Sınırlarda >= kullandığından emin ol: 90 tam olarak \"A\" olmalı."],
        solution: 'function notHarfi(puan) {\n  if (puan >= 90) return "A";\n  if (puan >= 80) return "B";\n  if (puan >= 70) return "C";\n  if (puan >= 60) return "D";\n  return "F";\n}'
      },
      {
        id: "p2c3", kind: "Yaz", title: "Artık Yıl", fn: "artikYil",
        prompt: "`artikYil(yil)`: 4'e bölünen yıllar artıktır; **ama** 100'e bölünenler değildir; **ama** 400'e bölünenler yine artıktır.",
        starter: "function artikYil(yil) {\n  \n}\n",
        tests: [{ args: [2024], expected: true }, { args: [2023], expected: false }, { args: [1900], expected: false }, { args: [2000], expected: true }],
        hints: ["Kuralları en özel durumdan en genele doğru sıralarsan ne olur?", "Önce 400, sonra 100, sonra 4 kontrolü yap. Ya da && ve || ile tek satırda birleştir.", "return (yil % 4 === 0 && yil % 100 !== 0) || yil % 400 === 0;"],
        solution: "function artikYil(yil) {\n  return (yil % 4 === 0 && yil % 100 !== 0) || yil % 400 === 0;\n}"
      }
    ],
    cards: [
      { id: "p2k1", q: "== ile === farkı?", a: "== tip dönüşümü yapar, === yapmaz. Neredeyse her zaman === kullan." },
      { id: "p2k2", q: "JavaScript'teki falsy değerler hangileri?", a: "false, 0, \"\", null, undefined, NaN (ve 0n)." },
      { id: "p2k3", q: "if / else if zincirinde hangi blok çalışır?", a: "Yukarıdan aşağı ilk doğru olan koşulun bloğu; diğerleri atlanır." }
    ]
  },

  {
    id: "p3", no: 3, title: "Döngüler", short: "Döngüler",
    goal: "Tekrarlayan işleri bilgisayara yaptırmayı ve döngü sınırlarını doğru kurmayı öğren.",
    concepts: ["for", "while", "biriktirici (accumulator)", "off-by-one"],
    predict: {
      code: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}",
      options: ["1 2 3", "0 1 2", "0 1 2 3", "Sonsuz döngü"], answer: 1,
      why: "i 0'dan başlar; i < 3 olduğu sürece döner: 0, 1, 2. i 3 olunca koşul yanlış olur ve döngü biter."
    },
    example: {
      title: "1'den 5'e kadar çarpım (biriktirici deseni)",
      code: "let sonuc = 1;\nfor (let i = 1; i <= 5; i++) {\n  sonuc = sonuc * i;\n}\nconsole.log(sonuc);",
      steps: [
        { lines: [1], text: "Biriktirici: çarpımda başlangıç 1, toplamda 0 olur. Neden? Etkisiz eleman." },
        { lines: [2], text: "Üç parça: başlangıç (i = 1) · koşul (i <= 5) · adım (i++)." },
        { lines: [3], text: "Her turda biriktirici güncellenir: 1 → 2 → 6 → 24 → 120." },
        { lines: [5], text: "Döngü bitince sonuç yazdırılır: 120. Bu deseni çok kullanacaksın." }
      ]
    },
    challenges: [
      {
        id: "p3c1", kind: "Değiştir", title: "Toplama Kadar", fn: "toplamaKadar",
        prompt: "`toplamaKadar(n)` 1'den n'e kadar sayıların toplamını döndürsün. n = 0 ise 0.",
        starter: "function toplamaKadar(n) {\n  let toplam = 0;\n  // for döngüsü yaz\n  return toplam;\n}\n",
        tests: [{ args: [5], expected: 15 }, { args: [1], expected: 1 }, { args: [0], expected: 0 }, { args: [100], expected: 5050 }],
        hints: ["Örnekteki çarpım döngüsünü toplamaya nasıl çevirirsin?", "for (let i = 1; i <= n; i++) { ... } içinde toplam'a i ekle.", "toplam = toplam + i;  (veya toplam += i;)"],
        solution: "function toplamaKadar(n) {\n  let toplam = 0;\n  for (let i = 1; i <= n; i++) toplam += i;\n  return toplam;\n}"
      },
      {
        id: "p3c2", kind: "Yaz", title: "Faktöriyel", fn: "faktoriyel",
        prompt: "`faktoriyel(n)` n! değerini döndürsün. 0! = 1.",
        starter: "function faktoriyel(n) {\n  \n}\n",
        tests: [{ args: [0], expected: 1 }, { args: [1], expected: 1 }, { args: [5], expected: 120 }, { args: [10], expected: 3628800 }],
        hints: ["Biriktiricinin başlangıç değeri ne olmalı ki 0! = 1 otomatik çıksın?", "let sonuc = 1; ile başla, 1'den n'e kadar çarp.", "n = 0 iken döngü hiç dönmez ve 1 döner — tam istediğimiz gibi."],
        solution: "function faktoriyel(n) {\n  let sonuc = 1;\n  for (let i = 2; i <= n; i++) sonuc *= i;\n  return sonuc;\n}"
      },
      {
        id: "p3c3", kind: "Yaz", title: "FizzBuzz", fn: "fizzBuzz",
        prompt: "`fizzBuzz(n)` 1..n için bir **dizi** döndürsün: 3 ve 5'e bölünene \"FizzBuzz\", sadece 3'e \"Fizz\", sadece 5'e \"Buzz\", diğerlerine sayının string hali.",
        starter: "function fizzBuzz(n) {\n  const sonuc = [];\n  \n  return sonuc;\n}\n",
        tests: [
          { args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
          { expr: "fizzBuzz(15)[14]", label: "fizzBuzz(15)[14]", expected: "FizzBuzz" },
          { expr: "fizzBuzz(15).length", label: "fizzBuzz(15).length", expected: 15 }
        ],
        hints: ["Hangi koşulu ÖNCE kontrol etmelisin? 15 için ne olur?", "Önce i % 15 === 0 (veya 3 ve 5) kontrolü, sonra 3, sonra 5. Diziye eklemek için sonuc.push(...).", "Sayıyı stringe çevirmek için String(i)."],
        solution: 'function fizzBuzz(n) {\n  const sonuc = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) sonuc.push("FizzBuzz");\n    else if (i % 3 === 0) sonuc.push("Fizz");\n    else if (i % 5 === 0) sonuc.push("Buzz");\n    else sonuc.push(String(i));\n  }\n  return sonuc;\n}'
      }
    ],
    cards: [
      { id: "p3k1", q: "for döngüsünün üç parçası?", a: "Başlangıç; koşul; adım — for (let i = 0; i < n; i++)" },
      { id: "p3k2", q: "Off-by-one hatası nedir?", a: "Döngünün bir eksik ya da bir fazla dönmesi; genelde < yerine <= (veya tersi) kullanmaktan." },
      { id: "p3k3", q: "Toplam ve çarpım biriktiricileri hangi değerle başlar?", a: "Toplam 0, çarpım 1 (etkisiz elemanlar)." }
    ]
  },

  {
    id: "p4", no: 4, title: "Fonksiyonlar & Kapsam", short: "Fonksiyonlar",
    goal: "Kodunu yeniden kullanılabilir parçalara böl; arrow function ve closure kavramını kavra.",
    concepts: ["parametre / return", "arrow function", "kapsam (scope)", "closure"],
    predict: {
      code: "function sayac() {\n  let c = 0;\n  return () => ++c;\n}\nconst s = sayac();\ns();\nconsole.log(s());",
      options: ["1", "2", "0", "undefined"], answer: 1,
      why: "İçteki fonksiyon c'yi 'hatırlar' (closure). İlk s() c'yi 1 yapar, ikincisi 2 yapar ve 2 döndürür."
    },
    example: {
      title: "Fonksiyon üreten fonksiyon",
      code: "const carpanYap = (k) => {\n  return (x) => x * k;\n};\nconst ikiKat = carpanYap(2);\nconst ucKat = carpanYap(3);\nconsole.log(ikiKat(5), ucKat(5));",
      steps: [
        { lines: [1], text: "Arrow function: (parametre) => { gövde }. carpanYap bir k alır." },
        { lines: [2], text: "Geriye YENİ bir fonksiyon döndürür. Bu fonksiyon k'yi kendi kapsamında saklar: closure." },
        { lines: [4, 5], text: "İki ayrı fonksiyon ürettik; biri k=2'yi, diğeri k=3'ü hatırlıyor." },
        { lines: [6], text: "Çıktı: 10 15. Tek satırlık arrow'da süslü parantez ve return yazmana gerek yok: x => x * k" }
      ]
    },
    challenges: [
      {
        id: "p4c1", kind: "Değiştir", title: "Kare (arrow)", fn: "kare",
        prompt: "`kare` adında bir **arrow function** yaz: sayının karesini döndürsün. `const kare = ...`",
        starter: "const kare = (x) => {\n  \n};\n",
        tests: [{ args: [3], expected: 9 }, { args: [-4], expected: 16 }, { args: [0], expected: 0 }],
        hints: ["Arrow function'ın gövdesinde de return gerekir mi?", "Süslü parantez kullanıyorsan return yazmalısın: return x * x;", "Daha kısa: const kare = x => x * x;"],
        solution: "const kare = x => x * x;"
      },
      {
        id: "p4c2", kind: "Yaz", title: "En Büyük", fn: "enBuyuk",
        prompt: "`enBuyuk(a, b, c)` üç sayıdan en büyüğünü döndürsün. **Math.max kullanmadan** dene.",
        starter: "function enBuyuk(a, b, c) {\n  \n}\n",
        tests: [{ args: [1, 2, 3], expected: 3 }, { args: [9, 2, 3], expected: 9 }, { args: [-1, -5, -2], expected: -1 }, { args: [4, 4, 1], expected: 4 }],
        hints: ["Bir 'şimdiye kadarki en büyük' değişkeni tutsan?", "let max = a; sonra b ve c ile karşılaştırıp gerekirse güncelle.", "if (b > max) max = b; if (c > max) max = c; return max;"],
        solution: "function enBuyuk(a, b, c) {\n  let max = a;\n  if (b > max) max = b;\n  if (c > max) max = c;\n  return max;\n}"
      },
      {
        id: "p4c3", kind: "Yaz", title: "Sayaç Fabrikası", fn: "sayacOlustur",
        prompt: "`sayacOlustur()` her çağrıldığında bir öncekinden 1 fazla döndüren **yeni bir fonksiyon** döndürsün. Her sayaç bağımsız olmalı.",
        starter: "function sayacOlustur() {\n  \n}\n",
        tests: [
          { expr: "(() => { const s = sayacOlustur(); return s(); })()", label: "ilk çağrı → 1", expected: 1 },
          { expr: "(() => { const s = sayacOlustur(); s(); s(); return s(); })()", label: "üçüncü çağrı → 3", expected: 3 },
          { expr: "(() => { const a = sayacOlustur(), b = sayacOlustur(); a(); a(); return b(); })()", label: "sayaçlar bağımsız", expected: 1 }
        ],
        hints: ["Tahmin sorusundaki koda tekrar bak. Sayının saklanacağı değişken nerede tanımlanmalı?", "Dış fonksiyonda let sayi = 0; tanımla, içte artırıp döndüren fonksiyonu return et.", "return () => { sayi++; return sayi; };"],
        solution: "function sayacOlustur() {\n  let sayi = 0;\n  return () => ++sayi;\n}"
      }
    ],
    cards: [
      { id: "p4k1", q: "Closure nedir?", a: "Bir fonksiyonun, tanımlandığı kapsamdaki değişkenleri o kapsam bittikten sonra da hatırlaması." },
      { id: "p4k2", q: "console.log ile return farkı?", a: "console.log ekrana yazar; return değeri çağırana geri verir. Testler return edilen değeri kontrol eder." },
      { id: "p4k3", q: "x => x * 2 neden return içermez?", a: "Tek ifadeli arrow function'larda süslü parantez yoksa ifade otomatik döndürülür." }
    ]
  },

  {
    id: "p5", no: 5, title: "Diziler", short: "Diziler",
    goal: "Veri listeleriyle çalış: erişim, ekleme, dolaşma ve yeni dizi üretme.",
    concepts: ["index (0'dan başlar)", "length", "push / pop", "for...of"],
    predict: {
      code: "const a = [1, 2, 3];\na.push(4);\nconsole.log(a.length, a[0]);",
      options: ["3 1", "4 1", "4 0", "Hata: a const"], answer: 1,
      why: "const, değişkenin başka diziye bağlanmasını engeller; dizinin İÇERİĞİ değişebilir. push sonrası uzunluk 4, ilk eleman a[0] = 1."
    },
    example: {
      title: "Pozitif sayıları ayıklamak",
      code: "const sayilar = [3, -1, 7, -4, 0];\nconst pozitifler = [];\nfor (const s of sayilar) {\n  if (s > 0) pozitifler.push(s);\n}\nconsole.log(pozitifler);",
      steps: [
        { lines: [1], text: "Dizi köşeli parantezle yazılır. sayilar[0] → 3, sayilar.length → 5." },
        { lines: [2], text: "Sonuçları biriktireceğimiz boş dizi." },
        { lines: [3], text: "for...of dizinin her elemanını sırayla s'ye koyar; index'e ihtiyacın yoksa en okunaklı yol." },
        { lines: [4], text: "Koşulu sağlayan eleman push ile sona eklenir." },
        { lines: [6], text: "Çıktı: [3, 7]. Orijinal dizi değişmedi — yeni dizi ürettik." }
      ]
    },
    challenges: [
      {
        id: "p5c1", kind: "Değiştir", title: "Dizi Toplamı", fn: "diziToplam",
        prompt: "`diziToplam(dizi)` dizideki sayıların toplamını döndürsün. Boş dizi → 0.",
        starter: "function diziToplam(dizi) {\n  \n}\n",
        tests: [{ args: [[1, 2, 3]], expected: 6 }, { args: [[]], expected: 0 }, { args: [[-5, 5, 10]], expected: 10 }],
        hints: ["Faz 3'teki biriktirici deseni burada da işe yarar mı?", "let toplam = 0; for (const s of dizi) ...", "toplam += s; ve sonunda return toplam;"],
        solution: "function diziToplam(dizi) {\n  let toplam = 0;\n  for (const s of dizi) toplam += s;\n  return toplam;\n}"
      },
      {
        id: "p5c2", kind: "Yaz", title: "Ters Çevir", fn: "tersCevir",
        prompt: "`tersCevir(dizi)` diziyi ters sırada içeren **yeni** bir dizi döndürsün. `.reverse()` kullanma.",
        starter: "function tersCevir(dizi) {\n  \n}\n",
        tests: [{ args: [[1, 2, 3]], expected: [3, 2, 1] }, { args: [["a"]], expected: ["a"] }, { args: [[]], expected: [] }],
        hints: ["Diziyi sondan başa doğru dolaşmanın bir yolu var mı?", "Son elemanın index'i dizi.length - 1'dir. i'yi azaltan bir for kur.", "for (let i = dizi.length - 1; i >= 0; i--) yeni.push(dizi[i]);"],
        solution: "function tersCevir(dizi) {\n  const yeni = [];\n  for (let i = dizi.length - 1; i >= 0; i--) yeni.push(dizi[i]);\n  return yeni;\n}"
      },
      {
        id: "p5c3", kind: "Yaz", title: "Benzersizler", fn: "benzersiz",
        prompt: "`benzersiz(dizi)` tekrar eden elemanları atıp **ilk görülme sırasını koruyarak** yeni dizi döndürsün.",
        starter: "function benzersiz(dizi) {\n  \n}\n",
        tests: [{ args: [[1, 2, 2, 3, 1]], expected: [1, 2, 3] }, { args: [["a", "b", "a"]], expected: ["a", "b"] }, { args: [[]], expected: [] }],
        hints: ["Bir elemanı eklemeden önce, sonuç dizisinde zaten var mı diye nasıl bakarsın?", "sonuc.includes(x) true/false döndürür.", "Bonus: new Set(dizi) ile tek satırda çözülür: [...new Set(dizi)]"],
        solution: "function benzersiz(dizi) {\n  const sonuc = [];\n  for (const x of dizi) if (!sonuc.includes(x)) sonuc.push(x);\n  return sonuc;\n}"
      }
    ],
    cards: [
      { id: "p5k1", q: "Bir dizinin son elemanına nasıl erişilir?", a: "dizi[dizi.length - 1]  (veya dizi.at(-1))" },
      { id: "p5k2", q: "const ile tanımlanan diziye push yapılabilir mi?", a: "Evet. const yeniden atamayı engeller, içeriği değil." },
      { id: "p5k3", q: "for...of ile for...in farkı (dizilerde)?", a: "for...of değerleri, for...in anahtarları (index) dolaşır. Dizilerde for...of kullan." }
    ]
  },

  {
    id: "p6", no: 6, title: "Nesneler", short: "Nesneler",
    goal: "Gerçek dünya verisini anahtar–değer çiftleriyle modelle.",
    concepts: ["obj.anahtar / obj[anahtar]", "Object.keys", "referans vs kopya", "spread {...}"],
    predict: {
      code: 'const k = { ad: "Ali" };\nconst k2 = k;\nk2.ad = "Veli";\nconsole.log(k.ad);',
      options: ["Ali", "Veli", "undefined", "Hata"], answer: 1,
      why: "Nesneler referansla tutulur. k2 = k bir kopya değil, AYNI nesneye ikinci bir isimdir. Kopya için { ...k } kullan."
    },
    example: {
      title: "Ürün stoğunu saymak",
      code: 'const stok = { elma: 3, armut: 0 };\nstok.muz = 5;\nstok["elma"] += 2;\nfor (const meyve of Object.keys(stok)) {\n  console.log(meyve, stok[meyve]);\n}',
      steps: [
        { lines: [1], text: "Nesne: { anahtar: değer }. Anahtarlar stringdir." },
        { lines: [2], text: "Olmayan bir anahtara atama yapmak onu ekler." },
        { lines: [3], text: "Köşeli parantez gösterimi: anahtar bir değişkende tutuluyorsa ŞART olur." },
        { lines: [4, 5], text: "Object.keys anahtarları dizi olarak verir; stok[meyve] ile değere ulaşırız. Çıktı: elma 5 · armut 0 · muz 5" }
      ]
    },
    challenges: [
      {
        id: "p6c1", kind: "Değiştir", title: "Kişi Oluştur", fn: "kisiOlustur",
        prompt: "`kisiOlustur(ad, yas)` `{ ad, yas }` biçiminde bir nesne döndürsün.",
        starter: "function kisiOlustur(ad, yas) {\n  return {\n    \n  };\n}\n",
        tests: [{ args: ["Ece", 25], expected: { ad: "Ece", yas: 25 } }, { args: ["Can", 3], expected: { ad: "Can", yas: 3 } }],
        hints: ["Nesne içinde anahtar ve değer nasıl yazılır?", "ad: ad, yas: yas", "Kısayol: değişken adı anahtarla aynıysa sadece { ad, yas } yazabilirsin."],
        solution: "function kisiOlustur(ad, yas) {\n  return { ad, yas };\n}"
      },
      {
        id: "p6c2", kind: "Yaz", title: "Anahtar Say", fn: "anahtarSay",
        prompt: "`anahtarSay(nesne)` nesnedeki anahtar sayısını döndürsün.",
        starter: "function anahtarSay(nesne) {\n  \n}\n",
        tests: [{ args: [{ a: 1, b: 2 }], expected: 2 }, { args: [{}], expected: 0 }, { args: [{ x: null, y: 0, z: "" }], expected: 3 }],
        hints: ["Örnekte anahtarları dizi olarak veren bir fonksiyon vardı.", "Object.keys(nesne) bir dizi döndürür. Dizinin uzunluğu?", "return Object.keys(nesne).length;"],
        solution: "function anahtarSay(nesne) {\n  return Object.keys(nesne).length;\n}"
      },
      {
        id: "p6c3", kind: "Yaz", title: "Karakter Frekansı", fn: "karakterFrekansi",
        prompt: "`karakterFrekansi(metin)` her karakterin kaç kez geçtiğini nesne olarak döndürsün. \"aab\" → `{ a: 2, b: 1 }`",
        starter: "function karakterFrekansi(metin) {\n  const sayim = {};\n  \n  return sayim;\n}\n",
        tests: [{ args: ["aab"], expected: { a: 2, b: 1 } }, { args: [""], expected: {} }, { args: ["kodkod"], expected: { k: 2, o: 2, d: 2 } }],
        hints: ["Bir karakteri ilk kez gördüğünde ve tekrar gördüğünde ne yapman gerekir?", "for (const ch of metin) ile karakterleri dolaş; sayim[ch] yoksa 1, varsa +1.", "sayim[ch] = (sayim[ch] || 0) + 1;"],
        solution: "function karakterFrekansi(metin) {\n  const sayim = {};\n  for (const ch of metin) sayim[ch] = (sayim[ch] || 0) + 1;\n  return sayim;\n}"
      }
    ],
    cards: [
      { id: "p6k1", q: "obj.ad ile obj[\"ad\"] ne zaman farklı davranır?", a: "Anahtar bir değişkende tutuluyorsa ya da özel karakter içeriyorsa sadece köşeli parantez çalışır: obj[anahtar]." },
      { id: "p6k2", q: "const b = a; (a bir nesne) b'yi değiştirmek a'yı etkiler mi?", a: "Evet, ikisi aynı nesneyi gösterir. Sığ kopya: const b = { ...a }." },
      { id: "p6k3", q: "Nesnenin anahtarlarını dizi olarak almak?", a: "Object.keys(obj) — değerler için Object.values, çiftler için Object.entries." }
    ]
  },

  {
    id: "p7", no: 7, title: "map · filter · reduce", short: "Dizi Metotları",
    goal: "Döngü yazmadan, bildirimsel (declarative) şekilde veri dönüştür.",
    concepts: ["map → dönüştür", "filter → süz", "reduce → indirge", "zincirleme"],
    predict: {
      code: "const r = [1, 2, 3]\n  .map(x => x * 2)\n  .filter(x => x > 2);\nconsole.log(r);",
      options: ["[2, 4, 6]", "[4, 6]", "[3]", "[1, 2, 3]"], answer: 1,
      why: "map her elemanı ikiye katlar: [2, 4, 6]. filter 2'den büyükleri tutar: [4, 6]."
    },
    example: {
      title: "Sipariş listesinden rapor",
      code: 'const siparisler = [\n  { urun: "kalem", tutar: 20, odendi: true },\n  { urun: "defter", tutar: 45, odendi: false },\n  { urun: "çanta", tutar: 300, odendi: true }\n];\nconst odenenToplam = siparisler\n  .filter(s => s.odendi)\n  .map(s => s.tutar)\n  .reduce((acc, t) => acc + t, 0);\nconsole.log(odenenToplam);',
      steps: [
        { lines: [1, 2, 3, 4, 5], text: "Nesnelerden oluşan bir dizi — gerçek uygulamalarda veri hep böyle gelir." },
        { lines: [7], text: "filter: true dönen elemanları TUTAR. Sonuç: kalem ve çanta." },
        { lines: [8], text: "map: her elemanı başka bir şeye dönüştürür. Sonuç: [20, 300]." },
        { lines: [9], text: "reduce: diziyi tek değere indirger. acc biriktirici, 0 başlangıç değeri." },
        { lines: [10], text: "Çıktı: 320. Faz 3'teki biriktirici deseni = reduce!" }
      ]
    },
    challenges: [
      {
        id: "p7c1", kind: "Değiştir", title: "Kareler", fn: "kareler",
        prompt: "`kareler(dizi)` her sayının karesinden oluşan yeni diziyi **map** ile döndürsün.",
        starter: "function kareler(dizi) {\n  return dizi.map();\n}\n",
        tests: [{ args: [[1, 2, 3]], expected: [1, 4, 9] }, { args: [[]], expected: [] }, { args: [[-2]], expected: [4] }],
        hints: ["map'e her eleman için ne yapacağını söyleyen bir fonksiyon vermelisin.", "dizi.map(x => ...)", "return dizi.map(x => x * x);"],
        solution: "function kareler(dizi) {\n  return dizi.map(x => x * x);\n}"
      },
      {
        id: "p7c2", kind: "Yaz", title: "Yetişkinler", fn: "yetiskinler",
        prompt: "`yetiskinler(kisiler)` yaşı 18 ve üzeri olanların **sadece isimlerini** dizi olarak döndürsün. Kişi: `{ ad, yas }`",
        starter: "function yetiskinler(kisiler) {\n  \n}\n",
        tests: [
          { args: [[{ ad: "Ada", yas: 20 }, { ad: "Bo", yas: 12 }, { ad: "Cem", yas: 18 }]], expected: ["Ada", "Cem"] },
          { args: [[]], expected: [] }
        ],
        hints: ["İki adım var: önce süz, sonra dönüştür. Hangi metotlar?", "kisiler.filter(k => k.yas >= 18) ...", ".map(k => k.ad) ile zincirle."],
        solution: "function yetiskinler(kisiler) {\n  return kisiler.filter(k => k.yas >= 18).map(k => k.ad);\n}"
      },
      {
        id: "p7c3", kind: "Yaz", title: "Sepet Toplamı", fn: "sepetToplam",
        prompt: "`sepetToplam(urunler)` her ürün için `fiyat × adet` toplamını **reduce** ile döndürsün.",
        starter: "function sepetToplam(urunler) {\n  \n}\n",
        tests: [
          { args: [[{ fiyat: 10, adet: 2 }, { fiyat: 5, adet: 1 }]], expected: 25 },
          { args: [[]], expected: 0 },
          { args: [[{ fiyat: 99, adet: 0 }]], expected: 0 }
        ],
        hints: ["Boş sepet 0 vermeli. reduce'un ikinci argümanı neydi?", "urunler.reduce((acc, u) => ..., 0)", "acc + u.fiyat * u.adet"],
        solution: "function sepetToplam(urunler) {\n  return urunler.reduce((acc, u) => acc + u.fiyat * u.adet, 0);\n}"
      }
    ],
    cards: [
      { id: "p7k1", q: "map sonucu dizinin uzunluğu?", a: "Her zaman orijinal diziyle aynı uzunlukta." },
      { id: "p7k2", q: "filter'a verilen fonksiyon ne döndürmeli?", a: "true/false (truthy/falsy): true dönen eleman tutulur." },
      { id: "p7k3", q: "reduce'ta başlangıç değeri neden önemli?", a: "Boş dizide hatayı önler ve biriktiricinin tipini belirler (0, [], {} gibi)." }
    ]
  },

  {
    id: "p8", no: 8, title: "String & Algoritmik Düşünme", short: "Algoritmalar",
    goal: "Problemi küçük adımlara böl; metinlerle çalışmayı ve uç durumları düşünmeyi öğren.",
    concepts: ["split / join", "toLowerCase / trim", "uç durumlar", "problemi parçalama"],
    predict: {
      code: 'const s = "kod";\nconsole.log(s.split("").reverse().join(""));',
      options: ["kod", "dok", "[\"d\",\"o\",\"k\"]", "Hata"], answer: 1,
      why: "split(\"\") harflere ayırır → [k,o,d]; reverse ters çevirir → [d,o,k]; join(\"\") birleştirir → \"dok\"."
    },
    example: {
      title: "Bir problemi 4 adıma bölmek: en uzun kelime",
      code: 'function enUzunKelime(cumle) {\n  const kelimeler = cumle.trim().split(/\\s+/);\n  let enUzun = "";\n  for (const k of kelimeler) {\n    if (k.length > enUzun.length) enUzun = k;\n  }\n  return enUzun;\n}\nconsole.log(enUzunKelime("  bugün çok güzel kodladım "));',
      steps: [
        { lines: [1], text: "1) Girdi/çıktıyı netleştir: cümle girer, tek kelime çıkar." },
        { lines: [2], text: "2) Parçala: trim baştaki/sondaki boşlukları siler; /\\s+/ bir veya daha fazla boşluktan böler." },
        { lines: [3, 4, 5, 6], text: "3) Bildiğin deseni uygula: 'şimdiye kadarki en iyi' (Faz 4'teki enBuyuk ile aynı fikir)." },
        { lines: [9], text: "4) Uç durumla test et: fazla boşluklar. Çıktı: \"kodladım\"." }
      ]
    },
    challenges: [
      {
        id: "p8c1", kind: "Değiştir", title: "Palindrom mu?", fn: "palindromMu",
        prompt: "`palindromMu(metin)` metin tersten de aynı okunuyorsa `true` döndürsün. **Büyük/küçük harf ve boşlukları yok say.**",
        starter: "function palindromMu(metin) {\n  \n}\n",
        tests: [{ args: ["kek"], expected: true }, { args: ["Ey Edip Adanada pide ye"], expected: true }, { args: ["kod"], expected: false }, { args: [""], expected: true }],
        hints: ["Karşılaştırmadan önce metni nasıl 'temizlemelisin'?", "toLowerCase() ve boşlukları silmek için replaceAll(\" \", \"\") ya da replace(/\\s/g, \"\").", "const t = ...temiz; return t === t.split(\"\").reverse().join(\"\");"],
        solution: 'function palindromMu(metin) {\n  const t = metin.toLowerCase().replace(/\\s/g, "");\n  return t === t.split("").reverse().join("");\n}'
      },
      {
        id: "p8c2", kind: "Yaz", title: "Kelime Say", fn: "kelimeSay",
        prompt: "`kelimeSay(cumle)` cümledeki kelime sayısını döndürsün. Fazla boşluklar ve boş metin doğru sayılmalı.",
        starter: "function kelimeSay(cumle) {\n  \n}\n",
        tests: [{ args: ["merhaba dünya"], expected: 2 }, { args: ["  çok   boşluk  var "], expected: 3 }, { args: [""], expected: 0 }, { args: ["   "], expected: 0 }],
        hints: ["Örnekteki enUzunKelime kelimelere nasıl ayırıyordu?", "trim() + split(/\\s+/). Ama boş metinde split ne döndürür? Dene!", "Önce trim'le; sonuç \"\" ise 0 döndür."],
        solution: 'function kelimeSay(cumle) {\n  const t = cumle.trim();\n  if (t === "") return 0;\n  return t.split(/\\s+/).length;\n}'
      },
      {
        id: "p8c3", kind: "Yaz", title: "Baş Harfleri Büyüt", fn: "basHarfleriBuyut",
        prompt: "`basHarfleriBuyut(cumle)` her kelimenin ilk harfini büyük yapsın. \"merhaba dünya\" → \"Merhaba Dünya\"",
        starter: "function basHarfleriBuyut(cumle) {\n  \n}\n",
        tests: [{ args: ["merhaba dünya"], expected: "Merhaba Dünya" }, { args: ["a"], expected: "A" }, { args: ["javaScript öğren"], expected: "JavaScript Öğren" }],
        hints: ["Problemi parçala: kelimelere ayır → her kelimeyi dönüştür → birleştir. Hangi metotlar?", "split(\" \") → map(...) → join(\" \")", "k => k[0].toUpperCase() + k.slice(1)"],
        solution: 'function basHarfleriBuyut(cumle) {\n  return cumle.split(" ").map(k => k[0].toUpperCase() + k.slice(1)).join(" ");\n}'
      }
    ],
    cards: [
      { id: "p8k1", q: "String'ler değiştirilebilir mi (mutable)?", a: "Hayır. Metotlar her zaman YENİ bir string döndürür." },
      { id: "p8k2", q: "Problem çözmenin 4 adımı?", a: "Girdi/çıktıyı netleştir → küçük parçalara böl → bilinen desenleri uygula → uç durumlarla test et." },
      { id: "p8k3", q: "\"a b\".split(\" \") sonucu?", a: "[\"a\", \"b\"]  — join(\" \") ile geri birleşir." }
    ]
  },

  {
    id: "p9", no: 9, title: "Hatalar & Debugging", short: "Debugging",
    goal: "Hata mesajlarını oku, hataları yakala ve hatalı kodu sistematik olarak düzelt.",
    concepts: ["try / catch / finally", "throw new Error", "hata mesajı okumak", "sistematik debugging"],
    predict: {
      code: 'try {\n  null.x;\n} catch (e) {\n  console.log("yakalandı");\n} finally {\n  console.log("son");\n}',
      options: ["Program çöker", "yakalandı", "yakalandı, son", "son"], answer: 2,
      why: "null.x bir TypeError fırlatır; catch yakalar. finally hata olsun olmasın HER ZAMAN çalışır."
    },
    example: {
      title: "Güvenli yaş doğrulama",
      code: 'function yasDogrula(yas) {\n  if (typeof yas !== "number") {\n    throw new Error("Yaş sayı olmalı");\n  }\n  return yas >= 0 && yas < 150;\n}\ntry {\n  yasDogrula("on");\n} catch (hata) {\n  console.log("Hata:", hata.message);\n}',
      steps: [
        { lines: [2, 3], text: "Beklenmeyen girdide sessizce yanlış sonuç döndürmek yerine hata FIRLAT: throw new Error(mesaj)." },
        { lines: [5], text: "Normal yol: geçerli bir boolean döner." },
        { lines: [7, 8], text: "Hata fırlatabilecek kodu try içine al." },
        { lines: [9, 10], text: "catch hatayı yakalar; hata.message fırlatılan mesajdır. Çıktı: Hata: Yaş sayı olmalı" }
      ]
    },
    challenges: [
      {
        id: "p9c1", kind: "Değiştir", title: "Güvenli Bölme", fn: "guvenliBol",
        prompt: "`guvenliBol(a, b)` a/b döndürsün; ama b === 0 ise `throw new Error(\"Sıfıra bölünemez\")` yapsın.",
        starter: "function guvenliBol(a, b) {\n  \n  return a / b;\n}\n",
        tests: [{ args: [10, 2], expected: 5 }, { args: [7, 7], expected: 1 }, { args: [1, 0], throws: "Sıfıra bölünemez", label: "guvenliBol(1, 0) → hata" }],
        hints: ["Bölme yapmadan ÖNCE hangi durumu kontrol etmelisin?", "if (b === 0) { ... }", "throw new Error(\"Sıfıra bölünemez\"); — mesaj birebir aynı olmalı."],
        solution: 'function guvenliBol(a, b) {\n  if (b === 0) throw new Error("Sıfıra bölünemez");\n  return a / b;\n}'
      },
      {
        id: "p9c2", kind: "Yaz", title: "JSON Oku", fn: "jsonOku",
        prompt: "`jsonOku(metin)` geçerli JSON ise `JSON.parse` sonucunu, geçersizse **çökmeden** `null` döndürsün.",
        starter: "function jsonOku(metin) {\n  \n}\n",
        tests: [{ args: ['{"a":1}'], expected: { a: 1 } }, { args: ["[1,2]"], expected: [1, 2] }, { args: ["{bozuk"], expected: null }, { args: [""], expected: null }],
        hints: ["JSON.parse geçersiz metinde ne yapar? Konsolda dene.", "Hata fırlatır — bunu try/catch ile yakalayabilirsin.", "try { return JSON.parse(metin); } catch { return null; }"],
        solution: "function jsonOku(metin) {\n  try {\n    return JSON.parse(metin);\n  } catch (e) {\n    return null;\n  }\n}"
      },
      {
        id: "p9c3", kind: "Hata Ayıkla", title: "Bozuk Ortalama", fn: "ortalama",
        prompt: "Bu `ortalama(dizi)` fonksiyonunda **iki hata** var. Bul ve düzelt. Boş dizi için 0 döndürmeli. Önce **Çalıştır** ile testleri gör, hata mesajlarını oku.",
        starter: "function ortalama(dizi) {\n  let toplam = 0;\n  for (let i = 0; i <= dizi.length; i++) {\n    toplam += dizi[i];\n  }\n  return toplam / dizi.length;\n}\n",
        tests: [{ args: [[2, 4, 6]], expected: 4 }, { args: [[5]], expected: 5 }, { args: [[]], expected: 0 }],
        hints: ["Sonuç NaN çıkıyor. NaN genelde bir sayıya undefined eklendiğinde oluşur. Döngü kaç kez dönüyor?", "i <= dizi.length son turda dizi[3] = undefined okur. < kullan. Peki boş dizide 0/0 nedir?", "Başa if (dizi.length === 0) return 0; ekle."],
        solution: "function ortalama(dizi) {\n  if (dizi.length === 0) return 0;\n  let toplam = 0;\n  for (let i = 0; i < dizi.length; i++) toplam += dizi[i];\n  return toplam / dizi.length;\n}"
      }
    ],
    cards: [
      { id: "p9k1", q: "finally bloğu ne zaman çalışır?", a: "Her zaman — hata olsa da olmasa da, try/catch bittikten sonra." },
      { id: "p9k2", q: "NaN genelde nereden gelir?", a: "Sayı olmayan bir değerle (ör. undefined) aritmetik işlemden; ya da 0/0 gibi tanımsız işlemlerden." },
      { id: "p9k3", q: "Sistematik debugging'in ilk adımı?", a: "Hata mesajını ve satır numarasını OKU; sonra hatayı küçük bir girdiyle yeniden üret." }
    ]
  },

  {
    id: "p10", no: 10, title: "Asenkron JavaScript", short: "Asenkron",
    goal: "Zaman alan işleri (ağ, zamanlayıcı) bekletmeden yönet: Promise ve async/await.",
    concepts: ["event loop", "Promise", "async / await", "Promise.all"],
    predict: {
      code: 'console.log(1);\nsetTimeout(() => console.log(2), 0);\nconsole.log(3);',
      options: ["1 2 3", "1 3 2", "2 1 3", "3 2 1"], answer: 1,
      why: "setTimeout, süre 0 olsa bile callback'i kuyruğa atar. Senkron kod (1 ve 3) bitince event loop sıradakini (2) çalıştırır."
    },
    example: {
      title: "Sahte bir API'den veri çekmek",
      code: 'function kullaniciGetir(id) {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve({ id, ad: "Deniz" }), 300);\n  });\n}\nasync function main() {\n  console.log("yükleniyor...");\n  const k = await kullaniciGetir(7);\n  console.log("geldi:", k.ad);\n}\nmain();',
      steps: [
        { lines: [2], text: "Promise: 'ileride bir değer vereceğim' sözü. resolve(değer) sözü yerine getirir." },
        { lines: [3], text: "Ağ isteğini taklit ediyoruz: 300ms sonra kullanıcı nesnesiyle resolve." },
        { lines: [6], text: "async fonksiyon içinde await kullanabilirsin; async fonksiyon her zaman Promise döndürür." },
        { lines: [8], text: "await Promise çözülene kadar BU fonksiyonu duraklatır — tarayıcıyı değil." },
        { lines: [7, 9], text: "Çıktı: yükleniyor... → (300ms) → geldi: Deniz" }
      ]
    },
    challenges: [
      {
        id: "p10c1", kind: "Değiştir", title: "Bekle", fn: "bekle",
        prompt: "`bekle(ms, deger)` ms milisaniye sonra `deger` ile çözülen bir **Promise** döndürsün.",
        starter: "function bekle(ms, deger) {\n  return new Promise((resolve) => {\n    \n  });\n}\n",
        tests: [
          { expr: 'bekle(20, "tamam")', label: 'bekle(20, "tamam")', expected: "tamam" },
          { expr: "bekle(5, 42)", label: "bekle(5, 42)", expected: 42 },
          { expr: "bekle(1, 0) instanceof Promise", label: "Promise döndürüyor mu?", expected: true }
        ],
        hints: ["Örnekte setTimeout ve resolve nasıl birlikte kullanıldı?", "setTimeout(() => ..., ms)", "setTimeout(() => resolve(deger), ms);"],
        solution: "function bekle(ms, deger) {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve(deger), ms);\n  });\n}"
      },
      {
        id: "p10c2", kind: "Yaz", title: "İki Katı Getir", fn: "ikiKatiGetir",
        prompt: "`ikiKatiGetir(sayiPromise)` bir **async** fonksiyon olsun: gelen Promise'in değerini bekleyip iki katını döndürsün.",
        starter: "async function ikiKatiGetir(sayiPromise) {\n  \n}\n",
        tests: [
          { expr: "ikiKatiGetir(Promise.resolve(21))", label: "ikiKatiGetir(Promise.resolve(21))", expected: 42 },
          { expr: "ikiKatiGetir(new Promise(r => setTimeout(() => r(5), 10)))", label: "gecikmeli 5 → 10", expected: 10 }
        ],
        hints: ["Promise'in içindeki değere async fonksiyonda nasıl ulaşırsın?", "const sayi = await sayiPromise;", "return sayi * 2;"],
        solution: "async function ikiKatiGetir(sayiPromise) {\n  const sayi = await sayiPromise;\n  return sayi * 2;\n}"
      },
      {
        id: "p10c3", kind: "Yaz", title: "Hepsini Topla", fn: "hepsiniTopla",
        prompt: "`hepsiniTopla(promiseler)` bir Promise dizisi alsın; **hepsini paralel bekleyip** değerlerin toplamını döndürsün. (Promise.all)",
        starter: "async function hepsiniTopla(promiseler) {\n  \n}\n",
        tests: [
          { expr: "hepsiniTopla([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])", label: "[1, 2, 3] → 6", expected: 6 },
          { expr: "hepsiniTopla([])", label: "[] → 0", expected: 0 }
        ],
        hints: ["Bir dizi Promise'i tek seferde beklemek için hangi yardımcı var?", "const degerler = await Promise.all(promiseler);", "Sonra Faz 7'deki reduce: degerler.reduce((a, b) => a + b, 0)"],
        solution: "async function hepsiniTopla(promiseler) {\n  const degerler = await Promise.all(promiseler);\n  return degerler.reduce((a, b) => a + b, 0);\n}"
      }
    ],
    cards: [
      { id: "p10k1", q: "await ne yapar?", a: "async fonksiyonu, Promise çözülene kadar duraklatır ve çözülen değeri verir." },
      { id: "p10k2", q: "setTimeout(fn, 0) neden hemen çalışmaz?", a: "Callback kuyruğa girer; event loop ancak senkron kod bitince çalıştırır." },
      { id: "p10k3", q: "Promise.all ne zaman reddedilir?", a: "Dizideki herhangi bir Promise reddedildiği anda." }
    ]
  }
];
