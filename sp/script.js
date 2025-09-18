// Secure password generator with guaranteed inclusion of chosen character types.
// Enforces minimum length 8 and provides estimated crack time.
// Assumption for crack-time: 10,000,000,000 guesses per second (10 billion).

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>/?|~`",
  ambiguous: "0O1lI"
};

const el = id => document.getElementById(id);
const passwordEl = el("password");
const lengthEl = el("length");
const lengthValueEl = el("lengthValue");
const upperEl = el("uppercase");
const numbersEl = el("numbers");
const symbolsEl = el("symbols");
const excludeAmbiguousEl = el("excludeAmbiguous");
const copyBtn = el("copyBtn");
const copyMsg = el("copyMsg");
const strengthFill = el("strengthFill");
const strengthLabel = el("strengthLabel");
const crackTimeEl = el("crackTime");

// Guesses per second assumption (adjustable if needed)
const GUESSES_PER_SECOND = 1e10; // 10 billion

// Secure random integer in [0, max)
function secureRandomInt(max) {
  if (max <= 0) return 0;
  const uint32 = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let r;
  do {
    crypto.getRandomValues(uint32);
    r = uint32[0];
  } while (r >= limit);
  return r % max;
}

// pick one random char from a string
function pickRandom(chars) {
  return chars.charAt(secureRandomInt(chars.length));
}

// Fisher-Yates shuffle using secure RNG
function secureShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildSets(opts) {
  const s = {};
  s.lower = SETS.lower;
  s.upper = opts.upper ? SETS.upper : "";
  s.numbers = opts.numbers ? SETS.numbers : "";
  s.symbols = opts.symbols ? SETS.symbols : "";

  if (opts.excludeAmbiguous) {
    const re = new RegExp("[" + SETS.ambiguous.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]", "g");
    s.lower = s.lower.replace(re, "");
    s.upper = s.upper.replace(re, "");
    s.numbers = s.numbers.replace(re, "");
    s.symbols = s.symbols.replace(re, "");
  }

  return s;
}

function generatePassword() {
  const opts = {
    upper: upperEl.checked,
    numbers: numbersEl.checked,
    symbols: symbolsEl.checked,
    excludeAmbiguous: excludeAmbiguousEl.checked,
    length: Math.max(8, parseInt(lengthEl.value, 10) || 8)
  };

  const sets = buildSets(opts);

  const required = [];
  if (sets.lower.length) required.push(sets.lower);
  if (sets.upper) required.push(sets.upper);
  if (sets.numbers) required.push(sets.numbers);
  if (sets.symbols) required.push(sets.symbols);

  const minRequired = required.length;
  if (opts.length < minRequired) {
    opts.length = minRequired;
    lengthEl.value = opts.length;
    lengthValueEl.textContent = opts.length;
  }

  let fullCharset = "";
  for (const k of ["lower", "upper", "numbers", "symbols"]) {
    if (sets[k]) fullCharset += sets[k];
  }
  if (!fullCharset) fullCharset = SETS.lower;

  const pwdChars = [];
  for (const set of required) {
    pwdChars.push(pickRandom(set));
  }

  const remaining = opts.length - pwdChars.length;
  for (let i = 0; i < remaining; i++) {
    pwdChars.push(pickRandom(fullCharset));
  }

  secureShuffle(pwdChars);
  const password = pwdChars.join("");
  passwordEl.value = password;
  updateStrengthAndCrack(password, fullCharset.length);
  return password;
}

function estimateEntropyBits(length, charsetSize) {
  if (charsetSize <= 1) return 0;
  return length * Math.log2(charsetSize);
}

// Format a large seconds value into readable string
function formatCrackTimeFromBits(bits, guessesPerSecond) {
  // log10(seconds) = bits * log10(2) - log10(guessesPerSecond)
  const log10 = Math.LOG10E;
  const log10Seconds = bits * Math.log10(2) - Math.log10(guessesPerSecond);

  if (!isFinite(log10Seconds)) return "Unknown";

  // if small (<6 digits), compute exact seconds
  if (log10Seconds < 6) {
    const seconds = Math.pow(10, log10Seconds);
    return humanizeSeconds(seconds);
  }

  // compute years using logs to avoid overflow
  const secondsPerYear = 31557600; // average Gregorian year in seconds
  const log10Years = log10Seconds - Math.log10(secondsPerYear);

  // if years small enough (<6 digits)
  if (log10Years < 6) {
    const years = Math.pow(10, log10Years);
    return humanizeYears(years);
  }

  // very large: return scientific notation in years
  const mantissa = Math.pow(10, log10Years - Math.floor(log10Years));
  const exponent = Math.floor(log10Years);
  return `≈ ${mantissa.toFixed(2)}e+${exponent} years (at ${formatGuesses(guessesPerSecond)}/s)`;
}

function formatGuesses(g) {
  if (g >= 1e9 && g % 1e9 === 0) return (g / 1e9) + " billion";
  if (g >= 1e6 && g % 1e6 === 0) return (g / 1e6) + " million";
  return g.toLocaleString();
}

function humanizeSeconds(seconds) {
  if (seconds < 1) return `${(seconds * 1000).toFixed(2)} ms`;
  if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
  const mins = seconds / 60;
  if (mins < 60) return `${mins.toFixed(2)} minutes`;
  const hours = mins / 60;
  if (hours < 24) return `${hours.toFixed(2)} hours`;
  const days = hours / 24;
  if (days < 365) return `${days.toFixed(2)} days`;
  const years = days / 365.25;
  return humanizeYears(years);
}

function humanizeYears(years) {
  if (years < 1000) return `${years.toFixed(2)} years`;
  if (years < 1e6) return `${(years / 1000).toFixed(2)} thousand years`;
  if (years < 1e9) return `${(years / 1e6).toFixed(2)} million years`;
  return `${(years / 1e9).toFixed(2)} billion years`;
}

function updateStrengthAndCrack(password, charsetSize) {
  const bits = estimateEntropyBits(password.length, charsetSize);
  const pct = Math.min(100, Math.round((bits / 90) * 100));
  strengthFill.style.width = pct + "%";

  let label = "Very weak";
  if (bits >= 80) label = `Very strong (${Math.round(bits)} bits)`;
  else if (bits >= 60) label = `Strong (${Math.round(bits)} bits)`;
  else if (bits >= 40) label = `Okay (${Math.round(bits)} bits)`;
  else if (bits > 0) label = `Weak (${Math.round(bits)} bits)`;
  else label = `Invalid`;

  strengthLabel.textContent = label;

  const crack = formatCrackTimeFromBits(bits, GUESSES_PER_SECOND);
  crackTimeEl.textContent = `Crack time (est): ${crack} (at ${formatGuesses(GUESSES_PER_SECOND)}/s)`;
}

// copy with feedback and fallback
async function copyPassword() {
  const text = passwordEl.value;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showCopyFeedback(true);
  } catch (err) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showCopyFeedback(true);
    } catch (e) {
      showCopyFeedback(false);
    }
  }
}

function showCopyFeedback(success) {
  const icon = el("copyIcon");
  if (success) {
    icon.textContent = "✅";
    copyMsg.textContent = "Copied!";
  } else {
    icon.textContent = "❌";
    copyMsg.textContent = "Copy failed";
  }
  setTimeout(() => {
    icon.textContent = "📋";
    copyMsg.textContent = "";
  }, 1500);
}

// wire events
[lengthEl, upperEl, numbersEl, symbolsEl, excludeAmbiguousEl].forEach(input => {
  input.addEventListener("input", () => {
    lengthValueEl.textContent = lengthEl.value;
    generatePassword();
  });
});

copyBtn.addEventListener("click", copyPassword);

// initial render
(function init() {
  lengthValueEl.textContent = lengthEl.value;
  if (parseInt(lengthEl.min, 10) < 8) lengthEl.min = 8;
  if (parseInt(lengthEl.value, 10) < 8) {
    lengthEl.value = 8;
    lengthValueEl.textContent = "8";
  }
  generatePassword();
})();