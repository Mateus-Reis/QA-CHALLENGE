export function expectFocusShadow(
  $control: JQuery<HTMLElement>,
  unfocusedShadow: string,
): void {
  expect($control[0].getAnimations(), 'focus transition has finished').to.be
    .empty;
  expect($control.css('box-shadow'), 'focus shadow')
    .not.to.equal('none')
    .and.not.to.equal(unfocusedShadow);
}
