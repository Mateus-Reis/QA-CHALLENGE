import type axe from 'axe-core';

export function checkAccessibility(context: HTMLElement, reportName: string) {
  return cy
    .readFile<string>('node_modules/axe-core/axe.min.js', { log: false })
    .then((source) =>
      cy.window({ log: false }).then((window) => {
        window.eval(source);

        return (window as typeof window & { axe: typeof axe }).axe.run(
          context,
          {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
            },
          },
        );
      }),
    )
    .then((results) =>
      cy
        .writeFile(
          `reports/accessibility/${reportName}.json`,
          {
            scope:
              context.id ||
              context.getAttribute('role') ||
              context.tagName.toLowerCase(),
            ...results,
          },
          { log: false },
        )
        .then(() => {
          const violations = results.violations
            .map(({ id, nodes }) => `${id} (${nodes.length} elements)`)
            .join(', ');

          expect(results.violations, `accessibility violations: ${violations}`)
            .to.be.empty;
        }),
    );
}
