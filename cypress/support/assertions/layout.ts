export function expectElementInView($element: JQuery<HTMLElement>): void {
  const element = $element[0];
  const document = element.ownerDocument;
  const viewport = document.documentElement;
  const bounds = element.getBoundingClientRect();

  expect(
    document.scrollingElement?.scrollLeft,
    'horizontal page scroll',
  ).to.equal(0);
  expect(bounds.left, 'left edge').to.be.at.least(-1);
  expect(bounds.right, 'right edge').to.be.at.most(viewport.clientWidth + 1);
  expect(bounds.top, 'top edge').to.be.at.least(-1);
  expect(bounds.bottom, 'bottom edge').to.be.at.most(viewport.clientHeight + 1);

  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const points = [
    [centerX, centerY],
    [centerX, bounds.top + 2],
    [centerX, bounds.bottom - 2],
    [bounds.left + 2, centerY],
    [bounds.right - 2, centerY],
  ];

  for (const [x, y] of points) {
    expect(
      element.contains(document.elementFromPoint(x, y)),
      `${element.id} unobstructed at (${x}, ${y})`,
    ).to.equal(true);
  }
}
