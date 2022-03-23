"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelectionKeys = void 0;
var react_1 = require("react");
function useSelectionKeys(ref, api) {
    (0, react_1.useEffect)(function () {
        var el = ref.current;
        var cb = function (e) {
            if (e.code === "ArrowDown") {
                e.preventDefault();
                api.selectDownwards(e.shiftKey);
            }
            else if (e.code === "ArrowUp") {
                e.preventDefault();
                api.selectUpwards(e.shiftKey);
            }
        };
        el === null || el === void 0 ? void 0 : el.addEventListener("keydown", cb);
        return function () {
            el === null || el === void 0 ? void 0 : el.removeEventListener("keydown", cb);
        };
    }, [ref, api]);
}
exports.useSelectionKeys = useSelectionKeys;
