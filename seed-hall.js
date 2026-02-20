#!/usr/bin/env node

/**
 * Grimoire → Hall Conversion Script
 * 
 * Reads a Living Grimoire export file and creates entity folders
 * with proper Tuning files, emoji memory, and journals.
 * 
 * Usage: node seed-hall.js grimoire-export.json
 */

const fs = require("fs");
const path = require("path");

// --- Configuration ---
const DEFAULT_NEIGHBORHOOD = "greengarden";
const ENTITIES_DIR = "entities";

// --- Helpers ---
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function categoryLabel(cat) {
  var labels = {
    spirit: "Spirit",
    item: "Item",
    location: "Location",
    tendency: "Tendency",
    action: "Action",
  };
  return labels[cat] || "Spirit";
}

// --- Main ---
var args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node seed-hall.js <grimoire-export.json>");
  console.log("");
  console.log("Converts a Living Grimoire export into entity folders.");
  process.exit(1);
}

var inputFile = args[0];
if (!fs.existsSync(inputFile)) {
  console.error("File not found: " + inputFile);
  process.exit(1);
}

var raw = fs.readFileSync(inputFile, "utf8");
var data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error("Could not parse JSON: " + e.message);
  process.exit(1);
}

var entries = data.entries || data;
if (!Array.isArray(entries)) {
  console.error("No entries array found in the file.");
  process.exit(1);
}

var journal = data.journal || [];

console.log("");
console.log("  The Hall - Entity Seeding");
console.log("  ========================");
console.log("");
console.log("  Found " + entries.length + " entities in grimoire export.");
console.log("  Journal entries: " + journal.length);
console.log("  Neighborhood: " + DEFAULT_NEIGHBORHOOD);
console.log("");

// Create base directories
var neighborhoodDir = path.join(ENTITIES_DIR, DEFAULT_NEIGHBORHOOD);
ensureDir(neighborhoodDir);

var created = 0;

for (var i = 0; i < entries.length; i++) {
  var entry = entries[i];
  var name = entry.name;
  var slug = slugify(name);
  var category = entry.category || "spirit";
  var description = entry.description || "";
  var tags = entry.tags || [];
  var createdDate = entry.created
    ? new Date(entry.created).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  // Create entity folder
  var entityDir = path.join(neighborhoodDir, slug);
  ensureDir(entityDir);

  // --- tuning.md ---
  var tuning = "# " + name + "\n\n";
  tuning += "**Category:** " + categoryLabel(category) + "\n\n";
  if (description) {
    tuning += description + "\n\n";
  }
  if (tags.length > 0) {
    tuning += "**Tags:** " + tags.join(", ") + "\n\n";
  }
  tuning += "---\n\n";
  tuning += "**Remembering style:** *(undefined — awaiting first experiences)*\n\n";
  tuning += "**Forgetting style:** *(undefined — awaiting first experiences)*\n\n";
  tuning += "**Memory capacity:** *(undefined)*\n\n";
  tuning += "---\n\n";
  tuning += "*Inscribed " + createdDate + "*\n";

  fs.writeFileSync(path.join(entityDir, "tuning.md"), tuning);

  // --- memory.md ---
  var memory = "# Memory\n\n";
  memory += "## Emoji\n\n";
  memory += "*(empty — no experiences yet)*\n\n";
  memory += "## Style Notes\n\n";
  memory += "This entity has not yet defined how it remembers or forgets.\n";
  memory += "Its first experiences in a Score will begin to shape this.\n";

  fs.writeFileSync(path.join(entityDir, "memory.md"), memory);

  // --- journal.md ---
  var journalContent = "# Journal of " + name + "\n\n";
  journalContent += "*A record of experiences across all Scores.*\n\n";
  journalContent += "---\n\n";

  // Find journal entries that mention this entity
  var entityJournalEntries = [];
  for (var j = 0; j < journal.length; j++) {
    var je = journal[j];
    if (je.text && je.text.indexOf(name) !== -1) {
      entityJournalEntries.push(je);
    }
  }

  if (entityJournalEntries.length > 0) {
    journalContent += "## From the Grimoire\n\n";
    journalContent += "*These encounters were witnessed before " + name + " had a proper home.*\n\n";
    for (var k = 0; k < entityJournalEntries.length; k++) {
      var je = entityJournalEntries[k];
      var jeDate = je.time
        ? new Date(je.time).toISOString().slice(0, 10)
        : "unknown date";
      journalContent += "**" + (je.title || "Untitled") + "** — *" + jeDate + "*\n\n";
      journalContent += je.text + "\n\n";
    }
  } else {
    journalContent += "*No experiences recorded yet. The pages are blank and waiting.*\n";
  }

  fs.writeFileSync(path.join(entityDir, "journal.md"), journalContent);

  console.log("  " + categoryLabel(category).padEnd(10) + " " + name + "  →  " + entityDir + "/");
  created++;
}

// --- Create a neighborhood README ---
var neighborhoodReadme = "# " + DEFAULT_NEIGHBORHOOD.charAt(0).toUpperCase() + DEFAULT_NEIGHBORHOOD.slice(1) + "\n\n";
neighborhoodReadme += "A neighborhood in The Hall.\n\n";
neighborhoodReadme += created + " residents call this place home.\n\n";
neighborhoodReadme += "---\n\n";
for (var r = 0; r < entries.length; r++) {
  var e = entries[r];
  neighborhoodReadme += "- **" + e.name + "** (" + categoryLabel(e.category || "spirit") + ")\n";
}
neighborhoodReadme += "\n---\n\n*This neighborhood was seeded from a Living Grimoire export.*\n";

fs.writeFileSync(path.join(neighborhoodDir, "README.md"), neighborhoodReadme);

// --- Create top-level entities README ---
var entitiesReadme = "# Entities\n\n";
entitiesReadme += "Every entity in The Hall lives here, organized by neighborhood.\n\n";
entitiesReadme += "Each entity has:\n";
entitiesReadme += "- **tuning.md** — identity, nature, tags\n";
entitiesReadme += "- **memory.md** — emoji state and memory style\n";
entitiesReadme += "- **journal.md** — narrative history across all Scores\n\n";
entitiesReadme += "Scores read Tunings. Entities author their own memories.\n";

fs.writeFileSync(path.join(ENTITIES_DIR, "README.md"), entitiesReadme);

console.log("");
console.log("  ========================");
console.log("  " + created + " entities given homes in " + neighborhoodDir + "/");
console.log("");
console.log("  Next steps:");
console.log("    git add .");
console.log('    git commit -m "First residents of The Hall"');
console.log("    git push");
console.log("");
console.log("  Welcome home.");
console.log("");
