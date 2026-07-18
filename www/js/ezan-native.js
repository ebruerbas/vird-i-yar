/* ============================================================
   Vird-i Yâr — Yerel Ezan Bildirimleri (Capacitor / iOS + Android)
   Web tarayıcıda otomatik devre dışı kalır; uygulama davranışı değişmez.

   Mantık:
   - Vakitler cihazda çevrimdışı hesaplanır (adhan-js, Türkiye/Diyanet yöntemi).
   - Önümüzdeki 12 günün 5 ezan vakti (Güneş hariç) yerel bildirim olarak
     zamanlanır: 5 x 12 = 60 bildirim (iOS bekleyen bildirim limiti 64).
   - Uygulama her açılışta / öne gelişte pencere ileri kaydırılır.
   - Bildirim sesi: iOS'ta ezan_kisa.caf (<= 30 sn), Android'de res/raw/ezan_kisa.wav.
   ============================================================ */
(function(){
  'use strict';
  var cap = window.Capacitor;
  if(!cap || !cap.isNativePlatform || !cap.isNativePlatform()) return; // sadece native
  var LN = cap.Plugins && cap.Plugins.LocalNotifications;
  if(!LN){ console.warn('Ezan: LocalNotifications eklentisi bulunamadı'); return; }
  if(typeof adhan === 'undefined'){ console.warn('Ezan: adhan-js yüklenmedi'); return; }

  var DAYS_AHEAD = 12;
  var MAX_NOTIFS = 60;
  var VAKITLER = [
    { key:'fajr',    label:'İmsak'  },
    { key:'dhuhr',   label:'Öğle'   },
    { key:'asr',     label:'İkindi' },
    { key:'maghrib', label:'Akşam'  },
    { key:'isha',    label:'Yatsı'  }
  ];
  var SOUND_IOS = 'ezan_kisa.caf';
  var SOUND_ANDROID = 'ezan_kisa';

  function enabled(){ return localStorage.getItem('virdiyarEzanAlert') === '1'; }
  // Varsayılan açık: '0' kaydedilmemişse ezan sesi çalınır (eski davranışla uyumlu).
  function soundEnabled(){ return localStorage.getItem('virdiyarEzanSound') !== '0'; }
  function selectedIl(){
    var name = localStorage.getItem('virdiyarIl');
    if(typeof IL_LIST === 'undefined' || !name) return null;
    return IL_LIST.find(function(x){ return x.name === name; }) || null;
  }

  function ensurePermission(){
    return LN.checkPermissions().then(function(s){
      if(s.display === 'granted') return true;
      return LN.requestPermissions().then(function(r){ return r.display === 'granted'; });
    });
  }

  function cancelAll(){
    return LN.getPending().then(function(p){
      var list = (p && p.notifications) || [];
      if(!list.length) return;
      return LN.cancel({ notifications: list.map(function(n){ return { id: n.id }; }) });
    });
  }

  function ensureAndroidChannel(){
    if(cap.getPlatform() !== 'android') return Promise.resolve();
    // Android'de kanalın sesi oluşturulduktan sonra değiştirilemiyor, bu yüzden
    // ezan sesli / sessiz (varsayılan bildirim sesi) için iki ayrı kanal var.
    return Promise.all([
      LN.createChannel({
        id:'ezan',
        name:'Ezan Bildirimleri (ezan sesiyle)',
        description:'Vakit girince ezan sesiyle bildirim',
        importance:5,
        sound: SOUND_ANDROID + '.wav',
        visibility:1,
        vibration:true
      }).catch(function(){}),
      LN.createChannel({
        id:'ezan-sessiz',
        name:'Ezan Bildirimleri (sessiz)',
        description:'Vakit girince ezan sesi olmadan, varsayılan bildirim sesiyle',
        importance:5,
        visibility:1,
        vibration:true
      }).catch(function(){})
    ]);
  }

  var scheduling = false;
  function scheduleEzan(){
    if(scheduling) return Promise.resolve();
    scheduling = true;
    var done = function(){ scheduling = false; };

    if(!enabled()){
      return cancelAll().then(done, done);
    }
    var il = selectedIl();
    if(!il){ done(); return Promise.resolve(); }

    return ensurePermission().then(function(ok){
      if(!ok){ done(); return; }
      return ensureAndroidChannel()
        .then(cancelAll)
        .then(function(){
          var params = adhan.CalculationMethod.Turkey();
          var coords = new adhan.Coordinates(il.lat, il.lon);
          var now = new Date();
          var withSound = soundEnabled();
          var notifications = [];
          var id = 1;
          for(var d = 0; d < DAYS_AHEAD && notifications.length < MAX_NOTIFS; d++){
            var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);
            var times = new adhan.PrayerTimes(coords, day, params);
            for(var i = 0; i < VAKITLER.length && notifications.length < MAX_NOTIFS; i++){
              var v = VAKITLER[i];
              var at = times[v.key];
              if(at <= now) continue;
              var notif = {
                id: id++,
                title: 'Vird Diyarı',
                body: v.label + ' vakti girdi 🕌 (' + il.name + ')',
                schedule: { at: at, allowWhileIdle: true },
                extra: { vakit: v.label }
              };
              if(withSound){
                notif.sound = cap.getPlatform() === 'ios' ? SOUND_IOS : SOUND_ANDROID;
                notif.channelId = 'ezan';
              } else {
                // capacitor.config.json'daki plugins.LocalNotifications.sound (iOS için genel
                // varsayılan) devreye girmesin diye sound'u burada açıkça null yapıyoruz —
                // sadece alanı atlamak iOS'ta yine de ezan sesini çalabiliyor.
                notif.sound = null;
                notif.channelId = 'ezan-sessiz';
              }
              notifications.push(notif);
            }
          }
          if(!notifications.length) return;
          return LN.schedule({ notifications: notifications }).then(function(){
            console.log('Ezan: ' + notifications.length + ' bildirim zamanlandı (' + il.name + ')');
          });
        })
        .then(done, function(e){ console.warn('Ezan zamanlama hatası', e); done(); });
    });
  }

  /* --- Uygulama olaylarına bağlanma --- */

  // 1) Ezan aç/kapa düğmesini sarmala
  var origToggle = window.toggleEzanAlert;
  if(typeof origToggle === 'function'){
    window.toggleEzanAlert = function(){
      origToggle.apply(this, arguments);
      scheduleEzan().then(function(){
        if(enabled() && typeof showToast === 'function'){
          showToast('Ezan bildirimleri zamanlandı — uygulama kapalıyken de çalar');
        }
      });
    };
  }

  // 1b) Ezan sesi aç/kapa düğmesini sarmala — sound kanal/alanı bildirim başına
  // baked-in olduğu için tercih değişince mevcut zamanlamalar iptal edilip yeniden kurulmalı.
  var origSoundToggle = window.toggleEzanSound;
  if(typeof origSoundToggle === 'function'){
    window.toggleEzanSound = function(){
      origSoundToggle.apply(this, arguments);
      scheduleEzan();
    };
  }

  // 2) İl değişince yeniden zamanla
  var sel = document.getElementById('ilSelect');
  if(sel) sel.addEventListener('change', function(){ setTimeout(scheduleEzan, 400); });

  // 3) Uygulama öne gelince 12 günlük pencereyi tazele
  if(cap.Plugins.App && cap.Plugins.App.addListener){
    cap.Plugins.App.addListener('resume', function(){ scheduleEzan(); });
  }

  // 4) Ayar metnini native duruma uyarla
  var settingRows = document.querySelectorAll('.ezan-setting small');
  if(settingRows[0]){
    settingRows[0].textContent = 'Vakit girince bildirim gönderir. Uygulama kapalıyken de çalışır; vakitler cihazda hesaplanır.';
  }
  if(settingRows[1]){
    settingRows[1].textContent = 'Kapatırsanız vakit girince ezan sesi çalmaz, yalnızca cihazınızın varsayılan bildirim sesiyle uyarır.';
  }

  // 5) Açılışta zamanla
  scheduleEzan();
})();
