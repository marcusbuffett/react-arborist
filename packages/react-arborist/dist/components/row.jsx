"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = void 0;
var react_1 = __importStar(require("react"));
var context_1 = require("../context");
var drag_hook_1 = require("../dnd/drag-hook");
var drop_hook_1 = require("../dnd/drop-hook");
exports.Row = react_1.default.memo(function Row(_a) {
    var index = _a.index, style = _a.style;
    var tree = (0, context_1.useStaticContext)();
    var selected = (0, context_1.useIsSelected)();
    var node = tree.api.visibleNodes[index];
    var next = tree.api.visibleNodes[index + 1] || null;
    var prev = tree.api.visibleNodes[index - 1] || null;
    var cursorParentId = (0, context_1.useCursorParentId)();
    var cursorOverFolder = (0, context_1.useIsCursorOverFolder)();
    var el = (0, react_1.useRef)(null);
    var _b = (0, drag_hook_1.useDragHook)(node), isDragging = _b[0].isDragging, dragRef = _b[1];
    var _c = (0, drop_hook_1.useDropHook)(el, node, prev, next), dropRef = _c[1];
    var isEditing = node.id === (0, context_1.useEditingId)();
    var isSelected = selected(index);
    var nextSelected = next && selected(index + 1);
    var prevSelected = prev && selected(index - 1);
    var isHoveringOverChild = node.id === cursorParentId;
    var isOverFolder = node.id === cursorParentId && cursorOverFolder;
    var isOpen = node.isOpen;
    var indent = tree.indent * node.level;
    var state = (0, react_1.useMemo)(function () {
        return {
            isEditing: isEditing,
            isDragging: isDragging,
            isSelectedStart: isSelected && !prevSelected,
            isSelectedEnd: isSelected && !nextSelected,
            isSelected: isSelected,
            isHoveringOverChild: isHoveringOverChild,
            isOpen: isOpen,
            isOverFolder: isOverFolder,
        };
    }, [
        isEditing,
        isSelected,
        prevSelected,
        nextSelected,
        isHoveringOverChild,
        isOpen,
        isDragging,
        isOverFolder,
    ]);
    var ref = (0, react_1.useCallback)(function (n) {
        el.current = n;
        dragRef(dropRef(n));
    }, [dragRef, dropRef]);
    var styles = (0, react_1.useMemo)(function () { return ({
        row: __assign({}, style),
        indent: { paddingLeft: indent },
    }); }, [indent, style]);
    var handlers = (0, react_1.useMemo)(function () {
        return {
            select: function (e, args) {
                if (args === void 0) { args = { selectOnClick: true }; }
                if (node.rowIndex === null)
                    return;
                if (args.selectOnClick || e.metaKey || e.shiftKey) {
                    tree.api.select(node.rowIndex, e.metaKey, e.shiftKey);
                }
                else {
                    tree.api.select(null, false, false);
                }
            },
            toggle: function (e) {
                e.stopPropagation();
                tree.onToggle(node.id, !node.isOpen);
            },
            edit: function () { return tree.api.edit(node.id); },
            submit: function (name) {
                name.trim() ? tree.api.submit(node.id, name) : tree.api.reset(node.id);
            },
            reset: function () { return tree.api.reset(node.id); },
        };
    }, [tree, node]);
    var Renderer = (0, react_1.useMemo)(function () {
        return react_1.default.memo(tree.renderer);
    }, [tree.renderer]);
    return (<Renderer innerRef={ref} data={node.model} styles={styles} state={state} handlers={handlers} preview={false} tree={tree.api}/>);
});
