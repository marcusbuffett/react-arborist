export class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    if (this.start > this.end) throw new Error("Invalid range: start larger than end");
  }

  serialize() {
    return [this.start, this.end];
  }

  contains(n) {
    return n >= this.start && n <= this.end;
  }

  overlaps(r) {
    return this.contains(r.start - 1) || this.contains(r.end + 1);
  }

  combine(r) {
    this.start = Math.min(r.start, this.start);
    this.end = Math.max(r.end, this.end);
  }

  get size() {
    return this.end - this.start + 1;
  }

  clone() {
    return new Range(this.start, this.end);
  }

  map(fn) {
    let returns = [];

    for (let i = this.start; i <= this.end; i++) returns.push(fn(i));

    return returns;
  }

  isEqual(other) {
    return this.start === other.start && this.end === other.end;
  }

}