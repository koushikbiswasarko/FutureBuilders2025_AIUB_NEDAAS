import {
  applyI18n, toggleLang, tr,
  UserRequestsStore, escapeHtml, downloadJson, currentLang
} from "./common.js";

applyI18n();

/* Language toggle */
const btnLang = document.getElementById("btnLang");
if (btnLang) btnLang.addEventListener("click", toggleLang);

/* Theme */
const THEME_KEY = "nd_theme_v1";
function getTheme(){ return localStorage.getItem(THEME_KEY) || "light"; }
function setTheme(t){
  localStorage.setItem(THEME_KEY, t);
  document.body.setAttribute("data-theme", t);
  updateThemeButton();
}
function updateThemeButton(){
  const btn = document.getElementById("btnTheme");
  if (!btn) return;
  const t = getTheme();
  if (currentLang() === "bn"){
    btn.textContent = (t === "dark") ? "লাইট মোড" : "ডার্ক মোড";
  } else {
    btn.textContent = (t === "dark") ? "Light Mode" : "Dark Mode";
  }
}
document.body.setAttribute("data-theme", getTheme());
updateThemeButton();
const btnTheme = document.getElementById("btnTheme");
if (btnTheme) btnTheme.addEventListener("click", () => setTheme(getTheme() === "dark" ? "light" : "dark"));

/* Network */
const netDot = document.getElementById("netDot");
const netText = document.getElementById("netText");
function updateNet(){
  const on = navigator.onLine;
  netDot.classList.toggle("online", on);
  netDot.classList.toggle("offline", !on);
  netText.textContent = on ? tr("net.online") : tr("net.offline");
}
window.addEventListener("online", updateNet);
window.addEventListener("offline", updateNet);
updateNet();

/* Tier */
const TIER_KEY = "nd_tier_v3";
function getTier(){ return localStorage.getItem(TIER_KEY) || "free"; }
function isPremium(){ return getTier() === "premium"; }
const tierSelect = document.getElementById("tierSelect");
if (tierSelect){
  tierSelect.value = getTier();
  tierSelect.addEventListener("change", (e) => localStorage.setItem(TIER_KEY, e.target.value));
}
function premiumOnly(){ alert(tr("msg.premiumOnly")); }

/* WhatsApp + ChatGPT */
const WHATSAPP_BASIC_NUMBER = "+8801318557547";
const WHATSAPP_PREMIUM_NUMBER = "+8801737050131";
const CHATGPT_LINK = "https://chatgpt.com/";

/* -------------------------------------------------------
   ✅ USER-SIDE ADMIN LOGIN POPUP (ONLY ON BUTTON CLICK)
-------------------------------------------------------- */
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";
const SESSION_KEY = "nd_admin_session_v1";

const goAdminBtn = document.getElementById("goAdminBtn");
const userAdminLock = document.getElementById("userAdminLock");
const userAdminUser = document.getElementById("userAdminUser");
const userAdminPass = document.getElementById("userAdminPass");
const userAdminLoginBtn = document.getElementById("userAdminLoginBtn");
const userAdminCancelBtn = document.getElementById("userAdminCancelBtn");
const userAdminLockMsg = document.getElementById("userAdminLockMsg");

function openAdminOverlay(msg=""){
  if (!userAdminLock) return;
  userAdminLock.classList.remove("hidden");
  userAdminLockMsg.textContent = msg || "";
  userAdminUser.value = "";
  userAdminPass.value = "";
  setTimeout(() => userAdminUser.focus(), 0);
}

function closeAdminOverlay(){
  if (!userAdminLock) return;
  userAdminLock.classList.add("hidden");
  userAdminLockMsg.textContent = "";
}

function setLoggedIn(v){
  sessionStorage.setItem(SESSION_KEY, v ? "1" : "0");
}

/* Popup only when click Admin Portal */
if (goAdminBtn){
  goAdminBtn.addEventListener("click", () => openAdminOverlay(""));
}

/* Cancel closes popup */
if (userAdminCancelBtn){
  userAdminCancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeAdminOverlay();
  });
}

/* Click outside closes popup */
if (userAdminLock){
  userAdminLock.addEventListener("click", (e) => {
    if (e.target === userAdminLock) closeAdminOverlay();
  });
}

/* Escape closes popup */
document.addEventListener("keydown", (e) => {
  if (!userAdminLock) return;
  if (userAdminLock.classList.contains("hidden")) return;
  if (e.key === "Escape") closeAdminOverlay();
});

/* Enter submits login */
[userAdminUser, userAdminPass].forEach(inp => {
  if (!inp) return;
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && userAdminLoginBtn) userAdminLoginBtn.click();
  });
});

/* Success: hide popup then redirect */
if (userAdminLoginBtn){
  userAdminLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const u = (userAdminUser?.value || "").trim();
    const p = (userAdminPass?.value || "").trim();

    if (u === ADMIN_USER && p === ADMIN_PASS){
      setLoggedIn(true);
      closeAdminOverlay();              // ✅ disappears
      window.location.href = "admin.html";
    } else {
      userAdminLockMsg.textContent = tr("msg.loginFail");
    }
  });
}

/* -------------------------------------------------------
   Danger signs -> auto emergency
-------------------------------------------------------- */
function anyDangerChecked(){
  return Array.from(document.querySelectorAll(".dangerChk")).some(c => c.checked);
}
function setUrgency(value){
  const radio = document.querySelector(`input[name="urgency"][value="${value}"]`);
  if (radio) radio.checked = true;
}
function updateUrgencyFromDanger(){
  const note = document.getElementById("dangerAutoNote");
  if (!note) return;
  const lang = currentLang();
  if (anyDangerChecked()){
    setUrgency("Emergency");
    note.textContent = (lang === "bn")
      ? "ঝুঁকিপূর্ণ লক্ষণ পাওয়া গেছে — জরুরি স্তর ‘Emergency’ করা হয়েছে।"
      : "Danger signs detected — urgency set to Emergency.";
  } else note.textContent = "";
}
document.querySelectorAll(".dangerChk").forEach(c => c.addEventListener("change", updateUrgencyFromDanger));

/* Emergency / First aid toggles */
const btnEmergency = document.getElementById("btnEmergency");
const btnFirstAid = document.getElementById("btnFirstAid");
const emergencyBox = document.getElementById("emergencyBox");
const firstAidBox = document.getElementById("firstAidBox");

if (btnEmergency) btnEmergency.addEventListener("click", () => {
  emergencyBox.classList.toggle("hidden");
  firstAidBox.classList.add("hidden");
});
if (btnFirstAid) btnFirstAid.addEventListener("click", () => {
  firstAidBox.classList.toggle("hidden");
  emergencyBox.classList.add("hidden");
});

/* GPS */
const btnUseLocation = document.getElementById("btnUseLocation");
let gpsCache = null;

if (btnUseLocation){
  btnUseLocation.addEventListener("click", () => {
    if (!("geolocation" in navigator)) return alert("GPS not supported on this device.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        gpsCache = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        alert(`${currentLang()==="bn" ? "GPS সংরক্ষিত" : "GPS saved"}: ${gpsCache.lat.toFixed(5)}, ${gpsCache.lng.toFixed(5)} (±${Math.round(gpsCache.accuracy)}m)`);
      },
      () => alert(tr("msg.gpsFail")),
      { enableHighAccuracy:true, timeout:8000 }
    );
  });
}

/* Save request */
const helpForm = document.getElementById("helpForm");
if (helpForm){
  helpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const dangerSigns = Array.from(document.querySelectorAll(".dangerChk"))
      .filter(c => c.checked)
      .map(c => c.value);

    const req = {
      id: cryptoRandomId(),
      createdAt: new Date().toISOString(),
      patientName: document.getElementById("patientName").value.trim(),
      patientAge: document.getElementById("patientAge").value.trim(),
      patientPhone: document.getElementById("patientPhone").value.trim(),
      patientLocation: document.getElementById("patientLocation").value.trim(),
      problemType: document.getElementById("problemType").value,
      urgency: document.querySelector('input[name="urgency"]:checked').value,
      symptoms: document.getElementById("symptoms").value.trim(),
      dangerSigns,
      gps: gpsCache || null,
      rxRequested: false,
      rxRequestedAt: null
    };

    const list = UserRequestsStore.load();
    list.unshift(req);
    UserRequestsStore.save(list);

    helpForm.reset();
    gpsCache = null;
    document.querySelectorAll(".dangerChk").forEach(c => c.checked = false);
    updateUrgencyFromDanger();

    alert(tr("msg.saved"));
  });
}

/* View queue */
const btnViewQueue = document.getElementById("btnViewQueue");
const queueBox = document.getElementById("queueBox");
if (btnViewQueue && queueBox){
  btnViewQueue.addEventListener("click", () => {
    const list = UserRequestsStore.load();
    queueBox.innerHTML = list.length
      ? list.map(renderReq).join("")
      : `<p class="muted">${tr("msg.noReq")}</p>`;
    queueBox.classList.toggle("hidden");
  });
}

function renderReq(r){
  const date = new Date(r.createdAt).toLocaleString();
  const gpsText = r.gps ? `${r.gps.lat.toFixed(5)}, ${r.gps.lng.toFixed(5)}` : "N/A";
  const danger = (r.dangerSigns || []).map(escapeHtml).join(", ") || "None";
  const lang = currentLang();

  return `
    <div class="dirItem">
      <h3>${escapeHtml(r.patientName)} — <span class="muted">${escapeHtml(r.urgency)}</span></h3>
      <p><strong>${lang === "bn" ? "সময়" : "When"}:</strong> ${escapeHtml(date)}</p>
      <p><strong>${lang === "bn" ? "অবস্থান" : "Location"}:</strong> ${escapeHtml(r.patientLocation)}</p>
      <p><strong>${lang === "bn" ? "ধরন" : "Type"}:</strong> ${escapeHtml(r.problemType)}</p>
      <p><strong>GPS:</strong> ${escapeHtml(gpsText)}</p>
      <p><strong>${lang === "bn" ? "ঝুঁকিপূর্ণ লক্ষণ" : "Danger signs"}:</strong> ${danger}</p>
      <p><strong>${lang === "bn" ? "লক্ষণ" : "Symptoms"}:</strong> ${escapeHtml(r.symptoms)}</p>
    </div>
  `;
}

/* Export JSON */
const btnExport = document.getElementById("btnExport");
if (btnExport){
  btnExport.addEventListener("click", () => {
    const list = UserRequestsStore.load();
    if (!list.length) return alert(tr("msg.noReqShort"));
    downloadJson(`nedaashealthcare-user-requests-${new Date().toISOString().slice(0,10)}.json`, {
      exportedAt: new Date().toISOString(),
      requests: list
    });
  });
}

/* WhatsApp */
const btnWhatsApp = document.getElementById("btnWhatsApp");
const btnWhatsAppPremium = document.getElementById("btnWhatsAppPremium");

if (btnWhatsApp){
  btnWhatsApp.addEventListener("click", () => {
    const latest = UserRequestsStore.load()[0] || null;
    const msg = buildWhatsAppMessage(latest, "BASIC");
    window.location.href = `https://wa.me/${cleanWhatsApp(WHATSAPP_BASIC_NUMBER)}?text=${encodeURIComponent(msg)}`;
  });
}
if (btnWhatsAppPremium){
  btnWhatsAppPremium.addEventListener("click", () => {
    if (!isPremium()) return premiumOnly();
    const latest = UserRequestsStore.load()[0] || null;
    const msg = buildWhatsAppMessage(latest, "PREMIUM");
    window.location.href = `https://wa.me/${cleanWhatsApp(WHATSAPP_PREMIUM_NUMBER)}?text=${encodeURIComponent(msg)}`;
  });
}

/* Lab Suggestion */
const btnLabSuggest = document.getElementById("btnLabSuggest");
const labBox = document.getElementById("labBox");

if (btnLabSuggest){
  btnLabSuggest.addEventListener("click", () => {
    if (!isPremium()) return premiumOnly();
    const symptoms = (document.getElementById("symptoms").value || "").toLowerCase();
    const type = (document.getElementById("problemType").value || "").toLowerCase();
    const suggestions = suggestLabs(symptoms, type);

    const lang = currentLang();
    labBox.innerHTML = suggestions.length
      ? `<ul>${suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
         <p class="small">${lang === "bn" ? "চূড়ান্ত সিদ্ধান্ত চিকিৎসক নেবেন।" : "A clinician should confirm tests."}</p>`
      : `<p class="muted">${lang === "bn" ? "নির্দিষ্ট পরামর্শ নেই। অবস্থা খারাপ হলে দ্রুত চিকিৎসা নিন।" : "No specific suggestions. If severe, seek care."}</p>`;
    labBox.classList.toggle("hidden");
  });
}

function suggestLabs(symptoms, type){
  const out = new Set();
  const has = (w) => symptoms.includes(w) || type.includes(w);
  if (has("fever") || has("infection")) { out.add("CBC (Complete Blood Count)"); out.add("CRP / ESR"); }
  if (has("breath") || has("asthma")) { out.add("Pulse oximetry (SpO2)"); out.add("Chest X-ray (if needed)"); }
  if (has("diarrhea") || has("dehydration")) { out.add("Stool R/E"); out.add("Serum electrolytes (severe)"); }
  if (has("pregnancy") || has("maternal")) { out.add("Hemoglobin"); out.add("Urine R/E"); out.add("BP check"); }
  if (has("diabetes")) { out.add("Blood glucose (FBS/RBS)"); out.add("HbA1c"); }
  return Array.from(out);
}

/* Prescription */
const btnRxRequest = document.getElementById("btnRxRequest");
const rxBox = document.getElementById("rxBox");

if (btnRxRequest){
  btnRxRequest.addEventListener("click", () => {
    if (!isPremium()) return premiumOnly();
    const list = UserRequestsStore.load();
    if (!list.length) return alert(tr("msg.noReqShort"));

    list[0].rxRequested = true;
    list[0].rxRequestedAt = new Date().toISOString();
    UserRequestsStore.save(list);

    rxBox.innerHTML = `<p class="muted">${
      currentLang() === "bn"
        ? "প্রেসক্রিপশন রিভিউ অনুরোধ করা হয়েছে। WhatsApp/স্বাস্থ্যকর্মীর মাধ্যমে যোগাযোগ করুন।"
        : "Prescription review requested. Contact via WhatsApp/health worker."
    }</p>`;
    rxBox.classList.remove("hidden");
  });
}

/* AI Doctor */
const btnOpenChatGPT = document.getElementById("btnOpenChatGPT");
if (btnOpenChatGPT){
  btnOpenChatGPT.addEventListener("click", () => {
    if (!isPremium()) return premiumOnly();
    window.open(CHATGPT_LINK, "_blank", "noopener,noreferrer");
  });
}

function buildWhatsAppMessage(req, tier){
  const lang = currentLang();
  if (!req) return `(${tier}) NEDAAS HealthCare help needed. No saved request found. Location: [type here].`;
  const danger = (req.dangerSigns || []).join(", ") || "None";

  if (lang === "bn"){
    return [
      `(${tier}) NEDAAS HealthCare - সাহায্য অনুরোধ`,
      `নাম: ${req.patientName}, বয়স: ${req.patientAge}`,
      `ফোন: ${req.patientPhone || "N/A"}`,
      `অবস্থান: ${req.patientLocation}`,
      `সমস্যা: ${req.problemType}, জরুরি স্তর: ${req.urgency}`,
      `ঝুঁকিপূর্ণ লক্ষণ: ${danger}`,
      `লক্ষণ: ${req.symptoms}`,
      `GPS: ${req.gps ? `${req.gps.lat}, ${req.gps.lng}` : "N/A"}`
    ].join("\n");
  }

  return [
    `(${tier}) NEDAAS HealthCare - Medical Help Request`,
    `Name: ${req.patientName}, Age: ${req.patientAge}`,
    `Phone: ${req.patientPhone || "N/A"}`,
    `Location: ${req.patientLocation}`,
    `Problem: ${req.problemType}, Urgency: ${req.urgency}`,
    `Danger Signs: ${danger}`,
    `Symptoms: ${req.symptoms}`,
    `GPS: ${req.gps ? `${req.gps.lat}, ${req.gps.lng}` : "N/A"}`
  ].join("\n");
}

function cryptoRandomId(){
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,"0")).join("");
}
function cleanWhatsApp(num){
  return String(num).replace(/\D/g, "");
}
