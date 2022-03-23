import memoizeOne from "memoize-one";
import { flattenTree } from "./data/flatten-tree";
import { actions } from "./reducer";
import ReactDOM from "react-dom";
export class TreeApi {
  edits = new Map();

  constructor(dispatch, state, props, list) {
    this.dispatch = dispatch;
    this.state = state;
    this.props = props;
    this.list = list;
  }

  assign(dispatch, state, props, list) {
    this.dispatch = dispatch;
    this.state = state;
    this.props = props;
    this.list = list;
  }

  getNode(id) {
    if (id in this.idToIndex) return this.visibleNodes[this.idToIndex[id]] || null;else return null;
  }

  getSelectedIds() {
    return this.state.selection.ids;
  }

  edit(id) {
    const sid = id.toString();
    this.resolveEdit(sid, {
      cancelled: true
    });
    this.scrollToId(sid);
    this.dispatch(actions.edit(sid));
    return new Promise(resolve => this.edits.set(sid, resolve));
  }

  submit(id, value) {
    const sid = id.toString();
    this.props.onEdit(sid, value);
    this.dispatch(actions.edit(null));
    this.resolveEdit(sid, {
      cancelled: false,
      value
    });
  }

  reset(id) {
    const sid = id.toString();
    this.dispatch(actions.edit(null));
    this.resolveEdit(sid, {
      cancelled: true
    });
  }

  resolveEdit(id, value) {
    const resolve = this.edits.get(id.toString());
    if (resolve) resolve(value);
    this.edits.delete(id);
  }

  select(index, meta = false, shift = false) {
    this.dispatch(actions.select(index, meta, shift));
  }

  selectById(id, meta = false, shift = false) {
    const index = this.idToIndex[id];
    this.select(index, meta, shift);
  }

  selectUpwards(shiftKey) {
    this.dispatch(actions.stepUp(shiftKey, this.visibleIds));
  }

  selectDownwards(shiftKey) {
    this.dispatch(actions.stepDown(shiftKey, this.visibleIds));
  }

  hideCursor() {
    this.dispatch(actions.setCursorLocation({
      type: "none"
    }));
  }

  showCursor(cursor) {
    this.dispatch(actions.setCursorLocation(cursor));
  }

  scrollToId(id) {
    if (!this.list) return;
    const index = this.idToIndex[id];

    if (index) {
      this.list.scrollToItem(index, "start");
    } else {
      this.openParents(id);
      ReactDOM.flushSync(() => {
        const index = this.idToIndex[id];

        if (index) {
          this.list?.scrollToItem(index, "start");
        }
      });
    }
  }

  open(id) {
    this.props.onToggle(id, true);
  }

  openParents(id) {
    const node = dfs(this.props.root, id);
    let parent = node?.parent;

    while (parent) {
      this.open(parent.id);
      parent = parent.parent;
    }
  }

  get visibleIds() {
    return getIds(this.visibleNodes);
  }

  get idToIndex() {
    return createIndex(this.visibleNodes);
  }

  get visibleNodes() {
    return createList(this.props.root);
  }

}
const getIds = memoizeOne(nodes => nodes.map(n => n.id));
const createIndex = memoizeOne(nodes => {
  return nodes.reduce((map, node, index) => {
    map[node.id] = index;
    return map;
  }, {});
});
const createList = memoizeOne(flattenTree);

function dfs(node, id) {
  if (!node) return null;
  if (node.id === id) return node;

  if (node.children) {
    for (let child of node.children) {
      const result = dfs(child, id);
      if (result) return result;
    }
  }

  return null;
}