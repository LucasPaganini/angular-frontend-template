const ENVIRONMENT_IDS = new Set(['development', 'staging'] as const)
type ExtractSet<T extends Set<any>> = T extends Set<infer K> ? K : never
export type EnvironmentID = ExtractSet<typeof ENVIRONMENT_IDS>

type AssertEnvironmentID = (v: unknown) => asserts v is EnvironmentID
const assertEnvironmentID: AssertEnvironmentID = (v: unknown): asserts v is EnvironmentID => {
  if (typeof v !== 'string') throw Error(`Invalid Cypress environment, it's not a string`)
  if (ENVIRONMENT_IDS.has(v as any) === false) throw Error(`Invalid Cypress environment "${v}"`)
}

export const getEnvironmentID = (): EnvironmentID => {
  const environmentID = Cypress.env('env_id')
  assertEnvironmentID(environmentID)
  return environmentID
}

export const runOn = (environment: EnvironmentID | Array<EnvironmentID>, specFn: () => void): Mocha.Func =>
  function (): any {
    const environmentID = getEnvironmentID()
    const allowedEnvironments: Array<EnvironmentID> = Array.isArray(environment) ? environment : [environment]
    if (allowedEnvironments.includes(environmentID) === false) return this.skip()
    specFn()
  }

export const skipOn = (environment: EnvironmentID | Array<EnvironmentID>, specFn: () => void): Mocha.Func =>
  function (): any {
    const environmentID = getEnvironmentID()
    const skippedEnvironments: Array<EnvironmentID> = Array.isArray(environment) ? environment : [environment]
    if (skippedEnvironments.includes(environmentID)) return this.skip()
    specFn()
  }
