var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugin/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => DragNDropPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/features/entry/extension-factory.ts
var import_view2 = require("@codemirror/view");

// src/shared/dom-selectors.ts
var ROOT_EDITOR_CLASS = "dnd-root-editor";
var MAIN_EDITOR_CONTENT_CLASS = "dnd-main-content";
var CODEMIRROR_EDITOR_CLASS = "cm-editor";
var CODEMIRROR_EDITOR_SELECTOR = `.${CODEMIRROR_EDITOR_CLASS}`;
var CODEMIRROR_CONTENT_CLASS = "cm-content";
var CODEMIRROR_CONTENT_SELECTOR = `.${CODEMIRROR_CONTENT_CLASS}`;
var CODEMIRROR_LINE_SELECTOR = ".cm-line";
var CODEMIRROR_GUTTERS_CLASS = "cm-gutters";
var CODEMIRROR_GUTTERS_SELECTOR = `.${CODEMIRROR_GUTTERS_CLASS}`;
var CODEMIRROR_GUTTERS_BEFORE_CLASS = "cm-gutters-before";
var CODEMIRROR_GUTTERS_AFTER_CLASS = "cm-gutters-after";
var CODEMIRROR_AFTER_GUTTERS_SELECTOR = `.${CODEMIRROR_GUTTERS_CLASS}.${CODEMIRROR_GUTTERS_AFTER_CLASS}`;
var CODEMIRROR_GUTTER_CLASS = "cm-gutter";
var CODEMIRROR_GUTTER_SELECTOR = `.${CODEMIRROR_GUTTER_CLASS}`;
var CODEMIRROR_GUTTER_ELEMENT_CLASS = "cm-gutterElement";
var CODEMIRROR_GUTTER_ELEMENT_SELECTOR = `.${CODEMIRROR_GUTTER_ELEMENT_CLASS}`;
var CODEMIRROR_LINE_NUMBERS_CLASS = "cm-lineNumbers";
var CODEMIRROR_LINE_NUMBER_GUTTER_SELECTOR = `${CODEMIRROR_GUTTER_SELECTOR}.${CODEMIRROR_LINE_NUMBERS_CLASS}, .${CODEMIRROR_LINE_NUMBERS_CLASS}`;
var EMBED_ROOT_SELECTOR = ".cm-embed-block";
var EMBED_BLOCK_SELECTOR = ".cm-embed-block, .cm-callout, .cm-preview-code-block, .cm-math, .MathJax_Display, .callout, .MathJax, .mjx-container";
var TEXT_BLOCK_PROBE_SELECTOR = `${EMBED_BLOCK_SELECTOR}, ${CODEMIRROR_LINE_SELECTOR}`;
var TABLE_WIDGET_SELECTOR = ".cm-table-widget";
var DROP_INDICATOR_SELECTOR = ".dnd-drop-indicator";
var DROP_HIGHLIGHT_SELECTOR = ".dnd-drop-highlight";
var HIDDEN_CLASS = "dnd-hidden";
var DRAG_HANDLE_CLASS = "dnd-drag-handle";
var HANDLE_CORE_CLASS = "dnd-handle-core";
var LINE_HANDLE_CLASS = "dnd-line-handle";
var EMBED_HANDLE_CLASS = "dnd-embed-handle";
var HANDLE_GUTTER_CLASS = "cm-dnd-handle-gutter";
var HANDLE_GUTTER_MARKER_CLASS = "dnd-handle-gutter-marker";
var HANDLE_GUTTER_PROBE_CLASS = "dnd-handle-gutter-probe";
var DROP_INDICATOR_CLASS = "dnd-drop-indicator";
var DROP_HIGHLIGHT_CLASS = "dnd-drop-highlight";
var DRAG_GHOST_CLASS = "dnd-drag-ghost";
var DRAGGING_BODY_CLASS = "dnd-dragging";
var DRAG_SOURCE_LINE_CLASS = "dnd-drag-source-line";
var DRAG_SOURCE_LINE_SINGLE_CLASS = "dnd-drag-source-line-single";
var DRAG_SOURCE_LINE_FIRST_CLASS = "dnd-drag-source-line-first";
var DRAG_SOURCE_LINE_MIDDLE_CLASS = "dnd-drag-source-line-middle";
var DRAG_SOURCE_LINE_LAST_CLASS = "dnd-drag-source-line-last";
var DRAG_SOURCE_EMBED_CLASS = "dnd-drag-source-embed";
var RANGE_SELECTED_HANDLE_CLASS = "dnd-range-selected-handle";
var RANGE_SELECTION_LINK_CLASS = "dnd-range-selection-link";
var RANGE_SELECTION_DELETE_BUTTON_CLASS = "dnd-range-selection-delete-btn";
var MOBILE_GESTURE_LOCK_CLASS = "dnd-mobile-gesture-lock";

// src/features/state/drag-session.ts
var activeDragSourceByView = /* @__PURE__ */ new WeakMap();
var knownViewRefs = /* @__PURE__ */ new Set();
function setActiveDragSourceBlock(view, block) {
  if (block) {
    activeDragSourceByView.set(view, block);
    knownViewRefs.add(new WeakRef(view));
    return;
  }
  activeDragSourceByView.delete(view);
  removeWeakRef(knownViewRefs, view);
}
function getActiveDragSourceBlock(view) {
  var _a, _b, _c;
  if (view) {
    return (_a = activeDragSourceByView.get(view)) != null ? _a : null;
  }
  return (_c = (_b = getActiveDragSourceEntry()) == null ? void 0 : _b.block) != null ? _c : null;
}
function getActiveDragSourceView() {
  var _a, _b;
  return (_b = (_a = getActiveDragSourceEntry()) == null ? void 0 : _a.view) != null ? _b : null;
}
function getActiveDragSourceEntry() {
  for (const ref of knownViewRefs) {
    const view = ref.deref();
    if (!view) {
      knownViewRefs.delete(ref);
      continue;
    }
    const block = activeDragSourceByView.get(view);
    if (block) {
      return { view, block };
    }
  }
  return null;
}
function clearActiveDragSourceBlock(view) {
  activeDragSourceByView.delete(view);
  removeWeakRef(knownViewRefs, view);
}
function clearAllActiveDragSourceBlocks() {
  for (const ref of knownViewRefs) {
    const v = ref.deref();
    if (v)
      activeDragSourceByView.delete(v);
  }
  knownViewRefs.clear();
}
function removeWeakRef(set, target) {
  for (const ref of set) {
    const v = ref.deref();
    if (!v || v === target) {
      set.delete(ref);
    }
  }
}
function hideDropVisuals(scope = document) {
  scope.querySelectorAll(DROP_INDICATOR_SELECTOR).forEach((el) => {
    el.classList.add(HIDDEN_CLASS);
  });
  scope.querySelectorAll(DROP_HIGHLIGHT_SELECTOR).forEach((el) => {
    el.classList.add(HIDDEN_CLASS);
  });
}

// src/features/ui/probe/table-guard.ts
function isElementInsideRenderedTableCell(view, el) {
  if (!el)
    return false;
  if (!view.dom.contains(el))
    return false;
  const tableWidget = el.closest(TABLE_WIDGET_SELECTOR);
  if (!tableWidget || !view.dom.contains(tableWidget))
    return false;
  if (el.closest("td, th, .cm-table-cell, .table-cell-wrapper"))
    return true;
  if (el.closest(CODEMIRROR_LINE_SELECTOR))
    return true;
  return true;
}
function isPointInsideRenderedTableCell(view, x, y) {
  const rawEl = document.elementFromPoint(x, y);
  const el = rawEl instanceof HTMLElement ? rawEl : null;
  return isElementInsideRenderedTableCell(view, el);
}
function isPosInsideRenderedTableCell(view, pos, options) {
  const doc = view.state.doc;
  const safePos = Math.max(0, Math.min(pos, doc.length));
  try {
    const domAt = view.domAtPos(safePos);
    const node = domAt.node instanceof HTMLElement ? domAt.node : domAt.node.parentElement;
    if (isElementInsideRenderedTableCell(view, node))
      return true;
  } catch (e) {
  }
  if (options == null ? void 0 : options.skipLayoutRead)
    return false;
  let coords = null;
  try {
    coords = view.coordsAtPos(safePos);
  } catch (e) {
    return false;
  }
  if (!coords)
    return false;
  const editorRect = view.dom.getBoundingClientRect();
  const probeX = Math.min(Math.max(coords.left + 6, editorRect.left + 2), editorRect.right - 2);
  const probeY = Math.min(Math.max((coords.top + coords.bottom) / 2, editorRect.top + 2), editorRect.bottom - 2);
  return isPointInsideRenderedTableCell(view, probeX, probeY);
}

// src/core/block/block-types.ts
var BlockType = /* @__PURE__ */ ((BlockType2) => {
  BlockType2["Paragraph"] = "paragraph";
  BlockType2["Heading"] = "heading";
  BlockType2["ListItem"] = "list-item";
  BlockType2["CodeBlock"] = "code-block";
  BlockType2["Blockquote"] = "blockquote";
  BlockType2["Table"] = "table";
  BlockType2["MathBlock"] = "math-block";
  BlockType2["Callout"] = "callout";
  BlockType2["HorizontalRule"] = "hr";
  BlockType2["Unknown"] = "unknown";
  return BlockType2;
})(BlockType || {});

// src/core/block/block-guards.ts
function isHorizontalRuleLine(text) {
  if (!text)
    return false;
  const trimmed = text.trim();
  if (trimmed.length < 3)
    return false;
  return /^([-*_])(?:\s*\1){2,}$/.test(trimmed);
}
function isBlockquoteLine(text) {
  if (!text)
    return false;
  return /^(> ?)+/.test(text.trimStart());
}
function isCalloutLine(text) {
  if (!text)
    return false;
  return /^(\s*> ?)+\s*\[!/.test(text.trimStart());
}
function isTableLine(text) {
  if (!text)
    return false;
  return text.trimStart().startsWith("|");
}
function isMathFenceLine(text) {
  if (!text)
    return false;
  return text.trimStart().startsWith("$$");
}
function isCodeFenceLine(text) {
  if (!text)
    return false;
  return text.trimStart().startsWith("```");
}

// src/core/container-rules/insertion-rules.ts
var ALL_TYPES = Object.values(BlockType);
function rejectEntries(types, slot, reason) {
  return types.map((t2) => [`${t2}|${slot}`, reason]);
}
var REJECT_RULES = new Map([
  // inside_list: only ListItem allowed
  ...rejectEntries(
    ALL_TYPES.filter((t2) => t2 !== "list-item" /* ListItem */),
    "inside_list",
    "inside_list"
  ),
  // inside_quote_run: only Blockquote allowed (not Callout)
  ...rejectEntries(
    ALL_TYPES.filter((t2) => t2 !== "blockquote" /* Blockquote */),
    "inside_quote_run",
    "inside_quote_run"
  ),
  // quote_before: Callout blocked
  ...rejectEntries(["callout" /* Callout */], "quote_before", "quote_boundary"),
  // quote_after: only Blockquote allowed
  ...rejectEntries(
    ALL_TYPES.filter((t2) => t2 !== "blockquote" /* Blockquote */),
    "quote_after",
    "quote_boundary"
  ),
  // callout_after, table_before, hr_before: block ALL source types
  ...rejectEntries(ALL_TYPES, "callout_after", "callout_after"),
  ...rejectEntries(ALL_TYPES, "table_before", "table_before"),
  ...rejectEntries(ALL_TYPES, "hr_before", "hr_before")
]);
function resolveInsertionRule(input) {
  var _a;
  const key = `${input.sourceType}|${input.slotContext}`;
  const rejectReason = (_a = REJECT_RULES.get(key)) != null ? _a : null;
  return {
    allowDrop: rejectReason === null,
    rejectReason
  };
}

// src/core/parser/line-map.ts
var import_state = require("@codemirror/state");

// src/core/parser/line-parser.ts
function getIndentWidthFromIndentRaw(indentRaw, tabSize) {
  const safeTabSize2 = tabSize > 0 ? tabSize : 4;
  let width = 0;
  for (const ch of indentRaw) {
    width += ch === "	" ? safeTabSize2 : 1;
  }
  return width;
}
function splitBlockquotePrefix(line) {
  const match = line.match(/^(\s*> ?)+/);
  if (!match)
    return { prefix: "", rest: line };
  return { prefix: match[0], rest: line.slice(match[0].length) };
}
function getBlockquoteDepthFromLine(line) {
  const match = line.match(/^(\s*> ?)+/);
  if (!match)
    return 0;
  const prefix = match[0];
  return (prefix.match(/>/g) || []).length;
}
function parseListLine(line, tabSize) {
  const indentMatch = line.match(/^(\s*)/);
  const indentRaw = indentMatch ? indentMatch[1] : "";
  const indentWidth = getIndentWidthFromIndentRaw(indentRaw, tabSize);
  const rest = line.slice(indentRaw.length);
  const taskMatch = rest.match(/^([-*+])\s\[[ xX]\]\s+/);
  if (taskMatch) {
    const marker = taskMatch[0];
    return { isListItem: true, indentRaw, indentWidth, marker, markerType: "task", content: rest.slice(marker.length) };
  }
  const unorderedMatch = rest.match(/^([-*+])\s+/);
  if (unorderedMatch) {
    const marker = unorderedMatch[0];
    return { isListItem: true, indentRaw, indentWidth, marker, markerType: "unordered", content: rest.slice(marker.length) };
  }
  const orderedMatch = rest.match(/^(\d+)[.)]\s+/);
  if (orderedMatch) {
    const marker = orderedMatch[0];
    return { isListItem: true, indentRaw, indentWidth, marker, markerType: "ordered", content: rest.slice(marker.length) };
  }
  return { isListItem: false, indentRaw, indentWidth, marker: "", markerType: "unordered", content: rest };
}
function parseLineWithQuote(line, tabSize) {
  const quoteInfo = splitBlockquotePrefix(line);
  const parsed = parseListLine(quoteInfo.rest, tabSize);
  return {
    text: line,
    quotePrefix: quoteInfo.prefix,
    quoteDepth: getBlockquoteDepthFromLine(line),
    rest: quoteInfo.rest,
    isListItem: parsed.isListItem,
    indentRaw: parsed.indentRaw,
    indentWidth: parsed.indentWidth,
    marker: parsed.marker,
    markerType: parsed.markerType,
    content: parsed.content
  };
}

// src/shared/utils/timing.ts
function nowMs() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

// src/core/parser/indent-helpers.ts
function buildIndentStringFromSample(sample, width, tabSize) {
  const safeWidth = Math.max(0, width);
  if (safeWidth === 0)
    return "";
  if (sample.includes("	")) {
    const tabs = Math.max(0, Math.floor(safeWidth / tabSize));
    const spaces = Math.max(0, safeWidth - tabs * tabSize);
    return "	".repeat(tabs) + " ".repeat(spaces);
  }
  return " ".repeat(safeWidth);
}
function getIndentUnitWidth(sample, tabSize) {
  if (sample.includes("	"))
    return tabSize;
  if (sample.length >= tabSize)
    return tabSize;
  return sample.length > 0 ? sample.length : tabSize;
}

// src/core/parser/indent-calculator.ts
var indentUnitWidthCache = /* @__PURE__ */ new WeakMap();
function normalizeTabSize(tabSize) {
  const safe = tabSize != null ? tabSize : 4;
  return safe > 0 ? safe : 4;
}
function parseLineWithQuote2(line, tabSize) {
  return parseLineWithQuote(line, normalizeTabSize(tabSize));
}
function getIndentUnitWidthFromDoc(doc, parseLine, fallbackTabSize) {
  let best = Number.POSITIVE_INFINITY;
  let prevIndent = null;
  for (let i = 1; i <= doc.lines; i++) {
    const text = doc.line(i).text;
    const parsed = parseLine(text);
    if (!parsed.isListItem)
      continue;
    if (prevIndent !== null && parsed.indentWidth > prevIndent) {
      const delta = parsed.indentWidth - prevIndent;
      if (delta > 0 && delta < best)
        best = delta;
    }
    prevIndent = parsed.indentWidth;
  }
  if (!isFinite(best)) {
    return normalizeTabSize(fallbackTabSize);
  }
  return Math.max(2, best);
}
function getIndentUnitWidthForDoc(doc, parseLine, fallbackTabSize) {
  if (doc && typeof doc === "object") {
    const cached = indentUnitWidthCache.get(doc);
    if (typeof cached === "number") {
      return cached;
    }
  }
  const fromDoc = getIndentUnitWidthFromDoc(doc, parseLine, fallbackTabSize);
  const resolved = typeof fromDoc === "number" ? fromDoc : normalizeTabSize(fallbackTabSize);
  if (doc && typeof doc === "object") {
    indentUnitWidthCache.set(doc, resolved);
  }
  return resolved;
}
function buildIndentStringFromSample2(sample, width, tabSize) {
  return buildIndentStringFromSample(sample, width, normalizeTabSize(tabSize));
}
function getIndentUnitWidth2(sample, tabSize) {
  return getIndentUnitWidth(sample, normalizeTabSize(tabSize));
}

// src/core/parser/line-map.ts
var lineMapPerfRecorder = null;
var lineMapCache = /* @__PURE__ */ new WeakMap();
var EMPTY_LINE_META = {
  isEmpty: true,
  isList: false,
  isQuote: false,
  isCallout: false,
  isTable: false,
  isHr: false,
  indentWidth: 0,
  quoteDepth: 0
};
function recordLineMapPerf(key, durationMs) {
  if (!lineMapPerfRecorder)
    return;
  if (!isFinite(durationMs) || durationMs < 0)
    return;
  lineMapPerfRecorder(key, durationMs);
}
function setLineMapPerfRecorder(recorder) {
  lineMapPerfRecorder = recorder;
}
function resolveStateTabSize(state) {
  if (!state || typeof state !== "object")
    return 4;
  try {
    const withFacet = state;
    if (typeof withFacet.facet === "function") {
      return normalizeTabSize(withFacet.facet(import_state.EditorState.tabSize));
    }
  } catch (e) {
  }
  return 4;
}
function createLineMetaFromText(text, tabSize) {
  const parsed = parseLineWithQuote(text, tabSize);
  const isEmpty = text.trim().length === 0;
  return {
    isEmpty,
    isList: parsed.isListItem,
    isQuote: parsed.quoteDepth > 0,
    isCallout: isCalloutLine(text),
    isTable: text.trimStart().startsWith("|"),
    isHr: isHorizontalRuleLine(text),
    indentWidth: parsed.indentWidth,
    quoteDepth: parsed.quoteDepth
  };
}
function createLineMetaArray(doc, tabSize) {
  var _a;
  const lineMeta = new Array(doc.lines + 1);
  lineMeta[0] = EMPTY_LINE_META;
  for (let i = 1; i <= doc.lines; i++) {
    lineMeta[i] = createLineMetaFromText((_a = doc.line(i).text) != null ? _a : "", tabSize);
  }
  return lineMeta;
}
function buildLineMapIndexes(lineMeta, totalLines) {
  var _a, _b, _c;
  const prevNonEmpty = new Int32Array(totalLines + 2);
  const nextNonEmpty = new Int32Array(totalLines + 2);
  const prevListLine = new Int32Array(totalLines + 2);
  const listParentLine = new Int32Array(totalLines + 2);
  const listSubtreeEndLine = new Int32Array(totalLines + 2);
  let previous = 0;
  let previousList = 0;
  const listStack = [];
  for (let i = 1; i <= totalLines; i++) {
    const meta = (_a = lineMeta[i]) != null ? _a : EMPTY_LINE_META;
    if (!meta.isEmpty) {
      previous = i;
    }
    prevNonEmpty[i] = previous;
    if (meta.isEmpty) {
      prevListLine[i] = previousList;
      continue;
    }
    while (listStack.length > 0) {
      const topLine = listStack[listStack.length - 1];
      const topMeta = (_b = lineMeta[topLine]) != null ? _b : EMPTY_LINE_META;
      if (meta.indentWidth > topMeta.indentWidth) {
        break;
      }
      listStack.pop();
    }
    for (const ancestorLine of listStack) {
      listSubtreeEndLine[ancestorLine] = i;
    }
    prevListLine[i] = previousList;
    if (!meta.isList) {
      continue;
    }
    listParentLine[i] = listStack.length > 0 ? listStack[listStack.length - 1] : 0;
    listSubtreeEndLine[i] = i;
    listStack.push(i);
    previousList = i;
  }
  let next = 0;
  for (let i = totalLines; i >= 1; i--) {
    const meta = (_c = lineMeta[i]) != null ? _c : EMPTY_LINE_META;
    if (!meta.isEmpty) {
      next = i;
    }
    nextNonEmpty[i] = next;
  }
  return {
    prevNonEmpty,
    nextNonEmpty,
    prevListLine,
    listParentLine,
    listSubtreeEndLine
  };
}
function createLineMapFromMeta(doc, tabSize, lineMeta) {
  const indexes = buildLineMapIndexes(lineMeta, doc.lines);
  return {
    doc,
    lineMeta,
    prevNonEmpty: indexes.prevNonEmpty,
    nextNonEmpty: indexes.nextNonEmpty,
    prevListLine: indexes.prevListLine,
    listParentLine: indexes.listParentLine,
    listSubtreeEndLine: indexes.listSubtreeEndLine,
    tabSize
  };
}
function buildLineMap(state, options) {
  var _a;
  const doc = state.doc;
  const tabSize = normalizeTabSize((_a = options == null ? void 0 : options.tabSize) != null ? _a : resolveStateTabSize(state));
  const lineMeta = createLineMetaArray(doc, tabSize);
  return createLineMapFromMeta(doc, tabSize, lineMeta);
}
function getCachedLineMapForDoc(doc, tabSize) {
  var _a, _b;
  if (!doc || typeof doc !== "object")
    return null;
  return (_b = (_a = lineMapCache.get(doc)) == null ? void 0 : _a.get(tabSize)) != null ? _b : null;
}
function setCachedLineMapForDoc(doc, tabSize, lineMap) {
  const byTabSize = lineMapCache.get(doc);
  if (byTabSize) {
    byTabSize.set(tabSize, lineMap);
    return;
  }
  lineMapCache.set(doc, /* @__PURE__ */ new Map([[tabSize, lineMap]]));
}
function getLineMap(state, options) {
  var _a;
  const startedAt = nowMs();
  const tabSize = normalizeTabSize((_a = options == null ? void 0 : options.tabSize) != null ? _a : resolveStateTabSize(state));
  if (!state || typeof state !== "object") {
    const buildStartedAt2 = nowMs();
    const built2 = buildLineMap(state, { tabSize });
    recordLineMapPerf("line_map_build", nowMs() - buildStartedAt2);
    recordLineMapPerf("line_map_get", nowMs() - startedAt);
    return built2;
  }
  const doc = state.doc;
  if (!doc || typeof doc !== "object") {
    const buildStartedAt2 = nowMs();
    const built2 = buildLineMap(state, { tabSize });
    recordLineMapPerf("line_map_build", nowMs() - buildStartedAt2);
    recordLineMapPerf("line_map_get", nowMs() - startedAt);
    return built2;
  }
  const cached = getCachedLineMapForDoc(doc, tabSize);
  if (cached) {
    recordLineMapPerf("line_map_get", nowMs() - startedAt);
    return cached;
  }
  const buildStartedAt = nowMs();
  const built = buildLineMap(state, { tabSize });
  recordLineMapPerf("line_map_build", nowMs() - buildStartedAt);
  setCachedLineMapForDoc(doc, tabSize, built);
  recordLineMapPerf("line_map_get", nowMs() - startedAt);
  return built;
}
function peekCachedLineMap(state, options) {
  var _a;
  const tabSize = normalizeTabSize((_a = options == null ? void 0 : options.tabSize) != null ? _a : resolveStateTabSize(state));
  if (!state || typeof state !== "object")
    return null;
  const doc = state.doc;
  if (!doc || typeof doc !== "object")
    return null;
  return getCachedLineMapForDoc(doc, tabSize);
}
function getLineMetaAt(lineMap, lineNumber) {
  var _a;
  if (lineNumber < 1 || lineNumber >= lineMap.lineMeta.length)
    return null;
  return (_a = lineMap.lineMeta[lineNumber]) != null ? _a : null;
}
function getNearestListLineAtOrBefore(lineMap, lineNumber) {
  if (lineMap.doc.lines <= 0)
    return null;
  const clamped = Math.max(1, Math.min(lineMap.doc.lines, lineNumber));
  const meta = getLineMetaAt(lineMap, clamped);
  if (meta == null ? void 0 : meta.isList)
    return clamped;
  const prevListLine = lineMap.prevListLine[clamped];
  return prevListLine > 0 ? prevListLine : null;
}

// src/core/mutation/list-mutation.ts
function getListContext(doc, lineNumber, parseLineWithQuote3) {
  return getListContextNearLine(doc, lineNumber, parseLineWithQuote3);
}
function parseListContextFromLine(doc, lineNumber, parseLineWithQuote3) {
  if (lineNumber < 1 || lineNumber > doc.lines) {
    return { context: null, isBlank: true, isList: false };
  }
  const text = doc.line(lineNumber).text;
  const isBlank = text.trim().length === 0;
  const parsed = parseLineWithQuote3(text);
  if (!parsed.isListItem) {
    return { context: null, isBlank, isList: false };
  }
  return {
    context: {
      indentWidth: parsed.indentWidth,
      indentRaw: parsed.indentRaw,
      markerType: parsed.markerType
    },
    isBlank,
    isList: true
  };
}
function getListContextNearLine(doc, lineNumber, parseLineWithQuote3, options) {
  var _a, _b, _c, _d;
  const scanUp = Math.max(0, (_a = options == null ? void 0 : options.scanUp) != null ? _a : 8);
  const scanDown = Math.max(0, (_b = options == null ? void 0 : options.scanDown) != null ? _b : 3);
  const skipBlankLines = (_c = options == null ? void 0 : options.skipBlankLines) != null ? _c : true;
  const stopAtNonListContent = (_d = options == null ? void 0 : options.stopAtNonListContent) != null ? _d : true;
  const current = parseListContextFromLine(doc, lineNumber, parseLineWithQuote3);
  if (current.context)
    return current.context;
  if (!skipBlankLines && current.isBlank)
    return null;
  let stopUp = false;
  let stopDown = false;
  for (let distance = 1; distance <= Math.max(scanUp, scanDown); distance++) {
    if (!stopUp && distance <= scanUp) {
      const upLineNumber = lineNumber - distance;
      if (upLineNumber >= 1) {
        const up = parseListContextFromLine(doc, upLineNumber, parseLineWithQuote3);
        if (up.context)
          return up.context;
        if (!up.isBlank && !up.isList && stopAtNonListContent) {
          stopUp = true;
        }
      }
    }
    if (!stopDown && distance <= scanDown) {
      const downLineNumber = lineNumber + distance;
      if (downLineNumber <= doc.lines) {
        const down = parseListContextFromLine(doc, downLineNumber, parseLineWithQuote3);
        if (down.context)
          return down.context;
        if (!down.isBlank && !down.isList && stopAtNonListContent) {
          stopDown = true;
        }
      }
    }
    if (stopUp && stopDown)
      break;
  }
  return null;
}
function getSourceListBase(lines, parseLineWithQuote3) {
  for (const line of lines) {
    const parsed = parseLineWithQuote3(line);
    if (parsed.isListItem) {
      return { indentWidth: parsed.indentWidth, indentRaw: parsed.indentRaw };
    }
  }
  return null;
}
function computeListIndentPlan(params) {
  const {
    doc,
    sourceBase,
    targetLineNumber,
    parseLineWithQuote: parseLineWithQuote3,
    getIndentUnitWidth: getIndentUnitWidthFn,
    getListContext: getListContextFn,
    listContextLineNumberOverride,
    listIndentDeltaOverride,
    listTargetIndentWidthOverride
  } = params;
  const listContextLineNumber = listContextLineNumberOverride != null ? listContextLineNumberOverride : targetLineNumber;
  const targetContext = getListContextFn ? getListContextFn(doc, listContextLineNumber) : getListContextNearLine(doc, listContextLineNumber, parseLineWithQuote3);
  const indentSample = targetContext ? targetContext.indentRaw : sourceBase.indentRaw;
  const indentUnitWidth = getIndentUnitWidthFn(indentSample || sourceBase.indentRaw);
  const indentDeltaBase = (targetContext ? targetContext.indentWidth : 0) - sourceBase.indentWidth;
  let indentDelta = indentDeltaBase + (listIndentDeltaOverride != null ? listIndentDeltaOverride : 0) * indentUnitWidth;
  if (typeof listTargetIndentWidthOverride === "number") {
    indentDelta = listTargetIndentWidthOverride - sourceBase.indentWidth;
  }
  return {
    listContextLineNumber,
    targetContext,
    indentSample,
    indentUnitWidth,
    indentDelta,
    targetIndentWidth: sourceBase.indentWidth + indentDelta,
    sourceBaseIndentWidth: sourceBase.indentWidth
  };
}
function adjustListToTargetContext(params) {
  const {
    doc,
    sourceContent,
    targetLineNumber,
    parseLineWithQuote: parseLineWithQuote3,
    getIndentUnitWidth: getIndentUnitWidthFn,
    buildIndentStringFromSample: buildIndentStringFromSampleFn,
    buildTargetMarker: buildTargetMarkerFn,
    markerConversionScope,
    getListContext: getListContextFn,
    listContextLineNumberOverride,
    listIndentDeltaOverride,
    listTargetIndentWidthOverride
  } = params;
  const lines = sourceContent.split("\n");
  const sourceBase = getSourceListBase(lines, parseLineWithQuote3);
  if (!sourceBase)
    return sourceContent;
  const indentPlan = computeListIndentPlan({
    doc,
    sourceBase,
    targetLineNumber,
    parseLineWithQuote: parseLineWithQuote3,
    getIndentUnitWidth: getIndentUnitWidthFn,
    getListContext: getListContextFn,
    listContextLineNumberOverride,
    listIndentDeltaOverride,
    listTargetIndentWidthOverride
  });
  const markerScope = markerConversionScope != null ? markerConversionScope : "root";
  const quoteAdjustedLines = lines.map((line) => {
    if (line.trim().length === 0)
      return line;
    const parsed = parseLineWithQuote3(line);
    const rest = parsed.rest;
    if (!parsed.isListItem) {
      if (parsed.indentWidth >= sourceBase.indentWidth) {
        const newIndent2 = buildIndentStringFromSampleFn(
          indentPlan.indentSample,
          parsed.indentWidth + indentPlan.indentDelta
        );
        return `${parsed.quotePrefix}${newIndent2}${rest.slice(parsed.indentRaw.length)}`;
      }
      return line;
    }
    const newIndent = buildIndentStringFromSampleFn(
      indentPlan.indentSample,
      parsed.indentWidth + indentPlan.indentDelta
    );
    let marker = parsed.marker;
    const shouldConvertMarker = markerScope === "none" ? false : markerScope === "all" ? !!indentPlan.targetContext : !!indentPlan.targetContext && parsed.indentWidth === sourceBase.indentWidth;
    if (shouldConvertMarker && indentPlan.targetContext) {
      marker = buildTargetMarkerFn(indentPlan.targetContext, parsed);
    }
    return `${parsed.quotePrefix}${newIndent}${marker}${parsed.content}`;
  });
  return quoteAdjustedLines.join("\n");
}

// src/shared/utils/line-range.ts
function normalizeLineRange(docLines, startLineNumber, endLineNumber) {
  const safeStart = Math.max(1, Math.min(docLines, Math.min(startLineNumber, endLineNumber)));
  const safeEnd = Math.max(1, Math.min(docLines, Math.max(startLineNumber, endLineNumber)));
  return {
    startLineNumber: safeStart,
    endLineNumber: safeEnd
  };
}
function mergeLineRanges(docLines, ranges) {
  const normalized = ranges.map((range) => normalizeLineRange(docLines, range.startLineNumber, range.endLineNumber)).sort((a, b) => a.startLineNumber - b.startLineNumber);
  const merged = [];
  for (const range of normalized) {
    const last = merged[merged.length - 1];
    if (!last || range.startLineNumber > last.endLineNumber + 1) {
      merged.push({ ...range });
      continue;
    }
    if (range.endLineNumber > last.endLineNumber) {
      last.endLineNumber = range.endLineNumber;
    }
  }
  return merged;
}
function isLineNumberInRanges(lineNumber, ranges) {
  for (const range of ranges) {
    if (lineNumber >= range.startLineNumber && lineNumber <= range.endLineNumber) {
      return true;
    }
  }
  return false;
}

// src/shared/utils/composite-selection.ts
function normalizeCompositeRanges(ranges, totalLines) {
  if (totalLines <= 0) {
    return [];
  }
  const lineRanges = ranges.map((range) => ({
    startLineNumber: range.startLine + 1,
    endLineNumber: range.endLine + 1
  }));
  return mergeLineRanges(totalLines, lineRanges).map((range) => ({
    startLine: range.startLineNumber - 1,
    endLine: range.endLineNumber - 1
  }));
}

// src/core/container-rules/drop-validation.ts
function validateInPlaceDrop(params) {
  var _a, _b, _c;
  const {
    doc,
    sourceBlock,
    targetLineNumber,
    parseLineWithQuote: parseLineWithQuote3,
    getListContext: getListContext2,
    getIndentUnitWidth: getIndentUnitWidth3,
    slotContext,
    lineMap,
    listContextLineNumberOverride,
    listIndentDeltaOverride,
    listTargetIndentWidthOverride
  } = params;
  if (typeof slotContext === "string") {
    const containerRule = resolveInsertionRule({
      sourceType: sourceBlock.type,
      slotContext
    });
    if (!containerRule.allowDrop) {
      return {
        inSelfRange: false,
        allowInPlaceIndentChange: false,
        rejectReason: (_a = containerRule.rejectReason) != null ? _a : "container_policy"
      };
    }
  }
  const targetLineIdx = targetLineNumber - 1;
  const compositeRanges = normalizeCompositeRanges(
    (_c = (_b = sourceBlock.compositeSelection) == null ? void 0 : _b.ranges) != null ? _c : [],
    doc.lines
  );
  const hasCompositeSelection = compositeRanges.length > 1;
  const effectiveSourceRange = compositeRanges.length === 1 ? compositeRanges[0] : {
    startLine: sourceBlock.startLine,
    endLine: sourceBlock.endLine
  };
  const inSelfRange = hasCompositeSelection ? compositeRanges.some((range) => {
    const start = Math.min(range.startLine, range.endLine);
    const end = Math.max(range.startLine, range.endLine);
    return targetLineIdx >= start && targetLineIdx <= end;
  }) : targetLineIdx >= effectiveSourceRange.startLine && targetLineIdx <= effectiveSourceRange.endLine + 1;
  if (!inSelfRange) {
    return { inSelfRange: false, allowInPlaceIndentChange: false };
  }
  if (hasCompositeSelection) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_range_blocked"
    };
  }
  const hasListIntent = listTargetIndentWidthOverride !== void 0 || listIndentDeltaOverride !== void 0;
  if (!hasListIntent) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_range_blocked"
    };
  }
  const sourceLineNumber = effectiveSourceRange.startLine + 1;
  const sourceLineMeta = lineMap ? getLineMetaAt(lineMap, sourceLineNumber) : null;
  if (sourceLineMeta && !sourceLineMeta.isList) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_range_blocked"
    };
  }
  const sourceLineText = doc.line(sourceLineNumber).text;
  const sourceParsed = parseLineWithQuote3(sourceLineText);
  if (!sourceParsed.isListItem) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_range_blocked"
    };
  }
  const indentPlan = computeListIndentPlan({
    doc,
    sourceBase: {
      indentWidth: sourceParsed.indentWidth,
      indentRaw: sourceParsed.indentRaw
    },
    targetLineNumber,
    parseLineWithQuote: parseLineWithQuote3,
    getIndentUnitWidth: getIndentUnitWidth3,
    getListContext: getListContext2,
    listContextLineNumberOverride,
    listIndentDeltaOverride,
    listTargetIndentWidthOverride
  });
  const targetIndentWidth = indentPlan.targetIndentWidth;
  const listContextLineNumber = indentPlan.listContextLineNumber;
  const isAfterSelf = targetLineIdx === effectiveSourceRange.endLine + 1;
  const isSameLine = targetLineIdx === effectiveSourceRange.startLine;
  const sourceEndLineNumber = effectiveSourceRange.endLine + 1;
  const isSelfContext = listContextLineNumber === sourceLineNumber;
  const isContextInsideSource = listContextLineNumber >= sourceLineNumber && listContextLineNumber <= sourceEndLineNumber;
  if (isAfterSelf && isContextInsideSource && targetIndentWidth > sourceParsed.indentWidth) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_embedding",
      listContextLineNumber,
      targetIndentWidth
    };
  }
  const allowInPlaceIndentChange = isAfterSelf && targetIndentWidth !== sourceParsed.indentWidth || isSameLine && targetIndentWidth !== sourceParsed.indentWidth && !isSelfContext || !isAfterSelf && targetIndentWidth < sourceParsed.indentWidth;
  if (!allowInPlaceIndentChange) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_range_blocked",
      listContextLineNumber,
      targetIndentWidth
    };
  }
  return {
    inSelfRange: true,
    allowInPlaceIndentChange,
    listContextLineNumber,
    targetIndentWidth
  };
}

// src/features/mutation/list-renumberer.ts
var ListRenumberer = class {
  constructor(deps) {
    this.deps = deps;
  }
  renumberOrderedListAround(lineNumber) {
    const view = this.deps.view;
    const doc = view.state.doc;
    if (lineNumber < 1 || lineNumber > doc.lines)
      return;
    const findOrderedAt = (n) => {
      const text = doc.line(n).text;
      const parsed = this.deps.parseLineWithQuote(text);
      if (parsed.isListItem && parsed.markerType === "ordered") {
        return { indentWidth: parsed.indentWidth, quoteDepth: parsed.quoteDepth };
      }
      return null;
    };
    let anchor = findOrderedAt(lineNumber);
    if (!anchor && lineNumber > 1)
      anchor = findOrderedAt(lineNumber - 1);
    if (!anchor && lineNumber < doc.lines)
      anchor = findOrderedAt(lineNumber + 1);
    if (!anchor)
      return;
    let start = lineNumber;
    while (start > 1) {
      const info = findOrderedAt(start - 1);
      if (!info || info.indentWidth !== anchor.indentWidth || info.quoteDepth !== anchor.quoteDepth)
        break;
      start -= 1;
    }
    let end = lineNumber;
    while (end < doc.lines) {
      const info = findOrderedAt(end + 1);
      if (!info || info.indentWidth !== anchor.indentWidth || info.quoteDepth !== anchor.quoteDepth)
        break;
      end += 1;
    }
    const changes = [];
    let number = 1;
    for (let i = start; i <= end; i++) {
      const line = doc.line(i);
      const parsed = this.deps.parseLineWithQuote(line.text);
      if (!parsed.isListItem || parsed.markerType !== "ordered" || parsed.indentWidth !== anchor.indentWidth)
        continue;
      const newMarker = `${number}. `;
      const markerStart = line.from + parsed.quotePrefix.length + parsed.indentRaw.length;
      const markerEnd = markerStart + parsed.marker.length;
      changes.push({ from: markerStart, to: markerEnd, insert: newMarker });
      number += 1;
    }
    if (changes.length > 0) {
      view.dispatch({ changes });
    }
  }
};

// src/shared/utils/line-target-number.ts
function clampTargetLineNumber(totalLines, lineNumber) {
  if (lineNumber < 1)
    return 1;
  if (lineNumber > totalLines + 1)
    return totalLines + 1;
  return lineNumber;
}

// src/features/mutation/cross-editor-move.ts
function moveBlockAcrossEditors(params) {
  var _a, _b;
  const {
    sourceView,
    targetView,
    sourceBlock
  } = params;
  if (sourceView === targetView)
    return;
  const compositeRanges = (_b = (_a = sourceBlock.compositeSelection) == null ? void 0 : _a.ranges) != null ? _b : [];
  if (compositeRanges.length > 1) {
    moveCompositeAcrossEditors(params);
    return;
  }
  moveSingleRangeAcrossEditors(params);
}
function moveSingleRangeAcrossEditors(params) {
  const {
    sourceView,
    targetView,
    sourceBlock,
    listContextLineNumberOverride,
    listIndentDeltaOverride,
    listTargetIndentWidthOverride,
    capturedBlockFoldState,
    deps
  } = params;
  const sourceDoc = sourceView.state.doc;
  const targetDoc = targetView.state.doc;
  const targetLineNumber = resolveTargetLineNumber(params);
  const lineMap = getLineMap(targetView.state);
  const containerRule = deps.resolveDropRuleAtInsertion(sourceBlock, targetLineNumber, { lineMap });
  if (!containerRule.decision.allowDrop) {
    return;
  }
  const sourceStartLineNumber = clampLineNumber(sourceDoc.lines, sourceBlock.startLine + 1);
  const sourceEndLineNumber = Math.max(sourceStartLineNumber, clampLineNumber(sourceDoc.lines, sourceBlock.endLine + 1));
  const sourceStartLine = sourceDoc.line(sourceStartLineNumber);
  const sourceEndLine = sourceDoc.line(sourceEndLineNumber);
  const sourceFrom = sourceStartLine.from;
  const sourceTo = sourceEndLine.to;
  const sourceContent = sourceDoc.sliceString(sourceFrom, sourceTo);
  const insertText = deps.buildInsertText(
    targetDoc,
    sourceBlock,
    targetLineNumber,
    sourceContent,
    listContextLineNumberOverride,
    listIndentDeltaOverride,
    listTargetIndentWidthOverride
  );
  const insertion = resolveInsertionChange(targetDoc, targetLineNumber, insertText, {
    remainingLengthAfterDelete: targetDoc.length
  });
  targetView.dispatch({
    changes: { from: insertion.pos, to: insertion.pos, insert: insertion.text },
    scrollIntoView: false
  });
  const deleteRange = resolveDeleteRange(sourceDoc, sourceFrom, sourceTo);
  sourceView.dispatch({
    changes: { from: deleteRange.from, to: deleteRange.to },
    scrollIntoView: false
  });
  finalizeMove({
    sourceView,
    targetView,
    sourceLineNumbers: [sourceStartLineNumber],
    targetLineNumbers: [targetLineNumber],
    parseLineWithQuote: deps.parseLineWithQuote,
    restoreTargetBlockFoldState: () => {
      var _a;
      return (_a = deps.blockFoldState) == null ? void 0 : _a.restore(targetView, targetLineNumber, capturedBlockFoldState != null ? capturedBlockFoldState : null);
    }
  });
}
function moveCompositeAcrossEditors(params) {
  var _a, _b;
  const {
    sourceView,
    targetView,
    sourceBlock,
    capturedBlockFoldState,
    deps
  } = params;
  const sourceDoc = sourceView.state.doc;
  const targetDoc = targetView.state.doc;
  const normalizedRanges = normalizeCompositeRanges((_b = (_a = sourceBlock.compositeSelection) == null ? void 0 : _a.ranges) != null ? _b : [], sourceDoc.lines);
  if (normalizedRanges.length <= 1) {
    moveSingleRangeAcrossEditors(params);
    return;
  }
  const targetLineNumber = resolveTargetLineNumber(params);
  const lineMap = getLineMap(targetView.state);
  const containerRule = deps.resolveDropRuleAtInsertion(sourceBlock, targetLineNumber, { lineMap });
  if (!containerRule.decision.allowDrop) {
    return;
  }
  const segments = normalizedRanges.map((range) => {
    const startLineNumber = range.startLine + 1;
    const endLineNumber = range.endLine + 1;
    const startLine = sourceDoc.line(startLineNumber);
    const endLine = sourceDoc.line(endLineNumber);
    const sourceFrom = startLine.from;
    const sourceTo = endLine.to;
    const deleteRange = resolveDeleteRange(sourceDoc, sourceFrom, sourceTo);
    return {
      sourceFrom,
      sourceTo,
      deleteFrom: deleteRange.from,
      deleteTo: deleteRange.to,
      startLineNumber
    };
  });
  const insertText = deps.buildInsertText(
    targetDoc,
    sourceBlock,
    targetLineNumber,
    sourceBlock.content,
    params.listContextLineNumberOverride,
    params.listIndentDeltaOverride,
    params.listTargetIndentWidthOverride
  );
  if (!insertText.length) {
    return;
  }
  const insertion = resolveInsertionChange(targetDoc, targetLineNumber, insertText, {
    remainingLengthAfterDelete: targetDoc.length
  });
  targetView.dispatch({
    changes: { from: insertion.pos, to: insertion.pos, insert: insertion.text },
    scrollIntoView: false
  });
  sourceView.dispatch({
    changes: segments.map((segment) => ({ from: segment.deleteFrom, to: segment.deleteTo })).sort((a, b) => b.from - a.from),
    scrollIntoView: false
  });
  const sourceLineNumbers = segments.map((segment) => segment.startLineNumber);
  finalizeMove({
    sourceView,
    targetView,
    sourceLineNumbers,
    targetLineNumbers: [targetLineNumber],
    parseLineWithQuote: deps.parseLineWithQuote,
    restoreTargetBlockFoldState: () => {
      var _a2;
      return (_a2 = deps.blockFoldState) == null ? void 0 : _a2.restore(targetView, targetLineNumber, capturedBlockFoldState != null ? capturedBlockFoldState : null);
    }
  });
}
function resolveTargetLineNumber(params) {
  const {
    targetView,
    targetPos,
    targetLineNumberOverride,
    deps
  } = params;
  const targetLine = targetView.state.doc.lineAt(targetPos);
  let targetLineNumber = targetLineNumberOverride != null ? targetLineNumberOverride : targetLine.number;
  if (targetLineNumberOverride === void 0) {
    const adjusted = deps.getAdjustedTargetLocation(targetLine.number);
    if (adjusted.blockAdjusted) {
      targetLineNumber = adjusted.lineNumber;
    }
  }
  const targetDoc = targetView.state.doc;
  return clampTargetLineNumber(targetDoc.lines, targetLineNumber);
}
function finalizeMove(params) {
  const {
    sourceView,
    targetView,
    sourceLineNumbers,
    targetLineNumbers,
    parseLineWithQuote: parseLineWithQuote3,
    restoreTargetBlockFoldState
  } = params;
  const sourceRenumberer = new ListRenumberer({ view: sourceView, parseLineWithQuote: parseLineWithQuote3 });
  const targetRenumberer = new ListRenumberer({ view: targetView, parseLineWithQuote: parseLineWithQuote3 });
  const sourceTargets = new Set(sourceLineNumbers);
  const targetTargets = new Set(targetLineNumbers);
  for (const lineNumber of sourceTargets) {
    sourceRenumberer.renumberOrderedListAround(lineNumber);
  }
  for (const lineNumber of targetTargets) {
    targetRenumberer.renumberOrderedListAround(lineNumber);
  }
  restoreTargetBlockFoldState == null ? void 0 : restoreTargetBlockFoldState();
}
function resolveInsertionChange(doc, targetLineNumber, insertText, options) {
  var _a;
  if (targetLineNumber <= doc.lines) {
    return {
      pos: doc.line(targetLineNumber).from,
      text: insertText
    };
  }
  const normalized = insertText.endsWith("\n") ? insertText.slice(0, -1) : insertText;
  if (!normalized.length) {
    return { pos: doc.length, text: normalized };
  }
  const remainingLengthAfterDelete = (_a = options == null ? void 0 : options.remainingLengthAfterDelete) != null ? _a : doc.length;
  if (remainingLengthAfterDelete <= 0) {
    return { pos: 0, text: normalized };
  }
  return {
    pos: doc.length,
    text: `
${normalized}`
  };
}
function resolveDeleteRange(doc, sourceFrom, sourceTo) {
  if (sourceTo < doc.length) {
    return {
      from: sourceFrom,
      to: Math.min(sourceTo + 1, doc.length)
    };
  }
  if (sourceFrom > 0) {
    return {
      from: sourceFrom - 1,
      to: sourceTo
    };
  }
  return {
    from: sourceFrom,
    to: sourceTo
  };
}
function clampLineNumber(totalLines, lineNumber) {
  return Math.max(1, Math.min(totalLines, lineNumber));
}

// src/features/mutation/block-mover.ts
var BlockMover = class {
  constructor(deps) {
    this.deps = deps;
    this.listRenumberer = new ListRenumberer({
      view: deps.view,
      parseLineWithQuote: deps.parseLineWithQuote
    });
  }
  moveBlock(params) {
    var _a, _b, _c;
    const {
      sourceBlock,
      targetPos,
      targetLineNumberOverride,
      listContextLineNumberOverride,
      listIndentDeltaOverride,
      listTargetIndentWidthOverride,
      sourceView,
      sourceDocumentRelation,
      capturedBlockFoldStateOverride
    } = params;
    const sourceEditorView = sourceView != null ? sourceView : this.deps.view;
    const sourceDoc = sourceEditorView.state.doc;
    const normalizedSourceBlock = this.normalizeSourceBlock(sourceDoc, sourceBlock);
    if (sourceView && sourceView !== this.deps.view && sourceDocumentRelation !== "same_document") {
      const capturedBlockFoldState2 = capturedBlockFoldStateOverride != null ? capturedBlockFoldStateOverride : this.captureBlockFoldState(sourceView, normalizedSourceBlock);
      moveBlockAcrossEditors({
        sourceView,
        targetView: this.deps.view,
        sourceBlock: normalizedSourceBlock,
        targetPos,
        targetLineNumberOverride,
        listContextLineNumberOverride,
        listIndentDeltaOverride,
        listTargetIndentWidthOverride,
        capturedBlockFoldState: capturedBlockFoldState2,
        deps: {
          getAdjustedTargetLocation: this.deps.getAdjustedTargetLocation,
          resolveDropRuleAtInsertion: this.deps.resolveDropRuleAtInsertion,
          parseLineWithQuote: this.deps.parseLineWithQuote,
          getListContext: this.deps.getListContext,
          getIndentUnitWidth: this.deps.getIndentUnitWidth,
          buildInsertText: this.deps.buildInsertText,
          blockFoldState: this.deps.blockFoldState
        }
      });
      return;
    }
    const compositeRanges = (_b = (_a = normalizedSourceBlock.compositeSelection) == null ? void 0 : _a.ranges) != null ? _b : [];
    const capturedBlockFoldState = capturedBlockFoldStateOverride != null ? capturedBlockFoldStateOverride : this.captureBlockFoldState(sourceEditorView, normalizedSourceBlock);
    if (compositeRanges.length > 1) {
      this.moveCompositeBlock({
        ...params,
        sourceBlock: normalizedSourceBlock,
        sourceView,
        sourceDocumentRelation,
        capturedBlockFoldState
      });
      return;
    }
    const view = this.deps.view;
    const doc = view.state.doc;
    const targetLine = view.state.doc.lineAt(targetPos);
    let targetLineNumber = targetLineNumberOverride != null ? targetLineNumberOverride : targetLine.number;
    if (targetLineNumberOverride === void 0) {
      const adjusted = this.deps.getAdjustedTargetLocation(targetLine.number);
      if (adjusted.blockAdjusted) {
        targetLineNumber = adjusted.lineNumber;
      }
    }
    targetLineNumber = clampTargetLineNumber(doc.lines, targetLineNumber);
    const lineMap = getLineMap(view.state);
    const containerRule = this.deps.resolveDropRuleAtInsertion(
      normalizedSourceBlock,
      targetLineNumber,
      { lineMap }
    );
    if (!containerRule.decision.allowDrop) {
      return;
    }
    const inPlaceValidation = validateInPlaceDrop({
      doc,
      sourceBlock: normalizedSourceBlock,
      targetLineNumber,
      parseLineWithQuote: this.deps.parseLineWithQuote,
      getListContext: this.deps.getListContext,
      getIndentUnitWidth: this.deps.getIndentUnitWidth,
      slotContext: containerRule.slotContext,
      lineMap,
      listContextLineNumberOverride,
      listIndentDeltaOverride,
      listTargetIndentWidthOverride
    });
    const allowInPlaceIndentChange = inPlaceValidation.allowInPlaceIndentChange;
    if (inPlaceValidation.inSelfRange && !allowInPlaceIndentChange) {
      return;
    }
    const sourceStartLine = doc.line(normalizedSourceBlock.startLine + 1);
    const sourceEndLine = doc.line(normalizedSourceBlock.endLine + 1);
    const sourceFrom = sourceStartLine.from;
    const sourceTo = sourceEndLine.to;
    const sourceContent = doc.sliceString(sourceFrom, sourceTo);
    const insertText = this.deps.buildInsertText(
      doc,
      normalizedSourceBlock,
      targetLineNumber,
      sourceContent,
      listContextLineNumberOverride,
      listIndentDeltaOverride,
      listTargetIndentWidthOverride
    );
    const deleteRange = this.resolveDeleteRange(doc, sourceFrom, sourceTo);
    const deleteFrom = deleteRange.from;
    const deleteTo = deleteRange.to;
    const insertion = this.resolveInsertionChange(doc, targetLineNumber, insertText, {
      remainingLengthAfterDelete: doc.length - (deleteTo - deleteFrom)
    });
    const insertPos = insertion.pos;
    const targetStartLineNumber = allowInPlaceIndentChange && insertPos === deleteFrom ? normalizedSourceBlock.startLine + 1 : this.resolveFinalInsertedStartLineNumber(normalizedSourceBlock, targetLineNumber);
    if (allowInPlaceIndentChange && insertPos === deleteFrom) {
      view.dispatch({
        changes: { from: deleteFrom, to: deleteTo, insert: insertion.text },
        scrollIntoView: false
      });
    } else {
      view.dispatch({
        changes: [
          { from: insertPos, to: insertPos, insert: insertion.text },
          { from: deleteFrom, to: deleteTo }
        ].sort((a, b) => b.from - a.from),
        scrollIntoView: false
      });
    }
    const sourceLineNumber = normalizedSourceBlock.startLine + 1;
    this.listRenumberer.renumberOrderedListAround(sourceLineNumber);
    this.listRenumberer.renumberOrderedListAround(targetLineNumber);
    (_c = this.deps.blockFoldState) == null ? void 0 : _c.restore(view, targetStartLineNumber, capturedBlockFoldState);
  }
  moveCompositeBlock(params) {
    var _a, _b, _c;
    const {
      sourceBlock,
      targetPos,
      targetLineNumberOverride,
      sourceView,
      sourceDocumentRelation,
      capturedBlockFoldState
    } = params;
    const view = this.deps.view;
    const doc = view.state.doc;
    const normalizedRanges = normalizeCompositeRanges(
      (_b = (_a = sourceBlock.compositeSelection) == null ? void 0 : _a.ranges) != null ? _b : [],
      doc.lines
    );
    if (normalizedRanges.length <= 1) {
      this.moveBlock({
        sourceBlock,
        targetPos,
        targetLineNumberOverride: params.targetLineNumberOverride,
        listContextLineNumberOverride: params.listContextLineNumberOverride,
        listIndentDeltaOverride: params.listIndentDeltaOverride,
        listTargetIndentWidthOverride: params.listTargetIndentWidthOverride,
        sourceView,
        sourceDocumentRelation,
        capturedBlockFoldStateOverride: capturedBlockFoldState
      });
      return;
    }
    const targetLine = view.state.doc.lineAt(targetPos);
    let targetLineNumber = targetLineNumberOverride != null ? targetLineNumberOverride : targetLine.number;
    if (targetLineNumberOverride === void 0) {
      const adjusted = this.deps.getAdjustedTargetLocation(targetLine.number);
      if (adjusted.blockAdjusted) {
        targetLineNumber = adjusted.lineNumber;
      }
    }
    targetLineNumber = clampTargetLineNumber(doc.lines, targetLineNumber);
    const lineMap = getLineMap(view.state);
    const containerRule = this.deps.resolveDropRuleAtInsertion(
      sourceBlock,
      targetLineNumber,
      { lineMap }
    );
    if (!containerRule.decision.allowDrop) {
      return;
    }
    if (this.isTargetInsideCompositeRanges(targetLineNumber, normalizedRanges)) {
      return;
    }
    const segments = normalizedRanges.map((range) => {
      const startLine = doc.line(range.startLine + 1);
      const endLine = doc.line(range.endLine + 1);
      const sourceFrom = startLine.from;
      const sourceTo = endLine.to;
      const deleteRange = this.resolveDeleteRange(doc, sourceFrom, sourceTo);
      return {
        sourceFrom,
        sourceTo,
        deleteFrom: deleteRange.from,
        deleteTo: deleteRange.to,
        startLineNumber: range.startLine + 1
      };
    });
    const insertText = this.deps.buildInsertText(
      doc,
      sourceBlock,
      targetLineNumber,
      sourceBlock.content,
      params.listContextLineNumberOverride,
      params.listIndentDeltaOverride,
      params.listTargetIndentWidthOverride
    );
    if (!insertText.length)
      return;
    const totalDeletedLength = segments.reduce(
      (sum, segment) => sum + (segment.deleteTo - segment.deleteFrom),
      0
    );
    const insertion = this.resolveInsertionChange(doc, targetLineNumber, insertText, {
      remainingLengthAfterDelete: doc.length - totalDeletedLength
    });
    if (segments.some((segment) => insertion.pos > segment.deleteFrom && insertion.pos < segment.deleteTo)) {
      return;
    }
    const changes = [
      { from: insertion.pos, to: insertion.pos, insert: insertion.text },
      ...segments.map((segment) => ({ from: segment.deleteFrom, to: segment.deleteTo }))
    ].sort((a, b) => b.from - a.from);
    view.dispatch({
      changes,
      scrollIntoView: false
    });
    const targetStartLineNumber = this.resolveFinalCompositeInsertedStartLineNumber(targetLineNumber, normalizedRanges);
    const renumberTargets = /* @__PURE__ */ new Set([targetLineNumber]);
    for (const segment of segments) {
      renumberTargets.add(segment.startLineNumber);
    }
    for (const lineNumber of renumberTargets) {
      this.listRenumberer.renumberOrderedListAround(lineNumber);
    }
    (_c = this.deps.blockFoldState) == null ? void 0 : _c.restore(view, targetStartLineNumber, capturedBlockFoldState != null ? capturedBlockFoldState : null);
  }
  isTargetInsideCompositeRanges(targetLineNumber, ranges) {
    const targetLine0 = targetLineNumber - 1;
    for (const range of ranges) {
      if (targetLine0 >= range.startLine && targetLine0 <= range.endLine) {
        return true;
      }
    }
    return false;
  }
  captureBlockFoldState(sourceView, sourceBlock) {
    var _a, _b;
    return (_b = (_a = this.deps.blockFoldState) == null ? void 0 : _a.capture(sourceView, sourceBlock)) != null ? _b : null;
  }
  normalizeSourceBlock(doc, sourceBlock) {
    var _a, _b;
    const compositeRanges = normalizeCompositeRanges(
      (_b = (_a = sourceBlock.compositeSelection) == null ? void 0 : _a.ranges) != null ? _b : [],
      doc.lines
    );
    if (compositeRanges.length === 0) {
      return sourceBlock;
    }
    const firstRange = compositeRanges[0];
    const lastRange = compositeRanges[compositeRanges.length - 1];
    const firstLine = doc.line(firstRange.startLine + 1);
    const lastLine = doc.line(lastRange.endLine + 1);
    const content = compositeRanges.map((range) => {
      const startLine = doc.line(range.startLine + 1);
      const endLine = doc.line(range.endLine + 1);
      return doc.sliceString(startLine.from, endLine.to);
    }).join("\n");
    return {
      ...sourceBlock,
      startLine: firstRange.startLine,
      endLine: lastRange.endLine,
      from: firstLine.from,
      to: lastLine.to,
      content,
      compositeSelection: compositeRanges.length > 1 ? { ranges: compositeRanges } : void 0
    };
  }
  resolveFinalInsertedStartLineNumber(sourceBlock, targetLineNumber) {
    const sourceStartLineNumber = sourceBlock.startLine + 1;
    const sourceLineCount = sourceBlock.endLine - sourceBlock.startLine + 1;
    if (sourceStartLineNumber < targetLineNumber) {
      return Math.max(1, targetLineNumber - sourceLineCount);
    }
    return targetLineNumber;
  }
  resolveFinalCompositeInsertedStartLineNumber(targetLineNumber, ranges) {
    let removedLineCountBeforeTarget = 0;
    for (const range of ranges) {
      const startLineNumber = range.startLine + 1;
      const endLineNumber = range.endLine + 1;
      if (endLineNumber < targetLineNumber) {
        removedLineCountBeforeTarget += endLineNumber - startLineNumber + 1;
      }
    }
    return Math.max(1, targetLineNumber - removedLineCountBeforeTarget);
  }
  resolveInsertionChange(doc, targetLineNumber, insertText, options) {
    var _a;
    if (targetLineNumber <= doc.lines) {
      return {
        pos: doc.line(targetLineNumber).from,
        text: insertText
      };
    }
    const normalized = insertText.endsWith("\n") ? insertText.slice(0, -1) : insertText;
    if (!normalized.length) {
      return { pos: doc.length, text: normalized };
    }
    const remainingLengthAfterDelete = (_a = options == null ? void 0 : options.remainingLengthAfterDelete) != null ? _a : doc.length;
    if (remainingLengthAfterDelete <= 0) {
      return { pos: 0, text: normalized };
    }
    return {
      pos: doc.length,
      text: `
${normalized}`
    };
  }
  resolveDeleteRange(doc, sourceFrom, sourceTo) {
    if (sourceTo < doc.length) {
      return {
        from: sourceFrom,
        to: Math.min(sourceTo + 1, doc.length)
      };
    }
    if (sourceFrom > 0) {
      return {
        from: sourceFrom - 1,
        to: sourceTo
      };
    }
    return {
      from: sourceFrom,
      to: sourceTo
    };
  }
};

// src/features/ui/indicator/line-indicator.ts
var _DropIndicatorManager = class {
  constructor(view, resolveDropTarget, options) {
    this.view = view;
    this.resolveDropTarget = resolveDropTarget;
    this.options = options;
    this.pendingDragInfo = null;
    this.rafId = null;
    this.lastEvaluatedInput = null;
    this.lastTargetInfo = null;
    _DropIndicatorManager.instances.add(this);
    this.indicatorEl = document.createElement("div");
    this.indicatorEl.className = `${DROP_INDICATOR_CLASS} ${HIDDEN_CLASS}`;
    document.body.appendChild(this.indicatorEl);
    this.highlightEl = document.createElement("div");
    this.highlightEl.className = `${DROP_HIGHLIGHT_CLASS} ${HIDDEN_CLASS}`;
    document.body.appendChild(this.highlightEl);
  }
  scheduleFromPoint(clientX, clientY, dragSource, pointerType) {
    this.pendingDragInfo = { x: clientX, y: clientY, dragSource, pointerType };
    if (this.rafId !== null)
      return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      const pending = this.pendingDragInfo;
      if (!pending)
        return;
      this.updateFromPoint(pending);
    });
  }
  hide() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingDragInfo = null;
    this.lastEvaluatedInput = null;
    this.lastTargetInfo = null;
    this.indicatorEl.classList.add(HIDDEN_CLASS);
    this.highlightEl.classList.add(HIDDEN_CLASS);
  }
  destroy() {
    this.hide();
    this.indicatorEl.remove();
    this.highlightEl.remove();
    _DropIndicatorManager.instances.delete(this);
  }
  updateFromPoint(info) {
    var _a, _b, _c, _d, _e, _f;
    if (this.shouldReuseLastResult(info)) {
      const reused = this.lastTargetInfo !== null;
      if (this.lastTargetInfo) {
        this.renderTargetInfo(this.lastTargetInfo);
      } else {
        this.indicatorEl.classList.add(HIDDEN_CLASS);
        this.highlightEl.classList.add(HIDDEN_CLASS);
      }
      (_b = (_a = this.options) == null ? void 0 : _a.onFrameMetrics) == null ? void 0 : _b.call(_a, {
        evaluated: false,
        skipped: true,
        reused,
        durationMs: 0
      });
      return;
    }
    const startedAt = this.now();
    const targetInfo = this.resolveDropTarget({
      clientX: info.x,
      clientY: info.y,
      dragSource: info.dragSource,
      pointerType: info.pointerType
    });
    const durationMs = this.now() - startedAt;
    (_d = (_c = this.options) == null ? void 0 : _c.recordPerfDuration) == null ? void 0 : _d.call(_c, "drop_indicator_resolve", durationMs);
    (_f = (_e = this.options) == null ? void 0 : _e.onFrameMetrics) == null ? void 0 : _f.call(_e, {
      evaluated: true,
      skipped: false,
      reused: false,
      durationMs
    });
    this.lastEvaluatedInput = { ...info };
    this.lastTargetInfo = targetInfo;
    if (!targetInfo) {
      this.indicatorEl.classList.add(HIDDEN_CLASS);
      this.highlightEl.classList.add(HIDDEN_CLASS);
      return;
    }
    this.renderTargetInfo(targetInfo);
  }
  renderTargetInfo(targetInfo) {
    var _a, _b;
    this.hideOtherInstancesVisuals();
    const editorRect = this.view.dom.getBoundingClientRect();
    const indicatorY = targetInfo.indicatorY;
    const indicatorLeft = targetInfo.lineRect ? targetInfo.lineRect.left : editorRect.left + 35;
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    const contentPaddingRight = parseFloat(getComputedStyle(this.view.contentDOM).paddingRight) || 0;
    const indicatorRight = contentRect.right - contentPaddingRight;
    const indicatorWidth = Math.max(8, indicatorRight - indicatorLeft);
    this.indicatorEl.classList.remove(HIDDEN_CLASS);
    this.indicatorEl.setCssStyles({
      top: `${indicatorY}px`,
      left: `${indicatorLeft}px`,
      width: `${indicatorWidth}px`
    });
    if (targetInfo.highlightRect && ((_b = (_a = this.options) == null ? void 0 : _a.isDropHighlightEnabled) == null ? void 0 : _b.call(_a)) !== false) {
      this.highlightEl.classList.remove(HIDDEN_CLASS);
      this.highlightEl.setCssStyles({
        top: `${targetInfo.highlightRect.top}px`,
        left: `${targetInfo.highlightRect.left}px`,
        width: `${targetInfo.highlightRect.width}px`,
        height: `${targetInfo.highlightRect.height}px`
      });
    } else {
      this.highlightEl.classList.add(HIDDEN_CLASS);
    }
  }
  hideOtherInstancesVisuals() {
    for (const instance of _DropIndicatorManager.instances) {
      if (instance === this)
        continue;
      instance.hide();
    }
  }
  shouldReuseLastResult(info) {
    if (!this.lastEvaluatedInput)
      return false;
    if (this.lastEvaluatedInput.pointerType !== info.pointerType)
      return false;
    if (!this.isSameSourceBlock(this.lastEvaluatedInput.dragSource, info.dragSource))
      return false;
    const dx = Math.abs(this.lastEvaluatedInput.x - info.x);
    const dy = Math.abs(this.lastEvaluatedInput.y - info.y);
    return dx + dy < 2;
  }
  isSameSourceBlock(a, b) {
    if (a === b)
      return true;
    if (!a || !b)
      return false;
    return a.type === b.type && a.startLine === b.startLine && a.endLine === b.endLine && a.from === b.from && a.to === b.to;
  }
  now() {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
    }
    return Date.now();
  }
};
var DropIndicatorManager = _DropIndicatorManager;
DropIndicatorManager.instances = /* @__PURE__ */ new Set();

// src/features/targeting/rect-calculator.ts
function getCoordsAtPos(view, pos, side) {
  try {
    const { from, to } = view.viewport;
    const margin = 500;
    if (pos >= Math.max(0, from - margin) && pos <= to + margin) {
      return typeof side !== "undefined" ? view.coordsAtPos(pos, side) : view.coordsAtPos(pos);
    }
    const lineBlock = view.lineBlockAt(pos);
    const editorRect = view.dom.getBoundingClientRect();
    const doc = view.state.doc;
    if (pos < 0 || pos > doc.length)
      return null;
    const line = doc.lineAt(pos);
    const col = pos - line.from;
    const defaultCharWidth = view.defaultCharacterWidth || 7;
    const estimatedLeft = editorRect.left + col * defaultCharWidth;
    const estimatedRight = estimatedLeft + defaultCharWidth;
    const documentTop = view.documentTop;
    const screenTop = documentTop + lineBlock.top;
    const screenBottom = documentTop + lineBlock.bottom;
    return {
      left: estimatedLeft,
      right: estimatedRight,
      top: screenTop,
      bottom: screenBottom
    };
  } catch (e) {
    return null;
  }
}
function getLineRect(view, lineNumber) {
  const doc = view.state.doc;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return void 0;
  const line = doc.line(lineNumber);
  const start = getCoordsAtPos(view, line.from);
  const end = getCoordsAtPos(view, line.to);
  if (!start || !end)
    return void 0;
  const left = Math.min(start.left, end.left);
  const right = Math.max(start.left, end.left);
  return { left, width: Math.max(8, right - left) };
}
function getInsertionAnchorY(view, lineNumber) {
  const doc = view.state.doc;
  let y = null;
  if (lineNumber <= 1) {
    const first = doc.line(1);
    const coords = getCoordsAtPos(view, first.from);
    y = coords ? coords.top : null;
  } else {
    const anchorLineNumber = Math.min(lineNumber - 1, doc.lines);
    const anchorLine = doc.line(anchorLineNumber);
    const coords = getCoordsAtPos(view, anchorLine.to);
    y = coords ? coords.bottom : null;
  }
  return y;
}
function getLineIndentPosByWidth(view, lineNumber, targetIndentWidth, tabSize) {
  const doc = view.state.doc;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const line = doc.line(lineNumber);
  const text = line.text;
  let width = 0;
  let idx = 0;
  while (idx < text.length && width < targetIndentWidth) {
    const ch = text[idx];
    if (ch === "	") {
      width += tabSize;
    } else if (ch === " ") {
      width += 1;
    } else {
      break;
    }
    idx += 1;
  }
  return line.from + idx;
}
function getBlockRect(view, startLineNumber, endLineNumber) {
  const doc = view.state.doc;
  if (startLineNumber < 1 || endLineNumber > doc.lines)
    return void 0;
  let minLeft = Number.POSITIVE_INFINITY;
  let maxRight = 0;
  let top = 0;
  let bottom = 0;
  for (let i = startLineNumber; i <= endLineNumber; i++) {
    const line = doc.line(i);
    const start = getCoordsAtPos(view, line.from);
    const end = getCoordsAtPos(view, line.to);
    if (!start || !end)
      continue;
    if (i === startLineNumber)
      top = start.top;
    if (i === endLineNumber)
      bottom = end.bottom;
    const left = Math.min(start.left, end.left);
    const right = Math.max(start.left, end.left);
    minLeft = Math.min(minLeft, left);
    maxRight = Math.max(maxRight, right);
  }
  if (!isFinite(minLeft) || maxRight === 0 || bottom <= top)
    return void 0;
  return { top, left: minLeft, width: Math.max(8, maxRight - minLeft), height: bottom - top };
}

// src/features/ui/probe/embed-probe.ts
function normalizeEmbedRoot(el) {
  var _a;
  if (!el)
    return null;
  return (_a = el.closest(EMBED_ROOT_SELECTOR)) != null ? _a : el;
}
function collectEmbedRoots(view, options) {
  var _a;
  const root = view.dom;
  if (!(root instanceof HTMLElement))
    return [];
  const normalizeToEmbedRoot = (options == null ? void 0 : options.normalizeToEmbedRoot) !== false;
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  const raws = Array.from(root.querySelectorAll(EMBED_BLOCK_SELECTOR));
  for (const raw of raws) {
    const candidate = normalizeToEmbedRoot ? (_a = normalizeEmbedRoot(raw)) != null ? _a : raw : raw;
    if (!root.contains(candidate))
      continue;
    if (seen.has(candidate))
      continue;
    seen.add(candidate);
    result.push(candidate);
  }
  return result;
}
function findEmbedElementAtPoint(view, clientX, clientY, options) {
  var _a;
  const root = view.dom;
  if (!(root instanceof HTMLElement))
    return null;
  const requireDirectWithinRoot = (options == null ? void 0 : options.requireDirectWithinRoot) !== false;
  const normalizeToEmbedRoot = (options == null ? void 0 : options.normalizeToEmbedRoot) !== false;
  if (typeof document.elementFromPoint === "function") {
    const rawEl = document.elementFromPoint(clientX, clientY);
    const el = rawEl instanceof HTMLElement ? rawEl : null;
    if (el) {
      const direct = el.closest(EMBED_BLOCK_SELECTOR);
      if (direct) {
        if (!requireDirectWithinRoot || root.contains(direct)) {
          return normalizeToEmbedRoot ? (_a = normalizeEmbedRoot(direct)) != null ? _a : direct : direct;
        }
      }
    }
  }
  return null;
}

// src/shared/utils/line-number.ts
function clampLineNumber2(docLines, lineNumber) {
  if (docLines <= 0)
    return 1;
  if (lineNumber < 1)
    return 1;
  if (lineNumber > docLines)
    return docLines;
  return lineNumber;
}

// src/features/ui/probe/element-probe.ts
function clamp(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;
  return value;
}
function safeCoordsAtPos(view, pos, side) {
  return getCoordsAtPos(view, pos, side);
}
function safePosAtCoords(view, coords) {
  try {
    return view.posAtCoords(coords);
  } catch (e) {
    return null;
  }
}
function resolveLineNumberFromPos(view, pos) {
  try {
    return clampLineNumber2(view.state.doc.lines, view.state.doc.lineAt(pos).number);
  } catch (e) {
    return null;
  }
}
function resolveLineNumberFromDomNodes(view, probes) {
  const seen = /* @__PURE__ */ new Set();
  for (const probe of probes) {
    if (!probe)
      continue;
    if (seen.has(probe))
      continue;
    seen.add(probe);
    try {
      const pos = view.posAtDOM(probe, 0);
      const lineNumber = resolveLineNumberFromPos(view, pos);
      if (lineNumber !== null)
        return lineNumber;
    } catch (e) {
    }
  }
  return null;
}
function resolveLineNumberFromBlockStartAttribute(view, handle) {
  const startAttr = handle.getAttribute("data-block-start");
  if (startAttr === null)
    return null;
  const lineNumber = Number(startAttr) + 1;
  if (!Number.isInteger(lineNumber))
    return null;
  if (lineNumber < 1 || lineNumber > view.state.doc.lines)
    return null;
  return lineNumber;
}
function resolveLineNumberAtCoords(view, clientX, clientY, contentRect) {
  const clampedX = clamp(clientX, contentRect.left + 2, contentRect.right - 2);
  const pos = safePosAtCoords(view, { x: clampedX, y: clientY });
  if (pos === null)
    return null;
  return resolveLineNumberFromPos(view, pos);
}

// src/features/ui/probe/line-hit.ts
function getRenderedMainLineElementAtPoint(view, clientX, clientY) {
  if (typeof document.elementFromPoint !== "function")
    return null;
  const rawEl = document.elementFromPoint(clientX, clientY);
  const el = rawEl instanceof HTMLElement ? rawEl : null;
  if (!el)
    return null;
  const lineEl = el.closest(".cm-line");
  if (!lineEl)
    return null;
  if (!view.contentDOM.contains(lineEl))
    return null;
  return lineEl;
}
function getRenderedMainLineNumberAtPoint(view, clientX, clientY) {
  const lineEl = getRenderedMainLineElementAtPoint(view, clientX, clientY);
  if (!lineEl)
    return null;
  try {
    const pos = view.posAtDOM(lineEl, 0);
    const lineNumber = view.state.doc.lineAt(pos).number;
    if (lineNumber < 1 || lineNumber > view.state.doc.lines)
      return null;
    return lineNumber;
  } catch (e) {
    return null;
  }
}

// src/features/targeting/drop-target-calculator.ts
var DropTargetCalculator = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
    this.lastResolvedCache = null;
    this.listDropTargetCalculator = this.deps.listDropTargetCalculator;
  }
  getDropTargetInfo(info) {
    const validated = this.resolveValidatedDropTarget(info);
    if (!validated.allowed || typeof validated.targetLineNumber !== "number" || typeof validated.indicatorY !== "number") {
      return null;
    }
    return {
      lineNumber: validated.targetLineNumber,
      indicatorY: validated.indicatorY,
      listContextLineNumber: validated.listContextLineNumber,
      listIndentDelta: validated.listIndentDelta,
      listTargetIndentWidth: validated.listTargetIndentWidth,
      lineRect: validated.lineRect,
      highlightRect: validated.highlightRect
    };
  }
  resolveValidatedDropTarget(info) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
    const startedAt = this.now();
    const dragSource = (_a = info.dragSource) != null ? _a : null;
    const pointerType = (_b = info.pointerType) != null ? _b : null;
    const sourceScope = (_c = info.sourceScope) != null ? _c : "same_editor";
    const cacheKey = this.buildResolveCacheKey(info.clientX, info.clientY, dragSource, pointerType, sourceScope);
    if (this.lastResolvedCache && this.lastResolvedCache.state === this.view.state && this.lastResolvedCache.key === cacheKey) {
      (_e = (_d = this.deps).incrementPerfCounter) == null ? void 0 : _e.call(_d, "resolve_cache_hits", 1);
      const cached = this.lastResolvedCache.result;
      (_g = (_f = this.deps).onDragTargetEvaluated) == null ? void 0 : _g.call(_f, {
        sourceBlock: dragSource,
        pointerType,
        validation: cached
      });
      (_i = (_h = this.deps).recordPerfDuration) == null ? void 0 : _i.call(_h, "resolve_total", this.now() - startedAt);
      return cached;
    }
    (_k = (_j = this.deps).incrementPerfCounter) == null ? void 0 : _k.call(_j, "resolve_cache_misses", 1);
    const lineMap = getLineMap(this.view.state);
    const result = this.resolveValidatedDropTargetInternal({
      info,
      dragSource,
      sourceScope,
      lineMap
    });
    this.lastResolvedCache = {
      state: this.view.state,
      key: cacheKey,
      result
    };
    (_m = (_l = this.deps).recordPerfDuration) == null ? void 0 : _m.call(_l, "resolve_total", this.now() - startedAt);
    (_o = (_n = this.deps).onDragTargetEvaluated) == null ? void 0 : _o.call(_n, {
      sourceBlock: dragSource,
      pointerType,
      validation: result
    });
    return result;
  }
  resolveValidatedDropTargetInternal(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const { info, dragSource, sourceScope, lineMap } = params;
    if (isPointInsideRenderedTableCell(this.view, info.clientX, info.clientY)) {
      return { allowed: false, reason: "table_cell" };
    }
    const embedEl = this.getEmbedElementAtPoint(info.clientX, info.clientY);
    if (embedEl) {
      const block = this.deps.getBlockInfoForEmbed(embedEl);
      if (block) {
        const rect = embedEl.getBoundingClientRect();
        const showAtBottom = info.clientY > rect.top + rect.height / 2;
        const lineNumber = clampTargetLineNumber(
          this.view.state.doc.lines,
          showAtBottom ? block.endLine + 2 : block.startLine + 1
        );
        const containerRule2 = this.resolveContainerRule(dragSource, lineNumber, lineMap);
        if (containerRule2.rejectReason) {
          return {
            allowed: false,
            reason: containerRule2.rejectReason
          };
        }
        const inPlaceRejectReason2 = this.getInPlaceRejectReason({
          dragSource,
          sourceScope,
          targetLineNumber: lineNumber,
          slotContext: containerRule2.slotContext,
          lineMap
        });
        if (inPlaceRejectReason2) {
          return {
            allowed: false,
            reason: inPlaceRejectReason2
          };
        }
        const indicatorY2 = showAtBottom ? rect.bottom : rect.top;
        return {
          allowed: true,
          targetLineNumber: lineNumber,
          indicatorY: indicatorY2,
          lineRect: { left: rect.left, width: rect.width }
        };
      }
    }
    const verticalStartedAt = this.now();
    const vertical = this.computeVerticalTarget(info, dragSource);
    (_b = (_a = this.deps).recordPerfDuration) == null ? void 0 : _b.call(_a, "vertical", this.now() - verticalStartedAt);
    if (!vertical) {
      return { allowed: false, reason: "no_target" };
    }
    const containerRule = this.resolveContainerRule(dragSource, vertical.targetLineNumber, lineMap);
    if (containerRule.rejectReason) {
      return {
        allowed: false,
        reason: containerRule.rejectReason
      };
    }
    const listStartedAt = this.now();
    const listTarget = this.listDropTargetCalculator.computeListTarget({
      targetLineNumber: vertical.targetLineNumber,
      lineNumber: vertical.line.number,
      forcedLineNumber: vertical.forcedLineNumber,
      childIntentOnLine: vertical.childIntentOnLine,
      dragSource,
      sourceScope,
      clientX: info.clientX,
      lineMap
    });
    (_d = (_c = this.deps).recordPerfDuration) == null ? void 0 : _d.call(_c, "list_target", this.now() - listStartedAt);
    const inPlaceRejectReason = this.getInPlaceRejectReason({
      dragSource,
      sourceScope,
      targetLineNumber: vertical.targetLineNumber,
      slotContext: containerRule.slotContext,
      listContextLineNumberOverride: listTarget.listContextLineNumber,
      listIndentDeltaOverride: listTarget.listIndentDelta,
      listTargetIndentWidthOverride: listTarget.listTargetIndentWidth,
      lineMap
    });
    if (inPlaceRejectReason) {
      return {
        allowed: false,
        reason: inPlaceRejectReason
      };
    }
    const geometryStartedAt = this.now();
    const indicatorY = this.deps.getInsertionAnchorY(vertical.targetLineNumber);
    if (indicatorY === null) {
      (_f = (_e = this.deps).recordPerfDuration) == null ? void 0 : _f.call(_e, "geometry", this.now() - geometryStartedAt);
      return { allowed: false, reason: "no_anchor" };
    }
    const lineRectSourceLineNumber = (_g = listTarget.lineRectSourceLineNumber) != null ? _g : vertical.lineRectSourceLineNumber;
    let lineRect = this.deps.getLineRect(lineRectSourceLineNumber);
    if (typeof listTarget.listTargetIndentWidth === "number") {
      const indentPos = this.deps.getLineIndentPosByWidth(lineRectSourceLineNumber, listTarget.listTargetIndentWidth);
      if (indentPos !== null) {
        const start = getCoordsAtPos(this.view, indentPos);
        const end = getCoordsAtPos(this.view, this.view.state.doc.line(lineRectSourceLineNumber).to);
        if (start && end) {
          const left = start.left;
          const width = Math.max(8, ((_h = end.right) != null ? _h : end.left) - left);
          lineRect = { left, width };
        }
      }
    }
    (_j = (_i = this.deps).recordPerfDuration) == null ? void 0 : _j.call(_i, "geometry", this.now() - geometryStartedAt);
    return {
      allowed: true,
      targetLineNumber: vertical.targetLineNumber,
      indicatorY,
      listContextLineNumber: listTarget.listContextLineNumber,
      listIndentDelta: listTarget.listIndentDelta,
      listTargetIndentWidth: listTarget.listTargetIndentWidth,
      lineRect,
      highlightRect: listTarget.highlightRect
    };
  }
  resolveContainerRule(dragSource, targetLineNumber, lineMap) {
    var _a, _b, _c;
    const containerStartedAt = this.now();
    const containerRule = dragSource ? this.deps.resolveDropRuleAtInsertion(dragSource, targetLineNumber, { lineMap }) : null;
    (_b = (_a = this.deps).recordPerfDuration) == null ? void 0 : _b.call(_a, "container", this.now() - containerStartedAt);
    if (!containerRule) {
      return { slotContext: null, rejectReason: null };
    }
    if (containerRule.decision.allowDrop) {
      return { slotContext: containerRule.slotContext, rejectReason: null };
    }
    return {
      slotContext: containerRule.slotContext,
      rejectReason: (_c = containerRule.decision.rejectReason) != null ? _c : "container_policy"
    };
  }
  getInPlaceRejectReason(params) {
    var _a, _b, _c;
    const {
      dragSource,
      sourceScope,
      targetLineNumber,
      slotContext,
      lineMap,
      listContextLineNumberOverride,
      listIndentDeltaOverride,
      listTargetIndentWidthOverride
    } = params;
    if (!dragSource || sourceScope === "cross_editor")
      return null;
    const inPlaceStartedAt = this.now();
    const inPlaceValidation = validateInPlaceDrop({
      doc: this.view.state.doc,
      sourceBlock: dragSource,
      targetLineNumber,
      parseLineWithQuote: this.deps.parseLineWithQuote,
      getListContext: this.deps.getListContext,
      getIndentUnitWidth: this.deps.getIndentUnitWidth,
      slotContext: slotContext != null ? slotContext : void 0,
      listContextLineNumberOverride,
      listIndentDeltaOverride,
      listTargetIndentWidthOverride,
      lineMap
    });
    (_b = (_a = this.deps).recordPerfDuration) == null ? void 0 : _b.call(_a, "in_place", this.now() - inPlaceStartedAt);
    if (inPlaceValidation.inSelfRange && !inPlaceValidation.allowInPlaceIndentChange) {
      return (_c = inPlaceValidation.rejectReason) != null ? _c : "self_range_blocked";
    }
    if (!inPlaceValidation.inSelfRange && inPlaceValidation.rejectReason) {
      return inPlaceValidation.rejectReason;
    }
    return null;
  }
  computeVerticalTarget(info, dragSource) {
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    let lineNumber = getRenderedMainLineNumberAtPoint(this.view, info.clientX, info.clientY);
    if (lineNumber === null) {
      lineNumber = resolveLineNumberAtCoords(this.view, info.clientX, info.clientY, contentRect);
      if (lineNumber === null)
        return null;
    }
    const line = this.view.state.doc.line(lineNumber);
    const allowListChildIntent = !!dragSource && dragSource.type === "list-item" /* ListItem */;
    const lineBoundsForSnap = this.listDropTargetCalculator.getListMarkerBounds(line.number);
    const lineParsedForSnap = this.deps.parseLineWithQuote(line.text);
    const childIntentOnLine = allowListChildIntent && !!lineBoundsForSnap && lineParsedForSnap.isListItem && info.clientX >= lineBoundsForSnap.contentStartX + 2;
    const adjustedTarget = this.deps.getAdjustedTargetLocation(line.number, {
      clientY: info.clientY
    });
    let forcedLineNumber = adjustedTarget.blockAdjusted ? adjustedTarget.lineNumber : null;
    let showAtBottom = false;
    if (!forcedLineNumber) {
      const isBlankLine = line.text.trim().length === 0;
      if (isBlankLine) {
        const visualMidY = this.getVisualLineMidY(line.number, line.from);
        if (visualMidY !== null) {
          forcedLineNumber = info.clientY > visualMidY ? line.number + 1 : line.number;
        } else {
          const lineStart = getCoordsAtPos(this.view, line.from);
          const lineEnd = getCoordsAtPos(this.view, line.to);
          if (lineStart && lineEnd) {
            const midY = (lineStart.top + lineEnd.bottom) / 2;
            forcedLineNumber = info.clientY > midY ? line.number + 1 : line.number;
          } else {
            forcedLineNumber = line.number;
          }
        }
      } else {
        showAtBottom = true;
        const visualMidY = this.getVisualLineMidY(line.number, line.from);
        if (visualMidY !== null) {
          showAtBottom = info.clientY > visualMidY;
        } else {
          const lineStart = getCoordsAtPos(this.view, line.from);
          const lineEnd = getCoordsAtPos(this.view, line.to);
          if (lineStart && lineEnd) {
            const midY = (lineStart.top + lineEnd.bottom) / 2;
            showAtBottom = info.clientY > midY;
          }
        }
      }
    }
    let targetLineNumber = clampTargetLineNumber(
      this.view.state.doc.lines,
      forcedLineNumber != null ? forcedLineNumber : showAtBottom ? line.number + 1 : line.number
    );
    if (!forcedLineNumber && childIntentOnLine && !showAtBottom) {
      targetLineNumber = clampTargetLineNumber(this.view.state.doc.lines, line.number + 1);
    }
    return {
      line,
      targetLineNumber,
      forcedLineNumber,
      childIntentOnLine,
      lineRectSourceLineNumber: line.number
    };
  }
  getVisualLineMidY(lineNumber, lineFromPos) {
    try {
      const block = this.view.lineBlockAt(lineFromPos);
      return this.view.documentTop + (block.top + block.bottom) / 2;
    } catch (e) {
      return null;
    }
  }
  getEmbedElementAtPoint(clientX, clientY) {
    return findEmbedElementAtPoint(this.view, clientX, clientY, {
      requireDirectWithinRoot: false,
      normalizeToEmbedRoot: true
    });
  }
  buildResolveCacheKey(clientX, clientY, dragSource, pointerType, sourceScope) {
    var _a, _b;
    if (!dragSource) {
      return `${clientX}|${clientY}|none|${pointerType != null ? pointerType : ""}|${sourceScope}`;
    }
    const compositeKey = ((_b = (_a = dragSource.compositeSelection) == null ? void 0 : _a.ranges) != null ? _b : []).map((range) => `${range.startLine}-${range.endLine}`).join(",");
    return [
      clientX,
      clientY,
      pointerType != null ? pointerType : "",
      sourceScope,
      dragSource.type,
      dragSource.startLine,
      dragSource.endLine,
      dragSource.from,
      dragSource.to,
      compositeKey
    ].join("|");
  }
  now() {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
    }
    return Date.now();
  }
};

// src/features/selection/block-selection.ts
function clamp2(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;
  return value;
}
function keyForBlockRange(range) {
  return `${range.startLineNumber}:${range.endLineNumber}`;
}
function normalizeSelectedBlockRange(docLines, startLineNumber, endLineNumber) {
  const safeStart = clamp2(Math.min(startLineNumber, endLineNumber), 1, docLines);
  const safeEnd = clamp2(Math.max(startLineNumber, endLineNumber), safeStart, docLines);
  return {
    startLineNumber: safeStart,
    endLineNumber: safeEnd
  };
}
function cloneSelectedBlocks(blocks) {
  return blocks.map((block) => ({
    startLineNumber: block.startLineNumber,
    endLineNumber: block.endLineNumber
  }));
}
function mergeSelectedBlocks(docLines, blocks) {
  const normalized = blocks.map((block) => normalizeSelectedBlockRange(docLines, block.startLineNumber, block.endLineNumber)).sort((a, b) => a.startLineNumber - b.startLineNumber || a.endLineNumber - b.endLineNumber);
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const block of normalized) {
    const key = keyForBlockRange(block);
    if (seen.has(key))
      continue;
    seen.add(key);
    result.push(block);
  }
  return result;
}
function subtractSelectedBlocks(docLines, sourceBlocks, blocksToRemove) {
  const removeKeys = new Set(
    mergeSelectedBlocks(docLines, blocksToRemove).map((block) => keyForBlockRange(block))
  );
  return mergeSelectedBlocks(docLines, sourceBlocks).filter((block) => !removeKeys.has(keyForBlockRange(block)));
}
function isSelectedBlockCoveredByBlocks(docLines, target, blocks) {
  const normalizedTarget = normalizeSelectedBlockRange(
    docLines,
    target.startLineNumber,
    target.endLineNumber
  );
  const targetKey = keyForBlockRange(normalizedTarget);
  return mergeSelectedBlocks(docLines, blocks).some((block) => keyForBlockRange(block) === targetKey);
}
function groupSelectedBlocksIntoSegments(docLines, blocks) {
  return groupSegments(mergeSelectedBlocks(docLines, blocks));
}
function groupSegments(normalized) {
  if (normalized.length === 0)
    return [];
  const segments = [];
  let current = {
    startLineNumber: normalized[0].startLineNumber,
    endLineNumber: normalized[0].endLineNumber,
    startBlockLineNumber: normalized[0].startLineNumber,
    endBlockLineNumber: normalized[0].startLineNumber
  };
  for (let i = 1; i < normalized.length; i++) {
    const block = normalized[i];
    if (block.startLineNumber <= current.endLineNumber + 1) {
      current.endLineNumber = Math.max(current.endLineNumber, block.endLineNumber);
      current.endBlockLineNumber = block.startLineNumber;
      continue;
    }
    segments.push(current);
    current = {
      startLineNumber: block.startLineNumber,
      endLineNumber: block.endLineNumber,
      startBlockLineNumber: block.startLineNumber,
      endBlockLineNumber: block.startLineNumber
    };
  }
  segments.push(current);
  return segments;
}

// src/features/selection/selection-anchor.ts
function getHandleBlockLineNumber(handle) {
  const blockStartAttr = handle.getAttribute("data-block-start");
  if (!blockStartAttr)
    return null;
  const blockStart = Number(blockStartAttr);
  if (!Number.isFinite(blockStart))
    return null;
  return blockStart + 1;
}
function getAnchorPointForHandle(handle) {
  var _a, _b;
  if (!handle)
    return null;
  const host = (_a = handle.closest(`${CODEMIRROR_GUTTER_ELEMENT_SELECTOR}.${HANDLE_GUTTER_MARKER_CLASS}`)) != null ? _a : handle.closest(`.${HANDLE_GUTTER_MARKER_CLASS}`);
  if (!host)
    return null;
  const anchorTarget = (_b = handle.querySelector(`.${HANDLE_CORE_CLASS}`)) != null ? _b : handle;
  const rect = anchorTarget.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0)
    return null;
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    host
  };
}
function getAnchorPointByBlockLineNumber(blockLineNumber, resolveHandleForBlockLineNumber) {
  const handle = resolveHandleForBlockLineNumber(blockLineNumber);
  return getAnchorPointForHandle(handle);
}
function emptyAnchorSnapshot() {
  return {
    ordered: [],
    byBlockLineNumber: /* @__PURE__ */ new Map()
  };
}
function buildAnchorSnapshot(visibleHandles) {
  const snapshot = emptyAnchorSnapshot();
  for (const handle of visibleHandles) {
    const blockLineNumber = getHandleBlockLineNumber(handle);
    if (blockLineNumber === null)
      continue;
    if (snapshot.byBlockLineNumber.has(blockLineNumber))
      continue;
    const anchor = getAnchorPointForHandle(handle);
    if (!anchor)
      continue;
    snapshot.byBlockLineNumber.set(blockLineNumber, anchor);
    snapshot.ordered.push({ blockLineNumber, anchor });
  }
  snapshot.ordered.sort((a, b) => a.blockLineNumber - b.blockLineNumber);
  return snapshot;
}
function findFirstAnchorIndexAtOrAfter(ordered, startBlockLineNumber) {
  let low = 0;
  let high = ordered.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (ordered[mid].blockLineNumber < startBlockLineNumber) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}
function resolveAnchorSpan(options) {
  var _a, _b;
  const anchors = [];
  const seenHosts = /* @__PURE__ */ new Set();
  const addAnchor = (anchor) => {
    if (!anchor)
      return;
    if (seenHosts.has(anchor.host))
      return;
    seenHosts.add(anchor.host);
    anchors.push(anchor);
  };
  const startAnchor = (_a = options.snapshot.byBlockLineNumber.get(options.segment.startBlockLineNumber)) != null ? _a : options.resolveHandleForBlockLineNumber ? getAnchorPointByBlockLineNumber(
    options.segment.startBlockLineNumber,
    options.resolveHandleForBlockLineNumber
  ) : null;
  const endAnchor = (_b = options.snapshot.byBlockLineNumber.get(options.segment.endBlockLineNumber)) != null ? _b : options.resolveHandleForBlockLineNumber ? getAnchorPointByBlockLineNumber(
    options.segment.endBlockLineNumber,
    options.resolveHandleForBlockLineNumber
  ) : null;
  addAnchor(startAnchor);
  addAnchor(endAnchor);
  const ordered = options.snapshot.ordered;
  for (let i = findFirstAnchorIndexAtOrAfter(ordered, options.segment.startBlockLineNumber); i < ordered.length && ordered[i].blockLineNumber <= options.segment.endBlockLineNumber; i++) {
    addAnchor(ordered[i].anchor);
  }
  if (anchors.length === 0)
    return null;
  const topAnchor = anchors.reduce((best, current) => current.y < best.y ? current : best);
  const bottomAnchor = anchors.reduce((best, current) => current.y > best.y ? current : best);
  return {
    x: (topAnchor.x + bottomAnchor.x) / 2,
    topY: topAnchor.y,
    bottomY: bottomAnchor.y,
    host: topAnchor.host
  };
}

// src/features/selection/editor-local-coordinates.ts
function getEditorAxisScale(rectSize, offsetSize) {
  if (rectSize <= 0 || offsetSize <= 0)
    return 1;
  return rectSize / offsetSize;
}
function viewportXToEditorLocalX(view, viewportX) {
  const rect = view.dom.getBoundingClientRect();
  const scaleX = getEditorAxisScale(rect.width, view.dom.offsetWidth);
  return (viewportX - rect.left) / scaleX - view.dom.clientLeft;
}
function viewportYToEditorLocalY(view, viewportY) {
  const rect = view.dom.getBoundingClientRect();
  const scaleY = getEditorAxisScale(rect.height, view.dom.offsetHeight);
  return (viewportY - rect.top) / scaleY - view.dom.clientTop;
}

// src/features/selection/selection-overlay-renderer.ts
var RangeSelectionOverlayRenderer = class {
  constructor(view, onDeleteSelectionClick, isDeleteButtonEnabledRef) {
    this.view = view;
    this.onDeleteSelectionClick = onDeleteSelectionClick;
    this.isDeleteButtonEnabledRef = isDeleteButtonEnabledRef;
    this.linkEls = [];
    this.currentRenderedBlocks = [];
    this.onDeleteButtonClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!this.isDeleteButtonEnabled())
        return;
      if (!this.onDeleteSelectionClick)
        return;
      if (this.currentRenderedBlocks.length === 0)
        return;
      const blocks = this.currentRenderedBlocks.map((block) => ({
        startLineNumber: block.startLineNumber,
        endLineNumber: block.endLineNumber
      }));
      this.onDeleteSelectionClick(blocks);
    };
    this.deleteButtonEl = document.createElement("button");
    this.deleteButtonEl.type = "button";
    this.deleteButtonEl.className = RANGE_SELECTION_DELETE_BUTTON_CLASS;
    this.deleteButtonEl.setAttribute("aria-label", "Delete selected blocks");
    this.deleteButtonEl.textContent = "Delete";
    this.deleteButtonEl.addEventListener("click", this.onDeleteButtonClick);
  }
  render(blocks, segments, resolveRangeAnchorSpan) {
    this.currentRenderedBlocks = blocks.map((block) => ({
      startLineNumber: block.startLineNumber,
      endLineNumber: block.endLineNumber
    }));
    const hostOriginCache = /* @__PURE__ */ new WeakMap();
    const getHostOrigin = (host) => {
      const cached = hostOriginCache.get(host);
      if (cached)
        return cached;
      const hostRect = host.getBoundingClientRect();
      const origin = {
        x: viewportXToEditorLocalX(this.view, hostRect.left),
        y: viewportYToEditorLocalY(this.view, hostRect.top)
      };
      hostOriginCache.set(host, origin);
      return origin;
    };
    const viewportXToHostLocalX = (host, viewportX) => viewportXToEditorLocalX(this.view, viewportX) - getHostOrigin(host).x;
    const viewportYToHostLocalY = (host, viewportY) => viewportYToEditorLocalY(this.view, viewportY) - getHostOrigin(host).y;
    let buttonAnchor = null;
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const anchorSpan = resolveRangeAnchorSpan(segment);
      const link = this.ensureLinkEl(i);
      if (!anchorSpan) {
        link.classList.remove("is-active");
        continue;
      }
      if (link.parentElement !== anchorSpan.host) {
        anchorSpan.host.appendChild(link);
      }
      const top = viewportYToHostLocalY(anchorSpan.host, anchorSpan.topY);
      const bottom = viewportYToHostLocalY(anchorSpan.host, anchorSpan.bottomY);
      const linkTop = Math.min(top, bottom);
      const linkHeight = Math.max(2, Math.abs(bottom - top));
      const left = viewportXToHostLocalX(anchorSpan.host, anchorSpan.x);
      if (!buttonAnchor || anchorSpan.topY < buttonAnchor.topY) {
        buttonAnchor = { topY: anchorSpan.topY, x: anchorSpan.x, host: anchorSpan.host };
      }
      link.classList.add("is-active");
      link.setCssStyles({
        left: `${left.toFixed(2)}px`,
        top: `${linkTop.toFixed(2)}px`,
        height: `${linkHeight.toFixed(2)}px`
      });
    }
    for (let i = segments.length; i < this.linkEls.length; i++) {
      this.linkEls[i].classList.remove("is-active");
    }
    if (!this.isDeleteButtonEnabled() || blocks.length === 0 || !buttonAnchor) {
      this.hideDeleteButton();
      return;
    }
    if (this.deleteButtonEl.parentElement !== buttonAnchor.host) {
      buttonAnchor.host.appendChild(this.deleteButtonEl);
    }
    const buttonTop = viewportYToHostLocalY(buttonAnchor.host, buttonAnchor.topY) - 10;
    const buttonLeft = viewportXToHostLocalX(buttonAnchor.host, buttonAnchor.x);
    this.deleteButtonEl.classList.add("is-active");
    this.deleteButtonEl.setCssStyles({
      left: `${buttonLeft.toFixed(2)}px`,
      top: `${buttonTop.toFixed(2)}px`
    });
  }
  clear() {
    for (const link of this.linkEls) {
      link.classList.remove("is-active");
    }
    this.currentRenderedBlocks = [];
    this.hideDeleteButton();
  }
  destroy() {
    this.clear();
    for (const link of this.linkEls) {
      link.remove();
    }
    this.linkEls.length = 0;
    this.deleteButtonEl.removeEventListener("click", this.onDeleteButtonClick);
    this.deleteButtonEl.remove();
  }
  isDeleteButtonEnabled() {
    var _a;
    if (!this.onDeleteSelectionClick)
      return false;
    return ((_a = this.isDeleteButtonEnabledRef) == null ? void 0 : _a.call(this)) === true;
  }
  hideDeleteButton() {
    this.deleteButtonEl.classList.remove("is-active");
  }
  ensureLinkEl(index) {
    const existing = this.linkEls[index];
    if (existing) {
      return existing;
    }
    const link = document.createElement("div");
    link.className = RANGE_SELECTION_LINK_CLASS;
    this.linkEls[index] = link;
    return link;
  }
};

// src/features/selection/selection-visual-manager.ts
var RangeSelectionVisualManager = class {
  constructor(view, onRefreshRequested, resolveVisibleHandleForBlockStart, onDeleteSelectionClick, isDeleteButtonEnabledRef) {
    this.view = view;
    this.onRefreshRequested = onRefreshRequested;
    this.resolveVisibleHandleForBlockStart = resolveVisibleHandleForBlockStart;
    this.handleElements = /* @__PURE__ */ new Set();
    this.handleAnchorSnapshot = emptyAnchorSnapshot();
    this.refreshRafHandle = null;
    this.scrollContainer = null;
    this.overlayRenderer = new RangeSelectionOverlayRenderer(
      this.view,
      onDeleteSelectionClick,
      isDeleteButtonEnabledRef
    );
    this.onScroll = () => this.scheduleRefresh();
    this.bindScrollListener();
  }
  render(blocks) {
    const normalizedBlocks = mergeSelectedBlocks(this.view.state.doc.lines, blocks);
    const segments = groupSegments(normalizedBlocks);
    const nextHandleElements = /* @__PURE__ */ new Set();
    for (const block of normalizedBlocks) {
      const handleEl = this.resolveHandleElementForBlockStart(block.startLineNumber - 1);
      if (handleEl) {
        nextHandleElements.add(handleEl);
      }
    }
    this.handleAnchorSnapshot = buildAnchorSnapshot(nextHandleElements);
    this.syncSelectionElements(
      this.handleElements,
      nextHandleElements,
      RANGE_SELECTED_HANDLE_CLASS
    );
    this.overlayRenderer.render(normalizedBlocks, segments, (segment) => this.resolveRangeAnchorSpan(segment));
  }
  clear() {
    for (const handleEl of this.handleElements) {
      handleEl.classList.remove(RANGE_SELECTED_HANDLE_CLASS);
    }
    this.handleElements.clear();
    this.handleAnchorSnapshot = emptyAnchorSnapshot();
    this.overlayRenderer.clear();
  }
  scheduleRefresh() {
    if (this.refreshRafHandle !== null)
      return;
    this.refreshRafHandle = window.requestAnimationFrame(() => {
      this.refreshRafHandle = null;
      this.onRefreshRequested();
    });
  }
  cancelScheduledRefresh() {
    if (this.refreshRafHandle === null)
      return;
    window.cancelAnimationFrame(this.refreshRafHandle);
    this.refreshRafHandle = null;
  }
  destroy() {
    this.clear();
    this.overlayRenderer.destroy();
    this.cancelScheduledRefresh();
    this.unbindScrollListener();
  }
  bindScrollListener() {
    var _a, _b;
    this.unbindScrollListener();
    const scroller = (_b = (_a = this.view.scrollDOM) != null ? _a : this.view.dom.querySelector(".cm-scroller")) != null ? _b : null;
    if (!scroller)
      return;
    scroller.addEventListener("scroll", this.onScroll, { passive: true });
    this.scrollContainer = scroller;
  }
  unbindScrollListener() {
    if (!this.scrollContainer)
      return;
    this.scrollContainer.removeEventListener("scroll", this.onScroll);
    this.scrollContainer = null;
  }
  syncSelectionElements(current, next, className) {
    for (const el of current) {
      if (next.has(el))
        continue;
      el.classList.remove(className);
    }
    for (const el of next) {
      if (current.has(el))
        continue;
      el.classList.add(className);
    }
    current.clear();
    for (const el of next) {
      current.add(el);
    }
  }
  resolveHandleElementForBlockStart(blockStart) {
    var _a, _b;
    const mapped = this.resolveVisibleHandleForBlockStart(blockStart);
    if (mapped)
      return mapped;
    const selector = `.${DRAG_HANDLE_CLASS}[data-block-start="${blockStart}"]`;
    const handles = Array.from(this.view.dom.querySelectorAll(selector));
    if (handles.length === 0)
      return null;
    return (_b = (_a = handles.find((handle) => !handle.classList.contains(EMBED_HANDLE_CLASS))) != null ? _a : handles[0]) != null ? _b : null;
  }
  resolveRangeAnchorSpan(segment) {
    return resolveAnchorSpan({
      segment,
      snapshot: this.handleAnchorSnapshot,
      resolveHandleForBlockLineNumber: (lineNumber) => this.resolveHandleElementForBlockStart(lineNumber - 1)
    });
  }
};

// src/shared/dom-attrs.ts
var DND_DRAG_SOURCE_STYLE_ATTR = "data-dnd-drag-source-style";
var DND_DRAG_SOURCE_HIGHLIGHT_ATTR = "data-dnd-drag-source-highlight";
var DND_LIST_DROP_HIGHLIGHT_ATTR = "data-dnd-list-drop-highlight";
var DND_HANDLE_ICON_ATTR = "data-dnd-handle-icon";
var DND_MOBILE_GESTURE_LOCK_COUNT_ATTR = "data-dnd-mobile-lock-count";

// src/features/interaction/mobile-gesture-controller.ts
var MOBILE_DRAG_HOTZONE_LEFT_PX = 24;
var MOBILE_DRAG_HOTZONE_RIGHT_PX = 8;
var MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX = 16;
var MOBILE_LINE_HIT_Y_TOLERANCE_PX = 8;
var MOBILE_EMBED_HIT_PADDING_PX = 6;
var MOBILE_LONG_PRESS_EMBED_SELECTOR = EMBED_BLOCK_SELECTOR;
var MobileGestureController = class {
  constructor(view, onFocusIn) {
    this.view = view;
    this.mobileInteractionLocked = false;
    this.focusGuardAttached = false;
    this.onDocumentFocusIn = onFocusIn;
  }
  isMobileEnvironment() {
    const body = document.body;
    if ((body == null ? void 0 : body.classList.contains("is-mobile")) || (body == null ? void 0 : body.classList.contains("is-phone")) || (body == null ? void 0 : body.classList.contains("is-tablet"))) {
      return true;
    }
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return false;
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }
  isWithinContentTolerance(clientX) {
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    const left = contentRect.left - MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX;
    const right = contentRect.right + MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX;
    return clientX >= left && clientX <= right;
  }
  isWithinEditorTolerance(clientX) {
    const editorRect = this.view.dom.getBoundingClientRect();
    const left = editorRect.left - MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX;
    const right = editorRect.right + MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX;
    return clientX >= left && clientX <= right;
  }
  isWithinMobileDragHotzoneBand(clientX) {
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    const left = contentRect.left - MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX;
    const right = contentRect.left + MOBILE_DRAG_HOTZONE_LEFT_PX + MOBILE_DRAG_HOTZONE_RIGHT_PX + MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX;
    return clientX >= left && clientX <= right;
  }
  isWithinMobileDragHotzone(blockInfo, clientX) {
    const lineNumber = blockInfo.startLine + 1;
    if (lineNumber < 1 || lineNumber > this.view.state.doc.lines)
      return false;
    const line = this.view.state.doc.line(lineNumber);
    const lineStart = safeCoordsAtPos(this.view, line.from);
    if (!lineStart)
      return false;
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    const hotzoneLeft = Math.max(
      contentRect.left - MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX,
      lineStart.left - MOBILE_DRAG_HOTZONE_LEFT_PX - MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX
    );
    const hotzoneRight = lineStart.left + MOBILE_DRAG_HOTZONE_RIGHT_PX;
    return clientX >= hotzoneLeft && clientX <= hotzoneRight;
  }
  isWithinMobileTextLineOrEmbedArea(target, clientX, clientY) {
    const embedEl = this.resolveEmbedElement(target, clientX, clientY);
    if (embedEl) {
      return this.isWithinEmbedDragArea(embedEl, clientX, clientY);
    }
    if (!target)
      return false;
    const lineEl = target.closest(".cm-line");
    if (lineEl && this.view.contentDOM.contains(lineEl)) {
      const lineNumber = this.resolveLineNumberFromTarget(target, lineEl);
      if (lineNumber !== null) {
        return this.isWithinLineDragArea(lineNumber, clientX, clientY);
      }
    }
    if (!this.view.contentDOM.contains(target))
      return false;
    const fallbackLineNumber = this.resolveLineNumberFromTarget(target, null);
    if (fallbackLineNumber !== null) {
      return this.isWithinLineDragArea(fallbackLineNumber, clientX, clientY);
    }
    return false;
  }
  lockMobileInteraction() {
    if (this.mobileInteractionLocked)
      return;
    const body = document.body;
    const current = Number(body.getAttribute(DND_MOBILE_GESTURE_LOCK_COUNT_ATTR) || "0");
    const next = current + 1;
    body.setAttribute(DND_MOBILE_GESTURE_LOCK_COUNT_ATTR, String(next));
    body.classList.add(MOBILE_GESTURE_LOCK_CLASS);
    this.view.dom.classList.add(MOBILE_GESTURE_LOCK_CLASS);
    this.mobileInteractionLocked = true;
  }
  unlockMobileInteraction() {
    if (!this.mobileInteractionLocked)
      return;
    const body = document.body;
    const current = Number(body.getAttribute(DND_MOBILE_GESTURE_LOCK_COUNT_ATTR) || "0");
    const next = Math.max(0, current - 1);
    if (next === 0) {
      body.removeAttribute(DND_MOBILE_GESTURE_LOCK_COUNT_ATTR);
      body.classList.remove(MOBILE_GESTURE_LOCK_CLASS);
    } else {
      body.setAttribute(DND_MOBILE_GESTURE_LOCK_COUNT_ATTR, String(next));
    }
    this.view.dom.classList.remove(MOBILE_GESTURE_LOCK_CLASS);
    this.mobileInteractionLocked = false;
  }
  suppressMobileKeyboard(target) {
    var _a;
    const rawActive = target instanceof HTMLElement ? target : document.activeElement;
    const active = rawActive instanceof HTMLElement ? rawActive : null;
    if (!active)
      return;
    if (!this.shouldSuppressFocusTarget(active))
      return;
    if (typeof active.blur === "function") {
      active.blur();
    }
    if (typeof window.getSelection === "function") {
      try {
        (_a = window.getSelection()) == null ? void 0 : _a.removeAllRanges();
      } catch (e) {
      }
    }
  }
  shouldSuppressFocusTarget(target) {
    const isInputControl = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
    const isEditorContent = target.classList.contains("cm-content") || !!target.closest(".cm-content");
    return isInputControl || isEditorContent;
  }
  attachFocusGuard() {
    if (this.focusGuardAttached)
      return;
    document.addEventListener("focusin", this.onDocumentFocusIn, true);
    this.focusGuardAttached = true;
  }
  detachFocusGuard() {
    if (!this.focusGuardAttached)
      return;
    document.removeEventListener("focusin", this.onDocumentFocusIn, true);
    this.focusGuardAttached = false;
  }
  triggerMobileHapticFeedback() {
    const nav = navigator;
    if (typeof nav.vibrate !== "function")
      return;
    try {
      nav.vibrate(10);
    } catch (e) {
    }
  }
  resolveLineNumberFromTarget(target, lineEl) {
    const probes = [target];
    if (lineEl)
      probes.push(lineEl);
    if (target.firstChild)
      probes.push(target.firstChild);
    if (lineEl == null ? void 0 : lineEl.firstChild)
      probes.push(lineEl.firstChild);
    return resolveLineNumberFromDomNodes(this.view, probes);
  }
  isWithinLineDragArea(lineNumber, clientX, clientY) {
    if (!this.isWithinContentTolerance(clientX))
      return false;
    const lineRect = this.resolveLineRect(lineNumber);
    if (!lineRect)
      return false;
    return clientY >= lineRect.top - MOBILE_LINE_HIT_Y_TOLERANCE_PX && clientY <= lineRect.bottom + MOBILE_LINE_HIT_Y_TOLERANCE_PX;
  }
  isWithinEmbedDragArea(embedEl, clientX, clientY) {
    if (!this.isWithinEditorTolerance(clientX))
      return false;
    const rect = embedEl.getBoundingClientRect();
    return clientX >= rect.left - MOBILE_EMBED_HIT_PADDING_PX && clientX <= rect.right + MOBILE_EMBED_HIT_PADDING_PX && clientY >= rect.top - MOBILE_EMBED_HIT_PADDING_PX && clientY <= rect.bottom + MOBILE_EMBED_HIT_PADDING_PX;
  }
  resolveEmbedElement(target, clientX, clientY) {
    if (target) {
      const fromTarget = target.closest(MOBILE_LONG_PRESS_EMBED_SELECTOR);
      if (fromTarget && this.view.dom.contains(fromTarget)) {
        return fromTarget;
      }
    }
    return findEmbedElementAtPoint(this.view, clientX, clientY, {
      requireDirectWithinRoot: true,
      normalizeToEmbedRoot: false
    });
  }
  resolveLineRect(lineNumber) {
    var _a;
    if (lineNumber < 1 || lineNumber > this.view.state.doc.lines)
      return null;
    const line = this.view.state.doc.line(lineNumber);
    const startCoords = safeCoordsAtPos(this.view, line.from, 1);
    const endCoords = (_a = safeCoordsAtPos(this.view, line.to, -1)) != null ? _a : startCoords;
    if (!startCoords || !endCoords)
      return null;
    const top = Math.min(startCoords.top, endCoords.top);
    const bottom = Math.max(startCoords.bottom, endCoords.bottom);
    if (!Number.isFinite(top) || !Number.isFinite(bottom) || bottom <= top)
      return null;
    return { top, bottom };
  }
};

// src/features/interaction/pointer-session-controller.ts
var PointerSessionController = class {
  constructor(view, handlers) {
    this.view = view;
    this.pointerListenersAttached = false;
    this.touchBlockerAttached = false;
    this.pointerCaptureTarget = null;
    this.capturedPointerId = null;
    this.onPointerMove = handlers.onPointerMove;
    this.onPointerUp = handlers.onPointerUp;
    this.onPointerCancel = handlers.onPointerCancel;
    this.onWindowBlur = handlers.onWindowBlur;
    this.onDocumentVisibilityChange = handlers.onDocumentVisibilityChange;
    this.onTouchMove = handlers.onTouchMove;
  }
  attachPointerListeners() {
    if (this.pointerListenersAttached)
      return;
    window.addEventListener("pointermove", this.onPointerMove, { passive: false, capture: true });
    window.addEventListener("pointerup", this.onPointerUp, { passive: false, capture: true });
    window.addEventListener("pointercancel", this.onPointerCancel, { passive: false, capture: true });
    window.addEventListener("blur", this.onWindowBlur);
    document.addEventListener("visibilitychange", this.onDocumentVisibilityChange);
    this.attachTouchBlocker();
    this.pointerListenersAttached = true;
  }
  detachPointerListeners() {
    if (!this.pointerListenersAttached)
      return;
    window.removeEventListener("pointermove", this.onPointerMove, true);
    window.removeEventListener("pointerup", this.onPointerUp, true);
    window.removeEventListener("pointercancel", this.onPointerCancel, true);
    window.removeEventListener("blur", this.onWindowBlur);
    document.removeEventListener("visibilitychange", this.onDocumentVisibilityChange);
    this.detachTouchBlocker();
    this.pointerListenersAttached = false;
  }
  tryCapturePointer(e) {
    this.releasePointerCapture();
    const candidates = [this.view.dom];
    const target = e.target;
    if (target instanceof Element && target !== this.view.dom) {
      candidates.push(target);
    }
    for (const candidate of candidates) {
      if (typeof candidate.setPointerCapture !== "function")
        continue;
      try {
        candidate.setPointerCapture(e.pointerId);
        this.pointerCaptureTarget = candidate;
        this.capturedPointerId = e.pointerId;
        return;
      } catch (e2) {
      }
    }
  }
  tryCapturePointerById(pointerId) {
    if (typeof this.view.dom.setPointerCapture !== "function")
      return;
    try {
      this.view.dom.setPointerCapture(pointerId);
      this.pointerCaptureTarget = this.view.dom;
      this.capturedPointerId = pointerId;
    } catch (e) {
    }
  }
  releasePointerCapture() {
    if (!this.pointerCaptureTarget || this.capturedPointerId === null)
      return;
    if (typeof this.pointerCaptureTarget.releasePointerCapture === "function") {
      try {
        this.pointerCaptureTarget.releasePointerCapture(this.capturedPointerId);
      } catch (e) {
      }
    }
    this.pointerCaptureTarget = null;
    this.capturedPointerId = null;
  }
  attachTouchBlocker() {
    if (this.touchBlockerAttached)
      return;
    document.addEventListener("touchmove", this.onTouchMove, { passive: false, capture: true });
    window.addEventListener("touchmove", this.onTouchMove, { passive: false, capture: true });
    this.touchBlockerAttached = true;
  }
  detachTouchBlocker() {
    if (!this.touchBlockerAttached)
      return;
    document.removeEventListener("touchmove", this.onTouchMove, true);
    window.removeEventListener("touchmove", this.onTouchMove, true);
    this.touchBlockerAttached = false;
  }
};

// src/core/block/block-factory.ts
var import_state2 = require("@codemirror/state");

// src/core/parser/fence-scanner.ts
var fenceLazyScanCache = /* @__PURE__ */ new WeakMap();
function isSingleLineMathFence(lineText) {
  const trimmed = lineText.trimStart();
  if (!trimmed.startsWith("$$"))
    return false;
  return trimmed.slice(2).includes("$$");
}
function assignFenceRangeByLine(rangeByLine, startLine, endLine) {
  const range = { startLine, endLine };
  for (let i = startLine; i <= endLine; i++) {
    rangeByLine.set(i, range);
  }
}
function createFenceLazyScanState() {
  return {
    scannedUntilLine: 0,
    openCodeStartLine: 0,
    openMathStartLine: 0,
    fullyScanned: false,
    codeRangeByLine: /* @__PURE__ */ new Map(),
    mathRangeByLine: /* @__PURE__ */ new Map()
  };
}
function getFenceLazyScanState(doc) {
  const cached = fenceLazyScanCache.get(doc);
  if (cached)
    return cached;
  const created = createFenceLazyScanState();
  fenceLazyScanCache.set(doc, created);
  return created;
}
function scanFenceLine(state, lineNumber, text) {
  if (state.openCodeStartLine !== 0) {
    if (isCodeFenceLine(text)) {
      assignFenceRangeByLine(state.codeRangeByLine, state.openCodeStartLine, lineNumber);
      state.openCodeStartLine = 0;
    }
    return;
  }
  if (state.openMathStartLine !== 0) {
    if (isMathFenceLine(text)) {
      assignFenceRangeByLine(state.mathRangeByLine, state.openMathStartLine, lineNumber);
      state.openMathStartLine = 0;
    }
    return;
  }
  if (isCodeFenceLine(text)) {
    state.openCodeStartLine = lineNumber;
    return;
  }
  if (isMathFenceLine(text)) {
    if (isSingleLineMathFence(text)) {
      assignFenceRangeByLine(state.mathRangeByLine, lineNumber, lineNumber);
    } else {
      state.openMathStartLine = lineNumber;
    }
  }
}
function finalizeFenceStateAtDocEnd(state) {
  if (state.openCodeStartLine !== 0) {
    assignFenceRangeByLine(state.codeRangeByLine, state.openCodeStartLine, state.openCodeStartLine);
    state.openCodeStartLine = 0;
  }
  state.openMathStartLine = 0;
  state.fullyScanned = true;
}
function ensureFenceScanComplete(doc) {
  const state = getFenceLazyScanState(doc);
  if (state.fullyScanned)
    return state;
  let cursor = state.scannedUntilLine + 1;
  while (cursor <= doc.lines) {
    scanFenceLine(state, cursor, doc.line(cursor).text);
    cursor++;
  }
  state.scannedUntilLine = Math.max(state.scannedUntilLine, cursor - 1);
  finalizeFenceStateAtDocEnd(state);
  return state;
}
function prewarmFenceScan(doc) {
  ensureFenceScanComplete(doc);
}
function findMathBlockRange(doc, lineNumber) {
  var _a;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const state = ensureFenceScanComplete(doc);
  return (_a = state.mathRangeByLine.get(lineNumber)) != null ? _a : null;
}
function findCodeBlockRange(doc, lineNumber) {
  var _a;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const state = ensureFenceScanComplete(doc);
  return (_a = state.codeRangeByLine.get(lineNumber)) != null ? _a : null;
}

// src/core/block/block-factory.ts
var LIST_UNORDERED_RE = /^[-*+]\s/;
var LIST_ORDERED_RE = /^\d+\.\s/;
var LIST_TASK_RE = /^[-*+]\s\[[ x]\]/;
var CODE_FENCE_RE = /^```/;
var MATH_FENCE_RE = /^\$\$/;
var BLOCKQUOTE_RE = /^>/;
var TABLE_RE = /^\|/;
function getHeadingLevel(lineText) {
  const trimmed = lineText.trimStart();
  const match = trimmed.match(/^(#{1,6})\s+/);
  if (!match)
    return null;
  return match[1].length;
}
function getHeadingSectionRange(doc, lineNumber) {
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const currentHeadingLevel = getHeadingLevel(doc.line(lineNumber).text);
  if (!currentHeadingLevel)
    return null;
  let endLine = lineNumber;
  for (let i = lineNumber + 1; i <= doc.lines; i++) {
    const nextHeadingLevel = getHeadingLevel(doc.line(i).text);
    if (nextHeadingLevel !== null && nextHeadingLevel <= currentHeadingLevel) {
      break;
    }
    endLine = i;
  }
  return { startLine: lineNumber, endLine };
}
function detectBlockType(lineText) {
  const trimmed = lineText.trimStart();
  if (getHeadingLevel(lineText) !== null) {
    return "heading" /* Heading */;
  }
  if (isHorizontalRuleLine(trimmed)) {
    return "hr" /* HorizontalRule */;
  }
  if (LIST_UNORDERED_RE.test(trimmed) || LIST_ORDERED_RE.test(trimmed) || LIST_TASK_RE.test(trimmed)) {
    return "list-item" /* ListItem */;
  }
  if (CODE_FENCE_RE.test(trimmed)) {
    return "code-block" /* CodeBlock */;
  }
  if (MATH_FENCE_RE.test(trimmed)) {
    return "math-block" /* MathBlock */;
  }
  if (BLOCKQUOTE_RE.test(trimmed)) {
    return "blockquote" /* Blockquote */;
  }
  if (TABLE_RE.test(trimmed)) {
    return "table" /* Table */;
  }
  if (trimmed.length === 0) {
    return "unknown" /* Unknown */;
  }
  return "paragraph" /* Paragraph */;
}
function getIndentLevel(lineText, tabSize = 2) {
  const match = lineText.match(/^(\s*)/);
  if (!match)
    return 0;
  const spaces = match[1];
  const width = getIndentWidthWithTabSize(spaces, tabSize);
  const unit = tabSize > 0 ? tabSize : 2;
  return Math.floor(width / unit);
}
function getIndentWidthWithTabSize(indentRaw, tabSize) {
  const unit = tabSize > 0 ? tabSize : 2;
  let width = 0;
  for (const ch of indentRaw) {
    width += ch === "	" ? unit : 1;
  }
  return width;
}
function getIndentWidth(lineText, tabSize) {
  const match = lineText.match(/^(\s*)/);
  if (!match)
    return 0;
  return getIndentWidthWithTabSize(match[1], tabSize);
}
function parseListMarker(lineText, tabSize) {
  const match = lineText.match(/^(\s*)([-*+])\s\[[ xX]\]\s+/);
  if (match) {
    return { isListItem: true, indentWidth: getIndentWidthWithTabSize(match[1], tabSize) };
  }
  const unorderedMatch = lineText.match(/^(\s*)([-*+])\s+/);
  if (unorderedMatch) {
    return { isListItem: true, indentWidth: getIndentWidthWithTabSize(unorderedMatch[1], tabSize) };
  }
  const orderedMatch = lineText.match(/^(\s*)(\d+)[.)]\s+/);
  if (orderedMatch) {
    return { isListItem: true, indentWidth: getIndentWidthWithTabSize(orderedMatch[1], tabSize) };
  }
  return { isListItem: false, indentWidth: getIndentWidth(lineText, tabSize) };
}
function isCalloutHeader(restText) {
  return restText.trimStart().startsWith("[!");
}
function isInsideCalloutContainer(doc, lineNumber, depth) {
  for (let i = lineNumber; i >= 1; i--) {
    const text = doc.line(i).text;
    const lineDepth = getBlockquoteDepthFromLine(text);
    if (lineDepth === 0 || lineDepth < depth)
      break;
    const info = splitBlockquotePrefix(text);
    if (isCalloutHeader(info.rest))
      return true;
  }
  return false;
}
function getBlockquoteContainerRange(doc, lineNumber, depth) {
  let startLine = lineNumber;
  for (let i = lineNumber - 1; i >= 1; i--) {
    const d = getBlockquoteDepthFromLine(doc.line(i).text);
    if (d === 0 || d < depth)
      break;
    startLine = i;
  }
  let endLine = lineNumber;
  for (let i = lineNumber + 1; i <= doc.lines; i++) {
    const d = getBlockquoteDepthFromLine(doc.line(i).text);
    if (d === 0 || d < depth)
      break;
    endLine = i;
  }
  return { startLine, endLine };
}
function getListItemOwnRange(doc, lineNumber, tabSize) {
  const lineText = doc.line(lineNumber).text;
  const currentInfo = parseListMarker(lineText, tabSize);
  const currentIndent = currentInfo.indentWidth;
  let endLine = lineNumber;
  for (let i = lineNumber + 1; i <= doc.lines; i++) {
    const nextLine = doc.line(i);
    const nextText = nextLine.text;
    if (nextText.trim().length === 0) {
      const lookahead = findNextNonEmptyLine(doc, i + 1, tabSize);
      if (!lookahead || lookahead.indentWidth <= currentIndent || lookahead.isListItem) {
        break;
      }
      endLine = i;
      continue;
    }
    const nextInfo = parseListMarker(nextText, tabSize);
    if (nextInfo.isListItem) {
      break;
    }
    const nextIndent = getIndentWidth(nextText, tabSize);
    const nextType = detectBlockType(nextText);
    if (nextType !== "paragraph" /* Paragraph */) {
      break;
    }
    if (nextIndent > currentIndent) {
      endLine = i;
      continue;
    }
    break;
  }
  return { startLine: lineNumber, endLine };
}
function getListItemSubtreeRange(doc, lineNumber, tabSize) {
  const lineText = doc.line(lineNumber).text;
  const currentInfo = parseListMarker(lineText, tabSize);
  const currentIndent = currentInfo.indentWidth;
  let endLine = lineNumber;
  for (let i = lineNumber + 1; i <= doc.lines; i++) {
    const nextLine = doc.line(i);
    const nextText = nextLine.text;
    if (nextText.trim().length === 0) {
      const lookahead = findNextNonEmptyLine(doc, i + 1, tabSize);
      if (!lookahead || lookahead.isListItem && lookahead.indentWidth <= currentIndent || lookahead.indentWidth <= currentIndent) {
        break;
      }
      endLine = i;
      continue;
    }
    const nextInfo = parseListMarker(nextText, tabSize);
    if (nextInfo.isListItem && nextInfo.indentWidth <= currentIndent) {
      break;
    }
    const nextIndent = getIndentWidth(nextText, tabSize);
    if (nextInfo.isListItem || nextIndent > currentIndent) {
      endLine = i;
      continue;
    }
    break;
  }
  return { startLine: lineNumber, endLine };
}
function findNextNonEmptyLine(doc, fromLine, tabSize) {
  for (let i = fromLine; i <= doc.lines; i++) {
    const text = doc.line(i).text;
    if (text.trim().length === 0)
      continue;
    const info = parseListMarker(text, tabSize);
    return { isListItem: info.isListItem, indentWidth: info.indentWidth };
  }
  return null;
}
var blockDetectionCache = /* @__PURE__ */ new WeakMap();
var LIST_LINE_MAP_COLD_BUILD_MAX_LINES = 3e4;
var YAML_FENCE_RE = /^-{3}\s*$/;
var yamlFrontmatterEndLineCache = /* @__PURE__ */ new WeakMap();
function getYamlFrontmatterEndLine(doc) {
  const cached = yamlFrontmatterEndLineCache.get(doc);
  if (cached !== void 0)
    return cached;
  let endLine = 0;
  if (doc.lines >= 2 && YAML_FENCE_RE.test(doc.line(1).text)) {
    for (let i = 2; i <= doc.lines; i++) {
      if (YAML_FENCE_RE.test(doc.line(i).text)) {
        endLine = i;
        break;
      }
    }
  }
  yamlFrontmatterEndLineCache.set(doc, endLine);
  return endLine;
}
function isInsideYamlFrontmatter(doc, lineNumber) {
  const endLine = getYamlFrontmatterEndLine(doc);
  return endLine > 0 && lineNumber >= 1 && lineNumber <= endLine;
}
var detectBlockPerfRecorder = null;
function recordDetectBlockPerf(key, durationMs) {
  if (!detectBlockPerfRecorder)
    return;
  if (!isFinite(durationMs) || durationMs < 0)
    return;
  detectBlockPerfRecorder(key, durationMs);
}
function setDetectBlockPerfRecorder(recorder) {
  detectBlockPerfRecorder = recorder;
}
function detectBlockUncached(state, lineNumber, tabSize) {
  const doc = state.doc;
  if (lineNumber < 1 || lineNumber > doc.lines) {
    return null;
  }
  if (isInsideYamlFrontmatter(doc, lineNumber)) {
    return null;
  }
  const line = doc.line(lineNumber);
  const lineText = line.text;
  let blockType = detectBlockType(lineText);
  const codeRange = findCodeBlockRange(doc, lineNumber);
  const mathRange = findMathBlockRange(doc, lineNumber);
  if (codeRange) {
    blockType = "code-block" /* CodeBlock */;
  }
  if (mathRange) {
    blockType = "math-block" /* MathBlock */;
  }
  if (blockType === "unknown" /* Unknown */) {
    return null;
  }
  let startLine = lineNumber;
  let endLine = lineNumber;
  if (blockType === "code-block" /* CodeBlock */ && codeRange) {
    startLine = codeRange.startLine;
    endLine = codeRange.endLine;
  }
  if (blockType === "math-block" /* MathBlock */ && mathRange) {
    startLine = mathRange.startLine;
    endLine = mathRange.endLine;
  }
  if (blockType === "list-item" /* ListItem */) {
    let lineMap = peekCachedLineMap(state, { tabSize });
    if (!lineMap && doc.lines <= LIST_LINE_MAP_COLD_BUILD_MAX_LINES) {
      lineMap = getLineMap(state, { tabSize });
    }
    const lineMeta = lineMap ? getLineMetaAt(lineMap, lineNumber) : null;
    const subtreeEndLine = (lineMeta == null ? void 0 : lineMeta.isList) && lineMap ? lineMap.listSubtreeEndLine[lineNumber] : 0;
    if (subtreeEndLine >= lineNumber) {
      endLine = subtreeEndLine;
    } else {
      const range = getListItemSubtreeRange(doc, lineNumber, tabSize);
      endLine = range.endLine;
    }
  }
  if (blockType === "blockquote" /* Blockquote */) {
    const quoteDepth = getBlockquoteDepthFromLine(lineText);
    const inCallout = isInsideCalloutContainer(doc, lineNumber, quoteDepth);
    if (inCallout) {
      const range = getBlockquoteContainerRange(doc, lineNumber, quoteDepth);
      startLine = range.startLine;
      endLine = range.endLine;
      blockType = "callout" /* Callout */;
    } else {
      startLine = lineNumber;
      endLine = lineNumber;
      blockType = "blockquote" /* Blockquote */;
    }
  }
  if (blockType === "table" /* Table */) {
    for (let i = lineNumber - 1; i >= 1; i--) {
      const prevLine = doc.line(i);
      if (isTableLine(prevLine.text)) {
        startLine = i;
      } else {
        break;
      }
    }
  }
  if (blockType === "table" /* Table */) {
    for (let i = lineNumber + 1; i <= doc.lines; i++) {
      const nextLine = doc.line(i);
      if (isTableLine(nextLine.text)) {
        endLine = i;
      } else {
        break;
      }
    }
  }
  const startLineObj = doc.line(startLine);
  const endLineObj = doc.line(endLine);
  const startLineText = startLineObj.text;
  let content = "";
  for (let i = startLine; i <= endLine; i++) {
    content += doc.line(i).text;
    if (i < endLine)
      content += "\n";
  }
  return {
    type: blockType,
    startLine: startLine - 1,
    // 转为0-indexed
    endLine: endLine - 1,
    from: startLineObj.from,
    to: endLineObj.to,
    indentLevel: getIndentLevel(startLineText, tabSize),
    content
  };
}
function safeTabSize(state) {
  if (state && typeof state === "object" && "facet" in state && typeof state.facet === "function") {
    try {
      return state.facet(import_state2.EditorState.tabSize) || 2;
    } catch (e) {
    }
  }
  return 2;
}
function detectBlock(state, lineNumber) {
  var _a;
  const doc = state.doc;
  const tabSize = safeTabSize(state);
  let cacheByTabSize = blockDetectionCache.get(doc);
  if (!cacheByTabSize) {
    cacheByTabSize = /* @__PURE__ */ new Map();
    blockDetectionCache.set(doc, cacheByTabSize);
  }
  let perDocCache = cacheByTabSize.get(tabSize);
  if (!perDocCache) {
    perDocCache = /* @__PURE__ */ new Map();
    cacheByTabSize.set(tabSize, perDocCache);
  }
  if (perDocCache.has(lineNumber)) {
    return (_a = perDocCache.get(lineNumber)) != null ? _a : null;
  }
  const startedAt = nowMs();
  const detected = detectBlockUncached(state, lineNumber, tabSize);
  recordDetectBlockPerf("detect_block_uncached", nowMs() - startedAt);
  perDocCache.set(lineNumber, detected);
  return detected;
}
function getListItemOwnRangeForHandle(state, lineNumber) {
  const doc = state.doc;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const lineText = doc.line(lineNumber).text;
  const blockType = detectBlockType(lineText);
  const tabSize = state.facet(import_state2.EditorState.tabSize) || 2;
  if (blockType === "list-item" /* ListItem */) {
    return getListItemOwnRange(doc, lineNumber, tabSize);
  }
  return null;
}

// src/features/selection/selection-model.ts
function cloneBlockInfo(block) {
  return {
    ...block,
    compositeSelection: block.compositeSelection ? {
      ranges: block.compositeSelection.ranges.map((range) => ({ ...range }))
    } : void 0
  };
}
function buildSelectedBlockRangeFromBlockInfo(block) {
  return {
    startLineNumber: block.startLine + 1,
    endLineNumber: block.endLine + 1
  };
}
function buildBlockInfoFromRange(doc, startLineNumber, endLineNumber, template) {
  const safeStart = clampLineNumber2(doc.lines, startLineNumber);
  const safeEnd = Math.max(safeStart, clampLineNumber2(doc.lines, endLineNumber));
  const startLine = doc.line(safeStart);
  const endLine = doc.line(safeEnd);
  return {
    type: template.type,
    startLine: safeStart - 1,
    endLine: safeEnd - 1,
    from: startLine.from,
    to: endLine.to,
    indentLevel: template.indentLevel,
    content: doc.sliceString(startLine.from, endLine.to)
  };
}
function buildDragSourceBlockFromBlocks(doc, blocks, template) {
  const normalizedBlocks = mergeSelectedBlocks(doc.lines, blocks);
  if (normalizedBlocks.length === 0) {
    return buildBlockInfoFromRange(doc, template.startLine + 1, template.endLine + 1, template);
  }
  const segments = groupSelectedBlocksIntoSegments(doc.lines, normalizedBlocks);
  if (segments.length === 1) {
    const [segment] = segments;
    return buildBlockInfoFromRange(doc, segment.startLineNumber, segment.endLineNumber, template);
  }
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const firstLine = doc.line(firstSegment.startLineNumber);
  const lastLine = doc.line(lastSegment.endLineNumber);
  const content = segments.map((segment) => {
    const startLine = doc.line(segment.startLineNumber);
    const endLine = doc.line(segment.endLineNumber);
    const from = startLine.from;
    const to = endLine.to;
    return doc.sliceString(from, to);
  }).join("\n");
  return {
    type: template.type,
    startLine: firstSegment.startLineNumber - 1,
    endLine: lastSegment.endLineNumber - 1,
    from: firstLine.from,
    to: lastLine.to,
    indentLevel: template.indentLevel,
    content,
    compositeSelection: {
      ranges: segments.map((segment) => ({
        startLine: segment.startLineNumber - 1,
        endLine: segment.endLineNumber - 1
      }))
    }
  };
}
function resolveBlockBoundaryAtLine(state, lineNumber) {
  const doc = state.doc;
  const clampedLine = Math.max(1, Math.min(doc.lines, lineNumber));
  const block = detectBlock(state, clampedLine);
  if (!block) {
    return {
      startLineNumber: clampedLine,
      endLineNumber: clampedLine
    };
  }
  return {
    startLineNumber: Math.max(1, block.startLine + 1),
    endLineNumber: Math.min(doc.lines, block.endLine + 1)
  };
}
function buildRangeSelectionBoundaryFromBlock(doc, block) {
  const startLineNumber = clampLineNumber2(doc.lines, block.startLine + 1);
  const endLineNumber = clampLineNumber2(doc.lines, block.endLine + 1);
  const representativeLineNumber = Math.max(
    startLineNumber,
    Math.min(endLineNumber, doc.lineAt(block.from).number)
  );
  return {
    startLineNumber,
    endLineNumber,
    representativeLineNumber
  };
}
function collectSelectedBlocksBetween(state, anchorStartLineNumber, anchorEndLineNumber, targetBlockStartLineNumber, targetBlockEndLineNumber) {
  const docLines = state.doc.lines;
  const startLineNumber = Math.max(
    1,
    Math.min(docLines, Math.min(anchorStartLineNumber, targetBlockStartLineNumber))
  );
  const endLineNumber = Math.max(
    1,
    Math.min(docLines, Math.max(anchorEndLineNumber, targetBlockEndLineNumber))
  );
  const blocks = [];
  let cursor = startLineNumber;
  while (cursor <= endLineNumber) {
    const boundary = resolveBlockBoundaryAtLine(state, cursor);
    blocks.push({
      startLineNumber: boundary.startLineNumber,
      endLineNumber: boundary.endLineNumber
    });
    cursor = Math.max(cursor + 1, boundary.endLineNumber + 1);
  }
  return mergeSelectedBlocks(docLines, blocks);
}

// src/features/selection/hit-boundary.ts
function safeGetBlockInfoAtPoint(getBlockInfoAtPoint, clientX, clientY) {
  try {
    return getBlockInfoAtPoint(clientX, clientY);
  } catch (e) {
    return null;
  }
}
function resolveRangeBoundaryAtPoint(view, clientX, clientY, getBlockInfoAtPoint) {
  const doc = view.state.doc;
  if (doc.lines <= 0)
    return null;
  const block = safeGetBlockInfoAtPoint(getBlockInfoAtPoint, clientX, clientY);
  if (!block)
    return null;
  return buildRangeSelectionBoundaryFromBlock(doc, block);
}

// src/shared/drag.ts
var DND_BLOCK_TRANSFER_MIME_TYPE = "application/dnd-block";

// src/features/interaction/drag-transfer-guard.ts
function resolveDragTransferGuard(params) {
  const { event, isCrossEditorDrag, isCrossFileDragEnabled } = params;
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return {
      decision: "ignore",
      dropEffect: "none"
    };
  }
  const hasPluginPayloadType = Array.from(dataTransfer.types).includes(DND_BLOCK_TRANSFER_MIME_TYPE);
  if (!hasPluginPayloadType) {
    return {
      decision: "ignore",
      dropEffect: "none"
    };
  }
  if (!isCrossEditorDrag || isCrossFileDragEnabled) {
    return {
      decision: "allow",
      dropEffect: "move"
    };
  }
  return {
    decision: "block",
    dropEffect: "none"
  };
}

// src/features/selection/selection-grip-hit.ts
var RANGE_SELECTION_GRIP_HIT_PADDING_PX = 20;
var RANGE_SELECTION_GRIP_HIT_X_PADDING_PX = 28;
function getCommittedSelectionAnchorMaxX(committedSelection, resolveAnchorSpan2) {
  let maxX = null;
  const segments = groupSelectedBlocksIntoSegments(
    committedSelection.selectedBlock.endLine + 1,
    committedSelection.blocks
  );
  for (const segment of segments) {
    const anchorSpan = resolveAnchorSpan2(segment);
    if (!anchorSpan)
      continue;
    maxX = maxX === null ? anchorSpan.x : Math.max(maxX, anchorSpan.x);
  }
  return maxX;
}
function shouldClearCommittedSelectionOnPointerDown(options) {
  const committedSelection = options.committedSelection;
  if (!committedSelection)
    return false;
  if (options.target.closest(`.${RANGE_SELECTION_LINK_CLASS}`))
    return false;
  if (options.target.closest(`.${RANGE_SELECTED_HANDLE_CLASS}`))
    return false;
  if (options.target.closest(`.${DRAG_HANDLE_CLASS}`))
    return false;
  if (options.pointerType && options.pointerType !== "mouse") {
    if (!options.isWithinContentTolerance(options.clientX)) {
      return true;
    }
    const inContent = options.contentDOM.contains(options.target) || !!options.target.closest(CODEMIRROR_CONTENT_SELECTOR);
    const inGutter = !!options.target.closest(CODEMIRROR_GUTTERS_SELECTOR);
    return !inContent && !inGutter;
  }
  const anchorMaxX = getCommittedSelectionAnchorMaxX(committedSelection, options.resolveAnchorSpan);
  if (anchorMaxX === null)
    return false;
  return options.clientX > anchorMaxX + RANGE_SELECTION_GRIP_HIT_X_PADDING_PX;
}
function isCommittedSelectionGripHit(options) {
  const committedSelection = options.committedSelection;
  if (!committedSelection)
    return false;
  const hitLink = options.target.closest(`.${RANGE_SELECTION_LINK_CLASS}`);
  if (hitLink)
    return true;
  const hitHandle = options.target.closest(`.${RANGE_SELECTED_HANDLE_CLASS}`);
  if (hitHandle)
    return true;
  if (options.pointerType && options.pointerType !== "mouse") {
    if (!options.isWithinMobileDragHotzoneBand(options.clientX)) {
      return false;
    }
  }
  const segments = groupSelectedBlocksIntoSegments(
    committedSelection.selectedBlock.endLine + 1,
    committedSelection.blocks
  );
  for (const segment of segments) {
    const anchorSpan = options.resolveAnchorSpan(segment);
    if (!anchorSpan)
      continue;
    if (!options.pointerType || options.pointerType === "mouse") {
      if (Math.abs(options.clientX - anchorSpan.x) > RANGE_SELECTION_GRIP_HIT_X_PADDING_PX) {
        continue;
      }
    }
    const top = anchorSpan.topY - RANGE_SELECTION_GRIP_HIT_PADDING_PX;
    const bottom = anchorSpan.bottomY + RANGE_SELECTION_GRIP_HIT_PADDING_PX;
    if (options.clientY >= top && options.clientY <= bottom) {
      return true;
    }
  }
  return false;
}

// src/features/selection/selection-session-flow.ts
function resolveRangeSelectConfig(pointerType, mouseLongPressMs, getTouchRangeSelectLongPressMs) {
  if (pointerType === "mouse") {
    return {
      longPressMs: mouseLongPressMs
    };
  }
  return {
    longPressMs: getTouchRangeSelectLongPressMs()
  };
}
function createInitialRangeSelectionState(options) {
  var _a, _b;
  const anchorStartLineNumber = options.blockInfo.startLine + 1;
  const anchorEndLineNumber = options.blockInfo.endLine + 1;
  if (anchorStartLineNumber < 1 || anchorEndLineNumber > options.doc.lines || anchorStartLineNumber > anchorEndLineNumber) {
    return null;
  }
  const anchorBlock = buildSelectedBlockRangeFromBlockInfo(options.blockInfo);
  const operation = isSelectedBlockCoveredByBlocks(
    options.doc.lines,
    anchorBlock,
    options.committedBlocksSnapshot
  ) ? "remove" : "add";
  const selectionBlocks = operation === "remove" ? subtractSelectedBlocks(options.doc.lines, options.committedBlocksSnapshot, [anchorBlock]) : mergeSelectedBlocks(options.doc.lines, [...options.committedBlocksSnapshot, anchorBlock]);
  const anchorSelectionBlock = buildDragSourceBlockFromBlocks(options.doc, selectionBlocks, options.blockInfo);
  const sourceHandleDraggableAttr = (_b = (_a = options.sourceHandle) == null ? void 0 : _a.getAttribute("draggable")) != null ? _b : null;
  return {
    anchorSelectionBlock,
    directDragSourceBlock: cloneBlockInfo(options.blockInfo),
    activeSelectionBlock: anchorSelectionBlock,
    operation,
    preferLongPressDrag: false,
    selectionGestureStarted: false,
    pointerId: options.pointerId,
    startX: options.startX,
    startY: options.startY,
    latestX: options.startX,
    latestY: options.startY,
    pointerType: options.pointerType,
    dragReady: options.pointerType === "mouse",
    longPressReady: false,
    isIntercepting: options.pointerType !== "mouse",
    timeoutId: null,
    dragTimeoutId: null,
    sourceHandle: options.sourceHandle,
    sourceHandleDraggableAttr,
    anchorStartLineNumber,
    anchorEndLineNumber,
    currentLineNumber: anchorEndLineNumber,
    committedBlocksSnapshot: options.committedBlocksSnapshot,
    selectionBlocks
  };
}
function autoScrollRangeSelection(scroller, clientY) {
  const rect = scroller.getBoundingClientRect();
  const edgeZone = 44;
  let delta = 0;
  if (clientY < rect.top + edgeZone) {
    delta = -Math.min(22, (rect.top + edgeZone - clientY) * 0.35 + 2);
  } else if (clientY > rect.bottom - edgeZone) {
    delta = Math.min(22, (clientY - (rect.bottom - edgeZone)) * 0.35 + 2);
  }
  if (delta === 0)
    return;
  scroller.scrollTop += delta;
}

// src/features/selection/selection-state.ts
function computeUpdatedSelectionState(editorState, state, target) {
  const activeBlocks = collectSelectedBlocksBetween(
    editorState,
    state.anchorStartLineNumber,
    state.anchorEndLineNumber,
    target.startLineNumber,
    target.endLineNumber
  );
  const docLines = editorState.doc.lines;
  const selectionBlocks = state.operation === "remove" ? subtractSelectedBlocks(docLines, state.committedBlocksSnapshot, activeBlocks) : mergeSelectedBlocks(docLines, [
    ...state.committedBlocksSnapshot,
    ...activeBlocks
  ]);
  const activeSelectionBlock = buildDragSourceBlockFromBlocks(
    editorState.doc,
    selectionBlocks,
    state.anchorSelectionBlock
  );
  return {
    currentLineNumber: target.representativeLineNumber,
    selectionBlocks,
    activeSelectionBlock
  };
}
function buildCommittedRangeSelection(doc, selectionBlocks, templateBlock) {
  const committedBlocks = mergeSelectedBlocks(doc.lines, selectionBlocks);
  if (committedBlocks.length === 0) {
    return null;
  }
  const selectedBlock = buildDragSourceBlockFromBlocks(doc, committedBlocks, templateBlock);
  return {
    selectedBlock,
    blocks: committedBlocks
  };
}
function buildCommittedRangeDeletionChanges(doc, blocks) {
  return groupSelectedBlocksIntoSegments(doc.lines, blocks).map((segment) => {
    const startLineNumber = Math.max(1, Math.min(doc.lines, segment.startLineNumber));
    const endLineNumber = Math.max(startLineNumber, Math.min(doc.lines, segment.endLineNumber));
    const from = doc.line(startLineNumber).from;
    const endLine = doc.line(endLineNumber);
    const to = endLineNumber === doc.lines ? doc.length : Math.min(doc.length, endLine.to + 1);
    return { from, to };
  }).filter((change) => change.to > change.from);
}

// src/features/selection/selection-flow.ts
function autoScrollSelectionRange(view, clientY) {
  var _a, _b;
  const scroller = (_b = (_a = view.scrollDOM) != null ? _a : view.dom.querySelector(".cm-scroller")) != null ? _b : null;
  if (!scroller)
    return;
  autoScrollRangeSelection(scroller, clientY);
}
function updateSelectionFromBoundary(view, state, target, rangeVisual) {
  const next = computeUpdatedSelectionState(view.state, state, target);
  state.currentLineNumber = next.currentLineNumber;
  state.selectionBlocks = next.selectionBlocks;
  state.activeSelectionBlock = next.activeSelectionBlock;
  rangeVisual.render(state.selectionBlocks);
}
function updateSelectionFromLine(view, state, lineNumber, rangeVisual) {
  const doc = view.state.doc;
  const clampedLine = Math.max(1, Math.min(doc.lines, lineNumber));
  const boundary = resolveBlockBoundaryAtLine(view.state, clampedLine);
  updateSelectionFromBoundary(
    view,
    state,
    {
      ...boundary,
      representativeLineNumber: clampedLine
    },
    rangeVisual
  );
}
function commitSelectionRange(view, state, rangeVisual) {
  const committed = buildCommittedRangeSelection(
    view.state.doc,
    state.selectionBlocks,
    state.anchorSelectionBlock
  );
  if (!committed) {
    rangeVisual.clear();
    return null;
  }
  rangeVisual.render(committed.blocks);
  return committed;
}
function clearCommittedSelectionRange(committed, rangeVisual) {
  if (!committed)
    return committed;
  rangeVisual.clear();
  return null;
}
function deleteCommittedSelectionRange(view, committed, rangeVisual) {
  if (!committed)
    return committed;
  const doc = view.state.doc;
  const changes = buildCommittedRangeDeletionChanges(doc, committed.blocks);
  if (changes.length > 0) {
    view.dispatch({ changes });
  }
  rangeVisual.clear();
  return null;
}
function cloneCommittedSelectionBlock(committed) {
  if (!committed)
    return null;
  return cloneBlockInfo(committed.selectedBlock);
}
function refreshSelectionVisual(gesture, committed, rangeVisual) {
  if (gesture.phase === "range_selecting") {
    rangeVisual.render(gesture.rangeSelect.selectionBlocks);
    return;
  }
  if (committed) {
    rangeVisual.render(committed.blocks);
  }
}

// src/features/interaction/drag-lifecycle-flow.ts
function buildPressPendingLifecycleEvent(sourceBlock, pointerType, pressReady) {
  return {
    state: "press_pending",
    sourceBlock,
    targetLine: null,
    listIntent: null,
    rejectReason: null,
    pointerType,
    pressReady
  };
}
function buildDragActiveLifecycleEvent(sourceBlock, pointerType) {
  return {
    state: "drag_active",
    sourceBlock,
    targetLine: null,
    listIntent: null,
    rejectReason: null,
    pointerType
  };
}
function buildCancelledLifecycleEvent(sourceBlock, rejectReason, pointerType) {
  return {
    state: "cancelled",
    sourceBlock,
    targetLine: null,
    listIntent: null,
    rejectReason,
    pointerType
  };
}
function buildIdleLifecycleEvent() {
  return {
    state: "idle",
    sourceBlock: null,
    targetLine: null,
    listIntent: null,
    rejectReason: null,
    pointerType: null
  };
}

// src/features/interaction/drag-pointer-flow.ts
function isMobileEnvironment() {
  const body = document.body;
  if ((body == null ? void 0 : body.classList.contains("is-mobile")) || (body == null ? void 0 : body.classList.contains("is-phone")) || (body == null ? void 0 : body.classList.contains("is-tablet"))) {
    return true;
  }
  if (typeof window === "undefined" || typeof window.matchMedia !== "function")
    return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
function shouldStartMobilePressDrag(e) {
  return e.pointerType === "touch" && e.button === 0;
}

// src/features/interaction/drag-event-handler.ts
var MOBILE_DRAG_LONG_PRESS_MS = 200;
var MOBILE_DRAG_START_MOVE_THRESHOLD_PX = 8;
var MOBILE_DRAG_CANCEL_MOVE_THRESHOLD_PX = 12;
var TOUCH_RANGE_SELECT_LONG_PRESS_MS = 900;
var MIN_TOUCH_RANGE_SELECT_LONG_PRESS_MS = 300;
var MAX_TOUCH_RANGE_SELECT_LONG_PRESS_MS = 2e3;
var MOUSE_RANGE_SELECT_LONG_PRESS_MS = 260;
var MOUSE_RANGE_SELECT_CANCEL_MOVE_THRESHOLD_PX = 12;
var MOUSE_SECONDARY_DRAG_START_MOVE_THRESHOLD_PX = 4;
var DragEventHandler = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
    this.gesture = { phase: "idle" };
    this.committedRangeSelection = null;
    this.onEditorPointerDown = (e) => {
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (!target)
        return;
      if (target.closest(`.${RANGE_SELECTION_DELETE_BUTTON_CLASS}`))
        return;
      const pointerType = e.pointerType || null;
      const multiLineSelectionEnabled = this.isMultiLineSelectionEnabled();
      if (!multiLineSelectionEnabled) {
        this.clearCommittedRangeSelection();
      }
      const canHandleCommittedSelection = multiLineSelectionEnabled && e.button === 0 && this.gesture.phase === "idle" && !!this.committedRangeSelection;
      if (canHandleCommittedSelection && this.shouldClearCommittedSelectionOnPointerDown(target, e.clientX, pointerType)) {
        this.clearCommittedRangeSelection();
      }
      const handle = target.closest(`.${DRAG_HANDLE_CLASS}`);
      if (handle && !handle.classList.contains(EMBED_HANDLE_CLASS)) {
        this.startPointerDragFromHandle(handle, e);
        return;
      }
      if (canHandleCommittedSelection && this.isCommittedSelectionGripHit(target, e.clientX, e.clientY, pointerType)) {
        const committedBlock = this.getCommittedSelectionBlock();
        if (committedBlock) {
          this.beginPressPendingDrag(committedBlock, e);
          return;
        }
      }
      if (!this.shouldStartMobilePressDrag(e))
        return;
      const inMobileHotzoneBand = this.mobile.isWithinMobileDragHotzoneBand(e.clientX);
      const inTextLineOrEmbedArea = this.isMobileTextLongPressDragEnabled() && this.mobile.isWithinMobileTextLineOrEmbedArea(target, e.clientX, e.clientY);
      if (!inMobileHotzoneBand && !inTextLineOrEmbedArea)
        return;
      const blockInfo = this.deps.getBlockInfoAtPoint(e.clientX, e.clientY);
      if (!blockInfo)
        return;
      if (this.deps.isBlockInsideRenderedTableCell(blockInfo))
        return;
      const useHotzonePath = inMobileHotzoneBand && this.mobile.isWithinMobileDragHotzone(blockInfo, e.clientX);
      if (useHotzonePath) {
        this.beginPressPendingDrag(blockInfo, e);
        return;
      }
      if (inTextLineOrEmbedArea) {
        if (this.shouldDisableMobileTextLongPressDragInInputState())
          return;
        this.beginPressPendingDrag(blockInfo, e, { deferInterception: true });
      }
    };
    this.onEditorDragEnter = (e) => {
      const transferGuard = this.resolveDragTransferGuard(e);
      if (transferGuard.decision === "ignore")
        return;
      if (this.gesture.phase === "range_selecting") {
        this.clearMouseRangeSelectState();
        this.pointer.detachPointerListeners();
        this.pointer.releasePointerCapture();
      }
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = transferGuard.dropEffect;
      }
      if (transferGuard.decision === "block") {
        this.deps.hideDropIndicator();
      }
    };
    this.onEditorDragOver = (e) => {
      const transferGuard = this.resolveDragTransferGuard(e);
      if (transferGuard.decision === "ignore")
        return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.dataTransfer)
        return;
      e.dataTransfer.dropEffect = transferGuard.dropEffect;
      if (transferGuard.decision === "block") {
        this.deps.hideDropIndicator();
        return;
      }
      this.deps.scheduleDropIndicatorUpdate(e.clientX, e.clientY, this.deps.getDragSourceBlock(e), "mouse");
    };
    this.onEditorDragLeave = (e) => {
      const transferGuard = this.resolveDragTransferGuard(e);
      if (transferGuard.decision === "ignore")
        return;
      if (transferGuard.decision === "block") {
        this.deps.hideDropIndicator();
        return;
      }
      const rect = this.view.dom.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        this.deps.hideDropIndicator();
      }
    };
    this.onEditorDrop = (e) => {
      const transferGuard = this.resolveDragTransferGuard(e);
      if (transferGuard.decision === "ignore")
        return;
      e.preventDefault();
      e.stopPropagation();
      if (transferGuard.decision === "block") {
        this.deps.hideDropIndicator();
        return;
      }
      if (!e.dataTransfer)
        return;
      const sourceBlock = this.deps.getDragSourceBlock(e);
      if (!sourceBlock)
        return;
      this.deps.performDropAtPoint(sourceBlock, e.clientX, e.clientY, "mouse");
      this.deps.hideDropIndicator();
      this.deps.finishDragSession();
    };
    this.onLostPointerCapture = (e) => this.handleLostPointerCapture(e);
    this.onDocumentFocusIn = (e) => this.handleDocumentFocusIn(e);
    this.rangeVisual = new RangeSelectionVisualManager(
      this.view,
      () => this.refreshRangeSelectionVisual(),
      (blockStart) => {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.deps).getVisibleHandleForBlockStart) == null ? void 0 : _b.call(_a, blockStart)) != null ? _c : null;
      },
      () => this.deleteCommittedRangeSelection(),
      () => {
        var _a, _b;
        return ((_b = (_a = this.deps).isRangeSelectionDeleteEnabled) == null ? void 0 : _b.call(_a)) === true;
      }
    );
    this.mobile = new MobileGestureController(this.view, (e) => this.handleDocumentFocusIn(e));
    this.pointer = new PointerSessionController(this.view, {
      onPointerMove: (e) => this.handlePointerMove(e),
      onPointerUp: (e) => this.handlePointerUp(e),
      onPointerCancel: (e) => this.handlePointerCancel(e),
      onWindowBlur: () => this.handleWindowBlur(),
      onDocumentVisibilityChange: () => this.handleDocumentVisibilityChange(),
      onTouchMove: (e) => this.handleTouchMove(e)
    });
  }
  attach() {
    const editorDom = this.view.dom;
    editorDom.addEventListener("pointerdown", this.onEditorPointerDown, true);
    editorDom.addEventListener("lostpointercapture", this.onLostPointerCapture, true);
    editorDom.addEventListener("dragenter", this.onEditorDragEnter, true);
    editorDom.addEventListener("dragover", this.onEditorDragOver, true);
    editorDom.addEventListener("dragleave", this.onEditorDragLeave, true);
    editorDom.addEventListener("drop", this.onEditorDrop, true);
    editorDom.addEventListener("focusin", this.onDocumentFocusIn, true);
  }
  startPointerDragFromHandle(handle, e, getBlockInfo) {
    var _a, _b;
    if (this.gesture.phase !== "idle")
      return;
    const blockInfo = (_b = (_a = getBlockInfo ? getBlockInfo() : null) != null ? _a : this.deps.getBlockInfoForHandle(handle)) != null ? _b : this.deps.getBlockInfoAtPoint(e.clientX, e.clientY);
    if (!blockInfo)
      return;
    if (this.deps.isBlockInsideRenderedTableCell(blockInfo))
      return;
    const multiLineSelectionEnabled = this.isMultiLineSelectionEnabled();
    if (e.pointerType === "mouse") {
      if (e.button !== 0)
        return;
      if (!multiLineSelectionEnabled) {
        return;
      }
      this.beginRangeSelectionSession(blockInfo, e, handle, {
        skipLongPress: !!this.committedRangeSelection
      });
      return;
    }
    if (this.isMobileEnvironment()) {
      this.beginPressPendingDrag(blockInfo, e);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.pointer.tryCapturePointer(e);
    this.enterDraggingState(blockInfo, e.pointerId, e.clientX, e.clientY, e.pointerType || null);
  }
  destroy() {
    this.resetInteractionSession({ shouldFinishDragSession: true, shouldHideDropIndicator: true });
    this.clearCommittedRangeSelection();
    this.rangeVisual.destroy();
    const editorDom = this.view.dom;
    editorDom.removeEventListener("pointerdown", this.onEditorPointerDown, true);
    editorDom.removeEventListener("lostpointercapture", this.onLostPointerCapture, true);
    editorDom.removeEventListener("dragenter", this.onEditorDragEnter, true);
    editorDom.removeEventListener("dragover", this.onEditorDragOver, true);
    editorDom.removeEventListener("dragleave", this.onEditorDragLeave, true);
    editorDom.removeEventListener("drop", this.onEditorDrop, true);
    editorDom.removeEventListener("focusin", this.onDocumentFocusIn, true);
  }
  isGestureActive() {
    return this.hasActivePointerSession();
  }
  refreshSelectionVisual() {
    if (!this.isMultiLineSelectionEnabled()) {
      this.clearCommittedRangeSelection();
      return;
    }
    this.rangeVisual.scheduleRefresh();
  }
  resolveDragTransferGuard(e) {
    var _a, _b, _c, _d, _e, _f;
    return resolveDragTransferGuard({
      event: e,
      isCrossEditorDrag: (_c = (_b = (_a = this.deps).isCrossEditorDragActive) == null ? void 0 : _b.call(_a)) != null ? _c : false,
      isCrossFileDragEnabled: (_f = (_e = (_d = this.deps).isCrossFileDragEnabled) == null ? void 0 : _e.call(_d)) != null ? _f : false
    });
  }
  isMobileEnvironment() {
    return isMobileEnvironment();
  }
  shouldStartMobilePressDrag(e) {
    if (this.gesture.phase !== "idle")
      return false;
    if (!this.isMobileEnvironment())
      return false;
    return shouldStartMobilePressDrag(e);
  }
  shouldDisableMobileTextLongPressDragInInputState() {
    if (!this.view.hasFocus)
      return false;
    return this.view.state.selection.main.empty;
  }
  beginRangeSelectionSession(blockInfo, e, handle, options) {
    var _a, _b;
    const committedBlocksSnapshot = cloneSelectedBlocks((_b = (_a = this.committedRangeSelection) == null ? void 0 : _a.blocks) != null ? _b : []);
    const pointerType = e.pointerType || null;
    const skipLongPress = (options == null ? void 0 : options.skipLongPress) === true;
    const config = resolveRangeSelectConfig(
      pointerType,
      MOUSE_RANGE_SELECT_LONG_PRESS_MS,
      () => this.getTouchRangeSelectLongPressMs()
    );
    const shouldDeferInterception = pointerType === "mouse" && !skipLongPress;
    const initialRangeSelectState = createInitialRangeSelectionState({
      blockInfo,
      doc: this.view.state.doc,
      committedBlocksSnapshot,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      pointerType,
      sourceHandle: handle
    });
    if (!initialRangeSelectState)
      return;
    const preferLongPressDrag = pointerType === "mouse" && skipLongPress && initialRangeSelectState.operation === "remove" && !!this.committedRangeSelection;
    initialRangeSelectState.preferLongPressDrag = preferLongPressDrag;
    if (preferLongPressDrag) {
      initialRangeSelectState.dragReady = false;
    }
    initialRangeSelectState.longPressReady = skipLongPress;
    let dragTimeoutId = null;
    if (pointerType !== "mouse") {
      dragTimeoutId = window.setTimeout(() => {
        if (this.gesture.phase !== "range_selecting")
          return;
        const state = this.gesture.rangeSelect;
        if (state.pointerId !== e.pointerId)
          return;
        state.dragReady = true;
        this.emitPressPendingLifecycle(state.directDragSourceBlock, state.pointerType, true);
      }, MOBILE_DRAG_LONG_PRESS_MS);
    } else if (preferLongPressDrag) {
      dragTimeoutId = window.setTimeout(() => {
        if (this.gesture.phase !== "range_selecting")
          return;
        const state = this.gesture.rangeSelect;
        if (state.pointerId !== e.pointerId)
          return;
        if (!state.preferLongPressDrag || state.selectionGestureStarted)
          return;
        state.dragReady = true;
        this.emitPressPendingLifecycle(state.activeSelectionBlock, state.pointerType, true);
      }, MOUSE_RANGE_SELECT_LONG_PRESS_MS);
    }
    if (!shouldDeferInterception) {
      e.preventDefault();
      e.stopPropagation();
      this.pointer.tryCapturePointer(e);
      if (handle) {
        handle.setAttribute("draggable", "false");
      }
    }
    const timeoutId = skipLongPress ? null : window.setTimeout(() => {
      if (this.gesture.phase !== "range_selecting")
        return;
      const state = this.gesture.rangeSelect;
      if (state.pointerId !== e.pointerId)
        return;
      state.longPressReady = true;
      this.emitPressPendingLifecycle(state.activeSelectionBlock, state.pointerType, true);
      this.activateMouseRangeSelectInterception(state);
      this.updateMouseRangeSelectionFromLine(state, state.currentLineNumber);
    }, config.longPressMs);
    initialRangeSelectState.isIntercepting = !shouldDeferInterception;
    initialRangeSelectState.timeoutId = timeoutId;
    initialRangeSelectState.dragTimeoutId = dragTimeoutId;
    this.gesture = {
      phase: "range_selecting",
      rangeSelect: initialRangeSelectState
    };
    this.pointer.attachPointerListeners();
    const isPressReady = skipLongPress && !preferLongPressDrag;
    this.emitPressPendingLifecycle(blockInfo, pointerType, isPressReady);
    if (skipLongPress && !preferLongPressDrag) {
      this.updateMouseRangeSelectionFromLine(initialRangeSelectState, initialRangeSelectState.currentLineNumber);
    }
  }
  activateMouseRangeSelectInterception(state) {
    this.pointer.tryCapturePointerById(state.pointerId);
    if (state.isIntercepting)
      return;
    state.isIntercepting = true;
    if (state.sourceHandle) {
      state.sourceHandle.setAttribute("draggable", "false");
    }
  }
  beginPressPendingDrag(blockInfo, e, options) {
    const pointerType = e.pointerType || null;
    const suppressNativeInteraction = (options == null ? void 0 : options.deferInterception) !== true;
    if (suppressNativeInteraction) {
      e.preventDefault();
      e.stopPropagation();
      this.pointer.tryCapturePointer(e);
      if (pointerType !== "mouse") {
        this.mobile.lockMobileInteraction();
        this.mobile.attachFocusGuard();
        this.mobile.suppressMobileKeyboard();
      }
    }
    const skipLongPress = (options == null ? void 0 : options.skipLongPress) === true;
    const longPressMs = pointerType === "mouse" ? MOUSE_RANGE_SELECT_LONG_PRESS_MS : MOBILE_DRAG_LONG_PRESS_MS;
    const timeoutId = skipLongPress ? null : window.setTimeout(() => {
      if (this.gesture.phase !== "press_pending")
        return;
      const state = this.gesture.press;
      if (state.pointerId !== e.pointerId)
        return;
      state.longPressReady = true;
      if (!state.suppressNativeInteraction) {
        state.suppressNativeInteraction = true;
        if (state.pointerType !== "mouse") {
          this.mobile.lockMobileInteraction();
          this.mobile.attachFocusGuard();
          this.mobile.suppressMobileKeyboard();
        }
        this.pointer.tryCapturePointerById(state.pointerId);
      }
      this.emitPressPendingLifecycle(state.sourceBlock, state.pointerType, true);
    }, longPressMs);
    const startMoveThresholdPx = skipLongPress ? 2 : pointerType === "mouse" ? 4 : MOBILE_DRAG_START_MOVE_THRESHOLD_PX;
    this.gesture = { phase: "press_pending", press: {
      sourceBlock: blockInfo,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      latestX: e.clientX,
      latestY: e.clientY,
      pointerType,
      longPressReady: skipLongPress,
      timeoutId,
      cancelMoveThresholdPx: MOBILE_DRAG_CANCEL_MOVE_THRESHOLD_PX,
      startMoveThresholdPx,
      suppressNativeInteraction
    } };
    this.pointer.attachPointerListeners();
    this.emitPressPendingLifecycle(blockInfo, pointerType, skipLongPress);
  }
  clearPointerPressState() {
    if (this.gesture.phase !== "press_pending")
      return;
    const state = this.gesture.press;
    if (state.timeoutId !== null) {
      window.clearTimeout(state.timeoutId);
    }
    this.gesture = { phase: "idle" };
  }
  clearMouseRangeSelectState(options) {
    if (this.gesture.phase !== "range_selecting")
      return;
    const state = this.gesture.rangeSelect;
    if (state.timeoutId !== null) {
      window.clearTimeout(state.timeoutId);
    }
    if (state.dragTimeoutId !== null) {
      window.clearTimeout(state.dragTimeoutId);
    }
    if (state.sourceHandle && state.sourceHandle.isConnected) {
      if (state.sourceHandleDraggableAttr === null) {
        state.sourceHandle.removeAttribute("draggable");
      } else {
        state.sourceHandle.setAttribute("draggable", state.sourceHandleDraggableAttr);
      }
    }
    this.gesture = { phase: "idle" };
    if (!(options == null ? void 0 : options.preserveVisual)) {
      if (this.committedRangeSelection) {
        this.rangeVisual.render(
          this.committedRangeSelection.blocks
        );
      } else {
        this.rangeVisual.clear();
      }
    }
  }
  enterDraggingState(sourceBlock, pointerId, clientX, clientY, pointerType) {
    if (this.mobile.isMobileEnvironment()) {
      this.mobile.lockMobileInteraction();
      this.mobile.attachFocusGuard();
      this.mobile.suppressMobileKeyboard();
      this.mobile.triggerMobileHapticFeedback();
    }
    this.pointer.tryCapturePointerById(pointerId);
    this.pointer.attachPointerListeners();
    this.gesture = { phase: "dragging", drag: { sourceBlock, pointerId } };
    this.deps.beginPointerDragSession(sourceBlock);
    this.deps.scheduleDropIndicatorUpdate(clientX, clientY, sourceBlock, pointerType);
    this.emitDragActiveLifecycle(sourceBlock, pointerType);
  }
  handlePointerMove(e) {
    switch (this.gesture.phase) {
      case "dragging":
        this.handleDraggingPointerMove(e);
        return;
      case "range_selecting":
        this.handleRangeSelectingPointerMove(e);
        return;
      case "press_pending":
        this.handlePressPendingPointerMove(e);
        return;
      default:
        return;
    }
  }
  handleDraggingPointerMove(e) {
    if (this.gesture.phase !== "dragging")
      return;
    const dragState = this.gesture.drag;
    if (e.pointerId !== dragState.pointerId)
      return;
    e.preventDefault();
    e.stopPropagation();
    this.deps.scheduleDropIndicatorUpdate(e.clientX, e.clientY, dragState.sourceBlock, e.pointerType || null);
  }
  handleRangeSelectingPointerMove(e) {
    if (this.gesture.phase !== "range_selecting")
      return;
    const rangeState = this.gesture.rangeSelect;
    if (e.pointerId !== rangeState.pointerId)
      return;
    this.handleRangeSelectionPointerMove(e, rangeState);
  }
  handlePressPendingPointerMove(e) {
    if (this.gesture.phase !== "press_pending")
      return;
    const pressState = this.gesture.press;
    if (e.pointerId !== pressState.pointerId)
      return;
    pressState.latestX = e.clientX;
    pressState.latestY = e.clientY;
    const dx = e.clientX - pressState.startX;
    const dy = e.clientY - pressState.startY;
    const distance = Math.hypot(dx, dy);
    if (!pressState.longPressReady) {
      if (distance > pressState.cancelMoveThresholdPx) {
        this.abortForGestureCancel("press_cancelled", e.pointerType || null);
      }
      return;
    }
    if (distance < pressState.startMoveThresholdPx)
      return;
    e.preventDefault();
    e.stopPropagation();
    const sourceBlock = pressState.sourceBlock;
    const pointerId = pressState.pointerId;
    this.clearCommittedRangeSelection();
    this.clearPointerPressState();
    this.enterDraggingState(sourceBlock, pointerId, e.clientX, e.clientY, e.pointerType || null);
  }
  handleRangeSelectionPointerMove(e, state) {
    var _a, _b, _c;
    state.latestX = e.clientX;
    state.latestY = e.clientY;
    const pointerType = (_a = state.pointerType) != null ? _a : e.pointerType || null;
    const distance = Math.hypot(e.clientX - state.startX, e.clientY - state.startY);
    if (!state.longPressReady) {
      if (pointerType === "mouse") {
        if (distance > MOUSE_RANGE_SELECT_CANCEL_MOVE_THRESHOLD_PX) {
          this.abortForGestureCancel("press_cancelled", pointerType);
        }
      } else {
        if (!state.dragReady) {
          if (distance > MOBILE_DRAG_CANCEL_MOVE_THRESHOLD_PX) {
            this.abortForGestureCancel("press_cancelled", pointerType);
          }
          return;
        }
        if (distance >= MOBILE_DRAG_START_MOVE_THRESHOLD_PX) {
          e.preventDefault();
          e.stopPropagation();
          const sourceBlock = state.directDragSourceBlock;
          const pointerId = state.pointerId;
          this.clearCommittedRangeSelection();
          this.clearMouseRangeSelectState();
          this.enterDraggingState(sourceBlock, pointerId, e.clientX, e.clientY, pointerType);
        }
      }
      return;
    }
    if (pointerType === "mouse" && state.preferLongPressDrag && !state.selectionGestureStarted) {
      if (!state.dragReady) {
        if (distance < MOUSE_SECONDARY_DRAG_START_MOVE_THRESHOLD_PX) {
          return;
        }
      } else {
        if (distance < MOUSE_SECONDARY_DRAG_START_MOVE_THRESHOLD_PX) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const sourceBlock = (_b = this.getCommittedSelectionBlock()) != null ? _b : state.activeSelectionBlock;
        const pointerId = state.pointerId;
        this.clearCommittedRangeSelection();
        this.clearMouseRangeSelectState();
        this.enterDraggingState(sourceBlock, pointerId, e.clientX, e.clientY, pointerType);
        return;
      }
    }
    this.activateMouseRangeSelectInterception(state);
    e.preventDefault();
    e.stopPropagation();
    const targetBoundary = (_c = this.resolveHandleRangeBoundaryAtPoint(e.clientX, e.clientY)) != null ? _c : resolveRangeBoundaryAtPoint(this.view, e.clientX, e.clientY, (x, y) => this.deps.getBlockInfoAtPoint(x, y));
    if (targetBoundary) {
      this.updateMouseRangeSelection(state, targetBoundary);
    }
    this.maybeAutoScrollRangeSelection(e.clientY);
  }
  maybeAutoScrollRangeSelection(clientY) {
    autoScrollSelectionRange(this.view, clientY);
  }
  updateMouseRangeSelectionFromLine(state, lineNumber) {
    updateSelectionFromLine(this.view, state, lineNumber, this.rangeVisual);
    state.selectionGestureStarted = true;
  }
  updateMouseRangeSelection(state, target) {
    updateSelectionFromBoundary(this.view, state, target, this.rangeVisual);
    state.selectionGestureStarted = true;
  }
  resolveHandleRangeBoundaryAtPoint(clientX, clientY) {
    if (typeof document === "undefined" || typeof document.elementFromPoint !== "function") {
      return null;
    }
    const hit = document.elementFromPoint(clientX, clientY);
    if (!(hit instanceof HTMLElement))
      return null;
    const handle = hit.closest(`.${DRAG_HANDLE_CLASS}`);
    if (!handle || handle.classList.contains(EMBED_HANDLE_CLASS))
      return null;
    if (!this.view.dom.contains(handle))
      return null;
    const blockInfo = this.deps.getBlockInfoForHandle(handle);
    if (!blockInfo)
      return null;
    return buildRangeSelectionBoundaryFromBlock(this.view.state.doc, blockInfo);
  }
  commitRangeSelection(state) {
    this.committedRangeSelection = commitSelectionRange(this.view, state, this.rangeVisual);
  }
  clearCommittedRangeSelection() {
    this.committedRangeSelection = clearCommittedSelectionRange(this.committedRangeSelection, this.rangeVisual);
  }
  deleteCommittedRangeSelection() {
    this.committedRangeSelection = deleteCommittedSelectionRange(
      this.view,
      this.committedRangeSelection,
      this.rangeVisual
    );
  }
  getCommittedSelectionBlock() {
    return cloneCommittedSelectionBlock(this.committedRangeSelection);
  }
  refreshRangeSelectionVisual() {
    refreshSelectionVisual(this.gesture, this.committedRangeSelection, this.rangeVisual);
  }
  finishRangeSelectionSession() {
    this.clearMouseRangeSelectState({ preserveVisual: true });
    this.pointer.detachPointerListeners();
    this.pointer.releasePointerCapture();
    this.mobile.unlockMobileInteraction();
    this.mobile.detachFocusGuard();
    this.emitIdleLifecycle();
  }
  shouldClearCommittedSelectionOnPointerDown(target, clientX, pointerType) {
    return shouldClearCommittedSelectionOnPointerDown({
      committedSelection: this.committedRangeSelection,
      target,
      clientX,
      pointerType,
      resolveAnchorSpan: (range) => this.rangeVisual.resolveRangeAnchorSpan(range),
      isWithinContentTolerance: (x) => this.mobile.isWithinContentTolerance(x),
      contentDOM: this.view.contentDOM
    });
  }
  isCommittedSelectionGripHit(target, clientX, clientY, pointerType) {
    return isCommittedSelectionGripHit({
      committedSelection: this.committedRangeSelection,
      target,
      clientX,
      clientY,
      pointerType,
      resolveAnchorSpan: (range) => this.rangeVisual.resolveRangeAnchorSpan(range),
      isWithinMobileDragHotzoneBand: (x) => this.mobile.isWithinMobileDragHotzoneBand(x)
    });
  }
  finishPointerDrag(e, shouldDrop) {
    if (this.gesture.phase !== "dragging")
      return;
    const state = this.gesture.drag;
    if (e.pointerId !== state.pointerId)
      return;
    e.preventDefault();
    e.stopPropagation();
    if (shouldDrop) {
      this.deps.performDropAtPoint(state.sourceBlock, e.clientX, e.clientY, e.pointerType || null);
    }
    this.resetInteractionSession({
      shouldFinishDragSession: true,
      shouldHideDropIndicator: true,
      cancelReason: shouldDrop ? null : "pointer_cancelled",
      pointerType: e.pointerType || null
    });
  }
  handlePointerUp(e) {
    this.handlePointerTerminalEvent(e, "up");
  }
  handlePointerCancel(e) {
    this.handlePointerTerminalEvent(e, "cancel");
  }
  handleLostPointerCapture(e) {
    if (!this.hasActivePointerSession())
      return;
    this.abortForSessionInterrupted(e.pointerType || null);
  }
  handleWindowBlur() {
    if (!this.hasActivePointerSession())
      return;
    this.abortForSessionInterrupted(null);
  }
  handleDocumentVisibilityChange() {
    if (document.visibilityState !== "hidden")
      return;
    if (!this.hasActivePointerSession())
      return;
    this.abortForSessionInterrupted(null);
  }
  handlePointerTerminalEvent(e, mode) {
    switch (this.gesture.phase) {
      case "dragging":
        this.handleDraggingPointerTerminalEvent(e, mode);
        return;
      case "range_selecting":
        this.handleRangeSelectingPointerTerminalEvent(e, mode);
        return;
      case "press_pending":
        this.handlePressPendingPointerTerminalEvent(e, mode);
        return;
      default:
        return;
    }
  }
  handleDraggingPointerTerminalEvent(e, mode) {
    this.finishPointerDrag(e, mode === "up");
  }
  handleRangeSelectingPointerTerminalEvent(e, mode) {
    if (this.gesture.phase !== "range_selecting")
      return;
    const rangeState = this.gesture.rangeSelect;
    if (e.pointerId !== rangeState.pointerId)
      return;
    if (mode === "cancel") {
      this.abortForGestureCancel("pointer_cancelled", e.pointerType || null);
      return;
    }
    if (!rangeState.longPressReady) {
      this.abortForGestureCancel("press_cancelled", e.pointerType || null);
      return;
    }
    if (rangeState.preferLongPressDrag && rangeState.dragReady && !rangeState.selectionGestureStarted) {
      this.finishRangeSelectionSession();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.commitRangeSelection(rangeState);
    this.finishRangeSelectionSession();
  }
  handlePressPendingPointerTerminalEvent(e, mode) {
    if (this.gesture.phase !== "press_pending")
      return;
    const pressState = this.gesture.press;
    if (e.pointerId !== pressState.pointerId)
      return;
    this.abortForGestureCancel(mode === "up" ? "press_cancelled" : "pointer_cancelled", e.pointerType || null);
  }
  abortForGestureCancel(cancelReason, pointerType) {
    this.resetInteractionSession({
      shouldFinishDragSession: false,
      shouldHideDropIndicator: false,
      cancelReason,
      pointerType
    });
  }
  abortForSessionInterrupted(pointerType) {
    this.resetInteractionSession({
      shouldFinishDragSession: true,
      shouldHideDropIndicator: true,
      cancelReason: "session_interrupted",
      pointerType
    });
  }
  handleDocumentFocusIn(e) {
    if (this.committedRangeSelection && this.isMobileEnvironment() && e.target instanceof HTMLElement && this.mobile.shouldSuppressFocusTarget(e.target)) {
      this.clearCommittedRangeSelection();
    }
    if (!this.shouldSuppressNativeInteractionForActiveGesture())
      return;
    this.mobile.suppressMobileKeyboard(e.target);
  }
  handleTouchMove(e) {
    if (!this.shouldSuppressNativeInteractionForActiveGesture())
      return;
    if (e.cancelable) {
      e.preventDefault();
    }
  }
  hasActivePointerSession() {
    return this.gesture.phase !== "idle";
  }
  shouldSuppressNativeInteractionForActiveGesture() {
    switch (this.gesture.phase) {
      case "dragging":
        return true;
      case "range_selecting":
        return this.gesture.rangeSelect.isIntercepting;
      case "press_pending":
        return this.gesture.press.suppressNativeInteraction;
      default:
        return false;
    }
  }
  resetInteractionSession(options) {
    var _a, _b, _c, _d;
    const { sourceBlock, hadDrag } = this.resolveSessionResetContext();
    const shouldFinishDragSession = (_a = options == null ? void 0 : options.shouldFinishDragSession) != null ? _a : hadDrag;
    const shouldHideDropIndicator = (_b = options == null ? void 0 : options.shouldHideDropIndicator) != null ? _b : hadDrag;
    const cancelReason = (_c = options == null ? void 0 : options.cancelReason) != null ? _c : null;
    const pointerType = (_d = options == null ? void 0 : options.pointerType) != null ? _d : null;
    this.gesture = { phase: "idle" };
    this.pointer.detachPointerListeners();
    this.pointer.releasePointerCapture();
    this.mobile.unlockMobileInteraction();
    this.mobile.detachFocusGuard();
    if (shouldHideDropIndicator) {
      this.deps.hideDropIndicator();
    }
    if (hadDrag && shouldFinishDragSession) {
      this.deps.finishDragSession();
    }
    if (cancelReason && sourceBlock) {
      this.emitCancelledLifecycle(sourceBlock, cancelReason, pointerType);
    }
    this.emitIdleLifecycle();
  }
  resolveSessionResetContext() {
    const gesture = this.gesture;
    switch (gesture.phase) {
      case "dragging":
        return {
          sourceBlock: gesture.drag.sourceBlock,
          hadDrag: true
        };
      case "press_pending":
        this.clearPointerPressState();
        return {
          sourceBlock: gesture.press.sourceBlock,
          hadDrag: false
        };
      case "range_selecting":
        this.clearMouseRangeSelectState();
        return {
          sourceBlock: gesture.rangeSelect.activeSelectionBlock,
          hadDrag: false
        };
      default:
        return {
          sourceBlock: null,
          hadDrag: false
        };
    }
  }
  emitLifecycle(event) {
    var _a, _b;
    (_b = (_a = this.deps).onDragLifecycleEvent) == null ? void 0 : _b.call(_a, event);
  }
  emitPressPendingLifecycle(sourceBlock, pointerType, pressReady) {
    this.emitLifecycle(buildPressPendingLifecycleEvent(sourceBlock, pointerType, pressReady));
  }
  emitDragActiveLifecycle(sourceBlock, pointerType) {
    this.emitLifecycle(buildDragActiveLifecycleEvent(sourceBlock, pointerType));
  }
  emitCancelledLifecycle(sourceBlock, rejectReason, pointerType) {
    this.emitLifecycle(buildCancelledLifecycleEvent(sourceBlock, rejectReason, pointerType));
  }
  emitIdleLifecycle() {
    this.emitLifecycle(buildIdleLifecycleEvent());
  }
  isMultiLineSelectionEnabled() {
    if (!this.deps.isMultiLineSelectionEnabled)
      return true;
    return this.deps.isMultiLineSelectionEnabled();
  }
  isMobileTextLongPressDragEnabled() {
    if (!this.deps.isMobileTextLongPressDragEnabled)
      return true;
    return this.deps.isMobileTextLongPressDragEnabled();
  }
  getTouchRangeSelectLongPressMs() {
    if (!this.deps.getMultiLineSelectionLongPressMs) {
      return TOUCH_RANGE_SELECT_LONG_PRESS_MS;
    }
    const value = this.deps.getMultiLineSelectionLongPressMs();
    if (!Number.isFinite(value)) {
      return TOUCH_RANGE_SELECT_LONG_PRESS_MS;
    }
    return Math.max(
      MIN_TOUCH_RANGE_SELECT_LONG_PRESS_MS,
      Math.min(MAX_TOUCH_RANGE_SELECT_LONG_PRESS_MS, Math.round(value))
    );
  }
};

// src/features/ui/indicator/ghost-element.ts
var draggingViewRefs = /* @__PURE__ */ new Set();
function beginDragSession(blockInfo, view) {
  setActiveDragSourceBlock(view, blockInfo);
  draggingViewRefs.add(new WeakRef(view));
  document.body.classList.add(DRAGGING_BODY_CLASS);
}
function finishDragSession(view) {
  if (view) {
    finishDragSessionForView(view);
  } else {
    for (const ref of Array.from(draggingViewRefs)) {
      const v = ref.deref();
      if (v)
        finishDragSessionForView(v);
      draggingViewRefs.delete(ref);
    }
    clearAllActiveDragSourceBlocks();
  }
  if (draggingViewRefs.size === 0) {
    document.body.classList.remove(DRAGGING_BODY_CLASS);
  }
  hideDropVisuals();
}
function startDragFromHandle(e, view, resolveBlockInfo, handle) {
  if (!e.dataTransfer)
    return false;
  const blockInfo = resolveBlockInfo();
  if (!blockInfo) {
    e.preventDefault();
    return false;
  }
  if (isPosInsideRenderedTableCell(view, blockInfo.from, { skipLayoutRead: true })) {
    e.preventDefault();
    return false;
  }
  return startDragWithBlockInfo(e, blockInfo, view, handle != null ? handle : null);
}
function getDragSourceBlockFromEvent(e, _view) {
  const activeSourceView = getActiveDragSourceView();
  if (!activeSourceView)
    return null;
  const fallbackSource = getActiveDragSourceBlock(activeSourceView);
  if (!e.dataTransfer)
    return fallbackSource;
  const data = e.dataTransfer.getData(DND_BLOCK_TRANSFER_MIME_TYPE);
  if (!data)
    return fallbackSource;
  try {
    return JSON.parse(data);
  } catch (e2) {
    return fallbackSource;
  }
}
function startDragWithBlockInfo(e, blockInfo, view, handle) {
  if (!e.dataTransfer)
    return false;
  beginDragSession(blockInfo, view);
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", blockInfo.content);
  e.dataTransfer.setData(DND_BLOCK_TRANSFER_MIME_TYPE, JSON.stringify(blockInfo));
  if (handle) {
    handle.setAttribute("data-block-start", String(blockInfo.startLine));
    handle.setAttribute("data-block-end", String(blockInfo.endLine));
  }
  const ghost = document.createElement("div");
  ghost.className = DRAG_GHOST_CLASS;
  ghost.textContent = blockInfo.content.slice(0, 50) + (blockInfo.content.length > 50 ? "..." : "");
  document.body.appendChild(ghost);
  e.dataTransfer.setDragImage(ghost, 0, 0);
  setTimeout(() => ghost.remove(), 0);
  return true;
}
function finishDragSessionForView(view) {
  clearActiveDragSourceBlock(view);
  removeDraggingViewRef(view);
}
function removeDraggingViewRef(target) {
  for (const ref of draggingViewRefs) {
    const v = ref.deref();
    if (!v || v === target) {
      draggingViewRefs.delete(ref);
    }
  }
}

// src/features/ui/handle/handle-gutter.ts
function isVisible(el) {
  const style = getComputedStyle(el);
  return style.display !== "none" && style.visibility !== "hidden";
}
function getHandleGutter(view) {
  var _a;
  const candidates = Array.from(view.dom.querySelectorAll(`.${HANDLE_GUTTER_CLASS}`));
  return (_a = candidates.find((candidate) => candidate.closest(CODEMIRROR_EDITOR_SELECTOR) === view.dom && isVisible(candidate))) != null ? _a : null;
}
function getHandleGutterSide(view) {
  const gutter2 = getHandleGutter(view);
  if (!gutter2)
    return null;
  const container = gutter2.parentElement;
  if (container == null ? void 0 : container.classList.contains(CODEMIRROR_GUTTERS_AFTER_CLASS))
    return "right";
  if (container == null ? void 0 : container.classList.contains(CODEMIRROR_GUTTERS_BEFORE_CLASS))
    return "left";
  return null;
}
function getHandleGutterElementForLine(view, lineNumber) {
  var _a;
  if (lineNumber < 1 || lineNumber > view.state.doc.lines)
    return null;
  const gutter2 = getHandleGutter(view);
  if (!gutter2)
    return null;
  const probeSelector = `.${HANDLE_GUTTER_PROBE_CLASS}[data-line-number="${lineNumber}"]`;
  const probe = gutter2.querySelector(probeSelector);
  if (!probe)
    return null;
  if (probe.classList.contains(CODEMIRROR_GUTTER_ELEMENT_CLASS))
    return probe;
  return (_a = probe.closest(`${CODEMIRROR_GUTTER_ELEMENT_SELECTOR}.${HANDLE_GUTTER_MARKER_CLASS}`)) != null ? _a : null;
}

// src/shared/constants.ts
var DOC_SEMANTIC_IDLE_SMALL_MS = 500;
var DOC_SEMANTIC_IDLE_MEDIUM_MS = 900;
var DOC_SEMANTIC_IDLE_LARGE_MS = 1400;
var HANDLE_INTERACTION_ZONE_PX = 64;
var handleConfig = {
  sizePx: 16,
  horizontalOffsetPx: -8
};
function getHandleSizePx() {
  return handleConfig.sizePx;
}
function setHandleSizePx(size) {
  handleConfig.sizePx = Math.max(12, Math.min(28, size));
}
function getHandleHorizontalOffsetPx() {
  return handleConfig.horizontalOffsetPx;
}
function setHandleHorizontalOffsetPx(offsetPx) {
  handleConfig.horizontalOffsetPx = Number.isFinite(offsetPx) ? offsetPx : 0;
}

// src/features/ui/handle/line-handle-manager.ts
var GUTTER_BOUND_CLASS = "dnd-handle-gutter-bound";
var LineHandleManager = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
    this.lineHandles = /* @__PURE__ */ new Map();
    this.pendingScan = false;
    this.rafId = null;
    this.destroyed = false;
  }
  shouldRenderLineHandles() {
    if (!this.deps.shouldRenderLineHandles)
      return true;
    return this.deps.shouldRenderLineHandles();
  }
  start() {
    this.destroyed = false;
    this.rescan();
  }
  getVisibleHandleForBlockStart(blockStart) {
    var _a, _b;
    const handle = (_b = (_a = this.lineHandles.get(blockStart)) == null ? void 0 : _a.handle) != null ? _b : null;
    if (!handle || !handle.isConnected || handle.classList.contains(HIDDEN_CLASS)) {
      return null;
    }
    return handle;
  }
  scheduleScan() {
    if (this.destroyed)
      return;
    if (this.pendingScan)
      return;
    this.pendingScan = true;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      if (this.destroyed)
        return;
      this.pendingScan = false;
      this.rescan();
    });
  }
  rescan() {
    if (this.destroyed)
      return;
    if (!this.shouldRenderLineHandles()) {
      for (const entry of this.lineHandles.values()) {
        entry.handle.remove();
      }
      this.lineHandles.clear();
      return;
    }
    const doc = this.view.state.doc;
    const processedLines = /* @__PURE__ */ new Set();
    const handledBlockStarts = /* @__PURE__ */ new Set();
    for (const { from, to } of this.view.visibleRanges) {
      let pos = from;
      while (pos <= to) {
        const line = doc.lineAt(pos);
        const lineNumber = line.number;
        if (processedLines.has(lineNumber)) {
          pos = line.to + 1;
          continue;
        }
        const block = detectBlock(this.view.state, lineNumber);
        if (block) {
          const blockStart = block.startLine;
          const handleLineNumber = block.startLine + 1;
          handledBlockStarts.add(blockStart);
          const getBlockInfo = () => this.deps.getDraggableBlockAtLine(handleLineNumber);
          let entry = this.lineHandles.get(blockStart);
          if (!entry) {
            const handle = this.deps.createHandleElement(getBlockInfo);
            handle.classList.add(LINE_HANDLE_CLASS);
            entry = { handle };
            this.lineHandles.set(blockStart, entry);
          }
          entry.handle.setAttribute("data-block-start", String(block.startLine));
          entry.handle.setAttribute("data-block-end", String(block.endLine));
          this.mountHandle(entry.handle, handleLineNumber);
          if (block.type === "list-item" /* ListItem */) {
            const ownRange = getListItemOwnRangeForHandle(this.view.state, lineNumber);
            if (ownRange) {
              for (let i = ownRange.startLine; i <= ownRange.endLine; i++) {
                processedLines.add(i);
              }
            } else {
              processedLines.add(lineNumber);
            }
          } else if (block.type === "blockquote" /* Blockquote */) {
            processedLines.add(lineNumber);
          } else {
            const startLineNumber = block.startLine + 1;
            const endLineNumber = block.endLine + 1;
            for (let ln = startLineNumber; ln <= endLineNumber; ln++) {
              processedLines.add(ln);
            }
          }
        }
        pos = line.to + 1;
      }
    }
    for (const [blockStart, entry] of this.lineHandles.entries()) {
      if (!handledBlockStarts.has(blockStart)) {
        entry.handle.remove();
        this.lineHandles.delete(blockStart);
      }
    }
  }
  destroy() {
    this.destroyed = true;
    this.pendingScan = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    for (const entry of this.lineHandles.values()) {
      entry.handle.remove();
    }
    this.lineHandles.clear();
  }
  mountHandle(handle, lineNumber) {
    if (lineNumber < 1 || lineNumber > this.view.state.doc.lines) {
      handle.classList.add(HIDDEN_CLASS);
      return;
    }
    const parent = getHandleGutterElementForLine(this.view, lineNumber);
    if (!parent) {
      handle.classList.add(HIDDEN_CLASS);
      if (!this.pendingScan && !this.destroyed) {
        this.scheduleScan();
      }
      return;
    }
    if (handle.parentElement !== parent) {
      parent.appendChild(handle);
    }
    const localLeft = Math.round(getHandleHorizontalOffsetPx() - getHandleSizePx() / 2);
    handle.setCssProps({
      left: `${Math.round(localLeft)}px`,
      top: "0px"
    });
    handle.style.removeProperty("height");
    handle.classList.remove(HIDDEN_CLASS);
    handle.classList.add(GUTTER_BOUND_CLASS);
  }
};

// src/features/ui/probe/line-dom.ts
function getMainContentLineElementByDomAtPos(view, lineNumber) {
  if (typeof view.domAtPos !== "function")
    return null;
  try {
    const line = view.state.doc.line(lineNumber);
    const domAtPos = view.domAtPos(line.from);
    const base = domAtPos.node.nodeType === Node.TEXT_NODE ? domAtPos.node.parentElement : domAtPos.node;
    if (!(base instanceof Element))
      return null;
    const lineEl = base.closest(".cm-line");
    if (!lineEl)
      return null;
    if (!view.contentDOM.contains(lineEl))
      return null;
    return lineEl;
  } catch (e) {
    return null;
  }
}
function getMainContentLineElementForLine(view, lineNumber) {
  if (lineNumber < 1 || lineNumber > view.state.doc.lines)
    return null;
  return getMainContentLineElementByDomAtPos(view, lineNumber);
}

// src/features/ui/handle/handle-visibility-controller.ts
var DRAG_SOURCE_LINE_VARIANT_CLASSES = [
  DRAG_SOURCE_LINE_SINGLE_CLASS,
  DRAG_SOURCE_LINE_FIRST_CLASS,
  DRAG_SOURCE_LINE_MIDDLE_CLASS,
  DRAG_SOURCE_LINE_LAST_CLASS
];
var HandleVisibilityController = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
    this.grabbedLineEls = /* @__PURE__ */ new Set();
    this.grabbedEmbedEls = /* @__PURE__ */ new Set();
    this.grabbedLineRanges = [];
    this.activeHandle = null;
    this.activeHoverBlock = null;
  }
  getActiveHandle() {
    return this.activeHandle;
  }
  clearGrabbedLineNumbers() {
    this.clearGrabbedLineVisualClasses();
    this.grabbedLineRanges = [];
  }
  refreshGrabVisualState() {
    if (this.grabbedLineRanges.length === 0)
      return;
    this.clearGrabbedLineVisualClasses();
    this.applyGrabbedLineVisualState();
  }
  setGrabbedLineNumberRange(startLineNumber, endLineNumber) {
    this.setGrabbedLineRanges([{ startLineNumber, endLineNumber }]);
  }
  enterGrabVisualStateForBlock(blockInfo, handle) {
    this.setActiveVisibleHandle(handle);
    this.setGrabbedLineRanges(this.resolveGrabLineRanges(blockInfo));
  }
  setActiveVisibleHandle(handle) {
    var _a;
    if (this.activeHandle === handle) {
      return;
    }
    if (this.activeHandle) {
      this.activeHandle.classList.remove("is-visible");
    }
    this.activeHandle = handle;
    if (!handle) {
      this.activeHoverBlock = null;
      return;
    }
    if (((_a = this.activeHoverBlock) == null ? void 0 : _a.handle) !== handle) {
      this.activeHoverBlock = null;
    }
    handle.classList.add("is-visible");
  }
  enterGrabVisualState(startLineNumber, endLineNumber, handle) {
    this.setActiveVisibleHandle(handle);
    this.setGrabbedLineNumberRange(startLineNumber, endLineNumber);
  }
  isPointerInHandleInteractionZone(snapshot) {
    return snapshot.withinHandleInteractionZone;
  }
  isPointerInHoverActivationZone(snapshot) {
    return snapshot.withinHoverActivationZone;
  }
  resolveVisibleHandleFromTarget(target) {
    if (!(target instanceof HTMLElement))
      return null;
    const directHandle = target.closest(`.${DRAG_HANDLE_CLASS}`);
    if (!directHandle)
      return null;
    if (this.view.dom.contains(directHandle)) {
      return directHandle;
    }
    return null;
  }
  resolveVisibleHandleFromPointer(snapshot) {
    if (!snapshot.withinHoverActivationZone) {
      this.activeHoverBlock = null;
      return null;
    }
    const cachedHandle = this.resolveActiveHoverBlock(snapshot);
    if (cachedHandle) {
      return cachedHandle;
    }
    const blockInfo = this.deps.getDraggableBlockAtVerticalPosition(snapshot.clientY, snapshot.contentRect);
    if (!blockInfo)
      return null;
    const handle = this.resolveVisibleHandleForBlock(blockInfo);
    if (!handle) {
      this.activeHoverBlock = null;
      return null;
    }
    this.activeHoverBlock = {
      startLineNumber: blockInfo.startLine + 1,
      endLineNumber: blockInfo.endLine + 1,
      handle
    };
    return handle;
  }
  clearGrabbedLineVisualClasses() {
    for (const lineEl of this.grabbedLineEls) {
      lineEl.classList.remove(DRAG_SOURCE_LINE_CLASS);
      lineEl.classList.remove(...DRAG_SOURCE_LINE_VARIANT_CLASSES);
    }
    this.grabbedLineEls.clear();
    for (const embedEl of this.grabbedEmbedEls) {
      embedEl.classList.remove(DRAG_SOURCE_EMBED_CLASS);
    }
    this.grabbedEmbedEls.clear();
  }
  setGrabbedLineRanges(ranges) {
    this.clearGrabbedLineVisualClasses();
    this.grabbedLineRanges = this.normalizeGrabLineRanges(ranges);
    this.applyGrabbedLineVisualState();
  }
  applyGrabbedLineVisualState() {
    if (this.grabbedLineRanges.length === 0)
      return;
    for (const range of this.grabbedLineRanges) {
      const safeStart = Math.max(1, Math.min(this.view.state.doc.lines, range.startLineNumber));
      const safeEnd = Math.max(1, Math.min(this.view.state.doc.lines, range.endLineNumber));
      const from = Math.min(safeStart, safeEnd);
      const to = Math.max(safeStart, safeEnd);
      for (let lineNumber = from; lineNumber <= to; lineNumber++) {
        const lineEl = getMainContentLineElementForLine(this.view, lineNumber);
        if (!lineEl)
          continue;
        lineEl.classList.add(
          DRAG_SOURCE_LINE_CLASS,
          this.getDragSourceLineVariantClass(lineNumber, from, to)
        );
        this.grabbedLineEls.add(lineEl);
      }
    }
    this.applyGrabbedEmbedVisualState();
  }
  getDragSourceLineVariantClass(lineNumber, from, to) {
    if (from === to)
      return DRAG_SOURCE_LINE_SINGLE_CLASS;
    if (lineNumber === from)
      return DRAG_SOURCE_LINE_FIRST_CLASS;
    if (lineNumber === to)
      return DRAG_SOURCE_LINE_LAST_CLASS;
    return DRAG_SOURCE_LINE_MIDDLE_CLASS;
  }
  resolveGrabLineRanges(blockInfo) {
    var _a, _b;
    const composite = (_b = (_a = blockInfo.compositeSelection) == null ? void 0 : _a.ranges) != null ? _b : [];
    if (composite.length === 0) {
      return [{
        startLineNumber: blockInfo.startLine + 1,
        endLineNumber: blockInfo.endLine + 1
      }];
    }
    return composite.map((range) => ({
      startLineNumber: range.startLine + 1,
      endLineNumber: range.endLine + 1
    }));
  }
  applyGrabbedEmbedVisualState() {
    const root = this.view.dom;
    if (!(root instanceof HTMLElement))
      return;
    for (const embed of collectEmbedRoots(this.view, { normalizeToEmbedRoot: true })) {
      const lineNumber = this.resolveEmbedLineNumber(embed);
      if (lineNumber === null)
        continue;
      if (!this.isLineNumberInGrabRanges(lineNumber))
        continue;
      embed.classList.add(DRAG_SOURCE_EMBED_CLASS);
      this.grabbedEmbedEls.add(embed);
    }
  }
  resolveEmbedLineNumber(embed) {
    var _a;
    const probes = [embed];
    if (embed.firstChild)
      probes.push(embed.firstChild);
    if (embed.parentElement)
      probes.push(embed.parentElement);
    if ((_a = embed.parentElement) == null ? void 0 : _a.firstChild)
      probes.push(embed.parentElement.firstChild);
    return resolveLineNumberFromDomNodes(this.view, probes);
  }
  isLineNumberInGrabRanges(lineNumber) {
    return isLineNumberInRanges(lineNumber, this.grabbedLineRanges);
  }
  normalizeGrabLineRanges(ranges) {
    const docLines = this.view.state.doc.lines;
    const merged = mergeLineRanges(docLines, ranges);
    return merged.map((range) => ({
      startLineNumber: range.startLineNumber,
      endLineNumber: range.endLineNumber
    }));
  }
  resolveVisibleHandleForBlock(blockInfo) {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.deps).getVisibleHandleForBlockStart) == null ? void 0 : _b.call(_a, blockInfo.startLine)) != null ? _c : null;
  }
  resolveActiveHoverBlock(snapshot) {
    if (!this.activeHoverBlock)
      return null;
    if (this.activeHandle !== this.activeHoverBlock.handle)
      return null;
    if (!this.activeHoverBlock.handle.isConnected) {
      this.activeHoverBlock = null;
      return null;
    }
    const lineNumber = this.deps.getLineNumberAtVerticalPosition(snapshot.clientY, snapshot.contentRect);
    if (lineNumber === null)
      return null;
    if (lineNumber < this.activeHoverBlock.startLineNumber || lineNumber > this.activeHoverBlock.endLineNumber) {
      return null;
    }
    return this.activeHoverBlock.handle;
  }
};

// src/features/entry/semantic-refresh-scheduler.ts
var SemanticRefreshScheduler = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
    this.semanticRefreshTimerHandle = null;
    this.pendingSemanticRefresh = false;
  }
  get isPending() {
    return this.pendingSemanticRefresh;
  }
  markSemanticRefreshPending() {
    this.pendingSemanticRefresh = true;
    if (this.semanticRefreshTimerHandle !== null) {
      window.clearTimeout(this.semanticRefreshTimerHandle);
      this.semanticRefreshTimerHandle = null;
    }
    const delayMs = this.getSemanticRefreshDelayMs(this.view.state.doc.lines);
    this.semanticRefreshTimerHandle = window.setTimeout(() => {
      this.semanticRefreshTimerHandle = null;
      if (document.body.classList.contains(DRAGGING_BODY_CLASS)) {
        this.markSemanticRefreshPending();
        return;
      }
      if (!this.pendingSemanticRefresh)
        return;
      this.deps.performRefresh();
    }, delayMs);
  }
  ensureSemanticReadyForInteraction() {
    if (!this.pendingSemanticRefresh)
      return;
    this.deps.performRefresh();
  }
  clearPendingSemanticRefresh() {
    this.pendingSemanticRefresh = false;
    if (this.semanticRefreshTimerHandle !== null) {
      window.clearTimeout(this.semanticRefreshTimerHandle);
      this.semanticRefreshTimerHandle = null;
    }
  }
  destroy() {
    this.clearPendingSemanticRefresh();
  }
  getSemanticRefreshDelayMs(docLines) {
    if (docLines > 12e4)
      return DOC_SEMANTIC_IDLE_LARGE_MS;
    if (docLines > 3e4)
      return DOC_SEMANTIC_IDLE_MEDIUM_MS;
    return DOC_SEMANTIC_IDLE_SMALL_MS;
  }
};

// src/features/state/perf-session.ts
function createDurationStore() {
  return {
    resolve_total: [],
    vertical: [],
    container: [],
    list_target: [],
    in_place: [],
    geometry: [],
    line_map_get: [],
    line_map_build: [],
    detect_block_uncached: [],
    drop_indicator_resolve: []
  };
}
function createCounterStore() {
  return {
    drop_indicator_frames: 0,
    drop_indicator_skipped_frames: 0,
    drop_indicator_reused_frames: 0,
    resolve_cache_hits: 0,
    resolve_cache_misses: 0,
    list_ancestor_scan_steps: 0,
    list_parent_scan_steps: 0,
    highlight_scan_lines: 0
  };
}
function percentile(values, p) {
  if (values.length === 0)
    return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.max(0, Math.min(sorted.length - 1, Math.ceil(p / 100 * sorted.length) - 1));
  return Number(sorted[index].toFixed(3));
}
function summarize(values) {
  if (values.length === 0) {
    return { count: 0, p50: 0, p95: 0, max: 0 };
  }
  return {
    count: values.length,
    p50: percentile(values, 50),
    p95: percentile(values, 95),
    max: Number(Math.max(...values).toFixed(3))
  };
}
function serializeSnapshot(snapshot) {
  return JSON.stringify(snapshot, null, 2);
}
function createDragPerfSession(input) {
  const startedAtMs = nowMs();
  const durations = createDurationStore();
  const counters = createCounterStore();
  const id = `drag-${Math.random().toString(36).slice(2, 10)}`;
  return {
    id,
    docLines: input.docLines,
    startedAtMs,
    recordDuration(key, durationMs) {
      if (!isFinite(durationMs) || durationMs < 0)
        return;
      durations[key].push(durationMs);
    },
    incrementCounter(key, delta = 1) {
      counters[key] += delta;
    },
    snapshot() {
      const resolveHits = counters.resolve_cache_hits;
      const resolveMisses = counters.resolve_cache_misses;
      const resolveTotal = resolveHits + resolveMisses;
      return {
        id,
        docLines: input.docLines,
        durationMs: Number((nowMs() - startedAtMs).toFixed(3)),
        durations: {
          resolve_total: summarize(durations.resolve_total),
          vertical: summarize(durations.vertical),
          container: summarize(durations.container),
          list_target: summarize(durations.list_target),
          in_place: summarize(durations.in_place),
          geometry: summarize(durations.geometry),
          line_map_get: summarize(durations.line_map_get),
          line_map_build: summarize(durations.line_map_build),
          detect_block_uncached: summarize(durations.detect_block_uncached),
          drop_indicator_resolve: summarize(durations.drop_indicator_resolve)
        },
        counters: { ...counters },
        cacheHitRates: {
          resolveValidatedDropTarget: resolveTotal > 0 ? Number((resolveHits / resolveTotal).toFixed(3)) : 0
        }
      };
    }
  };
}
function logDragPerfSession(session, reason) {
  if (!session)
    return;
  const snapshot = session.snapshot();
  console.debug("[Dragger][Perf]", reason, serializeSnapshot(snapshot));
}

// src/features/entry/drag-perf-session-manager.ts
var DragPerfSessionManager = class {
  constructor(view) {
    this.view = view;
    this.session = null;
  }
  ensure() {
    if (this.session)
      return;
    this.session = createDragPerfSession({
      docLines: this.view.state.doc.lines
    });
    setLineMapPerfRecorder((key, durationMs) => {
      var _a;
      (_a = this.session) == null ? void 0 : _a.recordDuration(key, durationMs);
    });
    setDetectBlockPerfRecorder((key, durationMs) => {
      var _a;
      (_a = this.session) == null ? void 0 : _a.recordDuration(key, durationMs);
    });
    getLineMap(this.view.state);
  }
  flush(reason) {
    if (this.session) {
      logDragPerfSession(this.session, reason);
      this.session = null;
    }
    setLineMapPerfRecorder(null);
    setDetectBlockPerfRecorder(null);
  }
  recordDuration(key, durationMs) {
    var _a;
    (_a = this.session) == null ? void 0 : _a.recordDuration(key, durationMs);
  }
  incrementCounter(key, delta = 1) {
    var _a;
    (_a = this.session) == null ? void 0 : _a.incrementCounter(key, delta);
  }
};

// src/core/parser/line-parsing-service.ts
var import_state3 = require("@codemirror/state");
var LineParsingService = class {
  constructor(view) {
    this.view = view;
  }
  getTabSize(state) {
    return normalizeTabSize((state != null ? state : this.view.state).facet(import_state3.EditorState.tabSize));
  }
  parseLine(line, state) {
    return parseLineWithQuote2(line, this.getTabSize(state));
  }
  getIndentUnitWidth(sample, state) {
    return getIndentUnitWidth2(sample, this.getTabSize(state));
  }
  getIndentUnitWidthForDoc(doc, state) {
    const activeState = state != null ? state : this.view.state;
    return getIndentUnitWidthForDoc(
      doc,
      (line) => this.parseLine(line, activeState),
      this.getTabSize(activeState)
    );
  }
  buildIndentStringFromSample(sample, width, state) {
    return buildIndentStringFromSample2(sample, width, this.getTabSize(state));
  }
};

// src/features/targeting/geometry-calculator.ts
var GeometryCalculator = class {
  constructor(view, lineParsingService) {
    this.view = view;
    this.lineParsingService = lineParsingService;
  }
  getAdjustedTargetLocation(lineNumber, options) {
    const doc = this.view.state.doc;
    if (lineNumber < 1 || lineNumber > doc.lines) {
      return { lineNumber: clampTargetLineNumber(doc.lines, lineNumber), blockAdjusted: false };
    }
    const block = detectBlock(this.view.state, lineNumber);
    if (!block || block.type !== "code-block" /* CodeBlock */ && block.type !== "table" /* Table */ && block.type !== "math-block" /* MathBlock */) {
      return { lineNumber, blockAdjusted: false };
    }
    if (typeof (options == null ? void 0 : options.clientY) === "number") {
      const blockStartLine = doc.line(block.startLine + 1);
      const blockEndLine = doc.line(block.endLine + 1);
      const startCoords = getCoordsAtPos(this.view, blockStartLine.from);
      const endCoords = getCoordsAtPos(this.view, blockEndLine.to);
      if (startCoords && endCoords) {
        const midPoint = (startCoords.top + endCoords.bottom) / 2;
        const insertAfter = options.clientY > midPoint;
        const adjustedLineNumber2 = insertAfter ? block.endLine + 2 : block.startLine + 1;
        return {
          lineNumber: clampTargetLineNumber(doc.lines, adjustedLineNumber2),
          blockAdjusted: true
        };
      }
    }
    const lineIndex = lineNumber - 1;
    const midLine = (block.startLine + block.endLine) / 2;
    const adjustedLineNumber = lineIndex <= midLine ? block.startLine + 1 : block.endLine + 2;
    return {
      lineNumber: clampTargetLineNumber(doc.lines, adjustedLineNumber),
      blockAdjusted: true
    };
  }
  getLineRect(lineNumber) {
    return getLineRect(this.view, lineNumber);
  }
  getInsertionAnchorY(lineNumber) {
    return getInsertionAnchorY(this.view, lineNumber);
  }
  getLineIndentPosByWidth(lineNumber, targetIndentWidth) {
    return getLineIndentPosByWidth(
      this.view,
      lineNumber,
      targetIndentWidth,
      this.lineParsingService.getTabSize()
    );
  }
  getBlockRect(startLineNumber, endLineNumber) {
    return getBlockRect(this.view, startLineNumber, endLineNumber);
  }
};

// src/core/container-rules/container-policy.ts
var defaultDetectBlock = (state, lineNumber) => detectBlock(state, lineNumber);
function clampInsertionLineNumber(doc, lineNumber) {
  if (lineNumber < 1)
    return 1;
  if (lineNumber > doc.lines + 1)
    return doc.lines + 1;
  return lineNumber;
}
function getImmediateLineText(doc, lineNumber) {
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  return doc.line(lineNumber).text;
}
function getActiveLineMap(state, options) {
  var _a;
  return (_a = options == null ? void 0 : options.lineMap) != null ? _a : getLineMap(state);
}
function getPreviousNonEmptyLineNumber(doc, lineNumber, lineMap) {
  if (lineMap && lineMap.doc === doc) {
    if (doc.lines <= 0)
      return null;
    const clampedLine = Math.max(1, Math.min(doc.lines, lineNumber));
    const prev = lineMap.prevNonEmpty[clampedLine];
    return prev > 0 ? prev : null;
  }
  for (let i = lineNumber; i >= 1; i--) {
    const text = doc.line(i).text;
    if (text.trim().length === 0)
      continue;
    return i;
  }
  return null;
}
function getNextNonEmptyLineNumber(doc, lineNumber, lineMap) {
  if (lineMap && lineMap.doc === doc) {
    if (doc.lines <= 0)
      return null;
    const clampedLine = Math.max(1, Math.min(doc.lines, lineNumber));
    const next = lineMap.nextNonEmpty[clampedLine];
    return next > 0 ? next : null;
  }
  for (let i = lineNumber; i <= doc.lines; i++) {
    const text = doc.line(i).text;
    if (text.trim().length === 0)
      continue;
    return i;
  }
  return null;
}
function findEnclosingListBlock(state, lineNumber, detectBlockFn = defaultDetectBlock, options) {
  const doc = state.doc;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const lineMap = getActiveLineMap(state, options);
  const radius = 8;
  const minLine = Math.max(1, lineNumber - radius);
  const maxLine = Math.min(doc.lines, lineNumber + radius);
  let best = null;
  for (let ln = minLine; ln <= maxLine; ln++) {
    const meta = getLineMetaAt(lineMap, ln);
    if (meta && !meta.isList)
      continue;
    const block = detectBlockFn(state, ln);
    if (!block || block.type !== "list-item" /* ListItem */)
      continue;
    const blockStart = block.startLine + 1;
    const blockEnd = block.endLine + 1;
    if (lineNumber < blockStart || lineNumber > blockEnd)
      continue;
    if (!best || block.endLine - block.startLine > best.endLine - best.startLine) {
      best = block;
    }
  }
  return best;
}
function isTableBlockStartAtLine(state, lineNumber, detectBlockFn) {
  if (lineNumber < 1 || lineNumber > state.doc.lines)
    return false;
  const block = detectBlockFn(state, lineNumber);
  return !!block && block.type === "table" /* Table */ && block.startLine + 1 === lineNumber;
}
function isHorizontalRuleAtLine(state, lineNumber, detectBlockFn) {
  if (lineNumber < 1 || lineNumber > state.doc.lines)
    return false;
  const block = detectBlockFn(state, lineNumber);
  if (block) {
    return block.type === "hr" /* HorizontalRule */ && block.startLine + 1 === lineNumber;
  }
  return isHorizontalRuleLine(state.doc.line(lineNumber).text);
}
function isCalloutAfterBoundary(state, prevImmediateLine, nextIsQuoteLike, detectBlockFn) {
  if (prevImmediateLine < 1 || prevImmediateLine > state.doc.lines)
    return false;
  if (nextIsQuoteLike)
    return false;
  const prevBlock = detectBlockFn(state, prevImmediateLine);
  return !!prevBlock && prevBlock.type === "callout" /* Callout */ && prevBlock.endLine + 1 === prevImmediateLine;
}
function resolveListContextAtInsertion(state, targetLineNumber, detectBlockFn, options) {
  const doc = state.doc;
  if (doc.lines <= 0)
    return null;
  const lineMap = getActiveLineMap(state, options);
  const candidates = [
    targetLineNumber - 1,
    targetLineNumber,
    targetLineNumber + 1,
    getPreviousNonEmptyLineNumber(doc, targetLineNumber - 1, lineMap),
    getNextNonEmptyLineNumber(doc, targetLineNumber, lineMap)
  ].filter((v) => typeof v === "number" && v >= 1 && v <= doc.lines);
  const seen = /* @__PURE__ */ new Set();
  let best = null;
  for (const line of candidates) {
    if (seen.has(line))
      continue;
    seen.add(line);
    const lineMeta = getLineMetaAt(lineMap, line);
    if (lineMeta && !lineMeta.isList)
      continue;
    const block = findEnclosingListBlock(state, line, detectBlockFn, { lineMap });
    if (!block)
      continue;
    const blockTopBoundary = block.startLine + 1;
    const blockBottomBoundary = block.endLine + 2;
    const isInsideContainer = targetLineNumber > blockTopBoundary && targetLineNumber < blockBottomBoundary;
    if (!isInsideContainer)
      continue;
    if (!best || block.endLine - block.startLine > best.endLine - best.startLine) {
      best = block;
    }
  }
  if (!best)
    return null;
  return { type: "list-item" /* ListItem */, block: best };
}
function resolveSlotContextAtInsertion(state, targetLineNumber, detectBlockFn = defaultDetectBlock, options) {
  const doc = state.doc;
  const lineMap = getActiveLineMap(state, options);
  const clampedTarget = clampInsertionLineNumber(doc, targetLineNumber);
  const prevImmediateLine = clampedTarget - 1;
  const nextImmediateLine = clampedTarget <= doc.lines ? clampedTarget : null;
  const prevMeta = getLineMetaAt(lineMap, prevImmediateLine);
  const nextMeta = nextImmediateLine === null ? null : getLineMetaAt(lineMap, nextImmediateLine);
  const prevImmediateText = prevMeta ? null : getImmediateLineText(doc, prevImmediateLine);
  const nextImmediateText = nextMeta || nextImmediateLine === null ? null : getImmediateLineText(doc, nextImmediateLine);
  const prevIsQuoteLike = prevMeta ? prevMeta.isQuote : isBlockquoteLine(prevImmediateText);
  const nextIsQuoteLike = nextMeta ? nextMeta.isQuote : isBlockquoteLine(nextImmediateText);
  if (isCalloutAfterBoundary(state, prevImmediateLine, nextIsQuoteLike, detectBlockFn)) {
    return "callout_after";
  }
  if (nextImmediateLine !== null && isTableBlockStartAtLine(state, nextImmediateLine, detectBlockFn)) {
    return "table_before";
  }
  if (nextImmediateLine !== null && isHorizontalRuleAtLine(state, nextImmediateLine, detectBlockFn)) {
    return "hr_before";
  }
  if (prevIsQuoteLike && nextIsQuoteLike) {
    return "inside_quote_run";
  }
  if (!prevIsQuoteLike && nextIsQuoteLike) {
    return "quote_before";
  }
  if (prevIsQuoteLike && !nextIsQuoteLike) {
    return "quote_after";
  }
  const listContext = resolveListContextAtInsertion(
    state,
    clampedTarget,
    detectBlockFn,
    { lineMap }
  );
  if (listContext) {
    return "inside_list";
  }
  return "outside";
}
function resolveDropRuleContextAtInsertion(state, sourceBlock, targetLineNumber, detectBlockFn = defaultDetectBlock, options) {
  const slotContext = resolveSlotContextAtInsertion(state, targetLineNumber, detectBlockFn, options);
  const decision = resolveInsertionRule({
    sourceType: sourceBlock.type,
    slotContext
  });
  return {
    slotContext,
    decision
  };
}

// src/core/container-rules/container-policy-service.ts
var ContainerPolicyService = class {
  constructor(view) {
    this.view = view;
  }
  resolveDropRuleAtInsertion(sourceBlock, targetLineNumber, options) {
    var _a;
    const lineMap = (_a = options == null ? void 0 : options.lineMap) != null ? _a : getLineMap(this.view.state);
    return resolveDropRuleContextAtInsertion(
      this.view.state,
      sourceBlock,
      targetLineNumber,
      void 0,
      { lineMap }
    );
  }
  shouldPreventDropIntoDifferentContainer(sourceBlock, targetLineNumber) {
    return !this.resolveDropRuleAtInsertion(sourceBlock, targetLineNumber).decision.allowDrop;
  }
};

// src/core/mutation/structure-mutation.ts
function buildInsertText(params) {
  const {
    sourceBlockType,
    sourceContent,
    adjustListToTargetContext: adjustListToTargetContextFn
  } = params;
  let text = sourceContent;
  if (sourceBlockType !== "blockquote" /* Blockquote */) {
    text = adjustListToTargetContextFn(text);
  }
  text += "\n";
  return text;
}

// src/core/mutation/text-mutation-policy.ts
var TextMutationPolicy = class {
  constructor(lineParsingService) {
    this.lineParsingService = lineParsingService;
  }
  parseLineWithQuote(line) {
    return this.lineParsingService.parseLine(line);
  }
  getListContext(doc, lineNumber) {
    return getListContext(doc, lineNumber, (line) => this.parseLineWithQuote(line));
  }
  getIndentUnitWidth(sample) {
    return this.lineParsingService.getIndentUnitWidth(sample);
  }
  getIndentUnitWidthForDoc(doc) {
    return this.lineParsingService.getIndentUnitWidthForDoc(doc);
  }
  buildInsertText(doc, sourceBlock, targetLineNumber, sourceContent, listContextLineNumberOverride, listIndentDeltaOverride, listTargetIndentWidthOverride) {
    return buildInsertText({
      sourceBlockType: sourceBlock.type,
      sourceContent,
      adjustListToTargetContext: (content) => adjustListToTargetContext({
        doc,
        sourceContent: content,
        targetLineNumber,
        parseLineWithQuote: (line) => this.parseLineWithQuote(line),
        getIndentUnitWidth: (sample) => this.getIndentUnitWidth(sample),
        buildIndentStringFromSample: (sample, width) => this.lineParsingService.buildIndentStringFromSample(sample, width),
        buildTargetMarker: (_target, source) => source.marker,
        markerConversionScope: "none",
        getListContext: (activeDoc, lineNumber) => this.getListContext(activeDoc, lineNumber),
        listContextLineNumberOverride,
        listIndentDeltaOverride,
        listTargetIndentWidthOverride
      })
    });
  }
};

// src/platform/obsidian/editor-view.ts
function getCodeMirrorView(markdownView) {
  var _a;
  const maybeView = (_a = markdownView.editor) == null ? void 0 : _a.cm;
  return maybeView != null ? maybeView : null;
}

// src/platform/obsidian/editor-markdown-view.ts
function resolveMarkdownViewForEditor(app, editorView) {
  var _a;
  for (const leaf of app.workspace.getLeavesOfType("markdown")) {
    const view = leaf.view;
    if (((_a = view.getViewType) == null ? void 0 : _a.call(view)) !== "markdown")
      continue;
    const markdownView = view;
    if (getCodeMirrorView(markdownView) === editorView) {
      return markdownView;
    }
  }
  return null;
}

// src/platform/obsidian/editor-fold.ts
var TEXT_NODE = 3;
function isElementLike(value) {
  if (!value || typeof value !== "object")
    return false;
  return typeof value.closest === "function";
}
function resolveVisibleLineElement(view, lineNumber) {
  var _a, _b, _c;
  try {
    const line = view.state.doc.line(lineNumber);
    const block = typeof view.lineBlockAt === "function" ? view.lineBlockAt(line.from) : null;
    if (block && typeof block.from === "number" && block.from !== line.from) {
      return null;
    }
    const domAtPos = view.domAtPos(line.from);
    const rawNode = domAtPos.node;
    const base = rawNode.nodeType === TEXT_NODE ? (_a = rawNode.parentElement) != null ? _a : null : rawNode;
    if (!isElementLike(base))
      return null;
    return (_c = (_b = base.closest) == null ? void 0 : _b.call(base, ".cm-line")) != null ? _c : null;
  } catch (e) {
    return null;
  }
}
function isEditorLineCollapsed(view, lineNumber) {
  var _a, _b, _c;
  const lineEl = resolveVisibleLineElement(view, lineNumber);
  if (!lineEl)
    return false;
  if (((_a = lineEl.classList) == null ? void 0 : _a.contains("is-collapsed")) || ((_b = lineEl.classList) == null ? void 0 : _b.contains("cm-folded"))) {
    return true;
  }
  return !!((_c = lineEl.querySelector) == null ? void 0 : _c.call(
    lineEl,
    ".cm-foldPlaceholder, .cm-fold-indicator.is-collapsed, .collapse-indicator.is-collapsed"
  ));
}
function restoreSelectionsAndScroll(editor, selections, scroll) {
  editor.setSelections(selections);
  editor.scrollTo(scroll.left, scroll.top);
}
function toggleLineFolds(params) {
  const { app, view, targetLineNumbers } = params;
  if (targetLineNumbers.length === 0)
    return;
  const markdownView = resolveMarkdownViewForEditor(app, view);
  const editor = markdownView == null ? void 0 : markdownView.editor;
  if (!editor)
    return;
  const selections = editor.listSelections();
  const scroll = editor.getScrollInfo();
  const hadFocus = editor.hasFocus();
  try {
    for (const targetLineNumber of [...new Set(targetLineNumbers)].sort((a, b) => b - a)) {
      if (targetLineNumber < 1 || targetLineNumber > editor.lineCount())
        continue;
      if (isEditorLineCollapsed(view, targetLineNumber))
        continue;
      editor.setCursor({ line: targetLineNumber - 1, ch: 0 });
      editor.exec("toggleFold");
    }
  } finally {
    restoreSelectionsAndScroll(editor, selections, scroll);
    if (!hadFocus && editor.hasFocus()) {
      editor.blur();
    }
  }
}

// src/features/state/drag-source-resolver.ts
var DragSourceResolver = class {
  constructor(view) {
    this.view = view;
  }
  getBlockInfoForHandle(handle) {
    const startLine = resolveLineNumberFromBlockStartAttribute(this.view, handle);
    if (startLine !== null) {
      const block = this.getDraggableBlockAtLine(startLine);
      if (block)
        return block;
    }
    const lineNumber = resolveLineNumberFromDomNodes(this.view, [handle]);
    if (lineNumber !== null) {
      const block = this.getDraggableBlockAtLine(lineNumber);
      if (block)
        return block;
    }
    return null;
  }
  getDraggableBlockAtLine(lineNumber) {
    const block = detectBlock(this.view.state, lineNumber);
    if (!block)
      return null;
    return this.expandHeadingBlockIfCollapsed(block);
  }
  getLineNumberAtVerticalPosition(clientY, contentRect) {
    const activeContentRect = contentRect != null ? contentRect : this.view.contentDOM.getBoundingClientRect();
    if (clientY < activeContentRect.top || clientY > activeContentRect.bottom)
      return null;
    try {
      const lineBlock = this.view.lineBlockAtHeight(clientY - this.view.documentTop);
      return resolveLineNumberFromPos(this.view, lineBlock.from);
    } catch (e) {
      return null;
    }
  }
  getDraggableBlockAtVerticalPosition(clientY, contentRect) {
    const lineNumber = this.getLineNumberAtVerticalPosition(clientY, contentRect);
    if (lineNumber === null)
      return null;
    return this.getDraggableBlockAtLine(lineNumber);
  }
  getDraggableBlockAtPoint(clientX, clientY) {
    const embedAtPoint = this.getEmbedElementAtPoint(clientX, clientY);
    if (embedAtPoint) {
      const embedBlock = this.getBlockInfoForEmbed(embedAtPoint);
      if (embedBlock)
        return embedBlock;
    }
    const renderedLineNumber = getRenderedMainLineNumberAtPoint(this.view, clientX, clientY);
    if (renderedLineNumber !== null) {
      const renderedBlock = this.getDraggableBlockAtLine(renderedLineNumber);
      if (renderedBlock)
        return renderedBlock;
    }
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    if (clientY < contentRect.top || clientY > contentRect.bottom)
      return null;
    const lineNumber = resolveLineNumberAtCoords(this.view, clientX, clientY, contentRect);
    if (lineNumber === null)
      return null;
    return this.getDraggableBlockAtLine(lineNumber);
  }
  getBlockInfoForEmbed(embedEl) {
    const candidates = this.collectEmbedProbeCandidates(embedEl);
    for (const candidate of candidates) {
      const lineNumber = resolveLineNumberFromDomNodes(this.view, [candidate]);
      if (lineNumber === null)
        continue;
      const block = this.getDraggableBlockAtLine(lineNumber);
      if (block)
        return block;
    }
    return null;
  }
  collectEmbedProbeCandidates(embedEl) {
    const seen = /* @__PURE__ */ new Set();
    const candidates = [];
    const push = (el) => {
      if (!el)
        return;
      if (seen.has(el))
        return;
      seen.add(el);
      candidates.push(el);
    };
    push(embedEl.closest(EMBED_ROOT_SELECTOR));
    push(embedEl.closest(CODEMIRROR_LINE_SELECTOR));
    push(embedEl);
    let current = embedEl.parentElement;
    while (current) {
      push(current);
      if (current === this.view.dom)
        break;
      current = current.parentElement;
    }
    return candidates;
  }
  getEmbedElementAtPoint(clientX, clientY) {
    return findEmbedElementAtPoint(this.view, clientX, clientY, {
      requireDirectWithinRoot: true,
      normalizeToEmbedRoot: true
    });
  }
  expandHeadingBlockIfCollapsed(block) {
    if (block.type !== "heading" /* Heading */)
      return block;
    const headingLineNumber = block.startLine + 1;
    if (!isEditorLineCollapsed(this.view, headingLineNumber))
      return block;
    const range = getHeadingSectionRange(this.view.state.doc, headingLineNumber);
    if (!range || range.endLine <= headingLineNumber)
      return block;
    const endLineObj = this.view.state.doc.line(range.endLine);
    let content = "";
    for (let i = headingLineNumber; i <= range.endLine; i++) {
      content += this.view.state.doc.line(i).text;
      if (i < range.endLine)
        content += "\n";
    }
    return {
      ...block,
      endLine: range.endLine - 1,
      to: endLineObj.to,
      content
    };
  }
};

// src/features/application/drag-service-container.ts
var DragDropServiceContainer = class {
  constructor(view) {
    this.view = view;
    this.dragSource = new DragSourceResolver(view);
    this.lineParsing = new LineParsingService(view);
    this.geometry = new GeometryCalculator(view, this.lineParsing);
    this.containerPolicy = new ContainerPolicyService(view);
    this.textMutation = new TextMutationPolicy(this.lineParsing);
  }
  createDropTargetCalculatorDeps(hooks) {
    const sharedDeps = this.createSharedMutationPolicyDeps();
    return {
      ...sharedDeps,
      getBlockInfoForEmbed: (el) => this.dragSource.getBlockInfoForEmbed(el),
      getIndentUnitWidthForDoc: (doc) => this.textMutation.getIndentUnitWidthForDoc(doc),
      getLineRect: (ln) => this.geometry.getLineRect(ln),
      getInsertionAnchorY: (ln) => this.geometry.getInsertionAnchorY(ln),
      getLineIndentPosByWidth: (ln, w) => this.geometry.getLineIndentPosByWidth(ln, w),
      getBlockRect: (s, e) => this.geometry.getBlockRect(s, e),
      ...hooks
    };
  }
  createBlockMoverDeps() {
    const sharedDeps = this.createSharedMutationPolicyDeps();
    return {
      ...sharedDeps,
      buildInsertText: (doc, src, ln, content, lcln, lid, ltw) => this.textMutation.buildInsertText(doc, src, ln, content, lcln, lid, ltw)
    };
  }
  createSharedMutationPolicyDeps() {
    return {
      parseLineWithQuote: (line) => this.textMutation.parseLineWithQuote(line),
      getAdjustedTargetLocation: (ln, opts) => this.geometry.getAdjustedTargetLocation(ln, opts),
      resolveDropRuleAtInsertion: (src, ln, opts) => this.containerPolicy.resolveDropRuleAtInsertion(src, ln, opts),
      getListContext: (doc, ln) => this.textMutation.getListContext(doc, ln),
      getIndentUnitWidth: (sample) => this.textMutation.getIndentUnitWidth(sample)
    };
  }
};

// src/features/state/drag-lifecycle-emitter.ts
function buildListIntent(raw) {
  if (typeof raw.listContextLineNumber !== "number" && typeof raw.listIndentDelta !== "number" && typeof raw.listTargetIndentWidth !== "number") {
    return null;
  }
  return {
    listContextLineNumber: raw.listContextLineNumber,
    listIndentDelta: raw.listIndentDelta,
    listTargetIndentWidth: raw.listTargetIndentWidth
  };
}
var DragLifecycleEmitter = class {
  constructor(sink) {
    this.sink = sink;
    this.lastSignature = null;
  }
  emit(event) {
    const payload = normalizeEvent(event);
    const signature = buildSignature(payload);
    if (signature === this.lastSignature)
      return;
    this.lastSignature = signature;
    this.sink(payload);
  }
  reset() {
    this.lastSignature = null;
  }
};
function normalizeEvent(event) {
  var _a, _b, _c, _d;
  return {
    state: event.state,
    sourceBlock: (_a = event.sourceBlock) != null ? _a : null,
    targetLine: typeof event.targetLine === "number" ? event.targetLine : null,
    listIntent: (_b = event.listIntent) != null ? _b : null,
    rejectReason: (_c = event.rejectReason) != null ? _c : null,
    pointerType: (_d = event.pointerType) != null ? _d : null,
    pressReady: event.pressReady === true
  };
}
function buildSignature(event) {
  var _a, _b, _c, _d;
  return JSON.stringify({
    state: event.state,
    sourceStart: (_b = (_a = event.sourceBlock) == null ? void 0 : _a.startLine) != null ? _b : null,
    sourceEnd: (_d = (_c = event.sourceBlock) == null ? void 0 : _c.endLine) != null ? _d : null,
    targetLine: event.targetLine,
    listIntent: event.listIntent,
    rejectReason: event.rejectReason,
    pointerType: event.pointerType,
    pressReady: event.pressReady === true
  });
}

// src/features/ui/handle/handle-renderer.ts
function createDragHandleElement(options) {
  var _a;
  const handle = document.createElement("div");
  handle.className = (_a = options.className) != null ? _a : "dnd-drag-handle";
  handle.setAttribute("draggable", "true");
  const core = document.createElement("span");
  core.className = HANDLE_CORE_CLASS;
  core.setAttribute("aria-hidden", "true");
  handle.appendChild(core);
  handle.addEventListener("dragstart", (e) => options.onDragStart(e, handle));
  if (options.onDragEnd) {
    handle.addEventListener("dragend", (e) => {
      var _a2;
      return (_a2 = options.onDragEnd) == null ? void 0 : _a2.call(options, e, handle);
    });
  }
  return handle;
}

// src/features/application/interaction-orchestrator.ts
var DragInteractionOrchestrator = class {
  constructor(deps) {
    this.view = deps.view;
    this.services = deps.services;
    this.blockMover = deps.blockMover;
    this.dropTargetCalculator = deps.dropTargetCalculator;
    this.handleVisibility = deps.handleVisibility;
    this.dragPerfManager = deps.dragPerfManager;
    this.lifecycleEmitter = deps.lifecycleEmitter;
    this.getSemanticRefreshScheduler = deps.getSemanticRefreshScheduler;
    this.refreshDecorationsAndEmbeds = deps.refreshDecorationsAndEmbeds;
    this.getDragEventHandler = deps.getDragEventHandler;
    this.resolveEditorDocumentKey = deps.resolveEditorDocumentKey;
  }
  createHandleElement(getBlockInfo) {
    const handle = createDragHandleElement({
      onDragStart: (e, el) => {
        this.getSemanticRefreshScheduler().ensureSemanticReadyForInteraction();
        const resolveCurrentBlock = () => this.resolveInteractionBlockInfo({
          handle,
          clientX: e.clientX,
          clientY: e.clientY,
          fallback: getBlockInfo
        });
        const sourceBlock = resolveCurrentBlock();
        if (sourceBlock) {
          this.handleVisibility.enterGrabVisualStateForBlock(
            sourceBlock,
            el
          );
        } else {
          this.handleVisibility.setActiveVisibleHandle(el);
        }
        const started = startDragFromHandle(e, this.view, () => resolveCurrentBlock(), el);
        if (!started) {
          this.handleVisibility.setActiveVisibleHandle(null);
          finishDragSession(this.view);
          this.flushDragPerfSession("drag_start_failed");
          this.emitDragLifecycle({
            state: "cancelled",
            sourceBlock: sourceBlock != null ? sourceBlock : null,
            targetLine: null,
            listIntent: null,
            rejectReason: "drag_start_failed",
            pointerType: "mouse"
          });
          this.emitDragLifecycle({
            state: "idle",
            sourceBlock: null,
            targetLine: null,
            listIntent: null,
            rejectReason: null,
            pointerType: null
          });
          return;
        }
        this.ensureDragPerfSession();
        this.emitDragLifecycle({
          state: "drag_active",
          sourceBlock: sourceBlock != null ? sourceBlock : null,
          targetLine: null,
          listIntent: null,
          rejectReason: null,
          pointerType: "mouse"
        });
      },
      onDragEnd: () => {
        this.handleVisibility.clearGrabbedLineNumbers();
        this.handleVisibility.setActiveVisibleHandle(null);
        finishDragSession(this.view);
        this.flushDragPerfSession("drag_end");
        this.refreshDecorationsAndEmbeds();
        this.emitDragLifecycle({
          state: "idle",
          sourceBlock: null,
          targetLine: null,
          listIntent: null,
          rejectReason: null,
          pointerType: null
        });
      }
    });
    handle.addEventListener("pointerdown", (e) => {
      this.getSemanticRefreshScheduler().ensureSemanticReadyForInteraction();
      const resolveCurrentBlock = () => this.resolveInteractionBlockInfo({
        handle,
        clientX: e.clientX,
        clientY: e.clientY,
        fallback: getBlockInfo
      });
      this.handleVisibility.setActiveVisibleHandle(handle);
      this.getDragEventHandler().startPointerDragFromHandle(handle, e, () => resolveCurrentBlock());
    });
    return handle;
  }
  performDropAtPoint(sourceBlock, clientX, clientY, pointerType) {
    var _a, _b;
    this.ensureDragPerfSession();
    const view = this.view;
    const sourceView = getActiveDragSourceView();
    const sourceScope = sourceView && sourceView !== view ? "cross_editor" : "same_editor";
    const sourceDocumentRelation = this.resolveDragDocumentRelation(sourceView);
    const validation = this.dropTargetCalculator.resolveValidatedDropTarget({
      clientX,
      clientY,
      dragSource: sourceBlock,
      pointerType,
      sourceScope
    });
    const listIntent = this.buildListIntentFromValidation(validation);
    if (!validation.allowed || typeof validation.targetLineNumber !== "number") {
      this.emitDragLifecycle({
        state: "cancelled",
        sourceBlock,
        targetLine: (_a = validation.targetLineNumber) != null ? _a : null,
        listIntent,
        rejectReason: (_b = validation.reason) != null ? _b : "no_target",
        pointerType
      });
      return;
    }
    const targetLineNumber = validation.targetLineNumber;
    const targetPos = targetLineNumber > view.state.doc.lines ? view.state.doc.length : view.state.doc.line(targetLineNumber).from;
    this.blockMover.moveBlock({
      sourceBlock,
      targetPos,
      targetLineNumberOverride: targetLineNumber,
      listContextLineNumberOverride: validation.listContextLineNumber,
      listIndentDeltaOverride: validation.listIndentDelta,
      listTargetIndentWidthOverride: validation.listTargetIndentWidth,
      sourceView: sourceScope === "cross_editor" && sourceView ? sourceView : void 0,
      sourceDocumentRelation
    });
    this.emitDragLifecycle({
      state: "drop_commit",
      sourceBlock,
      targetLine: targetLineNumber,
      listIntent,
      rejectReason: null,
      pointerType
    });
  }
  resolveInteractionBlockInfo(params) {
    var _a, _b, _c;
    const allowRefreshRetry = params.allowRefreshRetry !== false;
    const resolveOnce = () => {
      var _a2, _b2, _c2, _d;
      if (params.handle) {
        let fromHandle = null;
        try {
          fromHandle = this.services.dragSource.getBlockInfoForHandle(params.handle);
        } catch (e) {
          fromHandle = null;
        }
        if (fromHandle) {
          this.syncHandleBlockAttributes(params.handle, fromHandle);
          return fromHandle;
        }
      }
      if (Number.isFinite(params.clientX) && Number.isFinite(params.clientY)) {
        let fromPoint = null;
        try {
          fromPoint = this.services.dragSource.getDraggableBlockAtPoint(params.clientX, params.clientY);
        } catch (e) {
          fromPoint = null;
        }
        if (fromPoint) {
          this.syncHandleBlockAttributes((_a2 = params.handle) != null ? _a2 : null, fromPoint);
          return fromPoint;
        }
      }
      const fromFallback = (_c2 = (_b2 = params.fallback) == null ? void 0 : _b2.call(params)) != null ? _c2 : null;
      if (fromFallback) {
        this.syncHandleBlockAttributes((_d = params.handle) != null ? _d : null, fromFallback);
      }
      return fromFallback;
    };
    const first = resolveOnce();
    if (first || !allowRefreshRetry)
      return first;
    this.refreshDecorationsAndEmbeds();
    if (Number.isFinite(params.clientX) && Number.isFinite(params.clientY)) {
      try {
        const fromPoint = this.services.dragSource.getDraggableBlockAtPoint(params.clientX, params.clientY);
        if (fromPoint) {
          this.syncHandleBlockAttributes((_a = params.handle) != null ? _a : null, fromPoint);
          return fromPoint;
        }
      } catch (e) {
      }
    }
    return (_c = (_b = params.fallback) == null ? void 0 : _b.call(params)) != null ? _c : null;
  }
  ensureDragPerfSession() {
    this.getSemanticRefreshScheduler().ensureSemanticReadyForInteraction();
    this.dragPerfManager.ensure();
  }
  flushDragPerfSession(reason) {
    this.dragPerfManager.flush(reason);
  }
  emitDragLifecycle(event) {
    this.lifecycleEmitter.emit(event);
  }
  buildListIntentFromValidation(validation) {
    return buildListIntent({
      listContextLineNumber: validation.listContextLineNumber,
      listIndentDelta: validation.listIndentDelta,
      listTargetIndentWidth: validation.listTargetIndentWidth
    });
  }
  syncHandleBlockAttributes(handle, blockInfo) {
    if (!handle || !handle.isConnected)
      return;
    handle.setAttribute("data-block-start", String(blockInfo.startLine));
    handle.setAttribute("data-block-end", String(blockInfo.endLine));
  }
  resolveDragDocumentRelation(sourceView) {
    if (!sourceView || sourceView === this.view) {
      return "same_document";
    }
    const resolveDocumentKey = this.resolveEditorDocumentKey;
    if (!resolveDocumentKey) {
      return "different_document";
    }
    const sourceDocumentKey = resolveDocumentKey(sourceView);
    const targetDocumentKey = resolveDocumentKey(this.view);
    if (!sourceDocumentKey || !targetDocumentKey) {
      return "different_document";
    }
    return sourceDocumentKey === targetDocumentKey ? "same_document" : "different_document";
  }
};

// src/plugin/settings.ts
var import_obsidian2 = require("obsidian");

// src/plugin/i18n/index.ts
var import_obsidian = require("obsidian");

// src/plugin/i18n/en.ts
var en = {
  headingAppearance: "Appearance",
  headingBehavior: "Behavior",
  handleColor: "Handle color",
  handleColorDesc: "Follow theme accent or pick a custom color",
  optionTheme: "Theme",
  optionCustom: "Custom",
  handleVisibility: "Handle visibility",
  handleVisibilityDesc: "Control how drag handles are displayed",
  optionHover: "Hover",
  optionAlways: "Always",
  optionHidden: "Hidden",
  dragSourceVisualStyle: "Drag source visual style",
  dragSourceVisualStyleDesc: "Shared highlight style",
  optionDragSourceVisualOutline: "Outline only",
  optionDragSourceVisualSubtle: "Subtle highlight",
  optionDragSourceVisualFilled: "Filled highlight",
  enableDragSourceHighlight: "Drag source highlight",
  enableDragSourceHighlightDesc: "Highlight the block being dragged",
  enableListDropHighlight: "List drop highlight",
  enableListDropHighlightDesc: "Highlight list drop target area",
  handleIcon: "Handle icon",
  handleIconDesc: "Choose the icon style for drag handles",
  iconDot: "\u25CF dot",
  iconGripDots: "\u283F grip dots",
  iconGripLines: "\u2630 grip lines",
  iconSquare: "\u25A0 square",
  handleSize: "Handle size",
  handleSizeDesc: "Adjust the size of drag handles (px)",
  handleOffset: "Handle horizontal offset",
  handleOffsetDesc: "Negative = left, positive = right",
  handleGutterPosition: "Handle gutter side",
  handleGutterPositionDesc: "Show the handle gutter on the left or right side of the editor",
  optionLeft: "Left",
  optionRight: "Right",
  indicatorColor: "Indicator color",
  indicatorColorDesc: "Follow theme accent or pick a custom color",
  multiLineSelection: "Multi-line selection",
  multiLineSelectionDesc: "Disable to keep single-block drag only",
  enableMultiSelectionDeleteButton: "Show delete button for multi-select",
  enableMultiSelectionDeleteButtonDesc: "When enabled, committed multi-block selections show a delete button near the left selection link",
  multiLineSelectionLongPressMs: "Multi-line selection long-press duration",
  multiLineSelectionLongPressMsDesc: "Enter milliseconds (300-2000). On mobile, hold for this duration before entering multi-block selection mode",
  mobileTextLongPressDrag: "Mobile text long-press drag",
  mobileTextLongPressDragDesc: "On mobile, long-press a text line or rendered block content to drag the current block directly without using the left handle",
  enableCrossFileDrag: "Cross-file drag",
  enableCrossFileDragDesc: "Allow dragging blocks into another open file editor"
};

// src/plugin/i18n/zh-cn.ts
var zhCn = {
  // Headings
  headingAppearance: "\u6837\u5F0F",
  headingBehavior: "\u529F\u80FD",
  // Handle color
  handleColor: "\u624B\u67C4\u989C\u8272",
  handleColorDesc: "\u8DDF\u968F\u4E3B\u9898\u5F3A\u8C03\u8272\u6216\u81EA\u5B9A\u4E49\u989C\u8272",
  optionTheme: "\u8DDF\u968F\u4E3B\u9898\u8272",
  optionCustom: "\u81EA\u5B9A\u4E49",
  // Handle visibility
  handleVisibility: "\u624B\u67C4\u663E\u793A\u6A21\u5F0F",
  handleVisibilityDesc: "\u63A7\u5236\u62D6\u62FD\u624B\u67C4\u7684\u663E\u793A\u65B9\u5F0F",
  optionHover: "\u60AC\u505C\u663E\u793A",
  optionAlways: "\u59CB\u7EC8\u663E\u793A",
  optionHidden: "\u9690\u85CF",
  dragSourceVisualStyle: "\u62D6\u62FD\u6E90\u89C6\u89C9\u6837\u5F0F",
  dragSourceVisualStyleDesc: "\u7EDF\u4E00\u9AD8\u4EAE\u6837\u5F0F",
  optionDragSourceVisualOutline: "\u7EAF\u8FB9\u6846",
  optionDragSourceVisualSubtle: "\u7B80\u7EA6\u9AD8\u4EAE",
  optionDragSourceVisualFilled: "\u80CC\u666F\u589E\u5F3A",
  enableDragSourceHighlight: "\u62D6\u62FD\u6E90\u9AD8\u4EAE",
  enableDragSourceHighlightDesc: "\u9AD8\u4EAE\u88AB\u62D6\u52A8\u7684\u6E90\u5757",
  enableListDropHighlight: "\u5217\u8868\u843D\u70B9\u9AD8\u4EAE",
  enableListDropHighlightDesc: "\u9AD8\u4EAE\u5217\u8868\u5185\u53EF\u653E\u7F6E\u533A\u57DF",
  // Handle icon
  handleIcon: "\u624B\u67C4\u56FE\u6807",
  handleIconDesc: "\u9009\u62E9\u62D6\u62FD\u624B\u67C4\u7684\u56FE\u6807\u6837\u5F0F",
  iconDot: "\u25CF \u5706\u70B9",
  iconGripDots: "\u283F \u516D\u70B9\u6293\u624B",
  iconGripLines: "\u2630 \u4E09\u6A2A\u7EBF",
  iconSquare: "\u25A0 \u65B9\u5757",
  // Handle size
  handleSize: "\u624B\u67C4\u5927\u5C0F",
  handleSizeDesc: "\u8C03\u6574\u62D6\u62FD\u624B\u67C4\u7684\u5927\u5C0F\uFF08\u50CF\u7D20\uFF09",
  // Handle offset
  handleOffset: "\u624B\u67C4\u6A2A\u5411\u4F4D\u7F6E",
  handleOffsetDesc: "\u5411\u5DE6\u4E3A\u8D1F\u503C\uFF0C\u5411\u53F3\u4E3A\u6B63\u503C",
  handleGutterPosition: "\u624B\u67C4\u6240\u5728\u4FA7",
  handleGutterPositionDesc: "\u63A7\u5236\u624B\u67C4 gutter \u663E\u793A\u5728\u7F16\u8F91\u5668\u5DE6\u4FA7\u8FD8\u662F\u53F3\u4FA7",
  optionLeft: "\u5DE6\u4FA7",
  optionRight: "\u53F3\u4FA7",
  // Indicator color
  indicatorColor: "\u6307\u793A\u5668\u989C\u8272",
  indicatorColorDesc: "\u8DDF\u968F\u4E3B\u9898\u5F3A\u8C03\u8272\u6216\u81EA\u5B9A\u4E49\u989C\u8272",
  // Multi-line selection
  multiLineSelection: "\u591A\u884C\u9009\u53D6",
  multiLineSelectionDesc: "\u5173\u95ED\u540E\u4EC5\u4FDD\u7559\u5355\u5757\u62D6\u62FD\uFF0C\u4E0D\u8FDB\u5165\u591A\u884C\u9009\u53D6\u6D41\u7A0B",
  enableMultiSelectionDeleteButton: "\u591A\u9009\u663E\u793A\u5220\u9664\u6309\u94AE",
  enableMultiSelectionDeleteButtonDesc: "\u5F00\u542F\u540E\uFF0C\u591A\u6587\u672C\u5757\u9009\u4E2D\u72B6\u6001\u4F1A\u5728\u5DE6\u4FA7\u8FDE\u7EBF\u9876\u90E8\u663E\u793A\u5220\u9664\u6309\u94AE",
  multiLineSelectionLongPressMs: "\u591A\u9009\u6A21\u5F0F\u957F\u6309\u65F6\u957F",
  multiLineSelectionLongPressMsDesc: "\u8F93\u5165\u6BEB\u79D2\u6570\uFF08300-2000\uFF09\uFF0C\u79FB\u52A8\u7AEF\u957F\u6309\u8FBE\u5230\u8BE5\u65F6\u957F\u540E\u8FDB\u5165\u591A\u6587\u672C\u5757\u9009\u62E9\u6A21\u5F0F",
  mobileTextLongPressDrag: "\u79FB\u52A8\u7AEF\u6587\u672C\u957F\u6309\u62D6\u62FD",
  mobileTextLongPressDragDesc: "\u79FB\u52A8\u7AEF\u5728\u6587\u672C\u6574\u884C\u6216\u5757\u5185\u5BB9\u533A\u57DF\u957F\u6309\u53EF\u76F4\u63A5\u62D6\u62FD\u5F53\u524D\u5757\uFF0C\u65E0\u9700\u5DE6\u4FA7\u624B\u67C4",
  enableCrossFileDrag: "\u8DE8\u6587\u4EF6\u62D6\u62FD",
  enableCrossFileDragDesc: "\u5141\u8BB8\u5C06\u5757\u62D6\u62FD\u5230\u53E6\u4E00\u4E2A\u5DF2\u6253\u5F00\u6587\u4EF6\u7684\u7F16\u8F91\u5668\u4E2D"
};

// src/plugin/i18n/index.ts
function t() {
  const locale = import_obsidian.moment.locale();
  return locale.startsWith("zh") ? zhCn : en;
}

// src/plugin/settings.ts
var DEFAULT_MULTI_LINE_SELECTION_LONG_PRESS_MS = 900;
var MIN_MULTI_LINE_SELECTION_LONG_PRESS_MS = 300;
var MAX_MULTI_LINE_SELECTION_LONG_PRESS_MS = 2e3;
function normalizeMultiLineSelectionLongPressMs(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_MULTI_LINE_SELECTION_LONG_PRESS_MS;
  }
  return Math.max(
    MIN_MULTI_LINE_SELECTION_LONG_PRESS_MS,
    Math.min(MAX_MULTI_LINE_SELECTION_LONG_PRESS_MS, Math.round(value))
  );
}
var DEFAULT_SETTINGS = {
  handleColorMode: "theme",
  handleColor: "#8a8a8a",
  handleVisibility: "hover",
  handleIcon: "dot",
  handleSize: 16,
  indicatorColorMode: "theme",
  indicatorColor: "#7a7a7a",
  enableCrossFileDrag: false,
  enableMultiLineSelection: true,
  enableMultiSelectionDeleteButton: false,
  multiLineSelectionLongPressMs: DEFAULT_MULTI_LINE_SELECTION_LONG_PRESS_MS,
  enableMobileTextLongPressDrag: true,
  enableDragSourceHighlight: true,
  enableListDropHighlight: true,
  dragSourceVisualStyle: "subtle",
  handleHorizontalOffsetPx: -8,
  handleGutterPosition: "left"
};
function normalizeHandleGutterPosition(value) {
  return value === "right" ? "right" : "left";
}
function normalizeDragSourceVisualStyle(value) {
  if (value === "outline" || value === "subtle" || value === "filled") {
    return value;
  }
  if (value === "none") {
    return "outline";
  }
  return "subtle";
}
var DragNDropSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const i = t();
    new import_obsidian2.Setting(containerEl).setName(i.headingAppearance).setHeading();
    const colorSetting = new import_obsidian2.Setting(containerEl).setName(i.handleColor).setDesc(i.handleColorDesc);
    colorSetting.addDropdown((dropdown) => dropdown.addOption("theme", i.optionTheme).addOption("custom", i.optionCustom).setValue(this.plugin.settings.handleColorMode).onChange(async (value) => {
      this.plugin.settings.handleColorMode = value;
      await this.plugin.saveSettings();
    }));
    colorSetting.addColorPicker((picker) => picker.setValue(this.plugin.settings.handleColor).onChange(async (value) => {
      this.plugin.settings.handleColor = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.handleVisibility).setDesc(i.handleVisibilityDesc).addDropdown((dropdown) => dropdown.addOption("hover", i.optionHover).addOption("always", i.optionAlways).addOption("hidden", i.optionHidden).setValue(this.plugin.settings.handleVisibility).onChange(async (value) => {
      this.plugin.settings.handleVisibility = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.dragSourceVisualStyle).setDesc(i.dragSourceVisualStyleDesc).addDropdown((dropdown) => dropdown.addOption("outline", i.optionDragSourceVisualOutline).addOption("subtle", i.optionDragSourceVisualSubtle).addOption("filled", i.optionDragSourceVisualFilled).setValue(this.plugin.settings.dragSourceVisualStyle).onChange(async (value) => {
      this.plugin.settings.dragSourceVisualStyle = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.enableDragSourceHighlight).setDesc(i.enableDragSourceHighlightDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableDragSourceHighlight).onChange(async (value) => {
      this.plugin.settings.enableDragSourceHighlight = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.enableListDropHighlight).setDesc(i.enableListDropHighlightDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableListDropHighlight).onChange(async (value) => {
      this.plugin.settings.enableListDropHighlight = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.handleIcon).setDesc(i.handleIconDesc).addDropdown((dropdown) => dropdown.addOption("dot", i.iconDot).addOption("grip-dots", i.iconGripDots).addOption("grip-lines", i.iconGripLines).addOption("square", i.iconSquare).setValue(this.plugin.settings.handleIcon).onChange(async (value) => {
      this.plugin.settings.handleIcon = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.handleSize).setDesc(i.handleSizeDesc).addSlider((slider) => slider.setLimits(12, 28, 2).setDynamicTooltip().setValue(this.plugin.settings.handleSize).onChange(async (value) => {
      this.plugin.settings.handleSize = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.handleOffset).setDesc(i.handleOffsetDesc).addSlider((slider) => slider.setLimits(-80, 80, 1).setDynamicTooltip().setValue(this.plugin.settings.handleHorizontalOffsetPx).onChange(async (value) => {
      this.plugin.settings.handleHorizontalOffsetPx = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.handleGutterPosition).setDesc(i.handleGutterPositionDesc).addDropdown((dropdown) => dropdown.addOption("left", i.optionLeft).addOption("right", i.optionRight).setValue(this.plugin.settings.handleGutterPosition).onChange(async (value) => {
      this.plugin.settings.handleGutterPosition = value;
      await this.plugin.saveSettings();
    }));
    const indicatorSetting = new import_obsidian2.Setting(containerEl).setName(i.indicatorColor).setDesc(i.indicatorColorDesc);
    indicatorSetting.addDropdown((dropdown) => dropdown.addOption("theme", i.optionTheme).addOption("custom", i.optionCustom).setValue(this.plugin.settings.indicatorColorMode).onChange(async (value) => {
      this.plugin.settings.indicatorColorMode = value;
      await this.plugin.saveSettings();
    }));
    indicatorSetting.addColorPicker((picker) => picker.setValue(this.plugin.settings.indicatorColor).onChange(async (value) => {
      this.plugin.settings.indicatorColor = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.headingBehavior).setHeading();
    new import_obsidian2.Setting(containerEl).setName(i.multiLineSelection).setDesc(i.multiLineSelectionDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableMultiLineSelection).onChange(async (value) => {
      this.plugin.settings.enableMultiLineSelection = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.enableMultiSelectionDeleteButton).setDesc(i.enableMultiSelectionDeleteButtonDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableMultiSelectionDeleteButton).onChange(async (value) => {
      this.plugin.settings.enableMultiSelectionDeleteButton = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.multiLineSelectionLongPressMs).setDesc(i.multiLineSelectionLongPressMsDesc).addText((text) => {
      const commit = async () => {
        const normalized = normalizeMultiLineSelectionLongPressMs(Number(text.inputEl.value));
        const normalizedValue = String(normalized);
        if (text.inputEl.value !== normalizedValue) {
          text.setValue(normalizedValue);
        }
        if (this.plugin.settings.multiLineSelectionLongPressMs === normalized) {
          return;
        }
        this.plugin.settings.multiLineSelectionLongPressMs = normalized;
        await this.plugin.saveSettings();
      };
      text.inputEl.type = "number";
      text.inputEl.inputMode = "numeric";
      text.inputEl.min = String(MIN_MULTI_LINE_SELECTION_LONG_PRESS_MS);
      text.inputEl.max = String(MAX_MULTI_LINE_SELECTION_LONG_PRESS_MS);
      text.inputEl.step = "1";
      text.setPlaceholder(`${MIN_MULTI_LINE_SELECTION_LONG_PRESS_MS}-${MAX_MULTI_LINE_SELECTION_LONG_PRESS_MS}`);
      text.setValue(String(this.plugin.settings.multiLineSelectionLongPressMs));
      text.inputEl.addEventListener("blur", () => {
        void commit();
      });
      text.inputEl.addEventListener("keydown", (event) => {
        if (event.key !== "Enter")
          return;
        event.preventDefault();
        text.inputEl.blur();
      });
    });
    new import_obsidian2.Setting(containerEl).setName(i.mobileTextLongPressDrag).setDesc(i.mobileTextLongPressDragDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableMobileTextLongPressDrag).onChange(async (value) => {
      this.plugin.settings.enableMobileTextLongPressDrag = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.enableCrossFileDrag).setDesc(i.enableCrossFileDragDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableCrossFileDrag).onChange(async (value) => {
      this.plugin.settings.enableCrossFileDrag = value;
      await this.plugin.saveSettings();
    }));
  }
};

// src/platform/obsidian/editor-document-key.ts
function resolveEditorDocumentKey(app, editorView) {
  var _a;
  const markdownView = resolveMarkdownViewForEditor(app, editorView);
  const path = (_a = markdownView == null ? void 0 : markdownView.file) == null ? void 0 : _a.path;
  if (typeof path === "string" && path.length > 0)
    return path;
  return null;
}

// src/features/mutation/block-fold-state.ts
function createBlockFoldStateManager(params) {
  const { app, parseLineWithQuote: parseLineWithQuote3 } = params;
  return {
    capture(view, sourceBlock) {
      var _a, _b, _c;
      if (!isBlockFoldStateSupported(sourceBlock))
        return null;
      if (((_c = (_b = (_a = sourceBlock.compositeSelection) == null ? void 0 : _a.ranges) == null ? void 0 : _b.length) != null ? _c : 0) > 1)
        return null;
      const startLineNumber = sourceBlock.startLine + 1;
      const endLineNumber = sourceBlock.endLine + 1;
      const collapsedRelativeLineOffsets = [];
      for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
        const lineText = view.state.doc.line(lineNumber).text;
        if (!isFoldableLineWithinBlock(sourceBlock, lineText, parseLineWithQuote3))
          continue;
        if (!isEditorLineCollapsed(view, lineNumber))
          continue;
        collapsedRelativeLineOffsets.push(lineNumber - startLineNumber);
      }
      if (collapsedRelativeLineOffsets.length === 0)
        return null;
      return { collapsedRelativeLineOffsets };
    },
    restore(view, targetStartLineNumber, foldState) {
      var _a;
      const collapsedRelativeLineOffsets = (_a = foldState == null ? void 0 : foldState.collapsedRelativeLineOffsets) != null ? _a : [];
      if (collapsedRelativeLineOffsets.length === 0)
        return;
      toggleLineFolds({
        app,
        view,
        targetLineNumbers: collapsedRelativeLineOffsets.map(
          (relativeOffset) => targetStartLineNumber + relativeOffset
        )
      });
    }
  };
}
function isBlockFoldStateSupported(sourceBlock) {
  return sourceBlock.type === "list-item" /* ListItem */ || sourceBlock.type === "heading" /* Heading */;
}
function isFoldableLineWithinBlock(sourceBlock, lineText, parseLineWithQuote3) {
  if (sourceBlock.type === "list-item" /* ListItem */) {
    return parseLineWithQuote3(lineText).isListItem;
  }
  if (sourceBlock.type === "heading" /* Heading */) {
    return getHeadingLevel(lineText) !== null;
  }
  return false;
}

// src/features/entry/view-dom-sync.ts
function ensureEditorRootClasses(view) {
  view.dom.classList.add(ROOT_EDITOR_CLASS);
  view.contentDOM.classList.add(MAIN_EDITOR_CONTENT_CLASS);
}
function clearEditorRootClasses(view) {
  view.dom.classList.remove(ROOT_EDITOR_CLASS);
  view.contentDOM.classList.remove(MAIN_EDITOR_CONTENT_CLASS);
}
function syncDragSourceStyleAttr(view, style) {
  view.dom.setAttribute(DND_DRAG_SOURCE_STYLE_ATTR, style);
}
function syncDragSourceHighlightAttr(view, enabled) {
  view.dom.setAttribute(DND_DRAG_SOURCE_HIGHLIGHT_ATTR, enabled ? "on" : "off");
}

// src/features/targeting/list-target-calculator.ts
var ListDropTargetCalculator = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
  }
  getListMarkerBounds(lineNumber, options) {
    var _a;
    const doc = this.view.state.doc;
    if (lineNumber < 1 || lineNumber > doc.lines)
      return null;
    const memo = options == null ? void 0 : options.memo;
    if (memo && memo.markerBoundsByLine.has(lineNumber)) {
      return (_a = memo.markerBoundsByLine.get(lineNumber)) != null ? _a : null;
    }
    const parsed = this.getParsedLineAtLineNumber(
      doc,
      lineNumber,
      memo,
      options == null ? void 0 : options.lineMap
    );
    if (!parsed || !parsed.isListItem) {
      if (memo)
        memo.markerBoundsByLine.set(lineNumber, null);
      return null;
    }
    const line = doc.line(lineNumber);
    const markerStartPos = line.from + parsed.quotePrefix.length + parsed.indentRaw.length;
    const contentStartPos = markerStartPos + parsed.marker.length;
    const markerStart = getCoordsAtPos(this.view, markerStartPos);
    const contentStart = getCoordsAtPos(this.view, contentStartPos);
    if (!markerStart || !contentStart) {
      if (memo)
        memo.markerBoundsByLine.set(lineNumber, null);
      return null;
    }
    const bounds = {
      markerStartX: markerStart.left,
      contentStartX: contentStart.left
    };
    if (memo)
      memo.markerBoundsByLine.set(lineNumber, bounds);
    return bounds;
  }
  computeListTarget(params) {
    const {
      targetLineNumber,
      lineNumber,
      forcedLineNumber,
      childIntentOnLine,
      dragSource,
      sourceScope = "same_editor",
      clientX,
      lineMap: providedLineMap
    } = params;
    if (!dragSource || dragSource.type !== "list-item" /* ListItem */)
      return {};
    const finalize = (result) => {
      return result;
    };
    const doc = this.view.state.doc;
    const lineMap = providedLineMap != null ? providedLineMap : getLineMap(this.view.state);
    const memo = {
      parsedLineByLine: /* @__PURE__ */ new Map(),
      markerBoundsByLine: /* @__PURE__ */ new Map(),
      listIndentByLine: /* @__PURE__ */ new Map()
    };
    const indentUnit = this.deps.getIndentUnitWidthForDoc(doc);
    const context = {
      doc,
      lineMap,
      memo,
      indentUnit
    };
    const prevNonEmptyLineNumber = this.deps.getPreviousNonEmptyLineNumber(doc, targetLineNumber - 1);
    let referenceLineNumber = prevNonEmptyLineNumber != null ? prevNonEmptyLineNumber : 0;
    if (!forcedLineNumber && childIntentOnLine) {
      referenceLineNumber = lineNumber;
    }
    if (referenceLineNumber < 1)
      return finalize({});
    const baseLineNumber = this.resolveReferenceListLineNumber(referenceLineNumber, lineMap);
    if (baseLineNumber === null)
      return finalize({});
    const isSelfTarget = sourceScope !== "cross_editor" && !!dragSource && dragSource.type === "list-item" /* ListItem */ && baseLineNumber === dragSource.startLine + 1;
    const allowChild = !isSelfTarget;
    const dropTarget = this.getListDropTarget(baseLineNumber, clientX, allowChild, context);
    if (!dropTarget)
      return finalize({});
    const listContextLineNumber = dropTarget.lineNumber;
    const listIndentDelta = dropTarget.mode === "child" ? 1 : 0;
    let cappedIndentWidth = dropTarget.indentWidth;
    const prevIndent = this.getListIndentWidthAtLine(doc, baseLineNumber, lineMap, memo);
    if (typeof prevIndent === "number") {
      const maxAllowedIndent = prevIndent + indentUnit;
      if (cappedIndentWidth > maxAllowedIndent) {
        cappedIndentWidth = maxAllowedIndent;
      }
    }
    const nextLineNumber = targetLineNumber <= doc.lines ? targetLineNumber : null;
    if (nextLineNumber !== null) {
      const nextIndent = this.getListIndentWidthAtLine(doc, nextLineNumber, lineMap, memo);
      if (typeof nextIndent === "number") {
        const minAllowedIndent = Math.max(0, nextIndent - indentUnit);
        if (cappedIndentWidth < minAllowedIndent) {
          cappedIndentWidth = minAllowedIndent;
        }
      }
    }
    const listTargetIndentWidth = cappedIndentWidth;
    const highlightInfo = this.computeHighlightRectForList({
      targetLineNumber,
      listTargetIndentWidth,
      context
    });
    return finalize({
      listContextLineNumber,
      listIndentDelta,
      listTargetIndentWidth,
      highlightRect: highlightInfo.highlightRect,
      lineRectSourceLineNumber: highlightInfo.lineRectSourceLineNumber
    });
  }
  computeHighlightRectForList(params) {
    var _a, _b, _c;
    const { targetLineNumber, listTargetIndentWidth, context } = params;
    if (listTargetIndentWidth <= 0)
      return {};
    const targetParentIndent = listTargetIndentWidth - context.indentUnit;
    const parentLineNumber = this.findParentLineNumberByIndent(
      context.doc,
      targetLineNumber - 1,
      targetParentIndent,
      context.lineMap,
      context.memo
    );
    if (parentLineNumber === null)
      return {};
    const parentMeta = getLineMetaAt(context.lineMap, parentLineNumber);
    if (!(parentMeta == null ? void 0 : parentMeta.isList))
      return {};
    const lineRectSourceLineNumber = parentLineNumber;
    const blockStartLineNumber = parentLineNumber;
    const mappedSubtreeEnd = context.lineMap.listSubtreeEndLine[parentLineNumber];
    const blockEndLineNumber = Math.max(
      blockStartLineNumber,
      mappedSubtreeEnd >= blockStartLineNumber ? mappedSubtreeEnd : blockStartLineNumber
    );
    const bounds = this.getListMarkerBounds(blockStartLineNumber, {
      memo: context.memo,
      lineMap: context.lineMap
    });
    const startLineObj = context.doc.line(blockStartLineNumber);
    const endLineObj = context.doc.line(blockEndLineNumber);
    const startCoords = getCoordsAtPos(this.view, startLineObj.from);
    const endCoords = getCoordsAtPos(this.view, endLineObj.to);
    if (bounds && startCoords && endCoords) {
      const lineCount = blockEndLineNumber - blockStartLineNumber + 1;
      (_b = (_a = this.deps).incrementPerfCounter) == null ? void 0 : _b.call(_a, "highlight_scan_lines", lineCount);
      const left = bounds.markerStartX;
      let maxRight = left;
      for (let i = blockStartLineNumber; i <= blockEndLineNumber; i++) {
        const lineObj = context.doc.line(i);
        const lineEndCoords = getCoordsAtPos(this.view, lineObj.to);
        if (!lineEndCoords)
          continue;
        const right = (_c = lineEndCoords.right) != null ? _c : lineEndCoords.left;
        if (right > maxRight) {
          maxRight = right;
        }
      }
      const width = Math.max(8, maxRight - left);
      return {
        lineRectSourceLineNumber,
        highlightRect: {
          top: startCoords.top,
          left,
          width,
          height: Math.max(4, endCoords.bottom - startCoords.top)
        }
      };
    }
    return { lineRectSourceLineNumber };
  }
  getListDropTarget(lineNumber, clientX, allowChild, context) {
    const { doc, lineMap, memo, indentUnit } = context;
    if (lineNumber < 1 || lineNumber > doc.lines)
      return null;
    const bounds = this.getListMarkerBounds(lineNumber, { memo, lineMap });
    if (!bounds)
      return null;
    const slots = [];
    const baseIndent = this.getListIndentWidthAtLine(doc, lineNumber, lineMap, memo);
    const maxIndent = typeof baseIndent === "number" ? baseIndent + indentUnit : void 0;
    const columnPixelWidth = this.view.defaultCharacterWidth || 7;
    if (typeof baseIndent === "number") {
      slots.push({ x: bounds.markerStartX, lineNumber, indentWidth: baseIndent, mode: "same" });
    }
    if (allowChild && typeof baseIndent === "number") {
      const childIndent = baseIndent + indentUnit;
      if (maxIndent === void 0 || childIndent <= maxIndent) {
        const indentPixels = indentUnit * columnPixelWidth;
        const childSlotX = bounds.markerStartX + indentPixels;
        slots.push({ x: childSlotX, lineNumber, indentWidth: childIndent, mode: "child" });
      }
    }
    const ancestors = this.getListAncestorLineNumbers(doc, lineNumber, lineMap);
    for (const ancestorLine of ancestors) {
      if (ancestorLine === lineNumber)
        continue;
      const indentWidth = this.getListIndentWidthAtLine(doc, ancestorLine, lineMap, memo);
      if (typeof indentWidth !== "number" || typeof baseIndent !== "number")
        continue;
      const indentDeltaColumns = Math.max(0, baseIndent - indentWidth);
      const projectedX = bounds.markerStartX - indentDeltaColumns * columnPixelWidth;
      slots.push({
        x: projectedX,
        lineNumber: ancestorLine,
        indentWidth,
        mode: "same"
      });
    }
    if (slots.length === 0)
      return null;
    let best = slots[0];
    let bestDist = Math.abs(clientX - best.x);
    for (let i = 1; i < slots.length; i++) {
      const dist = Math.abs(clientX - slots[i].x);
      if (dist < bestDist) {
        best = slots[i];
        bestDist = dist;
      }
    }
    return { lineNumber: best.lineNumber, indentWidth: best.indentWidth, mode: best.mode };
  }
  resolveReferenceListLineNumber(lineNumber, lineMap) {
    const nearestListLine = getNearestListLineAtOrBefore(lineMap, lineNumber);
    if (nearestListLine === null)
      return null;
    let cursor = nearestListLine;
    while (cursor > 0) {
      const subtreeEnd = lineMap.listSubtreeEndLine[cursor];
      if (subtreeEnd >= lineNumber) {
        return cursor;
      }
      cursor = lineMap.listParentLine[cursor];
    }
    return null;
  }
  getParsedLineAtLineNumber(doc, lineNumber, memo, lineMap) {
    var _a;
    if (lineNumber < 1 || lineNumber > doc.lines)
      return null;
    if (memo == null ? void 0 : memo.parsedLineByLine.has(lineNumber)) {
      return (_a = memo.parsedLineByLine.get(lineNumber)) != null ? _a : null;
    }
    const lineMeta = lineMap ? getLineMetaAt(lineMap, lineNumber) : null;
    if (lineMeta && !lineMeta.isList) {
      return null;
    }
    const parsed = this.deps.parseLineWithQuote(doc.line(lineNumber).text);
    if (memo)
      memo.parsedLineByLine.set(lineNumber, parsed);
    return parsed;
  }
  getListIndentWidthAtLine(doc, lineNumber, lineMap, memo) {
    if (lineNumber < 1 || lineNumber > doc.lines)
      return void 0;
    if (memo == null ? void 0 : memo.listIndentByLine.has(lineNumber)) {
      return memo.listIndentByLine.get(lineNumber);
    }
    let indent;
    const lineMeta = lineMap ? getLineMetaAt(lineMap, lineNumber) : null;
    if (lineMeta) {
      indent = lineMeta.isList ? lineMeta.indentWidth : void 0;
    } else {
      const parsed = this.deps.parseLineWithQuote(doc.line(lineNumber).text);
      indent = parsed.isListItem ? parsed.indentWidth : void 0;
    }
    if (memo)
      memo.listIndentByLine.set(lineNumber, indent);
    return indent;
  }
  getListAncestorLineNumbers(doc, lineNumber, lineMap) {
    var _a, _b;
    const result = [];
    if (lineMap) {
      let steps = 0;
      let cursor = this.resolveReferenceListLineNumber(
        Math.max(1, Math.min(lineNumber, doc.lines)),
        lineMap
      );
      while (cursor !== null && cursor > 0) {
        result.push(cursor);
        steps += 1;
        const parent = lineMap.listParentLine[cursor];
        cursor = parent > 0 ? parent : null;
      }
      if (steps > 0) {
        (_b = (_a = this.deps).incrementPerfCounter) == null ? void 0 : _b.call(_a, "list_ancestor_scan_steps", steps);
      }
      return result;
    }
    let currentIndent = null;
    for (let i = lineNumber; i >= 1; i--) {
      const text = doc.line(i).text;
      if (text.trim().length === 0)
        continue;
      const parsed = this.deps.parseLineWithQuote(text);
      if (!parsed.isListItem) {
        if (currentIndent !== null)
          break;
        continue;
      }
      if (currentIndent === null) {
        currentIndent = parsed.indentWidth;
        result.push(i);
        continue;
      }
      if (parsed.indentWidth < currentIndent) {
        currentIndent = parsed.indentWidth;
        result.push(i);
      }
    }
    return result;
  }
  findParentLineNumberByIndent(doc, startLineNumber, targetIndent, lineMap, memo) {
    var _a, _b, _c, _d;
    if (lineMap) {
      let steps = 0;
      let cursor = this.resolveReferenceListLineNumber(
        Math.max(1, Math.min(startLineNumber, doc.lines)),
        lineMap
      );
      while (cursor !== null && cursor > 0) {
        steps += 1;
        const indent = this.getListIndentWidthAtLine(doc, cursor, lineMap, memo);
        if (typeof indent === "number" && indent === targetIndent) {
          (_b = (_a = this.deps).incrementPerfCounter) == null ? void 0 : _b.call(_a, "list_parent_scan_steps", steps);
          return cursor;
        }
        if (typeof indent === "number" && indent < targetIndent) {
          break;
        }
        const parent = lineMap.listParentLine[cursor];
        cursor = parent > 0 ? parent : null;
      }
      if (steps > 0) {
        (_d = (_c = this.deps).incrementPerfCounter) == null ? void 0 : _d.call(_c, "list_parent_scan_steps", steps);
      }
      return null;
    }
    for (let i = startLineNumber; i >= 1; i--) {
      const text = doc.line(i).text;
      if (text.trim().length === 0)
        continue;
      const parsed = this.deps.parseLineWithQuote(text);
      if (!parsed.isListItem)
        continue;
      if (parsed.indentWidth === targetIndent)
        return i;
    }
    return null;
  }
};

// src/features/entry/view-runtime.ts
function createDropTargetCalculatorDeps(params) {
  const sharedDeps = params.services.createDropTargetCalculatorDeps({
    recordPerfDuration: (key, durationMs) => {
      params.dragPerfManager.recordDuration(key, durationMs);
    },
    incrementPerfCounter: (key, delta = 1) => {
      params.dragPerfManager.incrementCounter(key, delta);
    },
    onDragTargetEvaluated: params.onDragTargetEvaluated
  });
  return {
    ...sharedDeps,
    listDropTargetCalculator: new ListDropTargetCalculator(params.view, {
      parseLineWithQuote: sharedDeps.parseLineWithQuote,
      getPreviousNonEmptyLineNumber,
      getIndentUnitWidthForDoc: sharedDeps.getIndentUnitWidthForDoc,
      getBlockRect: sharedDeps.getBlockRect,
      incrementPerfCounter: sharedDeps.incrementPerfCounter
    })
  };
}

// src/features/entry/view-update.ts
function applyViewUpdate(update, deps) {
  if (update.viewportChanged) {
    deps.refreshDecorationsAndEmbeds();
    deps.dragEventHandler.refreshSelectionVisual();
    deps.handleVisibility.refreshGrabVisualState();
    const activeHandle2 = deps.handleVisibility.getActiveHandle();
    if (activeHandle2 && !activeHandle2.isConnected) {
      deps.handleVisibility.setActiveVisibleHandle(null);
      deps.reResolveActiveHandle();
    }
    return;
  }
  if (update.docChanged) {
    deps.semanticRefreshScheduler.markSemanticRefreshPending();
  } else if (update.geometryChanged) {
    deps.refreshDecorationsAndEmbeds();
  }
  if (update.docChanged || update.geometryChanged) {
    deps.dragEventHandler.refreshSelectionVisual();
    deps.handleVisibility.refreshGrabVisualState();
  }
  const activeHandle = deps.handleVisibility.getActiveHandle();
  if (activeHandle && !activeHandle.isConnected) {
    deps.handleVisibility.setActiveVisibleHandle(null);
    deps.reResolveActiveHandle();
  }
}

// src/features/entry/global-pointermove-router.ts
var clients = /* @__PURE__ */ new Set();
var clientsByRoot = /* @__PURE__ */ new Map();
var activeClient = null;
var isListening = false;
function containsPoint(view, clientX, clientY) {
  const rect = view.dom.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}
function resolveClientFromTarget(target) {
  if (!(target instanceof Node))
    return null;
  let current = target;
  while (current) {
    if (current instanceof HTMLElement) {
      const client = clientsByRoot.get(current);
      if (client)
        return client;
    }
    current = current.parentNode;
  }
  return null;
}
function resolveClientFromPoint(clientX, clientY) {
  for (const client of clients) {
    if (containsPoint(client.view, clientX, clientY)) {
      return client;
    }
  }
  return null;
}
function resolveClient(event) {
  var _a;
  return (_a = resolveClientFromTarget(event.target)) != null ? _a : resolveClientFromPoint(event.clientX, event.clientY);
}
function handleDocumentPointerMove(event) {
  const nextClient = resolveClient(event);
  if (activeClient && activeClient !== nextClient) {
    activeClient.clearPointerHover();
  }
  if (!nextClient) {
    activeClient = null;
    return;
  }
  activeClient = nextClient;
  nextClient.onPointerMove(event);
}
function ensureListening() {
  if (isListening)
    return;
  document.addEventListener("pointermove", handleDocumentPointerMove, { passive: true });
  isListening = true;
}
function stopListeningIfIdle() {
  if (!isListening || clients.size > 0)
    return;
  document.removeEventListener("pointermove", handleDocumentPointerMove);
  isListening = false;
}
function registerGlobalPointerMoveClient(client) {
  const root = client.view.dom;
  clients.add(client);
  clientsByRoot.set(root, client);
  ensureListening();
}
function unregisterGlobalPointerMoveClient(client) {
  clients.delete(client);
  clientsByRoot.delete(client.view.dom);
  if (activeClient === client) {
    client.clearPointerHover();
    activeClient = null;
  }
  stopListeningIfIdle();
}

// src/features/entry/view-lifecycle.ts
function startViewLifecycle(deps) {
  deps.lineHandleManager.start();
  deps.dragEventHandler.attach();
  registerGlobalPointerMoveClient(deps.pointerMoveClient);
  window.addEventListener("dnd:settings-updated", deps.onSettingsUpdated);
  scheduleFenceScanWarmup(deps.view);
}
function destroyViewLifecycle(deps) {
  deps.semanticRefreshScheduler.destroy();
  unregisterGlobalPointerMoveClient(deps.pointerMoveClient);
  window.removeEventListener("dnd:settings-updated", deps.onSettingsUpdated);
  deps.dragEventHandler.destroy();
  deps.lineHandleManager.destroy();
}
function scheduleFenceScanWarmup(view) {
  const warmupFenceScan = () => prewarmFenceScan(view.state.doc);
  const requestIdle = window.requestIdleCallback;
  if (typeof requestIdle === "function") {
    requestIdle(warmupFenceScan, { timeout: 1e3 });
  } else {
    window.setTimeout(warmupFenceScan, 100);
  }
}

// src/features/entry/handle-gutter-extension.ts
var import_state4 = require("@codemirror/state");
var import_view = require("@codemirror/view");
var handleGutterCompartment = new import_state4.Compartment();
var HandleGutterLineMarker = class extends import_view.GutterMarker {
  constructor(lineNumber) {
    super();
    this.lineNumber = lineNumber;
    this.elementClass = HANDLE_GUTTER_MARKER_CLASS;
  }
  eq(other) {
    return other instanceof HandleGutterLineMarker && other.lineNumber === this.lineNumber;
  }
  toDOM(_view) {
    const probe = document.createElement("span");
    probe.className = HANDLE_GUTTER_PROBE_CLASS;
    probe.setAttribute("data-line-number", String(this.lineNumber));
    return probe;
  }
};
function resolveLineNumber(view, line) {
  return view.state.doc.lineAt(line.from).number;
}
function createHandleGutterExtension(position = "left") {
  return (0, import_view.gutter)({
    class: HANDLE_GUTTER_CLASS,
    side: position === "right" ? "after" : "before",
    renderEmptyElements: true,
    lineMarker: (view, line) => new HandleGutterLineMarker(resolveLineNumber(view, line)),
    lineMarkerChange: (update) => update.docChanged || update.viewportChanged || update.geometryChanged
  });
}
function resolveHandleGutterPosition(plugin) {
  return plugin.settings.handleGutterPosition === "right" ? "right" : "left";
}
function createConfiguredHandleGutterExtension(plugin) {
  return handleGutterCompartment.of(createHandleGutterExtension(resolveHandleGutterPosition(plugin)));
}
function reconfigureHandleGutterExtension(view, plugin) {
  view.dispatch({
    effects: handleGutterCompartment.reconfigure(
      createHandleGutterExtension(resolveHandleGutterPosition(plugin))
    )
  });
}
function placeHandleGutterHost(view) {
  const afterGutters = view.dom.querySelector(CODEMIRROR_AFTER_GUTTERS_SELECTOR);
  if (!afterGutters)
    return;
  const contentContainer = view.contentDOM.parentElement;
  if (afterGutters.querySelector(`.${HANDLE_GUTTER_CLASS}`) && contentContainer instanceof HTMLElement && contentContainer !== view.scrollDOM && contentContainer.contains(view.contentDOM)) {
    if (afterGutters.parentElement !== contentContainer) {
      contentContainer.appendChild(afterGutters);
    }
    return;
  }
  if (afterGutters.parentElement !== view.scrollDOM) {
    view.scrollDOM.appendChild(afterGutters);
  }
}

// src/features/entry/hover-pointer-snapshot.ts
function createHoverPointerSnapshot(view, clientX, clientY, gutterSide) {
  const contentRect = view.contentDOM.getBoundingClientRect();
  const withinVerticalBounds = clientY >= contentRect.top && clientY <= contentRect.bottom;
  const withinContent = withinVerticalBounds && clientX >= contentRect.left && clientX <= contentRect.right;
  const anchorX = gutterSide === "right" ? contentRect.right : contentRect.left;
  const withinHandleInteractionZone = withinVerticalBounds && clientX >= anchorX - HANDLE_INTERACTION_ZONE_PX && clientX <= anchorX + HANDLE_INTERACTION_ZONE_PX;
  return {
    clientX,
    clientY,
    contentRect,
    gutterSide,
    withinContent,
    withinHandleInteractionZone,
    withinHoverActivationZone: withinContent || withinHandleInteractionZone
  };
}

// src/features/entry/view-plugin.ts
function createDragHandleViewPluginClass(plugin) {
  return class {
    constructor(view) {
      this.lifecycleEmitter = new DragLifecycleEmitter(
        (event) => plugin.emitDragLifecycleEvent(event)
      );
      this.onDocumentPointerMove = (e) => this.handleDocumentPointerMove(e);
      this.onSettingsUpdated = () => this.handleSettingsUpdated();
      this.handleGutterReconfigureRafId = null;
      this.destroyed = false;
      this.view = view;
      this.cachedHandleGutterSide = this.resolveConfiguredHandleGutterSide();
      this.syncViewDomState();
      this.services = new DragDropServiceContainer(this.view);
      this.handleVisibility = new HandleVisibilityController(this.view, {
        getBlockInfoForHandle: (handle) => this.services.dragSource.getBlockInfoForHandle(handle),
        getLineNumberAtVerticalPosition: (clientY, contentRect) => this.services.dragSource.getLineNumberAtVerticalPosition(clientY, contentRect),
        getDraggableBlockAtVerticalPosition: (clientY, contentRect) => this.services.dragSource.getDraggableBlockAtVerticalPosition(clientY, contentRect),
        getVisibleHandleForBlockStart: (blockStart) => this.lineHandleManager.getVisibleHandleForBlockStart(blockStart)
      });
      this.dragPerfManager = new DragPerfSessionManager(this.view);
      this.dropTargetCalculator = new DropTargetCalculator(this.view, createDropTargetCalculatorDeps({
        view: this.view,
        services: this.services,
        dragPerfManager: this.dragPerfManager,
        onDragTargetEvaluated: ({ sourceBlock, pointerType, validation }) => {
          var _a, _b;
          if (!sourceBlock)
            return;
          this.orchestrator.emitDragLifecycle({
            state: "drag_active",
            sourceBlock,
            targetLine: (_a = validation.targetLineNumber) != null ? _a : null,
            listIntent: this.orchestrator.buildListIntentFromValidation(validation),
            rejectReason: validation.allowed ? null : (_b = validation.reason) != null ? _b : null,
            pointerType: pointerType != null ? pointerType : null
          });
        }
      }));
      this.dropIndicator = new DropIndicatorManager(
        view,
        (info) => {
          var _a, _b, _c;
          return this.dropTargetCalculator.getDropTargetInfo({
            clientX: info.clientX,
            clientY: info.clientY,
            dragSource: (_b = (_a = info.dragSource) != null ? _a : getActiveDragSourceBlock(this.view)) != null ? _b : null,
            pointerType: (_c = info.pointerType) != null ? _c : null,
            sourceScope: this.resolveDragSourceScope()
          });
        },
        {
          isDropHighlightEnabled: () => plugin.settings.enableListDropHighlight !== false,
          recordPerfDuration: (key, durationMs) => {
            this.dragPerfManager.recordDuration(key, durationMs);
          },
          onFrameMetrics: (metrics) => {
            this.dragPerfManager.incrementCounter("drop_indicator_frames");
            if (metrics.skipped) {
              this.dragPerfManager.incrementCounter("drop_indicator_skipped_frames");
            }
            if (metrics.reused) {
              this.dragPerfManager.incrementCounter("drop_indicator_reused_frames");
            }
          }
        }
      );
      this.blockMover = new BlockMover({
        view: this.view,
        ...this.services.createBlockMoverDeps(),
        blockFoldState: createBlockFoldStateManager({
          app: plugin.app,
          parseLineWithQuote: (line) => this.services.textMutation.parseLineWithQuote(line)
        })
      });
      this.orchestrator = new DragInteractionOrchestrator({
        view: this.view,
        services: this.services,
        blockMover: this.blockMover,
        dropTargetCalculator: this.dropTargetCalculator,
        handleVisibility: this.handleVisibility,
        dragPerfManager: this.dragPerfManager,
        lifecycleEmitter: this.lifecycleEmitter,
        getSemanticRefreshScheduler: () => this.semanticRefreshScheduler,
        refreshDecorationsAndEmbeds: () => this.refreshDecorationsAndEmbeds(),
        getDragEventHandler: () => this.dragEventHandler,
        resolveEditorDocumentKey: (editorView) => resolveEditorDocumentKey(plugin.app, editorView)
      });
      this.lineHandleManager = new LineHandleManager(this.view, {
        createHandleElement: (getBlockInfo) => this.orchestrator.createHandleElement(getBlockInfo),
        getDraggableBlockAtLine: (lineNumber) => this.services.dragSource.getDraggableBlockAtLine(lineNumber),
        shouldRenderLineHandles: () => true
      });
      this.dragEventHandler = new DragEventHandler(this.view, {
        getDragSourceBlock: (e) => getDragSourceBlockFromEvent(e, this.view),
        getBlockInfoForHandle: (handle) => this.orchestrator.resolveInteractionBlockInfo({
          handle,
          clientX: Number.NaN,
          clientY: Number.NaN
        }),
        getBlockInfoAtPoint: (clientX, clientY) => this.orchestrator.resolveInteractionBlockInfo({
          clientX,
          clientY
        }),
        getVisibleHandleForBlockStart: (blockStart) => this.lineHandleManager.getVisibleHandleForBlockStart(blockStart),
        isBlockInsideRenderedTableCell: (blockInfo) => isPosInsideRenderedTableCell(this.view, blockInfo.from, { skipLayoutRead: true }),
        isMultiLineSelectionEnabled: () => plugin.settings.enableMultiLineSelection,
        isRangeSelectionDeleteEnabled: () => plugin.settings.enableMultiSelectionDeleteButton === true,
        getMultiLineSelectionLongPressMs: () => plugin.settings.multiLineSelectionLongPressMs,
        isMobileTextLongPressDragEnabled: () => plugin.settings.enableMobileTextLongPressDrag,
        isCrossEditorDragActive: () => this.resolveDragSourceScope() === "cross_editor",
        isCrossFileDragEnabled: () => plugin.settings.enableCrossFileDrag === true,
        beginPointerDragSession: (blockInfo) => {
          this.orchestrator.ensureDragPerfSession();
          if (this.isDragSourceHighlightEnabled()) {
            this.handleVisibility.enterGrabVisualStateForBlock(blockInfo, null);
          }
          beginDragSession(blockInfo, this.view);
        },
        finishDragSession: () => {
          this.handleVisibility.clearGrabbedLineNumbers();
          this.handleVisibility.setActiveVisibleHandle(null);
          finishDragSession(this.view);
          this.orchestrator.flushDragPerfSession("finish_drag_session");
          this.refreshDecorationsAndEmbeds();
        },
        scheduleDropIndicatorUpdate: (clientX, clientY, dragSource, pointerType) => this.dropIndicator.scheduleFromPoint(clientX, clientY, dragSource, pointerType != null ? pointerType : null),
        hideDropIndicator: () => this.dropIndicator.hide(),
        performDropAtPoint: (sourceBlock, clientX, clientY, pointerType) => this.orchestrator.performDropAtPoint(sourceBlock, clientX, clientY, pointerType != null ? pointerType : null),
        onDragLifecycleEvent: (event) => {
          this.handleSourceVisualByLifecycle(event);
          this.orchestrator.emitDragLifecycle(event);
        }
      });
      this.semanticRefreshScheduler = new SemanticRefreshScheduler(this.view, {
        performRefresh: () => this.refreshDecorationsAndEmbeds()
      });
      this.pointerMoveClient = {
        view: this.view,
        onPointerMove: this.onDocumentPointerMove,
        clearPointerHover: () => this.handleVisibility.setActiveVisibleHandle(null)
      };
      startViewLifecycle({
        view: this.view,
        lineHandleManager: this.lineHandleManager,
        dragEventHandler: this.dragEventHandler,
        pointerMoveClient: this.pointerMoveClient,
        onSettingsUpdated: this.onSettingsUpdated
      });
      this.scheduleHandleGutterReconfigureIfNeeded();
    }
    update(update) {
      this.syncViewDomState();
      applyViewUpdate(update, {
        refreshDecorationsAndEmbeds: () => this.refreshDecorationsAndEmbeds(),
        dragEventHandler: this.dragEventHandler,
        handleVisibility: this.handleVisibility,
        semanticRefreshScheduler: this.semanticRefreshScheduler,
        reResolveActiveHandle: () => {
          const h = this.handleVisibility.getActiveHandle();
          if (h) {
            const rect = h.getBoundingClientRect();
            this.reResolveActiveHandle(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }
        }
      });
    }
    destroy() {
      this.destroyed = true;
      if (this.handleGutterReconfigureRafId !== null) {
        cancelAnimationFrame(this.handleGutterReconfigureRafId);
        this.handleGutterReconfigureRafId = null;
      }
      destroyViewLifecycle({
        semanticRefreshScheduler: this.semanticRefreshScheduler,
        pointerMoveClient: this.pointerMoveClient,
        onSettingsUpdated: this.onSettingsUpdated,
        dragEventHandler: this.dragEventHandler,
        lineHandleManager: this.lineHandleManager
      });
      this.handleVisibility.clearGrabbedLineNumbers();
      this.handleVisibility.setActiveVisibleHandle(null);
      finishDragSession(this.view);
      this.orchestrator.flushDragPerfSession("destroy");
      clearEditorRootClasses(this.view);
      this.view.dom.removeAttribute(DND_DRAG_SOURCE_STYLE_ATTR);
      this.view.dom.removeAttribute(DND_DRAG_SOURCE_HIGHLIGHT_ATTR);
      this.dropIndicator.destroy();
      this.orchestrator.emitDragLifecycle({
        state: "idle",
        sourceBlock: null,
        targetLine: null,
        listIntent: null,
        rejectReason: null,
        pointerType: null
      });
    }
    handleDocumentPointerMove(e) {
      if (document.body.classList.contains(MOBILE_GESTURE_LOCK_CLASS)) {
        return;
      }
      if (document.body.classList.contains(DRAGGING_BODY_CLASS)) {
        this.handleVisibility.setActiveVisibleHandle(null);
        return;
      }
      if (this.dragEventHandler.isGestureActive()) {
        this.handleVisibility.setActiveVisibleHandle(this.handleVisibility.getActiveHandle());
        return;
      }
      const hoverSnapshot = this.createHoverPointerSnapshot(e.clientX, e.clientY);
      if (this.semanticRefreshScheduler.isPending && hoverSnapshot.withinHoverActivationZone) {
        this.semanticRefreshScheduler.ensureSemanticReadyForInteraction();
      }
      const directHandle = this.handleVisibility.resolveVisibleHandleFromTarget(e.target);
      if (directHandle) {
        this.handleVisibility.setActiveVisibleHandle(directHandle);
        return;
      }
      const handle = this.handleVisibility.resolveVisibleHandleFromPointer(hoverSnapshot);
      this.handleVisibility.setActiveVisibleHandle(handle);
    }
    reResolveActiveHandle(lastX, lastY) {
      if (lastX === void 0 || lastY === void 0)
        return;
      const handle = this.handleVisibility.resolveVisibleHandleFromPointer(
        this.createHoverPointerSnapshot(lastX, lastY)
      );
      this.handleVisibility.setActiveVisibleHandle(handle);
    }
    syncViewDomState() {
      ensureEditorRootClasses(this.view);
      placeHandleGutterHost(this.view);
      syncDragSourceStyleAttr(this.view, normalizeDragSourceVisualStyle(plugin.settings.dragSourceVisualStyle));
      syncDragSourceHighlightAttr(this.view, this.isDragSourceHighlightEnabled());
    }
    isDragSourceHighlightEnabled() {
      return plugin.settings.enableDragSourceHighlight !== false;
    }
    refreshDecorationsAndEmbeds() {
      this.syncViewDomState();
      this.semanticRefreshScheduler.clearPendingSemanticRefresh();
      this.lineHandleManager.scheduleScan();
    }
    handleSettingsUpdated() {
      this.cachedHandleGutterSide = this.resolveConfiguredHandleGutterSide();
      if (this.scheduleHandleGutterReconfigureIfNeeded()) {
        return;
      }
      this.syncViewDomState();
      this.refreshDecorationsAndEmbeds();
      this.dragEventHandler.refreshSelectionVisual();
      this.handleVisibility.refreshGrabVisualState();
    }
    scheduleHandleGutterReconfigureIfNeeded() {
      const desiredSide = plugin.settings.handleGutterPosition === "right" ? "right" : "left";
      if (getHandleGutterSide(this.view) === desiredSide) {
        return false;
      }
      if (this.handleGutterReconfigureRafId !== null) {
        return true;
      }
      this.handleGutterReconfigureRafId = requestAnimationFrame(() => {
        this.handleGutterReconfigureRafId = null;
        if (this.destroyed)
          return;
        reconfigureHandleGutterExtension(this.view, plugin);
        this.syncViewDomState();
        this.refreshDecorationsAndEmbeds();
        this.dragEventHandler.refreshSelectionVisual();
        this.handleVisibility.refreshGrabVisualState();
      });
      return true;
    }
    createHoverPointerSnapshot(clientX, clientY) {
      return createHoverPointerSnapshot(this.view, clientX, clientY, this.cachedHandleGutterSide);
    }
    resolveConfiguredHandleGutterSide() {
      return plugin.settings.handleGutterPosition === "right" ? "right" : "left";
    }
    handleSourceVisualByLifecycle(event) {
      if (event.state === "press_pending") {
        if (event.pressReady && event.sourceBlock && this.isDragSourceHighlightEnabled()) {
          this.handleVisibility.enterGrabVisualStateForBlock(event.sourceBlock, null);
        } else {
          this.handleVisibility.clearGrabbedLineNumbers();
        }
        return;
      }
      if (event.state === "drag_active") {
        if (event.sourceBlock && this.isDragSourceHighlightEnabled()) {
          this.handleVisibility.enterGrabVisualStateForBlock(event.sourceBlock, null);
        } else if (!this.isDragSourceHighlightEnabled()) {
          this.handleVisibility.clearGrabbedLineNumbers();
        }
        return;
      }
      if (event.state === "cancelled" || event.state === "idle") {
        const hasActiveNativeDrag = document.body.classList.contains(DRAGGING_BODY_CLASS) || !!getActiveDragSourceBlock(this.view);
        if (hasActiveNativeDrag)
          return;
        this.handleVisibility.clearGrabbedLineNumbers();
        return;
      }
      if (event.state === "drop_commit") {
        this.handleVisibility.clearGrabbedLineNumbers();
      }
    }
    resolveDragSourceScope() {
      const sourceView = getActiveDragSourceView();
      if (!sourceView || sourceView === this.view) {
        return "same_editor";
      }
      return "cross_editor";
    }
  };
}

// src/features/entry/extension-factory.ts
function createDragHandleViewPlugin(plugin) {
  return import_view2.ViewPlugin.fromClass(
    createDragHandleViewPluginClass(plugin)
    // No decorations config - LineHandleManager uses independent DOM elements
  );
}
function dragHandleExtension(plugin) {
  return [
    createConfiguredHandleGutterExtension(plugin),
    createDragHandleViewPlugin(plugin)
  ];
}

// src/plugin/main.ts
var DragNDropPlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    this.dragLifecycleListeners = /* @__PURE__ */ new Set();
  }
  async onload() {
    await this.loadSettings();
    this.registerEditorExtension(dragHandleExtension(this));
    this.addSettingTab(new DragNDropSettingTab(this.app, this));
  }
  onunload() {
    this.dragLifecycleListeners.clear();
  }
  async loadSettings() {
    var _a;
    const saved = (_a = await this.loadData()) != null ? _a : {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
    const savedRecord = saved;
    if ("alwaysShowHandles" in saved && !("handleVisibility" in saved)) {
      this.settings.handleVisibility = saved.alwaysShowHandles ? "always" : "hover";
    }
    if (savedRecord.dragSourceVisualStyle === "none") {
      if (!("enableDragSourceHighlight" in savedRecord)) {
        this.settings.enableDragSourceHighlight = false;
      }
      if (!("enableListDropHighlight" in savedRecord)) {
        this.settings.enableListDropHighlight = false;
      }
    }
    this.settings.enableDragSourceHighlight = this.settings.enableDragSourceHighlight !== false;
    this.settings.enableListDropHighlight = this.settings.enableListDropHighlight !== false;
    this.settings.enableCrossFileDrag = this.settings.enableCrossFileDrag === true;
    this.settings.enableMultiSelectionDeleteButton = this.settings.enableMultiSelectionDeleteButton === true;
    this.settings.multiLineSelectionLongPressMs = normalizeMultiLineSelectionLongPressMs(
      this.settings.multiLineSelectionLongPressMs
    );
    this.settings.handleGutterPosition = normalizeHandleGutterPosition(this.settings.handleGutterPosition);
    await this.saveData(this.settings);
    this.applySettings();
  }
  async saveSettings() {
    this.applySettings();
    await this.saveData(this.settings);
  }
  applySettings() {
    var _a, _b, _c;
    const body = document.body;
    const visibility = (_a = this.settings.handleVisibility) != null ? _a : "hover";
    body.classList.toggle("dnd-handles-always", visibility === "always");
    body.classList.toggle("dnd-handles-hidden", visibility === "hidden");
    this.settings.multiLineSelectionLongPressMs = normalizeMultiLineSelectionLongPressMs(
      this.settings.multiLineSelectionLongPressMs
    );
    const dragSourceVisualStyle = normalizeDragSourceVisualStyle(this.settings.dragSourceVisualStyle);
    this.settings.dragSourceVisualStyle = dragSourceVisualStyle;
    body.setAttribute(DND_DRAG_SOURCE_STYLE_ATTR, dragSourceVisualStyle);
    body.setAttribute(DND_DRAG_SOURCE_HIGHLIGHT_ATTR, this.settings.enableDragSourceHighlight ? "on" : "off");
    body.setAttribute(DND_LIST_DROP_HIGHLIGHT_ATTR, this.settings.enableListDropHighlight ? "on" : "off");
    const rawHandleOffset = Number(this.settings.handleHorizontalOffsetPx);
    const handleOffset = Number.isFinite(rawHandleOffset) ? Math.max(-80, Math.min(80, Math.round(rawHandleOffset))) : DEFAULT_SETTINGS.handleHorizontalOffsetPx;
    this.settings.handleHorizontalOffsetPx = handleOffset;
    this.settings.handleGutterPosition = normalizeHandleGutterPosition(this.settings.handleGutterPosition);
    setHandleHorizontalOffsetPx(handleOffset);
    body.setCssProps({
      "--dnd-handle-horizontal-offset-px": `${handleOffset}px`
    });
    let colorValue = "";
    if (this.settings.handleColorMode === "theme") {
      colorValue = "var(--interactive-accent)";
    } else if (this.settings.handleColor) {
      colorValue = this.settings.handleColor;
    }
    if (colorValue) {
      body.setCssProps({
        "--dnd-handle-color": colorValue,
        "--dnd-handle-color-hover": colorValue
      });
    } else {
      body.setCssProps({
        "--dnd-handle-color": "",
        "--dnd-handle-color-hover": ""
      });
    }
    let indicatorColorValue = "";
    if (this.settings.indicatorColorMode === "theme") {
      indicatorColorValue = "var(--interactive-accent)";
    } else if (this.settings.indicatorColor) {
      indicatorColorValue = this.settings.indicatorColor;
    }
    if (indicatorColorValue) {
      body.setCssProps({
        "--dnd-drop-indicator-color": indicatorColorValue
      });
    } else {
      body.setCssProps({
        "--dnd-drop-indicator-color": ""
      });
    }
    const handleSize = Math.max(12, Math.min(28, (_b = this.settings.handleSize) != null ? _b : 16));
    setHandleSizePx(handleSize);
    body.setCssProps({
      "--dnd-handle-size": `${handleSize}px`,
      "--dnd-handle-core-size": `${Math.round(handleSize * 0.5)}px`
    });
    body.setAttribute(DND_HANDLE_ICON_ATTR, (_c = this.settings.handleIcon) != null ? _c : "dot");
    window.dispatchEvent(new Event("dnd:settings-updated"));
  }
  onDragLifecycleEvent(listener) {
    this.dragLifecycleListeners.add(listener);
    return () => {
      this.dragLifecycleListeners.delete(listener);
    };
  }
  emitDragLifecycleEvent(event) {
    for (const listener of Array.from(this.dragLifecycleListeners)) {
      try {
        listener(event);
      } catch (error) {
        console.error("[Dragger] drag lifecycle listener failed:", error);
      }
    }
  }
};

/* nosourcemap */