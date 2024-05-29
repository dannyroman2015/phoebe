/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
const ca = "164", Zn = { LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2 }, $n = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }, Sl = 0, ba = 1, yl = 2, Sc = 1, El = 2, on = 3, un = 0, bt = 1, Wt = 2, Cn = 0, Mi = 1, wa = 2, Ra = 3, Ca = 4, Tl = 5, Wn = 100, Al = 101, bl = 102, wl = 103, Rl = 104, Cl = 200, Pl = 201, Ll = 202, Il = 203, jr = 204, Kr = 205, Dl = 206, Nl = 207, Ul = 208, Ol = 209, Fl = 210, Bl = 211, kl = 212, zl = 213, Hl = 214, Vl = 0, Gl = 1, Wl = 2, Vs = 3, Xl = 4, ql = 5, Yl = 6, jl = 7, yc = 0, Kl = 1, Zl = 2, Pn = 0, $l = 1, Jl = 2, Ql = 3, eh = 4, th = 5, nh = 6, ih = 7, Pa = "attached", sh = "detached", Ec = 300, Ti = 301, Ai = 302, Zr = 303, $r = 304, Js = 306, bi = 1e3, bn = 1001, Gs = 1002, At = 1003, Tc = 1004, Ki = 1005, Pt = 1006, zs = 1007, cn = 1008, Ln = 1009, rh = 1010, ah = 1011, Ac = 1012, bc = 1013, wi = 1014, qt = 1015, Qs = 1016, wc = 1017, Rc = 1018, as = 1020, oh = 35902, ch = 1021, lh = 1022, zt = 1023, hh = 1024, uh = 1025, Si = 1026, ts = 1027, Cc = 1028, Pc = 1029, dh = 1030, Lc = 1031, Ic = 1033, or = 33776, cr = 33777, lr = 33778, hr = 33779, La = 35840, Ia = 35841, Da = 35842, Na = 35843, Ua = 36196, Oa = 37492, Fa = 37496, Ba = 37808, ka = 37809, za = 37810, Ha = 37811, Va = 37812, Ga = 37813, Wa = 37814, Xa = 37815, qa = 37816, Ya = 37817, ja = 37818, Ka = 37819, Za = 37820, $a = 37821, ur = 36492, Ja = 36494, Qa = 36495, fh = 36283, eo = 36284, to = 36285, no = 36286, ph = 2200, mh = 2201, gh = 2202, ns = 2300, Ri = 2301, dr = 2302, _i = 2400, xi = 2401, Ws = 2402, la = 2500, _h = 2501, xh = 0, Dc = 1, Jr = 2, vh = 3200, Mh = 3201, Nc = 0, Sh = 1, An = "", mt = "srgb", pt = "srgb-linear", ha = "display-p3", er = "display-p3-linear", Xs = "linear", tt = "srgb", qs = "rec709", Ys = "p3", Jn = 7680, io = 519, yh = 512, Eh = 513, Th = 514, Uc = 515, Ah = 516, bh = 517, wh = 518, Rh = 519, Qr = 35044, so = "300 es", ln = 2e3, js = 2001;
class Dn {
  addEventListener(e, t) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t);
  }
  hasEventListener(e, t) {
    if (this._listeners === void 0)
      return !1;
    const n = this._listeners;
    return n[e] !== void 0 && n[e].indexOf(t) !== -1;
  }
  removeEventListener(e, t) {
    if (this._listeners === void 0)
      return;
    const i = this._listeners[e];
    if (i !== void 0) {
      const r = i.indexOf(t);
      r !== -1 && i.splice(r, 1);
    }
  }
  dispatchEvent(e) {
    if (this._listeners === void 0)
      return;
    const n = this._listeners[e.type];
    if (n !== void 0) {
      e.target = this;
      const i = n.slice(0);
      for (let r = 0, a = i.length; r < a; r++)
        i[r].call(this, e);
      e.target = null;
    }
  }
}
const Mt = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
let ro = 1234567;
const $i = Math.PI / 180, Ci = 180 / Math.PI;
function Ht() {
  const s = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (Mt[s & 255] + Mt[s >> 8 & 255] + Mt[s >> 16 & 255] + Mt[s >> 24 & 255] + "-" + Mt[e & 255] + Mt[e >> 8 & 255] + "-" + Mt[e >> 16 & 15 | 64] + Mt[e >> 24 & 255] + "-" + Mt[t & 63 | 128] + Mt[t >> 8 & 255] + "-" + Mt[t >> 16 & 255] + Mt[t >> 24 & 255] + Mt[n & 255] + Mt[n >> 8 & 255] + Mt[n >> 16 & 255] + Mt[n >> 24 & 255]).toLowerCase();
}
function gt(s, e, t) {
  return Math.max(e, Math.min(t, s));
}
function ua(s, e) {
  return (s % e + e) % e;
}
function Ch(s, e, t, n, i) {
  return n + (s - e) * (i - n) / (t - e);
}
function Ph(s, e, t) {
  return s !== e ? (t - s) / (e - s) : 0;
}
function Ji(s, e, t) {
  return (1 - t) * s + t * e;
}
function Lh(s, e, t, n) {
  return Ji(s, e, 1 - Math.exp(-t * n));
}
function Ih(s, e = 1) {
  return e - Math.abs(ua(s, e * 2) - e);
}
function Dh(s, e, t) {
  return s <= e ? 0 : s >= t ? 1 : (s = (s - e) / (t - e), s * s * (3 - 2 * s));
}
function Nh(s, e, t) {
  return s <= e ? 0 : s >= t ? 1 : (s = (s - e) / (t - e), s * s * s * (s * (s * 6 - 15) + 10));
}
function Uh(s, e) {
  return s + Math.floor(Math.random() * (e - s + 1));
}
function Oh(s, e) {
  return s + Math.random() * (e - s);
}
function Fh(s) {
  return s * (0.5 - Math.random());
}
function Bh(s) {
  s !== void 0 && (ro = s);
  let e = ro += 1831565813;
  return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
}
function kh(s) {
  return s * $i;
}
function zh(s) {
  return s * Ci;
}
function Hh(s) {
  return (s & s - 1) === 0 && s !== 0;
}
function Vh(s) {
  return Math.pow(2, Math.ceil(Math.log(s) / Math.LN2));
}
function Gh(s) {
  return Math.pow(2, Math.floor(Math.log(s) / Math.LN2));
}
function Wh(s, e, t, n, i) {
  const r = Math.cos, a = Math.sin, o = r(t / 2), c = a(t / 2), l = r((e + n) / 2), h = a((e + n) / 2), u = r((e - n) / 2), d = a((e - n) / 2), p = r((n - e) / 2), g = a((n - e) / 2);
  switch (i) {
    case "XYX":
      s.set(o * h, c * u, c * d, o * l);
      break;
    case "YZY":
      s.set(c * d, o * h, c * u, o * l);
      break;
    case "ZXZ":
      s.set(c * u, c * d, o * h, o * l);
      break;
    case "XZX":
      s.set(o * h, c * g, c * p, o * l);
      break;
    case "YXY":
      s.set(c * p, o * h, c * g, o * l);
      break;
    case "ZYZ":
      s.set(c * g, c * p, o * h, o * l);
      break;
    default:
      console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + i);
  }
}
function kt(s, e) {
  switch (e.constructor) {
    case Float32Array:
      return s;
    case Uint32Array:
      return s / 4294967295;
    case Uint16Array:
      return s / 65535;
    case Uint8Array:
      return s / 255;
    case Int32Array:
      return Math.max(s / 2147483647, -1);
    case Int16Array:
      return Math.max(s / 32767, -1);
    case Int8Array:
      return Math.max(s / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function je(s, e) {
  switch (e.constructor) {
    case Float32Array:
      return s;
    case Uint32Array:
      return Math.round(s * 4294967295);
    case Uint16Array:
      return Math.round(s * 65535);
    case Uint8Array:
      return Math.round(s * 255);
    case Int32Array:
      return Math.round(s * 2147483647);
    case Int16Array:
      return Math.round(s * 32767);
    case Int8Array:
      return Math.round(s * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const Oc = {
  DEG2RAD: $i,
  RAD2DEG: Ci,
  generateUUID: Ht,
  clamp: gt,
  euclideanModulo: ua,
  mapLinear: Ch,
  inverseLerp: Ph,
  lerp: Ji,
  damp: Lh,
  pingpong: Ih,
  smoothstep: Dh,
  smootherstep: Nh,
  randInt: Uh,
  randFloat: Oh,
  randFloatSpread: Fh,
  seededRandom: Bh,
  degToRad: kh,
  radToDeg: zh,
  isPowerOfTwo: Hh,
  ceilPowerOfTwo: Vh,
  floorPowerOfTwo: Gh,
  setQuaternionFromProperEuler: Wh,
  normalize: je,
  denormalize: kt
};
class Me {
  constructor(e = 0, t = 0) {
    Me.prototype.isVector2 = !0, this.x = e, this.y = t;
  }
  get width() {
    return this.x;
  }
  set width(e) {
    this.x = e;
  }
  get height() {
    return this.y;
  }
  set height(e) {
    this.y = e;
  }
  set(e, t) {
    return this.x = e, this.y = t, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this;
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  applyMatrix3(e) {
    const t = this.x, n = this.y, i = e.elements;
    return this.x = i[0] * t + i[3] * n + i[6], this.y = i[1] * t + i[4] * n + i[7], this;
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
  }
  clamp(e, t) {
    return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this;
  }
  clampScalar(e, t) {
    return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this;
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(e, Math.min(t, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y;
  }
  cross(e) {
    return this.x * e.y - this.y * e.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0)
      return Math.PI / 2;
    const n = this.dot(e) / t;
    return Math.acos(gt(n, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x, n = this.y - e.y;
    return t * t + n * n;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
  }
  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this;
  }
  rotateAround(e, t) {
    const n = Math.cos(t), i = Math.sin(t), r = this.x - e.x, a = this.y - e.y;
    return this.x = r * n - a * i + e.x, this.y = r * i + a * n + e.y, this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class Le {
  constructor(e, t, n, i, r, a, o, c, l) {
    Le.prototype.isMatrix3 = !0, this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, n, i, r, a, o, c, l);
  }
  set(e, t, n, i, r, a, o, c, l) {
    const h = this.elements;
    return h[0] = e, h[1] = i, h[2] = o, h[3] = t, h[4] = r, h[5] = c, h[6] = n, h[7] = a, h[8] = l, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ), this;
  }
  copy(e) {
    const t = this.elements, n = e.elements;
    return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], this;
  }
  extractBasis(e, t, n) {
    return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
  }
  setFromMatrix4(e) {
    const t = e.elements;
    return this.set(
      t[0],
      t[4],
      t[8],
      t[1],
      t[5],
      t[9],
      t[2],
      t[6],
      t[10]
    ), this;
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, t) {
    const n = e.elements, i = t.elements, r = this.elements, a = n[0], o = n[3], c = n[6], l = n[1], h = n[4], u = n[7], d = n[2], p = n[5], g = n[8], _ = i[0], f = i[3], m = i[6], T = i[1], S = i[4], A = i[7], D = i[2], R = i[5], w = i[8];
    return r[0] = a * _ + o * T + c * D, r[3] = a * f + o * S + c * R, r[6] = a * m + o * A + c * w, r[1] = l * _ + h * T + u * D, r[4] = l * f + h * S + u * R, r[7] = l * m + h * A + u * w, r[2] = d * _ + p * T + g * D, r[5] = d * f + p * S + g * R, r[8] = d * m + p * A + g * w, this;
  }
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
  }
  determinant() {
    const e = this.elements, t = e[0], n = e[1], i = e[2], r = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8];
    return t * a * h - t * o * l - n * r * h + n * o * c + i * r * l - i * a * c;
  }
  invert() {
    const e = this.elements, t = e[0], n = e[1], i = e[2], r = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8], u = h * a - o * l, d = o * c - h * r, p = l * r - a * c, g = t * u + n * d + i * p;
    if (g === 0)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const _ = 1 / g;
    return e[0] = u * _, e[1] = (i * l - h * n) * _, e[2] = (o * n - i * a) * _, e[3] = d * _, e[4] = (h * t - i * c) * _, e[5] = (i * r - o * t) * _, e[6] = p * _, e[7] = (n * c - l * t) * _, e[8] = (a * t - n * r) * _, this;
  }
  transpose() {
    let e;
    const t = this.elements;
    return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
  }
  getNormalMatrix(e) {
    return this.setFromMatrix4(e).invert().transpose();
  }
  transposeIntoArray(e) {
    const t = this.elements;
    return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
  }
  setUvTransform(e, t, n, i, r, a, o) {
    const c = Math.cos(r), l = Math.sin(r);
    return this.set(
      n * c,
      n * l,
      -n * (c * a + l * o) + a + e,
      -i * l,
      i * c,
      -i * (-l * a + c * o) + o + t,
      0,
      0,
      1
    ), this;
  }
  //
  scale(e, t) {
    return this.premultiply(fr.makeScale(e, t)), this;
  }
  rotate(e) {
    return this.premultiply(fr.makeRotation(-e)), this;
  }
  translate(e, t) {
    return this.premultiply(fr.makeTranslation(e, t)), this;
  }
  // for 2D Transforms
  makeTranslation(e, t) {
    return e.isVector2 ? this.set(
      1,
      0,
      e.x,
      0,
      1,
      e.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      e,
      0,
      1,
      t,
      0,
      0,
      1
    ), this;
  }
  makeRotation(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      t,
      -n,
      0,
      n,
      t,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(e, t) {
    return this.set(
      e,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      1
    ), this;
  }
  //
  equals(e) {
    const t = this.elements, n = e.elements;
    for (let i = 0; i < 9; i++)
      if (t[i] !== n[i])
        return !1;
    return !0;
  }
  fromArray(e, t = 0) {
    for (let n = 0; n < 9; n++)
      this.elements[n] = e[n + t];
    return this;
  }
  toArray(e = [], t = 0) {
    const n = this.elements;
    return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const fr = /* @__PURE__ */ new Le();
function Fc(s) {
  for (let e = s.length - 1; e >= 0; --e)
    if (s[e] >= 65535)
      return !0;
  return !1;
}
function is(s) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", s);
}
function Xh() {
  const s = is("canvas");
  return s.style.display = "block", s;
}
const ao = {};
function Bc(s) {
  s in ao || (ao[s] = !0, console.warn(s));
}
const oo = /* @__PURE__ */ new Le().set(
  0.8224621,
  0.177538,
  0,
  0.0331941,
  0.9668058,
  0,
  0.0170827,
  0.0723974,
  0.9105199
), co = /* @__PURE__ */ new Le().set(
  1.2249401,
  -0.2249404,
  0,
  -0.0420569,
  1.0420571,
  0,
  -0.0196376,
  -0.0786361,
  1.0982735
), us = {
  [pt]: {
    transfer: Xs,
    primaries: qs,
    toReference: (s) => s,
    fromReference: (s) => s
  },
  [mt]: {
    transfer: tt,
    primaries: qs,
    toReference: (s) => s.convertSRGBToLinear(),
    fromReference: (s) => s.convertLinearToSRGB()
  },
  [er]: {
    transfer: Xs,
    primaries: Ys,
    toReference: (s) => s.applyMatrix3(co),
    fromReference: (s) => s.applyMatrix3(oo)
  },
  [ha]: {
    transfer: tt,
    primaries: Ys,
    toReference: (s) => s.convertSRGBToLinear().applyMatrix3(co),
    fromReference: (s) => s.applyMatrix3(oo).convertLinearToSRGB()
  }
}, qh = /* @__PURE__ */ new Set([pt, er]), qe = {
  enabled: !0,
  _workingColorSpace: pt,
  get workingColorSpace() {
    return this._workingColorSpace;
  },
  set workingColorSpace(s) {
    if (!qh.has(s))
      throw new Error(`Unsupported working color space, "${s}".`);
    this._workingColorSpace = s;
  },
  convert: function(s, e, t) {
    if (this.enabled === !1 || e === t || !e || !t)
      return s;
    const n = us[e].toReference, i = us[t].fromReference;
    return i(n(s));
  },
  fromWorkingColorSpace: function(s, e) {
    return this.convert(s, this._workingColorSpace, e);
  },
  toWorkingColorSpace: function(s, e) {
    return this.convert(s, e, this._workingColorSpace);
  },
  getPrimaries: function(s) {
    return us[s].primaries;
  },
  getTransfer: function(s) {
    return s === An ? Xs : us[s].transfer;
  }
};
function yi(s) {
  return s < 0.04045 ? s * 0.0773993808 : Math.pow(s * 0.9478672986 + 0.0521327014, 2.4);
}
function pr(s) {
  return s < 31308e-7 ? s * 12.92 : 1.055 * Math.pow(s, 0.41666) - 0.055;
}
let Qn;
class Yh {
  static getDataURL(e) {
    if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u")
      return e.src;
    let t;
    if (e instanceof HTMLCanvasElement)
      t = e;
    else {
      Qn === void 0 && (Qn = is("canvas")), Qn.width = e.width, Qn.height = e.height;
      const n = Qn.getContext("2d");
      e instanceof ImageData ? n.putImageData(e, 0, 0) : n.drawImage(e, 0, 0, e.width, e.height), t = Qn;
    }
    return t.width > 2048 || t.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", e), t.toDataURL("image/jpeg", 0.6)) : t.toDataURL("image/png");
  }
  static sRGBToLinear(e) {
    if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
      const t = is("canvas");
      t.width = e.width, t.height = e.height;
      const n = t.getContext("2d");
      n.drawImage(e, 0, 0, e.width, e.height);
      const i = n.getImageData(0, 0, e.width, e.height), r = i.data;
      for (let a = 0; a < r.length; a++)
        r[a] = yi(r[a] / 255) * 255;
      return n.putImageData(i, 0, 0), t;
    } else if (e.data) {
      const t = e.data.slice(0);
      for (let n = 0; n < t.length; n++)
        t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[n] = Math.floor(yi(t[n] / 255) * 255) : t[n] = yi(t[n]);
      return {
        data: t,
        width: e.width,
        height: e.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
  }
}
let jh = 0;
class kc {
  constructor(e = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: jh++ }), this.uuid = Ht(), this.data = e, this.dataReady = !0, this.version = 0;
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.images[this.uuid] !== void 0)
      return e.images[this.uuid];
    const n = {
      uuid: this.uuid,
      url: ""
    }, i = this.data;
    if (i !== null) {
      let r;
      if (Array.isArray(i)) {
        r = [];
        for (let a = 0, o = i.length; a < o; a++)
          i[a].isDataTexture ? r.push(mr(i[a].image)) : r.push(mr(i[a]));
      } else
        r = mr(i);
      n.url = r;
    }
    return t || (e.images[this.uuid] = n), n;
  }
}
function mr(s) {
  return typeof HTMLImageElement < "u" && s instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && s instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && s instanceof ImageBitmap ? Yh.getDataURL(s) : s.data ? {
    data: Array.from(s.data),
    width: s.width,
    height: s.height,
    type: s.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let Kh = 0;
class ft extends Dn {
  constructor(e = ft.DEFAULT_IMAGE, t = ft.DEFAULT_MAPPING, n = bn, i = bn, r = Pt, a = cn, o = zt, c = Ln, l = ft.DEFAULT_ANISOTROPY, h = An) {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: Kh++ }), this.uuid = Ht(), this.name = "", this.source = new kc(e), this.mipmaps = [], this.mapping = t, this.channel = 0, this.wrapS = n, this.wrapT = i, this.magFilter = r, this.minFilter = a, this.anisotropy = l, this.format = o, this.internalFormat = null, this.type = c, this.offset = new Me(0, 0), this.repeat = new Me(1, 1), this.center = new Me(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new Le(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = h, this.userData = {}, this.version = 0, this.onUpdate = null, this.isRenderTargetTexture = !1, this.pmremVersion = 0;
  }
  get image() {
    return this.source.data;
  }
  set image(e = null) {
    this.source.data = e;
  }
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = !0, this;
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.textures[this.uuid] !== void 0)
      return e.textures[this.uuid];
    const n = {
      metadata: {
        version: 4.6,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(e).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (n.userData = this.userData), t || (e.textures[this.uuid] = n), n;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(e) {
    if (this.mapping !== Ec)
      return e;
    if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1)
      switch (this.wrapS) {
        case bi:
          e.x = e.x - Math.floor(e.x);
          break;
        case bn:
          e.x = e.x < 0 ? 0 : 1;
          break;
        case Gs:
          Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
          break;
      }
    if (e.y < 0 || e.y > 1)
      switch (this.wrapT) {
        case bi:
          e.y = e.y - Math.floor(e.y);
          break;
        case bn:
          e.y = e.y < 0 ? 0 : 1;
          break;
        case Gs:
          Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
          break;
      }
    return this.flipY && (e.y = 1 - e.y), e;
  }
  set needsUpdate(e) {
    e === !0 && (this.version++, this.source.needsUpdate = !0);
  }
  set needsPMREMUpdate(e) {
    e === !0 && this.pmremVersion++;
  }
}
ft.DEFAULT_IMAGE = null;
ft.DEFAULT_MAPPING = Ec;
ft.DEFAULT_ANISOTROPY = 1;
class Je {
  constructor(e = 0, t = 0, n = 0, i = 1) {
    Je.prototype.isVector4 = !0, this.x = e, this.y = t, this.z = n, this.w = i;
  }
  get width() {
    return this.z;
  }
  set width(e) {
    this.z = e;
  }
  get height() {
    return this.w;
  }
  set height(e) {
    this.w = e;
  }
  set(e, t, n, i) {
    return this.x = e, this.y = t, this.z = n, this.w = i, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this.w = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setZ(e) {
    return this.z = e, this;
  }
  setW(e) {
    return this.w = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      case 3:
        this.w = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this.w += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
  }
  applyMatrix4(e) {
    const t = this.x, n = this.y, i = this.z, r = this.w, a = e.elements;
    return this.x = a[0] * t + a[4] * n + a[8] * i + a[12] * r, this.y = a[1] * t + a[5] * n + a[9] * i + a[13] * r, this.z = a[2] * t + a[6] * n + a[10] * i + a[14] * r, this.w = a[3] * t + a[7] * n + a[11] * i + a[15] * r, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  setAxisAngleFromQuaternion(e) {
    this.w = 2 * Math.acos(e.w);
    const t = Math.sqrt(1 - e.w * e.w);
    return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
  }
  setAxisAngleFromRotationMatrix(e) {
    let t, n, i, r;
    const c = e.elements, l = c[0], h = c[4], u = c[8], d = c[1], p = c[5], g = c[9], _ = c[2], f = c[6], m = c[10];
    if (Math.abs(h - d) < 0.01 && Math.abs(u - _) < 0.01 && Math.abs(g - f) < 0.01) {
      if (Math.abs(h + d) < 0.1 && Math.abs(u + _) < 0.1 && Math.abs(g + f) < 0.1 && Math.abs(l + p + m - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      t = Math.PI;
      const S = (l + 1) / 2, A = (p + 1) / 2, D = (m + 1) / 2, R = (h + d) / 4, w = (u + _) / 4, k = (g + f) / 4;
      return S > A && S > D ? S < 0.01 ? (n = 0, i = 0.707106781, r = 0.707106781) : (n = Math.sqrt(S), i = R / n, r = w / n) : A > D ? A < 0.01 ? (n = 0.707106781, i = 0, r = 0.707106781) : (i = Math.sqrt(A), n = R / i, r = k / i) : D < 0.01 ? (n = 0.707106781, i = 0.707106781, r = 0) : (r = Math.sqrt(D), n = w / r, i = k / r), this.set(n, i, r, t), this;
    }
    let T = Math.sqrt((f - g) * (f - g) + (u - _) * (u - _) + (d - h) * (d - h));
    return Math.abs(T) < 1e-3 && (T = 1), this.x = (f - g) / T, this.y = (u - _) / T, this.z = (d - h) / T, this.w = Math.acos((l + p + m - 1) / 2), this;
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
  }
  clamp(e, t) {
    return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this.z = Math.max(e.z, Math.min(t.z, this.z)), this.w = Math.max(e.w, Math.min(t.w, this.w)), this;
  }
  clampScalar(e, t) {
    return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this.z = Math.max(e, Math.min(t, this.z)), this.w = Math.max(e, Math.min(t, this.w)), this;
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(e, Math.min(t, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
  }
  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this.w = e.w + (t.w - e.w) * n, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class Zh extends Dn {
  constructor(e = 1, t = 1, n = {}) {
    super(), this.isRenderTarget = !0, this.width = e, this.height = t, this.depth = 1, this.scissor = new Je(0, 0, e, t), this.scissorTest = !1, this.viewport = new Je(0, 0, e, t);
    const i = { width: e, height: t, depth: 1 };
    n = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: Pt,
      depthBuffer: !0,
      stencilBuffer: !1,
      resolveDepthBuffer: !0,
      resolveStencilBuffer: !0,
      depthTexture: null,
      samples: 0,
      count: 1
    }, n);
    const r = new ft(i, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace);
    r.flipY = !1, r.generateMipmaps = n.generateMipmaps, r.internalFormat = n.internalFormat, this.textures = [];
    const a = n.count;
    for (let o = 0; o < a; o++)
      this.textures[o] = r.clone(), this.textures[o].isRenderTargetTexture = !0;
    this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this.depthTexture = n.depthTexture, this.samples = n.samples;
  }
  get texture() {
    return this.textures[0];
  }
  set texture(e) {
    this.textures[0] = e;
  }
  setSize(e, t, n = 1) {
    if (this.width !== e || this.height !== t || this.depth !== n) {
      this.width = e, this.height = t, this.depth = n;
      for (let i = 0, r = this.textures.length; i < r; i++)
        this.textures[i].image.width = e, this.textures[i].image.height = t, this.textures[i].image.depth = n;
      this.dispose();
    }
    this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
    for (let n = 0, i = e.textures.length; n < i; n++)
      this.textures[n] = e.textures[n].clone(), this.textures[n].isRenderTargetTexture = !0;
    const t = Object.assign({}, e.texture.image);
    return this.texture.source = new kc(t), this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class Yn extends Zh {
  constructor(e = 1, t = 1, n = {}) {
    super(e, t, n), this.isWebGLRenderTarget = !0;
  }
}
class zc extends ft {
  constructor(e = null, t = 1, n = 1, i = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = { data: e, width: t, height: n, depth: i }, this.magFilter = At, this.minFilter = At, this.wrapR = bn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class $h extends ft {
  constructor(e = null, t = 1, n = 1, i = 1) {
    super(null), this.isData3DTexture = !0, this.image = { data: e, width: t, height: n, depth: i }, this.magFilter = At, this.minFilter = At, this.wrapR = bn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class Lt {
  constructor(e = 0, t = 0, n = 0, i = 1) {
    this.isQuaternion = !0, this._x = e, this._y = t, this._z = n, this._w = i;
  }
  static slerpFlat(e, t, n, i, r, a, o) {
    let c = n[i + 0], l = n[i + 1], h = n[i + 2], u = n[i + 3];
    const d = r[a + 0], p = r[a + 1], g = r[a + 2], _ = r[a + 3];
    if (o === 0) {
      e[t + 0] = c, e[t + 1] = l, e[t + 2] = h, e[t + 3] = u;
      return;
    }
    if (o === 1) {
      e[t + 0] = d, e[t + 1] = p, e[t + 2] = g, e[t + 3] = _;
      return;
    }
    if (u !== _ || c !== d || l !== p || h !== g) {
      let f = 1 - o;
      const m = c * d + l * p + h * g + u * _, T = m >= 0 ? 1 : -1, S = 1 - m * m;
      if (S > Number.EPSILON) {
        const D = Math.sqrt(S), R = Math.atan2(D, m * T);
        f = Math.sin(f * R) / D, o = Math.sin(o * R) / D;
      }
      const A = o * T;
      if (c = c * f + d * A, l = l * f + p * A, h = h * f + g * A, u = u * f + _ * A, f === 1 - o) {
        const D = 1 / Math.sqrt(c * c + l * l + h * h + u * u);
        c *= D, l *= D, h *= D, u *= D;
      }
    }
    e[t] = c, e[t + 1] = l, e[t + 2] = h, e[t + 3] = u;
  }
  static multiplyQuaternionsFlat(e, t, n, i, r, a) {
    const o = n[i], c = n[i + 1], l = n[i + 2], h = n[i + 3], u = r[a], d = r[a + 1], p = r[a + 2], g = r[a + 3];
    return e[t] = o * g + h * u + c * p - l * d, e[t + 1] = c * g + h * d + l * u - o * p, e[t + 2] = l * g + h * p + o * d - c * u, e[t + 3] = h * g - o * u - c * d - l * p, e;
  }
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(e) {
    this._w = e, this._onChangeCallback();
  }
  set(e, t, n, i) {
    return this._x = e, this._y = t, this._z = n, this._w = i, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(e) {
    return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
  }
  setFromEuler(e, t = !0) {
    const n = e._x, i = e._y, r = e._z, a = e._order, o = Math.cos, c = Math.sin, l = o(n / 2), h = o(i / 2), u = o(r / 2), d = c(n / 2), p = c(i / 2), g = c(r / 2);
    switch (a) {
      case "XYZ":
        this._x = d * h * u + l * p * g, this._y = l * p * u - d * h * g, this._z = l * h * g + d * p * u, this._w = l * h * u - d * p * g;
        break;
      case "YXZ":
        this._x = d * h * u + l * p * g, this._y = l * p * u - d * h * g, this._z = l * h * g - d * p * u, this._w = l * h * u + d * p * g;
        break;
      case "ZXY":
        this._x = d * h * u - l * p * g, this._y = l * p * u + d * h * g, this._z = l * h * g + d * p * u, this._w = l * h * u - d * p * g;
        break;
      case "ZYX":
        this._x = d * h * u - l * p * g, this._y = l * p * u + d * h * g, this._z = l * h * g - d * p * u, this._w = l * h * u + d * p * g;
        break;
      case "YZX":
        this._x = d * h * u + l * p * g, this._y = l * p * u + d * h * g, this._z = l * h * g - d * p * u, this._w = l * h * u - d * p * g;
        break;
      case "XZY":
        this._x = d * h * u - l * p * g, this._y = l * p * u - d * h * g, this._z = l * h * g + d * p * u, this._w = l * h * u + d * p * g;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a);
    }
    return t === !0 && this._onChangeCallback(), this;
  }
  setFromAxisAngle(e, t) {
    const n = t / 2, i = Math.sin(n);
    return this._x = e.x * i, this._y = e.y * i, this._z = e.z * i, this._w = Math.cos(n), this._onChangeCallback(), this;
  }
  setFromRotationMatrix(e) {
    const t = e.elements, n = t[0], i = t[4], r = t[8], a = t[1], o = t[5], c = t[9], l = t[2], h = t[6], u = t[10], d = n + o + u;
    if (d > 0) {
      const p = 0.5 / Math.sqrt(d + 1);
      this._w = 0.25 / p, this._x = (h - c) * p, this._y = (r - l) * p, this._z = (a - i) * p;
    } else if (n > o && n > u) {
      const p = 2 * Math.sqrt(1 + n - o - u);
      this._w = (h - c) / p, this._x = 0.25 * p, this._y = (i + a) / p, this._z = (r + l) / p;
    } else if (o > u) {
      const p = 2 * Math.sqrt(1 + o - n - u);
      this._w = (r - l) / p, this._x = (i + a) / p, this._y = 0.25 * p, this._z = (c + h) / p;
    } else {
      const p = 2 * Math.sqrt(1 + u - n - o);
      this._w = (a - i) / p, this._x = (r + l) / p, this._y = (c + h) / p, this._z = 0.25 * p;
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(e, t) {
    let n = e.dot(t) + 1;
    return n < Number.EPSILON ? (n = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = n)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = n), this.normalize();
  }
  angleTo(e) {
    return 2 * Math.acos(Math.abs(gt(this.dot(e), -1, 1)));
  }
  rotateTowards(e, t) {
    const n = this.angleTo(e);
    if (n === 0)
      return this;
    const i = Math.min(1, t / n);
    return this.slerp(e, i), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  dot(e) {
    return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let e = this.length();
    return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
  }
  multiply(e) {
    return this.multiplyQuaternions(this, e);
  }
  premultiply(e) {
    return this.multiplyQuaternions(e, this);
  }
  multiplyQuaternions(e, t) {
    const n = e._x, i = e._y, r = e._z, a = e._w, o = t._x, c = t._y, l = t._z, h = t._w;
    return this._x = n * h + a * o + i * l - r * c, this._y = i * h + a * c + r * o - n * l, this._z = r * h + a * l + n * c - i * o, this._w = a * h - n * o - i * c - r * l, this._onChangeCallback(), this;
  }
  slerp(e, t) {
    if (t === 0)
      return this;
    if (t === 1)
      return this.copy(e);
    const n = this._x, i = this._y, r = this._z, a = this._w;
    let o = a * e._w + n * e._x + i * e._y + r * e._z;
    if (o < 0 ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, o = -o) : this.copy(e), o >= 1)
      return this._w = a, this._x = n, this._y = i, this._z = r, this;
    const c = 1 - o * o;
    if (c <= Number.EPSILON) {
      const p = 1 - t;
      return this._w = p * a + t * this._w, this._x = p * n + t * this._x, this._y = p * i + t * this._y, this._z = p * r + t * this._z, this.normalize(), this;
    }
    const l = Math.sqrt(c), h = Math.atan2(l, o), u = Math.sin((1 - t) * h) / l, d = Math.sin(t * h) / l;
    return this._w = a * u + this._w * d, this._x = n * u + this._x * d, this._y = i * u + this._y * d, this._z = r * u + this._z * d, this._onChangeCallback(), this;
  }
  slerpQuaternions(e, t, n) {
    return this.copy(e).slerp(t, n);
  }
  random() {
    const e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), n = Math.random(), i = Math.sqrt(1 - n), r = Math.sqrt(n);
    return this.set(
      i * Math.sin(e),
      i * Math.cos(e),
      r * Math.sin(t),
      r * Math.cos(t)
    );
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
  }
  fromArray(e, t = 0) {
    return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
  }
  fromBufferAttribute(e, t) {
    return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class C {
  constructor(e = 0, t = 0, n = 0) {
    C.prototype.isVector3 = !0, this.x = e, this.y = t, this.z = n;
  }
  set(e, t, n) {
    return n === void 0 && (n = this.z), this.x = e, this.y = t, this.z = n, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setZ(e) {
    return this.z = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this;
  }
  multiplyVectors(e, t) {
    return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
  }
  applyEuler(e) {
    return this.applyQuaternion(lo.setFromEuler(e));
  }
  applyAxisAngle(e, t) {
    return this.applyQuaternion(lo.setFromAxisAngle(e, t));
  }
  applyMatrix3(e) {
    const t = this.x, n = this.y, i = this.z, r = e.elements;
    return this.x = r[0] * t + r[3] * n + r[6] * i, this.y = r[1] * t + r[4] * n + r[7] * i, this.z = r[2] * t + r[5] * n + r[8] * i, this;
  }
  applyNormalMatrix(e) {
    return this.applyMatrix3(e).normalize();
  }
  applyMatrix4(e) {
    const t = this.x, n = this.y, i = this.z, r = e.elements, a = 1 / (r[3] * t + r[7] * n + r[11] * i + r[15]);
    return this.x = (r[0] * t + r[4] * n + r[8] * i + r[12]) * a, this.y = (r[1] * t + r[5] * n + r[9] * i + r[13]) * a, this.z = (r[2] * t + r[6] * n + r[10] * i + r[14]) * a, this;
  }
  applyQuaternion(e) {
    const t = this.x, n = this.y, i = this.z, r = e.x, a = e.y, o = e.z, c = e.w, l = 2 * (a * i - o * n), h = 2 * (o * t - r * i), u = 2 * (r * n - a * t);
    return this.x = t + c * l + a * u - o * h, this.y = n + c * h + o * l - r * u, this.z = i + c * u + r * h - a * l, this;
  }
  project(e) {
    return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
  }
  unproject(e) {
    return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
  }
  transformDirection(e) {
    const t = this.x, n = this.y, i = this.z, r = e.elements;
    return this.x = r[0] * t + r[4] * n + r[8] * i, this.y = r[1] * t + r[5] * n + r[9] * i, this.z = r[2] * t + r[6] * n + r[10] * i, this.normalize();
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
  }
  clamp(e, t) {
    return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this.z = Math.max(e.z, Math.min(t.z, this.z)), this;
  }
  clampScalar(e, t) {
    return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this.z = Math.max(e, Math.min(t, this.z)), this;
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(e, Math.min(t, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  // TODO lengthSquared?
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
  }
  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this;
  }
  cross(e) {
    return this.crossVectors(this, e);
  }
  crossVectors(e, t) {
    const n = e.x, i = e.y, r = e.z, a = t.x, o = t.y, c = t.z;
    return this.x = i * c - r * o, this.y = r * a - n * c, this.z = n * o - i * a, this;
  }
  projectOnVector(e) {
    const t = e.lengthSq();
    if (t === 0)
      return this.set(0, 0, 0);
    const n = e.dot(this) / t;
    return this.copy(e).multiplyScalar(n);
  }
  projectOnPlane(e) {
    return gr.copy(this).projectOnVector(e), this.sub(gr);
  }
  reflect(e) {
    return this.sub(gr.copy(e).multiplyScalar(2 * this.dot(e)));
  }
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0)
      return Math.PI / 2;
    const n = this.dot(e) / t;
    return Math.acos(gt(n, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x, n = this.y - e.y, i = this.z - e.z;
    return t * t + n * n + i * i;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
  }
  setFromSpherical(e) {
    return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
  }
  setFromSphericalCoords(e, t, n) {
    const i = Math.sin(t) * e;
    return this.x = i * Math.sin(n), this.y = Math.cos(t) * e, this.z = i * Math.cos(n), this;
  }
  setFromCylindrical(e) {
    return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
  }
  setFromCylindricalCoords(e, t, n) {
    return this.x = e * Math.sin(t), this.y = n, this.z = e * Math.cos(t), this;
  }
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this;
  }
  setFromMatrixScale(e) {
    const t = this.setFromMatrixColumn(e, 0).length(), n = this.setFromMatrixColumn(e, 1).length(), i = this.setFromMatrixColumn(e, 2).length();
    return this.x = t, this.y = n, this.z = i, this;
  }
  setFromMatrixColumn(e, t) {
    return this.fromArray(e.elements, t * 4);
  }
  setFromMatrix3Column(e, t) {
    return this.fromArray(e.elements, t * 3);
  }
  setFromEuler(e) {
    return this.x = e._x, this.y = e._y, this.z = e._z, this;
  }
  setFromColor(e) {
    return this.x = e.r, this.y = e.g, this.z = e.b, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  randomDirection() {
    const e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, n = Math.sqrt(1 - t * t);
    return this.x = n * Math.cos(e), this.y = t, this.z = n * Math.sin(e), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const gr = /* @__PURE__ */ new C(), lo = /* @__PURE__ */ new Lt();
class dn {
  constructor(e = new C(1 / 0, 1 / 0, 1 / 0), t = new C(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = e, this.max = t;
  }
  set(e, t) {
    return this.min.copy(e), this.max.copy(t), this;
  }
  setFromArray(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t += 3)
      this.expandByPoint(Ot.fromArray(e, t));
    return this;
  }
  setFromBufferAttribute(e) {
    this.makeEmpty();
    for (let t = 0, n = e.count; t < n; t++)
      this.expandByPoint(Ot.fromBufferAttribute(e, t));
    return this;
  }
  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t++)
      this.expandByPoint(e[t]);
    return this;
  }
  setFromCenterAndSize(e, t) {
    const n = Ot.copy(t).multiplyScalar(0.5);
    return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
  }
  setFromObject(e, t = !1) {
    return this.makeEmpty(), this.expandByObject(e, t);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
  }
  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }
  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }
  expandByObject(e, t = !1) {
    e.updateWorldMatrix(!1, !1);
    const n = e.geometry;
    if (n !== void 0) {
      const r = n.getAttribute("position");
      if (t === !0 && r !== void 0 && e.isInstancedMesh !== !0)
        for (let a = 0, o = r.count; a < o; a++)
          e.isMesh === !0 ? e.getVertexPosition(a, Ot) : Ot.fromBufferAttribute(r, a), Ot.applyMatrix4(e.matrixWorld), this.expandByPoint(Ot);
      else
        e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), ds.copy(e.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), ds.copy(n.boundingBox)), ds.applyMatrix4(e.matrixWorld), this.union(ds);
    }
    const i = e.children;
    for (let r = 0, a = i.length; r < a; r++)
      this.expandByObject(i[r], t);
    return this;
  }
  containsPoint(e) {
    return !(e.x < this.min.x || e.x > this.max.x || e.y < this.min.y || e.y > this.max.y || e.z < this.min.z || e.z > this.max.z);
  }
  containsBox(e) {
    return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
  }
  getParameter(e, t) {
    return t.set(
      (e.x - this.min.x) / (this.max.x - this.min.x),
      (e.y - this.min.y) / (this.max.y - this.min.y),
      (e.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  intersectsBox(e) {
    return !(e.max.x < this.min.x || e.min.x > this.max.x || e.max.y < this.min.y || e.min.y > this.max.y || e.max.z < this.min.z || e.min.z > this.max.z);
  }
  intersectsSphere(e) {
    return this.clampPoint(e.center, Ot), Ot.distanceToSquared(e.center) <= e.radius * e.radius;
  }
  intersectsPlane(e) {
    let t, n;
    return e.normal.x > 0 ? (t = e.normal.x * this.min.x, n = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, n = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, n += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, n += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, n += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, n += e.normal.z * this.min.z), t <= -e.constant && n >= -e.constant;
  }
  intersectsTriangle(e) {
    if (this.isEmpty())
      return !1;
    this.getCenter(zi), fs.subVectors(this.max, zi), ei.subVectors(e.a, zi), ti.subVectors(e.b, zi), ni.subVectors(e.c, zi), gn.subVectors(ti, ei), _n.subVectors(ni, ti), On.subVectors(ei, ni);
    let t = [
      0,
      -gn.z,
      gn.y,
      0,
      -_n.z,
      _n.y,
      0,
      -On.z,
      On.y,
      gn.z,
      0,
      -gn.x,
      _n.z,
      0,
      -_n.x,
      On.z,
      0,
      -On.x,
      -gn.y,
      gn.x,
      0,
      -_n.y,
      _n.x,
      0,
      -On.y,
      On.x,
      0
    ];
    return !_r(t, ei, ti, ni, fs) || (t = [1, 0, 0, 0, 1, 0, 0, 0, 1], !_r(t, ei, ti, ni, fs)) ? !1 : (ps.crossVectors(gn, _n), t = [ps.x, ps.y, ps.z], _r(t, ei, ti, ni, fs));
  }
  clampPoint(e, t) {
    return t.copy(e).clamp(this.min, this.max);
  }
  distanceToPoint(e) {
    return this.clampPoint(e, Ot).distanceTo(e);
  }
  getBoundingSphere(e) {
    return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(Ot).length() * 0.5), e;
  }
  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  applyMatrix4(e) {
    return this.isEmpty() ? this : (en[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), en[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), en[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), en[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), en[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), en[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), en[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), en[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(en), this);
  }
  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
}
const en = [
  /* @__PURE__ */ new C(),
  /* @__PURE__ */ new C(),
  /* @__PURE__ */ new C(),
  /* @__PURE__ */ new C(),
  /* @__PURE__ */ new C(),
  /* @__PURE__ */ new C(),
  /* @__PURE__ */ new C(),
  /* @__PURE__ */ new C()
], Ot = /* @__PURE__ */ new C(), ds = /* @__PURE__ */ new dn(), ei = /* @__PURE__ */ new C(), ti = /* @__PURE__ */ new C(), ni = /* @__PURE__ */ new C(), gn = /* @__PURE__ */ new C(), _n = /* @__PURE__ */ new C(), On = /* @__PURE__ */ new C(), zi = /* @__PURE__ */ new C(), fs = /* @__PURE__ */ new C(), ps = /* @__PURE__ */ new C(), Fn = /* @__PURE__ */ new C();
function _r(s, e, t, n, i) {
  for (let r = 0, a = s.length - 3; r <= a; r += 3) {
    Fn.fromArray(s, r);
    const o = i.x * Math.abs(Fn.x) + i.y * Math.abs(Fn.y) + i.z * Math.abs(Fn.z), c = e.dot(Fn), l = t.dot(Fn), h = n.dot(Fn);
    if (Math.max(-Math.max(c, l, h), Math.min(c, l, h)) > o)
      return !1;
  }
  return !0;
}
const Jh = /* @__PURE__ */ new dn(), Hi = /* @__PURE__ */ new C(), xr = /* @__PURE__ */ new C();
class Kt {
  constructor(e = new C(), t = -1) {
    this.isSphere = !0, this.center = e, this.radius = t;
  }
  set(e, t) {
    return this.center.copy(e), this.radius = t, this;
  }
  setFromPoints(e, t) {
    const n = this.center;
    t !== void 0 ? n.copy(t) : Jh.setFromPoints(e).getCenter(n);
    let i = 0;
    for (let r = 0, a = e.length; r < a; r++)
      i = Math.max(i, n.distanceToSquared(e[r]));
    return this.radius = Math.sqrt(i), this;
  }
  copy(e) {
    return this.center.copy(e.center), this.radius = e.radius, this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  containsPoint(e) {
    return e.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(e) {
    return e.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(e) {
    const t = this.radius + e.radius;
    return e.center.distanceToSquared(this.center) <= t * t;
  }
  intersectsBox(e) {
    return e.intersectsSphere(this);
  }
  intersectsPlane(e) {
    return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(e, t) {
    const n = this.center.distanceToSquared(e);
    return t.copy(e), n > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
  }
  getBoundingBox(e) {
    return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
  }
  applyMatrix4(e) {
    return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
  }
  translate(e) {
    return this.center.add(e), this;
  }
  expandByPoint(e) {
    if (this.isEmpty())
      return this.center.copy(e), this.radius = 0, this;
    Hi.subVectors(e, this.center);
    const t = Hi.lengthSq();
    if (t > this.radius * this.radius) {
      const n = Math.sqrt(t), i = (n - this.radius) * 0.5;
      this.center.addScaledVector(Hi, i / n), this.radius += i;
    }
    return this;
  }
  union(e) {
    return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (xr.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(Hi.copy(e.center).add(xr)), this.expandByPoint(Hi.copy(e.center).sub(xr))), this);
  }
  equals(e) {
    return e.center.equals(this.center) && e.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const tn = /* @__PURE__ */ new C(), vr = /* @__PURE__ */ new C(), ms = /* @__PURE__ */ new C(), xn = /* @__PURE__ */ new C(), Mr = /* @__PURE__ */ new C(), gs = /* @__PURE__ */ new C(), Sr = /* @__PURE__ */ new C();
class os {
  constructor(e = new C(), t = new C(0, 0, -1)) {
    this.origin = e, this.direction = t;
  }
  set(e, t) {
    return this.origin.copy(e), this.direction.copy(t), this;
  }
  copy(e) {
    return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
  }
  at(e, t) {
    return t.copy(this.origin).addScaledVector(this.direction, e);
  }
  lookAt(e) {
    return this.direction.copy(e).sub(this.origin).normalize(), this;
  }
  recast(e) {
    return this.origin.copy(this.at(e, tn)), this;
  }
  closestPointToPoint(e, t) {
    t.subVectors(e, this.origin);
    const n = t.dot(this.direction);
    return n < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, n);
  }
  distanceToPoint(e) {
    return Math.sqrt(this.distanceSqToPoint(e));
  }
  distanceSqToPoint(e) {
    const t = tn.subVectors(e, this.origin).dot(this.direction);
    return t < 0 ? this.origin.distanceToSquared(e) : (tn.copy(this.origin).addScaledVector(this.direction, t), tn.distanceToSquared(e));
  }
  distanceSqToSegment(e, t, n, i) {
    vr.copy(e).add(t).multiplyScalar(0.5), ms.copy(t).sub(e).normalize(), xn.copy(this.origin).sub(vr);
    const r = e.distanceTo(t) * 0.5, a = -this.direction.dot(ms), o = xn.dot(this.direction), c = -xn.dot(ms), l = xn.lengthSq(), h = Math.abs(1 - a * a);
    let u, d, p, g;
    if (h > 0)
      if (u = a * c - o, d = a * o - c, g = r * h, u >= 0)
        if (d >= -g)
          if (d <= g) {
            const _ = 1 / h;
            u *= _, d *= _, p = u * (u + a * d + 2 * o) + d * (a * u + d + 2 * c) + l;
          } else
            d = r, u = Math.max(0, -(a * d + o)), p = -u * u + d * (d + 2 * c) + l;
        else
          d = -r, u = Math.max(0, -(a * d + o)), p = -u * u + d * (d + 2 * c) + l;
      else
        d <= -g ? (u = Math.max(0, -(-a * r + o)), d = u > 0 ? -r : Math.min(Math.max(-r, -c), r), p = -u * u + d * (d + 2 * c) + l) : d <= g ? (u = 0, d = Math.min(Math.max(-r, -c), r), p = d * (d + 2 * c) + l) : (u = Math.max(0, -(a * r + o)), d = u > 0 ? r : Math.min(Math.max(-r, -c), r), p = -u * u + d * (d + 2 * c) + l);
    else
      d = a > 0 ? -r : r, u = Math.max(0, -(a * d + o)), p = -u * u + d * (d + 2 * c) + l;
    return n && n.copy(this.origin).addScaledVector(this.direction, u), i && i.copy(vr).addScaledVector(ms, d), p;
  }
  intersectSphere(e, t) {
    tn.subVectors(e.center, this.origin);
    const n = tn.dot(this.direction), i = tn.dot(tn) - n * n, r = e.radius * e.radius;
    if (i > r)
      return null;
    const a = Math.sqrt(r - i), o = n - a, c = n + a;
    return c < 0 ? null : o < 0 ? this.at(c, t) : this.at(o, t);
  }
  intersectsSphere(e) {
    return this.distanceSqToPoint(e.center) <= e.radius * e.radius;
  }
  distanceToPlane(e) {
    const t = e.normal.dot(this.direction);
    if (t === 0)
      return e.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(e.normal) + e.constant) / t;
    return n >= 0 ? n : null;
  }
  intersectPlane(e, t) {
    const n = this.distanceToPlane(e);
    return n === null ? null : this.at(n, t);
  }
  intersectsPlane(e) {
    const t = e.distanceToPoint(this.origin);
    return t === 0 || e.normal.dot(this.direction) * t < 0;
  }
  intersectBox(e, t) {
    let n, i, r, a, o, c;
    const l = 1 / this.direction.x, h = 1 / this.direction.y, u = 1 / this.direction.z, d = this.origin;
    return l >= 0 ? (n = (e.min.x - d.x) * l, i = (e.max.x - d.x) * l) : (n = (e.max.x - d.x) * l, i = (e.min.x - d.x) * l), h >= 0 ? (r = (e.min.y - d.y) * h, a = (e.max.y - d.y) * h) : (r = (e.max.y - d.y) * h, a = (e.min.y - d.y) * h), n > a || r > i || ((r > n || isNaN(n)) && (n = r), (a < i || isNaN(i)) && (i = a), u >= 0 ? (o = (e.min.z - d.z) * u, c = (e.max.z - d.z) * u) : (o = (e.max.z - d.z) * u, c = (e.min.z - d.z) * u), n > c || o > i) || ((o > n || n !== n) && (n = o), (c < i || i !== i) && (i = c), i < 0) ? null : this.at(n >= 0 ? n : i, t);
  }
  intersectsBox(e) {
    return this.intersectBox(e, tn) !== null;
  }
  intersectTriangle(e, t, n, i, r) {
    Mr.subVectors(t, e), gs.subVectors(n, e), Sr.crossVectors(Mr, gs);
    let a = this.direction.dot(Sr), o;
    if (a > 0) {
      if (i)
        return null;
      o = 1;
    } else if (a < 0)
      o = -1, a = -a;
    else
      return null;
    xn.subVectors(this.origin, e);
    const c = o * this.direction.dot(gs.crossVectors(xn, gs));
    if (c < 0)
      return null;
    const l = o * this.direction.dot(Mr.cross(xn));
    if (l < 0 || c + l > a)
      return null;
    const h = -o * xn.dot(Sr);
    return h < 0 ? null : this.at(h / a, r);
  }
  applyMatrix4(e) {
    return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
  }
  equals(e) {
    return e.origin.equals(this.origin) && e.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Ie {
  constructor(e, t, n, i, r, a, o, c, l, h, u, d, p, g, _, f) {
    Ie.prototype.isMatrix4 = !0, this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, n, i, r, a, o, c, l, h, u, d, p, g, _, f);
  }
  set(e, t, n, i, r, a, o, c, l, h, u, d, p, g, _, f) {
    const m = this.elements;
    return m[0] = e, m[4] = t, m[8] = n, m[12] = i, m[1] = r, m[5] = a, m[9] = o, m[13] = c, m[2] = l, m[6] = h, m[10] = u, m[14] = d, m[3] = p, m[7] = g, m[11] = _, m[15] = f, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  clone() {
    return new Ie().fromArray(this.elements);
  }
  copy(e) {
    const t = this.elements, n = e.elements;
    return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], this;
  }
  copyPosition(e) {
    const t = this.elements, n = e.elements;
    return t[12] = n[12], t[13] = n[13], t[14] = n[14], this;
  }
  setFromMatrix3(e) {
    const t = e.elements;
    return this.set(
      t[0],
      t[3],
      t[6],
      0,
      t[1],
      t[4],
      t[7],
      0,
      t[2],
      t[5],
      t[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractBasis(e, t, n) {
    return e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this;
  }
  makeBasis(e, t, n) {
    return this.set(
      e.x,
      t.x,
      n.x,
      0,
      e.y,
      t.y,
      n.y,
      0,
      e.z,
      t.z,
      n.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractRotation(e) {
    const t = this.elements, n = e.elements, i = 1 / ii.setFromMatrixColumn(e, 0).length(), r = 1 / ii.setFromMatrixColumn(e, 1).length(), a = 1 / ii.setFromMatrixColumn(e, 2).length();
    return t[0] = n[0] * i, t[1] = n[1] * i, t[2] = n[2] * i, t[3] = 0, t[4] = n[4] * r, t[5] = n[5] * r, t[6] = n[6] * r, t[7] = 0, t[8] = n[8] * a, t[9] = n[9] * a, t[10] = n[10] * a, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }
  makeRotationFromEuler(e) {
    const t = this.elements, n = e.x, i = e.y, r = e.z, a = Math.cos(n), o = Math.sin(n), c = Math.cos(i), l = Math.sin(i), h = Math.cos(r), u = Math.sin(r);
    if (e.order === "XYZ") {
      const d = a * h, p = a * u, g = o * h, _ = o * u;
      t[0] = c * h, t[4] = -c * u, t[8] = l, t[1] = p + g * l, t[5] = d - _ * l, t[9] = -o * c, t[2] = _ - d * l, t[6] = g + p * l, t[10] = a * c;
    } else if (e.order === "YXZ") {
      const d = c * h, p = c * u, g = l * h, _ = l * u;
      t[0] = d + _ * o, t[4] = g * o - p, t[8] = a * l, t[1] = a * u, t[5] = a * h, t[9] = -o, t[2] = p * o - g, t[6] = _ + d * o, t[10] = a * c;
    } else if (e.order === "ZXY") {
      const d = c * h, p = c * u, g = l * h, _ = l * u;
      t[0] = d - _ * o, t[4] = -a * u, t[8] = g + p * o, t[1] = p + g * o, t[5] = a * h, t[9] = _ - d * o, t[2] = -a * l, t[6] = o, t[10] = a * c;
    } else if (e.order === "ZYX") {
      const d = a * h, p = a * u, g = o * h, _ = o * u;
      t[0] = c * h, t[4] = g * l - p, t[8] = d * l + _, t[1] = c * u, t[5] = _ * l + d, t[9] = p * l - g, t[2] = -l, t[6] = o * c, t[10] = a * c;
    } else if (e.order === "YZX") {
      const d = a * c, p = a * l, g = o * c, _ = o * l;
      t[0] = c * h, t[4] = _ - d * u, t[8] = g * u + p, t[1] = u, t[5] = a * h, t[9] = -o * h, t[2] = -l * h, t[6] = p * u + g, t[10] = d - _ * u;
    } else if (e.order === "XZY") {
      const d = a * c, p = a * l, g = o * c, _ = o * l;
      t[0] = c * h, t[4] = -u, t[8] = l * h, t[1] = d * u + _, t[5] = a * h, t[9] = p * u - g, t[2] = g * u - p, t[6] = o * h, t[10] = _ * u + d;
    }
    return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }
  makeRotationFromQuaternion(e) {
    return this.compose(Qh, e, eu);
  }
  lookAt(e, t, n) {
    const i = this.elements;
    return Rt.subVectors(e, t), Rt.lengthSq() === 0 && (Rt.z = 1), Rt.normalize(), vn.crossVectors(n, Rt), vn.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Rt.x += 1e-4 : Rt.z += 1e-4, Rt.normalize(), vn.crossVectors(n, Rt)), vn.normalize(), _s.crossVectors(Rt, vn), i[0] = vn.x, i[4] = _s.x, i[8] = Rt.x, i[1] = vn.y, i[5] = _s.y, i[9] = Rt.y, i[2] = vn.z, i[6] = _s.z, i[10] = Rt.z, this;
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, t) {
    const n = e.elements, i = t.elements, r = this.elements, a = n[0], o = n[4], c = n[8], l = n[12], h = n[1], u = n[5], d = n[9], p = n[13], g = n[2], _ = n[6], f = n[10], m = n[14], T = n[3], S = n[7], A = n[11], D = n[15], R = i[0], w = i[4], k = i[8], E = i[12], M = i[1], O = i[5], W = i[9], P = i[13], q = i[2], X = i[6], $ = i[10], J = i[14], V = i[3], ee = i[7], Q = i[11], de = i[15];
    return r[0] = a * R + o * M + c * q + l * V, r[4] = a * w + o * O + c * X + l * ee, r[8] = a * k + o * W + c * $ + l * Q, r[12] = a * E + o * P + c * J + l * de, r[1] = h * R + u * M + d * q + p * V, r[5] = h * w + u * O + d * X + p * ee, r[9] = h * k + u * W + d * $ + p * Q, r[13] = h * E + u * P + d * J + p * de, r[2] = g * R + _ * M + f * q + m * V, r[6] = g * w + _ * O + f * X + m * ee, r[10] = g * k + _ * W + f * $ + m * Q, r[14] = g * E + _ * P + f * J + m * de, r[3] = T * R + S * M + A * q + D * V, r[7] = T * w + S * O + A * X + D * ee, r[11] = T * k + S * W + A * $ + D * Q, r[15] = T * E + S * P + A * J + D * de, this;
  }
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
  }
  determinant() {
    const e = this.elements, t = e[0], n = e[4], i = e[8], r = e[12], a = e[1], o = e[5], c = e[9], l = e[13], h = e[2], u = e[6], d = e[10], p = e[14], g = e[3], _ = e[7], f = e[11], m = e[15];
    return g * (+r * c * u - i * l * u - r * o * d + n * l * d + i * o * p - n * c * p) + _ * (+t * c * p - t * l * d + r * a * d - i * a * p + i * l * h - r * c * h) + f * (+t * l * u - t * o * p - r * a * u + n * a * p + r * o * h - n * l * h) + m * (-i * o * h - t * c * u + t * o * d + i * a * u - n * a * d + n * c * h);
  }
  transpose() {
    const e = this.elements;
    let t;
    return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
  }
  setPosition(e, t, n) {
    const i = this.elements;
    return e.isVector3 ? (i[12] = e.x, i[13] = e.y, i[14] = e.z) : (i[12] = e, i[13] = t, i[14] = n), this;
  }
  invert() {
    const e = this.elements, t = e[0], n = e[1], i = e[2], r = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8], u = e[9], d = e[10], p = e[11], g = e[12], _ = e[13], f = e[14], m = e[15], T = u * f * l - _ * d * l + _ * c * p - o * f * p - u * c * m + o * d * m, S = g * d * l - h * f * l - g * c * p + a * f * p + h * c * m - a * d * m, A = h * _ * l - g * u * l + g * o * p - a * _ * p - h * o * m + a * u * m, D = g * u * c - h * _ * c - g * o * d + a * _ * d + h * o * f - a * u * f, R = t * T + n * S + i * A + r * D;
    if (R === 0)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const w = 1 / R;
    return e[0] = T * w, e[1] = (_ * d * r - u * f * r - _ * i * p + n * f * p + u * i * m - n * d * m) * w, e[2] = (o * f * r - _ * c * r + _ * i * l - n * f * l - o * i * m + n * c * m) * w, e[3] = (u * c * r - o * d * r - u * i * l + n * d * l + o * i * p - n * c * p) * w, e[4] = S * w, e[5] = (h * f * r - g * d * r + g * i * p - t * f * p - h * i * m + t * d * m) * w, e[6] = (g * c * r - a * f * r - g * i * l + t * f * l + a * i * m - t * c * m) * w, e[7] = (a * d * r - h * c * r + h * i * l - t * d * l - a * i * p + t * c * p) * w, e[8] = A * w, e[9] = (g * u * r - h * _ * r - g * n * p + t * _ * p + h * n * m - t * u * m) * w, e[10] = (a * _ * r - g * o * r + g * n * l - t * _ * l - a * n * m + t * o * m) * w, e[11] = (h * o * r - a * u * r - h * n * l + t * u * l + a * n * p - t * o * p) * w, e[12] = D * w, e[13] = (h * _ * i - g * u * i + g * n * d - t * _ * d - h * n * f + t * u * f) * w, e[14] = (g * o * i - a * _ * i - g * n * c + t * _ * c + a * n * f - t * o * f) * w, e[15] = (a * u * i - h * o * i + h * n * c - t * u * c - a * n * d + t * o * d) * w, this;
  }
  scale(e) {
    const t = this.elements, n = e.x, i = e.y, r = e.z;
    return t[0] *= n, t[4] *= i, t[8] *= r, t[1] *= n, t[5] *= i, t[9] *= r, t[2] *= n, t[6] *= i, t[10] *= r, t[3] *= n, t[7] *= i, t[11] *= r, this;
  }
  getMaxScaleOnAxis() {
    const e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], i = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
    return Math.sqrt(Math.max(t, n, i));
  }
  makeTranslation(e, t, n) {
    return e.isVector3 ? this.set(
      1,
      0,
      0,
      e.x,
      0,
      1,
      0,
      e.y,
      0,
      0,
      1,
      e.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      e,
      0,
      1,
      0,
      t,
      0,
      0,
      1,
      n,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationX(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      t,
      -n,
      0,
      0,
      n,
      t,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationY(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      t,
      0,
      n,
      0,
      0,
      1,
      0,
      0,
      -n,
      0,
      t,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationZ(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      t,
      -n,
      0,
      0,
      n,
      t,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationAxis(e, t) {
    const n = Math.cos(t), i = Math.sin(t), r = 1 - n, a = e.x, o = e.y, c = e.z, l = r * a, h = r * o;
    return this.set(
      l * a + n,
      l * o - i * c,
      l * c + i * o,
      0,
      l * o + i * c,
      h * o + n,
      h * c - i * a,
      0,
      l * c - i * o,
      h * c + i * a,
      r * c * c + n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(e, t, n) {
    return this.set(
      e,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeShear(e, t, n, i, r, a) {
    return this.set(
      1,
      n,
      r,
      0,
      e,
      1,
      a,
      0,
      t,
      i,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  compose(e, t, n) {
    const i = this.elements, r = t._x, a = t._y, o = t._z, c = t._w, l = r + r, h = a + a, u = o + o, d = r * l, p = r * h, g = r * u, _ = a * h, f = a * u, m = o * u, T = c * l, S = c * h, A = c * u, D = n.x, R = n.y, w = n.z;
    return i[0] = (1 - (_ + m)) * D, i[1] = (p + A) * D, i[2] = (g - S) * D, i[3] = 0, i[4] = (p - A) * R, i[5] = (1 - (d + m)) * R, i[6] = (f + T) * R, i[7] = 0, i[8] = (g + S) * w, i[9] = (f - T) * w, i[10] = (1 - (d + _)) * w, i[11] = 0, i[12] = e.x, i[13] = e.y, i[14] = e.z, i[15] = 1, this;
  }
  decompose(e, t, n) {
    const i = this.elements;
    let r = ii.set(i[0], i[1], i[2]).length();
    const a = ii.set(i[4], i[5], i[6]).length(), o = ii.set(i[8], i[9], i[10]).length();
    this.determinant() < 0 && (r = -r), e.x = i[12], e.y = i[13], e.z = i[14], Ft.copy(this);
    const l = 1 / r, h = 1 / a, u = 1 / o;
    return Ft.elements[0] *= l, Ft.elements[1] *= l, Ft.elements[2] *= l, Ft.elements[4] *= h, Ft.elements[5] *= h, Ft.elements[6] *= h, Ft.elements[8] *= u, Ft.elements[9] *= u, Ft.elements[10] *= u, t.setFromRotationMatrix(Ft), n.x = r, n.y = a, n.z = o, this;
  }
  makePerspective(e, t, n, i, r, a, o = ln) {
    const c = this.elements, l = 2 * r / (t - e), h = 2 * r / (n - i), u = (t + e) / (t - e), d = (n + i) / (n - i);
    let p, g;
    if (o === ln)
      p = -(a + r) / (a - r), g = -2 * a * r / (a - r);
    else if (o === js)
      p = -a / (a - r), g = -a * r / (a - r);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return c[0] = l, c[4] = 0, c[8] = u, c[12] = 0, c[1] = 0, c[5] = h, c[9] = d, c[13] = 0, c[2] = 0, c[6] = 0, c[10] = p, c[14] = g, c[3] = 0, c[7] = 0, c[11] = -1, c[15] = 0, this;
  }
  makeOrthographic(e, t, n, i, r, a, o = ln) {
    const c = this.elements, l = 1 / (t - e), h = 1 / (n - i), u = 1 / (a - r), d = (t + e) * l, p = (n + i) * h;
    let g, _;
    if (o === ln)
      g = (a + r) * u, _ = -2 * u;
    else if (o === js)
      g = r * u, _ = -1 * u;
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return c[0] = 2 * l, c[4] = 0, c[8] = 0, c[12] = -d, c[1] = 0, c[5] = 2 * h, c[9] = 0, c[13] = -p, c[2] = 0, c[6] = 0, c[10] = _, c[14] = -g, c[3] = 0, c[7] = 0, c[11] = 0, c[15] = 1, this;
  }
  equals(e) {
    const t = this.elements, n = e.elements;
    for (let i = 0; i < 16; i++)
      if (t[i] !== n[i])
        return !1;
    return !0;
  }
  fromArray(e, t = 0) {
    for (let n = 0; n < 16; n++)
      this.elements[n] = e[n + t];
    return this;
  }
  toArray(e = [], t = 0) {
    const n = this.elements;
    return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e[t + 9] = n[9], e[t + 10] = n[10], e[t + 11] = n[11], e[t + 12] = n[12], e[t + 13] = n[13], e[t + 14] = n[14], e[t + 15] = n[15], e;
  }
}
const ii = /* @__PURE__ */ new C(), Ft = /* @__PURE__ */ new Ie(), Qh = /* @__PURE__ */ new C(0, 0, 0), eu = /* @__PURE__ */ new C(1, 1, 1), vn = /* @__PURE__ */ new C(), _s = /* @__PURE__ */ new C(), Rt = /* @__PURE__ */ new C(), ho = /* @__PURE__ */ new Ie(), uo = /* @__PURE__ */ new Lt();
class jt {
  constructor(e = 0, t = 0, n = 0, i = jt.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = e, this._y = t, this._z = n, this._order = i;
  }
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(e) {
    this._order = e, this._onChangeCallback();
  }
  set(e, t, n, i = this._order) {
    return this._x = e, this._y = t, this._z = n, this._order = i, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(e) {
    return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
  }
  setFromRotationMatrix(e, t = this._order, n = !0) {
    const i = e.elements, r = i[0], a = i[4], o = i[8], c = i[1], l = i[5], h = i[9], u = i[2], d = i[6], p = i[10];
    switch (t) {
      case "XYZ":
        this._y = Math.asin(gt(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-h, p), this._z = Math.atan2(-a, r)) : (this._x = Math.atan2(d, l), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-gt(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(o, p), this._z = Math.atan2(c, l)) : (this._y = Math.atan2(-u, r), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(gt(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._y = Math.atan2(-u, p), this._z = Math.atan2(-a, l)) : (this._y = 0, this._z = Math.atan2(c, r));
        break;
      case "ZYX":
        this._y = Math.asin(-gt(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._x = Math.atan2(d, p), this._z = Math.atan2(c, r)) : (this._x = 0, this._z = Math.atan2(-a, l));
        break;
      case "YZX":
        this._z = Math.asin(gt(c, -1, 1)), Math.abs(c) < 0.9999999 ? (this._x = Math.atan2(-h, l), this._y = Math.atan2(-u, r)) : (this._x = 0, this._y = Math.atan2(o, p));
        break;
      case "XZY":
        this._z = Math.asin(-gt(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(d, l), this._y = Math.atan2(o, r)) : (this._x = Math.atan2(-h, p), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
    }
    return this._order = t, n === !0 && this._onChangeCallback(), this;
  }
  setFromQuaternion(e, t, n) {
    return ho.makeRotationFromQuaternion(e), this.setFromRotationMatrix(ho, t, n);
  }
  setFromVector3(e, t = this._order) {
    return this.set(e.x, e.y, e.z, t);
  }
  reorder(e) {
    return uo.setFromEuler(this), this.setFromQuaternion(uo, e);
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
  }
  fromArray(e) {
    return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
jt.DEFAULT_ORDER = "XYZ";
class Hc {
  constructor() {
    this.mask = 1;
  }
  set(e) {
    this.mask = (1 << e | 0) >>> 0;
  }
  enable(e) {
    this.mask |= 1 << e | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(e) {
    this.mask ^= 1 << e | 0;
  }
  disable(e) {
    this.mask &= ~(1 << e | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(e) {
    return (this.mask & e.mask) !== 0;
  }
  isEnabled(e) {
    return (this.mask & (1 << e | 0)) !== 0;
  }
}
let tu = 0;
const fo = /* @__PURE__ */ new C(), si = /* @__PURE__ */ new Lt(), nn = /* @__PURE__ */ new Ie(), xs = /* @__PURE__ */ new C(), Vi = /* @__PURE__ */ new C(), nu = /* @__PURE__ */ new C(), iu = /* @__PURE__ */ new Lt(), po = /* @__PURE__ */ new C(1, 0, 0), mo = /* @__PURE__ */ new C(0, 1, 0), go = /* @__PURE__ */ new C(0, 0, 1), _o = { type: "added" }, su = { type: "removed" }, ri = { type: "childadded", child: null }, yr = { type: "childremoved", child: null };
class rt extends Dn {
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: tu++ }), this.uuid = Ht(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = rt.DEFAULT_UP.clone();
    const e = new C(), t = new jt(), n = new Lt(), i = new C(1, 1, 1);
    function r() {
      n.setFromEuler(t, !1);
    }
    function a() {
      t.setFromQuaternion(n, void 0, !1);
    }
    t._onChange(r), n._onChange(a), Object.defineProperties(this, {
      position: {
        configurable: !0,
        enumerable: !0,
        value: e
      },
      rotation: {
        configurable: !0,
        enumerable: !0,
        value: t
      },
      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: n
      },
      scale: {
        configurable: !0,
        enumerable: !0,
        value: i
      },
      modelViewMatrix: {
        value: new Ie()
      },
      normalMatrix: {
        value: new Le()
      }
    }), this.matrix = new Ie(), this.matrixWorld = new Ie(), this.matrixAutoUpdate = rt.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new Hc(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.userData = {};
  }
  onBeforeShadow() {
  }
  onAfterShadow() {
  }
  onBeforeRender() {
  }
  onAfterRender() {
  }
  applyMatrix4(e) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(e) {
    return this.quaternion.premultiply(e), this;
  }
  setRotationFromAxisAngle(e, t) {
    this.quaternion.setFromAxisAngle(e, t);
  }
  setRotationFromEuler(e) {
    this.quaternion.setFromEuler(e, !0);
  }
  setRotationFromMatrix(e) {
    this.quaternion.setFromRotationMatrix(e);
  }
  setRotationFromQuaternion(e) {
    this.quaternion.copy(e);
  }
  rotateOnAxis(e, t) {
    return si.setFromAxisAngle(e, t), this.quaternion.multiply(si), this;
  }
  rotateOnWorldAxis(e, t) {
    return si.setFromAxisAngle(e, t), this.quaternion.premultiply(si), this;
  }
  rotateX(e) {
    return this.rotateOnAxis(po, e);
  }
  rotateY(e) {
    return this.rotateOnAxis(mo, e);
  }
  rotateZ(e) {
    return this.rotateOnAxis(go, e);
  }
  translateOnAxis(e, t) {
    return fo.copy(e).applyQuaternion(this.quaternion), this.position.add(fo.multiplyScalar(t)), this;
  }
  translateX(e) {
    return this.translateOnAxis(po, e);
  }
  translateY(e) {
    return this.translateOnAxis(mo, e);
  }
  translateZ(e) {
    return this.translateOnAxis(go, e);
  }
  localToWorld(e) {
    return this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(e) {
    return this.updateWorldMatrix(!0, !1), e.applyMatrix4(nn.copy(this.matrixWorld).invert());
  }
  lookAt(e, t, n) {
    e.isVector3 ? xs.copy(e) : xs.set(e, t, n);
    const i = this.parent;
    this.updateWorldMatrix(!0, !1), Vi.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? nn.lookAt(Vi, xs, this.up) : nn.lookAt(xs, Vi, this.up), this.quaternion.setFromRotationMatrix(nn), i && (nn.extractRotation(i.matrixWorld), si.setFromRotationMatrix(nn), this.quaternion.premultiply(si.invert()));
  }
  add(e) {
    if (arguments.length > 1) {
      for (let t = 0; t < arguments.length; t++)
        this.add(arguments[t]);
      return this;
    }
    return e === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(_o), ri.child = e, this.dispatchEvent(ri), ri.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this);
  }
  remove(e) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++)
        this.remove(arguments[n]);
      return this;
    }
    const t = this.children.indexOf(e);
    return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(su), yr.child = e, this.dispatchEvent(yr), yr.child = null), this;
  }
  removeFromParent() {
    const e = this.parent;
    return e !== null && e.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(e) {
    return this.updateWorldMatrix(!0, !1), nn.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), nn.multiply(e.parent.matrixWorld)), e.applyMatrix4(nn), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(!1, !0), e.dispatchEvent(_o), ri.child = e, this.dispatchEvent(ri), ri.child = null, this;
  }
  getObjectById(e) {
    return this.getObjectByProperty("id", e);
  }
  getObjectByName(e) {
    return this.getObjectByProperty("name", e);
  }
  getObjectByProperty(e, t) {
    if (this[e] === t)
      return this;
    for (let n = 0, i = this.children.length; n < i; n++) {
      const a = this.children[n].getObjectByProperty(e, t);
      if (a !== void 0)
        return a;
    }
  }
  getObjectsByProperty(e, t, n = []) {
    this[e] === t && n.push(this);
    const i = this.children;
    for (let r = 0, a = i.length; r < a; r++)
      i[r].getObjectsByProperty(e, t, n);
    return n;
  }
  getWorldPosition(e) {
    return this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld);
  }
  getWorldQuaternion(e) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Vi, e, nu), e;
  }
  getWorldScale(e) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Vi, iu, e), e;
  }
  getWorldDirection(e) {
    this.updateWorldMatrix(!0, !1);
    const t = this.matrixWorld.elements;
    return e.set(t[8], t[9], t[10]).normalize();
  }
  raycast() {
  }
  traverse(e) {
    e(this);
    const t = this.children;
    for (let n = 0, i = t.length; n < i; n++)
      t[n].traverse(e);
  }
  traverseVisible(e) {
    if (this.visible === !1)
      return;
    e(this);
    const t = this.children;
    for (let n = 0, i = t.length; n < i; n++)
      t[n].traverseVisible(e);
  }
  traverseAncestors(e) {
    const t = this.parent;
    t !== null && (e(t), t.traverseAncestors(e));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
  }
  updateMatrixWorld(e) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), this.matrixWorldNeedsUpdate = !1, e = !0);
    const t = this.children;
    for (let n = 0, i = t.length; n < i; n++) {
      const r = t[n];
      (r.matrixWorldAutoUpdate === !0 || e === !0) && r.updateMatrixWorld(e);
    }
  }
  updateWorldMatrix(e, t) {
    const n = this.parent;
    if (e === !0 && n !== null && n.matrixWorldAutoUpdate === !0 && n.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), t === !0) {
      const i = this.children;
      for (let r = 0, a = i.length; r < a; r++) {
        const o = i[r];
        o.matrixWorldAutoUpdate === !0 && o.updateWorldMatrix(!1, !0);
      }
    }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string", n = {};
    t && (e = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, n.metadata = {
      version: 4.6,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const i = {};
    i.uuid = this.uuid, i.type = this.type, this.name !== "" && (i.name = this.name), this.castShadow === !0 && (i.castShadow = !0), this.receiveShadow === !0 && (i.receiveShadow = !0), this.visible === !1 && (i.visible = !1), this.frustumCulled === !1 && (i.frustumCulled = !1), this.renderOrder !== 0 && (i.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (i.userData = this.userData), i.layers = this.layers.mask, i.matrix = this.matrix.toArray(), i.up = this.up.toArray(), this.matrixAutoUpdate === !1 && (i.matrixAutoUpdate = !1), this.isInstancedMesh && (i.type = "InstancedMesh", i.count = this.count, i.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (i.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (i.type = "BatchedMesh", i.perObjectFrustumCulled = this.perObjectFrustumCulled, i.sortObjects = this.sortObjects, i.drawRanges = this._drawRanges, i.reservedRanges = this._reservedRanges, i.visibility = this._visibility, i.active = this._active, i.bounds = this._bounds.map((o) => ({
      boxInitialized: o.boxInitialized,
      boxMin: o.box.min.toArray(),
      boxMax: o.box.max.toArray(),
      sphereInitialized: o.sphereInitialized,
      sphereRadius: o.sphere.radius,
      sphereCenter: o.sphere.center.toArray()
    })), i.maxGeometryCount = this._maxGeometryCount, i.maxVertexCount = this._maxVertexCount, i.maxIndexCount = this._maxIndexCount, i.geometryInitialized = this._geometryInitialized, i.geometryCount = this._geometryCount, i.matricesTexture = this._matricesTexture.toJSON(e), this.boundingSphere !== null && (i.boundingSphere = {
      center: i.boundingSphere.center.toArray(),
      radius: i.boundingSphere.radius
    }), this.boundingBox !== null && (i.boundingBox = {
      min: i.boundingBox.min.toArray(),
      max: i.boundingBox.max.toArray()
    }));
    function r(o, c) {
      return o[c.uuid] === void 0 && (o[c.uuid] = c.toJSON(e)), c.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? i.background = this.background.toJSON() : this.background.isTexture && (i.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (i.environment = this.environment.toJSON(e).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      i.geometry = r(e.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const c = o.shapes;
        if (Array.isArray(c))
          for (let l = 0, h = c.length; l < h; l++) {
            const u = c[l];
            r(e.shapes, u);
          }
        else
          r(e.shapes, c);
      }
    }
    if (this.isSkinnedMesh && (i.bindMode = this.bindMode, i.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (r(e.skeletons, this.skeleton), i.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const o = [];
        for (let c = 0, l = this.material.length; c < l; c++)
          o.push(r(e.materials, this.material[c]));
        i.material = o;
      } else
        i.material = r(e.materials, this.material);
    if (this.children.length > 0) {
      i.children = [];
      for (let o = 0; o < this.children.length; o++)
        i.children.push(this.children[o].toJSON(e).object);
    }
    if (this.animations.length > 0) {
      i.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const c = this.animations[o];
        i.animations.push(r(e.animations, c));
      }
    }
    if (t) {
      const o = a(e.geometries), c = a(e.materials), l = a(e.textures), h = a(e.images), u = a(e.shapes), d = a(e.skeletons), p = a(e.animations), g = a(e.nodes);
      o.length > 0 && (n.geometries = o), c.length > 0 && (n.materials = c), l.length > 0 && (n.textures = l), h.length > 0 && (n.images = h), u.length > 0 && (n.shapes = u), d.length > 0 && (n.skeletons = d), p.length > 0 && (n.animations = p), g.length > 0 && (n.nodes = g);
    }
    return n.object = i, n;
    function a(o) {
      const c = [];
      for (const l in o) {
        const h = o[l];
        delete h.metadata, c.push(h);
      }
      return c;
    }
  }
  clone(e) {
    return new this.constructor().copy(this, e);
  }
  copy(e, t = !0) {
    if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === !0)
      for (let n = 0; n < e.children.length; n++) {
        const i = e.children[n];
        this.add(i.clone());
      }
    return this;
  }
}
rt.DEFAULT_UP = /* @__PURE__ */ new C(0, 1, 0);
rt.DEFAULT_MATRIX_AUTO_UPDATE = !0;
rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const Bt = /* @__PURE__ */ new C(), sn = /* @__PURE__ */ new C(), Er = /* @__PURE__ */ new C(), rn = /* @__PURE__ */ new C(), ai = /* @__PURE__ */ new C(), oi = /* @__PURE__ */ new C(), xo = /* @__PURE__ */ new C(), Tr = /* @__PURE__ */ new C(), Ar = /* @__PURE__ */ new C(), br = /* @__PURE__ */ new C();
class Xt {
  constructor(e = new C(), t = new C(), n = new C()) {
    this.a = e, this.b = t, this.c = n;
  }
  static getNormal(e, t, n, i) {
    i.subVectors(n, t), Bt.subVectors(e, t), i.cross(Bt);
    const r = i.lengthSq();
    return r > 0 ? i.multiplyScalar(1 / Math.sqrt(r)) : i.set(0, 0, 0);
  }
  // static/instance method to calculate barycentric coordinates
  // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
  static getBarycoord(e, t, n, i, r) {
    Bt.subVectors(i, t), sn.subVectors(n, t), Er.subVectors(e, t);
    const a = Bt.dot(Bt), o = Bt.dot(sn), c = Bt.dot(Er), l = sn.dot(sn), h = sn.dot(Er), u = a * l - o * o;
    if (u === 0)
      return r.set(0, 0, 0), null;
    const d = 1 / u, p = (l * c - o * h) * d, g = (a * h - o * c) * d;
    return r.set(1 - p - g, g, p);
  }
  static containsPoint(e, t, n, i) {
    return this.getBarycoord(e, t, n, i, rn) === null ? !1 : rn.x >= 0 && rn.y >= 0 && rn.x + rn.y <= 1;
  }
  static getInterpolation(e, t, n, i, r, a, o, c) {
    return this.getBarycoord(e, t, n, i, rn) === null ? (c.x = 0, c.y = 0, "z" in c && (c.z = 0), "w" in c && (c.w = 0), null) : (c.setScalar(0), c.addScaledVector(r, rn.x), c.addScaledVector(a, rn.y), c.addScaledVector(o, rn.z), c);
  }
  static isFrontFacing(e, t, n, i) {
    return Bt.subVectors(n, t), sn.subVectors(e, t), Bt.cross(sn).dot(i) < 0;
  }
  set(e, t, n) {
    return this.a.copy(e), this.b.copy(t), this.c.copy(n), this;
  }
  setFromPointsAndIndices(e, t, n, i) {
    return this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[i]), this;
  }
  setFromAttributeAndIndices(e, t, n, i) {
    return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, n), this.c.fromBufferAttribute(e, i), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
  }
  getArea() {
    return Bt.subVectors(this.c, this.b), sn.subVectors(this.a, this.b), Bt.cross(sn).length() * 0.5;
  }
  getMidpoint(e) {
    return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(e) {
    return Xt.getNormal(this.a, this.b, this.c, e);
  }
  getPlane(e) {
    return e.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(e, t) {
    return Xt.getBarycoord(e, this.a, this.b, this.c, t);
  }
  getInterpolation(e, t, n, i, r) {
    return Xt.getInterpolation(e, this.a, this.b, this.c, t, n, i, r);
  }
  containsPoint(e) {
    return Xt.containsPoint(e, this.a, this.b, this.c);
  }
  isFrontFacing(e) {
    return Xt.isFrontFacing(this.a, this.b, this.c, e);
  }
  intersectsBox(e) {
    return e.intersectsTriangle(this);
  }
  closestPointToPoint(e, t) {
    const n = this.a, i = this.b, r = this.c;
    let a, o;
    ai.subVectors(i, n), oi.subVectors(r, n), Tr.subVectors(e, n);
    const c = ai.dot(Tr), l = oi.dot(Tr);
    if (c <= 0 && l <= 0)
      return t.copy(n);
    Ar.subVectors(e, i);
    const h = ai.dot(Ar), u = oi.dot(Ar);
    if (h >= 0 && u <= h)
      return t.copy(i);
    const d = c * u - h * l;
    if (d <= 0 && c >= 0 && h <= 0)
      return a = c / (c - h), t.copy(n).addScaledVector(ai, a);
    br.subVectors(e, r);
    const p = ai.dot(br), g = oi.dot(br);
    if (g >= 0 && p <= g)
      return t.copy(r);
    const _ = p * l - c * g;
    if (_ <= 0 && l >= 0 && g <= 0)
      return o = l / (l - g), t.copy(n).addScaledVector(oi, o);
    const f = h * g - p * u;
    if (f <= 0 && u - h >= 0 && p - g >= 0)
      return xo.subVectors(r, i), o = (u - h) / (u - h + (p - g)), t.copy(i).addScaledVector(xo, o);
    const m = 1 / (f + _ + d);
    return a = _ * m, o = d * m, t.copy(n).addScaledVector(ai, a).addScaledVector(oi, o);
  }
  equals(e) {
    return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
  }
}
const Vc = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, Mn = { h: 0, s: 0, l: 0 }, vs = { h: 0, s: 0, l: 0 };
function wr(s, e, t) {
  return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? s + (e - s) * 6 * t : t < 1 / 2 ? e : t < 2 / 3 ? s + (e - s) * 6 * (2 / 3 - t) : s;
}
class Se {
  constructor(e, t, n) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, n);
  }
  set(e, t, n) {
    if (t === void 0 && n === void 0) {
      const i = e;
      i && i.isColor ? this.copy(i) : typeof i == "number" ? this.setHex(i) : typeof i == "string" && this.setStyle(i);
    } else
      this.setRGB(e, t, n);
    return this;
  }
  setScalar(e) {
    return this.r = e, this.g = e, this.b = e, this;
  }
  setHex(e, t = mt) {
    return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, qe.toWorkingColorSpace(this, t), this;
  }
  setRGB(e, t, n, i = qe.workingColorSpace) {
    return this.r = e, this.g = t, this.b = n, qe.toWorkingColorSpace(this, i), this;
  }
  setHSL(e, t, n, i = qe.workingColorSpace) {
    if (e = ua(e, 1), t = gt(t, 0, 1), n = gt(n, 0, 1), t === 0)
      this.r = this.g = this.b = n;
    else {
      const r = n <= 0.5 ? n * (1 + t) : n + t - n * t, a = 2 * n - r;
      this.r = wr(a, r, e + 1 / 3), this.g = wr(a, r, e), this.b = wr(a, r, e - 1 / 3);
    }
    return qe.toWorkingColorSpace(this, i), this;
  }
  setStyle(e, t = mt) {
    function n(r) {
      r !== void 0 && parseFloat(r) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.");
    }
    let i;
    if (i = /^(\w+)\(([^\)]*)\)/.exec(e)) {
      let r;
      const a = i[1], o = i[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(r[4]), this.setRGB(
              Math.min(255, parseInt(r[1], 10)) / 255,
              Math.min(255, parseInt(r[2], 10)) / 255,
              Math.min(255, parseInt(r[3], 10)) / 255,
              t
            );
          if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(r[4]), this.setRGB(
              Math.min(100, parseInt(r[1], 10)) / 100,
              Math.min(100, parseInt(r[2], 10)) / 100,
              Math.min(100, parseInt(r[3], 10)) / 100,
              t
            );
          break;
        case "hsl":
        case "hsla":
          if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(r[4]), this.setHSL(
              parseFloat(r[1]) / 360,
              parseFloat(r[2]) / 100,
              parseFloat(r[3]) / 100,
              t
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + e);
      }
    } else if (i = /^\#([A-Fa-f\d]+)$/.exec(e)) {
      const r = i[1], a = r.length;
      if (a === 3)
        return this.setRGB(
          parseInt(r.charAt(0), 16) / 15,
          parseInt(r.charAt(1), 16) / 15,
          parseInt(r.charAt(2), 16) / 15,
          t
        );
      if (a === 6)
        return this.setHex(parseInt(r, 16), t);
      console.warn("THREE.Color: Invalid hex color " + e);
    } else if (e && e.length > 0)
      return this.setColorName(e, t);
    return this;
  }
  setColorName(e, t = mt) {
    const n = Vc[e.toLowerCase()];
    return n !== void 0 ? this.setHex(n, t) : console.warn("THREE.Color: Unknown color " + e), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }
  copySRGBToLinear(e) {
    return this.r = yi(e.r), this.g = yi(e.g), this.b = yi(e.b), this;
  }
  copyLinearToSRGB(e) {
    return this.r = pr(e.r), this.g = pr(e.g), this.b = pr(e.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(e = mt) {
    return qe.fromWorkingColorSpace(St.copy(this), e), Math.round(gt(St.r * 255, 0, 255)) * 65536 + Math.round(gt(St.g * 255, 0, 255)) * 256 + Math.round(gt(St.b * 255, 0, 255));
  }
  getHexString(e = mt) {
    return ("000000" + this.getHex(e).toString(16)).slice(-6);
  }
  getHSL(e, t = qe.workingColorSpace) {
    qe.fromWorkingColorSpace(St.copy(this), t);
    const n = St.r, i = St.g, r = St.b, a = Math.max(n, i, r), o = Math.min(n, i, r);
    let c, l;
    const h = (o + a) / 2;
    if (o === a)
      c = 0, l = 0;
    else {
      const u = a - o;
      switch (l = h <= 0.5 ? u / (a + o) : u / (2 - a - o), a) {
        case n:
          c = (i - r) / u + (i < r ? 6 : 0);
          break;
        case i:
          c = (r - n) / u + 2;
          break;
        case r:
          c = (n - i) / u + 4;
          break;
      }
      c /= 6;
    }
    return e.h = c, e.s = l, e.l = h, e;
  }
  getRGB(e, t = qe.workingColorSpace) {
    return qe.fromWorkingColorSpace(St.copy(this), t), e.r = St.r, e.g = St.g, e.b = St.b, e;
  }
  getStyle(e = mt) {
    qe.fromWorkingColorSpace(St.copy(this), e);
    const t = St.r, n = St.g, i = St.b;
    return e !== mt ? `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})` : `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(i * 255)})`;
  }
  offsetHSL(e, t, n) {
    return this.getHSL(Mn), this.setHSL(Mn.h + e, Mn.s + t, Mn.l + n);
  }
  add(e) {
    return this.r += e.r, this.g += e.g, this.b += e.b, this;
  }
  addColors(e, t) {
    return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
  }
  addScalar(e) {
    return this.r += e, this.g += e, this.b += e, this;
  }
  sub(e) {
    return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
  }
  multiply(e) {
    return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
  }
  multiplyScalar(e) {
    return this.r *= e, this.g *= e, this.b *= e, this;
  }
  lerp(e, t) {
    return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
  }
  lerpColors(e, t, n) {
    return this.r = e.r + (t.r - e.r) * n, this.g = e.g + (t.g - e.g) * n, this.b = e.b + (t.b - e.b) * n, this;
  }
  lerpHSL(e, t) {
    this.getHSL(Mn), e.getHSL(vs);
    const n = Ji(Mn.h, vs.h, t), i = Ji(Mn.s, vs.s, t), r = Ji(Mn.l, vs.l, t);
    return this.setHSL(n, i, r), this;
  }
  setFromVector3(e) {
    return this.r = e.x, this.g = e.y, this.b = e.z, this;
  }
  applyMatrix3(e) {
    const t = this.r, n = this.g, i = this.b, r = e.elements;
    return this.r = r[0] * t + r[3] * n + r[6] * i, this.g = r[1] * t + r[4] * n + r[7] * i, this.b = r[2] * t + r[5] * n + r[8] * i, this;
  }
  equals(e) {
    return e.r === this.r && e.g === this.g && e.b === this.b;
  }
  fromArray(e, t = 0) {
    return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
  }
  fromBufferAttribute(e, t) {
    return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const St = /* @__PURE__ */ new Se();
Se.NAMES = Vc;
let ru = 0;
class Yt extends Dn {
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: ru++ }), this.uuid = Ht(), this.name = "", this.type = "Material", this.blending = Mi, this.side = un, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = jr, this.blendDst = Kr, this.blendEquation = Wn, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Se(0, 0, 0), this.blendAlpha = 0, this.depthFunc = Vs, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = io, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = Jn, this.stencilZFail = Jn, this.stencilZPass = Jn, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(e) {
    this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
  }
  onBuild() {
  }
  onBeforeRender() {
  }
  onBeforeCompile() {
  }
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(e) {
    if (e !== void 0)
      for (const t in e) {
        const n = e[t];
        if (n === void 0) {
          console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);
          continue;
        }
        const i = this[t];
        if (i === void 0) {
          console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);
          continue;
        }
        i && i.isColor ? i.set(n) : i && i.isVector3 && n && n.isVector3 ? i.copy(n) : this[t] = n;
      }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    t && (e = {
      textures: {},
      images: {}
    });
    const n = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON"
      }
    };
    n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(e).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(e).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(e).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(e).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(e).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== Mi && (n.blending = this.blending), this.side !== un && (n.side = this.side), this.vertexColors === !0 && (n.vertexColors = !0), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === !0 && (n.transparent = !0), this.blendSrc !== jr && (n.blendSrc = this.blendSrc), this.blendDst !== Kr && (n.blendDst = this.blendDst), this.blendEquation !== Wn && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== Vs && (n.depthFunc = this.depthFunc), this.depthTest === !1 && (n.depthTest = this.depthTest), this.depthWrite === !1 && (n.depthWrite = this.depthWrite), this.colorWrite === !1 && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== io && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== Jn && (n.stencilFail = this.stencilFail), this.stencilZFail !== Jn && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== Jn && (n.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === !0 && (n.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === !0 && (n.dithering = !0), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === !0 && (n.alphaHash = !0), this.alphaToCoverage === !0 && (n.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0), this.forceSinglePass === !0 && (n.forceSinglePass = !0), this.wireframe === !0 && (n.wireframe = !0), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (n.flatShading = !0), this.visible === !1 && (n.visible = !1), this.toneMapped === !1 && (n.toneMapped = !1), this.fog === !1 && (n.fog = !1), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
    function i(r) {
      const a = [];
      for (const o in r) {
        const c = r[o];
        delete c.metadata, a.push(c);
      }
      return a;
    }
    if (t) {
      const r = i(e.textures), a = i(e.images);
      r.length > 0 && (n.textures = r), a.length > 0 && (n.images = a);
    }
    return n;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
    const t = e.clippingPlanes;
    let n = null;
    if (t !== null) {
      const i = t.length;
      n = new Array(i);
      for (let r = 0; r !== i; ++r)
        n[r] = t[r].clone();
    }
    return this.clippingPlanes = n, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
}
class wn extends Yt {
  constructor(e) {
    super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new Se(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new jt(), this.combine = yc, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
  }
}
const ct = /* @__PURE__ */ new C(), Ms = /* @__PURE__ */ new Me();
class _t {
  constructor(e, t, n = !1) {
    if (Array.isArray(e))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, this.name = "", this.array = e, this.itemSize = t, this.count = e !== void 0 ? e.length / t : 0, this.normalized = n, this.usage = Qr, this._updateRange = { offset: 0, count: -1 }, this.updateRanges = [], this.gpuType = qt, this.version = 0;
  }
  onUploadCallback() {
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  get updateRange() {
    return Bc("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."), this._updateRange;
  }
  setUsage(e) {
    return this.usage = e, this;
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
  }
  copyAt(e, t, n) {
    e *= this.itemSize, n *= t.itemSize;
    for (let i = 0, r = this.itemSize; i < r; i++)
      this.array[e + i] = t.array[n + i];
    return this;
  }
  copyArray(e) {
    return this.array.set(e), this;
  }
  applyMatrix3(e) {
    if (this.itemSize === 2)
      for (let t = 0, n = this.count; t < n; t++)
        Ms.fromBufferAttribute(this, t), Ms.applyMatrix3(e), this.setXY(t, Ms.x, Ms.y);
    else if (this.itemSize === 3)
      for (let t = 0, n = this.count; t < n; t++)
        ct.fromBufferAttribute(this, t), ct.applyMatrix3(e), this.setXYZ(t, ct.x, ct.y, ct.z);
    return this;
  }
  applyMatrix4(e) {
    for (let t = 0, n = this.count; t < n; t++)
      ct.fromBufferAttribute(this, t), ct.applyMatrix4(e), this.setXYZ(t, ct.x, ct.y, ct.z);
    return this;
  }
  applyNormalMatrix(e) {
    for (let t = 0, n = this.count; t < n; t++)
      ct.fromBufferAttribute(this, t), ct.applyNormalMatrix(e), this.setXYZ(t, ct.x, ct.y, ct.z);
    return this;
  }
  transformDirection(e) {
    for (let t = 0, n = this.count; t < n; t++)
      ct.fromBufferAttribute(this, t), ct.transformDirection(e), this.setXYZ(t, ct.x, ct.y, ct.z);
    return this;
  }
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  getComponent(e, t) {
    let n = this.array[e * this.itemSize + t];
    return this.normalized && (n = kt(n, this.array)), n;
  }
  setComponent(e, t, n) {
    return this.normalized && (n = je(n, this.array)), this.array[e * this.itemSize + t] = n, this;
  }
  getX(e) {
    let t = this.array[e * this.itemSize];
    return this.normalized && (t = kt(t, this.array)), t;
  }
  setX(e, t) {
    return this.normalized && (t = je(t, this.array)), this.array[e * this.itemSize] = t, this;
  }
  getY(e) {
    let t = this.array[e * this.itemSize + 1];
    return this.normalized && (t = kt(t, this.array)), t;
  }
  setY(e, t) {
    return this.normalized && (t = je(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
  }
  getZ(e) {
    let t = this.array[e * this.itemSize + 2];
    return this.normalized && (t = kt(t, this.array)), t;
  }
  setZ(e, t) {
    return this.normalized && (t = je(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
  }
  getW(e) {
    let t = this.array[e * this.itemSize + 3];
    return this.normalized && (t = kt(t, this.array)), t;
  }
  setW(e, t) {
    return this.normalized && (t = je(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
  }
  setXY(e, t, n) {
    return e *= this.itemSize, this.normalized && (t = je(t, this.array), n = je(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this;
  }
  setXYZ(e, t, n, i) {
    return e *= this.itemSize, this.normalized && (t = je(t, this.array), n = je(n, this.array), i = je(i, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = i, this;
  }
  setXYZW(e, t, n, i, r) {
    return e *= this.itemSize, this.normalized && (t = je(t, this.array), n = je(n, this.array), i = je(i, this.array), r = je(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = i, this.array[e + 3] = r, this;
  }
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const e = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (e.name = this.name), this.usage !== Qr && (e.usage = this.usage), e;
  }
}
class Gc extends _t {
  constructor(e, t, n) {
    super(new Uint16Array(e), t, n);
  }
}
class Wc extends _t {
  constructor(e, t, n) {
    super(new Uint32Array(e), t, n);
  }
}
class hn extends _t {
  constructor(e, t, n) {
    super(new Float32Array(e), t, n);
  }
}
let au = 0;
const Nt = /* @__PURE__ */ new Ie(), Rr = /* @__PURE__ */ new rt(), ci = /* @__PURE__ */ new C(), Ct = /* @__PURE__ */ new dn(), Gi = /* @__PURE__ */ new dn(), dt = /* @__PURE__ */ new C();
class Vt extends Dn {
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: au++ }), this.uuid = Ht(), this.name = "", this.type = "BufferGeometry", this.index = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  getIndex() {
    return this.index;
  }
  setIndex(e) {
    return Array.isArray(e) ? this.index = new (Fc(e) ? Wc : Gc)(e, 1) : this.index = e, this;
  }
  getAttribute(e) {
    return this.attributes[e];
  }
  setAttribute(e, t) {
    return this.attributes[e] = t, this;
  }
  deleteAttribute(e) {
    return delete this.attributes[e], this;
  }
  hasAttribute(e) {
    return this.attributes[e] !== void 0;
  }
  addGroup(e, t, n = 0) {
    this.groups.push({
      start: e,
      count: t,
      materialIndex: n
    });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(e, t) {
    this.drawRange.start = e, this.drawRange.count = t;
  }
  applyMatrix4(e) {
    const t = this.attributes.position;
    t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = !0);
    const n = this.attributes.normal;
    if (n !== void 0) {
      const r = new Le().getNormalMatrix(e);
      n.applyNormalMatrix(r), n.needsUpdate = !0;
    }
    const i = this.attributes.tangent;
    return i !== void 0 && (i.transformDirection(e), i.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  applyQuaternion(e) {
    return Nt.makeRotationFromQuaternion(e), this.applyMatrix4(Nt), this;
  }
  rotateX(e) {
    return Nt.makeRotationX(e), this.applyMatrix4(Nt), this;
  }
  rotateY(e) {
    return Nt.makeRotationY(e), this.applyMatrix4(Nt), this;
  }
  rotateZ(e) {
    return Nt.makeRotationZ(e), this.applyMatrix4(Nt), this;
  }
  translate(e, t, n) {
    return Nt.makeTranslation(e, t, n), this.applyMatrix4(Nt), this;
  }
  scale(e, t, n) {
    return Nt.makeScale(e, t, n), this.applyMatrix4(Nt), this;
  }
  lookAt(e) {
    return Rr.lookAt(e), Rr.updateMatrix(), this.applyMatrix4(Rr.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(ci).negate(), this.translate(ci.x, ci.y, ci.z), this;
  }
  setFromPoints(e) {
    const t = [];
    for (let n = 0, i = e.length; n < i; n++) {
      const r = e[n];
      t.push(r.x, r.y, r.z || 0);
    }
    return this.setAttribute("position", new hn(t, 3)), this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new dn());
    const e = this.attributes.position, t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
        new C(-1 / 0, -1 / 0, -1 / 0),
        new C(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (e !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(e), t)
        for (let n = 0, i = t.length; n < i; n++) {
          const r = t[n];
          Ct.setFromBufferAttribute(r), this.morphTargetsRelative ? (dt.addVectors(this.boundingBox.min, Ct.min), this.boundingBox.expandByPoint(dt), dt.addVectors(this.boundingBox.max, Ct.max), this.boundingBox.expandByPoint(dt)) : (this.boundingBox.expandByPoint(Ct.min), this.boundingBox.expandByPoint(Ct.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new Kt());
    const e = this.attributes.position, t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new C(), 1 / 0);
      return;
    }
    if (e) {
      const n = this.boundingSphere.center;
      if (Ct.setFromBufferAttribute(e), t)
        for (let r = 0, a = t.length; r < a; r++) {
          const o = t[r];
          Gi.setFromBufferAttribute(o), this.morphTargetsRelative ? (dt.addVectors(Ct.min, Gi.min), Ct.expandByPoint(dt), dt.addVectors(Ct.max, Gi.max), Ct.expandByPoint(dt)) : (Ct.expandByPoint(Gi.min), Ct.expandByPoint(Gi.max));
        }
      Ct.getCenter(n);
      let i = 0;
      for (let r = 0, a = e.count; r < a; r++)
        dt.fromBufferAttribute(e, r), i = Math.max(i, n.distanceToSquared(dt));
      if (t)
        for (let r = 0, a = t.length; r < a; r++) {
          const o = t[r], c = this.morphTargetsRelative;
          for (let l = 0, h = o.count; l < h; l++)
            dt.fromBufferAttribute(o, l), c && (ci.fromBufferAttribute(e, l), dt.add(ci)), i = Math.max(i, n.distanceToSquared(dt));
        }
      this.boundingSphere.radius = Math.sqrt(i), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  computeTangents() {
    const e = this.index, t = this.attributes;
    if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = t.position, i = t.normal, r = t.uv;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new _t(new Float32Array(4 * n.count), 4));
    const a = this.getAttribute("tangent"), o = [], c = [];
    for (let k = 0; k < n.count; k++)
      o[k] = new C(), c[k] = new C();
    const l = new C(), h = new C(), u = new C(), d = new Me(), p = new Me(), g = new Me(), _ = new C(), f = new C();
    function m(k, E, M) {
      l.fromBufferAttribute(n, k), h.fromBufferAttribute(n, E), u.fromBufferAttribute(n, M), d.fromBufferAttribute(r, k), p.fromBufferAttribute(r, E), g.fromBufferAttribute(r, M), h.sub(l), u.sub(l), p.sub(d), g.sub(d);
      const O = 1 / (p.x * g.y - g.x * p.y);
      isFinite(O) && (_.copy(h).multiplyScalar(g.y).addScaledVector(u, -p.y).multiplyScalar(O), f.copy(u).multiplyScalar(p.x).addScaledVector(h, -g.x).multiplyScalar(O), o[k].add(_), o[E].add(_), o[M].add(_), c[k].add(f), c[E].add(f), c[M].add(f));
    }
    let T = this.groups;
    T.length === 0 && (T = [{
      start: 0,
      count: e.count
    }]);
    for (let k = 0, E = T.length; k < E; ++k) {
      const M = T[k], O = M.start, W = M.count;
      for (let P = O, q = O + W; P < q; P += 3)
        m(
          e.getX(P + 0),
          e.getX(P + 1),
          e.getX(P + 2)
        );
    }
    const S = new C(), A = new C(), D = new C(), R = new C();
    function w(k) {
      D.fromBufferAttribute(i, k), R.copy(D);
      const E = o[k];
      S.copy(E), S.sub(D.multiplyScalar(D.dot(E))).normalize(), A.crossVectors(R, E);
      const O = A.dot(c[k]) < 0 ? -1 : 1;
      a.setXYZW(k, S.x, S.y, S.z, O);
    }
    for (let k = 0, E = T.length; k < E; ++k) {
      const M = T[k], O = M.start, W = M.count;
      for (let P = O, q = O + W; P < q; P += 3)
        w(e.getX(P + 0)), w(e.getX(P + 1)), w(e.getX(P + 2));
    }
  }
  computeVertexNormals() {
    const e = this.index, t = this.getAttribute("position");
    if (t !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0)
        n = new _t(new Float32Array(t.count * 3), 3), this.setAttribute("normal", n);
      else
        for (let d = 0, p = n.count; d < p; d++)
          n.setXYZ(d, 0, 0, 0);
      const i = new C(), r = new C(), a = new C(), o = new C(), c = new C(), l = new C(), h = new C(), u = new C();
      if (e)
        for (let d = 0, p = e.count; d < p; d += 3) {
          const g = e.getX(d + 0), _ = e.getX(d + 1), f = e.getX(d + 2);
          i.fromBufferAttribute(t, g), r.fromBufferAttribute(t, _), a.fromBufferAttribute(t, f), h.subVectors(a, r), u.subVectors(i, r), h.cross(u), o.fromBufferAttribute(n, g), c.fromBufferAttribute(n, _), l.fromBufferAttribute(n, f), o.add(h), c.add(h), l.add(h), n.setXYZ(g, o.x, o.y, o.z), n.setXYZ(_, c.x, c.y, c.z), n.setXYZ(f, l.x, l.y, l.z);
        }
      else
        for (let d = 0, p = t.count; d < p; d += 3)
          i.fromBufferAttribute(t, d + 0), r.fromBufferAttribute(t, d + 1), a.fromBufferAttribute(t, d + 2), h.subVectors(a, r), u.subVectors(i, r), h.cross(u), n.setXYZ(d + 0, h.x, h.y, h.z), n.setXYZ(d + 1, h.x, h.y, h.z), n.setXYZ(d + 2, h.x, h.y, h.z);
      this.normalizeNormals(), n.needsUpdate = !0;
    }
  }
  normalizeNormals() {
    const e = this.attributes.normal;
    for (let t = 0, n = e.count; t < n; t++)
      dt.fromBufferAttribute(e, t), dt.normalize(), e.setXYZ(t, dt.x, dt.y, dt.z);
  }
  toNonIndexed() {
    function e(o, c) {
      const l = o.array, h = o.itemSize, u = o.normalized, d = new l.constructor(c.length * h);
      let p = 0, g = 0;
      for (let _ = 0, f = c.length; _ < f; _++) {
        o.isInterleavedBufferAttribute ? p = c[_] * o.data.stride + o.offset : p = c[_] * h;
        for (let m = 0; m < h; m++)
          d[g++] = l[p++];
      }
      return new _t(d, h, u);
    }
    if (this.index === null)
      return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const t = new Vt(), n = this.index.array, i = this.attributes;
    for (const o in i) {
      const c = i[o], l = e(c, n);
      t.setAttribute(o, l);
    }
    const r = this.morphAttributes;
    for (const o in r) {
      const c = [], l = r[o];
      for (let h = 0, u = l.length; h < u; h++) {
        const d = l[h], p = e(d, n);
        c.push(p);
      }
      t.morphAttributes[o] = c;
    }
    t.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, c = a.length; o < c; o++) {
      const l = a[o];
      t.addGroup(l.start, l.count, l.materialIndex);
    }
    return t;
  }
  toJSON() {
    const e = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON"
      }
    };
    if (e.uuid = this.uuid, e.type = this.type, this.name !== "" && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0) {
      const c = this.parameters;
      for (const l in c)
        c[l] !== void 0 && (e[l] = c[l]);
      return e;
    }
    e.data = { attributes: {} };
    const t = this.index;
    t !== null && (e.data.index = {
      type: t.array.constructor.name,
      array: Array.prototype.slice.call(t.array)
    });
    const n = this.attributes;
    for (const c in n) {
      const l = n[c];
      e.data.attributes[c] = l.toJSON(e.data);
    }
    const i = {};
    let r = !1;
    for (const c in this.morphAttributes) {
      const l = this.morphAttributes[c], h = [];
      for (let u = 0, d = l.length; u < d; u++) {
        const p = l[u];
        h.push(p.toJSON(e.data));
      }
      h.length > 0 && (i[c] = h, r = !0);
    }
    r && (e.data.morphAttributes = i, e.data.morphTargetsRelative = this.morphTargetsRelative);
    const a = this.groups;
    a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return o !== null && (e.data.boundingSphere = {
      center: o.center.toArray(),
      radius: o.radius
    }), e;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const t = {};
    this.name = e.name;
    const n = e.index;
    n !== null && this.setIndex(n.clone(t));
    const i = e.attributes;
    for (const l in i) {
      const h = i[l];
      this.setAttribute(l, h.clone(t));
    }
    const r = e.morphAttributes;
    for (const l in r) {
      const h = [], u = r[l];
      for (let d = 0, p = u.length; d < p; d++)
        h.push(u[d].clone(t));
      this.morphAttributes[l] = h;
    }
    this.morphTargetsRelative = e.morphTargetsRelative;
    const a = e.groups;
    for (let l = 0, h = a.length; l < h; l++) {
      const u = a[l];
      this.addGroup(u.start, u.count, u.materialIndex);
    }
    const o = e.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const c = e.boundingSphere;
    return c !== null && (this.boundingSphere = c.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const vo = /* @__PURE__ */ new Ie(), Bn = /* @__PURE__ */ new os(), Ss = /* @__PURE__ */ new Kt(), Mo = /* @__PURE__ */ new C(), li = /* @__PURE__ */ new C(), hi = /* @__PURE__ */ new C(), ui = /* @__PURE__ */ new C(), Cr = /* @__PURE__ */ new C(), ys = /* @__PURE__ */ new C(), Es = /* @__PURE__ */ new Me(), Ts = /* @__PURE__ */ new Me(), As = /* @__PURE__ */ new Me(), So = /* @__PURE__ */ new C(), yo = /* @__PURE__ */ new C(), Eo = /* @__PURE__ */ new C(), bs = /* @__PURE__ */ new C(), ws = /* @__PURE__ */ new C();
class Qe extends rt {
  constructor(e = new Vt(), t = new wn()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = e, this.material = t, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const i = t[n[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = i.length; r < a; r++) {
          const o = i[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
  getVertexPosition(e, t) {
    const n = this.geometry, i = n.attributes.position, r = n.morphAttributes.position, a = n.morphTargetsRelative;
    t.fromBufferAttribute(i, e);
    const o = this.morphTargetInfluences;
    if (r && o) {
      ys.set(0, 0, 0);
      for (let c = 0, l = r.length; c < l; c++) {
        const h = o[c], u = r[c];
        h !== 0 && (Cr.fromBufferAttribute(u, e), a ? ys.addScaledVector(Cr, h) : ys.addScaledVector(Cr.sub(t), h));
      }
      t.add(ys);
    }
    return t;
  }
  raycast(e, t) {
    const n = this.geometry, i = this.material, r = this.matrixWorld;
    i !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), Ss.copy(n.boundingSphere), Ss.applyMatrix4(r), Bn.copy(e.ray).recast(e.near), !(Ss.containsPoint(Bn.origin) === !1 && (Bn.intersectSphere(Ss, Mo) === null || Bn.origin.distanceToSquared(Mo) > (e.far - e.near) ** 2)) && (vo.copy(r).invert(), Bn.copy(e.ray).applyMatrix4(vo), !(n.boundingBox !== null && Bn.intersectsBox(n.boundingBox) === !1) && this._computeIntersections(e, t, Bn)));
  }
  _computeIntersections(e, t, n) {
    let i;
    const r = this.geometry, a = this.material, o = r.index, c = r.attributes.position, l = r.attributes.uv, h = r.attributes.uv1, u = r.attributes.normal, d = r.groups, p = r.drawRange;
    if (o !== null)
      if (Array.isArray(a))
        for (let g = 0, _ = d.length; g < _; g++) {
          const f = d[g], m = a[f.materialIndex], T = Math.max(f.start, p.start), S = Math.min(o.count, Math.min(f.start + f.count, p.start + p.count));
          for (let A = T, D = S; A < D; A += 3) {
            const R = o.getX(A), w = o.getX(A + 1), k = o.getX(A + 2);
            i = Rs(this, m, e, n, l, h, u, R, w, k), i && (i.faceIndex = Math.floor(A / 3), i.face.materialIndex = f.materialIndex, t.push(i));
          }
        }
      else {
        const g = Math.max(0, p.start), _ = Math.min(o.count, p.start + p.count);
        for (let f = g, m = _; f < m; f += 3) {
          const T = o.getX(f), S = o.getX(f + 1), A = o.getX(f + 2);
          i = Rs(this, a, e, n, l, h, u, T, S, A), i && (i.faceIndex = Math.floor(f / 3), t.push(i));
        }
      }
    else if (c !== void 0)
      if (Array.isArray(a))
        for (let g = 0, _ = d.length; g < _; g++) {
          const f = d[g], m = a[f.materialIndex], T = Math.max(f.start, p.start), S = Math.min(c.count, Math.min(f.start + f.count, p.start + p.count));
          for (let A = T, D = S; A < D; A += 3) {
            const R = A, w = A + 1, k = A + 2;
            i = Rs(this, m, e, n, l, h, u, R, w, k), i && (i.faceIndex = Math.floor(A / 3), i.face.materialIndex = f.materialIndex, t.push(i));
          }
        }
      else {
        const g = Math.max(0, p.start), _ = Math.min(c.count, p.start + p.count);
        for (let f = g, m = _; f < m; f += 3) {
          const T = f, S = f + 1, A = f + 2;
          i = Rs(this, a, e, n, l, h, u, T, S, A), i && (i.faceIndex = Math.floor(f / 3), t.push(i));
        }
      }
  }
}
function ou(s, e, t, n, i, r, a, o) {
  let c;
  if (e.side === bt ? c = n.intersectTriangle(a, r, i, !0, o) : c = n.intersectTriangle(i, r, a, e.side === un, o), c === null)
    return null;
  ws.copy(o), ws.applyMatrix4(s.matrixWorld);
  const l = t.ray.origin.distanceTo(ws);
  return l < t.near || l > t.far ? null : {
    distance: l,
    point: ws.clone(),
    object: s
  };
}
function Rs(s, e, t, n, i, r, a, o, c, l) {
  s.getVertexPosition(o, li), s.getVertexPosition(c, hi), s.getVertexPosition(l, ui);
  const h = ou(s, e, t, n, li, hi, ui, bs);
  if (h) {
    i && (Es.fromBufferAttribute(i, o), Ts.fromBufferAttribute(i, c), As.fromBufferAttribute(i, l), h.uv = Xt.getInterpolation(bs, li, hi, ui, Es, Ts, As, new Me())), r && (Es.fromBufferAttribute(r, o), Ts.fromBufferAttribute(r, c), As.fromBufferAttribute(r, l), h.uv1 = Xt.getInterpolation(bs, li, hi, ui, Es, Ts, As, new Me())), a && (So.fromBufferAttribute(a, o), yo.fromBufferAttribute(a, c), Eo.fromBufferAttribute(a, l), h.normal = Xt.getInterpolation(bs, li, hi, ui, So, yo, Eo, new C()), h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
    const u = {
      a: o,
      b: c,
      c: l,
      normal: new C(),
      materialIndex: 0
    };
    Xt.getNormal(li, hi, ui, u.normal), h.face = u;
  }
  return h;
}
class Di extends Vt {
  constructor(e = 1, t = 1, n = 1, i = 1, r = 1, a = 1) {
    super(), this.type = "BoxGeometry", this.parameters = {
      width: e,
      height: t,
      depth: n,
      widthSegments: i,
      heightSegments: r,
      depthSegments: a
    };
    const o = this;
    i = Math.floor(i), r = Math.floor(r), a = Math.floor(a);
    const c = [], l = [], h = [], u = [];
    let d = 0, p = 0;
    g("z", "y", "x", -1, -1, n, t, e, a, r, 0), g("z", "y", "x", 1, -1, n, t, -e, a, r, 1), g("x", "z", "y", 1, 1, e, n, t, i, a, 2), g("x", "z", "y", 1, -1, e, n, -t, i, a, 3), g("x", "y", "z", 1, -1, e, t, n, i, r, 4), g("x", "y", "z", -1, -1, e, t, -n, i, r, 5), this.setIndex(c), this.setAttribute("position", new hn(l, 3)), this.setAttribute("normal", new hn(h, 3)), this.setAttribute("uv", new hn(u, 2));
    function g(_, f, m, T, S, A, D, R, w, k, E) {
      const M = A / w, O = D / k, W = A / 2, P = D / 2, q = R / 2, X = w + 1, $ = k + 1;
      let J = 0, V = 0;
      const ee = new C();
      for (let Q = 0; Q < $; Q++) {
        const de = Q * O - P;
        for (let Fe = 0; Fe < X; Fe++) {
          const Ye = Fe * M - W;
          ee[_] = Ye * T, ee[f] = de * S, ee[m] = q, l.push(ee.x, ee.y, ee.z), ee[_] = 0, ee[f] = 0, ee[m] = R > 0 ? 1 : -1, h.push(ee.x, ee.y, ee.z), u.push(Fe / w), u.push(1 - Q / k), J += 1;
        }
      }
      for (let Q = 0; Q < k; Q++)
        for (let de = 0; de < w; de++) {
          const Fe = d + de + X * Q, Ye = d + de + X * (Q + 1), G = d + (de + 1) + X * (Q + 1), te = d + (de + 1) + X * Q;
          c.push(Fe, Ye, te), c.push(Ye, G, te), V += 6;
        }
      o.addGroup(p, V, E), p += V, d += J;
    }
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new Di(e.width, e.height, e.depth, e.widthSegments, e.heightSegments, e.depthSegments);
  }
}
function Pi(s) {
  const e = {};
  for (const t in s) {
    e[t] = {};
    for (const n in s[t]) {
      const i = s[t][n];
      i && (i.isColor || i.isMatrix3 || i.isMatrix4 || i.isVector2 || i.isVector3 || i.isVector4 || i.isTexture || i.isQuaternion) ? i.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), e[t][n] = null) : e[t][n] = i.clone() : Array.isArray(i) ? e[t][n] = i.slice() : e[t][n] = i;
    }
  }
  return e;
}
function Et(s) {
  const e = {};
  for (let t = 0; t < s.length; t++) {
    const n = Pi(s[t]);
    for (const i in n)
      e[i] = n[i];
  }
  return e;
}
function cu(s) {
  const e = [];
  for (let t = 0; t < s.length; t++)
    e.push(s[t].clone());
  return e;
}
function Xc(s) {
  const e = s.getRenderTarget();
  return e === null ? s.outputColorSpace : e.isXRRenderTarget === !0 ? e.texture.colorSpace : qe.workingColorSpace;
}
const lu = { clone: Pi, merge: Et };
var hu = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, uu = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class In extends Yt {
  constructor(e) {
    super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = hu, this.fragmentShader = uu, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
      clipCullDistance: !1,
      // set to use vertex shader clipping
      multiDraw: !1
      // set to use vertex shader multi_draw / enable gl_DrawID
    }, this.defaultAttributeValues = {
      color: [1, 1, 1],
      uv: [0, 0],
      uv1: [0, 0]
    }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, e !== void 0 && this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = Pi(e.uniforms), this.uniformsGroups = cu(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    t.glslVersion = this.glslVersion, t.uniforms = {};
    for (const i in this.uniforms) {
      const a = this.uniforms[i].value;
      a && a.isTexture ? t.uniforms[i] = {
        type: "t",
        value: a.toJSON(e).uuid
      } : a && a.isColor ? t.uniforms[i] = {
        type: "c",
        value: a.getHex()
      } : a && a.isVector2 ? t.uniforms[i] = {
        type: "v2",
        value: a.toArray()
      } : a && a.isVector3 ? t.uniforms[i] = {
        type: "v3",
        value: a.toArray()
      } : a && a.isVector4 ? t.uniforms[i] = {
        type: "v4",
        value: a.toArray()
      } : a && a.isMatrix3 ? t.uniforms[i] = {
        type: "m3",
        value: a.toArray()
      } : a && a.isMatrix4 ? t.uniforms[i] = {
        type: "m4",
        value: a.toArray()
      } : t.uniforms[i] = {
        value: a
      };
    }
    Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
    const n = {};
    for (const i in this.extensions)
      this.extensions[i] === !0 && (n[i] = !0);
    return Object.keys(n).length > 0 && (t.extensions = n), t;
  }
}
class qc extends rt {
  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new Ie(), this.projectionMatrix = new Ie(), this.projectionMatrixInverse = new Ie(), this.coordinateSystem = ln;
  }
  copy(e, t) {
    return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
  }
  getWorldDirection(e) {
    return super.getWorldDirection(e).negate();
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(e, t) {
    super.updateWorldMatrix(e, t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Sn = /* @__PURE__ */ new C(), To = /* @__PURE__ */ new Me(), Ao = /* @__PURE__ */ new Me();
class Tt extends qc {
  constructor(e = 50, t = 1, n = 0.1, i = 2e3) {
    super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = n, this.far = i, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
  }
  /**
   * Sets the FOV by focal length in respect to the current .filmGauge.
   *
   * The default film gauge is 35, so that the focal length can be specified for
   * a 35mm (full frame) camera.
   *
   * Values for focal length and film gauge must have the same unit.
   */
  setFocalLength(e) {
    const t = 0.5 * this.getFilmHeight() / e;
    this.fov = Ci * 2 * Math.atan(t), this.updateProjectionMatrix();
  }
  /**
   * Calculates the focal length from the current .fov and .filmGauge.
   */
  getFocalLength() {
    const e = Math.tan($i * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / e;
  }
  getEffectiveFOV() {
    return Ci * 2 * Math.atan(
      Math.tan($i * 0.5 * this.fov) / this.zoom
    );
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  /**
   * Computes the 2D bounds of the camera's viewable rectangle at a given distance along the viewing direction.
   * Sets minTarget and maxTarget to the coordinates of the lower-left and upper-right corners of the view rectangle.
   */
  getViewBounds(e, t, n) {
    Sn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), t.set(Sn.x, Sn.y).multiplyScalar(-e / Sn.z), Sn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(Sn.x, Sn.y).multiplyScalar(-e / Sn.z);
  }
  /**
   * Computes the width and height of the camera's viewable rectangle at a given distance along the viewing direction.
   * Copies the result into the target Vector2, where x is width and y is height.
   */
  getViewSize(e, t) {
    return this.getViewBounds(e, To, Ao), t.subVectors(Ao, To);
  }
  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *
   * then for each monitor you would call it like this
   *
   *   const w = 1920;
   *   const h = 1080;
   *   const fullWidth = w * 3;
   *   const fullHeight = h * 2;
   *
   *   --A--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   *   --B--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   *   --C--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   *   --D--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   *   --E--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   *   --F--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   *
   *   Note there is no reason monitors have to be the same size or in a grid.
   */
  setViewOffset(e, t, n, i, r, a) {
    this.aspect = e / t, this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = i, this.view.width = r, this.view.height = a, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const e = this.near;
    let t = e * Math.tan($i * 0.5 * this.fov) / this.zoom, n = 2 * t, i = this.aspect * n, r = -0.5 * i;
    const a = this.view;
    if (this.view !== null && this.view.enabled) {
      const c = a.fullWidth, l = a.fullHeight;
      r += a.offsetX * i / c, t -= a.offsetY * n / l, i *= a.width / c, n *= a.height / l;
    }
    const o = this.filmOffset;
    o !== 0 && (r += e * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(r, r + i, t, t - n, e, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
  }
}
const di = -90, fi = 1;
class du extends rt {
  constructor(e, t, n) {
    super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const i = new Tt(di, fi, e, t);
    i.layers = this.layers, this.add(i);
    const r = new Tt(di, fi, e, t);
    r.layers = this.layers, this.add(r);
    const a = new Tt(di, fi, e, t);
    a.layers = this.layers, this.add(a);
    const o = new Tt(di, fi, e, t);
    o.layers = this.layers, this.add(o);
    const c = new Tt(di, fi, e, t);
    c.layers = this.layers, this.add(c);
    const l = new Tt(di, fi, e, t);
    l.layers = this.layers, this.add(l);
  }
  updateCoordinateSystem() {
    const e = this.coordinateSystem, t = this.children.concat(), [n, i, r, a, o, c] = t;
    for (const l of t)
      this.remove(l);
    if (e === ln)
      n.up.set(0, 1, 0), n.lookAt(1, 0, 0), i.up.set(0, 1, 0), i.lookAt(-1, 0, 0), r.up.set(0, 0, -1), r.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), c.up.set(0, 1, 0), c.lookAt(0, 0, -1);
    else if (e === js)
      n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), i.up.set(0, -1, 0), i.lookAt(1, 0, 0), r.up.set(0, 0, 1), r.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), c.up.set(0, -1, 0), c.lookAt(0, 0, -1);
    else
      throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
    for (const l of t)
      this.add(l), l.updateMatrixWorld();
  }
  update(e, t) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: i } = this;
    this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
    const [r, a, o, c, l, h] = this.children, u = e.getRenderTarget(), d = e.getActiveCubeFace(), p = e.getActiveMipmapLevel(), g = e.xr.enabled;
    e.xr.enabled = !1;
    const _ = n.texture.generateMipmaps;
    n.texture.generateMipmaps = !1, e.setRenderTarget(n, 0, i), e.render(t, r), e.setRenderTarget(n, 1, i), e.render(t, a), e.setRenderTarget(n, 2, i), e.render(t, o), e.setRenderTarget(n, 3, i), e.render(t, c), e.setRenderTarget(n, 4, i), e.render(t, l), n.texture.generateMipmaps = _, e.setRenderTarget(n, 5, i), e.render(t, h), e.setRenderTarget(u, d, p), e.xr.enabled = g, n.texture.needsPMREMUpdate = !0;
  }
}
class Yc extends ft {
  constructor(e, t, n, i, r, a, o, c, l, h) {
    e = e !== void 0 ? e : [], t = t !== void 0 ? t : Ti, super(e, t, n, i, r, a, o, c, l, h), this.isCubeTexture = !0, this.flipY = !1;
  }
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}
class fu extends Yn {
  constructor(e = 1, t = {}) {
    super(e, e, t), this.isWebGLCubeRenderTarget = !0;
    const n = { width: e, height: e, depth: 1 }, i = [n, n, n, n, n, n];
    this.texture = new Yc(i, t.mapping, t.wrapS, t.wrapT, t.magFilter, t.minFilter, t.format, t.type, t.anisotropy, t.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.generateMipmaps = t.generateMipmaps !== void 0 ? t.generateMipmaps : !1, this.texture.minFilter = t.minFilter !== void 0 ? t.minFilter : Pt;
  }
  fromEquirectangularTexture(e, t) {
    this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
    const n = {
      uniforms: {
        tEquirect: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      )
    }, i = new Di(5, 5, 5), r = new In({
      name: "CubemapFromEquirect",
      uniforms: Pi(n.uniforms),
      vertexShader: n.vertexShader,
      fragmentShader: n.fragmentShader,
      side: bt,
      blending: Cn
    });
    r.uniforms.tEquirect.value = t;
    const a = new Qe(i, r), o = t.minFilter;
    return t.minFilter === cn && (t.minFilter = Pt), new du(1, 10, this).update(e, a), t.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
  }
  clear(e, t, n, i) {
    const r = e.getRenderTarget();
    for (let a = 0; a < 6; a++)
      e.setRenderTarget(this, a), e.clear(t, n, i);
    e.setRenderTarget(r);
  }
}
const Pr = /* @__PURE__ */ new C(), pu = /* @__PURE__ */ new C(), mu = /* @__PURE__ */ new Le();
class En {
  constructor(e = new C(1, 0, 0), t = 0) {
    this.isPlane = !0, this.normal = e, this.constant = t;
  }
  set(e, t) {
    return this.normal.copy(e), this.constant = t, this;
  }
  setComponents(e, t, n, i) {
    return this.normal.set(e, t, n), this.constant = i, this;
  }
  setFromNormalAndCoplanarPoint(e, t) {
    return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
  }
  setFromCoplanarPoints(e, t, n) {
    const i = Pr.subVectors(n, t).cross(pu.subVectors(e, t)).normalize();
    return this.setFromNormalAndCoplanarPoint(i, e), this;
  }
  copy(e) {
    return this.normal.copy(e.normal), this.constant = e.constant, this;
  }
  normalize() {
    const e = 1 / this.normal.length();
    return this.normal.multiplyScalar(e), this.constant *= e, this;
  }
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  distanceToPoint(e) {
    return this.normal.dot(e) + this.constant;
  }
  distanceToSphere(e) {
    return this.distanceToPoint(e.center) - e.radius;
  }
  projectPoint(e, t) {
    return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
  }
  intersectLine(e, t) {
    const n = e.delta(Pr), i = this.normal.dot(n);
    if (i === 0)
      return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
    const r = -(e.start.dot(this.normal) + this.constant) / i;
    return r < 0 || r > 1 ? null : t.copy(e.start).addScaledVector(n, r);
  }
  intersectsLine(e) {
    const t = this.distanceToPoint(e.start), n = this.distanceToPoint(e.end);
    return t < 0 && n > 0 || n < 0 && t > 0;
  }
  intersectsBox(e) {
    return e.intersectsPlane(this);
  }
  intersectsSphere(e) {
    return e.intersectsPlane(this);
  }
  coplanarPoint(e) {
    return e.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(e, t) {
    const n = t || mu.getNormalMatrix(e), i = this.coplanarPoint(Pr).applyMatrix4(e), r = this.normal.applyMatrix3(n).normalize();
    return this.constant = -i.dot(r), this;
  }
  translate(e) {
    return this.constant -= e.dot(this.normal), this;
  }
  equals(e) {
    return e.normal.equals(this.normal) && e.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const kn = /* @__PURE__ */ new Kt(), Cs = /* @__PURE__ */ new C();
class da {
  constructor(e = new En(), t = new En(), n = new En(), i = new En(), r = new En(), a = new En()) {
    this.planes = [e, t, n, i, r, a];
  }
  set(e, t, n, i, r, a) {
    const o = this.planes;
    return o[0].copy(e), o[1].copy(t), o[2].copy(n), o[3].copy(i), o[4].copy(r), o[5].copy(a), this;
  }
  copy(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++)
      t[n].copy(e.planes[n]);
    return this;
  }
  setFromProjectionMatrix(e, t = ln) {
    const n = this.planes, i = e.elements, r = i[0], a = i[1], o = i[2], c = i[3], l = i[4], h = i[5], u = i[6], d = i[7], p = i[8], g = i[9], _ = i[10], f = i[11], m = i[12], T = i[13], S = i[14], A = i[15];
    if (n[0].setComponents(c - r, d - l, f - p, A - m).normalize(), n[1].setComponents(c + r, d + l, f + p, A + m).normalize(), n[2].setComponents(c + a, d + h, f + g, A + T).normalize(), n[3].setComponents(c - a, d - h, f - g, A - T).normalize(), n[4].setComponents(c - o, d - u, f - _, A - S).normalize(), t === ln)
      n[5].setComponents(c + o, d + u, f + _, A + S).normalize();
    else if (t === js)
      n[5].setComponents(o, u, _, S).normalize();
    else
      throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
    return this;
  }
  intersectsObject(e) {
    if (e.boundingSphere !== void 0)
      e.boundingSphere === null && e.computeBoundingSphere(), kn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
    else {
      const t = e.geometry;
      t.boundingSphere === null && t.computeBoundingSphere(), kn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
    }
    return this.intersectsSphere(kn);
  }
  intersectsSprite(e) {
    return kn.center.set(0, 0, 0), kn.radius = 0.7071067811865476, kn.applyMatrix4(e.matrixWorld), this.intersectsSphere(kn);
  }
  intersectsSphere(e) {
    const t = this.planes, n = e.center, i = -e.radius;
    for (let r = 0; r < 6; r++)
      if (t[r].distanceToPoint(n) < i)
        return !1;
    return !0;
  }
  intersectsBox(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) {
      const i = t[n];
      if (Cs.x = i.normal.x > 0 ? e.max.x : e.min.x, Cs.y = i.normal.y > 0 ? e.max.y : e.min.y, Cs.z = i.normal.z > 0 ? e.max.z : e.min.z, i.distanceToPoint(Cs) < 0)
        return !1;
    }
    return !0;
  }
  containsPoint(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++)
      if (t[n].distanceToPoint(e) < 0)
        return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
function jc() {
  let s = null, e = !1, t = null, n = null;
  function i(r, a) {
    t(r, a), n = s.requestAnimationFrame(i);
  }
  return {
    start: function() {
      e !== !0 && t !== null && (n = s.requestAnimationFrame(i), e = !0);
    },
    stop: function() {
      s.cancelAnimationFrame(n), e = !1;
    },
    setAnimationLoop: function(r) {
      t = r;
    },
    setContext: function(r) {
      s = r;
    }
  };
}
function gu(s) {
  const e = /* @__PURE__ */ new WeakMap();
  function t(o, c) {
    const l = o.array, h = o.usage, u = l.byteLength, d = s.createBuffer();
    s.bindBuffer(c, d), s.bufferData(c, l, h), o.onUploadCallback();
    let p;
    if (l instanceof Float32Array)
      p = s.FLOAT;
    else if (l instanceof Uint16Array)
      o.isFloat16BufferAttribute ? p = s.HALF_FLOAT : p = s.UNSIGNED_SHORT;
    else if (l instanceof Int16Array)
      p = s.SHORT;
    else if (l instanceof Uint32Array)
      p = s.UNSIGNED_INT;
    else if (l instanceof Int32Array)
      p = s.INT;
    else if (l instanceof Int8Array)
      p = s.BYTE;
    else if (l instanceof Uint8Array)
      p = s.UNSIGNED_BYTE;
    else if (l instanceof Uint8ClampedArray)
      p = s.UNSIGNED_BYTE;
    else
      throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + l);
    return {
      buffer: d,
      type: p,
      bytesPerElement: l.BYTES_PER_ELEMENT,
      version: o.version,
      size: u
    };
  }
  function n(o, c, l) {
    const h = c.array, u = c._updateRange, d = c.updateRanges;
    if (s.bindBuffer(l, o), u.count === -1 && d.length === 0 && s.bufferSubData(l, 0, h), d.length !== 0) {
      for (let p = 0, g = d.length; p < g; p++) {
        const _ = d[p];
        s.bufferSubData(
          l,
          _.start * h.BYTES_PER_ELEMENT,
          h,
          _.start,
          _.count
        );
      }
      c.clearUpdateRanges();
    }
    u.count !== -1 && (s.bufferSubData(
      l,
      u.offset * h.BYTES_PER_ELEMENT,
      h,
      u.offset,
      u.count
    ), u.count = -1), c.onUploadCallback();
  }
  function i(o) {
    return o.isInterleavedBufferAttribute && (o = o.data), e.get(o);
  }
  function r(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const c = e.get(o);
    c && (s.deleteBuffer(c.buffer), e.delete(o));
  }
  function a(o, c) {
    if (o.isGLBufferAttribute) {
      const h = e.get(o);
      (!h || h.version < o.version) && e.set(o, {
        buffer: o.buffer,
        type: o.type,
        bytesPerElement: o.elementSize,
        version: o.version
      });
      return;
    }
    o.isInterleavedBufferAttribute && (o = o.data);
    const l = e.get(o);
    if (l === void 0)
      e.set(o, t(o, c));
    else if (l.version < o.version) {
      if (l.size !== o.array.byteLength)
        throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      n(l.buffer, o, c), l.version = o.version;
    }
  }
  return {
    get: i,
    remove: r,
    update: a
  };
}
class tr extends Vt {
  constructor(e = 1, t = 1, n = 1, i = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: e,
      height: t,
      widthSegments: n,
      heightSegments: i
    };
    const r = e / 2, a = t / 2, o = Math.floor(n), c = Math.floor(i), l = o + 1, h = c + 1, u = e / o, d = t / c, p = [], g = [], _ = [], f = [];
    for (let m = 0; m < h; m++) {
      const T = m * d - a;
      for (let S = 0; S < l; S++) {
        const A = S * u - r;
        g.push(A, -T, 0), _.push(0, 0, 1), f.push(S / o), f.push(1 - m / c);
      }
    }
    for (let m = 0; m < c; m++)
      for (let T = 0; T < o; T++) {
        const S = T + l * m, A = T + l * (m + 1), D = T + 1 + l * (m + 1), R = T + 1 + l * m;
        p.push(S, A, R), p.push(A, D, R);
      }
    this.setIndex(p), this.setAttribute("position", new hn(g, 3)), this.setAttribute("normal", new hn(_, 3)), this.setAttribute("uv", new hn(f, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new tr(e.width, e.height, e.widthSegments, e.heightSegments);
  }
}
var _u = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, xu = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, vu = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, Mu = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Su = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, yu = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, Eu = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, Tu = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, Au = `#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, bu = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`, wu = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, Ru = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, Cu = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, Pu = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, Lu = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, Iu = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, Du = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, Nu = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, Uu = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, Ou = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, Fu = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, Bu = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`, ku = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`, zu = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, Hu = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, Vu = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, Gu = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, Wu = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, Xu = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, qu = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, Yu = "gl_FragColor = linearToOutputTexel( gl_FragColor );", ju = `
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`, Ku = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, Zu = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, $u = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, Ju = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, Qu = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, ed = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, td = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, nd = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, id = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, sd = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, rd = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, ad = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, od = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, cd = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, ld = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, hd = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, ud = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, dd = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, fd = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, pd = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, md = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, gd = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, _d = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, xd = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, vd = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, Md = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Sd = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, yd = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, Ed = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, Td = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, Ad = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, bd = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, wd = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, Rd = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, Cd = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, Pd = `#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, Ld = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`, Id = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
	#endif
	#ifdef MORPHTARGETS_TEXTURE
		#ifndef USE_INSTANCING_MORPH
			uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		#endif
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`, Dd = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`, Nd = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, Ud = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, Od = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Fd = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Bd = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, kd = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, zd = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, Hd = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, Vd = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, Gd = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, Wd = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, Xd = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, qd = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, Yd = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, jd = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, Kd = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, Zd = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, $d = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, Jd = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`, Qd = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, ef = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, tf = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, nf = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, sf = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, rf = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, af = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, of = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, cf = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, lf = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, hf = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, uf = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, df = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, ff = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, pf = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, mf = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, gf = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const _f = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, xf = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, vf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Mf = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Sf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, yf = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Ef = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, Tf = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`, Af = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, bf = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, wf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, Rf = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Cf = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, Pf = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Lf = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, If = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Df = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Nf = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Uf = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, Of = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Ff = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, Bf = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, kf = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, zf = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Hf = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, Vf = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Gf = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Wf = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Xf = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, qf = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Yf = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, jf = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Kf = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, Zf = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Pe = {
  alphahash_fragment: _u,
  alphahash_pars_fragment: xu,
  alphamap_fragment: vu,
  alphamap_pars_fragment: Mu,
  alphatest_fragment: Su,
  alphatest_pars_fragment: yu,
  aomap_fragment: Eu,
  aomap_pars_fragment: Tu,
  batching_pars_vertex: Au,
  batching_vertex: bu,
  begin_vertex: wu,
  beginnormal_vertex: Ru,
  bsdfs: Cu,
  iridescence_fragment: Pu,
  bumpmap_pars_fragment: Lu,
  clipping_planes_fragment: Iu,
  clipping_planes_pars_fragment: Du,
  clipping_planes_pars_vertex: Nu,
  clipping_planes_vertex: Uu,
  color_fragment: Ou,
  color_pars_fragment: Fu,
  color_pars_vertex: Bu,
  color_vertex: ku,
  common: zu,
  cube_uv_reflection_fragment: Hu,
  defaultnormal_vertex: Vu,
  displacementmap_pars_vertex: Gu,
  displacementmap_vertex: Wu,
  emissivemap_fragment: Xu,
  emissivemap_pars_fragment: qu,
  colorspace_fragment: Yu,
  colorspace_pars_fragment: ju,
  envmap_fragment: Ku,
  envmap_common_pars_fragment: Zu,
  envmap_pars_fragment: $u,
  envmap_pars_vertex: Ju,
  envmap_physical_pars_fragment: ld,
  envmap_vertex: Qu,
  fog_vertex: ed,
  fog_pars_vertex: td,
  fog_fragment: nd,
  fog_pars_fragment: id,
  gradientmap_pars_fragment: sd,
  lightmap_pars_fragment: rd,
  lights_lambert_fragment: ad,
  lights_lambert_pars_fragment: od,
  lights_pars_begin: cd,
  lights_toon_fragment: hd,
  lights_toon_pars_fragment: ud,
  lights_phong_fragment: dd,
  lights_phong_pars_fragment: fd,
  lights_physical_fragment: pd,
  lights_physical_pars_fragment: md,
  lights_fragment_begin: gd,
  lights_fragment_maps: _d,
  lights_fragment_end: xd,
  logdepthbuf_fragment: vd,
  logdepthbuf_pars_fragment: Md,
  logdepthbuf_pars_vertex: Sd,
  logdepthbuf_vertex: yd,
  map_fragment: Ed,
  map_pars_fragment: Td,
  map_particle_fragment: Ad,
  map_particle_pars_fragment: bd,
  metalnessmap_fragment: wd,
  metalnessmap_pars_fragment: Rd,
  morphinstance_vertex: Cd,
  morphcolor_vertex: Pd,
  morphnormal_vertex: Ld,
  morphtarget_pars_vertex: Id,
  morphtarget_vertex: Dd,
  normal_fragment_begin: Nd,
  normal_fragment_maps: Ud,
  normal_pars_fragment: Od,
  normal_pars_vertex: Fd,
  normal_vertex: Bd,
  normalmap_pars_fragment: kd,
  clearcoat_normal_fragment_begin: zd,
  clearcoat_normal_fragment_maps: Hd,
  clearcoat_pars_fragment: Vd,
  iridescence_pars_fragment: Gd,
  opaque_fragment: Wd,
  packing: Xd,
  premultiplied_alpha_fragment: qd,
  project_vertex: Yd,
  dithering_fragment: jd,
  dithering_pars_fragment: Kd,
  roughnessmap_fragment: Zd,
  roughnessmap_pars_fragment: $d,
  shadowmap_pars_fragment: Jd,
  shadowmap_pars_vertex: Qd,
  shadowmap_vertex: ef,
  shadowmask_pars_fragment: tf,
  skinbase_vertex: nf,
  skinning_pars_vertex: sf,
  skinning_vertex: rf,
  skinnormal_vertex: af,
  specularmap_fragment: of,
  specularmap_pars_fragment: cf,
  tonemapping_fragment: lf,
  tonemapping_pars_fragment: hf,
  transmission_fragment: uf,
  transmission_pars_fragment: df,
  uv_pars_fragment: ff,
  uv_pars_vertex: pf,
  uv_vertex: mf,
  worldpos_vertex: gf,
  background_vert: _f,
  background_frag: xf,
  backgroundCube_vert: vf,
  backgroundCube_frag: Mf,
  cube_vert: Sf,
  cube_frag: yf,
  depth_vert: Ef,
  depth_frag: Tf,
  distanceRGBA_vert: Af,
  distanceRGBA_frag: bf,
  equirect_vert: wf,
  equirect_frag: Rf,
  linedashed_vert: Cf,
  linedashed_frag: Pf,
  meshbasic_vert: Lf,
  meshbasic_frag: If,
  meshlambert_vert: Df,
  meshlambert_frag: Nf,
  meshmatcap_vert: Uf,
  meshmatcap_frag: Of,
  meshnormal_vert: Ff,
  meshnormal_frag: Bf,
  meshphong_vert: kf,
  meshphong_frag: zf,
  meshphysical_vert: Hf,
  meshphysical_frag: Vf,
  meshtoon_vert: Gf,
  meshtoon_frag: Wf,
  points_vert: Xf,
  points_frag: qf,
  shadow_vert: Yf,
  shadow_frag: jf,
  sprite_vert: Kf,
  sprite_frag: Zf
}, re = {
  common: {
    diffuse: { value: /* @__PURE__ */ new Se(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Le() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Le() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new Le() }
  },
  envmap: {
    envMap: { value: null },
    envMapRotation: { value: /* @__PURE__ */ new Le() },
    flipEnvMap: { value: -1 },
    reflectivity: { value: 1 },
    // basic, lambert, phong
    ior: { value: 1.5 },
    // physical
    refractionRatio: { value: 0.98 }
    // basic, lambert, phong
  },
  aomap: {
    aoMap: { value: null },
    aoMapIntensity: { value: 1 },
    aoMapTransform: { value: /* @__PURE__ */ new Le() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new Le() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new Le() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new Le() },
    normalScale: { value: /* @__PURE__ */ new Me(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new Le() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new Le() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new Le() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new Le() }
  },
  gradientmap: {
    gradientMap: { value: null }
  },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new Se(16777215) }
  },
  lights: {
    ambientLightColor: { value: [] },
    lightProbe: { value: [] },
    directionalLights: { value: [], properties: {
      direction: {},
      color: {}
    } },
    directionalLightShadows: { value: [], properties: {
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    directionalShadowMap: { value: [] },
    directionalShadowMatrix: { value: [] },
    spotLights: { value: [], properties: {
      color: {},
      position: {},
      direction: {},
      distance: {},
      coneCos: {},
      penumbraCos: {},
      decay: {}
    } },
    spotLightShadows: { value: [], properties: {
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    spotLightMap: { value: [] },
    spotShadowMap: { value: [] },
    spotLightMatrix: { value: [] },
    pointLights: { value: [], properties: {
      color: {},
      position: {},
      decay: {},
      distance: {}
    } },
    pointLightShadows: { value: [], properties: {
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {},
      shadowCameraNear: {},
      shadowCameraFar: {}
    } },
    pointShadowMap: { value: [] },
    pointShadowMatrix: { value: [] },
    hemisphereLights: { value: [], properties: {
      direction: {},
      skyColor: {},
      groundColor: {}
    } },
    // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
    rectAreaLights: { value: [], properties: {
      color: {},
      position: {},
      width: {},
      height: {}
    } },
    ltc_1: { value: null },
    ltc_2: { value: null }
  },
  points: {
    diffuse: { value: /* @__PURE__ */ new Se(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Le() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new Le() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new Se(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new Me(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Le() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Le() },
    alphaTest: { value: 0 }
  }
}, Gt = {
  basic: {
    uniforms: /* @__PURE__ */ Et([
      re.common,
      re.specularmap,
      re.envmap,
      re.aomap,
      re.lightmap,
      re.fog
    ]),
    vertexShader: Pe.meshbasic_vert,
    fragmentShader: Pe.meshbasic_frag
  },
  lambert: {
    uniforms: /* @__PURE__ */ Et([
      re.common,
      re.specularmap,
      re.envmap,
      re.aomap,
      re.lightmap,
      re.emissivemap,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      re.fog,
      re.lights,
      {
        emissive: { value: /* @__PURE__ */ new Se(0) }
      }
    ]),
    vertexShader: Pe.meshlambert_vert,
    fragmentShader: Pe.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ Et([
      re.common,
      re.specularmap,
      re.envmap,
      re.aomap,
      re.lightmap,
      re.emissivemap,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      re.fog,
      re.lights,
      {
        emissive: { value: /* @__PURE__ */ new Se(0) },
        specular: { value: /* @__PURE__ */ new Se(1118481) },
        shininess: { value: 30 }
      }
    ]),
    vertexShader: Pe.meshphong_vert,
    fragmentShader: Pe.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ Et([
      re.common,
      re.envmap,
      re.aomap,
      re.lightmap,
      re.emissivemap,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      re.roughnessmap,
      re.metalnessmap,
      re.fog,
      re.lights,
      {
        emissive: { value: /* @__PURE__ */ new Se(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Pe.meshphysical_vert,
    fragmentShader: Pe.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ Et([
      re.common,
      re.aomap,
      re.lightmap,
      re.emissivemap,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      re.gradientmap,
      re.fog,
      re.lights,
      {
        emissive: { value: /* @__PURE__ */ new Se(0) }
      }
    ]),
    vertexShader: Pe.meshtoon_vert,
    fragmentShader: Pe.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ Et([
      re.common,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      re.fog,
      {
        matcap: { value: null }
      }
    ]),
    vertexShader: Pe.meshmatcap_vert,
    fragmentShader: Pe.meshmatcap_frag
  },
  points: {
    uniforms: /* @__PURE__ */ Et([
      re.points,
      re.fog
    ]),
    vertexShader: Pe.points_vert,
    fragmentShader: Pe.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ Et([
      re.common,
      re.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),
    vertexShader: Pe.linedashed_vert,
    fragmentShader: Pe.linedashed_frag
  },
  depth: {
    uniforms: /* @__PURE__ */ Et([
      re.common,
      re.displacementmap
    ]),
    vertexShader: Pe.depth_vert,
    fragmentShader: Pe.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ Et([
      re.common,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      {
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Pe.meshnormal_vert,
    fragmentShader: Pe.meshnormal_frag
  },
  sprite: {
    uniforms: /* @__PURE__ */ Et([
      re.sprite,
      re.fog
    ]),
    vertexShader: Pe.sprite_vert,
    fragmentShader: Pe.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new Le() },
      t2D: { value: null },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: Pe.background_vert,
    fragmentShader: Pe.background_frag
  },
  backgroundCube: {
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 },
      backgroundBlurriness: { value: 0 },
      backgroundIntensity: { value: 1 },
      backgroundRotation: { value: /* @__PURE__ */ new Le() }
    },
    vertexShader: Pe.backgroundCube_vert,
    fragmentShader: Pe.backgroundCube_frag
  },
  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1 }
    },
    vertexShader: Pe.cube_vert,
    fragmentShader: Pe.cube_frag
  },
  equirect: {
    uniforms: {
      tEquirect: { value: null }
    },
    vertexShader: Pe.equirect_vert,
    fragmentShader: Pe.equirect_frag
  },
  distanceRGBA: {
    uniforms: /* @__PURE__ */ Et([
      re.common,
      re.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new C() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: Pe.distanceRGBA_vert,
    fragmentShader: Pe.distanceRGBA_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ Et([
      re.lights,
      re.fog,
      {
        color: { value: /* @__PURE__ */ new Se(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Pe.shadow_vert,
    fragmentShader: Pe.shadow_frag
  }
};
Gt.physical = {
  uniforms: /* @__PURE__ */ Et([
    Gt.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: /* @__PURE__ */ new Le() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: /* @__PURE__ */ new Le() },
      clearcoatNormalScale: { value: /* @__PURE__ */ new Me(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new Le() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: /* @__PURE__ */ new Le() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new Le() },
      sheen: { value: 0 },
      sheenColor: { value: /* @__PURE__ */ new Se(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: /* @__PURE__ */ new Le() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: /* @__PURE__ */ new Le() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: /* @__PURE__ */ new Le() },
      transmissionSamplerSize: { value: /* @__PURE__ */ new Me() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: /* @__PURE__ */ new Le() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: /* @__PURE__ */ new Se(0) },
      specularColor: { value: /* @__PURE__ */ new Se(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: /* @__PURE__ */ new Le() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: /* @__PURE__ */ new Le() },
      anisotropyVector: { value: /* @__PURE__ */ new Me() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: /* @__PURE__ */ new Le() }
    }
  ]),
  vertexShader: Pe.meshphysical_vert,
  fragmentShader: Pe.meshphysical_frag
};
const Ps = { r: 0, b: 0, g: 0 }, zn = /* @__PURE__ */ new jt(), $f = /* @__PURE__ */ new Ie();
function Jf(s, e, t, n, i, r, a) {
  const o = new Se(0);
  let c = r === !0 ? 0 : 1, l, h, u = null, d = 0, p = null;
  function g(T) {
    let S = T.isScene === !0 ? T.background : null;
    return S && S.isTexture && (S = (T.backgroundBlurriness > 0 ? t : e).get(S)), S;
  }
  function _(T) {
    let S = !1;
    const A = g(T);
    A === null ? m(o, c) : A && A.isColor && (m(A, 1), S = !0);
    const D = s.xr.getEnvironmentBlendMode();
    D === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : D === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (s.autoClear || S) && s.clear(s.autoClearColor, s.autoClearDepth, s.autoClearStencil);
  }
  function f(T, S) {
    const A = g(S);
    A && (A.isCubeTexture || A.mapping === Js) ? (h === void 0 && (h = new Qe(
      new Di(1, 1, 1),
      new In({
        name: "BackgroundCubeMaterial",
        uniforms: Pi(Gt.backgroundCube.uniforms),
        vertexShader: Gt.backgroundCube.vertexShader,
        fragmentShader: Gt.backgroundCube.fragmentShader,
        side: bt,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(D, R, w) {
      this.matrixWorld.copyPosition(w.matrixWorld);
    }, Object.defineProperty(h.material, "envMap", {
      get: function() {
        return this.uniforms.envMap.value;
      }
    }), i.update(h)), zn.copy(S.backgroundRotation), zn.x *= -1, zn.y *= -1, zn.z *= -1, A.isCubeTexture && A.isRenderTargetTexture === !1 && (zn.y *= -1, zn.z *= -1), h.material.uniforms.envMap.value = A, h.material.uniforms.flipEnvMap.value = A.isCubeTexture && A.isRenderTargetTexture === !1 ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = S.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = S.backgroundIntensity, h.material.uniforms.backgroundRotation.value.setFromMatrix4($f.makeRotationFromEuler(zn)), h.material.toneMapped = qe.getTransfer(A.colorSpace) !== tt, (u !== A || d !== A.version || p !== s.toneMapping) && (h.material.needsUpdate = !0, u = A, d = A.version, p = s.toneMapping), h.layers.enableAll(), T.unshift(h, h.geometry, h.material, 0, 0, null)) : A && A.isTexture && (l === void 0 && (l = new Qe(
      new tr(2, 2),
      new In({
        name: "BackgroundMaterial",
        uniforms: Pi(Gt.background.uniforms),
        vertexShader: Gt.background.vertexShader,
        fragmentShader: Gt.background.fragmentShader,
        side: un,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), l.geometry.deleteAttribute("normal"), Object.defineProperty(l.material, "map", {
      get: function() {
        return this.uniforms.t2D.value;
      }
    }), i.update(l)), l.material.uniforms.t2D.value = A, l.material.uniforms.backgroundIntensity.value = S.backgroundIntensity, l.material.toneMapped = qe.getTransfer(A.colorSpace) !== tt, A.matrixAutoUpdate === !0 && A.updateMatrix(), l.material.uniforms.uvTransform.value.copy(A.matrix), (u !== A || d !== A.version || p !== s.toneMapping) && (l.material.needsUpdate = !0, u = A, d = A.version, p = s.toneMapping), l.layers.enableAll(), T.unshift(l, l.geometry, l.material, 0, 0, null));
  }
  function m(T, S) {
    T.getRGB(Ps, Xc(s)), n.buffers.color.setClear(Ps.r, Ps.g, Ps.b, S, a);
  }
  return {
    getClearColor: function() {
      return o;
    },
    setClearColor: function(T, S = 1) {
      o.set(T), c = S, m(o, c);
    },
    getClearAlpha: function() {
      return c;
    },
    setClearAlpha: function(T) {
      c = T, m(o, c);
    },
    render: _,
    addToRenderList: f
  };
}
function Qf(s, e) {
  const t = s.getParameter(s.MAX_VERTEX_ATTRIBS), n = {}, i = d(null);
  let r = i, a = !1;
  function o(M, O, W, P, q) {
    let X = !1;
    const $ = u(P, W, O);
    r !== $ && (r = $, l(r.object)), X = p(M, P, W, q), X && g(M, P, W, q), q !== null && e.update(q, s.ELEMENT_ARRAY_BUFFER), (X || a) && (a = !1, A(M, O, W, P), q !== null && s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, e.get(q).buffer));
  }
  function c() {
    return s.createVertexArray();
  }
  function l(M) {
    return s.bindVertexArray(M);
  }
  function h(M) {
    return s.deleteVertexArray(M);
  }
  function u(M, O, W) {
    const P = W.wireframe === !0;
    let q = n[M.id];
    q === void 0 && (q = {}, n[M.id] = q);
    let X = q[O.id];
    X === void 0 && (X = {}, q[O.id] = X);
    let $ = X[P];
    return $ === void 0 && ($ = d(c()), X[P] = $), $;
  }
  function d(M) {
    const O = [], W = [], P = [];
    for (let q = 0; q < t; q++)
      O[q] = 0, W[q] = 0, P[q] = 0;
    return {
      // for backward compatibility on non-VAO support browser
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: O,
      enabledAttributes: W,
      attributeDivisors: P,
      object: M,
      attributes: {},
      index: null
    };
  }
  function p(M, O, W, P) {
    const q = r.attributes, X = O.attributes;
    let $ = 0;
    const J = W.getAttributes();
    for (const V in J)
      if (J[V].location >= 0) {
        const Q = q[V];
        let de = X[V];
        if (de === void 0 && (V === "instanceMatrix" && M.instanceMatrix && (de = M.instanceMatrix), V === "instanceColor" && M.instanceColor && (de = M.instanceColor)), Q === void 0 || Q.attribute !== de || de && Q.data !== de.data)
          return !0;
        $++;
      }
    return r.attributesNum !== $ || r.index !== P;
  }
  function g(M, O, W, P) {
    const q = {}, X = O.attributes;
    let $ = 0;
    const J = W.getAttributes();
    for (const V in J)
      if (J[V].location >= 0) {
        let Q = X[V];
        Q === void 0 && (V === "instanceMatrix" && M.instanceMatrix && (Q = M.instanceMatrix), V === "instanceColor" && M.instanceColor && (Q = M.instanceColor));
        const de = {};
        de.attribute = Q, Q && Q.data && (de.data = Q.data), q[V] = de, $++;
      }
    r.attributes = q, r.attributesNum = $, r.index = P;
  }
  function _() {
    const M = r.newAttributes;
    for (let O = 0, W = M.length; O < W; O++)
      M[O] = 0;
  }
  function f(M) {
    m(M, 0);
  }
  function m(M, O) {
    const W = r.newAttributes, P = r.enabledAttributes, q = r.attributeDivisors;
    W[M] = 1, P[M] === 0 && (s.enableVertexAttribArray(M), P[M] = 1), q[M] !== O && (s.vertexAttribDivisor(M, O), q[M] = O);
  }
  function T() {
    const M = r.newAttributes, O = r.enabledAttributes;
    for (let W = 0, P = O.length; W < P; W++)
      O[W] !== M[W] && (s.disableVertexAttribArray(W), O[W] = 0);
  }
  function S(M, O, W, P, q, X, $) {
    $ === !0 ? s.vertexAttribIPointer(M, O, W, q, X) : s.vertexAttribPointer(M, O, W, P, q, X);
  }
  function A(M, O, W, P) {
    _();
    const q = P.attributes, X = W.getAttributes(), $ = O.defaultAttributeValues;
    for (const J in X) {
      const V = X[J];
      if (V.location >= 0) {
        let ee = q[J];
        if (ee === void 0 && (J === "instanceMatrix" && M.instanceMatrix && (ee = M.instanceMatrix), J === "instanceColor" && M.instanceColor && (ee = M.instanceColor)), ee !== void 0) {
          const Q = ee.normalized, de = ee.itemSize, Fe = e.get(ee);
          if (Fe === void 0)
            continue;
          const Ye = Fe.buffer, G = Fe.type, te = Fe.bytesPerElement, he = G === s.INT || G === s.UNSIGNED_INT || ee.gpuType === bc;
          if (ee.isInterleavedBufferAttribute) {
            const se = ee.data, Be = se.stride, De = ee.offset;
            if (se.isInstancedInterleavedBuffer) {
              for (let N = 0; N < V.locationSize; N++)
                m(V.location + N, se.meshPerAttribute);
              M.isInstancedMesh !== !0 && P._maxInstanceCount === void 0 && (P._maxInstanceCount = se.meshPerAttribute * se.count);
            } else
              for (let N = 0; N < V.locationSize; N++)
                f(V.location + N);
            s.bindBuffer(s.ARRAY_BUFFER, Ye);
            for (let N = 0; N < V.locationSize; N++)
              S(
                V.location + N,
                de / V.locationSize,
                G,
                Q,
                Be * te,
                (De + de / V.locationSize * N) * te,
                he
              );
          } else {
            if (ee.isInstancedBufferAttribute) {
              for (let se = 0; se < V.locationSize; se++)
                m(V.location + se, ee.meshPerAttribute);
              M.isInstancedMesh !== !0 && P._maxInstanceCount === void 0 && (P._maxInstanceCount = ee.meshPerAttribute * ee.count);
            } else
              for (let se = 0; se < V.locationSize; se++)
                f(V.location + se);
            s.bindBuffer(s.ARRAY_BUFFER, Ye);
            for (let se = 0; se < V.locationSize; se++)
              S(
                V.location + se,
                de / V.locationSize,
                G,
                Q,
                de * te,
                de / V.locationSize * se * te,
                he
              );
          }
        } else if ($ !== void 0) {
          const Q = $[J];
          if (Q !== void 0)
            switch (Q.length) {
              case 2:
                s.vertexAttrib2fv(V.location, Q);
                break;
              case 3:
                s.vertexAttrib3fv(V.location, Q);
                break;
              case 4:
                s.vertexAttrib4fv(V.location, Q);
                break;
              default:
                s.vertexAttrib1fv(V.location, Q);
            }
        }
      }
    }
    T();
  }
  function D() {
    k();
    for (const M in n) {
      const O = n[M];
      for (const W in O) {
        const P = O[W];
        for (const q in P)
          h(P[q].object), delete P[q];
        delete O[W];
      }
      delete n[M];
    }
  }
  function R(M) {
    if (n[M.id] === void 0)
      return;
    const O = n[M.id];
    for (const W in O) {
      const P = O[W];
      for (const q in P)
        h(P[q].object), delete P[q];
      delete O[W];
    }
    delete n[M.id];
  }
  function w(M) {
    for (const O in n) {
      const W = n[O];
      if (W[M.id] === void 0)
        continue;
      const P = W[M.id];
      for (const q in P)
        h(P[q].object), delete P[q];
      delete W[M.id];
    }
  }
  function k() {
    E(), a = !0, r !== i && (r = i, l(r.object));
  }
  function E() {
    i.geometry = null, i.program = null, i.wireframe = !1;
  }
  return {
    setup: o,
    reset: k,
    resetDefaultState: E,
    dispose: D,
    releaseStatesOfGeometry: R,
    releaseStatesOfProgram: w,
    initAttributes: _,
    enableAttribute: f,
    disableUnusedAttributes: T
  };
}
function ep(s, e, t) {
  let n;
  function i(l) {
    n = l;
  }
  function r(l, h) {
    s.drawArrays(n, l, h), t.update(h, n, 1);
  }
  function a(l, h, u) {
    u !== 0 && (s.drawArraysInstanced(n, l, h, u), t.update(h, n, u));
  }
  function o(l, h, u) {
    if (u === 0)
      return;
    const d = e.get("WEBGL_multi_draw");
    if (d === null)
      for (let p = 0; p < u; p++)
        this.render(l[p], h[p]);
    else {
      d.multiDrawArraysWEBGL(n, l, 0, h, 0, u);
      let p = 0;
      for (let g = 0; g < u; g++)
        p += h[g];
      t.update(p, n, 1);
    }
  }
  function c(l, h, u, d) {
    if (u === 0)
      return;
    const p = e.get("WEBGL_multi_draw");
    if (p === null)
      for (let g = 0; g < l.length; g++)
        a(l[g], h[g], d[g]);
    else {
      p.multiDrawArraysInstancedWEBGL(n, l, 0, h, 0, d, 0, u);
      let g = 0;
      for (let _ = 0; _ < u; _++)
        g += h[_];
      for (let _ = 0; _ < d.length; _++)
        t.update(g, n, d[_]);
    }
  }
  this.setMode = i, this.render = r, this.renderInstances = a, this.renderMultiDraw = o, this.renderMultiDrawInstances = c;
}
function tp(s, e, t, n) {
  let i;
  function r() {
    if (i !== void 0)
      return i;
    if (e.has("EXT_texture_filter_anisotropic") === !0) {
      const R = e.get("EXT_texture_filter_anisotropic");
      i = s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else
      i = 0;
    return i;
  }
  function a(R) {
    return !(R !== zt && n.convert(R) !== s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(R) {
    const w = R === Qs && (e.has("EXT_color_buffer_half_float") || e.has("EXT_color_buffer_float"));
    return !(R !== Ln && n.convert(R) !== s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
    R !== qt && !w);
  }
  function c(R) {
    if (R === "highp") {
      if (s.getShaderPrecisionFormat(s.VERTEX_SHADER, s.HIGH_FLOAT).precision > 0 && s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.HIGH_FLOAT).precision > 0)
        return "highp";
      R = "mediump";
    }
    return R === "mediump" && s.getShaderPrecisionFormat(s.VERTEX_SHADER, s.MEDIUM_FLOAT).precision > 0 && s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let l = t.precision !== void 0 ? t.precision : "highp";
  const h = c(l);
  h !== l && (console.warn("THREE.WebGLRenderer:", l, "not supported, using", h, "instead."), l = h);
  const u = t.logarithmicDepthBuffer === !0, d = s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS), p = s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS), g = s.getParameter(s.MAX_TEXTURE_SIZE), _ = s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE), f = s.getParameter(s.MAX_VERTEX_ATTRIBS), m = s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS), T = s.getParameter(s.MAX_VARYING_VECTORS), S = s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS), A = p > 0, D = s.getParameter(s.MAX_SAMPLES);
  return {
    isWebGL2: !0,
    // keeping this for backwards compatibility
    getMaxAnisotropy: r,
    getMaxPrecision: c,
    textureFormatReadable: a,
    textureTypeReadable: o,
    precision: l,
    logarithmicDepthBuffer: u,
    maxTextures: d,
    maxVertexTextures: p,
    maxTextureSize: g,
    maxCubemapSize: _,
    maxAttributes: f,
    maxVertexUniforms: m,
    maxVaryings: T,
    maxFragmentUniforms: S,
    vertexTextures: A,
    maxSamples: D
  };
}
function np(s) {
  const e = this;
  let t = null, n = 0, i = !1, r = !1;
  const a = new En(), o = new Le(), c = { value: null, needsUpdate: !1 };
  this.uniform = c, this.numPlanes = 0, this.numIntersection = 0, this.init = function(u, d) {
    const p = u.length !== 0 || d || // enable state of previous frame - the clipping code has to
    // run another frame in order to reset the state:
    n !== 0 || i;
    return i = d, n = u.length, p;
  }, this.beginShadows = function() {
    r = !0, h(null);
  }, this.endShadows = function() {
    r = !1;
  }, this.setGlobalState = function(u, d) {
    t = h(u, d, 0);
  }, this.setState = function(u, d, p) {
    const g = u.clippingPlanes, _ = u.clipIntersection, f = u.clipShadows, m = s.get(u);
    if (!i || g === null || g.length === 0 || r && !f)
      r ? h(null) : l();
    else {
      const T = r ? 0 : n, S = T * 4;
      let A = m.clippingState || null;
      c.value = A, A = h(g, d, S, p);
      for (let D = 0; D !== S; ++D)
        A[D] = t[D];
      m.clippingState = A, this.numIntersection = _ ? this.numPlanes : 0, this.numPlanes += T;
    }
  };
  function l() {
    c.value !== t && (c.value = t, c.needsUpdate = n > 0), e.numPlanes = n, e.numIntersection = 0;
  }
  function h(u, d, p, g) {
    const _ = u !== null ? u.length : 0;
    let f = null;
    if (_ !== 0) {
      if (f = c.value, g !== !0 || f === null) {
        const m = p + _ * 4, T = d.matrixWorldInverse;
        o.getNormalMatrix(T), (f === null || f.length < m) && (f = new Float32Array(m));
        for (let S = 0, A = p; S !== _; ++S, A += 4)
          a.copy(u[S]).applyMatrix4(T, o), a.normal.toArray(f, A), f[A + 3] = a.constant;
      }
      c.value = f, c.needsUpdate = !0;
    }
    return e.numPlanes = _, e.numIntersection = 0, f;
  }
}
function ip(s) {
  let e = /* @__PURE__ */ new WeakMap();
  function t(a, o) {
    return o === Zr ? a.mapping = Ti : o === $r && (a.mapping = Ai), a;
  }
  function n(a) {
    if (a && a.isTexture) {
      const o = a.mapping;
      if (o === Zr || o === $r)
        if (e.has(a)) {
          const c = e.get(a).texture;
          return t(c, a.mapping);
        } else {
          const c = a.image;
          if (c && c.height > 0) {
            const l = new fu(c.height);
            return l.fromEquirectangularTexture(s, a), e.set(a, l), a.addEventListener("dispose", i), t(l.texture, a.mapping);
          } else
            return null;
        }
    }
    return a;
  }
  function i(a) {
    const o = a.target;
    o.removeEventListener("dispose", i);
    const c = e.get(o);
    c !== void 0 && (e.delete(o), c.dispose());
  }
  function r() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: n,
    dispose: r
  };
}
class fa extends qc {
  constructor(e = -1, t = 1, n = 1, i = -1, r = 0.1, a = 2e3) {
    super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = n, this.bottom = i, this.near = r, this.far = a, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
  }
  setViewOffset(e, t, n, i, r, a) {
    this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = i, this.view.width = r, this.view.height = a, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, i = (this.top + this.bottom) / 2;
    let r = n - e, a = n + e, o = i + t, c = i - t;
    if (this.view !== null && this.view.enabled) {
      const l = (this.right - this.left) / this.view.fullWidth / this.zoom, h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      r += l * this.view.offsetX, a = r + l * this.view.width, o -= h * this.view.offsetY, c = o - h * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(r, a, o, c, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t;
  }
}
const vi = 4, bo = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], Xn = 20, Lr = /* @__PURE__ */ new fa(), wo = /* @__PURE__ */ new Se();
let Ir = null, Dr = 0, Nr = 0, Ur = !1;
const Gn = (1 + Math.sqrt(5)) / 2, pi = 1 / Gn, Ro = [
  /* @__PURE__ */ new C(-Gn, pi, 0),
  /* @__PURE__ */ new C(Gn, pi, 0),
  /* @__PURE__ */ new C(-pi, 0, Gn),
  /* @__PURE__ */ new C(pi, 0, Gn),
  /* @__PURE__ */ new C(0, Gn, -pi),
  /* @__PURE__ */ new C(0, Gn, pi),
  /* @__PURE__ */ new C(-1, 1, -1),
  /* @__PURE__ */ new C(1, 1, -1),
  /* @__PURE__ */ new C(-1, 1, 1),
  /* @__PURE__ */ new C(1, 1, 1)
];
class ea {
  constructor(e) {
    this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
  }
  /**
   * Generates a PMREM from a supplied Scene, which can be faster than using an
   * image if networking bandwidth is low. Optional sigma specifies a blur radius
   * in radians to be applied to the scene before PMREM generation. Optional near
   * and far planes ensure the scene is rendered in its entirety (the cubeCamera
   * is placed at the origin).
   */
  fromScene(e, t = 0, n = 0.1, i = 100) {
    Ir = this._renderer.getRenderTarget(), Dr = this._renderer.getActiveCubeFace(), Nr = this._renderer.getActiveMipmapLevel(), Ur = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(256);
    const r = this._allocateTargets();
    return r.depthBuffer = !0, this._sceneToCubeUV(e, n, i, r), t > 0 && this._blur(r, 0, 0, t), this._applyPMREM(r), this._cleanup(r), r;
  }
  /**
   * Generates a PMREM from an equirectangular texture, which can be either LDR
   * or HDR. The ideal input image size is 1k (1024 x 512),
   * as this matches best with the 256 x 256 cubemap output.
   * The smallest supported equirectangular image size is 64 x 32.
   */
  fromEquirectangular(e, t = null) {
    return this._fromTexture(e, t);
  }
  /**
   * Generates a PMREM from an cubemap texture, which can be either LDR
   * or HDR. The ideal input cube size is 256 x 256,
   * as this matches best with the 256 x 256 cubemap output.
   * The smallest supported cube size is 16 x 16.
   */
  fromCubemap(e, t = null) {
    return this._fromTexture(e, t);
  }
  /**
   * Pre-compiles the cubemap shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = Lo(), this._compileMaterial(this._cubemapMaterial));
  }
  /**
   * Pre-compiles the equirectangular shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = Po(), this._compileMaterial(this._equirectMaterial));
  }
  /**
   * Disposes of the PMREMGenerator's internal memory. Note that PMREMGenerator is a static class,
   * so you should not need more than one PMREMGenerator object. If you do, calling dispose() on
   * one of them will cause any others to also become unusable.
   */
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  // private interface
  _setSize(e) {
    this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let e = 0; e < this._lodPlanes.length; e++)
      this._lodPlanes[e].dispose();
  }
  _cleanup(e) {
    this._renderer.setRenderTarget(Ir, Dr, Nr), this._renderer.xr.enabled = Ur, e.scissorTest = !1, Ls(e, 0, 0, e.width, e.height);
  }
  _fromTexture(e, t) {
    e.mapping === Ti || e.mapping === Ai ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), Ir = this._renderer.getRenderTarget(), Dr = this._renderer.getActiveCubeFace(), Nr = this._renderer.getActiveMipmapLevel(), Ur = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
    const n = t || this._allocateTargets();
    return this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n;
  }
  _allocateTargets() {
    const e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, n = {
      magFilter: Pt,
      minFilter: Pt,
      generateMipmaps: !1,
      type: Qs,
      format: zt,
      colorSpace: pt,
      depthBuffer: !1
    }, i = Co(e, t, n);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Co(e, t, n);
      const { _lodMax: r } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = sp(r)), this._blurMaterial = rp(r, e, t);
    }
    return i;
  }
  _compileMaterial(e) {
    const t = new Qe(this._lodPlanes[0], e);
    this._renderer.compile(t, Lr);
  }
  _sceneToCubeUV(e, t, n, i) {
    const o = new Tt(90, 1, t, n), c = [1, -1, 1, 1, 1, 1], l = [1, 1, 1, -1, -1, -1], h = this._renderer, u = h.autoClear, d = h.toneMapping;
    h.getClearColor(wo), h.toneMapping = Pn, h.autoClear = !1;
    const p = new wn({
      name: "PMREM.Background",
      side: bt,
      depthWrite: !1,
      depthTest: !1
    }), g = new Qe(new Di(), p);
    let _ = !1;
    const f = e.background;
    f ? f.isColor && (p.color.copy(f), e.background = null, _ = !0) : (p.color.copy(wo), _ = !0);
    for (let m = 0; m < 6; m++) {
      const T = m % 3;
      T === 0 ? (o.up.set(0, c[m], 0), o.lookAt(l[m], 0, 0)) : T === 1 ? (o.up.set(0, 0, c[m]), o.lookAt(0, l[m], 0)) : (o.up.set(0, c[m], 0), o.lookAt(0, 0, l[m]));
      const S = this._cubeSize;
      Ls(i, T * S, m > 2 ? S : 0, S, S), h.setRenderTarget(i), _ && h.render(g, o), h.render(e, o);
    }
    g.geometry.dispose(), g.material.dispose(), h.toneMapping = d, h.autoClear = u, e.background = f;
  }
  _textureToCubeUV(e, t) {
    const n = this._renderer, i = e.mapping === Ti || e.mapping === Ai;
    i ? (this._cubemapMaterial === null && (this._cubemapMaterial = Lo()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Po());
    const r = i ? this._cubemapMaterial : this._equirectMaterial, a = new Qe(this._lodPlanes[0], r), o = r.uniforms;
    o.envMap.value = e;
    const c = this._cubeSize;
    Ls(t, 0, 0, 3 * c, 2 * c), n.setRenderTarget(t), n.render(a, Lr);
  }
  _applyPMREM(e) {
    const t = this._renderer, n = t.autoClear;
    t.autoClear = !1;
    const i = this._lodPlanes.length;
    for (let r = 1; r < i; r++) {
      const a = Math.sqrt(this._sigmas[r] * this._sigmas[r] - this._sigmas[r - 1] * this._sigmas[r - 1]), o = Ro[(i - r - 1) % Ro.length];
      this._blur(e, r - 1, r, a, o);
    }
    t.autoClear = n;
  }
  /**
   * This is a two-pass Gaussian blur for a cubemap. Normally this is done
   * vertically and horizontally, but this breaks down on a cube. Here we apply
   * the blur latitudinally (around the poles), and then longitudinally (towards
   * the poles) to approximate the orthogonally-separable blur. It is least
   * accurate at the poles, but still does a decent job.
   */
  _blur(e, t, n, i, r) {
    const a = this._pingPongRenderTarget;
    this._halfBlur(
      e,
      a,
      t,
      n,
      i,
      "latitudinal",
      r
    ), this._halfBlur(
      a,
      e,
      n,
      n,
      i,
      "longitudinal",
      r
    );
  }
  _halfBlur(e, t, n, i, r, a, o) {
    const c = this._renderer, l = this._blurMaterial;
    a !== "latitudinal" && a !== "longitudinal" && console.error(
      "blur direction must be either latitudinal or longitudinal!"
    );
    const h = 3, u = new Qe(this._lodPlanes[i], l), d = l.uniforms, p = this._sizeLods[n] - 1, g = isFinite(r) ? Math.PI / (2 * p) : 2 * Math.PI / (2 * Xn - 1), _ = r / g, f = isFinite(r) ? 1 + Math.floor(h * _) : Xn;
    f > Xn && console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${Xn}`);
    const m = [];
    let T = 0;
    for (let w = 0; w < Xn; ++w) {
      const k = w / _, E = Math.exp(-k * k / 2);
      m.push(E), w === 0 ? T += E : w < f && (T += 2 * E);
    }
    for (let w = 0; w < m.length; w++)
      m[w] = m[w] / T;
    d.envMap.value = e.texture, d.samples.value = f, d.weights.value = m, d.latitudinal.value = a === "latitudinal", o && (d.poleAxis.value = o);
    const { _lodMax: S } = this;
    d.dTheta.value = g, d.mipInt.value = S - n;
    const A = this._sizeLods[i], D = 3 * A * (i > S - vi ? i - S + vi : 0), R = 4 * (this._cubeSize - A);
    Ls(t, D, R, 3 * A, 2 * A), c.setRenderTarget(t), c.render(u, Lr);
  }
}
function sp(s) {
  const e = [], t = [], n = [];
  let i = s;
  const r = s - vi + 1 + bo.length;
  for (let a = 0; a < r; a++) {
    const o = Math.pow(2, i);
    t.push(o);
    let c = 1 / o;
    a > s - vi ? c = bo[a - s + vi - 1] : a === 0 && (c = 0), n.push(c);
    const l = 1 / (o - 2), h = -l, u = 1 + l, d = [h, h, u, h, u, u, h, h, u, u, h, u], p = 6, g = 6, _ = 3, f = 2, m = 1, T = new Float32Array(_ * g * p), S = new Float32Array(f * g * p), A = new Float32Array(m * g * p);
    for (let R = 0; R < p; R++) {
      const w = R % 3 * 2 / 3 - 1, k = R > 2 ? 0 : -1, E = [
        w,
        k,
        0,
        w + 2 / 3,
        k,
        0,
        w + 2 / 3,
        k + 1,
        0,
        w,
        k,
        0,
        w + 2 / 3,
        k + 1,
        0,
        w,
        k + 1,
        0
      ];
      T.set(E, _ * g * R), S.set(d, f * g * R);
      const M = [R, R, R, R, R, R];
      A.set(M, m * g * R);
    }
    const D = new Vt();
    D.setAttribute("position", new _t(T, _)), D.setAttribute("uv", new _t(S, f)), D.setAttribute("faceIndex", new _t(A, m)), e.push(D), i > vi && i--;
  }
  return { lodPlanes: e, sizeLods: t, sigmas: n };
}
function Co(s, e, t) {
  const n = new Yn(s, e, t);
  return n.texture.mapping = Js, n.texture.name = "PMREM.cubeUv", n.scissorTest = !0, n;
}
function Ls(s, e, t, n, i) {
  s.viewport.set(e, t, n, i), s.scissor.set(e, t, n, i);
}
function rp(s, e, t) {
  const n = new Float32Array(Xn), i = new C(0, 1, 0);
  return new In({
    name: "SphericalGaussianBlur",
    defines: {
      n: Xn,
      CUBEUV_TEXEL_WIDTH: 1 / e,
      CUBEUV_TEXEL_HEIGHT: 1 / t,
      CUBEUV_MAX_MIP: `${s}.0`
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: i }
    },
    vertexShader: pa(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`
    ),
    blending: Cn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Po() {
  return new In({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null }
    },
    vertexShader: pa(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`
    ),
    blending: Cn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Lo() {
  return new In({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: pa(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`
    ),
    blending: Cn,
    depthTest: !1,
    depthWrite: !1
  });
}
function pa() {
  return (
    /* glsl */
    `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`
  );
}
function ap(s) {
  let e = /* @__PURE__ */ new WeakMap(), t = null;
  function n(o) {
    if (o && o.isTexture) {
      const c = o.mapping, l = c === Zr || c === $r, h = c === Ti || c === Ai;
      if (l || h) {
        let u = e.get(o);
        const d = u !== void 0 ? u.texture.pmremVersion : 0;
        if (o.isRenderTargetTexture && o.pmremVersion !== d)
          return t === null && (t = new ea(s)), u = l ? t.fromEquirectangular(o, u) : t.fromCubemap(o, u), u.texture.pmremVersion = o.pmremVersion, e.set(o, u), u.texture;
        if (u !== void 0)
          return u.texture;
        {
          const p = o.image;
          return l && p && p.height > 0 || h && p && i(p) ? (t === null && (t = new ea(s)), u = l ? t.fromEquirectangular(o) : t.fromCubemap(o), u.texture.pmremVersion = o.pmremVersion, e.set(o, u), o.addEventListener("dispose", r), u.texture) : null;
        }
      }
    }
    return o;
  }
  function i(o) {
    let c = 0;
    const l = 6;
    for (let h = 0; h < l; h++)
      o[h] !== void 0 && c++;
    return c === l;
  }
  function r(o) {
    const c = o.target;
    c.removeEventListener("dispose", r);
    const l = e.get(c);
    l !== void 0 && (e.delete(c), l.dispose());
  }
  function a() {
    e = /* @__PURE__ */ new WeakMap(), t !== null && (t.dispose(), t = null);
  }
  return {
    get: n,
    dispose: a
  };
}
function op(s) {
  const e = {};
  function t(n) {
    if (e[n] !== void 0)
      return e[n];
    let i;
    switch (n) {
      case "WEBGL_depth_texture":
        i = s.getExtension("WEBGL_depth_texture") || s.getExtension("MOZ_WEBGL_depth_texture") || s.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        i = s.getExtension("EXT_texture_filter_anisotropic") || s.getExtension("MOZ_EXT_texture_filter_anisotropic") || s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        i = s.getExtension("WEBGL_compressed_texture_s3tc") || s.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        i = s.getExtension("WEBGL_compressed_texture_pvrtc") || s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        i = s.getExtension(n);
    }
    return e[n] = i, i;
  }
  return {
    has: function(n) {
      return t(n) !== null;
    },
    init: function() {
      t("EXT_color_buffer_float"), t("WEBGL_clip_cull_distance"), t("OES_texture_float_linear"), t("EXT_color_buffer_half_float"), t("WEBGL_multisampled_render_to_texture"), t("WEBGL_render_shared_exponent");
    },
    get: function(n) {
      const i = t(n);
      return i === null && console.warn("THREE.WebGLRenderer: " + n + " extension not supported."), i;
    }
  };
}
function cp(s, e, t, n) {
  const i = {}, r = /* @__PURE__ */ new WeakMap();
  function a(u) {
    const d = u.target;
    d.index !== null && e.remove(d.index);
    for (const g in d.attributes)
      e.remove(d.attributes[g]);
    for (const g in d.morphAttributes) {
      const _ = d.morphAttributes[g];
      for (let f = 0, m = _.length; f < m; f++)
        e.remove(_[f]);
    }
    d.removeEventListener("dispose", a), delete i[d.id];
    const p = r.get(d);
    p && (e.remove(p), r.delete(d)), n.releaseStatesOfGeometry(d), d.isInstancedBufferGeometry === !0 && delete d._maxInstanceCount, t.memory.geometries--;
  }
  function o(u, d) {
    return i[d.id] === !0 || (d.addEventListener("dispose", a), i[d.id] = !0, t.memory.geometries++), d;
  }
  function c(u) {
    const d = u.attributes;
    for (const g in d)
      e.update(d[g], s.ARRAY_BUFFER);
    const p = u.morphAttributes;
    for (const g in p) {
      const _ = p[g];
      for (let f = 0, m = _.length; f < m; f++)
        e.update(_[f], s.ARRAY_BUFFER);
    }
  }
  function l(u) {
    const d = [], p = u.index, g = u.attributes.position;
    let _ = 0;
    if (p !== null) {
      const T = p.array;
      _ = p.version;
      for (let S = 0, A = T.length; S < A; S += 3) {
        const D = T[S + 0], R = T[S + 1], w = T[S + 2];
        d.push(D, R, R, w, w, D);
      }
    } else if (g !== void 0) {
      const T = g.array;
      _ = g.version;
      for (let S = 0, A = T.length / 3 - 1; S < A; S += 3) {
        const D = S + 0, R = S + 1, w = S + 2;
        d.push(D, R, R, w, w, D);
      }
    } else
      return;
    const f = new (Fc(d) ? Wc : Gc)(d, 1);
    f.version = _;
    const m = r.get(u);
    m && e.remove(m), r.set(u, f);
  }
  function h(u) {
    const d = r.get(u);
    if (d) {
      const p = u.index;
      p !== null && d.version < p.version && l(u);
    } else
      l(u);
    return r.get(u);
  }
  return {
    get: o,
    update: c,
    getWireframeAttribute: h
  };
}
function lp(s, e, t) {
  let n;
  function i(d) {
    n = d;
  }
  let r, a;
  function o(d) {
    r = d.type, a = d.bytesPerElement;
  }
  function c(d, p) {
    s.drawElements(n, p, r, d * a), t.update(p, n, 1);
  }
  function l(d, p, g) {
    g !== 0 && (s.drawElementsInstanced(n, p, r, d * a, g), t.update(p, n, g));
  }
  function h(d, p, g) {
    if (g === 0)
      return;
    const _ = e.get("WEBGL_multi_draw");
    if (_ === null)
      for (let f = 0; f < g; f++)
        this.render(d[f] / a, p[f]);
    else {
      _.multiDrawElementsWEBGL(n, p, 0, r, d, 0, g);
      let f = 0;
      for (let m = 0; m < g; m++)
        f += p[m];
      t.update(f, n, 1);
    }
  }
  function u(d, p, g, _) {
    if (g === 0)
      return;
    const f = e.get("WEBGL_multi_draw");
    if (f === null)
      for (let m = 0; m < d.length; m++)
        l(d[m] / a, p[m], _[m]);
    else {
      f.multiDrawElementsInstancedWEBGL(n, p, 0, r, d, 0, _, 0, g);
      let m = 0;
      for (let T = 0; T < g; T++)
        m += p[T];
      for (let T = 0; T < _.length; T++)
        t.update(m, n, _[T]);
    }
  }
  this.setMode = i, this.setIndex = o, this.render = c, this.renderInstances = l, this.renderMultiDraw = h, this.renderMultiDrawInstances = u;
}
function hp(s) {
  const e = {
    geometries: 0,
    textures: 0
  }, t = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };
  function n(r, a, o) {
    switch (t.calls++, a) {
      case s.TRIANGLES:
        t.triangles += o * (r / 3);
        break;
      case s.LINES:
        t.lines += o * (r / 2);
        break;
      case s.LINE_STRIP:
        t.lines += o * (r - 1);
        break;
      case s.LINE_LOOP:
        t.lines += o * r;
        break;
      case s.POINTS:
        t.points += o * r;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function i() {
    t.calls = 0, t.triangles = 0, t.points = 0, t.lines = 0;
  }
  return {
    memory: e,
    render: t,
    programs: null,
    autoReset: !0,
    reset: i,
    update: n
  };
}
function up(s, e, t) {
  const n = /* @__PURE__ */ new WeakMap(), i = new Je();
  function r(a, o, c) {
    const l = a.morphTargetInfluences, h = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, u = h !== void 0 ? h.length : 0;
    let d = n.get(o);
    if (d === void 0 || d.count !== u) {
      let M = function() {
        k.dispose(), n.delete(o), o.removeEventListener("dispose", M);
      };
      var p = M;
      d !== void 0 && d.texture.dispose();
      const g = o.morphAttributes.position !== void 0, _ = o.morphAttributes.normal !== void 0, f = o.morphAttributes.color !== void 0, m = o.morphAttributes.position || [], T = o.morphAttributes.normal || [], S = o.morphAttributes.color || [];
      let A = 0;
      g === !0 && (A = 1), _ === !0 && (A = 2), f === !0 && (A = 3);
      let D = o.attributes.position.count * A, R = 1;
      D > e.maxTextureSize && (R = Math.ceil(D / e.maxTextureSize), D = e.maxTextureSize);
      const w = new Float32Array(D * R * 4 * u), k = new zc(w, D, R, u);
      k.type = qt, k.needsUpdate = !0;
      const E = A * 4;
      for (let O = 0; O < u; O++) {
        const W = m[O], P = T[O], q = S[O], X = D * R * 4 * O;
        for (let $ = 0; $ < W.count; $++) {
          const J = $ * E;
          g === !0 && (i.fromBufferAttribute(W, $), w[X + J + 0] = i.x, w[X + J + 1] = i.y, w[X + J + 2] = i.z, w[X + J + 3] = 0), _ === !0 && (i.fromBufferAttribute(P, $), w[X + J + 4] = i.x, w[X + J + 5] = i.y, w[X + J + 6] = i.z, w[X + J + 7] = 0), f === !0 && (i.fromBufferAttribute(q, $), w[X + J + 8] = i.x, w[X + J + 9] = i.y, w[X + J + 10] = i.z, w[X + J + 11] = q.itemSize === 4 ? i.w : 1);
        }
      }
      d = {
        count: u,
        texture: k,
        size: new Me(D, R)
      }, n.set(o, d), o.addEventListener("dispose", M);
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null)
      c.getUniforms().setValue(s, "morphTexture", a.morphTexture, t);
    else {
      let g = 0;
      for (let f = 0; f < l.length; f++)
        g += l[f];
      const _ = o.morphTargetsRelative ? 1 : 1 - g;
      c.getUniforms().setValue(s, "morphTargetBaseInfluence", _), c.getUniforms().setValue(s, "morphTargetInfluences", l);
    }
    c.getUniforms().setValue(s, "morphTargetsTexture", d.texture, t), c.getUniforms().setValue(s, "morphTargetsTextureSize", d.size);
  }
  return {
    update: r
  };
}
function dp(s, e, t, n) {
  let i = /* @__PURE__ */ new WeakMap();
  function r(c) {
    const l = n.render.frame, h = c.geometry, u = e.get(c, h);
    if (i.get(u) !== l && (e.update(u), i.set(u, l)), c.isInstancedMesh && (c.hasEventListener("dispose", o) === !1 && c.addEventListener("dispose", o), i.get(c) !== l && (t.update(c.instanceMatrix, s.ARRAY_BUFFER), c.instanceColor !== null && t.update(c.instanceColor, s.ARRAY_BUFFER), i.set(c, l))), c.isSkinnedMesh) {
      const d = c.skeleton;
      i.get(d) !== l && (d.update(), i.set(d, l));
    }
    return u;
  }
  function a() {
    i = /* @__PURE__ */ new WeakMap();
  }
  function o(c) {
    const l = c.target;
    l.removeEventListener("dispose", o), t.remove(l.instanceMatrix), l.instanceColor !== null && t.remove(l.instanceColor);
  }
  return {
    update: r,
    dispose: a
  };
}
class Kc extends ft {
  constructor(e, t, n, i, r, a, o, c, l, h) {
    if (h = h !== void 0 ? h : Si, h !== Si && h !== ts)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    n === void 0 && h === Si && (n = wi), n === void 0 && h === ts && (n = as), super(null, i, r, a, o, c, h, n, l), this.isDepthTexture = !0, this.image = { width: e, height: t }, this.magFilter = o !== void 0 ? o : At, this.minFilter = c !== void 0 ? c : At, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(e) {
    return super.copy(e), this.compareFunction = e.compareFunction, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.compareFunction !== null && (t.compareFunction = this.compareFunction), t;
  }
}
const Zc = /* @__PURE__ */ new ft(), $c = /* @__PURE__ */ new Kc(1, 1);
$c.compareFunction = Uc;
const Jc = /* @__PURE__ */ new zc(), Qc = /* @__PURE__ */ new $h(), el = /* @__PURE__ */ new Yc(), Io = [], Do = [], No = new Float32Array(16), Uo = new Float32Array(9), Oo = new Float32Array(4);
function Ni(s, e, t) {
  const n = s[0];
  if (n <= 0 || n > 0)
    return s;
  const i = e * t;
  let r = Io[i];
  if (r === void 0 && (r = new Float32Array(i), Io[i] = r), e !== 0) {
    n.toArray(r, 0);
    for (let a = 1, o = 0; a !== e; ++a)
      o += t, s[a].toArray(r, o);
  }
  return r;
}
function lt(s, e) {
  if (s.length !== e.length)
    return !1;
  for (let t = 0, n = s.length; t < n; t++)
    if (s[t] !== e[t])
      return !1;
  return !0;
}
function ht(s, e) {
  for (let t = 0, n = e.length; t < n; t++)
    s[t] = e[t];
}
function nr(s, e) {
  let t = Do[e];
  t === void 0 && (t = new Int32Array(e), Do[e] = t);
  for (let n = 0; n !== e; ++n)
    t[n] = s.allocateTextureUnit();
  return t;
}
function fp(s, e) {
  const t = this.cache;
  t[0] !== e && (s.uniform1f(this.addr, e), t[0] = e);
}
function pp(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (s.uniform2f(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (lt(t, e))
      return;
    s.uniform2fv(this.addr, e), ht(t, e);
  }
}
function mp(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (s.uniform3f(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else if (e.r !== void 0)
    (t[0] !== e.r || t[1] !== e.g || t[2] !== e.b) && (s.uniform3f(this.addr, e.r, e.g, e.b), t[0] = e.r, t[1] = e.g, t[2] = e.b);
  else {
    if (lt(t, e))
      return;
    s.uniform3fv(this.addr, e), ht(t, e);
  }
}
function gp(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (s.uniform4f(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (lt(t, e))
      return;
    s.uniform4fv(this.addr, e), ht(t, e);
  }
}
function _p(s, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (lt(t, e))
      return;
    s.uniformMatrix2fv(this.addr, !1, e), ht(t, e);
  } else {
    if (lt(t, n))
      return;
    Oo.set(n), s.uniformMatrix2fv(this.addr, !1, Oo), ht(t, n);
  }
}
function xp(s, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (lt(t, e))
      return;
    s.uniformMatrix3fv(this.addr, !1, e), ht(t, e);
  } else {
    if (lt(t, n))
      return;
    Uo.set(n), s.uniformMatrix3fv(this.addr, !1, Uo), ht(t, n);
  }
}
function vp(s, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (lt(t, e))
      return;
    s.uniformMatrix4fv(this.addr, !1, e), ht(t, e);
  } else {
    if (lt(t, n))
      return;
    No.set(n), s.uniformMatrix4fv(this.addr, !1, No), ht(t, n);
  }
}
function Mp(s, e) {
  const t = this.cache;
  t[0] !== e && (s.uniform1i(this.addr, e), t[0] = e);
}
function Sp(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (s.uniform2i(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (lt(t, e))
      return;
    s.uniform2iv(this.addr, e), ht(t, e);
  }
}
function yp(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (s.uniform3i(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else {
    if (lt(t, e))
      return;
    s.uniform3iv(this.addr, e), ht(t, e);
  }
}
function Ep(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (s.uniform4i(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (lt(t, e))
      return;
    s.uniform4iv(this.addr, e), ht(t, e);
  }
}
function Tp(s, e) {
  const t = this.cache;
  t[0] !== e && (s.uniform1ui(this.addr, e), t[0] = e);
}
function Ap(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (s.uniform2ui(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (lt(t, e))
      return;
    s.uniform2uiv(this.addr, e), ht(t, e);
  }
}
function bp(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (s.uniform3ui(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else {
    if (lt(t, e))
      return;
    s.uniform3uiv(this.addr, e), ht(t, e);
  }
}
function wp(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (s.uniform4ui(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (lt(t, e))
      return;
    s.uniform4uiv(this.addr, e), ht(t, e);
  }
}
function Rp(s, e, t) {
  const n = this.cache, i = t.allocateTextureUnit();
  n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i);
  const r = this.type === s.SAMPLER_2D_SHADOW ? $c : Zc;
  t.setTexture2D(e || r, i);
}
function Cp(s, e, t) {
  const n = this.cache, i = t.allocateTextureUnit();
  n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i), t.setTexture3D(e || Qc, i);
}
function Pp(s, e, t) {
  const n = this.cache, i = t.allocateTextureUnit();
  n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i), t.setTextureCube(e || el, i);
}
function Lp(s, e, t) {
  const n = this.cache, i = t.allocateTextureUnit();
  n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i), t.setTexture2DArray(e || Jc, i);
}
function Ip(s) {
  switch (s) {
    case 5126:
      return fp;
    case 35664:
      return pp;
    case 35665:
      return mp;
    case 35666:
      return gp;
    case 35674:
      return _p;
    case 35675:
      return xp;
    case 35676:
      return vp;
    case 5124:
    case 35670:
      return Mp;
    case 35667:
    case 35671:
      return Sp;
    case 35668:
    case 35672:
      return yp;
    case 35669:
    case 35673:
      return Ep;
    case 5125:
      return Tp;
    case 36294:
      return Ap;
    case 36295:
      return bp;
    case 36296:
      return wp;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return Rp;
    case 35679:
    case 36299:
    case 36307:
      return Cp;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return Pp;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return Lp;
  }
}
function Dp(s, e) {
  s.uniform1fv(this.addr, e);
}
function Np(s, e) {
  const t = Ni(e, this.size, 2);
  s.uniform2fv(this.addr, t);
}
function Up(s, e) {
  const t = Ni(e, this.size, 3);
  s.uniform3fv(this.addr, t);
}
function Op(s, e) {
  const t = Ni(e, this.size, 4);
  s.uniform4fv(this.addr, t);
}
function Fp(s, e) {
  const t = Ni(e, this.size, 4);
  s.uniformMatrix2fv(this.addr, !1, t);
}
function Bp(s, e) {
  const t = Ni(e, this.size, 9);
  s.uniformMatrix3fv(this.addr, !1, t);
}
function kp(s, e) {
  const t = Ni(e, this.size, 16);
  s.uniformMatrix4fv(this.addr, !1, t);
}
function zp(s, e) {
  s.uniform1iv(this.addr, e);
}
function Hp(s, e) {
  s.uniform2iv(this.addr, e);
}
function Vp(s, e) {
  s.uniform3iv(this.addr, e);
}
function Gp(s, e) {
  s.uniform4iv(this.addr, e);
}
function Wp(s, e) {
  s.uniform1uiv(this.addr, e);
}
function Xp(s, e) {
  s.uniform2uiv(this.addr, e);
}
function qp(s, e) {
  s.uniform3uiv(this.addr, e);
}
function Yp(s, e) {
  s.uniform4uiv(this.addr, e);
}
function jp(s, e, t) {
  const n = this.cache, i = e.length, r = nr(t, i);
  lt(n, r) || (s.uniform1iv(this.addr, r), ht(n, r));
  for (let a = 0; a !== i; ++a)
    t.setTexture2D(e[a] || Zc, r[a]);
}
function Kp(s, e, t) {
  const n = this.cache, i = e.length, r = nr(t, i);
  lt(n, r) || (s.uniform1iv(this.addr, r), ht(n, r));
  for (let a = 0; a !== i; ++a)
    t.setTexture3D(e[a] || Qc, r[a]);
}
function Zp(s, e, t) {
  const n = this.cache, i = e.length, r = nr(t, i);
  lt(n, r) || (s.uniform1iv(this.addr, r), ht(n, r));
  for (let a = 0; a !== i; ++a)
    t.setTextureCube(e[a] || el, r[a]);
}
function $p(s, e, t) {
  const n = this.cache, i = e.length, r = nr(t, i);
  lt(n, r) || (s.uniform1iv(this.addr, r), ht(n, r));
  for (let a = 0; a !== i; ++a)
    t.setTexture2DArray(e[a] || Jc, r[a]);
}
function Jp(s) {
  switch (s) {
    case 5126:
      return Dp;
    case 35664:
      return Np;
    case 35665:
      return Up;
    case 35666:
      return Op;
    case 35674:
      return Fp;
    case 35675:
      return Bp;
    case 35676:
      return kp;
    case 5124:
    case 35670:
      return zp;
    case 35667:
    case 35671:
      return Hp;
    case 35668:
    case 35672:
      return Vp;
    case 35669:
    case 35673:
      return Gp;
    case 5125:
      return Wp;
    case 36294:
      return Xp;
    case 36295:
      return qp;
    case 36296:
      return Yp;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return jp;
    case 35679:
    case 36299:
    case 36307:
      return Kp;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return Zp;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return $p;
  }
}
class Qp {
  constructor(e, t, n) {
    this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.setValue = Ip(t.type);
  }
}
class em {
  constructor(e, t, n) {
    this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = Jp(t.type);
  }
}
class tm {
  constructor(e) {
    this.id = e, this.seq = [], this.map = {};
  }
  setValue(e, t, n) {
    const i = this.seq;
    for (let r = 0, a = i.length; r !== a; ++r) {
      const o = i[r];
      o.setValue(e, t[o.id], n);
    }
  }
}
const Or = /(\w+)(\])?(\[|\.)?/g;
function Fo(s, e) {
  s.seq.push(e), s.map[e.id] = e;
}
function nm(s, e, t) {
  const n = s.name, i = n.length;
  for (Or.lastIndex = 0; ; ) {
    const r = Or.exec(n), a = Or.lastIndex;
    let o = r[1];
    const c = r[2] === "]", l = r[3];
    if (c && (o = o | 0), l === void 0 || l === "[" && a + 2 === i) {
      Fo(t, l === void 0 ? new Qp(o, s, e) : new em(o, s, e));
      break;
    } else {
      let u = t.map[o];
      u === void 0 && (u = new tm(o), Fo(t, u)), t = u;
    }
  }
}
class Hs {
  constructor(e, t) {
    this.seq = [], this.map = {};
    const n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; ++i) {
      const r = e.getActiveUniform(t, i), a = e.getUniformLocation(t, r.name);
      nm(r, a, this);
    }
  }
  setValue(e, t, n, i) {
    const r = this.map[t];
    r !== void 0 && r.setValue(e, n, i);
  }
  setOptional(e, t, n) {
    const i = t[n];
    i !== void 0 && this.setValue(e, n, i);
  }
  static upload(e, t, n, i) {
    for (let r = 0, a = t.length; r !== a; ++r) {
      const o = t[r], c = n[o.id];
      c.needsUpdate !== !1 && o.setValue(e, c.value, i);
    }
  }
  static seqWithValue(e, t) {
    const n = [];
    for (let i = 0, r = e.length; i !== r; ++i) {
      const a = e[i];
      a.id in t && n.push(a);
    }
    return n;
  }
}
function Bo(s, e, t) {
  const n = s.createShader(e);
  return s.shaderSource(n, t), s.compileShader(n), n;
}
const im = 37297;
let sm = 0;
function rm(s, e) {
  const t = s.split(`
`), n = [], i = Math.max(e - 6, 0), r = Math.min(e + 6, t.length);
  for (let a = i; a < r; a++) {
    const o = a + 1;
    n.push(`${o === e ? ">" : " "} ${o}: ${t[a]}`);
  }
  return n.join(`
`);
}
function am(s) {
  const e = qe.getPrimaries(qe.workingColorSpace), t = qe.getPrimaries(s);
  let n;
  switch (e === t ? n = "" : e === Ys && t === qs ? n = "LinearDisplayP3ToLinearSRGB" : e === qs && t === Ys && (n = "LinearSRGBToLinearDisplayP3"), s) {
    case pt:
    case er:
      return [n, "LinearTransferOETF"];
    case mt:
    case ha:
      return [n, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space:", s), [n, "LinearTransferOETF"];
  }
}
function ko(s, e, t) {
  const n = s.getShaderParameter(e, s.COMPILE_STATUS), i = s.getShaderInfoLog(e).trim();
  if (n && i === "")
    return "";
  const r = /ERROR: 0:(\d+)/.exec(i);
  if (r) {
    const a = parseInt(r[1]);
    return t.toUpperCase() + `

` + i + `

` + rm(s.getShaderSource(e), a);
  } else
    return i;
}
function om(s, e) {
  const t = am(e);
  return `vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`;
}
function cm(s, e) {
  let t;
  switch (e) {
    case $l:
      t = "Linear";
      break;
    case Jl:
      t = "Reinhard";
      break;
    case Ql:
      t = "OptimizedCineon";
      break;
    case eh:
      t = "ACESFilmic";
      break;
    case nh:
      t = "AgX";
      break;
    case ih:
      t = "Neutral";
      break;
    case th:
      t = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", e), t = "Linear";
  }
  return "vec3 " + s + "( vec3 color ) { return " + t + "ToneMapping( color ); }";
}
function lm(s) {
  return [
    s.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
    s.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
  ].filter(Zi).join(`
`);
}
function hm(s) {
  const e = [];
  for (const t in s) {
    const n = s[t];
    n !== !1 && e.push("#define " + t + " " + n);
  }
  return e.join(`
`);
}
function um(s, e) {
  const t = {}, n = s.getProgramParameter(e, s.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < n; i++) {
    const r = s.getActiveAttrib(e, i), a = r.name;
    let o = 1;
    r.type === s.FLOAT_MAT2 && (o = 2), r.type === s.FLOAT_MAT3 && (o = 3), r.type === s.FLOAT_MAT4 && (o = 4), t[a] = {
      type: r.type,
      location: s.getAttribLocation(e, a),
      locationSize: o
    };
  }
  return t;
}
function Zi(s) {
  return s !== "";
}
function zo(s, e) {
  const t = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
  return s.replace(/NUM_DIR_LIGHTS/g, e.numDirLights).replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, t).replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, e.numPointLights).replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
}
function Ho(s, e) {
  return s.replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection);
}
const dm = /^[ \t]*#include +<([\w\d./]+)>/gm;
function ta(s) {
  return s.replace(dm, pm);
}
const fm = /* @__PURE__ */ new Map();
function pm(s, e) {
  let t = Pe[e];
  if (t === void 0) {
    const n = fm.get(e);
    if (n !== void 0)
      t = Pe[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, n);
    else
      throw new Error("Can not resolve #include <" + e + ">");
  }
  return ta(t);
}
const mm = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Vo(s) {
  return s.replace(mm, gm);
}
function gm(s, e, t, n) {
  let i = "";
  for (let r = parseInt(e); r < parseInt(t); r++)
    i += n.replace(/\[\s*i\s*\]/g, "[ " + r + " ]").replace(/UNROLLED_LOOP_INDEX/g, r);
  return i;
}
function Go(s) {
  let e = `precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;
  return s.precision === "highp" ? e += `
#define HIGH_PRECISION` : s.precision === "mediump" ? e += `
#define MEDIUM_PRECISION` : s.precision === "lowp" && (e += `
#define LOW_PRECISION`), e;
}
function _m(s) {
  let e = "SHADOWMAP_TYPE_BASIC";
  return s.shadowMapType === Sc ? e = "SHADOWMAP_TYPE_PCF" : s.shadowMapType === El ? e = "SHADOWMAP_TYPE_PCF_SOFT" : s.shadowMapType === on && (e = "SHADOWMAP_TYPE_VSM"), e;
}
function xm(s) {
  let e = "ENVMAP_TYPE_CUBE";
  if (s.envMap)
    switch (s.envMapMode) {
      case Ti:
      case Ai:
        e = "ENVMAP_TYPE_CUBE";
        break;
      case Js:
        e = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return e;
}
function vm(s) {
  let e = "ENVMAP_MODE_REFLECTION";
  if (s.envMap)
    switch (s.envMapMode) {
      case Ai:
        e = "ENVMAP_MODE_REFRACTION";
        break;
    }
  return e;
}
function Mm(s) {
  let e = "ENVMAP_BLENDING_NONE";
  if (s.envMap)
    switch (s.combine) {
      case yc:
        e = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case Kl:
        e = "ENVMAP_BLENDING_MIX";
        break;
      case Zl:
        e = "ENVMAP_BLENDING_ADD";
        break;
    }
  return e;
}
function Sm(s) {
  const e = s.envMapCubeUVHeight;
  if (e === null)
    return null;
  const t = Math.log2(e) - 2, n = 1 / e;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, t), 7 * 16)), texelHeight: n, maxMip: t };
}
function ym(s, e, t, n) {
  const i = s.getContext(), r = t.defines;
  let a = t.vertexShader, o = t.fragmentShader;
  const c = _m(t), l = xm(t), h = vm(t), u = Mm(t), d = Sm(t), p = lm(t), g = hm(r), _ = i.createProgram();
  let f, m, T = t.glslVersion ? "#version " + t.glslVersion + `
` : "";
  t.isRawShaderMaterial ? (f = [
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    g
  ].filter(Zi).join(`
`), f.length > 0 && (f += `
`), m = [
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    g
  ].filter(Zi).join(`
`), m.length > 0 && (m += `
`)) : (f = [
    Go(t),
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    g,
    t.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    t.batching ? "#define USE_BATCHING" : "",
    t.instancing ? "#define USE_INSTANCING" : "",
    t.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    t.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
    t.useFog && t.fog ? "#define USE_FOG" : "",
    t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
    t.map ? "#define USE_MAP" : "",
    t.envMap ? "#define USE_ENVMAP" : "",
    t.envMap ? "#define " + h : "",
    t.lightMap ? "#define USE_LIGHTMAP" : "",
    t.aoMap ? "#define USE_AOMAP" : "",
    t.bumpMap ? "#define USE_BUMPMAP" : "",
    t.normalMap ? "#define USE_NORMALMAP" : "",
    t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    t.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    t.anisotropy ? "#define USE_ANISOTROPY" : "",
    t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    t.specularMap ? "#define USE_SPECULARMAP" : "",
    t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    t.metalnessMap ? "#define USE_METALNESSMAP" : "",
    t.alphaMap ? "#define USE_ALPHAMAP" : "",
    t.alphaHash ? "#define USE_ALPHAHASH" : "",
    t.transmission ? "#define USE_TRANSMISSION" : "",
    t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    //
    t.mapUv ? "#define MAP_UV " + t.mapUv : "",
    t.alphaMapUv ? "#define ALPHAMAP_UV " + t.alphaMapUv : "",
    t.lightMapUv ? "#define LIGHTMAP_UV " + t.lightMapUv : "",
    t.aoMapUv ? "#define AOMAP_UV " + t.aoMapUv : "",
    t.emissiveMapUv ? "#define EMISSIVEMAP_UV " + t.emissiveMapUv : "",
    t.bumpMapUv ? "#define BUMPMAP_UV " + t.bumpMapUv : "",
    t.normalMapUv ? "#define NORMALMAP_UV " + t.normalMapUv : "",
    t.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + t.displacementMapUv : "",
    t.metalnessMapUv ? "#define METALNESSMAP_UV " + t.metalnessMapUv : "",
    t.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + t.roughnessMapUv : "",
    t.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + t.anisotropyMapUv : "",
    t.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + t.clearcoatMapUv : "",
    t.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + t.clearcoatNormalMapUv : "",
    t.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + t.clearcoatRoughnessMapUv : "",
    t.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + t.iridescenceMapUv : "",
    t.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + t.iridescenceThicknessMapUv : "",
    t.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + t.sheenColorMapUv : "",
    t.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + t.sheenRoughnessMapUv : "",
    t.specularMapUv ? "#define SPECULARMAP_UV " + t.specularMapUv : "",
    t.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + t.specularColorMapUv : "",
    t.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + t.specularIntensityMapUv : "",
    t.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + t.transmissionMapUv : "",
    t.thicknessMapUv ? "#define THICKNESSMAP_UV " + t.thicknessMapUv : "",
    //
    t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
    t.vertexColors ? "#define USE_COLOR" : "",
    t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    t.vertexUv1s ? "#define USE_UV1" : "",
    t.vertexUv2s ? "#define USE_UV2" : "",
    t.vertexUv3s ? "#define USE_UV3" : "",
    t.pointsUvs ? "#define USE_POINTS_UV" : "",
    t.flatShading ? "#define FLAT_SHADED" : "",
    t.skinning ? "#define USE_SKINNING" : "",
    t.morphTargets ? "#define USE_MORPHTARGETS" : "",
    t.morphNormals && t.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
    t.morphColors ? "#define USE_MORPHCOLORS" : "",
    t.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE" : "",
    t.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + t.morphTextureStride : "",
    t.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + t.morphTargetsCount : "",
    t.doubleSided ? "#define DOUBLE_SIDED" : "",
    t.flipSided ? "#define FLIP_SIDED" : "",
    t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    t.shadowMapEnabled ? "#define " + c : "",
    t.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    t.useLegacyLights ? "#define LEGACY_LIGHTS" : "",
    t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "#ifdef USE_INSTANCING_MORPH",
    "	uniform sampler2D morphTexture;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )",
    "	attribute vec3 morphTarget0;",
    "	attribute vec3 morphTarget1;",
    "	attribute vec3 morphTarget2;",
    "	attribute vec3 morphTarget3;",
    "	#ifdef USE_MORPHNORMALS",
    "		attribute vec3 morphNormal0;",
    "		attribute vec3 morphNormal1;",
    "		attribute vec3 morphNormal2;",
    "		attribute vec3 morphNormal3;",
    "	#else",
    "		attribute vec3 morphTarget4;",
    "		attribute vec3 morphTarget5;",
    "		attribute vec3 morphTarget6;",
    "		attribute vec3 morphTarget7;",
    "	#endif",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`
  ].filter(Zi).join(`
`), m = [
    Go(t),
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    g,
    t.useFog && t.fog ? "#define USE_FOG" : "",
    t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
    t.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
    t.map ? "#define USE_MAP" : "",
    t.matcap ? "#define USE_MATCAP" : "",
    t.envMap ? "#define USE_ENVMAP" : "",
    t.envMap ? "#define " + l : "",
    t.envMap ? "#define " + h : "",
    t.envMap ? "#define " + u : "",
    d ? "#define CUBEUV_TEXEL_WIDTH " + d.texelWidth : "",
    d ? "#define CUBEUV_TEXEL_HEIGHT " + d.texelHeight : "",
    d ? "#define CUBEUV_MAX_MIP " + d.maxMip + ".0" : "",
    t.lightMap ? "#define USE_LIGHTMAP" : "",
    t.aoMap ? "#define USE_AOMAP" : "",
    t.bumpMap ? "#define USE_BUMPMAP" : "",
    t.normalMap ? "#define USE_NORMALMAP" : "",
    t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    t.anisotropy ? "#define USE_ANISOTROPY" : "",
    t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    t.clearcoat ? "#define USE_CLEARCOAT" : "",
    t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    t.dispersion ? "#define USE_DISPERSION" : "",
    t.iridescence ? "#define USE_IRIDESCENCE" : "",
    t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    t.specularMap ? "#define USE_SPECULARMAP" : "",
    t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    t.metalnessMap ? "#define USE_METALNESSMAP" : "",
    t.alphaMap ? "#define USE_ALPHAMAP" : "",
    t.alphaTest ? "#define USE_ALPHATEST" : "",
    t.alphaHash ? "#define USE_ALPHAHASH" : "",
    t.sheen ? "#define USE_SHEEN" : "",
    t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    t.transmission ? "#define USE_TRANSMISSION" : "",
    t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
    t.vertexColors || t.instancingColor ? "#define USE_COLOR" : "",
    t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    t.vertexUv1s ? "#define USE_UV1" : "",
    t.vertexUv2s ? "#define USE_UV2" : "",
    t.vertexUv3s ? "#define USE_UV3" : "",
    t.pointsUvs ? "#define USE_POINTS_UV" : "",
    t.gradientMap ? "#define USE_GRADIENTMAP" : "",
    t.flatShading ? "#define FLAT_SHADED" : "",
    t.doubleSided ? "#define DOUBLE_SIDED" : "",
    t.flipSided ? "#define FLIP_SIDED" : "",
    t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    t.shadowMapEnabled ? "#define " + c : "",
    t.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    t.useLegacyLights ? "#define LEGACY_LIGHTS" : "",
    t.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    t.toneMapping !== Pn ? "#define TONE_MAPPING" : "",
    t.toneMapping !== Pn ? Pe.tonemapping_pars_fragment : "",
    // this code is required here because it is used by the toneMapping() function defined below
    t.toneMapping !== Pn ? cm("toneMapping", t.toneMapping) : "",
    t.dithering ? "#define DITHERING" : "",
    t.opaque ? "#define OPAQUE" : "",
    Pe.colorspace_pars_fragment,
    // this code is required here because it is used by the various encoding/decoding function defined below
    om("linearToOutputTexel", t.outputColorSpace),
    t.useDepthPacking ? "#define DEPTH_PACKING " + t.depthPacking : "",
    `
`
  ].filter(Zi).join(`
`)), a = ta(a), a = zo(a, t), a = Ho(a, t), o = ta(o), o = zo(o, t), o = Ho(o, t), a = Vo(a), o = Vo(o), t.isRawShaderMaterial !== !0 && (T = `#version 300 es
`, f = [
    p,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + f, m = [
    "#define varying in",
    t.glslVersion === so ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    t.glslVersion === so ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"
  ].join(`
`) + `
` + m);
  const S = T + f + a, A = T + m + o, D = Bo(i, i.VERTEX_SHADER, S), R = Bo(i, i.FRAGMENT_SHADER, A);
  i.attachShader(_, D), i.attachShader(_, R), t.index0AttributeName !== void 0 ? i.bindAttribLocation(_, 0, t.index0AttributeName) : t.morphTargets === !0 && i.bindAttribLocation(_, 0, "position"), i.linkProgram(_);
  function w(O) {
    if (s.debug.checkShaderErrors) {
      const W = i.getProgramInfoLog(_).trim(), P = i.getShaderInfoLog(D).trim(), q = i.getShaderInfoLog(R).trim();
      let X = !0, $ = !0;
      if (i.getProgramParameter(_, i.LINK_STATUS) === !1)
        if (X = !1, typeof s.debug.onShaderError == "function")
          s.debug.onShaderError(i, _, D, R);
        else {
          const J = ko(i, D, "vertex"), V = ko(i, R, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " + i.getError() + " - VALIDATE_STATUS " + i.getProgramParameter(_, i.VALIDATE_STATUS) + `

Material Name: ` + O.name + `
Material Type: ` + O.type + `

Program Info Log: ` + W + `
` + J + `
` + V
          );
        }
      else
        W !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", W) : (P === "" || q === "") && ($ = !1);
      $ && (O.diagnostics = {
        runnable: X,
        programLog: W,
        vertexShader: {
          log: P,
          prefix: f
        },
        fragmentShader: {
          log: q,
          prefix: m
        }
      });
    }
    i.deleteShader(D), i.deleteShader(R), k = new Hs(i, _), E = um(i, _);
  }
  let k;
  this.getUniforms = function() {
    return k === void 0 && w(this), k;
  };
  let E;
  this.getAttributes = function() {
    return E === void 0 && w(this), E;
  };
  let M = t.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return M === !1 && (M = i.getProgramParameter(_, im)), M;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), i.deleteProgram(_), this.program = void 0;
  }, this.type = t.shaderType, this.name = t.shaderName, this.id = sm++, this.cacheKey = e, this.usedTimes = 1, this.program = _, this.vertexShader = D, this.fragmentShader = R, this;
}
let Em = 0;
class Tm {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(e) {
    const t = e.vertexShader, n = e.fragmentShader, i = this._getShaderStage(t), r = this._getShaderStage(n), a = this._getShaderCacheForMaterial(e);
    return a.has(i) === !1 && (a.add(i), i.usedTimes++), a.has(r) === !1 && (a.add(r), r.usedTimes++), this;
  }
  remove(e) {
    const t = this.materialCache.get(e);
    for (const n of t)
      n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
    return this.materialCache.delete(e), this;
  }
  getVertexShaderID(e) {
    return this._getShaderStage(e.vertexShader).id;
  }
  getFragmentShaderID(e) {
    return this._getShaderStage(e.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(e) {
    const t = this.materialCache;
    let n = t.get(e);
    return n === void 0 && (n = /* @__PURE__ */ new Set(), t.set(e, n)), n;
  }
  _getShaderStage(e) {
    const t = this.shaderCache;
    let n = t.get(e);
    return n === void 0 && (n = new Am(e), t.set(e, n)), n;
  }
}
class Am {
  constructor(e) {
    this.id = Em++, this.code = e, this.usedTimes = 0;
  }
}
function bm(s, e, t, n, i, r, a) {
  const o = new Hc(), c = new Tm(), l = /* @__PURE__ */ new Set(), h = [], u = i.logarithmicDepthBuffer, d = i.vertexTextures;
  let p = i.precision;
  const g = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite"
  };
  function _(E) {
    return l.add(E), E === 0 ? "uv" : `uv${E}`;
  }
  function f(E, M, O, W, P) {
    const q = W.fog, X = P.geometry, $ = E.isMeshStandardMaterial ? W.environment : null, J = (E.isMeshStandardMaterial ? t : e).get(E.envMap || $), V = J && J.mapping === Js ? J.image.height : null, ee = g[E.type];
    E.precision !== null && (p = i.getMaxPrecision(E.precision), p !== E.precision && console.warn("THREE.WebGLProgram.getParameters:", E.precision, "not supported, using", p, "instead."));
    const Q = X.morphAttributes.position || X.morphAttributes.normal || X.morphAttributes.color, de = Q !== void 0 ? Q.length : 0;
    let Fe = 0;
    X.morphAttributes.position !== void 0 && (Fe = 1), X.morphAttributes.normal !== void 0 && (Fe = 2), X.morphAttributes.color !== void 0 && (Fe = 3);
    let Ye, G, te, he;
    if (ee) {
      const Ge = Gt[ee];
      Ye = Ge.vertexShader, G = Ge.fragmentShader;
    } else
      Ye = E.vertexShader, G = E.fragmentShader, c.update(E), te = c.getVertexShaderID(E), he = c.getFragmentShaderID(E);
    const se = s.getRenderTarget(), Be = P.isInstancedMesh === !0, De = P.isBatchedMesh === !0, N = !!E.map, Ke = !!E.matcap, ge = !!J, Ze = !!E.aoMap, xe = !!E.lightMap, ke = !!E.bumpMap, Ae = !!E.normalMap, He = !!E.displacementMap, nt = !!E.emissiveMap, b = !!E.metalnessMap, v = !!E.roughnessMap, H = E.anisotropy > 0, Y = E.clearcoat > 0, K = E.dispersion > 0, Z = E.iridescence > 0, me = E.sheen > 0, oe = E.transmission > 0, ae = H && !!E.anisotropyMap, ye = Y && !!E.clearcoatMap, ie = Y && !!E.clearcoatNormalMap, pe = Y && !!E.clearcoatRoughnessMap, Ve = Z && !!E.iridescenceMap, _e = Z && !!E.iridescenceThicknessMap, le = me && !!E.sheenColorMap, be = me && !!E.sheenRoughnessMap, Ne = !!E.specularMap, $e = !!E.specularColorMap, Re = !!E.specularIntensityMap, x = oe && !!E.transmissionMap, L = oe && !!E.thicknessMap, U = !!E.gradientMap, j = !!E.alphaMap, ne = E.alphaTest > 0, we = !!E.alphaHash, Ue = !!E.extensions;
    let st = Pn;
    E.toneMapped && (se === null || se.isXRRenderTarget === !0) && (st = s.toneMapping);
    const ut = {
      shaderID: ee,
      shaderType: E.type,
      shaderName: E.name,
      vertexShader: Ye,
      fragmentShader: G,
      defines: E.defines,
      customVertexShaderID: te,
      customFragmentShaderID: he,
      isRawShaderMaterial: E.isRawShaderMaterial === !0,
      glslVersion: E.glslVersion,
      precision: p,
      batching: De,
      instancing: Be,
      instancingColor: Be && P.instanceColor !== null,
      instancingMorph: Be && P.morphTexture !== null,
      supportsVertexTextures: d,
      outputColorSpace: se === null ? s.outputColorSpace : se.isXRRenderTarget === !0 ? se.texture.colorSpace : pt,
      alphaToCoverage: !!E.alphaToCoverage,
      map: N,
      matcap: Ke,
      envMap: ge,
      envMapMode: ge && J.mapping,
      envMapCubeUVHeight: V,
      aoMap: Ze,
      lightMap: xe,
      bumpMap: ke,
      normalMap: Ae,
      displacementMap: d && He,
      emissiveMap: nt,
      normalMapObjectSpace: Ae && E.normalMapType === Sh,
      normalMapTangentSpace: Ae && E.normalMapType === Nc,
      metalnessMap: b,
      roughnessMap: v,
      anisotropy: H,
      anisotropyMap: ae,
      clearcoat: Y,
      clearcoatMap: ye,
      clearcoatNormalMap: ie,
      clearcoatRoughnessMap: pe,
      dispersion: K,
      iridescence: Z,
      iridescenceMap: Ve,
      iridescenceThicknessMap: _e,
      sheen: me,
      sheenColorMap: le,
      sheenRoughnessMap: be,
      specularMap: Ne,
      specularColorMap: $e,
      specularIntensityMap: Re,
      transmission: oe,
      transmissionMap: x,
      thicknessMap: L,
      gradientMap: U,
      opaque: E.transparent === !1 && E.blending === Mi && E.alphaToCoverage === !1,
      alphaMap: j,
      alphaTest: ne,
      alphaHash: we,
      combine: E.combine,
      //
      mapUv: N && _(E.map.channel),
      aoMapUv: Ze && _(E.aoMap.channel),
      lightMapUv: xe && _(E.lightMap.channel),
      bumpMapUv: ke && _(E.bumpMap.channel),
      normalMapUv: Ae && _(E.normalMap.channel),
      displacementMapUv: He && _(E.displacementMap.channel),
      emissiveMapUv: nt && _(E.emissiveMap.channel),
      metalnessMapUv: b && _(E.metalnessMap.channel),
      roughnessMapUv: v && _(E.roughnessMap.channel),
      anisotropyMapUv: ae && _(E.anisotropyMap.channel),
      clearcoatMapUv: ye && _(E.clearcoatMap.channel),
      clearcoatNormalMapUv: ie && _(E.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: pe && _(E.clearcoatRoughnessMap.channel),
      iridescenceMapUv: Ve && _(E.iridescenceMap.channel),
      iridescenceThicknessMapUv: _e && _(E.iridescenceThicknessMap.channel),
      sheenColorMapUv: le && _(E.sheenColorMap.channel),
      sheenRoughnessMapUv: be && _(E.sheenRoughnessMap.channel),
      specularMapUv: Ne && _(E.specularMap.channel),
      specularColorMapUv: $e && _(E.specularColorMap.channel),
      specularIntensityMapUv: Re && _(E.specularIntensityMap.channel),
      transmissionMapUv: x && _(E.transmissionMap.channel),
      thicknessMapUv: L && _(E.thicknessMap.channel),
      alphaMapUv: j && _(E.alphaMap.channel),
      //
      vertexTangents: !!X.attributes.tangent && (Ae || H),
      vertexColors: E.vertexColors,
      vertexAlphas: E.vertexColors === !0 && !!X.attributes.color && X.attributes.color.itemSize === 4,
      pointsUvs: P.isPoints === !0 && !!X.attributes.uv && (N || j),
      fog: !!q,
      useFog: E.fog === !0,
      fogExp2: !!q && q.isFogExp2,
      flatShading: E.flatShading === !0,
      sizeAttenuation: E.sizeAttenuation === !0,
      logarithmicDepthBuffer: u,
      skinning: P.isSkinnedMesh === !0,
      morphTargets: X.morphAttributes.position !== void 0,
      morphNormals: X.morphAttributes.normal !== void 0,
      morphColors: X.morphAttributes.color !== void 0,
      morphTargetsCount: de,
      morphTextureStride: Fe,
      numDirLights: M.directional.length,
      numPointLights: M.point.length,
      numSpotLights: M.spot.length,
      numSpotLightMaps: M.spotLightMap.length,
      numRectAreaLights: M.rectArea.length,
      numHemiLights: M.hemi.length,
      numDirLightShadows: M.directionalShadowMap.length,
      numPointLightShadows: M.pointShadowMap.length,
      numSpotLightShadows: M.spotShadowMap.length,
      numSpotLightShadowsWithMaps: M.numSpotLightShadowsWithMaps,
      numLightProbes: M.numLightProbes,
      numClippingPlanes: a.numPlanes,
      numClipIntersection: a.numIntersection,
      dithering: E.dithering,
      shadowMapEnabled: s.shadowMap.enabled && O.length > 0,
      shadowMapType: s.shadowMap.type,
      toneMapping: st,
      useLegacyLights: s._useLegacyLights,
      decodeVideoTexture: N && E.map.isVideoTexture === !0 && qe.getTransfer(E.map.colorSpace) === tt,
      premultipliedAlpha: E.premultipliedAlpha,
      doubleSided: E.side === Wt,
      flipSided: E.side === bt,
      useDepthPacking: E.depthPacking >= 0,
      depthPacking: E.depthPacking || 0,
      index0AttributeName: E.index0AttributeName,
      extensionClipCullDistance: Ue && E.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: Ue && E.extensions.multiDraw === !0 && n.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: E.customProgramCacheKey()
    };
    return ut.vertexUv1s = l.has(1), ut.vertexUv2s = l.has(2), ut.vertexUv3s = l.has(3), l.clear(), ut;
  }
  function m(E) {
    const M = [];
    if (E.shaderID ? M.push(E.shaderID) : (M.push(E.customVertexShaderID), M.push(E.customFragmentShaderID)), E.defines !== void 0)
      for (const O in E.defines)
        M.push(O), M.push(E.defines[O]);
    return E.isRawShaderMaterial === !1 && (T(M, E), S(M, E), M.push(s.outputColorSpace)), M.push(E.customProgramCacheKey), M.join();
  }
  function T(E, M) {
    E.push(M.precision), E.push(M.outputColorSpace), E.push(M.envMapMode), E.push(M.envMapCubeUVHeight), E.push(M.mapUv), E.push(M.alphaMapUv), E.push(M.lightMapUv), E.push(M.aoMapUv), E.push(M.bumpMapUv), E.push(M.normalMapUv), E.push(M.displacementMapUv), E.push(M.emissiveMapUv), E.push(M.metalnessMapUv), E.push(M.roughnessMapUv), E.push(M.anisotropyMapUv), E.push(M.clearcoatMapUv), E.push(M.clearcoatNormalMapUv), E.push(M.clearcoatRoughnessMapUv), E.push(M.iridescenceMapUv), E.push(M.iridescenceThicknessMapUv), E.push(M.sheenColorMapUv), E.push(M.sheenRoughnessMapUv), E.push(M.specularMapUv), E.push(M.specularColorMapUv), E.push(M.specularIntensityMapUv), E.push(M.transmissionMapUv), E.push(M.thicknessMapUv), E.push(M.combine), E.push(M.fogExp2), E.push(M.sizeAttenuation), E.push(M.morphTargetsCount), E.push(M.morphAttributeCount), E.push(M.numDirLights), E.push(M.numPointLights), E.push(M.numSpotLights), E.push(M.numSpotLightMaps), E.push(M.numHemiLights), E.push(M.numRectAreaLights), E.push(M.numDirLightShadows), E.push(M.numPointLightShadows), E.push(M.numSpotLightShadows), E.push(M.numSpotLightShadowsWithMaps), E.push(M.numLightProbes), E.push(M.shadowMapType), E.push(M.toneMapping), E.push(M.numClippingPlanes), E.push(M.numClipIntersection), E.push(M.depthPacking);
  }
  function S(E, M) {
    o.disableAll(), M.supportsVertexTextures && o.enable(0), M.instancing && o.enable(1), M.instancingColor && o.enable(2), M.instancingMorph && o.enable(3), M.matcap && o.enable(4), M.envMap && o.enable(5), M.normalMapObjectSpace && o.enable(6), M.normalMapTangentSpace && o.enable(7), M.clearcoat && o.enable(8), M.iridescence && o.enable(9), M.alphaTest && o.enable(10), M.vertexColors && o.enable(11), M.vertexAlphas && o.enable(12), M.vertexUv1s && o.enable(13), M.vertexUv2s && o.enable(14), M.vertexUv3s && o.enable(15), M.vertexTangents && o.enable(16), M.anisotropy && o.enable(17), M.alphaHash && o.enable(18), M.batching && o.enable(19), M.dispersion && o.enable(20), E.push(o.mask), o.disableAll(), M.fog && o.enable(0), M.useFog && o.enable(1), M.flatShading && o.enable(2), M.logarithmicDepthBuffer && o.enable(3), M.skinning && o.enable(4), M.morphTargets && o.enable(5), M.morphNormals && o.enable(6), M.morphColors && o.enable(7), M.premultipliedAlpha && o.enable(8), M.shadowMapEnabled && o.enable(9), M.useLegacyLights && o.enable(10), M.doubleSided && o.enable(11), M.flipSided && o.enable(12), M.useDepthPacking && o.enable(13), M.dithering && o.enable(14), M.transmission && o.enable(15), M.sheen && o.enable(16), M.opaque && o.enable(17), M.pointsUvs && o.enable(18), M.decodeVideoTexture && o.enable(19), M.alphaToCoverage && o.enable(20), E.push(o.mask);
  }
  function A(E) {
    const M = g[E.type];
    let O;
    if (M) {
      const W = Gt[M];
      O = lu.clone(W.uniforms);
    } else
      O = E.uniforms;
    return O;
  }
  function D(E, M) {
    let O;
    for (let W = 0, P = h.length; W < P; W++) {
      const q = h[W];
      if (q.cacheKey === M) {
        O = q, ++O.usedTimes;
        break;
      }
    }
    return O === void 0 && (O = new ym(s, M, E, r), h.push(O)), O;
  }
  function R(E) {
    if (--E.usedTimes === 0) {
      const M = h.indexOf(E);
      h[M] = h[h.length - 1], h.pop(), E.destroy();
    }
  }
  function w(E) {
    c.remove(E);
  }
  function k() {
    c.dispose();
  }
  return {
    getParameters: f,
    getProgramCacheKey: m,
    getUniforms: A,
    acquireProgram: D,
    releaseProgram: R,
    releaseShaderCache: w,
    // Exposed for resource monitoring & error feedback via renderer.info:
    programs: h,
    dispose: k
  };
}
function wm() {
  let s = /* @__PURE__ */ new WeakMap();
  function e(r) {
    let a = s.get(r);
    return a === void 0 && (a = {}, s.set(r, a)), a;
  }
  function t(r) {
    s.delete(r);
  }
  function n(r, a, o) {
    s.get(r)[a] = o;
  }
  function i() {
    s = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: e,
    remove: t,
    update: n,
    dispose: i
  };
}
function Rm(s, e) {
  return s.groupOrder !== e.groupOrder ? s.groupOrder - e.groupOrder : s.renderOrder !== e.renderOrder ? s.renderOrder - e.renderOrder : s.material.id !== e.material.id ? s.material.id - e.material.id : s.z !== e.z ? s.z - e.z : s.id - e.id;
}
function Wo(s, e) {
  return s.groupOrder !== e.groupOrder ? s.groupOrder - e.groupOrder : s.renderOrder !== e.renderOrder ? s.renderOrder - e.renderOrder : s.z !== e.z ? e.z - s.z : s.id - e.id;
}
function Xo() {
  const s = [];
  let e = 0;
  const t = [], n = [], i = [];
  function r() {
    e = 0, t.length = 0, n.length = 0, i.length = 0;
  }
  function a(u, d, p, g, _, f) {
    let m = s[e];
    return m === void 0 ? (m = {
      id: u.id,
      object: u,
      geometry: d,
      material: p,
      groupOrder: g,
      renderOrder: u.renderOrder,
      z: _,
      group: f
    }, s[e] = m) : (m.id = u.id, m.object = u, m.geometry = d, m.material = p, m.groupOrder = g, m.renderOrder = u.renderOrder, m.z = _, m.group = f), e++, m;
  }
  function o(u, d, p, g, _, f) {
    const m = a(u, d, p, g, _, f);
    p.transmission > 0 ? n.push(m) : p.transparent === !0 ? i.push(m) : t.push(m);
  }
  function c(u, d, p, g, _, f) {
    const m = a(u, d, p, g, _, f);
    p.transmission > 0 ? n.unshift(m) : p.transparent === !0 ? i.unshift(m) : t.unshift(m);
  }
  function l(u, d) {
    t.length > 1 && t.sort(u || Rm), n.length > 1 && n.sort(d || Wo), i.length > 1 && i.sort(d || Wo);
  }
  function h() {
    for (let u = e, d = s.length; u < d; u++) {
      const p = s[u];
      if (p.id === null)
        break;
      p.id = null, p.object = null, p.geometry = null, p.material = null, p.group = null;
    }
  }
  return {
    opaque: t,
    transmissive: n,
    transparent: i,
    init: r,
    push: o,
    unshift: c,
    finish: h,
    sort: l
  };
}
function Cm() {
  let s = /* @__PURE__ */ new WeakMap();
  function e(n, i) {
    const r = s.get(n);
    let a;
    return r === void 0 ? (a = new Xo(), s.set(n, [a])) : i >= r.length ? (a = new Xo(), r.push(a)) : a = r[i], a;
  }
  function t() {
    s = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: e,
    dispose: t
  };
}
function Pm() {
  const s = {};
  return {
    get: function(e) {
      if (s[e.id] !== void 0)
        return s[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = {
            direction: new C(),
            color: new Se()
          };
          break;
        case "SpotLight":
          t = {
            position: new C(),
            direction: new C(),
            color: new Se(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          t = {
            position: new C(),
            color: new Se(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          t = {
            direction: new C(),
            skyColor: new Se(),
            groundColor: new Se()
          };
          break;
        case "RectAreaLight":
          t = {
            color: new Se(),
            position: new C(),
            halfWidth: new C(),
            halfHeight: new C()
          };
          break;
      }
      return s[e.id] = t, t;
    }
  };
}
function Lm() {
  const s = {};
  return {
    get: function(e) {
      if (s[e.id] !== void 0)
        return s[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = {
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Me()
          };
          break;
        case "SpotLight":
          t = {
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Me()
          };
          break;
        case "PointLight":
          t = {
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Me(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
          break;
      }
      return s[e.id] = t, t;
    }
  };
}
let Im = 0;
function Dm(s, e) {
  return (e.castShadow ? 2 : 0) - (s.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (s.map ? 1 : 0);
}
function Nm(s) {
  const e = new Pm(), t = Lm(), n = {
    version: 0,
    hash: {
      directionalLength: -1,
      pointLength: -1,
      spotLength: -1,
      rectAreaLength: -1,
      hemiLength: -1,
      numDirectionalShadows: -1,
      numPointShadows: -1,
      numSpotShadows: -1,
      numSpotMaps: -1,
      numLightProbes: -1
    },
    ambient: [0, 0, 0],
    probe: [],
    directional: [],
    directionalShadow: [],
    directionalShadowMap: [],
    directionalShadowMatrix: [],
    spot: [],
    spotLightMap: [],
    spotShadow: [],
    spotShadowMap: [],
    spotLightMatrix: [],
    rectArea: [],
    rectAreaLTC1: null,
    rectAreaLTC2: null,
    point: [],
    pointShadow: [],
    pointShadowMap: [],
    pointShadowMatrix: [],
    hemi: [],
    numSpotLightShadowsWithMaps: 0,
    numLightProbes: 0
  };
  for (let l = 0; l < 9; l++)
    n.probe.push(new C());
  const i = new C(), r = new Ie(), a = new Ie();
  function o(l, h) {
    let u = 0, d = 0, p = 0;
    for (let O = 0; O < 9; O++)
      n.probe[O].set(0, 0, 0);
    let g = 0, _ = 0, f = 0, m = 0, T = 0, S = 0, A = 0, D = 0, R = 0, w = 0, k = 0;
    l.sort(Dm);
    const E = h === !0 ? Math.PI : 1;
    for (let O = 0, W = l.length; O < W; O++) {
      const P = l[O], q = P.color, X = P.intensity, $ = P.distance, J = P.shadow && P.shadow.map ? P.shadow.map.texture : null;
      if (P.isAmbientLight)
        u += q.r * X * E, d += q.g * X * E, p += q.b * X * E;
      else if (P.isLightProbe) {
        for (let V = 0; V < 9; V++)
          n.probe[V].addScaledVector(P.sh.coefficients[V], X);
        k++;
      } else if (P.isDirectionalLight) {
        const V = e.get(P);
        if (V.color.copy(P.color).multiplyScalar(P.intensity * E), P.castShadow) {
          const ee = P.shadow, Q = t.get(P);
          Q.shadowBias = ee.bias, Q.shadowNormalBias = ee.normalBias, Q.shadowRadius = ee.radius, Q.shadowMapSize = ee.mapSize, n.directionalShadow[g] = Q, n.directionalShadowMap[g] = J, n.directionalShadowMatrix[g] = P.shadow.matrix, S++;
        }
        n.directional[g] = V, g++;
      } else if (P.isSpotLight) {
        const V = e.get(P);
        V.position.setFromMatrixPosition(P.matrixWorld), V.color.copy(q).multiplyScalar(X * E), V.distance = $, V.coneCos = Math.cos(P.angle), V.penumbraCos = Math.cos(P.angle * (1 - P.penumbra)), V.decay = P.decay, n.spot[f] = V;
        const ee = P.shadow;
        if (P.map && (n.spotLightMap[R] = P.map, R++, ee.updateMatrices(P), P.castShadow && w++), n.spotLightMatrix[f] = ee.matrix, P.castShadow) {
          const Q = t.get(P);
          Q.shadowBias = ee.bias, Q.shadowNormalBias = ee.normalBias, Q.shadowRadius = ee.radius, Q.shadowMapSize = ee.mapSize, n.spotShadow[f] = Q, n.spotShadowMap[f] = J, D++;
        }
        f++;
      } else if (P.isRectAreaLight) {
        const V = e.get(P);
        V.color.copy(q).multiplyScalar(X), V.halfWidth.set(P.width * 0.5, 0, 0), V.halfHeight.set(0, P.height * 0.5, 0), n.rectArea[m] = V, m++;
      } else if (P.isPointLight) {
        const V = e.get(P);
        if (V.color.copy(P.color).multiplyScalar(P.intensity * E), V.distance = P.distance, V.decay = P.decay, P.castShadow) {
          const ee = P.shadow, Q = t.get(P);
          Q.shadowBias = ee.bias, Q.shadowNormalBias = ee.normalBias, Q.shadowRadius = ee.radius, Q.shadowMapSize = ee.mapSize, Q.shadowCameraNear = ee.camera.near, Q.shadowCameraFar = ee.camera.far, n.pointShadow[_] = Q, n.pointShadowMap[_] = J, n.pointShadowMatrix[_] = P.shadow.matrix, A++;
        }
        n.point[_] = V, _++;
      } else if (P.isHemisphereLight) {
        const V = e.get(P);
        V.skyColor.copy(P.color).multiplyScalar(X * E), V.groundColor.copy(P.groundColor).multiplyScalar(X * E), n.hemi[T] = V, T++;
      }
    }
    m > 0 && (s.has("OES_texture_float_linear") === !0 ? (n.rectAreaLTC1 = re.LTC_FLOAT_1, n.rectAreaLTC2 = re.LTC_FLOAT_2) : (n.rectAreaLTC1 = re.LTC_HALF_1, n.rectAreaLTC2 = re.LTC_HALF_2)), n.ambient[0] = u, n.ambient[1] = d, n.ambient[2] = p;
    const M = n.hash;
    (M.directionalLength !== g || M.pointLength !== _ || M.spotLength !== f || M.rectAreaLength !== m || M.hemiLength !== T || M.numDirectionalShadows !== S || M.numPointShadows !== A || M.numSpotShadows !== D || M.numSpotMaps !== R || M.numLightProbes !== k) && (n.directional.length = g, n.spot.length = f, n.rectArea.length = m, n.point.length = _, n.hemi.length = T, n.directionalShadow.length = S, n.directionalShadowMap.length = S, n.pointShadow.length = A, n.pointShadowMap.length = A, n.spotShadow.length = D, n.spotShadowMap.length = D, n.directionalShadowMatrix.length = S, n.pointShadowMatrix.length = A, n.spotLightMatrix.length = D + R - w, n.spotLightMap.length = R, n.numSpotLightShadowsWithMaps = w, n.numLightProbes = k, M.directionalLength = g, M.pointLength = _, M.spotLength = f, M.rectAreaLength = m, M.hemiLength = T, M.numDirectionalShadows = S, M.numPointShadows = A, M.numSpotShadows = D, M.numSpotMaps = R, M.numLightProbes = k, n.version = Im++);
  }
  function c(l, h) {
    let u = 0, d = 0, p = 0, g = 0, _ = 0;
    const f = h.matrixWorldInverse;
    for (let m = 0, T = l.length; m < T; m++) {
      const S = l[m];
      if (S.isDirectionalLight) {
        const A = n.directional[u];
        A.direction.setFromMatrixPosition(S.matrixWorld), i.setFromMatrixPosition(S.target.matrixWorld), A.direction.sub(i), A.direction.transformDirection(f), u++;
      } else if (S.isSpotLight) {
        const A = n.spot[p];
        A.position.setFromMatrixPosition(S.matrixWorld), A.position.applyMatrix4(f), A.direction.setFromMatrixPosition(S.matrixWorld), i.setFromMatrixPosition(S.target.matrixWorld), A.direction.sub(i), A.direction.transformDirection(f), p++;
      } else if (S.isRectAreaLight) {
        const A = n.rectArea[g];
        A.position.setFromMatrixPosition(S.matrixWorld), A.position.applyMatrix4(f), a.identity(), r.copy(S.matrixWorld), r.premultiply(f), a.extractRotation(r), A.halfWidth.set(S.width * 0.5, 0, 0), A.halfHeight.set(0, S.height * 0.5, 0), A.halfWidth.applyMatrix4(a), A.halfHeight.applyMatrix4(a), g++;
      } else if (S.isPointLight) {
        const A = n.point[d];
        A.position.setFromMatrixPosition(S.matrixWorld), A.position.applyMatrix4(f), d++;
      } else if (S.isHemisphereLight) {
        const A = n.hemi[_];
        A.direction.setFromMatrixPosition(S.matrixWorld), A.direction.transformDirection(f), _++;
      }
    }
  }
  return {
    setup: o,
    setupView: c,
    state: n
  };
}
function qo(s) {
  const e = new Nm(s), t = [], n = [];
  function i(h) {
    l.camera = h, t.length = 0, n.length = 0;
  }
  function r(h) {
    t.push(h);
  }
  function a(h) {
    n.push(h);
  }
  function o(h) {
    e.setup(t, h);
  }
  function c(h) {
    e.setupView(t, h);
  }
  const l = {
    lightsArray: t,
    shadowsArray: n,
    camera: null,
    lights: e,
    transmissionRenderTarget: {}
  };
  return {
    init: i,
    state: l,
    setupLights: o,
    setupLightsView: c,
    pushLight: r,
    pushShadow: a
  };
}
function Um(s) {
  let e = /* @__PURE__ */ new WeakMap();
  function t(i, r = 0) {
    const a = e.get(i);
    let o;
    return a === void 0 ? (o = new qo(s), e.set(i, [o])) : r >= a.length ? (o = new qo(s), a.push(o)) : o = a[r], o;
  }
  function n() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    dispose: n
  };
}
class Om extends Yt {
  constructor(e) {
    super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = vh, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
  }
}
class Fm extends Yt {
  constructor(e) {
    super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
  }
}
const Bm = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, km = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function zm(s, e, t) {
  let n = new da();
  const i = new Me(), r = new Me(), a = new Je(), o = new Om({ depthPacking: Mh }), c = new Fm(), l = {}, h = t.maxTextureSize, u = { [un]: bt, [bt]: un, [Wt]: Wt }, d = new In({
    defines: {
      VSM_SAMPLES: 8
    },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new Me() },
      radius: { value: 4 }
    },
    vertexShader: Bm,
    fragmentShader: km
  }), p = d.clone();
  p.defines.HORIZONTAL_PASS = 1;
  const g = new Vt();
  g.setAttribute(
    "position",
    new _t(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const _ = new Qe(g, d), f = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = Sc;
  let m = this.type;
  this.render = function(R, w, k) {
    if (f.enabled === !1 || f.autoUpdate === !1 && f.needsUpdate === !1 || R.length === 0)
      return;
    const E = s.getRenderTarget(), M = s.getActiveCubeFace(), O = s.getActiveMipmapLevel(), W = s.state;
    W.setBlending(Cn), W.buffers.color.setClear(1, 1, 1, 1), W.buffers.depth.setTest(!0), W.setScissorTest(!1);
    const P = m !== on && this.type === on, q = m === on && this.type !== on;
    for (let X = 0, $ = R.length; X < $; X++) {
      const J = R[X], V = J.shadow;
      if (V === void 0) {
        console.warn("THREE.WebGLShadowMap:", J, "has no shadow.");
        continue;
      }
      if (V.autoUpdate === !1 && V.needsUpdate === !1)
        continue;
      i.copy(V.mapSize);
      const ee = V.getFrameExtents();
      if (i.multiply(ee), r.copy(V.mapSize), (i.x > h || i.y > h) && (i.x > h && (r.x = Math.floor(h / ee.x), i.x = r.x * ee.x, V.mapSize.x = r.x), i.y > h && (r.y = Math.floor(h / ee.y), i.y = r.y * ee.y, V.mapSize.y = r.y)), V.map === null || P === !0 || q === !0) {
        const de = this.type !== on ? { minFilter: At, magFilter: At } : {};
        V.map !== null && V.map.dispose(), V.map = new Yn(i.x, i.y, de), V.map.texture.name = J.name + ".shadowMap", V.camera.updateProjectionMatrix();
      }
      s.setRenderTarget(V.map), s.clear();
      const Q = V.getViewportCount();
      for (let de = 0; de < Q; de++) {
        const Fe = V.getViewport(de);
        a.set(
          r.x * Fe.x,
          r.y * Fe.y,
          r.x * Fe.z,
          r.y * Fe.w
        ), W.viewport(a), V.updateMatrices(J, de), n = V.getFrustum(), A(w, k, V.camera, J, this.type);
      }
      V.isPointLightShadow !== !0 && this.type === on && T(V, k), V.needsUpdate = !1;
    }
    m = this.type, f.needsUpdate = !1, s.setRenderTarget(E, M, O);
  };
  function T(R, w) {
    const k = e.update(_);
    d.defines.VSM_SAMPLES !== R.blurSamples && (d.defines.VSM_SAMPLES = R.blurSamples, p.defines.VSM_SAMPLES = R.blurSamples, d.needsUpdate = !0, p.needsUpdate = !0), R.mapPass === null && (R.mapPass = new Yn(i.x, i.y)), d.uniforms.shadow_pass.value = R.map.texture, d.uniforms.resolution.value = R.mapSize, d.uniforms.radius.value = R.radius, s.setRenderTarget(R.mapPass), s.clear(), s.renderBufferDirect(w, null, k, d, _, null), p.uniforms.shadow_pass.value = R.mapPass.texture, p.uniforms.resolution.value = R.mapSize, p.uniforms.radius.value = R.radius, s.setRenderTarget(R.map), s.clear(), s.renderBufferDirect(w, null, k, p, _, null);
  }
  function S(R, w, k, E) {
    let M = null;
    const O = k.isPointLight === !0 ? R.customDistanceMaterial : R.customDepthMaterial;
    if (O !== void 0)
      M = O;
    else if (M = k.isPointLight === !0 ? c : o, s.localClippingEnabled && w.clipShadows === !0 && Array.isArray(w.clippingPlanes) && w.clippingPlanes.length !== 0 || w.displacementMap && w.displacementScale !== 0 || w.alphaMap && w.alphaTest > 0 || w.map && w.alphaTest > 0) {
      const W = M.uuid, P = w.uuid;
      let q = l[W];
      q === void 0 && (q = {}, l[W] = q);
      let X = q[P];
      X === void 0 && (X = M.clone(), q[P] = X, w.addEventListener("dispose", D)), M = X;
    }
    if (M.visible = w.visible, M.wireframe = w.wireframe, E === on ? M.side = w.shadowSide !== null ? w.shadowSide : w.side : M.side = w.shadowSide !== null ? w.shadowSide : u[w.side], M.alphaMap = w.alphaMap, M.alphaTest = w.alphaTest, M.map = w.map, M.clipShadows = w.clipShadows, M.clippingPlanes = w.clippingPlanes, M.clipIntersection = w.clipIntersection, M.displacementMap = w.displacementMap, M.displacementScale = w.displacementScale, M.displacementBias = w.displacementBias, M.wireframeLinewidth = w.wireframeLinewidth, M.linewidth = w.linewidth, k.isPointLight === !0 && M.isMeshDistanceMaterial === !0) {
      const W = s.properties.get(M);
      W.light = k;
    }
    return M;
  }
  function A(R, w, k, E, M) {
    if (R.visible === !1)
      return;
    if (R.layers.test(w.layers) && (R.isMesh || R.isLine || R.isPoints) && (R.castShadow || R.receiveShadow && M === on) && (!R.frustumCulled || n.intersectsObject(R))) {
      R.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse, R.matrixWorld);
      const P = e.update(R), q = R.material;
      if (Array.isArray(q)) {
        const X = P.groups;
        for (let $ = 0, J = X.length; $ < J; $++) {
          const V = X[$], ee = q[V.materialIndex];
          if (ee && ee.visible) {
            const Q = S(R, ee, E, M);
            R.onBeforeShadow(s, R, w, k, P, Q, V), s.renderBufferDirect(k, null, P, Q, R, V), R.onAfterShadow(s, R, w, k, P, Q, V);
          }
        }
      } else if (q.visible) {
        const X = S(R, q, E, M);
        R.onBeforeShadow(s, R, w, k, P, X, null), s.renderBufferDirect(k, null, P, X, R, null), R.onAfterShadow(s, R, w, k, P, X, null);
      }
    }
    const W = R.children;
    for (let P = 0, q = W.length; P < q; P++)
      A(W[P], w, k, E, M);
  }
  function D(R) {
    R.target.removeEventListener("dispose", D);
    for (const k in l) {
      const E = l[k], M = R.target.uuid;
      M in E && (E[M].dispose(), delete E[M]);
    }
  }
}
function Hm(s) {
  function e() {
    let x = !1;
    const L = new Je();
    let U = null;
    const j = new Je(0, 0, 0, 0);
    return {
      setMask: function(ne) {
        U !== ne && !x && (s.colorMask(ne, ne, ne, ne), U = ne);
      },
      setLocked: function(ne) {
        x = ne;
      },
      setClear: function(ne, we, Ue, st, ut) {
        ut === !0 && (ne *= st, we *= st, Ue *= st), L.set(ne, we, Ue, st), j.equals(L) === !1 && (s.clearColor(ne, we, Ue, st), j.copy(L));
      },
      reset: function() {
        x = !1, U = null, j.set(-1, 0, 0, 0);
      }
    };
  }
  function t() {
    let x = !1, L = null, U = null, j = null;
    return {
      setTest: function(ne) {
        ne ? he(s.DEPTH_TEST) : se(s.DEPTH_TEST);
      },
      setMask: function(ne) {
        L !== ne && !x && (s.depthMask(ne), L = ne);
      },
      setFunc: function(ne) {
        if (U !== ne) {
          switch (ne) {
            case Vl:
              s.depthFunc(s.NEVER);
              break;
            case Gl:
              s.depthFunc(s.ALWAYS);
              break;
            case Wl:
              s.depthFunc(s.LESS);
              break;
            case Vs:
              s.depthFunc(s.LEQUAL);
              break;
            case Xl:
              s.depthFunc(s.EQUAL);
              break;
            case ql:
              s.depthFunc(s.GEQUAL);
              break;
            case Yl:
              s.depthFunc(s.GREATER);
              break;
            case jl:
              s.depthFunc(s.NOTEQUAL);
              break;
            default:
              s.depthFunc(s.LEQUAL);
          }
          U = ne;
        }
      },
      setLocked: function(ne) {
        x = ne;
      },
      setClear: function(ne) {
        j !== ne && (s.clearDepth(ne), j = ne);
      },
      reset: function() {
        x = !1, L = null, U = null, j = null;
      }
    };
  }
  function n() {
    let x = !1, L = null, U = null, j = null, ne = null, we = null, Ue = null, st = null, ut = null;
    return {
      setTest: function(Ge) {
        x || (Ge ? he(s.STENCIL_TEST) : se(s.STENCIL_TEST));
      },
      setMask: function(Ge) {
        L !== Ge && !x && (s.stencilMask(Ge), L = Ge);
      },
      setFunc: function(Ge, at, et) {
        (U !== Ge || j !== at || ne !== et) && (s.stencilFunc(Ge, at, et), U = Ge, j = at, ne = et);
      },
      setOp: function(Ge, at, et) {
        (we !== Ge || Ue !== at || st !== et) && (s.stencilOp(Ge, at, et), we = Ge, Ue = at, st = et);
      },
      setLocked: function(Ge) {
        x = Ge;
      },
      setClear: function(Ge) {
        ut !== Ge && (s.clearStencil(Ge), ut = Ge);
      },
      reset: function() {
        x = !1, L = null, U = null, j = null, ne = null, we = null, Ue = null, st = null, ut = null;
      }
    };
  }
  const i = new e(), r = new t(), a = new n(), o = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap();
  let l = {}, h = {}, u = /* @__PURE__ */ new WeakMap(), d = [], p = null, g = !1, _ = null, f = null, m = null, T = null, S = null, A = null, D = null, R = new Se(0, 0, 0), w = 0, k = !1, E = null, M = null, O = null, W = null, P = null;
  const q = s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let X = !1, $ = 0;
  const J = s.getParameter(s.VERSION);
  J.indexOf("WebGL") !== -1 ? ($ = parseFloat(/^WebGL (\d)/.exec(J)[1]), X = $ >= 1) : J.indexOf("OpenGL ES") !== -1 && ($ = parseFloat(/^OpenGL ES (\d)/.exec(J)[1]), X = $ >= 2);
  let V = null, ee = {};
  const Q = s.getParameter(s.SCISSOR_BOX), de = s.getParameter(s.VIEWPORT), Fe = new Je().fromArray(Q), Ye = new Je().fromArray(de);
  function G(x, L, U, j) {
    const ne = new Uint8Array(4), we = s.createTexture();
    s.bindTexture(x, we), s.texParameteri(x, s.TEXTURE_MIN_FILTER, s.NEAREST), s.texParameteri(x, s.TEXTURE_MAG_FILTER, s.NEAREST);
    for (let Ue = 0; Ue < U; Ue++)
      x === s.TEXTURE_3D || x === s.TEXTURE_2D_ARRAY ? s.texImage3D(L, 0, s.RGBA, 1, 1, j, 0, s.RGBA, s.UNSIGNED_BYTE, ne) : s.texImage2D(L + Ue, 0, s.RGBA, 1, 1, 0, s.RGBA, s.UNSIGNED_BYTE, ne);
    return we;
  }
  const te = {};
  te[s.TEXTURE_2D] = G(s.TEXTURE_2D, s.TEXTURE_2D, 1), te[s.TEXTURE_CUBE_MAP] = G(s.TEXTURE_CUBE_MAP, s.TEXTURE_CUBE_MAP_POSITIVE_X, 6), te[s.TEXTURE_2D_ARRAY] = G(s.TEXTURE_2D_ARRAY, s.TEXTURE_2D_ARRAY, 1, 1), te[s.TEXTURE_3D] = G(s.TEXTURE_3D, s.TEXTURE_3D, 1, 1), i.setClear(0, 0, 0, 1), r.setClear(1), a.setClear(0), he(s.DEPTH_TEST), r.setFunc(Vs), ke(!1), Ae(ba), he(s.CULL_FACE), Ze(Cn);
  function he(x) {
    l[x] !== !0 && (s.enable(x), l[x] = !0);
  }
  function se(x) {
    l[x] !== !1 && (s.disable(x), l[x] = !1);
  }
  function Be(x, L) {
    return h[x] !== L ? (s.bindFramebuffer(x, L), h[x] = L, x === s.DRAW_FRAMEBUFFER && (h[s.FRAMEBUFFER] = L), x === s.FRAMEBUFFER && (h[s.DRAW_FRAMEBUFFER] = L), !0) : !1;
  }
  function De(x, L) {
    let U = d, j = !1;
    if (x) {
      U = u.get(L), U === void 0 && (U = [], u.set(L, U));
      const ne = x.textures;
      if (U.length !== ne.length || U[0] !== s.COLOR_ATTACHMENT0) {
        for (let we = 0, Ue = ne.length; we < Ue; we++)
          U[we] = s.COLOR_ATTACHMENT0 + we;
        U.length = ne.length, j = !0;
      }
    } else
      U[0] !== s.BACK && (U[0] = s.BACK, j = !0);
    j && s.drawBuffers(U);
  }
  function N(x) {
    return p !== x ? (s.useProgram(x), p = x, !0) : !1;
  }
  const Ke = {
    [Wn]: s.FUNC_ADD,
    [Al]: s.FUNC_SUBTRACT,
    [bl]: s.FUNC_REVERSE_SUBTRACT
  };
  Ke[wl] = s.MIN, Ke[Rl] = s.MAX;
  const ge = {
    [Cl]: s.ZERO,
    [Pl]: s.ONE,
    [Ll]: s.SRC_COLOR,
    [jr]: s.SRC_ALPHA,
    [Fl]: s.SRC_ALPHA_SATURATE,
    [Ul]: s.DST_COLOR,
    [Dl]: s.DST_ALPHA,
    [Il]: s.ONE_MINUS_SRC_COLOR,
    [Kr]: s.ONE_MINUS_SRC_ALPHA,
    [Ol]: s.ONE_MINUS_DST_COLOR,
    [Nl]: s.ONE_MINUS_DST_ALPHA,
    [Bl]: s.CONSTANT_COLOR,
    [kl]: s.ONE_MINUS_CONSTANT_COLOR,
    [zl]: s.CONSTANT_ALPHA,
    [Hl]: s.ONE_MINUS_CONSTANT_ALPHA
  };
  function Ze(x, L, U, j, ne, we, Ue, st, ut, Ge) {
    if (x === Cn) {
      g === !0 && (se(s.BLEND), g = !1);
      return;
    }
    if (g === !1 && (he(s.BLEND), g = !0), x !== Tl) {
      if (x !== _ || Ge !== k) {
        if ((f !== Wn || S !== Wn) && (s.blendEquation(s.FUNC_ADD), f = Wn, S = Wn), Ge)
          switch (x) {
            case Mi:
              s.blendFuncSeparate(s.ONE, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA);
              break;
            case wa:
              s.blendFunc(s.ONE, s.ONE);
              break;
            case Ra:
              s.blendFuncSeparate(s.ZERO, s.ONE_MINUS_SRC_COLOR, s.ZERO, s.ONE);
              break;
            case Ca:
              s.blendFuncSeparate(s.ZERO, s.SRC_COLOR, s.ZERO, s.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", x);
              break;
          }
        else
          switch (x) {
            case Mi:
              s.blendFuncSeparate(s.SRC_ALPHA, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA);
              break;
            case wa:
              s.blendFunc(s.SRC_ALPHA, s.ONE);
              break;
            case Ra:
              s.blendFuncSeparate(s.ZERO, s.ONE_MINUS_SRC_COLOR, s.ZERO, s.ONE);
              break;
            case Ca:
              s.blendFunc(s.ZERO, s.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", x);
              break;
          }
        m = null, T = null, A = null, D = null, R.set(0, 0, 0), w = 0, _ = x, k = Ge;
      }
      return;
    }
    ne = ne || L, we = we || U, Ue = Ue || j, (L !== f || ne !== S) && (s.blendEquationSeparate(Ke[L], Ke[ne]), f = L, S = ne), (U !== m || j !== T || we !== A || Ue !== D) && (s.blendFuncSeparate(ge[U], ge[j], ge[we], ge[Ue]), m = U, T = j, A = we, D = Ue), (st.equals(R) === !1 || ut !== w) && (s.blendColor(st.r, st.g, st.b, ut), R.copy(st), w = ut), _ = x, k = !1;
  }
  function xe(x, L) {
    x.side === Wt ? se(s.CULL_FACE) : he(s.CULL_FACE);
    let U = x.side === bt;
    L && (U = !U), ke(U), x.blending === Mi && x.transparent === !1 ? Ze(Cn) : Ze(x.blending, x.blendEquation, x.blendSrc, x.blendDst, x.blendEquationAlpha, x.blendSrcAlpha, x.blendDstAlpha, x.blendColor, x.blendAlpha, x.premultipliedAlpha), r.setFunc(x.depthFunc), r.setTest(x.depthTest), r.setMask(x.depthWrite), i.setMask(x.colorWrite);
    const j = x.stencilWrite;
    a.setTest(j), j && (a.setMask(x.stencilWriteMask), a.setFunc(x.stencilFunc, x.stencilRef, x.stencilFuncMask), a.setOp(x.stencilFail, x.stencilZFail, x.stencilZPass)), nt(x.polygonOffset, x.polygonOffsetFactor, x.polygonOffsetUnits), x.alphaToCoverage === !0 ? he(s.SAMPLE_ALPHA_TO_COVERAGE) : se(s.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function ke(x) {
    E !== x && (x ? s.frontFace(s.CW) : s.frontFace(s.CCW), E = x);
  }
  function Ae(x) {
    x !== Sl ? (he(s.CULL_FACE), x !== M && (x === ba ? s.cullFace(s.BACK) : x === yl ? s.cullFace(s.FRONT) : s.cullFace(s.FRONT_AND_BACK))) : se(s.CULL_FACE), M = x;
  }
  function He(x) {
    x !== O && (X && s.lineWidth(x), O = x);
  }
  function nt(x, L, U) {
    x ? (he(s.POLYGON_OFFSET_FILL), (W !== L || P !== U) && (s.polygonOffset(L, U), W = L, P = U)) : se(s.POLYGON_OFFSET_FILL);
  }
  function b(x) {
    x ? he(s.SCISSOR_TEST) : se(s.SCISSOR_TEST);
  }
  function v(x) {
    x === void 0 && (x = s.TEXTURE0 + q - 1), V !== x && (s.activeTexture(x), V = x);
  }
  function H(x, L, U) {
    U === void 0 && (V === null ? U = s.TEXTURE0 + q - 1 : U = V);
    let j = ee[U];
    j === void 0 && (j = { type: void 0, texture: void 0 }, ee[U] = j), (j.type !== x || j.texture !== L) && (V !== U && (s.activeTexture(U), V = U), s.bindTexture(x, L || te[x]), j.type = x, j.texture = L);
  }
  function Y() {
    const x = ee[V];
    x !== void 0 && x.type !== void 0 && (s.bindTexture(x.type, null), x.type = void 0, x.texture = void 0);
  }
  function K() {
    try {
      s.compressedTexImage2D.apply(s, arguments);
    } catch (x) {
      console.error("THREE.WebGLState:", x);
    }
  }
  function Z() {
    try {
      s.compressedTexImage3D.apply(s, arguments);
    } catch (x) {
      console.error("THREE.WebGLState:", x);
    }
  }
  function me() {
    try {
      s.texSubImage2D.apply(s, arguments);
    } catch (x) {
      console.error("THREE.WebGLState:", x);
    }
  }
  function oe() {
    try {
      s.texSubImage3D.apply(s, arguments);
    } catch (x) {
      console.error("THREE.WebGLState:", x);
    }
  }
  function ae() {
    try {
      s.compressedTexSubImage2D.apply(s, arguments);
    } catch (x) {
      console.error("THREE.WebGLState:", x);
    }
  }
  function ye() {
    try {
      s.compressedTexSubImage3D.apply(s, arguments);
    } catch (x) {
      console.error("THREE.WebGLState:", x);
    }
  }
  function ie() {
    try {
      s.texStorage2D.apply(s, arguments);
    } catch (x) {
      console.error("THREE.WebGLState:", x);
    }
  }
  function pe() {
    try {
      s.texStorage3D.apply(s, arguments);
    } catch (x) {
      console.error("THREE.WebGLState:", x);
    }
  }
  function Ve() {
    try {
      s.texImage2D.apply(s, arguments);
    } catch (x) {
      console.error("THREE.WebGLState:", x);
    }
  }
  function _e() {
    try {
      s.texImage3D.apply(s, arguments);
    } catch (x) {
      console.error("THREE.WebGLState:", x);
    }
  }
  function le(x) {
    Fe.equals(x) === !1 && (s.scissor(x.x, x.y, x.z, x.w), Fe.copy(x));
  }
  function be(x) {
    Ye.equals(x) === !1 && (s.viewport(x.x, x.y, x.z, x.w), Ye.copy(x));
  }
  function Ne(x, L) {
    let U = c.get(L);
    U === void 0 && (U = /* @__PURE__ */ new WeakMap(), c.set(L, U));
    let j = U.get(x);
    j === void 0 && (j = s.getUniformBlockIndex(L, x.name), U.set(x, j));
  }
  function $e(x, L) {
    const j = c.get(L).get(x);
    o.get(L) !== j && (s.uniformBlockBinding(L, j, x.__bindingPointIndex), o.set(L, j));
  }
  function Re() {
    s.disable(s.BLEND), s.disable(s.CULL_FACE), s.disable(s.DEPTH_TEST), s.disable(s.POLYGON_OFFSET_FILL), s.disable(s.SCISSOR_TEST), s.disable(s.STENCIL_TEST), s.disable(s.SAMPLE_ALPHA_TO_COVERAGE), s.blendEquation(s.FUNC_ADD), s.blendFunc(s.ONE, s.ZERO), s.blendFuncSeparate(s.ONE, s.ZERO, s.ONE, s.ZERO), s.blendColor(0, 0, 0, 0), s.colorMask(!0, !0, !0, !0), s.clearColor(0, 0, 0, 0), s.depthMask(!0), s.depthFunc(s.LESS), s.clearDepth(1), s.stencilMask(4294967295), s.stencilFunc(s.ALWAYS, 0, 4294967295), s.stencilOp(s.KEEP, s.KEEP, s.KEEP), s.clearStencil(0), s.cullFace(s.BACK), s.frontFace(s.CCW), s.polygonOffset(0, 0), s.activeTexture(s.TEXTURE0), s.bindFramebuffer(s.FRAMEBUFFER, null), s.bindFramebuffer(s.DRAW_FRAMEBUFFER, null), s.bindFramebuffer(s.READ_FRAMEBUFFER, null), s.useProgram(null), s.lineWidth(1), s.scissor(0, 0, s.canvas.width, s.canvas.height), s.viewport(0, 0, s.canvas.width, s.canvas.height), l = {}, V = null, ee = {}, h = {}, u = /* @__PURE__ */ new WeakMap(), d = [], p = null, g = !1, _ = null, f = null, m = null, T = null, S = null, A = null, D = null, R = new Se(0, 0, 0), w = 0, k = !1, E = null, M = null, O = null, W = null, P = null, Fe.set(0, 0, s.canvas.width, s.canvas.height), Ye.set(0, 0, s.canvas.width, s.canvas.height), i.reset(), r.reset(), a.reset();
  }
  return {
    buffers: {
      color: i,
      depth: r,
      stencil: a
    },
    enable: he,
    disable: se,
    bindFramebuffer: Be,
    drawBuffers: De,
    useProgram: N,
    setBlending: Ze,
    setMaterial: xe,
    setFlipSided: ke,
    setCullFace: Ae,
    setLineWidth: He,
    setPolygonOffset: nt,
    setScissorTest: b,
    activeTexture: v,
    bindTexture: H,
    unbindTexture: Y,
    compressedTexImage2D: K,
    compressedTexImage3D: Z,
    texImage2D: Ve,
    texImage3D: _e,
    updateUBOMapping: Ne,
    uniformBlockBinding: $e,
    texStorage2D: ie,
    texStorage3D: pe,
    texSubImage2D: me,
    texSubImage3D: oe,
    compressedTexSubImage2D: ae,
    compressedTexSubImage3D: ye,
    scissor: le,
    viewport: be,
    reset: Re
  };
}
function Vm(s, e, t, n, i, r, a) {
  const o = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null, c = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), l = new Me(), h = /* @__PURE__ */ new WeakMap();
  let u;
  const d = /* @__PURE__ */ new WeakMap();
  let p = !1;
  try {
    p = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function g(b, v) {
    return p ? (
      // eslint-disable-next-line compat/compat
      new OffscreenCanvas(b, v)
    ) : is("canvas");
  }
  function _(b, v, H) {
    let Y = 1;
    const K = nt(b);
    if ((K.width > H || K.height > H) && (Y = H / Math.max(K.width, K.height)), Y < 1)
      if (typeof HTMLImageElement < "u" && b instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && b instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && b instanceof ImageBitmap || typeof VideoFrame < "u" && b instanceof VideoFrame) {
        const Z = Math.floor(Y * K.width), me = Math.floor(Y * K.height);
        u === void 0 && (u = g(Z, me));
        const oe = v ? g(Z, me) : u;
        return oe.width = Z, oe.height = me, oe.getContext("2d").drawImage(b, 0, 0, Z, me), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + K.width + "x" + K.height + ") to (" + Z + "x" + me + ")."), oe;
      } else
        return "data" in b && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + K.width + "x" + K.height + ")."), b;
    return b;
  }
  function f(b) {
    return b.generateMipmaps && b.minFilter !== At && b.minFilter !== Pt;
  }
  function m(b) {
    s.generateMipmap(b);
  }
  function T(b, v, H, Y, K = !1) {
    if (b !== null) {
      if (s[b] !== void 0)
        return s[b];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + b + "'");
    }
    let Z = v;
    if (v === s.RED && (H === s.FLOAT && (Z = s.R32F), H === s.HALF_FLOAT && (Z = s.R16F), H === s.UNSIGNED_BYTE && (Z = s.R8)), v === s.RED_INTEGER && (H === s.UNSIGNED_BYTE && (Z = s.R8UI), H === s.UNSIGNED_SHORT && (Z = s.R16UI), H === s.UNSIGNED_INT && (Z = s.R32UI), H === s.BYTE && (Z = s.R8I), H === s.SHORT && (Z = s.R16I), H === s.INT && (Z = s.R32I)), v === s.RG && (H === s.FLOAT && (Z = s.RG32F), H === s.HALF_FLOAT && (Z = s.RG16F), H === s.UNSIGNED_BYTE && (Z = s.RG8)), v === s.RG_INTEGER && (H === s.UNSIGNED_BYTE && (Z = s.RG8UI), H === s.UNSIGNED_SHORT && (Z = s.RG16UI), H === s.UNSIGNED_INT && (Z = s.RG32UI), H === s.BYTE && (Z = s.RG8I), H === s.SHORT && (Z = s.RG16I), H === s.INT && (Z = s.RG32I)), v === s.RGB && H === s.UNSIGNED_INT_5_9_9_9_REV && (Z = s.RGB9_E5), v === s.RGBA) {
      const me = K ? Xs : qe.getTransfer(Y);
      H === s.FLOAT && (Z = s.RGBA32F), H === s.HALF_FLOAT && (Z = s.RGBA16F), H === s.UNSIGNED_BYTE && (Z = me === tt ? s.SRGB8_ALPHA8 : s.RGBA8), H === s.UNSIGNED_SHORT_4_4_4_4 && (Z = s.RGBA4), H === s.UNSIGNED_SHORT_5_5_5_1 && (Z = s.RGB5_A1);
    }
    return (Z === s.R16F || Z === s.R32F || Z === s.RG16F || Z === s.RG32F || Z === s.RGBA16F || Z === s.RGBA32F) && e.get("EXT_color_buffer_float"), Z;
  }
  function S(b, v) {
    return f(b) === !0 || b.isFramebufferTexture && b.minFilter !== At && b.minFilter !== Pt ? Math.log2(Math.max(v.width, v.height)) + 1 : b.mipmaps !== void 0 && b.mipmaps.length > 0 ? b.mipmaps.length : b.isCompressedTexture && Array.isArray(b.image) ? v.mipmaps.length : 1;
  }
  function A(b) {
    const v = b.target;
    v.removeEventListener("dispose", A), R(v), v.isVideoTexture && h.delete(v);
  }
  function D(b) {
    const v = b.target;
    v.removeEventListener("dispose", D), k(v);
  }
  function R(b) {
    const v = n.get(b);
    if (v.__webglInit === void 0)
      return;
    const H = b.source, Y = d.get(H);
    if (Y) {
      const K = Y[v.__cacheKey];
      K.usedTimes--, K.usedTimes === 0 && w(b), Object.keys(Y).length === 0 && d.delete(H);
    }
    n.remove(b);
  }
  function w(b) {
    const v = n.get(b);
    s.deleteTexture(v.__webglTexture);
    const H = b.source, Y = d.get(H);
    delete Y[v.__cacheKey], a.memory.textures--;
  }
  function k(b) {
    const v = n.get(b);
    if (b.depthTexture && b.depthTexture.dispose(), b.isWebGLCubeRenderTarget)
      for (let Y = 0; Y < 6; Y++) {
        if (Array.isArray(v.__webglFramebuffer[Y]))
          for (let K = 0; K < v.__webglFramebuffer[Y].length; K++)
            s.deleteFramebuffer(v.__webglFramebuffer[Y][K]);
        else
          s.deleteFramebuffer(v.__webglFramebuffer[Y]);
        v.__webglDepthbuffer && s.deleteRenderbuffer(v.__webglDepthbuffer[Y]);
      }
    else {
      if (Array.isArray(v.__webglFramebuffer))
        for (let Y = 0; Y < v.__webglFramebuffer.length; Y++)
          s.deleteFramebuffer(v.__webglFramebuffer[Y]);
      else
        s.deleteFramebuffer(v.__webglFramebuffer);
      if (v.__webglDepthbuffer && s.deleteRenderbuffer(v.__webglDepthbuffer), v.__webglMultisampledFramebuffer && s.deleteFramebuffer(v.__webglMultisampledFramebuffer), v.__webglColorRenderbuffer)
        for (let Y = 0; Y < v.__webglColorRenderbuffer.length; Y++)
          v.__webglColorRenderbuffer[Y] && s.deleteRenderbuffer(v.__webglColorRenderbuffer[Y]);
      v.__webglDepthRenderbuffer && s.deleteRenderbuffer(v.__webglDepthRenderbuffer);
    }
    const H = b.textures;
    for (let Y = 0, K = H.length; Y < K; Y++) {
      const Z = n.get(H[Y]);
      Z.__webglTexture && (s.deleteTexture(Z.__webglTexture), a.memory.textures--), n.remove(H[Y]);
    }
    n.remove(b);
  }
  let E = 0;
  function M() {
    E = 0;
  }
  function O() {
    const b = E;
    return b >= i.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + b + " texture units while this GPU supports only " + i.maxTextures), E += 1, b;
  }
  function W(b) {
    const v = [];
    return v.push(b.wrapS), v.push(b.wrapT), v.push(b.wrapR || 0), v.push(b.magFilter), v.push(b.minFilter), v.push(b.anisotropy), v.push(b.internalFormat), v.push(b.format), v.push(b.type), v.push(b.generateMipmaps), v.push(b.premultiplyAlpha), v.push(b.flipY), v.push(b.unpackAlignment), v.push(b.colorSpace), v.join();
  }
  function P(b, v) {
    const H = n.get(b);
    if (b.isVideoTexture && Ae(b), b.isRenderTargetTexture === !1 && b.version > 0 && H.__version !== b.version) {
      const Y = b.image;
      if (Y === null)
        console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (Y.complete === !1)
        console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        Fe(H, b, v);
        return;
      }
    }
    t.bindTexture(s.TEXTURE_2D, H.__webglTexture, s.TEXTURE0 + v);
  }
  function q(b, v) {
    const H = n.get(b);
    if (b.version > 0 && H.__version !== b.version) {
      Fe(H, b, v);
      return;
    }
    t.bindTexture(s.TEXTURE_2D_ARRAY, H.__webglTexture, s.TEXTURE0 + v);
  }
  function X(b, v) {
    const H = n.get(b);
    if (b.version > 0 && H.__version !== b.version) {
      Fe(H, b, v);
      return;
    }
    t.bindTexture(s.TEXTURE_3D, H.__webglTexture, s.TEXTURE0 + v);
  }
  function $(b, v) {
    const H = n.get(b);
    if (b.version > 0 && H.__version !== b.version) {
      Ye(H, b, v);
      return;
    }
    t.bindTexture(s.TEXTURE_CUBE_MAP, H.__webglTexture, s.TEXTURE0 + v);
  }
  const J = {
    [bi]: s.REPEAT,
    [bn]: s.CLAMP_TO_EDGE,
    [Gs]: s.MIRRORED_REPEAT
  }, V = {
    [At]: s.NEAREST,
    [Tc]: s.NEAREST_MIPMAP_NEAREST,
    [Ki]: s.NEAREST_MIPMAP_LINEAR,
    [Pt]: s.LINEAR,
    [zs]: s.LINEAR_MIPMAP_NEAREST,
    [cn]: s.LINEAR_MIPMAP_LINEAR
  }, ee = {
    [yh]: s.NEVER,
    [Rh]: s.ALWAYS,
    [Eh]: s.LESS,
    [Uc]: s.LEQUAL,
    [Th]: s.EQUAL,
    [wh]: s.GEQUAL,
    [Ah]: s.GREATER,
    [bh]: s.NOTEQUAL
  };
  function Q(b, v) {
    if (v.type === qt && e.has("OES_texture_float_linear") === !1 && (v.magFilter === Pt || v.magFilter === zs || v.magFilter === Ki || v.magFilter === cn || v.minFilter === Pt || v.minFilter === zs || v.minFilter === Ki || v.minFilter === cn) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), s.texParameteri(b, s.TEXTURE_WRAP_S, J[v.wrapS]), s.texParameteri(b, s.TEXTURE_WRAP_T, J[v.wrapT]), (b === s.TEXTURE_3D || b === s.TEXTURE_2D_ARRAY) && s.texParameteri(b, s.TEXTURE_WRAP_R, J[v.wrapR]), s.texParameteri(b, s.TEXTURE_MAG_FILTER, V[v.magFilter]), s.texParameteri(b, s.TEXTURE_MIN_FILTER, V[v.minFilter]), v.compareFunction && (s.texParameteri(b, s.TEXTURE_COMPARE_MODE, s.COMPARE_REF_TO_TEXTURE), s.texParameteri(b, s.TEXTURE_COMPARE_FUNC, ee[v.compareFunction])), e.has("EXT_texture_filter_anisotropic") === !0) {
      if (v.magFilter === At || v.minFilter !== Ki && v.minFilter !== cn || v.type === qt && e.has("OES_texture_float_linear") === !1)
        return;
      if (v.anisotropy > 1 || n.get(v).__currentAnisotropy) {
        const H = e.get("EXT_texture_filter_anisotropic");
        s.texParameterf(b, H.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(v.anisotropy, i.getMaxAnisotropy())), n.get(v).__currentAnisotropy = v.anisotropy;
      }
    }
  }
  function de(b, v) {
    let H = !1;
    b.__webglInit === void 0 && (b.__webglInit = !0, v.addEventListener("dispose", A));
    const Y = v.source;
    let K = d.get(Y);
    K === void 0 && (K = {}, d.set(Y, K));
    const Z = W(v);
    if (Z !== b.__cacheKey) {
      K[Z] === void 0 && (K[Z] = {
        texture: s.createTexture(),
        usedTimes: 0
      }, a.memory.textures++, H = !0), K[Z].usedTimes++;
      const me = K[b.__cacheKey];
      me !== void 0 && (K[b.__cacheKey].usedTimes--, me.usedTimes === 0 && w(v)), b.__cacheKey = Z, b.__webglTexture = K[Z].texture;
    }
    return H;
  }
  function Fe(b, v, H) {
    let Y = s.TEXTURE_2D;
    (v.isDataArrayTexture || v.isCompressedArrayTexture) && (Y = s.TEXTURE_2D_ARRAY), v.isData3DTexture && (Y = s.TEXTURE_3D);
    const K = de(b, v), Z = v.source;
    t.bindTexture(Y, b.__webglTexture, s.TEXTURE0 + H);
    const me = n.get(Z);
    if (Z.version !== me.__version || K === !0) {
      t.activeTexture(s.TEXTURE0 + H);
      const oe = qe.getPrimaries(qe.workingColorSpace), ae = v.colorSpace === An ? null : qe.getPrimaries(v.colorSpace), ye = v.colorSpace === An || oe === ae ? s.NONE : s.BROWSER_DEFAULT_WEBGL;
      s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, v.flipY), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, v.premultiplyAlpha), s.pixelStorei(s.UNPACK_ALIGNMENT, v.unpackAlignment), s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, ye);
      let ie = _(v.image, !1, i.maxTextureSize);
      ie = He(v, ie);
      const pe = r.convert(v.format, v.colorSpace), Ve = r.convert(v.type);
      let _e = T(v.internalFormat, pe, Ve, v.colorSpace, v.isVideoTexture);
      Q(Y, v);
      let le;
      const be = v.mipmaps, Ne = v.isVideoTexture !== !0, $e = me.__version === void 0 || K === !0, Re = Z.dataReady, x = S(v, ie);
      if (v.isDepthTexture)
        _e = s.DEPTH_COMPONENT16, v.type === qt ? _e = s.DEPTH_COMPONENT32F : v.type === wi ? _e = s.DEPTH_COMPONENT24 : v.type === as && (_e = s.DEPTH24_STENCIL8), $e && (Ne ? t.texStorage2D(s.TEXTURE_2D, 1, _e, ie.width, ie.height) : t.texImage2D(s.TEXTURE_2D, 0, _e, ie.width, ie.height, 0, pe, Ve, null));
      else if (v.isDataTexture)
        if (be.length > 0) {
          Ne && $e && t.texStorage2D(s.TEXTURE_2D, x, _e, be[0].width, be[0].height);
          for (let L = 0, U = be.length; L < U; L++)
            le = be[L], Ne ? Re && t.texSubImage2D(s.TEXTURE_2D, L, 0, 0, le.width, le.height, pe, Ve, le.data) : t.texImage2D(s.TEXTURE_2D, L, _e, le.width, le.height, 0, pe, Ve, le.data);
          v.generateMipmaps = !1;
        } else
          Ne ? ($e && t.texStorage2D(s.TEXTURE_2D, x, _e, ie.width, ie.height), Re && t.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, ie.width, ie.height, pe, Ve, ie.data)) : t.texImage2D(s.TEXTURE_2D, 0, _e, ie.width, ie.height, 0, pe, Ve, ie.data);
      else if (v.isCompressedTexture)
        if (v.isCompressedArrayTexture) {
          Ne && $e && t.texStorage3D(s.TEXTURE_2D_ARRAY, x, _e, be[0].width, be[0].height, ie.depth);
          for (let L = 0, U = be.length; L < U; L++)
            le = be[L], v.format !== zt ? pe !== null ? Ne ? Re && t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY, L, 0, 0, 0, le.width, le.height, ie.depth, pe, le.data, 0, 0) : t.compressedTexImage3D(s.TEXTURE_2D_ARRAY, L, _e, le.width, le.height, ie.depth, 0, le.data, 0, 0) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Ne ? Re && t.texSubImage3D(s.TEXTURE_2D_ARRAY, L, 0, 0, 0, le.width, le.height, ie.depth, pe, Ve, le.data) : t.texImage3D(s.TEXTURE_2D_ARRAY, L, _e, le.width, le.height, ie.depth, 0, pe, Ve, le.data);
        } else {
          Ne && $e && t.texStorage2D(s.TEXTURE_2D, x, _e, be[0].width, be[0].height);
          for (let L = 0, U = be.length; L < U; L++)
            le = be[L], v.format !== zt ? pe !== null ? Ne ? Re && t.compressedTexSubImage2D(s.TEXTURE_2D, L, 0, 0, le.width, le.height, pe, le.data) : t.compressedTexImage2D(s.TEXTURE_2D, L, _e, le.width, le.height, 0, le.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Ne ? Re && t.texSubImage2D(s.TEXTURE_2D, L, 0, 0, le.width, le.height, pe, Ve, le.data) : t.texImage2D(s.TEXTURE_2D, L, _e, le.width, le.height, 0, pe, Ve, le.data);
        }
      else if (v.isDataArrayTexture)
        Ne ? ($e && t.texStorage3D(s.TEXTURE_2D_ARRAY, x, _e, ie.width, ie.height, ie.depth), Re && t.texSubImage3D(s.TEXTURE_2D_ARRAY, 0, 0, 0, 0, ie.width, ie.height, ie.depth, pe, Ve, ie.data)) : t.texImage3D(s.TEXTURE_2D_ARRAY, 0, _e, ie.width, ie.height, ie.depth, 0, pe, Ve, ie.data);
      else if (v.isData3DTexture)
        Ne ? ($e && t.texStorage3D(s.TEXTURE_3D, x, _e, ie.width, ie.height, ie.depth), Re && t.texSubImage3D(s.TEXTURE_3D, 0, 0, 0, 0, ie.width, ie.height, ie.depth, pe, Ve, ie.data)) : t.texImage3D(s.TEXTURE_3D, 0, _e, ie.width, ie.height, ie.depth, 0, pe, Ve, ie.data);
      else if (v.isFramebufferTexture) {
        if ($e)
          if (Ne)
            t.texStorage2D(s.TEXTURE_2D, x, _e, ie.width, ie.height);
          else {
            let L = ie.width, U = ie.height;
            for (let j = 0; j < x; j++)
              t.texImage2D(s.TEXTURE_2D, j, _e, L, U, 0, pe, Ve, null), L >>= 1, U >>= 1;
          }
      } else if (be.length > 0) {
        if (Ne && $e) {
          const L = nt(be[0]);
          t.texStorage2D(s.TEXTURE_2D, x, _e, L.width, L.height);
        }
        for (let L = 0, U = be.length; L < U; L++)
          le = be[L], Ne ? Re && t.texSubImage2D(s.TEXTURE_2D, L, 0, 0, pe, Ve, le) : t.texImage2D(s.TEXTURE_2D, L, _e, pe, Ve, le);
        v.generateMipmaps = !1;
      } else if (Ne) {
        if ($e) {
          const L = nt(ie);
          t.texStorage2D(s.TEXTURE_2D, x, _e, L.width, L.height);
        }
        Re && t.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, pe, Ve, ie);
      } else
        t.texImage2D(s.TEXTURE_2D, 0, _e, pe, Ve, ie);
      f(v) && m(Y), me.__version = Z.version, v.onUpdate && v.onUpdate(v);
    }
    b.__version = v.version;
  }
  function Ye(b, v, H) {
    if (v.image.length !== 6)
      return;
    const Y = de(b, v), K = v.source;
    t.bindTexture(s.TEXTURE_CUBE_MAP, b.__webglTexture, s.TEXTURE0 + H);
    const Z = n.get(K);
    if (K.version !== Z.__version || Y === !0) {
      t.activeTexture(s.TEXTURE0 + H);
      const me = qe.getPrimaries(qe.workingColorSpace), oe = v.colorSpace === An ? null : qe.getPrimaries(v.colorSpace), ae = v.colorSpace === An || me === oe ? s.NONE : s.BROWSER_DEFAULT_WEBGL;
      s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, v.flipY), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, v.premultiplyAlpha), s.pixelStorei(s.UNPACK_ALIGNMENT, v.unpackAlignment), s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, ae);
      const ye = v.isCompressedTexture || v.image[0].isCompressedTexture, ie = v.image[0] && v.image[0].isDataTexture, pe = [];
      for (let U = 0; U < 6; U++)
        !ye && !ie ? pe[U] = _(v.image[U], !0, i.maxCubemapSize) : pe[U] = ie ? v.image[U].image : v.image[U], pe[U] = He(v, pe[U]);
      const Ve = pe[0], _e = r.convert(v.format, v.colorSpace), le = r.convert(v.type), be = T(v.internalFormat, _e, le, v.colorSpace), Ne = v.isVideoTexture !== !0, $e = Z.__version === void 0 || Y === !0, Re = K.dataReady;
      let x = S(v, Ve);
      Q(s.TEXTURE_CUBE_MAP, v);
      let L;
      if (ye) {
        Ne && $e && t.texStorage2D(s.TEXTURE_CUBE_MAP, x, be, Ve.width, Ve.height);
        for (let U = 0; U < 6; U++) {
          L = pe[U].mipmaps;
          for (let j = 0; j < L.length; j++) {
            const ne = L[j];
            v.format !== zt ? _e !== null ? Ne ? Re && t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, j, 0, 0, ne.width, ne.height, _e, ne.data) : t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, j, be, ne.width, ne.height, 0, ne.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : Ne ? Re && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, j, 0, 0, ne.width, ne.height, _e, le, ne.data) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, j, be, ne.width, ne.height, 0, _e, le, ne.data);
          }
        }
      } else {
        if (L = v.mipmaps, Ne && $e) {
          L.length > 0 && x++;
          const U = nt(pe[0]);
          t.texStorage2D(s.TEXTURE_CUBE_MAP, x, be, U.width, U.height);
        }
        for (let U = 0; U < 6; U++)
          if (ie) {
            Ne ? Re && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, 0, 0, 0, pe[U].width, pe[U].height, _e, le, pe[U].data) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, 0, be, pe[U].width, pe[U].height, 0, _e, le, pe[U].data);
            for (let j = 0; j < L.length; j++) {
              const we = L[j].image[U].image;
              Ne ? Re && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, j + 1, 0, 0, we.width, we.height, _e, le, we.data) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, j + 1, be, we.width, we.height, 0, _e, le, we.data);
            }
          } else {
            Ne ? Re && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, 0, 0, 0, _e, le, pe[U]) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, 0, be, _e, le, pe[U]);
            for (let j = 0; j < L.length; j++) {
              const ne = L[j];
              Ne ? Re && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, j + 1, 0, 0, _e, le, ne.image[U]) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + U, j + 1, be, _e, le, ne.image[U]);
            }
          }
      }
      f(v) && m(s.TEXTURE_CUBE_MAP), Z.__version = K.version, v.onUpdate && v.onUpdate(v);
    }
    b.__version = v.version;
  }
  function G(b, v, H, Y, K, Z) {
    const me = r.convert(H.format, H.colorSpace), oe = r.convert(H.type), ae = T(H.internalFormat, me, oe, H.colorSpace);
    if (!n.get(v).__hasExternalTextures) {
      const ie = Math.max(1, v.width >> Z), pe = Math.max(1, v.height >> Z);
      K === s.TEXTURE_3D || K === s.TEXTURE_2D_ARRAY ? t.texImage3D(K, Z, ae, ie, pe, v.depth, 0, me, oe, null) : t.texImage2D(K, Z, ae, ie, pe, 0, me, oe, null);
    }
    t.bindFramebuffer(s.FRAMEBUFFER, b), ke(v) ? o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, Y, K, n.get(H).__webglTexture, 0, xe(v)) : (K === s.TEXTURE_2D || K >= s.TEXTURE_CUBE_MAP_POSITIVE_X && K <= s.TEXTURE_CUBE_MAP_NEGATIVE_Z) && s.framebufferTexture2D(s.FRAMEBUFFER, Y, K, n.get(H).__webglTexture, Z), t.bindFramebuffer(s.FRAMEBUFFER, null);
  }
  function te(b, v, H) {
    if (s.bindRenderbuffer(s.RENDERBUFFER, b), v.depthBuffer && !v.stencilBuffer) {
      let Y = s.DEPTH_COMPONENT24;
      if (H || ke(v)) {
        const K = v.depthTexture;
        K && K.isDepthTexture && (K.type === qt ? Y = s.DEPTH_COMPONENT32F : K.type === wi && (Y = s.DEPTH_COMPONENT24));
        const Z = xe(v);
        ke(v) ? o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER, Z, Y, v.width, v.height) : s.renderbufferStorageMultisample(s.RENDERBUFFER, Z, Y, v.width, v.height);
      } else
        s.renderbufferStorage(s.RENDERBUFFER, Y, v.width, v.height);
      s.framebufferRenderbuffer(s.FRAMEBUFFER, s.DEPTH_ATTACHMENT, s.RENDERBUFFER, b);
    } else if (v.depthBuffer && v.stencilBuffer) {
      const Y = xe(v);
      H && ke(v) === !1 ? s.renderbufferStorageMultisample(s.RENDERBUFFER, Y, s.DEPTH24_STENCIL8, v.width, v.height) : ke(v) ? o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER, Y, s.DEPTH24_STENCIL8, v.width, v.height) : s.renderbufferStorage(s.RENDERBUFFER, s.DEPTH_STENCIL, v.width, v.height), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.RENDERBUFFER, b);
    } else {
      const Y = v.textures;
      for (let K = 0; K < Y.length; K++) {
        const Z = Y[K], me = r.convert(Z.format, Z.colorSpace), oe = r.convert(Z.type), ae = T(Z.internalFormat, me, oe, Z.colorSpace), ye = xe(v);
        H && ke(v) === !1 ? s.renderbufferStorageMultisample(s.RENDERBUFFER, ye, ae, v.width, v.height) : ke(v) ? o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER, ye, ae, v.width, v.height) : s.renderbufferStorage(s.RENDERBUFFER, ae, v.width, v.height);
      }
    }
    s.bindRenderbuffer(s.RENDERBUFFER, null);
  }
  function he(b, v) {
    if (v && v.isWebGLCubeRenderTarget)
      throw new Error("Depth Texture with cube render targets is not supported");
    if (t.bindFramebuffer(s.FRAMEBUFFER, b), !(v.depthTexture && v.depthTexture.isDepthTexture))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    (!n.get(v.depthTexture).__webglTexture || v.depthTexture.image.width !== v.width || v.depthTexture.image.height !== v.height) && (v.depthTexture.image.width = v.width, v.depthTexture.image.height = v.height, v.depthTexture.needsUpdate = !0), P(v.depthTexture, 0);
    const Y = n.get(v.depthTexture).__webglTexture, K = xe(v);
    if (v.depthTexture.format === Si)
      ke(v) ? o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, s.DEPTH_ATTACHMENT, s.TEXTURE_2D, Y, 0, K) : s.framebufferTexture2D(s.FRAMEBUFFER, s.DEPTH_ATTACHMENT, s.TEXTURE_2D, Y, 0);
    else if (v.depthTexture.format === ts)
      ke(v) ? o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.TEXTURE_2D, Y, 0, K) : s.framebufferTexture2D(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.TEXTURE_2D, Y, 0);
    else
      throw new Error("Unknown depthTexture format");
  }
  function se(b) {
    const v = n.get(b), H = b.isWebGLCubeRenderTarget === !0;
    if (b.depthTexture && !v.__autoAllocateDepthBuffer) {
      if (H)
        throw new Error("target.depthTexture not supported in Cube render targets");
      he(v.__webglFramebuffer, b);
    } else if (H) {
      v.__webglDepthbuffer = [];
      for (let Y = 0; Y < 6; Y++)
        t.bindFramebuffer(s.FRAMEBUFFER, v.__webglFramebuffer[Y]), v.__webglDepthbuffer[Y] = s.createRenderbuffer(), te(v.__webglDepthbuffer[Y], b, !1);
    } else
      t.bindFramebuffer(s.FRAMEBUFFER, v.__webglFramebuffer), v.__webglDepthbuffer = s.createRenderbuffer(), te(v.__webglDepthbuffer, b, !1);
    t.bindFramebuffer(s.FRAMEBUFFER, null);
  }
  function Be(b, v, H) {
    const Y = n.get(b);
    v !== void 0 && G(Y.__webglFramebuffer, b, b.texture, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, 0), H !== void 0 && se(b);
  }
  function De(b) {
    const v = b.texture, H = n.get(b), Y = n.get(v);
    b.addEventListener("dispose", D);
    const K = b.textures, Z = b.isWebGLCubeRenderTarget === !0, me = K.length > 1;
    if (me || (Y.__webglTexture === void 0 && (Y.__webglTexture = s.createTexture()), Y.__version = v.version, a.memory.textures++), Z) {
      H.__webglFramebuffer = [];
      for (let oe = 0; oe < 6; oe++)
        if (v.mipmaps && v.mipmaps.length > 0) {
          H.__webglFramebuffer[oe] = [];
          for (let ae = 0; ae < v.mipmaps.length; ae++)
            H.__webglFramebuffer[oe][ae] = s.createFramebuffer();
        } else
          H.__webglFramebuffer[oe] = s.createFramebuffer();
    } else {
      if (v.mipmaps && v.mipmaps.length > 0) {
        H.__webglFramebuffer = [];
        for (let oe = 0; oe < v.mipmaps.length; oe++)
          H.__webglFramebuffer[oe] = s.createFramebuffer();
      } else
        H.__webglFramebuffer = s.createFramebuffer();
      if (me)
        for (let oe = 0, ae = K.length; oe < ae; oe++) {
          const ye = n.get(K[oe]);
          ye.__webglTexture === void 0 && (ye.__webglTexture = s.createTexture(), a.memory.textures++);
        }
      if (b.samples > 0 && ke(b) === !1) {
        H.__webglMultisampledFramebuffer = s.createFramebuffer(), H.__webglColorRenderbuffer = [], t.bindFramebuffer(s.FRAMEBUFFER, H.__webglMultisampledFramebuffer);
        for (let oe = 0; oe < K.length; oe++) {
          const ae = K[oe];
          H.__webglColorRenderbuffer[oe] = s.createRenderbuffer(), s.bindRenderbuffer(s.RENDERBUFFER, H.__webglColorRenderbuffer[oe]);
          const ye = r.convert(ae.format, ae.colorSpace), ie = r.convert(ae.type), pe = T(ae.internalFormat, ye, ie, ae.colorSpace, b.isXRRenderTarget === !0), Ve = xe(b);
          s.renderbufferStorageMultisample(s.RENDERBUFFER, Ve, pe, b.width, b.height), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + oe, s.RENDERBUFFER, H.__webglColorRenderbuffer[oe]);
        }
        s.bindRenderbuffer(s.RENDERBUFFER, null), b.depthBuffer && (H.__webglDepthRenderbuffer = s.createRenderbuffer(), te(H.__webglDepthRenderbuffer, b, !0)), t.bindFramebuffer(s.FRAMEBUFFER, null);
      }
    }
    if (Z) {
      t.bindTexture(s.TEXTURE_CUBE_MAP, Y.__webglTexture), Q(s.TEXTURE_CUBE_MAP, v);
      for (let oe = 0; oe < 6; oe++)
        if (v.mipmaps && v.mipmaps.length > 0)
          for (let ae = 0; ae < v.mipmaps.length; ae++)
            G(H.__webglFramebuffer[oe][ae], b, v, s.COLOR_ATTACHMENT0, s.TEXTURE_CUBE_MAP_POSITIVE_X + oe, ae);
        else
          G(H.__webglFramebuffer[oe], b, v, s.COLOR_ATTACHMENT0, s.TEXTURE_CUBE_MAP_POSITIVE_X + oe, 0);
      f(v) && m(s.TEXTURE_CUBE_MAP), t.unbindTexture();
    } else if (me) {
      for (let oe = 0, ae = K.length; oe < ae; oe++) {
        const ye = K[oe], ie = n.get(ye);
        t.bindTexture(s.TEXTURE_2D, ie.__webglTexture), Q(s.TEXTURE_2D, ye), G(H.__webglFramebuffer, b, ye, s.COLOR_ATTACHMENT0 + oe, s.TEXTURE_2D, 0), f(ye) && m(s.TEXTURE_2D);
      }
      t.unbindTexture();
    } else {
      let oe = s.TEXTURE_2D;
      if ((b.isWebGL3DRenderTarget || b.isWebGLArrayRenderTarget) && (oe = b.isWebGL3DRenderTarget ? s.TEXTURE_3D : s.TEXTURE_2D_ARRAY), t.bindTexture(oe, Y.__webglTexture), Q(oe, v), v.mipmaps && v.mipmaps.length > 0)
        for (let ae = 0; ae < v.mipmaps.length; ae++)
          G(H.__webglFramebuffer[ae], b, v, s.COLOR_ATTACHMENT0, oe, ae);
      else
        G(H.__webglFramebuffer, b, v, s.COLOR_ATTACHMENT0, oe, 0);
      f(v) && m(oe), t.unbindTexture();
    }
    b.depthBuffer && se(b);
  }
  function N(b) {
    const v = b.textures;
    for (let H = 0, Y = v.length; H < Y; H++) {
      const K = v[H];
      if (f(K)) {
        const Z = b.isWebGLCubeRenderTarget ? s.TEXTURE_CUBE_MAP : s.TEXTURE_2D, me = n.get(K).__webglTexture;
        t.bindTexture(Z, me), m(Z), t.unbindTexture();
      }
    }
  }
  const Ke = [], ge = [];
  function Ze(b) {
    if (b.samples > 0) {
      if (ke(b) === !1) {
        const v = b.textures, H = b.width, Y = b.height;
        let K = s.COLOR_BUFFER_BIT;
        const Z = b.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, me = n.get(b), oe = v.length > 1;
        if (oe)
          for (let ae = 0; ae < v.length; ae++)
            t.bindFramebuffer(s.FRAMEBUFFER, me.__webglMultisampledFramebuffer), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + ae, s.RENDERBUFFER, null), t.bindFramebuffer(s.FRAMEBUFFER, me.__webglFramebuffer), s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0 + ae, s.TEXTURE_2D, null, 0);
        t.bindFramebuffer(s.READ_FRAMEBUFFER, me.__webglMultisampledFramebuffer), t.bindFramebuffer(s.DRAW_FRAMEBUFFER, me.__webglFramebuffer);
        for (let ae = 0; ae < v.length; ae++) {
          if (b.resolveDepthBuffer && (b.depthBuffer && (K |= s.DEPTH_BUFFER_BIT), b.stencilBuffer && b.resolveStencilBuffer && (K |= s.STENCIL_BUFFER_BIT)), oe) {
            s.framebufferRenderbuffer(s.READ_FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.RENDERBUFFER, me.__webglColorRenderbuffer[ae]);
            const ye = n.get(v[ae]).__webglTexture;
            s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, ye, 0);
          }
          s.blitFramebuffer(0, 0, H, Y, 0, 0, H, Y, K, s.NEAREST), c === !0 && (Ke.length = 0, ge.length = 0, Ke.push(s.COLOR_ATTACHMENT0 + ae), b.depthBuffer && b.resolveDepthBuffer === !1 && (Ke.push(Z), ge.push(Z), s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER, ge)), s.invalidateFramebuffer(s.READ_FRAMEBUFFER, Ke));
        }
        if (t.bindFramebuffer(s.READ_FRAMEBUFFER, null), t.bindFramebuffer(s.DRAW_FRAMEBUFFER, null), oe)
          for (let ae = 0; ae < v.length; ae++) {
            t.bindFramebuffer(s.FRAMEBUFFER, me.__webglMultisampledFramebuffer), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + ae, s.RENDERBUFFER, me.__webglColorRenderbuffer[ae]);
            const ye = n.get(v[ae]).__webglTexture;
            t.bindFramebuffer(s.FRAMEBUFFER, me.__webglFramebuffer), s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0 + ae, s.TEXTURE_2D, ye, 0);
          }
        t.bindFramebuffer(s.DRAW_FRAMEBUFFER, me.__webglMultisampledFramebuffer);
      } else if (b.depthBuffer && b.resolveDepthBuffer === !1 && c) {
        const v = b.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT;
        s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER, [v]);
      }
    }
  }
  function xe(b) {
    return Math.min(i.maxSamples, b.samples);
  }
  function ke(b) {
    const v = n.get(b);
    return b.samples > 0 && e.has("WEBGL_multisampled_render_to_texture") === !0 && v.__useRenderToTexture !== !1;
  }
  function Ae(b) {
    const v = a.render.frame;
    h.get(b) !== v && (h.set(b, v), b.update());
  }
  function He(b, v) {
    const H = b.colorSpace, Y = b.format, K = b.type;
    return b.isCompressedTexture === !0 || b.isVideoTexture === !0 || H !== pt && H !== An && (qe.getTransfer(H) === tt ? (Y !== zt || K !== Ln) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", H)), v;
  }
  function nt(b) {
    return typeof HTMLImageElement < "u" && b instanceof HTMLImageElement ? (l.width = b.naturalWidth || b.width, l.height = b.naturalHeight || b.height) : typeof VideoFrame < "u" && b instanceof VideoFrame ? (l.width = b.displayWidth, l.height = b.displayHeight) : (l.width = b.width, l.height = b.height), l;
  }
  this.allocateTextureUnit = O, this.resetTextureUnits = M, this.setTexture2D = P, this.setTexture2DArray = q, this.setTexture3D = X, this.setTextureCube = $, this.rebindTextures = Be, this.setupRenderTarget = De, this.updateRenderTargetMipmap = N, this.updateMultisampleRenderTarget = Ze, this.setupDepthRenderbuffer = se, this.setupFrameBufferTexture = G, this.useMultisampledRTT = ke;
}
function Gm(s, e) {
  function t(n, i = An) {
    let r;
    const a = qe.getTransfer(i);
    if (n === Ln)
      return s.UNSIGNED_BYTE;
    if (n === wc)
      return s.UNSIGNED_SHORT_4_4_4_4;
    if (n === Rc)
      return s.UNSIGNED_SHORT_5_5_5_1;
    if (n === oh)
      return s.UNSIGNED_INT_5_9_9_9_REV;
    if (n === rh)
      return s.BYTE;
    if (n === ah)
      return s.SHORT;
    if (n === Ac)
      return s.UNSIGNED_SHORT;
    if (n === bc)
      return s.INT;
    if (n === wi)
      return s.UNSIGNED_INT;
    if (n === qt)
      return s.FLOAT;
    if (n === Qs)
      return s.HALF_FLOAT;
    if (n === ch)
      return s.ALPHA;
    if (n === lh)
      return s.RGB;
    if (n === zt)
      return s.RGBA;
    if (n === hh)
      return s.LUMINANCE;
    if (n === uh)
      return s.LUMINANCE_ALPHA;
    if (n === Si)
      return s.DEPTH_COMPONENT;
    if (n === ts)
      return s.DEPTH_STENCIL;
    if (n === Cc)
      return s.RED;
    if (n === Pc)
      return s.RED_INTEGER;
    if (n === dh)
      return s.RG;
    if (n === Lc)
      return s.RG_INTEGER;
    if (n === Ic)
      return s.RGBA_INTEGER;
    if (n === or || n === cr || n === lr || n === hr)
      if (a === tt)
        if (r = e.get("WEBGL_compressed_texture_s3tc_srgb"), r !== null) {
          if (n === or)
            return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === cr)
            return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === lr)
            return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === hr)
            return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else
          return null;
      else if (r = e.get("WEBGL_compressed_texture_s3tc"), r !== null) {
        if (n === or)
          return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === cr)
          return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === lr)
          return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === hr)
          return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else
        return null;
    if (n === La || n === Ia || n === Da || n === Na)
      if (r = e.get("WEBGL_compressed_texture_pvrtc"), r !== null) {
        if (n === La)
          return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === Ia)
          return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === Da)
          return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === Na)
          return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else
        return null;
    if (n === Ua || n === Oa || n === Fa)
      if (r = e.get("WEBGL_compressed_texture_etc"), r !== null) {
        if (n === Ua || n === Oa)
          return a === tt ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
        if (n === Fa)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : r.COMPRESSED_RGBA8_ETC2_EAC;
      } else
        return null;
    if (n === Ba || n === ka || n === za || n === Ha || n === Va || n === Ga || n === Wa || n === Xa || n === qa || n === Ya || n === ja || n === Ka || n === Za || n === $a)
      if (r = e.get("WEBGL_compressed_texture_astc"), r !== null) {
        if (n === Ba)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === ka)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === za)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === Ha)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === Va)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === Ga)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === Wa)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === Xa)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === qa)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === Ya)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === ja)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === Ka)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === Za)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === $a)
          return a === tt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else
        return null;
    if (n === ur || n === Ja || n === Qa)
      if (r = e.get("EXT_texture_compression_bptc"), r !== null) {
        if (n === ur)
          return a === tt ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === Ja)
          return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === Qa)
          return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else
        return null;
    if (n === fh || n === eo || n === to || n === no)
      if (r = e.get("EXT_texture_compression_rgtc"), r !== null) {
        if (n === ur)
          return r.COMPRESSED_RED_RGTC1_EXT;
        if (n === eo)
          return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === to)
          return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === no)
          return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else
        return null;
    return n === as ? s.UNSIGNED_INT_24_8 : s[n] !== void 0 ? s[n] : null;
  }
  return { convert: t };
}
class Wm extends Tt {
  constructor(e = []) {
    super(), this.isArrayCamera = !0, this.cameras = e;
  }
}
class qn extends rt {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
const Xm = { type: "move" };
class Fr {
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  getHandSpace() {
    return this._hand === null && (this._hand = new qn(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new qn(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new C(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new C()), this._targetRay;
  }
  getGripSpace() {
    return this._grip === null && (this._grip = new qn(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new C(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new C()), this._grip;
  }
  dispatchEvent(e) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
  }
  connect(e) {
    if (e && e.hand) {
      const t = this._hand;
      if (t)
        for (const n of e.hand.values())
          this._getHandJoint(t, n);
    }
    return this.dispatchEvent({ type: "connected", data: e }), this;
  }
  disconnect(e) {
    return this.dispatchEvent({ type: "disconnected", data: e }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
  }
  update(e, t, n) {
    let i = null, r = null, a = null;
    const o = this._targetRay, c = this._grip, l = this._hand;
    if (e && t.session.visibilityState !== "visible-blurred") {
      if (l && e.hand) {
        a = !0;
        for (const _ of e.hand.values()) {
          const f = t.getJointPose(_, n), m = this._getHandJoint(l, _);
          f !== null && (m.matrix.fromArray(f.transform.matrix), m.matrix.decompose(m.position, m.rotation, m.scale), m.matrixWorldNeedsUpdate = !0, m.jointRadius = f.radius), m.visible = f !== null;
        }
        const h = l.joints["index-finger-tip"], u = l.joints["thumb-tip"], d = h.position.distanceTo(u.position), p = 0.02, g = 5e-3;
        l.inputState.pinching && d > p + g ? (l.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: e.handedness,
          target: this
        })) : !l.inputState.pinching && d <= p - g && (l.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: e.handedness,
          target: this
        }));
      } else
        c !== null && e.gripSpace && (r = t.getPose(e.gripSpace, n), r !== null && (c.matrix.fromArray(r.transform.matrix), c.matrix.decompose(c.position, c.rotation, c.scale), c.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (c.hasLinearVelocity = !0, c.linearVelocity.copy(r.linearVelocity)) : c.hasLinearVelocity = !1, r.angularVelocity ? (c.hasAngularVelocity = !0, c.angularVelocity.copy(r.angularVelocity)) : c.hasAngularVelocity = !1));
      o !== null && (i = t.getPose(e.targetRaySpace, n), i === null && r !== null && (i = r), i !== null && (o.matrix.fromArray(i.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, i.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(i.linearVelocity)) : o.hasLinearVelocity = !1, i.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(i.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(Xm)));
    }
    return o !== null && (o.visible = i !== null), c !== null && (c.visible = r !== null), l !== null && (l.visible = a !== null), this;
  }
  // private method
  _getHandJoint(e, t) {
    if (e.joints[t.jointName] === void 0) {
      const n = new qn();
      n.matrixAutoUpdate = !1, n.visible = !1, e.joints[t.jointName] = n, e.add(n);
    }
    return e.joints[t.jointName];
  }
}
const qm = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, Ym = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class jm {
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  init(e, t, n) {
    if (this.texture === null) {
      const i = new ft(), r = e.properties.get(i);
      r.__webglTexture = t.texture, (t.depthNear != n.depthNear || t.depthFar != n.depthFar) && (this.depthNear = t.depthNear, this.depthFar = t.depthFar), this.texture = i;
    }
  }
  render(e, t) {
    if (this.texture !== null) {
      if (this.mesh === null) {
        const n = t.cameras[0].viewport, i = new In({
          vertexShader: qm,
          fragmentShader: Ym,
          uniforms: {
            depthColor: { value: this.texture },
            depthWidth: { value: n.z },
            depthHeight: { value: n.w }
          }
        });
        this.mesh = new Qe(new tr(20, 20), i);
      }
      e.render(this.mesh, t);
    }
  }
  reset() {
    this.texture = null, this.mesh = null;
  }
}
class Km extends Dn {
  constructor(e, t) {
    super();
    const n = this;
    let i = null, r = 1, a = null, o = "local-floor", c = 1, l = null, h = null, u = null, d = null, p = null, g = null;
    const _ = new jm(), f = t.getContextAttributes();
    let m = null, T = null;
    const S = [], A = [], D = new Me();
    let R = null;
    const w = new Tt();
    w.layers.enable(1), w.viewport = new Je();
    const k = new Tt();
    k.layers.enable(2), k.viewport = new Je();
    const E = [w, k], M = new Wm();
    M.layers.enable(1), M.layers.enable(2);
    let O = null, W = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(G) {
      let te = S[G];
      return te === void 0 && (te = new Fr(), S[G] = te), te.getTargetRaySpace();
    }, this.getControllerGrip = function(G) {
      let te = S[G];
      return te === void 0 && (te = new Fr(), S[G] = te), te.getGripSpace();
    }, this.getHand = function(G) {
      let te = S[G];
      return te === void 0 && (te = new Fr(), S[G] = te), te.getHandSpace();
    };
    function P(G) {
      const te = A.indexOf(G.inputSource);
      if (te === -1)
        return;
      const he = S[te];
      he !== void 0 && (he.update(G.inputSource, G.frame, l || a), he.dispatchEvent({ type: G.type, data: G.inputSource }));
    }
    function q() {
      i.removeEventListener("select", P), i.removeEventListener("selectstart", P), i.removeEventListener("selectend", P), i.removeEventListener("squeeze", P), i.removeEventListener("squeezestart", P), i.removeEventListener("squeezeend", P), i.removeEventListener("end", q), i.removeEventListener("inputsourceschange", X);
      for (let G = 0; G < S.length; G++) {
        const te = A[G];
        te !== null && (A[G] = null, S[G].disconnect(te));
      }
      O = null, W = null, _.reset(), e.setRenderTarget(m), p = null, d = null, u = null, i = null, T = null, Ye.stop(), n.isPresenting = !1, e.setPixelRatio(R), e.setSize(D.width, D.height, !1), n.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(G) {
      r = G, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(G) {
      o = G, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return l || a;
    }, this.setReferenceSpace = function(G) {
      l = G;
    }, this.getBaseLayer = function() {
      return d !== null ? d : p;
    }, this.getBinding = function() {
      return u;
    }, this.getFrame = function() {
      return g;
    }, this.getSession = function() {
      return i;
    }, this.setSession = async function(G) {
      if (i = G, i !== null) {
        if (m = e.getRenderTarget(), i.addEventListener("select", P), i.addEventListener("selectstart", P), i.addEventListener("selectend", P), i.addEventListener("squeeze", P), i.addEventListener("squeezestart", P), i.addEventListener("squeezeend", P), i.addEventListener("end", q), i.addEventListener("inputsourceschange", X), f.xrCompatible !== !0 && await t.makeXRCompatible(), R = e.getPixelRatio(), e.getSize(D), i.renderState.layers === void 0) {
          const te = {
            antialias: f.antialias,
            alpha: !0,
            depth: f.depth,
            stencil: f.stencil,
            framebufferScaleFactor: r
          };
          p = new XRWebGLLayer(i, t, te), i.updateRenderState({ baseLayer: p }), e.setPixelRatio(1), e.setSize(p.framebufferWidth, p.framebufferHeight, !1), T = new Yn(
            p.framebufferWidth,
            p.framebufferHeight,
            {
              format: zt,
              type: Ln,
              colorSpace: e.outputColorSpace,
              stencilBuffer: f.stencil
            }
          );
        } else {
          let te = null, he = null, se = null;
          f.depth && (se = f.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, te = f.stencil ? ts : Si, he = f.stencil ? as : wi);
          const Be = {
            colorFormat: t.RGBA8,
            depthFormat: se,
            scaleFactor: r
          };
          u = new XRWebGLBinding(i, t), d = u.createProjectionLayer(Be), i.updateRenderState({ layers: [d] }), e.setPixelRatio(1), e.setSize(d.textureWidth, d.textureHeight, !1), T = new Yn(
            d.textureWidth,
            d.textureHeight,
            {
              format: zt,
              type: Ln,
              depthTexture: new Kc(d.textureWidth, d.textureHeight, he, void 0, void 0, void 0, void 0, void 0, void 0, te),
              stencilBuffer: f.stencil,
              colorSpace: e.outputColorSpace,
              samples: f.antialias ? 4 : 0,
              resolveDepthBuffer: d.ignoreDepthValues === !1
            }
          );
        }
        T.isXRRenderTarget = !0, this.setFoveation(c), l = null, a = await i.requestReferenceSpace(o), Ye.setContext(i), Ye.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (i !== null)
        return i.environmentBlendMode;
    };
    function X(G) {
      for (let te = 0; te < G.removed.length; te++) {
        const he = G.removed[te], se = A.indexOf(he);
        se >= 0 && (A[se] = null, S[se].disconnect(he));
      }
      for (let te = 0; te < G.added.length; te++) {
        const he = G.added[te];
        let se = A.indexOf(he);
        if (se === -1) {
          for (let De = 0; De < S.length; De++)
            if (De >= A.length) {
              A.push(he), se = De;
              break;
            } else if (A[De] === null) {
              A[De] = he, se = De;
              break;
            }
          if (se === -1)
            break;
        }
        const Be = S[se];
        Be && Be.connect(he);
      }
    }
    const $ = new C(), J = new C();
    function V(G, te, he) {
      $.setFromMatrixPosition(te.matrixWorld), J.setFromMatrixPosition(he.matrixWorld);
      const se = $.distanceTo(J), Be = te.projectionMatrix.elements, De = he.projectionMatrix.elements, N = Be[14] / (Be[10] - 1), Ke = Be[14] / (Be[10] + 1), ge = (Be[9] + 1) / Be[5], Ze = (Be[9] - 1) / Be[5], xe = (Be[8] - 1) / Be[0], ke = (De[8] + 1) / De[0], Ae = N * xe, He = N * ke, nt = se / (-xe + ke), b = nt * -xe;
      te.matrixWorld.decompose(G.position, G.quaternion, G.scale), G.translateX(b), G.translateZ(nt), G.matrixWorld.compose(G.position, G.quaternion, G.scale), G.matrixWorldInverse.copy(G.matrixWorld).invert();
      const v = N + nt, H = Ke + nt, Y = Ae - b, K = He + (se - b), Z = ge * Ke / H * v, me = Ze * Ke / H * v;
      G.projectionMatrix.makePerspective(Y, K, Z, me, v, H), G.projectionMatrixInverse.copy(G.projectionMatrix).invert();
    }
    function ee(G, te) {
      te === null ? G.matrixWorld.copy(G.matrix) : G.matrixWorld.multiplyMatrices(te.matrixWorld, G.matrix), G.matrixWorldInverse.copy(G.matrixWorld).invert();
    }
    this.updateCamera = function(G) {
      if (i === null)
        return;
      _.texture !== null && (G.near = _.depthNear, G.far = _.depthFar), M.near = k.near = w.near = G.near, M.far = k.far = w.far = G.far, (O !== M.near || W !== M.far) && (i.updateRenderState({
        depthNear: M.near,
        depthFar: M.far
      }), O = M.near, W = M.far, w.near = O, w.far = W, k.near = O, k.far = W, w.updateProjectionMatrix(), k.updateProjectionMatrix(), G.updateProjectionMatrix());
      const te = G.parent, he = M.cameras;
      ee(M, te);
      for (let se = 0; se < he.length; se++)
        ee(he[se], te);
      he.length === 2 ? V(M, w, k) : M.projectionMatrix.copy(w.projectionMatrix), Q(G, M, te);
    };
    function Q(G, te, he) {
      he === null ? G.matrix.copy(te.matrixWorld) : (G.matrix.copy(he.matrixWorld), G.matrix.invert(), G.matrix.multiply(te.matrixWorld)), G.matrix.decompose(G.position, G.quaternion, G.scale), G.updateMatrixWorld(!0), G.projectionMatrix.copy(te.projectionMatrix), G.projectionMatrixInverse.copy(te.projectionMatrixInverse), G.isPerspectiveCamera && (G.fov = Ci * 2 * Math.atan(1 / G.projectionMatrix.elements[5]), G.zoom = 1);
    }
    this.getCamera = function() {
      return M;
    }, this.getFoveation = function() {
      if (!(d === null && p === null))
        return c;
    }, this.setFoveation = function(G) {
      c = G, d !== null && (d.fixedFoveation = G), p !== null && p.fixedFoveation !== void 0 && (p.fixedFoveation = G);
    }, this.hasDepthSensing = function() {
      return _.texture !== null;
    };
    let de = null;
    function Fe(G, te) {
      if (h = te.getViewerPose(l || a), g = te, h !== null) {
        const he = h.views;
        p !== null && (e.setRenderTargetFramebuffer(T, p.framebuffer), e.setRenderTarget(T));
        let se = !1;
        he.length !== M.cameras.length && (M.cameras.length = 0, se = !0);
        for (let De = 0; De < he.length; De++) {
          const N = he[De];
          let Ke = null;
          if (p !== null)
            Ke = p.getViewport(N);
          else {
            const Ze = u.getViewSubImage(d, N);
            Ke = Ze.viewport, De === 0 && (e.setRenderTargetTextures(
              T,
              Ze.colorTexture,
              d.ignoreDepthValues ? void 0 : Ze.depthStencilTexture
            ), e.setRenderTarget(T));
          }
          let ge = E[De];
          ge === void 0 && (ge = new Tt(), ge.layers.enable(De), ge.viewport = new Je(), E[De] = ge), ge.matrix.fromArray(N.transform.matrix), ge.matrix.decompose(ge.position, ge.quaternion, ge.scale), ge.projectionMatrix.fromArray(N.projectionMatrix), ge.projectionMatrixInverse.copy(ge.projectionMatrix).invert(), ge.viewport.set(Ke.x, Ke.y, Ke.width, Ke.height), De === 0 && (M.matrix.copy(ge.matrix), M.matrix.decompose(M.position, M.quaternion, M.scale)), se === !0 && M.cameras.push(ge);
        }
        const Be = i.enabledFeatures;
        if (Be && Be.includes("depth-sensing")) {
          const De = u.getDepthInformation(he[0]);
          De && De.isValid && De.texture && _.init(e, De, i.renderState);
        }
      }
      for (let he = 0; he < S.length; he++) {
        const se = A[he], Be = S[he];
        se !== null && Be !== void 0 && Be.update(se, te, l || a);
      }
      _.render(e, M), de && de(G, te), te.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: te }), g = null;
    }
    const Ye = new jc();
    Ye.setAnimationLoop(Fe), this.setAnimationLoop = function(G) {
      de = G;
    }, this.dispose = function() {
    };
  }
}
const Hn = /* @__PURE__ */ new jt(), Zm = /* @__PURE__ */ new Ie();
function $m(s, e) {
  function t(f, m) {
    f.matrixAutoUpdate === !0 && f.updateMatrix(), m.value.copy(f.matrix);
  }
  function n(f, m) {
    m.color.getRGB(f.fogColor.value, Xc(s)), m.isFog ? (f.fogNear.value = m.near, f.fogFar.value = m.far) : m.isFogExp2 && (f.fogDensity.value = m.density);
  }
  function i(f, m, T, S, A) {
    m.isMeshBasicMaterial || m.isMeshLambertMaterial ? r(f, m) : m.isMeshToonMaterial ? (r(f, m), u(f, m)) : m.isMeshPhongMaterial ? (r(f, m), h(f, m)) : m.isMeshStandardMaterial ? (r(f, m), d(f, m), m.isMeshPhysicalMaterial && p(f, m, A)) : m.isMeshMatcapMaterial ? (r(f, m), g(f, m)) : m.isMeshDepthMaterial ? r(f, m) : m.isMeshDistanceMaterial ? (r(f, m), _(f, m)) : m.isMeshNormalMaterial ? r(f, m) : m.isLineBasicMaterial ? (a(f, m), m.isLineDashedMaterial && o(f, m)) : m.isPointsMaterial ? c(f, m, T, S) : m.isSpriteMaterial ? l(f, m) : m.isShadowMaterial ? (f.color.value.copy(m.color), f.opacity.value = m.opacity) : m.isShaderMaterial && (m.uniformsNeedUpdate = !1);
  }
  function r(f, m) {
    f.opacity.value = m.opacity, m.color && f.diffuse.value.copy(m.color), m.emissive && f.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity), m.map && (f.map.value = m.map, t(m.map, f.mapTransform)), m.alphaMap && (f.alphaMap.value = m.alphaMap, t(m.alphaMap, f.alphaMapTransform)), m.bumpMap && (f.bumpMap.value = m.bumpMap, t(m.bumpMap, f.bumpMapTransform), f.bumpScale.value = m.bumpScale, m.side === bt && (f.bumpScale.value *= -1)), m.normalMap && (f.normalMap.value = m.normalMap, t(m.normalMap, f.normalMapTransform), f.normalScale.value.copy(m.normalScale), m.side === bt && f.normalScale.value.negate()), m.displacementMap && (f.displacementMap.value = m.displacementMap, t(m.displacementMap, f.displacementMapTransform), f.displacementScale.value = m.displacementScale, f.displacementBias.value = m.displacementBias), m.emissiveMap && (f.emissiveMap.value = m.emissiveMap, t(m.emissiveMap, f.emissiveMapTransform)), m.specularMap && (f.specularMap.value = m.specularMap, t(m.specularMap, f.specularMapTransform)), m.alphaTest > 0 && (f.alphaTest.value = m.alphaTest);
    const T = e.get(m), S = T.envMap, A = T.envMapRotation;
    if (S && (f.envMap.value = S, Hn.copy(A), Hn.x *= -1, Hn.y *= -1, Hn.z *= -1, S.isCubeTexture && S.isRenderTargetTexture === !1 && (Hn.y *= -1, Hn.z *= -1), f.envMapRotation.value.setFromMatrix4(Zm.makeRotationFromEuler(Hn)), f.flipEnvMap.value = S.isCubeTexture && S.isRenderTargetTexture === !1 ? -1 : 1, f.reflectivity.value = m.reflectivity, f.ior.value = m.ior, f.refractionRatio.value = m.refractionRatio), m.lightMap) {
      f.lightMap.value = m.lightMap;
      const D = s._useLegacyLights === !0 ? Math.PI : 1;
      f.lightMapIntensity.value = m.lightMapIntensity * D, t(m.lightMap, f.lightMapTransform);
    }
    m.aoMap && (f.aoMap.value = m.aoMap, f.aoMapIntensity.value = m.aoMapIntensity, t(m.aoMap, f.aoMapTransform));
  }
  function a(f, m) {
    f.diffuse.value.copy(m.color), f.opacity.value = m.opacity, m.map && (f.map.value = m.map, t(m.map, f.mapTransform));
  }
  function o(f, m) {
    f.dashSize.value = m.dashSize, f.totalSize.value = m.dashSize + m.gapSize, f.scale.value = m.scale;
  }
  function c(f, m, T, S) {
    f.diffuse.value.copy(m.color), f.opacity.value = m.opacity, f.size.value = m.size * T, f.scale.value = S * 0.5, m.map && (f.map.value = m.map, t(m.map, f.uvTransform)), m.alphaMap && (f.alphaMap.value = m.alphaMap, t(m.alphaMap, f.alphaMapTransform)), m.alphaTest > 0 && (f.alphaTest.value = m.alphaTest);
  }
  function l(f, m) {
    f.diffuse.value.copy(m.color), f.opacity.value = m.opacity, f.rotation.value = m.rotation, m.map && (f.map.value = m.map, t(m.map, f.mapTransform)), m.alphaMap && (f.alphaMap.value = m.alphaMap, t(m.alphaMap, f.alphaMapTransform)), m.alphaTest > 0 && (f.alphaTest.value = m.alphaTest);
  }
  function h(f, m) {
    f.specular.value.copy(m.specular), f.shininess.value = Math.max(m.shininess, 1e-4);
  }
  function u(f, m) {
    m.gradientMap && (f.gradientMap.value = m.gradientMap);
  }
  function d(f, m) {
    f.metalness.value = m.metalness, m.metalnessMap && (f.metalnessMap.value = m.metalnessMap, t(m.metalnessMap, f.metalnessMapTransform)), f.roughness.value = m.roughness, m.roughnessMap && (f.roughnessMap.value = m.roughnessMap, t(m.roughnessMap, f.roughnessMapTransform)), m.envMap && (f.envMapIntensity.value = m.envMapIntensity);
  }
  function p(f, m, T) {
    f.ior.value = m.ior, m.sheen > 0 && (f.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen), f.sheenRoughness.value = m.sheenRoughness, m.sheenColorMap && (f.sheenColorMap.value = m.sheenColorMap, t(m.sheenColorMap, f.sheenColorMapTransform)), m.sheenRoughnessMap && (f.sheenRoughnessMap.value = m.sheenRoughnessMap, t(m.sheenRoughnessMap, f.sheenRoughnessMapTransform))), m.clearcoat > 0 && (f.clearcoat.value = m.clearcoat, f.clearcoatRoughness.value = m.clearcoatRoughness, m.clearcoatMap && (f.clearcoatMap.value = m.clearcoatMap, t(m.clearcoatMap, f.clearcoatMapTransform)), m.clearcoatRoughnessMap && (f.clearcoatRoughnessMap.value = m.clearcoatRoughnessMap, t(m.clearcoatRoughnessMap, f.clearcoatRoughnessMapTransform)), m.clearcoatNormalMap && (f.clearcoatNormalMap.value = m.clearcoatNormalMap, t(m.clearcoatNormalMap, f.clearcoatNormalMapTransform), f.clearcoatNormalScale.value.copy(m.clearcoatNormalScale), m.side === bt && f.clearcoatNormalScale.value.negate())), m.dispersion > 0 && (f.dispersion.value = m.dispersion), m.iridescence > 0 && (f.iridescence.value = m.iridescence, f.iridescenceIOR.value = m.iridescenceIOR, f.iridescenceThicknessMinimum.value = m.iridescenceThicknessRange[0], f.iridescenceThicknessMaximum.value = m.iridescenceThicknessRange[1], m.iridescenceMap && (f.iridescenceMap.value = m.iridescenceMap, t(m.iridescenceMap, f.iridescenceMapTransform)), m.iridescenceThicknessMap && (f.iridescenceThicknessMap.value = m.iridescenceThicknessMap, t(m.iridescenceThicknessMap, f.iridescenceThicknessMapTransform))), m.transmission > 0 && (f.transmission.value = m.transmission, f.transmissionSamplerMap.value = T.texture, f.transmissionSamplerSize.value.set(T.width, T.height), m.transmissionMap && (f.transmissionMap.value = m.transmissionMap, t(m.transmissionMap, f.transmissionMapTransform)), f.thickness.value = m.thickness, m.thicknessMap && (f.thicknessMap.value = m.thicknessMap, t(m.thicknessMap, f.thicknessMapTransform)), f.attenuationDistance.value = m.attenuationDistance, f.attenuationColor.value.copy(m.attenuationColor)), m.anisotropy > 0 && (f.anisotropyVector.value.set(m.anisotropy * Math.cos(m.anisotropyRotation), m.anisotropy * Math.sin(m.anisotropyRotation)), m.anisotropyMap && (f.anisotropyMap.value = m.anisotropyMap, t(m.anisotropyMap, f.anisotropyMapTransform))), f.specularIntensity.value = m.specularIntensity, f.specularColor.value.copy(m.specularColor), m.specularColorMap && (f.specularColorMap.value = m.specularColorMap, t(m.specularColorMap, f.specularColorMapTransform)), m.specularIntensityMap && (f.specularIntensityMap.value = m.specularIntensityMap, t(m.specularIntensityMap, f.specularIntensityMapTransform));
  }
  function g(f, m) {
    m.matcap && (f.matcap.value = m.matcap);
  }
  function _(f, m) {
    const T = e.get(m).light;
    f.referencePosition.value.setFromMatrixPosition(T.matrixWorld), f.nearDistance.value = T.shadow.camera.near, f.farDistance.value = T.shadow.camera.far;
  }
  return {
    refreshFogUniforms: n,
    refreshMaterialUniforms: i
  };
}
function Jm(s, e, t, n) {
  let i = {}, r = {}, a = [];
  const o = s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);
  function c(T, S) {
    const A = S.program;
    n.uniformBlockBinding(T, A);
  }
  function l(T, S) {
    let A = i[T.id];
    A === void 0 && (g(T), A = h(T), i[T.id] = A, T.addEventListener("dispose", f));
    const D = S.program;
    n.updateUBOMapping(T, D);
    const R = e.render.frame;
    r[T.id] !== R && (d(T), r[T.id] = R);
  }
  function h(T) {
    const S = u();
    T.__bindingPointIndex = S;
    const A = s.createBuffer(), D = T.__size, R = T.usage;
    return s.bindBuffer(s.UNIFORM_BUFFER, A), s.bufferData(s.UNIFORM_BUFFER, D, R), s.bindBuffer(s.UNIFORM_BUFFER, null), s.bindBufferBase(s.UNIFORM_BUFFER, S, A), A;
  }
  function u() {
    for (let T = 0; T < o; T++)
      if (a.indexOf(T) === -1)
        return a.push(T), T;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function d(T) {
    const S = i[T.id], A = T.uniforms, D = T.__cache;
    s.bindBuffer(s.UNIFORM_BUFFER, S);
    for (let R = 0, w = A.length; R < w; R++) {
      const k = Array.isArray(A[R]) ? A[R] : [A[R]];
      for (let E = 0, M = k.length; E < M; E++) {
        const O = k[E];
        if (p(O, R, E, D) === !0) {
          const W = O.__offset, P = Array.isArray(O.value) ? O.value : [O.value];
          let q = 0;
          for (let X = 0; X < P.length; X++) {
            const $ = P[X], J = _($);
            typeof $ == "number" || typeof $ == "boolean" ? (O.__data[0] = $, s.bufferSubData(s.UNIFORM_BUFFER, W + q, O.__data)) : $.isMatrix3 ? (O.__data[0] = $.elements[0], O.__data[1] = $.elements[1], O.__data[2] = $.elements[2], O.__data[3] = 0, O.__data[4] = $.elements[3], O.__data[5] = $.elements[4], O.__data[6] = $.elements[5], O.__data[7] = 0, O.__data[8] = $.elements[6], O.__data[9] = $.elements[7], O.__data[10] = $.elements[8], O.__data[11] = 0) : ($.toArray(O.__data, q), q += J.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          s.bufferSubData(s.UNIFORM_BUFFER, W, O.__data);
        }
      }
    }
    s.bindBuffer(s.UNIFORM_BUFFER, null);
  }
  function p(T, S, A, D) {
    const R = T.value, w = S + "_" + A;
    if (D[w] === void 0)
      return typeof R == "number" || typeof R == "boolean" ? D[w] = R : D[w] = R.clone(), !0;
    {
      const k = D[w];
      if (typeof R == "number" || typeof R == "boolean") {
        if (k !== R)
          return D[w] = R, !0;
      } else if (k.equals(R) === !1)
        return k.copy(R), !0;
    }
    return !1;
  }
  function g(T) {
    const S = T.uniforms;
    let A = 0;
    const D = 16;
    for (let w = 0, k = S.length; w < k; w++) {
      const E = Array.isArray(S[w]) ? S[w] : [S[w]];
      for (let M = 0, O = E.length; M < O; M++) {
        const W = E[M], P = Array.isArray(W.value) ? W.value : [W.value];
        for (let q = 0, X = P.length; q < X; q++) {
          const $ = P[q], J = _($), V = A % D;
          V !== 0 && D - V < J.boundary && (A += D - V), W.__data = new Float32Array(J.storage / Float32Array.BYTES_PER_ELEMENT), W.__offset = A, A += J.storage;
        }
      }
    }
    const R = A % D;
    return R > 0 && (A += D - R), T.__size = A, T.__cache = {}, this;
  }
  function _(T) {
    const S = {
      boundary: 0,
      // bytes
      storage: 0
      // bytes
    };
    return typeof T == "number" || typeof T == "boolean" ? (S.boundary = 4, S.storage = 4) : T.isVector2 ? (S.boundary = 8, S.storage = 8) : T.isVector3 || T.isColor ? (S.boundary = 16, S.storage = 12) : T.isVector4 ? (S.boundary = 16, S.storage = 16) : T.isMatrix3 ? (S.boundary = 48, S.storage = 48) : T.isMatrix4 ? (S.boundary = 64, S.storage = 64) : T.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", T), S;
  }
  function f(T) {
    const S = T.target;
    S.removeEventListener("dispose", f);
    const A = a.indexOf(S.__bindingPointIndex);
    a.splice(A, 1), s.deleteBuffer(i[S.id]), delete i[S.id], delete r[S.id];
  }
  function m() {
    for (const T in i)
      s.deleteBuffer(i[T]);
    a = [], i = {}, r = {};
  }
  return {
    bind: c,
    update: l,
    dispose: m
  };
}
class Qm {
  constructor(e = {}) {
    const {
      canvas: t = Xh(),
      context: n = null,
      depth: i = !0,
      stencil: r = !1,
      alpha: a = !1,
      antialias: o = !1,
      premultipliedAlpha: c = !0,
      preserveDrawingBuffer: l = !1,
      powerPreference: h = "default",
      failIfMajorPerformanceCaveat: u = !1
    } = e;
    this.isWebGLRenderer = !0;
    let d;
    if (n !== null) {
      if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext)
        throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      d = n.getContextAttributes().alpha;
    } else
      d = a;
    const p = new Uint32Array(4), g = new Int32Array(4);
    let _ = null, f = null;
    const m = [], T = [];
    this.domElement = t, this.debug = {
      /**
       * Enables error checking and reporting when shader programs are being compiled
       * @type {boolean}
       */
      checkShaderErrors: !0,
      /**
       * Callback for custom error reporting.
       * @type {?Function}
       */
      onShaderError: null
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this._outputColorSpace = mt, this._useLegacyLights = !1, this.toneMapping = Pn, this.toneMappingExposure = 1;
    const S = this;
    let A = !1, D = 0, R = 0, w = null, k = -1, E = null;
    const M = new Je(), O = new Je();
    let W = null;
    const P = new Se(0);
    let q = 0, X = t.width, $ = t.height, J = 1, V = null, ee = null;
    const Q = new Je(0, 0, X, $), de = new Je(0, 0, X, $);
    let Fe = !1;
    const Ye = new da();
    let G = !1, te = !1;
    const he = new Ie(), se = new C(), Be = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    function De() {
      return w === null ? J : 1;
    }
    let N = n;
    function Ke(y, I) {
      return t.getContext(y, I);
    }
    try {
      const y = {
        alpha: !0,
        depth: i,
        stencil: r,
        antialias: o,
        premultipliedAlpha: c,
        preserveDrawingBuffer: l,
        powerPreference: h,
        failIfMajorPerformanceCaveat: u
      };
      if ("setAttribute" in t && t.setAttribute("data-engine", `three.js r${ca}`), t.addEventListener("webglcontextlost", x, !1), t.addEventListener("webglcontextrestored", L, !1), t.addEventListener("webglcontextcreationerror", U, !1), N === null) {
        const I = "webgl2";
        if (N = Ke(I, y), N === null)
          throw Ke(I) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (y) {
      throw console.error("THREE.WebGLRenderer: " + y.message), y;
    }
    let ge, Ze, xe, ke, Ae, He, nt, b, v, H, Y, K, Z, me, oe, ae, ye, ie, pe, Ve, _e, le, be, Ne;
    function $e() {
      ge = new op(N), ge.init(), le = new Gm(N, ge), Ze = new tp(N, ge, e, le), xe = new Hm(N), ke = new hp(N), Ae = new wm(), He = new Vm(N, ge, xe, Ae, Ze, le, ke), nt = new ip(S), b = new ap(S), v = new gu(N), be = new Qf(N, v), H = new cp(N, v, ke, be), Y = new dp(N, H, v, ke), pe = new up(N, Ze, He), ae = new np(Ae), K = new bm(S, nt, b, ge, Ze, be, ae), Z = new $m(S, Ae), me = new Cm(), oe = new Um(ge), ie = new Jf(S, nt, b, xe, Y, d, c), ye = new zm(S, Y, Ze), Ne = new Jm(N, ke, Ze, xe), Ve = new ep(N, ge, ke), _e = new lp(N, ge, ke), ke.programs = K.programs, S.capabilities = Ze, S.extensions = ge, S.properties = Ae, S.renderLists = me, S.shadowMap = ye, S.state = xe, S.info = ke;
    }
    $e();
    const Re = new Km(S, N);
    this.xr = Re, this.getContext = function() {
      return N;
    }, this.getContextAttributes = function() {
      return N.getContextAttributes();
    }, this.forceContextLoss = function() {
      const y = ge.get("WEBGL_lose_context");
      y && y.loseContext();
    }, this.forceContextRestore = function() {
      const y = ge.get("WEBGL_lose_context");
      y && y.restoreContext();
    }, this.getPixelRatio = function() {
      return J;
    }, this.setPixelRatio = function(y) {
      y !== void 0 && (J = y, this.setSize(X, $, !1));
    }, this.getSize = function(y) {
      return y.set(X, $);
    }, this.setSize = function(y, I, z = !0) {
      if (Re.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      X = y, $ = I, t.width = Math.floor(y * J), t.height = Math.floor(I * J), z === !0 && (t.style.width = y + "px", t.style.height = I + "px"), this.setViewport(0, 0, y, I);
    }, this.getDrawingBufferSize = function(y) {
      return y.set(X * J, $ * J).floor();
    }, this.setDrawingBufferSize = function(y, I, z) {
      X = y, $ = I, J = z, t.width = Math.floor(y * z), t.height = Math.floor(I * z), this.setViewport(0, 0, y, I);
    }, this.getCurrentViewport = function(y) {
      return y.copy(M);
    }, this.getViewport = function(y) {
      return y.copy(Q);
    }, this.setViewport = function(y, I, z, F) {
      y.isVector4 ? Q.set(y.x, y.y, y.z, y.w) : Q.set(y, I, z, F), xe.viewport(M.copy(Q).multiplyScalar(J).round());
    }, this.getScissor = function(y) {
      return y.copy(de);
    }, this.setScissor = function(y, I, z, F) {
      y.isVector4 ? de.set(y.x, y.y, y.z, y.w) : de.set(y, I, z, F), xe.scissor(O.copy(de).multiplyScalar(J).round());
    }, this.getScissorTest = function() {
      return Fe;
    }, this.setScissorTest = function(y) {
      xe.setScissorTest(Fe = y);
    }, this.setOpaqueSort = function(y) {
      V = y;
    }, this.setTransparentSort = function(y) {
      ee = y;
    }, this.getClearColor = function(y) {
      return y.copy(ie.getClearColor());
    }, this.setClearColor = function() {
      ie.setClearColor.apply(ie, arguments);
    }, this.getClearAlpha = function() {
      return ie.getClearAlpha();
    }, this.setClearAlpha = function() {
      ie.setClearAlpha.apply(ie, arguments);
    }, this.clear = function(y = !0, I = !0, z = !0) {
      let F = 0;
      if (y) {
        let B = !1;
        if (w !== null) {
          const ce = w.texture.format;
          B = ce === Ic || ce === Lc || ce === Pc;
        }
        if (B) {
          const ce = w.texture.type, ue = ce === Ln || ce === wi || ce === Ac || ce === as || ce === wc || ce === Rc, fe = ie.getClearColor(), ve = ie.getClearAlpha(), Ee = fe.r, Ce = fe.g, Oe = fe.b;
          ue ? (p[0] = Ee, p[1] = Ce, p[2] = Oe, p[3] = ve, N.clearBufferuiv(N.COLOR, 0, p)) : (g[0] = Ee, g[1] = Ce, g[2] = Oe, g[3] = ve, N.clearBufferiv(N.COLOR, 0, g));
        } else
          F |= N.COLOR_BUFFER_BIT;
      }
      I && (F |= N.DEPTH_BUFFER_BIT), z && (F |= N.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), N.clear(F);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.dispose = function() {
      t.removeEventListener("webglcontextlost", x, !1), t.removeEventListener("webglcontextrestored", L, !1), t.removeEventListener("webglcontextcreationerror", U, !1), me.dispose(), oe.dispose(), Ae.dispose(), nt.dispose(), b.dispose(), Y.dispose(), be.dispose(), Ne.dispose(), K.dispose(), Re.dispose(), Re.removeEventListener("sessionstart", Ge), Re.removeEventListener("sessionend", at), et.stop();
    };
    function x(y) {
      y.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), A = !0;
    }
    function L() {
      console.log("THREE.WebGLRenderer: Context Restored."), A = !1;
      const y = ke.autoReset, I = ye.enabled, z = ye.autoUpdate, F = ye.needsUpdate, B = ye.type;
      $e(), ke.autoReset = y, ye.enabled = I, ye.autoUpdate = z, ye.needsUpdate = F, ye.type = B;
    }
    function U(y) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", y.statusMessage);
    }
    function j(y) {
      const I = y.target;
      I.removeEventListener("dispose", j), ne(I);
    }
    function ne(y) {
      we(y), Ae.remove(y);
    }
    function we(y) {
      const I = Ae.get(y).programs;
      I !== void 0 && (I.forEach(function(z) {
        K.releaseProgram(z);
      }), y.isShaderMaterial && K.releaseShaderCache(y));
    }
    this.renderBufferDirect = function(y, I, z, F, B, ce) {
      I === null && (I = Be);
      const ue = B.isMesh && B.matrixWorld.determinant() < 0, fe = _l(y, I, z, F, B);
      xe.setMaterial(F, ue);
      let ve = z.index, Ee = 1;
      if (F.wireframe === !0) {
        if (ve = H.getWireframeAttribute(z), ve === void 0)
          return;
        Ee = 2;
      }
      const Ce = z.drawRange, Oe = z.attributes.position;
      let ot = Ce.start * Ee, xt = (Ce.start + Ce.count) * Ee;
      ce !== null && (ot = Math.max(ot, ce.start * Ee), xt = Math.min(xt, (ce.start + ce.count) * Ee)), ve !== null ? (ot = Math.max(ot, 0), xt = Math.min(xt, ve.count)) : Oe != null && (ot = Math.max(ot, 0), xt = Math.min(xt, Oe.count));
      const wt = xt - ot;
      if (wt < 0 || wt === 1 / 0)
        return;
      be.setup(B, F, fe, z, ve);
      let Qt, We = Ve;
      if (ve !== null && (Qt = v.get(ve), We = _e, We.setIndex(Qt)), B.isMesh)
        F.wireframe === !0 ? (xe.setLineWidth(F.wireframeLinewidth * De()), We.setMode(N.LINES)) : We.setMode(N.TRIANGLES);
      else if (B.isLine) {
        let Te = F.linewidth;
        Te === void 0 && (Te = 1), xe.setLineWidth(Te * De()), B.isLineSegments ? We.setMode(N.LINES) : B.isLineLoop ? We.setMode(N.LINE_LOOP) : We.setMode(N.LINE_STRIP);
      } else
        B.isPoints ? We.setMode(N.POINTS) : B.isSprite && We.setMode(N.TRIANGLES);
      if (B.isBatchedMesh)
        B._multiDrawInstances !== null ? We.renderMultiDrawInstances(B._multiDrawStarts, B._multiDrawCounts, B._multiDrawCount, B._multiDrawInstances) : We.renderMultiDraw(B._multiDrawStarts, B._multiDrawCounts, B._multiDrawCount);
      else if (B.isInstancedMesh)
        We.renderInstances(ot, wt, B.count);
      else if (z.isInstancedBufferGeometry) {
        const Te = z._maxInstanceCount !== void 0 ? z._maxInstanceCount : 1 / 0, Bi = Math.min(z.instanceCount, Te);
        We.renderInstances(ot, wt, Bi);
      } else
        We.render(ot, wt);
    };
    function Ue(y, I, z) {
      y.transparent === !0 && y.side === Wt && y.forceSinglePass === !1 ? (y.side = bt, y.needsUpdate = !0, hs(y, I, z), y.side = un, y.needsUpdate = !0, hs(y, I, z), y.side = Wt) : hs(y, I, z);
    }
    this.compile = function(y, I, z = null) {
      z === null && (z = y), f = oe.get(z), f.init(I), T.push(f), z.traverseVisible(function(B) {
        B.isLight && B.layers.test(I.layers) && (f.pushLight(B), B.castShadow && f.pushShadow(B));
      }), y !== z && y.traverseVisible(function(B) {
        B.isLight && B.layers.test(I.layers) && (f.pushLight(B), B.castShadow && f.pushShadow(B));
      }), f.setupLights(S._useLegacyLights);
      const F = /* @__PURE__ */ new Set();
      return y.traverse(function(B) {
        const ce = B.material;
        if (ce)
          if (Array.isArray(ce))
            for (let ue = 0; ue < ce.length; ue++) {
              const fe = ce[ue];
              Ue(fe, z, B), F.add(fe);
            }
          else
            Ue(ce, z, B), F.add(ce);
      }), T.pop(), f = null, F;
    }, this.compileAsync = function(y, I, z = null) {
      const F = this.compile(y, I, z);
      return new Promise((B) => {
        function ce() {
          if (F.forEach(function(ue) {
            Ae.get(ue).currentProgram.isReady() && F.delete(ue);
          }), F.size === 0) {
            B(y);
            return;
          }
          setTimeout(ce, 10);
        }
        ge.get("KHR_parallel_shader_compile") !== null ? ce() : setTimeout(ce, 10);
      });
    };
    let st = null;
    function ut(y) {
      st && st(y);
    }
    function Ge() {
      et.stop();
    }
    function at() {
      et.start();
    }
    const et = new jc();
    et.setAnimationLoop(ut), typeof self < "u" && et.setContext(self), this.setAnimationLoop = function(y) {
      st = y, Re.setAnimationLoop(y), y === null ? et.stop() : et.start();
    }, Re.addEventListener("sessionstart", Ge), Re.addEventListener("sessionend", at), this.render = function(y, I) {
      if (I !== void 0 && I.isCamera !== !0) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (A === !0)
        return;
      y.matrixWorldAutoUpdate === !0 && y.updateMatrixWorld(), I.parent === null && I.matrixWorldAutoUpdate === !0 && I.updateMatrixWorld(), Re.enabled === !0 && Re.isPresenting === !0 && (Re.cameraAutoUpdate === !0 && Re.updateCamera(I), I = Re.getCamera()), y.isScene === !0 && y.onBeforeRender(S, y, I, w), f = oe.get(y, T.length), f.init(I), T.push(f), he.multiplyMatrices(I.projectionMatrix, I.matrixWorldInverse), Ye.setFromProjectionMatrix(he), te = this.localClippingEnabled, G = ae.init(this.clippingPlanes, te), _ = me.get(y, m.length), _.init(), m.push(_), fn(y, I, 0, S.sortObjects), _.finish(), S.sortObjects === !0 && _.sort(V, ee);
      const z = Re.enabled === !1 || Re.isPresenting === !1 || Re.hasDepthSensing() === !1;
      z && ie.addToRenderList(_, y), this.info.render.frame++, G === !0 && ae.beginShadows();
      const F = f.state.shadowsArray;
      ye.render(F, y, I), G === !0 && ae.endShadows(), this.info.autoReset === !0 && this.info.reset();
      const B = _.opaque, ce = _.transmissive;
      if (f.setupLights(S._useLegacyLights), I.isArrayCamera) {
        const ue = I.cameras;
        if (ce.length > 0)
          for (let fe = 0, ve = ue.length; fe < ve; fe++) {
            const Ee = ue[fe];
            pn(B, ce, y, Ee);
          }
        z && ie.render(y);
        for (let fe = 0, ve = ue.length; fe < ve; fe++) {
          const Ee = ue[fe];
          It(_, y, Ee, Ee.viewport);
        }
      } else
        ce.length > 0 && pn(B, ce, y, I), z && ie.render(y), It(_, y, I);
      w !== null && (He.updateMultisampleRenderTarget(w), He.updateRenderTargetMipmap(w)), y.isScene === !0 && y.onAfterRender(S, y, I), be.resetDefaultState(), k = -1, E = null, T.pop(), T.length > 0 ? (f = T[T.length - 1], G === !0 && ae.setGlobalState(S.clippingPlanes, f.state.camera)) : f = null, m.pop(), m.length > 0 ? _ = m[m.length - 1] : _ = null;
    };
    function fn(y, I, z, F) {
      if (y.visible === !1)
        return;
      if (y.layers.test(I.layers)) {
        if (y.isGroup)
          z = y.renderOrder;
        else if (y.isLOD)
          y.autoUpdate === !0 && y.update(I);
        else if (y.isLight)
          f.pushLight(y), y.castShadow && f.pushShadow(y);
        else if (y.isSprite) {
          if (!y.frustumCulled || Ye.intersectsSprite(y)) {
            F && se.setFromMatrixPosition(y.matrixWorld).applyMatrix4(he);
            const ue = Y.update(y), fe = y.material;
            fe.visible && _.push(y, ue, fe, z, se.z, null);
          }
        } else if ((y.isMesh || y.isLine || y.isPoints) && (!y.frustumCulled || Ye.intersectsObject(y))) {
          const ue = Y.update(y), fe = y.material;
          if (F && (y.boundingSphere !== void 0 ? (y.boundingSphere === null && y.computeBoundingSphere(), se.copy(y.boundingSphere.center)) : (ue.boundingSphere === null && ue.computeBoundingSphere(), se.copy(ue.boundingSphere.center)), se.applyMatrix4(y.matrixWorld).applyMatrix4(he)), Array.isArray(fe)) {
            const ve = ue.groups;
            for (let Ee = 0, Ce = ve.length; Ee < Ce; Ee++) {
              const Oe = ve[Ee], ot = fe[Oe.materialIndex];
              ot && ot.visible && _.push(y, ue, ot, z, se.z, Oe);
            }
          } else
            fe.visible && _.push(y, ue, fe, z, se.z, null);
        }
      }
      const ce = y.children;
      for (let ue = 0, fe = ce.length; ue < fe; ue++)
        fn(ce[ue], I, z, F);
    }
    function It(y, I, z, F) {
      const B = y.opaque, ce = y.transmissive, ue = y.transparent;
      f.setupLightsView(z), G === !0 && ae.setGlobalState(S.clippingPlanes, z), F && xe.viewport(M.copy(F)), B.length > 0 && Jt(B, I, z), ce.length > 0 && Jt(ce, I, z), ue.length > 0 && Jt(ue, I, z), xe.buffers.depth.setTest(!0), xe.buffers.depth.setMask(!0), xe.buffers.color.setMask(!0), xe.setPolygonOffset(!1);
    }
    function pn(y, I, z, F) {
      if ((z.isScene === !0 ? z.overrideMaterial : null) !== null)
        return;
      f.state.transmissionRenderTarget[F.id] === void 0 && (f.state.transmissionRenderTarget[F.id] = new Yn(1, 1, {
        generateMipmaps: !0,
        type: ge.has("EXT_color_buffer_half_float") || ge.has("EXT_color_buffer_float") ? Qs : Ln,
        minFilter: cn,
        samples: 4,
        stencilBuffer: r,
        resolveDepthBuffer: !1,
        resolveStencilBuffer: !1
      }));
      const ce = f.state.transmissionRenderTarget[F.id], ue = F.viewport || M;
      ce.setSize(ue.z, ue.w);
      const fe = S.getRenderTarget();
      S.setRenderTarget(ce), S.getClearColor(P), q = S.getClearAlpha(), q < 1 && S.setClearColor(16777215, 0.5), S.clear();
      const ve = S.toneMapping;
      S.toneMapping = Pn;
      const Ee = F.viewport;
      if (F.viewport !== void 0 && (F.viewport = void 0), f.setupLightsView(F), G === !0 && ae.setGlobalState(S.clippingPlanes, F), Jt(y, z, F), He.updateMultisampleRenderTarget(ce), He.updateRenderTargetMipmap(ce), ge.has("WEBGL_multisampled_render_to_texture") === !1) {
        let Ce = !1;
        for (let Oe = 0, ot = I.length; Oe < ot; Oe++) {
          const xt = I[Oe], wt = xt.object, Qt = xt.geometry, We = xt.material, Te = xt.group;
          if (We.side === Wt && wt.layers.test(F.layers)) {
            const Bi = We.side;
            We.side = bt, We.needsUpdate = !0, Fi(wt, z, F, Qt, We, Te), We.side = Bi, We.needsUpdate = !0, Ce = !0;
          }
        }
        Ce === !0 && (He.updateMultisampleRenderTarget(ce), He.updateRenderTargetMipmap(ce));
      }
      S.setRenderTarget(fe), S.setClearColor(P, q), Ee !== void 0 && (F.viewport = Ee), S.toneMapping = ve;
    }
    function Jt(y, I, z) {
      const F = I.isScene === !0 ? I.overrideMaterial : null;
      for (let B = 0, ce = y.length; B < ce; B++) {
        const ue = y[B], fe = ue.object, ve = ue.geometry, Ee = F === null ? ue.material : F, Ce = ue.group;
        fe.layers.test(z.layers) && Fi(fe, I, z, ve, Ee, Ce);
      }
    }
    function Fi(y, I, z, F, B, ce) {
      y.onBeforeRender(S, I, z, F, B, ce), y.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse, y.matrixWorld), y.normalMatrix.getNormalMatrix(y.modelViewMatrix), B.onBeforeRender(S, I, z, F, y, ce), B.transparent === !0 && B.side === Wt && B.forceSinglePass === !1 ? (B.side = bt, B.needsUpdate = !0, S.renderBufferDirect(z, I, F, B, y, ce), B.side = un, B.needsUpdate = !0, S.renderBufferDirect(z, I, F, B, y, ce), B.side = Wt) : S.renderBufferDirect(z, I, F, B, y, ce), y.onAfterRender(S, I, z, F, B, ce);
    }
    function hs(y, I, z) {
      I.isScene !== !0 && (I = Be);
      const F = Ae.get(y), B = f.state.lights, ce = f.state.shadowsArray, ue = B.state.version, fe = K.getParameters(y, B.state, ce, I, z), ve = K.getProgramCacheKey(fe);
      let Ee = F.programs;
      F.environment = y.isMeshStandardMaterial ? I.environment : null, F.fog = I.fog, F.envMap = (y.isMeshStandardMaterial ? b : nt).get(y.envMap || F.environment), F.envMapRotation = F.environment !== null && y.envMap === null ? I.environmentRotation : y.envMapRotation, Ee === void 0 && (y.addEventListener("dispose", j), Ee = /* @__PURE__ */ new Map(), F.programs = Ee);
      let Ce = Ee.get(ve);
      if (Ce !== void 0) {
        if (F.currentProgram === Ce && F.lightsStateVersion === ue)
          return Ea(y, fe), Ce;
      } else
        fe.uniforms = K.getUniforms(y), y.onBuild(z, fe, S), y.onBeforeCompile(fe, S), Ce = K.acquireProgram(fe, ve), Ee.set(ve, Ce), F.uniforms = fe.uniforms;
      const Oe = F.uniforms;
      return (!y.isShaderMaterial && !y.isRawShaderMaterial || y.clipping === !0) && (Oe.clippingPlanes = ae.uniform), Ea(y, fe), F.needsLights = vl(y), F.lightsStateVersion = ue, F.needsLights && (Oe.ambientLightColor.value = B.state.ambient, Oe.lightProbe.value = B.state.probe, Oe.directionalLights.value = B.state.directional, Oe.directionalLightShadows.value = B.state.directionalShadow, Oe.spotLights.value = B.state.spot, Oe.spotLightShadows.value = B.state.spotShadow, Oe.rectAreaLights.value = B.state.rectArea, Oe.ltc_1.value = B.state.rectAreaLTC1, Oe.ltc_2.value = B.state.rectAreaLTC2, Oe.pointLights.value = B.state.point, Oe.pointLightShadows.value = B.state.pointShadow, Oe.hemisphereLights.value = B.state.hemi, Oe.directionalShadowMap.value = B.state.directionalShadowMap, Oe.directionalShadowMatrix.value = B.state.directionalShadowMatrix, Oe.spotShadowMap.value = B.state.spotShadowMap, Oe.spotLightMatrix.value = B.state.spotLightMatrix, Oe.spotLightMap.value = B.state.spotLightMap, Oe.pointShadowMap.value = B.state.pointShadowMap, Oe.pointShadowMatrix.value = B.state.pointShadowMatrix), F.currentProgram = Ce, F.uniformsList = null, Ce;
    }
    function ya(y) {
      if (y.uniformsList === null) {
        const I = y.currentProgram.getUniforms();
        y.uniformsList = Hs.seqWithValue(I.seq, y.uniforms);
      }
      return y.uniformsList;
    }
    function Ea(y, I) {
      const z = Ae.get(y);
      z.outputColorSpace = I.outputColorSpace, z.batching = I.batching, z.instancing = I.instancing, z.instancingColor = I.instancingColor, z.instancingMorph = I.instancingMorph, z.skinning = I.skinning, z.morphTargets = I.morphTargets, z.morphNormals = I.morphNormals, z.morphColors = I.morphColors, z.morphTargetsCount = I.morphTargetsCount, z.numClippingPlanes = I.numClippingPlanes, z.numIntersection = I.numClipIntersection, z.vertexAlphas = I.vertexAlphas, z.vertexTangents = I.vertexTangents, z.toneMapping = I.toneMapping;
    }
    function _l(y, I, z, F, B) {
      I.isScene !== !0 && (I = Be), He.resetTextureUnits();
      const ce = I.fog, ue = F.isMeshStandardMaterial ? I.environment : null, fe = w === null ? S.outputColorSpace : w.isXRRenderTarget === !0 ? w.texture.colorSpace : pt, ve = (F.isMeshStandardMaterial ? b : nt).get(F.envMap || ue), Ee = F.vertexColors === !0 && !!z.attributes.color && z.attributes.color.itemSize === 4, Ce = !!z.attributes.tangent && (!!F.normalMap || F.anisotropy > 0), Oe = !!z.morphAttributes.position, ot = !!z.morphAttributes.normal, xt = !!z.morphAttributes.color;
      let wt = Pn;
      F.toneMapped && (w === null || w.isXRRenderTarget === !0) && (wt = S.toneMapping);
      const Qt = z.morphAttributes.position || z.morphAttributes.normal || z.morphAttributes.color, We = Qt !== void 0 ? Qt.length : 0, Te = Ae.get(F), Bi = f.state.lights;
      if (G === !0 && (te === !0 || y !== E)) {
        const Dt = y === E && F.id === k;
        ae.setState(F, y, Dt);
      }
      let it = !1;
      F.version === Te.__version ? (Te.needsLights && Te.lightsStateVersion !== Bi.state.version || Te.outputColorSpace !== fe || B.isBatchedMesh && Te.batching === !1 || !B.isBatchedMesh && Te.batching === !0 || B.isInstancedMesh && Te.instancing === !1 || !B.isInstancedMesh && Te.instancing === !0 || B.isSkinnedMesh && Te.skinning === !1 || !B.isSkinnedMesh && Te.skinning === !0 || B.isInstancedMesh && Te.instancingColor === !0 && B.instanceColor === null || B.isInstancedMesh && Te.instancingColor === !1 && B.instanceColor !== null || B.isInstancedMesh && Te.instancingMorph === !0 && B.morphTexture === null || B.isInstancedMesh && Te.instancingMorph === !1 && B.morphTexture !== null || Te.envMap !== ve || F.fog === !0 && Te.fog !== ce || Te.numClippingPlanes !== void 0 && (Te.numClippingPlanes !== ae.numPlanes || Te.numIntersection !== ae.numIntersection) || Te.vertexAlphas !== Ee || Te.vertexTangents !== Ce || Te.morphTargets !== Oe || Te.morphNormals !== ot || Te.morphColors !== xt || Te.toneMapping !== wt || Te.morphTargetsCount !== We) && (it = !0) : (it = !0, Te.__version = F.version);
      let Un = Te.currentProgram;
      it === !0 && (Un = hs(F, I, B));
      let Ta = !1, ki = !1, sr = !1;
      const vt = Un.getUniforms(), mn = Te.uniforms;
      if (xe.useProgram(Un.program) && (Ta = !0, ki = !0, sr = !0), F.id !== k && (k = F.id, ki = !0), Ta || E !== y) {
        vt.setValue(N, "projectionMatrix", y.projectionMatrix), vt.setValue(N, "viewMatrix", y.matrixWorldInverse);
        const Dt = vt.map.cameraPosition;
        Dt !== void 0 && Dt.setValue(N, se.setFromMatrixPosition(y.matrixWorld)), Ze.logarithmicDepthBuffer && vt.setValue(
          N,
          "logDepthBufFC",
          2 / (Math.log(y.far + 1) / Math.LN2)
        ), (F.isMeshPhongMaterial || F.isMeshToonMaterial || F.isMeshLambertMaterial || F.isMeshBasicMaterial || F.isMeshStandardMaterial || F.isShaderMaterial) && vt.setValue(N, "isOrthographic", y.isOrthographicCamera === !0), E !== y && (E = y, ki = !0, sr = !0);
      }
      if (B.isSkinnedMesh) {
        vt.setOptional(N, B, "bindMatrix"), vt.setOptional(N, B, "bindMatrixInverse");
        const Dt = B.skeleton;
        Dt && (Dt.boneTexture === null && Dt.computeBoneTexture(), vt.setValue(N, "boneTexture", Dt.boneTexture, He));
      }
      B.isBatchedMesh && (vt.setOptional(N, B, "batchingTexture"), vt.setValue(N, "batchingTexture", B._matricesTexture, He));
      const rr = z.morphAttributes;
      if ((rr.position !== void 0 || rr.normal !== void 0 || rr.color !== void 0) && pe.update(B, z, Un), (ki || Te.receiveShadow !== B.receiveShadow) && (Te.receiveShadow = B.receiveShadow, vt.setValue(N, "receiveShadow", B.receiveShadow)), F.isMeshGouraudMaterial && F.envMap !== null && (mn.envMap.value = ve, mn.flipEnvMap.value = ve.isCubeTexture && ve.isRenderTargetTexture === !1 ? -1 : 1), F.isMeshStandardMaterial && F.envMap === null && I.environment !== null && (mn.envMapIntensity.value = I.environmentIntensity), ki && (vt.setValue(N, "toneMappingExposure", S.toneMappingExposure), Te.needsLights && xl(mn, sr), ce && F.fog === !0 && Z.refreshFogUniforms(mn, ce), Z.refreshMaterialUniforms(mn, F, J, $, f.state.transmissionRenderTarget[y.id]), Hs.upload(N, ya(Te), mn, He)), F.isShaderMaterial && F.uniformsNeedUpdate === !0 && (Hs.upload(N, ya(Te), mn, He), F.uniformsNeedUpdate = !1), F.isSpriteMaterial && vt.setValue(N, "center", B.center), vt.setValue(N, "modelViewMatrix", B.modelViewMatrix), vt.setValue(N, "normalMatrix", B.normalMatrix), vt.setValue(N, "modelMatrix", B.matrixWorld), F.isShaderMaterial || F.isRawShaderMaterial) {
        const Dt = F.uniformsGroups;
        for (let ar = 0, Ml = Dt.length; ar < Ml; ar++) {
          const Aa = Dt[ar];
          Ne.update(Aa, Un), Ne.bind(Aa, Un);
        }
      }
      return Un;
    }
    function xl(y, I) {
      y.ambientLightColor.needsUpdate = I, y.lightProbe.needsUpdate = I, y.directionalLights.needsUpdate = I, y.directionalLightShadows.needsUpdate = I, y.pointLights.needsUpdate = I, y.pointLightShadows.needsUpdate = I, y.spotLights.needsUpdate = I, y.spotLightShadows.needsUpdate = I, y.rectAreaLights.needsUpdate = I, y.hemisphereLights.needsUpdate = I;
    }
    function vl(y) {
      return y.isMeshLambertMaterial || y.isMeshToonMaterial || y.isMeshPhongMaterial || y.isMeshStandardMaterial || y.isShadowMaterial || y.isShaderMaterial && y.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return D;
    }, this.getActiveMipmapLevel = function() {
      return R;
    }, this.getRenderTarget = function() {
      return w;
    }, this.setRenderTargetTextures = function(y, I, z) {
      Ae.get(y.texture).__webglTexture = I, Ae.get(y.depthTexture).__webglTexture = z;
      const F = Ae.get(y);
      F.__hasExternalTextures = !0, F.__autoAllocateDepthBuffer = z === void 0, F.__autoAllocateDepthBuffer || ge.has("WEBGL_multisampled_render_to_texture") === !0 && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), F.__useRenderToTexture = !1);
    }, this.setRenderTargetFramebuffer = function(y, I) {
      const z = Ae.get(y);
      z.__webglFramebuffer = I, z.__useDefaultFramebuffer = I === void 0;
    }, this.setRenderTarget = function(y, I = 0, z = 0) {
      w = y, D = I, R = z;
      let F = !0, B = null, ce = !1, ue = !1;
      if (y) {
        const ve = Ae.get(y);
        ve.__useDefaultFramebuffer !== void 0 ? (xe.bindFramebuffer(N.FRAMEBUFFER, null), F = !1) : ve.__webglFramebuffer === void 0 ? He.setupRenderTarget(y) : ve.__hasExternalTextures && He.rebindTextures(y, Ae.get(y.texture).__webglTexture, Ae.get(y.depthTexture).__webglTexture);
        const Ee = y.texture;
        (Ee.isData3DTexture || Ee.isDataArrayTexture || Ee.isCompressedArrayTexture) && (ue = !0);
        const Ce = Ae.get(y).__webglFramebuffer;
        y.isWebGLCubeRenderTarget ? (Array.isArray(Ce[I]) ? B = Ce[I][z] : B = Ce[I], ce = !0) : y.samples > 0 && He.useMultisampledRTT(y) === !1 ? B = Ae.get(y).__webglMultisampledFramebuffer : Array.isArray(Ce) ? B = Ce[z] : B = Ce, M.copy(y.viewport), O.copy(y.scissor), W = y.scissorTest;
      } else
        M.copy(Q).multiplyScalar(J).floor(), O.copy(de).multiplyScalar(J).floor(), W = Fe;
      if (xe.bindFramebuffer(N.FRAMEBUFFER, B) && F && xe.drawBuffers(y, B), xe.viewport(M), xe.scissor(O), xe.setScissorTest(W), ce) {
        const ve = Ae.get(y.texture);
        N.framebufferTexture2D(N.FRAMEBUFFER, N.COLOR_ATTACHMENT0, N.TEXTURE_CUBE_MAP_POSITIVE_X + I, ve.__webglTexture, z);
      } else if (ue) {
        const ve = Ae.get(y.texture), Ee = I || 0;
        N.framebufferTextureLayer(N.FRAMEBUFFER, N.COLOR_ATTACHMENT0, ve.__webglTexture, z || 0, Ee);
      }
      k = -1;
    }, this.readRenderTargetPixels = function(y, I, z, F, B, ce, ue) {
      if (!(y && y.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let fe = Ae.get(y).__webglFramebuffer;
      if (y.isWebGLCubeRenderTarget && ue !== void 0 && (fe = fe[ue]), fe) {
        xe.bindFramebuffer(N.FRAMEBUFFER, fe);
        try {
          const ve = y.texture, Ee = ve.format, Ce = ve.type;
          if (!Ze.textureFormatReadable(Ee)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!Ze.textureTypeReadable(Ce)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          I >= 0 && I <= y.width - F && z >= 0 && z <= y.height - B && N.readPixels(I, z, F, B, le.convert(Ee), le.convert(Ce), ce);
        } finally {
          const ve = w !== null ? Ae.get(w).__webglFramebuffer : null;
          xe.bindFramebuffer(N.FRAMEBUFFER, ve);
        }
      }
    }, this.copyFramebufferToTexture = function(y, I, z = 0) {
      const F = Math.pow(2, -z), B = Math.floor(I.image.width * F), ce = Math.floor(I.image.height * F);
      He.setTexture2D(I, 0), N.copyTexSubImage2D(N.TEXTURE_2D, z, 0, 0, y.x, y.y, B, ce), xe.unbindTexture();
    }, this.copyTextureToTexture = function(y, I, z, F = 0) {
      const B = I.image.width, ce = I.image.height, ue = le.convert(z.format), fe = le.convert(z.type);
      He.setTexture2D(z, 0), N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL, z.flipY), N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL, z.premultiplyAlpha), N.pixelStorei(N.UNPACK_ALIGNMENT, z.unpackAlignment), I.isDataTexture ? N.texSubImage2D(N.TEXTURE_2D, F, y.x, y.y, B, ce, ue, fe, I.image.data) : I.isCompressedTexture ? N.compressedTexSubImage2D(N.TEXTURE_2D, F, y.x, y.y, I.mipmaps[0].width, I.mipmaps[0].height, ue, I.mipmaps[0].data) : N.texSubImage2D(N.TEXTURE_2D, F, y.x, y.y, ue, fe, I.image), F === 0 && z.generateMipmaps && N.generateMipmap(N.TEXTURE_2D), xe.unbindTexture();
    }, this.copyTextureToTexture3D = function(y, I, z, F, B = 0) {
      const ce = y.max.x - y.min.x, ue = y.max.y - y.min.y, fe = y.max.z - y.min.z, ve = le.convert(F.format), Ee = le.convert(F.type);
      let Ce;
      if (F.isData3DTexture)
        He.setTexture3D(F, 0), Ce = N.TEXTURE_3D;
      else if (F.isDataArrayTexture || F.isCompressedArrayTexture)
        He.setTexture2DArray(F, 0), Ce = N.TEXTURE_2D_ARRAY;
      else {
        console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");
        return;
      }
      N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL, F.flipY), N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL, F.premultiplyAlpha), N.pixelStorei(N.UNPACK_ALIGNMENT, F.unpackAlignment);
      const Oe = N.getParameter(N.UNPACK_ROW_LENGTH), ot = N.getParameter(N.UNPACK_IMAGE_HEIGHT), xt = N.getParameter(N.UNPACK_SKIP_PIXELS), wt = N.getParameter(N.UNPACK_SKIP_ROWS), Qt = N.getParameter(N.UNPACK_SKIP_IMAGES), We = z.isCompressedTexture ? z.mipmaps[B] : z.image;
      N.pixelStorei(N.UNPACK_ROW_LENGTH, We.width), N.pixelStorei(N.UNPACK_IMAGE_HEIGHT, We.height), N.pixelStorei(N.UNPACK_SKIP_PIXELS, y.min.x), N.pixelStorei(N.UNPACK_SKIP_ROWS, y.min.y), N.pixelStorei(N.UNPACK_SKIP_IMAGES, y.min.z), z.isDataTexture || z.isData3DTexture ? N.texSubImage3D(Ce, B, I.x, I.y, I.z, ce, ue, fe, ve, Ee, We.data) : F.isCompressedArrayTexture ? N.compressedTexSubImage3D(Ce, B, I.x, I.y, I.z, ce, ue, fe, ve, We.data) : N.texSubImage3D(Ce, B, I.x, I.y, I.z, ce, ue, fe, ve, Ee, We), N.pixelStorei(N.UNPACK_ROW_LENGTH, Oe), N.pixelStorei(N.UNPACK_IMAGE_HEIGHT, ot), N.pixelStorei(N.UNPACK_SKIP_PIXELS, xt), N.pixelStorei(N.UNPACK_SKIP_ROWS, wt), N.pixelStorei(N.UNPACK_SKIP_IMAGES, Qt), B === 0 && F.generateMipmaps && N.generateMipmap(Ce), xe.unbindTexture();
    }, this.initTexture = function(y) {
      y.isCubeTexture ? He.setTextureCube(y, 0) : y.isData3DTexture ? He.setTexture3D(y, 0) : y.isDataArrayTexture || y.isCompressedArrayTexture ? He.setTexture2DArray(y, 0) : He.setTexture2D(y, 0), xe.unbindTexture();
    }, this.resetState = function() {
      D = 0, R = 0, w = null, xe.reset(), be.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  get coordinateSystem() {
    return ln;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(e) {
    this._outputColorSpace = e;
    const t = this.getContext();
    t.drawingBufferColorSpace = e === ha ? "display-p3" : "srgb", t.unpackColorSpace = qe.workingColorSpace === er ? "display-p3" : "srgb";
  }
  get useLegacyLights() {
    return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."), this._useLegacyLights;
  }
  set useLegacyLights(e) {
    console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."), this._useLegacyLights = e;
  }
}
class tl extends rt {
  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new jt(), this.environmentIntensity = 1, this.environmentRotation = new jt(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(e, t) {
    return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.fog !== null && (t.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t.object.backgroundIntensity = this.backgroundIntensity), t.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t.object.environmentIntensity = this.environmentIntensity), t.object.environmentRotation = this.environmentRotation.toArray(), t;
  }
}
class eg {
  constructor(e, t) {
    this.isInterleavedBuffer = !0, this.array = e, this.stride = t, this.count = e !== void 0 ? e.length / t : 0, this.usage = Qr, this._updateRange = { offset: 0, count: -1 }, this.updateRanges = [], this.version = 0, this.uuid = Ht();
  }
  onUploadCallback() {
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  get updateRange() {
    return Bc("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."), this._updateRange;
  }
  setUsage(e) {
    return this.usage = e, this;
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
  }
  copyAt(e, t, n) {
    e *= this.stride, n *= t.stride;
    for (let i = 0, r = this.stride; i < r; i++)
      this.array[e + i] = t.array[n + i];
    return this;
  }
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  clone(e) {
    e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Ht()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
    const t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(t, this.stride);
    return n.setUsage(this.usage), n;
  }
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  toJSON(e) {
    return e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Ht()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
      uuid: this.uuid,
      buffer: this.array.buffer._uuid,
      type: this.array.constructor.name,
      stride: this.stride
    };
  }
}
const yt = /* @__PURE__ */ new C();
class ma {
  constructor(e, t, n, i = !1) {
    this.isInterleavedBufferAttribute = !0, this.name = "", this.data = e, this.itemSize = t, this.offset = n, this.normalized = i;
  }
  get count() {
    return this.data.count;
  }
  get array() {
    return this.data.array;
  }
  set needsUpdate(e) {
    this.data.needsUpdate = e;
  }
  applyMatrix4(e) {
    for (let t = 0, n = this.data.count; t < n; t++)
      yt.fromBufferAttribute(this, t), yt.applyMatrix4(e), this.setXYZ(t, yt.x, yt.y, yt.z);
    return this;
  }
  applyNormalMatrix(e) {
    for (let t = 0, n = this.count; t < n; t++)
      yt.fromBufferAttribute(this, t), yt.applyNormalMatrix(e), this.setXYZ(t, yt.x, yt.y, yt.z);
    return this;
  }
  transformDirection(e) {
    for (let t = 0, n = this.count; t < n; t++)
      yt.fromBufferAttribute(this, t), yt.transformDirection(e), this.setXYZ(t, yt.x, yt.y, yt.z);
    return this;
  }
  getComponent(e, t) {
    let n = this.array[e * this.data.stride + this.offset + t];
    return this.normalized && (n = kt(n, this.array)), n;
  }
  setComponent(e, t, n) {
    return this.normalized && (n = je(n, this.array)), this.data.array[e * this.data.stride + this.offset + t] = n, this;
  }
  setX(e, t) {
    return this.normalized && (t = je(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this;
  }
  setY(e, t) {
    return this.normalized && (t = je(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this;
  }
  setZ(e, t) {
    return this.normalized && (t = je(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this;
  }
  setW(e, t) {
    return this.normalized && (t = je(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this;
  }
  getX(e) {
    let t = this.data.array[e * this.data.stride + this.offset];
    return this.normalized && (t = kt(t, this.array)), t;
  }
  getY(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 1];
    return this.normalized && (t = kt(t, this.array)), t;
  }
  getZ(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 2];
    return this.normalized && (t = kt(t, this.array)), t;
  }
  getW(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 3];
    return this.normalized && (t = kt(t, this.array)), t;
  }
  setXY(e, t, n) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = je(t, this.array), n = je(n, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this;
  }
  setXYZ(e, t, n, i) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = je(t, this.array), n = je(n, this.array), i = je(i, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = i, this;
  }
  setXYZW(e, t, n, i, r) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = je(t, this.array), n = je(n, this.array), i = je(i, this.array), r = je(r, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = i, this.data.array[e + 3] = r, this;
  }
  clone(e) {
    if (e === void 0) {
      console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let n = 0; n < this.count; n++) {
        const i = n * this.data.stride + this.offset;
        for (let r = 0; r < this.itemSize; r++)
          t.push(this.data.array[i + r]);
      }
      return new _t(new this.array.constructor(t), this.itemSize, this.normalized);
    } else
      return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.clone(e)), new ma(e.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
  }
  toJSON(e) {
    if (e === void 0) {
      console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let n = 0; n < this.count; n++) {
        const i = n * this.data.stride + this.offset;
        for (let r = 0; r < this.itemSize; r++)
          t.push(this.data.array[i + r]);
      }
      return {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: t,
        normalized: this.normalized
      };
    } else
      return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), {
        isInterleavedBufferAttribute: !0,
        itemSize: this.itemSize,
        data: this.data.uuid,
        offset: this.offset,
        normalized: this.normalized
      };
  }
}
const Yo = /* @__PURE__ */ new C(), jo = /* @__PURE__ */ new Je(), Ko = /* @__PURE__ */ new Je(), tg = /* @__PURE__ */ new C(), Zo = /* @__PURE__ */ new Ie(), Is = /* @__PURE__ */ new C(), Br = /* @__PURE__ */ new Kt(), $o = /* @__PURE__ */ new Ie(), kr = /* @__PURE__ */ new os();
class ng extends Qe {
  constructor(e, t) {
    super(e, t), this.isSkinnedMesh = !0, this.type = "SkinnedMesh", this.bindMode = Pa, this.bindMatrix = new Ie(), this.bindMatrixInverse = new Ie(), this.boundingBox = null, this.boundingSphere = null;
  }
  computeBoundingBox() {
    const e = this.geometry;
    this.boundingBox === null && (this.boundingBox = new dn()), this.boundingBox.makeEmpty();
    const t = e.getAttribute("position");
    for (let n = 0; n < t.count; n++)
      this.getVertexPosition(n, Is), this.boundingBox.expandByPoint(Is);
  }
  computeBoundingSphere() {
    const e = this.geometry;
    this.boundingSphere === null && (this.boundingSphere = new Kt()), this.boundingSphere.makeEmpty();
    const t = e.getAttribute("position");
    for (let n = 0; n < t.count; n++)
      this.getVertexPosition(n, Is), this.boundingSphere.expandByPoint(Is);
  }
  copy(e, t) {
    return super.copy(e, t), this.bindMode = e.bindMode, this.bindMatrix.copy(e.bindMatrix), this.bindMatrixInverse.copy(e.bindMatrixInverse), this.skeleton = e.skeleton, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
  }
  raycast(e, t) {
    const n = this.material, i = this.matrixWorld;
    n !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Br.copy(this.boundingSphere), Br.applyMatrix4(i), e.ray.intersectsSphere(Br) !== !1 && ($o.copy(i).invert(), kr.copy(e.ray).applyMatrix4($o), !(this.boundingBox !== null && kr.intersectsBox(this.boundingBox) === !1) && this._computeIntersections(e, t, kr)));
  }
  getVertexPosition(e, t) {
    return super.getVertexPosition(e, t), this.applyBoneTransform(e, t), t;
  }
  bind(e, t) {
    this.skeleton = e, t === void 0 && (this.updateMatrixWorld(!0), this.skeleton.calculateInverses(), t = this.matrixWorld), this.bindMatrix.copy(t), this.bindMatrixInverse.copy(t).invert();
  }
  pose() {
    this.skeleton.pose();
  }
  normalizeSkinWeights() {
    const e = new Je(), t = this.geometry.attributes.skinWeight;
    for (let n = 0, i = t.count; n < i; n++) {
      e.fromBufferAttribute(t, n);
      const r = 1 / e.manhattanLength();
      r !== 1 / 0 ? e.multiplyScalar(r) : e.set(1, 0, 0, 0), t.setXYZW(n, e.x, e.y, e.z, e.w);
    }
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.bindMode === Pa ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === sh ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : console.warn("THREE.SkinnedMesh: Unrecognized bindMode: " + this.bindMode);
  }
  applyBoneTransform(e, t) {
    const n = this.skeleton, i = this.geometry;
    jo.fromBufferAttribute(i.attributes.skinIndex, e), Ko.fromBufferAttribute(i.attributes.skinWeight, e), Yo.copy(t).applyMatrix4(this.bindMatrix), t.set(0, 0, 0);
    for (let r = 0; r < 4; r++) {
      const a = Ko.getComponent(r);
      if (a !== 0) {
        const o = jo.getComponent(r);
        Zo.multiplyMatrices(n.bones[o].matrixWorld, n.boneInverses[o]), t.addScaledVector(tg.copy(Yo).applyMatrix4(Zo), a);
      }
    }
    return t.applyMatrix4(this.bindMatrixInverse);
  }
}
class nl extends rt {
  constructor() {
    super(), this.isBone = !0, this.type = "Bone";
  }
}
class il extends ft {
  constructor(e = null, t = 1, n = 1, i, r, a, o, c, l = At, h = At, u, d) {
    super(null, a, o, c, l, h, i, r, u, d), this.isDataTexture = !0, this.image = { data: e, width: t, height: n }, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
const Jo = /* @__PURE__ */ new Ie(), ig = /* @__PURE__ */ new Ie();
class ga {
  constructor(e = [], t = []) {
    this.uuid = Ht(), this.bones = e.slice(0), this.boneInverses = t, this.boneMatrices = null, this.boneTexture = null, this.init();
  }
  init() {
    const e = this.bones, t = this.boneInverses;
    if (this.boneMatrices = new Float32Array(e.length * 16), t.length === 0)
      this.calculateInverses();
    else if (e.length !== t.length) {
      console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."), this.boneInverses = [];
      for (let n = 0, i = this.bones.length; n < i; n++)
        this.boneInverses.push(new Ie());
    }
  }
  calculateInverses() {
    this.boneInverses.length = 0;
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = new Ie();
      this.bones[e] && n.copy(this.bones[e].matrixWorld).invert(), this.boneInverses.push(n);
    }
  }
  pose() {
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = this.bones[e];
      n && n.matrixWorld.copy(this.boneInverses[e]).invert();
    }
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = this.bones[e];
      n && (n.parent && n.parent.isBone ? (n.matrix.copy(n.parent.matrixWorld).invert(), n.matrix.multiply(n.matrixWorld)) : n.matrix.copy(n.matrixWorld), n.matrix.decompose(n.position, n.quaternion, n.scale));
    }
  }
  update() {
    const e = this.bones, t = this.boneInverses, n = this.boneMatrices, i = this.boneTexture;
    for (let r = 0, a = e.length; r < a; r++) {
      const o = e[r] ? e[r].matrixWorld : ig;
      Jo.multiplyMatrices(o, t[r]), Jo.toArray(n, r * 16);
    }
    i !== null && (i.needsUpdate = !0);
  }
  clone() {
    return new ga(this.bones, this.boneInverses);
  }
  computeBoneTexture() {
    let e = Math.sqrt(this.bones.length * 4);
    e = Math.ceil(e / 4) * 4, e = Math.max(e, 4);
    const t = new Float32Array(e * e * 4);
    t.set(this.boneMatrices);
    const n = new il(t, e, e, zt, qt);
    return n.needsUpdate = !0, this.boneMatrices = t, this.boneTexture = n, this;
  }
  getBoneByName(e) {
    for (let t = 0, n = this.bones.length; t < n; t++) {
      const i = this.bones[t];
      if (i.name === e)
        return i;
    }
  }
  dispose() {
    this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null);
  }
  fromJSON(e, t) {
    this.uuid = e.uuid;
    for (let n = 0, i = e.bones.length; n < i; n++) {
      const r = e.bones[n];
      let a = t[r];
      a === void 0 && (console.warn("THREE.Skeleton: No bone found with UUID:", r), a = new nl()), this.bones.push(a), this.boneInverses.push(new Ie().fromArray(e.boneInverses[n]));
    }
    return this.init(), this;
  }
  toJSON() {
    const e = {
      metadata: {
        version: 4.6,
        type: "Skeleton",
        generator: "Skeleton.toJSON"
      },
      bones: [],
      boneInverses: []
    };
    e.uuid = this.uuid;
    const t = this.bones, n = this.boneInverses;
    for (let i = 0, r = t.length; i < r; i++) {
      const a = t[i];
      e.bones.push(a.uuid);
      const o = n[i];
      e.boneInverses.push(o.toArray());
    }
    return e;
  }
}
class na extends _t {
  constructor(e, t, n, i = 1) {
    super(e, t, n), this.isInstancedBufferAttribute = !0, this.meshPerAttribute = i;
  }
  copy(e) {
    return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
  }
  toJSON() {
    const e = super.toJSON();
    return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = !0, e;
  }
}
const mi = /* @__PURE__ */ new Ie(), Qo = /* @__PURE__ */ new Ie(), Ds = [], ec = /* @__PURE__ */ new dn(), sg = /* @__PURE__ */ new Ie(), Wi = /* @__PURE__ */ new Qe(), Xi = /* @__PURE__ */ new Kt();
class rg extends Qe {
  constructor(e, t, n) {
    super(e, t), this.isInstancedMesh = !0, this.instanceMatrix = new na(new Float32Array(n * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
    for (let i = 0; i < n; i++)
      this.setMatrixAt(i, sg);
  }
  computeBoundingBox() {
    const e = this.geometry, t = this.count;
    this.boundingBox === null && (this.boundingBox = new dn()), e.boundingBox === null && e.computeBoundingBox(), this.boundingBox.makeEmpty();
    for (let n = 0; n < t; n++)
      this.getMatrixAt(n, mi), ec.copy(e.boundingBox).applyMatrix4(mi), this.boundingBox.union(ec);
  }
  computeBoundingSphere() {
    const e = this.geometry, t = this.count;
    this.boundingSphere === null && (this.boundingSphere = new Kt()), e.boundingSphere === null && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
    for (let n = 0; n < t; n++)
      this.getMatrixAt(n, mi), Xi.copy(e.boundingSphere).applyMatrix4(mi), this.boundingSphere.union(Xi);
  }
  copy(e, t) {
    return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
  }
  getColorAt(e, t) {
    t.fromArray(this.instanceColor.array, e * 3);
  }
  getMatrixAt(e, t) {
    t.fromArray(this.instanceMatrix.array, e * 16);
  }
  getMorphAt(e, t) {
    const n = t.morphTargetInfluences, i = this.morphTexture.source.data.data, r = n.length + 1, a = e * r + 1;
    for (let o = 0; o < n.length; o++)
      n[o] = i[a + o];
  }
  raycast(e, t) {
    const n = this.matrixWorld, i = this.count;
    if (Wi.geometry = this.geometry, Wi.material = this.material, Wi.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Xi.copy(this.boundingSphere), Xi.applyMatrix4(n), e.ray.intersectsSphere(Xi) !== !1))
      for (let r = 0; r < i; r++) {
        this.getMatrixAt(r, mi), Qo.multiplyMatrices(n, mi), Wi.matrixWorld = Qo, Wi.raycast(e, Ds);
        for (let a = 0, o = Ds.length; a < o; a++) {
          const c = Ds[a];
          c.instanceId = r, c.object = this, t.push(c);
        }
        Ds.length = 0;
      }
  }
  setColorAt(e, t) {
    this.instanceColor === null && (this.instanceColor = new na(new Float32Array(this.instanceMatrix.count * 3), 3)), t.toArray(this.instanceColor.array, e * 3);
  }
  setMatrixAt(e, t) {
    t.toArray(this.instanceMatrix.array, e * 16);
  }
  setMorphAt(e, t) {
    const n = t.morphTargetInfluences, i = n.length + 1;
    this.morphTexture === null && (this.morphTexture = new il(new Float32Array(i * this.count), i, this.count, Cc, qt));
    const r = this.morphTexture.source.data.data;
    let a = 0;
    for (let l = 0; l < n.length; l++)
      a += n[l];
    const o = this.geometry.morphTargetsRelative ? 1 : 1 - a, c = i * e;
    r[c] = o, r.set(n, c + 1);
  }
  updateMorphTargets() {
  }
  dispose() {
    return this.dispatchEvent({ type: "dispose" }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null), this;
  }
}
class sl extends Yt {
  constructor(e) {
    super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new Se(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
  }
}
const Ks = /* @__PURE__ */ new C(), Zs = /* @__PURE__ */ new C(), tc = /* @__PURE__ */ new Ie(), qi = /* @__PURE__ */ new os(), Ns = /* @__PURE__ */ new Kt(), zr = /* @__PURE__ */ new C(), nc = /* @__PURE__ */ new C();
class _a extends rt {
  constructor(e = new Vt(), t = new sl()) {
    super(), this.isLine = !0, this.type = "Line", this.geometry = e, this.material = t, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position, n = [0];
      for (let i = 1, r = t.count; i < r; i++)
        Ks.fromBufferAttribute(t, i - 1), Zs.fromBufferAttribute(t, i), n[i] = n[i - 1], n[i] += Ks.distanceTo(Zs);
      e.setAttribute("lineDistance", new hn(n, 1));
    } else
      console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  raycast(e, t) {
    const n = this.geometry, i = this.matrixWorld, r = e.params.Line.threshold, a = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), Ns.copy(n.boundingSphere), Ns.applyMatrix4(i), Ns.radius += r, e.ray.intersectsSphere(Ns) === !1)
      return;
    tc.copy(i).invert(), qi.copy(e.ray).applyMatrix4(tc);
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), c = o * o, l = this.isLineSegments ? 2 : 1, h = n.index, d = n.attributes.position;
    if (h !== null) {
      const p = Math.max(0, a.start), g = Math.min(h.count, a.start + a.count);
      for (let _ = p, f = g - 1; _ < f; _ += l) {
        const m = h.getX(_), T = h.getX(_ + 1), S = Us(this, e, qi, c, m, T);
        S && t.push(S);
      }
      if (this.isLineLoop) {
        const _ = h.getX(g - 1), f = h.getX(p), m = Us(this, e, qi, c, _, f);
        m && t.push(m);
      }
    } else {
      const p = Math.max(0, a.start), g = Math.min(d.count, a.start + a.count);
      for (let _ = p, f = g - 1; _ < f; _ += l) {
        const m = Us(this, e, qi, c, _, _ + 1);
        m && t.push(m);
      }
      if (this.isLineLoop) {
        const _ = Us(this, e, qi, c, g - 1, p);
        _ && t.push(_);
      }
    }
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const i = t[n[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = i.length; r < a; r++) {
          const o = i[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
}
function Us(s, e, t, n, i, r) {
  const a = s.geometry.attributes.position;
  if (Ks.fromBufferAttribute(a, i), Zs.fromBufferAttribute(a, r), t.distanceSqToSegment(Ks, Zs, zr, nc) > n)
    return;
  zr.applyMatrix4(s.matrixWorld);
  const c = e.ray.origin.distanceTo(zr);
  if (!(c < e.near || c > e.far))
    return {
      distance: c,
      // What do we want? intersection point on the ray or on the segment??
      // point: raycaster.ray.at( distance ),
      point: nc.clone().applyMatrix4(s.matrixWorld),
      index: i,
      face: null,
      faceIndex: null,
      object: s
    };
}
const ic = /* @__PURE__ */ new C(), sc = /* @__PURE__ */ new C();
class ag extends _a {
  constructor(e, t) {
    super(e, t), this.isLineSegments = !0, this.type = "LineSegments";
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position, n = [];
      for (let i = 0, r = t.count; i < r; i += 2)
        ic.fromBufferAttribute(t, i), sc.fromBufferAttribute(t, i + 1), n[i] = i === 0 ? 0 : n[i - 1], n[i + 1] = n[i] + ic.distanceTo(sc);
      e.setAttribute("lineDistance", new hn(n, 1));
    } else
      console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}
class og extends _a {
  constructor(e, t) {
    super(e, t), this.isLineLoop = !0, this.type = "LineLoop";
  }
}
class rl extends Yt {
  constructor(e) {
    super(), this.isPointsMaterial = !0, this.type = "PointsMaterial", this.color = new Se(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
  }
}
const rc = /* @__PURE__ */ new Ie(), ia = /* @__PURE__ */ new os(), Os = /* @__PURE__ */ new Kt(), Fs = /* @__PURE__ */ new C();
class cg extends rt {
  constructor(e = new Vt(), t = new rl()) {
    super(), this.isPoints = !0, this.type = "Points", this.geometry = e, this.material = t, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  raycast(e, t) {
    const n = this.geometry, i = this.matrixWorld, r = e.params.Points.threshold, a = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), Os.copy(n.boundingSphere), Os.applyMatrix4(i), Os.radius += r, e.ray.intersectsSphere(Os) === !1)
      return;
    rc.copy(i).invert(), ia.copy(e.ray).applyMatrix4(rc);
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), c = o * o, l = n.index, u = n.attributes.position;
    if (l !== null) {
      const d = Math.max(0, a.start), p = Math.min(l.count, a.start + a.count);
      for (let g = d, _ = p; g < _; g++) {
        const f = l.getX(g);
        Fs.fromBufferAttribute(u, f), ac(Fs, f, c, i, e, t, this);
      }
    } else {
      const d = Math.max(0, a.start), p = Math.min(u.count, a.start + a.count);
      for (let g = d, _ = p; g < _; g++)
        Fs.fromBufferAttribute(u, g), ac(Fs, g, c, i, e, t, this);
    }
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const i = t[n[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = i.length; r < a; r++) {
          const o = i[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
}
function ac(s, e, t, n, i, r, a) {
  const o = ia.distanceSqToPoint(s);
  if (o < t) {
    const c = new C();
    ia.closestPointToPoint(s, c), c.applyMatrix4(n);
    const l = i.ray.origin.distanceTo(c);
    if (l < i.near || l > i.far)
      return;
    r.push({
      distance: l,
      distanceToRay: Math.sqrt(o),
      point: c,
      index: e,
      face: null,
      object: a
    });
  }
}
class ss extends Yt {
  constructor(e) {
    super(), this.isMeshStandardMaterial = !0, this.defines = { STANDARD: "" }, this.type = "MeshStandardMaterial", this.color = new Se(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new Se(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Nc, this.normalScale = new Me(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new jt(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.defines = { STANDARD: "" }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
  }
}
class Zt extends ss {
  constructor(e) {
    super(), this.isMeshPhysicalMaterial = !0, this.defines = {
      STANDARD: "",
      PHYSICAL: ""
    }, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new Me(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", {
      get: function() {
        return gt(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
      },
      set: function(t) {
        this.ior = (1 + 0.4 * t) / (1 - 0.4 * t);
      }
    }), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [100, 400], this.iridescenceThicknessMap = null, this.sheenColor = new Se(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = 1 / 0, this.attenuationColor = new Se(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new Se(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._sheen = 0, this._transmission = 0, this.setValues(e);
  }
  get anisotropy() {
    return this._anisotropy;
  }
  set anisotropy(e) {
    this._anisotropy > 0 != e > 0 && this.version++, this._anisotropy = e;
  }
  get clearcoat() {
    return this._clearcoat;
  }
  set clearcoat(e) {
    this._clearcoat > 0 != e > 0 && this.version++, this._clearcoat = e;
  }
  get iridescence() {
    return this._iridescence;
  }
  set iridescence(e) {
    this._iridescence > 0 != e > 0 && this.version++, this._iridescence = e;
  }
  get dispersion() {
    return this._dispersion;
  }
  set dispersion(e) {
    this._dispersion > 0 != e > 0 && this.version++, this._dispersion = e;
  }
  get sheen() {
    return this._sheen;
  }
  set sheen(e) {
    this._sheen > 0 != e > 0 && this.version++, this._sheen = e;
  }
  get transmission() {
    return this._transmission;
  }
  set transmission(e) {
    this._transmission > 0 != e > 0 && this.version++, this._transmission = e;
  }
  copy(e) {
    return super.copy(e), this.defines = {
      STANDARD: "",
      PHYSICAL: ""
    }, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.anisotropyMap = e.anisotropyMap, this.clearcoat = e.clearcoat, this.clearcoatMap = e.clearcoatMap, this.clearcoatRoughness = e.clearcoatRoughness, this.clearcoatRoughnessMap = e.clearcoatRoughnessMap, this.clearcoatNormalMap = e.clearcoatNormalMap, this.clearcoatNormalScale.copy(e.clearcoatNormalScale), this.dispersion = e.dispersion, this.ior = e.ior, this.iridescence = e.iridescence, this.iridescenceMap = e.iridescenceMap, this.iridescenceIOR = e.iridescenceIOR, this.iridescenceThicknessRange = [...e.iridescenceThicknessRange], this.iridescenceThicknessMap = e.iridescenceThicknessMap, this.sheen = e.sheen, this.sheenColor.copy(e.sheenColor), this.sheenColorMap = e.sheenColorMap, this.sheenRoughness = e.sheenRoughness, this.sheenRoughnessMap = e.sheenRoughnessMap, this.transmission = e.transmission, this.transmissionMap = e.transmissionMap, this.thickness = e.thickness, this.thicknessMap = e.thicknessMap, this.attenuationDistance = e.attenuationDistance, this.attenuationColor.copy(e.attenuationColor), this.specularIntensity = e.specularIntensity, this.specularIntensityMap = e.specularIntensityMap, this.specularColor.copy(e.specularColor), this.specularColorMap = e.specularColorMap, this;
  }
}
function Bs(s, e, t) {
  return !s || // let 'undefined' and 'null' pass
  !t && s.constructor === e ? s : typeof e.BYTES_PER_ELEMENT == "number" ? new e(s) : Array.prototype.slice.call(s);
}
function lg(s) {
  return ArrayBuffer.isView(s) && !(s instanceof DataView);
}
function hg(s) {
  function e(i, r) {
    return s[i] - s[r];
  }
  const t = s.length, n = new Array(t);
  for (let i = 0; i !== t; ++i)
    n[i] = i;
  return n.sort(e), n;
}
function oc(s, e, t) {
  const n = s.length, i = new s.constructor(n);
  for (let r = 0, a = 0; a !== n; ++r) {
    const o = t[r] * e;
    for (let c = 0; c !== e; ++c)
      i[a++] = s[o + c];
  }
  return i;
}
function al(s, e, t, n) {
  let i = 1, r = s[0];
  for (; r !== void 0 && r[n] === void 0; )
    r = s[i++];
  if (r === void 0)
    return;
  let a = r[n];
  if (a !== void 0)
    if (Array.isArray(a))
      do
        a = r[n], a !== void 0 && (e.push(r.time), t.push.apply(t, a)), r = s[i++];
      while (r !== void 0);
    else if (a.toArray !== void 0)
      do
        a = r[n], a !== void 0 && (e.push(r.time), a.toArray(t, t.length)), r = s[i++];
      while (r !== void 0);
    else
      do
        a = r[n], a !== void 0 && (e.push(r.time), t.push(a)), r = s[i++];
      while (r !== void 0);
}
class cs {
  constructor(e, t, n, i) {
    this.parameterPositions = e, this._cachedIndex = 0, this.resultBuffer = i !== void 0 ? i : new t.constructor(n), this.sampleValues = t, this.valueSize = n, this.settings = null, this.DefaultSettings_ = {};
  }
  evaluate(e) {
    const t = this.parameterPositions;
    let n = this._cachedIndex, i = t[n], r = t[n - 1];
    e: {
      t: {
        let a;
        n: {
          i:
            if (!(e < i)) {
              for (let o = n + 2; ; ) {
                if (i === void 0) {
                  if (e < r)
                    break i;
                  return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
                }
                if (n === o)
                  break;
                if (r = i, i = t[++n], e < i)
                  break t;
              }
              a = t.length;
              break n;
            }
          if (!(e >= r)) {
            const o = t[1];
            e < o && (n = 2, r = o);
            for (let c = n - 2; ; ) {
              if (r === void 0)
                return this._cachedIndex = 0, this.copySampleValue_(0);
              if (n === c)
                break;
              if (i = r, r = t[--n - 1], e >= r)
                break t;
            }
            a = n, n = 0;
            break n;
          }
          break e;
        }
        for (; n < a; ) {
          const o = n + a >>> 1;
          e < t[o] ? a = o : n = o + 1;
        }
        if (i = t[n], r = t[n - 1], r === void 0)
          return this._cachedIndex = 0, this.copySampleValue_(0);
        if (i === void 0)
          return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
      }
      this._cachedIndex = n, this.intervalChanged_(n, r, i);
    }
    return this.interpolate_(n, r, e, i);
  }
  getSettings_() {
    return this.settings || this.DefaultSettings_;
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, n = this.sampleValues, i = this.valueSize, r = e * i;
    for (let a = 0; a !== i; ++a)
      t[a] = n[r + a];
    return t;
  }
  // Template methods for derived classes:
  interpolate_() {
    throw new Error("call to abstract method");
  }
  intervalChanged_() {
  }
}
class ug extends cs {
  constructor(e, t, n, i) {
    super(e, t, n, i), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = {
      endingStart: _i,
      endingEnd: _i
    };
  }
  intervalChanged_(e, t, n) {
    const i = this.parameterPositions;
    let r = e - 2, a = e + 1, o = i[r], c = i[a];
    if (o === void 0)
      switch (this.getSettings_().endingStart) {
        case xi:
          r = e, o = 2 * t - n;
          break;
        case Ws:
          r = i.length - 2, o = t + i[r] - i[r + 1];
          break;
        default:
          r = e, o = n;
      }
    if (c === void 0)
      switch (this.getSettings_().endingEnd) {
        case xi:
          a = e, c = 2 * n - t;
          break;
        case Ws:
          a = 1, c = n + i[1] - i[0];
          break;
        default:
          a = e - 1, c = t;
      }
    const l = (n - t) * 0.5, h = this.valueSize;
    this._weightPrev = l / (t - o), this._weightNext = l / (c - n), this._offsetPrev = r * h, this._offsetNext = a * h;
  }
  interpolate_(e, t, n, i) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, c = e * o, l = c - o, h = this._offsetPrev, u = this._offsetNext, d = this._weightPrev, p = this._weightNext, g = (n - t) / (i - t), _ = g * g, f = _ * g, m = -d * f + 2 * d * _ - d * g, T = (1 + d) * f + (-1.5 - 2 * d) * _ + (-0.5 + d) * g + 1, S = (-1 - p) * f + (1.5 + p) * _ + 0.5 * g, A = p * f - p * _;
    for (let D = 0; D !== o; ++D)
      r[D] = m * a[h + D] + T * a[l + D] + S * a[c + D] + A * a[u + D];
    return r;
  }
}
class ol extends cs {
  constructor(e, t, n, i) {
    super(e, t, n, i);
  }
  interpolate_(e, t, n, i) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, c = e * o, l = c - o, h = (n - t) / (i - t), u = 1 - h;
    for (let d = 0; d !== o; ++d)
      r[d] = a[l + d] * u + a[c + d] * h;
    return r;
  }
}
class dg extends cs {
  constructor(e, t, n, i) {
    super(e, t, n, i);
  }
  interpolate_(e) {
    return this.copySampleValue_(e - 1);
  }
}
class $t {
  constructor(e, t, n, i) {
    if (e === void 0)
      throw new Error("THREE.KeyframeTrack: track name is undefined");
    if (t === void 0 || t.length === 0)
      throw new Error("THREE.KeyframeTrack: no keyframes in track named " + e);
    this.name = e, this.times = Bs(t, this.TimeBufferType), this.values = Bs(n, this.ValueBufferType), this.setInterpolation(i || this.DefaultInterpolation);
  }
  // Serialization (in static context, because of constructor invocation
  // and automatic invocation of .toJSON):
  static toJSON(e) {
    const t = e.constructor;
    let n;
    if (t.toJSON !== this.toJSON)
      n = t.toJSON(e);
    else {
      n = {
        name: e.name,
        times: Bs(e.times, Array),
        values: Bs(e.values, Array)
      };
      const i = e.getInterpolation();
      i !== e.DefaultInterpolation && (n.interpolation = i);
    }
    return n.type = e.ValueTypeName, n;
  }
  InterpolantFactoryMethodDiscrete(e) {
    return new dg(this.times, this.values, this.getValueSize(), e);
  }
  InterpolantFactoryMethodLinear(e) {
    return new ol(this.times, this.values, this.getValueSize(), e);
  }
  InterpolantFactoryMethodSmooth(e) {
    return new ug(this.times, this.values, this.getValueSize(), e);
  }
  setInterpolation(e) {
    let t;
    switch (e) {
      case ns:
        t = this.InterpolantFactoryMethodDiscrete;
        break;
      case Ri:
        t = this.InterpolantFactoryMethodLinear;
        break;
      case dr:
        t = this.InterpolantFactoryMethodSmooth;
        break;
    }
    if (t === void 0) {
      const n = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
      if (this.createInterpolant === void 0)
        if (e !== this.DefaultInterpolation)
          this.setInterpolation(this.DefaultInterpolation);
        else
          throw new Error(n);
      return console.warn("THREE.KeyframeTrack:", n), this;
    }
    return this.createInterpolant = t, this;
  }
  getInterpolation() {
    switch (this.createInterpolant) {
      case this.InterpolantFactoryMethodDiscrete:
        return ns;
      case this.InterpolantFactoryMethodLinear:
        return Ri;
      case this.InterpolantFactoryMethodSmooth:
        return dr;
    }
  }
  getValueSize() {
    return this.values.length / this.times.length;
  }
  // move all keyframes either forwards or backwards in time
  shift(e) {
    if (e !== 0) {
      const t = this.times;
      for (let n = 0, i = t.length; n !== i; ++n)
        t[n] += e;
    }
    return this;
  }
  // scale all keyframe times by a factor (useful for frame <-> seconds conversions)
  scale(e) {
    if (e !== 1) {
      const t = this.times;
      for (let n = 0, i = t.length; n !== i; ++n)
        t[n] *= e;
    }
    return this;
  }
  // removes keyframes before and after animation without changing any values within the range [startTime, endTime].
  // IMPORTANT: We do not shift around keys to the start of the track time, because for interpolated keys this will change their values
  trim(e, t) {
    const n = this.times, i = n.length;
    let r = 0, a = i - 1;
    for (; r !== i && n[r] < e; )
      ++r;
    for (; a !== -1 && n[a] > t; )
      --a;
    if (++a, r !== 0 || a !== i) {
      r >= a && (a = Math.max(a, 1), r = a - 1);
      const o = this.getValueSize();
      this.times = n.slice(r, a), this.values = this.values.slice(r * o, a * o);
    }
    return this;
  }
  // ensure we do not get a GarbageInGarbageOut situation, make sure tracks are at least minimally viable
  validate() {
    let e = !0;
    const t = this.getValueSize();
    t - Math.floor(t) !== 0 && (console.error("THREE.KeyframeTrack: Invalid value size in track.", this), e = !1);
    const n = this.times, i = this.values, r = n.length;
    r === 0 && (console.error("THREE.KeyframeTrack: Track is empty.", this), e = !1);
    let a = null;
    for (let o = 0; o !== r; o++) {
      const c = n[o];
      if (typeof c == "number" && isNaN(c)) {
        console.error("THREE.KeyframeTrack: Time is not a valid number.", this, o, c), e = !1;
        break;
      }
      if (a !== null && a > c) {
        console.error("THREE.KeyframeTrack: Out of order keys.", this, o, c, a), e = !1;
        break;
      }
      a = c;
    }
    if (i !== void 0 && lg(i))
      for (let o = 0, c = i.length; o !== c; ++o) {
        const l = i[o];
        if (isNaN(l)) {
          console.error("THREE.KeyframeTrack: Value is not a valid number.", this, o, l), e = !1;
          break;
        }
      }
    return e;
  }
  // removes equivalent sequential keys as common in morph target sequences
  // (0,0,0,0,1,1,1,0,0,0,0,0,0,0) --> (0,0,1,1,0,0)
  optimize() {
    const e = this.times.slice(), t = this.values.slice(), n = this.getValueSize(), i = this.getInterpolation() === dr, r = e.length - 1;
    let a = 1;
    for (let o = 1; o < r; ++o) {
      let c = !1;
      const l = e[o], h = e[o + 1];
      if (l !== h && (o !== 1 || l !== e[0]))
        if (i)
          c = !0;
        else {
          const u = o * n, d = u - n, p = u + n;
          for (let g = 0; g !== n; ++g) {
            const _ = t[u + g];
            if (_ !== t[d + g] || _ !== t[p + g]) {
              c = !0;
              break;
            }
          }
        }
      if (c) {
        if (o !== a) {
          e[a] = e[o];
          const u = o * n, d = a * n;
          for (let p = 0; p !== n; ++p)
            t[d + p] = t[u + p];
        }
        ++a;
      }
    }
    if (r > 0) {
      e[a] = e[r];
      for (let o = r * n, c = a * n, l = 0; l !== n; ++l)
        t[c + l] = t[o + l];
      ++a;
    }
    return a !== e.length ? (this.times = e.slice(0, a), this.values = t.slice(0, a * n)) : (this.times = e, this.values = t), this;
  }
  clone() {
    const e = this.times.slice(), t = this.values.slice(), n = this.constructor, i = new n(this.name, e, t);
    return i.createInterpolant = this.createInterpolant, i;
  }
}
$t.prototype.TimeBufferType = Float32Array;
$t.prototype.ValueBufferType = Float32Array;
$t.prototype.DefaultInterpolation = Ri;
class Ui extends $t {
}
Ui.prototype.ValueTypeName = "bool";
Ui.prototype.ValueBufferType = Array;
Ui.prototype.DefaultInterpolation = ns;
Ui.prototype.InterpolantFactoryMethodLinear = void 0;
Ui.prototype.InterpolantFactoryMethodSmooth = void 0;
class cl extends $t {
}
cl.prototype.ValueTypeName = "color";
class Li extends $t {
}
Li.prototype.ValueTypeName = "number";
class fg extends cs {
  constructor(e, t, n, i) {
    super(e, t, n, i);
  }
  interpolate_(e, t, n, i) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, c = (n - t) / (i - t);
    let l = e * o;
    for (let h = l + o; l !== h; l += 4)
      Lt.slerpFlat(r, 0, a, l - o, a, l, c);
    return r;
  }
}
class jn extends $t {
  InterpolantFactoryMethodLinear(e) {
    return new fg(this.times, this.values, this.getValueSize(), e);
  }
}
jn.prototype.ValueTypeName = "quaternion";
jn.prototype.DefaultInterpolation = Ri;
jn.prototype.InterpolantFactoryMethodSmooth = void 0;
class Oi extends $t {
}
Oi.prototype.ValueTypeName = "string";
Oi.prototype.ValueBufferType = Array;
Oi.prototype.DefaultInterpolation = ns;
Oi.prototype.InterpolantFactoryMethodLinear = void 0;
Oi.prototype.InterpolantFactoryMethodSmooth = void 0;
class Ii extends $t {
}
Ii.prototype.ValueTypeName = "vector";
class sa {
  constructor(e = "", t = -1, n = [], i = la) {
    this.name = e, this.tracks = n, this.duration = t, this.blendMode = i, this.uuid = Ht(), this.duration < 0 && this.resetDuration();
  }
  static parse(e) {
    const t = [], n = e.tracks, i = 1 / (e.fps || 1);
    for (let a = 0, o = n.length; a !== o; ++a)
      t.push(mg(n[a]).scale(i));
    const r = new this(e.name, e.duration, t, e.blendMode);
    return r.uuid = e.uuid, r;
  }
  static toJSON(e) {
    const t = [], n = e.tracks, i = {
      name: e.name,
      duration: e.duration,
      tracks: t,
      uuid: e.uuid,
      blendMode: e.blendMode
    };
    for (let r = 0, a = n.length; r !== a; ++r)
      t.push($t.toJSON(n[r]));
    return i;
  }
  static CreateFromMorphTargetSequence(e, t, n, i) {
    const r = t.length, a = [];
    for (let o = 0; o < r; o++) {
      let c = [], l = [];
      c.push(
        (o + r - 1) % r,
        o,
        (o + 1) % r
      ), l.push(0, 1, 0);
      const h = hg(c);
      c = oc(c, 1, h), l = oc(l, 1, h), !i && c[0] === 0 && (c.push(r), l.push(l[0])), a.push(
        new Li(
          ".morphTargetInfluences[" + t[o].name + "]",
          c,
          l
        ).scale(1 / n)
      );
    }
    return new this(e, -1, a);
  }
  static findByName(e, t) {
    let n = e;
    if (!Array.isArray(e)) {
      const i = e;
      n = i.geometry && i.geometry.animations || i.animations;
    }
    for (let i = 0; i < n.length; i++)
      if (n[i].name === t)
        return n[i];
    return null;
  }
  static CreateClipsFromMorphTargetSequences(e, t, n) {
    const i = {}, r = /^([\w-]*?)([\d]+)$/;
    for (let o = 0, c = e.length; o < c; o++) {
      const l = e[o], h = l.name.match(r);
      if (h && h.length > 1) {
        const u = h[1];
        let d = i[u];
        d || (i[u] = d = []), d.push(l);
      }
    }
    const a = [];
    for (const o in i)
      a.push(this.CreateFromMorphTargetSequence(o, i[o], t, n));
    return a;
  }
  // parse the animation.hierarchy format
  static parseAnimation(e, t) {
    if (!e)
      return console.error("THREE.AnimationClip: No animation in JSONLoader data."), null;
    const n = function(u, d, p, g, _) {
      if (p.length !== 0) {
        const f = [], m = [];
        al(p, f, m, g), f.length !== 0 && _.push(new u(d, f, m));
      }
    }, i = [], r = e.name || "default", a = e.fps || 30, o = e.blendMode;
    let c = e.length || -1;
    const l = e.hierarchy || [];
    for (let u = 0; u < l.length; u++) {
      const d = l[u].keys;
      if (!(!d || d.length === 0))
        if (d[0].morphTargets) {
          const p = {};
          let g;
          for (g = 0; g < d.length; g++)
            if (d[g].morphTargets)
              for (let _ = 0; _ < d[g].morphTargets.length; _++)
                p[d[g].morphTargets[_]] = -1;
          for (const _ in p) {
            const f = [], m = [];
            for (let T = 0; T !== d[g].morphTargets.length; ++T) {
              const S = d[g];
              f.push(S.time), m.push(S.morphTarget === _ ? 1 : 0);
            }
            i.push(new Li(".morphTargetInfluence[" + _ + "]", f, m));
          }
          c = p.length * a;
        } else {
          const p = ".bones[" + t[u].name + "]";
          n(
            Ii,
            p + ".position",
            d,
            "pos",
            i
          ), n(
            jn,
            p + ".quaternion",
            d,
            "rot",
            i
          ), n(
            Ii,
            p + ".scale",
            d,
            "scl",
            i
          );
        }
    }
    return i.length === 0 ? null : new this(r, c, i, o);
  }
  resetDuration() {
    const e = this.tracks;
    let t = 0;
    for (let n = 0, i = e.length; n !== i; ++n) {
      const r = this.tracks[n];
      t = Math.max(t, r.times[r.times.length - 1]);
    }
    return this.duration = t, this;
  }
  trim() {
    for (let e = 0; e < this.tracks.length; e++)
      this.tracks[e].trim(0, this.duration);
    return this;
  }
  validate() {
    let e = !0;
    for (let t = 0; t < this.tracks.length; t++)
      e = e && this.tracks[t].validate();
    return e;
  }
  optimize() {
    for (let e = 0; e < this.tracks.length; e++)
      this.tracks[e].optimize();
    return this;
  }
  clone() {
    const e = [];
    for (let t = 0; t < this.tracks.length; t++)
      e.push(this.tracks[t].clone());
    return new this.constructor(this.name, this.duration, e, this.blendMode);
  }
  toJSON() {
    return this.constructor.toJSON(this);
  }
}
function pg(s) {
  switch (s.toLowerCase()) {
    case "scalar":
    case "double":
    case "float":
    case "number":
    case "integer":
      return Li;
    case "vector":
    case "vector2":
    case "vector3":
    case "vector4":
      return Ii;
    case "color":
      return cl;
    case "quaternion":
      return jn;
    case "bool":
    case "boolean":
      return Ui;
    case "string":
      return Oi;
  }
  throw new Error("THREE.KeyframeTrack: Unsupported typeName: " + s);
}
function mg(s) {
  if (s.type === void 0)
    throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");
  const e = pg(s.type);
  if (s.times === void 0) {
    const t = [], n = [];
    al(s.keys, t, n, "value"), s.times = t, s.values = n;
  }
  return e.parse !== void 0 ? e.parse(s) : new e(s.name, s.times, s.values, s.interpolation);
}
const Rn = {
  enabled: !1,
  files: {},
  add: function(s, e) {
    this.enabled !== !1 && (this.files[s] = e);
  },
  get: function(s) {
    if (this.enabled !== !1)
      return this.files[s];
  },
  remove: function(s) {
    delete this.files[s];
  },
  clear: function() {
    this.files = {};
  }
};
class gg {
  constructor(e, t, n) {
    const i = this;
    let r = !1, a = 0, o = 0, c;
    const l = [];
    this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = n, this.itemStart = function(h) {
      o++, r === !1 && i.onStart !== void 0 && i.onStart(h, a, o), r = !0;
    }, this.itemEnd = function(h) {
      a++, i.onProgress !== void 0 && i.onProgress(h, a, o), a === o && (r = !1, i.onLoad !== void 0 && i.onLoad());
    }, this.itemError = function(h) {
      i.onError !== void 0 && i.onError(h);
    }, this.resolveURL = function(h) {
      return c ? c(h) : h;
    }, this.setURLModifier = function(h) {
      return c = h, this;
    }, this.addHandler = function(h, u) {
      return l.push(h, u), this;
    }, this.removeHandler = function(h) {
      const u = l.indexOf(h);
      return u !== -1 && l.splice(u, 2), this;
    }, this.getHandler = function(h) {
      for (let u = 0, d = l.length; u < d; u += 2) {
        const p = l[u], g = l[u + 1];
        if (p.global && (p.lastIndex = 0), p.test(h))
          return g;
      }
      return null;
    };
  }
}
const _g = /* @__PURE__ */ new gg();
class Kn {
  constructor(e) {
    this.manager = e !== void 0 ? e : _g, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {};
  }
  load() {
  }
  loadAsync(e, t) {
    const n = this;
    return new Promise(function(i, r) {
      n.load(e, i, t, r);
    });
  }
  parse() {
  }
  setCrossOrigin(e) {
    return this.crossOrigin = e, this;
  }
  setWithCredentials(e) {
    return this.withCredentials = e, this;
  }
  setPath(e) {
    return this.path = e, this;
  }
  setResourcePath(e) {
    return this.resourcePath = e, this;
  }
  setRequestHeader(e) {
    return this.requestHeader = e, this;
  }
}
Kn.DEFAULT_MATERIAL_NAME = "__DEFAULT";
const an = {};
class xg extends Error {
  constructor(e, t) {
    super(e), this.response = t;
  }
}
class $s extends Kn {
  constructor(e) {
    super(e);
  }
  load(e, t, n, i) {
    e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const r = Rn.get(e);
    if (r !== void 0)
      return this.manager.itemStart(e), setTimeout(() => {
        t && t(r), this.manager.itemEnd(e);
      }, 0), r;
    if (an[e] !== void 0) {
      an[e].push({
        onLoad: t,
        onProgress: n,
        onError: i
      });
      return;
    }
    an[e] = [], an[e].push({
      onLoad: t,
      onProgress: n,
      onError: i
    });
    const a = new Request(e, {
      headers: new Headers(this.requestHeader),
      credentials: this.withCredentials ? "include" : "same-origin"
      // An abort controller could be added within a future PR
    }), o = this.mimeType, c = this.responseType;
    fetch(a).then((l) => {
      if (l.status === 200 || l.status === 0) {
        if (l.status === 0 && console.warn("THREE.FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || l.body === void 0 || l.body.getReader === void 0)
          return l;
        const h = an[e], u = l.body.getReader(), d = l.headers.get("X-File-Size") || l.headers.get("Content-Length"), p = d ? parseInt(d) : 0, g = p !== 0;
        let _ = 0;
        const f = new ReadableStream({
          start(m) {
            T();
            function T() {
              u.read().then(({ done: S, value: A }) => {
                if (S)
                  m.close();
                else {
                  _ += A.byteLength;
                  const D = new ProgressEvent("progress", { lengthComputable: g, loaded: _, total: p });
                  for (let R = 0, w = h.length; R < w; R++) {
                    const k = h[R];
                    k.onProgress && k.onProgress(D);
                  }
                  m.enqueue(A), T();
                }
              });
            }
          }
        });
        return new Response(f);
      } else
        throw new xg(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`, l);
    }).then((l) => {
      switch (c) {
        case "arraybuffer":
          return l.arrayBuffer();
        case "blob":
          return l.blob();
        case "document":
          return l.text().then((h) => new DOMParser().parseFromString(h, o));
        case "json":
          return l.json();
        default:
          if (o === void 0)
            return l.text();
          {
            const u = /charset="?([^;"\s]*)"?/i.exec(o), d = u && u[1] ? u[1].toLowerCase() : void 0, p = new TextDecoder(d);
            return l.arrayBuffer().then((g) => p.decode(g));
          }
      }
    }).then((l) => {
      Rn.add(e, l);
      const h = an[e];
      delete an[e];
      for (let u = 0, d = h.length; u < d; u++) {
        const p = h[u];
        p.onLoad && p.onLoad(l);
      }
    }).catch((l) => {
      const h = an[e];
      if (h === void 0)
        throw this.manager.itemError(e), l;
      delete an[e];
      for (let u = 0, d = h.length; u < d; u++) {
        const p = h[u];
        p.onError && p.onError(l);
      }
      this.manager.itemError(e);
    }).finally(() => {
      this.manager.itemEnd(e);
    }), this.manager.itemStart(e);
  }
  setResponseType(e) {
    return this.responseType = e, this;
  }
  setMimeType(e) {
    return this.mimeType = e, this;
  }
}
class vg extends Kn {
  constructor(e) {
    super(e);
  }
  load(e, t, n, i) {
    this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const r = this, a = Rn.get(e);
    if (a !== void 0)
      return r.manager.itemStart(e), setTimeout(function() {
        t && t(a), r.manager.itemEnd(e);
      }, 0), a;
    const o = is("img");
    function c() {
      h(), Rn.add(e, this), t && t(this), r.manager.itemEnd(e);
    }
    function l(u) {
      h(), i && i(u), r.manager.itemError(e), r.manager.itemEnd(e);
    }
    function h() {
      o.removeEventListener("load", c, !1), o.removeEventListener("error", l, !1);
    }
    return o.addEventListener("load", c, !1), o.addEventListener("error", l, !1), e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (o.crossOrigin = this.crossOrigin), r.manager.itemStart(e), o.src = e, o;
  }
}
class Mg extends Kn {
  constructor(e) {
    super(e);
  }
  load(e, t, n, i) {
    const r = new ft(), a = new vg(this.manager);
    return a.setCrossOrigin(this.crossOrigin), a.setPath(this.path), a.load(e, function(o) {
      r.image = o, r.needsUpdate = !0, t !== void 0 && t(r);
    }, n, i), r;
  }
}
class xa extends rt {
  constructor(e, t = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new Se(e), this.intensity = t;
  }
  dispose() {
  }
  copy(e, t) {
    return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, this.groundColor !== void 0 && (t.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (t.object.distance = this.distance), this.angle !== void 0 && (t.object.angle = this.angle), this.decay !== void 0 && (t.object.decay = this.decay), this.penumbra !== void 0 && (t.object.penumbra = this.penumbra), this.shadow !== void 0 && (t.object.shadow = this.shadow.toJSON()), t;
  }
}
const Hr = /* @__PURE__ */ new Ie(), cc = /* @__PURE__ */ new C(), lc = /* @__PURE__ */ new C();
class va {
  constructor(e) {
    this.camera = e, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new Me(512, 512), this.map = null, this.mapPass = null, this.matrix = new Ie(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new da(), this._frameExtents = new Me(1, 1), this._viewportCount = 1, this._viewports = [
      new Je(0, 0, 1, 1)
    ];
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(e) {
    const t = this.camera, n = this.matrix;
    cc.setFromMatrixPosition(e.matrixWorld), t.position.copy(cc), lc.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(lc), t.updateMatrixWorld(), Hr.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Hr), n.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1
    ), n.multiply(Hr);
  }
  getViewport(e) {
    return this._viewports[e];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  copy(e) {
    return this.camera = e.camera.clone(), this.bias = e.bias, this.radius = e.radius, this.mapSize.copy(e.mapSize), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const e = {};
    return this.bias !== 0 && (e.bias = this.bias), this.normalBias !== 0 && (e.normalBias = this.normalBias), this.radius !== 1 && (e.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e;
  }
}
class Sg extends va {
  constructor() {
    super(new Tt(50, 1, 0.5, 500)), this.isSpotLightShadow = !0, this.focus = 1;
  }
  updateMatrices(e) {
    const t = this.camera, n = Ci * 2 * e.angle * this.focus, i = this.mapSize.width / this.mapSize.height, r = e.distance || t.far;
    (n !== t.fov || i !== t.aspect || r !== t.far) && (t.fov = n, t.aspect = i, t.far = r, t.updateProjectionMatrix()), super.updateMatrices(e);
  }
  copy(e) {
    return super.copy(e), this.focus = e.focus, this;
  }
}
class yg extends xa {
  constructor(e, t, n = 0, i = Math.PI / 3, r = 0, a = 2) {
    super(e, t), this.isSpotLight = !0, this.type = "SpotLight", this.position.copy(rt.DEFAULT_UP), this.updateMatrix(), this.target = new rt(), this.distance = n, this.angle = i, this.penumbra = r, this.decay = a, this.map = null, this.shadow = new Sg();
  }
  get power() {
    return this.intensity * Math.PI;
  }
  set power(e) {
    this.intensity = e / Math.PI;
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(e, t) {
    return super.copy(e, t), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
  }
}
const hc = /* @__PURE__ */ new Ie(), Yi = /* @__PURE__ */ new C(), Vr = /* @__PURE__ */ new C();
class Eg extends va {
  constructor() {
    super(new Tt(90, 1, 0.5, 500)), this.isPointLightShadow = !0, this._frameExtents = new Me(4, 2), this._viewportCount = 6, this._viewports = [
      // These viewports map a cube-map onto a 2D texture with the
      // following orientation:
      //
      //  xzXZ
      //   y Y
      //
      // X - Positive x direction
      // x - Negative x direction
      // Y - Positive y direction
      // y - Negative y direction
      // Z - Positive z direction
      // z - Negative z direction
      // positive X
      new Je(2, 1, 1, 1),
      // negative X
      new Je(0, 1, 1, 1),
      // positive Z
      new Je(3, 1, 1, 1),
      // negative Z
      new Je(1, 1, 1, 1),
      // positive Y
      new Je(3, 0, 1, 1),
      // negative Y
      new Je(1, 0, 1, 1)
    ], this._cubeDirections = [
      new C(1, 0, 0),
      new C(-1, 0, 0),
      new C(0, 0, 1),
      new C(0, 0, -1),
      new C(0, 1, 0),
      new C(0, -1, 0)
    ], this._cubeUps = [
      new C(0, 1, 0),
      new C(0, 1, 0),
      new C(0, 1, 0),
      new C(0, 1, 0),
      new C(0, 0, 1),
      new C(0, 0, -1)
    ];
  }
  updateMatrices(e, t = 0) {
    const n = this.camera, i = this.matrix, r = e.distance || n.far;
    r !== n.far && (n.far = r, n.updateProjectionMatrix()), Yi.setFromMatrixPosition(e.matrixWorld), n.position.copy(Yi), Vr.copy(n.position), Vr.add(this._cubeDirections[t]), n.up.copy(this._cubeUps[t]), n.lookAt(Vr), n.updateMatrixWorld(), i.makeTranslation(-Yi.x, -Yi.y, -Yi.z), hc.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse), this._frustum.setFromProjectionMatrix(hc);
  }
}
class ll extends xa {
  constructor(e, t, n = 0, i = 2) {
    super(e, t), this.isPointLight = !0, this.type = "PointLight", this.distance = n, this.decay = i, this.shadow = new Eg();
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(e) {
    this.intensity = e / (4 * Math.PI);
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(e, t) {
    return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this;
  }
}
class Tg extends va {
  constructor() {
    super(new fa(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = !0;
  }
}
class Ag extends xa {
  constructor(e, t) {
    super(e, t), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(rt.DEFAULT_UP), this.updateMatrix(), this.target = new rt(), this.shadow = new Tg();
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(e) {
    return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
  }
}
class Qi {
  static decodeText(e) {
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(e);
    let t = "";
    for (let n = 0, i = e.length; n < i; n++)
      t += String.fromCharCode(e[n]);
    try {
      return decodeURIComponent(escape(t));
    } catch {
      return t;
    }
  }
  static extractUrlBase(e) {
    const t = e.lastIndexOf("/");
    return t === -1 ? "./" : e.slice(0, t + 1);
  }
  static resolveURL(e, t) {
    return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
  }
}
class bg extends Kn {
  constructor(e) {
    super(e), this.isImageBitmapLoader = !0, typeof createImageBitmap > "u" && console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."), typeof fetch > "u" && console.warn("THREE.ImageBitmapLoader: fetch() not supported."), this.options = { premultiplyAlpha: "none" };
  }
  setOptions(e) {
    return this.options = e, this;
  }
  load(e, t, n, i) {
    e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const r = this, a = Rn.get(e);
    if (a !== void 0) {
      if (r.manager.itemStart(e), a.then) {
        a.then((l) => {
          t && t(l), r.manager.itemEnd(e);
        }).catch((l) => {
          i && i(l);
        });
        return;
      }
      return setTimeout(function() {
        t && t(a), r.manager.itemEnd(e);
      }, 0), a;
    }
    const o = {};
    o.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include", o.headers = this.requestHeader;
    const c = fetch(e, o).then(function(l) {
      return l.blob();
    }).then(function(l) {
      return createImageBitmap(l, Object.assign(r.options, { colorSpaceConversion: "none" }));
    }).then(function(l) {
      return Rn.add(e, l), t && t(l), r.manager.itemEnd(e), l;
    }).catch(function(l) {
      i && i(l), Rn.remove(e), r.manager.itemError(e), r.manager.itemEnd(e);
    });
    Rn.add(e, c), r.manager.itemStart(e);
  }
}
class wg {
  constructor(e = !0) {
    this.autoStart = e, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = !1;
  }
  start() {
    this.startTime = uc(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = !0;
  }
  stop() {
    this.getElapsedTime(), this.running = !1, this.autoStart = !1;
  }
  getElapsedTime() {
    return this.getDelta(), this.elapsedTime;
  }
  getDelta() {
    let e = 0;
    if (this.autoStart && !this.running)
      return this.start(), 0;
    if (this.running) {
      const t = uc();
      e = (t - this.oldTime) / 1e3, this.oldTime = t, this.elapsedTime += e;
    }
    return e;
  }
}
function uc() {
  return (typeof performance > "u" ? Date : performance).now();
}
class Rg {
  constructor(e, t, n) {
    this.binding = e, this.valueSize = n;
    let i, r, a;
    switch (t) {
      case "quaternion":
        i = this._slerp, r = this._slerpAdditive, a = this._setAdditiveIdentityQuaternion, this.buffer = new Float64Array(n * 6), this._workIndex = 5;
        break;
      case "string":
      case "bool":
        i = this._select, r = this._select, a = this._setAdditiveIdentityOther, this.buffer = new Array(n * 5);
        break;
      default:
        i = this._lerp, r = this._lerpAdditive, a = this._setAdditiveIdentityNumeric, this.buffer = new Float64Array(n * 5);
    }
    this._mixBufferRegion = i, this._mixBufferRegionAdditive = r, this._setIdentity = a, this._origIndex = 3, this._addIndex = 4, this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, this.useCount = 0, this.referenceCount = 0;
  }
  // accumulate data in the 'incoming' region into 'accu<i>'
  accumulate(e, t) {
    const n = this.buffer, i = this.valueSize, r = e * i + i;
    let a = this.cumulativeWeight;
    if (a === 0) {
      for (let o = 0; o !== i; ++o)
        n[r + o] = n[o];
      a = t;
    } else {
      a += t;
      const o = t / a;
      this._mixBufferRegion(n, r, 0, o, i);
    }
    this.cumulativeWeight = a;
  }
  // accumulate data in the 'incoming' region into 'add'
  accumulateAdditive(e) {
    const t = this.buffer, n = this.valueSize, i = n * this._addIndex;
    this.cumulativeWeightAdditive === 0 && this._setIdentity(), this._mixBufferRegionAdditive(t, i, 0, e, n), this.cumulativeWeightAdditive += e;
  }
  // apply the state of 'accu<i>' to the binding when accus differ
  apply(e) {
    const t = this.valueSize, n = this.buffer, i = e * t + t, r = this.cumulativeWeight, a = this.cumulativeWeightAdditive, o = this.binding;
    if (this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, r < 1) {
      const c = t * this._origIndex;
      this._mixBufferRegion(
        n,
        i,
        c,
        1 - r,
        t
      );
    }
    a > 0 && this._mixBufferRegionAdditive(n, i, this._addIndex * t, 1, t);
    for (let c = t, l = t + t; c !== l; ++c)
      if (n[c] !== n[c + t]) {
        o.setValue(n, i);
        break;
      }
  }
  // remember the state of the bound property and copy it to both accus
  saveOriginalState() {
    const e = this.binding, t = this.buffer, n = this.valueSize, i = n * this._origIndex;
    e.getValue(t, i);
    for (let r = n, a = i; r !== a; ++r)
      t[r] = t[i + r % n];
    this._setIdentity(), this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0;
  }
  // apply the state previously taken via 'saveOriginalState' to the binding
  restoreOriginalState() {
    const e = this.valueSize * 3;
    this.binding.setValue(this.buffer, e);
  }
  _setAdditiveIdentityNumeric() {
    const e = this._addIndex * this.valueSize, t = e + this.valueSize;
    for (let n = e; n < t; n++)
      this.buffer[n] = 0;
  }
  _setAdditiveIdentityQuaternion() {
    this._setAdditiveIdentityNumeric(), this.buffer[this._addIndex * this.valueSize + 3] = 1;
  }
  _setAdditiveIdentityOther() {
    const e = this._origIndex * this.valueSize, t = this._addIndex * this.valueSize;
    for (let n = 0; n < this.valueSize; n++)
      this.buffer[t + n] = this.buffer[e + n];
  }
  // mix functions
  _select(e, t, n, i, r) {
    if (i >= 0.5)
      for (let a = 0; a !== r; ++a)
        e[t + a] = e[n + a];
  }
  _slerp(e, t, n, i) {
    Lt.slerpFlat(e, t, e, t, e, n, i);
  }
  _slerpAdditive(e, t, n, i, r) {
    const a = this._workIndex * r;
    Lt.multiplyQuaternionsFlat(e, a, e, t, e, n), Lt.slerpFlat(e, t, e, t, e, a, i);
  }
  _lerp(e, t, n, i, r) {
    const a = 1 - i;
    for (let o = 0; o !== r; ++o) {
      const c = t + o;
      e[c] = e[c] * a + e[n + o] * i;
    }
  }
  _lerpAdditive(e, t, n, i, r) {
    for (let a = 0; a !== r; ++a) {
      const o = t + a;
      e[o] = e[o] + e[n + a] * i;
    }
  }
}
const Ma = "\\[\\]\\.:\\/", Cg = new RegExp("[" + Ma + "]", "g"), Sa = "[^" + Ma + "]", Pg = "[^" + Ma.replace("\\.", "") + "]", Lg = /* @__PURE__ */ /((?:WC+[\/:])*)/.source.replace("WC", Sa), Ig = /* @__PURE__ */ /(WCOD+)?/.source.replace("WCOD", Pg), Dg = /* @__PURE__ */ /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", Sa), Ng = /* @__PURE__ */ /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", Sa), Ug = new RegExp(
  "^" + Lg + Ig + Dg + Ng + "$"
), Og = ["material", "materials", "bones", "map"];
class Fg {
  constructor(e, t, n) {
    const i = n || Xe.parseTrackName(t);
    this._targetGroup = e, this._bindings = e.subscribe_(t, i);
  }
  getValue(e, t) {
    this.bind();
    const n = this._targetGroup.nCachedObjects_, i = this._bindings[n];
    i !== void 0 && i.getValue(e, t);
  }
  setValue(e, t) {
    const n = this._bindings;
    for (let i = this._targetGroup.nCachedObjects_, r = n.length; i !== r; ++i)
      n[i].setValue(e, t);
  }
  bind() {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t)
      e[t].bind();
  }
  unbind() {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t)
      e[t].unbind();
  }
}
class Xe {
  constructor(e, t, n) {
    this.path = t, this.parsedPath = n || Xe.parseTrackName(t), this.node = Xe.findNode(e, this.parsedPath.nodeName), this.rootNode = e, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
  }
  static create(e, t, n) {
    return e && e.isAnimationObjectGroup ? new Xe.Composite(e, t, n) : new Xe(e, t, n);
  }
  /**
   * Replaces spaces with underscores and removes unsupported characters from
   * node names, to ensure compatibility with parseTrackName().
   *
   * @param {string} name Node name to be sanitized.
   * @return {string}
   */
  static sanitizeNodeName(e) {
    return e.replace(/\s/g, "_").replace(Cg, "");
  }
  static parseTrackName(e) {
    const t = Ug.exec(e);
    if (t === null)
      throw new Error("PropertyBinding: Cannot parse trackName: " + e);
    const n = {
      // directoryName: matches[ 1 ], // (tschw) currently unused
      nodeName: t[2],
      objectName: t[3],
      objectIndex: t[4],
      propertyName: t[5],
      // required
      propertyIndex: t[6]
    }, i = n.nodeName && n.nodeName.lastIndexOf(".");
    if (i !== void 0 && i !== -1) {
      const r = n.nodeName.substring(i + 1);
      Og.indexOf(r) !== -1 && (n.nodeName = n.nodeName.substring(0, i), n.objectName = r);
    }
    if (n.propertyName === null || n.propertyName.length === 0)
      throw new Error("PropertyBinding: can not parse propertyName from trackName: " + e);
    return n;
  }
  static findNode(e, t) {
    if (t === void 0 || t === "" || t === "." || t === -1 || t === e.name || t === e.uuid)
      return e;
    if (e.skeleton) {
      const n = e.skeleton.getBoneByName(t);
      if (n !== void 0)
        return n;
    }
    if (e.children) {
      const n = function(r) {
        for (let a = 0; a < r.length; a++) {
          const o = r[a];
          if (o.name === t || o.uuid === t)
            return o;
          const c = n(o.children);
          if (c)
            return c;
        }
        return null;
      }, i = n(e.children);
      if (i)
        return i;
    }
    return null;
  }
  // these are used to "bind" a nonexistent property
  _getValue_unavailable() {
  }
  _setValue_unavailable() {
  }
  // Getters
  _getValue_direct(e, t) {
    e[t] = this.targetObject[this.propertyName];
  }
  _getValue_array(e, t) {
    const n = this.resolvedProperty;
    for (let i = 0, r = n.length; i !== r; ++i)
      e[t++] = n[i];
  }
  _getValue_arrayElement(e, t) {
    e[t] = this.resolvedProperty[this.propertyIndex];
  }
  _getValue_toArray(e, t) {
    this.resolvedProperty.toArray(e, t);
  }
  // Direct
  _setValue_direct(e, t) {
    this.targetObject[this.propertyName] = e[t];
  }
  _setValue_direct_setNeedsUpdate(e, t) {
    this.targetObject[this.propertyName] = e[t], this.targetObject.needsUpdate = !0;
  }
  _setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
    this.targetObject[this.propertyName] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  // EntireArray
  _setValue_array(e, t) {
    const n = this.resolvedProperty;
    for (let i = 0, r = n.length; i !== r; ++i)
      n[i] = e[t++];
  }
  _setValue_array_setNeedsUpdate(e, t) {
    const n = this.resolvedProperty;
    for (let i = 0, r = n.length; i !== r; ++i)
      n[i] = e[t++];
    this.targetObject.needsUpdate = !0;
  }
  _setValue_array_setMatrixWorldNeedsUpdate(e, t) {
    const n = this.resolvedProperty;
    for (let i = 0, r = n.length; i !== r; ++i)
      n[i] = e[t++];
    this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  // ArrayElement
  _setValue_arrayElement(e, t) {
    this.resolvedProperty[this.propertyIndex] = e[t];
  }
  _setValue_arrayElement_setNeedsUpdate(e, t) {
    this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.needsUpdate = !0;
  }
  _setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
    this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  // HasToFromArray
  _setValue_fromArray(e, t) {
    this.resolvedProperty.fromArray(e, t);
  }
  _setValue_fromArray_setNeedsUpdate(e, t) {
    this.resolvedProperty.fromArray(e, t), this.targetObject.needsUpdate = !0;
  }
  _setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
    this.resolvedProperty.fromArray(e, t), this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  _getValue_unbound(e, t) {
    this.bind(), this.getValue(e, t);
  }
  _setValue_unbound(e, t) {
    this.bind(), this.setValue(e, t);
  }
  // create getter / setter pair for a property in the scene graph
  bind() {
    let e = this.node;
    const t = this.parsedPath, n = t.objectName, i = t.propertyName;
    let r = t.propertyIndex;
    if (e || (e = Xe.findNode(this.rootNode, t.nodeName), this.node = e), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !e) {
      console.warn("THREE.PropertyBinding: No target node found for track: " + this.path + ".");
      return;
    }
    if (n) {
      let l = t.objectIndex;
      switch (n) {
        case "materials":
          if (!e.material) {
            console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!e.material.materials) {
            console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
            return;
          }
          e = e.material.materials;
          break;
        case "bones":
          if (!e.skeleton) {
            console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
            return;
          }
          e = e.skeleton.bones;
          for (let h = 0; h < e.length; h++)
            if (e[h].name === l) {
              l = h;
              break;
            }
          break;
        case "map":
          if ("map" in e) {
            e = e.map;
            break;
          }
          if (!e.material) {
            console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!e.material.map) {
            console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
            return;
          }
          e = e.material.map;
          break;
        default:
          if (e[n] === void 0) {
            console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.", this);
            return;
          }
          e = e[n];
      }
      if (l !== void 0) {
        if (e[l] === void 0) {
          console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, e);
          return;
        }
        e = e[l];
      }
    }
    const a = e[i];
    if (a === void 0) {
      const l = t.nodeName;
      console.error("THREE.PropertyBinding: Trying to update property for track: " + l + "." + i + " but it wasn't found.", e);
      return;
    }
    let o = this.Versioning.None;
    this.targetObject = e, e.needsUpdate !== void 0 ? o = this.Versioning.NeedsUpdate : e.matrixWorldNeedsUpdate !== void 0 && (o = this.Versioning.MatrixWorldNeedsUpdate);
    let c = this.BindingType.Direct;
    if (r !== void 0) {
      if (i === "morphTargetInfluences") {
        if (!e.geometry) {
          console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
          return;
        }
        if (!e.geometry.morphAttributes) {
          console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
          return;
        }
        e.morphTargetDictionary[r] !== void 0 && (r = e.morphTargetDictionary[r]);
      }
      c = this.BindingType.ArrayElement, this.resolvedProperty = a, this.propertyIndex = r;
    } else
      a.fromArray !== void 0 && a.toArray !== void 0 ? (c = this.BindingType.HasFromToArray, this.resolvedProperty = a) : Array.isArray(a) ? (c = this.BindingType.EntireArray, this.resolvedProperty = a) : this.propertyName = i;
    this.getValue = this.GetterByBindingType[c], this.setValue = this.SetterByBindingTypeAndVersioning[c][o];
  }
  unbind() {
    this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
  }
}
Xe.Composite = Fg;
Xe.prototype.BindingType = {
  Direct: 0,
  EntireArray: 1,
  ArrayElement: 2,
  HasFromToArray: 3
};
Xe.prototype.Versioning = {
  None: 0,
  NeedsUpdate: 1,
  MatrixWorldNeedsUpdate: 2
};
Xe.prototype.GetterByBindingType = [
  Xe.prototype._getValue_direct,
  Xe.prototype._getValue_array,
  Xe.prototype._getValue_arrayElement,
  Xe.prototype._getValue_toArray
];
Xe.prototype.SetterByBindingTypeAndVersioning = [
  [
    // Direct
    Xe.prototype._setValue_direct,
    Xe.prototype._setValue_direct_setNeedsUpdate,
    Xe.prototype._setValue_direct_setMatrixWorldNeedsUpdate
  ],
  [
    // EntireArray
    Xe.prototype._setValue_array,
    Xe.prototype._setValue_array_setNeedsUpdate,
    Xe.prototype._setValue_array_setMatrixWorldNeedsUpdate
  ],
  [
    // ArrayElement
    Xe.prototype._setValue_arrayElement,
    Xe.prototype._setValue_arrayElement_setNeedsUpdate,
    Xe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate
  ],
  [
    // HasToFromArray
    Xe.prototype._setValue_fromArray,
    Xe.prototype._setValue_fromArray_setNeedsUpdate,
    Xe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate
  ]
];
class Bg {
  constructor(e, t, n = null, i = t.blendMode) {
    this._mixer = e, this._clip = t, this._localRoot = n, this.blendMode = i;
    const r = t.tracks, a = r.length, o = new Array(a), c = {
      endingStart: _i,
      endingEnd: _i
    };
    for (let l = 0; l !== a; ++l) {
      const h = r[l].createInterpolant(null);
      o[l] = h, h.settings = c;
    }
    this._interpolantSettings = c, this._interpolants = o, this._propertyBindings = new Array(a), this._cacheIndex = null, this._byClipCacheIndex = null, this._timeScaleInterpolant = null, this._weightInterpolant = null, this.loop = mh, this._loopCount = -1, this._startTime = null, this.time = 0, this.timeScale = 1, this._effectiveTimeScale = 1, this.weight = 1, this._effectiveWeight = 1, this.repetitions = 1 / 0, this.paused = !1, this.enabled = !0, this.clampWhenFinished = !1, this.zeroSlopeAtStart = !0, this.zeroSlopeAtEnd = !0;
  }
  // State & Scheduling
  play() {
    return this._mixer._activateAction(this), this;
  }
  stop() {
    return this._mixer._deactivateAction(this), this.reset();
  }
  reset() {
    return this.paused = !1, this.enabled = !0, this.time = 0, this._loopCount = -1, this._startTime = null, this.stopFading().stopWarping();
  }
  isRunning() {
    return this.enabled && !this.paused && this.timeScale !== 0 && this._startTime === null && this._mixer._isActiveAction(this);
  }
  // return true when play has been called
  isScheduled() {
    return this._mixer._isActiveAction(this);
  }
  startAt(e) {
    return this._startTime = e, this;
  }
  setLoop(e, t) {
    return this.loop = e, this.repetitions = t, this;
  }
  // Weight
  // set the weight stopping any scheduled fading
  // although .enabled = false yields an effective weight of zero, this
  // method does *not* change .enabled, because it would be confusing
  setEffectiveWeight(e) {
    return this.weight = e, this._effectiveWeight = this.enabled ? e : 0, this.stopFading();
  }
  // return the weight considering fading and .enabled
  getEffectiveWeight() {
    return this._effectiveWeight;
  }
  fadeIn(e) {
    return this._scheduleFading(e, 0, 1);
  }
  fadeOut(e) {
    return this._scheduleFading(e, 1, 0);
  }
  crossFadeFrom(e, t, n) {
    if (e.fadeOut(t), this.fadeIn(t), n) {
      const i = this._clip.duration, r = e._clip.duration, a = r / i, o = i / r;
      e.warp(1, a, t), this.warp(o, 1, t);
    }
    return this;
  }
  crossFadeTo(e, t, n) {
    return e.crossFadeFrom(this, t, n);
  }
  stopFading() {
    const e = this._weightInterpolant;
    return e !== null && (this._weightInterpolant = null, this._mixer._takeBackControlInterpolant(e)), this;
  }
  // Time Scale Control
  // set the time scale stopping any scheduled warping
  // although .paused = true yields an effective time scale of zero, this
  // method does *not* change .paused, because it would be confusing
  setEffectiveTimeScale(e) {
    return this.timeScale = e, this._effectiveTimeScale = this.paused ? 0 : e, this.stopWarping();
  }
  // return the time scale considering warping and .paused
  getEffectiveTimeScale() {
    return this._effectiveTimeScale;
  }
  setDuration(e) {
    return this.timeScale = this._clip.duration / e, this.stopWarping();
  }
  syncWith(e) {
    return this.time = e.time, this.timeScale = e.timeScale, this.stopWarping();
  }
  halt(e) {
    return this.warp(this._effectiveTimeScale, 0, e);
  }
  warp(e, t, n) {
    const i = this._mixer, r = i.time, a = this.timeScale;
    let o = this._timeScaleInterpolant;
    o === null && (o = i._lendControlInterpolant(), this._timeScaleInterpolant = o);
    const c = o.parameterPositions, l = o.sampleValues;
    return c[0] = r, c[1] = r + n, l[0] = e / a, l[1] = t / a, this;
  }
  stopWarping() {
    const e = this._timeScaleInterpolant;
    return e !== null && (this._timeScaleInterpolant = null, this._mixer._takeBackControlInterpolant(e)), this;
  }
  // Object Accessors
  getMixer() {
    return this._mixer;
  }
  getClip() {
    return this._clip;
  }
  getRoot() {
    return this._localRoot || this._mixer._root;
  }
  // Interna
  _update(e, t, n, i) {
    if (!this.enabled) {
      this._updateWeight(e);
      return;
    }
    const r = this._startTime;
    if (r !== null) {
      const c = (e - r) * n;
      c < 0 || n === 0 ? t = 0 : (this._startTime = null, t = n * c);
    }
    t *= this._updateTimeScale(e);
    const a = this._updateTime(t), o = this._updateWeight(e);
    if (o > 0) {
      const c = this._interpolants, l = this._propertyBindings;
      switch (this.blendMode) {
        case _h:
          for (let h = 0, u = c.length; h !== u; ++h)
            c[h].evaluate(a), l[h].accumulateAdditive(o);
          break;
        case la:
        default:
          for (let h = 0, u = c.length; h !== u; ++h)
            c[h].evaluate(a), l[h].accumulate(i, o);
      }
    }
  }
  _updateWeight(e) {
    let t = 0;
    if (this.enabled) {
      t = this.weight;
      const n = this._weightInterpolant;
      if (n !== null) {
        const i = n.evaluate(e)[0];
        t *= i, e > n.parameterPositions[1] && (this.stopFading(), i === 0 && (this.enabled = !1));
      }
    }
    return this._effectiveWeight = t, t;
  }
  _updateTimeScale(e) {
    let t = 0;
    if (!this.paused) {
      t = this.timeScale;
      const n = this._timeScaleInterpolant;
      if (n !== null) {
        const i = n.evaluate(e)[0];
        t *= i, e > n.parameterPositions[1] && (this.stopWarping(), t === 0 ? this.paused = !0 : this.timeScale = t);
      }
    }
    return this._effectiveTimeScale = t, t;
  }
  _updateTime(e) {
    const t = this._clip.duration, n = this.loop;
    let i = this.time + e, r = this._loopCount;
    const a = n === gh;
    if (e === 0)
      return r === -1 ? i : a && (r & 1) === 1 ? t - i : i;
    if (n === ph) {
      r === -1 && (this._loopCount = 0, this._setEndings(!0, !0, !1));
      e: {
        if (i >= t)
          i = t;
        else if (i < 0)
          i = 0;
        else {
          this.time = i;
          break e;
        }
        this.clampWhenFinished ? this.paused = !0 : this.enabled = !1, this.time = i, this._mixer.dispatchEvent({
          type: "finished",
          action: this,
          direction: e < 0 ? -1 : 1
        });
      }
    } else {
      if (r === -1 && (e >= 0 ? (r = 0, this._setEndings(!0, this.repetitions === 0, a)) : this._setEndings(this.repetitions === 0, !0, a)), i >= t || i < 0) {
        const o = Math.floor(i / t);
        i -= t * o, r += Math.abs(o);
        const c = this.repetitions - r;
        if (c <= 0)
          this.clampWhenFinished ? this.paused = !0 : this.enabled = !1, i = e > 0 ? t : 0, this.time = i, this._mixer.dispatchEvent({
            type: "finished",
            action: this,
            direction: e > 0 ? 1 : -1
          });
        else {
          if (c === 1) {
            const l = e < 0;
            this._setEndings(l, !l, a);
          } else
            this._setEndings(!1, !1, a);
          this._loopCount = r, this.time = i, this._mixer.dispatchEvent({
            type: "loop",
            action: this,
            loopDelta: o
          });
        }
      } else
        this.time = i;
      if (a && (r & 1) === 1)
        return t - i;
    }
    return i;
  }
  _setEndings(e, t, n) {
    const i = this._interpolantSettings;
    n ? (i.endingStart = xi, i.endingEnd = xi) : (e ? i.endingStart = this.zeroSlopeAtStart ? xi : _i : i.endingStart = Ws, t ? i.endingEnd = this.zeroSlopeAtEnd ? xi : _i : i.endingEnd = Ws);
  }
  _scheduleFading(e, t, n) {
    const i = this._mixer, r = i.time;
    let a = this._weightInterpolant;
    a === null && (a = i._lendControlInterpolant(), this._weightInterpolant = a);
    const o = a.parameterPositions, c = a.sampleValues;
    return o[0] = r, c[0] = t, o[1] = r + e, c[1] = n, this;
  }
}
const kg = new Float32Array(1);
class zg extends Dn {
  constructor(e) {
    super(), this._root = e, this._initMemoryManager(), this._accuIndex = 0, this.time = 0, this.timeScale = 1;
  }
  _bindAction(e, t) {
    const n = e._localRoot || this._root, i = e._clip.tracks, r = i.length, a = e._propertyBindings, o = e._interpolants, c = n.uuid, l = this._bindingsByRootAndName;
    let h = l[c];
    h === void 0 && (h = {}, l[c] = h);
    for (let u = 0; u !== r; ++u) {
      const d = i[u], p = d.name;
      let g = h[p];
      if (g !== void 0)
        ++g.referenceCount, a[u] = g;
      else {
        if (g = a[u], g !== void 0) {
          g._cacheIndex === null && (++g.referenceCount, this._addInactiveBinding(g, c, p));
          continue;
        }
        const _ = t && t._propertyBindings[u].binding.parsedPath;
        g = new Rg(
          Xe.create(n, p, _),
          d.ValueTypeName,
          d.getValueSize()
        ), ++g.referenceCount, this._addInactiveBinding(g, c, p), a[u] = g;
      }
      o[u].resultBuffer = g.buffer;
    }
  }
  _activateAction(e) {
    if (!this._isActiveAction(e)) {
      if (e._cacheIndex === null) {
        const n = (e._localRoot || this._root).uuid, i = e._clip.uuid, r = this._actionsByClip[i];
        this._bindAction(
          e,
          r && r.knownActions[0]
        ), this._addInactiveAction(e, i, n);
      }
      const t = e._propertyBindings;
      for (let n = 0, i = t.length; n !== i; ++n) {
        const r = t[n];
        r.useCount++ === 0 && (this._lendBinding(r), r.saveOriginalState());
      }
      this._lendAction(e);
    }
  }
  _deactivateAction(e) {
    if (this._isActiveAction(e)) {
      const t = e._propertyBindings;
      for (let n = 0, i = t.length; n !== i; ++n) {
        const r = t[n];
        --r.useCount === 0 && (r.restoreOriginalState(), this._takeBackBinding(r));
      }
      this._takeBackAction(e);
    }
  }
  // Memory manager
  _initMemoryManager() {
    this._actions = [], this._nActiveActions = 0, this._actionsByClip = {}, this._bindings = [], this._nActiveBindings = 0, this._bindingsByRootAndName = {}, this._controlInterpolants = [], this._nActiveControlInterpolants = 0;
    const e = this;
    this.stats = {
      actions: {
        get total() {
          return e._actions.length;
        },
        get inUse() {
          return e._nActiveActions;
        }
      },
      bindings: {
        get total() {
          return e._bindings.length;
        },
        get inUse() {
          return e._nActiveBindings;
        }
      },
      controlInterpolants: {
        get total() {
          return e._controlInterpolants.length;
        },
        get inUse() {
          return e._nActiveControlInterpolants;
        }
      }
    };
  }
  // Memory management for AnimationAction objects
  _isActiveAction(e) {
    const t = e._cacheIndex;
    return t !== null && t < this._nActiveActions;
  }
  _addInactiveAction(e, t, n) {
    const i = this._actions, r = this._actionsByClip;
    let a = r[t];
    if (a === void 0)
      a = {
        knownActions: [e],
        actionByRoot: {}
      }, e._byClipCacheIndex = 0, r[t] = a;
    else {
      const o = a.knownActions;
      e._byClipCacheIndex = o.length, o.push(e);
    }
    e._cacheIndex = i.length, i.push(e), a.actionByRoot[n] = e;
  }
  _removeInactiveAction(e) {
    const t = this._actions, n = t[t.length - 1], i = e._cacheIndex;
    n._cacheIndex = i, t[i] = n, t.pop(), e._cacheIndex = null;
    const r = e._clip.uuid, a = this._actionsByClip, o = a[r], c = o.knownActions, l = c[c.length - 1], h = e._byClipCacheIndex;
    l._byClipCacheIndex = h, c[h] = l, c.pop(), e._byClipCacheIndex = null;
    const u = o.actionByRoot, d = (e._localRoot || this._root).uuid;
    delete u[d], c.length === 0 && delete a[r], this._removeInactiveBindingsForAction(e);
  }
  _removeInactiveBindingsForAction(e) {
    const t = e._propertyBindings;
    for (let n = 0, i = t.length; n !== i; ++n) {
      const r = t[n];
      --r.referenceCount === 0 && this._removeInactiveBinding(r);
    }
  }
  _lendAction(e) {
    const t = this._actions, n = e._cacheIndex, i = this._nActiveActions++, r = t[i];
    e._cacheIndex = i, t[i] = e, r._cacheIndex = n, t[n] = r;
  }
  _takeBackAction(e) {
    const t = this._actions, n = e._cacheIndex, i = --this._nActiveActions, r = t[i];
    e._cacheIndex = i, t[i] = e, r._cacheIndex = n, t[n] = r;
  }
  // Memory management for PropertyMixer objects
  _addInactiveBinding(e, t, n) {
    const i = this._bindingsByRootAndName, r = this._bindings;
    let a = i[t];
    a === void 0 && (a = {}, i[t] = a), a[n] = e, e._cacheIndex = r.length, r.push(e);
  }
  _removeInactiveBinding(e) {
    const t = this._bindings, n = e.binding, i = n.rootNode.uuid, r = n.path, a = this._bindingsByRootAndName, o = a[i], c = t[t.length - 1], l = e._cacheIndex;
    c._cacheIndex = l, t[l] = c, t.pop(), delete o[r], Object.keys(o).length === 0 && delete a[i];
  }
  _lendBinding(e) {
    const t = this._bindings, n = e._cacheIndex, i = this._nActiveBindings++, r = t[i];
    e._cacheIndex = i, t[i] = e, r._cacheIndex = n, t[n] = r;
  }
  _takeBackBinding(e) {
    const t = this._bindings, n = e._cacheIndex, i = --this._nActiveBindings, r = t[i];
    e._cacheIndex = i, t[i] = e, r._cacheIndex = n, t[n] = r;
  }
  // Memory management of Interpolants for weight and time scale
  _lendControlInterpolant() {
    const e = this._controlInterpolants, t = this._nActiveControlInterpolants++;
    let n = e[t];
    return n === void 0 && (n = new ol(
      new Float32Array(2),
      new Float32Array(2),
      1,
      kg
    ), n.__cacheIndex = t, e[t] = n), n;
  }
  _takeBackControlInterpolant(e) {
    const t = this._controlInterpolants, n = e.__cacheIndex, i = --this._nActiveControlInterpolants, r = t[i];
    e.__cacheIndex = i, t[i] = e, r.__cacheIndex = n, t[n] = r;
  }
  // return an action for a clip optionally using a custom root target
  // object (this method allocates a lot of dynamic memory in case a
  // previously unknown clip/root combination is specified)
  clipAction(e, t, n) {
    const i = t || this._root, r = i.uuid;
    let a = typeof e == "string" ? sa.findByName(i, e) : e;
    const o = a !== null ? a.uuid : e, c = this._actionsByClip[o];
    let l = null;
    if (n === void 0 && (a !== null ? n = a.blendMode : n = la), c !== void 0) {
      const u = c.actionByRoot[r];
      if (u !== void 0 && u.blendMode === n)
        return u;
      l = c.knownActions[0], a === null && (a = l._clip);
    }
    if (a === null)
      return null;
    const h = new Bg(this, a, t, n);
    return this._bindAction(h, l), this._addInactiveAction(h, o, r), h;
  }
  // get an existing action
  existingAction(e, t) {
    const n = t || this._root, i = n.uuid, r = typeof e == "string" ? sa.findByName(n, e) : e, a = r ? r.uuid : e, o = this._actionsByClip[a];
    return o !== void 0 && o.actionByRoot[i] || null;
  }
  // deactivates all previously scheduled actions
  stopAllAction() {
    const e = this._actions, t = this._nActiveActions;
    for (let n = t - 1; n >= 0; --n)
      e[n].stop();
    return this;
  }
  // advance the time and update apply the animation
  update(e) {
    e *= this.timeScale;
    const t = this._actions, n = this._nActiveActions, i = this.time += e, r = Math.sign(e), a = this._accuIndex ^= 1;
    for (let l = 0; l !== n; ++l)
      t[l]._update(i, e, r, a);
    const o = this._bindings, c = this._nActiveBindings;
    for (let l = 0; l !== c; ++l)
      o[l].apply(a);
    return this;
  }
  // Allows you to seek to a specific time in an animation.
  setTime(e) {
    this.time = 0;
    for (let t = 0; t < this._actions.length; t++)
      this._actions[t].time = 0;
    return this.update(e);
  }
  // return this mixer's root target object
  getRoot() {
    return this._root;
  }
  // free all resources specific to a particular clip
  uncacheClip(e) {
    const t = this._actions, n = e.uuid, i = this._actionsByClip, r = i[n];
    if (r !== void 0) {
      const a = r.knownActions;
      for (let o = 0, c = a.length; o !== c; ++o) {
        const l = a[o];
        this._deactivateAction(l);
        const h = l._cacheIndex, u = t[t.length - 1];
        l._cacheIndex = null, l._byClipCacheIndex = null, u._cacheIndex = h, t[h] = u, t.pop(), this._removeInactiveBindingsForAction(l);
      }
      delete i[n];
    }
  }
  // free all resources specific to a particular root target object
  uncacheRoot(e) {
    const t = e.uuid, n = this._actionsByClip;
    for (const a in n) {
      const o = n[a].actionByRoot, c = o[t];
      c !== void 0 && (this._deactivateAction(c), this._removeInactiveAction(c));
    }
    const i = this._bindingsByRootAndName, r = i[t];
    if (r !== void 0)
      for (const a in r) {
        const o = r[a];
        o.restoreOriginalState(), this._removeInactiveBinding(o);
      }
  }
  // remove a targeted clip from the cache
  uncacheAction(e, t) {
    const n = this.existingAction(e, t);
    n !== null && (this._deactivateAction(n), this._removeInactiveAction(n));
  }
}
class dc {
  constructor(e = 1, t = 0, n = 0) {
    return this.radius = e, this.phi = t, this.theta = n, this;
  }
  set(e, t, n) {
    return this.radius = e, this.phi = t, this.theta = n, this;
  }
  copy(e) {
    return this.radius = e.radius, this.phi = e.phi, this.theta = e.theta, this;
  }
  // restrict phi to be between EPS and PI-EPS
  makeSafe() {
    return this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi)), this;
  }
  setFromVector3(e) {
    return this.setFromCartesianCoords(e.x, e.y, e.z);
  }
  setFromCartesianCoords(e, t, n) {
    return this.radius = Math.sqrt(e * e + t * t + n * n), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(e, n), this.phi = Math.acos(gt(t / this.radius, -1, 1))), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: ca
} }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = ca);
var es = function() {
  var s = 0, e = document.createElement("div");
  e.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000", e.addEventListener("click", function(h) {
    h.preventDefault(), n(++s % e.children.length);
  }, !1);
  function t(h) {
    return e.appendChild(h.dom), h;
  }
  function n(h) {
    for (var u = 0; u < e.children.length; u++)
      e.children[u].style.display = u === h ? "block" : "none";
    s = h;
  }
  var i = (performance || Date).now(), r = i, a = 0, o = t(new es.Panel("FPS", "#0ff", "#002")), c = t(new es.Panel("MS", "#0f0", "#020"));
  if (self.performance && self.performance.memory)
    var l = t(new es.Panel("MB", "#f08", "#201"));
  return n(0), {
    REVISION: 16,
    dom: e,
    addPanel: t,
    showPanel: n,
    begin: function() {
      i = (performance || Date).now();
    },
    end: function() {
      a++;
      var h = (performance || Date).now();
      if (c.update(h - i, 200), h >= r + 1e3 && (o.update(a * 1e3 / (h - r), 100), r = h, a = 0, l)) {
        var u = performance.memory;
        l.update(u.usedJSHeapSize / 1048576, u.jsHeapSizeLimit / 1048576);
      }
      return h;
    },
    update: function() {
      i = this.end();
    },
    // Backwards Compatibility
    domElement: e,
    setMode: n
  };
};
es.Panel = function(s, e, t) {
  var n = 1 / 0, i = 0, r = Math.round, a = r(window.devicePixelRatio || 1), o = 80 * a, c = 48 * a, l = 3 * a, h = 2 * a, u = 3 * a, d = 15 * a, p = 74 * a, g = 30 * a, _ = document.createElement("canvas");
  _.width = o, _.height = c, _.style.cssText = "width:80px;height:48px";
  var f = _.getContext("2d");
  return f.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif", f.textBaseline = "top", f.fillStyle = t, f.fillRect(0, 0, o, c), f.fillStyle = e, f.fillText(s, l, h), f.fillRect(u, d, p, g), f.fillStyle = t, f.globalAlpha = 0.9, f.fillRect(u, d, p, g), {
    dom: _,
    update: function(m, T) {
      n = Math.min(n, m), i = Math.max(i, m), f.fillStyle = t, f.globalAlpha = 1, f.fillRect(0, 0, o, d), f.fillStyle = e, f.fillText(r(m) + " " + s + " (" + r(n) + "-" + r(i) + ")", l, h), f.drawImage(_, u + a, d, p - a, g, u, d, p - a, g), f.fillRect(u + p - a, d, a, g), f.fillStyle = t, f.globalAlpha = 0.9, f.fillRect(u + p - a, d, a, r((1 - m / T) * g));
    }
  };
};
const fc = { type: "change" }, Gr = { type: "start" }, pc = { type: "end" }, ks = new os(), mc = new En(), Hg = Math.cos(70 * Oc.DEG2RAD);
class Vg extends Dn {
  constructor(e, t) {
    super(), this.object = e, this.domElement = t, this.domElement.style.touchAction = "none", this.enabled = !0, this.target = new C(), this.cursor = new C(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: Zn.ROTATE, MIDDLE: Zn.DOLLY, RIGHT: Zn.PAN }, this.touches = { ONE: $n.ROTATE, TWO: $n.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this.getPolarAngle = function() {
      return o.phi;
    }, this.getAzimuthalAngle = function() {
      return o.theta;
    }, this.getDistance = function() {
      return this.object.position.distanceTo(this.target);
    }, this.listenToKeyEvents = function(x) {
      x.addEventListener("keydown", ye), this._domElementKeyEvents = x;
    }, this.stopListenToKeyEvents = function() {
      this._domElementKeyEvents.removeEventListener("keydown", ye), this._domElementKeyEvents = null;
    }, this.saveState = function() {
      n.target0.copy(n.target), n.position0.copy(n.object.position), n.zoom0 = n.object.zoom;
    }, this.reset = function() {
      n.target.copy(n.target0), n.object.position.copy(n.position0), n.object.zoom = n.zoom0, n.object.updateProjectionMatrix(), n.dispatchEvent(fc), n.update(), r = i.NONE;
    }, this.update = function() {
      const x = new C(), L = new Lt().setFromUnitVectors(e.up, new C(0, 1, 0)), U = L.clone().invert(), j = new C(), ne = new Lt(), we = new C(), Ue = 2 * Math.PI;
      return function(ut = null) {
        const Ge = n.object.position;
        x.copy(Ge).sub(n.target), x.applyQuaternion(L), o.setFromVector3(x), n.autoRotate && r === i.NONE && W(M(ut)), n.enableDamping ? (o.theta += c.theta * n.dampingFactor, o.phi += c.phi * n.dampingFactor) : (o.theta += c.theta, o.phi += c.phi);
        let at = n.minAzimuthAngle, et = n.maxAzimuthAngle;
        isFinite(at) && isFinite(et) && (at < -Math.PI ? at += Ue : at > Math.PI && (at -= Ue), et < -Math.PI ? et += Ue : et > Math.PI && (et -= Ue), at <= et ? o.theta = Math.max(at, Math.min(et, o.theta)) : o.theta = o.theta > (at + et) / 2 ? Math.max(at, o.theta) : Math.min(et, o.theta)), o.phi = Math.max(n.minPolarAngle, Math.min(n.maxPolarAngle, o.phi)), o.makeSafe(), n.enableDamping === !0 ? n.target.addScaledVector(h, n.dampingFactor) : n.target.add(h), n.target.sub(n.cursor), n.target.clampLength(n.minTargetRadius, n.maxTargetRadius), n.target.add(n.cursor);
        let fn = !1;
        if (n.zoomToCursor && R || n.object.isOrthographicCamera)
          o.radius = Q(o.radius);
        else {
          const It = o.radius;
          o.radius = Q(o.radius * l), fn = It != o.radius;
        }
        if (x.setFromSpherical(o), x.applyQuaternion(U), Ge.copy(n.target).add(x), n.object.lookAt(n.target), n.enableDamping === !0 ? (c.theta *= 1 - n.dampingFactor, c.phi *= 1 - n.dampingFactor, h.multiplyScalar(1 - n.dampingFactor)) : (c.set(0, 0, 0), h.set(0, 0, 0)), n.zoomToCursor && R) {
          let It = null;
          if (n.object.isPerspectiveCamera) {
            const pn = x.length();
            It = Q(pn * l);
            const Jt = pn - It;
            n.object.position.addScaledVector(A, Jt), n.object.updateMatrixWorld(), fn = !!Jt;
          } else if (n.object.isOrthographicCamera) {
            const pn = new C(D.x, D.y, 0);
            pn.unproject(n.object);
            const Jt = n.object.zoom;
            n.object.zoom = Math.max(n.minZoom, Math.min(n.maxZoom, n.object.zoom / l)), n.object.updateProjectionMatrix(), fn = Jt !== n.object.zoom;
            const Fi = new C(D.x, D.y, 0);
            Fi.unproject(n.object), n.object.position.sub(Fi).add(pn), n.object.updateMatrixWorld(), It = x.length();
          } else
            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), n.zoomToCursor = !1;
          It !== null && (this.screenSpacePanning ? n.target.set(0, 0, -1).transformDirection(n.object.matrix).multiplyScalar(It).add(n.object.position) : (ks.origin.copy(n.object.position), ks.direction.set(0, 0, -1).transformDirection(n.object.matrix), Math.abs(n.object.up.dot(ks.direction)) < Hg ? e.lookAt(n.target) : (mc.setFromNormalAndCoplanarPoint(n.object.up, n.target), ks.intersectPlane(mc, n.target))));
        } else if (n.object.isOrthographicCamera) {
          const It = n.object.zoom;
          n.object.zoom = Math.max(n.minZoom, Math.min(n.maxZoom, n.object.zoom / l)), It !== n.object.zoom && (n.object.updateProjectionMatrix(), fn = !0);
        }
        return l = 1, R = !1, fn || j.distanceToSquared(n.object.position) > a || 8 * (1 - ne.dot(n.object.quaternion)) > a || we.distanceToSquared(n.target) > a ? (n.dispatchEvent(fc), j.copy(n.object.position), ne.copy(n.object.quaternion), we.copy(n.target), !0) : !1;
      };
    }(), this.dispose = function() {
      n.domElement.removeEventListener("contextmenu", Ve), n.domElement.removeEventListener("pointerdown", b), n.domElement.removeEventListener("pointercancel", H), n.domElement.removeEventListener("wheel", Z), n.domElement.removeEventListener("pointermove", v), n.domElement.removeEventListener("pointerup", H), n.domElement.getRootNode().removeEventListener("keydown", oe, { capture: !0 }), n._domElementKeyEvents !== null && (n._domElementKeyEvents.removeEventListener("keydown", ye), n._domElementKeyEvents = null);
    };
    const n = this, i = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let r = i.NONE;
    const a = 1e-6, o = new dc(), c = new dc();
    let l = 1;
    const h = new C(), u = new Me(), d = new Me(), p = new Me(), g = new Me(), _ = new Me(), f = new Me(), m = new Me(), T = new Me(), S = new Me(), A = new C(), D = new Me();
    let R = !1;
    const w = [], k = {};
    let E = !1;
    function M(x) {
      return x !== null ? 2 * Math.PI / 60 * n.autoRotateSpeed * x : 2 * Math.PI / 60 / 60 * n.autoRotateSpeed;
    }
    function O(x) {
      const L = Math.abs(x * 0.01);
      return Math.pow(0.95, n.zoomSpeed * L);
    }
    function W(x) {
      c.theta -= x;
    }
    function P(x) {
      c.phi -= x;
    }
    const q = function() {
      const x = new C();
      return function(U, j) {
        x.setFromMatrixColumn(j, 0), x.multiplyScalar(-U), h.add(x);
      };
    }(), X = function() {
      const x = new C();
      return function(U, j) {
        n.screenSpacePanning === !0 ? x.setFromMatrixColumn(j, 1) : (x.setFromMatrixColumn(j, 0), x.crossVectors(n.object.up, x)), x.multiplyScalar(U), h.add(x);
      };
    }(), $ = function() {
      const x = new C();
      return function(U, j) {
        const ne = n.domElement;
        if (n.object.isPerspectiveCamera) {
          const we = n.object.position;
          x.copy(we).sub(n.target);
          let Ue = x.length();
          Ue *= Math.tan(n.object.fov / 2 * Math.PI / 180), q(2 * U * Ue / ne.clientHeight, n.object.matrix), X(2 * j * Ue / ne.clientHeight, n.object.matrix);
        } else
          n.object.isOrthographicCamera ? (q(U * (n.object.right - n.object.left) / n.object.zoom / ne.clientWidth, n.object.matrix), X(j * (n.object.top - n.object.bottom) / n.object.zoom / ne.clientHeight, n.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), n.enablePan = !1);
      };
    }();
    function J(x) {
      n.object.isPerspectiveCamera || n.object.isOrthographicCamera ? l /= x : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), n.enableZoom = !1);
    }
    function V(x) {
      n.object.isPerspectiveCamera || n.object.isOrthographicCamera ? l *= x : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), n.enableZoom = !1);
    }
    function ee(x, L) {
      if (!n.zoomToCursor)
        return;
      R = !0;
      const U = n.domElement.getBoundingClientRect(), j = x - U.left, ne = L - U.top, we = U.width, Ue = U.height;
      D.x = j / we * 2 - 1, D.y = -(ne / Ue) * 2 + 1, A.set(D.x, D.y, 1).unproject(n.object).sub(n.object.position).normalize();
    }
    function Q(x) {
      return Math.max(n.minDistance, Math.min(n.maxDistance, x));
    }
    function de(x) {
      u.set(x.clientX, x.clientY);
    }
    function Fe(x) {
      ee(x.clientX, x.clientX), m.set(x.clientX, x.clientY);
    }
    function Ye(x) {
      g.set(x.clientX, x.clientY);
    }
    function G(x) {
      d.set(x.clientX, x.clientY), p.subVectors(d, u).multiplyScalar(n.rotateSpeed);
      const L = n.domElement;
      W(2 * Math.PI * p.x / L.clientHeight), P(2 * Math.PI * p.y / L.clientHeight), u.copy(d), n.update();
    }
    function te(x) {
      T.set(x.clientX, x.clientY), S.subVectors(T, m), S.y > 0 ? J(O(S.y)) : S.y < 0 && V(O(S.y)), m.copy(T), n.update();
    }
    function he(x) {
      _.set(x.clientX, x.clientY), f.subVectors(_, g).multiplyScalar(n.panSpeed), $(f.x, f.y), g.copy(_), n.update();
    }
    function se(x) {
      ee(x.clientX, x.clientY), x.deltaY < 0 ? V(O(x.deltaY)) : x.deltaY > 0 && J(O(x.deltaY)), n.update();
    }
    function Be(x) {
      let L = !1;
      switch (x.code) {
        case n.keys.UP:
          x.ctrlKey || x.metaKey || x.shiftKey ? P(2 * Math.PI * n.rotateSpeed / n.domElement.clientHeight) : $(0, n.keyPanSpeed), L = !0;
          break;
        case n.keys.BOTTOM:
          x.ctrlKey || x.metaKey || x.shiftKey ? P(-2 * Math.PI * n.rotateSpeed / n.domElement.clientHeight) : $(0, -n.keyPanSpeed), L = !0;
          break;
        case n.keys.LEFT:
          x.ctrlKey || x.metaKey || x.shiftKey ? W(2 * Math.PI * n.rotateSpeed / n.domElement.clientHeight) : $(n.keyPanSpeed, 0), L = !0;
          break;
        case n.keys.RIGHT:
          x.ctrlKey || x.metaKey || x.shiftKey ? W(-2 * Math.PI * n.rotateSpeed / n.domElement.clientHeight) : $(-n.keyPanSpeed, 0), L = !0;
          break;
      }
      L && (x.preventDefault(), n.update());
    }
    function De(x) {
      if (w.length === 1)
        u.set(x.pageX, x.pageY);
      else {
        const L = $e(x), U = 0.5 * (x.pageX + L.x), j = 0.5 * (x.pageY + L.y);
        u.set(U, j);
      }
    }
    function N(x) {
      if (w.length === 1)
        g.set(x.pageX, x.pageY);
      else {
        const L = $e(x), U = 0.5 * (x.pageX + L.x), j = 0.5 * (x.pageY + L.y);
        g.set(U, j);
      }
    }
    function Ke(x) {
      const L = $e(x), U = x.pageX - L.x, j = x.pageY - L.y, ne = Math.sqrt(U * U + j * j);
      m.set(0, ne);
    }
    function ge(x) {
      n.enableZoom && Ke(x), n.enablePan && N(x);
    }
    function Ze(x) {
      n.enableZoom && Ke(x), n.enableRotate && De(x);
    }
    function xe(x) {
      if (w.length == 1)
        d.set(x.pageX, x.pageY);
      else {
        const U = $e(x), j = 0.5 * (x.pageX + U.x), ne = 0.5 * (x.pageY + U.y);
        d.set(j, ne);
      }
      p.subVectors(d, u).multiplyScalar(n.rotateSpeed);
      const L = n.domElement;
      W(2 * Math.PI * p.x / L.clientHeight), P(2 * Math.PI * p.y / L.clientHeight), u.copy(d);
    }
    function ke(x) {
      if (w.length === 1)
        _.set(x.pageX, x.pageY);
      else {
        const L = $e(x), U = 0.5 * (x.pageX + L.x), j = 0.5 * (x.pageY + L.y);
        _.set(U, j);
      }
      f.subVectors(_, g).multiplyScalar(n.panSpeed), $(f.x, f.y), g.copy(_);
    }
    function Ae(x) {
      const L = $e(x), U = x.pageX - L.x, j = x.pageY - L.y, ne = Math.sqrt(U * U + j * j);
      T.set(0, ne), S.set(0, Math.pow(T.y / m.y, n.zoomSpeed)), J(S.y), m.copy(T);
      const we = (x.pageX + L.x) * 0.5, Ue = (x.pageY + L.y) * 0.5;
      ee(we, Ue);
    }
    function He(x) {
      n.enableZoom && Ae(x), n.enablePan && ke(x);
    }
    function nt(x) {
      n.enableZoom && Ae(x), n.enableRotate && xe(x);
    }
    function b(x) {
      n.enabled !== !1 && (w.length === 0 && (n.domElement.setPointerCapture(x.pointerId), n.domElement.addEventListener("pointermove", v), n.domElement.addEventListener("pointerup", H)), !be(x) && (_e(x), x.pointerType === "touch" ? ie(x) : Y(x)));
    }
    function v(x) {
      n.enabled !== !1 && (x.pointerType === "touch" ? pe(x) : K(x));
    }
    function H(x) {
      switch (le(x), w.length) {
        case 0:
          n.domElement.releasePointerCapture(x.pointerId), n.domElement.removeEventListener("pointermove", v), n.domElement.removeEventListener("pointerup", H), n.dispatchEvent(pc), r = i.NONE;
          break;
        case 1:
          const L = w[0], U = k[L];
          ie({ pointerId: L, pageX: U.x, pageY: U.y });
          break;
      }
    }
    function Y(x) {
      let L;
      switch (x.button) {
        case 0:
          L = n.mouseButtons.LEFT;
          break;
        case 1:
          L = n.mouseButtons.MIDDLE;
          break;
        case 2:
          L = n.mouseButtons.RIGHT;
          break;
        default:
          L = -1;
      }
      switch (L) {
        case Zn.DOLLY:
          if (n.enableZoom === !1)
            return;
          Fe(x), r = i.DOLLY;
          break;
        case Zn.ROTATE:
          if (x.ctrlKey || x.metaKey || x.shiftKey) {
            if (n.enablePan === !1)
              return;
            Ye(x), r = i.PAN;
          } else {
            if (n.enableRotate === !1)
              return;
            de(x), r = i.ROTATE;
          }
          break;
        case Zn.PAN:
          if (x.ctrlKey || x.metaKey || x.shiftKey) {
            if (n.enableRotate === !1)
              return;
            de(x), r = i.ROTATE;
          } else {
            if (n.enablePan === !1)
              return;
            Ye(x), r = i.PAN;
          }
          break;
        default:
          r = i.NONE;
      }
      r !== i.NONE && n.dispatchEvent(Gr);
    }
    function K(x) {
      switch (r) {
        case i.ROTATE:
          if (n.enableRotate === !1)
            return;
          G(x);
          break;
        case i.DOLLY:
          if (n.enableZoom === !1)
            return;
          te(x);
          break;
        case i.PAN:
          if (n.enablePan === !1)
            return;
          he(x);
          break;
      }
    }
    function Z(x) {
      n.enabled === !1 || n.enableZoom === !1 || r !== i.NONE || (x.preventDefault(), n.dispatchEvent(Gr), se(me(x)), n.dispatchEvent(pc));
    }
    function me(x) {
      const L = x.deltaMode, U = {
        clientX: x.clientX,
        clientY: x.clientY,
        deltaY: x.deltaY
      };
      switch (L) {
        case 1:
          U.deltaY *= 16;
          break;
        case 2:
          U.deltaY *= 100;
          break;
      }
      return x.ctrlKey && !E && (U.deltaY *= 10), U;
    }
    function oe(x) {
      x.key === "Control" && (E = !0, n.domElement.getRootNode().addEventListener("keyup", ae, { passive: !0, capture: !0 }));
    }
    function ae(x) {
      x.key === "Control" && (E = !1, n.domElement.getRootNode().removeEventListener("keyup", ae, { passive: !0, capture: !0 }));
    }
    function ye(x) {
      n.enabled === !1 || n.enablePan === !1 || Be(x);
    }
    function ie(x) {
      switch (Ne(x), w.length) {
        case 1:
          switch (n.touches.ONE) {
            case $n.ROTATE:
              if (n.enableRotate === !1)
                return;
              De(x), r = i.TOUCH_ROTATE;
              break;
            case $n.PAN:
              if (n.enablePan === !1)
                return;
              N(x), r = i.TOUCH_PAN;
              break;
            default:
              r = i.NONE;
          }
          break;
        case 2:
          switch (n.touches.TWO) {
            case $n.DOLLY_PAN:
              if (n.enableZoom === !1 && n.enablePan === !1)
                return;
              ge(x), r = i.TOUCH_DOLLY_PAN;
              break;
            case $n.DOLLY_ROTATE:
              if (n.enableZoom === !1 && n.enableRotate === !1)
                return;
              Ze(x), r = i.TOUCH_DOLLY_ROTATE;
              break;
            default:
              r = i.NONE;
          }
          break;
        default:
          r = i.NONE;
      }
      r !== i.NONE && n.dispatchEvent(Gr);
    }
    function pe(x) {
      switch (Ne(x), r) {
        case i.TOUCH_ROTATE:
          if (n.enableRotate === !1)
            return;
          xe(x), n.update();
          break;
        case i.TOUCH_PAN:
          if (n.enablePan === !1)
            return;
          ke(x), n.update();
          break;
        case i.TOUCH_DOLLY_PAN:
          if (n.enableZoom === !1 && n.enablePan === !1)
            return;
          He(x), n.update();
          break;
        case i.TOUCH_DOLLY_ROTATE:
          if (n.enableZoom === !1 && n.enableRotate === !1)
            return;
          nt(x), n.update();
          break;
        default:
          r = i.NONE;
      }
    }
    function Ve(x) {
      n.enabled !== !1 && x.preventDefault();
    }
    function _e(x) {
      w.push(x.pointerId);
    }
    function le(x) {
      delete k[x.pointerId];
      for (let L = 0; L < w.length; L++)
        if (w[L] == x.pointerId) {
          w.splice(L, 1);
          return;
        }
    }
    function be(x) {
      for (let L = 0; L < w.length; L++)
        if (w[L] == x.pointerId)
          return !0;
      return !1;
    }
    function Ne(x) {
      let L = k[x.pointerId];
      L === void 0 && (L = new Me(), k[x.pointerId] = L), L.set(x.pageX, x.pageY);
    }
    function $e(x) {
      const L = x.pointerId === w[0] ? w[1] : w[0];
      return k[L];
    }
    n.domElement.addEventListener("contextmenu", Ve), n.domElement.addEventListener("pointerdown", b), n.domElement.addEventListener("pointercancel", H), n.domElement.addEventListener("wheel", Z, { passive: !1 }), n.domElement.getRootNode().addEventListener("keydown", oe, { passive: !0, capture: !0 }), this.update();
  }
}
class Gg extends tl {
  constructor(e = null) {
    super();
    const t = new Di();
    t.deleteAttribute("uv");
    const n = new ss({ side: bt }), i = new ss();
    let r = 5;
    e !== null && e._useLegacyLights === !1 && (r = 900);
    const a = new ll(16777215, r, 28, 2);
    a.position.set(0.418, 16.199, 0.3), this.add(a);
    const o = new Qe(t, n);
    o.position.set(-0.757, 13.219, 0.717), o.scale.set(31.713, 28.305, 28.591), this.add(o);
    const c = new Qe(t, i);
    c.position.set(-10.906, 2.009, 1.846), c.rotation.set(0, -0.195, 0), c.scale.set(2.328, 7.905, 4.651), this.add(c);
    const l = new Qe(t, i);
    l.position.set(-5.607, -0.754, -0.758), l.rotation.set(0, 0.994, 0), l.scale.set(1.97, 1.534, 3.955), this.add(l);
    const h = new Qe(t, i);
    h.position.set(6.167, 0.857, 7.803), h.rotation.set(0, 0.561, 0), h.scale.set(3.927, 6.285, 3.687), this.add(h);
    const u = new Qe(t, i);
    u.position.set(-2.017, 0.018, 6.124), u.rotation.set(0, 0.333, 0), u.scale.set(2.002, 4.566, 2.064), this.add(u);
    const d = new Qe(t, i);
    d.position.set(2.291, -0.756, -2.621), d.rotation.set(0, -0.286, 0), d.scale.set(1.546, 1.552, 1.496), this.add(d);
    const p = new Qe(t, i);
    p.position.set(-2.193, -0.369, -5.547), p.rotation.set(0, 0.516, 0), p.scale.set(3.875, 3.487, 2.986), this.add(p);
    const g = new Qe(t, gi(50));
    g.position.set(-16.116, 14.37, 8.208), g.scale.set(0.1, 2.428, 2.739), this.add(g);
    const _ = new Qe(t, gi(50));
    _.position.set(-16.109, 18.021, -8.207), _.scale.set(0.1, 2.425, 2.751), this.add(_);
    const f = new Qe(t, gi(17));
    f.position.set(14.904, 12.198, -1.832), f.scale.set(0.15, 4.265, 6.331), this.add(f);
    const m = new Qe(t, gi(43));
    m.position.set(-0.462, 8.89, 14.52), m.scale.set(4.38, 5.441, 0.088), this.add(m);
    const T = new Qe(t, gi(20));
    T.position.set(3.235, 11.486, -12.541), T.scale.set(2.5, 2, 0.1), this.add(T);
    const S = new Qe(t, gi(100));
    S.position.set(0, 20, 0), S.scale.set(1, 0.1, 1), this.add(S);
  }
  dispose() {
    const e = /* @__PURE__ */ new Set();
    this.traverse((t) => {
      t.isMesh && (e.add(t.geometry), e.add(t.material));
    });
    for (const t of e)
      t.dispose();
  }
}
function gi(s) {
  const e = new wn();
  return e.color.setScalar(s), e;
}
function gc(s, e) {
  if (e === xh)
    return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), s;
  if (e === Jr || e === Dc) {
    let t = s.getIndex();
    if (t === null) {
      const a = [], o = s.getAttribute("position");
      if (o !== void 0) {
        for (let c = 0; c < o.count; c++)
          a.push(c);
        s.setIndex(a), t = s.getIndex();
      } else
        return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), s;
    }
    const n = t.count - 2, i = [];
    if (e === Jr)
      for (let a = 1; a <= n; a++)
        i.push(t.getX(0)), i.push(t.getX(a)), i.push(t.getX(a + 1));
    else
      for (let a = 0; a < n; a++)
        a % 2 === 0 ? (i.push(t.getX(a)), i.push(t.getX(a + 1)), i.push(t.getX(a + 2))) : (i.push(t.getX(a + 2)), i.push(t.getX(a + 1)), i.push(t.getX(a)));
    i.length / 3 !== n && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const r = s.clone();
    return r.setIndex(i), r.clearGroups(), r;
  } else
    return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), s;
}
class Wg extends Kn {
  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new Kg(t);
    }), this.register(function(t) {
      return new Zg(t);
    }), this.register(function(t) {
      return new r_(t);
    }), this.register(function(t) {
      return new a_(t);
    }), this.register(function(t) {
      return new o_(t);
    }), this.register(function(t) {
      return new Jg(t);
    }), this.register(function(t) {
      return new Qg(t);
    }), this.register(function(t) {
      return new e_(t);
    }), this.register(function(t) {
      return new t_(t);
    }), this.register(function(t) {
      return new jg(t);
    }), this.register(function(t) {
      return new n_(t);
    }), this.register(function(t) {
      return new $g(t);
    }), this.register(function(t) {
      return new s_(t);
    }), this.register(function(t) {
      return new i_(t);
    }), this.register(function(t) {
      return new qg(t);
    }), this.register(function(t) {
      return new c_(t);
    }), this.register(function(t) {
      return new l_(t);
    });
  }
  load(e, t, n, i) {
    const r = this;
    let a;
    if (this.resourcePath !== "")
      a = this.resourcePath;
    else if (this.path !== "") {
      const l = Qi.extractUrlBase(e);
      a = Qi.resolveURL(l, this.path);
    } else
      a = Qi.extractUrlBase(e);
    this.manager.itemStart(e);
    const o = function(l) {
      i ? i(l) : console.error(l), r.manager.itemError(e), r.manager.itemEnd(e);
    }, c = new $s(this.manager);
    c.setPath(this.path), c.setResponseType("arraybuffer"), c.setRequestHeader(this.requestHeader), c.setWithCredentials(this.withCredentials), c.load(e, function(l) {
      try {
        r.parse(l, a, function(h) {
          t(h), r.manager.itemEnd(e);
        }, o);
      } catch (h) {
        o(h);
      }
    }, n, o);
  }
  setDRACOLoader(e) {
    return this.dracoLoader = e, this;
  }
  setDDSLoader() {
    throw new Error(
      'THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".'
    );
  }
  setKTX2Loader(e) {
    return this.ktx2Loader = e, this;
  }
  setMeshoptDecoder(e) {
    return this.meshoptDecoder = e, this;
  }
  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }
  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }
  parse(e, t, n, i) {
    let r;
    const a = {}, o = {}, c = new TextDecoder();
    if (typeof e == "string")
      r = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (c.decode(new Uint8Array(e, 0, 4)) === hl) {
        try {
          a[ze.KHR_BINARY_GLTF] = new h_(e);
        } catch (u) {
          i && i(u);
          return;
        }
        r = JSON.parse(a[ze.KHR_BINARY_GLTF].content);
      } else
        r = JSON.parse(c.decode(e));
    else
      r = e;
    if (r.asset === void 0 || r.asset.version[0] < 2) {
      i && i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const l = new E_(r, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    l.fileLoader.setRequestHeader(this.requestHeader);
    for (let h = 0; h < this.pluginCallbacks.length; h++) {
      const u = this.pluginCallbacks[h](l);
      u.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), o[u.name] = u, a[u.name] = !0;
    }
    if (r.extensionsUsed)
      for (let h = 0; h < r.extensionsUsed.length; ++h) {
        const u = r.extensionsUsed[h], d = r.extensionsRequired || [];
        switch (u) {
          case ze.KHR_MATERIALS_UNLIT:
            a[u] = new Yg();
            break;
          case ze.KHR_DRACO_MESH_COMPRESSION:
            a[u] = new u_(r, this.dracoLoader);
            break;
          case ze.KHR_TEXTURE_TRANSFORM:
            a[u] = new d_();
            break;
          case ze.KHR_MESH_QUANTIZATION:
            a[u] = new f_();
            break;
          default:
            d.indexOf(u) >= 0 && o[u] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + u + '".');
        }
      }
    l.setExtensions(a), l.setPlugins(o), l.parse(n, i);
  }
  parseAsync(e, t) {
    const n = this;
    return new Promise(function(i, r) {
      n.parse(e, t, i, r);
    });
  }
}
function Xg() {
  let s = {};
  return {
    get: function(e) {
      return s[e];
    },
    add: function(e, t) {
      s[e] = t;
    },
    remove: function(e) {
      delete s[e];
    },
    removeAll: function() {
      s = {};
    }
  };
}
const ze = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_MATERIALS_BUMP: "EXT_materials_bump",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class qg {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let n = 0, i = t.length; n < i; n++) {
      const r = t[n];
      r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, n = "light:" + e;
    let i = t.cache.get(n);
    if (i)
      return i;
    const r = t.json, c = ((r.extensions && r.extensions[this.name] || {}).lights || [])[e];
    let l;
    const h = new Se(16777215);
    c.color !== void 0 && h.setRGB(c.color[0], c.color[1], c.color[2], pt);
    const u = c.range !== void 0 ? c.range : 0;
    switch (c.type) {
      case "directional":
        l = new Ag(h), l.target.position.set(0, 0, -1), l.add(l.target);
        break;
      case "point":
        l = new ll(h), l.distance = u;
        break;
      case "spot":
        l = new yg(h), l.distance = u, c.spot = c.spot || {}, c.spot.innerConeAngle = c.spot.innerConeAngle !== void 0 ? c.spot.innerConeAngle : 0, c.spot.outerConeAngle = c.spot.outerConeAngle !== void 0 ? c.spot.outerConeAngle : Math.PI / 4, l.angle = c.spot.outerConeAngle, l.penumbra = 1 - c.spot.innerConeAngle / c.spot.outerConeAngle, l.target.position.set(0, 0, -1), l.add(l.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + c.type);
    }
    return l.position.set(0, 0, 0), l.decay = 2, Tn(l, c), c.intensity !== void 0 && (l.intensity = c.intensity), l.name = t.createUniqueName(c.name || "light_" + e), i = Promise.resolve(l), t.cache.add(n, i), i;
  }
  getDependency(e, t) {
    if (e === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, n = this.parser, r = n.json.nodes[e], o = (r.extensions && r.extensions[this.name] || {}).light;
    return o === void 0 ? null : this._loadLight(o).then(function(c) {
      return n._getNodeRef(t.cache, o, c);
    });
  }
}
class Yg {
  constructor() {
    this.name = ze.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return wn;
  }
  extendParams(e, t, n) {
    const i = [];
    e.color = new Se(1, 1, 1), e.opacity = 1;
    const r = t.pbrMetallicRoughness;
    if (r) {
      if (Array.isArray(r.baseColorFactor)) {
        const a = r.baseColorFactor;
        e.color.setRGB(a[0], a[1], a[2], pt), e.opacity = a[3];
      }
      r.baseColorTexture !== void 0 && i.push(n.assignTexture(e, "map", r.baseColorTexture, mt));
    }
    return Promise.all(i);
  }
}
class jg {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = i.extensions[this.name].emissiveStrength;
    return r !== void 0 && (t.emissiveIntensity = r), Promise.resolve();
  }
}
class Kg {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Zt;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = [], a = i.extensions[this.name];
    if (a.clearcoatFactor !== void 0 && (t.clearcoat = a.clearcoatFactor), a.clearcoatTexture !== void 0 && r.push(n.assignTexture(t, "clearcoatMap", a.clearcoatTexture)), a.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = a.clearcoatRoughnessFactor), a.clearcoatRoughnessTexture !== void 0 && r.push(n.assignTexture(t, "clearcoatRoughnessMap", a.clearcoatRoughnessTexture)), a.clearcoatNormalTexture !== void 0 && (r.push(n.assignTexture(t, "clearcoatNormalMap", a.clearcoatNormalTexture)), a.clearcoatNormalTexture.scale !== void 0)) {
      const o = a.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new Me(o, o);
    }
    return Promise.all(r);
  }
}
class Zg {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Zt;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = i.extensions[this.name];
    return t.dispersion = r.dispersion !== void 0 ? r.dispersion : 0, Promise.resolve();
  }
}
class $g {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Zt;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = [], a = i.extensions[this.name];
    return a.iridescenceFactor !== void 0 && (t.iridescence = a.iridescenceFactor), a.iridescenceTexture !== void 0 && r.push(n.assignTexture(t, "iridescenceMap", a.iridescenceTexture)), a.iridescenceIor !== void 0 && (t.iridescenceIOR = a.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), a.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = a.iridescenceThicknessMinimum), a.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = a.iridescenceThicknessMaximum), a.iridescenceThicknessTexture !== void 0 && r.push(n.assignTexture(t, "iridescenceThicknessMap", a.iridescenceThicknessTexture)), Promise.all(r);
  }
}
class Jg {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Zt;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = [];
    t.sheenColor = new Se(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1;
    const a = i.extensions[this.name];
    if (a.sheenColorFactor !== void 0) {
      const o = a.sheenColorFactor;
      t.sheenColor.setRGB(o[0], o[1], o[2], pt);
    }
    return a.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = a.sheenRoughnessFactor), a.sheenColorTexture !== void 0 && r.push(n.assignTexture(t, "sheenColorMap", a.sheenColorTexture, mt)), a.sheenRoughnessTexture !== void 0 && r.push(n.assignTexture(t, "sheenRoughnessMap", a.sheenRoughnessTexture)), Promise.all(r);
  }
}
class Qg {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Zt;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = [], a = i.extensions[this.name];
    return a.transmissionFactor !== void 0 && (t.transmission = a.transmissionFactor), a.transmissionTexture !== void 0 && r.push(n.assignTexture(t, "transmissionMap", a.transmissionTexture)), Promise.all(r);
  }
}
class e_ {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Zt;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = [], a = i.extensions[this.name];
    t.thickness = a.thicknessFactor !== void 0 ? a.thicknessFactor : 0, a.thicknessTexture !== void 0 && r.push(n.assignTexture(t, "thicknessMap", a.thicknessTexture)), t.attenuationDistance = a.attenuationDistance || 1 / 0;
    const o = a.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new Se().setRGB(o[0], o[1], o[2], pt), Promise.all(r);
  }
}
class t_ {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Zt;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = i.extensions[this.name];
    return t.ior = r.ior !== void 0 ? r.ior : 1.5, Promise.resolve();
  }
}
class n_ {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Zt;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = [], a = i.extensions[this.name];
    t.specularIntensity = a.specularFactor !== void 0 ? a.specularFactor : 1, a.specularTexture !== void 0 && r.push(n.assignTexture(t, "specularIntensityMap", a.specularTexture));
    const o = a.specularColorFactor || [1, 1, 1];
    return t.specularColor = new Se().setRGB(o[0], o[1], o[2], pt), a.specularColorTexture !== void 0 && r.push(n.assignTexture(t, "specularColorMap", a.specularColorTexture, mt)), Promise.all(r);
  }
}
class i_ {
  constructor(e) {
    this.parser = e, this.name = ze.EXT_MATERIALS_BUMP;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Zt;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = [], a = i.extensions[this.name];
    return t.bumpScale = a.bumpFactor !== void 0 ? a.bumpFactor : 1, a.bumpTexture !== void 0 && r.push(n.assignTexture(t, "bumpMap", a.bumpTexture)), Promise.all(r);
  }
}
class s_ {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Zt;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const r = [], a = i.extensions[this.name];
    return a.anisotropyStrength !== void 0 && (t.anisotropy = a.anisotropyStrength), a.anisotropyRotation !== void 0 && (t.anisotropyRotation = a.anisotropyRotation), a.anisotropyTexture !== void 0 && r.push(n.assignTexture(t, "anisotropyMap", a.anisotropyTexture)), Promise.all(r);
  }
}
class r_ {
  constructor(e) {
    this.parser = e, this.name = ze.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, n = t.json, i = n.textures[e];
    if (!i.extensions || !i.extensions[this.name])
      return null;
    const r = i.extensions[this.name], a = t.options.ktx2Loader;
    if (!a) {
      if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, r.source, a);
  }
}
class a_ {
  constructor(e) {
    this.parser = e, this.name = ze.EXT_TEXTURE_WEBP, this.isSupported = null;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, i = n.json, r = i.textures[e];
    if (!r.extensions || !r.extensions[t])
      return null;
    const a = r.extensions[t], o = i.images[a.source];
    let c = n.textureLoader;
    if (o.uri) {
      const l = n.options.manager.getHandler(o.uri);
      l !== null && (c = l);
    }
    return this.detectSupport().then(function(l) {
      if (l)
        return n.loadTextureImage(e, a.source, c);
      if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0)
        throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
      return n.loadTexture(e);
    });
  }
  detectSupport() {
    return this.isSupported || (this.isSupported = new Promise(function(e) {
      const t = new Image();
      t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", t.onload = t.onerror = function() {
        e(t.height === 1);
      };
    })), this.isSupported;
  }
}
class o_ {
  constructor(e) {
    this.parser = e, this.name = ze.EXT_TEXTURE_AVIF, this.isSupported = null;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, i = n.json, r = i.textures[e];
    if (!r.extensions || !r.extensions[t])
      return null;
    const a = r.extensions[t], o = i.images[a.source];
    let c = n.textureLoader;
    if (o.uri) {
      const l = n.options.manager.getHandler(o.uri);
      l !== null && (c = l);
    }
    return this.detectSupport().then(function(l) {
      if (l)
        return n.loadTextureImage(e, a.source, c);
      if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0)
        throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");
      return n.loadTexture(e);
    });
  }
  detectSupport() {
    return this.isSupported || (this.isSupported = new Promise(function(e) {
      const t = new Image();
      t.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=", t.onload = t.onerror = function() {
        e(t.height === 1);
      };
    })), this.isSupported;
  }
}
class c_ {
  constructor(e) {
    this.name = ze.EXT_MESHOPT_COMPRESSION, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, n = t.bufferViews[e];
    if (n.extensions && n.extensions[this.name]) {
      const i = n.extensions[this.name], r = this.parser.getDependency("buffer", i.buffer), a = this.parser.options.meshoptDecoder;
      if (!a || !a.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return r.then(function(o) {
        const c = i.byteOffset || 0, l = i.byteLength || 0, h = i.count, u = i.byteStride, d = new Uint8Array(o, c, l);
        return a.decodeGltfBufferAsync ? a.decodeGltfBufferAsync(h, u, d, i.mode, i.filter).then(function(p) {
          return p.buffer;
        }) : a.ready.then(function() {
          const p = new ArrayBuffer(h * u);
          return a.decodeGltfBuffer(new Uint8Array(p), h, u, d, i.mode, i.filter), p;
        });
      });
    } else
      return null;
  }
}
class l_ {
  constructor(e) {
    this.name = ze.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, n = t.nodes[e];
    if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0)
      return null;
    const i = t.meshes[n.mesh];
    for (const l of i.primitives)
      if (l.mode !== Ut.TRIANGLES && l.mode !== Ut.TRIANGLE_STRIP && l.mode !== Ut.TRIANGLE_FAN && l.mode !== void 0)
        return null;
    const a = n.extensions[this.name].attributes, o = [], c = {};
    for (const l in a)
      o.push(this.parser.getDependency("accessor", a[l]).then((h) => (c[l] = h, c[l])));
    return o.length < 1 ? null : (o.push(this.parser.createNodeMesh(e)), Promise.all(o).then((l) => {
      const h = l.pop(), u = h.isGroup ? h.children : [h], d = l[0].count, p = [];
      for (const g of u) {
        const _ = new Ie(), f = new C(), m = new Lt(), T = new C(1, 1, 1), S = new rg(g.geometry, g.material, d);
        for (let A = 0; A < d; A++)
          c.TRANSLATION && f.fromBufferAttribute(c.TRANSLATION, A), c.ROTATION && m.fromBufferAttribute(c.ROTATION, A), c.SCALE && T.fromBufferAttribute(c.SCALE, A), S.setMatrixAt(A, _.compose(f, m, T));
        for (const A in c)
          if (A === "_COLOR_0") {
            const D = c[A];
            S.instanceColor = new na(D.array, D.itemSize, D.normalized);
          } else
            A !== "TRANSLATION" && A !== "ROTATION" && A !== "SCALE" && g.geometry.setAttribute(A, c[A]);
        rt.prototype.copy.call(S, g), this.parser.assignFinalMaterial(S), p.push(S);
      }
      return h.isGroup ? (h.clear(), h.add(...p), h) : p[0];
    }));
  }
}
const hl = "glTF", ji = 12, _c = { JSON: 1313821514, BIN: 5130562 };
class h_ {
  constructor(e) {
    this.name = ze.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, ji), n = new TextDecoder();
    if (this.header = {
      magic: n.decode(new Uint8Array(e.slice(0, 4))),
      version: t.getUint32(4, !0),
      length: t.getUint32(8, !0)
    }, this.header.magic !== hl)
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2)
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const i = this.header.length - ji, r = new DataView(e, ji);
    let a = 0;
    for (; a < i; ) {
      const o = r.getUint32(a, !0);
      a += 4;
      const c = r.getUint32(a, !0);
      if (a += 4, c === _c.JSON) {
        const l = new Uint8Array(e, ji + a, o);
        this.content = n.decode(l);
      } else if (c === _c.BIN) {
        const l = ji + a;
        this.body = e.slice(l, l + o);
      }
      a += o;
    }
    if (this.content === null)
      throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class u_ {
  constructor(e, t) {
    if (!t)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = ze.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const n = this.json, i = this.dracoLoader, r = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, c = {}, l = {};
    for (const h in a) {
      const u = ra[h] || h.toLowerCase();
      o[u] = a[h];
    }
    for (const h in e.attributes) {
      const u = ra[h] || h.toLowerCase();
      if (a[h] !== void 0) {
        const d = n.accessors[e.attributes[h]], p = Ei[d.componentType];
        l[u] = p.name, c[u] = d.normalized === !0;
      }
    }
    return t.getDependency("bufferView", r).then(function(h) {
      return new Promise(function(u, d) {
        i.decodeDracoFile(h, function(p) {
          for (const g in p.attributes) {
            const _ = p.attributes[g], f = c[g];
            f !== void 0 && (_.normalized = f);
          }
          u(p);
        }, o, l, pt, d);
      });
    });
  }
}
class d_ {
  constructor() {
    this.name = ze.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0), e;
  }
}
class f_ {
  constructor() {
    this.name = ze.KHR_MESH_QUANTIZATION;
  }
}
class ul extends cs {
  constructor(e, t, n, i) {
    super(e, t, n, i);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, n = this.sampleValues, i = this.valueSize, r = e * i * 3 + i;
    for (let a = 0; a !== i; a++)
      t[a] = n[r + a];
    return t;
  }
  interpolate_(e, t, n, i) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, c = o * 2, l = o * 3, h = i - t, u = (n - t) / h, d = u * u, p = d * u, g = e * l, _ = g - l, f = -2 * p + 3 * d, m = p - d, T = 1 - f, S = m - d + u;
    for (let A = 0; A !== o; A++) {
      const D = a[_ + A + o], R = a[_ + A + c] * h, w = a[g + A + o], k = a[g + A] * h;
      r[A] = T * D + S * R + f * w + m * k;
    }
    return r;
  }
}
const p_ = new Lt();
class m_ extends ul {
  interpolate_(e, t, n, i) {
    const r = super.interpolate_(e, t, n, i);
    return p_.fromArray(r).normalize().toArray(r), r;
  }
}
const Ut = {
  FLOAT: 5126,
  //FLOAT_MAT2: 35674,
  FLOAT_MAT3: 35675,
  FLOAT_MAT4: 35676,
  FLOAT_VEC2: 35664,
  FLOAT_VEC3: 35665,
  FLOAT_VEC4: 35666,
  LINEAR: 9729,
  REPEAT: 10497,
  SAMPLER_2D: 35678,
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6,
  UNSIGNED_BYTE: 5121,
  UNSIGNED_SHORT: 5123
}, Ei = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, xc = {
  9728: At,
  9729: Pt,
  9984: Tc,
  9985: zs,
  9986: Ki,
  9987: cn
}, vc = {
  33071: bn,
  33648: Gs,
  10497: bi
}, Wr = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, ra = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv1",
  TEXCOORD_2: "uv2",
  TEXCOORD_3: "uv3",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
}, yn = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, g_ = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: Ri,
  STEP: ns
}, Xr = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function __(s) {
  return s.DefaultMaterial === void 0 && (s.DefaultMaterial = new ss({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: !1,
    depthTest: !0,
    side: un
  })), s.DefaultMaterial;
}
function Vn(s, e, t) {
  for (const n in t.extensions)
    s[n] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[n] = t.extensions[n]);
}
function Tn(s, e) {
  e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(s.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function x_(s, e, t) {
  let n = !1, i = !1, r = !1;
  for (let l = 0, h = e.length; l < h; l++) {
    const u = e[l];
    if (u.POSITION !== void 0 && (n = !0), u.NORMAL !== void 0 && (i = !0), u.COLOR_0 !== void 0 && (r = !0), n && i && r)
      break;
  }
  if (!n && !i && !r)
    return Promise.resolve(s);
  const a = [], o = [], c = [];
  for (let l = 0, h = e.length; l < h; l++) {
    const u = e[l];
    if (n) {
      const d = u.POSITION !== void 0 ? t.getDependency("accessor", u.POSITION) : s.attributes.position;
      a.push(d);
    }
    if (i) {
      const d = u.NORMAL !== void 0 ? t.getDependency("accessor", u.NORMAL) : s.attributes.normal;
      o.push(d);
    }
    if (r) {
      const d = u.COLOR_0 !== void 0 ? t.getDependency("accessor", u.COLOR_0) : s.attributes.color;
      c.push(d);
    }
  }
  return Promise.all([
    Promise.all(a),
    Promise.all(o),
    Promise.all(c)
  ]).then(function(l) {
    const h = l[0], u = l[1], d = l[2];
    return n && (s.morphAttributes.position = h), i && (s.morphAttributes.normal = u), r && (s.morphAttributes.color = d), s.morphTargetsRelative = !0, s;
  });
}
function v_(s, e) {
  if (s.updateMorphTargets(), e.weights !== void 0)
    for (let t = 0, n = e.weights.length; t < n; t++)
      s.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (s.morphTargetInfluences.length === t.length) {
      s.morphTargetDictionary = {};
      for (let n = 0, i = t.length; n < i; n++)
        s.morphTargetDictionary[t[n]] = n;
    } else
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function M_(s) {
  let e;
  const t = s.extensions && s.extensions[ze.KHR_DRACO_MESH_COMPRESSION];
  if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + qr(t.attributes) : e = s.indices + ":" + qr(s.attributes) + ":" + s.mode, s.targets !== void 0)
    for (let n = 0, i = s.targets.length; n < i; n++)
      e += ":" + qr(s.targets[n]);
  return e;
}
function qr(s) {
  let e = "";
  const t = Object.keys(s).sort();
  for (let n = 0, i = t.length; n < i; n++)
    e += t[n] + ":" + s[t[n]] + ";";
  return e;
}
function aa(s) {
  switch (s) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function S_(s) {
  return s.search(/\.jpe?g($|\?)/i) > 0 || s.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : s.search(/\.webp($|\?)/i) > 0 || s.search(/^data\:image\/webp/) === 0 ? "image/webp" : "image/png";
}
const y_ = new Ie();
class E_ {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Xg(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let n = !1, i = !1, r = -1;
    typeof navigator < "u" && (n = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === !0, i = navigator.userAgent.indexOf("Firefox") > -1, r = i ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1), typeof createImageBitmap > "u" || n || i && r < 98 ? this.textureLoader = new Mg(this.options.manager) : this.textureLoader = new bg(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new $s(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const n = this, i = this.json, r = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(a) {
      return a._markDefs && a._markDefs();
    }), Promise.all(this._invokeAll(function(a) {
      return a.beforeRoot && a.beforeRoot();
    })).then(function() {
      return Promise.all([
        n.getDependencies("scene"),
        n.getDependencies("animation"),
        n.getDependencies("camera")
      ]);
    }).then(function(a) {
      const o = {
        scene: a[0][i.scene || 0],
        scenes: a[0],
        animations: a[1],
        cameras: a[2],
        asset: i.asset,
        parser: n,
        userData: {}
      };
      return Vn(r, o, i), Tn(o, i), Promise.all(n._invokeAll(function(c) {
        return c.afterRoot && c.afterRoot(o);
      })).then(function() {
        for (const c of o.scenes)
          c.updateMatrixWorld();
        e(o);
      });
    }).catch(t);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   */
  _markDefs() {
    const e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
    for (let i = 0, r = t.length; i < r; i++) {
      const a = t[i].joints;
      for (let o = 0, c = a.length; o < c; o++)
        e[a[o]].isBone = !0;
    }
    for (let i = 0, r = e.length; i < r; i++) {
      const a = e[i];
      a.mesh !== void 0 && (this._addNodeRef(this.meshCache, a.mesh), a.skin !== void 0 && (n[a.mesh].isSkinnedMesh = !0)), a.camera !== void 0 && this._addNodeRef(this.cameraCache, a.camera);
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   */
  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  /** Returns a reference to a shared resource, cloning it if necessary. */
  _getNodeRef(e, t, n) {
    if (e.refs[t] <= 1)
      return n;
    const i = n.clone(), r = (a, o) => {
      const c = this.associations.get(a);
      c != null && this.associations.set(o, c);
      for (const [l, h] of a.children.entries())
        r(h, o.children[l]);
    };
    return r(n, i), i.name += "_instance_" + e.uses[t]++, i;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let n = 0; n < t.length; n++) {
      const i = e(t[n]);
      if (i)
        return i;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const n = [];
    for (let i = 0; i < t.length; i++) {
      const r = e(t[i]);
      r && n.push(r);
    }
    return n;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(e, t) {
    const n = e + ":" + t;
    let i = this.cache.get(n);
    if (!i) {
      switch (e) {
        case "scene":
          i = this.loadScene(t);
          break;
        case "node":
          i = this._invokeOne(function(r) {
            return r.loadNode && r.loadNode(t);
          });
          break;
        case "mesh":
          i = this._invokeOne(function(r) {
            return r.loadMesh && r.loadMesh(t);
          });
          break;
        case "accessor":
          i = this.loadAccessor(t);
          break;
        case "bufferView":
          i = this._invokeOne(function(r) {
            return r.loadBufferView && r.loadBufferView(t);
          });
          break;
        case "buffer":
          i = this.loadBuffer(t);
          break;
        case "material":
          i = this._invokeOne(function(r) {
            return r.loadMaterial && r.loadMaterial(t);
          });
          break;
        case "texture":
          i = this._invokeOne(function(r) {
            return r.loadTexture && r.loadTexture(t);
          });
          break;
        case "skin":
          i = this.loadSkin(t);
          break;
        case "animation":
          i = this._invokeOne(function(r) {
            return r.loadAnimation && r.loadAnimation(t);
          });
          break;
        case "camera":
          i = this.loadCamera(t);
          break;
        default:
          if (i = this._invokeOne(function(r) {
            return r != this && r.getDependency && r.getDependency(e, t);
          }), !i)
            throw new Error("Unknown type: " + e);
          break;
      }
      this.cache.add(n, i);
    }
    return i;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const n = this, i = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(i.map(function(r, a) {
        return n.getDependency(e, a);
      })), this.cache.add(e, t);
    }
    return t;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(e) {
    const t = this.json.buffers[e], n = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0)
      return Promise.resolve(this.extensions[ze.KHR_BINARY_GLTF].body);
    const i = this.options;
    return new Promise(function(r, a) {
      n.load(Qi.resolveURL(t.uri, i.path), r, void 0, function() {
        a(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function(n) {
      const i = t.byteLength || 0, r = t.byteOffset || 0;
      return n.slice(r, r + i);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(e) {
    const t = this, n = this.json, i = this.json.accessors[e];
    if (i.bufferView === void 0 && i.sparse === void 0) {
      const a = Wr[i.type], o = Ei[i.componentType], c = i.normalized === !0, l = new o(i.count * a);
      return Promise.resolve(new _t(l, a, c));
    }
    const r = [];
    return i.bufferView !== void 0 ? r.push(this.getDependency("bufferView", i.bufferView)) : r.push(null), i.sparse !== void 0 && (r.push(this.getDependency("bufferView", i.sparse.indices.bufferView)), r.push(this.getDependency("bufferView", i.sparse.values.bufferView))), Promise.all(r).then(function(a) {
      const o = a[0], c = Wr[i.type], l = Ei[i.componentType], h = l.BYTES_PER_ELEMENT, u = h * c, d = i.byteOffset || 0, p = i.bufferView !== void 0 ? n.bufferViews[i.bufferView].byteStride : void 0, g = i.normalized === !0;
      let _, f;
      if (p && p !== u) {
        const m = Math.floor(d / p), T = "InterleavedBuffer:" + i.bufferView + ":" + i.componentType + ":" + m + ":" + i.count;
        let S = t.cache.get(T);
        S || (_ = new l(o, m * p, i.count * p / h), S = new eg(_, p / h), t.cache.add(T, S)), f = new ma(S, c, d % p / h, g);
      } else
        o === null ? _ = new l(i.count * c) : _ = new l(o, d, i.count * c), f = new _t(_, c, g);
      if (i.sparse !== void 0) {
        const m = Wr.SCALAR, T = Ei[i.sparse.indices.componentType], S = i.sparse.indices.byteOffset || 0, A = i.sparse.values.byteOffset || 0, D = new T(a[1], S, i.sparse.count * m), R = new l(a[2], A, i.sparse.count * c);
        o !== null && (f = new _t(f.array.slice(), f.itemSize, f.normalized));
        for (let w = 0, k = D.length; w < k; w++) {
          const E = D[w];
          if (f.setX(E, R[w * c]), c >= 2 && f.setY(E, R[w * c + 1]), c >= 3 && f.setZ(E, R[w * c + 2]), c >= 4 && f.setW(E, R[w * c + 3]), c >= 5)
            throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
      }
      return f;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture|null>}
   */
  loadTexture(e) {
    const t = this.json, n = this.options, r = t.textures[e].source, a = t.images[r];
    let o = this.textureLoader;
    if (a.uri) {
      const c = n.manager.getHandler(a.uri);
      c !== null && (o = c);
    }
    return this.loadTextureImage(e, r, o);
  }
  loadTextureImage(e, t, n) {
    const i = this, r = this.json, a = r.textures[e], o = r.images[t], c = (o.uri || o.bufferView) + ":" + a.sampler;
    if (this.textureCache[c])
      return this.textureCache[c];
    const l = this.loadImageSource(t, n).then(function(h) {
      h.flipY = !1, h.name = a.name || o.name || "", h.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === !1 && (h.name = o.uri);
      const d = (r.samplers || {})[a.sampler] || {};
      return h.magFilter = xc[d.magFilter] || Pt, h.minFilter = xc[d.minFilter] || cn, h.wrapS = vc[d.wrapS] || bi, h.wrapT = vc[d.wrapT] || bi, i.associations.set(h, { textures: e }), h;
    }).catch(function() {
      return null;
    });
    return this.textureCache[c] = l, l;
  }
  loadImageSource(e, t) {
    const n = this, i = this.json, r = this.options;
    if (this.sourceCache[e] !== void 0)
      return this.sourceCache[e].then((u) => u.clone());
    const a = i.images[e], o = self.URL || self.webkitURL;
    let c = a.uri || "", l = !1;
    if (a.bufferView !== void 0)
      c = n.getDependency("bufferView", a.bufferView).then(function(u) {
        l = !0;
        const d = new Blob([u], { type: a.mimeType });
        return c = o.createObjectURL(d), c;
      });
    else if (a.uri === void 0)
      throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const h = Promise.resolve(c).then(function(u) {
      return new Promise(function(d, p) {
        let g = d;
        t.isImageBitmapLoader === !0 && (g = function(_) {
          const f = new ft(_);
          f.needsUpdate = !0, d(f);
        }), t.load(Qi.resolveURL(u, r.path), g, void 0, p);
      });
    }).then(function(u) {
      return l === !0 && o.revokeObjectURL(c), u.userData.mimeType = a.mimeType || S_(a.uri), u;
    }).catch(function(u) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", c), u;
    });
    return this.sourceCache[e] = h, h;
  }
  /**
   * Asynchronously assigns a texture to the given material parameters.
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @return {Promise<Texture>}
   */
  assignTexture(e, t, n, i) {
    const r = this;
    return this.getDependency("texture", n.index).then(function(a) {
      if (!a)
        return null;
      if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), r.extensions[ze.KHR_TEXTURE_TRANSFORM]) {
        const o = n.extensions !== void 0 ? n.extensions[ze.KHR_TEXTURE_TRANSFORM] : void 0;
        if (o) {
          const c = r.associations.get(a);
          a = r.extensions[ze.KHR_TEXTURE_TRANSFORM].extendTexture(a, o), r.associations.set(a, c);
        }
      }
      return i !== void 0 && (a.colorSpace = i), e[t] = a, a;
    });
  }
  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accommodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   * @param  {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(e) {
    const t = e.geometry;
    let n = e.material;
    const i = t.attributes.tangent === void 0, r = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
    if (e.isPoints) {
      const o = "PointsMaterial:" + n.uuid;
      let c = this.cache.get(o);
      c || (c = new rl(), Yt.prototype.copy.call(c, n), c.color.copy(n.color), c.map = n.map, c.sizeAttenuation = !1, this.cache.add(o, c)), n = c;
    } else if (e.isLine) {
      const o = "LineBasicMaterial:" + n.uuid;
      let c = this.cache.get(o);
      c || (c = new sl(), Yt.prototype.copy.call(c, n), c.color.copy(n.color), c.map = n.map, this.cache.add(o, c)), n = c;
    }
    if (i || r || a) {
      let o = "ClonedMaterial:" + n.uuid + ":";
      i && (o += "derivative-tangents:"), r && (o += "vertex-colors:"), a && (o += "flat-shading:");
      let c = this.cache.get(o);
      c || (c = n.clone(), r && (c.vertexColors = !0), a && (c.flatShading = !0), i && (c.normalScale && (c.normalScale.y *= -1), c.clearcoatNormalScale && (c.clearcoatNormalScale.y *= -1)), this.cache.add(o, c), this.associations.set(c, this.associations.get(n))), n = c;
    }
    e.material = n;
  }
  getMaterialType() {
    return ss;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(e) {
    const t = this, n = this.json, i = this.extensions, r = n.materials[e];
    let a;
    const o = {}, c = r.extensions || {}, l = [];
    if (c[ze.KHR_MATERIALS_UNLIT]) {
      const u = i[ze.KHR_MATERIALS_UNLIT];
      a = u.getMaterialType(), l.push(u.extendParams(o, r, t));
    } else {
      const u = r.pbrMetallicRoughness || {};
      if (o.color = new Se(1, 1, 1), o.opacity = 1, Array.isArray(u.baseColorFactor)) {
        const d = u.baseColorFactor;
        o.color.setRGB(d[0], d[1], d[2], pt), o.opacity = d[3];
      }
      u.baseColorTexture !== void 0 && l.push(t.assignTexture(o, "map", u.baseColorTexture, mt)), o.metalness = u.metallicFactor !== void 0 ? u.metallicFactor : 1, o.roughness = u.roughnessFactor !== void 0 ? u.roughnessFactor : 1, u.metallicRoughnessTexture !== void 0 && (l.push(t.assignTexture(o, "metalnessMap", u.metallicRoughnessTexture)), l.push(t.assignTexture(o, "roughnessMap", u.metallicRoughnessTexture))), a = this._invokeOne(function(d) {
        return d.getMaterialType && d.getMaterialType(e);
      }), l.push(Promise.all(this._invokeAll(function(d) {
        return d.extendMaterialParams && d.extendMaterialParams(e, o);
      })));
    }
    r.doubleSided === !0 && (o.side = Wt);
    const h = r.alphaMode || Xr.OPAQUE;
    if (h === Xr.BLEND ? (o.transparent = !0, o.depthWrite = !1) : (o.transparent = !1, h === Xr.MASK && (o.alphaTest = r.alphaCutoff !== void 0 ? r.alphaCutoff : 0.5)), r.normalTexture !== void 0 && a !== wn && (l.push(t.assignTexture(o, "normalMap", r.normalTexture)), o.normalScale = new Me(1, 1), r.normalTexture.scale !== void 0)) {
      const u = r.normalTexture.scale;
      o.normalScale.set(u, u);
    }
    if (r.occlusionTexture !== void 0 && a !== wn && (l.push(t.assignTexture(o, "aoMap", r.occlusionTexture)), r.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = r.occlusionTexture.strength)), r.emissiveFactor !== void 0 && a !== wn) {
      const u = r.emissiveFactor;
      o.emissive = new Se().setRGB(u[0], u[1], u[2], pt);
    }
    return r.emissiveTexture !== void 0 && a !== wn && l.push(t.assignTexture(o, "emissiveMap", r.emissiveTexture, mt)), Promise.all(l).then(function() {
      const u = new a(o);
      return r.name && (u.name = r.name), Tn(u, r), t.associations.set(u, { materials: e }), r.extensions && Vn(i, u, r), u;
    });
  }
  /** When Object3D instances are targeted by animation, they need unique names. */
  createUniqueName(e) {
    const t = Xe.sanitizeNodeName(e || "");
    return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(e) {
    const t = this, n = this.extensions, i = this.primitiveCache;
    function r(o) {
      return n[ze.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o, t).then(function(c) {
        return Mc(c, o, t);
      });
    }
    const a = [];
    for (let o = 0, c = e.length; o < c; o++) {
      const l = e[o], h = M_(l), u = i[h];
      if (u)
        a.push(u.promise);
      else {
        let d;
        l.extensions && l.extensions[ze.KHR_DRACO_MESH_COMPRESSION] ? d = r(l) : d = Mc(new Vt(), l, t), i[h] = { primitive: l, promise: d }, a.push(d);
      }
    }
    return Promise.all(a);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh>}
   */
  loadMesh(e) {
    const t = this, n = this.json, i = this.extensions, r = n.meshes[e], a = r.primitives, o = [];
    for (let c = 0, l = a.length; c < l; c++) {
      const h = a[c].material === void 0 ? __(this.cache) : this.getDependency("material", a[c].material);
      o.push(h);
    }
    return o.push(t.loadGeometries(a)), Promise.all(o).then(function(c) {
      const l = c.slice(0, c.length - 1), h = c[c.length - 1], u = [];
      for (let p = 0, g = h.length; p < g; p++) {
        const _ = h[p], f = a[p];
        let m;
        const T = l[p];
        if (f.mode === Ut.TRIANGLES || f.mode === Ut.TRIANGLE_STRIP || f.mode === Ut.TRIANGLE_FAN || f.mode === void 0)
          m = r.isSkinnedMesh === !0 ? new ng(_, T) : new Qe(_, T), m.isSkinnedMesh === !0 && m.normalizeSkinWeights(), f.mode === Ut.TRIANGLE_STRIP ? m.geometry = gc(m.geometry, Dc) : f.mode === Ut.TRIANGLE_FAN && (m.geometry = gc(m.geometry, Jr));
        else if (f.mode === Ut.LINES)
          m = new ag(_, T);
        else if (f.mode === Ut.LINE_STRIP)
          m = new _a(_, T);
        else if (f.mode === Ut.LINE_LOOP)
          m = new og(_, T);
        else if (f.mode === Ut.POINTS)
          m = new cg(_, T);
        else
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + f.mode);
        Object.keys(m.geometry.morphAttributes).length > 0 && v_(m, r), m.name = t.createUniqueName(r.name || "mesh_" + e), Tn(m, r), f.extensions && Vn(i, m, f), t.assignFinalMaterial(m), u.push(m);
      }
      for (let p = 0, g = u.length; p < g; p++)
        t.associations.set(u[p], {
          meshes: e,
          primitives: p
        });
      if (u.length === 1)
        return r.extensions && Vn(i, u[0], r), u[0];
      const d = new qn();
      r.extensions && Vn(i, d, r), t.associations.set(d, { meshes: e });
      for (let p = 0, g = u.length; p < g; p++)
        d.add(u[p]);
      return d;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   * @param {number} cameraIndex
   * @return {Promise<THREE.Camera>}
   */
  loadCamera(e) {
    let t;
    const n = this.json.cameras[e], i = n[n.type];
    if (!i) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return n.type === "perspective" ? t = new Tt(Oc.radToDeg(i.yfov), i.aspectRatio || 1, i.znear || 1, i.zfar || 2e6) : n.type === "orthographic" && (t = new fa(-i.xmag, i.xmag, i.ymag, -i.ymag, i.znear, i.zfar)), n.name && (t.name = this.createUniqueName(n.name)), Tn(t, n), Promise.resolve(t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(e) {
    const t = this.json.skins[e], n = [];
    for (let i = 0, r = t.joints.length; i < r; i++)
      n.push(this._loadNodeShallow(t.joints[i]));
    return t.inverseBindMatrices !== void 0 ? n.push(this.getDependency("accessor", t.inverseBindMatrices)) : n.push(null), Promise.all(n).then(function(i) {
      const r = i.pop(), a = i, o = [], c = [];
      for (let l = 0, h = a.length; l < h; l++) {
        const u = a[l];
        if (u) {
          o.push(u);
          const d = new Ie();
          r !== null && d.fromArray(r.array, l * 16), c.push(d);
        } else
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[l]);
      }
      return new ga(o, c);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(e) {
    const t = this.json, n = this, i = t.animations[e], r = i.name ? i.name : "animation_" + e, a = [], o = [], c = [], l = [], h = [];
    for (let u = 0, d = i.channels.length; u < d; u++) {
      const p = i.channels[u], g = i.samplers[p.sampler], _ = p.target, f = _.node, m = i.parameters !== void 0 ? i.parameters[g.input] : g.input, T = i.parameters !== void 0 ? i.parameters[g.output] : g.output;
      _.node !== void 0 && (a.push(this.getDependency("node", f)), o.push(this.getDependency("accessor", m)), c.push(this.getDependency("accessor", T)), l.push(g), h.push(_));
    }
    return Promise.all([
      Promise.all(a),
      Promise.all(o),
      Promise.all(c),
      Promise.all(l),
      Promise.all(h)
    ]).then(function(u) {
      const d = u[0], p = u[1], g = u[2], _ = u[3], f = u[4], m = [];
      for (let T = 0, S = d.length; T < S; T++) {
        const A = d[T], D = p[T], R = g[T], w = _[T], k = f[T];
        if (A === void 0)
          continue;
        A.updateMatrix && A.updateMatrix();
        const E = n._createAnimationTracks(A, D, R, w, k);
        if (E)
          for (let M = 0; M < E.length; M++)
            m.push(E[M]);
      }
      return new sa(r, void 0, m);
    });
  }
  createNodeMesh(e) {
    const t = this.json, n = this, i = t.nodes[e];
    return i.mesh === void 0 ? null : n.getDependency("mesh", i.mesh).then(function(r) {
      const a = n._getNodeRef(n.meshCache, i.mesh, r);
      return i.weights !== void 0 && a.traverse(function(o) {
        if (o.isMesh)
          for (let c = 0, l = i.weights.length; c < l; c++)
            o.morphTargetInfluences[c] = i.weights[c];
      }), a;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(e) {
    const t = this.json, n = this, i = t.nodes[e], r = n._loadNodeShallow(e), a = [], o = i.children || [];
    for (let l = 0, h = o.length; l < h; l++)
      a.push(n.getDependency("node", o[l]));
    const c = i.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", i.skin);
    return Promise.all([
      r,
      Promise.all(a),
      c
    ]).then(function(l) {
      const h = l[0], u = l[1], d = l[2];
      d !== null && h.traverse(function(p) {
        p.isSkinnedMesh && p.bind(d, y_);
      });
      for (let p = 0, g = u.length; p < g; p++)
        h.add(u[p]);
      return h;
    });
  }
  // ._loadNodeShallow() parses a single node.
  // skin and child nodes are created and added in .loadNode() (no '_' prefix).
  _loadNodeShallow(e) {
    const t = this.json, n = this.extensions, i = this;
    if (this.nodeCache[e] !== void 0)
      return this.nodeCache[e];
    const r = t.nodes[e], a = r.name ? i.createUniqueName(r.name) : "", o = [], c = i._invokeOne(function(l) {
      return l.createNodeMesh && l.createNodeMesh(e);
    });
    return c && o.push(c), r.camera !== void 0 && o.push(i.getDependency("camera", r.camera).then(function(l) {
      return i._getNodeRef(i.cameraCache, r.camera, l);
    })), i._invokeAll(function(l) {
      return l.createNodeAttachment && l.createNodeAttachment(e);
    }).forEach(function(l) {
      o.push(l);
    }), this.nodeCache[e] = Promise.all(o).then(function(l) {
      let h;
      if (r.isBone === !0 ? h = new nl() : l.length > 1 ? h = new qn() : l.length === 1 ? h = l[0] : h = new rt(), h !== l[0])
        for (let u = 0, d = l.length; u < d; u++)
          h.add(l[u]);
      if (r.name && (h.userData.name = r.name, h.name = a), Tn(h, r), r.extensions && Vn(n, h, r), r.matrix !== void 0) {
        const u = new Ie();
        u.fromArray(r.matrix), h.applyMatrix4(u);
      } else
        r.translation !== void 0 && h.position.fromArray(r.translation), r.rotation !== void 0 && h.quaternion.fromArray(r.rotation), r.scale !== void 0 && h.scale.fromArray(r.scale);
      return i.associations.has(h) || i.associations.set(h, {}), i.associations.get(h).nodes = e, h;
    }), this.nodeCache[e];
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(e) {
    const t = this.extensions, n = this.json.scenes[e], i = this, r = new qn();
    n.name && (r.name = i.createUniqueName(n.name)), Tn(r, n), n.extensions && Vn(t, r, n);
    const a = n.nodes || [], o = [];
    for (let c = 0, l = a.length; c < l; c++)
      o.push(i.getDependency("node", a[c]));
    return Promise.all(o).then(function(c) {
      for (let h = 0, u = c.length; h < u; h++)
        r.add(c[h]);
      const l = (h) => {
        const u = /* @__PURE__ */ new Map();
        for (const [d, p] of i.associations)
          (d instanceof Yt || d instanceof ft) && u.set(d, p);
        return h.traverse((d) => {
          const p = i.associations.get(d);
          p != null && u.set(d, p);
        }), u;
      };
      return i.associations = l(r), r;
    });
  }
  _createAnimationTracks(e, t, n, i, r) {
    const a = [], o = e.name ? e.name : e.uuid, c = [];
    yn[r.path] === yn.weights ? e.traverse(function(d) {
      d.morphTargetInfluences && c.push(d.name ? d.name : d.uuid);
    }) : c.push(o);
    let l;
    switch (yn[r.path]) {
      case yn.weights:
        l = Li;
        break;
      case yn.rotation:
        l = jn;
        break;
      case yn.position:
      case yn.scale:
        l = Ii;
        break;
      default:
        switch (n.itemSize) {
          case 1:
            l = Li;
            break;
          case 2:
          case 3:
          default:
            l = Ii;
            break;
        }
        break;
    }
    const h = i.interpolation !== void 0 ? g_[i.interpolation] : Ri, u = this._getArrayFromAccessor(n);
    for (let d = 0, p = c.length; d < p; d++) {
      const g = new l(
        c[d] + "." + yn[r.path],
        t.array,
        u,
        h
      );
      i.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(g), a.push(g);
    }
    return a;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const n = aa(t.constructor), i = new Float32Array(t.length);
      for (let r = 0, a = t.length; r < a; r++)
        i[r] = t[r] * n;
      t = i;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    e.createInterpolant = function(n) {
      const i = this instanceof jn ? m_ : ul;
      return new i(this.times, this.values, this.getValueSize() / 3, n);
    }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
  }
}
function T_(s, e, t) {
  const n = e.attributes, i = new dn();
  if (n.POSITION !== void 0) {
    const o = t.json.accessors[n.POSITION], c = o.min, l = o.max;
    if (c !== void 0 && l !== void 0) {
      if (i.set(
        new C(c[0], c[1], c[2]),
        new C(l[0], l[1], l[2])
      ), o.normalized) {
        const h = aa(Ei[o.componentType]);
        i.min.multiplyScalar(h), i.max.multiplyScalar(h);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else
    return;
  const r = e.targets;
  if (r !== void 0) {
    const o = new C(), c = new C();
    for (let l = 0, h = r.length; l < h; l++) {
      const u = r[l];
      if (u.POSITION !== void 0) {
        const d = t.json.accessors[u.POSITION], p = d.min, g = d.max;
        if (p !== void 0 && g !== void 0) {
          if (c.setX(Math.max(Math.abs(p[0]), Math.abs(g[0]))), c.setY(Math.max(Math.abs(p[1]), Math.abs(g[1]))), c.setZ(Math.max(Math.abs(p[2]), Math.abs(g[2]))), d.normalized) {
            const _ = aa(Ei[d.componentType]);
            c.multiplyScalar(_);
          }
          o.max(c);
        } else
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    i.expandByVector(o);
  }
  s.boundingBox = i;
  const a = new Kt();
  i.getCenter(a.center), a.radius = i.min.distanceTo(i.max) / 2, s.boundingSphere = a;
}
function Mc(s, e, t) {
  const n = e.attributes, i = [];
  function r(a, o) {
    return t.getDependency("accessor", a).then(function(c) {
      s.setAttribute(o, c);
    });
  }
  for (const a in n) {
    const o = ra[a] || a.toLowerCase();
    o in s.attributes || i.push(r(n[a], o));
  }
  if (e.indices !== void 0 && !s.index) {
    const a = t.getDependency("accessor", e.indices).then(function(o) {
      s.setIndex(o);
    });
    i.push(a);
  }
  return qe.workingColorSpace !== pt && "COLOR_0" in n && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${qe.workingColorSpace}" not supported.`), Tn(s, e), T_(s, e, t), Promise.all(i).then(function() {
    return e.targets !== void 0 ? x_(s, e.targets, t) : s;
  });
}
const Yr = /* @__PURE__ */ new WeakMap();
class A_ extends Kn {
  constructor(e) {
    super(e), this.decoderPath = "", this.decoderConfig = {}, this.decoderBinary = null, this.decoderPending = null, this.workerLimit = 4, this.workerPool = [], this.workerNextTaskID = 1, this.workerSourceURL = "", this.defaultAttributeIDs = {
      position: "POSITION",
      normal: "NORMAL",
      color: "COLOR",
      uv: "TEX_COORD"
    }, this.defaultAttributeTypes = {
      position: "Float32Array",
      normal: "Float32Array",
      color: "Float32Array",
      uv: "Float32Array"
    };
  }
  setDecoderPath(e) {
    return this.decoderPath = e, this;
  }
  setDecoderConfig(e) {
    return this.decoderConfig = e, this;
  }
  setWorkerLimit(e) {
    return this.workerLimit = e, this;
  }
  load(e, t, n, i) {
    const r = new $s(this.manager);
    r.setPath(this.path), r.setResponseType("arraybuffer"), r.setRequestHeader(this.requestHeader), r.setWithCredentials(this.withCredentials), r.load(e, (a) => {
      this.parse(a, t, i);
    }, n, i);
  }
  parse(e, t, n = () => {
  }) {
    this.decodeDracoFile(e, t, null, null, mt).catch(n);
  }
  decodeDracoFile(e, t, n, i, r = pt, a = () => {
  }) {
    const o = {
      attributeIDs: n || this.defaultAttributeIDs,
      attributeTypes: i || this.defaultAttributeTypes,
      useUniqueIDs: !!n,
      vertexColorSpace: r
    };
    return this.decodeGeometry(e, o).then(t).catch(a);
  }
  decodeGeometry(e, t) {
    const n = JSON.stringify(t);
    if (Yr.has(e)) {
      const c = Yr.get(e);
      if (c.key === n)
        return c.promise;
      if (e.byteLength === 0)
        throw new Error(
          "THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred."
        );
    }
    let i;
    const r = this.workerNextTaskID++, a = e.byteLength, o = this._getWorker(r, a).then((c) => (i = c, new Promise((l, h) => {
      i._callbacks[r] = { resolve: l, reject: h }, i.postMessage({ type: "decode", id: r, taskConfig: t, buffer: e }, [e]);
    }))).then((c) => this._createGeometry(c.geometry));
    return o.catch(() => !0).then(() => {
      i && r && this._releaseTask(i, r);
    }), Yr.set(e, {
      key: n,
      promise: o
    }), o;
  }
  _createGeometry(e) {
    const t = new Vt();
    e.index && t.setIndex(new _t(e.index.array, 1));
    for (let n = 0; n < e.attributes.length; n++) {
      const i = e.attributes[n], r = i.name, a = i.array, o = i.itemSize, c = new _t(a, o);
      r === "color" && (this._assignVertexColorSpace(c, i.vertexColorSpace), c.normalized = !(a instanceof Float32Array)), t.setAttribute(r, c);
    }
    return t;
  }
  _assignVertexColorSpace(e, t) {
    if (t !== mt)
      return;
    const n = new Se();
    for (let i = 0, r = e.count; i < r; i++)
      n.fromBufferAttribute(e, i).convertSRGBToLinear(), e.setXYZ(i, n.r, n.g, n.b);
  }
  _loadLibrary(e, t) {
    const n = new $s(this.manager);
    return n.setPath(this.decoderPath), n.setResponseType(t), n.setWithCredentials(this.withCredentials), new Promise((i, r) => {
      n.load(e, i, void 0, r);
    });
  }
  preload() {
    return this._initDecoder(), this;
  }
  _initDecoder() {
    if (this.decoderPending)
      return this.decoderPending;
    const e = typeof WebAssembly != "object" || this.decoderConfig.type === "js", t = [];
    return e ? t.push(this._loadLibrary("draco_decoder.js", "text")) : (t.push(this._loadLibrary("draco_wasm_wrapper.js", "text")), t.push(this._loadLibrary("draco_decoder.wasm", "arraybuffer"))), this.decoderPending = Promise.all(t).then((n) => {
      const i = n[0];
      e || (this.decoderConfig.wasmBinary = n[1]);
      const r = b_.toString(), a = [
        "/* draco decoder */",
        i,
        "",
        "/* worker */",
        r.substring(r.indexOf("{") + 1, r.lastIndexOf("}"))
      ].join(`
`);
      this.workerSourceURL = URL.createObjectURL(new Blob([a]));
    }), this.decoderPending;
  }
  _getWorker(e, t) {
    return this._initDecoder().then(() => {
      if (this.workerPool.length < this.workerLimit) {
        const i = new Worker(this.workerSourceURL);
        i._callbacks = {}, i._taskCosts = {}, i._taskLoad = 0, i.postMessage({ type: "init", decoderConfig: this.decoderConfig }), i.onmessage = function(r) {
          const a = r.data;
          switch (a.type) {
            case "decode":
              i._callbacks[a.id].resolve(a);
              break;
            case "error":
              i._callbacks[a.id].reject(a);
              break;
            default:
              console.error('THREE.DRACOLoader: Unexpected message, "' + a.type + '"');
          }
        }, this.workerPool.push(i);
      } else
        this.workerPool.sort(function(i, r) {
          return i._taskLoad > r._taskLoad ? -1 : 1;
        });
      const n = this.workerPool[this.workerPool.length - 1];
      return n._taskCosts[e] = t, n._taskLoad += t, n;
    });
  }
  _releaseTask(e, t) {
    e._taskLoad -= e._taskCosts[t], delete e._callbacks[t], delete e._taskCosts[t];
  }
  debug() {
    console.log("Task load: ", this.workerPool.map((e) => e._taskLoad));
  }
  dispose() {
    for (let e = 0; e < this.workerPool.length; ++e)
      this.workerPool[e].terminate();
    return this.workerPool.length = 0, this.workerSourceURL !== "" && URL.revokeObjectURL(this.workerSourceURL), this;
  }
}
function b_() {
  let s, e;
  onmessage = function(a) {
    const o = a.data;
    switch (o.type) {
      case "init":
        s = o.decoderConfig, e = new Promise(function(h) {
          s.onModuleLoaded = function(u) {
            h({ draco: u });
          }, DracoDecoderModule(s);
        });
        break;
      case "decode":
        const c = o.buffer, l = o.taskConfig;
        e.then((h) => {
          const u = h.draco, d = new u.Decoder();
          try {
            const p = t(u, d, new Int8Array(c), l), g = p.attributes.map((_) => _.array.buffer);
            p.index && g.push(p.index.array.buffer), self.postMessage({ type: "decode", id: o.id, geometry: p }, g);
          } catch (p) {
            console.error(p), self.postMessage({ type: "error", id: o.id, error: p.message });
          } finally {
            u.destroy(d);
          }
        });
        break;
    }
  };
  function t(a, o, c, l) {
    const h = l.attributeIDs, u = l.attributeTypes;
    let d, p;
    const g = o.GetEncodedGeometryType(c);
    if (g === a.TRIANGULAR_MESH)
      d = new a.Mesh(), p = o.DecodeArrayToMesh(c, c.byteLength, d);
    else if (g === a.POINT_CLOUD)
      d = new a.PointCloud(), p = o.DecodeArrayToPointCloud(c, c.byteLength, d);
    else
      throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
    if (!p.ok() || d.ptr === 0)
      throw new Error("THREE.DRACOLoader: Decoding failed: " + p.error_msg());
    const _ = { index: null, attributes: [] };
    for (const f in h) {
      const m = self[u[f]];
      let T, S;
      if (l.useUniqueIDs)
        S = h[f], T = o.GetAttributeByUniqueId(d, S);
      else {
        if (S = o.GetAttributeId(d, a[h[f]]), S === -1)
          continue;
        T = o.GetAttribute(d, S);
      }
      const A = i(a, o, d, f, m, T);
      f === "color" && (A.vertexColorSpace = l.vertexColorSpace), _.attributes.push(A);
    }
    return g === a.TRIANGULAR_MESH && (_.index = n(a, o, d)), a.destroy(d), _;
  }
  function n(a, o, c) {
    const h = c.num_faces() * 3, u = h * 4, d = a._malloc(u);
    o.GetTrianglesUInt32Array(c, u, d);
    const p = new Uint32Array(a.HEAPF32.buffer, d, h).slice();
    return a._free(d), { array: p, itemSize: 1 };
  }
  function i(a, o, c, l, h, u) {
    const d = u.num_components(), g = c.num_points() * d, _ = g * h.BYTES_PER_ELEMENT, f = r(a, h), m = a._malloc(_);
    o.GetAttributeDataArrayForAllPoints(c, u, f, _, m);
    const T = new h(a.HEAPF32.buffer, m, g).slice();
    return a._free(m), {
      name: l,
      array: T,
      itemSize: d
    };
  }
  function r(a, o) {
    switch (o) {
      case Float32Array:
        return a.DT_FLOAT32;
      case Int8Array:
        return a.DT_INT8;
      case Int16Array:
        return a.DT_INT16;
      case Int32Array:
        return a.DT_INT32;
      case Uint8Array:
        return a.DT_UINT8;
      case Uint16Array:
        return a.DT_UINT16;
      case Uint32Array:
        return a.DT_UINT32;
    }
  }
}
let oa;
const w_ = new wg(), dl = document.getElementById("container"), fl = new es();
dl.appendChild(fl.dom);
const Nn = new Qm({ antialias: !0 });
Nn.setPixelRatio(window.devicePixelRatio);
Nn.setSize(window.innerWidth, window.innerHeight);
dl.appendChild(Nn.domElement);
const R_ = new ea(Nn), ir = new tl();
ir.background = new Se(12575709);
ir.environment = R_.fromScene(new Gg(Nn), 0.04).texture;
const rs = new Tt(40, window.innerWidth / window.innerHeight, 1, 100);
rs.position.set(5, 2, 8);
const ls = new Vg(rs, Nn.domElement);
ls.target.set(0, 0.5, 0);
ls.update();
ls.enablePan = !1;
ls.enableDamping = !0;
const pl = new A_();
pl.setDecoderPath("jsm/libs/draco/gltf/");
const ml = new Wg();
ml.setDRACOLoader(pl);
ml.load("models/gltf/LittlestTokyo.glb", function(s) {
  const e = s.scene;
  e.position.set(1, 1, 0), e.scale.set(0.01, 0.01, 0.01), ir.add(e), oa = new zg(e), oa.clipAction(s.animations[0]).play(), gl();
}, void 0, function(s) {
  console.error(s);
});
window.onresize = function() {
  rs.aspect = window.innerWidth / window.innerHeight, rs.updateProjectionMatrix(), Nn.setSize(window.innerWidth, window.innerHeight);
};
function gl() {
  requestAnimationFrame(gl);
  const s = w_.getDelta();
  oa.update(s), ls.update(), fl.update(), Nn.render(ir, rs);
}
