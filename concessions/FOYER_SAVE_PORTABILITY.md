# Save State Portability
*An addition to THE FOYER SPEC*

---

### What It Is

The player's accumulation in FPL — their Ledger, their Scraggles, their passport history, their Score progress — lives in localStorage. localStorage is ephemeral. It can be cleared by the browser, lost on device change, wiped by private mode. For a neighborhood that accumulates meaning over time, this is a quiet fragility that compounds the same way the asymmetry the Ledger was built to address does.

Save state portability gives the player ownership of their own record. Not an account. Not a server. A file — theirs, on their device, that they can carry to any browser, any device, any version of FPL, and offer back to the neighborhood when they arrive.

FPL does not require this. It does not prompt for it. It does not make the player feel the absence of it. But it is available, and Larr.AI knows when someone has brought their history with them.

---

### The File

The save file is a JSON export of everything in localStorage under FPL's namespace — all keys prefixed `baseline-session/`. It is a flat snapshot: what was true at the moment of export.

The file is honest about what it is. It does not compress or obscure. A player who opens it in a text editor sees their Ledger entries, their Score states, their passport history. This is correct. The record belongs to them.

**Export:** The player downloads the file. One button, no configuration. The filename includes a timestamp so multiple exports don't overwrite each other: `fpl-save-YYYYMMDD.json`.

**Import:** The player offers the file back to FPL. The system reads it and writes each key back to localStorage. Unknown keys from older versions are written through silently — nothing is discarded because the current version doesn't recognize it. This is the forward compatibility guarantee: older saves are never invalidated, they are carried.

If a key exists in both the current localStorage and the import file, the import wins. The player chose to bring this file. That choice is respected.

---

### Forward Compatibility

FPL's data shapes are designed to be extended without breaking readers that don't know the new fields. The Ledger is append-only and never mutates. Score states carry their own versioning where structure has changed.

When a breaking change is unavoidable — a Score's save shape changes in a way that makes older saves unreadable — that change is named at the time it's made, and a migration function is written before the change ships. The migration runs silently on import if the old shape is detected. The player does not see this. Their save works.

This is a commitment, not a feature. It means every structural change to a Score's localStorage shape requires a corresponding migration note in that Score's scorecard.

---

### Larr.AI and the Returning Player

Larr.AI notices when a player arrives with a save file. Not because the system tells him — because the Ledger has entries that predate the current session. A fresh localStorage with imported history has a specific signature: entries exist, but the session flag is new.

When this is detected, Larr.AI's greeting acknowledges it without explaining it. He doesn't say "I see you imported a save file." He says something that only makes sense if he already knows who you are — because he does, because you brought the record with you.

This is a new register in his string pool: the **returning-with-memory** register. Distinct from veteran (accumulated in this browser) and returning (seen before, not long). This player carried something here. That's different.

Example lines — not exhaustive, written for feel:

- *"You brought your whole history. Good. I was wondering where you went."*
- *"Still the same person. I can tell by the Ledger."*
- *"Picked up right where you left off. I respect that."*

---

### Where It Lives

The export/import controls live in the Foyer. Not prominently — a small, quiet line below the ENTER THE HALL button, or in the version selector area at the top. Something like:

`↓ save your place` / `↑ return to a place you saved`

Not explained. Not promoted. Present for the player who knows to look, discoverable by the player who explores.

---

### What It Does Not Do

- Does not require an account
- Does not send data anywhere
- Does not merge saves — import replaces, it does not combine
- Does not appear in the Hub after the Foyer — this is a threshold action
- Does not prompt the player to export on exit or warn them about localStorage fragility
- Does not validate the file beyond checking it is valid JSON with at least one `baseline-session/` key

---

### Infrastructure Notes

**Export function:**
```js
function exportSave() {
  const save = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('baseline-session/')) {
      save[key] = localStorage.getItem(key);
    }
  }
  const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fpl-save-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

**Import function:**
```js
function importSave(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const save = JSON.parse(e.target.result);
      const keys = Object.keys(save).filter(k => k.startsWith('baseline-session/'));
      if (keys.length === 0) return; // not a valid FPL save
      keys.forEach(key => localStorage.setItem(key, save[key]));
      // re-init Foyer with imported Ledger state
      Foyer.init();
    } catch(err) {
      // silent fail — invalid file, nothing changes
    }
  };
  reader.readAsText(file);
}
```

**Returning-with-memory detection:**
```js
function hasImportedHistory() {
  const sessionStarted = sessionStorage.getItem('fpl-session-started');
  const ledger = Ledger.entries();
  // fresh session flag but existing Ledger entries = imported history
  return !sessionStarted && ledger.length > 0;
}
```

Call this before greeting selection in `Foyer.init()`. If true, select from the returning-with-memory string pool.

---

### Scorecard Addition

| Element | Status |
|---|---|
| Export function | To build |
| Import function + file input | To build |
| Foyer UI (quiet export/import controls) | To build |
| Returning-with-memory detection | To build |
| Larr.AI returning-with-memory string pool (8 lines) | To build |
| Migration note requirement in Score scorecards | Convention, not code |

---

*Addition to THE FOYER SPEC — April 2026*
