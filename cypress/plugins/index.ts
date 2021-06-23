/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import { lighthouse, prepareAudit } from 'cypress-audit'

module.exports = (
  on: Cypress.PluginEvents,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: Cypress.PluginConfigOptions,
): void | Partial<Cypress.ResolvedConfigOptions> | Promise<Partial<Cypress.ResolvedConfigOptions>> => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:browser:launch', (_browser, launchOptions) => {
    prepareAudit(launchOptions)
  })

  on('task', {
    lighthouse: lighthouse(), // calling the function is important
  })
}
