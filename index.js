const base64 = require('base64-js');

class simpleflags {
  // 修改自：https://github.com/binarymax/bitflags/blob/master/bitflags.js
  constructor(s) {
    this._cols = 8;
    this._shift = 3;
    if (s) {
      this._bin = base64.toByteArray(s);
      this._buf = this._bin.buffer;
      this._rows = this._bin.length;
    } else {
      // 默认8位
      this._rows = (7 >> this._shift) + 1;
      this._buf = new ArrayBuffer(this._rows);
      this._bin = new Uint8Array(this._buf);
    }
  }

  get(offset) {
    const row = offset >> this._shift;
    const col = offset % this._cols;
    const bit = 1 << col;
    // 这里测试过，如果获取的bit位大于存储size，会返回0，不会出错
    return (this._bin[row] & bit) > 0;
  }

  set(offset, bool) {
    const row = offset >> this._shift;

    if (row >= this._rows) {
      // 需要扩容
      this._rows = row + 1;
      const newBuffer = new ArrayBuffer(this._rows);
      new Uint8Array(newBuffer).set(this._buf);
      this._buf = newBuffer;
      this._bin = new Uint8Array(this._buf);
    }
    const col = offset % this._cols;
    let bit = 1 << col;

    if (bool) {
      this._bin[row] |= bit;
    } else {
      bit ^= 255;
      this._bin[row] &= bit;
    }
  }

  on(offset) {
    this.set(offset, 1);
  }

  off(offset) {
    this.set(offset, 0);
  }

  flip(offset) {
    const row = Math.floor(offset / this._cols);
    const col = offset % this._cols;
    const bit = 1 << col;
    return (this._bin[row] ^= bit);
  }

  fill() {
    for (let i = 0; i < this._rows; i++) {
      this._bin[i] = 255;
    }
  }

  clear() {
    for (let i = 0; i < this._rows; i++) {
      this._bin[i] = 0;
    }
  }

  size() {
    return this._rows * this._cols;
  }

  get base64str() {
    return base64.fromByteArray(this._bin);
  }
}

module.exports = simpleflags;
