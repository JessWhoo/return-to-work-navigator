import React from 'react';

// Spec-compliant ISO/IEC 18004 QR Code generator (Byte mode, Version 3-L, 29x29)
// Supports any ASCII/UTF-8 URL up to 53 bytes (e.g. "https://return-to-work-navigator.org").

function buildGfTables() {
  const exp = new Uint8Array(512);
  const log = new Uint8Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];
  return { exp, log };
}

function reedSolomonRemainder(data, ecCount) {
  const { exp, log } = buildGfTables();
  const mul = (a, b) => (a === 0 || b === 0 ? 0 : exp[log[a] + log[b]]);

  // Build generator polynomial of degree ecCount
  let gen = new Uint8Array([1]);
  for (let i = 0; i < ecCount; i++) {
    const next = new Uint8Array(gen.length + 1);
    for (let j = 0; j < gen.length; j++) {
      next[j] ^= gen[j];
      next[j + 1] ^= mul(gen[j], exp[i]);
    }
    gen = next;
  }

  const rem = new Uint8Array(ecCount);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ rem[0];
    for (let j = 0; j < ecCount - 1; j++) rem[j] = rem[j + 1];
    rem[ecCount - 1] = 0;
    if (factor !== 0) {
      for (let j = 0; j < ecCount; j++) {
        rem[j] ^= mul(gen[j + 1], factor);
      }
    }
  }
  return rem;
}

function computeFormatBits(ecLevelBits, maskIndex) {
  const data = (ecLevelBits << 3) | maskIndex;
  let rem = data << 10;
  for (let i = 4; i >= 0; i--) {
    if (rem & (1 << (i + 10))) rem ^= 0x537 << i;
  }
  return ((data << 10) | rem) ^ 0x5412;
}

export function getQrMatrix(text = 'https://return-to-work-navigator.org') {
  const bytes = new TextEncoder().encode(text);
  const size = 29; // Version 3
  const dataCapacity = 55;
  const ecCount = 15;

  // 1. Encode data bits (Byte mode = 0100)
  const bits = [];
  const pushBits = (val, len) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };
  pushBits(0b0100, 4);
  pushBits(bytes.length, 8);
  for (const b of bytes) pushBits(b, 8);
  for (let i = 0; i < 4 && bits.length < dataCapacity * 8; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const dataWords = new Uint8Array(dataCapacity);
  for (let i = 0; i < bits.length / 8; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) byte = (byte << 1) | bits[i * 8 + b];
    dataWords[i] = byte;
  }
  const padBytes = [0xec, 0x11];
  for (let i = bits.length / 8, p = 0; i < dataCapacity; i++, p ^= 1) {
    dataWords[i] = padBytes[p];
  }

  const ecWords = reedSolomonRemainder(dataWords, ecCount);
  const allWords = new Uint8Array(dataCapacity + ecCount);
  allWords.set(dataWords, 0);
  allWords.set(ecWords, dataCapacity);

  // 2. Initialize grid
  const modules = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunction = Array.from({ length: size }, () => new Array(size).fill(false));

  const setFunction = (r, c, dark) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    modules[r][c] = dark;
    isFunction[r][c] = true;
  };

  // Finder patterns + separators
  const drawFinder = (topR, leftC) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = topR + dr;
        const c = leftC + dc;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunction(r, c, inOuter && (onBorder || inInner));
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setFunction(6, i, i % 2 === 0);
    setFunction(i, 6, i % 2 === 0);
  }

  // Alignment pattern for Version 3 at center (22, 22)
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      const dist = Math.max(Math.abs(dr), Math.abs(dc));
      setFunction(22 + dr, 22 + dc, dist !== 1);
    }
  }

  // Dark module & reserve format info areas
  setFunction(size - 8, 8, true);
  for (let i = 0; i <= 8; i++) {
    if (!isFunction[8][i]) setFunction(8, i, false);
    if (!isFunction[i][8]) setFunction(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    if (!isFunction[8][size - 1 - i]) setFunction(8, size - 1 - i, false);
    if (!isFunction[size - 1 - i][8]) setFunction(size - 1 - i, 8, false);
  }

  // 3. Place data bits in zigzag upward/downward pairs
  let bitIdx = 0;
  const totalBits = allWords.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        const upward = ((right + 1) & 2) === 0;
        const r = upward ? size - 1 - vert : vert;
        if (!isFunction[r][c]) {
          let dark = false;
          if (bitIdx < totalBits) {
            dark = ((allWords[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1) !== 0;
            bitIdx++;
          }
          // Apply mask 0: (r + c) % 2 === 0
          if ((r + c) % 2 === 0) dark = !dark;
          modules[r][c] = dark;
        }
      }
    }
  }

  // 4. Write Format bits (Level L = 01, Mask 0 = 000)
  const formatBits = computeFormatBits(0b01, 0);
  const getFmtBit = (i) => ((formatBits >> i) & 1) !== 0;

  // ISO/IEC 18004 format information bit placement (bit 14 = MSB placed first at (8,0) and (size-1,8))
  for (let i = 0; i <= 5; i++) modules[8][i] = getFmtBit(14 - i);
  modules[8][7] = getFmtBit(8);
  modules[8][8] = getFmtBit(7);
  modules[7][8] = getFmtBit(6);
  for (let i = 9; i < 15; i++) modules[14 - i][8] = getFmtBit(14 - i);

  for (let i = 0; i < 7; i++) modules[size - 1 - i][8] = getFmtBit(14 - i);
  for (let i = 7; i < 15; i++) modules[8][size - 15 + i] = getFmtBit(14 - i);
  modules[size - 8][8] = true;

  return modules;
}

export function QrCodeSvg({
  url = 'https://return-to-work-navigator.org',
  size = 128,
  fgColor = '#2F2A38',
  bgColor = '#FFFFFF',
  className = '',
}) {
  const matrix = React.useMemo(() => getQrMatrix(url), [url]);
  const quietZone = 3;
  const totalModules = matrix.length + quietZone * 2;

  const rects = [
    React.createElement('rect', {
      key: 'bg',
      width: totalModules,
      height: totalModules,
      fill: bgColor,
      rx: '1.5',
    }),
  ];
  matrix.forEach((row, r) => {
    row.forEach((dark, c) => {
      if (dark) {
        rects.push(
          React.createElement('rect', {
            key: `${r}-${c}`,
            x: c + quietZone,
            y: r + quietZone,
            width: 1,
            height: 1,
            fill: fgColor,
          })
        );
      }
    });
  });

  return React.createElement(
    'svg',
    {
      viewBox: `0 0 ${totalModules} ${totalModules}`,
      width: size,
      height: size,
      role: 'img',
      'aria-label': `QR code for ${url}`,
      shapeRendering: 'crispEdges',
      className,
    },
    rects
  );
}