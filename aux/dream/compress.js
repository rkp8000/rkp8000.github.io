// ----------------------- Helpers -----------------------

// Simple hash to integer 0-4095
function messageHash(msg) {
    let hash = 0;
    for (let i = 0; i < msg.length; i++) {
        hash = (hash + msg.charCodeAt(i) * (i + 1)) & 0xfff; // keep 12 bits
    }
    return hash;
}

// Convert integer 0-4095 → 2 Base64 characters
function intToBase64Pair(n) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return chars[n >> 6] + chars[n & 0x3f];
}

// Convert 2 Base64 characters → integer 0-4095
function base64PairToInt(pair) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return (chars.indexOf(pair[0]) << 6) | chars.indexOf(pair[1]);
}

// Mulberry32 RNG
function mulberry32(a) {
    return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

// ----------------------- Permutation Utilities -----------------------
function createPermutation(length, seed) {
    const arr = Array.from({ length }, (_, i) => i);
    let random = mulberry32(seed);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function permuteBits(bits, permutation) {
    const permuted = new Array(bits.length);
    for (let i = 0; i < bits.length; i++) permuted[i] = bits[permutation[i]];
    return permuted;
}

function unpermuteBits(bits, permutation) {
    const original = new Array(bits.length);
    for (let i = 0; i < bits.length; i++) original[permutation[i]] = bits[i];
    return original;
}

// ----------------------- Bit / Base64 -----------------------
function bytesToBitArray(bytes) {
    const bits = [];
    for (let i = 0; i < bytes.length; i++) {
        for (let j = 7; j >= 0; j--) bits.push((bytes[i] >> j) & 1);
    }
    return bits;
}

function bitArrayToBytes(bits) {
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] || 0);
        bytes.push(byte);
    }
    return new Uint8Array(bytes);
}

function bitArrayToBase64(bits) {
    const bytes = bitArrayToBytes(bits);
    let binaryString = '';
    for (let i = 0; i < bytes.length; i++) binaryString += String.fromCharCode(bytes[i]);
    return btoa(binaryString);
}

function base64ToBitArray(b64) {
    const binaryString = atob(b64);
    const bits = [];
    for (let i = 0; i < binaryString.length; i++) {
        let byte = binaryString.charCodeAt(i);
        for (let j = 7; j >= 0; j--) bits.push((byte >> j) & 1);
    }
    return bits;
}

// ----------------------- Encode / Decode -----------------------
function encode(message, seed) {
    const hash = messageHash(message); // 0-4095
    const combinedSeed = seed + hash;

    // Compress using DEFLATE (pako)
    const compressedBytes = pako.deflate(message);

    // Convert to bit array
    let bits = bytesToBitArray(compressedBytes);

    // Permute
    const permutation = createPermutation(bits.length, combinedSeed);
    bits = permuteBits(bits, permutation);

    // Convert to Base64
    const base64Str = bitArrayToBase64(bits);

    // Prepend 2 Base64 chars encoding the hash
    const prefix = intToBase64Pair(hash);
    return prefix + base64Str;
}

function decode(encoded, seed) {
    // Extract first 2 chars → hash
    const hash = base64PairToInt(encoded.slice(0, 2));
    const combinedSeed = seed + hash;

    const base64Str = encoded.slice(2);

    // Base64 → bits
    let bits = base64ToBitArray(base64Str);

    // Unpermute
    const permutation = createPermutation(bits.length, combinedSeed);
    bits = unpermuteBits(bits, permutation);

    // Bits → bytes
    const bytes = bitArrayToBytes(bits);

    // Decompress
    const message = pako.inflate(bytes, { to: 'string' });
    return message;
}