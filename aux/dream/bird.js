const templates = [
  "I stand in a [adjective] [setting], holding [amount] [adjective] [object].",
  "A [character] appears beside me and whispers about [adjective] [object].",
  "The [setting] stretches out forever, filled with [amount] [adjective] [object].",
  "I climb a [adjective] staircase that leads into a [adjective] [setting].",
  "A [character] gives me [amount] [object], then vanishes into a [setting].",
  "The [object] around me shift and change into [adjective] [object].",
  "I walk along a [setting] where [amount] [object] float in the air.",
  "Suddenly, a [adjective] [character] blocks my way, holding [amount] [object].",
  "The ground beneath me turns into [amount] [object], each one [adjective].",
  "I open several [object] and discover a [adjective] [setting] inside.",
  "A trembling [character] sings about [amount] [object] in the [setting].",
  "I try to follow a [character], but they dissolve into [adjective] [object].",
  "The sky fills with [amount] [adjective] [object] as I wander a [setting].",
  "I see my reflection in a [setting], but it becomes a [adjective] [character].",
  "The [setting] bends and folds, revealing [amount] [adjective] [object].",
  "I hold [amount] [adjective] [object], but they melt through my fingers.",
  "A [character] floats above me, pointing toward a [adjective] [setting].",
  "Every door in the [setting] opens to reveal [amount] [object].",
  "I hear a [character] chanting, their voice echoing from [adjective] [object].",
  "I cannot move because the air is full of [amount] [adjective] [object]."
];

// --- placeholder pools ---
const settings = [
  "forest", "desert", "city street", "classroom", "ocean", "mountain", 
  "endless hallway", "mirror maze", "strange house", "crowded market",
  "abandoned church", "floating island", "cave of glass", "spiral staircase",
  "train station", "airport terminal", "rooftop", "underground tunnel",
  "carnival", "ancient ruins", "volcano rim", "frozen lake", "library",
  "attic", "basement", "swamp", "jungle", "observatory", "labyrinth",
  "deserted village", "castle courtyard", "flooded street", "moon surface",
  "astral void", "subway car", "familiar bedroom", "hospital corridor",
  "theatre stage", "graveyard", "endless desert road",
  "abandoned amusement park", "underwater city", "snowed-in cabin",
  "rain-soaked alley", "neon-lit cyberpunk district", "space station",
  "derelict spaceship", "orbital elevator", "timeworn battlefield",
  "forgotten temple", "sunken shipwreck", "wind-swept plateau",
  "crystal cavern", "bioluminescent forest", "ash-covered wasteland",
  "post-apocalyptic highway", "overgrown greenhouse", "clockwork city",
  "mechanical factory floor", "server farm", "data center hallway",
  "virtual reality lobby", "glitching simulation",
  "medieval tavern", "royal throne room", "catacombs",
  "underground bunker", "secret research facility",
  "haunted mansion", "sealed quarantine zone",
  "icebound research outpost", "arctic tundra",
  "volcanic ash plain", "storm-lashed coastline",
  "floating sky bridge", "inverted city",
  "endless parking garage", "abandoned shopping mall",
  "empty swimming pool", "waterlogged subway tunnel",
  "border checkpoint", "customs inspection room",
  "courtroom", "interrogation room",
  "radio tower summit", "lighthouse interior",
  "fishing pier at dawn", "harbor at night",
  "sacred grove", "stone circle",
  "dreamlike pastel landscape", "shifting sand labyrinth",
  "fractured reality pocket", "echoing memory palace"
];

const objects = [
  "keys", "candles", "stones", "feathers", "clocks", "books", "coins", "mirrors",
  "flowers", "letters", "shells", "glasses", "photographs", "lanterns", "ropes",
  "doors", "swords", "umbrellas", "lanterns", "shoes", "windows", "rings", "dolls",
  "masks", "spheres", "bottles", "cups", "statues", "scrolls", "paintings", 
  "instruments", "ladders", "puzzles pieces", "watches", "gems", "teeth", "bones",
  "maps", "candies", "balloons", "birds' nests", "hands", "faces carved in wood",
  "chains", "locks", "compasses", "hourglasses", "dice", "chess pieces",
  "playing cards", "tarot cards", "tokens", "medallions",
  "crowns", "helmets", "armor plates", "shields",
  "arrows", "spears", "daggers", "scabbards",
  "boots", "gloves", "cloaks", "belts", "buckles",
  "backpacks", "suitcases", "briefcases",
  "notebooks", "journals", "ledgers", "manuscripts",
  "ink bottles", "quills", "pens", "pencils",
  "posters", "signs", "banners", "flags",
  "keys on chains", "charms", "talismans", "amulets",
  "vials", "flasks", "jars", "test tubes",
  "tools", "hammers", "wrenches", "pliers",
  "gears", "cogs", "springs", "levers",
  "wires", "cables", "circuits", "chips",
  "screens", "monitors", "keyboards", "switches",
  "headphones", "speakers", "microphones",
  "candlesticks", "goblets", "plates", "cutlery",
  "trays", "bowls", "napkins",
  "frames", "canvases", "sketches", "blueprints",
  "fossils", "skulls", "relics", "artifacts",
  "crystals", "shards", "fragments", "splinters",
  "seeds", "leaves", "roots", "vines",
  "bones carved with symbols", "stones etched with runes",
  "mirrors cracked with age", "photographs curled at the edges"
];

const characters = [
  "child", "lonely friend", "stranger", "strange animal", "shadow", "teacher", "parent",
  "giant", "double of myself", "singer", "masked figure", "statue that moves",
  "ancestor", "future self", "robot", "monster", "dancer", "clown", "guide",
  "hunter", "ghost", "healer", "artist", "scientist", "knight", "queen", "king",
  "angel", "demon", "storyteller", "musician", "traveler", "pilgrim", "witch",
  "merchant", "acrobat", "soldier", "prisoner", "childhood neighbor", "celebrity",
  "friend I no longer know", "humongous animal", "swarm of people in one body",
  "caretaker", "watcher", "observer", "messenger", "herald",
  "scribe", "tired archivist", "librarian", "cartographer",
  "alchemist", "apprentice", "master", "mentor",
  "prophet", "oracle", "seer", "medium",
  "judge", "executioner", "warden", "interrogator",
  "spy", "assassin", "thief", "smuggler",
  "nomad", "exiled minister", "refugee", "settler",
  "explorer", "navigator", "pilot", "astronaut",
  "engineer", "mechanic", "technician",
  "doctor", "nurse", "patient",
  "monk", "priest", "cultist", "heretic",
  "bard", "poet", "playwright", "composer",
  "illusionist", "magician", "conjurer",
  "puppeteer", "ventriloquist",
  "sentinel", "guardian", "gatekeeper",
  "caretaker of ruins", "keeper of secrets",
  "bearer of a burden", "one who remembers everything",
  "one who cannot speak", "one who never sleeps",
  "reflection that speaks", "voice without a body",
  "body without a shadow", "person with a borrowed face",
  "figure trapped between moments",
  "being made of light", "being made of smoke",
  "machine pretending to be human",
  "human pretending to be machine"
];

const adjectives = [
  "bright", "dark", "warm", "cold", "heavy", "light", "endless", "familiar",
  "strange", "beautiful", "terrifying", "fragile", "glowing", "shimmering",
  "haunted", "soft", "loud", "silent", "blinding", "blurry", "sharp", "distorted",
  "floating", "frozen", "burning", "melting", "ancient", "hollow", "sacred",
  "forgotten", "whispering", "colorless", "neon", "shattered", "restless",
  "still", "living", "breathing", "mechanical", "pulsating", "swarming",
  "flickering", "echoing", "vibrating", "resonant",
  "damp", "dusty", "grimy", "polished",
  "slick", "rough", "jagged", "smooth",
  "cracked", "fractured", "warped", "twisted",
  "weightless", "oppressive", "crushing",
  "vast", "narrow", "enclosed", "open",
  "towering", "diminutive", "looming",
  "fading", "decaying", "rotting", "withering",
  "newborn", "pristine", "untouched",
  "electric", "magnetic", "radioactive",
  "synthetic", "organic",
  "hypnotic", "mesmerizing", "disorienting",
  "uncanny", "eerie", "ominous",
  "mournful", "serene", "agitated",
  "fractured-in-time", "out-of-place",
  "impossible", "inverted",
  "echo-filled", "lightless",
  "watchful", "sentient",
  "unstable", "volatile",
  "otherworldly", "liminal"
];

const amounts = [
  "two", "three", "a handful of", "a pile of", "dozens of", "hundreds of",
  "countless", "exactly seven", "eight", "nine", "eleven", "five", "six", "a pair of", "thousands of",
  "innumerable", "a profound number of", "just enough", "a scattering of",
  "a billowing armful of", "several", "a wavering amount of", "double", "triple",
  "too many", "not enough", "a collection of", "a legion of", "a bathtub of",
  "a circle of", "a spiral of", "a broken set of", "infinite"
];


// --- weighted choice helper ---
function weightedChoice(rng, items, weights) {
  let total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  let cum = 0;
  for (let i = 0; i < items.length; i++) {
    cum += weights[i];
    if (r < cum) return items[i];
  }
  return items[items.length - 1];
}

// specifying state structure
const null_state = { template: null, remaining: 0, usedObjects: {}, cursor: 0, rng: null };

// --- sample function ---
function sample(seed, n, state, context, finish_section = 0) {
  let { template, remaining, usedObjects, cursor, rng } = state;
  rng = mulberry32(seed);

  let text = "";
  let filled = 0;

  while (filled < n || finish_section) {
    if (!template) {
      template = templates[Math.floor(rng() * templates.length)];
      remaining = (template.match(/\[.*?\]/g) || []).length;
      cursor = 0;
    }

    while (cursor < template.length && (filled < n || finish_section)) {
      if (template[cursor] === "[" && remaining > 0) {
        let end = template.indexOf("]", cursor);
        let placeholder = template.slice(cursor, end + 1);
        let replacement;
        if (placeholder === "[object]") {
          // let weights = objects.map(item => (usedObjects[item] || 0) + 1);
          let weights = objects.map(item => 1 + 0.1 * (usedObjects[item] || 0));
          replacement = weightedChoice(rng, objects, weights);
          usedObjects[replacement] = (usedObjects[replacement] || 0) + 1;
        } else if (placeholder === "[setting]") {
          replacement = settings[Math.floor(rng() * settings.length)];
        } else if (placeholder === "[character]") {
          replacement = characters[Math.floor(rng() * characters.length)];
        } else if (placeholder === "[adjective]") {
          replacement = adjectives[Math.floor(rng() * adjectives.length)];
        } else if (placeholder === "[amount]") {
          replacement = amounts[Math.floor(rng() * amounts.length)];
        } else {
          replacement = "???";
        }
        text += replacement;
        cursor = end + 1;
        remaining--;
        filled++;
      } else {
        text += template[cursor];
        cursor++;
      }
      if (!finish_section && filled >= n) break;
    }

    if (cursor >= template.length) {
      text += "\n";
      template = null;
      remaining = 0;
      cursor = 0;
      if (finish_section) break;
    }

    if (!finish_section && filled >= n) break;
  }

  let new_state = { template, remaining, usedObjects, cursor, rng };
  let new_context = context + text;

  return { text, new_state, new_context };
}