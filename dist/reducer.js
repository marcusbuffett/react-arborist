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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actions = exports.initState = void 0;
var selection_1 = require("./selection/selection");
var initState = function () { return ({
    visibleIds: [],
    cursor: { type: "none" },
    editingId: null,
    selection: {
        data: null,
        ids: [],
    },
}); };
exports.initState = initState;
exports.actions = {
    setCursorLocation: function (cursor) { return ({
        type: "SET_CURSOR_LOCATION",
        cursor: cursor,
    }); },
    setVisibleIds: function (ids, // index to id
    idMap // id to index
    ) { return ({
        type: "SET_VISIBLE_IDS",
        ids: ids,
        idMap: idMap,
    }); },
    select: function (index, meta, shift) { return ({
        type: "SELECT",
        index: index,
        meta: meta,
        shift: shift,
    }); },
    selectId: function (id) { return ({
        type: "SELECT_ID",
        id: id,
    }); },
    edit: function (id) { return ({
        type: "EDIT",
        id: id,
    }); },
    stepUp: function (shift, ids) { return ({
        type: "STEP_UP",
        shift: shift,
    }); },
    stepDown: function (shift, ids) { return ({
        type: "STEP_DOWN",
        shift: shift,
    }); },
};
function reducer(state, action) {
    switch (action.type) {
        case "EDIT":
            return __assign(__assign({}, state), { editingId: action.id });
        case "SET_CURSOR_LOCATION":
            if (equal(state.cursor, action.cursor)) {
                return state;
            }
            else {
                return __assign(__assign({}, state), { cursor: action.cursor });
            }
        case "SELECT":
            var s = selection_1.Selection.parse(state.selection.data, state.visibleIds);
            if (action.index === null) {
                s.clear();
            }
            else if (action.meta) {
                if (s.contains(action.index)) {
                    s.deselect(action.index);
                }
                else {
                    s.multiSelect(action.index);
                }
            }
            else if (action.shift) {
                s.extend(action.index);
            }
            else {
                s.select(action.index);
            }
            return __assign(__assign({}, state), { selection: {
                    data: s.serialize(),
                    ids: s.getSelectedItems(),
                } });
        case "SELECT_ID":
            return __assign(__assign({}, state), { selection: __assign(__assign({}, state.selection), { ids: [action.id] }) });
        case "STEP_UP":
            var s3 = selection_1.Selection.parse(state.selection.data, state.visibleIds);
            var f = s3.getFocus();
            if (action.shift) {
                s3.extend(f - 1);
            }
            else {
                s3.select(f - 1);
            }
            return __assign(__assign({}, state), { selection: {
                    data: s3.serialize(),
                    ids: s3.getSelectedItems(),
                } });
        case "STEP_DOWN":
            var s6 = selection_1.Selection.parse(state.selection.data, state.visibleIds);
            var f2 = s6.getFocus();
            if (action.shift) {
                s6.extend(f2 + 1);
            }
            else {
                s6.select(f2 + 1);
            }
            return __assign(__assign({}, state), { selection: {
                    data: s6.serialize(),
                    ids: s6.getSelectedItems(),
                } });
        case "SET_VISIBLE_IDS":
            // The visible ids changed
            var ids = state.selection.ids;
            // Start with a blank selection
            var s2 = new selection_1.Selection([], null, "none", state.visibleIds);
            // Add each of the old selected ids to this new selection
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                if (id in action.idMap)
                    s2.multiSelect(action.idMap[id]);
            }
            return __assign(__assign({}, state), { visibleIds: action.ids, selection: {
                    ids: ids,
                    data: s2.serialize(),
                } });
        default:
            return state;
    }
}
exports.reducer = reducer;
function equal(a, b) {
    if (a === null || b === null)
        return false;
    return JSON.stringify(a) === JSON.stringify(b);
}
