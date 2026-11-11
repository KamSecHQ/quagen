/* QUAGEN — bulut köprüsü (çevrimiçi yayın)
 * Sitenin yerel sunucuya yaptığı /api/... isteklerini tarayıcıda karşılayıp Supabase'e yönlendirir.
 * Böylece hesap, eşitleme, portföy, mentor ve Rehber asistanı kodu yerel sürümle aynı kalır.
 *   hesap / ilerleme / portföy → Postgres fonksiyonları (quagen_*; parola bcrypt, oturum belirteci yalnızca özetiyle saklanır)
 *   mentor / Rehber asistanı  → quagen-ai Edge Function (Claude; giriş ve kullanım sınırı gerekir)
 * Yapılandırma: window.QUAGEN_BULUT = { url, anahtar } (yayımlanabilir anahtar; gizli değildir)
 */
(function () {
  const Y = window.QUAGEN_BULUT;
  if (!Y || !Y.url || !Y.anahtar) return;
  const orijinal = window.fetch.bind(window);
  const OTURUM = "quagen-oturum";
  const belirtec = () => { try { return localStorage.getItem(OTURUM) || ""; } catch (_) { return ""; } };
  const oturumYaz = (b) => { try { if (b) localStorage.setItem(OTURUM, b); else localStorage.removeItem(OTURUM); } catch (_) {} };
  const yanit = (j, durum) => new Response(JSON.stringify(j), { status: durum || j.durum || 200, headers: { "Content-Type": "application/json" } });

  async function rpc(ad, args, keepalive) {
    const govde = JSON.stringify(args);
    const r = await orijinal(`${Y.url}/rest/v1/rpc/${ad}`, {
      method: "POST",
      keepalive: !!keepalive && govde.length <= 60000,
      headers: { apikey: Y.anahtar, Authorization: `Bearer ${Y.anahtar}`, "Content-Type": "application/json" },
      body: govde
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { durum: r.status >= 500 ? 503 : r.status, error: (j && j.message) || "Sunucu isteği tamamlayamadı." };
    return j;
  }
  async function ai(govde) {
    const r = await orijinal(`${Y.url}/functions/v1/quagen-ai`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(govde) });
    const j = await r.json().catch(() => ({ error: "Yapay zekâ yanıt vermedi." }));
    return yanit(j, r.status);
  }
  let saglik = null;

  async function kopru(yol, init) {
    const yontem = String((init && init.method) || "GET").toUpperCase();
    let g = {};
    try { g = init && init.body ? JSON.parse(init.body) : {}; } catch (_) {}
    const ka = init && init.keepalive;

    if (yol === "/api/health") {
      saglik = saglik || orijinal(`${Y.url}/functions/v1/quagen-ai`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ islem: "saglik" }) })
        .then((r) => r.json()).catch(() => ({ ai: false }));
      const s = await saglik;
      return yanit({ ok: true, ai: !!s.ai, model: s.model || null, c: false, bulut: true }, 200);
    }
    if (yol === "/api/auth/kayit" && yontem === "POST") {
      const j = await rpc("quagen_kayit", { kullanici_adi: g.kullaniciAdi || "", eposta: g.eposta || "", parola: g.parola || "", ad: g.ad || "" });
      if (j.oturum) oturumYaz(j.oturum.belirtec);
      return yanit({ kullanici: j.kullanici, error: j.error, alanlar: j.alanlar }, j.durum);
    }
    if (yol === "/api/auth/giris" && yontem === "POST") {
      const j = await rpc("quagen_giris", { giris: g.giris || "", parola: g.parola || "" });
      if (j.oturum) oturumYaz(j.oturum.belirtec);
      return yanit({ kullanici: j.kullanici, error: j.error }, j.durum);
    }
    if (yol === "/api/auth/cikis") {
      const b = belirtec();
      if (b) await rpc("quagen_cikis", { belirtec: b }).catch(() => {});
      oturumYaz(null);
      return yanit({ ok: true }, 200);
    }
    if (yol === "/api/auth/ben") {
      const b = belirtec();
      if (!b) return yanit({ kullanici: null }, 200);
      const j = await rpc("quagen_ben", { belirtec: b });
      if (j.durum === 200 && !j.kullanici) oturumYaz(null); // süresi dolmuş oturum
      return yanit({ kullanici: j.kullanici || null, portfoy: j.portfoy, error: j.error }, j.durum === 200 ? 200 : j.durum);
    }
    if (yol === "/api/ilerleme" && yontem === "GET") {
      const j = await rpc("quagen_ilerleme_al", { belirtec: belirtec() });
      return yanit({ ilerleme: j.ilerleme, error: j.error }, j.durum);
    }
    const im = yol.match(/^\/api\/ilerleme\/([a-z]+)$/);
    if (im && yontem === "PUT") {
      const j = await rpc("quagen_ilerleme_kaydet", { belirtec: belirtec(), dil: im[1], durum: g.durum }, ka);
      return yanit({ guncelleme: j.guncelleme, error: j.error }, j.durum);
    }
    if (yol === "/api/portfoy" && yontem === "PUT") {
      const j = await rpc("quagen_portfoy_kaydet", { belirtec: belirtec(), g });
      return yanit({ portfoy: j.portfoy, error: j.error }, j.durum);
    }
    const pm = yol.match(/^\/api\/portfoy\/([^/]+)$/);
    if (pm && yontem === "GET") {
      const j = await rpc("quagen_portfoy_getir", { kadi: decodeURIComponent(pm[1]) });
      return yanit({ portfoy: j.portfoy, error: j.error }, j.durum);
    }
    if (yol === "/api/hesap" && yontem === "DELETE") {
      const j = await rpc("quagen_hesap_sil", { belirtec: belirtec(), parola: g.parola || "" });
      if (j.durum === 200) oturumYaz(null);
      return yanit({ ok: j.ok, error: j.error }, j.durum);
    }
    if (yol === "/api/tutor" && yontem === "POST") return ai(Object.assign({}, g, { islem: "mentor", belirtec: belirtec() }));
    if (yol === "/api/rehber/sor" && yontem === "POST") return ai(Object.assign({}, g, { islem: "rehber", belirtec: belirtec() }));
    if (yol === "/api/kam" && yontem === "POST") return ai(Object.assign({}, g, { islem: "kam", belirtec: belirtec() }));
    return yanit({ error: "Bulunamadı." }, 404);
  }

  window.fetch = function (girdi, init) {
    let yol = null;
    try {
      const u = new URL(typeof girdi === "string" ? girdi : girdi.url, location.href);
      if (u.origin === location.origin) { const m = u.pathname.match(/\/api\/.*$/); if (m) yol = m[0]; }
    } catch (_) {}
    if (!yol) return orijinal(girdi, init);
    return kopru(yol, init || {}).catch((e) => yanit({ error: "Bağlantı kurulamadı: " + ((e && e.message) || e) + ". İnternet bağlantını kontrol et." }, 503));
  };
  window.QUAGEN_BULUT_HAZIR = true;
})();
