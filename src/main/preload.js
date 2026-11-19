const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("codexQuota", {
  getQuota: () => ipcRenderer.invoke("quota:get"),
  getRefreshIntervalMinutes: () => ipcRenderer.invoke("settings:refreshInterval:get"),
  setRefreshIntervalMinutes: (value) => ipcRenderer.invoke("settings:refreshInterval:set", value),
  setLanguage: (value) => ipcRenderer.invoke("settings:language:set", value),
  getMinimalMode: () => ipcRenderer.invoke("settings:minimalMode:get"),
  setMinimalMode: (value) => ipcRenderer.invoke("settings:minimalMode:set", value),
  minimize: () => ipcRenderer.invoke("window:minimize"),
  close: () => ipcRenderer.invoke("window:close"),
  getAlwaysOnTop: () => ipcRenderer.invoke("window:alwaysOnTop:get"),
  setAlwaysOnTop: (value) => ipcRenderer.invoke("window:alwaysOnTop:set", value),
  openCodex: () => ipcRenderer.invoke("external:openCodex"),
  onRefresh: (callback) => {
    ipcRenderer.on("quota:refresh", callback);
  },
  onAlwaysOnTopChanged: (callback) => {
    ipcRenderer.on("window:alwaysOnTopChanged", (_event, value) => callback(value));
  },
  onRefreshIntervalChanged: (callback) => {
    ipcRenderer.on("settings:refreshIntervalChanged", (_event, value) => callback(value));
  },
  onMinimalModeChanged: (callback) => {
    ipcRenderer.on("settings:minimalModeChanged", (_event, value) => callback(value));
  }
});
