/**
 * POLYBIUS ARCHIVE-81 — light interactivity
 * Fiction / folklore only.
 */

(function () {
  "use strict";

  const BOOT_LINES = [
    "SOMUS BIOS v0.81 — TEMPUS NULL",
    "Memory check ........... 640K OK",
    "Scanning coin-op bus ...",
    "Cabinet ID: UNKNOWN",
    "Marquee string: P O L Y B I U S",
    "",
    "WARNING: No manufacturer certificate found.",
    "WARNING: ROM signature mismatch.",
    "",
    "Loading folklore archive...",
    "Mounting /myth/portland/1981 ... OK",
    "Authenticity flag: FALSE",
    "",
    "NOTE: No authentic Polybius ROM is known to exist.",
    "Proceeding in DEMO / FOLKLORE mode.",
    "",
    "> ACCESS GRANTED (read-only)",
  ];

  const STORY_FRAGMENTS = [
    "// fragment: portland.arcade.rumor",
    "They said the stick moved itself.",
    "Scores climbed. Then names vanished from the boards.",
    "Black vans. No invoices. No forwarding address.",
    "PROPERTY OF SOMUS — peel and it was blank underneath.",
    "Players woke with geometric afterimages.",
    "One week. Maybe two. Then nothing.",
    "Tempest's cousin, people joked. Wrong color.",
    "Dream log #4: tunnels of amber light.",
    "Forum echo, 1999: 'I swear I played it.'",
    "Collector note: boards never listed on eBay.",
    "CIA rumor cycle — unverified, recursive.",
    "Polybius the historian wrote of cycles. Irony.",
    "END FRAGMENT — authenticity: MYTH",
  ];

  function randHex(n) {
    const hex = "0123456789ABCDEF";
    let s = "";
    for (let i = 0; i < n; i++) s += hex[(Math.random() * 16) | 0];
    return s;
  }

  function buildHexLine(addr) {
    const bytes = [];
    for (let i = 0; i < 8; i++) bytes.push(randHex(2));
    return (
      addr.toString(16).toUpperCase().padStart(4, "0") +
      ": " +
      bytes.join(" ") +
      "  |" +
      gibberAscii(8) +
      "|"
    );
  }

  function gibberAscii(n) {
    const chars = ".:*+#@%░▒▓█abcdefghijklmnopqrstuvwxyz";
    let s = "";
    for (let i = 0; i < n; i++) {
      s += chars[(Math.random() * chars.length) | 0];
    }
    return s;
  }

  function buildDump(lines) {
    const out = [];
    let addr = 0x0000;
    let fragIdx = 0;
    for (let i = 0; i < lines; i++) {
      if (i > 0 && i % 5 === 0 && fragIdx < STORY_FRAGMENTS.length) {
        out.push("");
        out.push("; " + STORY_FRAGMENTS[fragIdx++]);
        out.push("");
      } else {
        out.push(buildHexLine(addr));
        addr += 8;
      }
    }
    out.push("");
    out.push("; === DUMP COMPLETE ===");
    out.push("; authenticity: FABRICATED / FOLKLORE");
    out.push("; no authentic Polybius ROM is known to exist");
    return out.join("\n");
  }

  /* ——— Boot sequence ——— */
  const boot = document.getElementById("boot");
  const bootLog = document.getElementById("boot-log");
  const bootSkip = document.getElementById("boot-skip");
  let bootTimer = null;
  let bootDone = false;

  function finishBoot() {
    if (bootDone) return;
    bootDone = true;
    if (bootTimer) clearTimeout(bootTimer);
    boot.classList.add("is-done");
    document.body.style.overflow = "";
  }

  function runBoot() {
    document.body.style.overflow = "hidden";
    let i = 0;
    bootLog.textContent = "";

    function next() {
      if (bootDone) return;
      if (i >= BOOT_LINES.length) {
        bootTimer = setTimeout(finishBoot, 700);
        return;
      }
      bootLog.textContent += BOOT_LINES[i] + "\n";
      i++;
      const delay = BOOT_LINES[i - 1] === "" ? 180 : 90 + Math.random() * 120;
      bootTimer = setTimeout(next, delay);
    }
    next();
  }

  if (bootSkip) bootSkip.addEventListener("click", finishBoot);
  // Auto-skip if reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishBoot();
  } else {
    runBoot();
  }

  /* ——— Modal ——— */
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");
  const modalBox = modal && modal.querySelector(".modal__box");

  function showModal(title, body, denied) {
    if (!modal) return;
    modalTitle.textContent = title;
    modalBody.textContent = body;
    if (modalBox) {
      modalBox.classList.toggle("is-denied", !!denied);
    }
    modal.hidden = false;
  }

  function hideModal() {
    if (modal) modal.hidden = true;
  }

  if (modalClose) modalClose.addEventListener("click", hideModal);
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) hideModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideModal();
  });

  /* ——— Insert coin ——— */
  const insertCoin = document.getElementById("insert-coin");
  if (insertCoin) {
    insertCoin.addEventListener("click", function () {
      showModal(
        "INSERT COIN",
        [
          "> coin slot: jammed",
          "> credit: 00",
          "> attract mode: FOLKLORE",
          "",
          "This machine accepts stories,",
          "not quarters.",
          "",
          "No authentic Polybius ROM",
          "is known to exist.",
        ].join("\n"),
        false
      );
    });
  }

  /* ——— Access denied ——— */
  const accessBtn = document.getElementById("access-denied-btn");
  if (accessBtn) {
    accessBtn.addEventListener("click", function () {
      showModal(
        "ACCESS DENIED",
        [
          "ERROR 0x81 — CLEARANCE INSUFFICIENT",
          "",
          "Classified partition empty.",
          "Or never written.",
          "",
          "Men in black collected the keys",
          "before the archive was built.",
          "",
          "[ RETRY DISABLED ]",
        ].join("\n"),
        true
      );
    });
  }

  /* ——— ROM dump ——— */
  const romDump = document.getElementById("rom-dump");
  const romStatus = document.getElementById("rom-status");
  const romDumpBtn = document.getElementById("rom-dump-btn");
  const romGlitchBtn = document.getElementById("rom-glitch-btn");
  let glitchTimer = null;

  function typeDump(text, onDone) {
    if (!romDump) return;
    romDump.textContent = "";
    romDump.classList.remove("is-glitching");
    if (romStatus) romStatus.textContent = "DUMPING...";
    let i = 0;
    const chunk = 24;

    function step() {
      if (i >= text.length) {
        if (romStatus) romStatus.textContent = "COMPLETE · FAKE";
        if (onDone) onDone();
        return;
      }
      romDump.textContent += text.slice(i, i + chunk);
      i += chunk;
      romDump.scrollTop = romDump.scrollHeight;
      setTimeout(step, 16);
    }
    step();
  }

  if (romDumpBtn) {
    romDumpBtn.addEventListener("click", function () {
      if (glitchTimer) {
        clearTimeout(glitchTimer);
        glitchTimer = null;
      }
      typeDump(buildDump(36));
    });
  }

  if (romGlitchBtn && romDump) {
    romGlitchBtn.addEventListener("click", function () {
      if (!romDump.textContent) {
        romDump.textContent = buildDump(20);
      }
      romDump.classList.add("is-glitching");
      if (romStatus) romStatus.textContent = "SIGNAL NOISE";
      if (glitchTimer) clearTimeout(glitchTimer);
      glitchTimer = setTimeout(function () {
        romDump.classList.remove("is-glitching");
        if (romStatus) romStatus.textContent = "STABLE · FAKE";
        // inject a glitched line
        romDump.textContent +=
          "\n\n; ▓▓ GLITCH ▓▓ fragment recovered:\n; \"the cabinet dreamed us first\"\n";
        romDump.scrollTop = romDump.scrollHeight;
      }, 900);
    });
  }

  // Seed empty dump prompt
  if (romDump) {
    romDump.textContent =
      "> awaiting dump command...\n> authenticity: FABRICATED\n> tip: RUN DUMP or GLITCH";
  }
})();
