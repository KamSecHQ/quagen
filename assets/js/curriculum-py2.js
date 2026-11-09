/* QUAGEN NextGen — Müfredat: Python ile veri ve otomasyon, Faz 11–20 (dil: Python, parkur: py2) */
(function () {
  const k = (s, ...v) => String.raw(s, ...v).replace(/^\n/, "").replace(/\s+$/, "") + "\n";
  const g = (o) => Object.assign({ lang: "py" }, o);

  const PY2 = [
  /* ============================ Python · FAZ 11 ============================ */
  {
    id: "py11", no: 11, language: "py", track: "py2", title: "Sınıflar ve nesneler", short: "Sınıflar",
    goal: "Veriyi ve onu değiştiren davranışı bir arada tut: class, __init__, self, nesne ve sınıf özellikleri.",
    concepts: ["class ve __init__", "self", "metotlar", "nesne özelliği / sınıf özelliği", "başvuru (referans)"],
    predict: {
      lang: "py",
      code: k`
class Kopek:
    def __init__(self, ad):
        self.ad = ad

a = Kopek("Karabaş")
b = a
b.ad = "Pamuk"
print(a.ad)
`,
      options: ["Pamuk", "Karabaş", "Hata verir", "None"], answer: 0,
      why: "b = a yeni bir köpek oluşturmaz; aynı nesneye ikinci bir ad verir. b üzerinden yapılan değişiklik a'da da görünür. Yeni nesne yalnızca Kopek(...) çağrısıyla oluşur."
    },
    example: {
      title: "Bir sınıf tanımlamak",
      lang: "py",
      code: k`
class Sayac:
    toplam_sayac = 0              # sınıf özelliği: tüm nesneler paylaşır

    def __init__(self, ad):
        self.ad = ad              # nesne özelliği: her nesnenin kendi değeri
        self.deger = 0
        Sayac.toplam_sayac += 1

    def artir(self, adim=1):
        self.deger += adim
        return self.deger

adim = Sayac("adım")
kalori = Sayac("kalori")
adim.artir(); adim.artir(5)
kalori.artir(120)
print(adim.ad, adim.deger, kalori.deger, Sayac.toplam_sayac)
`,
      steps: [
        { lines: [4], text: "__init__ nesne oluşturulurken çalışır. self, oluşturulan nesnenin kendisidir." },
        { lines: [5, 6], text: "self.x = ... nesneye özel bir özellik oluşturur." },
        { lines: [2, 7], text: "Sınıf gövdesine yazılan özellik tüm nesnelerce paylaşılır." },
        { lines: [14, 15], text: "adim.artir(5) aslında Sayac.artir(adim, 5) demektir; self otomatik geçer. Çıktı: adım 6 120 2." }
      ]
    },
    challenges: [
      g({
        id: "py11c1", kind: "Yaz", title: "Banka hesabı sınıfı", fn: "Hesap",
        prompt: "`Hesap(sahip)` sınıfı yaz: `bakiye` 0 ile başlar; `yatir(tutar)` ve `cek(tutar)` bakiyeyi güncelleyip yeni bakiyeyi döndürür. Tutar pozitif değilse ya da çekilecek tutar bakiyeyi aşıyorsa `ValueError` fırlatır.",
        starter: k`
class Hesap:
    pass
`,
        tests: [
          { label: "yatır ve çek", setup: "h = Hesap(\"Ada\")\nh.yatir(100)\nh.cek(30)", expr: "[h.sahip, h.bakiye]", expected: ["Ada", 70] },
          { label: "yeni bakiye döner", setup: "h = Hesap(\"Can\")", expr: "h.yatir(50)", expected: 50 },
          { label: "fazla çekim", setup: "h = Hesap(\"Ece\")\nh.yatir(10)", expr: "h.cek(11)", throws: "ValueError" },
          { label: "negatif yatırma", setup: "h = Hesap(\"Ece\")", expr: "h.yatir(-5)", throws: "ValueError" },
          { label: "hesaplar birbirinden bağımsız", setup: "a = Hesap(\"a\")\nb = Hesap(\"b\")\na.yatir(5)", expr: "b.bakiye", expected: 0 }
        ],
        hints: ["__init__(self, sahip) içinde self.sahip ve self.bakiye özelliklerini oluştur.", "Her metot ilk parametre olarak self alır.", "def cek(self, tutar): if tutar <= 0 or tutar > self.bakiye: raise ValueError(...)"],
        solution: k`
class Hesap:
    def __init__(self, sahip):
        self.sahip = sahip
        self.bakiye = 0

    def yatir(self, tutar):
        if tutar <= 0:
            raise ValueError("tutar pozitif olmalı")
        self.bakiye += tutar
        return self.bakiye

    def cek(self, tutar):
        if tutar <= 0 or tutar > self.bakiye:
            raise ValueError("geçersiz tutar ya da yetersiz bakiye")
        self.bakiye -= tutar
        return self.bakiye
`
      }),
      g({
        id: "py11c2", kind: "Yaz", title: "Dikdörtgen", fn: "Dikdortgen",
        prompt: "`Dikdortgen(en, boy)` sınıfı: `alan()`, `cevre()` ve `kare_mi()` metotları olsun. `olcekle(k)` en ve boyu k ile çarpıp **nesnenin kendisini** döndürsün (zincirlenebilsin).",
        starter: k`
class Dikdortgen:
    def __init__(self, en, boy):
        self.en = en
        self.boy = boy
`,
        tests: [
          { label: "alan ve çevre", setup: "d = Dikdortgen(3, 4)", expr: "[d.alan(), d.cevre()]", expected: [12, 14] },
          { label: "kare mi", expr: "[Dikdortgen(2, 2).kare_mi(), Dikdortgen(2, 3).kare_mi()]", expected: [true, false] },
          { label: "zincirleme", expr: "Dikdortgen(1, 2).olcekle(3).olcekle(2).alan()", expected: 72 }
        ],
        hints: ["Metotlar self.en ve self.boy'u kullanır.", "Zincirleme için olcekle return self yapmalı.", "def olcekle(self, k): self.en *= k; self.boy *= k; return self"],
        solution: k`
class Dikdortgen:
    def __init__(self, en, boy):
        self.en = en
        self.boy = boy

    def alan(self):
        return self.en * self.boy

    def cevre(self):
        return 2 * (self.en + self.boy)

    def kare_mi(self):
        return self.en == self.boy

    def olcekle(self, k):
        self.en *= k
        self.boy *= k
        return self
`
      }),
      g({
        id: "py11c3", kind: "Hata Ayıkla", title: "Ortak sepet", fn: "Sepet",
        prompt: "Her müşterinin kendi sepeti olmalı, ama birine eklenen ürün herkesin sepetinde görünüyor. Neden? Düzelt.",
        starter: k`
class Sepet:
    urunler = []

    def ekle(self, urun):
        self.urunler.append(urun)
        return len(self.urunler)
`,
        tests: [
          { label: "sepetler ayrı", setup: "a = Sepet()\nb = Sepet()\na.ekle(\"elma\")", expr: "b.urunler", expected: [] },
          { label: "ekle sayıyı döndürür", setup: "a = Sepet()\na.ekle(\"x\")", expr: "a.ekle(\"y\")", expected: 2 }
        ],
        hints: ["urunler sınıf gövdesinde tanımlanmış: sınıf özelliği mi, nesne özelliği mi?", "Tek bir liste tüm nesneler arasında paylaşılıyor (Faz 4'teki varsayılan liste tuzağının kuzeni).", "__init__ içinde self.urunler = [] oluştur."],
        solution: k`
class Sepet:
    def __init__(self):
        self.urunler = []

    def ekle(self, urun):
        self.urunler.append(urun)
        return len(self.urunler)
`
      })
    ],
    cards: [
      { id: "py11k1", q: "self nedir?", a: "Metodu çağrılan nesnenin kendisi. a.f(x), Sinif.f(a, x) ile aynıdır." },
      { id: "py11k2", q: "Sınıf gövdesinde tanımlanan liste neden tehlikelidir?", a: "Sınıf özelliğidir; tüm nesneler aynı listeyi paylaşır. Nesneye özel liste __init__ içinde self.x = [] ile oluşturulur." },
      { id: "py11k3", q: "Metot zincirlemesi nasıl sağlanır?", a: "Metot return self ile nesnenin kendisini döndürür: d.olcekle(2).olcekle(3)." }
    ]
  },

  /* ============================ Python · FAZ 12 ============================ */
  {
    id: "py12", no: 12, language: "py", track: "py2", title: "Özel metotlar ve veri modeli", short: "Özel metotlar",
    goal: "Kendi türlerini Python'un yerleşik türleri gibi davranır hâle getir: yazdırma, karşılaştırma, toplama, kümede kullanma.",
    concepts: ["__repr__ ve __str__", "__eq__ ve __hash__", "__lt__ ve sıralama", "__add__", "__len__"],
    predict: {
      lang: "py",
      code: k`
class V:
    def __init__(self, x):
        self.x = x
    def __add__(self, o):
        return V(self.x + o.x)

print((V(2) + V(3)).x)
`,
      options: ["5", "23", "Hata verir", "None"], answer: 0,
      why: "a + b yazdığında Python a.__add__(b) çağırır. __add__ yeni bir V(5) döndürür; .x ile değeri 5."
    },
    example: {
      title: "Para türü",
      lang: "py",
      code: k`
class Para:
    def __init__(self, kurus):
        self.kurus = kurus

    def __repr__(self):
        return f"Para({self.kurus / 100:.2f} TL)"

    def __add__(self, diger):
        return Para(self.kurus + diger.kurus)

    def __eq__(self, diger):
        return isinstance(diger, Para) and self.kurus == diger.kurus

    def __lt__(self, diger):
        return self.kurus < diger.kurus

print(Para(150) + Para(275))
print(Para(100) == Para(100), sorted([Para(500), Para(20)]))
`,
      steps: [
        { lines: [5, 6], text: "__repr__ nesnenin metin gösterimidir; print ve liste içinde görünür. Yazılmasaydı <__main__.Para object at 0x…> görürdün." },
        { lines: [8, 9], text: "__add__ + işlecini tanımlar." },
        { lines: [11, 12], text: "__eq__ olmadan iki ayrı nesne, değerleri aynı olsa bile eşit sayılmaz (kimlik karşılaştırılır)." },
        { lines: [14, 15, 18], text: "__lt__ (küçüktür) tanımlanınca sorted bu türü sıralayabilir." }
      ]
    },
    challenges: [
      g({
        id: "py12c1", kind: "Yaz", title: "Kesir", fn: "Kesir",
        prompt: "`Kesir(pay, payda)` her zaman sadeleşmiş tutulsun (`math.gcd`). `repr` `3/4` biçiminde olsun; `+` ve `==` çalışsın.",
        starter: k`
import math

class Kesir:
    def __init__(self, pay, payda):
        self.pay = pay
        self.payda = payda
`,
        tests: [
          { label: "sadeleşir", expr: "repr(Kesir(6, 8))", expected: "3/4" },
          { label: "toplama", expr: "repr(Kesir(1, 2) + Kesir(1, 3))", expected: "5/6" },
          { label: "eşitlik", expr: "Kesir(2, 4) == Kesir(1, 2)", expected: true },
          { label: "eşit değil", expr: "Kesir(1, 3) == Kesir(1, 2)", expected: false },
          { label: "tam sayıya iner", expr: "repr(Kesir(1, 2) + Kesir(1, 2))", expected: "1/1" }
        ],
        hints: ["__init__ içinde ebob = math.gcd(pay, payda) ile ikisini de böl.", "a/b + c/d = (a·d + c·b) / (b·d); sonucu Kesir(...) olarak döndür, sadeleşme __init__'te olur.", "__eq__: pay ve payda eşit mi? (zaten sadeleşmiş oldukları için yeterli)"],
        solution: k`
import math

class Kesir:
    def __init__(self, pay, payda):
        ebob = math.gcd(pay, payda)
        self.pay = pay // ebob
        self.payda = payda // ebob

    def __repr__(self):
        return f"{self.pay}/{self.payda}"

    def __add__(self, o):
        return Kesir(self.pay * o.payda + o.pay * self.payda, self.payda * o.payda)

    def __eq__(self, o):
        return isinstance(o, Kesir) and self.pay == o.pay and self.payda == o.payda
`
      }),
      g({
        id: "py12c2", kind: "Hata Ayıkla", title: "Kümeye girmeyen nokta", fn: "Nokta",
        prompt: "`Nokta` sınıfına `__eq__` eklendi ama artık kümede ve sözlük anahtarında kullanılamıyor (`TypeError: unhashable type`). Düzelt: eşit noktalar kümede tek eleman sayılmalı.",
        starter: k`
class Nokta:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, o):
        return isinstance(o, Nokta) and (self.x, self.y) == (o.x, o.y)
`,
        tests: [
          { label: "kümede tekrar yok", expr: "len({Nokta(1, 2), Nokta(1, 2), Nokta(2, 1)})", expected: 2 },
          { label: "sözlük anahtarı", setup: "d = {Nokta(0, 0): \"merkez\"}", expr: "d[Nokta(0, 0)]", expected: "merkez" },
          { label: "eşitlik", expr: "Nokta(3, 4) == Nokta(3, 4)", expected: true }
        ],
        hints: ["__eq__ tanımlayan sınıfın __hash__'i Python tarafından kaldırılır.", "Eşit nesnelerin hash'i de eşit olmalı.", "def __hash__(self): return hash((self.x, self.y))"],
        solution: k`
class Nokta:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, o):
        return isinstance(o, Nokta) and (self.x, self.y) == (o.x, o.y)

    def __hash__(self):
        return hash((self.x, self.y))
`
      }),
      g({
        id: "py12c3", kind: "Yaz", title: "Sıralanabilir oyuncular", fn: "Oyuncu",
        prompt: "`Oyuncu(ad, puan)` nesneleri `sorted()` ile **puana göre artan**, eşitse ada göre sıralanabilsin (`__lt__`). `len(oyuncu)` adın uzunluğunu versin (`__len__`).",
        starter: k`
class Oyuncu:
    def __init__(self, ad, puan):
        self.ad = ad
        self.puan = puan
`,
        tests: [
          { label: "sıralama", expr: "[o.ad for o in sorted([Oyuncu(\"ece\", 30), Oyuncu(\"ali\", 10), Oyuncu(\"can\", 30)])]", expected: ["ali", "can", "ece"] },
          { label: "min ve max da çalışır", expr: "max([Oyuncu(\"a\", 1), Oyuncu(\"b\", 9)]).ad", expected: "b" },
          { label: "len", expr: "len(Oyuncu(\"zeynep\", 0))", expected: 6 }
        ],
        hints: ["sorted, min ve max yalnızca < işlecine ihtiyaç duyar.", "Demetlerin karşılaştırmasından yararlan: (puan, ad).", "def __lt__(self, o): return (self.puan, self.ad) < (o.puan, o.ad)"],
        solution: k`
class Oyuncu:
    def __init__(self, ad, puan):
        self.ad = ad
        self.puan = puan

    def __lt__(self, o):
        return (self.puan, self.ad) < (o.puan, o.ad)

    def __len__(self):
        return len(self.ad)
`
      })
    ],
    cards: [
      { id: "py12k1", q: "__repr__ ne işe yarar?", a: "Nesnenin geliştiriciye yönelik metin gösterimi; print, hata ayıklama ve liste içinde görünür." },
      { id: "py12k2", q: "__eq__ tanımlayınca neden __hash__ de gerekir?", a: "Python __eq__ tanımlanan sınıfın hash'ini kaldırır; eşit nesnelerin hash'i eşit olmalı. hash((alanlar)) ile tanımlanır." },
      { id: "py12k3", q: "sorted bir sınıfı sıralamak için hangi metoda ihtiyaç duyar?", a: "__lt__ (küçüktür)." }
    ]
  },

  /* ============================ Python · FAZ 13 ============================ */
  {
    id: "py13", no: 13, language: "py", track: "py2", title: "collections: Counter, defaultdict, deque", short: "collections",
    goal: "Standart kütüphanenin hazır veri yapılarıyla sayma, gruplama ve kuyruk işlerini kısa ve hızlı yap.",
    concepts: ["Counter ve most_common", "defaultdict", "deque ve maxlen", "namedtuple"],
    predict: {
      lang: "py",
      code: k`
from collections import Counter
c = Counter("kodera kod")
print(c["k"], c["z"], c.most_common(1)[0][1])
`,
      options: ["2 0 2", "2 KeyError", "1 0 2", "2 None 2"], answer: 0,
      why: "Counter her karakteri sayar: k 2 kez. Olmayan anahtar için hata vermez, 0 döndürür. most_common(1) en sık elemanı (karakter, adet) olarak verir; adet 2."
    },
    example: {
      title: "Kısa ve hızlı kalıplar",
      lang: "py",
      code: k`
from collections import Counter, defaultdict, deque

oylar = ["python", "c", "python", "js", "python", "c"]
print(Counter(oylar).most_common(2))

sehirlere_gore = defaultdict(list)
for ad, sehir in [("ada", "izmir"), ("can", "ankara"), ("ece", "izmir")]:
    sehirlere_gore[sehir].append(ad)
print(dict(sehirlere_gore))

son_uc = deque(maxlen=3)
for olay in ["giriş", "ara", "sepet", "ödeme"]:
    son_uc.append(olay)
print(list(son_uc))
`,
      steps: [
        { lines: [4], text: "Counter, Faz 7'deki get(..., 0) + 1 kalıbının hazır hâli. most_common sıralı sonuç verir." },
        { lines: [6, 8], text: "defaultdict(list) olmayan anahtara ilk erişimde otomatik boş liste koyar; setdefault'a gerek kalmaz." },
        { lines: [11, 13], text: "deque iki uçtan O(1) ekleme/çıkarma yapar; maxlen dolunca en eski eleman düşer. Çıktı: ['ara', 'sepet', 'ödeme']." }
      ]
    },
    challenges: [
      g({
        id: "py13c1", kind: "Yaz", title: "En sık kelimeler", fn: "en_sik",
        prompt: "`en_sik(metin, n)` metindeki (küçük harfe çevrilmiş, boşluktan bölünmüş) en sık n kelimeyi `[(kelime, adet), …]` olarak döndürsün. Counter kullan.",
        starter: k`
from collections import Counter

def en_sik(metin, n):
    pass
`,
        tests: [
          { label: "ilk iki", expr: "en_sik(\"a b a c b a\", 2)", expected: [["a", 3], ["b", 2]] },
          { label: "büyük harf", expr: "en_sik(\"Kod kod KOD test\", 1)", expected: [["kod", 3]] },
          { label: "Counter kullanılmış", codeMatch: "Counter\\(", codeHint: "Counter(...)" }
        ],
        hints: ["Counter'a kelime listesini ver.", "most_common(n) tam istenen biçimi döndürür.", "return Counter(metin.lower().split()).most_common(n)"],
        solution: k`
from collections import Counter

def en_sik(metin, n):
    return Counter(metin.lower().split()).most_common(n)
`
      }),
      g({
        id: "py13c2", kind: "Yaz", title: "Anagram grupları", fn: "anagram_gruplari",
        prompt: "`anagram_gruplari(kelimeler)` aynı harflerden oluşan kelimeleri gruplasın. Her grubun içi alfabetik, gruplar ilk elemanlarına göre alfabetik sıralı bir liste döndür.",
        starter: k`
from collections import defaultdict

def anagram_gruplari(kelimeler):
    pass
`,
        tests: [
          { label: "klasik", expr: "anagram_gruplari([\"kalem\", \"melak\", \"sel\", \"les\", \"kemal\"])", expected: [["kalem", "kemal", "melak"], ["les", "sel"]] },
          { label: "tek kelimeler", expr: "anagram_gruplari([\"b\", \"a\"])", expected: [["a"], ["b"]] },
          { label: "boş", expr: "anagram_gruplari([])", expected: [] }
        ],
        hints: ["İki kelime anagramsa harflerini sıraladığında aynı metni elde edersin.", "Anahtar: \"\".join(sorted(kelime)); gruplar = defaultdict(list).", "return sorted(sorted(g) for g in gruplar.values())"],
        solution: k`
from collections import defaultdict

def anagram_gruplari(kelimeler):
    gruplar = defaultdict(list)
    for k in kelimeler:
        gruplar["".join(sorted(k))].append(k)
    return sorted(sorted(g) for g in gruplar.values())
`
      }),
      g({
        id: "py13c3", kind: "Yaz", title: "Kayan ortalama", fn: "kayan_ortalama",
        prompt: "`kayan_ortalama(sayilar, k)` her konumda son k sayının ortalamasını (ilk k − 1 konum hariç) liste olarak döndürsün. `deque(maxlen=k)` ve süren bir toplam kullan; her adımda yeniden toplama.",
        starter: k`
from collections import deque

def kayan_ortalama(sayilar, k):
    pass
`,
        tests: [
          { label: "[1..6], 3", expr: "kayan_ortalama([1, 2, 3, 4, 5, 6], 3)", expected: [2, 3, 4, 5] },
          { label: "k = 1", expr: "kayan_ortalama([4, 8], 1)", expected: [4, 8] },
          { label: "yetersiz veri", expr: "kayan_ortalama([1, 2], 3)", expected: [] },
          { label: "büyük veri (hızlı)", setup: "s = list(range(200000))", expr: "kayan_ortalama(s, 1000)[-1]", expected: 199499.5 }
        ],
        hints: ["Pencere dolunca yeni eleman eklemeden önce düşecek elemanı toplamdan çıkar.", "if len(pencere) == k: toplam -= pencere[0]", "Ekle, toplama kat; len(pencere) == k ise toplam / k sonuca eklenir."],
        solution: k`
from collections import deque

def kayan_ortalama(sayilar, k):
    pencere = deque(maxlen=k)
    toplam = 0
    sonuc = []
    for x in sayilar:
        if len(pencere) == k:
            toplam -= pencere[0]
        pencere.append(x)
        toplam += x
        if len(pencere) == k:
            sonuc.append(toplam / k)
    return sonuc
`
      })
    ],
    cards: [
      { id: "py13k1", q: "Counter'da olmayan bir anahtara erişince ne olur?", a: "Hata vermez, 0 döner." },
      { id: "py13k2", q: "defaultdict(list) ne sağlar?", a: "Olmayan anahtara ilk erişimde otomatik boş liste oluşturur: d[k].append(x) doğrudan çalışır." },
      { id: "py13k3", q: "Listenin başından eleman çıkarmak neden yavaştır, alternatifi?", a: "list.pop(0) tüm elemanları kaydırır: O(n). deque.popleft() O(1)." }
    ]
  },

  /* ============================ Python · FAZ 14 ============================ */
  {
    id: "py14", no: 14, language: "py", track: "py2", title: "Yineleyiciler ve üreteçler", short: "Üreteçler",
    goal: "Değerleri ihtiyaç anında üret: yield, tembel değerlendirme, sonsuz diziler ve itertools.",
    concepts: ["yield", "tembel (lazy) değerlendirme", "yield from", "üreteç ifadesi", "itertools.islice"],
    predict: {
      lang: "py",
      code: k`
def say():
    print("başla")
    yield 1
    yield 2

g = say()
print("önce")
print(next(g))
`,
      options: ["önce başla 1", "başla önce 1", "önce 1", "başla 1 2"], answer: 0,
      why: "yield içeren fonksiyon çağrılınca gövdesi hemen çalışmaz; bir üreteç nesnesi döner. Gövde ancak next() istendiğinde, ilk yield'e kadar çalışır. Bu yüzden önce 'önce', sonra 'başla' ve 1."
    },
    example: {
      title: "Tembel boru hattı",
      lang: "py",
      code: k`
from itertools import islice

def kareler():
    n = 1
    while True:
        yield n * n
        n += 1

ciftler = (x for x in kareler() if x % 2 == 0)
print(list(islice(ciftler, 5)))

toplam = sum(x for x in range(1_000_000))
print(toplam)
`,
      steps: [
        { lines: [3, 4, 5, 6, 7], text: "Sonsuz bir dizi: while True ama sorun yok, çünkü değerler yalnızca istendiği kadar üretilir." },
        { lines: [9], text: "Üreteç ifadesi: köşeli değil yuvarlak parantez. Liste oluşturmaz, eleman eleman akıtır." },
        { lines: [10], text: "islice ilk 5 elemanı alır ve durur. Çıktı: [4, 16, 36, 64, 100]." },
        { lines: [12], text: "sum'a üreteç vermek milyon elemanlık bir liste oluşturmadan toplar: bellek sabit kalır." }
      ]
    },
    challenges: [
      g({
        id: "py14c1", kind: "Yaz", title: "Fibonacci üreteci", fn: "fibonacci",
        prompt: "`fibonacci()` 0, 1, 1, 2, 3, 5, … dizisini **sonsuza kadar** üreten bir üreteç olsun (`yield`).",
        starter: k`
def fibonacci():
    pass
`,
        tests: [
          { label: "ilk 10", setup: "from itertools import islice", expr: "list(islice(fibonacci(), 10))", expected: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34] },
          { label: "100. eleman", setup: "from itertools import islice", expr: "next(islice(fibonacci(), 100, None))", expected: 354224848179261915075 },
          { label: "üreteç", expr: "type(fibonacci()).__name__", expected: "generator" }
        ],
        hints: ["İki değişken tut: a, b = 0, 1.", "Sonsuz döngüde a'yı yield et, sonra kaydır.", "while True: yield a; a, b = b, a + b"],
        solution: k`
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b
`
      }),
      g({
        id: "py14c2", kind: "Yaz", title: "Kayan pencereler", fn: "pencereler",
        prompt: "`pencereler(dizi, n)` ardışık n elemanlık pencereleri **demet** olarak tek tek üretsin: `[1, 2, 3, 4], 2` → `(1, 2), (2, 3), (3, 4)`.",
        starter: k`
def pencereler(dizi, n):
    pass
`,
        tests: [
          { label: "n = 2", expr: "list(pencereler([1, 2, 3, 4], 2))", expected: [[1, 2], [2, 3], [3, 4]] },
          { label: "n = 3, metin", expr: "list(pencereler(\"kod\", 3))", expected: [["k", "o", "d"]] },
          { label: "n büyük", expr: "list(pencereler([1], 2))", expected: [] },
          { label: "demet üretir", expr: "type(next(pencereler([1, 2], 1))).__name__", expected: "tuple" },
          { label: "yield kullanılmış", codeMatch: "\\byield\\b", codeHint: "yield" }
        ],
        hints: ["Başlangıç indeksleri 0'dan len(dizi) − n'e kadar.", "Her başlangıçta dilimi demete çevir: tuple(dizi[i:i + n]).", "for i in range(len(dizi) - n + 1): yield tuple(dizi[i:i + n])"],
        solution: k`
def pencereler(dizi, n):
    for i in range(len(dizi) - n + 1):
        yield tuple(dizi[i:i + n])
`
      }),
      g({
        id: "py14c3", kind: "Yaz", title: "İç içe listeyi düzleştir", fn: "duzlestir",
        prompt: "`duzlestir(veri)` her derinlikte iç içe listelerdeki elemanları sırayla üretsin. Özyinelemeli bir üreteç ve `yield from` kullan.",
        starter: k`
def duzlestir(veri):
    pass
`,
        tests: [
          { label: "derin", expr: "list(duzlestir([1, [2, [3, [4]], 5], [], 6]))", expected: [1, 2, 3, 4, 5, 6] },
          { label: "metinler bölünmez", expr: "list(duzlestir([\"ab\", [\"cd\"]]))", expected: ["ab", "cd"] },
          { label: "boş", expr: "list(duzlestir([]))", expected: [] },
          { label: "yield from kullanılmış", codeMatch: "yield\\s+from", codeHint: "yield from" }
        ],
        hints: ["Her eleman ya bir listedir ya da değildir: isinstance(x, list).", "Listeyse onu da düzleştir ve ürettiklerini aynen aktar.", "if isinstance(x, list): yield from duzlestir(x) else: yield x"],
        solution: k`
def duzlestir(veri):
    for x in veri:
        if isinstance(x, list):
            yield from duzlestir(x)
        else:
            yield x
`
      })
    ],
    cards: [
      { id: "py14k1", q: "yield içeren fonksiyon çağrılınca ne olur?", a: "Gövde çalışmaz; bir üreteç nesnesi döner. Gövde next() ile ilk yield'e kadar ilerler." },
      { id: "py14k2", q: "[x for x in s] ile (x for x in s) farkı?", a: "İlki tüm listeyi bellekte oluşturur; ikincisi değerleri tek tek, ihtiyaç anında üretir." },
      { id: "py14k3", q: "yield from ne yapar?", a: "Başka bir yinelenebilirin tüm değerlerini olduğu gibi aktarır." }
    ]
  },

  /* ============================ Python · FAZ 15 ============================ */
  {
    id: "py15", no: 15, language: "py", track: "py2", title: "Kapanışlar ve dekoratörler", short: "Dekoratörler",
    goal: "Fonksiyonları değer gibi kullan: fonksiyon döndüren fonksiyonlar, nonlocal ve davranış ekleyen dekoratörler.",
    concepts: ["birinci sınıf fonksiyonlar", "kapanış (closure)", "nonlocal", "dekoratör ve @", "functools.wraps"],
    predict: {
      lang: "py",
      code: k`
def sayac():
    n = 0
    def artir():
        nonlocal n
        n += 1
        return n
    return artir

s = sayac()
s()
print(s())
`,
      options: ["2", "1", "0", "Hata verir"], answer: 0,
      why: "artir, tanımlandığı ortamdaki n'yi hatırlar (kapanış). sayac() bittikten sonra bile n yaşar. İki çağrıdan sonra 2. nonlocal olmasaydı n += 1 UnboundLocalError verirdi."
    },
    example: {
      title: "Süre ölçen dekoratör",
      lang: "py",
      code: k`
import functools, time

def zamanla(f):
    @functools.wraps(f)
    def sarmalayici(*args, **kwargs):
        bas = time.perf_counter()
        sonuc = f(*args, **kwargs)
        sure = (time.perf_counter() - bas) * 1000
        print(f"{f.__name__} {sure:.1f} ms sürdü")
        return sonuc
    return sarmalayici

@zamanla
def topla(n):
    return sum(range(n))

print(topla(100_000), topla.__name__)
`,
      steps: [
        { lines: [3, 11], text: "Dekoratör, bir fonksiyon alıp yeni bir fonksiyon döndüren fonksiyondur." },
        { lines: [5, 7], text: "*args, **kwargs her türlü argümanı alıp orijinal fonksiyona aynen iletir." },
        { lines: [4], text: "functools.wraps, sarmalayıcıya orijinal fonksiyonun adını ve belgesini kopyalar." },
        { lines: [13, 14], text: "@zamanla yazmak, topla = zamanla(topla) yazmakla aynıdır." }
      ]
    },
    challenges: [
      g({
        id: "py15c1", kind: "Yaz", title: "Çarpan üreticisi", fn: "carpan",
        prompt: "`carpan(k)` aldığı sayıyı k ile çarpan **bir fonksiyon** döndürsün: `ikiyle = carpan(2); ikiyle(5)` → 10.",
        starter: k`
def carpan(k):
    pass
`,
        tests: [
          { label: "carpan(2)(5)", expr: "carpan(2)(5)", expected: 10 },
          { label: "bağımsız kapanışlar", setup: "uc = carpan(3)\non = carpan(10)", expr: "[uc(4), on(4)]", expected: [12, 40] },
          { label: "map ile", expr: "list(map(carpan(-1), [1, 2]))", expected: [-1, -2] }
        ],
        hints: ["İç içe bir fonksiyon tanımla ve onu (çağırmadan) döndür.", "İç fonksiyon k'yi dış ortamdan hatırlar.", "def ic(x): return x * k; return ic  — ya da return lambda x: x * k"],
        solution: k`
def carpan(k):
    def ic(x):
        return x * k
    return ic
`
      }),
      g({
        id: "py15c2", kind: "Yaz", title: "Çağrı sayan dekoratör", fn: "sayan",
        prompt: "`sayan` dekoratörü, süslediği fonksiyonun kaç kez çağrıldığını sarmalayıcının `cagri` özelliğinde tutsun. Fonksiyonun adı korunmalı (`functools.wraps`).",
        starter: k`
import functools

def sayan(f):
    return f
`,
        tests: [
          { label: "sayar", setup: "@sayan\ndef kare(x):\n    return x * x\nkare(2)\nkare(3)", expr: "kare.cagri", expected: 2 },
          { label: "sonuç değişmez", setup: "@sayan\ndef kare(x):\n    return x * x", expr: "kare(7)", expected: 49 },
          { label: "ad korunur", setup: "@sayan\ndef kare(x):\n    return x * x", expr: "kare.__name__", expected: "kare" },
          { label: "her fonksiyonun sayacı ayrı", setup: "@sayan\ndef a():\n    pass\n@sayan\ndef b():\n    pass\na()\na()\nb()", expr: "[a.cagri, b.cagri]", expected: [2, 1] }
        ],
        hints: ["Sarmalayıcı fonksiyon da bir nesnedir; ona özellik ekleyebilirsin: sarmalayici.cagri = 0.", "Sarmalayıcının içinde sarmalayici.cagri += 1, sonra orijinal fonksiyonu çağır.", "@functools.wraps(f) satırını sarmalayıcının üstüne ekle."],
        solution: k`
import functools

def sayan(f):
    @functools.wraps(f)
    def sarmalayici(*args, **kwargs):
        sarmalayici.cagri += 1
        return f(*args, **kwargs)
    sarmalayici.cagri = 0
    return sarmalayici
`
      }),
      g({
        id: "py15c3", kind: "Yaz", title: "Önbellek dekoratörü", fn: "onbellek",
        prompt: "`onbellek` dekoratörü, aynı argümanlarla yapılan çağrıların sonucunu bir sözlükte saklayıp tekrar hesaplamasın. Testler naif özyinelemeli fibonacci'yi hızlandıracak. (`functools.cache` kullanma.)",
        starter: k`
def onbellek(f):
    return f
`,
        tests: [
          { label: "fib(80) hızlı", setup: "@onbellek\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)", expr: "fib(80)", expected: 23416728348467685 },
          { label: "aynı argüman bir kez hesaplanır", setup: "hesap = []\n@onbellek\ndef kare(x):\n    hesap.append(x)\n    return x * x\nkare(4)\nkare(4)\nkare(5)", expr: "hesap", expected: [4, 5] },
          { label: "hazır önbellek yok", codeNot: "lru_cache|functools\\.cache|@cache", codeHint: "kendin yaz" }
        ],
        hints: ["Dekoratörün içinde bir sözlük oluştur; kapanış sayesinde çağrılar arasında yaşar.", "Anahtar olarak argüman demetini kullan: args.", "if args not in sakli: sakli[args] = f(*args); return sakli[args]"],
        solution: k`
import functools

def onbellek(f):
    sakli = {}
    @functools.wraps(f)
    def sarmalayici(*args):
        if args not in sakli:
            sakli[args] = f(*args)
        return sakli[args]
    return sarmalayici
`
      })
    ],
    cards: [
      { id: "py15k1", q: "Kapanış (closure) nedir?", a: "Tanımlandığı ortamdaki değişkenleri, o ortam sona erdikten sonra da hatırlayan iç fonksiyon." },
      { id: "py15k2", q: "@dekorator yazmak neyle eşdeğerdir?", a: "f = dekorator(f)." },
      { id: "py15k3", q: "functools.wraps neden kullanılır?", a: "Sarmalayıcıya orijinal fonksiyonun adını (__name__) ve belgesini kopyalar; hata ayıklama ve araçlar doğru adı görür." }
    ]
  },

  /* ============================ Python · FAZ 16 ============================ */
  {
    id: "py16", no: 16, language: "py", track: "py2", title: "CSV ve JSON ile veri", short: "CSV & JSON",
    goal: "Gerçek dünyanın iki veri biçimini oku ve yaz: csv modülüyle tablolar, json modülüyle iç içe yapılar.",
    concepts: ["csv.DictReader / DictWriter", "io.StringIO", "json.loads / json.dumps", "tür dönüşümü"],
    predict: {
      lang: "py",
      code: k`
import json
veri = json.loads('{"ad": "Ada", "puanlar": [90, 85], "aktif": true}')
print(veri["aktif"], sum(veri["puanlar"]), type(veri).__name__)
`,
      options: ["True 175 dict", "true 175 dict", "True 175 str", "Hata verir"], answer: 0,
      why: "json.loads JSON metnini Python yapısına çevirir: nesne → dict, dizi → list, true → True, null → None."
    },
    example: {
      title: "CSV'den okumak",
      lang: "py",
      code: k`
import csv, io, json

metin = """ad,sehir,puan
Ada,İzmir,90
Can,Ankara,72
Ece,İzmir,85
"""
satirlar = list(csv.DictReader(io.StringIO(metin)))
print(satirlar[0])

izmir = [s for s in satirlar if s["sehir"] == "İzmir"]
ortalama = sum(int(s["puan"]) for s in izmir) / len(izmir)
print(json.dumps({"sehir": "İzmir", "ortalama": ortalama}, ensure_ascii=False))
`,
      steps: [
        { lines: [9], text: "DictReader ilk satırı başlık sayar; her satırı {sütun: değer} sözlüğü olarak verir. io.StringIO metni dosya gibi okutur." },
        { lines: [12], text: "CSV'deki her değer metindir; sayı olarak kullanmak için int() / float() gerekir." },
        { lines: [13], text: "json.dumps Python yapısını JSON metnine çevirir. ensure_ascii=False Türkçe karakterleri olduğu gibi yazar." }
      ]
    },
    challenges: [
      g({
        id: "py16c1", kind: "Yaz", title: "Sütun toplamı", fn: "sutun_toplami",
        prompt: "`sutun_toplami(csv_metni, sutun)` başlıklı CSV metnindeki verilen sütunun sayısal toplamını (float) döndürsün. Boş hücreler atlansın.",
        starter: k`
import csv, io

def sutun_toplami(csv_metni, sutun):
    pass
`,
        tests: [
          { label: "fiyatlar", expr: "sutun_toplami(\"urun,fiyat\\nkalem,12.5\\ndefter,30\\n\", \"fiyat\")", expected: 42.5 },
          { label: "boş hücre", expr: "sutun_toplami(\"a,b\\n1,2\\n3,\\n\", \"b\")", expected: 2 },
          { label: "tırnaklı virgül", expr: "sutun_toplami(\"ad,tutar\\n\\\"Yılmaz, Ali\\\",5\\nCan,7\\n\", \"tutar\")", expected: 12 },
          { label: "csv modülü kullanılmış", codeMatch: "csv\\.", codeHint: "csv.DictReader" }
        ],
        hints: ["csv.DictReader(io.StringIO(csv_metni)) satırları sözlük olarak verir.", "Elle split(\",\") yapma: tırnak içindeki virgülleri csv modülü doğru işler.", "return sum(float(s[sutun]) for s in okuyucu if s[sutun])"],
        solution: k`
import csv, io

def sutun_toplami(csv_metni, sutun):
    okuyucu = csv.DictReader(io.StringIO(csv_metni))
    return sum(float(s[sutun]) for s in okuyucu if s[sutun])
`
      }),
      g({
        id: "py16c2", kind: "Yaz", title: "JSON özeti", fn: "json_ozet",
        prompt: "`json_ozet(metin)` kullanıcı listesi içeren JSON metnini okuyup `{\"adet\": …, \"ortalama_yas\": … (1 basamak), \"sehirler\": [sıralı, tekrarsız]}` sözlüğü döndürsün.",
        starter: k`
import json

def json_ozet(metin):
    pass
`,
        tests: [
          { label: "üç kullanıcı", expr: "json_ozet('[{\"ad\": \"Ada\", \"yas\": 30, \"sehir\": \"İzmir\"}, {\"ad\": \"Can\", \"yas\": 25, \"sehir\": \"Ankara\"}, {\"ad\": \"Ece\", \"yas\": 28, \"sehir\": \"İzmir\"}]')", expected: { adet: 3, ortalama_yas: 27.7, sehirler: ["Ankara", "İzmir"] } },
          { label: "tek kullanıcı", expr: "json_ozet('[{\"ad\": \"Bora\", \"yas\": 19, \"sehir\": \"Van\"}]')", expected: { adet: 1, ortalama_yas: 19, sehirler: ["Van"] } }
        ],
        hints: ["json.loads(metin) bir sözlük listesi verir.", "Ortalama: sum(k[\"yas\"] for k in liste) / len(liste), sonra round(…, 1).", "Şehirler: sorted({k[\"sehir\"] for k in liste})"],
        solution: k`
import json

def json_ozet(metin):
    kullanicilar = json.loads(metin)
    adet = len(kullanicilar)
    return {
        "adet": adet,
        "ortalama_yas": round(sum(k["yas"] for k in kullanicilar) / adet, 1),
        "sehirler": sorted({k["sehir"] for k in kullanicilar}),
    }
`
      }),
      g({
        id: "py16c3", kind: "Yaz", title: "CSV yaz", fn: "csv_yaz",
        prompt: "`csv_yaz(kayitlar, sutunlar)` sözlük listesini başlıklı CSV metnine çevirsin (satır sonu `\\n`). Virgül içeren değerler tırnaklanmalı; bunu `csv.DictWriter` halleder.",
        starter: k`
import csv, io

def csv_yaz(kayitlar, sutunlar):
    pass
`,
        tests: [
          { label: "iki kayıt", expr: "csv_yaz([{\"ad\": \"Ada\", \"puan\": 90}, {\"ad\": \"Can\", \"puan\": 72}], [\"ad\", \"puan\"])", expected: "ad,puan\nAda,90\nCan,72\n" },
          { label: "virgüllü değer", expr: "csv_yaz([{\"ad\": \"Yılmaz, Ali\", \"puan\": 1}], [\"ad\", \"puan\"])", expected: "ad,puan\n\"Yılmaz, Ali\",1\n" },
          { label: "geri okunabilir", setup: "m = csv_yaz([{\"a\": \"x,y\", \"b\": \"\"}], [\"a\", \"b\"])", expr: "list(csv.DictReader(io.StringIO(m)))[0][\"a\"]", expected: "x,y" }
        ],
        hints: ["Çıktıyı bir io.StringIO'ya yaz, sonunda .getvalue() ile metni al.", "csv.DictWriter(tampon, fieldnames=sutunlar, lineterminator=\"\\n\")", "writeheader(), sonra writerows(kayitlar)."],
        solution: k`
import csv, io

def csv_yaz(kayitlar, sutunlar):
    tampon = io.StringIO()
    yazici = csv.DictWriter(tampon, fieldnames=sutunlar, lineterminator="\n")
    yazici.writeheader()
    yazici.writerows(kayitlar)
    return tampon.getvalue()
`
      })
    ],
    cards: [
      { id: "py16k1", q: "CSV'yi neden split(\",\") ile değil csv modülüyle okumalı?", a: "Tırnak içindeki virgülleri, kaçışları ve satır sonlarını csv modülü doğru işler." },
      { id: "py16k2", q: "JSON ↔ Python tür eşlemesi?", a: "nesne ↔ dict, dizi ↔ list, true/false ↔ True/False, null ↔ None, sayı ↔ int/float." },
      { id: "py16k3", q: "io.StringIO ne işe yarar?", a: "Bir metni dosya gibi okutur ya da yazılanları bellekte toplar." }
    ]
  },

  /* ============================ Python · FAZ 17 ============================ */
  {
    id: "py17", no: 17, language: "py", track: "py2", title: "Düzenli ifadeler (re)", short: "Düzenli ifadeler",
    goal: "Metinde kalıp ara, ayıkla, doğrula ve dönüştür: karakter sınıfları, nicelikler, gruplar ve re.sub.",
    concepts: ["ham metin r\"...\"", "\\d \\w \\s ve nicelikler", "findall ve fullmatch", "gruplar ve re.sub"],
    predict: {
      lang: "py",
      code: k`
import re
print(re.findall(r"\d+", "a1b22c333"))
`,
      options: ["['1', '22', '333']", "[1, 22, 333]", "['1', '2', '2', '3', '3', '3']", "['a', 'b', 'c']"], answer: 0,
      why: "\\d bir rakam, + 'bir ya da daha fazla' demektir; findall örtüşmeyen tüm eşleşmeleri metin olarak döndürür. Sayıya çevirmek senin işin."
    },
    example: {
      title: "Ayıklama ve dönüştürme",
      lang: "py",
      code: k`
import re

log = "2026-11-09 hata: disk dolu; 2026-11-10 uyarı: yavaş"
tarihler = re.findall(r"\d{4}-\d{2}-\d{2}", log)
print(tarihler)

m = re.search(r"(\w+): (\w+)", log)
print(m.group(1), "→", m.group(2))

print(re.sub(r"(\d{4})-(\d{2})-(\d{2})", r"\3.\2.\1", log))
print(bool(re.fullmatch(r"[a-z]{3,8}", "kodera")))
`,
      steps: [
        { lines: [4], text: "{4} tam 4 tekrar demek. Kalıpları r\"...\" ham metniyle yaz; yoksa ters bölüleri Python yorumlar." },
        { lines: [7, 8], text: "Parantezler grup oluşturur; eşleşmenin parçalarına group(n) ile erişirsin." },
        { lines: [10], text: "re.sub'da \\1, \\2 gruplara gönderme yapar: tarih biçimi değişir." },
        { lines: [11], text: "fullmatch metnin TAMAMI kalıba uyuyorsa eşleşir; doğrulama için doğru araç budur." }
      ]
    },
    challenges: [
      g({
        id: "py17c1", kind: "Yaz", title: "E-posta ayıkla", fn: "epostalar",
        prompt: "`epostalar(metin)` metindeki e-posta adreslerini (`ad@alan.uzantı`, ad kısmında harf, rakam, nokta, alt çizgi, artı, eksi olabilir) geçtikleri sırayla liste olarak döndürsün.",
        starter: k`
import re

def epostalar(metin):
    pass
`,
        tests: [
          { label: "iki adres", expr: "epostalar(\"Bana ada@quagen.dev ya da destek.ekip@ornek.com.tr adresinden yaz.\")", expected: ["ada@quagen.dev", "destek.ekip@ornek.com.tr"] },
          { label: "artı işaretli", expr: "epostalar(\"x+test@mail.org!\")", expected: ["x+test@mail.org"] },
          { label: "yok", expr: "epostalar(\"@ işareti tek başına adres değil\")", expected: [] }
        ],
        hints: ["Ad kısmı: [\\w.+-]+", "Alan: [\\w-]+ ve ardından bir ya da daha fazla (\\.[\\w-]+) parçası. Grup kullanırsan findall grupları döndürür; (?:...) yakalamayan gruptur.", "re.findall(r\"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+\", metin)"],
        solution: k`
import re

def epostalar(metin):
    return re.findall(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", metin)
`
      }),
      g({
        id: "py17c2", kind: "Yaz", title: "Tarih biçimi çevir", fn: "tarih_cevir",
        prompt: "`tarih_cevir(metin)` metindeki tüm `YYYY-AA-GG` tarihlerini `GG.AA.YYYY` biçimine çevirsin; metnin geri kalanı aynen kalsın.",
        starter: k`
import re

def tarih_cevir(metin):
    pass
`,
        tests: [
          { label: "tek tarih", expr: "tarih_cevir(\"Teslim: 2026-11-09\")", expected: "Teslim: 09.11.2026" },
          { label: "iki tarih", expr: "tarih_cevir(\"2025-01-31 ile 2025-02-01 arası\")", expected: "31.01.2025 ile 01.02.2025 arası" },
          { label: "tarih yok", expr: "tarih_cevir(\"sürüm 1-2-3\")", expected: "sürüm 1-2-3" }
        ],
        hints: ["Yılı, ayı ve günü ayrı gruplarla yakala.", "re.sub'ın değiştirme metninde \\3 üçüncü grup demektir.", "re.sub(r\"(\\d{4})-(\\d{2})-(\\d{2})\", r\"\\3.\\2.\\1\", metin)"],
        solution: k`
import re

def tarih_cevir(metin):
    return re.sub(r"(\d{4})-(\d{2})-(\d{2})", r"\3.\2.\1", metin)
`
      }),
      g({
        id: "py17c3", kind: "Yaz", title: "Telefon doğrula", fn: "telefon_gecerli",
        prompt: "`telefon_gecerli(s)` metin tam olarak `05XX XXX XX XX` biçimindeyse (X rakam) True döndürsün. Baştaki ve sondaki boşluklar kabul edilmesin.",
        starter: k`
import re

def telefon_gecerli(s):
    return re.search(r"05\d{2} \d{3} \d{2} \d{2}", s) is not None
`,
        tests: [
          { label: "geçerli", expr: "telefon_gecerli(\"0532 123 45 67\")", expected: true },
          { label: "eksik hane", expr: "telefon_gecerli(\"0532 123 45 6\")", expected: false },
          { label: "fazladan karakter", expr: "telefon_gecerli(\"0532 123 45 678\")", expected: false },
          { label: "önünde metin", expr: "telefon_gecerli(\"tel: 0532 123 45 67\")", expected: false },
          { label: "boşluksuz", expr: "telefon_gecerli(\"05321234567\")", expected: false }
        ],
        hints: ["search metnin herhangi bir yerinde eşleşme bulursa yeter; fazlalıkları görmez.", "Metnin tamamının uymasını isteyen fonksiyon hangisi?", "re.fullmatch(...)"],
        solution: k`
import re

def telefon_gecerli(s):
    return re.fullmatch(r"05\d{2} \d{3} \d{2} \d{2}", s) is not None
`
      })
    ],
    cards: [
      { id: "py17k1", q: "re.search, re.match ve re.fullmatch farkı?", a: "search her yerde arar, match yalnızca başta, fullmatch metnin tamamının uymasını ister." },
      { id: "py17k2", q: "Kalıplar neden r\"...\" ile yazılır?", a: "Ham metinde ters bölü (\\) Python tarafından yorumlanmaz, olduğu gibi re'ye ulaşır." },
      { id: "py17k3", q: "(?:...) ne işe yarar?", a: "Yakalamayan grup: gruplar ama findall sonucuna ayrı grup olarak girmez." }
    ]
  },

  /* ============================ Python · FAZ 18 ============================ */
  {
    id: "py18", no: 18, language: "py", track: "py2", title: "Tarihler ve dataclass", short: "Tarih & dataclass",
    goal: "Zamanla doğru hesap yap (date, timedelta) ve veri taşıyan sınıfları @dataclass ile kısaca tanımla.",
    concepts: ["date ve fromisoformat", "timedelta", "weekday ve strftime", "@dataclass ve field"],
    predict: {
      lang: "py",
      code: k`
from datetime import date
print((date(2026, 3, 1) - date(2026, 2, 1)).days)
`,
      options: ["28", "30", "29", "31"], answer: 0,
      why: "İki tarihin farkı bir timedelta'dır; .days gün sayısını verir. 2026 artık yıl değil, Şubat 28 gün. Ayların uzunluğunu kendin hesaplamaya çalışma: datetime bilir."
    },
    example: {
      title: "Teslim tarihi ve sipariş kaydı",
      lang: "py",
      code: k`
from dataclasses import dataclass, field
from datetime import date, timedelta

@dataclass
class Siparis:
    musteri: str
    tutar: float
    tarih: date = field(default_factory=date.today)

    def teslim(self, gun=3):
        return self.tarih + timedelta(days=gun)

s = Siparis("Ada", 249.9, date(2026, 12, 30))
print(s)
print(s.teslim(), s.teslim().strftime("%d.%m.%Y"))
print(Siparis("Can", 10, date(2026, 1, 1)) == Siparis("Can", 10, date(2026, 1, 1)))
`,
      steps: [
        { lines: [4, 5, 6, 7], text: "@dataclass, alan listesinden __init__, __repr__ ve __eq__'i otomatik yazar." },
        { lines: [8], text: "Değiştirilebilir ya da her seferinde yeni olması gereken varsayılanlar için field(default_factory=...)." },
        { lines: [11], text: "Tarihe timedelta eklemek ay ve yıl sınırlarını doğru geçer: 30 Aralık + 3 gün = 2 Ocak." },
        { lines: [16], text: "__eq__ hazır geldiği için aynı alanlara sahip nesneler eşittir: True." }
      ]
    },
    challenges: [
      g({
        id: "py18c1", kind: "Yaz", title: "Kaç gün kaldı?", fn: "gun_farki",
        prompt: "`gun_farki(bas, son)` `\"YYYY-AA-GG\"` biçimindeki iki tarih arasındaki gün farkını döndürsün (son, baştan önceyse negatif).",
        starter: k`
from datetime import date

def gun_farki(bas, son):
    pass
`,
        tests: [
          { label: "yılbaşına", expr: "gun_farki(\"2026-11-09\", \"2027-01-01\")", expected: 53 },
          { label: "artık yıl", expr: "gun_farki(\"2024-02-28\", \"2024-03-01\")", expected: 2 },
          { label: "geriye", expr: "gun_farki(\"2026-01-10\", \"2026-01-01\")", expected: -9 }
        ],
        hints: ["date.fromisoformat(\"2026-11-09\") metni tarihe çevirir.", "İki tarihin farkı timedelta'dır.", "return (date.fromisoformat(son) - date.fromisoformat(bas)).days"],
        solution: k`
from datetime import date

def gun_farki(bas, son):
    return (date.fromisoformat(son) - date.fromisoformat(bas)).days
`
      }),
      g({
        id: "py18c2", kind: "Yaz", title: "Haftanın günü", fn: "hafta_gunu",
        prompt: "`hafta_gunu(tarih)` `\"YYYY-AA-GG\"` tarihinin Türkçe gün adını döndürsün (`Pazartesi` … `Pazar`). Hazır yerel ayar kullanma; `weekday()` ile.",
        starter: k`
from datetime import date

GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]

def hafta_gunu(tarih):
    pass
`,
        tests: [
          { label: "2026-11-09", expr: "hafta_gunu(\"2026-11-09\")", expected: "Pazartesi" },
          { label: "2023-10-29", expr: "hafta_gunu(\"2023-10-29\")", expected: "Pazar" },
          { label: "2000-01-01", expr: "hafta_gunu(\"2000-01-01\")", expected: "Cumartesi" }
        ],
        hints: ["weekday() Pazartesi için 0, Pazar için 6 döndürür.", "Listeyi bu sayıyla indeksle.", "return GUNLER[date.fromisoformat(tarih).weekday()]"],
        solution: k`
from datetime import date

GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]

def hafta_gunu(tarih):
    return GUNLER[date.fromisoformat(tarih).weekday()]
`
      }),
      g({
        id: "py18c3", kind: "Yaz", title: "Ürün dataclass'ı", fn: "Urun",
        prompt: "`@dataclass Urun(ad: str, fiyat: float, adet: int = 1, etiketler: list = …)` tanımla. Her ürünün etiket listesi **ayrı** olsun. `toplam()` fiyat × adet döndürsün.",
        starter: k`
from dataclasses import dataclass, field

class Urun:
    pass
`,
        tests: [
          { label: "toplam", expr: "Urun(\"kalem\", 12.5, 4).toplam()", expected: 50 },
          { label: "varsayılan adet", expr: "Urun(\"defter\", 30).adet", expected: 1 },
          { label: "eşitlik hazır", expr: "Urun(\"a\", 1) == Urun(\"a\", 1)", expected: true },
          { label: "repr hazır", expr: "repr(Urun(\"a\", 2.0))", expected: "Urun(ad='a', fiyat=2.0, adet=1, etiketler=[])" },
          { label: "etiket listeleri ayrı", setup: "a = Urun(\"a\", 1)\nb = Urun(\"b\", 1)\na.etiketler.append(\"indirim\")", expr: "b.etiketler", expected: [] }
        ],
        hints: ["Sınıfın üstüne @dataclass yaz ve alanları ad: tür biçiminde sırala.", "Liste varsayılanı doğrudan [] olamaz: field(default_factory=list).", "def toplam(self): return self.fiyat * self.adet"],
        solution: k`
from dataclasses import dataclass, field

@dataclass
class Urun:
    ad: str
    fiyat: float
    adet: int = 1
    etiketler: list = field(default_factory=list)

    def toplam(self):
        return self.fiyat * self.adet
`
      })
    ],
    cards: [
      { id: "py18k1", q: "İki tarih arasındaki gün sayısı?", a: "(son - bas).days; fark bir timedelta'dır." },
      { id: "py18k2", q: "@dataclass hangi metotları otomatik yazar?", a: "__init__, __repr__ ve __eq__ (istenirse sıralama ve hash de)." },
      { id: "py18k3", q: "dataclass'ta liste varsayılanı nasıl verilir?", a: "field(default_factory=list); her nesneye yeni bir liste oluşturur." }
    ]
  },

  /* ============================ Python · FAZ 19 ============================ */
  {
    id: "py19", no: 19, language: "py", track: "py2", title: "Algoritmalar Python'da: heapq, bisect, BFS", short: "Algoritmalar",
    goal: "Standart kütüphanenin algoritmik araçlarıyla verimli çözümler: öncelik kuyruğu, ikili arama ve graf üzerinde genişlik öncelikli arama.",
    concepts: ["heapq", "bisect", "deque ile BFS", "karmaşıklık seçimi"],
    predict: {
      lang: "py",
      code: k`
import heapq
h = [5, 1, 4, 2]
heapq.heapify(h)
print(heapq.heappop(h), h[0])
`,
      options: ["1 2", "5 1", "1 4", "1 5"], answer: 0,
      why: "heapify listeyi bir min-yığına dönüştürür: en küçük eleman her zaman h[0]'dadır. heappop onu çıkarır (1); sonra kalanlar arasından en küçük (2) başa gelir."
    },
    example: {
      title: "Üç araç",
      lang: "py",
      code: k`
import heapq, bisect
from collections import deque

gorevler = [(3, "rapor"), (1, "acil hata"), (2, "toplantı")]
heapq.heapify(gorevler)
print([heapq.heappop(gorevler)[1] for _ in range(3)])

notlar = [45, 60, 72, 88, 95]
print(bisect.bisect_left(notlar, 72), bisect.bisect_left(notlar, 80))

agac = {"a": ["b", "c"], "b": ["d"], "c": ["d"], "d": []}
kuyruk, gorulen = deque(["a"]), {"a"}
while kuyruk:
    dugum = kuyruk.popleft()
    print(dugum, end=" ")
    for k in agac[dugum]:
        if k not in gorulen:
            gorulen.add(k)
            kuyruk.append(k)
`,
      steps: [
        { lines: [4, 5, 6], text: "Demetler ilk elemana göre karşılaştırılır; yığın en düşük öncelikliyi önce verir." },
        { lines: [9], text: "bisect_left sıralı listede bir değerin girmesi gereken konumu O(log n)'de bulur: 72 → 2, 80 → 3." },
        { lines: [12, 13, 14], text: "BFS: kuyruktan çıkar, komşuları ekle. gorulen kümesi aynı düğümü iki kez işlemeyi önler." },
        { lines: [15], text: "Düğümler katman katman gezilir: a b c d." }
      ]
    },
    challenges: [
      g({
        id: "py19c1", kind: "Yaz", title: "En küçük k eleman", fn: "en_kucuk_k",
        prompt: "`en_kucuk_k(sayilar, k)` en küçük k sayıyı artan sırada döndürsün. Büyük listede tüm listeyi sıralamadan, `heapq` ile.",
        starter: k`
import heapq

def en_kucuk_k(sayilar, k):
    pass
`,
        tests: [
          { label: "küçük örnek", expr: "en_kucuk_k([7, 2, 9, 1, 5], 3)", expected: [1, 2, 5] },
          { label: "k sıfır", expr: "en_kucuk_k([3], 0)", expected: [] },
          { label: "büyük liste", setup: "s = [(i * 7919) % 100003 for i in range(300000)]", expr: "en_kucuk_k(s, 4)", expected: [0, 0, 0, 1] },
          { label: "heapq kullanılmış", codeMatch: "heapq\\.", codeHint: "heapq" }
        ],
        hints: ["heapq.nsmallest(k, dizi) tam olarak bunu yapar: O(n log k).", "Ya da k elemanlık bir max-yığın tut (değerlerin negatifini koyarak).", "return heapq.nsmallest(k, sayilar)"],
        solution: k`
import heapq

def en_kucuk_k(sayilar, k):
    return heapq.nsmallest(k, sayilar)
`
      }),
      g({
        id: "py19c2", kind: "Yaz", title: "İkili arama", fn: "ikili_ara",
        prompt: "`ikili_ara(sirali, x)` sıralı listede x'in **ilk** geçtiği indeksi, yoksa -1 döndürsün. O(log n) olmalı: `in`, `.index` ya da doğrusal döngü yok (`bisect` serbest).",
        starter: k`
def ikili_ara(sirali, x):
    pass
`,
        tests: [
          { label: "var", expr: "ikili_ara([1, 3, 5, 7, 9], 7)", expected: 3 },
          { label: "yok", expr: "ikili_ara([1, 3, 5], 4)", expected: -1 },
          { label: "tekrarlarda ilki", expr: "ikili_ara([2, 2, 2, 3], 2)", expected: 0 },
          { label: "boş", expr: "ikili_ara([], 1)", expected: -1 },
          { label: "milyon eleman", setup: "s = list(range(0, 2_000_000, 2))", expr: "[ikili_ara(s, 1_999_998), ikili_ara(s, 7)]", expected: [999999, -1] },
          { label: "doğrusal arama yok", codeNot: "\\.index\\(|\\bin\\s+sirali\\b", codeHint: "ikili arama" }
        ],
        hints: ["bisect.bisect_left, x'in girmesi gereken en soldaki konumu verir.", "O konum listenin içindeyse ve oradaki eleman x ise bulunmuştur.", "i = bisect.bisect_left(sirali, x); return i if i < len(sirali) and sirali[i] == x else -1"],
        solution: k`
import bisect

def ikili_ara(sirali, x):
    i = bisect.bisect_left(sirali, x)
    return i if i < len(sirali) and sirali[i] == x else -1
`
      }),
      g({
        id: "py19c3", kind: "Yaz", title: "En kısa yol", fn: "en_kisa_yol",
        prompt: "`en_kisa_yol(graf, bas, son)` komşuluk sözlüğüyle verilen ağırlıksız grafta bas'tan son'a en az kaç kenarla gidildiğini, yol yoksa -1 döndürsün (BFS).",
        starter: k`
from collections import deque

def en_kisa_yol(graf, bas, son):
    pass
`,
        tests: [
          { label: "metro", expr: "en_kisa_yol({\"a\": [\"b\", \"c\"], \"b\": [\"d\"], \"c\": [\"d\", \"e\"], \"d\": [\"f\"], \"e\": [\"f\"], \"f\": []}, \"a\", \"f\")", expected: 3 },
          { label: "aynı düğüm", expr: "en_kisa_yol({\"a\": []}, \"a\", \"a\")", expected: 0 },
          { label: "ulaşılamaz", expr: "en_kisa_yol({\"a\": [\"b\"], \"b\": [], \"c\": []}, \"a\", \"c\")", expected: -1 },
          { label: "döngülü graf", expr: "en_kisa_yol({1: [2], 2: [1, 3], 3: [2, 4], 4: []}, 1, 4)", expected: 3 }
        ],
        hints: ["Kuyrukta (düğüm, uzaklık) çiftleri tut.", "Çıkardığın düğüm hedefse uzaklığı döndür; değilse görülmemiş komşuları uzaklık + 1 ile ekle.", "Döngülü graflar için görülen kümesi şart; kuyruk biterse -1."],
        solution: k`
from collections import deque

def en_kisa_yol(graf, bas, son):
    kuyruk = deque([(bas, 0)])
    gorulen = {bas}
    while kuyruk:
        dugum, uzaklik = kuyruk.popleft()
        if dugum == son:
            return uzaklik
        for komsu in graf.get(dugum, []):
            if komsu not in gorulen:
                gorulen.add(komsu)
                kuyruk.append((komsu, uzaklik + 1))
    return -1
`
      })
    ],
    cards: [
      { id: "py19k1", q: "heapq varsayılan olarak hangi yığını kurar?", a: "Min-yığın: en küçük eleman h[0]'dadır. Max için değerlerin negatifi kullanılır." },
      { id: "py19k2", q: "bisect_left ne döndürür?", a: "Sıralı listede x'in, sırayı bozmadan girebileceği en soldaki konumu (O(log n))." },
      { id: "py19k3", q: "Ağırlıksız grafta en kısa yol için hangi arama?", a: "BFS (genişlik öncelikli): düğümleri uzaklık sırasıyla gezer. deque ve görülen kümesiyle." }
    ]
  },

  /* ============================ Python · FAZ 20 ============================ */
  {
    id: "py20", no: 20, language: "py", track: "py2", title: "Mini proje: veri raporu aracı", short: "Veri raporu",
    goal: "Standart girdiden CSV okuyan, gruplayan, sıralayan ve biçimli rapor yazan bir komut satırı aracı yaz.",
    concepts: ["sys.stdin + csv", "gruplama ve toplama", "çok ölçütlü sıralama", "hizalı tablo çıktısı"],
    predict: {
      lang: "py",
      code: k`
print(f"|{'Ada':<6}|{90:>5}|{3.14159:.2f}|")
`,
      options: ["|Ada   |   90|3.14|", "|   Ada|90   |3.14|", "|Ada|90|3.14|", "|Ada   |90   |3.14159|"], answer: 0,
      why: "Biçim belirteçleri: <6 sola yaslı 6 karakter, >5 sağa yaslı 5 karakter, .2f iki ondalık. Tablo hizalamanın temeli budur."
    },
    example: {
      title: "Hizalı rapor",
      lang: "py",
      code: k`
satislar = [("Ada", "İzmir", 1200.5), ("Can", "Ankara", 860.0), ("Ece", "İzmir", 2310.25)]

toplamlar = {}
for _, sehir, tutar in satislar:
    toplamlar[sehir] = toplamlar.get(sehir, 0) + tutar

print(f"{'Şehir':<8}{'Toplam':>10}")
print("-" * 18)
for sehir, toplam in sorted(toplamlar.items(), key=lambda t: -t[1]):
    print(f"{sehir:<8}{toplam:>10.2f}")
`,
      steps: [
        { lines: [3, 4, 5], text: "Gruplayıp topla: şehir → toplam." },
        { lines: [7, 8], text: "Başlığı aynı genişliklerle yaz ki sütunlar hizalansın." },
        { lines: [9, 10], text: "Toplama göre azalan sırala ve sayıları sağa yaslı, iki ondalıkla yaz." }
      ]
    },
    challenges: [
      g({
        id: "py20c1", kind: "Yaz", title: "Kayıt özeti", fn: "main", mode: "stdout",
        prompt: "Standart girdiden `ad,sehir,puan` başlıklı CSV oku. Yazdır: `Kayıt: 4` ve `Ortalama: 81.25` (2 ondalık). Hiç kayıt yoksa `Kayıt: 0` ve `Ortalama: -`.",
        starter: k`
import sys, csv
`,
        tests: [
          { label: "dört kayıt", stdin: "ad,sehir,puan\nAda,İzmir,90\nCan,Ankara,72\nEce,İzmir,85\nBora,Van,78\n", stdout: "Kayıt: 4\nOrtalama: 81.25" },
          { label: "boş veri", stdin: "ad,sehir,puan\n", stdout: "Kayıt: 0\nOrtalama: -" }
        ],
        hints: ["csv.DictReader(sys.stdin) satırları sözlük olarak verir.", "Puanları int'e çevirip listede topla.", "print(f\"Ortalama: {ort:.2f}\") — kayıt yoksa '-' yaz."],
        solution: k`
import sys, csv

puanlar = [int(s["puan"]) for s in csv.DictReader(sys.stdin)]
print(f"Kayıt: {len(puanlar)}")
if puanlar:
    print(f"Ortalama: {sum(puanlar) / len(puanlar):.2f}")
else:
    print("Ortalama: -")
`
      }),
      g({
        id: "py20c2", kind: "Yaz", title: "Şehir raporu", fn: "main", mode: "stdout",
        prompt: "Aynı CSV'yi oku ve her şehir için bir satır yaz: `İzmir: 2 kişi, ortalama 87.50`. Şehirleri **ortalamaya göre azalan**, eşitse şehir adına göre sırala.",
        starter: k`
import sys, csv
from collections import defaultdict
`,
        tests: [
          { label: "üç şehir", stdin: "ad,sehir,puan\nAda,İzmir,90\nCan,Ankara,72\nEce,İzmir,85\nBora,Van,78\n", stdout: "İzmir: 2 kişi, ortalama 87.50\nVan: 1 kişi, ortalama 78.00\nAnkara: 1 kişi, ortalama 72.00" },
          { label: "eşit ortalamalar", stdin: "ad,sehir,puan\nA,Rize,50\nB,Bursa,50\n", stdout: "Bursa: 1 kişi, ortalama 50.00\nRize: 1 kişi, ortalama 50.00" }
        ],
        hints: ["defaultdict(list) ile şehir → puan listesi.", "Her şehir için (şehir, kişi sayısı, ortalama) üçlüsü oluştur.", "sorted(..., key=lambda t: (-t[2], t[0]))"],
        solution: k`
import sys, csv
from collections import defaultdict

gruplar = defaultdict(list)
for s in csv.DictReader(sys.stdin):
    gruplar[s["sehir"]].append(int(s["puan"]))

ozet = [(sehir, len(p), sum(p) / len(p)) for sehir, p in gruplar.items()]
for sehir, adet, ort in sorted(ozet, key=lambda t: (-t[2], t[0])):
    print(f"{sehir}: {adet} kişi, ortalama {ort:.2f}")
`
      }),
      g({
        id: "py20c3", kind: "Yaz", title: "Liderlik tablosu", fn: "main", mode: "stdout",
        prompt: "En yüksek puanlı **ilk 3** kişiyi hizalı tablo olarak yaz: başlık `#  Ad      Puan`, sonra `1  Ada       90` gibi satırlar. Biçim: sıra 3 karakter sola yaslı, ad 8 karakter sola yaslı, puan 4 karakter sağa yaslı. Eşit puanda ada göre.",
        starter: k`
import sys, csv
`,
        tests: [
          { label: "dört kayıt", stdin: "ad,sehir,puan\nAda,İzmir,90\nCan,Ankara,72\nEce,İzmir,85\nBora,Van,85\n", stdout: "#  Ad      Puan\n1  Ada       90\n2  Bora      85\n3  Ece       85" },
          { label: "iki kayıt", stdin: "ad,sehir,puan\nZe,X,1\nAl,Y,2\n", stdout: "#  Ad      Puan\n1  Al         2\n2  Ze         1" }
        ],
        hints: ["Başlık satırı da aynı biçimle: f\"{'#':<3}{'Ad':<8}{'Puan':>4}\".", "Sırala: key=lambda s: (-puan, ad); ilk 3'ü dilimle.", "enumerate(ilk3, 1) ile sıra numarası."],
        solution: k`
import sys, csv

kayitlar = [(s["ad"], int(s["puan"])) for s in csv.DictReader(sys.stdin)]
ilk3 = sorted(kayitlar, key=lambda t: (-t[1], t[0]))[:3]
print(f"{'#':<3}{'Ad':<8}{'Puan':>4}")
for sira, (ad, puan) in enumerate(ilk3, 1):
    print(f"{sira:<3}{ad:<8}{puan:>4}")
`
      })
    ],
    cards: [
      { id: "py20k1", q: "f-string'de sola/sağa yaslama ve genişlik?", a: "{x:<8} sola, {x:>8} sağa, {x:^8} ortaya; sayı genişliktir." },
      { id: "py20k2", q: "Standart girdiden CSV okumak?", a: "csv.DictReader(sys.stdin) — sys.stdin dosya gibi davranır." },
      { id: "py20k3", q: "İlk 3'ü almak için tüm listeyi sıralamak şart mı?", a: "Hayır; büyük veride heapq.nlargest(3, ...) O(n log 3)'tür. Küçük veride sorted(...)[:3] okunaklıdır." }
    ]
  }
  ];

  window.KD_CURRICULUM = (window.KD_CURRICULUM || []).concat(PY2);
})();
