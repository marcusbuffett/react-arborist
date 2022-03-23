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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropCursor = void 0;
var react_1 = __importDefault(require("react"));
var context_1 = require("../context");
function DropCursor() {
    var treeView = (0, context_1.useStaticContext)();
    var cursor = (0, context_1.useCursorLocation)();
    if (!cursor || cursor.type !== "line")
        return null;
    var top = treeView.rowHeight * cursor.index;
    var left = treeView.indent * cursor.level;
    var style = {
        position: "absolute",
        pointerEvents: "none",
        top: top - 2 + "px",
        left: treeView.indent + left + "px",
        right: treeView.indent + "px",
    };
    return <DefaultCursor style={style}/>;
}
exports.DropCursor = DropCursor;
var placeholderStyle = {
    display: "flex",
    alignItems: "center",
};
var lineStyle = {
    flex: 1,
    height: "2px",
    background: "#4B91E2",
    borderRadius: "1px",
};
var circleStyle = {
    width: "4px",
    height: "4px",
    boxShadow: "0 0 0 3px #4B91E2",
    borderRadius: "50%",
};
function DefaultCursor(_a) {
    var style = _a.style;
    return (<div style={__assign(__assign({}, placeholderStyle), style)}>
      <div style={__assign({}, circleStyle)}></div>
      <div style={__assign({}, lineStyle)}></div>
    </div>);
}
