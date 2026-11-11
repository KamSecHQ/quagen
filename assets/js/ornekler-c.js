/* QUAGEN — görev başına benzer çözümlü örnek: C temelleri (Faz 1–10) ve İleri C (Faz 11–20)
 * Her örnek kendi main'i olan, derlenip çalışan tam bir programdır.
 */
(function () {
  const k = (s, ...v) => String.raw(s, ...v).replace(/^\n/, "").replace(/\s+$/, "");
  window.KD_ORNEKLER = Object.assign(window.KD_ORNEKLER || {}, {
  /* ---------- C Faz 1–10 ---------- */
  c1c1: { t: "İki satırlık kartvizit", c: k`
#include <stdio.h>

int main(void) {
    printf("Ada Lovelace\n");
    printf("Programci\n");
    return 0;
}`, n: "Her printf bir metin yazar; satır sonu için \\n şart. Metin tırnak içinde, satır noktalı virgülle biter." },
  c1c2: { t: "Fark ve bölüm", stdin: "17 5\n", c: k`
#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Fark: %d\n", a - b);
    printf("Bolum: %d\n", a / b);
    return 0;
}`, n: "scanf'e değişkenin adresi (&a) verilir. %d yer tutucusu, virgülden sonraki değerle sırayla doldurulur." },
  c1c3: { t: "Kilometreyi mile çevir", stdin: "42.5\n", c: k`
#include <stdio.h>

int main(void) {
    double km;
    scanf("%lf", &km);
    printf("%.2f mil\n", km * 0.621371);
    return 0;
}`, n: "Ondalıklı sayı double'dır: scanf'te %lf ile okunur, printf'te %.1f (bir basamak) ya da %.2f ile yazılır." },
  c2c1: { t: "İşaret fonksiyonu", c: k`
#include <stdio.h>

int isaret(int x) {
    if (x > 0) return 1;
    if (x < 0) return -1;
    return 0;
}

int main(void) {
    printf("%d %d %d\n", isaret(42), isaret(-7), isaret(0));
    return 0;
}`, n: "Her durumu ayrı bir if ile ele al ve değeri return et. Negatif sayının mutlak değeri -x'tir." },
  c2c2: { t: "Vücut ısısı değerlendirme", c: k`
#include <stdio.h>

char ates_durumu(double derece) {
    if (derece >= 39.0) return 'Y';   /* yüksek */
    if (derece >= 37.5) return 'H';   /* hafif */
    return 'N';                        /* normal */
}

int main(void) {
    printf("%c %c %c\n", ates_durumu(39.4), ates_durumu(37.8), ates_durumu(36.6));
    return 0;
}`, n: "char tek tırnakla yazılır: 'A'. Eşikleri büyükten küçüğe sırala; ilk tutan döner." },
  c2c3: { t: "Yanlış 'hafta sonu indirimi'", c: k`
#include <stdio.h>
#include <stdbool.h>

/* Kurallar: VIP her zaman indirim alır; hafta sonu herkes alır; ama bayram günü kimse (VIP hariç) alamaz.
   Hatalı sürüm: return hafta_sonu || vip && !bayram;   → bayramda hafta sonu indirimi veriyordu. */
bool indirim_var(bool vip, bool hafta_sonu, bool bayram) {
    if (vip) return true;          /* en güçlü kural önce */
    if (bayram) return false;
    return hafta_sonu;
}

int main(void) {
    printf("%d %d %d\n", indirim_var(false, true, true), indirim_var(true, false, true), indirim_var(false, true, false));
    return 0;
}`, n: "Birbirini geçersiz kılan kurallarda en özel/en güçlü kuralı önce kontrol et ve erken return yap. Sıra yanlışsa genel kural özel olanı yutar." },
  c3c1: { t: "Büyük toplam: int yetmeyince", c: k`
#include <stdio.h>

long kareler_toplami(int n) {
    long toplam = 0;                  /* int olsaydı büyük n'de taşardı */
    for (int i = 1; i <= n; i++) toplam += (long)i * i;
    return toplam;
}

int main(void) {
    printf("%ld\n", kareler_toplami(100000));
    return 0;
}`, n: "Sonuç 2 milyarı aşabiliyorsa biriktiren değişken ve dönüş türü long olmalı; çarpmadan önce (long) ile genişlet." },
  c3c2: { t: "Basamak sayısı", c: k`
#include <stdio.h>

int basamak_sayisi(int n) {
    if (n < 0) n = -n;
    int adet = 1;
    while (n >= 10) {
        n /= 10;          /* son basamağı at */
        adet++;
    }
    return adet;
}

int main(void) {
    printf("%d %d %d\n", basamak_sayisi(7), basamak_sayisi(-4096), basamak_sayisi(0));
    return 0;
}`, n: "n % 10 son basamağı verir, n / 10 onu atar. Döngüde ikisini birlikte kullanarak basamakları tek tek işlersin." },
  c3c3: { t: "Tam kare mi? (kareköke kadar)", c: k`
#include <stdio.h>
#include <stdbool.h>

bool tam_kare_mi(int n) {
    if (n < 0) return false;
    for (long i = 0; i * i <= n; i++) {     /* i*i taşmasın diye long */
        if (i * i == n) return true;
    }
    return false;
}

int main(void) {
    printf("%d %d %d\n", tam_kare_mi(49), tam_kare_mi(50), tam_kare_mi(2147395600));
    return 0;
}`, n: "Döngüyü i * i <= n koşuluyla kurarsan en fazla √n adım atar. i * i'nin int sınırını aşmaması için i'yi long tanımla." },
  c4c1: { t: "EKOK (EBOB'u kullanarak)", c: k`
#include <stdio.h>

int ebob_dongu(int a, int b) {
    while (b != 0) { int t = a % b; a = b; b = t; }
    return a;
}

long ekok(int a, int b) { return (long)a / ebob_dongu(a, b) * b; }

int main(void) {
    printf("%ld\n", ekok(12, 18));
    return 0;
}`, n: "Buradaki EBOB döngüyle yazıldı. Görevde aynı kuralı özyinelemeyle yaz: temel durum b == 0, aksi halde (b, a % b) ile kendini çağır." },
  c4c2: { t: "Hızlı çarpma (yarıya bölerek)", c: k`
#include <stdio.h>

/* a * b'yi yalnızca toplama ve yarıya bölme ile hesaplar: O(log b) çağrı */
long carp(long a, int b) {
    if (b == 0) return 0;
    long yari = carp(a, b / 2);
    if (b % 2 == 0) return yari + yari;
    return yari + yari + a;
}

int main(void) {
    printf("%ld\n", carp(123456, 1000));
    return 0;
}`, n: "Problemi yarıya böl, yarının sonucunu BİR KEZ hesaplayıp iki kez kullan. Üs almada toplama yerine çarpma gelir." },
  c4c3: { t: "Bitmeyen geri sayım", c: k`
#include <stdio.h>

/* Hatalı sürüm temel durumu n == 0 diye yazmıştı: negatif girdide hiç durmuyordu (yığın taşması). */
int geri_say(int n) {
    if (n <= 0) return 0;             /* temel durum: her girdide ulaşılır */
    return 1 + geri_say(n - 2);       /* her çağrı temel duruma yaklaşır */
}

int main(void) {
    printf("%d %d\n", geri_say(10), geri_say(7));
    return 0;
}`, n: "stack-overflow raporu, özyinelemenin durmadığını söyler. İki soru sor: temel durum var mı ve her çağrı ona gerçekten yaklaşıyor mu?" },
  c5c1: { t: "Dizinin ortalaması", c: k`
#include <stdio.h>

double ortalama(const int *d, int n) {
    if (n == 0) return 0;
    long toplam = 0;
    for (int i = 0; i < n; i++) toplam += d[i];
    return (double)toplam / n;
}

int main(void) {
    int notlar[] = {70, 85, 92};
    printf("%.2f\n", ortalama(notlar, 3));
    return 0;
}`, n: "Fonksiyon dizinin boyutunu bilemez; n ayrıca verilir. Geçerli indeksler 0 ile n − 1 arasıdır: i < n." },
  c5c2: { t: "Diziyi sola kaydır", c: k`
#include <stdio.h>

void sola_kaydir(int *d, int n) {
    if (n < 2) return;
    int ilk = d[0];
    for (int i = 0; i < n - 1; i++) d[i] = d[i + 1];
    d[n - 1] = ilk;
}

int main(void) {
    int d[] = {1, 2, 3, 4};
    sola_kaydir(d, 4);
    printf("%d %d %d %d\n", d[0], d[1], d[2], d[3]);
    return 0;
}`, n: "Yerinde değişiklikte kaybolacak değeri önce bir değişkende sakla. Ters çevirmede baştan (i) ve sondan (n − 1 − i) elemanları takas edersin." },
  c5c3: { t: "İki hatalı 'en küçük'", c: k`
#include <stdio.h>

/* Hatalı sürüm: int en = 0;  for (i = 0; i <= n; i++)
   1) i <= n dizinin dışını okur (sanitizer: buffer-overflow)
   2) en = 0 ile başlamak, tüm elemanlar pozitifken 0 döndürür */
int en_kucuk(const int *d, int n) {
    int en = d[0];                          /* ilk elemanla başla */
    for (int i = 1; i < n; i++) {           /* i < n */
        if (d[i] < en) en = d[i];
    }
    return en;
}

int main(void) {
    int d[] = {8, 3, 5};
    printf("%d\n", en_kucuk(d, 3));
    return 0;
}`, n: "Sanitizer'ın gösterdiği satırdaki indekse bak: sınır koşulu < mi <= mi? Başlangıç değerini sabit bir sayı yerine ilk elemandan al." },
  c6c1: { t: "Bir karakteri say", c: k`
#include <stdio.h>

int karakter_say(const char *s, char aranan) {
    int adet = 0;
    for (int i = 0; s[i] != '\0'; i++) {
        if (s[i] == aranan) adet++;
    }
    return adet;
}

int main(void) {
    printf("%d\n", karakter_say("programlama", 'a'));
    return 0;
}`, n: "C metinleri '\\0' ile biter. Uzunluğu bilmeden dolaşmak için koşul: s[i] != '\\0'." },
  c6c2: { t: "Boşlukları alt çizgi yap", c: k`
#include <stdio.h>

void bosluk_degistir(char *s) {
    for (; *s != '\0'; s++) {
        if (*s == ' ') *s = '_';
    }
}

int main(void) {
    char ad[] = "ilk c programim";     /* dizi: değiştirilebilir */
    bosluk_degistir(ad);
    printf("%s\n", ad);
    return 0;
}`, n: "Karakterler sayıdır: 'a' <= c && c <= 'z' aralığını sınayabilir, c - 'a' + 'A' ile büyük harfe çevirebilirsin." },
  c6c3: { t: "İki metin aynı mı?", c: k`
#include <stdio.h>
#include <stdbool.h>

bool ayni_mi(const char *a, const char *b) {
    int i = 0;
    while (a[i] != '\0' && b[i] != '\0') {
        if (a[i] != b[i]) return false;
        i++;
    }
    return a[i] == b[i];               /* ikisi de aynı anda bitmeli */
}

int main(void) {
    printf("%d %d\n", ayni_mi("kod", "kod"), ayni_mi("kod", "kodla"));
    return 0;
}`, n: "Karakterleri çift çift karşılaştır, ilk farkta false dön. Palindromda çiftler baştan (i) ve sondan (j) gelir; i < j oldukça sürer." },
  c7c1: { t: "İkiye katla (çağıranın değişkeni)", c: k`
#include <stdio.h>

void ikiye_katla(int *x) {
    *x = *x * 2;              /* adresteki DEĞERİ değiştir */
}

int main(void) {
    int puan = 21;
    ikiye_katla(&puan);
    printf("%d\n", puan);
    return 0;
}`, n: "Parametre kopyadır; çağıranın değişkenini değiştirmek için adresini (&x) verir, fonksiyonda *p ile değere ulaşırsın. p = ... yalnızca yerel kopyayı değiştirir." },
  c7c2: { t: "Bölüm ve kalan (çıktı parametreleri)", c: k`
#include <stdio.h>

void bol(int a, int b, int *bolum, int *kalan) {
    *bolum = a / b;
    *kalan = a % b;
}

int main(void) {
    int q, r;
    bol(17, 5, &q, &r);
    printf("%d kalan %d\n", q, r);
    return 0;
}`, n: "C'de fonksiyon tek değer döndürür; birden fazla sonuç için çağıran adres verir, fonksiyon *adres = değer ile oraya yazar." },
  c7c3: { t: "İlk negatif elemanın adresi", c: k`
#include <stdio.h>

int *ilk_negatif(int *d, int n) {
    for (int i = 0; i < n; i++) {
        if (d[i] < 0) return &d[i];     /* elemanın adresi */
    }
    return NULL;                          /* bulunamadı */
}

int main(void) {
    int d[] = {4, -2, 7};
    int *p = ilk_negatif(d, 3);
    if (p != NULL) *p = 0;               /* dönen işaretçiyle elemanı değiştir */
    printf("%d %d %d\n", d[0], d[1], d[2]);
    return 0;
}`, n: "&d[i] elemanın adresidir. 'Yok' durumunu NULL ile bildir; çağıran, işaretçiyi kullanmadan önce NULL mı diye bakar." },
  c8c1: { t: "Kitap oluştur (güvenli kopya)", c: k`
#include <stdio.h>

typedef struct {
    char baslik[16];
    int sayfa;
} Kitap;

Kitap kitap_olustur(const char *baslik, int sayfa) {
    Kitap k;
    snprintf(k.baslik, sizeof k.baslik, "%s", baslik);   /* taşmaz, '\0' ekler */
    k.sayfa = sayfa;
    return k;
}

int main(void) {
    Kitap k = kitap_olustur("Cok uzun bir kitap basligi", 320);
    printf("[%s] %d\n", k.baslik, k.sayfa);
    return 0;
}`, n: "Sabit boyutlu char dizisine kopyalarken snprintf(hedef, sizeof hedef, \"%s\", kaynak) kullan: fazlasını kırpar ve metni sonlandırır." },
  c8c2: { t: "Toplam stok değeri", c: k`
#include <stdio.h>

typedef struct {
    const char *ad;
    int adet;
    double fiyat;
} Urun;

double stok_degeri(const Urun *u, int n) {
    double toplam = 0;
    for (int i = 0; i < n; i++) toplam += u[i].adet * u[i].fiyat;
    return toplam;
}

int main(void) {
    Urun u[] = {{"kalem", 10, 12.5}, {"defter", 4, 45.0}};
    printf("%.2f\n", stok_degeri(u, 2));
    return 0;
}`, n: "Struct dizisinde elemanın alanına u[i].alan ile erişilir. Ortalama için toplamı n'e böl; n == 0 durumunu ayrıca ele al." },
  c8c3: { t: "Fiyata göre sırala (eklemeli)", c: k`
#include <stdio.h>

typedef struct { const char *ad; int fiyat; } Urun;

void fiyata_gore_sirala(Urun *u, int n) {
    for (int i = 1; i < n; i++) {
        Urun anahtar = u[i];                 /* struct'ın tamamı kopyalanır */
        int j = i - 1;
        while (j >= 0 && u[j].fiyat > anahtar.fiyat) {
            u[j + 1] = u[j];
            j--;
        }
        u[j + 1] = anahtar;
    }
}

int main(void) {
    Urun u[] = {{"defter", 45}, {"silgi", 6}, {"kalem", 12}};
    fiyata_gore_sirala(u, 3);
    printf("%s %s %s\n", u[0].ad, u[1].ad, u[2].ad);
    return 0;
}`, n: "Eklemeli sıralama: sıradaki elemanı al, kendinden büyükleri bir sağa kaydır, boşalan yere koy. Struct'lar = ile bütün olarak kopyalanır." },
  c9c1: { t: "Dizinin kopyası (malloc)", c: k`
#include <stdio.h>
#include <stdlib.h>

int *kopyala(const int *d, int n) {
    int *yeni = malloc(n * sizeof *yeni);
    if (yeni == NULL) return NULL;
    for (int i = 0; i < n; i++) yeni[i] = d[i];
    return yeni;                          /* belleği çağıran free eder */
}

int main(void) {
    int d[] = {3, 1, 4};
    int *k = kopyala(d, 3);
    if (k == NULL) return 1;
    printf("%d %d %d\n", k[0], k[1], k[2]);
    free(k);
    return 0;
}`, n: "malloc(n * sizeof *p) n elemanlık yer ayırır; NULL kontrolü yap, doldur, işaretçiyi döndür. Yerel dizinin adresini döndüremezsin." },
  c9c2: { t: "Metni tekrar et ('\\0' için yer)", c: k`
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* Hatalı sürüm malloc(strlen(s) * kez) ayırıyordu: sondaki '\0' için 1 bayt eksik → heap-buffer-overflow */
char *tekrarla(const char *s, int kez) {
    size_t uz = strlen(s);
    char *yeni = malloc(uz * kez + 1);       /* +1: metin sonu */
    if (yeni == NULL) return NULL;
    for (int i = 0; i < kez; i++) memcpy(yeni + i * uz, s, uz);
    yeni[uz * kez] = '\0';
    return yeni;
}

int main(void) {
    char *t = tekrarla("ab", 3);
    if (t == NULL) return 1;
    printf("%s\n", t);
    free(t);
    return 0;
}`, n: "Metin için ayrılan bellek her zaman uzunluk + 1'dir. heap-buffer-overflow raporu çoğunlukla bu eksik baytı gösterir." },
  c9c3: { t: "Büyüyen yığın (realloc)", c: k`
#include <stdio.h>
#include <stdlib.h>

typedef struct { double *veri; int boyut, kapasite; } Yigin;

void yigin_it(Yigin *y, double x) {
    if (y->boyut == y->kapasite) {
        int yeni_kap = y->kapasite == 0 ? 2 : y->kapasite * 2;
        double *yeni = realloc(y->veri, yeni_kap * sizeof *yeni);
        if (yeni == NULL) return;             /* eski blok hâlâ geçerli */
        y->veri = yeni;
        y->kapasite = yeni_kap;
    }
    y->veri[y->boyut++] = x;
}

void yigin_temizle(Yigin *y) { free(y->veri); y->veri = NULL; y->boyut = y->kapasite = 0; }

int main(void) {
    Yigin y = {0};
    for (int i = 1; i <= 5; i++) yigin_it(&y, i * 1.5);
    printf("%d eleman, kapasite %d, tepe %.1f\n", y.boyut, y.kapasite, y.veri[y.boyut - 1]);
    yigin_temizle(&y);
    return 0;
}`, n: "Dolunca kapasiteyi iki katına çıkar. realloc sonucunu önce geçici değişkene al; temizlerken free edip alanları sıfırla." },
  c10c1: { t: "Sona ekle", c: k`
#include <stdio.h>
#include <stdlib.h>

typedef struct Dugum { int deger; struct Dugum *sonraki; } Dugum;

Dugum *sona_ekle(Dugum *bas, int deger) {
    Dugum *yeni = malloc(sizeof *yeni);
    if (yeni == NULL) return bas;
    yeni->deger = deger;
    yeni->sonraki = NULL;
    if (bas == NULL) return yeni;            /* boş liste: yeni düğüm baş olur */
    Dugum *d = bas;
    while (d->sonraki != NULL) d = d->sonraki;
    d->sonraki = yeni;
    return bas;
}

int main(void) {
    Dugum *bas = NULL;
    for (int i = 1; i <= 3; i++) bas = sona_ekle(bas, i * 10);
    for (Dugum *d = bas; d != NULL; d = d->sonraki) printf("%d ", d->deger);
    printf("\n");
    while (bas != NULL) { Dugum *s = bas->sonraki; free(bas); bas = s; }
    return 0;
}`, n: "Yeni düğüm: malloc, alanları doldur, bağla. Başa eklemek daha kolaydır: yeni düğümün 'sonraki'si eski baş olur ve yeni düğüm döner." },
  c10c2: { t: "Toplam ve güvenli silme", c: k`
#include <stdio.h>
#include <stdlib.h>

typedef struct Dugum { int deger; struct Dugum *sonraki; } Dugum;

int toplam(const Dugum *bas) {
    int t = 0;
    for (const Dugum *d = bas; d != NULL; d = d->sonraki) t += d->deger;
    return t;
}

void hepsini_sil(Dugum *bas) {
    while (bas != NULL) {
        Dugum *sonraki = bas->sonraki;       /* free'den ÖNCE sakla */
        free(bas);
        bas = sonraki;
    }
}

int main(void) {
    Dugum *c = malloc(sizeof *c), *b = malloc(sizeof *b);
    if (!b || !c) return 1;
    c->deger = 5; c->sonraki = NULL;
    b->deger = 7; b->sonraki = c;
    printf("%d\n", toplam(b));
    hepsini_sil(b);
    return 0;
}`, n: "Listeyi dolaşma iskeleti: for (d = bas; d != NULL; d = d->sonraki). Silerken düğümü free etmeden önce 'sonraki'yi sakla; yoksa serbest belleği okursun." },
  c10c3: { t: "Listede ikişerli takas (yerinde)", c: k`
#include <stdio.h>
#include <stdlib.h>

typedef struct Dugum { int deger; struct Dugum *sonraki; } Dugum;

/* 1→2→3→4  ⇒  2→1→4→3 : yeni düğüm ayırmadan, yalnızca okları değiştirerek */
Dugum *ikiserli_takas(Dugum *bas) {
    if (bas == NULL || bas->sonraki == NULL) return bas;
    Dugum *ikinci = bas->sonraki;
    Dugum *kalan = ikinci->sonraki;          /* okları bozmadan önce sakla */
    ikinci->sonraki = bas;
    bas->sonraki = ikiserli_takas(kalan);
    return ikinci;
}

int main(void) {
    Dugum d[4];
    for (int i = 0; i < 4; i++) { d[i].deger = i + 1; d[i].sonraki = i < 3 ? &d[i + 1] : NULL; }
    for (Dugum *p = ikiserli_takas(&d[0]); p != NULL; p = p->sonraki) printf("%d ", p->deger);
    printf("\n");
    return 0;
}`, n: "Bir okun yönünü değiştirmeden önce gösterdiği düğümü bir değişkende sakla. Ters çevirmede üç işaretçi yeter: önceki, şimdiki, sonraki." },

  /* ---------- C Faz 11–20 ---------- */
  c11c1: { t: "Tek mi? (bit işlemiyle)", c: k`
#include <stdio.h>
#include <stdbool.h>

bool tek_mi(unsigned x) {
    return (x & 1u) != 0;        /* en sağdaki bit 1 ise tek */
}

int main(void) {
    printf("%d %d\n", tek_mi(7), tek_mi(10));
    printf("%u\n", 12u & (12u - 1u));   /* 1100 & 1011 = 1000: en sağdaki 1 silindi */
    return 0;
}`, n: "& ile maskeleyip tek bir biti sınarsın. x & (x − 1) en sağdaki 1'i siler; sonucun ne zaman 0 olacağını düşün." },
  c11c2: { t: "En yüksek bitin konumu", c: k`
#include <stdio.h>

int en_yuksek_bit(unsigned x) {
    int konum = -1;
    while (x != 0) {
        x >>= 1;                 /* bir bit sağa kaydır */
        konum++;
    }
    return konum;
}

int main(void) {
    printf("%d %d %d\n", en_yuksek_bit(1), en_yuksek_bit(8), en_yuksek_bit(255));
    return 0;
}`, n: "while (x) { ...; x >>= 1; } sayıyı bit bit tüketir. Her turda x & 1 ile son bite bakıp sayabilirsin." },
  c11c3: { t: "Baytın iki yarısını takas et", c: k`
#include <stdio.h>

unsigned char yarim_takas(unsigned char b) {
    return (unsigned char)((b << 4) | (b >> 4));     /* 0xAB → 0xBA */
}

int main(void) {
    printf("%02X %02X\n", yarim_takas(0xAB), yarim_takas(0x0F));
    return 0;
}`, n: "<< sola, >> sağa kaydırır; | parçaları birleştirir. Sonucu bit bit kurmak için: sonuc = (sonuc << 1) | (b & 1), sonra b >>= 1." },
  c12c1: { t: "Hep 'yüksek' çıkan öncelik", c: k`
#include <stdio.h>

/* Hatalı sürümde break'ler yoktu: her değer en alttaki atamaya kadar düşüyordu. */
const char *oncelik_adi(int o) {
    const char *ad = "bilinmiyor";
    switch (o) {
        case 0: ad = "dusuk"; break;
        case 1: ad = "orta"; break;
        case 2: ad = "yuksek"; break;
    }
    return ad;
}

int main(void) {
    printf("%s %s %s\n", oncelik_adi(0), oncelik_adi(2), oncelik_adi(7));
    return 0;
}`, n: "switch eşleşen case'ten başlar ve break görene kadar alttakileri de çalıştırır. Her case'i break ya da return ile bitir." },
  c12c2: { t: "Asansör durum makinesi", c: k`
#include <stdio.h>

typedef enum { BEKLIYOR, YUKARI, ASAGI } Durum;

Durum sonraki_durum(Durum d, int hedef, int kat) {
    switch (d) {
        case BEKLIYOR: return hedef > kat ? YUKARI : hedef < kat ? ASAGI : BEKLIYOR;
        case YUKARI:
        case ASAGI: return hedef == kat ? BEKLIYOR : d;
    }
    return BEKLIYOR;
}

int main(void) {
    printf("%d %d %d\n", sonraki_durum(BEKLIYOR, 5, 1), sonraki_durum(YUKARI, 5, 5), sonraki_durum(ASAGI, 1, 3));
    return 0;
}`, n: "enum durumlara ad verir; switch her durum için bir sonraki durumu döndürür. Durumlar bir çemberse her case bir sonrakini verir." },
  c12c3: { t: "Birim dönüştürücü", c: k`
#include <stdio.h>

double donustur(double deger, char birim) {
    switch (birim) {
        case 'k': return deger * 1000.0;     /* km → m */
        case 'c': return deger / 100.0;      /* cm → m */
        case 'm': return deger;
        default: return -1.0;                /* bilinmeyen birim */
    }
}

int main(void) {
    printf("%.1f %.2f %.1f\n", donustur(2.5, 'k'), donustur(180, 'c'), donustur(1, 'x'));
    return 0;
}`, n: "switch char değerleriyle çalışır: case '+':. Geçersiz girdiyi default ile, sıfıra bölmeyi case içinde ayrıca kontrol et." },
  c13c1: { t: "Koşula uyanları say (geri çağırma)", c: k`
#include <stdio.h>
#include <stdbool.h>

bool cift_mi(int x) { return x % 2 == 0; }
bool negatif_mi(int x) { return x < 0; }

int say(const int *d, int n, bool (*kosul)(int)) {
    int adet = 0;
    for (int i = 0; i < n; i++) if (kosul(d[i])) adet++;
    return adet;
}

int main(void) {
    int d[] = {4, -3, 8, -6, 5};
    printf("%d %d\n", say(d, 5, cift_mi), say(d, 5, negatif_mi));
    return 0;
}`, n: "Fonksiyon işaretçisi parametresi normal fonksiyon gibi çağrılır: f(x). Çağırırken fonksiyonun adını parantezsiz verirsin." },
  c13c2: { t: "Mutlak değere göre sırala", c: k`
#include <stdio.h>
#include <stdlib.h>

int mutlaga_gore(const void *a, const void *b) {
    long x = *(const int *)a, y = *(const int *)b;
    if (x < 0) x = -x;
    if (y < 0) y = -y;
    return (x > y) - (x < y);          /* taşmasız: -1, 0 ya da 1 */
}

int main(void) {
    int d[] = {-9, 2, -1, 7};
    qsort(d, 4, sizeof d[0], mutlaga_gore);
    printf("%d %d %d %d\n", d[0], d[1], d[2], d[3]);
    return 0;
}`, n: "Karşılaştırıcıda void * önce gerçek türe çevrilir. (x > y) − (x < y) artan sıra verir; azalan için işaretleri ters çevir." },
  c13c3: { t: "Noktaları x'e göre sırala", c: k`
#include <stdio.h>
#include <stdlib.h>

typedef struct { int x, y; } Nokta;

int x_e_gore(const void *a, const void *b) {
    const Nokta *p = a, *q = b;
    return (p->x > q->x) - (p->x < q->x);
}

int main(void) {
    Nokta n[] = {{5, 1}, {2, 9}, {8, 3}};
    qsort(n, 3, sizeof n[0], x_e_gore);
    printf("(%d,%d) (%d,%d) (%d,%d)\n", n[0].x, n[0].y, n[1].x, n[1].y, n[2].x, n[2].y);
    return 0;
}`, n: "Struct sıralarken void *'ı const Tur *'a çevir, sonra istediğin alanı karşılaştır. Metin alanları için strcmp sonucunu doğrudan döndür." },
  c14c1: { t: "Yanlış 'iki katı' makrosu", c: k`
#include <stdio.h>

/* Hatalı: #define IKI_KATI(x) x + x     →  3 * IKI_KATI(2) = 3 * 2 + 2 = 8 */
#define IKI_KATI(x) ((x) + (x))

int main(void) {
    printf("%d %d\n", 3 * IKI_KATI(2), IKI_KATI(1 + 1));
    return 0;
}`, n: "Makro metin yerleştirir. İki kural: her parametreyi (x) ve tüm ifadeyi ((...)) paranteze al." },
  c14c2: { t: "Son elemanın indeksi", c: k`
#include <stdio.h>
#include <stddef.h>

#define SON_INDEKS(d) (sizeof(d) / sizeof((d)[0]) - 1)

int main(void) {
    int a[] = {4, 8, 15, 16, 23, 42};
    printf("%zu %d\n", SON_INDEKS(a), a[SON_INDEKS(a)]);
    return 0;
}`, n: "sizeof(d) dizinin toplam baytı, sizeof((d)[0]) bir elemanın baytıdır; bölümleri eleman sayısını verir." },
  c14c3: { t: "Mutlak değer: makro ve inline", c: k`
#include <stdio.h>

#define MUTLAK(x) ((x) < 0 ? -(x) : (x))

static inline int mutlak_guvenli(int x) { return x < 0 ? -x : x; }

int main(void) {
    int i = -3;
    printf("%d %d\n", MUTLAK(-5), MUTLAK(2 - 9));
    int m = mutlak_guvenli(i++);        /* i bir kez artar; makroda iki kez değerlendirilirdi */
    printf("%d %d\n", m, i);
    return 0;
}`, n: "Makroda parametre birden çok kez geçiyorsa i++ gibi argümanlar birden çok kez çalışır. static inline fonksiyonda bu olmaz." },
  c15c1: { t: "Onaltılık metni sayıya çevir", c: k`
#include <stdio.h>
#include <ctype.h>

int hex_oku(const char *s) {
    int n = 0;
    while (isxdigit((unsigned char)*s)) {
        int basamak = isdigit((unsigned char)*s) ? *s - '0' : tolower((unsigned char)*s) - 'a' + 10;
        n = n * 16 + basamak;
        s++;
    }
    return n;
}

int main(void) {
    printf("%d %d %d\n", hex_oku("ff"), hex_oku("1A"), hex_oku("10 kalan"));
    return 0;
}`, n: "Basamak biriktirme: n = n * taban + basamak. Onluk sayıda basamak = c − '0'. İlk uygun olmayan karakterde dur." },
  c15c2: { t: "Cümle say", c: k`
#include <stdio.h>
#include <stdbool.h>

int cumle_say(const char *s) {
    int adet = 0;
    bool icinde = false;                 /* bir cümlenin içinde miyiz? */
    for (; *s; s++) {
        if (*s == '.' || *s == '!' || *s == '?') {
            if (icinde) adet++;
            icinde = false;
        } else if (*s != ' ') {
            icinde = true;
        }
    }
    return adet;
}

int main(void) {
    printf("%d\n", cumle_say("Merhaba. Nasilsin?  Iyiyim!.."));
    return 0;
}`, n: "Durumlu tarama: tek bir bool ile 'içinde miyim' bilgisini tut. Art arda gelen ayraçlar böylece bir kez sayılır." },
  c15c3: { t: "Açılı parantezler dengeli mi? (sayaçla)", c: k`
#include <stdio.h>
#include <stdbool.h>

bool acili_dengeli(const char *s) {
    int acik = 0;
    for (; *s; s++) {
        if (*s == '<') acik++;
        else if (*s == '>') {
            if (acik == 0) return false;     /* açılmadan kapandı */
            acik--;
        }
    }
    return acik == 0;
}

int main(void) {
    printf("%d %d %d\n", acili_dengeli("<a<b>>"), acili_dengeli("><"), acili_dengeli("<<>"));
    return 0;
}`, n: "Tek tür parantezde sayaç yeter. Birden çok türde hangi türün açıldığını hatırlaman gerekir: açılanı diziye (yığına) it, kapanışta tepedekiyle karşılaştır." },
  c16c1: { t: "Basit toplam hash'i", c: k`
#include <stdio.h>

unsigned long toplam_hash(const char *s) {
    unsigned long h = 0;
    for (; *s; s++) h = h * 31 + (unsigned char)*s;
    return h;
}

int main(void) {
    printf("%lu %lu\n", toplam_hash("ab"), toplam_hash("ba"));
    printf("kova: %lu\n", toplam_hash("elma") % 16);
    return 0;
}`, n: "Hash: bir başlangıç değeri, her karakterde 'çarp ve ekle'. Çarpma sayesinde karakterlerin sırası sonucu değiştirir." },
  c16c2: { t: "Tam sayı kümesi (zincirleme)", c: k`
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define KOVA 8
typedef struct Eleman { int deger; struct Eleman *sonraki; } Eleman;
typedef struct { Eleman *kovalar[KOVA]; int boyut; } Kume;

bool kume_var(const Kume *k, int x) {
    for (const Eleman *e = k->kovalar[(unsigned)x % KOVA]; e; e = e->sonraki)
        if (e->deger == x) return true;
    return false;
}

void kume_ekle(Kume *k, int x) {
    if (kume_var(k, x)) return;                 /* zaten var */
    Eleman *e = malloc(sizeof *e);
    if (!e) return;
    unsigned kova = (unsigned)x % KOVA;
    e->deger = x;
    e->sonraki = k->kovalar[kova];              /* kovanın başına ekle */
    k->kovalar[kova] = e;
    k->boyut++;
}

int main(void) {
    Kume k = {0};
    kume_ekle(&k, 5); kume_ekle(&k, 13); kume_ekle(&k, 5);
    printf("%d %d %d\n", k.boyut, kume_var(&k, 13), kume_var(&k, 4));
    for (int i = 0; i < KOVA; i++) while (k.kovalar[i]) { Eleman *s = k.kovalar[i]->sonraki; free(k.kovalar[i]); k.kovalar[i] = s; }
    return 0;
}`, n: "Kova = hash % KOVA. Aramada o kovanın listesini dolaş; eklemede önce ara, yoksa yeni düğümü kovanın başına bağla. Metin anahtarlarında strcmp ve anahtarın kopyası gerekir." },
  c16c3: { t: "Kopyalı metin dizisini temizle", c: k`
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char **adlar; int boyut; } Liste;

void liste_ekle(Liste *l, const char *ad) {
    char **yeni = realloc(l->adlar, (l->boyut + 1) * sizeof *yeni);
    if (!yeni) return;
    l->adlar = yeni;
    l->adlar[l->boyut] = malloc(strlen(ad) + 1);
    if (!l->adlar[l->boyut]) return;
    strcpy(l->adlar[l->boyut++], ad);
}

void liste_sil(Liste *l) {
    for (int i = 0; i < l->boyut; i++) free(l->adlar[i]);   /* önce her kopya */
    free(l->adlar);                                          /* sonra dizi */
    l->adlar = NULL;
    l->boyut = 0;
}

int main(void) {
    Liste l = {0};
    liste_ekle(&l, "elma"); liste_ekle(&l, "armut");
    printf("%d %s\n", l.boyut, l.adlar[1]);
    liste_sil(&l);
    printf("%d\n", l.boyut);
    return 0;
}`, n: "Her malloc'un bir free'si olmalı: iç içe yapılarda önce içtekileri, sonra kabı serbest bırak ve alanları sıfırla." },
  c17c1: { t: "Ağaçta en küçük değer", c: k`
#include <stdio.h>

typedef struct Dal { int deger; struct Dal *sol, *sag; } Dal;

int en_kucuk(const Dal *kok) {
    while (kok->sol != NULL) kok = kok->sol;     /* hep sola git */
    return kok->deger;
}

int main(void) {
    Dal d1 = {1, NULL, NULL}, d4 = {4, NULL, NULL}, d8 = {8, NULL, NULL};
    Dal d3 = {3, &d1, &d4}, kok = {5, &d3, &d8};
    printf("%d\n", en_kucuk(&kok));
    return 0;
}`, n: "BST kuralı: küçükler solda, büyükler sağda. Eklerken aynı kuralla in: boş yere (NULL) varınca yeni düğümü orada oluştur ve döndür." },
  c17c2: { t: "Düğüm sayısı ve toplam (gezinti)", c: k`
#include <stdio.h>

typedef struct Dal { int deger; struct Dal *sol, *sag; } Dal;

int dugum_say(const Dal *kok) {
    if (kok == NULL) return 0;
    return dugum_say(kok->sol) + 1 + dugum_say(kok->sag);
}

void sirali_yazdir(const Dal *kok) {
    if (kok == NULL) return;
    sirali_yazdir(kok->sol);          /* önce sol */
    printf("%d ", kok->deger);        /* sonra kendisi */
    sirali_yazdir(kok->sag);          /* sonra sağ */
}

int main(void) {
    Dal d1 = {1, NULL, NULL}, d4 = {4, NULL, NULL}, d8 = {8, NULL, NULL};
    Dal d3 = {3, &d1, &d4}, kok = {5, &d3, &d8};
    printf("%d dugum: ", dugum_say(&kok));
    sirali_yazdir(&kok);
    printf("\n");
    return 0;
}`, n: "Sol → kendisi → sağ sırası değerleri küçükten büyüğe verir. Yazdırmak yerine bir diziye yazacaksan indeksi parametre olarak taşı ve geri döndür." },
  c17c3: { t: "Yaprak sayısı", c: k`
#include <stdio.h>

typedef struct Dal { int deger; struct Dal *sol, *sag; } Dal;

int yaprak_say(const Dal *kok) {
    if (kok == NULL) return 0;
    if (kok->sol == NULL && kok->sag == NULL) return 1;     /* yaprak */
    return yaprak_say(kok->sol) + yaprak_say(kok->sag);
}

int main(void) {
    Dal d1 = {1, NULL, NULL}, d4 = {4, NULL, NULL}, d8 = {8, NULL, NULL};
    Dal d3 = {3, &d1, &d4}, kok = {5, &d3, &d8};
    printf("%d\n", yaprak_say(&kok));
    return 0;
}`, n: "Ağaç özyinelemesi: boş ağacın cevabı + alt ağaçların cevaplarını birleştir. Silerken önce çocukları, en son düğümün kendisini free et." },
  c18c1: { t: "Dairesel tampon: son 3 ölçüm", c: k`
#include <stdio.h>

#define KAP 3
typedef struct { int veri[KAP]; int sonraki, adet; } Tampon;

void tampon_yaz(Tampon *t, int x) {
    t->veri[t->sonraki] = x;
    t->sonraki = (t->sonraki + 1) % KAP;      /* sona gelince başa sar */
    if (t->adet < KAP) t->adet++;
}

int main(void) {
    Tampon t = {0};
    for (int i = 1; i <= 5; i++) tampon_yaz(&t, i * 10);
    int bas = (t.sonraki - t.adet + KAP) % KAP;   /* en eski eleman */
    for (int i = 0; i < t.adet; i++) printf("%d ", t.veri[(bas + i) % KAP]);
    printf("\n");
    return 0;
}`, n: "% KAP indeksi dizinin sonundan başa sarar. Kuyrukta baş ve eleman sayısını tut: son = (bas + boyut) % KAP; dolu ve boş durumları reddet." },
  c18c2: { t: "Bir fazla okuyan sayaç", c: k`
#include <stdio.h>
#include <stdbool.h>

#define KAP 3
typedef struct { int veri[KAP]; int adet; } Kutu;

/* Hatalı sürüm: if (k->adet > KAP) return false;  → adet == KAP iken veri[3]'e yazıyordu (taşma) */
bool kutu_ekle(Kutu *k, int x) {
    if (k->adet >= KAP) return false;      /* geçerli indeksler: 0 .. KAP-1 */
    k->veri[k->adet++] = x;
    return true;
}

int main(void) {
    Kutu k = {0};
    int kabul = 0;
    for (int i = 0; i < 5; i++) kabul += kutu_ekle(&k, i);
    printf("%d kabul, %d eleman\n", kabul, k.adet);
    return 0;
}`, n: "N elemanlı dizide son geçerli indeks N − 1'dir. Doluluk kontrolü >= ile yapılır; > bir eleman fazlasına izin verir." },
  c18c3: { t: "Önek (prefix) toplama makinesi", c: k`
#include <stdio.h>
#include <ctype.h>

/* "3 4 5 +" → yığındaki tüm sayıları toplar. Sayıları oku, yığına it; '+' gelince hepsini çekip topla. */
int topla_makinesi(const char *s) {
    int yigin[32], ust = 0;
    while (*s) {
        if (isdigit((unsigned char)*s)) {
            int n = 0;
            while (isdigit((unsigned char)*s)) n = n * 10 + (*s++ - '0');   /* çok basamaklı sayı */
            yigin[ust++] = n;
        } else if (*s == '+') {
            int t = 0;
            while (ust > 0) t += yigin[--ust];
            yigin[ust++] = t;
            s++;
        } else s++;
    }
    return ust > 0 ? yigin[0] : 0;
}

int main(void) {
    printf("%d\n", topla_makinesi("12 30 8 +"));
    return 0;
}`, n: "Sayı görünce it, işleç görünce çek-hesapla-it. İki işlenenli işleçlerde sıraya dikkat: önce çekilen sağdaki (b), sonra çekilen soldaki (a)." },
  c19c1: { t: "Tek blok matris", c: k`
#include <stdio.h>
#include <stdlib.h>

/* satir × sutun matrisi tek malloc ile: (i, j) → i * sutun + j */
double *matris_tek(int satir, int sutun) {
    return calloc((size_t)satir * sutun, sizeof(double));   /* sıfırlarla dolu */
}

int main(void) {
    int satir = 2, sutun = 3;
    double *m = matris_tek(satir, sutun);
    if (m == NULL) return 1;
    m[1 * sutun + 2] = 7.5;
    printf("%.1f %.1f\n", m[0], m[1 * sutun + 2]);
    free(m);
    return 0;
}`, n: "calloc sıfırlar. int ** biçiminde önce satır işaretçileri dizisi, sonra her satır ayrı ayrılır; silerken ters sırada: önce satırlar, sonra dizi." },
  c19c2: { t: "Matris × vektör", c: k`
#include <stdio.h>

void matris_vektor(const int *m, const int *v, int *sonuc, int n) {
    for (int i = 0; i < n; i++) {
        int t = 0;                              /* her satır için sıfırdan başla */
        for (int j = 0; j < n; j++) t += m[i * n + j] * v[j];
        sonuc[i] = t;
    }
}

int main(void) {
    int m[] = {1, 2, 3, 4}, v[] = {5, 6}, s[2];
    matris_vektor(m, v, s, 2);
    printf("%d %d\n", s[0], s[1]);
    return 0;
}`, n: "Tek dizide (i, j) elemanı m[i * n + j]'dir. Matris çarpımında üçüncü bir döngü (k) gelir: toplam += a[i][k] * b[k][j]." },
  c19c3: { t: "Satırları yerinde ters çevir (aynalama)", c: k`
#include <stdio.h>

void ayna(int *m, int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n / 2; j++) {       /* yalnızca yarısına kadar: yoksa geri takas olur */
            int t = m[i * n + j];
            m[i * n + j] = m[i * n + (n - 1 - j)];
            m[i * n + (n - 1 - j)] = t;
        }
    }
}

int main(void) {
    int m[] = {1, 2, 3, 4, 5, 6, 7, 8, 9};
    ayna(m, 3);
    printf("%d %d %d | %d %d %d\n", m[0], m[1], m[2], m[3], m[4], m[5]);
    return 0;
}`, n: "Yerinde takasta her çifti yalnızca BİR kez takas et. Transpozede bu, köşegenin bir tarafını dolaşmak demektir: j = i + 1'den başla." },
  c20c1: { t: "Sesli harf ve rakam sayacı", stdin: "Quagen 2026!\nC ile 3 satir.\n", c: k`
#include <stdio.h>
#include <ctype.h>
#include <string.h>

int main(void) {
    int c, sesli = 0, rakam = 0;
    while ((c = getchar()) != EOF) {
        if (isdigit(c)) rakam++;
        else if (strchr("aeiouAEIOU", c) != NULL) sesli++;
    }
    printf("sesli: %d\nrakam: %d\n", sesli, rakam);
    return 0;
}`, n: "while ((c = getchar()) != EOF) girdiyi karakter karakter okur. Tek döngüde birden çok sayacı birlikte güncelleyebilirsin." },
  c20c2: { t: "En uzun kelime", stdin: "kisa bir cumle icindeki enuzunkelime burada\n", c: k`
#include <stdio.h>
#include <ctype.h>
#include <string.h>

int main(void) {
    char kelime[64], en[64] = "";
    int c, u = 0;
    do {
        c = getchar();
        if (c != EOF && isalpha(c)) {
            if (u < 63) kelime[u++] = (char)c;          /* harfleri tamponda topla */
        } else if (u > 0) {
            kelime[u] = '\0';                            /* kelime bitti */
            if (strlen(kelime) > strlen(en)) strcpy(en, kelime);
            u = 0;
        }
    } while (c != EOF);                                  /* EOF'ta son kelime de işlenir */
    printf("%s %zu\n", en, strlen(en));
    return 0;
}`, n: "Harfleri bir tamponda biriktir; harf olmayan karakter (ya da EOF) kelimeyi bitirir. do-while sayesinde girdinin sonundaki kelime kaçmaz." },
  c20c3: { t: "En pahalı iki ürün (qsort)", stdin: "kalem 12\ndefter 45\nsilgi 6\ncanta 450\n", c: k`
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char ad[32]; int fiyat; } Urun;

static int pahalidan(const void *a, const void *b) {
    const Urun *x = a, *y = b;
    if (x->fiyat != y->fiyat) return (x->fiyat < y->fiyat) - (x->fiyat > y->fiyat);   /* fiyat azalan */
    return strcmp(x->ad, y->ad);                                                       /* eşitse ada göre */
}

int main(void) {
    Urun u[100];
    int n = 0;
    while (n < 100 && scanf("%31s %d", u[n].ad, &u[n].fiyat) == 2) n++;
    qsort(u, n, sizeof u[0], pahalidan);
    for (int i = 0; i < n && i < 2; i++) printf("%s %d\n", u[i].ad, u[i].fiyat);
    return 0;
}`, n: "Çok ölçütlü karşılaştırıcı: birinci ölçüt farklıysa ona göre, eşitse ikinciye göre karar ver. Sıraladıktan sonra ilk k satırı yazdır." }
  });
})();
