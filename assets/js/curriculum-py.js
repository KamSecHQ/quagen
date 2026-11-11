/* QUAGEN NextGen — Müfredat: Python temelleri, Ders 1–10 (dil: Python, parkur: py)
 * Kod tarayıcıda Pyodide (CPython 3.12, WebAssembly) ile çalışır. Test biçimi: assets/js/python.js
 */
(function () {
  /* Okunur kod blokları: ham metin, baştaki satır sonu ve sondaki boşluklar atılır */
  const k = (s, ...v) => String.raw(s, ...v).replace(/^\n/, "").replace(/\s+$/, "") + "\n";
  const g = (o) => Object.assign({ lang: "py" }, o);

  const PY = [
  /* ============================ Python · DERS 1 ============================ */
  {
    id: "py1", no: 1, language: "py", track: "py", title: "print, değişkenler ve f-string", short: "print & değişkenler",
    goal: "Ekrana yaz, değerleri isimlerle sakla, kullanıcıdan girdi al ve metinleri f-string ile biçimlendir.",
    concepts: ["print()", "değişken ve atama", "int, float, str", "input() ve int()", "f-string"],
    predict: {
      lang: "py",
      code: k`
print("3" + "4", 3 + 4)
`,
      options: ["34 7", "7 7", "34 34", "Hata verir"], answer: 0,
      why: "Tırnak içindeki \"3\" bir metindir (str); iki metni + ile toplamak onları uç uca ekler: \"34\". 3 + 4 ise sayı toplamıdır: 7. print, virgülle verilen değerleri arada bir boşlukla yazar."
    },
    example: {
      title: "Kullanıcıyı selamlayan program",
      lang: "py",
      code: k`
ad = "Deniz"
yas = 19
boy = 1.74

print("Merhaba", ad)
print(f"{ad} {yas} yaşında, boyu {boy} m.")
print(f"5 yıl sonra {yas + 5} yaşında olacak.")
print(type(yas).__name__, type(boy).__name__, type(ad).__name__)
`,
      steps: [
        { lines: [1, 2, 3], text: "Değişken, bir değere verilen addır. Türü yazmazsın; Python değerden anlar: metin (str), tam sayı (int), ondalıklı sayı (float)." },
        { lines: [5], text: "print birden çok değeri virgülle alır ve aralarına boşluk koyar." },
        { lines: [6, 7], text: "f-string: tırnaktan önce f yazarsan süslü parantez içindeki her ifade hesaplanıp metne yerleştirilir." },
        { lines: [8], text: "type() bir değerin türünü söyler. Çıktı: int float str." }
      ]
    },
    challenges: [
      g({
        id: "py1c1", kind: "Hata Ayıkla", title: "İlk program", fn: "main", mode: "stdout",
        prompt: "Program ekrana tam olarak `Merhaba, QUAGEN!` yazmalı ama çalışmıyor. Hatayı bul ve düzelt.",
        starter: k`
Print("Merhaba, QUAGEN!")
`,
        tests: [{ label: "çıktı", stdin: "", stdout: "Merhaba, QUAGEN!" }],
        hints: ["Hata mesajı hangi ismin tanımlı olmadığını söylüyor?", "Python büyük/küçük harfe duyarlıdır: Print ile print farklı isimlerdir.", "print(\"Merhaba, QUAGEN!\")"],
        solution: k`
print("Merhaba, QUAGEN!")
`
      }),
      g({
        id: "py1c2", kind: "Yaz", title: "Yaş hesaplayıcı", fn: "main", mode: "stdout",
        prompt: "Kullanıcıdan önce adını, sonra yaşını al (`input()`). Ekrana `Merhaba Ece, 10 yıl sonra 30 yaşında olacaksın.` biçiminde yaz.",
        starter: k`
ad = input()
yas = input()
`,
        tests: [
          { label: "Ece, 20", stdin: "Ece\n20\n", stdout: "Merhaba Ece, 10 yıl sonra 30 yaşında olacaksın." },
          { label: "Mert, 7", stdin: "Mert\n7\n", stdout: "Merhaba Mert, 10 yıl sonra 17 yaşında olacaksın." }
        ],
        hints: ["input() her zaman metin (str) döndürür. Metne 10 eklemeye çalışırsan ne olur?", "Metni sayıya çevirmek için int() kullan: yas = int(input())", "print(f\"Merhaba {ad}, 10 yıl sonra {yas + 10} yaşında olacaksın.\")"],
        solution: k`
ad = input()
yas = int(input())
print(f"Merhaba {ad}, 10 yıl sonra {yas + 10} yaşında olacaksın.")
`
      }),
      g({
        id: "py1c3", kind: "Yaz", title: "Ortalama", fn: "ortalama",
        prompt: "`ortalama(a, b, c)` üç sayının ortalamasını **virgülden sonra 2 basamağa yuvarlanmış** olarak döndürsün (`round`).",
        starter: k`
def ortalama(a, b, c):
    pass
`,
        tests: [
          { label: "ortalama(1, 2, 3)", expr: "ortalama(1, 2, 3)", expected: 2 },
          { label: "ortalama(70, 85, 90)", expr: "ortalama(70, 85, 90)", expected: 81.67 },
          { label: "ortalama(0.1, 0.2, 0.3)", expr: "ortalama(0.1, 0.2, 0.3)", expected: 0.2 }
        ],
        hints: ["Ortalama: toplam bölü adet.", "Python'da / her zaman ondalıklı sonuç verir: 7 / 2 = 3.5.", "return round((a + b + c) / 3, 2)"],
        solution: k`
def ortalama(a, b, c):
    return round((a + b + c) / 3, 2)
`
      })
    ],
    cards: [
      { id: "py1k1", q: "input() hangi türde değer döndürür?", a: "Her zaman str (metin). Sayı gerekiyorsa int() ya da float() ile dönüştürülür." },
      { id: "py1k2", q: "f-string nedir?", a: "f\"...\" biçimindeki metin; süslü parantez içindeki ifadeler hesaplanıp yerine konur: f\"{a + 1}\"." },
      { id: "py1k3", q: "7 / 2 ve 7 // 2 farkı?", a: "/ ondalıklı bölme (3.5), // tam sayı bölmesi (3)." }
    ]
  },

  /* ============================ Python · DERS 2 ============================ */
  {
    id: "py2", no: 2, language: "py", track: "py", title: "Koşullar ve doğruluk değerleri", short: "Koşullar",
    goal: "Programın karar vermesini sağla: if / elif / else, mantıksal işleçler ve Python'un doğruluk kuralları.",
    concepts: ["if, elif, else", "and, or, not", "karşılaştırma zinciri", "doğru/yanlış sayılan değerler", "girinti"],
    predict: {
      lang: "py",
      code: k`
print(bool(""), bool("0"), bool([]))
`,
      options: ["False True False", "False False False", "True True False", "False True True"], answer: 0,
      why: "Boş metin, boş liste, 0 ve None yanlış (False) sayılır. \"0\" ise boş olmayan bir metindir, içeriği önemli değil: True. Bu yüzden if liste: yazmak 'liste boş değilse' demektir."
    },
    example: {
      title: "Bilet fiyatı",
      lang: "py",
      code: k`
yas = 15
ogrenci = True

if yas < 7:
    fiyat = 0
elif 7 <= yas < 18 or ogrenci:
    fiyat = 20
else:
    fiyat = 40

print(f"Bilet: {fiyat} TL")
`,
      steps: [
        { lines: [4, 5], text: "Koşul satırı iki noktayla (:) biter; altındaki blok 4 boşluk içeride yazılır. Girinti Python'da süs değil, söz dizimidir." },
        { lines: [6], text: "Python karşılaştırmaları zincirleyebilir: 7 <= yas < 18. or, iki koşuldan biri doğruysa doğrudur." },
        { lines: [6, 8], text: "Koşullar yukarıdan aşağı denenir; ilk doğru olan çalışır, diğerlerine bakılmaz." },
        { lines: [11], text: "Çıktı: Bilet: 20 TL." }
      ]
    },
    challenges: [
      g({
        id: "py2c1", kind: "Hata Ayıkla", title: "Herkes D aldı", fn: "harf_notu",
        prompt: "`harf_notu(puan)` 90+ için A, 80+ B, 70+ C, 60+ D, altı F döndürmeli. 95 alan öğrenciye bile D veriyor. Neden? Düzelt.",
        starter: k`
def harf_notu(puan):
    if puan >= 60:
        return "D"
    elif puan >= 70:
        return "C"
    elif puan >= 80:
        return "B"
    elif puan >= 90:
        return "A"
    else:
        return "F"
`,
        tests: [
          { label: "95", expr: "harf_notu(95)", expected: "A" },
          { label: "80", expr: "harf_notu(80)", expected: "B" },
          { label: "79", expr: "harf_notu(79)", expected: "C" },
          { label: "60", expr: "harf_notu(60)", expected: "D" },
          { label: "12", expr: "harf_notu(12)", expected: "F" }
        ],
        hints: ["95 için koşullar hangi sırayla denenir? İlk doğru olan hangisi?", "Daha dar koşul (>= 90) daha geniş koşuldan (>= 60) önce gelmeli.", "Sırayı tersine çevir: önce 90, sonra 80, 70, 60."],
        solution: k`
def harf_notu(puan):
    if puan >= 90:
        return "A"
    elif puan >= 80:
        return "B"
    elif puan >= 70:
        return "C"
    elif puan >= 60:
        return "D"
    else:
        return "F"
`
      }),
      g({
        id: "py2c2", kind: "Yaz", title: "Artık yıl", fn: "artik_yil",
        prompt: "`artik_yil(yil)`: 4'e bölünen yıllar artıktır; ama 100'e bölünenler değildir; 400'e bölünenler yine artıktır. True/False döndür.",
        starter: k`
def artik_yil(yil):
    pass
`,
        tests: [
          { label: "2024", expr: "artik_yil(2024)", expected: true },
          { label: "2023", expr: "artik_yil(2023)", expected: false },
          { label: "1900", expr: "artik_yil(1900)", expected: false },
          { label: "2000", expr: "artik_yil(2000)", expected: true }
        ],
        hints: ["Bölünebilirlik: yil % 4 == 0.", "Üç kuralı and / or ile tek ifadede birleştirebilirsin.", "return yil % 4 == 0 and (yil % 100 != 0 or yil % 400 == 0)"],
        solution: k`
def artik_yil(yil):
    return yil % 4 == 0 and (yil % 100 != 0 or yil % 400 == 0)
`
      }),
      g({
        id: "py2c3", kind: "Yaz", title: "FizzBuzz", fn: "fizzbuzz",
        prompt: "`fizzbuzz(n)`: 3'e bölünüyorsa `\"Fizz\"`, 5'e bölünüyorsa `\"Buzz\"`, ikisine de bölünüyorsa `\"FizzBuzz\"`, hiçbirine bölünmüyorsa sayının kendisini metin olarak döndürsün.",
        starter: k`
def fizzbuzz(n):
    pass
`,
        tests: [
          { label: "3", expr: "fizzbuzz(3)", expected: "Fizz" },
          { label: "10", expr: "fizzbuzz(10)", expected: "Buzz" },
          { label: "30", expr: "fizzbuzz(30)", expected: "FizzBuzz" },
          { label: "7", expr: "fizzbuzz(7)", expected: "7" }
        ],
        hints: ["En özel durum (hem 3 hem 5) önce kontrol edilmeli.", "15'e bölünmek, hem 3'e hem 5'e bölünmek demektir.", "Son durumda str(n) döndür."],
        solution: k`
def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)
`
      })
    ],
    cards: [
      { id: "py2k1", q: "Python'da yanlış (False) sayılan değerler?", a: "False, None, 0, 0.0, boş metin \"\", boş liste [], boş sözlük {}, boş küme set()." },
      { id: "py2k2", q: "if / elif zincirinde koşulların sırası neden önemli?", a: "İlk doğru koşul çalışır, diğerleri denenmez. Dar koşullar geniş olanlardan önce yazılmalı." },
      { id: "py2k3", q: "Python'da blokları ne belirler?", a: "İki nokta (:) ve ardından gelen girinti (genellikle 4 boşluk). Süslü parantez kullanılmaz." }
    ]
  },

  /* ============================ Python · DERS 3 ============================ */
  {
    id: "py3", no: 3, language: "py", track: "py", title: "Döngüler: for, range ve while", short: "Döngüler",
    goal: "Bir işi tekrar ettir: range ile sayarak, while ile koşul bitene kadar; break ve tam sayı bölmesiyle birlikte.",
    concepts: ["for ve range(baş, son, adım)", "while", "break ve continue", "// ve %"],
    predict: {
      lang: "py",
      code: k`
for i in range(1, 10, 3):
    print(i, end=" ")
`,
      options: ["1 4 7", "1 4 7 10", "1 2 3", "3 6 9"], answer: 0,
      why: "range(1, 10, 3): 1'den başla, 3'er artır, 10'a ulaşmadan dur. Bitiş değeri hiçbir zaman dahil değildir: 1, 4, 7. end=\" \" satır sonu yerine boşluk yazar."
    },
    example: {
      title: "Bir sayının basamakları",
      lang: "py",
      code: k`
n = 4096
basamaklar = 0
while n > 0:
    son = n % 10
    print("son basamak:", son)
    n = n // 10
    basamaklar += 1
print("toplam", basamaklar, "basamak")
`,
      steps: [
        { lines: [3], text: "while, koşul doğru olduğu sürece tekrar eder. Koşulu bir gün yanlış yapacak bir şey olmalı; yoksa döngü sonsuza dek sürer." },
        { lines: [4], text: "n % 10 bölümden kalan: sayının son basamağı." },
        { lines: [6], text: "n // 10 tam sayı bölmesi: son basamağı atar. / kullansaydın 409.6 gibi ondalıklı sayılar elde ederdin." },
        { lines: [8], text: "Çıktı sondan başa 6, 9, 0, 4 ve 'toplam 4 basamak'." }
      ]
    },
    challenges: [
      g({
        id: "py3c1", kind: "Yaz", title: "Faktöriyel", fn: "faktoriyel",
        prompt: "`faktoriyel(n)` n! = 1 · 2 · … · n değerini bir `for` döngüsüyle hesaplasın. 0! = 1. (`math` modülünü kullanma.)",
        starter: k`
def faktoriyel(n):
    pass
`,
        tests: [
          { label: "0", expr: "faktoriyel(0)", expected: 1 },
          { label: "5", expr: "faktoriyel(5)", expected: 120 },
          { label: "20", expr: "faktoriyel(20)", expected: 2432902008176640000 },
          { label: "math kullanılmadı", codeNot: "math", codeHint: "döngüyle hesapla" }
        ],
        hints: ["Sonucu 1'den başlat; çarpmada etkisiz eleman 1'dir.", "range(1, n + 1) 1'den n'ye kadar sayar.", "for i in range(2, n + 1): sonuc *= i"],
        solution: k`
def faktoriyel(n):
    sonuc = 1
    for i in range(2, n + 1):
        sonuc *= i
    return sonuc
`
      }),
      g({
        id: "py3c2", kind: "Hata Ayıkla", title: "Garip basamak toplamı", fn: "basamak_toplami",
        prompt: "`basamak_toplami(n)` bir sayının basamaklarını toplamalı (1234 → 10), ama sonuç ondalıklı ve yanlış çıkıyor. Düzelt.",
        starter: k`
def basamak_toplami(n):
    toplam = 0
    while n > 0:
        toplam += n % 10
        n = n / 10
    return toplam
`,
        tests: [
          { label: "1234", expr: "basamak_toplami(1234)", expected: 10 },
          { label: "9", expr: "basamak_toplami(9)", expected: 9 },
          { label: "1000001", expr: "basamak_toplami(1000001)", expected: 2 },
          { label: "0", expr: "basamak_toplami(0)", expected: 0 },
          { label: "sonuç tam sayı", expr: "type(basamak_toplami(55)).__name__", expected: "int" }
        ],
        hints: ["Örnekteki programla karşılaştır: hangi bölme işleci farklı?", "/ her zaman float verir; 123 / 10 = 12.3 olur ve son basamak 2.3 gibi çıkar.", "n = n // 10"],
        solution: k`
def basamak_toplami(n):
    toplam = 0
    while n > 0:
        toplam += n % 10
        n = n // 10
    return toplam
`
      }),
      g({
        id: "py3c3", kind: "Yaz", title: "Asal mı?", fn: "asal_mi",
        prompt: "`asal_mi(n)` n asal ise True döndürsün. Bölenleri yalnızca √n'e kadar dene; büyük sayılarda da hızlı olmalı.",
        starter: k`
def asal_mi(n):
    pass
`,
        tests: [
          { label: "1", expr: "asal_mi(1)", expected: false },
          { label: "2", expr: "asal_mi(2)", expected: true },
          { label: "91", expr: "asal_mi(91)", expected: false },
          { label: "97", expr: "asal_mi(97)", expected: true },
          { label: "1000000007 (hızlı olmalı)", expr: "asal_mi(1000000007)", expected: true }
        ],
        hints: ["2'den küçük sayılar asal değildir.", "n'nin √n'den büyük bir böleni varsa, √n'den küçük bir eşi de vardır.", "i = 2; while i * i <= n: if n % i == 0: return False; i += 1 — sonunda return True."],
        solution: k`
def asal_mi(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True
`
      })
    ],
    cards: [
      { id: "py3k1", q: "range(2, 10, 2) hangi sayıları üretir?", a: "2, 4, 6, 8. Bitiş değeri (10) dahil değildir." },
      { id: "py3k2", q: "Bir sayının son basamağı ve son basamağı atılmış hâli?", a: "n % 10 ve n // 10." },
      { id: "py3k3", q: "break ve continue farkı?", a: "break döngüden tamamen çıkar; continue bu turu bırakıp bir sonraki tura geçer." }
    ]
  },

  /* ============================ Python · DERS 4 ============================ */
  {
    id: "py4", no: 4, language: "py", track: "py", title: "Fonksiyonlar ve parametreler", short: "Fonksiyonlar",
    goal: "Tekrar eden işi isimlendir: varsayılan ve isimli parametreler, birden fazla değer döndürmek ve değiştirilebilir varsayılan tuzağı.",
    concepts: ["def ve return", "varsayılan parametre", "isimli argüman", "demet (tuple) döndürme", "değiştirilebilir varsayılan"],
    predict: {
      lang: "py",
      code: k`
def f(x, y=2):
    return x * y

print(f(3), f(3, y=4))
`,
      options: ["6 12", "6 6", "5 7", "Hata verir"], answer: 0,
      why: "y verilmezse varsayılan değeri 2 kullanılır: 3 · 2 = 6. İkinci çağrıda y=4 isimli argümanla verilmiş: 3 · 4 = 12."
    },
    example: {
      title: "Birden çok değer döndürmek",
      lang: "py",
      code: k`
def istatistik(sayilar):
    toplam = sum(sayilar)
    return toplam, toplam / len(sayilar)

t, ort = istatistik([4, 8, 6])
print("toplam:", t, "ortalama:", ort)

def selamla(ad, selam="Merhaba", unlem=True):
    return f"{selam}, {ad}" + ("!" if unlem else ".")

print(selamla("Ada"), selamla("Linus", unlem=False))
`,
      steps: [
        { lines: [3], text: "Virgülle ayrılmış değerler bir demet (tuple) olarak döner." },
        { lines: [5], text: "Demet açma: dönen iki değer iki değişkene sırayla atanır." },
        { lines: [8], text: "Varsayılan değerli parametreler sona yazılır ve çağrıda atlanabilir." },
        { lines: [11], text: "İsimli argümanla (unlem=False) aradaki parametreleri atlayabilirsin. Çıktı: Merhaba, Ada! Merhaba, Linus." }
      ]
    },
    challenges: [
      g({
        id: "py4c1", kind: "Yaz", title: "Esnek selam", fn: "selamla",
        prompt: "`selamla(ad, selam=\"Merhaba\")` `\"Merhaba, Ada!\"` biçiminde metin döndürsün. `selam` verilirse onu kullansın.",
        starter: k`
def selamla(ad):
    pass
`,
        tests: [
          { label: "selamla(\"Ada\")", expr: "selamla(\"Ada\")", expected: "Merhaba, Ada!" },
          { label: "selamla(\"Ada\", \"Günaydın\")", expr: "selamla(\"Ada\", \"Günaydın\")", expected: "Günaydın, Ada!" },
          { label: "selamla(selam=\"Selam\", ad=\"Can\")", expr: "selamla(selam=\"Selam\", ad=\"Can\")", expected: "Selam, Can!" }
        ],
        hints: ["İmzaya ikinci, varsayılan değerli bir parametre ekle.", "def selamla(ad, selam=\"Merhaba\"):", "return f\"{selam}, {ad}!\""],
        solution: k`
def selamla(ad, selam="Merhaba"):
    return f"{selam}, {ad}!"
`
      }),
      g({
        id: "py4c2", kind: "Yaz", title: "En küçük ve en büyük", fn: "min_maks",
        prompt: "`min_maks(sayilar)` boş olmayan bir listenin en küçük ve en büyük elemanını `(en_kucuk, en_buyuk)` demeti olarak döndürsün. `min`, `max` ve `sorted` kullanmadan, listeyi **bir kez** dolaşarak.",
        starter: k`
def min_maks(sayilar):
    pass
`,
        tests: [
          { label: "[3, 1, 4, 1, 5]", expr: "min_maks([3, 1, 4, 1, 5])", expected: [1, 5] },
          { label: "[-2]", expr: "min_maks([-2])", expected: [-2, -2] },
          { label: "[7, -7, 0]", expr: "min_maks([7, -7, 0])", expected: [-7, 7] },
          { label: "demet döner", expr: "type(min_maks([1, 2])).__name__", expected: "tuple" },
          { label: "hazır fonksiyon yok", codeNot: "\\b(min|max|sorted)\\s*\\(|\\.sort\\(", codeHint: "tek geçişte kendin bul" }
        ],
        hints: ["İki değişkeni ilk elemanla başlat.", "Her elemanı ikisiyle karşılaştır ve gerekirse güncelle.", "return kucuk, buyuk"],
        solution: k`
def min_maks(sayilar):
    kucuk = buyuk = sayilar[0]
    for x in sayilar:
        if x < kucuk:
            kucuk = x
        if x > buyuk:
            buyuk = x
    return kucuk, buyuk
`
      }),
      g({
        id: "py4c3", kind: "Hata Ayıkla", title: "Hafızalı liste", fn: "ekle",
        prompt: "`ekle(oge, liste=None)` öğeyi listeye ekleyip listeyi döndürmeli; liste verilmezse **yeni** bir liste kullanmalı. Ama iki ayrı çağrı aynı listeyi paylaşıyor. Neden? Düzelt.",
        starter: k`
def ekle(oge, liste=[]):
    liste.append(oge)
    return liste
`,
        tests: [
          { label: "ilk çağrı", expr: "ekle(1)", expected: [1] },
          { label: "iki ayrı çağrı birbirini etkilemez", setup: "a = ekle(1)\nb = ekle(2)", expr: "[a, b]", expected: [[1], [2]] },
          { label: "verilen listeye ekler", setup: "x = [9]\nekle(8, x)", expr: "x", expected: [9, 8] }
        ],
        hints: ["Varsayılan değer fonksiyon tanımlanırken bir kez oluşturulur, her çağrıda değil.", "Değiştirilebilir (liste, sözlük) varsayılanlar bu yüzden tehlikelidir. Varsayılanı None yap.", "if liste is None: liste = []"],
        solution: k`
def ekle(oge, liste=None):
    if liste is None:
        liste = []
    liste.append(oge)
    return liste
`
      })
    ],
    cards: [
      { id: "py4k1", q: "Fonksiyon return yazmadan biterse ne döner?", a: "None." },
      { id: "py4k2", q: "def f(x=[]) neden tehlikeli?", a: "Varsayılan liste tanımda bir kez oluşur ve tüm çağrılar onu paylaşır. Varsayılanı None yapıp fonksiyon içinde [] oluştur." },
      { id: "py4k3", q: "return a, b ne döndürür?", a: "(a, b) demeti; t, u = f() ile açılabilir." }
    ]
  },

  /* ============================ Python · DERS 5 ============================ */
  {
    id: "py5", no: 5, language: "py", track: "py", title: "Listeler ve dilimleme", short: "Listeler",
    goal: "Sıralı veri koleksiyonlarıyla çalış: indeks, negatif indeks, dilim, ekleme/çıkarma ve sort ile sorted farkı.",
    concepts: ["indeks ve negatif indeks", "dilim [baş:son:adım]", "append, insert, pop", "sort ve sorted", "kopya ve referans"],
    predict: {
      lang: "py",
      code: k`
a = [1, 2, 3, 4, 5]
print(a[-2], a[1:3], a[::-1][0])
`,
      options: ["4 [2, 3] 5", "4 [2, 3, 4] 1", "2 [1, 2, 3] 5", "Hata verir"], answer: 0,
      why: "a[-2] sondan ikinci: 4. a[1:3] 1. indeksten başlar, 3'e ulaşmadan durur: [2, 3]. a[::-1] listenin ters çevrilmiş kopyası; ilk elemanı 5."
    },
    example: {
      title: "Liste işlemleri",
      lang: "py",
      code: k`
notlar = [70, 95, 60]
notlar.append(85)
notlar.insert(0, 100)
cikan = notlar.pop()
print(notlar, "çıkan:", cikan)

sirali = sorted(notlar)
print(sirali, notlar)
notlar.sort(reverse=True)
print(notlar)

kopya = notlar[:]
ayni = notlar
ayni.append(1)
print(len(kopya), len(notlar))
`,
      steps: [
        { lines: [2, 3, 4], text: "append sona ekler, insert verilen konuma ekler, pop sondaki elemanı çıkarıp döndürür." },
        { lines: [7, 8], text: "sorted yeni bir sıralı liste döndürür, orijinale dokunmaz." },
        { lines: [9], text: "list.sort listeyi yerinde sıralar ve None döndürür. x = x.sort() yazmak listeyi kaybettirir." },
        { lines: [12, 13, 14, 15], text: "ayni = notlar kopya değil, aynı listeye ikinci bir addır. [:] dilimi gerçek bir kopya üretir. Çıktı: 4 5." }
      ]
    },
    challenges: [
      g({
        id: "py5c1", kind: "Yaz", title: "Ters kopya", fn: "ters_cevir",
        prompt: "`ters_cevir(liste)` listenin ters sıralı **yeni** bir kopyasını döndürsün; orijinal liste değişmemeli.",
        starter: k`
def ters_cevir(liste):
    liste.reverse()
    return liste
`,
        tests: [
          { label: "[1, 2, 3]", expr: "ters_cevir([1, 2, 3])", expected: [3, 2, 1] },
          { label: "boş liste", expr: "ters_cevir([])", expected: [] },
          { label: "orijinal değişmez", setup: "a = [1, 2, 3]\nb = ters_cevir(a)", expr: "a", expected: [1, 2, 3] }
        ],
        hints: ["reverse() listeyi yerinde değiştirir; çağıranın listesi de değişir.", "Dilimleme yeni bir liste üretir.", "return liste[::-1]"],
        solution: k`
def ters_cevir(liste):
    return liste[::-1]
`
      }),
      g({
        id: "py5c2", kind: "Yaz", title: "İkinci en büyük", fn: "ikinci_buyuk",
        prompt: "`ikinci_buyuk(liste)` listedeki **farklı** değerler arasında ikinci en büyüğü döndürsün. Böyle bir değer yoksa `None`.",
        starter: k`
def ikinci_buyuk(liste):
    pass
`,
        tests: [
          { label: "[3, 9, 7]", expr: "ikinci_buyuk([3, 9, 7])", expected: 7 },
          { label: "[5, 5, 3] (tekrar)", expr: "ikinci_buyuk([5, 5, 3])", expected: 3 },
          { label: "[4, 4]", expr: "ikinci_buyuk([4, 4])", expected: null },
          { label: "boş", expr: "ikinci_buyuk([])", expected: null },
          { label: "negatifler", expr: "ikinci_buyuk([-1, -8, -3])", expected: -3 }
        ],
        hints: ["Tekrarları atmak için set() kullanabilirsin.", "Farklı değerleri sırala; iki elemandan azsa None.", "f = sorted(set(liste)); return f[-2] if len(f) >= 2 else None"],
        solution: k`
def ikinci_buyuk(liste):
    farkli = sorted(set(liste))
    return farkli[-2] if len(farkli) >= 2 else None
`
      }),
      g({
        id: "py5c3", kind: "Yaz", title: "Parçalara böl", fn: "parcala",
        prompt: "`parcala(liste, n)` listeyi n elemanlık parçalara bölüp parçaların listesini döndürsün. Son parça kısa olabilir.",
        starter: k`
def parcala(liste, n):
    pass
`,
        tests: [
          { label: "[1..5], 2", expr: "parcala([1, 2, 3, 4, 5], 2)", expected: [[1, 2], [3, 4], [5]] },
          { label: "[1..6], 3", expr: "parcala([1, 2, 3, 4, 5, 6], 3)", expected: [[1, 2, 3], [4, 5, 6]] },
          { label: "boş", expr: "parcala([], 4)", expected: [] },
          { label: "n büyük", expr: "parcala([1, 2], 10)", expected: [[1, 2]] }
        ],
        hints: ["Parçaların başlangıç indeksleri 0, n, 2n, … — range(0, len(liste), n).", "Her başlangıç i için dilim liste[i:i + n]. Dilim liste sonunu aşarsa hata vermez.", "return [liste[i:i + n] for i in range(0, len(liste), n)]"],
        solution: k`
def parcala(liste, n):
    sonuc = []
    for i in range(0, len(liste), n):
        sonuc.append(liste[i:i + n])
    return sonuc
`
      })
    ],
    cards: [
      { id: "py5k1", q: "liste.sort() ile sorted(liste) farkı?", a: "sort listeyi yerinde sıralar ve None döndürür; sorted yeni bir sıralı liste döndürür." },
      { id: "py5k2", q: "b = a yazmak listeyi kopyalar mı?", a: "Hayır, aynı listeye ikinci bir ad verir. Kopya için a[:], list(a) ya da a.copy()." },
      { id: "py5k3", q: "a[::-1] ne verir?", a: "Listenin ters çevrilmiş yeni bir kopyasını." }
    ]
  },

  /* ============================ Python · DERS 6 ============================ */
  {
    id: "py6", no: 6, language: "py", track: "py", title: "Metinler ve metin metotları", short: "Metinler",
    goal: "Metinleri parçala, birleştir, temizle ve dönüştür; metinlerin değiştirilemez olduğunu kavra.",
    concepts: ["indeks ve dilim", "split ve join", "strip, upper, lower, replace", "in ile arama", "değiştirilemezlik"],
    predict: {
      lang: "py",
      code: k`
s = "Quagen"
print(s[0], s[-1], s.upper()[1:3], len(s))
`,
      options: ["Q n UA 6", "Q n ua 6", "Q e UA 5", "Hata verir"], answer: 0,
      why: "Metinler de liste gibi indekslenir: s[0] = Q, s[-1] = n. upper() büyük harfli YENİ bir metin döndürür: \"QUAGEN\"; [1:3] → \"UA\". len 6."
    },
    example: {
      title: "Metni temizlemek ve parçalamak",
      lang: "py",
      code: k`
satir = "  elma, armut ,muz  "
parcalar = [p.strip() for p in satir.split(",")]
print(parcalar)
print(" | ".join(parcalar))

isim = "ada"
buyuk = isim.capitalize()
print(isim, buyuk, "d" in isim)
print("kod yaz".replace("kod", "test").title())
`,
      steps: [
        { lines: [2], text: "split metni ayraçtan böler ve liste döndürür; strip baştaki ve sondaki boşlukları atar." },
        { lines: [4], text: "join, split'in tersidir: ayraç.join(liste)." },
        { lines: [7, 8], text: "Metinler değiştirilemez: capitalize isim'i değiştirmez, yeni bir metin döndürür. in alt metin arar." },
        { lines: [9], text: "Metotlar zincirlenebilir. Çıktı: Test Yaz." }
      ]
    },
    challenges: [
      g({
        id: "py6c1", kind: "Yaz", title: "Baş harfler", fn: "bas_harfler",
        prompt: "`bas_harfler(cumle)` her kelimenin ilk harfini büyük harfle birleştirip döndürsün: `\"kod yazarak öğren\"` → `\"KYÖ\"`. Fazla boşluklar sorun olmamalı.",
        starter: k`
def bas_harfler(cumle):
    pass
`,
        tests: [
          { label: "\"kod yazarak öğren\"", expr: "bas_harfler(\"kod yazarak öğren\")", expected: "KYÖ" },
          { label: "fazla boşluk", expr: "bas_harfler(\"  türkiye   büyük  millet meclisi \")", expected: "TBMM" },
          { label: "boş", expr: "bas_harfler(\"\")", expected: "" }
        ],
        hints: ["split() argümansız çağrılırsa tüm boşluklardan böler ve boş parçaları atar.", "Her kelimenin ilk harfi: kelime[0].", "return \"\".join(k[0] for k in cumle.split()).upper()"],
        solution: k`
def bas_harfler(cumle):
    return "".join(kelime[0] for kelime in cumle.split()).upper()
`
      }),
      g({
        id: "py6c2", kind: "Yaz", title: "Palindrom", fn: "palindrom_mu",
        prompt: "`palindrom_mu(s)` büyük/küçük harf, boşluk ve noktalamayı yok sayarak metin tersten de aynı okunuyorsa True döndürsün.",
        starter: k`
def palindrom_mu(s):
    pass
`,
        tests: [
          { label: "\"Ey Edip Adanada pide ye\"", expr: "palindrom_mu(\"Ey Edip Adanada pide ye\")", expected: true },
          { label: "\"QUAGEN\"", expr: "palindrom_mu(\"QUAGEN\")", expected: false },
          { label: "noktalama", expr: "palindrom_mu(\"Ana, naber? Rebana na\")", expected: true },
          { label: "boş", expr: "palindrom_mu(\"\")", expected: true }
        ],
        hints: ["Önce yalnızca harf ve rakamları al: c.isalnum().", "Sonra hepsini küçük harfe çevir ve tersiyle karşılaştır.", "t = \"\".join(c.lower() for c in s if c.isalnum()); return t == t[::-1]"],
        solution: k`
def palindrom_mu(s):
    temiz = "".join(c.lower() for c in s if c.isalnum())
    return temiz == temiz[::-1]
`
      }),
      g({
        id: "py6c3", kind: "Yaz", title: "Sezar şifresi", fn: "sezar",
        prompt: "`sezar(metin, kaydir)` İngiliz alfabesindeki **küçük** harfleri (a–z) alfabede `kaydir` kadar ileri kaydırsın (z'den sonra a gelir). Diğer karakterler aynen kalsın.",
        starter: k`
def sezar(metin, kaydir):
    pass
`,
        tests: [
          { label: "\"abc\", 1", expr: "sezar(\"abc\", 1)", expected: "bcd" },
          { label: "\"xyz\", 3 (başa sarar)", expr: "sezar(\"xyz\", 3)", expected: "abc" },
          { label: "\"merhaba dunya!\", 13", expr: "sezar(\"merhaba dunya!\", 13)", expected: "zreunon qhaln!" },
          { label: "geri al", expr: "sezar(sezar(\"kodera\", 7), -7)", expected: "kodera" }
        ],
        hints: ["ord(c) karakterin sayı kodunu, chr(n) koddan karakteri verir.", "Harfin alfabedeki sırası: ord(c) - ord(\"a\"). Kaydır ve % 26 ile başa sar.", "chr((ord(c) - ord(\"a\") + kaydir) % 26 + ord(\"a\"))"],
        solution: k`
def sezar(metin, kaydir):
    sonuc = []
    for c in metin:
        if "a" <= c <= "z":
            sonuc.append(chr((ord(c) - ord("a") + kaydir) % 26 + ord("a")))
        else:
            sonuc.append(c)
    return "".join(sonuc)
`
      })
    ],
    cards: [
      { id: "py6k1", q: "split() ile split(\" \") farkı?", a: "Argümansız split tüm boşluk türlerinden böler ve boş parçaları atar; split(\" \") her tek boşluktan böler, boş parçalar kalır." },
      { id: "py6k2", q: "s.upper() s'yi değiştirir mi?", a: "Hayır. Metinler değiştirilemez; yeni bir metin döner: s = s.upper()." },
      { id: "py6k3", q: "Bir listeyi metne birleştirmek?", a: "\"ayraç\".join(liste). Elemanlar metin olmalı." }
    ]
  },

  /* ============================ Python · DERS 7 ============================ */
  {
    id: "py7", no: 7, language: "py", track: "py", title: "Sözlükler ve kümeler", short: "Sözlük & küme",
    goal: "Anahtarla erişilen veriyi sözlükte, benzersiz elemanları kümede tut; sayma ve gruplama kalıplarını öğren.",
    concepts: ["dict[anahtar] ve get", "items ile dolaşma", "setdefault", "set ve küme işlemleri"],
    predict: {
      lang: "py",
      code: k`
d = {"a": 1}
d["b"] = d.get("a", 0) + 1
print(len(d), d["b"], len({1, 2, 2, 3}))
`,
      options: ["2 2 3", "2 1 4", "1 2 3", "Hata verir"], answer: 0,
      why: "d.get(\"a\", 0) anahtar varsa değerini (1), yoksa 0 verir; d[\"b\"] = 2 olur ve sözlükte 2 anahtar vardır. Küme tekrarları atar: {1, 2, 3} → 3 eleman."
    },
    example: {
      title: "Sayma ve gruplama",
      lang: "py",
      code: k`
meyveler = ["elma", "muz", "elma", "kiraz", "muz", "elma"]

sayac = {}
for m in meyveler:
    sayac[m] = sayac.get(m, 0) + 1
print(sayac)

for meyve, adet in sayac.items():
    print(f"{meyve:<6} {'#' * adet}")

a, b = {1, 2, 3}, {2, 3, 4}
print(a & b, a | b, a - b)
`,
      steps: [
        { lines: [5], text: "Sayma kalıbı: get ile mevcut değeri al (yoksa 0), bir artır. Doğrudan sayac[m] += 1 yazsaydın ilk görüşte KeyError alırdın." },
        { lines: [8, 9], text: "items() anahtar-değer çiftlerini verir. Sözlükler ekleme sırasını korur." },
        { lines: [11, 12], text: "Küme işlemleri: kesişim (&), birleşim (|), fark (-)." }
      ]
    },
    challenges: [
      g({
        id: "py7c1", kind: "Yaz", title: "Kelime sayacı", fn: "kelime_say",
        prompt: "`kelime_say(metin)` metindeki kelimeleri (boşluklardan bölünmüş, küçük harfe çevrilmiş) sayıp `{kelime: adet}` sözlüğü döndürsün.",
        starter: k`
def kelime_say(metin):
    pass
`,
        tests: [
          { label: "\"kod yaz kod oku\"", expr: "kelime_say(\"kod yaz kod oku\")", expected: { kod: 2, yaz: 1, oku: 1 } },
          { label: "büyük/küçük harf", expr: "kelime_say(\"Elma elma ELMA\")", expected: { elma: 3 } },
          { label: "boş", expr: "kelime_say(\"\")", expected: {} }
        ],
        hints: ["metin.lower().split() kelimeleri verir.", "Örnekteki sayma kalıbını kullan.", "d[k] = d.get(k, 0) + 1"],
        solution: k`
def kelime_say(metin):
    sayac = {}
    for kelime in metin.lower().split():
        sayac[kelime] = sayac.get(kelime, 0) + 1
    return sayac
`
      }),
      g({
        id: "py7c2", kind: "Yaz", title: "Ortak öğrenciler", fn: "ortak",
        prompt: "`ortak(a, b)` iki listede de bulunan elemanları, tekrarsız ve **sıralı** bir liste olarak döndürsün. Kümelerle O(n) çalışmalı.",
        starter: k`
def ortak(a, b):
    sonuc = []
    for x in a:
        if x in b and x not in sonuc:
            sonuc.append(x)
    return sonuc
`,
        tests: [
          { label: "isimler", expr: "ortak([\"ece\", \"can\", \"ali\"], [\"ali\", \"zeynep\", \"ece\"])", expected: ["ali", "ece"] },
          { label: "tekrarlar", expr: "ortak([3, 1, 3, 2], [2, 3, 3])", expected: [2, 3] },
          { label: "hiç ortak yok", expr: "ortak([1], [2])", expected: [] },
          { label: "büyük listeler (hızlı)", setup: "a = list(range(0, 60000, 2))\nb = list(range(0, 60000, 3))", expr: "len(ortak(a, b))", expected: 10000 }
        ],
        hints: ["Listede in araması her seferinde listeyi baştan tarar: O(n). İç içe olunca O(n²).", "Kümelerde in ve kesişim çok hızlıdır.", "return sorted(set(a) & set(b))"],
        solution: k`
def ortak(a, b):
    return sorted(set(a) & set(b))
`
      }),
      g({
        id: "py7c3", kind: "Hata Ayıkla", title: "İlk harfe göre grupla", fn: "grupla",
        prompt: "`grupla(kelimeler)` kelimeleri ilk harflerine göre gruplamalı: `{\"a\": [\"ada\", \"ali\"], …}` (sıra korunarak). KeyError veriyor. Düzelt.",
        starter: k`
def grupla(kelimeler):
    gruplar = {}
    for k in kelimeler:
        gruplar[k[0]].append(k)
    return gruplar
`,
        tests: [
          { label: "isimler", expr: "grupla([\"ada\", \"bora\", \"ali\", \"ceren\", \"berk\"])", expected: { a: ["ada", "ali"], b: ["bora", "berk"], c: ["ceren"] } },
          { label: "boş", expr: "grupla([])", expected: {} }
        ],
        hints: ["İlk kez görülen harf için sözlükte henüz bir liste yok.", "Önce anahtar yoksa boş liste koy, sonra ekle.", "gruplar.setdefault(k[0], []).append(k)"],
        solution: k`
def grupla(kelimeler):
    gruplar = {}
    for k in kelimeler:
        gruplar.setdefault(k[0], []).append(k)
    return gruplar
`
      })
    ],
    cards: [
      { id: "py7k1", q: "d[\"x\"] ile d.get(\"x\") farkı?", a: "Anahtar yoksa d[\"x\"] KeyError verir; d.get(\"x\") None (ya da verilen varsayılanı) döndürür." },
      { id: "py7k2", q: "Listede ve kümede x in ... aramasının karmaşıklığı?", a: "Listede O(n), kümede ve sözlükte ortalama O(1)." },
      { id: "py7k3", q: "setdefault ne yapar?", a: "Anahtar yoksa verilen varsayılanı koyar; her durumda anahtarın değerini döndürür. Gruplama kalıbında kullanılır." }
    ]
  },

  /* ============================ Python · DERS 8 ============================ */
  {
    id: "py8", no: 8, language: "py", track: "py", title: "Kavramalar, lambda ve sıralama anahtarı", short: "Kavramalar",
    goal: "Dönüştürme ve süzmeyi tek ifadede yaz: liste/sözlük kavramaları, lambda ve sorted'ın key parametresi.",
    concepts: ["liste kavraması", "koşullu kavrama", "sözlük kavraması", "lambda", "sorted(key=...)"],
    predict: {
      lang: "py",
      code: k`
print([x * x for x in range(5) if x % 2 == 0])
`,
      options: ["[0, 4, 16]", "[0, 1, 4, 9, 16]", "[4, 16]", "[1, 9]"], answer: 0,
      why: "range(5) → 0..4. Koşul çiftleri seçer: 0, 2, 4. Her birinin karesi alınır: [0, 4, 16]."
    },
    example: {
      title: "Döngüden kavramaya",
      lang: "py",
      code: k`
fiyatlar = {"kalem": 12, "defter": 45, "silgi": 6}

ucuzlar = []
for urun, fiyat in fiyatlar.items():
    if fiyat < 20:
        ucuzlar.append(urun)

ucuzlar2 = [u for u, f in fiyatlar.items() if f < 20]
kdvli = {u: round(f * 1.2, 2) for u, f in fiyatlar.items()}

print(ucuzlar == ucuzlar2, kdvli)
print(sorted(fiyatlar, key=lambda u: fiyatlar[u], reverse=True))
`,
      steps: [
        { lines: [3, 4, 5, 6], text: "Klasik kalıp: boş liste, döngü, koşul, append." },
        { lines: [8], text: "Aynısı tek satırda: [ifade for öğe in kaynak if koşul]." },
        { lines: [9], text: "Sözlük kavraması: {anahtar: değer for ...}." },
        { lines: [12], text: "key, her elemanın neye göre sıralanacağını söyleyen fonksiyondur. lambda tek satırlık isimsiz fonksiyondur. Çıktı: ['defter', 'kalem', 'silgi']." }
      ]
    },
    challenges: [
      g({
        id: "py8c1", kind: "Değiştir", title: "Tek satırda kareler", fn: "tek_kareler",
        prompt: "`tek_kareler(n)` 1..n arasındaki **tek** sayıların karelerini liste olarak döndürüyor. Döngüyü ve append'i kaldırıp bir liste kavramasıyla yaz.",
        starter: k`
def tek_kareler(n):
    sonuc = []
    for x in range(1, n + 1):
        if x % 2 == 1:
            sonuc.append(x * x)
    return sonuc
`,
        tests: [
          { label: "n = 7", expr: "tek_kareler(7)", expected: [1, 9, 25, 49] },
          { label: "n = 0", expr: "tek_kareler(0)", expected: [] },
          { label: "kavrama kullanılmış", codeMatch: "\\[[^\\]]*\\bfor\\b[^\\]]*\\]", codeHint: "[... for ... in ...]" },
          { label: "append yok", codeNot: "append", codeHint: "append kullanılmamalı" }
        ],
        hints: ["Kalıp: [ifade for x in kaynak if koşul].", "İfade x * x, kaynak range(1, n + 1), koşul x % 2 == 1.", "return [x * x for x in range(1, n + 1) if x % 2 == 1]"],
        solution: k`
def tek_kareler(n):
    return [x * x for x in range(1, n + 1) if x % 2 == 1]
`
      }),
      g({
        id: "py8c2", kind: "Yaz", title: "Sözlüğü ters çevir", fn: "ters_sozluk",
        prompt: "`ters_sozluk(d)` anahtarlarla değerlerin yer değiştirdiği yeni bir sözlük döndürsün. Sözlük kavraması kullan.",
        starter: k`
def ters_sozluk(d):
    pass
`,
        tests: [
          { label: "{\"a\": 1, \"b\": 2}", expr: "ters_sozluk({\"a\": 1, \"b\": 2})", expected: { "1": "a", "2": "b" } },
          { label: "anahtar türü korunur", expr: "list(ters_sozluk({\"x\": 10}).keys())[0] + 1", expected: 11 },
          { label: "kavrama kullanılmış", codeMatch: "\\{[^}]*:[^}]*\\bfor\\b", codeHint: "{v: k for ...}" }
        ],
        hints: ["items() ile anahtar-değer çiftlerini al.", "{yeni_anahtar: yeni_değer for ... in ...}", "return {v: k for k, v in d.items()}"],
        solution: k`
def ters_sozluk(d):
    return {v: k for k, v in d.items()}
`
      }),
      g({
        id: "py8c3", kind: "Yaz", title: "Sıralama tablosu", fn: "siralama",
        prompt: "`siralama(ogrenciler)` `(ad, puan)` demetlerini **puana göre azalan**, puanlar eşitse **ada göre alfabetik** sıralayıp yalnızca adların listesini döndürsün.",
        starter: k`
def siralama(ogrenciler):
    pass
`,
        tests: [
          { label: "karışık", expr: "siralama([(\"can\", 70), (\"ada\", 90), (\"ece\", 70), (\"bora\", 85)])", expected: ["ada", "bora", "can", "ece"] },
          { label: "eşitlik", expr: "siralama([(\"zeki\", 50), (\"ayla\", 50)])", expected: ["ayla", "zeki"] },
          { label: "boş", expr: "siralama([])", expected: [] }
        ],
        hints: ["key bir demet döndürebilir; demetler sırayla karşılaştırılır.", "Azalan puan için puanın negatifini kullan: (-puan, ad).", "return [ad for ad, p in sorted(ogrenciler, key=lambda t: (-t[1], t[0]))]"],
        solution: k`
def siralama(ogrenciler):
    sirali = sorted(ogrenciler, key=lambda t: (-t[1], t[0]))
    return [ad for ad, puan in sirali]
`
      })
    ],
    cards: [
      { id: "py8k1", q: "Liste kavramasının genel biçimi?", a: "[ifade for öğe in kaynak if koşul]. Koşul isteğe bağlıdır." },
      { id: "py8k2", q: "Birden çok ölçütle sıralamak?", a: "key'in bir demet döndürmesi: key=lambda x: (-x.puan, x.ad). Azalan sayısal ölçüt için eksi işareti." },
      { id: "py8k3", q: "lambda nedir?", a: "Tek ifadelik isimsiz fonksiyon: lambda x: x * 2." }
    ]
  },

  /* ============================ Python · DERS 9 ============================ */
  {
    id: "py9", no: 9, language: "py", track: "py", title: "Hatalar ve istisnalar", short: "İstisnalar",
    goal: "Hatalarla programı çökertmeden başa çık: try/except/else/finally, istisna fırlatmak ve doğru istisnayı yakalamak.",
    concepts: ["try / except", "else ve finally", "raise", "belirli istisnayı yakalamak", "EAFP"],
    predict: {
      lang: "py",
      code: k`
try:
    x = int("12a")
except ValueError:
    print("hata")
else:
    print("tamam")
finally:
    print("bitti")
`,
      options: ["hata bitti", "hata tamam bitti", "tamam bitti", "Program çöker"], answer: 0,
      why: "int(\"12a\") ValueError fırlatır ve except bloğu çalışır. else yalnızca hata OLMAZSA çalışır. finally her durumda çalışır. Çıktı iki satır: hata, bitti."
    },
    example: {
      title: "Güvenli sayı okuma",
      lang: "py",
      code: k`
def sayi_oku(metin):
    try:
        return int(metin)
    except ValueError:
        print(f"'{metin}' bir sayı değil")
        return None

def yas_ayarla(yas):
    if yas < 0:
        raise ValueError("yaş negatif olamaz")
    return yas

print(sayi_oku("42"), sayi_oku("kırk"))
try:
    yas_ayarla(-3)
except ValueError as e:
    print("yakalandı:", e)
`,
      steps: [
        { lines: [2, 3, 4], text: "Hata çıkabilecek kodu try'a koy; except yalnızca beklediğin hata türünü yakalasın. Çıplak except: tüm hataları (yazım hatalarını bile) yutar." },
        { lines: [10], text: "raise ile kendi kuralını bozan durumda istisna fırlatırsın; çağıran karar verir." },
        { lines: [16], text: "as e ile istisna nesnesine ve mesajına erişirsin." }
      ]
    },
    challenges: [
      g({
        id: "py9c1", kind: "Yaz", title: "Güvenli bölme", fn: "guvenli_bol",
        prompt: "`guvenli_bol(a, b)` a / b sonucunu döndürsün; b sıfırsa çökmesin, `None` döndürsün. `if b == 0` yerine try/except kullan.",
        starter: k`
def guvenli_bol(a, b):
    return a / b
`,
        tests: [
          { label: "10 / 4", expr: "guvenli_bol(10, 4)", expected: 2.5 },
          { label: "1 / 0", expr: "guvenli_bol(1, 0)", expected: null },
          { label: "try kullanılmış", codeMatch: "\\btry\\s*:", codeHint: "try / except" },
          { label: "yalnızca ZeroDivisionError yakalanır", codeMatch: "except\\s+ZeroDivisionError", codeHint: "except ZeroDivisionError:" }
        ],
        hints: ["Sıfıra bölme hangi istisnayı fırlatır? Hata mesajında yazar.", "try: return a / b", "except ZeroDivisionError: return None"],
        solution: k`
def guvenli_bol(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
`
      }),
      g({
        id: "py9c2", kind: "Yaz", title: "Yaş doğrulama", fn: "yas_dogrula",
        prompt: "`yas_dogrula(metin)` metni tam sayıya çevirip döndürsün. Sayı değilse ya da 0–150 aralığında değilse `ValueError` fırlatsın.",
        starter: k`
def yas_dogrula(metin):
    pass
`,
        tests: [
          { label: "\"42\"", expr: "yas_dogrula(\"42\")", expected: 42 },
          { label: "\" 7 \" (boşluklu)", expr: "yas_dogrula(\" 7 \")", expected: 7 },
          { label: "\"kırk\"", expr: "yas_dogrula(\"kırk\")", throws: "ValueError" },
          { label: "\"-1\"", expr: "yas_dogrula(\"-1\")", throws: "ValueError" },
          { label: "\"200\"", expr: "yas_dogrula(\"200\")", throws: "ValueError" }
        ],
        hints: ["int() geçersiz metinde zaten ValueError fırlatır; boşlukları da tolere eder.", "Aralık kontrolü için kendin raise et.", "y = int(metin); if not 0 <= y <= 150: raise ValueError(\"aralık dışı\"); return y"],
        solution: k`
def yas_dogrula(metin):
    yas = int(metin)
    if not 0 <= yas <= 150:
        raise ValueError("yaş 0 ile 150 arasında olmalı")
    return yas
`
      }),
      g({
        id: "py9c3", kind: "Yaz", title: "Kirli veriyi topla", fn: "temiz_toplam",
        prompt: "`temiz_toplam(degerler)` metin listesindeki tam sayıya çevrilebilen değerleri toplasın, çevrilemeyenleri atlasın. `(toplam, atlanan_sayisi)` döndürsün.",
        starter: k`
def temiz_toplam(degerler):
    pass
`,
        tests: [
          { label: "[\"3\", \"x\", \"4\"]", expr: "temiz_toplam([\"3\", \"x\", \"4\"])", expected: [7, 1] },
          { label: "boşluk ve eksi", expr: "temiz_toplam([\" 10\", \"-2\", \"\", \"3.5\"])", expected: [8, 2] },
          { label: "boş", expr: "temiz_toplam([])", expected: [0, 0] }
        ],
        hints: ["Her değeri try içinde int() ile çevir.", "ValueError olursa atlanan sayacını artır ve devam et.", "return toplam, atlanan"],
        solution: k`
def temiz_toplam(degerler):
    toplam, atlanan = 0, 0
    for d in degerler:
        try:
            toplam += int(d)
        except ValueError:
            atlanan += 1
    return toplam, atlanan
`
      })
    ],
    cards: [
      { id: "py9k1", q: "try/except'te else ve finally ne zaman çalışır?", a: "else yalnızca hata olmazsa, finally her durumda (hata olsa da olmasa da)." },
      { id: "py9k2", q: "Neden çıplak except: yazılmaz?", a: "Tüm hataları yutar; yazım hatalarını ve Ctrl+C'yi bile gizler. Beklediğin istisnayı adıyla yakala." },
      { id: "py9k3", q: "Kendi kuralın bozulduğunda ne yaparsın?", a: "raise ValueError(\"açıklama\") gibi uygun bir istisna fırlatırsın." }
    ]
  },

  /* ============================ Python · DERS 10 ============================ */
  {
    id: "py10", no: 10, language: "py", track: "py", title: "Mini proje: komut satırı programları", short: "Mini proje",
    goal: "Öğrendiklerini birleştir: girdiyi satır satır oku, komutları ayrıştır, durumu tut ve biçimli çıktı üret.",
    concepts: ["sys.stdin ile satır satır okuma", "komut ayrıştırma", "durum tutan program", "biçimli çıktı"],
    predict: {
      lang: "py",
      code: k`
satir = "ekle  süt al "
komut, _, arg = satir.strip().partition(" ")
print(komut, "|", arg.strip())
`,
      options: ["ekle | süt al", "ekle | süt", "ekle süt al |", "Hata verir"], answer: 0,
      why: "strip baştaki/sondaki boşlukları atar: \"ekle  süt al\". partition(\" \") ilk boşluktan ikiye böler: (\"ekle\", \" \", \" süt al\"). arg.strip() → \"süt al\"."
    },
    example: {
      title: "Satır satır okuyan program",
      lang: "py",
      stdin: "elma 3\nmuz 5\nelma 2\n",
      code: k`
import sys

stok = {}
for satir in sys.stdin:
    satir = satir.strip()
    if not satir:
        continue
    urun, adet = satir.split()
    stok[urun] = stok.get(urun, 0) + int(adet)

for urun, adet in sorted(stok.items()):
    print(f"{urun}: {adet}")
`,
      steps: [
        { lines: [4], text: "sys.stdin üzerinde döngü, girdinin her satırını sırayla verir; girdi bitince döngü biter. Kaç satır geleceğini bilmen gerekmez." },
        { lines: [5, 6, 7], text: "Satır sonunu ve boş satırları temizle." },
        { lines: [8], text: "Demet açma: \"elma 3\".split() → [\"elma\", \"3\"]." },
        { lines: [11, 12], text: "Çıktıyı sıralı ve biçimli yaz. Çıktı: elma: 5, muz: 5." }
      ]
    },
    challenges: [
      g({
        id: "py10c1", kind: "Yaz", title: "Not raporu", fn: "main", mode: "stdout",
        prompt: "İlk satırda öğrenci sayısı n, sonraki n satırda `ad puan` var. Üç satır yazdır:\n`Ortalama: 72.50` (2 basamak), `En yüksek: Ece (90)`, `Geçen: 3/4` (50 ve üzeri geçer).",
        starter: k`
n = int(input())
`,
        tests: [
          { label: "dört öğrenci", stdin: "4\nAli 45\nEce 90\nCan 75\nAda 80\n", stdout: "Ortalama: 72.50\nEn yüksek: Ece (90)\nGeçen: 3/4" },
          { label: "tek öğrenci", stdin: "1\nZeynep 49\n", stdout: "Ortalama: 49.00\nEn yüksek: Zeynep (49)\nGeçen: 0/1" }
        ],
        hints: ["n kez input() ile satır oku; ad, puan = input().split()", "Puanları listede, en yüksek olanı ayrıca tut.", "f\"Ortalama: {ortalama:.2f}\" iki basamak yazar."],
        solution: k`
n = int(input())
kayitlar = []
for _ in range(n):
    ad, puan = input().split()
    kayitlar.append((ad, int(puan)))

ortalama = sum(p for _, p in kayitlar) / n
en_ad, en_puan = max(kayitlar, key=lambda k: k[1])
gecen = sum(1 for _, p in kayitlar if p >= 50)
print(f"Ortalama: {ortalama:.2f}")
print(f"En yüksek: {en_ad} ({en_puan})")
print(f"Geçen: {gecen}/{n}")
`
      }),
      g({
        id: "py10c2", kind: "Yaz", title: "Yapılacaklar listesi", fn: "main", mode: "stdout",
        prompt: "Girdi bitene kadar komut oku: `ekle <iş>` işi listeye ekler, `bitir <no>` o işi tamamlandı işaretler (1'den başlar), `liste` her işi `1. [x] süt al` / `2. [ ] ekmek` biçiminde yazar. Geçersiz numarada `Geçersiz numara` yaz.",
        starter: k`
import sys

isler = []
for satir in sys.stdin:
    pass
`,
        tests: [
          { label: "temel akış", stdin: "ekle süt al\nekle ekmek\nbitir 1\nliste\n", stdout: "1. [x] süt al\n2. [ ] ekmek" },
          { label: "geçersiz numara", stdin: "ekle kod yaz\nbitir 5\nliste\n", stdout: "Geçersiz numara\n1. [ ] kod yaz" },
          { label: "iki kez liste", stdin: "ekle a\nliste\nbitir 1\nliste\n", stdout: "1. [ ] a\n1. [x] a" }
        ],
        hints: ["Her işi [metin, bitti_mi] gibi bir çift olarak tut.", "komut, _, arg = satir.strip().partition(\" \")", "bitir için: i = int(arg) - 1; 0 <= i < len(isler) değilse 'Geçersiz numara'. enumerate(isler, 1) numaralı dolaşır."],
        solution: k`
import sys

isler = []
for satir in sys.stdin:
    komut, _, arg = satir.strip().partition(" ")
    if komut == "ekle":
        isler.append([arg.strip(), False])
    elif komut == "bitir":
        i = int(arg) - 1
        if 0 <= i < len(isler):
            isler[i][1] = True
        else:
            print("Geçersiz numara")
    elif komut == "liste":
        for no, (metin, bitti) in enumerate(isler, 1):
            print(f"{no}. [{'x' if bitti else ' '}] {metin}")
`
      }),
      g({
        id: "py10c3", kind: "Yaz", title: "Banka hesabı", fn: "main", mode: "stdout",
        prompt: "Bakiye 0 ile başlar. Komutlar: `yatir <tutar>`, `cek <tutar>` (bakiye yetmezse `Yetersiz bakiye` yaz ve işlemi yapma), `bakiye` (`Bakiye: 70 TL` yaz). Tutar pozitif tam sayı değilse `Geçersiz tutar` yaz.",
        starter: k`
import sys

bakiye = 0
for satir in sys.stdin:
    pass
`,
        tests: [
          { label: "yatır, çek, bakiye", stdin: "yatir 100\ncek 30\nbakiye\n", stdout: "Bakiye: 70 TL" },
          { label: "yetersiz bakiye", stdin: "yatir 20\ncek 50\nbakiye\n", stdout: "Yetersiz bakiye\nBakiye: 20 TL" },
          { label: "geçersiz tutar", stdin: "yatir abc\nyatir -5\nyatir 5\nbakiye\n", stdout: "Geçersiz tutar\nGeçersiz tutar\nBakiye: 5 TL" }
        ],
        hints: ["Önce komutu ve argümanı ayır.", "Tutarı try/except ValueError ile int'e çevir; ayrıca tutar <= 0 da geçersiz.", "Geçersizse 'Geçersiz tutar' yazıp continue; sonra komuta göre işlem yap."],
        solution: k`
import sys

bakiye = 0
for satir in sys.stdin:
    parcalar = satir.split()
    if not parcalar:
        continue
    komut = parcalar[0]
    if komut == "bakiye":
        print(f"Bakiye: {bakiye} TL")
        continue
    try:
        tutar = int(parcalar[1])
        if tutar <= 0:
            raise ValueError
    except (ValueError, IndexError):
        print("Geçersiz tutar")
        continue
    if komut == "yatir":
        bakiye += tutar
    elif komut == "cek":
        if tutar > bakiye:
            print("Yetersiz bakiye")
        else:
            bakiye -= tutar
`
      })
    ],
    cards: [
      { id: "py10k1", q: "Girdiyi satır sayısını bilmeden sonuna kadar okumak?", a: "for satir in sys.stdin: — girdi bitince döngü biter." },
      { id: "py10k2", q: "f\"{x:.2f}\" ne yapar?", a: "x'i virgülden sonra 2 basamakla yazar (72.5 → 72.50)." },
      { id: "py10k3", q: "enumerate(liste, 1) ne verir?", a: "(1, ilk), (2, ikinci), … biçiminde numara-eleman çiftleri." }
    ]
  }
  ];

  window.KD_CURRICULUM = (window.KD_CURRICULUM || []).concat(PY);
})();
