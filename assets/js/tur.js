/* QUAGEN — KAM'in gezdirdiği tur: sayfadaki önemli yerleri sırayla aydınlatır, "Sonraki" ile ilerlenir.
 *   KAM_TUR.baslat(adimlar, { anahtar, bitince })
 *   adım: { sec: "css seçici", baslik, metin, dugme?: "Sonraki", ikinci?: { ad, git }, git?: "url" }
 * Hedefi sayfada olmayan ya da görünmeyen adımlar atlanır. Tur bir kez gösterilir (localStorage anahtarı). */
(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const bicim = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const gorunur = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; };
  const goruldu = (k) => { try { return !!localStorage.getItem(k); } catch (_) { return true; } };
  const isaretle = (k) => { try { localStorage.setItem(k, "1"); } catch (_) {} };
  let acik = false;

  function baslat(adimlar, { anahtar, bitince } = {}) {
    if (acik) return false;
    const liste = adimlar.filter((a) => gorunur(document.querySelector(a.sec)));
    if (!liste.length) { if (bitince) bitince("yok"); return false; }
    acik = true;
    if (anahtar) isaretle(anahtar);
    const kok = document.createElement("div");
    kok.className = "tur";
    kok.innerHTML = `<div class="tur-perde"></div><div class="tur-isik"></div>
      <section class="tur-kart" role="dialog" aria-modal="true" aria-label="KAM siteyi tanıtıyor">
        <span class="kam-av" aria-hidden="true"><b></b><b></b></span>
        <div class="tur-govde">
          <p class="tur-baslik" id="tur-baslik"></p>
          <p class="tur-metin" id="tur-metin" aria-live="polite"></p>
          <div class="tur-alt"><span class="tur-noktalar" id="tur-noktalar" aria-hidden="true"></span><button class="tur-gec" id="tur-gec">Turu geç</button><button class="tur-ikinci" id="tur-ikinci" hidden></button><button class="btn btn-ink primary tur-sonraki" id="tur-sonraki">Sonraki</button></div>
        </div>
      </section>`;
    document.body.append(kok);
    const isik = kok.querySelector(".tur-isik"), kart = kok.querySelector(".tur-kart");
    const $ = (s) => kok.querySelector(s);
    let i = -1, hedef = null;

    function yerlestir() {
      if (!hedef) return;
      const r = hedef.getBoundingClientRect(), p = 8;
      const x = Math.max(6, r.left - p), y = Math.max(6, r.top - p), w = Math.min(innerWidth - 12, r.width + p * 2), h = Math.min(innerHeight - 12, r.height + p * 2);
      Object.assign(isik.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px", borderRadius: Math.min(28, parseFloat(getComputedStyle(hedef).borderRadius) + p || 16) + "px" });
      /* Kart: hedefin altında yer varsa altına, yoksa üstüne; dar ekranda alta sabitlenir */
      const kw = Math.min(420, innerWidth - 24), kh = kart.offsetHeight || 190;
      let kx = Math.min(Math.max(12, x + w / 2 - kw / 2), innerWidth - kw - 12), ky;
      if (innerWidth < 640) ky = y + h + kh + 20 < innerHeight ? y + h + 14 : Math.max(12, y - kh - 14);
      else if (y + h + kh + 24 < innerHeight) ky = y + h + 16;
      else if (y - kh - 16 > 8) ky = y - kh - 16;
      else { ky = Math.max(12, innerHeight - kh - 16); kx = x + w + kw + 20 < innerWidth ? x + w + 16 : Math.max(12, x - kw - 16); }
      Object.assign(kart.style, { left: kx + "px", top: Math.max(12, ky) + "px", width: kw + "px" });
    }
    async function goster(n) {
      i = n;
      const a = liste[i];
      hedef = document.querySelector(a.sec);
      kart.classList.add("degisiyor");
      const r = hedef.getBoundingClientRect();
      if (r.top < 90 || r.bottom > innerHeight - 220) {
        hedef.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
        await new Promise((c) => setTimeout(c, reduced ? 0 : 420));
      }
      $("#tur-baslik").textContent = a.baslik || "";
      $("#tur-metin").innerHTML = bicim(a.metin);
      $("#tur-noktalar").innerHTML = liste.map((_, k) => `<i class="${k === i ? "on" : k < i ? "gecti" : ""}"></i>`).join("");
      const son = i === liste.length - 1;
      $("#tur-sonraki").textContent = a.dugme || (son ? "Tamam" : "Sonraki");
      $("#tur-gec").hidden = son;
      const ik = $("#tur-ikinci"); ik.hidden = !a.ikinci; if (a.ikinci) ik.textContent = a.ikinci.ad;
      yerlestir();
      isik.classList.remove("vur"); void isik.offsetWidth; isik.classList.add("vur");
      requestAnimationFrame(() => { yerlestir(); kart.classList.remove("degisiyor"); });
      $("#tur-sonraki").focus({ preventScroll: true });
    }
    function kapat(neden) {
      if (!acik) return;
      acik = false;
      removeEventListener("resize", yerlestir); removeEventListener("scroll", yerlestir, true); removeEventListener("keydown", tus, true);
      kok.classList.add("kapaniyor");
      setTimeout(() => kok.remove(), reduced ? 0 : 260);
      if (bitince) bitince(neden);
    }
    function ileri() {
      const a = liste[i];
      if (a.git) { kapat("git"); location.href = a.git; return; }
      if (i < liste.length - 1) goster(i + 1); else kapat("bitti");
    }
    function tus(e) {
      if (e.key === "Escape") { e.preventDefault(); kapat("gecildi"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); ileri(); }
      else if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); goster(i - 1); }
      else if (e.key === "Tab") { /* odak kartın içinde kalsın */
        const f = [...kart.querySelectorAll("button:not([hidden])")]; if (!f.length) return;
        const k = f.indexOf(document.activeElement);
        e.preventDefault(); f[(k + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
      }
    }
    $("#tur-sonraki").onclick = ileri;
    $("#tur-gec").onclick = () => kapat("gecildi");
    $("#tur-ikinci").onclick = () => { const a = liste[i]; if (a.ikinci.git) { kapat("git"); location.href = a.ikinci.git; } else kapat("bitti"); };
    addEventListener("resize", yerlestir); addEventListener("scroll", yerlestir, true); addEventListener("keydown", tus, true);
    requestAnimationFrame(() => { kok.classList.add("acik"); goster(0); });
    return true;
  }

  window.KAM_TUR = { baslat, goruldu, get acik() { return acik; } };
})();
