"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = exports.indexOf = exports.isDecendent = exports.isClosed = exports.isItem = exports.isFolder = exports.bound = void 0;
function bound(n, min, max) {
    return Math.max(Math.min(n, max), min);
}
exports.bound = bound;
var isFolder = function (node) { return !!node.children; };
exports.isFolder = isFolder;
function isItem(node) {
    return node && !(0, exports.isFolder)(node);
}
exports.isItem = isItem;
function isClosed(node) {
    return node && (0, exports.isFolder)(node) && !node.isOpen;
}
exports.isClosed = isClosed;
/**
 * Is first param a decendent of the second param
 */
var isDecendent = function (a, b) {
    var n = a;
    while (n) {
        if (n.id === b.id)
            return true;
        n = n.parent;
    }
    return false;
};
exports.isDecendent = isDecendent;
var indexOf = function (node) {
    // This should probably not throw an error, but instead return null
    if (!node.parent)
        throw Error("Node does not have a parent");
    return node.parent.children.findIndex(function (c) { return c.id === node.id; });
};
exports.indexOf = indexOf;
function noop() { }
exports.noop = noop;
