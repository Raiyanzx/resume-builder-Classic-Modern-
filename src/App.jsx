import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, Trash2, Upload, Printer, User, Phone, Mail, Linkedin,
  GraduationCap, Briefcase, FolderGit2, Languages as LanguagesIcon,
  Sparkles, Heart, Users, LayoutTemplate, ChevronDown, ChevronUp,
  Type, SlidersHorizontal, Bold, Italic, Underline, ListOrdered,
  ArrowUp, ArrowDown, X, FileText, Palette, Undo2, Redo2, Download,
} from "lucide-react";

let idCounter = 1;
const nextId = () => idCounter++;

const emptyEducation = () => ({ id: nextId(), degree: "", institution: "", field: "", score: "", start: "", end: "" });
const emptyExperience = () => ({ id: nextId(), role: "", company: "", location: "", start: "", end: "", duties: "" });
const emptyProject = () => ({ id: nextId(), name: "", description: "", link: "" });
const emptyReference = () => ({ id: nextId(), name: "", organization: "", designation: "", phone: "" });
const emptySkillGroup = () => ({ id: nextId(), category: "", items: "" });

const initialData = {
  name: "Cristiano Ronaldo",
  headline: "Looking For: Attacking Position",
  phone: "+8807",
  email: "CR7@Siuuuu.com",
  linkedin: "www.linkedin.com/in/CR7",
  address: "House:07, Road:07, Lisbon, Portugal-007",
  summary: "Five-time Ballon d'Or winner with extensive experience carrying teams, breaking records, and making defenders question their career choices. Passionate about winning trophies, scoring impossible goals, and reminding everyone that age is just a number.",
  photo: "/CR7.png",
  education: [
    { id: nextId(), degree: "Master's in Humbling Defenders", institution: "Sporting CP", field: "Major: ", score: "CGPA 3.1 / 4", start: "2002", end: "2026" },
  ],
  experience: [
    { id: nextId(), role: "Striker", company: "Al Nassr FC", location: "Tejgaon, Dhaka", start: "Apr 2023", end: "Continuing", duties: "End-to-End Onboarding Management\nCandidate Screening & Pipeline Support\nHRIS & Data Integrity\nBackground & Compliance Verification" },
  ],
  projects: [
    { id: nextId(), name: "Break-Even Calculator", description: "Responsive web app that instantly calculates break-even units, revenue, and profit scenarios.", link: "https://break-even-calculator-adnan.vercel.app/" },
  ],
  skillGroups: [
    { id: nextId(), category: "Technical Skills", items: "MS Office, Google Workspace, Photoshop, Canva, CapCut" },
  ],
  languages: ["English", "Chinese"],
  interests: ["AI & Programming", "Photoshop, Canva, CapCut"],
  personal: { father: "", mother: "", dob: "", nationality: "", marital: "", religion: "", bloodGroup: "" },
  references: [{ id: nextId(), name: "", organization: "", designation: "", phone: "" }],
};

/* ================= DESIGN SYSTEM (intentionally small) ================= */

const FONT_OPTIONS = [
  { label: "Inter", value: "'Inter', system-ui, sans-serif" },
  { label: "Calibri", value: "Calibri, 'Segoe UI', sans-serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
];

// Fixed, non-editable spacing constants so the resume stays visually
// balanced without exposing a dozen extra sliders ("auto formatting").
const AUTO = {
  bulletIndent: 20, // px
  bulletGap: 5, // px between bullet lines
  paragraphGap: 10, // px between paragraphs inside a section
};

const defaultDesign = {
  bodyFont: FONT_OPTIONS[1].value,
  headingFont: FONT_OPTIONS[1].value,
  bodyFontSize: 14, // clamped 12-16
  headingFontSize: 16, // clamped 14-22
  lineHeight: 1.5, // clamped 1.3-1.8
  sectionSpacing: 24, // px, clamped 16-40
  pageMargin: 48, // px, clamped 32-72
  headingBold: true,
  textColor: "#1e293b",
  headerColor: "#334155", // Modern template header background only
};

const defaultSectionTitles = {
  summary: "Summary",
  education: "Education",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  languages: "Languages",
  interests: "Interests",
  references: "References",
};

const defaultSectionOrder = ["summary", "education", "experience", "projects", "skills", "languages", "interests", "references"];
const SIDEBAR_KEYS = ["skills", "languages", "interests"]; // Modern-template-only grouping

// Clamp helper so values can never make text unreadably small/huge.
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function isLightColor(hex) {
  const c = (hex || "#334155").replace("#", "");
  if (c.length !== 6) return false;
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.65;
}

function cssVarsFromDesign(design) {
  return {
    "--body-font": design.bodyFont,
    "--heading-font": design.headingFont,
    "--body-size": `${clamp(design.bodyFontSize, 11, 20)}px`,
    "--heading-size": `${clamp(design.headingFontSize, 13, 28)}px`,
    "--name-size": `${clamp(design.headingFontSize, 13, 28) * 1.6}px`,
    "--line-height": clamp(design.lineHeight, 1.3, 1.8),
    "--section-gap": `${clamp(design.sectionSpacing, 16, 40)}px`,
    "--page-margin": `${clamp(design.pageMargin, 32, 72)}px`,
    "--heading-weight": design.headingBold ? 700 : 500,
    "--bullet-indent": `${AUTO.bulletIndent}px`,
    "--bullet-gap": `${AUTO.bulletGap}px`,
    "--text-color": design.textColor,
  };
}

/* ================= FORM BUILDING BLOCKS ================= */

function Section({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors">
        <span className="flex items-center gap-2 font-semibold text-slate-700 text-sm">{icon}{title}</span>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>
      <input {...props} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
    </label>
  );
}

function TextAreaField({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>
      <textarea {...props} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y" />
    </label>
  );
}

// Lightweight rich-text field: contentEditable + Bold/Italic/Underline only.
// Not a full editor by design. Kept uncontrolled after first render so the
// caret doesn't jump while typing.
function RichTextField({ label, value, onChange, placeholder, rows = 3 }) {
  const ref = useRef(null);
  const didInit = useRef(false);

  useEffect(() => {
    if (ref.current && !didInit.current) {
      ref.current.innerHTML = value || "";
      didInit.current = true;
    }
  }, [value]);

  const exec = (cmd) => {
    ref.current?.focus();
    document.execCommand(cmd);
    onChange(ref.current.innerHTML);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="block text-xs font-medium text-slate-500">{label}</span>
        <div className="flex gap-0.5">
          <button type="button" title="Bold" onMouseDown={(e) => { e.preventDefault(); exec("bold"); }} className="p-1 rounded hover:bg-slate-100 text-slate-500"><Bold size={13} /></button>
          <button type="button" title="Italic" onMouseDown={(e) => { e.preventDefault(); exec("italic"); }} className="p-1 rounded hover:bg-slate-100 text-slate-500"><Italic size={13} /></button>
          <button type="button" title="Underline" onMouseDown={(e) => { e.preventDefault(); exec("underline"); }} className="p-1 rounded hover:bg-slate-100 text-slate-500"><Underline size={13} /></button>
        </div>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        style={{ minHeight: `${rows * 22}px` }}
        className="rich-text-input w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}

function ListEditor({ items, onChange, placeholder }) {
  const update = (i, val) => { const copy = [...items]; copy[i] = val; onChange(copy); };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input value={it} onChange={(e) => update(i, e.target.value)} placeholder={placeholder} className="flex-1 text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <button type="button" onClick={() => remove(i)} className="text-slate-400 hover:text-red-500 px-2"><Trash2 size={16} /></button>
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"><Plus size={14} /> Add</button>
    </div>
  );
}

function RepeatingBlock({ children, onRemove, label }) {
  return (
    <div className="relative border border-slate-200 rounded-md p-3 pt-4 bg-slate-50/50 space-y-2">
      <div className="absolute -top-2 left-3 bg-white px-2 text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{label}</div>
      <button type="button" onClick={onRemove} className="absolute -top-2 right-2 text-slate-400 hover:text-red-500 bg-white rounded-full p-0.5"><Trash2 size={14} /></button>
      {children}
    </div>
  );
}

function SliderField({ label, value, min, max, step = 1, unit = "", onChange }) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs font-medium text-slate-500 mb-1">
        <span>{label}</span><span className="text-slate-400">{value}{unit}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </label>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-9 h-9 rounded border border-slate-300 cursor-pointer bg-white" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>
    </label>
  );
}

/* ================= SECTION CONTENT (shared by both templates) ================= */

function sectionHasContent(key, data, customSections) {
  switch (key) {
    case "summary": return !!(data.summary && data.summary.replace(/<[^>]+>/g, "").trim());
    case "education": return data.education.length > 0;
    case "experience": return data.experience.length > 0;
    case "projects": return data.projects.some((p) => p.name);
    case "skills": return data.skillGroups.some((s) => s.category || s.items);
    case "languages": return data.languages.filter(Boolean).length > 0;
    case "interests": return data.interests.filter(Boolean).length > 0;
    case "references": return data.references.some((r) => r.name || r.organization);
    default: {
      const cs = customSections.find((c) => c.id === key);
      return !!cs && cs.items.filter(Boolean).length > 0;
    }
  }
}

const muted = { opacity: 0.72 };

function SectionBody({ sectionKey, data, customSections }) {
  switch (sectionKey) {
    case "summary":
      return <p style={{ textAlign: "justify", wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: data.summary }} />;

    case "education":
      return (
        <div>
          {data.education.map((ed) => (
            <div key={ed.id} className="flex justify-between gap-4" style={{ marginBottom: AUTO.paragraphGap, breakInside: "avoid" }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, wordBreak: "break-word" }}>{ed.institution}</p>
                <p style={muted}>{ed.degree}{ed.field ? ` — ${ed.field}` : ""}</p>
                {ed.score && <p style={muted}>{ed.score}</p>}
              </div>
              <div className="text-right shrink-0" style={{ whiteSpace: "nowrap", fontWeight: 600 }}>{ed.start} - {ed.end}</div>
            </div>
          ))}
        </div>
      );

    case "experience":
      return (
        <div>
          {data.experience.map((ex, i) => (
            <div key={ex.id} style={{ marginBottom: AUTO.paragraphGap * 1.5, breakInside: "avoid" }}>
              <div className="flex justify-between gap-4">
                <p style={{ fontWeight: 700, wordBreak: "break-word" }}>{ex.role}{ex.company ? ` · ${ex.company}` : ""}</p>
                <p style={{ whiteSpace: "nowrap", fontWeight: 600 }}>{ex.start} - {ex.end}</p>
              </div>
              {ex.location && <p style={muted}>{ex.location}</p>}
              {ex.duties && (
                <ul style={{ listStyle: "disc", paddingLeft: "var(--bullet-indent)", marginTop: 4 }}>
                  {ex.duties.split("\n").filter(Boolean).map((d, idx) => (
                    <li key={idx} style={{ marginBottom: "var(--bullet-gap)", wordBreak: "break-word" }}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );

    case "projects":
      return (
        <div>
          {data.projects.filter((p) => p.name).map((p) => (
            <div key={p.id} style={{ marginBottom: AUTO.paragraphGap, breakInside: "avoid" }}>
              <p style={{ fontWeight: 700 }}>{p.name}</p>
              <p style={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: p.description }} />
              {p.link && <p style={{ textDecoration: "underline", wordBreak: "break-all" }}>{p.link}</p>}
            </div>
          ))}
        </div>
      );

    case "skills":
      return (
        <div>
          {data.skillGroups.filter((s) => s.category || s.items).map((sg) => (
            <div key={sg.id} style={{ marginBottom: AUTO.paragraphGap, breakInside: "avoid" }}>
              {sg.category && <p style={{ fontWeight: 700 }}>{sg.category}</p>}
              {sg.items && <p style={muted}>{sg.items}</p>}
            </div>
          ))}
        </div>
      );

    case "languages":
      return <p style={muted}>{data.languages.filter(Boolean).join(", ")}</p>;

    case "interests":
      return <p style={muted}>{data.interests.filter(Boolean).join(", ")}</p>;

    case "references": {
      const list = data.references.filter((r) => r.name || r.organization);
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "16px 20px" }}>
          {list.map((r) => (
            <div key={r.id} style={{ breakInside: "avoid" }}>
              {r.name && <p style={{ fontWeight: 700 }}>{r.name}</p>}
              {r.designation && <p style={muted}>{r.designation}</p>}
              {r.organization && <p style={muted}>{r.organization}</p>}
              {r.phone && <p style={muted}>{r.phone}</p>}
            </div>
          ))}
        </div>
      );
    }

    default: {
      const cs = customSections.find((c) => c.id === sectionKey);
      const items = cs ? cs.items.filter(Boolean) : [];
      return (
        <ul style={{ listStyle: "disc", paddingLeft: "var(--bullet-indent)" }}>
          {items.map((it, i) => <li key={i} style={{ marginBottom: "var(--bullet-gap)", wordBreak: "break-word" }}>{it}</li>)}
        </ul>
      );
    }
  }
}

/* ================= MAIN APP ================= */

export default function App() {
  const [data, setData] = useState(initialData);
  const [design, setDesign] = useState(defaultDesign);
  const [template, setTemplate] = useState("modern");
  const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
  const [sectionTitles, setSectionTitles] = useState(defaultSectionTitles);
  const [customSections, setCustomSections] = useState([]);
  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);
  const previewRef = useRef(null);

  /* ---------- Undo / Redo (session history) ---------- */
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const lastSnapshotRef = useRef(null);
  const skipNextSnapshot = useRef(false);
  const historyTimer = useRef(null);

  const getSnapshot = () => ({ data, design, template, sectionOrder, sectionTitles, customSections });

  const applySnapshot = (snap) => {
    setData({ ...initialData, ...snap.data, personal: { ...initialData.personal, ...(snap.data?.personal || {}) } });
    setDesign({ ...defaultDesign, ...snap.design });
    setTemplate(snap.template || "modern");
    setSectionOrder(snap.sectionOrder || defaultSectionOrder);
    setSectionTitles({ ...defaultSectionTitles, ...snap.sectionTitles });
    setCustomSections((snap.customSections || []).map((c) => ({ column: "main", ...c })));
  };

  // Bump the id counter past anything in an imported/restored snapshot so
  // new items never collide with restored ones.
  const bumpIdCounter = (snap) => {
    let max = idCounter;
    const scan = (arr) => (arr || []).forEach((item) => { if (typeof item?.id === "number" && item.id > max) max = item.id; });
    scan(snap.data?.education); scan(snap.data?.experience); scan(snap.data?.projects);
    scan(snap.data?.references); scan(snap.data?.skillGroups); scan(snap.customSections);
    idCounter = max + 1;
  };

  // Record a history checkpoint ~800ms after changes settle, so typing a
  // field doesn't create dozens of undo steps — one step per burst of edits.
  useEffect(() => {
    const snap = getSnapshot();
    if (lastSnapshotRef.current === null) { lastSnapshotRef.current = snap; return; }
    if (skipNextSnapshot.current) { skipNextSnapshot.current = false; lastSnapshotRef.current = snap; return; }
    if (historyTimer.current) clearTimeout(historyTimer.current);
    historyTimer.current = setTimeout(() => {
      setHistory((h) => [...h, lastSnapshotRef.current].slice(-50));
      lastSnapshotRef.current = snap;
      setRedoStack([]);
    }, 800);
    return () => clearTimeout(historyTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, design, template, sectionOrder, sectionTitles, customSections]);

  const undo = () => {
    if (historyTimer.current) clearTimeout(historyTimer.current);
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack((r) => [...r, getSnapshot()]);
    setHistory((h) => h.slice(0, -1));
    skipNextSnapshot.current = true;
    applySnapshot(prev);
  };
  const redo = () => {
    if (historyTimer.current) clearTimeout(historyTimer.current);
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((h) => [...h, getSnapshot()]);
    setRedoStack((r) => r.slice(0, -1));
    skipNextSnapshot.current = true;
    applySnapshot(next);
  };

  // Keyboard shortcuts: Ctrl/Cmd+Z to undo, Ctrl/Cmd+Shift+Z (or Ctrl+Y) to redo.
  useEffect(() => {
    const onKeyDown = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((e.key.toLowerCase() === "z" && e.shiftKey) || e.key.toLowerCase() === "y") { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, redoStack]);

  /* ---------- Export / Import raw data (JSON) ---------- */
  const exportData = () => {
    const snap = getSnapshot();
    const blob = new Blob([JSON.stringify(snap, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.name || "resume").trim().replace(/\s+/g, "_") || "resume"}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const snap = JSON.parse(reader.result);
        setHistory((h) => [...h, getSnapshot()].slice(-50));
        setRedoStack([]);
        skipNextSnapshot.current = true;
        bumpIdCounter(snap);
        applySnapshot(snap);
      } catch (err) {
        alert("Couldn't read that file — make sure it's a JSON file exported from this app.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const set = (key, value) => setData((d) => ({ ...d, [key]: value }));
  const setPersonal = (key, value) => setData((d) => ({ ...d, personal: { ...d.personal, [key]: value } }));
  const setDesignField = (key, value) => setDesign((d) => ({ ...d, [key]: value }));

  const updateArrayItem = (key, id, field, value) => {
    setData((d) => ({ ...d, [key]: d[key].map((item) => (item.id === id ? { ...item, [field]: value } : item)) }));
  };
  const addArrayItem = (key, factory) => setData((d) => ({ ...d, [key]: [...d[key], factory()] }));
  const removeArrayItem = (key, id) => setData((d) => ({ ...d, [key]: d[key].filter((item) => item.id !== id) }));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("photo", reader.result);
    reader.readAsDataURL(file);
  };

  // Section order / titles / custom sections
  const renameSection = (key, title) => setSectionTitles((t) => ({ ...t, [key]: title }));
  const moveSection = (key, dir) => {
    setSectionOrder((order) => {
      const idx = order.indexOf(key);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= order.length) return order;
      const copy = [...order];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };
  const addCustomSection = (column = "main") => {
    const id = `custom-${nextId()}`;
    setCustomSections((cs) => [...cs, { id, items: [""], column }]);
    setSectionTitles((t) => ({ ...t, [id]: "New Section" }));
    setSectionOrder((o) => [...o, id]);
  };
  const setCustomSectionColumn = (id, column) => setCustomSections((cs) => cs.map((c) => (c.id === id ? { ...c, column } : c)));
  const removeCustomSection = (id) => {
    setCustomSections((cs) => cs.filter((c) => c.id !== id));
    setSectionOrder((o) => o.filter((k) => k !== id));
    setSectionTitles((t) => { const c = { ...t }; delete c[id]; return c; });
  };
  const updateCustomItems = (id, items) => setCustomSections((cs) => cs.map((c) => (c.id === id ? { ...c, items } : c)));
  const addPageBreak = () => setSectionOrder((o) => [...o, `pagebreak-${nextId()}`]);
  const removeEntry = (key) => setSectionOrder((o) => o.filter((k) => k !== key));

  // Print directly from this page — no popup, no external stylesheet to
  // fetch — so the exported PDF always matches the on-screen preview.
  const handlePrint = useCallback(() => window.print(), []);

  const cssVars = cssVarsFromDesign(design);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top bar */}
      <div className="no-print bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center"><LayoutTemplate size={16} className="text-white" /></div>
          <h1 className="font-bold text-slate-800 text-lg">Resume Builder By Adnan Hassan</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-slate-300 rounded-lg p-0.5">
            <button type="button" onClick={undo} disabled={history.length === 0} title="Undo (Ctrl+Z)" className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent">
              <Undo2 size={15} />
            </button>
            <button type="button" onClick={redo} disabled={redoStack.length === 0} title="Redo (Ctrl+Shift+Z)" className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent">
              <Redo2 size={15} />
            </button>
          </div>
          <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm">
            <button onClick={() => setTemplate("classic")} className={`px-3 py-1.5 font-medium transition-colors ${template === "classic" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>Classic</button>
            <button onClick={() => setTemplate("modern")} className={`px-3 py-1.5 font-medium transition-colors ${template === "modern" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>Modern</button>
          </div>
          <button type="button" onClick={exportData} title="Download your data as a JSON file you can re-import later" className="flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Download size={15} /> Save data
          </button>
          <button type="button" onClick={() => importInputRef.current?.click()} title="Load a previously saved JSON file" className="flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Upload size={15} /> Load data
          </button>
          <input ref={importInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
          <button onClick={handlePrint} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Printer size={15} /> Download / Print
          </button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-[420px_1fr] gap-0">
        {/* FORM PANEL */}
        <div className="no-print border-r border-slate-200 bg-slate-50 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-57px)]">
          <Section title="Typography & Spacing" icon={<Type size={15} />}>
            <SelectField label="Body font" value={design.bodyFont} onChange={(v) => setDesignField("bodyFont", v)} options={FONT_OPTIONS} />
            <SelectField label="Heading font" value={design.headingFont} onChange={(v) => setDesignField("headingFont", v)} options={FONT_OPTIONS} />
            <SliderField label="Body font size" value={design.bodyFontSize} min={11} max={20} unit="px" onChange={(v) => setDesignField("bodyFontSize", v)} />
            <SliderField label="Heading font size" value={design.headingFontSize} min={13} max={28} unit="px" onChange={(v) => setDesignField("headingFontSize", v)} />
            <label className="flex items-center gap-2 text-sm text-slate-600 pt-1">
              <input type="checkbox" checked={design.headingBold} onChange={(e) => setDesignField("headingBold", e.target.checked)} className="accent-indigo-600" />
              Bold section headings
            </label>

            <div className="border-t border-slate-200 pt-3 mt-1 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide"><SlidersHorizontal size={12} /> Spacing</div>
              <SliderField label="Line height" value={design.lineHeight} min={1.3} max={1.8} step={0.05} onChange={(v) => setDesignField("lineHeight", v)} />
              <SliderField label="Space between sections" value={design.sectionSpacing} min={16} max={40} unit="px" onChange={(v) => setDesignField("sectionSpacing", v)} />
              <SliderField label="Page margins" value={design.pageMargin} min={32} max={72} unit="px" onChange={(v) => setDesignField("pageMargin", v)} />
            </div>

            <div className="border-t border-slate-200 pt-3 mt-1 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide"><Palette size={12} /> Colors</div>
              <ColorField label="Body text color" value={design.textColor} onChange={(v) => setDesignField("textColor", v)} />
              {template === "modern" && (
                <ColorField label="Header background (Modern)" value={design.headerColor} onChange={(v) => setDesignField("headerColor", v)} />
              )}
            </div>
          </Section>

          <Section title="Sections" icon={<ListOrdered size={15} />} defaultOpen={false}>
            <p className="text-xs text-slate-400 -mt-1">Rename, reorder, add custom sections, or insert a page break.</p>
            {sectionOrder.map((key, idx) => {
              if (key.startsWith("pagebreak-")) {
                return (
                  <div key={key} className="flex items-center gap-2 border border-dashed border-slate-300 rounded-md px-3 py-2 bg-slate-50">
                    <FileText size={14} className="text-slate-400" />
                    <span className="flex-1 text-xs text-slate-500">Page Break</span>
                    <button type="button" onClick={() => moveSection(key, -1)} disabled={idx === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ArrowUp size={13} /></button>
                    <button type="button" onClick={() => moveSection(key, 1)} disabled={idx === sectionOrder.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ArrowDown size={13} /></button>
                    <button type="button" onClick={() => removeEntry(key)} className="text-slate-400 hover:text-red-500"><X size={13} /></button>
                  </div>
                );
              }
              const isCustom = key.startsWith("custom-");
              const cs = isCustom ? customSections.find((c) => c.id === key) : null;
              return (
                <div key={key} className="border border-slate-200 rounded-md p-2.5 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <input value={sectionTitles[key] || ""} onChange={(e) => renameSection(key, e.target.value)} className="flex-1 text-sm px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                    <button type="button" onClick={() => moveSection(key, -1)} disabled={idx === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ArrowUp size={13} /></button>
                    <button type="button" onClick={() => moveSection(key, 1)} disabled={idx === sectionOrder.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ArrowDown size={13} /></button>
                    {isCustom && <button type="button" onClick={() => removeCustomSection(key)} className="text-slate-400 hover:text-red-500"><X size={13} /></button>}
                  </div>
                  {isCustom && cs && (
                    <>
                      <ListEditor items={cs.items} onChange={(items) => updateCustomItems(key, items)} placeholder="Add a line..." />
                      <label className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                        Column:
                        <select
                          value={cs.column || "main"}
                          onChange={(e) => setCustomSectionColumn(key, e.target.value)}
                          className="text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
                        >
                          <option value="main">Main column</option>
                          <option value="sidebar">Sidebar (Skills area) — Modern only</option>
                        </select>
                      </label>
                    </>
                  )}
                </div>
              );
            })}
            <div className="flex flex-wrap gap-3 pt-1">
              <button type="button" onClick={() => addCustomSection("main")} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"><Plus size={14} /> Add section (main)</button>
              <button type="button" onClick={() => addCustomSection("sidebar")} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"><Plus size={14} /> Add section (sidebar)</button>
              <button type="button" onClick={addPageBreak} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"><FileText size={14} /> Insert page break</button>
            </div>
          </Section>

          <Section title="Basic Info" icon={<User size={15} />}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-300 shrink-0">
                {data.photo ? <img src={data.photo} alt="Profile" className="w-full h-full object-cover" /> : <User size={24} className="text-slate-400" />}
              </div>
              <div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs font-medium bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-md"><Upload size={13} /> Upload photo</button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                {data.photo && <button type="button" onClick={() => set("photo", null)} className="text-xs text-red-500 mt-1 block hover:underline">Remove photo</button>}
              </div>
            </div>
            <Field label="Full Name" value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" />
            <Field label="Headline / Objective title" value={data.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Looking for: Entry Level Job" />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Phone" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 000 0000" />
              <Field label="Email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@email.com" />
            </div>
            <Field label="LinkedIn / Website" value={data.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="linkedin.com/in/janedoe" />
            <Field label="Address (optional)" value={data.address} onChange={(e) => set("address", e.target.value)} placeholder="City, Country" />
            <RichTextField label="Summary" rows={3} value={data.summary} onChange={(v) => set("summary", v)} placeholder="A short summary about you..." />
          </Section>

          <Section title="Education" icon={<GraduationCap size={15} />}>
            {data.education.map((ed) => (
              <RepeatingBlock key={ed.id} label="Education" onRemove={() => removeArrayItem("education", ed.id)}>
                <Field label="Degree / Exam" value={ed.degree} onChange={(e) => updateArrayItem("education", ed.id, "degree", e.target.value)} />
                <Field label="Institution" value={ed.institution} onChange={(e) => updateArrayItem("education", ed.id, "institution", e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Field / Major" value={ed.field} onChange={(e) => updateArrayItem("education", ed.id, "field", e.target.value)} />
                  <Field label="Score / GPA" value={ed.score} onChange={(e) => updateArrayItem("education", ed.id, "score", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Start" value={ed.start} onChange={(e) => updateArrayItem("education", ed.id, "start", e.target.value)} />
                  <Field label="End" value={ed.end} onChange={(e) => updateArrayItem("education", ed.id, "end", e.target.value)} />
                </div>
              </RepeatingBlock>
            ))}
            <button type="button" onClick={() => addArrayItem("education", emptyEducation)} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"><Plus size={14} /> Add education</button>
          </Section>

          <Section title="Experience" icon={<Briefcase size={15} />}>
            {data.experience.map((ex) => (
              <RepeatingBlock key={ex.id} label="Experience" onRemove={() => removeArrayItem("experience", ex.id)}>
                <Field label="Role / Title" value={ex.role} onChange={(e) => updateArrayItem("experience", ex.id, "role", e.target.value)} />
                <Field label="Company" value={ex.company} onChange={(e) => updateArrayItem("experience", ex.id, "company", e.target.value)} />
                <Field label="Location" value={ex.location} onChange={(e) => updateArrayItem("experience", ex.id, "location", e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Start" value={ex.start} onChange={(e) => updateArrayItem("experience", ex.id, "start", e.target.value)} />
                  <Field label="End" value={ex.end} onChange={(e) => updateArrayItem("experience", ex.id, "end", e.target.value)} />
                </div>
                <TextAreaField label="Duties (one per line)" rows={3} value={ex.duties} onChange={(e) => updateArrayItem("experience", ex.id, "duties", e.target.value)} />
              </RepeatingBlock>
            ))}
            <button type="button" onClick={() => addArrayItem("experience", emptyExperience)} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"><Plus size={14} /> Add experience</button>
          </Section>

          <Section title="Projects" icon={<FolderGit2 size={15} />} defaultOpen={false}>
            {data.projects.map((p) => (
              <RepeatingBlock key={p.id} label="Project" onRemove={() => removeArrayItem("projects", p.id)}>
                <Field label="Name" value={p.name} onChange={(e) => updateArrayItem("projects", p.id, "name", e.target.value)} />
                <RichTextField label="Description" rows={2} value={p.description} onChange={(v) => updateArrayItem("projects", p.id, "description", v)} />
                <Field label="Link" value={p.link} onChange={(e) => updateArrayItem("projects", p.id, "link", e.target.value)} />
              </RepeatingBlock>
            ))}
            <button type="button" onClick={() => addArrayItem("projects", emptyProject)} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"><Plus size={14} /> Add project</button>
          </Section>

          <Section title="Skills" icon={<Sparkles size={15} />} defaultOpen={false}>
            {data.skillGroups.map((sg) => (
              <RepeatingBlock key={sg.id} label="Skill group" onRemove={() => removeArrayItem("skillGroups", sg.id)}>
                <Field label="Category" value={sg.category} onChange={(e) => updateArrayItem("skillGroups", sg.id, "category", e.target.value)} placeholder="e.g. Technical Skills" />
                <TextAreaField label="Items (comma separated)" rows={2} value={sg.items} onChange={(e) => updateArrayItem("skillGroups", sg.id, "items", e.target.value)} />
              </RepeatingBlock>
            ))}
            <button type="button" onClick={() => addArrayItem("skillGroups", emptySkillGroup)} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"><Plus size={14} /> Add skill group</button>
          </Section>

          <Section title="Languages" icon={<LanguagesIcon size={15} />} defaultOpen={false}>
            <ListEditor items={data.languages} onChange={(v) => set("languages", v)} placeholder="e.g. English" />
          </Section>

          <Section title="Interests" icon={<Heart size={15} />} defaultOpen={false}>
            <ListEditor items={data.interests} onChange={(v) => set("interests", v)} placeholder="e.g. Reading" />
          </Section>

          <Section title="Personal Details" icon={<User size={15} />} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Father's Name" value={data.personal.father} onChange={(e) => setPersonal("father", e.target.value)} />
              <Field label="Mother's Name" value={data.personal.mother} onChange={(e) => setPersonal("mother", e.target.value)} />
              <Field label="Date of Birth" value={data.personal.dob} onChange={(e) => setPersonal("dob", e.target.value)} />
              <Field label="Nationality" value={data.personal.nationality} onChange={(e) => setPersonal("nationality", e.target.value)} />
              <Field label="Marital Status" value={data.personal.marital} onChange={(e) => setPersonal("marital", e.target.value)} />
              <Field label="Religion" value={data.personal.religion} onChange={(e) => setPersonal("religion", e.target.value)} />
              <Field label="Blood Group" value={data.personal.bloodGroup} onChange={(e) => setPersonal("bloodGroup", e.target.value)} />
            </div>
          </Section>

          <Section title="References" icon={<Users size={15} />} defaultOpen={false}>
            {data.references.map((r) => (
              <RepeatingBlock key={r.id} label="Reference" onRemove={() => removeArrayItem("references", r.id)}>
                <Field label="Name" value={r.name} onChange={(e) => updateArrayItem("references", r.id, "name", e.target.value)} />
                <Field label="Organization" value={r.organization} onChange={(e) => updateArrayItem("references", r.id, "organization", e.target.value)} />
                <Field label="Designation" value={r.designation} onChange={(e) => updateArrayItem("references", r.id, "designation", e.target.value)} />
                <Field label="Phone" value={r.phone} onChange={(e) => updateArrayItem("references", r.id, "phone", e.target.value)} />
              </RepeatingBlock>
            ))}
            <button type="button" onClick={() => addArrayItem("references", emptyReference)} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"><Plus size={14} /> Add reference</button>
          </Section>

          <div className="h-4" />
        </div>

        {/* PREVIEW PANEL */}
        <div className="print-area bg-slate-200 p-4 sm:p-8 overflow-y-auto max-h-[calc(100vh-57px)] flex justify-center">
          <div className="shadow-2xl print-page" style={{ width: "100%", maxWidth: "800px" }}>
            <div id="resume-preview" ref={previewRef} style={cssVars}>
              {template === "classic"
                ? <ClassicTemplate data={data} sectionOrder={sectionOrder} sectionTitles={sectionTitles} customSections={customSections} />
                : <ModernTemplate data={data} design={design} sectionOrder={sectionOrder} sectionTitles={sectionTitles} customSections={customSections} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= CLASSIC TEMPLATE ================= */
function ClassicTemplate({ data, sectionOrder, sectionTitles, customSections }) {
  return (
    <div className="bg-white" style={{ minHeight: "1123px", padding: "var(--page-margin)", fontFamily: "var(--body-font)", fontSize: "var(--body-size)", lineHeight: "var(--line-height)", color: "var(--text-color)" }}>
      {/* Header */}
      <div className="flex items-start justify-between" style={{ marginBottom: "var(--section-gap)" }}>
        <div className="flex-1 text-center">
          <h1 style={{ fontFamily: "var(--heading-font)", fontSize: "var(--name-size)", fontWeight: "var(--heading-weight)", letterSpacing: "0.02em" }}>{data.name || "Your Name"}</h1>
          {data.address && <p style={{ marginTop: 8, wordBreak: "break-word" }}>{data.address}</p>}
          {(data.phone || data.email) && <p style={{ wordBreak: "break-word" }}>{[data.phone && `Cell: ${data.phone}`, data.email && `E-MAIL: ${data.email}`].filter(Boolean).join(", ")}</p>}
        </div>
        {data.photo && <img src={data.photo} alt="Profile" className="w-28 h-32 object-cover border border-slate-300 ml-4 shrink-0" />}
      </div>

      {sectionOrder.map((key) => {
        if (key.startsWith("pagebreak-")) return <div key={key} style={{ breakAfter: "page" }} />;
        if (!sectionHasContent(key, data, customSections)) return null;
        return (
          <div key={key} style={{ marginBottom: "var(--section-gap)", breakInside: "avoid" }}>
            <div style={{ border: "2px solid #0f172a", padding: "6px 12px", marginBottom: 10, breakAfter: "avoid" }}>
              <h2 style={{ fontFamily: "var(--heading-font)", fontSize: "var(--heading-size)", fontWeight: "var(--heading-weight)" }}>{sectionTitles[key]}</h2>
            </div>
            <SectionBody sectionKey={key} data={data} customSections={customSections} />
          </div>
        );
      })}
    </div>
  );
}

/* ================= MODERN TEMPLATE ================= */
function ModernTemplate({ data, design, sectionOrder, sectionTitles, customSections }) {
  const isSidebarKey = (k) => {
    if (SIDEBAR_KEYS.includes(k)) return true;
    if (k.startsWith("custom-")) {
      const cs = customSections.find((c) => c.id === k);
      return cs?.column === "sidebar";
    }
    return false;
  };
  const sidebarKeys = sectionOrder.filter((k) => isSidebarKey(k) && sectionHasContent(k, data, customSections));
  const mainKeys = sectionOrder.filter((k) => k.startsWith("pagebreak-") || (!isSidebarKey(k) && sectionHasContent(k, data, customSections)));
  const headerIsLight = isLightColor(design.headerColor);
  const headerTextColor = headerIsLight ? "var(--text-color)" : "#ffffff";

  return (
    <div className="bg-white flex" style={{ minHeight: "1123px", fontFamily: "var(--body-font)", fontSize: "var(--body-size)", lineHeight: "var(--line-height)", color: "var(--text-color)" }}>
      {/* Sidebar */}
      <div className="w-[34%] bg-slate-50" style={{ padding: "var(--page-margin)" }}>
        <div className="w-full aspect-square rounded-md overflow-hidden bg-slate-200 flex items-center justify-center border border-slate-300" style={{ marginBottom: "var(--section-gap)" }}>
          {data.photo ? <img src={data.photo} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-slate-400" />}
        </div>
        {sidebarKeys.map((key) => (
          <div key={key} style={{ marginBottom: "var(--section-gap)", breakInside: "avoid" }}>
            <h3 style={{ fontFamily: "var(--heading-font)", fontWeight: "var(--heading-weight)", fontSize: "calc(var(--heading-size) * 0.8)", borderBottom: "2px solid #475569", paddingBottom: 4, marginBottom: 8, breakAfter: "avoid" }} className="uppercase tracking-wide">
              {sectionTitles[key]}
            </h3>
            <SectionBody sectionKey={key} data={data} customSections={customSections} />
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <div style={{ padding: "var(--page-margin)", paddingBottom: "calc(var(--page-margin) * 0.6)", background: design.headerColor, color: headerTextColor, borderBottom: headerIsLight ? "1px solid #e2e8f0" : "none" }}>
          <h1 style={{ fontFamily: "var(--heading-font)", fontSize: "var(--name-size)", fontWeight: "var(--heading-weight)", wordBreak: "break-word" }}>{data.name || "Your Name"}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1" style={{ marginTop: 10 }}>
            {data.phone && <span className="flex items-center gap-1"><Phone size={13} /> {data.phone}</span>}
            {data.email && <span className="flex items-center gap-1" style={{ wordBreak: "break-all" }}><Mail size={13} /> {data.email}</span>}
            {data.linkedin && <span className="flex items-center gap-1" style={{ wordBreak: "break-all" }}><Linkedin size={13} /> {data.linkedin}</span>}
          </div>
          {data.headline && <p style={{ marginTop: 8, opacity: 0.85 }}>{data.headline}</p>}
          {data.address && <p style={{ marginTop: 4, opacity: 0.85, wordBreak: "break-word" }}>{data.address}</p>}
        </div>

        <div className="flex-1" style={{ padding: "var(--page-margin)", paddingTop: "calc(var(--page-margin) * 0.6)" }}>
          {mainKeys.map((key) => {
            if (key.startsWith("pagebreak-")) return <div key={key} style={{ breakAfter: "page" }} />;
            return (
              <div key={key} style={{ marginBottom: "var(--section-gap)", breakInside: "avoid" }}>
                <h2 style={{ fontFamily: "var(--heading-font)", fontWeight: "var(--heading-weight)", fontSize: "var(--heading-size)", borderBottom: "2px solid #475569", paddingBottom: 6, marginBottom: 10, breakAfter: "avoid" }} className="uppercase tracking-wide">
                  {sectionTitles[key]}
                </h2>
                <SectionBody sectionKey={key} data={data} customSections={customSections} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
