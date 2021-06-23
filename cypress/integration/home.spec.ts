/// <reference types="cypress" />

import { makeAuditWithLighthouse, skipOn } from 'cypress/utils'

describe('Home', () => {
  describe('Successfully navigates to the home page', () => {
    it('(en) english', () => {
      cy.visit('/')

      cy.title().should('equal', 'Home | TODO')
      cy.contains('h1', 'Home').should('be.visible')
    })

    it(
      '(pt) portuguese',
      skipOn('development', () => {
        cy.visit('/pt')

        cy.title().should('equal', 'Início | TODO')
        cy.contains('h1', 'Início').should('be.visible')
      }),
    )
  })

  describe(
    'Passes Lighthouse audits',
    makeAuditWithLighthouse(() => cy.visit('/contact')),
  )
})
