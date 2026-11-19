const text = {
  zh: {
    refreshing: "正在刷新额度…",
    quotaReadFailed: "额度读取失败",
    waiting: "等待首次更新",
    updated: (time) => `已更新 ${time}`,
    fiveHourRemaining: "5小时剩余额度",
    weeklyRemaining: "7天剩余额度",
    fiveHour: "5小时",
    weekly: "7天",
    hideWidget: "隐藏小组件",
    showWidget: "显示小组件",
    refresh: "刷新额度",
    sourceLegend: "菜单栏百分比",
    minimalMode: "最简模式",
    autoLaunch: "开机自启动",
    refreshInterval: "刷新间隔",
    minutes: (value) => `${value} 分钟`,
    quit: "退出 ChatGPT Quota"
  },
  en: {
    refreshing: "Refreshing quota…",
    quotaReadFailed: "Quota read failed",
    waiting: "Waiting for first update",
    updated: (time) => `Updated ${time}`,
    fiveHourRemaining: "5-hour quota remaining",
    weeklyRemaining: "7-day quota remaining",
    fiveHour: "5 hours",
    weekly: "7 days",
    hideWidget: "Hide widget",
    showWidget: "Show widget",
    refresh: "Refresh quota",
    sourceLegend: "Menu bar percentage",
    minimalMode: "Minimal mode",
    autoLaunch: "Launch at startup",
    refreshInterval: "Refresh interval",
    minutes: (value) => `${value} minutes`,
    quit: "Quit ChatGPT Quota"
  }
};

const elements = {
  updatedText: document.getElementById("updatedText"),
  summaryLabel: document.getElementById("summaryLabel"),
  summaryPercent: document.getElementById("summaryPercent"),
  fiveHourPercent: document.getElementById("fiveHourPercent"),
  weeklyPercent: document.getElementById("weeklyPercent"),
  toggleWidgetBtn: document.getElementById("toggleWidgetBtn"),
  toggleWidgetText: document.getElementById("toggleWidgetText"),
  refreshBtn: document.getElementById("refreshBtn"),
  refreshText: document.getElementById("refreshText"),
  sourceLegend: document.getElementById("sourceLegend"),
  weeklySourceLabel: document.getElementById("weeklySourceLabel"),
  fiveHourSourceLabel: document.getElementById("fiveHourSourceLabel"),
  minimalModeInput: document.getElementById("minimalModeInput"),
  minimalModeLabel: document.getElementById("minimalModeLabel"),
  autoLaunchInput: document.getElementById("autoLaunchInput"),
  autoLaunchLabel: document.getElementById("autoLaunchLabel"),
  refreshIntervalInput: document.getElementById("refreshIntervalInput"),
  refreshIntervalLabel: document.getElementById("refreshIntervalLabel"),
  quitText: document.getElementById("quitText"),
  quotaSources: Array.from(document.querySelectorAll('input[name="quotaSource"]')),
  quitBtn: document.getElementById("quitBtn")
};

function formatPercent(windowInfo) {
  return Number.isFinite(windowInfo?.remainingPercent) ? `${windowInfo.remainingPercent}%` : "--%";
}

function formatUpdatedAt(quota, refreshing, language) {
  const words = text[language];
  if (refreshing) return words.refreshing;
  if (quota?.quotaError) return words.quotaReadFailed;
  const date = new Date(quota?.fetchedAt);
  if (!Number.isFinite(date.getTime())) return words.waiting;
  const time = new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
  return words.updated(time);
}

function render(state) {
  const language = state?.language === "en" ? "en" : "zh";
  const words = text[language];
  const quota = state?.quota;
  const source = state?.quotaSource === "fiveHour" ? "fiveHour" : "weekly";
  const selectedWindow = quota?.[source];

  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.body.dataset.refreshing = String(Boolean(state?.refreshing));
  elements.updatedText.textContent = formatUpdatedAt(quota, state?.refreshing, language);
  elements.summaryLabel.textContent = source === "fiveHour" ? words.fiveHourRemaining : words.weeklyRemaining;
  elements.summaryPercent.textContent = formatPercent(selectedWindow);
  elements.summaryPercent.dataset.level = window.WidgetLogic.getLevel(selectedWindow?.remainingPercent, null, false);
  elements.fiveHourPercent.textContent = `${words.fiveHour} ${formatPercent(quota?.fiveHour)}`;
  elements.weeklyPercent.textContent = `${words.weekly} ${formatPercent(quota?.weekly)}`;
  elements.toggleWidgetText.textContent = state?.widgetVisible ? words.hideWidget : words.showWidget;
  elements.refreshText.textContent = words.refresh;
  elements.sourceLegend.textContent = words.sourceLegend;
  elements.weeklySourceLabel.textContent = words.weekly;
  elements.fiveHourSourceLabel.textContent = words.fiveHour;
  elements.minimalModeInput.checked = Boolean(state?.minimalMode);
  elements.minimalModeLabel.textContent = words.minimalMode;
  elements.autoLaunchInput.checked = Boolean(state?.autoLaunch);
  elements.autoLaunchLabel.textContent = words.autoLaunch;
  elements.refreshIntervalLabel.textContent = words.refreshInterval;
  elements.refreshIntervalInput.setAttribute("aria-label", words.refreshInterval);
  elements.refreshIntervalInput.value = String(state?.refreshIntervalMinutes || 5);
  for (const option of elements.refreshIntervalInput.options) {
    option.textContent = words.minutes(Number(option.value));
  }
  elements.quitText.textContent = words.quit;
  for (const input of elements.quotaSources) input.checked = input.value === source;
}

async function performAction(action, value) {
  const nextState = await window.codexMenuBar.performAction(action, value);
  if (nextState) render(nextState);
}

elements.toggleWidgetBtn.addEventListener("click", () => performAction("toggle-widget"));
elements.refreshBtn.addEventListener("click", () => performAction("refresh"));
elements.quitBtn.addEventListener("click", () => performAction("quit"));
elements.minimalModeInput.addEventListener("change", () => performAction("set-minimal-mode", elements.minimalModeInput.checked));
elements.autoLaunchInput.addEventListener("change", () => performAction("set-auto-launch", elements.autoLaunchInput.checked));
elements.refreshIntervalInput.addEventListener("change", () => performAction("set-refresh-interval", Number(elements.refreshIntervalInput.value)));
for (const input of elements.quotaSources) {
  input.addEventListener("change", () => {
    if (input.checked) performAction("set-quota-source", input.value);
  });
}

window.codexMenuBar.onStateChanged(render);
window.codexMenuBar.getState().then(render);
