"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenTree = void 0;
function flattenTree(root) {
    var list = [];
    var index = 0;
    function collect(node) {
        var _a;
        if (node.level >= 0) {
            node.rowIndex = index++;
            list.push(node);
        }
        if (node.isOpen) {
            (_a = node.children) === null || _a === void 0 ? void 0 : _a.forEach(collect);
        }
    }
    collect(root);
    return list;
}
exports.flattenTree = flattenTree;
