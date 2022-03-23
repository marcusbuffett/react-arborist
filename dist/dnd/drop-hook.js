"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDropHook = void 0;
var react_dnd_1 = require("react-dnd");
var context_1 = require("../context");
var utils_1 = require("../utils");
var compute_drop_1 = require("./compute-drop");
function useDropHook(el, node, prev, next) {
    var tree = (0, context_1.useStaticContext)();
    return (0, react_dnd_1.useDrop)(function () { return ({
        accept: "NODE",
        canDrop: function (item) {
            for (var _i = 0, _a = item.dragIds; _i < _a.length; _i++) {
                var id = _a[_i];
                var drag = tree.api.getNode(id);
                if (!drag)
                    return false;
                if ((0, utils_1.isFolder)(drag) && (0, utils_1.isDecendent)(node, drag))
                    return false;
            }
            return true;
        },
        hover: function (item, m) {
            if (m.canDrop()) {
                var offset = m.getClientOffset();
                if (!el.current || !offset)
                    return;
                var cursor = (0, compute_drop_1.computeDrop)({
                    element: el.current,
                    offset: offset,
                    indent: tree.indent,
                    node: node,
                    prevNode: prev,
                    nextNode: next,
                }).cursor;
                if (cursor)
                    tree.api.showCursor(cursor);
            }
            else {
                tree.api.hideCursor();
            }
        },
        drop: function (item, m) {
            var offset = m.getClientOffset();
            if (!el.current || !offset)
                return;
            var drop = (0, compute_drop_1.computeDrop)({
                element: el.current,
                offset: offset,
                indent: tree.indent,
                node: node,
                prevNode: prev,
                nextNode: next,
            }).drop;
            return drop;
        },
    }); }, [node, prev, el, tree]);
}
exports.useDropHook = useDropHook;
