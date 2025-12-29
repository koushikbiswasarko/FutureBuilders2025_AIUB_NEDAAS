import {
  applyI18n, toggleLang, tr,
  AdminDirectoryStore, AdminCasesStore,
  escapeHtml, downloadJson, currentLang
} from "./common.js";

applyI18n();

document.getElementById("btnLang").addEventListener("click", toggleLang);

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
document.getElementById("btnTheme").addEventListener("click", () => setTheme(getTheme() === "dark" ? "light" : "dark"));

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

/* Admin login */
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";
const SESSION_KEY = "nd_admin_session_v1";

const adminLock = document.getElementById("adminLock");
const lockMsg = document.getElementById("lockMsg");
const adminUser = document.getElementById("adminUser");
const adminPass = document.getElementById("adminPass");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");

function showLock(msg=""){
  adminLock.classList.remove("hidden");
  lockMsg.textContent = msg;
}
function hideLock(){
  adminLock.classList.add("hidden");
  lockMsg.textContent = "";
}
function isLoggedIn(){
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
function setLoggedIn(v){
  sessionStorage.setItem(SESSION_KEY, v ? "1" : "0");
}

if (!isLoggedIn()){
  showLock("");
} else {
  hideLock();
  renderDirectory();
  renderCases();
}

btnLogin.addEventListener("click", () => {
  const u = (adminUser.value || "").trim();
  const p = (adminPass.value || "").trim();
  if (u === ADMIN_USER && p === ADMIN_PASS){
    setLoggedIn(true);
    hideLock();
    renderDirectory();
    renderCases();
  } else {
    showLock(tr("msg.loginFail"));
  }
});

btnLogout.addEventListener("click", () => {
  setLoggedIn(false);
  showLock("");
});

/* Directory */
const dirForm = document.getElementById("dirForm");
const dirList = document.getElementById("dirList");

dirForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!isLoggedIn()) return showLock("");

  const entry = {
    id: cryptoRandomId(),
    name: document.getElementById("dirName").value.trim(),
    area: document.getElementById("dirArea").value.trim(),
    phone: document.getElementById("dirPhone").value.trim(),
    note: document.getElementById("dirNote").value.trim(),
    createdAt: new Date().toISOString()
  };

  const list = AdminDirectoryStore.load();
  list.unshift(entry);
  AdminDirectoryStore.save(list);

  dirForm.reset();
  renderDirectory();
});

function renderDirectory(){
  const list = AdminDirectoryStore.load();
  if (!list.length){
    dirList.innerHTML = `<p class="muted">${currentLang()==="bn" ? "ডিরেক্টরি এখনো খালি।" : "Directory is empty."}</p>`;
    return;
  }
  dirList.innerHTML = list.map(d => `
    <div class="dirItem">
      <h3>${escapeHtml(d.name)}</h3>
      <p><strong>${currentLang()==="bn" ? "এলাকা" : "Area"}:</strong> ${escapeHtml(d.area)}</p>
      <p><strong>${currentLang()==="bn" ? "কন্টাক্ট" : "Contact"}:</strong> ${escapeHtml(d.phone)}</p>
      <p class="muted">${escapeHtml(d.note || "")}</p>
      <button class="btn danger" onclick="window.delDir('${escapeHtml(d.id)}')">${currentLang()==="bn" ? "ডিলিট" : "Delete"}</button>
    </div>
  `).join("");
}

window.delDir = (id) => {
  if (!isLoggedIn()) return showLock("");
  const list = AdminDirectoryStore.load().filter(x => x.id !== id);
  AdminDirectoryStore.save(list);
  renderDirectory();
};

/* Cases */
const caseListBox = document.getElementById("caseListBox");
const btnCaseExport = document.getElementById("btnCaseExport");
const btnClearCases = document.getElementById("btnClearCases");

function statusBn(status){
  const m = {
    "Imported":"ইমপোর্টেড",
    "In Progress":"চলমান",
    "Resolved":"সমাধান"
  };
  return m[status] || status;
}

function renderCases(){
  const list = AdminCasesStore.load();
  const langBn = currentLang() === "bn";

  if (!list.length){
    caseListBox.innerHTML = `<p class="muted">${langBn ? "এখনো কোনো কেস নেই।" : "No cases yet."}</p>`;
    return;
  }

  caseListBox.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>${langBn ? "রোগী" : "Patient"}</th>
          <th>${langBn ? "অবস্থান" : "Location"}</th>
          <th>${langBn ? "ধরন/জরুরি" : "Type/Urgency"}</th>
          <th>${langBn ? "ঝুঁকি" : "Danger"}</th>
          <th>${langBn ? "নোটস" : "Notes"}</th>
          <th>${langBn ? "অ্যাকশন" : "Actions"}</th>
        </tr>
      </thead>
      <tbody>
        ${list.map(c => `
          <tr>
            <td>
              <strong>${escapeHtml(c.name)}</strong><br/>
              <span class="small">${escapeHtml(c.when)}</span><br/>
              <span class="small"><strong>${langBn ? "স্ট্যাটাস" : "Status"}:</strong> ${escapeHtml(langBn ? statusBn(c.status || "Imported") : (c.status || "Imported"))}</span>
            </td>
            <td>${escapeHtml(c.loc)}</td>
            <td>${escapeHtml(c.type)}<br/><span class="badge">${escapeHtml(c.urg)}</span></td>
            <td class="small">${(c.danger||[]).map(escapeHtml).join(", ") || "None"}</td>
            <td class="small">${escapeHtml(c.rxNotes || "—")}</td>
            <td>
              <button class="btn" onclick="window.markCase('${escapeHtml(c.id)}','In Progress')">${langBn ? "চলমান" : "In Progress"}</button>
              <button class="btn" onclick="window.markCase('${escapeHtml(c.id)}','Resolved')">${langBn ? "সমাধান" : "Resolved"}</button>
              <button class="btn premium" onclick="window.addNote('${escapeHtml(c.id)}')">${langBn ? "নোট যোগ" : "Add Note"}</button>
              <button class="btn danger" onclick="window.delCase('${escapeHtml(c.id)}')">${langBn ? "ডিলিট" : "Delete"}</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

window.markCase = (id, status) => {
  if (!isLoggedIn()) return showLock("");
  const list = AdminCasesStore.load();
  const updated = list.map(c => c.id === id ? { ...c, status } : c);
  AdminCasesStore.save(updated);
  renderCases();
};

window.delCase = (id) => {
  if (!isLoggedIn()) return showLock("");
  const list = AdminCasesStore.load().filter(c => c.id !== id);
  AdminCasesStore.save(list);
  renderCases();
};

window.addNote = (id) => {
  if (!isLoggedIn()) return showLock("");
  const langBn = currentLang() === "bn";
  const note = prompt(langBn ? "নোট লিখুন:" : "Enter notes:");
  if (!note) return;

  const list = AdminCasesStore.load();
  const updated = list.map(c => c.id === id ? { ...c, rxNotes: note, updatedAt: new Date().toISOString() } : c);
  AdminCasesStore.save(updated);
  renderCases();
};

btnCaseExport.addEventListener("click", () => {
  if (!isLoggedIn()) return showLock("");
  const list = AdminCasesStore.load();
  downloadJson(`nedaashealthcare-cases-${new Date().toISOString().slice(0,10)}.json`, {
    exportedAt: new Date().toISOString(),
    cases: list
  });
});

btnClearCases.addEventListener("click", () => {
  if (!isLoggedIn()) return showLock("");
  if (!confirm(tr("msg.clearConfirm"))) return;
  AdminCasesStore.clear();
  renderCases();
});

/* Import/Export */
const btnImportCases = document.getElementById("btnImportCases");
const btnExportAll = document.getElementById("btnExportAll");
const fileInput = document.getElementById("fileInput");

btnImportCases.addEventListener("click", () => {
  if (!isLoggedIn()) return showLock("");
  fileInput.click();
});

fileInput.addEventListener("change", async (e) => {
  if (!isLoggedIn()) return showLock("");
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const text = await file.text();
  try{
    const obj = JSON.parse(text);
    const incoming = obj.requests || obj.cases || [];
    if (!Array.isArray(incoming)) throw new Error("Invalid JSON");

    const normalized = incoming.map(x => ({
      id: x.id || cryptoRandomId(),
      when: x.createdAt || x.when || "",
      name: x.patientName || x.name || "",
      age: x.patientAge || x.age || "",
      phone: x.patientPhone || x.phone || "",
      loc: x.patientLocation || x.loc || "",
      type: x.problemType || x.type || "",
      urg: x.urgency || x.urg || "Normal",
      danger: x.dangerSigns || x.danger || [],
      status: "Imported",
      rxNotes: x.rxNotes || ""
    }));

    const list = AdminCasesStore.load();
    AdminCasesStore.save([...normalized, ...list]);
    renderCases();
    alert(tr("msg.importOk"));
  } catch (err){
    console.error(err);
    alert(tr("msg.importFail"));
  } finally {
    fileInput.value = "";
  }
});

btnExportAll.addEventListener("click", () => {
  if (!isLoggedIn()) return showLock("");
  const dir = AdminDirectoryStore.load();
  const cases = AdminCasesStore.load();
  downloadJson(`nedaashealthcare-admin-db-${new Date().toISOString().slice(0,10)}.json`, {
    exportedAt: new Date().toISOString(),
    directory: dir,
    cases
  });
});

function cryptoRandomId(){
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,"0")).join("");
}
