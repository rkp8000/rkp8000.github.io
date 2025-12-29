function check_for_ambiguities(chirps) {
    for (ichirp = 0; ichirp < chirps.length; ichirp++) {
        const copies = [];
        
        for (jchirp = 0; jchirp < chirps.length; jchirp++) {
            if (chirps[jchirp].text.startsWith(chirps[ichirp].text)) {
                copies.push(chirps[jchirp]);
            }
        }
    
        if (copies.length > 1) {
            console.log('Ambiguity found');
            for (ccopy = 0; ccopy < copies.length; ccopy++) {
                console.log(copies[ccopy].text);
            }
        }
    }
}

async function make_chirp_book(state, context, seeds, maxLength = 1000) {
  const lengths = Array(seeds.length).fill(1);

  while (true) {
    // Current candidate samples
    const seqs = seeds.map((seed, i) => sample(seed, lengths[i], state, context));

    let conflict = false;

    for (let i = 0; i < seqs.length; i++) {
      for (let j = 0; j < seqs.length; j++) {
        if (i !== j && seqs[j].text.startsWith(seqs[i].text)) {
          lengths[i] += 1;  // extend the prefix
          conflict = true;
        }
      }
    }

    if (!conflict) {
      return seqs; // All sequences are prefix-free
    }

    if (Math.max(...lengths) > maxLength) {
      throw new Error("Exceeded maximum length — process didn’t converge");
    }
  }
}

function get_chirp_dist(chirp_a, chirp_b) {
    return compareStrings(chirp_a, chirp_b);
}

// function fix_grammar(song) {
//     song_fixed = song + 'END';
//     return song_fixed;
// }
function fix_grammar(song) {
    // Replace "a" with "an" when followed by a vowel-starting word
    // \b ensures "a" is a standalone word
    // \s+ allows spaces or newlines
    song_fixed = song.replace(/\ba\s+([aeiouAEIOU]\w*)/g, "an $1");
    return song_fixed;
}

// function unfix_grammar(song) {
//     song_unfixed = song;
//     return song_unfixed;
// }
function unfix_grammar(song) {
    // Replace standalone "an" with "a"
    song_unfixed = song.replace(/\ban\b/g, "a");
    return song_unfixed;
}


// Convert encrypted message to song
async function sing(encrypted, pwd) {
    const K = encrypted.length;
    const salts = await hashToIntegers(pwd, max_salt, K+1);

    console.log(encrypted);
    // sing
    let song = '';
    let state = structuredClone(null_state);
    let context = '';
    for (ii = 0; ii < K+1; ii++) {
        const seeds = [];
        const salt = salts[ii];
        
        for (jj = 0; jj < base64chars.length; jj++) {
            seeds.push(salt + jj);
        }
        
        seeds.push(salt + base64chars.length);  // add one extra seed to be used for non-symbol end token 

        let chirps = await make_chirp_book(state, context, seeds);
        check_for_ambiguities(chirps);
        
        let chirp = null;
        
        if (ii < K) {
            chirp = chirps[base64CharToIndex(encrypted[ii])];
        } else {
            chirp = chirps[chirps.length-1];  // use non-symbol chirp for ending
        }
        
        song += chirp.text;
        state = chirp.new_state;
        context = chirp.new_context;
    }
    const final_chirp = sample(1337, 99, state, context, finish_section = 1);
    song += final_chirp.text;
    song = fix_grammar(song);
    return song;
}

// Convert song to encrypted message
async function listen(song, pwd) {
    song = unfix_grammar(song);
    console.log('Unfixed song');
    console.log(song);
    const K = song.length;  // upper bound on encrypted length
    const salts = await hashToIntegers(pwd, max_salt, K);

    // reconstruct encrypted
    let song_hat = '';
    let state_hat = structuredClone(null_state);
    let context_hat = '';
    let encrypted_hat = '';

    for (let ii = 0; ii < K; ii++) {
        if (song_hat.length == song.length) {
            break;
        }
        
        const seeds = [];
        const salt = salts[ii];
        
        for (jj = 0; jj < base64chars.length; jj++) {
            seeds.push(salt + jj);
        }
        
        seeds.push(salt + base64chars.length);
        
        // make chirp book
        const chirps = await make_chirp_book(state_hat, context_hat, seeds);
        check_for_ambiguities(chirps);
        
        // compute distances of each chirp to song
        const dists = [];
        for (let cchirp = 0; cchirp < chirps.length; cchirp++) {
            const start = song_hat.length;
            const text = chirps[cchirp].text;
            const end = start + text.length;
            dists.push(get_chirp_dist(text, song.slice(start, end)));
        }

        // select chirp with smallest distance to song
        const min_dist = Math.min(...dists);
        const ichirp = argMin(dists);
        
        song_hat += chirps[ichirp].text;
        state_hat = chirps[ichirp].new_state;
        context_hat = chirps[ichirp].new_context;

        if (min_dist > .1) {
            break;
        }
        if (ichirp < chirps.length-1) {
            encrypted_hat += base64chars[ichirp];
        } else {
            const final_chirp = sample(1337, 99, state_hat, context_hat, finish_section = 1);
            song_hat += final_chirp.text;
            state_hat = final_chirp.new_state;
            context_hat = final_chirp.new_context;
            break;
        }

    }
    console.log(encrypted_hat);
    return encrypted_hat;
}