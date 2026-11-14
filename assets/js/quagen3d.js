/* QUAGEN — 3B sahne (yalnızca ana sayfa).
 * 1) Arkada sabit bir tuval: ~1500 parçacık üç boyutta durur, sayfa kaydıkça biçim değiştirir
 *    (küre → halka → sarmal → tünel → dalga → küre). İzdüşüm elle hesaplanır; kütüphane yok.
 * 2) Levhalar imlece doğru eğilir. 3) Açılış sahnesi kaydırdıkça doğrulur. 4) Rakamlar sayarak gelir. */
(function () {
  "use strict";
  const azHareket = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const inceImlec = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const kok = document.documentElement;

  /* ---------- Biçimler: her biri n noktayı [-1, 1] küpünde üretir ---------- */
  const TAU = Math.PI * 2;
  /* Tohumlu rastgele: her yüklemede aynı evren */
  function rastgele(tohum) { let a = tohum >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  const BICIM = {
    kure(n) { const p = new Float32Array(n * 3), altin = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), a = i * altin; p[i * 3] = Math.cos(a) * r; p[i * 3 + 1] = y; p[i * 3 + 2] = Math.sin(a) * r; } return p; },
    halka(n) { const p = new Float32Array(n * 3), r = rastgele(7); for (let i = 0; i < n; i++) { const a = r() * TAU, kol = 0.55 + Math.pow(r(), 0.6) * 0.75, ince = (r() - 0.5) * 0.09 * (2 - kol); p[i * 3] = Math.cos(a) * kol; p[i * 3 + 1] = ince; p[i * 3 + 2] = Math.sin(a) * kol; } return p; },
    sarmal(n) { const p = new Float32Array(n * 3), r = rastgele(11); for (let i = 0; i < n; i++) { const t = i / n, kol = i % 2 ? 0 : Math.PI, a = t * TAU * 3.2 + kol, kopru = r() < 0.16; const yc = kopru ? r() : 1; p[i * 3] = Math.cos(a) * 0.42 * yc + (r() - 0.5) * 0.03; p[i * 3 + 1] = (t - 0.5) * 2.5; p[i * 3 + 2] = Math.sin(a) * 0.42 * yc + (r() - 0.5) * 0.03; } return p; },
    tunel(n) { const p = new Float32Array(n * 3), halkaSay = 14, bas = Math.floor(n / halkaSay); for (let i = 0; i < n; i++) { const h = Math.min(halkaSay - 1, Math.floor(i / bas)), a = ((i % bas) / bas) * TAU + h * 0.3, yc = 0.95 - h * 0.035; p[i * 3] = Math.cos(a) * yc; p[i * 3 + 1] = Math.sin(a) * yc; p[i * 3 + 2] = 1.4 - h * 0.32; } return p; },
    dalga(n) { const p = new Float32Array(n * 3), kenar = Math.ceil(Math.sqrt(n)); for (let i = 0; i < n; i++) { const x = (i % kenar) / (kenar - 1) - 0.5, z = Math.floor(i / kenar) / (kenar - 1) - 0.5; p[i * 3] = x * 3.4; p[i * 3 + 1] = 0.55 + Math.sin(x * 9) * 0.1 + Math.cos(z * 8) * 0.1; p[i * 3 + 2] = z * 3.2; } return p; }
  };
  /* Kaydırma durakları: hangi bölümde hangi biçim, ekranın neresinde, ne büyüklükte, hangi eğimle */
  const DURAK = [
    { sec: ".hero-kure", bicim: "kure", x: 0, y: 0, boy: 0.68, egX: 0.25, bagli: true, kilit: true },
    { sec: "#programlar", bicim: "halka", x: 0.3, y: -0.05, boy: 1.25, egX: 1.05 },
    { sec: ".kam-yan .kam-av", bicim: "kure", x: 0, y: 0, boy: 0.42, egX: 0.3, bagli: true },
    { sec: "#ders", bicim: "sarmal", x: -0.36, y: 0, boy: 0.95, egX: 0.15 },
    { sec: "#nextgen", bicim: "tunel", x: 0.22, y: 0, boy: 1.15, egX: 0, sabit: true },
    { sec: "#bilim", bicim: "dalga", x: 0, y: 0.1, boy: 1.2, egX: 0.5, sabit: true },
    { sec: ".cta", bicim: "kure", x: 0, y: 0.05, boy: 0.8, egX: 0.25 }
  ];

  const evren = (function () {
    const cv = document.createElement("canvas"); cv.id = "q-evren"; cv.setAttribute("aria-hidden", "true");
    document.body.prepend(cv);
    const ctx = cv.getContext("2d");
    if (!ctx) return null;
    const N = innerWidth < 760 ? 700 : 1500;
    const bicimler = {}; Object.keys(BICIM).forEach((k) => (bicimler[k] = BICIM[k](N)));
    const r = rastgele(3);
    const gecikme = new Float32Array(N), sicak = new Uint8Array(N), ton = new Float32Array(N);
    for (let i = 0; i < N; i++) { gecikme[i] = r() * 0.35; sicak[i] = r() < 0.1 ? 1 : 0; ton[i] = r(); }
    const duraklar = DURAK.map((d) => ({ ...d, el: document.querySelector(d.sec) })).filter((d) => d.el);
    let W = 0, H = 0, dpr = 1, imX = 0, imY = 0, hX = 0, hY = 0, t0 = performance.now(), gorunur = true, acik = kok.dataset.theme === "light";
    const boyutla = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    boyutla(); addEventListener("resize", boyutla);
    if (inceImlec) addEventListener("pointermove", (e) => { hX = e.clientX / W - 0.5; hY = e.clientY / H - 0.5; }, { passive: true });
    document.addEventListener("visibilitychange", () => { gorunur = !document.hidden; if (gorunur && !azHareket) requestAnimationFrame(ciz); });
    new MutationObserver(() => { acik = kok.dataset.theme === "light"; if (azHareket) ciz(performance.now()); }).observe(kok, { attributes: true, attributeFilter: ["data-theme"] });

    const yumusak = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
    /* Ekran ortasına göre iki komşu durak ve aradaki oran */
    function konum() {
      const orta = H / 2; let onceki = duraklar[0], sonraki = duraklar[0], oran = 0;
      const merkezler = duraklar.map((d) => { const b = d.el.getBoundingClientRect(); return { d, b, m: b.top + b.height / 2 }; });
      for (let i = 0; i < merkezler.length; i++) {
        if (merkezler[i].m <= orta) { onceki = merkezler[i]; sonraki = merkezler[Math.min(i + 1, merkezler.length - 1)]; }
        else { if (i === 0) { onceki = sonraki = merkezler[0]; } break; }
      }
      if (onceki.d === undefined) onceki = sonraki = merkezler[0];
      if (onceki !== sonraki) oran = yumusak((orta - onceki.m) / Math.max(1, sonraki.m - onceki.m));
      /* Kilitli durak (açılıştaki KAM): ekranda göründüğü sürece küre ondan ayrılmaz, biçim de değişmez */
      if (onceki.d.kilit && onceki.b.bottom > 0) oran = 0;
      return { a: onceki, b: sonraki, oran };
    }
    const merkez = (k) => (k.d.bagli ? { x: (k.b.left + k.b.width / 2) / W - 0.5, y: (k.b.top + k.b.height / 2) / H - 0.5 } : { x: k.d.x, y: k.d.y });

    function ciz(simdi) {
      const sn = (simdi - t0) / 1000;
      imX += (hX - imX) * 0.05; imY += (hY - imY) * 0.05;
      const { a, b, oran } = konum();
      const A = bicimler[a.d.bicim], B = bicimler[b.d.bicim];
      const ma = merkez(a), mb = merkez(b);
      const cx = W * (0.5 + ma.x + (mb.x - ma.x) * oran), cy = H * (0.5 + ma.y + (mb.y - ma.y) * oran);
      const boy = (a.d.boy + (b.d.boy - a.d.boy) * oran) * Math.min(W, H) * (W < 760 ? 0.36 : 0.3);
      const egX = a.d.egX + (b.d.egX - a.d.egX) * oran + imY * 0.5;
      const donA = a.d.sabit ? 0 : 1, donB = b.d.sabit ? 0 : 1;
      const don = sn * 0.14 * (donA + (donB - donA) * oran) + imX * 0.9;
      const sy = Math.sin(don), cyy = Math.cos(don), sx = Math.sin(egX), cxx = Math.cos(egX);
      const odak = 3.2, akis = (sn * 0.35) % 0.32;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = acik ? "source-over" : "lighter";
      for (let i = 0; i < N; i++) {
        const o = yumusak((oran - gecikme[i]) / 0.65), j = i * 3;
        let x = A[j] + (B[j] - A[j]) * o, y = A[j + 1] + (B[j + 1] - A[j + 1]) * o, z = A[j + 2] + (B[j + 2] - A[j + 2]) * o;
        /* Geçiş ortasında noktalar dışa savrulur: biçimler birbirine "patlayarak" dönüşür */
        const sav = Math.sin(o * Math.PI) * 0.28 * (ton[i] - 0.3); x += x * sav; y += y * sav; z += z * sav;
        if (b.d.bicim === "tunel" || a.d.bicim === "tunel") { const tz = b.d.bicim === "tunel" ? o : 1 - o; z -= akis * tz; }
        if (b.d.bicim === "dalga" || a.d.bicim === "dalga") { const td = b.d.bicim === "dalga" ? o : 1 - o; y += Math.sin(x * 3 + sn * 1.3) * Math.cos(z * 2.4 + sn) * 0.09 * td; }
        const x1 = x * cyy + z * sy, z1 = z * cyy - x * sy;
        const y2 = y * cxx - z1 * sx, z2 = z1 * cxx + y * sx;
        const k = odak / (odak + z2); if (k <= 0) continue;
        const px = cx + x1 * k * boy, py = cy + y2 * k * boy;
        if (px < -4 || px > W + 4 || py < -4 || py > H + 4) continue;
        const yakin = Math.max(0, Math.min(1, (1.3 - z2) / 2.6)), en = (0.9 + yakin * 2.3) * (sicak[i] ? 1.5 : 1);
        const alfa = (0.26 + yakin * 0.74) * (acik ? 0.75 : 1);
        /* Sıcak bir toz bulutu; aralarında KAM'in mavisinden seyrek noktalar */
        /* Gece mavisi toz; aralarında seyrek altın noktalar */
        if (sicak[i]) ctx.fillStyle = acik ? `rgba(176,134,52,${alfa})` : `rgba(227,200,136,${alfa})`;
        else if (acik) ctx.fillStyle = `rgba(${14 + ton[i] * 30 | 0},${28 + ton[i] * 40 | 0},${70 + ton[i] * 70 | 0},${alfa * 0.7})`;
        else ctx.fillStyle = `rgba(${200 + ton[i] * 45 | 0},${200 + yakin * 30 + ton[i] * 15 | 0},${190 + ton[i] * 40 | 0},${alfa * 0.8})`;
        ctx.fillRect(px - en / 2, py - en / 2, en, en);
      }
      if (!azHareket && gorunur) requestAnimationFrame(ciz);
    }
    if (azHareket) { ciz(t0); addEventListener("scroll", () => ciz(t0), { passive: true }); }
    else requestAnimationFrame(ciz);
    return { N };
  })();

  /* ---------- Levhalar imlece doğru eğilir ---------- */
  const levhalar = document.querySelectorAll(".bilim article, .adimlar li, .cta-in, .kapi, .programlar > .program, .onizle > .oz");
  levhalar.forEach((el) => {
    el.classList.add("q-egim");
    if (!inceImlec || azHareket) return;
    const guc = el.matches(".kapi, .rakamlar, .cta-in") ? 3 : 7;
    el.addEventListener("pointermove", (e) => {
      const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      el.classList.add("tut");
      el.style.setProperty("--ry", ((x - 0.5) * guc * 2).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((0.5 - y) * guc * 2).toFixed(2) + "deg");
      el.style.setProperty("--rz", "14px");
      el.style.setProperty("--mx", (x * 100).toFixed(1) + "%"); el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    });
    el.addEventListener("pointerleave", () => { el.classList.remove("tut"); ["--rx", "--ry", "--rz"].forEach((v) => el.style.removeProperty(v)); });
  });

  /* ---------- KAM imlece bakar; sahne kaydırdıkça doğrulur; üstte ilerleme çizgisi ---------- */
  const kam = document.getElementById("kam-dev"), sahne = document.getElementById("sahne");
  const cizgi = document.createElement("div"); cizgi.id = "q-ilerleme"; cizgi.setAttribute("aria-hidden", "true"); document.body.append(cizgi);
  if (kam && inceImlec && !azHareket) addEventListener("pointermove", (e) => {
    const b = kam.getBoundingClientRect(), dx = (e.clientX - (b.left + b.width / 2)) / innerWidth, dy = (e.clientY - (b.top + b.height / 2)) / innerHeight;
    kam.style.setProperty("--kry", (dx * 34).toFixed(1) + "deg"); kam.style.setProperty("--krx", (-dy * 26).toFixed(1) + "deg");
  }, { passive: true });
  let bekleyen = false;
  const kaydir = () => {
    bekleyen = false;
    const tum = document.documentElement.scrollHeight - innerHeight;
    cizgi.style.setProperty("--sp", tum > 0 ? (scrollY / tum).toFixed(4) : "0");
    if (sahne && !azHareket) { const b = sahne.getBoundingClientRect(); const st = Math.max(0, Math.min(1, (innerHeight - b.top) / (innerHeight * 0.62))); sahne.style.setProperty("--st", st.toFixed(3)); }
  };
  addEventListener("scroll", () => { if (!bekleyen) { bekleyen = true; requestAnimationFrame(kaydir); } }, { passive: true });
  addEventListener("resize", kaydir); kaydir();

  /* ---------- Rakamlar sayarak gelir ---------- */
  const rakamlar = document.querySelectorAll(".rakamlar dt");
  if (rakamlar.length && "IntersectionObserver" in window && !azHareket) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target, asil = el.textContent, m = asil.match(/^(\d+)(.*)$/); if (!m || +m[1] === 0) return;
      const hedef = +m[1], bas = performance.now(), sure = 1100;
      const adim = (s) => { const o = Math.min(1, (s - bas) / sure), k = 1 - Math.pow(1 - o, 3); el.textContent = Math.round(hedef * k) + m[2]; if (o < 1) requestAnimationFrame(adim); else el.textContent = asil; };
      requestAnimationFrame(adim);
    }), { threshold: 0.6 });
    rakamlar.forEach((el) => io.observe(el));
  }

  window.QUAGEN_3B = { evren, BICIM };
})();
