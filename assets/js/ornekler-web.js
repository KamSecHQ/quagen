/* QUAGEN — görev başına benzer çözümlü örnek: Web temelleri (Ders 11–20) ve React (Ders 21–30)
 * Web örnekleri kendi başına çalışan HTML (lang: "html"), React örnekleri JSX (lang: "jsx") olarak önizlenir.
 */
(function () {
  const k = (s, ...v) => String.raw(s, ...v).replace(/^\n/, "").replace(/\s+$/, "").replace(/#\{/g, "${").replace(/‵/g, "`");
  const H = (t, c, n) => ({ t, c, n, lang: "html" });
  const X = (t, c, n) => ({ t, c, n, lang: "jsx" });
  window.KD_ORNEKLER = Object.assign(window.KD_ORNEKLER || {}, {
  /* ---------- Ders 11–20: Web ---------- */
  p11c1: H("Tarif sayfasını anlamlandır", k`
<!-- Önce: <div class="ust">, <div class="yan">, <div class="govde"> -->
<header><h1>Menemen</h1></header>
<aside>Hazırlık: 10 dk</aside>
<main>
  <section><h2>Malzemeler</h2><p>Domates, biber, yumurta.</p></section>
</main>`, "Her div'e 'bu ne işe yarıyor?' diye sor ve o işin etiketini kullan: üst bilgi header, gezinme nav, ana içerik main, alt bilgi footer."),
  p11c2: H("Haber sayfası", k`
<h1>Okul Gazetesi</h1>
<section>
  <h2>Spor</h2>
  <p>Okul takımı finale çıktı.</p>
</section>
<section>
  <h2>Bilim</h2>
  <p>Robot kulübü ödül aldı.</p>
</section>`, "Sayfada tek bir h1 olur; alt bölümlerin başlıkları h2'dir. Kendi başına anlamlı içerikler (yazı, haber) için article kullanılır."),
  p11c3: H("İndirme bağlantısı ve açıklamalı görsel", k`
<img src="https://picsum.photos/seed/dag/200/120" alt="Karlı bir dağ zirvesi" width="200" height="120">
<p><a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN belgeleri (yeni sekme)</a></p>`, "Özellikler açılış etiketine ad=\"değer\" olarak yazılır. alt görseli anlatır; target=\"_blank\" kullanınca rel=\"noopener\" ekle."),
  p12c1: H("Tarif: adımlar ve malzemeler", k`
<h2>Yapılışı</h2>
<ol>
  <li>Suyu kaynat</li>
  <li>Makarnayı ekle</li>
</ol>
<h2>Malzemeler</h2>
<ul>
  <li>Makarna</li>
  <li>Tuz</li>
  <li>Su</li>
</ul>`, "Sırası önemliyse ol (numaralı), önemsizse ul (madde işaretli). Her madde bir li içindedir."),
  p12c2: H("Fiyat tablosu", k`
<table border="1" cellpadding="6">
  <thead>
    <tr><th>Ürün</th><th>Fiyat</th></tr>
  </thead>
  <tbody>
    <tr><td>Kalem</td><td>12 ₺</td></tr>
    <tr><td>Defter</td><td>45 ₺</td></tr>
    <tr><td>Silgi</td><td>6 ₺</td></tr>
  </tbody>
</table>`, "Başlık satırı thead içinde ve hücreleri th; veri satırları tbody içinde ve hücreleri td. Her satır bir tr."),
  p12c3: H("İletişim formu", k`
<form>
  <label for="ad">Adın</label>
  <input id="ad" name="ad" type="text" required minlength="2">
  <label for="tel">Telefon</label>
  <input id="tel" name="tel" type="tel" required>
  <button>Gönder</button>
</form>`, "label'ın for değeri, input'un id değeriyle aynı olmalı. Doğrulama kuralları özelliklerle verilir: type, required, minlength."),
  p13c1: H("Rozeti biçimlendir", k`
<style>
  .rozet { padding: 6px 14px; border-radius: 999px; background: #eef; display: inline-block; }
  .rozet .sayi { color: #1d5fd1; font-weight: 700; }
</style>
<span class="rozet">Yeni mesaj <span class="sayi">3</span></span>`, "Seçici { özellik: değer; }. Nokta sınıfı seçer (.kart). Renkler #rrggbb, boyutlar px ile yazılır."),
  p13c2: H("200px olması gereken düğme", k`
<style>
  /* Sorun: width yalnızca içeriği ölçer; padding ve border genişliğe EKLENİR (200 + 40 + 4 = 244px). */
  .dugme { width: 200px; padding: 20px; border: 2px solid #333; box-sizing: border-box; }
</style>
<div class="dugme">Tam 200px genişliğindeyim</div>
<script>document.querySelector(".dugme").append(" → " + document.querySelector(".dugme").offsetWidth + "px");</script>`, "box-sizing: border-box, width değerine padding ve kenarlığı dahil eder. Böylece hiçbir şeyi silmeden toplam genişlik sabit kalır."),
  p13c3: H("Tablo satırlarını biçimlendir", k`
<style>
  .liste li:last-child { color: #c63434; }
  .liste li:nth-child(odd) { background: #f1f5f9; }
</style>
<ul class="liste"><li>Bir</li><li>İki</li><li>Üç</li><li>Dört (son)</li></ul>`, "Sözde sınıflar HTML'e dokunmadan konuma göre seçer: :first-child, :last-child, :nth-child(odd / even / 3)."),
  p14c1: H("Sağ alta yerleştir", k`
<style>
  .alan { display: flex; justify-content: flex-end; align-items: flex-end; height: 140px; background: #eef2ff; }
  .nokta { width: 40px; height: 40px; background: #4f46e5; border-radius: 50%; }
</style>
<div class="alan"><div class="nokta"></div></div>`, "display: flex kapsayıcıya verilir. justify-content yatayda, align-items dikeyde hizalar; ikisi de center olursa tam orta."),
  p14c2: H("Araç çubuğu", k`
<style>
  .cubuk { display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #111; color: #fff; }
  .eylemler { display: flex; gap: 8px; }
  .eylemler button { padding: 6px 10px; }
</style>
<div class="cubuk"><b>Belgem</b><div class="eylemler"><button>Kaydet</button><button>Paylaş</button></div></div>`, "space-between ilk öğeyi sola, sonuncuyu sağa iter. İç grubu da flex yapıp gap ile aralık verirsin."),
  p14c3: H("Sarılan etiketler", k`
<style>
  .etiketler { display: flex; flex-wrap: wrap; gap: 8px; max-width: 260px; }
  .etiket { flex: 1 1 90px; padding: 6px; background: #fde68a; text-align: center; }
</style>
<div class="etiketler"><span class="etiket">html</span><span class="etiket">css</span><span class="etiket">javascript</span><span class="etiket">react</span><span class="etiket">sql</span></div>`, "flex-wrap: wrap sığmayanı alt satıra indirir. flex: büyüme küçülme temel-genişlik; 1 1 90px = 90px'ten başla, boşluk varsa büyü."),
  p15c1: H("Takvim ızgarası", k`
<style>
  .takvim { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .takvim div { padding: 8px 0; background: #e0f2fe; text-align: center; }
</style>
<div class="takvim"><div>Pt</div><div>Sa</div><div>Ça</div><div>Pe</div><div>Cu</div><div>Ct</div><div>Pz</div><div>1</div><div>2</div><div>3</div></div>`, "repeat(N, 1fr) N eşit sütun demektir. gap hücreler arasındaki boşluktur."),
  p15c2: H("Panel düzeni", k`
<style>
  .panel { display: grid; grid-template-columns: 1fr 160px; gap: 8px; }
  .panel > * { padding: 12px; background: #f1f5f9; }
  .panel .baslik { grid-column: 1 / -1; background: #c7d2fe; }
</style>
<div class="panel"><div class="baslik">Başlık (tüm genişlik)</div><div>İçerik</div><div>Yan bilgi (160px)</div></div>`, "Sabit ve esnek sütunları karıştırabilirsin (160px 1fr). grid-column: 1 / -1 bir öğeyi ilk çizgiden son çizgiye yayar."),
  p15c3: H("Dar ekranda alt alta menü", k`
<style>
  .menu { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .menu a { padding: 8px; background: #dcfce7; text-align: center; }
  @media (max-width: 500px) {
    .menu { grid-template-columns: 1fr 1fr; }
  }
</style>
<nav class="menu"><a>Ana sayfa</a><a>Kurslar</a><a>Blog</a><a>İletişim</a></nav>
<p>Önizlemeyi daralt: 500px altında iki sütuna iner.</p>`, "@media (max-width: X) { ... } içindeki kurallar yalnızca ekran X'ten dar olduğunda geçerlidir ve öncekileri ezer."),
  p16c1: H("Durum etiketini güncelle", k`
<p id="durum">Bekleniyor…</p>
<style>.tamam { color: #11805b; font-weight: 700; }</style>
<script>
  const durum = document.querySelector("#durum");
  durum.textContent = "Yüklendi";
  durum.classList.add("tamam");
</script>`, "querySelector CSS seçicisiyle öğeyi bulur (# id, . sınıf). textContent metni, classList.add sınıfı değiştirir."),
  p16c2: H("Diziden seçenek üret", k`
<select id="sehir"></select>
<script>
  const sehirler = ["Ankara", "İzmir", "Bursa"];
  const secim = document.querySelector("#sehir");
  for (const s of sehirler) {
    const o = document.createElement("option");
    o.textContent = s;
    secim.append(o);
  }
</script>`, "Üç adım: createElement ile oluştur, textContent ile doldur, append ile ebeveyne ekle. Bunu dizinin her elemanı için tekrarla."),
  p16c3: H("Uzun kelimeleri işaretle", k`
<p><span class="kelime">kod</span> <span class="kelime">algoritma</span> <span class="kelime">veri</span> <span class="kelime">değişken</span></p>
<style>.uzun { background: #fde68a; }</style>
<p id="sonuc"></p>
<script>
  function uzunlariIsaretle(sinir) {
    let adet = 0;
    for (const el of document.querySelectorAll(".kelime")) {
      if (el.textContent.length > sinir) { el.classList.add("uzun"); adet++; }
    }
    return adet;
  }
  document.querySelector("#sonuc").textContent = uzunlariIsaretle(4) + " kelime işaretlendi";
</script>`, "querySelectorAll eşleşen TÜM öğeleri verir; for...of ile dolaş, koşulu sağlayana sınıf ekle ve say."),
  p17c1: H("Beğeni düğmesi", k`
<button id="begen">♥ Beğen</button> <span id="adet">0</span>
<script>
  let adet = 0;
  document.querySelector("#begen").addEventListener("click", () => {
    adet += 2;
    document.querySelector("#adet").textContent = adet;
  });
</script>`, "addEventListener(\"click\", fonksiyon): her tıklamada fonksiyon çalışır. İçinde durumu değiştir, sonra ekrana yaz."),
  p17c2: H("Karakter sayacı", k`
<textarea id="mesaj" placeholder="Mesajın"></textarea>
<p id="sayac">0 / 50</p>
<script>
  const mesaj = document.querySelector("#mesaj");
  mesaj.addEventListener("input", () => {
    document.querySelector("#sayac").textContent = mesaj.value.length + " / 50";
  });
</script>`, "input olayı her tuş vuruşunda tetiklenir. Kutunun o anki içeriği .value ile okunur."),
  p17c3: H("Tek dinleyiciyle sekmeler", k`
<div id="sekmeler"><button>Genel</button><button>Ayarlar</button><button>Yardım</button></div>
<style>.secili { background: #111; color: #fff; }</style>
<script>
  document.querySelector("#sekmeler").addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;         // boşluğa tıklandıysa yok say
    e.target.classList.toggle("secili");
  });
</script>`, "Dinleyiciyi ebeveyne bağla; e.target tıklanan asıl öğedir. Böylece sonradan eklenen çocuklar da kendiliğinden çalışır."),
  p18c1: H("Kullanıcı adı kontrolü", k`
<p id="s"></p>
<script>
  function kullaniciAdiGecerliMi(ad) {
    if (ad.includes(" ")) return false;
    if (ad.length < 3 || ad.length > 12) return false;
    const ilk = ad[0];
    return ilk.toLowerCase() !== ilk.toUpperCase();     // harfle başlamalı
  }
  document.querySelector("#s").textContent = ["ada", "a b", "9lives", "x"].map((a) => a + ": " + kullaniciAdiGecerliMi(a)).join(" · ");
</script>`, "Kuralları tek tek, erken return ile kontrol et. E-posta için metni split(\"@\") ile böl ve parçaların sayısına, boş olup olmadığına bak."),
  p18c2: H("Yaş doğrulama", k`
<form id="f"><label for="yas">Yaş</label> <input id="yas" type="number"> <button>Devam</button><p id="uyari" style="color:#c00"></p></form>
<script>
  document.querySelector("#f").addEventListener("submit", (e) => {
    e.preventDefault();                                   // sayfa yenilenmesin
    const yas = Number(document.querySelector("#yas").value);
    const uyari = document.querySelector("#uyari");
    if (yas < 18) { uyari.textContent = "18 yaşından büyük olmalısın"; return; }
    uyari.textContent = "";
    e.target.classList.add("onayli");
    e.target.append(" ✓");
  });
</script>`, "submit olayında önce e.preventDefault(). Sonra değeri oku, geçersizse mesajı yaz ve çık; geçerliyse mesajı temizle."),
  p18c3: H("Formu sorgu dizesine çevir", k`
<form id="arama"><input name="q" value="react"><select name="sira"><option selected>yeni</option><option>eski</option></select></form>
<p id="s"></p>
<script>
  function sorguyaCevir(form) {
    return [...new FormData(form)].map(([ad, deger]) => ad + "=" + encodeURIComponent(deger)).join("&");
  }
  document.querySelector("#s").textContent = sorguyaCevir(document.querySelector("#arama"));
</script>`, "new FormData(form) alanları [name, değer] çiftleri olarak verir (işaretsiz kutular hariç). Object.fromEntries bu çiftleri nesneye çevirir."),
  p19c1: H("Kullanıcının rolü", k`
<p id="s">Yükleniyor…</p>
<script>
  async function rolGetir(id) {
    const res = await fetch("/api/kullanici/" + id);
    const k = await res.json();
    return k.rol;
  }
  rolGetir(2).then((rol) => (document.querySelector("#s").textContent = "Rol: " + rol));
</script>`, "İki await: fetch yanıtı, res.json() gövdeyi verir. Gelen veri normal bir nesne ya da dizidir; dizi geldiyse map ile istediğin alanı al."),
  p19c2: H("Bulunamayan sayfayı ele al", k`
<p id="s"></p>
<script>
  async function kursSayisi() {
    const res = await fetch("/api/olmayan-adres");
    if (!res.ok) return 0;                     // 404, 500… → yedek değer
    return (await res.json()).length;
  }
  kursSayisi().then((n) => (document.querySelector("#s").textContent = "Kurs sayısı: " + n));
</script>`, "fetch 404'te hata fırlatmaz; res.ok false olur. json() çağırmadan önce res.ok'u kontrol et."),
  p19c3: H("Kullanıcı kartını doldur", k`
<div id="kart">Yükleniyor…</div>
<script>
  async function kartiGoster(id) {
    const k = await (await fetch("/api/kullanici/" + id)).json();
    const kart = document.querySelector("#kart");
    kart.innerHTML = "";                        // önce eski içeriği temizle
    const h = document.createElement("h3");
    h.textContent = k.ad + " (" + k.rol + ")";
    kart.append(h);
  }
  kartiGoster(1);
</script>`, "Veriyi çek → kabı temizle (innerHTML = \"\") → her kayıt için öğe oluşturup ekle. Kullanıcı verisini textContent ile yaz."),
  p20c1: H("Alışveriş listesine ekle", k`
<ul id="l"></ul>
<script>
  const urunler = [];
  function ciz() { document.querySelector("#l").innerHTML = urunler.map((u) => "<li>" + u.ad + " × " + u.adet + "</li>").join(""); }
  function urunEkle(ad) {
    if (ad.trim() === "") return;               // boş girdiyi yok say
    urunler.push({ ad: ad.trim(), adet: 1 });
    ciz();
  }
  urunEkle("süt"); urunEkle("   "); urunEkle("ekmek");
</script>`, "Durum bir dizide durur; her değişiklikten sonra ekranı baştan çizen fonksiyonu çağır. Önce geçersiz girdiyi ele."),
  p20c2: H("Favori işareti", k`
<ul id="l"></ul>
<style>.fav { font-weight: 700; color: #b45309; } li { cursor: pointer; }</style>
<script>
  const filmler = [{ ad: "Matrix", fav: false }, { ad: "Inception", fav: true }];
  function favDegistir(i) { filmler[i].fav = !filmler[i].fav; ciz(); }
  function ciz() {
    const l = document.querySelector("#l");
    l.innerHTML = "";
    filmler.forEach((f, i) => {
      const li = document.createElement("li");
      li.textContent = f.ad;
      if (f.fav) li.classList.add("fav");
      li.addEventListener("click", () => favDegistir(i));
      l.append(li);
    });
  }
  ciz();
</script>`, "Çizim sırasında her satıra kendi indeksini bilen bir tıklama dinleyicisi bağla; dinleyici durumu değiştirip yeniden çizer."),
  p20c3: H("Not defteri: say, temizle, formdan ekle", k`
<form id="f"><input id="n" placeholder="Not"><button>Ekle</button></form>
<ul id="l"></ul><p id="ozet"></p><button id="sil">Önemsizleri sil</button>
<script>
  let notlar = [{ metin: "Sınav", onemli: true }, { metin: "Film", onemli: false }];
  const onemliSayisi = () => notlar.filter((x) => x.onemli).length;
  function ciz() {
    document.querySelector("#l").innerHTML = notlar.map((x) => "<li>" + x.metin + "</li>").join("");
    document.querySelector("#ozet").textContent = onemliSayisi() + " önemli not";
  }
  document.querySelector("#sil").addEventListener("click", () => { notlar = notlar.filter((x) => x.onemli); ciz(); });
  document.querySelector("#f").addEventListener("submit", (e) => {
    e.preventDefault();
    const kutu = document.querySelector("#n");
    if (kutu.value.trim()) notlar.push({ metin: kutu.value.trim(), onemli: false });
    kutu.value = "";
    ciz();
  });
  ciz();
</script>`, "Sayma ve silme filter ile yapılır; özet her çizimde yeniden hesaplanır. Form gönderiminde: preventDefault, ekle, kutuyu boşalt, çiz."),

  /* ---------- Ders 21–30: React ---------- */
  p21c1: X("Karşılama kartı", k`
function Karsilama() {
  return (
    <div>
      <h2>Hoş geldin!</h2>
      <p className="not">Bugün ne öğreneceksin?</p>
    </div>
  );
}
function App() { return <Karsilama />; }`, "Bileşen, JSX döndüren bir fonksiyondur. Birden çok öğe tek bir kapsayıcı içinde döner; class yerine className yazılır."),
  p21c2: X("Kitap kartı", k`
const kitap = { ad: "Temiz Kod", yazar: "R. C. Martin", sayfa: 464 };
function KitapKarti() {
  return (
    <article className="kitap">
      <h3>{kitap.ad}</h3>
      <p>{kitap.yazar} · {kitap.sayfa} sayfa</p>
    </article>
  );
}
function App() { return <KitapKarti />; }`, "Süslü parantez içine JavaScript ifadesi yazılır: {nesne.alan}. Sabit metinle değişkeni yan yana koyabilirsin."),
  p21c3: X("Üç JSX hatası düzeltildi", k`
// Hatalı sürüm:  <div class="kutu"> <br> <input type="text"> </div> <p>Not</p>
function Form() {
  return (
    <>
      <div className="kutu">       {/* 1: class → className */}
        <br />                      {/* 2: her etiket kapanmalı */}
        <input type="text" />
      </div>
      <p>Not</p>                    {/* 3: iki kök öğe <>…</> ile sarılır */}
    </>
  );
}
function App() { return <Form />; }`, "JSX'in üç katı kuralı: className, kendini kapatan etiketler (<br />, <img />) ve tek kök öğe (ya da <>…</>)."),
  p22c1: X("Props ile rozet", k`
function Rozet({ metin }) {
  return <span style={{ background: "#fde68a", padding: "2px 8px", marginRight: 6 }}>{metin}</span>;
}
function App() {
  return <p><Rozet metin="Yeni" /><Rozet metin="İndirim" /></p>;
}`, "Props, bileşene dışarıdan verilen değerlerdir. Parametrede { ad } diye açarsın, JSX içinde {ad} diye kullanırsın."),
  p22c2: X("Uyarı kutusu (varsayılan tür)", k`
function Uyari({ mesaj, tur = "bilgi", onKapat }) {
  return (
    <div className={"uyari uyari-" + tur} style={{ padding: 8, border: "1px solid #999", marginBottom: 6 }}>
      {mesaj} <button onClick={onKapat}>×</button>
    </div>
  );
}
function App() {
  return <><Uyari mesaj="Kaydedildi" onKapat={() => console.log("kapatıldı")} /><Uyari mesaj="Disk dolu" tur="hata" /></>;
}`, "Varsayılan değer parametrede verilir: { tur = \"bilgi\" }. className bir ifadeyle kurulabilir; fonksiyon prop'u doğrudan onClick'e bağlanır."),
  p22c3: X("children ile çerçeve", k`
function Cerceve({ etiket, children }) {
  return (
    <fieldset style={{ marginBottom: 8 }}>
      <legend>{etiket}</legend>
      <div className="govde">{children}</div>
    </fieldset>
  );
}
function App() {
  return <Cerceve etiket="Profil"><p>Ada Lovelace</p><button>Düzenle</button></Cerceve>;
}`, "Bileşenin açılış ve kapanış etiketi arasına yazılan her şey children prop'u olarak gelir; onu istediğin yere {children} ile koyarsın."),
  p23c1: X("Beğeni sayacı", k`
function App() {
  const [begeni, setBegeni] = React.useState(0);
  return (
    <button onClick={() => setBegeni(begeni + 1)}>♥ {begeni}</button>
  );
}`, "useState [değer, değiştirici] verir. Olayı onClick={() => setX(...)} ile bağla; state değişince bileşen yeniden çizilir."),
  p23c2: X("Ayrıntıları aç / kapat", k`
function App() {
  const [detay, setDetay] = React.useState(false);
  return (
    <div>
      <button onClick={() => setDetay(!detay)}>{detay ? "Daha az" : "Daha fazla"}</button>
      {detay && <p>Kargo 2 gün içinde yola çıkar.</p>}
    </div>
  );
}`, "kosul && <Öğe /> yalnızca koşul doğruyken render eder. Metin için üçlü işleç: {acik ? \"A\" : \"B\"}."),
  p23c3: X("+2 neden +1 artıyor?", k`
function App() {
  const [puan, setPuan] = React.useState(10);
  // Hatalı: setPuan(puan + 1); setPuan(puan + 1);  → ikisi de aynı eski değeri görür
  const ikiArttir = () => { setPuan((p) => p + 1); setPuan((p) => p + 1); };
  const azalt = () => setPuan((p) => Math.max(0, p - 5));     // alt sınır
  return <p>{puan} <button onClick={ikiArttir}>+2</button> <button onClick={azalt}>−5</button></p>;
}`, "Art arda güncellemelerde fonksiyon biçimini kullan: setX((onceki) => ...). Sınır gerekiyorsa Math.max / Math.min ile kırp."),
  p24c1: X("Etiket listesi", k`
const etiketler = [{ id: 1, ad: "html" }, { id: 2, ad: "css" }, { id: 3, ad: "js" }];
function App() {
  return (
    <ul>
      {etiketler.map((e) => <li key={e.id}>{"#" + e.ad}</li>)}
    </ul>
  );
}`, "Listeler map ile render edilir. Her öğeye benzersiz ve kalıcı bir key ver (id varsa id; metinler benzersizse metnin kendisi)."),
  p24c2: X("Mesaj kutusu + boş durum", k`
function Mesajlar({ mesajlar }) {
  if (mesajlar.length === 0) return <p className="bos">Yeni mesaj yok.</p>;
  return <ol>{mesajlar.map((m) => <li key={m.id}>{m.kimden}: {m.metin}</li>)}</ol>;
}
function App() {
  return <><Mesajlar mesajlar={[{ id: 1, kimden: "Ece", metin: "Selam" }]} /><Mesajlar mesajlar={[]} /></>;
}`, "Boş durumu en başta erken return ile ele al; kalanı normal liste. Metni {a} ({b} saat) gibi parçalardan kurabilirsin."),
  p24c3: X("Stok özeti", k`
function Stok({ urunler }) {
  const tukenen = urunler.filter((u) => u.adet === 0).length;
  return (
    <div>
      <ul>{urunler.map((u) => <li key={u.ad} className={u.adet === 0 ? "tukendi" : ""}>{u.ad}</li>)}</ul>
      <p className="ozet">{tukenen}/{urunler.length} tükendi</p>
    </div>
  );
}
function App() { return <Stok urunler={[{ ad: "Kalem", adet: 3 }, { ad: "Silgi", adet: 0 }]} />; }`, "Koşullu sınıf: className={kosul ? \"x\" : \"\"}. Özet sayıyı state'te tutma; render sırasında filter ile hesapla."),
  p25c1: X("Canlı fiyat hesabı", k`
function App() {
  const [adet, setAdet] = React.useState("");
  return (
    <div>
      <input value={adet} onChange={(e) => setAdet(e.target.value)} placeholder="Adet" />
      <p>{adet === "" ? "Adet gir" : "Tutar: " + Number(adet) * 12 + " ₺"}</p>
    </div>
  );
}`, "Kontrollü input: value state'ten gelir, onChange state'i günceller. Ekrandaki diğer her şey o state'ten hesaplanır."),
  p25c2: X("Gönder düğmesini koşula bağla", k`
function App() {
  const [ad, setAd] = React.useState("");
  const [kabul, setKabul] = React.useState(false);
  const gecerli = ad.trim().length >= 3 && kabul;        // türetilmiş değer: ayrı state yok
  return (
    <form>
      <input value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Ad (en az 3 harf)" />
      <label><input type="checkbox" checked={kabul} onChange={(e) => setKabul(e.target.checked)} /> Kabul ediyorum</label>
      <button disabled={!gecerli}>Gönder</button>
    </form>
  );
}`, "Doğrulama sonucunu state'te tutma: mevcut state'lerden her render'da hesapla ve disabled={!gecerli} olarak kullan."),
  p25c3: X("Yapılacak ekle", k`
function App() {
  const [isler, setIsler] = React.useState(["Kod yaz"]);
  const [yeni, setYeni] = React.useState("");
  const gonder = (e) => {
    e.preventDefault();
    const metin = yeni.trim();
    if (!metin) return;
    setIsler([...isler, metin]);       // diziyi değiştirme, yenisini kur
    setYeni("");
  };
  return (
    <form onSubmit={gonder}>
      <input value={yeni} onChange={(e) => setYeni(e.target.value)} /><button>Ekle</button>
      <ul>{isler.map((i) => <li key={i}>{i}</li>)}</ul>
    </form>
  );
}`, "onSubmit'te preventDefault; trim ile kırp, boşsa çık. Diziye push yerine [...eski, yeni] ile yeni dizi ver, sonra kutuyu temizle."),
  p26c1: X("Konsola sayaç günlüğü", k`
function App() {
  const [tik, setTik] = React.useState(0);
  const [gunluk, setGunluk] = React.useState("");
  React.useEffect(() => {
    setGunluk("Son tıklama sayısı: " + tik);      // tik her değiştiğinde çalışır
  }, [tik]);
  return <p><button onClick={() => setTik(tik + 1)}>Tıkla</button> {gunluk}</p>;
}`, "useEffect(fonksiyon, [bağımlılıklar]): render'dan sonra ve yalnızca listedeki değerler değişince çalışır. document.title gibi dış dünyayı burada güncelle."),
  p26c2: X("Kullanıcıyı ilk yüklemede getir", k`
function App() {
  const [kullanici, setKullanici] = React.useState(null);
  React.useEffect(() => {
    fetch("/api/kullanici/1").then((r) => r.json()).then(setKullanici);
  }, []);                                          // boş dizi: yalnızca ilk render'da
  if (!kullanici) return <p>Yükleniyor…</p>;
  return <h3>{kullanici.ad}</h3>;
}`, "Boş bağımlılık dizisi 'bir kez çalış' demektir. Veri gelene kadar state null/boş kalır; ona göre 'yükleniyor' göster."),
  p26c3: X("Seçime bağlı veri", k`
function Rol({ id }) {
  const [rol, setRol] = React.useState("…");
  React.useEffect(() => {
    setRol("…");
    fetch("/api/kullanici/" + id).then((r) => (r.ok ? r.json() : null)).then((k) => setRol(k ? k.rol : "bulunamadı"));
  }, [id]);                                        // id değişince yeniden çek
  return <p>Kullanıcı {id}: {rol}</p>;
}
function App() {
  const [id, setId] = React.useState(1);
  return <><button onClick={() => setId(id === 1 ? 2 : 1)}>Değiştir</button><Rol id={id} /></>;
}`, "Effect'in kullandığı prop'u bağımlılık dizisine yaz; değişince effect yeniden çalışır. res.ok false ise hata durumunu göster."),
  p27c1: X("Ortak sayaç: state'i yukarı taşı", k`
function Dugme({ onArttir }) { return <button onClick={onArttir}>+1</button>; }
function Gosterge({ sayi }) { return <b> Toplam: {sayi}</b>; }
function App() {
  const [sayi, setSayi] = React.useState(0);        // state ortak ebeveynde
  return <p><Dugme onArttir={() => setSayi(sayi + 1)} /><Gosterge sayi={sayi} /></p>;
}`, "İki kardeş bileşen aynı veriyi kullanacaksa state en yakın ortak ebeveyne taşınır: değer aşağı prop olarak, değiştirici fonksiyon olarak iner."),
  p27c2: X("Oylama", k`
function Aday({ ad, onOyVer }) { return <button className="oy" onClick={() => onOyVer(ad)}>{ad}</button>; }
function App() {
  const [oylar, setOylar] = React.useState([]);
  return (
    <div>
      {["Kedi", "Köpek"].map((a) => <Aday key={a} ad={a} onOyVer={(x) => setOylar([...oylar, x])} />)}
      <p>{oylar.length} oy · Kedi: {oylar.filter((o) => o === "Kedi").length}</p>
    </div>
  );
}`, "Çocuk, olayı onX(veri) ile yukarı bildirir; ebeveyn state'i günceller. Toplam ve adet gibi özetler state'ten hesaplanır (reduce, length)."),
  p27c3: X("Tek seçimli sekmeler", k`
function Sekme({ baslik, secili, onSec, children }) {
  return <div><button onClick={onSec} style={{ fontWeight: secili ? 700 : 400 }}>{baslik}</button>{secili && <p>{children}</p>}</div>;
}
function App() {
  const [secili, setSecili] = React.useState(0);
  const sekmeler = [["Genel", "Genel ayarlar"], ["Gizlilik", "Gizlilik ayarları"]];
  return <>{sekmeler.map(([b, icerik], i) => <Sekme key={b} baslik={b} secili={secili === i} onSec={() => setSecili(i)}>{icerik}</Sekme>)}</>;
}`, "Her panelde ayrı 'açık' state'i yerine ebeveynde tek bir 'hangisi açık' index'i tut. Kapatmak için aynı index gelirse null yap."),
  p28c1: X("Ses düzeyi reducer'ı", k`
function sesReducer(state, action) {
  switch (action.type) {
    case "ac": return { ...state, duzey: Math.min(10, state.duzey + 1) };
    case "kis": return { ...state, duzey: Math.max(0, state.duzey - 1) };
    case "sustur": return { ...state, duzey: 0 };
    default: return state;                          // bilinmeyen action: aynı nesne
  }
}
function App() {
  const [s, dispatch] = React.useReducer(sesReducer, { duzey: 5 });
  return <p>Ses: {s.duzey} <button onClick={() => dispatch({ type: "ac" })}>+</button><button onClick={() => dispatch({ type: "sustur" })}>Sustur</button></p>;
}`, "Reducer (state, action) alır, YENİ state döndürür: { ...state, alan: yeni }. Her action bir case; default aynı state'i döndürür."),
  p28c2: X("Yapılacaklar reducer'ı", k`
function islerReducer(state, action) {
  switch (action.type) {
    case "ekle": return { isler: [...state.isler, { id: action.id, metin: action.metin, bitti: false }] };
    case "degistir": return { isler: state.isler.map((i) => (i.id === action.id ? { ...i, bitti: !i.bitti } : i)) };
    case "sil": return { isler: state.isler.filter((i) => i.id !== action.id) };
    default: return state;
  }
}
function App() {
  let s = { isler: [] };
  s = islerReducer(s, { type: "ekle", id: 1, metin: "Kod yaz" });
  s = islerReducer(s, { type: "degistir", id: 1 });
  return <pre>{JSON.stringify(s, null, 1)}</pre>;
}`, "Dizide değiştirmeden güncelleme: eklemek için [...dizi, yeni], birini değiştirmek için map, silmek için filter. 'Varsa güncelle, yoksa ekle' için önce some/find ile bak."),
  p28c3: X("Reducer'ı bileşene bağla", k`
function sayacReducer(state, action) {
  if (action.type === "arttir") return { adet: state.adet + action.miktar };
  if (action.type === "sifirla") return { adet: 0 };
  return state;
}
function App() {
  const [state, dispatch] = React.useReducer(sayacReducer, { adet: 0 });
  return (
    <div>
      {[1, 5].map((m) => <button key={m} onClick={() => dispatch({ type: "arttir", miktar: m })}>+{m}</button>)}
      <b> {state.adet} </b>
      <button onClick={() => dispatch({ type: "sifirla" })}>Sıfırla</button>
    </div>
  );
}`, "useReducer(reducer, başlangıç) → [state, dispatch]. Olaylarda dispatch({ type, ...veri }) çağır; ekranı state'ten çiz."),
  p29c1: X("useAcKapa hook'u", k`
function useAcKapa(baslangic = false) {
  const [acik, setAcik] = React.useState(baslangic);
  const degistir = () => setAcik((a) => !a);
  return { acik, degistir };
}
function App() {
  const menu = useAcKapa();
  return <div><button onClick={menu.degistir}>Menü</button>{menu.acik && <ul><li>Profil</li><li>Çıkış</li></ul>}</div>;
}`, "Custom hook, adı use ile başlayan ve içinde başka hook'lar kullanan fonksiyondur. State'i ve onu değiştiren fonksiyonları nesne olarak döndür."),
  p29c2: X("Dil context'i", k`
const DilContext = React.createContext("tr");
function Selam() {
  const dil = React.useContext(DilContext);
  return <p className={"dil-" + dil}>{dil === "tr" ? "Merhaba" : "Hello"}</p>;
}
function App() {
  return <DilContext.Provider value="en"><Selam /></DilContext.Provider>;
}`, "createContext bir kanal açar; Provider value ile değeri yayınlar; alttaki her bileşen useContext ile prop taşımadan okur."),
  p29c3: X("useKullanici: yükleme ve hata durumu olan hook", k`
function useKullanici(id) {
  const [durum, setDurum] = React.useState({ veri: null, yukleniyor: true, hata: null });
  React.useEffect(() => {
    setDurum({ veri: null, yukleniyor: true, hata: null });
    fetch("/api/kullanici/" + id)
      .then((r) => { if (!r.ok) throw new Error("Bulunamadı (" + r.status + ")"); return r.json(); })
      .then((veri) => setDurum({ veri, yukleniyor: false, hata: null }))
      .catch((e) => setDurum({ veri: null, yukleniyor: false, hata: e.message }));
  }, [id]);
  return durum;
}
function App() {
  const { veri, yukleniyor, hata } = useKullanici(9);
  return <p>{yukleniyor ? "Yükleniyor…" : hata ? hata : veri.ad}</p>;
}`, "Üç durumu birlikte yönet: yükleniyor, veri, hata. res.ok değilse hata fırlat ve catch'te hata durumuna geç; bağımlılık dizisine url'yi yaz."),
  p30c1: X("Kullanıcı ara", k`
function App() {
  const [kurslar, setKurslar] = React.useState([]);
  const [q, setQ] = React.useState("");
  React.useEffect(() => { fetch("/api/kurslar").then((r) => r.json()).then(setKurslar); }, []);
  const gorunen = kurslar.filter((k) => k.ad.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara" />
      <ul>{gorunen.map((k) => <li key={k.id}>{k.ad}</li>)}</ul>
    </div>
  );
}`, "Süzülmüş listeyi state'te tutma: ham veri + arama metni state'tir, görünen liste her render'da filter ile hesaplanır."),
  p30c2: X("Seçili satırlar (id kümesi)", k`
function App() {
  const urunler = [{ id: 1, ad: "Kalem" }, { id: 2, ad: "Defter" }];
  const [secili, setSecili] = React.useState([]);            // yalnızca id'ler
  const degistir = (id) => setSecili(secili.includes(id) ? secili.filter((x) => x !== id) : [...secili, id]);
  return (
    <div>
      {urunler.map((u) => <button key={u.id} onClick={() => degistir(u.id)}>{secili.includes(u.id) ? "☑" : "☐"} {u.ad}</button>)}
      <p>{secili.length} seçili</p>
    </div>
  );
}`, "Seçim/favori gibi işaretleri öğenin içinde değil, ayrı bir id listesinde tut: liste süzülse ya da sıralansa bile kaybolmaz."),
  p30c3: X("Sırala ve süz (orijinali bozmadan)", k`
function App() {
  const kisiler = [{ ad: "Zeynep", yas: 35 }, { ad: "Ali", yas: 19 }, { ad: "Ece", yas: 24 }];
  const [sira, setSira] = React.useState("varsayilan");
  const [genc, setGenc] = React.useState(false);
  let liste = genc ? kisiler.filter((k) => k.yas < 30) : kisiler;
  if (sira === "ad") liste = [...liste].sort((a, b) => a.ad.localeCompare(b.ad, "tr"));
  if (sira === "yas") liste = [...liste].sort((a, b) => a.yas - b.yas);
  return (
    <div>
      <select value={sira} onChange={(e) => setSira(e.target.value)}><option value="varsayilan">Varsayılan</option><option value="ad">Ad</option><option value="yas">Yaş</option></select>
      <label><input type="checkbox" checked={genc} onChange={(e) => setGenc(e.target.checked)} /> 30 yaş altı</label>
      <ul>{liste.map((k) => <li key={k.ad}>{k.ad} ({k.yas})</li>)}</ul>
    </div>
  );
}`, "sort diziyi yerinde değiştirir; önce [...liste] ile kopyala. Süzme ve sıralama ayarları state, sonuç liste türetilmiş değerdir.")
  });
})();
