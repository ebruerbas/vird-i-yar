# App Store Yayınlama Rehberi — Vird Diyarı

Sırasıyla ilerle; her adım bir öncekine bağlıdır.

## 1. Apple Developer Program (bir kez)

1. [developer.apple.com/programs](https://developer.apple.com/programs/) → **Enroll** (99 $/yıl, bireysel hesap yeterli).
2. Onay e-postası birkaç saat–2 gün sürebilir.

## 2. Xcode İmzalama

1. Xcode → **App** hedefi → **Signing & Capabilities**.
2. **Team**: Apple Developer hesabını seç. **Automatically manage signing** işaretli kalsın.
3. **Bundle Identifier**: `com.virdiyar.app` (App Store'da benzersiz olmalı; alınmışsa `com.ebruerbas.virdiyar` yap).
4. **General → Version**: `1.0.0`, **Build**: `1`.

## 3. App Store Connect'te Uygulama Oluştur

1. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **My Apps → + → New App**.
2. Platform: iOS · Name: **Vird Diyarı** · Primary Language: **Turkish** · Bundle ID: yukarıdaki · SKU: `virdiyar-001`.

## 4. Mağaza Bilgileri

`store/app-store-metinleri.md` dosyasındaki metinleri ilgili alanlara kopyala:
ad, alt başlık, açıklama, anahtar kelimeler, tanıtım metni, kategori, yaş (4+), fiyat (ücretsiz).

- **Privacy Policy URL**: `https://ebruerbas.github.io/vird-i-yar/privacy.html`
  (privacy.html depoya eklendi; GitHub Pages açıksa bu adres çalışır. Pages: repo Settings → Pages → main / root.)
- **App Privacy** bölümünde **Data Not Collected** seç.

## 5. Ekran Görüntüleri

Zorunlu boyut: **6.7" (1290×2796)** — iPhone 15 Pro Max simülatöründe çek:

1. Xcode → simülatör olarak **iPhone 15 Pro Max** seç, uygulamayı çalıştır.
2. Her ekranda **Cmd+S** (masaüstüne kaydeder).
3. Önerilen 6 görüntü, bu sırayla:
   1. Ana sayfa (namaz kartı + günün esması)
   2. Esma detayı (Arapça yazı + fazilet)
   3. Zikir sayacı (sayaç ekranı)
   4. Namaz vakitleri + geri sayım
   5. Kıble pusulası
   6. Ayetler listesi
4. Koyu temadan da 1-2 görüntü eklemek profesyonel durur.

İpucu: Görüntüleri olduğu gibi de yükleyebilirsin; istersen bana gönder, çerçeveli ve başlıklı profesyonel mağaza görselleri hazırlayayım.

## 6. Build Yükleme

1. Xcode'da cihaz hedefini **Any iOS Device (arm64)** yap.
2. **Product → Archive**.
3. Organizer açılınca **Distribute App → App Store Connect → Upload** (varsayılan ayarlarla ilerle).
4. 10-30 dk sonra build App Store Connect'te görünür (işlenme e-postası gelir).

## 7. TestFlight (önerilir)

App Store Connect → TestFlight → kendi cihazına yükleyip birkaç gün kullan; özellikle ezan bildirimlerinin gerçek cihazda vaktinde geldiğini doğrula.

## 8. İncelemeye Gönderme

1. Sürüm sayfasında build'i seç, ekran görüntülerini yükle.
2. **App Review Information** alanına not ekle (İngilizce):
   ```
   Vird Diyarı is an Islamic daily devotional app (99 Names of Allah,
   Quranic verses and prayers with sources, dhikr counter, prayer times,
   qibla compass, adhan notifications). All content is offline; no account
   is required. Religious texts include scholarly source citations.
   ```
3. **Submit for Review**. İlk inceleme genelde 1-3 gün sürer.

## Bilinmesi İyi Olur

- **Ezan sesi lisansı**: Mevcut ses CC BY-NC 3.0 (ticari olmayan). Uygulama ücretsiz ve atıf uygulama içinde mevcut; yine de App Store dağıtımında en garantili yol, ileride kendi kaydın veya tamamen serbest lisanslı bir ezan kaydıyla değiştirmek. Reddedilme olursa ilk bakılacak yer burası değil ama telif tarafında en zayıf halka bu.
- **Reddedilme durumunda**: Apple gerekçeyi yazılı bildirir; çoğu zaman küçük bir düzeltmeyle yeniden gönderilir. Gerekçeyi bana ilet, birlikte düzeltelim.
- **Güncelleme yayınlamak**: Version/Build numarasını artır → Archive → Upload → yeni sürümü incelemeye gönder.
