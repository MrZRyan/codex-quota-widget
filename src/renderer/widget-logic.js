(function exposeWidgetLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.WidgetLogic = api;
})(typeof window !== "undefined" ? window : globalThis, () => {
  const DEFAULT_DISPLAY_SETTINGS = Object.freeze({
    showFiveHour: true,
    showWeekly: true,
    meterOneSource: "fiveHour",
    meterTwoSource: "weekly"
  });

  function normalizeDisplaySettings(value) {
    const settings = value && typeof value === "object" ? value : {};
    const fallbackMeterSource = settings.showLiquid === false ? "none" : null;
    return {
      showFiveHour: settings.showFiveHour !== false,
      showWeekly: settings.showWeekly !== false,
      meterOneSource: normalizeMeterSource(settings.meterOneSource, fallbackMeterSource || "fiveHour"),
      meterTwoSource: normalizeMeterSource(settings.meterTwoSource, fallbackMeterSource || "weekly")
    };
  }

  function normalizeMeterSource(value, fallback) {
    return ["none", "weekly", "fiveHour"].includes(value) ? value : fallback;
  }

  function getLevel(percent, error, loading) {
    if (loading) return "loading";
    if (error) return "error";
    if (typeof percent !== "number") return "unavailable";
    if (percent <= 0) return "empty";
    if (percent < 20) return "critical";
    if (percent < 40) return "warning";
    return "ready";
  }

  return { DEFAULT_DISPLAY_SETTINGS, normalizeDisplaySettings, getLevel };
});
