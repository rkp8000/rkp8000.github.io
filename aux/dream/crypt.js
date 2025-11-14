function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function hashStringTo16Bit(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xFFFF; 
    // multiply by 31, add char, keep only 16 bits
  }
  return hash; // value between 0–65535
}

async function getKeyFromPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptMessage(message, password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKeyFromPassword(password, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(message)
  );
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  return arrayBufferToBase64(combined.buffer);
}

async function decryptMessage(ciphertextBase64, password) {
  const combined = new Uint8Array(base64ToArrayBuffer(ciphertextBase64));
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const data = combined.slice(28);
  const key = await getKeyFromPassword(password, salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );
  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

async function handleEncrypt() {
  const msg = document.getElementById('message').value;
  const pwd = document.getElementById('password').value;
  if (!msg || !pwd) return alert("Enter message and password");
  // const encrypted = await encryptMessage(msg, pwd);
  const seed = hashStringTo16Bit(pwd);
  const encrypted = await encode(msg, seed);
  const song = await sing(encrypted, pwd);
  document.getElementById("encoded").value = song;
}

async function handleDecrypt() {
  const song = document.getElementById("encoded").value;
  const pwd = document.getElementById('password').value;
  if (!song || !pwd) return alert("Enter song and password");
  try {
    const encrypted = await listen(song, pwd);
    // const seed = 12345;
    const seed = hashStringTo16Bit(pwd);
    const decrypted = await decode(encrypted, seed);
    // const decrypted = await decryptMessage(encrypted, pwd);
    document.getElementById('decoded').value = decrypted;
  } catch (e) {
    document.getElementById('deocded').value = "Decryption failed (wrong password or data).";
  }
}