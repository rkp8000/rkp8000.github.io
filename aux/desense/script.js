let commonNames = [];
let commonPlaces = [];
let commonCompanies = [];
let fakeNamesPool = [];
let fakePlacesPool = [];
let fakeCompaniesPool = [];

let mappingRealToFake = {};
let mappingFakeToReal = {};

/* --- Load common and fake lists --- */
async function loadLists() {
  try {
    const [names, places, companies, fakeN, fakeP, fakeC] = await Promise.all([
      fetch('/aux/desense/common_names.txt').then(r => r.text()),
      fetch('/aux/desense/common_places.txt').then(r => r.text()),
      fetch('/aux/desense/common_companies.txt').then(r => r.text()),
      fetch('/aux/desense/fake_names.txt').then(r => r.text()),
      fetch('/aux/desense/fake_places.txt').then(r => r.text()),
      fetch('/aux/desense/fake_companies.txt').then(r => r.text())
    ]);
    commonNames = names.split(/\r?\n/).map(n => n.trim()).filter(n => n);
    commonPlaces = places.split(/\r?\n/).map(n => n.trim()).filter(n => n);
    commonCompanies = companies.split(/\r?\n/).map(n => n.trim()).filter(n => n);
    fakeNamesPool = fakeN.split(/\r?\n/).map(n => n.trim()).filter(n => n);
    fakePlacesPool = fakeP.split(/\r?\n/).map(n => n.trim()).filter(n => n);
    fakeCompaniesPool = fakeC.split(/\r?\n/).map(n => n.trim()).filter(n => n);
  } catch (err) {
    alert("Could not load name/place/company lists: " + err);
  }
}

/* --- Helpers --- */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getUniqueFakeName(pool, usedFakes, realSet) {
  for (let name of pool) {
    if (!usedFakes.has(name.toLowerCase()) && !realSet.has(name.toLowerCase())) {
      usedFakes.add(name.toLowerCase());
      return name;
    }
  }
  let newFake;
  do {
    newFake = "Fake" + Math.floor(Math.random() * 10000);
  } while (usedFakes.has(newFake.toLowerCase()) || realSet.has(newFake.toLowerCase()));
  usedFakes.add(newFake.toLowerCase());
  return newFake;
}

function detectEmails(text) {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  return new Set(text.match(emailRegex) || []);
}

function detectPhoneNumbers(text) {
  const phoneRegex = /(?:\+1[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
  return new Set(text.match(phoneRegex) || []);
}

function detectItems(text, list) {
  const found = new Set();
  list.forEach(item => {
    const re = new RegExp("\\b" + escapeRegex(item) + "\\b", "gi");
    if (re.test(text)) found.add(item);
  });
  return found;
}

function generateFakePhoneNumber(index) {
  const last4 = String(index).padStart(4, '0');
  return `(646) 555-${last4}`;
}

/* --- Depersonalize --- */
document.getElementById("depersonalizeBtn").addEventListener("click", () => {
  const originalText = document.getElementById("original").value;

  const customNames = document.getElementById("customNames").value
      .split(",").map(n => n.trim()).filter(n => n);
  const customPlaces = document.getElementById("customPlaces").value
      .split(",").map(n => n.trim()).filter(n => n);
  const customCompanies = document.getElementById("customCompanies").value
      .split(",").map(n => n.trim()).filter(n => n);

  const allNames = [...new Set([...commonNames, ...customNames])];
  const allPlaces = [...new Set([...commonPlaces, ...customPlaces])];
  const allCompanies = [...new Set([...commonCompanies, ...customCompanies])];

  const detectedNames = detectItems(originalText, allNames);
  const detectedPlaces = detectItems(originalText, allPlaces);
  const detectedCompanies = detectItems(originalText, allCompanies);
  const detectedEmails = detectEmails(originalText);
  const detectedPhones = detectPhoneNumbers(originalText);

  const realNamesSet = new Set([...detectedNames].map(n => n.toLowerCase()));
  const realPlacesSet = new Set([...detectedPlaces].map(n => n.toLowerCase()));
  const realCompaniesSet = new Set([...detectedCompanies].map(n => n.toLowerCase()));

  mappingRealToFake = {};
  mappingFakeToReal = {};
  const usedNameFakes = new Set();
  const usedPlaceFakes = new Set();
  const usedCompanyFakes = new Set();

  // Personal names
  detectedNames.forEach(realName => {
    const fake = getUniqueFakeName(fakeNamesPool, usedNameFakes, realNamesSet);
    mappingRealToFake[realName] = fake;
    mappingFakeToReal[fake] = realName;
  });

  // Place names
  detectedPlaces.forEach(realPlace => {
    const fake = getUniqueFakeName(fakePlacesPool, usedPlaceFakes, realPlacesSet);
    mappingRealToFake[realPlace] = fake;
    mappingFakeToReal[fake] = realPlace;
  });
    
  // Company names
  detectedCompanies.forEach(realCompany => {
    const fake = getUniqueFakeName(fakeCompaniesPool, usedCompanyFakes, realCompaniesSet);
    mappingRealToFake[realCompany] = fake;
    mappingFakeToReal[fake] = realCompany;
  });

  // Emails
  detectedEmails.forEach(realEmail => {
    let fakeEmail, counter = 1;
    do {
      fakeEmail = `alabaster${counter}@gmail.com`;
      counter++;
    } while (Object.values(mappingRealToFake).includes(fakeEmail));
    mappingRealToFake[realEmail] = fakeEmail;
    mappingFakeToReal[fakeEmail] = realEmail;
  });

  // Phone numbers
  let phoneCounter = 1;
  detectedPhones.forEach(realPhone => {
    const fakePhone = generateFakePhoneNumber(phoneCounter++);
    mappingRealToFake[realPhone] = fakePhone;
    mappingFakeToReal[fakePhone] = realPhone;
  });

  let text = originalText;

  // Replace names, places, companies
  [...detectedNames, ...detectedPlaces, ...detectedCompanies].forEach(item => {
    const re = new RegExp("\\b" + escapeRegex(item) + "\\b", "gi");
    text = text.replace(re, match => {
      const fake = mappingRealToFake[item];
      return match[0] === match[0].toUpperCase() ? fake : fake.toLowerCase();
    });
  });

  // Replace emails
  detectedEmails.forEach(realEmail => {
    const re = new RegExp(escapeRegex(realEmail), "g");
    text = text.replace(re, mappingRealToFake[realEmail]);
  });

  // Replace phone numbers
  detectedPhones.forEach(realPhone => {
    const re = new RegExp(escapeRegex(realPhone), "g");
    text = text.replace(re, mappingRealToFake[realPhone]);
  });

  document.getElementById("depersonalized").value = text;
});

/* --- Re-personalize (FIXED) --- */
document.getElementById("repersonalizeBtn").addEventListener("click", () => {
  let text = document.getElementById("depersonalized").value;

  // Helper: returns true if we should try to preserve capitalization and use word boundaries.
  function useWordBoundaryFor(key) {
    if (!key || key.length === 0) return false;
    return /\w/.test(key[0]) && /\w/.test(key[key.length - 1]);
  }
  // Helper: decide whether the real value is alphabetic (names/places) so we attempt case-preservation.
  function isAlphabeticValue(val) {
    return /^[A-Za-z\s]+$/.test(val);
  }

  Object.keys(mappingFakeToReal).forEach(fakeKey => {
    const realVal = mappingFakeToReal[fakeKey];
    const pattern = useWordBoundaryFor(fakeKey)
      ? "\\b" + escapeRegex(fakeKey) + "\\b"
      : escapeRegex(fakeKey);
    const re = new RegExp(pattern, "gi");

    if (isAlphabeticValue(realVal)) {
      // preserve capitalization for names/places
      text = text.replace(re, match => {
        return match[0] === match[0].toUpperCase() ? realVal : realVal.toLowerCase();
      });
    } else {
      // emails/phones — replace exactly (no case-transform)
      text = text.replace(re, realVal);
    }
  });

  document.getElementById("reverted").value = text;
});

/* --- Save in URL --- */
document.getElementById("saveInUrlBtn").addEventListener("click", () => {
  const customNamesVal = document.getElementById("customNames").value;
  const customPlacesVal = document.getElementById("customPlaces").value;
  const customCompaniesVal = document.getElementById("customCompanies").value;

  const encodedNames = btoa(customNamesVal);
  const encodedPlaces = btoa(customPlacesVal);
  const encodedCompanies = btoa(customCompaniesVal);
  const newUrl = `${location.origin}${location.pathname}?names=${encodedNames}&places=${encodedPlaces}&companies=${encodedCompanies}`;
  history.replaceState(null, "", newUrl);
  // alert("Custom names saved in URL!");  <-- commented out as requested
});

/* --- Load from URL --- */
window.addEventListener("DOMContentLoaded", async () => {
  await loadLists();

  const params = new URLSearchParams(location.search);
  if (params.has("names")) {
    try {
      document.getElementById("customNames").value = atob(params.get("names"));
    } catch (e) { console.warn("Invalid encoded names in URL."); }
  }
  if (params.has("places")) {
    try {
      document.getElementById("customPlaces").value = atob(params.get("places"));
    } catch (e) { console.warn("Invalid encoded places in URL."); }
  }
  if (params.has("companies")) {
    try {
      document.getElementById("customCompanies").value = atob(params.get("companies"));
    } catch (e) { console.warn("Invalid encoded companies in URL."); }
  }
});