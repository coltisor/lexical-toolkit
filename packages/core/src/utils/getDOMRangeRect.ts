export function getDOMRangeRect(
  nativeSelection: Selection,
  rootElement: HTMLElement
): DOMRect {
  if (nativeSelection.anchorNode === rootElement) {
    let inner = rootElement;

    while (inner.firstElementChild != null) {
      inner = inner.firstElementChild as HTMLElement;
    }

    return inner.getBoundingClientRect();
  }

  const domRange = nativeSelection.getRangeAt(0);
  return domRange.getBoundingClientRect();
}
