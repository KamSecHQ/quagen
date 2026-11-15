/* QUAGEN — lab içerikleri. Her lab: sahte bir dosya sistemi + KAM'in anlattığı adımlar.
 * Adım: { k: [KAM mesajları], gorev, ipucu, cozum: [komutlar], gec: koşul }
 * Koşul türleri: { komut: "regex" } başarılı bir komut eşleşince · { cikti: "regex" } çıktı eşleşince
 *                { bayrak: "QG{…}" } öğrenci bayrağı girince · { durum: (kabuk) => bool } dosya sistemi istenen hâle gelince
 * ek: lab bitince açılan "Kendin dene" görevleri; anlatımsız ve isteğe bağlı: { gorev, cozum: [komutlar], gec } */
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

  const TARAYICI = "198.51.100.200";
  const webKayit = (() => {
    const l = []; let sn = 0;
    const t = () => { sn += 3; return `[12/Nov/2026:04:${String(10 + Math.floor(sn / 60)).padStart(2, "0")}:${String(sn % 60).padStart(2, "0")}]`; };
    const satir = (ip, yol, kod, boyut) => l.push(`${ip} - - ${t()} "GET ${yol} HTTP/1.1" ${kod} ${boyut}`);
    const normal = ["/index.html", "/hakkinda.html", "/stil.css", "/logo.png", "/iletisim.html"], ziyaretci = ["192.0.2.31", "192.0.2.87", "203.0.113.5"];
    for (let i = 0; i < 9; i++) satir(ziyaretci[i % 3], normal[i % 5], 200, 900 + i * 37);
    ["/admin", "/wp-login.php", "/.env", "/phpmyadmin", "/config.php", "/backup.sql", "/.git/config", "/admin.php", "/login", "/test.php", "/db.sql", "/sifre.txt"].forEach((y, i) => { satir(TARAYICI, y, 404, 153); if (i % 4 === 1) satir(ziyaretci[i % 3], normal[i % 5], 200, 1200); });
    satir(TARAYICI, "/yedek.zip", 200, 48211);
    satir("192.0.2.31", "/olmayan-sayfa.html", 404, 153);
    for (let i = 0; i < 4; i++) satir(ziyaretci[i % 3], normal[(i + 2) % 5], 200, 700 + i * 51);
    return l.join("\n") + "\n";
  })();


  /* Linux yolu için sipariş tablosu: her yüklemede aynı içerik */
  const URUNLER = ["kalem", "defter", "silgi", "kalem", "cetvel", "kalem", "defter", "kalem", "boya", "defter", "kalem"];
  const siparis = (() => {
    const l = ["no,sehir,urun,durum"], sehir = ["ankara", "izmir", "bursa", "adana", "konya"];
    for (let i = 1; i <= 60; i++) l.push(`${1000 + i},${sehir[(i * 3) % 5]},${URUNLER[(i * 7) % URUNLER.length]},${i % 9 === 4 ? "iptal" : i % 5 === 0 ? "bekliyor" : "teslim"}`);
    return l.join("\n") + "\n";
  })();
  const IPTAL = siparis.split("\n").filter((x) => /,iptal$/.test(x)).length;
  const LX2_BAYRAK = `QG{kalem_${IPTAL}}`;
  const var_ = (k, yol) => !!k.dosya(yol);
  const metin = (k, yol) => ((k.dosya(yol) || {}).icerik || "");


  /* Ağ Temelleri labları aynı küçük ağı paylaşır: bir ev ağı, bir okul sunucusu, bir arşiv makinesi. */
  const AG = {
    ben: "192.168.1.25", gecit: "192.168.1.1", dnsSunucu: "192.168.1.1",
    dns: { "okul.lab": "10.0.0.10", "arsiv.lab": "10.0.0.42", "posta.lab": "10.0.0.25", "yazici.lab": "192.168.1.60" },
    makineler: {
      "192.168.1.1": { ms: 1, portlar: { 53: "dns", 80: "http" }, web: { 80: { "/": { govde: "Ağ geçidi yönetim sayfası\n" } } } },
      "192.168.1.60": { sessiz: true },
      "10.0.0.25": { ms: 21, portlar: { 25: "smtp" } },
      "10.0.0.42": { ms: 18, portlar: { 22: "ssh" } },
      "10.0.0.10": {
        ms: 12, sunucu: "nginx/1.24", portlar: { 22: "ssh", 80: "http", 8080: "http-alt" },
        web: {
          80: {
            "/": { govde: "<h1>Okul Lab</h1>\n<p>Duyurular icin /duyuru.html sayfasina bakin.</p>\n" },
            "/duyuru.html": { govde: "<h1>Duyurular</h1>\n<p>Sinav takvimi yakinda.</p>\n" },
            "/robots.txt": { tur: "text/plain", govde: "User-agent: *\nDisallow: /yonetim\nDisallow: /yedek/\n" },
            "/yonetim": { kod: 403, govde: "403 Yasak: bu sayfa icin yetkin yok.\n" },
            "/yedek/notlar.txt": { tur: "text/plain", govde: "Yedek notlari\nBu dosya herkese acik kalmis.\nQG{robots_gizlemez_isaret_eder}\n" },
            "/eski": { kod: 301, govde: "", basliklar: { Location: "/duyuru.html" } }
          },
          8080: { "/": { tur: "text/plain", govde: "Deneme sunucusu. Kapatilmasi unutulmus.\nQG{acik_port_acik_kapi}\n" } }
        }
      }
    }
  };


  /* Sorun giderme labı için ağ: üç site, üçü de farklı bir nedenle açılmıyor. */
  const AG_ARIZA = {
    ben: "192.168.1.25", gecit: "192.168.1.1", dnsSunucu: "192.168.1.1",
    dns: { "haber.lab": "10.0.0.31", "forum.lab": "10.0.0.32", "depo.lab": "10.0.0.33" },
    makineler: {
      "192.168.1.1": { ms: 1, portlar: { 53: "dns" } },
      "10.0.0.31": { sessiz: true },
      "10.0.0.32": { ms: 16, portlar: { 22: "ssh" } },
      "10.0.0.33": { ms: 19, sunucu: "nginx/1.24", portlar: { 80: "http" }, web: { 80: { "/": { govde: "<h1>Depo</h1>\n<p>Belgeler /belgeler/ altinda.</p>\n" }, "/belgeler": { govde: "kilavuz.txt\n" }, "/belgeler/kilavuz.txt": { tur: "text/plain", govde: "Ariza giderme sirasi: isim, makine, port, sayfa.\nQG{isim_makine_port_sayfa}\n" } } } }
    }
  };

  /* Yönlendirme labı için ağ: kısa adres bir belge sunucusuna, o da başka bir yola ve porta yönlendirir. */
  const AG_TASINDI = {
    ben: "192.168.1.25", gecit: "192.168.1.1", dnsSunucu: "192.168.1.1",
    dns: { "kisa.lab": "10.0.0.50", "belge.lab": "10.0.0.51" },
    makineler: {
      "192.168.1.1": { ms: 1, portlar: { 53: "dns" } },
      "10.0.0.50": { ms: 14, sunucu: "nginx/1.24", portlar: { 80: "http" }, web: { 80: { "/": { govde: "Kisa adres hizmeti\n" }, "/r/kilavuz": { kod: 301, govde: "", basliklar: { Location: "http://belge.lab/kilavuz" } } } } },
      "10.0.0.51": {
        ms: 17, sunucu: "nginx/1.24", portlar: { 80: "http", 8080: "http-alt" },
        web: {
          80: { "/": { govde: "<h1>Belge sunucusu</h1>\n" }, "/kilavuz": { kod: 301, govde: "", basliklar: { Location: "/v2/kilavuz.txt" } }, "/v2/kilavuz.txt": { kod: 301, govde: "", basliklar: { Location: "http://belge.lab:8080/v2/kilavuz.txt" } } },
          8080: { "/v2/kilavuz.txt": { tur: "text/plain", govde: "Kilavuz, surum 2\nYonlendirme zinciri: kisa adres, yeni yol, yeni port.\nQG{location_basligini_izle}\n" } }
        }
      }
    }
  };

  /* Bütünlük labı: yayıncının verdiği özetler. ayar.conf indirildikten sonra değiştirilmiş, özeti tutmuyor. */
  const OZET = {
    rapor: "9e167b0ef16a79e43b74157c2606320caca5ec97fd489d69569754afcb9bf86f",
    kur: "f2ea69b16fdde7b923bd0f0e44261ab87aff0820a375bf9fad2f5aacd263d77e",
    ayar: "f05b45e453f11ca7c1ea1ad2c899964325f7ce0677c6ec29c8a15a4b0537ddf1"
  };
  const OZET_ASIL = { rapor: "Haftalik rapor\nSunucu: 3 gun kesintisiz\nYedek: tamam\n", kur: "# kurulum betigi\nmkdir uygulama\necho Kurulum bitti\n", ayar: "port=8080\nyonetici=ayse\ngunluk=acik\n" };

  /* Envanter labı için ağ: dört makine, biri kapalı, biri eski ve şifresiz bir hizmeti açık bırakmış. */
  const AG_ENVANTER = {
    ben: "192.168.1.25", gecit: "192.168.1.1", dnsSunucu: "192.168.1.1",
    dns: { "web.lab": "10.0.0.61", "dosya.lab": "10.0.0.62", "eski.lab": "10.0.0.63", "yazici.lab": "10.0.0.64" },
    makineler: {
      "192.168.1.1": { ms: 1, portlar: { 53: "dns" } },
      "10.0.0.61": { ms: 11, sunucu: "nginx/1.24", portlar: { 22: "ssh", 80: "http" }, web: { 80: { "/": { govde: "<h1>Web sunucusu</h1>\n" } } } },
      "10.0.0.62": { ms: 15, portlar: { 21: "ftp", 22: "ssh" } },
      "10.0.0.63": { ms: 23, sunucu: "Apache/2.2", portlar: { 23: "telnet", 80: "http" }, web: { 80: { "/": { tur: "text/plain", govde: "Eski yonetim paneli (2011)\nBu makine telnet ile yonetiliyor; telnet parolayi sifrelemeden gonderir.\nQG{sifresiz_hizmeti_kapat}\n" } } } },
      "10.0.0.64": { sessiz: true }
    }
  };

  /* Parola labı: özetler echo ile üretilmiş gibi satır sonu dahil hesaplanmıştır. */
  const PAROLA = { zayif: "e150a1ec81e8e93e1eae2c3a77e66ec6dbd6a3b460f89c1d08aecf422ee401a0", kedi: "d48f7a4f25c36c72beb6a623d116899dc5eb3a4d2409969ed6923f80c33d7cee", guclu: "a2b4d99aae84d198a8b33d4a17b38ce67a1f1b8c65d7fea8d3db5a9a5a0c0a36", futbol: "833dcad85276b200697427f80b1d6ac31fab7081144a800979a7c0af1b511d03", tAli: "f0f09cb2e74a794d0bbcb86638f9703832008ebb48c30fd3decb1f462ccce6ef", tEce: "fb9db759af04fb0a2f2ed1a0a33958ec5ea69a396b1b244eed64005f92fc0dbd", tCan: "008abb8c5d75f81617436054fd24769755b839d3876fa6cf1c797ece366e5034", tDeniz: "3095759d09187434a2bc838e2b1d945540d6ba38d19f58b0c49a9f089d3aa526", tMert: "f2fae2447dc6bf2a77ec9b863bb1164be4b2c76e08835938c9e9907f0158aa63", tOkan: "cc0671573566ede501e101e4e48e05662d90e39896a6d1ab277833d19a2a599d" };

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
      kapanis: "Dört komutla bir dosya sisteminde iz sürebiliyorsun: `pwd`, `ls`, `cd`, `cat`. Gerçek bir incelemede de ilk yapılan budur.",
      ek: [{ gorev: "Ev dizinine dön ve indirilenler klasörünün içini listele.", cozum: ["cd", "ls indirilenler"], gec: { cikti: "resim\\.png" } }, { gorev: "belgeler klasörünü gizli dosyaları ve izinleriyle birlikte listele.", cozum: ["ls -la ~/belgeler"], gec: { cikti: "^d\\S+ .*\\.gizli/$" } }]
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
      kapanis: "Az önce gerçek bir olay incelemesinin küçük bir kopyasını yaptın: kaydı oku, ara, say, sırala, sonuca var. Savunma tarafında çıkarılacak ders de belli: zayıf parola ve sınırsız deneme hakkı.",
      ek: [{ gorev: "Var olmayan kullanıcı adlarıyla (invalid) yapılan deneme sayısını bul.", cozum: ["grep -c invalid /var/log/auth.log"], gec: { cikti: "^12\\n(?![\\s\\S])" } }, { gorev: "Saldırganın içeri girdikten sonra sudo ile çalıştırdığı komutu bul.", cozum: ["grep sudo /var/log/auth.log"], gec: { cikti: "COMMAND=/bin/cat /etc/shadow" } }]
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
      kapanis: "Bundan sonra garip görünen bir metinle karşılaştığında ilk soracağın şey: bu kodlama mı, şifreleme mi? Sonu `=` ile bitiyorsa Base64, yalnızca 0-9 a-f ise onaltılık olabilir.",
      ek: [{ gorev: "Kendi yazdığın bir sözcüğü Base64'e çevir, çıkan metni base64 -d ile geri aç.", cozum: ["echo selam | base64", "echo c2VsYW0K | base64 -d"], gec: { komut: "\\|\\s*base64\\s+-d\\s*$" } }]
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
      kapanis: "Buna **en az yetki ilkesi** denir: herkes yalnızca işini yapmasına yetecek kadar izne sahip olmalı. Sızıntıların önemli bir kısmı, herkese açık bırakılmış bir dosyayla başlar.",
      ek: [{ gorev: "denetle.sh betiğini yalnızca sahibinin okuyup çalıştırabileceği hâle getir (700).", cozum: ["chmod 700 denetle.sh"], gec: { durum: (k) => (k.dosya("/home/ogrenci/denetle.sh") || {}).mod === "700" } }]
    },
    {
      id: "sg5", alan: "siber", no: 5, baslik: "Kayıp dosyanın peşinde", seviye: "Başlangıç", sure: 20,
      ozet: "Bir sistemde ne nerede durur? find ve grep -r ile koca bir dosya ağacında aradığını bul; unutulmuş bir yedekteki parolayı ortaya çıkar.",
      kazanim: ["find -name, -type", "grep -r ile içerik arama", "unutulmuş yedekler neden tehlikeli"],
      dosyalar: {
        "/home/ogrenci/notlar.txt": "Sunucuda eski bir yedek kalmış olabilir. Bulup raporla.\n",
        "/home/ogrenci/belgeler/liste.txt": "süt\nekmek\n",
        "/var/www/html/index.html": "<h1>Şirket sitesi</h1>\n",
        "/var/www/html/stil.css": "body { margin: 0; }\n",
        "/var/backups/site.bak": "# site yedeği 2024\ndb_kullanici=site\ndb_parola=Yaz2024!\ndb_sunucu=localhost\n",
        "/opt/arac/ayar.conf": "dil=tr\ntema=koyu\n",
        "/etc/hosts": "127.0.0.1 localhost\n",
        "/tmp/.onbellek/bayrak": "QG{yedekler_de_gizli_tutulur}\n",
        "/tmp/gecici.log": "geçici dosya\n"
      },
      adimlar: [
        { k: ["Şimdiye kadar hep bildiğin bir klasörde çalıştın. Gerçekte bir sistemde on binlerce dosya vardır ve aradığının nerede olduğunu bilmezsin.", "`find` bir klasörden başlayıp altındaki her şeyi tarar. Ev dizinindeki bütün `.txt` dosyalarını bulalım: `find /home -name \"*.txt\"`", "Yıldız “herhangi bir şey” demek: adı ne olursa olsun, sonu `.txt` olanlar."], gorev: "/home altındaki .txt dosyalarını bul.", ipucu: "`find /home -name \"*.txt\"`", cozum: ["find /home -name \"*.txt\""], gec: { cikti: "liste\\.txt" } },
        { k: ["Nottaki görev: eski bir yedek aramak. Yedek dosyalarının adı çoğu zaman `.bak` ile biter. Bu kez bütün sistemi, yani `/` kökünden başlayarak tara: `find / -name \"*.bak\"`"], gorev: "Sistemdeki .bak dosyalarını bul.", ipucu: "`find / -name \"*.bak\"`", cozum: ["find / -name \"*.bak\""], gec: { cikti: "site\\.bak" } },
        { k: ["`/var/backups/site.bak`. Birisi siteyi taşırken yedek almış ve silmeyi unutmuş. Böyle dosyalar saldırganların ilk aradığı şeydir, çünkü içlerinde çoğu zaman parola olur.", "Dosya adını bilmeseydik de bulabilirdik: `grep -r` bir klasördeki **bütün dosyaların içinde** arar. Dene: `grep -r parola /var`"], gorev: "/var altındaki dosyaların içinde “parola” geçen satırları bul.", ipucu: "`grep -r parola /var` (r: alt klasörlerle birlikte)", cozum: ["grep -r parola /var"], gec: { cikti: "db_parola" } },
        { k: ["Veritabanı parolası düz yazıyla duruyor. Rapora yazılacak ilk bulgu bu.", "Bir şey daha: saldırganlar kendi dosyalarını gizli klasörlere koyar. Adı nokta ile başlayan **klasörleri** arayalım. `-type d` yalnızca klasörleri getirir: `find / -type d -name \".*\"`"], gorev: "Sistemdeki gizli klasörleri bul.", ipucu: "`find / -type d -name \".*\"`", cozum: ["find / -type d -name \".*\""], gec: { cikti: "/tmp/\\.onbellek" } },
        { k: ["`/tmp/.onbellek`: geçici dosyalar klasörünün içinde gizli bir klasör. İçine bak ve bulduğunu gönder."], gorev: "Gizli klasördeki bayrağı bul ve gönder.", ipucu: "`ls -a /tmp/.onbellek`, sonra `cat /tmp/.onbellek/bayrak`", cozum: ["ls -a /tmp/.onbellek", "cat /tmp/.onbellek/bayrak", "bayrak QG{yedekler_de_gizli_tutulur}"], gec: { bayrak: "QG{yedekler_de_gizli_tutulur}" } }
      ],
      kapanis: "İki arama biçimi öğrendin: `find` ada ve türe göre, `grep -r` içeriğe göre arar. Savunma tarafındaki ders: yedekler de asıl dosyalar kadar korunmalı, işi biten yedek silinmeli.",
      ek: [{ gorev: "Sistemdeki bütün .conf dosyalarını bul.", cozum: ["find / -name \"*.conf\""], gec: { cikti: "^/opt/arac/ayar\\.conf$" } }]
    },
    {
      id: "sg6", alan: "siber", no: 6, baslik: "Web sunucusunun günlüğü", seviye: "Başlangıç", sure: 25,
      ozet: "Bir web sitesine gelen her istek kayda geçer. Kayıttan siteyi tarayan adresi, neleri denediğini ve neyi ele geçirdiğini çıkar.",
      kazanim: ["HTTP durum kodları (200, 404)", "tarama saldırısını tanımak", "wc, cut, sort, uniq ile özet çıkarma"],
      dosyalar: { "/var/log/nginx/access.log": webKayit, "/home/ogrenci/gorev.txt": "Olay: site yöneticisi gece trafiğinde bir tuhaflık fark etti.\nKayıt: /var/log/nginx/access.log\n" },
      adimlar: [
        { k: ["Bir web sitesini her açtığında tarayıcın sunucuya bir **istek** gönderir. Sunucu her isteği bir satır olarak kaydeder.", "İlk birkaç satıra bak: `head -5 /var/log/nginx/access.log`"], gorev: "Kaydın ilk satırlarını gör.", ipucu: "`head -5 /var/log/nginx/access.log`", cozum: ["head -5 /var/log/nginx/access.log"], gec: { cikti: "GET /" } },
        { k: ["Bir satırı soldan sağa oku: isteği yapan **adres**, zaman, istenen **sayfa** ve sunucunun cevabı olan **durum kodu**.", "İki kodu bilmen yeter: `200` “buyur, işte sayfa”, `404` “böyle bir sayfa yok” demek.", "Kaç istek gelmiş? `wc -l` satırları sayar: `wc -l /var/log/nginx/access.log`"], gorev: "Toplam istek sayısını bul.", ipucu: "`wc -l /var/log/nginx/access.log`", cozum: ["wc -l /var/log/nginx/access.log"], gec: { cikti: "^\\d+ " } },
        { k: ["Normal bir ziyaretçi var olan sayfalara tıklar; arada bir yanlış adres yazıp 404 alır. Çok sayıda 404 ise birinin **olmayan sayfaları denediğini** gösterir.", "404 alan istekleri listele: `grep \" 404 \" /var/log/nginx/access.log`"], gorev: "404 ile sonuçlanan istekleri listele.", ipucu: "`grep \" 404 \" /var/log/nginx/access.log` (boşluklar önemli; yoksa içinde 404 geçen başka sayılar da gelir)", cozum: ["grep \" 404 \" /var/log/nginx/access.log"], gec: { cikti: "wp-login" } },
        { k: ["`/admin`, `/wp-login.php`, `/.env`, `/backup.sql` ... Bunlar tesadüf değil; yaygın yönetim sayfalarını ve unutulmuş dosyaları sırayla deneyen bir **tarama aracı**.", "Hangi adresten geldiğini say. Adres her satırın ilk parçası: `grep \" 404 \" /var/log/nginx/access.log | cut -d ' ' -f 1 | sort | uniq -c | sort -rn`"], gorev: "404 isteklerini adrese göre say.", ipucu: "Önceki komutun sonuna `| cut -d ' ' -f 1 | sort | uniq -c | sort -rn` ekle.", cozum: ["grep \" 404 \" /var/log/nginx/access.log | cut -d ' ' -f 1 | sort | uniq -c | sort -rn"], gec: { cikti: "^\\s+12 198\\.51\\.100\\.200" } },
        { k: ["12 deneme tek bir adresten: `198.51.100.200`. Diğer adresin tek 404'ü sıradan bir yazım hatası.", "Asıl önemli soru: denemelerden biri tuttu mu? Bu adresin **200** alan isteğine bak: `grep 198.51.100.200 /var/log/nginx/access.log | grep \" 200 \"`"], gorev: "Tarayıcının başarılı olduğu isteği bul.", ipucu: "`grep 198.51.100.200 /var/log/nginx/access.log | grep \" 200 \"`", cozum: ["grep 198.51.100.200 /var/log/nginx/access.log | grep \" 200 \""], gec: { cikti: "yedek\\.zip" } },
        { k: ["`/yedek.zip` indirilmiş: 48 bin baytlık bir dosya. Sitenin yedeği herkese açık bir klasörde unutulmuş ve tarama onu bulmuş.", "Bayrak, indirilen dosyanın adı: `QG{dosya_adi}` biçiminde gönder."], gorev: "İndirilen dosyanın adını bayrak olarak gönder.", ipucu: "Dosya adı yedek.zip.", cozum: ["bayrak QG{yedek.zip}"], gec: { bayrak: "QG{yedek.zip}" } }
      ],
      kapanis: "Bir taramanın izi böyle görünür: kısa sürede, tek adresten, art arda 404. Önceki labda unutulmuş yedeği sistemin içinde bulmuştun; burada aynı hatanın dışarıdan nasıl bulunduğunu gördün.",
      ek: [{ gorev: "Sunucuya en çok istek yapan üç adresi, istek sayılarıyla birlikte listele.", cozum: ["cut -d ' ' -f 1 /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -n 3"], gec: { cikti: "^\\s*\\d+ 198\\.51\\.100\\.200\\n[^\\n]+\\n[^\\n]+\\n(?![\\s\\S])" } }]
    }
    ,{
      id: "lx1", alan: "linux", no: 1, baslik: "Dosya ve klasör kurmak", seviye: "Başlangıç", sure: 20,
      ozet: "Okumayı biliyorsun; şimdi yazma sırası. Klasör aç, dosya oluştur, içine yaz, kopyala, taşı ve sil.",
      kazanim: ["mkdir, touch", "echo ile > ve >>", "cp, mv, rm"],
      dosyalar: {
        "/home/ogrenci/gorev.txt": "Bir proje klasörü kurulacak. Adımları KAM anlatıyor.\n",
        "/home/ogrenci/taslak.txt": "Eski taslak. Artık gerekmiyor ama önce proje klasörüne alınacak.\n",
        "/home/ogrenci/denetle.sh": { icerik: "# proje klasörünü denetler\n", mod: "755", betik: (k) => {
          const e = [];
          if (!var_(k, "/home/ogrenci/proje")) e.push("proje klasörü yok");
          if (metin(k, "/home/ogrenci/proje/notlar.txt").trim().split("\n").filter(Boolean).length < 2) e.push("proje/notlar.txt içinde iki satır olmalı");
          if (!var_(k, "/home/ogrenci/proje/yedek.txt")) e.push("proje/yedek.txt yok");
          if (var_(k, "/home/ogrenci/taslak.txt") || var_(k, "/home/ogrenci/proje/eski.txt")) e.push("taslak hâlâ duruyor");
          return e.length ? "Eksikler:\n- " + e.join("\n- ") + "\n" : "Her şey yerinde.\nQG{kur_yaz_tasi_sil}\n";
        } }
      },
      adimlar: [
        { k: ["Önceki lablarda hep okudun. Bu labda dosya sistemini **değiştireceksin**.", "Yeni bir klasör `mkdir` ile açılır: `mkdir proje`. Sonra `ls` ile gör."], gorev: "proje adında bir klasör aç.", ipucu: "`mkdir proje`", cozum: ["mkdir proje"], gec: { durum: (k) => (k.dosya("/home/ogrenci/proje") || {}).tur === "d" } },
        { k: ["`echo` verdiğin metni ekrana yazar. Sonuna `>` koyarsan ekrana değil, **dosyaya** yazar.", "Dene: `echo ilk not > proje/notlar.txt`. Dosya yoksa oluşur."], gorev: "proje/notlar.txt dosyasına bir satır yaz.", ipucu: "`echo ilk not > proje/notlar.txt`", cozum: ["echo ilk not > proje/notlar.txt"], gec: { durum: (k) => metin(k, "/home/ogrenci/proje/notlar.txt").trim().length > 0 } },
        { k: ["Dikkat: tek `>` dosyayı **silip baştan** yazar. Sona eklemek için çift `>>` kullanılır.", "`echo ikinci not >> proje/notlar.txt` yaz, sonra `cat proje/notlar.txt` ile iki satırı gör."], gorev: "Aynı dosyanın sonuna ikinci bir satır ekle.", ipucu: "`echo ikinci not >> proje/notlar.txt` (iki tane >)", cozum: ["echo ikinci not >> proje/notlar.txt"], gec: { durum: (k) => metin(k, "/home/ogrenci/proje/notlar.txt").trim().split("\n").filter(Boolean).length >= 2 } },
        { k: ["Önemli bir dosyayı değiştirmeden önce kopyası alınır. `cp kaynak hedef`: `cp proje/notlar.txt proje/yedek.txt`."], gorev: "notlar.txt dosyasının yedek.txt adında bir kopyasını al.", ipucu: "`cp proje/notlar.txt proje/yedek.txt`", cozum: ["cp proje/notlar.txt proje/yedek.txt"], gec: { durum: (k) => var_(k, "/home/ogrenci/proje/yedek.txt") } },
        { k: ["`mv` taşır; aynı komut ad da değiştirir, çünkü ad değiştirmek “aynı yere başka adla taşımak”tır.", "Ev dizinindeki `taslak.txt` dosyasını proje klasörüne `eski.txt` adıyla taşı."], gorev: "taslak.txt dosyasını proje/eski.txt olarak taşı.", ipucu: "`mv taslak.txt proje/eski.txt`", cozum: ["mv taslak.txt proje/eski.txt"], gec: { durum: (k) => var_(k, "/home/ogrenci/proje/eski.txt") && !var_(k, "/home/ogrenci/taslak.txt") } },
        { k: ["Son olarak silme: `rm`. Terminalde **çöp kutusu yoktur**; silinen geri gelmez. Gerçek sistemde bu komutu yazmadan önce iki kez bak.", "`rm proje/eski.txt`"], gorev: "proje/eski.txt dosyasını sil.", ipucu: "`rm proje/eski.txt`", cozum: ["rm proje/eski.txt"], gec: { durum: (k) => !var_(k, "/home/ogrenci/proje/eski.txt") && var_(k, "/home/ogrenci/proje") } },
        { k: ["Ev dizininde `denetle.sh` adında bir betik var; kurduğun yapıyı denetler. `./denetle.sh` ile çalıştır. Eksik varsa söyler, yoksa bayrağı verir."], gorev: "Denetleme betiğini çalıştır ve bayrağı gönder.", ipucu: "`./denetle.sh` yaz. Eksik sayarsa önceki adımlara bak.", cozum: ["./denetle.sh", "bayrak QG{kur_yaz_tasi_sil}"], gec: { bayrak: "QG{kur_yaz_tasi_sil}" } }
      ],
      kapanis: "Bir çalışma alanını baştan kurabiliyorsun: `mkdir`, `echo >`, `>>`, `cp`, `mv`, `rm`. `>` ile `>>` farkını aklında tut; en çok veri kaybettiren hata budur.",
      ek: [{ gorev: "arsiv adında yeni bir klasör aç ve proje/notlar.txt dosyasını içine kopyala.", cozum: ["mkdir arsiv", "cp proje/notlar.txt arsiv/notlar.txt"], gec: { durum: (k) => var_(k, "/home/ogrenci/arsiv/notlar.txt") && var_(k, "/home/ogrenci/proje/notlar.txt") } }]
    },
    {
      id: "lx2", alan: "linux", no: 2, baslik: "Büyük dosyayı okumadan okumak", seviye: "Başlangıç", sure: 25,
      ozet: "Altmış satırlık bir sipariş tablosu var. Tek tek okumadan kaç satır olduğunu, kaçının iptal edildiğini ve en çok hangi ürünün satıldığını bul.",
      kazanim: ["wc -l, head, tail", "grep -c ile sayma", "cut, sort, uniq -c zinciri"],
      dosyalar: { "/home/ogrenci/siparis.csv": siparis, "/home/ogrenci/gorev.txt": "siparis.csv: no,sehir,urun,durum\nBayrak biçimi: QG{enCokSatanUrun_iptalSayisi}  örnek: QG{silgi_3}\n" },
      adimlar: [
        { k: ["Gerçek dosyalar binlerce satır olur; `cat` ile açarsan ekran akar gider. Önce **boyutuna** bakılır.", "`wc -l siparis.csv` satır sayısını verir."], gorev: "Dosyada kaç satır olduğunu öğren.", ipucu: "`wc -l siparis.csv`", cozum: ["wc -l siparis.csv"], gec: { cikti: "^\\s*61\\b" } },
        { k: ["61 satır: biri başlık, 60'ı sipariş. Başlığı ve ilk kayıtları görmek için `head`: `head -n 3 siparis.csv`."], gorev: "Dosyanın ilk üç satırına bak.", ipucu: "`head -n 3 siparis.csv`", cozum: ["head -n 3 siparis.csv"], gec: { komut: "^head\\b.*siparis\\.csv" } },
        { k: ["Sütunlar virgülle ayrılmış: no, şehir, ürün, durum. Son kayıtlar için `tail`: `tail -n 2 siparis.csv`."], gorev: "Son iki satıra bak.", ipucu: "`tail -n 2 siparis.csv`", cozum: ["tail -n 2 siparis.csv"], gec: { komut: "^tail\\b.*siparis\\.csv" } },
        { k: ["Kaç sipariş iptal edilmiş? `grep iptal siparis.csv` hepsini listeler; saymak için `-c` eklenir.", "`grep -c iptal siparis.csv`. Çıkan sayıyı aklında tut."], gorev: "İptal edilen siparişleri say.", ipucu: "`grep -c iptal siparis.csv`", cozum: ["grep -c iptal siparis.csv"], gec: { cikti: "^" + IPTAL + "$" } },
        { k: ["Şimdi yalnızca ürün sütununu alalım. `cut -d, -f3` “virgülle böl, üçüncü parçayı ver” demek.", "`cut -d, -f3 siparis.csv | head -n 5`"], gorev: "Üçüncü sütunu (ürün) ayır.", ipucu: "`cut -d, -f3 siparis.csv`", cozum: ["cut -d, -f3 siparis.csv"], gec: { komut: "^cut\\b.*-f ?3" } },
        { k: ["Aynı ürünleri saymak için üç komut zincirlenir: önce `sort` aynıları yan yana getirir, `uniq -c` her birini sayar, son `sort -n` sayıya göre dizer.", "`cut -d, -f3 siparis.csv | sort | uniq -c | sort -n` yaz. En alttaki en çok satandır."], gorev: "Her üründen kaç tane satıldığını say.", ipucu: "`cut -d, -f3 siparis.csv | sort | uniq -c | sort -n`", cozum: ["cut -d, -f3 siparis.csv | sort | uniq -c | sort -n"], gec: { cikti: "\\d+ kalem" } },
        { k: ["İki şeyi de biliyorsun: en çok satan ürün ve iptal sayısı. `gorev.txt` bayrağın biçimini söylüyor. Bayrağı kendin kur ve gönder."], gorev: "Bayrağı QG{urun_iptalSayisi} biçiminde gönder.", ipucu: "`cat gorev.txt` ile biçime bak. Ürün: sayımın en altındaki. Sayı: grep -c sonucu.", cozum: ["bayrak " + LX2_BAYRAK], gec: { bayrak: LX2_BAYRAK } }
      ],
      kapanis: "Bir dosyayı açmadan özetleyebiliyorsun: `wc` boyutu, `head` ve `tail` uçları, `grep -c` sayıyı, `cut | sort | uniq -c` dağılımı verir. Kayıt incelemede de aynı zincir kullanılır.",
      ek: [{ gorev: "Yalnızca ankara siparişlerini ankara.csv dosyasına yaz.", cozum: ["grep ankara siparis.csv > ankara.csv"], gec: { durum: (k) => { const l = metin(k, "/home/ogrenci/ankara.csv").split("\n").filter(Boolean); return l.length > 0 && l.every((x) => /,ankara,/.test(x)); } } }]
    },
    {
      id: "lx3", alan: "linux", no: 3, baslik: "İlk betiğin", seviye: "Başlangıç", sure: 20,
      ozet: "Aynı komutları her gün elle yazmak yerine bir dosyaya koyup tek adımda çalıştır. Betik yaz, çalıştırma izni ver, çalıştır.",
      kazanim: ["betik dosyası (.sh)", "chmod +x", "./ ile çalıştırma"],
      dosyalar: {
        "/home/ogrenci/liste.txt": "elma\narmut\nkiraz\nmuz\n",
        "/home/ogrenci/.kasa/bayrak.txt": "QG{yaz_izin_ver_calistir}\n",
        "/home/ogrenci/anahtar.sh": { icerik: "# kasayı açar\ncat .kasa/bayrak.txt\n", mod: "644" }
      },
      adimlar: [
        { k: ["**Betik**, içinde komutlar yazan düz bir metin dosyasıdır. Çalıştırınca satırlar sırayla işlenir.", "İlk betiğini `echo` ile yaz: `echo 'echo Merhaba' > selam.sh`. Tek tırnak, içteki komutun şimdi değil, betik çalışınca işlemesini sağlar."], gorev: "İçinde tek komut olan selam.sh dosyasını oluştur.", ipucu: "`echo 'echo Merhaba' > selam.sh`", cozum: ["echo 'echo Merhaba' > selam.sh"], gec: { durum: (k) => /echo\s+Merhaba/.test(metin(k, "/home/ogrenci/selam.sh")) } },
        { k: ["Çalıştırmak için başına `./` konur: `./selam.sh`. Dene; hata vereceğini biliyorum, o hatayı görmeni istiyorum."], gorev: "Betiği çalıştırmayı dene.", ipucu: "`./selam.sh`", cozum: ["./selam.sh"], gec: { komut: "^\\./selam\\.sh$", hataOlsa: true } },
        { k: ["“Çalıştırma izni yok.” Linux, bir dosyayı sen izin vermeden program gibi çalıştırmaz. İnternetten inen bir dosyanın kendiliğinden çalışmamasının sebebi de budur.", "İzni `chmod +x selam.sh` ile ver."], gorev: "Betiğe çalıştırma izni ver.", ipucu: "`chmod +x selam.sh`", cozum: ["chmod +x selam.sh"], gec: { komut: "^chmod\\s+(\\+x|7[0-7][0-7])\\s+selam\\.sh$" } },
        { k: ["Şimdi yeniden çalıştır: `./selam.sh`."], gorev: "Betiği çalıştır.", ipucu: "`./selam.sh`", cozum: ["./selam.sh"], gec: { cikti: "^Merhaba$" } },
        { k: ["Betiğe ikinci bir komut ekleyelim. `>>` sona ekliyordu: `echo 'wc -l liste.txt' >> selam.sh`. Sonra yeniden çalıştır; iki komutun çıktısı art arda gelir."], gorev: "Betiğe liste.txt satırlarını sayan komutu ekle ve çalıştır.", ipucu: "`echo 'wc -l liste.txt' >> selam.sh`, sonra `./selam.sh`", cozum: ["echo 'wc -l liste.txt' >> selam.sh", "./selam.sh"], gec: { cikti: "Merhaba\\n\\s*4\\b" } },
        { k: ["Dizinde hazır bir betik daha var: `anahtar.sh`. Önce `cat anahtar.sh` ile **ne yaptığını oku**. Tanımadığın bir betiği okumadan çalıştırmak, güvenlikte yapılan en yaygın hatalardan biridir.", "Zararsız olduğunu gördüysen izin ver, çalıştır, bayrağı gönder."], gorev: "anahtar.sh betiğini oku, çalıştır ve bayrağı gönder.", ipucu: "`cat anahtar.sh`, `chmod +x anahtar.sh`, `./anahtar.sh`", cozum: ["cat anahtar.sh", "chmod +x anahtar.sh", "./anahtar.sh", "bayrak QG{yaz_izin_ver_calistir}"], gec: { bayrak: "QG{yaz_izin_ver_calistir}" } }
      ],
      kapanis: "Betik yazmanın üç adımı: komutları dosyaya koy, `chmod +x` ile izin ver, `./ad.sh` ile çalıştır. Başkasının betiğini çalıştırmadan önce mutlaka oku.",
      ek: [{ gorev: "Argüman alan bir betik yaz: say.sh, adı verilen dosyanın satırlarını saysın ($1). liste.txt ile çalıştır.", cozum: ["echo 'wc -l $1' > say.sh", "chmod +x say.sh", "./say.sh liste.txt"], gec: { komut: "^\\./say\\.sh\\s+liste\\.txt$" } }]
    }
    ,{
      id: "lx4", alan: "linux", no: 4, baslik: "Metni boru hattında dönüştürmek", seviye: "Başlangıç", sure: 20,
      ozet: "Elle tutulmuş dağınık bir isim listesi var: büyük küçük harf karışık, aynı kişi iki kez yazılmış. Komutları uç uca ekleyip temiz bir liste üret.",
      kazanim: ["tr ile harf dönüştürme", "sort ve uniq", "boru hattı kurmak", "sonucu dosyaya yazmak", "rev"],
      dosyalar: {
        "/home/ogrenci/isimler.txt": "DENIZ\nEce\nMERT\nece\nCan\nDENIZ\nmert\nOkan\n",
        "/home/ogrenci/sifre.txt": [..."QG{boru_ile_donustur}"].reverse().join("") + "\n"
      },
      adimlar: [
        { k: ["Önce elimizdekine bakalım: `cat isimler.txt`. Sekiz satır var ama kaç **farklı** kişi olduğunu söylemek zor."], gorev: "isimler.txt dosyasını oku.", ipucu: "`cat isimler.txt`", cozum: ["cat isimler.txt"], gec: { cikti: "DENIZ" } },
        { k: ["`DENIZ` ile `deniz` bilgisayar için farklı metinlerdir. Önce hepsini küçük harfe çevirelim. `tr` bir harf kümesini başkasına çevirir.", "`cat isimler.txt | tr 'A-Z' 'a-z'` yaz. Dik çizgi (boru), soldaki komutun çıktısını sağdakine verir."], gorev: "Bütün isimleri küçük harfe çevir.", ipucu: "`cat isimler.txt | tr 'A-Z' 'a-z'`", cozum: ["cat isimler.txt | tr 'A-Z' 'a-z'"], gec: { cikti: "^deniz\\nece\\nmert\\nece" } },
        { k: ["Şimdi aynı isimler birebir aynı yazılıyor ama dağınık duruyorlar. Hattın sonuna bir boru daha ekle: `| sort`. Yukarı ok tuşu önceki komutu geri getirir."], gorev: "Küçük harfe çevrilmiş listeyi sırala.", ipucu: "`cat isimler.txt | tr 'A-Z' 'a-z' | sort`", cozum: ["cat isimler.txt | tr 'A-Z' 'a-z' | sort"], gec: { cikti: "^can\\ndeniz\\ndeniz" } },
        { k: ["Aynılar artık alt alta. `uniq` art arda gelen aynı satırlardan yalnızca birini bırakır; bu yüzden hep `sort`'tan **sonra** gelir.", "Hattı bir halka daha uzat: `| uniq`."], gorev: "Yinelenen isimleri ele.", ipucu: "`cat isimler.txt | tr 'A-Z' 'a-z' | sort | uniq`", cozum: ["cat isimler.txt | tr 'A-Z' 'a-z' | sort | uniq"], gec: { cikti: "^can\\ndeniz\\nece\\nmert\\nokan\\n$" } },
        { k: ["Beş kişi. Bu sonuç şu an yalnızca ekranda; saklamak için hattın sonuna `> temiz.txt` ekle. Sonra `wc -l temiz.txt` ile say."], gorev: "Temiz listeyi temiz.txt dosyasına yaz.", ipucu: "`cat isimler.txt | tr 'A-Z' 'a-z' | sort | uniq > temiz.txt`", cozum: ["cat isimler.txt | tr 'A-Z' 'a-z' | sort | uniq > temiz.txt"], gec: { durum: (k) => metin(k, "/home/ogrenci/temiz.txt") === "can\ndeniz\nece\nmert\nokan\n" } },
        { k: ["Son bir dönüştürme: `sifre.txt` içindeki bayrak **tersten** yazılmış. `rev` her satırı ters çevirir.", "`rev sifre.txt` ile oku ve bayrağı gönder. Tersten yazmak bir şifreleme değildir; tek komutla çözülür."], gorev: "Ters yazılmış bayrağı çevir ve gönder.", ipucu: "`rev sifre.txt`", cozum: ["rev sifre.txt", "bayrak QG{boru_ile_donustur}"], gec: { bayrak: "QG{boru_ile_donustur}" } }
      ],
      kapanis: "Küçük komutları boruyla uç uca ekleyerek büyük bir iş yaptın: `tr` dönüştürdü, `sort` sıraladı, `uniq` eledi, `>` sakladı. Linux'un çalışma biçimi budur: her komut tek iş yapar, hattı sen kurarsın.",
      ek: [{ gorev: "Kaç farklı isim olduğunu tek komutla say (sort -u aynıları eler).", cozum: ["cat isimler.txt | tr 'A-Z' 'a-z' | sort -u | wc -l"], gec: { cikti: "^5\\n(?![\\s\\S])" } }, { gorev: "isimler.txt ile temiz.txt arasındaki farkı diff ile gör.", cozum: ["diff isimler.txt temiz.txt"], gec: { komut: "^diff\\s+\\S+\\s+\\S+$" } }]
    }
    ,{
      id: "ag1", alan: "ag", no: 1, baslik: "Adresin ve komşuların", seviye: "Başlangıç", sure: 15, ag: AG,
      ozet: "Ağdaki her makinenin bir adresi var. Kendi adresini bul, komşuna seslen, yanıt vermeyen bir makineyi tanı.",
      kazanim: ["IP adresi", "ip addr", "ping ve zaman aşımı", "ağ geçidi"],
      dosyalar: { "/home/ogrenci/gorev.txt": "Bayrak biçimi: QG{kendi_IP_adresin}  örnek: QG{10.1.2.3}\n" },
      adimlar: [
        { k: ["Bir ağda makineler birbirini **IP adresi** ile bulur: noktalarla ayrılmış dört sayı. Posta adresi gibidir; adres yoksa paket teslim edilemez.", "Kendi adresine bak: `ip addr`."], gorev: "Bu makinenin IP adresini öğren.", ipucu: "`ip addr` yaz; `eth0` altındaki `inet` satırına bak.", cozum: ["ip addr"], gec: { cikti: "192\\.168\\.1\\.25" } },
        { k: ["`eth0` ağ kartın, adresin `192.168.1.25`. Aynı satırda bir de **ağ geçidi** yazıyor: `192.168.1.1`. Ev ağından dışarı çıkan her paket önce ona gider; evdeki modem budur.", "Ona ulaşabiliyor muyuz? `ping 192.168.1.1`"], gorev: "Ağ geçidine ping at.", ipucu: "`ping 192.168.1.1`", cozum: ["ping 192.168.1.1"], gec: { cikti: "192\\.168\\.1\\.1 adresinden yanıt" } },
        { k: ["`ping` küçük bir paket yollar ve yanıtı bekler. “%0 kayıp” makinenin ayakta olduğunu, `süre` de paketin gidip gelme süresini söyler.", "Şimdi yanıt vermeyen birine bakalım: `ping -c 2 192.168.1.60`. `-c 2` yalnızca iki paket yolla demek."], gorev: "192.168.1.60 adresine iki paket yolla.", ipucu: "`ping -c 2 192.168.1.60`", cozum: ["ping -c 2 192.168.1.60"], gec: { cikti: "%100 kayıp" } },
        { k: ["“Zaman aşımı, %100 kayıp.” Bu üç şeyden biri demektir: makine kapalı, adres yanlış ya da makine ping'e bilerek yanıt vermiyor. Ping'in sessizliği tek başına “makine yok” anlamına gelmez; bunu aklında tut.", "Uzaktaki bir makineyi dene: `ping -c 2 10.0.0.10`. Süreye dikkat et."], gorev: "10.0.0.10 adresine ping at.", ipucu: "`ping -c 2 10.0.0.10`", cozum: ["ping -c 2 10.0.0.10"], gec: { cikti: "10\\.0\\.0\\.10 adresinden yanıt" } },
        { k: ["Ağ geçidi 1 ms'de, uzaktaki makine 12 ms'de yanıt verdi; paket daha uzun yol gitti.", "`gorev.txt` bayrağın biçimini söylüyor. Kendi adresinle bayrağı kur ve gönder."], gorev: "Bayrağı kendi IP adresinle gönder.", ipucu: "`cat gorev.txt`. Adresin ilk adımda gördüğün `inet` değeri.", cozum: ["bayrak QG{192.168.1.25}"], gec: { bayrak: "QG{192.168.1.25}" } }
      ],
      kapanis: "Üç şey öğrendin: her makinenin bir IP adresi var, dışarıya giden yol ağ geçidinden geçer, `ping` bir makinenin yanıt verip vermediğini söyler. Bir bağlantı sorununda ilk bakılan da budur.",
      ek: [{ gorev: "Ağ geçidine yalnızca bir paket gönder.", cozum: ["ping -c 1 192.168.1.1"], gec: { cikti: "1 paket gönderildi, 1 alındı" } }]
    },
    {
      id: "ag2", alan: "ag", no: 2, baslik: "İsimden adrese: DNS", seviye: "Başlangıç", sure: 20, ag: AG,
      ozet: "İnsanlar isim hatırlar, makineler sayı ister. Bir ismin hangi adrese çıktığını sor, olmayan bir ismin ne döndürdüğünü gör, hosts dosyasının önceliğini fark et.",
      kazanim: ["nslookup", "NXDOMAIN", "/etc/hosts önceliği", "DNS zehirlenmesi fikri"],
      dosyalar: {
        "/etc/hosts": { icerik: "127.0.0.1 localhost\n10.0.0.42 depo.lab\n", sahip: "root", mod: "644" },
        "/home/ogrenci/gorev.txt": "Bayrak biçimi: QG{arsiv.lab adresi}  örnek: QG{10.1.2.3}\n"
      },
      adimlar: [
        { k: ["Tarayıcıya sayı değil isim yazarsın. İsmi adrese çeviren sisteme **DNS** denir; internetin telefon rehberidir.", "Rehbere sor: `nslookup okul.lab`."], gorev: "okul.lab isminin adresini öğren.", ipucu: "`nslookup okul.lab`", cozum: ["nslookup okul.lab"], gec: { cikti: "10\\.0\\.0\\.10" } },
        { k: ["En üstteki `Sunucu` satırı soruyu kimin yanıtladığını gösterir: ağ geçidin. `Adres` satırı yanıtın kendisi.", "Rehberde olmayan bir isim sor: `nslookup olmayan.lab`."], gorev: "Var olmayan bir ismi sorgula.", ipucu: "`nslookup olmayan.lab`", cozum: ["nslookup olmayan.lab"], gec: { komut: "^nslookup\\s+\\S+", hataOlsa: true } },
        { k: ["`NXDOMAIN`: “böyle bir alan adı yok.” Adres çubuğuna yanlış yazdığında tarayıcının verdiği hatanın altında bu yanıt vardır.", "`ping` gibi komutlar ismi kendileri çözer. `ping -c 1 okul.lab` yaz; ilk satırda parantez içindeki adrese bak."], gorev: "okul.lab'e ismiyle ping at.", ipucu: "`ping -c 1 okul.lab`", cozum: ["ping -c 1 okul.lab"], gec: { cikti: "PING okul\\.lab \\(10\\.0\\.0\\.10\\)" } },
        { k: ["DNS'e sorulmadan **önce** bakılan bir dosya var: `/etc/hosts`. Oku: `cat /etc/hosts`."], gorev: "hosts dosyasını oku.", ipucu: "`cat /etc/hosts`", cozum: ["cat /etc/hosts"], gec: { cikti: "depo\\.lab" } },
        { k: ["`depo.lab` rehberde yok ama bu dosyada yazıyor; o yüzden çalışır. Dene: `ping -c 1 depo.lab`.", "Bu dosyayı değiştirebilen biri, bir ismi istediği adrese yönlendirebilir. Zararlı yazılımların banka sitesini sahte adrese çevirmek için dokunduğu yer burasıdır; dosyanın sahibi bu yüzden `root`."], gorev: "depo.lab'e ping at.", ipucu: "`ping -c 1 depo.lab`", cozum: ["ping -c 1 depo.lab"], gec: { cikti: "PING depo\\.lab \\(10\\.0\\.0\\.42\\)" } },
        { k: ["Son görev: `arsiv.lab` hangi adrese çıkıyor? Bul, `gorev.txt` içindeki biçimle bayrağı gönder."], gorev: "arsiv.lab adresini bul ve bayrağı gönder.", ipucu: "`nslookup arsiv.lab`, sonra `cat gorev.txt`.", cozum: ["nslookup arsiv.lab", "bayrak QG{10.0.0.42}"], gec: { bayrak: "QG{10.0.0.42}" } }
      ],
      kapanis: "İsim önce `/etc/hosts` dosyasında, sonra DNS'te aranır. `depo.lab` ile `arsiv.lab` aynı adrese çıktı: bir makinenin birden çok ismi olabilir. Bir site açılmıyorsa `nslookup`, sorunun isimde mi yoksa makinede mi olduğunu ayırır.",
      ek: [{ gorev: "posta.lab isminin hangi adrese çıktığını bul.", cozum: ["nslookup posta.lab"], gec: { cikti: "10\\.0\\.0\\.25" } }]
    },
    {
      id: "ag3", alan: "ag", no: 3, baslik: "Kapılar: portlar", seviye: "Başlangıç", sure: 20, ag: AG,
      ozet: "Adres binayı gösterir, port daireyi. Bir sunucuda hangi kapıların açık olduğunu tek tek yokla ve kapatılması unutulmuş olanı bul.",
      kazanim: ["port kavramı", "nc -zv ile yoklama", "bilinen portlar: 22, 80", "gereksiz açık port riski"],
      dosyalar: { "/home/ogrenci/portlar.txt": "Sık görülen portlar\n22    ssh    uzaktan komut satırı\n25    smtp   e-posta gönderimi\n53    dns    isim çözme\n80    http   web\n443   https  şifreli web\n8080  http-alt  deneme amaçlı web sunucuları\n" },
      adimlar: [
        { k: ["Bir makinede aynı anda birçok hizmet çalışır: web, e-posta, uzaktan bağlantı. Hangisine gittiğini **port numarası** belirler. IP binanın adresiyse port daire numarasıdır.", "Sık görülenlere bak: `cat portlar.txt`."], gorev: "portlar.txt dosyasını oku.", ipucu: "`cat portlar.txt`", cozum: ["cat portlar.txt"], gec: { cikti: "8080" } },
        { k: ["Bir kapının açık olup olmadığını `nc -zv` ile yoklarız: bağlanmayı dener, veri yollamaz.", "`nc -zv okul.lab 80`"], gorev: "okul.lab üzerinde 80 numaralı portu yokla.", ipucu: "`nc -zv okul.lab 80`", cozum: ["nc -zv okul.lab 80"], gec: { cikti: "80 portu açık" } },
        { k: ["Açık, arkasında bir web sunucusu var. Şimdi kimsenin dinlemediği bir kapı: `nc -zv okul.lab 23`."], gorev: "23 numaralı portu yokla.", ipucu: "`nc -zv okul.lab 23`", cozum: ["nc -zv okul.lab 23"], gec: { komut: "^nc\\b.*\\b23$", hataOlsa: true } },
        { k: ["“Bağlantı reddedildi”: makine ayakta ama o kapının arkasında kimse yok. Zaman aşımından farklıdır; orada hiç yanıt gelmez.", "Uzaktan yönetim kapısına bak: `nc -zv okul.lab 22`."], gorev: "22 numaralı portu yokla.", ipucu: "`nc -zv okul.lab 22`", cozum: ["nc -zv okul.lab 22"], gec: { cikti: "22 portu açık" } },
        { k: ["Yöneticiler deneme için açtıkları sunucuları kapatmayı unutur. `portlar.txt` içindeki son satırı yokla: `nc -zv okul.lab 8080`."], gorev: "8080 numaralı portu yokla.", ipucu: "`nc -zv okul.lab 8080`", cozum: ["nc -zv okul.lab 8080"], gec: { cikti: "8080 portu açık" } },
        { k: ["Açık. Adresin sonuna `:8080` ekleyerek o kapıdaki web sunucusuna gidilir: `curl http://okul.lab:8080/`. İçindeki bayrağı gönder."], gorev: "8080 portundaki sayfayı oku ve bayrağı gönder.", ipucu: "`curl http://okul.lab:8080/`", cozum: ["curl http://okul.lab:8080/", "bayrak QG{acik_port_acik_kapi}"], gec: { bayrak: "QG{acik_port_acik_kapi}" } }
      ],
      kapanis: "Her açık port, dışarıya açılan bir kapıdır. Güvenlikte ilk kural, kullanılmayan kapıyı kapatmaktır. Burada yaptığın yoklamayı yalnızca kendi makinende ya da izin verilen alıştırma ortamlarında yap; başkasının sunucusunu izinsiz taramak birçok ülkede suçtur.",
      ek: [{ gorev: "posta.lab üzerinde e-posta portunu (25) yokla.", cozum: ["nc -zv posta.lab 25"], gec: { cikti: "25 portu açık" } }]
    },
    {
      id: "ag4", alan: "ag", no: 4, baslik: "Bir isteğin yolculuğu: HTTP", seviye: "Başlangıç", sure: 25, ag: AG,
      ozet: "Tarayıcının perde arkasında yaptığını elle yap: sayfa iste, yanıtın başlıklarını oku, durum kodlarını tanı ve gizlendiği sanılan bir dosyayı bul.",
      kazanim: ["curl ile istek", "durum kodları: 200, 301, 403, 404", "yanıt başlıkları", "robots.txt"],
      dosyalar: { "/home/ogrenci/kodlar.txt": "200  tamam\n301  başka adrese taşındı\n403  var ama sana yasak\n404  böyle bir sayfa yok\n" },
      adimlar: [
        { k: ["Tarayıcı bir sayfa açarken sunucuya “bana şu sayfayı ver” der; buna **HTTP isteği** denir. `curl` aynı isteği komut satırından yapar ve gelen metni olduğu gibi gösterir.", "`curl http://okul.lab/`"], gorev: "okul.lab ana sayfasını iste.", ipucu: "`curl http://okul.lab/`", cozum: ["curl http://okul.lab/"], gec: { cikti: "Okul Lab" } },
        { k: ["Tarayıcının süsleyip gösterdiği şey bu HTML metnidir. Sunucu sayfayla birlikte, sayfa hakkında bilgi de yollar: **başlıklar**. Yalnızca onları görmek için `-I`:", "`curl -I http://okul.lab/`"], gorev: "Ana sayfanın yanıt başlıklarını gör.", ipucu: "`curl -I http://okul.lab/` (büyük i)", cozum: ["curl -I http://okul.lab/"], gec: { cikti: "HTTP/1\\.1 200" } },
        { k: ["İlk satırdaki `200` **durum kodu**: istek başarılı. `Server` satırı hangi yazılımın çalıştığını söylüyor; saldırganlar bu satırdan sürüm öğrenip bilinen açıkları arar, bu yüzden çoğu yerde gizlenir.", "Olmayan bir sayfa iste: `curl -I http://okul.lab/yok.html`."], gorev: "Var olmayan bir sayfanın durum kodunu gör.", ipucu: "`curl -I http://okul.lab/yok.html`", cozum: ["curl -I http://okul.lab/yok.html"], gec: { cikti: "HTTP/1\\.1 404" } },
        { k: ["`404`: sayfa yok. Kodların anlamı `kodlar.txt` içinde. Bir tane daha: `curl -I http://okul.lab/eski`."], gorev: "/eski adresinin durum kodunu gör.", ipucu: "`curl -I http://okul.lab/eski`", cozum: ["curl -I http://okul.lab/eski"], gec: { cikti: "Location: /duyuru\\.html" } },
        { k: ["`301` ve bir `Location` başlığı: “aradığın şey taşındı, şuraya git.” Tarayıcı bunu sana sormadan izler.", "Sitelerin çoğunda arama motorlarına yön veren bir dosya bulunur: `curl http://okul.lab/robots.txt`."], gorev: "robots.txt dosyasını oku.", ipucu: "`curl http://okul.lab/robots.txt`", cozum: ["curl http://okul.lab/robots.txt"], gec: { cikti: "Disallow: /yedek/" } },
        { k: ["`Disallow` satırları arama motoruna “buraya girme” der. Ama bu bir rica, kilit değil; üstelik gizlenmek istenen yerlerin listesini herkese vermiş olur.", "İlkini dene: `curl -I http://okul.lab/yonetim`."], gorev: "/yonetim adresinin durum kodunu gör.", ipucu: "`curl -I http://okul.lab/yonetim`", cozum: ["curl -I http://okul.lab/yonetim"], gec: { cikti: "HTTP/1\\.1 403" } },
        { k: ["`403`: sayfa var ama sunucu seni içeri almıyor. Doğru korunan bir sayfa böyle davranır.", "İkinci satırdaki klasör korunmuş mu? İçinde `notlar.txt` adında bir dosya olduğunu duydun. İste, bayrağı gönder."], gorev: "/yedek/notlar.txt dosyasını oku ve bayrağı gönder.", ipucu: "`curl http://okul.lab/yedek/notlar.txt`", cozum: ["curl http://okul.lab/yedek/notlar.txt", "bayrak QG{robots_gizlemez_isaret_eder}"], gec: { bayrak: "QG{robots_gizlemez_isaret_eder}" } }
      ],
      kapanis: "Bir web isteğinin parçalarını gördün: adres, durum kodu, başlıklar, gövde. `robots.txt` bir güvenlik önlemi değildir; bir dosyayı korumanın yolu ona erişimi kapatmaktır (`403`), adını saklamak değil.",
      ek: [{ gorev: "Sunucunun hangi yazılımı kullandığını tek satırda göster (başlıklardan Server satırını süz).", cozum: ["curl -I http://okul.lab/ | grep Server"], gec: { cikti: "^Server: nginx/1\\.24\\n(?![\\s\\S])" } }]
    }
    ,{
      id: "ag5", alan: "ag", no: 5, baslik: "Site açılmıyor: sırayla ele", seviye: "Başlangıç", sure: 25, ag: AG_ARIZA,
      ozet: "Dört site için “açılmıyor” şikâyeti geldi. Her birinin nedeni farklı. Rastgele denemek yerine dört soruyu sırayla sor: isim çözülüyor mu, makine yanıt veriyor mu, port açık mı, sayfa var mı?",
      kazanim: ["sorun giderme sırası", "nslookup, ping, nc, curl birlikte", "belirtiden nedene gitmek"],
      dosyalar: { "/home/ogrenci/sikayet.txt": "Açılmayan siteler:\n- blog.lab\n- haber.lab\n- forum.lab\n- depo.lab/belgeler/rehber.txt\n" },
      adimlar: [
        { k: ["Bir site açılmadığında neden dört yerden birindedir: **isim**, **makine**, **port** ya da **sayfa**. Bu sırayla bakılır, çünkü her biri bir öncekine dayanır.", "Önce şikâyetleri oku: `cat sikayet.txt`."], gorev: "Şikâyet listesini oku.", ipucu: "`cat sikayet.txt`", cozum: ["cat sikayet.txt"], gec: { cikti: "blog\\.lab" } },
        { k: ["İlk site `blog.lab`. İlk soru: bu isim bir adrese çıkıyor mu? `nslookup blog.lab`"], gorev: "blog.lab isminin çözülüp çözülmediğine bak.", ipucu: "`nslookup blog.lab`", cozum: ["nslookup blog.lab"], gec: { komut: "^nslookup\\s+blog\\.lab$", hataOlsa: true } },
        { k: ["`NXDOMAIN`: isim rehberde yok. Sorun **isimde**; makineye ya da porta bakmanın anlamı kalmadı. Çözüm alan adı kaydını düzeltmektir.", "İkinci site: `nslookup haber.lab`."], gorev: "haber.lab ismini sorgula.", ipucu: "`nslookup haber.lab`", cozum: ["nslookup haber.lab"], gec: { cikti: "10\\.0\\.0\\.31" } },
        { k: ["İsim çözülüyor. Sıradaki soru: o adresteki makine yanıt veriyor mu? `ping -c 2 haber.lab`"], gorev: "haber.lab makinesine ping at.", ipucu: "`ping -c 2 haber.lab`", cozum: ["ping -c 2 haber.lab"], gec: { cikti: "%100 kayıp" } },
        { k: ["Yanıt yok: sorun **makinede**. Kapalı olabilir ya da ağ bağlantısı kopmuştur; sunucunun başındaki kişiye haber verilir.", "Üçüncü site `forum.lab`. İsim ve makineyi tek komutla dene: `ping -c 2 forum.lab`."], gorev: "forum.lab makinesine ping at.", ipucu: "`ping -c 2 forum.lab`", cozum: ["ping -c 2 forum.lab"], gec: { cikti: "10\\.0\\.0\\.32 adresinden yanıt" } },
        { k: ["İsim çözüldü, makine ayakta. Üçüncü soru: web kapısı açık mı? `nc -zv forum.lab 80`"], gorev: "forum.lab üzerinde 80 numaralı portu yokla.", ipucu: "`nc -zv forum.lab 80`", cozum: ["nc -zv forum.lab 80"], gec: { komut: "^nc\\b.*forum\\.lab\\s+80$", hataOlsa: true } },
        { k: ["“Bağlantı reddedildi”: makine çalışıyor ama web sunucusu çalışmıyor. Sorun **portta**; hizmetin yeniden başlatılması gerekir.", "Son şikâyet bir sayfa: `curl -I http://depo.lab/belgeler/rehber.txt`"], gorev: "Şikâyet edilen sayfanın durum kodunu gör.", ipucu: "`curl -I http://depo.lab/belgeler/rehber.txt`", cozum: ["curl -I http://depo.lab/belgeler/rehber.txt"], gec: { cikti: "HTTP/1\\.1 404" } },
        { k: ["`404`: isim, makine ve port sağlam; yalnızca **sayfa** yok. Belki adı yanlış yazılmıştır. Klasörde ne olduğuna bak: `curl http://depo.lab/belgeler`"], gorev: "belgeler klasörünün içeriğini iste.", ipucu: "`curl http://depo.lab/belgeler`", cozum: ["curl http://depo.lab/belgeler"], gec: { cikti: "kilavuz\\.txt" } },
        { k: ["Dosyanın adı `rehber.txt` değil, `kilavuz.txt`. Şikâyet eden kişi adresi yanlış yazmış. Doğru adresi iste, içindeki bayrağı gönder."], gorev: "Doğru dosyayı oku ve bayrağı gönder.", ipucu: "`curl http://depo.lab/belgeler/kilavuz.txt`", cozum: ["curl http://depo.lab/belgeler/kilavuz.txt", "bayrak QG{isim_makine_port_sayfa}"], gec: { bayrak: "QG{isim_makine_port_sayfa}" } }
      ],
      kapanis: "Dört şikâyet, dört ayrı neden: isim yoktu, makine kapalıydı, hizmet çalışmıyordu, adres yanlıştı. Sıra hep aynı: `nslookup`, `ping`, `nc`, `curl`. İlk takılan adım sorunun yerini söyler.",
      ek: [{ gorev: "depo.lab ana sayfasının durum satırını süz.", cozum: ["curl -I http://depo.lab/ | grep HTTP"], gec: { cikti: "^HTTP/1\\.1 200[^\\n]*\\n(?![\\s\\S])" } }]
    }
    ,{
      id: "lx5", alan: "linux", no: 5, baslik: "En büyüğü bulmak: sayıyla sıralamak", seviye: "Başlangıç", sure: 20,
      ozet: "Disk dolmuş. Elinde dosyaların boyut listesi var. Listeyi sayıya göre sırala, en çok yer tutan üçünü bul ve unutulmuş dev yedeğe ulaş.",
      kazanim: ["sort ile alfabetik sıra", "sort -n ile sayısal sıra", "sort -r ile ters sıra", "head -n ile ilk satırlar", "cut ile sütun seçmek"],
      dosyalar: {
        "/home/ogrenci/boyutlar.txt": "96 notlar.txt\n1024 sunum.pdf\n8 liste.txt\n20480 yedek/eski-proje.tar\n512 foto.png\n4096 video/ders1.mp4\n7 ayar.conf\n300 muzik.mp3\n",
        "/home/ogrenci/yedek/eski-proje.tar": "(eski proje arsivi)\n",
        "/home/ogrenci/yedek/BENIOKU.txt": "Bu yedek 2019'dan kaldi. Proje coktan bitti, silinebilir.\nQG{sayiyla_sirala_buyugu_bul}\n",
        "/home/ogrenci/video/ders1.mp4": "(video)\n"
      },
      adimlar: [
        { k: ["Disk doldu ve neyin yer kapladığını bulman gerekiyor. `boyutlar.txt` içinde her satırda bir dosyanın boyutu (KB) ve adı var.", "Önce bak: `cat boyutlar.txt`."], gorev: "Boyut listesini oku.", ipucu: "`cat boyutlar.txt`", cozum: ["cat boyutlar.txt"], gec: { cikti: "20480 yedek" } },
        { k: ["Sıralamayı dene: `sort boyutlar.txt`. Sonuca dikkatle bak; bir şey ters gidecek."], gorev: "Listeyi sort ile sırala.", ipucu: "`sort boyutlar.txt`", cozum: ["sort boyutlar.txt"], gec: { komut: "^sort\\s+boyutlar\\.txt$" } },
        { k: ["`1024`, `8`'den önce geldi. `sort` satırları **metin** gibi karşılaştırır: önce ilk karaktere bakar ve `1`, `8`'den küçüktür. Sözlükte “on”un “sekiz”den önce gelmesi gibi.", "Sayı olarak sıralamak için `-n` ekle: `sort -n boyutlar.txt`."], gorev: "Listeyi sayıya göre sırala.", ipucu: "`sort -n boyutlar.txt`", cozum: ["sort -n boyutlar.txt"], gec: { cikti: "^7 ayar\\.conf\\n8 liste\\.txt\\n96 notlar\\.txt\\n300 " } },
        { k: ["Şimdi küçükten büyüğe doğru. Ama aradığımız en büyükler; onlar en altta kaldı. `-r` sırayı ters çevirir.", "İkisini birlikte kullan: `sort -n -r boyutlar.txt`."], gorev: "Listeyi büyükten küçüğe sırala.", ipucu: "`sort -n -r boyutlar.txt`", cozum: ["sort -n -r boyutlar.txt"], gec: { cikti: "^20480 [^\\n]+\\n4096 [^\\n]+\\n1024 " } },
        { k: ["Liste uzun olsaydı hepsini görmek istemezdin. Yalnızca ilk üçünü almak için hattın sonuna `| head -n 3` ekle."], gorev: "En çok yer tutan üç dosyayı listele.", ipucu: "`sort -n -r boyutlar.txt | head -n 3`", cozum: ["sort -n -r boyutlar.txt | head -n 3"], gec: { cikti: "^20480 [^\\n]+\\n4096 [^\\n]+\\n1024 [^\\n]+\\n(?![\\s\\S])" } },
        { k: ["Birinci açık ara önde: 20 MB'lık bir yedek. Yalnızca **adını** almak için önce tek satıra indir, sonra ikinci sütunu kes.", "`sort -n -r boyutlar.txt | head -n 1 | cut -d ' ' -f 2`"], gorev: "En büyük dosyanın yalnızca adını yazdır.", ipucu: "`sort -n -r boyutlar.txt | head -n 1 | cut -d ' ' -f 2`", cozum: ["sort -n -r boyutlar.txt | head -n 1 | cut -d ' ' -f 2"], gec: { cikti: "^yedek/eski-proje\\.tar\\n(?![\\s\\S])" } },
        { k: ["Dosya `yedek` klasöründe. Silmeden önce ne olduğunu anlamak gerekir. Klasöre bak: `ls yedek`. Yanında bir açıklama dosyası var; onu oku ve bayrağı gönder."], gorev: "Yedek klasöründeki açıklamayı oku ve bayrağı gönder.", ipucu: "`ls yedek`, sonra `cat yedek/BENIOKU.txt`", cozum: ["ls yedek", "cat yedek/BENIOKU.txt", "bayrak QG{sayiyla_sirala_buyugu_bul}"], gec: { bayrak: "QG{sayiyla_sirala_buyugu_bul}" } }
      ],
      kapanis: "`sort` tek başına metin gibi sıralar; sayılar için `-n`, tersten için `-r` gerekir. `sort -n -r | head -n 3` kalıbı “en büyük üç” sorusunun cevabıdır: disk kullanımında, kayıt sayımında, puan tablosunda hep aynı kalıbı kullanırsın.",
      ek: [{ gorev: "En az yer tutan üç dosyayı listele.", cozum: ["sort -n boyutlar.txt | head -n 3"], gec: { cikti: "^7 ayar\\.conf\\n8 liste\\.txt\\n96 notlar\\.txt\\n(?![\\s\\S])" } }]
    }
    ,{
      id: "ag6", alan: "ag", no: 6, baslik: "Taşınan sayfanın peşinde: yönlendirme", seviye: "Başlangıç", sure: 20, ag: AG_TASINDI,
      ozet: "Bir kısa adres boş sayfa döndürüyor. Sayfa silinmedi, taşındı. Yanıt başlıklarındaki Location satırını izleyerek belgenin son adresine ulaş.",
      kazanim: ["301 yönlendirmesi", "Location başlığı", "göreli ve tam adres", "adreste port yazmak", "tarayıcının perde arkasında yaptığı"],
      dosyalar: { "/home/ogrenci/not.txt": "Kilavuzun kisa adresi: http://kisa.lab/r/kilavuz\n" },
      adimlar: [
        { k: ["Elinde bir kısa adres var. Önce nota bak: `cat not.txt`, sonra adresi iste: `curl http://kisa.lab/r/kilavuz`."], gorev: "Kısa adresi curl ile iste.", ipucu: "`curl http://kisa.lab/r/kilavuz`", cozum: ["cat not.txt", "curl http://kisa.lab/r/kilavuz"], gec: { komut: "^curl\\s+(http://)?kisa\\.lab/r/kilavuz$" } },
        { k: ["Hiçbir şey gelmedi ama hata da yok. Gövde boş; açıklama **başlıklarda**. Başlıkları görmek için `-I` ekle: `curl -I http://kisa.lab/r/kilavuz`."], gorev: "Aynı adresin yanıt başlıklarını gör.", ipucu: "`curl -I http://kisa.lab/r/kilavuz`", cozum: ["curl -I http://kisa.lab/r/kilavuz"], gec: { cikti: "Location: http://belge\\.lab/kilavuz" } },
        { k: ["`301`: “kalıcı olarak taşındı”. `Location` satırı yeni adresi söylüyor. Tarayıcın bunu görünce sana sormadan yeni adrese gider; sen şimdi aynısını elle yapıyorsun.", "Yeni adresin başlıklarına bak: `curl -I http://belge.lab/kilavuz`."], gorev: "Location satırındaki adresin başlıklarını iste.", ipucu: "`curl -I http://belge.lab/kilavuz`", cozum: ["curl -I http://belge.lab/kilavuz"], gec: { cikti: "Location: /v2/kilavuz\\.txt" } },
        { k: ["Yine `301`, ama bu kez `Location` bir site adıyla başlamıyor: `/v2/kilavuz.txt`. Bu **göreli** bir adres; “aynı sunucuda, şu yolda” demek.", "Sunucu adını başına sen ekle: `curl -I http://belge.lab/v2/kilavuz.txt`."], gorev: "Göreli adresi tam adrese çevirip başlıklarını iste.", ipucu: "`curl -I http://belge.lab/v2/kilavuz.txt`", cozum: ["curl -I http://belge.lab/v2/kilavuz.txt"], gec: { cikti: "Location: http://belge\\.lab:8080/" } },
        { k: ["Üçüncü yönlendirme. Bu kez adreste `:8080` var: aynı makine, **başka port**. Port yazılmazsa `http` için 80 varsayılır; farklıysa adreste belirtilir.", "Zincirin sonuna geldik mi? Yalnızca durum satırını süz: `curl -I http://belge.lab:8080/v2/kilavuz.txt | grep HTTP`."], gorev: "Son adresin durum kodunu gör.", ipucu: "`curl -I http://belge.lab:8080/v2/kilavuz.txt | grep HTTP`", cozum: ["curl -I http://belge.lab:8080/v2/kilavuz.txt | grep HTTP"], gec: { cikti: "HTTP/1\\.1 200" } },
        { k: ["`200`: artık yönlendirme yok, belge burada. `-I` olmadan iste, içindeki bayrağı gönder."], gorev: "Belgeyi oku ve bayrağı gönder.", ipucu: "`curl http://belge.lab:8080/v2/kilavuz.txt`", cozum: ["curl http://belge.lab:8080/v2/kilavuz.txt", "bayrak QG{location_basligini_izle}"], gec: { bayrak: "QG{location_basligini_izle}" } }
      ],
      kapanis: "Boş gelen sayfa çoğu zaman taşınmış sayfadır. `301` görünce `Location` satırını izle: tam adres olabilir, göreli olabilir, portu değişmiş olabilir. Gerçek `curl`'de `-L` bu zinciri senin yerine izler; tarayıcılar bunu her gün fark ettirmeden yapar.",
      ek: [{ gorev: "Kısa adresin yanıtından yalnızca Location satırını süz.", cozum: ["curl -I http://kisa.lab/r/kilavuz | grep Location"], gec: { cikti: "^Location: http://belge\\.lab/kilavuz\\n(?![\\s\\S])" } }]
    }
    ,{
      id: "sg7", alan: "siber", no: 7, baslik: "Parmak izi: dosya değişti mi?", seviye: "Başlangıç", sure: 25,
      ozet: "Üç dosya indirdin. Yayıncı her birinin özetini (hash) vermiş. Özetleri kendin hesapla, listeyle karşılaştır ve indirildikten sonra değiştirilmiş dosyayı bul.",
      kazanim: ["özet (hash) nedir", "sha256sum", "tek harf değişince özetin tamamen değişmesi", "sort ve uniq -c ile iki listeyi karşılaştırmak", "bütünlük denetimi"],
      dosyalar: {
        "/home/ogrenci/ozetler.txt": `${OZET.rapor}  indirilen/rapor.txt\n${OZET.kur}  indirilen/kur.sh\n${OZET.ayar}  indirilen/ayar.conf\n`,
        "/home/ogrenci/indirilen/rapor.txt": OZET_ASIL.rapor,
        "/home/ogrenci/indirilen/kur.sh": OZET_ASIL.kur,
        "/home/ogrenci/indirilen/ayar.conf": OZET_ASIL.ayar + "yonetici=misafir\n# QG{ozet_tutmuyorsa_guvenme}\n"
      },
      adimlar: [
        { k: ["**Özet** (hash), bir dosyanın parmak izidir: dosyanın içeriğinden hesaplanan 64 karakterlik bir değer. İçerik aynıysa özet aynıdır.", "Yayıncı, dosyalarının özetlerini bir listede vermiş. Oku: `cat ozetler.txt`."], gorev: "Yayıncının özet listesini oku.", ipucu: "`cat ozetler.txt`", cozum: ["cat ozetler.txt"], gec: { cikti: "indirilen/kur\\.sh" } },
        { k: ["Şimdi indirdiğin bir dosyanın özetini kendin hesapla: `sha256sum indirilen/rapor.txt`. Çıkan değeri listedeki ilk satırla karşılaştır."], gorev: "rapor.txt dosyasının özetini hesapla.", ipucu: "`sha256sum indirilen/rapor.txt`", cozum: ["sha256sum indirilen/rapor.txt"], gec: { cikti: "^9e167b0ef16a79e4" } },
        { k: ["İkisi de `9e167b0e` ile başlıyor ve sonuna kadar aynı: dosya yolda değişmemiş.", "Küçük bir değişiklik özeti ne kadar etkiler? İki komutu sırayla dene: `echo merhaba | sha256sum`, sonra `echo Merhaba | sha256sum`."], gorev: "Tek harfi farklı iki metnin özetini hesapla.", ipucu: "`echo merhaba | sha256sum`, sonra `echo Merhaba | sha256sum`", cozum: ["echo merhaba | sha256sum", "echo Merhaba | sha256sum"], gec: { cikti: "^9239257aac927332" } },
        { k: ["Tek harf büyüdü, özetin **tamamı** değişti. Bu yüzden özet tutuyorsa dosyanın tek bir karakteri bile oynamamıştır.", "Üç dosyanın özetini birden hesapla ve bir dosyaya yaz: `sha256sum indirilen/rapor.txt indirilen/kur.sh indirilen/ayar.conf > benim.txt`."], gorev: "Üç dosyanın özetini benim.txt dosyasına yaz.", ipucu: "`sha256sum indirilen/rapor.txt indirilen/kur.sh indirilen/ayar.conf > benim.txt`", cozum: ["sha256sum indirilen/rapor.txt indirilen/kur.sh indirilen/ayar.conf > benim.txt"], gec: { durum: (k) => { const m = metin(k, "/home/ogrenci/benim.txt"); return m.split("\n").filter(Boolean).length === 3 && /rapor\.txt/.test(m) && /kur\.sh/.test(m) && /ayar\.conf/.test(m); } } },
        { k: ["64 karakteri gözle karşılaştırmak hataya açıktır. İki listeyi alt alta koy, sırala, aynı satırları say: tutan satır **2** kez, tutmayan **1** kez görünür.", "`cat ozetler.txt benim.txt | sort | uniq -c`"], gorev: "İki listeyi birleştirip her satırın kaç kez geçtiğini say.", ipucu: "`cat ozetler.txt benim.txt | sort | uniq -c`", cozum: ["cat ozetler.txt benim.txt | sort | uniq -c"], gec: { cikti: "\\b1 [0-9a-f]{64}  indirilen/ayar\\.conf" } },
        { k: ["`rapor.txt` ve `kur.sh` ikişer kez: özetleri tutuyor. `ayar.conf` iki ayrı özetle birer kez görünüyor: senin elindeki dosya, yayıncının dosyası **değil**.", "Ne değiştiğini gör: `cat indirilen/ayar.conf`. Sonradan eklenen satırları bul, bayrağı gönder."], gorev: "Değiştirilmiş dosyayı oku ve bayrağı gönder.", ipucu: "`cat indirilen/ayar.conf`", cozum: ["cat indirilen/ayar.conf", "bayrak QG{ozet_tutmuyorsa_guvenme}"], gec: { bayrak: "QG{ozet_tutmuyorsa_guvenme}" } }
      ],
      kapanis: "Biri dosyaya ikinci bir yönetici eklemiş; gözle fark etmesi zor, özetle kaçması imkânsız. İndirdiğin bir dosyanın özeti yayıncının verdiğiyle tutmuyorsa o dosyayı kullanma. Özet, dosyanın **değişmediğini** gösterir; içeriğini gizlemez, yani şifreleme değildir.",
      ek: [{ gorev: "Yıldızla kısalt: indirilen klasöründeki bütün dosyaların özetini tek komutla hesapla.", cozum: ["sha256sum indirilen/*"], gec: { komut: "^sha256sum\\s+indirilen/\\*$" } }, { gorev: "İki özet listesini diff ile karşılaştır.", cozum: ["diff ozetler.txt benim.txt"], gec: { cikti: "^< [0-9a-f]{64}  indirilen/ayar\\.conf$" } }]
    }
    ,{
      id: "lx6", alan: "linux", no: 6, baslik: "Aradığını süzmek: grep'in bayrakları", seviye: "Başlangıç", sure: 20,
      ozet: "Bir uygulamanın günlüğünde hatalar farklı farklı yazılmış: HATA, Hata, hata. grep'in bayraklarıyla hepsini yakala, say, satır numarasını bul, gürültüyü ele ve bir klasörün tamamında ara.",
      kazanim: ["grep -i (harf ayırmadan)", "grep -c (sayma)", "grep -n (satır numarası)", "grep -v (hariç tutma)", "grep -r (klasörde arama)"],
      dosyalar: {
        "/home/ogrenci/gunluk.txt": "09:00 BILGI sunucu basladi\n09:02 UYARI disk %81 dolu\n09:05 bilgi kullanici ayse girdi\n09:07 HATA veritabani baglantisi koptu\n09:07 BILGI yeniden deneniyor\n09:08 Hata veritabani yine yanit vermiyor\n09:10 BILGI baglanti kuruldu\n09:15 UYARI bellek %90\n09:20 hata odeme servisi zaman asimi\n09:21 BILGI kullanici can girdi\n",
        "/home/ogrenci/kayitlar/web.log": "09:00 BILGI istek /\n09:01 BILGI istek /hakkinda\n",
        "/home/ogrenci/kayitlar/posta.log": "09:03 BILGI 2 ileti gonderildi\n",
        "/home/ogrenci/kayitlar/eski/odeme.log": "09:19 BILGI odeme istegi alindi\n09:20 HATA zaman asimi, islem kodu QG{grep_ile_suz_bul}\n"
      },
      adimlar: [
        { k: ["`gunluk.txt` bir uygulamanın günlüğü. Hataları bulalım: `grep HATA gunluk.txt`."], gorev: "HATA geçen satırları bul.", ipucu: "`grep HATA gunluk.txt`", cozum: ["grep HATA gunluk.txt"], gec: { cikti: "^09:07 HATA [^\\n]+\\n(?![\\s\\S])" } },
        { k: ["Yalnızca bir satır geldi. Oysa günlükte `Hata` ve `hata` diye yazılmış satırlar da var; `grep` büyük ve küçük harfi ayrı sayar.", "`-i` bu ayrımı kaldırır: `grep -i hata gunluk.txt`."], gorev: "Yazılışı ne olursa olsun bütün hata satırlarını bul.", ipucu: "`grep -i hata gunluk.txt`", cozum: ["grep -i hata gunluk.txt"], gec: { cikti: "^09:07 HATA [^\\n]+\\n09:08 Hata [^\\n]+\\n09:20 hata " } },
        { k: ["Üç hata. Satırları değil yalnızca **sayısını** istiyorsan `-c` ekle. Bayraklar yan yana yazılabilir: `grep -i -c hata gunluk.txt`."], gorev: "Hata satırlarını say.", ipucu: "`grep -i -c hata gunluk.txt`", cozum: ["grep -i -c hata gunluk.txt"], gec: { cikti: "^3\\n(?![\\s\\S])" } },
        { k: ["Bir arkadaşına “şu satıra bak” diyebilmek için satır numarası gerekir. `-n` her satırın başına numarasını koyar: `grep -i -n hata gunluk.txt`."], gorev: "Hata satırlarını satır numaralarıyla göster.", ipucu: "`grep -i -n hata gunluk.txt`", cozum: ["grep -i -n hata gunluk.txt"], gec: { cikti: "^4:09:07 HATA [^\\n]+\\n6:09:08 Hata [^\\n]+\\n9:09:20 hata " } },
        { k: ["Bazen aradığını değil, **istemediğini** bilirsin. Günlüğün çoğu `BILGI` satırı; onları atınca geriye önemli olanlar kalır.", "`-v` eşleşmeyen satırları verir: `grep -i -v bilgi gunluk.txt`."], gorev: "Bilgi satırları dışındaki her şeyi göster.", ipucu: "`grep -i -v bilgi gunluk.txt`", cozum: ["grep -i -v bilgi gunluk.txt"], gec: { cikti: "^09:02 UYARI [^\\n]+\\n09:07 HATA [^\\n]+\\n09:08 Hata [^\\n]+\\n09:15 UYARI [^\\n]+\\n09:20 hata [^\\n]+\\n(?![\\s\\S])" } },
        { k: ["Son hata bir ödeme zaman aşımıydı. Ayrıntısı başka bir günlükte, ama `kayitlar` klasöründe birkaç dosya ve bir alt klasör var.", "`-r` klasörün içindeki bütün dosyalarda arar ve satırın hangi dosyada olduğunu da yazar: `grep -r -i \"zaman asimi\" kayitlar`. Bulduğun satırdaki bayrağı gönder."], gorev: "kayitlar klasörünün tamamında “zaman asimi” ara ve bayrağı gönder.", ipucu: "`grep -r -i \"zaman asimi\" kayitlar`", cozum: ["grep -r -i \"zaman asimi\" kayitlar", "bayrak QG{grep_ile_suz_bul}"], gec: { bayrak: "QG{grep_ile_suz_bul}" } }
      ],
      kapanis: "Beş bayrak, beş soru: `-i` yazılış fark etmesin, `-c` kaç tane, `-n` hangi satırda, `-v` bunun dışındakiler, `-r` bütün klasörde. Hepsini unutursan `man grep` yaz; her komutun kısa kılavuzu orada.",
      ek: [
        { gorev: "UYARI satırlarını uyarilar.txt dosyasına yaz.", cozum: ["grep UYARI gunluk.txt > uyarilar.txt"], gec: { durum: (k) => { const l = metin(k, "/home/ogrenci/uyarilar.txt").split("\n").filter(Boolean); return l.length === 2 && l.every((x) => /UYARI/.test(x)); } } },
        { gorev: "man grep yazıp kılavuzu oku.", cozum: ["man grep"], gec: { komut: "^man\\s+grep$" } }
      ]
    }
    ,{
      id: "ag7", alan: "ag", no: 7, baslik: "Ağ envanteri: kim ne hizmeti veriyor?", seviye: "Başlangıç", sure: 25, ag: AG_ENVANTER,
      ozet: "Koruyamadığın şeyi bilemezsin. Dört makinelik küçük bir ağın envanterini çıkar: hangisi ayakta, hangisinde hangi kapı açık. Kapatılması gereken eski bir hizmeti bul.",
      kazanim: ["envanter çıkarmak", "ping ile ayakta mı", "nc ile hizmet yoklama", "sonucu >> ile dosyada biriktirmek", "şifresiz eski hizmetler: telnet, ftp"],
      dosyalar: { "/home/ogrenci/makineler.txt": "web.lab\ndosya.lab\neski.lab\nyazici.lab\n" },
      adimlar: [
        { k: ["Bir ağı korumanın ilk adımı içinde ne olduğunu bilmektir. Buna **envanter** denir. Elindeki liste: `cat makineler.txt`."], gorev: "Makine listesini oku.", ipucu: "`cat makineler.txt`", cozum: ["cat makineler.txt"], gec: { cikti: "eski\\.lab" } },
        { k: ["İlk soru: makine ayakta mı? Tek paket yeter: `ping -c 1 web.lab`."], gorev: "web.lab makinesinin ayakta olup olmadığına bak.", ipucu: "`ping -c 1 web.lab`", cozum: ["ping -c 1 web.lab"], gec: { cikti: "1 paket gönderildi, 1 alındı" } },
        { k: ["Ayakta. Şimdi `yazici.lab`: `ping -c 1 yazici.lab`."], gorev: "yazici.lab makinesini yokla.", ipucu: "`ping -c 1 yazici.lab`", cozum: ["ping -c 1 yazici.lab"], gec: { cikti: "yazici\\.lab[\\s\\S]*%100 kayıp" } },
        { k: ["Yanıt yok. Envantere “kapalı ya da yanıt vermiyor” diye geçer; bu da bir bilgidir.", "Ayakta olanlarda hangi kapılar açık? Sonuçları ekranda bırakma, bir dosyada biriktir. `>>` sona ekler: `nc -zv web.lab 80 >> envanter.txt`."], gorev: "web.lab üzerinde 80 numaralı portu yokla ve sonucu envanter.txt dosyasına ekle.", ipucu: "`nc -zv web.lab 80 >> envanter.txt`", cozum: ["nc -zv web.lab 80 >> envanter.txt"], gec: { durum: (k) => /web\.lab.*80 portu açık \[http\]/.test(metin(k, "/home/ogrenci/envanter.txt")) } },
        { k: ["Ekrana bir şey yazılmadı, çünkü çıktı dosyaya gitti. Sıradaki makine dosya sunucusu. Dosya aktarımının eski yolu **FTP**'dir ve 21 numaralı portu kullanır.", "`nc -zv dosya.lab 21 >> envanter.txt`"], gorev: "dosya.lab üzerinde 21 numaralı portu yokla ve sonucu envantere ekle.", ipucu: "`nc -zv dosya.lab 21 >> envanter.txt`", cozum: ["nc -zv dosya.lab 21 >> envanter.txt"], gec: { durum: (k) => /dosya\.lab.*21 portu açık \[ftp\]/.test(metin(k, "/home/ogrenci/envanter.txt")) } },
        { k: ["FTP açık. FTP parolayı ağda **şifrelemeden** gönderir; bugün yerine SFTP kullanılır. Envanterde yanına not düşülecek bir bulgu.", "Son makine `eski.lab`. Uzaktan yönetimin eski yolu **telnet**'tir, port 23: `nc -zv eski.lab 23 >> envanter.txt`."], gorev: "eski.lab üzerinde 23 numaralı portu yokla ve sonucu envantere ekle.", ipucu: "`nc -zv eski.lab 23 >> envanter.txt`", cozum: ["nc -zv eski.lab 23 >> envanter.txt"], gec: { durum: (k) => /eski\.lab.*23 portu açık \[telnet\]/.test(metin(k, "/home/ogrenci/envanter.txt")) } },
        { k: ["Telnet de açık. O da her şeyi, parola dahil, açık metin olarak taşır; yerini SSH (22) almıştır.", "Envanterin hazır: `cat envanter.txt`. Bu makinenin ne olduğunu anlamak için web sayfasına bak: `curl http://eski.lab/`. Sayfadaki bayrağı gönder."], gorev: "Envanteri oku, eski.lab sayfasını iste ve bayrağı gönder.", ipucu: "`cat envanter.txt`, sonra `curl http://eski.lab/`", cozum: ["cat envanter.txt", "curl http://eski.lab/", "bayrak QG{sifresiz_hizmeti_kapat}"], gec: { bayrak: "QG{sifresiz_hizmeti_kapat}" } }
      ],
      kapanis: "Dört makine: biri yanıt vermiyor, biri düzgün, ikisinde şifresiz eski hizmetler açık. Envanter bu yüzden çıkarılır: unutulmuş makine ve unutulmuş hizmet, bir ağın en zayıf yeridir. Kural basit: kullanılmayan hizmet kapatılır, şifresiz olan (telnet, ftp) şifrelisiyle (ssh, sftp) değiştirilir.",
      ek: [
        { gorev: "web.lab üzerinde SSH portunu (22) da yokla ve envantere ekle.", cozum: ["nc -zv web.lab 22 >> envanter.txt"], gec: { durum: (k) => /web\.lab.*22 portu açık \[ssh\]/.test(metin(k, "/home/ogrenci/envanter.txt")) } },
        { gorev: "Envanterde kaç açık port kaydı olduğunu say.", cozum: ["grep -c açık envanter.txt"], gec: { komut: "^grep\\s+-c\\s+\\S+\\s+envanter\\.txt$" } }
      ]
    }
    ,{
      id: "sg8", alan: "siber", no: 8, baslik: "Aynı parola, aynı özet", seviye: "Başlangıç", sure: 25,
      ozet: "Bir sistemin hesap listesini denetliyorsun. Parolalar özet olarak saklanmış, ama üç kişinin özeti birebir aynı. Bunun ne anlama geldiğini ve “tuz”un bunu nasıl önlediğini gör.",
      kazanim: ["parolalar neden özet olarak saklanır", "aynı parola aynı özeti verir", "yaygın parolaların tehlikesi", "tuz (salt) ne işe yarar"],
      dosyalar: {
        "/home/ogrenci/hesaplar.txt": `ali:${PAROLA.zayif}\nece:${PAROLA.kedi}\ncan:${PAROLA.zayif}\ndeniz:${PAROLA.guclu}\nmert:${PAROLA.zayif}\nokan:${PAROLA.futbol}\n`,
        "/home/ogrenci/tuzlu.txt": `ali:${PAROLA.tAli}\nece:${PAROLA.tEce}\ncan:${PAROLA.tCan}\ndeniz:${PAROLA.tDeniz}\nmert:${PAROLA.tMert}\nokan:${PAROLA.tOkan}\n# Tuzlu saklamada ayni parola farkli ozet verir.\n# QG{tuz_ayni_parolayi_farkli_gosterir}\n`
      },
      adimlar: [
        { k: ["İyi bir sistem parolaları **olduğu gibi saklamaz**; özetini saklar. Girişte yazdığın parolanın özeti alınır ve kayıttakiyle karşılaştırılır. Dosya sızsa bile parolalar doğrudan okunmaz.", "Denetleyeceğin liste: `cat hesaplar.txt`. Her satır `kullanici:ozet`."], gorev: "Hesap listesini oku.", ipucu: "`cat hesaplar.txt`", cozum: ["cat hesaplar.txt"], gec: { cikti: "^deniz:" } },
        { k: ["Altı uzun değer; gözle bir şey anlaşılmıyor. Yalnızca özet sütununu al, sırala ve say: `cut -d: -f2 hesaplar.txt | sort | uniq -c`."], gorev: "Her özetin kaç kez geçtiğini say.", ipucu: "`cut -d: -f2 hesaplar.txt | sort | uniq -c`", cozum: ["cut -d: -f2 hesaplar.txt | sort | uniq -c"], gec: { cikti: "\\b3 e150a1ec81e8e93e" } },
        { k: ["Bir özet **üç kez** geçiyor. Özet yalnızca içeriğe bağlıdır; aynı özet, aynı parola demektir. Üç kişi aynı parolayı kullanıyor.", "Kimler? Özetin başı `e150a1ec`: `grep e150a1ec hesaplar.txt`."], gorev: "Aynı özete sahip hesapları bul.", ipucu: "`grep e150a1ec hesaplar.txt`", cozum: ["grep e150a1ec hesaplar.txt"], gec: { cikti: "^ali:[^\\n]+\\ncan:[^\\n]+\\nmert:" } },
        { k: ["Üç kişinin aynı parolayı seçmesi tesadüf değildir; büyük olasılıkla çok yaygın bir paroladır. Dünyanın en yaygın parolası `123456`.", "Özetini hesapla ve karşılaştır: `echo 123456 | sha256sum`."], gorev: "123456 parolasının özetini hesapla.", ipucu: "`echo 123456 | sha256sum`", cozum: ["echo 123456 | sha256sum"], gec: { cikti: "^e150a1ec81e8e93e" } },
        { k: ["Tuttu. Özeti geri çevirmedin; yalnızca **tahmin edip** özetini aldın. Yaygın parolalar bu yüzden özetlenmiş olsa da güvende değildir.", "Çözüm **tuz**dur: özet alınmadan önce parolanın başına her kullanıcı için farklı bir değer eklenir. İki komutu dene: `echo ali123456 | sha256sum`, sonra `echo can123456 | sha256sum`."], gorev: "Aynı parolanın iki farklı tuzla özetini hesapla.", ipucu: "`echo ali123456 | sha256sum`, sonra `echo can123456 | sha256sum`", cozum: ["echo ali123456 | sha256sum", "echo can123456 | sha256sum"], gec: { cikti: "^008abb8c5d75f816" } },
        { k: ["Parola aynı, özetler bambaşka. Artık listeye bakan kimse hangi hesapların aynı parolayı kullandığını göremez ve tek bir tahminle üç hesabı birden bulamaz.", "Aynı hesapların tuzlu saklanmış hâli `tuzlu.txt` içinde. Oku, altındaki bayrağı gönder."], gorev: "Tuzlu listeyi oku ve bayrağı gönder.", ipucu: "`cat tuzlu.txt`", cozum: ["cat tuzlu.txt", "bayrak QG{tuz_ayni_parolayi_farkli_gosterir}"], gec: { bayrak: "QG{tuz_ayni_parolayi_farkli_gosterir}" } }
      ],
      kapanis: "Denetim raporun hazır: ali, can ve mert parolalarını hemen değiştirmeli, sistem de parolaları tuzlu saklamalı. Senin payına düşen ders: yaygın bir parola, ne kadar iyi saklanırsa saklansın tahmin edilir. Uzun ve her yerde farklı parola kullan.",
      ek: [
        { gorev: "Tuzlu listede aynı özetten iki tane olup olmadığını denetle (önce # ile başlayan satırları ele).", cozum: ["grep -v \"#\" tuzlu.txt | cut -d: -f2 | sort | uniq -c | sort -rn | head -n 1"], gec: { cikti: "^\\s*1 [0-9a-f]{64}\\n(?![\\s\\S])" } }
      ]
    }
  ];

  /* Öğrenme alanları (yol haritaları). durum: "hazir" | "yakinda" */
  const ALANLAR = [
    { id: "py", ad: "Python", tur: "dil", durum: "hazir", ozet: "İlk dil için en rahatı. Değişkenlerden veri raporu aracına.", olcu: "20 ders · 60 görev" },
    { id: "c", ad: "C", tur: "dil", durum: "hazir", ozet: "Bilgisayarın içini anlamak isteyenlere. İşaretçiler, bellek, yapılar.", olcu: "20 ders · 60 görev" },
    { id: "js", ad: "JavaScript ve Web", tur: "dil", durum: "hazir", ozet: "Dilin temeli, ardından web sayfaları, React, algoritmalar ve sunucu tarafı.", olcu: "50 ders · 150 görev" },
    { id: "siber", ad: "Siber Güvenlik", tur: "lab", durum: "hazir", ozet: "Sıfırdan: terminal, kayıt inceleme, kodlamalar, izinler, dosya arama, web günlükleri, dosya özetleri. Her konu tarayıcıdaki bir lab makinesinde.", olcu: "8 lab hazır · devamı geliyor" },
    { id: "linux", ad: "Linux ve Komut Satırı", tur: "lab", durum: "hazir", ozet: "Dosya kurmak, büyük dosyaları özetlemek, metin dönüştürmek, betik yazmak, sayıyla sıralamak. Siber güvenlik lablarının dayandığı temel.", olcu: "6 lab hazır · devamı geliyor" },
    { id: "ag", ad: "Ağ Temelleri", tur: "lab", durum: "hazir", ozet: "IP adresi, DNS, portlar, HTTP, yönlendirme. Bir isteğin tarayıcıdan sunucuya yolculuğunu komut satırından izle.", olcu: "7 lab hazır · devamı geliyor" },
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
