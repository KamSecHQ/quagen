/* QUAGEN NextGen — Müfredat: Web Temelleri, Ders 11–20
 * Web görevleri tarayıcıda izole bir iframe içinde çalışır ve canlı önizleme verir.
 * lang: "html" → öğrenci HTML yazar · "css" → sabit HTML'e (scaffold) CSS yazar · "js" → sabit HTML'e JS yazar
 * Test biçimi: { label, check: "sayfada çalışan JS ifadesi", expected }
 */
(function () {
  const $q = (sel) => `document.querySelector(${JSON.stringify(sel)})`;
  const css = (sel, prop) => `getComputedStyle(${$q(sel)}).${prop}`;
  const MQ_RULES = `[...document.styleSheets].flatMap(s => [...s.cssRules]).filter(r => r instanceof CSSMediaRule && /max-width:\\s*600px/.test(r.conditionText))`;

  const WEB = [
  /* ============================ DERS 11 ============================ */
  {
    id: "p11", no: 11, track: "web", title: "HTML Anatomisi & Semantik", short: "HTML & Semantik",
    goal: "Sayfanın iskeletini anlamlı etiketlerle kur: tarayıcı, arama motoru ve ekran okuyucu seni anlasın.",
    concepts: ["etiket · öğe · özellik", "header / nav / main / footer", "başlık hiyerarşisi", "alt metni"],
    predict: {
      lang: "html",
      code: '<???>\n  <a href="/">Ana sayfa</a>\n  <a href="/kurslar">Kurslar</a>\n</???>',
      options: ['<div class="menu">', "<nav>", "<menu>", "<section>"], answer: 1,
      why: "<nav> tarayıcıya ve ekran okuyuculara 'bu ana gezinme bölgesi' der. <div> görünüşte aynı olur ama hiçbir anlam taşımaz. Anlam = erişilebilirlik + SEO.",
      run: false
    },
    example: {
      title: "Semantik bir sayfa iskeleti",
      lang: "html",
      code: '<header>\n  <h1>QUAGEN</h1>\n  <nav>\n    <a href="#">Kurslar</a> · <a href="#">Blog</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h2>İlk dersin</h2>\n    <p>Yazarak öğren.</p>\n    <img src="kod.png" alt="Ekranda bir for döngüsü">\n  </article>\n</main>\n<footer>© 2026 QUAGEN</footer>',
      steps: [
        { lines: [1, 2], text: "<header> sayfanın ya da bölümün giriş kısmıdır. Sayfada tek bir <h1> olur: sayfanın ana başlığı." },
        { lines: [3, 4, 5], text: "<nav> ana gezinme bağlantılarını gruplar. <a href> bir bağlantıdır; href = gideceği adres (bir özellik/attribute)." },
        { lines: [7, 8], text: "<main> sayfanın ana içeriği (sayfada bir tane). <article> kendi başına anlamlı bir içerik parçası: blog yazısı, ders kartı…" },
        { lines: [9, 10], text: "Başlıklar seviye atlamaz: h1 → h2 → h3. <p> paragraf." },
        { lines: [11], text: "alt metni görseli göremeyenler için okunur ve görsel yüklenmezse görünür. Boş bırakma!" },
        { lines: [14], text: "<footer> alt bilgi. Önizlemede çalıştırıp sonucu gör." }
      ]
    },
    challenges: [
      {
        id: "p11c1", lang: "html", kind: "Değiştir", title: "Div Çorbasını Temizle", fn: "index",
        prompt: "Aşağıdaki sayfa sadece `<div>`'lerden oluşuyor. `ust` → **header**, `menu` → **nav**, `icerik` → **main**, `alt` → **footer** olacak şekilde semantik etiketlere çevir.",
        starter: '<div class="ust">\n  <div class="menu">\n    <a href="/">Ana sayfa</a>\n    <a href="/kurslar">Kurslar</a>\n    <a href="/iletisim">İletişim</a>\n  </div>\n</div>\n<div class="icerik">\n  <p>QUAGEN\'e hoş geldin!</p>\n</div>\n<div class="alt">© 2026 QUAGEN</div>\n',
        tests: [
          { label: "header içinde nav var", check: `!!${$q("header nav")}`, expected: true },
          { label: "nav içinde 3 bağlantı", check: `document.querySelectorAll("nav a").length`, expected: 3 },
          { label: "main ana içeriği taşıyor", check: `!!${$q("main")} && ${$q("main")}.textContent.includes("hoş geldin")`, expected: true },
          { label: "footer var", check: `!!${$q("footer")}`, expected: true }
        ],
        hints: ["Her div'in 'görevi' ne? Hangi semantik etiket o görevi anlatıyor?", "Açılış ve kapanış etiketini birlikte değiştir: <div class=\"ust\"> … </div> → <header> … </header>", "class özelliklerini silebilirsin; etiketin kendisi artık anlamı taşıyor."],
        solution: '<header>\n  <nav>\n    <a href="/">Ana sayfa</a>\n    <a href="/kurslar">Kurslar</a>\n    <a href="/iletisim">İletişim</a>\n  </nav>\n</header>\n<main>\n  <p>QUAGEN\'e hoş geldin!</p>\n</main>\n<footer>© 2026 QUAGEN</footer>'
      },
      {
        id: "p11c2", lang: "html", kind: "Yaz", title: "Blog Sayfası", fn: "index",
        prompt: "Tek bir `<h1>QUAGEN Blog</h1>` ve altında **iki `<article>`** olan bir sayfa yaz. Her article bir `<h2>` başlık ve bir `<p>` paragraf içersin.",
        starter: "<!-- Blog sayfanı buraya yaz -->\n",
        tests: [
          { label: "tam olarak 1 adet h1", check: `document.querySelectorAll("h1").length`, expected: 1 },
          { label: "h1 metni", check: `(${$q("h1")} || {}).textContent?.trim()`, expected: "QUAGEN Blog" },
          { label: "2 article", check: `document.querySelectorAll("article").length`, expected: 2 },
          { label: "her article'da h2 ve p", check: `document.querySelectorAll("article > h2").length === 2 && document.querySelectorAll("article > p").length >= 2`, expected: true }
        ],
        hints: ["Sayfanın ana başlığı kaç tane olmalı? Yazıların başlıkları hangi seviyede?", "<article> içine önce <h2>, sonra <p> koy. İkinci yazı için bloğu tekrarla.", "<h1>QUAGEN Blog</h1>\n<article><h2>…</h2><p>…</p></article>"],
        solution: "<h1>QUAGEN Blog</h1>\n<article>\n  <h2>Neden yazarak öğrenmeli?</h2>\n  <p>Çünkü beyin üreterek öğrenir.</p>\n</article>\n<article>\n  <h2>Aralıklı tekrar</h2>\n  <p>Unutmadan hemen önce hatırla.</p>\n</article>"
      },
      {
        id: "p11c3", lang: "html", kind: "Yaz", title: "Erişilebilir Görsel & Güvenli Bağlantı", fn: "index",
        prompt: "Görsele anlamlı bir **alt** metni ekle. Bağlantıyı `https://quagen.dev` adresine yönlendir, **yeni sekmede** açılsın (`target=\"_blank\"`) ve güvenlik için `rel=\"noopener\"` içersin.",
        starter: '<img src="logo.png">\n<a href="#">Siteyi ziyaret et</a>\n',
        tests: [
          { label: "img src korunmuş", check: `${$q("img")}?.getAttribute("src")`, expected: "logo.png" },
          { label: "alt metni dolu", check: `(${$q("img")}?.alt || "").trim().length > 0`, expected: true },
          { label: "href doğru", check: `${$q("a")}?.getAttribute("href")`, expected: "https://quagen.dev" },
          { label: "yeni sekmede açılır", check: `${$q("a")}?.target`, expected: "_blank" },
          { label: "rel noopener içerir", check: `(${$q("a")}?.rel || "").includes("noopener")`, expected: true }
        ],
        hints: ["Bir etikete ek bilgi nasıl verilir? Örnekte img'nin yanında ne vardı?", "Özellikler açılış etiketine isim=\"değer\" olarak yazılır: alt=\"…\"", "<a href=\"https://quagen.dev\" target=\"_blank\" rel=\"noopener\">"],
        solution: '<img src="logo.png" alt="QUAGEN logosu">\n<a href="https://quagen.dev" target="_blank" rel="noopener">Siteyi ziyaret et</a>'
      }
    ],
    cards: [
      { id: "p11k1", q: "<div> yerine <nav>, <main> gibi semantik etiket kullanmanın faydası?", a: "Erişilebilirlik (ekran okuyucular bölgeleri tanır), SEO ve okunabilir kod. Görünüm aynı, anlam farklı." },
      { id: "p11k2", q: "Bir sayfada kaç <h1> olmalı ve başlıklar nasıl sıralanmalı?", a: "Bir tane. Seviye atlamadan: h1 → h2 → h3." },
      { id: "p11k3", q: "img etiketinde alt özelliği ne işe yarar?", a: "Görseli göremeyenlere okunur ve görsel yüklenmezse gösterilir. Anlamlı bir açıklama olmalı." }
    ]
  },

  /* ============================ DERS 12 ============================ */
  {
    id: "p12", no: 12, track: "web", title: "Listeler, Tablolar & Formlar", short: "Liste & Form",
    goal: "Veriyi doğru yapıda sun; kullanıcıdan veri alan erişilebilir formlar kur.",
    concepts: ["ol / ul / li", "table · thead · tbody", "label + input", "input türleri & required"],
    predict: {
      lang: "html",
      code: '<label for="e">E-posta</label>\n<input id="e" type="email">',
      options: ["Hiçbir şey olmaz", "Kutu odaklanır (imleç kutuya gider)", "Form gönderilir", "Hata verir"], answer: 1,
      why: "label'ın for değeri input'un id'siyle eşleşirse ikisi bağlanır: etikete tıklamak kutuyu odaklar ve ekran okuyucu kutuyu 'E-posta' diye okur. Önizlemede dene!"
    },
    example: {
      title: "Erişilebilir bir kayıt formu",
      lang: "html",
      code: '<form>\n  <label for="ad">Ad</label>\n  <input id="ad" name="ad" required>\n\n  <label for="yas">Yaş</label>\n  <input id="yas" name="yas" type="number" min="12">\n\n  <button type="submit">Kayıt ol</button>\n</form>',
      steps: [
        { lines: [1, 9], text: "<form> içindeki alanlar birlikte gönderilir." },
        { lines: [2, 3], text: "label for=\"ad\" ↔ input id=\"ad\": bağlantı kuruldu. name, gönderilen verideki anahtar adıdır." },
        { lines: [3], text: "required: alan boşsa tarayıcı formu göndermez ve uyarı gösterir — tek satır JS yazmadan doğrulama." },
        { lines: [6], text: "type=\"number\" mobilde sayı klavyesi açar; min en küçük değeri belirler. email, password, date gibi türler de var." },
        { lines: [8], text: "Önizlemede boş formu göndermeyi dene: tarayıcı seni durduracak." }
      ]
    },
    challenges: [
      {
        id: "p12c1", lang: "html", kind: "Değiştir", title: "Sıralı & Sırasız Liste", fn: "index",
        prompt: "\"Kurulum adımları\" altına **3 maddelik sıralı liste** (`ol`), \"Gerekenler\" altına **2 maddelik sırasız liste** (`ul`) ekle.",
        starter: "<h2>Kurulum adımları</h2>\n<!-- sıralı liste -->\n\n<h2>Gerekenler</h2>\n<!-- sırasız liste -->\n",
        tests: [
          { label: "ol içinde 3 li", check: `document.querySelectorAll("ol > li").length`, expected: 3 },
          { label: "ul içinde 2 li", check: `document.querySelectorAll("ul > li").length`, expected: 2 }
        ],
        hints: ["Sıra önemliyse hangi liste, önemsizse hangisi?", "Her madde <li> ile yazılır ve listenin içine konur.", "<ol>\n  <li>İndir</li>\n  <li>Kur</li>\n  <li>Çalıştır</li>\n</ol>"],
        solution: "<h2>Kurulum adımları</h2>\n<ol>\n  <li>Node.js indir</li>\n  <li>Kur</li>\n  <li>node server.js çalıştır</li>\n</ol>\n\n<h2>Gerekenler</h2>\n<ul>\n  <li>Bilgisayar</li>\n  <li>Merak</li>\n</ul>"
      },
      {
        id: "p12c2", lang: "html", kind: "Yaz", title: "Puan Tablosu", fn: "index",
        prompt: "Başlık satırında **Ad** ve **Puan** sütunları (`thead` içinde `th`) ve `tbody` içinde **2 öğrenci satırı** olan bir tablo yaz.",
        starter: "<table>\n  <!-- thead ve tbody -->\n</table>\n",
        tests: [
          { label: "thead'de 2 th", check: `document.querySelectorAll("table thead th").length`, expected: 2 },
          { label: "başlıklar", check: `[...document.querySelectorAll("thead th")].map(th => th.textContent.trim())`, expected: ["Ad", "Puan"] },
          { label: "tbody'de 2 satır", check: `document.querySelectorAll("tbody tr").length`, expected: 2 },
          { label: "toplam 4 hücre", check: `document.querySelectorAll("tbody td").length`, expected: 4 }
        ],
        hints: ["Tablo satırlardan (tr), satırlar hücrelerden oluşur. Başlık hücresi ile veri hücresi aynı etiket mi?", "<thead><tr><th>Ad</th><th>Puan</th></tr></thead>", "<tbody> içine iki <tr>, her birinde iki <td>."],
        solution: "<table>\n  <thead>\n    <tr><th>Ad</th><th>Puan</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Ece</td><td>92</td></tr>\n    <tr><td>Can</td><td>85</td></tr>\n  </tbody>\n</table>"
      },
      {
        id: "p12c3", lang: "html", kind: "Yaz", title: "Giriş Formu", fn: "index",
        prompt: "Formu düzelt: e-posta alanı `type=\"email\"`, `name=\"email\"` ve **zorunlu** olsun. Şifre alanı `type=\"password\"` ve **en az 8 karakter** (`minlength`). Her input bir **label**'a bağlı olsun.",
        starter: "<form>\n  E-posta <input>\n  Şifre <input>\n  <button>Giriş</button>\n</form>\n",
        tests: [
          { label: "email alanı zorunlu", check: `!!${$q('input[type="email"]')}?.required`, expected: true },
          { label: "email name özelliği", check: `${$q('input[type="email"]')}?.name`, expected: "email" },
          { label: "şifre minlength 8", check: `${$q('input[type="password"]')}?.minLength`, expected: 8 },
          { label: "her input'un label'ı var", check: `[...document.querySelectorAll("input")].every(i => i.labels.length > 0)`, expected: true }
        ],
        hints: ["Örnekteki label'ın input'a nasıl bağlandığını hatırla. Hangi iki özellik eşleşmeliydi?", "<label for=\"email\">E-posta</label> <input id=\"email\" …>", "type=\"email\" name=\"email\" required · type=\"password\" minlength=\"8\""],
        solution: '<form>\n  <label for="email">E-posta</label>\n  <input id="email" name="email" type="email" required>\n  <label for="sifre">Şifre</label>\n  <input id="sifre" name="sifre" type="password" minlength="8">\n  <button>Giriş</button>\n</form>'
      }
    ],
    cards: [
      { id: "p12k1", q: "label bir input'a nasıl bağlanır?", a: "label'ın for değeri input'un id'siyle aynı olur (ya da input label'ın içine yazılır)." },
      { id: "p12k2", q: "ol ile ul farkı?", a: "ol sıralı (numaralı), ul sırasız (madde işaretli) listedir. İkisinde de maddeler li." },
      { id: "p12k3", q: "th ve td farkı?", a: "th başlık hücresi (anlamsal olarak sütun/satır başlığı), td veri hücresi." }
    ]
  },

  /* ============================ DERS 13 ============================ */
  {
    id: "p13", no: 13, track: "web", title: "CSS: Seçiciler & Kutu Modeli", short: "CSS Temelleri",
    goal: "Sayfayı biçimlendir; hangi kuralın neden kazandığını ve her öğenin bir kutu olduğunu kavra.",
    concepts: ["seçiciler", "özgüllük (specificity)", "padding · border · margin", "box-sizing"],
    predict: {
      lang: "html",
      code: '<style>\n  #ana { color: green; }\n  .not { color: blue; }\n  p { color: red; }\n</style>\n<p id="ana" class="not">Ben ne renkteyim?</p>',
      options: ["Kırmızı", "Mavi", "Yeşil", "Siyah"], answer: 2,
      why: "Özgüllük: id (#) > sınıf (.) > etiket. Sıra değil, seçicinin gücü kazanır. id seçicisi en güçlüsü olduğu için yeşil."
    },
    example: {
      title: "Kutu modeli",
      lang: "html",
      code: '<style>\n  .kutu {\n    width: 200px;\n    padding: 20px;\n    border: 5px solid #ff4d1f;\n    margin: 16px;\n  }\n  .duzgun { box-sizing: border-box; }\n</style>\n<div class="kutu">250px genişlik</div>\n<div class="kutu duzgun">200px genişlik</div>',
      steps: [
        { lines: [2, 3], text: "Her öğe bir kutudur: içerik + padding (iç boşluk) + border (kenarlık) + margin (dış boşluk)." },
        { lines: [3, 4, 5], text: "Varsayılan (content-box): width sadece içeriği ölçer. Gerçek genişlik = 200 + 2×20 + 2×5 = 250px!" },
        { lines: [6], text: "margin kutunun dışındaki boşluktur, genişliğe dahil değildir." },
        { lines: [8], text: "box-sizing: border-box ile width padding ve border'ı içine alır: kutu tam 200px olur. Profesyoneller hep bunu kullanır." },
        { lines: [10, 11], text: "Önizlemede iki kutunun genişlik farkını gör." }
      ]
    },
    challenges: [
      {
        id: "p13c1", lang: "css", kind: "Değiştir", title: "Kartı Biçimlendir", fn: "style",
        prompt: "`.kart`'a **24px padding** ve **12px border-radius** ver. `.baslik`'ın rengini **#ff4d1f** yap.",
        scaffold: '<div class="kart">\n  <h2 class="baslik">QUAGEN</h2>\n  <p>Yazarak öğren.</p>\n</div>',
        starter: ".kart {\n  background: #f3efe6;\n  /* padding ve border-radius ekle */\n}\n\n.baslik {\n  /* rengi #ff4d1f yap */\n}\n",
        tests: [
          { label: ".kart padding 24px", check: css(".kart", "paddingTop"), expected: "24px" },
          { label: ".kart köşe yuvarlaklığı 12px", check: css(".kart", "borderTopLeftRadius"), expected: "12px" },
          { label: ".baslik rengi", check: css(".baslik", "color"), expected: "rgb(255, 77, 31)" }
        ],
        hints: ["CSS kuralı: seçici { özellik: değer; } — hangi özellik adlarına ihtiyacın var?", "padding: 24px;  border-radius: 12px;", "Metin rengi için color: #ff4d1f;"],
        solution: ".kart {\n  background: #f3efe6;\n  padding: 24px;\n  border-radius: 12px;\n}\n\n.baslik {\n  color: #ff4d1f;\n}"
      },
      {
        id: "p13c2", lang: "css", kind: "Hata Ayıkla", title: "300px Olmalıydı", fn: "style",
        prompt: "Tasarımcı kutunun **toplam 300px** genişlikte olmasını istiyor ama kutu daha geniş çıkıyor. Padding ve kenarlığı **silmeden** düzelt.",
        scaffold: '<div class="kutu">300px olmalıyım</div>',
        starter: ".kutu {\n  width: 300px;\n  padding: 20px;\n  border: 5px solid #121110;\n}\n",
        tests: [
          { label: "toplam genişlik 300px", check: `${$q(".kutu")}.offsetWidth`, expected: 300 },
          { label: "padding korunmuş", check: css(".kutu", "paddingLeft"), expected: "20px" },
          { label: "border korunmuş", check: css(".kutu", "borderLeftWidth"), expected: "5px" }
        ],
        hints: ["Şu an gerçek genişlik kaç? Hesapla: 300 + padding + border.", "width'in neyi ölçtüğünü değiştiren bir özellik vardı. Örneğe bak.", "box-sizing: border-box;"],
        solution: ".kutu {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 20px;\n  border: 5px solid #121110;\n}"
      },
      {
        id: "p13c3", lang: "css", kind: "Yaz", title: "Sözde Sınıflarla Menü", fn: "style",
        prompt: "HTML'e dokunmadan: menünün **ilk** maddesi kalın (`font-weight: 700`) olsun, **çift sıradaki** (2., 4.) maddelerin arka planı `#eeeeee` olsun.",
        scaffold: '<ul class="menu">\n  <li>Ana sayfa</li>\n  <li>Kurslar</li>\n  <li>Blog</li>\n  <li>İletişim</li>\n</ul>',
        starter: "/* .menu li:… seçicilerini yaz */\n",
        tests: [
          { label: "ilk madde kalın", check: `getComputedStyle(document.querySelectorAll(".menu li")[0]).fontWeight`, expected: "700" },
          { label: "2. madde arka planı", check: `getComputedStyle(document.querySelectorAll(".menu li")[1]).backgroundColor`, expected: "rgb(238, 238, 238)" },
          { label: "3. madde arka plansız", check: `getComputedStyle(document.querySelectorAll(".menu li")[2]).backgroundColor`, expected: "rgba(0, 0, 0, 0)" },
          { label: "4. madde arka planı", check: `getComputedStyle(document.querySelectorAll(".menu li")[3]).backgroundColor`, expected: "rgb(238, 238, 238)" }
        ],
        hints: ["Konumuna göre öğe seçen 'sözde sınıflar' (pseudo-class) iki nokta ile yazılır.", ":first-child ve :nth-child(…) — çift sayılar için hangi anahtar kelime?", ".menu li:nth-child(even) { background: #eeeeee; }"],
        solution: ".menu li:first-child {\n  font-weight: 700;\n}\n.menu li:nth-child(even) {\n  background: #eeeeee;\n}"
      }
    ],
    cards: [
      { id: "p13k1", q: "Özgüllük sıralaması (güçlüden zayıfa)?", a: "inline style > #id > .sınıf / :sözde-sınıf / [özellik] > etiket. Eşitlikte sonra yazılan kazanır." },
      { id: "p13k2", q: "box-sizing: border-box ne yapar?", a: "width/height değerine padding ve border'ı dahil eder; kutu yazdığın genişlikte kalır." },
      { id: "p13k3", q: "padding ile margin farkı?", a: "padding kenarlığın içindeki boşluk (arka plan rengini alır), margin kenarlığın dışındaki boşluk." }
    ]
  },

  /* ============================ DERS 14 ============================ */
  {
    id: "p14", no: 14, track: "web", title: "Flexbox", short: "Flexbox",
    goal: "Öğeleri tek eksende hizala, dağıt ve sar: modern yerleşimin temel aracı.",
    concepts: ["display: flex", "justify-content", "align-items", "gap · flex-wrap · flex"],
    predict: {
      lang: "html",
      code: '<style>\n  .k { display: flex; }\n  .k div { padding: 10px; border: 1px solid; }\n</style>\n<div class="k">\n  <div>1</div><div>2</div><div>3</div>\n</div>',
      options: ["Alt alta dizilir", "Yan yana dizilir", "Üst üste biner", "Görünmez olur"], answer: 1,
      why: "display: flex kapsayıcıyı esnek kutuya çevirir; varsayılan yön (flex-direction) row olduğu için çocuklar yan yana dizilir."
    },
    example: {
      title: "Bir navigasyon çubuğu",
      lang: "html",
      code: '<style>\n  .nav {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 12px;\n    background: #0f1218;\n  }\n  .nav a { color: #c6ff3d; }\n  .linkler { display: flex; gap: 16px; }\n</style>\n<nav class="nav">\n  <strong style="color:#fff">QUAGEN</strong>\n  <div class="linkler"><a>Kurslar</a><a>Blog</a></div>\n</nav>',
      steps: [
        { lines: [3], text: "Kapsayıcıya display: flex — çocukları artık ana eksen (yatay) boyunca dizilir." },
        { lines: [4], text: "justify-content ANA eksende dağıtır: space-between ilk öğeyi başa, sonuncuyu sona iter." },
        { lines: [5], text: "align-items ÇAPRAZ eksende (dikey) hizalar: center ile hepsi dikeyde ortalanır." },
        { lines: [10], text: "İç içe flex: linkler de bir flex kapsayıcı. gap öğeler arası boşluk — margin hesabına gerek yok." },
        { lines: [12, 13, 14, 15], text: "Sonuç: logo solda, linkler sağda, hepsi dikey ortada. Önizlemede gör." }
      ]
    },
    challenges: [
      {
        id: "p14c1", lang: "css", kind: "Değiştir", title: "Tam Ortala", fn: "style",
        prompt: "Flexbox ile `.kutu`'yu `.sahne`'nin **hem yatay hem dikey** tam ortasına yerleştir.",
        scaffold: '<div class="sahne">\n  <div class="kutu"></div>\n</div>',
        starter: ".sahne {\n  height: 200px;\n  background: #0f1218;\n  /* kutuyu tam ortala */\n}\n\n.kutu {\n  width: 60px;\n  height: 60px;\n  background: #c6ff3d;\n}\n",
        tests: [
          { label: ".sahne flex kapsayıcı", check: css(".sahne", "display"), expected: "flex" },
          { label: "yatayda ortalı", check: `(() => { const s = ${$q(".sahne")}.getBoundingClientRect(), k = ${$q(".kutu")}.getBoundingClientRect(); return Math.abs((s.left + s.width / 2) - (k.left + k.width / 2)) < 1.5; })()`, expected: true },
          { label: "dikeyde ortalı", check: `(() => { const s = ${$q(".sahne")}.getBoundingClientRect(), k = ${$q(".kutu")}.getBoundingClientRect(); return Math.abs((s.top + s.height / 2) - (k.top + k.height / 2)) < 1.5; })()`, expected: true }
        ],
        hints: ["Ana eksen ve çapraz eksen için iki ayrı özellik vardı. Hangileri?", "display: flex; justify-content: …; align-items: …;", "İkisinin de değeri center."],
        solution: ".sahne {\n  height: 200px;\n  background: #0f1218;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.kutu {\n  width: 60px;\n  height: 60px;\n  background: #c6ff3d;\n}"
      },
      {
        id: "p14c2", lang: "css", kind: "Yaz", title: "Navbar", fn: "style",
        prompt: "`.nav`: logo **solda**, `.linkler` **sağda**, ikisi **dikeyde ortalı**. `.linkler` içindeki bağlantılar yan yana ve aralarında **16px** boşluk olsun.",
        scaffold: '<nav class="nav">\n  <a class="logo" href="#">QUAGEN</a>\n  <div class="linkler">\n    <a href="#">Kurslar</a>\n    <a href="#">Blog</a>\n    <a href="#">Giriş</a>\n  </div>\n</nav>',
        starter: ".nav {\n  padding: 12px 20px;\n  background: #0f1218;\n}\n.nav a {\n  color: #e8ecf4;\n  text-decoration: none;\n}\n.linkler {\n  \n}\n",
        tests: [
          { label: ".nav flex", check: css(".nav", "display"), expected: "flex" },
          { label: "uçlara dağıtılmış", check: css(".nav", "justifyContent"), expected: "space-between" },
          { label: "dikeyde ortalı", check: css(".nav", "alignItems"), expected: "center" },
          { label: ".linkler flex", check: css(".linkler", "display"), expected: "flex" },
          { label: "linkler arası 16px", check: css(".linkler", "columnGap"), expected: "16px" }
        ],
        hints: ["Örnekteki navbar'ın neredeyse aynısı. Hangi iki kapsayıcı flex olmalı?", ".nav'a display, justify-content ve align-items.", ".linkler { display: flex; gap: 16px; }"],
        solution: ".nav {\n  padding: 12px 20px;\n  background: #0f1218;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.nav a {\n  color: #e8ecf4;\n  text-decoration: none;\n}\n.linkler {\n  display: flex;\n  gap: 16px;\n}"
      },
      {
        id: "p14c3", lang: "css", kind: "Yaz", title: "Sarılan Kartlar", fn: "style",
        prompt: "`.izgara` flex olsun, sığmayan kartlar **alt satıra sarılsın**, kartlar arası **12px** boşluk olsun. Her `.kart` en az **200px** temel genişlikte başlayıp **büyüyebilsin** (`flex: 1 1 200px`).",
        scaffold: '<div class="izgara">\n  <div class="kart">HTML</div>\n  <div class="kart">CSS</div>\n  <div class="kart">JS</div>\n  <div class="kart">DOM</div>\n  <div class="kart">API</div>\n</div>',
        starter: ".izgara {\n  \n}\n.kart {\n  padding: 20px;\n  background: #141822;\n  color: #e8ecf4;\n  border-radius: 10px;\n}\n",
        tests: [
          { label: ".izgara flex", check: css(".izgara", "display"), expected: "flex" },
          { label: "sarma açık", check: css(".izgara", "flexWrap"), expected: "wrap" },
          { label: "12px boşluk", check: css(".izgara", "rowGap"), expected: "12px" },
          { label: "kart büyüyebilir", check: css(".kart", "flexGrow"), expected: "1" },
          { label: "kart temel genişliği 200px", check: css(".kart", "flexBasis"), expected: "200px" }
        ],
        hints: ["Varsayılan olarak flex öğeleri tek satıra sıkışır. Sarmayı açan özellik?", "flex-wrap: wrap; gap: 12px;", "flex kısayolu: büyüme küçülme temel → flex: 1 1 200px;"],
        solution: ".izgara {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n.kart {\n  flex: 1 1 200px;\n  padding: 20px;\n  background: #141822;\n  color: #e8ecf4;\n  border-radius: 10px;\n}"
      }
    ],
    cards: [
      { id: "p14k1", q: "justify-content ile align-items farkı?", a: "justify-content ana eksende (row'da yatay), align-items çapraz eksende (row'da dikey) hizalar." },
      { id: "p14k2", q: "flex: 1 1 200px ne demek?", a: "flex-grow 1 (büyüyebilir), flex-shrink 1 (küçülebilir), flex-basis 200px (başlangıç boyutu)." },
      { id: "p14k3", q: "Bir öğeyi tam ortalamanın en kısa flex yolu?", a: "Kapsayıcıya display: flex; justify-content: center; align-items: center;" }
    ]
  },

  /* ============================ DERS 15 ============================ */
  {
    id: "p15", no: 15, track: "web", title: "CSS Grid & Responsive", short: "Grid & Responsive",
    goal: "İki boyutlu sayfa düzenleri kur ve her ekran boyutuna uyarla.",
    concepts: ["display: grid", "fr birimi · repeat()", "grid-template-areas", "@media"],
    predict: {
      lang: "html",
      code: '<style>\n  .g { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }\n  .g div { background: #c6ff3d; padding: 8px; }\n</style>\n<div class="g">\n  <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>\n</div>',
      options: ["Tek satırda 6 kutu", "3 sütun, 2 satır", "2 sütun, 3 satır", "Alt alta 6 kutu"], answer: 1,
      why: "repeat(3, 1fr) = üç eşit sütun. 6 öğe 3'erli yerleşir → 2 satır. fr, kalan alanın kesri demektir."
    },
    example: {
      title: "Sayfa düzeni + mobil uyum",
      lang: "html",
      code: '<style>\n  .sayfa {\n    display: grid;\n    grid-template-columns: 160px 1fr;\n    grid-template-areas: "ust ust" "yan icerik";\n    gap: 8px;\n  }\n  header { grid-area: ust; } aside { grid-area: yan; } main { grid-area: icerik; }\n  .sayfa > * { background: #141822; color: #fff; padding: 12px; }\n  @media (max-width: 600px) {\n    .sayfa { grid-template-columns: 1fr; grid-template-areas: "ust" "icerik" "yan"; }\n  }\n</style>\n<div class="sayfa"><header>Başlık</header><aside>Menü</aside><main>İçerik</main></div>',
      steps: [
        { lines: [3, 4], text: "Grid iki boyutludur: sütunları tanımla. 160px sabit, 1fr kalan her şey." },
        { lines: [5], text: "grid-template-areas düzeni görsel olarak çizer: üst satırı 'ust' iki sütun boyunca kaplar." },
        { lines: [8], text: "Her öğe grid-area ile bir alana yerleştirilir." },
        { lines: [10, 11, 12], text: "@media: ekran 600px ve altıysa tek sütun ve farklı sıra. Responsive tasarımın temeli." },
        { lines: [14], text: "Önizlemeyi çalıştır; tarayıcıyı daraltırsan düzen değişir." }
      ]
    },
    challenges: [
      {
        id: "p15c1", lang: "css", kind: "Değiştir", title: "Fotoğraf Galerisi", fn: "style",
        prompt: "`.galeri`'yi **3 eşit sütunlu** bir grid yap, hücreler arası **10px** boşluk olsun.",
        scaffold: '<div class="galeri">\n  <div class="foto">1</div><div class="foto">2</div><div class="foto">3</div>\n  <div class="foto">4</div><div class="foto">5</div><div class="foto">6</div>\n</div>',
        starter: ".galeri {\n  \n}\n.foto {\n  height: 60px;\n  background: #3de0ff;\n  display: grid;\n  place-items: center;\n}\n",
        tests: [
          { label: ".galeri grid", check: css(".galeri", "display"), expected: "grid" },
          { label: "3 sütun", check: `${css(".galeri", "gridTemplateColumns")}.split(" ").length`, expected: 3 },
          { label: "sütunlar eşit", check: `(function (a) { return Math.max.apply(null, a) - Math.min.apply(null, a) < 1 ? 1 : a.length; })(${css(".galeri", "gridTemplateColumns")}.split(" ").map(parseFloat))`, expected: 1 },
          { label: "10px boşluk", check: css(".galeri", "rowGap"), expected: "10px" }
        ],
        hints: ["Tahmin sorusundaki galeriye bak.", "grid-template-columns: repeat(…, 1fr);", "display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;"],
        solution: ".galeri {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}\n.foto {\n  height: 60px;\n  background: #3de0ff;\n  display: grid;\n  place-items: center;\n}"
      },
      {
        id: "p15c2", lang: "css", kind: "Yaz", title: "Sayfa Düzeni", fn: "style",
        prompt: "Grid ile: `.ust` tüm genişliği kaplasın; altında `.yan` **200px** genişlikte solda, `.icerik` kalan alanda sağda dursun.",
        scaffold: '<div class="sayfa">\n  <header class="ust">Başlık</header>\n  <aside class="yan">Menü</aside>\n  <main class="icerik">İçerik</main>\n</div>',
        starter: ".sayfa {\n  \n}\n.sayfa > * {\n  padding: 12px;\n  background: #141822;\n  color: #e8ecf4;\n}\n",
        tests: [
          { label: ".yan 200px", check: `Math.round(${$q(".yan")}.getBoundingClientRect().width)`, expected: 200 },
          { label: ".ust tam genişlik", check: `Math.round(${$q(".ust")}.getBoundingClientRect().width) === Math.round(${$q(".sayfa")}.getBoundingClientRect().width)`, expected: true },
          { label: ".icerik yanın sağında, aynı hizada", check: `(() => { const y = ${$q(".yan")}.getBoundingClientRect(), i = ${$q(".icerik")}.getBoundingClientRect(); return i.left >= y.right - 0.5 && Math.round(i.top) === Math.round(y.top); })()`, expected: true }
        ],
        hints: ["İki sütun gerekiyor: biri sabit, biri esnek. Üst satır iki sütunu kaplamalı.", "grid-template-columns: 200px 1fr; ve grid-template-areas ya da grid-column: 1 / -1", ".ust { grid-column: 1 / -1; } — ya da örnekteki areas yöntemi."],
        solution: '.sayfa {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-areas: "ust ust" "yan icerik";\n}\n.ust { grid-area: ust; }\n.yan { grid-area: yan; }\n.icerik { grid-area: icerik; }\n.sayfa > * {\n  padding: 12px;\n  background: #141822;\n  color: #e8ecf4;\n}'
      },
      {
        id: "p15c3", lang: "css", kind: "Yaz", title: "Mobil Uyum", fn: "style",
        prompt: "Galeri masaüstünde 3 sütun. **600px ve altı** ekranlarda (`@media (max-width: 600px)`) `.galeri` **tek sütun** (`1fr`) olsun.",
        scaffold: '<div class="galeri">\n  <div class="foto">1</div><div class="foto">2</div><div class="foto">3</div>\n</div>',
        starter: ".galeri {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}\n.foto { height: 60px; background: #ffc24d; }\n\n/* 600px ve altı ekranlarda tek sütun */\n",
        tests: [
          { label: "max-width: 600px medya sorgusu var", check: `${MQ_RULES}.length > 0`, expected: true },
          { label: "sorgu içinde .galeri tek sütun", check: `${MQ_RULES}.flatMap(r => [...r.cssRules]).some(r => r.selectorText === ".galeri" && r.style.gridTemplateColumns === "1fr")`, expected: true }
        ],
        hints: ["Belirli ekran koşullarında geçerli olan kurallar hangi @-kuralıyla yazılır?", "@media (max-width: 600px) { … } — içine normal CSS kuralı yazılır.", "@media (max-width: 600px) { .galeri { grid-template-columns: 1fr; } }"],
        solution: ".galeri {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}\n.foto { height: 60px; background: #ffc24d; }\n\n@media (max-width: 600px) {\n  .galeri { grid-template-columns: 1fr; }\n}"
      }
    ],
    cards: [
      { id: "p15k1", q: "Flexbox mu Grid mi?", a: "Tek eksende hizalama/dağıtma → Flexbox. Satır ve sütun birlikte (iki boyutlu düzen) → Grid." },
      { id: "p15k2", q: "1fr birimi nedir?", a: "Grid kapsayıcısındaki kalan boş alanın bir payı (fraction)." },
      { id: "p15k3", q: "Mobile-first yaklaşım nedir?", a: "Önce küçük ekran için yaz, büyük ekranlar için @media (min-width: …) ile genişlet." }
    ]
  },

  /* ============================ DERS 16 ============================ */
  {
    id: "p16", no: 16, track: "web", title: "DOM: Seçme & Değiştirme", short: "DOM",
    goal: "JavaScript ile sayfadaki öğeleri bul, içeriklerini ve sınıflarını değiştir, yenilerini üret.",
    concepts: ["querySelector(All)", "textContent", "classList", "createElement · append"],
    predict: {
      lang: "html",
      code: '<p class="x">bir</p>\n<p class="x">iki</p>\n<script>\n  console.log(document.querySelector(".x").textContent);\n</script>',
      options: ["bir", "iki", "bir, iki", "null"], answer: 0,
      why: "querySelector eşleşen İLK öğeyi döndürür. Hepsi için querySelectorAll kullanılır (bir NodeList döner)."
    },
    example: {
      title: "Öğe bul, değiştir, üret",
      lang: "html",
      code: '<h1 id="baslik">Merhaba</h1>\n<ul id="liste"></ul>\n<script>\n  const baslik = document.querySelector("#baslik");\n  baslik.textContent = "Merhaba, DOM!";\n  baslik.classList.add("aktif");\n\n  const li = document.createElement("li");\n  li.textContent = "Yeni madde";\n  document.querySelector("#liste").append(li);\n</script>',
      steps: [
        { lines: [4], text: "DOM, HTML'in JavaScript'teki canlı ağaç hali. querySelector CSS seçicisiyle öğe bulur (#id, .sınıf, etiket)." },
        { lines: [5], text: "textContent öğenin metnini okur/yazar. Kullanıcıdan gelen metin için innerHTML DEĞİL textContent kullan (XSS güvenliği)." },
        { lines: [6], text: "classList.add / remove / toggle / contains — biçimi değiştirmek için sınıf ekleyip çıkar." },
        { lines: [8, 9, 10], text: "Yeni öğe: createElement ile üret, içeriğini ver, append ile ağaca ekle. Ekleyene kadar ekranda görünmez." }
      ]
    },
    challenges: [
      {
        id: "p16c1", lang: "js", kind: "Değiştir", title: "Başlığı Güncelle", fn: "app",
        prompt: "`#baslik`'ın metnini **\"Merhaba QUAGEN\"** yap ve ona **`aktif`** sınıfını ekle.",
        scaffold: '<h1 id="baslik">Merhaba</h1>',
        starter: 'const baslik = document.querySelector("#baslik");\n// metni değiştir ve "aktif" sınıfını ekle\n',
        tests: [
          { label: "metin güncellendi", check: `${$q("#baslik")}.textContent`, expected: "Merhaba QUAGEN" },
          { label: "aktif sınıfı eklendi", check: `${$q("#baslik")}.classList.contains("aktif")`, expected: true }
        ],
        hints: ["Elinde öğe zaten var (baslik). Metni hangi özellikle değiştirirsin?", "baslik.textContent = \"…\";", "baslik.classList.add(\"aktif\");"],
        solution: 'const baslik = document.querySelector("#baslik");\nbaslik.textContent = "Merhaba QUAGEN";\nbaslik.classList.add("aktif");'
      },
      {
        id: "p16c2", lang: "js", kind: "Yaz", title: "Diziden Liste", fn: "app",
        prompt: "`meyveler` dizisindeki her eleman için bir `<li>` oluştur ve `#liste`'ye ekle.",
        scaffold: '<ul id="liste"></ul>',
        starter: 'const meyveler = ["elma", "armut", "muz"];\nconst liste = document.querySelector("#liste");\n\n',
        tests: [
          { label: "3 li oluştu", check: `document.querySelectorAll("#liste li").length`, expected: 3 },
          { label: "metinler doğru sırada", check: `[...document.querySelectorAll("#liste li")].map(li => li.textContent)`, expected: ["elma", "armut", "muz"] }
        ],
        hints: ["Ders 5'teki for...of + örnekteki createElement → ikisini birleştir.", "for (const m of meyveler) { const li = document.createElement(\"li\"); … }", "li.textContent = m; liste.append(li);"],
        solution: 'const meyveler = ["elma", "armut", "muz"];\nconst liste = document.querySelector("#liste");\n\nfor (const m of meyveler) {\n  const li = document.createElement("li");\n  li.textContent = m;\n  liste.append(li);\n}'
      },
      {
        id: "p16c3", lang: "js", kind: "Yaz", title: "Etiket Vurgula", fn: "app",
        prompt: "`vurgula(kelime)` metni `kelime`'ye eşit olan tüm `.etiket` öğelerine **`vurgu`** sınıfını eklesin ve **kaç öğe vurguladığını** döndürsün.",
        scaffold: '<p>\n  <span class="etiket">js</span>\n  <span class="etiket">css</span>\n  <span class="etiket">js</span>\n  <span class="etiket">html</span>\n</p>\n<style>.vurgu { background: #c6ff3d; }</style>',
        starter: "function vurgula(kelime) {\n  \n}\n",
        tests: [
          { label: 'vurgula("js") → 2', check: `vurgula("js")`, expected: 2 },
          { label: 'vurgula("python") → 0', check: `vurgula("python")`, expected: 0 },
          { label: "doğru öğeler vurgulu", check: `(vurgula("css"), [...document.querySelectorAll(".etiket")].filter(e => e.classList.contains("vurgu")).map(e => e.textContent))`, expected: ["js", "css", "js"] }
        ],
        hints: ["Tüm .etiket öğelerini nasıl alırsın? Sonra her biri için ne kontrol etmelisin?", "document.querySelectorAll(\".etiket\") üzerinde for...of; e.textContent === kelime ise…", "Bir sayaç tut: eşleşince classList.add(\"vurgu\") ve sayac++; sonunda return sayac;"],
        solution: 'function vurgula(kelime) {\n  let sayac = 0;\n  for (const e of document.querySelectorAll(".etiket")) {\n    if (e.textContent === kelime) {\n      e.classList.add("vurgu");\n      sayac++;\n    }\n  }\n  return sayac;\n}'
      }
    ],
    cards: [
      { id: "p16k1", q: "textContent ile innerHTML farkı ve güvenlik riski?", a: "innerHTML metni HTML olarak yorumlar; kullanıcı girdisiyle kullanılırsa XSS açığı doğar. Düz metin için textContent." },
      { id: "p16k2", q: "querySelector ile querySelectorAll farkı?", a: "querySelector ilk eşleşeni (ya da null), querySelectorAll hepsini NodeList olarak döndürür." },
      { id: "p16k3", q: "Yeni bir öğeyi sayfaya eklemenin 3 adımı?", a: "document.createElement → içeriği/özellikleri ayarla → ebeveyn.append(öğe)." }
    ]
  },

  /* ============================ DERS 17 ============================ */
  {
    id: "p17", no: 17, track: "web", title: "Olaylar (Events)", short: "Olaylar",
    goal: "Sayfayı kullanıcı etkileşimine tepki verir hale getir: tıklama, yazma, olay kabarcıklanması.",
    concepts: ["addEventListener", "event nesnesi", "kabarcıklanma (bubbling)", "olay delegasyonu"],
    predict: {
      lang: "html",
      code: '<div id="kutu"><button id="b">Tıkla</button></div>\n<script>\n  document.querySelector("#kutu").addEventListener("click", () => console.log("div"));\n  document.querySelector("#b").addEventListener("click", () => console.log("buton"));\n  document.querySelector("#b").click();\n</script>',
      options: ["sadece buton", "div, buton", "buton, div", "sadece div"], answer: 2,
      why: "Olay önce hedefte (buton) tetiklenir, sonra ebeveynlere doğru kabarcıklanır (bubbling): buton → div → body → document."
    },
    example: {
      title: "Bir sayaç",
      lang: "html",
      code: '<button id="arttir">+1</button>\n<strong id="deger">0</strong>\n<script>\n  let sayi = 0;\n  const deger = document.querySelector("#deger");\n  document.querySelector("#arttir").addEventListener("click", (e) => {\n    sayi++;\n    deger.textContent = sayi;\n    console.log("tıklanan:", e.target.id);\n  });\n</script>',
      steps: [
        { lines: [4], text: "Durum (state) bir değişkende tutulur." },
        { lines: [6], text: "addEventListener(olayAdı, fonksiyon): olay olduğunda fonksiyon ÇAĞRILIR. Hemen değil — tıklandığında!" },
        { lines: [7, 8], text: "Durumu güncelle, sonra ekrana yansıt. Bu 'durum → görünüm' akışı React'in de temelidir." },
        { lines: [9], text: "Fonksiyon bir event nesnesi alır: e.target olayı başlatan öğedir. Önizlemede butona bas ve konsola bak." }
      ]
    },
    challenges: [
      {
        id: "p17c1", lang: "js", kind: "Değiştir", title: "Tıklama Sayacı", fn: "app",
        prompt: "`#arttir` butonuna her tıklandığında `sayi` 1 artsın ve `#sayi` öğesinde görünsün.",
        scaffold: '<button id="arttir">+1</button> <span id="sayi">0</span>',
        starter: 'const buton = document.querySelector("#arttir");\nconst sayiEl = document.querySelector("#sayi");\nlet sayi = 0;\n\n// tıklama dinleyicisi ekle\n',
        tests: [
          { label: "1 tıklama → 1", check: `(${$q("#arttir")}.click(), ${$q("#sayi")}.textContent)`, expected: "1" },
          { label: "2 tıklama daha → 3", check: `(${$q("#arttir")}.click(), ${$q("#arttir")}.click(), ${$q("#sayi")}.textContent)`, expected: "3" }
        ],
        hints: ["Örnekteki sayacın neredeyse aynısı. Hangi metotla 'tıklanınca şunu yap' denir?", "buton.addEventListener(\"click\", () => { … });", "İçinde: sayi++; sayiEl.textContent = sayi;"],
        solution: 'const buton = document.querySelector("#arttir");\nconst sayiEl = document.querySelector("#sayi");\nlet sayi = 0;\n\nbuton.addEventListener("click", () => {\n  sayi++;\n  sayiEl.textContent = sayi;\n});'
      },
      {
        id: "p17c2", lang: "js", kind: "Yaz", title: "Canlı Önizleme", fn: "app",
        prompt: "Kullanıcı `#ad` kutusuna **yazdıkça** `#onizleme` paragrafı `Merhaba, AD!` göstersin. (`input` olayı)",
        scaffold: '<input id="ad" placeholder="Adın">\n<p id="onizleme"></p>',
        starter: 'const input = document.querySelector("#ad");\nconst onizleme = document.querySelector("#onizleme");\n',
        tests: [
          { label: '"Ece" yazınca', check: `(() => { const i = ${$q("#ad")}; i.value = "Ece"; i.dispatchEvent(new Event("input")); return ${$q("#onizleme")}.textContent; })()`, expected: "Merhaba, Ece!" },
          { label: '"Can" yazınca güncellenir', check: `(() => { const i = ${$q("#ad")}; i.value = "Can"; i.dispatchEvent(new Event("input")); return ${$q("#onizleme")}.textContent; })()`, expected: "Merhaba, Can!" }
        ],
        hints: ["'click' yerine her tuş vuruşunda tetiklenen olay hangisi?", "input.addEventListener(\"input\", () => { … }); — kutunun içeriği input.value'da.", "onizleme.textContent = `Merhaba, ${input.value}!`;"],
        solution: 'const input = document.querySelector("#ad");\nconst onizleme = document.querySelector("#onizleme");\n\ninput.addEventListener("input", () => {\n  onizleme.textContent = `Merhaba, ${input.value}!`;\n});'
      },
      {
        id: "p17c3", lang: "js", kind: "Yaz", title: "Olay Delegasyonu", fn: "app",
        prompt: "`#gorevler` listesine **tek bir** dinleyici ekle: herhangi bir `li`'ye tıklanınca o li'nin `bitti` sınıfı **açılıp kapansın** (toggle). Sonradan eklenen li'ler de çalışmalı!",
        scaffold: '<ul id="gorevler">\n  <li>Kod yaz</li>\n  <li>Test et</li>\n  <li>Yayınla</li>\n</ul>\n<style>.bitti { text-decoration: line-through; opacity: .5; } li { cursor: pointer; }</style>',
        starter: 'const liste = document.querySelector("#gorevler");\n// TEK bir dinleyiciyle tüm li\'leri yönet\n',
        tests: [
          { label: "tıklayınca bitti", check: `(document.querySelectorAll("#gorevler li")[0].click(), document.querySelectorAll("#gorevler li")[0].classList.contains("bitti"))`, expected: true },
          { label: "tekrar tıklayınca geri alınır", check: `(document.querySelectorAll("#gorevler li")[0].click(), document.querySelectorAll("#gorevler li")[0].classList.contains("bitti"))`, expected: false },
          { label: "sonradan eklenen li de çalışır", check: `(() => { const li = document.createElement("li"); li.textContent = "Yeni"; ${$q("#gorevler")}.append(li); li.click(); return li.classList.contains("bitti"); })()`, expected: true }
        ],
        hints: ["Tahmin sorusunu hatırla: li'ye tıklama, ebeveyni olan ul'ye de ulaşır. Dinleyiciyi nereye koymalısın?", "liste.addEventListener(\"click\", (e) => { … }); — tıklanan öğe e.target", "const li = e.target.closest(\"li\"); if (li) li.classList.toggle(\"bitti\");"],
        solution: 'const liste = document.querySelector("#gorevler");\n\nliste.addEventListener("click", (e) => {\n  const li = e.target.closest("li");\n  if (li) li.classList.toggle("bitti");\n});'
      }
    ],
    cards: [
      { id: "p17k1", q: "Olay kabarcıklanması (bubbling) nedir?", a: "Olay hedef öğede tetiklendikten sonra sırayla tüm ebeveynlerine yayılır." },
      { id: "p17k2", q: "Olay delegasyonu nedir, faydası?", a: "Çok sayıda çocuk yerine ebeveyne tek dinleyici koyup e.target ile hedefi bulmak. Sonradan eklenen öğeler de çalışır, daha az dinleyici." },
      { id: "p17k3", q: "addEventListener(\"click\", f()) neden yanlış?", a: "f() fonksiyonu hemen çalıştırıp sonucunu verir. Fonksiyonun kendisi verilmeli: addEventListener(\"click\", f)." }
    ]
  },

  /* ============================ DERS 18 ============================ */
  {
    id: "p18", no: 18, track: "web", title: "Formlar & Doğrulama", short: "Form Doğrulama",
    goal: "Form gönderimini JavaScript ile yönet, girdiyi doğrula ve kullanıcıya anlaşılır hata göster.",
    concepts: ["submit olayı", "preventDefault", "doğrulama", "FormData"],
    predict: {
      lang: "js",
      code: 'form.addEventListener("submit", (e) => {\n  console.log("gönderildi");\n});\n// Kullanıcı Gönder\'e bastı.',
      options: ["Sadece konsola yazar", "Konsola yazar, sonra sayfa yenilenir", "Hiçbir şey olmaz", "Hata verir"], answer: 1,
      why: "Formun varsayılan davranışı sayfayı gönderip yenilemektir. JavaScript ile yönetmek için e.preventDefault() çağırmalısın.",
      run: false
    },
    example: {
      title: "Gönderimi yakala ve doğrula",
      lang: "html",
      code: '<form id="f">\n  <label for="kad">Kullanıcı adı</label>\n  <input id="kad" name="kad">\n  <button>Gönder</button>\n  <p id="mesaj"></p>\n</form>\n<script>\n  const form = document.querySelector("#f");\n  form.addEventListener("submit", (e) => {\n    e.preventDefault();\n    const veri = Object.fromEntries(new FormData(form));\n    const msg = document.querySelector("#mesaj");\n    msg.textContent = veri.kad.length < 3 ? "En az 3 karakter" : "Hoş geldin " + veri.kad;\n  });\n</script>',
      steps: [
        { lines: [9], text: "Butona tıklamayı değil, formun submit olayını dinle: Enter tuşuyla gönderim de yakalanır." },
        { lines: [10], text: "preventDefault: tarayıcının varsayılan davranışını (sayfayı yenilemek) iptal et." },
        { lines: [11], text: "FormData formdaki tüm alanları name anahtarlarıyla toplar; Object.fromEntries nesneye çevirir: { kad: \"…\" }." },
        { lines: [12, 13], text: "Doğrula ve kullanıcıya NE yapması gerektiğini söyleyen net bir mesaj göster." }
      ]
    },
    challenges: [
      {
        id: "p18c1", lang: "js", kind: "Değiştir", title: "E-posta Kontrolü", fn: "app",
        prompt: "`epostaGecerliMi(metin)`: tam olarak **bir @** olsun, @'ten önce ve sonra karakter olsun, @'ten sonra en az bir **nokta** ve noktadan sonra karakter olsun. Boşluk olmasın.",
        scaffold: "",
        starter: "function epostaGecerliMi(metin) {\n  \n}\n",
        tests: [
          { label: '"ece@quagen.dev" → true', check: `epostaGecerliMi("ece@quagen.dev")`, expected: true },
          { label: '"ece.quagen.dev" → false', check: `epostaGecerliMi("ece.quagen.dev")`, expected: false },
          { label: '"ece@quagen" → false', check: `epostaGecerliMi("ece@quagen")`, expected: false },
          { label: '"@quagen.dev" → false', check: `epostaGecerliMi("@quagen.dev")`, expected: false },
          { label: '"e@@k.dev" → false', check: `epostaGecerliMi("e@@k.dev")`, expected: false },
          { label: '"e ce@k.dev" → false', check: `epostaGecerliMi("e ce@k.dev")`, expected: false }
        ],
        hints: ["Kuralları tek tek yaz: split(\"@\") kaç parça vermeli? Ya da düzenli ifade (regex) kullan.", "const [ad, alan] = metin.split(\"@\"); parça sayısı 2 olmalı, alan bir nokta içermeli…", "Regex: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(metin)"],
        solution: "function epostaGecerliMi(metin) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(metin);\n}"
      },
      {
        id: "p18c2", lang: "js", kind: "Yaz", title: "Şifre Doğrulama", fn: "app",
        prompt: "Form gönderilince sayfa **yenilenmesin**. Şifre 8 karakterden kısaysa `#hata`'ya **\"Şifre en az 8 karakter olmalı\"** yaz. Geçerliyse `#hata`'yı boşalt ve forma **`basarili`** sınıfını ekle.",
        scaffold: '<form id="kayit">\n  <label for="sifre">Şifre</label>\n  <input id="sifre" type="password">\n  <button>Kayıt ol</button>\n  <p id="hata" style="color:#c00"></p>\n</form>',
        starter: 'const form = document.querySelector("#kayit");\n\nform.addEventListener("submit", (e) => {\n  // 1) sayfanın yenilenmesini engelle\n  // 2) şifreyi kontrol et\n});\n',
        tests: [
          { label: "kısa şifrede hata mesajı", check: `(() => { ${$q("#sifre")}.value = "123"; ${$q("#kayit")}.requestSubmit(); return ${$q("#hata")}.textContent; })()`, expected: "Şifre en az 8 karakter olmalı" },
          { label: "geçerli şifrede başarı", check: `(() => { ${$q("#sifre")}.value = "12345678"; ${$q("#kayit")}.requestSubmit(); return [${$q("#hata")}.textContent, ${$q("#kayit")}.classList.contains("basarili")]; })()`, expected: ["", true] },
          { label: "preventDefault kullanıldı", check: `window.__kdNoPrevent !== true`, expected: true }
        ],
        hints: ["Örnekteki submit dinleyicisinin ilk satırı neydi?", "e.preventDefault(); sonra const sifre = document.querySelector(\"#sifre\").value;", "if (sifre.length < 8) { hata.textContent = \"…\"; } else { hata.textContent = \"\"; form.classList.add(\"basarili\"); }"],
        solution: 'const form = document.querySelector("#kayit");\nconst hata = document.querySelector("#hata");\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const sifre = document.querySelector("#sifre").value;\n  if (sifre.length < 8) {\n    hata.textContent = "Şifre en az 8 karakter olmalı";\n  } else {\n    hata.textContent = "";\n    form.classList.add("basarili");\n  }\n});'
      },
      {
        id: "p18c3", lang: "js", kind: "Yaz", title: "Formdan Nesneye", fn: "app",
        prompt: "`formuNesneyeCevir(form)` formdaki alanları `{ name: değer }` nesnesine çevirip döndürsün. (İşaretsiz checkbox'lar dahil edilmez.)",
        scaffold: '<form id="profil">\n  <input name="ad" value="Deniz">\n  <select name="sehir">\n    <option>Ankara</option>\n    <option selected>İzmir</option>\n  </select>\n  <label><input name="bulten" type="checkbox" value="evet" checked> Bülten</label>\n</form>',
        starter: "function formuNesneyeCevir(form) {\n  \n}\n",
        tests: [
          { label: "tüm alanlar", check: `formuNesneyeCevir(${$q("#profil")})`, expected: { ad: "Deniz", sehir: "İzmir", bulten: "evet" } },
          { label: "checkbox işaretsizken", check: `(${$q('[name="bulten"]')}.checked = false, formuNesneyeCevir(${$q("#profil")}))`, expected: { ad: "Deniz", sehir: "İzmir" } }
        ],
        hints: ["Formdaki tüm alanları name'leriyle toplayan hazır bir yapı vardı. Örneğe bak.", "new FormData(form) → [anahtar, değer] çiftleri üretir.", "return Object.fromEntries(new FormData(form));"],
        solution: "function formuNesneyeCevir(form) {\n  return Object.fromEntries(new FormData(form));\n}"
      }
    ],
    cards: [
      { id: "p18k1", q: "e.preventDefault() ne işe yarar?", a: "Olayın varsayılan tarayıcı davranışını iptal eder (form gönderip sayfayı yenilemek, linke gitmek…)." },
      { id: "p18k2", q: "Neden butonun click'i değil formun submit olayı dinlenir?", a: "submit; Enter tuşuyla gönderimi ve tarayıcının yerleşik doğrulamasını (required…) da kapsar." },
      { id: "p18k3", q: "İstemci tarafı doğrulama yeterli mi?", a: "Hayır. Kullanıcı deneyimi içindir; güvenlik için sunucu da mutlaka doğrulamalı." }
    ]
  },

  /* ============================ DERS 19 ============================ */
  {
    id: "p19", no: 19, track: "web", title: "Fetch & API", short: "Fetch & API",
    goal: "Sunucudan veri çek, hataları yönet ve gelen veriyi sayfada göster.",
    concepts: ["fetch", "res.ok · res.json()", "JSON", "yükleniyor / hata durumları"],
    predict: {
      lang: "js",
      code: 'const sonuc = fetch("/api/kurslar");\nconsole.log(sonuc);',
      options: ["Kurs dizisi", "Bir Promise", "JSON metni", "undefined"], answer: 1,
      why: "fetch hemen bir Promise döndürür; ağ cevabı (Response) ileride gelir. Değeri almak için await (veya then) gerekir — Ders 10'u hatırla.",
      run: false
    },
    example: {
      title: "Veri çek ve göster",
      lang: "html",
      code: '<p id="durum">Yükleniyor…</p>\n<script>\n  async function yukle() {\n    const durum = document.querySelector("#durum");\n    try {\n      const res = await fetch("/api/kullanici/1");\n      if (!res.ok) throw new Error("HTTP " + res.status);\n      const k = await res.json();\n      durum.textContent = "Hoş geldin, " + k.ad;\n    } catch (err) {\n      durum.textContent = "Bir sorun oluştu: " + err.message;\n    }\n  }\n  yukle();\n</script>',
      steps: [
        { lines: [1], text: "Kullanıcı beklerken bir 'yükleniyor' durumu göster." },
        { lines: [6], text: "await fetch(url) → Response. Bu platformda /api/... adresleri sahte bir eğitim API'sine gider." },
        { lines: [7], text: "fetch 404/500'de hata FIRLATMAZ! res.ok (200–299) kontrolünü kendin yapmalısın." },
        { lines: [8], text: "res.json() gövdeyi JavaScript nesnesine çevirir — o da bir Promise, await gerekir." },
        { lines: [10, 11], text: "Ağ hatası ya da fırlattığımız hata catch'e düşer: kullanıcıya anlaşılır mesaj." }
      ]
    },
    challenges: [
      {
        id: "p19c1", lang: "js", kind: "Değiştir", title: "Kurs Adları", fn: "app",
        prompt: "`kursAdlari()` async fonksiyonu `/api/kurslar` adresinden kursları çekip **sadece adlarını** dizi olarak döndürsün. (Her kurs: `{ id, ad, sure }`)",
        scaffold: "",
        starter: "async function kursAdlari() {\n  \n}\n",
        tests: [
          { label: "kursAdlari()", check: `kursAdlari()`, expected: ["JavaScript", "CSS", "React"] }
        ],
        hints: ["İki await gerekiyor: biri fetch için, biri json için.", "const res = await fetch(\"/api/kurslar\"); const kurslar = await res.json();", "return kurslar.map(k => k.ad);"],
        solution: 'async function kursAdlari() {\n  const res = await fetch("/api/kurslar");\n  const kurslar = await res.json();\n  return kurslar.map(k => k.ad);\n}'
      },
      {
        id: "p19c2", lang: "js", kind: "Yaz", title: "Güvenli Kullanıcı Getir", fn: "app",
        prompt: "`kullaniciGetir(id)` `/api/kullanici/ID` adresinden kullanıcıyı getirsin. Cevap başarısızsa (`res.ok` false) **null** döndürsün.",
        scaffold: "",
        starter: "async function kullaniciGetir(id) {\n  \n}\n",
        tests: [
          { label: "kullaniciGetir(1)", check: `kullaniciGetir(1)`, expected: { id: 1, ad: "Deniz", rol: "öğrenci" } },
          { label: "kullaniciGetir(99) → null", check: `kullaniciGetir(99)`, expected: null }
        ],
        hints: ["fetch 404'te hata fırlatır mı? Örnekteki 7. satıra bak.", "URL'yi template literal ile kur: `/api/kullanici/${id}`", "if (!res.ok) return null; return await res.json();"],
        solution: "async function kullaniciGetir(id) {\n  const res = await fetch(`/api/kullanici/${id}`);\n  if (!res.ok) return null;\n  return await res.json();\n}"
      },
      {
        id: "p19c3", lang: "js", kind: "Yaz", title: "Kursları Listele", fn: "app",
        prompt: "`kurslariGoster()` kursları çekip `#kurslar` listesini **önce temizlesin**, sonra her kurs için `AD (SÜRE saat)` metinli bir `<li>` eklesin.",
        scaffold: '<h2>Kurslar</h2>\n<ul id="kurslar"><li>Yükleniyor…</li></ul>',
        starter: "async function kurslariGoster() {\n  \n}\n\nkurslariGoster();\n",
        tests: [
          { label: "liste doğru", check: `(async () => { await kurslariGoster(); return [...document.querySelectorAll("#kurslar li")].map(l => l.textContent); })()`, expected: ["JavaScript (10 saat)", "CSS (6 saat)", "React (12 saat)"] },
          { label: "iki kez çağrılınca tekrar etmez", check: `(async () => { await kurslariGoster(); await kurslariGoster(); return document.querySelectorAll("#kurslar li").length; })()`, expected: 3 }
        ],
        hints: ["Üç adım: veriyi çek → listeyi temizle → her kurs için li üret. Ders 16'daki diziden liste görevini hatırla.", "liste.innerHTML = \"\"; ile temizle (burada kullanıcı girdisi yok, güvenli).", "li.textContent = `${k.ad} (${k.sure} saat)`;"],
        solution: 'async function kurslariGoster() {\n  const res = await fetch("/api/kurslar");\n  const kurslar = await res.json();\n  const liste = document.querySelector("#kurslar");\n  liste.innerHTML = "";\n  for (const k of kurslar) {\n    const li = document.createElement("li");\n    li.textContent = `${k.ad} (${k.sure} saat)`;\n    liste.append(li);\n  }\n}\n\nkurslariGoster();'
      }
    ],
    cards: [
      { id: "p19k1", q: "fetch 404 cevabında hata fırlatır mı?", a: "Hayır. Sadece ağ hatasında reddedilir; HTTP hatalarını res.ok / res.status ile kendin kontrol etmelisin." },
      { id: "p19k2", q: "res.json() neden await ister?", a: "Gövde akış halinde gelir; okunup ayrıştırılması asenkron olduğu için Promise döndürür." },
      { id: "p19k3", q: "Veri çeken bir arayüzde hangi 3 durum tasarlanmalı?", a: "Yükleniyor, hata ve başarı (veri / boş liste)." }
    ]
  },

  /* ============================ DERS 20 ============================ */
  {
    id: "p20", no: 20, track: "web", title: "Mini Proje: Yapılacaklar", short: "Mini Proje",
    goal: "Öğrendiğin her şeyi birleştir: durum (state) → render deseniyle gerçek bir uygulama kur.",
    concepts: ["state → render", "tek doğruluk kaynağı", "olaylar + DOM", "bileşenleştirme"],
    predict: {
      lang: "html",
      code: '<ul id="l"></ul>\n<script>\n  const gorevler = ["Kod yaz"];\n  function render() {\n    document.querySelector("#l").innerHTML =\n      gorevler.map(g => "<li>" + g + "</li>").join("");\n  }\n  render();\n  gorevler.push("Test et");\n</script>',
      options: ["1", "2", "0", "Hata"], answer: 0,
      why: "Diziye ekledik ama render'ı tekrar çağırmadık: ekran durumun ESKİ halini gösterir. Kural: durumu her değiştirdiğinde render et. (React bunu otomatik yapar.)"
    },
    example: {
      title: "Durum → render döngüsü",
      lang: "html",
      code: '<button id="b">Beğen</button> <span id="s"></span>\n<script>\n  const durum = { begeni: 0 };\n\n  function render() {\n    document.querySelector("#s").textContent = durum.begeni + " beğeni";\n  }\n\n  document.querySelector("#b").addEventListener("click", () => {\n    durum.begeni++;\n    render();\n  });\n  render();\n</script>',
      steps: [
        { lines: [3], text: "Tek doğruluk kaynağı: uygulamanın tüm verisi tek bir yerde (durum). DOM'dan veri OKUMA, durumdan oku." },
        { lines: [5, 6, 7], text: "render: durumu ekrana çeviren fonksiyon. Ekran = f(durum)." },
        { lines: [9, 10, 11, 12], text: "Olay → durumu değiştir → render. Her etkileşim aynı döngüyü izler; hata ayıklamak kolaylaşır." },
        { lines: [13], text: "İlk görünüm için bir kez render. Bu desen, Ders 21'de React'e geçişini çok kolaylaştıracak." }
      ]
    },
    challenges: [
      {
        id: "p20c1", lang: "js", kind: "Değiştir", title: "Görev Ekle", fn: "app",
        prompt: "`ekle(metin)`: metin boş ya da sadece boşluksa **hiçbir şey yapma**; değilse `gorevler`'e `{ metin, bitti: false }` ekle ve `render()` çağır.",
        scaffold: '<form id="yeni"><input id="metin" placeholder="Yeni görev"> <button>Ekle</button></form>\n<ul id="liste"></ul>\n<p id="sayac"></p>\n<style>.bitti { text-decoration: line-through; opacity: .5; } li { cursor: pointer; }</style>',
        starter: 'const gorevler = []; // tek doğruluk kaynağı\nconst liste = document.querySelector("#liste");\n\nfunction render() {\n  liste.innerHTML = "";\n  for (const g of gorevler) {\n    const li = document.createElement("li");\n    li.textContent = g.metin;\n    liste.append(li);\n  }\n}\n\nfunction ekle(metin) {\n  // boşsa çık; değilse ekle ve render et\n}\n',
        tests: [
          { label: "görev eklenir", check: `(ekle("Kod yaz"), gorevler.length)`, expected: 1 },
          { label: "boş görev eklenmez", check: `(ekle("   "), gorevler.length)`, expected: 1 },
          { label: "ekranda görünür", check: `(ekle("Test et"), [...document.querySelectorAll("#liste li")].map(l => l.textContent))`, expected: ["Kod yaz", "Test et"] },
          { label: "doğru biçimde saklanır", check: `gorevler[0]`, expected: { metin: "Kod yaz", bitti: false } }
        ],
        hints: ["Boşluk kontrolü için Ders 8'de hangi string metodunu kullandın?", "if (metin.trim() === \"\") return;", "gorevler.push({ metin, bitti: false }); render();"],
        solution: 'const gorevler = [];\nconst liste = document.querySelector("#liste");\n\nfunction render() {\n  liste.innerHTML = "";\n  for (const g of gorevler) {\n    const li = document.createElement("li");\n    li.textContent = g.metin;\n    liste.append(li);\n  }\n}\n\nfunction ekle(metin) {\n  if (metin.trim() === "") return;\n  gorevler.push({ metin, bitti: false });\n  render();\n}'
      },
      {
        id: "p20c2", lang: "js", kind: "Yaz", title: "Tamamlandı İşareti", fn: "app",
        prompt: "`degistir(index)` görevin `bitti` değerini tersine çevirip render etsin. render, bitmiş görevlerin `li`'sine **`bitti`** sınıfı eklesin ve bir li'ye **tıklanınca** o görev için `degistir` çağrılsın.",
        scaffold: '<form id="yeni"><input id="metin" placeholder="Yeni görev"> <button>Ekle</button></form>\n<ul id="liste"></ul>\n<p id="sayac"></p>\n<style>.bitti { text-decoration: line-through; opacity: .5; } li { cursor: pointer; }</style>',
        starter: 'const gorevler = [];\nconst liste = document.querySelector("#liste");\n\nfunction render() {\n  liste.innerHTML = "";\n  gorevler.forEach((g, i) => {\n    const li = document.createElement("li");\n    li.textContent = g.metin;\n    // bitti ise sınıf ekle, tıklanınca degistir(i)\n    liste.append(li);\n  });\n}\n\nfunction ekle(metin) {\n  if (metin.trim() === "") return;\n  gorevler.push({ metin, bitti: false });\n  render();\n}\n\nfunction degistir(index) {\n  \n}\n',
        tests: [
          { label: "degistir durumu çevirir", check: `(ekle("A"), ekle("B"), degistir(1), gorevler[1].bitti)`, expected: true },
          { label: "bitti sınıfı görünür", check: `document.querySelectorAll("#liste li")[1].classList.contains("bitti")`, expected: true },
          { label: "tıklamak da çalışır", check: `(document.querySelectorAll("#liste li")[0].click(), gorevler[0].bitti)`, expected: true },
          { label: "geri alınabilir", check: `(degistir(1), document.querySelectorAll("#liste li")[1].classList.contains("bitti"))`, expected: false }
        ],
        hints: ["Durum → render: degistir sadece durumu değiştirip render çağırmalı. DOM'a dokunma!", "gorevler[index].bitti = !gorevler[index].bitti; render();", "render içinde: if (g.bitti) li.classList.add(\"bitti\"); li.addEventListener(\"click\", () => degistir(i));"],
        solution: 'const gorevler = [];\nconst liste = document.querySelector("#liste");\n\nfunction render() {\n  liste.innerHTML = "";\n  gorevler.forEach((g, i) => {\n    const li = document.createElement("li");\n    li.textContent = g.metin;\n    if (g.bitti) li.classList.add("bitti");\n    li.addEventListener("click", () => degistir(i));\n    liste.append(li);\n  });\n}\n\nfunction ekle(metin) {\n  if (metin.trim() === "") return;\n  gorevler.push({ metin, bitti: false });\n  render();\n}\n\nfunction degistir(index) {\n  gorevler[index].bitti = !gorevler[index].bitti;\n  render();\n}'
      },
      {
        id: "p20c3", lang: "js", kind: "Yaz", title: "Sayaç, Temizle & Form", fn: "app",
        prompt: "Uygulamayı tamamla: (1) `kalanSayisi()` bitmemiş görev sayısını döndürsün; (2) render `#sayac`'a **\"N görev kaldı\"** yazsın; (3) `temizle()` bitmiş görevleri silip render etsin; (4) `#yeni` formu gönderilince input'taki metin `ekle` ile eklensin ve input boşalsın.",
        scaffold: '<form id="yeni"><input id="metin" placeholder="Yeni görev"> <button>Ekle</button></form>\n<ul id="liste"></ul>\n<p id="sayac"></p>\n<style>.bitti { text-decoration: line-through; opacity: .5; } li { cursor: pointer; }</style>',
        starter: 'let gorevler = [];\nconst liste = document.querySelector("#liste");\n\nfunction render() {\n  liste.innerHTML = "";\n  gorevler.forEach((g, i) => {\n    const li = document.createElement("li");\n    li.textContent = g.metin;\n    if (g.bitti) li.classList.add("bitti");\n    li.addEventListener("click", () => degistir(i));\n    liste.append(li);\n  });\n  // (2) sayacı güncelle\n}\n\nfunction ekle(metin) {\n  if (metin.trim() === "") return;\n  gorevler.push({ metin, bitti: false });\n  render();\n}\n\nfunction degistir(index) {\n  gorevler[index].bitti = !gorevler[index].bitti;\n  render();\n}\n\nfunction kalanSayisi() {\n  // (1)\n}\n\nfunction temizle() {\n  // (3)\n}\n\n// (4) form gönderimi\n',
        tests: [
          { label: "kalanSayisi", check: `(ekle("A"), ekle("B"), ekle("C"), degistir(0), kalanSayisi())`, expected: 2 },
          { label: "sayaç metni", check: `${$q("#sayac")}.textContent`, expected: "2 görev kaldı" },
          { label: "temizle bitenleri siler", check: `(temizle(), gorevler.map(g => g.metin))`, expected: ["B", "C"] },
          { label: "ekran da güncellenir", check: `document.querySelectorAll("#liste li").length`, expected: 2 },
          { label: "form ile ekleme + input temizlenir", check: `(() => { ${$q("#metin")}.value = "D"; ${$q("#yeni")}.requestSubmit(); return [gorevler.length, ${$q("#metin")}.value, window.__kdNoPrevent !== true]; })()`, expected: [3, "", true] }
        ],
        hints: ["Her parça daha önce yaptığın bir şey: filter (Ders 7), submit + preventDefault (Ders 18).", "kalanSayisi: return gorevler.filter(g => !g.bitti).length; — temizle: gorevler = gorevler.filter(…); render();", "Form: e.preventDefault(); ekle(input.value); input.value = \"\";"],
        solution: 'let gorevler = [];\nconst liste = document.querySelector("#liste");\n\nfunction render() {\n  liste.innerHTML = "";\n  gorevler.forEach((g, i) => {\n    const li = document.createElement("li");\n    li.textContent = g.metin;\n    if (g.bitti) li.classList.add("bitti");\n    li.addEventListener("click", () => degistir(i));\n    liste.append(li);\n  });\n  document.querySelector("#sayac").textContent = `${kalanSayisi()} görev kaldı`;\n}\n\nfunction ekle(metin) {\n  if (metin.trim() === "") return;\n  gorevler.push({ metin, bitti: false });\n  render();\n}\n\nfunction degistir(index) {\n  gorevler[index].bitti = !gorevler[index].bitti;\n  render();\n}\n\nfunction kalanSayisi() {\n  return gorevler.filter(g => !g.bitti).length;\n}\n\nfunction temizle() {\n  gorevler = gorevler.filter(g => !g.bitti);\n  render();\n}\n\ndocument.querySelector("#yeni").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const input = document.querySelector("#metin");\n  ekle(input.value);\n  input.value = "";\n});'
      }
    ],
    cards: [
      { id: "p20k1", q: "'Tek doğruluk kaynağı' ne demek?", a: "Uygulama verisi tek bir yerde (durum) tutulur; ekran ondan türetilir. Veri DOM'dan okunmaz." },
      { id: "p20k2", q: "Durum değişince ekranın güncellenmesi için ne gerekir?", a: "render'ı tekrar çağırmak. (React gibi kütüphaneler bunu otomatik yapar.)" },
      { id: "p20k3", q: "Bir uygulamayı adım adım kurarken sıra?", a: "Önce veri modeli (durum) → render → kullanıcı etkileşimleri (olaylar) → kenar durumları (boş girdi vb.)." }
    ]
  }
  ];

  window.KD_CURRICULUM = (window.KD_CURRICULUM || []).concat(WEB);
})();
