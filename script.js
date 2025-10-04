//KMP
function kmpSearch(text, pattern) {
  const n = text.length, m = pattern.length;
  const lps = Array(m).fill(0);
  const matches = [];

  // Build LPS
  let len = 0;
  for (let i = 1; i < m;) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;
    } else if (len) {
      len = lps[len - 1];
    } else {
      lps[i++] = 0;
    }
  }

  // Search
  let i = 0, j = 0;
  while (i < n) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }
    if (j === m) {
      matches.push(i - j);
      j = lps[j - 1];  
    } else if (i < n && text[i] !== pattern[j]) {
      j !== 0 ? j = lps[j - 1] : i++;
    }
  }
  return matches;
}

// Rabin-Karp Algorithm 
function rabinKarp(text, pattern) {
  const d = 256, q = 101;
  const n = text.length, m = pattern.length;
  let p = 0, t = 0, h = 1, matches = [];

  for (let i = 0; i < m - 1; i++) h = (h * d) % q;

  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }

  for (let i = 0; i <= n - m; i++) {
    if (p === t && text.substring(i, i + m) === pattern) matches.push(i);
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t += q;
    }
  }
  return matches;
}

// Z-Algorithm
function zAlgorithm(text, pattern) {
  const concat = pattern + "$" + text;
  const Z = Array(concat.length).fill(0), matches = [];
  let l = 0, r = 0;

  for (let i = 1; i < concat.length; i++) {
    if (i <= r) Z[i] = Math.min(r - i + 1, Z[i - l]);
    while (i + Z[i] < concat.length && concat[Z[i]] === concat[i + Z[i]]) Z[i]++;
    if (i + Z[i] - 1 > r) { l = i; r = i + Z[i] - 1; }
  }

  for (let i = 0; i < concat.length; i++) {
    if (Z[i] === pattern.length) matches.push(i - pattern.length - 1);
  }
  return matches;
}

// Run Search
function runSearch() {
  let text = document.getElementById("textInput").value;
  let pattern = document.getElementById("patternInput").value;
  let algo = document.getElementById("algoSelect").value;

  if (!text || !pattern) {
    alert("Please enter both text and pattern!");
    return;
  }

  let start = performance.now();
  let matches = [];

  if (algo === "kmp") matches = kmpSearch(text, pattern);
  else if (algo === "rabinKarp") matches = rabinKarp(text, pattern);
  else matches = zAlgorithm(text, pattern);
console.log("Matches array length:", matches.length);
console.log("First 10 matches:", matches.slice(0, 10));
console.log("Last 10 matches:", matches.slice(-10));
console.log("Pattern:", pattern, "Length:", pattern.length);
console.log("Text length:", text.length);
  let end = performance.now();

  // Highlight results
  let highlighted = "";
  let lastIndex = 0;
  matches.forEach(idx => {
    highlighted += text.substring(lastIndex, idx);
    highlighted += `<span class="highlight">${text.substring(idx, idx + pattern.length)}</span>`;
    lastIndex = idx + pattern.length;
  });
  highlighted += text.substring(lastIndex);

  document.getElementById("output").innerHTML = highlighted;
  document.getElementById("stats").innerText =
    `${algo.toUpperCase()} found ${matches.length} matches in ${(end - start).toFixed(2)} ms`;
}