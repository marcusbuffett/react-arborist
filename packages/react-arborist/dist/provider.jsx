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
exports.TreeViewProvider = void 0;
var react_1 = require("react");
var context_1 = require("./context");
var reducer_1 = require("./reducer");
var selection_hook_1 = require("./selection/selection-hook");
var tree_api_hook_1 = require("./tree-api-hook");
function TreeViewProvider(props) {
    var _a = (0, react_1.useReducer)(reducer_1.reducer, (0, reducer_1.initState)()), state = _a[0], dispatch = _a[1];
    var list = (0, react_1.useRef)();
    var api = (0, tree_api_hook_1.useTreeApi)(state, dispatch, props, list.current);
    (0, react_1.useImperativeHandle)(props.imperativeHandle, function () { return api; });
    (0, selection_hook_1.useSelectionKeys)(props.listEl, api);
    var staticValue = (0, react_1.useMemo)(function () { return (__assign(__assign({}, props), { api: api, list: list })); }, [props, api, list]);
    /**
     * This context pattern is ridiculous, next time use redux.
     */
    return (
    // @ts-ignore
    <context_1.Static.Provider value={staticValue}>
      <context_1.EditingIdContext.Provider value={state.editingId}>
        <context_1.SelectionContext.Provider value={state.selection}>
          <context_1.CursorParentId.Provider value={getParentId(state.cursor)}>
            <context_1.IsCursorOverFolder.Provider value={isOverFolder(state)}>
              <context_1.CursorLocationContext.Provider value={state.cursor}>
                {props.children}
              </context_1.CursorLocationContext.Provider>
            </context_1.IsCursorOverFolder.Provider>
          </context_1.CursorParentId.Provider>
        </context_1.SelectionContext.Provider>
      </context_1.EditingIdContext.Provider>
    </context_1.Static.Provider>);
}
exports.TreeViewProvider = TreeViewProvider;
function getParentId(cursor) {
    switch (cursor.type) {
        case "highlight":
            return cursor.id;
        default:
            return null;
    }
}
function isOverFolder(state) {
    return state.cursor.type === "highlight";
}
