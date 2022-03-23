"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOuterDrop = void 0;
var react_dnd_1 = require("react-dnd");
var context_1 = require("../context");
var compute_drop_1 = require("./compute-drop");
function useOuterDrop() {
    var tree = (0, context_1.useStaticContext)();
    // In case we drop an item at the bottom of the list
    var _a = (0, react_dnd_1.useDrop)(function () { return ({
        accept: "NODE",
        hover: function (item, m) {
            if (!m.isOver({ shallow: true }))
                return;
            var offset = m.getClientOffset();
            if (!tree.listEl.current || !offset)
                return;
            var cursor = (0, compute_drop_1.computeDrop)({
                element: tree.listEl.current,
                offset: offset,
                indent: tree.indent,
                node: null,
                prevNode: tree.api.visibleNodes[tree.api.visibleNodes.length - 1],
                nextNode: null,
            }).cursor;
            if (cursor)
                tree.api.showCursor(cursor);
        },
        canDrop: function (item, m) {
            return m.isOver({ shallow: true });
        },
        drop: function (item, m) {
            if (m.didDrop())
                return;
            var offset = m.getClientOffset();
            if (!tree.listEl.current || !offset)
                return;
            var drop = (0, compute_drop_1.computeDrop)({
                element: tree.listEl.current,
                offset: offset,
                indent: tree.indent,
                node: null,
                prevNode: tree.api.visibleNodes[tree.api.visibleNodes.length - 1],
                nextNode: null,
            }).drop;
            return drop;
        },
    }); }, [tree]), drop = _a[1];
    drop(tree.listEl);
}
exports.useOuterDrop = useOuterDrop;
