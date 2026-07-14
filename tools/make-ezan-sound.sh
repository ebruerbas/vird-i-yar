#!/bin/bash
# =============================================================
# Ezan bildirim sesini üretir (Mac'te çalıştırın).
# Kaynak: Nasır el-Katami ezanı — archive.org/details/1azan (CC BY-NC 3.0)
# iOS bildirim sesi en fazla 30 sn olabilir; ilk 28 sn alınır,
# sonuna 3 sn fade-out eklenir.
# Gereksinim: ffmpeg (brew install ffmpeg)
# =============================================================
set -e
cd "$(dirname "$0")/.."
curl -L -o /tmp/ezan_tam.mp3 "https://archive.org/download/1azan/mehwar.mp3"
ffmpeg -y -i /tmp/ezan_tam.mp3 -t 28 -af "afade=t=out:st=25:d=3" -ar 44100 -ac 1 resources/ezan_kisa.wav
afconvert -f caff -d LEI16@44100 -c 1 resources/ezan_kisa.wav resources/ezan_kisa.caf
echo ""
echo "Üretildi: resources/ezan_kisa.caf (iOS) ve resources/ezan_kisa.wav (Android)"
echo "iOS  : Xcode'da ezan_kisa.caf dosyasını App hedefine sürükleyin (Copy items if needed işaretli)."
echo "Android: resources/ezan_kisa.wav dosyasını android/app/src/main/res/raw/ altına kopyalayın."
