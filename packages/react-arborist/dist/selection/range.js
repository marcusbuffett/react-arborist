"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = void 0;
var Range = /** @class */ (function () {
    function Range(start, end) {
        this.start = start;
        this.end = end;
        if (this.start > this.end)
            throw new Error("Invalid range: start larger than end");
    }
    Range.prototype.serialize = function () {
        return [this.start, this.end];
    };
    Range.prototype.contains = function (n) {
        return n >= this.start && n <= this.end;
    };
    Range.prototype.overlaps = function (r) {
        return this.contains(r.start - 1) || this.contains(r.end + 1);
    };
    Range.prototype.combine = function (r) {
        this.start = Math.min(r.start, this.start);
        this.end = Math.max(r.end, this.end);
    };
    Object.defineProperty(Range.prototype, "size", {
        get: function () {
            return this.end - this.start + 1;
        },
        enumerable: false,
        configurable: true
    });
    Range.prototype.clone = function () {
        return new Range(this.start, this.end);
    };
    Range.prototype.map = function (fn) {
        var returns = [];
        for (var i = this.start; i <= this.end; i++)
            returns.push(fn(i));
        return returns;
    };
    Range.prototype.isEqual = function (other) {
        return this.start === other.start && this.end === other.end;
    };
    return Range;
}());
exports.Range = Range;
