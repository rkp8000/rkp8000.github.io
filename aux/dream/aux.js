// AUX FUNCTIONS
const base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const max_salt = 10_000_000;

function base64CharToIndex(ch) {
  return base64chars.indexOf(ch);
}

// mulberry32 prng
function mulberry32(a) {
    let t = a >>> 0;
    return function() {
      t = (t + 0x6D2B79F5) >>> 0;
      let x = t;
      x = Math.imul(x ^ (x >>> 15), x | 1) >>> 0;
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61) >>> 0;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
}

// hashToIntegers(password, N, K) -> Promise<Array of K integers in [0, N))
async function hashToIntegers(password, N, K) {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hashBuffer);

  // Make a 32-bit seed from first 4 bytes
  const seed =
    (bytes[0] << 24 >>> 0) ^
    (bytes[1] << 16) ^
    (bytes[2] << 8) ^
    (bytes[3]);

  const prng = mulberry32(seed);

  // Generate K integers
  const output = [];
  for (let i = 0; i < K; i++) {
    output.push(Math.floor(prng() * N));
  }
  return output;
}

function compareStrings(str1, str2) {
  if (str1 === str2) {
    return 0; // Strings are identical
  } else {
    // Optionally, return a different value if not identical, 
    // or handle the difference as needed.
    return 11; // Example: Strings are not identical
  }
}

function argMin(arr) {
  if (arr.length === 0) {
    return -1; // Or throw an error, depending on desired behavior for empty arrays
  }

  let minIndex = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[minIndex]) {
      minIndex = i;
    }
  }
  return minIndex;
}
