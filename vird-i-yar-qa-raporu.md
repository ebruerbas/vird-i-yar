# Vird-i Yâr — QA Raporu

> **Güncelleme:** Aşağıda listelenen 1-3 numaralı bulgular (arama normalizasyonu, eksik `target` alanları, `target:1` toast koşulu) `vird-i-yar.html` içinde düzeltildi ve headless testle doğrulandı. 4-5 numaralı kozmetik notlar henüz uygulanmadı.

Yöntem: dosya statik olarak incelendi; veri bütünlüğü ve ebced değerleri Node.js scriptleriyle programatik doğrulandı; uygulama jsdom ile headless çalıştırılıp sayaç/favori/arama/tema akışları test edildi.

## Genel sonuç

Uygulama sağlam durumda: 140 kayıt eksiksiz, tüm ID'ler benzersiz, konsol/çalışma zamanı hatası yok, sayaç ve tur mantığı doğru çalışıyor. **99 esmanın ebced değerlerinin tamamı** Arapça yazılıştan yeniden hesaplanıp doğrulandı — hiçbir hata çıkmadı. Bulunan gerçek sorunlar aşağıda, önem sırasına göre listeleniyor.

## Bulgular

### 1. Arama Türkçe karakterlerde/aksanlarda eşleşmiyor (orta-yüksek öncelik)
`globalSearch` input'u `.toLowerCase()` kullanıyor. İki ayrı etkisi var:
- **Büyük İ sorunu**: JS'in yerel-olmayan `toLowerCase()`'i `İ`'yi düz `i` yerine `i̇` (nokta + birleşik işaret) yapıyor. Test: `"istiğfar"` araması **1 sonuç**, `"İstiğfar"` (büyük İ ile) araması **4 sonuç** veriyor — oysa kullanıcı klavyede küçük harfle yazınca birincisini yazar.
- **Aksan/şapka sorunu**: `"rahman"` (şapkasız) araması **0 sonuç**, `"rahmân"` (â ile) araması **4 sonuç** veriyor. Şapkalı harf içermeyen bir arama kelimesi yazan kullanıcı (çoğu kullanıcı) o kayda hiç ulaşamıyor.

Düzeltme: `.toLocaleLowerCase('tr')` kullanmak birinci sorunu çözer; ikincisi için hem sorguyu hem korpüsü normalize edip (â→a, î→i, û→u, ş/ğ/ı türevleri) karşılaştırma yapmak gerekir.

### 2. Ayet/dua kartlarında sayaç hedefi tanımsız — varsayılan 33'e düşüyor (orta öncelik)
`renderCounter()` içinde hedef `item.ebced || item.target || 33` ile belirleniyor. 99 esmanın hepsinde `ebced` alanı zaten bir hedef sağlıyor, ama **11 kayıtta** (`ayet-1` Âyetel Kürsî, `ayet-2` Âmenerrasûlü, `ayet-3` İhlâs Suresi, ve `dua-1`…`dua-8`'in tamamı) ne `target` ne `ebced` alanı var — sayaç bu yüzden hepsini otomatik olarak **33 tekrar** hedefiyle açıyor. Dualar geleneksel olarak bir kez okunur; İhlâs genelde 1 veya 3 kez önerilir. Veri setine bu 11 kayıt için açık bir `target` (örn. dua'lar için 1, İhlâs için 3) eklenmesi gerekiyor.

### 3. `target:1` olan kayıtlarda tamamlanma bildirimi hiç tetiklenmiyor (düşük öncelik)
`incrementCounter()`'da toast/titreşim koşulu `target > 1 && count % target === 0` — yani `target:1` olan `ayet-10` (Vâkıa) ve `ayet-20` (Tekâsür) için "Hedef tamamlandı" toast'ı ve titreşim **hiçbir zaman** tetiklenmiyor, oysa tur rozeti (`turBadge`) her tıklamada güncelleniyor. Küçük bir tutarsızlık; kullanıcıya geri bildirim eksik kalıyor.

### 4. Aşamalı tesbihat sayacında geri alma bir aşama öncesine dönmüyor (kozmetik)
`decrementCounter()`, aşamalı (stages) sayaçlarda sadece `count`'u azaltıyor; bir aşamanın başında (`count:0`) iken "−1" basılırsa bir önceki aşamaya dönmüyor (zaten bu durumda buton gizleniyor ama aşama ortasında yanlışlıkla ileri geçilirse tam geri alma mümkün değil). Küçük bir kullanılabilirlik notu, çoğu kullanıcı fark etmez.

### 5. Modal'ı kapatmak için görünür bir "kapat" kontrolü yok (kozmetik)
Bottom-sheet yalnızca arka plana (overlay) dokunarak kapanıyor; sheet-bar dekoratif, tıklanabilir değil. iOS/Android alışkanlıklarına göre çalışır ama bir "✕" ikonu ya da Esc tuşu desteği eklenmesi erişilebilirliği artırır.

## Doğrulanan, sorun çıkmayan alanlar
- **Veri bütünlüğü**: 99 esma + 20 ayet + 8 dua + 13 tesbih = 140, ID'ler benzersiz ve esma-1…esma-99 sıralı, zorunlu alanların (title/subtitle/meaning/tag/arabic/virtues/verses) hiçbirinde eksik yok.
- **Ebced hesapları**: Tüm 99 değer, standart ebced tablosu + dosyadaki kurala (şedde tekrar sayılmaz, harf-i tarif "Allah" hariç hesaba katılmaz) göre programatik olarak yeniden üretildi ve birebir eşleşti.
- **Sayaç/tur mantığı**: Basit sayaçlarda hedef dolunca doğru şekilde sıfırlanıp tur artıyor (`Math.floor(count/target)`), aşamalı tesbihatta 33+33+33+1 geçişleri ve "tamamlandı" durumu doğru çalışıyor, localStorage'a `counter-<id>` anahtarıyla doğru kaydediliyor.
- **Favoriler**: Ekleme/çıkarma, `virdiyarFavorites` anahtarında localStorage'a doğru yazılıyor, favori listesi ve sayaç doğru güncelleniyor.
- **Tema**: Light/dark geçişi ve `virdiyarTheme` kalıcılığı sorunsuz; CSS değişkenleri her iki temada da eksiksiz tanımlı.
- **Konsol/çalışma zamanı hatası**: jsdom ile tam sayfa yüklemesinde ve yukarıdaki senaryoların tamamında hiçbir JS hatası oluşmadı.

## Not: gelecekteki "Defterim" özelliği için
Mevcut kod `innerHTML` ile static `data` dizisinden içerik basıyor — bu güvenli, çünkü içerik geliştirici tarafından yazılıyor. Ancak roadmap'teki "Defterim" (kullanıcı kendi zikrini eklesin) özelliği devreye girdiğinde, kullanıcı girdisi aynı `card()`/`openItem()` şablonlarından geçerse XSS riski oluşur — notta zaten `textContent` kullanılması gerektiği yazılmış, bu doğru yaklaşım; o özellik eklenirken ayrı bir render yolu (textContent tabanlı) kullanılmalı, mevcut `innerHTML` şablonlarına karıştırılmamalı.
