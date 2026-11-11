/* QUAGEN NextGen — Müfredat: React, Ders 21–30
 * lang: "jsx" → kod tarayıcıda Babel ile derlenir, React 18 ile izole iframe'de çalışır.
 * `import ... from "react"` ve `export` satırları gerçek projedeki gibi yazılabilir (otomatik ayıklanır).
 * App bileşeni tanımlıysa #root'a otomatik bağlanır.
 * Test yardımcıları: kd.mount(Bileşen, props) · kd.hook(() => useX()) · kd.click · kd.type · kd.submit · kd.text · kd.$ · kd.$$ · kd.tick · kd.errs
 */
(function () {
  const J = (v) => JSON.stringify(v);
  const GOREVLER = J([{ id: 1, metin: "A", bitti: true }, { id: 2, metin: "B", bitti: false }, { id: 3, metin: "C", bitti: true }]);
  const ADLAR = `kd.$$("li.kurs .ad").map((e) => e.textContent)`;

  const REACT = [
  /* ============================ DERS 21 ============================ */
  {
    id: "p21", no: 21, track: "react", title: "JSX & İlk Bileşen", short: "JSX & Bileşen",
    goal: "Arayüzü küçük, yeniden kullanılabilir fonksiyonlara böl ve JSX ile tarif et.",
    concepts: ["bileşen = fonksiyon", "JSX", "{ } ile ifade", "className · Fragment"],
    predict: {
      lang: "jsx",
      code: `function App() {
  return <p>Toplam: {2 + 3}</p>;
}`,
      options: ["Toplam: {2 + 3}", "Toplam: 2 + 3", "Toplam: 5", "Hata verir"], answer: 2,
      why: "JSX içinde süslü parantez 'buraya JavaScript ifadesi geliyor' demektir. {2 + 3} hesaplanır ve 5 olarak ekrana basılır."
    },
    example: {
      title: "Bir profil bileşeni",
      lang: "jsx",
      code: `function Profil() {
  const kullanici = { ad: "Ece", seviye: 3 };
  return (
    <>
      <h2 className="baslik">{kullanici.ad}</h2>
      <p>Seviye: {kullanici.seviye * 10} XP</p>
    </>
  );
}

function App() {
  return <Profil />;
}`,
      steps: [
        { lines: [1], text: "React bileşeni, JSX döndüren sıradan bir fonksiyondur. Adı BÜYÜK harfle başlar (Profil) — küçük harfli olanlar HTML etiketi sanılır." },
        { lines: [2], text: "Bileşen içinde normal JavaScript yazabilirsin: değişkenler, hesaplamalar…" },
        { lines: [4, 7], text: "JSX tek bir kök döndürmeli. Fazladan div istemiyorsan Fragment kullan: <> … </>" },
        { lines: [5], text: "HTML'deki class yerine className (class JavaScript'te ayrılmış bir kelime). {kullanici.ad} değeri metne gömer." },
        { lines: [11, 12, 13], text: "Bileşenler etiket gibi kullanılır: <Profil />. App kök bileşendir; platform onu sayfaya bağlar. Çalıştır ve önizlemeye bak." }
      ]
    },
    challenges: [
      {
        id: "p21c1", lang: "jsx", kind: "Değiştir", title: "İlk Bileşenin", fn: "App",
        prompt: "`Selam` bileşeni bir `<h1>` içinde **Merhaba, QUAGEN!** ve altında `className=\"alt\"` olan bir `<p>` içinde **Yazarak öğren.** göstersin.",
        starter: `function Selam() {
  return <h1>Merhaba!</h1>;
}

function App() {
  return <Selam />;
}
`,
        tests: [
          { label: "h1 metni", check: `kd.mount(Selam).querySelector("h1")?.textContent`, expected: "Merhaba, QUAGEN!" },
          { label: "p.alt metni", check: `kd.mount(Selam).querySelector("p.alt")?.textContent`, expected: "Yazarak öğren." }
        ],
        hints: ["İki öğe döndürmen gerekiyor. JSX kaç kök kabul ediyordu?", "İkisini bir Fragment içine al: return ( <> … </> );", "<p className=\"alt\">Yazarak öğren.</p> — class değil className."],
        solution: `function Selam() {
  return (
    <>
      <h1>Merhaba, QUAGEN!</h1>
      <p className="alt">Yazarak öğren.</p>
    </>
  );
}

function App() {
  return <Selam />;
}`
      },
      {
        id: "p21c2", lang: "jsx", kind: "Yaz", title: "Kurs Kartı", fn: "App",
        prompt: "`KursKarti` bileşeni `kurs` nesnesinden veriyi **süslü parantezle** okuyup şunu göstersin: `<article className=\"kurs\">` içinde `<h3>` kurs adı ve `<p>` **12 saat · Orta**.",
        starter: `const kurs = { ad: "React", sure: 12, seviye: "Orta" };

function KursKarti() {
  return null;
}

function App() {
  return <KursKarti />;
}
`,
        tests: [
          { label: "article.kurs var", check: `!!kd.mount(KursKarti).querySelector("article.kurs")`, expected: true },
          { label: "h3 kurs adı", check: `kd.mount(KursKarti).querySelector("h3")?.textContent`, expected: "React" },
          { label: "p süre · seviye", check: `kd.mount(KursKarti).querySelector("p")?.textContent`, expected: "12 saat · Orta" },
          { label: "veri değişince arayüz değişir", check: `(() => { kurs.ad = "Vue"; const t = kd.mount(KursKarti).querySelector("h3")?.textContent; kurs.ad = "React"; return t; })()`, expected: "Vue" }
        ],
        hints: ["Metni elle yazmak yerine nesneden okumalısın. JSX'te JavaScript ifadesi nasıl yazılıyordu?", "<h3>{kurs.ad}</h3>", "<p>{kurs.sure} saat · {kurs.seviye}</p> — hepsini <article className=\"kurs\"> içine al."],
        solution: `const kurs = { ad: "React", sure: 12, seviye: "Orta" };

function KursKarti() {
  return (
    <article className="kurs">
      <h3>{kurs.ad}</h3>
      <p>{kurs.sure} saat · {kurs.seviye}</p>
    </article>
  );
}

function App() {
  return <KursKarti />;
}`
      },
      {
        id: "p21c3", lang: "jsx", kind: "Hata Ayıkla", title: "Derlenmeyen Logo", fn: "App",
        prompt: "Bu bileşende **üç** JSX hatası var; derlenmiyor bile. Önce **Çalıştır**'a bas, hata mesajını oku, sırayla düzelt. (İpucu: JSX, HTML'den daha katıdır.)",
        starter: `function Logo() {
  return (
    <img src="logo.png" alt="QUAGEN" class="logo">
    <p>QUAGEN</p>
  );
}

function App() {
  return <Logo />;
}
`,
        tests: [
          { label: "img.logo alt metni", check: `kd.mount(Logo).querySelector("img.logo")?.getAttribute("alt")`, expected: "QUAGEN" },
          { label: "p metni", check: `kd.mount(Logo).querySelector("p")?.textContent`, expected: "QUAGEN" },
          { label: "React uyarısı yok (className)", check: `!kd.errs.some((e) => /Invalid DOM property/.test(e))`, expected: true }
        ],
        hints: ["Hata mesajı 'Expected corresponding JSX closing tag' ya da 'Adjacent JSX elements' diyor olabilir. JSX'te her etiket kapanmalı mı?", "Tek etiketler kendini kapatmalı: <img … />. Yan yana iki öğe bir Fragment'e sarılmalı.", "Üçüncü hata derlemeyi bozmaz ama React konsola uyarı basar: class → className."],
        solution: `function Logo() {
  return (
    <>
      <img src="logo.png" alt="QUAGEN" className="logo" />
      <p>QUAGEN</p>
    </>
  );
}

function App() {
  return <Logo />;
}`
      }
    ],
    cards: [
      { id: "p21k1", q: "React bileşeni nedir ve adı neden büyük harfle başlar?", a: "JSX döndüren bir fonksiyon. Büyük harf, onu HTML etiketinden (div, p) ayırır." },
      { id: "p21k2", q: "JSX'te HTML'den farklı olan 3 kural?", a: "Tek kök (gerekirse Fragment <>), her etiket kapanır (<img />), class yerine className." },
      { id: "p21k3", q: "JSX'te JavaScript ifadesi nasıl yazılır?", a: "Süslü parantez içinde: {kullanici.ad}, {2 + 3}, {liste.length}" }
    ]
  },

  /* ============================ DERS 22 ============================ */
  {
    id: "p22", no: 22, track: "react", title: "Props & Kompozisyon", short: "Props",
    goal: "Bileşenlere dışarıdan veri ver; küçük parçalardan büyük arayüzler kur.",
    concepts: ["props", "destructuring", "varsayılan değer", "children"],
    predict: {
      lang: "jsx",
      code: `function Selam({ ad }) {
  return <p>Merhaba, {ad}!</p>;
}

function App() {
  return <Selam isim="Ece" />;
}`,
      options: ["Merhaba, Ece!", "Merhaba, !", "Merhaba, undefined!", "Hata verir"], answer: 1,
      why: "Bileşen 'ad' prop'unu bekliyor ama 'isim' gönderildi. ad undefined olur ve React undefined'ı ekrana hiçbir şey olarak basar. Prop adları birebir eşleşmeli."
    },
    example: {
      title: "Yeniden kullanılabilir kart",
      lang: "jsx",
      code: `function Rozet({ metin, renk = "#c6ff3d" }) {
  return <span style={{ background: renk, padding: "2px 8px" }}>{metin}</span>;
}

function Kart({ baslik, children }) {
  return (
    <section style={{ border: "1px solid #ccc", padding: 12, marginBottom: 8 }}>
      <h3>{baslik}</h3>
      {children}
    </section>
  );
}

function App() {
  return (
    <>
      <Kart baslik="React"><Rozet metin="Yeni" /></Kart>
      <Kart baslik="CSS"><Rozet metin="Popüler" renk="#3de0ff" /></Kart>
    </>
  );
}`,
      steps: [
        { lines: [1], text: "Props, bileşene verilen tek bir nesnedir. { metin, renk } ile parçalarız (destructuring). renk = \"#c6ff3d\" varsayılan değer." },
        { lines: [2], text: "style bir nesne alır: dıştaki {} JavaScript, içteki {} nesne. Özellik adları camelCase." },
        { lines: [5, 9], text: "children: açılış ve kapanış etiketi arasına yazılan her şey. Kart içine ne konacağını bilmez — kompozisyon." },
        { lines: [16, 17], text: "Aynı bileşen farklı props ile tekrar tekrar kullanılır. Props salt okunurdur: bileşen kendi props'unu değiştirmez." }
      ]
    },
    challenges: [
      {
        id: "p22c1", lang: "jsx", kind: "Değiştir", title: "Props ile Selam", fn: "App",
        prompt: "`Selam` bileşeni `ad` prop'unu alıp **Merhaba, AD!** yazsın. App zaten iki farklı ad gönderiyor.",
        starter: `function Selam() {
  return <p>Merhaba, misafir!</p>;
}

function App() {
  return (
    <>
      <Selam ad="Ece" />
      <Selam ad="Can" />
    </>
  );
}
`,
        tests: [
          { label: 'ad="Ece"', check: `kd.mount(Selam, { ad: "Ece" }).textContent`, expected: "Merhaba, Ece!" },
          { label: 'ad="Can"', check: `kd.mount(Selam, { ad: "Can" }).textContent`, expected: "Merhaba, Can!" },
          { label: "App iki selam gösterir", check: `kd.$$("#root p").map((p) => p.textContent)`, expected: ["Merhaba, Ece!", "Merhaba, Can!"] }
        ],
        hints: ["Bileşen fonksiyonu ilk parametresinde ne alır?", "function Selam({ ad }) { … }", "<p>Merhaba, {ad}!</p>"],
        solution: `function Selam({ ad }) {
  return <p>Merhaba, {ad}!</p>;
}

function App() {
  return (
    <>
      <Selam ad="Ece" />
      <Selam ad="Can" />
    </>
  );
}`
      },
      {
        id: "p22c2", lang: "jsx", kind: "Yaz", title: "Buton Bileşeni", fn: "App",
        prompt: "`Buton({ metin, tur, onClick })`: `className` değeri **btn btn-TUR** olsun, `tur` verilmezse **birincil** kullanılsın. `onClick` prop'u butona bağlansın.",
        starter: `function Buton() {
  return <button>Buton</button>;
}

function App() {
  return (
    <>
      <Buton metin="Kaydet" />
      <Buton metin="Vazgeç" tur="ikincil" onClick={() => alert("vazgeçildi")} />
    </>
  );
}
`,
        tests: [
          { label: "varsayılan tür", check: `kd.mount(Buton, { metin: "Kaydet" }).querySelector("button")?.className`, expected: "btn btn-birincil" },
          { label: "tur=\"ikincil\"", check: `kd.mount(Buton, { metin: "x", tur: "ikincil" }).querySelector("button")?.className`, expected: "btn btn-ikincil" },
          { label: "metin", check: `kd.mount(Buton, { metin: "Kaydet" }).querySelector("button")?.textContent`, expected: "Kaydet" },
          { label: "onClick çalışır", check: `(() => { let n = 0; kd.mount(Buton, { metin: "x", onClick: () => n++ }).querySelector("button").click(); return n; })()`, expected: 1 }
        ],
        hints: ["Üç prop'u parçala; birine varsayılan değer ver. Örnekteki Rozet'e bak.", "function Buton({ metin, tur = \"birincil\", onClick })", "className={`btn btn-${tur}`} onClick={onClick}"],
        solution: `function Buton({ metin, tur = "birincil", onClick }) {
  return (
    <button className={\`btn btn-\${tur}\`} onClick={onClick}>
      {metin}
    </button>
  );
}

function App() {
  return (
    <>
      <Buton metin="Kaydet" />
      <Buton metin="Vazgeç" tur="ikincil" onClick={() => alert("vazgeçildi")} />
    </>
  );
}`
      },
      {
        id: "p22c3", lang: "jsx", kind: "Yaz", title: "children ile Kart", fn: "App",
        prompt: "`Kart({ baslik, children })`: `<section className=\"kart\">` içinde `<h3>` başlık ve `<div className=\"icerik\">` içinde **children** göstersin.",
        starter: `function Kart() {
  return null;
}

function App() {
  return (
    <Kart baslik="React">
      <p>Bileşenlerle düşün.</p>
    </Kart>
  );
}
`,
        tests: [
          { label: "başlık", check: `kd.mount(Kart, { baslik: "React", children: "x" }).querySelector("section.kart h3")?.textContent`, expected: "React" },
          { label: "metin children", check: `kd.mount(Kart, { baslik: "x", children: "Bileşenler" }).querySelector(".icerik")?.textContent`, expected: "Bileşenler" },
          { label: "öğe children", check: `kd.mount(Kart, { baslik: "x", children: React.createElement("b", null, "kalın") }).querySelector(".icerik b")?.textContent`, expected: "kalın" }
        ],
        hints: ["Etiketlerin arasına yazılanlar hangi özel prop'a gelir?", "function Kart({ baslik, children })", "<div className=\"icerik\">{children}</div>"],
        solution: `function Kart({ baslik, children }) {
  return (
    <section className="kart">
      <h3>{baslik}</h3>
      <div className="icerik">{children}</div>
    </section>
  );
}

function App() {
  return (
    <Kart baslik="React">
      <p>Bileşenlerle düşün.</p>
    </Kart>
  );
}`
      }
    ],
    cards: [
      { id: "p22k1", q: "Props nedir, bileşen kendi props'unu değiştirebilir mi?", a: "Ebeveynden gelen salt okunur veri nesnesi. Hayır — değişecek veri state olmalı." },
      { id: "p22k2", q: "children prop'u nedir?", a: "Bileşenin açılış ve kapanış etiketi arasına yazılan içerik. Kompozisyonun temelidir." },
      { id: "p22k3", q: "style={{ color: \"red\" }} neden çift süslü parantez?", a: "Dıştaki {} JSX'te JavaScript ifadesi, içteki {} bir nesne literal'i." }
    ]
  },

  /* ============================ DERS 23 ============================ */
  {
    id: "p23", no: 23, track: "react", title: "State & Olaylar", short: "useState",
    goal: "Zamanla değişen veriyi state ile yönet; React'in yeniden render döngüsünü kavra.",
    concepts: ["useState", "onClick", "yeniden render", "fonksiyonel güncelleme"],
    predict: {
      lang: "jsx",
      code: `function App() {
  let sayi = 0;
  return (
    <button onClick={() => { sayi++; console.log(sayi); }}>
      {sayi}
    </button>
  );
}
// Butona 3 kez tıklandı. Ekranda ne yazar?`,
      options: ["0", "3", "1", "Hata verir"], answer: 0,
      why: "Normal değişken değişince React haberdar olmaz, ekran yeniden çizilmez (konsolda 1,2,3 görünür ama buton 0 kalır). Ekranı güncellemek için state gerekir. Önizlemede dene!"
    },
    example: {
      title: "Bir beğeni butonu",
      lang: "jsx",
      code: `import { useState } from "react";

function Begen() {
  const [sayi, setSayi] = useState(0);
  const [begendi, setBegendi] = useState(false);

  function tikla() {
    setBegendi(!begendi);
    setSayi((s) => (begendi ? s - 1 : s + 1));
  }

  return (
    <button onClick={tikla}>
      {begendi ? "💚" : "🤍"} {sayi}
    </button>
  );
}

export default function App() {
  return <Begen />;
}`,
      steps: [
        { lines: [1], text: "Gerçek projede hook'lar react paketinden import edilir. (Platformda bu satır isteğe bağlı.)" },
        { lines: [4], text: "useState(başlangıç) → [değer, değiştirici]. Değiştirici çağrılınca React bileşeni YENİDEN ÇALIŞTIRIR ve ekranı günceller." },
        { lines: [8], text: "State'i doğrudan değiştirme (begendi = true ✗). Her zaman set fonksiyonuyla." },
        { lines: [9], text: "Yeni değer öncekine bağlıysa fonksiyonel güncelleme: setSayi(s => s + 1). Güncel değeri garanti eder." },
        { lines: [13], text: "onClick={tikla} — fonksiyonun kendisini ver, çağırma! onClick={tikla()} render sırasında çalışır." }
      ]
    },
    challenges: [
      {
        id: "p23c1", lang: "jsx", kind: "Değiştir", title: "Sayaç", fn: "App",
        prompt: "`#arttir` butonuna tıklanınca `sayi` 1 artsın ve `#sayi` içinde görünsün. State hazır, sadece olayı bağla.",
        starter: `import { useState } from "react";

function Sayac() {
  const [sayi, setSayi] = useState(0);
  return (
    <div>
      <span id="sayi">{sayi}</span>
      <button id="arttir">+1</button>
    </div>
  );
}

export default function App() {
  return <Sayac />;
}
`,
        tests: [
          { label: "başlangıç 0", check: `kd.text("#sayi")`, expected: "0" },
          { label: "1 tık → 1", check: `(async () => { await kd.click("#arttir"); return kd.text("#sayi"); })()`, expected: "1" },
          { label: "2 tık daha → 3", check: `(async () => { await kd.click("#arttir"); await kd.click("#arttir"); return kd.text("#sayi"); })()`, expected: "3" }
        ],
        hints: ["Butonun tıklandığını React'e hangi prop ile söylersin?", "<button onClick={…}>", "onClick={() => setSayi(sayi + 1)}"],
        solution: `import { useState } from "react";

function Sayac() {
  const [sayi, setSayi] = useState(0);
  return (
    <div>
      <span id="sayi">{sayi}</span>
      <button id="arttir" onClick={() => setSayi((s) => s + 1)}>+1</button>
    </div>
  );
}

export default function App() {
  return <Sayac />;
}`
      },
      {
        id: "p23c2", lang: "jsx", kind: "Yaz", title: "Göster / Gizle", fn: "App",
        prompt: "`#gecis` butonu bir `acik` state'ini açıp kapatsın. Açıkken `<p id=\"gizli\">Sürpriz! 🎉</p>` görünsün ve buton **Gizle** yazsın; kapalıyken paragraf **hiç render edilmesin** ve buton **Göster** yazsın.",
        starter: `function Gecis() {
  return <button id="gecis">Göster</button>;
}

function App() {
  return <Gecis />;
}
`,
        tests: [
          { label: "başta gizli", check: `kd.$("#gizli") === null`, expected: true },
          { label: "tıklayınca görünür", check: `(async () => { await kd.click("#gecis"); return kd.text("#gizli"); })()`, expected: "Sürpriz! 🎉" },
          { label: "buton metni Gizle", check: `kd.text("#gecis")`, expected: "Gizle" },
          { label: "tekrar tıklayınca kapanır", check: `(async () => { await kd.click("#gecis"); return [kd.$("#gizli") === null, kd.text("#gecis")]; })()`, expected: [true, "Göster"] }
        ],
        hints: ["Bir boolean state'e ihtiyacın var. Başlangıç değeri ne olmalı?", "Koşullu render: {acik && <p id=\"gizli\">…</p>}", "Buton metni için üçlü operatör: {acik ? \"Gizle\" : \"Göster\"}"],
        solution: `function Gecis() {
  const [acik, setAcik] = useState(false);
  return (
    <div>
      <button id="gecis" onClick={() => setAcik(!acik)}>
        {acik ? "Gizle" : "Göster"}
      </button>
      {acik && <p id="gizli">Sürpriz! 🎉</p>}
    </div>
  );
}

function App() {
  return <Gecis />;
}`
      },
      {
        id: "p23c3", lang: "jsx", kind: "Hata Ayıkla", title: "+3 Neden +1?", fn: "App",
        prompt: "İki hata var: **+3** butonu sadece 1 artırıyor ve **−1** sayıyı sıfırın altına düşürebiliyor. Sayaç asla negatif olmamalı.",
        starter: `function Sayac() {
  const [sayi, setSayi] = useState(0);

  function ucArttir() {
    setSayi(sayi + 1);
    setSayi(sayi + 1);
    setSayi(sayi + 1);
  }

  return (
    <div>
      <span id="sayi">{sayi}</span>
      <button id="arti" onClick={() => setSayi(sayi + 1)}>+1</button>
      <button id="arti3" onClick={ucArttir}>+3</button>
      <button id="eksi" onClick={() => setSayi(sayi - 1)}>−1</button>
      <button id="sifirla" onClick={() => setSayi(0)}>Sıfırla</button>
    </div>
  );
}

function App() {
  return <Sayac />;
}
`,
        tests: [
          { label: "+3 → 3", check: `(async () => { await kd.click("#arti3"); return kd.text("#sayi"); })()`, expected: "3" },
          { label: "5 kez −1 → 0 (negatif yok)", check: `(async () => { for (let i = 0; i < 5; i++) await kd.click("#eksi"); return kd.text("#sayi"); })()`, expected: "0" },
          { label: "+1 ve sıfırla", check: `(async () => { await kd.click("#arti"); await kd.click("#sifirla"); return kd.text("#sayi"); })()`, expected: "0" }
        ],
        hints: ["Bir render içinde 'sayi' değişkeninin değeri sabittir. Üç kez sayi + 1 yazmak = üç kez 0 + 1.", "Önceki değere bağlı güncelleme için fonksiyon ver: setSayi(s => s + 1)", "Negatif olmaması için: setSayi(s => Math.max(0, s - 1))"],
        solution: `function Sayac() {
  const [sayi, setSayi] = useState(0);

  function ucArttir() {
    setSayi((s) => s + 1);
    setSayi((s) => s + 1);
    setSayi((s) => s + 1);
  }

  return (
    <div>
      <span id="sayi">{sayi}</span>
      <button id="arti" onClick={() => setSayi((s) => s + 1)}>+1</button>
      <button id="arti3" onClick={ucArttir}>+3</button>
      <button id="eksi" onClick={() => setSayi((s) => Math.max(0, s - 1))}>−1</button>
      <button id="sifirla" onClick={() => setSayi(0)}>Sıfırla</button>
    </div>
  );
}

function App() {
  return <Sayac />;
}`
      }
    ],
    cards: [
      { id: "p23k1", q: "Normal değişken yerine neden state kullanılır?", a: "State değişince React bileşeni yeniden render eder; normal değişken değişikliği ekrana yansımaz ve her render'da sıfırlanır." },
      { id: "p23k2", q: "setSayi(sayi + 1) yerine ne zaman setSayi(s => s + 1)?", a: "Yeni değer öncekine bağlıysa — özellikle aynı olayda birden fazla güncelleme varsa." },
      { id: "p23k3", q: "onClick={kaydet()} neden hatalı?", a: "Fonksiyonu render sırasında hemen çağırır. Doğrusu onClick={kaydet} veya onClick={() => kaydet()}." }
    ]
  },

  /* ============================ DERS 24 ============================ */
  {
    id: "p24", no: 24, track: "react", title: "Listeler, key & Koşullu Render", short: "Listeler",
    goal: "Dizileri arayüze dönüştür; boş, yükleniyor ve dolu durumlarını doğru göster.",
    concepts: ["map ile render", "key", "&& ve ? :", "boş durum"],
    predict: {
      lang: "jsx",
      code: `function App() {
  const mesajlar = [];
  return (
    <div>
      {mesajlar.length && <p>Yeni mesajın var!</p>}
    </div>
  );
}`,
      options: ["Hiçbir şey", "0", "false", "Yeni mesajın var!"], answer: 1,
      why: "0 && … ifadesi 0 döndürür ve React sayıları ekrana basar! Güvenli yol: {mesajlar.length > 0 && …} ya da üçlü operatör."
    },
    example: {
      title: "Liste + boş durum",
      lang: "jsx",
      code: `const OGRENCILER = [
  { id: 1, ad: "Ece", puan: 92 },
  { id: 2, ad: "Can", puan: 74 }
];

function Liste({ ogrenciler }) {
  if (ogrenciler.length === 0) return <p>Henüz öğrenci yok.</p>;
  return (
    <ul>
      {ogrenciler.map((o) => (
        <li key={o.id}>
          {o.ad} {o.puan >= 85 ? "🏅" : ""}
        </li>
      ))}
    </ul>
  );
}

function App() {
  return <Liste ogrenciler={OGRENCILER} />;
}`,
      steps: [
        { lines: [7], text: "Erken dönüş (early return) ile boş durum: önce kenar durumu ele al." },
        { lines: [10], text: "map her öğeyi bir JSX öğesine dönüştürür (Ders 7'deki map ile aynı!)." },
        { lines: [11], text: "key: React'in hangi öğenin hangisi olduğunu takip etmesi için benzersiz ve SABİT bir kimlik. Veritabanı id'si ideal; index son çare." },
        { lines: [12], text: "Üçlü operatörle koşullu içerik." }
      ]
    },
    challenges: [
      {
        id: "p24c1", lang: "jsx", kind: "Değiştir", title: "Meyve Listesi", fn: "App",
        prompt: "`meyveler` dizisindeki her meyve için bir `<li>` render et. Doğru **key** kullan (konsolda key uyarısı olmasın).",
        starter: `const meyveler = [
  { id: 1, ad: "Elma" },
  { id: 2, ad: "Armut" },
  { id: 3, ad: "Muz" }
];

function Meyveler() {
  return (
    <ul>
      {/* her meyve için bir <li> */}
    </ul>
  );
}

function App() {
  return <Meyveler />;
}
`,
        tests: [
          { label: "3 meyve", check: `kd.$$("#root li").map((l) => l.textContent)`, expected: ["Elma", "Armut", "Muz"] },
          { label: "key uyarısı yok", check: `!kd.errs.some((e) => /unique "key"/.test(e))`, expected: true }
        ],
        hints: ["Bir diziyi JSX listesine hangi dizi metodu dönüştürür?", "{meyveler.map((m) => <li>…</li>)}", "<li key={m.id}>{m.ad}</li>"],
        solution: `const meyveler = [
  { id: 1, ad: "Elma" },
  { id: 2, ad: "Armut" },
  { id: 3, ad: "Muz" }
];

function Meyveler() {
  return (
    <ul>
      {meyveler.map((m) => (
        <li key={m.id}>{m.ad}</li>
      ))}
    </ul>
  );
}

function App() {
  return <Meyveler />;
}`
      },
      {
        id: "p24c2", lang: "jsx", kind: "Yaz", title: "Kurs Listesi + Boş Durum", fn: "App",
        prompt: "`KursListesi({ kurslar })`: kurs varsa `<ul>` içinde her biri için **AD (SÜRE saat)** metinli `<li>`; liste boşsa `<ul>` yerine `<p className=\"bos\">Henüz kurs yok.</p>` göstersin.",
        starter: `function KursListesi({ kurslar }) {

}

function App() {
  return <KursListesi kurslar={[{ id: 1, ad: "React", sure: 12 }]} />;
}
`,
        tests: [
          { label: "iki kurs", check: `[...kd.mount(KursListesi, { kurslar: [{ id: 1, ad: "React", sure: 12 }, { id: 2, ad: "CSS", sure: 6 }] }).querySelectorAll("li")].map((l) => l.textContent)`, expected: ["React (12 saat)", "CSS (6 saat)"] },
          { label: "boşsa mesaj", check: `kd.mount(KursListesi, { kurslar: [] }).querySelector("p.bos")?.textContent`, expected: "Henüz kurs yok." },
          { label: "boşsa ul yok", check: `kd.mount(KursListesi, { kurslar: [] }).querySelector("ul") === null`, expected: true },
          { label: "doluysa mesaj yok", check: `kd.mount(KursListesi, { kurslar: [{ id: 1, ad: "X", sure: 1 }] }).querySelector("p.bos") === null`, expected: true }
        ],
        hints: ["Önce boş durumu ele al. Örnekteki erken dönüşe bak.", "if (kurslar.length === 0) return <p className=\"bos\">…</p>;", "<li key={k.id}>{k.ad} ({k.sure} saat)</li>"],
        solution: `function KursListesi({ kurslar }) {
  if (kurslar.length === 0) return <p className="bos">Henüz kurs yok.</p>;
  return (
    <ul>
      {kurslar.map((k) => (
        <li key={k.id}>{k.ad} ({k.sure} saat)</li>
      ))}
    </ul>
  );
}

function App() {
  return <KursListesi kurslar={[{ id: 1, ad: "React", sure: 12 }]} />;
}`
      },
      {
        id: "p24c3", lang: "jsx", kind: "Yaz", title: "Görev Özeti", fn: "App",
        prompt: "`GorevListesi({ gorevler })`: her görev bir `<li>`; bitmiş olanların `className`'i **bitti** olsun. Altında `<p className=\"ozet\">` içinde **2/3 tamamlandı** gibi bir özet göster.",
        starter: `function GorevListesi({ gorevler }) {
  return null;
}

function App() {
  return (
    <GorevListesi
      gorevler={[
        { id: 1, metin: "JSX öğren", bitti: true },
        { id: 2, metin: "State öğren", bitti: false }
      ]}
    />
  );
}
`,
        tests: [
          { label: "tüm görevler", check: `[...kd.mount(GorevListesi, { gorevler: ${GOREVLER} }).querySelectorAll("li")].map((l) => l.textContent)`, expected: ["A", "B", "C"] },
          { label: "2 tanesi bitti sınıflı", check: `kd.mount(GorevListesi, { gorevler: ${GOREVLER} }).querySelectorAll("li.bitti").length`, expected: 2 },
          { label: "özet", check: `kd.mount(GorevListesi, { gorevler: ${GOREVLER} }).querySelector("p.ozet")?.textContent`, expected: "2/3 tamamlandı" }
        ],
        hints: ["İki iş: listeyi render et + biten sayısını hesapla. Hesaplamayı return'den önce yap.", "const biten = gorevler.filter((g) => g.bitti).length;", "<li key={g.id} className={g.bitti ? \"bitti\" : \"\"}>{g.metin}</li>"],
        solution: `function GorevListesi({ gorevler }) {
  const biten = gorevler.filter((g) => g.bitti).length;
  return (
    <div>
      <ul>
        {gorevler.map((g) => (
          <li key={g.id} className={g.bitti ? "bitti" : ""}>{g.metin}</li>
        ))}
      </ul>
      <p className="ozet">{biten}/{gorevler.length} tamamlandı</p>
    </div>
  );
}

function App() {
  return (
    <GorevListesi
      gorevler={[
        { id: 1, metin: "JSX öğren", bitti: true },
        { id: 2, metin: "State öğren", bitti: false }
      ]}
    />
  );
}`
      }
    ],
    cards: [
      { id: "p24k1", q: "key neden gerekli, index neden riskli?", a: "React öğeleri key ile eşleştirir. Index, liste sıralanınca/silinince değişir ve yanlış öğenin state'i korunabilir. Sabit id kullan." },
      { id: "p24k2", q: "{liste.length && <X />} hangi tuzağa düşer?", a: "Liste boşsa 0 ekrana basılır. {liste.length > 0 && <X />} yaz." },
      { id: "p24k3", q: "Bir liste bileşeni hangi durumları ele almalı?", a: "Boş, (varsa) yükleniyor/hata ve dolu." }
    ]
  },

  /* ============================ DERS 25 ============================ */
  {
    id: "p25", no: 25, track: "react", title: "Kontrollü Formlar", short: "Formlar",
    goal: "Form alanlarını state'e bağla; doğrulama ve gönderimi React yoluyla yönet.",
    concepts: ["value + onChange", "e.target.value", "türetilmiş doğrulama", "onSubmit"],
    predict: {
      lang: "jsx",
      code: `function App() {
  return <input value="Ece" />;
}
// Kullanıcı kutuya yazmaya çalışıyor.`,
      options: ["Yazdığı görünür", "Hiçbir şey değişmez — kutu kilitli", "Sayfa çöker", "Kutu boşalır"], answer: 1,
      why: "value verilen input 'kontrollü'dür: değerini React belirler. onChange ile state güncellenmezse değer hep \"Ece\" kalır. Önizlemede yazmayı dene, konsoldaki React uyarısını oku."
    },
    example: {
      title: "Kontrollü input",
      lang: "jsx",
      code: `function Bulten() {
  const [email, setEmail] = useState("");
  const gecerli = email.includes("@");

  return (
    <form onSubmit={(e) => { e.preventDefault(); alert("Kaydedildi: " + email); }}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="e-posta"
      />
      <button disabled={!gecerli}>Abone ol</button>
      {!gecerli && email && <p>Geçerli bir e-posta yaz.</p>}
    </form>
  );
}

function App() {
  return <Bulten />;
}`,
      steps: [
        { lines: [2], text: "Formun her alanı için bir state: tek doğruluk kaynağı yine state." },
        { lines: [8, 9], text: "value state'ten gelir, onChange her tuşta state'i günceller → ekran yeniden render. Bu döngüye 'kontrollü bileşen' denir." },
        { lines: [3, 12], text: "Doğrulama ayrı bir state DEĞİL: state'ten her render'da TÜRETİLİR. Gereksiz state = senkron dışı kalma riski." },
        { lines: [6], text: "onSubmit + preventDefault: Ders 18'deki ile aynı fikir, React sözdizimiyle." }
      ]
    },
    challenges: [
      {
        id: "p25c1", lang: "jsx", kind: "Değiştir", title: "Canlı Selam", fn: "App",
        prompt: "`#ad` input'unu `ad` state'ine **kontrollü** olarak bağla. `#selam` ad boşsa **Adını yaz**, doluysa **Merhaba, AD!** göstersin.",
        starter: `function Isim() {
  const [ad, setAd] = useState("");
  return (
    <div>
      <input id="ad" placeholder="Adın" />
      <p id="selam">Adını yaz</p>
    </div>
  );
}

function App() {
  return <Isim />;
}
`,
        tests: [
          { label: "başta", check: `kd.text("#selam")`, expected: "Adını yaz" },
          { label: '"Ece" yazınca', check: `(async () => { await kd.type("#ad", "Ece"); return kd.text("#selam"); })()`, expected: "Merhaba, Ece!" },
          { label: "silince geri döner", check: `(async () => { await kd.type("#ad", ""); return kd.text("#selam"); })()`, expected: "Adını yaz" }
        ],
        hints: ["Kontrollü input'un iki prop'u var. Hangileri?", "value={ad} onChange={(e) => setAd(e.target.value)}", "{ad ? `Merhaba, ${ad}!` : \"Adını yaz\"}"],
        solution: `function Isim() {
  const [ad, setAd] = useState("");
  return (
    <div>
      <input id="ad" placeholder="Adın" value={ad} onChange={(e) => setAd(e.target.value)} />
      <p id="selam">{ad ? \`Merhaba, \${ad}!\` : "Adını yaz"}</p>
    </div>
  );
}

function App() {
  return <Isim />;
}`
      },
      {
        id: "p25c2", lang: "jsx", kind: "Yaz", title: "Akıllı Kayıt Butonu", fn: "App",
        prompt: "`#kaydol` butonu, e-posta **@** içermedikçe **veya** şifre **8 karakterden kısa** oldukça **devre dışı** (`disabled`) olsun. Doğrulamayı ayrı state yerine **türet**.",
        starter: `function KayitFormu() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");

  return (
    <form>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e-posta" />
      <input id="sifre" type="password" value={sifre} onChange={(e) => setSifre(e.target.value)} placeholder="şifre" />
      <button id="kaydol">Kayıt ol</button>
    </form>
  );
}

function App() {
  return <KayitFormu />;
}
`,
        tests: [
          { label: "başta devre dışı", check: `kd.$("#kaydol").disabled`, expected: true },
          { label: "ikisi geçerliyse aktif", check: `(async () => { await kd.type("#email", "ece@quagen.dev"); await kd.type("#sifre", "12345678"); return kd.$("#kaydol").disabled; })()`, expected: false },
          { label: "kısa şifre → devre dışı", check: `(async () => { await kd.type("#sifre", "123"); return kd.$("#kaydol").disabled; })()`, expected: true },
          { label: "geçersiz e-posta → devre dışı", check: `(async () => { await kd.type("#sifre", "12345678"); await kd.type("#email", "ece"); return kd.$("#kaydol").disabled; })()`, expected: true }
        ],
        hints: ["Formun geçerli olup olmadığı email ve sifre'den hesaplanabilir mi? O zaman yeni state gerekmez.", "const gecerli = email.includes(\"@\") && sifre.length >= 8;", "<button id=\"kaydol\" disabled={!gecerli}>"],
        solution: `function KayitFormu() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const gecerli = email.includes("@") && sifre.length >= 8;

  return (
    <form>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e-posta" />
      <input id="sifre" type="password" value={sifre} onChange={(e) => setSifre(e.target.value)} placeholder="şifre" />
      <button id="kaydol" disabled={!gecerli}>Kayıt ol</button>
    </form>
  );
}

function App() {
  return <KayitFormu />;
}`
      },
      {
        id: "p25c3", lang: "jsx", kind: "Yaz", title: "Etiket Ekle", fn: "App",
        prompt: "`#ekle` formu gönderilince sayfa yenilenmesin; `#yeni` içindeki metin **boşlukları kırpılarak** `#etiketler` listesine eklensin ve kutu boşalsın. Boş metin eklenmesin.",
        starter: `function Etiketler() {
  const [metin, setMetin] = useState("");
  const [etiketler, setEtiketler] = useState([]);

  return (
    <form id="ekle">
      <input id="yeni" value={metin} onChange={(e) => setMetin(e.target.value)} />
      <button>Ekle</button>
      <ul id="etiketler">
        {etiketler.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </form>
  );
}

function App() {
  return <Etiketler />;
}
`,
        tests: [
          { label: "etiket eklenir", check: `(async () => { await kd.type("#yeni", "react"); await kd.submit("#ekle"); return kd.$$("#etiketler li").map((l) => l.textContent); })()`, expected: ["react"] },
          { label: "kutu boşalır", check: `kd.$("#yeni").value`, expected: "" },
          { label: "boş metin eklenmez", check: `(async () => { await kd.type("#yeni", "   "); await kd.submit("#ekle"); return kd.$$("#etiketler li").length; })()`, expected: 1 },
          { label: "kırpılır + preventDefault", check: `(async () => { await kd.type("#yeni", "  hooks "); await kd.submit("#ekle"); return [kd.$$("#etiketler li").map((l) => l.textContent), window.__kdNoPrevent !== true]; })()`, expected: [["react", "hooks"], true] }
        ],
        hints: ["form'a onSubmit ekle. İlk satırda ne yapmalısın?", "const t = metin.trim(); if (!t) return;", "setEtiketler([...etiketler, t]); setMetin(\"\"); — diziyi kopyalayarak güncelle, push yapma!"],
        solution: `function Etiketler() {
  const [metin, setMetin] = useState("");
  const [etiketler, setEtiketler] = useState([]);

  function gonder(e) {
    e.preventDefault();
    const t = metin.trim();
    if (!t) return;
    setEtiketler([...etiketler, t]);
    setMetin("");
  }

  return (
    <form id="ekle" onSubmit={gonder}>
      <input id="yeni" value={metin} onChange={(e) => setMetin(e.target.value)} />
      <button>Ekle</button>
      <ul id="etiketler">
        {etiketler.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </form>
  );
}

function App() {
  return <Etiketler />;
}`
      }
    ],
    cards: [
      { id: "p25k1", q: "Kontrollü bileşen nedir?", a: "Değeri state'ten gelen (value) ve her değişiklikte state'i güncelleyen (onChange) form alanı." },
      { id: "p25k2", q: "Neden etiketler.push(t) değil [...etiketler, t]?", a: "State'i yerinde değiştirmek (mutasyon) React'in değişikliği fark etmesini engeller. Her zaman yeni dizi/nesne üret." },
      { id: "p25k3", q: "'Türetilmiş state' prensibi?", a: "Mevcut state'ten hesaplanabilen değeri ayrı state'te tutma; render sırasında hesapla." }
    ]
  },

  /* ============================ DERS 26 ============================ */
  {
    id: "p26", no: 26, track: "react", title: "useEffect & Veri Çekme", short: "useEffect",
    goal: "Render dışındaki yan etkileri (API, başlık, zamanlayıcı) doğru zamanda çalıştır.",
    concepts: ["useEffect", "bağımlılık dizisi", "fetch + state", "yükleniyor / hata"],
    predict: {
      lang: "jsx",
      code: `function App() {
  console.log("render");
  useEffect(() => {
    console.log("effect");
  }, []);
  return null;
}`,
      options: ["effect, render", "render, effect", "sadece render", "render, effect, render"], answer: 1,
      why: "Önce bileşen render edilir ve ekrana basılır; effect ondan SONRA çalışır. [] bağımlılık dizisi: sadece ilk yüklemede bir kez."
    },
    example: {
      title: "API'den liste çekmek",
      lang: "jsx",
      code: `function Kullanici() {
  const [kullanici, setKullanici] = useState(null);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    fetch("/api/kullanici/1")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(setKullanici)
      .catch((e) => setHata(e.message));
  }, []);

  if (hata) return <p>Hata: {hata}</p>;
  if (!kullanici) return <p>Yükleniyor…</p>;
  return <h2>Merhaba, {kullanici.ad}</h2>;
}

function App() {
  return <Kullanici />;
}`,
      steps: [
        { lines: [2, 3], text: "Veri, hata (ve gerekirse yükleniyor) için state." },
        { lines: [5, 13], text: "useEffect(fonksiyon, bağımlılıklar). Render içinde fetch YAPMA — sonsuz döngüye girer. Yan etkiler effect'e." },
        { lines: [8], text: "Ders 19'u hatırla: fetch 404'te hata fırlatmaz, res.ok'u kontrol et." },
        { lines: [13], text: "[] → sadece ilk render'dan sonra. [id] → id değiştikçe. Hiç yazmazsan → her render'dan sonra (genelde hata)." },
        { lines: [15, 16, 17], text: "Üç durumu da render et: hata, yükleniyor, veri." }
      ]
    },
    challenges: [
      {
        id: "p26c1", lang: "jsx", kind: "Değiştir", title: "Sekme Başlığı", fn: "App",
        prompt: "`useEffect` ile sayfa başlığını (`document.title`) **Sayaç: N** yap. Sayı değiştikçe başlık güncellensin.",
        starter: `function Sayac() {
  const [sayi, setSayi] = useState(0);

  // useEffect: document.title'ı güncelle

  return <button id="arttir" onClick={() => setSayi(sayi + 1)}>Tıklandı: {sayi}</button>;
}

function App() {
  return <Sayac />;
}
`,
        tests: [
          { label: "başta", check: `document.title`, expected: "Sayaç: 0" },
          { label: "tıklayınca güncellenir", check: `(async () => { await kd.click("#arttir"); return document.title; })()`, expected: "Sayaç: 1" }
        ],
        hints: ["Başlığı değiştirmek bir yan etkidir. Ne zaman tekrar çalışması gerekiyor?", "useEffect(() => { … }, [sayi]);", "document.title = `Sayaç: ${sayi}`;"],
        solution: `function Sayac() {
  const [sayi, setSayi] = useState(0);

  useEffect(() => {
    document.title = \`Sayaç: \${sayi}\`;
  }, [sayi]);

  return <button id="arttir" onClick={() => setSayi(sayi + 1)}>Tıklandı: {sayi}</button>;
}

function App() {
  return <Sayac />;
}`
      },
      {
        id: "p26c2", lang: "jsx", kind: "Yaz", title: "Kursları Yükle", fn: "App",
        prompt: "`KursListesi` ilk yüklemede `/api/kurslar`'dan veri çeksin. Veri gelene kadar `<p id=\"yukleniyor\">Yükleniyor…</p>`, gelince her kursun **adı** bir `<li>` içinde görünsün.",
        starter: `function KursListesi() {
  const [kurslar, setKurslar] = useState(null);

  return <p id="yukleniyor">Yükleniyor…</p>;
}

function App() {
  return <KursListesi />;
}
`,
        tests: [
          { label: "önce yükleniyor", check: `kd.mount(KursListesi).querySelector("#yukleniyor")?.textContent`, expected: "Yükleniyor…" },
          { label: "veri gelince liste", check: `(async () => { const d = kd.mount(KursListesi); await kd.tick(200); return [...d.querySelectorAll("li")].map((l) => l.textContent); })()`, expected: ["JavaScript", "CSS", "React"] },
          { label: "yükleniyor kaybolur", check: `(async () => { const d = kd.mount(KursListesi); await kd.tick(200); return d.querySelector("#yukleniyor") === null; })()`, expected: true }
        ],
        hints: ["fetch'i nereye koymalısın ve bağımlılık dizisi ne olmalı (sadece bir kez)?", "useEffect(() => { fetch(\"/api/kurslar\").then((r) => r.json()).then(setKurslar); }, []);", "if (!kurslar) return <p id=\"yukleniyor\">…</p>; sonra <ul>{kurslar.map(…)}</ul>"],
        solution: `function KursListesi() {
  const [kurslar, setKurslar] = useState(null);

  useEffect(() => {
    fetch("/api/kurslar")
      .then((r) => r.json())
      .then(setKurslar);
  }, []);

  if (!kurslar) return <p id="yukleniyor">Yükleniyor…</p>;
  return (
    <ul>
      {kurslar.map((k) => <li key={k.id}>{k.ad}</li>)}
    </ul>
  );
}

function App() {
  return <KursListesi />;
}`
      },
      {
        id: "p26c3", lang: "jsx", kind: "Yaz", title: "id'ye Bağlı Veri", fn: "App",
        prompt: "`KullaniciKarti({ id })` `/api/kullanici/ID`'den veri çeksin ve `<h3>` içinde adı göstersin. Bulunamazsa `<p className=\"hata\">Kullanıcı bulunamadı</p>`. **id değişince yeniden çekmeli.**",
        starter: `function KullaniciKarti({ id }) {
  return <p>Yükleniyor…</p>;
}

function App() {
  const [id, setId] = useState(1);
  return (
    <>
      <button onClick={() => setId(id === 1 ? 2 : 1)}>Değiştir</button>
      <KullaniciKarti id={id} />
    </>
  );
}
`,
        tests: [
          { label: "id=1 → Deniz", check: `(async () => { const d = kd.mount(KullaniciKarti, { id: 1 }); await kd.tick(200); return d.querySelector("h3")?.textContent; })()`, expected: "Deniz" },
          { label: "id=99 → hata", check: `(async () => { const d = kd.mount(KullaniciKarti, { id: 99 }); await kd.tick(200); return d.querySelector("p.hata")?.textContent; })()`, expected: "Kullanıcı bulunamadı" },
          { label: "id değişince yeniden çeker", check: `(async () => { const d = kd.mount(KullaniciKarti, { id: 1 }); await kd.tick(200); d.rerender({ id: 2 }); await kd.tick(200); return d.querySelector("h3")?.textContent; })()`, expected: "Ece" }
        ],
        hints: ["Effect'in hangi değer değişince tekrar çalışması gerekiyor? Bağımlılık dizisine o girmeli.", "useEffect(() => { fetch(`/api/kullanici/${id}`)… }, [id]);", "res.ok değilse throw et, catch'te hata state'ini true yap. Yeni id'de hatayı sıfırlamayı unutma."],
        solution: `function KullaniciKarti({ id }) {
  const [kullanici, setKullanici] = useState(null);
  const [hata, setHata] = useState(false);

  useEffect(() => {
    setHata(false);
    setKullanici(null);
    fetch(\`/api/kullanici/\${id}\`)
      .then((res) => {
        if (!res.ok) throw new Error("bulunamadı");
        return res.json();
      })
      .then(setKullanici)
      .catch(() => setHata(true));
  }, [id]);

  if (hata) return <p className="hata">Kullanıcı bulunamadı</p>;
  if (!kullanici) return <p>Yükleniyor…</p>;
  return <h3>{kullanici.ad}</h3>;
}

function App() {
  const [id, setId] = useState(1);
  return (
    <>
      <button onClick={() => setId(id === 1 ? 2 : 1)}>Değiştir</button>
      <KullaniciKarti id={id} />
    </>
  );
}`
      }
    ],
    cards: [
      { id: "p26k1", q: "useEffect bağımlılık dizisinin 3 hali?", a: "[] → bir kez (mount). [a, b] → a veya b değişince. Yok → her render'dan sonra." },
      { id: "p26k2", q: "Neden fetch doğrudan bileşen gövdesinde yapılmaz?", a: "Her render'da tekrar çalışır; setState yeni render tetikler → sonsuz döngü. Yan etkiler useEffect'e." },
      { id: "p26k3", q: "Effect'ten fonksiyon döndürmek ne işe yarar?", a: "Temizlik (cleanup): zamanlayıcıyı durdurmak, aboneliği iptal etmek. Bir sonraki effect'ten veya unmount'tan önce çalışır." }
    ]
  },

  /* ============================ DERS 27 ============================ */
  {
    id: "p27", no: 27, track: "react", title: "State'i Yukarı Taşımak", short: "Veri Akışı",
    goal: "Birden fazla bileşenin paylaştığı veriyi ortak ebeveyne taşı; veriyi aşağı, olayları yukarı akıt.",
    concepts: ["tek yönlü veri akışı", "lifting state up", "callback props", "ortak ebeveyn"],
    predict: {
      lang: "jsx",
      code: `function Sayac() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}

function App() {
  return (
    <>
      <Sayac />
      <Sayac />
    </>
  );
}
// İlk butona 2 kez tıklandı.`,
      options: ["2 ve 2", "2 ve 0", "1 ve 1", "0 ve 0"], answer: 1,
      why: "Her bileşen örneğinin KENDİ state'i vardır. Paylaşmak istiyorsan state'i ortak ebeveyne (App) taşımalı ve props ile aşağı vermelisin."
    },
    example: {
      title: "Ortak state, iki çocuk",
      lang: "jsx",
      code: `function Secici({ secili, onSec }) {
  return ["React", "Vue"].map((x) => (
    <button key={x} onClick={() => onSec(x)} disabled={secili === x}>{x}</button>
  ));
}

function Bilgi({ secili }) {
  return <p>Seçimin: <b>{secili}</b></p>;
}

function App() {
  const [secili, setSecili] = useState("React");
  return (
    <>
      <Secici secili={secili} onSec={setSecili} />
      <Bilgi secili={secili} />
    </>
  );
}`,
      steps: [
        { lines: [12], text: "State, onu kullanan TÜM bileşenlerin en yakın ortak ebeveyninde yaşar." },
        { lines: [15, 16], text: "Veri aşağı akar (props), …" },
        { lines: [1, 3], text: "… olaylar yukarı: çocuk state'i değiştiremez ama ebeveynin verdiği fonksiyonu (onSec) çağırabilir." },
        { lines: [7, 8], text: "Bilgi ve Secici birbirini tanımaz; ikisi de aynı kaynaktan beslenir → her zaman tutarlı." }
      ]
    },
    challenges: [
      {
        id: "p27c1", lang: "jsx", kind: "Değiştir", title: "Arama Kutusu", fn: "App",
        prompt: "Arama kutusu çalışmıyor çünkü `q` state'i `Arama`'nın içinde hapsolmuş. State'i **App'e taşı**, `Arama`'ya değeri ve değiştiricisini, `Liste`'ye `q`'yu props olarak ver.",
        starter: `const KURSLAR = ["JavaScript", "CSS", "React"];

function Arama() {
  const [q, setQ] = useState("");
  return <input id="arama" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara…" />;
}

function Liste({ q }) {
  const sonuc = KURSLAR.filter((k) => k.toLowerCase().includes(q.toLowerCase()));
  return <ul>{sonuc.map((k) => <li key={k}>{k}</li>)}</ul>;
}

function App() {
  return (
    <>
      <Arama />
      <Liste q="" />
    </>
  );
}
`,
        tests: [
          { label: '"re" → React', check: `(async () => { await kd.type("#arama", "re"); return kd.$$("#root li").map((l) => l.textContent); })()`, expected: ["React"] },
          { label: '"S" → JavaScript, CSS', check: `(async () => { await kd.type("#arama", "S"); return kd.$$("#root li").map((l) => l.textContent); })()`, expected: ["JavaScript", "CSS"] },
          { label: "boş → hepsi", check: `(async () => { await kd.type("#arama", ""); return kd.$$("#root li").length; })()`, expected: 3 }
        ],
        hints: ["İki kardeş bileşen aynı veriye ihtiyaç duyuyor. Bu veri nerede yaşamalı?", "App'te: const [q, setQ] = useState(\"\"); → <Arama q={q} setQ={setQ} /> <Liste q={q} />", "Arama: function Arama({ q, setQ }) — kendi useState'ini sil."],
        solution: `const KURSLAR = ["JavaScript", "CSS", "React"];

function Arama({ q, setQ }) {
  return <input id="arama" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara…" />;
}

function Liste({ q }) {
  const sonuc = KURSLAR.filter((k) => k.toLowerCase().includes(q.toLowerCase()));
  return <ul>{sonuc.map((k) => <li key={k}>{k}</li>)}</ul>;
}

function App() {
  const [q, setQ] = useState("");
  return (
    <>
      <Arama q={q} setQ={setQ} />
      <Liste q={q} />
    </>
  );
}`
      },
      {
        id: "p27c2", lang: "jsx", kind: "Yaz", title: "Sepet", fn: "App",
        prompt: "`App` bir **sepet** state'i tutsun. Her `UrunKarti`'ndaki `.ekle` butonu `onEkle(urun)` ile ürünü sepete eklesin. `#toplam` **Toplam: X ₺**, `#adet` **N ürün** göstersin.",
        starter: `const URUNLER = [
  { id: 1, ad: "Kalem", fiyat: 100 },
  { id: 2, ad: "Defter", fiyat: 250 }
];

function UrunKarti({ urun, onEkle }) {
  return (
    <div className="urun">
      <span>{urun.ad} — {urun.fiyat} ₺</span>
      <button className="ekle">Sepete ekle</button>
    </div>
  );
}

function App() {
  // sepet state'i burada
  return (
    <div>
      {URUNLER.map((u) => <UrunKarti key={u.id} urun={u} />)}
      <p id="toplam">Toplam: 0 ₺</p>
    </div>
  );
}
`,
        tests: [
          { label: "başta 0", check: `kd.text("#toplam")`, expected: "Toplam: 0 ₺" },
          { label: "kalem eklenir", check: `(async () => { await kd.click(kd.$$(".ekle")[0]); return kd.text("#toplam"); })()`, expected: "Toplam: 100 ₺" },
          { label: "defter eklenir", check: `(async () => { await kd.click(kd.$$(".ekle")[1]); return kd.text("#toplam"); })()`, expected: "Toplam: 350 ₺" },
          { label: "adet", check: `(async () => { await kd.click(kd.$$(".ekle")[1]); return kd.text("#adet"); })()`, expected: "3 ürün" }
        ],
        hints: ["Sepet hangi bileşende yaşamalı ki hem butonlar hem toplam ona erişsin?", "const [sepet, setSepet] = useState([]); → <UrunKarti … onEkle={(u) => setSepet([...sepet, u])} />", "UrunKarti: onClick={() => onEkle(urun)} · toplam: sepet.reduce((t, u) => t + u.fiyat, 0)"],
        solution: `const URUNLER = [
  { id: 1, ad: "Kalem", fiyat: 100 },
  { id: 2, ad: "Defter", fiyat: 250 }
];

function UrunKarti({ urun, onEkle }) {
  return (
    <div className="urun">
      <span>{urun.ad} — {urun.fiyat} ₺</span>
      <button className="ekle" onClick={() => onEkle(urun)}>Sepete ekle</button>
    </div>
  );
}

function App() {
  const [sepet, setSepet] = useState([]);
  const toplam = sepet.reduce((t, u) => t + u.fiyat, 0);
  return (
    <div>
      {URUNLER.map((u) => (
        <UrunKarti key={u.id} urun={u} onEkle={(x) => setSepet((s) => [...s, x])} />
      ))}
      <p id="toplam">Toplam: {toplam} ₺</p>
      <p id="adet">{sepet.length} ürün</p>
    </div>
  );
}`
      },
      {
        id: "p27c3", lang: "jsx", kind: "Yaz", title: "Akordeon", fn: "App",
        prompt: "Şu an paneller bağımsız açılıyor. **Aynı anda sadece bir panel** açık olsun: açık panelin index'ini App'te tut. Açık olan panele tekrar tıklanınca kapansın.",
        starter: `const PANELLER = [
  { baslik: "Nedir?", icerik: "React bir UI kütüphanesidir." },
  { baslik: "Neden?", icerik: "Bileşenlerle düşünürsün." },
  { baslik: "Nasıl?", icerik: "Yazarak!" }
];

function Panel({ baslik, children }) {
  const [acik, setAcik] = useState(false);
  return (
    <div className="panel">
      <button onClick={() => setAcik(!acik)}>{baslik}</button>
      {acik && <div className="icerik">{children}</div>}
    </div>
  );
}

function App() {
  return (
    <div>
      {PANELLER.map((p, i) => (
        <Panel key={i} baslik={p.baslik}>{p.icerik}</Panel>
      ))}
    </div>
  );
}
`,
        tests: [
          { label: "2. panel açılır", check: `(async () => { await kd.click(kd.$$(".panel button")[1]); return kd.$$(".panel .icerik").map((e) => e.textContent); })()`, expected: ["Bileşenlerle düşünürsün."] },
          { label: "1.'yi açınca 2. kapanır", check: `(async () => { await kd.click(kd.$$(".panel button")[0]); return kd.$$(".panel .icerik").map((e) => e.textContent); })()`, expected: ["React bir UI kütüphanesidir."] },
          { label: "açığa tıklayınca kapanır", check: `(async () => { await kd.click(kd.$$(".panel button")[0]); return kd.$$(".panel .icerik").length; })()`, expected: 0 }
        ],
        hints: ["Her panelin kendi state'i olduğu sürece birbirlerinden haberleri olmaz. Bilgiyi kim tutmalı?", "App: const [acikIndex, setAcikIndex] = useState(null); Panel'e acik={acikIndex === i} ver.", "onTikla={() => setAcikIndex(acikIndex === i ? null : i)} — Panel'deki useState'i sil."],
        solution: `const PANELLER = [
  { baslik: "Nedir?", icerik: "React bir UI kütüphanesidir." },
  { baslik: "Neden?", icerik: "Bileşenlerle düşünürsün." },
  { baslik: "Nasıl?", icerik: "Yazarak!" }
];

function Panel({ baslik, acik, onTikla, children }) {
  return (
    <div className="panel">
      <button onClick={onTikla}>{baslik}</button>
      {acik && <div className="icerik">{children}</div>}
    </div>
  );
}

function App() {
  const [acikIndex, setAcikIndex] = useState(null);
  return (
    <div>
      {PANELLER.map((p, i) => (
        <Panel
          key={i}
          baslik={p.baslik}
          acik={acikIndex === i}
          onTikla={() => setAcikIndex(acikIndex === i ? null : i)}
        >
          {p.icerik}
        </Panel>
      ))}
    </div>
  );
}`
      }
    ],
    cards: [
      { id: "p27k1", q: "'State'i yukarı taşımak' ne zaman gerekir?", a: "İki veya daha fazla bileşen aynı veriyi okuyor/değiştiriyorsa: state en yakın ortak ebeveyne taşınır." },
      { id: "p27k2", q: "Çocuk bileşen ebeveynin state'ini nasıl değiştirir?", a: "Ebeveynin props ile verdiği callback'i (onSec, onEkle…) çağırarak." },
      { id: "p27k3", q: "React'te veri akışının yönü?", a: "Tek yönlü: veri yukarıdan aşağı (props), olaylar aşağıdan yukarı (callback)." }
    ]
  },

  /* ============================ DERS 28 ============================ */
  {
    id: "p28", no: 28, track: "react", title: "useReducer", short: "useReducer",
    goal: "Karmaşık state mantığını saf bir fonksiyonda topla: test edilebilir, öngörülebilir güncellemeler.",
    concepts: ["reducer = saf fonksiyon", "action { type }", "dispatch", "değişmezlik (immutability)"],
    predict: {
      lang: "jsx",
      code: `function reducer(state, action) {
  if (action.type === "arttir") return state + 1;
  return state;
}
let s = 0;
s = reducer(s, { type: "arttir" });
s = reducer(s, { type: "bilinmeyen" });
s = reducer(s, { type: "arttir" });
console.log(s);`,
      options: ["1", "2", "3", "Hata verir"], answer: 1,
      why: "Reducer (state, action) → yeni state üreten saf bir fonksiyondur. Tanımadığı action'da state'i olduğu gibi döndürür. 0 → 1 → 1 → 2."
    },
    example: {
      title: "useReducer ile sayaç",
      lang: "jsx",
      code: `function reducer(state, action) {
  switch (action.type) {
    case "arttir":
      return { ...state, sayi: state.sayi + state.adim };
    case "adim":
      return { ...state, adim: action.deger };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { sayi: 0, adim: 1 });
  return (
    <div>
      <b>{state.sayi}</b>
      <button onClick={() => dispatch({ type: "arttir" })}>+{state.adim}</button>
      <button onClick={() => dispatch({ type: "adim", deger: 5 })}>Adım = 5</button>
    </div>
  );
}`,
      steps: [
        { lines: [1, 9], text: "Reducer: (eski state, action) → yeni state. Saf: aynı girdi → aynı çıktı, yan etki yok. React'ten bağımsız test edilebilir!" },
        { lines: [4], text: "State'i DEĞİŞTİRME, yenisini üret: { ...state, sayi: … } — spread ile kopyala, sadece değişen alanı ezer." },
        { lines: [7, 8], text: "Bilinmeyen action → state'i aynen döndür." },
        { lines: [12], text: "useReducer(reducer, başlangıç) → [state, dispatch]." },
        { lines: [16, 17], text: "Bileşen NE olduğunu söyler (dispatch action), reducer NASIL değişeceğine karar verir." }
      ]
    },
    challenges: [
      {
        id: "p28c1", lang: "jsx", kind: "Değiştir", title: "Sayaç Reducer'ı", fn: "App",
        prompt: "`sayacReducer`'a **azalt** (1 eksilt) ve **sifirla** (0 yap) action'larını ekle. Bilinmeyen action'da **aynı state nesnesini** döndür; state'i asla yerinde değiştirme.",
        starter: `function sayacReducer(state, action) {
  switch (action.type) {
    case "arttir":
      return { sayi: state.sayi + 1 };
    // "azalt" ve "sifirla" ekle
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(sayacReducer, { sayi: 0 });
  return (
    <div>
      <span id="sayi">{state.sayi}</span>
      <button onClick={() => dispatch({ type: "arttir" })}>+</button>
      <button onClick={() => dispatch({ type: "azalt" })}>−</button>
      <button onClick={() => dispatch({ type: "sifirla" })}>Sıfırla</button>
    </div>
  );
}
`,
        tests: [
          { label: "arttir", check: `sayacReducer({ sayi: 0 }, { type: "arttir" })`, expected: { sayi: 1 } },
          { label: "azalt", check: `sayacReducer({ sayi: 5 }, { type: "azalt" })`, expected: { sayi: 4 } },
          { label: "sifirla", check: `sayacReducer({ sayi: 9 }, { type: "sifirla" })`, expected: { sayi: 0 } },
          { label: "bilinmeyen → aynı nesne", check: `(() => { const s = { sayi: 5 }; return sayacReducer(s, { type: "x" }) === s; })()`, expected: true },
          { label: "state değişmez (immutable)", check: `(() => { const s = { sayi: 1 }; sayacReducer(s, { type: "azalt" }); return s.sayi; })()`, expected: 1 }
        ],
        hints: ["Reducer'ı React'siz düşün: sadece bir fonksiyon. Her case yeni bir nesne döndürmeli.", "case \"azalt\": return { sayi: state.sayi - 1 };", "case \"sifirla\": return { sayi: 0 };"],
        solution: `function sayacReducer(state, action) {
  switch (action.type) {
    case "arttir":
      return { sayi: state.sayi + 1 };
    case "azalt":
      return { sayi: state.sayi - 1 };
    case "sifirla":
      return { sayi: 0 };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(sayacReducer, { sayi: 0 });
  return (
    <div>
      <span id="sayi">{state.sayi}</span>
      <button onClick={() => dispatch({ type: "arttir" })}>+</button>
      <button onClick={() => dispatch({ type: "azalt" })}>−</button>
      <button onClick={() => dispatch({ type: "sifirla" })}>Sıfırla</button>
    </div>
  );
}`
      },
      {
        id: "p28c2", lang: "jsx", kind: "Yaz", title: "Sepet Reducer'ı", fn: "App",
        prompt: "`sepetReducer(state, action)` — state: `{ urunler: [{ id, ad, fiyat, adet }] }`. **ekle** (`action.urun`): ürün varsa adedini 1 artır, yoksa `adet: 1` ile ekle. **cikar** (`action.id`): ürünü sil. **temizle**: boşalt. Hiçbir zaman eski state'i değiştirme.",
        starter: `function sepetReducer(state, action) {
  switch (action.type) {
    default:
      return state;
  }
}
`,
        tests: [
          { label: "yeni ürün ekle", check: `sepetReducer({ urunler: [] }, { type: "ekle", urun: { id: 1, ad: "Kalem", fiyat: 100 } })`, expected: { urunler: [{ id: 1, ad: "Kalem", fiyat: 100, adet: 1 }] } },
          { label: "var olanın adedi artar", check: `sepetReducer({ urunler: [{ id: 1, ad: "Kalem", fiyat: 100, adet: 1 }] }, { type: "ekle", urun: { id: 1, ad: "Kalem", fiyat: 100 } }).urunler[0].adet`, expected: 2 },
          { label: "eski state değişmez", check: `(() => { const s = { urunler: [{ id: 1, ad: "Kalem", fiyat: 100, adet: 1 }] }; sepetReducer(s, { type: "ekle", urun: { id: 1, ad: "Kalem", fiyat: 100 } }); return s.urunler[0].adet; })()`, expected: 1 },
          { label: "cikar", check: `sepetReducer({ urunler: [{ id: 1, adet: 1 }, { id: 2, adet: 3 }] }, { type: "cikar", id: 1 })`, expected: { urunler: [{ id: 2, adet: 3 }] } },
          { label: "temizle", check: `sepetReducer({ urunler: [{ id: 1, adet: 1 }] }, { type: "temizle" })`, expected: { urunler: [] } }
        ],
        hints: ["'ekle'de önce ürünün sepette olup olmadığını bul (find). İki farklı dönüş yolu var.", "Varsa: urunler.map(u => u.id === id ? { ...u, adet: u.adet + 1 } : u) — yoksa: [...urunler, { ...action.urun, adet: 1 }]", "cikar: urunler.filter(u => u.id !== action.id) · temizle: { urunler: [] }"],
        solution: `function sepetReducer(state, action) {
  switch (action.type) {
    case "ekle": {
      const mevcut = state.urunler.find((u) => u.id === action.urun.id);
      if (mevcut) {
        return {
          urunler: state.urunler.map((u) =>
            u.id === action.urun.id ? { ...u, adet: u.adet + 1 } : u
          )
        };
      }
      return { urunler: [...state.urunler, { ...action.urun, adet: 1 }] };
    }
    case "cikar":
      return { urunler: state.urunler.filter((u) => u.id !== action.id) };
    case "temizle":
      return { urunler: [] };
    default:
      return state;
  }
}`
      },
      {
        id: "p28c3", lang: "jsx", kind: "Yaz", title: "Reducer'ı Bağla", fn: "App",
        prompt: "Hazır `sepetReducer`'ı `useReducer` ile `App`'e bağla: her `.ekle` butonu ürünü eklesin, `#sepet` listesinde **AD × ADET** satırları, `#toplam`'da **Toplam: X ₺** görünsün, `#temizle` sepeti boşaltsın.",
        starter: `function sepetReducer(state, action) {
  switch (action.type) {
    case "ekle": {
      const mevcut = state.urunler.find((u) => u.id === action.urun.id);
      if (mevcut) {
        return { urunler: state.urunler.map((u) => (u.id === action.urun.id ? { ...u, adet: u.adet + 1 } : u)) };
      }
      return { urunler: [...state.urunler, { ...action.urun, adet: 1 }] };
    }
    case "cikar":
      return { urunler: state.urunler.filter((u) => u.id !== action.id) };
    case "temizle":
      return { urunler: [] };
    default:
      return state;
  }
}

const URUNLER = [
  { id: 1, ad: "Kalem", fiyat: 100 },
  { id: 2, ad: "Defter", fiyat: 250 }
];

function App() {
  // useReducer burada

  return (
    <div>
      {URUNLER.map((u) => (
        <button key={u.id} className="ekle">{u.ad} ekle</button>
      ))}
      <ul id="sepet"></ul>
      <p id="toplam">Toplam: 0 ₺</p>
      <button id="temizle">Temizle</button>
    </div>
  );
}
`,
        tests: [
          { label: "iki kez kalem", check: `(async () => { await kd.click(kd.$$(".ekle")[0]); await kd.click(kd.$$(".ekle")[0]); return kd.$$("#sepet li").map((l) => l.textContent); })()`, expected: ["Kalem × 2"] },
          { label: "toplam", check: `(async () => { await kd.click(kd.$$(".ekle")[1]); return kd.text("#toplam"); })()`, expected: "Toplam: 450 ₺" },
          { label: "temizle", check: `(async () => { await kd.click("#temizle"); return [kd.$$("#sepet li").length, kd.text("#toplam")]; })()`, expected: [0, "Toplam: 0 ₺"] }
        ],
        hints: ["const [state, dispatch] = useReducer(sepetReducer, { urunler: [] });", "Buton: onClick={() => dispatch({ type: \"ekle\", urun: u })}", "Toplam: state.urunler.reduce((t, u) => t + u.fiyat * u.adet, 0) · <li key={u.id}>{u.ad} × {u.adet}</li>"],
        solution: `function sepetReducer(state, action) {
  switch (action.type) {
    case "ekle": {
      const mevcut = state.urunler.find((u) => u.id === action.urun.id);
      if (mevcut) {
        return { urunler: state.urunler.map((u) => (u.id === action.urun.id ? { ...u, adet: u.adet + 1 } : u)) };
      }
      return { urunler: [...state.urunler, { ...action.urun, adet: 1 }] };
    }
    case "cikar":
      return { urunler: state.urunler.filter((u) => u.id !== action.id) };
    case "temizle":
      return { urunler: [] };
    default:
      return state;
  }
}

const URUNLER = [
  { id: 1, ad: "Kalem", fiyat: 100 },
  { id: 2, ad: "Defter", fiyat: 250 }
];

function App() {
  const [state, dispatch] = useReducer(sepetReducer, { urunler: [] });
  const toplam = state.urunler.reduce((t, u) => t + u.fiyat * u.adet, 0);

  return (
    <div>
      {URUNLER.map((u) => (
        <button key={u.id} className="ekle" onClick={() => dispatch({ type: "ekle", urun: u })}>
          {u.ad} ekle
        </button>
      ))}
      <ul id="sepet">
        {state.urunler.map((u) => (
          <li key={u.id}>{u.ad} × {u.adet}</li>
        ))}
      </ul>
      <p id="toplam">Toplam: {toplam} ₺</p>
      <button id="temizle" onClick={() => dispatch({ type: "temizle" })}>Temizle</button>
    </div>
  );
}`
      }
    ],
    cards: [
      { id: "p28k1", q: "useState yerine useReducer ne zaman?", a: "State birbirine bağlı birçok alandan oluşuyorsa veya güncelleme kuralları karmaşıksa." },
      { id: "p28k2", q: "Reducer neden 'saf' olmalı?", a: "Aynı girdiye aynı çıktı, yan etki yok → öngörülebilir ve React'siz test edilebilir." },
      { id: "p28k3", q: "{ ...u, adet: u.adet + 1 } ne yapar?", a: "u'nun sığ kopyasını oluşturur ve sadece adet alanını günceller; orijinal nesne değişmez." }
    ]
  },

  /* ============================ DERS 29 ============================ */
  {
    id: "p29", no: 29, track: "react", title: "Context & Custom Hooks", short: "Context & Hooks",
    goal: "Prop delmeden (prop drilling) veri paylaş; tekrar eden mantığı kendi hook'larına çıkar.",
    concepts: ["createContext", "Provider · useContext", "custom hook", "use… isimlendirmesi"],
    predict: {
      lang: "jsx",
      code: `import { createContext, useContext } from "react";

const TemaContext = createContext("açık");

function Etiket() {
  const tema = useContext(TemaContext);
  return <p>Tema: {tema}</p>;
}

function App() {
  return (
    <>
      <TemaContext.Provider value="koyu">
        <Etiket />
      </TemaContext.Provider>
      <Etiket />
    </>
  );
}`,
      options: ["koyu, koyu", "koyu, açık", "açık, açık", "Hata verir"], answer: 1,
      why: "useContext en yakın Provider'ın değerini okur. Provider dışındaki Etiket, createContext'e verilen varsayılan değeri (\"açık\") alır."
    },
    example: {
      title: "Custom hook + context",
      lang: "jsx",
      code: `const DilContext = createContext("tr");

function useAcKapa(baslangic = false) {
  const [acik, setAcik] = useState(baslangic);
  const degistir = () => setAcik((a) => !a);
  return [acik, degistir];
}

function Menu() {
  const dil = useContext(DilContext);
  const [acik, degistir] = useAcKapa();
  return (
    <div>
      <button onClick={degistir}>{dil === "tr" ? "Menü" : "Menu"}</button>
      {acik && <ul><li>Profil</li><li>Çıkış</li></ul>}
    </div>
  );
}

function App() {
  return (
    <DilContext.Provider value="en">
      <Menu />
    </DilContext.Provider>
  );
}`,
      steps: [
        { lines: [1], text: "Context: bileşen ağacının derinliklerine props zinciri kurmadan değer taşır (tema, dil, oturum)." },
        { lines: [3, 7], text: "Custom hook: hook kullanan, adı 'use' ile başlayan sıradan bir fonksiyon. Mantığı paylaşır, state'i değil — her çağıran kendi state'ini alır." },
        { lines: [10, 11], text: "Bileşen hem context'i okur hem custom hook'u kullanır. Okuması kolay, tekrar yok." },
        { lines: [21, 23], text: "Provider'ın value'su, altındaki tüm useContext çağrılarına ulaşır." }
      ]
    },
    challenges: [
      {
        id: "p29c1", lang: "jsx", kind: "Değiştir", title: "useSayac Hook'u", fn: "App",
        prompt: "`useSayac(baslangic = 0)` custom hook'u `{ sayi, arttir, azalt }` döndürsün. `arttir`/`azalt` sayıyı 1 değiştirsin.",
        starter: `function useSayac(baslangic = 0) {
  // useState kullan ve { sayi, arttir, azalt } döndür
  return { sayi: baslangic, arttir() {}, azalt() {} };
}

function App() {
  const a = useSayac(0);
  const b = useSayac(10);
  return (
    <div>
      <button onClick={a.arttir}>A: {a.sayi}</button>
      <button onClick={b.azalt}>B: {b.sayi}</button>
    </div>
  );
}
`,
        tests: [
          { label: "varsayılan 0", check: `kd.hook(() => useSayac()).current.sayi`, expected: 0 },
          { label: "başlangıç 5", check: `kd.hook(() => useSayac(5)).current.sayi`, expected: 5 },
          { label: "arttır, arttır, azalt → 6", check: `(async () => { const h = kd.hook(() => useSayac(5)); h.current.arttir(); await kd.tick(); h.current.arttir(); await kd.tick(); h.current.azalt(); await kd.tick(); return h.current.sayi; })()`, expected: 6 }
        ],
        hints: ["Custom hook içinde de useState kullanabilirsin.", "const [sayi, setSayi] = useState(baslangic);", "return { sayi, arttir: () => setSayi((s) => s + 1), azalt: () => setSayi((s) => s - 1) };"],
        solution: `function useSayac(baslangic = 0) {
  const [sayi, setSayi] = useState(baslangic);
  const arttir = () => setSayi((s) => s + 1);
  const azalt = () => setSayi((s) => s - 1);
  return { sayi, arttir, azalt };
}

function App() {
  const a = useSayac(0);
  const b = useSayac(10);
  return (
    <div>
      <button onClick={a.arttir}>A: {a.sayi}</button>
      <button onClick={b.azalt}>B: {b.sayi}</button>
    </div>
  );
}`
      },
      {
        id: "p29c2", lang: "jsx", kind: "Yaz", title: "Tema Context'i", fn: "App",
        prompt: "`TemaButonu` temayı `useContext(TemaContext)` ile okusun (`className` → **btn-TEMA**, metin → **Tema: TEMA**). `App`, butonu **koyu** değerli bir Provider ile sarsın.",
        starter: `const TemaContext = createContext("acik");

function TemaButonu() {
  const tema = "acik"; // useContext ile oku
  return <button className={"btn-" + tema}>Tema: {tema}</button>;
}

function App() {
  // TemaButonu'nu value="koyu" olan bir Provider ile sar
  return <TemaButonu />;
}
`,
        tests: [
          { label: "App içinde koyu", check: `kd.$("#root button")?.className`, expected: "btn-koyu" },
          { label: "metin", check: `kd.$("#root button")?.textContent`, expected: "Tema: koyu" },
          { label: "Provider dışında varsayılan", check: `kd.mount(TemaButonu).querySelector("button").className`, expected: "btn-acik" }
        ],
        hints: ["Bileşen değeri kendisi belirlememeli, context'ten okumalı.", "const tema = useContext(TemaContext);", "<TemaContext.Provider value=\"koyu\"><TemaButonu /></TemaContext.Provider>"],
        solution: `const TemaContext = createContext("acik");

function TemaButonu() {
  const tema = useContext(TemaContext);
  return <button className={"btn-" + tema}>Tema: {tema}</button>;
}

function App() {
  return (
    <TemaContext.Provider value="koyu">
      <TemaButonu />
    </TemaContext.Provider>
  );
}`
      },
      {
        id: "p29c3", lang: "jsx", kind: "Yaz", title: "useFetch Hook'u", fn: "App",
        prompt: "`useFetch(url)` → `{ veri, yukleniyor, hata }`. Başta `yukleniyor: true`; başarılıysa `veri` dolsun; `res.ok` değilse `hata` **HTTP DURUM** (ör. \"HTTP 404\") olsun. url değişince yeniden çeksin.",
        starter: `function useFetch(url) {
  return { veri: null, yukleniyor: true, hata: null };
}

function App() {
  const { veri, yukleniyor, hata } = useFetch("/api/kurslar");
  if (yukleniyor) return <p>Yükleniyor…</p>;
  if (hata) return <p>Hata: {hata}</p>;
  return <ul>{veri.map((k) => <li key={k.id}>{k.ad}</li>)}</ul>;
}
`,
        tests: [
          { label: "başta yükleniyor", check: `kd.hook(() => useFetch("/api/kurslar")).current.yukleniyor`, expected: true },
          { label: "başarılı", check: `(async () => { const h = kd.hook(() => useFetch("/api/kurslar")); await kd.tick(200); return [h.current.yukleniyor, h.current.veri && h.current.veri.length, h.current.hata]; })()`, expected: [false, 3, null] },
          { label: "404", check: `(async () => { const h = kd.hook(() => useFetch("/api/yok")); await kd.tick(200); return [h.current.yukleniyor, h.current.veri, h.current.hata]; })()`, expected: [false, null, "HTTP 404"] }
        ],
        hints: ["Üç state + bir useEffect. Ders 26'daki veri çekme kodunu bir hook'a taşıyorsun.", "useEffect(() => { fetch(url).then(res => { if (!res.ok) throw new Error(\"HTTP \" + res.status); return res.json(); })… }, [url]);", ".then(setVeri).catch(e => setHata(e.message)).finally(() => setYukleniyor(false))"],
        solution: `function useFetch(url) {
  const [veri, setVeri] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    setYukleniyor(true);
    setHata(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(setVeri)
      .catch((e) => setHata(e.message))
      .finally(() => setYukleniyor(false));
  }, [url]);

  return { veri, yukleniyor, hata };
}

function App() {
  const { veri, yukleniyor, hata } = useFetch("/api/kurslar");
  if (yukleniyor) return <p>Yükleniyor…</p>;
  if (hata) return <p>Hata: {hata}</p>;
  return <ul>{veri.map((k) => <li key={k.id}>{k.ad}</li>)}</ul>;
}`
      }
    ],
    cards: [
      { id: "p29k1", q: "Prop drilling nedir, context nasıl çözer?", a: "Veriyi kullanmayan ara bileşenlerden props olarak geçirmek. Context, Provider altındaki her bileşenin değeri doğrudan okumasını sağlar." },
      { id: "p29k2", q: "Custom hook state'i paylaşır mı?", a: "Hayır. Mantığı paylaşır; her çağıran bileşen kendi bağımsız state'ini alır." },
      { id: "p29k3", q: "Hook kuralları?", a: "Sadece bileşenlerde veya custom hook'larda, en üst seviyede çağır (if/döngü içinde değil). Adı 'use' ile başlar." }
    ]
  },

  /* ============================ DERS 30 ============================ */
  {
    id: "p30", no: 30, track: "react", title: "Mini Proje: Kurs Kataloğu", short: "React Projesi",
    goal: "Veri çekme, arama, favoriler, sıralama ve filtrelemeyi tek bir gerçekçi uygulamada birleştir.",
    concepts: ["fetch + state", "türetilmiş liste", "çoklu filtre", "immutability"],
    predict: {
      lang: "jsx",
      code: `const kurslar = [{ ad: "React", sure: 12 }, { ad: "CSS", sure: 6 }];
const sirali = kurslar.sort((a, b) => a.sure - b.sure);
console.log(kurslar[0].ad, sirali === kurslar);`,
      options: ["React false", "CSS true", "CSS false", "React true"], answer: 1,
      why: "sort diziyi YERİNDE değiştirir ve aynı diziyi döndürür. React state'inde bu tehlikeli: önce kopyala → [...kurslar].sort(…)."
    },
    example: {
      title: "Türetilmiş liste deseni",
      lang: "jsx",
      code: `const VERI = [
  { id: 1, ad: "React", sure: 12 },
  { id: 2, ad: "CSS", sure: 6 },
  { id: 3, ad: "HTML", sure: 4 }
];

function App() {
  const [arama, setArama] = useState("");
  const [kisa, setKisa] = useState(false);

  // state'i değiştirmeden, her render'da gösterilecek listeyi TÜRET
  let liste = VERI.filter((k) => k.ad.toLowerCase().includes(arama.toLowerCase()));
  if (kisa) liste = liste.filter((k) => k.sure <= 6);
  liste = [...liste].sort((a, b) => a.sure - b.sure);

  return (
    <div>
      <input value={arama} onChange={(e) => setArama(e.target.value)} placeholder="Ara" />
      <label><input type="checkbox" checked={kisa} onChange={(e) => setKisa(e.target.checked)} /> Kısa kurslar</label>
      <ul>{liste.map((k) => <li key={k.id}>{k.ad} · {k.sure} saat</li>)}</ul>
    </div>
  );
}`,
      steps: [
        { lines: [8, 9], text: "State minimal: sadece kullanıcının seçtikleri (arama metni, onay kutusu)." },
        { lines: [12, 13, 14], text: "Gösterilecek liste state DEĞİL — her render'da kaynak veriden filtre/sıralama zinciriyle türetilir." },
        { lines: [14], text: "Sıralamadan önce kopya: [...liste]. Orijinal veri asla değişmez." },
        { lines: [19], text: "Checkbox'ta value değil checked, e.target.value değil e.target.checked." }
      ]
    },
    challenges: [
      {
        id: "p30c1", lang: "jsx", kind: "Yaz", title: "Katalog + Arama", fn: "App",
        prompt: "`KursKatalogu` ilk yüklemede **/api/katalog**'dan kursları çeksin, her biri `li.kurs` içinde `span.ad` ile görünsün. `#ara` kutusu kurs adına göre **büyük/küçük harf duyarsız** süzsün.",
        starter: `function KursKatalogu() {
  const [kurslar, setKurslar] = useState([]);
  const [arama, setArama] = useState("");

  // 1) /api/katalog'dan kursları çek
  // 2) arama'ya göre süz

  return (
    <div>
      <input id="ara" placeholder="Kurs ara…" />
      <ul>
        {kurslar.map((k) => (
          <li className="kurs" key={k.id}>
            <span className="ad">{k.ad}</span> · {k.sure} saat
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return <KursKatalogu />;
}
`,
        tests: [
          { label: "kurslar yüklenir", check: `(async () => { await kd.tick(200); return ${ADLAR}; })()`, expected: ["React", "CSS", "Node.js", "HTML", "TypeScript"] },
          { label: '"script"', check: `(async () => { await kd.type("#ara", "script"); return ${ADLAR}; })()`, expected: ["TypeScript"] },
          { label: '"S" (büyük harf)', check: `(async () => { await kd.type("#ara", "S"); return ${ADLAR}; })()`, expected: ["CSS", "Node.js", "TypeScript"] },
          { label: "boş → hepsi", check: `(async () => { await kd.type("#ara", ""); return kd.$$("li.kurs").length; })()`, expected: 5 }
        ],
        hints: ["İki bağımsız iş: effect ile veri çekme (Ders 26) + kontrollü input (Ders 25).", "useEffect(() => { fetch(\"/api/katalog\").then((r) => r.json()).then(setKurslar); }, []);", "const gorunen = kurslar.filter((k) => k.ad.toLowerCase().includes(arama.toLowerCase())); — map'i gorunen üzerinde yap."],
        solution: `function KursKatalogu() {
  const [kurslar, setKurslar] = useState([]);
  const [arama, setArama] = useState("");

  useEffect(() => {
    fetch("/api/katalog").then((r) => r.json()).then(setKurslar);
  }, []);

  const gorunen = kurslar.filter((k) => k.ad.toLowerCase().includes(arama.toLowerCase()));

  return (
    <div>
      <input id="ara" placeholder="Kurs ara…" value={arama} onChange={(e) => setArama(e.target.value)} />
      <ul>
        {gorunen.map((k) => (
          <li className="kurs" key={k.id}>
            <span className="ad">{k.ad}</span> · {k.sure} saat
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return <KursKatalogu />;
}`
      },
      {
        id: "p30c2", lang: "jsx", kind: "Yaz", title: "Favoriler", fn: "App",
        prompt: "Her kursa bir `button.favori` ekle: favoriyse **★**, değilse **☆**. Tıklayınca favori durumu değişsin. `#fav-sayi` **N favori** göstersin. Favoriler **id ile** saklansın (arama değişince kaybolmasın).",
        starter: `function KursKatalogu() {
  const [kurslar, setKurslar] = useState([]);
  const [arama, setArama] = useState("");
  // favoriler state'i (id dizisi)

  useEffect(() => {
    fetch("/api/katalog").then((r) => r.json()).then(setKurslar);
  }, []);

  const gorunen = kurslar.filter((k) => k.ad.toLowerCase().includes(arama.toLowerCase()));

  return (
    <div>
      <input id="ara" placeholder="Kurs ara…" value={arama} onChange={(e) => setArama(e.target.value)} />
      <ul>
        {gorunen.map((k) => (
          <li className="kurs" key={k.id}>
            <span className="ad">{k.ad}</span> · {k.sure} saat
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return <KursKatalogu />;
}
`,
        tests: [
          { label: "başta 0 favori", check: `(async () => { await kd.tick(200); return kd.text("#fav-sayi"); })()`, expected: "0 favori" },
          { label: "ilkini favorile", check: `(async () => { await kd.click(kd.$$("li.kurs .favori")[0]); return [kd.$$("li.kurs .favori")[0].textContent, kd.text("#fav-sayi")]; })()`, expected: ["★", "1 favori"] },
          { label: "ikinci favori", check: `(async () => { await kd.click(kd.$$("li.kurs .favori")[2]); return kd.text("#fav-sayi"); })()`, expected: "2 favori" },
          { label: "favoriden çıkar", check: `(async () => { await kd.click(kd.$$("li.kurs .favori")[0]); return [kd.$$("li.kurs .favori")[0].textContent, kd.text("#fav-sayi")]; })()`, expected: ["☆", "1 favori"] },
          { label: "arama favorileri silmez", check: `(async () => { await kd.type("#ara", "node"); await kd.type("#ara", ""); return kd.text("#fav-sayi"); })()`, expected: "1 favori" }
        ],
        hints: ["Favorileri kurs nesnesinde değil, ayrı bir id dizisinde tut: const [favoriler, setFavoriler] = useState([]);", "Aç/kapa: setFavoriler((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id]);", "<button className=\"favori\" onClick={…}>{favoriler.includes(k.id) ? \"★\" : \"☆\"}</button> · <p id=\"fav-sayi\">{favoriler.length} favori</p>"],
        solution: `function KursKatalogu() {
  const [kurslar, setKurslar] = useState([]);
  const [arama, setArama] = useState("");
  const [favoriler, setFavoriler] = useState([]);

  useEffect(() => {
    fetch("/api/katalog").then((r) => r.json()).then(setKurslar);
  }, []);

  function favoriDegistir(id) {
    setFavoriler((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  const gorunen = kurslar.filter((k) => k.ad.toLowerCase().includes(arama.toLowerCase()));

  return (
    <div>
      <input id="ara" placeholder="Kurs ara…" value={arama} onChange={(e) => setArama(e.target.value)} />
      <p id="fav-sayi">{favoriler.length} favori</p>
      <ul>
        {gorunen.map((k) => (
          <li className="kurs" key={k.id}>
            <span className="ad">{k.ad}</span> · {k.sure} saat
            <button className="favori" onClick={() => favoriDegistir(k.id)}>
              {favoriler.includes(k.id) ? "★" : "☆"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return <KursKatalogu />;
}`
      },
      {
        id: "p30c3", lang: "jsx", kind: "Yaz", title: "Sıralama & Sadece Favoriler", fn: "App",
        prompt: "Kataloğu tamamla: `select#sirala` (değerler: **varsayilan**, **ad**, **sure**) listeyi ada (alfabetik) veya süreye (artan) göre sıralasın. `#sadece-fav` onay kutusu işaretliyse sadece favoriler görünsün. Orijinal diziyi **değiştirmeden** sırala.",
        starter: `function KursKatalogu() {
  const [kurslar, setKurslar] = useState([]);
  const [arama, setArama] = useState("");
  const [favoriler, setFavoriler] = useState([]);
  // siralama ve sadeceFav state'leri

  useEffect(() => {
    fetch("/api/katalog").then((r) => r.json()).then(setKurslar);
  }, []);

  function favoriDegistir(id) {
    setFavoriler((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  const gorunen = kurslar.filter((k) => k.ad.toLowerCase().includes(arama.toLowerCase()));

  return (
    <div>
      <input id="ara" placeholder="Kurs ara…" value={arama} onChange={(e) => setArama(e.target.value)} />
      {/* select#sirala ve checkbox#sadece-fav buraya */}
      <p id="fav-sayi">{favoriler.length} favori</p>
      <ul>
        {gorunen.map((k) => (
          <li className="kurs" key={k.id}>
            <span className="ad">{k.ad}</span> · {k.sure} saat
            <button className="favori" onClick={() => favoriDegistir(k.id)}>
              {favoriler.includes(k.id) ? "★" : "☆"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return <KursKatalogu />;
}
`,
        tests: [
          { label: "süreye göre", check: `(async () => { await kd.tick(200); await kd.type("#sirala", "sure"); return ${ADLAR}; })()`, expected: ["HTML", "CSS", "TypeScript", "React", "Node.js"] },
          { label: "ada göre", check: `(async () => { await kd.type("#sirala", "ad"); return ${ADLAR}; })()`, expected: ["CSS", "HTML", "Node.js", "React", "TypeScript"] },
          { label: "sadece favoriler", check: `(async () => { await kd.click(kd.$$("li.kurs .favori")[3]); await kd.click("#sadece-fav"); return ${ADLAR}; })()`, expected: ["React"] },
          { label: "filtre kapanınca hepsi", check: `(async () => { await kd.click("#sadece-fav"); return kd.$$("li.kurs").length; })()`, expected: 5 },
          { label: "varsayılan sıra korunur", check: `(async () => { await kd.type("#sirala", "varsayilan"); return ${ADLAR}; })()`, expected: ["React", "CSS", "Node.js", "HTML", "TypeScript"] }
        ],
        hints: ["Örnekteki türetilmiş liste zincirini hatırla: filtrele → filtrele → (kopyala ve) sırala.", "let gorunen = …; if (sadeceFav) gorunen = gorunen.filter((k) => favoriler.includes(k.id));", "if (siralama === \"ad\") gorunen = [...gorunen].sort((a, b) => a.ad.localeCompare(b.ad, \"tr\")); — süre için a.sure - b.sure"],
        solution: `function KursKatalogu() {
  const [kurslar, setKurslar] = useState([]);
  const [arama, setArama] = useState("");
  const [favoriler, setFavoriler] = useState([]);
  const [siralama, setSiralama] = useState("varsayilan");
  const [sadeceFav, setSadeceFav] = useState(false);

  useEffect(() => {
    fetch("/api/katalog").then((r) => r.json()).then(setKurslar);
  }, []);

  function favoriDegistir(id) {
    setFavoriler((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  let gorunen = kurslar.filter((k) => k.ad.toLowerCase().includes(arama.toLowerCase()));
  if (sadeceFav) gorunen = gorunen.filter((k) => favoriler.includes(k.id));
  if (siralama === "ad") gorunen = [...gorunen].sort((a, b) => a.ad.localeCompare(b.ad, "tr"));
  if (siralama === "sure") gorunen = [...gorunen].sort((a, b) => a.sure - b.sure);

  return (
    <div>
      <input id="ara" placeholder="Kurs ara…" value={arama} onChange={(e) => setArama(e.target.value)} />
      <select id="sirala" value={siralama} onChange={(e) => setSiralama(e.target.value)}>
        <option value="varsayilan">Önerilen</option>
        <option value="ad">Ada göre</option>
        <option value="sure">Süreye göre</option>
      </select>
      <label>
        <input id="sadece-fav" type="checkbox" checked={sadeceFav} onChange={(e) => setSadeceFav(e.target.checked)} /> Sadece favoriler
      </label>
      <p id="fav-sayi">{favoriler.length} favori</p>
      <ul>
        {gorunen.map((k) => (
          <li className="kurs" key={k.id}>
            <span className="ad">{k.ad}</span> · {k.sure} saat
            <button className="favori" onClick={() => favoriDegistir(k.id)}>
              {favoriler.includes(k.id) ? "★" : "☆"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return <KursKatalogu />;
}`
      }
    ],
    cards: [
      { id: "p30k1", q: "Array.prototype.sort'un React state'i için tehlikesi?", a: "Diziyi yerinde değiştirir. Önce kopyala: [...liste].sort(…)." },
      { id: "p30k2", q: "Filtrelenmiş liste state'te mi tutulmalı?", a: "Hayır. Kaynak veri + kullanıcı seçimlerinden her render'da türetilmeli." },
      { id: "p30k3", q: "Bir React özelliğini eklerken sıra?", a: "Hangi state gerekli (minimal)? → nerede yaşamalı? → nasıl türetilir/render edilir? → olaylar state'i nasıl değiştirir?" }
    ]
  }
  ];

  window.KD_CURRICULUM = (window.KD_CURRICULUM || []).concat(REACT);
})();
