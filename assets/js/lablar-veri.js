/* QUAGEN — lab içerikleri. Her lab: sahte bir dosya sistemi + KAM'in anlattığı adımlar.
 * Adım: { k: [KAM mesajları], gorev, ipucu, cozum: [komutlar], gec: koşul }
 * Koşul türleri: { komut: "regex" } başarılı bir komut eşleşince · { cikti: "regex" } çıktı eşleşince
 *                { bayrak: "QG{…}" } öğrenci bayrağı girince · { durum: (kabuk) => bool } dosya sistemi istenen hâle gelince */
(function (kok) {
  const SALDIRGAN = "203.0.113.77";
  const kayit = (() => {
    const l = [], ipler = ["198.51.100.14", SALDIRGAN, "192.0.2.45", SALDIRGAN, SALDIRGAN, "198.51.100.14", SALDIRGAN];
    const kullanicilar = ["root", "admin", "test", "oracle", "deniz", "root", "admin", "postgres", "root", "ubuntu"];
    let sn = 0;
    const saat = () => { sn += 7; return `Kas 12 03:${String(14 + Math.floor(sn / 60)).padStart(2, "0")}:${String(sn % 60).padStart(2, "0")}`; };
    l.push(`${saat()} sunucu sshd[811]: Accepted password for ayse from 192.0.2.10 port 50122 ssh2`);
    for (let i = 0; i < 34; i++) { const ip = ipler[i % ipler.length]; l.push(`${saat()} sunucu sshd[${900 + i}]: Failed password for ${i % 3 === 0 ? "invalid user " : ""}${kullanicilar[i % kullanicilar.length]} from ${ip} port ${40000 + i * 13} ssh2`); }
    l.push(`${saat()} sunucu sshd[990]: Accepted password for deniz from ${SALDIRGAN} port 41877 ssh2`);
    l.push(`${saat()} sunucu sudo:    deniz : TTY=pts/0 ; PWD=/home/deniz ; USER=root ; COMMAND=/bin/cat /etc/shadow`);
    l.push(`${saat()} sunucu sshd[1012]: Accepted password for ayse from 192.0.2.10 port 50310 ssh2`);
    return l.join("\n") + "\n";
  })();

  const LABLAR = [
    {
      id: "sg1", alan: "siber", no: 1, baslik: "Terminalde yön bulmak", seviye: "Başlangıç", sure: 15,
      ozet: "Güvenlikçinin ilk aracı komut satırıdır. Dizinlerde gezmeyi, dosya okumayı ve gizli dosyaları görmeyi öğren.",
      kazanim: ["pwd, ls, cd, cat", "gizli dosyalar (ls -a)", "göreli ve mutlak yol"],
      dosyalar: {
        "/home/ogrenci/hosgeldin.txt": "Bu makine bir alıştırma ortamı. Hiçbir şeyi bozamazsın; istediğini dene.\n",
        "/home/ogrenci/belgeler/rapor.txt": "Haftalık rapor: sunucuda olağan dışı bir şey görülmedi.\n",
        "/home/ogrenci/belgeler/notlar.txt": "Yapılacaklar:\n- yedekleri kontrol et\n- parolayı değiştir\n- gizli klasöre bakmayı unutma\n",
        "/home/ogrenci/belgeler/.gizli/bayrak.txt": "QG{nokta_ile_baslayan_gizlenir}\n",
        "/home/ogrenci/indirilenler/resim.png": "PNG...\n"
      },
      adimlar: [
        { k: ["Sağdaki siyah ekran bir **terminal**: bilgisayara yazarak komut verdiğin yer. Güvenlik işlerinin çoğu burada yapılır, çünkü sunucularda fare ve pencere yoktur.", "İlk soru her zaman aynıdır: neredeyim? `pwd` yaz ve Enter'a bas."], gorev: "Bulunduğun dizini öğren.", ipucu: "`pwd` yaz.", cozum: ["pwd"], gec: { komut: "^pwd$" } },
        { k: ["`/home/ogrenci`: bu senin ev dizinin. Eğik çizgiler klasörleri ayırır; en baştaki `/` her şeyin kökü.", "Şimdi burada ne var, ona bakalım: `ls`."], gorev: "Dizindeki dosyaları listele.", ipucu: "`ls` yaz.", cozum: ["ls"], gec: { komut: "^ls( |$)" } },
        { k: ["Sonunda `/` olanlar klasör, diğerleri dosya. `belgeler` klasörüne girelim: `cd belgeler`. Sonra yeniden `ls`."], gorev: "belgeler klasörüne gir.", ipucu: "`cd belgeler`", cozum: ["cd belgeler", "ls"], gec: { durum: (k) => k.cwd === "/home/ogrenci/belgeler" } },
        { k: ["İki dosya görüyorsun. Bir dosyanın içini okumak için `cat` kullanılır: `cat notlar.txt`."], gorev: "notlar.txt dosyasını oku.", ipucu: "`cat notlar.txt`", cozum: ["cat notlar.txt"], gec: { cikti: "gizli klasöre" } },
        { k: ["Notta bir “gizli klasör”den söz ediliyor ama `ls` onu göstermedi. Linux'ta adı **nokta ile başlayan** dosyalar gizlidir; saldırganlar da iz bırakmamak için bunu kullanır.", "Hepsini görmek için: `ls -a`."], gorev: "Gizli dosyaları da listele.", ipucu: "`ls -a` (a: all, hepsi)", cozum: ["ls -a"], gec: { cikti: "\\.gizli" } },
        { k: ["İşte `.gizli`. İçine gir, ne varsa oku. Bulduğun bayrağı alttaki kutuya yaz ya da `bayrak QG{...}` komutuyla gönder.", "Bayrak, bir labı çözdüğünü gösteren `QG{...}` biçimindeki metindir."], gorev: "Gizli klasördeki bayrağı bul ve gönder.", ipucu: "`cd .gizli`, sonra `ls`, sonra `cat bayrak.txt`.", cozum: ["cd .gizli", "cat bayrak.txt", "bayrak QG{nokta_ile_baslayan_gizlenir}"], gec: { bayrak: "QG{nokta_ile_baslayan_gizlenir}" } }
      ],
      kapanis: "Dört komutla bir dosya sisteminde iz sürebiliyorsun: `pwd`, `ls`, `cd`, `cat`. Gerçek bir incelemede de ilk yapılan budur."
    },
    {
      id: "sg2", alan: "siber", no: 2, baslik: "İz sürmek: kayıt dosyaları", seviye: "Başlangıç", sure: 25,
      ozet: "Bir sunucuya gece yarısı giriş denemeleri yapılmış. Kayıt dosyasını okuyup saldırganın adresini ve ele geçirilen hesabı bul.",
      kazanim: ["grep ile arama", "boru (|) ile komut birleştirme", "sort, uniq -c, cut", "kaba kuvvet saldırısını tanımak"],
      dosyalar: { "/var/log/auth.log": kayit, "/home/ogrenci/gorev.txt": "Olay: 12 Kasım gecesi sunucuda şüpheli giriş denemeleri.\nKayıt dosyası: /var/log/auth.log\n" },
      adimlar: [
        { k: ["Sunucular kimin, ne zaman, nereden girmeye çalıştığını bir dosyaya yazar. Bu dosyaya **kayıt (log)** denir ve bir olayı incelerken ilk bakılan yerdir.", "Dosya uzun olabilir; önce ilk satırlarına bak: `head /var/log/auth.log`."], gorev: "Kayıt dosyasının ilk satırlarını gör.", ipucu: "`head /var/log/auth.log`", cozum: ["head /var/log/auth.log"], gec: { cikti: "Failed password" } },
        { k: ["Her satır bir olay. `Accepted` başarılı giriş, `Failed` başarısız deneme demek.", "Onlarca satırı gözle taramak yerine arayalım. `grep` içinde aradığın ifade geçen satırları getirir: `grep Failed /var/log/auth.log`."], gorev: "Başarısız giriş denemelerini listele.", ipucu: "`grep Failed /var/log/auth.log`", cozum: ["grep Failed /var/log/auth.log"], gec: { komut: "^grep\\b.*Failed" } },
        { k: ["Kaç tane olduğunu saymak için `-c` ekle: `grep -c Failed /var/log/auth.log`."], gorev: "Başarısız denemeleri say.", ipucu: "`grep -c Failed /var/log/auth.log`", cozum: ["grep -c Failed /var/log/auth.log"], gec: { cikti: "^34\\s*$" } },
        { k: ["Birkaç dakikada 34 başarısız deneme. Bir insan parolasını bu kadar unutmaz; bu bir programın art arda parola denemesi, yani **kaba kuvvet** saldırısı.", "Şimdi asıl soru: kim? Her satırda `from` sözcüğünden sonra adres yazıyor. Komutları **boru** (`|`) ile birbirine bağlayacağız: birinin çıktısı diğerinin girdisi olur.", "Önce adresleri ayıklayalım. `cut` her satırı boşluklardan bölüp istediğin parçayı alır; adres 11. parçada: `grep Failed /var/log/auth.log | grep -v invalid | cut -d ' ' -f 11`"], gorev: "Başarısız denemelerdeki adresleri ayıkla.", ipucu: "`cut -d ' ' -f 11`: satırı boşluklardan böl, 11. parçayı al. “invalid user” satırlarında sıra kaydığı için önce `grep -v invalid` ile onları çıkarıyoruz.", cozum: ["grep Failed /var/log/auth.log | grep -v invalid | cut -d ' ' -f 11"], gec: { cikti: "203\\.0\\.113\\.77" } },
        { k: ["Adresler geldi ama karışık. Üç küçük komut daha: `sort` sıralar, `uniq -c` aynı olanları sayar, `sort -rn` çoktan aza dizer.", "`grep Failed /var/log/auth.log | grep -v invalid | cut -d ' ' -f 11 | sort | uniq -c | sort -rn`"], gorev: "Hangi adresten kaç deneme geldiğini say.", ipucu: "Önceki komutun sonuna `| sort | uniq -c | sort -rn` ekle.", cozum: ["grep Failed /var/log/auth.log | grep -v invalid | cut -d ' ' -f 11 | sort | uniq -c | sort -rn"], gec: { cikti: "^\\s+\\d+ 203\\.0\\.113\\.77" } },
        { k: ["En üstteki adres saldırgan. Peki başardı mı? Bu adresten **başarılı** bir giriş var mı bak: `grep Accepted /var/log/auth.log`."], gorev: "Başarılı girişleri listele.", ipucu: "`grep Accepted /var/log/auth.log`", cozum: ["grep Accepted /var/log/auth.log"], gec: { cikti: "Accepted password for deniz from 203" } },
        { k: ["Kötü haber: `deniz` hesabına saldırganın adresinden giriş yapılmış. Parolası tahmin edilmiş.", "Bayrak, saldırganın adresi ve ele geçirilen hesap: `QG{adres_hesap}` biçiminde gönder. Örnek biçim: `QG{1.2.3.4_ali}`."], gorev: "Saldırganın adresini ve ele geçirilen hesabı bayrak olarak gönder.", ipucu: "Adres 203 ile başlıyor, hesap deniz.", cozum: ["bayrak QG{203.0.113.77_deniz}"], gec: { bayrak: "QG{203.0.113.77_deniz}" } }
      ],
      kapanis: "Az önce gerçek bir olay incelemesinin küçük bir kopyasını yaptın: kaydı oku, ara, say, sırala, sonuca var. Savunma tarafında çıkarılacak ders de belli: zayıf parola ve sınırsız deneme hakkı."
    },
    {
      id: "sg3", alan: "siber", no: 3, baslik: "Kodlama şifreleme değildir", seviye: "Başlangıç", sure: 20,
      ozet: "Base64, onaltılık ve ROT13 gizli görünür ama anahtarsız geri çevrilir. Üç katmanlı bir mesajı çöz.",
      kazanim: ["base64 -d", "xxd -r -p (onaltılık)", "tr ile ROT13", "kodlama ile şifrelemenin farkı"],
      dosyalar: {
        "/home/ogrenci/mesaj1.txt": "UGFyb2xhOiBrYXJwdXoxMjM=\n",
        "/home/ogrenci/mesaj2.txt": "42757261646120626972207369722079616b\n",
        "/home/ogrenci/mesaj3.txt": "DT{xbqynzn_fvseryrzr_qrtvy}\n",
        "/home/ogrenci/oku.txt": "Üç dosya, üç farklı kodlama. Hiçbiri şifre değil.\n"
      },
      adimlar: [
        { k: ["Bir uygulamanın ayar dosyasında `UGFyb2xhOiBrYXJwdXoxMjM=` gibi bir şey görürsen bu şifrelenmiş değildir. Bu **Base64**: veriyi yalnızca harf ve rakamlarla yazmanın bir yolu. Sonundaki `=` tipik işaretidir.", "Önce dosyaya bak: `cat mesaj1.txt`."], gorev: "mesaj1.txt dosyasını oku.", ipucu: "`cat mesaj1.txt`", cozum: ["cat mesaj1.txt"], gec: { cikti: "UGFyb2xh" } },
        { k: ["Geri çevirmek için anahtar gerekmez: `base64 -d mesaj1.txt`."], gorev: "Base64'ü çöz.", ipucu: "`base64 -d mesaj1.txt` (d: decode)", cozum: ["base64 -d mesaj1.txt"], gec: { cikti: "karpuz123" } },
        { k: ["Bir parola çıktı. Geliştiriciler bazen parolayı Base64 yapıp “gizledim” sanır; gördüğün gibi bir komutla açılıyor. **Kodlama** gizlemez, yalnızca biçim değiştirir. **Şifreleme** ise anahtar olmadan geri alınamaz.", "İkinci dosya yalnızca 0-9 ve a-f içeriyor: bu **onaltılık** (hex) yazım. `cat mesaj2.txt | xxd -r -p` ile çevir."], gorev: "Onaltılık yazımı metne çevir.", ipucu: "`cat mesaj2.txt | xxd -r -p`", cozum: ["cat mesaj2.txt | xxd -r -p"], gec: { cikti: "Burada bir sir yak" } },
        { k: ["Her iki karakter bir harfin sayı karşılığıydı: 42 → B, 75 → u ...", "Üçüncüsü harfleri kaydırıyor. **ROT13** her harfi alfabede 13 ileri atar; iki kez uygularsan başa dönersin. `tr` bir harf kümesini başka bir kümeye çevirir:", "`cat mesaj3.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'`"], gorev: "ROT13'ü çöz.", ipucu: "`cat mesaj3.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'`", cozum: ["cat mesaj3.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'"], gec: { cikti: "QG\\{kodlama_sifreleme_degil\\}" } },
        { k: ["Bayrak ortaya çıktı. Gönder."], gorev: "Bayrağı gönder.", ipucu: "Çıkan `QG{...}` metnini kutuya yaz.", cozum: ["bayrak QG{kodlama_sifreleme_degil}"], gec: { bayrak: "QG{kodlama_sifreleme_degil}" } }
      ],
      kapanis: "Bundan sonra garip görünen bir metinle karşılaştığında ilk soracağın şey: bu kodlama mı, şifreleme mi? Sonu `=` ile bitiyorsa Base64, yalnızca 0-9 a-f ise onaltılık olabilir."
    },
    {
      id: "sg4", alan: "siber", no: 4, baslik: "Dosya izinleri", seviye: "Başlangıç", sure: 20,
      ozet: "Kim okuyabilir, kim değiştirebilir, kim çalıştırabilir? İzinleri oku, açık bırakılmış bir parola dosyasını kapat.",
      kazanim: ["ls -l çıktısını okumak", "rwx ve sayı gösterimi (644, 600)", "chmod", "en az yetki ilkesi"],
      dosyalar: {
        "/home/ogrenci/parolalar.txt": { icerik: "banka: Kedi2024!\ne-posta: yazGunesi7\n", mod: "644" },
        "/home/ogrenci/denetle.sh": { icerik: "#!/bin/sh\n# parolalar.txt dosyasının izinlerini denetler\n", mod: "644", betik: (k) => { const d = k.dosya("/home/ogrenci/parolalar.txt"); return d && d.mod === "600" ? "Denetim: parolalar.txt yalnızca sahibine açık. Güvenli.\nQG{en_az_yetki}\n" : "Denetim: parolalar.txt başkaları tarafından okunabiliyor! (izin: " + (d ? d.mod : "?") + ")\nÖnce bunu düzelt, sonra yeniden çalıştır.\n"; } },
        "/etc/shadow": { icerik: "root:$6$...\n", mod: "600", sahip: "root" },
        "/home/ogrenci/oku.txt": "Görev: parolalar.txt dosyasını yalnızca sen okuyabil. Sonra ./denetle.sh çalıştır.\n"
      },
      adimlar: [
        { k: ["Linux'ta her dosyanın üç tür izni vardır: **okuma (r)**, **yazma (w)**, **çalıştırma (x)**. Bunlar üç ayrı kişi grubu için ayrı ayrı tutulur: dosyanın sahibi, grubu ve geri kalan herkes.", "`ls -l` yaz, izinleri görelim."], gorev: "Dosyaları izinleriyle listele.", ipucu: "`ls -l`", cozum: ["ls -l"], gec: { cikti: "rw-r--r--" } },
        { k: ["`-rw-r--r--` şöyle okunur: ilk karakter türü (`-` dosya, `d` klasör). Sonra üçer üçer: sahibi `rw-` (okur, yazar), grup `r--` (okur), **herkes** `r--` (okur).", "Yani `parolalar.txt` dosyasını bu makinedeki herkes okuyabiliyor. Parola dosyası için bu ciddi bir hata.", "Karşılaştırmak için sistemin kendi parola dosyasını okumayı dene: `cat /etc/shadow`."], gorev: "/etc/shadow dosyasını okumayı dene.", ipucu: "`cat /etc/shadow`", cozum: ["cat /etc/shadow"], gec: { komut: "^cat /etc/shadow" , hataOlsa: true } },
        { k: ["“Erişim engellendi.” O dosyanın sahibi `root` ve izinleri yalnızca ona açık. Doğrusu bu.", "Kendi dosyamızı da öyle yapalım. İzinler sayıyla da yazılır: r=4, w=2, x=1. `rw-` = 6, `---` = 0. Yalnızca sahibi okuyup yazsın: **600**.", "`chmod 600 parolalar.txt`"], gorev: "parolalar.txt dosyasını yalnızca sahibine aç.", ipucu: "`chmod 600 parolalar.txt`", cozum: ["chmod 600 parolalar.txt"], gec: { durum: (k) => (k.dosya("/home/ogrenci/parolalar.txt") || {}).mod === "600" } },
        { k: ["`ls -l` ile bakarsan artık `-rw-------` göreceksin.", "Şimdi denetim betiğini çalıştır: `./denetle.sh`"], gorev: "Denetim betiğini çalıştırmayı dene.", ipucu: "`./denetle.sh`", cozum: ["./denetle.sh"], gec: { komut: "^\\./denetle\\.sh", hataOlsa: true } },
        { k: ["Yine “erişim engellendi”, ama bu kez nedeni farklı: dosyada **çalıştırma (x)** izni yok. Bir dosya program gibi çalışacaksa x izni gerekir.", "`chmod +x denetle.sh` ile ekle, sonra yeniden çalıştır."], gorev: "Betiğe çalıştırma izni ver ve çalıştır.", ipucu: "`chmod +x denetle.sh`, ardından `./denetle.sh`", cozum: ["chmod +x denetle.sh", "./denetle.sh"], gec: { cikti: "QG\\{en_az_yetki\\}" } },
        { k: ["Denetim geçti ve bayrağı verdi. Gönder."], gorev: "Bayrağı gönder.", ipucu: "Betiğin yazdığı `QG{...}` metnini kutuya yaz.", cozum: ["bayrak QG{en_az_yetki}"], gec: { bayrak: "QG{en_az_yetki}" } }
      ],
      kapanis: "Buna **en az yetki ilkesi** denir: herkes yalnızca işini yapmasına yetecek kadar izne sahip olmalı. Sızıntıların önemli bir kısmı, herkese açık bırakılmış bir dosyayla başlar."
    }
  ];

  /* Öğrenme alanları (yol haritaları). durum: "hazir" | "yakinda" */
  const ALANLAR = [
    { id: "py", ad: "Python", tur: "dil", durum: "hazir", ozet: "İlk dil için en rahatı. Değişkenlerden veri raporu aracına.", olcu: "20 ders · 60 görev" },
    { id: "c", ad: "C", tur: "dil", durum: "hazir", ozet: "Bilgisayarın içini anlamak isteyenlere. İşaretçiler, bellek, yapılar.", olcu: "20 ders · 60 görev" },
    { id: "js", ad: "JavaScript ve Web", tur: "dil", durum: "hazir", ozet: "Dilin temeli, ardından web sayfaları, React, algoritmalar ve sunucu tarafı.", olcu: "50 ders · 150 görev" },
    { id: "siber", ad: "Siber Güvenlik", tur: "lab", durum: "hazir", ozet: "Sıfırdan: terminal, kayıt inceleme, kodlamalar, izinler. Her konu tarayıcıdaki bir lab makinesinde.", olcu: "4 lab hazır · devamı geliyor" },
    { id: "linux", ad: "Linux ve Komut Satırı", tur: "lab", durum: "yakinda", ozet: "Dosya sistemi, süreçler, betik yazma. Siber güvenlik lablarının devamı için temel.", olcu: "hazırlanıyor" },
    { id: "ag", ad: "Ağ Temelleri", tur: "lab", durum: "yakinda", ozet: "IP, port, DNS, HTTP. Bir isteğin tarayıcıdan sunucuya yolculuğu.", olcu: "hazırlanıyor" },
    { id: "veri", ad: "Veri Analizi", tur: "dil", durum: "yakinda", ozet: "Python ile tabloları okumak, temizlemek, özetlemek ve grafiğe dökmek.", olcu: "hazırlanıyor" },
    { id: "vt", ad: "Veritabanları ve SQL", tur: "lab", durum: "yakinda", ozet: "Tablolar, sorgular, birleştirmeler. Şu an Backend parkurunun içinde; ayrı bir yol olacak.", olcu: "hazırlanıyor" }
  ];

  /* Bir adımın geçilip geçilmediği: olay = { satir, sonuc: {cikti, hata}, bayrak } */
  function gecti(adim, olay, kabuk) {
    const g = adim.gec;
    if (g.bayrak) return (olay.bayrak || "").trim() === g.bayrak;
    if (olay.bayrak) return false;
    if (g.durum) return !!g.durum(kabuk);
    if (g.komut) return new RegExp(g.komut).test(olay.satir || "") && (g.hataOlsa || !(olay.sonuc && olay.sonuc.hata));
    if (g.cikti) return new RegExp(g.cikti, "m").test((olay.sonuc && olay.sonuc.cikti) || "");
    return false;
  }
  const api = { LABLAR, ALANLAR, gecti };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  kok.KD_LABLAR = api;
})(typeof window !== "undefined" ? window : globalThis);
