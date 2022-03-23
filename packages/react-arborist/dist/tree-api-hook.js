"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeApi = void 0;
var react_1 = require("react");
var reducer_1 = require("./reducer");
var tree_api_1 = require("./tree-api");
function useTreeApi(state, dispatch, props, list) {
    /**
     * We only ever want one instance of the api object
     * It will get updated as the props change, but the
     * reference will not.
     */
    var api = (0, react_1.useMemo)(function () { return new tree_api_1.TreeApi(dispatch, state, props, list); }, 
    // eslint-disable-next-line
    []);
    api.assign(dispatch, state, props, list);
    /**
     * This ensures that the selection remains correct even
     * after opening and closing a folders
     */
    (0, react_1.useLayoutEffect)(function () {
        dispatch(reducer_1.actions.setVisibleIds(api.visibleIds, api.idToIndex));
    }, [dispatch, api, props.root]);
    return api;
}
exports.useTreeApi = useTreeApi;
