/* QUAGEN — KAM'in C dersleri (Ders 1–10): sohbetle anlatım, yanda akan örnek
 * Adım biçimleri:
 *   ["k", metin]                       KAM yazar
 *   ["kod", kod]                       sahnedeki kod değişir (değişen satırlar belirir)
 *   ["v", [satırlar], metin]           satırları vurgula + KAM yazar
 *   ["calis", stdin?]                  sahnedeki kodu derle ve çalıştır, çıktıyı göster
 *   ["sen", "cevap 1", "cevap 2"…]    öğrencinin cevabı (hangisini seçerse seçsin devam eder)
 *   ["sor", soru, [seçenekler], doğru, doğruysa, yanlışsa]   küçük kontrol sorusu
 */
(function () {
  const k = (s, ...v) => String.raw(s, ...v).replace(/^\n/, "").replace(/\s+$/, "");
  window.KAM_DERSLER = Object.assign(window.KAM_DERSLER || {}, {
  c1: [
    ["k", "Hoş geldin. Bugün ilk C programını birlikte yazacağız. Hiçbir şey bilmediğini varsayıyorum, o yüzden acele yok."],
    ["k", "Bir C programı, bilgisayara sırayla verdiğin komutlardan oluşur. En küçük çalışan program şuna benzer, sağa bak:"],
    ["kod", k`
#include <stdio.h>

int main(void) {
    printf("Merhaba!\n");
    return 0;
}`],
    ["sen", "Çok satır var, hepsi ne?", "Tamam, devam"],
    ["v", [3, 6], "Sakin, tek tek gidelim. `main` programın başladığı yerdir. Süslü parantezlerin arası, programın yapacağı işlerdir."],
    ["v", [4], "`printf` ekrana yazı yazar. Tırnak içindeki metin aynen çıkar. Sondaki `\\n` “alt satıra geç” demek."],
    ["v", [1], "En üstteki satır, `printf`'i kullanabilmek için gereken kütüphaneyi ekler. Şimdilik “her programın başına yazılır” diye bil, yeter."],
    ["k", "Çalıştıralım, ne çıkacak görelim."],
    ["calis"],
    ["sor", "Peki `\\n`'i silseydim ne olurdu?", ["Program çalışmazdı", "Yazı çıkar ama alt satıra geçmezdi", "Hiçbir şey yazmazdı"], 1, "Aynen. `\\n` yalnızca satır atlatır; unutursan yazılar yan yana yapışır.", "Program yine çalışır. `\\n` yalnızca alt satıra geçirir; unutursan sonraki yazı aynı satırdan devam eder."],
    ["k", "Şimdi programa hafıza verelim. Bir değeri saklamak için **değişken** kullanırız. C'de her değişkenin bir türü vardır."],
    ["kod", k`
#include <stdio.h>

int main(void) {
    int yas = 19;
    double boy = 1.74;
    printf("Yas: %d\n", yas);
    printf("Boy: %.2f\n", boy);
    return 0;
}`],
    ["v", [4, 5], "`int` tam sayı, `double` ondalıklı sayı tutar. Türü bir kez yazarsın, sonra değişmez."],
    ["v", [6, 7], "`%d` “buraya bir tam sayı gelecek” diyen yer tutucudur; değeri virgülden sonra verirsin. `%.2f` ondalıklı sayıyı iki basamakla yazar."],
    ["calis"],
    ["sen", "Kullanıcıdan nasıl değer alırım?", "Devam"],
    ["kod", k`
#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Toplam: %d\n", a + b);
    return 0;
}`],
    ["v", [5], "`scanf` klavyeden okur. Dikkat: değişkenlerin başında `&` var. Bu “değeri şu değişkenin içine koy” demek. Yeni başlayan herkes bunu en az bir kez unutur."],
    ["k", "Girdi olarak `3 4` veriyorum:"],
    ["calis", "3 4\n"],
    ["k", "Bu dersin özü bu kadar: `printf` yazar, değişken saklar, `scanf` okur. Görevlerde bunların üçünü de kullanacaksın. Takılırsan sağ alttan bana yaz."]
  ],

  c2: [
    ["k", "Şimdiye kadar programın her satırı sırayla çalıştı. Gerçek programlar ise **karar verir**. Bugün `if` ile tanışıyoruz."],
    ["kod", k`
#include <stdio.h>

int main(void) {
    int puan = 72;
    if (puan >= 50) {
        printf("Gecti\n");
    } else {
        printf("Kaldi\n");
    }
    return 0;
}`],
    ["v", [5], "Parantezin içi bir sorudur: “puan 50 ya da daha büyük mü?” Cevap evetse süslü parantezin içi çalışır."],
    ["v", [7], "`else`, cevap hayırsa çalışacak kısımdır. İkisinden yalnızca biri çalışır."],
    ["calis"],
    ["sor", "`puan` 50 olsaydı ne yazardı?", ["Gecti", "Kaldi", "Hiçbir şey"], 0, "Evet. `>=` “büyük ya da eşit” demek; 50 de dahil.", "`>=` eşitliği de kapsar: 50 >= 50 doğrudur, “Gecti” yazar."],
    ["k", "İkiden fazla seçenek varsa `else if` ile zincir kurarız. Burada sıra çok önemli."],
    ["kod", k`
#include <stdio.h>

int main(void) {
    int puan = 85;
    if (puan >= 90) {
        printf("A\n");
    } else if (puan >= 80) {
        printf("B\n");
    } else if (puan >= 70) {
        printf("C\n");
    } else {
        printf("F\n");
    }
    return 0;
}`],
    ["v", [5, 7, 9], "C koşulları yukarıdan aşağı dener ve **ilk doğru olanda durur**. 85 için ilk koşul yanlış, ikincisi doğru: B yazar, gerisine bakmaz."],
    ["calis"],
    ["sen", "Sırayı ters yazsam ne olur?", "Anladım"],
    ["k", "Önce `puan >= 70` yazsaydın 95 alan da C alırdı; çünkü 95 >= 70 de doğru. Kural: en dar koşul en üstte."],
    ["k", "Bir de C'nin en ünlü tuzağını göstereyim. Aşağıdaki iki satıra iyi bak:"],
    ["kod", k`
#include <stdio.h>

int main(void) {
    int a = 0;
    if (a == 5) printf("esit\n");
    if (a = 5) printf("bu her zaman calisir\n");
    return 0;
}`],
    ["v", [5], "`==` karşılaştırır: “a, 5'e eşit mi?” a sıfır olduğu için hayır."],
    ["v", [6], "Tek `=` ise **atama yapar**: a'ya 5 koyar. C'de sıfır olmayan her şey “doğru” sayıldığı için bu satır hep çalışır. Derleyici burada seni uyarır; uyarıları okumaya alış."],
    ["calis"],
    ["k", "Koşulları birleştirmek için `&&` (ve), `||` (veya), `!` (değil) var. Görevlerde artık yıl kuralını bunlarla yazacaksın. Acele etme; kuralı önce Türkçe söyle, sonra koda çevir."]
  ],

  c3: [
    ["k", "Aynı işi 100 kez yapman gerekse 100 satır yazmazsın. Bugünün konusu **döngü**: bir işi tekrar ettirmek."],
    ["kod", k`
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    printf("\n");
    return 0;
}`],
    ["v", [4], "`for` satırında üç parça var. Sırayla: sayacı başlat (`i = 1`), “devam edeyim mi?” sorusu (`i <= 5`), her turun sonunda yapılacak iş (`i++`, yani i'yi bir artır)."],
    ["calis"],
    ["sor", "Koşulu `i < 5` yapsaydım kaç sayı yazardı?", ["5", "4", "6"], 1, "Doğru: 1, 2, 3, 4. Döngü hatalarının çoğu bu tek karakterden çıkar.", "`i < 5` olunca i 5 olduğunda durur: 1, 2, 3, 4 → dört sayı."],
    ["k", "Döngünün asıl gücü bir şeyi **biriktirmek**. 1'den 100'e kadar toplayalım:"],
    ["kod", k`
#include <stdio.h>

int main(void) {
    int toplam = 0;
    for (int i = 1; i <= 100; i++) {
        toplam += i;
    }
    printf("%d\n", toplam);
    return 0;
}`],
    ["v", [4], "Biriktireceğin değişkeni döngüden **önce** başlat. Toplama için 0, çarpma için 1."],
    ["v", [6], "`toplam += i`, “toplam'a i'yi ekle” demek. Her turda toplam biraz daha büyür."],
    ["calis"],
    ["sen", "Kaç tur döneceğini bilmiyorsam?", "Devam"],
    ["k", "O zaman `while` kullanırsın: koşul doğru olduğu sürece döner. Bir sayının kaç basamaklı olduğunu bulalım."],
    ["kod", k`
#include <stdio.h>

int main(void) {
    int n = 4096, basamak = 0;
    while (n > 0) {
        n = n / 10;
        basamak++;
    }
    printf("%d basamak\n", basamak);
    return 0;
}`],
    ["v", [6], "Tam sayıyı 10'a bölmek son basamağı atar: 4096 → 409 → 40 → 4 → 0. Her atışta sayacı artırıyoruz."],
    ["v", [5], "Önemli: döngünün içinde koşulu bir gün yanlış yapacak bir şey olmalı. Burada n küçülüyor. Olmasaydı program sonsuza kadar dönerdi."],
    ["calis"],
    ["k", "Son bir uyarı: `int` yaklaşık 2 milyara kadar tutar. Faktöriyel gibi hızlı büyüyen şeylerde taşar. Görevlerden biri tam bunu gösteriyor; çözüm `long` kullanmak."]
  ],

  c4: [
    ["k", "Programın büyüdükçe `main` uzar ve okunmaz olur. Çözüm: işi parçalara bölmek. Her parçaya **fonksiyon** diyoruz."],
    ["kod", k`
#include <stdio.h>

int kare(int x) {
    return x * x;
}

int main(void) {
    printf("%d\n", kare(7));
    printf("%d\n", kare(3) + kare(4));
    return 0;
}`],
    ["v", [3], "Soldan sağa oku: `int` döndürecek, adı `kare`, bir `int` alacak. Buna fonksiyonun imzası denir."],
    ["v", [4], "`return` sonucu çağırana geri verir. `printf` değil! Fonksiyon ekrana yazmaz, değeri **geri verir**."],
    ["v", [8, 9], "Çağırdığın yerde `kare(7)` ifadesinin yerine 49 gelir. Bu yüzden iki çağrıyı toplayabiliyorsun."],
    ["calis"],
    ["sor", "`return` ile `printf` arasındaki fark ne?", ["İkisi aynı şey", "return değeri geri verir, printf ekrana yazar", "return programı kapatır"], 1, "Tam olarak. Testler fonksiyonunun döndürdüğü değere bakar; ekrana yazman işe yaramaz.", "`printf` yalnızca ekrana yazar. `return` ise değeri çağıran koda geri verir; o değerle hesap yapılabilir."],
    ["k", "Bir önemli nokta daha: fonksiyona verdiğin değer **kopyalanır**."],
    ["kod", k`
#include <stdio.h>

void arttir(int x) {
    x = x + 1;
}

int main(void) {
    int sayi = 5;
    arttir(sayi);
    printf("%d\n", sayi);
    return 0;
}`],
    ["v", [3, 4], "`arttir` kendi kopyasını (x) değiştiriyor. `void` “hiçbir şey döndürmüyorum” demek."],
    ["calis"],
    ["k", "Gördün mü, hâlâ 5. Çağıranın değişkenine dokunamadık. Bunu Ders 7'de işaretçilerle çözeceğiz; şimdilik aklının bir köşesinde dursun."],
    ["sen", "Özyineleme ne demek?", "Devam"],
    ["k", "Bir fonksiyonun **kendini çağırması**. Büyük problemi aynı türden daha küçük bir probleme indirirsin."],
    ["kod", k`
#include <stdio.h>

int toplam(int n) {
    if (n == 0) return 0;
    return n + toplam(n - 1);
}

int main(void) {
    printf("%d\n", toplam(4));
    return 0;
}`],
    ["v", [5], "“4'e kadar toplam = 4 + (3'e kadar toplam)”. Fonksiyon aynı soruyu daha küçük bir sayı için kendine soruyor."],
    ["v", [4], "Bu satır **temel durum**: artık küçültemeyeceğin yer. Bunu unutursan fonksiyon durmadan kendini çağırır ve program çöker."],
    ["calis"],
    ["k", "Özyineleme ilk seferde kimseye oturmaz, bu normal. Görevlerde kâğıda küçük bir örnek yazıp çağrıları elle takip et; en hızlı öyle anlaşılıyor."]
  ],

  c5: [
    ["k", "30 öğrencinin notunu saklaman gerekse 30 ayrı değişken açmazsın. Aynı türden birçok değeri yan yana tutan yapıya **dizi** denir."],
    ["kod", k`
#include <stdio.h>

int main(void) {
    int notlar[4] = {70, 85, 92, 60};
    printf("%d\n", notlar[0]);
    printf("%d\n", notlar[3]);
    return 0;
}`],
    ["v", [4], "Köşeli parantezdeki 4, dizinin kaç eleman tutacağı. Değerleri süslü parantezle veriyoruz."],
    ["v", [5, 6], "Elemanlara sıra numarasıyla (indeks) ulaşırsın. Dikkat: saymaya **0'dan** başlıyoruz. İlk eleman `notlar[0]`, son eleman `notlar[3]`."],
    ["calis"],
    ["sor", "4 elemanlı dizide `notlar[4]` ne olur?", ["Son elemanı verir", "Dizinin dışıdır, hata", "0 verir"], 1, "Evet. Geçerli indeksler 0, 1, 2, 3. C bunu senin için kontrol etmez; o yüzden bu hata çok yaygın.", "Geçerli indeksler 0'dan 3'e. `notlar[4]` dizinin dışı; C bunu engellemez, program rastgele bir bellek okur."],
    ["k", "Diziler döngüyle birlikte anlam kazanır. Hepsini gezip ortalama alalım:"],
    ["kod", k`
#include <stdio.h>

int main(void) {
    int notlar[4] = {70, 85, 92, 60};
    int toplam = 0;
    for (int i = 0; i < 4; i++) {
        toplam += notlar[i];
    }
    printf("Ortalama: %.1f\n", toplam / 4.0);
    return 0;
}`],
    ["v", [6], "Kalıbı ezberle: `i = 0`'dan başla, `i < eleman_sayısı` olduğu sürece dön. `<=` yazarsan bir fazla okur ve dizinin dışına çıkarsın."],
    ["v", [9], "`4.0` yazdım çünkü iki tam sayıyı bölersen C küsuratı atar. Biri ondalıklı olursa sonuç da ondalıklı olur."],
    ["calis"],
    ["sen", "Diziyi fonksiyona nasıl veririm?", "Devam"],
    ["kod", k`
#include <stdio.h>

int en_buyuk(const int *d, int n) {
    int en = d[0];
    for (int i = 1; i < n; i++) {
        if (d[i] > en) en = d[i];
    }
    return en;
}

int main(void) {
    int notlar[] = {70, 85, 92, 60};
    printf("%d\n", en_buyuk(notlar, 4));
    return 0;
}`],
    ["v", [3], "Fonksiyon dizinin kaç elemanlı olduğunu **bilemez**; o yüzden boyutu (`n`) ayrıca veririz. `const int *d` şimdilik “değiştirmeyeceğim bir dizi” diye oku."],
    ["v", [4], "En büyüğü ararken başlangıç değerini 0 değil, **ilk eleman** yap. Bütün sayılar negatifse 0 yanlış cevap olurdu."],
    ["calis"],
    ["k", "Görevlerden biri tam bu iki hatayı içeriyor: sınırın dışına çıkmak ve yanlış başlangıç değeri. Program çökerse derleyicinin hangi satırı gösterdiğine bak."]
  ],

  c6: [
    ["k", "C'de “metin” diye ayrı bir tür yok. Metin, karakterlerden oluşan bir **dizidir** ve sonunda özel bir işaret vardır."],
    ["kod", k`
#include <stdio.h>

int main(void) {
    char ad[] = "Ada";
    printf("%s\n", ad);
    printf("%c %c %c\n", ad[0], ad[1], ad[2]);
    printf("%d\n", ad[3]);
    return 0;
}`],
    ["v", [4], "`\"Ada\"` üç harf ama dizi **dört** eleman tutuyor: A, d, a ve sonda görünmez bir `'\\0'`. Bu sıfır, “metin burada bitti” demek."],
    ["v", [5, 6], "`%s` metnin tamamını, `%c` tek bir karakteri yazar."],
    ["v", [7], "Dördüncü elemanı sayı olarak yazdırıyorum; 0 göreceksin. İşte o son işareti."],
    ["calis"],
    ["k", "Bu yüzden C'de metnin uzunluğunu kimse bilmez; sıfırı görene kadar sayarsın."],
    ["sen", "Peki uzunluğu nasıl bulurum?", "Devam"],
    ["kod", k`
#include <stdio.h>

int main(void) {
    char ad[] = "Kodlama";
    int uzunluk = 0;
    while (ad[uzunluk] != '\0') {
        uzunluk++;
    }
    printf("%d\n", uzunluk);
    return 0;
}`],
    ["v", [6], "“Sonu görene kadar ilerle.” C'deki bütün metin fonksiyonları bu döngünün bir çeşididir."],
    ["calis"],
    ["sor", "5 harfli bir metni saklamak için dizi en az kaç eleman olmalı?", ["5", "6", "4"], 1, "Doğru: 5 harf + sondaki `'\\0'`. Bu “+1”i unutmak C'nin en klasik hatasıdır.", "5 harfin yanına sondaki `'\\0'` için bir yer daha gerekir: 6."],
    ["k", "Bir şey daha: karakterler aslında **sayıdır**. Bu, harflerle hesap yapabilmeni sağlar."],
    ["kod", k`
#include <stdio.h>

int main(void) {
    char s[] = "merhaba";
    for (int i = 0; s[i] != '\0'; i++) {
        if (s[i] >= 'a' && s[i] <= 'z') {
            s[i] = s[i] - 'a' + 'A';
        }
    }
    printf("%s\n", s);
    return 0;
}`],
    ["v", [6], "Harfler sıralı sayılar olduğu için “küçük harf mi?” sorusu bir aralık kontrolüdür."],
    ["v", [7], "`s[i] - 'a'` harfin alfabedeki sırasını verir; `'A'` eklersen büyük harfine ulaşırsın."],
    ["calis"],
    ["k", "Görevlerde kendi `strlen`'ini yazacak ve bir metni yerinde değiştireceksin. Tek tırnak (`'a'`) bir karakter, çift tırnak (`\"a\"`) bir metindir; karıştırma."]
  ],

  c7: [
    ["k", "Bugün C'nin en çok korkulan konusu: **işaretçiler**. Baştan söyleyeyim, fikir basit; kafa karıştıran kısım yazımı. Yavaş gideceğiz."],
    ["k", "Her değişken bellekte bir yerde durur ve o yerin bir **adresi** vardır. Ev ile evin adresi gibi düşün."],
    ["kod", k`
#include <stdio.h>

int main(void) {
    int x = 42;
    int *p = &x;
    printf("%d\n", x);
    printf("%d\n", *p);
    return 0;
}`],
    ["v", [5], "`&x`, x'in adresidir. `int *p`, “bir int'in adresini tutan değişken” demek. Yani p, x'in nerede durduğunu biliyor."],
    ["v", [7], "`*p`, “p'nin gösterdiği yerdeki değer”. Adrese gidip içeri bakmak gibi. İkisi de 42 yazacak."],
    ["calis"],
    ["sen", "Neden buna ihtiyacım olsun?", "Devam"],
    ["k", "Ders 4'ü hatırla: fonksiyona verdiğimiz değer kopyalanıyordu ve asıl değişkeni değiştiremiyorduk. Adresini verirsek değiştirebiliriz."],
    ["kod", k`
#include <stdio.h>

void arttir(int *p) {
    *p = *p + 1;
}

int main(void) {
    int sayi = 5;
    arttir(&sayi);
    printf("%d\n", sayi);
    return 0;
}`],
    ["v", [9], "Değeri değil **adresi** gönderiyoruz. `scanf`'teki `&` de tam olarak buydu."],
    ["v", [4], "Fonksiyon o adrese gidip oradaki değeri değiştiriyor. Artık kopyayla değil, asıl değişkenle çalışıyor."],
    ["calis"],
    ["sor", "`arttir` içinde `p = p + 1;` yazsaydım ne olurdu?", ["sayi 6 olurdu", "sayi değişmezdi", "Derlenmezdi"], 1, "Evet. Yıldız olmadan yalnızca p'nin kendisini (adresi) değiştirirsin; gösterdiği değere dokunmazsın.", "Yıldız yoksa p'nin tuttuğu adres değişir, o adresteki değer değil. `sayi` 5 kalır."],
    ["k", "Son olarak: hiçbir yeri göstermeyen işaretçiye `NULL` denir. Onu kullanmaya çalışırsan program çöker."],
    ["kod", k`
#include <stdio.h>

int *bul(int *d, int n, int hedef) {
    for (int i = 0; i < n; i++) {
        if (d[i] == hedef) return &d[i];
    }
    return NULL;
}

int main(void) {
    int d[] = {4, 8, 15};
    int *p = bul(d, 3, 8);
    if (p != NULL) printf("bulundu: %d\n", *p);
    if (bul(d, 3, 99) == NULL) printf("99 yok\n");
    return 0;
}`],
    ["v", [7], "Aranan şey yoksa `NULL` döndürmek C'de yaygın bir anlaşmadır: “gösterecek bir şey bulamadım”."],
    ["v", [13], "Bu yüzden işaretçiyi kullanmadan önce her zaman `NULL` mı diye bak."],
    ["calis"],
    ["k", "Özet: `&` adres verir, `*` adresteki değere ulaşır. İlk görevde ikisini karıştırırsan üzülme; herkes karıştırır. Önemli olan hatayı okuyup düzeltebilmen."]
  ],

  c8: [
    ["k", "Bir öğrencinin adı, yaşı ve ortalaması var. Bunları üç ayrı değişkende tutmak dağınık olur. **struct**, ilgili bilgileri tek bir pakette toplar."],
    ["kod", k`
#include <stdio.h>

typedef struct {
    char ad[32];
    int yas;
    double ortalama;
} Ogrenci;

int main(void) {
    Ogrenci o = {"Ece", 20, 3.45};
    printf("%s, %d yasinda, ort %.2f\n", o.ad, o.yas, o.ortalama);
    return 0;
}`],
    ["v", [3, 7], "Kendi türümüzü tanımlıyoruz: adı `Ogrenci`, içinde üç alan var. Artık `int` gibi kullanabileceğimiz yeni bir türümüz oldu."],
    ["v", [10, 11], "Bir öğrenci oluşturup alanlarına **nokta** ile ulaşıyoruz: `o.ad`, `o.yas`."],
    ["calis"],
    ["k", "Struct'lar da fonksiyona verilirken kopyalanır. Değiştirmek istiyorsan yine adres vereceksin; yalnız yazımı biraz farklı."],
    ["kod", k`
#include <stdio.h>

typedef struct {
    char ad[32];
    int yas;
} Ogrenci;

void dogum_gunu(Ogrenci *o) {
    o->yas = o->yas + 1;
}

int main(void) {
    Ogrenci e = {"Ece", 20};
    dogum_gunu(&e);
    printf("%s artik %d yasinda\n", e.ad, e.yas);
    return 0;
}`],
    ["v", [9], "Elinde struct'ın kendisi varsa nokta (`e.yas`), **adresi** varsa ok (`o->yas`) kullanırsın. Ok, “adrese git, alanı al” demenin kısa yolu."],
    ["calis"],
    ["sor", "Elimde `Ogrenci *p` varsa yaşına nasıl ulaşırım?", ["p.yas", "p->yas", "*p.yas"], 1, "Doğru. İşaretçi varsa ok.", "İşaretçiyle ok kullanılır: `p->yas`. Nokta, struct'ın kendisi elindeyken kullanılır."],
    ["k", "Struct'ların dizisini de yapabilirsin; gerçek programların çoğu aslında budur: bir kayıt listesi."],
    ["kod", k`
#include <stdio.h>

typedef struct {
    const char *ad;
    int puan;
} Oyuncu;

int main(void) {
    Oyuncu takim[] = {{"Ali", 12}, {"Ece", 30}, {"Can", 21}};
    int en = 0;
    for (int i = 1; i < 3; i++) {
        if (takim[i].puan > takim[en].puan) en = i;
    }
    printf("En iyi: %s (%d)\n", takim[en].ad, takim[en].puan);
    return 0;
}`],
    ["v", [12], "`takim[i]` bir oyuncu, `.puan` onun alanı. Burada en yüksek puanlının **indeksini** tutuyoruz; böylece sonra adına da ulaşabiliyoruz."],
    ["calis"],
    ["k", "Görevlerde bir metni struct'ın içine güvenli kopyalaman gerekecek. İpucu: `snprintf(hedef, sizeof hedef, \"%s\", kaynak)` taşmayı kendisi engeller."]
  ],

  c9: [
    ["k", "Şimdiye kadar dizilerin boyutunu programı yazarken biliyorduk. Peki boyutu ancak program çalışırken öğreniyorsak? O zaman belleği **kendimiz isteriz**."],
    ["kod", k`
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    int *d = malloc(n * sizeof(int));
    if (d == NULL) return 1;
    for (int i = 0; i < n; i++) d[i] = i * i;
    printf("%d %d %d\n", d[0], d[2], d[4]);
    free(d);
    return 0;
}`],
    ["v", [6], "`malloc` “bana şu kadar bayt ver” der ve o belleğin adresini döndürür. `n * sizeof(int)`, n tane int'e yetecek kadar yer demek."],
    ["v", [7], "Bellek kalmadıysa `malloc` `NULL` döndürür. Her zaman kontrol et."],
    ["v", [8, 9], "Sonrası normal dizi gibi: `d[i]`."],
    ["v", [10], "Ve en önemlisi: işin bitince `free` ile geri ver. C bunu senin yerine yapmaz."],
    ["calis"],
    ["sen", "free etmezsem ne olur?", "Devam"],
    ["k", "Program o belleği tutmaya devam eder. Buna **bellek sızıntısı** denir. Küçük programda fark etmezsin; günlerce çalışan bir sunucuda bellek dolar ve program çöker. QUAGEN'deki testler sızıntıyı da ölçüyor."],
    ["k", "İki klasik hata daha var; ikisini de bilerek yapacağım ki nasıl göründüğünü gör."],
    ["kod", k`
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    const char *ad = "QUAGEN";
    char *kopya = malloc(strlen(ad) + 1);
    if (kopya == NULL) return 1;
    strcpy(kopya, ad);
    printf("%s\n", kopya);
    free(kopya);
    kopya = NULL;
    return 0;
}`],
    ["v", [7], "Birinci tuzak: metin kopyalarken `+ 1`. Sondaki `'\\0'` için de yer lazım. Unutursan ayrılan belleğin dışına yazarsın."],
    ["v", [11, 12], "İkinci tuzak: `free`'den sonra o adres artık senin değil. Kullanmaya devam edersen sonuç belirsizdir. İşaretçiyi `NULL` yapmak bu hatayı görünür kılar."],
    ["calis"],
    ["sor", "Aynı belleği iki kez `free` edersem?", ["Sorun olmaz", "Program çöker ya da belleği bozar", "İkincisi yok sayılır"], 1, "Evet, buna çift free denir ve ciddi bir hatadır.", "İkinci `free` belleğin iç düzenini bozar; program çökebilir. Her `malloc` için tam bir `free`."],
    ["k", "Aklında tutman gereken tek cümle: **her `malloc`'un tam bir `free`'si olur.** Görevlerde derleyici bellek hatalarını satır numarasıyla gösterecek; mesajı okumadan kodu değiştirme."]
  ],

  c10: [
    ["k", "Son ders bir mini proje: öğrendiğin her şeyi (struct, işaretçi, malloc) birleştirip **bağlı liste** kuracağız."],
    ["k", "Dizinin bir sorunu var: boyutu sabit ve araya eleman eklemek zor. Bağlı listede her eleman, bir sonrakinin **adresini** tutar. Vagonları birbirine bağlı bir tren gibi."],
    ["kod", k`
#include <stdio.h>

typedef struct Dugum {
    int deger;
    struct Dugum *sonraki;
} Dugum;

int main(void) {
    Dugum c = {30, NULL};
    Dugum b = {20, &c};
    Dugum a = {10, &b};
    printf("%d %d %d\n", a.deger, a.sonraki->deger, a.sonraki->sonraki->deger);
    return 0;
}`],
    ["v", [3, 6], "Her düğümde iki şey var: bir değer ve **sonraki düğümün adresi**."],
    ["v", [9, 11], "a → b → c diye bağladık. Son düğümün `sonraki`'si `NULL`: “benden sonra kimse yok”."],
    ["calis"],
    ["k", "Listeyi gezmek için tek bir kalıp var; bunu bir kez anlarsan gerisi kolay."],
    ["sen", "Göster", "Peki listeyi nasıl gezerim?"],
    ["kod", k`
#include <stdio.h>

typedef struct Dugum {
    int deger;
    struct Dugum *sonraki;
} Dugum;

int main(void) {
    Dugum c = {30, NULL}, b = {20, &c}, a = {10, &b};
    int toplam = 0;
    for (Dugum *d = &a; d != NULL; d = d->sonraki) {
        toplam += d->deger;
    }
    printf("%d\n", toplam);
    return 0;
}`],
    ["v", [11], "Baştan başla (`d = &a`), `NULL` olana kadar devam et, her adımda bir sonrakine geç (`d = d->sonraki`). Dizideki `i++`'nın karşılığı bu."],
    ["calis"],
    ["sen", "Düğümleri çalışırken nasıl eklerim?", "Devam"],
    ["kod", k`
#include <stdio.h>
#include <stdlib.h>

typedef struct Dugum {
    int deger;
    struct Dugum *sonraki;
} Dugum;

int main(void) {
    Dugum *bas = NULL;
    for (int i = 1; i <= 3; i++) {
        Dugum *yeni = malloc(sizeof *yeni);
        if (yeni == NULL) return 1;
        yeni->deger = i * 10;
        yeni->sonraki = bas;
        bas = yeni;
    }
    for (Dugum *d = bas; d != NULL; d = d->sonraki) printf("%d ", d->deger);
    printf("\n");
    while (bas != NULL) {
        Dugum *sonraki = bas->sonraki;
        free(bas);
        bas = sonraki;
    }
    return 0;
}`],
    ["v", [12, 16], "Yeni düğüm için `malloc`, değerini yaz, eski başı arkasına bağla, artık baş o. Başa eklemek dört satır."],
    ["v", [20, 24], "Silerken sıraya dikkat: düğümü `free` etmeden **önce** bir sonrakini sakla. Yoksa serbest bıraktığın bellekten adres okumuş olursun."],
    ["calis"],
    ["sor", "Çıktı neden 30 20 10 sırasında?", ["Liste sıralandı", "Her yeni düğüm başa eklendi", "Bir hata var"], 1, "Evet. Başa ekleyince son eklenen en önde olur.", "Sıralama yok; her yeni düğüm listenin başına geçtiği için son eklenen ilk sırada."],
    ["k", "Buraya kadar geldiysen C'nin temelini gerçekten biliyorsun. Görevlerde başa ekleme, silme ve listeyi ters çevirme var. Ters çevirme zor gelirse kâğıda üç kutu çizip okları elle çevir; çoğu kişi öyle çözüyor."]
  ]
  });
})();
