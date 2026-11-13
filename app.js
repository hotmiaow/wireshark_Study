/**
 * Wireshark Sample Captures Portal - Application Logic
 * Supports English and Traditional Chinese (繁體中文) with 3-part diagnostic framework:
 * - What is Normal (正常狀態)
 * - What is the Issue (異常/問題現象)
 * - How to Diagnose & Where the Issue Is (如何檢查與排查問題)
 */

// State
let allCaptures = window.WIRESHARK_CAPTURES_DATA || [];
let situations = window.WIRESHARK_SITUATIONS || {};
let levels = window.WIRESHARK_LEVELS || {};
let tracks = window.WIRESHARK_TRACKS || [];

let currentLang = localStorage.getItem("wireshark_lang") || "zh-TW"; // default to Traditional Chinese as requested

let currentFilter = {
  search: "",
  level: "all",
  situation: "all",
  protocol: "all",
  track: "all",
  sort: "default"
};

let currentView = "cards"; // 'cards' | 'table'
let currentModalCapture = null;

// UI Translations Dictionary
const I18N = {
  "en": {
    brandBadge: "Official Wiki",
    brandSubtitle: "Classified by Mastery Level & Real-World Network Scenario",
    cheatSheetBtn: "Wireshark Cheat Sheet",
    heroTitle: "Packet Analysis Mastery Center",
    heroDesc: "Explore all <strong>623 curated sample captures</strong> from the official Wireshark Foundation Wiki. Every trace is classified by <strong>Mastery Level</strong> and grouped by <strong>Network Scenario</strong> with clear diagnostic guidance on: <em>What is normal, what is the issue, and how to diagnose it in Wireshark.</em>",
    metric1: "Curated Captures",
    metric2: "Beginner to Expert",
    metric3: "Real-World Domains",
    metric4: "Local Wiki Archive",
    tracksTitle: "Guided Learning Tracks",
    tracksSub: "Click any track to focus your study session",
    searchPlaceholder: "Search captures, protocols (e.g. DNS, BGP, SIP, Blaster, Modbus)...",
    allLevels: "All Mastery Levels",
    allSituations: "All Situations / Domains",
    allProtocols: "All Protocols",
    sortDefault: "Default Order",
    sortNameAsc: "Title (A to Z)",
    sortLevelAsc: "Level (Beginner First)",
    sortLevelDesc: "Level (Expert First)",
    sortSizeDesc: "File Size (Largest First)",
    sortSizeAsc: "File Size (Smallest First)",
    allSituationsPill: "All Situations",
    filtersLabel: "FILTERS:",
    clearAll: "Clear All",
    resultsShowing: "Showing {count} of {total} captures",
    resultsHint: "Click <strong>Study & Diagnose</strong> for deep inspection steps & filters",
    noMatches: "No capture files match your criteria",
    noMatchesSub: "Try clearing your search term or broadening your level/situation filters.",
    resetBtn: "Reset All Filters",
    getCapture: "Get .pcap",
    studyBtn: "Study & Diagnose",
    modalDomain: "DOMAIN SCENARIO & WIKI HIERARCHY",
    modalContext: "CAPTURE CONTEXT & DESCRIPTION",
    diagNormalTitle: "1. What is Normal / Expected Behavior",
    diagIssueTitle: "2. What is the Issue / Anomaly / Attack",
    diagCheckTitle: "3. How to Diagnose & Where to Check in Wireshark",
    modalFilterLabel: "RECOMMENDED DISPLAY FILTER",
    modalWiresharkCmd: "LAUNCH IN WIRESHARK (TERMINAL)",
    modalTsharkCmd: "QUICK INSPECTION VIA TSHARK",
    copyBtn: "Copy",
    copyFilterBtn: "Copy Filter",
    closeBtn: "Close",
    downloadBtn: "Download Capture File",
    tableId: "ID",
    tableTitle: "Title & Filename",
    tableLevel: "Level",
    tableSituation: "Situation",
    tableProtocols: "Protocols",
    tableFilter: "Display Filter",
    tableSize: "Size",
    tableActions: "Actions",
    exploreTrack: "Explore Track →",
    footerText: "Wireshark Sample Captures Portal • Cloned and categorized from the official Wireshark Foundation Wiki",
    footerPath: "Full offline archive saved locally at",
    cheatSheetTitle: "Wireshark Essential Cheat Sheet",
    cheatSheetSub: "Quick reference of high-frequency display filters, troubleshooting operators, and workflows",
    closeReference: "Close Reference"
  },
  "zh-TW": {
    brandBadge: "官方 Wiki 全收錄",
    brandSubtitle: "按技術難度與真實網路場景分類 • 深度故障排查與分析教學",
    cheatSheetBtn: "Wireshark 必備速查手冊",
    heroTitle: "Wireshark 封包深度研析實驗室",
    heroDesc: "收錄 Wireshark 官方 Wiki 全部 <strong>623 個經典封包樣本</strong> 與 <strong>1,379 個離線檔案</strong>。全站依據 <strong>4 大難度等級</strong> 與 <strong>11 種實戰情境</strong> 系統化整理，每一筆封包皆提供深入解析：<em>【什麼是正常狀態】、【什麼是異常/問題現象】、以及【如何精確定位與排查問題】。</em>",
    metric1: "官方精選樣本",
    metric2: "4 大難度等級",
    metric3: "11 種實戰領域",
    metric4: "1.1 GB 本地全典藏",
    tracksTitle: "實戰學習專題路徑 (Study Tracks)",
    tracksSub: "點選任一路徑立即進入系統化學習與情境演練",
    searchPlaceholder: "搜尋封包名稱、協議 (如 DNS, BGP, SIP, Blaster, Modbus, 零視窗)...",
    allLevels: "所有技術等級",
    allSituations: "所有實戰場景 / 領域",
    allProtocols: "所有通訊協定",
    sortDefault: "預設排序",
    sortNameAsc: "標題 (A 到 Z)",
    sortLevelAsc: "技術難度 (初級優先)",
    sortLevelDesc: "技術難度 (專家優先)",
    sortSizeDesc: "檔案大小 (由大到小)",
    sortSizeAsc: "檔案大小 (由小到大)",
    allSituationsPill: "全部場景",
    filtersLabel: "已選篩選條件：",
    clearAll: "清除全部",
    resultsShowing: "顯示 <strong>{count}</strong> / {total} 個封包",
    resultsHint: "點選 <strong>【深度研析與排查】</strong> 查看正常狀態、問題分析與 Wireshark 排查步驟",
    noMatches: "找不到符合條件的封包檔案",
    noMatchesSub: "請嘗試縮短搜尋關鍵字，或放寬技術等級與情境分類篩選。",
    resetBtn: "重設所有篩選",
    getCapture: "下載 .pcap",
    studyBtn: "深度研析與排查",
    modalDomain: "所屬網路場景與 Wiki 階層架構",
    modalContext: "封包背景脈絡與情境說明",
    diagNormalTitle: "1. 【正常狀態】標準通訊協定行為與預期回應",
    diagIssueTitle: "2. 【異常/問題現象】故障徵兆、連線停滯或攻擊特徵",
    diagCheckTitle: "3. 【如何檢查與排查】Wireshark 實戰步驟與關鍵定位點",
    modalFilterLabel: "建議使用之 Wireshark 顯示過濾器 (Display Filter)",
    modalWiresharkCmd: "終端機直接啟動 Wireshark GUI",
    modalTsharkCmd: "TShark 命令列快速排查指令",
    copyBtn: "複製",
    copyFilterBtn: "複製過濾器",
    closeBtn: "關閉視窗",
    downloadBtn: "下載封包檔案 (.pcap)",
    tableId: "編號",
    tableTitle: "標題與檔案名稱",
    tableLevel: "難度等級",
    tableSituation: "實戰領域",
    tableProtocols: "通訊協議",
    tableFilter: "建議過濾器",
    tableSize: "檔案大小",
    tableActions: "操作",
    exploreTrack: "進入專題學習 →",
    footerText: "Wireshark Sample Captures Portal • 完整下載自 Wireshark Foundation 官方 Wiki",
    footerPath: "完整本地離線資料夾路徑：",
    cheatSheetTitle: "Wireshark 必備速查手冊 (Essential Cheat Sheet)",
    cheatSheetSub: "高頻顯示過濾器、邏輯運算子、網路排查秘訣與內建分析工具導引",
    closeReference: "關閉速查手冊"
  }
};

// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const levelFilter = document.getElementById("levelFilter");
const situationFilter = document.getElementById("situationFilter");
const protocolFilter = document.getElementById("protocolFilter");
const sortSelect = document.getElementById("sortSelect");
const situationPills = document.getElementById("situationPills");
const activeFilters = document.getElementById("activeFilters");
const resultsCount = document.getElementById("resultsCount");
const resultsHint = document.getElementById("resultsHint");
const capturesContainer = document.getElementById("capturesContainer");
const viewCardsBtn = document.getElementById("viewCardsBtn");
const viewTableBtn = document.getElementById("viewTableBtn");
const tracksContainer = document.getElementById("tracksContainer");
const modalOverlay = document.getElementById("modalOverlay");
const cheatSheetOverlay = document.getElementById("cheatSheetOverlay");
const themeToggle = document.getElementById("themeToggle");
const langEnBtn = document.getElementById("langEnBtn");
const langZhBtn = document.getElementById("langZhBtn");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initProtocolDropdown();
  initSituationDropdown();
  initLevelDropdown();
  initSituationPills();
  initTracks();
  bindEvents();
  applyLanguageUI();
  renderCaptures();
});

function initTheme() {
  const savedTheme = localStorage.getItem("wireshark_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  if (themeToggle) {
    themeToggle.innerHTML = theme === "dark" 
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
}

function initLanguage() {
  if (langEnBtn && langZhBtn) {
    if (currentLang === "zh-TW") {
      langZhBtn.classList.add("active");
      langEnBtn.classList.remove("active");
    } else {
      langEnBtn.classList.add("active");
      langZhBtn.classList.remove("active");
    }
  }
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("wireshark_lang", lang);
  initLanguage();
  applyLanguageUI();
  initSituationDropdown();
  initLevelDropdown();
  initSituationPills();
  initTracks();
  renderCaptures();
}

function applyLanguageUI() {
  const t = I18N[currentLang] || I18N["zh-TW"];

  // Update static elements with data-i18n attributes
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) {
      el.innerHTML = t[key];
    }
  });

  if (searchInput) searchInput.placeholder = t.searchPlaceholder;
  if (resultsHint) resultsHint.innerHTML = t.resultsHint;
}

function initLevelDropdown() {
  if (!levelFilter) return;
  const isZh = currentLang === "zh-TW";
  const curVal = levelFilter.value;
  levelFilter.innerHTML = `
    <option value="all">${isZh ? "所有難度等級" : "All Mastery Levels"}</option>
    <option value="1">${isZh ? "第 1 級：初級入門 (Beginner)" : "Level 1: Beginner"}</option>
    <option value="2">${isZh ? "第 2 級：中級進階 (Intermediate)" : "Level 2: Intermediate"}</option>
    <option value="3">${isZh ? "第 3 級：高級專家 (Advanced)" : "Level 3: Advanced"}</option>
    <option value="4">${isZh ? "第 4 級：資深權威 (Expert)" : "Level 4: Expert"}</option>
  `;
  levelFilter.value = curVal || "all";
}

function initSituationDropdown() {
  if (!situationFilter) return;
  const isZh = currentLang === "zh-TW";
  const curVal = situationFilter.value;
  let html = `<option value="all">${isZh ? "所有實戰場景 / 領域" : "All Situations / Domains"}</option>`;
  Object.keys(situations).forEach(k => {
    const s = situations[k];
    const name = isZh ? (s.name_zh || s.name) : s.name;
    html += `<option value="${k}">${name}</option>`;
  });
  situationFilter.innerHTML = html;
  situationFilter.value = curVal || "all";
}

function initProtocolDropdown() {
  const protoCounts = {};
  allCaptures.forEach(c => {
    (c.protocols || []).forEach(p => {
      protoCounts[p] = (protoCounts[p] || 0) + 1;
    });
  });

  const sortedProtos = Object.keys(protoCounts).sort((a, b) => protoCounts[b] - protoCounts[a]);
  protocolFilter.innerHTML = `<option value="all">${currentLang === "zh-TW" ? "所有通訊協定" : "All Protocols"}</option>`;
  sortedProtos.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = `${p} (${protoCounts[p]})`;
    protocolFilter.appendChild(opt);
  });
}

function initSituationPills() {
  const isZh = currentLang === "zh-TW";
  const sitCounts = { all: allCaptures.length };
  allCaptures.forEach(c => {
    sitCounts[c.situation_id] = (sitCounts[c.situation_id] || 0) + 1;
  });

  situationPills.innerHTML = `
    <button class="pill-btn ${currentFilter.situation === 'all' ? 'active' : ''}" data-situation="all">
      ${isZh ? '全部場景' : 'All Situations'} <span class="pill-count">${allCaptures.length}</span>
    </button>
  `;

  Object.keys(situations).forEach(sitKey => {
    const sit = situations[sitKey];
    const count = sitCounts[sitKey] || 0;
    const btn = document.createElement("button");
    btn.className = `pill-btn ${currentFilter.situation === sitKey ? 'active' : ''}`;
    btn.dataset.situation = sitKey;
    const name = isZh ? (sit.name_zh || sit.name) : sit.name.split("&")[0].trim();
    btn.innerHTML = `${name} <span class="pill-count">${count}</span>`;
    btn.addEventListener("click", () => {
      setSituation(sitKey);
    });
    situationPills.appendChild(btn);
  });
}

function initTracks() {
  if (!tracksContainer) return;
  const isZh = currentLang === "zh-TW";
  const t = I18N[currentLang] || I18N["zh-TW"];

  tracksContainer.innerHTML = tracks.map(tr => {
    const title = isZh ? (tr.title_zh || tr.title) : tr.title;
    const desc = isZh ? (tr.description_zh || tr.description) : tr.description;
    const lvl = isZh ? (tr.level_zh || tr.level) : tr.level.split(":")[0];
    return `
      <div class="track-card ${currentFilter.track === tr.id ? 'active' : ''}" data-track-id="${tr.id}" onclick="selectTrack('${tr.id}')">
        <div>
          <div class="track-header">
            <div class="track-title">${title}</div>
            <span class="track-level-badge level-${tr.color}">${lvl}</span>
          </div>
          <div class="track-desc">${desc}</div>
        </div>
        <div class="track-footer">
          <span>${tr.captures.length} ${isZh ? '個經典封包' : 'Curated Captures'}</span>
          <span>${t.exploreTrack}</span>
        </div>
      </div>
    `;
  }).join("");
}

function selectTrack(trackId) {
  const selected = tracks.find(t => t.id === trackId);
  if (!selected) return;

  if (currentFilter.track === trackId) {
    currentFilter.track = "all";
  } else {
    currentFilter.track = trackId;
    currentFilter.level = "all";
    currentFilter.situation = "all";
    currentFilter.protocol = "all";
    currentFilter.search = "";
    if (searchInput) searchInput.value = "";
    if (levelFilter) levelFilter.value = "all";
    if (situationFilter) situationFilter.value = "all";
    if (protocolFilter) protocolFilter.value = "all";
  }

  document.querySelectorAll(".track-card").forEach(el => {
    if (el.dataset.trackId === currentFilter.track) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });

  renderCaptures();
}

function setSituation(sitKey) {
  currentFilter.situation = sitKey;
  if (situationFilter) situationFilter.value = sitKey;
  
  document.querySelectorAll(".pill-btn").forEach(b => {
    if (b.dataset.situation === sitKey) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });

  renderCaptures();
}

function bindEvents() {
  if (langEnBtn) langEnBtn.addEventListener("click", () => setLanguage("en"));
  if (langZhBtn) langZhBtn.addEventListener("click", () => setLanguage("zh-TW"));

  searchInput.addEventListener("input", (e) => {
    currentFilter.search = e.target.value.trim().toLowerCase();
    searchClear.style.display = currentFilter.search ? "block" : "none";
    renderCaptures();
  });

  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    currentFilter.search = "";
    searchClear.style.display = "none";
    renderCaptures();
  });

  levelFilter.addEventListener("change", (e) => {
    currentFilter.level = e.target.value;
    renderCaptures();
  });

  situationFilter.addEventListener("change", (e) => {
    setSituation(e.target.value);
  });

  protocolFilter.addEventListener("change", (e) => {
    currentFilter.protocol = e.target.value;
    renderCaptures();
  });

  sortSelect.addEventListener("change", (e) => {
    currentFilter.sort = e.target.value;
    renderCaptures();
  });

  viewCardsBtn.addEventListener("click", () => {
    currentView = "cards";
    viewCardsBtn.classList.add("active");
    viewTableBtn.classList.remove("active");
    renderCaptures();
  });

  viewTableBtn.addEventListener("click", () => {
    currentView = "table";
    viewTableBtn.classList.add("active");
    viewCardsBtn.classList.remove("active");
    renderCaptures();
  });

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("wireshark_theme", newTheme);
    updateThemeIcon(newTheme);
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  cheatSheetOverlay.addEventListener("click", (e) => {
    if (e.target === cheatSheetOverlay) closeCheatSheet();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeCheatSheet();
    }
  });
}

function getFilteredCaptures() {
  let list = allCaptures.filter(c => {
    if (currentFilter.track !== "all") {
      const activeTrack = tracks.find(t => t.id === currentFilter.track);
      if (activeTrack && !activeTrack.captures.includes(c.id)) {
        return false;
      }
    }

    if (currentFilter.level !== "all") {
      if (c.level !== parseInt(currentFilter.level, 10)) return false;
    }

    if (currentFilter.situation !== "all") {
      if (c.situation_id !== currentFilter.situation) return false;
    }

    if (currentFilter.protocol !== "all") {
      if (!(c.protocols || []).includes(currentFilter.protocol)) return false;
    }

    if (currentFilter.search) {
      const q = currentFilter.search;
      const match = 
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.title_zh && c.title_zh.toLowerCase().includes(q)) ||
        (c.filename && c.filename.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.description_zh && c.description_zh.toLowerCase().includes(q)) ||
        (c.display_filter && c.display_filter.toLowerCase().includes(q)) ||
        (c.normal_zh && c.normal_zh.toLowerCase().includes(q)) ||
        (c.issue_zh && c.issue_zh.toLowerCase().includes(q)) ||
        (c.diagnosis_zh && c.diagnosis_zh.toLowerCase().includes(q)) ||
        (c.protocols || []).some(p => p.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const isZh = currentLang === "zh-TW";
  if (currentFilter.sort === "name_asc") {
    list.sort((a, b) => {
      const tA = isZh ? (a.title_zh || a.title) : a.title;
      const tB = isZh ? (b.title_zh || b.title) : b.title;
      return tA.localeCompare(tB);
    });
  } else if (currentFilter.sort === "size_desc") {
    list.sort((a, b) => b.size_bytes - a.size_bytes);
  } else if (currentFilter.sort === "size_asc") {
    list.sort((a, b) => a.size_bytes - b.size_bytes);
  } else if (currentFilter.sort === "level_asc") {
    list.sort((a, b) => a.level - b.level);
  } else if (currentFilter.sort === "level_desc") {
    list.sort((a, b) => b.level - a.level);
  }

  return list;
}

function renderCaptures() {
  const filtered = getFilteredCaptures();
  const t = I18N[currentLang] || I18N["zh-TW"];
  renderActiveFilters();

  resultsCount.innerHTML = t.resultsShowing.replace("{count}", filtered.length).replace("{total}", allCaptures.length);

  if (filtered.length === 0) {
    capturesContainer.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:12px; opacity:0.5;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>${t.noMatches}</h3>
        <p>${t.noMatchesSub}</p>
        <button class="btn btn-primary" style="margin-top:16px;" onclick="resetAllFilters()">${t.resetBtn}</button>
      </div>
    `;
    return;
  }

  if (currentView === "cards") {
    renderCards(filtered);
  } else {
    renderTable(filtered);
  }
}

function renderActiveFilters() {
  const isZh = currentLang === "zh-TW";
  const t = I18N[currentLang] || I18N["zh-TW"];
  const tags = [];

  if (currentFilter.track !== "all") {
    const tr = tracks.find(x => x.id === currentFilter.track);
    if (tr) tags.push({ label: `${isZh ? '專題' : 'Track'}: ${isZh ? tr.title_zh : tr.title}`, clear: () => selectTrack(tr.id) });
  }
  if (currentFilter.level !== "all") {
    const l = levels[currentFilter.level];
    if (l) tags.push({ label: `${isZh ? '等級' : 'Level'}: ${isZh ? l.name_zh : l.name}`, clear: () => { currentFilter.level = "all"; levelFilter.value = "all"; renderCaptures(); } });
  }
  if (currentFilter.situation !== "all") {
    const s = situations[currentFilter.situation];
    if (s) tags.push({ label: `${isZh ? '場景' : 'Situation'}: ${isZh ? s.name_zh : s.name.split("&")[0].trim()}`, clear: () => setSituation("all") });
  }
  if (currentFilter.protocol !== "all") {
    tags.push({ label: `${isZh ? '協議' : 'Protocol'}: ${currentFilter.protocol}`, clear: () => { currentFilter.protocol = "all"; protocolFilter.value = "all"; renderCaptures(); } });
  }
  if (currentFilter.search) {
    tags.push({ label: `${isZh ? '關鍵字' : 'Search'}: "${currentFilter.search}"`, clear: () => { currentFilter.search = ""; searchInput.value = ""; searchClear.style.display = "none"; renderCaptures(); } });
  }

  if (tags.length === 0) {
    activeFilters.innerHTML = "";
    return;
  }

  activeFilters.innerHTML = `
    <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; font-weight:700;">${t.filtersLabel}</span>
    ${tags.map((tg, idx) => `
      <span class="filter-tag">
        ${escapeHtml(tg.label)}
        <span class="filter-tag-remove" onclick="clearFilterTag(${idx})">×</span>
      </span>
    `).join("")}
    <button class="btn btn-icon" style="height:26px; font-size:0.75rem; padding:0 8px;" onclick="resetAllFilters()">${t.clearAll}</button>
  `;

  window._activeTagClearers = tags.map(tg => tg.clear);
}

window.clearFilterTag = function(idx) {
  if (window._activeTagClearers && window._activeTagClearers[idx]) {
    window._activeTagClearers[idx]();
  }
};

window.resetAllFilters = function() {
  currentFilter = {
    search: "",
    level: "all",
    situation: "all",
    protocol: "all",
    track: "all",
    sort: "default"
  };
  if (searchInput) searchInput.value = "";
  if (searchClear) searchClear.style.display = "none";
  if (levelFilter) levelFilter.value = "all";
  if (situationFilter) situationFilter.value = "all";
  if (protocolFilter) protocolFilter.value = "all";
  if (sortSelect) sortSelect.value = "default";
  
  document.querySelectorAll(".pill-btn").forEach(b => {
    if (b.dataset.situation === "all") b.classList.add("active");
    else b.classList.remove("active");
  });

  document.querySelectorAll(".track-card").forEach(c => c.classList.remove("active"));
  renderCaptures();
};

function renderCards(list) {
  const isZh = currentLang === "zh-TW";
  const t = I18N[currentLang] || I18N["zh-TW"];

  capturesContainer.innerHTML = `
    <div class="captures-grid">
      ${list.map(c => {
        const title = isZh ? (c.title_zh || c.title) : c.title;
        const desc = isZh ? (c.description_zh || c.description) : c.description;
        const lvlBadge = isZh ? (levels[c.level]?.badge_zh || c.level_badge) : c.level_badge;

        return `
          <div class="capture-card">
            <div>
              <div class="card-top-bar">
                <span class="card-id-tag">${c.id}</span>
                <span class="level-badge level-${c.level_color}">${lvlBadge}</span>
              </div>
              
              <div class="card-title">${escapeHtml(title)}</div>
              <div class="card-filename">${escapeHtml(c.filename)}</div>
              
              <div class="card-protocols">
                ${(c.protocols || []).map(p => `<span class="proto-tag">${p}</span>`).join("")}
                <span class="proto-tag" style="color:var(--text-muted);">${c.format}</span>
              </div>

              <div class="card-desc">${escapeHtml(desc)}</div>

              <div class="filter-snippet">
                <span class="filter-code" title="${escapeHtml(c.display_filter)}">${escapeHtml(c.display_filter)}</span>
                <button class="btn-copy-sm" onclick="copyText('${escapeJs(c.display_filter)}', '${isZh ? '已複製過濾器！' : 'Copied filter!'}')" title="Copy filter">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>

            <div>
              <div class="card-footer">
                <div class="file-info">${c.size_formatted}</div>
                <div class="card-actions">
                  <a href="${c.relative_path}" download class="btn btn-sm" title="Download packet capture">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    ${t.getCapture}
                  </a>
                  <button class="btn btn-primary btn-sm" onclick="openModal('${c.id}')">
                    ${t.studyBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderTable(list) {
  const isZh = currentLang === "zh-TW";
  const t = I18N[currentLang] || I18N["zh-TW"];

  capturesContainer.innerHTML = `
    <div class="table-container">
      <table class="captures-table">
        <thead>
          <tr>
            <th>${t.tableId}</th>
            <th>${t.tableTitle}</th>
            <th>${t.tableLevel}</th>
            <th>${t.tableSituation}</th>
            <th>${t.tableProtocols}</th>
            <th>${t.tableFilter}</th>
            <th>${t.tableSize}</th>
            <th>${t.tableActions}</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(c => {
            const title = isZh ? (c.title_zh || c.title) : c.title;
            const sitName = isZh ? (situations[c.situation_id]?.name_zh || c.situation_name) : c.situation_name.split("&")[0].trim();
            const lvlBadge = isZh ? (levels[c.level]?.badge_zh || c.level_badge) : c.level_badge.split(":")[0];

            return `
              <tr>
                <td><span class="card-id-tag">${c.id}</span></td>
                <td>
                  <div style="font-weight:700; color:var(--text-primary);">${escapeHtml(title)}</div>
                  <div class="card-filename" style="margin:2px 0 0;">${escapeHtml(c.filename)}</div>
                </td>
                <td><span class="level-badge level-${c.level_color}">${lvlBadge}</span></td>
                <td style="color:var(--text-secondary); font-size:0.8rem;">${escapeHtml(sitName)}</td>
                <td>
                  <div style="display:flex; gap:4px; flex-wrap:wrap; max-width:140px;">
                    ${(c.protocols || []).slice(0, 3).map(p => `<span class="proto-tag">${p}</span>`).join("")}
                  </div>
                </td>
                <td>
                  <div class="filter-snippet" style="margin:0; padding:4px 8px; max-width:180px;">
                    <span class="filter-code">${escapeHtml(c.display_filter)}</span>
                    <button class="btn-copy-sm" onclick="copyText('${escapeJs(c.display_filter)}', '${isZh ? '已複製過濾器！' : 'Copied filter!'}')">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                </td>
                <td style="color:var(--text-muted); font-size:0.8rem; white-space:nowrap;">${c.size_formatted}</td>
                <td>
                  <div style="display:flex; gap:6px;">
                    <a href="${c.relative_path}" download class="btn btn-sm btn-icon" title="Download">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </a>
                    <button class="btn btn-sm btn-primary" onclick="openModal('${c.id}')">${isZh ? '研析' : 'Study'}</button>
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// Modal logic with 3-part diagnostic framework
window.openModal = function(capId) {
  const cap = allCaptures.find(c => c.id === capId);
  if (!cap) return;
  currentModalCapture = cap;

  const isZh = currentLang === "zh-TW";
  const t = I18N[currentLang] || I18N["zh-TW"];

  const title = isZh ? (cap.title_zh || cap.title) : cap.title;
  const desc = isZh ? (cap.description_zh || cap.description) : cap.description;
  const sitName = isZh ? (situations[cap.situation_id]?.name_zh || cap.situation_name) : cap.situation_name;
  const lvlBadge = isZh ? (levels[cap.level]?.badge_zh || cap.level_badge) : cap.level_badge;

  const normalText = isZh ? cap.normal_zh : cap.normal_en;
  const issueText = isZh ? cap.issue_zh : cap.issue_en;
  const checkText = isZh ? cap.diagnosis_zh : cap.diagnosis_en;

  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalId").textContent = cap.id;
  document.getElementById("modalBadge").className = `level-badge level-${cap.level_color}`;
  document.getElementById("modalBadge").textContent = lvlBadge;
  document.getElementById("modalFilename").textContent = cap.filename;
  document.getElementById("modalSituation").textContent = sitName;
  document.getElementById("modalHierarchy").textContent = cap.hierarchy;
  document.getElementById("modalFormat").textContent = `${cap.format} • ${cap.size_formatted}`;
  document.getElementById("modalDesc").textContent = desc;

  // 3-Part Diagnostic Cards
  document.getElementById("modalDiagNormal").textContent = normalText;
  document.getElementById("modalDiagIssue").textContent = issueText;
  document.getElementById("modalDiagCheck").textContent = checkText;

  document.getElementById("modalFilterCode").textContent = cap.display_filter;
  document.getElementById("modalTsharkCmd").textContent = cap.tshark_cmd;
  document.getElementById("modalWiresharkCmd").textContent = `wireshark "${cap.relative_path}" &`;
  
  const downloadBtn = document.getElementById("modalDownloadBtn");
  downloadBtn.href = cap.relative_path;
  downloadBtn.download = cap.filename;
  downloadBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    ${t.downloadBtn}
  `;

  modalOverlay.classList.add("open");
};

window.closeModal = function() {
  modalOverlay.classList.remove("open");
  currentModalCapture = null;
};

// Cheat Sheet Modal
window.openCheatSheet = function() {
  cheatSheetOverlay.classList.add("open");
};

window.closeCheatSheet = function() {
  cheatSheetOverlay.classList.remove("open");
};

// Copy helper with Toast
window.copyText = function(text, successMsg = null) {
  const isZh = currentLang === "zh-TW";
  const defaultMsg = isZh ? "已複製至剪貼簿！" : "Copied to clipboard!";
  const msg = successMsg || defaultMsg;

  navigator.clipboard.writeText(text).then(() => {
    showToast(msg);
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast(msg);
  });
};

function showToast(message) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${escapeHtml(message)}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.2s ease";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 200);
  }, 2200);
}

// Helpers
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJs(str) {
  if (!str) return "";
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"');
}
