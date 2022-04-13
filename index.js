class FieldElement {
  constructor(num, prime) {
    if (num >= prime || num < 0) {
      throw new Error(`Num ${num} not in field range 0 to ${prime - 1}`);
    }

    this.num = num;
    this.prime = prime;
  }

  eq(other) {
    if (!other) {
      return false;
    }

    return this.num === other.num && this.prime === other.prime;
  }

  ne(other) {
    if (!other) {
      return false;
    }

    return this.num !== other.num && this.prime !== other.prime;
  }

  add(other) {
    if (!other) {
      return false;
    }

    if (this.prime !== other.prime) {
      throw new Error(`Cannot add two numbers in different Fields`);
    }

    const num = (this.num + other.num) % this.prime;
    return new FieldElement(num, this.prime);
  }

  sub(other) {
    if (!other) {
      return false;
    }

    if (this.prime !== other.prime) {
      throw new Error(`Cannot subtract two numbers in different Fields`);
    }

    const num = (this.num - other.num) % this.prime;
    return new FieldElement(num, this.prime);
  }

  mul(other) {
    if (!other) {
      return false;
    }

    if (this.prime !== other.prime) {
      throw new Error(`Cannot multiply two numbers in different Fields`);
    }

    const num = (this.num * other.num) % this.prime;
    return new FieldElement(num, this.prime);
  }

  pow(exponent) {
    const p = this.prime - 1;
    const n = (exponent % p) + p;
    const num = Math.pow(this.num, n) % this.prime;
    return new FieldElement(num, this.prime);
  }

  truediv(other) {
    if (!other) {
      return false;
    }

    if (this.prime !== other.prime) {
      throw new Error(`Cannot divide two numbers in different Fields`);
    }

    const num = (this.num * Math.pow(other.num, this.prime - 2)) % this.prime;
    return new FieldElement(num, this.prime);
  }
}

class Point {
  constructor(x, y, a, b) {
    this.x = x;
    this.y = y;
    this.a = a;
    this.b = b;

    if (x === null && y === null) {
      return;
    }

    if (y ** 2 !== x ** 3 + a * x + b) {
      throw new Error(`(${x}, ${y}) is not on the curve.`);
    }
  }

  eq(other) {
    return (
      this.x === other.x &&
      this.y === other.y &&
      this.a === other.a &&
      this.b === other.b
    );
  }

  ne(other) {
    return (
      this.x !== other.x ||
      this.y !== other.y ||
      this.a !== other.a ||
      this.b !== other.b
    );
  }

  add(other) {
    if (this.a !== other.a || this.b !== other.b) {
      throw new Error(`(${this}, ${other}) are not on the curve.`);
    }

    if (this.x === null) {
      return other;
    }

    if (other.x === null) {
      return this;
    }

    if (this.x === other.x && this.y !== other.y) {
      return new Point(this.x, null, this.a, this.b);
    }

    if (this.x !== other.x) {
      const s = (this.y - other.y) / (this.x - other.x);
      const x = s ** 2 - this.x - other.x;
      const y = s * (this.x - x) - this.y;
      return new Point(x, y, this.a, this.b);
    }

    if (this.eq(other)) {
      const s = (3 * this.x ** 2 + this.a) / (2 * this.y);
      const x = s ** 2 - 2 * this.x;
      const y = s * (this.x - x) - this.y;
      return new Point(x, y, this.a, this.b);
    }

    if (this.eq(other) && this.y === 0) {
      return new Point(null, null, this.a, this.b);
    }
  }
}
