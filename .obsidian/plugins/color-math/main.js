"use strict";
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

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ColorMathPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/config.ts
var DEFAULT_COLORS = {
  main: "#7aa2f7",
  orange: "#e0af68",
  dot: "white",
  derivative: "#bb9af7",
  chain: "#9ece6a",
  upper: "#bb9af7",
  relation: "white",
  arrow: "#f7768e",
  set: "#bb9af7",
  spacing: "white",
  parameter: "#bb9af7",
  unit: "#73daca"
};
var DEFAULT_PALETTE = DEFAULT_COLORS;
var COLORS = { ...DEFAULT_COLORS };
function setPalette(palette) {
  Object.assign(COLORS, palette);
}
var BIG_OPERATORS = /* @__PURE__ */ new Set([
  "\\sum",
  "\\prod",
  "\\coprod",
  "\\bigcup",
  "\\bigcap",
  "\\bigsqcup",
  "\\bigvee",
  "\\bigwedge",
  "\\bigoplus",
  "\\bigotimes"
]);
var INTEGRALS = /* @__PURE__ */ new Set([
  "\\int",
  "\\iint",
  "\\iiint",
  "\\oint"
]);
var LIMIT_OPERATORS = /* @__PURE__ */ new Set([
  "\\lim",
  "\\sup",
  "\\inf",
  "\\max",
  "\\min"
]);
var RELATIONS = /* @__PURE__ */ new Set([
  "\\neq",
  "\\leq",
  "\\geq",
  "\\approx",
  "\\sim",
  "\\equiv",
  "\\propto",
  "=",
  "<",
  ">"
]);
var ARROWS = /* @__PURE__ */ new Set([
  "\\longrightarrow",
  "\\longleftarrow",
  "\\leftrightarrow",
  "\\rightarrow",
  "\\leftarrow",
  "\\Rightarrow",
  "\\Leftarrow",
  "\\Leftrightarrow",
  "\\mapsto",
  "\\to"
]);
var SET_SYMBOLS = /* @__PURE__ */ new Set([
  "\\notin",
  "\\subseteq",
  "\\supseteq",
  "\\subset",
  "\\supset",
  "\\setminus",
  "\\emptyset",
  "\\in",
  "\\cup",
  "\\cap"
]);
var SPACING_COMMANDS = /* @__PURE__ */ new Set([
  "\\,",
  "\\:",
  "\\;",
  "\\quad",
  "\\qquad"
]);
var MULTIPLICATION_SYMBOLS = /* @__PURE__ */ new Set([
  "\\cdot",
  "\\times",
  "\xB7",
  "*"
]);
var COLOR_COMMANDS = /* @__PURE__ */ new Set([
  ...BIG_OPERATORS,
  ...INTEGRALS,
  ...LIMIT_OPERATORS,
  ...RELATIONS,
  ...ARROWS,
  ...SET_SYMBOLS,
  ...SPACING_COMMANDS,
  ...MULTIPLICATION_SYMBOLS
]);
var SORTED_COLOR_COMMANDS = Array.from(COLOR_COMMANDS).sort(
  (a, b) => b.length - a.length
);
var MATH_CONSTANTS = /* @__PURE__ */ new Set([
  "\\pi",
  "\\varpi",
  "\\hbar",
  "\\infty",
  "\\ell",
  "\\aleph",
  "\\Re",
  "\\Im",
  "\\top",
  "\\bot"
]);
var MATH_ACCENTS = /* @__PURE__ */ new Set([
  "\\dot",
  "\\ddot",
  "\\dddot",
  "\\ddddot",
  "\\hat",
  "\\widehat",
  "\\tilde",
  "\\widetilde",
  "\\bar",
  "\\vec",
  "\\check",
  "\\breve",
  "\\acute",
  "\\grave",
  "\\mathring"
]);
var MATH_PARAMETERS = /* @__PURE__ */ new Set([
  "\\alpha",
  "\\beta",
  "\\gamma",
  "\\delta",
  "\\epsilon",
  "\\varepsilon",
  "\\zeta",
  "\\eta",
  "\\theta",
  "\\vartheta",
  "\\iota",
  "\\kappa",
  "\\lambda",
  "\\mu",
  "\\nu",
  "\\xi",
  "\\rho",
  "\\varrho",
  "\\sigma",
  "\\varsigma",
  "\\tau",
  "\\upsilon",
  "\\phi",
  "\\varphi",
  "\\chi",
  "\\psi",
  "\\omega",
  "\\Gamma",
  "\\Delta",
  "\\Theta",
  "\\Lambda",
  "\\Xi",
  "\\Pi",
  "\\Sigma",
  "\\Upsilon",
  "\\Phi",
  "\\Psi",
  "\\Omega"
]);
var MATH_FUNCTIONS = /* @__PURE__ */ new Set([
  "\\sin",
  "\\cos",
  "\\tan",
  "\\csc",
  "\\sec",
  "\\cot",
  "\\arcsin",
  "\\arccos",
  "\\arctan",
  "\\sinh",
  "\\cosh",
  "\\tanh",
  "\\coth",
  "\\ln",
  "\\log",
  "\\exp",
  "\\det",
  "\\gcd",
  "\\max",
  "\\min",
  "\\dim",
  "\\ker",
  "\\hom",
  "\\deg",
  "\\arg",
  "\\Pr",
  "\\sup",
  "\\inf"
]);
var RAINBOW_DELIMITER_COLORS = [
  "#e0af68",
  // Tier 0: Gold
  "#7aa2f7",
  // Tier 1: Cyan / Blue
  "#bb9af7",
  // Tier 2: Purple / Lavender
  "#f7768e"
  // Tier 3: Coral / Pink
];
var VARIABLE_HASH_PALETTE = [
  "#7aa2f7",
  // Tokyo Blue
  "#7dcfff",
  // Tokyo Cyan
  "#bb9af7",
  // Tokyo Purple
  "#f7768e",
  // Tokyo Pink
  "#e0af68",
  // Tokyo Orange/Gold
  "#9ece6a",
  // Tokyo Green
  "#2ac3de",
  // Light Cyan
  "#ff9e64"
  // Peach
];
function hashStringToColor(str, palette = VARIABLE_HASH_PALETTE) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = hash * 31 + str.charCodeAt(i) | 0;
  }
  const index = Math.abs(hash) % palette.length;
  return palette[index];
}

// src/parsers/markdown_scanner.ts
var FENCED_CODE = "fenced_code";
var CODE_SPAN = "code_span";
var MATH_BLOCK = "math_block";
var MATH_INLINE = "math_inline";
function lineRanges(text) {
  const ranges = [];
  let start = 0;
  while (start < text.length) {
    let contentEnd = start;
    while (contentEnd < text.length && text[contentEnd] !== "\r" && text[contentEnd] !== "\n") {
      contentEnd++;
    }
    let lineEnd = contentEnd;
    if (lineEnd < text.length) {
      if (text[lineEnd] === "\r" && lineEnd + 1 < text.length && text[lineEnd + 1] === "\n") {
        lineEnd += 2;
      } else {
        lineEnd += 1;
      }
    }
    ranges.push([start, contentEnd, lineEnd]);
    start = lineEnd;
  }
  return ranges;
}
function openingFence(line) {
  let index = 0;
  while (index < line.length && index < 3 && line[index] === " ") {
    index++;
  }
  if (index >= line.length || line[index] !== "`" && line[index] !== "~") {
    return null;
  }
  const marker = line[index];
  let markerEnd = index;
  while (markerEnd < line.length && line[markerEnd] === marker) {
    markerEnd++;
  }
  const length = markerEnd - index;
  if (length < 3) {
    return null;
  }
  const info = line.slice(markerEnd);
  if (marker === "`" && info.includes("`")) {
    return null;
  }
  return [marker, length];
}
function isClosingFence(line, marker, minimum) {
  let index = 0;
  while (index < line.length && index < 3 && line[index] === " ") {
    index++;
  }
  let markerEnd = index;
  while (markerEnd < line.length && line[markerEnd] === marker) {
    markerEnd++;
  }
  return markerEnd - index >= minimum && line.slice(markerEnd).split("").every((ch) => ch === " " || ch === "	");
}
function stripBlockquotes(line) {
  let depth = 0;
  let index = 0;
  while (true) {
    let marker = index;
    let spaces = 0;
    while (marker < line.length && spaces < 3 && line[marker] === " ") {
      marker++;
      spaces++;
    }
    if (marker >= line.length || line[marker] !== ">") {
      return [depth, index];
    }
    index = marker + 1;
    if (index < line.length && (line[index] === " " || line[index] === "	")) {
      index++;
    }
    depth++;
  }
}
function stripRequiredBlockquotes(line, depth) {
  let index = 0;
  for (let i = 0; i < depth; i++) {
    let marker = index;
    let spaces = 0;
    while (marker < line.length && spaces < 3 && line[marker] === " ") {
      marker++;
      spaces++;
    }
    if (marker >= line.length || line[marker] !== ">") {
      return null;
    }
    index = marker + 1;
    if (index < line.length && (line[index] === " " || line[index] === "	")) {
      index++;
    }
  }
  return index;
}
function readListMarker(line, start) {
  if (start >= line.length) {
    return null;
  }
  let markerEnd = start;
  if ("-+*".includes(line[start])) {
    markerEnd++;
  } else if (/\d/.test(line[start])) {
    while (markerEnd < line.length && /\d/.test(line[markerEnd])) {
      markerEnd++;
    }
    if (markerEnd - start > 9 || markerEnd >= line.length) {
      return null;
    }
    if (line[markerEnd] !== "." && line[markerEnd] !== ")") {
      return null;
    }
    markerEnd++;
  } else {
    return null;
  }
  if (markerEnd === line.length) {
    return markerEnd + 1;
  }
  if (line[markerEnd] !== " ") {
    return null;
  }
  let whitespaceEnd = markerEnd;
  while (whitespaceEnd < line.length && line[whitespaceEnd] === " ") {
    whitespaceEnd++;
  }
  const padding = whitespaceEnd - markerEnd;
  return markerEnd + (padding <= 4 ? padding : 1);
}
function listParentCount(stack, markerIndent) {
  for (let level = stack.length - 1; level >= 0; level--) {
    const item = stack[level];
    if (markerIndent === item.markerIndent) {
      return level;
    }
    if (item.contentIndent <= markerIndent && markerIndent <= item.contentIndent + 3) {
      return level + 1;
    }
  }
  return markerIndent <= 3 ? 0 : null;
}
function listContentStart(line, stack) {
  let cursor = 0;
  let parsedMarker = false;
  while (cursor < line.length) {
    let marker = cursor;
    while (marker < line.length && line[marker] === " ") {
      marker++;
    }
    const contentIndent = readListMarker(line, marker);
    if (contentIndent === null) {
      break;
    }
    const parentCount = listParentCount(stack, marker);
    if (parentCount === null) {
      break;
    }
    stack.splice(parentCount);
    stack.push({ markerIndent: marker, contentIndent });
    cursor = Math.min(contentIndent, line.length);
    parsedMarker = true;
  }
  if (parsedMarker) {
    return stack[stack.length - 1].contentIndent;
  }
  if (line.replace(/[ \t]/g, "").length === 0) {
    return stack.length > 0 ? stack[stack.length - 1].contentIndent : 0;
  }
  let indentation = 0;
  while (indentation < line.length && line[indentation] === " ") {
    indentation++;
  }
  for (let level = stack.length - 1; level >= 0; level--) {
    if (indentation >= stack[level].contentIndent) {
      stack.splice(level + 1);
      return stack[stack.length - 1].contentIndent;
    }
  }
  stack.length = 0;
  return 0;
}
function openingContainer(line, listStacks) {
  const [quoteDepth, quoteEnd] = stripBlockquotes(line);
  for (const depth of Array.from(listStacks.keys())) {
    if (depth > quoteDepth) {
      listStacks.delete(depth);
    }
  }
  if (!listStacks.has(quoteDepth)) {
    listStacks.set(quoteDepth, []);
  }
  const listStack = listStacks.get(quoteDepth);
  const listIndent = listContentStart(line.slice(quoteEnd), listStack);
  return [
    { quoteDepth, listIndent },
    Math.min(quoteEnd + listIndent, line.length)
  ];
}
function continuationStart(line, container) {
  const quoteEnd = stripRequiredBlockquotes(line, container.quoteDepth);
  if (quoteEnd === null) {
    return null;
  }
  const remainder = line.slice(quoteEnd);
  if (remainder.replace(/[ \t]/g, "").length === 0) {
    return line.length;
  }
  if (container.listIndent > 0 && !remainder.startsWith(" ".repeat(container.listIndent))) {
    return null;
  }
  return quoteEnd + container.listIndent;
}
function findFencedCode(text) {
  const lines = lineRanges(text);
  const spans = [];
  const listStacks = /* @__PURE__ */ new Map();
  let lineIndex = 0;
  while (lineIndex < lines.length) {
    const [start, contentEnd, lineEnd] = lines[lineIndex];
    const line = text.slice(start, contentEnd);
    const [container, containerEnd] = openingContainer(line, listStacks);
    const opening = openingFence(line.slice(containerEnd));
    if (opening === null) {
      lineIndex++;
      continue;
    }
    const [marker, minimum] = opening;
    let closingIndex = lineIndex + 1;
    let closed = false;
    while (closingIndex < lines.length) {
      const [closeStart, closeContentEnd, closeLineEnd] = lines[closingIndex];
      const closeLine = text.slice(closeStart, closeContentEnd);
      const closeContainerEnd = continuationStart(closeLine, container);
      if (closeContainerEnd === null) {
        spans.push({
          kind: FENCED_CODE,
          start,
          contentStart: lineEnd,
          contentEnd: closeStart,
          end: closeStart
        });
        lineIndex = closingIndex;
        closed = true;
        break;
      }
      if (isClosingFence(closeLine.slice(closeContainerEnd), marker, minimum)) {
        spans.push({
          kind: FENCED_CODE,
          start,
          contentStart: lineEnd,
          contentEnd: closeStart,
          end: closeLineEnd
        });
        lineIndex = closingIndex + 1;
        closed = true;
        break;
      }
      closingIndex++;
    }
    if (!closed) {
      spans.push({
        kind: FENCED_CODE,
        start,
        contentStart: lineEnd,
        contentEnd: text.length,
        end: text.length
      });
      lineIndex = lines.length;
    }
  }
  return spans;
}
function visibleRanges(length, excluded) {
  const ranges = [];
  let index = 0;
  for (const span of excluded) {
    if (index < span.start) {
      ranges.push([index, span.start]);
    }
    index = Math.max(index, span.end);
  }
  if (index < length) {
    ranges.push([index, length]);
  }
  return ranges;
}
function isEscaped(text, index, lowerBound) {
  let backslashes = 0;
  index -= 1;
  while (index >= lowerBound && text[index] === "\\") {
    backslashes++;
    index--;
  }
  return backslashes % 2 === 1;
}
function delimiterRuns(text, start, end, delimiter) {
  const runs = [];
  let index = start;
  while (index < end) {
    const runStart = text.indexOf(delimiter, index);
    if (runStart < 0 || runStart >= end) {
      break;
    }
    let runEnd = runStart + 1;
    while (runEnd < end && text[runEnd] === delimiter) {
      runEnd++;
    }
    if (!isEscaped(text, runStart, start)) {
      runs.push([runStart, runEnd]);
    }
    index = runEnd;
  }
  return runs;
}
function pairRuns(runs, kind, exactLength) {
  let filteredRuns = runs;
  if (exactLength !== void 0) {
    filteredRuns = runs.filter((run) => run[1] - run[0] === exactLength);
  }
  const nextSame = new Array(filteredRuns.length).fill(null);
  const nearest = /* @__PURE__ */ new Map();
  for (let index2 = filteredRuns.length - 1; index2 >= 0; index2--) {
    const len = filteredRuns[index2][1] - filteredRuns[index2][0];
    nextSame[index2] = nearest.get(len) ?? null;
    nearest.set(len, index2);
  }
  const spans = [];
  let index = 0;
  while (index < filteredRuns.length) {
    const closingIndex = nextSame[index];
    if (closingIndex === null) {
      index++;
      continue;
    }
    const opening = filteredRuns[index];
    const closing = filteredRuns[closingIndex];
    spans.push({
      kind,
      start: opening[0],
      contentStart: opening[1],
      contentEnd: closing[0],
      end: closing[1]
    });
    index = closingIndex + 1;
  }
  return spans;
}
function findCodeSpans(text, fenced) {
  const spans = [];
  for (const [start, end] of visibleRanges(text.length, fenced)) {
    spans.push(...pairRuns(delimiterRuns(text, start, end, "`"), CODE_SPAN));
  }
  return spans;
}
function findMathBlocks(text, protectedSpans) {
  const spans = [];
  for (const [start, end] of visibleRanges(text.length, protectedSpans)) {
    spans.push(
      ...pairRuns(delimiterRuns(text, start, end, "$"), MATH_BLOCK, 2)
    );
  }
  return spans;
}
function findMathInlines(text, protectedSpans) {
  const spans = [];
  for (const [start, end] of visibleRanges(text.length, protectedSpans)) {
    let index = start;
    while (index < end) {
      if (text[index] === "$" && (index === 0 || text[index - 1] !== "\\")) {
        if (index + 1 < end && text[index + 1] === "$") {
          index += 2;
          continue;
        }
        if (index + 1 < end && (text[index + 1] === " " || text[index + 1] === "	" || text[index + 1] === "\r" || text[index + 1] === "\n")) {
          index++;
          continue;
        }
        const contentStart = index + 1;
        let closing = contentStart;
        let found = false;
        while (closing < end) {
          if (text[closing] === "\r" || text[closing] === "\n") {
            break;
          }
          if (text[closing] === "$" && text[closing - 1] !== "\\") {
            if (text[closing - 1] !== " " && text[closing - 1] !== "	") {
              found = true;
              break;
            }
          }
          closing++;
        }
        if (found) {
          spans.push({
            kind: MATH_INLINE,
            start: index,
            contentStart,
            contentEnd: closing,
            end: closing + 1
          });
          index = closing + 1;
          continue;
        }
      }
      index++;
    }
  }
  return spans;
}
function scanMarkdown(text) {
  const fenced = findFencedCode(text);
  const codeSpans = findCodeSpans(text, fenced);
  const protectedSpans = [...fenced, ...codeSpans].sort((a, b) => a.start - b.start);
  const mathBlocks = findMathBlocks(text, protectedSpans);
  const allProtected = [...protectedSpans, ...mathBlocks].sort(
    (a, b) => a.start - b.start
  );
  const mathInlines = findMathInlines(text, allProtected);
  return {
    protected: protectedSpans,
    mathBlocks,
    mathInlines
  };
}

// src/parsers/latex_spans.ts
var STYLE_MACROS = /* @__PURE__ */ new Set([
  "mathbf",
  "mathcal",
  "mathbb",
  "mathrm",
  "mathit",
  "mathsf",
  "mathtt",
  "boldsymbol",
  "operatorname",
  "text",
  "textbf",
  "textit",
  "textrm",
  "texttt"
]);
var FUNCTION_MACROS = /* @__PURE__ */ new Set([
  "Tr",
  "arccos",
  "arcsin",
  "arctan",
  "cos",
  "cosh",
  "det",
  "exp",
  "ln",
  "log",
  "max",
  "min",
  "sec",
  "sin",
  "sinh",
  "sqrt",
  "sup",
  "tan",
  "tanh",
  "tr",
  "trace",
  "operatorname"
]);
var OPERATOR_COMMANDS = /* @__PURE__ */ new Set([
  "bigcap",
  "bigcup",
  "bigoplus",
  "bigotimes",
  "bigsqcup",
  "bigvee",
  "bigwedge",
  "cdot",
  "coprod",
  "int",
  "iint",
  "iiint",
  "inf",
  "lim",
  "max",
  "min",
  "oint",
  "otimes",
  "prod",
  "sum",
  "sup",
  "times"
]);
var NON_OPERAND_COMMANDS = /* @__PURE__ */ new Set([
  "!",
  ",",
  ":",
  ";",
  "\\",
  "approx",
  "atop",
  "choose",
  "cap",
  "displaystyle",
  "displaylimits",
  "emptyset",
  "end",
  "equiv",
  "Leftarrow",
  "Leftrightarrow",
  "Rightarrow",
  "geq",
  "in",
  "leq",
  "leftarrow",
  "leftrightarrow",
  "limits",
  "longleftarrow",
  "longrightarrow",
  "mapsto",
  "middle",
  "mp",
  "neq",
  "nolimits",
  "notin",
  "over",
  "pm",
  "propto",
  "quad",
  "qquad",
  "right",
  "rVert",
  "scriptstyle",
  "scriptscriptstyle",
  "sim",
  "setminus",
  "subset",
  "subseteq",
  "supset",
  "supseteq",
  "to",
  "textstyle",
  "cup",
  "rightarrow"
]);
var UNARY_MACROS = /* @__PURE__ */ new Set([
  "acute",
  "bar",
  "breve",
  "check",
  "ddot",
  "dot",
  "grave",
  "hat",
  "mathring",
  "overline",
  "tilde",
  "underline",
  "vec",
  "widehat",
  "widetilde"
]);
var SYMBOL_MACROS = /* @__PURE__ */ new Set([
  "Delta",
  "Gamma",
  "Im",
  "Lambda",
  "Omega",
  "Phi",
  "Pi",
  "Psi",
  "Re",
  "Sigma",
  "Theta",
  "Upsilon",
  "Xi",
  "aleph",
  "alpha",
  "beta",
  "bot",
  "chi",
  "delta",
  "ell",
  "epsilon",
  "eta",
  "gamma",
  "hbar",
  "imath",
  "infty",
  "iota",
  "jmath",
  "kappa",
  "lambda",
  "mu",
  "nabla",
  "nu",
  "omega",
  "partial",
  "perp",
  "phi",
  "pi",
  "psi",
  "rho",
  "sigma",
  "tau",
  "theta",
  "top",
  "upsilon",
  "varepsilon",
  "varphi",
  "varpi",
  "varrho",
  "varsigma",
  "vartheta",
  "xi",
  "zeta"
]);
var DELIMITER_SIZE_COMMANDS = /* @__PURE__ */ new Set([
  "Big",
  "Bigg",
  "Biggl",
  "Biggm",
  "Biggr",
  "Bigl",
  "Bigm",
  "Bigr",
  "big",
  "bigg",
  "biggl",
  "biggm",
  "biggr",
  "bigl",
  "bigm",
  "bigr"
]);
var OPAQUE_MACROS = /* @__PURE__ */ new Set([
  "color",
  "colorbox",
  "fcolorbox",
  "text",
  "textbf",
  "textcolor",
  "textit",
  "textrm",
  "texttt",
  "verb"
]);
var MATRIX_ENVIRONMENTS = /* @__PURE__ */ new Set([
  "Bmatrix",
  "Vmatrix",
  "array",
  "bmatrix",
  "matrix",
  "pmatrix",
  "smallmatrix",
  "vmatrix"
]);
var NEGATABLE_RELATIONS = /* @__PURE__ */ new Set([
  "approx",
  "equiv",
  "geq",
  "in",
  "leq",
  "sim",
  "subset",
  "subseteq",
  "supset",
  "supseteq"
]);
function operandText(source, span) {
  return source.slice(span.start, span.end);
}
function skipWhitespace(source, index, end) {
  while (index < end && /\s/.test(source[index])) {
    index++;
  }
  return index;
}
function skipComment(source, start, end) {
  let index = start + 1;
  while (index < end && source[index] !== "\r" && source[index] !== "\n") {
    index++;
  }
  if (index < end && source[index] === "\r" && index + 1 < end && source[index + 1] === "\n") {
    return index + 2;
  }
  return Math.min(index + 1, end);
}
function skipIgnorable(source, index, end) {
  while (true) {
    index = skipWhitespace(source, index, end);
    if (index >= end || source[index] !== "%") {
      return index;
    }
    index = skipComment(source, index, end);
  }
}
function readCommand(source, start, end) {
  if (start >= end || source[start] !== "\\")
    return null;
  const match = source.slice(start, end).match(/^(\\[A-Za-z]+|\\.)/);
  if (!match)
    return null;
  return [match[0].slice(1), start + match[0].length];
}
function readGroupEnd(source, start, end, opening) {
  if (start >= end)
    return null;
  opening = opening === void 0 ? source[start] : opening;
  const closingMap = { "{": "}", "(": ")", "[": "]" };
  const closing = closingMap[opening];
  if (!closing || source[start] !== opening)
    return null;
  let depth = 1;
  let index = start + 1;
  while (index < end) {
    if (source[index] === "%") {
      index = skipComment(source, index, end);
      continue;
    }
    if (source[index] === "\\") {
      const command = readCommand(source, index, end);
      if (command !== null && command[0] === "verb") {
        const verbEnd = readVerbEndHelper(source, command[1], end);
        if (verbEnd >= end)
          return null;
        index = verbEnd;
        continue;
      }
      if (command !== null && command[0] === "left") {
        const nested = readLeftRightEnd(source, index, end);
        if (nested !== null) {
          index = nested;
          continue;
        }
      }
      index = command !== null ? command[1] : index + 1;
      continue;
    }
    if (source[index] === opening) {
      depth++;
    } else if (source[index] === closing) {
      depth--;
      if (depth === 0) {
        return index + 1;
      }
    }
    index++;
  }
  return null;
}
function readDelimiterEnd(source, start, end) {
  start = skipIgnorable(source, start, end);
  if (start >= end)
    return null;
  if (source[start] === "\\") {
    const command = readCommand(source, start, end);
    return command !== null ? command[1] : null;
  }
  return start + 1;
}
function leftDelimiter(source, start, end) {
  const command = readCommand(source, start, end);
  if (command === null || command[0] !== "left")
    return null;
  const delimiterStart = skipIgnorable(source, command[1], end);
  if (delimiterStart >= end)
    return null;
  if (source[delimiterStart] !== "\\") {
    return source[delimiterStart];
  }
  const delimiter = readCommand(source, delimiterStart, end);
  return delimiter !== null ? delimiter[0] : null;
}
function readLeftRightEnd(source, start, end) {
  const command = readCommand(source, start, end);
  if (command === null || command[0] !== "left")
    return null;
  let index = readDelimiterEnd(source, command[1], end);
  if (index === null)
    return null;
  let depth = 1;
  while (index < end) {
    if (source[index] === "%") {
      index = skipComment(source, index, end);
      continue;
    }
    if (source[index] === "{") {
      const groupEnd = readGroupEnd(source, index, end);
      if (groupEnd !== null) {
        index = groupEnd;
        continue;
      }
    }
    if (source[index] !== "\\") {
      index++;
      continue;
    }
    const nested = readCommand(source, index, end);
    if (nested === null) {
      index++;
      continue;
    }
    const [name, commandEnd] = nested;
    if (name === "verb") {
      const verbEnd = readVerbEndHelper(source, commandEnd, end);
      if (verbEnd >= end)
        return null;
      index = verbEnd;
      continue;
    }
    if (name === "left") {
      const delimiterEnd = readDelimiterEnd(source, commandEnd, end);
      if (delimiterEnd !== null) {
        depth++;
        index = delimiterEnd;
        continue;
      }
    } else if (name === "right") {
      const delimiterEnd = readDelimiterEnd(source, commandEnd, end);
      if (delimiterEnd !== null) {
        depth--;
        if (depth === 0) {
          return delimiterEnd;
        }
        index = delimiterEnd;
        continue;
      }
    }
    index = commandEnd;
  }
  return null;
}
function readEnvironmentMarker(source, start, end) {
  const command = readCommand(source, start, end);
  if (command === null || command[0] !== "begin" && command[0] !== "end") {
    return null;
  }
  const [marker, index] = command;
  const groupStart = skipIgnorable(source, index, end);
  const groupEnd = readGroupEnd(source, groupStart, end);
  if (groupEnd === null)
    return null;
  const name = source.slice(groupStart + 1, groupEnd - 1).trim();
  if (!name)
    return null;
  return [marker, name, groupEnd];
}
function readEnvironmentEnd(source, start, end) {
  const opening = readEnvironmentMarker(source, start, end);
  if (opening === null || opening[0] !== "begin")
    return null;
  const stack = [opening[1]];
  let index = opening[2];
  while (index < end) {
    if (source[index] === "%") {
      index = skipComment(source, index, end);
      continue;
    }
    if (source[index] === "{") {
      const groupEnd = readGroupEnd(source, index, end);
      if (groupEnd !== null) {
        index = groupEnd;
        continue;
      }
    }
    if (source[index] !== "\\") {
      index++;
      continue;
    }
    const marker = readEnvironmentMarker(source, index, end);
    if (marker === null) {
      const command = readCommand(source, index, end);
      if (command !== null && command[0] === "verb") {
        const verbEnd = readVerbEndHelper(source, command[1], end);
        if (verbEnd >= end)
          return null;
        index = verbEnd;
        continue;
      }
      index = command !== null ? command[1] : index + 1;
      continue;
    }
    const [markerKind, name, markerEnd] = marker;
    if (markerKind === "begin") {
      stack.push(name);
    } else if (name !== stack[stack.length - 1]) {
      return null;
    } else {
      stack.pop();
      if (stack.length === 0) {
        return [opening[1], markerEnd];
      }
    }
    index = markerEnd;
  }
  return null;
}
function readArgumentEnd(source, start, end) {
  start = skipIgnorable(source, start, end);
  if (start >= end)
    return null;
  if (source[start] === "{" || source[start] === "(" || source[start] === "[") {
    return readGroupEnd(source, start, end);
  }
  if (source[start] === "\\") {
    const operand = readOperand(source, start, end);
    return operand !== null && operand.kind !== "opaque" ? operand.end : null;
  }
  return start + 1;
}
function consumeScripts(source, start, end) {
  let current = start;
  while (true) {
    const marker = skipIgnorable(source, current, end);
    if (marker >= end || source[marker] !== "_" && source[marker] !== "^") {
      return current;
    }
    const argumentEnd = readArgumentEnd(source, marker + 1, end);
    if (argumentEnd === null) {
      return current;
    }
    current = argumentEnd;
  }
}
function consumePostfix(source, start, end) {
  let current = start;
  while (true) {
    const previous = current;
    current = consumeScripts(source, current, end);
    const primeStart = skipIgnorable(source, current, end);
    if (primeStart < end && (source[primeStart] === "'" || source[primeStart] === "\u2019")) {
      current = primeStart;
    }
    while (current < end && (source[current] === "'" || source[current] === "\u2019")) {
      current++;
    }
    if (current === previous) {
      return current;
    }
  }
}
function consumeOperatorScripts(source, start, end) {
  const modifierStart = skipIgnorable(source, start, end);
  const modifier = readCommand(source, modifierStart, end);
  if (modifier !== null && (modifier[0] === "displaylimits" || modifier[0] === "limits" || modifier[0] === "nolimits")) {
    start = modifier[1];
  }
  return consumeScripts(source, start, end);
}
function readNormEnd(source, start, end) {
  const opening = readCommand(source, start, end);
  if (opening === null)
    return null;
  const closingNameMap = { "|": "|", Vert: "Vert", lVert: "rVert" };
  const closingName = closingNameMap[opening[0]];
  if (!closingName)
    return null;
  let index = opening[1];
  let braceDepth = 0;
  while (index < end) {
    if (source[index] === "%") {
      index = skipComment(source, index, end);
      continue;
    }
    if (source[index] === "{") {
      braceDepth++;
    } else if (source[index] === "}" && braceDepth > 0) {
      braceDepth--;
    } else if (source[index] === "\\") {
      const command = readCommand(source, index, end);
      if (command !== null) {
        if (command[0] === "verb") {
          const verbEnd = readVerbEndHelper(source, command[1], end);
          if (verbEnd >= end)
            return null;
          index = verbEnd;
          continue;
        }
        if (command[0] === "left") {
          const groupEnd = readLeftRightEnd(source, index, end);
          if (groupEnd !== null) {
            index = groupEnd;
            continue;
          }
        }
        if (braceDepth === 0 && command[0] === closingName) {
          return consumePostfix(source, command[1], end);
        }
        index = command[1];
        continue;
      }
    }
    index++;
  }
  return null;
}
function consumeArguments(source, start, end, count) {
  let index = start;
  for (let i = 0; i < count; i++) {
    const argumentEnd = readArgumentEnd(source, index, end);
    if (argumentEnd === null)
      return null;
    index = argumentEnd;
  }
  return index;
}
function consumeOptionalBracket(source, start, end) {
  const index = skipIgnorable(source, start, end);
  if (index >= end || source[index] !== "[") {
    return start;
  }
  return readGroupEnd(source, index, end);
}
function readVerbEndHelper(source, start, end) {
  const index = start < end && source[start] === "*" ? start + 1 : start;
  if (index >= end || /\s/.test(source[index])) {
    return end;
  }
  const closing = source.indexOf(source[index], index + 1);
  return closing < 0 || closing >= end ? end : closing + 1;
}
function containsVerbCommand(source, start, end) {
  let index = start;
  while (index < end) {
    if (source[index] === "%") {
      index = skipComment(source, index, end);
      continue;
    }
    if (source[index] !== "\\") {
      index++;
      continue;
    }
    const command = readCommand(source, index, end);
    if (command === null) {
      index++;
      continue;
    }
    if (command[0] === "verb") {
      return true;
    }
    index = command[1];
  }
  return false;
}
function readNegatedRelationEnd(source, start, end) {
  const index = skipIgnorable(source, start, end);
  if (index < end && (source[index] === "=" || source[index] === "<" || source[index] === ">")) {
    return index + 1;
  }
  const command = readCommand(source, index, end);
  if (command !== null && NEGATABLE_RELATIONS.has(command[0])) {
    return command[1];
  }
  return null;
}
function readOperand(source, start, end) {
  end = end === void 0 ? source.length : end;
  if (start >= end || /\s/.test(source[start])) {
    return null;
  }
  if (source[start] === "\\") {
    const command = readCommand(source, start, end);
    if (command === null)
      return null;
    let [name, commandEnd] = command;
    if (name === "operatorname" && commandEnd < end && source[commandEnd] === "*") {
      commandEnd++;
    }
    if (name === "|" || name === "Vert" || name === "lVert") {
      const normEnd = readNormEnd(source, start, end);
      if (normEnd !== null) {
        return { kind: "norm", start, end: normEnd };
      }
      return {
        kind: name === "lVert" ? "opaque" : "structural",
        start,
        end: name !== "lVert" ? commandEnd : end
      };
    }
    if (name === "verb") {
      return { kind: "opaque", start, end: readVerbEndHelper(source, commandEnd, end) };
    }
    if (name === "not") {
      const relationEnd = readNegatedRelationEnd(source, commandEnd, end);
      return {
        kind: "opaque",
        start,
        end: relationEnd !== null ? relationEnd : end
      };
    }
    if (name === "begin") {
      const env = readEnvironmentEnd(source, start, end);
      if (env !== null) {
        const [envName, envEnd] = env;
        if (containsVerbCommand(source, start, envEnd)) {
          return { kind: "opaque", start, end: envEnd };
        }
        const kind2 = MATRIX_ENVIRONMENTS.has(envName) ? "matrix" : "environment";
        return {
          kind: kind2,
          start,
          end: consumePostfix(source, envEnd, end)
        };
      }
      return { kind: "opaque", start, end };
    }
    if (name === "left") {
      const groupEnd = readLeftRightEnd(source, start, end);
      if (groupEnd === null) {
        return { kind: "opaque", start, end };
      }
      if (containsVerbCommand(source, start, groupEnd)) {
        return { kind: "opaque", start, end: groupEnd };
      }
      return {
        kind: "group",
        start,
        end: consumePostfix(source, groupEnd, end)
      };
    }
    if (OPERATOR_COMMANDS.has(name)) {
      return {
        kind: "operator",
        start,
        end: consumeOperatorScripts(source, commandEnd, end)
      };
    }
    if (name === "\\") {
      let layoutEnd = commandEnd;
      if (layoutEnd < end && source[layoutEnd] === "*") {
        layoutEnd++;
      }
      const optionalStart = skipIgnorable(source, layoutEnd, end);
      if (optionalStart < end && source[optionalStart] === "[") {
        const optionalEnd = readGroupEnd(source, optionalStart, end);
        if (optionalEnd === null) {
          return { kind: "opaque", start, end };
        }
        layoutEnd = optionalEnd;
      }
      return { kind: "structural", start, end: layoutEnd };
    }
    if (NON_OPERAND_COMMANDS.has(name)) {
      return { kind: "structural", start, end: commandEnd };
    }
    if (DELIMITER_SIZE_COMMANDS.has(name)) {
      const delimiterEnd = readDelimiterEnd(source, commandEnd, end);
      return {
        kind: "structural",
        start,
        end: delimiterEnd !== null ? delimiterEnd : commandEnd
      };
    }
    if (SYMBOL_MACROS.has(name)) {
      return {
        kind: "symbol",
        start,
        end: consumePostfix(source, commandEnd, end)
      };
    }
    if (name === "color" || name === "colorbox" || name === "textcolor") {
      const optionalEnd = consumeOptionalBracket(source, commandEnd, end);
      const argsEnd = optionalEnd !== null ? consumeArguments(source, optionalEnd, end, 2) : null;
      return {
        kind: "opaque",
        start,
        end: argsEnd !== null ? argsEnd : end
      };
    }
    if (name === "fcolorbox") {
      const optionalEnd = consumeOptionalBracket(source, commandEnd, end);
      const frameEnd = optionalEnd !== null ? consumeArguments(source, optionalEnd, end, 1) : null;
      const bgModelEnd = frameEnd !== null ? consumeOptionalBracket(source, frameEnd, end) : null;
      const argsEnd = bgModelEnd !== null ? consumeArguments(source, bgModelEnd, end, 2) : null;
      return {
        kind: "opaque",
        start,
        end: argsEnd !== null ? argsEnd : end
      };
    }
    let argumentCount = 0;
    if (name === "frac" || name === "dfrac" || name === "tfrac") {
      argumentCount = 2;
    } else if (STYLE_MACROS.has(name) || name === "boxed") {
      argumentCount = 1;
    } else if (name === "sqrt") {
      const optional = skipIgnorable(source, commandEnd, end);
      if (optional < end && source[optional] === "[") {
        const optionalEnd = readGroupEnd(source, optional, end);
        if (optionalEnd === null)
          return null;
        commandEnd = optionalEnd;
      }
      argumentCount = 1;
    } else if (UNARY_MACROS.has(name)) {
      argumentCount = 1;
    } else if (name === "overset" || name === "stackrel" || name === "underset") {
      argumentCount = 2;
    }
    let atomEnd = commandEnd;
    if (argumentCount) {
      const argumentsEnd = consumeArguments(source, commandEnd, end, argumentCount);
      if (argumentsEnd === null) {
        return { kind: "opaque", start, end };
      }
      atomEnd = argumentsEnd;
    }
    if (!argumentCount && !FUNCTION_MACROS.has(name)) {
      return { kind: "opaque", start, end };
    }
    const scriptedEnd = consumeScripts(source, atomEnd, end);
    if (FUNCTION_MACROS.has(name)) {
      const groupStart = skipIgnorable(source, scriptedEnd, end);
      if (groupStart < end && (source[groupStart] === "(" || source[groupStart] === "[")) {
        const groupEnd = readGroupEnd(source, groupStart, end);
        if (groupEnd !== null) {
          atomEnd = groupEnd;
        }
      } else if (source.startsWith("\\left", groupStart) && ["(", "[", "lparen", "lbrack"].includes(leftDelimiter(source, groupStart, end) ?? "")) {
        const groupEnd = readLeftRightEnd(source, groupStart, end);
        if (groupEnd !== null) {
          atomEnd = groupEnd;
        }
      } else {
        atomEnd = scriptedEnd;
      }
    }
    const kind = OPAQUE_MACROS.has(name) ? "opaque" : FUNCTION_MACROS.has(name) ? "function" : "operand";
    return {
      kind,
      start,
      end: consumePostfix(source, atomEnd, end)
    };
  }
  if (source[start] === "(" || source[start] === "{" || source[start] === "[") {
    const groupEnd = readGroupEnd(source, start, end);
    if (groupEnd === null) {
      return { kind: "opaque", start, end };
    }
    if (containsVerbCommand(source, start, groupEnd)) {
      return { kind: "opaque", start, end: groupEnd };
    }
    const innerStart = skipIgnorable(source, start + 1, groupEnd - 1);
    const innerCommand = readCommand(source, innerStart, groupEnd - 1);
    const kind = source[start] === "{" && innerCommand !== null && innerCommand[0] === "color" ? "opaque" : "group";
    return {
      kind,
      start,
      end: consumePostfix(source, groupEnd, end)
    };
  }
  const numberMatch = source.slice(start, end).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
  if (numberMatch) {
    return {
      kind: "number",
      start,
      end: consumePostfix(source, start + numberMatch[0].length, end)
    };
  }
  if (/[A-Za-z]/.test(source[start])) {
    let nameEnd = start + 1;
    while (nameEnd < end && source[nameEnd] === "'") {
      nameEnd++;
    }
    const groupStart = skipIgnorable(source, nameEnd, end);
    let atomEnd = nameEnd;
    let kind = "symbol";
    if (groupStart < end && source[groupStart] === "(") {
      const groupEnd = readGroupEnd(source, groupStart, end);
      if (groupEnd !== null) {
        atomEnd = groupEnd;
        kind = "function";
      }
    } else if (source.startsWith("\\left", groupStart) && ["(", "lparen"].includes(leftDelimiter(source, groupStart, end) ?? "")) {
      const groupEnd = readLeftRightEnd(source, groupStart, end);
      if (groupEnd !== null) {
        atomEnd = groupEnd;
        kind = "function";
      }
    }
    return {
      kind,
      start,
      end: consumePostfix(source, atomEnd, end)
    };
  }
  return null;
}
function findOperandSpans(source, start = 0, end) {
  end = end === void 0 ? source.length : end;
  const operands = [];
  let index = start;
  while (index < end) {
    index = skipWhitespace(source, index, end);
    if (index >= end)
      break;
    if (source[index] === "%") {
      index = skipComment(source, index, end);
      continue;
    }
    const operand = readOperand(source, index, end);
    if (operand === null) {
      index++;
      continue;
    }
    if (operand.kind !== "operator" && operand.kind !== "opaque" && operand.kind !== "structural") {
      operands.push(operand);
    }
    index = Math.max(index + 1, operand.end);
  }
  return operands;
}
function findAllOperatorSpans(source, start = 0, end) {
  end = end === void 0 ? source.length : end;
  const operators = [];
  let index = start;
  while (index < end) {
    if (source[index] === "%") {
      index = skipComment(source, index, end);
      continue;
    }
    const operand = readOperand(source, index, end);
    if (operand !== null) {
      if (operand.kind === "operator") {
        operators.push(operand);
        index = operand.end;
        continue;
      }
      if (operand.kind === "opaque") {
        index = operand.end;
        continue;
      }
    }
    if (source[index] === "\\") {
      const command = readCommand(source, index, end);
      if (command !== null) {
        index = command[1];
        continue;
      }
    }
    index++;
  }
  return operators;
}
function findTopLevelTokens(source, tokens, start = 0, end) {
  end = end === void 0 ? source.length : end;
  const found = [];
  let index = start;
  const ordered = [...tokens].sort((a, b) => b.length - a.length);
  while (index < end) {
    index = skipWhitespace(source, index, end);
    if (index >= end)
      break;
    if (source[index] === "%") {
      index = skipComment(source, index, end);
      continue;
    }
    let matchedToken = null;
    for (const item of ordered) {
      if (source.startsWith(item, index)) {
        if (item.startsWith("\\") && /[A-Za-z]/.test(item[item.length - 1]) && index + item.length < end && /[A-Za-z]/.test(source[index + item.length])) {
          continue;
        }
        matchedToken = item;
        break;
      }
    }
    if (matchedToken !== null) {
      found.push([index, index + matchedToken.length, matchedToken]);
      index += matchedToken.length;
      continue;
    }
    const operand = readOperand(source, index, end);
    if (operand !== null) {
      index = Math.max(index + 1, operand.end);
      continue;
    }
    index++;
  }
  return found;
}
function findScriptArgumentSpans(source) {
  const spans = [];
  let index = 0;
  while (index < source.length) {
    if (source[index] === "%") {
      index = skipComment(source, index, source.length);
      continue;
    }
    if (source[index] !== "_" && source[index] !== "^") {
      const operand = readOperand(source, index);
      if (operand !== null && operand.kind === "opaque") {
        index = operand.end;
        continue;
      }
      if (source[index] === "\\") {
        const command = readCommand(source, index, source.length);
        if (command !== null) {
          index = command[1];
          continue;
        }
      }
      index++;
      continue;
    }
    const argumentStart = skipIgnorable(source, index + 1, source.length);
    const argumentEnd = readArgumentEnd(source, argumentStart, source.length);
    if (argumentEnd === null) {
      index++;
      continue;
    }
    let innerStart = argumentStart;
    let innerEnd = argumentEnd;
    if (source[argumentStart] === "{") {
      innerStart = argumentStart + 1;
      innerEnd = argumentEnd - 1;
    }
    if (innerStart < innerEnd) {
      spans.push({
        kind: source[index] === "_" ? "subscript" : "superscript",
        start: innerStart,
        end: innerEnd
      });
    }
    index = argumentEnd;
  }
  return spans;
}

// src/utils/coloring.ts
function commandColor(command, palette = COLORS) {
  if (BIG_OPERATORS.has(command) || INTEGRALS.has(command) || LIMIT_OPERATORS.has(command)) {
    return palette.orange;
  }
  if (ARROWS.has(command)) {
    return palette.arrow;
  }
  if (SET_SYMBOLS.has(command)) {
    return palette.set;
  }
  if (SPACING_COMMANDS.has(command)) {
    return palette.spacing;
  }
  if (MULTIPLICATION_SYMBOLS.has(command)) {
    return palette.dot;
  }
  return palette.relation;
}

// src/utils/latex_helpers.ts
function matchCommand(text, index) {
  if (index >= text.length || text[index] !== "\\")
    return null;
  const match = text.slice(index).match(/^(\\[A-Za-z]+|\\.)/);
  return match ? match[0] : null;
}
function readCommentEnd(text, start) {
  let index = start + 1;
  while (index < text.length && text[index] !== "\r" && text[index] !== "\n") {
    index++;
  }
  if (text.startsWith("\r\n", index)) {
    return index + 2;
  }
  return Math.min(index + 1, text.length);
}
function readVerbEnd(text, start) {
  if (!text.startsWith("\\verb", start)) {
    return null;
  }
  let commandEnd = start + 5;
  if (commandEnd < text.length && /[A-Za-z]/.test(text[commandEnd])) {
    return null;
  }
  if (commandEnd < text.length && text[commandEnd] === "*") {
    commandEnd++;
  }
  if (commandEnd >= text.length || /\s/.test(text[commandEnd])) {
    return [text.length, false];
  }
  const delimiter = text[commandEnd];
  const closing = text.indexOf(delimiter, commandEnd + 1);
  return closing < 0 ? [text.length, false] : [closing + 1, true];
}
function readBraced(text, start) {
  if (start >= text.length || text[start] !== "{") {
    return null;
  }
  let depth = 0;
  let index = start;
  while (index < text.length) {
    const char = text[index];
    if (char === "%") {
      index = readCommentEnd(text, index);
      continue;
    }
    if (char === "\\") {
      const verb = readVerbEnd(text, index);
      if (verb !== null) {
        const [vEnd, closed] = verb;
        if (!closed) {
          return null;
        }
        index = vEnd;
        continue;
      }
      const command = matchCommand(text, index);
      index = command !== null ? index + command.length : index + 1;
      continue;
    }
    if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0) {
        return [text.slice(start, index + 1), index + 1];
      }
    }
    index++;
  }
  return null;
}
function readColorWrapper(text, start) {
  let command = null;
  for (const candidate of ["\\textcolor", "\\color"]) {
    if (text.startsWith(candidate, start) && (start + candidate.length === text.length || !/[A-Za-z]/.test(text[start + candidate.length]))) {
      command = candidate;
      break;
    }
  }
  if (command === null) {
    return null;
  }
  let index = start + command.length;
  while (index < text.length && /\s/.test(text[index])) {
    index++;
  }
  const colorData = readBraced(text, index);
  if (colorData === null) {
    return null;
  }
  index = colorData[1];
  while (index < text.length && /\s/.test(text[index])) {
    index++;
  }
  const valueData = readBraced(text, index);
  if (valueData === null) {
    return null;
  }
  const [value, end] = valueData;
  return [value.slice(1, -1), end];
}
function readColorCommand(text, start) {
  const wrapper = readColorWrapper(text, start);
  if (wrapper === null) {
    return null;
  }
  const [, end] = wrapper;
  return [text.slice(start, end), end];
}
function containsColorWrapper(text) {
  let index = 0;
  while (index < text.length) {
    if (text[index] === "%") {
      index = readCommentEnd(text, index);
      continue;
    }
    if (text[index] === "\\") {
      if (readColorWrapper(text, index) !== null) {
        return true;
      }
      const verb = readVerbEnd(text, index);
      if (verb !== null) {
        index = verb[0];
        continue;
      }
      const command = matchCommand(text, index);
      index = command !== null ? index + command.length : index + 1;
      continue;
    }
    index++;
  }
  return false;
}

// src/utils/spans.ts
function crosses(left, right) {
  return left.start < right.start && right.start < left.end && left.end < right.end || right.start < left.start && left.start < right.end && right.end < left.end;
}
function selectColorSpans(source, spans) {
  const candidates = /* @__PURE__ */ new Map();
  for (const span of spans) {
    const priority = span.priority ?? 0;
    if (!(0 <= span.start && span.start < span.end && span.end <= source.length)) {
      continue;
    }
    const key = `${span.start}:${span.end}`;
    const previous = candidates.get(key);
    if (!previous || priority > (previous.priority ?? 0)) {
      candidates.set(key, { ...span, priority });
    }
  }
  const sortedCandidates = Array.from(candidates.values()).sort((a, b) => {
    const pa = a.priority ?? 0;
    const pb = b.priority ?? 0;
    if (pa !== pb)
      return pb - pa;
    if (a.start !== b.start)
      return a.start - b.start;
    return b.end - b.start - (a.end - a.start);
  });
  const accepted = [];
  for (const span of sortedCandidates) {
    if (accepted.some((other) => crosses(span, other))) {
      continue;
    }
    accepted.push(span);
  }
  return accepted.sort((a, b) => {
    if (a.start !== b.start)
      return a.start - b.start;
    return b.end - a.end;
  });
}
function applyColorSpans(source, spans) {
  const selected = selectColorSpans(source, spans);
  const openings = /* @__PURE__ */ new Map();
  const closings = /* @__PURE__ */ new Map();
  for (const span of selected) {
    if (!openings.has(span.start))
      openings.set(span.start, []);
    openings.get(span.start).push(span);
    if (!closings.has(span.end))
      closings.set(span.end, []);
    closings.get(span.end).push(span);
  }
  const pieces = [];
  for (let index = 0; index <= source.length; index++) {
    const closeList = closings.get(index);
    if (closeList) {
      const sortedClosings = [...closeList].sort((a, b) => b.start - a.start);
      for (let i = 0; i < sortedClosings.length; i++) {
        pieces.push("}");
      }
    }
    const openList = openings.get(index);
    if (openList) {
      const sortedOpenings = [...openList].sort((a, b) => b.end - a.end);
      for (const span of sortedOpenings) {
        pieces.push(`\\textcolor{${span.color}}{`);
      }
    }
    if (index < source.length) {
      pieces.push(source[index]);
    }
  }
  return pieces.join("");
}

// src/parsers/scanner.ts
function collectOperatorSpans(body, start = 0, end, palette = COLORS) {
  const spans = [];
  for (const operator of findAllOperatorSpans(body, start, end)) {
    const match = body.slice(operator.start, operator.end).match(/^(\\[A-Za-z]+|\\.)/);
    if (match) {
      spans.push({
        start: operator.start,
        end: operator.end,
        color: commandColor(match[0], palette),
        priority: 30
      });
    }
  }
  return spans;
}
function collectScannerSpans(body, palette = COLORS) {
  const scripts = findScriptArgumentSpans(body);
  const operators = findAllOperatorSpans(body);
  const spans = scripts.map((item) => ({
    start: item.start,
    end: item.end,
    color: palette[item.kind === "subscript" ? "chain" : "upper"],
    priority: 10
  }));
  spans.push(...collectOperatorSpans(body, 0, void 0, palette));
  const scriptRanges = scripts.map((item) => [item.start, item.end]);
  const operatorRanges = operators.map((item) => [item.start, item.end]);
  let index = 0;
  while (index < body.length) {
    if (body[index] === "%") {
      let lineEnd = index + 1;
      while (lineEnd < body.length && body[lineEnd] !== "\r" && body[lineEnd] !== "\n") {
        lineEnd++;
      }
      if (lineEnd < body.length && body[lineEnd] === "\r" && lineEnd + 1 < body.length && body[lineEnd + 1] === "\n") {
        lineEnd += 2;
      } else if (lineEnd < body.length) {
        lineEnd += 1;
      }
      index = lineEnd;
      continue;
    }
    const existing = readColorCommand(body, index);
    if (existing !== null) {
      index = existing[1];
      continue;
    }
    const operand = readOperand(body, index);
    if (operand !== null && operand.kind === "opaque") {
      index = operand.end;
      continue;
    }
    const containingOperator = operatorRanges.find(
      ([start, end]) => start <= index && index < end
    );
    if (containingOperator !== void 0) {
      index = containingOperator[1];
      continue;
    }
    const containingScript = scriptRanges.find(
      ([start, end]) => start <= index && index < end
    );
    if (containingScript !== void 0) {
      index = containingScript[1];
      continue;
    }
    const cmdMatch = body.slice(index).match(/^(\\[A-Za-z]+|\\.)/);
    if (cmdMatch) {
      const command = cmdMatch[0];
      if (SORTED_COLOR_COMMANDS.includes(command)) {
        spans.push({
          start: index,
          end: index + command.length,
          color: commandColor(command, palette)
        });
      }
      index += command.length;
      if (index < body.length && body[index] === "*") {
        index += 1;
      }
      continue;
    }
    const nonSlashCommand = SORTED_COLOR_COMMANDS.find(
      (cand) => !cand.startsWith("\\") && body.startsWith(cand, index)
    );
    if (nonSlashCommand !== void 0) {
      spans.push({
        start: index,
        end: index + nonSlashCommand.length,
        color: commandColor(nonSlashCommand, palette)
      });
      index += nonSlashCommand.length;
      continue;
    }
    index += 1;
  }
  return spans;
}

// src/converters/semantic.ts
function parseMathBlock(source) {
  const match = source.match(/^(\s*(?:#+\s*)?)\$\$([\s\S]*)\$\$([\s]*)$/);
  if (!match)
    return null;
  const prefix = match[1];
  const body = match[2];
  const suffix = match[3];
  return {
    prefix,
    body,
    suffix,
    render(coloredBody) {
      return `${prefix}$$${coloredBody}$$${suffix}`;
    }
  };
}
function trimRange(source, start, end) {
  while (start < end && /\s/.test(source[start])) {
    start++;
  }
  while (end > start && /\s/.test(source[end - 1])) {
    end--;
  }
  return [start, end];
}
function firstEquality(source) {
  const matches = findTopLevelTokens(source, ["="]);
  return matches.length > 0 ? [matches[0][0], matches[0][1]] : null;
}
function relationSpans(source, start = 0, end, palette = COLORS) {
  const colorByToken = {
    "=": palette.relation,
    "+": palette.relation,
    "-": palette.relation,
    "\\cdot": palette.dot,
    "\\otimes": palette.relation,
    "\xB7": palette.dot,
    "*": palette.dot
  };
  const tokens = Object.keys(colorByToken);
  return findTopLevelTokens(source, tokens, start, end).map(([s, e, token]) => ({
    start: s,
    end: e,
    color: colorByToken[token],
    priority: 30
  }));
}

// src/converters/derivative.ts
function compact(value) {
  return value.replace(/\s+/g, "");
}
function isDerivativePrefix(value) {
  const c = compact(value);
  return c.startsWith("\\frac{d}{d") || c.startsWith("\\dfrac{d}{d") || c.startsWith("\\tfrac{d}{d");
}
function isPrime(value) {
  return /^(?:[A-Za-z]|\\[A-Za-z]+)'/.test(value.trimStart());
}
function isNumeric(value) {
  const c = compact(value);
  if (/^[+-]?\d+(?:\.\d+)?$/.test(c)) {
    return true;
  }
  return /^\\(?:dfrac|tfrac|frac)\{[+-]?\d+(?:\.\d+)?\}\{[+-]?\d+(?:\.\d+)?\}$/.test(c);
}
function isOuterDerivative(value) {
  const c = compact(value);
  const prefixes = [
    "\\cos",
    "\\sin",
    "\\tan",
    "\\sec",
    "\\ln",
    "\\log",
    "\\sqrt",
    "\\frac",
    "\\dfrac",
    "\\tfrac",
    "e^"
  ];
  return prefixes.some((p) => c.startsWith(p)) || isPrime(c);
}
function hasAdditiveSeparator(value) {
  return /[+\-=<>]|\\(?:pm|mp|leq|geq|neq|approx|sim|equiv)(?![A-Za-z])/.test(value);
}
function isMultiplicativeGap(value) {
  return /^(?:\s|[·*]|\\(?:cdot|times|,|:|;|!|quad|qquad)(?![A-Za-z]))*$/.test(value);
}
function fractionArguments(body, operandStart, end) {
  const command = readCommand(body, operandStart, end);
  if (command === null || !["frac", "dfrac", "tfrac"].includes(command[0])) {
    return [];
  }
  const ranges = [];
  let index = command[1];
  for (let i = 0; i < 2; i++) {
    index = skipIgnorable(body, index, end);
    const groupEnd = readGroupEnd(body, index, end);
    if (groupEnd === null) {
      return [];
    }
    ranges.push([index + 1, groupEnd - 1]);
    index = groupEnd;
  }
  return ranges;
}
function rhsSpans(body, start, end, palette = COLORS) {
  end = end === void 0 ? body.length : end;
  const operands = findOperandSpans(body, start, end);
  const spans = [];
  let primeSeen = false;
  let previousEnd = start;
  for (let index = 0; index < operands.length; index++) {
    const operand = operands[index];
    if (hasAdditiveSeparator(body.slice(previousEnd, operand.start))) {
      primeSeen = false;
    }
    const value = body.slice(operand.start, operand.end);
    const comp = compact(value);
    const nextExists = index + 1 < operands.length;
    const multiplicativeGap = nextExists ? body.slice(operand.end, operands[index + 1].start) : "";
    const isCoeff = isNumeric(value) || nextExists && /^[A-Za-z]$/.test(comp) && isMultiplicativeGap(multiplicativeGap);
    let colorName;
    if (isCoeff) {
      colorName = "orange";
    } else if (isPrime(value)) {
      colorName = primeSeen ? "chain" : "derivative";
      primeSeen = true;
    } else if (primeSeen) {
      colorName = operand.kind === "symbol" ? "chain" : "main";
    } else {
      colorName = isOuterDerivative(value) ? "derivative" : "main";
    }
    let spanStart = operand.start;
    if (isNumeric(value)) {
      let sign = operand.start - 1;
      while (sign >= start && /\s/.test(body[sign])) {
        sign--;
      }
      if (sign >= start && (body[sign] === "+" || body[sign] === "-")) {
        let before = sign - 1;
        while (before >= start && /\s/.test(body[before])) {
          before--;
        }
        if (before < start || "=+-(".includes(body[before])) {
          spanStart = sign;
        }
      }
    }
    const primedMatch = value.match(/^[A-Za-z]+['’]+/);
    let productGroup = null;
    if (primedMatch) {
      const groupStart = skipIgnorable(
        body,
        operand.start + primedMatch[0].length,
        operand.end
      );
      const groupEnd = readGroupEnd(body, groupStart, operand.end);
      if (groupEnd !== null && (body.slice(groupStart + 1, groupEnd - 1).includes("+") || body.slice(groupStart + 1, groupEnd - 1).includes("-"))) {
        productGroup = [groupStart, operand.end];
      }
    }
    if (productGroup === null) {
      spans.push({
        start: spanStart,
        end: operand.end,
        color: palette[colorName],
        priority: 20
      });
    } else {
      spans.push(
        {
          start: spanStart,
          end: operand.start + primedMatch[0].length,
          color: palette[colorName],
          priority: 20
        },
        {
          start: productGroup[0],
          end: productGroup[1],
          color: palette.main,
          priority: 20
        }
      );
    }
    if (!isNumeric(value) && ["\\frac", "\\dfrac", "\\tfrac"].some((p) => value.trimStart().startsWith(p))) {
      for (const [innerStart, innerEnd] of fractionArguments(
        body,
        operand.start,
        operand.end
      )) {
        const innerSemantic = rhsSpans(body, innerStart, innerEnd, palette);
        const innerRelations = relationSpans(body, innerStart, innerEnd, palette);
        spans.push(
          ...innerRelations.filter(
            (rel) => !innerSemantic.some(
              (sem) => sem.start <= rel.start && rel.end <= sem.end
            )
          )
        );
        spans.push(...innerSemantic);
      }
    }
    previousEnd = operand.end;
  }
  return spans;
}
function convertDerivativeLine(source, palette = COLORS) {
  const block = parseMathBlock(source);
  if (block === null) {
    return null;
  }
  if (containsColorWrapper(block.body)) {
    return source;
  }
  const bodyStart = skipIgnorable(block.body, 0, block.body.length);
  const prefix = readOperand(block.body, bodyStart);
  if (prefix === null || !isDerivativePrefix(block.body.slice(prefix.start, prefix.end))) {
    return null;
  }
  const equality = firstEquality(block.body);
  if (equality === null || equality[0] <= prefix.end) {
    return null;
  }
  const [targetStart, targetEnd] = trimRange(block.body, prefix.end, equality[0]);
  let relations = relationSpans(block.body, 0, void 0, palette);
  const operators = collectOperatorSpans(block.body, 0, void 0, palette);
  let target = null;
  if (targetStart < targetEnd) {
    target = {
      start: targetStart,
      end: targetEnd,
      color: palette.main,
      priority: 20
    };
  }
  const semanticRhs = rhsSpans(block.body, equality[1], void 0, palette);
  relations = relations.filter(
    (span) => !semanticRhs.some((sem) => sem.start <= span.start && span.end <= sem.end)
  );
  const spans = [...relations, ...operators, ...semanticRhs];
  if (target !== null) {
    spans.push(target);
  }
  return block.render(applyColorSpans(block.body, spans));
}

// src/parsers/braket.ts
function collectBraKetDelimiterSpans(body, palette = COLORS, delimColor = palette.orange || "#e0af68") {
  const spans = [];
  const braketRegex = /\\langle\s*([^<|>]+?)\s*\|\s*([^<|>]+?)(?:\s*\|\s*([^<|>]+?))?\s*\\rangle/g;
  let match;
  while ((match = braketRegex.exec(body)) !== null) {
    const full = match[0];
    const langleIdx = match.index;
    const langleEnd = langleIdx + "\\langle".length;
    const rangleIdx = match.index + full.lastIndexOf("\\rangle");
    const rangleEnd = rangleIdx + "\\rangle".length;
    spans.push({ start: langleIdx, end: langleEnd, color: delimColor, priority: 25 });
    spans.push({ start: rangleIdx, end: rangleEnd, color: delimColor, priority: 25 });
    let barSearch = match.index;
    while ((barSearch = body.indexOf("|", barSearch)) !== -1 && barSearch < rangleIdx) {
      spans.push({ start: barSearch, end: barSearch + 1, color: delimColor, priority: 25 });
      barSearch++;
    }
  }
  const ketRegex = /(?:\||\\vert)\s*([^<|>]+?)\s*\\rangle/g;
  while ((match = ketRegex.exec(body)) !== null) {
    const full = match[0];
    const barIdx = match.index;
    const barEnd = barIdx + (full.startsWith("\\vert") ? 5 : 1);
    const rangleIdx = match.index + full.lastIndexOf("\\rangle");
    const rangleEnd = rangleIdx + 7;
    if (!spans.some((s) => s.start === barIdx)) {
      spans.push({ start: barIdx, end: barEnd, color: delimColor, priority: 25 });
      spans.push({ start: rangleIdx, end: rangleEnd, color: delimColor, priority: 25 });
    }
  }
  const braRegex = /\\langle\s*([^<|>]+?)\s*(?:\||\\vert)/g;
  while ((match = braRegex.exec(body)) !== null) {
    const full = match[0];
    const langleIdx = match.index;
    const langleEnd = langleIdx + 7;
    const barIdx = match.index + full.search(/(?:\||\\vert)/);
    const barEnd = barIdx + (full.endsWith("\\vert") ? 5 : 1);
    if (!spans.some((s) => s.start === langleIdx)) {
      spans.push({ start: langleIdx, end: langleEnd, color: delimColor, priority: 25 });
      spans.push({ start: barIdx, end: barEnd, color: delimColor, priority: 25 });
    }
  }
  return spans.sort((a, b) => a.start - b.start);
}

// src/parsers/delimiters.ts
function skipWhitespace2(text, start) {
  while (start < text.length && /\s/.test(text[start])) {
    start++;
  }
  return start;
}
function skipComment2(text, start) {
  let index = start + 1;
  while (index < text.length && text[index] !== "\r" && text[index] !== "\n") {
    index++;
  }
  if (index < text.length && text[index] === "\r" && index + 1 < text.length && text[index + 1] === "\n") {
    return index + 2;
  }
  return Math.min(index + 1, text.length);
}
function findDelimiterPairs(text) {
  const pairs = [];
  const stack = [];
  let index = 0;
  while (index < text.length) {
    if (text[index] === "%") {
      index = skipComment2(text, index);
      continue;
    }
    if (text.startsWith("\\left", index)) {
      const afterLeft = skipWhitespace2(text, index + 5);
      const delimMatch = text.slice(afterLeft).match(/^(\(|\)|\[|\]|\\\{|\\\}|\\langle|\\rangle|\||\\\||\.)/);
      if (delimMatch) {
        const delimStr = delimMatch[0];
        const delimEnd = afterLeft + delimStr.length;
        const type = getDelimiterType(delimStr);
        const depth = stack.length;
        stack.push({
          item: {
            type,
            start: index,
            end: delimEnd,
            isLeftRight: true
          },
          depth
        });
        index = delimEnd;
        continue;
      }
    }
    if (text.startsWith("\\right", index)) {
      const afterRight = skipWhitespace2(text, index + 6);
      const delimMatch = text.slice(afterRight).match(/^(\(|\)|\[|\]|\\\{|\\\}|\\langle|\\rangle|\||\\\||\.)/);
      if (delimMatch) {
        const delimStr = delimMatch[0];
        const delimEnd = afterRight + delimStr.length;
        const type = getDelimiterType(delimStr);
        let matchIdx = -1;
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i].item.isLeftRight) {
            matchIdx = i;
            break;
          }
        }
        if (matchIdx !== -1) {
          const matched = stack.splice(matchIdx, 1)[0];
          pairs.push({
            open: matched.item,
            close: {
              type,
              start: index,
              end: delimEnd,
              isLeftRight: true
            },
            depth: matched.depth
          });
        }
        index = delimEnd;
        continue;
      }
    }
    const sizedOpenMatch = text.slice(index).match(/^(\\(?:big|Big|bigg|Bigg)l)(\(|\)|\[|\]|\\\{|\\\}|\\langle|\\rangle|\||\\\|)/);
    if (sizedOpenMatch) {
      const fullStr = sizedOpenMatch[0];
      const delimStr = sizedOpenMatch[2];
      const type = getDelimiterType(delimStr);
      const depth = stack.length;
      stack.push({
        item: {
          type,
          start: index,
          end: index + fullStr.length,
          isLeftRight: false
        },
        depth
      });
      index += fullStr.length;
      continue;
    }
    const sizedCloseMatch = text.slice(index).match(/^(\\(?:big|Big|bigg|Bigg)r)(\(|\)|\[|\]|\\\{|\\\}|\\langle|\\rangle|\||\\\|)/);
    if (sizedCloseMatch) {
      const fullStr = sizedCloseMatch[0];
      const delimStr = sizedCloseMatch[2];
      const type = getDelimiterType(delimStr);
      let matchIdx = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (!stack[i].item.isLeftRight && stack[i].item.type === type) {
          matchIdx = i;
          break;
        }
      }
      if (matchIdx !== -1) {
        const matched = stack.splice(matchIdx, 1)[0];
        pairs.push({
          open: matched.item,
          close: {
            type,
            start: index,
            end: index + fullStr.length,
            isLeftRight: false
          },
          depth: matched.depth
        });
      }
      index += fullStr.length;
      continue;
    }
    if (text.startsWith("\\{", index)) {
      const depth = stack.length;
      stack.push({
        item: {
          type: "brace",
          start: index,
          end: index + 2,
          isLeftRight: false
        },
        depth
      });
      index += 2;
      continue;
    }
    if (text.startsWith("\\}", index)) {
      let matchIdx = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (!stack[i].item.isLeftRight && stack[i].item.type === "brace") {
          matchIdx = i;
          break;
        }
      }
      if (matchIdx !== -1) {
        const matched = stack.splice(matchIdx, 1)[0];
        pairs.push({
          open: matched.item,
          close: {
            type: "brace",
            start: index,
            end: index + 2,
            isLeftRight: false
          },
          depth: matched.depth
        });
      }
      index += 2;
      continue;
    }
    if (text[index] === "(" || text[index] === "[") {
      const type = text[index] === "(" ? "paren" : "bracket";
      const depth = stack.length;
      stack.push({
        item: {
          type,
          start: index,
          end: index + 1,
          isLeftRight: false
        },
        depth
      });
      index += 1;
      continue;
    }
    if (text[index] === ")" || text[index] === "]") {
      const type = text[index] === ")" ? "paren" : "bracket";
      let matchIdx = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (!stack[i].item.isLeftRight && stack[i].item.type === type) {
          matchIdx = i;
          break;
        }
      }
      if (matchIdx !== -1) {
        const matched = stack.splice(matchIdx, 1)[0];
        pairs.push({
          open: matched.item,
          close: {
            type,
            start: index,
            end: index + 1,
            isLeftRight: false
          },
          depth: matched.depth
        });
      }
      index += 1;
      continue;
    }
    if (text[index] === "\\") {
      const cmdMatch = text.slice(index).match(/^(\\[A-Za-z]+|\\.)/);
      if (cmdMatch) {
        index += cmdMatch[0].length;
        continue;
      }
    }
    index++;
  }
  return pairs;
}
function getDelimiterType(str) {
  if (str === "(" || str === ")")
    return "paren";
  if (str === "[" || str === "]")
    return "bracket";
  if (str === "\\{" || str === "\\}")
    return "brace";
  if (str === "\\langle" || str === "\\rangle")
    return "angle";
  if (str === "|" || str === "\\|")
    return "pipe";
  return "other";
}
function collectDelimiterSpans(text, options) {
  const pairs = findDelimiterPairs(text);
  const palette = options?.palette || RAINBOW_DELIMITER_COLORS;
  const forLatexWrap = options?.forLatexWrap ?? false;
  const spans = [];
  for (const pair of pairs) {
    const color = palette[pair.depth % palette.length];
    if (forLatexWrap && pair.open.isLeftRight) {
      spans.push({
        start: pair.open.start,
        end: pair.close.end,
        color,
        priority: 24
      });
    } else {
      spans.push({
        start: pair.open.start,
        end: pair.open.end,
        color,
        priority: 25
      });
      spans.push({
        start: pair.close.start,
        end: pair.close.end,
        color,
        priority: 25
      });
    }
  }
  return spans.sort((a, b) => a.start - b.start);
}

// src/parsers/differentials.ts
function findDifferentialSpans(body) {
  const spans = [];
  function addSpan(start, end, text, kind) {
    if (start >= end)
      return;
    if (!spans.some((s) => start < s.end && end > s.start)) {
      spans.push({ start, end, text, kind });
    }
  }
  const derivFracRegex = /\\frac\s*\{\s*(?:d|\\partial|\\mathrm\{d\})(?:\^\{?\d+\}?)?\s*(?:[a-zA-Z\\]+)?\s*\}\s*\{\s*(?:d|\\partial|\\mathrm\{d\})\s*(?:[a-zA-Z]|\\\\[a-zA-Z]+)(?:\^\{?\d+\}?)?(?:\s*(?:d|\\partial|\\mathrm\{d\})\s*(?:[a-zA-Z]|\\\\[a-zA-Z]+))*\s*\}/g;
  let match;
  while ((match = derivFracRegex.exec(body)) !== null) {
    addSpan(match.index, match.index + match[0].length, match[0], "derivative_fraction");
  }
  const diffRegex = /(?:^|[\s+\-=*({]|\[|\\,|\\:|\\;|\\quad|\\qquad|~)(\s*(?:d|\\partial|\\mathrm\{d\}|\\delta)\s*(?:\\[a-zA-Z]+|[a-zA-Z])(?![a-zA-Z0-9_({])(?:\^\{?\d+\}?)?)/g;
  while ((match = diffRegex.exec(body)) !== null) {
    const fullMatch = match[0];
    const diffGroup = match[1];
    const diffStart = match.index + (fullMatch.length - diffGroup.length);
    const dOffset = diffGroup.search(/(?:d|\\partial|\\mathrm\{d\}|\\delta)/);
    const actualStart = diffStart + dOffset;
    const diffText = diffGroup.slice(dOffset);
    const diffEnd = actualStart + diffText.length;
    addSpan(actualStart, diffEnd, diffText, "differential");
  }
  return spans.sort((a, b) => a.start - b.start);
}
function collectDifferentialSpans(body, palette = COLORS, diffSpans) {
  const diffs = diffSpans || findDifferentialSpans(body);
  return diffs.map((d) => ({
    start: d.start,
    end: d.end,
    color: palette.derivative || "#bb9af7",
    priority: 24
  }));
}

// src/parsers/dimensionless.ts
var COMMON_DIMENSIONLESS_NUMBERS = [
  "Re",
  // Reynolds number
  "Ma",
  // Mach number
  "Pr",
  // Prandtl number
  "Nu",
  // Nusselt number
  "Kn",
  // Knudsen number
  "Sc",
  // Schmidt number
  "Pe",
  // Péclet number
  "Gr",
  // Grashof number
  "Ra",
  // Rayleigh number
  "We",
  // Weber number
  "Fr",
  // Froude number
  "St",
  // Strouhal number
  "Bi",
  // Biot number
  "Fo"
  // Fourier number
];
function findDimensionlessSpans(body) {
  const spans = [];
  function addSpan(start, end, text) {
    if (start >= end)
      return;
    if (!spans.some((s) => start < s.end && end > s.start)) {
      spans.push({ start, end, text });
    }
  }
  const list = COMMON_DIMENSIONLESS_NUMBERS.join("|");
  const textRegex = new RegExp(
    `\\\\(?:text|mathrm)\\s*\\{\\s*(${list})\\s*\\}`,
    "g"
  );
  let match;
  while ((match = textRegex.exec(body)) !== null) {
    addSpan(match.index, match.index + match[0].length, match[0]);
  }
  const bareRegex = new RegExp(
    `(?:^|[^\\\\a-zA-Z])(${list})(?![a-zA-Z])`,
    "g"
  );
  while ((match = bareRegex.exec(body)) !== null) {
    const symbol = match[1];
    const symStart = match.index + (match[0].length - symbol.length);
    const symEnd = symStart + symbol.length;
    addSpan(symStart, symEnd, symbol);
  }
  return spans.sort((a, b) => a.start - b.start);
}
function collectDimensionlessSpans(body, palette = COLORS, dimSpans) {
  const spans = dimSpans || findDimensionlessSpans(body);
  return spans.map((s) => ({
    start: s.start,
    end: s.end,
    color: palette.orange || "#e0af68",
    priority: 22
  }));
}

// src/parsers/math_parser.ts
function readCommand2(text, start, end) {
  if (start >= end || text[start] !== "\\")
    return null;
  const match = text.slice(start, end).match(/^(\\[A-Za-z]+|\\.)/);
  if (!match)
    return null;
  return [match[0], start + match[0].length];
}
function skipWhitespace3(text, start, end) {
  while (start < end && /\s/.test(text[start])) {
    start++;
  }
  return start;
}
function skipComment3(text, start, end) {
  let index = start + 1;
  while (index < end && text[index] !== "\r" && text[index] !== "\n") {
    index++;
  }
  if (index < end && text[index] === "\r" && index + 1 < end && text[index + 1] === "\n") {
    return index + 2;
  }
  return Math.min(index + 1, end);
}
function readDelimiter(text, start, end) {
  if (start >= end)
    return null;
  if (text[start] !== "\\") {
    return [text[start], start + 1];
  }
  return readCommand2(text, start, end);
}
function skipOpaqueArgument(text, start, end) {
  start = skipWhitespace3(text, start, end);
  const group = readBraced(text, start);
  return group !== null && group[1] <= end ? group[1] : start;
}
function readLeftRightGroup(text, start, end) {
  const command = readCommand2(text, start, end);
  if (command === null || command[0] !== "\\left") {
    return null;
  }
  const delimiterData = readDelimiter(
    text,
    skipWhitespace3(text, command[1], end),
    end
  );
  if (delimiterData === null) {
    return null;
  }
  const [opening, contentStart] = delimiterData;
  let depth = 1;
  let index = contentStart;
  while (index < end) {
    if (text[index] === "%") {
      index = skipComment3(text, index, end);
      continue;
    }
    if (text[index] === "{") {
      const group = readBraced(text, index);
      if (group === null || group[1] > end) {
        return null;
      }
      index = group[1];
      continue;
    }
    if (text[index] !== "\\") {
      index++;
      continue;
    }
    const nestedCommand = readCommand2(text, index, end);
    if (nestedCommand === null) {
      index++;
      continue;
    }
    const [name, commandEnd] = nestedCommand;
    if (name === "\\left") {
      const delimiter = readDelimiter(
        text,
        skipWhitespace3(text, commandEnd, end),
        end
      );
      if (delimiter !== null) {
        depth++;
        index = delimiter[1];
        continue;
      }
    } else if (name === "\\right") {
      const delimiter = readDelimiter(
        text,
        skipWhitespace3(text, commandEnd, end),
        end
      );
      if (delimiter !== null) {
        depth--;
        if (depth === 0) {
          return [opening, contentStart, index, delimiter[1]];
        }
        index = delimiter[1];
        continue;
      }
    } else {
      const operand = readOperand(text, index, end);
      if (operand !== null && operand.kind === "opaque") {
        index = operand.end;
        continue;
      }
    }
    if (OPAQUE_MACROS.has(name.slice(1))) {
      const opaqueEnd = skipOpaqueArgument(text, commandEnd, end);
      if (opaqueEnd !== commandEnd) {
        index = opaqueEnd;
        continue;
      }
    }
    index = commandEnd;
  }
  return null;
}
function readPlainParentheses(text, start, end) {
  let depth = 1;
  let index = start + 1;
  while (index < end) {
    if (text[index] === "%") {
      index = skipComment3(text, index, end);
      continue;
    }
    if (text[index] === "{") {
      const group = readBraced(text, index);
      if (group === null || group[1] > end) {
        return null;
      }
      index = group[1];
      continue;
    }
    if (text[index] === "\\") {
      const operand = readOperand(text, index, end);
      if (operand !== null && operand.kind === "opaque") {
        index = operand.end;
        continue;
      }
      const command = readCommand2(text, index, end);
      if (command === null) {
        index++;
        continue;
      }
      const [name, commandEnd] = command;
      if (name === "\\left") {
        const group = readLeftRightGroup(text, index, end);
        if (group !== null) {
          index = group[3];
          continue;
        }
      } else if (OPAQUE_MACROS.has(name.slice(1))) {
        const opaqueEnd = skipOpaqueArgument(text, commandEnd, end);
        if (opaqueEnd !== commandEnd) {
          index = opaqueEnd;
          continue;
        }
      }
      index = commandEnd;
      continue;
    }
    if (text[index] === "(") {
      depth++;
    } else if (text[index] === ")") {
      depth--;
      if (depth === 0) {
        return [start + 1, index, index + 1];
      }
    }
    index++;
  }
  return null;
}
function readFunctionArguments(text, start, end) {
  if (start >= end)
    return null;
  if (text[start] === "(") {
    return readPlainParentheses(text, start, end);
  }
  const group = readLeftRightGroup(text, start, end);
  if (group === null || group[0] !== "(" && group[0] !== "\\(") {
    return null;
  }
  return [group[1], group[2], group[3]];
}
function collectSemanticSpansInternal(text, start, end, depth, spans, errors) {
  let index = start;
  while (index < end) {
    if (text[index] === "%") {
      index = skipComment3(text, index, end);
      continue;
    }
    if (text[index] === "\\") {
      const operand = readOperand(text, index, end);
      if (operand !== null && operand.kind === "opaque") {
        index = operand.end;
        continue;
      }
      const command = readCommand2(text, index, end);
      if (command !== null) {
        const [name, commandEnd] = command;
        if (OPAQUE_MACROS.has(name.slice(1))) {
          const opaqueEnd = skipOpaqueArgument(text, commandEnd, end);
          if (opaqueEnd !== commandEnd) {
            index = opaqueEnd;
            continue;
          }
        }
        index = commandEnd;
        continue;
      }
    }
    const nameMatch = text.slice(index, end).match(/^[A-Za-z][A-Za-z0-9]*(?:')*/);
    if (nameMatch) {
      const name = nameMatch[0];
      const nameEnd = index + name.length;
      const args = readFunctionArguments(text, nameEnd, end);
      if (args !== null) {
        const [argumentStart, argumentEnd, callEnd] = args;
        spans.push({
          kind: "function",
          value: name,
          start: index,
          end: nameEnd,
          depth
        });
        collectSemanticSpansInternal(
          text,
          argumentStart,
          argumentEnd,
          depth + 1,
          spans,
          errors
        );
        index = callEnd;
        continue;
      }
      if (nameEnd < end && text[nameEnd] === "(") {
        errors.push(`unclosed function call after '${name}'`);
      }
      index = nameEnd;
      continue;
    }
    if (depth) {
      const numberMatch = text.slice(index, end).match(/^\d+(?:\.\d+)?/);
      if (numberMatch) {
        const num = numberMatch[0];
        spans.push({
          kind: "constant",
          value: num,
          start: index,
          end: index + num.length,
          depth
        });
        index = index + num.length;
        continue;
      }
    }
    index++;
  }
}
function findSemanticSpans(source) {
  const spans = [];
  const errors = [];
  collectSemanticSpansInternal(source, 0, source.length, 0, spans, errors);
  return [spans, errors.length > 0 ? errors[0] : null];
}

// src/parsers/units.ts
var SI_UNITS = "m|s|g|Hz|N|Pa|J|W|C|V|F|T|H|mol|L|l|K|bar|atm|torr|eV|cal|rad|deg|\\\\Omega|dB|bps|B|\u03A9";
var PREFIXES = "k|M|G|T|c|m|n|p|f|d|da|\\\\mu|\xB5";
var SAFE_MICRO_UNITS = "m|s|g|mol|Hz|Pa|bar|rad|\\\\Omega|L|l";
var AMBIGUOUS_MICRO_UNITS = "N|A|V|F|H|W|J|C";
function findUnitSpans(body) {
  const spans = [];
  function addSpan(start, end, text) {
    if (start >= end)
      return;
    if (!spans.some((s) => start < s.end && end > s.start)) {
      spans.push({ start, end, text });
    }
  }
  const microTextRegex = /\\mu\s*(?:\\(?:text|mathrm)\s*\{\s*([A-Za-z°℃%Ωμ/^0-9\s.\\-]+?)\s*\})(?:\^\{?-?\d+\}?)?/g;
  let match;
  while ((match = microTextRegex.exec(body)) !== null) {
    addSpan(match.index, match.index + match[0].length, match[0]);
  }
  const safeMicroRegex = new RegExp(
    `\\\\mu\\s*(${SAFE_MICRO_UNITS})(?![A-Za-z0-9_])(?:\\^\\{?-?\\d+\\}?)?`,
    "g"
  );
  while ((match = safeMicroRegex.exec(body)) !== null) {
    addSpan(match.index, match.index + match[0].length, match[0]);
  }
  const degRegex = /\^\s*\\circ\s*(?:\\(?:text|mathrm)\s*\{[A-Za-z]+\}|[A-Za-z]+)/g;
  while ((match = degRegex.exec(body)) !== null) {
    addSpan(match.index, match.index + match[0].length, match[0]);
  }
  const numberUnitRegex = new RegExp(
    `(?:^|[^A-Za-z0-9_])(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:\\s*(?:\\\\times|\\\\cdot|\xB7|\\*)\\s*10\\^\\{?[+-]?\\d+\\}?|\\s*[eE][+-]?\\d+)?(?:\\s*|\\\\,|\\\\:|\\\\;|\\\\quad|\\\\qquad|~)*(\\\\(?:text|mathrm)\\s*\\{[^}]+\\}(?:\\^\\{?-?\\d+\\}?)?|\\\\mu\\s*(?:${SAFE_MICRO_UNITS}|${AMBIGUOUS_MICRO_UNITS})(?![A-Za-z0-9_])(?:\\^\\{?-?\\d+\\}?)?|(?:(?:${PREFIXES})?(?:${SI_UNITS}))(?:\\/(?:(?:${PREFIXES})?(?:${SI_UNITS})))*(?:\\^\\{?-?\\d+\\}?)?(?![A-Za-z0-9_({]))`,
    "g"
  );
  while ((match = numberUnitRegex.exec(body)) !== null) {
    const fullMatch = match[0];
    const unitPart = match[1];
    const unitOffset = fullMatch.lastIndexOf(unitPart);
    const unitStart = match.index + unitOffset;
    const unitEnd = unitStart + unitPart.length;
    addSpan(unitStart, unitEnd, unitPart);
  }
  const textUnitRegex = /\\(?:text|mathrm)\s*\{\s*([A-Za-z°℃%Ωμ/^0-9\s.\\-]+?)\s*\}(?:\^\{?-?\d+\}?)?/g;
  while ((match = textUnitRegex.exec(body)) !== null) {
    const inner = match[1].trim();
    const isUnit = new RegExp(
      `^(?:${PREFIXES})?(?:${SI_UNITS})(?:\\/(?:${PREFIXES})?(?:${SI_UNITS}))*(?:\\^\\{?-?\\d+\\}?)?$`,
      "i"
    ).test(inner);
    if (isUnit) {
      addSpan(match.index, match.index + match[0].length, match[0]);
    }
  }
  return spans.sort((a, b) => a.start - b.start);
}
function collectUnitSpans(body, palette = COLORS, unitSpans) {
  const units = unitSpans || findUnitSpans(body);
  return units.map((u) => ({
    start: u.start,
    end: u.end,
    color: palette.unit || "#73daca",
    priority: 25
  }));
}

// src/parsers/taxonomy.ts
function skipComment4(text, start) {
  let index = start + 1;
  while (index < text.length && text[index] !== "\r" && text[index] !== "\n") {
    index++;
  }
  if (index < text.length && text[index] === "\r" && index + 1 < text.length && text[index + 1] === "\n") {
    return index + 2;
  }
  return Math.min(index + 1, text.length);
}
function collectTaxonomySpans(body, palette = COLORS, unitSpans, diffSpans, dimSpans) {
  const units = unitSpans || findUnitSpans(body);
  const diffs = diffSpans || findDifferentialSpans(body);
  const dims = dimSpans || findDimensionlessSpans(body);
  const spans = [];
  let index = 0;
  const indexPattern = /(\\(?:sum|prod|coprod|bigcup|bigcap|lim|inf|sup))_\{?\s*([A-Za-z])\s*(?:=|\to|\\to)/g;
  let match;
  while ((match = indexPattern.exec(body)) !== null) {
    const operatorStr = match[1];
    const varName = match[2];
    const varOffset = match[0].indexOf(varName, operatorStr.length);
    if (varOffset !== -1) {
      const varStart = match.index + varOffset;
      spans.push({
        start: varStart,
        end: varStart + varName.length,
        color: palette.chain,
        // Bound index color
        priority: 23
      });
    }
  }
  while (index < body.length) {
    if (body[index] === "%") {
      index = skipComment4(body, index);
      continue;
    }
    const existingColor = readColorCommand(body, index);
    if (existingColor !== null) {
      index = existingColor[1];
      continue;
    }
    const operand = readOperand(body, index);
    if (operand !== null && operand.kind === "opaque") {
      index = operand.end;
      continue;
    }
    const inUnit = units.find((u) => u.start <= index && index < u.end);
    if (inUnit) {
      index = inUnit.end;
      continue;
    }
    const inDiff = diffs.find((d) => d.start <= index && index < d.end);
    if (inDiff) {
      index = inDiff.end;
      continue;
    }
    const inDim = dims.find((d) => d.start <= index && index < d.end);
    if (inDim) {
      index = inDim.end;
      continue;
    }
    if (body[index] === "\\") {
      const match2 = body.slice(index).match(/^(\\[A-Za-z]+|\\.)/);
      if (match2) {
        const name = match2[0];
        const cmdEnd = index + name.length;
        if (OPAQUE_MACROS.has(name.slice(1))) {
          const braced = readBraced(body, cmdEnd);
          if (braced !== null) {
            index = braced[1];
            continue;
          }
        }
        if (name === "\\dot" || name === "\\ddot" || name === "\\dddot") {
          let targetStart = cmdEnd;
          while (targetStart < body.length && /\s/.test(body[targetStart])) {
            targetStart++;
          }
          if (targetStart < body.length) {
            let targetEnd = targetStart + 1;
            if (body[targetStart] === "{") {
              const braced = readBraced(body, targetStart);
              if (braced)
                targetEnd = braced[1];
            } else {
              const letMatch = body.slice(targetStart).match(/^[a-zA-Z](')*/);
              if (letMatch)
                targetEnd = targetStart + letMatch[0].length;
            }
            spans.push({
              start: index,
              end: targetEnd,
              color: palette.derivative,
              priority: 22
            });
            index = targetEnd;
            continue;
          }
        }
        if (MATH_CONSTANTS.has(name)) {
          spans.push({
            start: index,
            end: cmdEnd,
            color: palette.orange,
            priority: 22
          });
          index = cmdEnd;
          continue;
        }
        if (MATH_FUNCTIONS.has(name)) {
          spans.push({
            start: index,
            end: cmdEnd,
            color: palette.main,
            priority: 22
          });
          index = cmdEnd;
          continue;
        }
        if (MATH_PARAMETERS.has(name)) {
          spans.push({
            start: index,
            end: cmdEnd,
            color: palette.parameter || palette.derivative,
            priority: 20
          });
          index = cmdEnd;
          continue;
        }
        index = cmdEnd;
        continue;
      }
    }
    index++;
  }
  return spans;
}

// src/parsers/variable_hash.ts
function skipComment5(text, start) {
  let index = start + 1;
  while (index < text.length && text[index] !== "\r" && text[index] !== "\n") {
    index++;
  }
  if (index < text.length && text[index] === "\r" && index + 1 < text.length && text[index + 1] === "\n") {
    return index + 2;
  }
  return Math.min(index + 1, text.length);
}
function collectVariableSpans(body, palette = VARIABLE_HASH_PALETTE, unitSpans, diffSpans, dimSpans) {
  const units = unitSpans || findUnitSpans(body);
  const diffs = diffSpans || findDifferentialSpans(body);
  const dims = dimSpans || findDimensionlessSpans(body);
  const spans = [];
  let index = 0;
  while (index < body.length) {
    if (body[index] === "%") {
      index = skipComment5(body, index);
      continue;
    }
    const existingColor = readColorCommand(body, index);
    if (existingColor !== null) {
      index = existingColor[1];
      continue;
    }
    const operand = readOperand(body, index);
    if (operand !== null && operand.kind === "opaque") {
      index = operand.end;
      continue;
    }
    const inUnit = units.find((u) => u.start <= index && index < u.end);
    if (inUnit) {
      index = inUnit.end;
      continue;
    }
    const inDiff = diffs.find((d) => d.start <= index && index < d.end);
    if (inDiff) {
      index = inDiff.end;
      continue;
    }
    const inDim = dims.find((d) => d.start <= index && index < d.end);
    if (inDim) {
      index = inDim.end;
      continue;
    }
    if (body[index] === "\\") {
      const match = body.slice(index).match(/^(\\[A-Za-z]+|\\.)/);
      if (match) {
        const cmdName = match[0];
        const cmdEnd = index + cmdName.length;
        if (MATH_ACCENTS.has(cmdName)) {
          let targetStart = cmdEnd;
          while (targetStart < body.length && /\s/.test(body[targetStart])) {
            targetStart++;
          }
          if (targetStart < body.length) {
            if (body[targetStart] === "{") {
              const braced = readBraced(body, targetStart);
              if (braced) {
                const inner = braced[0];
                const baseMatch = inner.match(/[a-zA-Z]/);
                const baseLetter = baseMatch ? baseMatch[0] : "x";
                const color = hashStringToColor(baseLetter, palette);
                spans.push({
                  start: index,
                  end: braced[1],
                  color,
                  priority: 15
                });
                index = braced[1];
                continue;
              }
            } else {
              const letterMatch = body.slice(targetStart).match(/^[a-zA-Z](')*/);
              if (letterMatch) {
                const fullVar = letterMatch[0];
                const baseLetter = fullVar.replace(/'/g, "");
                const color = hashStringToColor(baseLetter, palette);
                spans.push({
                  start: index,
                  end: targetStart + fullVar.length,
                  color,
                  priority: 15
                });
                index = targetStart + fullVar.length;
                continue;
              }
            }
          }
        }
        if (OPAQUE_MACROS.has(cmdName.slice(1))) {
          const braced = readBraced(body, cmdEnd);
          if (braced !== null) {
            index = braced[1];
            continue;
          }
        }
        index = cmdEnd;
        continue;
      }
    }
    const varMatch = body.slice(index).match(/^[a-zA-Z](')*/);
    if (varMatch) {
      const fullVar = varMatch[0];
      const baseLetter = fullVar.replace(/'/g, "");
      const varEnd = index + fullVar.length;
      const afterVar = body.slice(varEnd).trimStart();
      const isFunction = afterVar.startsWith("(") || afterVar.startsWith("\\left(");
      if (!isFunction) {
        const color = hashStringToColor(baseLetter, palette);
        spans.push({
          start: index,
          end: varEnd,
          color,
          priority: 15
        });
      }
      index = varEnd;
      continue;
    }
    index++;
  }
  return spans;
}

// src/converters/generic.ts
var FUNCTION_COLOR_NAMES = [
  "main",
  "derivative",
  "chain"
];
function collectFunctionSpans(body, palette = COLORS) {
  const [semantic] = findSemanticSpans(body);
  const spans = [];
  for (const item of semantic) {
    let colorName;
    if (item.kind === "function") {
      colorName = FUNCTION_COLOR_NAMES[Math.min(item.depth, 2)];
    } else if (item.kind === "constant") {
      colorName = "orange";
    } else {
      continue;
    }
    spans.push({
      start: item.start,
      end: item.end,
      color: palette[colorName],
      priority: 20
    });
  }
  return spans;
}
function colorLatexBody(body, palette = COLORS, options) {
  if (containsColorWrapper(body)) {
    return body;
  }
  const unitSpans = findUnitSpans(body);
  const diffSpans = findDifferentialSpans(body);
  const dimSpans = findDimensionlessSpans(body);
  const spans = [
    ...collectFunctionSpans(body, palette),
    ...collectScannerSpans(body, palette)
  ];
  if (options?.colorUnits !== false) {
    spans.push(...collectUnitSpans(body, palette, unitSpans));
  }
  if (options?.colorDifferentials !== false) {
    spans.push(...collectDifferentialSpans(body, palette, diffSpans));
  }
  if (options?.colorDimensionless !== false) {
    spans.push(...collectDimensionlessSpans(body, palette, dimSpans));
  }
  if (options?.colorBraKet !== false) {
    spans.push(...collectBraKetDelimiterSpans(body, palette));
  }
  if (options?.rainbowDelimiters) {
    spans.push(...collectDelimiterSpans(body, { forLatexWrap: true }));
  }
  if (options?.enableTaxonomy) {
    spans.push(...collectTaxonomySpans(body, palette, unitSpans, diffSpans, dimSpans));
  }
  if (options?.variableDataFlow) {
    spans.push(...collectVariableSpans(body, void 0, unitSpans, diffSpans, dimSpans));
  }
  return applyColorSpans(body, spans);
}

// src/converters/matrix.ts
var MATRIX_COMMAND_RE = /\\(?:mathbf|mathcal|nabla|det|tr|Tr|trace|Vert|lVert)(?![A-Za-z])|\\\|(?![A-Za-z])|\\operatorname\s*\{\s*tr\s*\}/;
var MATRIX_ENV_RE = /\\begin\s*\{\s*(?:Bmatrix|Vmatrix|array|bmatrix|matrix|pmatrix|smallmatrix|vmatrix)\s*\}/;
var NUMBER_RE = /^[+-]?\d+(?:\.\d+)?$/;
function structuralSource(body) {
  const visible = body.split("");
  let index = 0;
  while (index < body.length) {
    if (body[index] === "%") {
      let end = index + 1;
      while (end < body.length && body[end] !== "\r" && body[end] !== "\n") {
        visible[end] = " ";
        end++;
      }
      visible[index] = " ";
      index = end;
      continue;
    }
    const operand = readOperand(body, index);
    if (operand !== null && operand.kind === "opaque") {
      for (let position = operand.start; position < operand.end; position++) {
        if (visible[position] !== "\r" && visible[position] !== "\n") {
          visible[position] = " ";
        }
      }
      index = operand.end;
      continue;
    }
    index++;
  }
  return visible.join("");
}
function isMatrixExpression(body) {
  const structural = structuralSource(body);
  const operands = findOperandSpans(structural);
  return MATRIX_COMMAND_RE.test(structural) || MATRIX_ENV_RE.test(structural) || operands.some(
    (operand) => operand.kind === "matrix" || operand.kind === "symbol" && operandText(structural, operand).includes("_")
  );
}
function operandColorSpans(body, operands, names, palette = COLORS) {
  const spans = [];
  let semanticIndex = 0;
  for (const operand of operands) {
    const value = operandText(body, operand).replace(/\s+/g, "");
    let name;
    if (NUMBER_RE.test(value)) {
      name = "orange";
    } else {
      name = names[Math.min(semanticIndex, names.length - 1)];
      semanticIndex++;
    }
    spans.push({
      start: operand.start,
      end: operand.end,
      color: palette[name],
      priority: 20
    });
  }
  return spans;
}
function convertMatrixBlock(source, palette = COLORS) {
  const block = parseMathBlock(source);
  if (block === null || !isMatrixExpression(block.body)) {
    return null;
  }
  if (containsColorWrapper(block.body)) {
    return source;
  }
  const equality = firstEquality(block.body);
  if (equality === null) {
    return null;
  }
  const lhs = findOperandSpans(block.body, 0, equality[0]);
  const rhs = findOperandSpans(block.body, equality[1]);
  if (lhs.length === 0 || rhs.length === 0) {
    return null;
  }
  const lhsFirst = lhs[0].start < block.body.length ? operandText(block.body, lhs[0]).replace(/\s+/g, "") : "";
  let lhsColors;
  if (lhs.length === 1) {
    lhsColors = lhsFirst.startsWith("\\det") || lhsFirst.startsWith("\\operatorname{tr}") ? ["upper"] : ["main"];
  } else if (lhsFirst.startsWith("\\frac{\\partial}") || lhsFirst.startsWith("\\nabla")) {
    lhsColors = ["upper", "main"];
  } else {
    lhsColors = ["upper", "chain", "orange"];
  }
  const lhsText = block.body.slice(0, equality[0]).replace(/\s+/g, "");
  let rhsColors;
  if (lhsFirst.startsWith("\\frac{\\partial}")) {
    rhsColors = ["chain", "main"];
  } else if (lhs.length > 1 && rhs.length === 1) {
    rhsColors = ["main"];
  } else if (lhsText.startsWith("\\det") || lhsText.startsWith("\\operatorname{tr}")) {
    rhsColors = ["main", "chain"];
  } else if (block.body.includes("\\otimes")) {
    rhsColors = ["upper", "chain", "orange"];
  } else {
    rhsColors = ["upper", "chain"];
  }
  const spans = relationSpans(block.body, 0, void 0, palette);
  spans.push(...operandColorSpans(block.body, lhs, lhsColors, palette));
  spans.push(...operandColorSpans(block.body, rhs, rhsColors, palette));
  spans.push(...collectOperatorSpans(block.body, 0, void 0, palette));
  return block.render(applyColorSpans(block.body, spans));
}

// src/converters/block.ts
var LINE_CONVERTERS = [
  (text, palette) => convertDerivativeLine(text, palette),
  () => null,
  // convert_integral_line stub
  () => null,
  // convert_limit_line stub
  () => null
  // convert_equation_line stub
];
var BLOCK_CONVERTERS = [
  (text, palette) => convertMatrixBlock(text, palette),
  () => null
  // convert_align_block stub
];
function tryConverters(text, converters, palette) {
  for (const converter of converters) {
    const converted = converter(text, palette);
    if (converted !== null) {
      return converted;
    }
  }
  return null;
}
function convertMathBlock(block, palette = COLORS, options) {
  const match = block.match(/^(\s*#+\s*)?\$\$([\s\S]*)\$\$([\s]*)$/);
  if (!match) {
    return block;
  }
  const prefix = match[1] || "";
  const body = match[2];
  const suffix = match[3];
  const lineMatch = tryConverters(block, LINE_CONVERTERS, palette);
  if (lineMatch !== null) {
    return lineMatch;
  }
  const blockMatch = tryConverters(block, BLOCK_CONVERTERS, palette);
  if (blockMatch !== null) {
    return blockMatch;
  }
  return `${prefix}$$${colorLatexBody(body, palette, options)}$$${suffix}`;
}
function convertText(text, palette = COLORS, options) {
  const scan = scanMarkdown(text);
  const allSpans = [...scan.mathBlocks, ...scan.mathInlines].sort(
    (a, b) => a.start - b.start
  );
  if (allSpans.length === 0) {
    return text;
  }
  const converted = [];
  let index = 0;
  for (const span of allSpans) {
    converted.push(text.slice(index, span.start));
    if (span.kind === "math_inline") {
      const raw = text.slice(span.contentStart, span.contentEnd);
      converted.push(`$${colorLatexBody(raw, palette, options)}$`);
    } else {
      converted.push(
        convertMathBlock(text.slice(span.start, span.end), palette, options)
      );
    }
    index = span.end;
  }
  converted.push(text.slice(index));
  return converted.join("");
}

// src/editor/live_preview.ts
var import_state = require("@codemirror/state");
var import_view = require("@codemirror/view");
function createColorMathLivePlugin(getPalette, isEnabled, getOptions) {
  return import_view.ViewPlugin.fromClass(
    class {
      decorations;
      constructor(view) {
        this.decorations = this.buildDecorations(view);
      }
      update(update) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.buildDecorations(update.view);
        }
      }
      buildDecorations(view) {
        if (!isEnabled()) {
          return import_view.Decoration.none;
        }
        const builder = new import_state.RangeSetBuilder();
        const doc = view.state.doc;
        const text = doc.toString();
        const palette = getPalette();
        const options = getOptions ? getOptions() : void 0;
        const scan = scanMarkdown(text);
        const allMath = [...scan.mathBlocks, ...scan.mathInlines];
        for (const block of allMath) {
          const blockStart = block.contentStart;
          const blockEnd = block.contentEnd;
          const isVisible = view.visibleRanges.some(
            (r) => Math.max(r.from, blockStart) <= Math.min(r.to, blockEnd)
          );
          if (!isVisible)
            continue;
          const body = text.slice(blockStart, blockEnd);
          if (containsColorWrapper(body))
            continue;
          const unitSpans = findUnitSpans(body);
          const diffSpans = findDifferentialSpans(body);
          const dimSpans = findDimensionlessSpans(body);
          const allSpans = [
            ...collectFunctionSpans(body, palette),
            ...collectScannerSpans(body, palette)
          ];
          if (options?.colorUnits !== false) {
            allSpans.push(...collectUnitSpans(body, palette, unitSpans));
          }
          if (options?.colorDifferentials !== false) {
            allSpans.push(...collectDifferentialSpans(body, palette, diffSpans));
          }
          if (options?.colorDimensionless !== false) {
            allSpans.push(...collectDimensionlessSpans(body, palette, dimSpans));
          }
          if (options?.colorBraKet !== false) {
            allSpans.push(...collectBraKetDelimiterSpans(body, palette));
          }
          if (options?.rainbowDelimiters) {
            allSpans.push(...collectDelimiterSpans(body, { forLatexWrap: false }));
          }
          if (options?.enableTaxonomy) {
            allSpans.push(...collectTaxonomySpans(body, palette, unitSpans, diffSpans, dimSpans));
          }
          if (options?.variableDataFlow) {
            allSpans.push(...collectVariableSpans(body, void 0, unitSpans, diffSpans, dimSpans));
          }
          const selected = selectColorSpans(body, allSpans);
          const nonOverlapping = [];
          let currentEnd = -1;
          for (const span of selected) {
            if (span.start >= currentEnd) {
              nonOverlapping.push(span);
              currentEnd = span.end;
            }
          }
          for (const span of nonOverlapping) {
            const from = blockStart + span.start;
            const to = blockStart + span.end;
            if (from < to && to <= doc.length) {
              builder.add(
                from,
                to,
                import_view.Decoration.mark({
                  attributes: {
                    style: `color: ${span.color}; font-weight: 500;`
                  },
                  class: "color-math-live-token"
                })
              );
            }
          }
        }
        return builder.finish();
      }
    },
    {
      decorations: (v) => v.decorations
    }
  );
}

// src/editor/mathjax_interceptor.ts
var import_obsidian = require("obsidian");
var MathJaxInterceptor = class {
  unpatchFns = [];
  getPalette;
  getOptions;
  isEnabled;
  constructor(getPalette, getOptions, isEnabled = () => true) {
    this.getPalette = getPalette;
    this.getOptions = getOptions;
    this.isEnabled = isEnabled;
  }
  async install() {
    try {
      await (0, import_obsidian.loadMathJax)();
    } catch (e) {
      console.error("Color Math: Failed to load MathJax", e);
    }
    const mathJax = window?.MathJax;
    if (!mathJax) {
      console.warn("Color Math: window.MathJax is not defined yet.");
      return;
    }
    const transform = (latex) => {
      if (!this.isEnabled())
        return latex;
      try {
        return colorLatexBody(latex, this.getPalette(), this.getOptions());
      } catch (err) {
        console.error("Color Math transformation error:", err);
        return latex;
      }
    };
    if (typeof mathJax.tex2chtml === "function") {
      const orig = mathJax.tex2chtml;
      mathJax.tex2chtml = function(latex, options) {
        return orig.call(this, transform(latex), options);
      };
      this.unpatchFns.push(() => {
        mathJax.tex2chtml = orig;
      });
    }
    if (typeof mathJax.tex2chtmlPromise === "function") {
      const orig = mathJax.tex2chtmlPromise;
      mathJax.tex2chtmlPromise = function(latex, options) {
        return orig.call(this, transform(latex), options);
      };
      this.unpatchFns.push(() => {
        mathJax.tex2chtmlPromise = orig;
      });
    }
    if (typeof mathJax.tex2svg === "function") {
      const orig = mathJax.tex2svg;
      mathJax.tex2svg = function(latex, options) {
        return orig.call(this, transform(latex), options);
      };
      this.unpatchFns.push(() => {
        mathJax.tex2svg = orig;
      });
    }
    if (typeof mathJax.tex2svgPromise === "function") {
      const orig = mathJax.tex2svgPromise;
      mathJax.tex2svgPromise = function(latex, options) {
        return orig.call(this, transform(latex), options);
      };
      this.unpatchFns.push(() => {
        mathJax.tex2svgPromise = orig;
      });
    }
  }
  uninstall() {
    for (const unpatch of this.unpatchFns) {
      try {
        unpatch();
      } catch {
      }
    }
    this.unpatchFns = [];
  }
};

// src/undo.ts
function uncolorFragment(text) {
  const output = [];
  let index = 0;
  while (index < text.length) {
    if (text[index] === "%") {
      const end = readCommentEnd(text, index);
      output.push(text.slice(index, end));
      index = end;
      continue;
    }
    if (text[index] === "\\") {
      const wrapper = readColorWrapper(text, index);
      if (wrapper !== null) {
        const [value, nextIndex] = wrapper;
        output.push(uncolorFragment(value));
        index = nextIndex;
        continue;
      }
      const verb = readVerbEnd(text, index);
      if (verb !== null) {
        const [end] = verb;
        output.push(text.slice(index, end));
        index = end;
        continue;
      }
      const command = matchCommand(text, index);
      if (command !== null) {
        output.push(command);
        index += command.length;
        continue;
      }
    }
    output.push(text[index]);
    index++;
  }
  return output.join("");
}
function uncolorText(text) {
  const mathBlocks = scanMarkdown(text).mathBlocks;
  if (mathBlocks.length === 0) {
    return text;
  }
  const output = [];
  let index = 0;
  for (const span of mathBlocks) {
    output.push(text.slice(index, span.start));
    output.push(uncolorFragment(text.slice(span.start, span.end)));
    index = span.end;
  }
  output.push(text.slice(index));
  return output.join("");
}

// src/utils/theme_colors.ts
function normalizeColorToHex(colorStr, fallback) {
  if (!colorStr)
    return fallback;
  const trimmed = colorStr.trim();
  if (!trimmed)
    return fallback;
  if (trimmed.startsWith("#")) {
    if (trimmed.length === 4) {
      const r = trimmed[1];
      const g = trimmed[2];
      const b = trimmed[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    if (trimmed.length === 7) {
      return trimmed.toLowerCase();
    }
    if (trimmed.length === 9) {
      return trimmed.slice(0, 7).toLowerCase();
    }
  }
  const rgbMatch = trimmed.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10)));
    const g = Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10)));
    const b = Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10)));
    const toHex = (n) => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  if (trimmed.toLowerCase() === "white")
    return "white";
  if (trimmed.toLowerCase() === "black")
    return "black";
  return fallback;
}
function isVaultLightMode() {
  if (typeof document === "undefined" || !document.body) {
    return false;
  }
  return document.body.classList.contains("theme-light");
}
function extractThemePalette(isLight) {
  const light = isLight !== void 0 ? isLight : isVaultLightMode();
  const relationColor = light ? "#1e293b" : "white";
  const dotColor = light ? "#334155" : "white";
  if (typeof window === "undefined" || typeof document === "undefined" || !document.body) {
    return {
      ...DEFAULT_PALETTE,
      relation: relationColor,
      dot: dotColor,
      spacing: dotColor
    };
  }
  const style = getComputedStyle(document.body);
  const getVar = (name, fallback) => {
    const val = style.getPropertyValue(name).trim();
    return normalizeColorToHex(val, fallback);
  };
  const blue = getVar("--color-blue", style.getPropertyValue("--text-accent").trim() || DEFAULT_PALETTE.main);
  const purple = getVar("--color-purple", DEFAULT_PALETTE.derivative);
  const green = getVar("--color-green", DEFAULT_PALETTE.chain);
  const orange = getVar("--color-orange", DEFAULT_PALETTE.orange);
  const red = getVar("--color-red", getVar("--color-pink", DEFAULT_PALETTE.arrow));
  const cyan = getVar("--color-cyan", blue);
  const teal = getVar("--color-teal", cyan);
  return {
    main: blue,
    derivative: purple,
    chain: green,
    orange,
    arrow: red,
    set: cyan,
    upper: purple,
    relation: relationColor,
    dot: dotColor,
    spacing: dotColor,
    parameter: purple,
    unit: teal
  };
}

// src/main.ts
var DEFAULT_SETTINGS = {
  palette: { ...DEFAULT_COLORS },
  liveRendering: true,
  livePreviewHighlighting: false,
  showRibbonIcon: true,
  autoSyncTheme: false,
  autoLightDark: true,
  enableTaxonomy: true,
  rainbowDelimiters: true,
  variableDataFlow: false,
  colorUnits: true,
  colorDifferentials: true,
  colorBraKet: true,
  colorDimensionless: true
};
var COLOR_ROLE_DESCRIPTIONS = {
  main: "Primary expression / function color",
  orange: "Constants, coefficients, and major operators",
  dot: "Multiplication dots and symbols",
  derivative: "Outer derivatives and prime markers",
  chain: "Chain rule factors and subscripts",
  upper: "Superscripts and matrix outer wrappers",
  relation: "Relations, equalities, and tensors",
  arrow: "Arrows and mappings",
  set: "Set theory symbols",
  spacing: "LaTeX spacing commands",
  parameter: "Parameters, angles, and Greek coefficients",
  unit: "Physical units and metric prefixes (e.g. \u03BCm, m/s, nm)"
};
var ColorMathPlugin = class extends import_obsidian2.Plugin {
  settings = DEFAULT_SETTINGS;
  ribbonIconEl = null;
  interceptor = null;
  async onload() {
    await this.loadSettings();
    setPalette(this.settings.palette);
    this.interceptor = new MathJaxInterceptor(
      () => this.settings.palette,
      () => this.getMathOptions(),
      () => this.settings.liveRendering
    );
    await this.interceptor.install();
    this.registerEditorExtension([
      createColorMathLivePlugin(
        () => this.settings.palette,
        () => this.settings.livePreviewHighlighting,
        () => this.getMathOptions()
      )
    ]);
    this.refreshRibbonIcon();
    this.registerEvent(
      this.app.workspace.on("css-change", () => {
        void this.handleThemeChange();
      })
    );
    this.addCommand({
      id: "colorize-note",
      name: "Bake colors into note (Permanent)",
      checkCallback: (checking) => {
        const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
        if (view) {
          if (!checking) {
            void this.colorizeActiveNote();
          }
          return true;
        }
        return false;
      }
    });
    this.addCommand({
      id: "undo-note",
      name: "Clean baked colors from note",
      checkCallback: (checking) => {
        const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
        if (view) {
          if (!checking) {
            void this.uncolorActiveNote();
          }
          return true;
        }
        return false;
      }
    });
    this.addCommand({
      id: "colorize-current-block",
      name: "Bake colors into current math block",
      editorCallback: (editor) => {
        void this.colorizeCurrentMathBlock(editor);
      }
    });
    this.addCommand({
      id: "undo-current-block",
      name: "Clean baked colors from current math block",
      editorCallback: (editor) => {
        void this.uncolorCurrentMathBlock(editor);
      }
    });
    this.addCommand({
      id: "colorize-selection",
      name: "Bake colors into selection",
      editorCallback: (editor) => {
        void this.colorizeSelection(editor);
      }
    });
    this.addCommand({
      id: "undo-selection",
      name: "Clean baked colors from selection",
      editorCallback: (editor) => {
        void this.uncolorSelection(editor);
      }
    });
    this.addSettingTab(new ColorMathSettingTab(this.app, this));
    this.rerenderMath();
  }
  onunload() {
    this.interceptor?.uninstall();
  }
  rerenderMath() {
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.view instanceof import_obsidian2.MarkdownView) {
        const previewMode = leaf.view.previewMode;
        previewMode?.rerender(true);
        const cm = leaf.view.editor?.cm;
        if (cm) {
          cm.dispatch({});
        }
      }
    });
  }
  refreshRibbonIcon() {
    if (this.settings.showRibbonIcon) {
      if (!this.ribbonIconEl) {
        this.ribbonIconEl = this.addRibbonIcon(
          "palette",
          "Color Math",
          (evt) => {
            this.showRibbonMenu(evt);
          }
        );
      }
    } else {
      if (this.ribbonIconEl) {
        this.ribbonIconEl.detach();
        this.ribbonIconEl = null;
      }
    }
  }
  showRibbonMenu(evt) {
    const menu = new import_obsidian2.Menu();
    menu.addItem(
      (item) => item.setTitle("Bake colors into note (Permanent)").setIcon("file-text").onClick(() => this.colorizeActiveNote())
    );
    menu.addItem(
      (item) => item.setTitle("Clean baked colors from note").setIcon("undo").onClick(() => this.uncolorActiveNote())
    );
    menu.addSeparator();
    menu.addItem(
      (item) => item.setTitle("Bake colors into current math block").setIcon("box").onClick(() => {
        const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
        if (view) {
          this.colorizeCurrentMathBlock(view.editor);
        } else {
          new import_obsidian2.Notice("Color Math: No active Markdown note.");
        }
      })
    );
    menu.addItem(
      (item) => item.setTitle("Clean baked colors from current math block").setIcon("rotate-ccw").onClick(() => {
        const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
        if (view) {
          this.uncolorCurrentMathBlock(view.editor);
        } else {
          new import_obsidian2.Notice("Color Math: No active Markdown note.");
        }
      })
    );
    menu.addSeparator();
    menu.addItem(
      (item) => item.setTitle("Bake colors into selection").setIcon("highlighter").onClick(() => {
        const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
        if (view) {
          this.colorizeSelection(view.editor);
        } else {
          new import_obsidian2.Notice("Color Math: No active Markdown note.");
        }
      })
    );
    menu.addItem(
      (item) => item.setTitle("Clean baked colors from selection").setIcon("rotate-ccw").onClick(() => {
        const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
        if (view) {
          this.uncolorSelection(view.editor);
        } else {
          new import_obsidian2.Notice("Color Math: No active Markdown note.");
        }
      })
    );
    menu.addSeparator();
    menu.addItem(
      (item) => item.setTitle("Open Color Math settings").setIcon("settings").onClick(() => {
        const appWithSetting = this.app;
        if (appWithSetting.setting && appWithSetting.setting.openTabById) {
          appWithSetting.setting.open();
          appWithSetting.setting.openTabById(this.manifest.id);
        }
      })
    );
    menu.showAtMouseEvent(evt);
  }
  getMathOptions() {
    return {
      enableTaxonomy: this.settings.enableTaxonomy,
      rainbowDelimiters: this.settings.rainbowDelimiters,
      variableDataFlow: this.settings.variableDataFlow,
      colorUnits: this.settings.colorUnits,
      colorDifferentials: this.settings.colorDifferentials,
      colorBraKet: this.settings.colorBraKet,
      colorDimensionless: this.settings.colorDimensionless
    };
  }
  colorizeCurrentMathBlock(editor) {
    const content = editor.getValue();
    const cursor = editor.getCursor();
    const offset = editor.posToOffset(cursor);
    const mathBlocks = scanMarkdown(content).mathBlocks;
    const currentBlock = mathBlocks.find(
      (span) => span.start <= offset && offset <= span.end
    );
    if (!currentBlock) {
      new import_obsidian2.Notice("Color Math: Cursor is not inside a math block ($$...$$).");
      return;
    }
    const rawBlock = content.slice(currentBlock.start, currentBlock.end);
    const colored = convertMathBlock(
      rawBlock,
      this.settings.palette,
      this.getMathOptions()
    );
    if (colored === rawBlock) {
      new import_obsidian2.Notice("Color Math: Math block is already colorized.");
      return;
    }
    const from = editor.offsetToPos(currentBlock.start);
    const to = editor.offsetToPos(currentBlock.end);
    editor.replaceRange(colored, from, to);
    new import_obsidian2.Notice("Color Math: Colorized current math block! \u{1F3A8}");
  }
  uncolorCurrentMathBlock(editor) {
    const content = editor.getValue();
    const cursor = editor.getCursor();
    const offset = editor.posToOffset(cursor);
    const mathBlocks = scanMarkdown(content).mathBlocks;
    const currentBlock = mathBlocks.find(
      (span) => span.start <= offset && offset <= span.end
    );
    if (!currentBlock) {
      new import_obsidian2.Notice("Color Math: Cursor is not inside a math block ($$...$$).");
      return;
    }
    const rawBlock = content.slice(currentBlock.start, currentBlock.end);
    const uncolored = uncolorFragment(rawBlock);
    if (uncolored === rawBlock) {
      new import_obsidian2.Notice("Color Math: No color wrappers found to remove in this block.");
      return;
    }
    const from = editor.offsetToPos(currentBlock.start);
    const to = editor.offsetToPos(currentBlock.end);
    editor.replaceRange(uncolored, from, to);
    new import_obsidian2.Notice("Color Math: Reverted math block to clean LaTeX.");
  }
  colorizeSelection(editor) {
    const selection = editor.getSelection();
    if (selection) {
      const colored = convertText(
        selection,
        this.settings.palette,
        this.getMathOptions()
      );
      editor.replaceSelection(colored);
      new import_obsidian2.Notice("Color Math: Colorized selection.");
    } else {
      new import_obsidian2.Notice("Color Math: Please select text to colorize.");
    }
  }
  uncolorSelection(editor) {
    const selection = editor.getSelection();
    if (selection) {
      const uncolored = uncolorFragment(selection);
      editor.replaceSelection(uncolored);
      new import_obsidian2.Notice("Color Math: Reverted selection to clean LaTeX.");
    } else {
      new import_obsidian2.Notice("Color Math: Please select text to undo colors.");
    }
  }
  async colorizeActiveNote() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
    if (!view) {
      new import_obsidian2.Notice("Color Math: No active Markdown note.");
      return;
    }
    const editor = view.editor;
    const content = editor.getValue();
    const colored = convertText(
      content,
      this.settings.palette,
      this.getMathOptions()
    );
    if (colored === content) {
      new import_obsidian2.Notice("Color Math: All math blocks are already colored.");
      return;
    }
    const cursor = editor.getCursor();
    editor.setValue(colored);
    editor.setCursor(cursor);
    new import_obsidian2.Notice("Color Math: Successfully colorized note equations! \u{1F3A8}");
  }
  async uncolorActiveNote() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
    if (!view) {
      new import_obsidian2.Notice("Color Math: No active Markdown note.");
      return;
    }
    const editor = view.editor;
    const content = editor.getValue();
    const uncolored = uncolorText(content);
    if (uncolored === content) {
      new import_obsidian2.Notice("Color Math: No color wrappers found to remove.");
      return;
    }
    const cursor = editor.getCursor();
    editor.setValue(uncolored);
    editor.setCursor(cursor);
    new import_obsidian2.Notice("Color Math: Reverted math colors to clean LaTeX.");
  }
  async handleThemeChange() {
    if (this.settings.autoSyncTheme) {
      this.settings.palette = extractThemePalette(this.settings.autoLightDark ? isVaultLightMode() : false);
      await this.saveSettings();
    } else if (this.settings.autoLightDark) {
      const light = isVaultLightMode();
      this.settings.palette = {
        ...this.settings.palette,
        relation: light ? "#1e293b" : "white",
        dot: light ? "#334155" : "white",
        spacing: light ? "#334155" : "white"
      };
      await this.saveSettings();
    }
  }
  async loadSettings() {
    const loadedData = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData || {});
    if (!this.settings.palette) {
      this.settings.palette = { ...DEFAULT_COLORS };
    } else {
      this.settings.palette = Object.assign({}, DEFAULT_COLORS, this.settings.palette);
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
    setPalette(this.settings.palette);
    this.app.workspace.updateOptions();
  }
};
var ColorMathSettingTab = class extends import_obsidian2.PluginSettingTab {
  plugin;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    this.buildTab(this.containerEl);
  }
  buildTab(containerEl) {
    containerEl.createEl("p", {
      text: "Automatically apply semantic colors to LaTeX and MathJax equations in markdown notes."
    });
    new import_obsidian2.Setting(containerEl).setName("Show ribbon icon").setDesc("Display the Color Math palette icon on the left ribbon bar. Note: you can reorder or move ribbon icons via Settings > Appearance > Ribbon menu.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showRibbonIcon).onChange(async (val) => {
        this.plugin.settings.showRibbonIcon = val;
        await this.plugin.saveSettings();
        this.plugin.refreshRibbonIcon();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Live rendered math coloring").setDesc("Automatically colorize rendered MathJax equations in Reading View and Live Preview without modifying your raw Markdown notes.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.liveRendering).onChange(async (val) => {
        this.plugin.settings.liveRendering = val;
        await this.plugin.saveSettings();
        this.plugin.rerenderMath();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Real-time editor syntax highlighting").setDesc("Highlight equations inside the editor in real-time as you type.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.livePreviewHighlighting).onChange(async (val) => {
        this.plugin.settings.livePreviewHighlighting = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("IDE Visual Enhancements").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Rainbow delimiters").setDesc("Color nested parentheses, brackets, and braces by depth to prevent delimiter blindness.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.rainbowDelimiters).onChange(async (val) => {
        this.plugin.settings.rainbowDelimiters = val;
        await this.plugin.saveSettings();
        this.plugin.rerenderMath();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Mathematical symbol taxonomy").setDesc("Semantically categorize and color constants, standard functions, parameters, and bound indices.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.enableTaxonomy).onChange(async (val) => {
        this.plugin.settings.enableTaxonomy = val;
        await this.plugin.saveSettings();
        this.plugin.rerenderMath();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Variable data-flow hashing").setDesc("Deterministically assign a unique color to each variable in an expression to trace its flow.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.variableDataFlow).onChange(async (val) => {
        this.plugin.settings.variableDataFlow = val;
        await this.plugin.saveSettings();
        this.plugin.rerenderMath();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Color physical units").setDesc("Distinguish physical units and metric prefixes (e.g. \u03BCm, m/s, kg) from algebraic variables and parameters. Turn off to keep units in natural text color.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.colorUnits).onChange(async (val) => {
        this.plugin.settings.colorUnits = val;
        await this.plugin.saveSettings();
        this.plugin.rerenderMath();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Calculus differentials & derivatives").setDesc("Color differentials (dx, dt, d\u03B8) and derivative fractions (df/dx, \u2202/\u2202t) with the derivative role to prevent misidentifying 'd' as a variable.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.colorDifferentials).onChange(async (val) => {
        this.plugin.settings.colorDifferentials = val;
        await this.plugin.saveSettings();
        this.plugin.rerenderMath();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Quantum bra-ket notation").setDesc("Highlight Dirac bra-ket state vectors (|\u03C8\u27E9, \u27E8\u03D5|, \u27E8\u03D5|\u03C8\u27E9) with clean delimiter styling.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.colorBraKet).onChange(async (val) => {
        this.plugin.settings.colorBraKet = val;
        await this.plugin.saveSettings();
        this.plugin.rerenderMath();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Engineering dimensionless numbers").setDesc("Recognize contiguous dimensionless numbers (Re, Ma, Pr, Nu) as unified coefficients. Separate letters like 'R e' remain separate variables.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.colorDimensionless).onChange(async (val) => {
        this.plugin.settings.colorDimensionless = val;
        await this.plugin.saveSettings();
        this.plugin.rerenderMath();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Theme Integration").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Sync with active theme").setDesc("Extract and apply matching colors from your currently active Obsidian theme.").addButton(
      (button) => button.setButtonText("Sync with Theme").setCta().onClick(async () => {
        this.plugin.settings.palette = extractThemePalette(
          this.plugin.settings.autoLightDark ? isVaultLightMode() : false
        );
        await this.plugin.saveSettings();
        this.plugin.rerenderMath();
        this.containerEl.empty();
        this.buildTab(this.containerEl);
        new import_obsidian2.Notice("Color Math: Synced colors with active Obsidian theme!");
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Auto-match on theme change").setDesc("Automatically re-sync palette whenever you switch themes in Obsidian.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoSyncTheme).onChange(async (val) => {
        this.plugin.settings.autoSyncTheme = val;
        if (val) {
          this.plugin.settings.palette = extractThemePalette(
            this.plugin.settings.autoLightDark ? isVaultLightMode() : false
          );
          this.plugin.rerenderMath();
        }
        await this.plugin.saveSettings();
        this.containerEl.empty();
        this.buildTab(this.containerEl);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Auto-adapt for light / dark mode").setDesc("Adjust operator contrast (e.g. '=' and '\\cdot') so math never washes out on light backgrounds.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoLightDark).onChange(async (val) => {
        this.plugin.settings.autoLightDark = val;
        if (val) {
          const light = isVaultLightMode();
          this.plugin.settings.palette.relation = light ? "#1e293b" : "white";
          this.plugin.settings.palette.dot = light ? "#334155" : "white";
          this.plugin.settings.palette.spacing = light ? "#334155" : "white";
          this.plugin.rerenderMath();
        }
        await this.plugin.saveSettings();
        this.containerEl.empty();
        this.buildTab(this.containerEl);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Restore default palette").setDesc("Revert all colors back to our signature Tokyo Night palette.").addButton(
      (button) => button.setButtonText("Restore Defaults").onClick(async () => {
        this.plugin.settings.palette = { ...DEFAULT_COLORS };
        await this.plugin.saveSettings();
        this.plugin.rerenderMath();
        this.containerEl.empty();
        this.buildTab(this.containerEl);
        new import_obsidian2.Notice("Color Math: Restored default Tokyo Night palette.");
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Color Palette Roles").setHeading();
    const roles = Object.keys(DEFAULT_COLORS);
    for (const role of roles) {
      const setting = new import_obsidian2.Setting(containerEl).setName(role.charAt(0).toUpperCase() + role.slice(1)).setDesc(COLOR_ROLE_DESCRIPTIONS[role] || role);
      const currentColor = this.plugin.settings.palette[role] || DEFAULT_COLORS[role];
      if (currentColor.startsWith("#")) {
        setting.addColorPicker((picker) => {
          picker.setValue(currentColor).onChange(async (val) => {
            this.plugin.settings.palette[role] = val;
            await this.plugin.saveSettings();
            this.plugin.rerenderMath();
          });
        });
      }
      setting.addText((text) => {
        text.setPlaceholder(DEFAULT_COLORS[role]).setValue(this.plugin.settings.palette[role]).onChange(async (val) => {
          if (val.trim()) {
            this.plugin.settings.palette[role] = val.trim();
            await this.plugin.saveSettings();
            this.plugin.rerenderMath();
          }
        });
      });
    }
  }
};

/* nosourcemap */