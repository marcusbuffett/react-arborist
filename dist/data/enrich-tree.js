"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichTree = void 0;
function createNode(model, level, parent, children, isOpen, isDraggable, isDroppable) {
    return {
        id: model.id,
        level: level,
        parent: parent,
        children: children,
        isOpen: isOpen,
        isDraggable: isDraggable,
        isDroppable: isDroppable,
        model: model,
        rowIndex: null,
    };
}
function access(obj, accessor) {
    if (typeof accessor === "boolean") {
        return accessor;
    }
    if (typeof accessor === "string") {
        return obj[accessor];
    }
    return accessor(obj);
}
function enrichTree(model, hideRoot, getChildren, isOpen, disableDrag, disableDrop, openByDefault) {
    if (hideRoot === void 0) { hideRoot = false; }
    if (getChildren === void 0) { getChildren = "children"; }
    if (isOpen === void 0) { isOpen = "isOpen"; }
    if (disableDrag === void 0) { disableDrag = false; }
    if (disableDrop === void 0) { disableDrop = false; }
    if (openByDefault === void 0) { openByDefault = true; }
    function visitSelfAndChildren(model, level, parent) {
        var open = access(model, isOpen);
        var draggable = !access(model, disableDrag);
        var droppable = !access(model, disableDrop);
        var node = createNode(model, level, parent, null, open === undefined ? openByDefault : open, draggable, droppable);
        var children = access(model, getChildren);
        if (children) {
            node.children = children.map(function (child) {
                return visitSelfAndChildren(child, level + 1, node);
            });
        }
        return node;
    }
    return visitSelfAndChildren(model, hideRoot ? -1 : 0, null);
}
exports.enrichTree = enrichTree;
