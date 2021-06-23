export type EnvironmentID = 'development' | 'production' | 'staging' | 'alpha'

export interface Environment {
  environmentID: EnvironmentID
  production: boolean
  apiHost: string
}
