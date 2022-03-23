"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeDrop = void 0;
var utils_1 = require("../utils");
function measureHover(el, offset) {
    var rect = el.getBoundingClientRect();
    var x = offset.x - Math.round(rect.x);
    var y = offset.y - Math.round(rect.y);
    var height = rect.height;
    var inTopHalf = y < height / 2;
    var inBottomHalf = !inTopHalf;
    var pad = height / 4;
    var inMiddle = y > pad && y < height - pad;
    var atTop = !inMiddle && inTopHalf;
    var atBottom = !inMiddle && inBottomHalf;
    return { x: x, inTopHalf: inTopHalf, inBottomHalf: inBottomHalf, inMiddle: inMiddle, atTop: atTop, atBottom: atBottom };
}
function getNodesAroundCursor(node, prev, next, hover) {
    if (!node) {
        // We're hoving over the empty part of the list, not over an item,
        // Put the cursor below the last item which is "prev"
        return [prev, null];
    }
    if ((0, utils_1.isFolder)(node)) {
        if (hover.atTop) {
            return [prev, node];
        }
        else if (hover.inMiddle) {
            return [node, node];
        }
        else {
            return [node, next];
        }
    }
    else {
        if (hover.inTopHalf) {
            return [prev, node];
        }
        else {
            return [node, next];
        }
    }
}
function getDropLevel(hovering, aboveCursor, belowCursor, indent) {
    var hoverLevel = Math.round(Math.max(0, hovering.x - indent) / indent);
    var min, max;
    if (!aboveCursor) {
        max = 0;
        min = 0;
    }
    else if (!belowCursor) {
        max = aboveCursor.level;
        min = 0;
    }
    else {
        max = aboveCursor.level;
        min = belowCursor.level;
    }
    return (0, utils_1.bound)(hoverLevel, min, max);
}
function canDrop(above, below) {
    if (!above) {
        return true;
    }
    var n = above;
    if ((0, utils_1.isClosed)(above) && above !== below)
        n = above.parent;
    while (n) {
        if (!n.isDroppable)
            return false;
        n = n.parent;
    }
    return true;
}
function dropAt(parentId, index) {
    return { parentId: parentId || null, index: index };
}
function lineCursor(index, level) {
    return {
        type: "line",
        index: index,
        level: level,
    };
}
function noCursor() {
    return {
        type: "none",
    };
}
function highlightCursor(id) {
    return {
        type: "highlight",
        id: id,
    };
}
function walkUpFrom(node, level) {
    var _a;
    var drop = node;
    while (drop.parent && drop.level > level) {
        drop = drop.parent;
    }
    var parentId = ((_a = drop.parent) === null || _a === void 0 ? void 0 : _a.id) || null;
    var index = (0, utils_1.indexOf)(drop) + 1;
    return { parentId: parentId, index: index };
}
/**
 * This is the most complex, tricky function in the whole repo.
 * It could be simplified and made more understandable.
 */
function computeDrop(args) {
    var _a;
    var hover = measureHover(args.element, args.offset);
    var node = args.node, nextNode = args.nextNode, prevNode = args.prevNode;
    var _b = getNodesAroundCursor(node, prevNode, nextNode, hover), above = _b[0], below = _b[1];
    if (!canDrop(above, below)) {
        return { drop: null, cursor: noCursor() };
    }
    /* Hovering over the middle of a folder */
    if (node && (0, utils_1.isFolder)(node) && hover.inMiddle) {
        return {
            drop: dropAt(node.id, 0),
            cursor: highlightCursor(node.id),
        };
    }
    /* At the top of the list */
    if (!above) {
        return {
            drop: dropAt((_a = below === null || below === void 0 ? void 0 : below.parent) === null || _a === void 0 ? void 0 : _a.id, 0),
            cursor: lineCursor(0, 0),
        };
    }
    /* The above node is an item or a closed folder */
    if ((0, utils_1.isItem)(above) || (0, utils_1.isClosed)(above)) {
        var level = getDropLevel(hover, above, below, args.indent);
        return {
            drop: walkUpFrom(above, level),
            cursor: lineCursor(above.rowIndex + 1, level),
        };
    }
    /* The above node is an open folder */
    return {
        drop: dropAt(above === null || above === void 0 ? void 0 : above.id, 0),
        cursor: lineCursor(above.rowIndex + 1, above.level + 1),
    };
}
exports.computeDrop = computeDrop;
