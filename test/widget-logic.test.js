const test = require("node:test");
const assert = require("node:assert/strict");
const { DEFAULT_DISPLAY_SETTINGS, normalizeDisplaySettings, getLevel } = require("../src/renderer/widget-logic");

test("display settings default to all quota visuals", () => {
  assert.deepEqual(normalizeDisplaySettings(null), DEFAULT_DISPLAY_SETTINGS);
});

test("display settings preserve hidden cards and meter sources", () => {
  assert.deepEqual(
    normalizeDisplaySettings({
      showFiveHour: false,
      showWeekly: false,
      showLiquid: false,
      meterOneSource: "none",
      meterTwoSource: "fiveHour",
      theme: "light",
      barOrientation: "horizontal",
      transparency: 35,
      positionLocked: true
    }),
    {
      showFiveHour: false,
      showWeekly: false,
      meterOneSource: "none",
      meterTwoSource: "fiveHour",
      theme: "light",
      barOrientation: "horizontal",
      transparency: 35,
      positionLocked: true
    }
  );
  assert.deepEqual(normalizeDisplaySettings({ showLiquid: false }), {
    ...DEFAULT_DISPLAY_SETTINGS,
    meterOneSource: "none",
    meterTwoSource: "none"
  });
});

test("quota thresholds are green at 40, amber from 20, and red below 20", () => {
  assert.equal(getLevel(undefined, null, false), "unavailable");
  assert.equal(getLevel(40, null, false), "ready");
  assert.equal(getLevel(39, null, false), "warning");
  assert.equal(getLevel(20, null, false), "warning");
  assert.equal(getLevel(19, null, false), "critical");
  assert.equal(getLevel(0, null, false), "empty");
});
