/* QUAGEN — KAM'in elle yazılmış ders anlatımları: Python ve JavaScript (ilk dersler).
 * Biçim kam-dersler-c.js ile aynıdır: ["k", metin] · ["kod", kod] · ["v", [satırlar], metin] · ["calis"] ·
 * ["sen", cevap…] · ["sor", soru, [seçenekler], doğruIdx, doğruysa, yanlışsa]. Ağır ağır gider: her adımda tek yeni şey. */
(function () {
  const D = (window.KAM_DERSLER = window.KAM_DERSLER || {});

  /* ==================== Python · Ders 1: print, değişkenler, f-string ==================== */
  D.py1 = [
    ["k", "Hoş geldin. Python'da ilk işimiz ekrana bir şey yazdırmak. Tek satır yeter."],
    ["kod", 'print("Merhaba!")'],
    ["v", [1], "`print` ekrana yazar. Yazdırmak istediğin metni parantezin içine, **tırnak** arasına koyarsın. Tırnak, “bu bir metin, komut değil” demektir."],
    ["k", "Çalıştırıyorum."],
    ["calis"],
    ["sor", "Tırnakları silip `print(Merhaba!)` yazsaydım ne olurdu?", ["Yine Merhaba! yazardı", "Hata verirdi", "Boş satır yazardı"], 1, "Evet. Tırnak olmayınca Python `Merhaba` adında bir şey arar, bulamaz ve hata verir.", "Hata verirdi. Tırnak olmayınca Python onu metin değil, bir ad sanar; öyle bir ad tanımlı olmadığı için durur."],
    ["k", "Şimdi yeni bir fikir: **değişken**. Bir değere ad vermek demek. Adı bir kez verirsin, sonra o adı istediğin yerde kullanırsın."],
    ["kod", 'ad = "Deniz"\nprint(ad)'],
    ["v", [1], "Okunuşu: “`ad` diye bir kutu aç, içine `\"Deniz\"` koy.” Eşittir işareti burada “eşit mi?” diye sormaz; **koy** demektir."],
    ["v", [2], "Dikkat: `ad` tırnaksız. Tırnaksız yazınca Python kutunun **içindekini** yazdırır."],
    ["calis"],
    ["sen", "Tırnaklı yazsam ne olur?", "Devam"],
    ["k", "`print(\"ad\")` yazsaydın ekranda harfi harfine `ad` görürdün. Tırnak içi her zaman olduğu gibi çıkar. Bu farkı aklında tut; ilk haftaların en sık hatası bu."],
    ["k", "Değişkenler sayı da tutar. Sayıları tırnaksız yazarsın."],
    ["kod", 'ad = "Deniz"\nyas = 19\nprint(ad)\nprint(yas)\nprint(yas + 5)'],
    ["v", [2], "`yas` bir tam sayı. Tırnak yok, çünkü onunla hesap yapacağız."],
    ["v", [5], "Python önce `yas + 5` işlemini yapar, sonra sonucu yazdırır. `yas` değişmez; yalnızca hesaplanıp gösterilir."],
    ["calis"],
    ["sor", "`yas = \"19\"` diye tırnakla yazsaydım `yas + 5` çalışır mıydı?", ["Evet, 24 verirdi", "Hayır, hata verirdi"], 1, "Doğru. `\"19\"` bir metindir; metinle sayı toplanmaz. Sayı ile metin arasındaki fark Python'da önemlidir.", "Çalışmazdı. Tırnak içindeki `\"19\"` bir metindir, sayı değil; Python metinle sayıyı toplamayı reddeder."],
    ["k", "Son parça: metinle değişkeni aynı cümlede birleştirmek. Bunun en rahat yolu **f-string**."],
    ["kod", 'ad = "Deniz"\nyas = 19\nprint(f"{ad} {yas} yaşında.")\nprint(f"5 yıl sonra {yas + 5} olacak.")'],
    ["v", [3], "Tırnaktan önce bir `f` var. Bu, “süslü parantezlerin içini hesapla ve yerine koy” demek. `{ad}` yerine Deniz, `{yas}` yerine 19 gelir."],
    ["v", [4], "Süslü parantezin içine işlem de yazabilirsin. `{yas + 5}` önce hesaplanır."],
    ["calis"],
    ["sor", "Baştaki `f` harfini unutursam ekranda ne görürüm?", ["Deniz 19 yaşında.", "{ad} {yas} yaşında.", "Hata"], 1, "Evet. `f` olmayınca süslü parantezler sıradan karakter olur ve olduğu gibi yazılır. Hata vermez, o yüzden fark etmesi zordur.", "`{ad} {yas} yaşında.` görürsün. `f` olmadan Python süslü parantezlere dokunmaz; hata da vermez, bu yüzden gözden kaçar."],
    ["k", "Bugünlük dört şey: `print` yazar, tırnak metin demektir, `=` kutuya koyar, `f\"...{ad}...\"` kutudakini cümleye yerleştirir. Şimdi bu satırları birkaç kez yazıp aklına yerleştireceğiz."]
  ];

  /* ==================== JavaScript · Ders 1: değişkenler ve veri tipleri ==================== */
  D.p1 = [
    ["k", "Hoş geldin. JavaScript'te ilk işimiz ekrana bir şey yazdırmak."],
    ["kod", 'console.log("Merhaba!");'],
    ["v", [1], "`console.log` parantezin içindekini yazar. Metinler **tırnak** arasına girer. Sondaki noktalı virgül “bu komut bitti” demek."],
    ["calis"],
    ["k", "Şimdi **değişken**: bir değere ad vermek. JavaScript'te bunun için iki sözcük var. Önce `const`."],
    ["kod", 'const isim = "Deniz";\nconsole.log(isim);'],
    ["v", [1], "Okunuşu: “`isim` diye bir ad oluştur, değeri `\"Deniz\"` olsun.” `const`, bu adın değerinin **bir daha değişmeyeceğini** söyler."],
    ["v", [2], "`isim` tırnaksız yazıldı. Tırnaksız yazınca JavaScript adın **tuttuğu değeri** yazdırır."],
    ["calis"],
    ["sor", "`console.log(\"isim\")` yazsaydım ekranda ne görürdüm?", ["Deniz", "isim", "Hata"], 1, "Evet. Tırnak içi olduğu gibi yazılır; JavaScript onu bir ad olarak görmez.", "`isim` görürdün. Tırnak içindeki her şey metindir ve olduğu gibi çıkar."],
    ["k", "Değeri sonradan değişecek şeyler için `let` kullanılır. Yaş böyle bir şey."],
    ["kod", 'const isim = "Deniz";\nlet yas = 21;\nconsole.log(yas);\nyas = yas + 1;\nconsole.log(yas);'],
    ["v", [2], "`let` ile tanımladık, çünkü birazdan değiştireceğiz. Sayılar tırnaksız yazılır."],
    ["v", [4], "Bu satır matematikteki gibi okunmaz. Önce **sağ taraf** hesaplanır: 21 + 1 = 22. Sonra sonuç `yas` adına konur. Başında `let` yok, çünkü ad zaten var; yalnızca değeri değişiyor."],
    ["calis"],
    ["sor", "`yas` yerine `isim = \"Ali\";` yazıp `isim`'i değiştirmeye çalışsaydım?", ["Ali olurdu", "Hata verirdi"], 1, "Doğru. `const` ile tanımlanan ad yeniden atanamaz; JavaScript durur ve hata verir.", "Hata verirdi. `isim` `const` ile tanımlı; değeri değiştirilemez. Değişecek şeyler için `let` kullanırız."],
    ["sen", "Hangisini ne zaman kullanayım?", "Devam"],
    ["k", "Basit bir kural: önce `const` yaz. Değeri değiştirmen gerekirse o zaman `let`'e çevir. Böylece yanlışlıkla değiştirdiğin şeyleri JavaScript sana söyler."],
    ["k", "Son parça: metinle değişkeni aynı cümlede birleştirmek."],
    ["kod", 'const isim = "Deniz";\nlet yas = 21;\nconst mesaj = `${isim} ${yas} yaşında`;\nconsole.log(mesaj);\nconsole.log(typeof yas);'],
    ["v", [3], "Bu kez tırnak değil, **ters tırnak** (`` ` ``) kullandık. Ters tırnak içinde `${...}` yazarsan JavaScript içini hesaplayıp yerine koyar."],
    ["v", [5], "`typeof` bir değerin türünü söyler. `yas` bir sayı olduğu için `number` yazacak. Metinler `string` olur."],
    ["calis"],
    ["sor", "Üçüncü satırda ters tırnak yerine normal tırnak kullansaydım?", ["Aynı çıktı", "${isim} ${yas} yaşında yazardı", "Hata verirdi"], 1, "Evet. Normal tırnakta `${...}` sıradan karakterdir; olduğu gibi yazılır ve hata da vermez.", "`${isim} ${yas} yaşında` yazardı. Yerine koyma yalnızca ters tırnakta çalışır; normal tırnakta hata vermeden olduğu gibi çıkar."],
    ["k", "Bugünlük dört şey: `console.log` yazar, `const` değişmeyen ada, `let` değişecek ada, ters tırnak ve `${}` kutudakini cümleye yerleştirmeye. Şimdi bu satırları birkaç kez yazacağız."]
  ];
})();
