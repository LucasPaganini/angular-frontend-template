import { skipOn } from './environments'

const LIGHTHOUSE_THRESHOLDS: Cypress.LighthouseThresholds = {
  'performance': 70,
  'accessibility': 100,
  'best-practices': 100,
  'seo': 100,
  // 'pwa': 100,

  'first-contentful-paint': 2000,
  'largest-contentful-paint': 3000,
}

export const makeAuditWithLighthouse = (setupFn: () => void) => (): void => {
  it(
    'Should pass Lighthouse audits',
    skipOn('development', () => {
      setupFn()
      cy.lighthouse(LIGHTHOUSE_THRESHOLDS)
    }),
  )
}
