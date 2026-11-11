/* QUAGEN — görev başına "benzer çözümlü örnek": JavaScript temelleri, Algoritmalar, Backend
 * Her örnek, görevle aynı tekniği FARKLI bir problemde çözülmüş gösterir (worked example → practice).
 * Biçim: { t: başlık, c: çalıştırılabilir kod, n: göreve taşınacak fikir }
 * Kod bloklarında #{ → ${ ve ‵ → ` olarak çevrilir (şablon metinleri için).
 */
(function () {
  const k = (s, ...v) => String.raw(s, ...v).replace(/^\n/, "").replace(/\s+$/, "").replace(/#\{/g, "${").replace(/‵/g, "`");
  window.KD_ORNEKLER = Object.assign(window.KD_ORNEKLER || {}, {
  /* ---------- Faz 1–10: JavaScript temelleri ---------- */
  p1c1: { t: "Vedalaşma metni", c: k`
function vedalas(isim) {
  return ‵Hoşça kal, #{isim}!‵;
}
console.log(vedalas("Ayşe"));`, n: "Ters tırnak içinde ${...} değişkenin değerini metne yerleştirir. Sabit kısım aynı kalır, yalnızca değişen kısım süslü paranteze girer." },
  p1c2: { t: "Sayı mı, değil mi?", c: k`
function sayiMi(deger) {
  return typeof deger === "number";
}
console.log(typeof 42, typeof "42");
console.log(sayiMi(42), sayiMi("42"));`, n: "typeof bir değerin tipini metin olarak verir. Görevde bu metnin kendisini döndürmen yeterli." },
  p1c3: { t: "Kilometreyi mile çevir", c: k`
function kmToMil(km) {
  return km * 0.621371;
}
console.log(kmToMil(10));`, n: "Formülü olduğu gibi ifadeye çevir ve return ile döndür. İşlem önceliği matematikteki gibidir: önce çarpma/bölme, sonra toplama." },
  p2c1: { t: "Üçe bölünüyor mu?", c: k`
function uceBolunurMu(n) {
  return n % 3 === 0;
}
console.log(uceBolunurMu(9), uceBolunurMu(10));`, n: "% bölümden kalanı verir. Kalan 0 ise sayı tam bölünüyordur; karşılaştırmanın sonucu zaten true ya da false'tur." },
  p2c2: { t: "Hava durumu etiketi", c: k`
function havaDurumu(derece) {
  if (derece >= 30) return "sıcak";
  if (derece >= 15) return "ılık";
  if (derece >= 0) return "serin";
  return "soğuk";
}
console.log(havaDurumu(32), havaDurumu(18), havaDurumu(-4));`, n: "Koşulları en yüksek eşikten başlayarak sırala: ilk doğru olan döner, diğerlerine bakılmaz." },
  p2c3: { t: "İndirim hakkı var mı?", c: k`
// Öğrenciler indirim alır; ama 30 yaşından büyükse almaz; ama engelliyse her durumda alır.
function indirimVarMi(ogrenci, yas, engelli) {
  return engelli || (ogrenci && yas <= 30);
}
console.log(indirimVarMi(true, 22, false), indirimVarMi(true, 40, false), indirimVarMi(false, 40, true));`, n: "“Ama” ile birbirini geçersiz kılan kuralları && ve || ile tek ifadede birleştir; en güçlü kural (her durumda geçerli olan) en dışta durur." },
  p3c1: { t: "Çift sayıların toplamı", c: k`
function ciftToplam(n) {
  let toplam = 0;
  for (let i = 2; i <= n; i += 2) {
    toplam += i;
  }
  return toplam;
}
console.log(ciftToplam(10));`, n: "Biriktirme kalıbı: döngüden önce toplam = 0, döngüde toplam += ..., döngüden sonra return." },
  p3c2: { t: "Üs alma (döngüyle)", c: k`
function us(taban, kuvvet) {
  let sonuc = 1;
  for (let i = 0; i < kuvvet; i++) {
    sonuc *= taban;
  }
  return sonuc;
}
console.log(us(2, 10), us(5, 0));`, n: "Çarparak biriktirirken başlangıç değeri 1'dir (çarpmanın etkisiz elemanı). Döngü hiç dönmezse sonuç 1 kalır." },
  p3c3: { t: "Tek / çift etiketleri", c: k`
function tekCift(n) {
  const sonuc = [];
  for (let i = 1; i <= n; i++) {
    if (i % 2 === 0) sonuc.push("çift");
    else sonuc.push(String(i));
  }
  return sonuc;
}
console.log(tekCift(5));`, n: "Boş dizi oluştur, döngüde koşula göre push et, sonunda diziyi döndür. Birden çok koşul varsa en özel olanı önce kontrol et." },
  p4c1: { t: "İki katı (arrow)", c: k`
const ikiKati = (x) => x * 2;
console.log(ikiKati(21));`, n: "Arrow function: (parametre) => ifade. Tek ifade varsa süslü parantez ve return yazılmaz, sonuç kendiliğinden döner." },
  p4c2: { t: "En küçük (Math.min olmadan)", c: k`
function enKucuk(a, b, c) {
  let en = a;
  if (b < en) en = b;
  if (c < en) en = c;
  return en;
}
console.log(enKucuk(7, 3, 5));`, n: "İlkini aday seç, diğerlerini sırayla onunla karşılaştır; daha iyisini bulunca adayı değiştir." },
  p4c3: { t: "Kumbara fabrikası", c: k`
function kumbaraOlustur() {
  let toplam = 0;
  return function (miktar) {
    toplam += miktar;
    return toplam;
  };
}
const benim = kumbaraOlustur();
const senin = kumbaraOlustur();
benim(10);
console.log(benim(5), senin(1));`, n: "İç fonksiyon, dış fonksiyonun değişkenini hatırlar (closure). Her çağrı yeni ve bağımsız bir değişken oluşturur." },
  p5c1: { t: "Dizideki en büyük sayı", c: k`
function enBuyuk(dizi) {
  let en = -Infinity;
  for (const x of dizi) {
    if (x > en) en = x;
  }
  return en;
}
console.log(enBuyuk([3, 9, 4]));`, n: "for...of diziyi eleman eleman dolaşır. Döngüden önce bir başlangıç değeri, içinde güncelleme: toplama için de aynı iskelet." },
  p5c2: { t: "Her elemanı iki kez yaz", c: k`
function ikile(dizi) {
  const sonuc = [];
  for (let i = 0; i < dizi.length; i++) {
    sonuc.push(dizi[i], dizi[i]);
  }
  return sonuc;
}
console.log(ikile([1, 2, 3]));`, n: "Yeni dizi kur, indeksle dolaş, push et. Ters çevirmek için döngüyü sondan (length - 1) başa doğru çalıştırman yeter." },
  p5c3: { t: "Ortak elemanlar", c: k`
function ortaklar(a, b) {
  const sonuc = [];
  for (const x of a) {
    if (b.includes(x) && !sonuc.includes(x)) sonuc.push(x);
  }
  return sonuc;
}
console.log(ortaklar([1, 2, 2, 3], [2, 3, 4]));`, n: "includes ile 'daha önce ekledim mi?' diye sor. Yalnızca eklenmemiş olanı push edersen sıra korunur, tekrar oluşmaz." },
  p6c1: { t: "Ürün nesnesi", c: k`
function urunOlustur(ad, fiyat) {
  return { ad, fiyat, stokta: true };
}
console.log(urunOlustur("kalem", 12));`, n: "{ ad, fiyat } kısa yazımı, { ad: ad, fiyat: fiyat } ile aynıdır: değişken adı anahtar olur." },
  p6c2: { t: "Değerlerin toplamı", c: k`
function degerToplam(nesne) {
  let toplam = 0;
  for (const deger of Object.values(nesne)) toplam += deger;
  return toplam;
}
console.log(Object.keys({ a: 1, b: 2 }));
console.log(degerToplam({ elma: 3, armut: 5 }));`, n: "Object.keys anahtarları, Object.values değerleri dizi olarak verir. Dizi olduğu için length ve döngü kullanabilirsin." },
  p6c3: { t: "Kelime frekansı", c: k`
function kelimeFrekansi(cumle) {
  const sayac = {};
  for (const kelime of cumle.split(" ")) {
    sayac[kelime] = (sayac[kelime] || 0) + 1;
  }
  return sayac;
}
console.log(kelimeFrekansi("kod yaz kod oku"));`, n: "Sayma kalıbı: sayac[x] = (sayac[x] || 0) + 1. İlk görüşte undefined || 0 → 0 olur. Bir metnin karakterleri de for...of ile dolaşılır." },
  p7c1: { t: "KDV'li fiyatlar (map)", c: k`
function kdvli(fiyatlar) {
  return fiyatlar.map((f) => f * 1.2);
}
console.log(kdvli([10, 50, 100]));`, n: "map her elemanı fonksiyondan geçirip aynı uzunlukta yeni bir dizi verir. Fonksiyonun döndürdüğü şey yeni elemandır." },
  p7c2: { t: "Pahalı ürünlerin adları", c: k`
function pahalilar(urunler) {
  return urunler.filter((u) => u.fiyat > 100).map((u) => u.ad);
}
console.log(pahalilar([{ ad: "kalem", fiyat: 12 }, { ad: "çanta", fiyat: 450 }]));`, n: "Önce filter ile seç, sonra map ile yalnızca istediğin alanı al. İkisi zincirlenebilir." },
  p7c3: { t: "Toplam süre (reduce)", c: k`
function toplamSure(dersler) {
  return dersler.reduce((toplam, d) => toplam + d.saat * d.hafta, 0);
}
console.log(toplamSure([{ saat: 2, hafta: 4 }, { saat: 3, hafta: 2 }]));`, n: "reduce(fonksiyon, başlangıç): birikim her turda güncellenir. Başlangıç değerini (0) vermeyi unutma; boş dizide o döner." },
  p8c1: { t: "Aynı kelime mi?", c: k`
function ayniMi(a, b) {
  const temizle = (s) => s.toLowerCase().replaceAll(" ", "");
  return temizle(a) === temizle(b);
}
console.log(ayniMi("Kod Yaz", "kodyaz"));
console.log("abc".split("").reverse().join(""));`, n: "Karşılaştırmadan önce iki tarafı aynı biçime getir (küçük harf, boşluksuz). Metni ters çevirmek: split → reverse → join." },
  p8c2: { t: "Sesli harf say", c: k`
function sesliSay(metin) {
  return metin.toLowerCase().split("").filter((c) => "aeıioöuü".includes(c)).length;
}
console.log(sesliSay("Merhaba Dünya"));
console.log("  çok   boşluk  ".trim().split(/\s+/));`, n: "Böl, süz, say. Kelimeler için trim() ve split(/\\s+/) fazla boşlukları doğru ele alır; boş metni ayrıca kontrol et." },
  p8c3: { t: "Her kelimeyi ters çevir", c: k`
function kelimeleriTersle(cumle) {
  return cumle.split(" ").map((k) => k.split("").reverse().join("")).join(" ");
}
console.log(kelimeleriTersle("kod yaz"));
console.log("m" + "erhaba", "merhaba"[0].toUpperCase(), "merhaba".slice(1));`, n: "Kelimelere böl → her kelimeyi dönüştür → boşlukla birleştir. İlk harf kelime[0], gerisi kelime.slice(1)." },
  p9c1: { t: "Karekök (negatifse hata)", c: k`
function guvenliKarekok(x) {
  if (x < 0) throw new Error("Negatif sayının karekökü alınamaz");
  return Math.sqrt(x);
}
console.log(guvenliKarekok(16));
try { guvenliKarekok(-1); } catch (e) { console.log("Yakalandı:", e.message); }`, n: "Geçersiz girdiyi fonksiyonun başında kontrol et ve throw new Error(mesaj) ile durdur. Mesaj testlerde birebir karşılaştırılır." },
  p9c2: { t: "Güvenli sayı çevirme", c: k`
function sayiyaCevir(metin) {
  try {
    const n = BigInt(metin);      // geçersiz metinde hata fırlatır
    return Number(n);
  } catch (e) {
    return null;
  }
}
console.log(sayiyaCevir("42"), sayiyaCevir("kırk iki"));`, n: "Hata fırlatabilecek satırı try içine al; catch bloğunda programı çökertmeden yedek değeri döndür." },
  p9c3: { t: "İki hatalı 'en uzun kelime'", c: k`
// Hatalı sürüm: (1) i <= uzunluk ile dizi dışına çıkıyor, (2) boş dizide çöküyor.
// function enUzun(k) { let en = k[0]; for (let i = 0; i <= k.length; i++) if (k[i].length > en.length) en = k[i]; return en; }
function enUzun(kelimeler) {
  if (kelimeler.length === 0) return "";          // düzeltme 2
  let en = kelimeler[0];
  for (let i = 0; i < kelimeler.length; i++) {      // düzeltme 1: <= yerine <
    if (kelimeler[i].length > en.length) en = kelimeler[i];
  }
  return en;
}
console.log(enUzun(["kod", "algoritma", "js"]), JSON.stringify(enUzun([])));`, n: "Hata mesajını oku: 'Cannot read properties of undefined' çoğunlukla dizi sınırının aşıldığını gösterir. Sonra uç durumu (boş dizi) dene." },
  p10c1: { t: "Gecikmeli selam", c: k`
function gecikmeliSelam(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Merhaba!"), ms);
  });
}
gecikmeliSelam(100).then((mesaj) => console.log(mesaj));`, n: "new Promise((resolve) => ...) içinde iş bitince resolve(değer) çağrılır. setTimeout'un ikinci argümanı bekleme süresidir." },
  p10c2: { t: "Gelen metni büyüt", c: k`
async function buyukHarf(metinPromise) {
  const metin = await metinPromise;
  return metin.toUpperCase();
}
buyukHarf(Promise.resolve("quagen")).then(console.log);`, n: "await, Promise'in değerini bekleyip verir. async fonksiyonun return ettiği değer kendiliğinden Promise'e sarılır." },
  p10c3: { t: "En büyüğünü paralel bul", c: k`
async function enBuyuk(promiseler) {
  const degerler = await Promise.all(promiseler);
  return Math.max(...degerler);
}
enBuyuk([Promise.resolve(3), Promise.resolve(9), Promise.resolve(4)]).then(console.log);`, n: "Promise.all hepsini aynı anda bekler ve sonuçları aynı sırada bir dizi olarak verir. Sonrası normal dizi işlemidir." },

  /* ---------- Faz 31–40: Algoritmalar ---------- */
  p31c1: { t: "Tek geçişte en büyük iki sayı", c: k`
function enBuyukIki(dizi) {
  let bir = -Infinity, iki = -Infinity;
  for (const x of dizi) {
    if (x > bir) { iki = bir; bir = x; }
    else if (x > iki) iki = x;
  }
  return [bir, iki];
}
console.log(enBuyukIki([4, 9, 2, 7]));`, n: "Sıralamak (O(n log n)) yerine diziyi bir kez dolaşıp gereken değerleri değişkenlerde tut: O(n)." },
  p31c2: { t: "İki dizinin ortak elemanı var mı?", c: k`
function ortakVarMi(a, b) {
  const gorulen = new Set(a);
  for (const x of b) {
    if (gorulen.has(x)) return true;
  }
  return false;
}
console.log(ortakVarMi([1, 2, 3], [9, 3]), ortakVarMi([1], [2]));`, n: "Set.has ortalama O(1)'dir. 'Daha önce gördüm mü?' sorusunu iç içe döngü yerine Set'e sor." },
  p31c3: { t: "Farkı hedef olan çift", c: k`
function farkCifti(dizi, hedef) {
  const konum = new Map();              // değer → indeks
  for (let j = 0; j < dizi.length; j++) {
    const aranan = dizi[j] - hedef;     // dizi[j] - x = hedef  →  x = dizi[j] - hedef
    if (konum.has(aranan)) return [konum.get(aranan), j];
    konum.set(dizi[j], j);
  }
  return null;
}
console.log(farkCifti([1, 8, 5, 3], 2));`, n: "Her elemanda 'bana lazım olan eş' değerini hesapla ve Map'te ara; bulamazsan kendini Map'e ekle. Tek geçiş, O(n)." },
  p32c1: { t: "Aynı rakamlardan mı oluşuyor?", c: k`
function ayniRakamlar(a, b) {
  const say = (n) => {
    const s = {};
    for (const c of String(n)) s[c] = (s[c] || 0) + 1;
    return s;
  };
  const x = say(a), y = say(b);
  return Object.keys(x).length === Object.keys(y).length && Object.keys(x).every((r) => x[r] === y[r]);
}
console.log(ayniRakamlar(1232, 2213), ayniRakamlar(112, 122));`, n: "İki şeyin 'aynı parçalardan' oluştuğunu anlamak için her birinin frekans tablosunu çıkar ve tabloları karşılaştır." },
  p32c2: { t: "İlk tekrar eden karakter", c: k`
function ilkTekrarEden(metin) {
  const gorulen = new Set();
  for (let i = 0; i < metin.length; i++) {
    if (gorulen.has(metin[i])) return i;
    gorulen.add(metin[i]);
  }
  return -1;
}
console.log(ilkTekrarEden("kodlama"), ilkTekrarEden("abc"));`, n: "Görevde iki geçiş gerekir: önce tüm karakterleri say, sonra baştan dolaşıp sayısı 1 olan ilk karakteri bul." },
  p32c3: { t: "Uzunluğa göre grupla", c: k`
function uzunlugaGoreGrupla(kelimeler) {
  const gruplar = new Map();
  for (const k of kelimeler) {
    const anahtar = k.length;
    if (!gruplar.has(anahtar)) gruplar.set(anahtar, []);
    gruplar.get(anahtar).push(k);
  }
  return [...gruplar.values()];
}
console.log(uzunlugaGoreGrupla(["kod", "yaz", "test", "oku", "java"]));`, n: "Gruplama kalıbı: her eleman için bir anahtar üret, Map'te o anahtarın listesine ekle. Anagramlar için anahtar: harflerin sıralanmış hâli." },
  p33c1: { t: "Sıralı dizide farkı hedef olan çift", c: k`
function farkIkili(dizi, hedef) {
  let i = 0, j = 1;
  while (j < dizi.length) {
    const fark = dizi[j] - dizi[i];
    if (i !== j && fark === hedef) return [i, j];
    if (fark < hedef) j++;
    else i++;
    if (i === j) j++;
  }
  return null;
}
console.log(farkIkili([1, 3, 6, 10, 15], 4));`, n: "Dizi sıralıysa iki işaretçi yeter: sonuç küçükse birini, büyükse diğerini oynat. Toplam için işaretçiler iki uçtan başlar." },
  p33c2: { t: "Sıralı dizilerin ortak elemanları", c: k`
function kesisim(a, b) {
  const sonuc = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { sonuc.push(a[i]); i++; j++; }
    else if (a[i] < b[j]) i++;
    else j++;
  }
  return sonuc;
}
console.log(kesisim([1, 3, 5, 7], [3, 4, 5, 8]));`, n: "Her dizinin başında bir işaretçi tut; küçük olanı ilerlet. Birleştirmede küçük olanı sonuca ekleyip ilerletir, sonunda kalanları eklersin." },
  p33c3: { t: "Sıralı dizide en yakın çift toplamı", c: k`
function enYakinToplam(dizi, hedef) {
  let i = 0, j = dizi.length - 1, en = Infinity;
  while (i < j) {
    const t = dizi[i] + dizi[j];
    if (Math.abs(t - hedef) < Math.abs(en - hedef)) en = t;
    if (t < hedef) i++;
    else j--;
  }
  return en;
}
console.log(enYakinToplam([1, 4, 7, 12], 10));`, n: "İki uçtan başla, her adımda en iyi sonucu güncelle ve 'umut vadetmeyen' ucu içeri kaydır. Görevde kısa duvar olan ucu kaydırırsın." },
  p34c1: { t: "k'lı pencerelerin en küçük toplamı", c: k`
function minPencere(dizi, k) {
  if (k > dizi.length) return null;
  let toplam = 0;
  for (let i = 0; i < k; i++) toplam += dizi[i];
  let en = toplam;
  for (let i = k; i < dizi.length; i++) {
    toplam += dizi[i] - dizi[i - k];     // sağdan gireni ekle, soldan çıkanı çıkar
    en = Math.min(en, toplam);
  }
  return en;
}
console.log(minPencere([4, 2, 1, 7, 8, 1], 3));`, n: "Pencereyi baştan toplamak yerine kaydır: yeni giren elemanı ekle, pencereden çıkanı çıkar. Her adım O(1)." },
  p34c2: { t: "En fazla 2 farklı karakterli en uzun parça", c: k`
function enUzunIkiFarkli(metin) {
  const sayac = new Map();
  let sol = 0, en = 0;
  for (let sag = 0; sag < metin.length; sag++) {
    sayac.set(metin[sag], (sayac.get(metin[sag]) || 0) + 1);
    while (sayac.size > 2) {                       // kural bozuldu: soldan daralt
      const c = metin[sol++];
      sayac.set(c, sayac.get(c) - 1);
      if (sayac.get(c) === 0) sayac.delete(c);
    }
    en = Math.max(en, sag - sol + 1);
  }
  return en;
}
console.log(enUzunIkiFarkli("aabcbbb"));`, n: "Değişken boyutlu pencere: sağı genişlet, kural bozulunca solu daralt, her adımda uzunluğu ölç." },
  p34c3: { t: "Toplamı en fazla hedef olan en uzun parça", c: k`
function enUzunAltDizi(hedef, dizi) {
  let sol = 0, toplam = 0, en = 0;
  for (let sag = 0; sag < dizi.length; sag++) {
    toplam += dizi[sag];
    while (toplam > hedef) toplam -= dizi[sol++];
    en = Math.max(en, sag - sol + 1);
  }
  return en;
}
console.log(enUzunAltDizi(7, [2, 1, 5, 1, 3]));`, n: "Aynı iskelet 'en kısa' için de çalışır: koşul sağlandığı sürece soldan daralt ve her daraltmada en kısa uzunluğu güncelle." },
  p35c1: { t: "HTML etiketleri dengeli mi?", c: k`
function etiketlerDengeli(etiketler) {
  const yigin = [];
  for (const e of etiketler) {
    if (!e.startsWith("/")) yigin.push(e);        // açılış: yığına it
    else if (yigin.pop() !== e.slice(1)) return false;   // kapanış: tepedekiyle eşleşmeli
  }
  return yigin.length === 0;
}
console.log(etiketlerDengeli(["div", "p", "/p", "/div"]), etiketlerDengeli(["div", "p", "/div"]));`, n: "Açılanı yığına it; kapanış gelince tepedekini çıkar ve eşleşiyor mu bak. Sonunda yığın boş olmalı." },
  p35c2: { t: "Maks yığın", c: k`
class MaksYigin {
  constructor() { this.veri = []; this.maksler = []; }
  ekle(x) {
    this.veri.push(x);
    const onceki = this.maksler.length ? this.maksler[this.maksler.length - 1] : -Infinity;
    this.maksler.push(Math.max(onceki, x));      // her seviye için o andaki maksimum
  }
  cikar() { this.maksler.pop(); return this.veri.pop(); }
  maks() { return this.maksler[this.maksler.length - 1]; }
}
const y = new MaksYigin();
y.ekle(3); y.ekle(8); y.ekle(5);
console.log(y.maks()); y.cikar(); y.cikar(); console.log(y.maks());`, n: "İkinci bir yığında her seviyenin 'o ana kadarki en iyi' değerini tut: eleman çıkınca eski değer kendiliğinden geri gelir." },
  p35c3: { t: "Kaç gün sonra daha sıcak?", c: k`
function dahaSicakGun(sicakliklar) {
  const sonuc = new Array(sicakliklar.length).fill(0);
  const yigin = [];                               // cevabını bekleyen günlerin indeksleri
  for (let i = 0; i < sicakliklar.length; i++) {
    while (yigin.length && sicakliklar[i] > sicakliklar[yigin[yigin.length - 1]]) {
      const gun = yigin.pop();
      sonuc[gun] = i - gun;
    }
    yigin.push(i);
  }
  return sonuc;
}
console.log(dahaSicakGun([20, 22, 19, 25]));`, n: "Monoton yığın: cevabını bekleyenleri yığında tut; daha büyük bir eleman gelince bekleyenleri çöz. Her eleman bir kez girer, bir kez çıkar: O(n)." },
  p36c1: { t: "Döngüsüz en büyük", c: k`
function enBuyuk(dizi) {
  if (dizi.length === 1) return dizi[0];                 // temel durum
  const kalaninEnBuyugu = enBuyuk(dizi.slice(1));        // daha küçük problem
  return dizi[0] > kalaninEnBuyugu ? dizi[0] : kalaninEnBuyugu;
}
console.log(enBuyuk([3, 9, 4]));`, n: "Özyineleme: (1) temel durum, (2) problemi küçült (ilk eleman + kalanlar), (3) sonuçları birleştir. Toplamda temel durum boş dizidir." },
  p36c2: { t: "Merdiven çıkma yolları (memo)", c: k`
function merdiven(n, hafiza = {}) {
  if (n <= 1) return 1;
  if (hafiza[n] !== undefined) return hafiza[n];        // daha önce hesaplandıysa hazır
  hafiza[n] = merdiven(n - 1, hafiza) + merdiven(n - 2, hafiza);
  return hafiza[n];
}
console.log(merdiven(40));`, n: "Aynı alt problem tekrar tekrar çözülüyorsa sonucu bir nesnede sakla; fonksiyonun başında 'var mı?' diye bak." },
  p36c3: { t: "İç içe dizideki sayıların toplamı", c: k`
function derinToplam(dizi) {
  let toplam = 0;
  for (const x of dizi) {
    if (Array.isArray(x)) toplam += derinToplam(x);     // dizi ise içine in
    else toplam += x;
  }
  return toplam;
}
console.log(derinToplam([1, [2, [3, [4]]], 5]));`, n: "İç içe yapılarda her eleman için sor: dizi mi? Öyleyse aynı fonksiyonu onun için çağır, değilse doğrudan kullan." },
  p37c1: { t: "Sıralı dizide var mı?", c: k`
function varMi(dizi, hedef) {
  let sol = 0, sag = dizi.length - 1;
  while (sol <= sag) {
    const orta = Math.floor((sol + sag) / 2);
    if (dizi[orta] === hedef) return true;
    if (dizi[orta] < hedef) sol = orta + 1;
    else sag = orta - 1;
  }
  return false;
}
console.log(varMi([1, 4, 7, 9, 12], 9), varMi([1, 4, 7], 5));`, n: "Her adımda ortaya bak ve aralığın yarısını at. sol <= sag koşulu ve orta ± 1 güncellemeleri sonsuz döngüyü önler." },
  p37c2: { t: "Son konum", c: k`
function sonKonum(dizi, hedef) {
  let sol = 0, sag = dizi.length - 1, cevap = -1;
  while (sol <= sag) {
    const orta = Math.floor((sol + sag) / 2);
    if (dizi[orta] === hedef) { cevap = orta; sol = orta + 1; }   // bulduk; daha sağda var mı?
    else if (dizi[orta] < hedef) sol = orta + 1;
    else sag = orta - 1;
  }
  return cevap;
}
console.log(sonKonum([1, 2, 2, 2, 5], 2));`, n: "Bulunca durma: adayı kaydet ve aramaya istediğin yönde devam et. İlk konum için sola (sag = orta - 1) devam edersin." },
  p37c3: { t: "Bölme işareti olmadan tam bölüm", c: k`
function tamBolum(a, b) {
  let sol = 0, sag = a, cevap = 0;
  while (sol <= sag) {
    const orta = Math.floor((sol + sag) / 2);
    if (orta * b <= a) { cevap = orta; sol = orta + 1; }    // orta uygun; daha büyüğü var mı?
    else sag = orta - 1;
  }
  return cevap;
}
console.log(tamBolum(47, 5));`, n: "Cevap aralığında ikili arama: 'x uygun mu?' sorusu bir noktaya kadar evet, sonra hayırsa en büyük evet'i ara. Karekök için koşul orta * orta <= n." },
  p38c1: { t: "Seçmeli sıralama (azalan)", c: k`
function azalanSirala(dizi) {
  const d = [...dizi];                             // orijinali değiştirme
  for (let i = 0; i < d.length; i++) {
    let en = i;
    for (let j = i + 1; j < d.length; j++) if (d[j] > d[en]) en = j;
    [d[i], d[en]] = [d[en], d[i]];
  }
  return d;
}
console.log(azalanSirala([3, 9, 1, 7]));`, n: "Bu O(n²)'dir ve 20.000 elemanda yavaş kalır. Görev için birleştirmeli sıralama gerekir: ikiye böl, yarıları sırala, sıralı yarıları birleştir (Faz 33)." },
  p38c2: { t: "En uzun k kelime", c: k`
function enUzunK(kelimeler, k) {
  return [...kelimeler]
    .sort((a, b) => b.length - a.length || a.localeCompare(b))   // uzunluk azalan; eşitse alfabetik
    .slice(0, k);
}
console.log(enUzunK(["kod", "algoritma", "veri", "test"], 2));`, n: "Çok ölçütlü sıralama: birinci ölçüt 0 (eşit) verirse || ikinci ölçüte düşer. Görevde önce frekansları say, sonra bu kalıpla sırala." },
  p38c3: { t: "Çakışan toplantı var mı?", c: k`
function cakismaVarMi(toplantilar) {
  const s = [...toplantilar].sort((a, b) => a[0] - b[0]);     // başlangıca göre sırala
  for (let i = 1; i < s.length; i++) {
    if (s[i][0] < s[i - 1][1]) return true;                   // önceki bitmeden başlıyor
  }
  return false;
}
console.log(cakismaVarMi([[9, 10], [13, 15], [9.5, 11]]));`, n: "Aralık problemlerinde önce başlangıca göre sırala; sonra her aralığı yalnızca bir öncekiyle karşılaştırmak yeter." },
  p39c1: { t: "Listenin uzunluğu ve son düğümü", c: k`
function sonDugum(bas) {
  let dugum = bas, uzunluk = 0, son = null;
  while (dugum !== null) {
    uzunluk++;
    son = dugum;
    dugum = dugum.sonraki;                 // bir sonraki düğüme geç
  }
  return { uzunluk, son: son && son.deger };
}
const liste = { deger: 1, sonraki: { deger: 2, sonraki: { deger: 3, sonraki: null } } };
console.log(sonDugum(liste));`, n: "Bağlı listede dolaşma: dugum = dugum.sonraki. Ters çevirirken okun yönünü değiştirmeden önce 'sonraki'yi bir değişkende sakla." },
  p39c2: { t: "Sondan ikinci düğüm (iki işaretçi)", c: k`
function sondanK(bas, k) {
  let hizli = bas, yavas = bas;
  for (let i = 0; i < k; i++) hizli = hizli.sonraki;   // hızlı, k adım önde başlar
  while (hizli !== null) {
    hizli = hizli.sonraki;
    yavas = yavas.sonraki;
  }
  return yavas.deger;
}
const liste = { deger: 1, sonraki: { deger: 2, sonraki: { deger: 3, sonraki: { deger: 4, sonraki: null } } } };
console.log(sondanK(liste, 2));`, n: "İki işaretçi farklı hızda ya da aralıkla ilerler. Orta için: hızlı iki adım, yavaş bir adım atar; hızlı sona varınca yavaş ortadadır." },
  p39c3: { t: "Listede tekrar eden değer var mı?", c: k`
function tekrarVarMi(bas) {
  const gorulen = new Set();
  for (let d = bas; d !== null; d = d.sonraki) {
    if (gorulen.has(d.deger)) return true;
    gorulen.add(d.deger);
  }
  return false;
}
const liste = { deger: 1, sonraki: { deger: 2, sonraki: { deger: 1, sonraki: null } } };
console.log(tekrarVarMi(liste));`, n: "Döngü için değerleri değil düğümlerin kendisini Set'e koy. Belleksiz çözüm: hızlı ve yavaş işaretçi; döngü varsa bir gün karşılaşırlar." },
  p40c1: { t: "Ağaçtaki düğüm sayısı", c: k`
function dugumSayisi(kok) {
  if (kok === null) return 0;                               // temel durum: boş ağaç
  return 1 + dugumSayisi(kok.sol) + dugumSayisi(kok.sag);   // kendim + sol + sağ
}
const agac = { deger: 1, sol: { deger: 2, sol: null, sag: null }, sag: { deger: 3, sol: { deger: 4, sol: null, sag: null }, sag: null } };
console.log(dugumSayisi(agac));`, n: "Ağaç özyinelemesi: boş ağaç için cevap, sonra sol ve sağ alt ağacın cevaplarını birleştir. Derinlikte birleştirme: 1 + max(sol, sağ)." },
  p40c2: { t: "Her seviyedeki düğüm sayısı", c: k`
function seviyeSayilari(kok) {
  if (!kok) return [];
  const sonuc = [];
  let kuyruk = [kok];
  while (kuyruk.length) {
    sonuc.push(kuyruk.length);                       // bu seviyede kaç düğüm var
    const sonraki = [];
    for (const d of kuyruk) {
      if (d.sol) sonraki.push(d.sol);
      if (d.sag) sonraki.push(d.sag);
    }
    kuyruk = sonraki;
  }
  return sonuc;
}
const agac = { deger: 1, sol: { deger: 2, sol: null, sag: null }, sag: { deger: 3, sol: { deger: 4, sol: null, sag: null }, sag: null } };
console.log(seviyeSayilari(agac));`, n: "Genişlik öncelikli gezinti: bir seviyenin düğümlerini işle, çocuklarını bir sonraki seviye olarak topla." },
  p40c3: { t: "Ulaşılabilir mi?", c: k`
function ulasilirMi(graf, bas, son) {
  const gorulen = new Set([bas]);
  const kuyruk = [bas];
  while (kuyruk.length) {
    const dugum = kuyruk.shift();
    if (dugum === son) return true;
    for (const komsu of graf[dugum] || []) {
      if (!gorulen.has(komsu)) { gorulen.add(komsu); kuyruk.push(komsu); }
    }
  }
  return false;
}
console.log(ulasilirMi({ a: ["b"], b: ["c", "a"], c: [], d: ["a"] }, "a", "c"), ulasilirMi({ a: ["b"], b: [] }, "b", "a"));`, n: "BFS: kuyruk + görülenler kümesi (döngüde takılmamak için). En kısa yol için kuyruğa düğümle birlikte uzaklığını da koy." },

  /* ---------- Faz 41–50: Backend ---------- */
  p41c1: { t: "Dosya adı kalıbı", c: k`
// "rapor-:yil.pdf" kalıbı "rapor-2026.pdf" ile eşleşir ve { yil: "2026" } verir.
function adEslestir(kalip, ad) {
  const k = kalip.split("-"), a = ad.split("-");
  if (k.length !== a.length) return null;
  const params = {};
  for (let i = 0; i < k.length; i++) {
    if (k[i].startsWith(":")) params[k[i].slice(1)] = a[i];   // değişken parça
    else if (k[i] !== a[i]) return null;                       // sabit parça tutmalı
  }
  return params;
}
console.log(adEslestir("rapor-:yil-:ay", "rapor-2026-11"), adEslestir("rapor-:yil", "fatura-2026"));`, n: "Kalıbı ve girdiyi aynı ayraçtan böl, parçaları sırayla karşılaştır: ':' ile başlayan parça değişkendir, diğerleri birebir tutmalı." },
  p41c2: { t: "Komut yönlendirici", c: k`
function komutYonlendirici(komutlar) {
  return function (girdi) {
    const [ad, ...args] = girdi.split(" ");
    const komut = komutlar.find((k) => k.ad === ad);
    if (!komut) return { durum: "hata", mesaj: "Bilinmeyen komut" };
    if (args.length < komut.argSayisi) return { durum: "hata", mesaj: "Eksik argüman" };
    return komut.isle(args);
  };
}
const calistir = komutYonlendirici([{ ad: "topla", argSayisi: 2, isle: ([a, b]) => ({ durum: "tamam", sonuc: Number(a) + Number(b) }) }]);
console.log(calistir("topla 2 3"), calistir("sil"), calistir("topla 2"));`, n: "Yönlendirici, tabloyu hatırlayan bir fonksiyon döndürür. Önce en genel hatayı (hiç eşleşme yok), sonra daha özel hatayı kontrol et." },
  p41c3: { t: "Çerez (cookie) başlığını ayrıştır", c: k`
function cerezAyristir(baslik) {
  const sonuc = {};
  if (!baslik) return sonuc;
  for (const parca of baslik.split("; ")) {
    const [ad, deger = ""] = parca.split("=");
    sonuc[ad] = decodeURIComponent(deger);
  }
  return sonuc;
}
console.log(cerezAyristir("tema=koyu; ad=Ay%C5%9Fe"), cerezAyristir(""));`, n: "Önce büyük ayraçtan, sonra küçük ayraçtan böl; değerleri decodeURIComponent ile çöz. Sorgu dizesinde ayraçlar ?, & ve = olur." },
  p42c1: { t: "Kurallarla ürün doğrulama", c: k`
function urunDogrula(urun, kurallar) {
  const hatalar = [];
  for (const [alan, kural] of Object.entries(kurallar)) {
    const deger = urun[alan];
    if (deger === undefined) { if (kural.zorunlu) hatalar.push(alan + " eksik"); continue; }
    if (kural.enAz !== undefined && deger < kural.enAz) hatalar.push(alan + " en az " + kural.enAz + " olmalı");
  }
  return hatalar;
}
console.log(urunDogrula({ fiyat: -5 }, { ad: { zorunlu: true }, fiyat: { enAz: 0 } }));`, n: "Şemayı dolaş, her alan için kuralları sırayla dene, ilk hatada o alanı bırak (continue). Hataları fırlatma, dizide topla." },
  p42c2: { t: "Fonksiyon borusu (pipe)", c: k`
function boru(...adimlar) {
  return function (deger) {
    let sonuc = deger;
    for (const adim of adimlar) sonuc = adim(sonuc);
    return sonuc;
  };
}
const temizle = boru((s) => s.trim(), (s) => s.toLowerCase(), (s) => s.replaceAll(" ", "-"));
console.log(temizle("  Merhaba Dünya "));`, n: "Ara katman zincirinde her katman, 'sonraki'yi çağırıp çağırmamaya kendisi karar verir: sonraki = () => katmanlar[i + 1](istek, ...) biçiminde iç içe kur." },
  p42c3: { t: "Bakım modu katmanı", c: k`
function bakimModu(acik) {
  return function (istek, sonraki) {
    if (acik && istek.yol !== "/saglik") return { status: 503, body: { hata: "Bakımdayız" } };
    return sonraki();
  };
}
const katman = bakimModu(true);
console.log(katman({ yol: "/kurslar" }, () => ({ status: 200 })), katman({ yol: "/saglik" }, () => ({ status: 200 })));`, n: "Ayar alan fonksiyon, asıl katmanı döndürür. Katman ya erken bir yanıt döndürür ya da sonraki() ile zinciri sürdürür." },
  p43c1: { t: "Baytları onaltılık metne çevir", c: k`
function hex(baytlar) {
  return [...baytlar].map((b) => b.toString(16).padStart(2, "0")).join("");
}
console.log(hex(new Uint8Array([0, 15, 255])));
crypto.subtle.digest("SHA-1", new TextEncoder().encode("abc")).then((ozet) => console.log(hex(new Uint8Array(ozet))));`, n: "digest bir ArrayBuffer döndürür: new Uint8Array(...) ile baytlara çevir. Her bayt iki haneli olmalı: padStart(2, \"0\")." },
  p43c2: { t: "HMAC ile mesaj imzalama", c: k`
async function imzala(mesaj, gizli) {
  const enc = new TextEncoder();
  const anahtar = await crypto.subtle.importKey("raw", enc.encode(gizli), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const imza = await crypto.subtle.sign("HMAC", anahtar, enc.encode(mesaj));
  return [...new Uint8Array(imza)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
imzala("merhaba", "gizli-anahtar").then((i) => console.log(i.slice(0, 16) + "…"));`, n: "Web Crypto iki adımdır: importKey ile anahtarı içe al, sonra işlemi yap. PBKDF2'de importKey(..., \"PBKDF2\", false, [\"deriveBits\"]) ve deriveBits kullanılır." },
  p43c3: { t: "Süreli bağlantı (imzalı)", c: k`
const b64 = (s) => btoa(unescape(encodeURIComponent(s)));
async function imza(metin, gizli) {
  const enc = new TextEncoder();
  const anahtar = await crypto.subtle.importKey("raw", enc.encode(gizli), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign("HMAC", anahtar, enc.encode(metin)))));
}
async function baglantiUret(dosya, gizli) { return dosya + "?imza=" + (await imza(dosya, gizli)); }
async function baglantiGecerli(baglanti, gizli) {
  const [dosya, gelen] = baglanti.split("?imza=");
  return gelen === (await imza(dosya, gizli));            // imzayı yeniden hesapla ve karşılaştır
}
baglantiUret("/rapor.pdf", "s3cr3t").then(async (b) => console.log(await baglantiGecerli(b, "s3cr3t"), await baglantiGecerli(b.replace("rapor", "maas"), "s3cr3t")));`, n: "İmzalı veri = veri + imza. Doğrularken gelen imzaya güvenme: veriden imzayı yeniden üret ve gelenle karşılaştır." },
  p44c1: { t: "Frontend kurslarının adları", sql: true, c: k`
SELECT ad
FROM kurslar
WHERE kategori = 'frontend'
ORDER BY ad;`, n: "SELECT ile yalnızca istenen sütunu seç, WHERE ile süz, ORDER BY ile sırala. Metinler tek tırnak içinde yazılır." },
  p44c2: { t: "Uzun kurslar, en uzundan kısaya", sql: true, c: k`
SELECT ad, sure
FROM kurslar
WHERE sure > 20
ORDER BY sure DESC;`, n: "Karşılaştırmada > 'büyük', >= 'büyük ya da eşit' demektir. DESC büyükten küçüğe sıralar." },
  p44c3: { t: "Puanı girilmemiş kayıtlar", sql: true, c: k`
-- Hatalı: WHERE puan = NULL hiçbir satır döndürmez; NULL hiçbir şeye eşit değildir.
SELECT ogrenci_id, kurs_id
FROM kayitlar
WHERE puan IS NULL;`, n: "NULL 'bilinmiyor' demektir; = ile karşılaştırılamaz. Boş değerler IS NULL, dolu değerler IS NOT NULL ile bulunur." },
  p45c1: { t: "Kategori başına kurs sayısı", sql: true, c: k`
SELECT kategori, COUNT(*) AS adet
FROM kurslar
GROUP BY kategori
ORDER BY adet DESC, kategori ASC;`, n: "GROUP BY satırları gruplar, COUNT(*) her grubu sayar. Gruplamadan ÖNCE süzmek için WHERE kullanılır." },
  p45c2: { t: "Kategori başına ortalama süre", sql: true, c: k`
SELECT kategori, ROUND(AVG(sure), 1) AS ortalama
FROM kurslar
GROUP BY kategori
ORDER BY ortalama DESC;`, n: "AVG ortalamayı hesaplar, ROUND(x, 1) bir ondalığa yuvarlar. AS ile verdiğin adı ORDER BY'da kullanabilirsin." },
  p45c3: { t: "Birden çok öğrencisi olan şehirler", sql: true, c: k`
SELECT sehir, COUNT(*) AS adet
FROM ogrenciler
WHERE sehir IS NOT NULL
GROUP BY sehir
HAVING COUNT(*) >= 2
ORDER BY sehir;`, n: "WHERE satırları gruplamadan önce, HAVING grupları gruplamadan sonra süzer. Grup sayısına koşul HAVING ile verilir." },
  p46c1: { t: "SQL kursuna kayıtlı öğrenciler", sql: true, c: k`
SELECT o.ad
FROM kayitlar k
JOIN ogrenciler o ON o.id = k.ogrenci_id
JOIN kurslar ku ON ku.id = k.kurs_id
WHERE ku.ad = 'SQL'
ORDER BY o.ad;`, n: "JOIN ... ON iki tabloyu ortak sütun üzerinden birleştirir. Tablolara kısa ad (o, k) verip sütunları o.ad biçiminde yaz." },
  p46c2: { t: "Kimsenin 95 ve üzeri almadığı kurslar", sql: true, c: k`
SELECT ku.ad
FROM kurslar ku
LEFT JOIN kayitlar k ON k.kurs_id = ku.id AND k.puan >= 95
WHERE k.kurs_id IS NULL
ORDER BY ku.ad;`, n: "LEFT JOIN soldaki tüm satırları tutar; eşleşme yoksa sağ taraf NULL gelir. 'Eşi olmayanlar' = sağ tarafı NULL olanlar." },
  p46c3: { t: "Şehir başına toplam kayıt", sql: true, c: k`
SELECT o.sehir, COUNT(*) AS kayit
FROM kayitlar k
JOIN ogrenciler o ON o.id = k.ogrenci_id
WHERE o.sehir IS NOT NULL
GROUP BY o.sehir
ORDER BY kayit DESC;`, n: "Önce JOIN ile gereken sütunları yan yana getir, sonra GROUP BY ile özetle. Toplam para için COUNT yerine SUM(sütun) kullanılır." },
  p47c1: { t: "Yeni öğrenci ekle", sql: true, c: k`
INSERT INTO ogrenciler (id, ad, sehir, yas, kayit_tarihi)
VALUES (9, 'Selin', 'Antalya', 26, '2026-05-01');
SELECT * FROM ogrenciler WHERE id = 9;`, n: "Sütun listesindeki sıra ile VALUES içindeki sıra birebir eşleşmeli. Sütunları her zaman açıkça yaz." },
  p47c2: { t: "İzmirli öğrencilerin yaşını güncelle", sql: true, c: k`
UPDATE ogrenciler
SET yas = yas + 1
WHERE sehir = 'İzmir';
SELECT ad, sehir, yas FROM ogrenciler ORDER BY id;`, n: "UPDATE'te WHERE yazmazsan TÜM satırlar değişir. SET içinde sütunun eski değerini kullanabilirsin; yuvarlamak için ROUND." },
  p47c3: { t: "Kursu kayıtlarıyla birlikte sil", sql: true, c: k`
BEGIN;
DELETE FROM kayitlar WHERE kurs_id = 6;
DELETE FROM kurslar WHERE id = 6;
COMMIT;
SELECT COUNT(*) AS kalan_kurs FROM kurslar;`, n: "BEGIN … COMMIT arasındaki komutlar ya hep birlikte uygulanır ya hiç. Önce bağımlı satırları (çocuk), sonra asıl satırı sil." },
  p48c1: { t: "Siparişler tablosu", sql: true, c: k`
CREATE TABLE siparisler (
  id INTEGER PRIMARY KEY,
  ogrenci_id INTEGER NOT NULL REFERENCES ogrenciler(id),
  tutar INTEGER NOT NULL CHECK (tutar > 0),
  durum TEXT NOT NULL DEFAULT 'bekliyor'
);
INSERT INTO siparisler (ogrenci_id, tutar) VALUES (1, 1200);
SELECT * FROM siparisler;`, n: "Kısıtlar sütun tanımının yanına yazılır: NOT NULL, REFERENCES tablo(sütun), CHECK (koşul). Aralık için CHECK (x BETWEEN a AND b)." },
  p48c2: { t: "Benzersiz kupon kodu", sql: true, c: k`
CREATE TABLE kuponlar (
  id INTEGER PRIMARY KEY,
  kod TEXT NOT NULL UNIQUE,
  indirim INTEGER
);
INSERT INTO kuponlar (kod, indirim) VALUES ('BAHAR', 20);
SELECT * FROM kuponlar;`, n: "UNIQUE aynı değerin iki kez eklenmesini veritabanı düzeyinde engeller; NOT NULL ile birlikte kullanılabilir." },
  p48c3: { t: "Şehre göre aramayı hızlandır", sql: true, c: k`
CREATE INDEX idx_ogrenciler_sehir ON ogrenciler (sehir);
EXPLAIN QUERY PLAN SELECT ad FROM ogrenciler WHERE sehir = 'İzmir';`, n: "CREATE INDEX ad ON tablo (sütun). EXPLAIN QUERY PLAN çıktısında SCAN yerine 'SEARCH ... USING INDEX' görürsen indeks kullanılıyor demektir." },
  p49c1: { t: "'Daha fazla yükle' (imleçli)", c: k`
function dahaFazla(dizi, baslangic, adet) {
  const veri = dizi.slice(baslangic, baslangic + adet);
  const sonraki = baslangic + adet < dizi.length ? baslangic + adet : null;
  return { veri, sonraki };
}
console.log(dahaFazla(["a", "b", "c", "d", "e"], 0, 2), dahaFazla(["a", "b", "c"], 2, 2));`, n: "Sayfalamanın özü slice'tır. Sayfa numaralı sürümde başlangıç = (sayfa - 1) × boyut, toplam sayfa = Math.ceil(uzunluk / boyut)." },
  p49c2: { t: "Süreli (TTL) önbellek", c: k`
class SureliOnbellek {
  constructor(omurMs, saat) { this.omur = omurMs; this.saat = saat; this.veri = new Map(); }
  koy(anahtar, deger) { this.veri.set(anahtar, { deger, bitis: this.saat() + this.omur }); }
  al(anahtar) {
    const kayit = this.veri.get(anahtar);
    if (!kayit) return undefined;
    if (this.saat() > kayit.bitis) { this.veri.delete(anahtar); return undefined; }
    return kayit.deger;
  }
}
let simdi = 0;
const o = new SureliOnbellek(100, () => simdi);
o.koy("a", 1); console.log(o.al("a")); simdi = 150; console.log(o.al("a"));`, n: "Map ekleme sırasını korur: en eski anahtar map.keys().next().value ile bulunur. LRU'da 'taze yapmak' = silip yeniden eklemek." },
  p49c3: { t: "Sabit pencereli sayaç", c: k`
function gunlukKota(limit, saat) {
  const sayac = new Map();                              // "kullanıcı|gün" → adet
  return function izinVer(kullanici) {
    const gun = Math.floor(saat() / 86400000);
    const anahtar = kullanici + "|" + gun;
    const n = sayac.get(anahtar) || 0;
    if (n >= limit) return false;
    sayac.set(anahtar, n + 1);
    return true;
  };
}
const izin = gunlukKota(2, () => 1000);
console.log(izin("ece"), izin("ece"), izin("ece"), izin("can"));`, n: "Kayan pencerede sayaç yerine her kullanıcının istek zamanlarını dizide tut; her istekte pencereden eski olanları at, kalanı say." },
  p50c1: { t: "Şehre göre öğrenciler (parametreli sorgu)", db: true, c: k`
function ogrencileriListele(istek) {
  // Tehlikeli: "... WHERE sehir = '" + istek.sorgu.sehir + "'"  → SQL enjeksiyonu
  const satirlar = sorgu("SELECT id, ad FROM ogrenciler WHERE sehir = ? ORDER BY id", [istek.sorgu.sehir]);
  return { status: 200, body: satirlar };
}
console.log(ogrencileriListele({ sorgu: { sehir: "İzmir" } }));
console.log(ogrencileriListele({ sorgu: { sehir: "x' OR '1'='1" } }));`, n: "Kullanıcıdan gelen değeri asla SQL metnine ekleme: yerine ? koy ve değeri ikinci argümanda dizi olarak ver." },
  p50c2: { t: "Öğrenci ekle (doğrula → ekle → 201)", db: true, c: k`
function ogrenciEkle(istek) {
  const { ad, yas } = istek.govde;
  const hatalar = [];
  if (typeof ad !== "string" || ad.trim().length < 2) hatalar.push("ad en az 2 karakter");
  if (typeof yas !== "number" || yas < 0) hatalar.push("yas 0 veya daha büyük olmalı");
  if (hatalar.length) return { status: 400, body: { hatalar } };
  const { sonId } = calistir("INSERT INTO ogrenciler (ad, yas) VALUES (?, ?)", [ad.trim(), yas]);
  return { status: 201, body: { id: sonId, ad: ad.trim(), yas } };
}
console.log(ogrenciEkle({ govde: { ad: "Selin", yas: 26 } }), ogrenciEkle({ govde: { ad: "S", yas: -1 } }));`, n: "Uç noktanın iskeleti: girdiyi doğrula (hata varsa 400), veritabanına yaz, oluşan kaydı 201 ile döndür. calistir, eklenen satırın id'sini sonId olarak verir." },
  p50c3: { t: "Öğrenci özeti (LEFT JOIN + 404)", db: true, c: k`
function ogrenciOzeti(istek) {
  const [satir] = sorgu(
    "SELECT o.id, o.ad, COUNT(k.kurs_id) AS kursSayisi, MAX(k.puan) AS enYuksek " +
    "FROM ogrenciler o LEFT JOIN kayitlar k ON k.ogrenci_id = o.id WHERE o.id = ? GROUP BY o.id",
    [Number(istek.params.id)]
  );
  if (!satir) return { status: 404, body: { hata: "Öğrenci bulunamadı" } };
  return { status: 200, body: satir };
}
console.log(ogrenciOzeti({ params: { id: "1" } }), ogrenciOzeti({ params: { id: "8" } }), ogrenciOzeti({ params: { id: "99" } }));`, n: "LEFT JOIN sayesinde hiç kaydı olmayan satır da gelir (sayı 0, toplama fonksiyonları NULL). Hiç satır gelmediyse kayıt yoktur: 404." }
  });
})();
