/* QUAGEN — NextGen kapısı: NextGen, Pratik ve Kütüphane yalnızca giriş yapmış kişiye açılır.
 * Sayfa <html class="kapi-bekle"> ile gizli başlar; oturum doğrulanınca görünür olur, oturum yoksa
 * giriş sayfasına gidilir ve giriş sonrası buraya dönülür. Böylece giriş yapmadan ilerleme tutulmaz
 * ve başkasından kalmış yerel bir ad ("hoş geldin …") gösterilmez.
 * Hesap sunucusu hiç yoksa (KD.hesapYok) kapı açık kalır; aksi hâlde site kullanılamaz olurdu. */
(function () {
  "use strict";
  const kok = document.documentElement;
  const ac = () => kok.classList.remove("kapi-bekle");
  const girise = () => {
    const sayfa = (location.pathname.split("/").pop() || "nextgen.html") + location.search + location.hash;
    location.replace("hesap.html?sonra=" + encodeURIComponent(sayfa) + "#giris");
  };
  window.KD_KAPI = { durum: "bekliyor" };
  const denetle = () => {
    const KD = window.KD;
    if (!KD || !KD.hesap || KD.hesapYok) { window.KD_KAPI.durum = "acik"; return ac(); }
    KD.hesap.ben().then((u) => {
      if (KD.hesapYok) { window.KD_KAPI.durum = "acik"; return ac(); }
      if (u) { window.KD_KAPI.durum = "uye"; ac(); } else { window.KD_KAPI.durum = "kapali"; girise(); }
    }).catch(() => { window.KD_KAPI.durum = "kapali"; girise(); });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", denetle); else denetle();
})();
