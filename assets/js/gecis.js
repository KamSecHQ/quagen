/* QUAGEN — iki dünya arasındaki geçiş: QUAGEN | NextGen anahtarına basınca tıklanan yerden bir perde açılır,
   gidilen dünyanın adı görünür, sonra sayfa değişir. Varışta sayfa yumuşakça belirir. */
(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  try { if (sessionStorage.getItem("kd-gecis")) { sessionStorage.removeItem("kd-gecis"); document.documentElement.classList.add("varis"); } } catch (_) {}
  function git(a, e) {
    const href = a.getAttribute("href");
    if (!href || a.hasAttribute("aria-current") && /index\.html$|^#$/.test(href) && !/rehber|pratik/.test(location.pathname)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1 || reduced) return;
    if (a.classList.contains("js-warp")) return;            // ana sayfa kendi geçişini (dil seçimi) kullanır
    e.preventDefault();
    const quagen = /index\.html/.test(href) || href === "./";
    const r = a.getBoundingClientRect();
    const p = document.createElement("div");
    p.className = "gecis " + (quagen ? "quagen" : "nextgen");
    p.style.setProperty("--gx", r.left + r.width / 2 + "px"); p.style.setProperty("--gy", r.top + r.height / 2 + "px");
    p.innerHTML = `<div class="gecis-ic"><span class="kam-av" aria-hidden="true"><b></b><b></b></span><div class="gecis-ad">${quagen ? "QUAGEN" : "NextGen"}</div><div class="gecis-alt">${quagen ? "Tanışma ve bilgi" : "Dersler, Pratik, Kütüphane"}</div><div class="gecis-cizgi"><i></i></div></div>`;
    document.body.append(p);
    requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add("ac")));
    try { sessionStorage.setItem("kd-gecis", "1"); } catch (_) {}
    setTimeout(() => (location.href = href), 1150);
  }
  document.addEventListener("click", (e) => { const a = e.target.closest && e.target.closest(".dunya a, .quagen-don, .ng-git"); if (a) git(a, e); });
  addEventListener("pageshow", (e) => { if (e.persisted) document.querySelectorAll(".gecis").forEach((x) => x.remove()); });
})();
