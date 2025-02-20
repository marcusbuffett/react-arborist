import { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useIsSelected, useSelectedIds, useStaticContext } from "../context";
export function useDragHook(node) {
  const tree = useStaticContext();
  const isSelected = useIsSelected();
  const ids = useSelectedIds();
  const [{
    isDragging
  }, ref, preview] = useDrag(() => ({
    canDrag: () => node.isDraggable,
    type: "NODE",
    item: () => ({
      id: node.id,
      dragIds: isSelected(node.rowIndex) ? ids : [node.id]
    }),
    collect: m => ({
      isDragging: m.isDragging()
    }),
    end: (item, monitor) => {
      tree.api.hideCursor();
      const drop = monitor.getDropResult();

      if (drop && drop.parentId) {
        tree.onMove(item.dragIds, drop.parentId, drop.index);
        tree.onToggle(drop.parentId, true);
      }
    }
  }), [ids, node]);
  useEffect(() => {
    preview(getEmptyImage());
  }, [preview]);
  return [{
    isDragging
  }, ref];
}