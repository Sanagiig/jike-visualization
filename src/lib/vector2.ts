export class Point extends Array {
  constructor(x: number = 0, y: number = 0) {
    super(2);
    this[0] = x;
    this[1] = y;
  }

  set x(x: number) {
    this[0] = x;
  }

  get x() {
    return this[0];
  }

  set y(y: number) {
    this[1] = y;
  }

  get y() {
    return this[1];
  }

  reset(x:number,y:number){
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Point(this.x, this.y)
  }

  getVec(p: Point) {
    return new Vector2(p.x - this.x, p.y - this.y)
  }
}

export class Vector2 extends Point {
  static factory(p1: Point, p2: Point) {
    const x = p2.x - p1.x;
    const y = p2.y - p1.y;
    return new Vector2(x, y)
  }

  constructor(x: number = 1, y: number = 0) {
    super(x, y);
  }

  getLength() {
    return Math.hypot(this.x, this.y);
  }

  get dir() {
    return Math.atan2(this.y, this.x);
  }

  dump() {
    return this as unknown as [number, number];
  }

  copy() {
    return new Vector2(this.x, this.y);
  }

  add(v: Vector2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector2) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale(a: number) {
    this.x *= a;
    this.y *= a;
    return this;
  }

  cross(v: Vector2) {
    return this.x * v.y - v.x * this.y;
  }

  dot(v: Vector2) {
    return this.x * v.x + v.y * this.y;
  }

  normalize() {
    return this.scale(1 / this.getLength());
  }

  rotate(rad: number) {
    const c = Math.cos(rad),
      s = Math.sin(rad);
    const [x, y] = this;

    this.x = x * c + y * -s;
    this.y = x * s + y * c;

    return this;
  }
}
