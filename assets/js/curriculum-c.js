/* QUAGEN NextGen — Müfredat: C temelleri, Faz 1–10 (dil: C)
 * Kod yerel clang ile AddressSanitizer + UBSan açık derlenir (server.js → /api/c/run).
 * mode "stdout": öğrenci main() yazar; testler { label, stdin, stdout }
 * mode "fn" (varsayılan): öğrenci fonksiyon yazar; testler { label, setup, expr, type, expected }
 *   type: int | long | size | double | char | bool | str  ·  kd_ayrilan: açık kalan malloc sayısı (sızıntı testi)
 * Ek test türleri: { label, codeNot: "regex" } / { label, codeMatch: "regex" }
 */
(function () {
  const OGR = "typedef struct {\n  char ad[32];\n  int yas;\n  double ortalama;\n} Ogrenci;\n";
  const DUGUM = "typedef struct Dugum {\n  int deger;\n  struct Dugum *sonraki;\n} Dugum;\n";
  const BASA = "Dugum *basa_ekle(Dugum *bas, int deger) {\n  Dugum *d = malloc(sizeof(Dugum));\n  if (!d) return bas;\n  d->deger = deger;\n  d->sonraki = bas;\n  return d;\n}\n";
  const SIL = "void liste_sil(Dugum *bas) {\n  while (bas) {\n    Dugum *sonraki = bas->sonraki;\n    free(bas);\n    bas = sonraki;\n  }\n}\n";
  const L123 = "Dugum *l = NULL; l = basa_ekle(l, 3); l = basa_ekle(l, 2); l = basa_ekle(l, 1);";
  const c = (o) => Object.assign({ lang: "c" }, o);

  const C = [
  /* ============================ C · FAZ 1 ============================ */
  {
    id: "c1", no: 1, language: "c", track: "c", title: "İlk program, printf ve değişkenler", short: "printf & değişkenler",
    goal: "Bir C programının iskeletini, değişken türlerini ve biçimli giriş-çıkışı (printf, scanf) öğren.",
    concepts: ["main ve #include", "int, double, char", "printf biçim belirteçleri", "scanf"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nint main(void) {\n  printf(\"%d\\n\", 7 / 2);\n  printf(\"%.1f\\n\", 7 / 2.0);\n  return 0;\n}",
      options: ["3.5 ve 3.5", "3 ve 3.5", "4 ve 3.5", "Derleme hatası"], answer: 1,
      why: "İki tam sayının bölümü tam sayıdır: 7 / 2 = 3, kesir atılır. İşlenenlerden biri double olursa (2.0) sonuç da double olur: 3.5. JavaScript'te sayı tek türdü; C'de tür her şeyi belirler."
    },
    example: {
      title: "Bir C programının anatomisi",
      lang: "c",
      code: "#include <stdio.h>\n\nint main(void) {\n  int yas = 21;\n  double boy = 1.78;\n  char harf = 'K';\n  printf(\"Yaş: %d\\n\", yas);\n  printf(\"Boy: %.2f m\\n\", boy);\n  printf(\"Baş harf: %c\\n\", harf);\n  return 0;\n}",
      steps: [
        { lines: [1], text: "#include, standart kütüphanenin bir başlık dosyasını ekler. printf ve scanf stdio.h'tedir." },
        { lines: [3, 11], text: "Her C programı main fonksiyonundan başlar. return 0 işletim sistemine 'başarılı bitti' der." },
        { lines: [4, 5, 6], text: "C'de her değişkenin türü yazılır: int tam sayı, double ondalıklı sayı, char tek karakter (tek tırnakla)." },
        { lines: [7, 8, 9], text: "printf biçim belirteçleri türle eşleşmeli: %d int, %f double (%.2f iki ondalık), %c char. \\n satır sonu." },
        { lines: [1, 11], text: "Çalıştır: kod önce derlenir (clang), sonra çalışır. Derleyici uyarıları konsolda görünür; C'de uyarılar çoğu zaman gerçek hatadır." }
      ]
    },
    challenges: [
      c({
        id: "c1c1", kind: "Değiştir", title: "Merhaba, C", fn: "main", mode: "stdout",
        prompt: "Program iki satır yazdırsın: **Merhaba, QUAGEN!** ve altında **C öğreniyorum.**",
        starter: "#include <stdio.h>\n\nint main(void) {\n  printf(\"Merhaba!\\n\");\n  return 0;\n}\n",
        tests: [{ label: "çıktı iki satır", stdout: "Merhaba, QUAGEN!\nC öğreniyorum." }],
        hints: ["Her satır için ayrı bir printf yazabilirsin.", "Satır sonu için metnin sonuna \\n ekle.", "printf(\"C öğreniyorum.\\n\");"],
        solution: "#include <stdio.h>\n\nint main(void) {\n  printf(\"Merhaba, QUAGEN!\\n\");\n  printf(\"C öğreniyorum.\\n\");\n  return 0;\n}"
      }),
      c({
        id: "c1c2", kind: "Yaz", title: "Toplam ve çarpım", fn: "main", mode: "stdout",
        prompt: "Standart girdiden iki tam sayı oku ve `Toplam: X` ve `Çarpım: Y` satırlarını yazdır.",
        starter: "#include <stdio.h>\n\nint main(void) {\n  int a, b;\n  // scanf ile iki sayı oku\n  return 0;\n}\n",
        tests: [
          { label: "girdi: 3 4", stdin: "3 4", stdout: "Toplam: 7\nÇarpım: 12" },
          { label: "girdi: -2 5", stdin: "-2 5", stdout: "Toplam: 3\nÇarpım: -10" }
        ],
        hints: ["scanf okuduğu değeri nereye yazacağını bilmeli: değişkenin adresini (&) verirsin.", "scanf(\"%d %d\", &a, &b);", "printf(\"Toplam: %d\\n\", a + b);"],
        solution: "#include <stdio.h>\n\nint main(void) {\n  int a, b;\n  if (scanf(\"%d %d\", &a, &b) != 2) return 1;\n  printf(\"Toplam: %d\\n\", a + b);\n  printf(\"Çarpım: %d\\n\", a * b);\n  return 0;\n}"
      }),
      c({
        id: "c1c3", kind: "Yaz", title: "Sıcaklık çevirici", fn: "main", mode: "stdout",
        prompt: "Girdiden ondalıklı bir Celsius değeri oku, Fahrenheit karşılığını **bir ondalık basamakla** yazdır. Formül: F = C × 9 / 5 + 32",
        starter: "#include <stdio.h>\n\nint main(void) {\n  \n  return 0;\n}\n",
        tests: [
          { label: "100 → 212.0", stdin: "100", stdout: "212.0" },
          { label: "36.6 → 97.9", stdin: "36.6", stdout: "97.9" },
          { label: "-40 → -40.0", stdin: "-40", stdout: "-40.0" }
        ],
        hints: ["double okumak için scanf'te %lf, yazdırmak için printf'te %f kullanılır.", "Tam sayı bölmesi tuzağı: 9 / 5 kaç eder? 9.0 / 5 kaç eder?", "printf(\"%.1f\\n\", c * 9.0 / 5 + 32);"],
        solution: "#include <stdio.h>\n\nint main(void) {\n  double c;\n  if (scanf(\"%lf\", &c) != 1) return 1;\n  printf(\"%.1f\\n\", c * 9.0 / 5 + 32);\n  return 0;\n}"
      })
    ],
    cards: [
      { id: "c1k1", q: "C'de 7 / 2 neden 3'tür?", a: "İki int'in bölümü int'tir; kesir atılır. Ondalık sonuç için işlenenlerden biri double olmalı (7 / 2.0)." },
      { id: "c1k2", q: "printf'te int, double ve char için biçim belirteçleri?", a: "%d int, %f double (%.2f iki ondalık), %c char, %s metin." },
      { id: "c1k3", q: "scanf(\"%d\", &x) içinde & neden gerekli?", a: "scanf değeri değişkenin içine yazabilmek için onun adresine ihtiyaç duyar." }
    ]
  },

  /* ============================ C · FAZ 2 ============================ */
  {
    id: "c2", no: 2, language: "c", track: "c", title: "Koşullar ve operatörler", short: "Koşullar",
    goal: "C'de karar vermeyi, mantıksal operatörleri ve C'ye özgü tuzakları (= ile ==) öğren.",
    concepts: ["if / else if", "== ve =", "&&, ||, !", "bool (stdbool.h)"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nint main(void) {\n  int a = 5;\n  if (a = 0) printf(\"sıfır\\n\");\n  else printf(\"sıfır değil\\n\");\n  printf(\"a = %d\\n\", a);\n  return 0;\n}",
      options: ["sıfır değil, a = 5", "sıfır, a = 0", "sıfır değil, a = 0", "Derleme hatası"], answer: 2,
      why: "a = 0 bir karşılaştırma değil, atamadır: a'ya 0 yazar ve ifadenin değeri 0 (yanlış) olur. Bu yüzden else çalışır ve a artık 0'dır. Derleyici bunun için uyarı verir; konsoldaki uyarıyı oku."
    },
    example: {
      title: "Not hesaplama",
      lang: "c",
      code: "#include <stdio.h>\n#include <stdbool.h>\n\nbool gecti_mi(int puan) {\n  return puan >= 50;\n}\n\nint main(void) {\n  int puan = 72;\n  if (puan >= 90) printf(\"Mükemmel\\n\");\n  else if (puan >= 70) printf(\"İyi\\n\");\n  else printf(\"Geliştirilmeli\\n\");\n  printf(\"Geçti mi: %d\\n\", gecti_mi(puan));\n  return 0;\n}",
      steps: [
        { lines: [2, 4, 5, 6], text: "stdbool.h, bool, true ve false'u getirir. C'de mantıksal değer aslında tam sayıdır: 0 yanlış, diğer her şey doğru." },
        { lines: [10, 11, 12], text: "else if zinciri yukarıdan aşağı ilk doğru koşulu çalıştırır." },
        { lines: [13], text: "bool değeri %d ile yazdırılır: true 1, false 0 görünür." }
      ]
    },
    challenges: [
      c({
        id: "c2c1", kind: "Değiştir", title: "Mutlak değer", fn: "mutlak",
        prompt: "`int mutlak(int x)` sayının mutlak değerini döndürsün. Başlangıç kodu negatif sayılarda yanlış.",
        starter: "int mutlak(int x) {\n  return x;\n}\n",
        tests: [
          { label: "mutlak(5)", expr: "mutlak(5)", type: "int", expected: 5 },
          { label: "mutlak(-7)", expr: "mutlak(-7)", type: "int", expected: 7 },
          { label: "mutlak(0)", expr: "mutlak(0)", type: "int", expected: 0 }
        ],
        hints: ["Hangi durumda sayının işaretini değiştirmen gerekiyor?", "if (x < 0) …", "return x < 0 ? -x : x;"],
        solution: "int mutlak(int x) {\n  return x < 0 ? -x : x;\n}"
      }),
      c({
        id: "c2c2", kind: "Yaz", title: "Harf notu", fn: "harf_notu",
        prompt: "`char harf_notu(int puan)`: 90+ → 'A', 80+ → 'B', 70+ → 'C', 60+ → 'D', altı → 'F'.",
        starter: "char harf_notu(int puan) {\n  \n}\n",
        tests: [
          { label: "harf_notu(95)", expr: "harf_notu(95)", type: "char", expected: "A" },
          { label: "harf_notu(80)", expr: "harf_notu(80)", type: "char", expected: "B" },
          { label: "harf_notu(70)", expr: "harf_notu(70)", type: "char", expected: "C" },
          { label: "harf_notu(61)", expr: "harf_notu(61)", type: "char", expected: "D" },
          { label: "harf_notu(12)", expr: "harf_notu(12)", type: "char", expected: "F" }
        ],
        hints: ["char tek tırnakla yazılır: 'A'. Çift tırnak bir metindir.", "En yüksek eşikten başla.", "if (puan >= 90) return 'A'; …"],
        solution: "char harf_notu(int puan) {\n  if (puan >= 90) return 'A';\n  if (puan >= 80) return 'B';\n  if (puan >= 70) return 'C';\n  if (puan >= 60) return 'D';\n  return 'F';\n}"
      }),
      c({
        id: "c2c3", kind: "Hata Ayıkla", title: "Yanlış artık yıl", fn: "artik_yil",
        prompt: "Bu fonksiyon 1900'ü artık yıl sayıyor ama değil. Kurallar: 400'e bölünen artıktır; 100'e bölünen (ama 400'e bölünmeyen) değildir; 4'e bölünen artıktır.",
        starter: "#include <stdbool.h>\n\nbool artik_yil(int y) {\n  if (y % 4 == 0) return true;\n  else if (y % 100 == 0) return false;\n  else if (y % 400 == 0) return true;\n  return false;\n}\n",
        tests: [
          { label: "2024", expr: "artik_yil(2024)", type: "bool", expected: true },
          { label: "2023", expr: "artik_yil(2023)", type: "bool", expected: false },
          { label: "1900", expr: "artik_yil(1900)", type: "bool", expected: false },
          { label: "2000", expr: "artik_yil(2000)", type: "bool", expected: true }
        ],
        hints: ["1900 hangi satırda true döndürüyor? Koşulların sırasına bak.", "En özel kuraldan en genele doğru sırala.", "Önce 400, sonra 100, sonra 4."],
        solution: "#include <stdbool.h>\n\nbool artik_yil(int y) {\n  if (y % 400 == 0) return true;\n  if (y % 100 == 0) return false;\n  return y % 4 == 0;\n}"
      })
    ],
    cards: [
      { id: "c2k1", q: "if (a = 0) neden hatalıdır?", a: "= atamadır: a'ya 0 yazar ve ifade 0 (yanlış) olur. Karşılaştırma için == kullanılır." },
      { id: "c2k2", q: "C'de doğru ve yanlış nasıl temsil edilir?", a: "0 yanlış, sıfır olmayan her değer doğrudur. stdbool.h bool, true, false sağlar." },
      { id: "c2k3", q: "'A' ile \"A\" arasındaki fark?", a: "'A' tek bir char (bir bayt). \"A\" bir karakter dizisi: 'A' ve sonundaki '\\0' (iki bayt)." }
    ]
  },

  /* ============================ C · FAZ 3 ============================ */
  {
    id: "c3", no: 3, language: "c", track: "c", title: "Döngüler", short: "Döngüler",
    goal: "for ve while ile tekrar et; türlerin sınırlarını ve döngü tuzaklarını tanı.",
    concepts: ["for ve while", "biriktirici", "long ve taşma", "noktalı virgül tuzağı"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nint main(void) {\n  int i;\n  for (i = 0; i < 5; i++);\n  {\n    printf(\"%d\\n\", i);\n  }\n  return 0;\n}",
      options: ["0 1 2 3 4", "5", "4", "Derleme hatası"], answer: 1,
      why: "for satırının sonundaki ; boş bir döngü gövdesidir. Döngü hiçbir şey yapmadan beş kez döner, ardından süslü parantezli blok bir kez çalışır ve i'nin son değeri 5'i yazdırır."
    },
    example: {
      title: "Faktöriyel ve tür sınırları",
      lang: "c",
      code: "#include <stdio.h>\n\nint main(void) {\n  long sonuc = 1;\n  for (int i = 1; i <= 20; i++) {\n    sonuc *= i;\n  }\n  printf(\"20! = %ld\\n\", sonuc);\n\n  int k = 0;\n  while (k * k < 50) k++;\n  printf(\"karesi 50'yi geçen ilk sayı: %d\\n\", k);\n  return 0;\n}",
      steps: [
        { lines: [4], text: "int genellikle 32 bittir (yaklaşık ±2,1 milyar). 20! bunu aşar; long (64 bit) gerekir." },
        { lines: [5, 6, 7], text: "for: başlangıç; koşul; adım. Döngü değişkenini for içinde tanımlamak (C99) kapsamını döngüyle sınırlar." },
        { lines: [8], text: "long, %ld ile yazdırılır." },
        { lines: [10, 11], text: "while, kaç tur döneceği önceden bilinmediğinde okunaklıdır." }
      ]
    },
    challenges: [
      c({
        id: "c3c1", kind: "Değiştir", title: "Büyük faktöriyel", fn: "faktoriyel",
        prompt: "`long faktoriyel(int n)` n! döndürsün. Başlangıç kodu int kullandığı için büyük sayılarda taşıyor (UBSan yakalar).",
        starter: "long faktoriyel(int n) {\n  int sonuc = 1;\n  for (int i = 2; i <= n; i++) sonuc *= i;\n  return sonuc;\n}\n",
        tests: [
          { label: "faktoriyel(0)", expr: "faktoriyel(0)", type: "long", expected: 1 },
          { label: "faktoriyel(5)", expr: "faktoriyel(5)", type: "long", expected: 120 },
          { label: "faktoriyel(20)", expr: "faktoriyel(20)", type: "long", expected: "2432902008176640000" }
        ],
        hints: ["Hangi değişken büyük değeri tutuyor? Türü yeterli mi?", "int yerine long kullan.", "long sonuc = 1;"],
        solution: "long faktoriyel(int n) {\n  long sonuc = 1;\n  for (int i = 2; i <= n; i++) sonuc *= i;\n  return sonuc;\n}"
      }),
      c({
        id: "c3c2", kind: "Yaz", title: "Basamak toplamı", fn: "basamak_toplami",
        prompt: "`int basamak_toplami(int n)` sayının basamaklarının toplamını döndürsün. Negatif sayılarda işareti yok say.",
        starter: "int basamak_toplami(int n) {\n  \n}\n",
        tests: [
          { label: "1234", expr: "basamak_toplami(1234)", type: "int", expected: 10 },
          { label: "0", expr: "basamak_toplami(0)", type: "int", expected: 0 },
          { label: "-45", expr: "basamak_toplami(-45)", type: "int", expected: 9 },
          { label: "1000000", expr: "basamak_toplami(1000000)", type: "int", expected: 1 }
        ],
        hints: ["Son basamağı % 10 verir. Son basamağı atmak için?", "n / 10 son basamağı atar (tam sayı bölmesi işine yarıyor).", "if (n < 0) n = -n; while (n > 0) { t += n % 10; n /= 10; }"],
        solution: "int basamak_toplami(int n) {\n  if (n < 0) n = -n;\n  int t = 0;\n  while (n > 0) {\n    t += n % 10;\n    n /= 10;\n  }\n  return t;\n}"
      }),
      c({
        id: "c3c3", kind: "Yaz", title: "Asal mı?", fn: "asal_mi",
        prompt: "`bool asal_mi(int n)` n asal ise `true` döndürsün. 2.147.483.647 için de hızlı çalışmalı: bölenleri yalnızca **karekökün altına kadar** dene.",
        starter: "#include <stdbool.h>\n\nbool asal_mi(int n) {\n  \n}\n",
        tests: [
          { label: "1 asal değil", expr: "asal_mi(1)", type: "bool", expected: false },
          { label: "2 asal", expr: "asal_mi(2)", type: "bool", expected: true },
          { label: "91 asal değil", expr: "asal_mi(91)", type: "bool", expected: false },
          { label: "97 asal", expr: "asal_mi(97)", type: "bool", expected: true },
          { label: "2147483647 asal (hızlı)", expr: "asal_mi(2147483647)", type: "bool", expected: true }
        ],
        hints: ["n'in bir böleni varsa, en az biri √n'den küçük ya da ona eşittir.", "for (long i = 2; i * i <= n; i++) — i * i taşmasın diye long.", "n < 2 ise false; bir bölen bulursan false; döngü biterse true."],
        solution: "#include <stdbool.h>\n\nbool asal_mi(int n) {\n  if (n < 2) return false;\n  for (long i = 2; i * i <= n; i++) {\n    if (n % i == 0) return false;\n  }\n  return true;\n}"
      })
    ],
    cards: [
      { id: "c3k1", q: "for (...); satırının sonundaki noktalı virgül ne yapar?", a: "Boş bir gövde oluşturur; döngü hiçbir şey yapmadan döner, alttaki blok döngü dışında bir kez çalışır." },
      { id: "c3k2", q: "int taşınca C'de ne olur?", a: "İşaretli tam sayı taşması tanımsız davranıştır. Daha geniş tür (long) kullan; UBSan bunu yakalar." },
      { id: "c3k3", q: "Asal kontrolünde neden √n'e kadar bakmak yeter?", a: "n = a·b ise a ve b'den biri √n'den küçük ya da eşittir; o yüzden küçük bölen yoksa büyük de yoktur." }
    ]
  },

  /* ============================ C · FAZ 4 ============================ */
  {
    id: "c4", no: 4, language: "c", track: "c", title: "Fonksiyonlar ve özyineleme", short: "Fonksiyonlar",
    goal: "Fonksiyon prototiplerini, değer ile aktarımı ve özyinelemenin çağrı yığınındaki karşılığını öğren.",
    concepts: ["prototip", "değer ile aktarım", "özyineleme", "çağrı yığını"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nvoid arttir(int x) {\n  x++;\n}\n\nint main(void) {\n  int a = 5;\n  arttir(a);\n  printf(\"%d\\n\", a);\n  return 0;\n}",
      options: ["5", "6", "0", "Derleme hatası"], answer: 0,
      why: "C'de argümanlar değer ile aktarılır: arttir, a'nın bir kopyasını alır ve kopyayı artırır. a değişmez. Çağıranın değişkenini değiştirmek için adresini (işaretçi) vermek gerekir; Faz 7'de."
    },
    example: {
      title: "Prototip ve özyineleme",
      lang: "c",
      code: "#include <stdio.h>\n\nlong us(long taban, int ust);   /* prototip */\n\nint main(void) {\n  printf(\"2^10 = %ld\\n\", us(2, 10));\n  return 0;\n}\n\nlong us(long taban, int ust) {\n  if (ust == 0) return 1;\n  long yarim = us(taban, ust / 2);\n  return ust % 2 ? yarim * yarim * taban : yarim * yarim;\n}",
      steps: [
        { lines: [3], text: "Prototip, fonksiyonun imzasını önceden bildirir; böylece tanımı main'den sonra gelebilir." },
        { lines: [11], text: "Temel durum: özyinelemenin durduğu yer. Unutulursa çağrı yığını taşar." },
        { lines: [12, 13], text: "Hızlı üs alma: problemi yarıya indirerek O(log n) çağrıyla çözer. 2^10 için yalnızca 5 çağrı." }
      ]
    },
    challenges: [
      c({
        id: "c4c1", kind: "Yaz", title: "EBOB", fn: "ebob",
        prompt: "`int ebob(int a, int b)` iki pozitif sayının en büyük ortak bölenini Öklid algoritmasıyla döndürsün: ebob(a, 0) = a, ebob(a, b) = ebob(b, a % b).",
        starter: "int ebob(int a, int b) {\n  \n}\n",
        tests: [
          { label: "ebob(48, 18)", expr: "ebob(48, 18)", type: "int", expected: 6 },
          { label: "ebob(17, 5)", expr: "ebob(17, 5)", type: "int", expected: 1 },
          { label: "ebob(9, 0)", expr: "ebob(9, 0)", type: "int", expected: 9 },
          { label: "ebob(1071, 462)", expr: "ebob(1071, 462)", type: "int", expected: 21 }
        ],
        hints: ["Tanım zaten özyinelemeli. Temel durum hangisi?", "if (b == 0) return a;", "return ebob(b, a % b);"],
        solution: "int ebob(int a, int b) {\n  if (b == 0) return a;\n  return ebob(b, a % b);\n}"
      }),
      c({
        id: "c4c2", kind: "Değiştir", title: "Hızlı üs", fn: "us",
        prompt: "`long us(long taban, int ust)` taban^ust döndürsün. Başlangıç kodu doğru ama O(n) çağrı yapıyor; örnekteki gibi **yarıya bölerek** O(log n) yap.",
        starter: "long us(long taban, int ust) {\n  if (ust == 0) return 1;\n  return taban * us(taban, ust - 1);\n}\n",
        tests: [
          { label: "us(2, 10)", expr: "us(2, 10)", type: "long", expected: 1024 },
          { label: "us(3, 0)", expr: "us(3, 0)", type: "long", expected: 1 },
          { label: "us(2, 62)", expr: "us(2, 62)", type: "long", expected: "4611686018427387904" },
          { label: "us(5, 3)", expr: "us(5, 3)", type: "long", expected: 125 },
          { label: "O(log n): 'ust - 1' ile azaltmıyor", codeNot: "ust\\s*-\\s*1", codeHint: "üs yarıya bölünmeli" }
        ],
        hints: ["taban^10 = (taban^5)^2. Tek üslerde fazladan bir taban çarpanı kalır.", "long yarim = us(taban, ust / 2);", "return ust % 2 ? yarim * yarim * taban : yarim * yarim;"],
        solution: "long us(long taban, int ust) {\n  if (ust == 0) return 1;\n  long yarim = us(taban, ust / 2);\n  return ust % 2 ? yarim * yarim * taban : yarim * yarim;\n}"
      }),
      c({
        id: "c4c3", kind: "Hata Ayıkla", title: "Bitmeyen özyineleme", fn: "toplam_n",
        prompt: "`int toplam_n(int n)` 0'dan n'e kadar sayıların toplamını döndürmeli ama program çöküyor. Önce testleri çalıştır ve sanitizer mesajını oku.",
        starter: "int toplam_n(int n) {\n  return n + toplam_n(n - 1);\n}\n",
        tests: [
          { label: "toplam_n(0)", expr: "toplam_n(0)", type: "int", expected: 0 },
          { label: "toplam_n(10)", expr: "toplam_n(10)", type: "int", expected: 55 },
          { label: "toplam_n(1000)", expr: "toplam_n(1000)", type: "int", expected: 500500 }
        ],
        hints: ["Sanitizer 'stack-overflow' diyor. Bu fonksiyon ne zaman durur?", "Her özyinelemenin bir temel durumu olmalı.", "if (n <= 0) return 0;"],
        solution: "int toplam_n(int n) {\n  if (n <= 0) return 0;\n  return n + toplam_n(n - 1);\n}"
      })
    ],
    cards: [
      { id: "c4k1", q: "C'de argümanlar nasıl aktarılır?", a: "Değer ile: fonksiyon bir kopya alır. Çağıranın değişkenini değiştirmek için adresi (işaretçi) verilir." },
      { id: "c4k2", q: "Fonksiyon prototipi ne işe yarar?", a: "Derleyiciye fonksiyonun adını, dönüş türünü ve parametrelerini önceden bildirir; tanım daha sonra gelebilir." },
      { id: "c4k3", q: "Temel durumu olmayan özyinelemede ne olur?", a: "Fonksiyon kendini sonsuza dek çağırır, çağrı yığını taşar (stack overflow) ve program çöker." }
    ]
  },

  /* ============================ C · FAZ 5 ============================ */
  {
    id: "c5", no: 5, language: "c", track: "c", title: "Diziler", short: "Diziler",
    goal: "Sabit boyutlu dizilerle çalış; dizinin fonksiyona nasıl geçtiğini ve sınır dışı erişimi kavra.",
    concepts: ["dizi tanımı", "indeks 0..n−1", "diziyi fonksiyona geçirmek", "sınır dışı erişim"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nvoid boyut_yaz(int d[]) {\n  printf(\"fonksiyonda: %zu\\n\", sizeof(d) / sizeof(d[0]));\n}\n\nint main(void) {\n  int d[10];\n  printf(\"main'de: %zu\\n\", sizeof(d) / sizeof(d[0]));\n  boyut_yaz(d);\n  return 0;\n}",
      options: ["10 ve 10", "10 ve 2", "40 ve 8", "Derleme hatası"], answer: 1,
      why: "main'de d gerçek bir dizidir: 40 bayt / 4 = 10. Fonksiyona geçerken dizi ilk elemanının adresine (işaretçiye) dönüşür; sizeof(d) artık işaretçinin boyutudur (8): 8 / 4 = 2. Bu yüzden C'de dizinin uzunluğu her zaman ayrı bir parametre olarak verilir. Derleyici bu konuda uyarır."
    },
    example: {
      title: "Dizi ve uzunluğu birlikte",
      lang: "c",
      code: "#include <stdio.h>\n\ndouble ortalama(const int *d, int n) {\n  if (n == 0) return 0;\n  long toplam = 0;\n  for (int i = 0; i < n; i++) toplam += d[i];\n  return (double)toplam / n;\n}\n\nint main(void) {\n  int notlar[] = {80, 95, 72, 64};\n  int n = sizeof(notlar) / sizeof(notlar[0]);\n  printf(\"%d not, ortalama %.2f\\n\", n, ortalama(notlar, n));\n  return 0;\n}",
      steps: [
        { lines: [3], text: "Dizi parametresi aslında bir işaretçidir. const, fonksiyonun diziyi değiştirmeyeceğini söyler." },
        { lines: [6], text: "Geçerli indeksler 0..n−1. i <= n yazmak son turda dizinin dışını okur; AddressSanitizer bunu yakalar." },
        { lines: [7], text: "(double) dönüşümü olmadan toplam / n tam sayı bölmesi olurdu." },
        { lines: [11, 12], text: "sizeof ile uzunluk yalnızca dizinin tanımlandığı yerde doğru hesaplanır." }
      ]
    },
    challenges: [
      c({
        id: "c5c1", kind: "Değiştir", title: "Dizi toplamı", fn: "dizi_toplam",
        prompt: "`int dizi_toplam(const int *d, int n)` ilk `n` elemanın toplamını döndürsün.",
        starter: "int dizi_toplam(const int *d, int n) {\n  int toplam = 0;\n  // döngüyü yaz\n  return toplam;\n}\n",
        tests: [
          { label: "{1, 2, 3, 4}", setup: "int a[] = {1, 2, 3, 4};", expr: "dizi_toplam(a, 4)", type: "int", expected: 10 },
          { label: "{-5, 5, 10}", setup: "int a[] = {-5, 5, 10};", expr: "dizi_toplam(a, 3)", type: "int", expected: 10 },
          { label: "n = 0", setup: "int a[] = {7};", expr: "dizi_toplam(a, 0)", type: "int", expected: 0 }
        ],
        hints: ["0'dan n − 1'e kadar dolaş.", "for (int i = 0; i < n; i++)", "toplam += d[i];"],
        solution: "int dizi_toplam(const int *d, int n) {\n  int toplam = 0;\n  for (int i = 0; i < n; i++) toplam += d[i];\n  return toplam;\n}"
      }),
      c({
        id: "c5c2", kind: "Yaz", title: "Yerinde ters çevir", fn: "ters_cevir",
        prompt: "`void ters_cevir(int *d, int n)` diziyi **yerinde** (yeni dizi oluşturmadan) ters çevirsin.",
        starter: "void ters_cevir(int *d, int n) {\n  \n}\n",
        tests: [
          { label: "{1, 2, 3, 4, 5}", setup: "int a[] = {1, 2, 3, 4, 5}; ters_cevir(a, 5);", expr: "a[0] * 10000 + a[1] * 1000 + a[2] * 100 + a[3] * 10 + a[4]", type: "int", expected: 54321 },
          { label: "çift uzunluk", setup: "int a[] = {1, 2, 3, 4}; ters_cevir(a, 4);", expr: "a[0] * 1000 + a[1] * 100 + a[2] * 10 + a[3]", type: "int", expected: 4321 },
          { label: "tek eleman", setup: "int a[] = {9}; ters_cevir(a, 1);", expr: "a[0]", type: "int", expected: 9 }
        ],
        hints: ["İki uçtan başlayıp ortada buluşan iki indeks kullan.", "i = 0 ve j = n − 1; i < j olduğu sürece takas et.", "int t = d[i]; d[i] = d[j]; d[j] = t;"],
        solution: "void ters_cevir(int *d, int n) {\n  for (int i = 0, j = n - 1; i < j; i++, j--) {\n    int t = d[i];\n    d[i] = d[j];\n    d[j] = t;\n  }\n}"
      }),
      c({
        id: "c5c3", kind: "Hata Ayıkla", title: "İki hatalı en büyük", fn: "en_buyuk",
        prompt: "`int en_buyuk(const int *d, int n)` iki hata içeriyor: biri sınır dışı okuyor (sanitizer yakalar), diğeri tüm sayılar negatifken yanlış sonuç veriyor.",
        starter: "int en_buyuk(const int *d, int n) {\n  int max = 0;\n  for (int i = 0; i <= n; i++) {\n    if (d[i] > max) max = d[i];\n  }\n  return max;\n}\n",
        tests: [
          { label: "{3, 9, 2}", setup: "int a[] = {3, 9, 2};", expr: "en_buyuk(a, 3)", type: "int", expected: 9 },
          { label: "hepsi negatif", setup: "int a[] = {-5, -2, -9};", expr: "en_buyuk(a, 3)", type: "int", expected: -2 },
          { label: "tek eleman", setup: "int a[] = {4};", expr: "en_buyuk(a, 1)", type: "int", expected: 4 }
        ],
        hints: ["Sanitizer 'stack-buffer-overflow' diyor: hangi indeks dizinin dışında?", "i <= n son turda d[n]'i okur. Peki max = 0 başlangıcı negatif dizide ne yapar?", "max = d[0] ile başla, döngüyü i < n ile kur."],
        solution: "int en_buyuk(const int *d, int n) {\n  int max = d[0];\n  for (int i = 1; i < n; i++) {\n    if (d[i] > max) max = d[i];\n  }\n  return max;\n}"
      })
    ],
    cards: [
      { id: "c5k1", q: "Dizi fonksiyona geçince ne olur?", a: "İlk elemanın adresine (işaretçiye) dönüşür; uzunluk bilgisi kaybolur, ayrı parametre olarak verilmeli." },
      { id: "c5k2", q: "int d[5] dizisinde geçerli indeksler?", a: "0'dan 4'e kadar. d[5] dizinin dışıdır; okumak/yazmak tanımsız davranıştır." },
      { id: "c5k3", q: "En büyük/küçük ararken başlangıç değeri ne olmalı?", a: "Dizinin ilk elemanı. 0 ile başlamak tüm elemanlar negatifken yanlış sonuç verir." }
    ]
  },

  /* ============================ C · FAZ 6 ============================ */
  {
    id: "c6", no: 6, language: "c", track: "c", title: "Karakter dizileri", short: "Metinler",
    goal: "C'de metnin '\\0' ile biten bir char dizisi olduğunu kavra; metin fonksiyonlarını kendin yaz.",
    concepts: ["char dizisi", "'\\0' sonlandırıcı", "strlen ve sizeof", "karakter aritmetiği"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n  char s[] = \"kod\";\n  printf(\"%zu %zu\\n\", sizeof(s), strlen(s));\n  return 0;\n}",
      options: ["3 3", "4 3", "3 4", "8 3"], answer: 1,
      why: "\"kod\" dizisi 4 bayttır: 'k', 'o', 'd' ve sonu işaretleyen '\\0'. sizeof bayt sayısını (4), strlen '\\0'a kadarki karakter sayısını (3) verir. Metne yer ayırırken '\\0' için +1 unutmak C'nin en sık hatalarındandır."
    },
    example: {
      title: "Metni karakter karakter dolaşmak",
      lang: "c",
      code: "#include <stdio.h>\n\nint sesli_say(const char *s) {\n  int n = 0;\n  for (int i = 0; s[i] != '\\0'; i++) {\n    char c = s[i];\n    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') n++;\n  }\n  return n;\n}\n\nint main(void) {\n  printf(\"%d\\n\", sesli_say(\"merhaba kodera\"));\n  return 0;\n}",
      steps: [
        { lines: [3], text: "Metin, ilk karakterinin adresidir (const char *). Uzunluğu ayrıca verilmez: sonu '\\0' ile bilinir." },
        { lines: [5], text: "'\\0'a gelene kadar dolaş. Döngü koşulu metnin sonunu bulur." },
        { lines: [6, 7], text: "char aslında küçük bir tam sayıdır; == ile karşılaştırılır. Çıktı: 6." }
      ]
    },
    challenges: [
      c({
        id: "c6c1", kind: "Yaz", title: "Kendi strlen'in", fn: "uzunluk",
        prompt: "`size_t uzunluk(const char *s)` metnin karakter sayısını döndürsün. `strlen` kullanma.",
        starter: "#include <stddef.h>\n\nsize_t uzunluk(const char *s) {\n  \n}\n",
        tests: [
          { label: "\"kodera\"", expr: "uzunluk(\"kodera\")", type: "size", expected: 6 },
          { label: "boş metin", expr: "uzunluk(\"\")", type: "size", expected: 0 },
          { label: "boşluklu metin", expr: "uzunluk(\"C dili\")", type: "size", expected: 6 },
          { label: "strlen kullanılmıyor", codeNot: "strlen", codeHint: "strlen kullanılmamalı" }
        ],
        hints: ["Metnin sonu nasıl anlaşılıyordu?", "'\\0' görene kadar sayaç artır.", "size_t n = 0; while (s[n] != '\\0') n++; return n;"],
        solution: "#include <stddef.h>\n\nsize_t uzunluk(const char *s) {\n  size_t n = 0;\n  while (s[n] != '\\0') n++;\n  return n;\n}"
      }),
      c({
        id: "c6c2", kind: "Yaz", title: "Büyük harfe çevir", fn: "buyut",
        prompt: "`void buyut(char *s)` metindeki küçük İngilizce harfleri (a–z) **yerinde** büyük harfe çevirsin; diğer karakterlere dokunmasın.",
        starter: "void buyut(char *s) {\n  \n}\n",
        tests: [
          { label: "\"merhaba dunya\"", setup: "char b[] = \"merhaba dunya\"; buyut(b);", expr: "b", type: "str", expected: "MERHABA DUNYA" },
          { label: "karışık", setup: "char b[] = \"C99 ve c11!\"; buyut(b);", expr: "b", type: "str", expected: "C99 VE C11!" },
          { label: "boş", setup: "char b[] = \"\"; buyut(b);", expr: "b", type: "str", expected: "" }
        ],
        hints: ["Karakterler sayıdır: 'a' ile 'A' arasındaki fark her harfte aynı.", "if (s[i] >= 'a' && s[i] <= 'z')", "s[i] = s[i] - 'a' + 'A';  (ya da ctype.h'deki toupper)"],
        solution: "void buyut(char *s) {\n  for (int i = 0; s[i] != '\\0'; i++) {\n    if (s[i] >= 'a' && s[i] <= 'z') s[i] = s[i] - 'a' + 'A';\n  }\n}"
      }),
      c({
        id: "c6c3", kind: "Yaz", title: "Palindrom mu?", fn: "palindrom_mu",
        prompt: "`bool palindrom_mu(const char *s)` metin tersten de aynı okunuyorsa `true` döndürsün (büyük/küçük harf duyarlı, boşluklar dahil).",
        starter: "#include <stdbool.h>\n#include <string.h>\n\nbool palindrom_mu(const char *s) {\n  \n}\n",
        tests: [
          { label: "\"kayak\"", expr: "palindrom_mu(\"kayak\")", type: "bool", expected: true },
          { label: "\"abba\"", expr: "palindrom_mu(\"abba\")", type: "bool", expected: true },
          { label: "\"kod\"", expr: "palindrom_mu(\"kod\")", type: "bool", expected: false },
          { label: "boş metin", expr: "palindrom_mu(\"\")", type: "bool", expected: true }
        ],
        hints: ["İki uçtan karşılaştır: algoritmalar parkurundaki iki işaretçi fikri.", "size_t n = strlen(s); i = 0, j = n − 1 … ama n = 0 iken n − 1 ne olur? (size_t işaretsizdir!)", "for (size_t i = 0, j = n; i < j; i++) { j--; if (s[i] != s[j]) return false; }"],
        solution: "#include <stdbool.h>\n#include <string.h>\n\nbool palindrom_mu(const char *s) {\n  size_t n = strlen(s);\n  for (size_t i = 0, j = n; i < j; i++) {\n    j--;\n    if (i >= j) break;\n    if (s[i] != s[j]) return false;\n  }\n  return true;\n}"
      })
    ],
    cards: [
      { id: "c6k1", q: "C'de bir metin nasıl saklanır?", a: "'\\0' (sıfır baytı) ile biten bir char dizisi olarak. Uzunluk ayrıca tutulmaz." },
      { id: "c6k2", q: "char s[] = \"kod\" için sizeof ve strlen?", a: "sizeof 4 (sonlandırıcı dahil), strlen 3." },
      { id: "c6k3", q: "size_t ile n − 1 yazarken neye dikkat edilir?", a: "size_t işaretsizdir; n = 0 iken n − 1 çok büyük bir sayıya döner. Döngü sınırlarını buna göre kur." }
    ]
  },

  /* ============================ C · FAZ 7 ============================ */
  {
    id: "c7", no: 7, language: "c", track: "c", title: "İşaretçiler", short: "İşaretçiler",
    goal: "Adresleri, & ve * operatörlerini ve fonksiyonların çağıranın değişkenini nasıl değiştirdiğini öğren.",
    concepts: ["adres (&)", "dolaylı erişim (*)", "çıktı parametresi", "NULL"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nint main(void) {\n  int a = 5;\n  int *p = &a;\n  *p = 9;\n  printf(\"%d\\n\", a);\n  return 0;\n}",
      options: ["5", "9", "a'nın adresi", "Derleme hatası"], answer: 1,
      why: "p, a'nın adresini tutar. *p 'p'nin gösterdiği yer' demektir; *p = 9, a'nın kendisine 9 yazar. JavaScript'te nesneler bu şekilde paylaşılıyordu; C'de bunu açıkça işaretçilerle yaparsın."
    },
    example: {
      title: "İşaretçiyle iki değer döndürmek",
      lang: "c",
      code: "#include <stdio.h>\n\nvoid bol(int a, int b, int *bolum, int *kalan) {\n  *bolum = a / b;\n  *kalan = a % b;\n}\n\nint main(void) {\n  int q, r;\n  bol(17, 5, &q, &r);\n  printf(\"17 = 5 * %d + %d\\n\", q, r);\n  return 0;\n}",
      steps: [
        { lines: [3], text: "int *bolum: bir int'in adresini alan parametre. C'de birden fazla sonuç böyle 'çıktı parametresi' ile döndürülür." },
        { lines: [4, 5], text: "*bolum = … adresin gösterdiği yere yazar: çağıranın q değişkenine." },
        { lines: [10], text: "&q, q'nun adresidir. scanf'teki & ile aynı fikir." }
      ]
    },
    challenges: [
      c({
        id: "c7c1", kind: "Değiştir", title: "Takas", fn: "takas",
        prompt: "`void takas(int *a, int *b)` çağıranın iki değişkeninin değerlerini değiş tokuş etsin. Başlangıç kodu yalnızca işaretçileri takas ediyor.",
        starter: "void takas(int *a, int *b) {\n  int *t = a;\n  a = b;\n  b = t;\n}\n",
        tests: [
          { label: "1 ve 2", setup: "int x = 1, y = 2; takas(&x, &y);", expr: "x * 10 + y", type: "int", expected: 21 },
          { label: "aynı değerler", setup: "int x = 7, y = 7; takas(&x, &y);", expr: "x * 10 + y", type: "int", expected: 77 },
          { label: "negatif", setup: "int x = -3, y = 4; takas(&x, &y);", expr: "x * 10 + y", type: "int", expected: 37 }
        ],
        hints: ["İşaretçilerin kendisini değiştirmek kopyaları değiştirir. Göstedikleri yeri değiştirmen gerek.", "Değerlere *a ve *b ile eriş.", "int t = *a; *a = *b; *b = t;"],
        solution: "void takas(int *a, int *b) {\n  int t = *a;\n  *a = *b;\n  *b = t;\n}"
      }),
      c({
        id: "c7c2", kind: "Yaz", title: "En küçük ve en büyük", fn: "min_max",
        prompt: "`void min_max(const int *d, int n, int *enk, int *enb)` dizinin en küçük ve en büyük elemanını çıktı parametrelerine yazsın (n ≥ 1).",
        starter: "void min_max(const int *d, int n, int *enk, int *enb) {\n  \n}\n",
        tests: [
          { label: "{4, -1, 9, 3}", setup: "int a[] = {4, -1, 9, 3}; int k, b; min_max(a, 4, &k, &b);", expr: "k * 100 + b", type: "int", expected: -91 },
          { label: "tek eleman", setup: "int a[] = {5}; int k, b; min_max(a, 1, &k, &b);", expr: "k * 100 + b", type: "int", expected: 505 }
        ],
        hints: ["Başlangıç değerini dizinin ilk elemanı yap.", "*enk = *enb = d[0];", "Döngüde d[i] < *enk ise *enk = d[i]; aynısı büyük için."],
        solution: "void min_max(const int *d, int n, int *enk, int *enb) {\n  *enk = *enb = d[0];\n  for (int i = 1; i < n; i++) {\n    if (d[i] < *enk) *enk = d[i];\n    if (d[i] > *enb) *enb = d[i];\n  }\n}"
      }),
      c({
        id: "c7c3", kind: "Yaz", title: "Elemanı bul", fn: "bul",
        prompt: "`int *bul(int *d, int n, int hedef)` hedefe eşit **ilk** elemanın adresini, yoksa `NULL` döndürsün. Dönen işaretçiyle eleman değiştirilebilmeli.",
        starter: "#include <stddef.h>\n\nint *bul(int *d, int n, int hedef) {\n  \n}\n",
        tests: [
          { label: "konum", setup: "int a[] = {4, 7, 7, 1}; int *p = bul(a, 4, 7);", expr: "p ? (int)(p - a) : -1", type: "int", expected: 1 },
          { label: "yoksa NULL", setup: "int a[] = {4, 7}; int *p = bul(a, 2, 9);", expr: "p == NULL", type: "bool", expected: true },
          { label: "dönen adresle yazmak", setup: "int a[] = {4, 7, 1}; *bul(a, 3, 1) = 0;", expr: "a[2]", type: "int", expected: 0 }
        ],
        hints: ["d[i] elemanının adresi nedir?", "&d[i] ya da d + i", "Döngü biterse return NULL;"],
        solution: "#include <stddef.h>\n\nint *bul(int *d, int n, int hedef) {\n  for (int i = 0; i < n; i++) {\n    if (d[i] == hedef) return &d[i];\n  }\n  return NULL;\n}"
      })
    ],
    cards: [
      { id: "c7k1", q: "& ve * operatörleri ne yapar?", a: "&x, x'in adresini verir. *p, p'nin gösterdiği yerdeki değere erişir (okur ya da yazar)." },
      { id: "c7k2", q: "Bir fonksiyon çağıranın değişkenini nasıl değiştirir?", a: "Değişkenin adresini (işaretçi) parametre olarak alıp *p = … ile yazar." },
      { id: "c7k3", q: "p - a (ikisi de aynı dizide) neyi verir?", a: "İki işaretçi arasındaki eleman sayısını, yani indeksi." }
    ]
  },

  /* ============================ C · FAZ 8 ============================ */
  {
    id: "c8", no: 8, language: "c", track: "c", title: "Struct'lar", short: "Struct",
    goal: "İlişkili verileri struct ile bir araya getir; kopyalama ve işaretçiyle erişim farkını kavra.",
    concepts: ["struct ve typedef", "nokta ve ok (->)", "değer kopyası", "struct dizileri"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\ntypedef struct { int x; } Nokta;\n\nint main(void) {\n  Nokta a = {1};\n  Nokta b = a;\n  b.x = 2;\n  printf(\"%d\\n\", a.x);\n  return 0;\n}",
      options: ["1", "2", "0", "Derleme hatası"], answer: 0,
      why: "C'de struct ataması tüm alanları kopyalar: b, a'nın bağımsız bir kopyasıdır. JavaScript'te nesne ataması aynı nesneyi paylaşıyordu (Faz 6); C'de paylaşım için işaretçi gerekir."
    },
    example: {
      title: "Struct, işaretçi ve ok operatörü",
      lang: "c",
      code: "#include <stdio.h>\n#include <string.h>\n\ntypedef struct {\n  char ad[32];\n  int yas;\n} Kisi;\n\nvoid yas_al(Kisi *k) {\n  k->yas++;\n}\n\nint main(void) {\n  Kisi k;\n  strcpy(k.ad, \"Deniz\");\n  k.yas = 21;\n  yas_al(&k);\n  printf(\"%s %d\\n\", k.ad, k.yas);\n  return 0;\n}",
      steps: [
        { lines: [4, 5, 6, 7], text: "typedef struct { … } Kisi; yeni bir tür tanımlar. char ad[32] metni struct'ın içinde saklar." },
        { lines: [9, 10, 11], text: "İşaretçi üzerinden alana ok ile erişilir: k->yas, (*k).yas'ın kısaltmasıdır." },
        { lines: [15, 16, 17], text: "Değişkende nokta: k.yas. Metin dizilere = ile atanamaz; strcpy (ya da snprintf) gerekir." }
      ]
    },
    challenges: [
      c({
        id: "c8c1", kind: "Yaz", title: "Öğrenci oluştur", fn: "ogrenci_olustur",
        prompt: "`Ogrenci ogrenci_olustur(const char *ad, int yas)` verilen ad ve yaşla, ortalaması 0 olan bir öğrenci döndürsün. Ad 31 karakterden uzunsa kırpılsın (taşma olmasın).",
        starter: OGR + "#include <string.h>\n\nOgrenci ogrenci_olustur(const char *ad, int yas) {\n  Ogrenci o;\n  \n  return o;\n}\n",
        tests: [
          { label: "ad", setup: "Ogrenci o = ogrenci_olustur(\"Ece\", 24);", expr: "o.ad", type: "str", expected: "Ece" },
          { label: "yaş ve ortalama", setup: "Ogrenci o = ogrenci_olustur(\"Ece\", 24);", expr: "o.yas * 10 + (int)o.ortalama", type: "int", expected: 240 },
          { label: "uzun ad kırpılır", setup: "Ogrenci o = ogrenci_olustur(\"Bu ad otuz bir karakterden çok daha uzun\", 30);", expr: "strlen(o.ad) <= 31", type: "bool", expected: true }
        ],
        hints: ["Metni struct'taki diziye kopyalamalısın; = ile olmaz.", "Taşmayı önlemek için hedefin boyutunu bilen bir fonksiyon kullan.", "snprintf(o.ad, sizeof o.ad, \"%s\", ad); o.yas = yas; o.ortalama = 0;"],
        solution: OGR + "#include <stdio.h>\n#include <string.h>\n\nOgrenci ogrenci_olustur(const char *ad, int yas) {\n  Ogrenci o;\n  snprintf(o.ad, sizeof o.ad, \"%s\", ad);\n  o.yas = yas;\n  o.ortalama = 0;\n  return o;\n}"
      }),
      c({
        id: "c8c2", kind: "Yaz", title: "Sınıf ortalaması", fn: "sinif_ortalamasi",
        prompt: "`double sinif_ortalamasi(const Ogrenci *d, int n)` öğrencilerin `ortalama` alanlarının ortalamasını döndürsün; n = 0 ise 0.",
        starter: OGR + "\ndouble sinif_ortalamasi(const Ogrenci *d, int n) {\n  \n}\n",
        tests: [
          { label: "üç öğrenci", setup: "Ogrenci s[3] = {{\"A\", 20, 80.0}, {\"B\", 21, 90.0}, {\"C\", 22, 70.5}};", expr: "sinif_ortalamasi(s, 3)", type: "double", expected: 80.16666666666667 },
          { label: "boş sınıf", setup: "Ogrenci s[1] = {{\"A\", 20, 50.0}};", expr: "sinif_ortalamasi(s, 0)", type: "double", expected: 0 }
        ],
        hints: ["Struct dizisinde i'nci öğrencinin alanı: d[i].ortalama", "double toplam = 0; ile başla.", "n == 0 ise sıfıra bölme yapma."],
        solution: OGR + "\ndouble sinif_ortalamasi(const Ogrenci *d, int n) {\n  if (n == 0) return 0;\n  double toplam = 0;\n  for (int i = 0; i < n; i++) toplam += d[i].ortalama;\n  return toplam / n;\n}"
      }),
      c({
        id: "c8c3", kind: "Yaz", title: "Yaşa göre sırala", fn: "yasa_gore_sirala",
        prompt: "`void yasa_gore_sirala(Ogrenci *d, int n)` öğrencileri yaşa göre küçükten büyüğe **yerinde** sıralasın (eklemeli sıralama yeterli).",
        starter: OGR + "\nvoid yasa_gore_sirala(Ogrenci *d, int n) {\n  \n}\n",
        tests: [
          { label: "yaşlar", setup: "Ogrenci s[4] = {{\"A\", 30, 0}, {\"B\", 19, 0}, {\"C\", 25, 0}, {\"D\", 22, 0}}; yasa_gore_sirala(s, 4);", expr: "s[0].yas * 1000000 + s[1].yas * 10000 + s[2].yas * 100 + s[3].yas", type: "int", expected: 19222530 },
          { label: "adlar yaşlarıyla birlikte taşınır", setup: "Ogrenci s[3] = {{\"Can\", 30, 0}, {\"Ece\", 19, 0}, {\"Ali\", 25, 0}}; yasa_gore_sirala(s, 3);", expr: "s[0].ad", type: "str", expected: "Ece" }
        ],
        hints: ["Struct'lar bütün olarak atanabilir ve kopyalanabilir: Ogrenci t = d[j];", "Eklemeli sıralama: her elemanı solundaki sıralı kısımda doğru yere kaydır.", "for (int i = 1; i < n; i++) { Ogrenci k = d[i]; int j = i - 1; while (j >= 0 && d[j].yas > k.yas) { d[j + 1] = d[j]; j--; } d[j + 1] = k; }"],
        solution: OGR + "\nvoid yasa_gore_sirala(Ogrenci *d, int n) {\n  for (int i = 1; i < n; i++) {\n    Ogrenci k = d[i];\n    int j = i - 1;\n    while (j >= 0 && d[j].yas > k.yas) {\n      d[j + 1] = d[j];\n      j--;\n    }\n    d[j + 1] = k;\n  }\n}"
      })
    ],
    cards: [
      { id: "c8k1", q: "Struct ataması (b = a) ne yapar?", a: "Tüm alanları kopyalar; b bağımsız bir kopyadır." },
      { id: "c8k2", q: "p->alan ile (*p).alan farkı?", a: "Fark yok; -> işaretçi üzerinden alan erişiminin kısaltmasıdır." },
      { id: "c8k3", q: "Struct içindeki char ad[32]'ye metin nasıl yazılır?", a: "= ile değil; strcpy ya da taşmaya karşı güvenli snprintf(ad, sizeof ad, \"%s\", kaynak) ile." }
    ]
  },

  /* ============================ C · FAZ 9 ============================ */
  {
    id: "c9", no: 9, language: "c", track: "c", title: "Dinamik bellek", short: "malloc & free",
    goal: "Çalışma anında bellek ayır, büyüt ve geri ver; sızıntıyı ve taşmayı sanitizer ile yakala.",
    concepts: ["malloc ve free", "NULL kontrolü", "realloc ile büyütme", "bellek sızıntısı"],
    predict: {
      lang: "c",
      code: "#include <stdlib.h>\n\nint main(void) {\n  int *p = malloc(100 * sizeof(int));\n  p = malloc(200 * sizeof(int));\n  free(p);\n  return 0;\n}",
      options: ["Hiçbir sorun yok", "İlk blok sızdı", "İkinci blok sızdı", "Çift free"], answer: 1,
      why: "p ikinci malloc'un adresiyle ezildiğinde ilk bloğun adresi kayboldu; artık onu free edemezsin. Buna bellek sızıntısı denir. Uzun çalışan programlarda bellek giderek tükenir. Her malloc'un tam bir free'si olmalı."
    },
    example: {
      title: "Büyüyen dizi (vector) fikri",
      lang: "c",
      code: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n  int kapasite = 2, boyut = 0;\n  int *veri = malloc(kapasite * sizeof *veri);\n  if (!veri) return 1;\n  for (int i = 1; i <= 5; i++) {\n    if (boyut == kapasite) {\n      kapasite *= 2;\n      int *yeni = realloc(veri, kapasite * sizeof *veri);\n      if (!yeni) { free(veri); return 1; }\n      veri = yeni;\n    }\n    veri[boyut++] = i * i;\n  }\n  for (int i = 0; i < boyut; i++) printf(\"%d \", veri[i]);\n  printf(\"(kapasite %d)\\n\", kapasite);\n  free(veri);\n  return 0;\n}",
      steps: [
        { lines: [6, 7], text: "malloc bayt sayısı ister; sizeof *veri eleman boyutudur. malloc başarısız olabilir: NULL kontrolü şart." },
        { lines: [9, 10, 11], text: "Dolunca kapasiteyi ikiye katla. realloc mevcut veriyi koruyarak bloğu büyütür (gerekirse taşır)." },
        { lines: [12, 13], text: "realloc başarısız olursa eski blok hâlâ geçerlidir; sonucu önce geçici değişkene al, yoksa eski adresi kaybedersin." },
        { lines: [19], text: "İş bitince free. İkiye katlama, ekleme başına ortalama O(1) maliyet sağlar." }
      ]
    },
    challenges: [
      c({
        id: "c9c1", kind: "Yaz", title: "Aralık dizisi", fn: "aralik",
        prompt: "`int *aralik(int bas, int son)` `bas`'tan `son`'a kadar (son hariç) sayıları içeren, **malloc ile ayrılmış** bir dizi döndürsün. Belleği çağıran free eder.",
        starter: "#include <stdlib.h>\n\nint *aralik(int bas, int son) {\n  return NULL;\n}\n",
        tests: [
          { label: "aralik(3, 7)", setup: "int *p = aralik(3, 7);", expr: "p[0] * 1000 + p[1] * 100 + p[2] * 10 + p[3]", type: "int", expected: 3456 },
          { label: "büyük aralık", setup: "int *p = aralik(0, 10000);", expr: "p[9999]", type: "int", expected: 9999 },
          { label: "fazladan ayırma yok", setup: "long once = kd_ayrilan; int *p = aralik(0, 100); free(p);", expr: "kd_ayrilan - once", type: "long", expected: 0 }
        ],
        hints: ["Kaç eleman gerekiyor? Kaç bayt?", "int *p = malloc((son - bas) * sizeof *p); if (!p) return NULL;", "for (int i = 0; i < son - bas; i++) p[i] = bas + i;"],
        solution: "#include <stdlib.h>\n\nint *aralik(int bas, int son) {\n  int n = son - bas;\n  int *p = malloc(n * sizeof *p);\n  if (!p) return NULL;\n  for (int i = 0; i < n; i++) p[i] = bas + i;\n  return p;\n}"
      }),
      c({
        id: "c9c2", kind: "Hata Ayıkla", title: "Metin birleştir", fn: "birlestir",
        prompt: "`char *birlestir(const char *a, const char *b)` iki metni yeni ayrılmış bir metinde birleştirmeli. Bu sürüm bazen çöküyor; sanitizer'ın ne dediğini oku ve düzelt.",
        starter: "#include <stdlib.h>\n#include <string.h>\n\nchar *birlestir(const char *a, const char *b) {\n  char *s = malloc(strlen(a) + strlen(b));\n  strcpy(s, a);\n  strcat(s, b);\n  return s;\n}\n",
        tests: [
          { label: "\"QUA\" + \"GEN\"", setup: "char *s = birlestir(\"QUA\", \"GEN\");", expr: "s", type: "str", expected: "QUAGEN" },
          { label: "boş metinler", setup: "char *s = birlestir(\"\", \"\");", expr: "s", type: "str", expected: "" },
          { label: "sızıntı yok", setup: "long once = kd_ayrilan; char *s = birlestir(\"a\", \"b\"); free(s);", expr: "kd_ayrilan - once", type: "long", expected: 0 }
        ],
        hints: ["Sanitizer 'heap-buffer-overflow' diyor. Yeni metin için kaç bayt gerekiyor?", "Metnin sonundaki '\\0' da bir bayt yer kaplar.", "malloc(strlen(a) + strlen(b) + 1) ve NULL kontrolü."],
        solution: "#include <stdlib.h>\n#include <string.h>\n\nchar *birlestir(const char *a, const char *b) {\n  size_t la = strlen(a), lb = strlen(b);\n  char *s = malloc(la + lb + 1);\n  if (!s) return NULL;\n  memcpy(s, a, la);\n  memcpy(s + la, b, lb + 1);\n  return s;\n}"
      }),
      c({
        id: "c9c3", kind: "Yaz", title: "Dinamik dizi", fn: "dizi_ekle",
        prompt: "`dizi_ekle(Dizi *d, int x)` diziyi gerekirse **iki katına** büyüterek (ilk kapasite 4) sona eklesin. `dizi_temizle(Dizi *d)` belleği geri verip alanları sıfırlasın.",
        starter: "#include <stdlib.h>\n\ntypedef struct {\n  int *veri;\n  int boyut;\n  int kapasite;\n} Dizi;\n\nvoid dizi_ekle(Dizi *d, int x) {\n  \n}\n\nvoid dizi_temizle(Dizi *d) {\n  \n}\n",
        tests: [
          { label: "1000 ekleme", setup: "Dizi d = {0}; for (int i = 0; i < 1000; i++) dizi_ekle(&d, i);", expr: "d.boyut * 10000 + d.veri[999] % 10000", type: "long", expected: 10000999 },
          { label: "ikiye katlama", setup: "Dizi d = {0}; for (int i = 0; i < 1000; i++) dizi_ekle(&d, i);", expr: "d.kapasite", type: "int", expected: 1024 },
          { label: "temizle ve sızıntı yok", setup: "long once = kd_ayrilan; Dizi d = {0}; for (int i = 0; i < 50; i++) dizi_ekle(&d, i); dizi_temizle(&d);", expr: "(kd_ayrilan - once) == 0 && d.veri == NULL && d.boyut == 0 && d.kapasite == 0", type: "bool", expected: true }
        ],
        hints: ["Önce yer var mı diye bak: boyut == kapasite ise büyüt.", "int yeni_kap = d->kapasite ? d->kapasite * 2 : 4; int *y = realloc(d->veri, yeni_kap * sizeof *y);", "Temizle: free(d->veri); d->veri = NULL; d->boyut = d->kapasite = 0;"],
        solution: "#include <stdlib.h>\n\ntypedef struct {\n  int *veri;\n  int boyut;\n  int kapasite;\n} Dizi;\n\nvoid dizi_ekle(Dizi *d, int x) {\n  if (d->boyut == d->kapasite) {\n    int yeni_kap = d->kapasite ? d->kapasite * 2 : 4;\n    int *y = realloc(d->veri, yeni_kap * sizeof *y);\n    if (!y) return;\n    d->veri = y;\n    d->kapasite = yeni_kap;\n  }\n  d->veri[d->boyut++] = x;\n}\n\nvoid dizi_temizle(Dizi *d) {\n  free(d->veri);\n  d->veri = NULL;\n  d->boyut = d->kapasite = 0;\n}"
      })
    ],
    cards: [
      { id: "c9k1", q: "malloc'tan sonra neden NULL kontrolü yapılır?", a: "Bellek ayrılamazsa malloc NULL döndürür; kontrol etmeden kullanmak programı çökertir." },
      { id: "c9k2", q: "Bellek sızıntısı nedir?", a: "Ayrılan bir bloğun adresini kaybedip free edememek. Program çalıştıkça bellek tükenir." },
      { id: "c9k3", q: "p = realloc(p, n) neden riskli?", a: "realloc başarısız olursa NULL döner ve p'nin eski adresi kaybolur (sızıntı). Sonucu önce geçici bir değişkene al." }
    ]
  },

  /* ============================ C · FAZ 10 ============================ */
  {
    id: "c10", no: 10, language: "c", track: "c", title: "Mini proje: bağlı liste", short: "Bağlı liste",
    goal: "İşaretçiler, struct'lar ve dinamik belleği birleştirerek sızıntısız bir bağlı liste kütüphanesi yaz.",
    concepts: ["öz-referanslı struct", "düğüm ekleme", "listeyi serbest bırakma", "yerinde ters çevirme"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Dugum { int deger; struct Dugum *sonraki; } Dugum;\n\nint main(void) {\n  Dugum *bas = malloc(sizeof(Dugum));\n  bas->deger = 1;\n  bas->sonraki = NULL;\n  free(bas);\n  printf(\"%d\\n\", bas->deger);\n  return 0;\n}",
      options: ["1 yazar, sorun yok", "0 yazar", "free edilmiş belleğe erişim (hata)", "Derleme hatası"], answer: 2,
      why: "free'den sonra bas hâlâ eski adresi tutar ama o bellek artık senin değil. Okumak tanımsız davranıştır; bazen 1 yazar, bazen çöker. AddressSanitizer bunu 'heap-use-after-free' olarak yakalar. Çalıştır ve raporu oku."
    },
    example: {
      title: "Listeyi dolaşmak",
      lang: "c",
      code: "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Dugum {\n  int deger;\n  struct Dugum *sonraki;\n} Dugum;\n\nint main(void) {\n  Dugum c = {3, NULL}, b = {2, &c}, a = {1, &b};\n  for (Dugum *d = &a; d != NULL; d = d->sonraki) {\n    printf(\"%d \", d->deger);\n  }\n  printf(\"\\n\");\n  return 0;\n}",
      steps: [
        { lines: [4, 5, 6, 7], text: "Öz-referanslı struct: düğüm, kendi türünden bir sonrakine işaretçi tutar. İçeride struct Dugum adını kullanmak gerekir." },
        { lines: [10], text: "Burada düğümler yığında; gerçek listede malloc ile ayrılır ve sayısı çalışma anında değişir." },
        { lines: [11, 12, 13], text: "Algoritmalar parkurundaki bağlı listenin aynısı; bu kez belleği sen yönetiyorsun." }
      ]
    },
    challenges: [
      c({
        id: "c10c1", kind: "Yaz", title: "Başa ekle", fn: "basa_ekle",
        prompt: "`Dugum *basa_ekle(Dugum *bas, int deger)` malloc ile yeni bir düğüm oluşturup listenin başına eklesin ve yeni başı döndürsün.",
        starter: "#include <stdlib.h>\n\n" + DUGUM + "\nDugum *basa_ekle(Dugum *bas, int deger) {\n  \n}\n",
        tests: [
          { label: "1 → 2 → 3", setup: L123, expr: "l->deger * 100 + l->sonraki->deger * 10 + l->sonraki->sonraki->deger", type: "int", expected: 123 },
          { label: "son düğüm NULL'a bakar", setup: L123, expr: "l->sonraki->sonraki->sonraki == NULL", type: "bool", expected: true },
          { label: "her düğüm için bir malloc", setup: "long once = kd_ayrilan; " + L123, expr: "kd_ayrilan - once", type: "long", expected: 3 }
        ],
        hints: ["Yeni düğümün sonraki'si eski baş olmalı.", "Dugum *d = malloc(sizeof(Dugum)); if (!d) return bas;", "d->deger = deger; d->sonraki = bas; return d;"],
        solution: "#include <stdlib.h>\n\n" + DUGUM + "\n" + BASA
      }),
      c({
        id: "c10c2", kind: "Yaz", title: "Uzunluk ve silme", fn: "liste_sil",
        prompt: "`int uzunluk(const Dugum *bas)` düğüm sayısını döndürsün. `void liste_sil(Dugum *bas)` tüm düğümleri free etsin; **hiç sızıntı** kalmasın ve free edilmiş belleğe dokunulmasın.",
        starter: "#include <stdlib.h>\n\n" + DUGUM + "\n" + BASA + "\nint uzunluk(const Dugum *bas) {\n  \n}\n\nvoid liste_sil(Dugum *bas) {\n  \n}\n",
        tests: [
          { label: "uzunluk(1 → 2 → 3)", setup: L123, expr: "uzunluk(l)", type: "int", expected: 3 },
          { label: "boş liste", expr: "uzunluk(NULL)", type: "int", expected: 0 },
          { label: "silince sızıntı yok", setup: "long once = kd_ayrilan; " + L123 + " liste_sil(l);", expr: "kd_ayrilan - once", type: "long", expected: 0 },
          { label: "boş listeyi silmek güvenli", setup: "liste_sil(NULL);", expr: "1", type: "int", expected: 1 }
        ],
        hints: ["Bir düğümü free etmeden önce neyi saklaman gerekir?", "free(bas)'tan sonra bas->sonraki okumak 'use-after-free' olur.", "Dugum *sonraki = bas->sonraki; free(bas); bas = sonraki;"],
        solution: "#include <stdlib.h>\n\n" + DUGUM + "\n" + BASA + "\nint uzunluk(const Dugum *bas) {\n  int n = 0;\n  for (; bas; bas = bas->sonraki) n++;\n  return n;\n}\n\n" + SIL
      }),
      c({
        id: "c10c3", kind: "Yaz", title: "Yerinde ters çevir", fn: "ters_cevir",
        prompt: "`Dugum *ters_cevir(Dugum *bas)` listeyi yeni düğüm ayırmadan **yerinde** ters çevirip yeni başı döndürsün.",
        starter: "#include <stdlib.h>\n\n" + DUGUM + "\n" + BASA + "\n" + SIL + "\nDugum *ters_cevir(Dugum *bas) {\n  \n}\n",
        tests: [
          { label: "1 → 2 → 3 ⇒ 3 → 2 → 1", setup: L123 + " l = ters_cevir(l);", expr: "l->deger * 100 + l->sonraki->deger * 10 + l->sonraki->sonraki->deger", type: "int", expected: 321 },
          { label: "boş liste", expr: "ters_cevir(NULL) == NULL", type: "bool", expected: true },
          { label: "yeni düğüm ayrılmıyor, silince sızıntı yok", setup: "long once = kd_ayrilan; " + L123 + " long sonra = kd_ayrilan; l = ters_cevir(l); long fark = kd_ayrilan - sonra; liste_sil(l);", expr: "fark == 0 && kd_ayrilan == once", type: "bool", expected: true }
        ],
        hints: ["Algoritmalar parkurundaki ters çevirmeyle aynı fikir: üç işaretçi.", "Dugum *onceki = NULL; while (bas) { … }", "Dugum *sonraki = bas->sonraki; bas->sonraki = onceki; onceki = bas; bas = sonraki; — sonunda onceki'yi döndür."],
        solution: "#include <stdlib.h>\n\n" + DUGUM + "\n" + BASA + "\n" + SIL + "\nDugum *ters_cevir(Dugum *bas) {\n  Dugum *onceki = NULL;\n  while (bas) {\n    Dugum *sonraki = bas->sonraki;\n    bas->sonraki = onceki;\n    onceki = bas;\n    bas = sonraki;\n  }\n  return onceki;\n}"
      })
    ],
    cards: [
      { id: "c10k1", q: "Bir bağlı listeyi free ederken doğru sıra?", a: "Önce sonraki düğümün adresini sakla, sonra mevcut düğümü free et, sonra saklanan adrese geç." },
      { id: "c10k2", q: "use-after-free nedir?", a: "free edilmiş belleği okumak ya da yazmak. Tanımsız davranıştır; AddressSanitizer yakalar." },
      { id: "c10k3", q: "Öz-referanslı struct nasıl tanımlanır?", a: "typedef struct Dugum { int deger; struct Dugum *sonraki; } Dugum; — içeride struct Dugum adı kullanılır." }
    ]
  }
  ];

  window.KD_CURRICULUM = (window.KD_CURRICULUM || []).concat(C);
})();
