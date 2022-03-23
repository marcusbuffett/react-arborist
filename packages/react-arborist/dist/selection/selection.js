"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selection = void 0;
var range_1 = require("./range");
var Selection = /** @class */ (function () {
    function Selection(ranges, currentIndex, direction, items) {
        if (ranges === void 0) { ranges = []; }
        if (currentIndex === void 0) { currentIndex = ranges.length ? ranges.length - 1 : null; }
        if (direction === void 0) { direction = "none"; }
        if (items === void 0) { items = []; }
        var _this = this;
        this.ranges = [];
        this.direction = "none";
        ranges.forEach(function (_a) {
            var s = _a[0], e = _a[1];
            return _this.addRange(s, e);
        });
        this.currentIndex = currentIndex;
        this.direction = direction;
        this.items = items;
    }
    Selection.parse = function (data, items) {
        if (data) {
            return new Selection(data.ranges, data.currentIndex, data.direction, items);
        }
        else {
            return new Selection();
        }
    };
    Object.defineProperty(Selection.prototype, "current", {
        get: function () {
            if (this.currentIndex === null)
                return null;
            var range = this.ranges[this.currentIndex];
            if (!range) {
                return null;
            }
            else {
                return range;
            }
        },
        enumerable: false,
        configurable: true
    });
    Selection.prototype.select = function (n) {
        if (n < 0 || n >= this.items.length)
            return;
        this.clear();
        this.currentIndex = this.addRange(n, n);
    };
    Selection.prototype.multiSelect = function (n) {
        if (n < 0 || n >= this.items.length)
            return;
        if (this.contains(n))
            return;
        this.currentIndex = this.addRange(n, n);
        this.compact(n);
    };
    Selection.prototype.deselect = function (n) {
        if (n < 0 || n >= this.items.length)
            return;
        var r = this.ranges.find(function (r) { return r.contains(n); });
        if (!r)
            return;
        else if (r.size === 1)
            this.removeRange(r);
        else if (r.start === n)
            r.start++;
        else if (r.end === n)
            r.end--;
        else {
            this.removeRange(r);
            this.addRange(r.start, n - 1);
            this.currentIndex = this.addRange(n + 1, r.end);
        }
    };
    Selection.prototype.getSelectedItems = function () {
        var _this = this;
        return this.ranges.flatMap(function (range) {
            return range.map(function (index) { return _this.items[index]; });
        });
    };
    Selection.prototype.extend = function (n) {
        if (n < 0 || n >= this.items.length)
            return;
        if (this.isEmpty()) {
            this.select(n);
        }
        else {
            var anchor = this.getAnchor();
            if (anchor !== null && this.current) {
                var _a = [n, anchor].sort(function (a, b) { return a - b; }), start = _a[0], end = _a[1];
                this.current.start = start;
                this.current.end = end;
                this.compact(n);
            }
        }
    };
    Selection.prototype.contains = function (n) {
        if (n === null)
            return false;
        return this.ranges.some(function (r) { return r.contains(n); });
    };
    Selection.prototype.getRanges = function () {
        return this.ranges.map(function (r) { return r.serialize(); });
    };
    Selection.prototype.clear = function () {
        this.ranges = [];
        this.currentIndex = null;
        this.direction = "none";
    };
    Selection.prototype.serialize = function () {
        return {
            ranges: this.getRanges(),
            currentIndex: this.currentIndex,
            direction: this.direction,
        };
    };
    Selection.prototype.isEqual = function (other) {
        if (other.ranges.length !== this.ranges.length)
            return false;
        for (var i = 0; i < this.ranges.length; ++i) {
            if (!this.ranges[i].isEqual(other.ranges[i]))
                return false;
        }
        return true;
    };
    Selection.prototype.addRange = function (start, end) {
        var r = new range_1.Range(start, end);
        // Keep ranges sorted by start
        var index = this.ranges.findIndex(function (r) { return r.start >= start; });
        if (index === -1)
            this.ranges.push(r);
        else
            this.ranges.splice(index, 0, r);
        return index === -1 ? this.ranges.length - 1 : index;
    };
    Selection.prototype.removeRange = function (r) {
        var index = this.ranges.indexOf(r);
        this.ranges.splice(index, 1);
        if (this.isEmpty()) {
            this.currentIndex = null;
        }
        else if (index === this.currentIndex) {
            this.currentIndex = this.ranges.length - 1;
        }
    };
    Selection.prototype.isEmpty = function () {
        return this.ranges.length === 0;
    };
    Selection.prototype.getAnchor = function () {
        if (!this.current)
            return null;
        return this.direction === "backward"
            ? this.current.end
            : this.current.start;
    };
    Selection.prototype.getFocus = function () {
        if (!this.current)
            return -1;
        return this.direction === "backward"
            ? this.current.start
            : this.current.end;
    };
    Selection.prototype.compact = function (focus) {
        var _this = this;
        var removals = [];
        var current = this.current;
        for (var _i = 0, _a = this.ranges; _i < _a.length; _i++) {
            var r = _a[_i];
            if (!this.current || r === this.current)
                continue;
            if (this.current.overlaps(r)) {
                this.current.combine(r);
                removals.push(r);
            }
        }
        removals.forEach(function (r) { return _this.removeRange(r); });
        if (current)
            this.currentIndex = this.ranges.indexOf(current);
        if (!this.current)
            return;
        if (this.current.start < focus)
            this.direction = "forward";
        else if (this.current.end > focus)
            this.direction = "backward";
        else
            this.direction = "none";
    };
    return Selection;
}());
exports.Selection = Selection;
