/* QUAGEN — görev başına benzer çözümlü örnek: Python temelleri (Ders 1–10) ve Python ile veri ve otomasyon (Ders 11–20) */
(function () {
  const k = (s, ...v) => String.raw(s, ...v).replace(/^\n/, "").replace(/\s+$/, "");
  window.KD_ORNEKLER = Object.assign(window.KD_ORNEKLER || {}, {
  /* ---------- Python Ders 1–10 ---------- */
  py1c1: { t: "Çalışmayan selam", c: k`
# Hatalı sürüm:  print("Selam, dünya!)   → tırnak kapanmamış (SyntaxError)
print("Selam, dünya!")`, n: "Hata mesajının türünü oku: SyntaxError yazım kuralı, NameError tanımsız isim demektir. Python'da print küçük harfle yazılır; Print farklı bir isimdir." },
  py1c2: { t: "Doğum yılı hesaplayıcı", stdin: "Can\n17\n", c: k`
ad = input()
yas = int(input())            # input() metin döndürür; sayıya çevir
print(f"{ad}, {2026 - yas} yılında doğmuşsun.")`, n: "input() her zaman metin verir; hesap yapacaksan int(...) ile çevir. f-string içinde {ifade} hesaplanıp yerine konur." },
  py1c3: { t: "Kişi başı hesap", c: k`
def kisi_basi(toplam, kisi):
    return round(toplam / kisi, 2)

print(kisi_basi(100, 3))
print(kisi_basi(250.5, 4))`, n: "/ her zaman ondalıklı böler. round(x, 2) iki basamağa yuvarlar. print değil return kullan: testler dönen değere bakar." },
  py2c1: { t: "Herkese 'ucuz' diyen fiyat etiketi", c: k`
# Hatalı sürüm önce "fiyat >= 0" koşuluna bakıyordu: her fiyat ilk koşulda takılıyordu.
def fiyat_etiketi(fiyat):
    if fiyat >= 1000:
        return "pahalı"
    elif fiyat >= 100:
        return "orta"
    else:
        return "ucuz"

print(fiyat_etiketi(2500), fiyat_etiketi(150), fiyat_etiketi(20))`, n: "if/elif zincirinde ilk doğru koşul çalışır, gerisine bakılmaz. En dar (en yüksek eşikli) koşulu en üste yaz." },
  py2c2: { t: "Ehliyet alabilir mi?", c: k`
# 18 yaşını doldurmuş olmalı; ama sağlık raporu yoksa alamaz; 70 yaş üstü ek muayene de gerekir.
def ehliyet_alabilir(yas, rapor, ek_muayene):
    return yas >= 18 and rapor and (yas <= 70 or ek_muayene)

print(ehliyet_alabilir(25, True, False), ehliyet_alabilir(75, True, False), ehliyet_alabilir(75, True, True))`, n: "Kuralları and / or ile tek ifadede birleştir; 'ama … hariç' kısmını parantezle grupla. Bölünebilirlik: yil % 4 == 0." },
  py2c3: { t: "Üç ve yediye göre etiket", c: k`
def uc_yedi(n):
    if n % 21 == 0:          # hem 3'e hem 7'ye bölünen: en özel durum önce
        return "UçYedi"
    if n % 3 == 0:
        return "Üç"
    if n % 7 == 0:
        return "Yedi"
    return str(n)            # sayıyı metne çevir

print(uc_yedi(21), uc_yedi(9), uc_yedi(14), uc_yedi(5))`, n: "İki koşulu birden sağlayan durum en başta kontrol edilmeli; yoksa tekil koşullardan biri onu yakalar. Sayıyı metin olarak döndürmek için str(n)." },
  py3c1: { t: "Çift sayıların çarpımı", c: k`
def cift_carpim(n):
    sonuc = 1
    for i in range(2, n + 1, 2):     # 2, 4, 6, ... n
        sonuc *= i
    return sonuc

print(cift_carpim(6), cift_carpim(1))`, n: "Çarparak biriktirirken başlangıç 1'dir. range(baş, son, adım) son değeri dahil etmez; n'yi dahil etmek için n + 1 yaz." },
  py3c2: { t: "Garip ondalıklı 'basamak sayısı'", c: k`
# Hatalı sürüm n = n / 10 yazıyordu: 123 / 10 = 12.3 → döngü çok uzun sürüyor ve sonuç yanlış çıkıyordu.
def basamak_sayisi(n):
    adet = 0
    while n > 0:
        n = n // 10          # tam sayı bölmesi: son basamağı atar
        adet += 1
    return adet

print(basamak_sayisi(4096), basamak_sayisi(7))`, n: "/ ondalıklı, // tam sayı bölmesidir. Basamaklarla çalışırken n % 10 (son basamak) ve n // 10 (son basamağı at) ikilisini kullan." },
  py3c3: { t: "Tam bölen sayısı (kareköke kadar)", c: k`
def bolen_sayisi(n):
    adet = 0
    i = 1
    while i * i <= n:                 # yalnızca √n'e kadar
        if n % i == 0:
            adet += 1 if i * i == n else 2   # i ve n // i birlikte sayılır
        i += 1
    return adet

print(bolen_sayisi(36), bolen_sayisi(97), bolen_sayisi(1_000_000_007))`, n: "Bölenler çift çift gelir (i ve n // i); bu yüzden i * i <= n'e kadar bakmak yeter. Asallıkta ilk bölende False dönüp çıkarsın." },
  py4c1: { t: "Esnek etiket", c: k`
def etiketle(metin, on_ek="#", buyuk=False):
    if buyuk:
        metin = metin.upper()
    return f"{on_ek}{metin}"

print(etiketle("python"), etiketle("python", "@"), etiketle(buyuk=True, metin="kod"))`, n: "Varsayılan değerli parametreler sona yazılır ve çağrıda atlanabilir. İsimli argümanla sırayı değiştirebilirsin." },
  py4c2: { t: "Toplam ve adet (tek geçiş, demet)", c: k`
def pozitif_ozet(sayilar):
    toplam, adet = 0, 0
    for x in sayilar:
        if x > 0:
            toplam += x
            adet += 1
    return toplam, adet              # demet döner

t, a = pozitif_ozet([4, -2, 7, 0])
print(t, a, type(pozitif_ozet([])).__name__)`, n: "Birden çok sonucu virgülle döndür: return a, b. Listeyi bir kez dolaşıp iki değişkeni birlikte güncelle; başlangıç için ilk elemanı kullanabilirsin." },
  py4c3: { t: "Hafızalı sayaç sözlüğü", c: k`
# Hatalı sürüm:  def say(kelime, sayac={}):   → varsayılan sözlük tüm çağrılar arasında paylaşılıyordu.
def say(kelime, sayac=None):
    if sayac is None:
        sayac = {}                   # her çağrıda yeni sözlük
    sayac[kelime] = sayac.get(kelime, 0) + 1
    return sayac

print(say("a"), say("b"))
ortak = {}
say("x", ortak); say("x", ortak)
print(ortak)`, n: "Liste ya da sözlük gibi değiştirilebilir bir varsayılan, fonksiyon tanımlanırken BİR KEZ oluşur. Varsayılanı None yap, içeride yenisini oluştur." },
  py5c1: { t: "Sıralı kopya (orijinal bozulmadan)", c: k`
# Hatalı yaklaşım: liste.sort() çağıranın listesini de değiştirir ve None döndürür.
def buyukten_kucuge(liste):
    return sorted(liste, reverse=True)      # yeni liste

a = [3, 1, 2]
print(buyukten_kucuge(a), a)
print(a[::2], a[:])                        # dilimler de yeni liste üretir`, n: "sort ve reverse listeyi yerinde değiştirir; sorted ve dilimleme ([::-1], [:]) yeni liste verir. Çağıranın verisini bozmamak için ikincileri kullan." },
  py5c2: { t: "İkinci en küçük", c: k`
def ikinci_kucuk(liste):
    farkli = sorted(set(liste))             # tekrarları at, sırala
    if len(farkli) < 2:
        return None
    return farkli[1]

print(ikinci_kucuk([4, 1, 1, 7]), ikinci_kucuk([5, 5]), ikinci_kucuk([]))`, n: "set tekrarları atar, sorted sıralar. Sondan saymak için negatif indeks: [-1] son, [-2] sondan ikinci. Yeterli eleman yoksa None." },
  py5c3: { t: "Ardışık çiftler", c: k`
def ardisik_ciftler(liste):
    sonuc = []
    for i in range(len(liste) - 1):
        sonuc.append(liste[i:i + 2])        # 2 elemanlık dilim
    return sonuc

print(ardisik_ciftler([1, 2, 3, 4]))
print(list(range(0, 10, 4)))                # adımlı başlangıç indeksleri`, n: "Dilim liste[i:i + n], sonu aşsa bile hata vermez. Parçalara bölmek için başlangıçları range(0, len(liste), n) ile üret." },
  py6c1: { t: "Kısaltılmış ad", c: k`
def kisalt(ad_soyad):
    parcalar = ad_soyad.split()                         # tüm boşluklardan böl
    return ". ".join(p[0].upper() for p in parcalar[:-1]) + ". " + parcalar[-1].title()

print(kisalt("mustafa kemal atatürk"))
print("  çok   boşluk ".split())`, n: "split() argümansız çağrılırsa fazla boşlukları yok sayar. Her kelimenin ilk harfi kelime[0]; parçaları \"\".join(...) ile birleştirirsin." },
  py6c2: { t: "Aynı harflerden mi?", c: k`
def ayni_harfler(a, b):
    temizle = lambda s: sorted(c.lower() for c in s if c.isalpha())
    return temizle(a) == temizle(b)

print(ayni_harfler("Kelam!", "Melak"), ayni_harfler("kod", "dok."), ayni_harfler("ab", "abc"))
print("kod"[::-1])`, n: "Karşılaştırmadan önce temizle: yalnızca harf/rakamları al (isalnum), küçült (lower). Ters çevirmek için [::-1]." },
  py6c3: { t: "Rakamları kaydır", c: k`
def rakam_kaydir(metin, k):
    sonuc = []
    for c in metin:
        if "0" <= c <= "9":
            sonuc.append(chr((ord(c) - ord("0") + k) % 10 + ord("0")))   # 9'dan sonra 0'a sar
        else:
            sonuc.append(c)
    return "".join(sonuc)

print(rakam_kaydir("Oda 198", 3), rakam_kaydir(rakam_kaydir("42", 7), -7))`, n: "ord karakterin kodunu, chr koddan karakteri verir. (konum + kaydırma) % alfabe_boyu başa sarmayı sağlar; alfabe için 26, başlangıç ord(\"a\")." },
  py7c1: { t: "Harf sayacı", c: k`
def harf_say(metin):
    sayac = {}
    for c in metin.lower():
        if c.isalpha():
            sayac[c] = sayac.get(c, 0) + 1
    return sayac

print(harf_say("Ada da kod"))`, n: "Sayma kalıbı: sayac[x] = sayac.get(x, 0) + 1. get, anahtar yoksa hata vermeden 0 döndürür. Kelimeler için metin.lower().split() üzerinde dön." },
  py7c2: { t: "Yalnızca birinde olanlar", c: k`
# Yavaş sürüm: her eleman için "x not in b" listeyi baştan tarar (O(n²)).
def sadece_ilkinde(a, b):
    return sorted(set(a) - set(b))          # küme farkı: O(n)

print(sadece_ilkinde(["ece", "can", "ali"], ["ali", "zeynep"]))
print({1, 2, 3} & {2, 3, 4}, {1, 2} | {2, 3})`, n: "Kümelerde fark (-), kesişim (&) ve birleşim (|) tek işlemdir ve hızlıdır. Sonucu sıralı liste istiyorsan sorted(...) ile sar." },
  py7c3: { t: "Uzunluğa göre grupla (KeyError'suz)", c: k`
# Hatalı sürüm:  gruplar[len(k)].append(k)   → o uzunluk ilk kez görülünce KeyError
def uzunluga_gore(kelimeler):
    gruplar = {}
    for k in kelimeler:
        gruplar.setdefault(len(k), []).append(k)     # yoksa boş liste koy, sonra ekle
    return gruplar

print(uzunluga_gore(["kod", "veri", "yaz", "test"]))`, n: "Sözlükte olmayan anahtara [] ile erişmek KeyError verir. setdefault(anahtar, []) önce boş listeyi koyar, sonra o listeyi döndürür." },
  py8c1: { t: "Tek satırda uzun kelimeler", c: k`
# Döngülü sürüm:
#   sonuc = []
#   for k in kelimeler:
#       if len(k) > 3: sonuc.append(k.upper())
def uzunlar(kelimeler):
    return [k.upper() for k in kelimeler if len(k) > 3]

print(uzunlar(["kod", "python", "veri", "js"]))`, n: "Kalıp: [ifade for öğe in kaynak if koşul]. Döngüdeki append'in içi 'ifade', if'i 'koşul' olur." },
  py8c2: { t: "Fiyatları kuruşa çevir (sözlük kavraması)", c: k`
def kurusa_cevir(fiyatlar):
    return {urun: round(tl * 100) for urun, tl in fiyatlar.items()}

print(kurusa_cevir({"kalem": 12.5, "silgi": 6}))
print({ad: len(ad) for ad in ["ada", "linus"]})`, n: "Sözlük kavraması: {anahtar: değer for k, v in d.items()}. Anahtar ile değerin yerini değiştirmek için ikisini ters sırada yaz." },
  py8c3: { t: "Ürünleri sırala: stok azalan, ad artan", c: k`
def stok_sirasi(urunler):
    sirali = sorted(urunler, key=lambda u: (-u[1], u[0]))
    return [ad for ad, stok in sirali]

print(stok_sirasi([("kalem", 5), ("defter", 9), ("silgi", 5)]))`, n: "key bir demet döndürürse sırayla karşılaştırılır. Sayısal ölçütü azalan yapmak için eksi işareti koy: (-puan, ad)." },
  py9c1: { t: "Güvenli liste erişimi", c: k`
def guvenli_al(liste, indeks):
    try:
        return liste[indeks]
    except IndexError:               # yalnızca beklenen hatayı yakala
        return None

print(guvenli_al([10, 20], 1), guvenli_al([10, 20], 5))`, n: "Hata çıkabilecek satırı try'a al, except ile YALNIZCA beklediğin istisnayı yakala. Sıfıra bölmenin istisnası ZeroDivisionError'dır." },
  py9c2: { t: "Not doğrulama", c: k`
def not_dogrula(metin):
    puan = float(metin)              # sayı değilse ValueError fırlatır
    if not 0 <= puan <= 100:
        raise ValueError("not 0 ile 100 arasında olmalı")
    return puan

print(not_dogrula(" 87.5 "))
for girdi in ["yüz", "140"]:
    try:
        not_dogrula(girdi)
    except ValueError as e:
        print("geçersiz:", e)`, n: "int() ve float() geçersiz metinde zaten ValueError fırlatır. Kendi kuralın bozulunca raise ValueError(\"mesaj\") ile sen fırlat." },
  py9c3: { t: "Kirli veride en büyük sayı", c: k`
def en_buyuk_gecerli(degerler):
    en, hatali = None, 0
    for d in degerler:
        try:
            sayi = float(d)
        except ValueError:
            hatali += 1              # atla ve say
            continue
        if en is None or sayi > en:
            en = sayi
    return en, hatali

print(en_buyuk_gecerli(["3.5", "x", "12", ""]))`, n: "Döngünün içinde try/except kullanırsan bozuk bir değer tüm işlemi durdurmaz: hatalıyı say, continue ile sıradakine geç." },
  py10c1: { t: "Alışveriş fişi", stdin: "3\nsüt 42.50\nekmek 12\npeynir 189.90\n", c: k`
n = int(input())
kalemler = []
for _ in range(n):
    ad, fiyat = input().split()
    kalemler.append((ad, float(fiyat)))

toplam = sum(f for _, f in kalemler)
en_ad, en_fiyat = max(kalemler, key=lambda k: k[1])
print(f"Toplam: {toplam:.2f} TL")
print(f"En pahalı: {en_ad} ({en_fiyat:.2f})")`, n: "İlk satır adet, sonra o kadar satır: for _ in range(n). Satırı split ile parçala, sayıları çevir. {x:.2f} iki ondalık yazar." },
  py10c2: { t: "Müzik çalma listesi", stdin: "ekle Yalnız\nekle Deli Mavi\ncal 2\nliste\n", c: k`
import sys

sarkilar = []
for satir in sys.stdin:
    komut, _, arg = satir.strip().partition(" ")     # ilk boşluktan ikiye böl
    if komut == "ekle":
        sarkilar.append([arg.strip(), 0])
    elif komut == "cal":
        i = int(arg) - 1
        if 0 <= i < len(sarkilar):
            sarkilar[i][1] += 1
        else:
            print("Böyle bir şarkı yok")
    elif komut == "liste":
        for no, (ad, kez) in enumerate(sarkilar, 1):
            print(f"{no}. {ad} ({kez} kez)")`, n: "for satir in sys.stdin girdiyi sonuna kadar okur. partition(\" \") komutu ve argümanı ayırır. Durumu bir listede tut; enumerate(liste, 1) numaralar." },
  py10c3: { t: "Stok takibi", stdin: "al 10\nsat 4\nsat 20\nal x\nstok\n", c: k`
import sys

stok = 0
for satir in sys.stdin:
    parcalar = satir.split()
    if not parcalar:
        continue
    if parcalar[0] == "stok":
        print(f"Stok: {stok} adet")
        continue
    try:
        adet = int(parcalar[1])
        if adet <= 0:
            raise ValueError
    except (ValueError, IndexError):
        print("Geçersiz adet")
        continue
    if parcalar[0] == "al":
        stok += adet
    elif parcalar[0] == "sat":
        if adet > stok:
            print("Stok yetersiz")
        else:
            stok -= adet`, n: "Sıra: komutu ayır → argümanı try/except ile doğrula (geçersizse mesaj yaz ve continue) → komutu uygula. Her kuralın ihlali için ayrı mesaj." },

  /* ---------- Python Ders 11–20 ---------- */
  py11c1: { t: "Kumbara sınıfı", c: k`
class Kumbara:
    def __init__(self, sahip):
        self.sahip = sahip
        self.toplam = 0

    def at(self, miktar):
        if miktar <= 0:
            raise ValueError("miktar pozitif olmalı")
        self.toplam += miktar
        return self.toplam

k = Kumbara("Ece")
k.at(20)
print(k.sahip, k.at(5))`, n: "__init__ nesne oluşturulurken çalışır; self.x = ... nesneye özel veridir. Her metodun ilk parametresi self'tir; kural bozulunca raise." },
  py11c2: { t: "Zincirlenebilir metin kurucu", c: k`
class Cumle:
    def __init__(self):
        self.kelimeler = []

    def ekle(self, kelime):
        self.kelimeler.append(kelime)
        return self                     # zincirleme için nesnenin kendisi

    def uzunluk(self):
        return len(self.kelimeler)

    def metin(self):
        return " ".join(self.kelimeler) + "."

c = Cumle().ekle("Kod").ekle("yazarak").ekle("öğren")
print(c.metin(), c.uzunluk())`, n: "Bir metot return self yaparsa çağrılar zincirlenebilir: a.f().g(). Hesap metotları self'in alanlarını kullanıp değer döndürür." },
  py11c3: { t: "Ortak puan tablosu", c: k`
# Hatalı sürüm:
#   class Oyuncu:
#       puanlar = []            ← sınıf gövdesinde: TÜM oyuncular aynı listeyi paylaşır
class Oyuncu:
    def __init__(self, ad):
        self.ad = ad
        self.puanlar = []       # her nesnenin kendi listesi

    def puan_ekle(self, p):
        self.puanlar.append(p)
        return sum(self.puanlar)

a, b = Oyuncu("a"), Oyuncu("b")
a.puan_ekle(10)
print(a.puanlar, b.puanlar)`, n: "Sınıf gövdesine yazılan liste tek bir listedir ve tüm nesnelerce paylaşılır. Nesneye özel listeyi __init__ içinde self.x = [] ile oluştur." },
  py12c1: { t: "Süre (dakika:saniye)", c: k`
class Sure:
    def __init__(self, dakika, saniye):
        toplam = dakika * 60 + saniye
        self.dakika, self.saniye = divmod(toplam, 60)     # her zaman normalleştir

    def __repr__(self):
        return f"{self.dakika}:{self.saniye:02d}"

    def __add__(self, o):
        return Sure(self.dakika + o.dakika, self.saniye + o.saniye)

    def __eq__(self, o):
        return isinstance(o, Sure) and (self.dakika, self.saniye) == (o.dakika, o.saniye)

print(Sure(1, 50) + Sure(0, 25), Sure(0, 90) == Sure(1, 30))`, n: "__init__ içinde değeri standart biçime getirirsen (burada divmod, kesirde gcd) eşitlik ve yazdırma kendiliğinden doğru çalışır. __repr__ yazdırmayı, __add__ +'yı, __eq__ =='yi tanımlar." },
  py12c2: { t: "Sözlük anahtarı olamayan renk", c: k`
class Renk:
    def __init__(self, r, g, b):
        self.r, self.g, self.b = r, g, b

    def __eq__(self, o):
        return isinstance(o, Renk) and (self.r, self.g, self.b) == (o.r, o.g, o.b)

    def __hash__(self):                       # __eq__ varsa __hash__ de gerekir
        return hash((self.r, self.g, self.b))

adlar = {Renk(255, 0, 0): "kırmızı"}
print(adlar[Renk(255, 0, 0)], len({Renk(0, 0, 0), Renk(0, 0, 0)}))`, n: "__eq__ tanımlayınca Python sınıfın hash'ini kaldırır (unhashable). Eşitlikte kullandığın alanların demetinden __hash__ üret." },
  py12c3: { t: "Sıralanabilir sürüm numarası", c: k`
class Surum:
    def __init__(self, metin):
        self.metin = metin
        self.parcalar = tuple(int(p) for p in metin.split("."))

    def __lt__(self, o):                      # sorted, min, max bunu kullanır
        return self.parcalar < o.parcalar

    def __len__(self):
        return len(self.parcalar)

s = sorted([Surum("1.10.0"), Surum("1.2.5"), Surum("1.2")])
print([x.metin for x in s], len(Surum("2.0.1")), max(s).metin)`, n: "sorted, min ve max yalnızca __lt__ (<) ister. Karşılaştırmayı demetlere bırak: (ölçüt1, ölçüt2) < (…). len() için __len__." },
  py13c1: { t: "En sık harfler", c: k`
from collections import Counter

def en_sik_harfler(metin, n):
    harfler = [c for c in metin.lower() if c.isalpha()]
    return Counter(harfler).most_common(n)

print(en_sik_harfler("Kod yazarak ogren", 2))`, n: "Counter(liste) her elemanı sayar; most_common(n) en sık n tanesini (eleman, adet) çiftleri olarak, sıralı verir." },
  py13c2: { t: "Kafiye grupları", c: k`
from collections import defaultdict

def kafiye_gruplari(kelimeler):
    gruplar = defaultdict(list)
    for k in kelimeler:
        gruplar[k[-2:]].append(k)             # anahtar: son iki harf
    return sorted(sorted(g) for g in gruplar.values())

print(kafiye_gruplari(["kalem", "gelen", "elem", "selen", "kod"]))`, n: "Gruplama = her eleman için bir anahtar + defaultdict(list). Anagramlarda anahtar, harflerin sıralanmış hâlidir: \"\".join(sorted(kelime))." },
  py13c3: { t: "Kayan toplam (son k eleman)", c: k`
from collections import deque

def son_k_toplam(sayilar, k):
    pencere = deque(maxlen=k)                 # dolunca en eskisi kendiliğinden düşer
    toplam, sonuc = 0, []
    for x in sayilar:
        if len(pencere) == k:
            toplam -= pencere[0]              # düşecek olanı önce çıkar
        pencere.append(x)
        toplam += x
        sonuc.append(toplam)
    return sonuc

print(son_k_toplam([1, 2, 3, 4, 5], 2))`, n: "deque(maxlen=k) son k elemanı tutar. Her adımda yeniden toplamak yerine süren bir toplam tut: gireni ekle, düşeni çıkar." },
  py14c1: { t: "Sonsuz çift sayı üreteci", c: k`
from itertools import islice

def ciftler(baslangic=0):
    n = baslangic
    while True:                # sonsuz ama sorun değil: istendikçe üretir
        yield n
        n += 2

print(list(islice(ciftler(), 5)), next(ciftler(10)))`, n: "yield değeri verir ve fonksiyonu olduğu yerde dondurur; bir sonraki istekte kaldığı yerden sürer. Durumu yerel değişkenlerde tut." },
  py14c2: { t: "Ardışık farklar", c: k`
def farklar(dizi):
    for i in range(len(dizi) - 1):
        yield dizi[i + 1] - dizi[i]

print(list(farklar([3, 8, 10, 20])), list(farklar([5])))`, n: "Üreteçte sonuç listesi kurmazsın; her değeri yield ile tek tek verirsin. Dilim üretmek için tuple(dizi[i:i + n])." },
  py14c3: { t: "İç içe sözlükteki tüm değerler", c: k`
def degerler(veri):
    for v in veri.values():
        if isinstance(v, dict):
            yield from degerler(v)      # alt üretecin tüm değerlerini aktar
        else:
            yield v

print(list(degerler({"a": 1, "b": {"c": 2, "d": {"e": 3}}, "f": 4})))`, n: "Özyinelemeli üreteç: eleman bir kap ise yield from ile içine in, değilse elemanı yield et. Listelerde isinstance(x, list) ile sor." },
  py15c1: { t: "Selamlayıcı üreticisi", c: k`
def selamlayici(selam):
    def ic(ad):
        return f"{selam}, {ad}!"       # selam dış fonksiyondan hatırlanır
    return ic                           # çağırmadan döndür

gunaydin = selamlayici("Günaydın")
print(gunaydin("Ada"), selamlayici("Selam")("Can"))`, n: "İç fonksiyon, dış fonksiyonun parametresini hatırlar (kapanış). İç fonksiyonu parantezsiz döndürürsün; her çağrı kendi değerini taşır." },
  py15c2: { t: "Çağrıları kaydeden dekoratör", c: k`
import functools

def kaydet(f):
    @functools.wraps(f)                         # adı ve belgeyi korur
    def sarmalayici(*args, **kwargs):
        sonuc = f(*args, **kwargs)
        sarmalayici.gecmis.append((args, sonuc))
        return sonuc
    sarmalayici.gecmis = []                     # fonksiyon da bir nesnedir
    return sarmalayici

@kaydet
def topla(a, b):
    return a + b

topla(1, 2); topla(5, 5)
print(topla.gecmis, topla.__name__)`, n: "Dekoratör iskeleti: f al → *args, **kwargs alan sarmalayıcı yaz → içinde f'yi çağır → sarmalayıcıyı döndür. Durumu sarmalayıcının özelliğinde tutabilirsin." },
  py15c3: { t: "Yeniden deneme dekoratörü", c: k`
import functools

def uc_kez_dene(f):
    @functools.wraps(f)
    def sarmalayici(*args):
        son_hata = None
        for _ in range(3):
            try:
                return f(*args)
            except ValueError as e:
                son_hata = e
        raise son_hata
    return sarmalayici

denemeler = []
@uc_kez_dene
def kararsiz(x):
    denemeler.append(x)
    if len(denemeler) < 3:
        raise ValueError("henüz değil")
    return x * 2

print(kararsiz(21), len(denemeler))`, n: "Dekoratörün içindeki değişkenler çağrılar arasında yaşar. Önbellekte bu bir sözlüktür: anahtar args; args sözlükte yoksa hesapla ve sakla." },
  py16c1: { t: "Sütunun en büyük değeri", c: k`
import csv, io

def sutun_maks(csv_metni, sutun):
    okuyucu = csv.DictReader(io.StringIO(csv_metni))      # her satır bir sözlük
    return max(float(s[sutun]) for s in okuyucu if s[sutun])

veri = "sehir,nufus\n\"Van, merkez\",1.1\nRize,0.3\nBolu,\n"
print(sutun_maks(veri, "nufus"))`, n: "csv.DictReader başlık satırını anahtar yapar ve tırnaklı virgülleri doğru okur. CSV'de her değer metindir: sayı için float(...), boş hücreleri if ile atla." },
  py16c2: { t: "JSON sipariş özeti", c: k`
import json

def siparis_ozeti(metin):
    siparisler = json.loads(metin)                       # JSON → liste/sözlük
    return {
        "adet": len(siparisler),
        "toplam": round(sum(s["tutar"] for s in siparisler), 2),
        "urunler": sorted({s["urun"] for s in siparisler}),
    }

print(siparis_ozeti('[{"urun": "kalem", "tutar": 12.5}, {"urun": "defter", "tutar": 45}, {"urun": "kalem", "tutar": 12.5}]'))`, n: "json.loads metni Python yapısına çevirir. Özetleri sum / len / round ile, tekrarsız sıralı listeyi sorted({...}) küme kavramasıyla çıkar." },
  py16c3: { t: "Sözlükleri sekmeli (TSV) metne yaz", c: k`
import csv, io

def tsv_yaz(kayitlar, sutunlar):
    tampon = io.StringIO()                               # bellekte dosya
    yazici = csv.DictWriter(tampon, fieldnames=sutunlar, delimiter="\t", lineterminator="\n")
    yazici.writeheader()
    yazici.writerows(kayitlar)
    return tampon.getvalue()

print(tsv_yaz([{"ad": "Ada", "sehir": "İzmir"}, {"ad": "Can", "sehir": "Van"}], ["ad", "sehir"]))`, n: "Yazarken io.StringIO'ya yaz, sonunda getvalue() ile metni al. DictWriter başlığı writeheader, satırları writerows ile yazar; lineterminator satır sonunu belirler." },
  py17c1: { t: "Etiketleri (#hashtag) ayıkla", c: k`
import re

def etiketler(metin):
    return re.findall(r"#\w+", metin)

print(etiketler("Bugün #python ve #veri_bilimi çalıştım! #100gün"))
print(re.findall(r"[\w.]+@\w+", "a.b@x ve c@y"))`, n: "re.findall tüm eşleşmeleri liste olarak verir. \\w harf/rakam/alt çizgi, + 'bir ya da daha fazla', [...] karakter kümesidir. Grup gerekiyorsa (?:...) kullan." },
  py17c2: { t: "Ad Soyad → Soyad, Ad", c: k`
import re

def soyad_one(metin):
    return re.sub(r"(\w+) (\w+)", r"\2, \1", metin)

print(soyad_one("Ada Lovelace"))
print(re.sub(r"(\d+):(\d+)", r"\2.\1", "Saat 14:30"))`, n: "Parantezler grup yakalar; değiştirme metninde \\1, \\2 o grupları geri yazar. Böylece parçaların sırasını değiştirebilirsin." },
  py17c3: { t: "Posta kodu doğrula", c: k`
import re

def posta_kodu_gecerli(s):
    # search metnin bir yerinde eşleşme arar: "x34000y" de geçerdi. fullmatch TAMAMININ uymasını ister.
    return re.fullmatch(r"\d{5}", s) is not None

print(posta_kodu_gecerli("34000"), posta_kodu_gecerli("3400"), posta_kodu_gecerli("kod 34000"))`, n: "Doğrulamada re.fullmatch kullan: metnin başında ya da sonunda fazlalık varsa eşleşmez. {5} tam beş tekrar demektir." },
  py18c1: { t: "Yaş hesapla", c: k`
from datetime import date

def yas(dogum, bugun):
    d, b = date.fromisoformat(dogum), date.fromisoformat(bugun)
    return b.year - d.year - ((b.month, b.day) < (d.month, d.day))

print(yas("2000-03-15", "2026-11-10"), yas("2000-12-01", "2026-11-10"))
print((date(2026, 12, 31) - date(2026, 1, 1)).days)`, n: "date.fromisoformat(\"YYYY-AA-GG\") metni tarihe çevirir. İki tarihi çıkarırsan timedelta gelir; gün sayısı .days ile okunur." },
  py18c2: { t: "Hafta sonu mu?", c: k`
from datetime import date

def hafta_sonu_mu(tarih):
    return date.fromisoformat(tarih).weekday() >= 5      # 0 = Pazartesi … 6 = Pazar

AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
print(hafta_sonu_mu("2026-11-14"), hafta_sonu_mu("2026-11-10"), AYLAR[date.fromisoformat("2026-11-10").month - 1])`, n: "weekday() Pazartesi için 0 verir. Türkçe adlar için bir liste hazırla ve bu sayıyı indeks olarak kullan." },
  py18c3: { t: "Öğrenci dataclass'ı", c: k`
from dataclasses import dataclass, field

@dataclass
class Ogrenci:
    ad: str
    sinif: int = 9
    notlar: list = field(default_factory=list)     # her öğrenciye yeni liste

    def ortalama(self):
        return sum(self.notlar) / len(self.notlar) if self.notlar else 0

a, b = Ogrenci("Ada"), Ogrenci("Can", 10)
a.notlar.append(90)
print(a, b.notlar, a.ortalama(), Ogrenci("x") == Ogrenci("x"))`, n: "@dataclass alanlardan __init__, __repr__ ve __eq__ üretir. Varsayılanı olan alanlar sona gelir; liste varsayılanı field(default_factory=list) ile verilir." },
  py19c1: { t: "En büyük 3 puan", c: k`
import heapq

def en_buyuk_k(puanlar, k):
    return heapq.nlargest(k, puanlar)        # tümünü sıralamadan: O(n log k)

print(en_buyuk_k([70, 95, 60, 88, 91], 3))
h = [5, 1, 4]; heapq.heapify(h); print(heapq.heappop(h), h[0])`, n: "heapq.nlargest / nsmallest en büyük ya da en küçük k elemanı sıralı verir. heapify listeyi min-yığına çevirir: en küçük hep h[0]'dadır." },
  py19c2: { t: "Sıralı listede eklenecek konum", c: k`
import bisect

def kac_tane_kucuk(sirali, x):
    return bisect.bisect_left(sirali, x)     # x'ten küçük eleman sayısı = x'in gireceği indeks

notlar = [45, 60, 72, 72, 88]
print(kac_tane_kucuk(notlar, 72), kac_tane_kucuk(notlar, 100), bisect.bisect_right(notlar, 72))`, n: "bisect_left O(log n)'de x'in gireceği en soldaki konumu verir. Eleman gerçekten var mı diye o konuma bak: i < len ve sirali[i] == x." },
  py19c3: { t: "Ulaşılabilen düğüm sayısı (BFS)", c: k`
from collections import deque

def ulasilan(graf, bas):
    gorulen = {bas}
    kuyruk = deque([bas])
    while kuyruk:
        dugum = kuyruk.popleft()
        for komsu in graf.get(dugum, []):
            if komsu not in gorulen:         # döngülerde takılmamak için
                gorulen.add(komsu)
                kuyruk.append(komsu)
    return len(gorulen)

print(ulasilan({"a": ["b", "c"], "b": ["a", "d"], "c": [], "d": [], "e": ["a"]}, "a"))`, n: "BFS = deque + görülenler kümesi. En kısa yol için kuyruğa (düğüm, uzaklık) çiftleri koy; hedefe ilk vardığında uzaklığı döndür." },
  py20c1: { t: "Satış özeti", stdin: "urun,adet,fiyat\nkalem,3,12.5\ndefter,1,45\n", c: k`
import sys, csv

satirlar = list(csv.DictReader(sys.stdin))            # sys.stdin dosya gibi okunur
ciro = sum(int(s["adet"]) * float(s["fiyat"]) for s in satirlar)
print(f"Satır: {len(satirlar)}")
print(f"Ciro: {ciro:.2f}" if satirlar else "Ciro: -")`, n: "csv.DictReader(sys.stdin) standart girdiyi doğrudan okur. Boş veri için ayrı bir çıktı düşün: sıfıra bölmeden önce liste boş mu diye bak." },
  py20c2: { t: "Kategori raporu", stdin: "urun,kategori,fiyat\nkalem,kirtasiye,12\nelma,manav,30\ndefter,kirtasiye,45\n", c: k`
import sys, csv
from collections import defaultdict

gruplar = defaultdict(list)
for s in csv.DictReader(sys.stdin):
    gruplar[s["kategori"]].append(float(s["fiyat"]))

ozet = [(kat, len(f), sum(f)) for kat, f in gruplar.items()]
for kat, adet, toplam in sorted(ozet, key=lambda t: (-t[2], t[0])):
    print(f"{kat}: {adet} ürün, toplam {toplam:.2f}")`, n: "Üç adım: defaultdict(list) ile grupla → her grup için özet demeti kur → (-ölçüt, ad) anahtarıyla sırala ve yazdır." },
  py20c3: { t: "Hizalı fiyat listesi", stdin: "urun,fiyat\nkalem,12\ndefter,45\ncanta,450\nsilgi,6\n", c: k`
import sys, csv

urunler = [(s["urun"], int(s["fiyat"])) for s in csv.DictReader(sys.stdin)]
ucuzlar = sorted(urunler, key=lambda t: (t[1], t[0]))[:3]
print(f"{'Ürün':<10}{'Fiyat':>6}")
for ad, fiyat in ucuzlar:
    print(f"{ad:<10}{fiyat:>6}")`, n: "{x:<10} sola, {x:>6} sağa yaslar; sayı sütun genişliğidir. Başlık satırını da aynı genişliklerle yaz. İlk k için sıralayıp [:k] dilimini al." }
  });
})();
