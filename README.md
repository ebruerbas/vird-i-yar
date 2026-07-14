# Vird Diyarı 📿

Esmaül Hüsna (99 isim), Kur'an'dan seçme ayetler ve dualar, zikir sayacı, namaz vakitleri, kıble pusulası ve ezan bildirimleri sunan mobil uyumlu uygulama.

## İçerik

- **99 Esma** — anlam, ebced değeri, fazilet notları ve ayet referanslarıyla
- **97 Ayet** — Âyetel Kürsî'den Kur'an'da geçen 77 duaya; Arapça metin, Latin okunuş, meal, fazilet ve kaynaklarla
- **Dualar ve tesbihat** — günlük dualar, kademeli zikir sayacı
- **Namaz vakitleri** — 81 il için, sıradaki vakte geri sayım
- **Kıble pusulası** — cihaz sensörüyle
- **Ezan bildirimi** — web'de sekme açıkken; iOS/Android uygulamasında arka planda (aşağıya bakın)

## Web olarak çalıştırma

`www/index.html` tek dosyalık bağımsız bir uygulamadır; herhangi bir tarayıcıda açın veya GitHub Pages ile yayınlayın (Settings → Pages → kaynak olarak bu depo, klasör `/www`... yerine kökten servis için `www` içeriğini köke kopyalayabilirsiniz).

## iOS uygulaması (Capacitor)

Gereksinimler: macOS + Xcode, Node.js, (App Store için) Apple Developer hesabı.

```bash
npm install
npx cap add ios

# Ezan bildirim sesini üret (ffmpeg gerekir: brew install ffmpeg)
bash tools/make-ezan-sound.sh
# Üretilen resources/ezan_kisa.caf dosyasını Xcode'da App hedefine sürükleyin
# ("Copy items if needed" işaretli olsun)

npx cap sync ios
npx cap open ios   # Xcode'da çalıştırın
```

### Ezan bildirimleri nasıl çalışır?

- Vakitler cihazda **çevrimdışı** hesaplanır: [adhan-js](https://github.com/batoulapps/adhan-js), Türkiye (Diyanet) hesap yöntemi. Resmî Diyanet vakitleriyle birkaç dakika fark olabilir.
- Uygulama her açıldığında/öne geldiğinde önümüzdeki **12 günün 5 ezan vakti** (İmsak, Öğle, İkindi, Akşam, Yatsı) yerel bildirim olarak zamanlanır — 60 bildirim, iOS'un 64 bekleyen bildirim sınırının altında.
- Bildirim sesi iOS kuralı gereği en fazla 30 saniyedir; ezanın ilk ~28 saniyesi çalınır (Nasır el-Katami, CC BY-NC 3.0).
- Push sunucusu **gerekmez**; her şey cihazda çalışır.
- Kullanıcı uygulamayı 12 günden uzun süre hiç açmazsa bildirimler tükenir; uygulamanın arada bir açılması pencereyi ileri kaydırır.

İlgili kod: `www/js/ezan-native.js` (web'de kendiliğinden devre dışıdır).

### Uygulama ikonu

`resources/AppIcon-1024.png` hazırdır. Xcode'da: sol panelde **App → Assets → AppIcon** seçin ve 1024x1024 kutusuna bu dosyayı sürükleyin.

### Uygulama adı

Görünen adı değiştirmek için Xcode'da **App hedefi → General → Display Name** alanına `Vird Diyarı` yazın (capacitor.config.json yeni projelerde bunu otomatik yapar).

## Android notu

Aynı kod Android'de de çalışır (`npx cap add android`). Bildirim sesi için `resources/ezan_kisa.wav` dosyasını `android/app/src/main/res/raw/` altına kopyalayın.

## Kaynaklar ve lisans

- Ayet mealleri: "Kur'ân-ı Kerîm'den Duâlar" derlemesi ve Diyanet meali esas alınmıştır.
- Ezan sesi: Nasır el-Katami — [archive.org/details/1azan](https://archive.org/details/1azan) (CC BY-NC 3.0).
- Namaz vakitleri (web): [AlAdhan API](https://aladhan.com/prayer-times-api), Diyanet yöntemi (method=13).
