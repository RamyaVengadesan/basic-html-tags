(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    kids.flat().forEach(c => n.append(c));
    return n;
  };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } }
  };
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const STATUS = { current: "Current", deprecated: "Deprecated", rare: "Rarely used" };

  /* ---------- Toast & copy ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("on"), 1600);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast("Copied to clipboard"); }
    catch {
      const ta = el("textarea", { class: "sr-only" }); ta.value = text;
      document.body.append(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch { /* ignore */ }
      ta.remove(); toast(ok ? "Copied to clipboard" : "Select the code and copy it manually");
    }
  }

  /* ---------- Syntax highlighting (HTML only) ---------- */
  const TOKEN = /(<!--[\s\S]*?-->)|(<\/?)([a-zA-Z][\w-]*)((?:\s+[^\s"'<>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*(\/?>)|([^<]+|<)/g;
  const ATTR = /([^\s"'<>\/=]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
  function highlight(code) {
    return code.replace(TOKEN, (m, com, open, name, attrs, close, text) => {
      if (com) return `<span class="c">${esc(com)}</span>`;
      if (name) {
        const a = attrs.replace(ATTR, (x, an, eq, av) =>
          `<span class="a">${esc(an)}</span>` + (eq ? `${esc(eq)}<span class="s">${esc(av)}</span>` : ""));
        return `<span class="t">${esc(open)}${esc(name)}</span>${a}<span class="t">${esc(close)}</span>`;
      }
      return esc(text);
    });
  }
  const codeBlock = (code, extra = "") => el("pre", { class: "code " + extra, tabindex: "0" }, el("code", {}));
  function makeCode(code) { const p = codeBlock(code); p.firstChild.innerHTML = highlight(code); return p; }

  /* ---------- Preview document ---------- */
  const PAGE_CSS = "body{font:16px/1.6 system-ui,-apple-system,Segoe UI,sans-serif;color:#1a2233;margin:16px}" +
    "table{border-collapse:collapse}a{color:#2b4cff}code{background:#eef1f7;padding:1px 5px;border-radius:4px}";
  const previewDoc = code =>
    /<!doctype|<html/i.test(code) ? code : `<!doctype html><meta charset="utf-8"><style>${PAGE_CSS}</style>${code}`;
  function previewFrame(code, height = 150) {
    return el("iframe", { class: "preview", title: "Live preview", sandbox: "", srcdoc: previewDoc(code), style: `height:${height}px` });
  }

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const saved = store.get("tl-theme");
  if (saved === "dark" || saved === "light") root.dataset.theme = saved;
  $("#themeBtn").addEventListener("click", () => {
    const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    root.dataset.theme = next; store.set("tl-theme", next);
  });

  /* ---------- Hero stats + live demo ---------- */
  const groups = Object.keys(CATEGORIES).length;
  const dep = TAGS.filter(t => t.st === "deprecated").length;
  $("#stats").append(
    ...[[TAGS.length, "tags"], [groups, "groups"], [dep, "deprecated, with replacements"]]
      .map(([n, l]) => el("li", {}, el("b", { text: String(n) }), l))
  );

  const DEMO = ["em", "ul", "input", "marquee", "table"];
  const demoById = Object.fromEntries(TAGS.map(t => [t.id, t]));
  let demoIdx = 0, demoTimer = null;
  function showDemo(i) {
    demoIdx = i;
    const t = demoById[DEMO[i]];
    $("#demoCode").innerHTML = highlight(t.code);
    $("#demoRender").innerHTML = t.code.replace(/<script[\s\S]*?<\/script>/gi, "");
    [...$("#demoPick").children].forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
  }
  DEMO.forEach((id, i) => $("#demoPick").append(
    el("button", { type: "button", "aria-pressed": "false", text: demoById[id].t.replace(/[<>]/g, ""), onclick: () => { stopDemo(); showDemo(i); } })
  ));
  function stopDemo() { clearInterval(demoTimer); demoTimer = null; }
  showDemo(0);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    demoTimer = setInterval(() => showDemo((demoIdx + 1) % DEMO.length), 4500);
    $(".demo").addEventListener("pointerenter", stopDemo);
  }

  /* ---------- Reference ---------- */
  const state = { q: "", cat: "all", st: "all" };
  const chips = $("#chips");
  const chipDefs = [["cat", "all", "All"], ...Object.entries(CATEGORIES).map(([k, v]) => ["cat", k, v]),
    "sep", ["st", "deprecated", "Deprecated only"]];
  chipDefs.forEach(d => {
    if (d === "sep") return chips.append(el("span", { class: "sep", "aria-hidden": "true" }));
    const [type, val, label] = d;
    chips.append(el("button", { class: "chip", type: "button", "data-type": type, "data-val": val,
      "aria-pressed": String(type === "cat" ? val === "all" : false), text: label,
      onclick: () => {
        if (type === "cat") state.cat = val;
        else state.st = state.st === val ? "all" : val;
        syncChips(); render();
      } }));
  });
  function syncChips() {
    chips.querySelectorAll(".chip").forEach(c => {
      const t = c.dataset.type, v = c.dataset.val;
      c.setAttribute("aria-pressed", String(t === "cat" ? state.cat === v : state.st === v));
    });
  }
  const haystack = t => (t.t + " " + t.name + " " + t.desc + " " + t.cat + " " + CATEGORIES[t.cat] + " " + t.st).toLowerCase();
  function render() {
    const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = TAGS.filter(t =>
      (state.cat === "all" || t.cat === state.cat) &&
      (state.st === "all" || t.st === state.st) &&
      terms.every(w => haystack(t).includes(w)));
    $("#count").textContent = `Showing ${list.length} of ${TAGS.length} tags`;
    const grid = $("#grid"); grid.replaceChildren();
    if (!list.length) {
      grid.append(el("div", { class: "empty", style: "grid-column:1/-1" },
        el("b", { text: "No tags match" }), "Clear the search or pick “All” to see every tag."));
      return;
    }
    list.forEach(t => grid.append(
      el("button", { class: "card", type: "button", onclick: () => openDetail(t, document.activeElement) },
        el("div", { class: "top" }, el("span", { class: "tag", text: t.t }), el("span", { class: "badge " + t.st, text: STATUS[t.st] })),
        el("span", { class: "nm", text: t.name }),
        el("span", { class: "ds", text: t.desc }),
        el("span", { class: "cat", text: CATEGORIES[t.cat] }))
    ));
  }
  $("#q").addEventListener("input", e => { state.q = e.target.value; render(); });
  document.addEventListener("keydown", e => {
    if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !$("#dlg").open) {
      e.preventDefault(); $("#q").focus();
    }
  });
  render();

  /* ---------- Detail dialog ---------- */
  const dlg = $("#dlg");
  function openDetail(t) {
    dlg.replaceChildren(el("div", { class: "dlg" },
      el("div", { class: "dlg-top" },
        el("h3", { id: "dlgTitle" }, el("span", { text: t.t }), t.name),
        el("button", { class: "icon-btn", type: "button", "aria-label": "Close", onclick: () => dlg.close() }, closeIcon())),
      el("div", { class: "meta" }, el("span", { class: "badge " + t.st, text: STATUS[t.st] }), CATEGORIES[t.cat]),
      el("p", { text: t.desc }),
      t.alt ? el("div", { class: "note alt" }, el("b", { text: "Use this instead: " }), t.alt.replace(/<span[^>]*>|<\/span>/g, "")) : "",
      t.note ? el("div", { class: "note" }, el("b", { text: "Tip: " }), t.note) : "",
      el("div", {}, el("div", { class: "pane-label" }, "Code"), makeCode(t.code)),
      el("div", {}, el("div", { class: "pane-label" }, "Browser view"),
        t.inv ? el("div", { class: "invisible-msg", text: "This tag is not shown on the page. It works behind the scenes." }) : previewFrame(t.code, 150)),
      el("div", { class: "dlg-actions" },
        el("button", { class: "btn primary", type: "button", text: "Try it in the playground", onclick: () => { dlg.close(); loadIntoLab(t.code); location.hash = "playground"; } }),
        el("button", { class: "btn", type: "button", text: "Copy code", onclick: () => copy(t.code) }))
    ));
    dlg.showModal();
  }
  function closeIcon() {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true");
    s.innerHTML = '<path d="M6 6l12 12M18 6L6 18"/>'; return s;
  }
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  /* ---------- Playground ---------- */
  const editor = $("#editor"), frame = $("#labFrame");
  const KEY = "tl-draft";
  editor.value = store.get(KEY) || STARTER;
  let t0;
  function updateLab() {
    frame.srcdoc = previewDoc(editor.value);
    const lines = editor.value.split("\n").length;
    $("#labStatus").textContent = `${lines} line${lines === 1 ? "" : "s"}, ${editor.value.length} characters`;
    store.set(KEY, editor.value);
  }
  function loadIntoLab(code) { editor.value = code; updateLab(); }
  editor.addEventListener("input", () => { clearTimeout(t0); t0 = setTimeout(updateLab, 200); });
  editor.addEventListener("keydown", e => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: en } = editor;
      editor.setRangeText("  ", s, en, "end");
      editor.dispatchEvent(new Event("input"));
    }
  });
  $("#labCopy").addEventListener("click", () => copy(editor.value));
  $("#labReset").addEventListener("click", () => { loadIntoLab(STARTER); toast("Reset to the starter page"); });
  [["Starter page", STARTER], ...["a", "ul", "form", "table", "marquee"].map(id => [demoOrFind(id).t, demoOrFind(id).code])]
    .forEach(([label, code]) => $("#snips").append(el("button", { class: "chip", type: "button", text: label, onclick: () => loadIntoLab(code) })));
  function demoOrFind(id) { return TAGS.find(t => t.id === id); }
  updateLab();

  /* ---------- Quiz ---------- */
  const box = $("#quizBox");
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const QN = 10;
  let qs = [], qi = 0, score = 0;
  function startQuiz() {
    qs = shuffle(TAGS).slice(0, QN).map(t => {
      const others = shuffle(TAGS.filter(o => o.id !== t.id));
      const wrong = [...others.filter(o => o.cat === t.cat), ...others.filter(o => o.cat !== t.cat)].slice(0, 3);
      return { t, opts: shuffle([t, ...wrong]) };
    });
    qi = 0; score = 0; showQ();
  }
  function showQ() {
    if (qi >= qs.length) return showResult();
    const { t, opts } = qs[qi];
    const fb = el("div", { class: "q-feedback", "aria-live": "polite" });
    const next = el("button", { class: "btn primary", type: "button", text: qi === qs.length - 1 ? "See my score" : "Next question", hidden: "", onclick: () => { qi++; showQ(); } });
    const buttons = opts.map(o => el("button", { class: "opt", type: "button", text: o.t, onclick: () => {
      buttons.forEach(b => { b.disabled = true; if (b.textContent === t.t) b.classList.add("right"); });
      const ok = o.id === t.id;
      if (ok) score++; else buttons.find(b => b.textContent === o.t).classList.add("wrong");
      fb.textContent = (ok ? "Correct. " : `Not quite, the answer is ${t.t}. `) + t.desc;
      next.hidden = false; next.focus();
    } }));
    box.replaceChildren(
      el("div", { class: "q-meta" }, el("span", { text: `Question ${qi + 1} of ${qs.length}` }), el("span", { text: `Score ${score}` })),
      el("div", { class: "q-bar" }, el("i", { style: `width:${(qi / qs.length) * 100}%` })),
      el("div", { class: "q-text", text: t.q }),
      el("div", { class: "opts" }, buttons), fb, el("div", { class: "q-foot" }, next));
  }
  function showResult() {
    const msg = score >= 9 ? "You know your tags." : score >= 6 ? "Solid. Check the cards you missed in the reference." : "Good start. Browse the reference and try again.";
    box.replaceChildren(el("div", { class: "result" },
      el("div", { class: "score", text: `${score}/${qs.length}` }), el("p", { text: msg }),
      el("button", { class: "btn primary", type: "button", text: "Play again", onclick: startQuiz })));
    if (score > Number(store.get("tl-best") || 0)) store.set("tl-best", String(score));
  }
  startQuiz();

  /* ---------- Nav highlight ---------- */
  const links = [...document.querySelectorAll(".nav a")];
  const secs = links.map(a => $(a.getAttribute("href")));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach((a, i) => secs[i] === e.target ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
    }), { rootMargin: "-40% 0px -55% 0px" });
    secs.forEach(s => s && io.observe(s));
  }
})();
