/* QUAGEN Rehber — Türkçe başvuru verisi
 * Her "kavram" bir niyettir ("metni büyük harfe çevirmek"); her dil için o niyetin karşılığı ayrı bir girdidir.
 * Böylece arama, dil fark etmeksizin niyeti bulur ve diğer dillerdeki karşılıkları yan yana gösterir.
 *
 * Girdi: { ad, sozdizimi, aciklama, ornek, not?, tur? }
 *   tur: örneğin nasıl çalıştırılacağı ("html" → canlı önizleme, "yok" → çalıştırılmaz). Varsayılan: dilin kendisi.
 * Kod bloklarında #{ ifadesi ${ olarak yazılır (JavaScript şablon metinleri için).
 */
(function () {
  const k = (s, ...v) => String.raw(s, ...v).replace(/^\n/, "").replace(/\s+$/, "").replace(/#\{/g, "${");

  const DILLER = {
    js: { ad: "JavaScript", kisa: "JS", renk: "#f7df1e" },
    py: { ad: "Python", kisa: "Py", renk: "#4b8bbe" },
    c: { ad: "C", kisa: "C", renk: "#a8b9cc" },
    sql: { ad: "SQL", kisa: "SQL", renk: "#e38c00" },
    html: { ad: "HTML", kisa: "HTML", renk: "#e34c26" },
    css: { ad: "CSS", kisa: "CSS", renk: "#2965f1" }
  };

  /* SQL örnekleri bu küçük veritabanı üzerinde çalışır */
  const SQL_DB = k`
CREATE TABLE ogrenciler (id INTEGER PRIMARY KEY, ad TEXT, sehir TEXT, puan INTEGER);
INSERT INTO ogrenciler (ad, sehir, puan) VALUES ('Ada', 'İzmir', 90), ('Can', 'Ankara', 72), ('Ece', 'İzmir', 85), ('Bora', 'Van', 78), ('Deniz', 'Ankara', NULL);
CREATE TABLE kurslar (id INTEGER PRIMARY KEY, ad TEXT);
INSERT INTO kurslar (ad) VALUES ('JavaScript'), ('Python'), ('C');
CREATE TABLE kayitlar (ogrenci_id INTEGER, kurs_id INTEGER);
INSERT INTO kayitlar VALUES (1, 1), (1, 2), (2, 2), (3, 3), (4, 1);
`;

  const KATEGORILER = ["Metin", "Sayılar", "Listeler ve diziler", "Sözlük ve nesne", "Kontrol akışı", "Fonksiyonlar", "Değişkenler ve türler", "Hatalar", "Girdi ve çıktı", "Nesne yönelimli", "Zaman ve veri biçimleri", "Bellek", "Web sayfası (HTML)", "Görünüm (CSS)", "Sayfa etkileşimi (DOM)", "Veritabanı (SQL)"];

  const KAVRAMLAR = [
  /* ============================== METİN ============================== */
  {
    id: "buyuk-harf", baslik: "Metni büyük harfe çevirmek", kategori: "Metin",
    niyet: ["büyük harf", "büyük harfe çevir", "harfleri büyüt", "hepsini büyük yap", "uppercase", "majuskül", "capslock", "büyük harfli yazmak"],
    diller: {
      js: { ad: "toUpperCase()", sozdizimi: "metin.toUpperCase()\nmetin.toLocaleUpperCase(\"tr\")",
        aciklama: "Metnin tüm harflerini büyük harfe çevrilmiş **yeni** bir metin döndürür; orijinal metin değişmez. Türkçe metinlerde `i → İ` dönüşümü için `toLocaleUpperCase(\"tr\")` kullan.",
        ornek: k`
const sehir = "izmir";
console.log(sehir.toUpperCase());              // IZMIR (Türkçe değil)
console.log(sehir.toLocaleUpperCase("tr"));    // İZMİR
console.log(sehir);                            // izmir: değişmedi`,
        not: "Metinler değiştirilemez: `s.toUpperCase()` tek başına bir şey yapmaz, sonucu bir değişkene ata." },
      py: { ad: "str.upper()", sozdizimi: "metin.upper()",
        aciklama: "Tüm harfleri büyük olan yeni bir metin döndürür. Yalnızca baş harfi büyütmek için `capitalize()`, her kelimenin baş harfi için `title()`.",
        ornek: k`
ad = "ada lovelace"
print(ad.upper())        # ADA LOVELACE
print(ad.capitalize())   # Ada lovelace
print(ad.title())        # Ada Lovelace
print("ı".upper(), "i".upper())  # I I  (Türkçe İ değil)`,
        not: "Python'un upper() fonksiyonu Türkçe kurallarını bilmez: \"i\".upper() → \"I\". Türkçe için önce \"i\" → \"İ\" değiştirmesi yapılır: s.replace(\"i\", \"İ\").upper()." },
      c: { ad: "toupper()", sozdizimi: "#include <ctype.h>\nint toupper(int c);",
        aciklama: "Tek bir karakteri büyük harfe çevirir. Bütün bir metni çevirmek için karakter karakter döngü kurulur. Yalnızca İngilizce harflerde çalışır.",
        ornek: k`
#include <stdio.h>
#include <ctype.h>

int main(void) {
    char s[] = "merhaba quagen";
    for (int i = 0; s[i]; i++)
        s[i] = (char)toupper((unsigned char)s[i]);
    printf("%s\n", s);
    return 0;
}`,
        not: "char'ı unsigned char'a dönüştürerek ver; negatif değerler tanımsız davranıştır." },
      sql: { ad: "UPPER()", sozdizimi: "UPPER(sütun)", aciklama: "Sorgu sonucunda metni büyük harfle döndürür; tablodaki veri değişmez.",
        ornek: k`
SELECT ad, UPPER(sehir) AS sehir FROM ogrenciler;` },
      css: { ad: "text-transform: uppercase", sozdizimi: "seçici { text-transform: uppercase; }",
        aciklama: "Metni yalnızca **görünüşte** büyük harfle gösterir; HTML'deki metin değişmez (kopyalayınca orijinali gelir). `lang=\"tr\"` verilirse Türkçe kurallar uygulanır.",
        ornek: k`
<p lang="tr" style="text-transform: uppercase">istanbul, iğdır, izmir</p>
<p style="text-transform: capitalize">her kelimenin baş harfi</p>`, tur: "html" }
    }
  },
  {
    id: "kucuk-harf", baslik: "Metni küçük harfe çevirmek", kategori: "Metin",
    niyet: ["küçük harf", "küçük harfe çevir", "harfleri küçült", "lowercase", "büyük küçük harf duyarsız karşılaştır"],
    diller: {
      js: { ad: "toLowerCase()", sozdizimi: "metin.toLowerCase()\nmetin.toLocaleLowerCase(\"tr\")", aciklama: "Tüm harfleri küçük olan yeni bir metin döndürür. Büyük/küçük harf duyarsız karşılaştırma için iki tarafı da küçültürsün.",
        ornek: k`
const giris = "QuAgEn";
console.log(giris.toLowerCase());                 // quagen
console.log("IŞIK".toLocaleLowerCase("tr"));       // ışık
console.log("Ada".toLowerCase() === "ADA".toLowerCase()); // true` },
      py: { ad: "str.lower()", sozdizimi: "metin.lower()\nmetin.casefold()", aciklama: "Küçük harfli yeni metin döndürür. Dil bağımsız karşılaştırma için daha güçlü olan `casefold()` da vardır.",
        ornek: k`
print("QuAgEn".lower())                 # quagen
print("Ada".lower() == "ADA".lower())   # True` },
      c: { ad: "tolower()", sozdizimi: "#include <ctype.h>\nint tolower(int c);", aciklama: "Tek bir karakteri küçük harfe çevirir; metin için döngü kurulur.",
        ornek: k`
#include <stdio.h>
#include <ctype.h>

int main(void) {
    char s[] = "QUAGEN";
    for (char *p = s; *p; p++) *p = (char)tolower((unsigned char)*p);
    printf("%s\n", s);
    return 0;
}` },
      sql: { ad: "LOWER()", sozdizimi: "LOWER(sütun)", aciklama: "Metni küçük harfle döndürür. Büyük/küçük harf duyarsız arama için sık kullanılır.",
        ornek: k`
SELECT ad FROM ogrenciler WHERE LOWER(ad) = 'ada';` }
    }
  },
  {
    id: "metin-uzunlugu", baslik: "Metnin uzunluğunu bulmak", kategori: "Metin",
    niyet: ["metin uzunluğu", "kaç karakter", "karakter sayısı", "harf sayısı", "length", "uzunluk"],
    diller: {
      js: { ad: "length", sozdizimi: "metin.length", aciklama: "Metindeki UTF-16 kod birimi sayısını verir. Fonksiyon değil özelliktir: parantez yazılmaz.",
        ornek: k`
console.log("QUAGEN".length);   // 6
console.log("".length);         // 0
console.log([..."😀"].length, "😀".length); // 1 2  (emoji iki birim)` },
      py: { ad: "len()", sozdizimi: "len(metin)", aciklama: "Metindeki karakter sayısını verir. Aynı fonksiyon listelerde, sözlüklerde ve kümelerde de çalışır.",
        ornek: k`
print(len("QUAGEN"))   # 6
print(len(""))         # 0
print(len("çğış"))     # 4` },
      c: { ad: "strlen()", sozdizimi: "#include <string.h>\nsize_t strlen(const char *s);", aciklama: "Sondaki '\\0' karakterine kadar olan bayt sayısını verir. Türkçe karakterler UTF-8'de 2 bayt olduğu için harf sayısından büyük çıkabilir.",
        ornek: k`
#include <stdio.h>
#include <string.h>

int main(void) {
    printf("%zu\n", strlen("QUAGEN"));  /* 6 */
    printf("%zu\n", strlen("ç"));       /* 2: UTF-8'de iki bayt */
    return 0;
}`, not: "strlen her çağrıda metni baştan sayar (O(n)). Döngü koşulunda tekrar tekrar çağırma." },
      sql: { ad: "LENGTH()", sozdizimi: "LENGTH(sütun)", aciklama: "Metnin karakter sayısını döndürür.", ornek: k`
SELECT ad, LENGTH(ad) AS uzunluk FROM ogrenciler ORDER BY uzunluk DESC;` }
    }
  },
  {
    id: "metin-bolme", baslik: "Metni parçalara bölmek", kategori: "Metin",
    niyet: ["metni böl", "virgülden ayır", "kelimelere ayır", "split", "parçala", "ayraçla ayırmak", "boşluktan bölmek", "satırlara ayır"],
    diller: {
      js: { ad: "split()", sozdizimi: "metin.split(ayraç, sınır?)", aciklama: "Metni ayraçtan böler ve bir dizi döndürür. Ayraç düzenli ifade de olabilir.",
        ornek: k`
console.log("elma,armut,muz".split(","));        // ["elma", "armut", "muz"]
console.log("  çok   boşluk ".trim().split(/\s+/)); // ["çok", "boşluk"]
console.log("abc".split(""));                    // ["a", "b", "c"]` },
      py: { ad: "str.split()", sozdizimi: "metin.split(ayraç=None, maxsplit=-1)", aciklama: "Ayraçtan böler, liste döndürür. Ayraç verilmezse tüm boşluk türlerinden böler ve boş parçaları atar.",
        ornek: k`
print("elma,armut,muz".split(","))     # ['elma', 'armut', 'muz']
print("  çok   boşluk ".split())       # ['çok', 'boşluk']
print("a=b=c".split("=", 1))           # ['a', 'b=c']
print("satır1\nsatır2".splitlines())   # ['satır1', 'satır2']` },
      c: { ad: "strtok()", sozdizimi: "#include <string.h>\nchar *strtok(char *s, const char *ayraclar);", aciklama: "Metni ayraçlardan böler; ilk çağrıda metni, sonrakilerde NULL verirsin. Metni yerinde değiştirir (ayraçlara '\\0' yazar).",
        ornek: k`
#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "elma,armut,muz";
    for (char *p = strtok(s, ","); p; p = strtok(NULL, ","))
        printf("[%s]\n", p);
    return 0;
}`, not: "strtok sabit metinlerde (\"...\" literal) çalışmaz, çünkü onları değiştirir; char dizisi kullan." }
    }
  },
  {
    id: "metin-birlestirme", baslik: "Metinleri birleştirmek", kategori: "Metin",
    niyet: ["metin birleştir", "yan yana ekle", "listeyi metne çevir", "join", "concat", "string birleştirme", "virgülle birleştir"],
    diller: {
      js: { ad: "join() / + / şablon metni", sozdizimi: "dizi.join(ayraç)\na + b\n`${a} ${b}`", aciklama: "İki metni + ile ya da şablon metniyle (ters tırnak) birleştirirsin. Bir dizinin elemanlarını aralarına ayraç koyarak birleştirmek için join.",
        ornek: "const ad = \"Ada\", soyad = \"Lovelace\";\nconsole.log(ad + \" \" + soyad);\nconsole.log(`${ad} ${soyad}`);\nconsole.log([\"kod\", \"yaz\", \"öğren\"].join(\" → \"));" },
      py: { ad: "str.join() / + / f-string", sozdizimi: "ayraç.join(liste)\na + b\nf\"{a} {b}\"", aciklama: "join bir listedeki metinleri birleştirir; liste elemanları metin olmalıdır. Döngü içinde += ile birleştirmek yavaştır; parçaları listede toplayıp en sonda join et.",
        ornek: k`
ad, soyad = "Ada", "Lovelace"
print(ad + " " + soyad)
print(f"{ad} {soyad}")
print(" → ".join(["kod", "yaz", "öğren"]))
print(", ".join(str(n) for n in [1, 2, 3]))` },
      c: { ad: "snprintf() / strcat()", sozdizimi: "snprintf(hedef, boyut, \"%s %s\", a, b);", aciklama: "En güvenli yol snprintf: hedef tamponun boyutunu verir, taşmayı önler. strcat hedefin yeterince büyük olduğunu varsayar.",
        ornek: k`
#include <stdio.h>

int main(void) {
    char tam[32];
    snprintf(tam, sizeof tam, "%s %s", "Ada", "Lovelace");
    printf("%s\n", tam);
    return 0;
}` },
      sql: { ad: "|| işleci", sozdizimi: "a || ' ' || b", aciklama: "SQLite'ta metinler || ile birleştirilir (bazı veritabanlarında CONCAT()).", ornek: k`
SELECT ad || ' (' || sehir || ')' AS etiket FROM ogrenciler;` }
    }
  },
  {
    id: "bosluk-temizleme", baslik: "Baştaki ve sondaki boşlukları silmek", kategori: "Metin",
    niyet: ["boşlukları sil", "boşluk temizle", "trim", "strip", "kenar boşluk", "satır sonunu sil"],
    diller: {
      js: { ad: "trim()", sozdizimi: "metin.trim()\nmetin.trimStart()\nmetin.trimEnd()", aciklama: "Baştaki ve sondaki boşluk, sekme ve satır sonlarını silinmiş yeni metin döndürür. Aradaki boşluklara dokunmaz.",
        ornek: k`
const giris = "   ada@quagen.dev \n";
console.log("[" + giris.trim() + "]");` },
      py: { ad: "str.strip()", sozdizimi: "metin.strip(karakterler=None)", aciklama: "Baştaki ve sondaki boşlukları (ya da verilen karakterleri) siler. lstrip yalnızca baştan, rstrip yalnızca sondan.",
        ornek: k`
print("[" + "   ada \n".strip() + "]")
print("...quagen!!".strip(".!"))   # quagen` },
      sql: { ad: "TRIM()", sozdizimi: "TRIM(sütun)", aciklama: "Baştaki ve sondaki boşlukları siler.", ornek: k`
SELECT '[' || TRIM('   Ada  ') || ']' AS temiz;` }
    }
  },
  {
    id: "alt-metin-arama", baslik: "Metinde bir şey geçiyor mu?", kategori: "Metin",
    niyet: ["metinde ara", "içeriyor mu", "geçiyor mu", "kelime var mı", "includes", "contains", "indexof", "find", "alt metin bul"],
    diller: {
      js: { ad: "includes() / indexOf()", sozdizimi: "metin.includes(aranan)\nmetin.indexOf(aranan)", aciklama: "includes true/false döndürür. indexOf ilk geçtiği konumu, yoksa -1 döndürür.",
        ornek: k`
const s = "kod yazarak öğren";
console.log(s.includes("yaz"));   // true
console.log(s.indexOf("öğren"));   // 12
console.log(s.indexOf("python"));  // -1` },
      py: { ad: "in / str.find()", sozdizimi: "aranan in metin\nmetin.find(aranan)\nmetin.count(aranan)", aciklama: "in True/False verir. find konumu, yoksa -1 döndürür (index ise yoksa hata fırlatır). count kaç kez geçtiğini sayar.",
        ornek: k`
s = "kod yazarak öğren"
print("yaz" in s)        # True
print(s.find("öğren"))   # 12
print(s.count("a"))      # 3` },
      c: { ad: "strstr()", sozdizimi: "#include <string.h>\nchar *strstr(const char *metin, const char *aranan);", aciklama: "Aranan metnin ilk geçtiği yerin adresini, yoksa NULL döndürür. Konum için adresten metnin başını çıkar.",
        ornek: k`
#include <stdio.h>
#include <string.h>

int main(void) {
    const char *s = "kod yazarak ogren";
    const char *p = strstr(s, "yaz");
    if (p) printf("bulundu, konum %ld\n", (long)(p - s));
    return 0;
}` },
      sql: { ad: "LIKE / INSTR()", sozdizimi: "sütun LIKE '%aranan%'", aciklama: "LIKE'ta % herhangi sayıda karakter, _ tek karakter demektir.", ornek: k`
SELECT ad FROM ogrenciler WHERE ad LIKE '%e%';` }
    }
  },
  {
    id: "metin-degistirme", baslik: "Metindeki bir parçayı değiştirmek", kategori: "Metin",
    niyet: ["metin değiştir", "kelimeyi değiştir", "replace", "bul ve değiştir", "karakteri sil", "yerine koy"],
    diller: {
      js: { ad: "replaceAll() / replace()", sozdizimi: "metin.replaceAll(eski, yeni)\nmetin.replace(/kalıp/g, yeni)", aciklama: "replace yalnızca İLK eşleşmeyi değiştirir (g bayraklı düzenli ifade hariç). Hepsini değiştirmek için replaceAll.",
        ornek: k`
const s = "a-b-c";
console.log(s.replace("-", "+"));     // a+b-c
console.log(s.replaceAll("-", "+"));  // a+b+c
console.log("0532 123 45 67".replace(/\s/g, "")); // 05321234567` },
      py: { ad: "str.replace()", sozdizimi: "metin.replace(eski, yeni, sayi=-1)", aciklama: "Varsayılan olarak TÜM eşleşmeleri değiştirir. Kalıplar için re.sub.",
        ornek: k`
print("a-b-c".replace("-", "+"))      # a+b+c
print("a-b-c".replace("-", "+", 1))   # a+b-c
import re
print(re.sub(r"\s", "", "0532 123 45 67"))` },
      sql: { ad: "REPLACE()", sozdizimi: "REPLACE(sütun, eski, yeni)", aciklama: "Tüm eşleşmeleri değiştirilmiş metni döndürür.", ornek: k`
SELECT REPLACE(sehir, 'İzmir', 'IZMIR') FROM ogrenciler;` }
    }
  },
  {
    id: "alt-metin", baslik: "Metnin bir bölümünü almak", kategori: "Metin",
    niyet: ["metnin bir kısmı", "ilk 3 harf", "son karakter", "substring", "slice", "dilim", "metni kes", "kırp"],
    diller: {
      js: { ad: "slice() / at()", sozdizimi: "metin.slice(baş, son?)\nmetin.at(-1)", aciklama: "slice başlangıçtan bitişe kadar (bitiş hariç) olan bölümü verir. Negatif sayılar sondan sayar.",
        ornek: k`
const s = "QUAGEN";
console.log(s.slice(0, 3));  // Kod
console.log(s.slice(-2));    // ra
console.log(s.at(-1));       // a` },
      py: { ad: "dilimleme [baş:son:adım]", sozdizimi: "metin[baş:son]\nmetin[-1]\nmetin[::-1]", aciklama: "Köşeli parantezle dilimlenir; son hariçtir. Sınırların dışına taşan dilim hata vermez.",
        ornek: k`
s = "QUAGEN"
print(s[0:3])   # Kod
print(s[-2:])   # ra
print(s[::2])   # Kdr
print(s[:100])  # QUAGEN` },
      sql: { ad: "SUBSTR()", sozdizimi: "SUBSTR(sütun, başlangıç, uzunluk)", aciklama: "SQL'de konum 1'den başlar.", ornek: k`
SELECT ad, SUBSTR(ad, 1, 2) AS ilk_iki FROM ogrenciler;` }
    }
  },
  {
    id: "metin-ters", baslik: "Metni tersine çevirmek", kategori: "Metin",
    niyet: ["metni ters çevir", "tersten yaz", "reverse string", "palindrom", "tersine"],
    diller: {
      js: { ad: "[...s].reverse().join(\"\")", sozdizimi: "[...metin].reverse().join(\"\")", aciklama: "Metinlerin reverse metodu yoktur: önce karakter dizisine yayılır, ters çevrilir, birleştirilir.",
        ornek: k`
const s = "quagen";
console.log([...s].reverse().join(""));  // aredok` },
      py: { ad: "s[::-1]", sozdizimi: "metin[::-1]", aciklama: "Adımı -1 olan dilim metni tersine çevirir.", ornek: k`
s = "quagen"
print(s[::-1])               # aredok
print(s == s[::-1])          # palindrom mu? False` },
      c: { ad: "iki işaretçiyle yerinde", sozdizimi: "takas(s[i], s[n - 1 - i])", aciklama: "Baştan ve sondan gelen iki indeksi ortada buluşana kadar takas edersin.", ornek: k`
#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "quagen";
    for (size_t i = 0, j = strlen(s) - 1; i < j; i++, j--) {
        char t = s[i]; s[i] = s[j]; s[j] = t;
    }
    printf("%s\n", s);
    return 0;
}` }
    }
  },
  {
    id: "sayiya-cevirme", baslik: "Metni sayıya çevirmek", kategori: "Metin",
    niyet: ["metni sayıya çevir", "string to int", "sayıya dönüştür", "parseint", "int'e çevir", "girdiyi sayı yap", "float'a çevir"],
    diller: {
      js: { ad: "Number() / parseInt() / parseFloat()", sozdizimi: "Number(metin)\nparseInt(metin, 10)\nparseFloat(metin)", aciklama: "Number tüm metnin sayı olmasını ister, değilse NaN verir. parseInt baştaki sayıyı okur ve geri kalanı yok sayar.",
        ornek: k`
console.log(Number("42"), Number("42px"));   // 42 NaN
console.log(parseInt("42px", 10));          // 42
console.log(parseFloat("3.14"));            // 3.14
console.log(Number.isNaN(Number("abc")));    // true` },
      py: { ad: "int() / float()", sozdizimi: "int(metin)\nfloat(metin)", aciklama: "Metin geçerli bir sayı değilse ValueError fırlatır; baştaki ve sondaki boşlukları tolere eder.",
        ornek: k`
print(int("42"), float("3.14"), int(" 7 "))
try:
    int("42px")
except ValueError as e:
    print("hata:", e)` },
      c: { ad: "strtol() / atoi()", sozdizimi: "long strtol(const char *s, char **son, int taban);", aciklama: "strtol okuduğu yerin sonunu bildirir; böylece hatayı anlayabilirsin. atoi hatayı bildiremez.",
        ornek: k`
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char *son;
    long n = strtol("42px", &son, 10);
    printf("%ld, kalan: \"%s\"\n", n, son);
    return 0;
}` },
      sql: { ad: "CAST()", sozdizimi: "CAST(ifade AS INTEGER)", aciklama: "Değeri başka bir türe dönüştürür.", ornek: k`
SELECT CAST('42' AS INTEGER) + 1 AS sonuc;` }
    }
  },
  {
    id: "bicimli-yazdirma", baslik: "Sayıyı biçimli yazdırmak (ondalık, hizalama)", kategori: "Metin",
    niyet: ["iki ondalık", "virgülden sonra 2 basamak", "format", "biçimlendir", "hizala", "para birimi", "printf", "f-string", "tofixed", "sıfırla doldur"],
    diller: {
      js: { ad: "toFixed() / Intl.NumberFormat / padStart()", sozdizimi: "sayi.toFixed(2)\nnew Intl.NumberFormat(\"tr-TR\", { style: \"currency\", currency: \"TRY\" }).format(sayi)", aciklama: "toFixed ondalık basamak sayısını sabitler ve metin döndürür. Intl yerel biçimi (binlik ayırıcı, para birimi) uygular.",
        ornek: k`
const fiyat = 1234.5;
console.log(fiyat.toFixed(2));                         // 1234.50
console.log(new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(fiyat));
console.log(String(7).padStart(3, "0"));               // 007` },
      py: { ad: "f-string biçim belirteçleri", sozdizimi: "f\"{x:.2f}\"  f\"{x:>8}\"  f\"{x:,}\"  f\"{n:03d}\"", aciklama: "İki noktadan sonra biçim: .2f iki ondalık, > sağa, < sola yaslama, , binlik ayırıcı, 03d sıfırla doldurma.",
        ornek: k`
fiyat = 1234.5
print(f"{fiyat:.2f}")        # 1234.50
print(f"{fiyat:,.2f}")       # 1,234.50
print(f"[{'Ada':<6}][{90:>5}]")
print(f"{7:03d}")            # 007
print(f"{0.256:.1%}")        # 25.6%` },
      c: { ad: "printf biçim belirteçleri", sozdizimi: "printf(\"%.2f %5d %-8s %03d\\n\", ...);", aciklama: "%d tam sayı, %f ondalık, %s metin, %c karakter. Arada genişlik ve hassasiyet: %.2f, %5d (sağa), %-8s (sola), %03d (sıfırla doldur).",
        ornek: k`
#include <stdio.h>

int main(void) {
    printf("%.2f\n", 1234.5);
    printf("[%-6s][%5d]\n", "Ada", 90);
    printf("%03d\n", 7);
    return 0;
}` }
    }
  },
  {
    id: "baslar-mi", baslik: "Metin şununla mı başlıyor / bitiyor?", kategori: "Metin",
    niyet: ["ile başlıyor mu", "ile bitiyor mu", "startswith", "endswith", "uzantı kontrol", "önek", "sonek"],
    diller: {
      js: { ad: "startsWith() / endsWith()", sozdizimi: "metin.startsWith(önek)\nmetin.endsWith(sonek)", aciklama: "true/false döndürür.",
        ornek: k`
const dosya = "rapor.pdf";
console.log(dosya.endsWith(".pdf"), dosya.startsWith("rap"));` },
      py: { ad: "str.startswith() / endswith()", sozdizimi: "metin.startswith(önek)\nmetin.endswith((\".jpg\", \".png\"))", aciklama: "Birden fazla seçeneği demet olarak verebilirsin.",
        ornek: k`
dosya = "foto.png"
print(dosya.endswith((".jpg", ".png")))   # True
print("https://quagen.dev".startswith("https"))` },
      c: { ad: "strncmp()", sozdizimi: "strncmp(metin, önek, strlen(önek)) == 0", aciklama: "İlk n karakteri karşılaştırır; 0 eşit demektir.", ornek: k`
#include <stdio.h>
#include <string.h>

int main(void) {
    const char *url = "https://quagen.dev";
    printf("%d\n", strncmp(url, "https", 5) == 0);
    return 0;
}` }
    }
  },
  {
    id: "metin-karsilastirma", baslik: "Metinleri karşılaştırmak ve alfabetik sıralamak", kategori: "Metin",
    niyet: ["metin eşit mi", "string karşılaştır", "alfabetik sırala", "strcmp", "localecompare", "türkçe sıralama"],
    diller: {
      js: { ad: "=== / localeCompare()", sozdizimi: "a === b\na.localeCompare(b, \"tr\")", aciklama: "Eşitlik için ===. Alfabetik sıralama için localeCompare; \"tr\" verirsen ç, ğ, ı, ö, ş, ü doğru yere gelir.",
        ornek: k`
const adlar = ["Zeynep", "Çağla", "Can", "Ömer"];
console.log([...adlar].sort());                                   // Ç ve Ö en sona
console.log([...adlar].sort((a, b) => a.localeCompare(b, "tr")));  // Türkçe sıra` },
      py: { ad: "== / sorted()", sozdizimi: "a == b\nsorted(liste, key=str.lower)", aciklama: "== içerik karşılaştırır. Varsayılan sıralama karakter kodlarına göredir; Türkçe harfler sona düşer.",
        ornek: k`
adlar = ["Zeynep", "Çağla", "Can", "Ömer"]
print(sorted(adlar))
ALFABE = "abcçdefgğhıijklmnoöprsştuüvyz"
print(sorted(adlar, key=lambda s: [ALFABE.find(c) for c in s.lower()]))` },
      c: { ad: "strcmp()", sozdizimi: "strcmp(a, b)  /* <0, 0, >0 */", aciklama: "== iki metnin ADRESİNİ karşılaştırır, içeriğini değil. İçerik için strcmp: 0 eşit, negatif a önce, pozitif b önce.",
        ornek: k`
#include <stdio.h>
#include <string.h>

int main(void) {
    char a[] = "kod", b[] = "kod";
    printf("== : %d, strcmp: %d\n", a == b, strcmp(a, b) == 0);
    return 0;
}` }
    }
  },
  {
    id: "karakter-kodu", baslik: "Karakter ↔ sayı kodu", kategori: "Metin",
    niyet: ["ascii kodu", "karakter kodu", "harfin sayısı", "ord", "chr", "charcodeat", "unicode"],
    diller: {
      js: { ad: "charCodeAt() / String.fromCharCode()", sozdizimi: "metin.charCodeAt(i)\nString.fromCharCode(kod)\nmetin.codePointAt(i)", aciklama: "Karakterin sayısal kodunu ve tersini verir.",
        ornek: k`
console.log("A".charCodeAt(0), String.fromCharCode(66));  // 65 B
console.log("ç".codePointAt(0));                          // 231` },
      py: { ad: "ord() / chr()", sozdizimi: "ord(karakter)\nchr(kod)", aciklama: "ord karakterin Unicode kodunu, chr koddan karakteri verir.",
        ornek: k`
print(ord("A"), chr(66))   # 65 B
print(chr(ord("a") + 2))   # c` },
      c: { ad: "char aritmetiği", sozdizimi: "int kod = c;\nchar d = 'a' + 2;", aciklama: "C'de char zaten küçük bir tam sayıdır; doğrudan aritmetik yapılır.",
        ornek: k`
#include <stdio.h>

int main(void) {
    printf("%d %c %d\n", 'A', 66, '7' - '0');
    return 0;
}` }
    }
  },

  /* ============================== SAYILAR ============================== */
  {
    id: "yuvarlama", baslik: "Sayıyı yuvarlamak", kategori: "Sayılar",
    niyet: ["yuvarla", "aşağı yuvarla", "yukarı yuvarla", "round", "floor", "ceil", "tam sayıya çevir", "kesir kısmını at"],
    diller: {
      js: { ad: "Math.round() / floor() / ceil() / trunc()", sozdizimi: "Math.round(x)\nMath.floor(x)\nMath.ceil(x)\nMath.trunc(x)", aciklama: "round en yakına, floor aşağı, ceil yukarı yuvarlar; trunc ondalık kısmı atar. Ondalık basamakla göstermek için toFixed.",
        ornek: k`
console.log(Math.round(2.5), Math.floor(2.7), Math.ceil(2.1), Math.trunc(-2.7));
console.log(Math.round(3.14159 * 100) / 100);  // 3.14` },
      py: { ad: "round() / math.floor() / math.ceil()", sozdizimi: "round(x, basamak=0)\nmath.floor(x)\nmath.ceil(x)\nint(x)", aciklama: "round(2.5) → 2: Python 'bankacı yuvarlaması' yapar (eşitlikte çift sayıya). int() ondalık kısmı atar.",
        ornek: k`
import math
print(round(2.5), round(3.5), round(3.14159, 2))  # 2 4 3.14
print(math.floor(2.7), math.ceil(2.1), int(-2.7))` },
      c: { ad: "round() / floor() / ceil()", sozdizimi: "#include <math.h>\ndouble round(double x);", aciklama: "math.h fonksiyonları double döndürür; tam sayı gerekiyorsa dönüştürürsün.",
        ornek: k`
#include <stdio.h>
#include <math.h>

int main(void) {
    printf("%.0f %.0f %.0f\n", round(2.5), floor(2.7), ceil(2.1));
    return 0;
}` },
      sql: { ad: "ROUND()", sozdizimi: "ROUND(sütun, basamak)", aciklama: "Sayıyı verilen ondalık basamağa yuvarlar.", ornek: k`
SELECT ROUND(AVG(puan), 1) AS ortalama FROM ogrenciler;` }
    }
  },
  {
    id: "rastgele-sayi", baslik: "Rastgele sayı üretmek", kategori: "Sayılar",
    niyet: ["rastgele sayı", "random", "zar at", "rastgele seç", "karıştır", "shuffle", "rasgele"],
    diller: {
      js: { ad: "Math.random()", sozdizimi: "Math.random()  // 0 ≤ x < 1\nMath.floor(Math.random() * (max - min + 1)) + min", aciklama: "0 ile 1 arasında (1 hariç) ondalık sayı verir; tam sayı aralığına ölçeklenir. Güvenlik (parola, belirteç) için crypto.getRandomValues kullan.",
        ornek: k`
const zar = () => Math.floor(Math.random() * 6) + 1;
console.log(zar(), zar(), zar());
const renkler = ["kırmızı", "yeşil", "mavi"];
console.log(renkler[Math.floor(Math.random() * renkler.length)]);` },
      py: { ad: "random modülü", sozdizimi: "random.randint(a, b)\nrandom.choice(liste)\nrandom.shuffle(liste)\nrandom.random()", aciklama: "randint iki ucu da dahil eder. Güvenlik için secrets modülü.",
        ornek: k`
import random
print(random.randint(1, 6))
print(random.choice(["kırmızı", "yeşil", "mavi"]))
l = [1, 2, 3, 4]; random.shuffle(l); print(l)` },
      c: { ad: "rand() / srand()", sozdizimi: "srand((unsigned)time(NULL));\nint x = rand() % 6 + 1;", aciklama: "rand sözde rastgele sayı üretir; her çalıştırmada farklı olması için srand ile tohumlanır.",
        ornek: k`
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
    srand((unsigned)time(NULL));
    printf("zar: %d\n", rand() % 6 + 1);
    return 0;
}` }
    }
  },
  {
    id: "us-karekok", baslik: "Üs almak ve karekök", kategori: "Sayılar",
    niyet: ["üs al", "kuvvet", "karesi", "karekök", "sqrt", "pow", "üssü"],
    diller: {
      js: { ad: "** / Math.sqrt()", sozdizimi: "a ** b\nMath.sqrt(x)\nMath.pow(a, b)", aciklama: "** üs işlecidir. Büyük tam sayılar için BigInt: 2n ** 100n.",
        ornek: k`
console.log(2 ** 10, Math.sqrt(144), Math.cbrt(27));
console.log(2n ** 100n);` },
      py: { ad: "** / math.sqrt()", sozdizimi: "a ** b\nmath.sqrt(x)\npow(a, b, mod)", aciklama: "Python tam sayıları sınırsız büyür. pow'un üçüncü argümanı modüler üs alır.",
        ornek: k`
import math
print(2 ** 10, math.sqrt(144), 2 ** 100)
print(pow(3, 200, 1000))` },
      c: { ad: "pow() / sqrt()", sozdizimi: "#include <math.h>\npow(a, b)\nsqrt(x)", aciklama: "C'de üs işleci yoktur: ^ özel veya (XOR) işlecidir! pow double döndürür.",
        ornek: k`
#include <stdio.h>
#include <math.h>

int main(void) {
    printf("%.0f %.0f %d\n", pow(2, 10), sqrt(144), 2 ^ 10);  /* 2 ^ 10 = 8 (XOR) */
    return 0;
}`, not: "2 ^ 10 C'de 1024 değil 8'dir." }
    }
  },
  {
    id: "bolme-kalan", baslik: "Tam sayı bölmesi ve kalan", kategori: "Sayılar",
    niyet: ["kalan", "mod", "tek mi çift mi", "bölünüyor mu", "tam bölme", "modulo", "yüzde işareti"],
    diller: {
      js: { ad: "% / Math.trunc()", sozdizimi: "a % b\nMath.trunc(a / b)", aciklama: "/ her zaman ondalıklı bölmedir. Tam sayı bölmesi için Math.trunc ya da Math.floor. Negatif sayıda % işareti bölünenin işaretini alır.",
        ornek: k`
console.log(7 / 2, Math.trunc(7 / 2), 7 % 2);   // 3.5 3 1
console.log(10 % 2 === 0 ? "çift" : "tek");
console.log(-7 % 3);                               // -1` },
      py: { ad: "// ve %", sozdizimi: "a // b\na % b\ndivmod(a, b)", aciklama: "// aşağı yuvarlayan tam sayı bölmesidir. % sonucu bölenin işaretini alır, bu yüzden -7 % 3 = 2.",
        ornek: k`
print(7 / 2, 7 // 2, 7 % 2)     # 3.5 3 1
print(divmod(17, 5))            # (3, 2)
print(-7 // 2, -7 % 3)          # -4 2` },
      c: { ad: "/ ve %", sozdizimi: "a / b  /* tam sayılarda tam sayı bölmesi */\na % b", aciklama: "İki tam sayı bölünürse sonuç tam sayıdır (kesir atılır). Ondalık sonuç için birini double yap.",
        ornek: k`
#include <stdio.h>

int main(void) {
    printf("%d %d %.1f\n", 7 / 2, 7 % 2, 7 / 2.0);
    return 0;
}` }
    }
  },
  {
    id: "en-buyuk", baslik: "En büyük ve en küçük değeri bulmak", kategori: "Sayılar",
    niyet: ["en büyük", "en küçük", "maksimum", "minimum", "max", "min", "en yüksek puan", "en düşük"],
    diller: {
      js: { ad: "Math.max() / Math.min()", sozdizimi: "Math.max(...dizi)\nMath.min(a, b)", aciklama: "Dizi doğrudan verilemez; yayma (...) gerekir. Boş dizide -Infinity döner.",
        ornek: k`
const puanlar = [72, 90, 85];
console.log(Math.max(...puanlar), Math.min(...puanlar));
const enIyi = [{ ad: "Ada", p: 90 }, { ad: "Can", p: 72 }].reduce((a, b) => (b.p > a.p ? b : a));
console.log(enIyi.ad);` },
      py: { ad: "max() / min()", sozdizimi: "max(dizi, key=None, default=...)\nmin(a, b)", aciklama: "key ile neye göre karşılaştırılacağını söylersin. Boş listede default verilmezse ValueError.",
        ornek: k`
puanlar = [72, 90, 85]
print(max(puanlar), min(puanlar))
ogr = [("Ada", 90), ("Can", 72)]
print(max(ogr, key=lambda t: t[1])[0])
print(max([], default=0))` },
      c: { ad: "döngüyle", sozdizimi: "int en = d[0]; for (...) if (d[i] > en) en = d[i];", aciklama: "Standart kütüphanede hazır bir dizi maksimumu yoktur; ilk elemanla başlayıp döngüyle bulunur.",
        ornek: k`
#include <stdio.h>

int main(void) {
    int d[] = {72, 90, 85}, n = 3, en = d[0];
    for (int i = 1; i < n; i++) if (d[i] > en) en = d[i];
    printf("%d\n", en);
    return 0;
}` },
      sql: { ad: "MAX() / MIN()", sozdizimi: "SELECT MAX(sütun) FROM tablo;", aciklama: "Toplama fonksiyonlarıdır; NULL değerleri yok sayar.", ornek: k`
SELECT MAX(puan) AS en_yuksek, MIN(puan) AS en_dusuk FROM ogrenciler;` }
    }
  },

  /* ============================== LİSTELER ============================== */
  {
    id: "diziye-ekleme", baslik: "Listeye / diziye eleman eklemek", kategori: "Listeler ve diziler",
    niyet: ["listeye ekle", "diziye ekle", "sona ekle", "başa ekle", "push", "append", "araya ekle", "insert"],
    diller: {
      js: { ad: "push() / unshift() / splice()", sozdizimi: "dizi.push(x)\ndizi.unshift(x)\ndizi.splice(i, 0, x)", aciklama: "push sona, unshift başa ekler; splice istenen konuma. Hepsi diziyi yerinde değiştirir. Değiştirmeden yeni dizi için [...dizi, x].",
        ornek: k`
const a = [1, 2];
a.push(3); a.unshift(0); a.splice(2, 0, 1.5);
console.log(a);                 // [0, 1, 1.5, 2, 3]
console.log([...a, 4].length);` },
      py: { ad: "append() / insert() / extend()", sozdizimi: "liste.append(x)\nliste.insert(i, x)\nliste.extend(diger)", aciklama: "append tek eleman ekler; bir listeyi eklersen iç içe liste olur. Birden çok eleman için extend.",
        ornek: k`
l = [1, 2]
l.append(3); l.insert(0, 0); l.extend([4, 5])
print(l)
l.append([6, 7]); print(l[-1])   # [6, 7]: iç içe` },
      c: { ad: "realloc()", sozdizimi: "p = realloc(p, yeni_boyut * sizeof *p);", aciklama: "C dizilerinin boyutu sabittir. Büyüyen dizi için bellek malloc ile ayrılır, gerektikçe realloc ile büyütülür.",
        ornek: k`
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 0, kap = 2, *d = malloc(kap * sizeof *d);
    for (int x = 1; x <= 5; x++) {
        if (n == kap) { kap *= 2; d = realloc(d, kap * sizeof *d); }
        d[n++] = x * x;
    }
    for (int i = 0; i < n; i++) printf("%d ", d[i]);
    printf("\n");
    free(d);
    return 0;
}`, not: "Gerçek kodda realloc sonucunu önce geçici bir değişkene al; NULL dönerse eski blok kaybolmasın." }
    }
  },
  {
    id: "diziden-cikarma", baslik: "Listeden eleman çıkarmak", kategori: "Listeler ve diziler",
    niyet: ["listeden sil", "diziden çıkar", "eleman sil", "pop", "remove", "splice", "sondakini çıkar"],
    diller: {
      js: { ad: "pop() / shift() / splice() / filter()", sozdizimi: "dizi.pop()\ndizi.splice(i, 1)\ndizi.filter(x => x !== deger)", aciklama: "pop sondan, shift baştan çıkarır; splice konumdan siler. Değere göre silip yeni dizi almak için filter.",
        ornek: k`
const a = ["a", "b", "c", "d"];
console.log(a.pop(), a);            // d [a, b, c]
a.splice(1, 1); console.log(a);     // [a, c]
console.log(a.filter((x) => x !== "a"));` },
      py: { ad: "pop() / remove() / del", sozdizimi: "liste.pop(i=-1)\nliste.remove(deger)\ndel liste[i]", aciklama: "pop konumdan çıkarıp döndürür; remove değere göre ilk eşleşmeyi siler (yoksa ValueError).",
        ornek: k`
l = ["a", "b", "c", "d"]
print(l.pop(), l)        # d ['a', 'b', 'c']
l.remove("a"); del l[0]
print(l)                  # ['c']
print([x for x in [1, 2, 1] if x != 1])` }
    }
  },
  {
    id: "dizi-uzunlugu", baslik: "Listenin eleman sayısı", kategori: "Listeler ve diziler",
    niyet: ["kaç eleman", "eleman sayısı", "dizi uzunluğu", "liste boyu", "length", "len", "sizeof", "boş mu"],
    diller: {
      js: { ad: "length", sozdizimi: "dizi.length", aciklama: "Dizinin eleman sayısı. Boş mu kontrolü: dizi.length === 0.",
        ornek: k`
const a = [3, 1, 4];
console.log(a.length, a.length === 0);` },
      py: { ad: "len()", sozdizimi: "len(liste)\nif not liste:", aciklama: "Boş liste yanlış (False) sayıldığı için 'boş mu' kontrolü genellikle if not liste: diye yazılır.",
        ornek: k`
l = [3, 1, 4]
print(len(l))
if not []:
    print("boş liste")` },
      c: { ad: "sizeof(d) / sizeof(d[0])", sozdizimi: "size_t n = sizeof d / sizeof d[0];", aciklama: "Yalnızca dizinin tanımlandığı yerde çalışır. Bir fonksiyona geçen dizi işaretçiye dönüşür; boyutu ayrıca parametre olarak verilir.",
        ornek: k`
#include <stdio.h>

int main(void) {
    int d[] = {3, 1, 4, 1, 5};
    printf("%zu\n", sizeof d / sizeof d[0]);
    return 0;
}` },
      sql: { ad: "COUNT()", sozdizimi: "SELECT COUNT(*) FROM tablo;", aciklama: "Satır sayısını verir; COUNT(sütun) NULL olmayanları sayar.", ornek: k`
SELECT COUNT(*) AS toplam, COUNT(puan) AS puani_olan FROM ogrenciler;` }
    }
  },
  {
    id: "siralama", baslik: "Listeyi sıralamak", kategori: "Listeler ve diziler",
    niyet: ["sırala", "küçükten büyüğe", "büyükten küçüğe", "sort", "sorted", "alfabetik sırala", "azalan sıra", "puana göre sırala"],
    diller: {
      js: { ad: "sort() / toSorted()", sozdizimi: "dizi.sort((a, b) => a - b)\ndizi.toSorted(karsilastir)", aciklama: "sort varsayılan olarak elemanları METİN olarak sıralar: [10, 9, 1] → [1, 10, 9]. Sayılar için karşılaştırıcı şart. sort diziyi yerinde değiştirir; toSorted yeni dizi döndürür.",
        ornek: k`
const s = [10, 9, 1, 100];
console.log([...s].sort());                  // [1, 10, 100, 9]  dikkat!
console.log([...s].sort((a, b) => a - b));   // artan
console.log([...s].sort((a, b) => b - a));   // azalan
const k = [{ ad: "Can", p: 72 }, { ad: "Ada", p: 90 }];
console.log(k.toSorted((a, b) => b.p - a.p).map((x) => x.ad));` },
      py: { ad: "sorted() / list.sort()", sozdizimi: "sorted(dizi, key=None, reverse=False)\nliste.sort()", aciklama: "sorted yeni liste döndürür, sort yerinde sıralar ve None döndürür. key ile ölçüt verilir; çok ölçüt için demet.",
        ornek: k`
s = [10, 9, 1, 100]
print(sorted(s), sorted(s, reverse=True))
ogr = [("Can", 72), ("Ada", 90), ("Ece", 72)]
print(sorted(ogr, key=lambda t: (-t[1], t[0])))` },
      c: { ad: "qsort()", sozdizimi: "qsort(dizi, n, sizeof dizi[0], karsilastir);", aciklama: "Her türü sıralayabilen standart fonksiyon; karşılaştırıcı void * alır.",
        ornek: k`
#include <stdio.h>
#include <stdlib.h>

int artan(const void *a, const void *b) {
    int x = *(const int *)a, y = *(const int *)b;
    return (x > y) - (x < y);
}

int main(void) {
    int d[] = {10, 9, 1, 100};
    qsort(d, 4, sizeof d[0], artan);
    for (int i = 0; i < 4; i++) printf("%d ", d[i]);
    printf("\n");
    return 0;
}` },
      sql: { ad: "ORDER BY", sozdizimi: "SELECT ... ORDER BY sütun ASC|DESC, sütun2;", aciklama: "Sonuç satırlarını sıralar. Birden çok sütun virgülle verilir.", ornek: k`
SELECT ad, puan FROM ogrenciler ORDER BY puan DESC, ad;` }
    }
  },
  {
    id: "donusturme-map", baslik: "Her elemanı dönüştürmek (map)", kategori: "Listeler ve diziler",
    niyet: ["her elemanı dönüştür", "her elemana uygula", "map", "liste kavraması", "hepsini iki katına", "dizi dönüştür"],
    diller: {
      js: { ad: "map()", sozdizimi: "dizi.map((eleman, i) => yeniDeger)", aciklama: "Her eleman için fonksiyonu çağırıp sonuçlardan yeni bir dizi oluşturur; orijinal değişmez.",
        ornek: k`
const fiyatlar = [10, 25, 40];
console.log(fiyatlar.map((f) => f * 1.2));
console.log(["ada", "can"].map((a) => a[0].toUpperCase() + a.slice(1)));` },
      py: { ad: "liste kavraması / map()", sozdizimi: "[ifade for x in liste]\nlist(map(fonksiyon, liste))", aciklama: "Python'da tercih edilen yol liste kavramasıdır.",
        ornek: k`
fiyatlar = [10, 25, 40]
print([f * 1.2 for f in fiyatlar])
print(list(map(str.title, ["ada", "can"])))` }
    }
  },
  {
    id: "suzme-filter", baslik: "Koşula uyan elemanları seçmek (filter)", kategori: "Listeler ve diziler",
    niyet: ["süz", "filtrele", "koşula uyanlar", "filter", "çift sayıları seç", "sadece geçenler", "eleme"],
    diller: {
      js: { ad: "filter()", sozdizimi: "dizi.filter((eleman) => kosul)", aciklama: "Fonksiyonun true döndürdüğü elemanlardan yeni bir dizi oluşturur.",
        ornek: k`
const puanlar = [45, 90, 72, 30];
console.log(puanlar.filter((p) => p >= 50));
console.log([1, 2, 3, 4, 5, 6].filter((n) => n % 2 === 0));` },
      py: { ad: "koşullu liste kavraması / filter()", sozdizimi: "[x for x in liste if kosul]", aciklama: "Kavramanın sonuna if eklenir.", ornek: k`
puanlar = [45, 90, 72, 30]
print([p for p in puanlar if p >= 50])` },
      sql: { ad: "WHERE", sozdizimi: "SELECT ... FROM tablo WHERE kosul;", aciklama: "Koşula uyan satırları seçer. AND, OR, NOT, IN, BETWEEN, IS NULL ile birleştirilir.", ornek: k`
SELECT ad, puan FROM ogrenciler WHERE puan >= 80 AND sehir = 'İzmir';` }
    }
  },
  {
    id: "toplama-reduce", baslik: "Elemanları toplamak / tek değere indirgemek", kategori: "Listeler ve diziler",
    niyet: ["topla", "toplamını bul", "dizi toplamı", "sayıların toplamı", "sum", "reduce", "ortalama", "hepsini çarp", "listenin toplamı"],
    diller: {
      js: { ad: "reduce()", sozdizimi: "dizi.reduce((birikim, x) => ..., baslangic)", aciklama: "Diziyi tek bir değere indirger. Başlangıç değerini her zaman ver; boş dizide hata almazsın.",
        ornek: k`
const s = [3, 4, 5];
const toplam = s.reduce((t, x) => t + x, 0);
console.log(toplam, toplam / s.length);
console.log([].reduce((t, x) => t + x, 0));` },
      py: { ad: "sum() / math.prod()", sozdizimi: "sum(dizi)\nmath.prod(dizi)\nstatistics.mean(dizi)", aciklama: "Toplama ve çarpım için hazır fonksiyonlar vardır; genel indirgeme için functools.reduce.",
        ornek: k`
import math, statistics
s = [3, 4, 5]
print(sum(s), math.prod(s), statistics.mean(s))` },
      c: { ad: "döngüyle", sozdizimi: "long t = 0; for (...) t += d[i];", aciklama: "Toplamı taşmaması için yeterince geniş bir türde (long, long long) tut.",
        ornek: k`
#include <stdio.h>

int main(void) {
    int d[] = {3, 4, 5};
    long t = 0;
    for (int i = 0; i < 3; i++) t += d[i];
    printf("%ld %.2f\n", t, t / 3.0);
    return 0;
}` },
      sql: { ad: "SUM() / AVG()", sozdizimi: "SELECT SUM(sütun), AVG(sütun) FROM tablo;", aciklama: "Toplama fonksiyonları NULL değerleri yok sayar.", ornek: k`
SELECT SUM(puan) AS toplam, AVG(puan) AS ortalama FROM ogrenciler;` }
    }
  },
  {
    id: "dizide-arama", baslik: "Listede eleman aramak", kategori: "Listeler ve diziler",
    niyet: ["listede var mı", "dizide ara", "bul", "find", "includes", "index", "konumunu bul", "içinde mi"],
    diller: {
      js: { ad: "includes() / indexOf() / find()", sozdizimi: "dizi.includes(x)\ndizi.indexOf(x)\ndizi.find(e => kosul)", aciklama: "includes var mı, indexOf konum (yoksa -1), find koşula uyan ilk elemanı (yoksa undefined) verir.",
        ornek: k`
const a = [5, 8, 13];
console.log(a.includes(8), a.indexOf(13), a.find((x) => x > 6));` },
      py: { ad: "in / index() / next()", sozdizimi: "x in liste\nliste.index(x)\nnext((e for e in liste if kosul), None)", aciklama: "in True/False verir. index yoksa ValueError fırlatır. Çok arama yapacaksan kümeye (set) çevir: O(1).",
        ornek: k`
a = [5, 8, 13]
print(8 in a, a.index(13))
print(next((x for x in a if x > 6), None))` },
      c: { ad: "döngü / bsearch()", sozdizimi: "for (...) if (d[i] == x) ...", aciklama: "Sırasız dizide döngü (O(n)); sıralı dizide ikili arama (bsearch, O(log n)).",
        ornek: k`
#include <stdio.h>

int main(void) {
    int d[] = {5, 8, 13}, x = 8, konum = -1;
    for (int i = 0; i < 3; i++) if (d[i] == x) { konum = i; break; }
    printf("%d\n", konum);
    return 0;
}` }
    }
  },
  {
    id: "tekrarlari-kaldirma", baslik: "Tekrar eden elemanları kaldırmak", kategori: "Listeler ve diziler",
    niyet: ["tekrarları sil", "benzersiz", "unique", "distinct", "aynı olanları kaldır", "set", "kopyaları kaldır"],
    diller: {
      js: { ad: "new Set()", sozdizimi: "[...new Set(dizi)]", aciklama: "Set yalnızca benzersiz değerleri tutar ve ekleme sırasını korur.",
        ornek: k`
const a = [3, 1, 3, 2, 1];
console.log([...new Set(a)]);   // [3, 1, 2]` },
      py: { ad: "set() / dict.fromkeys()", sozdizimi: "set(liste)\nlist(dict.fromkeys(liste))", aciklama: "set sırayı korumaz; sırayı korumak için dict.fromkeys.",
        ornek: k`
a = [3, 1, 3, 2, 1]
print(set(a))
print(list(dict.fromkeys(a)))   # [3, 1, 2]` },
      sql: { ad: "DISTINCT", sozdizimi: "SELECT DISTINCT sütun FROM tablo;", aciklama: "Sonuçtaki tekrar eden satırları kaldırır.", ornek: k`
SELECT DISTINCT sehir FROM ogrenciler ORDER BY sehir;` }
    }
  },
  {
    id: "dizi-kopyalama", baslik: "Listeyi kopyalamak", kategori: "Listeler ve diziler",
    niyet: ["kopyala", "kopya oluştur", "copy", "klonla", "derin kopya", "deep copy", "referans sorunu"],
    diller: {
      js: { ad: "[...dizi] / structuredClone()", sozdizimi: "const b = [...a];\nconst derin = structuredClone(a);", aciklama: "b = a kopya değildir, aynı diziye ikinci addır. Yayma sığ kopyadır; iç içe nesneler için structuredClone.",
        ornek: k`
const a = [1, [2, 3]];
const ayni = a, sig = [...a], derin = structuredClone(a);
a[1].push(4);
console.log(ayni === a, sig[1], derin[1]);` },
      py: { ad: "liste[:] / copy.deepcopy()", sozdizimi: "b = a[:]\nb = a.copy()\nimport copy; copy.deepcopy(a)", aciklama: "b = a aynı listeye ikinci addır. [:] ve copy() sığ kopyadır; iç içe yapılar için deepcopy.",
        ornek: k`
import copy
a = [1, [2, 3]]
sig, derin = a[:], copy.deepcopy(a)
a[1].append(4)
print(sig[1], derin[1])` },
      c: { ad: "memcpy()", sozdizimi: "memcpy(hedef, kaynak, n * sizeof *kaynak);", aciklama: "Bayt bayt kopyalar; hedefin yeterli belleği olmalıdır. İşaretçi atamak (b = a) kopyalamaz.",
        ornek: k`
#include <stdio.h>
#include <string.h>

int main(void) {
    int a[] = {1, 2, 3}, b[3];
    memcpy(b, a, sizeof a);
    a[0] = 99;
    printf("%d %d\n", a[0], b[0]);
    return 0;
}` }
    }
  },

  {
    id: "dizi-ters", baslik: "Listeyi tersine çevirmek", kategori: "Listeler ve diziler",
    niyet: ["listeyi tersine çevir", "diziyi ters çevir", "reverse", "sondan başa", "ters sıra"],
    diller: {
      js: { ad: "reverse() / toReversed()", sozdizimi: "dizi.reverse()\ndizi.toReversed()", aciklama: "reverse diziyi yerinde değiştirir ve aynı diziyi döndürür; toReversed orijinale dokunmadan yeni dizi döndürür.",
        ornek: k`
const a = [1, 2, 3];
const b = a.toReversed();
console.log(a, b);
a.reverse();
console.log(a);` },
      py: { ad: "reverse() / reversed() / [::-1]", sozdizimi: "liste.reverse()\nliste[::-1]\nreversed(liste)", aciklama: "reverse yerinde çevirir ve None döndürür; [::-1] yeni liste, reversed tembel bir yineleyici verir.",
        ornek: k`
a = [1, 2, 3]
print(a[::-1], list(reversed(a)), a)
a.reverse()
print(a)` },
      c: { ad: "iki indeksle yerinde takas", sozdizimi: "for (i = 0, j = n - 1; i < j; i++, j--) takas", aciklama: "Baştan ve sondan gelen elemanları ortada buluşana kadar takas edersin.",
        ornek: k`
#include <stdio.h>

int main(void) {
    int d[] = {1, 2, 3, 4};
    for (int i = 0, j = 3; i < j; i++, j--) { int t = d[i]; d[i] = d[j]; d[j] = t; }
    printf("%d %d %d %d\n", d[0], d[1], d[2], d[3]);
    return 0;
}` }
    }
  },

  /* ============================== SÖZLÜK VE NESNE ============================== */
  {
    id: "anahtar-deger", baslik: "Anahtar-değer çiftleri saklamak (sözlük)", kategori: "Sözlük ve nesne",
    niyet: ["sözlük", "anahtar değer", "dictionary", "map", "nesne oluştur", "object", "hash map", "eşleme tablosu"],
    diller: {
      js: { ad: "nesne {} / Map", sozdizimi: "const o = { anahtar: deger };\nconst m = new Map([[anahtar, deger]]);", aciklama: "Basit kayıtlar için nesne; anahtarları her türden olabilen, sık ekleme/silme yapılan eşlemeler için Map.",
        ornek: k`
const ogr = { ad: "Ada", puan: 90 };
ogr.sehir = "İzmir";
console.log(ogr.ad, ogr["puan"], Object.keys(ogr));
const m = new Map();
m.set("ada", 90).set("can", 72);
console.log(m.get("ada"), m.size);` },
      py: { ad: "dict", sozdizimi: "d = {\"anahtar\": deger}\nd[\"anahtar\"]\nd.get(\"anahtar\", varsayilan)", aciklama: "Python'un en çok kullanılan yapısıdır; erişim ortalama O(1). Ekleme sırasını korur.",
        ornek: k`
ogr = {"ad": "Ada", "puan": 90}
ogr["sehir"] = "İzmir"
print(ogr["ad"], ogr.get("yas", "bilinmiyor"), list(ogr))` },
      c: { ad: "struct", sozdizimi: "struct Ogrenci { char ad[20]; int puan; };", aciklama: "Alanları derleme anında bilinen kayıtlar için struct. Çalışma anında anahtarla erişim için hash tablosunu kendin yazarsın (QUAGEN C Faz 16).",
        ornek: k`
#include <stdio.h>

typedef struct { const char *ad; int puan; } Ogrenci;

int main(void) {
    Ogrenci o = { "Ada", 90 };
    printf("%s %d\n", o.ad, o.puan);
    return 0;
}` }
    }
  },
  {
    id: "anahtar-var-mi", baslik: "Sözlükte anahtar var mı?", kategori: "Sözlük ve nesne",
    niyet: ["anahtar var mı", "key var mı", "özellik var mı", "hasown", "in operatörü", "keyerror önle"],
    diller: {
      js: { ad: "in / Object.hasOwn() / Map.has()", sozdizimi: "\"ad\" in nesne\nObject.hasOwn(nesne, \"ad\")\nmap.has(anahtar)", aciklama: "Olmayan özelliğe erişmek hata değil undefined verir; varlığı kesin anlamak için hasOwn. Güvenli erişim için ?. ve ??.",
        ornek: k`
const o = { ad: "Ada", puan: 0 };
console.log(Object.hasOwn(o, "puan"), o.yas, o.yas ?? "yok");
console.log(o.adres?.sehir);   // undefined, hata yok` },
      py: { ad: "in / dict.get()", sozdizimi: "\"ad\" in d\nd.get(\"ad\", varsayilan)", aciklama: "Olmayan anahtara d[...] ile erişmek KeyError verir. in ile kontrol et ya da get kullan.",
        ornek: k`
d = {"ad": "Ada", "puan": 0}
print("puan" in d, d.get("yas"), d.get("yas", "yok"))` }
    }
  },
  {
    id: "nesne-dolasma", baslik: "Sözlüğün tüm anahtar ve değerlerini dolaşmak", kategori: "Sözlük ve nesne",
    niyet: ["sözlüğü dolaş", "nesneyi döngüyle gez", "items", "entries", "anahtarları listele", "değerleri listele"],
    diller: {
      js: { ad: "Object.entries() / for...of", sozdizimi: "for (const [k, v] of Object.entries(nesne))\nfor (const [k, v] of map)", aciklama: "Object.keys, values ve entries diziler döndürür.",
        ornek: k`
const fiyat = { kalem: 12, defter: 45 };
for (const [urun, f] of Object.entries(fiyat)) console.log(urun, f);
console.log(Object.values(fiyat).reduce((a, b) => a + b, 0));` },
      py: { ad: "dict.items()", sozdizimi: "for k, v in d.items():\nd.keys()  d.values()", aciklama: "items anahtar-değer çiftlerini verir; doğrudan for k in d anahtarları dolaşır.",
        ornek: k`
fiyat = {"kalem": 12, "defter": 45}
for urun, f in fiyat.items():
    print(urun, f)
print(sum(fiyat.values()))` }
    }
  },
  {
    id: "sayma", baslik: "Her elemanın kaç kez geçtiğini saymak", kategori: "Sözlük ve nesne",
    niyet: ["kaç kez geçiyor", "say", "frekans", "sıklık", "counter", "kelime sayısı", "tekrar sayısı", "en sık"],
    diller: {
      js: { ad: "Map ile sayma", sozdizimi: "sayac.set(x, (sayac.get(x) ?? 0) + 1)", aciklama: "Her eleman için mevcut sayıyı al (yoksa 0), bir artır.",
        ornek: k`
const kelimeler = "kod yaz kod oku kod".split(" ");
const sayac = new Map();
for (const k of kelimeler) sayac.set(k, (sayac.get(k) ?? 0) + 1);
console.log([...sayac].sort((a, b) => b[1] - a[1]));` },
      py: { ad: "collections.Counter", sozdizimi: "Counter(dizi)\nCounter(dizi).most_common(n)", aciklama: "Hazır sayaç; olmayan anahtar için 0 döndürür, en sıkları sıralı verir.",
        ornek: k`
from collections import Counter
c = Counter("kod yaz kod oku kod".split())
print(c["kod"], c.most_common(2))` },
      sql: { ad: "GROUP BY + COUNT()", sozdizimi: "SELECT sütun, COUNT(*) FROM tablo GROUP BY sütun;", aciklama: "Satırları gruplara ayırıp her grubu sayar.", ornek: k`
SELECT sehir, COUNT(*) AS kisi FROM ogrenciler GROUP BY sehir ORDER BY kisi DESC;` }
    }
  },
  {
    id: "gruplama", baslik: "Elemanları bir özelliğe göre gruplamak", kategori: "Sözlük ve nesne",
    niyet: ["grupla", "gruplara ayır", "kategoriye göre", "group by", "groupby", "şehre göre ayır"],
    diller: {
      js: { ad: "Object.groupBy()", sozdizimi: "Object.groupBy(dizi, (e) => anahtar)", aciklama: "Her elemanı fonksiyonun döndürdüğü anahtarın altında toplar (modern tarayıcılar).",
        ornek: k`
const ogr = [{ ad: "Ada", sehir: "İzmir" }, { ad: "Can", sehir: "Ankara" }, { ad: "Ece", sehir: "İzmir" }];
const g = Object.groupBy(ogr, (o) => o.sehir);
console.log(Object.fromEntries(Object.entries(g).map(([s, l]) => [s, l.map((o) => o.ad)])));` },
      py: { ad: "collections.defaultdict", sozdizimi: "g = defaultdict(list)\ng[anahtar].append(eleman)", aciklama: "Olmayan anahtara ilk erişimde boş liste oluşturur.",
        ornek: k`
from collections import defaultdict
ogr = [("Ada", "İzmir"), ("Can", "Ankara"), ("Ece", "İzmir")]
g = defaultdict(list)
for ad, sehir in ogr:
    g[sehir].append(ad)
print(dict(g))` },
      sql: { ad: "GROUP BY", sozdizimi: "SELECT sütun, TOPLAMA(...) FROM tablo GROUP BY sütun HAVING kosul;", aciklama: "Gruplara ayırıp her grup için toplama fonksiyonu uygular; gruplara koşul HAVING ile verilir.", ornek: k`
SELECT sehir, ROUND(AVG(puan), 1) AS ort FROM ogrenciler GROUP BY sehir HAVING COUNT(*) > 1;` }
    }
  },

  /* ============================== KONTROL AKIŞI ============================== */
  {
    id: "kosul", baslik: "Koşula göre karar vermek (if)", kategori: "Kontrol akışı",
    niyet: ["eğer", "if", "koşul", "değilse", "else", "elif", "else if", "karar", "şart"],
    diller: {
      js: { ad: "if / else if / else", sozdizimi: "if (kosul) { ... } else if (kosul2) { ... } else { ... }", aciklama: "Koşul parantez içinde, blok süslü parantez içinde yazılır. Karşılaştırmada === kullan (== tür dönüştürür).",
        ornek: k`
const puan = 72;
if (puan >= 85) console.log("pekiyi");
else if (puan >= 50) console.log("geçti");
else console.log("kaldı");
console.log(0 == "", 0 === "");   // true false` },
      py: { ad: "if / elif / else", sozdizimi: "if kosul:\n    ...\nelif kosul2:\n    ...\nelse:\n    ...", aciklama: "Satır sonunda iki nokta, blok girintiyle. else if yerine elif.",
        ornek: k`
puan = 72
if puan >= 85:
    print("pekiyi")
elif puan >= 50:
    print("geçti")
else:
    print("kaldı")` },
      c: { ad: "if / else", sozdizimi: "if (kosul) { ... } else { ... }", aciklama: "C'de 0 yanlış, sıfır olmayan her değer doğrudur. if (x = 5) atama yapar ve her zaman doğrudur: karşılaştırma ==.",
        ornek: k`
#include <stdio.h>

int main(void) {
    int puan = 72;
    if (puan >= 50) printf("geçti\n");
    else printf("kaldı\n");
    return 0;
}` },
      sql: { ad: "CASE WHEN", sozdizimi: "CASE WHEN kosul THEN deger ... ELSE deger END", aciklama: "Sorgu içinde koşula göre değer üretir.", ornek: k`
SELECT ad, CASE WHEN puan >= 85 THEN 'pekiyi' WHEN puan >= 50 THEN 'geçti' ELSE 'yok' END AS durum FROM ogrenciler;` }
    }
  },
  {
    id: "coklu-secim", baslik: "Bir değere göre çok yönlü seçim (switch)", kategori: "Kontrol akışı",
    niyet: ["switch", "case", "match", "çok seçenek", "menü seçimi", "değere göre dallan"],
    diller: {
      js: { ad: "switch", sozdizimi: "switch (deger) { case 1: ...; break; default: ... }", aciklama: "Her case'in sonunda break unutulursa alttaki case'ler de çalışır.",
        ornek: k`
const gun = 6;
switch (gun) {
  case 6:
  case 7: console.log("hafta sonu"); break;
  default: console.log("hafta içi");
}` },
      py: { ad: "match / sözlük", sozdizimi: "match deger:\n    case 1: ...\n    case _: ...", aciklama: "Python 3.10+ match yapısı; düşme (fall-through) yoktur. Basit eşlemeler için sözlük de kullanılır.",
        ornek: k`
def gun_turu(gun):
    match gun:
        case 6 | 7:
            return "hafta sonu"
        case _:
            return "hafta içi"
print(gun_turu(6), gun_turu(2))` },
      c: { ad: "switch", sozdizimi: "switch (x) { case 1: ...; break; default: ...; }", aciklama: "Tam sayı ve karakterlerle çalışır; break unutulursa düşme olur.",
        ornek: k`
#include <stdio.h>

int main(void) {
    char op = '*';
    switch (op) {
        case '+': printf("topla\n"); break;
        case '*': printf("çarp\n"); break;
        default: printf("bilinmiyor\n");
    }
    return 0;
}` }
    }
  },
  {
    id: "for-dongusu", baslik: "Belirli sayıda / her eleman için tekrar (for)", kategori: "Kontrol akışı",
    niyet: ["for döngüsü", "tekrarla", "n kez", "döngü kur", "her eleman için", "range", "1'den 10'a kadar", "listeyi gez"],
    diller: {
      js: { ad: "for / for...of", sozdizimi: "for (let i = 0; i < n; i++) { ... }\nfor (const x of dizi) { ... }", aciklama: "Sayaçlı for, n kez tekrarlar; for...of dizinin elemanlarını verir. for...in nesne anahtarları içindir, dizilerde kullanma.",
        ornek: k`
for (let i = 1; i <= 3; i++) console.log("tur", i);
for (const [i, meyve] of ["elma", "muz"].entries()) console.log(i, meyve);` },
      py: { ad: "for / range() / enumerate()", sozdizimi: "for i in range(n):\nfor x in liste:\nfor i, x in enumerate(liste):", aciklama: "Python'da for her zaman bir dizinin elemanlarını dolaşır; sayı için range. Konum da gerekiyorsa enumerate.",
        ornek: k`
for i in range(1, 4):
    print("tur", i)
for i, meyve in enumerate(["elma", "muz"], 1):
    print(i, meyve)` },
      c: { ad: "for", sozdizimi: "for (başlangıç; koşul; artış) { ... }", aciklama: "Üç bölümlü klasik döngü.",
        ornek: k`
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 3; i++) printf("tur %d\n", i);
    return 0;
}` }
    }
  },
  {
    id: "while-dongusu", baslik: "Koşul sağlandıkça tekrar (while)", kategori: "Kontrol akışı",
    niyet: ["while", "koşul doğru oldukça", "sonsuz döngü", "kullanıcı çıkana kadar", "do while", "bilinmeyen sayıda tekrar"],
    diller: {
      js: { ad: "while / do...while", sozdizimi: "while (kosul) { ... }\ndo { ... } while (kosul);", aciklama: "do...while gövdeyi en az bir kez çalıştırır. Koşulu bir gün yanlış yapacak bir değişiklik olmalı.",
        ornek: k`
let n = 4096, adim = 0;
while (n > 1) { n = n / 2; adim++; }
console.log(adim);` },
      py: { ad: "while", sozdizimi: "while kosul:\n    ...", aciklama: "Python'da do-while yoktur; while True: ... break kalıbı kullanılır.",
        ornek: k`
n, adim = 4096, 0
while n > 1:
    n //= 2
    adim += 1
print(adim)` },
      c: { ad: "while / do...while", sozdizimi: "while (kosul) { ... }", aciklama: "JavaScript ile aynı biçim.", ornek: k`
#include <stdio.h>

int main(void) {
    int n = 4096, adim = 0;
    while (n > 1) { n /= 2; adim++; }
    printf("%d\n", adim);
    return 0;
}` }
    }
  },
  {
    id: "dongu-kirma", baslik: "Döngüden çıkmak veya turu atlamak", kategori: "Kontrol akışı",
    niyet: ["döngüden çık", "break", "continue", "turu atla", "döngüyü durdur", "erken çık"],
    diller: {
      js: { ad: "break / continue", sozdizimi: "break;\ncontinue;", aciklama: "break döngüyü tamamen bitirir; continue bu turu bırakıp sonrakine geçer. forEach içinde çalışmazlar; for...of kullan.",
        ornek: k`
for (const x of [1, 2, 3, 4, 5]) {
  if (x === 2) continue;
  if (x === 4) break;
  console.log(x);
}` },
      py: { ad: "break / continue / for...else", sozdizimi: "break\ncontinue\nfor ...:\n    ...\nelse:\n    # break olmadıysa", aciklama: "Python'da döngünün else bloğu, döngü break ile kesilmeden biterse çalışır (arama kalıbı).",
        ornek: k`
for x in [1, 3, 5]:
    if x % 2 == 0:
        print("çift bulundu")
        break
else:
    print("hiç çift yok")` },
      c: { ad: "break / continue", sozdizimi: "break;\ncontinue;", aciklama: "Aynı anlamda; break switch içinde de kullanılır.", ornek: k`
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        if (i == 2) continue;
        if (i == 4) break;
        printf("%d\n", i);
    }
    return 0;
}` }
    }
  },
  {
    id: "kosullu-ifade", baslik: "Tek satırda koşullu değer (üçlü işleç)", kategori: "Kontrol akışı",
    niyet: ["tek satır if", "ternary", "üçlü operatör", "soru işareti iki nokta", "koşullu ifade", "x if c else y"],
    diller: {
      js: { ad: "kosul ? a : b", sozdizimi: "const x = kosul ? degerA : degerB;", aciklama: "Değer üreten kısa if. İç içe kullanmak okunurluğu düşürür.",
        ornek: k`
const puan = 72;
console.log(puan >= 50 ? "geçti" : "kaldı");` },
      py: { ad: "a if kosul else b", sozdizimi: "x = deger_a if kosul else deger_b", aciklama: "Python'da sıra farklıdır: önce doğru durumdaki değer.",
        ornek: k`
puan = 72
print("geçti" if puan >= 50 else "kaldı")` },
      c: { ad: "kosul ? a : b", sozdizimi: "int x = kosul ? a : b;", aciklama: "JavaScript ile aynı.", ornek: k`
#include <stdio.h>

int main(void) {
    int puan = 72;
    printf("%s\n", puan >= 50 ? "geçti" : "kaldı");
    return 0;
}` }
    }
  },

  /* ============================== FONKSİYONLAR ============================== */
  {
    id: "fonksiyon", baslik: "Fonksiyon tanımlamak", kategori: "Fonksiyonlar",
    niyet: ["fonksiyon yaz", "fonksiyon tanımla", "function", "def", "metot oluştur", "kodu tekrar kullan", "ok fonksiyonu"],
    diller: {
      js: { ad: "function / ok fonksiyonu", sozdizimi: "function ad(p1, p2) { return ...; }\nconst ad = (p1, p2) => ...;", aciklama: "Ok fonksiyonu tek ifadede süslü parantezsiz yazılırsa sonucu otomatik döndürür.",
        ornek: k`
function kare(x) { return x * x; }
const kup = (x) => x ** 3;
console.log(kare(4), kup(3));` },
      py: { ad: "def", sozdizimi: "def ad(p1, p2=varsayilan):\n    return ...", aciklama: "Gövde girintiyle yazılır. return yoksa None döner. Belgelemek için gövdenin ilk satırına \"\"\"açıklama\"\"\".",
        ornek: k`
def kare(x):
    """x'in karesini döndürür."""
    return x * x

print(kare(4), kare.__doc__)` },
      c: { ad: "dönüş_türü ad(parametreler)", sozdizimi: "int kare(int x) { return x * x; }", aciklama: "Dönüş ve parametre türleri yazılır. Değer döndürmüyorsa void. Kullanmadan önce tanımlanmalı ya da prototipi bildirilmeli.",
        ornek: k`
#include <stdio.h>

int kare(int x) { return x * x; }

int main(void) {
    printf("%d\n", kare(4));
    return 0;
}` }
    }
  },
  {
    id: "return", baslik: "return: fonksiyondan değer döndürmek", kategori: "Fonksiyonlar",
    niyet: ["return ne demek", "değer döndür", "dönüş değeri", "return ile print farkı", "fonksiyon sonucu", "undefined dönüyor", "none dönüyor"],
    diller: {
      js: { ad: "return", sozdizimi: "return ifade;", aciklama: "Fonksiyonu bitirir ve değeri çağırana verir. console.log ekrana yazar ama değer döndürmez; return yazılmazsa sonuç undefined olur.",
        ornek: k`
function yaz(x) { console.log(x * 2); }
function don(x) { return x * 2; }
console.log(yaz(3), don(3));   // 6, sonra: undefined 6` },
      py: { ad: "return", sozdizimi: "return ifade\nreturn a, b", aciklama: "print ekrana yazar, return değeri geri verir. return yoksa fonksiyon None döndürür. Virgülle birden çok değer (demet) döndürülebilir.",
        ornek: k`
def yaz(x):
    print(x * 2)

def don(x):
    return x * 2

print(yaz(3), don(3))   # 6, sonra: None 6` },
      c: { ad: "return", sozdizimi: "return ifade;", aciklama: "Dönüş türü void değilse her yolda bir değer döndürülmelidir; main'den 0 dönmek 'başarılı' demektir.",
        ornek: k`
#include <stdio.h>

int mutlak(int x) {
    if (x < 0) return -x;
    return x;
}

int main(void) {
    printf("%d\n", mutlak(-5));
    return 0;
}` }
    }
  },
  {
    id: "varsayilan-parametre", baslik: "Varsayılan ve isimli parametreler", kategori: "Fonksiyonlar",
    niyet: ["varsayılan değer", "isteğe bağlı parametre", "default parameter", "isimli argüman", "keyword argument", "opsiyonel"],
    diller: {
      js: { ad: "varsayılan parametre / nesne parametresi", sozdizimi: "function f(a, b = 10) { }\nfunction g({ x = 1, y = 2 } = {}) { }", aciklama: "İsimli argüman için tek bir nesne parametresi ve yapı çözme kullanılır.",
        ornek: k`
function selam(ad, selam = "Merhaba") { return selam + ", " + ad; }
function kutu({ en = 10, boy = 5 } = {}) { return en * boy; }
console.log(selam("Ada"), kutu({ boy: 2 }));` },
      py: { ad: "varsayılan ve isimli argüman", sozdizimi: "def f(a, b=10, *, sadece_isimle=False):", aciklama: "Değiştirilebilir varsayılan (liste, sözlük) kullanma: tüm çağrılar aynı nesneyi paylaşır; None kullan.",
        ornek: k`
def selam(ad, selam="Merhaba"):
    return f"{selam}, {ad}"
print(selam("Ada"), selam(selam="Selam", ad="Can"))` }
    }
  },
  {
    id: "anonim-fonksiyon", baslik: "İsimsiz (anonim) fonksiyon", kategori: "Fonksiyonlar",
    niyet: ["lambda", "anonim fonksiyon", "isimsiz fonksiyon", "arrow function", "callback", "geri çağırma", "fonksiyon işaretçisi"],
    diller: {
      js: { ad: "ok fonksiyonu", sozdizimi: "(x) => x * 2", aciklama: "Bir fonksiyona argüman olarak (geri çağırma) sıkça verilir.",
        ornek: k`
const sayilar = [3, 1, 2];
console.log(sayilar.map((x) => x * 2), [...sayilar].sort((a, b) => a - b));` },
      py: { ad: "lambda", sozdizimi: "lambda x: x * 2", aciklama: "Tek ifadelik isimsiz fonksiyon; genellikle sorted, max, map gibi fonksiyonlara key olarak verilir.",
        ornek: k`
ogr = [("Can", 72), ("Ada", 90)]
print(sorted(ogr, key=lambda t: t[1]))` },
      c: { ad: "fonksiyon işaretçisi", sozdizimi: "int (*f)(int) = kare;", aciklama: "C'de isimsiz fonksiyon yoktur; adı olan bir fonksiyonun adresi aktarılır.",
        ornek: k`
#include <stdio.h>

int ikiKati(int x) { return 2 * x; }

void uygula(int *d, int n, int (*f)(int)) { for (int i = 0; i < n; i++) d[i] = f(d[i]); }

int main(void) {
    int d[] = {1, 2, 3};
    uygula(d, 3, ikiKati);
    printf("%d %d %d\n", d[0], d[1], d[2]);
    return 0;
}` }
    }
  },
  {
    id: "ozyineleme", baslik: "Özyineleme (fonksiyonun kendini çağırması)", kategori: "Fonksiyonlar",
    niyet: ["özyineleme", "recursion", "kendini çağıran fonksiyon", "rekürsif", "faktöriyel", "temel durum"],
    diller: {
      js: { ad: "özyinelemeli fonksiyon", sozdizimi: "function f(n) { if (temel) return ...; return f(daha küçük); }", aciklama: "Her özyinelemenin bir temel durumu olmalı ve her çağrı ona yaklaşmalı; yoksa yığın taşar (RangeError).",
        ornek: k`
function faktoriyel(n) { return n <= 1 ? 1 : n * faktoriyel(n - 1); }
console.log(faktoriyel(5));` },
      py: { ad: "özyinelemeli fonksiyon", sozdizimi: "def f(n):\n    if temel: return ...\n    return f(daha_kucuk)", aciklama: "Python'un varsayılan özyineleme sınırı yaklaşık 1000'dir. Tekrarlanan alt problemleri functools.cache ile hızlandır.",
        ornek: k`
from functools import cache

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(80))` },
      c: { ad: "özyinelemeli fonksiyon", sozdizimi: "long f(int n) { if (n <= 1) return 1; return n * f(n - 1); }", aciklama: "Aynı ilke; derin özyineleme yığın taşmasına (stack overflow) neden olur.",
        ornek: k`
#include <stdio.h>

long faktoriyel(int n) { return n <= 1 ? 1 : n * faktoriyel(n - 1); }

int main(void) {
    printf("%ld\n", faktoriyel(10));
    return 0;
}` }
    }
  },

  /* ============================== DEĞİŞKENLER ============================== */
  {
    id: "degisken", baslik: "Değişken tanımlamak", kategori: "Değişkenler ve türler",
    niyet: ["değişken tanımla", "değişken oluştur", "let", "const", "var", "atama", "variable", "değer sakla"],
    diller: {
      js: { ad: "let / const", sozdizimi: "let sayac = 0;\nconst PI = 3.14;", aciklama: "Değişmeyecekse const, değişecekse let. var eski ve blok kapsamı olmayan bir biçimdir; kullanma.",
        ornek: k`
const ad = "Ada";
let yas = 30;
yas += 1;
console.log(ad, yas);` },
      py: { ad: "atama =", sozdizimi: "ad = deger\na, b = 1, 2", aciklama: "Anahtar kelime ya da tür yazılmaz; ilk atama değişkeni oluşturur. Birden çok değişkene aynı anda atanabilir.",
        ornek: k`
ad = "Ada"
yas = 30
yas += 1
a, b = 1, 2
a, b = b, a     # takas
print(ad, yas, a, b)` },
      c: { ad: "tür ad = değer;", sozdizimi: "int yas = 30;\ndouble boy = 1.74;\nchar harf = 'A';", aciklama: "Türü yazmak zorunludur ve sonradan değişmez. İlk değer verilmeyen yerel değişkenin içeriği çöptür.",
        ornek: k`
#include <stdio.h>

int main(void) {
    int yas = 30;
    double boy = 1.74;
    char harf = 'A';
    printf("%d %.2f %c\n", yas, boy, harf);
    return 0;
}` }
    }
  },
  {
    id: "sabit", baslik: "Sabit (değişmeyen değer) tanımlamak", kategori: "Değişkenler ve türler",
    niyet: ["sabit", "constant", "const", "define", "değişmeyen değer", "sihirli sayı"],
    diller: {
      js: { ad: "const / Object.freeze()", sozdizimi: "const MAKS = 100;\nconst AYAR = Object.freeze({ ... });", aciklama: "const değişkenin YENİDEN ATANMASINI engeller; içindeki nesne yine değişebilir. İçeriği de dondurmak için Object.freeze.",
        ornek: k`
const LISTE = [1, 2];
LISTE.push(3);          // izinli: içerik değişir
console.log(LISTE);
try { LISTE = []; } catch (e) { console.log(e.name); }` },
      py: { ad: "BÜYÜK_HARF adlandırma", sozdizimi: "MAKS_DENEME = 3", aciklama: "Python'da gerçek sabit yoktur; büyük harfli ad 'değiştirme' sözleşmesidir. Değişmeyen koleksiyon için demet ya da frozenset.",
        ornek: k`
MAKS_DENEME = 3
GUNLER = ("Pzt", "Sal", "Çar")
print(MAKS_DENEME, GUNLER[0])` },
      c: { ad: "const / #define / enum", sozdizimi: "const int MAKS = 100;\n#define MAKS 100", aciklama: "const türü olan salt okunur değişkendir; #define derlemeden önce metin değiştirir. Tür denetimi için const tercih edilir.",
        ornek: k`
#include <stdio.h>
#define KAPASITE 8

int main(void) {
    const double KDV = 0.20;
    int dizi[KAPASITE];
    printf("%zu %.2f\n", sizeof dizi / sizeof dizi[0], KDV);
    return 0;
}` }
    }
  },
  {
    id: "tur-ogrenme", baslik: "Bir değerin türünü öğrenmek", kategori: "Değişkenler ve türler",
    niyet: ["türü ne", "type", "typeof", "isinstance", "dizi mi", "sayı mı", "veri tipi", "tür kontrolü"],
    diller: {
      js: { ad: "typeof / Array.isArray()", sozdizimi: "typeof deger\nArray.isArray(deger)", aciklama: "typeof dizi ve null için \"object\" der; diziyi Array.isArray, null'u === null ile kontrol et.",
        ornek: k`
console.log(typeof 42, typeof "a", typeof true, typeof undefined);
console.log(typeof [], Array.isArray([]), typeof null);` },
      py: { ad: "type() / isinstance()", sozdizimi: "type(deger)\nisinstance(deger, (int, float))", aciklama: "Tür kontrolünde isinstance tercih edilir; alt sınıfları da kabul eder.",
        ornek: k`
print(type(42).__name__, type("a").__name__, type([]).__name__)
print(isinstance(3.5, (int, float)), isinstance(True, int))` },
      c: { ad: "sizeof", sozdizimi: "sizeof(tür)", aciklama: "C'de tür derleme anında bellidir; çalışma anında sorgulanmaz. sizeof bir türün bayt boyutunu verir.",
        ornek: k`
#include <stdio.h>

int main(void) {
    printf("int %zu, double %zu, char %zu\n", sizeof(int), sizeof(double), sizeof(char));
    return 0;
}` }
    }
  },
  {
    id: "bos-deger", baslik: "Boş değer: null, undefined, None, NULL", kategori: "Değişkenler ve türler",
    niyet: ["null", "undefined", "none", "boş değer", "değer yok", "null kontrolü", "nullish", "?? operatörü", "is null"],
    diller: {
      js: { ad: "null / undefined / ?? / ?.", sozdizimi: "deger ?? varsayilan\nnesne?.alan", aciklama: "undefined 'henüz değer verilmedi', null 'bilerek boş' demektir. ?? yalnızca null/undefined'da varsayılanı kullanır (|| ise 0 ve \"\"'de de).",
        ornek: k`
const ayar = { sayi: 0 };
console.log(ayar.sayi || 10, ayar.sayi ?? 10);   // 10 0
console.log(ayar.kullanici?.ad ?? "misafir");` },
      py: { ad: "None", sozdizimi: "if x is None:\nx = deger if deger is not None else varsayilan", aciklama: "None ile karşılaştırmada == değil is kullanılır.",
        ornek: k`
def bul(ad):
    return None
sonuc = bul("x")
print(sonuc is None, sonuc or "bulunamadı")` },
      c: { ad: "NULL", sozdizimi: "if (p == NULL) { ... }", aciklama: "Hiçbir yeri göstermeyen işaretçi. malloc ve fopen başarısız olunca NULL döner; her zaman kontrol et. NULL'ı okumak programı çökertir.",
        ornek: k`
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(sizeof *p);
    if (p == NULL) { printf("bellek yok\n"); return 1; }
    *p = 7; printf("%d\n", *p);
    free(p);
    return 0;
}` },
      sql: { ad: "NULL / IS NULL / COALESCE", sozdizimi: "WHERE sütun IS NULL\nCOALESCE(sütun, varsayilan)", aciklama: "NULL 'bilinmiyor' demektir; = NULL hiçbir zaman doğru olmaz, IS NULL kullanılır.", ornek: k`
SELECT ad, COALESCE(puan, 0) AS puan FROM ogrenciler WHERE puan IS NULL OR puan > 80;` }
    }
  },

  /* ============================== HATALAR ============================== */
  {
    id: "hata-yakalama", baslik: "Hataları yakalamak", kategori: "Hatalar",
    niyet: ["hata yakala", "try catch", "try except", "program çökmesin", "exception", "hata yönetimi", "istisna"],
    diller: {
      js: { ad: "try / catch / finally", sozdizimi: "try { ... } catch (e) { ... } finally { ... }", aciklama: "Hata nesnesinin name ve message alanları vardır. Asenkron kodda await'i try içine koy.",
        ornek: k`
try {
  JSON.parse("{bozuk");
} catch (e) {
  console.log("yakalandı:", e.name);
} finally {
  console.log("her durumda çalışır");
}` },
      py: { ad: "try / except / else / finally", sozdizimi: "try:\n    ...\nexcept ValueError as e:\n    ...\nelse:\n    ...\nfinally:\n    ...", aciklama: "Yalnızca beklediğin istisnayı adıyla yakala; çıplak except: tüm hataları yutar. else hata olmazsa çalışır.",
        ornek: k`
try:
    sayi = int("12a")
except ValueError as e:
    print("geçersiz:", e)
else:
    print("sayı:", sayi)
finally:
    print("bitti")` },
      c: { ad: "dönüş değeri ve errno", sozdizimi: "if (fonksiyon(...) == HATA) { ... }", aciklama: "C'de istisna yoktur. Fonksiyonlar başarıyı dönüş değeriyle bildirir; her çağrının sonucunu kontrol edersin.",
        ornek: k`
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

int main(void) {
    errno = 0;
    char *son;
    long n = strtol("12a", &son, 10);
    if (*son != '\0') printf("geçersiz karakter: %s (okunan %ld)\n", son, n);
    return 0;
}` }
    }
  },
  {
    id: "hata-firlatma", baslik: "Kendi hatanı fırlatmak", kategori: "Hatalar",
    niyet: ["hata fırlat", "throw", "raise", "kendi hatam", "özel hata sınıfı", "geçersiz değerde hata ver"],
    diller: {
      js: { ad: "throw new Error()", sozdizimi: "throw new Error(\"mesaj\");\nclass BenimHatam extends Error {}", aciklama: "Her zaman Error nesnesi fırlat (metin değil): yığın izi taşır.",
        ornek: k`
function yasAyarla(y) {
  if (y < 0) throw new RangeError("yaş negatif olamaz");
  return y;
}
try { yasAyarla(-1); } catch (e) { console.log(e.name, e.message); }` },
      py: { ad: "raise", sozdizimi: "raise ValueError(\"mesaj\")\nclass BenimHatam(Exception): pass", aciklama: "Uygun yerleşik istisnayı (ValueError, TypeError, KeyError...) seç ya da Exception'dan türet.",
        ornek: k`
class YetersizBakiye(Exception):
    pass

def cek(bakiye, tutar):
    if tutar > bakiye:
        raise YetersizBakiye(f"{tutar} > {bakiye}")
    return bakiye - tutar

try:
    cek(10, 50)
except YetersizBakiye as e:
    print("hata:", e)` }
    }
  },

  /* ============================== GİRDİ VE ÇIKTI ============================== */
  {
    id: "ekrana-yazdirma", baslik: "Ekrana yazdırmak", kategori: "Girdi ve çıktı",
    niyet: ["ekrana yaz", "yazdır", "print", "console.log", "printf", "çıktı ver", "konsola yaz", "satır atla"],
    diller: {
      js: { ad: "console.log()", sozdizimi: "console.log(deger1, deger2, ...)", aciklama: "Değerleri aralarında boşlukla geliştirici konsoluna yazar. Tablolar için console.table, hatalar için console.error.",
        ornek: k`
console.log("Merhaba", 42, [1, 2]);
console.table([{ ad: "Ada", puan: 90 }, { ad: "Can", puan: 72 }]);` },
      py: { ad: "print()", sozdizimi: "print(*degerler, sep=\" \", end=\"\\n\")", aciklama: "sep değerlerin arasına, end sona yazılır.",
        ornek: k`
print("Merhaba", 42, [1, 2])
print("a", "b", "c", sep="-")
print("aynı ", end="")
print("satır")` },
      c: { ad: "printf()", sozdizimi: "printf(\"biçim\\n\", degerler...);", aciklama: "İlk argüman biçim metnidir; %d, %f, %s yer tutucuları sırayla değerlerle doldurulur. Satır sonu için \\n yazılmalı.",
        ornek: k`
#include <stdio.h>

int main(void) {
    printf("Merhaba %s, %d yaşındasın.\n", "Ada", 30);
    puts("puts satır sonunu kendisi ekler");
    return 0;
}` }
    }
  },
  {
    id: "kullanicidan-girdi", baslik: "Kullanıcıdan girdi almak", kategori: "Girdi ve çıktı",
    niyet: ["kullanıcıdan al", "kullanıcıdan sayı almak", "kullanıcıdan veri almak", "girdi al", "input", "klavyeden oku", "scanf", "prompt", "sayı iste", "veri girişi"],
    diller: {
      js: { ad: "<input> + olay / prompt()", sozdizimi: "const deger = girdi.value;", aciklama: "Web sayfasında girdi bir form alanından okunur. prompt() açılır kutu gösterir ama kullanıcı deneyimi kötüdür.",
        ornek: k`
<label>Adın <input id="ad" /></label>
<button id="b">Selamla</button>
<p id="cikti"></p>
<script>
  document.getElementById("b").addEventListener("click", () => {
    const ad = document.getElementById("ad").value.trim();
    document.getElementById("cikti").textContent = ad ? "Merhaba " + ad : "Önce adını yaz";
  });
</script>`, tur: "html" },
      py: { ad: "input()", sozdizimi: "metin = input(\"Soru: \")\nsayi = int(input())", aciklama: "Bir satır okur ve METİN döndürür; sayı için int()/float() ile dönüştür. QUAGEN'de girdiyi Girdi kutusuna yazarsın.",
        ornek: k`
ad = input()
yas = int(input())
print(f"Merhaba {ad}, 10 yıl sonra {yas + 10} olacaksın.")`, stdin: "Ada\n30\n" },
      c: { ad: "scanf() / fgets()", sozdizimi: "scanf(\"%d\", &sayi);\nfgets(tampon, sizeof tampon, stdin);", aciklama: "scanf'e değişkenin ADRESİNİ (&) verirsin; başarıyla okunan değer sayısını döndürür. Satır okumak için fgets daha güvenlidir.",
        ornek: k`
#include <stdio.h>

int main(void) {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) printf("toplam: %d\n", a + b);
    else printf("iki sayı bekleniyordu\n");
    return 0;
}`, stdin: "3 4\n" },
      html: { ad: "<input>", sozdizimi: "<input type=\"text\" name=\"ad\" required />", aciklama: "Form alanı; type ile tür (text, number, email, date, checkbox...) seçilir. Her alana bir <label> bağla.",
        ornek: k`
<form>
  <label>E-posta <input type="email" required placeholder="ada@ornek.com" /></label>
  <label>Yaş <input type="number" min="0" max="150" /></label>
  <button>Gönder</button>
</form>` }
    }
  },

  /* ============================== NESNE YÖNELİMLİ ============================== */
  {
    id: "sinif", baslik: "Sınıf (class) tanımlamak", kategori: "Nesne yönelimli",
    niyet: ["sınıf oluştur", "class", "nesne yönelimli", "oop", "constructor", "yapıcı", "init", "metot", "this", "self"],
    diller: {
      js: { ad: "class", sozdizimi: "class Ad {\n  constructor(x) { this.x = x; }\n  metot() { ... }\n}", aciklama: "constructor nesne oluşturulurken çalışır; this oluşturulan nesnedir. # ile başlayan alanlar özeldir.",
        ornek: k`
class Hesap {
  #bakiye = 0;
  constructor(sahip) { this.sahip = sahip; }
  yatir(t) { this.#bakiye += t; return this; }
  get bakiye() { return this.#bakiye; }
}
const h = new Hesap("Ada").yatir(100).yatir(50);
console.log(h.sahip, h.bakiye);` },
      py: { ad: "class", sozdizimi: "class Ad:\n    def __init__(self, x):\n        self.x = x\n    def metot(self):\n        ...", aciklama: "__init__ yapıcıdır; self nesnenin kendisidir ve her metodun ilk parametresidir. Yalnızca veri taşıyan sınıflar için @dataclass.",
        ornek: k`
class Hesap:
    def __init__(self, sahip):
        self.sahip = sahip
        self.bakiye = 0

    def yatir(self, t):
        self.bakiye += t
        return self

h = Hesap("Ada").yatir(100).yatir(50)
print(h.sahip, h.bakiye)` },
      c: { ad: "struct + fonksiyonlar", sozdizimi: "typedef struct { ... } Tur;\nvoid tur_metot(Tur *t, ...);", aciklama: "C'de sınıf yoktur; veri struct'ta, davranış struct'a işaretçi alan fonksiyonlarda tutulur.",
        ornek: k`
#include <stdio.h>

typedef struct { const char *sahip; long bakiye; } Hesap;

void yatir(Hesap *h, long t) { h->bakiye += t; }

int main(void) {
    Hesap h = { "Ada", 0 };
    yatir(&h, 100); yatir(&h, 50);
    printf("%s %ld\n", h.sahip, h.bakiye);
    return 0;
}` }
    }
  },
  {
    id: "kalitim", baslik: "Kalıtım (bir sınıftan türetmek)", kategori: "Nesne yönelimli",
    niyet: ["kalıtım", "inheritance", "extends", "türet", "alt sınıf", "super", "üst sınıf", "miras"],
    diller: {
      js: { ad: "extends / super", sozdizimi: "class Alt extends Ust {\n  constructor(...) { super(...); }\n}", aciklama: "Alt sınıf üst sınıfın metotlarını devralır; aynı adlı metot yazarak davranışı değiştirebilir (override).",
        ornek: k`
class Hayvan { constructor(ad) { this.ad = ad; } ses() { return "..."; } tanit() { return this.ad + ": " + this.ses(); } }
class Kedi extends Hayvan { ses() { return "miyav"; } }
console.log(new Kedi("Pamuk").tanit());` },
      py: { ad: "class Alt(Ust) / super()", sozdizimi: "class Alt(Ust):\n    def __init__(self, ...):\n        super().__init__(...)", aciklama: "Parantez içinde üst sınıf yazılır. Ortak davranışı paylaşmak için; 'bir ... türüdür' ilişkisi yoksa kalıtım yerine birleştirme (composition) düşün.",
        ornek: k`
class Hayvan:
    def __init__(self, ad):
        self.ad = ad
    def ses(self):
        return "..."
    def tanit(self):
        return f"{self.ad}: {self.ses()}"

class Kedi(Hayvan):
    def ses(self):
        return "miyav"

print(Kedi("Pamuk").tanit())` }
    }
  },

  /* ============================== ZAMAN VE VERİ BİÇİMLERİ ============================== */
  {
    id: "tarih-saat", baslik: "Tarih ve saatle çalışmak", kategori: "Zaman ve veri biçimleri",
    niyet: ["tarih", "saat", "bugünün tarihi", "gün farkı", "date", "datetime", "zaman", "kaç gün kaldı", "tarih biçimlendir"],
    diller: {
      js: { ad: "Date / Intl.DateTimeFormat", sozdizimi: "new Date()\nnew Date(\"2026-11-09\")\ntarih.toLocaleDateString(\"tr-TR\", { ... })", aciklama: "Aylar 0'dan başlar (Ocak = 0). İki tarih farkı milisaniyedir; güne çevirmek için 86 400 000'e böl.",
        ornek: k`
const bugun = new Date("2026-11-09");
const yilbasi = new Date("2027-01-01");
console.log(Math.round((yilbasi - bugun) / 864e5), "gün");
console.log(bugun.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));` },
      py: { ad: "datetime", sozdizimi: "from datetime import date, datetime, timedelta\ndate.today()\ndate.fromisoformat(\"2026-11-09\")", aciklama: "Tarih farkı timedelta'dır; .days ile gün sayısı. strftime ile biçimlendirilir.",
        ornek: k`
from datetime import date, timedelta
bugun = date(2026, 11, 9)
print((date(2027, 1, 1) - bugun).days, "gün")
print((bugun + timedelta(days=30)).strftime("%d.%m.%Y"))` },
      c: { ad: "time.h", sozdizimi: "time_t t = time(NULL);\nstrftime(tampon, n, \"%d.%m.%Y\", localtime(&t));", aciklama: "time saniye cinsinden zaman damgası verir; strftime biçimlendirir.",
        ornek: k`
#include <stdio.h>
#include <time.h>

int main(void) {
    char t[32];
    time_t simdi = time(NULL);
    strftime(t, sizeof t, "%d.%m.%Y %H:%M", localtime(&simdi));
    printf("%s\n", t);
    return 0;
}` },
      sql: { ad: "date() / julianday()", sozdizimi: "date('now')\njulianday(a) - julianday(b)", aciklama: "SQLite tarihleri metin olarak saklar ve date/datetime fonksiyonlarıyla hesaplar.", ornek: k`
SELECT date('2026-11-09', '+30 days') AS sonra, CAST(julianday('2027-01-01') - julianday('2026-11-09') AS INTEGER) AS gun;` }
    }
  },
  {
    id: "json", baslik: "JSON okumak ve yazmak", kategori: "Zaman ve veri biçimleri",
    niyet: ["json", "json parse", "json çevir", "stringify", "dumps", "loads", "api verisi", "nesneyi metne çevir"],
    diller: {
      js: { ad: "JSON.parse() / JSON.stringify()", sozdizimi: "JSON.parse(metin)\nJSON.stringify(deger, null, 2)", aciklama: "parse geçersiz JSON'da SyntaxError fırlatır. stringify'ın üçüncü argümanı girintidir.",
        ornek: k`
const veri = JSON.parse('{"ad": "Ada", "diller": ["js", "py"]}');
console.log(veri.diller[1]);
console.log(JSON.stringify({ ad: "Can", aktif: true }, null, 2));` },
      py: { ad: "json.loads() / json.dumps()", sozdizimi: "json.loads(metin)\njson.dumps(deger, ensure_ascii=False, indent=2)", aciklama: "ensure_ascii=False Türkçe karakterleri kaçışsız yazar. Dosya için json.load / json.dump.",
        ornek: k`
import json
veri = json.loads('{"ad": "Ada", "diller": ["js", "py"], "aktif": true}')
print(veri["aktif"], veri["diller"])
print(json.dumps({"şehir": "İzmir"}, ensure_ascii=False))` }
    }
  },
  {
    id: "bekleme", baslik: "Beklemek, gecikmeli çalıştırmak ve asenkron kod", kategori: "Zaman ve veri biçimleri",
    niyet: ["bekle", "gecikme", "settimeout", "sleep", "async await", "promise", "asenkron", "zamanlayıcı", "bir saniye sonra"],
    diller: {
      js: { ad: "setTimeout / async–await", sozdizimi: "setTimeout(fonksiyon, ms)\nawait new Promise((r) => setTimeout(r, ms));", aciklama: "JavaScript beklerken donmaz: zamanlayıcı süresi dolunca fonksiyonu çağırır. async fonksiyon içinde await ile sırayla yazılmış gibi beklenir.",
        ornek: k`
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
async function geriSayim() {
  for (let i = 3; i > 0; i--) { console.log(i); await bekle(200); }
  console.log("başla!");
}
geriSayim();` },
      py: { ad: "time.sleep() / asyncio", sozdizimi: "time.sleep(saniye)\nawait asyncio.sleep(saniye)", aciklama: "time.sleep tüm programı durdurur. Aynı anda birçok bekleme için asyncio.",
        ornek: k`
import time
bas = time.perf_counter()
time.sleep(0.2)
print(f"{time.perf_counter() - bas:.1f} sn geçti")` },
      c: { ad: "timespec_get() / sleep()", sozdizimi: "timespec_get(&t, TIME_UTC);  /* C11, taşınabilir */\nsleep(saniye);              /* POSIX: <unistd.h> */", aciklama: "Standart C'de bekleme fonksiyonu yoktur; C11'in timespec_get'i ile geçen süre ölçülür. POSIX sistemlerde sleep ve nanosleep programı uyutur.", ornek: k`
#include <stdio.h>
#include <time.h>

static double simdi(void) { struct timespec t; timespec_get(&t, TIME_UTC); return t.tv_sec + t.tv_nsec / 1e9; }

int main(void) {
    double bas = simdi();
    while (simdi() - bas < 0.2) { }   /* 0.2 sn bekle */
    printf("%.1f sn geçti\n", simdi() - bas);
    return 0;
}` }
    }
  },

  /* ============================== BELLEK ============================== */
  {
    id: "bellek-ayirma", baslik: "Bellek ayırmak ve serbest bırakmak", kategori: "Bellek",
    niyet: ["malloc", "free", "bellek ayır", "dinamik bellek", "bellek sızıntısı", "memory leak", "çöp toplayıcı", "heap"],
    diller: {
      c: { ad: "malloc() / calloc() / free()", sozdizimi: "T *p = malloc(n * sizeof *p);\n...\nfree(p);", aciklama: "malloc istenen kadar bayt ayırır (içeriği çöptür), calloc sıfırlar. Her ayrılan blok tam bir kez free edilmelidir; edilmezse sızıntı, iki kez edilirse çökme olur.",
        ornek: k`
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    int *d = calloc(n, sizeof *d);
    if (!d) return 1;
    for (int i = 0; i < n; i++) d[i] = i * i;
    printf("%d\n", d[4]);
    free(d);
    d = NULL;
    return 0;
}`, not: "free ettikten sonra işaretçiyi NULL yap; serbest bırakılmış belleğe erişim (use-after-free) en tehlikeli hatalardandır." },
      js: { ad: "otomatik (çöp toplayıcı)", sozdizimi: "—", aciklama: "JavaScript belleği kendisi yönetir: hiçbir yerden erişilemeyen nesneler çöp toplayıcıyla silinir. Sızıntılar genellikle unutulan olay dinleyicileri ve büyüyen önbelleklerden olur.",
        ornek: k`
let buyuk = new Array(1e6).fill(0);
console.log(buyuk.length);
buyuk = null;  // artık erişilemez: toplayıcı geri alabilir` },
      py: { ad: "otomatik (başvuru sayımı)", sozdizimi: "—", aciklama: "Python nesneleri başvuru sayısı sıfıra inince silinir. del bir ADI siler, nesneyi değil.",
        ornek: k`
import sys
a = [1, 2, 3]
b = a
print(sys.getrefcount(a) - 1)   # a ve b: 2
del a
print(b)` }
    }
  },
  {
    id: "isaretci", baslik: "İşaretçiler ve başvurular", kategori: "Bellek",
    niyet: ["işaretçi", "pointer", "adres", "& operatörü", "yıldız", "referans", "değer mi referans mı", "fonksiyon değişkeni değiştirsin"],
    diller: {
      c: { ad: "* ve &", sozdizimi: "int *p = &x;\n*p = 5;", aciklama: "&x x'in adresini verir; *p p'nin gösterdiği yerdeki değerdir. Fonksiyonun çağıranın değişkenini değiştirmesi için adresini alması gerekir.",
        ornek: k`
#include <stdio.h>

void takas(int *a, int *b) { int t = *a; *a = *b; *b = t; }

int main(void) {
    int x = 1, y = 2;
    takas(&x, &y);
    printf("%d %d\n", x, y);
    return 0;
}` },
      js: { ad: "başvuru ile paylaşım", sozdizimi: "—", aciklama: "İlkel değerler (sayı, metin) kopyalanır; nesne ve diziler başvuruyla paylaşılır. Fonksiyona verilen nesneyi değiştirmek çağıranın nesnesini de değiştirir.",
        ornek: k`
function artir(n, nesne) { n++; nesne.n++; }
let sayi = 1; const kutu = { n: 1 };
artir(sayi, kutu);
console.log(sayi, kutu.n);   // 1 2` },
      py: { ad: "her şey başvuru", sozdizimi: "—", aciklama: "Değişkenler nesnelere verilen adlardır. Değiştirilebilir nesneler (liste, sözlük) fonksiyon içinde değiştirilirse çağıran da görür; sayı ve metin değiştirilemez.",
        ornek: k`
def ekle(liste):
    liste.append(4)
a = [1, 2, 3]
ekle(a)
print(a, a is a[:])` }
    }
  },

  /* ============================== HTML ============================== */
  {
    id: "baglanti", baslik: "Bağlantı (link) eklemek", kategori: "Web sayfası (HTML)",
    niyet: ["link ekle", "bağlantı", "a etiketi", "href", "yeni sekmede aç", "sayfaya git"],
    diller: {
      html: { ad: "<a href>", sozdizimi: "<a href=\"adres\">metin</a>", aciklama: "href gidilecek adrestir. Yeni sekmede açmak için target=\"_blank\" ve güvenlik için rel=\"noopener\". Bağlantı metni nereye gittiğini anlatmalı ('buraya tıkla' değil).",
        ornek: k`
<p><a href="https://developer.mozilla.org/tr/" target="_blank" rel="noopener">MDN belgeleri</a> yeni sekmede açılır.</p>
<p><a href="#alt">Sayfanın altına git</a></p>
<p><a href="mailto:destek@ornek.com">E-posta gönder</a></p>
<h3 id="alt">Alt bölüm</h3>` }
    }
  },
  {
    id: "resim", baslik: "Resim eklemek", kategori: "Web sayfası (HTML)",
    niyet: ["resim ekle", "görsel", "img", "fotoğraf koy", "alt metni", "resim boyutu"],
    diller: {
      html: { ad: "<img>", sozdizimi: "<img src=\"adres\" alt=\"açıklama\" width=\"…\" height=\"…\" />", aciklama: "alt, görseli göremeyenler (ekran okuyucu, yüklenmeme) için açıklamadır ve zorunlu sayılmalı. width/height sayfanın kaymasını önler; loading=\"lazy\" ekran dışındakileri sonra yükler.",
        ornek: k`
<img src="https://picsum.photos/seed/quagen/320/180" alt="Rastgele manzara fotoğrafı" width="320" height="180" loading="lazy" />` }
    }
  },
  {
    id: "html-liste", baslik: "Madde işaretli ve numaralı liste", kategori: "Web sayfası (HTML)",
    niyet: ["liste yap", "madde işareti", "numaralı liste", "ul", "ol", "li", "sıralı liste"],
    diller: {
      html: { ad: "<ul> / <ol> / <li>", sozdizimi: "<ul><li>madde</li></ul>\n<ol><li>adım</li></ol>", aciklama: "Sırası önemsiz maddeler için ul, adımlar ve sıralamalar için ol.",
        ornek: k`
<h4>Alışveriş</h4>
<ul><li>Süt</li><li>Ekmek</li></ul>
<h4>Kurulum</h4>
<ol><li>İndir</li><li>Kur</li><li>Çalıştır</li></ol>` }
    }
  },
  {
    id: "html-tablo", baslik: "Tablo oluşturmak", kategori: "Web sayfası (HTML)",
    niyet: ["tablo", "table", "satır sütun", "tr td", "veri tablosu"],
    diller: {
      html: { ad: "<table>", sozdizimi: "<table><thead><tr><th>…</th></tr></thead><tbody><tr><td>…</td></tr></tbody></table>", aciklama: "Tablo yalnızca tablo verisi içindir, sayfa yerleşimi için değil. Başlık hücreleri th, veri hücreleri td.",
        ornek: k`
<table border="1" cellpadding="6">
  <caption>Sınav sonuçları</caption>
  <thead><tr><th>Ad</th><th>Puan</th></tr></thead>
  <tbody><tr><td>Ada</td><td>90</td></tr><tr><td>Can</td><td>72</td></tr></tbody>
</table>` }
    }
  },
  {
    id: "form", baslik: "Form oluşturmak", kategori: "Web sayfası (HTML)",
    niyet: ["form", "giriş formu", "kayıt formu", "buton", "gönder", "submit", "label"],
    diller: {
      html: { ad: "<form>", sozdizimi: "<form><label>… <input /></label><button>Gönder</button></form>", aciklama: "Her alanın bir label'ı olmalı. required, type=\"email\", min/max gibi özellikler tarayıcıda doğrulama sağlar.",
        ornek: k`
<form onsubmit="event.preventDefault(); this.querySelector('output').textContent = 'Gönderildi: ' + this.eposta.value;">
  <label>E-posta <input name="eposta" type="email" required /></label>
  <label><input type="checkbox" required /> Koşulları kabul ediyorum</label>
  <button>Kayıt ol</button>
  <output></output>
</form>` },
      js: { ad: "submit olayı", sozdizimi: "form.addEventListener(\"submit\", (e) => { e.preventDefault(); ... });", aciklama: "preventDefault sayfanın yenilenmesini engeller; değerleri FormData ile toplarsın.",
        ornek: k`
<form id="f"><input name="ad" placeholder="Ad" /><button>Gönder</button></form>
<p id="o"></p>
<script>
  document.getElementById("f").addEventListener("submit", (e) => {
    e.preventDefault();
    const veri = Object.fromEntries(new FormData(e.target));
    document.getElementById("o").textContent = JSON.stringify(veri);
  });
</script>`, tur: "html" }
    }
  },

  /* ============================== CSS ============================== */
  {
    id: "ortalama", baslik: "Bir öğeyi ortalamak", kategori: "Görünüm (CSS)",
    niyet: ["ortala", "ortaya al", "yatay ortala", "dikey ortala", "center", "merkeze", "div ortalama"],
    diller: {
      css: { ad: "flex / grid ile ortalama", sozdizimi: ".kap { display: grid; place-items: center; }\n.kap { display: flex; justify-content: center; align-items: center; }", aciklama: "Kapsayıcıya uygulanır, içindekini ortalar. Grid'de place-items tek satırda iki yönü ortalar. Yalnızca yatay ortalama için margin-inline: auto (genişliği olan blok öğe).",
        ornek: k`
<style>
  .kap { display: grid; place-items: center; height: 160px; background: #eef2ff; border-radius: 12px; }
  .kutu { padding: 16px 24px; background: #4f46e5; color: white; border-radius: 8px; }
</style>
<div class="kap"><div class="kutu">Tam ortadayım</div></div>`, tur: "html" }
    }
  },
  {
    id: "izgara", baslik: "Izgara (grid) yerleşimi", kategori: "Görünüm (CSS)",
    niyet: ["grid", "ızgara", "sütunlara böl", "kart düzeni", "eşit sütun", "yan yana kutular", "flexbox"],
    diller: {
      css: { ad: "display: grid", sozdizimi: ".kap { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }", aciklama: "repeat(auto-fill, minmax(...)) medya sorgusuz duyarlı bir ızgara verir: ekrana sığdığı kadar sütun. Tek yönlü dizilim için flex.",
        ornek: k`
<style>
  .izgara { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; }
  .izgara div { background: #fde68a; padding: 18px; border-radius: 8px; text-align: center; }
</style>
<div class="izgara"><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div></div>`, tur: "html" }
    }
  },
  {
    id: "renk", baslik: "Renk ve arka plan vermek", kategori: "Görünüm (CSS)",
    niyet: ["renk ver", "arka plan rengi", "yazı rengi", "background", "color", "degrade", "gradient", "hex renk"],
    diller: {
      css: { ad: "color / background", sozdizimi: "color: #1f2937;\nbackground: linear-gradient(135deg, #a5b4fc, #fbcfe8);", aciklama: "color yazı rengidir, background arka plan. Okunabilirlik için yazı ve zemin arasında yeterli kontrast olmalı (en az 4.5:1).",
        ornek: k`
<div style="background: linear-gradient(135deg, #a5b4fc, #fbcfe8); color: #1e1b4b; padding: 24px; border-radius: 12px; font: 600 18px system-ui;">
  Degrade arka plan, koyu yazı
</div>`, tur: "html" }
    }
  },
  {
    id: "yazi-tipi", baslik: "Yazı tipi, boyutu ve kalınlığı", kategori: "Görünüm (CSS)",
    niyet: ["yazı tipi", "font", "yazı boyutu", "kalın yaz", "font-size", "font-weight", "satır aralığı"],
    diller: {
      css: { ad: "font-family / font-size / font-weight / line-height", sozdizimi: "font: 600 1.125rem/1.6 system-ui, sans-serif;", aciklama: "Boyut için rem kullan (kullanıcının tarayıcı ayarına göre ölçeklenir). Gövde metninde satır yüksekliği 1.5 civarı okunurluğu artırır.",
        ornek: k`
<p style="font-family: Georgia, serif; font-size: 1.25rem; line-height: 1.6">Okunaklı bir paragraf.</p>
<p style="font: 800 2rem/1.1 system-ui; letter-spacing: -0.02em">Kalın başlık</p>`, tur: "html" }
    }
  },
  {
    id: "duyarli", baslik: "Ekrana göre değişen tasarım (duyarlı)", kategori: "Görünüm (CSS)",
    niyet: ["mobil uyumlu", "duyarlı tasarım", "responsive", "media query", "telefon görünümü", "ekran genişliği"],
    diller: {
      css: { ad: "@media", sozdizimi: "@media (max-width: 600px) { seçici { ... } }", aciklama: "Belirli ekran koşullarında farklı kurallar uygular. Önce mobil için yazıp geniş ekranlarda (min-width) genişletmek yaygın yaklaşımdır.",
        ornek: k`
<style>
  .panel { display: flex; gap: 12px; }
  .panel div { flex: 1; padding: 16px; background: #dbeafe; border-radius: 8px; }
  @media (max-width: 500px) { .panel { flex-direction: column; } }
</style>
<div class="panel"><div>Sol</div><div>Sağ</div></div>
<p>Pencereyi daralt: kutular alt alta geçer.</p>`, tur: "html" }
    }
  },
  {
    id: "animasyon", baslik: "Geçiş ve animasyon", kategori: "Görünüm (CSS)",
    niyet: ["animasyon", "geçiş efekti", "transition", "hover efekti", "keyframes", "hareket", "yumuşak geçiş"],
    diller: {
      css: { ad: "transition / @keyframes", sozdizimi: "transition: transform 200ms ease;\n@keyframes ad { from { ... } to { ... } }", aciklama: "transition bir özellik değiştiğinde yumuşak geçiş yapar; @keyframes kendi başına çalışan animasyondur. transform ve opacity'yi canlandır (hızlıdır). Hareket hassasiyeti olanlar için prefers-reduced-motion'a uy.",
        ornek: k`
<style>
  .btn { padding: 10px 18px; border: 0; border-radius: 10px; background: #111827; color: #fff; transition: transform 180ms ease, box-shadow 180ms ease; }
  .btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgb(0 0 0 / .25); }
  .nabiz { width: 14px; height: 14px; border-radius: 50%; background: #22c55e; animation: nabiz 1.2s infinite; }
  @keyframes nabiz { 50% { transform: scale(1.5); opacity: .4; } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
</style>
<button class="btn">Üzerime gel</button> <span class="nabiz" style="display:inline-block"></span>`, tur: "html" }
    }
  },
  {
    id: "kenar-golge", baslik: "Kenarlık, köşe yuvarlama ve gölge", kategori: "Görünüm (CSS)",
    niyet: ["kenarlık", "border", "köşeleri yuvarla", "yuvarlak köşe", "kenarları yuvarlak", "daire yap", "border-radius", "gölge", "box-shadow", "kart görünümü"],
    diller: {
      css: { ad: "border / border-radius / box-shadow", sozdizimi: "border: 1px solid #e5e7eb;\nborder-radius: 12px;\nbox-shadow: 0 4px 12px rgb(0 0 0 / .1);", aciklama: "border-radius: 50% kare bir öğeyi daireye çevirir.",
        ornek: k`
<div style="width: 220px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 14px; box-shadow: 0 10px 24px rgb(15 23 42 / .12); font: 15px system-ui">
  <div style="width: 48px; height: 48px; border-radius: 50%; background: #f59e0b; margin-bottom: 8px"></div>
  Kart bileşeni
</div>`, tur: "html" }
    }
  },

  /* ============================== DOM ============================== */
  {
    id: "oge-secme", baslik: "Sayfadaki bir öğeyi seçmek", kategori: "Sayfa etkileşimi (DOM)",
    niyet: ["öğe seç", "elementi bul", "queryselector", "getelementbyid", "dom", "butonu seç", "html elemanına eriş"],
    diller: {
      js: { ad: "querySelector() / querySelectorAll()", sozdizimi: "document.querySelector(\"css-seçici\")\ndocument.querySelectorAll(\".sinif\")", aciklama: "CSS seçicisiyle ilk eşleşen öğeyi (yoksa null) ya da hepsini verir. Metni değiştirmek için textContent (innerHTML'e kullanıcı verisi koyma).",
        ornek: k`
<h3 id="baslik">Eski başlık</h3>
<ul><li class="m">bir</li><li class="m">iki</li></ul>
<script>
  document.querySelector("#baslik").textContent = "Yeni başlık";
  document.querySelectorAll(".m").forEach((li, i) => (li.textContent += " ✓"));
</script>`, tur: "html" }
    }
  },
  {
    id: "olay-dinleme", baslik: "Tıklama ve diğer olayları dinlemek", kategori: "Sayfa etkileşimi (DOM)",
    niyet: ["tıklanınca", "butona tıklama", "olay", "event", "addeventlistener", "onclick", "klavye olayı", "input değişince"],
    diller: {
      js: { ad: "addEventListener()", sozdizimi: "oge.addEventListener(\"click\", (e) => { ... });", aciklama: "Bir olay olduğunda çalışacak fonksiyonu bağlar. Sık olaylar: click, input, submit, keydown.",
        ornek: k`
<button id="b">Tıkla</button> <span id="s">0</span>
<input id="i" placeholder="yaz..." /> <span id="c"></span>
<script>
  let n = 0;
  document.getElementById("b").addEventListener("click", () => (document.getElementById("s").textContent = ++n));
  document.getElementById("i").addEventListener("input", (e) => (document.getElementById("c").textContent = e.target.value.length + " karakter"));
</script>`, tur: "html" }
    }
  },
  {
    id: "oge-olusturma", baslik: "Sayfaya yeni öğe eklemek", kategori: "Sayfa etkileşimi (DOM)",
    niyet: ["öğe ekle", "element oluştur", "createelement", "append", "listeye madde ekle", "dinamik html"],
    diller: {
      js: { ad: "createElement() / append()", sozdizimi: "const li = document.createElement(\"li\");\nli.textContent = metin;\nliste.append(li);", aciklama: "Öğeyi oluştur, içeriğini textContent ile ver, bir ebeveyne ekle.",
        ornek: k`
<input id="g" placeholder="Yapılacak iş" /><button id="e">Ekle</button>
<ul id="l"></ul>
<script>
  document.getElementById("e").addEventListener("click", () => {
    const g = document.getElementById("g");
    if (!g.value.trim()) return;
    const li = document.createElement("li");
    li.textContent = g.value.trim();
    document.getElementById("l").append(li);
    g.value = "";
  });
</script>`, tur: "html" }
    }
  },

  /* ============================== SQL ============================== */
  {
    id: "veri-secme", baslik: "Veritabanından veri okumak (SELECT)", kategori: "Veritabanı (SQL)",
    niyet: ["veri çek", "select", "tablodan oku", "sorgu yaz", "sütun seç", "kayıtları listele"],
    diller: {
      sql: { ad: "SELECT … FROM … WHERE … ORDER BY … LIMIT", sozdizimi: "SELECT sütunlar FROM tablo WHERE koşul ORDER BY sütun LIMIT n;", aciklama: "Yalnızca gereken sütunları seç (SELECT * yerine). Yazım sırası: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.",
        ornek: k`
SELECT ad, puan FROM ogrenciler WHERE puan IS NOT NULL ORDER BY puan DESC LIMIT 3;` }
    }
  },
  {
    id: "tablo-birlestirme", baslik: "İki tabloyu birleştirmek (JOIN)", kategori: "Veritabanı (SQL)",
    niyet: ["iki tabloyu birleştir", "join", "inner join", "left join", "ilişkili tablo", "tabloları bağla"],
    diller: {
      sql: { ad: "JOIN", sozdizimi: "SELECT … FROM a JOIN b ON a.id = b.a_id;", aciklama: "INNER JOIN yalnızca iki tarafta eşleşeni, LEFT JOIN soldaki tüm satırları (eşleşme yoksa NULL'la) getirir.",
        ornek: k`
SELECT o.ad, k.ad AS kurs
FROM ogrenciler o
LEFT JOIN kayitlar r ON r.ogrenci_id = o.id
LEFT JOIN kurslar k ON k.id = r.kurs_id
ORDER BY o.ad;` }
    }
  },
  {
    id: "veri-ekleme", baslik: "Veri eklemek, güncellemek ve silmek", kategori: "Veritabanı (SQL)",
    niyet: ["veri ekle", "insert", "update", "delete", "kaydı güncelle", "satır sil", "tabloya ekle"],
    diller: {
      sql: { ad: "INSERT / UPDATE / DELETE", sozdizimi: "INSERT INTO t (a, b) VALUES (1, 2);\nUPDATE t SET a = 1 WHERE id = 3;\nDELETE FROM t WHERE id = 3;", aciklama: "UPDATE ve DELETE'te WHERE'ı unutursan TÜM satırlar etkilenir. Uygulamada değerleri her zaman parametre olarak ver (SQL enjeksiyonu).",
        ornek: k`
INSERT INTO ogrenciler (ad, sehir, puan) VALUES ('Zeynep', 'Rize', 88);
UPDATE ogrenciler SET puan = puan + 5 WHERE sehir = 'Ankara' AND puan IS NOT NULL;
DELETE FROM ogrenciler WHERE puan IS NULL;
SELECT ad, sehir, puan FROM ogrenciler ORDER BY id;` }
    }
  },
  {
    id: "tablo-olusturma", baslik: "Tablo oluşturmak", kategori: "Veritabanı (SQL)",
    niyet: ["tablo oluştur", "create table", "şema", "birincil anahtar", "primary key", "foreign key", "kısıt"],
    diller: {
      sql: { ad: "CREATE TABLE", sozdizimi: "CREATE TABLE ad (\n  id INTEGER PRIMARY KEY,\n  sütun TÜR NOT NULL UNIQUE CHECK (...),\n  diger_id INTEGER REFERENCES diger(id)\n);", aciklama: "Kısıtlar (NOT NULL, UNIQUE, CHECK, REFERENCES) bozuk verinin girmesini veritabanı düzeyinde engeller.",
        ornek: k`
CREATE TABLE urunler (
  id INTEGER PRIMARY KEY,
  ad TEXT NOT NULL UNIQUE,
  fiyat REAL NOT NULL CHECK (fiyat > 0)
);
INSERT INTO urunler (ad, fiyat) VALUES ('kalem', 12.5), ('defter', 45);
SELECT * FROM urunler;` }
    }
  },
  {
    id: "ilk-n", baslik: "İlk n kaydı almak / sayfalama", kategori: "Veritabanı (SQL)",
    niyet: ["ilk 10", "limit", "sayfalama", "pagination", "ilk n eleman", "top 3", "offset"],
    diller: {
      sql: { ad: "LIMIT / OFFSET", sozdizimi: "SELECT … ORDER BY … LIMIT n OFFSET atla;", aciklama: "LIMIT'i her zaman ORDER BY ile kullan; yoksa hangi satırların geleceği belirsizdir.", ornek: k`
SELECT ad, puan FROM ogrenciler ORDER BY puan DESC LIMIT 2 OFFSET 1;` },
      js: { ad: "slice()", sozdizimi: "dizi.slice(0, n)\ndizi.slice((sayfa - 1) * boyut, sayfa * boyut)", aciklama: "Dizinin bir bölümünü kopyalar.", ornek: k`
const d = [10, 20, 30, 40, 50];
console.log(d.slice(0, 3), d.slice(2, 4));` },
      py: { ad: "dilimleme / heapq.nlargest()", sozdizimi: "liste[:n]\nheapq.nlargest(n, liste)", aciklama: "Sıralı listede dilim; sırasız büyük veride en büyük n için heapq daha hızlıdır.", ornek: k`
import heapq
d = [40, 10, 50, 20, 30]
print(sorted(d)[:3], heapq.nlargest(2, d))` }
    }
  }
  ];

  /* ============================== TERİMLER SÖZLÜĞÜ ============================== */
  const TERIMLER = [
    ["algoritma", "algorithm", "Bir problemi çözmek için izlenen, sonlu ve kesin adımlar dizisi."],
    ["API", "application programming interface", "Bir yazılımın başka bir yazılıma sunduğu kullanım arayüzü: hangi fonksiyonlar ya da adresler, hangi girdiyle, ne döndürür."],
    ["argüman", "argument", "Bir fonksiyon çağrılırken ona verilen gerçek değer. kare(4) çağrısında 4 argümandır.", "fonksiyon"],
    ["asenkron", "asynchronous", "Bir işin bitmesini beklerken programın durmadan başka işlere devam etmesi. JavaScript'te Promise ve async/await.", "bekleme"],
    ["birim testi", "unit test", "Kodun küçük bir parçasının (çoğunlukla tek fonksiyonun) beklenen sonucu verdiğini otomatik denetleyen test. QUAGEN'deki görev testleri birim testleridir."],
    ["Big-O", "big O notation", "Bir algoritmanın, girdi büyüdükçe süresinin ya da belleğinin nasıl arttığını gösteren gösterim: O(1) sabit, O(n) doğrusal, O(n²) karesel."],
    ["boolean", "boolean", "Yalnızca iki değeri olan tür: doğru (true/True) ya da yanlış (false/False).", "kosul"],
    ["çöp toplayıcı", "garbage collector", "Artık erişilemeyen nesnelerin belleğini otomatik olarak geri alan mekanizma (JavaScript, Python).", "bellek-ayirma"],
    ["derleyici", "compiler", "Kaynak kodu çalıştırılmadan önce bütünüyle makine koduna çeviren program (C için clang, gcc)."],
    ["değişken", "variable", "Bir değere verilen ad. Değer değişebilir; ad aynı kalır.", "degisken"],
    ["dizi / liste", "array / list", "Sıralı eleman koleksiyonu; elemanlara 0'dan başlayan indeksle erişilir.", "dizi-uzunlugu"],
    ["döngü", "loop", "Bir kod bloğunun tekrar tekrar çalıştırılması (for, while).", "for-dongusu"],
    ["fonksiyon", "function", "Bir adı olan, girdi (parametre) alıp bir iş yapan ve sonuç döndürebilen kod bloğu.", "fonksiyon"],
    ["hata ayıklama", "debugging", "Programın beklenenden farklı davranmasının nedenini bulup düzeltme süreci."],
    ["indeks", "index", "Bir dizideki elemanın konum numarası; çoğu dilde ilk eleman 0'dır."],
    ["istisna", "exception", "Çalışma sırasında oluşan ve normal akışı kesen hata durumu; yakalanabilir (try).", "hata-yakalama"],
    ["işaretçi", "pointer", "Başka bir değişkenin bellek adresini tutan değişken (C).", "isaretci"],
    ["JSON", "JavaScript Object Notation", "Veriyi metin olarak taşımak için yaygın biçim: nesneler, diziler, metin, sayı, true/false, null.", "json"],
    ["kalıtım", "inheritance", "Bir sınıfın başka bir sınıfın özelliklerini ve davranışlarını devralması.", "kalitim"],
    ["kapanış", "closure", "Tanımlandığı ortamdaki değişkenleri hatırlayan fonksiyon; o ortam sona erse bile."],
    ["karmaşıklık", "complexity", "Bir algoritmanın zaman ya da bellek gereksinimi; genellikle Big-O ile ifade edilir."],
    ["kütüphane", "library", "Başkalarının yazdığı, kendi programında kullanabileceğin hazır kod topluluğu."],
    ["metot", "method", "Bir nesneye ya da sınıfa ait fonksiyon: metin.upper() gibi."],
    ["nesne", "object", "Veriyi (özellikler) ve o veriyle çalışan davranışı (metotlar) bir arada tutan yapı.", "sinif"],
    ["null / None", "null", "'Değer yok' anlamına gelen özel değer.", "bos-deger"],
    ["özyineleme", "recursion", "Bir fonksiyonun problemi küçültüp kendini yeniden çağırması.", "ozyineleme"],
    ["parametre", "parameter", "Fonksiyon tanımında, çağrıldığında alacağı değer için ayrılan ad. def kare(x) tanımında x parametredir.", "fonksiyon"],
    ["refaktör", "refactoring", "Kodun davranışını değiştirmeden yapısını iyileştirmek (okunurluk, tekrar azaltma)."],
    ["sınıf", "class", "Aynı türden nesneler için kalıp: hangi özelliklere ve metotlara sahip olacaklarını tanımlar.", "sinif"],
    ["söz dizimi", "syntax", "Bir dilin yazım kuralları; uyulmazsa kod hiç çalışmaz (SyntaxError)."],
    ["sözlük", "dictionary / map", "Anahtarla değere erişilen koleksiyon.", "anahtar-deger"],
    ["tanımsız davranış", "undefined behavior", "C'de standardın sonucunu tanımlamadığı durum (dizi dışına yazmak gibi); program çalışıyor görünse bile yanlıştır."],
    ["tür", "type", "Bir değerin çeşidi: tam sayı, ondalıklı sayı, metin, liste...", "tur-ogrenme"],
    ["yorumlayıcı", "interpreter", "Kodu satır satır okuyup doğrudan çalıştıran program (Python, tarayıcıdaki JavaScript motoru)."],
    ["yığın (stack)", "stack", "Son giren ilk çıkar (LIFO) veri yapısı; ayrıca fonksiyon çağrılarının tutulduğu bellek bölgesi."],
    ["kuyruk", "queue", "İlk giren ilk çıkar (FIFO) veri yapısı."],
    ["hash tablosu", "hash table", "Anahtarı bir hash fonksiyonuyla konuma çevirerek ortalama O(1) erişim sağlayan yapı; sözlüklerin temeli.", "anahtar-deger"],
    ["SQL enjeksiyonu", "SQL injection", "Kullanıcı girdisinin sorgu metnine doğrudan eklenmesiyle saldırganın kendi SQL'ini çalıştırması. Parametreli sorgularla önlenir.", "veri-ekleme"],
    ["DOM", "Document Object Model", "Tarayıcının HTML sayfasını JavaScript'ten erişilebilen bir nesne ağacı olarak temsil etmesi.", "oge-secme"],
    ["git", "git", "Kodun sürüm geçmişini tutan ve birlikte çalışmayı sağlayan sürüm kontrol sistemi."]
  ].map(([terim, ing, tanim, kavram]) => ({ id: terim.toLocaleLowerCase("tr").replace(/[çğıöşü]/g, (c) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[c]).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), terim, ing, tanim, kavram: kavram || null }));

  window.KD_REHBER = { DILLER, KATEGORILER, KAVRAMLAR, TERIMLER, SQL_DB };
})();
