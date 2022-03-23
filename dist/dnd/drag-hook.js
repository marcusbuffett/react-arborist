"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDragHook = void 0;
var react_1 = require("react");
var react_dnd_1 = require("react-dnd");
var react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
var context_1 = require("../context");
function useDragHook(node) {
    var tree = (0, context_1.useStaticContext)();
    var isSelected = (0, context_1.useIsSelected)();
    var ids = (0, context_1.useSelectedIds)();
    var _a = (0, react_dnd_1.useDrag)(function () { return ({
        canDrag: function () { return node.isDraggable; },
        type: "NODE",
        item: function () { return ({
            id: node.id,
            dragIds: isSelected(node.rowIndex) ? ids : [node.id],
        }); },
        collect: function (m) { return ({
            isDragging: m.isDragging(),
        }); },
        end: function (item, monitor) {
            tree.api.hideCursor();
            var drop = monitor.getDropResult();
            if (drop && drop.parentId) {
                tree.onMove(item.dragIds, drop.parentId, drop.index);
                tree.onToggle(drop.parentId, true);
            }
        },
    }); }, [ids, node]), isDragging = _a[0].isDragging, ref = _a[1], preview = _a[2];
    (0, react_1.useEffect)(function () {
        preview((0, react_dnd_html5_backend_1.getEmptyImage)());
    }, [preview]);
    return [{ isDragging: isDragging }, ref];
}
exports.useDragHook = useDragHook;
