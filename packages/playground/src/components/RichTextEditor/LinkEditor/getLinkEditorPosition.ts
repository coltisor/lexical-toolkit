const VERTICAL_GAP = 8;
const HORIZONTAL_OFFSET = -8;

type paramsType = {
  linkNodeRect: DOMRect;
  anchorElem: HTMLElement;
  verticalGap?: number;
  horizontalOffset?: number;
};

export function getLinkEditorPosition(params: paramsType) {
  const {
    linkNodeRect,
    anchorElem,
    verticalGap = VERTICAL_GAP,
    horizontalOffset = HORIZONTAL_OFFSET,
  } = params;

  const scrollerElem = anchorElem.parentElement;
  if (!scrollerElem || getComputedStyle(scrollerElem).position !== "relative") {
    console.error(
      "getFloatingElemPositionForLinkEditor: scroller element is not found or is not relative positioned. In order for the helper to work, you need to wrap the editor in a scroller div with relative position.",
    );
    return { x: "-10000px", y: "-10000px" };
  }

  const anchorElementRect = anchorElem.getBoundingClientRect();

  let y = linkNodeRect.top + linkNodeRect.height + verticalGap;
  let x = linkNodeRect.left + horizontalOffset;

  y -= anchorElementRect.top;
  x -= anchorElementRect.left;

  return { x: Math.round(x), y: Math.round(y) };
}
