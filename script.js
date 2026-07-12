// --- ÖRNEK VERİ YAPISI (DATA) ---
// İlerleyen adımlarda burayı tamamen gerçek verilerle dolduracağız.
const zikirVerileri = {
    esma: [
        { id: 1, ad: "Allah (C.C.)", okunus: "Allah", anlam: "Her şeyin gerçek mabudu, tek yaratıcı.", hedef: 66 },
        { id: 2, ad: "Er-Rahmân", okunus: "Er-Rahmân", anlam: "Dünyada bütün mahlukata şefkat gösteren.", hedef: 298 },
        { id: 3, ad: "Er-Rahîm", okunus: "Er-Rahîm", anlam: "Ahirette sadece müminlere merhamet eden.", hedef: 258 }
    ],
    namaz: [
        { id: 1, ad: "Sübhanallah", okunus: "Sübhanallah", anlam: "Allah'ı tüm eksikliklerden tenzih ederim.", hedef: 33 },
        { id: 2, ad: "Elhamdülillah", okunus: "Elhamdülillah", anlam: "Hamd ve övgü yalnızca Allah'adır.", hedef: 33 },
        { id: 3, ad: "Allahuekber", okunus: "Allahuekber", anlam: "Allah en büyüktür.", hedef: 33 }
    ],
    hifz: [
        { id: 1, ad: "Ayetel Kürsi (Bakara 255)", okunus: "Allâhu lâ ilâhe illâ huvel hayyul kayyûm...", anlam: "Yüce Allah'ın mutlak hakimiyetini ve koruyuculuğunu anlatır. Gece okuyanı sabaha kadar muhafaza eder.", hedef: 7 },
        { id: 2, ad: "Muavvizeteyn (Felak & Nas)", okunus: "Kul eûzu bi rabbil felak... Kul eûzu bi rabbin nâs...", anlam: "Her türlü şerden, hasetten ve görünmez kazalardan sığınmak için okunur.", hedef: 3 }
    ],
    ozel: [] // Kullanıcının kendi ekleyeceği zikirler buraya gelecek
};

// --- UYGULAMA DURUMU (STATE) ---
let aktifKategori = "";
let aktifZikir = null;
let mevcutSayac = 0;

// --- EKRAN GEÇİŞ FONKSİYONLARI ---
function openCategory(kategoriKey) {
    aktifKategori = kategoriKey;
    
    // Listelenecek içeriği temizle ve başlığı ayarla
    const listContent = document.getElementById("list-content");
    const categoryTitle = document.getElementById("category-title");
    listContent.innerHTML = "";

    // Başlık belirleme
    const basliklar = {
        esma: "Esmaü'l-Hüsna",
        namaz: "Namaz Tesbihatı",
        hifz: "Hıfz & Koruma Ayetleri",
        ozel: "Defterim"
    };
    categoryTitle.innerText = basliklar[kategoriKey];

    // İlgili kategorideki verileri ekrana listeleme
    const liste = zikirVerileri[kategoriKey];
    
    if(liste.length === 0 && kategoriKey === 'ozel') {
        listContent.innerHTML = `<p style="text-align:center; color:#8a99ad; margin-top:20px;">Henüz özel zikir eklemediniz.</p>`;
    } else {
        liste.forEach(item => {
            const card = document.createElement("div");
            card.className = "list-item-card"; // İleride süsleyeceğimiz şık bir kart
            card.style.cssText = "background:#182430; padding:15px; border-radius:12px; margin-bottom:10px; cursor:pointer; border:1px solid #233547;";
            card.innerHTML = `
                <strong style="color:#dfb76c; font-size:1.1rem;">${item.ad}</strong>
                <p style="font-size:0.85rem; color:#94a3b8; margin-top:5px;">Hedef: ${item.hedef} - ${item.anlam.substring(0, 60)}...</p>
            `;
            card.onclick = () => openCounter(item);
            listContent.appendChild(card);
        });
    }

    switchScreen("list-screen");
}

function openCounter(zikirObj) {
    aktifZikir = zikirObj;
    mevcutSayac = 0;

    document.getElementById("zikir-title").innerText = zikirObj.ad;
    document.getElementById("zikir-meaning").innerText = `${zikirObj.okunus} \n\n Anlamı: ${zikirObj.anlam}`;
    document.getElementById("zikir-target").innerText = `Hedef: ${zikirObj.hedef}`;
    document.getElementById("counter-display").innerText = mevcutSayac;

    switchScreen("counter-screen");
}

function switchScreen(screenId) {
    // Tüm ekranları kapat
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    // İstenen ekranı aç
    document.getElementById(screenId).classList.add("active");
}

function goBack() {
    switchScreen("home-screen");
}

function goBackToList() {
    switchScreen("list-screen");
}

// --- SAYAÇ MEKANİZMASI ---
function incrementCounter() {
    mevcutSayac++;
    document.getElementById("counter-display").innerText = mevcutSayac;

    // Hedefe ulaşıldığında küçük bir görsel uyarı (isteğe bağlı ses/titreşim eklenebilir)
    if (mevcutSayac === aktifZikir.hedef) {
        document.getElementById("counter-display").style.color = "#dfb76c"; // Altın sarısına döner
    }
}

function resetCounter() {
    if(confirm("Sayacı sıfırlamak istediğinize emin misiniz?")) {
        mevcutSayac = 0;
        document.getElementById("counter-display").innerText = mevcutSayac;
        document.getElementById("counter-display").style.color = "#ffffff";
    }
}