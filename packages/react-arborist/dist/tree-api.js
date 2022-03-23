"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeApi = void 0;
var memoize_one_1 = __importDefault(require("memoize-one"));
var flatten_tree_1 = require("./data/flatten-tree");
var reducer_1 = require("./reducer");
var react_dom_1 = __importDefault(require("react-dom"));
var TreeApi = /** @class */ (function () {
    function TreeApi(dispatch, state, props, list) {
        this.dispatch = dispatch;
        this.state = state;
        this.props = props;
        this.list = list;
        this.edits = new Map();
    }
    TreeApi.prototype.assign = function (dispatch, state, props, list) {
        this.dispatch = dispatch;
        this.state = state;
        this.props = props;
        this.list = list;
    };
    TreeApi.prototype.getNode = function (id) {
        if (id in this.idToIndex)
            return this.visibleNodes[this.idToIndex[id]] || null;
        else
            return null;
    };
    TreeApi.prototype.getSelectedIds = function () {
        return this.state.selection.ids;
    };
    TreeApi.prototype.edit = function (id) {
        var _this = this;
        var sid = id.toString();
        this.resolveEdit(sid, { cancelled: true });
        this.scrollToId(sid);
        this.dispatch(reducer_1.actions.edit(sid));
        return new Promise(function (resolve) { return _this.edits.set(sid, resolve); });
    };
    TreeApi.prototype.submit = function (id, value) {
        var sid = id.toString();
        this.props.onEdit(sid, value);
        this.dispatch(reducer_1.actions.edit(null));
        this.resolveEdit(sid, { cancelled: false, value: value });
    };
    TreeApi.prototype.reset = function (id) {
        var sid = id.toString();
        this.dispatch(reducer_1.actions.edit(null));
        this.resolveEdit(sid, { cancelled: true });
    };
    TreeApi.prototype.resolveEdit = function (id, value) {
        var resolve = this.edits.get(id.toString());
        if (resolve)
            resolve(value);
        this.edits.delete(id);
    };
    TreeApi.prototype.select = function (index, meta, shift) {
        if (meta === void 0) { meta = false; }
        if (shift === void 0) { shift = false; }
        this.dispatch(reducer_1.actions.select(index, meta, shift));
    };
    TreeApi.prototype.selectById = function (id, meta, shift) {
        if (meta === void 0) { meta = false; }
        if (shift === void 0) { shift = false; }
        var index = this.idToIndex[id];
        this.select(index, meta, shift);
    };
    TreeApi.prototype.selectUpwards = function (shiftKey) {
        this.dispatch(reducer_1.actions.stepUp(shiftKey, this.visibleIds));
    };
    TreeApi.prototype.selectDownwards = function (shiftKey) {
        this.dispatch(reducer_1.actions.stepDown(shiftKey, this.visibleIds));
    };
    TreeApi.prototype.hideCursor = function () {
        this.dispatch(reducer_1.actions.setCursorLocation({ type: "none" }));
    };
    TreeApi.prototype.showCursor = function (cursor) {
        this.dispatch(reducer_1.actions.setCursorLocation(cursor));
    };
    TreeApi.prototype.scrollToId = function (id) {
        var _this = this;
        if (!this.list)
            return;
        var index = this.idToIndex[id];
        if (index) {
            this.list.scrollToItem(index, "start");
        }
        else {
            this.openParents(id);
            react_dom_1.default.flushSync(function () {
                var _a;
                var index = _this.idToIndex[id];
                if (index) {
                    (_a = _this.list) === null || _a === void 0 ? void 0 : _a.scrollToItem(index, "start");
                }
            });
        }
    };
    TreeApi.prototype.open = function (id) {
        this.props.onToggle(id, true);
    };
    TreeApi.prototype.openParents = function (id) {
        var node = dfs(this.props.root, id);
        var parent = node === null || node === void 0 ? void 0 : node.parent;
        while (parent) {
            this.open(parent.id);
            parent = parent.parent;
        }
    };
    Object.defineProperty(TreeApi.prototype, "visibleIds", {
        get: function () {
            return getIds(this.visibleNodes);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeApi.prototype, "idToIndex", {
        get: function () {
            return createIndex(this.visibleNodes);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeApi.prototype, "visibleNodes", {
        get: function () {
            return createList(this.props.root);
        },
        enumerable: false,
        configurable: true
    });
    return TreeApi;
}());
exports.TreeApi = TreeApi;
var getIds = (0, memoize_one_1.default)(function (nodes) { return nodes.map(function (n) { return n.id; }); });
var createIndex = (0, memoize_one_1.default)(function (nodes) {
    return nodes.reduce(function (map, node, index) {
        map[node.id] = index;
        return map;
    }, {});
});
var createList = (0, memoize_one_1.default)(flatten_tree_1.flattenTree);
function dfs(node, id) {
    if (!node)
        return null;
    if (node.id === id)
        return node;
    if (node.children) {
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var result = dfs(child, id);
            if (result)
                return result;
        }
    }
    return null;
}
