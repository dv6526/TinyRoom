export class Vector {
  x: any;
  y: any;
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  add(vector_to_add) {
    this.x += vector_to_add.x;
    this.y += vector_to_add.y;
    return this;
  }

  subtract(vector_to_subtract) {
    this.x -= vector_to_subtract.x;
    this.y -= vector_to_subtract.y;
    return this;
  }

  normalize() {
    var length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  }

  multiply(n) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  clone() {
    return new Vector(this.x, this.y);
  }
}
