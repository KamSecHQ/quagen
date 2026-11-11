/* QUAGEN — KAM: öğrencinin yanındaki yapay zekâ öğretmeni (her dilde; sohbetle ders şimdilik C'de)
 *  1. Tanışma: ilk girişte sohbetle tanır, gerçekçi bir çalışma planı çıkarır.
 *  2. Karşılama: panelde duruma göre (seri, ara verme, bekleyen kartlar) konuşur ve bugünün planını verir.
 *  3. Ders: konuyu mesajlaşarak anlatır; anlattıkça yandaki sahnede kod değişir, satırlar vurgulanır, çalışır.
 *  4. Sohbet penceresi: her sayfada sağ altta. Yapay zekâ açıksa /api/kam, değilse Kütüphane'nin niyet aramasıyla cevaplar.
 * Senaryolar: assets/js/kam-dersler-c.js. Senaryosu olmayan dersler için ders verisinden otomatik sohbet üretilir.
 */
(function () {
  const KD = window.KD;
  if (!KD) return;
  const S = KD.store;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const md = (s) => (KD.md ? KD.md(s) : esc(s));
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  const A = () => window.KD_APP || {};
  const DIL = KD.lang;
  const aktif = () => true;                      // karşılama, plan ve sohbet her dilde
  const dersVar = () => DIL === "c";             // sohbetle ders: şimdilik yalnızca C
  const EK = ({ c: { ad: "C", de: "C'de", yi: "C'yi", nin: "C'nin" }, py: { ad: "Python", de: "Python'da", yi: "Python'ı", nin: "Python'ın" }, js: { ad: "JavaScript", de: "JavaScript'te", yi: "JavaScript'i", nin: "JavaScript'in" } })[DIL] || { ad: "Bu dil", de: "Bu dilde", yi: "Bu dili", nin: "Bu dilin" };
  const durum = () => (S.state.kam = S.state.kam || {});
  const GUN = 864e5;
  const AVATAR = '<span class="kam-av" aria-hidden="true"><b></b><b></b><i></i></span>';

  /* ------------------------------------------------------------------ sohbet akışı */
  function sohbet(akis, cevapAlani) {
    let hizli = false;
    const kaydir = () => { akis.scrollTop = akis.scrollHeight; };
    const balon = (html, kim) => { const d = document.createElement("div"); d.className = "kam-msg " + kim; d.innerHTML = html; akis.append(d); kaydir(); return d; };
    return {
      set hizli(v) { hizli = v; }, get hizli() { return hizli; },
      async kam(metin, ekHtml = "") {
        if (!hizli && !reduced()) {
          const y = balon('<span class="kam-yaziyor"><i></i><i></i><i></i></span>', "k");
          await bekle(Math.min(1500, 420 + metin.length * 11));
          y.remove();
        }
        return balon(md(metin).replace(/\n/g, "<br>") + ekHtml, "k");
      },
      sen(metin) { return balon(esc(metin), "s"); },
      /* Hazır cevaplar: seçilen balona dönüşür. Hızlı modda ilki seçilir. */
      secenek(liste, { beklet = false } = {}) {
        if (hizli && !beklet) { this.sen(liste[0]); return Promise.resolve(0); }
        return new Promise((coz) => {
          cevapAlani.innerHTML = liste.map((t, i) => `<button class="kam-chip" style="--i:${i}" data-i="${i}">${esc(t)}</button>`).join("");
          const ilk = $(".kam-chip", cevapAlani);
          if (ilk && cevapAlani.dataset.odak !== "yok") ilk.focus({ preventScroll: true });
          $$(".kam-chip", cevapAlani).forEach((b) => (b.onclick = () => { cevapAlani.innerHTML = ""; this.sen(liste[+b.dataset.i]); coz(+b.dataset.i); }));
          kaydir();
        });
      },
      /* Serbest metin sorusu (tanışmada ad için) */
      yaz(yerTutucu, atla) {
        return new Promise((coz) => {
          cevapAlani.innerHTML = `<form class="kam-yaz"><input maxlength="40" placeholder="${esc(yerTutucu)}" autocomplete="off" /><button class="kam-chip dolu">Gönder</button>${atla ? `<button type="button" class="kam-chip" data-atla>${esc(atla)}</button>` : ""}</form>`;
          const f = $("form", cevapAlani), inp = $("input", f);
          inp.focus({ preventScroll: true });
          const bitir = (v) => { cevapAlani.innerHTML = ""; this.sen(v || atla || "…"); coz(v); };
          f.onsubmit = (e) => { e.preventDefault(); bitir(inp.value.trim()); };
          if (atla) $("[data-atla]", f).onclick = () => bitir("");
        });
      }
    };
  }

  /* ------------------------------------------------------------------ plan ve durum */
  const cFazlar = () => (window.KD_CURRICULUM || []).filter((p) => (p.language || "js") === DIL);
  function ilerleme() {
    const fazlar = cFazlar(), a = A();
    const biten = a.mastery ? fazlar.filter((p) => a.mastery(p) === 1).length : 0;
    const st = S.state.streak || {};
    const sonGun = st.last ? Math.round((new Date(S.day()) - new Date(st.last)) / GUN) : null;
    return { toplam: fazlar.length, biten, kalan: fazlar.length - biten, seri: st.count || 0, sonGun, bugunXp: S.state.daily[S.day()] || 0, hedef: S.state.prefs.goal || 50, bekleyen: a.due ? a.due() : 0, sirada: a.nextTarget ? a.nextTarget() : null };
  }
  /* Ders başına gerçekçi süre: ders ~10 dk + üç görev ~25 dk + kartlar ~5 dk */
  const FAZ_DK = 40;
  function planHesapla(dk, kalanFaz) {
    const ileri = Math.max(0, cFazlar().length - 10);        // ilk 10 ders temel, kalanı ileri düzey
    const temel = Math.max(0, Math.min(10, kalanFaz - ileri));
    const gun = (faz) => Math.max(1, Math.ceil((faz * FAZ_DK) / dk));
    return { dk, temelFaz: temel, temelGun: gun(temel), tumGun: gun(kalanFaz), kalanFaz };
  }
  const sureMetni = (gun) => (gun <= 10 ? gun + " gün" : gun <= 45 ? "yaklaşık " + Math.round(gun / 7) + " hafta" : "yaklaşık " + Math.round(gun / 30) + " ay");
  function planMetni(pl) {
    const temel = pl.temelFaz > 0 ? `${EK.ad} temellerini (kalan ${pl.temelFaz} faz) **${sureMetni(pl.temelGun)}** içinde, ` : "";
    return `Günde **${pl.dk} dakika** ile ${temel}${EK.nin} tamamını (kalan ${pl.kalanFaz} faz) **${sureMetni(pl.tumGun)}** içinde bitirirsin. Bu, her gün çalıştığın varsayımıyla; hafta sonları boş geçerse süre uzar, sorun değil.`;
  }
  const selamSaat = () => { const h = new Date().getHours(); return h < 5 ? "Geç oldu" : h < 12 ? "Günaydın" : h < 18 ? "Selam" : "İyi akşamlar"; };
  const adimAdi = (k) => ({ tahmin: "tahmin sorusu", incele: "konuyu ben anlatacağım", kodla: "görevler", hatirla: "tekrar kartları" })[k] || k;

  /* Duruma göre gerçekçi karşılama cümlesi */
  function karsilamaMetni(d) {
    const ad = S.state.prefs.name ? ", " + S.state.prefs.name : "";
    if (d.biten === d.toplam && d.toplam) return `${selamSaat()}${ad}. ${EK.ad} parkurunun tamamını bitirdin; bunu çok az kişi yapıyor. Artık iş tekrar kartlarını canlı tutmakta.`;
    if (d.sonGun === null) return `${selamSaat()}${ad}. Henüz ilk dersi yapmadık. İlk adım en zoru; 10 dakika ayır, gerisi gelir.`;
    if (d.sonGun === 0) return d.bugunXp >= d.hedef
      ? `Bugünkü hedefini tamamladın${ad}. Devam etmek istersen buradayım, ama bırakmak da gayet makul; yarın daha taze olursun.`
      : `Bugün başlamışsın${ad}; hedefe ${Math.max(0, d.hedef - d.bugunXp)} XP kaldı. Bir görev daha yeter.`;
    if (d.sonGun === 1) return `${selamSaat()}${ad}. Dün çalıştın, ${d.seri} günlük serin var. Bugün de kısa bir oturum onu korur.`;
    if (d.sonGun <= 3) return `${selamSaat()}${ad}. ${d.sonGun} gündür yoktun. Olur böyle; önemli olan geri dönmek. Önce kısa bir tekrarla ısınalım.`;
    return `Tekrar hoş geldin${ad}. ${d.sonGun} gün ara vermişsin; bazı şeyleri unutmuş olman normal, kendini suçlama. Kartlarla hafızayı tazeleyip kaldığımız yerden devam edelim.`;
  }
  function bugununPlani(d) {
    const liste = [];
    if (d.bekleyen > 0) liste.push({ metin: `${d.bekleyen} kartı tekrar et`, sure: Math.max(2, Math.round(d.bekleyen * 0.5)) + " dk", href: "#tekrar" });
    if (d.sirada) {
      const { p, step, ch } = d.sirada;
      liste.push({ metin: `Ders ${p.no} · ${p.short || p.title}: ${step === "kodla" && ch ? "“" + ch.title + "” görevi" : adimAdi(step)}`, sure: step === "kodla" ? "10 dk" : step === "incele" ? "10 dk" : "3 dk", href: `#${p.id}/${step}${step === "kodla" && ch ? "/" + ch.id : ""}` });
    }
    return liste;
  }

  /* ------------------------------------------------------------------ panel kartı */
  function karsila(view) {
    if (!aktif() || !view || $(".kam-kart", view)) return;
    const d = ilerleme();
    const plan = bugununPlani(d);
    const kart = document.createElement("section");
    kart.className = "kam-kart";
    kart.innerHTML = `${AVATAR}
      <div class="kam-kart-govde">
        <p class="kam-kart-ad">KAM</p>
        <p class="kam-kart-metin" id="kam-kart-metin"></p>
        ${plan.length ? `<ol class="kam-plan">${plan.map((x, i) => `<li style="--i:${i}"><a href="${x.href}"><span class="kp-no">${i + 1}</span><span class="kp-t">${esc(x.metin)}</span><span class="kp-s">${x.sure}</span></a></li>`).join("")}</ol>` : ""}
        <div class="kam-kart-alt"><button class="btn sm" id="kam-kart-ac">KAM ile konuş</button>${durum().dk ? `<span class="muted small">Planın: günde ${durum().dk} dk · ${d.biten}/${d.toplam} ders</span>` : ""}</div>
      </div>`;
    view.prepend(kart);
    yazdir($("#kam-kart-metin", kart), karsilamaMetni(d));
    $("#kam-kart-ac", kart).onclick = () => cekmeceAc();
  }
  /* Metni harf harf yazar (kısa karşılama cümleleri için) */
  function yazdir(el, metin) {
    if (reduced()) { el.innerHTML = md(metin); return; }
    let i = 0;
    const adim = () => { if (!el.isConnected) return; i = Math.min(metin.length, i + 2); el.textContent = metin.slice(0, i); if (i < metin.length) setTimeout(adim, 14); else el.innerHTML = md(metin); };
    adim();
  }

  /* ------------------------------------------------------------------ sohbet penceresi */
  let cekmece = null, cs = null, aiVar = null, gecmis = [];
  function cekmeceKur() {
    if (cekmece) return cekmece;
    const fab = document.createElement("button");
    fab.className = "kam-fab"; fab.id = "kam-fab"; fab.setAttribute("aria-label", "KAM ile konuş");
    fab.innerHTML = `${AVATAR}<span>KAM</span>`;
    cekmece = document.createElement("aside");
    cekmece.className = "kam-cekmece"; cekmece.hidden = true; cekmece.setAttribute("aria-label", "KAM ile sohbet");
    cekmece.innerHTML = `
      <header class="kam-bas">${AVATAR}<div><b>KAM</b><small id="kam-mod">Bir şey sor, anlatayım</small></div><button class="icon-btn" id="kam-kapat" aria-label="Kapat">×</button></header>
      <div class="kam-akis" id="kam-akis" aria-live="polite"></div>
      <div class="kam-cevap" id="kam-cevap" data-odak="yok"></div>
      <form class="kam-form" id="kam-form"><input id="kam-girdi" placeholder="KAM'e yaz… (ör. işaretçi ne demek?)" autocomplete="off" maxlength="300" /><button class="btn primary sm" aria-label="Gönder">Gönder</button></form>`;
    document.body.append(fab, cekmece);
    cs = sohbet($("#kam-akis", cekmece), $("#kam-cevap", cekmece));
    fab.onclick = () => (cekmece.hidden ? cekmeceAc() : cekmeceKapat());
    $("#kam-kapat", cekmece).onclick = cekmeceKapat;
    $("#kam-form", cekmece).onsubmit = (e) => { e.preventDefault(); const g = $("#kam-girdi", cekmece); const q = g.value.trim(); if (!q) return; g.value = ""; soruCevapla(q); };
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !cekmece.hidden) cekmeceKapat(); });
    if (KD.tutor) KD.tutor.available().then((on) => { aiVar = on; $("#kam-mod", cekmece).textContent = on ? "Yapay zekâ çevrimiçi" : "Bir şey sor, anlatayım"; });
    return cekmece;
  }
  let selamVerildi = false;
  function cekmeceAc(ilkSoru) {
    cekmeceKur();
    cekmece.hidden = false;
    requestAnimationFrame(() => cekmece.classList.add("acik"));
    $("#kam-fab").classList.add("acik");
    if (ilkSoru) return soruCevapla(ilkSoru);
    if (!selamVerildi && !tanisiyor) { selamVerildi = true; anaMenu(karsilamaMetni(ilerleme())); }
    setTimeout(() => $("#kam-girdi", cekmece).focus({ preventScroll: true }), 250);
  }
  function cekmeceKapat() { if (!cekmece) return; cekmece.classList.remove("acik"); $("#kam-fab").classList.remove("acik"); setTimeout(() => (cekmece.hidden = true), 220); }

  const MENU = ["Bugün ne yapmalıyım?", "Planımı göster", "Takıldım", "Motivasyonum düştü"];
  async function anaMenu(giris) {
    if (giris) await cs.kam(giris);
    const i = await cs.secenek(MENU, { beklet: true });
    await menuCevap(i);
  }
  async function menuCevap(i) {
    const d = ilerleme();
    if (i === 0) {
      const plan = bugununPlani(d);
      if (!plan.length) await cs.kam("Bugün için bekleyen bir şey yok. İstersen karma antrenmanla eski görevleri hafızandan yeniden yaz; en kalıcı çalışma şekli o.");
      else await cs.kam(`Bugün için önerim, sırayla:\n${plan.map((x, k) => `**${k + 1}.** ${x.metin} (${x.sure})`).join("\n")}\n\nHepsi ${plan.length > 1 ? "yaklaşık 15 dakika" : "10 dakika kadar"} sürer.`, `<div class="kam-linkler">${plan.map((x) => `<a class="kam-chip dolu" href="${x.href}">${esc(x.metin.split(":")[0])} →</a>`).join("")}</div>`);
    } else if (i === 1) {
      const dk = durum().dk || 30;
      await cs.kam(`Şu ana kadar **${d.biten}/${d.toplam}** dersi tamamladın${d.seri ? `, serin ${d.seri} gün` : ""}.\n\n${planMetni(planHesapla(dk, d.kalan))}`);
      const j = await cs.secenek(["Tempo iyi", "Daha hafif olsun", "Daha yoğun olsun"], { beklet: true });
      if (j > 0) {
        const yeni = j === 1 ? Math.max(10, Math.round(dk / 2 / 5) * 5) : Math.min(120, dk * 2);
        durum().dk = yeni; S.state.prefs.goal = yeni <= 15 ? 20 : yeni <= 30 ? 50 : 100; S.save();
        await cs.kam(`Tamam, günde **${yeni} dakika**ya çektim. ${planMetni(planHesapla(yeni, d.kalan))}${j === 1 ? "\n\nAz ama düzenli, çok ama seyrekten iyidir." : "\n\nYoğun tempo güzel ama tutamazsan söyle, düşürürüz."}`);
      } else await cs.kam("Güzel. Bir şey değişirse söylemen yeterli.");
    } else if (i === 2) {
      const gorevde = /\/kodla/.test(location.hash);
      await cs.kam(gorevde
        ? "Takılmak işin parçası; çözemediğin her dakika boşa gitmiyor. Sırayla dene:\n**1.** Testleri çalıştır ve hata mesajını **kelime kelime** oku.\n**2.** “Örnek” sekmesindeki çözümlü örneğe dön; aynı teknik orada var.\n**3.** Görev panelindeki KAM sekmesinden bir ipucu al.\n**4.** Hâlâ olmuyorsa hata mesajını buraya yapıştır, birlikte bakalım."
        : "Neye takıldığını bir cümleyle yaz, oradan gidelim. Örneğin: “işaretçi ne demek?”, “for döngüsünü anlamadım” ya da hata mesajının kendisi.");
    } else {
      const m = d.seri >= 3
        ? `Motivasyon gelip gider; ona güvenme. Sen ${d.seri} gündür buradasın, yani zaten alışkanlık kurmuşsun. Bugün canın istemiyorsa yalnızca tekrar kartlarını yap ve kapat. O da sayılır.`
        : d.biten > 0
        ? `Dürüst olayım: programlama zor ve herkes bir noktada “ben bunu yapamayacağım” diyor. Sen ${d.biten} ders bitirdin; başladığın günkü hâlinle bugünkü arasında gerçek bir fark var. Bugün yalnızca 10 dakika ayır. Çoğu zaman başlamak yetiyor.`
        : "İlk günlerde her şey yabancı gelir ve yavaş ilerlersin; bu yeteneksizlik değil, başlangıç. Kimse işaretçileri ilk seferde anlamadı. Bugün tek bir şey yap: ilk dersi aç ve 10 dakika dinle. Devam edip etmemeye ondan sonra karar verirsin.";
      await cs.kam(m);
    }
    anaMenu();
  }

  /* Serbest soru: yapay zekâ açıksa ona, değilse Kütüphane'nin niyet aramasına */
  async function soruCevapla(q) {
    cekmeceKur();
    $("#kam-cevap", cekmece).innerHTML = "";
    cs.sen(q);
    gecmis.push({ kim: "ogrenci", metin: q });
    const b = baglam();
    if (aiVar) {
      const y = cs.kam("…");
      try {
        const r = await fetch("/api/kam", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ soru: q, baglam: b, gecmis: gecmis.slice(-8) }) });
        const j = await r.json();
        (await y).remove();
        if (!r.ok) throw new Error(j.error || "yanıt alınamadı");
        gecmis.push({ kim: "kam", metin: j.cevap });
        await cs.kam("", aiHtml(j.cevap));
        return anaMenuSessiz();
      } catch (e) { try { (await y).remove(); } catch (_) {} }
    }
    await yerelCevap(q);
    anaMenuSessiz();
  }
  const anaMenuSessiz = () => cs.secenek(MENU, { beklet: true }).then(menuCevap);
  function aiHtml(s) {
    return String(s).split(/```(\w*)\n?([\s\S]*?)```/).map((p, i) => (i % 3 === 1 ? "" : i % 3 === 2 ? `<pre class="code kam-kod"><code>${KD.hlDoc ? KD.hlDoc(p.replace(/\n$/, ""), "c").join("\n") : esc(p)}</code></pre>` : p.split(/\n{2,}/).filter((x) => x.trim()).map((x) => `<p>${md(x.trim()).replace(/\n/g, "<br>")}</p>`).join(""))).join("");
  }
  function baglam() {
    const m = location.hash.match(/^#([a-z]+\d+)(?:\/(\w+))?(?:\/(\w+))?/);
    if (!m) return { sayfa: "panel" };
    const p = cFazlar().find((x) => x.id === m[1]);
    const ch = p && m[3] ? p.challenges.find((c) => c.id === m[3]) : null;
    return { sayfa: "faz", faz: p ? `Ders ${p.no}: ${p.title}` : "", adim: m[2] || "", gorev: ch ? ch.title + " — " + ch.prompt : "" };
  }
  async function yerelCevap(q) {
    const ara = window.KD_REHBER_ARA, R = window.KD_REHBER;
    const duz = q.toLocaleLowerCase("tr");
    if (/te[sş]ekk[uü]r|sa[gğ] ?ol|eyvallah/.test(duz)) return cs.kam("Ne demek. Buradayım.");
    if (/^(selam|merhaba|hey|sa\b|naber|nasılsın)/.test(duz)) return cs.kam("Selam. İyiyim, senin için buradayım. Bugün neye bakalım?");
    if (ara && R) {
      const r = ara(q, { dil: DIL });
      const k = r.sonuclar.find((x) => x.tur === "kavram" && x.kavram.diller[DIL]);
      const t = r.sonuclar.find((x) => x.tur === "terim");
      if (t && (r.tanimSorusu || !k)) return cs.kam(`**${t.terim.terim}** (${t.terim.ing}): ${t.terim.tanim}`);
      if (k && r.guven >= 0.3) {
        const g = k.kavram.diller[DIL];
        return cs.kam(`${k.kavram.baslik} için ${EK.de} \`${g.ad}\` kullanılır.\n\n${g.aciklama}${g.not ? "\n\n**Dikkat:** " + g.not : ""}`, `<pre class="code kam-kod"><code>${KD.hlDoc ? KD.hlDoc(g.ornek, DIL).join("\n") : esc(g.ornek)}</code></pre><a class="kam-chip" href="rehber.html#/k/${k.kavram.id}/${DIL}" target="_blank" rel="noopener">Kütüphane'de aç ve çalıştır →</a>`);
      }
    }
    if (/hata|error|warning|çök|segmentation|sanitizer|overflow/.test(duz)) return cs.kam("Hata mesajlarında üç şeye bak: **satır numarası**, hatanın **türü** (ör. `undeclared`, `expected ';'`, `buffer-overflow`) ve o satırda hangi değişkenlerin geçtiği. Mesajın tamamını buraya yapıştırırsan daha net konuşabiliriz.");
    return cs.kam(aiVar === false
      ? "Bunu tam çıkaramadım. Daha kısa sorar mısın? Örneğin: “döngü nedir”, “liste nasıl sıralanır”, “fonksiyon nasıl yazılır”. Hata aldıysan mesajı yapıştır."
      : "Bunu tam çıkaramadım; biraz daha açık yazar mısın?");
  }

  /* ------------------------------------------------------------------ tanışma */
  let tanisiyor = false;
  async function tanis() {
    if (!aktif()) return false;
    tanisiyor = true;
    cekmeceKur();
    cekmece.classList.add("genis");
    cekmeceAc();
    $("#kam-form", cekmece).hidden = true;
    const pr = S.state.prefs;
    if (pr.name) await cs.kam(`Selam ${pr.name}, ben **KAM**. ${EK.yi} birlikte öğreneceğiz: konuları ben anlatacağım, takıldığında bana yazacaksın.`);
    else {
      await cs.kam("Selam, ben **KAM**. Bu yolculukta yanında ben olacağım: konuları ben anlatacağım, takıldığında bana yazacaksın.");
      await cs.kam("Önce seni tanıyayım. Sana nasıl hitap edeyim?");
      const ad = await cs.yaz("Adın", "Sonra söylerim");
      if (ad) pr.name = ad;
      await cs.kam(pr.name ? "Memnun oldum, " + pr.name + "." : "Tamam, isimsiz devam ediyoruz.");
    }
    await cs.kam("Daha önce hiç kod yazdın mı?");
    const dz = await cs.secenek(["Hiç yazmadım", "Başka bir dil biliyorum", `Biraz ${EK.ad} biliyorum`], { beklet: true });
    pr.level = ["yeni", "biraz", DIL][dz];
    await cs.kam([
      "Güzel, sıfırdan başlıyoruz. Bildiğini varsaydığım hiçbir şey olmayacak; her yeni kelimeyi ilk geçtiği yerde açıklayacağım.",
      ({ c: "İyi; değişken ve döngü fikri sende var. C'de asıl yeni olan şey bellek: türler, işaretçiler, `malloc`. Orada yavaşlayacağız.",
         py: "İyi; değişken ve döngü fikri sende var. Python'da yeni olan şey girintiler ve hazır veri yapıları: liste, sözlük, küme. Onlara zaman ayıracağız.",
         js: "İyi; değişken ve döngü fikri sende var. JavaScript'te asıl yeni olan şey fonksiyonların değer gibi dolaşması ve asenkron kod. Orada yavaşlayacağız." })[DIL] || "İyi; temel fikirler sende var, bu dilin kendine özgü yanlarına odaklanacağız.",
      "O zaman ilk dersler hızlı geçer. Yine de atlama; eksik kalan yerler ileri derslerde ortaya çıkıyor."
    ][dz]);
    await cs.kam("Günde ne kadar zaman ayırabilirsin? Dürüst ol; tutamayacağın bir söz verme.");
    const zi = await cs.secenek(["15 dakika", "30 dakika", "1 saat"], { beklet: true });
    const dk = [15, 30, 60][zi];
    await cs.kam(`Son soru: ${EK.yi} neden öğrenmek istiyorsun?`);
    const NEDEN = ({
      c: [["Okul / ders için", "okul", "Anladım. Sınavda çıkan şeylerin çoğu ilk 10 derste: döngüler, diziler, işaretçiler. Oraya odaklanacağız."],
          ["Merak ediyorum", "merak", "En sağlam motivasyon bu. C sana bilgisayarın içeride nasıl çalıştığını gösterecek."],
          ["İş ve kariyer", "kariyer", "C bilmek başka dillerde de fark yaratır; belleği anlayan programcı az. Ama gerçekçi olalım: iş için C tek başına yetmez, bu bir temel."],
          ["Gömülü sistem, oyun, donanım", "donanim", "Doğru dili seçmişsin; o alanların dili C. İşaretçiler ve bit işlemleri dersleri senin için en değerli kısım."]],
      py: [["Okul / ders için", "okul", "Anladım. Derslerde en çok çıkanlar ilk 10 derste: döngüler, listeler, fonksiyonlar. Oraya odaklanacağız."],
           ["Merak ediyorum", "merak", "En sağlam motivasyon bu. Python ile fikri koda dökmek hızlıdır; küçük araçlar yazmaya erken başlayacağız."],
           ["İş ve kariyer", "kariyer", "Python veri, otomasyon ve yapay zekâ işlerinde standart. Ama gerçekçi olalım: dil tek başına iş getirmez; bitirdiğin projeler getirir."],
           ["Veri ve otomasyon", "veri", "Doğru dil. İleri derslerde dosya okuyup rapor üreten bir araç yazacağız; asıl hedef o."]],
      js: [["Okul / ders için", "okul", "Anladım. Temeller ilk 10 derste: değişkenler, döngüler, diziler, fonksiyonlar. Oraya odaklanacağız."],
           ["Merak ediyorum", "merak", "En sağlam motivasyon bu. JavaScript'in güzel yanı, yazdığın şeyi tarayıcıda hemen görmen."],
           ["İş ve kariyer", "kariyer", "Web işlerinin çoğu JavaScript ister. Ama gerçekçi olalım: temeller bitince web ve React parkurlarını da tamamlaman gerekir; bu aylar sürer."],
           ["Web sitesi yapmak", "web", "O zaman hedef belli: önce dilin temeli, ardından Web temelleri parkuru. Kendi sayfanı orada yapacaksın."]]
    })[DIL];
    const ni = await cs.secenek(NEDEN.map((x) => x[0]), { beklet: true });
    const neden = NEDEN[ni][1];
    await cs.kam(NEDEN[ni][2]);
    const d = ilerleme();
    const pl = planHesapla(dk, d.kalan || 20);
    await cs.kam(`Planın şöyle:\n\n${planMetni(pl)}\n\nHer ders dört adım: kısa bir tahmin sorusu, konunun anlatımı, üç görev ve tekrar kartları. Unutma: iki günden uzun ara verirsen unutma başlar; kartlar bunun için var.`);
    let sec = await cs.secenek(["Başlayalım", "Daha hafif bir plan"], { beklet: true });
    let sonDk = dk;
    if (sec === 1) {
      sonDk = Math.max(10, Math.round(dk / 2 / 5) * 5);
      await cs.kam(`Olur. Günde **${sonDk} dakika**: ${planMetni(planHesapla(sonDk, d.kalan || 20))}\n\nAz ama her gün, çok ama arada bir çalışmaktan daha iyi sonuç verir.`);
      await cs.secenek(["Tamam, başlayalım"], { beklet: true });
    }
    Object.assign(durum(), { dk: sonDk, neden, baslangic: S.day(), tanisti: true });
    pr.goal = sonDk <= 15 ? 20 : sonDk <= 30 ? 50 : 100; pr.onboarded = true;
    S.save();
    if (A().renderBar) A().renderBar();
    await cs.kam("İlk derste görüşürüz. Sağ alttaki **KAM** düğmesinden bana her zaman ulaşabilirsin.");
    tanisiyor = false; selamVerildi = true;
    $("#kam-form", cekmece).hidden = false;
    cekmece.classList.remove("genis");
    const ilk = cFazlar()[0];
    setTimeout(() => { cekmeceKapat(); setTimeout(() => tur(() => { if (ilk && (!location.hash || location.hash === "#panel")) location.hash = `#${ilk.id}/tahmin`; }), 350); }, 1400);
    anaMenuSessiz();
    return true;
  }

  /* ------------------------------------------------------------------ ders oynatıcı */
  /* Senaryosu yazılmamış dersler için ders verisinden sohbet üret */
  function otomatikSenaryo(p) {
    const s = [["k", `Bu derste **${p.title}** var. ${p.goal}`], ["k", "Önce çalışan bir örneğe bakalım, sonra parça parça üzerinden geçeriz."], ["kod", p.example.code], ["sen", "Tamam, anlat", "Önce bir çalıştır"]];
    p.example.steps.forEach((ad, i) => { s.push(["v", ad.lines || [], ad.text]); if (i % 2 === 1 && i < p.example.steps.length - 1) s.push(["sen", "Devam", "Anladım"]); });
    s.push(["k", "Şimdi çalıştıralım:"], ["calis"]);
    if (p.cards && p.cards[0]) s.push(["k", `Aklında kalması gereken şey: ${p.cards[0].a}`]);
    s.push(["k", `Bu dersin kavramları: ${p.concepts.join(", ")}. Görevlerde hepsini kullanacaksın; takılırsan bana yaz.`]);
    return s;
  }

  let dersNo = 0;
  function ders(p, stage) {
    const benim = ++dersNo;
    const senaryo = (window.KAM_DERSLER || {})[p.id] || otomatikSenaryo(p);
    const ph = S.phase(p.id);
    stage.innerHTML = `
      <div class="kam-ders">
        <section class="kam-sohbet" aria-label="KAM anlatıyor">
          <header class="kam-bas">${AVATAR}<div><b>KAM anlatıyor</b><small>Ders ${p.no} · ${esc(p.title)}</small></div>
            <button class="btn sm ghost" id="kd-hizli" title="Animasyonları atla">Hızlı geç</button><button class="btn sm ghost" id="kd-bastan">Baştan</button></header>
          <div class="kam-ilerleme"><i id="kd-ilerleme"></i></div>
          <div class="kam-akis" id="kd-akis" aria-live="polite"></div>
          <div class="kam-cevap" id="kd-cevap"></div>
          <form class="kam-form" id="kd-sor"><input placeholder="Anlamadığın yeri KAM'e sor…" autocomplete="off" maxlength="300" /><button class="btn sm">Sor</button></form>
        </section>
        <section class="kam-sahne" aria-label="Örnek kod">
          <header class="sahne-bas"><span class="file">main.c</span><span class="sahne-durum" id="kd-durum">KAM yazıyor…</span><button class="btn sm" id="kd-calistir">▷ Çalıştır</button></header>
          <pre class="sahne-kod" id="kd-kod"><code><span class="sahne-bos">Kod burada belirecek. KAM anlattıkça değişecek.</span></code></pre>
          <div class="sahne-cikti" id="kd-cikti" hidden></div>
        </section>
      </div>`;
    const sc = sohbet($("#kd-akis", stage), $("#kd-cevap", stage));
    const kodEl = $("#kd-kod code", stage), ciktiEl = $("#kd-cikti", stage), durumEl = $("#kd-durum", stage);
    let kod = "", sonStdin = "";
    const yasiyor = () => benim === dersNo && stage.isConnected && $(".kam-ders", stage);

    function kodYaz(yeni) {
      const eski = kod.split("\n");
      kod = yeni;
      const satirlar = KD.hlDoc ? KD.hlDoc(yeni, "c") : yeni.split("\n").map(esc);
      const ham = yeni.split("\n");
      let n = 0;
      kodEl.innerHTML = satirlar.map((l, i) => { const degisti = ham[i] !== eski[i]; return `<span class="sk ${degisti ? "yeni" : ""}" data-l="${i + 1}" style="--n:${degisti ? n++ : 0}"><b class="sn">${i + 1}</b>${l || " "}</span>`; }).join("");
      ciktiEl.hidden = true; ciktiEl.innerHTML = "";
      durumEl.textContent = "kod güncellendi";
      return sc.hizli || reduced() ? Promise.resolve() : bekle(Math.min(1100, 260 + n * 70));
    }
    function vurgula(satirlar) {
      const ks = $$(".sk", kodEl);
      ks.forEach((el) => { const on = satirlar.includes(+el.dataset.l); el.classList.toggle("hi", on); el.classList.toggle("dim", satirlar.length > 0 && !on); el.classList.remove("yeni"); });
      const ilk = ks.find((el) => el.classList.contains("hi"));
      if (ilk && !sc.hizli) ilk.scrollIntoView({ block: "nearest", behavior: reduced() ? "auto" : "smooth" });
      durumEl.textContent = satirlar.length ? satirlar.length === 1 ? satirlar[0] + ". satır" : satirlar[0] + "–" + satirlar[satirlar.length - 1] + ". satırlar" : "";
    }
    async function calistir(stdin) {
      if (!kod) return;
      if (stdin !== undefined) sonStdin = stdin || "";
      vurgula([]);
      ciktiEl.hidden = false;
      ciktiEl.innerHTML = `<p class="sahne-etiket">Çıktı</p><div class="log muted">Derleniyor…</div>`;
      durumEl.textContent = "çalışıyor";
      const r = await KD.runC(kod, { stdin: sonStdin });
      if (!yasiyor()) return;
      const satir = (r.logs || []).map((l, i) => `<div class="log ${l.level}" style="--i:${i}">${esc(l.text)}</div>`);
      if (r.error) satir.push(`<div class="log error">${esc(r.error)}</div>`);
      ciktiEl.innerHTML = `<p class="sahne-etiket">Çıktı${sonStdin ? ` <span>girdi: ${esc(sonStdin.trim())}</span>` : ""}</p>${satir.join("") || '<div class="log muted">Program çıktı üretmedi.</div>'}`;
      durumEl.textContent = r.error ? "hata" : "çalıştı";
      if (!sc.hizli) await bekle(500);
    }

    async function oynat() {
      if (ph.viewed) sc.hizli = true;            // daha önce izlendiyse sohbetin tamamı hazır gelir
      for (let i = 0; i < senaryo.length; i++) {
        if (!yasiyor()) return;
        const [tur, a, b, c, d, e] = senaryo[i];
        $("#kd-ilerleme", stage).style.width = Math.round(((i + 1) / senaryo.length) * 100) + "%";
        if (tur === "k") await sc.kam(a);
        else if (tur === "kod") await kodYaz(a);
        else if (tur === "v") { vurgula(a); await sc.kam(b); }
        else if (tur === "calis") { if (sc.hizli) sonStdin = a || ""; else await calistir(a || ""); }
        else if (tur === "sen") await sc.secenek(senaryo[i].slice(1));
        else if (tur === "sor") {
          await sc.kam(a);
          if (sc.hizli) { sc.sen(b[c]); await sc.kam(d); }
          else {
            const sec = await sc.secenek(b, { beklet: true });
            if (!yasiyor()) return;
            const dogru = sec === c;
            if (KD.bkt) KD.bkt.observe(p.id, dogru, 0.3);
            await sc.kam((dogru ? "✓ " : "") + (dogru ? d : e));
          }
        }
      }
      if (!yasiyor()) return;
      vurgula([]);
      durumEl.textContent = "ders bitti";
      const ilkKez = !ph.viewed;
      if (ilkKez) { ph.viewed = true; S.addXP(10); if (A().renderBar) A().renderBar(); }
      if (sc.hizli && kod) calistir();
      sc.hizli = false;
      await sc.kam(ilkKez ? "Anlatacaklarım bu kadar. Şimdi sıra sende: aynı fikirleri görevlerde kendin yazacaksın. Her görevin başında benzer bir çözümlü örnek var." : "Bu dersi daha önce dinlemiştin; sohbetin tamamı yukarıda. İstediğin yeri tekrar okuyabilir ya da kodu çalıştırabilirsin.");
      const s = await sc.secenek(["Görevlere geç", "Bir şey soracağım"], { beklet: true });
      if (!yasiyor()) return;
      if (s === 0) location.hash = `#${p.id}/kodla`; else cekmeceAc();
    }

    $("#kd-calistir", stage).onclick = () => calistir();
    $("#kd-hizli", stage).onclick = () => { sc.hizli = true; const ilk = $(".kam-chip", $("#kd-cevap", stage)); if (ilk) ilk.click(); };
    $("#kd-bastan", stage).onclick = () => { ph.viewed = false; S.save(); ders(p, stage); };
    $("#kd-sor", stage).onsubmit = (e) => { e.preventDefault(); const inp = $("input", e.target), q = inp.value.trim(); if (!q) return; inp.value = ""; cekmeceAc(q); };
    oynat();
  }

  /* ------------------------------------------------------------------ tur: NextGen'i gezdirir, sonunda katılmaya çağırır */
  const TUR_ANAHTAR = "kam-tur-nextgen";
  const uyeDegil = () => !KD.hesapYok && KD.hesap && !KD.hesap.kullanici;
  function tur(bitince) {
    if (!window.KAM_TUR || window.KAM_TUR.goruldu(TUR_ANAHTAR)) { if (bitince) bitince(); return false; }
    const adimlar = [
      { sec: ".kam-kart", baslik: "Her girişinde buradayım.", metin: "Bugün ne yapman gerektiğini burada söylerim. Satıra tıklaman yeter." },
      { sec: "#tracks", baslik: "Derslerin", metin: "Dersler sırayla açılır. Bir dersin üç görevinden ikisini geçince sonraki açılır." },
      { sec: '#side-main a[href="#tekrar"]', baslik: "Tekrar", metin: "Öğrendiklerin kısa kartlarla geri gelir; tam unutmaya başlayacağın gün." },
      { sec: "#btn-search", baslik: "Arama", metin: "Bir dersi ya da görevi adıyla bulursun." },
      { sec: ".bar .dunya", baslik: "İki dünya", metin: "Burası **NextGen**, dersliğin. Kütüphane ve Pratik **QUAGEN**'de; buradan geçersin." },
      { sec: "#kam-fab", baslik: "Takıldığında bana yaz.", metin: "Hangi sayfada olursan ol bu düğme burada durur." }
    ];
    if (uyeDegil()) adimlar.push({ sec: "#acct", baslik: "Şimdi aramıza katıl.", metin: "Sonra derslere geçelim. Kayıt ücretsiz; ilerlemen hesabında saklanır ve başka cihazda kaldığın yerden devam edersin.", dugme: "Aramıza katıl", git: "hesap.html?sonra=" + encodeURIComponent("nextgen.html?dil=" + DIL) + "#kayit", ikinci: { ad: "Kayıtsız devam et" } });
    return window.KAM_TUR.baslat(adimlar, { anahtar: TUR_ANAHTAR, bitince: (neden) => { if (neden !== "git" && bitince) bitince(); } });
  }

  /* ------------------------------------------------------------------ kurulum */
  function kur() {
    if (!aktif() || !$("#view")) return;
    cekmeceKur();
    const view = $("#view");
    const bak = () => { if (!location.hash || location.hash === "#panel") karsila(view); };
    new MutationObserver(bak).observe(view, { childList: true });
    bak();
    /* Tanışmayı daha önce yapmış ama turu görmemiş kişi: panelde bir kez gezdir */
    if (S.state.prefs.onboarded) setTimeout(() => { if (!tanisiyor && (!location.hash || location.hash === "#panel")) tur(); }, 1600);
  }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", kur); else setTimeout(kur, 0);

  window.KAM = { aktif, dersVar, tur, ders, tanis, karsila, ac: cekmeceAc, planHesapla, planMetni, karsilamaMetni, otomatikSenaryo, ilerleme };
})();
