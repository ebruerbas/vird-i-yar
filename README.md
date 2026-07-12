# Vird-i Yâr (Virdiyar)

Kapsamlı zikirmatik web uygulaması — tek dosya (`index.html`), vanilla JS. Krem/kahve tema + koyu mod, esma/ayet/dua/tesbihat içerikleri, aşamalı tesbihat sayacı, favoriler.

## Sonraki Adımlar / Roadmap

- **Ses/dinleme**: Kur'an ayetleri ve Kur'an kökenli dualar (Rabbenâ Âtinâ, Yûnus Duası, Eyyûb Duası, Rabbiğfir Verham) için **Al Quran Cloud** (islamic.network, alquran.cloud) hafız kaydı kullanılabilir — ücretsiz, ticari ürüne gömmeye açık lisans. Hadis kökenli 4 dua (Seyyidü'l-İstiğfar, Zikir/Şükür duası, Rıza duası, Ümmet duası) için hazır kaynak yok; TTS veya kendi ses kaydı gerekecek. Karar bekliyor, henüz uygulanmadı.
- **Titreşim**: mevcut titreşim davranışı gözden geçirilecek, sonraya bırakıldı.
- Kullanıcının seçeceği ek ayetler.
- "Defterim" — kullanıcının kendi zikrini eklemesi (XSS riski için `textContent` kullan, mevcut `innerHTML` şablonlarına karıştırma).
- Hadis referanslarının bir hocaya son kontrolü.
- İstatistik/seri (streak) ekranı.
- PWA — telefona kurulabilir hâle getirme.

## Kaynak politikası

Diyanet'e dayanmıyor; Kur'an referansı + Buhârî/Müslim/Tirmizî/Ebû Dâvûd + Gazzâlî (el-Maksadü'l-esnâ) + TDV İslâm Ansiklopedisi + Elmalılı. Zayıf/mevkuf rivayetler ve hadis olmayan gelenek virdleri uygulama içinde açıkça işaretli.
