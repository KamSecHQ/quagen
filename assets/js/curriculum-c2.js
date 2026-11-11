/* QUAGEN NextGen — Müfredat: İleri C, Ders 11–20 (dil: C, parkur: c2)
 * Aynı C çalıştırıcı (clang + AddressSanitizer/UBSan). Testler curriculum-c.js'deki biçimi kullanır.
 */
(function () {
  const c = (o) => Object.assign({ lang: "c" }, o);
  const TABLO = "#include <stdlib.h>\n#include <string.h>\n\n#define KOVA 64\n\ntypedef struct Girdi {\n  char *anahtar;\n  int deger;\n  struct Girdi *sonraki;\n} Girdi;\n\ntypedef struct {\n  Girdi *kovalar[KOVA];\n  int boyut;\n} Tablo;\n";
  const DJB2 = "\nunsigned long djb2(const char *s) {\n  unsigned long h = 5381;\n  for (; *s; s++) h = h * 33 + (unsigned char)*s;\n  return h;\n}\n";
  const KOY_AL = "\nint *tablo_al(Tablo *t, const char *anahtar) {\n  for (Girdi *g = t->kovalar[djb2(anahtar) % KOVA]; g; g = g->sonraki)\n    if (strcmp(g->anahtar, anahtar) == 0) return &g->deger;\n  return NULL;\n}\n\nvoid tablo_koy(Tablo *t, const char *anahtar, int deger) {\n  int *v = tablo_al(t, anahtar);\n  if (v) { *v = deger; return; }\n  Girdi *g = malloc(sizeof *g);\n  if (!g) return;\n  g->anahtar = malloc(strlen(anahtar) + 1);\n  if (!g->anahtar) { free(g); return; }\n  strcpy(g->anahtar, anahtar);\n  g->deger = deger;\n  unsigned long k = djb2(anahtar) % KOVA;\n  g->sonraki = t->kovalar[k];\n  t->kovalar[k] = g;\n  t->boyut++;\n}\n";
  const DAL = "#include <stdlib.h>\n#include <stdbool.h>\n\ntypedef struct Dal {\n  int deger;\n  struct Dal *sol, *sag;\n} Dal;\n";
  const EKLE = "\nDal *ekle(Dal *kok, int deger) {\n  if (!kok) {\n    Dal *d = malloc(sizeof *d);\n    if (!d) return NULL;\n    d->deger = deger;\n    d->sol = d->sag = NULL;\n    return d;\n  }\n  if (deger < kok->deger) kok->sol = ekle(kok->sol, deger);\n  else if (deger > kok->deger) kok->sag = ekle(kok->sag, deger);\n  return kok;\n}\n";
  const AGAC = "Dal *k = NULL; int s[] = {5, 3, 8, 1, 4}; for (int i = 0; i < 5; i++) k = ekle(k, s[i]);";

  const C2 = [
  /* ============================ C · DERS 11 ============================ */
  {
    id: "c11", no: 11, language: "c", track: "c2", title: "Bit işlemleri", short: "Bitler",
    goal: "Sayıların ikili gösterimiyle doğrudan çalış: maskeler, bayraklar ve bit sayma.",
    concepts: ["& | ^ ~", "<< ve >>", "bit maskesi", "işaretsiz türler"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nint main(void) {\n  printf(\"%d %d %d\\n\", 6 & 3, 6 | 3, 6 ^ 3);\n  return 0;\n}",
      options: ["2 7 5", "9 9 3", "2 7 4", "0 7 5"], answer: 0,
      why: "6 = 110, 3 = 011. VE (&): yalnızca ikisinde de 1 olan bit → 010 = 2. VEYA (|): herhangi birinde 1 → 111 = 7. ÖZEL VEYA (^): yalnızca birinde 1 → 101 = 5."
    },
    example: {
      title: "İzin bayrakları",
      lang: "c",
      code: "#include <stdio.h>\n\nenum { OKU = 1 << 0, YAZ = 1 << 1, CALISTIR = 1 << 2 };\n\nint main(void) {\n  unsigned izin = OKU;\n  izin |= YAZ;                 /* biti aç */\n  printf(\"yazabilir mi: %d\\n\", (izin & YAZ) != 0);\n  izin &= ~YAZ;                /* biti kapat */\n  izin ^= CALISTIR;            /* biti tersine çevir */\n  printf(\"izin = %u\\n\", izin);\n  return 0;\n}",
      steps: [
        { lines: [3], text: "Her izin tek bir bit: 001, 010, 100. 1 << n, n'inci biti 1 olan sayıdır." },
        { lines: [7], text: "|= biti açar; diğer bitlere dokunmaz." },
        { lines: [8], text: "& ile maskeleyip sıfırdan farklı mı diye bakarak bitin açık olup olmadığını sınarsın." },
        { lines: [9, 10], text: "&= ~MASKE biti kapatır, ^= tersine çevirir. Sonuç: OKU | CALISTIR = 5." }
      ]
    },
    challenges: [
      c({
        id: "c11c1", kind: "Değiştir", title: "İkinin kuvveti mi?", fn: "ikinin_kuvveti_mi",
        prompt: "`bool ikinin_kuvveti_mi(unsigned x)` x, 2'nin bir kuvvetiyse `true` döndürsün. Başlangıç kodu döngüyle çalışıyor; **döngüsüz, tek bir bit işlemiyle** yaz.",
        starter: "#include <stdbool.h>\n\nbool ikinin_kuvveti_mi(unsigned x) {\n  if (x == 0) return false;\n  while (x % 2 == 0) x /= 2;\n  return x == 1;\n}\n",
        tests: [
          { label: "1", expr: "ikinin_kuvveti_mi(1)", type: "bool", expected: true },
          { label: "1024", expr: "ikinin_kuvveti_mi(1024)", type: "bool", expected: true },
          { label: "6", expr: "ikinin_kuvveti_mi(6)", type: "bool", expected: false },
          { label: "0", expr: "ikinin_kuvveti_mi(0)", type: "bool", expected: false },
          { label: "2147483648", expr: "ikinin_kuvveti_mi(2147483648u)", type: "bool", expected: true },
          { label: "döngü yok", codeNot: "\\b(for|while)\\b", codeHint: "döngü kullanılmamalı" }
        ],
        hints: ["2'nin kuvvetlerinin ikili gösteriminde kaç tane 1 vardır?", "x − 1, en sağdaki 1'i sıfırlar ve sağındaki tüm bitleri 1 yapar. x & (x − 1) ne verir?", "return x != 0 && (x & (x - 1)) == 0;"],
        solution: "#include <stdbool.h>\n\nbool ikinin_kuvveti_mi(unsigned x) {\n  return x != 0 && (x & (x - 1)) == 0;\n}"
      }),
      c({
        id: "c11c2", kind: "Yaz", title: "Bit sayacı", fn: "bit_say",
        prompt: "`int bit_say(unsigned x)` x'in ikili gösteriminde kaç tane 1 olduğunu döndürsün. Hazır fonksiyon (`__builtin_popcount`) kullanma.",
        starter: "int bit_say(unsigned x) {\n  \n}\n",
        tests: [
          { label: "0", expr: "bit_say(0)", type: "int", expected: 0 },
          { label: "7 (111)", expr: "bit_say(7)", type: "int", expected: 3 },
          { label: "255", expr: "bit_say(255)", type: "int", expected: 8 },
          { label: "4294967295", expr: "bit_say(4294967295u)", type: "int", expected: 32 },
          { label: "hazır fonksiyon yok", codeNot: "popcount", codeHint: "kendin say" }
        ],
        hints: ["En sağdaki bit 1 mi? Bunu & ile öğrenebilirsin.", "Sonra sayıyı bir bit sağa kaydır (>>) ve tekrarla.", "while (x) { n += x & 1; x >>= 1; } — daha hızlısı: while (x) { x &= x - 1; n++; }"],
        solution: "int bit_say(unsigned x) {\n  int n = 0;\n  while (x) {\n    x &= x - 1;\n    n++;\n  }\n  return n;\n}"
      }),
      c({
        id: "c11c3", kind: "Yaz", title: "Bayt ters çevir", fn: "bitleri_ters",
        prompt: "`unsigned char bitleri_ters(unsigned char b)` bir baytın 8 bitini ters sırada döndürsün: 00000110 → 01100000.",
        starter: "unsigned char bitleri_ters(unsigned char b) {\n  \n}\n",
        tests: [
          { label: "1 → 128", expr: "bitleri_ters(1)", type: "int", expected: 128 },
          { label: "6 → 96", expr: "bitleri_ters(6)", type: "int", expected: 96 },
          { label: "255 → 255", expr: "bitleri_ters(255)", type: "int", expected: 255 },
          { label: "0 → 0", expr: "bitleri_ters(0)", type: "int", expected: 0 },
          { label: "176 → 13", expr: "bitleri_ters(176)", type: "int", expected: 13 }
        ],
        hints: ["Sonucu bit bit kur: b'nin en sağdaki biti sonucun en soluna gitmeli.", "8 tur dön; her turda sonucu sola kaydır, b'nin son bitini ekle, b'yi sağa kaydır.", "r = (r << 1) | (b & 1); b >>= 1;"],
        solution: "unsigned char bitleri_ters(unsigned char b) {\n  unsigned char r = 0;\n  for (int i = 0; i < 8; i++) {\n    r = (unsigned char)((r << 1) | (b & 1));\n    b >>= 1;\n  }\n  return r;\n}"
      })
    ],
    cards: [
      { id: "c11k1", q: "Bir biti açmak, kapatmak ve tersine çevirmek için?", a: "Açmak: x |= M. Kapatmak: x &= ~M. Tersine çevirmek: x ^= M." },
      { id: "c11k2", q: "x & (x − 1) ne yapar?", a: "x'in en sağdaki 1 bitini sıfırlar. Sonuç 0 ise (ve x ≠ 0) x, 2'nin kuvvetidir." },
      { id: "c11k3", q: "Bit işlemlerinde neden işaretsiz türler tercih edilir?", a: "İşaretli sayıların sağa kaydırılması ve taşması tanımsız ya da uygulamaya bağlıdır; işaretsizlerde davranış kesindir." }
    ]
  },

  /* ============================ C · DERS 12 ============================ */
  {
    id: "c12", no: 12, language: "c", track: "c2", title: "Enum, switch ve durum makineleri", short: "Enum & switch",
    goal: "Sınırlı seçenekleri enum ile adlandır, switch ile dallan ve durum makinesi kur.",
    concepts: ["enum", "switch ve break", "düşme (fall-through)", "durum makinesi"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nint main(void) {\n  int x = 2;\n  switch (x) {\n    case 1: printf(\"a\");\n    case 2: printf(\"b\");\n    case 3: printf(\"c\"); break;\n    default: printf(\"d\");\n  }\n  printf(\"\\n\");\n  return 0;\n}",
      options: ["b", "bc", "bcd", "abc"], answer: 1,
      why: "switch eşleşen case'e atlar ve break görene kadar alttaki case'leri de çalıştırır (düşme). case 2'den başlar, case 3'ü de çalıştırır, break'te durur: \"bc\"."
    },
    example: {
      title: "Trafik ışığı durum makinesi",
      lang: "c",
      code: "#include <stdio.h>\n\ntypedef enum { KIRMIZI, YESIL, SARI } Isik;\n\nconst char *ad(Isik i) {\n  switch (i) {\n    case KIRMIZI: return \"kırmızı\";\n    case YESIL:   return \"yeşil\";\n    case SARI:    return \"sarı\";\n  }\n  return \"?\";\n}\n\nint main(void) {\n  Isik i = KIRMIZI;\n  for (int t = 0; t < 4; t++) {\n    printf(\"%s\\n\", ad(i));\n    i = (i == KIRMIZI) ? YESIL : (i == YESIL) ? SARI : KIRMIZI;\n  }\n  return 0;\n}",
      steps: [
        { lines: [3], text: "enum sabitlere ad verir: KIRMIZI = 0, YESIL = 1, SARI = 2. Sihirli sayılar yerine okunur adlar." },
        { lines: [6, 7, 8, 9], text: "return içeren case'lerde break gerekmez. Derleyici, enum'ın tüm değerleri ele alınmadıysa uyarabilir." },
        { lines: [16, 17, 18], text: "Durum makinesi: her adımda mevcut durum ve kural bir sonraki durumu belirler." }
      ]
    },
    challenges: [
      c({
        id: "c12c1", kind: "Hata Ayıkla", title: "Hep pazar", fn: "gun_adi",
        prompt: "`gun_adi(0)` \"Pazartesi\" döndürmeli ama her gün için \"Pazar\" dönüyor. Neden? Düzelt. Geçersiz gün için \"Geçersiz\".",
        starter: "const char *gun_adi(int g) {\n  const char *ad = \"Geçersiz\";\n  switch (g) {\n    case 0: ad = \"Pazartesi\";\n    case 1: ad = \"Salı\";\n    case 2: ad = \"Çarşamba\";\n    case 3: ad = \"Perşembe\";\n    case 4: ad = \"Cuma\";\n    case 5: ad = \"Cumartesi\";\n    case 6: ad = \"Pazar\";\n  }\n  return ad;\n}\n",
        tests: [
          { label: "0", expr: "gun_adi(0)", type: "str", expected: "Pazartesi" },
          { label: "4", expr: "gun_adi(4)", type: "str", expected: "Cuma" },
          { label: "6", expr: "gun_adi(6)", type: "str", expected: "Pazar" },
          { label: "9", expr: "gun_adi(9)", type: "str", expected: "Geçersiz" }
        ],
        hints: ["Tahmin sorusundaki davranışı hatırla: case'ten sonra ne olur?", "Her atamadan sonra switch'ten çıkman gerekiyor.", "Her case'in sonuna break; ekle (ya da doğrudan return \"…\"; yaz)."],
        solution: "const char *gun_adi(int g) {\n  switch (g) {\n    case 0: return \"Pazartesi\";\n    case 1: return \"Salı\";\n    case 2: return \"Çarşamba\";\n    case 3: return \"Perşembe\";\n    case 4: return \"Cuma\";\n    case 5: return \"Cumartesi\";\n    case 6: return \"Pazar\";\n    default: return \"Geçersiz\";\n  }\n}"
      }),
      c({
        id: "c12c2", kind: "Yaz", title: "Sonraki ışık", fn: "sonraki",
        prompt: "`Isik sonraki(Isik i)` trafik ışığının bir sonraki durumunu döndürsün: KIRMIZI → YESIL → SARI → KIRMIZI.",
        starter: "typedef enum { KIRMIZI, YESIL, SARI } Isik;\n\nIsik sonraki(Isik i) {\n  \n}\n",
        tests: [
          { label: "KIRMIZI → YESIL", expr: "sonraki(KIRMIZI) == YESIL", type: "bool", expected: true },
          { label: "YESIL → SARI", expr: "sonraki(YESIL) == SARI", type: "bool", expected: true },
          { label: "SARI → KIRMIZI", expr: "sonraki(SARI) == KIRMIZI", type: "bool", expected: true },
          { label: "üç adım sonra başa döner", expr: "sonraki(sonraki(sonraki(YESIL))) == YESIL", type: "bool", expected: true }
        ],
        hints: ["Her durum için bir case yaz.", "switch (i) { case KIRMIZI: return YESIL; … }", "Ya da enum değerleri ardışıksa: return (Isik)((i + 1) % 3);"],
        solution: "typedef enum { KIRMIZI, YESIL, SARI } Isik;\n\nIsik sonraki(Isik i) {\n  switch (i) {\n    case KIRMIZI: return YESIL;\n    case YESIL: return SARI;\n    case SARI: return KIRMIZI;\n  }\n  return KIRMIZI;\n}"
      }),
      c({
        id: "c12c3", kind: "Yaz", title: "Hesap makinesi", fn: "hesapla",
        prompt: "`int hesapla(int a, char op, int b)` op `+ - * / %` için sonucu döndürsün. Sıfıra bölmede ve bilinmeyen operatörde 0 döndürsün.",
        starter: "int hesapla(int a, char op, int b) {\n  \n}\n",
        tests: [
          { label: "7 + 5", expr: "hesapla(7, '+', 5)", type: "int", expected: 12 },
          { label: "7 - 5", expr: "hesapla(7, '-', 5)", type: "int", expected: 2 },
          { label: "7 * 5", expr: "hesapla(7, '*', 5)", type: "int", expected: 35 },
          { label: "7 / 2", expr: "hesapla(7, '/', 2)", type: "int", expected: 3 },
          { label: "7 % 3", expr: "hesapla(7, '%', 3)", type: "int", expected: 1 },
          { label: "sıfıra bölme", expr: "hesapla(7, '/', 0) + hesapla(7, '%', 0)", type: "int", expected: 0 },
          { label: "bilinmeyen", expr: "hesapla(7, '^', 2)", type: "int", expected: 0 }
        ],
        hints: ["switch char değerleriyle de çalışır: case '+':", "Bölme ve kalanda önce b == 0 kontrolü.", "default: return 0;"],
        solution: "int hesapla(int a, char op, int b) {\n  switch (op) {\n    case '+': return a + b;\n    case '-': return a - b;\n    case '*': return a * b;\n    case '/': return b ? a / b : 0;\n    case '%': return b ? a % b : 0;\n    default: return 0;\n  }\n}"
      })
    ],
    cards: [
      { id: "c12k1", q: "switch'te break unutulursa ne olur?", a: "Eşleşen case'ten sonra alttaki case'ler de çalışır (düşme / fall-through)." },
      { id: "c12k2", q: "enum neden sihirli sayılardan iyidir?", a: "Değerlere anlamlı ad verir, okunurluğu artırır; derleyici eksik case'ler için uyarabilir." },
      { id: "c12k3", q: "Durum makinesi nedir?", a: "Sistemin sınırlı sayıda durumu ve durumdan duruma geçiş kuralları olan model." }
    ]
  },

  /* ============================ C · DERS 13 ============================ */
  {
    id: "c13", no: 13, language: "c", track: "c2", title: "Fonksiyon işaretçileri ve qsort", short: "Fonksiyon işaretçileri",
    goal: "Fonksiyonları değer gibi aktar; standart qsort ile her türlü veriyi sırala.",
    concepts: ["int (*f)(int)", "geri çağırma", "qsort", "void * ve karşılaştırıcı"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nint kare(int x) { return x * x; }\n\nint main(void) {\n  int (*f)(int) = kare;\n  printf(\"%d\\n\", f(f(2)));\n  return 0;\n}",
      options: ["4", "8", "16", "Derleme hatası"], answer: 2,
      why: "f, kare fonksiyonunu gösteren bir işaretçi. f(2) = 4, f(4) = 16. JavaScript'te fonksiyonları değer gibi aktarmıştın (map, filter); C'de bunu fonksiyon işaretçileriyle yaparsın."
    },
    example: {
      title: "qsort ile sıralama",
      lang: "c",
      code: "#include <stdio.h>\n#include <stdlib.h>\n\nint artan(const void *a, const void *b) {\n  int x = *(const int *)a, y = *(const int *)b;\n  return (x > y) - (x < y);\n}\n\nint main(void) {\n  int d[] = {42, 7, 19, 3};\n  qsort(d, 4, sizeof d[0], artan);\n  for (int i = 0; i < 4; i++) printf(\"%d \", d[i]);\n  printf(\"\\n\");\n  return 0;\n}",
      steps: [
        { lines: [4], text: "qsort her türü sıralayabilir; bu yüzden karşılaştırıcı void * alır. Sen onu doğru türe dönüştürürsün." },
        { lines: [6], text: "Negatif: a önce, pozitif: b önce, 0: eşit. (x > y) − (x < y) taşma olmadan −1, 0 ya da 1 verir. x − y yazmak büyük sayılarda taşar." },
        { lines: [11], text: "qsort(dizi, eleman sayısı, eleman boyutu, karşılaştırıcı). Karşılaştırıcı, fonksiyon işaretçisi olarak geçer." }
      ]
    },
    challenges: [
      c({
        id: "c13c1", kind: "Değiştir", title: "Her elemana uygula", fn: "uygula",
        prompt: "`void uygula(int *d, int n, int (*f)(int))` dizinin her elemanını `f` ile dönüştürsün (yerinde). Başlangıç kodu f'yi hiç çağırmıyor. `kare_al` ve `iki_kati` testlerde kullanılıyor; silme.",
        starter: "int kare_al(int x) { return x * x; }\nint iki_kati(int x) { return 2 * x; }\n\nvoid uygula(int *d, int n, int (*f)(int)) {\n  for (int i = 0; i < n; i++) d[i] = d[i];\n}\n",
        tests: [
          { label: "kare_al", setup: "int a[] = {1, 2, 3}; uygula(a, 3, kare_al);", expr: "a[0] * 100 + a[1] * 10 + a[2]", type: "int", expected: 149 },
          { label: "iki_kati", setup: "int a[] = {1, 2, 3}; uygula(a, 3, iki_kati);", expr: "a[0] * 100 + a[1] * 10 + a[2]", type: "int", expected: 246 },
          { label: "iki kez", setup: "int a[] = {3}; uygula(a, 1, iki_kati); uygula(a, 1, kare_al);", expr: "a[0]", type: "int", expected: 36 }
        ],
        hints: ["f bir fonksiyon; normal bir fonksiyon gibi çağırabilirsin.", "f(d[i])", "d[i] = f(d[i]);"],
        solution: "int kare_al(int x) { return x * x; }\nint iki_kati(int x) { return 2 * x; }\n\nvoid uygula(int *d, int n, int (*f)(int)) {\n  for (int i = 0; i < n; i++) d[i] = f(d[i]);\n}"
      }),
      c({
        id: "c13c2", kind: "Yaz", title: "Azalan karşılaştırıcı", fn: "azalan",
        prompt: "`int azalan(const void *a, const void *b)` qsort'un tam sayıları **büyükten küçüğe** sıralaması için karşılaştırıcı olsun. Çok büyük ve çok küçük sayılarda da taşma olmamalı.",
        starter: "int azalan(const void *a, const void *b) {\n  \n}\n",
        tests: [
          { label: "{3, 1, 2, 5}", setup: "int a[] = {3, 1, 2, 5}; qsort(a, 4, sizeof(int), azalan);", expr: "a[0] * 1000 + a[1] * 100 + a[2] * 10 + a[3]", type: "int", expected: 5321 },
          { label: "uç değerler, taşma yok", setup: "int a[] = {-2147483647, 2147483647, 0}; qsort(a, 3, sizeof(int), azalan);", expr: "a[0] == 2147483647 && a[1] == 0 && a[2] == -2147483647", type: "bool", expected: true }
        ],
        hints: ["Önce void *'ı const int *'a dönüştür ve değeri oku.", "y − x yazmak büyük sayılarda taşar (UBSan yakalar).", "return (x < y) - (x > y);"],
        solution: "int azalan(const void *a, const void *b) {\n  int x = *(const int *)a, y = *(const int *)b;\n  return (x < y) - (x > y);\n}"
      }),
      c({
        id: "c13c3", kind: "Yaz", title: "Ürünleri ada göre sırala", fn: "ada_gore",
        prompt: "`int ada_gore(const void *a, const void *b)` `Urun` struct'larını ada göre alfabetik sıralayan karşılaştırıcı olsun.",
        starter: "#include <string.h>\n\ntypedef struct {\n  char ad[20];\n  int fiyat;\n} Urun;\n\nint ada_gore(const void *a, const void *b) {\n  \n}\n",
        tests: [
          { label: "sıralama", setup: "Urun u[] = {{\"kalem\", 10}, {\"defter\", 25}, {\"silgi\", 5}, {\"cetvel\", 15}}; qsort(u, 4, sizeof(Urun), ada_gore);", expr: "u[0].ad", type: "str", expected: "cetvel" },
          { label: "son eleman", setup: "Urun u[] = {{\"kalem\", 10}, {\"defter\", 25}, {\"silgi\", 5}}; qsort(u, 3, sizeof(Urun), ada_gore);", expr: "u[2].ad", type: "str", expected: "silgi" },
          { label: "fiyatlar adlarıyla birlikte taşınır", setup: "Urun u[] = {{\"b\", 2}, {\"a\", 1}}; qsort(u, 2, sizeof(Urun), ada_gore);", expr: "u[0].fiyat * 10 + u[1].fiyat", type: "int", expected: 12 }
        ],
        hints: ["Bu kez void * bir Urun'u gösteriyor.", "const Urun *x = a, *y = b;", "return strcmp(x->ad, y->ad);"],
        solution: "#include <string.h>\n\ntypedef struct {\n  char ad[20];\n  int fiyat;\n} Urun;\n\nint ada_gore(const void *a, const void *b) {\n  const Urun *x = a, *y = b;\n  return strcmp(x->ad, y->ad);\n}"
      })
    ],
    cards: [
      { id: "c13k1", q: "int (*f)(int) ne tanımlar?", a: "int alıp int döndüren bir fonksiyonu gösteren f adlı işaretçi." },
      { id: "c13k2", q: "qsort karşılaştırıcısı ne döndürmeli?", a: "a, b'den önce gelecekse negatif, sonra gelecekse pozitif, eşitse 0." },
      { id: "c13k3", q: "Karşılaştırıcıda neden return x − y yazılmaz?", a: "Büyük sayılarda işaretli tam sayı taşması olur (tanımsız davranış). (x > y) − (x < y) güvenlidir." }
    ]
  },

  /* ============================ C · DERS 14 ============================ */
  {
    id: "c14", no: 14, language: "c", track: "c2", title: "Önişlemci ve makrolar", short: "Makrolar",
    goal: "Derlemeden önce çalışan metin değiştiriciyi tanı; makroların tuzaklarını ve güvenli alternatiflerini öğren.",
    concepts: ["#define", "parantez kuralı", "çift değerlendirme", "static inline"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\n#define KARE(x) x * x\n\nint main(void) {\n  printf(\"%d\\n\", KARE(1 + 2));\n  return 0;\n}",
      options: ["9", "5", "6", "Derleme hatası"], answer: 1,
      why: "Makro, derlemeden önce metni olduğu gibi yerleştirir: KARE(1 + 2) → 1 + 2 * 1 + 2 = 5. Fonksiyon değil, metin değiştirmedir. Bu yüzden her parametre ve tüm ifade paranteze alınır."
    },
    example: {
      title: "Güvenli makro ve inline fonksiyon",
      lang: "c",
      code: "#include <stdio.h>\n\n#define DIZI_UZUNLUK(d) (sizeof(d) / sizeof((d)[0]))\n\nstatic inline int maks(int a, int b) { return a > b ? a : b; }\n\nint main(void) {\n  int notlar[] = {70, 85, 92};\n  int en = notlar[0];\n  for (size_t i = 1; i < DIZI_UZUNLUK(notlar); i++) en = maks(en, notlar[i]);\n  printf(\"%zu not, en yüksek %d\\n\", DIZI_UZUNLUK(notlar), en);\n  return 0;\n}",
      steps: [
        { lines: [3], text: "Parametre (d) ve tüm ifade parantezli. sizeof, makroyla birlikte kullanıldığında derleme anında hesaplanır." },
        { lines: [5], text: "static inline fonksiyon, makronun hızına yakın ama tür denetimi var ve argümanlar bir kez değerlendirilir." },
        { lines: [10], text: "DIZI_UZUNLUK yalnızca gerçek dizilerde doğru çalışır; işaretçiye dönüşmüş dizide (Ders 5) yanlış sonuç verir." }
      ]
    },
    challenges: [
      c({
        id: "c14c1", kind: "Hata Ayıkla", title: "Yanlış kare", fn: "KARE",
        prompt: "`KARE` makrosu bazı ifadelerde yanlış sonuç veriyor. Parantez kuralını uygulayarak düzelt.",
        starter: "#define KARE(x) x * x\n",
        tests: [
          { label: "KARE(3)", expr: "KARE(3)", type: "int", expected: 9 },
          { label: "KARE(1 + 2)", expr: "KARE(1 + 2)", type: "int", expected: 9 },
          { label: "100 / KARE(5)", expr: "100 / KARE(5)", type: "int", expected: 4 }
        ],
        hints: ["KARE(1 + 2) metin olarak neye dönüşüyor? Kâğıda yaz.", "Her parametreyi paranteze al: (x) * (x)", "100 / KARE(5) için tüm ifadeyi de paranteze al: ((x) * (x))"],
        solution: "#define KARE(x) ((x) * (x))"
      }),
      c({
        id: "c14c2", kind: "Yaz", title: "Dizi uzunluğu", fn: "DIZI_UZUNLUK",
        prompt: "`DIZI_UZUNLUK(d)` makrosu bir dizinin eleman sayısını versin.",
        starter: "#include <stddef.h>\n\n#define DIZI_UZUNLUK(d) 0\n",
        tests: [
          { label: "int[7]", setup: "int a[7];", expr: "DIZI_UZUNLUK(a)", type: "size", expected: 7 },
          { label: "double[3]", setup: "double b[3];", expr: "DIZI_UZUNLUK(b)", type: "size", expected: 3 },
          { label: "char dizisi", setup: "char s[] = \"kod\";", expr: "DIZI_UZUNLUK(s)", type: "size", expected: 4 }
        ],
        hints: ["Dizinin toplam bayt boyutunu bir elemanın boyutuna böl.", "sizeof(d) / sizeof(d[0])", "Parantez kuralını unutma: (sizeof(d) / sizeof((d)[0]))"],
        solution: "#include <stddef.h>\n\n#define DIZI_UZUNLUK(d) (sizeof(d) / sizeof((d)[0]))"
      }),
      c({
        id: "c14c3", kind: "Yaz", title: "Güvenli maksimum", fn: "maks_guvenli",
        prompt: "Önce `MAKS(a, b)` makrosunu yaz. Sonra aynı işi yapan `static inline int maks_guvenli(int a, int b)` yaz. Testler, argümanı yan etkili (`i++`) olan çağrıda makronun değil fonksiyonun doğru çalıştığını gösterecek.",
        starter: "#define MAKS(a, b) 0\n\nstatic inline int maks_guvenli(int a, int b) {\n  return 0;\n}\n",
        tests: [
          { label: "MAKS(3, 7)", expr: "MAKS(3, 7)", type: "int", expected: 7 },
          { label: "MAKS(-1, -5)", expr: "MAKS(-1, -5)", type: "int", expected: -1 },
          { label: "MAKS(2 + 3, 4)", expr: "MAKS(2 + 3, 4)", type: "int", expected: 5 },
          { label: "maks_guvenli(i++, 0): i bir kez artar", setup: "int i = 1; int m = maks_guvenli(i++, 0);", expr: "m * 10 + i", type: "int", expected: 12 }
        ],
        hints: ["Makroda her parametreyi ve tüm ifadeyi paranteze al.", "#define MAKS(a, b) ((a) > (b) ? (a) : (b))", "MAKS(i++, 0) yazsaydın i iki kez artardı: makro argümanı iki kez değerlendirir. Fonksiyonda bu olmaz."],
        solution: "#define MAKS(a, b) ((a) > (b) ? (a) : (b))\n\nstatic inline int maks_guvenli(int a, int b) {\n  return a > b ? a : b;\n}"
      })
    ],
    cards: [
      { id: "c14k1", q: "Makrolarda parantez kuralı?", a: "Her parametreyi ve tüm ifadeyi paranteze al: #define KARE(x) ((x) * (x))" },
      { id: "c14k2", q: "Makronun 'çift değerlendirme' tuzağı?", a: "Parametre makroda birden fazla geçiyorsa MAKS(i++, 0) gibi yan etkili argümanlar birden fazla çalışır." },
      { id: "c14k3", q: "Makro yerine ne zaman static inline fonksiyon?", a: "Hemen her zaman: tür denetimi var, argümanlar bir kez değerlendirilir, hata ayıklaması kolaydır." }
    ]
  },

  /* ============================ C · DERS 15 ============================ */
  {
    id: "c15", no: 15, language: "c", track: "c2", title: "Metin ayrıştırma", short: "Ayrıştırma",
    goal: "Ham metni adım adım okuyarak sayılara ve parçalara dönüştür: her ayrıştırıcının temeli.",
    concepts: ["karakter sınıfları (ctype.h)", "işaret ve basamak", "durumlu tarama", "char yığını"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n  printf(\"%d %d\\n\", atoi(\"42abc\"), atoi(\"abc42\"));\n  return 0;\n}",
      options: ["42 42", "42 0", "0 0", "Derleme hatası"], answer: 1,
      why: "atoi baştaki boşlukları atlar, isteğe bağlı işareti ve ardından gelen basamakları okur, ilk basamak olmayan karakterde durur. \"abc42\" basamakla başlamadığı için 0. atoi hata bildiremez; gerçek kodda strtol tercih edilir."
    },
    example: {
      title: "Kelimeleri saymak: içinde mi, dışında mı?",
      lang: "c",
      code: "#include <stdio.h>\n#include <ctype.h>\n#include <stdbool.h>\n\nint main(void) {\n  const char *s = \"  yazarak   ogren\\tkodera \";\n  int n = 0;\n  bool icinde = false;\n  for (const char *p = s; *p; p++) {\n    if (isspace((unsigned char)*p)) icinde = false;\n    else if (!icinde) { icinde = true; n++; }\n  }\n  printf(\"%d kelime\\n\", n);\n  return 0;\n}",
      steps: [
        { lines: [8], text: "Durumlu tarama: bir kelimenin içinde miyiz? Bu tek bit bilgi, art arda boşlukları doğru ele almayı sağlar." },
        { lines: [10], text: "isspace boşluk, sekme ve satır sonunu tanır. ctype.h fonksiyonlarına char'ı unsigned char'a dönüştürerek ver." },
        { lines: [11], text: "Boşluktan sonra gelen ilk karakter yeni bir kelimenin başlangıcıdır. Çıktı: 3 kelime." }
      ]
    },
    challenges: [
      c({
        id: "c15c1", kind: "Yaz", title: "Kendi atoi'n", fn: "benim_atoi",
        prompt: "`int benim_atoi(const char *s)` baştaki boşlukları atla, isteğe bağlı + ya da − işaretini oku, ardından gelen basamakları sayıya çevir; ilk basamak olmayan karakterde dur. `atoi`, `strtol`, `sscanf` kullanma.",
        starter: "#include <ctype.h>\n\nint benim_atoi(const char *s) {\n  \n}\n",
        tests: [
          { label: "\"42\"", expr: "benim_atoi(\"42\")", type: "int", expected: 42 },
          { label: "\"  -17\"", expr: "benim_atoi(\"  -17\")", type: "int", expected: -17 },
          { label: "\"+8x\"", expr: "benim_atoi(\"+8x\")", type: "int", expected: 8 },
          { label: "\"abc\"", expr: "benim_atoi(\"abc\")", type: "int", expected: 0 },
          { label: "boş metin", expr: "benim_atoi(\"\")", type: "int", expected: 0 },
          { label: "hazır fonksiyon yok", codeNot: "\\b(atoi|strtol|sscanf)\\s*\\(", codeHint: "kendin ayrıştır" }
        ],
        hints: ["Üç aşama: boşlukları atla → işareti oku → basamakları biriktir.", "Bir basamağın değeri: c − '0'. Biriktirme: n = n * 10 + (c − '0').", "while (isspace((unsigned char)*s)) s++; int isaret = 1; if (*s == '-' || *s == '+') { if (*s == '-') isaret = -1; s++; }"],
        solution: "#include <ctype.h>\n\nint benim_atoi(const char *s) {\n  while (isspace((unsigned char)*s)) s++;\n  int isaret = 1;\n  if (*s == '-' || *s == '+') {\n    if (*s == '-') isaret = -1;\n    s++;\n  }\n  int n = 0;\n  while (isdigit((unsigned char)*s)) {\n    n = n * 10 + (*s - '0');\n    s++;\n  }\n  return isaret * n;\n}"
      }),
      c({
        id: "c15c2", kind: "Yaz", title: "Kelime say", fn: "kelime_say",
        prompt: "`int kelime_say(const char *s)` boşluk karakterleriyle (boşluk, sekme, satır sonu) ayrılmış kelimeleri saysın.",
        starter: "#include <ctype.h>\n#include <stdbool.h>\n\nint kelime_say(const char *s) {\n  \n}\n",
        tests: [
          { label: "\"merhaba dunya\"", expr: "kelime_say(\"merhaba dunya\")", type: "int", expected: 2 },
          { label: "fazla boşluk", expr: "kelime_say(\"  cok   bosluk \\t var\\n\")", type: "int", expected: 3 },
          { label: "boş", expr: "kelime_say(\"\")", type: "int", expected: 0 },
          { label: "sadece boşluk", expr: "kelime_say(\" \\t\\n \")", type: "int", expected: 0 }
        ],
        hints: ["Örnekteki 'içinde mi' durumunu kullan.", "Bir kelime, boşluk olmayan bir karakterin önceki karakter boşluk olduğunda başlar.", "bool icinde = false; her karakter için isspace ise icinde = false; değilse ve !icinde ise n++."],
        solution: "#include <ctype.h>\n#include <stdbool.h>\n\nint kelime_say(const char *s) {\n  int n = 0;\n  bool icinde = false;\n  for (; *s; s++) {\n    if (isspace((unsigned char)*s)) icinde = false;\n    else if (!icinde) { icinde = true; n++; }\n  }\n  return n;\n}"
      }),
      c({
        id: "c15c3", kind: "Yaz", title: "Dengeli parantez", fn: "parantez_dengeli",
        prompt: "`bool parantez_dengeli(const char *s)` `()`, `[]`, `{}` doğru iç içe geçiyorsa `true` döndürsün. Yığın olarak en fazla 1000 elemanlı bir char dizisi kullan; daha derin iç içe geçme `false`.",
        starter: "#include <stdbool.h>\n\nbool parantez_dengeli(const char *s) {\n  char yigin[1000];\n  int ust = 0;\n  \n}\n",
        tests: [
          { label: "\"()[]{}\"", expr: "parantez_dengeli(\"()[]{}\")", type: "bool", expected: true },
          { label: "\"([{}])\"", expr: "parantez_dengeli(\"([{}])\")", type: "bool", expected: true },
          { label: "\"([)]\"", expr: "parantez_dengeli(\"([)]\")", type: "bool", expected: false },
          { label: "\"((\"", expr: "parantez_dengeli(\"((\")", type: "bool", expected: false },
          { label: "\")\"", expr: "parantez_dengeli(\")\")", type: "bool", expected: false },
          { label: "kod metni", expr: "parantez_dengeli(\"int f(int a[]) { return a[0]; }\")", type: "bool", expected: true }
        ],
        hints: ["Algoritmalar parkurundaki çözümün aynısı; bu kez yığını dizi ve indeksle sen yönetiyorsun.", "Açılışta yigin[ust++] = c (ust 1000'e ulaştıysa false). Kapanışta ust == 0 ise false; değilse yigin[--ust] eşleşmeli.", "Sonunda return ust == 0;"],
        solution: "#include <stdbool.h>\n\nbool parantez_dengeli(const char *s) {\n  char yigin[1000];\n  int ust = 0;\n  for (; *s; s++) {\n    char c = *s;\n    if (c == '(' || c == '[' || c == '{') {\n      if (ust == 1000) return false;\n      yigin[ust++] = c;\n    } else if (c == ')' || c == ']' || c == '}') {\n      if (ust == 0) return false;\n      char a = yigin[--ust];\n      if ((c == ')' && a != '(') || (c == ']' && a != '[') || (c == '}' && a != '{')) return false;\n    }\n  }\n  return ust == 0;\n}"
      })
    ],
    cards: [
      { id: "c15k1", q: "Bir basamak karakterini sayıya çevirmek?", a: "c − '0'. Biriktirmek için n = n * 10 + (c − '0')." },
      { id: "c15k2", q: "ctype.h fonksiyonlarına char neden unsigned char olarak verilir?", a: "char işaretliyse ASCII dışı karakterler negatif olur; negatif değer (EOF hariç) tanımsız davranıştır." },
      { id: "c15k3", q: "atoi yerine neden strtol?", a: "strtol hata ve taşmayı bildirebilir, nerede durduğunu söyler; atoi geçersiz girdide sessizce 0 döndürür." }
    ]
  },

  /* ============================ C · DERS 16 ============================ */
  {
    id: "c16", no: 16, language: "c", track: "c2", title: "Hash tablosu", short: "Hash tablosu",
    goal: "JavaScript'teki Map'in altında yatan yapıyı kendin kur: hash fonksiyonu, kovalar ve zincirleme.",
    concepts: ["hash fonksiyonu (djb2)", "kova ve mod", "zincirleme", "sahiplik ve free"],
    predict: {
      code: "// 64 kovalı bir hash tablosunda iki farklı anahtarın\n// hash % 64 değeri aynı çıktı. Ne olur?",
      options: ["İkinci anahtar birincinin üzerine yazılır", "Program çöker", "İkisi aynı kovadaki bağlı listede birlikte durur", "İkinci anahtar eklenemez"], answer: 2,
      why: "Buna çakışma denir ve normaldir. Zincirlemede her kova bir bağlı listedir; aynı kovaya düşen anahtarlar listeye eklenir. Arama, kovadaki listeyi anahtarları karşılaştırarak dolaşır.",
      run: false
    },
    example: {
      title: "djb2 hash fonksiyonu",
      lang: "c",
      code: "#include <stdio.h>\n\nunsigned long djb2(const char *s) {\n  unsigned long h = 5381;\n  for (; *s; s++) h = h * 33 + (unsigned char)*s;\n  return h;\n}\n\nint main(void) {\n  const char *k[] = {\"elma\", \"armut\", \"muz\"};\n  for (int i = 0; i < 3; i++) printf(\"%-6s → kova %lu\\n\", k[i], djb2(k[i]) % 64);\n  return 0;\n}",
      steps: [
        { lines: [4, 5], text: "djb2: 5381'den başla, her karakterde 33 ile çarpıp karakteri ekle. Basit, hızlı ve dağılımı iyi." },
        { lines: [5], text: "unsigned long taşabilir; işaretsiz taşma C'de tanımlıdır (mod 2^64) ve burada istenen davranıştır." },
        { lines: [11], text: "Kova numarası: hash % kova sayısı. Anahtar ne olursa olsun 0..63 arasına düşer." }
      ]
    },
    challenges: [
      c({
        id: "c16c1", kind: "Yaz", title: "djb2", fn: "djb2",
        prompt: "`unsigned long djb2(const char *s)` örnekteki djb2 hash'ini hesaplasın. Örneğe bakmadan yazmayı dene.",
        starter: "unsigned long djb2(const char *s) {\n  \n}\n",
        tests: [
          { label: "boş metin", expr: "djb2(\"\")", type: "long", expected: 5381 },
          { label: "\"a\"", expr: "djb2(\"a\")", type: "long", expected: 177670 },
          { label: "\"ab\"", expr: "djb2(\"ab\")", type: "long", expected: 5863208 },
          { label: "sıra önemli", expr: "djb2(\"ab\") != djb2(\"ba\")", type: "bool", expected: true }
        ],
        hints: ["Başlangıç değeri 5381.", "Her karakter için h = h * 33 + karakter.", "for (; *s; s++) h = h * 33 + (unsigned char)*s;"],
        solution: "unsigned long djb2(const char *s) {\n  unsigned long h = 5381;\n  for (; *s; s++) h = h * 33 + (unsigned char)*s;\n  return h;\n}"
      }),
      c({
        id: "c16c2", kind: "Yaz", title: "Koy ve al", fn: "tablo_koy",
        prompt: "`tablo_al(t, anahtar)` değerin adresini ya da NULL döndürsün. `tablo_koy(t, anahtar, deger)` anahtar varsa değeri güncellesin, yoksa anahtarın **kopyasını** saklayan yeni bir girdi eklesin ve `boyut`'u artırsın.",
        starter: TABLO + DJB2 + "\nint *tablo_al(Tablo *t, const char *anahtar) {\n  \n}\n\nvoid tablo_koy(Tablo *t, const char *anahtar, int deger) {\n  \n}\n",
        tests: [
          { label: "koy, güncelle, al", setup: "Tablo t = {0}; tablo_koy(&t, \"elma\", 3); tablo_koy(&t, \"armut\", 5); tablo_koy(&t, \"elma\", 7);", expr: "*tablo_al(&t, \"elma\") * 10 + *tablo_al(&t, \"armut\")", type: "int", expected: 75 },
          { label: "boyut", setup: "Tablo t = {0}; tablo_koy(&t, \"elma\", 3); tablo_koy(&t, \"armut\", 5); tablo_koy(&t, \"elma\", 7);", expr: "t.boyut", type: "int", expected: 2 },
          { label: "olmayan anahtar", setup: "Tablo t = {0}; tablo_koy(&t, \"elma\", 3);", expr: "tablo_al(&t, \"muz\") == NULL", type: "bool", expected: true },
          { label: "anahtarın kopyası saklanır", setup: "Tablo t = {0}; char k[8] = \"kod\"; tablo_koy(&t, k, 1); k[0] = 'X';", expr: "tablo_al(&t, \"kod\") != NULL", type: "bool", expected: true },
          { label: "200 anahtar", setup: "Tablo t = {0}; for (int i = 0; i < 200; i++) { char k[16]; snprintf(k, sizeof k, \"k%d\", i); tablo_koy(&t, k, i); }", expr: "*tablo_al(&t, \"k137\") + t.boyut", type: "int", expected: 337 }
        ],
        hints: ["Kova: djb2(anahtar) % KOVA. Al: o kovadaki listeyi strcmp ile dolaş.", "Koy: önce tablo_al; bulunduysa değeri güncelle. Bulunamadıysa yeni Girdi'yi malloc'la, anahtar için strlen + 1 bayt ayırıp strcpy ile kopyala.", "Yeni girdiyi kovanın başına ekle: g->sonraki = t->kovalar[k]; t->kovalar[k] = g; t->boyut++;"],
        solution: TABLO + DJB2 + KOY_AL
      }),
      c({
        id: "c16c3", kind: "Yaz", title: "Tabloyu temizle", fn: "tablo_sil",
        prompt: "`void tablo_sil(Tablo *t)` tablodaki tüm girdileri ve anahtar kopyalarını free etsin, kovaları NULL ve `boyut`'u 0 yapsın. Hiç sızıntı kalmamalı.",
        starter: TABLO + DJB2 + KOY_AL + "\nvoid tablo_sil(Tablo *t) {\n  \n}\n",
        tests: [
          { label: "sızıntı yok", setup: "long once = kd_ayrilan; Tablo t = {0}; for (int i = 0; i < 200; i++) { char k[16]; snprintf(k, sizeof k, \"k%d\", i); tablo_koy(&t, k, i); } tablo_sil(&t);", expr: "kd_ayrilan - once", type: "long", expected: 0 },
          { label: "tablo boşalır", setup: "Tablo t = {0}; tablo_koy(&t, \"a\", 1); tablo_sil(&t);", expr: "t.boyut == 0 && tablo_al(&t, \"a\") == NULL", type: "bool", expected: true },
          { label: "tekrar kullanılabilir", setup: "Tablo t = {0}; tablo_koy(&t, \"a\", 1); tablo_sil(&t); tablo_koy(&t, \"b\", 2);", expr: "*tablo_al(&t, \"b\")", type: "int", expected: 2 }
        ],
        hints: ["Her girdi için iki free gerekiyor: anahtar kopyası ve girdinin kendisi.", "Bağlı listeyi silerken sonraki düğümü önce sakla (C Ders 10).", "for (int k = 0; k < KOVA; k++) { Girdi *g = t->kovalar[k]; while (g) { Girdi *s = g->sonraki; free(g->anahtar); free(g); g = s; } t->kovalar[k] = NULL; } t->boyut = 0;"],
        solution: TABLO + DJB2 + KOY_AL + "\nvoid tablo_sil(Tablo *t) {\n  for (int k = 0; k < KOVA; k++) {\n    Girdi *g = t->kovalar[k];\n    while (g) {\n      Girdi *s = g->sonraki;\n      free(g->anahtar);\n      free(g);\n      g = s;\n    }\n    t->kovalar[k] = NULL;\n  }\n  t->boyut = 0;\n}"
      })
    ],
    cards: [
      { id: "c16k1", q: "Hash tablosunda çakışma nasıl çözülür (zincirleme)?", a: "Her kova bir bağlı listedir; aynı kovaya düşen anahtarlar listede tutulur." },
      { id: "c16k2", q: "Tabloya anahtar eklerken neden kopyası saklanır?", a: "Çağıranın belleği sonradan değişebilir ya da serbest bırakılabilir; tablo kendi kopyasının sahibi olmalı." },
      { id: "c16k3", q: "Hash tablosunda ortalama arama süresi?", a: "O(1): dağılım iyi ve doluluk oranı makulse kovalardaki listeler kısa kalır." }
    ]
  },

  /* ============================ C · DERS 17 ============================ */
  {
    id: "c17", no: 17, language: "c", track: "c2", title: "İkili arama ağacı", short: "Arama ağacı",
    goal: "Sıralı veriyi O(log n) ortalamayla eklenip aranabilen bir ağaçta tut; özyinelemeli yapıları sızıntısız yönet.",
    concepts: ["BST kuralı", "özyinelemeli ekleme", "sıralı gezinti", "ağacı serbest bırakma"],
    predict: {
      code: "// Boş bir ikili arama ağacına sırayla 1, 2, 3, 4, 5 eklendi.\n// Ağacın yüksekliği kaçtır?",
      options: ["3", "5", "2", "1"], answer: 1,
      why: "Her yeni değer bir öncekinden büyük olduğu için hep sağa eklenir; ağaç bir bağlı listeye dönüşür ve yüksekliği 5 olur. Arama O(n)'e düşer. Dengeli ağaçlar (AVL, kırmızı-siyah) bunu önler.",
      run: false
    },
    example: {
      title: "BST kuralı",
      lang: "c",
      code: "#include <stdio.h>\n\ntypedef struct Dal { int deger; struct Dal *sol, *sag; } Dal;\n\nint main(void) {\n  Dal d1 = {1, NULL, NULL}, d4 = {4, NULL, NULL}, d8 = {8, NULL, NULL};\n  Dal d3 = {3, &d1, &d4};\n  Dal kok = {5, &d3, &d8};\n  int aranan = 4, adim = 0;\n  for (Dal *d = &kok; d; adim++) {\n    if (aranan == d->deger) { printf(\"%d bulundu, %d adım\\n\", aranan, adim + 1); break; }\n    d = aranan < d->deger ? d->sol : d->sag;\n  }\n  return 0;\n}",
      steps: [
        { lines: [6, 7, 8], text: "Kural: her düğümün solundakiler ondan küçük, sağındakiler büyük." },
        { lines: [12], text: "Her adımda yarısını eler: küçükse sola, büyükse sağa. İkili aramanın ağaç hâli." },
        { lines: [11], text: "4, üç adımda bulunur: 5 → 3 → 4." }
      ]
    },
    challenges: [
      c({
        id: "c17c1", kind: "Yaz", title: "Ağaca ekle", fn: "ekle",
        prompt: "`Dal *ekle(Dal *kok, int deger)` değeri BST kuralına göre ekleyip kökü döndürsün; aynı değer tekrar eklenmesin.",
        starter: DAL + "\nDal *ekle(Dal *kok, int deger) {\n  \n}\n",
        tests: [
          { label: "yapı: 5, 3, 8, 1, 4", setup: AGAC, expr: "k->deger * 10000 + k->sol->deger * 1000 + k->sag->deger * 100 + k->sol->sol->deger * 10 + k->sol->sag->deger", type: "int", expected: 53814 },
          { label: "tekrar eklenmez", setup: "long once = kd_ayrilan; Dal *k = NULL; k = ekle(k, 2); k = ekle(k, 2);", expr: "kd_ayrilan - once", type: "long", expected: 1 },
          { label: "yapraklar NULL", setup: AGAC, expr: "k->sag->sol == NULL && k->sag->sag == NULL", type: "bool", expected: true }
        ],
        hints: ["Boş ağaca ekleme: yeni düğüm ayır ve onu döndür. Temel durum bu.", "Değer küçükse sol alt ağaca, büyükse sağ alt ağaca özyinelemeyle ekle.", "kok->sol = ekle(kok->sol, deger); … return kok;"],
        solution: DAL + EKLE
      }),
      c({
        id: "c17c2", kind: "Yaz", title: "Ara ve sıralı gez", fn: "ara",
        prompt: "`bool ara(const Dal *kok, int deger)` değeri bulursa `true` döndürsün. `int sirali(const Dal *kok, int *cikti, int i)` ağacı küçükten büyüğe gezip değerleri `cikti[i]`'den itibaren yazsın ve bir sonraki boş indeksi döndürsün.",
        starter: DAL + EKLE + "\nbool ara(const Dal *kok, int deger) {\n  \n}\n\nint sirali(const Dal *kok, int *cikti, int i) {\n  \n}\n",
        tests: [
          { label: "var olan", setup: AGAC, expr: "ara(k, 4)", type: "bool", expected: true },
          { label: "olmayan", setup: AGAC, expr: "ara(k, 7)", type: "bool", expected: false },
          { label: "boş ağaç", expr: "ara(NULL, 1)", type: "bool", expected: false },
          { label: "sıralı gezinti", setup: AGAC + " int o[5]; int n = sirali(k, o, 0);", expr: "n * 100000 + o[0] * 10000 + o[1] * 1000 + o[2] * 100 + o[3] * 10 + o[4]", type: "int", expected: 513458 }
        ],
        hints: ["ara: örnekteki döngü ya da özyineleme. Küçükse sola, büyükse sağa.", "Sıralı gezinti: önce sol alt ağaç, sonra düğümün kendisi, sonra sağ alt ağaç.", "if (!kok) return i; i = sirali(kok->sol, cikti, i); cikti[i++] = kok->deger; return sirali(kok->sag, cikti, i);"],
        solution: DAL + EKLE + "\nbool ara(const Dal *kok, int deger) {\n  while (kok) {\n    if (deger == kok->deger) return true;\n    kok = deger < kok->deger ? kok->sol : kok->sag;\n  }\n  return false;\n}\n\nint sirali(const Dal *kok, int *cikti, int i) {\n  if (!kok) return i;\n  i = sirali(kok->sol, cikti, i);\n  cikti[i++] = kok->deger;\n  return sirali(kok->sag, cikti, i);\n}"
      }),
      c({
        id: "c17c3", kind: "Yaz", title: "Yükseklik ve silme", fn: "agac_sil",
        prompt: "`int yukseklik(const Dal *kok)` en uzun kök-yaprak yolundaki düğüm sayısını (boş ağaç 0) döndürsün. `void agac_sil(Dal *kok)` tüm düğümleri free etsin.",
        starter: DAL + EKLE + "\nint yukseklik(const Dal *kok) {\n  \n}\n\nvoid agac_sil(Dal *kok) {\n  \n}\n",
        tests: [
          { label: "dengeli ağaç", setup: AGAC, expr: "yukseklik(k)", type: "int", expected: 3 },
          { label: "sıralı ekleme → liste", setup: "Dal *k = NULL; for (int i = 1; i <= 5; i++) k = ekle(k, i);", expr: "yukseklik(k)", type: "int", expected: 5 },
          { label: "boş ağaç", expr: "yukseklik(NULL)", type: "int", expected: 0 },
          { label: "sızıntı yok", setup: "long once = kd_ayrilan; Dal *k = NULL; for (int i = 0; i < 100; i++) k = ekle(k, (i * 37) % 101); agac_sil(k);", expr: "kd_ayrilan - once", type: "long", expected: 0 }
        ],
        hints: ["İkisi de özyinelemeli: alt ağaçlar için çöz, sonucu birleştir.", "yukseklik: 1 + max(sol, sağ). Boşsa 0.", "agac_sil: önce iki alt ağacı sil, sonra düğümü free et (sonradan sıralı silme; önce düğümü silersen çocuklarına ulaşamazsın)."],
        solution: DAL + EKLE + "\nint yukseklik(const Dal *kok) {\n  if (!kok) return 0;\n  int a = yukseklik(kok->sol), b = yukseklik(kok->sag);\n  return 1 + (a > b ? a : b);\n}\n\nvoid agac_sil(Dal *kok) {\n  if (!kok) return;\n  agac_sil(kok->sol);\n  agac_sil(kok->sag);\n  free(kok);\n}"
      })
    ],
    cards: [
      { id: "c17k1", q: "İkili arama ağacının kuralı?", a: "Her düğümün sol alt ağacındaki değerler ondan küçük, sağ alt ağacındakiler büyüktür." },
      { id: "c17k2", q: "BST'de sıralı (in-order) gezinti ne verir?", a: "Değerleri küçükten büyüğe sıralı olarak." },
      { id: "c17k3", q: "Ağacı serbest bırakırken neden önce çocuklar?", a: "Düğümü önce free edersen çocuklarının adresine artık güvenle erişemezsin (use-after-free)." }
    ]
  },

  /* ============================ C · DERS 18 ============================ */
  {
    id: "c18", no: 18, language: "c", track: "c2", title: "Kuyruk, yığın ve RPN", short: "Kuyruk & yığın",
    goal: "Sabit boyutlu dairesel kuyruk ve yığın yaz; bir ifade değerlendiricide birleştir.",
    concepts: ["dairesel tampon", "mod ile sarma", "taşma kontrolü", "ters Lehçe gösterimi"],
    predict: {
      code: "// Kapasitesi 4 olan dairesel bir kuyruk:\n// ekle 1, ekle 2, ekle 3, çıkar, çıkar, ekle 4, ekle 5, ekle 6\n// Şimdi sırayla çıkarılırsa ne gelir?",
      options: ["3 4 5 6", "1 2 3 4", "4 5 6 3", "Kuyruk taşar"], answer: 0,
      why: "1 ve 2 çıktı; içeride 3 kaldı. 4, 5, 6 eklenince kuyruk 4 elemanla doldu: dizinin sonuna gelince indeks mod ile başa sarılır. FIFO sırası korunur: 3 4 5 6.",
      run: false
    },
    example: {
      title: "Dizi tabanlı yığın",
      lang: "c",
      code: "#include <stdio.h>\n#include <stdbool.h>\n\n#define KAP 4\ntypedef struct { int veri[KAP]; int ust; } Yigin;\n\nbool it(Yigin *y, int x) { if (y->ust >= KAP) return false; y->veri[y->ust++] = x; return true; }\nbool cek(Yigin *y, int *x) { if (y->ust == 0) return false; *x = y->veri[--y->ust]; return true; }\n\nint main(void) {\n  Yigin y = {0};\n  for (int i = 1; i <= 5; i++) printf(\"it(%d): %s\\n\", i, it(&y, i) ? \"tamam\" : \"dolu\");\n  int x;\n  while (cek(&y, &x)) printf(\"%d \", x);\n  printf(\"\\n\");\n  return 0;\n}",
      steps: [
        { lines: [7], text: "İtmeden önce doluluk kontrolü: ust >= KAP. > yazmak bir eleman fazla yazdırır ve dizinin dışına taşar." },
        { lines: [8], text: "Çekerken önce ust'yi azalt, sonra oku. Başarıyı bool ile, değeri çıktı parametresiyle döndür." },
        { lines: [12, 14], text: "Beşinci itme reddedilir; çekme ters sırada gelir: 4 3 2 1." }
      ]
    },
    challenges: [
      c({
        id: "c18c1", kind: "Yaz", title: "Dairesel kuyruk", fn: "kuyruk_ekle",
        prompt: "8 kapasiteli dairesel kuyruk: `bool kuyruk_ekle(Kuyruk *k, int x)` doluysa `false`; `bool kuyruk_cikar(Kuyruk *k, int *x)` boşsa `false`. Dizi sonuna gelince başa sar (mod).",
        starter: "#include <stdbool.h>\n\n#define KAP 8\ntypedef struct {\n  int veri[KAP];\n  int bas, boyut;\n} Kuyruk;\n\nbool kuyruk_ekle(Kuyruk *k, int x) {\n  \n}\n\nbool kuyruk_cikar(Kuyruk *k, int *x) {\n  \n}\n",
        tests: [
          { label: "8 eklenir, 9. reddedilir", setup: "Kuyruk q = {0}; int ok = 0; for (int i = 0; i < 8; i++) ok += kuyruk_ekle(&q, i);", expr: "ok * 10 + kuyruk_ekle(&q, 99)", type: "int", expected: 80 },
          { label: "FIFO sırası", setup: "Kuyruk q = {0}; kuyruk_ekle(&q, 1); kuyruk_ekle(&q, 2); kuyruk_ekle(&q, 3); int a, b, c; kuyruk_cikar(&q, &a); kuyruk_cikar(&q, &b); kuyruk_cikar(&q, &c);", expr: "a * 100 + b * 10 + c", type: "int", expected: 123 },
          { label: "başa sarma", setup: "Kuyruk q = {0}; for (int i = 0; i < 8; i++) kuyruk_ekle(&q, i); int x, t = 0; for (int i = 0; i < 5; i++) kuyruk_cikar(&q, &x); for (int i = 8; i < 13; i++) kuyruk_ekle(&q, i); while (kuyruk_cikar(&q, &x)) t = t * 2 + x;", expr: "t", type: "int", expected: 1522 },
          { label: "boşken çıkarma", setup: "Kuyruk q = {0}; int x = 7;", expr: "kuyruk_cikar(&q, &x) == false && x == 7", type: "bool", expected: true }
        ],
        hints: ["Başın yeri ve eleman sayısı yeterli: sonun yeri (bas + boyut) % KAP.", "Ekle: if (k->boyut == KAP) return false; k->veri[(k->bas + k->boyut) % KAP] = x; k->boyut++;", "Çıkar: *x = k->veri[k->bas]; k->bas = (k->bas + 1) % KAP; k->boyut--;"],
        solution: "#include <stdbool.h>\n\n#define KAP 8\ntypedef struct {\n  int veri[KAP];\n  int bas, boyut;\n} Kuyruk;\n\nbool kuyruk_ekle(Kuyruk *k, int x) {\n  if (k->boyut == KAP) return false;\n  k->veri[(k->bas + k->boyut) % KAP] = x;\n  k->boyut++;\n  return true;\n}\n\nbool kuyruk_cikar(Kuyruk *k, int *x) {\n  if (k->boyut == 0) return false;\n  *x = k->veri[k->bas];\n  k->bas = (k->bas + 1) % KAP;\n  k->boyut--;\n  return true;\n}"
      }),
      c({
        id: "c18c2", kind: "Hata Ayıkla", title: "Taşan yığın", fn: "it",
        prompt: "Bu yığın kapasitesi dolunca da bir eleman daha kabul ediyor ve belleği bozuyor (sanitizer yakalar). Düzelt.",
        starter: "#include <stdbool.h>\n\n#define KAP 4\ntypedef struct {\n  int veri[KAP];\n  int ust;\n} Yigin;\n\nbool it(Yigin *y, int x) {\n  if (y->ust > KAP) return false;\n  y->veri[y->ust++] = x;\n  return true;\n}\n\nbool cek(Yigin *y, int *x) {\n  if (y->ust == 0) return false;\n  *x = y->veri[--y->ust];\n  return true;\n}\n",
        tests: [
          { label: "4 kabul, 5. ret", setup: "Yigin y = {0}; int ok = 0; for (int i = 0; i < 5; i++) ok += it(&y, i);", expr: "ok", type: "int", expected: 4 },
          { label: "LIFO sırası", setup: "Yigin y = {0}; it(&y, 1); it(&y, 2); it(&y, 3); int a, b; cek(&y, &a); cek(&y, &b);", expr: "a * 10 + b", type: "int", expected: 32 }
        ],
        hints: ["Dizinin geçerli indeksleri 0..KAP − 1. ust == KAP olduğunda yazılacak indeks nedir?", "Koşul, ust KAP'a eşit olduğunda da reddetmeli.", "if (y->ust >= KAP) return false;"],
        solution: "#include <stdbool.h>\n\n#define KAP 4\ntypedef struct {\n  int veri[KAP];\n  int ust;\n} Yigin;\n\nbool it(Yigin *y, int x) {\n  if (y->ust >= KAP) return false;\n  y->veri[y->ust++] = x;\n  return true;\n}\n\nbool cek(Yigin *y, int *x) {\n  if (y->ust == 0) return false;\n  *x = y->veri[--y->ust];\n  return true;\n}"
      }),
      c({
        id: "c18c3", kind: "Yaz", title: "RPN hesap makinesi", fn: "rpn_hesapla",
        prompt: "`int rpn_hesapla(const char *ifade)` boşlukla ayrılmış ters Lehçe gösterimdeki (`\"3 4 + 2 *\"`) ifadeyi bir yığınla değerlendirsin. Sayılar negatif olmayan tam sayı; operatörler `+ - * /`.",
        starter: "#include <ctype.h>\n\nint rpn_hesapla(const char *ifade) {\n  int yigin[64];\n  int ust = 0;\n  \n}\n",
        tests: [
          { label: "\"3 4 + 2 *\"", expr: "rpn_hesapla(\"3 4 + 2 *\")", type: "int", expected: 14 },
          { label: "\"5 1 2 + 4 * + 3 -\"", expr: "rpn_hesapla(\"5 1 2 + 4 * + 3 -\")", type: "int", expected: 14 },
          { label: "\"10 2 /\"", expr: "rpn_hesapla(\"10 2 /\")", type: "int", expected: 5 },
          { label: "\"12 3 - 4 -\"", expr: "rpn_hesapla(\"12 3 - 4 -\")", type: "int", expected: 5 },
          { label: "\"7\"", expr: "rpn_hesapla(\"7\")", type: "int", expected: 7 }
        ],
        hints: ["Sayı görünce yığına it; operatör görünce iki eleman çek, işlemi yap, sonucu it.", "Çok basamaklı sayıyı Ders 15'teki gibi biriktir: while (isdigit) n = n * 10 + (*s - '0').", "Çekme sırasına dikkat: b = yigin[--ust]; a = yigin[--ust]; sonuç a op b. Sonunda yigin[0] döner."],
        solution: "#include <ctype.h>\n\nint rpn_hesapla(const char *ifade) {\n  int yigin[64];\n  int ust = 0;\n  for (const char *s = ifade; *s;) {\n    if (isdigit((unsigned char)*s)) {\n      int n = 0;\n      while (isdigit((unsigned char)*s)) n = n * 10 + (*s++ - '0');\n      yigin[ust++] = n;\n    } else if (*s == '+' || *s == '-' || *s == '*' || *s == '/') {\n      int b = yigin[--ust], a = yigin[--ust];\n      yigin[ust++] = *s == '+' ? a + b : *s == '-' ? a - b : *s == '*' ? a * b : a / b;\n      s++;\n    } else s++;\n  }\n  return yigin[0];\n}"
      })
    ],
    cards: [
      { id: "c18k1", q: "Dairesel kuyrukta sonun indeksi nasıl bulunur?", a: "(bas + boyut) % kapasite. Mod, dizinin sonundan başa sarmayı sağlar." },
      { id: "c18k2", q: "Sabit kapasiteli yığında doluluk koşulu?", a: "ust >= KAP. ust > KAP yazmak bir eleman fazla yazdırır (taşma)." },
      { id: "c18k3", q: "Ters Lehçe gösterimi neden yığınla kolay değerlendirilir?", a: "Operatör, ihtiyaç duyduğu iki işlenen yığının tepesindeyken gelir; parantez ve öncelik gerekmez." }
    ]
  },

  /* ============================ C · DERS 19 ============================ */
  {
    id: "c19", no: 19, language: "c", track: "c2", title: "Matrisler ve bellek düzeni", short: "Matrisler",
    goal: "İki boyutlu veriyi bellekte yerleştir: satır öncelikli diziler, dinamik matrisler ve yapı hizalaması.",
    concepts: ["satır öncelikli sıra", "int ** ve tek blok", "matris çarpımı", "padding (hizalama)"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nstruct A { char a; int b; char c; };\nstruct B { int b; char a; char c; };\n\nint main(void) {\n  printf(\"%zu %zu\\n\", sizeof(struct A), sizeof(struct B));\n  return 0;\n}",
      options: ["6 6", "12 8", "12 12", "8 8"], answer: 1,
      why: "int 4 baytlık sınırda hizalanmak ister. A'da char'dan sonra 3 bayt boşluk, sondaki char'dan sonra yine 3 bayt dolgu: 12. B'de iki char yan yana durur, yalnızca 2 bayt dolgu: 8. Alanların sırası bellek boyutunu değiştirir."
    },
    example: {
      title: "Matrisi tek dizide tutmak",
      lang: "c",
      code: "#include <stdio.h>\n\nint main(void) {\n  int n = 3;\n  int m[9];\n  for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n      m[i * n + j] = i * 10 + j;\n  printf(\"m[2][1] = %d\\n\", m[2 * n + 1]);\n  return 0;\n}",
      steps: [
        { lines: [5], text: "n × n matris, n² elemanlı tek bir dizide satır satır saklanır (satır öncelikli)." },
        { lines: [8], text: "(i, j) elemanının indeksi: i * n + j. Bellekte bitişik olduğu için önbelleğe dost ve tek malloc yeter." },
        { lines: [9], text: "Çıktı: m[2][1] = 21." }
      ]
    },
    challenges: [
      c({
        id: "c19c1", kind: "Yaz", title: "Dinamik matris", fn: "matris_olustur",
        prompt: "`int **matris_olustur(int satir, int sutun)` sıfırlarla dolu bir matris ayırsın (`m[i][j]` ile erişilebilir). `void matris_sil(int **m, int satir)` tüm belleği geri versin.",
        starter: "#include <stdlib.h>\n\nint **matris_olustur(int satir, int sutun) {\n  \n}\n\nvoid matris_sil(int **m, int satir) {\n  \n}\n",
        tests: [
          { label: "sıfırla başlar", setup: "int **m = matris_olustur(3, 4);", expr: "m[0][0] + m[2][3]", type: "int", expected: 0 },
          { label: "yazılabilir", setup: "int **m = matris_olustur(3, 4); m[2][3] = 7; m[1][0] = 5;", expr: "m[2][3] * 10 + m[1][0]", type: "int", expected: 75 },
          { label: "sızıntı yok", setup: "long once = kd_ayrilan; int **m = matris_olustur(50, 20); matris_sil(m, 50);", expr: "kd_ayrilan - once", type: "long", expected: 0 }
        ],
        hints: ["Önce satır işaretçileri için bir dizi, sonra her satır için ayrı bir blok.", "int **m = malloc(satir * sizeof *m); her satır: m[i] = calloc(sutun, sizeof **m);", "Silerken önce satırları, en son satır dizisini free et."],
        solution: "#include <stdlib.h>\n\nint **matris_olustur(int satir, int sutun) {\n  int **m = malloc(satir * sizeof *m);\n  if (!m) return NULL;\n  for (int i = 0; i < satir; i++) {\n    m[i] = calloc(sutun, sizeof **m);\n    if (!m[i]) {\n      while (i--) free(m[i]);\n      free(m);\n      return NULL;\n    }\n  }\n  return m;\n}\n\nvoid matris_sil(int **m, int satir) {\n  if (!m) return;\n  for (int i = 0; i < satir; i++) free(m[i]);\n  free(m);\n}"
      }),
      c({
        id: "c19c2", kind: "Yaz", title: "Matris çarpımı", fn: "carp",
        prompt: "`void carp(const int *a, const int *b, int *c, int n)` n × n matrisleri (satır öncelikli, tek dizi) çarpıp sonucu `c`'ye yazsın.",
        starter: "void carp(const int *a, const int *b, int *c, int n) {\n  \n}\n",
        tests: [
          { label: "2 × 2", setup: "int a[] = {1, 2, 3, 4}, b[] = {5, 6, 7, 8}, c[4]; carp(a, b, c, 2);", expr: "c[0] * 1000000 + c[1] * 10000 + c[2] * 100 + c[3]", type: "int", expected: 19224350 },
          { label: "birim matris", setup: "int a[] = {1, 0, 0, 0, 1, 0, 0, 0, 1}, b[] = {9, 8, 7, 6, 5, 4, 3, 2, 1}, c[9]; carp(a, b, c, 3);", expr: "c[0] * 100 + c[4] * 10 + c[8]", type: "int", expected: 951 },
          { label: "c başlangıçta çöp olsa da doğru", setup: "int a[] = {2}, b[] = {3}, c[1] = {99}; carp(a, b, c, 1);", expr: "c[0]", type: "int", expected: 6 }
        ],
        hints: ["c[i][j] = Σ a[i][k] · b[k][j]. Tek dizide (i, j) → i * n + j.", "Üç iç içe döngü; toplamı her (i, j) için sıfırdan başlat.", "int t = 0; for (k) t += a[i * n + k] * b[k * n + j]; c[i * n + j] = t;"],
        solution: "void carp(const int *a, const int *b, int *c, int n) {\n  for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++) {\n      int t = 0;\n      for (int k = 0; k < n; k++) t += a[i * n + k] * b[k * n + j];\n      c[i * n + j] = t;\n    }\n}"
      }),
      c({
        id: "c19c3", kind: "Yaz", title: "Yerinde transpoze", fn: "transpoze",
        prompt: "`void transpoze(int *m, int n)` n × n matrisin satır ve sütunlarını **yerinde** (ek dizi olmadan) yer değiştirsin.",
        starter: "void transpoze(int *m, int n) {\n  \n}\n",
        tests: [
          { label: "2 × 2", setup: "int m[] = {1, 2, 3, 4}; transpoze(m, 2);", expr: "m[0] * 1000 + m[1] * 100 + m[2] * 10 + m[3]", type: "int", expected: 1324 },
          { label: "3 × 3", setup: "int m[] = {1, 2, 3, 4, 5, 6, 7, 8, 9}; transpoze(m, 3);", expr: "m[1] * 100 + m[2] * 10 + m[5]", type: "int", expected: 478 },
          { label: "iki kez transpoze = kendisi", setup: "int m[] = {1, 2, 3, 4, 5, 6, 7, 8, 9}; transpoze(m, 3); transpoze(m, 3);", expr: "m[1] * 100 + m[5] * 10 + m[7]", type: "int", expected: 268 }
        ],
        hints: ["Köşegenin yalnızca bir tarafını dolaş; yoksa her çifti iki kez takas edip başa dönersin.", "for (i) for (j = i + 1; j < n; j++) takas(m[i * n + j], m[j * n + i])", "int t = m[i * n + j]; m[i * n + j] = m[j * n + i]; m[j * n + i] = t;"],
        solution: "void transpoze(int *m, int n) {\n  for (int i = 0; i < n; i++)\n    for (int j = i + 1; j < n; j++) {\n      int t = m[i * n + j];\n      m[i * n + j] = m[j * n + i];\n      m[j * n + i] = t;\n    }\n}"
      })
    ],
    cards: [
      { id: "c19k1", q: "Satır öncelikli düzende (i, j) elemanının indeksi?", a: "i * sütun_sayısı + j." },
      { id: "c19k2", q: "struct'ta padding neden oluşur?", a: "İşlemci, türleri kendi boyutlarının katı olan adreslerde okumak ister; derleyici alanlar arasına dolgu baytları ekler." },
      { id: "c19k3", q: "int ** matrisi ile tek blok matrisin farkı?", a: "int ** her satırı ayrı ayırır (satır başına malloc, bellekte dağınık); tek blok bitişiktir, tek malloc/free ve önbellek dostudur." }
    ]
  },

  /* ============================ C · DERS 20 ============================ */
  {
    id: "c20", no: 20, language: "c", track: "c2", title: "Mini proje: metin istatistiği", short: "Metin aracı",
    goal: "Standart girdiden metin okuyan, sayan ve sıralayan küçük bir komut satırı aracı yaz: wc ve sort'un kardeşi.",
    concepts: ["getchar ve EOF", "kelime tablosu", "qsort ile sıralama", "komut satırı aracı"],
    predict: {
      lang: "c",
      code: "#include <stdio.h>\n\nint main(void) {\n  int c, n = 0;\n  while ((c = getchar()) != EOF) n++;\n  printf(\"%d\\n\", n);\n  return 0;\n}\n/* Girdi yok (boş standart girdi). Çıktı ne olur? */",
      options: ["0", "-1", "Program sonsuza dek bekler", "Derleme hatası"], answer: 0,
      why: "getchar, girdi bitince EOF döndürür ve döngü hiç dönmez: 0. c'nin int olması önemli: char olsaydı EOF (−1) ile geçerli bir bayt karışabilirdi."
    },
    example: {
      title: "Karakter karakter okumak",
      lang: "c",
      code: "#include <stdio.h>\n#include <ctype.h>\n\nint main(void) {\n  int c, harf = 0, rakam = 0;\n  const char *girdi = \"QUAGEN 2026, C ile.\";\n  for (const char *p = girdi; (c = (unsigned char)*p); p++) {\n    if (isalpha(c)) harf++;\n    else if (isdigit(c)) rakam++;\n  }\n  printf(\"%d harf, %d rakam\\n\", harf, rakam);\n  return 0;\n}",
      steps: [
        { lines: [5], text: "Okunan karakteri int'te tut: getchar EOF'u (−1) da döndürebilir." },
        { lines: [7, 8, 9], text: "ctype.h ile karakter sınıflandır. Görevlerde aynı döngüyü while ((c = getchar()) != EOF) ile standart girdiden kuracaksın." },
        { lines: [11], text: "Çıktı: 10 harf, 4 rakam." }
      ]
    },
    challenges: [
      c({
        id: "c20c1", kind: "Yaz", title: "Kendi wc'n", fn: "main", mode: "stdout",
        prompt: "Standart girdinin tamamını oku ve üç satır yazdır: `satir: X` (satır sonu sayısı), `kelime: Y` (boşluklarla ayrılmış), `karakter: Z` (bayt sayısı).",
        starter: "#include <stdio.h>\n#include <ctype.h>\n#include <stdbool.h>\n\nint main(void) {\n  \n  return 0;\n}\n",
        tests: [
          { label: "iki satır", stdin: "merhaba dunya\nkodera\n", stdout: "satir: 2\nkelime: 3\nkarakter: 21" },
          { label: "fazla boşluk", stdin: "  a   b\n\nc\n", stdout: "satir: 3\nkelime: 3\nkarakter: 11" },
          { label: "boş girdi", stdin: "", stdout: "satir: 0\nkelime: 0\nkarakter: 0" }
        ],
        hints: ["Tek bir while ((c = getchar()) != EOF) döngüsünde üç sayacı birlikte güncelle.", "Her karakter: karakter++; '\\n' ise satir++. Kelimeler için Ders 15'teki 'içinde mi' durumu.", "Döngüden sonra printf(\"satir: %d\\nkelime: %d\\nkarakter: %d\\n\", …);"],
        solution: "#include <stdio.h>\n#include <ctype.h>\n#include <stdbool.h>\n\nint main(void) {\n  int c, satir = 0, kelime = 0, karakter = 0;\n  bool icinde = false;\n  while ((c = getchar()) != EOF) {\n    karakter++;\n    if (c == '\\n') satir++;\n    if (isspace(c)) icinde = false;\n    else if (!icinde) { icinde = true; kelime++; }\n  }\n  printf(\"satir: %d\\nkelime: %d\\nkarakter: %d\\n\", satir, kelime, karakter);\n  return 0;\n}"
      }),
      c({
        id: "c20c2", kind: "Yaz", title: "En sık kelime", fn: "main", mode: "stdout",
        prompt: "Girdideki kelimeleri (yalnızca harf dizileri, küçük harfe çevrilmiş) say ve en sık geçeni `kelime adet` olarak yazdır. Eşitlikte alfabetik olarak önce gelen. Girdide en fazla 1000 farklı kelime, her biri en fazla 31 harf.",
        starter: "#include <stdio.h>\n#include <ctype.h>\n#include <string.h>\n\ntypedef struct {\n  char k[32];\n  int n;\n} Sayac;\n\nint main(void) {\n  static Sayac s[1000];\n  int adet = 0;\n  \n  return 0;\n}\n",
        tests: [
          { label: "noktalama ve büyük harf", stdin: "Kod yaz. Kod oku, kod test et\n", stdout: "kod 3" },
          { label: "eşitlikte alfabetik", stdin: "zeytin elma zeytin elma armut\n", stdout: "elma 2" },
          { label: "tek kelime", stdin: "merhaba\n", stdout: "merhaba 1" }
        ],
        hints: ["Önce kelimeyi bir tampona harf harf topla; harf olmayan karakter kelimeyi bitirir.", "Kelime bitince tabloda ara (strcmp); varsa n++, yoksa yeni satır ekle.", "Sonunda tabloyu dolaşıp en büyük n'i bul; eşitse strcmp ile alfabetik olarak küçüğü seç. Son kelimeyi EOF'ta da işlemeyi unutma."],
        solution: "#include <stdio.h>\n#include <ctype.h>\n#include <string.h>\n\ntypedef struct {\n  char k[32];\n  int n;\n} Sayac;\n\nstatic void ekle(Sayac *s, int *adet, const char *k) {\n  for (int i = 0; i < *adet; i++)\n    if (strcmp(s[i].k, k) == 0) { s[i].n++; return; }\n  if (*adet == 1000) return;\n  strcpy(s[*adet].k, k);\n  s[*adet].n = 1;\n  (*adet)++;\n}\n\nint main(void) {\n  static Sayac s[1000];\n  int adet = 0, c, u = 0;\n  char buf[32];\n  do {\n    c = getchar();\n    if (c != EOF && isalpha(c)) {\n      if (u < 31) buf[u++] = (char)tolower(c);\n    } else if (u > 0) {\n      buf[u] = '\\0';\n      ekle(s, &adet, buf);\n      u = 0;\n    }\n  } while (c != EOF);\n  if (adet == 0) return 0;\n  int en = 0;\n  for (int i = 1; i < adet; i++)\n    if (s[i].n > s[en].n || (s[i].n == s[en].n && strcmp(s[i].k, s[en].k) < 0)) en = i;\n  printf(\"%s %d\\n\", s[en].k, s[en].n);\n  return 0;\n}"
      }),
      c({
        id: "c20c3", kind: "Yaz", title: "İlk üç kelime", fn: "main", mode: "stdout",
        prompt: "En sık geçen **ilk üç** kelimeyi her satıra `kelime adet` olarak yazdır: adede göre azalan, eşitlikte alfabetik. `qsort` ve bir karşılaştırıcı kullan.",
        starter: "#include <stdio.h>\n#include <stdlib.h>\n#include <ctype.h>\n#include <string.h>\n\ntypedef struct {\n  char k[32];\n  int n;\n} Sayac;\n\nint main(void) {\n  static Sayac s[1000];\n  int adet = 0;\n  \n  return 0;\n}\n",
        tests: [
          { label: "sıralama", stdin: "a b a c b a d\n", stdout: "a 3\nb 2\nc 1" },
          { label: "eşitlikler", stdin: "kiraz elma kiraz elma muz armut\n", stdout: "elma 2\nkiraz 2\narmut 1" },
          { label: "üçten az kelime", stdin: "Tek tek\n", stdout: "tek 2" },
          { label: "qsort kullanılmış", codeMatch: "qsort\\s*\\(", codeHint: "qsort" }
        ],
        hints: ["Saymayı önceki görevdeki gibi yap.", "Karşılaştırıcı: önce n'e göre azalan, eşitse strcmp ile artan.", "int kars(const void *a, const void *b) { const Sayac *x = a, *y = b; if (x->n != y->n) return y->n - x->n; return strcmp(x->k, y->k); } — sonra ilk min(3, adet) satırı yazdır."],
        solution: "#include <stdio.h>\n#include <stdlib.h>\n#include <ctype.h>\n#include <string.h>\n\ntypedef struct {\n  char k[32];\n  int n;\n} Sayac;\n\nstatic void ekle(Sayac *s, int *adet, const char *k) {\n  for (int i = 0; i < *adet; i++)\n    if (strcmp(s[i].k, k) == 0) { s[i].n++; return; }\n  if (*adet == 1000) return;\n  strcpy(s[*adet].k, k);\n  s[*adet].n = 1;\n  (*adet)++;\n}\n\nstatic int kars(const void *a, const void *b) {\n  const Sayac *x = a, *y = b;\n  if (x->n != y->n) return (x->n < y->n) - (x->n > y->n);\n  return strcmp(x->k, y->k);\n}\n\nint main(void) {\n  static Sayac s[1000];\n  int adet = 0, c, u = 0;\n  char buf[32];\n  do {\n    c = getchar();\n    if (c != EOF && isalpha(c)) {\n      if (u < 31) buf[u++] = (char)tolower(c);\n    } else if (u > 0) {\n      buf[u] = '\\0';\n      ekle(s, &adet, buf);\n      u = 0;\n    }\n  } while (c != EOF);\n  qsort(s, adet, sizeof s[0], kars);\n  for (int i = 0; i < adet && i < 3; i++) printf(\"%s %d\\n\", s[i].k, s[i].n);\n  return 0;\n}"
      })
    ],
    cards: [
      { id: "c20k1", q: "getchar'ın sonucu neden int değişkende tutulur?", a: "EOF (genellikle −1) ile geçerli bayt değerlerini ayırt edebilmek için." },
      { id: "c20k2", q: "Çok ölçütlü qsort karşılaştırıcısı nasıl yazılır?", a: "Önce birinci ölçütü karşılaştır; eşitse ikinci ölçüte geç (ör. adet azalan, sonra ad artan)." },
      { id: "c20k3", q: "Akışı okurken son kelimeyi kaçırmamak için?", a: "EOF'ta da 'bekleyen kelime var mı' kontrolü yap (do-while ya da döngü sonrası ek işlem)." }
    ]
  }
  ];

  window.KD_CURRICULUM = (window.KD_CURRICULUM || []).concat(C2);
})();
