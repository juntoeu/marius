/* =========================================================================
   Sitzplan – Hochzeit
   Zero-dependency seating planner with pointer-based drag & drop + click-to-assign.
   Works on desktop and touch. Auto-saves to localStorage.
   ========================================================================= */

(() => {
  "use strict";

  /* ----------------------------- Guest data ----------------------------- */
  const GUEST_NAMES = [
    "Marc Scheper", "selina", "Manuel", "Fabian Harb", "Charlotte Beimesche",
    "Marie Preußer", "Rashko", "Philipp Schwägler", "Charlotte Heuser",
    "Leonie Karremann (+1)", "Louis Carl Shamlou", "Chris Welter", "Alexander Jensson",
    "Nora Jensson", "Raphael Eder", "Laura Zorn", "Yasmina Butt", "Asif butt",
    "Philipp Emig", "Franziska Mühlbeyer-E.", "Vanessa Götz", "Antonia Dreier",
    "Timo Schoppa", "Judith Buchholz", "Anne Pelzer", "Max Molzberger", "Johan Kemper",
    "Mats Multhaupt", "Lisa Böckel", "Sebastian Kießling", "Jasper Böckel",
    "Alexandra Lechner", "eva räder", "Carsten", "Sinan Sağlam", "Johanna Beeck",
    "Tristan Pepe Steinhoff", "Ludwig Anton Kemper", "Frank Kemper", "Hovhannes Stepanyan",
    "KHH & Paula Beck", "Trixi Strobel", "Leon Tiedemann-Friedl", "Lukas", "Ferdinand",
    "Lucy Dreger", "Caroline Franzenburg", "Henning Sökeland", "Nicole Eversberg",
    "Anna Kappuhne", "Hannah Schreiner", "Axel Julicher", "Imke Nellessen",
    "Claudia Jaworski", "Fabian Schreier", "Romy Tegen", "Georg Dehio", "Christina Dehio",
    "Verena Albrecht", "Hannah Keller", "Matteo Conticelli", "Laura Carrillo Adam",
    "Eliane Sophie Jahn", "Julia Keller", "Katharina Eppers", "Theresa Heinkelmann-W.",
    "Steffen Wahl", "Charlotte Kling", "Melusine Bliesener", "Catalina Wache",
    "Felix Jourdan", "Lilli-Mercedes Wahl", "Benjamin Harr", "Asia", "Lena Döring",
    "Nele Döring", "Amelie Döring", "Christian Döring", "Leon Reuß", "Justus Basler",
    "Arndt Allmeling", "Marielen", "Antonia Basler", "Diana Jourdan",
    "Samantha Loew-Albrecht", "Dario Loew-Albrecht", "Felix Schumann", "Katrin Abel",
    "Malte Lemm", "Laura Wollermann", "Sarah Shamlou", "Konstantin Nellessen",
    "Paul Girlich", "Simon Tasso", "Nadine Früh", "Julia Wahl", "Moritz Modersohn",
    "Titus Pachelbel", "Fiona Bustorff", "Florian Fabarius", "Johannes Schnell-Kretsch.",
    "Philip Okon", "Anna Knobling", "Leonie Ahrend", "Karl Ahrend", "Nita Zeneli",
    "Philipp Alscher", "Kreshnik Ramici", "Luise Dreier", "Saskia Menke", "Marlise Schneider",
  ];

  const guests = GUEST_NAMES.map((name, i) => ({ id: "g" + i, name }));

  /* --------------------------- Table layout ----------------------------- */
  // Stage coordinate space (logical px). The stage is scaled via CSS zoom.
  const STAGE_W = 1660;
  const STAGE_H = 1180;
  const SEAT = 40;        // seat diameter
  const SEAT_GAP = 30;    // distance from table edge to seat centre

  // Build seats spread evenly along a line.
  function lineSeats(prefix, startIndex, count, x0, y0, x1, y1) {
    const seats = [];
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : (i + 0.5) / count;
      seats.push({
        id: prefix + "-" + (startIndex + i),
        label: String(startIndex + i),
        x: x0 + (x1 - x0) * t,
        y: y0 + (y1 - y0) * t,
      });
    }
    return seats;
  }

  // Horizontal table: seats along top edge then bottom edge.
  function hTable(id, label, cap, x, y, w, h, topCount, bottomCount) {
    const topY = y - SEAT_GAP;
    const botY = y + h + SEAT_GAP;
    const seats = [
      ...lineSeats(id, 1, topCount, x, topY, x + w, topY),
      ...lineSeats(id, topCount + 1, bottomCount, x, botY, x + w, botY),
    ];
    return { id, label, cap, rect: { x, y, w, h }, seats, capX: x + w / 2, capY: y + h + SEAT_GAP * 2 + 4 };
  }

  // Vertical table T1: 5 left, 5 right, 1 top, 1 bottom.
  function vTable(id, label, cap, x, y, w, h) {
    const leftX = x - SEAT_GAP;
    const rightX = x + w + SEAT_GAP;
    const topY = y - SEAT_GAP;
    const botY = y + h + SEAT_GAP;
    const seats = [
      ...lineSeats(id, 1, 5, leftX, y, leftX, y + h),                 // 1-5 left
      ...lineSeats(id, 6, 5, rightX, y, rightX, y + h),               // 6-10 right
      { id: id + "-11", label: "11", x: x + w / 2, y: topY },         // 11 top
      { id: id + "-12", label: "12", x: x + w / 2, y: botY },         // 12 bottom
    ];
    return { id, label, cap, rect: { x, y, w, h }, seats, capX: x + w / 2, capY: y + h + SEAT_GAP + 14 };
  }

  const TABLES = [
    vTable("T1", "T1", "Tisch 1 · Groß (12 Pax)", 150, 250, 86, 360),
    hTable("T2", "T2", "Tisch 2 · 6 × 6 Pax (36 Pax)", 330, 330, 1000, 96, 18, 18),
    hTable("T4a", "T4a", "Tisch 4a · Baum (8 Pax)", 420, 640, 210, 72, 4, 4),
    hTable("T4b", "T4b", "Tisch 4b · Baum (8 Pax)", 900, 640, 210, 72, 4, 4),
    hTable("T5", "T5", "Tisch 5 · Wintergarten (10 Pax)", 150, 878, 230, 72, 5, 5),
    hTable("T3", "T3", "Tisch 3 · 9 × 4 Pax (36 Pax)", 430, 980, 900, 96, 18, 18),
  ];

  const ZONES = [
    { kind: "wintergarten", label: "Wintergarten", x: 110, y: 776, w: 320, h: 285, labelX: 130, labelY: 788 },
  ];
  const DECOS = [
    { kind: "bar", text: "Bar · Food", x: 560, y: 40, w: 660, h: 84 },
    { kind: "baum", text: "Baum", x: 690, y: 600, w: 150, h: 150 },
    { kind: "eingang", text: "Eingang", x: 1530, y: 760, w: 78, h: 200 },
  ];

  const seatById = {};
  const allSeatIds = [];
  TABLES.forEach((t) => t.seats.forEach((s) => { seatById[s.id] = s; s.tableId = t.id; allSeatIds.push(s.id); }));
  const TOTAL_SEATS = allSeatIds.length;

  /* ------------------------------- State -------------------------------- */
  const STORAGE_KEY = "sitzplan.samstag.v1";
  // assignments: seatId -> guestId
  let assignments = {};
  let selected = null; // { type: 'guest'|'seat', id }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        // keep only valid seats/guests
        const valid = {};
        const guestIds = new Set(guests.map((g) => g.id));
        Object.entries(data.assignments || {}).forEach(([seatId, gid]) => {
          if (seatById[seatId] && guestIds.has(gid)) valid[seatId] = gid;
        });
        assignments = valid;
      }
    } catch (e) { assignments = {}; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ assignments })); } catch (e) {}
  }

  function guestById(id) { return guests.find((g) => g.id === id); }
  function seatOfGuest(gid) { return Object.keys(assignments).find((sid) => assignments[sid] === gid); }
  function placedCount() { return Object.keys(assignments).length; }

  /* ---------------------------- Avatar colors --------------------------- */
  function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
  function avatarStyle(name) {
    const h = Math.abs(hashStr(name)) % 360;
    const c1 = `hsl(${h} 55% 68%)`;
    const c2 = `hsl(${(h + 28) % 360} 50% 56%)`;
    return `background:linear-gradient(150deg, ${c1}, ${c2});`;
  }
  function initials(name) {
    const clean = name.replace(/\(.*?\)/g, "").replace(/[&]/g, " ").trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /* ------------------------------- DOM ---------------------------------- */
  const $ = (id) => document.getElementById(id);
  const stage = $("stage");
  const chipsEl = $("chips");
  const poolEl = $("pool");
  const statsEl = $("stats");
  const hintEl = $("hint");
  const hintText = $("hintText");
  const searchEl = $("search");
  const toastEl = $("toast");

  /* --------------------------- Build the stage -------------------------- */
  function buildStage() {
    stage.style.width = STAGE_W + "px";
    stage.style.height = STAGE_H + "px";
    stage.innerHTML = "";

    // zones
    ZONES.forEach((z) => {
      const d = document.createElement("div");
      d.className = "zone " + z.kind;
      Object.assign(d.style, { left: z.x + "px", top: z.y + "px", width: z.w + "px", height: z.h + "px" });
      stage.appendChild(d);
      const lab = document.createElement("div");
      lab.className = "zone-label";
      lab.textContent = z.label;
      Object.assign(lab.style, { left: z.labelX + "px", top: z.labelY + "px" });
      stage.appendChild(lab);
    });

    // decorations
    DECOS.forEach((dc) => {
      const d = document.createElement("div");
      d.className = "deco " + dc.kind;
      d.textContent = dc.text;
      Object.assign(d.style, { left: dc.x + "px", top: dc.y + "px", width: dc.w + "px", height: dc.h + "px" });
      stage.appendChild(d);
    });

    // tables + seats
    TABLES.forEach((t) => {
      const tbl = document.createElement("div");
      tbl.className = "table";
      Object.assign(tbl.style, { left: t.rect.x + "px", top: t.rect.y + "px", width: t.rect.w + "px", height: t.rect.h + "px" });
      const lbl = document.createElement("div");
      lbl.className = "tlabel";
      lbl.textContent = t.label;
      tbl.appendChild(lbl);
      stage.appendChild(tbl);

      const cap = document.createElement("div");
      cap.className = "table-cap";
      cap.textContent = t.cap;
      Object.assign(cap.style, { left: (t.capX - 120) + "px", top: t.capY + "px" });
      stage.appendChild(cap);

      // fill badge near caption
      const badge = document.createElement("div");
      badge.className = "table-badge";
      badge.dataset.tableBadge = t.id;
      Object.assign(badge.style, { left: (t.capX + 70) + "px", top: (t.capY - 2) + "px" });
      stage.appendChild(badge);

      t.seats.forEach((s) => {
        const el = document.createElement("div");
        el.className = "seat";
        el.dataset.seat = s.id;
        el.style.width = SEAT + "px";
        el.style.height = SEAT + "px";
        el.style.left = s.x + "px";
        el.style.top = s.y + "px";
        stage.appendChild(el);
      });
    });
  }

  /* ----------------------------- Rendering ------------------------------ */
  function renderChips() {
    const q = searchEl.value.trim().toLowerCase();
    chipsEl.innerHTML = "";
    const unplaced = guests.filter((g) => !seatOfGuest(g.id));
    unplaced.forEach((g) => {
      const chip = document.createElement("div");
      chip.className = "chip" + (selected && selected.type === "guest" && selected.id === g.id ? " selected" : "");
      if (q && !g.name.toLowerCase().includes(q)) chip.classList.add("hidden");
      chip.dataset.guest = g.id;
      chip.innerHTML =
        `<span class="avatar" style="${avatarStyle(g.name)}">${initials(g.name)}</span>` +
        `<span class="name">${escapeHtml(g.name)}</span>`;
      chipsEl.appendChild(chip);
    });
    if (!unplaced.length) {
      const done = document.createElement("div");
      done.style.color = "var(--text-dim)";
      done.textContent = "Alle Gäste platziert 🎉";
      chipsEl.appendChild(done);
    }
  }

  function renderSeats() {
    allSeatIds.forEach((sid) => {
      const el = stage.querySelector(`[data-seat="${sid}"]`);
      const s = seatById[sid];
      const gid = assignments[sid];
      el.classList.toggle("selected", !!(selected && selected.type === "seat" && selected.id === sid));
      if (gid) {
        const g = guestById(gid);
        el.classList.add("occupied");
        el.innerHTML =
          `<span class="seat-av" style="${avatarStyle(g.name)}">${initials(g.name)}</span>` +
          `<span class="seat-name">${escapeHtml(firstWord(g.name))}</span>`;
        el.title = g.name + " · Platz " + s.label;
      } else {
        el.classList.remove("occupied");
        el.innerHTML = s.label;
        el.title = "Platz " + s.label + " (frei)";
      }
    });
    // table fill badges
    TABLES.forEach((t) => {
      const filled = t.seats.filter((s) => assignments[s.id]).length;
      const badge = stage.querySelector(`[data-table-badge="${t.id}"]`);
      if (badge) badge.textContent = `${filled} / ${t.seats.length}`;
    });
  }

  function renderStats() {
    const placed = placedCount();
    statsEl.innerHTML =
      `<b>${guests.length}</b> Gäste · <b>${placed}</b> platziert · ` +
      `<span class="open">${guests.length - placed} offen</span> · ` +
      `<b>${TOTAL_SEATS}</b> Plätze gesamt`;
  }

  function renderHint() {
    if (!selected) { hintEl.classList.remove("show"); return; }
    hintEl.classList.add("show");
    if (selected.type === "guest") {
      const g = guestById(selected.id);
      hintText.textContent = `„${g.name}" ausgewählt – klick auf einen freien Platz, um ihn dorthin zu setzen.`;
    } else {
      const g = guestById(assignments[selected.id]);
      hintText.textContent = `„${g ? g.name : "Platz"}" ausgewählt – klick auf einen anderen Platz (Tausch) oder in den Pool (entfernen).`;
    }
  }

  function renderAll() { renderChips(); renderSeats(); renderStats(); renderHint(); save(); }

  function firstWord(name) { return name.replace(/\(.*?\)/g, "").trim().split(/\s+/)[0]; }
  function escapeHtml(s) { return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  /* --------------------------- Assignment ops --------------------------- */
  function assign(seatId, guestId) {
    // remove guest from any current seat
    const prev = seatOfGuest(guestId);
    if (prev) delete assignments[prev];
    assignments[seatId] = guestId;
  }
  function unassignSeat(seatId) { delete assignments[seatId]; }

  // Drop a guest onto a seat (handles swap if occupied).
  function dropGuestOnSeat(guestId, seatId) {
    const fromSeat = seatOfGuest(guestId);          // null if from pool
    const occupant = assignments[seatId];
    if (occupant === guestId) return;
    if (occupant && fromSeat) {
      // swap two seated guests
      assignments[fromSeat] = occupant;
      assignments[seatId] = guestId;
    } else if (occupant && !fromSeat) {
      // guest from pool displaces occupant back to pool
      assignments[seatId] = guestId;
    } else {
      assign(seatId, guestId);
    }
    toast(`${guestById(guestId).name} → Platz ${seatById[seatId].label}`);
  }

  /* ------------------------------ Selection ----------------------------- */
  function clearSelection() { selected = null; }

  function handleGuestClick(guestId) {
    if (selected && selected.type === "seat") {
      // a seat (occupied) was selected, clicking a pool guest swaps that guest into the seat
      const seatId = selected.id;
      dropGuestOnSeat(guestId, seatId);
      clearSelection();
      renderAll();
      return;
    }
    if (selected && selected.type === "guest" && selected.id === guestId) {
      clearSelection();
    } else {
      selected = { type: "guest", id: guestId };
    }
    renderAll();
  }

  function handleSeatClick(seatId) {
    const occupant = assignments[seatId];
    if (selected && selected.type === "guest") {
      dropGuestOnSeat(selected.id, seatId);
      clearSelection();
      renderAll();
      return;
    }
    if (selected && selected.type === "seat") {
      if (selected.id === seatId) { clearSelection(); renderAll(); return; }
      // move/swap between two seats
      const a = selected.id, b = seatId;
      const ga = assignments[a], gb = assignments[b];
      if (ga && gb) { assignments[a] = gb; assignments[b] = ga; }
      else if (ga && !gb) { delete assignments[a]; assignments[b] = ga; }
      else if (!ga && gb) { delete assignments[b]; assignments[a] = gb; }
      clearSelection();
      renderAll();
      return;
    }
    // nothing selected
    if (occupant) { selected = { type: "seat", id: seatId }; renderAll(); }
    // empty seat with nothing selected: no-op
  }

  /* --------------------------- Pointer drag ----------------------------- */
  // Custom drag works for mouse + touch via Pointer Events.
  let drag = null; // { type, id, ghost, moved }
  const DRAG_THRESHOLD = 5;

  function onPointerDown(e) {
    if (e.button != null && e.button !== 0) return;
    const chip = e.target.closest("[data-guest]");
    const seatEl = e.target.closest('[data-seat]');
    let src = null;
    if (chip) src = { type: "guest", id: chip.dataset.guest, el: chip };
    else if (seatEl && seatEl.classList.contains("occupied")) {
      src = { type: "seat", id: seatEl.dataset.seat, el: seatEl, guestId: assignments[seatEl.dataset.seat] };
    } else if (seatEl) {
      // empty seat: click-only (select / drop target), no drag
      src = { type: "seat", id: seatEl.dataset.seat, el: seatEl, clickOnly: true };
    }
    if (!src) return;
    drag = { ...src, startX: e.clientX, startY: e.clientY, moved: false, ghost: null, pointerId: e.pointerId };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  }

  function makeGhost(name) {
    const g = document.createElement("div");
    g.className = "ghost";
    g.innerHTML = `<span class="avatar" style="${avatarStyle(name)}">${initials(name)}</span><span>${escapeHtml(name)}</span>`;
    document.body.appendChild(g);
    return g;
  }

  function onPointerMove(e) {
    if (!drag || drag.clickOnly) return;
    const dx = e.clientX - drag.startX, dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    if (!drag.moved) {
      drag.moved = true;
      const gid = drag.type === "guest" ? drag.id : drag.guestId;
      drag.ghost = makeGhost(guestById(gid).name);
      document.body.style.cursor = "grabbing";
    }
    drag.ghost.style.left = e.clientX + "px";
    drag.ghost.style.top = e.clientY + "px";
    // highlight drop target
    clearDropHighlights();
    const tgt = dropTargetAt(e.clientX, e.clientY);
    if (tgt.kind === "seat") tgt.el.classList.add("target");
    else if (tgt.kind === "pool") poolEl.classList.add("dropring");
  }

  function onPointerUp(e) {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
    document.body.style.cursor = "";
    const d = drag;
    drag = null;
    clearDropHighlights();

    if (!d) return;
    if (d.ghost) d.ghost.remove();

    if (!d.moved) {
      // treat as a click
      if (d.type === "guest") handleGuestClick(d.id);
      else handleSeatClick(d.id);
      return;
    }

    const tgt = dropTargetAt(e.clientX, e.clientY);
    if (tgt.kind === "seat") {
      const gid = d.type === "guest" ? d.id : d.guestId;
      dropGuestOnSeat(gid, tgt.el.dataset.seat);
    } else if (tgt.kind === "pool") {
      if (d.type === "seat") { unassignSeat(d.id); toast(`${guestById(d.guestId).name} → Pool`); }
    }
    clearSelection();
    renderAll();
  }

  function dropTargetAt(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return { kind: null };
    const seatEl = el.closest && el.closest("[data-seat]");
    if (seatEl) return { kind: "seat", el: seatEl };
    if (el.closest && el.closest("#pool")) return { kind: "pool" };
    return { kind: null };
  }

  function clearDropHighlights() {
    stage.querySelectorAll(".seat.target").forEach((s) => s.classList.remove("target"));
    poolEl.classList.remove("dropring");
  }

  /* ------------------------------- Zoom --------------------------------- */
  let zoom = 1;
  function applyZoom() {
    stage.style.transform = `scale(${zoom})`;
    const scroll = stage.parentElement; // .stage-scroll
    scroll.style.width = "100%";
    scroll.style.height = (STAGE_H * zoom + 8) + "px";
    // reserve scroll width
    stage.parentElement.style.minWidth = "0";
    $("zoomVal").textContent = Math.round(zoom * 100) + "%";
  }
  function setZoom(z) { zoom = Math.min(1.6, Math.max(0.4, z)); applyZoom(); }
  function fitZoom() {
    const frameW = stage.parentElement.clientWidth || (window.innerWidth - 100);
    setZoom(Math.min(1, frameW / STAGE_W));
  }

  /* ------------------------------ Toast --------------------------------- */
  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1600);
  }

  /* ------------------------------ Wiring -------------------------------- */
  function wire() {
    stage.addEventListener("pointerdown", onPointerDown);
    chipsEl.addEventListener("pointerdown", onPointerDown);

    // background click clears selection
    document.addEventListener("pointerdown", (e) => {
      if (e.target.closest("[data-guest]") || e.target.closest("[data-seat]")) return;
      if (e.target.closest(".controls") || e.target.closest(".hint")) return;
      if (selected && !drag) { /* allow pool drop highlight etc. */ }
    });

    searchEl.addEventListener("input", renderChips);

    $("zoomIn").onclick = () => setZoom(zoom + 0.1);
    $("zoomOut").onclick = () => setZoom(zoom - 0.1);
    $("zoomFit").onclick = fitZoom;
    $("printBtn").onclick = () => window.print();
    $("resetBtn").onclick = () => {
      if (confirm("Alle Platzierungen zurücksetzen? Das kann nicht rückgängig gemacht werden.")) {
        assignments = {}; clearSelection(); renderAll();
        toast("Sitzplan zurückgesetzt");
      }
    };
    $("hintCancel").onclick = () => { clearSelection(); renderAll(); };

    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { clearSelection(); renderAll(); } });
    window.addEventListener("resize", () => { if (zoom < 1) fitZoom(); });
  }

  /* ------------------------------- Init --------------------------------- */
  load();
  buildStage();
  wire();
  renderAll();
  fitZoom();
})();
